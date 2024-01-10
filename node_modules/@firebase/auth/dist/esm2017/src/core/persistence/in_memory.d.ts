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
import { PersistenceInternal, PersistenceType, PersistenceValue, StorageEventListener } from '../persistence';
export declare class InMemoryPersistence implements PersistenceInternal {
    static type: 'NONE';
    readonly type = PersistenceType.NONE;
    storage: Record<string, PersistenceValue>;
    _isAvailable(): Promise<boolean>;
    _set(key: string, value: PersistenceValue): Promise<void>;
    _get<T extends PersistenceValue>(key: string): Promise<T | null>;
    _remove(key: string): Promise<void>;
    _addListener(_key: string, _listener: StorageEventListener): void;
    _removeListener(_key: string, _listener: StorageEventListener): void;
}
/**
 * An implementation of {@link Persistence} of type 'NONE'.
 *
 * @public
 */
export declare const inMemoryPersistence: Persistence;
