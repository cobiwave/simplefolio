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
import { FirebaseApp } from '@firebase/app';
import { RemoteConfig as RemoteConfigType, FetchStatus, RemoteConfigSettings } from './public_types';
import { StorageCache } from './storage/storage_cache';
import { RemoteConfigFetchClient } from './client/remote_config_fetch_client';
import { Storage } from './storage/storage';
import { Logger } from '@firebase/logger';
/**
 * Encapsulates business logic mapping network and storage dependencies to the public SDK API.
 *
 * See {@link https://github.com/FirebasePrivate/firebase-js-sdk/blob/master/packages/firebase/index.d.ts|interface documentation} for method descriptions.
 */
export declare class RemoteConfig implements RemoteConfigType {
    readonly app: FirebaseApp;
    /**
     * @internal
     */
    readonly _client: RemoteConfigFetchClient;
    /**
     * @internal
     */
    readonly _storageCache: StorageCache;
    /**
     * @internal
     */
    readonly _storage: Storage;
    /**
     * @internal
     */
    readonly _logger: Logger;
    /**
     * Tracks completion of initialization promise.
     * @internal
     */
    _isInitializationComplete: boolean;
    /**
     * De-duplicates initialization calls.
     * @internal
     */
    _initializePromise?: Promise<void>;
    settings: RemoteConfigSettings;
    defaultConfig: {
        [key: string]: string | number | boolean;
    };
    get fetchTimeMillis(): number;
    get lastFetchStatus(): FetchStatus;
    constructor(app: FirebaseApp, 
    /**
     * @internal
     */
    _client: RemoteConfigFetchClient, 
    /**
     * @internal
     */
    _storageCache: StorageCache, 
    /**
     * @internal
     */
    _storage: Storage, 
    /**
     * @internal
     */
    _logger: Logger);
}
