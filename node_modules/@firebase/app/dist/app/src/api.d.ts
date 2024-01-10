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
import { FirebaseApp, FirebaseOptions, FirebaseAppSettings } from './public-types';
import { LogLevelString, LogCallback, LogOptions } from '@firebase/logger';
export { FirebaseError } from '@firebase/util';
/**
 * The current SDK version.
 *
 * @public
 */
export declare const SDK_VERSION: string;
/**
 * Creates and initializes a {@link @firebase/app#FirebaseApp} instance.
 *
 * See
 * {@link
 *   https://firebase.google.com/docs/web/setup#add_firebase_to_your_app
 *   | Add Firebase to your app} and
 * {@link
 *   https://firebase.google.com/docs/web/setup#multiple-projects
 *   | Initialize multiple projects} for detailed documentation.
 *
 * @example
 * ```javascript
 *
 * // Initialize default app
 * // Retrieve your own options values by adding a web app on
 * // https://console.firebase.google.com
 * initializeApp({
 *   apiKey: "AIza....",                             // Auth / General Use
 *   authDomain: "YOUR_APP.firebaseapp.com",         // Auth with popup/redirect
 *   databaseURL: "https://YOUR_APP.firebaseio.com", // Realtime Database
 *   storageBucket: "YOUR_APP.appspot.com",          // Storage
 *   messagingSenderId: "123456789"                  // Cloud Messaging
 * });
 * ```
 *
 * @example
 * ```javascript
 *
 * // Initialize another app
 * const otherApp = initializeApp({
 *   databaseURL: "https://<OTHER_DATABASE_NAME>.firebaseio.com",
 *   storageBucket: "<OTHER_STORAGE_BUCKET>.appspot.com"
 * }, "otherApp");
 * ```
 *
 * @param options - Options to configure the app's services.
 * @param name - Optional name of the app to initialize. If no name
 *   is provided, the default is `"[DEFAULT]"`.
 *
 * @returns The initialized app.
 *
 * @public
 */
export declare function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
/**
 * Creates and initializes a FirebaseApp instance.
 *
 * @param options - Options to configure the app's services.
 * @param config - FirebaseApp Configuration
 *
 * @public
 */
export declare function initializeApp(options: FirebaseOptions, config?: FirebaseAppSettings): FirebaseApp;
/**
 * Creates and initializes a FirebaseApp instance.
 *
 * @public
 */
export declare function initializeApp(): FirebaseApp;
/**
 * Retrieves a {@link @firebase/app#FirebaseApp} instance.
 *
 * When called with no arguments, the default app is returned. When an app name
 * is provided, the app corresponding to that name is returned.
 *
 * An exception is thrown if the app being retrieved has not yet been
 * initialized.
 *
 * @example
 * ```javascript
 * // Return the default app
 * const app = getApp();
 * ```
 *
 * @example
 * ```javascript
 * // Return a named app
 * const otherApp = getApp("otherApp");
 * ```
 *
 * @param name - Optional name of the app to return. If no name is
 *   provided, the default is `"[DEFAULT]"`.
 *
 * @returns The app corresponding to the provided app name.
 *   If no app name is provided, the default app is returned.
 *
 * @public
 */
export declare function getApp(name?: string): FirebaseApp;
/**
 * A (read-only) array of all initialized apps.
 * @public
 */
export declare function getApps(): FirebaseApp[];
/**
 * Renders this app unusable and frees the resources of all associated
 * services.
 *
 * @example
 * ```javascript
 * deleteApp(app)
 *   .then(function() {
 *     console.log("App deleted successfully");
 *   })
 *   .catch(function(error) {
 *     console.log("Error deleting app:", error);
 *   });
 * ```
 *
 * @public
 */
export declare function deleteApp(app: FirebaseApp): Promise<void>;
/**
 * Registers a library's name and version for platform logging purposes.
 * @param library - Name of 1p or 3p library (e.g. firestore, angularfire)
 * @param version - Current version of that library.
 * @param variant - Bundle variant, e.g., node, rn, etc.
 *
 * @public
 */
export declare function registerVersion(libraryKeyOrName: string, version: string, variant?: string): void;
/**
 * Sets log handler for all Firebase SDKs.
 * @param logCallback - An optional custom log handler that executes user code whenever
 * the Firebase SDK makes a logging call.
 *
 * @public
 */
export declare function onLog(logCallback: LogCallback | null, options?: LogOptions): void;
/**
 * Sets log level for all Firebase SDKs.
 *
 * All of the log types above the current log level are captured (i.e. if
 * you set the log level to `info`, errors are logged, but `debug` and
 * `verbose` logs are not).
 *
 * @public
 */
export declare function setLogLevel(logLevel: LogLevelString): void;
