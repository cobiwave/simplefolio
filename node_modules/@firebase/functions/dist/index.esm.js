import { _registerComponent, registerVersion, getApp, _getProvider } from '@firebase/app';
import { __extends, __awaiter, __generator, __spreadArray } from 'tslib';
import { FirebaseError, getModularInstance, getDefaultEmulatorHostnameAndPort } from '@firebase/util';
import { Component } from '@firebase/component';

/**
 * @license
 * Copyright 2017 Google LLC
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
var LONG_TYPE = 'type.googleapis.com/google.protobuf.Int64Value';
var UNSIGNED_LONG_TYPE = 'type.googleapis.com/google.protobuf.UInt64Value';
function mapValues(
// { [k: string]: unknown } is no longer a wildcard assignment target after typescript 3.5
// eslint-disable-next-line @typescript-eslint/no-explicit-any
o, f) {
    var result = {};
    for (var key in o) {
        if (o.hasOwnProperty(key)) {
            result[key] = f(o[key]);
        }
    }
    return result;
}
/**
 * Takes data and encodes it in a JSON-friendly way, such that types such as
 * Date are preserved.
 * @internal
 * @param data - Data to encode.
 */
function encode(data) {
    if (data == null) {
        return null;
    }
    if (data instanceof Number) {
        data = data.valueOf();
    }
    if (typeof data === 'number' && isFinite(data)) {
        // Any number in JS is safe to put directly in JSON and parse as a double
        // without any loss of precision.
        return data;
    }
    if (data === true || data === false) {
        return data;
    }
    if (Object.prototype.toString.call(data) === '[object String]') {
        return data;
    }
    if (data instanceof Date) {
        return data.toISOString();
    }
    if (Array.isArray(data)) {
        return data.map(function (x) { return encode(x); });
    }
    if (typeof data === 'function' || typeof data === 'object') {
        return mapValues(data, function (x) { return encode(x); });
    }
    // If we got this far, the data is not encodable.
    throw new Error('Data cannot be encoded in JSON: ' + data);
}
/**
 * Takes data that's been encoded in a JSON-friendly form and returns a form
 * with richer datatypes, such as Dates, etc.
 * @internal
 * @param json - JSON to convert.
 */
function decode(json) {
    if (json == null) {
        return json;
    }
    if (json['@type']) {
        switch (json['@type']) {
            case LONG_TYPE:
            // Fall through and handle this the same as unsigned.
            case UNSIGNED_LONG_TYPE: {
                // Technically, this could work return a valid number for malformed
                // data if there was a number followed by garbage. But it's just not
                // worth all the extra code to detect that case.
                var value = Number(json['value']);
                if (isNaN(value)) {
                    throw new Error('Data cannot be decoded from JSON: ' + json);
                }
                return value;
            }
            default: {
                throw new Error('Data cannot be decoded from JSON: ' + json);
            }
        }
    }
    if (Array.isArray(json)) {
        return json.map(function (x) { return decode(x); });
    }
    if (typeof json === 'function' || typeof json === 'object') {
        return mapValues(json, function (x) { return decode(x); });
    }
    // Anything else is safe to return.
    return json;
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
 * Type constant for Firebase Functions.
 */
var FUNCTIONS_TYPE = 'functions';

/**
 * @license
 * Copyright 2017 Google LLC
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
 * Standard error codes for different ways a request can fail, as defined by:
 * https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
 *
 * This map is used primarily to convert from a backend error code string to
 * a client SDK error code string, and make sure it's in the supported set.
 */
var errorCodeMap = {
    OK: 'ok',
    CANCELLED: 'cancelled',
    UNKNOWN: 'unknown',
    INVALID_ARGUMENT: 'invalid-argument',
    DEADLINE_EXCEEDED: 'deadline-exceeded',
    NOT_FOUND: 'not-found',
    ALREADY_EXISTS: 'already-exists',
    PERMISSION_DENIED: 'permission-denied',
    UNAUTHENTICATED: 'unauthenticated',
    RESOURCE_EXHAUSTED: 'resource-exhausted',
    FAILED_PRECONDITION: 'failed-precondition',
    ABORTED: 'aborted',
    OUT_OF_RANGE: 'out-of-range',
    UNIMPLEMENTED: 'unimplemented',
    INTERNAL: 'internal',
    UNAVAILABLE: 'unavailable',
    DATA_LOSS: 'data-loss'
};
/**
 * An explicit error that can be thrown from a handler to send an error to the
 * client that called the function.
 */
var FunctionsError = /** @class */ (function (_super) {
    __extends(FunctionsError, _super);
    function FunctionsError(
    /**
     * A standard error code that will be returned to the client. This also
     * determines the HTTP status code of the response, as defined in code.proto.
     */
    code, message, 
    /**
     * Extra data to be converted to JSON and included in the error response.
     */
    details) {
        var _this = _super.call(this, "".concat(FUNCTIONS_TYPE, "/").concat(code), message || '') || this;
        _this.details = details;
        return _this;
    }
    return FunctionsError;
}(FirebaseError));
/**
 * Takes an HTTP status code and returns the corresponding ErrorCode.
 * This is the standard HTTP status code -> error mapping defined in:
 * https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
 *
 * @param status An HTTP status code.
 * @return The corresponding ErrorCode, or ErrorCode.UNKNOWN if none.
 */
function codeForHTTPStatus(status) {
    // Make sure any successful status is OK.
    if (status >= 200 && status < 300) {
        return 'ok';
    }
    switch (status) {
        case 0:
            // This can happen if the server returns 500.
            return 'internal';
        case 400:
            return 'invalid-argument';
        case 401:
            return 'unauthenticated';
        case 403:
            return 'permission-denied';
        case 404:
            return 'not-found';
        case 409:
            return 'aborted';
        case 429:
            return 'resource-exhausted';
        case 499:
            return 'cancelled';
        case 500:
            return 'internal';
        case 501:
            return 'unimplemented';
        case 503:
            return 'unavailable';
        case 504:
            return 'deadline-exceeded';
    }
    return 'unknown';
}
/**
 * Takes an HTTP response and returns the corresponding Error, if any.
 */
function _errorForResponse(status, bodyJSON) {
    var code = codeForHTTPStatus(status);
    // Start with reasonable defaults from the status code.
    var description = code;
    var details = undefined;
    // Then look through the body for explicit details.
    try {
        var errorJSON = bodyJSON && bodyJSON.error;
        if (errorJSON) {
            var status_1 = errorJSON.status;
            if (typeof status_1 === 'string') {
                if (!errorCodeMap[status_1]) {
                    // They must've included an unknown error code in the body.
                    return new FunctionsError('internal', 'internal');
                }
                code = errorCodeMap[status_1];
                // TODO(klimt): Add better default descriptions for error enums.
                // The default description needs to be updated for the new code.
                description = status_1;
            }
            var message = errorJSON.message;
            if (typeof message === 'string') {
                description = message;
            }
            details = errorJSON.details;
            if (details !== undefined) {
                details = decode(details);
            }
        }
    }
    catch (e) {
        // If we couldn't parse explicit error data, that's fine.
    }
    if (code === 'ok') {
        // Technically, there's an edge case where a developer could explicitly
        // return an error code of OK, and we will treat it as success, but that
        // seems reasonable.
        return null;
    }
    return new FunctionsError(code, description, details);
}

/**
 * @license
 * Copyright 2017 Google LLC
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
 * Helper class to get metadata that should be included with a function call.
 * @internal
 */
var ContextProvider = /** @class */ (function () {
    function ContextProvider(authProvider, messagingProvider, appCheckProvider) {
        var _this = this;
        this.auth = null;
        this.messaging = null;
        this.appCheck = null;
        this.auth = authProvider.getImmediate({ optional: true });
        this.messaging = messagingProvider.getImmediate({
            optional: true
        });
        if (!this.auth) {
            authProvider.get().then(function (auth) { return (_this.auth = auth); }, function () {
                /* get() never rejects */
            });
        }
        if (!this.messaging) {
            messagingProvider.get().then(function (messaging) { return (_this.messaging = messaging); }, function () {
                /* get() never rejects */
            });
        }
        if (!this.appCheck) {
            appCheckProvider.get().then(function (appCheck) { return (_this.appCheck = appCheck); }, function () {
                /* get() never rejects */
            });
        }
    }
    ContextProvider.prototype.getAuthToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.auth) {
                            return [2 /*return*/, undefined];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.auth.getToken()];
                    case 2:
                        token = _a.sent();
                        return [2 /*return*/, token === null || token === void 0 ? void 0 : token.accessToken];
                    case 3:
                        _a.sent();
                        // If there's any error when trying to get the auth token, leave it off.
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ContextProvider.prototype.getMessagingToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.messaging ||
                            !('Notification' in self) ||
                            Notification.permission !== 'granted') {
                            return [2 /*return*/, undefined];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.messaging.getToken()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        _a.sent();
                        // We don't warn on this, because it usually means messaging isn't set up.
                        // console.warn('Failed to retrieve instance id token.', e);
                        // If there's any error when trying to get the token, leave it off.
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ContextProvider.prototype.getAppCheckToken = function (limitedUseAppCheckTokens) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.appCheck) return [3 /*break*/, 5];
                        if (!limitedUseAppCheckTokens) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.appCheck.getLimitedUseToken()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.appCheck.getToken()];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        result = _a;
                        if (result.error) {
                            // Do not send the App Check header to the functions endpoint if
                            // there was an error from the App Check exchange endpoint. The App
                            // Check SDK will already have logged the error to console.
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, result.token];
                    case 5: return [2 /*return*/, null];
                }
            });
        });
    };
    ContextProvider.prototype.getContext = function (limitedUseAppCheckTokens) {
        return __awaiter(this, void 0, void 0, function () {
            var authToken, messagingToken, appCheckToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAuthToken()];
                    case 1:
                        authToken = _a.sent();
                        return [4 /*yield*/, this.getMessagingToken()];
                    case 2:
                        messagingToken = _a.sent();
                        return [4 /*yield*/, this.getAppCheckToken(limitedUseAppCheckTokens)];
                    case 3:
                        appCheckToken = _a.sent();
                        return [2 /*return*/, { authToken: authToken, messagingToken: messagingToken, appCheckToken: appCheckToken }];
                }
            });
        });
    };
    return ContextProvider;
}());

/**
 * @license
 * Copyright 2017 Google LLC
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
var DEFAULT_REGION = 'us-central1';
/**
 * Returns a Promise that will be rejected after the given duration.
 * The error will be of type FunctionsError.
 *
 * @param millis Number of milliseconds to wait before rejecting.
 */
function failAfter(millis) {
    // Node timers and browser timers are fundamentally incompatible, but we
    // don't care about the value here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var timer = null;
    return {
        promise: new Promise(function (_, reject) {
            timer = setTimeout(function () {
                reject(new FunctionsError('deadline-exceeded', 'deadline-exceeded'));
            }, millis);
        }),
        cancel: function () {
            if (timer) {
                clearTimeout(timer);
            }
        }
    };
}
/**
 * The main class for the Firebase Functions SDK.
 * @internal
 */
var FunctionsService = /** @class */ (function () {
    /**
     * Creates a new Functions service for the given app.
     * @param app - The FirebaseApp to use.
     */
    function FunctionsService(app, authProvider, messagingProvider, appCheckProvider, regionOrCustomDomain, fetchImpl) {
        if (regionOrCustomDomain === void 0) { regionOrCustomDomain = DEFAULT_REGION; }
        var _this = this;
        this.app = app;
        this.fetchImpl = fetchImpl;
        this.emulatorOrigin = null;
        this.contextProvider = new ContextProvider(authProvider, messagingProvider, appCheckProvider);
        // Cancels all ongoing requests when resolved.
        this.cancelAllRequests = new Promise(function (resolve) {
            _this.deleteService = function () {
                return Promise.resolve(resolve());
            };
        });
        // Resolve the region or custom domain overload by attempting to parse it.
        try {
            var url = new URL(regionOrCustomDomain);
            this.customDomain = url.origin;
            this.region = DEFAULT_REGION;
        }
        catch (e) {
            this.customDomain = null;
            this.region = regionOrCustomDomain;
        }
    }
    FunctionsService.prototype._delete = function () {
        return this.deleteService();
    };
    /**
     * Returns the URL for a callable with the given name.
     * @param name - The name of the callable.
     * @internal
     */
    FunctionsService.prototype._url = function (name) {
        var projectId = this.app.options.projectId;
        if (this.emulatorOrigin !== null) {
            var origin_1 = this.emulatorOrigin;
            return "".concat(origin_1, "/").concat(projectId, "/").concat(this.region, "/").concat(name);
        }
        if (this.customDomain !== null) {
            return "".concat(this.customDomain, "/").concat(name);
        }
        return "https://".concat(this.region, "-").concat(projectId, ".cloudfunctions.net/").concat(name);
    };
    return FunctionsService;
}());
/**
 * Modify this instance to communicate with the Cloud Functions emulator.
 *
 * Note: this must be called before this instance has been used to do any operations.
 *
 * @param host The emulator host (ex: localhost)
 * @param port The emulator port (ex: 5001)
 * @public
 */
function connectFunctionsEmulator$1(functionsInstance, host, port) {
    functionsInstance.emulatorOrigin = "http://".concat(host, ":").concat(port);
}
/**
 * Returns a reference to the callable https trigger with the given name.
 * @param name - The name of the trigger.
 * @public
 */
function httpsCallable$1(functionsInstance, name, options) {
    return (function (data) {
        return call(functionsInstance, name, data, options || {});
    });
}
/**
 * Returns a reference to the callable https trigger with the given url.
 * @param url - The url of the trigger.
 * @public
 */
function httpsCallableFromURL$1(functionsInstance, url, options) {
    return (function (data) {
        return callAtURL(functionsInstance, url, data, options || {});
    });
}
/**
 * Does an HTTP POST and returns the completed response.
 * @param url The url to post to.
 * @param body The JSON body of the post.
 * @param headers The HTTP headers to include in the request.
 * @return A Promise that will succeed when the request finishes.
 */
function postJSON(url, body, headers, fetchImpl) {
    return __awaiter(this, void 0, void 0, function () {
        var response, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers['Content-Type'] = 'application/json';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchImpl(url, {
                            method: 'POST',
                            body: JSON.stringify(body),
                            headers: headers
                        })];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a.sent();
                    // This could be an unhandled error on the backend, or it could be a
                    // network error. There's no way to know, since an unhandled error on the
                    // backend will fail to set the proper CORS header, and thus will be
                    // treated as a network error by fetch.
                    return [2 /*return*/, {
                            status: 0,
                            json: null
                        }];
                case 4:
                    json = null;
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, response.json()];
                case 6:
                    json = _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/, {
                        status: response.status,
                        json: json
                    }];
            }
        });
    });
}
/**
 * Calls a callable function asynchronously and returns the result.
 * @param name The name of the callable trigger.
 * @param data The data to pass as params to the function.s
 */
function call(functionsInstance, name, data, options) {
    var url = functionsInstance._url(name);
    return callAtURL(functionsInstance, url, data, options);
}
/**
 * Calls a callable function asynchronously and returns the result.
 * @param url The url of the callable trigger.
 * @param data The data to pass as params to the function.s
 */
function callAtURL(functionsInstance, url, data, options) {
    return __awaiter(this, void 0, void 0, function () {
        var body, headers, context, timeout, failAfterHandle, response, error, responseData, decodedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Encode any special types, such as dates, in the input data.
                    data = encode(data);
                    body = { data: data };
                    headers = {};
                    return [4 /*yield*/, functionsInstance.contextProvider.getContext(options.limitedUseAppCheckTokens)];
                case 1:
                    context = _a.sent();
                    if (context.authToken) {
                        headers['Authorization'] = 'Bearer ' + context.authToken;
                    }
                    if (context.messagingToken) {
                        headers['Firebase-Instance-ID-Token'] = context.messagingToken;
                    }
                    if (context.appCheckToken !== null) {
                        headers['X-Firebase-AppCheck'] = context.appCheckToken;
                    }
                    timeout = options.timeout || 70000;
                    failAfterHandle = failAfter(timeout);
                    return [4 /*yield*/, Promise.race([
                            postJSON(url, body, headers, functionsInstance.fetchImpl),
                            failAfterHandle.promise,
                            functionsInstance.cancelAllRequests
                        ])];
                case 2:
                    response = _a.sent();
                    // Always clear the failAfter timeout
                    failAfterHandle.cancel();
                    // If service was deleted, interrupted response throws an error.
                    if (!response) {
                        throw new FunctionsError('cancelled', 'Firebase Functions instance was deleted.');
                    }
                    error = _errorForResponse(response.status, response.json);
                    if (error) {
                        throw error;
                    }
                    if (!response.json) {
                        throw new FunctionsError('internal', 'Response is not valid JSON object.');
                    }
                    responseData = response.json.data;
                    // TODO(klimt): For right now, allow "result" instead of "data", for
                    // backwards compatibility.
                    if (typeof responseData === 'undefined') {
                        responseData = response.json.result;
                    }
                    if (typeof responseData === 'undefined') {
                        // Consider the response malformed.
                        throw new FunctionsError('internal', 'Response is missing data field.');
                    }
                    decodedData = decode(responseData);
                    return [2 /*return*/, { data: decodedData }];
            }
        });
    });
}

var name = "@firebase/functions";
var version = "0.11.0";

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
var AUTH_INTERNAL_NAME = 'auth-internal';
var APP_CHECK_INTERNAL_NAME = 'app-check-internal';
var MESSAGING_INTERNAL_NAME = 'messaging-internal';
function registerFunctions(fetchImpl, variant) {
    var factory = function (container, _a) {
        var regionOrCustomDomain = _a.instanceIdentifier;
        // Dependencies
        var app = container.getProvider('app').getImmediate();
        var authProvider = container.getProvider(AUTH_INTERNAL_NAME);
        var messagingProvider = container.getProvider(MESSAGING_INTERNAL_NAME);
        var appCheckProvider = container.getProvider(APP_CHECK_INTERNAL_NAME);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new FunctionsService(app, authProvider, messagingProvider, appCheckProvider, regionOrCustomDomain, fetchImpl);
    };
    _registerComponent(new Component(FUNCTIONS_TYPE, factory, "PUBLIC" /* ComponentType.PUBLIC */).setMultipleInstances(true));
    registerVersion(name, version, variant);
    // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
    registerVersion(name, version, 'esm5');
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
 * Returns a {@link Functions} instance for the given app.
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @param regionOrCustomDomain - one of:
 *   a) The region the callable functions are located in (ex: us-central1)
 *   b) A custom domain hosting the callable functions (ex: https://mydomain.com)
 * @public
 */
function getFunctions(app, regionOrCustomDomain) {
    if (app === void 0) { app = getApp(); }
    if (regionOrCustomDomain === void 0) { regionOrCustomDomain = DEFAULT_REGION; }
    // Dependencies
    var functionsProvider = _getProvider(getModularInstance(app), FUNCTIONS_TYPE);
    var functionsInstance = functionsProvider.getImmediate({
        identifier: regionOrCustomDomain
    });
    var emulator = getDefaultEmulatorHostnameAndPort('functions');
    if (emulator) {
        connectFunctionsEmulator.apply(void 0, __spreadArray([functionsInstance], emulator, false));
    }
    return functionsInstance;
}
/**
 * Modify this instance to communicate with the Cloud Functions emulator.
 *
 * Note: this must be called before this instance has been used to do any operations.
 *
 * @param host - The emulator host (ex: localhost)
 * @param port - The emulator port (ex: 5001)
 * @public
 */
function connectFunctionsEmulator(functionsInstance, host, port) {
    connectFunctionsEmulator$1(getModularInstance(functionsInstance), host, port);
}
/**
 * Returns a reference to the callable HTTPS trigger with the given name.
 * @param name - The name of the trigger.
 * @public
 */
function httpsCallable(functionsInstance, name, options) {
    return httpsCallable$1(getModularInstance(functionsInstance), name, options);
}
/**
 * Returns a reference to the callable HTTPS trigger with the specified url.
 * @param url - The url of the trigger.
 * @public
 */
function httpsCallableFromURL(functionsInstance, url, options) {
    return httpsCallableFromURL$1(getModularInstance(functionsInstance), url, options);
}

/**
 * Cloud Functions for Firebase
 *
 * @packageDocumentation
 */
registerFunctions(fetch.bind(self));

export { connectFunctionsEmulator, getFunctions, httpsCallable, httpsCallableFromURL };
//# sourceMappingURL=index.esm.js.map
