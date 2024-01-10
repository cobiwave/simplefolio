/**
 * @license
 * Copyright 2021 Google LLC
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
import { Document } from './document';
import { DocumentKey } from './document_key';
import { FieldPath } from './path';
/**
 * The initial mutation batch id for each index. Gets updated during index
 * backfill.
 */
export declare const INITIAL_LARGEST_BATCH_ID = -1;
/**
 * The initial sequence number for each index. Gets updated during index
 * backfill.
 */
export declare const INITIAL_SEQUENCE_NUMBER = 0;
/**
 * An index definition for field indexes in Firestore.
 *
 * Every index is associated with a collection. The definition contains a list
 * of fields and their index kind (which can be `ASCENDING`, `DESCENDING` or
 * `CONTAINS` for ArrayContains/ArrayContainsAny queries).
 *
 * Unlike the backend, the SDK does not differentiate between collection or
 * collection group-scoped indices. Every index can be used for both single
 * collection and collection group queries.
 */
export declare class FieldIndex {
    /**
     * The index ID. Returns -1 if the index ID is not available (e.g. the index
     * has not yet been persisted).
     */
    readonly indexId: number;
    /** The collection ID this index applies to. */
    readonly collectionGroup: string;
    /** The field segments for this index. */
    readonly fields: IndexSegment[];
    /** Shows how up-to-date the index is for the current user. */
    readonly indexState: IndexState;
    /** An ID for an index that has not yet been added to persistence.  */
    static UNKNOWN_ID: number;
    constructor(
    /**
     * The index ID. Returns -1 if the index ID is not available (e.g. the index
     * has not yet been persisted).
     */
    indexId: number, 
    /** The collection ID this index applies to. */
    collectionGroup: string, 
    /** The field segments for this index. */
    fields: IndexSegment[], 
    /** Shows how up-to-date the index is for the current user. */
    indexState: IndexState);
}
/** Returns the ArrayContains/ArrayContainsAny segment for this index. */
export declare function fieldIndexGetArraySegment(fieldIndex: FieldIndex): IndexSegment | undefined;
/** Returns all directional (ascending/descending) segments for this index. */
export declare function fieldIndexGetDirectionalSegments(fieldIndex: FieldIndex): IndexSegment[];
/**
 * Returns the order of the document key component for the given index.
 *
 * PORTING NOTE: This is only used in the Web IndexedDb implementation.
 */
export declare function fieldIndexGetKeyOrder(fieldIndex: FieldIndex): IndexKind;
/**
 * Compares indexes by collection group and segments. Ignores update time and
 * index ID.
 */
export declare function fieldIndexSemanticComparator(left: FieldIndex, right: FieldIndex): number;
/** Returns a debug representation of the field index */
export declare function fieldIndexToString(fieldIndex: FieldIndex): string;
/** The type of the index, e.g. for which type of query it can be used. */
export declare const enum IndexKind {
    /**
     * Ordered index. Can be used for <, <=, ==, >=, >, !=, IN and NOT IN queries.
     */
    ASCENDING = 0,
    /**
     * Ordered index. Can be used for <, <=, ==, >=, >, !=, IN and NOT IN queries.
     */
    DESCENDING = 1,
    /** Contains index. Can be used for ArrayContains and ArrayContainsAny. */
    CONTAINS = 2
}
/** An index component consisting of field path and index type.  */
export declare class IndexSegment {
    /** The field path of the component. */
    readonly fieldPath: FieldPath;
    /** The fields sorting order. */
    readonly kind: IndexKind;
    constructor(
    /** The field path of the component. */
    fieldPath: FieldPath, 
    /** The fields sorting order. */
    kind: IndexKind);
}
/**
 * Stores the "high water mark" that indicates how updated the Index is for the
 * current user.
 */
export declare class IndexState {
    /**
     * Indicates when the index was last updated (relative to other indexes).
     */
    readonly sequenceNumber: number;
    /** The the latest indexed read time, document and batch id. */
    readonly offset: IndexOffset;
    constructor(
    /**
     * Indicates when the index was last updated (relative to other indexes).
     */
    sequenceNumber: number, 
    /** The the latest indexed read time, document and batch id. */
    offset: IndexOffset);
    /** The state of an index that has not yet been backfilled. */
    static empty(): IndexState;
}
/**
 * Creates an offset that matches all documents with a read time higher than
 * `readTime`.
 */
export declare function newIndexOffsetSuccessorFromReadTime(readTime: SnapshotVersion, largestBatchId: number): IndexOffset;
/** Creates a new offset based on the provided document. */
export declare function newIndexOffsetFromDocument(document: Document): IndexOffset;
/**
 * Stores the latest read time, document and batch ID that were processed for an
 * index.
 */
export declare class IndexOffset {
    /**
     * The latest read time version that has been indexed by Firestore for this
     * field index.
     */
    readonly readTime: SnapshotVersion;
    /**
     * The key of the last document that was indexed for this query. Use
     * `DocumentKey.empty()` if no document has been indexed.
     */
    readonly documentKey: DocumentKey;
    readonly largestBatchId: number;
    constructor(
    /**
     * The latest read time version that has been indexed by Firestore for this
     * field index.
     */
    readTime: SnapshotVersion, 
    /**
     * The key of the last document that was indexed for this query. Use
     * `DocumentKey.empty()` if no document has been indexed.
     */
    documentKey: DocumentKey, largestBatchId: number);
    /** Returns an offset that sorts before all regular offsets. */
    static min(): IndexOffset;
    /** Returns an offset that sorts after all regular offsets. */
    static max(): IndexOffset;
}
export declare function indexOffsetComparator(left: IndexOffset, right: IndexOffset): number;
