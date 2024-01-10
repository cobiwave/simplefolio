/**
 * @license
 * Copyright 2019 Google LLC
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
import { Query } from '../core/query';
import { SnapshotVersion } from '../core/snapshot_version';
import { DocumentKeySet, DocumentMap } from '../model/collections';
import { IndexManager } from './index_manager';
import { LocalDocumentsView } from './local_documents_view';
import { PersistencePromise } from './persistence_promise';
import { PersistenceTransaction } from './persistence_transaction';
import { QueryContext } from './query_context';
/**
 * The Firestore query engine.
 *
 * Firestore queries can be executed in three modes. The Query Engine determines
 * what mode to use based on what data is persisted. The mode only determines
 * the runtime complexity of the query - the result set is equivalent across all
 * implementations.
 *
 * The Query engine will use indexed-based execution if a user has configured
 * any index that can be used to execute query (via `setIndexConfiguration()`).
 * Otherwise, the engine will try to optimize the query by re-using a previously
 * persisted query result. If that is not possible, the query will be executed
 * via a full collection scan.
 *
 * Index-based execution is the default when available. The query engine
 * supports partial indexed execution and merges the result from the index
 * lookup with documents that have not yet been indexed. The index evaluation
 * matches the backend's format and as such, the SDK can use indexing for all
 * queries that the backend supports.
 *
 * If no index exists, the query engine tries to take advantage of the target
 * document mapping in the TargetCache. These mappings exists for all queries
 * that have been synced with the backend at least once and allow the query
 * engine to only read documents that previously matched a query plus any
 * documents that were edited after the query was last listened to.
 *
 * There are some cases when this optimization is not guaranteed to produce
 * the same results as full collection scans. In these cases, query
 * processing falls back to full scans. These cases are:
 *
 * - Limit queries where a document that matched the query previously no longer
 *   matches the query.
 *
 * - Limit queries where a document edit may cause the document to sort below
 *   another document that is in the local cache.
 *
 * - Queries that have never been CURRENT or free of limbo documents.
 */
export declare class QueryEngine {
    private localDocumentsView;
    private indexManager;
    private initialized;
    indexAutoCreationEnabled: boolean;
    /**
     * SDK only decides whether it should create index when collection size is
     * larger than this.
     */
    indexAutoCreationMinCollectionSize: number;
    relativeIndexReadCostPerDocument: number;
    /** Sets the document view to query against. */
    initialize(localDocuments: LocalDocumentsView, indexManager: IndexManager): void;
    /** Returns all local documents matching the specified query. */
    getDocumentsMatchingQuery(transaction: PersistenceTransaction, query: Query, lastLimboFreeSnapshotVersion: SnapshotVersion, remoteKeys: DocumentKeySet): PersistencePromise<DocumentMap>;
    createCacheIndexes(transaction: PersistenceTransaction, query: Query, context: QueryContext, resultSize: number): PersistencePromise<void>;
    /**
     * Performs an indexed query that evaluates the query based on a collection's
     * persisted index values. Returns `null` if an index is not available.
     */
    private performQueryUsingIndex;
    /**
     * Performs a query based on the target's persisted query mapping. Returns
     * `null` if the mapping is not available or cannot be used.
     */
    private performQueryUsingRemoteKeys;
    /** Applies the query filter and sorting to the provided documents.  */
    private applyQuery;
    /**
     * Determines if a limit query needs to be refilled from cache, making it
     * ineligible for index-free execution.
     *
     * @param query - The query.
     * @param sortedPreviousResults - The documents that matched the query when it
     * was last synchronized, sorted by the query's comparator.
     * @param remoteKeys - The document keys that matched the query at the last
     * snapshot.
     * @param limboFreeSnapshotVersion - The version of the snapshot when the
     * query was last synchronized.
     */
    private needsRefill;
    private executeFullCollectionScan;
    /**
     * Combines the results from an indexed execution with the remaining documents
     * that have not yet been indexed.
     */
    private appendRemainingResults;
}
