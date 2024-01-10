/**
 * Cloud Firestore
 *
 * @packageDocumentation
 */
import { FirebaseApp } from '@firebase/app';
import { LogLevelString as LogLevel } from '@firebase/logger';
import { EmulatorMockTokenOptions } from '@firebase/util';
import { FirebaseError } from '@firebase/util';

/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @returns A `Promise` resolved with a `DocumentReference` pointing to the
 * newly created document after it has been written to the backend (Note that it
 * won't resolve while you're offline).
 */
export declare function addDoc<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): Promise<DocumentReference<AppModelType, DbModelType>>;
/**
 * Returns a new map where every key is prefixed with the outer key appended
 * to a dot.
 */
export declare type AddPrefixToKeys<Prefix extends string, T extends Record<string, unknown>> = {
    [K in keyof T & string as `${Prefix}.${K}`]+?: string extends K ? any : T[K];
};
/**
 * Represents an aggregation that can be performed by Firestore.
 */
export declare class AggregateField<T> {
    /** A type string to uniquely identify instances of this class. */
    readonly type = "AggregateField";
    /** Indicates the aggregation operation of this AggregateField. */
    readonly aggregateType: AggregateType;
}
/**
 * Compares two 'AggregateField` instances for equality.
 *
 * @param left Compare this AggregateField to the `right`.
 * @param right Compare this AggregateField to the `left`.
 */
export declare function aggregateFieldEqual(left: AggregateField<unknown>, right: AggregateField<unknown>): boolean;
/**
 * The union of all `AggregateField` types that are supported by Firestore.
 */
export declare type AggregateFieldType = ReturnType<typeof sum> | ReturnType<typeof average> | ReturnType<typeof count>;
/**
 * The results of executing an aggregation query.
 */
export declare class AggregateQuerySnapshot<AggregateSpecType extends AggregateSpec, AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /** A type string to uniquely identify instances of this class. */
    readonly type = "AggregateQuerySnapshot";
    /**
     * The underlying query over which the aggregations recorded in this
     * `AggregateQuerySnapshot` were performed.
     */
    readonly query: Query<AppModelType, DbModelType>;
    private constructor();
    /**
     * Returns the results of the aggregations performed over the underlying
     * query.
     *
     * The keys of the returned object will be the same as those of the
     * `AggregateSpec` object specified to the aggregation method, and the values
     * will be the corresponding aggregation result.
     *
     * @returns The results of the aggregations performed over the underlying
     * query.
     */
    data(): AggregateSpecData<AggregateSpecType>;
}
/**
 * Compares two `AggregateQuerySnapshot` instances for equality.
 *
 * Two `AggregateQuerySnapshot` instances are considered "equal" if they have
 * underlying queries that compare equal, and the same data.
 *
 * @param left - The first `AggregateQuerySnapshot` to compare.
 * @param right - The second `AggregateQuerySnapshot` to compare.
 *
 * @returns `true` if the objects are "equal", as defined above, or `false`
 * otherwise.
 */
export declare function aggregateQuerySnapshotEqual<AggregateSpecType extends AggregateSpec, AppModelType, DbModelType extends DocumentData>(left: AggregateQuerySnapshot<AggregateSpecType, AppModelType, DbModelType>, right: AggregateQuerySnapshot<AggregateSpecType, AppModelType, DbModelType>): boolean;
/**
 * Specifies a set of aggregations and their aliases.
 */
export declare interface AggregateSpec {
    [field: string]: AggregateFieldType;
}
/**
 * A type whose keys are taken from an `AggregateSpec`, and whose values are the
 * result of the aggregation performed by the corresponding `AggregateField`
 * from the input `AggregateSpec`.
 */
export declare type AggregateSpecData<T extends AggregateSpec> = {
    [P in keyof T]: T[P] extends AggregateField<infer U> ? U : never;
};
/**
 * Union type representing the aggregate type to be performed.
 */
export declare type AggregateType = 'count' | 'avg' | 'sum';
/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a conjunction of
 * the given filter constraints. A conjunction filter includes a document if it
 * satisfies all of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a conjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
export declare function and(...queryConstraints: QueryFilterConstraint[]): QueryCompositeFilterConstraint;
/**
 * Returns a special value that can be used with {@link (setDoc:1)} or {@link
 * updateDoc:1} that tells the server to remove the given elements from any
 * array value that already exists on the server. All instances of each element
 * specified will be removed from the array. If the field being modified is not
 * already an array it will be overwritten with an empty array.
 *
 * @param elements - The elements to remove from the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`
 */
export declare function arrayRemove(...elements: unknown[]): FieldValue;
/**
 * Returns a special value that can be used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link
 * @firebase/firestore/lite#(updateDoc:1)} that tells the server to union the given elements with any array
 * value that already exists on the server. Each specified element that doesn't
 * already exist in the array will be added to the end. If the field being
 * modified is not already an array it will be overwritten with an array
 * containing exactly the specified elements.
 *
 * @param elements - The elements to union into the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`.
 */
export declare function arrayUnion(...elements: unknown[]): FieldValue;
/* Excluded from this release type: AuthTokenFactory */
/* Excluded from this release type: _AutoId */
/**
 * Create an AggregateField object that can be used to compute the average of
 * a specified field over a range of documents in the result set of a query.
 * @param field Specifies the field to average across the result set.
 */
export declare function average(field: string | FieldPath): AggregateField<number | null>;
/**
 * An immutable object representing an array of bytes.
 */
export declare class Bytes {
    private constructor();
    /**
     * Creates a new `Bytes` object from the given Base64 string, converting it to
     * bytes.
     *
     * @param base64 - The Base64 string used to create the `Bytes` object.
     */
    static fromBase64String(base64: string): Bytes;
    /**
     * Creates a new `Bytes` object from the given Uint8Array.
     *
     * @param array - The Uint8Array used to create the `Bytes` object.
     */
    static fromUint8Array(array: Uint8Array): Bytes;
    /**
     * Returns the underlying bytes as a Base64-encoded string.
     *
     * @returns The Base64-encoded string created from the `Bytes` object.
     */
    toBase64(): string;
    /**
     * Returns the underlying bytes in a new `Uint8Array`.
     *
     * @returns The Uint8Array created from the `Bytes` object.
     */
    toUint8Array(): Uint8Array;
    /**
     * Returns a string representation of the `Bytes` object.
     *
     * @returns A string representation of the `Bytes` object.
     */
    toString(): string;
    /**
     * Returns true if this `Bytes` object is equal to the provided one.
     *
     * @param other - The `Bytes` object to compare against.
     * @returns true if this `Bytes` object is equal to the provided one.
     */
    isEqual(other: Bytes): boolean;
}
/* Excluded from this release type: _ByteString */
/**
 * Constant used to indicate the LRU garbage collection should be disabled.
 * Set this value as the `cacheSizeBytes` on the settings passed to the
 * {@link Firestore} instance.
 */
export declare const CACHE_SIZE_UNLIMITED = -1;
/**
 * Helper for calculating the nested fields for a given type T1. This is needed
 * to distribute union types such as `undefined | {...}` (happens for optional
 * props) or `{a: A} | {b: B}`.
 *
 * In this use case, `V` is used to distribute the union types of `T[K]` on
 * `Record`, since `T[K]` is evaluated as an expression and not distributed.
 *
 * See https://www.typescriptlang.org/docs/handbook/advanced-types.html#distributive-conditional-types
 */
export declare type ChildUpdateFields<K extends string, V> = V extends Record<string, unknown> ? AddPrefixToKeys<K, UpdateData<V>> : never;
/**
 * Clears the persistent storage. This includes pending writes and cached
 * documents.
 *
 * Must be called while the {@link Firestore} instance is not started (after the app is
 * terminated or when the app is first initialized). On startup, this function
 * must be called before other functions (other than {@link
 * initializeFirestore} or {@link (getFirestore:1)})). If the {@link Firestore}
 * instance is still running, the promise will be rejected with the error code
 * of `failed-precondition`.
 *
 * Note: `clearIndexedDbPersistence()` is primarily intended to help write
 * reliable tests that use Cloud Firestore. It uses an efficient mechanism for
 * dropping existing data but does not attempt to securely overwrite or
 * otherwise make cached data unrecoverable. For applications that are sensitive
 * to the disclosure of cached data in between user sessions, we strongly
 * recommend not enabling persistence at all.
 *
 * @param firestore - The {@link Firestore} instance to clear persistence for.
 * @returns A `Promise` that is resolved when the persistent storage is
 * cleared. Otherwise, the promise is rejected with an error.
 */
export declare function clearIndexedDbPersistence(firestore: Firestore): Promise<void>;
/**
 * Gets a `CollectionReference` instance that refers to the collection at
 * the specified absolute path.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments to apply relative to the first
 * argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
export declare function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;
/**
 * Gets a `CollectionReference` instance that refers to a subcollection of
 * `reference` at the the specified relative path.
 *
 * @param reference - A reference to a collection.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments to apply relative to the first
 * argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
export declare function collection<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;
/**
 * Gets a `CollectionReference` instance that refers to a subcollection of
 * `reference` at the the specified relative path.
 *
 * @param reference - A reference to a Firestore document.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
export declare function collection<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;
/**
 * Creates and returns a new `Query` instance that includes all documents in the
 * database that are contained in a collection or subcollection with the
 * given `collectionId`.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param collectionId - Identifies the collections to query over. Every
 * collection or subcollection with this ID as the last segment of its path
 * will be included. Cannot contain a slash.
 * @returns The created `Query`.
 */
export declare function collectionGroup(firestore: Firestore, collectionId: string): Query<DocumentData, DocumentData>;
/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using {@link (query:1)}).
 */
export declare class CollectionReference<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> extends Query<AppModelType, DbModelType> {
    /** The type of this Firestore reference. */
    readonly type = "collection";
    private constructor();
    /** The collection's identifier. */
    get id(): string;
    /**
     * A string representing the path of the referenced collection (relative
     * to the root of the database).
     */
    get path(): string;
    /**
     * A reference to the containing `DocumentReference` if this is a
     * subcollection. If this isn't a subcollection, the reference is null.
     */
    get parent(): DocumentReference<DocumentData, DocumentData> | null;
    /**
     * Applies a custom data converter to this `CollectionReference`, allowing you
     * to use your own custom model objects with Firestore. When you call {@link
     * addDoc} with the returned `CollectionReference` instance, the provided
     * converter will convert between Firestore data of type `NewDbModelType` and
     * your custom type `NewAppModelType`.
     *
     * @param converter - Converts objects to and from Firestore.
     * @returns A `CollectionReference` that uses the provided converter.
     */
    withConverter<NewAppModelType, NewDbModelType extends DocumentData = DocumentData>(converter: FirestoreDataConverter<NewAppModelType, NewDbModelType>): CollectionReference<NewAppModelType, NewDbModelType>;
    /**
     * Removes the current converter.
     *
     * @param converter - `null` removes the current converter.
     * @returns A `CollectionReference<DocumentData, DocumentData>` that does not
     * use a converter.
     */
    withConverter(converter: null): CollectionReference<DocumentData, DocumentData>;
}
/**
 * Modify this instance to communicate with the Cloud Firestore emulator.
 *
 * Note: This must be called before this instance has been used to do any
 * operations.
 *
 * @param firestore - The `Firestore` instance to configure to connect to the
 * emulator.
 * @param host - the emulator host (ex: localhost).
 * @param port - the emulator port (ex: 9000).
 * @param options.mockUserToken - the mock auth token to use for unit testing
 * Security Rules.
 */
export declare function connectFirestoreEmulator(firestore: Firestore, host: string, port: number, options?: {
    mockUserToken?: EmulatorMockTokenOptions | string;
}): void;
/**
 * Create an AggregateField object that can be used to compute the count of
 * documents in the result set of a query.
 */
export declare function count(): AggregateField<number>;
/**
 * Removes all persistent cache indexes.
 *
 * Please note this function will also deletes indexes generated by
 * `setIndexConfiguration()`, which is deprecated.
 */
export declare function deleteAllPersistentCacheIndexes(indexManager: PersistentCacheIndexManager): void;
/**
 * Deletes the document referred to by the specified `DocumentReference`.
 *
 * @param reference - A reference to the document to delete.
 * @returns A Promise resolved once the document has been successfully
 * deleted from the backend (note that it won't resolve while you're offline).
 */
export declare function deleteDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<void>;
/**
 * Returns a sentinel for use with {@link @firebase/firestore/lite#(updateDoc:1)} or
 * {@link @firebase/firestore/lite#(setDoc:1)} with `{merge: true}` to mark a field for deletion.
 */
export declare function deleteField(): FieldValue;
/**
 * Disables network usage for this instance. It can be re-enabled via {@link
 * enableNetwork}. While the network is disabled, any snapshot listeners,
 * `getDoc()` or `getDocs()` calls will return results from cache, and any write
 * operations will be queued until the network is restored.
 *
 * @returns A `Promise` that is resolved once the network has been disabled.
 */
export declare function disableNetwork(firestore: Firestore): Promise<void>;
/**
 * Stops creating persistent cache indexes automatically for local query
 * execution. The indexes which have been created by calling
 * `enablePersistentCacheIndexAutoCreation()` still take effect.
 */
export declare function disablePersistentCacheIndexAutoCreation(indexManager: PersistentCacheIndexManager): void;
/**
 * Gets a `DocumentReference` instance that refers to the document at the
 * specified absolute path.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param path - A slash-separated path to a document.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
export declare function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference<DocumentData, DocumentData>;
/**
 * Gets a `DocumentReference` instance that refers to a document within
 * `reference` at the specified relative path. If no path is specified, an
 * automatically-generated unique ID will be used for the returned
 * `DocumentReference`.
 *
 * @param reference - A reference to a collection.
 * @param path - A slash-separated path to a document. Has to be omitted to use
 * auto-genrated IDs.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
export declare function doc<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, path?: string, ...pathSegments: string[]): DocumentReference<AppModelType, DbModelType>;
/**
 * Gets a `DocumentReference` instance that refers to a document within
 * `reference` at the specified relative path.
 *
 * @param reference - A reference to a Firestore document.
 * @param path - A slash-separated path to a document.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
export declare function doc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): DocumentReference<DocumentData, DocumentData>;
/**
 * A `DocumentChange` represents a change to the documents matching a query.
 * It contains the document affected and the type of change that occurred.
 */
export declare interface DocumentChange<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /** The type of change ('added', 'modified', or 'removed'). */
    readonly type: DocumentChangeType;
    /** The document affected by this change. */
    readonly doc: QueryDocumentSnapshot<AppModelType, DbModelType>;
    /**
     * The index of the changed document in the result set immediately prior to
     * this `DocumentChange` (i.e. supposing that all prior `DocumentChange` objects
     * have been applied). Is `-1` for 'added' events.
     */
    readonly oldIndex: number;
    /**
     * The index of the changed document in the result set immediately after
     * this `DocumentChange` (i.e. supposing that all prior `DocumentChange`
     * objects and the current `DocumentChange` object have been applied).
     * Is -1 for 'removed' events.
     */
    readonly newIndex: number;
}
/**
 * The type of a `DocumentChange` may be 'added', 'removed', or 'modified'.
 */
export declare type DocumentChangeType = 'added' | 'removed' | 'modified';
/**
 * Document data (for use with {@link @firebase/firestore/lite#(setDoc:1)}) consists of fields mapped to
 * values.
 */
export declare interface DocumentData {
    /** A mapping between a field and its value. */
    [field: string]: any;
}
/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 */
export declare function documentId(): FieldPath;
/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist.
 */
export declare class DocumentReference<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    readonly converter: FirestoreDataConverter<AppModelType, DbModelType> | null;
    /** The type of this Firestore reference. */
    readonly type = "document";
    /**
     * The {@link Firestore} instance the document is in.
     * This is useful for performing transactions, for example.
     */
    readonly firestore: Firestore;
    private constructor();
    /**
     * The document's identifier within its collection.
     */
    get id(): string;
    /**
     * A string representing the path of the referenced document (relative
     * to the root of the database).
     */
    get path(): string;
    /**
     * The collection this `DocumentReference` belongs to.
     */
    get parent(): CollectionReference<AppModelType, DbModelType>;
    /**
     * Applies a custom data converter to this `DocumentReference`, allowing you
     * to use your own custom model objects with Firestore. When you call {@link
     * @firebase/firestore/lite#(setDoc:1)}, {@link @firebase/firestore/lite#getDoc}, etc. with the returned `DocumentReference`
     * instance, the provided converter will convert between Firestore data of
     * type `NewDbModelType` and your custom type `NewAppModelType`.
     *
     * @param converter - Converts objects to and from Firestore.
     * @returns A `DocumentReference` that uses the provided converter.
     */
    withConverter<NewAppModelType, NewDbModelType extends DocumentData = DocumentData>(converter: FirestoreDataConverter<NewAppModelType, NewDbModelType>): DocumentReference<NewAppModelType, NewDbModelType>;
    /**
     * Removes the current converter.
     *
     * @param converter - `null` removes the current converter.
     * @returns A `DocumentReference<DocumentData, DocumentData>` that does not
     * use a converter.
     */
    withConverter(converter: null): DocumentReference<DocumentData, DocumentData>;
}
/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */
export declare class DocumentSnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /**
     *  Metadata about the `DocumentSnapshot`, including information about its
     *  source and local modifications.
     */
    readonly metadata: SnapshotMetadata;
    protected constructor();
    /**
     * Returns whether or not the data exists. True if the document exists.
     */
    exists(): this is QueryDocumentSnapshot<AppModelType, DbModelType>;
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document or `undefined` if
     * the document doesn't exist.
     */
    data(options?: SnapshotOptions): AppModelType | undefined;
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * By default, a `serverTimestamp()` that has not yet been set to
     * its final value will be returned as `null`. You can override this by
     * passing an options object.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @param options - An options object to configure how the field is retrieved
     * from the snapshot (for example the desired behavior for server timestamps
     * that have not yet been set to their final value).
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    get(fieldPath: string | FieldPath, options?: SnapshotOptions): any;
    /**
     * Property of the `DocumentSnapshot` that provides the document's ID.
     */
    get id(): string;
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */
    get ref(): DocumentReference<AppModelType, DbModelType>;
}
/* Excluded from this release type: _EmptyAppCheckTokenProvider */
/* Excluded from this release type: _EmptyAuthCredentialsProvider */
export { EmulatorMockTokenOptions };
/**
 * Attempts to enable persistent storage, if possible.
 *
 * Must be called before any other functions (other than
 * {@link initializeFirestore}, {@link (getFirestore:1)} or
 * {@link clearIndexedDbPersistence}.
 *
 * If this fails, `enableIndexedDbPersistence()` will reject the promise it
 * returns. Note that even after this failure, the {@link Firestore} instance will
 * remain usable, however offline persistence will be disabled.
 *
 * There are several reasons why this can fail, which can be identified by
 * the `code` on the error.
 *
 *   * failed-precondition: The app is already open in another browser tab.
 *   * unimplemented: The browser is incompatible with the offline
 *     persistence implementation.
 *
 * Persistence cannot be used in a Node.js environment.
 *
 * @param firestore - The {@link Firestore} instance to enable persistence for.
 * @param persistenceSettings - Optional settings object to configure
 * persistence.
 * @returns A `Promise` that represents successfully enabling persistent storage.
 * @deprecated This function will be removed in a future major release. Instead, set
 * `FirestoreSettings.localCache` to an instance of `PersistentLocalCache` to
 * turn on IndexedDb cache. Calling this function when `FirestoreSettings.localCache`
 * is already specified will throw an exception.
 */
export declare function enableIndexedDbPersistence(firestore: Firestore, persistenceSettings?: PersistenceSettings): Promise<void>;
/**
 * Attempts to enable multi-tab persistent storage, if possible. If enabled
 * across all tabs, all operations share access to local persistence, including
 * shared execution of queries and latency-compensated local document updates
 * across all connected instances.
 *
 * If this fails, `enableMultiTabIndexedDbPersistence()` will reject the promise
 * it returns. Note that even after this failure, the {@link Firestore} instance will
 * remain usable, however offline persistence will be disabled.
 *
 * There are several reasons why this can fail, which can be identified by
 * the `code` on the error.
 *
 *   * failed-precondition: The app is already open in another browser tab and
 *     multi-tab is not enabled.
 *   * unimplemented: The browser is incompatible with the offline
 *     persistence implementation.
 *
 * @param firestore - The {@link Firestore} instance to enable persistence for.
 * @returns A `Promise` that represents successfully enabling persistent
 * storage.
 * @deprecated This function will be removed in a future major release. Instead, set
 * `FirestoreSettings.localCache` to an instance of `PersistentLocalCache` to
 * turn on indexeddb cache. Calling this function when `FirestoreSettings.localCache`
 * is already specified will throw an exception.
 */
export declare function enableMultiTabIndexedDbPersistence(firestore: Firestore): Promise<void>;
/**
 * Re-enables use of the network for this {@link Firestore} instance after a prior
 * call to {@link disableNetwork}.
 *
 * @returns A `Promise` that is resolved once the network has been enabled.
 */
export declare function enableNetwork(firestore: Firestore): Promise<void>;
/**
 * Enables the SDK to create persistent cache indexes automatically for local
 * query execution when the SDK believes cache indexes can help improve
 * performance.
 *
 * This feature is disabled by default.
 */
export declare function enablePersistentCacheIndexAutoCreation(indexManager: PersistentCacheIndexManager): void;
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end at
 * the provided document (inclusive). The end position is relative to the order
 * of the query. The document must contain all of the fields provided in the
 * orderBy of the query.
 *
 * @param snapshot - The snapshot of the document to end at.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
export declare function endAt<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryEndAtConstraint;
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end at
 * the provided fields relative to the order of the query. The order of the field
 * values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to end this query at, in order
 * of the query's order by.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
export declare function endAt(...fieldValues: unknown[]): QueryEndAtConstraint;
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end
 * before the provided document (exclusive). The end position is relative to the
 * order of the query. The document must contain all of the fields provided in
 * the orderBy of the query.
 *
 * @param snapshot - The snapshot of the document to end before.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
export declare function endBefore<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryEndAtConstraint;
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end
 * before the provided fields relative to the order of the query. The order of
 * the field values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to end this query before, in order
 * of the query's order by.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
export declare function endBefore(...fieldValues: unknown[]): QueryEndAtConstraint;
/* Excluded from this release type: executeWrite */
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Options that configure the SDK’s underlying network transport (WebChannel)
 * when long-polling is used.
 *
 * Note: This interface is "experimental" and is subject to change.
 *
 * See `FirestoreSettings.experimentalAutoDetectLongPolling`,
 * `FirestoreSettings.experimentalForceLongPolling`, and
 * `FirestoreSettings.experimentalLongPollingOptions`.
 */
export declare interface ExperimentalLongPollingOptions {
    /**
     * The desired maximum timeout interval, in seconds, to complete a
     * long-polling GET response. Valid values are between 5 and 30, inclusive.
     * Floating point values are allowed and will be rounded to the nearest
     * millisecond.
     *
     * By default, when long-polling is used the "hanging GET" request sent by
     * the client times out after 30 seconds. To request a different timeout
     * from the server, set this setting with the desired timeout.
     *
     * Changing the default timeout may be useful, for example, if the buffering
     * proxy that necessitated enabling long-polling in the first place has a
     * shorter timeout for hanging GET requests, in which case setting the
     * long-polling timeout to a shorter value, such as 25 seconds, may fix
     * prematurely-closed hanging GET requests.
     * For example, see https://github.com/firebase/firebase-js-sdk/issues/6987.
     */
    timeoutSeconds?: number;
}
/**
 * A `FieldPath` refers to a field in a document. The path may consist of a
 * single field name (referring to a top-level field in the document), or a
 * list of field names (referring to a nested field in the document).
 *
 * Create a `FieldPath` by providing field names. If more than one field
 * name is provided, the path will point to a nested field in a document.
 */
export declare class FieldPath {
    /**
     * Creates a `FieldPath` from the provided field names. If more than one field
     * name is provided, the path will point to a nested field in a document.
     *
     * @param fieldNames - A list of field names.
     */
    constructor(...fieldNames: string[]);
    /**
     * Returns true if this `FieldPath` is equal to the provided one.
     *
     * @param other - The `FieldPath` to compare against.
     * @returns true if this `FieldPath` is equal to the provided one.
     */
    isEqual(other: FieldPath): boolean;
}
/**
 * Sentinel values that can be used when writing document fields with `set()`
 * or `update()`.
 */
export declare abstract class FieldValue {
    private constructor();
    /** Compares `FieldValue`s for equality. */
    abstract isEqual(other: FieldValue): boolean;
}
/* Excluded from this release type: _FirebaseService */
/**
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */
export declare class Firestore {
    /**
     * Whether it's a {@link Firestore} or Firestore Lite instance.
     */
    type: 'firestore-lite' | 'firestore';
    private constructor();
    /**
     * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
     * instance.
     */
    get app(): FirebaseApp;
    /**
     * Returns a JSON-serializable representation of this `Firestore` instance.
     */
    toJSON(): object;
}
/**
 * Converter used by `withConverter()` to transform user objects of type
 * `AppModelType` into Firestore data of type `DbModelType`.
 *
 * Using the converter allows you to specify generic type arguments when
 * storing and retrieving objects from Firestore.
 *
 * @example
 * ```typescript
 * class Post {
 *   constructor(readonly title: string, readonly author: string) {}
 *
 *   toString(): string {
 *     return this.title + ', by ' + this.author;
 *   }
 * }
 *
 * interface PostDbModel {
 *   title: string;
 *   author: string;
 * }
 *
 * const postConverter = {
 *   toFirestore(post: WithFieldValue<Post>): PostDbModel {
 *     return {title: post.title, author: post.author};
 *   },
 *   fromFirestore(
 *     snapshot: QueryDocumentSnapshot,
 *     options: SnapshotOptions
 *   ): Post {
 *     const data = snapshot.data(options) as PostDbModel;
 *     return new Post(data.title, data.author);
 *   }
 * };
 *
 * const postSnap = await firebase.firestore()
 *   .collection('posts')
 *   .withConverter(postConverter)
 *   .doc().get();
 * const post = postSnap.data();
 * if (post !== undefined) {
 *   post.title; // string
 *   post.toString(); // Should be defined
 *   post.someNonExistentProperty; // TS error
 * }
 * ```
 */
export declare interface FirestoreDataConverter<AppModelType, DbModelType extends DocumentData = DocumentData> {
    /**
     * Called by the Firestore SDK to convert a custom model object of type
     * `AppModelType` into a plain JavaScript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. To use `set()`
     * with `merge` and `mergeFields`, `toFirestore()` must be defined with
     * `PartialWithFieldValue<AppModelType>`.
     *
     * The `WithFieldValue<T>` type extends `T` to also allow FieldValues such as
     * {@link (deleteField:1)} to be used as property values.
     */
    toFirestore(modelObject: WithFieldValue<AppModelType>): WithFieldValue<DbModelType>;
    /**
     * Called by the Firestore SDK to convert a custom model object of type
     * `AppModelType` into a plain JavaScript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. Used with
     * {@link (setDoc:1)}, {@link (WriteBatch.set:1)} and
     * {@link (Transaction.set:1)} with `merge:true` or `mergeFields`.
     *
     * The `PartialWithFieldValue<T>` type extends `Partial<T>` to allow
     * FieldValues such as {@link (arrayUnion:1)} to be used as property values.
     * It also supports nested `Partial` by allowing nested fields to be
     * omitted.
     */
    toFirestore(modelObject: PartialWithFieldValue<AppModelType>, options: SetOptions): PartialWithFieldValue<DbModelType>;
    /**
     * Called by the Firestore SDK to convert Firestore data into an object of
     * type `AppModelType`. You can access your data by calling:
     * `snapshot.data(options)`.
     *
     * Generally, the data returned from `snapshot.data()` can be cast to
     * `DbModelType`; however, this is not guaranteed as writes to the database
     * may have occurred without a type converter enforcing this specific layout.
     *
     * @param snapshot - A `QueryDocumentSnapshot` containing your data and metadata.
     * @param options - The `SnapshotOptions` from the initial call to `data()`.
     */
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions): AppModelType;
}
/** An error returned by a Firestore operation. */
export declare class FirestoreError extends FirebaseError {
    /**
     * The backend error code associated with this error.
     */
    readonly code: FirestoreErrorCode;
    /**
     * A custom error description.
     */
    readonly message: string;
    /** The stack of the error. */
    readonly stack?: string;
    private constructor();
}
/**
 * The set of Firestore status codes. The codes are the same at the ones
 * exposed by gRPC here:
 * https://github.com/grpc/grpc/blob/master/doc/statuscodes.md
 *
 * Possible values:
 * - 'cancelled': The operation was cancelled (typically by the caller).
 * - 'unknown': Unknown error or an error from a different error domain.
 * - 'invalid-argument': Client specified an invalid argument. Note that this
 *   differs from 'failed-precondition'. 'invalid-argument' indicates
 *   arguments that are problematic regardless of the state of the system
 *   (e.g. an invalid field name).
 * - 'deadline-exceeded': Deadline expired before operation could complete.
 *   For operations that change the state of the system, this error may be
 *   returned even if the operation has completed successfully. For example,
 *   a successful response from a server could have been delayed long enough
 *   for the deadline to expire.
 * - 'not-found': Some requested document was not found.
 * - 'already-exists': Some document that we attempted to create already
 *   exists.
 * - 'permission-denied': The caller does not have permission to execute the
 *   specified operation.
 * - 'resource-exhausted': Some resource has been exhausted, perhaps a
 *   per-user quota, or perhaps the entire file system is out of space.
 * - 'failed-precondition': Operation was rejected because the system is not
 *   in a state required for the operation's execution.
 * - 'aborted': The operation was aborted, typically due to a concurrency
 *   issue like transaction aborts, etc.
 * - 'out-of-range': Operation was attempted past the valid range.
 * - 'unimplemented': Operation is not implemented or not supported/enabled.
 * - 'internal': Internal errors. Means some invariants expected by
 *   underlying system has been broken. If you see one of these errors,
 *   something is very broken.
 * - 'unavailable': The service is currently unavailable. This is most likely
 *   a transient condition and may be corrected by retrying with a backoff.
 * - 'data-loss': Unrecoverable data loss or corruption.
 * - 'unauthenticated': The request does not have valid authentication
 *   credentials for the operation.
 */
export declare type FirestoreErrorCode = 'cancelled' | 'unknown' | 'invalid-argument' | 'deadline-exceeded' | 'not-found' | 'already-exists' | 'permission-denied' | 'resource-exhausted' | 'failed-precondition' | 'aborted' | 'out-of-range' | 'unimplemented' | 'internal' | 'unavailable' | 'data-loss' | 'unauthenticated';
/**
 * Union type from all supported SDK cache layer.
 */
export declare type FirestoreLocalCache = MemoryLocalCache | PersistentLocalCache;
/**
 * Specifies custom configurations for your Cloud Firestore instance.
 * You must set these before invoking any other methods.
 */
export declare interface FirestoreSettings {
    /**
     * NOTE: This field will be deprecated in a future major release. Use `cache` field
     * instead to specify cache size, and other cache configurations.
     *
     * An approximate cache size threshold for the on-disk data. If the cache
     * grows beyond this size, Firestore will start removing data that hasn't been
     * recently used. The size is not a guarantee that the cache will stay below
     * that size, only that if the cache exceeds the given size, cleanup will be
     * attempted.
     *
     * The default value is 40 MB. The threshold must be set to at least 1 MB, and
     * can be set to `CACHE_SIZE_UNLIMITED` to disable garbage collection.
     */
    cacheSizeBytes?: number;
    /**
     * Specifies the cache used by the SDK. Available options are `MemoryLocalCache`
     * and `PersistentLocalCache`, each with different configuration options.
     *
     * When unspecified, `MemoryLocalCache` will be used by default.
     *
     * NOTE: setting this field and `cacheSizeBytes` at the same time will throw
     * exception during SDK initialization. Instead, using the configuration in
     * the `FirestoreLocalCache` object to specify the cache size.
     */
    localCache?: FirestoreLocalCache;
    /**
     * Forces the SDK’s underlying network transport (WebChannel) to use
     * long-polling. Each response from the backend will be closed immediately
     * after the backend sends data (by default responses are kept open in
     * case the backend has more data to send). This avoids incompatibility
     * issues with certain proxies, antivirus software, etc. that incorrectly
     * buffer traffic indefinitely. Use of this option will cause some
     * performance degradation though.
     *
     * This setting cannot be used with `experimentalAutoDetectLongPolling` and
     * may be removed in a future release. If you find yourself using it to
     * work around a specific network reliability issue, please tell us about
     * it in https://github.com/firebase/firebase-js-sdk/issues/1674.
     *
     * This setting cannot be used in a Node.js environment.
     */
    experimentalForceLongPolling?: boolean;
    /**
     * Configures the SDK's underlying transport (WebChannel) to automatically
     * detect if long-polling should be used. This is very similar to
     * `experimentalForceLongPolling`, but only uses long-polling if required.
     *
     * After having had a default value of `false` since its inception in 2019,
     * the default value of this setting was changed in May 2023 to `true` in
     * v9.22.0 of the Firebase JavaScript SDK. That is, auto-detection of long
     * polling is now enabled by default. To disable it, set this setting to
     * `false`, and please open a GitHub issue to share the problems that
     * motivated you disabling long-polling auto-detection.
     *
     * This setting cannot be used in a Node.js environment.
     */
    experimentalAutoDetectLongPolling?: boolean;
    /**
     * Options that configure the SDK’s underlying network transport (WebChannel)
     * when long-polling is used.
     *
     * These options are only used if `experimentalForceLongPolling` is true or if
     * `experimentalAutoDetectLongPolling` is true and the auto-detection
     * determined that long-polling was needed. Otherwise, these options have no
     * effect.
     */
    experimentalLongPollingOptions?: ExperimentalLongPollingOptions;
    /**
     * The hostname to connect to.
     */
    host?: string;
    /**
     * Whether to use SSL when connecting.
     */
    ssl?: boolean;
    /**
     * Whether to skip nested properties that are set to `undefined` during
     * object serialization. If set to `true`, these properties are skipped
     * and not written to Firestore. If set to `false` or omitted, the SDK
     * throws an exception when it encounters properties of type `undefined`.
     */
    ignoreUndefinedProperties?: boolean;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An immutable object representing a geographic location in Firestore. The
 * location is represented as latitude/longitude pair.
 *
 * Latitude values are in the range of [-90, 90].
 * Longitude values are in the range of [-180, 180].
 */
export declare class GeoPoint {
    /**
     * Creates a new immutable `GeoPoint` object with the provided latitude and
     * longitude values.
     * @param latitude - The latitude as number between -90 and 90.
     * @param longitude - The longitude as number between -180 and 180.
     */
    constructor(latitude: number, longitude: number);
    /**
     * The latitude of this `GeoPoint` instance.
     */
    get latitude(): number;
    /**
     * The longitude of this `GeoPoint` instance.
     */
    get longitude(): number;
    /**
     * Returns true if this `GeoPoint` is equal to the provided one.
     *
     * @param other - The `GeoPoint` to compare against.
     * @returns true if this `GeoPoint` is equal to the provided one.
     */
    isEqual(other: GeoPoint): boolean;
    /** Returns a JSON-serializable representation of this GeoPoint. */
    toJSON(): {
        latitude: number;
        longitude: number;
    };
}
/**
 * Calculates the specified aggregations over the documents in the result
 * set of the given query, without actually downloading the documents.
 *
 * Using this function to perform aggregations is efficient because only the
 * final aggregation values, not the documents' data, are downloaded. This
 * function can even perform aggregations of the documents if the result set
 * would be prohibitively large to download entirely (e.g. thousands of documents).
 *
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used: every request using this source necessarily involves a round trip to
 * the server.
 *
 * @param query The query whose result set to aggregate over.
 * @param aggregateSpec An `AggregateSpec` object that specifies the aggregates
 * to perform over the result set. The AggregateSpec specifies aliases for each
 * aggregate, which can be used to retrieve the aggregate result.
 * @example
 * ```typescript
 * const aggregateSnapshot = await getAggregateFromServer(query, {
 *   countOfDocs: count(),
 *   totalHours: sum('hours'),
 *   averageScore: average('score')
 * });
 *
 * const countOfDocs: number = aggregateSnapshot.data().countOfDocs;
 * const totalHours: number = aggregateSnapshot.data().totalHours;
 * const averageScore: number | null = aggregateSnapshot.data().averageScore;
 * ```
 */
export declare function getAggregateFromServer<AggregateSpecType extends AggregateSpec, AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, aggregateSpec: AggregateSpecType): Promise<AggregateQuerySnapshot<AggregateSpecType, AppModelType, DbModelType>>;
/**
 * Calculates the number of documents in the result set of the given query,
 * without actually downloading the documents.
 *
 * Using this function to count the documents is efficient because only the
 * final count, not the documents' data, is downloaded. This function can even
 * count the documents if the result set would be prohibitively large to
 * download entirely (e.g. thousands of documents).
 *
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used: every request using this source necessarily involves a round trip to
 * the server.
 *
 * @param query - The query whose result set size to calculate.
 * @returns A Promise that will be resolved with the count; the count can be
 * retrieved from `snapshot.data().count`, where `snapshot` is the
 * `AggregateQuerySnapshot` to which the returned Promise resolves.
 */
export declare function getCountFromServer<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<AggregateQuerySnapshot<{
    count: AggregateField<number>;
}, AppModelType, DbModelType>>;
/**
 * Reads the document referred to by this `DocumentReference`.
 *
 * Note: `getDoc()` attempts to provide up-to-date data when possible by waiting
 * for data from the server, but it may return cached data or fail if you are
 * offline and the server cannot be reached. To specify this behavior, invoke
 * {@link getDocFromCache} or {@link getDocFromServer}.
 *
 * @param reference - The reference of the document to fetch.
 * @returns A Promise resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */
export declare function getDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
/**
 * Reads the document referred to by this `DocumentReference` from cache.
 * Returns an error if the document is not currently cached.
 *
 * @returns A `Promise` resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */
export declare function getDocFromCache<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
/**
 * Reads the document referred to by this `DocumentReference` from the server.
 * Returns an error if the network is not available.
 *
 * @returns A `Promise` resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */
export declare function getDocFromServer<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 *
 * Note: `getDocs()` attempts to provide up-to-date data when possible by
 * waiting for data from the server, but it may return cached data or fail if
 * you are offline and the server cannot be reached. To specify this behavior,
 * invoke {@link getDocsFromCache} or {@link getDocsFromServer}.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */
export declare function getDocs<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>>;
/**
 * Executes the query and returns the results as a `QuerySnapshot` from cache.
 * Returns an empty result set if no documents matching the query are currently
 * cached.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */
export declare function getDocsFromCache<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>>;
/**
 * Executes the query and returns the results as a `QuerySnapshot` from the
 * server. Returns an error if the network is not available.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */
export declare function getDocsFromServer<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>>;
/**
 * Returns the existing default {@link Firestore} instance that is associated with the
 * default {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @returns The default {@link Firestore} instance of the default app.
 */
export declare function getFirestore(): Firestore;
/**
 * Returns the existing default {@link Firestore} instance that is associated with the
 * provided {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned {@link Firestore}
 * instance is associated with.
 * @returns The default {@link Firestore} instance of the provided app.
 */
export declare function getFirestore(app: FirebaseApp): Firestore;
/**
 * Returns the existing named {@link Firestore} instance that is associated with the
 * default {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param databaseId - The name of the database.
 * @returns The named {@link Firestore} instance of the default app.
 * @beta
 */
export declare function getFirestore(databaseId: string): Firestore;
/**
 * Returns the existing named {@link Firestore} instance that is associated with the
 * provided {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned {@link Firestore}
 * instance is associated with.
 * @param databaseId - The name of the database.
 * @returns The named {@link Firestore} instance of the provided app.
 * @beta
 */
export declare function getFirestore(app: FirebaseApp, databaseId: string): Firestore;
/**
 * Returns the PersistentCache Index Manager used by the given `Firestore`
 * object.
 *
 * @return The `PersistentCacheIndexManager` instance, or `null` if local
 * persistent storage is not in use.
 */
export declare function getPersistentCacheIndexManager(firestore: Firestore): PersistentCacheIndexManager | null;
/**
 * Returns a special value that can be used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link
 * @firebase/firestore/lite#(updateDoc:1)} that tells the server to increment the field's current value by
 * the given value.
 *
 * If either the operand or the current field value uses floating point
 * precision, all arithmetic follows IEEE 754 semantics. If both values are
 * integers, values outside of JavaScript's safe number range
 * (`Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`) are also subject to
 * precision loss. Furthermore, once processed by the Firestore backend, all
 * integer operations are capped between -2^63 and 2^63-1.
 *
 * If the current field value is not of type `number`, or if the field does not
 * yet exist, the transformation sets the field to the given value.
 *
 * @param n - The value to increment by.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`
 */
export declare function increment(n: number): FieldValue;
/**
 * The SDK definition of a Firestore index.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
export declare interface Index {
    /** The ID of the collection to index. */
    readonly collectionGroup: string;
    /** A list of fields to index. */
    readonly fields?: IndexField[];
    [key: string]: unknown;
}
/**
 * A list of Firestore indexes to speed up local query execution.
 *
 * See {@link https://firebase.google.com/docs/reference/firestore/indexes/#json_format | JSON Format}
 * for a description of the format of the index definition.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
export declare interface IndexConfiguration {
    /** A list of all Firestore indexes. */
    readonly indexes?: Index[];
    [key: string]: unknown;
}
/**
 * A single field element in an index configuration.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
export declare interface IndexField {
    /** The field path to index. */
    readonly fieldPath: string;
    /**
     * What type of array index to create. Set to `CONTAINS` for `array-contains`
     * and `array-contains-any` indexes.
     *
     * Only one of `arrayConfig` or `order` should be set;
     */
    readonly arrayConfig?: 'CONTAINS';
    /**
     * What type of array index to create. Set to `ASCENDING` or 'DESCENDING` for
     * `==`, `!=`, `<=`, `<=`, `in` and `not-in` filters.
     *
     * Only one of `arrayConfig` or `order` should be set.
     */
    readonly order?: 'ASCENDING' | 'DESCENDING';
    [key: string]: unknown;
}
/**
 * Initializes a new instance of {@link Firestore} with the provided settings.
 * Can only be called before any other function, including
 * {@link (getFirestore:1)}. If the custom settings are empty, this function is
 * equivalent to calling {@link (getFirestore:1)}.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} with which the {@link Firestore} instance will
 * be associated.
 * @param settings - A settings object to configure the {@link Firestore} instance.
 * @param databaseId - The name of the database.
 * @returns A newly initialized {@link Firestore} instance.
 */
export declare function initializeFirestore(app: FirebaseApp, settings: FirestoreSettings, databaseId?: string): Firestore;
/**
 * Creates a {@link QueryLimitConstraint} that only returns the first matching
 * documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */
export declare function limit(limit: number): QueryLimitConstraint;
/**
 * Creates a {@link QueryLimitConstraint} that only returns the last matching
 * documents.
 *
 * You must specify at least one `orderBy` clause for `limitToLast` queries,
 * otherwise an exception will be thrown during execution.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */
export declare function limitToLast(limit: number): QueryLimitConstraint;
/**
 * Loads a Firestore bundle into the local cache.
 *
 * @param firestore - The {@link Firestore} instance to load bundles for.
 * @param bundleData - An object representing the bundle to be loaded. Valid
 * objects are `ArrayBuffer`, `ReadableStream<Uint8Array>` or `string`.
 *
 * @returns A `LoadBundleTask` object, which notifies callers with progress
 * updates, and completion or error events. It can be used as a
 * `Promise<LoadBundleTaskProgress>`.
 */
export declare function loadBundle(firestore: Firestore, bundleData: ReadableStream<Uint8Array> | ArrayBuffer | string): LoadBundleTask;
/**
 * Represents the task of loading a Firestore bundle. It provides progress of bundle
 * loading, as well as task completion and error events.
 *
 * The API is compatible with `Promise<LoadBundleTaskProgress>`.
 */
export declare class LoadBundleTask implements PromiseLike<LoadBundleTaskProgress> {
    /**
     * Registers functions to listen to bundle loading progress events.
     * @param next - Called when there is a progress update from bundle loading. Typically `next` calls occur
     *   each time a Firestore document is loaded from the bundle.
     * @param error - Called when an error occurs during bundle loading. The task aborts after reporting the
     *   error, and there should be no more updates after this.
     * @param complete - Called when the loading task is complete.
     */
    onProgress(next?: (progress: LoadBundleTaskProgress) => unknown, error?: (err: Error) => unknown, complete?: () => void): void;
    /**
     * Implements the `Promise<LoadBundleTaskProgress>.catch` interface.
     *
     * @param onRejected - Called when an error occurs during bundle loading.
     */
    catch<R>(onRejected: (a: Error) => R | PromiseLike<R>): Promise<R | LoadBundleTaskProgress>;
    /**
     * Implements the `Promise<LoadBundleTaskProgress>.then` interface.
     *
     * @param onFulfilled - Called on the completion of the loading task with a final `LoadBundleTaskProgress` update.
     *   The update will always have its `taskState` set to `"Success"`.
     * @param onRejected - Called when an error occurs during bundle loading.
     */
    then<T, R>(onFulfilled?: (a: LoadBundleTaskProgress) => T | PromiseLike<T>, onRejected?: (a: Error) => R | PromiseLike<R>): Promise<T | R>;
}
/**
 * Represents a progress update or a final state from loading bundles.
 */
export declare interface LoadBundleTaskProgress {
    /** How many documents have been loaded. */
    documentsLoaded: number;
    /** How many documents are in the bundle being loaded. */
    totalDocuments: number;
    /** How many bytes have been loaded. */
    bytesLoaded: number;
    /** How many bytes are in the bundle being loaded. */
    totalBytes: number;
    /** Current task state. */
    taskState: TaskState;
}
export { LogLevel };
/**
 * An settings object to configure an `MemoryLocalCache` instance.
 */
export declare interface MemoryCacheSettings {
    /**
     * The garbage collector to use, for the memory cache layer.
     * A `MemoryEagerGarbageCollector` is used when this is undefined.
     */
    garbageCollector?: MemoryGarbageCollector;
}
/**
 * A garbage collector deletes documents whenever they are not part of any
 * active queries, and have no local mutations attached to them.
 *
 * This collector tries to ensure lowest memory footprints from the SDK,
 * at the risk of documents not being cached for offline queries or for
 * direct queries to the cache.
 *
 * Use factory function {@link memoryEagerGarbageCollector()} to create an
 * instance of this collector.
 */
export declare interface MemoryEagerGarbageCollector {
    kind: 'memoryEager';
}
/**
 * Creates an instance of `MemoryEagerGarbageCollector`. This is also the
 * default garbage collector unless it is explicitly specified otherwise.
 */
export declare function memoryEagerGarbageCollector(): MemoryEagerGarbageCollector;
/**
 * Union type from all support gabage collectors for memory local cache.
 */
export declare type MemoryGarbageCollector = MemoryEagerGarbageCollector | MemoryLruGarbageCollector;
/**
 * Provides an in-memory cache to the SDK. This is the default cache unless explicitly
 * configured otherwise.
 *
 * To use, create an instance using the factory function {@link memoryLocalCache()}, then
 * set the instance to `FirestoreSettings.cache` and call `initializeFirestore` using
 * the settings object.
 */
export declare interface MemoryLocalCache {
    kind: 'memory';
}
/**
 * Creates an instance of `MemoryLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 */
export declare function memoryLocalCache(settings?: MemoryCacheSettings): MemoryLocalCache;
/**
 * A garbage collector deletes Least-Recently-Used documents in multiple
 * batches.
 *
 * This collector is configured with a target size, and will only perform
 * collection when the cached documents exceed the target size. It avoids
 * querying backend repeated for the same query or document, at the risk
 * of having a larger memory footprint.
 *
 * Use factory function {@link memoryLruGarbageCollector()} to create a
 * instance of this collector.
 */
export declare interface MemoryLruGarbageCollector {
    kind: 'memoryLru';
}
/**
 * Creates an instance of `MemoryLruGarbageCollector`.
 *
 * A target size can be specified as part of the setting parameter. The
 * collector will start deleting documents once the cache size exceeds
 * the given size. The default cache size is 40MB (40 * 1024 * 1024 bytes).
 */
export declare function memoryLruGarbageCollector(settings?: {
    cacheSizeBytes?: number;
}): MemoryLruGarbageCollector;
/**
 * Reads a Firestore {@link Query} from local cache, identified by the given
 * name.
 *
 * The named queries are packaged  into bundles on the server side (along
 * with resulting documents), and loaded to local cache using `loadBundle`. Once
 * in local cache, use this method to extract a {@link Query} by name.
 *
 * @param firestore - The {@link Firestore} instance to read the query from.
 * @param name - The name of the query.
 * @returns A `Promise` that is resolved with the Query or `null`.
 */
export declare function namedQuery(firestore: Firestore, name: string): Promise<Query | null>;
/**
 * For each field (e.g. 'bar'), find all nested keys (e.g. {'bar.baz': T1,
 * 'bar.qux': T2}). Intersect them together to make a single map containing
 * all possible keys that are all marked as optional
 */
export declare type NestedUpdateFields<T extends Record<string, unknown>> = UnionToIntersection<{
    [K in keyof T & string]: ChildUpdateFields<K, T[K]>;
}[keyof T & string]>;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass
 * individual `onNext` and `onError` callbacks or pass a single observer
 * object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will
 * never be called because the snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, observer: {
    next?: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass
 * individual `onNext` and `onError` callbacks or pass a single observer
 * object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will
 * never be called because the snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, options: SnapshotListenOptions, observer: {
    next?: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass
 * individual `onNext` and `onError` callbacks or pass a single observer
 * object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will
 * never be called because the snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot`
 * is available.
 * @param onError - A callback to be called if the listen fails or is
 * cancelled. No further callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are
 * never ending.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass
 * individual `onNext` and `onError` callbacks or pass a single observer
 * object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will
 * never be called because the snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot`
 * is available.
 * @param onError - A callback to be called if the listen fails or is
 * cancelled. No further callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are
 * never ending.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, options: SnapshotListenOptions, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass
 * individual `onNext` and `onError` callbacks or pass a single observer
 * object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will
 * never be called because the snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, observer: {
    next?: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass
 * individual `onNext` and `onError` callbacks or pass a single observer
 * object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will
 * never be called because the snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, options: SnapshotListenOptions, observer: {
    next?: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass
 * individual `onNext` and `onError` callbacks or pass a single observer
 * object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will
 * never be called because the snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param onNext - A callback to be called every time a new `QuerySnapshot`
 * is available.
 * @param onCompletion - Can be provided, but will not be called since streams are
 * never ending.
 * @param onError - A callback to be called if the listen fails or is
 * cancelled. No further callbacks will occur.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass
 * individual `onNext` and `onError` callbacks or pass a single observer
 * object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will
 * never be called because the snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `QuerySnapshot`
 * is available.
 * @param onCompletion - Can be provided, but will not be called since streams are
 * never ending.
 * @param onError - A callback to be called if the listen fails or is
 * cancelled. No further callbacks will occur.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, options: SnapshotListenOptions, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for a snapshots-in-sync event. The snapshots-in-sync
 * event indicates that all listeners affected by a given change have fired,
 * even if a single server-generated change affects multiple listeners.
 *
 * NOTE: The snapshots-in-sync event only indicates that listeners are in sync
 * with each other, but does not relate to whether those snapshots are in sync
 * with the server. Use SnapshotMetadata in the individual listeners to
 * determine if a snapshot is from the cache or the server.
 *
 * @param firestore - The instance of Firestore for synchronizing snapshots.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel the snapshot
 * listener.
 */
export declare function onSnapshotsInSync(firestore: Firestore, observer: {
    next?: (value: void) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for a snapshots-in-sync event. The snapshots-in-sync
 * event indicates that all listeners affected by a given change have fired,
 * even if a single server-generated change affects multiple listeners.
 *
 * NOTE: The snapshots-in-sync event only indicates that listeners are in sync
 * with each other, but does not relate to whether those snapshots are in sync
 * with the server. Use `SnapshotMetadata` in the individual listeners to
 * determine if a snapshot is from the cache or the server.
 *
 * @param firestore - The `Firestore` instance for synchronizing snapshots.
 * @param onSync - A callback to be called every time all snapshot listeners are
 * in sync with each other.
 * @returns An unsubscribe function that can be called to cancel the snapshot
 * listener.
 */
export declare function onSnapshotsInSync(firestore: Firestore, onSync: () => void): Unsubscribe;
/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a disjunction of
 * the given filter constraints. A disjunction filter includes a document if it
 * satisfies any of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a disjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
export declare function or(...queryConstraints: QueryFilterConstraint[]): QueryCompositeFilterConstraint;
/**
 * Creates a {@link QueryOrderByConstraint} that sorts the query result by the
 * specified field, optionally in descending order instead of ascending.
 *
 * Note: Documents that do not contain the specified field will not be present
 * in the query result.
 *
 * @param fieldPath - The field to sort by.
 * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
 * not specified, order will be ascending.
 * @returns The created {@link QueryOrderByConstraint}.
 */
export declare function orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): QueryOrderByConstraint;
/**
 * The direction of a {@link orderBy} clause is specified as 'desc' or 'asc'
 * (descending or ascending).
 */
export declare type OrderByDirection = 'desc' | 'asc';
/**
 * Similar to Typescript's `Partial<T>`, but allows nested fields to be
 * omitted and FieldValues to be passed in as property values.
 */
export declare type PartialWithFieldValue<T> = Partial<T> | (T extends Primitive ? T : T extends {} ? {
    [K in keyof T]?: PartialWithFieldValue<T[K]> | FieldValue;
} : never);
/**
 * Settings that can be passed to `enableIndexedDbPersistence()` to configure
 * Firestore persistence.
 *
 * Persistence cannot be used in a Node.js environment.
 */
export declare interface PersistenceSettings {
    /**
     * Whether to force enable persistence for the client. This cannot be used
     * with multi-tab synchronization and is primarily intended for use with Web
     * Workers. Setting this to `true` will enable persistence, but cause other
     * tabs using persistence to fail.
     */
    forceOwnership?: boolean;
}
/**
 * A `PersistentCacheIndexManager` for configuring persistent cache indexes used
 * for local query execution.
 *
 * To use, call `getPersistentCacheIndexManager()` to get an instance.
 */
export declare class PersistentCacheIndexManager {
    /** A type string to uniquely identify instances of this class. */
    readonly type: 'PersistentCacheIndexManager';
    private constructor();
}
/**
 * An settings object to configure an `PersistentLocalCache` instance.
 *
 * Persistent cache cannot be used in a Node.js environment.
 */
export declare interface PersistentCacheSettings {
    /**
     * An approximate cache size threshold for the on-disk data. If the cache
     * grows beyond this size, Firestore will start removing data that hasn't been
     * recently used. The SDK does not guarantee that the cache will stay below
     * that size, only that if the cache exceeds the given size, cleanup will be
     * attempted.
     *
     * The default value is 40 MB. The threshold must be set to at least 1 MB, and
     * can be set to `CACHE_SIZE_UNLIMITED` to disable garbage collection.
     */
    cacheSizeBytes?: number;
    /**
     * Specifies how multiple tabs/windows will be managed by the SDK.
     */
    tabManager?: PersistentTabManager;
}
/**
 * Provides a persistent cache backed by IndexedDb to the SDK.
 *
 * To use, create an instance using the factory function {@link persistentLocalCache()}, then
 * set the instance to `FirestoreSettings.cache` and call `initializeFirestore` using
 * the settings object.
 */
export declare interface PersistentLocalCache {
    kind: 'persistent';
}
/**
 * Creates an instance of `PersistentLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 *
 * Persistent cache cannot be used in a Node.js environment.
 */
export declare function persistentLocalCache(settings?: PersistentCacheSettings): PersistentLocalCache;
/**
 * A tab manager supporting multiple tabs. SDK will synchronize queries and
 * mutations done across all tabs using the SDK.
 */
export declare interface PersistentMultipleTabManager {
    kind: 'PersistentMultipleTab';
}
/**
 * Creates an instance of `PersistentMultipleTabManager`.
 */
export declare function persistentMultipleTabManager(): PersistentMultipleTabManager;
/**
 * A tab manager supportting only one tab, no synchronization will be
 * performed across tabs.
 */
export declare interface PersistentSingleTabManager {
    kind: 'persistentSingleTab';
}
/**
 * Creates an instance of `PersistentSingleTabManager`.
 *
 * @param settings Configures the created tab manager.
 */
export declare function persistentSingleTabManager(settings: PersistentSingleTabManagerSettings | undefined): PersistentSingleTabManager;
/**
 * Type to configure an `PersistentSingleTabManager` instance.
 */
export declare interface PersistentSingleTabManagerSettings {
    /**
     * Whether to force-enable persistent (IndexedDB) cache for the client. This
     * cannot be used with multi-tab synchronization and is primarily intended for
     * use with Web Workers. Setting this to `true` will enable IndexedDB, but cause
     * other tabs using IndexedDB cache to fail.
     */
    forceOwnership?: boolean;
}
/**
 * A union of all available tab managers.
 */
export declare type PersistentTabManager = PersistentSingleTabManager | PersistentMultipleTabManager;
/**
 * These types primarily exist to support the `UpdateData`,
 * `WithFieldValue`, and `PartialWithFieldValue` types and are not consumed
 * directly by the end developer.
 */
/** Primitive types. */
export declare type Primitive = string | number | boolean | undefined | null;
/**
 * A `Query` refers to a query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 */
export declare class Query<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    readonly converter: FirestoreDataConverter<AppModelType, DbModelType> | null;
    /** The type of this Firestore reference. */
    readonly type: 'query' | 'collection';
    /**
     * The `Firestore` instance for the Firestore database (useful for performing
     * transactions, etc.).
     */
    readonly firestore: Firestore;
    protected constructor();
    /**
     * Removes the current converter.
     *
     * @param converter - `null` removes the current converter.
     * @returns A `Query<DocumentData, DocumentData>` that does not use a
     * converter.
     */
    withConverter(converter: null): Query<DocumentData, DocumentData>;
    /**
     * Applies a custom data converter to this query, allowing you to use your own
     * custom model objects with Firestore. When you call {@link getDocs} with
     * the returned query, the provided converter will convert between Firestore
     * data of type `NewDbModelType` and your custom type `NewAppModelType`.
     *
     * @param converter - Converts objects to and from Firestore.
     * @returns A `Query` that uses the provided converter.
     */
    withConverter<NewAppModelType, NewDbModelType extends DocumentData = DocumentData>(converter: FirestoreDataConverter<NewAppModelType, NewDbModelType>): Query<NewAppModelType, NewDbModelType>;
}
/**
 * Creates a new immutable instance of {@link Query} that is extended to also
 * include additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new
 * constraints.
 * @param compositeFilter - The {@link QueryCompositeFilterConstraint} to
 * apply. Create {@link QueryCompositeFilterConstraint} using {@link and} or
 * {@link or}.
 * @param queryConstraints - Additional {@link QueryNonFilterConstraint}s to
 * apply (e.g. {@link orderBy}, {@link limit}).
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
export declare function query<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, compositeFilter: QueryCompositeFilterConstraint, ...queryConstraints: QueryNonFilterConstraint[]): Query<AppModelType, DbModelType>;
/**
 * Creates a new immutable instance of {@link Query} that is extended to also
 * include additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new
 * constraints.
 * @param queryConstraints - The list of {@link QueryConstraint}s to apply.
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
export declare function query<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, ...queryConstraints: QueryConstraint[]): Query<AppModelType, DbModelType>;
/**
 * A `QueryCompositeFilterConstraint` is used to narrow the set of documents
 * returned by a Firestore query by performing the logical OR or AND of multiple
 * {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
 * `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
 * {@link and} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains the `QueryCompositeFilterConstraint`.
 */
export declare class QueryCompositeFilterConstraint {
    /** The type of this query constraint */
    readonly type: 'or' | 'and';
}
/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */
export declare abstract class QueryConstraint {
    /** The type of this query constraint */
    abstract readonly type: QueryConstraintType;
}
/** Describes the different query constraints available in this SDK. */
export declare type QueryConstraintType = 'where' | 'orderBy' | 'limit' | 'limitToLast' | 'startAt' | 'startAfter' | 'endAt' | 'endBefore';
/**
 * A `QueryDocumentSnapshot` contains data read from a document in your
 * Firestore database as part of a query. The document is guaranteed to exist
 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
 * specific field.
 *
 * A `QueryDocumentSnapshot` offers the same API surface as a
 * `DocumentSnapshot`. Since query results contain only existing documents, the
 * `exists` property will always be true and `data()` will never return
 * 'undefined'.
 */
export declare class QueryDocumentSnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> extends DocumentSnapshot<AppModelType, DbModelType> {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @override
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document.
     */
    data(options?: SnapshotOptions): AppModelType;
}
/**
 * A `QueryEndAtConstraint` is used to exclude documents from the end of a
 * result set returned by a Firestore query.
 * `QueryEndAtConstraint`s are created by invoking {@link (endAt:1)} or
 * {@link (endBefore:1)} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryEndAtConstraint`.
 */
export declare class QueryEndAtConstraint extends QueryConstraint {
    /** The type of this query constraint */
    readonly type: 'endBefore' | 'endAt';
}
/**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
export declare function queryEqual<AppModelType, DbModelType extends DocumentData>(left: Query<AppModelType, DbModelType>, right: Query<AppModelType, DbModelType>): boolean;
/**
 * A `QueryFieldFilterConstraint` is used to narrow the set of documents returned by
 * a Firestore query by filtering on one or more document fields.
 * `QueryFieldFilterConstraint`s are created by invoking {@link where} and can then
 * be passed to {@link (query:1)} to create a new query instance that also contains
 * this `QueryFieldFilterConstraint`.
 */
export declare class QueryFieldFilterConstraint extends QueryConstraint {
    /** The type of this query constraint */
    readonly type = "where";
}
/**
 * `QueryFilterConstraint` is a helper union type that represents
 * {@link QueryFieldFilterConstraint} and {@link QueryCompositeFilterConstraint}.
 */
export declare type QueryFilterConstraint = QueryFieldFilterConstraint | QueryCompositeFilterConstraint;
/**
 * A `QueryLimitConstraint` is used to limit the number of documents returned by
 * a Firestore query.
 * `QueryLimitConstraint`s are created by invoking {@link limit} or
 * {@link limitToLast} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryLimitConstraint`.
 */
export declare class QueryLimitConstraint extends QueryConstraint {
    /** The type of this query constraint */
    readonly type: 'limit' | 'limitToLast';
}
/**
 * `QueryNonFilterConstraint` is a helper union type that represents
 * QueryConstraints which are used to narrow or order the set of documents,
 * but that do not explicitly filter on a document field.
 * `QueryNonFilterConstraint`s are created by invoking {@link orderBy},
 * {@link (startAt:1)}, {@link (startAfter:1)}, {@link (endBefore:1)}, {@link (endAt:1)},
 * {@link limit} or {@link limitToLast} and can then be passed to {@link (query:1)}
 * to create a new query instance that also contains the `QueryConstraint`.
 */
export declare type QueryNonFilterConstraint = QueryOrderByConstraint | QueryLimitConstraint | QueryStartAtConstraint | QueryEndAtConstraint;
/**
 * A `QueryOrderByConstraint` is used to sort the set of documents returned by a
 * Firestore query. `QueryOrderByConstraint`s are created by invoking
 * {@link orderBy} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains this `QueryOrderByConstraint`.
 *
 * Note: Documents that do not contain the orderBy field will not be present in
 * the query result.
 */
export declare class QueryOrderByConstraint extends QueryConstraint {
    /** The type of this query constraint */
    readonly type = "orderBy";
}
/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
export declare class QuerySnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /**
     * Metadata about this snapshot, concerning its source and if it has local
     * modifications.
     */
    readonly metadata: SnapshotMetadata;
    /**
     * The query on which you called `get` or `onSnapshot` in order to get this
     * `QuerySnapshot`.
     */
    readonly query: Query<AppModelType, DbModelType>;
    private constructor();
    /** An array of all the documents in the `QuerySnapshot`. */
    get docs(): Array<QueryDocumentSnapshot<AppModelType, DbModelType>>;
    /** The number of documents in the `QuerySnapshot`. */
    get size(): number;
    /** True if there are no documents in the `QuerySnapshot`. */
    get empty(): boolean;
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */
    forEach(callback: (result: QueryDocumentSnapshot<AppModelType, DbModelType>) => void, thisArg?: unknown): void;
    /**
     * Returns an array of the documents changes since the last snapshot. If this
     * is the first snapshot, all documents will be in the list as 'added'
     * changes.
     *
     * @param options - `SnapshotListenOptions` that control whether metadata-only
     * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
     * snapshot events.
     */
    docChanges(options?: SnapshotListenOptions): Array<DocumentChange<AppModelType, DbModelType>>;
}
/**
 * A `QueryStartAtConstraint` is used to exclude documents from the start of a
 * result set returned by a Firestore query.
 * `QueryStartAtConstraint`s are created by invoking {@link (startAt:1)} or
 * {@link (startAfter:1)} and can then be passed to {@link (query:1)} to create a
 * new query instance that also contains this `QueryStartAtConstraint`.
 */
export declare class QueryStartAtConstraint extends QueryConstraint {
    /** The type of this query constraint */
    readonly type: 'startAt' | 'startAfter';
}
/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
export declare function refEqual<AppModelType, DbModelType extends DocumentData>(left: DocumentReference<AppModelType, DbModelType> | CollectionReference<AppModelType, DbModelType>, right: DocumentReference<AppModelType, DbModelType> | CollectionReference<AppModelType, DbModelType>): boolean;
/* Excluded from this release type: _ResourcePath */
/**
 * Executes the given `updateFunction` and then attempts to commit the changes
 * applied within the transaction. If any document read within the transaction
 * has changed, Cloud Firestore retries the `updateFunction`. If it fails to
 * commit after 5 attempts, the transaction fails.
 *
 * The maximum number of writes allowed in a single transaction is 500.
 *
 * @param firestore - A reference to the Firestore database to run this
 * transaction against.
 * @param updateFunction - The function to execute within the transaction
 * context.
 * @param options - An options object to configure maximum number of attempts to
 * commit.
 * @returns If the transaction completed successfully or was explicitly aborted
 * (the `updateFunction` returned a failed promise), the promise returned by the
 * `updateFunction `is returned here. Otherwise, if the transaction failed, a
 * rejected promise with the corresponding failure error is returned.
 */
export declare function runTransaction<T>(firestore: Firestore, updateFunction: (transaction: Transaction) => Promise<T>, options?: TransactionOptions): Promise<T>;
/**
 * Returns a sentinel used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link @firebase/firestore/lite#(updateDoc:1)} to
 * include a server-generated timestamp in the written data.
 */
export declare function serverTimestamp(): FieldValue;
/**
 * Writes to the document referred to by this `DocumentReference`. If the
 * document does not yet exist, it will be created.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @returns A `Promise` resolved once the data has been successfully written
 * to the backend (note that it won't resolve while you're offline).
 */
export declare function setDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): Promise<void>;
/**
 * Writes to the document referred to by the specified `DocumentReference`. If
 * the document does not yet exist, it will be created. If you provide `merge`
 * or `mergeFields`, the provided data can be merged into an existing document.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @param options - An object to configure the set behavior.
 * @returns A Promise resolved once the data has been successfully written
 * to the backend (note that it won't resolve while you're offline).
 */
export declare function setDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: PartialWithFieldValue<AppModelType>, options: SetOptions): Promise<void>;
/**
 * Configures indexing for local query execution. Any previous index
 * configuration is overridden. The `Promise` resolves once the index
 * configuration has been persisted.
 *
 * The index entries themselves are created asynchronously. You can continue to
 * use queries that require indexing even if the indices are not yet available.
 * Query execution will automatically start using the index once the index
 * entries have been written.
 *
 * Indexes are only supported with IndexedDb persistence. If IndexedDb is not
 * enabled, any index configuration is ignored.
 *
 * @param firestore - The {@link Firestore} instance to configure indexes for.
 * @param configuration -The index definition.
 * @throws FirestoreError if the JSON format is invalid.
 * @returns A `Promise` that resolves once all indices are successfully
 * configured.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
export declare function setIndexConfiguration(firestore: Firestore, configuration: IndexConfiguration): Promise<void>;
/**
 * Configures indexing for local query execution. Any previous index
 * configuration is overridden. The `Promise` resolves once the index
 * configuration has been persisted.
 *
 * The index entries themselves are created asynchronously. You can continue to
 * use queries that require indexing even if the indices are not yet available.
 * Query execution will automatically start using the index once the index
 * entries have been written.
 *
 * Indexes are only supported with IndexedDb persistence. Invoke either
 * `enableIndexedDbPersistence()` or `enableMultiTabIndexedDbPersistence()`
 * before setting an index configuration. If IndexedDb is not enabled, any
 * index configuration is ignored.
 *
 * The method accepts the JSON format exported by the Firebase CLI (`firebase
 * firestore:indexes`). If the JSON format is invalid, this method throws an
 * error.
 *
 * @param firestore - The {@link Firestore} instance to configure indexes for.
 * @param json -The JSON format exported by the Firebase CLI.
 * @throws FirestoreError if the JSON format is invalid.
 * @returns A `Promise` that resolves once all indices are successfully
 * configured.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
export declare function setIndexConfiguration(firestore: Firestore, json: string): Promise<void>;
/**
 * Sets the verbosity of Cloud Firestore logs (debug, error, or silent).
 *
 * @param logLevel - The verbosity you set for activity and error logging. Can
 *   be any of the following values:
 *
 *   <ul>
 *     <li>`debug` for the most verbose logging level, primarily for
 *     debugging.</li>
 *     <li>`error` to log errors only.</li>
 *     <li><code>`silent` to turn off logging.</li>
 *   </ul>
 */
export declare function setLogLevel(logLevel: LogLevel): void;
/**
 * An options object that configures the behavior of {@link @firebase/firestore/lite#(setDoc:1)}, {@link
 * @firebase/firestore/lite#(WriteBatch.set:1)} and {@link @firebase/firestore/lite#(Transaction.set:1)} calls. These calls can be
 * configured to perform granular merges instead of overwriting the target
 * documents in their entirety by providing a `SetOptions` with `merge: true`.
 *
 * @param merge - Changes the behavior of a `setDoc()` call to only replace the
 * values specified in its data argument. Fields omitted from the `setDoc()`
 * call remain untouched. If your input sets any field to an empty map, all
 * nested fields are overwritten.
 * @param mergeFields - Changes the behavior of `setDoc()` calls to only replace
 * the specified field paths. Any field path that is not specified is ignored
 * and remains untouched. If your input sets any field to an empty map, all
 * nested fields are overwritten.
 */
export declare type SetOptions = {
    readonly merge?: boolean;
} | {
    readonly mergeFields?: Array<string | FieldPath>;
};
/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
export declare function snapshotEqual<AppModelType, DbModelType extends DocumentData>(left: DocumentSnapshot<AppModelType, DbModelType> | QuerySnapshot<AppModelType, DbModelType>, right: DocumentSnapshot<AppModelType, DbModelType> | QuerySnapshot<AppModelType, DbModelType>): boolean;
/**
 * An options object that can be passed to {@link (onSnapshot:1)} and {@link
 * QuerySnapshot.docChanges} to control which types of changes to include in the
 * result set.
 */
export declare interface SnapshotListenOptions {
    /**
     * Include a change even if only the metadata of the query or of a document
     * changed. Default is false.
     */
    readonly includeMetadataChanges?: boolean;
}
/**
 * Metadata about a snapshot, describing the state of the snapshot.
 */
export declare class SnapshotMetadata {
    /**
     * True if the snapshot contains the result of local writes (for example
     * `set()` or `update()` calls) that have not yet been committed to the
     * backend. If your listener has opted into metadata updates (via
     * `SnapshotListenOptions`) you will receive another snapshot with
     * `hasPendingWrites` equal to false once the writes have been committed to
     * the backend.
     */
    readonly hasPendingWrites: boolean;
    /**
     * True if the snapshot was created from cached data rather than guaranteed
     * up-to-date server data. If your listener has opted into metadata updates
     * (via `SnapshotListenOptions`) you will receive another snapshot with
     * `fromCache` set to false once the client has received up-to-date data from
     * the backend.
     */
    readonly fromCache: boolean;
    private constructor();
    /**
     * Returns true if this `SnapshotMetadata` is equal to the provided one.
     *
     * @param other - The `SnapshotMetadata` to compare against.
     * @returns true if this `SnapshotMetadata` is equal to the provided one.
     */
    isEqual(other: SnapshotMetadata): boolean;
}
/**
 * Options that configure how data is retrieved from a `DocumentSnapshot` (for
 * example the desired behavior for server timestamps that have not yet been set
 * to their final value).
 */
export declare interface SnapshotOptions {
    /**
     * If set, controls the return value for server timestamps that have not yet
     * been set to their final value.
     *
     * By specifying 'estimate', pending server timestamps return an estimate
     * based on the local clock. This estimate will differ from the final value
     * and cause these values to change once the server result becomes available.
     *
     * By specifying 'previous', pending timestamps will be ignored and return
     * their previous value instead.
     *
     * If omitted or set to 'none', `null` will be returned by default until the
     * server value becomes available.
     */
    readonly serverTimestamps?: 'estimate' | 'previous' | 'none';
}
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start after the provided document (exclusive). The starting position is
 * relative to the order of the query. The document must contain all of the
 * fields provided in the orderBy of the query.
 *
 * @param snapshot - The snapshot of the document to start after.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`
 */
export declare function startAfter<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryStartAtConstraint;
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start after the provided fields relative to the order of the query. The order
 * of the field values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to start this query after, in order
 * of the query's order by.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`
 */
export declare function startAfter(...fieldValues: unknown[]): QueryStartAtConstraint;
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start at the provided document (inclusive). The starting position is relative
 * to the order of the query. The document must contain all of the fields
 * provided in the `orderBy` of this query.
 *
 * @param snapshot - The snapshot of the document to start at.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`.
 */
export declare function startAt<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryStartAtConstraint;
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start at the provided fields relative to the order of the query. The order of
 * the field values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to start this query at, in order
 * of the query's order by.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`.
 */
export declare function startAt(...fieldValues: unknown[]): QueryStartAtConstraint;
/**
 * Create an AggregateField object that can be used to compute the sum of
 * a specified field over a range of documents in the result set of a query.
 * @param field Specifies the field to sum across the result set.
 */
export declare function sum(field: string | FieldPath): AggregateField<number>;
/**
 * Represents the state of bundle loading tasks.
 *
 * Both 'Error' and 'Success' are sinking state: task will abort or complete and there will
 * be no more updates after they are reported.
 */
export declare type TaskState = 'Error' | 'Running' | 'Success';
/**
 * Terminates the provided {@link Firestore} instance.
 *
 * After calling `terminate()` only the `clearIndexedDbPersistence()` function
 * may be used. Any other function will throw a `FirestoreError`.
 *
 * To restart after termination, create a new instance of FirebaseFirestore with
 * {@link (getFirestore:1)}.
 *
 * Termination does not cancel any pending writes, and any promises that are
 * awaiting a response from the server will not be resolved. If you have
 * persistence enabled, the next time you start this instance, it will resume
 * sending these writes to the server.
 *
 * Note: Under normal circumstances, calling `terminate()` is not required. This
 * function is useful only when you want to force this instance to release all
 * of its resources or in combination with `clearIndexedDbPersistence()` to
 * ensure that all local state is destroyed between test runs.
 *
 * @returns A `Promise` that is resolved when the instance has been successfully
 * terminated.
 */
export declare function terminate(firestore: Firestore): Promise<void>;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A `Timestamp` represents a point in time independent of any time zone or
 * calendar, represented as seconds and fractions of seconds at nanosecond
 * resolution in UTC Epoch time.
 *
 * It is encoded using the Proleptic Gregorian Calendar which extends the
 * Gregorian calendar backwards to year one. It is encoded assuming all minutes
 * are 60 seconds long, i.e. leap seconds are "smeared" so that no leap second
 * table is needed for interpretation. Range is from 0001-01-01T00:00:00Z to
 * 9999-12-31T23:59:59.999999999Z.
 *
 * For examples and further specifications, refer to the
 * {@link https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto | Timestamp definition}.
 */
export declare class Timestamp {
    /**
     * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
     */
    readonly seconds: number;
    /**
     * The fractions of a second at nanosecond resolution.*
     */
    readonly nanoseconds: number;
    /**
     * Creates a new timestamp with the current date, with millisecond precision.
     *
     * @returns a new timestamp representing the current date.
     */
    static now(): Timestamp;
    /**
     * Creates a new timestamp from the given date.
     *
     * @param date - The date to initialize the `Timestamp` from.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     date.
     */
    static fromDate(date: Date): Timestamp;
    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds - Number of milliseconds since Unix epoch
     *     1970-01-01T00:00:00Z.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     number of milliseconds.
     */
    static fromMillis(milliseconds: number): Timestamp;
    /**
     * Creates a new timestamp.
     *
     * @param seconds - The number of seconds of UTC time since Unix epoch
     *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
     *     9999-12-31T23:59:59Z inclusive.
     * @param nanoseconds - The non-negative fractions of a second at nanosecond
     *     resolution. Negative second values with fractions must still have
     *     non-negative nanoseconds values that count forward in time. Must be
     *     from 0 to 999,999,999 inclusive.
     */
    constructor(
    /**
     * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
     */
    seconds: number, 
    /**
     * The fractions of a second at nanosecond resolution.*
     */
    nanoseconds: number);
    /**
     * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
     * causes a loss of precision since `Date` objects only support millisecond
     * precision.
     *
     * @returns JavaScript `Date` object representing the same point in time as
     *     this `Timestamp`, with millisecond precision.
     */
    toDate(): Date;
    /**
     * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
     * epoch). This operation causes a loss of precision.
     *
     * @returns The point in time corresponding to this timestamp, represented as
     *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */
    toMillis(): number;
    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other - The `Timestamp` to compare against.
     * @returns true if this `Timestamp` is equal to the provided one.
     */
    isEqual(other: Timestamp): boolean;
    /** Returns a textual representation of this `Timestamp`. */
    toString(): string;
    /** Returns a JSON-serializable representation of this `Timestamp`. */
    toJSON(): {
        seconds: number;
        nanoseconds: number;
    };
    /**
     * Converts this object to a primitive string, which allows `Timestamp` objects
     * to be compared using the `>`, `<=`, `>=` and `>` operators.
     */
    valueOf(): string;
}
/**
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */
export declare class Transaction {
    private constructor();
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */
    get<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
    /**
     * Writes to the document referred to by the provided {@link
     * DocumentReference}. If the document does not exist yet, it will be created.
     * 
     * @param documentRef - A reference to the document to be set.
     * @param data - An object of the fields and values for the document.
     * @throws Error - If the provided input is not a valid Firestore document.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    set<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): this;
    /**
     * Writes to the document referred to by the provided {@link
     * DocumentReference}. If the document does not exist yet, it will be created.
     * If you provide `merge` or `mergeFields`, the provided data can be merged
     * into an existing document.
     * 
     * @param documentRef - A reference to the document to be set.
     * @param data - An object of the fields and values for the document.
     * @param options - An object to configure the set behavior.
     * @throws Error - If the provided input is not a valid Firestore document.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    set<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: PartialWithFieldValue<AppModelType>, options: SetOptions): this;
    /**
     * Updates fields in the document referred to by the provided {@link
     * DocumentReference}. The update will fail if applied to a document that does
     * not exist.
     * 
     * @param documentRef - A reference to the document to be updated.
     * @param data - An object containing the fields and values with which to
update the document. Fields can contain dots to reference nested fields
within the document.
     * @throws Error - If the provided input is not valid Firestore data.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    update<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: UpdateData<DbModelType>): this;
    /**
     * Updates fields in the document referred to by the provided {@link
     * DocumentReference}. The update will fail if applied to a document that does
     * not exist.
     * 
     * Nested fields can be updated by providing dot-separated field path
     * strings or by providing `FieldPath` objects.
     * 
     * @param documentRef - A reference to the document to be updated.
     * @param field - The first field to update.
     * @param value - The first value.
     * @param moreFieldsAndValues - Additional key/value pairs.
     * @throws Error - If the provided input is not valid Firestore data.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    update<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, field: string | FieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): this;
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     * 
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    delete<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>): this;
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Options to customize transaction behavior.
 */
export declare interface TransactionOptions {
    /** Maximum number of attempts to commit, after which transaction fails. Default is 5. */
    readonly maxAttempts?: number;
}
/**
 * Given a union type `U = T1 | T2 | ...`, returns an intersected type
 * `(T1 & T2 & ...)`.
 *
 * Uses distributive conditional types and inference from conditional types.
 * This works because multiple candidates for the same type variable in
 * contra-variant positions causes an intersection type to be inferred.
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-inference-in-conditional-types
 * https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
 */
export declare type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
/**
 * A function returned by `onSnapshot()` that removes the listener when invoked.
 */
export declare interface Unsubscribe {
    /** Removes the listener when invoked. */
    (): void;
}
/**
 * Update data (for use with {@link (updateDoc:1)}) that consists of field paths
 * (e.g. 'foo' or 'foo.baz') mapped to values. Fields that contain dots
 * reference nested fields within the document. FieldValues can be passed in
 * as property values.
 */
export declare type UpdateData<T> = T extends Primitive ? T : T extends {} ? {
    [K in keyof T]?: UpdateData<T[K]> | FieldValue;
} & NestedUpdateFields<T> : Partial<T>;
/**
 * Updates fields in the document referred to by the specified
 * `DocumentReference`. The update will fail if applied to a document that does
 * not exist.
 *
 * @param reference - A reference to the document to update.
 * @param data - An object containing the fields and values with which to
 * update the document. Fields can contain dots to reference nested fields
 * within the document.
 * @returns A `Promise` resolved once the data has been successfully written
 * to the backend (note that it won't resolve while you're offline).
 */
export declare function updateDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: UpdateData<DbModelType>): Promise<void>;
/**
 * Updates fields in the document referred to by the specified
 * `DocumentReference` The update will fail if applied to a document that does
 * not exist.
 *
 * Nested fields can be updated by providing dot-separated field path
 * strings or by providing `FieldPath` objects.
 *
 * @param reference - A reference to the document to update.
 * @param field - The first field to update.
 * @param value - The first value.
 * @param moreFieldsAndValues - Additional key value pairs.
 * @returns A `Promise` resolved once the data has been successfully written
 * to the backend (note that it won't resolve while you're offline).
 */
export declare function updateDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, field: string | FieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): Promise<void>;
/**
 * Waits until all currently pending writes for the active user have been
 * acknowledged by the backend.
 *
 * The returned promise resolves immediately if there are no outstanding writes.
 * Otherwise, the promise waits for all previously issued writes (including
 * those written in a previous app session), but it does not wait for writes
 * that were added after the function is called. If you want to wait for
 * additional writes, call `waitForPendingWrites()` again.
 *
 * Any outstanding `waitForPendingWrites()` promises are rejected during user
 * changes.
 *
 * @returns A `Promise` which resolves when all currently pending writes have been
 * acknowledged by the backend.
 */
export declare function waitForPendingWrites(firestore: Firestore): Promise<void>;
/**
 * Creates a {@link QueryFieldFilterConstraint} that enforces that documents
 * must contain the specified field and that the value should satisfy the
 * relation constraint provided.
 *
 * @param fieldPath - The path to compare
 * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
 *   "&lt;=", "!=").
 * @param value - The value for comparison
 * @returns The created {@link QueryFieldFilterConstraint}.
 */
export declare function where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown): QueryFieldFilterConstraint;
/**
 * Filter conditions in a {@link where} clause are specified using the
 * strings '&lt;', '&lt;=', '==', '!=', '&gt;=', '&gt;', 'array-contains', 'in',
 * 'array-contains-any', and 'not-in'.
 */
export declare type WhereFilterOp = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';
/**
 * Allows FieldValues to be passed in as a property value while maintaining
 * type safety.
 */
export declare type WithFieldValue<T> = T | (T extends Primitive ? T : T extends {} ? {
    [K in keyof T]: WithFieldValue<T[K]> | FieldValue;
} : never);
/**
 * A write batch, used to perform multiple writes as a single atomic unit.
 *
 * A `WriteBatch` object can be acquired by calling {@link writeBatch}. It
 * provides methods for adding writes to the write batch. None of the writes
 * will be committed (or visible locally) until {@link WriteBatch.commit} is
 * called.
 */
export declare class WriteBatch {
    private constructor();
    /**
     * Writes to the document referred to by the provided {@link
     * DocumentReference}. If the document does not exist yet, it will be created.
     *
     * @param documentRef - A reference to the document to be set.
     * @param data - An object of the fields and values for the document.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    set<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): WriteBatch;
    /**
     * Writes to the document referred to by the provided {@link
     * DocumentReference}. If the document does not exist yet, it will be created.
     * If you provide `merge` or `mergeFields`, the provided data can be merged
     * into an existing document.
     *
     * @param documentRef - A reference to the document to be set.
     * @param data - An object of the fields and values for the document.
     * @param options - An object to configure the set behavior.
     * @throws Error - If the provided input is not a valid Firestore document.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    set<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: PartialWithFieldValue<AppModelType>, options: SetOptions): WriteBatch;
    /**
     * Updates fields in the document referred to by the provided {@link
     * DocumentReference}. The update will fail if applied to a document that does
     * not exist.
     *
     * @param documentRef - A reference to the document to be updated.
     * @param data - An object containing the fields and values with which to
     * update the document. Fields can contain dots to reference nested fields
     * within the document.
     * @throws Error - If the provided input is not valid Firestore data.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    update<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: UpdateData<DbModelType>): WriteBatch;
    /**
     * Updates fields in the document referred to by this {@link
     * DocumentReference}. The update will fail if applied to a document that does
     * not exist.
     *
     * Nested fields can be update by providing dot-separated field path strings
     * or by providing `FieldPath` objects.
     *
     * @param documentRef - A reference to the document to be updated.
     * @param field - The first field to update.
     * @param value - The first value.
     * @param moreFieldsAndValues - Additional key value pairs.
     * @throws Error - If the provided input is not valid Firestore data.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    update<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, field: string | FieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): WriteBatch;
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    delete<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>): WriteBatch;
    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * The result of these writes will only be reflected in document reads that
     * occur after the returned promise resolves. If the client is offline, the
     * write fails. If you would like to see local modifications or buffer writes
     * until the client is online, use the full Firestore SDK.
     *
     * @returns A `Promise` resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit (note that it won't
     * resolve while you're offline).
     */
    commit(): Promise<void>;
}
/**
 * Creates a write batch, used for performing multiple writes as a single
 * atomic operation. The maximum number of writes allowed in a single {@link WriteBatch}
 * is 500.
 *
 * Unlike transactions, write batches are persisted offline and therefore are
 * preferable when you don't need to condition your writes on read data.
 *
 * @returns A {@link WriteBatch} that can be used to atomically execute multiple
 * writes.
 */
export declare function writeBatch(firestore: Firestore): WriteBatch;
export {};
