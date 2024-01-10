import { _getProvider, getApp, _registerComponent, registerVersion } from '@firebase/app';
import { Component } from '@firebase/component';
import { Deferred, ErrorFactory, isIndexedDBAvailable, uuidv4, getGlobal, base64, issuedAtTime, calculateBackoffMillis, getModularInstance } from '@firebase/util';
import { Logger } from '@firebase/logger';

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
const APP_CHECK_STATES = new Map();
const DEFAULT_STATE = {
    activated: false,
    tokenObservers: []
};
const DEBUG_STATE = {
    initialized: false,
    enabled: false
};
/**
 * Gets a reference to the state object.
 */
function getStateReference(app) {
    return APP_CHECK_STATES.get(app) || Object.assign({}, DEFAULT_STATE);
}
/**
 * Set once on initialization. The map should hold the same reference to the
 * same object until this entry is deleted.
 */
function setInitialState(app, state) {
    APP_CHECK_STATES.set(app, state);
    return APP_CHECK_STATES.get(app);
}
function getDebugState() {
    return DEBUG_STATE;
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
const BASE_ENDPOINT = 'https://content-firebaseappcheck.googleapis.com/v1';
const EXCHANGE_RECAPTCHA_TOKEN_METHOD = 'exchangeRecaptchaV3Token';
const EXCHANGE_RECAPTCHA_ENTERPRISE_TOKEN_METHOD = 'exchangeRecaptchaEnterpriseToken';
const EXCHANGE_DEBUG_TOKEN_METHOD = 'exchangeDebugToken';
const TOKEN_REFRESH_TIME = {
    /**
     * The offset time before token natural expiration to run the refresh.
     * This is currently 5 minutes.
     */
    OFFSET_DURATION: 5 * 60 * 1000,
    /**
     * This is the first retrial wait after an error. This is currently
     * 30 seconds.
     */
    RETRIAL_MIN_WAIT: 30 * 1000,
    /**
     * This is the maximum retrial wait, currently 16 minutes.
     */
    RETRIAL_MAX_WAIT: 16 * 60 * 1000
};
/**
 * One day in millis, for certain error code backoffs.
 */
const ONE_DAY = 24 * 60 * 60 * 1000;

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
 * Port from auth proactiverefresh.js
 *
 */
// TODO: move it to @firebase/util?
// TODO: allow to config whether refresh should happen in the background
class Refresher {
    constructor(operation, retryPolicy, getWaitDuration, lowerBound, upperBound) {
        this.operation = operation;
        this.retryPolicy = retryPolicy;
        this.getWaitDuration = getWaitDuration;
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.pending = null;
        this.nextErrorWaitInterval = lowerBound;
        if (lowerBound > upperBound) {
            throw new Error('Proactive refresh lower bound greater than upper bound!');
        }
    }
    start() {
        this.nextErrorWaitInterval = this.lowerBound;
        this.process(true).catch(() => {
            /* we don't care about the result */
        });
    }
    stop() {
        if (this.pending) {
            this.pending.reject('cancelled');
            this.pending = null;
        }
    }
    isRunning() {
        return !!this.pending;
    }
    async process(hasSucceeded) {
        this.stop();
        try {
            this.pending = new Deferred();
            this.pending.promise.catch(_e => {
                /* ignore */
            });
            await sleep(this.getNextRun(hasSucceeded));
            // Why do we resolve a promise, then immediate wait for it?
            // We do it to make the promise chain cancellable.
            // We can call stop() which rejects the promise before the following line execute, which makes
            // the code jump to the catch block.
            // TODO: unit test this
            this.pending.resolve();
            await this.pending.promise;
            this.pending = new Deferred();
            this.pending.promise.catch(_e => {
                /* ignore */
            });
            await this.operation();
            this.pending.resolve();
            await this.pending.promise;
            this.process(true).catch(() => {
                /* we don't care about the result */
            });
        }
        catch (error) {
            if (this.retryPolicy(error)) {
                this.process(false).catch(() => {
                    /* we don't care about the result */
                });
            }
            else {
                this.stop();
            }
        }
    }
    getNextRun(hasSucceeded) {
        if (hasSucceeded) {
            // If last operation succeeded, reset next error wait interval and return
            // the default wait duration.
            this.nextErrorWaitInterval = this.lowerBound;
            // Return typical wait duration interval after a successful operation.
            return this.getWaitDuration();
        }
        else {
            // Get next error wait interval.
            const currentErrorWaitInterval = this.nextErrorWaitInterval;
            // Double interval for next consecutive error.
            this.nextErrorWaitInterval *= 2;
            // Make sure next wait interval does not exceed the maximum upper bound.
            if (this.nextErrorWaitInterval > this.upperBound) {
                this.nextErrorWaitInterval = this.upperBound;
            }
            return currentErrorWaitInterval;
        }
    }
}
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
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
const ERRORS = {
    ["already-initialized" /* AppCheckError.ALREADY_INITIALIZED */]: 'You have already called initializeAppCheck() for FirebaseApp {$appName} with ' +
        'different options. To avoid this error, call initializeAppCheck() with the ' +
        'same options as when it was originally called. This will return the ' +
        'already initialized instance.',
    ["use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */]: 'App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. ' +
        'Call initializeAppCheck() before instantiating other Firebase services.',
    ["fetch-network-error" /* AppCheckError.FETCH_NETWORK_ERROR */]: 'Fetch failed to connect to a network. Check Internet connection. ' +
        'Original error: {$originalErrorMessage}.',
    ["fetch-parse-error" /* AppCheckError.FETCH_PARSE_ERROR */]: 'Fetch client could not parse response.' +
        ' Original error: {$originalErrorMessage}.',
    ["fetch-status-error" /* AppCheckError.FETCH_STATUS_ERROR */]: 'Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.',
    ["storage-open" /* AppCheckError.STORAGE_OPEN */]: 'Error thrown when opening storage. Original error: {$originalErrorMessage}.',
    ["storage-get" /* AppCheckError.STORAGE_GET */]: 'Error thrown when reading from storage. Original error: {$originalErrorMessage}.',
    ["storage-set" /* AppCheckError.STORAGE_WRITE */]: 'Error thrown when writing to storage. Original error: {$originalErrorMessage}.',
    ["recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */]: 'ReCAPTCHA error.',
    ["throttled" /* AppCheckError.THROTTLED */]: `Requests throttled due to {$httpStatus} error. Attempts allowed again after {$time}`
};
const ERROR_FACTORY = new ErrorFactory('appCheck', 'AppCheck', ERRORS);

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
function getRecaptcha(isEnterprise = false) {
    var _a;
    if (isEnterprise) {
        return (_a = self.grecaptcha) === null || _a === void 0 ? void 0 : _a.enterprise;
    }
    return self.grecaptcha;
}
function ensureActivated(app) {
    if (!getStateReference(app).activated) {
        throw ERROR_FACTORY.create("use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */, {
            appName: app.name
        });
    }
}
function getDurationString(durationInMillis) {
    const totalSeconds = Math.round(durationInMillis / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds - days * 3600 * 24) / 3600);
    const minutes = Math.floor((totalSeconds - days * 3600 * 24 - hours * 3600) / 60);
    const seconds = totalSeconds - days * 3600 * 24 - hours * 3600 - minutes * 60;
    let result = '';
    if (days) {
        result += pad(days) + 'd:';
    }
    if (hours) {
        result += pad(hours) + 'h:';
    }
    result += pad(minutes) + 'm:' + pad(seconds) + 's';
    return result;
}
function pad(value) {
    if (value === 0) {
        return '00';
    }
    return value >= 10 ? value.toString() : '0' + value;
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
async function exchangeToken({ url, body }, heartbeatServiceProvider) {
    const headers = {
        'Content-Type': 'application/json'
    };
    // If heartbeat service exists, add heartbeat header string to the header.
    const heartbeatService = heartbeatServiceProvider.getImmediate({
        optional: true
    });
    if (heartbeatService) {
        const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
        if (heartbeatsHeader) {
            headers['X-Firebase-Client'] = heartbeatsHeader;
        }
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers
    };
    let response;
    try {
        response = await fetch(url, options);
    }
    catch (originalError) {
        throw ERROR_FACTORY.create("fetch-network-error" /* AppCheckError.FETCH_NETWORK_ERROR */, {
            originalErrorMessage: originalError === null || originalError === void 0 ? void 0 : originalError.message
        });
    }
    if (response.status !== 200) {
        throw ERROR_FACTORY.create("fetch-status-error" /* AppCheckError.FETCH_STATUS_ERROR */, {
            httpStatus: response.status
        });
    }
    let responseBody;
    try {
        // JSON parsing throws SyntaxError if the response body isn't a JSON string.
        responseBody = await response.json();
    }
    catch (originalError) {
        throw ERROR_FACTORY.create("fetch-parse-error" /* AppCheckError.FETCH_PARSE_ERROR */, {
            originalErrorMessage: originalError === null || originalError === void 0 ? void 0 : originalError.message
        });
    }
    // Protobuf duration format.
    // https://developers.google.com/protocol-buffers/docs/reference/java/com/google/protobuf/Duration
    const match = responseBody.ttl.match(/^([\d.]+)(s)$/);
    if (!match || !match[2] || isNaN(Number(match[1]))) {
        throw ERROR_FACTORY.create("fetch-parse-error" /* AppCheckError.FETCH_PARSE_ERROR */, {
            originalErrorMessage: `ttl field (timeToLive) is not in standard Protobuf Duration ` +
                `format: ${responseBody.ttl}`
        });
    }
    const timeToLiveAsNumber = Number(match[1]) * 1000;
    const now = Date.now();
    return {
        token: responseBody.token,
        expireTimeMillis: now + timeToLiveAsNumber,
        issuedAtTimeMillis: now
    };
}
function getExchangeRecaptchaV3TokenRequest(app, reCAPTCHAToken) {
    const { projectId, appId, apiKey } = app.options;
    return {
        url: `${BASE_ENDPOINT}/projects/${projectId}/apps/${appId}:${EXCHANGE_RECAPTCHA_TOKEN_METHOD}?key=${apiKey}`,
        body: {
            'recaptcha_v3_token': reCAPTCHAToken
        }
    };
}
function getExchangeRecaptchaEnterpriseTokenRequest(app, reCAPTCHAToken) {
    const { projectId, appId, apiKey } = app.options;
    return {
        url: `${BASE_ENDPOINT}/projects/${projectId}/apps/${appId}:${EXCHANGE_RECAPTCHA_ENTERPRISE_TOKEN_METHOD}?key=${apiKey}`,
        body: {
            'recaptcha_enterprise_token': reCAPTCHAToken
        }
    };
}
function getExchangeDebugTokenRequest(app, debugToken) {
    const { projectId, appId, apiKey } = app.options;
    return {
        url: `${BASE_ENDPOINT}/projects/${projectId}/apps/${appId}:${EXCHANGE_DEBUG_TOKEN_METHOD}?key=${apiKey}`,
        body: {
            // eslint-disable-next-line
            debug_token: debugToken
        }
    };
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
const DB_NAME = 'firebase-app-check-database';
const DB_VERSION = 1;
const STORE_NAME = 'firebase-app-check-store';
const DEBUG_TOKEN_KEY = 'debug-token';
let dbPromise = null;
function getDBPromise() {
    if (dbPromise) {
        return dbPromise;
    }
    dbPromise = new Promise((resolve, reject) => {
        try {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onsuccess = event => {
                resolve(event.target.result);
            };
            request.onerror = event => {
                var _a;
                reject(ERROR_FACTORY.create("storage-open" /* AppCheckError.STORAGE_OPEN */, {
                    originalErrorMessage: (_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message
                }));
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
                        db.createObjectStore(STORE_NAME, {
                            keyPath: 'compositeKey'
                        });
                }
            };
        }
        catch (e) {
            reject(ERROR_FACTORY.create("storage-open" /* AppCheckError.STORAGE_OPEN */, {
                originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
            }));
        }
    });
    return dbPromise;
}
function readTokenFromIndexedDB(app) {
    return read(computeKey(app));
}
function writeTokenToIndexedDB(app, token) {
    return write(computeKey(app), token);
}
function writeDebugTokenToIndexedDB(token) {
    return write(DEBUG_TOKEN_KEY, token);
}
function readDebugTokenFromIndexedDB() {
    return read(DEBUG_TOKEN_KEY);
}
async function write(key, value) {
    const db = await getDBPromise();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({
        compositeKey: key,
        value
    });
    return new Promise((resolve, reject) => {
        request.onsuccess = _event => {
            resolve();
        };
        transaction.onerror = event => {
            var _a;
            reject(ERROR_FACTORY.create("storage-set" /* AppCheckError.STORAGE_WRITE */, {
                originalErrorMessage: (_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message
            }));
        };
    });
}
async function read(key) {
    const db = await getDBPromise();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    return new Promise((resolve, reject) => {
        request.onsuccess = event => {
            const result = event.target.result;
            if (result) {
                resolve(result.value);
            }
            else {
                resolve(undefined);
            }
        };
        transaction.onerror = event => {
            var _a;
            reject(ERROR_FACTORY.create("storage-get" /* AppCheckError.STORAGE_GET */, {
                originalErrorMessage: (_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message
            }));
        };
    });
}
function computeKey(app) {
    return `${app.options.appId}-${app.name}`;
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
const logger = new Logger('@firebase/app-check');

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
 * Always resolves. In case of an error reading from indexeddb, resolve with undefined
 */
async function readTokenFromStorage(app) {
    if (isIndexedDBAvailable()) {
        let token = undefined;
        try {
            token = await readTokenFromIndexedDB(app);
        }
        catch (e) {
            // swallow the error and return undefined
            logger.warn(`Failed to read token from IndexedDB. Error: ${e}`);
        }
        return token;
    }
    return undefined;
}
/**
 * Always resolves. In case of an error writing to indexeddb, print a warning and resolve the promise
 */
function writeTokenToStorage(app, token) {
    if (isIndexedDBAvailable()) {
        return writeTokenToIndexedDB(app, token).catch(e => {
            // swallow the error and resolve the promise
            logger.warn(`Failed to write token to IndexedDB. Error: ${e}`);
        });
    }
    return Promise.resolve();
}
async function readOrCreateDebugTokenFromStorage() {
    /**
     * Theoretically race condition can happen if we read, then write in 2 separate transactions.
     * But it won't happen here, because this function will be called exactly once.
     */
    let existingDebugToken = undefined;
    try {
        existingDebugToken = await readDebugTokenFromIndexedDB();
    }
    catch (_e) {
        // failed to read from indexeddb. We assume there is no existing debug token, and generate a new one.
    }
    if (!existingDebugToken) {
        // create a new debug token
        const newToken = uuidv4();
        // We don't need to block on writing to indexeddb
        // In case persistence failed, a new debug token will be generated everytime the page is refreshed.
        // It renders the debug token useless because you have to manually register(whitelist) the new token in the firebase console again and again.
        // If you see this error trying to use debug token, it probably means you are using a browser that doesn't support indexeddb.
        // You should switch to a different browser that supports indexeddb
        writeDebugTokenToIndexedDB(newToken).catch(e => logger.warn(`Failed to persist debug token to IndexedDB. Error: ${e}`));
        return newToken;
    }
    else {
        return existingDebugToken;
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
function isDebugMode() {
    const debugState = getDebugState();
    return debugState.enabled;
}
async function getDebugToken() {
    const state = getDebugState();
    if (state.enabled && state.token) {
        return state.token.promise;
    }
    else {
        // should not happen!
        throw Error(`
            Can't get debug token in production mode.
        `);
    }
}
function initializeDebugMode() {
    const globals = getGlobal();
    const debugState = getDebugState();
    // Set to true if this function has been called, whether or not
    // it enabled debug mode.
    debugState.initialized = true;
    if (typeof globals.FIREBASE_APPCHECK_DEBUG_TOKEN !== 'string' &&
        globals.FIREBASE_APPCHECK_DEBUG_TOKEN !== true) {
        return;
    }
    debugState.enabled = true;
    const deferredToken = new Deferred();
    debugState.token = deferredToken;
    if (typeof globals.FIREBASE_APPCHECK_DEBUG_TOKEN === 'string') {
        deferredToken.resolve(globals.FIREBASE_APPCHECK_DEBUG_TOKEN);
    }
    else {
        deferredToken.resolve(readOrCreateDebugTokenFromStorage());
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
// Initial hardcoded value agreed upon across platforms for initial launch.
// Format left open for possible dynamic error values and other fields in the future.
const defaultTokenErrorData = { error: 'UNKNOWN_ERROR' };
/**
 * Stringify and base64 encode token error data.
 *
 * @param tokenError Error data, currently hardcoded.
 */
function formatDummyToken(tokenErrorData) {
    return base64.encodeString(JSON.stringify(tokenErrorData), 
    /* webSafe= */ false);
}
/**
 * This function always resolves.
 * The result will contain an error field if there is any error.
 * In case there is an error, the token field in the result will be populated with a dummy value
 */
async function getToken$2(appCheck, forceRefresh = false) {
    const app = appCheck.app;
    ensureActivated(app);
    const state = getStateReference(app);
    /**
     * First check if there is a token in memory from a previous `getToken()` call.
     */
    let token = state.token;
    let error = undefined;
    /**
     * If an invalid token was found in memory, clear token from
     * memory and unset the local variable `token`.
     */
    if (token && !isValid(token)) {
        state.token = undefined;
        token = undefined;
    }
    /**
     * If there is no valid token in memory, try to load token from indexedDB.
     */
    if (!token) {
        // cachedTokenPromise contains the token found in IndexedDB or undefined if not found.
        const cachedToken = await state.cachedTokenPromise;
        if (cachedToken) {
            if (isValid(cachedToken)) {
                token = cachedToken;
            }
            else {
                // If there was an invalid token in the indexedDB cache, clear it.
                await writeTokenToStorage(app, undefined);
            }
        }
    }
    // Return the cached token (from either memory or indexedDB) if it's valid
    if (!forceRefresh && token && isValid(token)) {
        return {
            token: token.token
        };
    }
    // Only set to true if this `getToken()` call is making the actual
    // REST call to the exchange endpoint, versus waiting for an already
    // in-flight call (see debug and regular exchange endpoint paths below)
    let shouldCallListeners = false;
    /**
     * DEBUG MODE
     * If debug mode is set, and there is no cached token, fetch a new App
     * Check token using the debug token, and return it directly.
     */
    if (isDebugMode()) {
        // Avoid making another call to the exchange endpoint if one is in flight.
        if (!state.exchangeTokenPromise) {
            state.exchangeTokenPromise = exchangeToken(getExchangeDebugTokenRequest(app, await getDebugToken()), appCheck.heartbeatServiceProvider).finally(() => {
                // Clear promise when settled - either resolved or rejected.
                state.exchangeTokenPromise = undefined;
            });
            shouldCallListeners = true;
        }
        const tokenFromDebugExchange = await state.exchangeTokenPromise;
        // Write debug token to indexedDB.
        await writeTokenToStorage(app, tokenFromDebugExchange);
        // Write debug token to state.
        state.token = tokenFromDebugExchange;
        return { token: tokenFromDebugExchange.token };
    }
    /**
     * There are no valid tokens in memory or indexedDB and we are not in
     * debug mode.
     * Request a new token from the exchange endpoint.
     */
    try {
        // Avoid making another call to the exchange endpoint if one is in flight.
        if (!state.exchangeTokenPromise) {
            // state.provider is populated in initializeAppCheck()
            // ensureActivated() at the top of this function checks that
            // initializeAppCheck() has been called.
            state.exchangeTokenPromise = state.provider.getToken().finally(() => {
                // Clear promise when settled - either resolved or rejected.
                state.exchangeTokenPromise = undefined;
            });
            shouldCallListeners = true;
        }
        token = await getStateReference(app).exchangeTokenPromise;
    }
    catch (e) {
        if (e.code === `appCheck/${"throttled" /* AppCheckError.THROTTLED */}`) {
            // Warn if throttled, but do not treat it as an error.
            logger.warn(e.message);
        }
        else {
            // `getToken()` should never throw, but logging error text to console will aid debugging.
            logger.error(e);
        }
        // Always save error to be added to dummy token.
        error = e;
    }
    let interopTokenResult;
    if (!token) {
        // If token is undefined, there must be an error.
        // Return a dummy token along with the error.
        interopTokenResult = makeDummyTokenResult(error);
    }
    else if (error) {
        if (isValid(token)) {
            // It's also possible a valid token exists, but there's also an error.
            // (Such as if the token is almost expired, tries to refresh, and
            // the exchange request fails.)
            // We add a special error property here so that the refresher will
            // count this as a failed attempt and use the backoff instead of
            // retrying repeatedly with no delay, but any 3P listeners will not
            // be hindered in getting the still-valid token.
            interopTokenResult = {
                token: token.token,
                internalError: error
            };
        }
        else {
            // No invalid tokens should make it to this step. Memory and cached tokens
            // are checked. Other tokens are from fresh exchanges. But just in case.
            interopTokenResult = makeDummyTokenResult(error);
        }
    }
    else {
        interopTokenResult = {
            token: token.token
        };
        // write the new token to the memory state as well as the persistent storage.
        // Only do it if we got a valid new token
        state.token = token;
        await writeTokenToStorage(app, token);
    }
    if (shouldCallListeners) {
        notifyTokenListeners(app, interopTokenResult);
    }
    return interopTokenResult;
}
/**
 * Internal API for limited use tokens. Skips all FAC state and simply calls
 * the underlying provider.
 */
async function getLimitedUseToken$1(appCheck) {
    const app = appCheck.app;
    ensureActivated(app);
    const { provider } = getStateReference(app);
    if (isDebugMode()) {
        const debugToken = await getDebugToken();
        const { token } = await exchangeToken(getExchangeDebugTokenRequest(app, debugToken), appCheck.heartbeatServiceProvider);
        return { token };
    }
    else {
        // provider is definitely valid since we ensure AppCheck was activated
        const { token } = await provider.getToken();
        return { token };
    }
}
function addTokenListener(appCheck, type, listener, onError) {
    const { app } = appCheck;
    const state = getStateReference(app);
    const tokenObserver = {
        next: listener,
        error: onError,
        type
    };
    state.tokenObservers = [...state.tokenObservers, tokenObserver];
    // Invoke the listener async immediately if there is a valid token
    // in memory.
    if (state.token && isValid(state.token)) {
        const validToken = state.token;
        Promise.resolve()
            .then(() => {
            listener({ token: validToken.token });
            initTokenRefresher(appCheck);
        })
            .catch(() => {
            /* we don't care about exceptions thrown in listeners */
        });
    }
    /**
     * Wait for any cached token promise to resolve before starting the token
     * refresher. The refresher checks to see if there is an existing token
     * in state and calls the exchange endpoint if not. We should first let the
     * IndexedDB check have a chance to populate state if it can.
     *
     * Listener call isn't needed here because cachedTokenPromise will call any
     * listeners that exist when it resolves.
     */
    // state.cachedTokenPromise is always populated in `activate()`.
    void state.cachedTokenPromise.then(() => initTokenRefresher(appCheck));
}
function removeTokenListener(app, listener) {
    const state = getStateReference(app);
    const newObservers = state.tokenObservers.filter(tokenObserver => tokenObserver.next !== listener);
    if (newObservers.length === 0 &&
        state.tokenRefresher &&
        state.tokenRefresher.isRunning()) {
        state.tokenRefresher.stop();
    }
    state.tokenObservers = newObservers;
}
/**
 * Logic to create and start refresher as needed.
 */
function initTokenRefresher(appCheck) {
    const { app } = appCheck;
    const state = getStateReference(app);
    // Create the refresher but don't start it if `isTokenAutoRefreshEnabled`
    // is not true.
    let refresher = state.tokenRefresher;
    if (!refresher) {
        refresher = createTokenRefresher(appCheck);
        state.tokenRefresher = refresher;
    }
    if (!refresher.isRunning() && state.isTokenAutoRefreshEnabled) {
        refresher.start();
    }
}
function createTokenRefresher(appCheck) {
    const { app } = appCheck;
    return new Refresher(
    // Keep in mind when this fails for any reason other than the ones
    // for which we should retry, it will effectively stop the proactive refresh.
    async () => {
        const state = getStateReference(app);
        // If there is no token, we will try to load it from storage and use it
        // If there is a token, we force refresh it because we know it's going to expire soon
        let result;
        if (!state.token) {
            result = await getToken$2(appCheck);
        }
        else {
            result = await getToken$2(appCheck, true);
        }
        /**
         * getToken() always resolves. In case the result has an error field defined, it means
         * the operation failed, and we should retry.
         */
        if (result.error) {
            throw result.error;
        }
        /**
         * A special `internalError` field reflects that there was an error
         * getting a new token from the exchange endpoint, but there's still a
         * previous token that's valid for now and this should be passed to 2P/3P
         * requests for a token. But we want this callback (`this.operation` in
         * `Refresher`) to throw in order to kick off the Refresher's retry
         * backoff. (Setting `hasSucceeded` to false.)
         */
        if (result.internalError) {
            throw result.internalError;
        }
    }, () => {
        return true;
    }, () => {
        const state = getStateReference(app);
        if (state.token) {
            // issuedAtTime + (50% * total TTL) + 5 minutes
            let nextRefreshTimeMillis = state.token.issuedAtTimeMillis +
                (state.token.expireTimeMillis - state.token.issuedAtTimeMillis) *
                    0.5 +
                5 * 60 * 1000;
            // Do not allow refresh time to be past (expireTime - 5 minutes)
            const latestAllowableRefresh = state.token.expireTimeMillis - 5 * 60 * 1000;
            nextRefreshTimeMillis = Math.min(nextRefreshTimeMillis, latestAllowableRefresh);
            return Math.max(0, nextRefreshTimeMillis - Date.now());
        }
        else {
            return 0;
        }
    }, TOKEN_REFRESH_TIME.RETRIAL_MIN_WAIT, TOKEN_REFRESH_TIME.RETRIAL_MAX_WAIT);
}
function notifyTokenListeners(app, token) {
    const observers = getStateReference(app).tokenObservers;
    for (const observer of observers) {
        try {
            if (observer.type === "EXTERNAL" /* ListenerType.EXTERNAL */ && token.error != null) {
                // If this listener was added by a 3P call, send any token error to
                // the supplied error handler. A 3P observer always has an error
                // handler.
                observer.error(token.error);
            }
            else {
                // If the token has no error field, always return the token.
                // If this is a 2P listener, return the token, whether or not it
                // has an error field.
                observer.next(token);
            }
        }
        catch (e) {
            // Errors in the listener function itself are always ignored.
        }
    }
}
function isValid(token) {
    return token.expireTimeMillis - Date.now() > 0;
}
function makeDummyTokenResult(error) {
    return {
        token: formatDummyToken(defaultTokenErrorData),
        error
    };
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
 * AppCheck Service class.
 */
class AppCheckService {
    constructor(app, heartbeatServiceProvider) {
        this.app = app;
        this.heartbeatServiceProvider = heartbeatServiceProvider;
    }
    _delete() {
        const { tokenObservers } = getStateReference(this.app);
        for (const tokenObserver of tokenObservers) {
            removeTokenListener(this.app, tokenObserver.next);
        }
        return Promise.resolve();
    }
}
function factory(app, heartbeatServiceProvider) {
    return new AppCheckService(app, heartbeatServiceProvider);
}
function internalFactory(appCheck) {
    return {
        getToken: forceRefresh => getToken$2(appCheck, forceRefresh),
        getLimitedUseToken: () => getLimitedUseToken$1(appCheck),
        addTokenListener: listener => addTokenListener(appCheck, "INTERNAL" /* ListenerType.INTERNAL */, listener),
        removeTokenListener: listener => removeTokenListener(appCheck.app, listener)
    };
}

const name = "@firebase/app-check";
const version = "0.8.1";

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
const RECAPTCHA_URL = 'https://www.google.com/recaptcha/api.js';
const RECAPTCHA_ENTERPRISE_URL = 'https://www.google.com/recaptcha/enterprise.js';
function initializeV3(app, siteKey) {
    const initialized = new Deferred();
    const state = getStateReference(app);
    state.reCAPTCHAState = { initialized };
    const divId = makeDiv(app);
    const grecaptcha = getRecaptcha(false);
    if (!grecaptcha) {
        loadReCAPTCHAV3Script(() => {
            const grecaptcha = getRecaptcha(false);
            if (!grecaptcha) {
                // it shouldn't happen.
                throw new Error('no recaptcha');
            }
            queueWidgetRender(app, siteKey, grecaptcha, divId, initialized);
        });
    }
    else {
        queueWidgetRender(app, siteKey, grecaptcha, divId, initialized);
    }
    return initialized.promise;
}
function initializeEnterprise(app, siteKey) {
    const initialized = new Deferred();
    const state = getStateReference(app);
    state.reCAPTCHAState = { initialized };
    const divId = makeDiv(app);
    const grecaptcha = getRecaptcha(true);
    if (!grecaptcha) {
        loadReCAPTCHAEnterpriseScript(() => {
            const grecaptcha = getRecaptcha(true);
            if (!grecaptcha) {
                // it shouldn't happen.
                throw new Error('no recaptcha');
            }
            queueWidgetRender(app, siteKey, grecaptcha, divId, initialized);
        });
    }
    else {
        queueWidgetRender(app, siteKey, grecaptcha, divId, initialized);
    }
    return initialized.promise;
}
/**
 * Add listener to render the widget and resolve the promise when
 * the grecaptcha.ready() event fires.
 */
function queueWidgetRender(app, siteKey, grecaptcha, container, initialized) {
    grecaptcha.ready(() => {
        // Invisible widgets allow us to set a different siteKey for each widget,
        // so we use them to support multiple apps
        renderInvisibleWidget(app, siteKey, grecaptcha, container);
        initialized.resolve(grecaptcha);
    });
}
/**
 * Add invisible div to page.
 */
function makeDiv(app) {
    const divId = `fire_app_check_${app.name}`;
    const invisibleDiv = document.createElement('div');
    invisibleDiv.id = divId;
    invisibleDiv.style.display = 'none';
    document.body.appendChild(invisibleDiv);
    return divId;
}
async function getToken$1(app) {
    ensureActivated(app);
    // ensureActivated() guarantees that reCAPTCHAState is set
    const reCAPTCHAState = getStateReference(app).reCAPTCHAState;
    const recaptcha = await reCAPTCHAState.initialized.promise;
    return new Promise((resolve, _reject) => {
        // Updated after initialization is complete.
        const reCAPTCHAState = getStateReference(app).reCAPTCHAState;
        recaptcha.ready(() => {
            resolve(
            // widgetId is guaranteed to be available if reCAPTCHAState.initialized.promise resolved.
            recaptcha.execute(reCAPTCHAState.widgetId, {
                action: 'fire_app_check'
            }));
        });
    });
}
/**
 *
 * @param app
 * @param container - Id of a HTML element.
 */
function renderInvisibleWidget(app, siteKey, grecaptcha, container) {
    const widgetId = grecaptcha.render(container, {
        sitekey: siteKey,
        size: 'invisible',
        // Success callback - set state
        callback: () => {
            getStateReference(app).reCAPTCHAState.succeeded = true;
        },
        // Failure callback - set state
        'error-callback': () => {
            getStateReference(app).reCAPTCHAState.succeeded = false;
        }
    });
    const state = getStateReference(app);
    state.reCAPTCHAState = Object.assign(Object.assign({}, state.reCAPTCHAState), { // state.reCAPTCHAState is set in the initialize()
        widgetId });
}
function loadReCAPTCHAV3Script(onload) {
    const script = document.createElement('script');
    script.src = RECAPTCHA_URL;
    script.onload = onload;
    document.head.appendChild(script);
}
function loadReCAPTCHAEnterpriseScript(onload) {
    const script = document.createElement('script');
    script.src = RECAPTCHA_ENTERPRISE_URL;
    script.onload = onload;
    document.head.appendChild(script);
}

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
/**
 * App Check provider that can obtain a reCAPTCHA V3 token and exchange it
 * for an App Check token.
 *
 * @public
 */
class ReCaptchaV3Provider {
    /**
     * Create a ReCaptchaV3Provider instance.
     * @param siteKey - ReCAPTCHA V3 siteKey.
     */
    constructor(_siteKey) {
        this._siteKey = _siteKey;
        /**
         * Throttle requests on certain error codes to prevent too many retries
         * in a short time.
         */
        this._throttleData = null;
    }
    /**
     * Returns an App Check token.
     * @internal
     */
    async getToken() {
        var _a, _b, _c;
        throwIfThrottled(this._throttleData);
        // Top-level `getToken()` has already checked that App Check is initialized
        // and therefore this._app and this._heartbeatServiceProvider are available.
        const attestedClaimsToken = await getToken$1(this._app).catch(_e => {
            // reCaptcha.execute() throws null which is not very descriptive.
            throw ERROR_FACTORY.create("recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */);
        });
        // Check if a failure state was set by the recaptcha "error-callback".
        if (!((_a = getStateReference(this._app).reCAPTCHAState) === null || _a === void 0 ? void 0 : _a.succeeded)) {
            throw ERROR_FACTORY.create("recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */);
        }
        let result;
        try {
            result = await exchangeToken(getExchangeRecaptchaV3TokenRequest(this._app, attestedClaimsToken), this._heartbeatServiceProvider);
        }
        catch (e) {
            if ((_b = e.code) === null || _b === void 0 ? void 0 : _b.includes("fetch-status-error" /* AppCheckError.FETCH_STATUS_ERROR */)) {
                this._throttleData = setBackoff(Number((_c = e.customData) === null || _c === void 0 ? void 0 : _c.httpStatus), this._throttleData);
                throw ERROR_FACTORY.create("throttled" /* AppCheckError.THROTTLED */, {
                    time: getDurationString(this._throttleData.allowRequestsAfter - Date.now()),
                    httpStatus: this._throttleData.httpStatus
                });
            }
            else {
                throw e;
            }
        }
        // If successful, clear throttle data.
        this._throttleData = null;
        return result;
    }
    /**
     * @internal
     */
    initialize(app) {
        this._app = app;
        this._heartbeatServiceProvider = _getProvider(app, 'heartbeat');
        initializeV3(app, this._siteKey).catch(() => {
            /* we don't care about the initialization result */
        });
    }
    /**
     * @internal
     */
    isEqual(otherProvider) {
        if (otherProvider instanceof ReCaptchaV3Provider) {
            return this._siteKey === otherProvider._siteKey;
        }
        else {
            return false;
        }
    }
}
/**
 * App Check provider that can obtain a reCAPTCHA Enterprise token and exchange it
 * for an App Check token.
 *
 * @public
 */
class ReCaptchaEnterpriseProvider {
    /**
     * Create a ReCaptchaEnterpriseProvider instance.
     * @param siteKey - reCAPTCHA Enterprise score-based site key.
     */
    constructor(_siteKey) {
        this._siteKey = _siteKey;
        /**
         * Throttle requests on certain error codes to prevent too many retries
         * in a short time.
         */
        this._throttleData = null;
    }
    /**
     * Returns an App Check token.
     * @internal
     */
    async getToken() {
        var _a, _b, _c;
        throwIfThrottled(this._throttleData);
        // Top-level `getToken()` has already checked that App Check is initialized
        // and therefore this._app and this._heartbeatServiceProvider are available.
        const attestedClaimsToken = await getToken$1(this._app).catch(_e => {
            // reCaptcha.execute() throws null which is not very descriptive.
            throw ERROR_FACTORY.create("recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */);
        });
        // Check if a failure state was set by the recaptcha "error-callback".
        if (!((_a = getStateReference(this._app).reCAPTCHAState) === null || _a === void 0 ? void 0 : _a.succeeded)) {
            throw ERROR_FACTORY.create("recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */);
        }
        let result;
        try {
            result = await exchangeToken(getExchangeRecaptchaEnterpriseTokenRequest(this._app, attestedClaimsToken), this._heartbeatServiceProvider);
        }
        catch (e) {
            if ((_b = e.code) === null || _b === void 0 ? void 0 : _b.includes("fetch-status-error" /* AppCheckError.FETCH_STATUS_ERROR */)) {
                this._throttleData = setBackoff(Number((_c = e.customData) === null || _c === void 0 ? void 0 : _c.httpStatus), this._throttleData);
                throw ERROR_FACTORY.create("throttled" /* AppCheckError.THROTTLED */, {
                    time: getDurationString(this._throttleData.allowRequestsAfter - Date.now()),
                    httpStatus: this._throttleData.httpStatus
                });
            }
            else {
                throw e;
            }
        }
        // If successful, clear throttle data.
        this._throttleData = null;
        return result;
    }
    /**
     * @internal
     */
    initialize(app) {
        this._app = app;
        this._heartbeatServiceProvider = _getProvider(app, 'heartbeat');
        initializeEnterprise(app, this._siteKey).catch(() => {
            /* we don't care about the initialization result */
        });
    }
    /**
     * @internal
     */
    isEqual(otherProvider) {
        if (otherProvider instanceof ReCaptchaEnterpriseProvider) {
            return this._siteKey === otherProvider._siteKey;
        }
        else {
            return false;
        }
    }
}
/**
 * Custom provider class.
 * @public
 */
class CustomProvider {
    constructor(_customProviderOptions) {
        this._customProviderOptions = _customProviderOptions;
    }
    /**
     * @internal
     */
    async getToken() {
        // custom provider
        const customToken = await this._customProviderOptions.getToken();
        // Try to extract IAT from custom token, in case this token is not
        // being newly issued. JWT timestamps are in seconds since epoch.
        const issuedAtTimeSeconds = issuedAtTime(customToken.token);
        // Very basic validation, use current timestamp as IAT if JWT
        // has no `iat` field or value is out of bounds.
        const issuedAtTimeMillis = issuedAtTimeSeconds !== null &&
            issuedAtTimeSeconds < Date.now() &&
            issuedAtTimeSeconds > 0
            ? issuedAtTimeSeconds * 1000
            : Date.now();
        return Object.assign(Object.assign({}, customToken), { issuedAtTimeMillis });
    }
    /**
     * @internal
     */
    initialize(app) {
        this._app = app;
    }
    /**
     * @internal
     */
    isEqual(otherProvider) {
        if (otherProvider instanceof CustomProvider) {
            return (this._customProviderOptions.getToken.toString() ===
                otherProvider._customProviderOptions.getToken.toString());
        }
        else {
            return false;
        }
    }
}
/**
 * Set throttle data to block requests until after a certain time
 * depending on the failed request's status code.
 * @param httpStatus - Status code of failed request.
 * @param throttleData - `ThrottleData` object containing previous throttle
 * data state.
 * @returns Data about current throttle state and expiration time.
 */
function setBackoff(httpStatus, throttleData) {
    /**
     * Block retries for 1 day for the following error codes:
     *
     * 404: Likely malformed URL.
     *
     * 403:
     * - Attestation failed
     * - Wrong API key
     * - Project deleted
     */
    if (httpStatus === 404 || httpStatus === 403) {
        return {
            backoffCount: 1,
            allowRequestsAfter: Date.now() + ONE_DAY,
            httpStatus
        };
    }
    else {
        /**
         * For all other error codes, the time when it is ok to retry again
         * is based on exponential backoff.
         */
        const backoffCount = throttleData ? throttleData.backoffCount : 0;
        const backoffMillis = calculateBackoffMillis(backoffCount, 1000, 2);
        return {
            backoffCount: backoffCount + 1,
            allowRequestsAfter: Date.now() + backoffMillis,
            httpStatus
        };
    }
}
function throwIfThrottled(throttleData) {
    if (throttleData) {
        if (Date.now() - throttleData.allowRequestsAfter <= 0) {
            // If before, throw.
            throw ERROR_FACTORY.create("throttled" /* AppCheckError.THROTTLED */, {
                time: getDurationString(throttleData.allowRequestsAfter - Date.now()),
                httpStatus: throttleData.httpStatus
            });
        }
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
 * Activate App Check for the given app. Can be called only once per app.
 * @param app - the {@link @firebase/app#FirebaseApp} to activate App Check for
 * @param options - App Check initialization options
 * @public
 */
function initializeAppCheck(app = getApp(), options) {
    app = getModularInstance(app);
    const provider = _getProvider(app, 'app-check');
    // Ensure initializeDebugMode() is only called once.
    if (!getDebugState().initialized) {
        initializeDebugMode();
    }
    // Log a message containing the debug token when `initializeAppCheck()`
    // is called in debug mode.
    if (isDebugMode()) {
        // Do not block initialization to get the token for the message.
        void getDebugToken().then(token => 
        // Not using logger because I don't think we ever want this accidentally hidden.
        console.log(`App Check debug token: ${token}. You will need to add it to your app's App Check settings in the Firebase console for it to work.`));
    }
    if (provider.isInitialized()) {
        const existingInstance = provider.getImmediate();
        const initialOptions = provider.getOptions();
        if (initialOptions.isTokenAutoRefreshEnabled ===
            options.isTokenAutoRefreshEnabled &&
            initialOptions.provider.isEqual(options.provider)) {
            return existingInstance;
        }
        else {
            throw ERROR_FACTORY.create("already-initialized" /* AppCheckError.ALREADY_INITIALIZED */, {
                appName: app.name
            });
        }
    }
    const appCheck = provider.initialize({ options });
    _activate(app, options.provider, options.isTokenAutoRefreshEnabled);
    // If isTokenAutoRefreshEnabled is false, do not send any requests to the
    // exchange endpoint without an explicit call from the user either directly
    // or through another Firebase library (storage, functions, etc.)
    if (getStateReference(app).isTokenAutoRefreshEnabled) {
        // Adding a listener will start the refresher and fetch a token if needed.
        // This gets a token ready and prevents a delay when an internal library
        // requests the token.
        // Listener function does not need to do anything, its base functionality
        // of calling getToken() already fetches token and writes it to memory/storage.
        addTokenListener(appCheck, "INTERNAL" /* ListenerType.INTERNAL */, () => { });
    }
    return appCheck;
}
/**
 * Activate App Check
 * @param app - Firebase app to activate App Check for.
 * @param provider - reCAPTCHA v3 provider or
 * custom token provider.
 * @param isTokenAutoRefreshEnabled - If true, the SDK automatically
 * refreshes App Check tokens as needed. If undefined, defaults to the
 * value of `app.automaticDataCollectionEnabled`, which defaults to
 * false and can be set in the app config.
 */
function _activate(app, provider, isTokenAutoRefreshEnabled) {
    // Create an entry in the APP_CHECK_STATES map. Further changes should
    // directly mutate this object.
    const state = setInitialState(app, Object.assign({}, DEFAULT_STATE));
    state.activated = true;
    state.provider = provider; // Read cached token from storage if it exists and store it in memory.
    state.cachedTokenPromise = readTokenFromStorage(app).then(cachedToken => {
        if (cachedToken && isValid(cachedToken)) {
            state.token = cachedToken;
            // notify all listeners with the cached token
            notifyTokenListeners(app, { token: cachedToken.token });
        }
        return cachedToken;
    });
    // Use value of global `automaticDataCollectionEnabled` (which
    // itself defaults to false if not specified in config) if
    // `isTokenAutoRefreshEnabled` param was not provided by user.
    state.isTokenAutoRefreshEnabled =
        isTokenAutoRefreshEnabled === undefined
            ? app.automaticDataCollectionEnabled
            : isTokenAutoRefreshEnabled;
    state.provider.initialize(app);
}
/**
 * Set whether App Check will automatically refresh tokens as needed.
 *
 * @param appCheckInstance - The App Check service instance.
 * @param isTokenAutoRefreshEnabled - If true, the SDK automatically
 * refreshes App Check tokens as needed. This overrides any value set
 * during `initializeAppCheck()`.
 * @public
 */
function setTokenAutoRefreshEnabled(appCheckInstance, isTokenAutoRefreshEnabled) {
    const app = appCheckInstance.app;
    const state = getStateReference(app);
    // This will exist if any product libraries have called
    // `addTokenListener()`
    if (state.tokenRefresher) {
        if (isTokenAutoRefreshEnabled === true) {
            state.tokenRefresher.start();
        }
        else {
            state.tokenRefresher.stop();
        }
    }
    state.isTokenAutoRefreshEnabled = isTokenAutoRefreshEnabled;
}
/**
 * Get the current App Check token. Attaches to the most recent
 * in-flight request if one is present. Returns null if no token
 * is present and no token requests are in-flight.
 *
 * @param appCheckInstance - The App Check service instance.
 * @param forceRefresh - If true, will always try to fetch a fresh token.
 * If false, will use a cached token if found in storage.
 * @public
 */
async function getToken(appCheckInstance, forceRefresh) {
    const result = await getToken$2(appCheckInstance, forceRefresh);
    if (result.error) {
        throw result.error;
    }
    return { token: result.token };
}
/**
 * Requests a Firebase App Check token. This method should be used
 * only if you need to authorize requests to a non-Firebase backend.
 *
 * Returns limited-use tokens that are intended for use with your
 * non-Firebase backend endpoints that are protected with
 * <a href="https://firebase.google.com/docs/app-check/custom-resource-backend#replay-protection">
 * Replay Protection</a>. This method
 * does not affect the token generation behavior of the
 * #getAppCheckToken() method.
 *
 * @param appCheckInstance - The App Check service instance.
 * @returns The limited use token.
 * @public
 */
function getLimitedUseToken(appCheckInstance) {
    return getLimitedUseToken$1(appCheckInstance);
}
/**
 * Wraps `addTokenListener`/`removeTokenListener` methods in an `Observer`
 * pattern for public use.
 */
function onTokenChanged(appCheckInstance, onNextOrObserver, onError, 
/**
 * NOTE: Although an `onCompletion` callback can be provided, it will
 * never be called because the token stream is never-ending.
 * It is added only for API consistency with the observer pattern, which
 * we follow in JS APIs.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
onCompletion) {
    let nextFn = () => { };
    let errorFn = () => { };
    if (onNextOrObserver.next != null) {
        nextFn = onNextOrObserver.next.bind(onNextOrObserver);
    }
    else {
        nextFn = onNextOrObserver;
    }
    if (onNextOrObserver.error != null) {
        errorFn = onNextOrObserver.error.bind(onNextOrObserver);
    }
    else if (onError) {
        errorFn = onError;
    }
    addTokenListener(appCheckInstance, "EXTERNAL" /* ListenerType.EXTERNAL */, nextFn, errorFn);
    return () => removeTokenListener(appCheckInstance.app, nextFn);
}

/**
 * The Firebase App Check Web SDK.
 *
 * @remarks
 * Firebase App Check does not work in a Node.js environment using `ReCaptchaV3Provider` or
 * `ReCaptchaEnterpriseProvider`, but can be used in Node.js if you use
 * `CustomProvider` and write your own attestation method.
 *
 * @packageDocumentation
 */
const APP_CHECK_NAME = 'app-check';
const APP_CHECK_NAME_INTERNAL = 'app-check-internal';
function registerAppCheck() {
    // The public interface
    _registerComponent(new Component(APP_CHECK_NAME, container => {
        // getImmediate for FirebaseApp will always succeed
        const app = container.getProvider('app').getImmediate();
        const heartbeatServiceProvider = container.getProvider('heartbeat');
        return factory(app, heartbeatServiceProvider);
    }, "PUBLIC" /* ComponentType.PUBLIC */)
        .setInstantiationMode("EXPLICIT" /* InstantiationMode.EXPLICIT */)
        /**
         * Initialize app-check-internal after app-check is initialized to make AppCheck available to
         * other Firebase SDKs
         */
        .setInstanceCreatedCallback((container, _identifier, _appcheckService) => {
        container.getProvider(APP_CHECK_NAME_INTERNAL).initialize();
    }));
    // The internal interface used by other Firebase products
    _registerComponent(new Component(APP_CHECK_NAME_INTERNAL, container => {
        const appCheck = container.getProvider('app-check').getImmediate();
        return internalFactory(appCheck);
    }, "PUBLIC" /* ComponentType.PUBLIC */).setInstantiationMode("EXPLICIT" /* InstantiationMode.EXPLICIT */));
    registerVersion(name, version);
}
registerAppCheck();

export { CustomProvider, ReCaptchaEnterpriseProvider, ReCaptchaV3Provider, getLimitedUseToken, getToken, initializeAppCheck, onTokenChanged, setTokenAutoRefreshEnabled };
//# sourceMappingURL=index.esm2017.js.map
