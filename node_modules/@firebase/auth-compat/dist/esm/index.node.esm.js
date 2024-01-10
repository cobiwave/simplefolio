import firebase from '@firebase/app-compat';
import * as exp from '@firebase/auth/internal';
import { FetchProvider } from '@firebase/auth/internal';
import { Component } from '@firebase/component';
import { isBrowserExtension, getUA, isReactNative, isNode, isIndexedDBAvailable, isIE, FirebaseError } from '@firebase/util';
import { fetch, Headers, Response } from 'undici';

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
const CORDOVA_ONDEVICEREADY_TIMEOUT_MS = 1000;
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
function _isAndroidOrIosCordovaScheme(ua = getUA()) {
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
function _isEdge(ua = getUA()) {
    return /Edge\/\d+/.test(ua);
}
/**
 * @param {?string=} opt_userAgent The navigator user agent.
 * @return {boolean} Whether local storage is not synchronized between an iframe
 *     and a popup of the same domain.
 */
function _isLocalStorageNotSynchronized(ua = getUA()) {
    return _isIe11() || _isEdge(ua);
}
/** @return {boolean} Whether web storage is supported. */
function _isWebStorageSupported() {
    try {
        const storage = self.localStorage;
        const key = exp._generateEventId();
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
async function _isCordova() {
    if (!_isLikelyCordova()) {
        return false;
    }
    return new Promise(resolve => {
        const timeoutId = setTimeout(() => {
            // We've waited long enough; the telltale Cordova event didn't happen
            resolve(false);
        }, CORDOVA_ONDEVICEREADY_TIMEOUT_MS);
        document.addEventListener('deviceready', () => {
            clearTimeout(timeoutId);
            resolve(true);
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
const Persistence = {
    LOCAL: 'local',
    NONE: 'none',
    SESSION: 'session'
};
const _assert$3 = exp._assert;
const PERSISTENCE_KEY = 'persistence';
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
async function _savePersistenceForRedirect(auth) {
    await auth._initializationPromise;
    const session = getSessionStorageIfAvailable();
    const key = exp._persistenceKeyName(PERSISTENCE_KEY, auth.config.apiKey, auth.name);
    if (session) {
        session.setItem(key, auth._getPersistence());
    }
}
function _getPersistencesFromRedirect(apiKey, appName) {
    const session = getSessionStorageIfAvailable();
    if (!session) {
        return [];
    }
    const key = exp._persistenceKeyName(PERSISTENCE_KEY, apiKey, appName);
    const persistence = session.getItem(key);
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
const _assert$2 = exp._assert;
/** Platform-agnostic popup-redirect resolver */
class CompatPopupRedirectResolver {
    constructor() {
        // Create both resolvers for dynamic resolution later
        this.browserResolver = exp._getInstance(exp.browserPopupRedirectResolver);
        this.cordovaResolver = exp._getInstance(exp.cordovaPopupRedirectResolver);
        // The actual resolver in use: either browserResolver or cordovaResolver.
        this.underlyingResolver = null;
        this._redirectPersistence = exp.browserSessionPersistence;
        this._completeRedirectFn = exp._getRedirectResult;
        this._overrideRedirectResult = exp._overrideRedirectResult;
    }
    async _initialize(auth) {
        await this.selectUnderlyingResolver();
        return this.assertedUnderlyingResolver._initialize(auth);
    }
    async _openPopup(auth, provider, authType, eventId) {
        await this.selectUnderlyingResolver();
        return this.assertedUnderlyingResolver._openPopup(auth, provider, authType, eventId);
    }
    async _openRedirect(auth, provider, authType, eventId) {
        await this.selectUnderlyingResolver();
        return this.assertedUnderlyingResolver._openRedirect(auth, provider, authType, eventId);
    }
    _isIframeWebStorageSupported(auth, cb) {
        this.assertedUnderlyingResolver._isIframeWebStorageSupported(auth, cb);
    }
    _originValidation(auth) {
        return this.assertedUnderlyingResolver._originValidation(auth);
    }
    get _shouldInitProactively() {
        return _isLikelyCordova() || this.browserResolver._shouldInitProactively;
    }
    get assertedUnderlyingResolver() {
        _assert$2(this.underlyingResolver, "internal-error" /* exp.AuthErrorCode.INTERNAL_ERROR */);
        return this.underlyingResolver;
    }
    async selectUnderlyingResolver() {
        if (this.underlyingResolver) {
            return;
        }
        // We haven't yet determined whether or not we're in Cordova; go ahead
        // and determine that state now.
        const isCordova = await _isCordova();
        this.underlyingResolver = isCordova
            ? this.cordovaResolver
            : this.browserResolver;
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
    const response = (_a = e.customData) === null || _a === void 0 ? void 0 : _a._tokenResponse;
    if ((e === null || e === void 0 ? void 0 : e.code) === 'auth/multi-factor-auth-required') {
        const mfaErr = e;
        mfaErr.resolver = new MultiFactorResolver(auth, exp.getMultiFactorResolver(auth, e));
    }
    else if (response) {
        const credential = credentialFromObject(e);
        const credErr = e;
        if (credential) {
            credErr.credential = credential;
            credErr.tenantId = response.tenantId || undefined;
            credErr.email = response.email || undefined;
            credErr.phoneNumber = response.phoneNumber || undefined;
        }
    }
}
function credentialFromObject(object) {
    const { _tokenResponse } = (object instanceof FirebaseError ? object.customData : object);
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
    const providerId = _tokenResponse.providerId;
    // Email and password is not supported as there is no situation where the
    // server would return the password to the client.
    if (!providerId || providerId === exp.ProviderId.PASSWORD) {
        return null;
    }
    let provider;
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
            const { oauthIdToken, oauthAccessToken, oauthTokenSecret, pendingToken, nonce } = _tokenResponse;
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
                        providerId,
                        signInMethod: providerId,
                        pendingToken,
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
        .catch(e => {
        if (e instanceof FirebaseError) {
            attachExtraErrorFields(auth, e);
        }
        throw e;
    })
        .then(credential => {
        const operationType = credential.operationType;
        const user = credential.user;
        return {
            operationType,
            credential: credentialFromResponse(credential),
            additionalUserInfo: exp.getAdditionalUserInfo(credential),
            user: User.getOrCreate(user)
        };
    });
}
async function convertConfirmationResult(auth, confirmationResultPromise) {
    const confirmationResultExp = await confirmationResultPromise;
    return {
        verificationId: confirmationResultExp.verificationId,
        confirm: (verificationCode) => convertCredential(auth, confirmationResultExp.confirm(verificationCode))
    };
}
class MultiFactorResolver {
    constructor(auth, resolver) {
        this.resolver = resolver;
        this.auth = wrapped(auth);
    }
    get session() {
        return this.resolver.session;
    }
    get hints() {
        return this.resolver.hints;
    }
    resolveSignIn(assertion) {
        return convertCredential(unwrap(this.auth), this.resolver.resolveSignIn(assertion));
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
class User {
    constructor(_delegate) {
        this._delegate = _delegate;
        this.multiFactor = exp.multiFactor(_delegate);
    }
    static getOrCreate(user) {
        if (!User.USER_MAP.has(user)) {
            User.USER_MAP.set(user, new User(user));
        }
        return User.USER_MAP.get(user);
    }
    delete() {
        return this._delegate.delete();
    }
    reload() {
        return this._delegate.reload();
    }
    toJSON() {
        return this._delegate.toJSON();
    }
    getIdTokenResult(forceRefresh) {
        return this._delegate.getIdTokenResult(forceRefresh);
    }
    getIdToken(forceRefresh) {
        return this._delegate.getIdToken(forceRefresh);
    }
    linkAndRetrieveDataWithCredential(credential) {
        return this.linkWithCredential(credential);
    }
    async linkWithCredential(credential) {
        return convertCredential(this.auth, exp.linkWithCredential(this._delegate, credential));
    }
    async linkWithPhoneNumber(phoneNumber, applicationVerifier) {
        return convertConfirmationResult(this.auth, exp.linkWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier));
    }
    async linkWithPopup(provider) {
        return convertCredential(this.auth, exp.linkWithPopup(this._delegate, provider, CompatPopupRedirectResolver));
    }
    async linkWithRedirect(provider) {
        await _savePersistenceForRedirect(exp._castAuth(this.auth));
        return exp.linkWithRedirect(this._delegate, provider, CompatPopupRedirectResolver);
    }
    reauthenticateAndRetrieveDataWithCredential(credential) {
        return this.reauthenticateWithCredential(credential);
    }
    async reauthenticateWithCredential(credential) {
        return convertCredential(this.auth, exp.reauthenticateWithCredential(this._delegate, credential));
    }
    reauthenticateWithPhoneNumber(phoneNumber, applicationVerifier) {
        return convertConfirmationResult(this.auth, exp.reauthenticateWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier));
    }
    reauthenticateWithPopup(provider) {
        return convertCredential(this.auth, exp.reauthenticateWithPopup(this._delegate, provider, CompatPopupRedirectResolver));
    }
    async reauthenticateWithRedirect(provider) {
        await _savePersistenceForRedirect(exp._castAuth(this.auth));
        return exp.reauthenticateWithRedirect(this._delegate, provider, CompatPopupRedirectResolver);
    }
    sendEmailVerification(actionCodeSettings) {
        return exp.sendEmailVerification(this._delegate, actionCodeSettings);
    }
    async unlink(providerId) {
        await exp.unlink(this._delegate, providerId);
        return this;
    }
    updateEmail(newEmail) {
        return exp.updateEmail(this._delegate, newEmail);
    }
    updatePassword(newPassword) {
        return exp.updatePassword(this._delegate, newPassword);
    }
    updatePhoneNumber(phoneCredential) {
        return exp.updatePhoneNumber(this._delegate, phoneCredential);
    }
    updateProfile(profile) {
        return exp.updateProfile(this._delegate, profile);
    }
    verifyBeforeUpdateEmail(newEmail, actionCodeSettings) {
        return exp.verifyBeforeUpdateEmail(this._delegate, newEmail, actionCodeSettings);
    }
    get emailVerified() {
        return this._delegate.emailVerified;
    }
    get isAnonymous() {
        return this._delegate.isAnonymous;
    }
    get metadata() {
        return this._delegate.metadata;
    }
    get phoneNumber() {
        return this._delegate.phoneNumber;
    }
    get providerData() {
        return this._delegate.providerData;
    }
    get refreshToken() {
        return this._delegate.refreshToken;
    }
    get tenantId() {
        return this._delegate.tenantId;
    }
    get displayName() {
        return this._delegate.displayName;
    }
    get email() {
        return this._delegate.email;
    }
    get photoURL() {
        return this._delegate.photoURL;
    }
    get providerId() {
        return this._delegate.providerId;
    }
    get uid() {
        return this._delegate.uid;
    }
    get auth() {
        return this._delegate.auth;
    }
}
// Maintain a map so that there's always a 1:1 mapping between new User and
// legacy compat users
User.USER_MAP = new WeakMap();

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
const _assert$1 = exp._assert;
class Auth {
    constructor(app, provider) {
        this.app = app;
        if (provider.isInitialized()) {
            this._delegate = provider.getImmediate();
            this.linkUnderlyingAuth();
            return;
        }
        const { apiKey } = app.options;
        // TODO: platform needs to be determined using heuristics
        _assert$1(apiKey, "invalid-api-key" /* exp.AuthErrorCode.INVALID_API_KEY */, {
            appName: app.name
        });
        // TODO: platform needs to be determined using heuristics
        _assert$1(apiKey, "invalid-api-key" /* exp.AuthErrorCode.INVALID_API_KEY */, {
            appName: app.name
        });
        // Only use a popup/redirect resolver in browser environments
        const resolver = typeof window !== 'undefined' ? CompatPopupRedirectResolver : undefined;
        this._delegate = provider.initialize({
            options: {
                persistence: buildPersistenceHierarchy(apiKey, app.name),
                popupRedirectResolver: resolver
            }
        });
        this._delegate._updateErrorMap(exp.debugErrorMap);
        this.linkUnderlyingAuth();
    }
    get emulatorConfig() {
        return this._delegate.emulatorConfig;
    }
    get currentUser() {
        if (!this._delegate.currentUser) {
            return null;
        }
        return User.getOrCreate(this._delegate.currentUser);
    }
    get languageCode() {
        return this._delegate.languageCode;
    }
    set languageCode(languageCode) {
        this._delegate.languageCode = languageCode;
    }
    get settings() {
        return this._delegate.settings;
    }
    get tenantId() {
        return this._delegate.tenantId;
    }
    set tenantId(tid) {
        this._delegate.tenantId = tid;
    }
    useDeviceLanguage() {
        this._delegate.useDeviceLanguage();
    }
    signOut() {
        return this._delegate.signOut();
    }
    useEmulator(url, options) {
        exp.connectAuthEmulator(this._delegate, url, options);
    }
    applyActionCode(code) {
        return exp.applyActionCode(this._delegate, code);
    }
    checkActionCode(code) {
        return exp.checkActionCode(this._delegate, code);
    }
    confirmPasswordReset(code, newPassword) {
        return exp.confirmPasswordReset(this._delegate, code, newPassword);
    }
    async createUserWithEmailAndPassword(email, password) {
        return convertCredential(this._delegate, exp.createUserWithEmailAndPassword(this._delegate, email, password));
    }
    fetchProvidersForEmail(email) {
        return this.fetchSignInMethodsForEmail(email);
    }
    fetchSignInMethodsForEmail(email) {
        return exp.fetchSignInMethodsForEmail(this._delegate, email);
    }
    isSignInWithEmailLink(emailLink) {
        return exp.isSignInWithEmailLink(this._delegate, emailLink);
    }
    async getRedirectResult() {
        _assert$1(_isPopupRedirectSupported(), this._delegate, "operation-not-supported-in-this-environment" /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */);
        const credential = await exp.getRedirectResult(this._delegate, CompatPopupRedirectResolver);
        if (!credential) {
            return {
                credential: null,
                user: null
            };
        }
        return convertCredential(this._delegate, Promise.resolve(credential));
    }
    // This function should only be called by frameworks (e.g. FirebaseUI-web) to log their usage.
    // It is not intended for direct use by developer apps. NO jsdoc here to intentionally leave it
    // out of autogenerated documentation pages to reduce accidental misuse.
    addFrameworkForLogging(framework) {
        exp.addFrameworkForLogging(this._delegate, framework);
    }
    onAuthStateChanged(nextOrObserver, errorFn, completed) {
        const { next, error, complete } = wrapObservers(nextOrObserver, errorFn, completed);
        return this._delegate.onAuthStateChanged(next, error, complete);
    }
    onIdTokenChanged(nextOrObserver, errorFn, completed) {
        const { next, error, complete } = wrapObservers(nextOrObserver, errorFn, completed);
        return this._delegate.onIdTokenChanged(next, error, complete);
    }
    sendSignInLinkToEmail(email, actionCodeSettings) {
        return exp.sendSignInLinkToEmail(this._delegate, email, actionCodeSettings);
    }
    sendPasswordResetEmail(email, actionCodeSettings) {
        return exp.sendPasswordResetEmail(this._delegate, email, actionCodeSettings || undefined);
    }
    async setPersistence(persistence) {
        _validatePersistenceArgument(this._delegate, persistence);
        let converted;
        switch (persistence) {
            case Persistence.SESSION:
                converted = exp.browserSessionPersistence;
                break;
            case Persistence.LOCAL:
                // Not using isIndexedDBAvailable() since it only checks if indexedDB is defined.
                const isIndexedDBFullySupported = await exp
                    ._getInstance(exp.indexedDBLocalPersistence)
                    ._isAvailable();
                converted = isIndexedDBFullySupported
                    ? exp.indexedDBLocalPersistence
                    : exp.browserLocalPersistence;
                break;
            case Persistence.NONE:
                converted = exp.inMemoryPersistence;
                break;
            default:
                return exp._fail("argument-error" /* exp.AuthErrorCode.ARGUMENT_ERROR */, {
                    appName: this._delegate.name
                });
        }
        return this._delegate.setPersistence(converted);
    }
    signInAndRetrieveDataWithCredential(credential) {
        return this.signInWithCredential(credential);
    }
    signInAnonymously() {
        return convertCredential(this._delegate, exp.signInAnonymously(this._delegate));
    }
    signInWithCredential(credential) {
        return convertCredential(this._delegate, exp.signInWithCredential(this._delegate, credential));
    }
    signInWithCustomToken(token) {
        return convertCredential(this._delegate, exp.signInWithCustomToken(this._delegate, token));
    }
    signInWithEmailAndPassword(email, password) {
        return convertCredential(this._delegate, exp.signInWithEmailAndPassword(this._delegate, email, password));
    }
    signInWithEmailLink(email, emailLink) {
        return convertCredential(this._delegate, exp.signInWithEmailLink(this._delegate, email, emailLink));
    }
    signInWithPhoneNumber(phoneNumber, applicationVerifier) {
        return convertConfirmationResult(this._delegate, exp.signInWithPhoneNumber(this._delegate, phoneNumber, applicationVerifier));
    }
    async signInWithPopup(provider) {
        _assert$1(_isPopupRedirectSupported(), this._delegate, "operation-not-supported-in-this-environment" /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */);
        return convertCredential(this._delegate, exp.signInWithPopup(this._delegate, provider, CompatPopupRedirectResolver));
    }
    async signInWithRedirect(provider) {
        _assert$1(_isPopupRedirectSupported(), this._delegate, "operation-not-supported-in-this-environment" /* exp.AuthErrorCode.OPERATION_NOT_SUPPORTED */);
        await _savePersistenceForRedirect(this._delegate);
        return exp.signInWithRedirect(this._delegate, provider, CompatPopupRedirectResolver);
    }
    updateCurrentUser(user) {
        // remove ts-ignore once overloads are defined for exp functions to accept compat objects
        // @ts-ignore
        return this._delegate.updateCurrentUser(user);
    }
    verifyPasswordResetCode(code) {
        return exp.verifyPasswordResetCode(this._delegate, code);
    }
    unwrap() {
        return this._delegate;
    }
    _delete() {
        return this._delegate._delete();
    }
    linkUnderlyingAuth() {
        this._delegate.wrapped = () => this;
    }
}
Auth.Persistence = Persistence;
function wrapObservers(nextOrObserver, error, complete) {
    let next = nextOrObserver;
    if (typeof nextOrObserver !== 'function') {
        ({ next, error, complete } = nextOrObserver);
    }
    // We know 'next' is now a function
    const oldNext = next;
    const newNext = (user) => oldNext(user && User.getOrCreate(user));
    return {
        next: newNext,
        error: error,
        complete
    };
}
function buildPersistenceHierarchy(apiKey, appName) {
    // Note this is slightly different behavior: in this case, the stored
    // persistence is checked *first* rather than last. This is because we want
    // to prefer stored persistence type in the hierarchy. This is an empty
    // array if window is not available or there is no pending redirect
    const persistences = _getPersistencesFromRedirect(apiKey, appName);
    // If "self" is available, add indexedDB
    if (typeof self !== 'undefined' &&
        !persistences.includes(exp.indexedDBLocalPersistence)) {
        persistences.push(exp.indexedDBLocalPersistence);
    }
    // If "window" is available, add HTML Storage persistences
    if (typeof window !== 'undefined') {
        for (const persistence of [
            exp.browserLocalPersistence,
            exp.browserSessionPersistence
        ]) {
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
class PhoneAuthProvider {
    constructor() {
        this.providerId = 'phone';
        // TODO: remove ts-ignore when moving types from auth-types to auth-compat
        // @ts-ignore
        this._delegate = new exp.PhoneAuthProvider(unwrap(firebase.auth()));
    }
    static credential(verificationId, verificationCode) {
        return exp.PhoneAuthProvider.credential(verificationId, verificationCode);
    }
    verifyPhoneNumber(phoneInfoOptions, applicationVerifier) {
        return this._delegate.verifyPhoneNumber(
        // The implementation matches but the types are subtly incompatible
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        phoneInfoOptions, applicationVerifier);
    }
    unwrap() {
        return this._delegate;
    }
}
PhoneAuthProvider.PHONE_SIGN_IN_METHOD = exp.PhoneAuthProvider.PHONE_SIGN_IN_METHOD;
PhoneAuthProvider.PROVIDER_ID = exp.PhoneAuthProvider.PROVIDER_ID;

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
const _assert = exp._assert;
class RecaptchaVerifier {
    constructor(container, parameters, app = firebase.app()) {
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
    clear() {
        this._delegate.clear();
    }
    render() {
        return this._delegate.render();
    }
    verify() {
        return this._delegate.verify();
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
const AUTH_TYPE = 'auth-compat';
// Create auth components to register with firebase.
// Provides Auth public APIs.
function registerAuthCompat(instance) {
    instance.INTERNAL.registerComponent(new Component(AUTH_TYPE, container => {
        // getImmediate for FirebaseApp will always succeed
        const app = container.getProvider('app-compat').getImmediate();
        const authProvider = container.getProvider('auth');
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
        Auth,
        AuthCredential: exp.AuthCredential,
        Error: FirebaseError
    })
        .setInstantiationMode("LAZY" /* InstantiationMode.LAZY */)
        .setMultipleInstances(false));
    instance.registerVersion(name, version);
}
registerAuthCompat(firebase);

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
FetchProvider.initialize(fetch, Headers, Response);
//# sourceMappingURL=index.node.esm.js.map
