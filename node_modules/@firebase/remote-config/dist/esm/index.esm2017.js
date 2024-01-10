import { _getProvider, getApp, _registerComponent, registerVersion, SDK_VERSION } from '@firebase/app';
import { ErrorFactory, FirebaseError, getModularInstance, calculateBackoffMillis, isIndexedDBAvailable, validateIndexedDBOpenable } from '@firebase/util';
import { Component } from '@firebase/component';
import { LogLevel, Logger } from '@firebase/logger';
import '@firebase/installations';

const name = "@firebase/remote-config";
const version = "0.4.4";

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
/**
 * Shims a minimal AbortSignal.
 *
 * <p>AbortController's AbortSignal conveniently decouples fetch timeout logic from other aspects
 * of networking, such as retries. Firebase doesn't use AbortController enough to justify a
 * polyfill recommendation, like we do with the Fetch API, but this minimal shim can easily be
 * swapped out if/when we do.
 */
class RemoteConfigAbortSignal {
    constructor() {
        this.listeners = [];
    }
    addEventListener(listener) {
        this.listeners.push(listener);
    }
    abort() {
        this.listeners.forEach(listener => listener());
    }
}

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
const RC_COMPONENT_NAME = 'remote-config';

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
const ERROR_DESCRIPTION_MAP = {
    ["registration-window" /* ErrorCode.REGISTRATION_WINDOW */]: 'Undefined window object. This SDK only supports usage in a browser environment.',
    ["registration-project-id" /* ErrorCode.REGISTRATION_PROJECT_ID */]: 'Undefined project identifier. Check Firebase app initialization.',
    ["registration-api-key" /* ErrorCode.REGISTRATION_API_KEY */]: 'Undefined API key. Check Firebase app initialization.',
    ["registration-app-id" /* ErrorCode.REGISTRATION_APP_ID */]: 'Undefined app identifier. Check Firebase app initialization.',
    ["storage-open" /* ErrorCode.STORAGE_OPEN */]: 'Error thrown when opening storage. Original error: {$originalErrorMessage}.',
    ["storage-get" /* ErrorCode.STORAGE_GET */]: 'Error thrown when reading from storage. Original error: {$originalErrorMessage}.',
    ["storage-set" /* ErrorCode.STORAGE_SET */]: 'Error thrown when writing to storage. Original error: {$originalErrorMessage}.',
    ["storage-delete" /* ErrorCode.STORAGE_DELETE */]: 'Error thrown when deleting from storage. Original error: {$originalErrorMessage}.',
    ["fetch-client-network" /* ErrorCode.FETCH_NETWORK */]: 'Fetch client failed to connect to a network. Check Internet connection.' +
        ' Original error: {$originalErrorMessage}.',
    ["fetch-timeout" /* ErrorCode.FETCH_TIMEOUT */]: 'The config fetch request timed out. ' +
        ' Configure timeout using "fetchTimeoutMillis" SDK setting.',
    ["fetch-throttle" /* ErrorCode.FETCH_THROTTLE */]: 'The config fetch request timed out while in an exponential backoff state.' +
        ' Configure timeout using "fetchTimeoutMillis" SDK setting.' +
        ' Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.',
    ["fetch-client-parse" /* ErrorCode.FETCH_PARSE */]: 'Fetch client could not parse response.' +
        ' Original error: {$originalErrorMessage}.',
    ["fetch-status" /* ErrorCode.FETCH_STATUS */]: 'Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.',
    ["indexed-db-unavailable" /* ErrorCode.INDEXED_DB_UNAVAILABLE */]: 'Indexed DB is not supported by current browser'
};
const ERROR_FACTORY = new ErrorFactory('remoteconfig' /* service */, 'Remote Config' /* service name */, ERROR_DESCRIPTION_MAP);
// Note how this is like typeof/instanceof, but for ErrorCode.
function hasErrorCode(e, errorCode) {
    return e instanceof FirebaseError && e.code.indexOf(errorCode) !== -1;
}

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
const DEFAULT_VALUE_FOR_BOOLEAN = false;
const DEFAULT_VALUE_FOR_STRING = '';
const DEFAULT_VALUE_FOR_NUMBER = 0;
const BOOLEAN_TRUTHY_VALUES = ['1', 'true', 't', 'yes', 'y', 'on'];
class Value {
    constructor(_source, _value = DEFAULT_VALUE_FOR_STRING) {
        this._source = _source;
        this._value = _value;
    }
    asString() {
        return this._value;
    }
    asBoolean() {
        if (this._source === 'static') {
            return DEFAULT_VALUE_FOR_BOOLEAN;
        }
        return BOOLEAN_TRUTHY_VALUES.indexOf(this._value.toLowerCase()) >= 0;
    }
    asNumber() {
        if (this._source === 'static') {
            return DEFAULT_VALUE_FOR_NUMBER;
        }
        let num = Number(this._value);
        if (isNaN(num)) {
            num = DEFAULT_VALUE_FOR_NUMBER;
        }
        return num;
    }
    getSource() {
        return this._source;
    }
}

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
/**
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance.
 * @returns A {@link RemoteConfig} instance.
 *
 * @public
 */
function getRemoteConfig(app = getApp()) {
    app = getModularInstance(app);
    const rcProvider = _getProvider(app, RC_COMPONENT_NAME);
    return rcProvider.getImmediate();
}
/**
 * Makes the last fetched config available to the getters.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @returns A `Promise` which resolves to true if the current call activated the fetched configs.
 * If the fetched configs were already activated, the `Promise` will resolve to false.
 *
 * @public
 */
async function activate(remoteConfig) {
    const rc = getModularInstance(remoteConfig);
    const [lastSuccessfulFetchResponse, activeConfigEtag] = await Promise.all([
        rc._storage.getLastSuccessfulFetchResponse(),
        rc._storage.getActiveConfigEtag()
    ]);
    if (!lastSuccessfulFetchResponse ||
        !lastSuccessfulFetchResponse.config ||
        !lastSuccessfulFetchResponse.eTag ||
        lastSuccessfulFetchResponse.eTag === activeConfigEtag) {
        // Either there is no successful fetched config, or is the same as current active
        // config.
        return false;
    }
    await Promise.all([
        rc._storageCache.setActiveConfig(lastSuccessfulFetchResponse.config),
        rc._storage.setActiveConfigEtag(lastSuccessfulFetchResponse.eTag)
    ]);
    return true;
}
/**
 * Ensures the last activated config are available to the getters.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 *
 * @returns A `Promise` that resolves when the last activated config is available to the getters.
 * @public
 */
function ensureInitialized(remoteConfig) {
    const rc = getModularInstance(remoteConfig);
    if (!rc._initializePromise) {
        rc._initializePromise = rc._storageCache.loadFromStorage().then(() => {
            rc._isInitializationComplete = true;
        });
    }
    return rc._initializePromise;
}
/**
 * Fetches and caches configuration from the Remote Config service.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @public
 */
async function fetchConfig(remoteConfig) {
    const rc = getModularInstance(remoteConfig);
    // Aborts the request after the given timeout, causing the fetch call to
    // reject with an `AbortError`.
    //
    // <p>Aborting after the request completes is a no-op, so we don't need a
    // corresponding `clearTimeout`.
    //
    // Locating abort logic here because:
    // * it uses a developer setting (timeout)
    // * it applies to all retries (like curl's max-time arg)
    // * it is consistent with the Fetch API's signal input
    const abortSignal = new RemoteConfigAbortSignal();
    setTimeout(async () => {
        // Note a very low delay, eg < 10ms, can elapse before listeners are initialized.
        abortSignal.abort();
    }, rc.settings.fetchTimeoutMillis);
    // Catches *all* errors thrown by client so status can be set consistently.
    try {
        await rc._client.fetch({
            cacheMaxAgeMillis: rc.settings.minimumFetchIntervalMillis,
            signal: abortSignal
        });
        await rc._storageCache.setLastFetchStatus('success');
    }
    catch (e) {
        const lastFetchStatus = hasErrorCode(e, "fetch-throttle" /* ErrorCode.FETCH_THROTTLE */)
            ? 'throttle'
            : 'failure';
        await rc._storageCache.setLastFetchStatus(lastFetchStatus);
        throw e;
    }
}
/**
 * Gets all config.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @returns All config.
 *
 * @public
 */
function getAll(remoteConfig) {
    const rc = getModularInstance(remoteConfig);
    return getAllKeys(rc._storageCache.getActiveConfig(), rc.defaultConfig).reduce((allConfigs, key) => {
        allConfigs[key] = getValue(remoteConfig, key);
        return allConfigs;
    }, {});
}
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
function getBoolean(remoteConfig, key) {
    return getValue(getModularInstance(remoteConfig), key).asBoolean();
}
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
function getNumber(remoteConfig, key) {
    return getValue(getModularInstance(remoteConfig), key).asNumber();
}
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
function getString(remoteConfig, key) {
    return getValue(getModularInstance(remoteConfig), key).asString();
}
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
function getValue(remoteConfig, key) {
    const rc = getModularInstance(remoteConfig);
    if (!rc._isInitializationComplete) {
        rc._logger.debug(`A value was requested for key "${key}" before SDK initialization completed.` +
            ' Await on ensureInitialized if the intent was to get a previously activated value.');
    }
    const activeConfig = rc._storageCache.getActiveConfig();
    if (activeConfig && activeConfig[key] !== undefined) {
        return new Value('remote', activeConfig[key]);
    }
    else if (rc.defaultConfig && rc.defaultConfig[key] !== undefined) {
        return new Value('default', String(rc.defaultConfig[key]));
    }
    rc._logger.debug(`Returning static value for key "${key}".` +
        ' Define a default or remote value if this is unintentional.');
    return new Value('static');
}
/**
 * Defines the log level to use.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param logLevel - The log level to set.
 *
 * @public
 */
function setLogLevel(remoteConfig, logLevel) {
    const rc = getModularInstance(remoteConfig);
    switch (logLevel) {
        case 'debug':
            rc._logger.logLevel = LogLevel.DEBUG;
            break;
        case 'silent':
            rc._logger.logLevel = LogLevel.SILENT;
            break;
        default:
            rc._logger.logLevel = LogLevel.ERROR;
    }
}
/**
 * Dedupes and returns an array of all the keys of the received objects.
 */
function getAllKeys(obj1 = {}, obj2 = {}) {
    return Object.keys(Object.assign(Object.assign({}, obj1), obj2));
}

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
/**
 * Implements the {@link RemoteConfigClient} abstraction with success response caching.
 *
 * <p>Comparable to the browser's Cache API for responses, but the Cache API requires a Service
 * Worker, which requires HTTPS, which would significantly complicate SDK installation. Also, the
 * Cache API doesn't support matching entries by time.
 */
class CachingClient {
    constructor(client, storage, storageCache, logger) {
        this.client = client;
        this.storage = storage;
        this.storageCache = storageCache;
        this.logger = logger;
    }
    /**
     * Returns true if the age of the cached fetched configs is less than or equal to
     * {@link Settings#minimumFetchIntervalInSeconds}.
     *
     * <p>This is comparable to passing `headers = { 'Cache-Control': max-age <maxAge> }` to the
     * native Fetch API.
     *
     * <p>Visible for testing.
     */
    isCachedDataFresh(cacheMaxAgeMillis, lastSuccessfulFetchTimestampMillis) {
        // Cache can only be fresh if it's populated.
        if (!lastSuccessfulFetchTimestampMillis) {
            this.logger.debug('Config fetch cache check. Cache unpopulated.');
            return false;
        }
        // Calculates age of cache entry.
        const cacheAgeMillis = Date.now() - lastSuccessfulFetchTimestampMillis;
        const isCachedDataFresh = cacheAgeMillis <= cacheMaxAgeMillis;
        this.logger.debug('Config fetch cache check.' +
            ` Cache age millis: ${cacheAgeMillis}.` +
            ` Cache max age millis (minimumFetchIntervalMillis setting): ${cacheMaxAgeMillis}.` +
            ` Is cache hit: ${isCachedDataFresh}.`);
        return isCachedDataFresh;
    }
    async fetch(request) {
        // Reads from persisted storage to avoid cache miss if callers don't wait on initialization.
        const [lastSuccessfulFetchTimestampMillis, lastSuccessfulFetchResponse] = await Promise.all([
            this.storage.getLastSuccessfulFetchTimestampMillis(),
            this.storage.getLastSuccessfulFetchResponse()
        ]);
        // Exits early on cache hit.
        if (lastSuccessfulFetchResponse &&
            this.isCachedDataFresh(request.cacheMaxAgeMillis, lastSuccessfulFetchTimestampMillis)) {
            return lastSuccessfulFetchResponse;
        }
        // Deviates from pure decorator by not honoring a passed ETag since we don't have a public API
        // that allows the caller to pass an ETag.
        request.eTag =
            lastSuccessfulFetchResponse && lastSuccessfulFetchResponse.eTag;
        // Falls back to service on cache miss.
        const response = await this.client.fetch(request);
        // Fetch throws for non-success responses, so success is guaranteed here.
        const storageOperations = [
            // Uses write-through cache for consistency with synchronous public API.
            this.storageCache.setLastSuccessfulFetchTimestampMillis(Date.now())
        ];
        if (response.status === 200) {
            // Caches response only if it has changed, ie non-304 responses.
            storageOperations.push(this.storage.setLastSuccessfulFetchResponse(response));
        }
        await Promise.all(storageOperations);
        return response;
    }
}

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
/**
 * Attempts to get the most accurate browser language setting.
 *
 * <p>Adapted from getUserLanguage in packages/auth/src/utils.js for TypeScript.
 *
 * <p>Defers default language specification to server logic for consistency.
 *
 * @param navigatorLanguage Enables tests to override read-only {@link NavigatorLanguage}.
 */
function getUserLanguage(navigatorLanguage = navigator) {
    return (
    // Most reliable, but only supported in Chrome/Firefox.
    (navigatorLanguage.languages && navigatorLanguage.languages[0]) ||
        // Supported in most browsers, but returns the language of the browser
        // UI, not the language set in browser settings.
        navigatorLanguage.language
    // Polyfill otherwise.
    );
}

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
/**
 * Implements the Client abstraction for the Remote Config REST API.
 */
class RestClient {
    constructor(firebaseInstallations, sdkVersion, namespace, projectId, apiKey, appId) {
        this.firebaseInstallations = firebaseInstallations;
        this.sdkVersion = sdkVersion;
        this.namespace = namespace;
        this.projectId = projectId;
        this.apiKey = apiKey;
        this.appId = appId;
    }
    /**
     * Fetches from the Remote Config REST API.
     *
     * @throws a {@link ErrorCode.FETCH_NETWORK} error if {@link GlobalFetch#fetch} can't
     * connect to the network.
     * @throws a {@link ErrorCode.FETCH_PARSE} error if {@link Response#json} can't parse the
     * fetch response.
     * @throws a {@link ErrorCode.FETCH_STATUS} error if the service returns an HTTP error status.
     */
    async fetch(request) {
        const [installationId, installationToken] = await Promise.all([
            this.firebaseInstallations.getId(),
            this.firebaseInstallations.getToken()
        ]);
        const urlBase = window.FIREBASE_REMOTE_CONFIG_URL_BASE ||
            'https://firebaseremoteconfig.googleapis.com';
        const url = `${urlBase}/v1/projects/${this.projectId}/namespaces/${this.namespace}:fetch?key=${this.apiKey}`;
        const headers = {
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip',
            // Deviates from pure decorator by not passing max-age header since we don't currently have
            // service behavior using that header.
            'If-None-Match': request.eTag || '*'
        };
        const requestBody = {
            /* eslint-disable camelcase */
            sdk_version: this.sdkVersion,
            app_instance_id: installationId,
            app_instance_id_token: installationToken,
            app_id: this.appId,
            language_code: getUserLanguage()
            /* eslint-enable camelcase */
        };
        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody)
        };
        // This logic isn't REST-specific, but shimming abort logic isn't worth another decorator.
        const fetchPromise = fetch(url, options);
        const timeoutPromise = new Promise((_resolve, reject) => {
            // Maps async event listener to Promise API.
            request.signal.addEventListener(() => {
                // Emulates https://heycam.github.io/webidl/#aborterror
                const error = new Error('The operation was aborted.');
                error.name = 'AbortError';
                reject(error);
            });
        });
        let response;
        try {
            await Promise.race([fetchPromise, timeoutPromise]);
            response = await fetchPromise;
        }
        catch (originalError) {
            let errorCode = "fetch-client-network" /* ErrorCode.FETCH_NETWORK */;
            if ((originalError === null || originalError === void 0 ? void 0 : originalError.name) === 'AbortError') {
                errorCode = "fetch-timeout" /* ErrorCode.FETCH_TIMEOUT */;
            }
            throw ERROR_FACTORY.create(errorCode, {
                originalErrorMessage: originalError === null || originalError === void 0 ? void 0 : originalError.message
            });
        }
        let status = response.status;
        // Normalizes nullable header to optional.
        const responseEtag = response.headers.get('ETag') || undefined;
        let config;
        let state;
        // JSON parsing throws SyntaxError if the response body isn't a JSON string.
        // Requesting application/json and checking for a 200 ensures there's JSON data.
        if (response.status === 200) {
            let responseBody;
            try {
                responseBody = await response.json();
            }
            catch (originalError) {
                throw ERROR_FACTORY.create("fetch-client-parse" /* ErrorCode.FETCH_PARSE */, {
                    originalErrorMessage: originalError === null || originalError === void 0 ? void 0 : originalError.message
                });
            }
            config = responseBody['entries'];
            state = responseBody['state'];
        }
        // Normalizes based on legacy state.
        if (state === 'INSTANCE_STATE_UNSPECIFIED') {
            status = 500;
        }
        else if (state === 'NO_CHANGE') {
            status = 304;
        }
        else if (state === 'NO_TEMPLATE' || state === 'EMPTY_CONFIG') {
            // These cases can be fixed remotely, so normalize to safe value.
            config = {};
        }
        // Normalize to exception-based control flow for non-success cases.
        // Encapsulates HTTP specifics in this class as much as possible. Status is still the best for
        // differentiating success states (200 from 304; the state body param is undefined in a
        // standard 304).
        if (status !== 304 && status !== 200) {
            throw ERROR_FACTORY.create("fetch-status" /* ErrorCode.FETCH_STATUS */, {
                httpStatus: status
            });
        }
        return { status, eTag: responseEtag, config };
    }
}

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
/**
 * Supports waiting on a backoff by:
 *
 * <ul>
 *   <li>Promisifying setTimeout, so we can set a timeout in our Promise chain</li>
 *   <li>Listening on a signal bus for abort events, just like the Fetch API</li>
 *   <li>Failing in the same way the Fetch API fails, so timing out a live request and a throttled
 *       request appear the same.</li>
 * </ul>
 *
 * <p>Visible for testing.
 */
function setAbortableTimeout(signal, throttleEndTimeMillis) {
    return new Promise((resolve, reject) => {
        // Derives backoff from given end time, normalizing negative numbers to zero.
        const backoffMillis = Math.max(throttleEndTimeMillis - Date.now(), 0);
        const timeout = setTimeout(resolve, backoffMillis);
        // Adds listener, rather than sets onabort, because signal is a shared object.
        signal.addEventListener(() => {
            clearTimeout(timeout);
            // If the request completes before this timeout, the rejection has no effect.
            reject(ERROR_FACTORY.create("fetch-throttle" /* ErrorCode.FETCH_THROTTLE */, {
                throttleEndTimeMillis
            }));
        });
    });
}
/**
 * Returns true if the {@link Error} indicates a fetch request may succeed later.
 */
function isRetriableError(e) {
    if (!(e instanceof FirebaseError) || !e.customData) {
        return false;
    }
    // Uses string index defined by ErrorData, which FirebaseError implements.
    const httpStatus = Number(e.customData['httpStatus']);
    return (httpStatus === 429 ||
        httpStatus === 500 ||
        httpStatus === 503 ||
        httpStatus === 504);
}
/**
 * Decorates a Client with retry logic.
 *
 * <p>Comparable to CachingClient, but uses backoff logic instead of cache max age and doesn't cache
 * responses (because the SDK has no use for error responses).
 */
class RetryingClient {
    constructor(client, storage) {
        this.client = client;
        this.storage = storage;
    }
    async fetch(request) {
        const throttleMetadata = (await this.storage.getThrottleMetadata()) || {
            backoffCount: 0,
            throttleEndTimeMillis: Date.now()
        };
        return this.attemptFetch(request, throttleMetadata);
    }
    /**
     * A recursive helper for attempting a fetch request repeatedly.
     *
     * @throws any non-retriable errors.
     */
    async attemptFetch(request, { throttleEndTimeMillis, backoffCount }) {
        // Starts with a (potentially zero) timeout to support resumption from stored state.
        // Ensures the throttle end time is honored if the last attempt timed out.
        // Note the SDK will never make a request if the fetch timeout expires at this point.
        await setAbortableTimeout(request.signal, throttleEndTimeMillis);
        try {
            const response = await this.client.fetch(request);
            // Note the SDK only clears throttle state if response is success or non-retriable.
            await this.storage.deleteThrottleMetadata();
            return response;
        }
        catch (e) {
            if (!isRetriableError(e)) {
                throw e;
            }
            // Increments backoff state.
            const throttleMetadata = {
                throttleEndTimeMillis: Date.now() + calculateBackoffMillis(backoffCount),
                backoffCount: backoffCount + 1
            };
            // Persists state.
            await this.storage.setThrottleMetadata(throttleMetadata);
            return this.attemptFetch(request, throttleMetadata);
        }
    }
}

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
const DEFAULT_FETCH_TIMEOUT_MILLIS = 60 * 1000; // One minute
const DEFAULT_CACHE_MAX_AGE_MILLIS = 12 * 60 * 60 * 1000; // Twelve hours.
/**
 * Encapsulates business logic mapping network and storage dependencies to the public SDK API.
 *
 * See {@link https://github.com/FirebasePrivate/firebase-js-sdk/blob/master/packages/firebase/index.d.ts|interface documentation} for method descriptions.
 */
class RemoteConfig {
    constructor(
    // Required by FirebaseServiceFactory interface.
    app, 
    // JS doesn't support private yet
    // (https://github.com/tc39/proposal-class-fields#private-fields), so we hint using an
    // underscore prefix.
    /**
     * @internal
     */
    _client, 
    /**
     * @internal
     */
    _storageCache, 
    /**
     * @internal
     */
    _storage, 
    /**
     * @internal
     */
    _logger) {
        this.app = app;
        this._client = _client;
        this._storageCache = _storageCache;
        this._storage = _storage;
        this._logger = _logger;
        /**
         * Tracks completion of initialization promise.
         * @internal
         */
        this._isInitializationComplete = false;
        this.settings = {
            fetchTimeoutMillis: DEFAULT_FETCH_TIMEOUT_MILLIS,
            minimumFetchIntervalMillis: DEFAULT_CACHE_MAX_AGE_MILLIS
        };
        this.defaultConfig = {};
    }
    get fetchTimeMillis() {
        return this._storageCache.getLastSuccessfulFetchTimestampMillis() || -1;
    }
    get lastFetchStatus() {
        return this._storageCache.getLastFetchStatus() || 'no-fetch-yet';
    }
}

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
/**
 * Converts an error event associated with a {@link IDBRequest} to a {@link FirebaseError}.
 */
function toFirebaseError(event, errorCode) {
    const originalError = event.target.error || undefined;
    return ERROR_FACTORY.create(errorCode, {
        originalErrorMessage: originalError && (originalError === null || originalError === void 0 ? void 0 : originalError.message)
    });
}
/**
 * A general-purpose store keyed by app + namespace + {@link
 * ProjectNamespaceKeyFieldValue}.
 *
 * <p>The Remote Config SDK can be used with multiple app installations, and each app can interact
 * with multiple namespaces, so this store uses app (ID + name) and namespace as common parent keys
 * for a set of key-value pairs. See {@link Storage#createCompositeKey}.
 *
 * <p>Visible for testing.
 */
const APP_NAMESPACE_STORE = 'app_namespace_store';
const DB_NAME = 'firebase_remote_config';
const DB_VERSION = 1;
// Visible for testing.
function openDatabase() {
    return new Promise((resolve, reject) => {
        try {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = event => {
                reject(toFirebaseError(event, "storage-open" /* ErrorCode.STORAGE_OPEN */));
            };
            request.onsuccess = event => {
                resolve(event.target.result);
            };
            request.onupgradeneeded = event => {
                const db = event.target.result;
                // We don't use 'break' in this switch statement, the fall-through
                // behavior is what we want, because if there are multiple versions between
                // the old version and the current version, we want ALL the migrations
                // that correspond to those versions to run, not only the last one.
                // eslint-disable-next-line default-case
                switch (event.oldVersion) {
                    case 0:
                        db.createObjectStore(APP_NAMESPACE_STORE, {
                            keyPath: 'compositeKey'
                        });
                }
            };
        }
        catch (error) {
            reject(ERROR_FACTORY.create("storage-open" /* ErrorCode.STORAGE_OPEN */, {
                originalErrorMessage: error === null || error === void 0 ? void 0 : error.message
            }));
        }
    });
}
/**
 * Abstracts data persistence.
 */
class Storage {
    /**
     * @param appId enables storage segmentation by app (ID + name).
     * @param appName enables storage segmentation by app (ID + name).
     * @param namespace enables storage segmentation by namespace.
     */
    constructor(appId, appName, namespace, openDbPromise = openDatabase()) {
        this.appId = appId;
        this.appName = appName;
        this.namespace = namespace;
        this.openDbPromise = openDbPromise;
    }
    getLastFetchStatus() {
        return this.get('last_fetch_status');
    }
    setLastFetchStatus(status) {
        return this.set('last_fetch_status', status);
    }
    // This is comparable to a cache entry timestamp. If we need to expire other data, we could
    // consider adding timestamp to all storage records and an optional max age arg to getters.
    getLastSuccessfulFetchTimestampMillis() {
        return this.get('last_successful_fetch_timestamp_millis');
    }
    setLastSuccessfulFetchTimestampMillis(timestamp) {
        return this.set('last_successful_fetch_timestamp_millis', timestamp);
    }
    getLastSuccessfulFetchResponse() {
        return this.get('last_successful_fetch_response');
    }
    setLastSuccessfulFetchResponse(response) {
        return this.set('last_successful_fetch_response', response);
    }
    getActiveConfig() {
        return this.get('active_config');
    }
    setActiveConfig(config) {
        return this.set('active_config', config);
    }
    getActiveConfigEtag() {
        return this.get('active_config_etag');
    }
    setActiveConfigEtag(etag) {
        return this.set('active_config_etag', etag);
    }
    getThrottleMetadata() {
        return this.get('throttle_metadata');
    }
    setThrottleMetadata(metadata) {
        return this.set('throttle_metadata', metadata);
    }
    deleteThrottleMetadata() {
        return this.delete('throttle_metadata');
    }
    async get(key) {
        const db = await this.openDbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([APP_NAMESPACE_STORE], 'readonly');
            const objectStore = transaction.objectStore(APP_NAMESPACE_STORE);
            const compositeKey = this.createCompositeKey(key);
            try {
                const request = objectStore.get(compositeKey);
                request.onerror = event => {
                    reject(toFirebaseError(event, "storage-get" /* ErrorCode.STORAGE_GET */));
                };
                request.onsuccess = event => {
                    const result = event.target.result;
                    if (result) {
                        resolve(result.value);
                    }
                    else {
                        resolve(undefined);
                    }
                };
            }
            catch (e) {
                reject(ERROR_FACTORY.create("storage-get" /* ErrorCode.STORAGE_GET */, {
                    originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
                }));
            }
        });
    }
    async set(key, value) {
        const db = await this.openDbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([APP_NAMESPACE_STORE], 'readwrite');
            const objectStore = transaction.objectStore(APP_NAMESPACE_STORE);
            const compositeKey = this.createCompositeKey(key);
            try {
                const request = objectStore.put({
                    compositeKey,
                    value
                });
                request.onerror = (event) => {
                    reject(toFirebaseError(event, "storage-set" /* ErrorCode.STORAGE_SET */));
                };
                request.onsuccess = () => {
                    resolve();
                };
            }
            catch (e) {
                reject(ERROR_FACTORY.create("storage-set" /* ErrorCode.STORAGE_SET */, {
                    originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
                }));
            }
        });
    }
    async delete(key) {
        const db = await this.openDbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([APP_NAMESPACE_STORE], 'readwrite');
            const objectStore = transaction.objectStore(APP_NAMESPACE_STORE);
            const compositeKey = this.createCompositeKey(key);
            try {
                const request = objectStore.delete(compositeKey);
                request.onerror = (event) => {
                    reject(toFirebaseError(event, "storage-delete" /* ErrorCode.STORAGE_DELETE */));
                };
                request.onsuccess = () => {
                    resolve();
                };
            }
            catch (e) {
                reject(ERROR_FACTORY.create("storage-delete" /* ErrorCode.STORAGE_DELETE */, {
                    originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
                }));
            }
        });
    }
    // Facilitates composite key functionality (which is unsupported in IE).
    createCompositeKey(key) {
        return [this.appId, this.appName, this.namespace, key].join();
    }
}

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
/**
 * A memory cache layer over storage to support the SDK's synchronous read requirements.
 */
class StorageCache {
    constructor(storage) {
        this.storage = storage;
    }
    /**
     * Memory-only getters
     */
    getLastFetchStatus() {
        return this.lastFetchStatus;
    }
    getLastSuccessfulFetchTimestampMillis() {
        return this.lastSuccessfulFetchTimestampMillis;
    }
    getActiveConfig() {
        return this.activeConfig;
    }
    /**
     * Read-ahead getter
     */
    async loadFromStorage() {
        const lastFetchStatusPromise = this.storage.getLastFetchStatus();
        const lastSuccessfulFetchTimestampMillisPromise = this.storage.getLastSuccessfulFetchTimestampMillis();
        const activeConfigPromise = this.storage.getActiveConfig();
        // Note:
        // 1. we consistently check for undefined to avoid clobbering defined values
        //   in memory
        // 2. we defer awaiting to improve readability, as opposed to destructuring
        //   a Promise.all result, for example
        const lastFetchStatus = await lastFetchStatusPromise;
        if (lastFetchStatus) {
            this.lastFetchStatus = lastFetchStatus;
        }
        const lastSuccessfulFetchTimestampMillis = await lastSuccessfulFetchTimestampMillisPromise;
        if (lastSuccessfulFetchTimestampMillis) {
            this.lastSuccessfulFetchTimestampMillis =
                lastSuccessfulFetchTimestampMillis;
        }
        const activeConfig = await activeConfigPromise;
        if (activeConfig) {
            this.activeConfig = activeConfig;
        }
    }
    /**
     * Write-through setters
     */
    setLastFetchStatus(status) {
        this.lastFetchStatus = status;
        return this.storage.setLastFetchStatus(status);
    }
    setLastSuccessfulFetchTimestampMillis(timestampMillis) {
        this.lastSuccessfulFetchTimestampMillis = timestampMillis;
        return this.storage.setLastSuccessfulFetchTimestampMillis(timestampMillis);
    }
    setActiveConfig(activeConfig) {
        this.activeConfig = activeConfig;
        return this.storage.setActiveConfig(activeConfig);
    }
}

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
function registerRemoteConfig() {
    _registerComponent(new Component(RC_COMPONENT_NAME, remoteConfigFactory, "PUBLIC" /* ComponentType.PUBLIC */).setMultipleInstances(true));
    registerVersion(name, version);
    // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
    registerVersion(name, version, 'esm2017');
    function remoteConfigFactory(container, { instanceIdentifier: namespace }) {
        /* Dependencies */
        // getImmediate for FirebaseApp will always succeed
        const app = container.getProvider('app').getImmediate();
        // The following call will always succeed because rc has `import '@firebase/installations'`
        const installations = container
            .getProvider('installations-internal')
            .getImmediate();
        // Guards against the SDK being used in non-browser environments.
        if (typeof window === 'undefined') {
            throw ERROR_FACTORY.create("registration-window" /* ErrorCode.REGISTRATION_WINDOW */);
        }
        // Guards against the SDK being used when indexedDB is not available.
        if (!isIndexedDBAvailable()) {
            throw ERROR_FACTORY.create("indexed-db-unavailable" /* ErrorCode.INDEXED_DB_UNAVAILABLE */);
        }
        // Normalizes optional inputs.
        const { projectId, apiKey, appId } = app.options;
        if (!projectId) {
            throw ERROR_FACTORY.create("registration-project-id" /* ErrorCode.REGISTRATION_PROJECT_ID */);
        }
        if (!apiKey) {
            throw ERROR_FACTORY.create("registration-api-key" /* ErrorCode.REGISTRATION_API_KEY */);
        }
        if (!appId) {
            throw ERROR_FACTORY.create("registration-app-id" /* ErrorCode.REGISTRATION_APP_ID */);
        }
        namespace = namespace || 'firebase';
        const storage = new Storage(appId, app.name, namespace);
        const storageCache = new StorageCache(storage);
        const logger = new Logger(name);
        // Sets ERROR as the default log level.
        // See RemoteConfig#setLogLevel for corresponding normalization to ERROR log level.
        logger.logLevel = LogLevel.ERROR;
        const restClient = new RestClient(installations, 
        // Uses the JS SDK version, by which the RC package version can be deduced, if necessary.
        SDK_VERSION, namespace, projectId, apiKey, appId);
        const retryingClient = new RetryingClient(restClient, storage);
        const cachingClient = new CachingClient(retryingClient, storage, storageCache, logger);
        const remoteConfigInstance = new RemoteConfig(app, cachingClient, storageCache, storage, logger);
        // Starts warming cache.
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        ensureInitialized(remoteConfigInstance);
        return remoteConfigInstance;
    }
}

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
// This API is put in a separate file, so we can stub fetchConfig and activate in tests.
// It's not possible to stub standalone functions from the same module.
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
async function fetchAndActivate(remoteConfig) {
    remoteConfig = getModularInstance(remoteConfig);
    await fetchConfig(remoteConfig);
    return activate(remoteConfig);
}
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
async function isSupported() {
    if (!isIndexedDBAvailable()) {
        return false;
    }
    try {
        const isDBOpenable = await validateIndexedDBOpenable();
        return isDBOpenable;
    }
    catch (error) {
        return false;
    }
}

/**
 * Firebase Remote Config
 *
 * @packageDocumentation
 */
/** register component and version */
registerRemoteConfig();

export { activate, ensureInitialized, fetchAndActivate, fetchConfig, getAll, getBoolean, getNumber, getRemoteConfig, getString, getValue, isSupported, setLogLevel };
//# sourceMappingURL=index.esm2017.js.map
