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
/** Available in the browser. See static/anonymous.js */
export declare enum AnonFunction {
    SIGN_IN_ANONYMOUSLY = "anonymous.anonymousSignIn"
}
/** Available redirect functions. See static/redirect.js */
export declare enum RedirectFunction {
    IDP_REDIRECT = "redirect.idpRedirect",
    IDP_REAUTH_REDIRECT = "redirect.idpReauthRedirect",
    IDP_LINK_REDIRECT = "redirect.idpLinkRedirect",
    REDIRECT_RESULT = "redirect.redirectResult",
    GENERATE_CREDENTIAL_FROM_RESULT = "redirect.generateCredentialFromRedirectResultAndStore",
    SIGN_IN_WITH_REDIRECT_CREDENTIAL = "redirect.signInWithRedirectCredential",
    LINK_WITH_ERROR_CREDENTIAL = "redirect.linkWithErrorCredential",
    CREATE_FAKE_GOOGLE_USER = "redirect.createFakeGoogleUser",
    TRY_TO_SIGN_IN_UNVERIFIED = "redirect.tryToSignInUnverified"
}
/** Available popup functions. See static/popup.js */
export declare enum PopupFunction {
    IDP_POPUP = "popup.idpPopup",
    IDP_REAUTH_POPUP = "popup.idpReauthPopup",
    IDP_LINK_POPUP = "popup.idpLinkPopup",
    POPUP_RESULT = "popup.popupResult",
    GENERATE_CREDENTIAL_FROM_RESULT = "popup.generateCredentialFromResult",
    SIGN_IN_WITH_POPUP_CREDENTIAL = "popup.signInWithPopupCredential",
    LINK_WITH_ERROR_CREDENTIAL = "popup.linkWithErrorCredential",
    CREATE_FAKE_GOOGLE_USER = "popup.createFakeGoogleUser",
    TRY_TO_SIGN_IN_UNVERIFIED = "popup.tryToSignInUnverified"
}
/** Available email functions. See static/email.js */
export declare enum EmailFunction {
    CREATE_USER = "email.createUser"
}
/** Available core functions within the browser. See static/core.js */
export declare enum CoreFunction {
    RESET = "core.reset",
    AWAIT_AUTH_INIT = "core.authInit",
    USER_SNAPSHOT = "core.userSnap",
    AUTH_SNAPSHOT = "core.authSnap",
    SIGN_OUT = "core.signOut",
    AWAIT_LEGACY_AUTH_INIT = "core.legacyAuthInit",
    LEGACY_USER_SNAPSHOT = "core.legacyUserSnap"
}
/** Available persistence functions within the browser. See static/persistence.js */
export declare enum PersistenceFunction {
    CLEAR_PERSISTENCE = "persistence.clearPersistence",
    LOCAL_STORAGE_SNAP = "persistence.localStorageSnap",
    LOCAL_STORAGE_SET = "persistence.localStorageSet",
    SESSION_STORAGE_SNAP = "persistence.sessionStorageSnap",
    SESSION_STORAGE_SET = "persistence.sessionStorageSet",
    INDEXED_DB_SNAP = "persistence.indexedDBSnap",
    MAKE_INDEXED_DB_READONLY = "persistence.makeIndexedDBReadonly",
    SET_PERSISTENCE_MEMORY = "persistence.setPersistenceMemory",
    SET_PERSISTENCE_SESSION = "persistence.setPersistenceSession",
    SET_PERSISTENCE_INDEXED_DB = "persistence.setPersistenceIndexedDB",
    SET_PERSISTENCE_LOCAL_STORAGE = "persistence.setPersistenceLocalStorage"
}
export declare enum MiddlewareFunction {
    ATTACH_BLOCKING_MIDDLEWARE = "middleware.attachBlockingMiddleware",
    ATTACH_BLOCKING_MIDDLEWARE_ON_START = "middleware.attachBlockingMiddlewareOnStart"
}
/** Available firebase UI functions (only for compat tests) */
export declare enum UiFunction {
    LOAD = "ui.loadUiCode",
    START = "ui.startUi"
}
