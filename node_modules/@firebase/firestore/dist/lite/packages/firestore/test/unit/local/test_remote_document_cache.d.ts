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
import { Query } from '../../../src/core/query';
import { SnapshotVersion } from '../../../src/core/snapshot_version';
import { IndexManager } from '../../../src/local/index_manager';
import { Persistence } from '../../../src/local/persistence';
import { RemoteDocumentChangeBuffer } from '../../../src/local/remote_document_change_buffer';
import { DocumentKeySet, MutableDocumentMap, OverlayMap } from '../../../src/model/collections';
import { MutableDocument } from '../../../src/model/document';
import { DocumentKey } from '../../../src/model/document_key';
import { IndexOffset } from '../../../src/model/field_index';
/**
 * A wrapper around a RemoteDocumentCache that automatically creates a
 * transaction around every operation to reduce test boilerplate.
 */
export declare class TestRemoteDocumentCache {
    private readonly persistence;
    private readonly cache;
    constructor(persistence: Persistence);
    setIndexManager(indexManager: IndexManager): void;
    /**
     * Reads all of the documents first so we can safely add them and keep the size calculation in
     * sync.
     */
    addEntries(documents: MutableDocument[]): Promise<void>;
    /**
     * Adds a single document using the document's version as its read time.
     * Reads the document first to track the document size internally.
     */
    addEntry(document: MutableDocument): Promise<void>;
    removeEntry(documentKey: DocumentKey, version?: SnapshotVersion): Promise<void>;
    getEntry(documentKey: DocumentKey): Promise<MutableDocument>;
    getEntries(documentKeys: DocumentKeySet): Promise<MutableDocumentMap>;
    getDocumentsMatchingQuery(query: Query, offset: IndexOffset, mutatedDocs: OverlayMap): Promise<MutableDocumentMap>;
    getAllFromCollectionGroup(collectionGroup: string, offset: IndexOffset, limit: number): Promise<MutableDocumentMap>;
    getSize(): Promise<number>;
    newChangeBuffer(options?: {
        trackRemovals: boolean;
    }): RemoteDocumentChangeBuffer;
}
