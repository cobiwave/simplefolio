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
import { BatchId, TargetId } from '../core/types';
import { ResourcePath } from '../model/path';
import { EncodedResourcePath } from './encoded_resource_path';
import { DbDocumentMutation } from './indexeddb_schema';
/** A timestamp type that can be used in IndexedDb keys. */
export declare type DbTimestampKey = [/* seconds */ number, /* nanos */ number];
export declare type DbPrimaryClientKey = typeof DbPrimaryClientKey;
/**
 * Name of the IndexedDb object store.
 *
 * Note that the name 'owner' is chosen to ensure backwards compatibility with
 * older clients that only supported single locked access to the persistence
 * layer.
 */
export declare const DbPrimaryClientStore = "owner";
/**
 * The key string used for the single object that exists in the
 * DbPrimaryClient store.
 */
export declare const DbPrimaryClientKey = "owner";
/** Object keys in the 'mutationQueues' store are userId strings. */
export declare type DbMutationQueueKey = string;
/** Name of the IndexedDb object store.  */
export declare const DbMutationQueueStore = "mutationQueues";
/** Keys are automatically assigned via the userId property. */
export declare const DbMutationQueueKeyPath = "userId";
/** The 'mutations' store  is keyed by batch ID. */
export declare type DbMutationBatchKey = BatchId;
/** Name of the IndexedDb object store.  */
export declare const DbMutationBatchStore = "mutations";
/** Keys are automatically assigned via the userId, batchId properties. */
export declare const DbMutationBatchKeyPath = "batchId";
/** The index name for lookup of mutations by user. */
export declare const DbMutationBatchUserMutationsIndex = "userMutationsIndex";
/** The user mutations index is keyed by [userId, batchId] pairs. */
export declare const DbMutationBatchUserMutationsKeyPath: string[];
/**
 * The key for a db document mutation, which is made up of a userID, path, and
 * batchId. Note that the path must be serialized into a form that indexedDB can
 * sort.
 */
export declare type DbDocumentMutationKey = [string, EncodedResourcePath, BatchId];
/**
 * Creates a [userId] key for use in the DbDocumentMutations index to iterate
 * over all of a user's document mutations.
 */
export declare function newDbDocumentMutationPrefixForUser(userId: string): [string];
/**
 * Creates a [userId, encodedPath] key for use in the DbDocumentMutations
 * index to iterate over all at document mutations for a given path or lower.
 */
export declare function newDbDocumentMutationPrefixForPath(userId: string, path: ResourcePath): [string, EncodedResourcePath];
/**
 * Creates a full index key of [userId, encodedPath, batchId] for inserting
 * and deleting into the DbDocumentMutations index.
 */
export declare function newDbDocumentMutationKey(userId: string, path: ResourcePath, batchId: BatchId): DbDocumentMutationKey;
/**
 * Because we store all the useful information for this store in the key,
 * there is no useful information to store as the value. The raw (unencoded)
 * path cannot be stored because IndexedDb doesn't store prototype
 * information.
 */
export declare const DbDocumentMutationPlaceholder: DbDocumentMutation;
export declare const DbDocumentMutationStore = "documentMutations";
export declare const DbRemoteDocumentStore = "remoteDocumentsV14";
/**
 * A key in the 'remoteDocumentsV14' object store is an array containing the
 * collection path, the collection group, the read time and the document id.
 */
export declare type DbRemoteDocumentKey = [
    /** path to collection */ string[],
    /** collection group */ string,
    /** read time */ DbTimestampKey,
    /** document ID */ string
];
/**
 * The primary key of the remote documents store, which allows for efficient
 * access by collection path and read time.
 */
export declare const DbRemoteDocumentKeyPath: string[];
/** An index that provides access to documents by key. */
export declare const DbRemoteDocumentDocumentKeyIndex = "documentKeyIndex";
export declare const DbRemoteDocumentDocumentKeyIndexPath: string[];
/**
 * An index that provides access to documents by collection group and read
 * time.
 *
 * This index is used by the index backfiller.
 */
export declare const DbRemoteDocumentCollectionGroupIndex = "collectionGroupIndex";
export declare const DbRemoteDocumentCollectionGroupIndexPath: string[];
export declare const DbRemoteDocumentGlobalStore = "remoteDocumentGlobal";
export declare const DbRemoteDocumentGlobalKey = "remoteDocumentGlobalKey";
export declare type DbRemoteDocumentGlobalKey = typeof DbRemoteDocumentGlobalKey;
/**
 * A key in the 'targets' object store is a targetId of the query.
 */
export declare type DbTargetKey = TargetId;
export declare const DbTargetStore = "targets";
/** Keys are automatically assigned via the targetId property. */
export declare const DbTargetKeyPath = "targetId";
/** The name of the queryTargets index. */
export declare const DbTargetQueryTargetsIndexName = "queryTargetsIndex";
/**
 * The index of all canonicalIds to the targets that they match. This is not
 * a unique mapping because canonicalId does not promise a unique name for all
 * possible queries, so we append the targetId to make the mapping unique.
 */
export declare const DbTargetQueryTargetsKeyPath: string[];
/**
 * The key for a DbTargetDocument, containing a targetId and an encoded resource
 * path.
 */
export declare type DbTargetDocumentKey = [TargetId, EncodedResourcePath];
/** Name of the IndexedDb object store.  */
export declare const DbTargetDocumentStore = "targetDocuments";
/** Keys are automatically assigned via the targetId, path properties. */
export declare const DbTargetDocumentKeyPath: string[];
/** The index name for the reverse index. */
export declare const DbTargetDocumentDocumentTargetsIndex = "documentTargetsIndex";
/** We also need to create the reverse index for these properties. */
export declare const DbTargetDocumentDocumentTargetsKeyPath: string[];
/**
 * The type to represent the single allowed key for the DbTargetGlobal store.
 */
export declare type DbTargetGlobalKey = typeof DbTargetGlobalKey;
/**
 * The key string used for the single object that exists in the
 * DbTargetGlobal store.
 */
export declare const DbTargetGlobalKey = "targetGlobalKey";
export declare const DbTargetGlobalStore = "targetGlobal";
/**
 * The key for a DbCollectionParent entry, containing the collection ID
 * and the parent path that contains it. Note that the parent path will be an
 * empty path in the case of root-level collections.
 */
export declare type DbCollectionParentKey = [string, EncodedResourcePath];
/** Name of the IndexedDb object store. */
export declare const DbCollectionParentStore = "collectionParents";
/** Keys are automatically assigned via the collectionId, parent properties. */
export declare const DbCollectionParentKeyPath: string[];
/** Name of the IndexedDb object store. */
export declare const DbClientMetadataStore = "clientMetadata";
/** Keys are automatically assigned via the clientId properties. */
export declare const DbClientMetadataKeyPath = "clientId";
/** Object keys in the 'clientMetadata' store are clientId strings. */
export declare type DbClientMetadataKey = string;
export declare type DbBundlesKey = string;
/** Name of the IndexedDb object store. */
export declare const DbBundleStore = "bundles";
export declare const DbBundleKeyPath = "bundleId";
export declare type DbNamedQueriesKey = string;
/** Name of the IndexedDb object store. */
export declare const DbNamedQueryStore = "namedQueries";
export declare const DbNamedQueryKeyPath = "name";
/** The key for each index consisting of just the index id. */
export declare type DbIndexConfigurationKey = number;
/** Name of the IndexedDb object store. */
export declare const DbIndexConfigurationStore = "indexConfiguration";
export declare const DbIndexConfigurationKeyPath = "indexId";
/**
 * An index that provides access to the index configurations by collection
 * group.
 *
 * PORTING NOTE: iOS and Android maintain this index in-memory, but this is
 * not possible here as the Web client supports concurrent access to
 * persistence via multi-tab.
 */
export declare const DbIndexConfigurationCollectionGroupIndex = "collectionGroupIndex";
export declare const DbIndexConfigurationCollectionGroupIndexPath = "collectionGroup";
/** The key for each index state consisting of the index id and its user id. */
export declare type DbIndexStateKey = [number, string];
/** Name of the IndexedDb object store. */
export declare const DbIndexStateStore = "indexState";
export declare const DbIndexStateKeyPath: string[];
/**
 * An index that provides access to documents in a collection sorted by last
 * update time. Used by the backfiller.
 *
 * PORTING NOTE: iOS and Android maintain this index in-memory, but this is
 * not possible here as the Web client supports concurrent access to
 * persistence via multi-tab.
 */
export declare const DbIndexStateSequenceNumberIndex = "sequenceNumberIndex";
export declare const DbIndexStateSequenceNumberIndexPath: string[];
/**
 * The key for each index entry consists of the index id and its user id,
 * the encoded array and directional value for the indexed fields as well as
 * an ordered and an encoded document path for the indexed document.
 */
export declare type DbIndexEntryKey = [
    number,
    string,
    Uint8Array,
    Uint8Array,
    Uint8Array,
    string[]
];
/** Name of the IndexedDb object store. */
export declare const DbIndexEntryStore = "indexEntries";
export declare const DbIndexEntryKeyPath: string[];
export declare const DbIndexEntryDocumentKeyIndex = "documentKeyIndex";
export declare const DbIndexEntryDocumentKeyIndexPath: string[];
export declare type DbDocumentOverlayKey = [
    string,
    string,
    string
];
/** Name of the IndexedDb object store. */
export declare const DbDocumentOverlayStore = "documentOverlays";
export declare const DbDocumentOverlayKeyPath: string[];
export declare const DbDocumentOverlayCollectionPathOverlayIndex = "collectionPathOverlayIndex";
export declare const DbDocumentOverlayCollectionPathOverlayIndexPath: string[];
export declare const DbDocumentOverlayCollectionGroupOverlayIndex = "collectionGroupOverlayIndex";
export declare const DbDocumentOverlayCollectionGroupOverlayIndexPath: string[];
export declare const V1_STORES: string[];
export declare const V3_STORES: string[];
export declare const V4_STORES: string[];
export declare const V6_STORES: string[];
export declare const V8_STORES: string[];
export declare const V11_STORES: string[];
export declare const V12_STORES: string[];
export declare const V13_STORES: string[];
export declare const V14_STORES: string[];
export declare const V15_STORES: string[];
/**
 * The list of all default IndexedDB stores used throughout the SDK. This is
 * used when creating transactions so that access across all stores is done
 * atomically.
 */
export declare const ALL_STORES: string[];
/** Returns the object stores for the provided schema. */
export declare function getObjectStores(schemaVersion: number): string[];
