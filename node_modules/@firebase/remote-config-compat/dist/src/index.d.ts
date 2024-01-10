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
import { RemoteConfig as RemoteConfigCompat } from '@firebase/remote-config-types';
declare module '@firebase/app-compat' {
    interface FirebaseNamespace {
        remoteConfig: {
            (app?: FirebaseApp): RemoteConfigCompat;
        };
    }
    interface FirebaseApp {
        remoteConfig(): RemoteConfigCompat;
    }
}

import { FirebaseApp as FirebaseAppCompat } from "@firebase/app-compat";
import { type Value, type RemoteConfig, type LogLevel } from "@firebase/remote-config";
declare module "@firebase/remote-config" {
    function activate(remoteConfig: RemoteConfigCompat): Promise<boolean>;
    function ensureInitialized(remoteConfig: RemoteConfigCompat): Promise<void>;
    function fetchAndActivate(remoteConfig: RemoteConfigCompat): Promise<boolean>;
    function fetchConfig(remoteConfig: RemoteConfigCompat): Promise<void>;
    function getAll(remoteConfig: RemoteConfigCompat): Record<string, Value>;
    function getBoolean(remoteConfig: RemoteConfigCompat, key: string): boolean;
    function getNumber(remoteConfig: RemoteConfigCompat, key: string): number;
    function getRemoteConfig(app?: FirebaseAppCompat): RemoteConfig;
    function getString(remoteConfig: RemoteConfigCompat, key: string): string;
    function getValue(remoteConfig: RemoteConfigCompat, key: string): Value;
    function setLogLevel(remoteConfig: RemoteConfigCompat, logLevel: LogLevel): void;
}
