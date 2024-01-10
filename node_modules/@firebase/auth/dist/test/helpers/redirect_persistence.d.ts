/**
 * @license
 * Copyright 2020 Google LLC
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
import { PersistenceValue } from '../../src/core/persistence';
import { InMemoryPersistence } from '../../src/core/persistence/in_memory';
/** Helper class for handling redirect persistence */
export declare class RedirectPersistence extends InMemoryPersistence {
    hasPendingRedirect: boolean;
    redirectUser: object | null;
    _get<T extends PersistenceValue>(key: string): Promise<T | null>;
}
