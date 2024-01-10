/**
 * Firebase Remote Config
 *
 * @packageDocumentation
 */

import { FirebaseApp } from '@firebase/app';

/**
 * Makes the last fetched config available to the getters.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @returns A `Promise` which resolves to true if the current call activated the fetched configs.
 * If the fetched configs were already activated, the `Promise` will resolve to false.
 *
 * @public
 */
export declare function activate(remoteConfig: RemoteConfig): Promise<boolean>;

/**
 * Ensures the last activated config are available to the getters.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 *
 * @returns A `Promise` that resolves when the last activated config is available to the getters.
 * @public
 */
export declare function ensureInitialized(remoteConfig: RemoteConfig): Promise<void>;

/**
 *
 * Performs fetch and activate operations, as a convenience.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 *
 * @returns A `Promise` which resolves to true if the current call activated the fetched configs.
 * If the fetched configs were already activated, the `Promise` will resolve to false.
 *
 * @public
 */
export declare function fetchAndActivate(remoteConfig: RemoteConfig): Promise<boolean>;

/**
 * Fetches and caches configuration from the Remote Config service.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @public
 */
export declare function fetchConfig(remoteConfig: RemoteConfig): Promise<void>;

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
 * Gets all config.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @returns All config.
 *
 * @public
 */
export declare function getAll(remoteConfig: RemoteConfig): Record<string, Value>;

/**
 * Gets the value for the given key as a boolean.
 *
 * Convenience method for calling <code>remoteConfig.getValue(key).asBoolean()</code>.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param key - The name of the parameter.
 *
 * @returns The value for the given key as a boolean.
 * @public
 */
export declare function getBoolean(remoteConfig: RemoteConfig, key: string): boolean;

/**
 * Gets the value for the given key as a number.
 *
 * Convenience method for calling <code>remoteConfig.getValue(key).asNumber()</code>.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param key - The name of the parameter.
 *
 * @returns The value for the given key as a number.
 *
 * @public
 */
export declare function getNumber(remoteConfig: RemoteConfig, key: string): number;

/**
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance.
 * @returns A {@link RemoteConfig} instance.
 *
 * @public
 */
export declare function getRemoteConfig(app?: FirebaseApp): RemoteConfig;

/**
 * Gets the value for the given key as a string.
 * Convenience method for calling <code>remoteConfig.getValue(key).asString()</code>.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param key - The name of the parameter.
 *
 * @returns The value for the given key as a string.
 *
 * @public
 */
export declare function getString(remoteConfig: RemoteConfig, key: string): string;

/**
 * Gets the {@link Value} for the given key.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param key - The name of the parameter.
 *
 * @returns The value for the given key.
 *
 * @public
 */
export declare function getValue(remoteConfig: RemoteConfig, key: string): Value;

/**
 * This method provides two different checks:
 *
 * 1. Check if IndexedDB exists in the browser environment.
 * 2. Check if the current browser context allows IndexedDB `open()` calls.
 *
 * @returns A `Promise` which resolves to true if a {@link RemoteConfig} instance
 * can be initialized in this environment, or false if it cannot.
 * @public
 */
export declare function isSupported(): Promise<boolean>;

/**
 * Defines levels of Remote Config logging.
 *
 * @public
 */
export declare type LogLevel = 'debug' | 'error' | 'silent';

/**
 * The Firebase Remote Config service interface.
 *
 * @public
 */
export declare interface RemoteConfig {
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
 * Defines configuration options for the Remote Config SDK.
 *
 * @public
 */
export declare interface RemoteConfigSettings {
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
 * Defines the log level to use.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param logLevel - The log level to set.
 *
 * @public
 */
export declare function setLogLevel(remoteConfig: RemoteConfig, logLevel: LogLevel): void;

/**
 * Wraps a value with metadata and type-safe getters.
 *
 * @public
 */
export declare interface Value {
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

export { }
