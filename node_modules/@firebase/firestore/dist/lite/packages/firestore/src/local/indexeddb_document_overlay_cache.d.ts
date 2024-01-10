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
import { User } from '../auth/user';
import { DocumentKeySet, MutationMap, OverlayMap } from '../model/collections';
import { DocumentKey } from '../model/document_key';
import { Overlay } from '../model/overlay';
import { ResourcePath } from '../model/path';
import { DocumentOverlayCache } from './document_overlay_cache';
import { LocalSerializer } from './local_serializer';
import { PersistencePromise } from './persistence_promise';
import { PersistenceTransaction } from './persistence_transaction';
/**
 * Implementation of DocumentOverlayCache using IndexedDb.
 */
export declare class IndexedDbDocumentOverlayCache implements DocumentOverlayCache {
    private readonly serializer;
    private readonly userId;
    /**
     * @param serializer - The document serializer.
     * @param userId - The userId for which we are accessing overlays.
     */
    constructor(serializer: LocalSerializer, userId: string);
    static forUser(serializer: LocalSerializer, user: User): IndexedDbDocumentOverlayCache;
    getOverlay(transaction: PersistenceTransaction, key: DocumentKey): PersistencePromise<Overlay | null>;
    getOverlays(transaction: PersistenceTransaction, keys: DocumentKey[]): PersistencePromise<OverlayMap>;
    saveOverlays(transaction: PersistenceTransaction, largestBatchId: number, overlays: MutationMap): PersistencePromise<void>;
    removeOverlaysForBatchId(transaction: PersistenceTransaction, documentKeys: DocumentKeySet, batchId: number): PersistencePromise<void>;
    getOverlaysForCollection(transaction: PersistenceTransaction, collection: ResourcePath, sinceBatchId: number): PersistencePromise<OverlayMap>;
    getOverlaysForCollectionGroup(transaction: PersistenceTransaction, collectionGroup: string, sinceBatchId: number, count: number): PersistencePromise<OverlayMap>;
    private saveOverlay;
}
