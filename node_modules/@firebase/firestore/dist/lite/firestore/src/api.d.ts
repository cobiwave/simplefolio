/**
 * @license
 * Copyright 2021 Google LLC
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
export { aggregateFieldEqual, aggregateQuerySnapshotEqual, average, count, getAggregateFromServer, getCountFromServer, sum } from './api/aggregate';
export { AggregateField, AggregateFieldType, AggregateQuerySnapshot, AggregateSpec, AggregateSpecData, AggregateType } from './lite-api/aggregate_types';
export { FirestoreLocalCache, MemoryCacheSettings, MemoryEagerGarbageCollector, memoryEagerGarbageCollector, MemoryGarbageCollector, MemoryLocalCache, memoryLocalCache, MemoryLruGarbageCollector, memoryLruGarbageCollector, PersistentCacheSettings, PersistentLocalCache, persistentLocalCache, PersistentMultipleTabManager, persistentMultipleTabManager, PersistentSingleTabManager, persistentSingleTabManager, PersistentSingleTabManagerSettings, PersistentTabManager } from './api/cache_config';
export { documentId, FieldPath } from './api/field_path';
export { clearIndexedDbPersistence, connectFirestoreEmulator, disableNetwork, EmulatorMockTokenOptions, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence, enableNetwork, ensureFirestoreConfigured, Firestore, getFirestore, initializeFirestore, loadBundle, namedQuery, terminate, waitForPendingWrites } from './api/database';
export { LoadBundleTask, LoadBundleTaskProgress, TaskState } from './api/bundle';
export { FirestoreSettings, PersistenceSettings } from './api/settings';
export type { PrivateSettings } from './lite-api/settings';
export { ExperimentalLongPollingOptions } from './api/long_polling_options';
export { DocumentChange, DocumentChangeType, DocumentSnapshot, FirestoreDataConverter, QueryDocumentSnapshot, QuerySnapshot, snapshotEqual, SnapshotMetadata, SnapshotOptions } from './api/snapshot';
export { collection, collectionGroup, CollectionReference, doc, DocumentData, DocumentReference, PartialWithFieldValue, Query, queryEqual, refEqual, SetOptions, UpdateData, WithFieldValue } from './api/reference';
export { and, endAt, endBefore, limit, limitToLast, or, orderBy, OrderByDirection, query, QueryCompositeFilterConstraint, QueryConstraint, QueryConstraintType, QueryEndAtConstraint, QueryFieldFilterConstraint, QueryFilterConstraint, QueryLimitConstraint, QueryNonFilterConstraint, QueryOrderByConstraint, QueryStartAtConstraint, startAfter, startAt, where, WhereFilterOp } from './api/filter';
export { SnapshotListenOptions, Unsubscribe } from './api/reference_impl';
export { TransactionOptions } from './api/transaction_options';
export { runTransaction, Transaction } from './api/transaction';
export { addDoc, deleteDoc, executeWrite, getDoc, getDocFromCache, getDocFromServer, getDocs, getDocsFromCache, getDocsFromServer, onSnapshot, onSnapshotsInSync, setDoc, updateDoc } from './api/reference_impl';
export { FieldValue } from './api/field_value';
export { arrayRemove, arrayUnion, deleteField, increment, serverTimestamp } from './api/field_value_impl';
export { LogLevelString as LogLevel, setLogLevel } from './util/log';
export { Bytes } from './api/bytes';
export { WriteBatch, writeBatch } from './api/write_batch';
export { GeoPoint } from './api/geo_point';
export { Timestamp } from './api/timestamp';
export { CACHE_SIZE_UNLIMITED } from './api/database';
export { FirestoreError, FirestoreErrorCode } from './util/error';
export { AbstractUserDataWriter } from './lite-api/user_data_writer';
export { AddPrefixToKeys, ChildUpdateFields, NestedUpdateFields, Primitive, UnionToIntersection } from '../src/lite-api/types';
export { Index, IndexConfiguration, IndexField, setIndexConfiguration } from './api/index_configuration';
export { PersistentCacheIndexManager, getPersistentCacheIndexManager, deleteAllPersistentCacheIndexes, enablePersistentCacheIndexAutoCreation, disablePersistentCacheIndexAutoCreation } from './api/persistent_cache_index_manager';
/**
 * Internal exports
 */
export { isBase64Available as _isBase64Available } from './platform/base64';
export { DatabaseId as _DatabaseId } from './core/database_info';
export { cast as _cast, validateIsNotUsedTogether as _validateIsNotUsedTogether } from './util/input_validation';
export { DocumentKey as _DocumentKey } from './model/document_key';
export { debugAssert as _debugAssert } from './util/assert';
export { FieldPath as _FieldPath } from './model/path';
export type { ResourcePath as _ResourcePath } from './model/path';
export { ByteString as _ByteString } from './util/byte_string';
export { logWarn as _logWarn } from './util/log';
export { AutoId as _AutoId } from './util/misc';
export type { AuthTokenFactory, FirstPartyCredentialsSettings } from './api/credentials';
export { EmptyAuthCredentialsProvider as _EmptyAuthCredentialsProvider } from './api/credentials';
export { EmptyAppCheckTokenProvider as _EmptyAppCheckTokenProvider } from './api/credentials';
export { ExistenceFilterMismatchCallback as _TestingHooksExistenceFilterMismatchCallback, TestingHooks as _TestingHooks } from './util/testing_hooks';
export { ExistenceFilterMismatchInfo as _TestingHooksExistenceFilterMismatchInfo } from './util/testing_hooks_spi';
