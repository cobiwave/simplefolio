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
import { EmulatorMockTokenOptions } from '@firebase/util';
import { CredentialsProvider } from '../api/credentials';
import { User } from '../auth/user';
import { DatabaseId } from '../core/database_info';
import { FirestoreService } from './components';
import { FirestoreSettingsImpl, PrivateSettings, FirestoreSettings } from './settings';
export { EmulatorMockTokenOptions } from '@firebase/util';
declare module '@firebase/component' {
    interface NameServiceMapping {
        'firestore/lite': Firestore;
    }
}
/**
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */
export declare class Firestore implements FirestoreService {
    _authCredentials: CredentialsProvider<User>;
    _appCheckCredentials: CredentialsProvider<string>;
    readonly _databaseId: DatabaseId;
    readonly _app?: FirebaseApp | undefined;
    /**
     * Whether it's a Firestore or Firestore Lite instance.
     */
    type: 'firestore-lite' | 'firestore';
    readonly _persistenceKey: string;
    private _settings;
    private _settingsFrozen;
    private _terminateTask?;
    /** @hideconstructor */
    constructor(_authCredentials: CredentialsProvider<User>, _appCheckCredentials: CredentialsProvider<string>, _databaseId: DatabaseId, _app?: FirebaseApp | undefined);
    /**
     * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
     * instance.
     */
    get app(): FirebaseApp;
    get _initialized(): boolean;
    get _terminated(): boolean;
    _setSettings(settings: PrivateSettings): void;
    _getSettings(): FirestoreSettingsImpl;
    _freezeSettings(): FirestoreSettingsImpl;
    _delete(): Promise<void>;
    /** Returns a JSON-serializable representation of this `Firestore` instance. */
    toJSON(): object;
    /**
     * Terminates all components used by this client. Subclasses can override
     * this method to clean up their own dependencies, but must also call this
     * method.
     *
     * Only ever called once.
     */
    protected _terminate(): Promise<void>;
}
/**
 * Initializes a new instance of Cloud Firestore with the provided settings.
 * Can only be called before any other functions, including
 * {@link (getFirestore:1)}. If the custom settings are empty, this function is
 * equivalent to calling {@link (getFirestore:1)}.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} with which the `Firestore` instance will
 * be associated.
 * @param settings - A settings object to configure the `Firestore` instance.
 * @returns A newly initialized `Firestore` instance.
 */
export declare function initializeFirestore(app: FirebaseApp, settings: FirestoreSettings): Firestore;
/**
 * Initializes a new instance of Cloud Firestore with the provided settings.
 * Can only be called before any other functions, including
 * {@link (getFirestore:1)}. If the custom settings are empty, this function is
 * equivalent to calling {@link (getFirestore:1)}.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} with which the `Firestore` instance will
 * be associated.
 * @param settings - A settings object to configure the `Firestore` instance.
 * @param databaseId - The name of the database.
 * @returns A newly initialized `Firestore` instance.
 * @beta
 */
export declare function initializeFirestore(app: FirebaseApp, settings: FirestoreSettings, databaseId?: string): Firestore;
/**
 * Returns the existing default {@link Firestore} instance that is associated with the
 * default {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @returns The {@link Firestore} instance of the provided app.
 */
export declare function getFirestore(): Firestore;
/**
 * Returns the existing default {@link Firestore} instance that is associated with the
 * provided {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned {@link Firestore}
 * instance is associated with.
 * @returns The {@link Firestore} instance of the provided app.
 */
export declare function getFirestore(app: FirebaseApp): Firestore;
/**
 * Returns the existing {@link Firestore} instance that is associated with the
 * default {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param databaseId - The name of the database.
 * @returns The {@link Firestore} instance of the provided app.
 * @beta
 */
export declare function getFirestore(databaseId: string): Firestore;
/**
 * Returns the existing {@link Firestore} instance that is associated with the
 * provided {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned {@link Firestore}
 * instance is associated with.
 * @param databaseId - The name of the database.
 * @returns The {@link Firestore} instance of the provided app.
 * @beta
 */
export declare function getFirestore(app: FirebaseApp, databaseId: string): Firestore;
/**
 * Modify this instance to communicate with the Cloud Firestore emulator.
 *
 * Note: This must be called before this instance has been used to do any
 * operations.
 *
 * @param firestore - The `Firestore` instance to configure to connect to the
 * emulator.
 * @param host - the emulator host (ex: localhost).
 * @param port - the emulator port (ex: 9000).
 * @param options.mockUserToken - the mock auth token to use for unit testing
 * Security Rules.
 */
export declare function connectFirestoreEmulator(firestore: Firestore, host: string, port: number, options?: {
    mockUserToken?: EmulatorMockTokenOptions | string;
}): void;
/**
 * Terminates the provided `Firestore` instance.
 *
 * After calling `terminate()` only the `clearIndexedDbPersistence()` functions
 * may be used. Any other function will throw a `FirestoreError`. Termination
 * does not cancel any pending writes, and any promises that are awaiting a
 * response from the server will not be resolved.
 *
 * To restart after termination, create a new instance of `Firestore` with
 * {@link (getFirestore:1)}.
 *
 * Note: Under normal circumstances, calling `terminate()` is not required. This
 * function is useful only when you want to force this instance to release all of
 * its resources or in combination with {@link clearIndexedDbPersistence} to
 * ensure that all local state is destroyed between test runs.
 *
 * @param firestore - The `Firestore` instance to terminate.
 * @returns A `Promise` that is resolved when the instance has been successfully
 * terminated.
 */
export declare function terminate(firestore: Firestore): Promise<void>;
