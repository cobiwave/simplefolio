declare namespace lmdb {
	export function open<V = any, K extends Key = Key>(path: string, options: RootDatabaseOptions): RootDatabase<V, K>
	export function open<V = any, K extends Key = Key>(options: RootDatabaseOptionsWithPath): RootDatabase<V, K>
	export function openAsClass<V = any, K extends Key = Key>(options: RootDatabaseOptionsWithPath): DatabaseClass<V, K>

	class Database<V = any, K extends Key = Key> {
		/**
		* Get the value stored by given id/key
		* @param id The key for the entry
		* @param options Additional options for the retrieval
		**/
		get(id: K, options?: GetOptions): V | undefined
		/**
		* Get the entry stored by given id/key, which includes both the value and the version number (if available)
		* @param id The key for the entry
	 	* @param options Additional options for the retrieval
		**/
		getEntry(id: K, options?: GetOptions): {
			value: V
			version?: number
		} | undefined

		/**
		* Get the value stored by given id/key in binary format, as a Buffer
		* @param id The key for the entry
		**/
		getBinary(id: K): Buffer | undefined

		/**
		* Get the value stored by given id/key in binary format, as a temporary Buffer.
		* This is faster, but the data is only valid until the next get operation (then it will be overwritten).
		* @param id The key for the entry
		**/
		getBinaryFast(id: K): Buffer | undefined

		/**
		 * For random access structures and "fast" binary data, the underlying data is volatile,
		 * and not safe to access after the next get. This function allows the data to
		 * be copied as needed for safe access in the future. This can be used with buffers and random
		 * access data structures.
		 * @param data The data to be copied
		 **/
		retain(data: any): any

		/**
		* Asynchronously fetch the values stored by the given ids and accesses all 
		* pages to ensure that any hard page faults and disk I/O are performed
		* asynchronously in a separate thread. Once completed, synchronous
		* gets to the same entries will most likely be in memory and fast.
		* @param ids The keys for the entries to prefetch
		**/
		prefetch(ids: K[], callback?: Function): Promise<void>

		/**
		* Asynchronously get the values stored by the given ids and return the
		* values in array corresponding to the array of ids.
		* @param ids The keys for the entries to get
		**/
		getMany(ids: K[], callback?: (error: any, values: V[]) => any): Promise<(V | undefined)[]>

		/**
		* Store the provided value, using the provided id/key
		* @param id The key for the entry
		* @param value The value to store
		**/
		put(id: K, value: V): Promise<boolean>
		/**
		* Store the provided value, using the provided id/key and version number, and optionally the required
		* existing version
		* @param id The key for the entry
		* @param value The value to store
		* @param version The version number to assign to this entry
		* @param ifVersion If provided the put will only succeed if the previous version number matches this (atomically checked)
		**/
		put(id: K, value: V, version: number, ifVersion?: number): Promise<boolean>
		/**
		* Remove the entry with the provided id/key
		* @param id The key for the entry to remove
		**/
		remove(id: K): Promise<boolean>
		/**
		* Remove the entry with the provided id/key, conditionally based on the provided existing version number
		* @param id The key for the entry to remove
		* @param ifVersion If provided the remove will only succeed if the previous version number matches this (atomically checked)
		**/
		remove(id: K, ifVersion: number): Promise<boolean>
		/**
		* Remove the entry with the provided id/key and value (mainly used for dupsort databases) and optionally the required
		* existing version
		* @param id The key for the entry to remove
		* @param valueToRemove The value for the entry to remove
		**/
		remove(id: K, valueToRemove: V): Promise<boolean>
		/**
		* Synchronously store the provided value, using the provided id/key, will return after the data has been written.
		* @param id The key for the entry
		* @param value The value to store
		**/
		putSync(id: K, value: V): void
		/**
		* Synchronously store the provided value, using the provided id/key and version number
		* @param id The key for the entry
		* @param value The value to store
		* @param version The version number to assign to this entry
		**/
		putSync(id: K, value: V, version: number): void
		/**
		* Synchronously store the provided value, using the provided id/key and options
		* @param id The key for the entry
		* @param value The value to store
		* @param options The version number to assign to this entry
		**/
		putSync(id: K, value: V, options: PutOptions): void
		/**
		* Synchronously remove the entry with the provided id/key
		* existing version
		* @param id The key for the entry to remove
		**/
		removeSync(id: K): boolean
		/**
		* Synchronously remove the entry with the provided id/key and value (mainly used for dupsort databases)
		* existing version
		* @param id The key for the entry to remove
		* @param valueToRemove The value for the entry to remove
		**/
		removeSync(id: K, valueToRemove: V): boolean
		/**
		* Get all the values for the given key (for dupsort databases)
		* existing version
		* @param key The key for the entry to remove
		* @param options The options for the iterator
		**/
		getValues(key: K, options?: RangeOptions): RangeIterable<V>
		/**
		* Get the count of all the values for the given key (for dupsort databases)
		* existing version
		* @param options The options for the range/iterator
		**/
		getValuesCount(key: K, options?: RangeOptions): number
		/**
		* Get all the unique keys for the given range
		* existing version
		* @param options The options for the range/iterator
		**/
		getKeys(options?: RangeOptions): RangeIterable<K>
		/**
		* Get the count of all the unique keys for the given range
		* existing version
		* @param options The options for the range/iterator
		**/
		getKeysCount(options?: RangeOptions): number
		/**
		* Get all the entries for the given range
		* existing version
		* @param options The options for the range/iterator
		**/
		getRange(options?: RangeOptions): RangeIterable<{ key: K, value: V, version?: number }>
		/**
		* Get the count of all the entries for the given range
		* existing version
		* @param options The options for the range/iterator
		**/
		getCount(options?: RangeOptions): number
		/**
		 * @deprecated since version 2.0, use transaction() instead
		 */
		transactionAsync<T>(action: () => T): T
		/**
		* Execute a transaction asynchronously, running all the actions within the action callback in the transaction,
		* and committing the transaction after the action callback completes.
		* existing version
		* @param action The function to execute within the transaction
		**/
		transaction<T>(action: () => T): Promise<T>
		/**
		* Execute a transaction synchronously, running all the actions within the action callback in the transaction,
		* and committing the transaction after the action callback completes.
		* existing version
		* @param action The function to execute within the transaction
		* @params flags Additional flags specifying transaction behavior, this is optional and defaults to abortable, synchronous commits that are flushed to disk before returning
		**/
		transactionSync<T>(action: () => T, flags?: TransactionFlags): T
		/**
		* Execute a transaction asynchronously, running all the actions within the action callback in the transaction,
		* and committing the transaction after the action callback completes.
		* existing version
		* @param action The function to execute within the transaction
		**/
		childTransaction<T>(action: () => T): Promise<T>
		/**
		* Returns the current transaction and marks it as in use. This can then be explicitly used for read operations
		* @returns The transaction object
		**/
		useReadTransaction(): Transaction
		/**
		* Execute a set of write operations that will all be batched together in next queued asynchronous transaction.
		* @param action The function to execute with a set of write operations.
		**/
		batch<T>(action: () => any): Promise<boolean>
		/**
		* Execute writes actions that are all conditionally dependent on the entry with the provided key having the provided
		* version number (checked atomically).
		* @param id Key of the entry to check
		* @param ifVersion The require version number of the entry for all actions to succeed
		* @param action The function to execute with actions that will be dependent on this condition
		**/
		ifVersion(id: K, ifVersion: number, action: () => any): Promise<boolean>
		/**
		* Execute writes actions that are all conditionally dependent on the entry with the provided key
		* not existing (checked atomically).
		* @param id Key of the entry to check
		* @param action The function to execute with actions that will be dependent on this condition
		**/
		ifNoExists(id: K, action: () => any): Promise<boolean>
		/**
		* Check if an entry for the provided key exists
		* @param id Key of the entry to check
		*/
		doesExist(key: K): boolean
		/**
		* Check if an entry for the provided key/value exists
		* @param id Key of the entry to check
		* @param value Value of the entry to check
		*/
		doesExist(key: K, value: V): boolean
		/**
		* Check if an entry for the provided key exists with the expected version
		* @param id Key of the entry to check
		* @param version Expected version
		*/
		doesExist(key: K, version: number): boolean
		/**
		* @deprecated since version 2.0, use drop() or dropSync() instead
		*/
		deleteDB(): Promise<void>
		/**
		* Delete this database/store (asynchronously).
		**/
		drop(): Promise<void>
		/**
		* Synchronously delete this database/store.
		**/
		dropSync(): void
		/**
		* @deprecated since version 2.0, use clearAsync() or clearSync() instead
		*/
		clear(): Promise<void>
		/**
		* Asynchronously clear all the entries from this database/store.
		**/
		clearAsync(): Promise<void>
		/**
		* Synchronously clear all the entries from this database/store.
		**/
		clearSync(): void
		/** A promise-like object that resolves when previous writes have been committed.  */
		committed: Promise<boolean>
		/** A promise-like object that resolves when previous writes have been committed and fully flushed/synced to disk/storage.  */
		flushed: Promise<boolean>
		/**
		* Check the reader locks and remove any stale reader locks. Returns the number of stale locks that were removed.
		**/
		readerCheck(): number
		/**
		* Returns a string that describes all the current reader locks, useful for debugging if reader locks aren't being removed.
		**/
		readerList(): string
		/**
		* Returns statistics about the current database
		**/
		getStats(): {}
		/**
		* Explicitly force the read transaction to reset to the latest snapshot/version of the database
		**/
		resetReadTxn(): void
		/**
		* Make a snapshot copy of the current database at the indicated path
	  * @param path Path to store the backup
		* @param compact Apply compaction while making the backup (slower and smaller)
		**/
		backup(path: string, compact: boolean): Promise<void>
		/**
		* Close the current database.
		**/
		close(): Promise<void>
		/**
		 * Add event listener
		 */
		on(event: 'beforecommit' | 'aftercommit', callback: (event: any) => void): void
	}
	/* A constant that can be returned from a transaction to indicate that the transaction should be aborted */
	export const ABORT: {};
	/* A constant that can be returned in RangeIterable#map function to skip (filter out) the current value */
	export const SKIP: {};
	/* A constant that can be used as a conditional versions for put and ifVersion to indicate that the write should conditional on the key/entry existing */
	export const IF_EXISTS: number;
	class RootDatabase<V = any, K extends Key = Key> extends Database<V, K> {
		/**
		* Open a database store using the provided options.
		**/
		openDB<OV = V, OK extends Key = K>(options?: DatabaseOptions & { name: string }): Database<OV, OK>
		/**
		* Open a database store using the provided options.
		**/
		openDB<OV = V, OK extends Key = K>(dbName: string, dbOptions: DatabaseOptions): Database<OV, OK>
	}
	class DatabaseClass<V = any, K extends Key = Key> {
		new(name: string | null, options: DatabaseOptions): Database<V, K>
	}

	type Key = Key[] | string | symbol | number | boolean | Uint8Array;

	interface DatabaseOptions {
		name?: string
		cache?: boolean | {}
		compression?: boolean | CompressionOptions
		encoding?: 'msgpack' | 'json' | 'string' | 'binary' | 'ordered-binary'
		sharedStructuresKey?: Key
		useVersions?: boolean
		keyEncoding?: 'uint32' | 'binary' | 'ordered-binary'
		dupSort?: boolean
		strictAsyncOrder?: boolean
	}
	interface RootDatabaseOptions extends DatabaseOptions {
		/** The maximum number of databases to be able to open (there is some extra overhead if this is set very high).*/
		maxDbs?: number
		/** Set a longer delay (in milliseconds) to wait longer before committing writes to increase the number of writes per transaction (higher latency, but more efficient) **/
		commitDelay?: number
		/**
		 * This can be used to specify the initial amount of how much virtual memory address space (in bytes) to allocate for mapping to the database files.
		 * Setting a map size will typically disable remapChunks by default unless the size is larger than appropriate for the OS. Different OSes have different allocation limits.
		 **/
		mapSize?: number
		/** 
		 * This defines the page size of the database. This defaults to the default page size of the OS (usually 4,096, except on MacOS with M-series, which is 16,384 bytes).
		 * You may want to consider setting this to 8,192 for databases larger than available memory (and moreso if you have range queries) or 4,096 for databases that can mostly cache in memory.
		 * Note that this only effects the page size of new databases (does not affect existing databases). */
		pageSize?: number
		/** This enables committing transactions where LMDB waits for a transaction to be fully flushed to disk after the transaction has been committed and defaults to being enabled on non-Windows OSes. This option is discussed in more detail below. */
		overlappingSync?: boolean
		/** Resolve asynchronous operations when commits are finished and visible and include a separate promise for when a commit is flushed to disk, as a flushed property on the commit promise. Note that you can alternately use the flushed property on the database. */
		separateFlushed?: boolean
		/** 
		 * This a flag to specify if dynamic memory mapping should be used. Enabling this generally makes read operations a little bit slower, but frees up more mapped memory, making it friendlier to other applications.
		 * This is enabled by default on 32-bit operating systems (which require this to go beyond 4GB database size) if mapSize is not specified, otherwise it is disabled by default.
		 **/
		remapChunks?: boolean
		/** This provides a small performance boost (when not using useWritemap) for writes, by skipping zero'ing out malloc'ed data, but can leave application data in unused portions of the database. This is recommended unless there are concerns of database files being accessible. */
		noMemInit?: boolean
		/** Use writemaps, discouraged at this. This improves performance by reducing malloc calls, but it is possible for a stray pointer to corrupt data. */
		useWritemap?: boolean
		/** Treat path as a filename instead of directory (this is the default if the path appears to end with an extension and has '.' in it) */
		noSubdir?: boolean
		/** 
		 * Does not explicitly flush data to disk at all. This can be useful for temporary databases where durability/integrity is not necessary, and can significantly improve write performance that is I/O bound.
		 * However, we discourage this flag for data that needs integrity and durability in storage, since it can result in data loss/corruption if the computer crashes.
		 **/
		noSync?: boolean
		/** This isn't as dangerous as `noSync`, but doesn't improve performance much either. */
		noMetaSync?: boolean
		/** Self-descriptive */
		readOnly?: boolean
		/** The maximum number of concurrent read transactions (readers) to be able to open ([more information](http://www.lmdb.tech/doc/group__mdb.html#gae687966c24b790630be2a41573fe40e2)). */
		maxReaders?: number
		/** This enables encryption, and the provided value is the key that is used for encryption. This may be a buffer or string, but must be 32 bytes/characters long. This uses the Chacha8 cipher for fast and secure on-disk encryption of data. */
		encryptionKey?: string | Buffer
		/**
		 * This is enabled by default and will ensure that all asynchronous write operations performed in the same event turn will be batched together into the same transaction.
		 * Disabling this allows lmdb-js to commit a transaction at any time, and asynchronous operations will only be guaranteed to be in the same transaction if explicitly batched together (with transaction, batch, ifVersion).
		 * If this is disabled (set to false), you can control how many writes can occur before starting a transaction with txnStartThreshold (allow a transaction will still be started at the next event turn if the threshold is not met).
		 * Disabling event turn batching (and using lower txnStartThreshold values) can facilitate a faster response time to write operations. txnStartThreshold defaults to 5. 
		 **/
		eventTurnBatching?: boolean
	}
	interface RootDatabaseOptionsWithPath extends RootDatabaseOptions {
		path?: string
	}
	interface CompressionOptions {
		threshold?: number
		dictionary?: Buffer
	}
	interface GetOptions {
		transaction?: Transaction
	}
	interface RangeOptions {
		/** Starting key for a range **/
		start?: Key
		/** Ending key for a range **/
		end?: Key
		/** Iterate through the entries in reverse order **/
		reverse?: boolean
		/** Include version numbers in each entry returned **/
		versions?: boolean
		/** The maximum number of entries to return **/
		limit?: number
		/** The number of entries to skip **/
		offset?: number
		/** Use a snapshot of the database from when the iterator started **/
		snapshot?: boolean
		/** Use the provided transaction for this range query */
		transaction?: Transaction
	}
	interface PutOptions {
		/* Append to the database using MDB_APPEND, which can be faster */
		append?: boolean
		/* Append to a dupsort database using MDB_APPENDDUP, which can be faster */
		appendDup?: boolean
		/* Perform put with MDB_NOOVERWRITE which will fail if the entry for the key already exists */
		noOverwrite?: boolean
		/* Perform put with MDB_NODUPDATA which will fail if the entry for the key/value already exists */
		noDupData?: boolean
		/* The version of the entry to set */
		version?: number
	}
	export enum TransactionFlags {
		/* Indicates that the transaction needs to be abortable */
		ABORTABLE = 1,
		/* Indicates that the transaction needs to be committed before returning */
		SYNCHRONOUS_COMMIT = 2,
		/* Indicates that the function can return before the transaction has been flushed to disk */
		NO_SYNC_FLUSH = 0x10000
	}
	class RangeIterable<T> implements Iterable<T> {
		map<U>(callback: (entry: T) => U): RangeIterable<U>
		flatMap<U>(callback: (entry: T) => U[]): RangeIterable<U>
		slice(start: number, end: number): RangeIterable<T>
		filter(callback: (entry: T) => any): RangeIterable<T>
		[Symbol.iterator]() : Iterator<T>
		forEach(callback: (entry: T) => any): void
		onDone?: Function
		asArray: T[]
	}
	class Transaction {
		/**
		 * When there is no more need for the transaction and it can be closed.
		 */
		done(): void
	}
	export function getLastVersion(): number
	export function compareKeys(a: Key, b: Key): number
	class Binary {}
	/* Wrap a Buffer/Uint8Array for direct assignment as a value bypassing any encoding, for put (and doesExist) operations.
	*/
	export function asBinary(buffer: Uint8Array): Binary
	/* Indicates if V8 accelerated functions are enabled. If this is false, some functions will be a little slower, and you may want to npm install --build-from-source to enable maximum performance */
	export let v8AccelerationEnabled: boolean
	/* Return database augmented with methods to better conform to levelup */ 
	export function levelup(database: Database): Database
}
export = lmdb
