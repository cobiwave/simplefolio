import { au as _getInstance, av as _assert, aw as _signInWithCredential, ax as _reauthenticate, ay as _link$1, L as AuthCredential, az as signInWithIdp, aA as _fail, aB as debugAssert, aC as _persistenceKeyName, aD as _castAuth, aE as FederatedAuthProvider, aF as BaseOAuthProvider, aG as _emulatorUrl, aH as _performApiRequest, aI as _isIOS, aJ as _isAndroid, aK as _isIOS7Or8, aL as _createError, aM as _isIframe, aN as _isMobileBrowser, aO as _isIE10, aP as _isSafari } from './totp-4c2d4e67.js';
export { A as ActionCodeOperation, ai as ActionCodeURL, L as AuthCredential, I as AuthErrorCodes, aR as AuthImpl, M as EmailAuthCredential, V as EmailAuthProvider, W as FacebookAuthProvider, F as FactorId, aT as FetchProvider, Y as GithubAuthProvider, X as GoogleAuthProvider, N as OAuthCredential, Z as OAuthProvider, O as OperationType, Q as PhoneAuthCredential, P as PhoneAuthProvider, m as PhoneMultiFactorGenerator, p as ProviderId, R as RecaptchaVerifier, aU as SAMLAuthCredential, _ as SAMLAuthProvider, S as SignInMethod, T as TotpMultiFactorGenerator, n as TotpSecret, $ as TwitterAuthProvider, aQ as UserImpl, av as _assert, aD as _castAuth, aA as _fail, aS as _getClientVersion, au as _getInstance, aC as _persistenceKeyName, a7 as applyActionCode, x as beforeAuthStateChanged, b as browserLocalPersistence, k as browserPopupRedirectResolver, a as browserSessionPersistence, a8 as checkActionCode, a6 as confirmPasswordReset, K as connectAuthEmulator, aa as createUserWithEmailAndPassword, G as debugErrorMap, E as deleteUser, af as fetchSignInMethodsForEmail, aq as getAdditionalUserInfo, o as getAuth, an as getIdToken, ao as getIdTokenResult, as as getMultiFactorResolver, j as getRedirectResult, U as inMemoryPersistence, i as indexedDBLocalPersistence, J as initializeAuth, t as initializeRecaptchaConfig, ad as isSignInWithEmailLink, a2 as linkWithCredential, l as linkWithPhoneNumber, d as linkWithPopup, g as linkWithRedirect, at as multiFactor, y as onAuthStateChanged, w as onIdTokenChanged, aj as parseActionCodeURL, H as prodErrorMap, a3 as reauthenticateWithCredential, r as reauthenticateWithPhoneNumber, e as reauthenticateWithPopup, h as reauthenticateWithRedirect, ar as reload, D as revokeAccessToken, ag as sendEmailVerification, a5 as sendPasswordResetEmail, ac as sendSignInLinkToEmail, q as setPersistence, a0 as signInAnonymously, a1 as signInWithCredential, a4 as signInWithCustomToken, ab as signInWithEmailAndPassword, ae as signInWithEmailLink, s as signInWithPhoneNumber, c as signInWithPopup, f as signInWithRedirect, C as signOut, ap as unlink, B as updateCurrentUser, al as updateEmail, am as updatePassword, u as updatePhoneNumber, ak as updateProfile, z as useDeviceLanguage, v as validatePassword, ah as verifyBeforeUpdateEmail, a9 as verifyPasswordResetCode } from './totp-4c2d4e67.js';
import { isEmpty, querystring, getUA, querystringDecode } from '@firebase/util';
import 'tslib';
import { SDK_VERSION } from '@firebase/app';
import '@firebase/component';
import 'undici';
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
function _generateEventId(prefix = '', digits = 10) {
    let random = '';
    for (let i = 0; i < digits; i++) {
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
class AuthPopup {
    constructor(window) {
        this.window = window;
        this.associatedEvent = null;
    }
    close() {
        if (this.window) {
            try {
                this.window.close();
            }
            catch (e) { }
        }
    }
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
 * Chooses a popup/redirect resolver to use. This prefers the override (which
 * is directly passed in), and falls back to the property set on the auth
 * object. If neither are available, this function errors w/ an argument error.
 */
function _withDefaultResolver(auth, resolverOverride) {
    if (resolverOverride) {
        return _getInstance(resolverOverride);
    }
    _assert(auth._popupRedirectResolver, auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
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
class IdpCredential extends AuthCredential {
    constructor(params) {
        super("custom" /* ProviderId.CUSTOM */, "custom" /* ProviderId.CUSTOM */);
        this.params = params;
    }
    _getIdTokenResponse(auth) {
        return signInWithIdp(auth, this._buildIdpRequest());
    }
    _linkToIdToken(auth, idToken) {
        return signInWithIdp(auth, this._buildIdpRequest(idToken));
    }
    _getReauthenticationResolver(auth) {
        return signInWithIdp(auth, this._buildIdpRequest());
    }
    _buildIdpRequest(idToken) {
        const request = {
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
    }
}
function _signIn(params) {
    return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
}
function _reauth(params) {
    const { auth, user } = params;
    _assert(user, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
}
async function _link(params) {
    const { auth, user } = params;
    _assert(user, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    return _link$1(user, new IdpCredential(params), params.bypassAuthState);
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
class AbstractPopupRedirectOperation {
    constructor(auth, filter, resolver, user, bypassAuthState = false) {
        this.auth = auth;
        this.resolver = resolver;
        this.user = user;
        this.bypassAuthState = bypassAuthState;
        this.pendingPromise = null;
        this.eventManager = null;
        this.filter = Array.isArray(filter) ? filter : [filter];
    }
    execute() {
        return new Promise(async (resolve, reject) => {
            this.pendingPromise = { resolve, reject };
            try {
                this.eventManager = await this.resolver._initialize(this.auth);
                await this.onExecution();
                this.eventManager.registerConsumer(this);
            }
            catch (e) {
                this.reject(e);
            }
        });
    }
    async onAuthEvent(event) {
        const { urlResponse, sessionId, postBody, tenantId, error, type } = event;
        if (error) {
            this.reject(error);
            return;
        }
        const params = {
            auth: this.auth,
            requestUri: urlResponse,
            sessionId: sessionId,
            tenantId: tenantId || undefined,
            postBody: postBody || undefined,
            user: this.user,
            bypassAuthState: this.bypassAuthState
        };
        try {
            this.resolve(await this.getIdpTask(type)(params));
        }
        catch (e) {
            this.reject(e);
        }
    }
    onError(error) {
        this.reject(error);
    }
    getIdpTask(type) {
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
                _fail(this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        }
    }
    resolve(cred) {
        debugAssert(this.pendingPromise, 'Pending promise was never set');
        this.pendingPromise.resolve(cred);
        this.unregisterAndCleanUp();
    }
    reject(error) {
        debugAssert(this.pendingPromise, 'Pending promise was never set');
        this.pendingPromise.reject(error);
        this.unregisterAndCleanUp();
    }
    unregisterAndCleanUp() {
        if (this.eventManager) {
            this.eventManager.unregisterConsumer(this);
        }
        this.pendingPromise = null;
        this.cleanUp();
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
const PENDING_REDIRECT_KEY = 'pendingRedirect';
// We only get one redirect outcome for any one auth, so just store it
// in here.
const redirectOutcomeMap = new Map();
class RedirectAction extends AbstractPopupRedirectOperation {
    constructor(auth, resolver, bypassAuthState = false) {
        super(auth, [
            "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */,
            "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */,
            "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */,
            "unknown" /* AuthEventType.UNKNOWN */
        ], resolver, undefined, bypassAuthState);
        this.eventId = null;
    }
    /**
     * Override the execute function; if we already have a redirect result, then
     * just return it.
     */
    async execute() {
        let readyOutcome = redirectOutcomeMap.get(this.auth._key());
        if (!readyOutcome) {
            try {
                const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
                const result = hasPendingRedirect ? await super.execute() : null;
                readyOutcome = () => Promise.resolve(result);
            }
            catch (e) {
                readyOutcome = () => Promise.reject(e);
            }
            redirectOutcomeMap.set(this.auth._key(), readyOutcome);
        }
        // If we're not bypassing auth state, the ready outcome should be set to
        // null.
        if (!this.bypassAuthState) {
            redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
        }
        return readyOutcome();
    }
    async onAuthEvent(event) {
        if (event.type === "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */) {
            return super.onAuthEvent(event);
        }
        else if (event.type === "unknown" /* AuthEventType.UNKNOWN */) {
            // This is a sentinel value indicating there's no pending redirect
            this.resolve(null);
            return;
        }
        if (event.eventId) {
            const user = await this.auth._redirectUserForId(event.eventId);
            if (user) {
                this.user = user;
                return super.onAuthEvent(event);
            }
            else {
                this.resolve(null);
            }
        }
    }
    async onExecution() { }
    cleanUp() { }
}
async function _getAndClearPendingRedirectStatus(resolver, auth) {
    const key = pendingRedirectKey(auth);
    const persistence = resolverPersistence(resolver);
    if (!(await persistence._isAvailable())) {
        return false;
    }
    const hasPendingRedirect = (await persistence._get(key)) === 'true';
    await persistence._remove(key);
    return hasPendingRedirect;
}
function _clearRedirectOutcomes() {
    redirectOutcomeMap.clear();
}
function _overrideRedirectResult(auth, result) {
    redirectOutcomeMap.set(auth._key(), result);
}
function resolverPersistence(resolver) {
    return _getInstance(resolver._redirectPersistence);
}
function pendingRedirectKey(auth) {
    return _persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
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
async function _getRedirectResult(auth, resolverExtern, bypassAuthState = false) {
    const authInternal = _castAuth(auth);
    const resolver = _withDefaultResolver(authInternal, resolverExtern);
    const action = new RedirectAction(authInternal, resolver, bypassAuthState);
    const result = await action.execute();
    if (result && !bypassAuthState) {
        delete result.user._redirectEventId;
        await authInternal._persistUserIfCurrent(result.user);
        await authInternal._setRedirectUser(null, resolverExtern);
    }
    return result;
}

const STORAGE_AVAILABLE_KEY = '__sak';

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
class BrowserPersistenceClass {
    constructor(storageRetriever, type) {
        this.storageRetriever = storageRetriever;
        this.type = type;
    }
    _isAvailable() {
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
    }
    _set(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
        return Promise.resolve();
    }
    _get(key) {
        const json = this.storage.getItem(key);
        return Promise.resolve(json ? JSON.parse(json) : null);
    }
    _remove(key) {
        this.storage.removeItem(key);
        return Promise.resolve();
    }
    get storage() {
        return this.storageRetriever();
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
class BrowserSessionPersistence extends BrowserPersistenceClass {
    constructor() {
        super(() => window.sessionStorage, "SESSION" /* PersistenceType.SESSION */);
    }
    _addListener(_key, _listener) {
        // Listeners are not supported for session storage since it cannot be shared across windows
        return;
    }
    _removeListener(_key, _listener) {
        // Listeners are not supported for session storage since it cannot be shared across windows
        return;
    }
}
BrowserSessionPersistence.type = 'SESSION';
/**
 * An implementation of {@link Persistence} of `SESSION` using `sessionStorage`
 * for the underlying storage.
 *
 * @public
 */
const browserSessionPersistence = BrowserSessionPersistence;

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
const WIDGET_PATH = '__/auth/handler';
/**
 * URL for emulated environment
 *
 * @internal
 */
const EMULATOR_WIDGET_PATH = 'emulator/auth/handler';
/**
 * Fragment name for the App Check token that gets passed to the widget
 *
 * @internal
 */
const FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent('fac');
async function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
    _assert(auth.config.authDomain, auth, "auth-domain-config-required" /* AuthErrorCode.MISSING_AUTH_DOMAIN */);
    _assert(auth.config.apiKey, auth, "invalid-api-key" /* AuthErrorCode.INVALID_API_KEY */);
    const params = {
        apiKey: auth.config.apiKey,
        appName: auth.name,
        authType,
        redirectUrl,
        v: SDK_VERSION,
        eventId
    };
    if (provider instanceof FederatedAuthProvider) {
        provider.setDefaultLanguage(auth.languageCode);
        params.providerId = provider.providerId || '';
        if (!isEmpty(provider.getCustomParameters())) {
            params.customParameters = JSON.stringify(provider.getCustomParameters());
        }
        // TODO set additionalParams from the provider as well?
        for (const [key, value] of Object.entries(additionalParams || {})) {
            params[key] = value;
        }
    }
    if (provider instanceof BaseOAuthProvider) {
        const scopes = provider.getScopes().filter(scope => scope !== '');
        if (scopes.length > 0) {
            params.scopes = scopes.join(',');
        }
    }
    if (auth.tenantId) {
        params.tid = auth.tenantId;
    }
    // TODO: maybe set eid as endipointId
    // TODO: maybe set fw as Frameworks.join(",")
    const paramsDict = params;
    for (const key of Object.keys(paramsDict)) {
        if (paramsDict[key] === undefined) {
            delete paramsDict[key];
        }
    }
    // Sets the App Check token to pass to the widget
    const appCheckToken = await auth._getAppCheckToken();
    const appCheckTokenFragment = appCheckToken
        ? `#${FIREBASE_APP_CHECK_FRAGMENT_ID}=${encodeURIComponent(appCheckToken)}`
        : '';
    // Start at index 1 to skip the leading '&' in the query string
    return `${getHandlerBase(auth)}?${querystring(paramsDict).slice(1)}${appCheckTokenFragment}`;
}
function getHandlerBase({ config }) {
    if (!config.emulator) {
        return `https://${config.authDomain}/${WIDGET_PATH}`;
    }
    return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
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
async function _getProjectConfig(auth, request = {}) {
    return _performApiRequest(auth, "GET" /* HttpMethod.GET */, "/v1/projects" /* Endpoint.GET_PROJECT_CONFIG */, request);
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
const REDIRECT_TIMEOUT_MS = 2000;
/**
 * Generates the URL for the OAuth handler.
 */
async function _generateHandlerUrl(auth, event, provider) {
    var _a;
    // Get the cordova plugins
    const { BuildInfo } = _cordovaWindow();
    debugAssert(event.sessionId, 'AuthEvent did not contain a session ID');
    const sessionDigest = await computeSha256(event.sessionId);
    const additionalParams = {};
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
    return _getRedirectUrl(auth, provider, event.type, undefined, (_a = event.eventId) !== null && _a !== void 0 ? _a : undefined, additionalParams);
}
/**
 * Validates that this app is valid for this project configuration
 */
async function _validateOrigin(auth) {
    const { BuildInfo } = _cordovaWindow();
    const request = {};
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
    await _getProjectConfig(auth, request);
}
function _performRedirect(handlerUrl) {
    // Get the cordova plugins
    const { cordova } = _cordovaWindow();
    return new Promise(resolve => {
        cordova.plugins.browsertab.isAvailable(browserTabIsAvailable => {
            let iabRef = null;
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
async function _waitForAppResume(auth, eventListener, iabRef) {
    // Get the cordova plugins
    const { cordova } = _cordovaWindow();
    let cleanup = () => { };
    try {
        await new Promise((resolve, reject) => {
            let onCloseTimer = null;
            // DEFINE ALL THE CALLBACKS =====
            function authEventSeen() {
                var _a;
                // Auth event was detected. Resolve this promise and close the extra
                // window if it's still open.
                resolve();
                const closeBrowserTab = (_a = cordova.plugins.browsertab) === null || _a === void 0 ? void 0 : _a.close;
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
                onCloseTimer = window.setTimeout(() => {
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
            cleanup = () => {
                eventListener.removePassiveListener(authEventSeen);
                document.removeEventListener('resume', resumed, false);
                document.removeEventListener('visibilitychange', visibilityChanged, false);
                if (onCloseTimer) {
                    window.clearTimeout(onCloseTimer);
                }
            };
        });
    }
    finally {
        cleanup();
    }
}
/**
 * Checks the configuration of the Cordova environment. This has no side effect
 * if the configuration is correct; otherwise it throws an error with the
 * missing plugin.
 */
function _checkCordovaConfiguration(auth) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const win = _cordovaWindow();
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
async function computeSha256(sessionId) {
    const bytes = stringToArrayBuffer(sessionId);
    // TODO: For IE11 crypto has a different name and this operation comes back
    //       as an object, not a promise. This is the old proposed standard that
    //       is used by IE11:
    // https://www.w3.org/TR/2013/WD-WebCryptoAPI-20130108/#cryptooperation-interface
    const buf = await crypto.subtle.digest('SHA-256', bytes);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map(num => num.toString(16).padStart(2, '0')).join('');
}
function stringToArrayBuffer(str) {
    // This function is only meant to deal with an ASCII charset and makes
    // certain simplifying assumptions.
    debugAssert(/[0-9a-zA-Z]+/.test(str), 'Can only convert alpha-numeric strings');
    if (typeof TextEncoder !== 'undefined') {
        return new TextEncoder().encode(str);
    }
    const buff = new ArrayBuffer(str.length);
    const view = new Uint8Array(buff);
    for (let i = 0; i < str.length; i++) {
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
const EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1000;
class AuthEventManager {
    constructor(auth) {
        this.auth = auth;
        this.cachedEventUids = new Set();
        this.consumers = new Set();
        this.queuedRedirectEvent = null;
        this.hasHandledPotentialRedirect = false;
        this.lastProcessedEventTime = Date.now();
    }
    registerConsumer(authEventConsumer) {
        this.consumers.add(authEventConsumer);
        if (this.queuedRedirectEvent &&
            this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
            this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
            this.saveEventToCache(this.queuedRedirectEvent);
            this.queuedRedirectEvent = null;
        }
    }
    unregisterConsumer(authEventConsumer) {
        this.consumers.delete(authEventConsumer);
    }
    onEvent(event) {
        // Check if the event has already been handled
        if (this.hasEventBeenHandled(event)) {
            return false;
        }
        let handled = false;
        this.consumers.forEach(consumer => {
            if (this.isEventForConsumer(event, consumer)) {
                handled = true;
                this.sendToConsumer(event, consumer);
                this.saveEventToCache(event);
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
    }
    sendToConsumer(event, consumer) {
        var _a;
        if (event.error && !isNullRedirectEvent(event)) {
            const code = ((_a = event.error.code) === null || _a === void 0 ? void 0 : _a.split('auth/')[1]) ||
                "internal-error" /* AuthErrorCode.INTERNAL_ERROR */;
            consumer.onError(_createError(this.auth, code));
        }
        else {
            consumer.onAuthEvent(event);
        }
    }
    isEventForConsumer(event, consumer) {
        const eventIdMatches = consumer.eventId === null ||
            (!!event.eventId && event.eventId === consumer.eventId);
        return consumer.filter.includes(event.type) && eventIdMatches;
    }
    hasEventBeenHandled(event) {
        if (Date.now() - this.lastProcessedEventTime >=
            EVENT_DUPLICATION_CACHE_DURATION_MS) {
            this.cachedEventUids.clear();
        }
        return this.cachedEventUids.has(eventUid(event));
    }
    saveEventToCache(event) {
        this.cachedEventUids.add(eventUid(event));
        this.lastProcessedEventTime = Date.now();
    }
}
function eventUid(e) {
    return [e.type, e.eventId, e.sessionId, e.tenantId].filter(v => v).join('-');
}
function isNullRedirectEvent({ type, error }) {
    return (type === "unknown" /* AuthEventType.UNKNOWN */ &&
        (error === null || error === void 0 ? void 0 : error.code) === `auth/${"no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */}`);
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
    const ua = getUA();
    return _isSafari(ua) || _isIOS(ua);
}
// The polling period in case events are not supported
const _POLLING_INTERVAL_MS = 1000;
// The IE 10 localStorage cross tab synchronization delay in milliseconds
const IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
class BrowserLocalPersistence extends BrowserPersistenceClass {
    constructor() {
        super(() => window.localStorage, "LOCAL" /* PersistenceType.LOCAL */);
        this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
        this.listeners = {};
        this.localCache = {};
        // setTimeout return value is platform specific
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.pollTimer = null;
        // Safari or iOS browser and embedded in an iframe.
        this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && _isIframe();
        // Whether to use polling instead of depending on window events
        this.fallbackToPolling = _isMobileBrowser();
        this._shouldAllowMigration = true;
    }
    forAllChangedKeys(cb) {
        // Check all keys with listeners on them.
        for (const key of Object.keys(this.listeners)) {
            // Get value from localStorage.
            const newValue = this.storage.getItem(key);
            const oldValue = this.localCache[key];
            // If local map value does not match, trigger listener with storage event.
            // Differentiate this simulated event from the real storage event.
            if (newValue !== oldValue) {
                cb(key, oldValue, newValue);
            }
        }
    }
    onStorageEvent(event, poll = false) {
        // Key would be null in some situations, like when localStorage is cleared
        if (!event.key) {
            this.forAllChangedKeys((key, _oldValue, newValue) => {
                this.notifyListeners(key, newValue);
            });
            return;
        }
        const key = event.key;
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
            const storedValue = this.storage.getItem(key);
            // Value not synchronized, synchronize manually.
            if (event.newValue !== storedValue) {
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
        const triggerListeners = () => {
            // Keep local map up to date in case storage event is triggered before
            // poll.
            const storedValue = this.storage.getItem(key);
            if (!poll && this.localCache[key] === storedValue) {
                // Real storage event which has already been detected, do nothing.
                // This seems to trigger in some IE browsers for some reason.
                return;
            }
            this.notifyListeners(key, storedValue);
        };
        const storedValue = this.storage.getItem(key);
        if (_isIE10() &&
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
    }
    notifyListeners(key, value) {
        this.localCache[key] = value;
        const listeners = this.listeners[key];
        if (listeners) {
            for (const listener of Array.from(listeners)) {
                listener(value ? JSON.parse(value) : value);
            }
        }
    }
    startPolling() {
        this.stopPolling();
        this.pollTimer = setInterval(() => {
            this.forAllChangedKeys((key, oldValue, newValue) => {
                this.onStorageEvent(new StorageEvent('storage', {
                    key,
                    oldValue,
                    newValue
                }), 
                /* poll */ true);
            });
        }, _POLLING_INTERVAL_MS);
    }
    stopPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }
    attachListener() {
        window.addEventListener('storage', this.boundEventHandler);
    }
    detachListener() {
        window.removeEventListener('storage', this.boundEventHandler);
    }
    _addListener(key, listener) {
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
    }
    _removeListener(key, listener) {
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
    }
    // Update local cache on base operations:
    async _set(key, value) {
        await super._set(key, value);
        this.localCache[key] = JSON.stringify(value);
    }
    async _get(key) {
        const value = await super._get(key);
        this.localCache[key] = JSON.stringify(value);
        return value;
    }
    async _remove(key) {
        await super._remove(key);
        delete this.localCache[key];
    }
}
BrowserLocalPersistence.type = 'LOCAL';
/**
 * An implementation of {@link Persistence} of type `LOCAL` using `localStorage`
 * for the underlying storage.
 *
 * @public
 */
const browserLocalPersistence = BrowserLocalPersistence;

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
const SESSION_ID_LENGTH = 20;
/** Custom AuthEventManager that adds passive listeners to events */
class CordovaAuthEventManager extends AuthEventManager {
    constructor() {
        super(...arguments);
        this.passiveListeners = new Set();
        this.initPromise = new Promise(resolve => {
            this.resolveInialized = resolve;
        });
    }
    addPassiveListener(cb) {
        this.passiveListeners.add(cb);
    }
    removePassiveListener(cb) {
        this.passiveListeners.delete(cb);
    }
    // In a Cordova environment, this manager can live through multiple redirect
    // operations
    resetRedirect() {
        this.queuedRedirectEvent = null;
        this.hasHandledPotentialRedirect = false;
    }
    /** Override the onEvent method */
    onEvent(event) {
        this.resolveInialized();
        this.passiveListeners.forEach(cb => cb(event));
        return super.onEvent(event);
    }
    async initialized() {
        await this.initPromise;
    }
}
/**
 * Generates a (partial) {@link AuthEvent}.
 */
function _generateNewEvent(auth, type, eventId = null) {
    return {
        type,
        eventId,
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
async function _getAndRemoveEvent(auth) {
    const event = (await storage()._get(persistenceKey(auth)));
    if (event) {
        await storage()._remove(persistenceKey(auth));
    }
    return event;
}
function _eventFromPartialAndUrl(partialEvent, url) {
    var _a, _b;
    // Parse the deep link within the dynamic link URL.
    const callbackUrl = _getDeepLinkFromCallback(url);
    // Confirm it is actually a callback URL.
    // Currently the universal link will be of this format:
    // https://<AUTH_DOMAIN>/__/auth/callback<OAUTH_RESPONSE>
    // This is a fake URL but is not intended to take the user anywhere
    // and just redirect to the app.
    if (callbackUrl.includes('/__/auth/callback')) {
        // Check if there is an error in the URL.
        // This mechanism is also used to pass errors back to the app:
        // https://<AUTH_DOMAIN>/__/auth/callback?firebaseError=<STRINGIFIED_ERROR>
        const params = searchParamsOrEmpty(callbackUrl);
        // Get the error object corresponding to the stringified error if found.
        const errorObject = params['firebaseError']
            ? parseJsonOrNull(decodeURIComponent(params['firebaseError']))
            : null;
        const code = (_b = (_a = errorObject === null || errorObject === void 0 ? void 0 : errorObject['code']) === null || _a === void 0 ? void 0 : _a.split('auth/')) === null || _b === void 0 ? void 0 : _b[1];
        const error = code ? _createError(code) : null;
        if (error) {
            return {
                type: partialEvent.type,
                eventId: partialEvent.eventId,
                tenantId: partialEvent.tenantId,
                error,
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
    const chars = [];
    const allowedChars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < SESSION_ID_LENGTH; i++) {
        const idx = Math.floor(Math.random() * allowedChars.length);
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
    const params = searchParamsOrEmpty(url);
    const link = params['link'] ? decodeURIComponent(params['link']) : undefined;
    // Double link case (automatic redirect)
    const doubleDeepLink = searchParamsOrEmpty(link)['link'];
    // iOS custom scheme links.
    const iOSDeepLink = params['deep_link_id']
        ? decodeURIComponent(params['deep_link_id'])
        : undefined;
    const iOSDoubleDeepLink = searchParamsOrEmpty(iOSDeepLink)['link'];
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
    const [_, ...rest] = url.split('?');
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
const INITIAL_EVENT_TIMEOUT_MS = 500;
class CordovaPopupRedirectResolver {
    constructor() {
        this._redirectPersistence = browserSessionPersistence;
        this._shouldInitProactively = true; // This is lightweight for Cordova
        this.eventManagers = new Map();
        this.originValidationPromises = {};
        this._completeRedirectFn = _getRedirectResult;
        this._overrideRedirectResult = _overrideRedirectResult;
    }
    async _initialize(auth) {
        const key = auth._key();
        let manager = this.eventManagers.get(key);
        if (!manager) {
            manager = new CordovaAuthEventManager(auth);
            this.eventManagers.set(key, manager);
            this.attachCallbackListeners(auth, manager);
        }
        return manager;
    }
    _openPopup(auth) {
        _fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    }
    async _openRedirect(auth, provider, authType, eventId) {
        _checkCordovaConfiguration(auth);
        const manager = await this._initialize(auth);
        await manager.initialized();
        // Reset the persisted redirect states. This does not matter on Web where
        // the redirect always blows away application state entirely. On Cordova,
        // the app maintains control flow through the redirect.
        manager.resetRedirect();
        _clearRedirectOutcomes();
        await this._originValidation(auth);
        const event = _generateNewEvent(auth, authType, eventId);
        await _savePartialEvent(auth, event);
        const url = await _generateHandlerUrl(auth, event, provider);
        const iabRef = await _performRedirect(url);
        return _waitForAppResume(auth, manager, iabRef);
    }
    _isIframeWebStorageSupported(_auth, _cb) {
        throw new Error('Method not implemented.');
    }
    _originValidation(auth) {
        const key = auth._key();
        if (!this.originValidationPromises[key]) {
            this.originValidationPromises[key] = _validateOrigin(auth);
        }
        return this.originValidationPromises[key];
    }
    attachCallbackListeners(auth, manager) {
        // Get the global plugins
        const { universalLinks, handleOpenURL, BuildInfo } = _cordovaWindow();
        const noEventTimeout = setTimeout(async () => {
            // We didn't see that initial event. Clear any pending object and
            // dispatch no event
            await _getAndRemoveEvent(auth);
            manager.onEvent(generateNoEvent());
        }, INITIAL_EVENT_TIMEOUT_MS);
        const universalLinksCb = async (eventData) => {
            // We have an event so we can clear the no event timeout
            clearTimeout(noEventTimeout);
            const partialEvent = await _getAndRemoveEvent(auth);
            let finalEvent = null;
            if (partialEvent && (eventData === null || eventData === void 0 ? void 0 : eventData['url'])) {
                finalEvent = _eventFromPartialAndUrl(partialEvent, eventData['url']);
            }
            // If finalEvent is never filled, trigger with no event
            manager.onEvent(finalEvent || generateNoEvent());
        };
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
        const existingHandleOpenURL = handleOpenURL;
        const packagePrefix = `${BuildInfo.packageName.toLowerCase()}://`;
        _cordovaWindow().handleOpenURL = async (url) => {
            if (url.toLowerCase().startsWith(packagePrefix)) {
                // We want this intentionally to float
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                universalLinksCb({ url });
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
        };
    }
}
/**
 * An implementation of {@link PopupRedirectResolver} suitable for Cordova
 * based applications.
 *
 * @public
 */
const cordovaPopupRedirectResolver = CordovaPopupRedirectResolver;
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

export { AuthPopup, _generateEventId, _getRedirectResult, _overrideRedirectResult, addFrameworkForLogging, cordovaPopupRedirectResolver };
//# sourceMappingURL=internal.js.map
