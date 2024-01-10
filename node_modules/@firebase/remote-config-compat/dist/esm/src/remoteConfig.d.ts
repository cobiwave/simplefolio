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
import { FirebaseApp, _FirebaseService } from '@firebase/app-compat';
import { Value as ValueCompat, FetchStatus as FetchSTatusCompat, Settings as SettingsCompat, LogLevel as RemoteConfigLogLevel, RemoteConfig as RemoteConfigCompat } from '@firebase/remote-config-types';
import { RemoteConfig, isSupported } from '@firebase/remote-config';
export { isSupported };
export declare class RemoteConfigCompatImpl implements RemoteConfigCompat, _FirebaseService {
    app: FirebaseApp;
    readonly _delegate: RemoteConfig;
    constructor(app: FirebaseApp, _delegate: RemoteConfig);
    get defaultConfig(): {
        [key: string]: string | number | boolean;
    };
    set defaultConfig(value: {
        [key: string]: string | number | boolean;
    });
    get fetchTimeMillis(): number;
    get lastFetchStatus(): FetchSTatusCompat;
    get settings(): SettingsCompat;
    set settings(value: SettingsCompat);
    activate(): Promise<boolean>;
    ensureInitialized(): Promise<void>;
    /**
     * @throws a {@link ErrorCode.FETCH_CLIENT_TIMEOUT} if the request takes longer than
     * {@link Settings.fetchTimeoutInSeconds} or
     * {@link DEFAULT_FETCH_TIMEOUT_SECONDS}.
     */
    fetch(): Promise<void>;
    fetchAndActivate(): Promise<boolean>;
    getAll(): {
        [key: string]: ValueCompat;
    };
    getBoolean(key: string): boolean;
    getNumber(key: string): number;
    getString(key: string): string;
    getValue(key: string): ValueCompat;
    setLogLevel(logLevel: RemoteConfigLogLevel): void;
}
