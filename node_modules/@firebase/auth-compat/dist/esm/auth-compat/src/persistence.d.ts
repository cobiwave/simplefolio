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
import * as exp from '@firebase/auth/internal';
export declare const Persistence: {
    LOCAL: string;
    NONE: string;
    SESSION: string;
};
/**
 * Validates that an argument is a valid persistence value. If an invalid type
 * is specified, an error is thrown synchronously.
 */
export declare function _validatePersistenceArgument(auth: exp.Auth, persistence: string): void;
export declare function _savePersistenceForRedirect(auth: exp.AuthInternal): Promise<void>;
export declare function _getPersistencesFromRedirect(apiKey: string, appName: string): exp.Persistence[];
