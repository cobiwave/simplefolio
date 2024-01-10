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
import { FieldIndex } from '../model/field_index';
import { Firestore } from './database';
export { connectFirestoreEmulator, EmulatorMockTokenOptions } from '../lite-api/database';
/**
 * A single field element in an index configuration.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
export interface IndexField {
    /** The field path to index. */
    readonly fieldPath: string;
    /**
     * What type of array index to create. Set to `CONTAINS` for `array-contains`
     * and `array-contains-any` indexes.
     *
     * Only one of `arrayConfig` or `order` should be set;
     */
    readonly arrayConfig?: 'CONTAINS';
    /**
     * What type of array index to create. Set to `ASCENDING` or 'DESCENDING` for
     * `==`, `!=`, `<=`, `<=`, `in` and `not-in` filters.
     *
     * Only one of `arrayConfig` or `order` should be set.
     */
    readonly order?: 'ASCENDING' | 'DESCENDING';
    [key: string]: unknown;
}
/**
 * The SDK definition of a Firestore index.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
export interface Index {
    /** The ID of the collection to index. */
    readonly collectionGroup: string;
    /** A list of fields to index. */
    readonly fields?: IndexField[];
    [key: string]: unknown;
}
/**
 * A list of Firestore indexes to speed up local query execution.
 *
 * See {@link https://firebase.google.com/docs/reference/firestore/indexes/#json_format | JSON Format}
 * for a description of the format of the index definition.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
export interface IndexConfiguration {
    /** A list of all Firestore indexes. */
    readonly indexes?: Index[];
    [key: string]: unknown;
}
/**
 * Configures indexing for local query execution. Any previous index
 * configuration is overridden. The `Promise` resolves once the index
 * configuration has been persisted.
 *
 * The index entries themselves are created asynchronously. You can continue to
 * use queries that require indexing even if the indices are not yet available.
 * Query execution will automatically start using the index once the index
 * entries have been written.
 *
 * Indexes are only supported with IndexedDb persistence. If IndexedDb is not
 * enabled, any index configuration is ignored.
 *
 * @param firestore - The {@link Firestore} instance to configure indexes for.
 * @param configuration -The index definition.
 * @throws FirestoreError if the JSON format is invalid.
 * @returns A `Promise` that resolves once all indices are successfully
 * configured.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
export declare function setIndexConfiguration(firestore: Firestore, configuration: IndexConfiguration): Promise<void>;
/**
 * Configures indexing for local query execution. Any previous index
 * configuration is overridden. The `Promise` resolves once the index
 * configuration has been persisted.
 *
 * The index entries themselves are created asynchronously. You can continue to
 * use queries that require indexing even if the indices are not yet available.
 * Query execution will automatically start using the index once the index
 * entries have been written.
 *
 * Indexes are only supported with IndexedDb persistence. Invoke either
 * `enableIndexedDbPersistence()` or `enableMultiTabIndexedDbPersistence()`
 * before setting an index configuration. If IndexedDb is not enabled, any
 * index configuration is ignored.
 *
 * The method accepts the JSON format exported by the Firebase CLI (`firebase
 * firestore:indexes`). If the JSON format is invalid, this method throws an
 * error.
 *
 * @param firestore - The {@link Firestore} instance to configure indexes for.
 * @param json -The JSON format exported by the Firebase CLI.
 * @throws FirestoreError if the JSON format is invalid.
 * @returns A `Promise` that resolves once all indices are successfully
 * configured.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
export declare function setIndexConfiguration(firestore: Firestore, json: string): Promise<void>;
export declare function parseIndexes(jsonOrConfiguration: string | IndexConfiguration): FieldIndex[];
