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
import { DocumentKeySet, MutationMap, OverlayMap } from '../model/collections';
import { DocumentKey } from '../model/document_key';
import { Overlay } from '../model/overlay';
import { ResourcePath } from '../model/path';
import { PersistencePromise } from './persistence_promise';
import { PersistenceTransaction } from './persistence_transaction';
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
export interface DocumentOverlayCache {
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
