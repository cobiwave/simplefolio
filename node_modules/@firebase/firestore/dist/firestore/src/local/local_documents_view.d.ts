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
import { DocumentKeySet, OverlayMap, DocumentMap, MutableDocumentMap, DocumentKeyMap, OverlayedDocumentMap } from '../model/collections';
import { Document } from '../model/document';
import { DocumentKey } from '../model/document_key';
import { IndexOffset } from '../model/field_index';
import { FieldMask } from '../model/field_mask';
import { DocumentOverlayCache } from './document_overlay_cache';
import { IndexManager } from './index_manager';
import { LocalWriteResult } from './local_store_impl';
import { MutationQueue } from './mutation_queue';
import { PersistencePromise } from './persistence_promise';
import { PersistenceTransaction } from './persistence_transaction';
import { QueryContext } from './query_context';
import { RemoteDocumentCache } from './remote_document_cache';
/**
 * A readonly view of the local state of all documents we're tracking (i.e. we
 * have a cached version in remoteDocumentCache or local mutations for the
 * document). The view is computed by applying the mutations in the
 * MutationQueue to the RemoteDocumentCache.
 */
export declare class LocalDocumentsView {
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
    getDocument(transaction: PersistenceTransaction, key: DocumentKey): PersistencePromise<Document>;
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
    getDocumentsMatchingQuery(transaction: PersistenceTransaction, query: Query, offset: IndexOffset, context?: QueryContext): PersistencePromise<DocumentMap>;
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
