import { WeakLRUCache, clearKeptObjects } from './native.js';
import { FAILED_CONDITION, ABORT, IF_EXISTS } from './write.js';
import { UNMODIFIED } from './read.js';
import { when } from './util/when.js';

let getLastVersion, getLastTxnId;
const mapGet = Map.prototype.get;
export const CachingStore = (Store, env) => {
	let childTxnChanges
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
			options.cache.clearKeptObjects = clearKeptObjects;
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
				entry.version = getLastVersion();
			}
			if (this.cache.validated)
				entry.txnId = getLastTxnId();
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
			entry.version = getLastVersion();
		if (this.cache.validated)
			entry.txnId = getLastTxnId();
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
				return versionOrValue === IF_EXISTS || entry.version === versionOrValue;
			}
		}
		return super.doesExist(key, versionOrValue);
	}
	};
};
export function setGetLastVersion(get, getTxnId) {
	getLastVersion = get;
	getLastTxnId = getTxnId;
}
