/**
 * @license
 * Copyright 2019 Google LLC
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
import { Target } from '../core/target';
import { DocumentMap } from '../model/collections';
import { DocumentKey } from '../model/document_key';
import { FieldIndex, IndexOffset } from '../model/field_index';
import { ResourcePath } from '../model/path';
import { PersistencePromise } from './persistence_promise';
import { PersistenceTransaction } from './persistence_transaction';
/** Represents the index state as it relates to a particular target. */
export declare const enum IndexType {
    /** Indicates that no index could be found for serving the target. */
    NONE = 0,
    /**
     * Indicates that only a "partial index" could be found for serving the
     * target. A partial index is one which does not have a segment for every
     * filter/orderBy in the target.
     */
    PARTIAL = 1,
    /**
     * Indicates that a "full index" could be found for serving the target. A full
     * index is one which has a segment for every filter/orderBy in the target.
     */
    FULL = 2
}
export declare function displayNameForIndexType(indexType: IndexType): string;
/**
 * Represents a set of indexes that are used to execute queries efficiently.
 *
 * Currently the only index is a [collection id] =&gt; [parent path] index, used
 * to execute Collection Group queries.
 */
export interface IndexManager {
    /**
     * Creates an index entry mapping the collectionId (last segment of the path)
     * to the parent path (either the containing document location or the empty
     * path for root-level collections). Index entries can be retrieved via
     * getCollectionParents().
     *
     * NOTE: Currently we don't remove index entries. If this ends up being an
     * issue we can devise some sort of GC strategy.
     */
    addToCollectionParentIndex(transaction: PersistenceTransaction, collectionPath: ResourcePath): PersistencePromise<void>;
    /**
     * Retrieves all parent locations containing the given collectionId, as a
     * list of paths (each path being either a document location or the empty
     * path for a root-level collection).
     */
    getCollectionParents(transaction: PersistenceTransaction, collectionId: string): PersistencePromise<ResourcePath[]>;
    /**
     * Adds a field path index.
     *
     * Values for this index are persisted via the index backfill, which runs
     * asynchronously in the background. Once the first values are written,
     * an index can be used to serve partial results for any matching queries.
     * Any unindexed portion of the database will continue to be served via
     * collection scons.
     */
    addFieldIndex(transaction: PersistenceTransaction, index: FieldIndex): PersistencePromise<void>;
    /** Removes the given field index and deletes all index values. */
    deleteFieldIndex(transaction: PersistenceTransaction, index: FieldIndex): PersistencePromise<void>;
    /** Removes all field indexes and deletes all index values. */
    deleteAllFieldIndexes(transaction: PersistenceTransaction): PersistencePromise<void>;
    /** Creates a full matched field index which serves the given target. */
    createTargetIndexes(transaction: PersistenceTransaction, target: Target): PersistencePromise<void>;
    /**
     * Returns a list of field indexes that correspond to the specified collection
     * group.
     *
     * @param collectionGroup The collection group to get matching field indexes
     * for.
     * @return A collection of field indexes for the specified collection group.
     */
    getFieldIndexes(transaction: PersistenceTransaction, collectionGroup: string): PersistencePromise<FieldIndex[]>;
    /** Returns all configured field indexes. */
    getFieldIndexes(transaction: PersistenceTransaction): PersistencePromise<FieldIndex[]>;
    /**
     * Returns the type of index (if any) that can be used to serve the given
     * target.
     */
    getIndexType(transaction: PersistenceTransaction, target: Target): PersistencePromise<IndexType>;
    /**
     * Returns the documents that match the given target based on the provided
     * index or `null` if the target does not have a matching index.
     */
    getDocumentsMatchingTarget(transaction: PersistenceTransaction, target: Target): PersistencePromise<DocumentKey[] | null>;
    /**
     * Returns the next collection group to update. Returns `null` if no group
     * exists.
     */
    getNextCollectionGroupToUpdate(transaction: PersistenceTransaction): PersistencePromise<string | null>;
    /**
     * Sets the collection group's latest read time.
     *
     * This method updates the index offset for all field indices for the
     * collection group and increments their sequence number. Subsequent calls to
     * `getNextCollectionGroupToUpdate()` will return a different collection group
     * (unless only one collection group is configured).
     */
    updateCollectionGroup(transaction: PersistenceTransaction, collectionGroup: string, offset: IndexOffset): PersistencePromise<void>;
    /** Updates the index entries for the provided documents. */
    updateIndexEntries(transaction: PersistenceTransaction, documents: DocumentMap): PersistencePromise<void>;
    /**
     * Iterates over all field indexes that are used to serve the given target,
     * and returns the minimum offset of them all.
     */
    getMinOffset(transaction: PersistenceTransaction, target: Target): PersistencePromise<IndexOffset>;
    /** Returns the minimum offset for the given collection group. */
    getMinOffsetFromCollectionGroup(transaction: PersistenceTransaction, collectionGroup: string): PersistencePromise<IndexOffset>;
}
