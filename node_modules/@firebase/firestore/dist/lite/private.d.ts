/**
 * Firestore Lite
 *
 * @remarks Firestore Lite is a small online-only SDK that allows read
 * and write access to your Firestore database. All operations connect
 * directly to the backend, and `onSnapshot()` APIs are not supported.
 * @packageDocumentation
 */

import { DocumentData as DocumentData_2 } from '@firebase/firestore-types';
import { EmulatorMockTokenOptions } from '@firebase/util';
import { FirebaseApp } from '@firebase/app';
import { FirebaseError } from '@firebase/util';
import { LogLevelString as LogLevel } from '@firebase/logger';
import { SetOptions as SetOptions_2 } from '@firebase/firestore-types';

/* Excluded from this release type: AbstractUserDataWriter */

/**
 * Describes a map whose keys are active target ids. We do not care about the type of the
 * values.
 */
declare type ActiveTargets = SortedMap<TargetId, unknown>;

/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * The result of this write will only be reflected in document reads that occur
 * after the returned promise resolves. If the client is offline, the
 * write fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @throws Error - If the provided input is not a valid Firestore document.
 * @returns A `Promise` resolved with a `DocumentReference` pointing to the
 * newly created document after it has been written to the backend.
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
    readonly _internalFieldPath?: FieldPath_2 | undefined;
    /** A type string to uniquely identify instances of this class. */
    readonly type = "AggregateField";
    /** Indicates the aggregation operation of this AggregateField. */
    readonly aggregateType: AggregateType;
    /* Excluded from this release type: __constructor */
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
    private readonly _userDataWriter;
    private readonly _data;
    /** A type string to uniquely identify instances of this class. */
    readonly type = "AggregateQuerySnapshot";
    /**
     * The underlying query over which the aggregations recorded in this
     * `AggregateQuerySnapshot` were performed.
     */
    readonly query: Query<AppModelType, DbModelType>;
    /** @hideconstructor */
    constructor(query: Query<AppModelType, DbModelType>, _userDataWriter: AbstractUserDataWriter, _data: ApiClientObjectMap<Value>);
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

declare interface ApiClientObjectMap<T> {
    [k: string]: T;
}

/**
 * An `AppliableConstraint` is an abstraction of a constraint that can be applied
 * to a Firestore query.
 */
declare abstract class AppliableConstraint {
    /**
     * Takes the provided {@link Query} and returns a copy of the {@link Query} with this
     * {@link AppliableConstraint} applied.
     */
    abstract _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}

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

declare interface AsyncQueue {
    readonly isShuttingDown: boolean;
    /**
     * Adds a new operation to the queue without waiting for it to complete (i.e.
     * we ignore the Promise result).
     */
    enqueueAndForget<T extends unknown>(op: () => Promise<T>): void;
    /**
     * Regardless if the queue has initialized shutdown, adds a new operation to the
     * queue without waiting for it to complete (i.e. we ignore the Promise result).
     */
    enqueueAndForgetEvenWhileRestricted<T extends unknown>(op: () => Promise<T>): void;
    /**
     * Initialize the shutdown of this queue. Once this method is called, the
     * only possible way to request running an operation is through
     * `enqueueEvenWhileRestricted()`.
     *
     * @param purgeExistingTasks Whether already enqueued tasked should be
     * rejected (unless enqueued wih `enqueueEvenWhileRestricted()`). Defaults
     * to false.
     */
    enterRestrictedMode(purgeExistingTasks?: boolean): void;
    /**
     * Adds a new operation to the queue. Returns a promise that will be resolved
     * when the promise returned by the new operation is (with its value).
     */
    enqueue<T extends unknown>(op: () => Promise<T>): Promise<T>;
    /**
     * Enqueue a retryable operation.
     *
     * A retryable operation is rescheduled with backoff if it fails with a
     * IndexedDbTransactionError (the error type used by SimpleDb). All
     * retryable operations are executed in order and only run if all prior
     * operations were retried successfully.
     */
    enqueueRetryable(op: () => Promise<void>): void;
    /**
     * Schedules an operation to be queued on the AsyncQueue once the specified
     * `delayMs` has elapsed. The returned DelayedOperation can be used to cancel
     * or fast-forward the operation prior to its running.
     */
    enqueueAfterDelay<T extends unknown>(timerId: TimerId, delayMs: number, op: () => Promise<T>): DelayedOperation<T>;
    /**
     * Verifies there's an operation currently in-progress on the AsyncQueue.
     * Unfortunately we can't verify that the running code is in the promise chain
     * of that operation, so this isn't a foolproof check, but it should be enough
     * to catch some bugs.
     */
    verifyOperationInProgress(): void;
}

/* Excluded from this release type: AuthTokenFactory */

/**
 * Create an AggregateField object that can be used to compute the average of
 * a specified field over a range of documents in the result set of a query.
 * @param field Specifies the field to average across the result set.
 */
export declare function average(field: string | FieldPath): AggregateField<number | null>;

/**
 * Path represents an ordered sequence of string segments.
 */
declare abstract class BasePath<B extends BasePath<B>> {
    private segments;
    private offset;
    private len;
    constructor(segments: string[], offset?: number, length?: number);
    /**
     * Abstract constructor method to construct an instance of B with the given
     * parameters.
     */
    protected abstract construct(segments: string[], offset?: number, length?: number): B;
    /**
     * Returns a String representation.
     *
     * Implementing classes are required to provide deterministic implementations as
     * the String representation is used to obtain canonical Query IDs.
     */
    abstract toString(): string;
    get length(): number;
    isEqual(other: B): boolean;
    child(nameOrPath: string | B): B;
    /** The index of one past the last segment of the path. */
    private limit;
    popFirst(size?: number): B;
    popLast(): B;
    firstSegment(): string;
    lastSegment(): string;
    get(index: number): string;
    isEmpty(): boolean;
    isPrefixOf(other: this): boolean;
    isImmediateParentOf(potentialChild: this): boolean;
    forEach(fn: (segment: string) => void): void;
    toArray(): string[];
    static comparator<T extends BasePath<T>>(p1: BasePath<T>, p2: BasePath<T>): number;
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
 * BatchID is a locally assigned ID for a batch of mutations that have been
 * applied.
 */
declare type BatchId = number;

/**
 * Represents a bound of a query.
 *
 * The bound is specified with the given components representing a position and
 * whether it's just before or just after the position (relative to whatever the
 * query order is).
 *
 * The position represents a logical index position for a query. It's a prefix
 * of values for the (potentially implicit) order by clauses of a query.
 *
 * Bound provides a function to determine whether a document comes before or
 * after a bound. This is influenced by whether the position is just before or
 * just after the provided values.
 */
declare class Bound {
    readonly position: Value[];
    readonly inclusive: boolean;
    constructor(position: Value[], inclusive: boolean);
}

/**
 * Provides interfaces to save and read Firestore bundles.
 */
declare interface BundleCache {
    /**
     * Gets the saved `BundleMetadata` for a given `bundleId`, returns undefined
     * if no bundle metadata is found under the given id.
     */
    getBundleMetadata(transaction: PersistenceTransaction, bundleId: string): PersistencePromise<BundleMetadata | undefined>;
    /**
     * Saves a `BundleMetadata` from a bundle into local storage, using its id as
     * the persistent key.
     */
    saveBundleMetadata(transaction: PersistenceTransaction, metadata: BundleMetadata_2): PersistencePromise<void>;
    /**
     * Gets a saved `NamedQuery` for the given query name. Returns undefined if
     * no queries are found under the given name.
     */
    getNamedQuery(transaction: PersistenceTransaction, queryName: string): PersistencePromise<NamedQuery | undefined>;
    /**
     * Saves a `NamedQuery` from a bundle, using its name as the persistent key.
     */
    saveNamedQuery(transaction: PersistenceTransaction, query: NamedQuery_2): PersistencePromise<void>;
}

/** Properties of a BundledQuery. */
declare interface BundledQuery {
    /** BundledQuery parent */
    parent?: string | null;
    /** BundledQuery structuredQuery */
    structuredQuery?: StructuredQuery | null;
    /** BundledQuery limitType */
    limitType?: LimitType_2 | null;
}

/**
 * Represents a Firestore bundle saved by the SDK in its local storage.
 */
declare interface BundleMetadata {
    /**
     * Id of the bundle. It is used together with `createTime` to determine if a
     * bundle has been loaded by the SDK.
     */
    readonly id: string;
    /** Schema version of the bundle. */
    readonly version: number;
    /**
     * Set to the snapshot version of the bundle if created by the Server SDKs.
     * Otherwise set to SnapshotVersion.MIN.
     */
    readonly createTime: SnapshotVersion;
}

/** Properties of a BundleMetadata. */
declare interface BundleMetadata_2 {
    /** BundleMetadata id */
    id?: string | null;
    /** BundleMetadata createTime */
    createTime?: Timestamp_2 | null;
    /** BundleMetadata version */
    version?: number | null;
    /** BundleMetadata totalDocuments */
    totalDocuments?: number | null;
    /** BundleMetadata totalBytes */
    totalBytes?: number | null;
}

/**
 * An immutable object representing an array of bytes.
 */
export declare class Bytes {
    _byteString: ByteString;
    /** @hideconstructor */
    constructor(byteString: ByteString);
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

/* Excluded from this release type: ByteString */

declare const enum ChangeType {
    Added = 0,
    Removed = 1,
    Modified = 2,
    Metadata = 3
}

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
 * A randomly-generated key assigned to each Firestore instance at startup.
 */
declare type ClientId = string;

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
    readonly _path: ResourcePath;
    /** The type of this Firestore reference. */
    readonly type = "collection";
    /** @hideconstructor */
    constructor(firestore: Firestore, converter: FirestoreDataConverter<AppModelType, DbModelType> | null, _path: ResourcePath);
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
declare type Comparator<K> = (key1: K, key2: K) => number;

declare interface ComponentConfiguration {
    asyncQueue: AsyncQueue;
    databaseInfo: DatabaseInfo;
    authCredentials: CredentialsProvider<User>;
    appCheckCredentials: CredentialsProvider<string>;
    clientId: ClientId;
    initialUser: User;
    maxConcurrentLimboResolutions: number;
}

declare type CompositeFilterOp = 'OPERATOR_UNSPECIFIED' | 'AND' | 'OR';

declare const enum CompositeOperator {
    OR = "or",
    AND = "and"
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
 * A Listener for credential change events. The listener should fetch a new
 * token and may need to invalidate other state if the current user has also
 * changed.
 */
declare type CredentialChangeListener<T> = (credential: T) => Promise<void>;

/**
 * Provides methods for getting the uid and token for the current user and
 * listening for changes.
 */
declare interface CredentialsProvider<T> {
    /**
     * Starts the credentials provider and specifies a listener to be notified of
     * credential changes (sign-in / sign-out, token changes). It is immediately
     * called once with the initial user.
     *
     * The change listener is invoked on the provided AsyncQueue.
     */
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<T>): void;
    /** Requests a token for the current user. */
    getToken(): Promise<Token | null>;
    /**
     * Marks the last retrieved token as invalid, making the next GetToken request
     * force-refresh the token.
     */
    invalidateToken(): void;
    shutdown(): void;
}

/** Settings for private credentials */
declare type CredentialsSettings = FirstPartyCredentialsSettings | ProviderCredentialsSettings;

/* Excluded from this release type: DatabaseId */

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
declare class DatabaseInfo {
    readonly databaseId: DatabaseId;
    readonly appId: string;
    readonly persistenceKey: string;
    readonly host: string;
    readonly ssl: boolean;
    readonly forceLongPolling: boolean;
    readonly autoDetectLongPolling: boolean;
    readonly longPollingOptions: ExperimentalLongPollingOptions;
    readonly useFetchStreams: boolean;
    /**
     * Constructs a DatabaseInfo using the provided host, databaseId and
     * persistenceKey.
     *
     * @param databaseId - The database to use.
     * @param appId - The Firebase App Id.
     * @param persistenceKey - A unique identifier for this Firestore's local
     * storage (used in conjunction with the databaseId).
     * @param host - The Firestore backend host to connect to.
     * @param ssl - Whether to use SSL when connecting.
     * @param forceLongPolling - Whether to use the forceLongPolling option
     * when using WebChannel as the network transport.
     * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
     * option when using WebChannel as the network transport.
     * @param longPollingOptions Options that configure long-polling.
     * @param useFetchStreams Whether to use the Fetch API instead of
     * XMLHTTPRequest
     */
    constructor(databaseId: DatabaseId, appId: string, persistenceKey: string, host: string, ssl: boolean, forceLongPolling: boolean, autoDetectLongPolling: boolean, longPollingOptions: ExperimentalLongPollingOptions, useFetchStreams: boolean);
}

/**
 * Datastore and its related methods are a wrapper around the external Google
 * Cloud Datastore grpc API, which provides an interface that is more convenient
 * for the rest of the client SDK architecture to consume.
 */
declare abstract class Datastore {
    abstract terminate(): void;
    abstract serializer: JsonProtoSerializer;
}

/**
 * Represents an operation scheduled to be run in the future on an AsyncQueue.
 *
 * It is created via DelayedOperation.createAndSchedule().
 *
 * Supports cancellation (via cancel()) and early execution (via skipDelay()).
 *
 * Note: We implement `PromiseLike` instead of `Promise`, as the `Promise` type
 * in newer versions of TypeScript defines `finally`, which is not available in
 * IE.
 */
declare class DelayedOperation<T extends unknown> implements PromiseLike<T> {
    private readonly asyncQueue;
    readonly timerId: TimerId;
    readonly targetTimeMs: number;
    private readonly op;
    private readonly removalCallback;
    private timerHandle;
    private readonly deferred;
    private constructor();
    get promise(): Promise<T>;
    /**
     * Creates and returns a DelayedOperation that has been scheduled to be
     * executed on the provided asyncQueue after the provided delayMs.
     *
     * @param asyncQueue - The queue to schedule the operation on.
     * @param id - A Timer ID identifying the type of operation this is.
     * @param delayMs - The delay (ms) before the operation should be scheduled.
     * @param op - The operation to run.
     * @param removalCallback - A callback to be called synchronously once the
     *   operation is executed or canceled, notifying the AsyncQueue to remove it
     *   from its delayedOperations list.
     *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
     *   the DelayedOperation class public.
     */
    static createAndSchedule<R extends unknown>(asyncQueue: AsyncQueue, timerId: TimerId, delayMs: number, op: () => Promise<R>, removalCallback: (op: DelayedOperation<R>) => void): DelayedOperation<R>;
    /**
     * Starts the timer. This is called immediately after construction by
     * createAndSchedule().
     */
    private start;
    /**
     * Queues the operation to run immediately (if it hasn't already been run or
     * canceled).
     */
    skipDelay(): void;
    /**
     * Cancels the operation if it hasn't already been executed or canceled. The
     * promise will be rejected.
     *
     * As long as the operation has not yet been run, calling cancel() provides a
     * guarantee that the operation will not be run.
     */
    cancel(reason?: string): void;
    then: <TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined) => Promise<TResult1 | TResult2>;
    private handleDelayElapsed;
    private clearTimeout;
}

/**
 * Deletes the document referred to by the specified `DocumentReference`.
 *
 * The deletion will only be reflected in document reads that occur after the
 * returned promise resolves. If the client is offline, the
 * delete fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the document to delete.
 * @returns A `Promise` resolved once the document has been successfully
 * deleted from the backend.
 */
export declare function deleteDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<void>;

/**
 * Returns a sentinel for use with {@link @firebase/firestore/lite#(updateDoc:1)} or
 * {@link @firebase/firestore/lite#(setDoc:1)} with `{merge: true}` to mark a field for deletion.
 */
export declare function deleteField(): FieldValue;

/**
 * The direction of sorting in an order by.
 */
declare const enum Direction {
    ASCENDING = "asc",
    DESCENDING = "desc"
}

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
 * Represents a document in Firestore with a key, version, data and whether the
 * data has local mutations applied to it.
 */
declare interface Document_2 {
    /** The key for this document */
    readonly key: DocumentKey;
    /**
     * The version of this document if it exists or a version at which this
     * document was guaranteed to not exist.
     */
    readonly version: SnapshotVersion;
    /**
     * The timestamp at which this document was read from the remote server. Uses
     * `SnapshotVersion.min()` for documents created by the user.
     */
    readonly readTime: SnapshotVersion;
    /**
     * The timestamp at which the document was created. This value increases
     * monotonically when a document is deleted then recreated. It can also be
     * compared to `createTime` of other documents and the `readTime` of a query.
     */
    readonly createTime: SnapshotVersion;
    /** The underlying data of this document or an empty value if no data exists. */
    readonly data: ObjectValue;
    /** Returns whether local mutations were applied via the mutation queue. */
    readonly hasLocalMutations: boolean;
    /** Returns whether mutations were applied based on a write acknowledgment. */
    readonly hasCommittedMutations: boolean;
    /**
     * Whether this document had a local mutation applied that has not yet been
     * acknowledged by Watch.
     */
    readonly hasPendingWrites: boolean;
    /**
     * Returns whether this document is valid (i.e. it is an entry in the
     * RemoteDocumentCache, was created by a mutation or read from the backend).
     */
    isValidDocument(): boolean;
    /**
     * Returns whether the document exists and its data is known at the current
     * version.
     */
    isFoundDocument(): boolean;
    /**
     * Returns whether the document is known to not exist at the current version.
     */
    isNoDocument(): boolean;
    /**
     * Returns whether the document exists and its data is unknown at the current
     * version.
     */
    isUnknownDocument(): boolean;
    isEqual(other: Document_2 | null | undefined): boolean;
    /** Creates a mutable copy of this document. */
    mutableCopy(): MutableDocument;
    toString(): string;
}

declare type DocumentComparator = (doc1: Document_2, doc2: Document_2) => number;

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

/* Excluded from this release type: DocumentKey */

declare type DocumentKeyMap<T> = ObjectMap<DocumentKey, T>;

declare type DocumentKeySet = SortedSet<DocumentKey>;

declare type DocumentMap = SortedMap<DocumentKey, Document_2>;

/**
 * Provides methods to read and write document overlays.
 *
 * An overlay is a saved mutation, that gives a local view of a document when
 * applied to the remote version of the document.
 *
 * Each overlay stores the largest batch ID that is included in the overlay,
 * which allows us to remove the overlay once all batches leading up to it have
 * been acknowledged.
 */
declare interface DocumentOverlayCache {
    /**
     * Gets the saved overlay mutation for the given document key.
     * Returns null if there is no overlay for that key.
     */
    getOverlay(transaction: PersistenceTransaction, key: DocumentKey): PersistencePromise<Overlay | null>;
    /**
     * Gets the saved overlay mutation for the given document keys. Skips keys for
     * which there are no overlays.
     */
    getOverlays(transaction: PersistenceTransaction, keys: DocumentKey[]): PersistencePromise<OverlayMap>;
    /**
     * Saves the given document mutation map to persistence as overlays.
     * All overlays will have their largest batch id set to `largestBatchId`.
     */
    saveOverlays(transaction: PersistenceTransaction, largestBatchId: number, overlays: MutationMap): PersistencePromise<void>;
    /** Removes overlays for the given document keys and batch ID. */
    removeOverlaysForBatchId(transaction: PersistenceTransaction, documentKeys: DocumentKeySet, batchId: number): PersistencePromise<void>;
    /**
     * Returns all saved overlays for the given collection.
     *
     * @param transaction - The persistence transaction to use for this operation.
     * @param collection - The collection path to get the overlays for.
     * @param sinceBatchId - The minimum batch ID to filter by (exclusive).
     * Only overlays that contain a change past `sinceBatchId` are returned.
     * @returns Mapping of each document key in the collection to its overlay.
     */
    getOverlaysForCollection(transaction: PersistenceTransaction, collection: ResourcePath, sinceBatchId: number): PersistencePromise<OverlayMap>;
    /**
     * Returns `count` overlays with a batch ID higher than `sinceBatchId` for the
     * provided collection group, processed by ascending batch ID. The method
     * always returns all overlays for a batch even if the last batch contains
     * more documents than the remaining limit.
     *
     * @param transaction - The persistence transaction used for this operation.
     * @param collectionGroup - The collection group to get the overlays for.
     * @param sinceBatchId - The minimum batch ID to filter by (exclusive).
     * Only overlays that contain a change past `sinceBatchId` are returned.
     * @param count - The number of overlays to return. Can be exceeded if the last
     * batch contains more entries.
     * @return Mapping of each document key in the collection group to its overlay.
     */
    getOverlaysForCollectionGroup(transaction: PersistenceTransaction, collectionGroup: string, sinceBatchId: number, count: number): PersistencePromise<OverlayMap>;
}

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
    readonly _key: DocumentKey;
    /** The type of this Firestore reference. */
    readonly type = "document";
    /**
     * The {@link Firestore} instance the document is in.
     * This is useful for performing transactions, for example.
     */
    readonly firestore: Firestore;
    /** @hideconstructor */
    constructor(firestore: Firestore, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    converter: FirestoreDataConverter<AppModelType, DbModelType> | null, _key: DocumentKey);
    get _path(): ResourcePath;
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
 * DocumentSet is an immutable (copy-on-write) collection that holds documents
 * in order specified by the provided comparator. We always add a document key
 * comparator on top of what is provided to guarantee document equality based on
 * the key.
 */
declare class DocumentSet {
    /**
     * Returns an empty copy of the existing DocumentSet, using the same
     * comparator.
     */
    static emptySet(oldSet: DocumentSet): DocumentSet;
    private comparator;
    private keyedMap;
    private sortedSet;
    /** The default ordering is by key if the comparator is omitted */
    constructor(comp?: DocumentComparator);
    has(key: DocumentKey): boolean;
    get(key: DocumentKey): Document_2 | null;
    first(): Document_2 | null;
    last(): Document_2 | null;
    isEmpty(): boolean;
    /**
     * Returns the index of the provided key in the document set, or -1 if the
     * document key is not present in the set;
     */
    indexOf(key: DocumentKey): number;
    get size(): number;
    /** Iterates documents in order defined by "comparator" */
    forEach(cb: (doc: Document_2) => void): void;
    /** Inserts or updates a document with the same key */
    add(doc: Document_2): DocumentSet;
    /** Deletes a document with a given key */
    delete(key: DocumentKey): DocumentSet;
    isEqual(other: DocumentSet | null | undefined): boolean;
    toString(): string;
    private copy;
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
    _firestore: Firestore;
    _userDataWriter: AbstractUserDataWriter;
    _key: DocumentKey;
    _document: Document_2 | null;
    _converter: UntypedFirestoreDataConverter<AppModelType, DbModelType> | null;
    /** @hideconstructor protected */
    constructor(_firestore: Firestore, _userDataWriter: AbstractUserDataWriter, _key: DocumentKey, _document: Document_2 | null, _converter: UntypedFirestoreDataConverter<AppModelType, DbModelType> | null);
    /** Property of the `DocumentSnapshot` that provides the document's ID. */
    get id(): string;
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */
    get ref(): DocumentReference<AppModelType, DbModelType>;
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */
    exists(): this is QueryDocumentSnapshot<AppModelType, DbModelType>;
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */
    data(): AppModelType | undefined;
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    get(fieldPath: string | FieldPath): any;
}

declare type DocumentVersionMap = SortedMap<DocumentKey, SnapshotVersion>;

declare interface DocumentViewChange {
    type: ChangeType;
    doc: Document_2;
}
export { EmulatorMockTokenOptions }

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

declare interface Entry<K, V> {
    key: K;
    value: V;
}

/**
 * EventManager is responsible for mapping queries to query event emitters.
 * It handles "fan-out". -- Identical queries will re-use the same watch on the
 * backend.
 *
 * PORTING NOTE: On Web, EventManager `onListen` and `onUnlisten` need to be
 * assigned to SyncEngine's `listen()` and `unlisten()` API before usage. This
 * allows users to tree-shake the Watch logic.
 */
declare interface EventManager {
    onListen?: (query: Query_2) => Promise<ViewSnapshot>;
    onUnlisten?: (query: Query_2) => Promise<void>;
}

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
declare interface ExperimentalLongPollingOptions {
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

declare class FieldFilter extends Filter {
    readonly field: FieldPath_2;
    readonly op: Operator;
    readonly value: Value;
    protected constructor(field: FieldPath_2, op: Operator, value: Value);
    /**
     * Creates a filter based on the provided arguments.
     */
    static create(field: FieldPath_2, op: Operator, value: Value): FieldFilter;
    private static createKeyFieldInFilter;
    matches(doc: Document_2): boolean;
    protected matchesComparison(comparison: number): boolean;
    isInequality(): boolean;
    getFlattenedFilters(): readonly FieldFilter[];
    getFilters(): Filter[];
}

declare type FieldFilterOp = 'OPERATOR_UNSPECIFIED' | 'LESS_THAN' | 'LESS_THAN_OR_EQUAL' | 'GREATER_THAN' | 'GREATER_THAN_OR_EQUAL' | 'EQUAL' | 'NOT_EQUAL' | 'ARRAY_CONTAINS' | 'IN' | 'ARRAY_CONTAINS_ANY' | 'NOT_IN';

/**
 * An index definition for field indexes in Firestore.
 *
 * Every index is associated with a collection. The definition contains a list
 * of fields and their index kind (which can be `ASCENDING`, `DESCENDING` or
 * `CONTAINS` for ArrayContains/ArrayContainsAny queries).
 *
 * Unlike the backend, the SDK does not differentiate between collection or
 * collection group-scoped indices. Every index can be used for both single
 * collection and collection group queries.
 */
declare class FieldIndex {
    /**
     * The index ID. Returns -1 if the index ID is not available (e.g. the index
     * has not yet been persisted).
     */
    readonly indexId: number;
    /** The collection ID this index applies to. */
    readonly collectionGroup: string;
    /** The field segments for this index. */
    readonly fields: IndexSegment[];
    /** Shows how up-to-date the index is for the current user. */
    readonly indexState: IndexState;
    /** An ID for an index that has not yet been added to persistence.  */
    static UNKNOWN_ID: number;
    constructor(
    /**
     * The index ID. Returns -1 if the index ID is not available (e.g. the index
     * has not yet been persisted).
     */
    indexId: number, 
    /** The collection ID this index applies to. */
    collectionGroup: string, 
    /** The field segments for this index. */
    fields: IndexSegment[], 
    /** Shows how up-to-date the index is for the current user. */
    indexState: IndexState);
}

/**
 * Provides a set of fields that can be used to partially patch a document.
 * FieldMask is used in conjunction with ObjectValue.
 * Examples:
 *   foo - Overwrites foo entirely with the provided value. If foo is not
 *         present in the companion ObjectValue, the field is deleted.
 *   foo.bar - Overwrites only the field bar of the object foo.
 *             If foo is not an object, foo is replaced with an object
 *             containing foo
 */
declare class FieldMask {
    readonly fields: FieldPath_2[];
    constructor(fields: FieldPath_2[]);
    static empty(): FieldMask;
    /**
     * Returns a new FieldMask object that is the result of adding all the given
     * fields paths to this field mask.
     */
    unionWith(extraFields: FieldPath_2[]): FieldMask;
    /**
     * Verifies that `fieldPath` is included by at least one field in this field
     * mask.
     *
     * This is an O(n) operation, where `n` is the size of the field mask.
     */
    covers(fieldPath: FieldPath_2): boolean;
    isEqual(other: FieldMask): boolean;
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
    /** Internal representation of a Firestore field path. */
    readonly _internalPath: FieldPath_2;
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

/* Excluded from this release type: FieldPath_2 */

/** A field path and the TransformOperation to perform upon it. */
declare class FieldTransform {
    readonly field: FieldPath_2;
    readonly transform: TransformOperation;
    constructor(field: FieldPath_2, transform: TransformOperation);
}

declare type FieldTransformSetToServerValue = 'SERVER_VALUE_UNSPECIFIED' | 'REQUEST_TIME';

/**
 * Sentinel values that can be used when writing document fields with `set()`
 * or `update()`.
 */
export declare abstract class FieldValue {
    _methodName: string;
    /**
     * @param _methodName - The public API endpoint that returns this class.
     * @hideconstructor
     */
    constructor(_methodName: string);
    /** Compares `FieldValue`s for equality. */
    abstract isEqual(other: FieldValue): boolean;
    abstract _toFieldTransform(context: ParseContext): FieldTransform | null;
}

declare abstract class Filter {
    abstract matches(doc: Document_2): boolean;
    abstract getFlattenedFilters(): readonly FieldFilter[];
    abstract getFilters(): Filter[];
}

/* Excluded from this release type: _FirebaseService */

/**
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */
export declare class Firestore implements FirestoreService {
    _authCredentials: CredentialsProvider<User>;
    _appCheckCredentials: CredentialsProvider<string>;
    readonly _databaseId: DatabaseId;
    readonly _app?: FirebaseApp | undefined;
    /**
     * Whether it's a Firestore or Firestore Lite instance.
     */
    type: 'firestore-lite' | 'firestore';
    readonly _persistenceKey: string;
    private _settings;
    private _settingsFrozen;
    private _terminateTask?;
    /** @hideconstructor */
    constructor(_authCredentials: CredentialsProvider<User>, _appCheckCredentials: CredentialsProvider<string>, _databaseId: DatabaseId, _app?: FirebaseApp | undefined);
    /**
     * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
     * instance.
     */
    get app(): FirebaseApp;
    get _initialized(): boolean;
    get _terminated(): boolean;
    _setSettings(settings: PrivateSettings): void;
    _getSettings(): FirestoreSettingsImpl;
    _freezeSettings(): FirestoreSettingsImpl;
    _delete(): Promise<void>;
    /** Returns a JSON-serializable representation of this `Firestore` instance. */
    toJSON(): object;
    /**
     * Terminates all components used by this client. Subclasses can override
     * this method to clean up their own dependencies, but must also call this
     * method.
     *
     * Only ever called once.
     */
    protected _terminate(): Promise<void>;
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
 *   fromFirestore(snapshot: QueryDocumentSnapshot): Post {
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
     * `AppModelType` into a plain Javascript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. Used with
     * {@link @firebase/firestore/lite#(setDoc:1)},
     * {@link @firebase/firestore/lite#(WriteBatch.set:1)} and
     * {@link @firebase/firestore/lite#(Transaction.set:1)}.
     *
     * The `WithFieldValue<T>` type extends `T` to also allow FieldValues such as
     * {@link (deleteField:1)} to be used as property values.
     */
    toFirestore(modelObject: WithFieldValue<AppModelType>): WithFieldValue<DbModelType>;
    /**
     * Called by the Firestore SDK to convert a custom model object of type
     * `AppModelType` into a plain Javascript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. Used with
     * {@link @firebase/firestore/lite#(setDoc:1)},
     * {@link @firebase/firestore/lite#(WriteBatch.set:1)} and
     * {@link @firebase/firestore/lite#(Transaction.set:1)} with `merge:true`
     * or `mergeFields`.
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
     * `snapshot.data()`.
     *
     * Generally, the data returned from `snapshot.data()` can be cast to
     * `DbModelType`; however, this is not guaranteed as writes to the database
     * may have occurred without a type converter enforcing this specific layout.
     *
     * @param snapshot - A `QueryDocumentSnapshot` containing your data and
     * metadata.
     */
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>): AppModelType;
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
    /** @hideconstructor */
    constructor(
    /**
     * The backend error code associated with this error.
     */
    code: FirestoreErrorCode, 
    /**
     * A custom error description.
     */
    message: string);
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
declare type FirestoreLocalCache = MemoryLocalCache | PersistentLocalCache;

/**
 * An interface implemented by FirebaseFirestore that provides compatibility
 * with the usage in this file.
 *
 * This interface mainly exists to remove a cyclic dependency.
 */
declare interface FirestoreService extends _FirebaseService {
    _authCredentials: CredentialsProvider<User>;
    _appCheckCredentials: CredentialsProvider<string>;
    _persistenceKey: string;
    _databaseId: DatabaseId;
    _terminated: boolean;
    _freezeSettings(): FirestoreSettingsImpl;
}

/**
 * A concrete type describing all the values that can be applied via a
 * user-supplied `FirestoreSettings` object. This is a separate type so that
 * defaults can be supplied and the value can be checked for equality.
 */
declare class FirestoreSettingsImpl {
    /** The hostname to connect to. */
    readonly host: string;
    /** Whether to use SSL when connecting. */
    readonly ssl: boolean;
    readonly cacheSizeBytes: number;
    readonly experimentalForceLongPolling: boolean;
    readonly experimentalAutoDetectLongPolling: boolean;
    readonly experimentalLongPollingOptions: ExperimentalLongPollingOptions;
    readonly ignoreUndefinedProperties: boolean;
    readonly useFetchStreams: boolean;
    readonly localCache?: FirestoreLocalCache;
    credentials?: any;
    constructor(settings: PrivateSettings);
    isEqual(other: FirestoreSettingsImpl): boolean;
}

declare namespace firestoreV1ApiClientInterfaces {
    interface ArrayValue {
        values?: Value[];
    }
    interface BatchGetDocumentsRequest {
        database?: string;
        documents?: string[];
        mask?: DocumentMask;
        transaction?: string;
        newTransaction?: TransactionOptions;
        readTime?: string;
    }
    interface BatchGetDocumentsResponse {
        found?: Document;
        missing?: string;
        transaction?: string;
        readTime?: string;
    }
    interface BeginTransactionRequest {
        options?: TransactionOptions;
    }
    interface BeginTransactionResponse {
        transaction?: string;
    }
    interface CollectionSelector {
        collectionId?: string;
        allDescendants?: boolean;
    }
    interface CommitRequest {
        database?: string;
        writes?: Write[];
        transaction?: string;
    }
    interface CommitResponse {
        writeResults?: WriteResult[];
        commitTime?: string;
    }
    interface CompositeFilter {
        op?: CompositeFilterOp;
        filters?: Filter[];
    }
    interface Cursor {
        values?: Value[];
        before?: boolean;
    }
    interface Document {
        name?: string;
        fields?: ApiClientObjectMap<Value>;
        createTime?: Timestamp_2;
        updateTime?: Timestamp_2;
    }
    interface DocumentChange {
        document?: Document;
        targetIds?: number[];
        removedTargetIds?: number[];
    }
    interface DocumentDelete {
        document?: string;
        removedTargetIds?: number[];
        readTime?: Timestamp_2;
    }
    interface DocumentMask {
        fieldPaths?: string[];
    }
    interface DocumentRemove {
        document?: string;
        removedTargetIds?: number[];
        readTime?: string;
    }
    interface DocumentTransform {
        document?: string;
        fieldTransforms?: FieldTransform[];
    }
    interface DocumentsTarget {
        documents?: string[];
    }
    interface Empty {
    }
    interface ExistenceFilter {
        targetId?: number;
        count?: number;
        unchangedNames?: BloomFilter;
    }
    interface BloomFilter {
        bits?: BitSequence;
        hashCount?: number;
    }
    interface BitSequence {
        bitmap?: string | Uint8Array;
        padding?: number;
    }
    interface FieldFilter {
        field?: FieldReference;
        op?: FieldFilterOp;
        value?: Value;
    }
    interface FieldReference {
        fieldPath?: string;
    }
    interface FieldTransform {
        fieldPath?: string;
        setToServerValue?: FieldTransformSetToServerValue;
        appendMissingElements?: ArrayValue;
        removeAllFromArray?: ArrayValue;
        increment?: Value;
    }
    interface Filter {
        compositeFilter?: CompositeFilter;
        fieldFilter?: FieldFilter;
        unaryFilter?: UnaryFilter;
    }
    interface Index {
        name?: string;
        collectionId?: string;
        fields?: IndexField[];
        state?: IndexState_2;
    }
    interface IndexField {
        fieldPath?: string;
        mode?: IndexFieldMode;
    }
    interface LatLng {
        latitude?: number;
        longitude?: number;
    }
    interface ListCollectionIdsRequest {
        pageSize?: number;
        pageToken?: string;
    }
    interface ListCollectionIdsResponse {
        collectionIds?: string[];
        nextPageToken?: string;
    }
    interface ListDocumentsResponse {
        documents?: Document[];
        nextPageToken?: string;
    }
    interface ListIndexesResponse {
        indexes?: Index[];
        nextPageToken?: string;
    }
    interface ListenRequest {
        addTarget?: Target;
        removeTarget?: number;
        labels?: ApiClientObjectMap<string>;
    }
    interface ListenResponse {
        targetChange?: TargetChange;
        documentChange?: DocumentChange;
        documentDelete?: DocumentDelete;
        documentRemove?: DocumentRemove;
        filter?: ExistenceFilter;
    }
    interface MapValue {
        fields?: ApiClientObjectMap<Value>;
    }
    interface Operation {
        name?: string;
        metadata?: ApiClientObjectMap<any>;
        done?: boolean;
        error?: Status;
        response?: ApiClientObjectMap<any>;
    }
    interface Order {
        field?: FieldReference;
        direction?: OrderDirection;
    }
    interface Precondition {
        exists?: boolean;
        updateTime?: Timestamp_2;
    }
    interface Projection {
        fields?: FieldReference[];
    }
    interface QueryTarget {
        parent?: string;
        structuredQuery?: StructuredQuery;
    }
    interface ReadOnly {
        readTime?: string;
    }
    interface ReadWrite {
        retryTransaction?: string;
    }
    interface RollbackRequest {
        transaction?: string;
    }
    interface RunQueryRequest {
        parent?: string;
        structuredQuery?: StructuredQuery;
        transaction?: string;
        newTransaction?: TransactionOptions;
        readTime?: string;
    }
    interface RunQueryResponse {
        transaction?: string;
        document?: Document;
        readTime?: string;
        skippedResults?: number;
    }
    interface RunAggregationQueryRequest {
        parent?: string;
        structuredAggregationQuery?: StructuredAggregationQuery;
        transaction?: string;
        newTransaction?: TransactionOptions;
        readTime?: string;
    }
    interface RunAggregationQueryResponse {
        result?: AggregationResult;
        transaction?: string;
        readTime?: string;
    }
    interface AggregationResult {
        aggregateFields?: ApiClientObjectMap<Value>;
    }
    interface StructuredAggregationQuery {
        structuredQuery?: StructuredQuery;
        aggregations?: Aggregation[];
    }
    interface Aggregation {
        count?: Count;
        sum?: Sum;
        avg?: Avg;
        alias?: string;
    }
    interface Count {
        upTo?: number;
    }
    interface Sum {
        field?: FieldReference;
    }
    interface Avg {
        field?: FieldReference;
    }
    interface Status {
        code?: number;
        message?: string;
        details?: Array<ApiClientObjectMap<any>>;
    }
    interface StructuredQuery {
        select?: Projection;
        from?: CollectionSelector[];
        where?: Filter;
        orderBy?: Order[];
        startAt?: Cursor;
        endAt?: Cursor;
        offset?: number;
        limit?: number | {
            value: number;
        };
    }
    interface Target {
        query?: QueryTarget;
        documents?: DocumentsTarget;
        resumeToken?: string | Uint8Array;
        readTime?: Timestamp_2;
        targetId?: number;
        once?: boolean;
        expectedCount?: number | {
            value: number;
        };
    }
    interface TargetChange {
        targetChangeType?: TargetChangeTargetChangeType;
        targetIds?: number[];
        cause?: Status;
        resumeToken?: string | Uint8Array;
        readTime?: Timestamp_2;
    }
    interface TransactionOptions {
        readOnly?: ReadOnly;
        readWrite?: ReadWrite;
    }
    interface UnaryFilter {
        op?: UnaryFilterOp;
        field?: FieldReference;
    }
    interface Value {
        nullValue?: ValueNullValue;
        booleanValue?: boolean;
        integerValue?: string | number;
        doubleValue?: string | number;
        timestampValue?: Timestamp_2;
        stringValue?: string;
        bytesValue?: string | Uint8Array;
        referenceValue?: string;
        geoPointValue?: LatLng;
        arrayValue?: ArrayValue;
        mapValue?: MapValue;
    }
    interface Write {
        update?: Document;
        delete?: string;
        verify?: string;
        transform?: DocumentTransform;
        updateMask?: DocumentMask;
        updateTransforms?: FieldTransform[];
        currentDocument?: Precondition;
    }
    interface WriteRequest {
        streamId?: string;
        writes?: Write[];
        streamToken?: string | Uint8Array;
        labels?: ApiClientObjectMap<string>;
    }
    interface WriteResponse {
        streamId?: string;
        streamToken?: string | Uint8Array;
        writeResults?: WriteResult[];
        commitTime?: Timestamp_2;
    }
    interface WriteResult {
        updateTime?: Timestamp_2;
        transformResults?: Value[];
    }
}

/* Excluded from this release type: FirstPartyCredentialsSettings */

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
declare type FulfilledHandler<T, R> = ((result: T) => R | PersistencePromise<R>) | null;

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
    private _lat;
    private _long;
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
    /**
     * Actually private to JS consumers of our API, so this function is prefixed
     * with an underscore.
     */
    _compareTo(other: GeoPoint): number;
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
 * @param query The query whose result set to aggregate over.
 * @param aggregateSpec An `AggregateSpec` object that specifies the aggregates
 * to perform over the result set. The AggregateSpec specifies aliases for each
 * aggregate, which can be used to retrieve the aggregate result.
 * @example
 * ```typescript
 * const aggregateSnapshot = await getAggregate(query, {
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
export declare function getAggregate<AggregateSpecType extends AggregateSpec, AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, aggregateSpec: AggregateSpecType): Promise<AggregateQuerySnapshot<AggregateSpecType, AppModelType, DbModelType>>;

/**
 * Calculates the number of documents in the result set of the given query,
 * without actually downloading the documents.
 *
 * Using this function to count the documents is efficient because only the
 * final count, not the documents' data, is downloaded. This function can even
 * count the documents if the result set would be prohibitively large to
 * download entirely (e.g. thousands of documents).
 *
 * @param query - The query whose result set size to calculate.
 * @returns A Promise that will be resolved with the count; the count can be
 * retrieved from `snapshot.data().count`, where `snapshot` is the
 * `AggregateQuerySnapshot` to which the returned Promise resolves.
 */
export declare function getCount<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<AggregateQuerySnapshot<{
    count: AggregateField<number>;
}, AppModelType, DbModelType>>;

/**
 * Reads the document referred to by the specified document reference.
 *
 * All documents are directly fetched from the server, even if the document was
 * previously read or modified. Recent modifications are only reflected in the
 * retrieved `DocumentSnapshot` if they have already been applied by the
 * backend. If the client is offline, the read fails. If you like to use
 * caching or see local modifications, please use the full Firestore SDK.
 *
 * @param reference - The reference of the document to fetch.
 * @returns A Promise resolved with a `DocumentSnapshot` containing the current
 * document contents.
 */
export declare function getDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;

/**
 * Executes the query and returns the results as a {@link QuerySnapshot}.
 *
 * All queries are executed directly by the server, even if the the query was
 * previously executed. Recent modifications are only reflected in the retrieved
 * results if they have already been applied by the backend. If the client is
 * offline, the operation fails. To see previously cached result and local
 * modifications, use the full Firestore SDK.
 *
 * @param query - The `Query` to execute.
 * @returns A Promise that will be resolved with the results of the query.
 */
export declare function getDocs<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>>;

/**
 * Returns the existing default {@link Firestore} instance that is associated with the
 * default {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @returns The {@link Firestore} instance of the provided app.
 */
export declare function getFirestore(): Firestore;

/**
 * Returns the existing default {@link Firestore} instance that is associated with the
 * provided {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned {@link Firestore}
 * instance is associated with.
 * @returns The {@link Firestore} instance of the provided app.
 */
export declare function getFirestore(app: FirebaseApp): Firestore;

/**
 * Returns the existing {@link Firestore} instance that is associated with the
 * default {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param databaseId - The name of the database.
 * @returns The {@link Firestore} instance of the provided app.
 * @beta
 */
export declare function getFirestore(databaseId: string): Firestore;

/**
 * Returns the existing {@link Firestore} instance that is associated with the
 * provided {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned {@link Firestore}
 * instance is associated with.
 * @param databaseId - The name of the database.
 * @returns The {@link Firestore} instance of the provided app.
 * @beta
 */
export declare function getFirestore(app: FirebaseApp, databaseId: string): Firestore;

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

declare type IndexFieldMode = 'MODE_UNSPECIFIED' | 'ASCENDING' | 'DESCENDING';

/** The type of the index, e.g. for which type of query it can be used. */
declare const enum IndexKind {
    /**
     * Ordered index. Can be used for <, <=, ==, >=, >, !=, IN and NOT IN queries.
     */
    ASCENDING = 0,
    /**
     * Ordered index. Can be used for <, <=, ==, >=, >, !=, IN and NOT IN queries.
     */
    DESCENDING = 1,
    /** Contains index. Can be used for ArrayContains and ArrayContainsAny. */
    CONTAINS = 2
}

/**
 * Represents a set of indexes that are used to execute queries efficiently.
 *
 * Currently the only index is a [collection id] =&gt; [parent path] index, used
 * to execute Collection Group queries.
 */
declare interface IndexManager {
    /**
     * Creates an index entry mapping the collectionId (last segment of the path)
     * to the parent path (either the containing document location or the empty
     * path for root-level collections). Index entries can be retrieved via
     * getCollectionParents().
     *
     * NOTE: Currently we don't remove index entries. If this ends up being an
     * issue we can devise some sort of GC strategy.
     */
    addToCollectionParentIndex(transaction: PersistenceTransaction, collectionPath: ResourcePath): PersistencePromise<void>;
    /**
     * Retrieves all parent locations containing the given collectionId, as a
     * list of paths (each path being either a document location or the empty
     * path for a root-level collection).
     */
    getCollectionParents(transaction: PersistenceTransaction, collectionId: string): PersistencePromise<ResourcePath[]>;
    /**
     * Adds a field path index.
     *
     * Values for this index are persisted via the index backfill, which runs
     * asynchronously in the background. Once the first values are written,
     * an index can be used to serve partial results for any matching queries.
     * Any unindexed portion of the database will continue to be served via
     * collection scons.
     */
    addFieldIndex(transaction: PersistenceTransaction, index: FieldIndex): PersistencePromise<void>;
    /** Removes the given field index and deletes all index values. */
    deleteFieldIndex(transaction: PersistenceTransaction, index: FieldIndex): PersistencePromise<void>;
    /** Removes all field indexes and deletes all index values. */
    deleteAllFieldIndexes(transaction: PersistenceTransaction): PersistencePromise<void>;
    /** Creates a full matched field index which serves the given target. */
    createTargetIndexes(transaction: PersistenceTransaction, target: Target): PersistencePromise<void>;
    /**
     * Returns a list of field indexes that correspond to the specified collection
     * group.
     *
     * @param collectionGroup The collection group to get matching field indexes
     * for.
     * @return A collection of field indexes for the specified collection group.
     */
    getFieldIndexes(transaction: PersistenceTransaction, collectionGroup: string): PersistencePromise<FieldIndex[]>;
    /** Returns all configured field indexes. */
    getFieldIndexes(transaction: PersistenceTransaction): PersistencePromise<FieldIndex[]>;
    /**
     * Returns the type of index (if any) that can be used to serve the given
     * target.
     */
    getIndexType(transaction: PersistenceTransaction, target: Target): PersistencePromise<IndexType>;
    /**
     * Returns the documents that match the given target based on the provided
     * index or `null` if the target does not have a matching index.
     */
    getDocumentsMatchingTarget(transaction: PersistenceTransaction, target: Target): PersistencePromise<DocumentKey[] | null>;
    /**
     * Returns the next collection group to update. Returns `null` if no group
     * exists.
     */
    getNextCollectionGroupToUpdate(transaction: PersistenceTransaction): PersistencePromise<string | null>;
    /**
     * Sets the collection group's latest read time.
     *
     * This method updates the index offset for all field indices for the
     * collection group and increments their sequence number. Subsequent calls to
     * `getNextCollectionGroupToUpdate()` will return a different collection group
     * (unless only one collection group is configured).
     */
    updateCollectionGroup(transaction: PersistenceTransaction, collectionGroup: string, offset: IndexOffset): PersistencePromise<void>;
    /** Updates the index entries for the provided documents. */
    updateIndexEntries(transaction: PersistenceTransaction, documents: DocumentMap): PersistencePromise<void>;
    /**
     * Iterates over all field indexes that are used to serve the given target,
     * and returns the minimum offset of them all.
     */
    getMinOffset(transaction: PersistenceTransaction, target: Target): PersistencePromise<IndexOffset>;
    /** Returns the minimum offset for the given collection group. */
    getMinOffsetFromCollectionGroup(transaction: PersistenceTransaction, collectionGroup: string): PersistencePromise<IndexOffset>;
}

/**
 * Stores the latest read time, document and batch ID that were processed for an
 * index.
 */
declare class IndexOffset {
    /**
     * The latest read time version that has been indexed by Firestore for this
     * field index.
     */
    readonly readTime: SnapshotVersion;
    /**
     * The key of the last document that was indexed for this query. Use
     * `DocumentKey.empty()` if no document has been indexed.
     */
    readonly documentKey: DocumentKey;
    readonly largestBatchId: number;
    constructor(
    /**
     * The latest read time version that has been indexed by Firestore for this
     * field index.
     */
    readTime: SnapshotVersion, 
    /**
     * The key of the last document that was indexed for this query. Use
     * `DocumentKey.empty()` if no document has been indexed.
     */
    documentKey: DocumentKey, largestBatchId: number);
    /** Returns an offset that sorts before all regular offsets. */
    static min(): IndexOffset;
    /** Returns an offset that sorts after all regular offsets. */
    static max(): IndexOffset;
}

/** An index component consisting of field path and index type.  */
declare class IndexSegment {
    /** The field path of the component. */
    readonly fieldPath: FieldPath_2;
    /** The fields sorting order. */
    readonly kind: IndexKind;
    constructor(
    /** The field path of the component. */
    fieldPath: FieldPath_2, 
    /** The fields sorting order. */
    kind: IndexKind);
}

/**
 * Stores the "high water mark" that indicates how updated the Index is for the
 * current user.
 */
declare class IndexState {
    /**
     * Indicates when the index was last updated (relative to other indexes).
     */
    readonly sequenceNumber: number;
    /** The the latest indexed read time, document and batch id. */
    readonly offset: IndexOffset;
    constructor(
    /**
     * Indicates when the index was last updated (relative to other indexes).
     */
    sequenceNumber: number, 
    /** The the latest indexed read time, document and batch id. */
    offset: IndexOffset);
    /** The state of an index that has not yet been backfilled. */
    static empty(): IndexState;
}

declare type IndexState_2 = 'STATE_UNSPECIFIED' | 'CREATING' | 'READY' | 'ERROR';

/** Represents the index state as it relates to a particular target. */
declare const enum IndexType {
    /** Indicates that no index could be found for serving the target. */
    NONE = 0,
    /**
     * Indicates that only a "partial index" could be found for serving the
     * target. A partial index is one which does not have a segment for every
     * filter/orderBy in the target.
     */
    PARTIAL = 1,
    /**
     * Indicates that a "full index" could be found for serving the target. A full
     * index is one which has a segment for every filter/orderBy in the target.
     */
    FULL = 2
}

/**
 * Initializes a new instance of Cloud Firestore with the provided settings.
 * Can only be called before any other functions, including
 * {@link (getFirestore:1)}. If the custom settings are empty, this function is
 * equivalent to calling {@link (getFirestore:1)}.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} with which the `Firestore` instance will
 * be associated.
 * @param settings - A settings object to configure the `Firestore` instance.
 * @returns A newly initialized `Firestore` instance.
 */
export declare function initializeFirestore(app: FirebaseApp, settings: Settings): Firestore;

/**
 * Initializes a new instance of Cloud Firestore with the provided settings.
 * Can only be called before any other functions, including
 * {@link (getFirestore:1)}. If the custom settings are empty, this function is
 * equivalent to calling {@link (getFirestore:1)}.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} with which the `Firestore` instance will
 * be associated.
 * @param settings - A settings object to configure the `Firestore` instance.
 * @param databaseId - The name of the database.
 * @returns A newly initialized `Firestore` instance.
 * @beta
 */
export declare function initializeFirestore(app: FirebaseApp, settings: Settings, databaseId?: string): Firestore;

/**
 * This class generates JsonObject values for the Datastore API suitable for
 * sending to either GRPC stub methods or via the JSON/HTTP REST API.
 *
 * The serializer supports both Protobuf.js and Proto3 JSON formats. By
 * setting `useProto3Json` to true, the serializer will use the Proto3 JSON
 * format.
 *
 * For a description of the Proto3 JSON format check
 * https://developers.google.com/protocol-buffers/docs/proto3#json
 *
 * TODO(klimt): We can remove the databaseId argument if we keep the full
 * resource name in documents.
 */
declare class JsonProtoSerializer implements Serializer {
    readonly databaseId: DatabaseId;
    readonly useProto3Json: boolean;
    constructor(databaseId: DatabaseId, useProto3Json: boolean);
}

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

declare const enum LimitType {
    First = "F",
    Last = "L"
}

/** LimitType enum. */
declare type LimitType_2 = 'FIRST' | 'LAST';

declare type ListenSequenceNumber = number;

declare class LLRBEmptyNode<K, V> {
    get key(): never;
    get value(): never;
    get color(): never;
    get left(): never;
    get right(): never;
    size: number;
    copy(key: K | null, value: V | null, color: boolean | null, left: LLRBNode<K, V> | LLRBEmptyNode<K, V> | null, right: LLRBNode<K, V> | LLRBEmptyNode<K, V> | null): LLRBEmptyNode<K, V>;
    insert(key: K, value: V, comparator: Comparator<K>): LLRBNode<K, V>;
    remove(key: K, comparator: Comparator<K>): LLRBEmptyNode<K, V>;
    isEmpty(): boolean;
    inorderTraversal(action: (k: K, v: V) => boolean): boolean;
    reverseTraversal(action: (k: K, v: V) => boolean): boolean;
    minKey(): K | null;
    maxKey(): K | null;
    isRed(): boolean;
    checkMaxDepth(): boolean;
    protected check(): 0;
}

declare class LLRBNode<K, V> {
    key: K;
    value: V;
    readonly color: boolean;
    readonly left: LLRBNode<K, V> | LLRBEmptyNode<K, V>;
    readonly right: LLRBNode<K, V> | LLRBEmptyNode<K, V>;
    readonly size: number;
    static EMPTY: LLRBEmptyNode<any, any>;
    static RED: boolean;
    static BLACK: boolean;
    constructor(key: K, value: V, color?: boolean, left?: LLRBNode<K, V> | LLRBEmptyNode<K, V>, right?: LLRBNode<K, V> | LLRBEmptyNode<K, V>);
    copy(key: K | null, value: V | null, color: boolean | null, left: LLRBNode<K, V> | LLRBEmptyNode<K, V> | null, right: LLRBNode<K, V> | LLRBEmptyNode<K, V> | null): LLRBNode<K, V>;
    isEmpty(): boolean;
    inorderTraversal<T>(action: (k: K, v: V) => T): T;
    reverseTraversal<T>(action: (k: K, v: V) => T): T;
    private min;
    minKey(): K | null;
    maxKey(): K | null;
    insert(key: K, value: V, comparator: Comparator<K>): LLRBNode<K, V>;
    private removeMin;
    remove(key: K, comparator: Comparator<K>): LLRBNode<K, V> | LLRBEmptyNode<K, V>;
    isRed(): boolean;
    private fixUp;
    private moveRedLeft;
    private moveRedRight;
    private rotateLeft;
    private rotateRight;
    private colorFlip;
    checkMaxDepth(): boolean;
    protected check(): number;
}

/**
 * A readonly view of the local state of all documents we're tracking (i.e. we
 * have a cached version in remoteDocumentCache or local mutations for the
 * document). The view is computed by applying the mutations in the
 * MutationQueue to the RemoteDocumentCache.
 */
declare class LocalDocumentsView {
    readonly remoteDocumentCache: RemoteDocumentCache;
    readonly mutationQueue: MutationQueue;
    readonly documentOverlayCache: DocumentOverlayCache;
    readonly indexManager: IndexManager;
    constructor(remoteDocumentCache: RemoteDocumentCache, mutationQueue: MutationQueue, documentOverlayCache: DocumentOverlayCache, indexManager: IndexManager);
    /**
     * Get the local view of the document identified by `key`.
     *
     * @returns Local view of the document or null if we don't have any cached
     * state for it.
     */
    getDocument(transaction: PersistenceTransaction, key: DocumentKey): PersistencePromise<Document_2>;
    /**
     * Gets the local view of the documents identified by `keys`.
     *
     * If we don't have cached state for a document in `keys`, a NoDocument will
     * be stored for that key in the resulting set.
     */
    getDocuments(transaction: PersistenceTransaction, keys: DocumentKeySet): PersistencePromise<DocumentMap>;
    /**
     * Similar to `getDocuments`, but creates the local view from the given
     * `baseDocs` without retrieving documents from the local store.
     *
     * @param transaction - The transaction this operation is scoped to.
     * @param docs - The documents to apply local mutations to get the local views.
     * @param existenceStateChanged - The set of document keys whose existence state
     *   is changed. This is useful to determine if some documents overlay needs
     *   to be recalculated.
     */
    getLocalViewOfDocuments(transaction: PersistenceTransaction, docs: MutableDocumentMap, existenceStateChanged?: DocumentKeySet): PersistencePromise<DocumentMap>;
    /**
     * Gets the overlayed documents for the given document map, which will include
     * the local view of those documents and a `FieldMask` indicating which fields
     * are mutated locally, `null` if overlay is a Set or Delete mutation.
     */
    getOverlayedDocuments(transaction: PersistenceTransaction, docs: MutableDocumentMap): PersistencePromise<OverlayedDocumentMap>;
    /**
     * Fetches the overlays for {@code docs} and adds them to provided overlay map
     * if the map does not already contain an entry for the given document key.
     */
    private populateOverlays;
    /**
     * Computes the local view for the given documents.
     *
     * @param docs - The documents to compute views for. It also has the base
     *   version of the documents.
     * @param overlays - The overlays that need to be applied to the given base
     *   version of the documents.
     * @param existenceStateChanged - A set of documents whose existence states
     *   might have changed. This is used to determine if we need to re-calculate
     *   overlays from mutation queues.
     * @return A map represents the local documents view.
     */
    computeViews(transaction: PersistenceTransaction, docs: MutableDocumentMap, overlays: OverlayMap, existenceStateChanged: DocumentKeySet): PersistencePromise<OverlayedDocumentMap>;
    private recalculateAndSaveOverlays;
    /**
     * Recalculates overlays by reading the documents from remote document cache
     * first, and saves them after they are calculated.
     */
    recalculateAndSaveOverlaysForDocumentKeys(transaction: PersistenceTransaction, documentKeys: DocumentKeySet): PersistencePromise<DocumentKeyMap<FieldMask | null>>;
    /**
     * Performs a query against the local view of all documents.
     *
     * @param transaction - The persistence transaction.
     * @param query - The query to match documents against.
     * @param offset - Read time and key to start scanning by (exclusive).
     * @param context - A optional tracker to keep a record of important details
     *   during database local query execution.
     */
    getDocumentsMatchingQuery(transaction: PersistenceTransaction, query: Query_2, offset: IndexOffset, context?: QueryContext): PersistencePromise<DocumentMap>;
    /**
     * Given a collection group, returns the next documents that follow the provided offset, along
     * with an updated batch ID.
     *
     * <p>The documents returned by this method are ordered by remote version from the provided
     * offset. If there are no more remote documents after the provided offset, documents with
     * mutations in order of batch id from the offset are returned. Since all documents in a batch are
     * returned together, the total number of documents returned can exceed {@code count}.
     *
     * @param transaction
     * @param collectionGroup The collection group for the documents.
     * @param offset The offset to index into.
     * @param count The number of documents to return
     * @return A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
     */
    getNextDocuments(transaction: PersistenceTransaction, collectionGroup: string, offset: IndexOffset, count: number): PersistencePromise<LocalWriteResult>;
    private getDocumentsMatchingDocumentQuery;
    private getDocumentsMatchingCollectionGroupQuery;
    private getDocumentsMatchingCollectionQuery;
}

declare interface LocalStore {
    collectGarbage(garbageCollector: LruGarbageCollector): Promise<LruResults>;
    /** Manages the list of active field and collection indices. */
    indexManager: IndexManager;
    /**
     * The "local" view of all documents (layering mutationQueue on top of
     * remoteDocumentCache).
     */
    localDocuments: LocalDocumentsView;
}

/** The result of a write to the local store. */
declare interface LocalWriteResult {
    batchId: BatchId;
    changes: DocumentMap;
}
export { LogLevel }

declare interface LruGarbageCollector {
    readonly params: LruParams;
    collect(txn: PersistenceTransaction, activeTargetIds: ActiveTargets): PersistencePromise<LruResults>;
    /** Given a percentile of target to collect, returns the number of targets to collect. */
    calculateTargetCount(txn: PersistenceTransaction, percentile: number): PersistencePromise<number>;
    /** Returns the nth sequence number, counting in order from the smallest. */
    nthSequenceNumber(txn: PersistenceTransaction, n: number): PersistencePromise<number>;
    /**
     * Removes documents that have a sequence number equal to or less than the
     * upper bound and are not otherwise pinned.
     */
    removeOrphanedDocuments(txn: PersistenceTransaction, upperBound: ListenSequenceNumber): PersistencePromise<number>;
    getCacheSize(txn: PersistenceTransaction): PersistencePromise<number>;
    /**
     * Removes targets with a sequence number equal to or less than the given
     * upper bound, and removes document associations with those targets.
     */
    removeTargets(txn: PersistenceTransaction, upperBound: ListenSequenceNumber, activeTargetIds: ActiveTargets): PersistencePromise<number>;
}

declare class LruParams {
    readonly cacheSizeCollectionThreshold: number;
    readonly percentileToCollect: number;
    readonly maximumSequenceNumbersToCollect: number;
    private static readonly DEFAULT_COLLECTION_PERCENTILE;
    private static readonly DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT;
    static withCacheSize(cacheSize: number): LruParams;
    static readonly DEFAULT: LruParams;
    static readonly DISABLED: LruParams;
    constructor(cacheSizeCollectionThreshold: number, percentileToCollect: number, maximumSequenceNumbersToCollect: number);
}

/**
 * Describes the results of a garbage collection run. `didRun` will be set to
 * `false` if collection was skipped (either it is disabled or the cache size
 * has not hit the threshold). If collection ran, the other fields will be
 * filled in with the details of the results.
 */
declare interface LruResults {
    readonly didRun: boolean;
    readonly sequenceNumbersCollected: number;
    readonly targetsRemoved: number;
    readonly documentsRemoved: number;
}

declare type MapValue = firestoreV1ApiClientInterfaces.MapValue;

/**
 * Provides an in-memory cache to the SDK. This is the default cache unless explicitly
 * configured otherwise.
 *
 * To use, create an instance using the factory function {@link memoryLocalCache()}, then
 * set the instance to `FirestoreSettings.cache` and call `initializeFirestore` using
 * the settings object.
 */
declare type MemoryLocalCache = {
    kind: 'memory';
    /* Excluded from this release type: _onlineComponentProvider */
    /* Excluded from this release type: _offlineComponentProvider */
};

/**
 * Provides all components needed for Firestore with in-memory persistence.
 * Uses EagerGC garbage collection.
 */
declare class MemoryOfflineComponentProvider implements OfflineComponentProvider {
    persistence: Persistence;
    sharedClientState: SharedClientState;
    localStore: LocalStore;
    gcScheduler: Scheduler | null;
    indexBackfillerScheduler: Scheduler | null;
    synchronizeTabs: boolean;
    serializer: JsonProtoSerializer;
    initialize(cfg: ComponentConfiguration): Promise<void>;
    createGarbageCollectionScheduler(cfg: ComponentConfiguration, localStore: LocalStore): Scheduler | null;
    createIndexBackfillerScheduler(cfg: ComponentConfiguration, localStore: LocalStore): Scheduler | null;
    createLocalStore(cfg: ComponentConfiguration): LocalStore;
    createPersistence(cfg: ComponentConfiguration): Persistence;
    createSharedClientState(cfg: ComponentConfiguration): SharedClientState;
    terminate(): Promise<void>;
}

/**
 * Represents a document in Firestore with a key, version, data and whether it
 * has local mutations applied to it.
 *
 * Documents can transition between states via `convertToFoundDocument()`,
 * `convertToNoDocument()` and `convertToUnknownDocument()`. If a document does
 * not transition to one of these states even after all mutations have been
 * applied, `isValidDocument()` returns false and the document should be removed
 * from all views.
 */
declare class MutableDocument implements Document_2 {
    readonly key: DocumentKey;
    private documentType;
    version: SnapshotVersion;
    readTime: SnapshotVersion;
    createTime: SnapshotVersion;
    data: ObjectValue;
    private documentState;
    private constructor();
    /**
     * Creates a document with no known version or data, but which can serve as
     * base document for mutations.
     */
    static newInvalidDocument(documentKey: DocumentKey): MutableDocument;
    /**
     * Creates a new document that is known to exist with the given data at the
     * given version.
     */
    static newFoundDocument(documentKey: DocumentKey, version: SnapshotVersion, createTime: SnapshotVersion, value: ObjectValue): MutableDocument;
    /** Creates a new document that is known to not exist at the given version. */
    static newNoDocument(documentKey: DocumentKey, version: SnapshotVersion): MutableDocument;
    /**
     * Creates a new document that is known to exist at the given version but
     * whose data is not known (e.g. a document that was updated without a known
     * base document).
     */
    static newUnknownDocument(documentKey: DocumentKey, version: SnapshotVersion): MutableDocument;
    /**
     * Changes the document type to indicate that it exists and that its version
     * and data are known.
     */
    convertToFoundDocument(version: SnapshotVersion, value: ObjectValue): MutableDocument;
    /**
     * Changes the document type to indicate that it doesn't exist at the given
     * version.
     */
    convertToNoDocument(version: SnapshotVersion): MutableDocument;
    /**
     * Changes the document type to indicate that it exists at a given version but
     * that its data is not known (e.g. a document that was updated without a known
     * base document).
     */
    convertToUnknownDocument(version: SnapshotVersion): MutableDocument;
    setHasCommittedMutations(): MutableDocument;
    setHasLocalMutations(): MutableDocument;
    setReadTime(readTime: SnapshotVersion): MutableDocument;
    get hasLocalMutations(): boolean;
    get hasCommittedMutations(): boolean;
    get hasPendingWrites(): boolean;
    isValidDocument(): boolean;
    isFoundDocument(): boolean;
    isNoDocument(): boolean;
    isUnknownDocument(): boolean;
    isEqual(other: Document_2 | null | undefined): boolean;
    mutableCopy(): MutableDocument;
    toString(): string;
}

/** Miscellaneous collection types / constants. */
declare type MutableDocumentMap = SortedMap<DocumentKey, MutableDocument>;

/**
 * A mutation describes a self-contained change to a document. Mutations can
 * create, replace, delete, and update subsets of documents.
 *
 * Mutations not only act on the value of the document but also its version.
 *
 * For local mutations (mutations that haven't been committed yet), we preserve
 * the existing version for Set and Patch mutations. For Delete mutations, we
 * reset the version to 0.
 *
 * Here's the expected transition table.
 *
 * MUTATION           APPLIED TO            RESULTS IN
 *
 * SetMutation        Document(v3)          Document(v3)
 * SetMutation        NoDocument(v3)        Document(v0)
 * SetMutation        InvalidDocument(v0)   Document(v0)
 * PatchMutation      Document(v3)          Document(v3)
 * PatchMutation      NoDocument(v3)        NoDocument(v3)
 * PatchMutation      InvalidDocument(v0)   UnknownDocument(v3)
 * DeleteMutation     Document(v3)          NoDocument(v0)
 * DeleteMutation     NoDocument(v3)        NoDocument(v0)
 * DeleteMutation     InvalidDocument(v0)   NoDocument(v0)
 *
 * For acknowledged mutations, we use the updateTime of the WriteResponse as
 * the resulting version for Set and Patch mutations. As deletes have no
 * explicit update time, we use the commitTime of the WriteResponse for
 * Delete mutations.
 *
 * If a mutation is acknowledged by the backend but fails the precondition check
 * locally, we transition to an `UnknownDocument` and rely on Watch to send us
 * the updated version.
 *
 * Field transforms are used only with Patch and Set Mutations. We use the
 * `updateTransforms` message to store transforms, rather than the `transforms`s
 * messages.
 *
 * ## Subclassing Notes
 *
 * Every type of mutation needs to implement its own applyToRemoteDocument() and
 * applyToLocalView() to implement the actual behavior of applying the mutation
 * to some source document (see `setMutationApplyToRemoteDocument()` for an
 * example).
 */
declare abstract class Mutation {
    abstract readonly type: MutationType;
    abstract readonly key: DocumentKey;
    abstract readonly precondition: Precondition;
    abstract readonly fieldTransforms: FieldTransform[];
    /**
     * Returns a `FieldMask` representing the fields that will be changed by
     * applying this mutation. Returns `null` if the mutation will overwrite the
     * entire document.
     */
    abstract getFieldMask(): FieldMask | null;
}

/**
 * A batch of mutations that will be sent as one unit to the backend.
 */
declare class MutationBatch {
    batchId: BatchId;
    localWriteTime: Timestamp;
    baseMutations: Mutation[];
    mutations: Mutation[];
    /**
     * @param batchId - The unique ID of this mutation batch.
     * @param localWriteTime - The original write time of this mutation.
     * @param baseMutations - Mutations that are used to populate the base
     * values when this mutation is applied locally. This can be used to locally
     * overwrite values that are persisted in the remote document cache. Base
     * mutations are never sent to the backend.
     * @param mutations - The user-provided mutations in this mutation batch.
     * User-provided mutations are applied both locally and remotely on the
     * backend.
     */
    constructor(batchId: BatchId, localWriteTime: Timestamp, baseMutations: Mutation[], mutations: Mutation[]);
    /**
     * Applies all the mutations in this MutationBatch to the specified document
     * to compute the state of the remote document
     *
     * @param document - The document to apply mutations to.
     * @param batchResult - The result of applying the MutationBatch to the
     * backend.
     */
    applyToRemoteDocument(document: MutableDocument, batchResult: MutationBatchResult): void;
    /**
     * Computes the local view of a document given all the mutations in this
     * batch.
     *
     * @param document - The document to apply mutations to.
     * @param mutatedFields - Fields that have been updated before applying this mutation batch.
     * @returns A `FieldMask` representing all the fields that are mutated.
     */
    applyToLocalView(document: MutableDocument, mutatedFields: FieldMask | null): FieldMask | null;
    /**
     * Computes the local view for all provided documents given the mutations in
     * this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
     * replace all the mutation applications.
     */
    applyToLocalDocumentSet(documentMap: OverlayedDocumentMap, documentsWithoutRemoteVersion: DocumentKeySet): MutationMap;
    keys(): DocumentKeySet;
    isEqual(other: MutationBatch): boolean;
}

/** The result of applying a mutation batch to the backend. */
declare class MutationBatchResult {
    readonly batch: MutationBatch;
    readonly commitVersion: SnapshotVersion;
    readonly mutationResults: MutationResult[];
    /**
     * A pre-computed mapping from each mutated document to the resulting
     * version.
     */
    readonly docVersions: DocumentVersionMap;
    private constructor();
    /**
     * Creates a new MutationBatchResult for the given batch and results. There
     * must be one result for each mutation in the batch. This static factory
     * caches a document=&gt;version mapping (docVersions).
     */
    static from(batch: MutationBatch, commitVersion: SnapshotVersion, results: MutationResult[]): MutationBatchResult;
}

declare type MutationMap = DocumentKeyMap<Mutation>;

/** A queue of mutations to apply to the remote store. */
declare interface MutationQueue {
    /** Returns true if this queue contains no mutation batches. */
    checkEmpty(transaction: PersistenceTransaction): PersistencePromise<boolean>;
    /**
     * Creates a new mutation batch and adds it to this mutation queue.
     *
     * @param transaction - The transaction this operation is scoped to.
     * @param localWriteTime - The original write time of this mutation.
     * @param baseMutations - Mutations that are used to populate the base values
     * when this mutation is applied locally. These mutations are used to locally
     * overwrite values that are persisted in the remote document cache.
     * @param mutations - The user-provided mutations in this mutation batch.
     */
    addMutationBatch(transaction: PersistenceTransaction, localWriteTime: Timestamp, baseMutations: Mutation[], mutations: Mutation[]): PersistencePromise<MutationBatch>;
    /**
     * Loads the mutation batch with the given batchId.
     */
    lookupMutationBatch(transaction: PersistenceTransaction, batchId: BatchId): PersistencePromise<MutationBatch | null>;
    /**
     * Gets the first unacknowledged mutation batch after the passed in batchId
     * in the mutation queue or null if empty.
     *
     * @param batchId - The batch to search after, or BATCHID_UNKNOWN for the
     * first mutation in the queue.
     *
     * @returns the next mutation or null if there wasn't one.
     */
    getNextMutationBatchAfterBatchId(transaction: PersistenceTransaction, batchId: BatchId): PersistencePromise<MutationBatch | null>;
    /**
     * Gets the largest (latest) batch id in mutation queue for the current user
     * that is pending server response, returns `BATCHID_UNKNOWN` if the queue is
     * empty.
     *
     * @returns the largest batch id in the mutation queue that is not
     * acknowledged.
     */
    getHighestUnacknowledgedBatchId(transaction: PersistenceTransaction): PersistencePromise<BatchId>;
    /** Gets all mutation batches in the mutation queue. */
    getAllMutationBatches(transaction: PersistenceTransaction): PersistencePromise<MutationBatch[]>;
    /**
     * Finds all mutation batches that could possibly affect the given
     * document key. Not all mutations in a batch will necessarily affect the
     * document key, so when looping through the batch you'll need to check that
     * the mutation itself matches the key.
     *
     * Batches are guaranteed to be in sorted order.
     *
     * Note that because of this requirement implementations are free to return
     * mutation batches that don't contain the document key at all if it's
     * convenient.
     */
    getAllMutationBatchesAffectingDocumentKey(transaction: PersistenceTransaction, documentKey: DocumentKey): PersistencePromise<MutationBatch[]>;
    /**
     * Finds all mutation batches that could possibly affect the given set of
     * document keys. Not all mutations in a batch will necessarily affect each
     * key, so when looping through the batch you'll need to check that the
     * mutation itself matches the key.
     *
     * Batches are guaranteed to be in sorted order.
     *
     * Note that because of this requirement implementations are free to return
     * mutation batches that don't contain any of the document keys at all if it's
     * convenient.
     */
    getAllMutationBatchesAffectingDocumentKeys(transaction: PersistenceTransaction, documentKeys: SortedMap<DocumentKey, unknown>): PersistencePromise<MutationBatch[]>;
    /**
     * Finds all mutation batches that could affect the results for the given
     * query. Not all mutations in a batch will necessarily affect the query, so
     * when looping through the batch you'll need to check that the mutation
     * itself matches the query.
     *
     * Batches are guaranteed to be in sorted order.
     *
     * Note that because of this requirement implementations are free to return
     * mutation batches that don't match the query at all if it's convenient.
     *
     * NOTE: A PatchMutation does not need to include all fields in the query
     * filter criteria in order to be a match (but any fields it does contain do
     * need to match).
     */
    getAllMutationBatchesAffectingQuery(transaction: PersistenceTransaction, query: Query_2): PersistencePromise<MutationBatch[]>;
    /**
     * Removes the given mutation batch from the queue. This is useful in two
     * circumstances:
     *
     * + Removing an applied mutation from the head of the queue
     * + Removing a rejected mutation from anywhere in the queue
     *
     * Multi-Tab Note: This operation should only be called by the primary client.
     */
    removeMutationBatch(transaction: PersistenceTransaction, batch: MutationBatch): PersistencePromise<void>;
    /**
     * Performs a consistency check, examining the mutation queue for any
     * leaks, if possible.
     */
    performConsistencyCheck(transaction: PersistenceTransaction): PersistencePromise<void>;
}

/** The result of successfully applying a mutation to the backend. */
declare class MutationResult {
    /**
     * The version at which the mutation was committed:
     *
     * - For most operations, this is the updateTime in the WriteResult.
     * - For deletes, the commitTime of the WriteResponse (because deletes are
     *   not stored and have no updateTime).
     *
     * Note that these versions can be different: No-op writes will not change
     * the updateTime even though the commitTime advances.
     */
    readonly version: SnapshotVersion;
    /**
     * The resulting fields returned from the backend after a mutation
     * containing field transforms has been committed. Contains one FieldValue
     * for each FieldTransform that was in the mutation.
     *
     * Will be empty if the mutation did not contain any field transforms.
     */
    readonly transformResults: Array<Value | null>;
    constructor(
    /**
     * The version at which the mutation was committed:
     *
     * - For most operations, this is the updateTime in the WriteResult.
     * - For deletes, the commitTime of the WriteResponse (because deletes are
     *   not stored and have no updateTime).
     *
     * Note that these versions can be different: No-op writes will not change
     * the updateTime even though the commitTime advances.
     */
    version: SnapshotVersion, 
    /**
     * The resulting fields returned from the backend after a mutation
     * containing field transforms has been committed. Contains one FieldValue
     * for each FieldTransform that was in the mutation.
     *
     * Will be empty if the mutation did not contain any field transforms.
     */
    transformResults: Array<Value | null>);
}

declare const enum MutationType {
    Set = 0,
    Patch = 1,
    Delete = 2,
    Verify = 3
}

/**
 * Represents a Query saved by the SDK in its local storage.
 */
declare interface NamedQuery {
    /** The name of the query. */
    readonly name: string;
    /** The underlying query associated with `name`. */
    readonly query: Query_2;
    /** The time at which the results for this query were read. */
    readonly readTime: SnapshotVersion;
}

/** Properties of a NamedQuery. */
declare interface NamedQuery_2 {
    /** NamedQuery name */
    name?: string | null;
    /** NamedQuery bundledQuery */
    bundledQuery?: BundledQuery | null;
    /** NamedQuery readTime */
    readTime?: Timestamp_2 | null;
}

/**
 * For each field (e.g. 'bar'), find all nested keys (e.g. {'bar.baz': T1,
 * 'bar.qux': T2}). Intersect them together to make a single map containing
 * all possible keys that are all marked as optional
 */
export declare type NestedUpdateFields<T extends Record<string, unknown>> = UnionToIntersection<{
    [K in keyof T & string]: ChildUpdateFields<K, T[K]>;
}[keyof T & string]>;

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
 * A map implementation that uses objects as keys. Objects must have an
 * associated equals function and must be immutable. Entries in the map are
 * stored together with the key being produced from the mapKeyFn. This map
 * automatically handles collisions of keys.
 */
declare class ObjectMap<KeyType, ValueType> {
    private mapKeyFn;
    private equalsFn;
    /**
     * The inner map for a key/value pair. Due to the possibility of collisions we
     * keep a list of entries that we do a linear search through to find an actual
     * match. Note that collisions should be rare, so we still expect near
     * constant time lookups in practice.
     */
    private inner;
    /** The number of entries stored in the map */
    private innerSize;
    constructor(mapKeyFn: (key: KeyType) => string, equalsFn: (l: KeyType, r: KeyType) => boolean);
    /** Get a value for this key, or undefined if it does not exist. */
    get(key: KeyType): ValueType | undefined;
    has(key: KeyType): boolean;
    /** Put this key and value in the map. */
    set(key: KeyType, value: ValueType): void;
    /**
     * Remove this key from the map. Returns a boolean if anything was deleted.
     */
    delete(key: KeyType): boolean;
    forEach(fn: (key: KeyType, val: ValueType) => void): void;
    isEmpty(): boolean;
    size(): number;
}

/**
 * An ObjectValue represents a MapValue in the Firestore Proto and offers the
 * ability to add and remove fields (via the ObjectValueBuilder).
 */
declare class ObjectValue {
    readonly value: {
        mapValue: MapValue;
    };
    constructor(value: {
        mapValue: MapValue;
    });
    static empty(): ObjectValue;
    /**
     * Returns the value at the given path or null.
     *
     * @param path - the path to search
     * @returns The value at the path or null if the path is not set.
     */
    field(path: FieldPath_2): Value | null;
    /**
     * Sets the field to the provided value.
     *
     * @param path - The field path to set.
     * @param value - The value to set.
     */
    set(path: FieldPath_2, value: Value): void;
    /**
     * Sets the provided fields to the provided values.
     *
     * @param data - A map of fields to values (or null for deletes).
     */
    setAll(data: Map<FieldPath_2, Value | null>): void;
    /**
     * Removes the field at the specified path. If there is no field at the
     * specified path, nothing is changed.
     *
     * @param path - The field path to remove.
     */
    delete(path: FieldPath_2): void;
    isEqual(other: ObjectValue): boolean;
    /**
     * Returns the map that contains the leaf element of `path`. If the parent
     * entry does not yet exist, or if it is not a map, a new map will be created.
     */
    private getFieldsMap;
    /**
     * Modifies `fieldsMap` by adding, replacing or deleting the specified
     * entries.
     */
    private applyChanges;
    clone(): ObjectValue;
}

/**
 * Initializes and wires components that are needed to interface with the local
 * cache. Implementations override `initialize()` to provide all components.
 */
declare interface OfflineComponentProvider {
    persistence: Persistence;
    sharedClientState: SharedClientState;
    localStore: LocalStore;
    gcScheduler: Scheduler | null;
    indexBackfillerScheduler: Scheduler | null;
    synchronizeTabs: boolean;
    initialize(cfg: ComponentConfiguration): Promise<void>;
    terminate(): Promise<void>;
}

/**
 * Initializes and wires the components that are needed to interface with the
 * network.
 */
declare class OnlineComponentProvider {
    protected localStore: LocalStore;
    protected sharedClientState: SharedClientState;
    datastore: Datastore;
    eventManager: EventManager;
    remoteStore: RemoteStore;
    syncEngine: SyncEngine;
    initialize(offlineComponentProvider: OfflineComponentProvider, cfg: ComponentConfiguration): Promise<void>;
    createEventManager(cfg: ComponentConfiguration): EventManager;
    createDatastore(cfg: ComponentConfiguration): Datastore;
    createRemoteStore(cfg: ComponentConfiguration): RemoteStore;
    createSyncEngine(cfg: ComponentConfiguration, startAsPrimary: boolean): SyncEngine;
    terminate(): Promise<void>;
}

/**
 * Describes the online state of the Firestore client. Note that this does not
 * indicate whether or not the remote store is trying to connect or not. This is
 * primarily used by the View / EventManager code to change their behavior while
 * offline (e.g. get() calls shouldn't wait for data from the server and
 * snapshot events should set metadata.isFromCache=true).
 *
 * The string values should not be changed since they are persisted in
 * WebStorage.
 */
declare const enum OnlineState {
    /**
     * The Firestore client is in an unknown online state. This means the client
     * is either not actively trying to establish a connection or it is currently
     * trying to establish a connection, but it has not succeeded or failed yet.
     * Higher-level components should not operate in offline mode.
     */
    Unknown = "Unknown",
    /**
     * The client is connected and the connections are healthy. This state is
     * reached after a successful connection and there has been at least one
     * successful message received from the backends.
     */
    Online = "Online",
    /**
     * The client is either trying to establish a connection but failing, or it
     * has been explicitly marked offline via a call to disableNetwork().
     * Higher-level components should operate in offline mode.
     */
    Offline = "Offline"
}

declare const enum Operator {
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL = "<=",
    EQUAL = "==",
    NOT_EQUAL = "!=",
    GREATER_THAN = ">",
    GREATER_THAN_OR_EQUAL = ">=",
    ARRAY_CONTAINS = "array-contains",
    IN = "in",
    NOT_IN = "not-in",
    ARRAY_CONTAINS_ANY = "array-contains-any"
}

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
 * An ordering on a field, in some Direction. Direction defaults to ASCENDING.
 */
declare class OrderBy {
    readonly field: FieldPath_2;
    readonly dir: Direction;
    constructor(field: FieldPath_2, dir?: Direction);
}

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

declare type OrderDirection = 'DIRECTION_UNSPECIFIED' | 'ASCENDING' | 'DESCENDING';

/**
 * Representation of an overlay computed by Firestore.
 *
 * Holds information about a mutation and the largest batch id in Firestore when
 * the mutation was created.
 */
declare class Overlay {
    readonly largestBatchId: number;
    readonly mutation: Mutation;
    constructor(largestBatchId: number, mutation: Mutation);
    getKey(): DocumentKey;
    isEqual(other: Overlay | null): boolean;
    toString(): string;
}

/**
 * Represents a local view (overlay) of a document, and the fields that are
 * locally mutated.
 */
declare class OverlayedDocument {
    readonly overlayedDocument: Document_2;
    /**
     * The fields that are locally mutated by patch mutations.
     *
     * If the overlayed	document is from set or delete mutations, this is `null`.
     * If there is no overlay (mutation) for the document, this is an empty `FieldMask`.
     */
    readonly mutatedFields: FieldMask | null;
    constructor(overlayedDocument: Document_2, 
    /**
     * The fields that are locally mutated by patch mutations.
     *
     * If the overlayed	document is from set or delete mutations, this is `null`.
     * If there is no overlay (mutation) for the document, this is an empty `FieldMask`.
     */
    mutatedFields: FieldMask | null);
}

declare type OverlayedDocumentMap = DocumentKeyMap<OverlayedDocument>;

declare type OverlayMap = DocumentKeyMap<Overlay>;

declare interface ParseContext {
    readonly databaseId: DatabaseId;
    readonly ignoreUndefinedProperties: boolean;
}

/** The result of parsing document data (e.g. for a setData call). */
declare class ParsedSetData {
    readonly data: ObjectValue;
    readonly fieldMask: FieldMask | null;
    readonly fieldTransforms: FieldTransform[];
    constructor(data: ObjectValue, fieldMask: FieldMask | null, fieldTransforms: FieldTransform[]);
    toMutation(key: DocumentKey, precondition: Precondition): Mutation;
}

/** The result of parsing "update" data (i.e. for an updateData call). */
declare class ParsedUpdateData {
    readonly data: ObjectValue;
    readonly fieldMask: FieldMask;
    readonly fieldTransforms: FieldTransform[];
    constructor(data: ObjectValue, fieldMask: FieldMask, fieldTransforms: FieldTransform[]);
    toMutation(key: DocumentKey, precondition: Precondition): Mutation;
}

/**
 * Similar to Typescript's `Partial<T>`, but allows nested fields to be
 * omitted and FieldValues to be passed in as property values.
 */
export declare type PartialWithFieldValue<T> = Partial<T> | (T extends Primitive ? T : T extends {} ? {
    [K in keyof T]?: PartialWithFieldValue<T[K]> | FieldValue;
} : never);

/**
 * Persistence is the lowest-level shared interface to persistent storage in
 * Firestore.
 *
 * Persistence is used to create MutationQueue and RemoteDocumentCache
 * instances backed by persistence (which might be in-memory or LevelDB).
 *
 * Persistence also exposes an API to create and run PersistenceTransactions
 * against persistence. All read / write operations must be wrapped in a
 * transaction. Implementations of PersistenceTransaction / Persistence only
 * need to guarantee that writes made against the transaction are not made to
 * durable storage until the transaction resolves its PersistencePromise.
 * Since memory-only storage components do not alter durable storage, they are
 * free to ignore the transaction.
 *
 * This contract is enough to allow the LocalStore be be written
 * independently of whether or not the stored state actually is durably
 * persisted. If persistent storage is enabled, writes are grouped together to
 * avoid inconsistent state that could cause crashes.
 *
 * Concretely, when persistent storage is enabled, the persistent versions of
 * MutationQueue, RemoteDocumentCache, and others (the mutators) will
 * defer their writes into a transaction. Once the local store has completed
 * one logical operation, it commits the transaction.
 *
 * When persistent storage is disabled, the non-persistent versions of the
 * mutators ignore the transaction. This short-cut is allowed because
 * memory-only storage leaves no state so it cannot be inconsistent.
 *
 * This simplifies the implementations of the mutators and allows memory-only
 * implementations to supplement the persistent ones without requiring any
 * special dual-store implementation of Persistence. The cost is that the
 * LocalStore needs to be slightly careful about the order of its reads and
 * writes in order to avoid relying on being able to read back uncommitted
 * writes.
 */
declare interface Persistence {
    /**
     * Whether or not this persistence instance has been started.
     */
    readonly started: boolean;
    readonly referenceDelegate: ReferenceDelegate;
    /** Starts persistence. */
    start(): Promise<void>;
    /**
     * Releases any resources held during eager shutdown.
     */
    shutdown(): Promise<void>;
    /**
     * Registers a listener that gets called when the database receives a
     * version change event indicating that it has deleted.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */
    setDatabaseDeletedListener(databaseDeletedListener: () => Promise<void>): void;
    /**
     * Adjusts the current network state in the client's metadata, potentially
     * affecting the primary lease.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */
    setNetworkEnabled(networkEnabled: boolean): void;
    /**
     * Returns a MutationQueue representing the persisted mutations for the
     * given user.
     *
     * Note: The implementation is free to return the same instance every time
     * this is called for a given user. In particular, the memory-backed
     * implementation does this to emulate the persisted implementation to the
     * extent possible (e.g. in the case of uid switching from
     * sally=&gt;jack=&gt;sally, sally's mutation queue will be preserved).
     */
    getMutationQueue(user: User, indexManager: IndexManager): MutationQueue;
    /**
     * Returns a TargetCache representing the persisted cache of targets.
     *
     * Note: The implementation is free to return the same instance every time
     * this is called. In particular, the memory-backed implementation does this
     * to emulate the persisted implementation to the extent possible.
     */
    getTargetCache(): TargetCache;
    /**
     * Returns a RemoteDocumentCache representing the persisted cache of remote
     * documents.
     *
     * Note: The implementation is free to return the same instance every time
     * this is called. In particular, the memory-backed implementation does this
     * to emulate the persisted implementation to the extent possible.
     */
    getRemoteDocumentCache(): RemoteDocumentCache;
    /**
     * Returns a BundleCache representing the persisted cache of loaded bundles.
     *
     * Note: The implementation is free to return the same instance every time
     * this is called. In particular, the memory-backed implementation does this
     * to emulate the persisted implementation to the extent possible.
     */
    getBundleCache(): BundleCache;
    /**
     * Returns an IndexManager instance that manages our persisted query indexes.
     *
     * Note: The implementation is free to return the same instance every time
     * this is called. In particular, the memory-backed implementation does this
     * to emulate the persisted implementation to the extent possible.
     */
    getIndexManager(user: User): IndexManager;
    /**
     * Returns a DocumentOverlayCache representing the documents that are mutated
     * locally.
     */
    getDocumentOverlayCache(user: User): DocumentOverlayCache;
    /**
     * Performs an operation inside a persistence transaction. Any reads or writes
     * against persistence must be performed within a transaction. Writes will be
     * committed atomically once the transaction completes.
     *
     * Persistence operations are asynchronous and therefore the provided
     * transactionOperation must return a PersistencePromise. When it is resolved,
     * the transaction will be committed and the Promise returned by this method
     * will resolve.
     *
     * @param action - A description of the action performed by this transaction,
     * used for logging.
     * @param mode - The underlying mode of the IndexedDb transaction. Can be
     * 'readonly', 'readwrite' or 'readwrite-primary'. Transactions marked
     * 'readwrite-primary' can only be executed by the primary client. In this
     * mode, the transactionOperation will not be run if the primary lease cannot
     * be acquired and the returned promise will be rejected with a
     * FAILED_PRECONDITION error.
     * @param transactionOperation - The operation to run inside a transaction.
     * @returns A `Promise` that is resolved once the transaction completes.
     */
    runTransaction<T>(action: string, mode: PersistenceTransactionMode, transactionOperation: (transaction: PersistenceTransaction) => PersistencePromise<T>): Promise<T>;
}

/**
 * PersistencePromise is essentially a re-implementation of Promise except
 * it has a .next() method instead of .then() and .next() and .catch() callbacks
 * are executed synchronously when a PersistencePromise resolves rather than
 * asynchronously (Promise implementations use setImmediate() or similar).
 *
 * This is necessary to interoperate with IndexedDB which will automatically
 * commit transactions if control is returned to the event loop without
 * synchronously initiating another operation on the transaction.
 *
 * NOTE: .then() and .catch() only allow a single consumer, unlike normal
 * Promises.
 */
declare class PersistencePromise<T> {
    private nextCallback;
    private catchCallback;
    private result;
    private error;
    private isDone;
    private callbackAttached;
    constructor(callback: (resolve: Resolver<T>, reject: Rejector) => void);
    catch<R>(fn: (error: Error) => R | PersistencePromise<R>): PersistencePromise<R>;
    next<R>(nextFn?: FulfilledHandler<T, R>, catchFn?: RejectedHandler<R>): PersistencePromise<R>;
    toPromise(): Promise<T>;
    private wrapUserFunction;
    private wrapSuccess;
    private wrapFailure;
    static resolve(): PersistencePromise<void>;
    static resolve<R>(result: R): PersistencePromise<R>;
    static reject<R>(error: Error): PersistencePromise<R>;
    static waitFor(all: {
        forEach: (cb: (el: PersistencePromise<any>) => void) => void;
    }): PersistencePromise<void>;
    /**
     * Given an array of predicate functions that asynchronously evaluate to a
     * boolean, implements a short-circuiting `or` between the results. Predicates
     * will be evaluated until one of them returns `true`, then stop. The final
     * result will be whether any of them returned `true`.
     */
    static or(predicates: Array<() => PersistencePromise<boolean>>): PersistencePromise<boolean>;
    /**
     * Given an iterable, call the given function on each element in the
     * collection and wait for all of the resulting concurrent PersistencePromises
     * to resolve.
     */
    static forEach<R, S>(collection: {
        forEach: (cb: (r: R, s: S) => void) => void;
    }, f: ((r: R, s: S) => PersistencePromise<void>) | ((r: R) => PersistencePromise<void>)): PersistencePromise<void>;
    static forEach<R>(collection: {
        forEach: (cb: (r: R) => void) => void;
    }, f: (r: R) => PersistencePromise<void>): PersistencePromise<void>;
    /**
     * Concurrently map all array elements through asynchronous function.
     */
    static mapArray<T, U>(array: T[], f: (t: T) => PersistencePromise<U>): PersistencePromise<U[]>;
    /**
     * An alternative to recursive PersistencePromise calls, that avoids
     * potential memory problems from unbounded chains of promises.
     *
     * The `action` will be called repeatedly while `condition` is true.
     */
    static doWhile(condition: () => boolean, action: () => PersistencePromise<void>): PersistencePromise<void>;
}

/**
 * A base class representing a persistence transaction, encapsulating both the
 * transaction's sequence numbers as well as a list of onCommitted listeners.
 *
 * When you call Persistence.runTransaction(), it will create a transaction and
 * pass it to your callback. You then pass it to any method that operates
 * on persistence.
 */
declare abstract class PersistenceTransaction {
    private readonly onCommittedListeners;
    abstract readonly currentSequenceNumber: ListenSequenceNumber;
    addOnCommittedListener(listener: () => void): void;
    raiseOnCommittedEvent(): void;
}

/** The different modes supported by `Persistence.runTransaction()`. */
declare type PersistenceTransactionMode = 'readonly' | 'readwrite' | 'readwrite-primary';

/**
 * Provides a persistent cache backed by IndexedDb to the SDK.
 *
 * To use, create an instance using the factory function {@link persistentLocalCache()}, then
 * set the instance to `FirestoreSettings.cache` and call `initializeFirestore` using
 * the settings object.
 */
declare type PersistentLocalCache = {
    kind: 'persistent';
    /* Excluded from this release type: _onlineComponentProvider */
    /* Excluded from this release type: _offlineComponentProvider */
};

/**
 * Encodes a precondition for a mutation. This follows the model that the
 * backend accepts with the special case of an explicit "empty" precondition
 * (meaning no precondition).
 */
declare class Precondition {
    readonly updateTime?: SnapshotVersion | undefined;
    readonly exists?: boolean | undefined;
    private constructor();
    /** Creates a new empty Precondition. */
    static none(): Precondition;
    /** Creates a new Precondition with an exists flag. */
    static exists(exists: boolean): Precondition;
    /** Creates a new Precondition based on a version a document exists at. */
    static updateTime(version: SnapshotVersion): Precondition;
    /** Returns whether this Precondition is empty. */
    get isNone(): boolean;
    isEqual(other: Precondition): boolean;
}

/**
 * These types primarily exist to support the `UpdateData`,
 * `WithFieldValue`, and `PartialWithFieldValue` types and are not consumed
 * directly by the end developer.
 */
/** Primitive types. */
export declare type Primitive = string | number | boolean | undefined | null;

/* Excluded from this release type: PrivateSettings */

declare interface ProviderCredentialsSettings {
    ['type']: 'provider';
    ['client']: CredentialsProvider<User>;
}

/**
 * A `Query` refers to a query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 */
export declare class Query<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    readonly converter: FirestoreDataConverter<AppModelType, DbModelType> | null;
    readonly _query: Query_2;
    /** The type of this Firestore reference. */
    readonly type: 'query' | 'collection';
    /**
     * The `Firestore` instance for the Firestore database (useful for performing
     * transactions, etc.).
     */
    readonly firestore: Firestore;
    /** @hideconstructor protected */
    constructor(firestore: Firestore, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    converter: FirestoreDataConverter<AppModelType, DbModelType> | null, _query: Query_2);
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
 * The Query interface defines all external properties of a query.
 *
 * QueryImpl implements this interface to provide memoization for `queryNormalizedOrderBy`
 * and `queryToTarget`.
 */
declare interface Query_2 {
    readonly path: ResourcePath;
    readonly collectionGroup: string | null;
    readonly explicitOrderBy: OrderBy[];
    readonly filters: Filter[];
    readonly limit: number | null;
    readonly limitType: LimitType;
    readonly startAt: Bound | null;
    readonly endAt: Bound | null;
}

/**
 * A `QueryCompositeFilterConstraint` is used to narrow the set of documents
 * returned by a Firestore query by performing the logical OR or AND of multiple
 * {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
 * `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
 * {@link and} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains the `QueryCompositeFilterConstraint`.
 */
export declare class QueryCompositeFilterConstraint extends AppliableConstraint {
    /** The type of this query constraint */
    readonly type: 'or' | 'and';
    private readonly _queryConstraints;
    /* Excluded from this release type: __constructor */
    static _create(type: 'or' | 'and', _queryConstraints: QueryFilterConstraint[]): QueryCompositeFilterConstraint;
    _parse<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Filter;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
    _getQueryConstraints(): readonly AppliableConstraint[];
    _getOperator(): CompositeOperator;
}

/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */
export declare abstract class QueryConstraint extends AppliableConstraint {
    /** The type of this query constraint */
    abstract readonly type: QueryConstraintType;
    /**
     * Takes the provided {@link Query} and returns a copy of the {@link Query} with this
     * {@link AppliableConstraint} applied.
     */
    abstract _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}

/** Describes the different query constraints available in this SDK. */
export declare type QueryConstraintType = 'where' | 'orderBy' | 'limit' | 'limitToLast' | 'startAt' | 'startAfter' | 'endAt' | 'endBefore';

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
 * A tracker to keep a record of important details during database local query
 * execution.
 */
declare class QueryContext {
    /**
     * Counts the number of documents passed through during local query execution.
     */
    private _documentReadCount;
    get documentReadCount(): number;
    incrementDocumentReadCount(amount: number): void;
}

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
     * @override
     * @returns An `Object` containing all fields in the document.
     */
    data(): AppModelType;
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
    private readonly _docOrFields;
    private readonly _inclusive;
    /* Excluded from this release type: __constructor */
    static _create(type: 'endBefore' | 'endAt', _docOrFields: Array<unknown | DocumentSnapshot<unknown>>, _inclusive: boolean): QueryEndAtConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
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
    private readonly _field;
    private _op;
    private _value;
    /** The type of this query constraint */
    readonly type = "where";
    /* Excluded from this release type: __constructor */
    static _create(_field: FieldPath_2, _op: Operator, _value: unknown): QueryFieldFilterConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
    _parse<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): FieldFilter;
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
    private readonly _limit;
    private readonly _limitType;
    /* Excluded from this release type: __constructor */
    static _create(type: 'limit' | 'limitToLast', _limit: number, _limitType: LimitType): QueryLimitConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
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
    private readonly _field;
    private _direction;
    /** The type of this query constraint */
    readonly type = "orderBy";
    /* Excluded from this release type: __constructor */
    static _create(_field: FieldPath_2, _direction: Direction): QueryOrderByConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}

/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
export declare class QuerySnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    readonly _docs: Array<QueryDocumentSnapshot<AppModelType, DbModelType>>;
    /**
     * The query on which you called {@link getDocs} in order to get this
     * `QuerySnapshot`.
     */
    readonly query: Query<AppModelType, DbModelType>;
    /** @hideconstructor */
    constructor(_query: Query<AppModelType, DbModelType>, _docs: Array<QueryDocumentSnapshot<AppModelType, DbModelType>>);
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
    private readonly _docOrFields;
    private readonly _inclusive;
    /* Excluded from this release type: __constructor */
    static _create(type: 'startAt' | 'startAfter', _docOrFields: Array<unknown | DocumentSnapshot<unknown>>, _inclusive: boolean): QueryStartAtConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}

/** The different states of a watch target. */
declare type QueryTargetState = 'not-current' | 'current' | 'rejected';

/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
export declare function refEqual<AppModelType, DbModelType extends DocumentData>(left: DocumentReference<AppModelType, DbModelType> | CollectionReference<AppModelType, DbModelType>, right: DocumentReference<AppModelType, DbModelType> | CollectionReference<AppModelType, DbModelType>): boolean;

/**
 * A ReferenceDelegate instance handles all of the hooks into the document-reference lifecycle. This
 * includes being added to a target, being removed from a target, being subject to mutation, and
 * being mutated by the user.
 *
 * Different implementations may do different things with each of these events. Not every
 * implementation needs to do something with every lifecycle hook.
 *
 * PORTING NOTE: since sequence numbers are attached to transactions in this
 * client, the ReferenceDelegate does not need to deal in transactional
 * semantics (onTransactionStarted/Committed()), nor does it need to track and
 * generate sequence numbers (getCurrentSequenceNumber()).
 */
declare interface ReferenceDelegate {
    /** Notify the delegate that the given document was added to a target. */
    addReference(txn: PersistenceTransaction, targetId: TargetId, doc: DocumentKey): PersistencePromise<void>;
    /** Notify the delegate that the given document was removed from a target. */
    removeReference(txn: PersistenceTransaction, targetId: TargetId, doc: DocumentKey): PersistencePromise<void>;
    /**
     * Notify the delegate that a target was removed. The delegate may, but is not obligated to,
     * actually delete the target and associated data.
     */
    removeTarget(txn: PersistenceTransaction, targetData: TargetData): PersistencePromise<void>;
    /**
     * Notify the delegate that a document may no longer be part of any views or
     * have any mutations associated.
     */
    markPotentiallyOrphaned(txn: PersistenceTransaction, doc: DocumentKey): PersistencePromise<void>;
    /** Notify the delegate that a limbo document was updated. */
    updateLimboDocument(txn: PersistenceTransaction, doc: DocumentKey): PersistencePromise<void>;
}

declare type RejectedHandler<R> = ((reason: Error) => R | PersistencePromise<R>) | null;

declare type Rejector = (error: Error) => void;

/**
 * Represents cached documents received from the remote backend.
 *
 * The cache is keyed by DocumentKey and entries in the cache are
 * MutableDocuments, meaning we can cache both actual documents as well as
 * documents that are known to not exist.
 */
declare interface RemoteDocumentCache {
    /** Sets the index manager to use for managing the collectionGroup index. */
    setIndexManager(indexManager: IndexManager): void;
    /**
     * Looks up an entry in the cache.
     *
     * @param documentKey - The key of the entry to look up.*
     * @returns The cached document entry. Returns an invalid document if the
     * document is not cached.
     */
    getEntry(transaction: PersistenceTransaction, documentKey: DocumentKey): PersistencePromise<MutableDocument>;
    /**
     * Looks up a set of entries in the cache.
     *
     * @param documentKeys - The keys of the entries to look up.
     * @returns The cached document entries indexed by key. If an entry is not
     * cached, the corresponding key will be mapped to an invalid document.
     */
    getEntries(transaction: PersistenceTransaction, documentKeys: DocumentKeySet): PersistencePromise<MutableDocumentMap>;
    /**
     * Returns the documents matching the given query
     *
     * @param query - The query to match documents against.
     * @param offset - The offset to start the scan at (exclusive).
     * @param context - A optional tracker to keep a record of important details
     *   during database local query execution.
     * @returns The set of matching documents.
     */
    getDocumentsMatchingQuery(transaction: PersistenceTransaction, query: Query_2, offset: IndexOffset, mutatedDocs: OverlayMap, context?: QueryContext): PersistencePromise<MutableDocumentMap>;
    /**
     * Looks up the next `limit` documents for a collection group based on the
     * provided offset. The ordering is based on the document's read time and key.
     *
     * @param collectionGroup - The collection group to scan.
     * @param offset - The offset to start the scan at (exclusive).
     * @param limit - The maximum number of results to return.
     * @returns The set of matching documents.
     */
    getAllFromCollectionGroup(transaction: PersistenceTransaction, collectionGroup: string, offset: IndexOffset, limit: number): PersistencePromise<MutableDocumentMap>;
    /**
     * Provides access to add or update the contents of the cache. The buffer
     * handles proper size accounting for the change.
     *
     * Multi-Tab Note: This should only be called by the primary client.
     *
     * @param options - Specify `trackRemovals` to create sentinel entries for
     * removed documents, which allows removals to be tracked by
     * `getNewDocumentChanges()`.
     */
    newChangeBuffer(options?: {
        trackRemovals: boolean;
    }): RemoteDocumentChangeBuffer;
    /**
     * Get an estimate of the size of the document cache. Note that for eager
     * garbage collection, we don't track sizes so this will return 0.
     */
    getSize(transaction: PersistenceTransaction): PersistencePromise<number>;
}

/**
 * An in-memory buffer of entries to be written to a RemoteDocumentCache.
 * It can be used to batch up a set of changes to be written to the cache, but
 * additionally supports reading entries back with the `getEntry()` method,
 * falling back to the underlying RemoteDocumentCache if no entry is
 * buffered.
 *
 * Entries added to the cache *must* be read first. This is to facilitate
 * calculating the size delta of the pending changes.
 *
 * PORTING NOTE: This class was implemented then removed from other platforms.
 * If byte-counting ends up being needed on the other platforms, consider
 * porting this class as part of that implementation work.
 */
declare abstract class RemoteDocumentChangeBuffer {
    protected changes: ObjectMap<DocumentKey, MutableDocument>;
    private changesApplied;
    protected abstract getFromCache(transaction: PersistenceTransaction, documentKey: DocumentKey): PersistencePromise<MutableDocument>;
    protected abstract getAllFromCache(transaction: PersistenceTransaction, documentKeys: DocumentKeySet): PersistencePromise<MutableDocumentMap>;
    protected abstract applyChanges(transaction: PersistenceTransaction): PersistencePromise<void>;
    /**
     * Buffers a `RemoteDocumentCache.addEntry()` call.
     *
     * You can only modify documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */
    addEntry(document: MutableDocument): void;
    /**
     * Buffers a `RemoteDocumentCache.removeEntry()` call.
     *
     * You can only remove documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */
    removeEntry(key: DocumentKey, readTime: SnapshotVersion): void;
    /**
     * Looks up an entry in the cache. The buffered changes will first be checked,
     * and if no buffered change applies, this will forward to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKey - The key of the entry to look up.
     * @returns The cached document or an invalid document if we have nothing
     * cached.
     */
    getEntry(transaction: PersistenceTransaction, documentKey: DocumentKey): PersistencePromise<MutableDocument>;
    /**
     * Looks up several entries in the cache, forwarding to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKeys - The keys of the entries to look up.
     * @returns A map of cached documents, indexed by key. If an entry cannot be
     *     found, the corresponding key will be mapped to an invalid document.
     */
    getEntries(transaction: PersistenceTransaction, documentKeys: DocumentKeySet): PersistencePromise<MutableDocumentMap>;
    /**
     * Applies buffered changes to the underlying RemoteDocumentCache, using
     * the provided transaction.
     */
    apply(transaction: PersistenceTransaction): PersistencePromise<void>;
    /** Helper to assert this.changes is not null  */
    protected assertNotApplied(): void;
}

/**
 * An event from the RemoteStore. It is split into targetChanges (changes to the
 * state or the set of documents in our watched targets) and documentUpdates
 * (changes to the actual documents).
 */
declare class RemoteEvent {
    /**
     * The snapshot version this event brings us up to, or MIN if not set.
     */
    readonly snapshotVersion: SnapshotVersion;
    /**
     * A map from target to changes to the target. See TargetChange.
     */
    readonly targetChanges: Map<TargetId, TargetChange>;
    /**
     * A map of targets that is known to be inconsistent, and the purpose for
     * re-listening. Listens for these targets should be re-established without
     * resume tokens.
     */
    readonly targetMismatches: SortedMap<TargetId, TargetPurpose>;
    /**
     * A set of which documents have changed or been deleted, along with the
     * doc's new values (if not deleted).
     */
    readonly documentUpdates: MutableDocumentMap;
    /**
     * A set of which document updates are due only to limbo resolution targets.
     */
    readonly resolvedLimboDocuments: DocumentKeySet;
    constructor(
    /**
     * The snapshot version this event brings us up to, or MIN if not set.
     */
    snapshotVersion: SnapshotVersion, 
    /**
     * A map from target to changes to the target. See TargetChange.
     */
    targetChanges: Map<TargetId, TargetChange>, 
    /**
     * A map of targets that is known to be inconsistent, and the purpose for
     * re-listening. Listens for these targets should be re-established without
     * resume tokens.
     */
    targetMismatches: SortedMap<TargetId, TargetPurpose>, 
    /**
     * A set of which documents have changed or been deleted, along with the
     * doc's new values (if not deleted).
     */
    documentUpdates: MutableDocumentMap, 
    /**
     * A set of which document updates are due only to limbo resolution targets.
     */
    resolvedLimboDocuments: DocumentKeySet);
    /**
     * HACK: Views require RemoteEvents in order to determine whether the view is
     * CURRENT, but secondary tabs don't receive remote events. So this method is
     * used to create a synthesized RemoteEvent that can be used to apply a
     * CURRENT status change to a View, for queries executed in a different tab.
     */
    static createSynthesizedRemoteEventForCurrentChange(targetId: TargetId, current: boolean, resumeToken: ByteString): RemoteEvent;
}

/**
 * RemoteStore - An interface to remotely stored data, basically providing a
 * wrapper around the Datastore that is more reliable for the rest of the
 * system.
 *
 * RemoteStore is responsible for maintaining the connection to the server.
 * - maintaining a list of active listens.
 * - reconnecting when the connection is dropped.
 * - resuming all the active listens on reconnect.
 *
 * RemoteStore handles all incoming events from the Datastore.
 * - listening to the watch stream and repackaging the events as RemoteEvents
 * - notifying SyncEngine of any changes to the active listens.
 *
 * RemoteStore takes writes from other components and handles them reliably.
 * - pulling pending mutations from LocalStore and sending them to Datastore.
 * - retrying mutations that failed because of network problems.
 * - acking mutations to the SyncEngine once they are accepted or rejected.
 */
declare interface RemoteStore {
    /**
     * SyncEngine to notify of watch and write events. This must be set
     * immediately after construction.
     */
    remoteSyncer: RemoteSyncer;
}

/**
 * An interface that describes the actions the RemoteStore needs to perform on
 * a cooperating synchronization engine.
 */
declare interface RemoteSyncer {
    /**
     * Applies one remote event to the sync engine, notifying any views of the
     * changes, and releasing any pending mutation batches that would become
     * visible because of the snapshot version the remote event contains.
     */
    applyRemoteEvent?(remoteEvent: RemoteEvent): Promise<void>;
    /**
     * Rejects the listen for the given targetID. This can be triggered by the
     * backend for any active target.
     *
     * @param targetId - The targetID corresponds to one previously initiated by
     * the user as part of TargetData passed to listen() on RemoteStore.
     * @param error - A description of the condition that has forced the rejection.
     * Nearly always this will be an indication that the user is no longer
     * authorized to see the data matching the target.
     */
    rejectListen?(targetId: TargetId, error: FirestoreError): Promise<void>;
    /**
     * Applies the result of a successful write of a mutation batch to the sync
     * engine, emitting snapshots in any views that the mutation applies to, and
     * removing the batch from the mutation queue.
     */
    applySuccessfulWrite?(result: MutationBatchResult): Promise<void>;
    /**
     * Rejects the batch, removing the batch from the mutation queue, recomputing
     * the local view of any documents affected by the batch and then, emitting
     * snapshots with the reverted value.
     */
    rejectFailedWrite?(batchId: BatchId, error: FirestoreError): Promise<void>;
    /**
     * Returns the set of remote document keys for the given target ID. This list
     * includes the documents that were assigned to the target when we received
     * the last snapshot.
     */
    getRemoteKeysForTarget?(targetId: TargetId): DocumentKeySet;
    /**
     * Updates all local state to match the pending mutations for the given user.
     * May be called repeatedly for the same user.
     */
    handleCredentialChange?(user: User): Promise<void>;
}

declare type Resolver<T> = (value?: T) => void;

/* Excluded from this release type: ResourcePath */

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
 * Interface to schedule periodic tasks within SDK.
 */
declare interface Scheduler {
    readonly started: boolean;
    start(): void;
    stop(): void;
}

/** Base interface for the Serializer implementation. */
declare interface Serializer {
    readonly useProto3Json: boolean;
}

/**
 * Returns a sentinel used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link @firebase/firestore/lite#(updateDoc:1)} to
 * include a server-generated timestamp in the written data.
 */
export declare function serverTimestamp(): FieldValue;

declare type ServerTimestampBehavior = 'estimate' | 'previous' | 'none';

/**
 * Writes to the document referred to by the specified `DocumentReference`. If
 * the document does not yet exist, it will be created.
 *
 * The result of this write will only be reflected in document reads that occur
 * after the returned promise resolves. If the client is offline, the
 * write fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @throws Error - If the provided input is not a valid Firestore document.
 * @returns A `Promise` resolved once the data has been successfully written
 * to the backend.
 */
export declare function setDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): Promise<void>;

/**
 * Writes to the document referred to by the specified `DocumentReference`. If
 * the document does not yet exist, it will be created. If you provide `merge`
 * or `mergeFields`, the provided data can be merged into an existing document.
 *
 * The result of this write will only be reflected in document reads that occur
 * after the returned promise resolves. If the client is offline, the
 * write fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @param options - An object to configure the set behavior.
 * @throws Error - If the provided input is not a valid Firestore document.
 * @returns A `Promise` resolved once the data has been successfully written
 * to the backend.
 */
export declare function setDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: PartialWithFieldValue<AppModelType>, options: SetOptions): Promise<void>;

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
 * Specifies custom configurations for your Cloud Firestore instance.
 * You must set these before invoking any other methods.
 */
export declare interface Settings {
    /** The hostname to connect to. */
    host?: string;
    /** Whether to use SSL when connecting. */
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
 * A `SharedClientState` keeps track of the global state of the mutations
 * and query targets for all active clients with the same persistence key (i.e.
 * project ID and FirebaseApp name). It relays local changes to other clients
 * and updates its local state as new state is observed.
 *
 * `SharedClientState` is primarily used for synchronization in Multi-Tab
 * environments. Each tab is responsible for registering its active query
 * targets and mutations. `SharedClientState` will then notify the listener
 * assigned to `.syncEngine` for updates to mutations and queries that
 * originated in other clients.
 *
 * To receive notifications, `.syncEngine` and `.onlineStateHandler` has to be
 * assigned before calling `start()`.
 */
declare interface SharedClientState {
    onlineStateHandler: ((onlineState: OnlineState) => void) | null;
    sequenceNumberHandler: ((sequenceNumber: ListenSequenceNumber) => void) | null;
    /** Registers the Mutation Batch ID of a newly pending mutation. */
    addPendingMutation(batchId: BatchId): void;
    /**
     * Records that a pending mutation has been acknowledged or rejected.
     * Called by the primary client to notify secondary clients of mutation
     * results as they come back from the backend.
     */
    updateMutationState(batchId: BatchId, state: 'acknowledged' | 'rejected', error?: FirestoreError): void;
    /**
     * Associates a new Query Target ID with the local Firestore client. Returns
     * the new query state for the query (which can be 'current' if the query is
     * already associated with another tab).
     *
     * If the target id is already associated with local client, the method simply
     * returns its `QueryTargetState`.
     */
    addLocalQueryTarget(targetId: TargetId): QueryTargetState;
    /** Removes the Query Target ID association from the local client. */
    removeLocalQueryTarget(targetId: TargetId): void;
    /** Checks whether the target is associated with the local client. */
    isLocalQueryTarget(targetId: TargetId): boolean;
    /**
     * Processes an update to a query target.
     *
     * Called by the primary client to notify secondary clients of document
     * changes or state transitions that affect the provided query target.
     */
    updateQueryState(targetId: TargetId, state: QueryTargetState, error?: FirestoreError): void;
    /**
     * Removes the target's metadata entry.
     *
     * Called by the primary client when all clients stopped listening to a query
     * target.
     */
    clearQueryState(targetId: TargetId): void;
    /**
     * Gets the active Query Targets IDs for all active clients.
     *
     * The implementation for this may require O(n) runtime, where 'n' is the size
     * of the result set.
     */
    getAllActiveQueryTargets(): SortedSet<TargetId>;
    /**
     * Checks whether the provided target ID is currently being listened to by
     * any of the active clients.
     *
     * The implementation may require O(n*log m) runtime, where 'n' is the number
     * of clients and 'm' the number of targets.
     */
    isActiveQueryTarget(targetId: TargetId): boolean;
    /**
     * Starts the SharedClientState, reads existing client data and registers
     * listeners for updates to new and existing clients.
     */
    start(): Promise<void>;
    /** Shuts down the `SharedClientState` and its listeners. */
    shutdown(): void;
    /**
     * Changes the active user and removes all existing user-specific data. The
     * user change does not call back into SyncEngine (for example, no mutations
     * will be marked as removed).
     */
    handleUserChange(user: User, removedBatchIds: BatchId[], addedBatchIds: BatchId[]): void;
    /** Changes the shared online state of all clients. */
    setOnlineState(onlineState: OnlineState): void;
    writeSequenceNumber(sequenceNumber: ListenSequenceNumber): void;
    /**
     * Notifies other clients when remote documents have changed due to loading
     * a bundle.
     *
     * @param collectionGroups The collection groups affected by this bundle.
     */
    notifyBundleLoaded(collectionGroups: Set<string>): void;
}

/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
export declare function snapshotEqual<AppModelType, DbModelType extends DocumentData>(left: DocumentSnapshot<AppModelType, DbModelType> | QuerySnapshot<AppModelType, DbModelType>, right: DocumentSnapshot<AppModelType, DbModelType> | QuerySnapshot<AppModelType, DbModelType>): boolean;

/**
 * A version of a document in Firestore. This corresponds to the version
 * timestamp, such as update_time or read_time.
 */
declare class SnapshotVersion {
    private timestamp;
    static fromTimestamp(value: Timestamp): SnapshotVersion;
    static min(): SnapshotVersion;
    static max(): SnapshotVersion;
    private constructor();
    compareTo(other: SnapshotVersion): number;
    isEqual(other: SnapshotVersion): boolean;
    /** Returns a number representation of the version for use in spec tests. */
    toMicroseconds(): number;
    toString(): string;
    toTimestamp(): Timestamp;
}

declare class SortedMap<K, V> {
    comparator: Comparator<K>;
    root: LLRBNode<K, V> | LLRBEmptyNode<K, V>;
    constructor(comparator: Comparator<K>, root?: LLRBNode<K, V> | LLRBEmptyNode<K, V>);
    insert(key: K, value: V): SortedMap<K, V>;
    remove(key: K): SortedMap<K, V>;
    get(key: K): V | null;
    indexOf(key: K): number;
    isEmpty(): boolean;
    get size(): number;
    minKey(): K | null;
    maxKey(): K | null;
    inorderTraversal<T>(action: (k: K, v: V) => T): T;
    forEach(fn: (k: K, v: V) => void): void;
    toString(): string;
    reverseTraversal<T>(action: (k: K, v: V) => T): T;
    getIterator(): SortedMapIterator<K, V>;
    getIteratorFrom(key: K): SortedMapIterator<K, V>;
    getReverseIterator(): SortedMapIterator<K, V>;
    getReverseIteratorFrom(key: K): SortedMapIterator<K, V>;
}

declare class SortedMapIterator<K, V> {
    private isReverse;
    private nodeStack;
    constructor(node: LLRBNode<K, V> | LLRBEmptyNode<K, V>, startKey: K | null, comparator: Comparator<K>, isReverse: boolean);
    getNext(): Entry<K, V>;
    hasNext(): boolean;
    peek(): Entry<K, V> | null;
}

/**
 * SortedSet is an immutable (copy-on-write) collection that holds elements
 * in order specified by the provided comparator.
 *
 * NOTE: if provided comparator returns 0 for two elements, we consider them to
 * be equal!
 */
declare class SortedSet<T> {
    private comparator;
    private data;
    constructor(comparator: (left: T, right: T) => number);
    has(elem: T): boolean;
    first(): T | null;
    last(): T | null;
    get size(): number;
    indexOf(elem: T): number;
    /** Iterates elements in order defined by "comparator" */
    forEach(cb: (elem: T) => void): void;
    /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
    forEachInRange(range: [T, T], cb: (elem: T) => void): void;
    /**
     * Iterates over `elem`s such that: start &lt;= elem until false is returned.
     */
    forEachWhile(cb: (elem: T) => boolean, start?: T): void;
    /** Finds the least element greater than or equal to `elem`. */
    firstAfterOrEqual(elem: T): T | null;
    getIterator(): SortedSetIterator<T>;
    getIteratorFrom(key: T): SortedSetIterator<T>;
    /** Inserts or updates an element */
    add(elem: T): SortedSet<T>;
    /** Deletes an element */
    delete(elem: T): SortedSet<T>;
    isEmpty(): boolean;
    unionWith(other: SortedSet<T>): SortedSet<T>;
    isEqual(other: SortedSet<T>): boolean;
    toArray(): T[];
    toString(): string;
    private copy;
}

declare class SortedSetIterator<T> {
    private iter;
    constructor(iter: SortedMapIterator<T, boolean>);
    getNext(): T;
    hasNext(): boolean;
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

declare type StructuredQuery = firestoreV1ApiClientInterfaces.StructuredQuery;

/**
 * Create an AggregateField object that can be used to compute the sum of
 * a specified field over a range of documents in the result set of a query.
 * @param field Specifies the field to sum across the result set.
 */
export declare function sum(field: string | FieldPath): AggregateField<number>;

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
 * SyncEngine is the central controller in the client SDK architecture. It is
 * the glue code between the EventManager, LocalStore, and RemoteStore. Some of
 * SyncEngine's responsibilities include:
 * 1. Coordinating client requests and remote events between the EventManager
 *    and the local and remote data stores.
 * 2. Managing a View object for each query, providing the unified view between
 *    the local and remote data stores.
 * 3. Notifying the RemoteStore when the LocalStore has new mutations in its
 *    queue that need sending to the backend.
 *
 * The SyncEngine’s methods should only ever be called by methods running in the
 * global async queue.
 *
 * PORTING NOTE: On Web, SyncEngine does not have an explicit subscribe()
 * function. Instead, it directly depends on EventManager's tree-shakeable API
 * (via `ensureWatchStream()`).
 */
declare interface SyncEngine {
    isPrimaryClient: boolean;
}

/**
 * A Target represents the WatchTarget representation of a Query, which is used
 * by the LocalStore and the RemoteStore to keep track of and to execute
 * backend queries. While a Query can represent multiple Targets, each Targets
 * maps to a single WatchTarget in RemoteStore and a single TargetData entry
 * in persistence.
 */
declare interface Target {
    readonly path: ResourcePath;
    readonly collectionGroup: string | null;
    readonly orderBy: OrderBy[];
    readonly filters: Filter[];
    readonly limit: number | null;
    readonly startAt: Bound | null;
    readonly endAt: Bound | null;
}

/**
 * Represents cached targets received from the remote backend.
 *
 * The cache is keyed by `Target` and entries in the cache are `TargetData`
 * instances.
 */
declare interface TargetCache {
    /**
     * A global snapshot version representing the last consistent snapshot we
     * received from the backend. This is monotonically increasing and any
     * snapshots received from the backend prior to this version (e.g. for targets
     * resumed with a resume_token) should be suppressed (buffered) until the
     * backend has caught up to this snapshot version again. This prevents our
     * cache from ever going backwards in time.
     *
     * This is updated whenever our we get a TargetChange with a read_time and
     * empty target_ids.
     */
    getLastRemoteSnapshotVersion(transaction: PersistenceTransaction): PersistencePromise<SnapshotVersion>;
    /**
     * @returns The highest sequence number observed, including any that might be
     *         persisted on-disk.
     */
    getHighestSequenceNumber(transaction: PersistenceTransaction): PersistencePromise<ListenSequenceNumber>;
    /**
     * Call provided function with each `TargetData` that we have cached.
     */
    forEachTarget(txn: PersistenceTransaction, f: (q: TargetData) => void): PersistencePromise<void>;
    /**
     * Set the highest listen sequence number and optionally updates the
     * snapshot version of the last consistent snapshot received from the backend
     * (see getLastRemoteSnapshotVersion() for more details).
     *
     * @param highestListenSequenceNumber - The new maximum listen sequence number.
     * @param lastRemoteSnapshotVersion - The new snapshot version. Optional.
     */
    setTargetsMetadata(transaction: PersistenceTransaction, highestListenSequenceNumber: number, lastRemoteSnapshotVersion?: SnapshotVersion): PersistencePromise<void>;
    /**
     * Adds an entry in the cache.
     *
     * The cache key is extracted from `targetData.target`. The key must not already
     * exist in the cache.
     *
     * @param targetData - A TargetData instance to put in the cache.
     */
    addTargetData(transaction: PersistenceTransaction, targetData: TargetData): PersistencePromise<void>;
    /**
     * Updates an entry in the cache.
     *
     * The cache key is extracted from `targetData.target`. The entry must already
     * exist in the cache, and it will be replaced.
     * @param targetData - The TargetData to be replaced into the cache.
     */
    updateTargetData(transaction: PersistenceTransaction, targetData: TargetData): PersistencePromise<void>;
    /**
     * Removes the cached entry for the given target data. It is an error to remove
     * a target data that does not exist.
     *
     * Multi-Tab Note: This operation should only be called by the primary client.
     */
    removeTargetData(transaction: PersistenceTransaction, targetData: TargetData): PersistencePromise<void>;
    /**
     * The number of targets currently in the cache.
     */
    getTargetCount(transaction: PersistenceTransaction): PersistencePromise<number>;
    /**
     * Looks up a TargetData entry by target.
     *
     * @param target - The query target corresponding to the entry to look up.
     * @returns The cached TargetData entry, or null if the cache has no entry for
     * the target.
     */
    getTargetData(transaction: PersistenceTransaction, target: Target): PersistencePromise<TargetData | null>;
    /**
     * Adds the given document keys to cached query results of the given target
     * ID.
     *
     * Multi-Tab Note: This operation should only be called by the primary client.
     */
    addMatchingKeys(transaction: PersistenceTransaction, keys: DocumentKeySet, targetId: TargetId): PersistencePromise<void>;
    /**
     * Removes the given document keys from the cached query results of the
     * given target ID.
     *
     * Multi-Tab Note: This operation should only be called by the primary client.
     */
    removeMatchingKeys(transaction: PersistenceTransaction, keys: DocumentKeySet, targetId: TargetId): PersistencePromise<void>;
    /**
     * Removes all the keys in the query results of the given target ID.
     *
     * Multi-Tab Note: This operation should only be called by the primary client.
     */
    removeMatchingKeysForTargetId(transaction: PersistenceTransaction, targetId: TargetId): PersistencePromise<void>;
    /**
     * Returns the document keys that match the provided target ID.
     */
    getMatchingKeysForTargetId(transaction: PersistenceTransaction, targetId: TargetId): PersistencePromise<DocumentKeySet>;
    /**
     * Returns a new target ID that is higher than any query in the cache. If
     * there are no queries in the cache, returns the first valid target ID.
     * Allocated target IDs are persisted and `allocateTargetId()` will never
     * return the same ID twice.
     */
    allocateTargetId(transaction: PersistenceTransaction): PersistencePromise<TargetId>;
    containsKey(transaction: PersistenceTransaction, key: DocumentKey): PersistencePromise<boolean>;
}

/**
 * A TargetChange specifies the set of changes for a specific target as part of
 * a RemoteEvent. These changes track which documents are added, modified or
 * removed, as well as the target's resume token and whether the target is
 * marked CURRENT.
 * The actual changes *to* documents are not part of the TargetChange since
 * documents may be part of multiple targets.
 */
declare class TargetChange {
    /**
     * An opaque, server-assigned token that allows watching a query to be resumed
     * after disconnecting without retransmitting all the data that matches the
     * query. The resume token essentially identifies a point in time from which
     * the server should resume sending results.
     */
    readonly resumeToken: ByteString;
    /**
     * The "current" (synced) status of this target. Note that "current"
     * has special meaning in the RPC protocol that implies that a target is
     * both up-to-date and consistent with the rest of the watch stream.
     */
    readonly current: boolean;
    /**
     * The set of documents that were newly assigned to this target as part of
     * this remote event.
     */
    readonly addedDocuments: DocumentKeySet;
    /**
     * The set of documents that were already assigned to this target but received
     * an update during this remote event.
     */
    readonly modifiedDocuments: DocumentKeySet;
    /**
     * The set of documents that were removed from this target as part of this
     * remote event.
     */
    readonly removedDocuments: DocumentKeySet;
    constructor(
    /**
     * An opaque, server-assigned token that allows watching a query to be resumed
     * after disconnecting without retransmitting all the data that matches the
     * query. The resume token essentially identifies a point in time from which
     * the server should resume sending results.
     */
    resumeToken: ByteString, 
    /**
     * The "current" (synced) status of this target. Note that "current"
     * has special meaning in the RPC protocol that implies that a target is
     * both up-to-date and consistent with the rest of the watch stream.
     */
    current: boolean, 
    /**
     * The set of documents that were newly assigned to this target as part of
     * this remote event.
     */
    addedDocuments: DocumentKeySet, 
    /**
     * The set of documents that were already assigned to this target but received
     * an update during this remote event.
     */
    modifiedDocuments: DocumentKeySet, 
    /**
     * The set of documents that were removed from this target as part of this
     * remote event.
     */
    removedDocuments: DocumentKeySet);
    /**
     * This method is used to create a synthesized TargetChanges that can be used to
     * apply a CURRENT status change to a View (for queries executed in a different
     * tab) or for new queries (to raise snapshots with correct CURRENT status).
     */
    static createSynthesizedTargetChangeForCurrentChange(targetId: TargetId, current: boolean, resumeToken: ByteString): TargetChange;
}

declare type TargetChangeTargetChangeType = 'NO_CHANGE' | 'ADD' | 'REMOVE' | 'CURRENT' | 'RESET';

/**
 * An immutable set of metadata that the local store tracks for each target.
 */
declare class TargetData {
    /** The target being listened to. */
    readonly target: Target;
    /**
     * The target ID to which the target corresponds; Assigned by the
     * LocalStore for user listens and by the SyncEngine for limbo watches.
     */
    readonly targetId: TargetId;
    /** The purpose of the target. */
    readonly purpose: TargetPurpose;
    /**
     * The sequence number of the last transaction during which this target data
     * was modified.
     */
    readonly sequenceNumber: ListenSequenceNumber;
    /** The latest snapshot version seen for this target. */
    readonly snapshotVersion: SnapshotVersion;
    /**
     * The maximum snapshot version at which the associated view
     * contained no limbo documents.
     */
    readonly lastLimboFreeSnapshotVersion: SnapshotVersion;
    /**
     * An opaque, server-assigned token that allows watching a target to be
     * resumed after disconnecting without retransmitting all the data that
     * matches the target. The resume token essentially identifies a point in
     * time from which the server should resume sending results.
     */
    readonly resumeToken: ByteString;
    /**
     * The number of documents that last matched the query at the resume token or
     * read time. Documents are counted only when making a listen request with
     * resume token or read time, otherwise, keep it null.
     */
    readonly expectedCount: number | null;
    constructor(
    /** The target being listened to. */
    target: Target, 
    /**
     * The target ID to which the target corresponds; Assigned by the
     * LocalStore for user listens and by the SyncEngine for limbo watches.
     */
    targetId: TargetId, 
    /** The purpose of the target. */
    purpose: TargetPurpose, 
    /**
     * The sequence number of the last transaction during which this target data
     * was modified.
     */
    sequenceNumber: ListenSequenceNumber, 
    /** The latest snapshot version seen for this target. */
    snapshotVersion?: SnapshotVersion, 
    /**
     * The maximum snapshot version at which the associated view
     * contained no limbo documents.
     */
    lastLimboFreeSnapshotVersion?: SnapshotVersion, 
    /**
     * An opaque, server-assigned token that allows watching a target to be
     * resumed after disconnecting without retransmitting all the data that
     * matches the target. The resume token essentially identifies a point in
     * time from which the server should resume sending results.
     */
    resumeToken?: ByteString, 
    /**
     * The number of documents that last matched the query at the resume token or
     * read time. Documents are counted only when making a listen request with
     * resume token or read time, otherwise, keep it null.
     */
    expectedCount?: number | null);
    /** Creates a new target data instance with an updated sequence number. */
    withSequenceNumber(sequenceNumber: number): TargetData;
    /**
     * Creates a new target data instance with an updated resume token and
     * snapshot version.
     */
    withResumeToken(resumeToken: ByteString, snapshotVersion: SnapshotVersion): TargetData;
    /**
     * Creates a new target data instance with an updated expected count.
     */
    withExpectedCount(expectedCount: number): TargetData;
    /**
     * Creates a new target data instance with an updated last limbo free
     * snapshot version number.
     */
    withLastLimboFreeSnapshotVersion(lastLimboFreeSnapshotVersion: SnapshotVersion): TargetData;
}

/**
 * A locally-assigned ID used to refer to a target being watched via the
 * Watch service.
 */
declare type TargetId = number;

/** An enumeration of the different purposes we have for targets. */
declare const enum TargetPurpose {
    /** A regular, normal query target. */
    Listen = "TargetPurposeListen",
    /**
     * The query target was used to refill a query after an existence filter
     * mismatch.
     */
    ExistenceFilterMismatch = "TargetPurposeExistenceFilterMismatch",
    /**
     * The query target was used if the query is the result of a false positive in
     * the bloom filter.
     */
    ExistenceFilterMismatchBloom = "TargetPurposeExistenceFilterMismatchBloom",
    /** The query target was used to resolve a limbo document. */
    LimboResolution = "TargetPurposeLimboResolution"
}

/**
 * Terminates the provided `Firestore` instance.
 *
 * After calling `terminate()` only the `clearIndexedDbPersistence()` functions
 * may be used. Any other function will throw a `FirestoreError`. Termination
 * does not cancel any pending writes, and any promises that are awaiting a
 * response from the server will not be resolved.
 *
 * To restart after termination, create a new instance of `Firestore` with
 * {@link (getFirestore:1)}.
 *
 * Note: Under normal circumstances, calling `terminate()` is not required. This
 * function is useful only when you want to force this instance to release all of
 * its resources or in combination with {@link clearIndexedDbPersistence} to
 * ensure that all local state is destroyed between test runs.
 *
 * @param firestore - The `Firestore` instance to terminate.
 * @returns A `Promise` that is resolved when the instance has been successfully
 * terminated.
 */
export declare function terminate(firestore: Firestore): Promise<void>;

/**
 * Wellknown "timer" IDs used when scheduling delayed operations on the
 * AsyncQueue. These IDs can then be used from tests to check for the presence
 * of operations or to run them early.
 *
 * The string values are used when encoding these timer IDs in JSON spec tests.
 */
declare const enum TimerId {
    /** All can be used with runDelayedOperationsEarly() to run all timers. */
    All = "all",
    /**
     * The following 5 timers are used in persistent_stream.ts for the listen and
     * write streams. The "Idle" timer is used to close the stream due to
     * inactivity. The "ConnectionBackoff" timer is used to restart a stream once
     * the appropriate backoff delay has elapsed. The health check is used to mark
     * a stream healthy if it has not received an error during its initial setup.
     */
    ListenStreamIdle = "listen_stream_idle",
    ListenStreamConnectionBackoff = "listen_stream_connection_backoff",
    WriteStreamIdle = "write_stream_idle",
    WriteStreamConnectionBackoff = "write_stream_connection_backoff",
    HealthCheckTimeout = "health_check_timeout",
    /**
     * A timer used in online_state_tracker.ts to transition from
     * OnlineState.Unknown to Offline after a set timeout, rather than waiting
     * indefinitely for success or failure.
     */
    OnlineStateTimeout = "online_state_timeout",
    /**
     * A timer used to update the client metadata in IndexedDb, which is used
     * to determine the primary leaseholder.
     */
    ClientMetadataRefresh = "client_metadata_refresh",
    /** A timer used to periodically attempt LRU Garbage collection */
    LruGarbageCollection = "lru_garbage_collection",
    /**
     * A timer used to retry transactions. Since there can be multiple concurrent
     * transactions, multiple of these may be in the queue at a given time.
     */
    TransactionRetry = "transaction_retry",
    /**
     * A timer used to retry operations scheduled via retryable AsyncQueue
     * operations.
     */
    AsyncQueueRetry = "async_queue_retry",
    /**
     *  A timer used to periodically attempt index backfill.
     */
    IndexBackfill = "index_backfill"
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
    _compareTo(other: Timestamp): number;
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

declare type Timestamp_2 = string | {
    seconds?: string | number;
    nanos?: number;
};

declare interface Token {
    /** Type of token. */
    type: TokenType;
    /**
     * The user with which the token is associated (used for persisting user
     * state on disk, etc.).
     * This will be null for Tokens of the type 'AppCheck'.
     */
    user?: User;
    /** Header values to set for this token */
    headers: Map<string, string>;
}

declare type TokenType = 'OAuth' | 'FirstParty' | 'AppCheck';

/**
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */
export declare class Transaction {
    protected readonly _firestore: Firestore;
    private readonly _transaction;
    private readonly _dataReader;
    /** @hideconstructor */
    constructor(_firestore: Firestore, _transaction: Transaction_2);
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
     * update the document. Fields can contain dots to reference nested fields
     * within the document.
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
 * Internal transaction object responsible for accumulating the mutations to
 * perform and the base versions for any documents read.
 */
declare class Transaction_2 {
    private datastore;
    private readVersions;
    private mutations;
    private committed;
    /**
     * A deferred usage error that occurred previously in this transaction that
     * will cause the transaction to fail once it actually commits.
     */
    private lastWriteError;
    /**
     * Set of documents that have been written in the transaction.
     *
     * When there's more than one write to the same key in a transaction, any
     * writes after the first are handled differently.
     */
    private writtenDocs;
    constructor(datastore: Datastore);
    lookup(keys: DocumentKey[]): Promise<Document_2[]>;
    set(key: DocumentKey, data: ParsedSetData): void;
    update(key: DocumentKey, data: ParsedUpdateData): void;
    delete(key: DocumentKey): void;
    commit(): Promise<void>;
    private recordVersion;
    /**
     * Returns the version of this document when it was read in this transaction,
     * as a precondition, or no precondition if it was not read.
     */
    private precondition;
    /**
     * Returns the precondition for a document if the operation is an update.
     */
    private preconditionForUpdate;
    private write;
    private ensureCommitNotCalled;
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

/** Used to represent a field transform on a mutation. */
declare class TransformOperation {
    private _;
}

declare type UnaryFilterOp = 'OPERATOR_UNSPECIFIED' | 'IS_NAN' | 'IS_NULL' | 'IS_NOT_NAN' | 'IS_NOT_NULL';

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
 * An untyped Firestore Data Converter interface that is shared between the
 * lite, firestore-exp and classic SDK.
 */
declare interface UntypedFirestoreDataConverter<AppModelType, DbModelType extends DocumentData_2 = DocumentData_2> {
    toFirestore(modelObject: WithFieldValue<AppModelType>): WithFieldValue<DbModelType>;
    toFirestore(modelObject: PartialWithFieldValue<AppModelType>, options: SetOptions_2): PartialWithFieldValue<DbModelType>;
    fromFirestore(snapshot: unknown, options?: unknown): AppModelType;
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
 * The result of this update will only be reflected in document reads that occur
 * after the returned promise resolves. If the client is offline, the
 * update fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the document to update.
 * @param data - An object containing the fields and values with which to
 * update the document. Fields can contain dots to reference nested fields
 * within the document.
 * @throws Error - If the provided input is not valid Firestore data.
 * @returns A `Promise` resolved once the data has been successfully written
 * to the backend.
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
 * The result of this update will only be reflected in document reads that occur
 * after the returned promise resolves. If the client is offline, the
 * update fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the document to update.
 * @param field - The first field to update.
 * @param value - The first value.
 * @param moreFieldsAndValues - Additional key value pairs.
 * @throws Error - If the provided input is not valid Firestore data.
 * @returns A `Promise` resolved once the data has been successfully written
 * to the backend.
 */
export declare function updateDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, field: string | FieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): Promise<void>;

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
 * Simple wrapper around a nullable UID. Mostly exists to make code more
 * readable.
 */
declare class User {
    readonly uid: string | null;
    /** A user with a null UID. */
    static readonly UNAUTHENTICATED: User;
    static readonly GOOGLE_CREDENTIALS: User;
    static readonly FIRST_PARTY: User;
    static readonly MOCK_USER: User;
    constructor(uid: string | null);
    isAuthenticated(): boolean;
    /**
     * Returns a key representing this user, suitable for inclusion in a
     * dictionary.
     */
    toKey(): string;
    isEqual(otherUser: User): boolean;
}

declare type Value = firestoreV1ApiClientInterfaces.Value;

declare type ValueNullValue = 'NULL_VALUE';

declare class ViewSnapshot {
    readonly query: Query_2;
    readonly docs: DocumentSet;
    readonly oldDocs: DocumentSet;
    readonly docChanges: DocumentViewChange[];
    readonly mutatedKeys: DocumentKeySet;
    readonly fromCache: boolean;
    readonly syncStateChanged: boolean;
    readonly excludesMetadataChanges: boolean;
    readonly hasCachedResults: boolean;
    constructor(query: Query_2, docs: DocumentSet, oldDocs: DocumentSet, docChanges: DocumentViewChange[], mutatedKeys: DocumentKeySet, fromCache: boolean, syncStateChanged: boolean, excludesMetadataChanges: boolean, hasCachedResults: boolean);
    /** Returns a view snapshot as if all documents in the snapshot were added. */
    static fromInitialDocuments(query: Query_2, documents: DocumentSet, mutatedKeys: DocumentKeySet, fromCache: boolean, hasCachedResults: boolean): ViewSnapshot;
    get hasPendingWrites(): boolean;
    isEqual(other: ViewSnapshot): boolean;
}

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
    private readonly _firestore;
    private readonly _commitHandler;
    private readonly _dataReader;
    private _mutations;
    private _committed;
    /** @hideconstructor */
    constructor(_firestore: Firestore, _commitHandler: (m: Mutation[]) => Promise<void>);
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
    private _verifyNotCommitted;
}

/**
 * Creates a write batch, used for performing multiple writes as a single
 * atomic operation. The maximum number of writes allowed in a single WriteBatch
 * is 500.
 *
 * The result of these writes will only be reflected in document reads that
 * occur after the returned promise resolves. If the client is offline, the
 * write fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @returns A `WriteBatch` that can be used to atomically execute multiple
 * writes.
 */
export declare function writeBatch(firestore: Firestore): WriteBatch;

export { }
