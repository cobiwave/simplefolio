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
import { Query } from '../core/query';
import { DocumentKeySet, MutableDocumentMap, OverlayMap } from '../model/collections';
import { MutableDocument } from '../model/document';
import { DocumentKey } from '../model/document_key';
import { IndexOffset } from '../model/field_index';
import { IndexManager } from './index_manager';
import { PersistencePromise } from './persistence_promise';
import { PersistenceTransaction } from './persistence_transaction';
import { QueryContext } from './query_context';
import { RemoteDocumentChangeBuffer } from './remote_document_change_buffer';
/**
 * Represents cached documents received from the remote backend.
 *
 * The cache is keyed by DocumentKey and entries in the cache are
 * MutableDocuments, meaning we can cache both actual documents as well as
 * documents that are known to not exist.
 */
export interface RemoteDocumentCache {
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
    getDocumentsMatchingQuery(transaction: PersistenceTransaction, query: Query, offset: IndexOffset, mutatedDocs: OverlayMap, context?: QueryContext): PersistencePromise<MutableDocumentMap>;
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
