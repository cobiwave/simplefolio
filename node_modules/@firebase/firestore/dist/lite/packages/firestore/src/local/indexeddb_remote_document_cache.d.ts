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
import { MutableDocument } from '../model/document';
import { DocumentKey } from '../model/document_key';
import { LocalSerializer } from './local_serializer';
import { RemoteDocumentCache } from './remote_document_cache';
export interface DocumentSizeEntry {
    document: MutableDocument;
    size: number;
}
export interface IndexedDbRemoteDocumentCache extends RemoteDocumentCache {
}
/** Creates a new IndexedDbRemoteDocumentCache. */
export declare function newIndexedDbRemoteDocumentCache(serializer: LocalSerializer): IndexedDbRemoteDocumentCache;
/**
 * Comparator that compares document keys according to the primary key sorting
 * used by the `DbRemoteDocumentDocument` store (by prefix path, collection id
 * and then document ID).
 *
 * Visible for testing.
 */
export declare function dbKeyComparator(l: DocumentKey, r: DocumentKey): number;
