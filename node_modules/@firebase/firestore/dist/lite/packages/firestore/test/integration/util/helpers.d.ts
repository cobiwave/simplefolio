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
import { CollectionReference, DocumentData, DocumentReference, Firestore, MemoryLocalCache, PersistentLocalCache, PrivateSettings, QuerySnapshot, SnapshotListenOptions, Query } from './firebase_export';
export interface PersistenceMode {
    readonly name: string;
    readonly storage: 'memory' | 'indexeddb';
    readonly gc: 'eager' | 'lru';
    /**
     * Creates and returns a new `PersistenceMode` object that is the nearest
     * equivalent to this persistence mode but uses eager garbage collection.
     */
    toEagerGc(): PersistenceMode;
    /**
     * Creates and returns a new `PersistenceMode` object that is the nearest
     * equivalent to this persistence mode but uses LRU garbage collection.
     */
    toLruGc(): PersistenceMode;
    /**
     * Creates and returns a new "local cache" object corresponding to this
     * persistence type.
     */
    asLocalCacheFirestoreSettings(): MemoryLocalCache | PersistentLocalCache;
}
export declare class MemoryEagerPersistenceMode implements PersistenceMode {
    readonly name = "memory";
    readonly storage = "memory";
    readonly gc = "eager";
    toEagerGc(): MemoryEagerPersistenceMode;
    toLruGc(): MemoryLruPersistenceMode;
    asLocalCacheFirestoreSettings(): MemoryLocalCache;
}
export declare class MemoryLruPersistenceMode implements PersistenceMode {
    readonly name = "memory_lru_gc";
    readonly storage = "memory";
    readonly gc = "lru";
    toEagerGc(): MemoryEagerPersistenceMode;
    toLruGc(): MemoryLruPersistenceMode;
    asLocalCacheFirestoreSettings(): MemoryLocalCache;
}
export declare class IndexedDbPersistenceMode implements PersistenceMode {
    readonly name = "indexeddb";
    readonly storage = "indexeddb";
    readonly gc = "lru";
    toEagerGc(): MemoryEagerPersistenceMode;
    toLruGc(): IndexedDbPersistenceMode;
    asLocalCacheFirestoreSettings(): PersistentLocalCache;
}
export declare const PERSISTENCE_MODE_UNSPECIFIED: unique symbol;
export declare function isPersistenceAvailable(): boolean;
declare type ApiSuiteFunction = (message: string, testSuite: (persistence: PersistenceMode) => void) => void;
interface ApiDescribe {
    (message: string, testSuite: (persistence: PersistenceMode) => void): void;
    skip: ApiSuiteFunction;
    only: ApiSuiteFunction;
}
export declare const apiDescribe: ApiDescribe;
/** Converts the documents in a QuerySnapshot to an array with the data of each document. */
export declare function toDataArray(docSet: QuerySnapshot): DocumentData[];
/** Converts the changes in a QuerySnapshot to an array with the data of each document. */
export declare function toChangesArray(docSet: QuerySnapshot, options?: SnapshotListenOptions): DocumentData[];
export declare function toDataMap(docSet: QuerySnapshot): {
    [field: string]: DocumentData;
};
/** Converts a DocumentSet to an array with the id of each document */
export declare function toIds(docSet: QuerySnapshot): string[];
export declare function withTestDb(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, fn: (db: Firestore) => Promise<void>): Promise<void>;
/** Runs provided fn with a db for an alternate project id. */
export declare function withAlternateTestDb(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, fn: (db: Firestore) => Promise<void>): Promise<void>;
export declare function withTestDbs(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, numDbs: number, fn: (db: Firestore[]) => Promise<void>): Promise<void>;
export declare function withTestDbsSettings<T>(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, projectId: string, settings: PrivateSettings, numDbs: number, fn: (db: Firestore[]) => Promise<T>): Promise<T>;
export declare function withNamedTestDbsOrSkipUnlessUsingEmulator(persistence: PersistenceMode, dbNames: string[], fn: (db: Firestore[]) => Promise<void>): Promise<void>;
export declare function withTestDoc(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, fn: (doc: DocumentReference, db: Firestore) => Promise<void>): Promise<void>;
export declare function withTestDocAndSettings(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, settings: PrivateSettings, fn: (doc: DocumentReference) => Promise<void>): Promise<void>;
export declare function withTestDocAndInitialData(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, initialData: DocumentData | null, fn: (doc: DocumentReference, db: Firestore) => Promise<void>): Promise<void>;
export declare class RetryError extends Error {
    readonly name = "FirestoreIntegrationTestRetryError";
}
export declare function withRetry<T>(fn: (attemptNumber: number) => Promise<T>): Promise<T>;
export declare function withTestCollection<T>(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, docs: {
    [key: string]: DocumentData;
}, fn: (collection: CollectionReference, db: Firestore) => Promise<T>): Promise<T>;
export declare function withEmptyTestCollection(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, fn: (collection: CollectionReference, db: Firestore) => Promise<void>): Promise<void>;
export declare function withTestCollectionSettings<T>(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, settings: PrivateSettings, docs: {
    [key: string]: DocumentData;
}, fn: (collection: CollectionReference, db: Firestore) => Promise<T>): Promise<T>;
export declare function batchCommitDocsToCollection<T>(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, settings: PrivateSettings, docs: {
    [key: string]: DocumentData;
}, collectionId: string, fn: (collection: CollectionReference, db: Firestore) => Promise<T>): Promise<T>;
/**
 * Creates a `docs` argument suitable for specifying to `withTestCollection()`
 * that defines subsets of documents with different document data.
 *
 * This can be useful for pre-populating a collection with some documents that
 * match a query and others that do _not_ match that query.
 *
 * Each key of the given `partitions` object will be considered a partition
 * "name". The returned object will specify `documentCount` documents with the
 * `documentData` whose document IDs are prefixed with the partition "name".
 */
export declare function partitionedTestDocs(partitions: {
    [partitionName: string]: {
        documentData: DocumentData;
        documentCount: number;
    };
}): {
    [key: string]: DocumentData;
};
/**
 * Checks that running the query while online (against the backend/emulator) results in the same
 * documents as running the query while offline. If `expectedDocs` is provided, it also checks
 * that both online and offline query result is equal to the expected documents.
 *
 * @param query The query to check
 * @param expectedDocs Ordered list of document keys that are expected to match the query
 */
export declare function checkOnlineAndOfflineResultsMatch(query: Query, ...expectedDocs: string[]): Promise<void>;
export {};
