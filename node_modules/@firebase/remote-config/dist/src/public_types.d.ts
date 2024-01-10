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
/**
 * The Firebase Remote Config service interface.
 *
 * @public
 */
export interface RemoteConfig {
    /**
     * The {@link @firebase/app#FirebaseApp} this `RemoteConfig` instance is associated with.
     */
    app: FirebaseApp;
    /**
     * Defines configuration for the Remote Config SDK.
     */
    settings: RemoteConfigSettings;
    /**
     * Object containing default values for configs.
     */
    defaultConfig: {
        [key: string]: string | number | boolean;
    };
    /**
     * The Unix timestamp in milliseconds of the last <i>successful</i> fetch, or negative one if
     * the {@link RemoteConfig} instance either hasn't fetched or initialization
     * is incomplete.
     */
    fetchTimeMillis: number;
    /**
     * The status of the last fetch <i>attempt</i>.
     */
    lastFetchStatus: FetchStatus;
}
/**
 * Indicates the source of a value.
 *
 * <ul>
 *   <li>"static" indicates the value was defined by a static constant.</li>
 *   <li>"default" indicates the value was defined by default config.</li>
 *   <li>"remote" indicates the value was defined by fetched config.</li>
 * </ul>
 *
 * @public
 */
export declare type ValueSource = 'static' | 'default' | 'remote';
/**
 * Wraps a value with metadata and type-safe getters.
 *
 * @public
 */
export interface Value {
    /**
     * Gets the value as a boolean.
     *
     * The following values (case insensitive) are interpreted as true:
     * "1", "true", "t", "yes", "y", "on". Other values are interpreted as false.
     */
    asBoolean(): boolean;
    /**
     * Gets the value as a number. Comparable to calling <code>Number(value) || 0</code>.
     */
    asNumber(): number;
    /**
     * Gets the value as a string.
     */
    asString(): string;
    /**
     * Gets the {@link ValueSource} for the given key.
     */
    getSource(): ValueSource;
}
/**
 * Defines configuration options for the Remote Config SDK.
 *
 * @public
 */
export interface RemoteConfigSettings {
    /**
     * Defines the maximum age in milliseconds of an entry in the config cache before
     * it is considered stale. Defaults to 43200000 (Twelve hours).
     */
    minimumFetchIntervalMillis: number;
    /**
     * Defines the maximum amount of milliseconds to wait for a response when fetching
     * configuration from the Remote Config server. Defaults to 60000 (One minute).
     */
    fetchTimeoutMillis: number;
}
/**
 * Summarizes the outcome of the last attempt to fetch config from the Firebase Remote Config server.
 *
 * <ul>
 *   <li>"no-fetch-yet" indicates the {@link RemoteConfig} instance has not yet attempted
 *       to fetch config, or that SDK initialization is incomplete.</li>
 *   <li>"success" indicates the last attempt succeeded.</li>
 *   <li>"failure" indicates the last attempt failed.</li>
 *   <li>"throttle" indicates the last attempt was rate-limited.</li>
 * </ul>
 *
 * @public
 */
export declare type FetchStatus = 'no-fetch-yet' | 'success' | 'failure' | 'throttle';
/**
 * Defines levels of Remote Config logging.
 *
 * @public
 */
export declare type LogLevel = 'debug' | 'error' | 'silent';
declare module '@firebase/component' {
    interface NameServiceMapping {
        'remote-config': RemoteConfig;
    }
}
