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
export declare const enum PersistenceType {
    SESSION = "SESSION",
    LOCAL = "LOCAL",
    NONE = "NONE"
}
export declare type PersistedBlob = Record<string, unknown>;
export interface Instantiator<T> {
    (blob: PersistedBlob): T;
}
export declare type PersistenceValue = PersistedBlob | string;
export declare const STORAGE_AVAILABLE_KEY = "__sak";
export interface StorageEventListener {
    (value: PersistenceValue | null): void;
}
export interface PersistenceInternal extends Persistence {
    type: PersistenceType;
    _isAvailable(): Promise<boolean>;
    _set(key: string, value: PersistenceValue): Promise<void>;
    _get<T extends PersistenceValue>(key: string): Promise<T | null>;
    _remove(key: string): Promise<void>;
    _addListener(key: string, listener: StorageEventListener): void;
    _removeListener(key: string, listener: StorageEventListener): void;
    _shouldAllowMigration?: boolean;
}
