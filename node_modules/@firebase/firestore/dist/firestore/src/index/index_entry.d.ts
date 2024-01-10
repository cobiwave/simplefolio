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
import { DocumentKey } from '../model/document_key';
/** Represents an index entry saved by the SDK in persisted storage. */
export declare class IndexEntry {
    readonly indexId: number;
    readonly documentKey: DocumentKey;
    readonly arrayValue: Uint8Array;
    readonly directionalValue: Uint8Array;
    constructor(indexId: number, documentKey: DocumentKey, arrayValue: Uint8Array, directionalValue: Uint8Array);
    /**
     * Returns an IndexEntry entry that sorts immediately after the current
     * directional value.
     */
    successor(): IndexEntry;
}
export declare function indexEntryComparator(left: IndexEntry, right: IndexEntry): number;
export declare function compareByteArrays(left: Uint8Array, right: Uint8Array): number;
