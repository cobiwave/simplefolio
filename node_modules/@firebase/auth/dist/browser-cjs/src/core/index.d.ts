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
import { Auth, NextOrObserver, Persistence, User, CompleteFn, ErrorFn, Unsubscribe, PasswordValidationStatus } from '../model/public_types';
export { debugErrorMap, prodErrorMap, AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY as AuthErrorCodes } from './errors';
/**
 * Changes the type of persistence on the {@link Auth} instance for the currently saved
 * `Auth` session and applies this type of persistence for future sign-in requests, including
 * sign-in with redirect requests.
 *
 * @remarks
 * This makes it easy for a user signing in to specify whether their session should be
 * remembered or not. It also makes it easier to never persist the `Auth` state for applications
 * that are shared by other users or have sensitive data.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * setPersistence(auth, browserSessionPersistence);
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param persistence - The {@link Persistence} to use.
 * @returns A `Promise` that resolves once the persistence change has completed
 *
 * @public
 */
export declare function setPersistence(auth: Auth, persistence: Persistence): Promise<void>;
/**
 * Loads the reCAPTCHA configuration into the `Auth` instance.
 *
 * @remarks
 * This will load the reCAPTCHA config, which indicates whether the reCAPTCHA
 * verification flow should be triggered for each auth provider, into the
 * current Auth session.
 *
 * If initializeRecaptchaConfig() is not invoked, the auth flow will always start
 * without reCAPTCHA verification. If the provider is configured to require reCAPTCHA
 * verification, the SDK will transparently load the reCAPTCHA config and restart the
 * auth flows.
 *
 * Thus, by calling this optional method, you will reduce the latency of future auth flows.
 * Loading the reCAPTCHA config early will also enhance the signal collected by reCAPTCHA.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * initializeRecaptchaConfig(auth);
 * ```
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
export declare function initializeRecaptchaConfig(auth: Auth): Promise<void>;
/**
 * Validates the password against the password policy configured for the project or tenant.
 *
 * @remarks
 * If no tenant ID is set on the `Auth` instance, then this method will use the password
 * policy configured for the project. Otherwise, this method will use the policy configured
 * for the tenant. If a password policy has not been configured, then the default policy
 * configured for all projects will be used.
 *
 * If an auth flow fails because a submitted password does not meet the password policy
 * requirements and this method has previously been called, then this method will use the
 * most recent policy available when called again.
 *
 * @example
 * ```javascript
 * validatePassword(auth, 'some-password');
 * ```
 *
 * @param auth The {@link Auth} instance.
 * @param password The password to validate.
 *
 * @public
 */
export declare function validatePassword(auth: Auth, password: string): Promise<PasswordValidationStatus>;
/**
 * Adds an observer for changes to the signed-in user's ID token.
 *
 * @remarks
 * This includes sign-in, sign-out, and token refresh events.
 * This will not be triggered automatically upon ID token expiration. Use {@link User.getIdToken} to refresh the ID token.
 *
 * @param auth - The {@link Auth} instance.
 * @param nextOrObserver - callback triggered on change.
 * @param error - Deprecated. This callback is never triggered. Errors
 * on signing in/out can be caught in promises returned from
 * sign-in/sign-out functions.
 * @param completed - Deprecated. This callback is never triggered.
 *
 * @public
 */
export declare function onIdTokenChanged(auth: Auth, nextOrObserver: NextOrObserver<User>, error?: ErrorFn, completed?: CompleteFn): Unsubscribe;
/**
 * Adds a blocking callback that runs before an auth state change
 * sets a new user.
 *
 * @param auth - The {@link Auth} instance.
 * @param callback - callback triggered before new user value is set.
 *   If this throws, it blocks the user from being set.
 * @param onAbort - callback triggered if a later `beforeAuthStateChanged()`
 *   callback throws, allowing you to undo any side effects.
 */
export declare function beforeAuthStateChanged(auth: Auth, callback: (user: User | null) => void | Promise<void>, onAbort?: () => void): Unsubscribe;
/**
 * Adds an observer for changes to the user's sign-in state.
 *
 * @remarks
 * To keep the old behavior, see {@link onIdTokenChanged}.
 *
 * @param auth - The {@link Auth} instance.
 * @param nextOrObserver - callback triggered on change.
 * @param error - Deprecated. This callback is never triggered. Errors
 * on signing in/out can be caught in promises returned from
 * sign-in/sign-out functions.
 * @param completed - Deprecated. This callback is never triggered.
 *
 * @public
 */
export declare function onAuthStateChanged(auth: Auth, nextOrObserver: NextOrObserver<User>, error?: ErrorFn, completed?: CompleteFn): Unsubscribe;
/**
 * Sets the current language to the default device/browser preference.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
export declare function useDeviceLanguage(auth: Auth): void;
/**
 * Asynchronously sets the provided user as {@link Auth.currentUser} on the
 * {@link Auth} instance.
 *
 * @remarks
 * A new instance copy of the user provided will be made and set as currentUser.
 *
 * This will trigger {@link onAuthStateChanged} and {@link onIdTokenChanged} listeners
 * like other sign in methods.
 *
 * The operation fails with an error if the user to be updated belongs to a different Firebase
 * project.
 *
 * @param auth - The {@link Auth} instance.
 * @param user - The new {@link User}.
 *
 * @public
 */
export declare function updateCurrentUser(auth: Auth, user: User | null): Promise<void>;
/**
 * Signs out the current user.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
export declare function signOut(auth: Auth): Promise<void>;
/**
 * Revokes the given access token. Currently only supports Apple OAuth access tokens.
 *
 * @param auth - The {@link Auth} instance.
 * @param token - The Apple OAuth access token.
 *
 * @public
 */
export declare function revokeAccessToken(auth: Auth, token: string): Promise<void>;
export { initializeAuth } from './auth/initialize';
export { connectAuthEmulator } from './auth/emulator';
export { AuthCredential } from './credentials';
export { EmailAuthCredential } from './credentials/email';
export { OAuthCredential } from './credentials/oauth';
export { PhoneAuthCredential } from './credentials/phone';
export { inMemoryPersistence } from './persistence/in_memory';
export { EmailAuthProvider } from './providers/email';
export { FacebookAuthProvider } from './providers/facebook';
export { CustomParameters } from './providers/federated';
export { GoogleAuthProvider } from './providers/google';
export { GithubAuthProvider } from './providers/github';
export { OAuthProvider, OAuthCredentialOptions } from './providers/oauth';
export { SAMLAuthProvider } from './providers/saml';
export { TwitterAuthProvider } from './providers/twitter';
export { signInAnonymously } from './strategies/anonymous';
export { signInWithCredential, linkWithCredential, reauthenticateWithCredential } from './strategies/credential';
export { signInWithCustomToken } from './strategies/custom_token';
export { sendPasswordResetEmail, confirmPasswordReset, applyActionCode, checkActionCode, verifyPasswordResetCode, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './strategies/email_and_password';
export { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from './strategies/email_link';
export { fetchSignInMethodsForEmail, sendEmailVerification, verifyBeforeUpdateEmail } from './strategies/email';
export { ActionCodeURL, parseActionCodeURL } from './action_code_url';
export { updateProfile, updateEmail, updatePassword } from './user/account_info';
export { getIdToken, getIdTokenResult } from './user/id_token_result';
export { unlink } from './user/link_unlink';
export { getAdditionalUserInfo } from './user/additional_user_info';
export { reload } from './user/reload';
/**
 * Deletes and signs out the user.
 *
 * @remarks
 * Important: this is a security-sensitive operation that requires the user to have recently
 * signed in. If this requirement isn't met, ask the user to authenticate again and then call
 * {@link reauthenticateWithCredential}.
 *
 * @param user - The user.
 *
 * @public
 */
export declare function deleteUser(user: User): Promise<void>;
