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
import { FirebaseApp } from '@firebase/app';
import { CompleteFn, ErrorFn, FirebaseError, NextFn, Observer, Unsubscribe } from '@firebase/util';
import { FactorId as FactorIdMap, OperationType as OperationTypeMap, ActionCodeOperation as ActionCodeOperationMap } from './enum_maps';
export { CompleteFn, ErrorFn, NextFn, Unsubscribe };
/**
 * Interface representing the `Auth` config.
 *
 * @public
 */
export interface Config {
    /**
     * The API Key used to communicate with the Firebase Auth backend.
     */
    apiKey: string;
    /**
     * The host at which the Firebase Auth backend is running.
     */
    apiHost: string;
    /**
     * The scheme used to communicate with the Firebase Auth backend.
     */
    apiScheme: string;
    /**
     * The host at which the Secure Token API is running.
     */
    tokenApiHost: string;
    /**
     * The SDK Client Version.
     */
    sdkClientVersion: string;
    /**
     * The domain at which the web widgets are hosted (provided via Firebase Config).
     */
    authDomain?: string;
}
/**
 * Interface representing reCAPTCHA parameters.
 *
 * See the [reCAPTCHA docs](https://developers.google.com/recaptcha/docs/display#render_param)
 * for the list of accepted parameters. All parameters are accepted except for `sitekey`: Firebase Auth
 * provisions a reCAPTCHA for each project and will configure the site key upon rendering.
 *
 * For an invisible reCAPTCHA, set the `size` key to `invisible`.
 *
 * @public
 */
export interface RecaptchaParameters {
    [key: string]: any;
}
/**
 * Interface representing a parsed ID token.
 *
 * @privateRemarks TODO(avolkovi): consolidate with parsed_token in implementation.
 *
 * @public
 */
export interface ParsedToken {
    /** Expiration time of the token. */
    'exp'?: string;
    /** UID of the user. */
    'sub'?: string;
    /** Time at which authentication was performed. */
    'auth_time'?: string;
    /** Issuance time of the token. */
    'iat'?: string;
    /** Firebase specific claims, containing the provider(s) used to authenticate the user. */
    'firebase'?: {
        'sign_in_provider'?: string;
        'sign_in_second_factor'?: string;
        'identities'?: Record<string, string>;
    };
    /** Map of any additional custom claims. */
    [key: string]: unknown;
}
/**
 * Type definition for an event callback.
 *
 * @privateRemarks TODO(avolkovi): should we consolidate with Subscribe<T> since we're changing the API anyway?
 *
 * @public
 */
export declare type NextOrObserver<T> = NextFn<T | null> | Observer<T | null>;
/**
 * Interface for an `Auth` error.
 *
 * @public
 */
export interface AuthError extends FirebaseError {
    /** Details about the Firebase Auth error.  */
    readonly customData: {
        /** The name of the Firebase App which triggered this error.  */
        readonly appName: string;
        /** The email address of the user's account, used for sign-in and linking. */
        readonly email?: string;
        /** The phone number of the user's account, used for sign-in and linking. */
        readonly phoneNumber?: string;
        /**
         * The tenant ID being used for sign-in and linking.
         *
         * @remarks
         * If you use {@link signInWithRedirect} to sign in,
         * you have to set the tenant ID on the {@link Auth} instance again as the tenant ID is not persisted
         * after redirection.
         */
        readonly tenantId?: string;
    };
}
/**
 * Interface representing an {@link Auth} instance's settings.
 *
 * @remarks Currently used for enabling/disabling app verification for phone Auth testing.
 *
 * @public
 */
export interface AuthSettings {
    /**
     * When set, this property disables app verification for the purpose of testing phone
     * authentication. For this property to take effect, it needs to be set before rendering a
     * reCAPTCHA app verifier. When this is disabled, a mock reCAPTCHA is rendered instead. This is
     * useful for manual testing during development or for automated integration tests.
     *
     * In order to use this feature, you will need to
     * {@link https://firebase.google.com/docs/auth/web/phone-auth#test-with-whitelisted-phone-numbers | whitelist your phone number}
     * via the Firebase Console.
     *
     * The default value is false (app verification is enabled).
     */
    appVerificationDisabledForTesting: boolean;
}
/**
 * Interface representing Firebase Auth service.
 *
 * @remarks
 * See {@link https://firebase.google.com/docs/auth/ | Firebase Authentication} for a full guide
 * on how to use the Firebase Auth service.
 *
 * @public
 */
export interface Auth {
    /** The {@link @firebase/app#FirebaseApp} associated with the `Auth` service instance. */
    readonly app: FirebaseApp;
    /** The name of the app associated with the `Auth` service instance. */
    readonly name: string;
    /** The {@link Config} used to initialize this instance. */
    readonly config: Config;
    /**
     * Changes the type of persistence on the `Auth` instance.
     *
     * @remarks
     * This will affect the currently saved Auth session and applies this type of persistence for
     * future sign-in requests, including sign-in with redirect requests.
     *
     * This makes it easy for a user signing in to specify whether their session should be
     * remembered or not. It also makes it easier to never persist the Auth state for applications
     * that are shared by other users or have sensitive data.
     *
     * This method does not work in a Node.js environment.
     *
     * @example
     * ```javascript
     * auth.setPersistence(browserSessionPersistence);
     * ```
     *
     * @param persistence - The {@link Persistence} to use.
     */
    setPersistence(persistence: Persistence): Promise<void>;
    /**
     * The {@link Auth} instance's language code.
     *
     * @remarks
     * This is a readable/writable property. When set to null, the default Firebase Console language
     * setting is applied. The language code will propagate to email action templates (password
     * reset, email verification and email change revocation), SMS templates for phone authentication,
     * reCAPTCHA verifier and OAuth popup/redirect operations provided the specified providers support
     * localization with the language code specified.
     */
    languageCode: string | null;
    /**
     * The {@link Auth} instance's tenant ID.
     *
     * @remarks
     * This is a readable/writable property. When you set the tenant ID of an {@link Auth} instance, all
     * future sign-in/sign-up operations will pass this tenant ID and sign in or sign up users to
     * the specified tenant project. When set to null, users are signed in to the parent project.
     *
     * @example
     * ```javascript
     * // Set the tenant ID on Auth instance.
     * auth.tenantId = 'TENANT_PROJECT_ID';
     *
     * // All future sign-in request now include tenant ID.
     * const result = await signInWithEmailAndPassword(auth, email, password);
     * // result.user.tenantId should be 'TENANT_PROJECT_ID'.
     * ```
     *
     * @defaultValue null
     */
    tenantId: string | null;
    /**
     * The {@link Auth} instance's settings.
     *
     * @remarks
     * This is used to edit/read configuration related options such as app verification mode for
     * phone authentication.
     */
    readonly settings: AuthSettings;
    /**
     * Adds an observer for changes to the user's sign-in state.
     *
     * @remarks
     * To keep the old behavior, see {@link Auth.onIdTokenChanged}.
     *
     * @param nextOrObserver - callback triggered on change.
     * @param error - Deprecated. This callback is never triggered. Errors
     * on signing in/out can be caught in promises returned from
     * sign-in/sign-out functions.
     * @param completed - Deprecated. This callback is never triggered.
     */
    onAuthStateChanged(nextOrObserver: NextOrObserver<User | null>, error?: ErrorFn, completed?: CompleteFn): Unsubscribe;
    /**
     * Adds a blocking callback that runs before an auth state change
     * sets a new user.
     *
     * @param callback - callback triggered before new user value is set.
     *   If this throws, it blocks the user from being set.
     * @param onAbort - callback triggered if a later `beforeAuthStateChanged()`
     *   callback throws, allowing you to undo any side effects.
     */
    beforeAuthStateChanged(callback: (user: User | null) => void | Promise<void>, onAbort?: () => void): Unsubscribe;
    /**
     * Adds an observer for changes to the signed-in user's ID token.
     *
     * @remarks
     * This includes sign-in, sign-out, and token refresh events.
     *
     * @param nextOrObserver - callback triggered on change.
     * @param error - Deprecated. This callback is never triggered. Errors
     * on signing in/out can be caught in promises returned from
     * sign-in/sign-out functions.
     * @param completed - Deprecated. This callback is never triggered.
     */
    onIdTokenChanged(nextOrObserver: NextOrObserver<User | null>, error?: ErrorFn, completed?: CompleteFn): Unsubscribe;
    /**
     * returns a promise that resolves immediately when the initial
     * auth state is settled. When the promise resolves, the current user might be a valid user
     * or `null` if the user signed out.
     */
    authStateReady(): Promise<void>;
    /** The currently signed-in user (or null). */
    readonly currentUser: User | null;
    /** The current emulator configuration (or null). */
    readonly emulatorConfig: EmulatorConfig | null;
    /**
     * Asynchronously sets the provided user as {@link Auth.currentUser} on the {@link Auth} instance.
     *
     * @remarks
     * A new instance copy of the user provided will be made and set as currentUser.
     *
     * This will trigger {@link Auth.onAuthStateChanged} and {@link Auth.onIdTokenChanged} listeners
     * like other sign in methods.
     *
     * The operation fails with an error if the user to be updated belongs to a different Firebase
     * project.
     *
     * @param user - The new {@link User}.
     */
    updateCurrentUser(user: User | null): Promise<void>;
    /**
     * Sets the current language to the default device/browser preference.
     */
    useDeviceLanguage(): void;
    /**
     * Signs out the current user. This does not automatically revoke the user's ID token.
     */
    signOut(): Promise<void>;
}
/**
 * An interface covering the possible persistence mechanism types.
 *
 * @public
 */
export interface Persistence {
    /**
     * Type of Persistence.
     * - 'SESSION' is used for temporary persistence such as `sessionStorage`.
     * - 'LOCAL' is used for long term persistence such as `localStorage` or `IndexedDB`.
     * - 'NONE' is used for in-memory, or no persistence.
     */
    readonly type: 'SESSION' | 'LOCAL' | 'NONE';
}
/**
 * Interface representing ID token result obtained from {@link User.getIdTokenResult}.
 *
 * @remarks
 * `IdTokenResult` contains the ID token JWT string and other helper properties for getting different data
 * associated with the token as well as all the decoded payload claims.
 *
 * Note that these claims are not to be trusted as they are parsed client side. Only server side
 * verification can guarantee the integrity of the token claims.
 *
 * @public
 */
export interface IdTokenResult {
    /**
     * The authentication time formatted as a UTC string.
     *
     * @remarks
     * This is the time the user authenticated (signed in) and not the time the token was refreshed.
     */
    authTime: string;
    /** The ID token expiration time formatted as a UTC string. */
    expirationTime: string;
    /** The ID token issuance time formatted as a UTC string. */
    issuedAtTime: string;
    /**
     * The sign-in provider through which the ID token was obtained (anonymous, custom, phone,
     * password, etc).
     *
     * @remarks
     * Note, this does not map to provider IDs.
     */
    signInProvider: string | null;
    /**
     * The type of second factor associated with this session, provided the user was multi-factor
     * authenticated (eg. phone, etc).
     */
    signInSecondFactor: string | null;
    /** The Firebase Auth ID token JWT string. */
    token: string;
    /**
     * The entire payload claims of the ID token including the standard reserved claims as well as
     * the custom claims.
     */
    claims: ParsedToken;
}
/**
 * A response from {@link checkActionCode}.
 *
 * @public
 */
export interface ActionCodeInfo {
    /**
     * The data associated with the action code.
     *
     * @remarks
     * For the {@link ActionCodeOperation}.PASSWORD_RESET, {@link ActionCodeOperation}.VERIFY_EMAIL, and
     * {@link ActionCodeOperation}.RECOVER_EMAIL actions, this object contains an email field with the address
     * the email was sent to.
     *
     * For the {@link ActionCodeOperation}.RECOVER_EMAIL action, which allows a user to undo an email address
     * change, this object also contains a `previousEmail` field with the user account's current
     * email address. After the action completes, the user's email address will revert to the value
     * in the `email` field from the value in `previousEmail` field.
     *
     * For the {@link ActionCodeOperation}.VERIFY_AND_CHANGE_EMAIL action, which allows a user to verify the
     * email before updating it, this object contains a `previousEmail` field with the user account's
     * email address before updating. After the action completes, the user's email address will be
     * updated to the value in the `email` field from the value in `previousEmail` field.
     *
     * For the {@link ActionCodeOperation}.REVERT_SECOND_FACTOR_ADDITION action, which allows a user to
     * unenroll a newly added second factor, this object contains a `multiFactorInfo` field with
     * the information about the second factor. For phone second factor, the `multiFactorInfo`
     * is a {@link MultiFactorInfo} object, which contains the phone number.
     */
    data: {
        email?: string | null;
        multiFactorInfo?: MultiFactorInfo | null;
        previousEmail?: string | null;
    };
    /**
     * The type of operation that generated the action code.
     */
    operation: (typeof ActionCodeOperationMap)[keyof typeof ActionCodeOperationMap];
}
/**
 * An enumeration of the possible email action types.
 *
 * @internal
 */
export declare const enum ActionCodeOperation {
    /** The email link sign-in action. */
    EMAIL_SIGNIN = "EMAIL_SIGNIN",
    /** The password reset action. */
    PASSWORD_RESET = "PASSWORD_RESET",
    /** The email revocation action. */
    RECOVER_EMAIL = "RECOVER_EMAIL",
    /** The revert second factor addition email action. */
    REVERT_SECOND_FACTOR_ADDITION = "REVERT_SECOND_FACTOR_ADDITION",
    /** The revert second factor addition email action. */
    VERIFY_AND_CHANGE_EMAIL = "VERIFY_AND_CHANGE_EMAIL",
    /** The email verification action. */
    VERIFY_EMAIL = "VERIFY_EMAIL"
}
/**
 * An interface that defines the required continue/state URL with optional Android and iOS
 * bundle identifiers.
 *
 * @public
 */
export interface ActionCodeSettings {
    /**
     * Sets the Android package name.
     *
     * @remarks
     * This will try to open the link in an android app if it is
     * installed. If `installApp` is passed, it specifies whether to install the Android app if the
     * device supports it and the app is not already installed. If this field is provided without
     * a `packageName`, an error is thrown explaining that the `packageName` must be provided in
     * conjunction with this field. If `minimumVersion` is specified, and an older version of the
     * app is installed, the user is taken to the Play Store to upgrade the app.
     */
    android?: {
        installApp?: boolean;
        minimumVersion?: string;
        packageName: string;
    };
    /**
     * When set to true, the action code link will be be sent as a Universal Link or Android App
     * Link and will be opened by the app if installed.
     *
     * @remarks
     * In the false case, the code will be sent to the web widget first and then on continue will
     * redirect to the app if installed.
     *
     * @defaultValue false
     */
    handleCodeInApp?: boolean;
    /**
     * Sets the iOS bundle ID.
     *
     * @remarks
     * This will try to open the link in an iOS app if it is installed.
     *
     * App installation is not supported for iOS.
     */
    iOS?: {
        bundleId: string;
    };
    /**
     * Sets the link continue/state URL.
     *
     * @remarks
     * This has different meanings in different contexts:
     * - When the link is handled in the web action widgets, this is the deep link in the
     * `continueUrl` query parameter.
     * - When the link is handled in the app directly, this is the `continueUrl` query parameter in
     * the deep link of the Dynamic Link.
     */
    url: string;
    /**
     * When multiple custom dynamic link domains are defined for a project, specify which one to use
     * when the link is to be opened via a specified mobile app (for example, `example.page.link`).
     *
     *
     * @defaultValue The first domain is automatically selected.
     */
    dynamicLinkDomain?: string;
}
/**
 * A verifier for domain verification and abuse prevention.
 *
 * @remarks
 * Currently, the only implementation is {@link RecaptchaVerifier}.
 *
 * @public
 */
export interface ApplicationVerifier {
    /**
     * Identifies the type of application verifier (e.g. "recaptcha").
     */
    readonly type: string;
    /**
     * Executes the verification process.
     *
     * @returns A Promise for a token that can be used to assert the validity of a request.
     */
    verify(): Promise<string>;
}
/**
 * Interface that represents an auth provider, used to facilitate creating {@link AuthCredential}.
 *
 * @public
 */
export interface AuthProvider {
    /**
     * Provider for which credentials can be constructed.
     */
    readonly providerId: string;
}
/**
 * An enum of factors that may be used for multifactor authentication.
 *
 * Internally we use an enum type for FactorId, ActionCodeOperation, but there is a copy in https://github.com/firebase/firebase-js-sdk/blob/48a2096aec53a7eaa9ffcc2625016ecb9f90d113/packages/auth/src/model/enum_maps.ts#L23 that uses maps.
 * const enums are better for tree-shaking, however can cause runtime errors if exposed in public APIs, example - https://github.com/microsoft/rushstack/issues/3058
 * So, we expose enum maps publicly, but use const enums internally to get some tree-shaking benefit.
 * @internal
 */
export declare const enum FactorId {
    /** Phone as second factor */
    PHONE = "phone",
    TOTP = "totp"
}
/**
 * A result from a phone number sign-in, link, or reauthenticate call.
 *
 * @public
 */
export interface ConfirmationResult {
    /**
     * The phone number authentication operation's verification ID.
     *
     * @remarks
     * This can be used along with the verification code to initialize a
     * {@link PhoneAuthCredential}.
     */
    readonly verificationId: string;
    /**
     * Finishes a phone number sign-in, link, or reauthentication.
     *
     * @example
     * ```javascript
     * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const userCredential = await confirmationResult.confirm(verificationCode);
     * ```
     *
     * @param verificationCode - The code that was sent to the user's mobile device.
     */
    confirm(verificationCode: string): Promise<UserCredential>;
}
/**
 * The base class for asserting ownership of a second factor.
 *
 * @remarks
 * This is used to facilitate enrollment of a second factor on an existing user or sign-in of a
 * user who already verified the first factor.
 *
 * @public
 */
export interface MultiFactorAssertion {
    /** The identifier of the second factor. */
    readonly factorId: (typeof FactorIdMap)[keyof typeof FactorIdMap];
}
/**
 * The error thrown when the user needs to provide a second factor to sign in successfully.
 *
 * @remarks
 * The error code for this error is `auth/multi-factor-auth-required`.
 *
 * @example
 * ```javascript
 * let resolver;
 * let multiFactorHints;
 *
 * signInWithEmailAndPassword(auth, email, password)
 *     .then((result) => {
 *       // User signed in. No 2nd factor challenge is needed.
 *     })
 *     .catch((error) => {
 *       if (error.code == 'auth/multi-factor-auth-required') {
 *         resolver = getMultiFactorResolver(auth, error);
 *         multiFactorHints = resolver.hints;
 *       } else {
 *         // Handle other errors.
 *       }
 *     });
 *
 * // Obtain a multiFactorAssertion by verifying the second factor.
 *
 * const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
 * ```
 *
 * @public
 */
export interface MultiFactorError extends AuthError {
    /** Details about the MultiFactorError. */
    readonly customData: AuthError['customData'] & {
        /**
         * The type of operation (sign-in, linking, or re-authentication) that raised the error.
         */
        readonly operationType: (typeof OperationTypeMap)[keyof typeof OperationTypeMap];
    };
}
/**
 * A structure containing the information of a second factor entity.
 *
 * @public
 */
export interface MultiFactorInfo {
    /** The multi-factor enrollment ID. */
    readonly uid: string;
    /** The user friendly name of the current second factor. */
    readonly displayName?: string | null;
    /** The enrollment date of the second factor formatted as a UTC string. */
    readonly enrollmentTime: string;
    /** The identifier of the second factor. */
    readonly factorId: (typeof FactorIdMap)[keyof typeof FactorIdMap];
}
/**
 * The subclass of the {@link MultiFactorInfo} interface for phone number
 * second factors. The `factorId` of this second factor is {@link FactorId}.PHONE.
 * @public
 */
export interface PhoneMultiFactorInfo extends MultiFactorInfo {
    /** The phone number associated with the current second factor. */
    readonly phoneNumber: string;
}
/**
 * The subclass of the {@link MultiFactorInfo} interface for TOTP
 * second factors. The `factorId` of this second factor is {@link FactorId}.TOTP.
 * @public
 */
export interface TotpMultiFactorInfo extends MultiFactorInfo {
}
/**
 * The class used to facilitate recovery from {@link MultiFactorError} when a user needs to
 * provide a second factor to sign in.
 *
 * @example
 * ```javascript
 * let resolver;
 * let multiFactorHints;
 *
 * signInWithEmailAndPassword(auth, email, password)
 *     .then((result) => {
 *       // User signed in. No 2nd factor challenge is needed.
 *     })
 *     .catch((error) => {
 *       if (error.code == 'auth/multi-factor-auth-required') {
 *         resolver = getMultiFactorResolver(auth, error);
 *         // Show UI to let user select second factor.
 *         multiFactorHints = resolver.hints;
 *       } else {
 *         // Handle other errors.
 *       }
 *     });
 *
 * // The enrolled second factors that can be used to complete
 * // sign-in are returned in the `MultiFactorResolver.hints` list.
 * // UI needs to be presented to allow the user to select a second factor
 * // from that list.
 *
 * const selectedHint = // ; selected from multiFactorHints
 * const phoneAuthProvider = new PhoneAuthProvider(auth);
 * const phoneInfoOptions = {
 *   multiFactorHint: selectedHint,
 *   session: resolver.session
 * };
 * const verificationId = phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, appVerifier);
 * // Store `verificationId` and show UI to let user enter verification code.
 *
 * // UI to enter verification code and continue.
 * // Continue button click handler
 * const phoneAuthCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
 * const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
 * const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
 * ```
 *
 * @public
 */
export interface MultiFactorResolver {
    /**
     * The list of hints for the second factors needed to complete the sign-in for the current
     * session.
     */
    readonly hints: MultiFactorInfo[];
    /**
     * The session identifier for the current sign-in flow, which can be used to complete the second
     * factor sign-in.
     */
    readonly session: MultiFactorSession;
    /**
     * A helper function to help users complete sign in with a second factor using an
     * {@link MultiFactorAssertion} confirming the user successfully completed the second factor
     * challenge.
     *
     * @example
     * ```javascript
     * const phoneAuthCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
     * const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
     * ```
     *
     * @param assertion - The multi-factor assertion to resolve sign-in with.
     * @returns The promise that resolves with the user credential object.
     */
    resolveSignIn(assertion: MultiFactorAssertion): Promise<UserCredential>;
}
/**
 * An interface defining the multi-factor session object used for enrolling a second factor on a
 * user or helping sign in an enrolled user with a second factor.
 *
 * @public
 */
export interface MultiFactorSession {
}
/**
 * An interface that defines the multi-factor related properties and operations pertaining
 * to a {@link User}.
 *
 * @public
 */
export interface MultiFactorUser {
    /** Returns a list of the user's enrolled second factors. */
    readonly enrolledFactors: MultiFactorInfo[];
    /**
     * Returns the session identifier for a second factor enrollment operation. This is used to
     * identify the user trying to enroll a second factor.
     *
     * @example
     * ```javascript
     * const multiFactorUser = multiFactor(auth.currentUser);
     * const multiFactorSession = await multiFactorUser.getSession();
     *
     * // Send verification code.
     * const phoneAuthProvider = new PhoneAuthProvider(auth);
     * const phoneInfoOptions = {
     *   phoneNumber: phoneNumber,
     *   session: multiFactorSession
     * };
     * const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, appVerifier);
     *
     * // Obtain verification code from user.
     * const phoneAuthCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
     * await multiFactorUser.enroll(multiFactorAssertion);
     * ```
     *
     * @returns The promise that resolves with the {@link MultiFactorSession}.
     */
    getSession(): Promise<MultiFactorSession>;
    /**
     *
     * Enrolls a second factor as identified by the {@link MultiFactorAssertion} for the
     * user.
     *
     * @remarks
     * On resolution, the user tokens are updated to reflect the change in the JWT payload.
     * Accepts an additional display name parameter used to identify the second factor to the end
     * user. Recent re-authentication is required for this operation to succeed. On successful
     * enrollment, existing Firebase sessions (refresh tokens) are revoked. When a new factor is
     * enrolled, an email notification is sent to the user’s email.
     *
     * @example
     * ```javascript
     * const multiFactorUser = multiFactor(auth.currentUser);
     * const multiFactorSession = await multiFactorUser.getSession();
     *
     * // Send verification code.
     * const phoneAuthProvider = new PhoneAuthProvider(auth);
     * const phoneInfoOptions = {
     *   phoneNumber: phoneNumber,
     *   session: multiFactorSession
     * };
     * const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, appVerifier);
     *
     * // Obtain verification code from user.
     * const phoneAuthCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
     * await multiFactorUser.enroll(multiFactorAssertion);
     * // Second factor enrolled.
     * ```
     *
     * @param assertion - The multi-factor assertion to enroll with.
     * @param displayName - The display name of the second factor.
     */
    enroll(assertion: MultiFactorAssertion, displayName?: string | null): Promise<void>;
    /**
     * Unenrolls the specified second factor.
     *
     * @remarks
     * To specify the factor to remove, pass a {@link MultiFactorInfo} object (retrieved from
     * {@link MultiFactorUser.enrolledFactors}) or the
     * factor's UID string. Sessions are not revoked when the account is unenrolled. An email
     * notification is likely to be sent to the user notifying them of the change. Recent
     * re-authentication is required for this operation to succeed. When an existing factor is
     * unenrolled, an email notification is sent to the user’s email.
     *
     * @example
     * ```javascript
     * const multiFactorUser = multiFactor(auth.currentUser);
     * // Present user the option to choose which factor to unenroll.
     * await multiFactorUser.unenroll(multiFactorUser.enrolledFactors[i])
     * ```
     *
     * @param option - The multi-factor option to unenroll.
     * @returns - A `Promise` which resolves when the unenroll operation is complete.
     */
    unenroll(option: MultiFactorInfo | string): Promise<void>;
}
/**
 * The class for asserting ownership of a phone second factor. Provided by
 * {@link PhoneMultiFactorGenerator.assertion}.
 *
 * @public
 */
export interface PhoneMultiFactorAssertion extends MultiFactorAssertion {
}
/**
 * The information required to verify the ownership of a phone number.
 *
 * @remarks
 * The information that's required depends on whether you are doing single-factor sign-in,
 * multi-factor enrollment or multi-factor sign-in.
 *
 * @public
 */
export declare type PhoneInfoOptions = PhoneSingleFactorInfoOptions | PhoneMultiFactorEnrollInfoOptions | PhoneMultiFactorSignInInfoOptions;
/**
 * Options used for single-factor sign-in.
 *
 * @public
 */
export interface PhoneSingleFactorInfoOptions {
    /** Phone number to send a verification code to. */
    phoneNumber: string;
}
/**
 * Options used for enrolling a second factor.
 *
 * @public
 */
export interface PhoneMultiFactorEnrollInfoOptions {
    /** Phone number to send a verification code to. */
    phoneNumber: string;
    /** The {@link MultiFactorSession} obtained via {@link MultiFactorUser.getSession}. */
    session: MultiFactorSession;
}
/**
 * Options used for signing in with a second factor.
 *
 * @public
 */
export interface PhoneMultiFactorSignInInfoOptions {
    /**
     * The {@link MultiFactorInfo} obtained via {@link MultiFactorResolver.hints}.
     *
     * One of `multiFactorHint` or `multiFactorUid` is required.
     */
    multiFactorHint?: MultiFactorInfo;
    /**
     * The uid of the second factor.
     *
     * One of `multiFactorHint` or `multiFactorUid` is required.
     */
    multiFactorUid?: string;
    /** The {@link MultiFactorSession} obtained via {@link MultiFactorResolver.session}. */
    session: MultiFactorSession;
}
/**
 * Interface for a supplied `AsyncStorage`.
 *
 * @public
 */
export interface ReactNativeAsyncStorage {
    /**
     * Persist an item in storage.
     *
     * @param key - storage key.
     * @param value - storage value.
     */
    setItem(key: string, value: string): Promise<void>;
    /**
     * Retrieve an item from storage.
     *
     * @param key - storage key.
     */
    getItem(key: string): Promise<string | null>;
    /**
     * Remove an item from storage.
     *
     * @param key - storage key.
     */
    removeItem(key: string): Promise<void>;
}
/**
 * A user account.
 *
 * @public
 */
export interface User extends UserInfo {
    /**
     * Whether the email has been verified with {@link sendEmailVerification} and
     * {@link applyActionCode}.
     */
    readonly emailVerified: boolean;
    /**
     * Whether the user is authenticated using the {@link ProviderId}.ANONYMOUS provider.
     */
    readonly isAnonymous: boolean;
    /**
     * Additional metadata around user creation and sign-in times.
     */
    readonly metadata: UserMetadata;
    /**
     * Additional per provider such as displayName and profile information.
     */
    readonly providerData: UserInfo[];
    /**
     * Refresh token used to reauthenticate the user. Avoid using this directly and prefer
     * {@link User.getIdToken} to refresh the ID token instead.
     */
    readonly refreshToken: string;
    /**
     * The user's tenant ID.
     *
     * @remarks
     * This is a read-only property, which indicates the tenant ID
     * used to sign in the user. This is null if the user is signed in from the parent
     * project.
     *
     * @example
     * ```javascript
     * // Set the tenant ID on Auth instance.
     * auth.tenantId = 'TENANT_PROJECT_ID';
     *
     * // All future sign-in request now include tenant ID.
     * const result = await signInWithEmailAndPassword(auth, email, password);
     * // result.user.tenantId should be 'TENANT_PROJECT_ID'.
     * ```
     */
    readonly tenantId: string | null;
    /**
     * Deletes and signs out the user.
     *
     * @remarks
     * Important: this is a security-sensitive operation that requires the user to have recently
     * signed in. If this requirement isn't met, ask the user to authenticate again and then call
     * one of the reauthentication methods like {@link reauthenticateWithCredential}.
     */
    delete(): Promise<void>;
    /**
     * Returns a JSON Web Token (JWT) used to identify the user to a Firebase service.
     *
     * @remarks
     * Returns the current token if it has not expired or if it will not expire in the next five
     * minutes. Otherwise, this will refresh the token and return a new one.
     *
     * @param forceRefresh - Force refresh regardless of token expiration.
     */
    getIdToken(forceRefresh?: boolean): Promise<string>;
    /**
     * Returns a deserialized JSON Web Token (JWT) used to identify the user to a Firebase service.
     *
     * @remarks
     * Returns the current token if it has not expired or if it will not expire in the next five
     * minutes. Otherwise, this will refresh the token and return a new one.
     *
     * @param forceRefresh - Force refresh regardless of token expiration.
     */
    getIdTokenResult(forceRefresh?: boolean): Promise<IdTokenResult>;
    /**
     * Refreshes the user, if signed in.
     */
    reload(): Promise<void>;
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    toJSON(): object;
}
/**
 * A structure containing a {@link User}, the {@link OperationType}, and the provider ID.
 *
 * @remarks
 * `operationType` could be {@link OperationType}.SIGN_IN for a sign-in operation,
 * {@link OperationType}.LINK for a linking operation and {@link OperationType}.REAUTHENTICATE for
 * a reauthentication operation.
 *
 * @public
 */
export interface UserCredential {
    /**
     * The user authenticated by this credential.
     */
    user: User;
    /**
     * The provider which was used to authenticate the user.
     */
    providerId: string | null;
    /**
     * The type of operation which was used to authenticate the user (such as sign-in or link).
     */
    operationType: (typeof OperationTypeMap)[keyof typeof OperationTypeMap];
}
/**
 * User profile information, visible only to the Firebase project's apps.
 *
 * @public
 */
export interface UserInfo {
    /**
     * The display name of the user.
     */
    readonly displayName: string | null;
    /**
     * The email of the user.
     */
    readonly email: string | null;
    /**
     * The phone number normalized based on the E.164 standard (e.g. +16505550101) for the
     * user.
     *
     * @remarks
     * This is null if the user has no phone credential linked to the account.
     */
    readonly phoneNumber: string | null;
    /**
     * The profile photo URL of the user.
     */
    readonly photoURL: string | null;
    /**
     * The provider used to authenticate the user.
     */
    readonly providerId: string;
    /**
     * The user's unique ID, scoped to the project.
     */
    readonly uid: string;
}
/**
 * Interface representing a user's metadata.
 *
 * @public
 */
export interface UserMetadata {
    /** Time the user was created. */
    readonly creationTime?: string;
    /** Time the user last signed in. */
    readonly lastSignInTime?: string;
}
/**
 * A structure containing additional user information from a federated identity provider.
 *
 * @public
 */
export interface AdditionalUserInfo {
    /**
     * Whether the user is new (created via sign-up) or existing (authenticated using sign-in).
     */
    readonly isNewUser: boolean;
    /**
     * Map containing IDP-specific user data.
     */
    readonly profile: Record<string, unknown> | null;
    /**
     * Identifier for the provider used to authenticate this user.
     */
    readonly providerId: string | null;
    /**
     * The username if the provider is GitHub or Twitter.
     */
    readonly username?: string | null;
}
/**
 * User profile used in {@link AdditionalUserInfo}.
 *
 * @public
 */
export declare type UserProfile = Record<string, unknown>;
/**
 * A resolver used for handling DOM specific operations like {@link signInWithPopup}
 * or {@link signInWithRedirect}.
 *
 * @public
 */
export interface PopupRedirectResolver {
}
declare module '@firebase/component' {
    interface NameServiceMapping {
        'auth': Auth;
    }
}
/**
 * Configuration of Firebase Authentication Emulator.
 * @public
 */
export interface EmulatorConfig {
    /**
     * The protocol used to communicate with the emulator ("http"/"https").
     */
    readonly protocol: string;
    /**
     * The hostname of the emulator, which may be a domain ("localhost"), IPv4 address ("127.0.0.1")
     * or quoted IPv6 address ("[::1]").
     */
    readonly host: string;
    /**
     * The port of the emulator, or null if port isn't specified (i.e. protocol default).
     */
    readonly port: number | null;
    /**
     * The emulator-specific options.
     */
    readonly options: {
        /**
         * Whether the warning banner attached to the DOM was disabled.
         */
        readonly disableWarnings: boolean;
    };
}
/**
 * A mapping of error codes to error messages.
 *
 * @remarks
 *
 * While error messages are useful for debugging (providing verbose textual
 * context around what went wrong), these strings take up a lot of space in the
 * compiled code. When deploying code in production, using {@link prodErrorMap}
 * will save you roughly 10k compressed/gzipped over {@link debugErrorMap}. You
 * can select the error map during initialization:
 *
 * ```javascript
 * initializeAuth(app, {errorMap: debugErrorMap})
 * ```
 *
 * When initializing Auth, {@link prodErrorMap} is default.
 *
 * @public
 */
export interface AuthErrorMap {
}
/**
 * The dependencies that can be used to initialize an {@link Auth} instance.
 *
 * @remarks
 *
 * The modular SDK enables tree shaking by allowing explicit declarations of
 * dependencies. For example, a web app does not need to include code that
 * enables Cordova redirect sign in. That functionality is therefore split into
 * {@link browserPopupRedirectResolver} and
 * {@link cordovaPopupRedirectResolver}. The dependencies object is how Auth is
 * configured to reduce bundle sizes.
 *
 * There are two ways to initialize an {@link Auth} instance: {@link getAuth} and
 * {@link initializeAuth}. `getAuth` initializes everything using
 * platform-specific configurations, while `initializeAuth` takes a
 * `Dependencies` object directly, giving you more control over what is used.
 *
 * @public
 */
export interface Dependencies {
    /**
     * Which {@link Persistence} to use. If this is an array, the first
     * `Persistence` that the device supports is used. The SDK searches for an
     * existing account in order and, if one is found in a secondary
     * `Persistence`, the account is moved to the primary `Persistence`.
     *
     * If no persistence is provided, the SDK falls back on
     * {@link inMemoryPersistence}.
     */
    persistence?: Persistence | Persistence[];
    /**
     * The {@link PopupRedirectResolver} to use. This value depends on the
     * platform. Options are {@link browserPopupRedirectResolver} and
     * {@link cordovaPopupRedirectResolver}. This field is optional if neither
     * {@link signInWithPopup} or {@link signInWithRedirect} are being used.
     */
    popupRedirectResolver?: PopupRedirectResolver;
    /**
     * Which {@link AuthErrorMap} to use.
     */
    errorMap?: AuthErrorMap;
}
/**
 * The class for asserting ownership of a TOTP second factor. Provided by
 * {@link TotpMultiFactorGenerator.assertionForEnrollment} and
 * {@link TotpMultiFactorGenerator.assertionForSignIn}.
 *
 * @public
 */
export interface TotpMultiFactorAssertion extends MultiFactorAssertion {
}
/**
 * A structure specifying password policy requirements.
 *
 * @public
 */
export interface PasswordPolicy {
    /**
     * Requirements enforced by this password policy.
     */
    readonly customStrengthOptions: {
        /**
         * Minimum password length, or undefined if not configured.
         */
        readonly minPasswordLength?: number;
        /**
         * Maximum password length, or undefined if not configured.
         */
        readonly maxPasswordLength?: number;
        /**
         * Whether the password should contain a lowercase letter, or undefined if not configured.
         */
        readonly containsLowercaseLetter?: boolean;
        /**
         * Whether the password should contain an uppercase letter, or undefined if not configured.
         */
        readonly containsUppercaseLetter?: boolean;
        /**
         * Whether the password should contain a numeric character, or undefined if not configured.
         */
        readonly containsNumericCharacter?: boolean;
        /**
         * Whether the password should contain a non-alphanumeric character, or undefined if not configured.
         */
        readonly containsNonAlphanumericCharacter?: boolean;
    };
    /**
     * List of characters that are considered non-alphanumeric during validation.
     */
    readonly allowedNonAlphanumericCharacters: string;
    /**
     * The enforcement state of the policy. Can be 'OFF' or 'ENFORCE'.
     */
    readonly enforcementState: string;
    /**
     * Whether existing passwords must meet the policy.
     */
    readonly forceUpgradeOnSignin: boolean;
}
/**
 * A structure indicating which password policy requirements were met or violated and what the
 * requirements are.
 *
 * @public
 */
export interface PasswordValidationStatus {
    /**
     * Whether the password meets all requirements.
     */
    readonly isValid: boolean;
    /**
     * Whether the password meets the minimum password length, or undefined if not required.
     */
    readonly meetsMinPasswordLength?: boolean;
    /**
     * Whether the password meets the maximum password length, or undefined if not required.
     */
    readonly meetsMaxPasswordLength?: boolean;
    /**
     * Whether the password contains a lowercase letter, or undefined if not required.
     */
    readonly containsLowercaseLetter?: boolean;
    /**
     * Whether the password contains an uppercase letter, or undefined if not required.
     */
    readonly containsUppercaseLetter?: boolean;
    /**
     * Whether the password contains a numeric character, or undefined if not required.
     */
    readonly containsNumericCharacter?: boolean;
    /**
     * Whether the password contains a non-alphanumeric character, or undefined if not required.
     */
    readonly containsNonAlphanumericCharacter?: boolean;
    /**
     * The policy used to validate the password.
     */
    readonly passwordPolicy: PasswordPolicy;
}
