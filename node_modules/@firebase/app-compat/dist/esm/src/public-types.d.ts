/**
 * @license
 * Copyright 2021 Google LLC
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
import { LogCallback, LogLevelString, LogOptions } from '@firebase/logger';
import { _FirebaseApp } from './firebaseApp';
export interface FirebaseOptions {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
}
export interface FirebaseAppConfig {
    name?: string;
    automaticDataCollectionEnabled?: boolean;
}
interface FirebaseAppContructor {
    new (): FirebaseApp;
}
/**
 * This interface will be enhanced by other products by adding e.g. firestore(), messaging() methods.
 * As a result, FirebaseAppImpl can't directly implement it, otherwise there will be typings errors:
 *
 * For example, "Class 'FirebaseAppImpl' incorrectly implements interface 'FirebaseApp'.
 * Property 'installations' is missing in type 'FirebaseAppImpl' but required in type 'FirebaseApp'"
 *
 * To workaround this issue, we defined a _FirebaseApp interface which is implemented by FirebaseAppImpl
 * and let FirebaseApp extends it.
 */
export interface FirebaseApp extends _FirebaseApp {
}
export interface FirebaseNamespace {
    /**
     * Create (and initialize) a FirebaseApp.
     *
     * @param options Options to configure the services used in the App.
     * @param config The optional config for your firebase app
     */
    initializeApp(options: FirebaseOptions, config?: FirebaseAppConfig): FirebaseApp;
    /**
     * Create (and initialize) a FirebaseApp.
     *
     * @param options Options to configure the services used in the App.
     * @param name The optional name of the app to initialize ('[DEFAULT]' if
     * omitted)
     */
    initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
    app: {
        /**
         * Retrieve an instance of a FirebaseApp.
         *
         * Usage: firebase.app()
         *
         * @param name The optional name of the app to return ('[DEFAULT]' if omitted)
         */
        (name?: string): FirebaseApp;
        /**
         * For testing FirebaseApp instances:
         *  app() instanceof firebase.app.App
         *
         * DO NOT call this constuctor directly (use firebase.app() instead).
         */
        App: FirebaseAppContructor;
    };
    /**
     * A (read-only) array of all the initialized Apps.
     */
    apps: FirebaseApp[];
    /**
     * Registers a library's name and version for platform logging purposes.
     * @param library Name of 1p or 3p library (e.g. firestore, angularfire)
     * @param version Current version of that library.
     */
    registerVersion(library: string, version: string, variant?: string): void;
    setLogLevel(logLevel: LogLevelString): void;
    onLog(logCallback: LogCallback, options?: LogOptions): void;
    SDK_VERSION: string;
}
declare module '@firebase/component' {
    interface NameServiceMapping {
        'app-compat': FirebaseApp;
    }
}
export {};
