import { RangeIterable }  from './util/RangeIterable.js';
import { getAddress, Cursor, Txn, orderedBinary, lmdbError, getByBinary, setGlobalBuffer, prefetch, iterate, position as doPosition, resetTxn, getCurrentValue, getCurrentShared, getStringByBinary, globalBuffer, getSharedBuffer, startRead, setReadCallback } from './native.js';
import { saveKey }  from './keys.js';
const IF_EXISTS = 3.542694326329068e-103;
const ITERATOR_DONE = { done: true, value: undefined };
const Uint8ArraySlice = Uint8Array.prototype.slice;
let getValueBytes = globalBuffer;
if (!getValueBytes.maxLength) {
	getValueBytes.maxLength = getValueBytes.length;
	getValueBytes.isGlobal = true;
	Object.defineProperty(getValueBytes, 'length', { value: getValueBytes.length, writable: true, configurable: true });
}
const START_ADDRESS_POSITION = 4064;
const NEW_BUFFER_THRESHOLD = 0x8000;
const SOURCE_SYMBOL = Symbol.for('source');
export const UNMODIFIED = {};
let mmaps = [];

export function addReadMethods(LMDBStore, {
	maxKeySize, env, keyBytes, keyBytesView, getLastVersion, getLastTxnId
}) {
	let readTxn, readTxnRenewed, asSafeBuffer = false;
	let renewId = 1;
	let outstandingReads = 0;
	Object.assign(LMDBStore.prototype, {
		getString(id, options) {
			let txn = env.writeTxn || (options && options.transaction) || (readTxnRenewed ? readTxn : renewReadTxn(this));
			let string = getStringByBinary(this.dbAddress, this.writeKey(id, keyBytes, 0), txn.address || 0);
			if (typeof string === 'number') { // indicates the buffer wasn't large enough
				this._allocateGetBuffer(string);
				// and then try again
				string = getStringByBinary(this.dbAddress, this.writeKey(id, keyBytes, 0), txn.address || 0);
			}
			if (string)
				this.lastSize = string.length;
			return string;
		},
		getBinaryFast(id, options) {
			let rc;
			let txn = env.writeTxn || (options && options.transaction) || (readTxnRenewed ? readTxn : renewReadTxn(this));
			rc = this.lastSize = getByBinary(this.dbAddress, this.writeKey(id, keyBytes, 0), (options && options.ifNotTxnId) || 0, txn.address || 0);
			if (rc < 0) {
				if (rc == -30798) // MDB_NOTFOUND
					return; // undefined
				if (rc == -30004) // txn id matched
					return UNMODIFIED;
				if (rc == -30781 /*MDB_BAD_VALSIZE*/ && this.writeKey(id, keyBytes, 0) == 0)
					throw new Error(id === undefined ?
					'A key is required for get, but is undefined' :
					'Zero length key is not allowed in LMDB');
				if (rc == -30000) // int32 overflow, read uint32
					rc = this.lastSize = keyBytesView.getUint32(0, true);
				else if (rc == -30001) {// shared buffer
					this.lastSize = keyBytesView.getUint32(0, true);
					let bufferId = keyBytesView.getUint32(4, true);
					return getMMapBuffer(bufferId, this.lastSize);
				} else
					throw lmdbError(rc);
			}
			let compression = this.compression;
			let bytes = compression ? compression.getValueBytes : getValueBytes;
			if (rc > bytes.maxLength) {
				// this means the target buffer wasn't big enough, so the get failed to copy all the data from the database, need to either grow or use special buffer
				return this._returnLargeBuffer(
					() => getByBinary(this.dbAddress, this.writeKey(id, keyBytes, 0), 0, txn.address || 0));
			}
			bytes.length = this.lastSize;
			return bytes;
		},
		getBFAsync(id, options, callback) {
			let txn = env.writeTxn || (options && options.transaction) || (readTxnRenewed ? readTxn : renewReadTxn(this));
			txn.refCount = (txn.refCount || 0) + 1;
			outstandingReads++;
			let address = recordReadInstruction(txn.address, this.db.dbi, id, this.writeKey, maxKeySize, ( rc, bufferId, offset, size ) => {
				if (rc && rc !== 1)
					callback(lmdbError(rc));
				outstandingReads--;
				let buffer = mmaps[bufferId];
				if (!buffer) {
					buffer = mmaps[bufferId] = getSharedBuffer(bufferId, env.address);
				}
				//console.log({bufferId, offset, size})
				if (buffer.isSharedMap) {
					// using LMDB shared memory
					// TODO: We may want explicit support for clearing aborting the transaction on the next event turn,
					// but for now we are relying on the GC to cleanup transaction for larger blocks of memory
					let bytes = new Uint8Array(buffer, offset, size);
					bytes.txn = txn;
					callback(bytes, 0, size);
				} else {
					// using copied memory
					txn.done(); // decrement and possibly abort
					callback(buffer, offset, size);
				}
			});
			if (address) {
				startRead(address, () => {
					resolveReads();
				});
			}
		},
		getAsync(id, options, callback) {
			let promise;
			if (!callback)
				promise = new Promise(resolve => callback = resolve);
			this.getBFAsync(id, options, (buffer, offset, size) => {
				if (this.useVersions) {
					// TODO: And get the version
					offset += 8;
					size -= 8;
				}
				let bytes = new Uint8Array(buffer, offset, size);
				let value;
				if (this.decoder) {
					// the decoder potentially uses the data from the buffer in the future and needs a stable buffer
					value = bytes && this.decoder.decode(bytes);
				} else if (this.encoding == 'binary') {
					value = bytes;
				} else {
					value = Buffer.prototype.utf8Slice.call(bytes, 0, size);
					if (this.encoding == 'json' && value)
						value = JSON.parse(value);
				}
				callback(value);
			});
			return promise;
		},
		retain(data, options) {
			if (!data)
				return
			let source = data[SOURCE_SYMBOL];
			let buffer = source ? source.bytes : data;
			if (!buffer.isGlobal && !env.writeTxn) {
				let txn = options?.transaction || (readTxnRenewed ? readTxn : renewReadTxn(this));
				buffer.txn = txn;
				txn.refCount = (txn.refCount || 0) + 1;
				return data;
			} else {
				buffer = Uint8ArraySlice.call(buffer, 0, this.lastSize);
				if (source) {
					source.bytes = buffer;
					return data;
				} else
					return buffer;
			}
		},
		_returnLargeBuffer(getFast) {
			let bytes;
			let compression = this.compression;
			if (asSafeBuffer && this.lastSize > NEW_BUFFER_THRESHOLD) {
				// used by getBinary to indicate it should create a dedicated buffer to receive this
				let bytesToRestore
				try {
					if (compression) {
						bytesToRestore = compression.getValueBytes;
						let dictionary = compression.dictionary || [];
						let dictLength = (dictionary.length >> 3) << 3;// make sure it is word-aligned
						bytes = makeReusableBuffer(this.lastSize);
						compression.setBuffer(bytes.buffer, bytes.byteOffset, this.lastSize, dictionary, dictLength);
						compression.getValueBytes = bytes;
					} else {
						bytesToRestore = getValueBytes;
						setGlobalBuffer(bytes = getValueBytes = makeReusableBuffer(this.lastSize));
					}
					getFast();
				} finally {
					if (compression) {
						let dictLength = (compression.dictionary.length >> 3) << 3;
						compression.setBuffer(bytesToRestore.buffer, bytesToRestore.byteOffset, bytesToRestore.maxLength, compression.dictionary, dictLength);
						compression.getValueBytes = bytesToRestore;
					} else {
						setGlobalBuffer(bytesToRestore);
						getValueBytes = bytesToRestore;
					}
				}
				return bytes;
			}
			// grow our shared/static buffer to accomodate the size of the data
			bytes = this._allocateGetBuffer(this.lastSize);
			// and try again
			getFast();
			bytes.length = this.lastSize;
			return bytes;
		},
		_allocateGetBuffer(lastSize) {
			let newLength = Math.min(Math.max(lastSize * 2, 0x1000), 0xfffffff8);
			let bytes;
			if (this.compression) {
				let dictionary = this.compression.dictionary || Buffer.allocUnsafeSlow(0);
				let dictLength = (dictionary.length >> 3) << 3;// make sure it is word-aligned
				bytes = Buffer.allocUnsafeSlow(newLength + dictLength);
				bytes.set(dictionary) // copy dictionary into start
				// the section after the dictionary is the target area for get values
				bytes = bytes.subarray(dictLength);
				this.compression.setBuffer(bytes.buffer, bytes.byteOffset, newLength, dictionary, dictLength);
				bytes.maxLength = newLength;
				Object.defineProperty(bytes, 'length', { value: newLength, writable: true, configurable: true });
				this.compression.getValueBytes = bytes;
			} else {
				bytes = makeReusableBuffer(newLength);
				setGlobalBuffer(getValueBytes = bytes);
			}
			bytes.isGlobal = true;
			return bytes;
		},
		getBinary(id, options) {
			try {
				asSafeBuffer = true;
				let fastBuffer = this.getBinaryFast(id, options);
				return fastBuffer && (fastBuffer.isGlobal ? Uint8ArraySlice.call(fastBuffer, 0, this.lastSize) : fastBuffer);
			} finally {
				asSafeBuffer = false;
			}
		},
		getSharedBinary(id, options) {
			let fastBuffer = this.getBinaryFast(id, options);
			if (fastBuffer) {
				if (fastBuffer.isGlobal || writeTxn)
					return Uint8ArraySlice.call(fastBuffer, 0, this.lastSize)
				fastBuffer.txn = (options && options.transaction);
				options.transaction.refCount = (options.transaction.refCount || 0) + 1;
				return fastBuffer;
			}
		},
		get(id, options) {
			if (this.decoderCopies) {
				// the decoder copies any data, so we can use the fast binary retrieval that overwrites the same buffer space
				let bytes = this.getBinaryFast(id, options);
				return bytes && (bytes == UNMODIFIED ? UNMODIFIED : this.decoder.decode(bytes, options));
			}
			if (this.encoding == 'binary')
				return this.getBinary(id, options);
			if (this.decoder) {
				// the decoder potentially uses the data from the buffer in the future and needs a stable buffer
				let bytes = this.getBinary(id, options);
				return bytes && (bytes == UNMODIFIED ? UNMODIFIED : this.decoder.decode(bytes));
			}

			let result = this.getString(id, options);
			if (result) {
				if (this.encoding == 'json')
					return JSON.parse(result);
			}
			return result;
		},
		getEntry(id, options) {
			let value = this.get(id, options);
			if (value !== undefined) {
				if (this.useVersions)
					return {
						value,
						version: getLastVersion(),
						//size: this.lastSize
					};
				else
					return {
						value,
						//size: this.lastSize
					};
			}
		},
		resetReadTxn() {
			resetReadTxn();
		},
		_commitReadTxn() {
			if (readTxn) {
				readTxn.isCommitted = true
				readTxn.commit();
			}
			lastReadTxnRef = null;
			readTxnRenewed = null;
			readTxn = null;
		},
		ensureReadTxn() {
			if (!env.writeTxn && !readTxnRenewed)
				renewReadTxn(this);
		},
		doesExist(key, versionOrValue) {
			if (versionOrValue == null) {
				// undefined means the entry exists, null is used specifically to check for the entry *not* existing
				return (this.getBinaryFast(key) === undefined) == (versionOrValue === null);
			}
			else if (this.useVersions) {
				return this.getBinaryFast(key) !== undefined && (versionOrValue === IF_EXISTS || getLastVersion() === versionOrValue);
			}
			else {
				if (versionOrValue && versionOrValue['\x10binary-data\x02'])
					versionOrValue = versionOrValue['\x10binary-data\x02'];
				else if (this.encoder)
					versionOrValue = this.encoder.encode(versionOrValue);
				if (typeof versionOrValue == 'string')
					versionOrValue = Buffer.from(versionOrValue);
				return this.getValuesCount(key, { start: versionOrValue, exactMatch: true}) > 0;
			}
		},
		getValues(key, options) {
			let defaultOptions = {
				key,
				valuesForKey: true
			};
			if (options && options.snapshot === false)
				throw new Error('Can not disable snapshots for getValues');
			return this.getRange(options ? Object.assign(defaultOptions, options) : defaultOptions);
		},
		getKeys(options) {
			if (!options)
				options = {};
			options.values = false;
			return this.getRange(options);
		},
		getCount(options) {
			if (!options)
				options = {};
			options.onlyCount = true;
			return this.getRange(options).iterate();
		},
		getKeysCount(options) {
			if (!options)
				options = {};
			options.onlyCount = true;
			options.values = false;
			return this.getRange(options).iterate();
		},
		getValuesCount(key, options) {
			if (!options)
				options = {};
			options.key = key;
			options.valuesForKey = true;
			options.onlyCount = true;
			return this.getRange(options).iterate();
		},
		getRange(options) {
			let iterable = new RangeIterable();
			if (!options)
				options = {};
			let includeValues = options.values !== false;
			let includeVersions = options.versions;
			let valuesForKey = options.valuesForKey;
			let limit = options.limit;
			let db = this.db;
			let snapshot = options.snapshot;
			let compression = this.compression;
			iterable.iterate = () => {
				let currentKey = valuesForKey ? options.key : options.start;
				const reverse = options.reverse;
				let count = 0;
				let cursor, cursorRenewId, cursorAddress;
				let txn;
				let flags = (includeValues ? 0x100 : 0) | (reverse ? 0x400 : 0) |
					(valuesForKey ? 0x800 : 0) | (options.exactMatch ? 0x4000 : 0) |
					(options.inclusiveEnd ? 0x8000 : 0) |
					(options.exclusiveStart ? 0x10000 : 0);
				let store = this;
				function resetCursor() {
					try {
						if (cursor)
							finishCursor();
						let txnAddress;
						txn = options.transaction
						if (txn) {
							if (txn.isDone) throw new Error('Can not iterate on range with transaction that is already' +
								' done');
							txnAddress = txn.address;
							cursor = null;
						} else {
							let writeTxn = env.writeTxn;
							if (writeTxn)
								snapshot = false;
							txn = env.writeTxn || options.transaction || (readTxnRenewed ? readTxn : renewReadTxn(store));
							cursor = !writeTxn && db.availableCursor;
						}
						if (cursor) {
							db.availableCursor = null;
							flags |= 0x2000;
						} else {
							cursor = new Cursor(db, txnAddress || 0);
						}
						cursorAddress = cursor.address;
						txn.refCount = (txn.refCount || 0) + 1; // track transaction so we always use the same one
						if (snapshot === false) {
							cursorRenewId = renewId; // use shared read transaction
							txn.renewingRefCount = (txn.renewingRefCount || 0) + 1; // need to know how many are renewing cursors
						}
					} catch(error) {
						if (cursor) {
							try {
								cursor.close();
							} catch(error) { }
						}
						throw error;
					}
				}
				resetCursor();
				if (options.onlyCount) {
					flags |= 0x1000;
					let count = position(options.offset);
					if (count < 0)
						lmdbError(count);
					finishCursor();
					return count;
				}
				function position(offset) {
					if (!env.address) {
						throw new Error('Can not iterate on a closed database');
					}
					let keySize = currentKey === undefined ? 0 : store.writeKey(currentKey, keyBytes, 0);
					let endAddress;
					if (valuesForKey) {
						if (options.start === undefined && options.end === undefined)
							endAddress = 0;
						else {
							let startAddress;
							if (store.encoder.writeKey) {
								startAddress = saveKey(options.start, store.encoder.writeKey, iterable, maxKeySize);
								keyBytesView.setFloat64(START_ADDRESS_POSITION, startAddress, true);
								endAddress = saveKey(options.end, store.encoder.writeKey, iterable, maxKeySize);
							} else if ((!options.start || options.start instanceof Uint8Array) && (!options.end || options.end instanceof Uint8Array)) {
								startAddress = saveKey(options.start, orderedBinary.writeKey, iterable, maxKeySize);
								keyBytesView.setFloat64(START_ADDRESS_POSITION, startAddress, true);
								endAddress = saveKey(options.end, orderedBinary.writeKey, iterable, maxKeySize);
							} else {
								throw new Error('Only key-based encoding is supported for start/end values');
								let encoded = store.encoder.encode(options.start);
								let bufferAddress = encoded.buffer.address || (encoded.buffer.address = getAddress(encoded.buffer) - encoded.byteOffset);
								startAddress = bufferAddress + encoded.byteOffset;
							}
						}
					} else
						endAddress = saveKey(options.end, store.writeKey, iterable, maxKeySize);
					return doPosition(cursorAddress, flags, offset || 0, keySize, endAddress);
				}

				function finishCursor() {
					if (txn.isDone)
						return;
					if (iterable.onDone)
						iterable.onDone()
					if (cursorRenewId)
						txn.renewingRefCount--;
					if (--txn.refCount <= 0 && txn.notCurrent) {
						cursor.close();
						txn.abort(); // this is no longer main read txn, abort it now that we are done
						txn.isDone = true;
					} else {
						if (db.availableCursor || txn != readTxn) {
							cursor.close();
						} else { // try to reuse it
							db.availableCursor = cursor;
							db.cursorTxn = txn;
						}
					}
				}
				return {
					next() {
						let keySize, lastSize;
						if (cursorRenewId && (cursorRenewId != renewId || txn.isDone)) {
							resetCursor();
							keySize = position(0);
						}
						if (count === 0) { // && includeValues) // on first entry, get current value if we need to
							keySize = position(options.offset);
						} else
							keySize = iterate(cursorAddress);
						if (keySize <= 0 ||
								(count++ >= limit)) {
							if (count < 0)
								lmdbError(count);
							finishCursor();
							return ITERATOR_DONE;
						}
						if (!valuesForKey || snapshot === false) {
							if (keySize > 20000) {
								if (keySize > 0x1000000)
									lmdbError(keySize - 0x100000000)
								throw new Error('Invalid key size ' + keySize.toString(16))
							}
							currentKey = store.readKey(keyBytes, 32, keySize + 32);
						}
						if (includeValues) {
							let value;
							lastSize = keyBytesView.getUint32(0, true);
							let bufferId = keyBytesView.getUint32(4, true);
							let bytes;
							if (bufferId) {
								bytes = getMMapBuffer(bufferId, lastSize);
							} else {
								bytes = compression ? compression.getValueBytes : getValueBytes;
								if (lastSize > bytes.maxLength) {
									store.lastSize = lastSize;
									asSafeBuffer = store.encoding == 'binary';
									try {
										bytes = store._returnLargeBuffer(() => getCurrentValue(cursorAddress));
									} finally {
										asSafeBuffer = false;
									}
								} else
									bytes.length = lastSize;
							}
							if (store.decoder) {
								value = store.decoder.decode(bytes, lastSize);
							} else if (store.encoding == 'binary')
								value = bytes.isGlobal ? Uint8ArraySlice.call(bytes, 0, lastSize) : bytes;
							else {
								value = bytes.toString('utf8', 0, lastSize);
								if (store.encoding == 'json' && value)
									value = JSON.parse(value);
							}
							if (includeVersions)
								return {
									value: {
										key: currentKey,
										value,
										version: getLastVersion()
									}
								};
 							else if (valuesForKey)
								return {
									value
								};
							else
								return {
									value: {
										key: currentKey,
										value,
									}
								};
						} else if (includeVersions) {
							return {
								value: {
									key: currentKey,
									version: getLastVersion()
								}
							};
						} else {
							return {
								value: currentKey
							};
						}
					},
					return() {
						finishCursor();
						return ITERATOR_DONE;
					},
					throw() {
						finishCursor();
						return ITERATOR_DONE;
					}
				};
			};
			return iterable;
		},

		getMany(keys, callback) {
			// this is an asynchronous get for multiple keys. It actually works by prefetching asynchronously,
			// allowing a separate to absorb the potentially largest cost: hard page faults (and disk I/O).
			// And then we just do standard sync gets (to deserialized data) to fulfil the callback/promise
			// once the prefetch occurs
			let promise = callback ? undefined : new Promise(resolve => callback = (error, results) => resolve(results));
			this.prefetch(keys, () => {
				let results = new Array(keys.length);
				for (let i = 0, l = keys.length; i < l; i++) {
					results[i] = get.call(this, keys[i]);
				}
				callback(null, results);
			});
			return promise;
		},
		getSharedBufferForGet(id, options) {
			let txn = env.writeTxn || (options && options.transaction) || (readTxnRenewed ? readTxn : renewReadTxn(this));
			this.lastSize = this.keyIsCompatibility ? txn.getBinaryShared(id) : this.db.get(this.writeKey(id, keyBytes, 0));
			if (this.lastSize === -30798) { // not found code
				return; //undefined
			}
			return this.lastSize;
			this.lastSize = keyBytesView.getUint32(0, true);
			let bufferIndex = keyBytesView.getUint32(12, true);
			lastOffset = keyBytesView.getUint32(8, true);
			let buffer = buffers[bufferIndex];
			let startOffset;
			if (!buffer || lastOffset < (startOffset = buffer.startOffset) || (lastOffset + this.lastSize > startOffset + 0x100000000)) {
				if (buffer)
					env.detachBuffer(buffer.buffer);
				startOffset = (lastOffset >>> 16) * 0x10000;
				console.log('make buffer for address', bufferIndex * 0x100000000 + startOffset);
				buffer = buffers[bufferIndex] = Buffer.from(getBufferForAddress(bufferIndex * 0x100000000 + startOffset));
				buffer.startOffset = startOffset;
			}
			lastOffset -= startOffset;
			return buffer;
			return buffer.slice(lastOffset, lastOffset + this.lastSize);/*Uint8ArraySlice.call(buffer, lastOffset, lastOffset + this.lastSize)*/
		},
		prefetch(keys, callback) {
			if (!keys)
				throw new Error('An array of keys must be provided');
			if (!keys.length) {
				if (callback) {
					callback(null);
					return;
				} else
					return Promise.resolve();
			}
			let buffers = [];
			let startPosition;
			let bufferHolder = {};
			let lastBuffer;
			for (let key of keys) {
				let position
				if (key && key.key !== undefined && key.value !== undefined) {
					position = saveKey(key.value, this.writeKey, bufferHolder, maxKeySize, 0x80000000);
					saveKey(key.key, this.writeKey, bufferHolder, maxKeySize);
				} else {
					position = saveKey(key, this.writeKey, bufferHolder, maxKeySize);
				}
				if (!startPosition)
					startPosition = position;
				if (bufferHolder.saveBuffer != lastBuffer) {
					buffers.push(bufferHolder);
					lastBuffer = bufferHolder.saveBuffer;
					bufferHolder = { saveBuffer: lastBuffer };
				}
			}
			saveKey(undefined, this.writeKey, bufferHolder, maxKeySize);
			outstandingReads++;
			prefetch(this.dbAddress, startPosition, (error) => {
				outstandingReads--;
				if (error)
					console.error('Error with prefetch', buffers, bufferHolder); // partly exists to keep the buffers pinned in memory
				else
					callback(null);
			});
			if (!callback)
				return new Promise(resolve => callback = resolve);
		},
		useReadTransaction() {
			let txn = readTxnRenewed ? readTxn : renewReadTxn(this);
			if (!txn.use) {
				throw new Error('Can not use read transaction from a closed database');
			}
			txn.use();
			return txn;
		},
		close(callback) {
			this.status = 'closing';
			let txnPromise;
			if (this.isRoot) {
				// if it is root, we need to abort and/or wait for transactions to finish
				if (readTxn) readTxn.abort();
				else readTxn = {};
				readTxn.isDone = true;
				Object.defineProperty(readTxn,'renew', {
					value: () => {
						throw new Error('Can not read from a closed database');
					}, configurable: true
				});
				Object.defineProperty(readTxn,'use', {
					value: () => {
						throw new Error('Can not read from a closed database');
					}, configurable: true
				});
				readTxnRenewed = null;
				txnPromise = this._endWrites && this._endWrites();
			}
			const doClose = () => {
				if (this.isRoot) {
					if (outstandingReads > 0) {
						return new Promise(resolve => setTimeout(() => resolve(doClose()), 1));
					}
					env.address = 0;
					env.close();
				} else
					this.db.close();
				this.status = 'closed';
				if (callback)
					callback();
			}
			if (txnPromise)
				return txnPromise.then(doClose);
			else {
				doClose();
				return Promise.resolve();
			}
		},
		getStats() {
			let txn = env.writeTxn || (readTxnRenewed ? readTxn : renewReadTxn(this));
			let dbStats = this.db.stat();
			dbStats.root = env.stat();
			Object.assign(dbStats, env.info());
			dbStats.free = env.freeStat();
			return dbStats;
		},
	});
	let get = LMDBStore.prototype.get;
	let lastReadTxnRef;
	function getMMapBuffer(bufferId, size) {
		let buffer = mmaps[bufferId];
		if (!buffer) {
			buffer = mmaps[bufferId] = getSharedBuffer(bufferId, env.address);
		}
		let offset = keyBytesView.getUint32(8, true);
		return new Uint8Array(buffer, offset, size);
	}
	function renewReadTxn(store) {
		if (!env.address) {
			throw new Error('Can not renew a transaction from a closed database');
		}
		if (!readTxn) {
			let retries = 0;
			let waitArray;
			do {
				try {
					let lastReadTxn = lastReadTxnRef && lastReadTxnRef.deref();
					readTxn = new Txn(env, 0x20000, lastReadTxn && !lastReadTxn.isDone && lastReadTxn);
					if (readTxn.address == 0) {
						readTxn = lastReadTxn;
						if (readTxn.notCurrent)
							readTxn.notCurrent = false;
					}
					break;
				} catch (error) {
					if (error.message.includes('temporarily')) {
						if (!waitArray)
							waitArray = new Int32Array(new SharedArrayBuffer(4), 0, 1);
						Atomics.wait(waitArray, 0, 0, retries * 2);
					} else
						throw error;
				}
			} while (retries++ < 100);
		}
		// we actually don't renew here, we let the renew take place in the next 
		// lmdb native read/call so as to avoid an extra native call
		readTxnRenewed = setTimeout(resetReadTxn, 0);
		store.emit('begin-transaction');
		return readTxn;
	}
	function resetReadTxn() {
		renewId++;
		if (readTxnRenewed) {
			readTxnRenewed = null;
			if (readTxn.refCount - (readTxn.renewingRefCount || 0) > 0) {
				readTxn.notCurrent = true;
				lastReadTxnRef = new WeakRef(readTxn);
				readTxn = null;
			} else if (readTxn.address && !readTxn.isDone) {
				resetTxn(readTxn.address);
			} else {
				console.warn('Attempt to reset an invalid read txn', readTxn);
				throw new Error('Attempt to reset an invalid read txn');
			}
		}
	}
}
export function makeReusableBuffer(size) {
	let bytes = typeof Buffer != 'undefined' ? Buffer.alloc(size) : new Uint8Array(size);
	bytes.maxLength = size;
	Object.defineProperty(bytes, 'length', { value: size, writable: true, configurable: true });
	return bytes;
}

Txn.prototype.done = function() {
	this.refCount--;
	if (this.refCount === 0 && this.notCurrent) {
		this.abort();
		this.isDone = true;
	}
}
Txn.prototype.use = function() {
	this.refCount = (this.refCount || 0) + 1;
}


let readInstructions, readCallbacks = new Map(), uint32Instructions, instructionsDataView = { setFloat64() {}, setUint32() {} }, instructionsAddress;
let savePosition = 8000;
let DYNAMIC_KEY_BUFFER_SIZE = 8192;
function allocateInstructionsBuffer() {
	readInstructions = typeof Buffer != 'undefined' ? Buffer.alloc(DYNAMIC_KEY_BUFFER_SIZE) : new Uint8Array(DYNAMIC_KEY_BUFFER_SIZE);
	uint32Instructions = new Int32Array(readInstructions.buffer, 0, readInstructions.buffer.byteLength >> 2);
	uint32Instructions[2] = 0xf0000000; // indicates a new read task must be started
	instructionsAddress = readInstructions.buffer.address = getAddress(readInstructions.buffer);
	readInstructions.dataView = instructionsDataView = new DataView(readInstructions.buffer, readInstructions.byteOffset, readInstructions.byteLength);
	savePosition = 0;
}
export function recordReadInstruction(txnAddress, dbi, key, writeKey, maxKeySize, callback) {
	if (savePosition > 7800) {
		allocateInstructionsBuffer();
	}
	let start = savePosition;
	let keyPosition = savePosition + 16;
	try {
		savePosition = key === undefined ? keyPosition :
			writeKey(key, readInstructions, keyPosition);
	} catch (error) {
		if (error.name == 'RangeError') {
			if (8180 - start < maxKeySize) {
				allocateInstructionsBuffer(); // try again:
				return recordReadInstruction(txnAddress, dbi, key, writeKey, maxKeySize, callback);
			}
			throw new Error('Key was too large, max key size is ' + maxKeySize);
		} else
			throw error;
	}
	let length = savePosition - keyPosition;
	if (length > maxKeySize) {
		savePosition = start;
		throw new Error('Key of size ' + length + ' was too large, max key size is ' + maxKeySize);
	}
	uint32Instructions[(start >> 2) + 3] = length; // save the length
	uint32Instructions[(start >> 2) + 2] = dbi;
	savePosition = (savePosition + 12) & 0xfffffc;
	instructionsDataView.setFloat64(start, txnAddress, true);
	let callbackId = addReadCallback(() => {
		let position = start >> 2;
		let rc = thisInstructions[position];
		callback(rc, thisInstructions[position + 1], thisInstructions[position + 2], thisInstructions[position + 3]);
	});
	let thisInstructions = uint32Instructions;
	//if (start === 0)
		return startRead(instructionsAddress + start, callbackId, {}, 'read');
	//else
		//nextRead(start);
}
let nextCallbackId = 0;
let addReadCallback = globalThis.__lmdb_read_callback;
if (!addReadCallback) {
	addReadCallback = globalThis.__lmdb_read_callback = function(callback) {
		let callbackId = nextCallbackId++;
		readCallbacks.set(callbackId, callback);
		return callbackId;
	};
	setReadCallback(function(callbackId) {
		readCallbacks.get(callbackId)();
		readCallbacks.delete(callbackId);
	})
}
