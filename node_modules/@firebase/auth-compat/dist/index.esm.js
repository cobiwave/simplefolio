import firebase from '@firebase/app-compat';
import * as exp from '@firebase/auth/internal';
import { Component } from '@firebase/component';
import { isBrowserExtension, getUA, isReactNative, isNode, isIndexedDBAvailable, isIE, FirebaseError } from '@firebase/util';
import { __awaiter, __generator } from 'tslib';

var name = "@firebase/auth-compat";
var version = "0.5.1";

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
var CORDOVA_ONDEVICEREADY_TIMEOUT_MS = 1000;
function _getCurrentScheme() {
    var _a;
    return ((_a = self === null || self === void 0 ? void 0 : self.location) === null || _a === void 0 ? void 0 : _a.protocol) || null;
}
/**
 * @return {boolean} Whether the current environment is http or https.
 */
function _isHttpOrHttps() {
    return _getCurrentScheme() === 'http:' || _getCurrentScheme() === 'https:';
}
/**
 * @param {?string=} ua The user agent.
 * @return {boolean} Whether the app is rendered in a mobile iOS or Android
 *     Cordova environment.
 */
function _isAndroidOrIosCordovaScheme(ua) {
    if (ua === void 0) { ua = getUA(); }
    return !!((_getCurrentScheme() === 'file:' ||
        _getCurrentScheme() === 'ionic:' ||
        _getCurrentScheme() === 'capacitor:') &&
        ua.toLowerCase().match(/iphone|ipad|ipod|android/));
}
/**
 * @return {boolean} Whether the environment is a native environment, where
 *     CORS checks do not apply.
 */
function _isNativeEnvironment() {
    return isReactNative() || isNode();
}
/**
 * Checks whether the user agent is IE11.
 * @return {boolean} True if it is IE11.
 */
function _isIe11() {
    return isIE() && (document === null || document === void 0 ? void 0 : document.documentMode) === 11;
}
/**
 * Checks whether the user agent is Edge.
 * @param {string} userAgent The browser user agent string.
 * @return {boolean} True if it is Edge.
 */
function _isEdge(ua) {
    if (ua === void 0) { ua = getUA(); }
    return /Edge\/\d+/.test(ua);
}
/**
 * @param {?string=} opt_userAgent The navigator user agent.
 * @return {boolean} Whether local storage is not synchronized between an iframe
 *     and a popup of the same domain.
 */
function _isLocalStorageNotSynchronized(ua) {
    if (ua === void 0) { ua = getUA(); }
    return _isIe11() || _isEdge(ua);
}
/** @return {boolean} Whether web storage is supported. */
function _isWebStorageSupported() {
    try {
        var storage = self.localStorage;
        var key = exp._generateEventId();
        if (storage) {
            // setItem will throw an exception if we cannot access WebStorage (e.g.,
            // Safari in private mode).
            storage['setItem'](key, '1');
            storage['removeItem'](key);
            // For browsers where iframe web storage does not synchronize with a popup
            // of the same domain, indexedDB is used for persistent storage. These
            // browsers include IE11 and Edge.
            // Make sure it is supported (IE11 and Edge private mode does not support
            // that).
            if (_isLocalStorageNotSynchronized()) {
                // In such browsers, if indexedDB is not supported, an iframe cannot be
                // notified of the popup sign in result.
                return isIndexedDBAvailable();
            }
            return true;
        }
    }
    catch (e) {
        // localStorage is not available from a worker. Test availability of
        // indexedDB.
        return _isWorker() && isIndexedDBAvailable();
    }
    return false;
}
/**
 * @param {?Object=} global The optional global scope.
 * @return {boolean} Whether current environment is a worker.
 */
function _isWorker() {
    // WorkerGlobalScope only defined in worker environment.
    return (typeof global !== 'undefined' &&
        'WorkerGlobalScope' in global &&
        'importScripts' in global);
}
function _isPopupRedirectSupported() {
    return ((_isHttpOrHttps() ||
        isBrowserExtension() ||
        _isAndroidOrIosCordovaScheme()) &&
        // React Native with remote debugging reports its location.protocol as
        // http.
        !_isNativeEnvironment() &&
        // Local storage has to be supported for browser popup and redirect
        // operations to work.
        _isWebStorageSupported() &&
        // DOM, popups and redirects are not supported within a worker.
        !_isWorker());
}
/** Quick check that indicates the platform *may* be Cordova */
function _isLikelyCordova() {
    return _isAndroidOrIosCordovaScheme() && typeof document !== 'undefined';
}
function _isCordova() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!_isLikelyCordova()) {
                return [2 /*return*/, false];
            }
            return [2 /*return*/, new Promise(function (resolve) {
                    var timeoutId = setTimeout(function () {
                        // We've waited long enough; the telltale Cordova event didn't happen
                        resolve(false);
                    }, CORDOVA_ONDEVICEREADY_TIMEOUT_MS);
                    document.addEventListener('deviceready', function () {
                        clearTimeout(timeoutId);
                        resolve(true);
                    });
                })];
        });
    });
}
function _getSelfWindow() {
    return typeof window !== 'undefined' ? window : null;
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
var Persistence = {
    LOCAL: 'local',
    NONE: 'none',
    SESSION: 'session'
};
var _assert$3 = exp._assert;
var PERSISTENCE_KEY = 'persistence';
/**
 * Validates that an argument is a valid persistence value. If an invalid type
 * is specified, an error is thrown synchronously.
 */
function _validatePersistenceArgument(auth, persistence) {
    _assert$3(Object.values(Persistence).includes(persistence), auth, "invalid-persistence-type" /* exp.AuthErrorCode.INVALID_PERSISTENCE */);
    // Validate if the specified type is supported in the current environment.
    if (isReactNative()) {
        // This is only supported in a browser.
        _assert$3(persistence !== Persistence.SESSION, auth, "unsupported-persistence-type" /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */);
        return;
    }
    if (isNode()) {
        // Only none is supported in Node.js.
        _assert$3(persistence === Persistence.NONE, auth, "unsupported-persistence-type" /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */);
        return;
    }
    if (_isWorker()) {
        // In a worker environment, either LOCAL or NONE are supported.
        // If indexedDB not supported and LOCAL provided, throw an error
        _assert$3(persistence === Persistence.NONE ||
            (persistence === Persistence.LOCAL && isIndexedDBAvailable()), auth, "unsupported-persistence-type" /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */);
        return;
    }
    // This is restricted by what the browser supports.
    _assert$3(persistence === Persistence.NONE || _isWebStorageSupported(), auth, "unsupported-persistence-type" /* exp.AuthErrorCode.UNSUPPORTED_PERSISTENCE */);
}
function _savePersistenceForRedirect(auth) {
    return __awaiter(this, void 0, void 0, function () {
        var session, key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, auth._initializationPromise];
                case 1:
                    _a.sent();
                    session = getSessionStorageIfAvailable();
                    key = exp._persistenceKeyName(PERSISTENCE_KEY, auth.config.apiKey, auth.name);
                    if (session) {
                        session.setItem(key, auth._getPersistence());
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function _getPersistencesFromRedirect(apiKey, appName) {
    var session = getSessionStorageIfAvailable();
    if (!session) {
        return [];
    }
    var key = exp._persistenceKeyName(PERSISTENCE_KEY, apiKey, appName);
    var persistence = session.getItem(key);
    switch (persistence) {
        case Persistence.NONE:
            return [exp.inMemoryPersistence];
        case Persistence.LOCAL:
            return [exp.indexedDBLocalPersistence, exp.browserSessionPersistence];
        case Persistence.SESSION:
            return [exp.browserSessionPersistence];
        default:
            return [];
    }
}
/** Returns session storage, or null if the property access errors */
function getSessionStorageIfAvailable() {
    var _a;
    try {
        return ((_a = _getSelfWindow()) === null || _a === void 0 ? void 0 : _a.sessionStorage) || null;
    }
    catch (e) {
        return null;
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
var _assert$2 = exp._assert;
/** Platform-agnostic popup-redirect resolver */
var CompatPopupRedirectResolver = /** @class */ (function () {
    function CompatPopupRedirectResolver() {
        // Create both resolvers for dynamic resolution later
        this.browserResolver = exp._getInstance(exp.browserPopupRedirectResolver);
        this.cordovaResolver = exp._getInstance(exp.cordovaPopupRedirectResolver);
        // The actual resolver in use: either browserResolver or cordovaResolver.
        this.underlyingResolver = null;
        this._redirectPersistence = exp.browserSessionPersistence;
        this._completeRedirectFn = exp._getRedirectResult;
        this._overrideRedirectResult = exp._overrideRedirectResult;
    }
    CompatPopupRedirectResolver.prototype._initialize = function (auth) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.selectUnderlyingResolver()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.assertedUnderlyingResolver._initialize(auth)];
                }
            });
        });
    };
    CompatPopupRedirectResolver.prototype._openPopup = function (auth, provider, authType, eventId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.selectUnderlyingResolver()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.assertedUnderlyingResolver._openPopup(auth, provider, authType, eventId)];
                }
            });
        });
    };
    CompatPopupRedirectResolver.prototype._openRedirect = function (auth, provider, authType, eventId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.selectUnderlyingResolver()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.assertedUnderlyingResolver._openRedirect(auth, provider, authType, eventId)];
                }
            });
        });
    };
    CompatPopupRedirectResolver.prototype._isIframeWebStorageSupported = function (auth, cb) {
        this.assertedUnderlyingResolver._isIframeWebStorageSupported(auth, cb);
    };
    CompatPopupRedirectResolver.prototype._originValidation = function (auth) {
        return this.assertedUnderlyingResolver._originValidation(auth);
    };
    Object.defineProperty(CompatPopupRedirectResolver.prototype, "_shouldInitProactively", {
        get: function () {
            return _isLikelyCordova() || this.browserResolver._shouldInitProactively;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatPopupRedirectResolver.prototype, "assertedUnderlyingResolver", {
        get: function () {
            _assert$2(this.underlyingResolver, "internal-error" /* exp.AuthErrorCode.INTERNAL_ERROR */);
            return this.underlyingResolver;
        },
        enumerable: false,
        configurable: true
    });
    CompatPopupRedirectResolver.prototype.selectUnderlyingResolver = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isCordova;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.underlyingResolver) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, _isCordova()];
                    case 1:
                        isCordova = _a.sent();
                        this.underlyingResolver = isCordova
                            ? this.cordovaResolver
                            : this.browserResolver;
                        return [2 /*return*/];
                }
            });
        });
    };
    return CompatPopupRedirectResolver;
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
function unwrap(object) {
    return object.unwrap();
}
function wrapped(object) {
    return object.wrapped();
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
function credentialFromResponse(userCredential) {
    return credentialFromObject(userCredential);
}
function attachExtraErrorFields(auth, e) {
    var _a;
    // The response contains all fields from the server which may or may not
    // actually match the underlying type
    var response = (_a = e.customData) === null || _a === void 0 ? void 0 : _a._tokenResponse;
    if ((e === null || e === void 0 ? void 0 : e.code) === 'auth/multi-factor-auth-required') {
        var mfaErr = e;
        mfaErr.resolver = new MultiFactorResolver(auth, exp.getMultiFactorResolver(auth, e));
    }
    else if (response) {
        var credential = credentialFromObject(e);
        var credErr = e;
        if (credential) {
            credErr.credential = credential;
            credErr.tenantId = response.tenantId || undefined;
            credErr.email = response.email || undefined;
            credErr.phoneNumber = response.phoneNumber || undefined;
        }
    }
}
function credentialFromObject(object) {
    var _tokenResponse = (object instanceof FirebaseError ? object.customData : object)._tokenResponse;
    if (!_tokenResponse) {
        return null;
    }
    // Handle phone Auth credential responses, as they have a different format
    // from other backend responses (i.e. no providerId). This is also only the
    // case for user credentials (does not work for errors).
    if (!(object instanceof FirebaseError)) {
        if ('temporaryProof' in _tokenResponse && 'phoneNumber' in _tokenResponse) {
            return exp.PhoneAuthProvider.credentialFromResult(object);
        }
    }
    var providerId = _tokenResponse.providerId;
    // Email and password is not supported as there is no situation where the
    // server would return the password to the client.
    if (!providerId || providerId === exp.ProviderId.PASSWORD) {
        return null;
    }
    var provider;
    switch (providerId) {
        case exp.ProviderId.GOOGLE:
            provider = exp.GoogleAuthProvider;
            break;
        case exp.ProviderId.FACEBOOK:
            provider = exp.FacebookAuthProvider;
            break;
        case exp.ProviderId.GITHUB:
            provider = exp.GithubAuthProvider;
            break;
        case exp.ProviderId.TWITTER:
            provider = exp.TwitterAuthProvider;
            break;
        default:
            var _a = _tokenResponse, oauthIdToken = _a.oauthIdToken, oauthAccessToken = _a.oauthAccessToken, oauthTokenSecret = _a.oauthTokenSecret, pendingToken = _a.pendingToken, nonce = _a.nonce;
            if (!oauthAccessToken &&
                !oauthTokenSecret &&
                !oauthIdToken &&
                !pendingToken) {
                return null;
            }
            // TODO(avolkovi): uncomment this and get it working with SAML & OIDC
            if (pendingToken) {
                if (providerId.startsWith('saml.')) {
                    return exp.SAMLAuthCredential._create(providerId, pendingToken);
                }
                else {
                    // OIDC and non-default providers excluding Twitter.
                    return exp.OAuthCredential._fromParams({
                        providerId: providerId,
                        signInMethod: providerId,
                        pendingToken: pendingToken,
                        idToken: oauthIdToken,
                        accessToken: oauthAccessToken
                    });
                }
            }
            return new exp.OAuthProvider(providerId).credential({
                idToken: oauthIdToken,
                accessToken: oauthAccessToken,
                rawNonce: nonce
            });
    }
    return object instanceof FirebaseError
        ? provider.credentialFromError(object)
        : provider.credentialFromResult(object);
}
function convertCredential(auth, credentialPromise) {
    return credentialPromise
        .catch(function (e) {
        if (e instanceof FirebaseError) {
            attachExtraErrorFields(auth, e);
        }
        throw e;
    })
        .then(function (credential) {
        var operationType = credential.operationType;
        var user = credential.user;
        return {
            operationType: operationType,
            credential: credentialFromResponse(credential),
            additionalUserInfo: exp.getAdditionalUserInfo(credential),
            user: User.getOrCreate(user)
        };
    });
}
function convertConfirmationResult(auth, confirmationResultPromise) {
    return __awaiter(this, void 0, void 0, function () {
        var confirmationResultExp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, confirmationResultPromise];
                case 1:
                    confirmationResultExp = _a.sent();
                    return [2 /*return*/, {
                            verificationId: confirmationResultExp.verificationId,
                            confirm: function (verificationCode) {
                                return convertCredential(auth, confirmationResultExp.confirm(verificationCode));
                            }
                        }];
            }
        });
    });
}
var MultiFactorResolver = /** @class */ (function () {
    function MultiFactorResolver(auth, resolver) {
        this.resolver = resolver;
        this.auth = wrapped(auth);
    }
    Object.defineProperty(MultiFactorResolver.prototype, "session", {
        get: function () {
            return this.resolver.session;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MultiFactorResolver.prototype, "hints", {
        get: function () {
            return this.resolver.hints;
        },
        enumerable: false,
        configurable: true
    });
    MultiFactorResolver.prototype.resolveSignIn = function (assertion) {
        return convertCredential(unwrap(this.auth), this.resolver.resolveSignIn(assertion));
    };
    return MultiFactorResolver;
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
var User = /** @class */ (function () {
    function User(_delegate) {
        this._delegate = _delegate;
        this.multiFactor = exp.multiFactor(_delegate);
    }
    User.getOrCreate = function (user) {
        if (!User.USER_MAP.has(user)) {
            User.USER_MAP.set(user, new User(user));
        }
        return User.USER_MAP.get(user);
    };
    User.prototype.delete = function () {
        return this._delegate.delete();
    };
    User.prototype.reload = function () {
        return this._delegate.reload();
    };
    User.prototype.toJSON = function () {
        return this._delegate.toJSON();
    };
    User.prototype.getIdTokenResult = function (forceRefresh) {
        return this._delegate.getIdTokenResult(forceRefresh);
    };
    User.prototype.getIdToken = function (forceRefresh) {
        return this._delegate.getIdToken(forceRefresh);
    };
    User.prototype.linkAndRetrieveDataWithCredential = function (credential) {
        return this.linkWithCredential(credential);
    };
    User.prototype.linkWithCredential = function (credential) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, convertCredential(this.auth, exp.linkWithCredential(this._delegate, credential))];
            });
        });
    };
    User.prototype.linkWithPhoneNumber = function (phoneNumber, applicationVerifier) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, convertConfirmationResult(this.auth, exp.linkWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier))];
            });
        });
    };
    User.prototype.linkWithPopup = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, convertCredential(this.auth, exp.linkWithPopup(this._delegate, provider, CompatPopupRedirectResolver))];
            });
        });
    };
    User.prototype.linkWithRedirect = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _savePersistenceForRedirect(exp._castAuth(this.auth))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, exp.linkWithRedirect(this._delegate, provider, CompatPopupRedirectResolver)];
                }
            });
        });
    };
    User.prototype.reauthenticateAndRetrieveDataWithCredential = function (credential) {
        return this.reauthenticateWithCredential(credential);
    };
    User.prototype.reauthenticateWithCredential = function (credential) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, convertCredential(this.auth, exp.reauthenticateWithCredential(this._delegate, credential))];
            });
        });
    };
    User.prototype.reauthenticateWithPhoneNumber = function (phoneNumber, applicationVerifier) {
        return convertConfirmationResult(this.auth, exp.reauthenticateWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier));
    };
    User.prototype.reauthenticateWithPopup = function (provider) {
        return convertCredential(this.auth, exp.reauthenticateWithPopup(this._delegate, provider, CompatPopupRedirectResolver));
    };
    User.prototype.reauthenticateWithRedirect = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _savePersistenceForRedirect(exp._castAuth(this.auth))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, exp.reauthenticateWithRedirect(this._delegate, provider, CompatPopupRedirectResolver)];
                }
            });
        });
    };
    User.prototype.sendEmailVerification = function (actionCodeSettings) {
        return exp.sendEmailVerification(this._delegate, actionCodeSettings);
    };
    User.prototype.unlink = function (providerId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exp.unlink(this._delegate, providerId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    User.prototype.updateEmail = function (newEmail) {
        return exp.updateEmail(this._delegate, newEmail);
    };
    User.prototype.updatePassword = function (newPassword) {
        return exp.updatePassword(this._delegate, newPassword);
    };
    User.prototype.updatePhoneNumber = function (phoneCredential) {
        return exp.updatePhoneNumber(this._delegate, phoneCredential);
    };
    User.prototype.updateProfile = function (profile) {
        return exp.updateProfile(this._delegate, profile);
    };
    User.prototype.verifyBeforeUpdateEmail = function (newEmail, actionCodeSettings) {
        return exp.verifyBeforeUpdateEmail(this._delegate, newEmail, actionCodeSettings);
    };
    Object.defineProperty(User.prototype, "emailVerified", {
        get: function () {
            return this._delegate.emailVerified;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "isAnonymous", {
        get: function () {
            return this._delegate.isAnonymous;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "metadata", {
        get: function () {
            return this._delegate.metadata;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "phoneNumber", {
        get: function () {
            return this._delegate.phoneNumber;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "providerData", {
        get: function () {
            return this._delegate.providerData;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "refreshToken", {
        get: function () {
            return this._delegate.refreshToken;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "tenantId", {
        get: function () {
            return this._delegate.tenantId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "displayName", {
        get: function () {
            return this._delegate.displayName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "email", {
        get: function () {
            return this._delegate.email;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "photoURL", {
        get: function () {
            return this._delegate.photoURL;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "providerId", {
        get: function () {
            return this._delegate.providerId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "uid", {
        get: function () {
            return this._delegate.uid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "auth", {
        get: function () {
            return this._delegate.auth;
        },
        enumerable: false,
        configurable: true
    });
    // Maintain a map so that there's always a 1:1 mapping between new User and
    // legacy compat users
    User.USER_MAP = new WeakMap();
    return User;
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
var _assert$1 = exp._assert;
var Auth = /** @class */ (function () {
    function Auth(app, provider) {
        this.app = app;
        if (provider.isInitialized()) {
            this._delegate = provider.getImmediate();
            this.linkUnderlyingAuth();
            return;
        }
        var apiKey = app.options.apiKey;
        // TODO: platform needs to be determined using heuristics
        _assert$1(apiKey, "invalid-api-key" /* exp.AuthErrorCode.INVALID_API_KEY */, {
            appName: app.name
        });
        // TODO: platform needs to be determined using heuristics
        _assert$1(apiKey, "invalid-api-key" /* exp.AuthErrorCode.INVALID_API_KEY */, {
            appName: app.name
        });
        // Only use a popup/redirect resolver in browser environments
        var resolver = typeof window !== 'undefined' ? CompatPopupRedirectResolver : undefined;
        this._delegate = provider.initialize({
            options: {
                persistence: buildPersistenceHierarchy(apiKey, app.name),
                popupRedirectResolver: resolver
            }
        });
        this._delegate._updateErrorMap(exp.debugErrorMap);
        this.linkUnderlyingAuth();
    }
    Object.defineProperty(Auth.prototype, "emulatorConfig", {
        get: function () {
            return this._delegate.emulatorConfig;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "currentUser", {
        get: function () {
            if (!this._delegate.currentUser) {
                return null;
            }
            return User.getOrCreate(this._delegate.currentUser);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "languageCode", {
        get: function () {
            return this._delegate.languageCode;
        },
        set: function (languageCode) {
            this._delegate.languageCode = languageCode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "settings", {
        get: function () {
            return this._delegate.settings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "tenantId", {
        get: function () {
            return this._delegate.tenantId;
        },
        set: function (tid) {
            this._delegate.tenantId = tid;
        },
        enumerable: false,
        configurable: true
    });
    Auth.prototype.useDeviceLanguage = function () {
        this._delegate.useDeviceLanguage();
    };
    Auth.prototype.signOut = function () {
        return this._delegate.signOut();
    };
    Auth.prototype.useEmulator = function (url, options) {
        exp.connectAuthEmulator(this._delegate, url, options);
    };
    Auth.prototype.applyActionCode = function (code) {
        return exp.applyActionCode(this._delegate, code);
    };
    Auth.prototype.checkActionCode = function (code) {
        return exp.checkActionCode(this._delegate, code);
    };
    Auth.prototype.confirmPasswordReset = function (code, newPassword) {
        return exp.confirmPasswordReset(this._delegate, code, newPassword);
    };
    Auth.prototype.createUserWithEmailAndPassword = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, convertCredential(this._delegate, exp.createUserWithEmailAndPassword(this._delegate, email, password))];
            });
        });
    };
    Auth.prototype.fetchProvidersForEmail = function (email) {
        return this.fetchSignInMethodsForEmail(email);
    };
    Auth.prototype.fetchSignInMethodsForEmail = function (email) {
        return exp.fetchSignInMethodsForEmail(this._delegate, email);
    };
    Auth.prototype.isSignInWithEmailLink = function (emailLink) {
        return exp.isSignInWithEmailLink(this._delegate, emailLink);
    };
    Auth.prototype.getRedirectResult = function () {
        return __awaiter(this, void 0, void 0, function () {
            var credential;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _assert$1(_isPopupRedirectSupported(), this._delegate, "operation-not-supported-in-this-environment" /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */);
                        return [4 /*yield*/, exp.getRedirectResult(this._delegate, CompatPopupRedirectResolver)];
                    case 1:
                        credential = _a.sent();
                        if (!credential) {
                            return [2 /*return*/, {
                                    credential: null,
                                    user: null
                                }];
                        }
                        return [2 /*return*/, convertCredential(this._delegate, Promise.resolve(credential))];
                }
            });
        });
    };
    // This function should only be called by frameworks (e.g. FirebaseUI-web) to log their usage.
    // It is not intended for direct use by developer apps. NO jsdoc here to intentionally leave it
    // out of autogenerated documentation pages to reduce accidental misuse.
    Auth.prototype.addFrameworkForLogging = function (framework) {
        exp.addFrameworkForLogging(this._delegate, framework);
    };
    Auth.prototype.onAuthStateChanged = function (nextOrObserver, errorFn, completed) {
        var _a = wrapObservers(nextOrObserver, errorFn, completed), next = _a.next, error = _a.error, complete = _a.complete;
        return this._delegate.onAuthStateChanged(next, error, complete);
    };
    Auth.prototype.onIdTokenChanged = function (nextOrObserver, errorFn, completed) {
        var _a = wrapObservers(nextOrObserver, errorFn, completed), next = _a.next, error = _a.error, complete = _a.complete;
        return this._delegate.onIdTokenChanged(next, error, complete);
    };
    Auth.prototype.sendSignInLinkToEmail = function (email, actionCodeSettings) {
        return exp.sendSignInLinkToEmail(this._delegate, email, actionCodeSettings);
    };
    Auth.prototype.sendPasswordResetEmail = function (email, actionCodeSettings) {
        return exp.sendPasswordResetEmail(this._delegate, email, actionCodeSettings || undefined);
    };
    Auth.prototype.setPersistence = function (persistence) {
        return __awaiter(this, void 0, void 0, function () {
            var converted, _a, isIndexedDBFullySupported;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _validatePersistenceArgument(this._delegate, persistence);
                        _a = persistence;
                        switch (_a) {
                            case Persistence.SESSION: return [3 /*break*/, 1];
                            case Persistence.LOCAL: return [3 /*break*/, 2];
                            case Persistence.NONE: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 5];
                    case 1:
                        converted = exp.browserSessionPersistence;
                        return [3 /*break*/, 6];
                    case 2: return [4 /*yield*/, exp
                            ._getInstance(exp.indexedDBLocalPersistence)
                            ._isAvailable()];
                    case 3:
                        isIndexedDBFullySupported = _b.sent();
                        converted = isIndexedDBFullySupported
                            ? exp.indexedDBLocalPersistence
                            : exp.browserLocalPersistence;
                        return [3 /*break*/, 6];
                    case 4:
                        converted = exp.inMemoryPersistence;
                        return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, exp._fail("argument-error" /* exp.AuthErrorCode.ARGUMENT_ERROR */, {
                            appName: this._delegate.name
                        })];
                    case 6: return [2 /*return*/, this._delegate.setPersistence(converted)];
                }
            });
        });
    };
    Auth.prototype.signInAndRetrieveDataWithCredential = function (credential) {
        return this.signInWithCredential(credential);
    };
    Auth.prototype.signInAnonymously = function () {
        return convertCredential(this._delegate, exp.signInAnonymously(this._delegate));
    };
    Auth.prototype.signInWithCredential = function (credential) {
        return convertCredential(this._delegate, exp.signInWithCredential(this._delegate, credential));
    };
    Auth.prototype.signInWithCustomToken = function (token) {
        return convertCredential(this._delegate, exp.signInWithCustomToken(this._delegate, token));
    };
    Auth.prototype.signInWithEmailAndPassword = function (email, password) {
        return convertCredential(this._delegate, exp.signInWithEmailAndPassword(this._delegate, email, password));
    };
    Auth.prototype.signInWithEmailLink = function (email, emailLink) {
        return convertCredential(this._delegate, exp.signInWithEmailLink(this._delegate, email, emailLink));
    };
    Auth.prototype.signInWithPhoneNumber = function (phoneNumber, applicationVerifier) {
        return convertConfirmationResult(this._delegate, exp.signInWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier));
    };
    Auth.prototype.signInWithPopup = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                _assert$1(_isPopupRedirectSupported(), this._delegate, "operation-not-supported-in-this-environment" /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */);
                return [2 /*return*/, convertCredential(this._delegate, exp.signInWithPopup(this._delegate, provider, CompatPopupRedirectResolver))];
            });
        });
    };
    Auth.prototype.signInWithRedirect = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _assert$1(_isPopupRedirectSupported(), this._delegate, "operation-not-supported-in-this-environment" /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */);
                        return [4 /*yield*/, _savePersistenceForRedirect(this._delegate)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, exp.signInWithRedirect(this._delegate, provider, CompatPopupRedirectResolver)];
                }
            });
        });
    };
    Auth.prototype.updateCurrentUser = function (user) {
        // remove ts-ignore once overloads are defined for exp functions to accept compat objects
        // @ts-ignore
        return this._delegate.updateCurrentUser(user);
    };
    Auth.prototype.verifyPasswordResetCode = function (code) {
        return exp.verifyPasswordResetCode(this._delegate, code);
    };
    Auth.prototype.unwrap = function () {
        return this._delegate;
    };
    Auth.prototype._delete = function () {
        return this._delegate._delete();
    };
    Auth.prototype.linkUnderlyingAuth = function () {
        var _this = this;
        this._delegate.wrapped = function () { return _this; };
    };
    Auth.Persistence = Persistence;
    return Auth;
}());
function wrapObservers(nextOrObserver, error, complete) {
    var next = nextOrObserver;
    if (typeof nextOrObserver !== 'function') {
        (next = nextOrObserver.next, error = nextOrObserver.error, complete = nextOrObserver.complete);
    }
    // We know 'next' is now a function
    var oldNext = next;
    var newNext = function (user) {
        return oldNext(user && User.getOrCreate(user));
    };
    return {
        next: newNext,
        error: error,
        complete: complete
    };
}
function buildPersistenceHierarchy(apiKey, appName) {
    // Note this is slightly different behavior: in this case, the stored
    // persistence is checked *first* rather than last. This is because we want
    // to prefer stored persistence type in the hierarchy. This is an empty
    // array if window is not available or there is no pending redirect
    var persistences = _getPersistencesFromRedirect(apiKey, appName);
    // If "self" is available, add indexedDB
    if (typeof self !== 'undefined' &&
        !persistences.includes(exp.indexedDBLocalPersistence)) {
        persistences.push(exp.indexedDBLocalPersistence);
    }
    // If "window" is available, add HTML Storage persistences
    if (typeof window !== 'undefined') {
        for (var _i = 0, _a = [
            exp.browserLocalPersistence,
            exp.browserSessionPersistence
        ]; _i < _a.length; _i++) {
            var persistence = _a[_i];
            if (!persistences.includes(persistence)) {
                persistences.push(persistence);
            }
        }
    }
    // Add in-memory as a final fallback
    if (!persistences.includes(exp.inMemoryPersistence)) {
        persistences.push(exp.inMemoryPersistence);
    }
    return persistences;
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
var PhoneAuthProvider = /** @class */ (function () {
    function PhoneAuthProvider() {
        this.providerId = 'phone';
        // TODO: remove ts-ignore when moving types from auth-types to auth-compat
        // @ts-ignore
        this._delegate = new exp.PhoneAuthProvider(unwrap(firebase.auth()));
    }
    PhoneAuthProvider.credential = function (verificationId, verificationCode) {
        return exp.PhoneAuthProvider.credential(verificationId, verificationCode);
    };
    PhoneAuthProvider.prototype.verifyPhoneNumber = function (phoneInfoOptions, applicationVerifier) {
        return this._delegate.verifyPhoneNumber(
        // The implementation matches but the types are subtly incompatible
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        phoneInfoOptions, applicationVerifier);
    };
    PhoneAuthProvider.prototype.unwrap = function () {
        return this._delegate;
    };
    PhoneAuthProvider.PHONE_SIGN_IN_METHOD = exp.PhoneAuthProvider.PHONE_SIGN_IN_METHOD;
    PhoneAuthProvider.PROVIDER_ID = exp.PhoneAuthProvider.PROVIDER_ID;
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
var _assert = exp._assert;
var RecaptchaVerifier = /** @class */ (function () {
    function RecaptchaVerifier(container, parameters, app) {
        if (app === void 0) { app = firebase.app(); }
        var _a;
        // API key is required for web client RPC calls.
        _assert((_a = app.options) === null || _a === void 0 ? void 0 : _a.apiKey, "invalid-api-key" /* exp.AuthErrorCode.INVALID_API_KEY */, {
            appName: app.name
        });
        this._delegate = new exp.RecaptchaVerifier(
        // TODO: remove ts-ignore when moving types from auth-types to auth-compat
        // @ts-ignore
        app.auth(), container, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parameters);
        this.type = this._delegate.type;
    }
    RecaptchaVerifier.prototype.clear = function () {
        this._delegate.clear();
    };
    RecaptchaVerifier.prototype.render = function () {
        return this._delegate.render();
    };
    RecaptchaVerifier.prototype.verify = function () {
        return this._delegate.verify();
    };
    return RecaptchaVerifier;
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
var AUTH_TYPE = 'auth-compat';
// Create auth components to register with firebase.
// Provides Auth public APIs.
function registerAuthCompat(instance) {
    instance.INTERNAL.registerComponent(new Component(AUTH_TYPE, function (container) {
        // getImmediate for FirebaseApp will always succeed
        var app = container.getProvider('app-compat').getImmediate();
        var authProvider = container.getProvider('auth');
        return new Auth(app, authProvider);
    }, "PUBLIC" /* ComponentType.PUBLIC */)
        .setServiceProps({
        ActionCodeInfo: {
            Operation: {
                EMAIL_SIGNIN: exp.ActionCodeOperation.EMAIL_SIGNIN,
                PASSWORD_RESET: exp.ActionCodeOperation.PASSWORD_RESET,
                RECOVER_EMAIL: exp.ActionCodeOperation.RECOVER_EMAIL,
                REVERT_SECOND_FACTOR_ADDITION: exp.ActionCodeOperation.REVERT_SECOND_FACTOR_ADDITION,
                VERIFY_AND_CHANGE_EMAIL: exp.ActionCodeOperation.VERIFY_AND_CHANGE_EMAIL,
                VERIFY_EMAIL: exp.ActionCodeOperation.VERIFY_EMAIL
            }
        },
        EmailAuthProvider: exp.EmailAuthProvider,
        FacebookAuthProvider: exp.FacebookAuthProvider,
        GithubAuthProvider: exp.GithubAuthProvider,
        GoogleAuthProvider: exp.GoogleAuthProvider,
        OAuthProvider: exp.OAuthProvider,
        SAMLAuthProvider: exp.SAMLAuthProvider,
        PhoneAuthProvider: PhoneAuthProvider,
        PhoneMultiFactorGenerator: exp.PhoneMultiFactorGenerator,
        RecaptchaVerifier: RecaptchaVerifier,
        TwitterAuthProvider: exp.TwitterAuthProvider,
        Auth: Auth,
        AuthCredential: exp.AuthCredential,
        Error: FirebaseError
    })
        .setInstantiationMode("LAZY" /* InstantiationMode.LAZY */)
        .setMultipleInstances(false));
    instance.registerVersion(name, version);
}
registerAuthCompat(firebase);
//# sourceMappingURL=index.esm.js.map
