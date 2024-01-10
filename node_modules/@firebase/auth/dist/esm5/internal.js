import { au as _isIOS, av as _isAndroid, aw as _fail, ax as _getRedirectUrl, ay as debugAssert, az as _getProjectConfig, aA as _isIOS7Or8, aB as _assert, aC as _createError, aD as AuthEventManager, aE as _getInstance, b as browserLocalPersistence, aF as _persistenceKeyName, aG as _clearRedirectOutcomes, a as browserSessionPersistence, aH as _getRedirectResult, aI as _overrideRedirectResult, aJ as _castAuth } from './index-dd399a6e.js';
export { A as ActionCodeOperation, ai as ActionCodeURL, L as AuthCredential, I as AuthErrorCodes, aL as AuthImpl, aO as AuthPopup, M as EmailAuthCredential, V as EmailAuthProvider, W as FacebookAuthProvider, F as FactorId, aP as FetchProvider, Y as GithubAuthProvider, X as GoogleAuthProvider, N as OAuthCredential, Z as OAuthProvider, O as OperationType, Q as PhoneAuthCredential, P as PhoneAuthProvider, m as PhoneMultiFactorGenerator, p as ProviderId, R as RecaptchaVerifier, aQ as SAMLAuthCredential, _ as SAMLAuthProvider, S as SignInMethod, T as TotpMultiFactorGenerator, n as TotpSecret, $ as TwitterAuthProvider, aK as UserImpl, aB as _assert, aJ as _castAuth, aw as _fail, aN as _generateEventId, aM as _getClientVersion, aE as _getInstance, aH as _getRedirectResult, aI as _overrideRedirectResult, aF as _persistenceKeyName, a7 as applyActionCode, x as beforeAuthStateChanged, b as browserLocalPersistence, k as browserPopupRedirectResolver, a as browserSessionPersistence, a8 as checkActionCode, a6 as confirmPasswordReset, K as connectAuthEmulator, aa as createUserWithEmailAndPassword, G as debugErrorMap, E as deleteUser, af as fetchSignInMethodsForEmail, aq as getAdditionalUserInfo, o as getAuth, an as getIdToken, ao as getIdTokenResult, as as getMultiFactorResolver, j as getRedirectResult, U as inMemoryPersistence, i as indexedDBLocalPersistence, J as initializeAuth, t as initializeRecaptchaConfig, ad as isSignInWithEmailLink, a2 as linkWithCredential, l as linkWithPhoneNumber, d as linkWithPopup, g as linkWithRedirect, at as multiFactor, y as onAuthStateChanged, w as onIdTokenChanged, aj as parseActionCodeURL, H as prodErrorMap, a3 as reauthenticateWithCredential, r as reauthenticateWithPhoneNumber, e as reauthenticateWithPopup, h as reauthenticateWithRedirect, ar as reload, D as revokeAccessToken, ag as sendEmailVerification, a5 as sendPasswordResetEmail, ac as sendSignInLinkToEmail, q as setPersistence, a0 as signInAnonymously, a1 as signInWithCredential, a4 as signInWithCustomToken, ab as signInWithEmailAndPassword, ae as signInWithEmailLink, s as signInWithPhoneNumber, c as signInWithPopup, f as signInWithRedirect, C as signOut, ap as unlink, B as updateCurrentUser, al as updateEmail, am as updatePassword, u as updatePhoneNumber, ak as updateProfile, z as useDeviceLanguage, v as validatePassword, ah as verifyBeforeUpdateEmail, a9 as verifyPasswordResetCode } from './index-dd399a6e.js';
import { __awaiter, __generator, __extends } from 'tslib';
import { querystringDecode } from '@firebase/util';
import '@firebase/app';
import '@firebase/logger';
import '@firebase/component';

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
    return __awaiter(this, void 0, void 0, function () {
        var BuildInfo, sessionDigest, additionalParams;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    BuildInfo = _cordovaWindow().BuildInfo;
                    debugAssert(event.sessionId, 'AuthEvent did not contain a session ID');
                    return [4 /*yield*/, computeSha256(event.sessionId)];
                case 1:
                    sessionDigest = _b.sent();
                    additionalParams = {};
                    if (_isIOS()) {
                        // iOS app identifier
                        additionalParams['ibi'] = BuildInfo.packageName;
                    }
                    else if (_isAndroid()) {
                        // Android app identifier
                        additionalParams['apn'] = BuildInfo.packageName;
                    }
                    else {
                        _fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
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
    return __awaiter(this, void 0, void 0, function () {
        var BuildInfo, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    BuildInfo = _cordovaWindow().BuildInfo;
                    request = {};
                    if (_isIOS()) {
                        request.iosBundleId = BuildInfo.packageName;
                    }
                    else if (_isAndroid()) {
                        request.androidPackageName = BuildInfo.packageName;
                    }
                    else {
                        _fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
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
                iabRef = cordova.InAppBrowser.open(handlerUrl, _isIOS7Or8() ? '_blank' : '_system', 'location=yes');
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
    return __awaiter(this, void 0, void 0, function () {
        var cordova, cleanup;
        return __generator(this, function (_a) {
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
                                    reject(_createError(auth, "redirect-cancelled-by-user" /* AuthErrorCode.REDIRECT_CANCELLED_BY_USER */));
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
                            if (_isAndroid()) {
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
    _assert(typeof ((_a = win === null || win === void 0 ? void 0 : win.universalLinks) === null || _a === void 0 ? void 0 : _a.subscribe) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-universal-links-plugin-fix'
    });
    // https://www.npmjs.com/package/cordova-plugin-buildinfo
    _assert(typeof ((_b = win === null || win === void 0 ? void 0 : win.BuildInfo) === null || _b === void 0 ? void 0 : _b.packageName) !== 'undefined', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-buildInfo'
    });
    // https://github.com/google/cordova-plugin-browsertab
    _assert(typeof ((_e = (_d = (_c = win === null || win === void 0 ? void 0 : win.cordova) === null || _c === void 0 ? void 0 : _c.plugins) === null || _d === void 0 ? void 0 : _d.browsertab) === null || _e === void 0 ? void 0 : _e.openUrl) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    _assert(typeof ((_h = (_g = (_f = win === null || win === void 0 ? void 0 : win.cordova) === null || _f === void 0 ? void 0 : _f.plugins) === null || _g === void 0 ? void 0 : _g.browsertab) === null || _h === void 0 ? void 0 : _h.isAvailable) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
    _assert(typeof ((_k = (_j = win === null || win === void 0 ? void 0 : win.cordova) === null || _j === void 0 ? void 0 : _j.InAppBrowser) === null || _k === void 0 ? void 0 : _k.open) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-inappbrowser'
    });
}
/**
 * Computes the SHA-256 of a session ID. The SubtleCrypto interface is only
 * available in "secure" contexts, which covers Cordova (which is served on a file
 * protocol).
 */
function computeSha256(sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var bytes, buf, arr;
        return __generator(this, function (_a) {
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
    debugAssert(/[0-9a-zA-Z]+/.test(str), 'Can only convert alpha-numeric strings');
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
var SESSION_ID_LENGTH = 20;
/** Custom AuthEventManager that adds passive listeners to events */
var CordovaAuthEventManager = /** @class */ (function (_super) {
    __extends(CordovaAuthEventManager, _super);
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        error: _createError(auth, "no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
    };
}
function _savePartialEvent(auth, event) {
    return storage()._set(persistenceKey(auth), event);
}
function _getAndRemoveEvent(auth) {
    return __awaiter(this, void 0, void 0, function () {
        var event;
        return __generator(this, function (_a) {
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
        var error = code ? _createError(code) : null;
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
    return _getInstance(browserLocalPersistence);
}
function persistenceKey(auth) {
    return _persistenceKeyName("authEvent" /* KeyName.AUTH_EVENT */, auth.config.apiKey, auth.name);
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
    return querystringDecode(rest.join('?'));
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
        return __awaiter(this, void 0, void 0, function () {
            var key, manager;
            return __generator(this, function (_a) {
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
        _fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    };
    CordovaPopupRedirectResolver.prototype._openRedirect = function (auth, provider, authType, eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, event, url, iabRef;
            return __generator(this, function (_a) {
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
        var noEventTimeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        var universalLinksCb = function (eventData) { return __awaiter(_this, void 0, void 0, function () {
            var partialEvent, finalEvent;
            return __generator(this, function (_a) {
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
        _cordovaWindow().handleOpenURL = function (url) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        error: _createError("no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
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
    _castAuth(auth)._logFramework(framework);
}

export { addFrameworkForLogging, cordovaPopupRedirectResolver };
//# sourceMappingURL=internal.js.map
