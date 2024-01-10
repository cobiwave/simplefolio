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
import { SnapshotVersion } from '../core/snapshot_version';
import { TargetId } from '../core/types';
import { OverlayedDocument } from '../local/overlayed_document';
import { ObjectMap } from '../util/obj_map';
import { SortedMap } from '../util/sorted_map';
import { SortedSet } from '../util/sorted_set';
import { Document, MutableDocument } from './document';
import { DocumentKey } from './document_key';
import { Mutation } from './mutation';
import { Overlay } from './overlay';
/** Miscellaneous collection types / constants. */
export declare type MutableDocumentMap = SortedMap<DocumentKey, MutableDocument>;
export declare function mutableDocumentMap(): MutableDocumentMap;
export interface DocumentSizeEntries {
    documents: MutableDocumentMap;
    sizeMap: SortedMap<DocumentKey, number>;
}
export declare type DocumentMap = SortedMap<DocumentKey, Document>;
export declare function documentMap(...docs: Document[]): DocumentMap;
export declare type OverlayedDocumentMap = DocumentKeyMap<OverlayedDocument>;
export declare function newOverlayedDocumentMap(): OverlayedDocumentMap;
export declare function convertOverlayedDocumentMapToDocumentMap(collection: OverlayedDocumentMap): DocumentMap;
export declare type OverlayMap = DocumentKeyMap<Overlay>;
export declare function newOverlayMap(): OverlayMap;
export declare type MutationMap = DocumentKeyMap<Mutation>;
export declare function newMutationMap(): MutationMap;
export declare type DocumentKeyMap<T> = ObjectMap<DocumentKey, T>;
export declare function newDocumentKeyMap<T>(): DocumentKeyMap<T>;
export declare type DocumentVersionMap = SortedMap<DocumentKey, SnapshotVersion>;
export declare function documentVersionMap(): DocumentVersionMap;
export declare type DocumentKeySet = SortedSet<DocumentKey>;
export declare function documentKeySet(...keys: DocumentKey[]): DocumentKeySet;
export declare type TargetIdSet = SortedSet<TargetId>;
export declare function targetIdSet(): SortedSet<TargetId>;
