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
import { Persistence } from '../../model/public_types';
import { PersistenceValue } from '../../core/persistence/';
export declare const DB_NAME = "firebaseLocalStorageDb";
export declare function _clearDatabase(db: IDBDatabase): Promise<void>;
export declare function _deleteDatabase(): Promise<void>;
export declare function _openDatabase(): Promise<IDBDatabase>;
export declare function _putObject(db: IDBDatabase, key: string, value: PersistenceValue | string): Promise<void>;
export declare function _deleteObject(db: IDBDatabase, key: string): Promise<void>;
export declare const _POLLING_INTERVAL_MS = 800;
export declare const _TRANSACTION_RETRY_COUNT = 3;
/**
 * An implementation of {@link Persistence} of type `LOCAL` using `indexedDB`
 * for the underlying storage.
 *
 * @public
 */
export declare const indexedDBLocalPersistence: Persistence;
