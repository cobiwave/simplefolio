'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var totp = require('./totp-fe65684a.js');
var tslib = require('tslib');
var util = require('@firebase/util');
var app = require('@firebase/app');
require('@firebase/component');
require('undici');
require('@firebase/logger');

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
function _generateEventId(prefix, digits) {
    if (prefix === void 0) { prefix = ''; }
    if (digits === void 0) { digits = 10; }
    var random = '';
    for (var i = 0; i < digits; i++) {
        random += Math.floor(Math.random() * 10);
    }
    return prefix + random;
}

/**
 * @license
 * Copyright 2020 Google LLC.
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
var AuthPopup = /** @class */ (function () {
    function AuthPopup(window) {
        this.window = window;
        this.associatedEvent = null;
    }
    AuthPopup.prototype.close = function () {
        if (this.window) {
            try {
                this.window.close();
            }
            catch (e) { }
        }
    };
    return AuthPopup;
}());

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
 * Chooses a popup/redirect resolver to use. This prefers the override (which
 * is directly passed in), and falls back to the property set on the auth
 * object. If neither are available, this function errors w/ an argument error.
 */
function _withDefaultResolver(auth, resolverOverride) {
    if (resolverOverride) {
        return totp._getInstance(resolverOverride);
    }
    totp._assert(auth._popupRedirectResolver, auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
    return auth._popupRedirectResolver;
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
var IdpCredential = /** @class */ (function (_super) {
    tslib.__extends(IdpCredential, _super);
    function IdpCredential(params) {
        var _this = _super.call(this, "custom" /* ProviderId.CUSTOM */, "custom" /* ProviderId.CUSTOM */) || this;
        _this.params = params;
        return _this;
    }
    IdpCredential.prototype._getIdTokenResponse = function (auth) {
        return totp.signInWithIdp(auth, this._buildIdpRequest());
    };
    IdpCredential.prototype._linkToIdToken = function (auth, idToken) {
        return totp.signInWithIdp(auth, this._buildIdpRequest(idToken));
    };
    IdpCredential.prototype._getReauthenticationResolver = function (auth) {
        return totp.signInWithIdp(auth, this._buildIdpRequest());
    };
    IdpCredential.prototype._buildIdpRequest = function (idToken) {
        var request = {
            requestUri: this.params.requestUri,
            sessionId: this.params.sessionId,
            postBody: this.params.postBody,
            tenantId: this.params.tenantId,
            pendingToken: this.params.pendingToken,
            returnSecureToken: true,
            returnIdpCredential: true
        };
        if (idToken) {
            request.idToken = idToken;
        }
        return request;
    };
    return IdpCredential;
}(totp.AuthCredential));
function _signIn(params) {
    return totp._signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
}
function _reauth(params) {
    var auth = params.auth, user = params.user;
    totp._assert(user, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    return totp._reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
}
function _link(params) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var auth, user;
        return tslib.__generator(this, function (_a) {
            auth = params.auth, user = params.user;
            totp._assert(user, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
            return [2 /*return*/, totp._link(user, new IdpCredential(params), params.bypassAuthState)];
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
/**
 * Popup event manager. Handles the popup's entire lifecycle; listens to auth
 * events
 */
var AbstractPopupRedirectOperation = /** @class */ (function () {
    function AbstractPopupRedirectOperation(auth, filter, resolver, user, bypassAuthState) {
        if (bypassAuthState === void 0) { bypassAuthState = false; }
        this.auth = auth;
        this.resolver = resolver;
        this.user = user;
        this.bypassAuthState = bypassAuthState;
        this.pendingPromise = null;
        this.eventManager = null;
        this.filter = Array.isArray(filter) ? filter : [filter];
    }
    AbstractPopupRedirectOperation.prototype.execute = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib.__awaiter(_this, void 0, void 0, function () {
            var _a, e_1;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.pendingPromise = { resolve: resolve, reject: reject };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        _a = this;
                        return [4 /*yield*/, this.resolver._initialize(this.auth)];
                    case 2:
                        _a.eventManager = _b.sent();
                        return [4 /*yield*/, this.onExecution()];
                    case 3:
                        _b.sent();
                        this.eventManager.registerConsumer(this);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        this.reject(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    AbstractPopupRedirectOperation.prototype.onAuthEvent = function (event) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var urlResponse, sessionId, postBody, tenantId, error, type, params, _a, e_2;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        urlResponse = event.urlResponse, sessionId = event.sessionId, postBody = event.postBody, tenantId = event.tenantId, error = event.error, type = event.type;
                        if (error) {
                            this.reject(error);
                            return [2 /*return*/];
                        }
                        params = {
                            auth: this.auth,
                            requestUri: urlResponse,
                            sessionId: sessionId,
                            tenantId: tenantId || undefined,
                            postBody: postBody || undefined,
                            user: this.user,
                            bypassAuthState: this.bypassAuthState
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this.resolve;
                        return [4 /*yield*/, this.getIdpTask(type)(params)];
                    case 2:
                        _a.apply(this, [_b.sent()]);
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _b.sent();
                        this.reject(e_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AbstractPopupRedirectOperation.prototype.onError = function (error) {
        this.reject(error);
    };
    AbstractPopupRedirectOperation.prototype.getIdpTask = function (type) {
        switch (type) {
            case "signInViaPopup" /* AuthEventType.SIGN_IN_VIA_POPUP */:
            case "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */:
                return _signIn;
            case "linkViaPopup" /* AuthEventType.LINK_VIA_POPUP */:
            case "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */:
                return _link;
            case "reauthViaPopup" /* AuthEventType.REAUTH_VIA_POPUP */:
            case "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */:
                return _reauth;
            default:
                totp._fail(this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        }
    };
    AbstractPopupRedirectOperation.prototype.resolve = function (cred) {
        totp.debugAssert(this.pendingPromise, 'Pending promise was never set');
        this.pendingPromise.resolve(cred);
        this.unregisterAndCleanUp();
    };
    AbstractPopupRedirectOperation.prototype.reject = function (error) {
        totp.debugAssert(this.pendingPromise, 'Pending promise was never set');
        this.pendingPromise.reject(error);
        this.unregisterAndCleanUp();
    };
    AbstractPopupRedirectOperation.prototype.unregisterAndCleanUp = function () {
        if (this.eventManager) {
            this.eventManager.unregisterConsumer(this);
        }
        this.pendingPromise = null;
        this.cleanUp();
    };
    return AbstractPopupRedirectOperation;
}());

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
var PENDING_REDIRECT_KEY = 'pendingRedirect';
// We only get one redirect outcome for any one auth, so just store it
// in here.
var redirectOutcomeMap = new Map();
var RedirectAction = /** @class */ (function (_super) {
    tslib.__extends(RedirectAction, _super);
    function RedirectAction(auth, resolver, bypassAuthState) {
        if (bypassAuthState === void 0) { bypassAuthState = false; }
        var _this = _super.call(this, auth, [
            "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */,
            "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */,
            "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */,
            "unknown" /* AuthEventType.UNKNOWN */
        ], resolver, undefined, bypassAuthState) || this;
        _this.eventId = null;
        return _this;
    }
    /**
     * Override the execute function; if we already have a redirect result, then
     * just return it.
     */
    RedirectAction.prototype.execute = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var readyOutcome, hasPendingRedirect, result_1, _a, e_1;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        readyOutcome = redirectOutcomeMap.get(this.auth._key());
                        if (!!readyOutcome) return [3 /*break*/, 8];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, _getAndClearPendingRedirectStatus(this.resolver, this.auth)];
                    case 2:
                        hasPendingRedirect = _b.sent();
                        if (!hasPendingRedirect) return [3 /*break*/, 4];
                        return [4 /*yield*/, _super.prototype.execute.call(this)];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = null;
                        _b.label = 5;
                    case 5:
                        result_1 = _a;
                        readyOutcome = function () { return Promise.resolve(result_1); };
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _b.sent();
                        readyOutcome = function () { return Promise.reject(e_1); };
                        return [3 /*break*/, 7];
                    case 7:
                        redirectOutcomeMap.set(this.auth._key(), readyOutcome);
                        _b.label = 8;
                    case 8:
                        // If we're not bypassing auth state, the ready outcome should be set to
                        // null.
                        if (!this.bypassAuthState) {
                            redirectOutcomeMap.set(this.auth._key(), function () { return Promise.resolve(null); });
                        }
                        return [2 /*return*/, readyOutcome()];
                }
            });
        });
    };
    RedirectAction.prototype.onAuthEvent = function (event) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var user;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (event.type === "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */) {
                            return [2 /*return*/, _super.prototype.onAuthEvent.call(this, event)];
                        }
                        else if (event.type === "unknown" /* AuthEventType.UNKNOWN */) {
                            // This is a sentinel value indicating there's no pending redirect
                            this.resolve(null);
                            return [2 /*return*/];
                        }
                        if (!event.eventId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.auth._redirectUserForId(event.eventId)];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            this.user = user;
                            return [2 /*return*/, _super.prototype.onAuthEvent.call(this, event)];
                        }
                        else {
                            this.resolve(null);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    RedirectAction.prototype.onExecution = function () {
        return tslib.__awaiter(this, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    RedirectAction.prototype.cleanUp = function () { };
    return RedirectAction;
}(AbstractPopupRedirectOperation));
function _getAndClearPendingRedirectStatus(resolver, auth) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var key, persistence, hasPendingRedirect;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = pendingRedirectKey(auth);
                    persistence = resolverPersistence(resolver);
                    return [4 /*yield*/, persistence._isAvailable()];
                case 1:
                    if (!(_a.sent())) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, persistence._get(key)];
                case 2:
                    hasPendingRedirect = (_a.sent()) === 'true';
                    return [4 /*yield*/, persistence._remove(key)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, hasPendingRedirect];
            }
        });
    });
}
function _clearRedirectOutcomes() {
    redirectOutcomeMap.clear();
}
function _overrideRedirectResult(auth, result) {
    redirectOutcomeMap.set(auth._key(), result);
}
function resolverPersistence(resolver) {
    return totp._getInstance(resolver._redirectPersistence);
}
function pendingRedirectKey(auth) {
    return totp._persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
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
function _getRedirectResult(auth, resolverExtern, bypassAuthState) {
    if (bypassAuthState === void 0) { bypassAuthState = false; }
    return tslib.__awaiter(this, void 0, void 0, function () {
        var authInternal, resolver, action, result;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = totp._castAuth(auth);
                    resolver = _withDefaultResolver(authInternal, resolverExtern);
                    action = new RedirectAction(authInternal, resolver, bypassAuthState);
                    return [4 /*yield*/, action.execute()];
                case 1:
                    result = _a.sent();
                    if (!(result && !bypassAuthState)) return [3 /*break*/, 4];
                    delete result.user._redirectEventId;
                    return [4 /*yield*/, authInternal._persistUserIfCurrent(result.user)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, authInternal._setRedirectUser(null, resolverExtern)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, result];
            }
        });
    });
}

var STORAGE_AVAILABLE_KEY = '__sak';

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
// There are two different browser persistence types: local and session.
// Both have the same implementation but use a different underlying storage
// object.
var BrowserPersistenceClass = /** @class */ (function () {
    function BrowserPersistenceClass(storageRetriever, type) {
        this.storageRetriever = storageRetriever;
        this.type = type;
    }
    BrowserPersistenceClass.prototype._isAvailable = function () {
        try {
            if (!this.storage) {
                return Promise.resolve(false);
            }
            this.storage.setItem(STORAGE_AVAILABLE_KEY, '1');
            this.storage.removeItem(STORAGE_AVAILABLE_KEY);
            return Promise.resolve(true);
        }
        catch (_a) {
            return Promise.resolve(false);
        }
    };
    BrowserPersistenceClass.prototype._set = function (key, value) {
        this.storage.setItem(key, JSON.stringify(value));
        return Promise.resolve();
    };
    BrowserPersistenceClass.prototype._get = function (key) {
        var json = this.storage.getItem(key);
        return Promise.resolve(json ? JSON.parse(json) : null);
    };
    BrowserPersistenceClass.prototype._remove = function (key) {
        this.storage.removeItem(key);
        return Promise.resolve();
    };
    Object.defineProperty(BrowserPersistenceClass.prototype, "storage", {
        get: function () {
            return this.storageRetriever();
        },
        enumerable: false,
        configurable: true
    });
    return BrowserPersistenceClass;
}());

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
var BrowserSessionPersistence = /** @class */ (function (_super) {
    tslib.__extends(BrowserSessionPersistence, _super);
    function BrowserSessionPersistence() {
        return _super.call(this, function () { return window.sessionStorage; }, "SESSION" /* PersistenceType.SESSION */) || this;
    }
    BrowserSessionPersistence.prototype._addListener = function (_key, _listener) {
        // Listeners are not supported for session storage since it cannot be shared across windows
        return;
    };
    BrowserSessionPersistence.prototype._removeListener = function (_key, _listener) {
        // Listeners are not supported for session storage since it cannot be shared across windows
        return;
    };
    BrowserSessionPersistence.type = 'SESSION';
    return BrowserSessionPersistence;
}(BrowserPersistenceClass));
/**
 * An implementation of {@link Persistence} of `SESSION` using `sessionStorage`
 * for the underlying storage.
 *
 * @public
 */
var browserSessionPersistence = BrowserSessionPersistence;

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
 * URL for Authentication widget which will initiate the OAuth handshake
 *
 * @internal
 */
var WIDGET_PATH = '__/auth/handler';
/**
 * URL for emulated environment
 *
 * @internal
 */
var EMULATOR_WIDGET_PATH = 'emulator/auth/handler';
/**
 * Fragment name for the App Check token that gets passed to the widget
 *
 * @internal
 */
var FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent('fac');
function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var params, _i, _a, _b, key, value, scopes, paramsDict, _c, _d, key, appCheckToken, appCheckTokenFragment;
        return tslib.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    totp._assert(auth.config.authDomain, auth, "auth-domain-config-required" /* AuthErrorCode.MISSING_AUTH_DOMAIN */);
                    totp._assert(auth.config.apiKey, auth, "invalid-api-key" /* AuthErrorCode.INVALID_API_KEY */);
                    params = {
                        apiKey: auth.config.apiKey,
                        appName: auth.name,
                        authType: authType,
                        redirectUrl: redirectUrl,
                        v: app.SDK_VERSION,
                        eventId: eventId
                    };
                    if (provider instanceof totp.FederatedAuthProvider) {
                        provider.setDefaultLanguage(auth.languageCode);
                        params.providerId = provider.providerId || '';
                        if (!util.isEmpty(provider.getCustomParameters())) {
                            params.customParameters = JSON.stringify(provider.getCustomParameters());
                        }
                        // TODO set additionalParams from the provider as well?
                        for (_i = 0, _a = Object.entries(additionalParams || {}); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            params[key] = value;
                        }
                    }
                    if (provider instanceof totp.BaseOAuthProvider) {
                        scopes = provider.getScopes().filter(function (scope) { return scope !== ''; });
                        if (scopes.length > 0) {
                            params.scopes = scopes.join(',');
                        }
                    }
                    if (auth.tenantId) {
                        params.tid = auth.tenantId;
                    }
                    paramsDict = params;
                    for (_c = 0, _d = Object.keys(paramsDict); _c < _d.length; _c++) {
                        key = _d[_c];
                        if (paramsDict[key] === undefined) {
                            delete paramsDict[key];
                        }
                    }
                    return [4 /*yield*/, auth._getAppCheckToken()];
                case 1:
                    appCheckToken = _e.sent();
                    appCheckTokenFragment = appCheckToken
                        ? "#".concat(FIREBASE_APP_CHECK_FRAGMENT_ID, "=").concat(encodeURIComponent(appCheckToken))
                        : '';
                    // Start at index 1 to skip the leading '&' in the query string
                    return [2 /*return*/, "".concat(getHandlerBase(auth), "?").concat(util.querystring(paramsDict).slice(1)).concat(appCheckTokenFragment)];
            }
        });
    });
}
function getHandlerBase(_a) {
    var config = _a.config;
    if (!config.emulator) {
        return "https://".concat(config.authDomain, "/").concat(WIDGET_PATH);
    }
    return totp._emulatorUrl(config, EMULATOR_WIDGET_PATH);
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
function _cordovaWindow() {
    return window;
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
function _getProjectConfig(auth, request) {
    if (request === void 0) { request = {}; }
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            return [2 /*return*/, totp._performApiRequest(auth, "GET" /* HttpMethod.GET */, "/v1/projects" /* Endpoint.GET_PROJECT_CONFIG */, request)];
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
/**
 * How long to wait after the app comes back into focus before concluding that
 * the user closed the sign in tab.
 */
var REDIRECT_TIMEOUT_MS = 2000;
/**
 * Generates the URL for the OAuth handler.
 */
function _generateHandlerUrl(auth, event, provider) {
    var _a;
    return tslib.__awaiter(this, void 0, void 0, function () {
        var BuildInfo, sessionDigest, additionalParams;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    BuildInfo = _cordovaWindow().BuildInfo;
                    totp.debugAssert(event.sessionId, 'AuthEvent did not contain a session ID');
                    return [4 /*yield*/, computeSha256(event.sessionId)];
                case 1:
                    sessionDigest = _b.sent();
                    additionalParams = {};
                    if (totp._isIOS()) {
                        // iOS app identifier
                        additionalParams['ibi'] = BuildInfo.packageName;
                    }
                    else if (totp._isAndroid()) {
                        // Android app identifier
                        additionalParams['apn'] = BuildInfo.packageName;
                    }
                    else {
                        totp._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
                    }
                    // Add the display name if available
                    if (BuildInfo.displayName) {
                        additionalParams['appDisplayName'] = BuildInfo.displayName;
                    }
                    // Attached the hashed session ID
                    additionalParams['sessionId'] = sessionDigest;
                    return [2 /*return*/, _getRedirectUrl(auth, provider, event.type, undefined, (_a = event.eventId) !== null && _a !== void 0 ? _a : undefined, additionalParams)];
            }
        });
    });
}
/**
 * Validates that this app is valid for this project configuration
 */
function _validateOrigin(auth) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var BuildInfo, request;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    BuildInfo = _cordovaWindow().BuildInfo;
                    request = {};
                    if (totp._isIOS()) {
                        request.iosBundleId = BuildInfo.packageName;
                    }
                    else if (totp._isAndroid()) {
                        request.androidPackageName = BuildInfo.packageName;
                    }
                    else {
                        totp._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
                    }
                    // Will fail automatically if package name is not authorized
                    return [4 /*yield*/, _getProjectConfig(auth, request)];
                case 1:
                    // Will fail automatically if package name is not authorized
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function _performRedirect(handlerUrl) {
    // Get the cordova plugins
    var cordova = _cordovaWindow().cordova;
    return new Promise(function (resolve) {
        cordova.plugins.browsertab.isAvailable(function (browserTabIsAvailable) {
            var iabRef = null;
            if (browserTabIsAvailable) {
                cordova.plugins.browsertab.openUrl(handlerUrl);
            }
            else {
                // TODO: Return the inappbrowser ref that's returned from the open call
                iabRef = cordova.InAppBrowser.open(handlerUrl, totp._isIOS7Or8() ? '_blank' : '_system', 'location=yes');
            }
            resolve(iabRef);
        });
    });
}
/**
 * This function waits for app activity to be seen before resolving. It does
 * this by attaching listeners to various dom events. Once the app is determined
 * to be visible, this promise resolves. AFTER that resolution, the listeners
 * are detached and any browser tabs left open will be closed.
 */
function _waitForAppResume(auth, eventListener, iabRef) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var cordova, cleanup;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cordova = _cordovaWindow().cordova;
                    cleanup = function () { };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var onCloseTimer = null;
                            // DEFINE ALL THE CALLBACKS =====
                            function authEventSeen() {
                                var _a;
                                // Auth event was detected. Resolve this promise and close the extra
                                // window if it's still open.
                                resolve();
                                var closeBrowserTab = (_a = cordova.plugins.browsertab) === null || _a === void 0 ? void 0 : _a.close;
                                if (typeof closeBrowserTab === 'function') {
                                    closeBrowserTab();
                                }
                                // Close inappbrowser emebedded webview in iOS7 and 8 case if still
                                // open.
                                if (typeof (iabRef === null || iabRef === void 0 ? void 0 : iabRef.close) === 'function') {
                                    iabRef.close();
                                }
                            }
                            function resumed() {
                                if (onCloseTimer) {
                                    // This code already ran; do not rerun.
                                    return;
                                }
                                onCloseTimer = window.setTimeout(function () {
                                    // Wait two seeconds after resume then reject.
                                    reject(totp._createError(auth, "redirect-cancelled-by-user" /* AuthErrorCode.REDIRECT_CANCELLED_BY_USER */));
                                }, REDIRECT_TIMEOUT_MS);
                            }
                            function visibilityChanged() {
                                if ((document === null || document === void 0 ? void 0 : document.visibilityState) === 'visible') {
                                    resumed();
                                }
                            }
                            // ATTACH ALL THE LISTENERS =====
                            // Listen for the auth event
                            eventListener.addPassiveListener(authEventSeen);
                            // Listen for resume and visibility events
                            document.addEventListener('resume', resumed, false);
                            if (totp._isAndroid()) {
                                document.addEventListener('visibilitychange', visibilityChanged, false);
                            }
                            // SETUP THE CLEANUP FUNCTION =====
                            cleanup = function () {
                                eventListener.removePassiveListener(authEventSeen);
                                document.removeEventListener('resume', resumed, false);
                                document.removeEventListener('visibilitychange', visibilityChanged, false);
                                if (onCloseTimer) {
                                    window.clearTimeout(onCloseTimer);
                                }
                            };
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    cleanup();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Checks the configuration of the Cordova environment. This has no side effect
 * if the configuration is correct; otherwise it throws an error with the
 * missing plugin.
 */
function _checkCordovaConfiguration(auth) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var win = _cordovaWindow();
    // Check all dependencies installed.
    // https://github.com/nordnet/cordova-universal-links-plugin
    // Note that cordova-universal-links-plugin has been abandoned.
    // A fork with latest fixes is available at:
    // https://www.npmjs.com/package/cordova-universal-links-plugin-fix
    totp._assert(typeof ((_a = win === null || win === void 0 ? void 0 : win.universalLinks) === null || _a === void 0 ? void 0 : _a.subscribe) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-universal-links-plugin-fix'
    });
    // https://www.npmjs.com/package/cordova-plugin-buildinfo
    totp._assert(typeof ((_b = win === null || win === void 0 ? void 0 : win.BuildInfo) === null || _b === void 0 ? void 0 : _b.packageName) !== 'undefined', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-buildInfo'
    });
    // https://github.com/google/cordova-plugin-browsertab
    totp._assert(typeof ((_e = (_d = (_c = win === null || win === void 0 ? void 0 : win.cordova) === null || _c === void 0 ? void 0 : _c.plugins) === null || _d === void 0 ? void 0 : _d.browsertab) === null || _e === void 0 ? void 0 : _e.openUrl) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    totp._assert(typeof ((_h = (_g = (_f = win === null || win === void 0 ? void 0 : win.cordova) === null || _f === void 0 ? void 0 : _f.plugins) === null || _g === void 0 ? void 0 : _g.browsertab) === null || _h === void 0 ? void 0 : _h.isAvailable) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
    totp._assert(typeof ((_k = (_j = win === null || win === void 0 ? void 0 : win.cordova) === null || _j === void 0 ? void 0 : _j.InAppBrowser) === null || _k === void 0 ? void 0 : _k.open) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-inappbrowser'
    });
}
/**
 * Computes the SHA-256 of a session ID. The SubtleCrypto interface is only
 * available in "secure" contexts, which covers Cordova (which is served on a file
 * protocol).
 */
function computeSha256(sessionId) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var bytes, buf, arr;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bytes = stringToArrayBuffer(sessionId);
                    return [4 /*yield*/, crypto.subtle.digest('SHA-256', bytes)];
                case 1:
                    buf = _a.sent();
                    arr = Array.from(new Uint8Array(buf));
                    return [2 /*return*/, arr.map(function (num) { return num.toString(16).padStart(2, '0'); }).join('')];
            }
        });
    });
}
function stringToArrayBuffer(str) {
    // This function is only meant to deal with an ASCII charset and makes
    // certain simplifying assumptions.
    totp.debugAssert(/[0-9a-zA-Z]+/.test(str), 'Can only convert alpha-numeric strings');
    if (typeof TextEncoder !== 'undefined') {
        return new TextEncoder().encode(str);
    }
    var buff = new ArrayBuffer(str.length);
    var view = new Uint8Array(buff);
    for (var i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i);
    }
    return view;
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
// The amount of time to store the UIDs of seen events; this is
// set to 10 min by default
var EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1000;
var AuthEventManager = /** @class */ (function () {
    function AuthEventManager(auth) {
        this.auth = auth;
        this.cachedEventUids = new Set();
        this.consumers = new Set();
        this.queuedRedirectEvent = null;
        this.hasHandledPotentialRedirect = false;
        this.lastProcessedEventTime = Date.now();
    }
    AuthEventManager.prototype.registerConsumer = function (authEventConsumer) {
        this.consumers.add(authEventConsumer);
        if (this.queuedRedirectEvent &&
            this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
            this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
            this.saveEventToCache(this.queuedRedirectEvent);
            this.queuedRedirectEvent = null;
        }
    };
    AuthEventManager.prototype.unregisterConsumer = function (authEventConsumer) {
        this.consumers.delete(authEventConsumer);
    };
    AuthEventManager.prototype.onEvent = function (event) {
        var _this = this;
        // Check if the event has already been handled
        if (this.hasEventBeenHandled(event)) {
            return false;
        }
        var handled = false;
        this.consumers.forEach(function (consumer) {
            if (_this.isEventForConsumer(event, consumer)) {
                handled = true;
                _this.sendToConsumer(event, consumer);
                _this.saveEventToCache(event);
            }
        });
        if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
            // If we've already seen a redirect before, or this is a popup event,
            // bail now
            return handled;
        }
        this.hasHandledPotentialRedirect = true;
        // If the redirect wasn't handled, hang on to it
        if (!handled) {
            this.queuedRedirectEvent = event;
            handled = true;
        }
        return handled;
    };
    AuthEventManager.prototype.sendToConsumer = function (event, consumer) {
        var _a;
        if (event.error && !isNullRedirectEvent(event)) {
            var code = ((_a = event.error.code) === null || _a === void 0 ? void 0 : _a.split('auth/')[1]) ||
                "internal-error" /* AuthErrorCode.INTERNAL_ERROR */;
            consumer.onError(totp._createError(this.auth, code));
        }
        else {
            consumer.onAuthEvent(event);
        }
    };
    AuthEventManager.prototype.isEventForConsumer = function (event, consumer) {
        var eventIdMatches = consumer.eventId === null ||
            (!!event.eventId && event.eventId === consumer.eventId);
        return consumer.filter.includes(event.type) && eventIdMatches;
    };
    AuthEventManager.prototype.hasEventBeenHandled = function (event) {
        if (Date.now() - this.lastProcessedEventTime >=
            EVENT_DUPLICATION_CACHE_DURATION_MS) {
            this.cachedEventUids.clear();
        }
        return this.cachedEventUids.has(eventUid(event));
    };
    AuthEventManager.prototype.saveEventToCache = function (event) {
        this.cachedEventUids.add(eventUid(event));
        this.lastProcessedEventTime = Date.now();
    };
    return AuthEventManager;
}());
function eventUid(e) {
    return [e.type, e.eventId, e.sessionId, e.tenantId].filter(function (v) { return v; }).join('-');
}
function isNullRedirectEvent(_a) {
    var type = _a.type, error = _a.error;
    return (type === "unknown" /* AuthEventType.UNKNOWN */ &&
        (error === null || error === void 0 ? void 0 : error.code) === "auth/".concat("no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */));
}
function isRedirectEvent(event) {
    switch (event.type) {
        case "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */:
        case "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */:
        case "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */:
            return true;
        case "unknown" /* AuthEventType.UNKNOWN */:
            return isNullRedirectEvent(event);
        default:
            return false;
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
function _iframeCannotSyncWebStorage() {
    var ua = util.getUA();
    return totp._isSafari(ua) || totp._isIOS(ua);
}
// The polling period in case events are not supported
var _POLLING_INTERVAL_MS = 1000;
// The IE 10 localStorage cross tab synchronization delay in milliseconds
var IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
var BrowserLocalPersistence = /** @class */ (function (_super) {
    tslib.__extends(BrowserLocalPersistence, _super);
    function BrowserLocalPersistence() {
        var _this = _super.call(this, function () { return window.localStorage; }, "LOCAL" /* PersistenceType.LOCAL */) || this;
        _this.boundEventHandler = function (event, poll) { return _this.onStorageEvent(event, poll); };
        _this.listeners = {};
        _this.localCache = {};
        // setTimeout return value is platform specific
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _this.pollTimer = null;
        // Safari or iOS browser and embedded in an iframe.
        _this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && totp._isIframe();
        // Whether to use polling instead of depending on window events
        _this.fallbackToPolling = totp._isMobileBrowser();
        _this._shouldAllowMigration = true;
        return _this;
    }
    BrowserLocalPersistence.prototype.forAllChangedKeys = function (cb) {
        // Check all keys with listeners on them.
        for (var _i = 0, _a = Object.keys(this.listeners); _i < _a.length; _i++) {
            var key = _a[_i];
            // Get value from localStorage.
            var newValue = this.storage.getItem(key);
            var oldValue = this.localCache[key];
            // If local map value does not match, trigger listener with storage event.
            // Differentiate this simulated event from the real storage event.
            if (newValue !== oldValue) {
                cb(key, oldValue, newValue);
            }
        }
    };
    BrowserLocalPersistence.prototype.onStorageEvent = function (event, poll) {
        var _this = this;
        if (poll === void 0) { poll = false; }
        // Key would be null in some situations, like when localStorage is cleared
        if (!event.key) {
            this.forAllChangedKeys(function (key, _oldValue, newValue) {
                _this.notifyListeners(key, newValue);
            });
            return;
        }
        var key = event.key;
        // Check the mechanism how this event was detected.
        // The first event will dictate the mechanism to be used.
        if (poll) {
            // Environment detects storage changes via polling.
            // Remove storage event listener to prevent possible event duplication.
            this.detachListener();
        }
        else {
            // Environment detects storage changes via storage event listener.
            // Remove polling listener to prevent possible event duplication.
            this.stopPolling();
        }
        // Safari embedded iframe. Storage event will trigger with the delta
        // changes but no changes will be applied to the iframe localStorage.
        if (this.safariLocalStorageNotSynced) {
            // Get current iframe page value.
            var storedValue_1 = this.storage.getItem(key);
            // Value not synchronized, synchronize manually.
            if (event.newValue !== storedValue_1) {
                if (event.newValue !== null) {
                    // Value changed from current value.
                    this.storage.setItem(key, event.newValue);
                }
                else {
                    // Current value deleted.
                    this.storage.removeItem(key);
                }
            }
            else if (this.localCache[key] === event.newValue && !poll) {
                // Already detected and processed, do not trigger listeners again.
                return;
            }
        }
        var triggerListeners = function () {
            // Keep local map up to date in case storage event is triggered before
            // poll.
            var storedValue = _this.storage.getItem(key);
            if (!poll && _this.localCache[key] === storedValue) {
                // Real storage event which has already been detected, do nothing.
                // This seems to trigger in some IE browsers for some reason.
                return;
            }
            _this.notifyListeners(key, storedValue);
        };
        var storedValue = this.storage.getItem(key);
        if (totp._isIE10() &&
            storedValue !== event.newValue &&
            event.newValue !== event.oldValue) {
            // IE 10 has this weird bug where a storage event would trigger with the
            // correct key, oldValue and newValue but localStorage.getItem(key) does
            // not yield the updated value until a few milliseconds. This ensures
            // this recovers from that situation.
            setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
        }
        else {
            triggerListeners();
        }
    };
    BrowserLocalPersistence.prototype.notifyListeners = function (key, value) {
        this.localCache[key] = value;
        var listeners = this.listeners[key];
        if (listeners) {
            for (var _i = 0, _a = Array.from(listeners); _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(value ? JSON.parse(value) : value);
            }
        }
    };
    BrowserLocalPersistence.prototype.startPolling = function () {
        var _this = this;
        this.stopPolling();
        this.pollTimer = setInterval(function () {
            _this.forAllChangedKeys(function (key, oldValue, newValue) {
                _this.onStorageEvent(new StorageEvent('storage', {
                    key: key,
                    oldValue: oldValue,
                    newValue: newValue
                }), 
                /* poll */ true);
            });
        }, _POLLING_INTERVAL_MS);
    };
    BrowserLocalPersistence.prototype.stopPolling = function () {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    };
    BrowserLocalPersistence.prototype.attachListener = function () {
        window.addEventListener('storage', this.boundEventHandler);
    };
    BrowserLocalPersistence.prototype.detachListener = function () {
        window.removeEventListener('storage', this.boundEventHandler);
    };
    BrowserLocalPersistence.prototype._addListener = function (key, listener) {
        if (Object.keys(this.listeners).length === 0) {
            // Whether browser can detect storage event when it had already been pushed to the background.
            // This may happen in some mobile browsers. A localStorage change in the foreground window
            // will not be detected in the background window via the storage event.
            // This was detected in iOS 7.x mobile browsers
            if (this.fallbackToPolling) {
                this.startPolling();
            }
            else {
                this.attachListener();
            }
        }
        if (!this.listeners[key]) {
            this.listeners[key] = new Set();
            // Populate the cache to avoid spuriously triggering on first poll.
            this.localCache[key] = this.storage.getItem(key);
        }
        this.listeners[key].add(listener);
    };
    BrowserLocalPersistence.prototype._removeListener = function (key, listener) {
        if (this.listeners[key]) {
            this.listeners[key].delete(listener);
            if (this.listeners[key].size === 0) {
                delete this.listeners[key];
            }
        }
        if (Object.keys(this.listeners).length === 0) {
            this.detachListener();
            this.stopPolling();
        }
    };
    // Update local cache on base operations:
    BrowserLocalPersistence.prototype._set = function (key, value) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype._set.call(this, key, value)];
                    case 1:
                        _a.sent();
                        this.localCache[key] = JSON.stringify(value);
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserLocalPersistence.prototype._get = function (key) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var value;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype._get.call(this, key)];
                    case 1:
                        value = _a.sent();
                        this.localCache[key] = JSON.stringify(value);
                        return [2 /*return*/, value];
                }
            });
        });
    };
    BrowserLocalPersistence.prototype._remove = function (key) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype._remove.call(this, key)];
                    case 1:
                        _a.sent();
                        delete this.localCache[key];
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserLocalPersistence.type = 'LOCAL';
    return BrowserLocalPersistence;
}(BrowserPersistenceClass));
/**
 * An implementation of {@link Persistence} of type `LOCAL` using `localStorage`
 * for the underlying storage.
 *
 * @public
 */
var browserLocalPersistence = BrowserLocalPersistence;

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
var SESSION_ID_LENGTH = 20;
/** Custom AuthEventManager that adds passive listeners to events */
var CordovaAuthEventManager = /** @class */ (function (_super) {
    tslib.__extends(CordovaAuthEventManager, _super);
    function CordovaAuthEventManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.passiveListeners = new Set();
        _this.initPromise = new Promise(function (resolve) {
            _this.resolveInialized = resolve;
        });
        return _this;
    }
    CordovaAuthEventManager.prototype.addPassiveListener = function (cb) {
        this.passiveListeners.add(cb);
    };
    CordovaAuthEventManager.prototype.removePassiveListener = function (cb) {
        this.passiveListeners.delete(cb);
    };
    // In a Cordova environment, this manager can live through multiple redirect
    // operations
    CordovaAuthEventManager.prototype.resetRedirect = function () {
        this.queuedRedirectEvent = null;
        this.hasHandledPotentialRedirect = false;
    };
    /** Override the onEvent method */
    CordovaAuthEventManager.prototype.onEvent = function (event) {
        this.resolveInialized();
        this.passiveListeners.forEach(function (cb) { return cb(event); });
        return _super.prototype.onEvent.call(this, event);
    };
    CordovaAuthEventManager.prototype.initialized = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initPromise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CordovaAuthEventManager;
}(AuthEventManager));
/**
 * Generates a (partial) {@link AuthEvent}.
 */
function _generateNewEvent(auth, type, eventId) {
    if (eventId === void 0) { eventId = null; }
    return {
        type: type,
        eventId: eventId,
        urlResponse: null,
        sessionId: generateSessionId(),
        postBody: null,
        tenantId: auth.tenantId,
        error: totp._createError(auth, "no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
    };
}
function _savePartialEvent(auth, event) {
    return storage()._set(persistenceKey(auth), event);
}
function _getAndRemoveEvent(auth) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var event;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storage()._get(persistenceKey(auth))];
                case 1:
                    event = (_a.sent());
                    if (!event) return [3 /*break*/, 3];
                    return [4 /*yield*/, storage()._remove(persistenceKey(auth))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, event];
            }
        });
    });
}
function _eventFromPartialAndUrl(partialEvent, url) {
    var _a, _b;
    // Parse the deep link within the dynamic link URL.
    var callbackUrl = _getDeepLinkFromCallback(url);
    // Confirm it is actually a callback URL.
    // Currently the universal link will be of this format:
    // https://<AUTH_DOMAIN>/__/auth/callback<OAUTH_RESPONSE>
    // This is a fake URL but is not intended to take the user anywhere
    // and just redirect to the app.
    if (callbackUrl.includes('/__/auth/callback')) {
        // Check if there is an error in the URL.
        // This mechanism is also used to pass errors back to the app:
        // https://<AUTH_DOMAIN>/__/auth/callback?firebaseError=<STRINGIFIED_ERROR>
        var params = searchParamsOrEmpty(callbackUrl);
        // Get the error object corresponding to the stringified error if found.
        var errorObject = params['firebaseError']
            ? parseJsonOrNull(decodeURIComponent(params['firebaseError']))
            : null;
        var code = (_b = (_a = errorObject === null || errorObject === void 0 ? void 0 : errorObject['code']) === null || _a === void 0 ? void 0 : _a.split('auth/')) === null || _b === void 0 ? void 0 : _b[1];
        var error = code ? totp._createError(code) : null;
        if (error) {
            return {
                type: partialEvent.type,
                eventId: partialEvent.eventId,
                tenantId: partialEvent.tenantId,
                error: error,
                urlResponse: null,
                sessionId: null,
                postBody: null
            };
        }
        else {
            return {
                type: partialEvent.type,
                eventId: partialEvent.eventId,
                tenantId: partialEvent.tenantId,
                sessionId: partialEvent.sessionId,
                urlResponse: callbackUrl,
                postBody: null
            };
        }
    }
    return null;
}
function generateSessionId() {
    var chars = [];
    var allowedChars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < SESSION_ID_LENGTH; i++) {
        var idx = Math.floor(Math.random() * allowedChars.length);
        chars.push(allowedChars.charAt(idx));
    }
    return chars.join('');
}
function storage() {
    return totp._getInstance(browserLocalPersistence);
}
function persistenceKey(auth) {
    return totp._persistenceKeyName("authEvent" /* KeyName.AUTH_EVENT */, auth.config.apiKey, auth.name);
}
function parseJsonOrNull(json) {
    try {
        return JSON.parse(json);
    }
    catch (e) {
        return null;
    }
}
// Exported for testing
function _getDeepLinkFromCallback(url) {
    var params = searchParamsOrEmpty(url);
    var link = params['link'] ? decodeURIComponent(params['link']) : undefined;
    // Double link case (automatic redirect)
    var doubleDeepLink = searchParamsOrEmpty(link)['link'];
    // iOS custom scheme links.
    var iOSDeepLink = params['deep_link_id']
        ? decodeURIComponent(params['deep_link_id'])
        : undefined;
    var iOSDoubleDeepLink = searchParamsOrEmpty(iOSDeepLink)['link'];
    return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
}
/**
 * Optimistically tries to get search params from a string, or else returns an
 * empty search params object.
 */
function searchParamsOrEmpty(url) {
    if (!(url === null || url === void 0 ? void 0 : url.includes('?'))) {
        return {};
    }
    var _a = url.split('?'); _a[0]; var rest = _a.slice(1);
    return util.querystringDecode(rest.join('?'));
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
 * How long to wait for the initial auth event before concluding no
 * redirect pending
 */
var INITIAL_EVENT_TIMEOUT_MS = 500;
var CordovaPopupRedirectResolver = /** @class */ (function () {
    function CordovaPopupRedirectResolver() {
        this._redirectPersistence = browserSessionPersistence;
        this._shouldInitProactively = true; // This is lightweight for Cordova
        this.eventManagers = new Map();
        this.originValidationPromises = {};
        this._completeRedirectFn = _getRedirectResult;
        this._overrideRedirectResult = _overrideRedirectResult;
    }
    CordovaPopupRedirectResolver.prototype._initialize = function (auth) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var key, manager;
            return tslib.__generator(this, function (_a) {
                key = auth._key();
                manager = this.eventManagers.get(key);
                if (!manager) {
                    manager = new CordovaAuthEventManager(auth);
                    this.eventManagers.set(key, manager);
                    this.attachCallbackListeners(auth, manager);
                }
                return [2 /*return*/, manager];
            });
        });
    };
    CordovaPopupRedirectResolver.prototype._openPopup = function (auth) {
        totp._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    };
    CordovaPopupRedirectResolver.prototype._openRedirect = function (auth, provider, authType, eventId) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var manager, event, url, iabRef;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _checkCordovaConfiguration(auth);
                        return [4 /*yield*/, this._initialize(auth)];
                    case 1:
                        manager = _a.sent();
                        return [4 /*yield*/, manager.initialized()];
                    case 2:
                        _a.sent();
                        // Reset the persisted redirect states. This does not matter on Web where
                        // the redirect always blows away application state entirely. On Cordova,
                        // the app maintains control flow through the redirect.
                        manager.resetRedirect();
                        _clearRedirectOutcomes();
                        return [4 /*yield*/, this._originValidation(auth)];
                    case 3:
                        _a.sent();
                        event = _generateNewEvent(auth, authType, eventId);
                        return [4 /*yield*/, _savePartialEvent(auth, event)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, _generateHandlerUrl(auth, event, provider)];
                    case 5:
                        url = _a.sent();
                        return [4 /*yield*/, _performRedirect(url)];
                    case 6:
                        iabRef = _a.sent();
                        return [2 /*return*/, _waitForAppResume(auth, manager, iabRef)];
                }
            });
        });
    };
    CordovaPopupRedirectResolver.prototype._isIframeWebStorageSupported = function (_auth, _cb) {
        throw new Error('Method not implemented.');
    };
    CordovaPopupRedirectResolver.prototype._originValidation = function (auth) {
        var key = auth._key();
        if (!this.originValidationPromises[key]) {
            this.originValidationPromises[key] = _validateOrigin(auth);
        }
        return this.originValidationPromises[key];
    };
    CordovaPopupRedirectResolver.prototype.attachCallbackListeners = function (auth, manager) {
        var _this = this;
        // Get the global plugins
        var _a = _cordovaWindow(), universalLinks = _a.universalLinks, handleOpenURL = _a.handleOpenURL, BuildInfo = _a.BuildInfo;
        var noEventTimeout = setTimeout(function () { return tslib.__awaiter(_this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // We didn't see that initial event. Clear any pending object and
                    // dispatch no event
                    return [4 /*yield*/, _getAndRemoveEvent(auth)];
                    case 1:
                        // We didn't see that initial event. Clear any pending object and
                        // dispatch no event
                        _a.sent();
                        manager.onEvent(generateNoEvent());
                        return [2 /*return*/];
                }
            });
        }); }, INITIAL_EVENT_TIMEOUT_MS);
        var universalLinksCb = function (eventData) { return tslib.__awaiter(_this, void 0, void 0, function () {
            var partialEvent, finalEvent;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // We have an event so we can clear the no event timeout
                        clearTimeout(noEventTimeout);
                        return [4 /*yield*/, _getAndRemoveEvent(auth)];
                    case 1:
                        partialEvent = _a.sent();
                        finalEvent = null;
                        if (partialEvent && (eventData === null || eventData === void 0 ? void 0 : eventData['url'])) {
                            finalEvent = _eventFromPartialAndUrl(partialEvent, eventData['url']);
                        }
                        // If finalEvent is never filled, trigger with no event
                        manager.onEvent(finalEvent || generateNoEvent());
                        return [2 /*return*/];
                }
            });
        }); };
        // Universal links subscriber doesn't exist for iOS, so we need to check
        if (typeof universalLinks !== 'undefined' &&
            typeof universalLinks.subscribe === 'function') {
            universalLinks.subscribe(null, universalLinksCb);
        }
        // iOS 7 or 8 custom URL schemes.
        // This is also the current default behavior for iOS 9+.
        // For this to work, cordova-plugin-customurlscheme needs to be installed.
        // https://github.com/EddyVerbruggen/Custom-URL-scheme
        // Do not overwrite the existing developer's URL handler.
        var existingHandleOpenURL = handleOpenURL;
        var packagePrefix = "".concat(BuildInfo.packageName.toLowerCase(), "://");
        _cordovaWindow().handleOpenURL = function (url) { return tslib.__awaiter(_this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                if (url.toLowerCase().startsWith(packagePrefix)) {
                    // We want this intentionally to float
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    universalLinksCb({ url: url });
                }
                // Call the developer's handler if it is present.
                if (typeof existingHandleOpenURL === 'function') {
                    try {
                        existingHandleOpenURL(url);
                    }
                    catch (e) {
                        // This is a developer error. Don't stop the flow of the SDK.
                        console.error(e);
                    }
                }
                return [2 /*return*/];
            });
        }); };
    };
    return CordovaPopupRedirectResolver;
}());
/**
 * An implementation of {@link PopupRedirectResolver} suitable for Cordova
 * based applications.
 *
 * @public
 */
var cordovaPopupRedirectResolver = CordovaPopupRedirectResolver;
function generateNoEvent() {
    return {
        type: "unknown" /* AuthEventType.UNKNOWN */,
        eventId: null,
        sessionId: null,
        urlResponse: null,
        postBody: null,
        tenantId: null,
        error: totp._createError("no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
    };
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
// This function should only be called by frameworks (e.g. FirebaseUI-web) to log their usage.
// It is not intended for direct use by developer apps. NO jsdoc here to intentionally leave it out
// of autogenerated documentation pages to reduce accidental misuse.
function addFrameworkForLogging(auth, framework) {
    totp._castAuth(auth)._logFramework(framework);
}

exports.ActionCodeOperation = totp.ActionCodeOperation;
exports.ActionCodeURL = totp.ActionCodeURL;
exports.AuthCredential = totp.AuthCredential;
exports.AuthErrorCodes = totp.AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY;
exports.AuthImpl = totp.AuthImpl;
exports.EmailAuthCredential = totp.EmailAuthCredential;
exports.EmailAuthProvider = totp.EmailAuthProvider;
exports.FacebookAuthProvider = totp.FacebookAuthProvider;
exports.FactorId = totp.FactorId;
exports.FetchProvider = totp.FetchProvider;
exports.GithubAuthProvider = totp.GithubAuthProvider;
exports.GoogleAuthProvider = totp.GoogleAuthProvider;
exports.OAuthCredential = totp.OAuthCredential;
exports.OAuthProvider = totp.OAuthProvider;
exports.OperationType = totp.OperationType;
exports.PhoneAuthCredential = totp.PhoneAuthCredential;
exports.PhoneAuthProvider = totp.PhoneAuthProvider;
exports.PhoneMultiFactorGenerator = totp.PhoneMultiFactorGenerator;
exports.ProviderId = totp.ProviderId;
exports.RecaptchaVerifier = totp.RecaptchaVerifier;
exports.SAMLAuthCredential = totp.SAMLAuthCredential;
exports.SAMLAuthProvider = totp.SAMLAuthProvider;
exports.SignInMethod = totp.SignInMethod;
exports.TotpMultiFactorGenerator = totp.TotpMultiFactorGenerator;
exports.TotpSecret = totp.TotpSecret;
exports.TwitterAuthProvider = totp.TwitterAuthProvider;
exports.UserImpl = totp.UserImpl;
exports._assert = totp._assert;
exports._castAuth = totp._castAuth;
exports._fail = totp._fail;
exports._getClientVersion = totp._getClientVersion;
exports._getInstance = totp._getInstance;
exports._persistenceKeyName = totp._persistenceKeyName;
exports.applyActionCode = totp.applyActionCode;
exports.beforeAuthStateChanged = totp.beforeAuthStateChanged;
exports.browserLocalPersistence = totp.browserLocalPersistence;
exports.browserPopupRedirectResolver = totp.browserPopupRedirectResolver;
exports.browserSessionPersistence = totp.browserSessionPersistence;
exports.checkActionCode = totp.checkActionCode;
exports.confirmPasswordReset = totp.confirmPasswordReset;
exports.connectAuthEmulator = totp.connectAuthEmulator;
exports.createUserWithEmailAndPassword = totp.createUserWithEmailAndPassword;
exports.debugErrorMap = totp.debugErrorMap;
exports.deleteUser = totp.deleteUser;
exports.fetchSignInMethodsForEmail = totp.fetchSignInMethodsForEmail;
exports.getAdditionalUserInfo = totp.getAdditionalUserInfo;
exports.getAuth = totp.getAuth;
exports.getIdToken = totp.getIdToken;
exports.getIdTokenResult = totp.getIdTokenResult;
exports.getMultiFactorResolver = totp.getMultiFactorResolver;
exports.getRedirectResult = totp.getRedirectResult;
exports.inMemoryPersistence = totp.inMemoryPersistence;
exports.indexedDBLocalPersistence = totp.indexedDBLocalPersistence;
exports.initializeAuth = totp.initializeAuth;
exports.initializeRecaptchaConfig = totp.initializeRecaptchaConfig;
exports.isSignInWithEmailLink = totp.isSignInWithEmailLink;
exports.linkWithCredential = totp.linkWithCredential;
exports.linkWithPhoneNumber = totp.linkWithPhoneNumber;
exports.linkWithPopup = totp.linkWithPopup;
exports.linkWithRedirect = totp.linkWithRedirect;
exports.multiFactor = totp.multiFactor;
exports.onAuthStateChanged = totp.onAuthStateChanged;
exports.onIdTokenChanged = totp.onIdTokenChanged;
exports.parseActionCodeURL = totp.parseActionCodeURL;
exports.prodErrorMap = totp.prodErrorMap;
exports.reauthenticateWithCredential = totp.reauthenticateWithCredential;
exports.reauthenticateWithPhoneNumber = totp.reauthenticateWithPhoneNumber;
exports.reauthenticateWithPopup = totp.reauthenticateWithPopup;
exports.reauthenticateWithRedirect = totp.reauthenticateWithRedirect;
exports.reload = totp.reload;
exports.revokeAccessToken = totp.revokeAccessToken;
exports.sendEmailVerification = totp.sendEmailVerification;
exports.sendPasswordResetEmail = totp.sendPasswordResetEmail;
exports.sendSignInLinkToEmail = totp.sendSignInLinkToEmail;
exports.setPersistence = totp.setPersistence;
exports.signInAnonymously = totp.signInAnonymously;
exports.signInWithCredential = totp.signInWithCredential;
exports.signInWithCustomToken = totp.signInWithCustomToken;
exports.signInWithEmailAndPassword = totp.signInWithEmailAndPassword;
exports.signInWithEmailLink = totp.signInWithEmailLink;
exports.signInWithPhoneNumber = totp.signInWithPhoneNumber;
exports.signInWithPopup = totp.signInWithPopup;
exports.signInWithRedirect = totp.signInWithRedirect;
exports.signOut = totp.signOut;
exports.unlink = totp.unlink;
exports.updateCurrentUser = totp.updateCurrentUser;
exports.updateEmail = totp.updateEmail;
exports.updatePassword = totp.updatePassword;
exports.updatePhoneNumber = totp.updatePhoneNumber;
exports.updateProfile = totp.updateProfile;
exports.useDeviceLanguage = totp.useDeviceLanguage;
exports.validatePassword = totp.validatePassword;
exports.verifyBeforeUpdateEmail = totp.verifyBeforeUpdateEmail;
exports.verifyPasswordResetCode = totp.verifyPasswordResetCode;
exports.AuthPopup = AuthPopup;
exports._generateEventId = _generateEventId;
exports._getRedirectResult = _getRedirectResult;
exports._overrideRedirectResult = _overrideRedirectResult;
exports.addFrameworkForLogging = addFrameworkForLogging;
exports.cordovaPopupRedirectResolver = cordovaPopupRedirectResolver;
//# sourceMappingURL=internal.js.map
