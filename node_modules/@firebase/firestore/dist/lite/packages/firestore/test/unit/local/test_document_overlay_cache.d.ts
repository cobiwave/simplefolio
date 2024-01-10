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
import { DocumentOverlayCache } from '../../../src/local/document_overlay_cache';
import { Persistence } from '../../../src/local/persistence';
import { DocumentKeySet, MutationMap, OverlayMap } from '../../../src/model/collections';
import { DocumentKey } from '../../../src/model/document_key';
import { Mutation } from '../../../src/model/mutation';
import { Overlay } from '../../../src/model/overlay';
import { ResourcePath } from '../../../src/model/path';
/**
 * A wrapper around a DocumentOverlayCache that automatically creates a
 * transaction around every operation to reduce test boilerplate.
 */
export declare class TestDocumentOverlayCache {
    private persistence;
    private cache;
    constructor(persistence: Persistence, cache: DocumentOverlayCache);
    saveOverlays(largestBatch: number, data: MutationMap): Promise<void>;
    getOverlay(key: DocumentKey): Promise<Overlay | null>;
    getOverlays(keys: DocumentKey[]): Promise<OverlayMap>;
    getOverlayMutation(docKey: string): Promise<Mutation | null>;
    getOverlaysForCollection(path: ResourcePath, sinceBatchId: number): Promise<OverlayMap>;
    getOverlaysForCollectionGroup(collectionGroup: string, sinceBatchId: number, count: number): Promise<OverlayMap>;
    removeOverlaysForBatchId(documentKeys: DocumentKeySet, batchId: number): Promise<void>;
}
