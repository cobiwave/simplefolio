import { getApp, _getProvider } from '@firebase/app';
import { _ as _signInWithRedirect, a as _reauthenticateWithRedirect, b as _linkWithRedirect, r as registerAuth, i as initializeAuth, c as indexedDBLocalPersistence, d as cordovaPopupRedirectResolver } from './popup_redirect-106f885f.js';
export { A as ActionCodeOperation, a6 as ActionCodeURL, y as AuthCredential, w as AuthErrorCodes, E as EmailAuthCredential, D as EmailAuthProvider, G as FacebookAuthProvider, F as FactorId, I as GithubAuthProvider, H as GoogleAuthProvider, z as OAuthCredential, J as OAuthProvider, O as OperationType, B as PhoneAuthCredential, P as ProviderId, K as SAMLAuthProvider, S as SignInMethod, T as TwitterAuthProvider, W as applyActionCode, j as beforeAuthStateChanged, e as browserLocalPersistence, f as browserSessionPersistence, X as checkActionCode, V as confirmPasswordReset, x as connectAuthEmulator, d as cordovaPopupRedirectResolver, Z as createUserWithEmailAndPassword, q as debugErrorMap, p as deleteUser, a3 as fetchSignInMethodsForEmail, ae as getAdditionalUserInfo, ab as getIdToken, ac as getIdTokenResult, ag as getMultiFactorResolver, g as getRedirectResult, C as inMemoryPersistence, c as indexedDBLocalPersistence, i as initializeAuth, h as initializeRecaptchaConfig, a1 as isSignInWithEmailLink, N as linkWithCredential, ah as multiFactor, k as onAuthStateChanged, o as onIdTokenChanged, a7 as parseActionCodeURL, t as prodErrorMap, Q as reauthenticateWithCredential, af as reload, n as revokeAccessToken, a4 as sendEmailVerification, U as sendPasswordResetEmail, a0 as sendSignInLinkToEmail, s as setPersistence, L as signInAnonymously, M as signInWithCredential, R as signInWithCustomToken, $ as signInWithEmailAndPassword, a2 as signInWithEmailLink, m as signOut, ad as unlink, l as updateCurrentUser, a9 as updateEmail, aa as updatePassword, a8 as updateProfile, u as useDeviceLanguage, v as validatePassword, a5 as verifyBeforeUpdateEmail, Y as verifyPasswordResetCode } from './popup_redirect-106f885f.js';
import 'tslib';
import '@firebase/util';
import '@firebase/component';
import '@firebase/logger';

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
function signInWithRedirect(auth, provider, resolver) {
    return _signInWithRedirect(auth, provider, resolver);
}
function reauthenticateWithRedirect(user, provider, resolver) {
    return _reauthenticateWithRedirect(user, provider, resolver);
}
function linkWithRedirect(user, provider, resolver) {
    return _linkWithRedirect(user, provider, resolver);
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
function getAuth(app) {
    if (app === void 0) { app = getApp(); }
    var provider = _getProvider(app, 'auth');
    if (provider.isInitialized()) {
        return provider.getImmediate();
    }
    return initializeAuth(app, {
        persistence: indexedDBLocalPersistence,
        popupRedirectResolver: cordovaPopupRedirectResolver
    });
}
registerAuth("Cordova" /* ClientPlatform.CORDOVA */);

export { getAuth, linkWithRedirect, reauthenticateWithRedirect, signInWithRedirect };
//# sourceMappingURL=index.js.map
