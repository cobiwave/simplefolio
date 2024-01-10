import { ai as _performApiRequest, aj as _addTidIfNecessary, ak as _assert, al as Delay, am as _window, an as isV2, ao as _createError, ap as _loadJS, aq as _generateCallbackName, ar as getRecaptchaParams, as as _isHttpOrHttps, at as _isWorker, au as _castAuth, M as signInWithCredential, N as linkWithCredential, av as _assertLinkedStatus, Q as reauthenticateWithCredential, aw as sendPhoneVerificationCode, ax as startEnrollPhoneMfa, ay as _link, B as PhoneAuthCredential, az as debugAssert, aA as _generateEventId, aB as AbstractPopupRedirectOperation, aC as _assertInstanceOf, aD as _withDefaultResolver, aE as FederatedAuthProvider, aF as _fail, aG as _getProjectConfig, aH as _getCurrentUrl, aI as _emulatorUrl, aJ as _isChromeIOS, aK as _isFirefox, aL as _isIOSStandalone, aM as _getRedirectUrl, aN as _setWindowLocation, aO as _isMobileBrowser, aP as _isSafari, aQ as _isIOS, f as browserSessionPersistence, aR as _getRedirectResult, aS as _overrideRedirectResult, aT as AuthEventManager, aU as debugFail, aV as finalizeEnrollPhoneMfa, aW as finalizeEnrollTotpMfa, aX as startEnrollTotpMfa, r as registerAuth, i as initializeAuth, c as indexedDBLocalPersistence, e as browserLocalPersistence, j as beforeAuthStateChanged, o as onIdTokenChanged, x as connectAuthEmulator } from './popup_redirect-106f885f.js';
export { A as ActionCodeOperation, a6 as ActionCodeURL, y as AuthCredential, w as AuthErrorCodes, a$ as AuthImpl, E as EmailAuthCredential, D as EmailAuthProvider, G as FacebookAuthProvider, F as FactorId, b1 as FetchProvider, I as GithubAuthProvider, H as GoogleAuthProvider, z as OAuthCredential, J as OAuthProvider, O as OperationType, B as PhoneAuthCredential, P as ProviderId, b2 as SAMLAuthCredential, K as SAMLAuthProvider, S as SignInMethod, T as TwitterAuthProvider, aZ as UserImpl, ak as _assert, au as _castAuth, aF as _fail, aA as _generateEventId, b0 as _getClientVersion, a_ as _getInstance, aR as _getRedirectResult, aS as _overrideRedirectResult, aY as _persistenceKeyName, W as applyActionCode, j as beforeAuthStateChanged, e as browserLocalPersistence, f as browserSessionPersistence, X as checkActionCode, V as confirmPasswordReset, x as connectAuthEmulator, d as cordovaPopupRedirectResolver, Z as createUserWithEmailAndPassword, q as debugErrorMap, p as deleteUser, a3 as fetchSignInMethodsForEmail, ae as getAdditionalUserInfo, ab as getIdToken, ac as getIdTokenResult, ag as getMultiFactorResolver, g as getRedirectResult, C as inMemoryPersistence, c as indexedDBLocalPersistence, i as initializeAuth, h as initializeRecaptchaConfig, a1 as isSignInWithEmailLink, N as linkWithCredential, b4 as linkWithRedirect, ah as multiFactor, k as onAuthStateChanged, o as onIdTokenChanged, a7 as parseActionCodeURL, t as prodErrorMap, Q as reauthenticateWithCredential, b5 as reauthenticateWithRedirect, af as reload, n as revokeAccessToken, a4 as sendEmailVerification, U as sendPasswordResetEmail, a0 as sendSignInLinkToEmail, s as setPersistence, L as signInAnonymously, M as signInWithCredential, R as signInWithCustomToken, $ as signInWithEmailAndPassword, a2 as signInWithEmailLink, b3 as signInWithRedirect, m as signOut, ad as unlink, l as updateCurrentUser, a9 as updateEmail, aa as updatePassword, a8 as updateProfile, u as useDeviceLanguage, v as validatePassword, a5 as verifyBeforeUpdateEmail, Y as verifyPasswordResetCode } from './popup_redirect-106f885f.js';
import { __awaiter, __generator, __assign, __extends, __spreadArray } from 'tslib';
import { querystring, getModularInstance, getUA, getExperimentalSetting, getDefaultEmulatorHost } from '@firebase/util';
import { SDK_VERSION, getApp, _getProvider } from '@firebase/app';
import '@firebase/component';
import '@firebase/logger';

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
function startSignInPhoneMfa(auth, request) {
    return _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts/mfaSignIn:start" /* Endpoint.START_MFA_SIGN_IN */, _addTidIfNecessary(auth, request));
}
function finalizeSignInPhoneMfa(auth, request) {
    return _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts/mfaSignIn:finalize" /* Endpoint.FINALIZE_MFA_SIGN_IN */, _addTidIfNecessary(auth, request));
}
function finalizeSignInTotpMfa(auth, request) {
    return _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts/mfaSignIn:finalize" /* Endpoint.FINALIZE_MFA_SIGN_IN */, _addTidIfNecessary(auth, request));
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
var _SOLVE_TIME_MS = 500;
var _EXPIRATION_TIME_MS = 60000;
var _WIDGET_ID_START = 1000000000000;
var MockReCaptcha = /** @class */ (function () {
    function MockReCaptcha(auth) {
        this.auth = auth;
        this.counter = _WIDGET_ID_START;
        this._widgets = new Map();
    }
    MockReCaptcha.prototype.render = function (container, parameters) {
        var id = this.counter;
        this._widgets.set(id, new MockWidget(container, this.auth.name, parameters || {}));
        this.counter++;
        return id;
    };
    MockReCaptcha.prototype.reset = function (optWidgetId) {
        var _a;
        var id = optWidgetId || _WIDGET_ID_START;
        void ((_a = this._widgets.get(id)) === null || _a === void 0 ? void 0 : _a.delete());
        this._widgets.delete(id);
    };
    MockReCaptcha.prototype.getResponse = function (optWidgetId) {
        var _a;
        var id = optWidgetId || _WIDGET_ID_START;
        return ((_a = this._widgets.get(id)) === null || _a === void 0 ? void 0 : _a.getResponse()) || '';
    };
    MockReCaptcha.prototype.execute = function (optWidgetId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_b) {
                id = optWidgetId || _WIDGET_ID_START;
                void ((_a = this._widgets.get(id)) === null || _a === void 0 ? void 0 : _a.execute());
                return [2 /*return*/, ''];
            });
        });
    };
    return MockReCaptcha;
}());
var MockWidget = /** @class */ (function () {
    function MockWidget(containerOrId, appName, params) {
        var _this = this;
        this.params = params;
        this.timerId = null;
        this.deleted = false;
        this.responseToken = null;
        this.clickHandler = function () {
            _this.execute();
        };
        var container = typeof containerOrId === 'string'
            ? document.getElementById(containerOrId)
            : containerOrId;
        _assert(container, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */, { appName: appName });
        this.container = container;
        this.isVisible = this.params.size !== 'invisible';
        if (this.isVisible) {
            this.execute();
        }
        else {
            this.container.addEventListener('click', this.clickHandler);
        }
    }
    MockWidget.prototype.getResponse = function () {
        this.checkIfDeleted();
        return this.responseToken;
    };
    MockWidget.prototype.delete = function () {
        this.checkIfDeleted();
        this.deleted = true;
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        this.container.removeEventListener('click', this.clickHandler);
    };
    MockWidget.prototype.execute = function () {
        var _this = this;
        this.checkIfDeleted();
        if (this.timerId) {
            return;
        }
        this.timerId = window.setTimeout(function () {
            _this.responseToken = generateRandomAlphaNumericString(50);
            var _a = _this.params, callback = _a.callback, expiredCallback = _a["expired-callback"];
            if (callback) {
                try {
                    callback(_this.responseToken);
                }
                catch (e) { }
            }
            _this.timerId = window.setTimeout(function () {
                _this.timerId = null;
                _this.responseToken = null;
                if (expiredCallback) {
                    try {
                        expiredCallback();
                    }
                    catch (e) { }
                }
                if (_this.isVisible) {
                    _this.execute();
                }
            }, _EXPIRATION_TIME_MS);
        }, _SOLVE_TIME_MS);
    };
    MockWidget.prototype.checkIfDeleted = function () {
        if (this.deleted) {
            throw new Error('reCAPTCHA mock was already deleted!');
        }
    };
    return MockWidget;
}());
function generateRandomAlphaNumericString(len) {
    var chars = [];
    var allowedChars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < len; i++) {
        chars.push(allowedChars.charAt(Math.floor(Math.random() * allowedChars.length)));
    }
    return chars.join('');
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
// ReCaptcha will load using the same callback, so the callback function needs
// to be kept around
var _JSLOAD_CALLBACK = _generateCallbackName('rcb');
var NETWORK_TIMEOUT_DELAY = new Delay(30000, 60000);
var RECAPTCHA_BASE = 'https://www.google.com/recaptcha/api.js?';
/**
 * Loader for the GReCaptcha library. There should only ever be one of this.
 */
var ReCaptchaLoaderImpl = /** @class */ (function () {
    function ReCaptchaLoaderImpl() {
        var _a;
        this.hostLanguage = '';
        this.counter = 0;
        /**
         * Check for `render()` method. `window.grecaptcha` will exist if the Enterprise
         * version of the ReCAPTCHA script was loaded by someone else (e.g. App Check) but
         * `window.grecaptcha.render()` will not. Another load will add it.
         */
        this.librarySeparatelyLoaded = !!((_a = _window().grecaptcha) === null || _a === void 0 ? void 0 : _a.render);
    }
    ReCaptchaLoaderImpl.prototype.load = function (auth, hl) {
        var _this = this;
        if (hl === void 0) { hl = ''; }
        _assert(isHostLanguageValid(hl), auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        if (this.shouldResolveImmediately(hl) && isV2(_window().grecaptcha)) {
            return Promise.resolve(_window().grecaptcha);
        }
        return new Promise(function (resolve, reject) {
            var networkTimeout = _window().setTimeout(function () {
                reject(_createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
            }, NETWORK_TIMEOUT_DELAY.get());
            _window()[_JSLOAD_CALLBACK] = function () {
                _window().clearTimeout(networkTimeout);
                delete _window()[_JSLOAD_CALLBACK];
                var recaptcha = _window().grecaptcha;
                if (!recaptcha || !isV2(recaptcha)) {
                    reject(_createError(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */));
                    return;
                }
                // Wrap the greptcha render function so that we know if the developer has
                // called it separately
                var render = recaptcha.render;
                recaptcha.render = function (container, params) {
                    var widgetId = render(container, params);
                    _this.counter++;
                    return widgetId;
                };
                _this.hostLanguage = hl;
                resolve(recaptcha);
            };
            var url = "".concat(RECAPTCHA_BASE, "?").concat(querystring({
                onload: _JSLOAD_CALLBACK,
                render: 'explicit',
                hl: hl
            }));
            _loadJS(url).catch(function () {
                clearTimeout(networkTimeout);
                reject(_createError(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */));
            });
        });
    };
    ReCaptchaLoaderImpl.prototype.clearedOneInstance = function () {
        this.counter--;
    };
    ReCaptchaLoaderImpl.prototype.shouldResolveImmediately = function (hl) {
        var _a;
        // We can resolve immediately if:
        //   • grecaptcha is already defined AND (
        //     1. the requested language codes are the same OR
        //     2. there exists already a ReCaptcha on the page
        //     3. the library was already loaded by the app
        // In cases (2) and (3), we _can't_ reload as it would break the recaptchas
        // that are already in the page
        return (!!((_a = _window().grecaptcha) === null || _a === void 0 ? void 0 : _a.render) &&
            (hl === this.hostLanguage ||
                this.counter > 0 ||
                this.librarySeparatelyLoaded));
    };
    return ReCaptchaLoaderImpl;
}());
function isHostLanguageValid(hl) {
    return hl.length <= 6 && /^\s*[a-zA-Z0-9\-]*\s*$/.test(hl);
}
var MockReCaptchaLoaderImpl = /** @class */ (function () {
    function MockReCaptchaLoaderImpl() {
    }
    MockReCaptchaLoaderImpl.prototype.load = function (auth) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new MockReCaptcha(auth)];
            });
        });
    };
    MockReCaptchaLoaderImpl.prototype.clearedOneInstance = function () { };
    return MockReCaptchaLoaderImpl;
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
var RECAPTCHA_VERIFIER_TYPE = 'recaptcha';
var DEFAULT_PARAMS = {
    theme: 'light',
    type: 'image'
};
/**
 * An {@link https://www.google.com/recaptcha/ | reCAPTCHA}-based application verifier.
 *
 * @remarks
 * `RecaptchaVerifier` does not work in a Node.js environment.
 *
 * @public
 */
var RecaptchaVerifier = /** @class */ (function () {
    /**
     * @param authExtern - The corresponding Firebase {@link Auth} instance.
     *
     * @param containerOrId - The reCAPTCHA container parameter.
     *
     * @remarks
     * This has different meaning depending on whether the reCAPTCHA is hidden or visible. For a
     * visible reCAPTCHA the container must be empty. If a string is used, it has to correspond to
     * an element ID. The corresponding element must also must be in the DOM at the time of
     * initialization.
     *
     * @param parameters - The optional reCAPTCHA parameters.
     *
     * @remarks
     * Check the reCAPTCHA docs for a comprehensive list. All parameters are accepted except for
     * the sitekey. Firebase Auth backend provisions a reCAPTCHA for each project and will
     * configure this upon rendering. For an invisible reCAPTCHA, a size key must have the value
     * 'invisible'.
     */
    function RecaptchaVerifier(authExtern, containerOrId, parameters) {
        if (parameters === void 0) { parameters = __assign({}, DEFAULT_PARAMS); }
        this.parameters = parameters;
        /**
         * The application verifier type.
         *
         * @remarks
         * For a reCAPTCHA verifier, this is 'recaptcha'.
         */
        this.type = RECAPTCHA_VERIFIER_TYPE;
        this.destroyed = false;
        this.widgetId = null;
        this.tokenChangeListeners = new Set();
        this.renderPromise = null;
        this.recaptcha = null;
        this.auth = _castAuth(authExtern);
        this.isInvisible = this.parameters.size === 'invisible';
        _assert(typeof document !== 'undefined', this.auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
        var container = typeof containerOrId === 'string'
            ? document.getElementById(containerOrId)
            : containerOrId;
        _assert(container, this.auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        this.container = container;
        this.parameters.callback = this.makeTokenCallback(this.parameters.callback);
        this._recaptchaLoader = this.auth.settings.appVerificationDisabledForTesting
            ? new MockReCaptchaLoaderImpl()
            : new ReCaptchaLoaderImpl();
        this.validateStartingState();
        // TODO: Figure out if sdk version is needed
    }
    /**
     * Waits for the user to solve the reCAPTCHA and resolves with the reCAPTCHA token.
     *
     * @returns A Promise for the reCAPTCHA token.
     */
    RecaptchaVerifier.prototype.verify = function () {
        return __awaiter(this, void 0, void 0, function () {
            var id, recaptcha, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.assertNotDestroyed();
                        return [4 /*yield*/, this.render()];
                    case 1:
                        id = _a.sent();
                        recaptcha = this.getAssertedRecaptcha();
                        response = recaptcha.getResponse(id);
                        if (response) {
                            return [2 /*return*/, response];
                        }
                        return [2 /*return*/, new Promise(function (resolve) {
                                var tokenChange = function (token) {
                                    if (!token) {
                                        return; // Ignore token expirations.
                                    }
                                    _this.tokenChangeListeners.delete(tokenChange);
                                    resolve(token);
                                };
                                _this.tokenChangeListeners.add(tokenChange);
                                if (_this.isInvisible) {
                                    recaptcha.execute(id);
                                }
                            })];
                }
            });
        });
    };
    /**
     * Renders the reCAPTCHA widget on the page.
     *
     * @returns A Promise that resolves with the reCAPTCHA widget ID.
     */
    RecaptchaVerifier.prototype.render = function () {
        var _this = this;
        try {
            this.assertNotDestroyed();
        }
        catch (e) {
            // This method returns a promise. Since it's not async (we want to return the
            // _same_ promise if rendering is still occurring), the API surface should
            // reject with the error rather than just throw
            return Promise.reject(e);
        }
        if (this.renderPromise) {
            return this.renderPromise;
        }
        this.renderPromise = this.makeRenderPromise().catch(function (e) {
            _this.renderPromise = null;
            throw e;
        });
        return this.renderPromise;
    };
    /** @internal */
    RecaptchaVerifier.prototype._reset = function () {
        this.assertNotDestroyed();
        if (this.widgetId !== null) {
            this.getAssertedRecaptcha().reset(this.widgetId);
        }
    };
    /**
     * Clears the reCAPTCHA widget from the page and destroys the instance.
     */
    RecaptchaVerifier.prototype.clear = function () {
        var _this = this;
        this.assertNotDestroyed();
        this.destroyed = true;
        this._recaptchaLoader.clearedOneInstance();
        if (!this.isInvisible) {
            this.container.childNodes.forEach(function (node) {
                _this.container.removeChild(node);
            });
        }
    };
    RecaptchaVerifier.prototype.validateStartingState = function () {
        _assert(!this.parameters.sitekey, this.auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        _assert(this.isInvisible || !this.container.hasChildNodes(), this.auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        _assert(typeof document !== 'undefined', this.auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    };
    RecaptchaVerifier.prototype.makeTokenCallback = function (existing) {
        var _this = this;
        return function (token) {
            _this.tokenChangeListeners.forEach(function (listener) { return listener(token); });
            if (typeof existing === 'function') {
                existing(token);
            }
            else if (typeof existing === 'string') {
                var globalFunc = _window()[existing];
                if (typeof globalFunc === 'function') {
                    globalFunc(token);
                }
            }
        };
    };
    RecaptchaVerifier.prototype.assertNotDestroyed = function () {
        _assert(!this.destroyed, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    };
    RecaptchaVerifier.prototype.makeRenderPromise = function () {
        return __awaiter(this, void 0, void 0, function () {
            var container, guaranteedEmpty;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        if (!this.widgetId) {
                            container = this.container;
                            if (!this.isInvisible) {
                                guaranteedEmpty = document.createElement('div');
                                container.appendChild(guaranteedEmpty);
                                container = guaranteedEmpty;
                            }
                            this.widgetId = this.getAssertedRecaptcha().render(container, this.parameters);
                        }
                        return [2 /*return*/, this.widgetId];
                }
            });
        });
    };
    RecaptchaVerifier.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, siteKey;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _assert(_isHttpOrHttps() && !_isWorker(), this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                        return [4 /*yield*/, domReady()];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this._recaptchaLoader.load(this.auth, this.auth.languageCode || undefined)];
                    case 2:
                        _a.recaptcha = _b.sent();
                        return [4 /*yield*/, getRecaptchaParams(this.auth)];
                    case 3:
                        siteKey = _b.sent();
                        _assert(siteKey, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                        this.parameters.sitekey = siteKey;
                        return [2 /*return*/];
                }
            });
        });
    };
    RecaptchaVerifier.prototype.getAssertedRecaptcha = function () {
        _assert(this.recaptcha, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        return this.recaptcha;
    };
    return RecaptchaVerifier;
}());
function domReady() {
    var resolver = null;
    return new Promise(function (resolve) {
        if (document.readyState === 'complete') {
            resolve();
            return;
        }
        // Document not ready, wait for load before resolving.
        // Save resolver, so we can remove listener in case it was externally
        // cancelled.
        resolver = function () { return resolve(); };
        window.addEventListener('load', resolver);
    }).catch(function (e) {
        if (resolver) {
            window.removeEventListener('load', resolver);
        }
        throw e;
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
var ConfirmationResultImpl = /** @class */ (function () {
    function ConfirmationResultImpl(verificationId, onConfirmation) {
        this.verificationId = verificationId;
        this.onConfirmation = onConfirmation;
    }
    ConfirmationResultImpl.prototype.confirm = function (verificationCode) {
        var authCredential = PhoneAuthCredential._fromVerification(this.verificationId, verificationCode);
        return this.onConfirmation(authCredential);
    };
    return ConfirmationResultImpl;
}());
/**
 * Asynchronously signs in using a phone number.
 *
 * @remarks
 * This method sends a code via SMS to the given
 * phone number, and returns a {@link ConfirmationResult}. After the user
 * provides the code sent to their phone, call {@link ConfirmationResult.confirm}
 * with the code to sign the user in.
 *
 * For abuse prevention, this method also requires a {@link ApplicationVerifier}.
 * This SDK includes a reCAPTCHA-based implementation, {@link RecaptchaVerifier}.
 * This function can work on other platforms that do not support the
 * {@link RecaptchaVerifier} (like React Native), but you need to use a
 * third-party {@link ApplicationVerifier} implementation.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // 'recaptcha-container' is the ID of an element in the DOM.
 * const applicationVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
 * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
 * // Obtain a verificationCode from the user.
 * const credential = await confirmationResult.confirm(verificationCode);
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param phoneNumber - The user's phone number in E.164 format (e.g. +16505550101).
 * @param appVerifier - The {@link ApplicationVerifier}.
 *
 * @public
 */
function signInWithPhoneNumber(auth, phoneNumber, appVerifier) {
    return __awaiter(this, void 0, void 0, function () {
        var authInternal, verificationId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = _castAuth(auth);
                    return [4 /*yield*/, _verifyPhoneNumber(authInternal, phoneNumber, getModularInstance(appVerifier))];
                case 1:
                    verificationId = _a.sent();
                    return [2 /*return*/, new ConfirmationResultImpl(verificationId, function (cred) {
                            return signInWithCredential(authInternal, cred);
                        })];
            }
        });
    });
}
/**
 * Links the user account with the given phone number.
 *
 * @remarks
 * This method does not work in a Node.js environment.
 *
 * @param user - The user.
 * @param phoneNumber - The user's phone number in E.164 format (e.g. +16505550101).
 * @param appVerifier - The {@link ApplicationVerifier}.
 *
 * @public
 */
function linkWithPhoneNumber(user, phoneNumber, appVerifier) {
    return __awaiter(this, void 0, void 0, function () {
        var userInternal, verificationId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userInternal = getModularInstance(user);
                    return [4 /*yield*/, _assertLinkedStatus(false, userInternal, "phone" /* ProviderId.PHONE */)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, _verifyPhoneNumber(userInternal.auth, phoneNumber, getModularInstance(appVerifier))];
                case 2:
                    verificationId = _a.sent();
                    return [2 /*return*/, new ConfirmationResultImpl(verificationId, function (cred) {
                            return linkWithCredential(userInternal, cred);
                        })];
            }
        });
    });
}
/**
 * Re-authenticates a user using a fresh phone credential.
 *
 * @remarks
 * Use before operations such as {@link updatePassword} that require tokens from recent sign-in attempts.
 *
 * This method does not work in a Node.js environment.
 *
 * @param user - The user.
 * @param phoneNumber - The user's phone number in E.164 format (e.g. +16505550101).
 * @param appVerifier - The {@link ApplicationVerifier}.
 *
 * @public
 */
function reauthenticateWithPhoneNumber(user, phoneNumber, appVerifier) {
    return __awaiter(this, void 0, void 0, function () {
        var userInternal, verificationId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userInternal = getModularInstance(user);
                    return [4 /*yield*/, _verifyPhoneNumber(userInternal.auth, phoneNumber, getModularInstance(appVerifier))];
                case 1:
                    verificationId = _a.sent();
                    return [2 /*return*/, new ConfirmationResultImpl(verificationId, function (cred) {
                            return reauthenticateWithCredential(userInternal, cred);
                        })];
            }
        });
    });
}
/**
 * Returns a verification ID to be used in conjunction with the SMS code that is sent.
 *
 */
function _verifyPhoneNumber(auth, options, verifier) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var recaptchaToken, phoneInfoOptions, session, response, mfaEnrollmentId, response, sessionInfo;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, verifier.verify()];
                case 1:
                    recaptchaToken = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 10, 11]);
                    _assert(typeof recaptchaToken === 'string', auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                    _assert(verifier.type === RECAPTCHA_VERIFIER_TYPE, auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                    phoneInfoOptions = void 0;
                    if (typeof options === 'string') {
                        phoneInfoOptions = {
                            phoneNumber: options
                        };
                    }
                    else {
                        phoneInfoOptions = options;
                    }
                    if (!('session' in phoneInfoOptions)) return [3 /*break*/, 7];
                    session = phoneInfoOptions.session;
                    if (!('phoneNumber' in phoneInfoOptions)) return [3 /*break*/, 4];
                    _assert(session.type === "enroll" /* MultiFactorSessionType.ENROLL */, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                    return [4 /*yield*/, startEnrollPhoneMfa(auth, {
                            idToken: session.credential,
                            phoneEnrollmentInfo: {
                                phoneNumber: phoneInfoOptions.phoneNumber,
                                recaptchaToken: recaptchaToken
                            }
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, response.phoneSessionInfo.sessionInfo];
                case 4:
                    _assert(session.type === "signin" /* MultiFactorSessionType.SIGN_IN */, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                    mfaEnrollmentId = ((_a = phoneInfoOptions.multiFactorHint) === null || _a === void 0 ? void 0 : _a.uid) ||
                        phoneInfoOptions.multiFactorUid;
                    _assert(mfaEnrollmentId, auth, "missing-multi-factor-info" /* AuthErrorCode.MISSING_MFA_INFO */);
                    return [4 /*yield*/, startSignInPhoneMfa(auth, {
                            mfaPendingCredential: session.credential,
                            mfaEnrollmentId: mfaEnrollmentId,
                            phoneSignInInfo: {
                                recaptchaToken: recaptchaToken
                            }
                        })];
                case 5:
                    response = _b.sent();
                    return [2 /*return*/, response.phoneResponseInfo.sessionInfo];
                case 6: return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, sendPhoneVerificationCode(auth, {
                        phoneNumber: phoneInfoOptions.phoneNumber,
                        recaptchaToken: recaptchaToken
                    })];
                case 8:
                    sessionInfo = (_b.sent()).sessionInfo;
                    return [2 /*return*/, sessionInfo];
                case 9: return [3 /*break*/, 11];
                case 10:
                    verifier._reset();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
/**
 * Updates the user's phone number.
 *
 * @remarks
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```
 * // 'recaptcha-container' is the ID of an element in the DOM.
 * const applicationVerifier = new RecaptchaVerifier('recaptcha-container');
 * const provider = new PhoneAuthProvider(auth);
 * const verificationId = await provider.verifyPhoneNumber('+16505550101', applicationVerifier);
 * // Obtain the verificationCode from the user.
 * const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
 * await updatePhoneNumber(user, phoneCredential);
 * ```
 *
 * @param user - The user.
 * @param credential - A credential authenticating the new phone number.
 *
 * @public
 */
function updatePhoneNumber(user, credential) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _link(getModularInstance(user), credential)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
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
/**
 * Provider for generating an {@link PhoneAuthCredential}.
 *
 * @remarks
 * `PhoneAuthProvider` does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // 'recaptcha-container' is the ID of an element in the DOM.
 * const applicationVerifier = new RecaptchaVerifier('recaptcha-container');
 * const provider = new PhoneAuthProvider(auth);
 * const verificationId = await provider.verifyPhoneNumber('+16505550101', applicationVerifier);
 * // Obtain the verificationCode from the user.
 * const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
 * const userCredential = await signInWithCredential(auth, phoneCredential);
 * ```
 *
 * @public
 */
var PhoneAuthProvider = /** @class */ (function () {
    /**
     * @param auth - The Firebase {@link Auth} instance in which sign-ins should occur.
     *
     */
    function PhoneAuthProvider(auth) {
        /** Always set to {@link ProviderId}.PHONE. */
        this.providerId = PhoneAuthProvider.PROVIDER_ID;
        this.auth = _castAuth(auth);
    }
    /**
     *
     * Starts a phone number authentication flow by sending a verification code to the given phone
     * number.
     *
     * @example
     * ```javascript
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * An alternative flow is provided using the `signInWithPhoneNumber` method.
     * ```javascript
     * const confirmationResult = signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const userCredential = confirmationResult.confirm(verificationCode);
     * ```
     *
     * @param phoneInfoOptions - The user's {@link PhoneInfoOptions}. The phone number should be in
     * E.164 format (e.g. +16505550101).
     * @param applicationVerifier - For abuse prevention, this method also requires a
     * {@link ApplicationVerifier}. This SDK includes a reCAPTCHA-based implementation,
     * {@link RecaptchaVerifier}.
     *
     * @returns A Promise for a verification ID that can be passed to
     * {@link PhoneAuthProvider.credential} to identify this flow..
     */
    PhoneAuthProvider.prototype.verifyPhoneNumber = function (phoneOptions, applicationVerifier) {
        return _verifyPhoneNumber(this.auth, phoneOptions, getModularInstance(applicationVerifier));
    };
    /**
     * Creates a phone auth credential, given the verification ID from
     * {@link PhoneAuthProvider.verifyPhoneNumber} and the code that was sent to the user's
     * mobile device.
     *
     * @example
     * ```javascript
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const userCredential = signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * An alternative flow is provided using the `signInWithPhoneNumber` method.
     * ```javascript
     * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const userCredential = await confirmationResult.confirm(verificationCode);
     * ```
     *
     * @param verificationId - The verification ID returned from {@link PhoneAuthProvider.verifyPhoneNumber}.
     * @param verificationCode - The verification code sent to the user's mobile device.
     *
     * @returns The auth provider credential.
     */
    PhoneAuthProvider.credential = function (verificationId, verificationCode) {
        return PhoneAuthCredential._fromVerification(verificationId, verificationCode);
    };
    /**
     * Generates an {@link AuthCredential} from a {@link UserCredential}.
     * @param userCredential - The user credential.
     */
    PhoneAuthProvider.credentialFromResult = function (userCredential) {
        var credential = userCredential;
        return PhoneAuthProvider.credentialFromTaggedObject(credential);
    };
    /**
     * Returns an {@link AuthCredential} when passed an error.
     *
     * @remarks
     *
     * This method works for errors like
     * `auth/account-exists-with-different-credentials`. This is useful for
     * recovering when attempting to set a user's phone number but the number
     * in question is already tied to another account. For example, the following
     * code tries to update the current user's phone number, and if that
     * fails, links the user with the account associated with that number:
     *
     * ```js
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = await provider.verifyPhoneNumber(number, verifier);
     * try {
     *   const code = ''; // Prompt the user for the verification code
     *   await updatePhoneNumber(
     *       auth.currentUser,
     *       PhoneAuthProvider.credential(verificationId, code));
     * } catch (e) {
     *   if ((e as FirebaseError)?.code === 'auth/account-exists-with-different-credential') {
     *     const cred = PhoneAuthProvider.credentialFromError(e);
     *     await linkWithCredential(auth.currentUser, cred);
     *   }
     * }
     *
     * // At this point, auth.currentUser.phoneNumber === number.
     * ```
     *
     * @param error - The error to generate a credential from.
     */
    PhoneAuthProvider.credentialFromError = function (error) {
        return PhoneAuthProvider.credentialFromTaggedObject((error.customData || {}));
    };
    PhoneAuthProvider.credentialFromTaggedObject = function (_a) {
        var tokenResponse = _a._tokenResponse;
        if (!tokenResponse) {
            return null;
        }
        var _b = tokenResponse, phoneNumber = _b.phoneNumber, temporaryProof = _b.temporaryProof;
        if (phoneNumber && temporaryProof) {
            return PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
        }
        return null;
    };
    /** Always set to {@link ProviderId}.PHONE. */
    PhoneAuthProvider.PROVIDER_ID = "phone" /* ProviderId.PHONE */;
    /** Always set to {@link SignInMethod}.PHONE. */
    PhoneAuthProvider.PHONE_SIGN_IN_METHOD = "phone" /* SignInMethod.PHONE */;
    return PhoneAuthProvider;
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
var _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2000, 10000);
/**
 * Authenticates a Firebase client using a popup-based OAuth authentication flow.
 *
 * @remarks
 * If succeeds, returns the signed in user along with the provider's credential. If sign in was
 * unsuccessful, returns an error object containing additional information about the error.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Facebook Access Token.
 * const credential = provider.credentialFromResult(auth, result);
 * const token = credential.accessToken;
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function signInWithPopup(auth, provider, resolver) {
    return __awaiter(this, void 0, void 0, function () {
        var authInternal, resolverInternal, action;
        return __generator(this, function (_a) {
            authInternal = _castAuth(auth);
            _assertInstanceOf(auth, provider, FederatedAuthProvider);
            resolverInternal = _withDefaultResolver(authInternal, resolver);
            action = new PopupOperation(authInternal, "signInViaPopup" /* AuthEventType.SIGN_IN_VIA_POPUP */, provider, resolverInternal);
            return [2 /*return*/, action.executeNotNull()];
        });
    });
}
/**
 * Reauthenticates the current user with the specified {@link OAuthProvider} using a pop-up based
 * OAuth flow.
 *
 * @remarks
 * If the reauthentication is successful, the returned result will contain the user and the
 * provider's credential.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithPopup(auth, provider);
 * // Reauthenticate using a popup.
 * await reauthenticateWithPopup(result.user, provider);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function reauthenticateWithPopup(user, provider, resolver) {
    return __awaiter(this, void 0, void 0, function () {
        var userInternal, resolverInternal, action;
        return __generator(this, function (_a) {
            userInternal = getModularInstance(user);
            _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
            resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
            action = new PopupOperation(userInternal.auth, "reauthViaPopup" /* AuthEventType.REAUTH_VIA_POPUP */, provider, resolverInternal, userInternal);
            return [2 /*return*/, action.executeNotNull()];
        });
    });
}
/**
 * Links the authenticated provider to the user account using a pop-up based OAuth flow.
 *
 * @remarks
 * If the linking is successful, the returned result will contain the user and the provider's credential.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using some other provider.
 * const result = await signInWithEmailAndPassword(auth, email, password);
 * // Link using a popup.
 * const provider = new FacebookAuthProvider();
 * await linkWithPopup(result.user, provider);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function linkWithPopup(user, provider, resolver) {
    return __awaiter(this, void 0, void 0, function () {
        var userInternal, resolverInternal, action;
        return __generator(this, function (_a) {
            userInternal = getModularInstance(user);
            _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
            resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
            action = new PopupOperation(userInternal.auth, "linkViaPopup" /* AuthEventType.LINK_VIA_POPUP */, provider, resolverInternal, userInternal);
            return [2 /*return*/, action.executeNotNull()];
        });
    });
}
/**
 * Popup event manager. Handles the popup's entire lifecycle; listens to auth
 * events
 *
 */
var PopupOperation = /** @class */ (function (_super) {
    __extends(PopupOperation, _super);
    function PopupOperation(auth, filter, provider, resolver, user) {
        var _this = _super.call(this, auth, filter, resolver, user) || this;
        _this.provider = provider;
        _this.authWindow = null;
        _this.pollId = null;
        if (PopupOperation.currentPopupAction) {
            PopupOperation.currentPopupAction.cancel();
        }
        PopupOperation.currentPopupAction = _this;
        return _this;
    }
    PopupOperation.prototype.executeNotNull = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execute()];
                    case 1:
                        result = _a.sent();
                        _assert(result, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PopupOperation.prototype.onExecution = function () {
        return __awaiter(this, void 0, void 0, function () {
            var eventId, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        debugAssert(this.filter.length === 1, 'Popup operations only handle one event');
                        eventId = _generateEventId();
                        _a = this;
                        return [4 /*yield*/, this.resolver._openPopup(this.auth, this.provider, this.filter[0], // There's always one, see constructor
                            eventId)];
                    case 1:
                        _a.authWindow = _b.sent();
                        this.authWindow.associatedEvent = eventId;
                        // Check for web storage support and origin validation _after_ the popup is
                        // loaded. These operations are slow (~1 second or so) Rather than
                        // waiting on them before opening the window, optimistically open the popup
                        // and check for storage support at the same time. If storage support is
                        // not available, this will cause the whole thing to reject properly. It
                        // will also close the popup, but since the promise has already rejected,
                        // the popup closed by user poll will reject into the void.
                        this.resolver._originValidation(this.auth).catch(function (e) {
                            _this.reject(e);
                        });
                        this.resolver._isIframeWebStorageSupported(this.auth, function (isSupported) {
                            if (!isSupported) {
                                _this.reject(_createError(_this.auth, "web-storage-unsupported" /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */));
                            }
                        });
                        // Handle user closure. Notice this does *not* use await
                        this.pollUserCancellation();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(PopupOperation.prototype, "eventId", {
        get: function () {
            var _a;
            return ((_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.associatedEvent) || null;
        },
        enumerable: false,
        configurable: true
    });
    PopupOperation.prototype.cancel = function () {
        this.reject(_createError(this.auth, "cancelled-popup-request" /* AuthErrorCode.EXPIRED_POPUP_REQUEST */));
    };
    PopupOperation.prototype.cleanUp = function () {
        if (this.authWindow) {
            this.authWindow.close();
        }
        if (this.pollId) {
            window.clearTimeout(this.pollId);
        }
        this.authWindow = null;
        this.pollId = null;
        PopupOperation.currentPopupAction = null;
    };
    PopupOperation.prototype.pollUserCancellation = function () {
        var _this = this;
        var poll = function () {
            var _a, _b;
            if ((_b = (_a = _this.authWindow) === null || _a === void 0 ? void 0 : _a.window) === null || _b === void 0 ? void 0 : _b.closed) {
                // Make sure that there is sufficient time for whatever action to
                // complete. The window could have closed but the sign in network
                // call could still be in flight. This is specifically true for
                // Firefox or if the opener is in an iframe, in which case the oauth
                // helper closes the popup.
                _this.pollId = window.setTimeout(function () {
                    _this.pollId = null;
                    _this.reject(_createError(_this.auth, "popup-closed-by-user" /* AuthErrorCode.POPUP_CLOSED_BY_USER */));
                }, 8000 /* _Timeout.AUTH_EVENT */);
                return;
            }
            _this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
        };
        poll();
    };
    // Only one popup is ever shown at once. The lifecycle of the current popup
    // can be managed / cancelled by the constructor.
    PopupOperation.currentPopupAction = null;
    return PopupOperation;
}(AbstractPopupRedirectOperation));

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
var IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
var HTTP_REGEX = /^https?/;
function _validateOrigin(auth) {
    return __awaiter(this, void 0, void 0, function () {
        var authorizedDomains, _i, authorizedDomains_1, domain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Skip origin validation if we are in an emulated environment
                    if (auth.config.emulator) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, _getProjectConfig(auth)];
                case 1:
                    authorizedDomains = (_a.sent()).authorizedDomains;
                    for (_i = 0, authorizedDomains_1 = authorizedDomains; _i < authorizedDomains_1.length; _i++) {
                        domain = authorizedDomains_1[_i];
                        try {
                            if (matchDomain(domain)) {
                                return [2 /*return*/];
                            }
                        }
                        catch (_b) {
                            // Do nothing if there's a URL error; just continue searching
                        }
                    }
                    // In the old SDK, this error also provides helpful messages.
                    _fail(auth, "unauthorized-domain" /* AuthErrorCode.INVALID_ORIGIN */);
                    return [2 /*return*/];
            }
        });
    });
}
function matchDomain(expected) {
    var currentUrl = _getCurrentUrl();
    var _a = new URL(currentUrl), protocol = _a.protocol, hostname = _a.hostname;
    if (expected.startsWith('chrome-extension://')) {
        var ceUrl = new URL(expected);
        if (ceUrl.hostname === '' && hostname === '') {
            // For some reason we're not parsing chrome URLs properly
            return (protocol === 'chrome-extension:' &&
                expected.replace('chrome-extension://', '') ===
                    currentUrl.replace('chrome-extension://', ''));
        }
        return protocol === 'chrome-extension:' && ceUrl.hostname === hostname;
    }
    if (!HTTP_REGEX.test(protocol)) {
        return false;
    }
    if (IP_ADDRESS_REGEX.test(expected)) {
        // The domain has to be exactly equal to the pattern, as an IP domain will
        // only contain the IP, no extra character.
        return hostname === expected;
    }
    // Dots in pattern should be escaped.
    var escapedDomainPattern = expected.replace(/\./g, '\\.');
    // Non ip address domains.
    // domain.com = *.domain.com OR domain.com
    var re = new RegExp('^(.+\\.' + escapedDomainPattern + '|' + escapedDomainPattern + ')$', 'i');
    return re.test(hostname);
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
var NETWORK_TIMEOUT = new Delay(30000, 60000);
/**
 * Reset unlaoded GApi modules. If gapi.load fails due to a network error,
 * it will stop working after a retrial. This is a hack to fix this issue.
 */
function resetUnloadedGapiModules() {
    // Clear last failed gapi.load state to force next gapi.load to first
    // load the failed gapi.iframes module.
    // Get gapix.beacon context.
    var beacon = _window().___jsl;
    // Get current hint.
    if (beacon === null || beacon === void 0 ? void 0 : beacon.H) {
        // Get gapi hint.
        for (var _i = 0, _a = Object.keys(beacon.H); _i < _a.length; _i++) {
            var hint = _a[_i];
            // Requested modules.
            beacon.H[hint].r = beacon.H[hint].r || [];
            // Loaded modules.
            beacon.H[hint].L = beacon.H[hint].L || [];
            // Set requested modules to a copy of the loaded modules.
            beacon.H[hint].r = __spreadArray([], beacon.H[hint].L, true);
            // Clear pending callbacks.
            if (beacon.CP) {
                for (var i = 0; i < beacon.CP.length; i++) {
                    // Remove all failed pending callbacks.
                    beacon.CP[i] = null;
                }
            }
        }
    }
}
function loadGapi(auth) {
    return new Promise(function (resolve, reject) {
        var _a, _b, _c;
        // Function to run when gapi.load is ready.
        function loadGapiIframe() {
            // The developer may have tried to previously run gapi.load and failed.
            // Run this to fix that.
            resetUnloadedGapiModules();
            gapi.load('gapi.iframes', {
                callback: function () {
                    resolve(gapi.iframes.getContext());
                },
                ontimeout: function () {
                    // The above reset may be sufficient, but having this reset after
                    // failure ensures that if the developer calls gapi.load after the
                    // connection is re-established and before another attempt to embed
                    // the iframe, it would work and would not be broken because of our
                    // failed attempt.
                    // Timeout when gapi.iframes.Iframe not loaded.
                    resetUnloadedGapiModules();
                    reject(_createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
                },
                timeout: NETWORK_TIMEOUT.get()
            });
        }
        if ((_b = (_a = _window().gapi) === null || _a === void 0 ? void 0 : _a.iframes) === null || _b === void 0 ? void 0 : _b.Iframe) {
            // If gapi.iframes.Iframe available, resolve.
            resolve(gapi.iframes.getContext());
        }
        else if (!!((_c = _window().gapi) === null || _c === void 0 ? void 0 : _c.load)) {
            // Gapi loader ready, load gapi.iframes.
            loadGapiIframe();
        }
        else {
            // Create a new iframe callback when this is called so as not to overwrite
            // any previous defined callback. This happens if this method is called
            // multiple times in parallel and could result in the later callback
            // overwriting the previous one. This would end up with a iframe
            // timeout.
            var cbName = _generateCallbackName('iframefcb');
            // GApi loader not available, dynamically load platform.js.
            _window()[cbName] = function () {
                // GApi loader should be ready.
                if (!!gapi.load) {
                    loadGapiIframe();
                }
                else {
                    // Gapi loader failed, throw error.
                    reject(_createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
                }
            };
            // Load GApi loader.
            return _loadJS("https://apis.google.com/js/api.js?onload=".concat(cbName))
                .catch(function (e) { return reject(e); });
        }
    }).catch(function (error) {
        // Reset cached promise to allow for retrial.
        cachedGApiLoader = null;
        throw error;
    });
}
var cachedGApiLoader = null;
function _loadGapi(auth) {
    cachedGApiLoader = cachedGApiLoader || loadGapi(auth);
    return cachedGApiLoader;
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
var PING_TIMEOUT = new Delay(5000, 15000);
var IFRAME_PATH = '__/auth/iframe';
var EMULATED_IFRAME_PATH = 'emulator/auth/iframe';
var IFRAME_ATTRIBUTES = {
    style: {
        position: 'absolute',
        top: '-100px',
        width: '1px',
        height: '1px'
    },
    'aria-hidden': 'true',
    tabindex: '-1'
};
// Map from apiHost to endpoint ID for passing into iframe. In current SDK, apiHost can be set to
// anything (not from a list of endpoints with IDs as in legacy), so this is the closest we can get.
var EID_FROM_APIHOST = new Map([
    ["identitytoolkit.googleapis.com" /* DefaultConfig.API_HOST */, 'p'],
    ['staging-identitytoolkit.sandbox.googleapis.com', 's'],
    ['test-identitytoolkit.sandbox.googleapis.com', 't'] // test
]);
function getIframeUrl(auth) {
    var config = auth.config;
    _assert(config.authDomain, auth, "auth-domain-config-required" /* AuthErrorCode.MISSING_AUTH_DOMAIN */);
    var url = config.emulator
        ? _emulatorUrl(config, EMULATED_IFRAME_PATH)
        : "https://".concat(auth.config.authDomain, "/").concat(IFRAME_PATH);
    var params = {
        apiKey: config.apiKey,
        appName: auth.name,
        v: SDK_VERSION
    };
    var eid = EID_FROM_APIHOST.get(auth.config.apiHost);
    if (eid) {
        params.eid = eid;
    }
    var frameworks = auth._getFrameworks();
    if (frameworks.length) {
        params.fw = frameworks.join(',');
    }
    return "".concat(url, "?").concat(querystring(params).slice(1));
}
function _openIframe(auth) {
    return __awaiter(this, void 0, void 0, function () {
        var context, gapi;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _loadGapi(auth)];
                case 1:
                    context = _a.sent();
                    gapi = _window().gapi;
                    _assert(gapi, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                    return [2 /*return*/, context.open({
                            where: document.body,
                            url: getIframeUrl(auth),
                            messageHandlersFilter: gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
                            attributes: IFRAME_ATTRIBUTES,
                            dontclear: true
                        }, function (iframe) {
                            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                // Clear timer and resolve pending iframe ready promise.
                                function clearTimerAndResolve() {
                                    _window().clearTimeout(networkErrorTimer);
                                    resolve(iframe);
                                }
                                var networkError, networkErrorTimer;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, iframe.restyle({
                                                // Prevent iframe from closing on mouse out.
                                                setHideOnLeave: false
                                            })];
                                        case 1:
                                            _a.sent();
                                            networkError = _createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */);
                                            networkErrorTimer = _window().setTimeout(function () {
                                                reject(networkError);
                                            }, PING_TIMEOUT.get());
                                            // This returns an IThenable. However the reject part does not call
                                            // when the iframe is not loaded.
                                            iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, function () {
                                                reject(networkError);
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
            }
        });
    });
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
var BASE_POPUP_OPTIONS = {
    location: 'yes',
    resizable: 'yes',
    statusbar: 'yes',
    toolbar: 'no'
};
var DEFAULT_WIDTH = 500;
var DEFAULT_HEIGHT = 600;
var TARGET_BLANK = '_blank';
var FIREFOX_EMPTY_URL = 'http://localhost';
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
function _open(auth, url, name, width, height) {
    if (width === void 0) { width = DEFAULT_WIDTH; }
    if (height === void 0) { height = DEFAULT_HEIGHT; }
    var top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
    var left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
    var target = '';
    var options = __assign(__assign({}, BASE_POPUP_OPTIONS), { width: width.toString(), height: height.toString(), top: top, left: left });
    // Chrome iOS 7 and 8 is returning an undefined popup win when target is
    // specified, even though the popup is not necessarily blocked.
    var ua = getUA().toLowerCase();
    if (name) {
        target = _isChromeIOS(ua) ? TARGET_BLANK : name;
    }
    if (_isFirefox(ua)) {
        // Firefox complains when invalid URLs are popped out. Hacky way to bypass.
        url = url || FIREFOX_EMPTY_URL;
        // Firefox disables by default scrolling on popup windows, which can create
        // issues when the user has many Google accounts, for instance.
        options.scrollbars = 'yes';
    }
    var optionsString = Object.entries(options).reduce(function (accum, _a) {
        var key = _a[0], value = _a[1];
        return "".concat(accum).concat(key, "=").concat(value, ",");
    }, '');
    if (_isIOSStandalone(ua) && target !== '_self') {
        openAsNewWindowIOS(url || '', target);
        return new AuthPopup(null);
    }
    // about:blank getting sanitized causing browsers like IE/Edge to display
    // brief error message before redirecting to handler.
    var newWin = window.open(url || '', target, optionsString);
    _assert(newWin, auth, "popup-blocked" /* AuthErrorCode.POPUP_BLOCKED */);
    // Flaky on IE edge, encapsulate with a try and catch.
    try {
        newWin.focus();
    }
    catch (e) { }
    return new AuthPopup(newWin);
}
function openAsNewWindowIOS(url, target) {
    var el = document.createElement('a');
    el.href = url;
    el.target = target;
    var click = document.createEvent('MouseEvent');
    click.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
    el.dispatchEvent(click);
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
 * The special web storage event
 *
 */
var WEB_STORAGE_SUPPORT_KEY = 'webStorageSupport';
var BrowserPopupRedirectResolver = /** @class */ (function () {
    function BrowserPopupRedirectResolver() {
        this.eventManagers = {};
        this.iframes = {};
        this.originValidationPromises = {};
        this._redirectPersistence = browserSessionPersistence;
        this._completeRedirectFn = _getRedirectResult;
        this._overrideRedirectResult = _overrideRedirectResult;
    }
    // Wrapping in async even though we don't await anywhere in order
    // to make sure errors are raised as promise rejections
    BrowserPopupRedirectResolver.prototype._openPopup = function (auth, provider, authType, eventId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        debugAssert((_a = this.eventManagers[auth._key()]) === null || _a === void 0 ? void 0 : _a.manager, '_initialize() not called before _openPopup()');
                        return [4 /*yield*/, _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId)];
                    case 1:
                        url = _b.sent();
                        return [2 /*return*/, _open(auth, url, _generateEventId())];
                }
            });
        });
    };
    BrowserPopupRedirectResolver.prototype._openRedirect = function (auth, provider, authType, eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._originValidation(auth)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId)];
                    case 2:
                        url = _a.sent();
                        _setWindowLocation(url);
                        return [2 /*return*/, new Promise(function () { })];
                }
            });
        });
    };
    BrowserPopupRedirectResolver.prototype._initialize = function (auth) {
        var _this = this;
        var key = auth._key();
        if (this.eventManagers[key]) {
            var _a = this.eventManagers[key], manager = _a.manager, promise_1 = _a.promise;
            if (manager) {
                return Promise.resolve(manager);
            }
            else {
                debugAssert(promise_1, 'If manager is not set, promise should be');
                return promise_1;
            }
        }
        var promise = this.initAndGetManager(auth);
        this.eventManagers[key] = { promise: promise };
        // If the promise is rejected, the key should be removed so that the
        // operation can be retried later.
        promise.catch(function () {
            delete _this.eventManagers[key];
        });
        return promise;
    };
    BrowserPopupRedirectResolver.prototype.initAndGetManager = function (auth) {
        return __awaiter(this, void 0, void 0, function () {
            var iframe, manager;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _openIframe(auth)];
                    case 1:
                        iframe = _a.sent();
                        manager = new AuthEventManager(auth);
                        iframe.register('authEvent', function (iframeEvent) {
                            _assert(iframeEvent === null || iframeEvent === void 0 ? void 0 : iframeEvent.authEvent, auth, "invalid-auth-event" /* AuthErrorCode.INVALID_AUTH_EVENT */);
                            // TODO: Consider splitting redirect and popup events earlier on
                            var handled = manager.onEvent(iframeEvent.authEvent);
                            return { status: handled ? "ACK" /* GapiOutcome.ACK */ : "ERROR" /* GapiOutcome.ERROR */ };
                        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
                        this.eventManagers[auth._key()] = { manager: manager };
                        this.iframes[auth._key()] = iframe;
                        return [2 /*return*/, manager];
                }
            });
        });
    };
    BrowserPopupRedirectResolver.prototype._isIframeWebStorageSupported = function (auth, cb) {
        var iframe = this.iframes[auth._key()];
        iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, function (result) {
            var _a;
            var isSupported = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a[WEB_STORAGE_SUPPORT_KEY];
            if (isSupported !== undefined) {
                cb(!!isSupported);
            }
            _fail(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
    };
    BrowserPopupRedirectResolver.prototype._originValidation = function (auth) {
        var key = auth._key();
        if (!this.originValidationPromises[key]) {
            this.originValidationPromises[key] = _validateOrigin(auth);
        }
        return this.originValidationPromises[key];
    };
    Object.defineProperty(BrowserPopupRedirectResolver.prototype, "_shouldInitProactively", {
        get: function () {
            // Mobile browsers and Safari need to optimistically initialize
            return _isMobileBrowser() || _isSafari() || _isIOS();
        },
        enumerable: false,
        configurable: true
    });
    return BrowserPopupRedirectResolver;
}());
/**
 * An implementation of {@link PopupRedirectResolver} suitable for browser
 * based applications.
 *
 * @remarks
 * This method does not work in a Node.js environment.
 *
 * @public
 */
var browserPopupRedirectResolver = BrowserPopupRedirectResolver;

var MultiFactorAssertionImpl = /** @class */ (function () {
    function MultiFactorAssertionImpl(factorId) {
        this.factorId = factorId;
    }
    MultiFactorAssertionImpl.prototype._process = function (auth, session, displayName) {
        switch (session.type) {
            case "enroll" /* MultiFactorSessionType.ENROLL */:
                return this._finalizeEnroll(auth, session.credential, displayName);
            case "signin" /* MultiFactorSessionType.SIGN_IN */:
                return this._finalizeSignIn(auth, session.credential);
            default:
                return debugFail('unexpected MultiFactorSessionType');
        }
    };
    return MultiFactorAssertionImpl;
}());

/**
 * {@inheritdoc PhoneMultiFactorAssertion}
 *
 * @public
 */
var PhoneMultiFactorAssertionImpl = /** @class */ (function (_super) {
    __extends(PhoneMultiFactorAssertionImpl, _super);
    function PhoneMultiFactorAssertionImpl(credential) {
        var _this = _super.call(this, "phone" /* FactorId.PHONE */) || this;
        _this.credential = credential;
        return _this;
    }
    /** @internal */
    PhoneMultiFactorAssertionImpl._fromCredential = function (credential) {
        return new PhoneMultiFactorAssertionImpl(credential);
    };
    /** @internal */
    PhoneMultiFactorAssertionImpl.prototype._finalizeEnroll = function (auth, idToken, displayName) {
        return finalizeEnrollPhoneMfa(auth, {
            idToken: idToken,
            displayName: displayName,
            phoneVerificationInfo: this.credential._makeVerificationRequest()
        });
    };
    /** @internal */
    PhoneMultiFactorAssertionImpl.prototype._finalizeSignIn = function (auth, mfaPendingCredential) {
        return finalizeSignInPhoneMfa(auth, {
            mfaPendingCredential: mfaPendingCredential,
            phoneVerificationInfo: this.credential._makeVerificationRequest()
        });
    };
    return PhoneMultiFactorAssertionImpl;
}(MultiFactorAssertionImpl));
/**
 * Provider for generating a {@link PhoneMultiFactorAssertion}.
 *
 * @public
 */
var PhoneMultiFactorGenerator = /** @class */ (function () {
    function PhoneMultiFactorGenerator() {
    }
    /**
     * Provides a {@link PhoneMultiFactorAssertion} to confirm ownership of the phone second factor.
     *
     * @remarks
     * This method does not work in a Node.js environment.
     *
     * @param phoneAuthCredential - A credential provided by {@link PhoneAuthProvider.credential}.
     * @returns A {@link PhoneMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}
     */
    PhoneMultiFactorGenerator.assertion = function (credential) {
        return PhoneMultiFactorAssertionImpl._fromCredential(credential);
    };
    /**
     * The identifier of the phone second factor: `phone`.
     */
    PhoneMultiFactorGenerator.FACTOR_ID = 'phone';
    return PhoneMultiFactorGenerator;
}());

/**
 * Provider for generating a {@link TotpMultiFactorAssertion}.
 *
 * @public
 */
var TotpMultiFactorGenerator = /** @class */ (function () {
    function TotpMultiFactorGenerator() {
    }
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of
     * the TOTP (time-based one-time password) second factor.
     * This assertion is used to complete enrollment in TOTP second factor.
     *
     * @param secret A {@link TotpSecret} containing the shared secret key and other TOTP parameters.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorUser.enroll}.
     */
    TotpMultiFactorGenerator.assertionForEnrollment = function (secret, oneTimePassword) {
        return TotpMultiFactorAssertionImpl._fromSecret(secret, oneTimePassword);
    };
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of the TOTP second factor.
     * This assertion is used to complete signIn with TOTP as the second factor.
     *
     * @param enrollmentId identifies the enrolled TOTP second factor.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}.
     */
    TotpMultiFactorGenerator.assertionForSignIn = function (enrollmentId, oneTimePassword) {
        return TotpMultiFactorAssertionImpl._fromEnrollmentId(enrollmentId, oneTimePassword);
    };
    /**
     * Returns a promise to {@link TotpSecret} which contains the TOTP shared secret key and other parameters.
     * Creates a TOTP secret as part of enrolling a TOTP second factor.
     * Used for generating a QR code URL or inputting into a TOTP app.
     * This method uses the auth instance corresponding to the user in the multiFactorSession.
     *
     * @param session The {@link MultiFactorSession} that the user is part of.
     * @returns A promise to {@link TotpSecret}.
     */
    TotpMultiFactorGenerator.generateSecret = function (session) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var mfaSession, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mfaSession = session;
                        _assert(typeof ((_a = mfaSession.user) === null || _a === void 0 ? void 0 : _a.auth) !== 'undefined', "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                        return [4 /*yield*/, startEnrollTotpMfa(mfaSession.user.auth, {
                                idToken: mfaSession.credential,
                                totpEnrollmentInfo: {}
                            })];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, TotpSecret._fromStartTotpMfaEnrollmentResponse(response, mfaSession.user.auth)];
                }
            });
        });
    };
    /**
     * The identifier of the TOTP second factor: `totp`.
     */
    TotpMultiFactorGenerator.FACTOR_ID = "totp" /* FactorId.TOTP */;
    return TotpMultiFactorGenerator;
}());
var TotpMultiFactorAssertionImpl = /** @class */ (function (_super) {
    __extends(TotpMultiFactorAssertionImpl, _super);
    function TotpMultiFactorAssertionImpl(otp, enrollmentId, secret) {
        var _this = _super.call(this, "totp" /* FactorId.TOTP */) || this;
        _this.otp = otp;
        _this.enrollmentId = enrollmentId;
        _this.secret = secret;
        return _this;
    }
    /** @internal */
    TotpMultiFactorAssertionImpl._fromSecret = function (secret, otp) {
        return new TotpMultiFactorAssertionImpl(otp, undefined, secret);
    };
    /** @internal */
    TotpMultiFactorAssertionImpl._fromEnrollmentId = function (enrollmentId, otp) {
        return new TotpMultiFactorAssertionImpl(otp, enrollmentId);
    };
    /** @internal */
    TotpMultiFactorAssertionImpl.prototype._finalizeEnroll = function (auth, idToken, displayName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                _assert(typeof this.secret !== 'undefined', auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                return [2 /*return*/, finalizeEnrollTotpMfa(auth, {
                        idToken: idToken,
                        displayName: displayName,
                        totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
                    })];
            });
        });
    };
    /** @internal */
    TotpMultiFactorAssertionImpl.prototype._finalizeSignIn = function (auth, mfaPendingCredential) {
        return __awaiter(this, void 0, void 0, function () {
            var totpVerificationInfo;
            return __generator(this, function (_a) {
                _assert(this.enrollmentId !== undefined && this.otp !== undefined, auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                totpVerificationInfo = { verificationCode: this.otp };
                return [2 /*return*/, finalizeSignInTotpMfa(auth, {
                        mfaPendingCredential: mfaPendingCredential,
                        mfaEnrollmentId: this.enrollmentId,
                        totpVerificationInfo: totpVerificationInfo
                    })];
            });
        });
    };
    return TotpMultiFactorAssertionImpl;
}(MultiFactorAssertionImpl));
/**
 * Provider for generating a {@link TotpMultiFactorAssertion}.
 *
 * Stores the shared secret key and other parameters to generate time-based OTPs.
 * Implements methods to retrieve the shared secret key and generate a QR code URL.
 * @public
 */
var TotpSecret = /** @class */ (function () {
    // The public members are declared outside the constructor so the docs can be generated.
    function TotpSecret(secretKey, hashingAlgorithm, codeLength, codeIntervalSeconds, enrollmentCompletionDeadline, sessionInfo, auth) {
        this.sessionInfo = sessionInfo;
        this.auth = auth;
        this.secretKey = secretKey;
        this.hashingAlgorithm = hashingAlgorithm;
        this.codeLength = codeLength;
        this.codeIntervalSeconds = codeIntervalSeconds;
        this.enrollmentCompletionDeadline = enrollmentCompletionDeadline;
    }
    /** @internal */
    TotpSecret._fromStartTotpMfaEnrollmentResponse = function (response, auth) {
        return new TotpSecret(response.totpSessionInfo.sharedSecretKey, response.totpSessionInfo.hashingAlgorithm, response.totpSessionInfo.verificationCodeLength, response.totpSessionInfo.periodSec, new Date(response.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), response.totpSessionInfo.sessionInfo, auth);
    };
    /** @internal */
    TotpSecret.prototype._makeTotpVerificationInfo = function (otp) {
        return { sessionInfo: this.sessionInfo, verificationCode: otp };
    };
    /**
     * Returns a QR code URL as described in
     * https://github.com/google/google-authenticator/wiki/Key-Uri-Format
     * This can be displayed to the user as a QR code to be scanned into a TOTP app like Google Authenticator.
     * If the optional parameters are unspecified, an accountName of <userEmail> and issuer of <firebaseAppName> are used.
     *
     * @param accountName the name of the account/app along with a user identifier.
     * @param issuer issuer of the TOTP (likely the app name).
     * @returns A QR code URL string.
     */
    TotpSecret.prototype.generateQrCodeUrl = function (accountName, issuer) {
        var _a;
        var useDefaults = false;
        if (_isEmptyString(accountName) || _isEmptyString(issuer)) {
            useDefaults = true;
        }
        if (useDefaults) {
            if (_isEmptyString(accountName)) {
                accountName = ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.email) || 'unknownuser';
            }
            if (_isEmptyString(issuer)) {
                issuer = this.auth.name;
            }
        }
        return "otpauth://totp/".concat(issuer, ":").concat(accountName, "?secret=").concat(this.secretKey, "&issuer=").concat(issuer, "&algorithm=").concat(this.hashingAlgorithm, "&digits=").concat(this.codeLength);
    };
    return TotpSecret;
}());
/** @internal */
function _isEmptyString(input) {
    return typeof input === 'undefined' || (input === null || input === void 0 ? void 0 : input.length) === 0;
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
var DEFAULT_ID_TOKEN_MAX_AGE = 5 * 60;
var authIdTokenMaxAge = getExperimentalSetting('authIdTokenMaxAge') || DEFAULT_ID_TOKEN_MAX_AGE;
var lastPostedIdToken = null;
var mintCookieFactory = function (url) { return function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var idTokenResult, _a, idTokenAge, idToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = user;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, user.getIdTokenResult()];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                idTokenResult = _a;
                idTokenAge = idTokenResult &&
                    (new Date().getTime() - Date.parse(idTokenResult.issuedAtTime)) / 1000;
                if (idTokenAge && idTokenAge > authIdTokenMaxAge) {
                    return [2 /*return*/];
                }
                idToken = idTokenResult === null || idTokenResult === void 0 ? void 0 : idTokenResult.token;
                if (lastPostedIdToken === idToken) {
                    return [2 /*return*/];
                }
                lastPostedIdToken = idToken;
                return [4 /*yield*/, fetch(url, {
                        method: idToken ? 'POST' : 'DELETE',
                        headers: idToken
                            ? {
                                'Authorization': "Bearer ".concat(idToken)
                            }
                            : {}
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); }; };
/**
 * Returns the Auth instance associated with the provided {@link @firebase/app#FirebaseApp}.
 * If no instance exists, initializes an Auth instance with platform-specific default dependencies.
 *
 * @param app - The Firebase App.
 *
 * @public
 */
function getAuth(app) {
    if (app === void 0) { app = getApp(); }
    var provider = _getProvider(app, 'auth');
    if (provider.isInitialized()) {
        return provider.getImmediate();
    }
    var auth = initializeAuth(app, {
        popupRedirectResolver: browserPopupRedirectResolver,
        persistence: [
            indexedDBLocalPersistence,
            browserLocalPersistence,
            browserSessionPersistence
        ]
    });
    var authTokenSyncUrl = getExperimentalSetting('authTokenSyncURL');
    if (authTokenSyncUrl) {
        var mintCookie_1 = mintCookieFactory(authTokenSyncUrl);
        beforeAuthStateChanged(auth, mintCookie_1, function () {
            return mintCookie_1(auth.currentUser);
        });
        onIdTokenChanged(auth, function (user) { return mintCookie_1(user); });
    }
    var authEmulatorHost = getDefaultEmulatorHost('auth');
    if (authEmulatorHost) {
        connectAuthEmulator(auth, "http://".concat(authEmulatorHost));
    }
    return auth;
}
registerAuth("Browser" /* ClientPlatform.BROWSER */);

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

export { AuthPopup, PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier, TotpMultiFactorGenerator, TotpSecret, addFrameworkForLogging, browserPopupRedirectResolver, getAuth, linkWithPhoneNumber, linkWithPopup, reauthenticateWithPhoneNumber, reauthenticateWithPopup, signInWithPhoneNumber, signInWithPopup, updatePhoneNumber };
//# sourceMappingURL=internal.js.map
