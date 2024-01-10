'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var app = require('@firebase/app');
var component = require('@firebase/component');
var tslib = require('tslib');
var util = require('@firebase/util');
var logger$1 = require('@firebase/logger');

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
var APP_CHECK_STATES = new Map();
var DEFAULT_STATE = {
    activated: false,
    tokenObservers: []
};
var DEBUG_STATE = {
    initialized: false,
    enabled: false
};
/**
 * Gets a reference to the state object.
 */
function getStateReference(app) {
    return APP_CHECK_STATES.get(app) || tslib.__assign({}, DEFAULT_STATE);
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
var BASE_ENDPOINT = 'https://content-firebaseappcheck.googleapis.com/v1';
var EXCHANGE_RECAPTCHA_TOKEN_METHOD = 'exchangeRecaptchaV3Token';
var EXCHANGE_RECAPTCHA_ENTERPRISE_TOKEN_METHOD = 'exchangeRecaptchaEnterpriseToken';
var EXCHANGE_DEBUG_TOKEN_METHOD = 'exchangeDebugToken';
var TOKEN_REFRESH_TIME = {
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
var ONE_DAY = 24 * 60 * 60 * 1000;

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
var Refresher = /** @class */ (function () {
    function Refresher(operation, retryPolicy, getWaitDuration, lowerBound, upperBound) {
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
    Refresher.prototype.start = function () {
        this.nextErrorWaitInterval = this.lowerBound;
        this.process(true).catch(function () {
            /* we don't care about the result */
        });
    };
    Refresher.prototype.stop = function () {
        if (this.pending) {
            this.pending.reject('cancelled');
            this.pending = null;
        }
    };
    Refresher.prototype.isRunning = function () {
        return !!this.pending;
    };
    Refresher.prototype.process = function (hasSucceeded) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var error_1;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.stop();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        this.pending = new util.Deferred();
                        this.pending.promise.catch(function (_e) {
                            /* ignore */
                        });
                        return [4 /*yield*/, sleep(this.getNextRun(hasSucceeded))];
                    case 2:
                        _a.sent();
                        // Why do we resolve a promise, then immediate wait for it?
                        // We do it to make the promise chain cancellable.
                        // We can call stop() which rejects the promise before the following line execute, which makes
                        // the code jump to the catch block.
                        // TODO: unit test this
                        this.pending.resolve();
                        return [4 /*yield*/, this.pending.promise];
                    case 3:
                        _a.sent();
                        this.pending = new util.Deferred();
                        this.pending.promise.catch(function (_e) {
                            /* ignore */
                        });
                        return [4 /*yield*/, this.operation()];
                    case 4:
                        _a.sent();
                        this.pending.resolve();
                        return [4 /*yield*/, this.pending.promise];
                    case 5:
                        _a.sent();
                        this.process(true).catch(function () {
                            /* we don't care about the result */
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        if (this.retryPolicy(error_1)) {
                            this.process(false).catch(function () {
                                /* we don't care about the result */
                            });
                        }
                        else {
                            this.stop();
                        }
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Refresher.prototype.getNextRun = function (hasSucceeded) {
        if (hasSucceeded) {
            // If last operation succeeded, reset next error wait interval and return
            // the default wait duration.
            this.nextErrorWaitInterval = this.lowerBound;
            // Return typical wait duration interval after a successful operation.
            return this.getWaitDuration();
        }
        else {
            // Get next error wait interval.
            var currentErrorWaitInterval = this.nextErrorWaitInterval;
            // Double interval for next consecutive error.
            this.nextErrorWaitInterval *= 2;
            // Make sure next wait interval does not exceed the maximum upper bound.
            if (this.nextErrorWaitInterval > this.upperBound) {
                this.nextErrorWaitInterval = this.upperBound;
            }
            return currentErrorWaitInterval;
        }
    };
    return Refresher;
}());
function sleep(ms) {
    return new Promise(function (resolve) {
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
var _a;
var ERRORS = (_a = {},
    _a["already-initialized" /* AppCheckError.ALREADY_INITIALIZED */] = 'You have already called initializeAppCheck() for FirebaseApp {$appName} with ' +
        'different options. To avoid this error, call initializeAppCheck() with the ' +
        'same options as when it was originally called. This will return the ' +
        'already initialized instance.',
    _a["use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */] = 'App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. ' +
        'Call initializeAppCheck() before instantiating other Firebase services.',
    _a["fetch-network-error" /* AppCheckError.FETCH_NETWORK_ERROR */] = 'Fetch failed to connect to a network. Check Internet connection. ' +
        'Original error: {$originalErrorMessage}.',
    _a["fetch-parse-error" /* AppCheckError.FETCH_PARSE_ERROR */] = 'Fetch client could not parse response.' +
        ' Original error: {$originalErrorMessage}.',
    _a["fetch-status-error" /* AppCheckError.FETCH_STATUS_ERROR */] = 'Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.',
    _a["storage-open" /* AppCheckError.STORAGE_OPEN */] = 'Error thrown when opening storage. Original error: {$originalErrorMessage}.',
    _a["storage-get" /* AppCheckError.STORAGE_GET */] = 'Error thrown when reading from storage. Original error: {$originalErrorMessage}.',
    _a["storage-set" /* AppCheckError.STORAGE_WRITE */] = 'Error thrown when writing to storage. Original error: {$originalErrorMessage}.',
    _a["recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */] = 'ReCAPTCHA error.',
    _a["throttled" /* AppCheckError.THROTTLED */] = "Requests throttled due to {$httpStatus} error. Attempts allowed again after {$time}",
    _a);
var ERROR_FACTORY = new util.ErrorFactory('appCheck', 'AppCheck', ERRORS);

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
function getRecaptcha(isEnterprise) {
    var _a;
    if (isEnterprise === void 0) { isEnterprise = false; }
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
    var totalSeconds = Math.round(durationInMillis / 1000);
    var days = Math.floor(totalSeconds / (3600 * 24));
    var hours = Math.floor((totalSeconds - days * 3600 * 24) / 3600);
    var minutes = Math.floor((totalSeconds - days * 3600 * 24 - hours * 3600) / 60);
    var seconds = totalSeconds - days * 3600 * 24 - hours * 3600 - minutes * 60;
    var result = '';
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
function exchangeToken(_a, heartbeatServiceProvider) {
    var url = _a.url, body = _a.body;
    return tslib.__awaiter(this, void 0, void 0, function () {
        var headers, heartbeatService, heartbeatsHeader, options, response, originalError_1, responseBody, originalError_2, match, timeToLiveAsNumber, now;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    headers = {
                        'Content-Type': 'application/json'
                    };
                    heartbeatService = heartbeatServiceProvider.getImmediate({
                        optional: true
                    });
                    if (!heartbeatService) return [3 /*break*/, 2];
                    return [4 /*yield*/, heartbeatService.getHeartbeatsHeader()];
                case 1:
                    heartbeatsHeader = _b.sent();
                    if (heartbeatsHeader) {
                        headers['X-Firebase-Client'] = heartbeatsHeader;
                    }
                    _b.label = 2;
                case 2:
                    options = {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: headers
                    };
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, fetch(url, options)];
                case 4:
                    response = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    originalError_1 = _b.sent();
                    throw ERROR_FACTORY.create("fetch-network-error" /* AppCheckError.FETCH_NETWORK_ERROR */, {
                        originalErrorMessage: originalError_1 === null || originalError_1 === void 0 ? void 0 : originalError_1.message
                    });
                case 6:
                    if (response.status !== 200) {
                        throw ERROR_FACTORY.create("fetch-status-error" /* AppCheckError.FETCH_STATUS_ERROR */, {
                            httpStatus: response.status
                        });
                    }
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, response.json()];
                case 8:
                    // JSON parsing throws SyntaxError if the response body isn't a JSON string.
                    responseBody = _b.sent();
                    return [3 /*break*/, 10];
                case 9:
                    originalError_2 = _b.sent();
                    throw ERROR_FACTORY.create("fetch-parse-error" /* AppCheckError.FETCH_PARSE_ERROR */, {
                        originalErrorMessage: originalError_2 === null || originalError_2 === void 0 ? void 0 : originalError_2.message
                    });
                case 10:
                    match = responseBody.ttl.match(/^([\d.]+)(s)$/);
                    if (!match || !match[2] || isNaN(Number(match[1]))) {
                        throw ERROR_FACTORY.create("fetch-parse-error" /* AppCheckError.FETCH_PARSE_ERROR */, {
                            originalErrorMessage: "ttl field (timeToLive) is not in standard Protobuf Duration " +
                                "format: ".concat(responseBody.ttl)
                        });
                    }
                    timeToLiveAsNumber = Number(match[1]) * 1000;
                    now = Date.now();
                    return [2 /*return*/, {
                            token: responseBody.token,
                            expireTimeMillis: now + timeToLiveAsNumber,
                            issuedAtTimeMillis: now
                        }];
            }
        });
    });
}
function getExchangeRecaptchaV3TokenRequest(app, reCAPTCHAToken) {
    var _a = app.options, projectId = _a.projectId, appId = _a.appId, apiKey = _a.apiKey;
    return {
        url: "".concat(BASE_ENDPOINT, "/projects/").concat(projectId, "/apps/").concat(appId, ":").concat(EXCHANGE_RECAPTCHA_TOKEN_METHOD, "?key=").concat(apiKey),
        body: {
            'recaptcha_v3_token': reCAPTCHAToken
        }
    };
}
function getExchangeRecaptchaEnterpriseTokenRequest(app, reCAPTCHAToken) {
    var _a = app.options, projectId = _a.projectId, appId = _a.appId, apiKey = _a.apiKey;
    return {
        url: "".concat(BASE_ENDPOINT, "/projects/").concat(projectId, "/apps/").concat(appId, ":").concat(EXCHANGE_RECAPTCHA_ENTERPRISE_TOKEN_METHOD, "?key=").concat(apiKey),
        body: {
            'recaptcha_enterprise_token': reCAPTCHAToken
        }
    };
}
function getExchangeDebugTokenRequest(app, debugToken) {
    var _a = app.options, projectId = _a.projectId, appId = _a.appId, apiKey = _a.apiKey;
    return {
        url: "".concat(BASE_ENDPOINT, "/projects/").concat(projectId, "/apps/").concat(appId, ":").concat(EXCHANGE_DEBUG_TOKEN_METHOD, "?key=").concat(apiKey),
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
var DB_NAME = 'firebase-app-check-database';
var DB_VERSION = 1;
var STORE_NAME = 'firebase-app-check-store';
var DEBUG_TOKEN_KEY = 'debug-token';
var dbPromise = null;
function getDBPromise() {
    if (dbPromise) {
        return dbPromise;
    }
    dbPromise = new Promise(function (resolve, reject) {
        try {
            var request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
            request.onerror = function (event) {
                var _a;
                reject(ERROR_FACTORY.create("storage-open" /* AppCheckError.STORAGE_OPEN */, {
                    originalErrorMessage: (_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message
                }));
            };
            request.onupgradeneeded = function (event) {
                var db = event.target.result;
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
function write(key, value) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var db, transaction, store, request;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDBPromise()];
                case 1:
                    db = _a.sent();
                    transaction = db.transaction(STORE_NAME, 'readwrite');
                    store = transaction.objectStore(STORE_NAME);
                    request = store.put({
                        compositeKey: key,
                        value: value
                    });
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            request.onsuccess = function (_event) {
                                resolve();
                            };
                            transaction.onerror = function (event) {
                                var _a;
                                reject(ERROR_FACTORY.create("storage-set" /* AppCheckError.STORAGE_WRITE */, {
                                    originalErrorMessage: (_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message
                                }));
                            };
                        })];
            }
        });
    });
}
function read(key) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var db, transaction, store, request;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDBPromise()];
                case 1:
                    db = _a.sent();
                    transaction = db.transaction(STORE_NAME, 'readonly');
                    store = transaction.objectStore(STORE_NAME);
                    request = store.get(key);
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            request.onsuccess = function (event) {
                                var result = event.target.result;
                                if (result) {
                                    resolve(result.value);
                                }
                                else {
                                    resolve(undefined);
                                }
                            };
                            transaction.onerror = function (event) {
                                var _a;
                                reject(ERROR_FACTORY.create("storage-get" /* AppCheckError.STORAGE_GET */, {
                                    originalErrorMessage: (_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message
                                }));
                            };
                        })];
            }
        });
    });
}
function computeKey(app) {
    return "".concat(app.options.appId, "-").concat(app.name);
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
var logger = new logger$1.Logger('@firebase/app-check');

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
function readTokenFromStorage(app) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var token, e_1;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!util.isIndexedDBAvailable()) return [3 /*break*/, 5];
                    token = undefined;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, readTokenFromIndexedDB(app)];
                case 2:
                    token = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    // swallow the error and return undefined
                    logger.warn("Failed to read token from IndexedDB. Error: ".concat(e_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, token];
                case 5: return [2 /*return*/, undefined];
            }
        });
    });
}
/**
 * Always resolves. In case of an error writing to indexeddb, print a warning and resolve the promise
 */
function writeTokenToStorage(app, token) {
    if (util.isIndexedDBAvailable()) {
        return writeTokenToIndexedDB(app, token).catch(function (e) {
            // swallow the error and resolve the promise
            logger.warn("Failed to write token to IndexedDB. Error: ".concat(e));
        });
    }
    return Promise.resolve();
}
function readOrCreateDebugTokenFromStorage() {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var existingDebugToken, newToken;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingDebugToken = undefined;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, readDebugTokenFromIndexedDB()];
                case 2:
                    existingDebugToken = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    if (!existingDebugToken) {
                        newToken = util.uuidv4();
                        // We don't need to block on writing to indexeddb
                        // In case persistence failed, a new debug token will be generated everytime the page is refreshed.
                        // It renders the debug token useless because you have to manually register(whitelist) the new token in the firebase console again and again.
                        // If you see this error trying to use debug token, it probably means you are using a browser that doesn't support indexeddb.
                        // You should switch to a different browser that supports indexeddb
                        writeDebugTokenToIndexedDB(newToken).catch(function (e) {
                            return logger.warn("Failed to persist debug token to IndexedDB. Error: ".concat(e));
                        });
                        return [2 /*return*/, newToken];
                    }
                    else {
                        return [2 /*return*/, existingDebugToken];
                    }
            }
        });
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
function isDebugMode() {
    var debugState = getDebugState();
    return debugState.enabled;
}
function getDebugToken() {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var state;
        return tslib.__generator(this, function (_a) {
            state = getDebugState();
            if (state.enabled && state.token) {
                return [2 /*return*/, state.token.promise];
            }
            else {
                // should not happen!
                throw Error("\n            Can't get debug token in production mode.\n        ");
            }
        });
    });
}
function initializeDebugMode() {
    var globals = util.getGlobal();
    var debugState = getDebugState();
    // Set to true if this function has been called, whether or not
    // it enabled debug mode.
    debugState.initialized = true;
    if (typeof globals.FIREBASE_APPCHECK_DEBUG_TOKEN !== 'string' &&
        globals.FIREBASE_APPCHECK_DEBUG_TOKEN !== true) {
        return;
    }
    debugState.enabled = true;
    var deferredToken = new util.Deferred();
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
var defaultTokenErrorData = { error: 'UNKNOWN_ERROR' };
/**
 * Stringify and base64 encode token error data.
 *
 * @param tokenError Error data, currently hardcoded.
 */
function formatDummyToken(tokenErrorData) {
    return util.base64.encodeString(JSON.stringify(tokenErrorData), 
    /* webSafe= */ false);
}
/**
 * This function always resolves.
 * The result will contain an error field if there is any error.
 * In case there is an error, the token field in the result will be populated with a dummy value
 */
function getToken$2(appCheck, forceRefresh) {
    if (forceRefresh === void 0) { forceRefresh = false; }
    return tslib.__awaiter(this, void 0, void 0, function () {
        var app, state, token, error, cachedToken, shouldCallListeners, _a, _b, _c, _d, tokenFromDebugExchange, e_1, interopTokenResult;
        return tslib.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    app = appCheck.app;
                    ensureActivated(app);
                    state = getStateReference(app);
                    token = state.token;
                    error = undefined;
                    /**
                     * If an invalid token was found in memory, clear token from
                     * memory and unset the local variable `token`.
                     */
                    if (token && !isValid(token)) {
                        state.token = undefined;
                        token = undefined;
                    }
                    if (!!token) return [3 /*break*/, 4];
                    return [4 /*yield*/, state.cachedTokenPromise];
                case 1:
                    cachedToken = _e.sent();
                    if (!cachedToken) return [3 /*break*/, 4];
                    if (!isValid(cachedToken)) return [3 /*break*/, 2];
                    token = cachedToken;
                    return [3 /*break*/, 4];
                case 2: 
                // If there was an invalid token in the indexedDB cache, clear it.
                return [4 /*yield*/, writeTokenToStorage(app, undefined)];
                case 3:
                    // If there was an invalid token in the indexedDB cache, clear it.
                    _e.sent();
                    _e.label = 4;
                case 4:
                    // Return the cached token (from either memory or indexedDB) if it's valid
                    if (!forceRefresh && token && isValid(token)) {
                        return [2 /*return*/, {
                                token: token.token
                            }];
                    }
                    shouldCallListeners = false;
                    if (!isDebugMode()) return [3 /*break*/, 9];
                    if (!!state.exchangeTokenPromise) return [3 /*break*/, 6];
                    _a = state;
                    _b = exchangeToken;
                    _c = getExchangeDebugTokenRequest;
                    _d = [app];
                    return [4 /*yield*/, getDebugToken()];
                case 5:
                    _a.exchangeTokenPromise = _b.apply(void 0, [_c.apply(void 0, _d.concat([_e.sent()])),
                        appCheck.heartbeatServiceProvider]).finally(function () {
                        // Clear promise when settled - either resolved or rejected.
                        state.exchangeTokenPromise = undefined;
                    });
                    shouldCallListeners = true;
                    _e.label = 6;
                case 6: return [4 /*yield*/, state.exchangeTokenPromise];
                case 7:
                    tokenFromDebugExchange = _e.sent();
                    // Write debug token to indexedDB.
                    return [4 /*yield*/, writeTokenToStorage(app, tokenFromDebugExchange)];
                case 8:
                    // Write debug token to indexedDB.
                    _e.sent();
                    // Write debug token to state.
                    state.token = tokenFromDebugExchange;
                    return [2 /*return*/, { token: tokenFromDebugExchange.token }];
                case 9:
                    _e.trys.push([9, 11, , 12]);
                    // Avoid making another call to the exchange endpoint if one is in flight.
                    if (!state.exchangeTokenPromise) {
                        // state.provider is populated in initializeAppCheck()
                        // ensureActivated() at the top of this function checks that
                        // initializeAppCheck() has been called.
                        state.exchangeTokenPromise = state.provider.getToken().finally(function () {
                            // Clear promise when settled - either resolved or rejected.
                            state.exchangeTokenPromise = undefined;
                        });
                        shouldCallListeners = true;
                    }
                    return [4 /*yield*/, getStateReference(app).exchangeTokenPromise];
                case 10:
                    token = _e.sent();
                    return [3 /*break*/, 12];
                case 11:
                    e_1 = _e.sent();
                    if (e_1.code === "appCheck/".concat("throttled" /* AppCheckError.THROTTLED */)) {
                        // Warn if throttled, but do not treat it as an error.
                        logger.warn(e_1.message);
                    }
                    else {
                        // `getToken()` should never throw, but logging error text to console will aid debugging.
                        logger.error(e_1);
                    }
                    // Always save error to be added to dummy token.
                    error = e_1;
                    return [3 /*break*/, 12];
                case 12:
                    if (!!token) return [3 /*break*/, 13];
                    // If token is undefined, there must be an error.
                    // Return a dummy token along with the error.
                    interopTokenResult = makeDummyTokenResult(error);
                    return [3 /*break*/, 16];
                case 13:
                    if (!error) return [3 /*break*/, 14];
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
                    return [3 /*break*/, 16];
                case 14:
                    interopTokenResult = {
                        token: token.token
                    };
                    // write the new token to the memory state as well as the persistent storage.
                    // Only do it if we got a valid new token
                    state.token = token;
                    return [4 /*yield*/, writeTokenToStorage(app, token)];
                case 15:
                    _e.sent();
                    _e.label = 16;
                case 16:
                    if (shouldCallListeners) {
                        notifyTokenListeners(app, interopTokenResult);
                    }
                    return [2 /*return*/, interopTokenResult];
            }
        });
    });
}
/**
 * Internal API for limited use tokens. Skips all FAC state and simply calls
 * the underlying provider.
 */
function getLimitedUseToken$1(appCheck) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var app, provider, debugToken, token, token;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = appCheck.app;
                    ensureActivated(app);
                    provider = getStateReference(app).provider;
                    if (!isDebugMode()) return [3 /*break*/, 3];
                    return [4 /*yield*/, getDebugToken()];
                case 1:
                    debugToken = _a.sent();
                    return [4 /*yield*/, exchangeToken(getExchangeDebugTokenRequest(app, debugToken), appCheck.heartbeatServiceProvider)];
                case 2:
                    token = (_a.sent()).token;
                    return [2 /*return*/, { token: token }];
                case 3: return [4 /*yield*/, provider.getToken()];
                case 4:
                    token = (_a.sent()).token;
                    return [2 /*return*/, { token: token }];
            }
        });
    });
}
function addTokenListener(appCheck, type, listener, onError) {
    var app = appCheck.app;
    var state = getStateReference(app);
    var tokenObserver = {
        next: listener,
        error: onError,
        type: type
    };
    state.tokenObservers = tslib.__spreadArray(tslib.__spreadArray([], state.tokenObservers, true), [tokenObserver], false);
    // Invoke the listener async immediately if there is a valid token
    // in memory.
    if (state.token && isValid(state.token)) {
        var validToken_1 = state.token;
        Promise.resolve()
            .then(function () {
            listener({ token: validToken_1.token });
            initTokenRefresher(appCheck);
        })
            .catch(function () {
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
    void state.cachedTokenPromise.then(function () { return initTokenRefresher(appCheck); });
}
function removeTokenListener(app, listener) {
    var state = getStateReference(app);
    var newObservers = state.tokenObservers.filter(function (tokenObserver) { return tokenObserver.next !== listener; });
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
    var app = appCheck.app;
    var state = getStateReference(app);
    // Create the refresher but don't start it if `isTokenAutoRefreshEnabled`
    // is not true.
    var refresher = state.tokenRefresher;
    if (!refresher) {
        refresher = createTokenRefresher(appCheck);
        state.tokenRefresher = refresher;
    }
    if (!refresher.isRunning() && state.isTokenAutoRefreshEnabled) {
        refresher.start();
    }
}
function createTokenRefresher(appCheck) {
    var _this = this;
    var app = appCheck.app;
    return new Refresher(
    // Keep in mind when this fails for any reason other than the ones
    // for which we should retry, it will effectively stop the proactive refresh.
    function () { return tslib.__awaiter(_this, void 0, void 0, function () {
        var state, result;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getStateReference(app);
                    if (!!state.token) return [3 /*break*/, 2];
                    return [4 /*yield*/, getToken$2(appCheck)];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getToken$2(appCheck, true)];
                case 3:
                    result = _a.sent();
                    _a.label = 4;
                case 4:
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
                    return [2 /*return*/];
            }
        });
    }); }, function () {
        return true;
    }, function () {
        var state = getStateReference(app);
        if (state.token) {
            // issuedAtTime + (50% * total TTL) + 5 minutes
            var nextRefreshTimeMillis = state.token.issuedAtTimeMillis +
                (state.token.expireTimeMillis - state.token.issuedAtTimeMillis) *
                    0.5 +
                5 * 60 * 1000;
            // Do not allow refresh time to be past (expireTime - 5 minutes)
            var latestAllowableRefresh = state.token.expireTimeMillis - 5 * 60 * 1000;
            nextRefreshTimeMillis = Math.min(nextRefreshTimeMillis, latestAllowableRefresh);
            return Math.max(0, nextRefreshTimeMillis - Date.now());
        }
        else {
            return 0;
        }
    }, TOKEN_REFRESH_TIME.RETRIAL_MIN_WAIT, TOKEN_REFRESH_TIME.RETRIAL_MAX_WAIT);
}
function notifyTokenListeners(app, token) {
    var observers = getStateReference(app).tokenObservers;
    for (var _i = 0, observers_1 = observers; _i < observers_1.length; _i++) {
        var observer = observers_1[_i];
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
        error: error
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
var AppCheckService = /** @class */ (function () {
    function AppCheckService(app, heartbeatServiceProvider) {
        this.app = app;
        this.heartbeatServiceProvider = heartbeatServiceProvider;
    }
    AppCheckService.prototype._delete = function () {
        var tokenObservers = getStateReference(this.app).tokenObservers;
        for (var _i = 0, tokenObservers_1 = tokenObservers; _i < tokenObservers_1.length; _i++) {
            var tokenObserver = tokenObservers_1[_i];
            removeTokenListener(this.app, tokenObserver.next);
        }
        return Promise.resolve();
    };
    return AppCheckService;
}());
function factory(app, heartbeatServiceProvider) {
    return new AppCheckService(app, heartbeatServiceProvider);
}
function internalFactory(appCheck) {
    return {
        getToken: function (forceRefresh) { return getToken$2(appCheck, forceRefresh); },
        getLimitedUseToken: function () { return getLimitedUseToken$1(appCheck); },
        addTokenListener: function (listener) {
            return addTokenListener(appCheck, "INTERNAL" /* ListenerType.INTERNAL */, listener);
        },
        removeTokenListener: function (listener) { return removeTokenListener(appCheck.app, listener); }
    };
}

var name = "@firebase/app-check";
var version = "0.8.1";

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
var RECAPTCHA_URL = 'https://www.google.com/recaptcha/api.js';
var RECAPTCHA_ENTERPRISE_URL = 'https://www.google.com/recaptcha/enterprise.js';
function initializeV3(app, siteKey) {
    var initialized = new util.Deferred();
    var state = getStateReference(app);
    state.reCAPTCHAState = { initialized: initialized };
    var divId = makeDiv(app);
    var grecaptcha = getRecaptcha(false);
    if (!grecaptcha) {
        loadReCAPTCHAV3Script(function () {
            var grecaptcha = getRecaptcha(false);
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
    var initialized = new util.Deferred();
    var state = getStateReference(app);
    state.reCAPTCHAState = { initialized: initialized };
    var divId = makeDiv(app);
    var grecaptcha = getRecaptcha(true);
    if (!grecaptcha) {
        loadReCAPTCHAEnterpriseScript(function () {
            var grecaptcha = getRecaptcha(true);
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
    grecaptcha.ready(function () {
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
    var divId = "fire_app_check_".concat(app.name);
    var invisibleDiv = document.createElement('div');
    invisibleDiv.id = divId;
    invisibleDiv.style.display = 'none';
    document.body.appendChild(invisibleDiv);
    return divId;
}
function getToken$1(app) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var reCAPTCHAState, recaptcha;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ensureActivated(app);
                    reCAPTCHAState = getStateReference(app).reCAPTCHAState;
                    return [4 /*yield*/, reCAPTCHAState.initialized.promise];
                case 1:
                    recaptcha = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, _reject) {
                            // Updated after initialization is complete.
                            var reCAPTCHAState = getStateReference(app).reCAPTCHAState;
                            recaptcha.ready(function () {
                                resolve(
                                // widgetId is guaranteed to be available if reCAPTCHAState.initialized.promise resolved.
                                recaptcha.execute(reCAPTCHAState.widgetId, {
                                    action: 'fire_app_check'
                                }));
                            });
                        })];
            }
        });
    });
}
/**
 *
 * @param app
 * @param container - Id of a HTML element.
 */
function renderInvisibleWidget(app, siteKey, grecaptcha, container) {
    var widgetId = grecaptcha.render(container, {
        sitekey: siteKey,
        size: 'invisible',
        // Success callback - set state
        callback: function () {
            getStateReference(app).reCAPTCHAState.succeeded = true;
        },
        // Failure callback - set state
        'error-callback': function () {
            getStateReference(app).reCAPTCHAState.succeeded = false;
        }
    });
    var state = getStateReference(app);
    state.reCAPTCHAState = tslib.__assign(tslib.__assign({}, state.reCAPTCHAState), { // state.reCAPTCHAState is set in the initialize()
        widgetId: widgetId });
}
function loadReCAPTCHAV3Script(onload) {
    var script = document.createElement('script');
    script.src = RECAPTCHA_URL;
    script.onload = onload;
    document.head.appendChild(script);
}
function loadReCAPTCHAEnterpriseScript(onload) {
    var script = document.createElement('script');
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
var ReCaptchaV3Provider = /** @class */ (function () {
    /**
     * Create a ReCaptchaV3Provider instance.
     * @param siteKey - ReCAPTCHA V3 siteKey.
     */
    function ReCaptchaV3Provider(_siteKey) {
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
    ReCaptchaV3Provider.prototype.getToken = function () {
        var _a, _b, _c;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var attestedClaimsToken, result, e_1;
            return tslib.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        throwIfThrottled(this._throttleData);
                        return [4 /*yield*/, getToken$1(this._app).catch(function (_e) {
                                // reCaptcha.execute() throws null which is not very descriptive.
                                throw ERROR_FACTORY.create("recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */);
                            })];
                    case 1:
                        attestedClaimsToken = _d.sent();
                        // Check if a failure state was set by the recaptcha "error-callback".
                        if (!((_a = getStateReference(this._app).reCAPTCHAState) === null || _a === void 0 ? void 0 : _a.succeeded)) {
                            throw ERROR_FACTORY.create("recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */);
                        }
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, exchangeToken(getExchangeRecaptchaV3TokenRequest(this._app, attestedClaimsToken), this._heartbeatServiceProvider)];
                    case 3:
                        result = _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _d.sent();
                        if ((_b = e_1.code) === null || _b === void 0 ? void 0 : _b.includes("fetch-status-error" /* AppCheckError.FETCH_STATUS_ERROR */)) {
                            this._throttleData = setBackoff(Number((_c = e_1.customData) === null || _c === void 0 ? void 0 : _c.httpStatus), this._throttleData);
                            throw ERROR_FACTORY.create("throttled" /* AppCheckError.THROTTLED */, {
                                time: getDurationString(this._throttleData.allowRequestsAfter - Date.now()),
                                httpStatus: this._throttleData.httpStatus
                            });
                        }
                        else {
                            throw e_1;
                        }
                    case 5:
                        // If successful, clear throttle data.
                        this._throttleData = null;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * @internal
     */
    ReCaptchaV3Provider.prototype.initialize = function (app$1) {
        this._app = app$1;
        this._heartbeatServiceProvider = app._getProvider(app$1, 'heartbeat');
        initializeV3(app$1, this._siteKey).catch(function () {
            /* we don't care about the initialization result */
        });
    };
    /**
     * @internal
     */
    ReCaptchaV3Provider.prototype.isEqual = function (otherProvider) {
        if (otherProvider instanceof ReCaptchaV3Provider) {
            return this._siteKey === otherProvider._siteKey;
        }
        else {
            return false;
        }
    };
    return ReCaptchaV3Provider;
}());
/**
 * App Check provider that can obtain a reCAPTCHA Enterprise token and exchange it
 * for an App Check token.
 *
 * @public
 */
var ReCaptchaEnterpriseProvider = /** @class */ (function () {
    /**
     * Create a ReCaptchaEnterpriseProvider instance.
     * @param siteKey - reCAPTCHA Enterprise score-based site key.
     */
    function ReCaptchaEnterpriseProvider(_siteKey) {
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
    ReCaptchaEnterpriseProvider.prototype.getToken = function () {
        var _a, _b, _c;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var attestedClaimsToken, result, e_2;
            return tslib.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        throwIfThrottled(this._throttleData);
                        return [4 /*yield*/, getToken$1(this._app).catch(function (_e) {
                                // reCaptcha.execute() throws null which is not very descriptive.
                                throw ERROR_FACTORY.create("recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */);
                            })];
                    case 1:
                        attestedClaimsToken = _d.sent();
                        // Check if a failure state was set by the recaptcha "error-callback".
                        if (!((_a = getStateReference(this._app).reCAPTCHAState) === null || _a === void 0 ? void 0 : _a.succeeded)) {
                            throw ERROR_FACTORY.create("recaptcha-error" /* AppCheckError.RECAPTCHA_ERROR */);
                        }
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, exchangeToken(getExchangeRecaptchaEnterpriseTokenRequest(this._app, attestedClaimsToken), this._heartbeatServiceProvider)];
                    case 3:
                        result = _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _d.sent();
                        if ((_b = e_2.code) === null || _b === void 0 ? void 0 : _b.includes("fetch-status-error" /* AppCheckError.FETCH_STATUS_ERROR */)) {
                            this._throttleData = setBackoff(Number((_c = e_2.customData) === null || _c === void 0 ? void 0 : _c.httpStatus), this._throttleData);
                            throw ERROR_FACTORY.create("throttled" /* AppCheckError.THROTTLED */, {
                                time: getDurationString(this._throttleData.allowRequestsAfter - Date.now()),
                                httpStatus: this._throttleData.httpStatus
                            });
                        }
                        else {
                            throw e_2;
                        }
                    case 5:
                        // If successful, clear throttle data.
                        this._throttleData = null;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * @internal
     */
    ReCaptchaEnterpriseProvider.prototype.initialize = function (app$1) {
        this._app = app$1;
        this._heartbeatServiceProvider = app._getProvider(app$1, 'heartbeat');
        initializeEnterprise(app$1, this._siteKey).catch(function () {
            /* we don't care about the initialization result */
        });
    };
    /**
     * @internal
     */
    ReCaptchaEnterpriseProvider.prototype.isEqual = function (otherProvider) {
        if (otherProvider instanceof ReCaptchaEnterpriseProvider) {
            return this._siteKey === otherProvider._siteKey;
        }
        else {
            return false;
        }
    };
    return ReCaptchaEnterpriseProvider;
}());
/**
 * Custom provider class.
 * @public
 */
var CustomProvider = /** @class */ (function () {
    function CustomProvider(_customProviderOptions) {
        this._customProviderOptions = _customProviderOptions;
    }
    /**
     * @internal
     */
    CustomProvider.prototype.getToken = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var customToken, issuedAtTimeSeconds, issuedAtTimeMillis;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._customProviderOptions.getToken()];
                    case 1:
                        customToken = _a.sent();
                        issuedAtTimeSeconds = util.issuedAtTime(customToken.token);
                        issuedAtTimeMillis = issuedAtTimeSeconds !== null &&
                            issuedAtTimeSeconds < Date.now() &&
                            issuedAtTimeSeconds > 0
                            ? issuedAtTimeSeconds * 1000
                            : Date.now();
                        return [2 /*return*/, tslib.__assign(tslib.__assign({}, customToken), { issuedAtTimeMillis: issuedAtTimeMillis })];
                }
            });
        });
    };
    /**
     * @internal
     */
    CustomProvider.prototype.initialize = function (app) {
        this._app = app;
    };
    /**
     * @internal
     */
    CustomProvider.prototype.isEqual = function (otherProvider) {
        if (otherProvider instanceof CustomProvider) {
            return (this._customProviderOptions.getToken.toString() ===
                otherProvider._customProviderOptions.getToken.toString());
        }
        else {
            return false;
        }
    };
    return CustomProvider;
}());
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
            httpStatus: httpStatus
        };
    }
    else {
        /**
         * For all other error codes, the time when it is ok to retry again
         * is based on exponential backoff.
         */
        var backoffCount = throttleData ? throttleData.backoffCount : 0;
        var backoffMillis = util.calculateBackoffMillis(backoffCount, 1000, 2);
        return {
            backoffCount: backoffCount + 1,
            allowRequestsAfter: Date.now() + backoffMillis,
            httpStatus: httpStatus
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
function initializeAppCheck(app$1, options) {
    if (app$1 === void 0) { app$1 = app.getApp(); }
    app$1 = util.getModularInstance(app$1);
    var provider = app._getProvider(app$1, 'app-check');
    // Ensure initializeDebugMode() is only called once.
    if (!getDebugState().initialized) {
        initializeDebugMode();
    }
    // Log a message containing the debug token when `initializeAppCheck()`
    // is called in debug mode.
    if (isDebugMode()) {
        // Do not block initialization to get the token for the message.
        void getDebugToken().then(function (token) {
            // Not using logger because I don't think we ever want this accidentally hidden.
            return console.log("App Check debug token: ".concat(token, ". You will need to add it to your app's App Check settings in the Firebase console for it to work."));
        });
    }
    if (provider.isInitialized()) {
        var existingInstance = provider.getImmediate();
        var initialOptions = provider.getOptions();
        if (initialOptions.isTokenAutoRefreshEnabled ===
            options.isTokenAutoRefreshEnabled &&
            initialOptions.provider.isEqual(options.provider)) {
            return existingInstance;
        }
        else {
            throw ERROR_FACTORY.create("already-initialized" /* AppCheckError.ALREADY_INITIALIZED */, {
                appName: app$1.name
            });
        }
    }
    var appCheck = provider.initialize({ options: options });
    _activate(app$1, options.provider, options.isTokenAutoRefreshEnabled);
    // If isTokenAutoRefreshEnabled is false, do not send any requests to the
    // exchange endpoint without an explicit call from the user either directly
    // or through another Firebase library (storage, functions, etc.)
    if (getStateReference(app$1).isTokenAutoRefreshEnabled) {
        // Adding a listener will start the refresher and fetch a token if needed.
        // This gets a token ready and prevents a delay when an internal library
        // requests the token.
        // Listener function does not need to do anything, its base functionality
        // of calling getToken() already fetches token and writes it to memory/storage.
        addTokenListener(appCheck, "INTERNAL" /* ListenerType.INTERNAL */, function () { });
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
    var state = setInitialState(app, tslib.__assign({}, DEFAULT_STATE));
    state.activated = true;
    state.provider = provider; // Read cached token from storage if it exists and store it in memory.
    state.cachedTokenPromise = readTokenFromStorage(app).then(function (cachedToken) {
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
    var app = appCheckInstance.app;
    var state = getStateReference(app);
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
function getToken(appCheckInstance, forceRefresh) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var result;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getToken$2(appCheckInstance, forceRefresh)];
                case 1:
                    result = _a.sent();
                    if (result.error) {
                        throw result.error;
                    }
                    return [2 /*return*/, { token: result.token }];
            }
        });
    });
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
    var nextFn = function () { };
    var errorFn = function () { };
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
    return function () { return removeTokenListener(appCheckInstance.app, nextFn); };
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
var APP_CHECK_NAME = 'app-check';
var APP_CHECK_NAME_INTERNAL = 'app-check-internal';
function registerAppCheck() {
    // The public interface
    app._registerComponent(new component.Component(APP_CHECK_NAME, function (container) {
        // getImmediate for FirebaseApp will always succeed
        var app = container.getProvider('app').getImmediate();
        var heartbeatServiceProvider = container.getProvider('heartbeat');
        return factory(app, heartbeatServiceProvider);
    }, "PUBLIC" /* ComponentType.PUBLIC */)
        .setInstantiationMode("EXPLICIT" /* InstantiationMode.EXPLICIT */)
        /**
         * Initialize app-check-internal after app-check is initialized to make AppCheck available to
         * other Firebase SDKs
         */
        .setInstanceCreatedCallback(function (container, _identifier, _appcheckService) {
        container.getProvider(APP_CHECK_NAME_INTERNAL).initialize();
    }));
    // The internal interface used by other Firebase products
    app._registerComponent(new component.Component(APP_CHECK_NAME_INTERNAL, function (container) {
        var appCheck = container.getProvider('app-check').getImmediate();
        return internalFactory(appCheck);
    }, "PUBLIC" /* ComponentType.PUBLIC */).setInstantiationMode("EXPLICIT" /* InstantiationMode.EXPLICIT */));
    app.registerVersion(name, version);
}
registerAppCheck();

exports.CustomProvider = CustomProvider;
exports.ReCaptchaEnterpriseProvider = ReCaptchaEnterpriseProvider;
exports.ReCaptchaV3Provider = ReCaptchaV3Provider;
exports.getLimitedUseToken = getLimitedUseToken;
exports.getToken = getToken;
exports.initializeAppCheck = initializeAppCheck;
exports.onTokenChanged = onTokenChanged;
exports.setTokenAutoRefreshEnabled = setTokenAutoRefreshEnabled;
//# sourceMappingURL=index.cjs.js.map
