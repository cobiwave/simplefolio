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
import { FirebaseFunctions, HttpsCallable } from '@firebase/functions-types';
import { HttpsCallableOptions, Functions as FunctionsServiceExp } from '@firebase/functions';
import { FirebaseApp, _FirebaseService } from '@firebase/app-compat';
export declare class FunctionsService implements FirebaseFunctions, _FirebaseService {
    app: FirebaseApp;
    readonly _delegate: FunctionsServiceExp;
    /**
     * For testing.
     * @internal
     */
    _region: string;
    /**
     * For testing.
     * @internal
     */
    _customDomain: string | null;
    constructor(app: FirebaseApp, _delegate: FunctionsServiceExp);
    httpsCallable(name: string, options?: HttpsCallableOptions): HttpsCallable;
    httpsCallableFromURL(url: string, options?: HttpsCallableOptions): HttpsCallable;
    /**
     * Deprecated in pre-modularized repo, does not exist in modularized
     * functions package, need to convert to "host" and "port" args that
     * `useFunctionsEmulatorExp` takes.
     * @deprecated
     */
    useFunctionsEmulator(origin: string): void;
    useEmulator(host: string, port: number): void;
}
