'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var app = require('@firebase/app');
var index = require('./index-96ab5fb1.js');
var tslib = require('tslib');
require('@firebase/util');
require('@firebase/component');
require('@firebase/logger');

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
 * Returns a persistence object that wraps `AsyncStorage` imported from
 * `react-native` or `@react-native-community/async-storage`, and can
 * be used in the persistence dependency field in {@link initializeAuth}.
 *
 * @public
 */
function getReactNativePersistence(storage) {
    var _a;
    // In the _getInstance() implementation (see src/core/persistence/index.ts),
    // we expect each "externs.Persistence" object passed to us by the user to
    // be able to be instantiated (as a class) using "new". That function also
    // expects the constructor to be empty. Since ReactNativeStorage requires the
    // underlying storage layer, we need to be able to create subclasses
    // (closures, esentially) that have the storage layer but empty constructor.
    return _a = /** @class */ (function () {
            function class_1() {
                this.type = "LOCAL" /* PersistenceType.LOCAL */;
            }
            class_1.prototype._isAvailable = function () {
                return tslib.__awaiter(this, void 0, void 0, function () {
                    return tslib.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 3, , 4]);
                                if (!storage) {
                                    return [2 /*return*/, false];
                                }
                                return [4 /*yield*/, storage.setItem(index.STORAGE_AVAILABLE_KEY, '1')];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, storage.removeItem(index.STORAGE_AVAILABLE_KEY)];
                            case 2:
                                _b.sent();
                                return [2 /*return*/, true];
                            case 3:
                                _b.sent();
                                return [2 /*return*/, false];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            };
            class_1.prototype._set = function (key, value) {
                return storage.setItem(key, JSON.stringify(value));
            };
            class_1.prototype._get = function (key) {
                return tslib.__awaiter(this, void 0, void 0, function () {
                    var json;
                    return tslib.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, storage.getItem(key)];
                            case 1:
                                json = _a.sent();
                                return [2 /*return*/, json ? JSON.parse(json) : null];
                        }
                    });
                });
            };
            class_1.prototype._remove = function (key) {
                return storage.removeItem(key);
            };
            class_1.prototype._addListener = function (_key, _listener) {
                // Listeners are not supported for React Native storage.
                return;
            };
            class_1.prototype._removeListener = function (_key, _listener) {
                // Listeners are not supported for React Native storage.
                return;
            };
            return class_1;
        }()),
        _a.type = 'LOCAL',
        _a;
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
var NO_PERSISTENCE_WARNING = "\nYou are initializing Firebase Auth for React Native without providing\nAsyncStorage. Auth state will default to memory persistence and will not\npersist between sessions. In order to persist auth state, install the package\n\"@react-native-async-storage/async-storage\" and provide it to\ninitializeAuth:\n\nimport { initializeAuth, getReactNativePersistence } from 'firebase/auth';\nimport ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';\nconst auth = initializeAuth(app, {\n  persistence: getReactNativePersistence(ReactNativeAsyncStorage)\n});\n";
function getAuth(app$1) {
    if (app$1 === void 0) { app$1 = app.getApp(); }
    var provider = app._getProvider(app$1, 'auth');
    if (provider.isInitialized()) {
        return provider.getImmediate();
    }
    // Only warn if getAuth() is called before initializeAuth()
    index._logWarn(NO_PERSISTENCE_WARNING);
    return index.initializeAuth(app$1);
}
/**
 * Wrapper around base `initializeAuth()` for RN users only, which
 * shows the warning message if no persistence is provided.
 * Double-checked potential collision with `export * from './index.shared'`
 * as `./index.shared` also exports `initializeAuth()`, and the final
 * bundle does correctly export only this `initializeAuth()` function
 * and not the one from index.shared.
 */
function initializeAuth(app, deps) {
    if (!(deps === null || deps === void 0 ? void 0 : deps.persistence)) {
        index._logWarn(NO_PERSISTENCE_WARNING);
    }
    return index.initializeAuth(app, deps);
}
index.registerAuth("ReactNative" /* ClientPlatform.REACT_NATIVE */);

exports.ActionCodeOperation = index.ActionCodeOperation;
exports.ActionCodeURL = index.ActionCodeURL;
exports.AuthCredential = index.AuthCredential;
exports.AuthErrorCodes = index.AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY;
exports.EmailAuthCredential = index.EmailAuthCredential;
exports.EmailAuthProvider = index.EmailAuthProvider;
exports.FacebookAuthProvider = index.FacebookAuthProvider;
exports.FactorId = index.FactorId;
exports.GithubAuthProvider = index.GithubAuthProvider;
exports.GoogleAuthProvider = index.GoogleAuthProvider;
exports.OAuthCredential = index.OAuthCredential;
exports.OAuthProvider = index.OAuthProvider;
exports.OperationType = index.OperationType;
exports.PhoneAuthCredential = index.PhoneAuthCredential;
exports.PhoneAuthProvider = index.PhoneAuthProvider;
exports.PhoneMultiFactorGenerator = index.PhoneMultiFactorGenerator;
exports.ProviderId = index.ProviderId;
exports.SAMLAuthProvider = index.SAMLAuthProvider;
exports.SignInMethod = index.SignInMethod;
exports.TotpMultiFactorGenerator = index.TotpMultiFactorGenerator;
exports.TotpSecret = index.TotpSecret;
exports.TwitterAuthProvider = index.TwitterAuthProvider;
exports.applyActionCode = index.applyActionCode;
exports.beforeAuthStateChanged = index.beforeAuthStateChanged;
exports.checkActionCode = index.checkActionCode;
exports.confirmPasswordReset = index.confirmPasswordReset;
exports.connectAuthEmulator = index.connectAuthEmulator;
exports.createUserWithEmailAndPassword = index.createUserWithEmailAndPassword;
exports.debugErrorMap = index.debugErrorMap;
exports.deleteUser = index.deleteUser;
exports.fetchSignInMethodsForEmail = index.fetchSignInMethodsForEmail;
exports.getAdditionalUserInfo = index.getAdditionalUserInfo;
exports.getIdToken = index.getIdToken;
exports.getIdTokenResult = index.getIdTokenResult;
exports.getMultiFactorResolver = index.getMultiFactorResolver;
exports.inMemoryPersistence = index.inMemoryPersistence;
exports.initializeRecaptchaConfig = index.initializeRecaptchaConfig;
exports.isSignInWithEmailLink = index.isSignInWithEmailLink;
exports.linkWithCredential = index.linkWithCredential;
exports.linkWithPhoneNumber = index.linkWithPhoneNumber;
exports.multiFactor = index.multiFactor;
exports.onAuthStateChanged = index.onAuthStateChanged;
exports.onIdTokenChanged = index.onIdTokenChanged;
exports.parseActionCodeURL = index.parseActionCodeURL;
exports.prodErrorMap = index.prodErrorMap;
exports.reauthenticateWithCredential = index.reauthenticateWithCredential;
exports.reauthenticateWithPhoneNumber = index.reauthenticateWithPhoneNumber;
exports.reload = index.reload;
exports.revokeAccessToken = index.revokeAccessToken;
exports.sendEmailVerification = index.sendEmailVerification;
exports.sendPasswordResetEmail = index.sendPasswordResetEmail;
exports.sendSignInLinkToEmail = index.sendSignInLinkToEmail;
exports.setPersistence = index.setPersistence;
exports.signInAnonymously = index.signInAnonymously;
exports.signInWithCredential = index.signInWithCredential;
exports.signInWithCustomToken = index.signInWithCustomToken;
exports.signInWithEmailAndPassword = index.signInWithEmailAndPassword;
exports.signInWithEmailLink = index.signInWithEmailLink;
exports.signInWithPhoneNumber = index.signInWithPhoneNumber;
exports.signOut = index.signOut;
exports.unlink = index.unlink;
exports.updateCurrentUser = index.updateCurrentUser;
exports.updateEmail = index.updateEmail;
exports.updatePassword = index.updatePassword;
exports.updatePhoneNumber = index.updatePhoneNumber;
exports.updateProfile = index.updateProfile;
exports.useDeviceLanguage = index.useDeviceLanguage;
exports.validatePassword = index.validatePassword;
exports.verifyBeforeUpdateEmail = index.verifyBeforeUpdateEmail;
exports.verifyPasswordResetCode = index.verifyPasswordResetCode;
exports.getAuth = getAuth;
exports.getReactNativePersistence = getReactNativePersistence;
exports.initializeAuth = initializeAuth;
//# sourceMappingURL=index.js.map
