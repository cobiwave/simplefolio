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
import * as types from '@firebase/auth-types';
declare module '@firebase/component' {
    interface NameServiceMapping {
        'auth-compat': types.FirebaseAuth;
    }
}
declare module '@firebase/app-compat' {
    interface FirebaseNamespace {
        auth: {
            (app?: FirebaseApp): types.FirebaseAuth;
            Auth: typeof types.FirebaseAuth;
            EmailAuthProvider: typeof types.EmailAuthProvider;
            EmailAuthProvider_Instance: typeof types.EmailAuthProvider_Instance;
            FacebookAuthProvider: typeof types.FacebookAuthProvider;
            FacebookAuthProvider_Instance: typeof types.FacebookAuthProvider_Instance;
            GithubAuthProvider: typeof types.GithubAuthProvider;
            GithubAuthProvider_Instance: typeof types.GithubAuthProvider_Instance;
            GoogleAuthProvider: typeof types.GoogleAuthProvider;
            GoogleAuthProvider_Instance: typeof types.GoogleAuthProvider_Instance;
            OAuthProvider: typeof types.OAuthProvider;
            SAMLAuthProvider: typeof types.SAMLAuthProvider;
            PhoneAuthProvider: typeof types.PhoneAuthProvider;
            PhoneAuthProvider_Instance: typeof types.PhoneAuthProvider_Instance;
            PhoneMultiFactorGenerator: typeof types.PhoneMultiFactorGenerator;
            RecaptchaVerifier: typeof types.RecaptchaVerifier;
            RecaptchaVerifier_Instance: typeof types.RecaptchaVerifier_Instance;
            TwitterAuthProvider: typeof types.TwitterAuthProvider;
            TwitterAuthProvider_Instance: typeof types.TwitterAuthProvider_Instance;
        };
    }
    interface FirebaseApp {
        auth?(): types.FirebaseAuth;
    }
}

import { FirebaseApp as FirebaseAppCompat } from "@firebase/app-compat";
import { type User, type Unsubscribe, type ActionCodeInfo, type UserCredential, type Auth, type IdTokenResult, type MultiFactorError, type MultiFactorResolver, type PopupRedirectResolver, type Dependencies, type AuthCredential, type ApplicationVerifier, type ConfirmationResult, type AuthProvider, type MultiFactorUser, type NextOrObserver, type ErrorFn, type CompleteFn, type ActionCodeSettings, type Persistence, type PhoneAuthCredential, type PasswordValidationStatus } from "@firebase/auth";
declare module "@firebase/auth" {
    function applyActionCode(auth: types.FirebaseAuth, oobCode: string): Promise<void>;
    function beforeAuthStateChanged(auth: types.FirebaseAuth, callback: (user: User | null) => void | Promise<void>, onAbort?: () => void): Unsubscribe;
    function checkActionCode(auth: types.FirebaseAuth, oobCode: string): Promise<ActionCodeInfo>;
    function confirmPasswordReset(auth: types.FirebaseAuth, oobCode: string, newPassword: string): Promise<void>;
    function connectAuthEmulator(auth: types.FirebaseAuth, url: string, options?: {
        disableWarnings: boolean;
    }): void;
    function createUserWithEmailAndPassword(auth: types.FirebaseAuth, email: string, password: string): Promise<UserCredential>;
    function deleteUser(user: types.User): Promise<void>;
    function fetchSignInMethodsForEmail(auth: types.FirebaseAuth, email: string): Promise<string[]>;
    function getAuth(app?: FirebaseAppCompat): Auth;
    function getIdToken(user: types.User, forceRefresh?: boolean): Promise<string>;
    function getIdTokenResult(user: types.User, forceRefresh?: boolean): Promise<IdTokenResult>;
    function getMultiFactorResolver(auth: types.FirebaseAuth, error: MultiFactorError): MultiFactorResolver;
    function getRedirectResult(auth: types.FirebaseAuth, resolver?: PopupRedirectResolver): Promise<UserCredential | null>;
    function initializeAuth(app: FirebaseAppCompat, deps?: Dependencies): Auth;
    function initializeRecaptchaConfig(auth: types.FirebaseAuth): Promise<void>;
    function isSignInWithEmailLink(auth: types.FirebaseAuth, emailLink: string): boolean;
    function linkWithCredential(user: types.User, credential: AuthCredential): Promise<UserCredential>;
    function linkWithPhoneNumber(user: types.User, phoneNumber: string, appVerifier: ApplicationVerifier): Promise<ConfirmationResult>;
    function linkWithPopup(user: types.User, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<UserCredential>;
    function linkWithRedirect(user: types.User, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<never>;
    function multiFactor(user: types.User): MultiFactorUser;
    function onAuthStateChanged(auth: types.FirebaseAuth, nextOrObserver: NextOrObserver<User>, error?: ErrorFn, completed?: CompleteFn): Unsubscribe;
    function onIdTokenChanged(auth: types.FirebaseAuth, nextOrObserver: NextOrObserver<User>, error?: ErrorFn, completed?: CompleteFn): Unsubscribe;
    function reauthenticateWithCredential(user: types.User, credential: AuthCredential): Promise<UserCredential>;
    function reauthenticateWithPhoneNumber(user: types.User, phoneNumber: string, appVerifier: ApplicationVerifier): Promise<ConfirmationResult>;
    function reauthenticateWithPopup(user: types.User, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<UserCredential>;
    function reauthenticateWithRedirect(user: types.User, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<never>;
    function reload(user: types.User): Promise<void>;
    function revokeAccessToken(auth: types.FirebaseAuth, token: string): Promise<void>;
    function sendEmailVerification(user: types.User, actionCodeSettings?: ActionCodeSettings | null): Promise<void>;
    function sendPasswordResetEmail(auth: types.FirebaseAuth, email: string, actionCodeSettings?: ActionCodeSettings): Promise<void>;
    function sendSignInLinkToEmail(auth: types.FirebaseAuth, email: string, actionCodeSettings: ActionCodeSettings): Promise<void>;
    function setPersistence(auth: types.FirebaseAuth, persistence: Persistence): Promise<void>;
    function signInAnonymously(auth: types.FirebaseAuth): Promise<UserCredential>;
    function signInWithCredential(auth: types.FirebaseAuth, credential: AuthCredential): Promise<UserCredential>;
    function signInWithCustomToken(auth: types.FirebaseAuth, customToken: string): Promise<UserCredential>;
    function signInWithEmailAndPassword(auth: types.FirebaseAuth, email: string, password: string): Promise<UserCredential>;
    function signInWithEmailLink(auth: types.FirebaseAuth, email: string, emailLink?: string): Promise<UserCredential>;
    function signInWithPhoneNumber(auth: types.FirebaseAuth, phoneNumber: string, appVerifier: ApplicationVerifier): Promise<ConfirmationResult>;
    function signInWithPopup(auth: types.FirebaseAuth, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<UserCredential>;
    function signInWithRedirect(auth: types.FirebaseAuth, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<never>;
    function signOut(auth: types.FirebaseAuth): Promise<void>;
    function unlink(user: types.User, providerId: string): Promise<User>;
    function updateCurrentUser(auth: types.FirebaseAuth, user: User | null): Promise<void>;
    function updateEmail(user: types.User, newEmail: string): Promise<void>;
    function updatePassword(user: types.User, newPassword: string): Promise<void>;
    function updatePhoneNumber(user: types.User, credential: PhoneAuthCredential): Promise<void>;
    function updateProfile(user: types.User, { displayName, photoURL: photoUrl }: {
        displayName?: string | null;
        photoURL?: string | null;
    }): Promise<void>;
    function useDeviceLanguage(auth: types.FirebaseAuth): void;
    function validatePassword(auth: types.FirebaseAuth, password: string): Promise<PasswordValidationStatus>;
    function verifyBeforeUpdateEmail(user: types.User, newEmail: string, actionCodeSettings?: ActionCodeSettings | null): Promise<void>;
    function verifyPasswordResetCode(auth: types.FirebaseAuth, code: string): Promise<string>;
}
