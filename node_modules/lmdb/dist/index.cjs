'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var module$1 = require('module');
var pathModule = require('path');
var url = require('url');
var loadNAPI = require('node-gyp-build-optional-packages');
var events = require('events');
var os$1 = require('os');
var fs$1 = require('fs');
var msgpackr = require('msgpackr');
var weakLruCache = require('weak-lru-cache');
var orderedBinary$1 = require('ordered-binary');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
	if (e && e.__esModule) return e;
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	}
	n["default"] = e;
	return Object.freeze(n);
}

var pathModule__default = /*#__PURE__*/_interopDefaultLegacy(pathModule);
var loadNAPI__default = /*#__PURE__*/_interopDefaultLegacy(loadNAPI);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs$1);
var orderedBinary__namespace = /*#__PURE__*/_interopNamespace(orderedBinary$1);

let Env, Txn, Dbi, Compression, Cursor, getAddress, getBufferAddress; exports.clearKeptObjects = void 0; let globalBuffer, setGlobalBuffer, arch, fs, os, tmpdir, lmdbError, path, EventEmitter, orderedBinary, MsgpackrEncoder, WeakLRUCache, getByBinary, startRead, setReadCallback, write, position, iterate, prefetch, resetTxn, getCurrentValue, getStringByBinary, getSharedBuffer, compress;
path = pathModule__default["default"];
let dirName = pathModule.dirname(url.fileURLToPath((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('index.cjs', document.baseURI).href)))).replace(/dist$/, '');
let nativeAddon = loadNAPI__default["default"](dirName);

if (process.isBun && false) {
	const { linkSymbols, FFIType } = require('bun:ffi');
	let lmdbLib = linkSymbols({
		getByBinary: {
			args: [FFIType.f64, FFIType.u32],
			returns: FFIType.u32,
			ptr: nativeAddon.getByBinaryPtr
		},
		iterate: {
			args: [FFIType.f64],
			returns: FFIType.i32,
			ptr: nativeAddon.iteratePtr,
		},
		position: {
			args: [FFIType.f64, FFIType.u32, FFIType.u32, FFIType.u32, FFIType.f64],
			returns: FFIType.i32,
			ptr: nativeAddon.positionPtr,
		},
		write: {
			args: [FFIType.f64, FFIType.f64],
			returns: FFIType.i32,
			ptr: nativeAddon.writePtr,
		},
		resetTxn: {
			args: [FFIType.f64],
			returns: FFIType.void,
			ptr: nativeAddon.resetTxnPtr,
		}
	});
	for (let key in lmdbLib.symbols) {
		nativeAddon[key] = lmdbLib.symbols[key].native;
	}
}
setNativeFunctions(nativeAddon);
	
function setNativeFunctions(externals) {
	Env = externals.Env;
	Txn = externals.Txn;
	Dbi = externals.Dbi;
	Compression = externals.Compression;
	getAddress = externals.getAddress;
	getBufferAddress = externals.getBufferAddress;
	externals.createBufferForAddress;
	exports.clearKeptObjects = externals.clearKeptObjects || function() {};
	getByBinary = externals.getByBinary;
	externals.detachBuffer;
	startRead = externals.startRead;
	setReadCallback = externals.setReadCallback;
	setGlobalBuffer = externals.setGlobalBuffer;
	globalBuffer = externals.globalBuffer;
	getSharedBuffer = externals.getSharedBuffer;
	prefetch = externals.prefetch;
	iterate = externals.iterate;
	position = externals.position;
	resetTxn = externals.resetTxn;
	getCurrentValue = externals.getCurrentValue;
	externals.getCurrentShared;
	getStringByBinary = externals.getStringByBinary;
	externals.getSharedByBinary;
	write = externals.write;
	compress = externals.compress;
	Cursor = externals.Cursor;
	lmdbError = externals.lmdbError;
	if (externals.tmpdir)
        tmpdir = externals.tmpdir;
}
function setExternals(externals) {
	arch = externals.arch;
	fs = externals.fs;
	EventEmitter = externals.EventEmitter;
	orderedBinary = externals.orderedBinary;
	MsgpackrEncoder = externals.MsgpackrEncoder;
	WeakLRUCache = externals.WeakLRUCache;
	tmpdir = externals.tmpdir;
   os = externals.os;
	externals.onExit;
}

function when(promise, callback, errback) {
  if (promise && promise.then) {
    return errback ?
      promise.then(callback, errback) :
      promise.then(callback);
  }
  return callback(promise);
}

var backpressureArray;

const WAITING_OPERATION = 0x2000000;
const BACKPRESSURE_THRESHOLD = 300000;
const TXN_DELIMITER = 0x8000000;
const TXN_COMMITTED = 0x10000000;
const TXN_FLUSHED = 0x20000000;
const TXN_FAILED = 0x40000000;
const FAILED_CONDITION = 0x4000000;
const REUSE_BUFFER_MODE$1 = 512;
const RESET_BUFFER_MODE = 1024;
const NO_RESOLVE = 16;
const HAS_TXN = 8;
const CONDITIONAL_VERSION_LESS_THAN = 0x800;
const CONDITIONAL_ALLOW_NOTFOUND = 0x800;

const SYNC_PROMISE_SUCCESS = Promise.resolve(true);
const SYNC_PROMISE_FAIL = Promise.resolve(false);
SYNC_PROMISE_SUCCESS.isSync = true;
SYNC_PROMISE_FAIL.isSync = true;
const PROMISE_SUCCESS = Promise.resolve(true);
const ABORT = 4.452694326329068e-106; // random/unguessable numbers, which work across module/versions and native
const IF_EXISTS$1 = 3.542694326329068e-103;
const CALLBACK_THREW = {};
const LocalSharedArrayBuffer = typeof Deno != 'undefined' ? ArrayBuffer : SharedArrayBuffer; // Deno can't handle SharedArrayBuffer as an FFI argument due to https://github.com/denoland/deno/issues/12678
const ByteArray = typeof Buffer != 'undefined' ? function(buffer) { return Buffer.from(buffer) } : Uint8Array;
const queueTask = typeof setImmediate != 'undefined' ? setImmediate : setTimeout; // TODO: Or queueMicrotask?
//let debugLog = []
const WRITE_BUFFER_SIZE = 0x10000;
function addWriteMethods(LMDBStore, { env, fixedBuffer, resetReadTxn, useWritemap, maxKeySize,
	eventTurnBatching, txnStartThreshold, batchStartThreshold, overlappingSync, commitDelay, separateFlushed, maxFlushDelay }) {
	//  stands for write instructions
	var dynamicBytes;
	function allocateInstructionBuffer(lastPosition) {
		// Must use a shared buffer on older node in order to use Atomics, and it is also more correct since we are 
		// indeed accessing and modifying it from another thread (in C). However, Deno can't handle it for
		// FFI so aliased above
		let buffer = new LocalSharedArrayBuffer(WRITE_BUFFER_SIZE);
		let lastBytes = dynamicBytes;
		dynamicBytes = new ByteArray(buffer);
		let uint32 = dynamicBytes.uint32 = new Uint32Array(buffer, 0, WRITE_BUFFER_SIZE >> 2);
		uint32[2] = 0;
		dynamicBytes.float64 = new Float64Array(buffer, 0, WRITE_BUFFER_SIZE >> 3);
		buffer.address = getBufferAddress(dynamicBytes);
		uint32.address = buffer.address + uint32.byteOffset;
		dynamicBytes.position = 1; // we start at position 1 to save space for writing the txn id before the txn delimiter
		if (lastPosition) {
			lastBytes.float64[lastPosition + 1] = dynamicBytes.uint32.address + (dynamicBytes.position << 3);
			lastBytes.uint32[lastPosition << 1] = 3; // pointer instruction
		}
		return dynamicBytes;
	}
	var newBufferThreshold = (WRITE_BUFFER_SIZE - maxKeySize - 64) >> 3; // need to reserve more room if we do inline values
	var outstandingWriteCount = 0;
	var startAddress = 0;
	var writeTxn = null;
	var committed;
	var abortedNonChildTransactionWarn;
	var nextTxnCallbacks = [];
	var commitPromise, flushPromise, flushResolvers = [], batchFlushResolvers = [];
	commitDelay = commitDelay || 0;
	eventTurnBatching = eventTurnBatching === false ? false : true;
	var enqueuedCommit;
	var afterCommitCallbacks = [];
	var beforeCommitCallbacks = [];
	var enqueuedEventTurnBatch;
	var batchDepth = 0;
	var lastWritePromise;
	var writeBatchStart, outstandingBatchCount, lastSyncTxnFlush;
	var hasUnresolvedTxns;
	txnStartThreshold = txnStartThreshold || 5;
	batchStartThreshold = batchStartThreshold || 1000;
	maxFlushDelay = maxFlushDelay || 500;

	allocateInstructionBuffer();
	dynamicBytes.uint32[2] = TXN_DELIMITER | TXN_COMMITTED | TXN_FLUSHED;
	var txnResolution, nextResolution = {
		uint32: dynamicBytes.uint32, flagPosition: 2, flag: 0, valueBuffer: null, next: null, meta: null };
	var uncommittedResolution = {
		uint32: null, flagPosition: 2, flag: 0, valueBuffer: null, next: nextResolution, meta: null };
	var unwrittenResolution = nextResolution;
	var lastPromisedResolution = uncommittedResolution;
	var lastQueuedResolution = uncommittedResolution;
	function writeInstructions(flags, store, key, value, version, ifVersion) {
		let writeStatus;
		let targetBytes, position, encoder;
		let valueSize, valueBuffer, valueBufferStart;
		if (flags & 2) {
			// encode first in case we have to write a shared structure
			encoder = store.encoder;
			if (value && value['\x10binary-data\x02'])
				valueBuffer = value['\x10binary-data\x02'];
			else if (encoder) {
				if (encoder.copyBuffers) // use this as indicator for support buffer reuse for now
					valueBuffer = encoder.encode(value, REUSE_BUFFER_MODE$1 | (writeTxn ? RESET_BUFFER_MODE : 0)); // in addition, if we are writing sync, after using, we can immediately reset the encoder's position to reuse that space, which can improve performance
				else { // various other encoders, including JSON.stringify, that might serialize to a string
					valueBuffer = encoder.encode(value);
					if (typeof valueBuffer == 'string')
						valueBuffer = Buffer.from(valueBuffer); // TODO: Would be nice to write strings inline in the instructions
				}
			} else if (typeof value == 'string') {
				valueBuffer = Buffer.from(value); // TODO: Would be nice to write strings inline in the instructions
			} else if (value instanceof Uint8Array)
				valueBuffer = value;
			else
				throw new Error('Invalid value to put in database ' + value + ' (' + (typeof value) +'), consider using encoder');
			valueBufferStart = valueBuffer.start;
			if (valueBufferStart > -1) // if we have buffers with start/end position
				valueSize = valueBuffer.end - valueBufferStart; // size
			else
				valueSize = valueBuffer.length;
			if (store.dupSort && valueSize > maxKeySize)
				throw new Error('The value is larger than the maximum size (' + maxKeySize + ') for a value in a dupSort database');
		} else
			valueSize = 0;
		if (writeTxn) {
			targetBytes = fixedBuffer;
			position = 0;
		} else {
			if (eventTurnBatching && !enqueuedEventTurnBatch && batchDepth == 0) {
				enqueuedEventTurnBatch = queueTask(() => {
					try {
						for (let i = 0, l = beforeCommitCallbacks.length; i < l; i++) {
							try {
								beforeCommitCallbacks[i]();
							} catch(error) {
								console.error('In beforecommit callback', error);
							}
						}
					} catch(error) {
						console.error(error);
					}
					enqueuedEventTurnBatch = null;
					batchDepth--;
					finishBatch();
					if (writeBatchStart)
						writeBatchStart(); // TODO: When we support delay start of batch, optionally don't delay this
				});
				commitPromise = null; // reset the commit promise, can't know if it is really a new transaction prior to finishWrite being called
				flushPromise = null;
				writeBatchStart = writeInstructions(1, store);
				outstandingBatchCount = 0;
				batchDepth++;
			}
			targetBytes = dynamicBytes;
			position = targetBytes.position;
		}
		let uint32 = targetBytes.uint32, float64 = targetBytes.float64;
		let flagPosition = position << 1; // flagPosition is the 32-bit word starting position

		// don't increment position until we are sure we don't have any key writing errors
		if (!uint32) {
			throw new Error('Internal buffers have been corrupted');
		}
		uint32[flagPosition + 1] = store.db.dbi;
		if (flags & 4) {
			let keyStartPosition = (position << 3) + 12;
			let endPosition;
			try {
				endPosition = store.writeKey(key, targetBytes, keyStartPosition);
				if (!(keyStartPosition < endPosition) && (flags & 0xf) != 12)
					throw new Error('Invalid key or zero length key is not allowed in LMDB ' + key)
			} catch(error) {
				targetBytes.fill(0, keyStartPosition);
				if (error.name == 'RangeError')
					error = new Error('Key size is larger than the maximum key size (' + maxKeySize + ')');
				throw error;
			}
			let keySize = endPosition - keyStartPosition;
			if (keySize > maxKeySize) {
				targetBytes.fill(0, keyStartPosition); // restore zeros
				throw new Error('Key size is larger than the maximum key size (' + maxKeySize + ')');
			}
			uint32[flagPosition + 2] = keySize;
			position = (endPosition + 16) >> 3;
			if (flags & 2) {
				let mustCompress;
				if (valueBufferStart > -1) { // if we have buffers with start/end position
					// record pointer to value buffer
					float64[position] = (valueBuffer.address ||
						(valueBuffer.address = getAddress(valueBuffer.buffer))) + valueBufferStart;
					mustCompress = valueBuffer[valueBufferStart] >= 250; // this is the compression indicator, so we must compress
				} else {
					let valueArrayBuffer = valueBuffer.buffer;
					// record pointer to value buffer
					let address = (valueArrayBuffer.address ||
						(valueBuffer.length === 0 ? 0 : // externally allocated buffers of zero-length with the same non-null-pointer can crash node, #161
						valueArrayBuffer.address = getAddress(valueArrayBuffer)))
							+ valueBuffer.byteOffset;
					if (address <= 0 && valueBuffer.length > 0)
						console.error('Supplied buffer had an invalid address', address);
					float64[position] = address;
					mustCompress = valueBuffer[0] >= 250; // this is the compression indicator, so we must compress
				}
				uint32[(position++ << 1) - 1] = valueSize;
				if (store.compression && (valueSize >= store.compression.threshold || mustCompress)) {
					flags |= 0x100000;
					float64[position] = store.compression.address;
					if (!writeTxn)
						compress(env.address, uint32.address + (position << 3), () => {
							// this is never actually called in NodeJS, just use to pin the buffer in memory until it is finished
							// and is a no-op in Deno
							if (!float64)
								throw new Error('No float64 available');
						});
					position++;
				}
			}
			if (ifVersion !== undefined) {
				if (ifVersion === null)
					flags |= 0x10; // if it does not exist, MDB_NOOVERWRITE
				else {
					flags |= 0x100;
					float64[position++] = ifVersion;
				}
			}
			if (version !== undefined) {
				flags |= 0x200;
				float64[position++] = version || 0;
			}
		} else
			position++;
		targetBytes.position = position;
		if (writeTxn) {
			uint32[0] = flags;
			write(env.address, uint32.address);
			return () => (uint32[0] & FAILED_CONDITION) ? SYNC_PROMISE_FAIL : SYNC_PROMISE_SUCCESS;
		}
		// if we ever use buffers that haven't been zero'ed, need to clear out the next slot like this:
		// uint32[position << 1] = 0 // clear out the next slot
		let nextUint32;
		if (position > newBufferThreshold) {
			targetBytes = allocateInstructionBuffer(position);
			position = targetBytes.position;
			nextUint32 = targetBytes.uint32;
		} else
			nextUint32 = uint32;
		let resolution = nextResolution;
		// create the placeholder next resolution
		nextResolution = resolution.next = { // we try keep resolutions exactly the same object type
			uint32: nextUint32,
			flagPosition: position << 1,
			flag: 0, // TODO: eventually eliminate this, as we can probably signify HAS_TXN/NO_RESOLVE/FAILED_CONDITION in upper bits
			valueBuffer: fixedBuffer, // these are all just placeholders so that we have the right hidden class initially allocated
			next: null,
			meta: null,
		};
		lastQueuedResolution = resolution;

		let writtenBatchDepth = batchDepth;

		return (callback) => {
			if (writtenBatchDepth) {
				// if we are in a batch, the transaction can't close, so we do the faster,
				// but non-deterministic updates, knowing that the write thread can
				// just poll for the status change if we miss a status update
				writeStatus = uint32[flagPosition];
				uint32[flagPosition] = flags;
				//writeStatus = Atomics.or(uint32, flagPosition, flags)
				if (writeBatchStart && !writeStatus) {
					outstandingBatchCount += 1 + (valueSize >> 12);
					if (outstandingBatchCount > batchStartThreshold) {
						outstandingBatchCount = 0;
						writeBatchStart();
						writeBatchStart = null;
					}
				}
			} else // otherwise the transaction could end at any time and we need to know the
				// deterministically if it is ending, so we can reset the commit promise
				// so we use the slower atomic operation
				writeStatus = Atomics.or(uint32, flagPosition, flags);
	
			outstandingWriteCount++;
			if (writeStatus & TXN_DELIMITER) {
				commitPromise = null; // TODO: Don't reset these if this comes from the batch start operation on an event turn batch
				flushPromise = null;
				flushResolvers = [];
				queueCommitResolution(resolution);
				if (!startAddress) {
					startAddress = uint32.address + (flagPosition << 2);
				}
			}
			if (!writtenBatchDepth && batchFlushResolvers.length > 0) {
				flushResolvers.push(...batchFlushResolvers);
				batchFlushResolvers = [];
			}
			if (!flushPromise && overlappingSync) {
				flushPromise = new Promise(resolve => {
					if (writtenBatchDepth) {
						batchFlushResolvers.push(resolve);
					} else {
						flushResolvers.push(resolve);
					}
				});
			}
			if (writeStatus & WAITING_OPERATION) { // write thread is waiting
				write(env.address, 0);
			}
			if (outstandingWriteCount > BACKPRESSURE_THRESHOLD && !writeBatchStart) {
				if (!backpressureArray)
					backpressureArray = new Int32Array(new SharedArrayBuffer(4), 0, 1);
				Atomics.wait(backpressureArray, 0, 0, Math.round(outstandingWriteCount / BACKPRESSURE_THRESHOLD));
			}
			if (startAddress) {
				if (eventTurnBatching)
					startWriting(); // start writing immediately because this has already been batched/queued
				else if (!enqueuedCommit && txnStartThreshold) {
					enqueuedCommit = (commitDelay == 0 && typeof setImmediate != 'undefined') ? setImmediate(() => startWriting()) : setTimeout(() => startWriting(), commitDelay);
				} else if (outstandingWriteCount > txnStartThreshold)
					startWriting();
			}

			if ((outstandingWriteCount & 7) === 0)
				resolveWrites();
			
			if (store.cache) {
				resolution.meta = {
					key,
					store,
					valueSize: valueBuffer ? valueBuffer.length : 0,
				};
			}
			resolution.valueBuffer = valueBuffer;

			if (callback) {
				if (callback === IF_EXISTS$1)
					ifVersion = IF_EXISTS$1;
				else {
					let meta = resolution.meta || (resolution.meta = {});
					meta.reject = callback;
					meta.resolve = (value) => callback(null, value);
					return;
				}
			}
			if (ifVersion === undefined) {
				if (writtenBatchDepth > 1) {
					if (!resolution.flag && !store.cache)
						resolution.flag = NO_RESOLVE;
					return PROMISE_SUCCESS; // or return undefined?
				}
				if (commitPromise) {
					if (!resolution.flag)
						resolution.flag = NO_RESOLVE;
				} else {
					commitPromise = new Promise((resolve, reject) => {
						let meta = resolution.meta || (resolution.meta = {});
						meta.resolve = resolve;
						resolve.unconditional = true;
						meta.reject = reject;
					});
					if (separateFlushed)
						commitPromise.flushed = overlappingSync ? flushPromise : commitPromise;
				}
				return commitPromise;
			}
			lastWritePromise = new Promise((resolve, reject) => {
				let meta = resolution.meta || (resolution.meta = {});
				meta.resolve = resolve;
				meta.reject = reject;
			});
			if (separateFlushed)
				lastWritePromise.flushed = overlappingSync ? flushPromise : lastWritePromise;
			return lastWritePromise;
		};
	}
	Promise.resolve();
	function startWriting() {
		if (enqueuedCommit) {
			clearImmediate(enqueuedCommit);
			enqueuedCommit = null;
		}
		let resolvers = flushResolvers;
		env.startWriting(startAddress, (status) => {
			if (dynamicBytes.uint32[dynamicBytes.position << 1] & TXN_DELIMITER)
				queueCommitResolution(nextResolution);

			resolveWrites(true);
			switch (status) {
				case 0:
					for (let resolver of resolvers) {
						resolver();
					}
					break;
				case 1:
					break;
				case 2:
					hasUnresolvedTxns = false;
					executeTxnCallbacks();
					return hasUnresolvedTxns;
				default:
					try {
						lmdbError(status);
					} catch(error) {
						console.error(error);
						if (commitRejectPromise) {
							commitRejectPromise.reject(error);
							commitRejectPromise = null;
						}
					}
			}
		});
		startAddress = 0;
	}

	function queueCommitResolution(resolution) {
		if (!(resolution.flag & HAS_TXN)) {
			resolution.flag = HAS_TXN;
			if (txnResolution) {
				txnResolution.nextTxn = resolution;
				//outstandingWriteCount = 0
			}
			else
				txnResolution = resolution;
		}
	}
	var TXN_DONE = TXN_COMMITTED | TXN_FAILED;
	function resolveWrites(async) {
		// clean up finished instructions
		let instructionStatus;
		while ((instructionStatus = unwrittenResolution.uint32[unwrittenResolution.flagPosition])
				& 0x1000000) {
			if (unwrittenResolution.callbacks) {
				nextTxnCallbacks.push(unwrittenResolution.callbacks);
				unwrittenResolution.callbacks = null;
			}
			outstandingWriteCount--;
			if (unwrittenResolution.flag !== HAS_TXN) {
				if (unwrittenResolution.flag === NO_RESOLVE && !unwrittenResolution.meta) {
					// in this case we can completely remove from the linked list, clearing more memory
					lastPromisedResolution.next = unwrittenResolution = unwrittenResolution.next;
					continue;
				}
				unwrittenResolution.uint32 = null;
			}
			unwrittenResolution.valueBuffer = null;
			unwrittenResolution.flag = instructionStatus;
			lastPromisedResolution = unwrittenResolution;
			unwrittenResolution = unwrittenResolution.next;
		}
		while (txnResolution &&
			(instructionStatus = txnResolution.uint32[txnResolution.flagPosition] & TXN_DONE)) {
			if (instructionStatus & TXN_FAILED)
				rejectCommit();
			else
				resolveCommit(async);
		}
	}

	function resolveCommit(async) {
		afterCommit(txnResolution.uint32[txnResolution.flagPosition - 1]);
		if (async)
			resetReadTxn();
		else
			queueMicrotask(resetReadTxn); // TODO: only do this if there are actually committed writes?
		do {
			if (uncommittedResolution.meta && uncommittedResolution.meta.resolve) {
				let resolve = uncommittedResolution.meta.resolve;
				if (uncommittedResolution.flag & FAILED_CONDITION && !resolve.unconditional)
					resolve(false);
				else
					resolve(true);
			}
		} while((uncommittedResolution = uncommittedResolution.next) && uncommittedResolution != txnResolution)
		txnResolution = txnResolution.nextTxn;
	}
	var commitRejectPromise;
	function rejectCommit() {
		afterCommit();
		if (!commitRejectPromise) {
			let rejectFunction;
			commitRejectPromise = new Promise((resolve, reject) => rejectFunction = reject);
			commitRejectPromise.reject = rejectFunction;
		}
		do {
			if (uncommittedResolution.meta && uncommittedResolution.meta.reject) {
				uncommittedResolution.flag & 0xf;
				let error = new Error("Commit failed (see commitError for details)");
				error.commitError = commitRejectPromise;
				uncommittedResolution.meta.reject(error);
			}
		} while((uncommittedResolution = uncommittedResolution.next) && uncommittedResolution != txnResolution)
		txnResolution = txnResolution.nextTxn;
	}
	function atomicStatus(uint32, flagPosition, newStatus) {
		if (batchDepth) {
			// if we are in a batch, the transaction can't close, so we do the faster,
			// but non-deterministic updates, knowing that the write thread can
			// just poll for the status change if we miss a status update
			let writeStatus = uint32[flagPosition];
			uint32[flagPosition] = newStatus;
			return writeStatus;
			//return Atomics.or(uint32, flagPosition, newStatus)
		} else // otherwise the transaction could end at any time and we need to know the
			// deterministically if it is ending, so we can reset the commit promise
			// so we use the slower atomic operation
			try {
				return Atomics.or(uint32, flagPosition, newStatus);
			} catch(error) {
			console.error(error);
			return;
			}
	}
	function afterCommit(txnId) {
		for (let i = 0, l = afterCommitCallbacks.length; i < l; i++) {
			try {
				afterCommitCallbacks[i]({next: uncommittedResolution, last: txnResolution, txnId});
			} catch(error) {
				console.error('In aftercommit callback', error);
			}
		}
	}
	async function executeTxnCallbacks() {
		env.writeTxn = writeTxn = { write: true };
		nextTxnCallbacks.isExecuting = true;
		for (let i = 0; i < nextTxnCallbacks.length; i++) {
			let txnCallbacks = nextTxnCallbacks[i];
			for (let j = 0, l = txnCallbacks.length; j < l; j++) {
				let userTxnCallback = txnCallbacks[j];
				let asChild = userTxnCallback.asChild;
				if (asChild) {
					env.beginTxn(1); // abortable
					let parentTxn = writeTxn;
					env.writeTxn = writeTxn = { write: true };
					try {
						let result = userTxnCallback.callback();
						if (result && result.then) {
							hasUnresolvedTxns = true;
							await result;
						}
						if (result === ABORT)
							env.abortTxn();
						else
							env.commitTxn();
						clearWriteTxn(parentTxn);
						txnCallbacks[j] = result;
					} catch(error) {
						clearWriteTxn(parentTxn);
						env.abortTxn();
						txnError(error, txnCallbacks, j);
					}
				} else {
					try {
						let result = userTxnCallback();
						txnCallbacks[j] = result;
						if (result && result.then) {
							hasUnresolvedTxns = true;
							await result;
						}
					} catch(error) {
						txnError(error, txnCallbacks, j);
					}
				}
			}
		}
		nextTxnCallbacks = [];
		clearWriteTxn(null);
		if (hasUnresolvedTxns) {
			env.resumeWriting();
		}
		function txnError(error, txnCallbacks, i) {
			(txnCallbacks.errors || (txnCallbacks.errors = []))[i] = error;
			txnCallbacks[i] = CALLBACK_THREW;
		}
	}
	function finishBatch() {
		dynamicBytes.uint32[(dynamicBytes.position + 1) << 1] = 0; // clear out the next slot
		let writeStatus = atomicStatus(dynamicBytes.uint32, (dynamicBytes.position++) << 1, 2); // atomically write the end block
		nextResolution.flagPosition += 2;
		if (writeStatus & WAITING_OPERATION) {
			write(env.address, 0);
		}
		if (dynamicBytes.position > newBufferThreshold) {
			allocateInstructionBuffer(dynamicBytes.position);
			nextResolution.flagPosition = dynamicBytes.position << 1;
			nextResolution.uint32 = dynamicBytes.uint32;
		}
	}
	function clearWriteTxn(parentTxn) {
		// TODO: We might actually want to track cursors in a write txn and manually
		// close them.
		if (writeTxn && writeTxn.refCount > 0)
			writeTxn.isDone = true;
		env.writeTxn = writeTxn = parentTxn || null;
	}
	Object.assign(LMDBStore.prototype, {
		put(key, value, versionOrOptions, ifVersion) {
			let callback, flags = 15, type = typeof versionOrOptions;
			if (type == 'object' && versionOrOptions) {
				if (versionOrOptions.noOverwrite)
					flags |= 0x10;
				if (versionOrOptions.noDupData)
					flags |= 0x20;
				if (versionOrOptions.append)
					flags |= 0x20000;
				if (versionOrOptions.ifVersion != undefined)
					ifVersion = versionOrOptions.ifVersion;
				versionOrOptions = versionOrOptions.version;
				if (typeof ifVersion == 'function')
					callback = ifVersion;
			} else if (type == 'function') {
				callback = versionOrOptions;
			}
			return writeInstructions(flags, this, key, value, this.useVersions ? versionOrOptions || 0 : undefined, ifVersion)(callback);
		},
		remove(key, ifVersionOrValue, callback) {
			let flags = 13;
			let ifVersion, value;
			if (ifVersionOrValue !== undefined) {
				if (typeof ifVersionOrValue == 'function')
					callback = ifVersionOrValue;
				else if (ifVersionOrValue === IF_EXISTS$1 && !callback)
					// we have a handler for IF_EXISTS in the callback handler for remove
					callback = ifVersionOrValue;
				else if (this.useVersions)
					ifVersion = ifVersionOrValue;
				else {
					flags = 14;
					value = ifVersionOrValue;
				}
			}
			return writeInstructions(flags, this, key, value, undefined, ifVersion)(callback);
		},
		del(key, options, callback) {
			return this.remove(key, options, callback);
		},
		ifNoExists(key, callback) {
			return this.ifVersion(key, null, callback);
		},
		ifVersion(key, version, callback, options) {
			if (!callback) {
				return new Batch((operations, callback) => {
					let promise = this.ifVersion(key, version, operations, options);
					if (callback)
						promise.then(callback);
					return promise;
				});
			}
			if (writeTxn) {
				if (version === undefined || this.doesExist(key, version)) {
					callback();
					return SYNC_PROMISE_SUCCESS;
				}
				return SYNC_PROMISE_FAIL;
			}
			let flags = key === undefined || version === undefined ? 1 : 4;
			if (options?.ifLessThan)
				flags |= CONDITIONAL_VERSION_LESS_THAN;
			if (options?.allowNotFound)
				flags |= CONDITIONAL_ALLOW_NOTFOUND;
			let finishStartWrite = writeInstructions(flags, this, key, undefined, undefined, version);
			let promise;
			batchDepth += 2;
			if (batchDepth > 2)
				promise = finishStartWrite();
			else {
				writeBatchStart = () => {
					promise = finishStartWrite();
				};
				outstandingBatchCount = 0;
			}
			try {
				if (typeof callback === 'function') {
					callback();
				} else {
					for (let i = 0, l = callback.length; i < l; i++) {
						let operation = callback[i];
						this[operation.type](operation.key, operation.value);
					}
				}
			} finally {
				if (!promise) {
					finishBatch();
					batchDepth -= 2;
					promise = finishStartWrite(); // finish write once all the operations have been written (and it hasn't been written prematurely)
					writeBatchStart = null;
				} else {
					batchDepth -= 2;
					finishBatch();
				}
			}
			return promise;
		},
		batch(callbackOrOperations) {
			return this.ifVersion(undefined, undefined, callbackOrOperations);
		},
		drop(callback) {
			return writeInstructions(1024 + 12, this, Buffer.from([]), undefined, undefined, undefined)(callback);
		},
		clearAsync(callback) {
			if (this.encoder) {
				if (this.encoder.clearSharedData)
					this.encoder.clearSharedData();
				else if (this.encoder.structures)
					this.encoder.structures = [];
			}
			return writeInstructions(12, this, Buffer.from([]), undefined, undefined, undefined)(callback);
		},
		_triggerError() {
			finishBatch();
		},

		putSync(key, value, versionOrOptions, ifVersion) {
			if (writeTxn)
				return this.put(key, value, versionOrOptions, ifVersion) === SYNC_PROMISE_SUCCESS;
			else
				return this.transactionSync(() =>
					this.put(key, value, versionOrOptions, ifVersion) === SYNC_PROMISE_SUCCESS, overlappingSync? 0x10002 : 2); // non-abortable, async flush
		},
		removeSync(key, ifVersionOrValue) {
			if (writeTxn)
				return this.remove(key, ifVersionOrValue) === SYNC_PROMISE_SUCCESS;
			else
				return this.transactionSync(() =>
					this.remove(key, ifVersionOrValue) === SYNC_PROMISE_SUCCESS, overlappingSync? 0x10002 : 2); // non-abortable, async flush
		},
		transaction(callback) {
			if (writeTxn && !nextTxnCallbacks.isExecuting) {
				// already nested in a transaction, just execute and return
				return callback();
			}
			return this.transactionAsync(callback);
		},
		childTransaction(callback) {
			if (useWritemap)
				throw new Error('Child transactions are not supported in writemap mode');
			if (writeTxn) {
				let parentTxn = writeTxn;
				let thisTxn = env.writeTxn = writeTxn = { write: true };
				env.beginTxn(1); // abortable
				let callbackDone, finishTxn;
				try {
					return writeTxn.childResults = when(callback(), finishTxn = (result) => {
						if (writeTxn !== thisTxn) // need to wait for child txn to finish asynchronously
							return writeTxn.childResults.then(() => finishTxn(result));
						callbackDone = true;
						if (result === ABORT)
							env.abortTxn();
						else
							env.commitTxn();
						clearWriteTxn(parentTxn);
						return result;
					}, (error) => {
						env.abortTxn();
						clearWriteTxn(parentTxn);
						throw error;
					});
				} catch(error) {
					if (!callbackDone)
						env.abortTxn();
					clearWriteTxn(parentTxn);
					throw error;
				}
			}
			return this.transactionAsync(callback, true);
		},
		transactionAsync(callback, asChild) {
			let txnIndex;
			let txnCallbacks;
			if (lastQueuedResolution.callbacks) {
				txnCallbacks = lastQueuedResolution.callbacks;
				txnIndex = txnCallbacks.push(asChild ? { callback, asChild } : callback) - 1;
			} else if (nextTxnCallbacks.isExecuting) {
				txnCallbacks = [asChild ? { callback, asChild } : callback];
				txnCallbacks.results = commitPromise;
				nextTxnCallbacks.push(txnCallbacks);
				txnIndex = 0;
			} else {
				if (writeTxn)
					throw new Error('Can not enqueue transaction during write txn');
				let finishWrite = writeInstructions(8 | (this.strictAsyncOrder ? 0x100000 : 0), this);
				txnCallbacks = [asChild ? { callback, asChild } : callback];
				lastQueuedResolution.callbacks = txnCallbacks;
				lastQueuedResolution.id = Math.random();
				txnCallbacks.results = finishWrite();
				txnIndex = 0;
			}
			return txnCallbacks.results.then((results) => {
				let result = txnCallbacks[txnIndex];
				if (result === CALLBACK_THREW)
					throw txnCallbacks.errors[txnIndex];
				return result;
			});
		},
		transactionSync(callback, flags) {
			if (writeTxn) {
				if (!useWritemap && (flags == undefined || (flags & 1))) // can't use child transactions in write maps
					// already nested in a transaction, execute as child transaction (if possible) and return
					return this.childTransaction(callback);
				let result = callback(); // else just run in current transaction
				if (result == ABORT && !abortedNonChildTransactionWarn) {
					console.warn('Can not abort a transaction inside another transaction with ' + (this.cache ? 'caching enabled' : 'useWritemap enabled'));
					abortedNonChildTransactionWarn = true;
				}
				return result;
			}
			let callbackDone, finishTxn;
			this.transactions++;
			if (!env.address)
				throw new Error('The database has been closed and you can not transact on it');
			env.beginTxn(flags == undefined ? 3 : flags);
			let thisTxn = writeTxn = env.writeTxn = { write: true };
			try {
				this.emit('begin-transaction');
				return writeTxn.childResults = when(callback(), finishTxn = (result) => {
					if (writeTxn !== thisTxn) // need to wait for child txn to finish asynchronously
						return writeTxn.childResults.then(() => finishTxn(result));
					try {
						callbackDone = true;
						if (result === ABORT)
							env.abortTxn();
						else {
							env.commitTxn();
							resetReadTxn();
						}
						return result;
					} finally {
						clearWriteTxn(null);
					}
				}, (error) => {
					try { env.abortTxn(); } catch(e) {}
					clearWriteTxn(null);
					throw error;
				});
			} catch(error) {
				if (!callbackDone)
					try { env.abortTxn(); } catch(e) {}
				clearWriteTxn(null);
				throw error;
			}
		},
		transactionSyncStart(callback) {
			return this.transactionSync(callback, 0);
		},
		// make the db a thenable/promise-like for when the last commit is committed
		committed: committed = {
			then(onfulfilled, onrejected) {
				if (commitPromise)
					return commitPromise.then(onfulfilled, onrejected);
				if (lastWritePromise) // always resolve to true
					return lastWritePromise.then(() => onfulfilled(true), onrejected);
				return SYNC_PROMISE_SUCCESS.then(onfulfilled, onrejected);
			}
		},
		flushed: {
			// make this a thenable for when the commit is flushed to disk
			then(onfulfilled, onrejected) {
				if (flushPromise)
					flushPromise.hasCallbacks = true;
				return Promise.all([flushPromise || committed, lastSyncTxnFlush]).then(onfulfilled, onrejected);
			}
		},
		_endWrites(resolvedPromise, resolvedSyncPromise) {
			this.put = this.remove = this.del = this.batch = this.removeSync = this.putSync = this.transactionAsync = this.drop = this.clearAsync = () => { throw new Error('Database is closed') };
			// wait for all txns to finish, checking again after the current txn is done
			let finalPromise = flushPromise || commitPromise || lastWritePromise;
			if (flushPromise)
				flushPromise.hasCallbacks = true;
			let finalSyncPromise = lastSyncTxnFlush;
			if (finalPromise && resolvedPromise != finalPromise ||
					finalSyncPromise ) {
				return Promise.all([finalPromise, finalSyncPromise]).then(() => this._endWrites(finalPromise, finalSyncPromise), () => this._endWrites(finalPromise, finalSyncPromise));
			}
			Object.defineProperty(env, 'sync', { value: null });
		},
		on(event, callback) {
			if (event == 'beforecommit') {
				eventTurnBatching = true;
				beforeCommitCallbacks.push(callback);
			} else if (event == 'aftercommit')
				afterCommitCallbacks.push(callback);
			else
				super.on(event, callback);
		}
	});
}

class Batch extends Array {
	constructor(callback) {
		super();
		this.callback = callback;
	}
	put(key, value) {
		this.push({ type: 'put', key, value });
	}
	del(key) {
		this.push({ type: 'del', key });
	}
	clear() {
		this.splice(0, this.length);
	}
	write(callback) {
		return this.callback(this, callback);
	}
}
function asBinary(buffer) {
	return {
		['\x10binary-data\x02']: buffer
	};
}

const SKIP = {};
const DONE = {
	value: null,
	done: true,
};
if (!Symbol.asyncIterator) {
	Symbol.asyncIterator = Symbol.for('Symbol.asyncIterator');
}

class RangeIterable {
	constructor(sourceArray) {
		if (sourceArray) {
			this.iterate = sourceArray[Symbol.iterator].bind(sourceArray);
		}
	}
	map(func) {
		let source = this;
		let iterable = new RangeIterable();
		iterable.iterate = (async) => {
			let iterator = source[Symbol.iterator](async);
			let i = 0;
			return {
				next(resolvedResult) {
					let result;
					do {
						let iteratorResult;
						if (resolvedResult) {
							iteratorResult = resolvedResult;
							resolvedResult = null; // don't go in this branch on next iteration
						} else {
							iteratorResult = iterator.next();
							if (iteratorResult.then) {
								return iteratorResult.then(iteratorResult => this.next(iteratorResult));
							}
						}
						if (iteratorResult.done === true) {
							this.done = true;
							if (iterable.onDone) iterable.onDone();
							return iteratorResult;
						}
						result = func(iteratorResult.value, i++);
						if (result && result.then) {
							return result.then(result =>
								result === SKIP ?
									this.next() :
									{
										value: result
									});
						}
					} while(result === SKIP);
					if (result === DONE) {
						if (iterable.onDone) iterable.onDone();
						return result;
					}
					return {
						value: result
					};
				},
				return() {
					if (iterable.onDone) iterable.onDone();
					return iterator.return();
				},
				throw() {
					if (iterable.onDone) iterable.onDone();
					return iterator.throw();
				}
			};
		};
		return iterable;
	}
	[Symbol.asyncIterator]() {
		return this.iterator = this.iterate();
	}
	[Symbol.iterator]() {
		return this.iterator = this.iterate();
	}
	filter(func) {
		return this.map(element => {
			let result = func(element);
			// handle promise
			if (result?.then) return result.then((result) => result ? element : SKIP);
			else return result ? element : SKIP;
		});
	}

	forEach(callback) {
		let iterator = this.iterator = this.iterate();
		let result;
		while ((result = iterator.next()).done !== true) {
			callback(result.value);
		}
	}
	concat(secondIterable) {
		let concatIterable = new RangeIterable();
		concatIterable.iterate = (async) => {
			let iterator = this.iterator = this.iterate();
			let isFirst = true;
			function iteratorDone(result) {
				if (isFirst) {
					isFirst = false;
					iterator = secondIterable[Symbol.iterator](async);
					result = iterator.next();
					if (concatIterable.onDone) {
						if (result.then)
							result.then((result) => {
								if (result.done()) concatIterable.onDone();
							});
						else if (result.done) concatIterable.onDone();
					}
				} else {
					if (concatIterable.onDone) concatIterable.onDone();
				}
				return result;
			}
			return {
				next() {
					let result = iterator.next();
					if (result.then)
						return result.then((result) => {
							if (result.done) return iteratorDone(result);
							return result;
						});
					if (result.done) return iteratorDone(result);
					return result;
				},
				return() {
					if (concatIterable.onDone) concatIterable.onDone();
					return iterator.return();
				},
				throw() {
					if (concatIterable.onDone) concatIterable.onDone();
					return iterator.throw();
				}
			};
		};
		return concatIterable;
	}

	flatMap(callback) {
		let mappedIterable = new RangeIterable();
		mappedIterable.iterate = (async) => {
			let iterator = this.iterator = this.iterate(async);
			let currentSubIterator;
			return {
				next() {
					do {
						if (currentSubIterator) {
							let result = currentSubIterator.next();
							if (!result.done) {
								return result;
							}
						}
						let result = iterator.next();
						if (result.done) {
							if (mappedIterable.onDone) mappedIterable.onDone();
							return result;
						}
						let value = callback(result.value);
						if (Array.isArray(value) || value instanceof RangeIterable)
							currentSubIterator = value[Symbol.iterator]();
						else {
							currentSubIterator = null;
							return { value };
						}
					} while(true);
				},
				return() {
					if (mappedIterable.onDone) mappedIterable.onDone();
					if (currentSubIterator)
						currentSubIterator.return();
					return iterator.return();
				},
				throw() {
					if (mappedIterable.onDone) mappedIterable.onDone();
					if (currentSubIterator)
						currentSubIterator.throw();
					return iterator.throw();
				}
			};
		};
		return mappedIterable;
	}

	slice(start, end) {
		return this.map((element, i) => {
			if (i < start)
				return SKIP;
			if (i >= end) {
				DONE.value = element;
				return DONE;
			}
			return element;
		});
	}
	next() {
		if (!this.iterator)
			this.iterator = this.iterate();
		return this.iterator.next();
	}
	toJSON() {
		if (this.asArray && this.asArray.forEach) {
			return this.asArray;
		}
		throw new Error('Can not serialize async iterables without first calling resolveJSON');
		//return Array.from(this)
	}
	get asArray() {
		if (this._asArray)
			return this._asArray;
		let promise = new Promise((resolve, reject) => {
			let iterator = this.iterate();
			let array = [];
			let iterable = this;
			Object.defineProperty(array, 'iterable', { value: iterable });
			function next(result) {
				while (result.done !== true) {
					if (result.then) {
						return result.then(next);
					} else {
						array.push(result.value);
					}
					result = iterator.next();
				}
				resolve(iterable._asArray = array);
			}
			next(iterator.next());
		});
		promise.iterable = this;
		return this._asArray || (this._asArray = promise);
	}
	resolveData() {
		return this.asArray;
	}
}
RangeIterable.prototype.DONE = DONE;

const REUSE_BUFFER_MODE = 512;
const writeUint32Key = (key, target, start) => {
	(target.dataView || (target.dataView = new DataView(target.buffer, 0, target.length))).setUint32(start, key, true);
	return start + 4;
};
const readUint32Key = (target, start) => {
	return (target.dataView || (target.dataView = new DataView(target.buffer, 0, target.length))).getUint32(start, true);
};
const writeBufferKey = (key, target, start) => {
	target.set(key, start);
	return key.length + start;
};
const Uint8ArraySlice$1 = Uint8Array.prototype.slice;
const readBufferKey = (target, start, end) => {
	return Uint8ArraySlice$1.call(target, start, end);
};

let lastEncodedValue, bytes;
function applyKeyHandling(store) {
 	if (store.encoding == 'ordered-binary') {
		store.encoder = store.decoder = {
			writeKey: orderedBinary.writeKey,
			readKey: orderedBinary.readKey,
		};
	}
	if (store.encoder && store.encoder.writeKey && !store.encoder.encode) {
		store.encoder.encode = function(value, mode) {
			if (typeof value !== 'object' && value && value === lastEncodedValue) ; else {
				lastEncodedValue = value;
				bytes = saveKey(value, this.writeKey, false, store.maxKeySize);
			}
			if (bytes.end > 0 && !(REUSE_BUFFER_MODE & mode)) {
				return bytes.subarray(bytes.start, bytes.end);
			}
			return bytes;
		};
		store.encoder.copyBuffers = true; // just an indicator for the buffer reuse in write.js
	}
	if (store.decoder && store.decoder.readKey && !store.decoder.decode) {
		store.decoder.decode = function(buffer) { return this.readKey(buffer, 0, buffer.length); };
		store.decoderCopies = true;
	}
	if (store.keyIsUint32 || store.keyEncoding == 'uint32') {
		store.writeKey = writeUint32Key;
		store.readKey = readUint32Key;
	} else if (store.keyIsBuffer || store.keyEncoding == 'binary') {
		store.writeKey = writeBufferKey;
		store.readKey = readBufferKey;
	} else if (store.keyEncoder) {
		store.writeKey = store.keyEncoder.writeKey;
		store.readKey = store.keyEncoder.readKey;
	} else {
		store.writeKey = orderedBinary.writeKey;
		store.readKey = orderedBinary.readKey;
	}
}

let saveBuffer, saveDataView = { setFloat64() {}, setUint32() {} }, saveDataAddress;
let savePosition$1 = 8000;
let DYNAMIC_KEY_BUFFER_SIZE$1 = 8192;
function allocateSaveBuffer() {
	saveBuffer = typeof Buffer != 'undefined' ? Buffer.alloc(DYNAMIC_KEY_BUFFER_SIZE$1) : new Uint8Array(DYNAMIC_KEY_BUFFER_SIZE$1);
	saveBuffer.buffer.address = getAddress(saveBuffer.buffer);
	saveDataAddress = saveBuffer.buffer.address;
	// TODO: Conditionally only do this for key sequences?
	saveDataView.setUint32(savePosition$1, 0xffffffff);
	saveDataView.setFloat64(savePosition$1 + 4, saveDataAddress, true); // save a pointer from the old buffer to the new address for the sake of the prefetch sequences
	saveDataView = saveBuffer.dataView || (saveBuffer.dataView = new DataView(saveBuffer.buffer, saveBuffer.byteOffset, saveBuffer.byteLength));
	savePosition$1 = 0;
}
function saveKey(key, writeKey, saveTo, maxKeySize, flags) {
	if (savePosition$1 > 7800) {
		allocateSaveBuffer();
	}
	let start = savePosition$1;
	try {
		savePosition$1 = key === undefined ? start + 4 :
			writeKey(key, saveBuffer, start + 4);
	} catch (error) {
		saveBuffer.fill(0, start + 4); // restore zeros
		if (error.name == 'RangeError') {
			if (8180 - start < maxKeySize) {
				allocateSaveBuffer(); // try again:
				return saveKey(key, writeKey, saveTo, maxKeySize);
			}
			throw new Error('Key was too large, max key size is ' + maxKeySize);
		} else
			throw error;
	}
	let length = savePosition$1 - start - 4;
	if (length > maxKeySize) {
		throw new Error('Key of size ' + length + ' was too large, max key size is ' + maxKeySize);
	}
	if (savePosition$1 >= 8160) { // need to reserve enough room at the end for pointers
		savePosition$1 = start; // reset position
		allocateSaveBuffer(); // try again:
		return saveKey(key, writeKey, saveTo, maxKeySize);
	}
	if (saveTo) {
		saveDataView.setUint32(start, flags ? length | flags : length, true); // save the length
		saveTo.saveBuffer = saveBuffer;
		savePosition$1 = (savePosition$1 + 12) & 0xfffffc;
		return start + saveDataAddress;
	} else {
		saveBuffer.start = start + 4;
		saveBuffer.end = savePosition$1;
		savePosition$1 = (savePosition$1 + 7) & 0xfffff8; // full 64-bit word alignment since these are usually copied
		return saveBuffer;
	}
}

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
const UNMODIFIED = {};
let mmaps = [];

function addReadMethods(LMDBStore, {
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
				let bytesToRestore;
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
				bytes.set(dictionary); // copy dictionary into start
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
				readTxn.isCommitted = true;
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
						txn = options.transaction;
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
					let count = position$1(options.offset);
					if (count < 0)
						lmdbError(count);
					finishCursor();
					return count;
				}
				function position$1(offset) {
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
							}
						}
					} else
						endAddress = saveKey(options.end, store.writeKey, iterable, maxKeySize);
					return position(cursorAddress, flags, offset || 0, keySize, endAddress);
				}

				function finishCursor() {
					if (txn.isDone)
						return;
					if (iterable.onDone)
						iterable.onDone();
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
							keySize = position$1(0);
						}
						if (count === 0) { // && includeValues) // on first entry, get current value if we need to
							keySize = position$1(options.offset);
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
									lmdbError(keySize - 0x100000000);
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
				let position;
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
			};
			if (txnPromise)
				return txnPromise.then(doClose);
			else {
				doClose();
				return Promise.resolve();
			}
		},
		getStats() {
			env.writeTxn || (readTxnRenewed ? readTxn : renewReadTxn(this));
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
function makeReusableBuffer(size) {
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
};
Txn.prototype.use = function() {
	this.refCount = (this.refCount || 0) + 1;
};


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
function recordReadInstruction(txnAddress, dbi, key, writeKey, maxKeySize, callback) {
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
	});
}

let getLastVersion$1, getLastTxnId$1;
const mapGet = Map.prototype.get;
const CachingStore = (Store, env) => {
	let childTxnChanges;
	return class LMDBStore extends Store {
	constructor(dbName, options) {
		super(dbName, options);
		if (!env.cacheCommitter) {
			env.cacheCommitter = true;
			this.on('aftercommit', ({ next, last, txnId }) => {
				do {
					let meta = next.meta;
					let store = meta && meta.store;
					if (store) {
						if (next.flag & FAILED_CONDITION)
							store.cache.delete(meta.key); // just delete it from the map
						else {
							let expirationPriority = meta.valueSize >> 10;
							let cache = store.cache;
							let entry = mapGet.call(cache, meta.key);
							if (entry) {
								entry.txnId = txnId;
								cache.used(entry, expirationPriority + 4); // this will enter it into the LRFU (with a little lower priority than a read)
							}
						}
					}
				} while (next != last && (next = next.next))
			});
		}
		this.db.cachingDb = this;
		if (options.cache.clearKeptInterval)
			options.cache.clearKeptObjects = exports.clearKeptObjects;
		this.cache = new WeakLRUCache(options.cache);
		if (options.cache.validated)
			this.cache.validated = true;
	}
	get isCaching() {
		return true
	}
	get(id, options) {
		let value;
		if (this.cache.validated) {
			let entry = this.cache.get(id);
			if (entry) {
				let cachedValue = entry.value;
				if (entry.txnId != null) {
					value = super.get(id, { ifNotTxnId: entry.txnId, transaction: options && options.transaction });
					if (value === UNMODIFIED)
						return cachedValue;
				} else // with no txn id we do not validate; this is the state of a cached value after a write before it transacts
					return cachedValue;
			} else
				value = super.get(id, options);
		} else if (options && options.transaction) {
			return super.get(id, options);
		} else {
			value = this.cache.getValue(id);
			if (value !== undefined) {
				return value;
			}
			value = super.get(id);
		}
		if (value && typeof value === 'object' && !options && typeof id !== 'object') {
			let entry = this.cache.setValue(id, value, this.lastSize >> 10);
			if (this.useVersions) {
				entry.version = getLastVersion$1();
			}
			if (this.cache.validated)
				entry.txnId = getLastTxnId$1();
		}
		return value;
	}
	getEntry(id, options) {
		let entry, value;
		if (this.cache.validated) {
			entry = this.cache.get(id);
			if (entry) {
				if (entry.txnId != null) {
					value = super.get(id, { ifNotTxnId: entry.txnId, transaction: options && options.transaction });
					if (value === UNMODIFIED)
						return entry;
				} else // with no txn id we do not validate; this is the state of a cached value after a write before it transacts
					return entry;
			} else
				value = super.get(id, options);
		} else if (options && options.transaction) {
			return super.getEntry(id, options);
		} else {
			entry = this.cache.get(id);
			if (entry !== undefined) {
				return entry;
			}
			value = super.get(id);
		}
		if (value === undefined)
			return;
		if (value && typeof value === 'object' && !options && typeof id !== 'object') {
			entry = this.cache.setValue(id, value, this.lastSize >> 10);
		} else
			entry = { value };
		if (this.useVersions)
			entry.version = getLastVersion$1();
		if (this.cache.validated)
			entry.txnId = getLastTxnId$1();
		return entry;
	}
	putEntry(id, entry, ifVersion) {
		let result = super.put(id, entry.value, entry.version, ifVersion);
		if (typeof id === 'object')
			return result;
		if (result && result.then)
			this.cache.setManually(id, entry); // set manually so we can keep it pinned in memory until it is committed
		else // sync operation, immediately add to cache
			this.cache.set(id, entry);
	}
	put(id, value, version, ifVersion) {
		let result = super.put(id, value, version, ifVersion);
		if (typeof id !== 'object') {
			if (value && value['\x10binary-data\x02']) {
				// don't cache binary data, since it will be decoded on get
				this.cache.delete(id);
				return result;
			}	
			// sync operation, immediately add to cache, otherwise keep it pinned in memory until it is committed
			let entry = this.cache.setValue(id, value, !result || result.isSync ? 0 : -1);
			if (childTxnChanges)
				childTxnChanges.add(id);
			if (version !== undefined)
				entry.version = typeof version === 'object' ? version.version : version;
		}
		return result;
	}
	putSync(id, value, version, ifVersion) {
		if (id !== 'object') {
			// sync operation, immediately add to cache, otherwise keep it pinned in memory until it is committed
			if (value && typeof value === 'object') {
				let entry = this.cache.setValue(id, value);
				if (childTxnChanges)
					childTxnChanges.add(id);
				if (version !== undefined) {
					entry.version = typeof version === 'object' ? version.version : version;
				}
			} else // it is possible that  a value used to exist here
				this.cache.delete(id);
		}
		return super.putSync(id, value, version, ifVersion);
	}
	remove(id, ifVersion) {
		this.cache.delete(id);
		return super.remove(id, ifVersion);
	}
	removeSync(id, ifVersion) {
		this.cache.delete(id);
		return super.removeSync(id, ifVersion);
	}
	clearAsync(callback) {
		this.cache.clear();
		return super.clearAsync(callback);
	}
	clearSync() {
		this.cache.clear();
		super.clearSync();
	}
	childTransaction(callback) {
		return super.childTransaction(() => {
			let cache = this.cache;
			let previousChanges = childTxnChanges;
			try {
				childTxnChanges = new Set();
				return when(callback(), (result) => {
					if (result === ABORT)
						return abort();
					childTxnChanges = previousChanges;
					return result;
				}, abort);
			} catch(error) {
				abort(error);
			}
			function abort(error) {
				// if the transaction was aborted, remove all affected entries from cache
				for (let id of childTxnChanges)
					cache.delete(id);
				childTxnChanges = previousChanges;
				if (error)
					throw error;
				else
					return ABORT;
			}
		});
	}
	doesExist(key, versionOrValue) {
		let entry = this.cache.get(key);
		if (entry) {
			if (versionOrValue == null) {
				return versionOrValue !== null;
			} else if (this.useVersions) {
				return versionOrValue === IF_EXISTS$1 || entry.version === versionOrValue;
			}
		}
		return super.doesExist(key, versionOrValue);
	}
	};
};
function setGetLastVersion(get, getTxnId) {
	getLastVersion$1 = get;
	getLastTxnId$1 = getTxnId;
}

let moduleRequire = typeof require == 'function' && require;
function setRequire(require) {
	moduleRequire = require;
}

setGetLastVersion(getLastVersion, getLastTxnId);
let keyBytes, keyBytesView;
const { onExit, getEnvsPointer, setEnvsPointer, getEnvFlags, setJSFlags } = nativeAddon;
if (globalThis.__lmdb_envs__)
	setEnvsPointer(globalThis.__lmdb_envs__);
else
	globalThis.__lmdb_envs__ = getEnvsPointer();

// this is hard coded as an upper limit because it is important assumption of the fixed buffers in writing instructions
// this corresponds to the max key size for 8KB pages
const MAX_KEY_SIZE = 4026;
// this is used as the key size by default because default page size is OS page size, which is usually
// 4KB (but is 16KB on M-series MacOS), and this keeps a consistent max key size when no page size specified.
const DEFAULT_MAX_KEY_SIZE = 1978;
const DEFAULT_COMMIT_DELAY = 0;

const allDbs = new Map();
let defaultCompression;
let hasRegisteredOnExit;
function open(path$1, options) {
	if (nativeAddon.open) {
		if (nativeAddon.open !== open) {
			// this is the case when lmdb-js has been opened in both ESM and CJS mode, which means that there are two
			// separate JS modules, but they are both using the same native module.
			getLastVersion = nativeAddon.getLastVersion;
			getLastTxnId = nativeAddon.getLastTxnId;
			setGetLastVersion(getLastVersion, getLastTxnId);
			return nativeAddon.open(path$1, options);
		}
	} else {
		nativeAddon.open = open;
		nativeAddon.getLastVersion = getLastVersion;
		nativeAddon.getLastTxnId = getLastTxnId;
	}
	if (!keyBytes) // TODO: Consolidate get buffer and key buffer (don't think we need both)
		allocateFixedBuffer();
	if (typeof path$1 == 'object' && !options) {
		options = path$1;
		path$1 = options.path;
	}
	options = options || {};
	let noFSAccess = options.noFSAccess; // this can only be configured on open, can't let users change it
	let userOptions = options;
	if (path$1 == null) {
		options = Object.assign({
			deleteOnClose: true,
			noSync: true,
		}, options);
		path$1 = tmpdir() + '/' + Math.floor(Math.random() * 2821109907455).toString(36) + '.mdb';
	} else if (!options)
		options = {};
	let extension = path.extname(path$1);
	let name = path.basename(path$1, extension);
	let is32Bit = arch().endsWith('32');
	let remapChunks = options.remapChunks || options.encryptionKey || (options.mapSize ?
		(is32Bit && options.mapSize > 0x100000000) : // larger than fits in address space, must use dynamic maps
		is32Bit); // without a known map size, we default to being able to handle large data correctly/well*/
	let userMapSize = options.mapSize;
	options = Object.assign({
		noSubdir: Boolean(extension),
		isRoot: true,
		maxDbs: 12,
		remapChunks,
		keyBytes,
		overlappingSync: (options.noSync || options.readOnly) ? false : (os != 'win32'),
		// default map size limit of 4 exabytes when using remapChunks, since it is not preallocated and we can
		// make it super huge.
		mapSize: remapChunks ? 0x10000000000000 :
			0x20000, // Otherwise we start small with 128KB
		safeRestore: process.env.LMDB_RESTORE == 'safe',
	}, options);
	options.path = path$1;
	if (options.asyncTransactionOrder == 'strict') {
		options.strictAsyncOrder = true;
	}
	if (nativeAddon.version.major + nativeAddon.version.minor / 100 + nativeAddon.version.patch / 10000 < 0.0980) {
		options.overlappingSync = false; // not support on older versions
		options.trackMetrics = false;
		options.usePreviousSnapshot = false;
		options.safeRestore = false;
		options.remapChunks = false;
		if (!userMapSize) options.mapSize = 0x40000000; // 1 GB
	}

	if (!exists(options.noSubdir ? path.dirname(path$1) : path$1))
		fs.mkdirSync(options.noSubdir ? path.dirname(path$1) : path$1, { recursive: true }
		);
	function makeCompression(compressionOptions) {
		if (compressionOptions instanceof Compression)
			return compressionOptions;
		let useDefault = typeof compressionOptions != 'object';
		if (useDefault && defaultCompression)
			return defaultCompression;
		compressionOptions = Object.assign({
			threshold: 1000,
			dictionary: fs.readFileSync(new URL('./dict/dict.txt', (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('index.cjs', document.baseURI).href)).replace(/dist[\\\/]index.cjs$/, ''))),
			getValueBytes: makeReusableBuffer(0),
		}, compressionOptions);
		let compression = Object.assign(new Compression(compressionOptions), compressionOptions);
		if (useDefault)
			defaultCompression = compression;
		return compression;
	}

	if (options.compression)
		options.compression = makeCompression(options.compression);
	let flags =
		(options.overlappingSync ? 0x1000 : 0) |
		(options.noSubdir ? 0x4000 : 0) |
		(options.noSync ? 0x10000 : 0) |
		(options.readOnly ? 0x20000 : 0) |
		(options.noMetaSync ? 0x40000 : 0) |
		(options.useWritemap ? 0x80000 : 0) |
		(options.mapAsync ? 0x100000 : 0) |
		(options.noReadAhead ? 0x800000 : 0) |
		(options.noMemInit ? 0x1000000 : 0) |
		(options.usePreviousSnapshot ? 0x2000000 : 0) |
		(options.remapChunks ? 0x4000000 : 0) |
		(options.safeRestore ? 0x800 : 0) |
		(options.trackMetrics ? 0x400 : 0);

	let env = new Env();
	let jsFlags = (options.overlappingSync ? 0x1000 : 0) |
		(options.separateFlushed ? 1 : 0) |
		(options.deleteOnClose ? 2 : 0);
	let rc = env.open(options, flags, jsFlags);
	env.path = path$1;
   if (rc)
		lmdbError(rc);
	delete options.keyBytes; // no longer needed, don't copy to stores
	let maxKeySize = env.getMaxKeySize();
	maxKeySize = Math.min(maxKeySize, options.pageSize ? MAX_KEY_SIZE : DEFAULT_MAX_KEY_SIZE);
	flags = getEnvFlags(env.address); // re-retrieve them, they are not necessarily the same if we are connecting to an existing env
	if (flags & 0x1000) {
		if (userOptions.noSync) {
			env.close();
			throw new Error('Can not set noSync on a database that was opened with overlappingSync');
		}
	} else if (options.overlappingSync) {
		if (userOptions.overlappingSync) {
			env.close();
			throw new Error('Can not enable overlappingSync on a database that was opened without this flag');
		}
		options.overlappingSync = false;
		jsFlags = jsFlags & 0xff; // clear overlapping sync
		setJSFlags(env.address, jsFlags);
	}

	env.readerCheck(); // clear out any stale entries
	if ((options.overlappingSync || options.deleteOnClose) && !hasRegisteredOnExit && process.on) {
		hasRegisteredOnExit = true;
		process.on('exit', onExit);
	}

	class LMDBStore extends EventEmitter {
		constructor(dbName, dbOptions) {
			super();
			if (dbName === undefined)
				throw new Error('Database name must be supplied in name property (may be null for root database)');

			if (options.compression && dbOptions.compression !== false && typeof dbOptions.compression != 'object')
				dbOptions.compression = options.compression; // use the parent compression if available
			else if (dbOptions.compression)
				dbOptions.compression = makeCompression(dbOptions.compression);

			if (dbOptions.dupSort && (dbOptions.useVersions || dbOptions.cache)) {
				throw new Error('The dupSort flag can not be combined with versions or caching');
			}
			let keyIsBuffer = dbOptions.keyIsBuffer;
			if (dbOptions.keyEncoding == 'uint32') {
				dbOptions.keyIsUint32 = true;
			} else if (dbOptions.keyEncoder) {
				if (dbOptions.keyEncoder.enableNullTermination) {
					dbOptions.keyEncoder.enableNullTermination();
				} else
					keyIsBuffer = true;
			} else if (dbOptions.keyEncoding == 'binary') {
				keyIsBuffer = true;
			}
			let flags = (dbOptions.reverseKey ? 0x02 : 0) |
				(dbOptions.dupSort ? 0x04 : 0) |
				(dbOptions.dupFixed ? 0x10 : 0) |
				(dbOptions.integerDup ? 0x20 : 0) |
				(dbOptions.reverseDup ? 0x40 : 0) |
				(!options.readOnly && dbOptions.create !== false ? 0x40000 : 0) |
				(dbOptions.useVersions ? 0x100 : 0);
			let keyType = (dbOptions.keyIsUint32 || dbOptions.keyEncoding == 'uint32') ? 2 : keyIsBuffer ? 3 : 0;
			if (keyType == 2)
				flags |= 0x08; // integer key

			if (options.readOnly) {
				// in read-only mode we use a read-only txn to open the database
				// TODO: LMDB is actually not entirely thread-safe when it comes to opening databases with
				// read-only transactions since there is a race condition on setting the update dbis that
				// occurs outside the lock
				// make sure we are using a fresh read txn, so we don't want to share with a cursor txn
				this.resetReadTxn();
				this.ensureReadTxn();
				this.db = new Dbi(env, flags, dbName, keyType, dbOptions.compression);
			} else {
				this.transactionSync(() => {
					this.db = new Dbi(env, flags, dbName, keyType, dbOptions.compression);
				}, options.overlappingSync ? 0x10002 : 2); // no flush-sync, but synchronously commit
			}
			this._commitReadTxn(); // current read transaction becomes invalid after opening another db
			if (!this.db || this.db.dbi == 0xffffffff) {// not found
				throw new Error('Database not found')
			}
			this.dbAddress = this.db.address;
			this.db.name = dbName || null;
			this.name = dbName;
			this.status = 'open';
			this.env = env;
			this.reads = 0;
			this.writes = 0;
			this.transactions = 0;
			this.averageTransactionTime = 5;
			if (dbOptions.syncBatchThreshold)
				console.warn('syncBatchThreshold is no longer supported');
			if (dbOptions.immediateBatchThreshold)
				console.warn('immediateBatchThreshold is no longer supported');
			this.commitDelay = DEFAULT_COMMIT_DELAY;
			Object.assign(this, { // these are the options that are inherited
				path: options.path,
				encoding: options.encoding,
				strictAsyncOrder: options.strictAsyncOrder,
			}, dbOptions);
			let Encoder;
			if (this.encoder && this.encoder.Encoder) {
				Encoder = this.encoder.Encoder;
				this.encoder = null; // don't copy everything from the module
			}
			if (!Encoder && !(this.encoder && this.encoder.encode) && (!this.encoding || this.encoding == 'msgpack' || this.encoding == 'cbor')) {
				Encoder = (this.encoding == 'cbor' ? moduleRequire('cbor-x').Encoder : MsgpackrEncoder);
			}
			if (Encoder) {
				this.encoder = new Encoder(Object.assign(
					assignConstrainedProperties(['copyBuffers', 'getStructures', 'saveStructures', 'useFloat32', 'useRecords', 'structuredClone', 'variableMapSize', 'useTimestamp32', 'largeBigIntToFloat', 'encodeUndefinedAsNil', 'int64AsNumber', 'onInvalidDate', 'mapsAsObjects', 'useTag259ForMaps', 'pack', 'maxSharedStructures', 'shouldShareStructure', 'randomAccessStructure', 'freezeData'],
					this.sharedStructuresKey ? this.setupSharedStructures() : {
						copyBuffers: true, // need to copy any embedded buffers that are found since we use unsafe buffers
					}, options, dbOptions), this.encoder));
			}
			if (this.encoding == 'json') {
				this.encoder = {
					encode: JSON.stringify,
				};
			} else if (this.encoder) {
				this.decoder = this.encoder;
				this.decoderCopies = !this.encoder.needsStableBuffer;
			}
			this.maxKeySize = maxKeySize;
			applyKeyHandling(this);
			allDbs.set(dbName ? name + '-' + dbName : name, this);
		}
		openDB(dbName, dbOptions) {
			if (this.dupSort && this.name == null)
				throw new Error('Can not open named databases if the main database is dupSort')
			if (typeof dbName == 'object' && !dbOptions) {
				dbOptions = dbName;
				dbName = dbOptions.name;
			} else
				dbOptions = dbOptions || {};
			try {
				return dbOptions.cache ?
					new (CachingStore(LMDBStore, env))(dbName, dbOptions) :
					new LMDBStore(dbName, dbOptions);
			} catch(error) {
				if (error.message == 'Database not found')
					return; // return undefined to indicate db not found
				if (error.message.indexOf('MDB_DBS_FULL') > -1) {
					error.message += ' (increase your maxDbs option)';
				}
				throw error;
			}
		}
		open(dbOptions, callback) {
			let db = this.openDB(dbOptions);
			if (callback)
				callback(null, db);
			return db;
		}
		backup(path$1, compact) {
			if (noFSAccess)
				return;
			fs.mkdirSync(path.dirname(path$1), { recursive: true });
			return new Promise((resolve, reject) => env.copy(path$1, false, (error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			}));
		}
		isOperational() {
			return this.status == 'open';
		}
		sync(callback) {
			return env.sync(callback || function(error) {
				if (error) {
					console.error(error);
				}
			});
		}
		deleteDB() {
			console.warn('deleteDB() is deprecated, use drop or dropSync instead');
			return this.dropSync();
		}
		dropSync() {
			this.transactionSync(() =>
				this.db.drop({
					justFreePages: false
				}), options.overlappingSync ? 0x10002 : 2);
		}
		clear(callback) {
			if (typeof callback == 'function')
				return this.clearAsync(callback);
			console.warn('clear() is deprecated, use clearAsync or clearSync instead');
			this.clearSync();
		}
		clearSync() {
			if (this.encoder) {
				if (this.encoder.clearSharedData)
					this.encoder.clearSharedData();
				else if (this.encoder.structures)
					this.encoder.structures = [];
			}
			this.transactionSync(() =>
				this.db.drop({
					justFreePages: true
				}), options.overlappingSync ? 0x10002 : 2);
		}
		readerCheck() {
			return env.readerCheck();
		}
		readerList() {
			return env.readerList().join('');
		}
		setupSharedStructures() {
			const getStructures = () => {
				let lastVersion; // because we are doing a read here, we may need to save and restore the lastVersion from the last read
				if (this.useVersions)
					lastVersion = getLastVersion();
				let buffer = this.getBinary(this.sharedStructuresKey);
				if (this.useVersions)
					setLastVersion(lastVersion);
				return buffer && this.decoder.decode(buffer);
			};
			return {
				saveStructures: (structures, isCompatible) => {
					return this.transactionSync(() => {
						let existingStructuresBuffer = this.getBinary(this.sharedStructuresKey);
						let existingStructures = existingStructuresBuffer && this.decoder.decode(existingStructuresBuffer);
						if (typeof isCompatible == 'function' ?
								!isCompatible(existingStructures) :
								(existingStructures && existingStructures.length != isCompatible))
							return false; // it changed, we need to indicate that we couldn't update
						this.put(this.sharedStructuresKey, structures);
					},  options.overlappingSync ? 0x10000 : 0);
				},
				getStructures,
				copyBuffers: true, // need to copy any embedded buffers that are found since we use unsafe buffers
			};
		}
	}
	// if caching class overrides putSync, don't want to double call the caching code
	LMDBStore.prototype.putSync;
	LMDBStore.prototype.removeSync;
	addReadMethods(LMDBStore, { env, maxKeySize, keyBytes, keyBytesView, getLastVersion });
	if (!options.readOnly)
		addWriteMethods(LMDBStore, { env, maxKeySize, fixedBuffer: keyBytes,
			resetReadTxn: LMDBStore.prototype.resetReadTxn, ...options });
	LMDBStore.prototype.supports = {
		permanence: true,
		bufferKeys: true,
		promises: true,
		snapshots: true,
		clear: true,
		status: true,
		deferredOpen: true,
		openCallback: true,	
	};
	let Class = options.cache ? CachingStore(LMDBStore, env) : LMDBStore;
	return options.asClass ? Class : new Class(options.name || null, options);
}
function openAsClass(path, options) {
	if (typeof path == 'object' && !options) {
		options = path;
		path = options.path;
	}
	options = options || {};
	options.asClass = true;
	return open(path, options);
}

function getLastVersion() {
	return keyBytesView.getFloat64(16, true);
}
function setLastVersion(version) {
	return keyBytesView.setFloat64(16, version, true);
}

function getLastTxnId() {
	return keyBytesView.getUint32(32, true);
}

const KEY_BUFFER_SIZE = 4096;
function allocateFixedBuffer() {
	keyBytes = typeof Buffer != 'undefined' ? Buffer.allocUnsafeSlow(KEY_BUFFER_SIZE) : new Uint8Array(KEY_BUFFER_SIZE);
	const keyBuffer = keyBytes.buffer;
	keyBytesView = keyBytes.dataView || (keyBytes.dataView = new DataView(keyBytes.buffer, 0, KEY_BUFFER_SIZE)); // max key size is actually 4026
	keyBytes.uint32 = new Uint32Array(keyBuffer, 0, KEY_BUFFER_SIZE >> 2);
	keyBytes.float64 = new Float64Array(keyBuffer, 0, KEY_BUFFER_SIZE >> 3);
	keyBytes.uint32.address = keyBytes.address = keyBuffer.address = getAddress(keyBuffer);
}

function exists(path) {
	if (fs.existsSync)
		return fs.existsSync(path);
	try {
		return fs.statSync(path);
	} catch (error) {
		return false
	}
}

function assignConstrainedProperties(allowedProperties, target) {
	for (let i = 2; i < arguments.length; i++) {
		let source = arguments[i];
		for (let key in source) {
			if (allowedProperties.includes(key))
				target[key] = source[key];
		}
	}
	return target;
}

function levelup(store) {
	return Object.assign(Object.create(store), {
		get(key, options, callback) {
			let result = store.get(key);
			if (typeof options == 'function')
				callback = options;
			if (callback) {
				if (result === undefined)
					callback(new NotFoundError());
				else
					callback(null, result);
			} else {
				if (result === undefined)
					return Promise.reject(new NotFoundError());
				else
					return Promise.resolve(result);
			}
		},
	});
}
class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NotFoundError';
		this.notFound = true;
	}
}

orderedBinary__namespace.enableNullTermination();
setExternals({
	arch: os$1.arch, fs: fs__default["default"], tmpdir: os$1.tmpdir, MsgpackrEncoder: msgpackr.Encoder, WeakLRUCache: weakLruCache.WeakLRUCache, orderedBinary: orderedBinary__namespace,
	EventEmitter: events.EventEmitter, os: os$1.platform(), onExit(callback) {
		if (process.getMaxListeners() < process.listenerCount('exit') + 8)
			process.setMaxListeners(process.listenerCount('exit') + 8);
		process.on('exit', callback);
	},
});
let { noop } = nativeAddon;
const TransactionFlags = {
	ABORTABLE: 1,
	SYNCHRONOUS_COMMIT: 2,
	NO_SYNC_FLUSH: 0x10000,
};
var index = {
	open, openAsClass, getLastVersion, compareKey: orderedBinary$1.compareKeys, keyValueToBuffer: orderedBinary$1.toBufferKey, bufferToKeyValue: orderedBinary$1.fromBufferKey, ABORT, IF_EXISTS: IF_EXISTS$1, asBinary, levelup, TransactionFlags
};

let require$1 = module$1.createRequire((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('index.cjs', document.baseURI).href)));
setRequire(require$1);
exports.v8AccelerationEnabled = false;

let versions = process.versions;
if (!versions.deno && !process.isBun) {
	let [ majorVersion, minorVersion ] = versions.node.split('.');
	if (versions.v8 && +majorVersion == nativeAddon.version.nodeCompiledVersion) {
		let v8Funcs = {};
		let fastApiCalls = (majorVersion == 17 || majorVersion == 18 || majorVersion == 16 && minorVersion > 8) && !process.env.DISABLE_TURBO_CALLS;
		if (fastApiCalls) {
			require$1('v8').setFlagsFromString('--turbo-fast-api-calls');
		}
		nativeAddon.enableDirectV8(v8Funcs, fastApiCalls);
		Object.assign(nativeAddon, v8Funcs);
		exports.v8AccelerationEnabled = true;
	} else if (majorVersion == 14) {
		// node v14 only has ABI compatibility with node v16 for zero-arg clearKeptObjects
		let v8Funcs = {};
		nativeAddon.enableDirectV8(v8Funcs, false);
		nativeAddon.clearKeptObjects = v8Funcs.clearKeptObjects;
	}
	nativeAddon.enableThreadSafeCalls();
}
setNativeFunctions(nativeAddon);

Object.defineProperty(exports, 'bufferToKeyValue', {
	enumerable: true,
	get: function () { return orderedBinary$1.fromBufferKey; }
});
Object.defineProperty(exports, 'compareKey', {
	enumerable: true,
	get: function () { return orderedBinary$1.compareKeys; }
});
Object.defineProperty(exports, 'compareKeys', {
	enumerable: true,
	get: function () { return orderedBinary$1.compareKeys; }
});
Object.defineProperty(exports, 'keyValueToBuffer', {
	enumerable: true,
	get: function () { return orderedBinary$1.toBufferKey; }
});
exports.ABORT = ABORT;
exports.IF_EXISTS = IF_EXISTS$1;
exports.SKIP = SKIP;
exports.TransactionFlags = TransactionFlags;
exports.allDbs = allDbs;
exports.asBinary = asBinary;
exports["default"] = index;
exports.getLastTxnId = getLastTxnId;
exports.getLastVersion = getLastVersion;
exports.levelup = levelup;
exports.nativeAddon = nativeAddon;
exports.noop = noop;
exports.open = open;
exports.openAsClass = openAsClass;
//# sourceMappingURL=index.cjs.map
