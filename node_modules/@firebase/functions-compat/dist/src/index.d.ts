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
import * as types from '@firebase/functions-types';
declare module '@firebase/app-compat' {
    interface FirebaseNamespace {
        functions: {
            (app?: FirebaseApp): types.FirebaseFunctions;
            Functions: typeof types.FirebaseFunctions;
        };
    }
    interface FirebaseApp {
        functions(regionOrCustomDomain?: string): types.FirebaseFunctions;
    }
}

import { FirebaseApp as FirebaseAppCompat } from "@firebase/app-compat";
import { type Functions, type HttpsCallableOptions, type HttpsCallable } from "@firebase/functions";
declare module "@firebase/functions" {
    function connectFunctionsEmulator(functionsInstance: types.FirebaseFunctions, host: string, port: number): void;
    function getFunctions(app?: FirebaseAppCompat, regionOrCustomDomain?: string): Functions;
    function httpsCallable<RequestData = unknown, ResponseData = unknown>(functionsInstance: types.FirebaseFunctions, name: string, options?: HttpsCallableOptions): HttpsCallable<RequestData, ResponseData>;
    function httpsCallableFromURL<RequestData = unknown, ResponseData = unknown>(functionsInstance: types.FirebaseFunctions, url: string, options?: HttpsCallableOptions): HttpsCallable<RequestData, ResponseData>;
}
