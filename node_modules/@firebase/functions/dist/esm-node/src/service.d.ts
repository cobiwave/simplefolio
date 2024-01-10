/**
 * @license
 * Copyright 2017 Google LLC
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
import { FirebaseApp, _FirebaseService } from '@firebase/app';
import { HttpsCallable, HttpsCallableOptions } from './public-types';
import { ContextProvider } from './context';
import { Provider } from '@firebase/component';
import { FirebaseAuthInternalName } from '@firebase/auth-interop-types';
import { MessagingInternalComponentName } from '@firebase/messaging-interop-types';
import { AppCheckInternalComponentName } from '@firebase/app-check-interop-types';
export declare const DEFAULT_REGION = "us-central1";
/**
 * Describes the shape of the HttpResponse body.
 * It makes functions that would otherwise take {} able to access the
 * possible elements in the body more easily
 */
export interface HttpResponseBody {
    data?: unknown;
    result?: unknown;
    error?: {
        message?: unknown;
        status?: unknown;
        details?: unknown;
    };
}
/**
 * The main class for the Firebase Functions SDK.
 * @internal
 */
export declare class FunctionsService implements _FirebaseService {
    readonly app: FirebaseApp;
    readonly fetchImpl: typeof fetch;
    readonly contextProvider: ContextProvider;
    emulatorOrigin: string | null;
    cancelAllRequests: Promise<void>;
    deleteService: () => Promise<void>;
    region: string;
    customDomain: string | null;
    /**
     * Creates a new Functions service for the given app.
     * @param app - The FirebaseApp to use.
     */
    constructor(app: FirebaseApp, authProvider: Provider<FirebaseAuthInternalName>, messagingProvider: Provider<MessagingInternalComponentName>, appCheckProvider: Provider<AppCheckInternalComponentName>, regionOrCustomDomain: string | undefined, fetchImpl: typeof fetch);
    _delete(): Promise<void>;
    /**
     * Returns the URL for a callable with the given name.
     * @param name - The name of the callable.
     * @internal
     */
    _url(name: string): string;
}
/**
 * Modify this instance to communicate with the Cloud Functions emulator.
 *
 * Note: this must be called before this instance has been used to do any operations.
 *
 * @param host The emulator host (ex: localhost)
 * @param port The emulator port (ex: 5001)
 * @public
 */
export declare function connectFunctionsEmulator(functionsInstance: FunctionsService, host: string, port: number): void;
/**
 * Returns a reference to the callable https trigger with the given name.
 * @param name - The name of the trigger.
 * @public
 */
export declare function httpsCallable<RequestData, ResponseData>(functionsInstance: FunctionsService, name: string, options?: HttpsCallableOptions): HttpsCallable<RequestData, ResponseData>;
/**
 * Returns a reference to the callable https trigger with the given url.
 * @param url - The url of the trigger.
 * @public
 */
export declare function httpsCallableFromURL<RequestData, ResponseData>(functionsInstance: FunctionsService, url: string, options?: HttpsCallableOptions): HttpsCallable<RequestData, ResponseData>;
