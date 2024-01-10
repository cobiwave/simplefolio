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
import { FirebaseApp } from '@firebase/app';
import { Functions, HttpsCallableOptions, HttpsCallable } from './public-types';
export * from './public-types';
/**
 * Returns a {@link Functions} instance for the given app.
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @param regionOrCustomDomain - one of:
 *   a) The region the callable functions are located in (ex: us-central1)
 *   b) A custom domain hosting the callable functions (ex: https://mydomain.com)
 * @public
 */
export declare function getFunctions(app?: FirebaseApp, regionOrCustomDomain?: string): Functions;
/**
 * Modify this instance to communicate with the Cloud Functions emulator.
 *
 * Note: this must be called before this instance has been used to do any operations.
 *
 * @param host - The emulator host (ex: localhost)
 * @param port - The emulator port (ex: 5001)
 * @public
 */
export declare function connectFunctionsEmulator(functionsInstance: Functions, host: string, port: number): void;
/**
 * Returns a reference to the callable HTTPS trigger with the given name.
 * @param name - The name of the trigger.
 * @public
 */
export declare function httpsCallable<RequestData = unknown, ResponseData = unknown>(functionsInstance: Functions, name: string, options?: HttpsCallableOptions): HttpsCallable<RequestData, ResponseData>;
/**
 * Returns a reference to the callable HTTPS trigger with the specified url.
 * @param url - The url of the trigger.
 * @public
 */
export declare function httpsCallableFromURL<RequestData = unknown, ResponseData = unknown>(functionsInstance: Functions, url: string, options?: HttpsCallableOptions): HttpsCallable<RequestData, ResponseData>;
