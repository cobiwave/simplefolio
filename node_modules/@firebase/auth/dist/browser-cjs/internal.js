'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('./index-21814063.js');
var util = require('@firebase/util');
require('@firebase/app');
require('@firebase/logger');
require('tslib');
require('@firebase/component');

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
const REDIRECT_TIMEOUT_MS = 2000;
/**
 * Generates the URL for the OAuth handler.
 */
async function _generateHandlerUrl(auth, event, provider) {
    var _a;
    // Get the cordova plugins
    const { BuildInfo } = _cordovaWindow();
    index.debugAssert(event.sessionId, 'AuthEvent did not contain a session ID');
    const sessionDigest = await computeSha256(event.sessionId);
    const additionalParams = {};
    if (index._isIOS()) {
        // iOS app identifier
        additionalParams['ibi'] = BuildInfo.packageName;
    }
    else if (index._isAndroid()) {
        // Android app identifier
        additionalParams['apn'] = BuildInfo.packageName;
    }
    else {
        index._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    }
    // Add the display name if available
    if (BuildInfo.displayName) {
        additionalParams['appDisplayName'] = BuildInfo.displayName;
    }
    // Attached the hashed session ID
    additionalParams['sessionId'] = sessionDigest;
    return index._getRedirectUrl(auth, provider, event.type, undefined, (_a = event.eventId) !== null && _a !== void 0 ? _a : undefined, additionalParams);
}
/**
 * Validates that this app is valid for this project configuration
 */
async function _validateOrigin(auth) {
    const { BuildInfo } = _cordovaWindow();
    const request = {};
    if (index._isIOS()) {
        request.iosBundleId = BuildInfo.packageName;
    }
    else if (index._isAndroid()) {
        request.androidPackageName = BuildInfo.packageName;
    }
    else {
        index._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    }
    // Will fail automatically if package name is not authorized
    await index._getProjectConfig(auth, request);
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
                iabRef = cordova.InAppBrowser.open(handlerUrl, index._isIOS7Or8() ? '_blank' : '_system', 'location=yes');
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
                    reject(index._createError(auth, "redirect-cancelled-by-user" /* AuthErrorCode.REDIRECT_CANCELLED_BY_USER */));
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
            if (index._isAndroid()) {
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
    index._assert(typeof ((_a = win === null || win === void 0 ? void 0 : win.universalLinks) === null || _a === void 0 ? void 0 : _a.subscribe) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-universal-links-plugin-fix'
    });
    // https://www.npmjs.com/package/cordova-plugin-buildinfo
    index._assert(typeof ((_b = win === null || win === void 0 ? void 0 : win.BuildInfo) === null || _b === void 0 ? void 0 : _b.packageName) !== 'undefined', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-buildInfo'
    });
    // https://github.com/google/cordova-plugin-browsertab
    index._assert(typeof ((_e = (_d = (_c = win === null || win === void 0 ? void 0 : win.cordova) === null || _c === void 0 ? void 0 : _c.plugins) === null || _d === void 0 ? void 0 : _d.browsertab) === null || _e === void 0 ? void 0 : _e.openUrl) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    index._assert(typeof ((_h = (_g = (_f = win === null || win === void 0 ? void 0 : win.cordova) === null || _f === void 0 ? void 0 : _f.plugins) === null || _g === void 0 ? void 0 : _g.browsertab) === null || _h === void 0 ? void 0 : _h.isAvailable) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
    index._assert(typeof ((_k = (_j = win === null || win === void 0 ? void 0 : win.cordova) === null || _j === void 0 ? void 0 : _j.InAppBrowser) === null || _k === void 0 ? void 0 : _k.open) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
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
    index.debugAssert(/[0-9a-zA-Z]+/.test(str), 'Can only convert alpha-numeric strings');
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
const SESSION_ID_LENGTH = 20;
/** Custom AuthEventManager that adds passive listeners to events */
class CordovaAuthEventManager extends index.AuthEventManager {
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
        error: index._createError(auth, "no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
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
        const error = code ? index._createError(code) : null;
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
    return index._getInstance(index.browserLocalPersistence);
}
function persistenceKey(auth) {
    return index._persistenceKeyName("authEvent" /* KeyName.AUTH_EVENT */, auth.config.apiKey, auth.name);
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
const INITIAL_EVENT_TIMEOUT_MS = 500;
class CordovaPopupRedirectResolver {
    constructor() {
        this._redirectPersistence = index.browserSessionPersistence;
        this._shouldInitProactively = true; // This is lightweight for Cordova
        this.eventManagers = new Map();
        this.originValidationPromises = {};
        this._completeRedirectFn = index._getRedirectResult;
        this._overrideRedirectResult = index._overrideRedirectResult;
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
        index._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    }
    async _openRedirect(auth, provider, authType, eventId) {
        _checkCordovaConfiguration(auth);
        const manager = await this._initialize(auth);
        await manager.initialized();
        // Reset the persisted redirect states. This does not matter on Web where
        // the redirect always blows away application state entirely. On Cordova,
        // the app maintains control flow through the redirect.
        manager.resetRedirect();
        index._clearRedirectOutcomes();
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
        error: index._createError("no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
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
    index._castAuth(auth)._logFramework(framework);
}

exports.ActionCodeOperation = index.ActionCodeOperation;
exports.ActionCodeURL = index.ActionCodeURL;
exports.AuthCredential = index.AuthCredential;
exports.AuthErrorCodes = index.AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY;
exports.AuthImpl = index.AuthImpl;
exports.AuthPopup = index.AuthPopup;
exports.EmailAuthCredential = index.EmailAuthCredential;
exports.EmailAuthProvider = index.EmailAuthProvider;
exports.FacebookAuthProvider = index.FacebookAuthProvider;
exports.FactorId = index.FactorId;
exports.FetchProvider = index.FetchProvider;
exports.GithubAuthProvider = index.GithubAuthProvider;
exports.GoogleAuthProvider = index.GoogleAuthProvider;
exports.OAuthCredential = index.OAuthCredential;
exports.OAuthProvider = index.OAuthProvider;
exports.OperationType = index.OperationType;
exports.PhoneAuthCredential = index.PhoneAuthCredential;
exports.PhoneAuthProvider = index.PhoneAuthProvider;
exports.PhoneMultiFactorGenerator = index.PhoneMultiFactorGenerator;
exports.ProviderId = index.ProviderId;
exports.RecaptchaVerifier = index.RecaptchaVerifier;
exports.SAMLAuthCredential = index.SAMLAuthCredential;
exports.SAMLAuthProvider = index.SAMLAuthProvider;
exports.SignInMethod = index.SignInMethod;
exports.TotpMultiFactorGenerator = index.TotpMultiFactorGenerator;
exports.TotpSecret = index.TotpSecret;
exports.TwitterAuthProvider = index.TwitterAuthProvider;
exports.UserImpl = index.UserImpl;
exports._assert = index._assert;
exports._castAuth = index._castAuth;
exports._fail = index._fail;
exports._generateEventId = index._generateEventId;
exports._getClientVersion = index._getClientVersion;
exports._getInstance = index._getInstance;
exports._getRedirectResult = index._getRedirectResult;
exports._overrideRedirectResult = index._overrideRedirectResult;
exports._persistenceKeyName = index._persistenceKeyName;
exports.applyActionCode = index.applyActionCode;
exports.beforeAuthStateChanged = index.beforeAuthStateChanged;
exports.browserLocalPersistence = index.browserLocalPersistence;
exports.browserPopupRedirectResolver = index.browserPopupRedirectResolver;
exports.browserSessionPersistence = index.browserSessionPersistence;
exports.checkActionCode = index.checkActionCode;
exports.confirmPasswordReset = index.confirmPasswordReset;
exports.connectAuthEmulator = index.connectAuthEmulator;
exports.createUserWithEmailAndPassword = index.createUserWithEmailAndPassword;
exports.debugErrorMap = index.debugErrorMap;
exports.deleteUser = index.deleteUser;
exports.fetchSignInMethodsForEmail = index.fetchSignInMethodsForEmail;
exports.getAdditionalUserInfo = index.getAdditionalUserInfo;
exports.getAuth = index.getAuth;
exports.getIdToken = index.getIdToken;
exports.getIdTokenResult = index.getIdTokenResult;
exports.getMultiFactorResolver = index.getMultiFactorResolver;
exports.getRedirectResult = index.getRedirectResult;
exports.inMemoryPersistence = index.inMemoryPersistence;
exports.indexedDBLocalPersistence = index.indexedDBLocalPersistence;
exports.initializeAuth = index.initializeAuth;
exports.initializeRecaptchaConfig = index.initializeRecaptchaConfig;
exports.isSignInWithEmailLink = index.isSignInWithEmailLink;
exports.linkWithCredential = index.linkWithCredential;
exports.linkWithPhoneNumber = index.linkWithPhoneNumber;
exports.linkWithPopup = index.linkWithPopup;
exports.linkWithRedirect = index.linkWithRedirect;
exports.multiFactor = index.multiFactor;
exports.onAuthStateChanged = index.onAuthStateChanged;
exports.onIdTokenChanged = index.onIdTokenChanged;
exports.parseActionCodeURL = index.parseActionCodeURL;
exports.prodErrorMap = index.prodErrorMap;
exports.reauthenticateWithCredential = index.reauthenticateWithCredential;
exports.reauthenticateWithPhoneNumber = index.reauthenticateWithPhoneNumber;
exports.reauthenticateWithPopup = index.reauthenticateWithPopup;
exports.reauthenticateWithRedirect = index.reauthenticateWithRedirect;
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
exports.signInWithPopup = index.signInWithPopup;
exports.signInWithRedirect = index.signInWithRedirect;
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
exports.addFrameworkForLogging = addFrameworkForLogging;
exports.cordovaPopupRedirectResolver = cordovaPopupRedirectResolver;
//# sourceMappingURL=internal.js.map
