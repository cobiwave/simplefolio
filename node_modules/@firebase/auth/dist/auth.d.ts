/**
 * Firebase Authentication
 *
 * @packageDocumentation
 */

import { CompleteFn } from '@firebase/util';
import { ErrorFactory } from '@firebase/util';
import { ErrorFn } from '@firebase/util';
import { FirebaseApp } from '@firebase/app';
import { FirebaseError } from '@firebase/util';
import { NextFn } from '@firebase/util';
import { Observer } from '@firebase/util';
import { Unsubscribe } from '@firebase/util';

/**
 * A response from {@link checkActionCode}.
 *
 * @public
 */
export declare interface ActionCodeInfo {
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
    operation: (typeof ActionCodeOperation)[keyof typeof ActionCodeOperation];
}

/**
 * An enumeration of the possible email action types.
 *
 * @public
 */
export declare const ActionCodeOperation: {
    /** The email link sign-in action. */
    readonly EMAIL_SIGNIN: "EMAIL_SIGNIN";
    /** The password reset action. */
    readonly PASSWORD_RESET: "PASSWORD_RESET";
    /** The email revocation action. */
    readonly RECOVER_EMAIL: "RECOVER_EMAIL";
    /** The revert second factor addition email action. */
    readonly REVERT_SECOND_FACTOR_ADDITION: "REVERT_SECOND_FACTOR_ADDITION";
    /** The revert second factor addition email action. */
    readonly VERIFY_AND_CHANGE_EMAIL: "VERIFY_AND_CHANGE_EMAIL";
    /** The email verification action. */
    readonly VERIFY_EMAIL: "VERIFY_EMAIL";
};

/**
 * An interface that defines the required continue/state URL with optional Android and iOS
 * bundle identifiers.
 *
 * @public
 */
export declare interface ActionCodeSettings {
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
 * A utility class to parse email action URLs such as password reset, email verification,
 * email link sign in, etc.
 *
 * @public
 */
export declare class ActionCodeURL {
    /**
     * The API key of the email action link.
     */
    readonly apiKey: string;
    /**
     * The action code of the email action link.
     */
    readonly code: string;
    /**
     * The continue URL of the email action link. Null if not provided.
     */
    readonly continueUrl: string | null;
    /**
     * The language code of the email action link. Null if not provided.
     */
    readonly languageCode: string | null;
    /**
     * The action performed by the email action link. It returns from one of the types from
     * {@link ActionCodeInfo}
     */
    readonly operation: string;
    /**
     * The tenant ID of the email action link. Null if the email action is from the parent project.
     */
    readonly tenantId: string | null;
    /**
     * @param actionLink - The link from which to extract the URL.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @internal
     */
    constructor(actionLink: string);
    /**
     * Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
     * otherwise returns null.
     *
     * @param link  - The email action link string.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @public
     */
    static parseLink(link: string): ActionCodeURL | null;
}

/**
 * A structure containing additional user information from a federated identity provider.
 *
 * @public
 */
export declare interface AdditionalUserInfo {
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

declare interface APIUserInfo {
    localId?: string;
    displayName?: string;
    photoUrl?: string;
    email?: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    lastLoginAt?: number;
    createdAt?: number;
    tenantId?: string;
    passwordHash?: string;
    providerUserInfo?: ProviderUserInfo[];
    mfaInfo?: MfaEnrollment[];
}

/**
 * A verifier for domain verification and abuse prevention.
 *
 * @remarks
 * Currently, the only implementation is {@link RecaptchaVerifier}.
 *
 * @public
 */
export declare interface ApplicationVerifier {
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

declare interface ApplicationVerifierInternal extends ApplicationVerifier {
    /**
     * @internal
     */
    _reset(): void;
}

/**
 * Applies a verification code sent to the user by email or other out-of-band mechanism.
 *
 * @param auth - The {@link Auth} instance.
 * @param oobCode - A verification code sent to the user.
 *
 * @public
 */
export declare function applyActionCode(auth: Auth, oobCode: string): Promise<void>;

declare type AppName = string;

/**
 * Interface representing Firebase Auth service.
 *
 * @remarks
 * See {@link https://firebase.google.com/docs/auth/ | Firebase Authentication} for a full guide
 * on how to use the Firebase Auth service.
 *
 * @public
 */
export declare interface Auth {
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
 * Interface that represents the credentials returned by an {@link AuthProvider}.
 *
 * @remarks
 * Implementations specify the details about each auth provider's credential requirements.
 *
 * @public
 */
export declare class AuthCredential {
    /**
     * The authentication provider ID for the credential.
     *
     * @remarks
     * For example, 'facebook.com', or 'google.com'.
     */
    readonly providerId: string;
    /**
     * The authentication sign in method for the credential.
     *
     * @remarks
     * For example, {@link SignInMethod}.EMAIL_PASSWORD, or
     * {@link SignInMethod}.EMAIL_LINK. This corresponds to the sign-in method
     * identifier as returned in {@link fetchSignInMethodsForEmail}.
     */
    readonly signInMethod: string;
    /** @internal */
    protected constructor(
    /**
     * The authentication provider ID for the credential.
     *
     * @remarks
     * For example, 'facebook.com', or 'google.com'.
     */
    providerId: string, 
    /**
     * The authentication sign in method for the credential.
     *
     * @remarks
     * For example, {@link SignInMethod}.EMAIL_PASSWORD, or
     * {@link SignInMethod}.EMAIL_LINK. This corresponds to the sign-in method
     * identifier as returned in {@link fetchSignInMethodsForEmail}.
     */
    signInMethod: string);
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns a JSON-serializable representation of this object.
     */
    toJSON(): object;
    /** @internal */
    _getIdTokenResponse(_auth: AuthInternal): Promise<PhoneOrOauthTokenResponse>;
    /** @internal */
    _linkToIdToken(_auth: AuthInternal, _idToken: string): Promise<IdTokenResponse>;
    /** @internal */
    _getReauthenticationResolver(_auth: AuthInternal): Promise<IdTokenResponse>;
}

/**
 * Interface for an `Auth` error.
 *
 * @public
 */
export declare interface AuthError extends FirebaseError {
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
 * Enumeration of Firebase Auth error codes.
 *
 * @internal
 */
declare const enum AuthErrorCode {
    ADMIN_ONLY_OPERATION = "admin-restricted-operation",
    ARGUMENT_ERROR = "argument-error",
    APP_NOT_AUTHORIZED = "app-not-authorized",
    APP_NOT_INSTALLED = "app-not-installed",
    CAPTCHA_CHECK_FAILED = "captcha-check-failed",
    CODE_EXPIRED = "code-expired",
    CORDOVA_NOT_READY = "cordova-not-ready",
    CORS_UNSUPPORTED = "cors-unsupported",
    CREDENTIAL_ALREADY_IN_USE = "credential-already-in-use",
    CREDENTIAL_MISMATCH = "custom-token-mismatch",
    CREDENTIAL_TOO_OLD_LOGIN_AGAIN = "requires-recent-login",
    DEPENDENT_SDK_INIT_BEFORE_AUTH = "dependent-sdk-initialized-before-auth",
    DYNAMIC_LINK_NOT_ACTIVATED = "dynamic-link-not-activated",
    EMAIL_CHANGE_NEEDS_VERIFICATION = "email-change-needs-verification",
    EMAIL_EXISTS = "email-already-in-use",
    EMULATOR_CONFIG_FAILED = "emulator-config-failed",
    EXPIRED_OOB_CODE = "expired-action-code",
    EXPIRED_POPUP_REQUEST = "cancelled-popup-request",
    INTERNAL_ERROR = "internal-error",
    INVALID_API_KEY = "invalid-api-key",
    INVALID_APP_CREDENTIAL = "invalid-app-credential",
    INVALID_APP_ID = "invalid-app-id",
    INVALID_AUTH = "invalid-user-token",
    INVALID_AUTH_EVENT = "invalid-auth-event",
    INVALID_CERT_HASH = "invalid-cert-hash",
    INVALID_CODE = "invalid-verification-code",
    INVALID_CONTINUE_URI = "invalid-continue-uri",
    INVALID_CORDOVA_CONFIGURATION = "invalid-cordova-configuration",
    INVALID_CUSTOM_TOKEN = "invalid-custom-token",
    INVALID_DYNAMIC_LINK_DOMAIN = "invalid-dynamic-link-domain",
    INVALID_EMAIL = "invalid-email",
    INVALID_EMULATOR_SCHEME = "invalid-emulator-scheme",
    INVALID_CREDENTIAL = "invalid-credential",
    INVALID_MESSAGE_PAYLOAD = "invalid-message-payload",
    INVALID_MFA_SESSION = "invalid-multi-factor-session",
    INVALID_OAUTH_CLIENT_ID = "invalid-oauth-client-id",
    INVALID_OAUTH_PROVIDER = "invalid-oauth-provider",
    INVALID_OOB_CODE = "invalid-action-code",
    INVALID_ORIGIN = "unauthorized-domain",
    INVALID_PASSWORD = "wrong-password",
    INVALID_PERSISTENCE = "invalid-persistence-type",
    INVALID_PHONE_NUMBER = "invalid-phone-number",
    INVALID_PROVIDER_ID = "invalid-provider-id",
    INVALID_RECIPIENT_EMAIL = "invalid-recipient-email",
    INVALID_SENDER = "invalid-sender",
    INVALID_SESSION_INFO = "invalid-verification-id",
    INVALID_TENANT_ID = "invalid-tenant-id",
    LOGIN_BLOCKED = "login-blocked",
    MFA_INFO_NOT_FOUND = "multi-factor-info-not-found",
    MFA_REQUIRED = "multi-factor-auth-required",
    MISSING_ANDROID_PACKAGE_NAME = "missing-android-pkg-name",
    MISSING_APP_CREDENTIAL = "missing-app-credential",
    MISSING_AUTH_DOMAIN = "auth-domain-config-required",
    MISSING_CODE = "missing-verification-code",
    MISSING_CONTINUE_URI = "missing-continue-uri",
    MISSING_IFRAME_START = "missing-iframe-start",
    MISSING_IOS_BUNDLE_ID = "missing-ios-bundle-id",
    MISSING_OR_INVALID_NONCE = "missing-or-invalid-nonce",
    MISSING_MFA_INFO = "missing-multi-factor-info",
    MISSING_MFA_SESSION = "missing-multi-factor-session",
    MISSING_PHONE_NUMBER = "missing-phone-number",
    MISSING_PASSWORD = "missing-password",
    MISSING_SESSION_INFO = "missing-verification-id",
    MODULE_DESTROYED = "app-deleted",
    NEED_CONFIRMATION = "account-exists-with-different-credential",
    NETWORK_REQUEST_FAILED = "network-request-failed",
    NULL_USER = "null-user",
    NO_AUTH_EVENT = "no-auth-event",
    NO_SUCH_PROVIDER = "no-such-provider",
    OPERATION_NOT_ALLOWED = "operation-not-allowed",
    OPERATION_NOT_SUPPORTED = "operation-not-supported-in-this-environment",
    POPUP_BLOCKED = "popup-blocked",
    POPUP_CLOSED_BY_USER = "popup-closed-by-user",
    PROVIDER_ALREADY_LINKED = "provider-already-linked",
    QUOTA_EXCEEDED = "quota-exceeded",
    REDIRECT_CANCELLED_BY_USER = "redirect-cancelled-by-user",
    REDIRECT_OPERATION_PENDING = "redirect-operation-pending",
    REJECTED_CREDENTIAL = "rejected-credential",
    SECOND_FACTOR_ALREADY_ENROLLED = "second-factor-already-in-use",
    SECOND_FACTOR_LIMIT_EXCEEDED = "maximum-second-factor-count-exceeded",
    TENANT_ID_MISMATCH = "tenant-id-mismatch",
    TIMEOUT = "timeout",
    TOKEN_EXPIRED = "user-token-expired",
    TOO_MANY_ATTEMPTS_TRY_LATER = "too-many-requests",
    UNAUTHORIZED_DOMAIN = "unauthorized-continue-uri",
    UNSUPPORTED_FIRST_FACTOR = "unsupported-first-factor",
    UNSUPPORTED_PERSISTENCE = "unsupported-persistence-type",
    UNSUPPORTED_TENANT_OPERATION = "unsupported-tenant-operation",
    UNVERIFIED_EMAIL = "unverified-email",
    USER_CANCELLED = "user-cancelled",
    USER_DELETED = "user-not-found",
    USER_DISABLED = "user-disabled",
    USER_MISMATCH = "user-mismatch",
    USER_SIGNED_OUT = "user-signed-out",
    WEAK_PASSWORD = "weak-password",
    WEB_STORAGE_UNSUPPORTED = "web-storage-unsupported",
    ALREADY_INITIALIZED = "already-initialized",
    RECAPTCHA_NOT_ENABLED = "recaptcha-not-enabled",
    MISSING_RECAPTCHA_TOKEN = "missing-recaptcha-token",
    INVALID_RECAPTCHA_TOKEN = "invalid-recaptcha-token",
    INVALID_RECAPTCHA_ACTION = "invalid-recaptcha-action",
    MISSING_CLIENT_TYPE = "missing-client-type",
    MISSING_RECAPTCHA_VERSION = "missing-recaptcha-version",
    INVALID_RECAPTCHA_VERSION = "invalid-recaptcha-version",
    INVALID_REQ_TYPE = "invalid-req-type",
    UNSUPPORTED_PASSWORD_POLICY_SCHEMA_VERSION = "unsupported-password-policy-schema-version",
    PASSWORD_DOES_NOT_MEET_REQUIREMENTS = "password-does-not-meet-requirements"
}

/**
 * A map of potential `Auth` error codes, for easier comparison with errors
 * thrown by the SDK.
 *
 * @remarks
 * Note that you can't tree-shake individual keys
 * in the map, so by using the map you might substantially increase your
 * bundle size.
 *
 * @public
 */
export declare const AuthErrorCodes: {
    readonly ADMIN_ONLY_OPERATION: "auth/admin-restricted-operation";
    readonly ARGUMENT_ERROR: "auth/argument-error";
    readonly APP_NOT_AUTHORIZED: "auth/app-not-authorized";
    readonly APP_NOT_INSTALLED: "auth/app-not-installed";
    readonly CAPTCHA_CHECK_FAILED: "auth/captcha-check-failed";
    readonly CODE_EXPIRED: "auth/code-expired";
    readonly CORDOVA_NOT_READY: "auth/cordova-not-ready";
    readonly CORS_UNSUPPORTED: "auth/cors-unsupported";
    readonly CREDENTIAL_ALREADY_IN_USE: "auth/credential-already-in-use";
    readonly CREDENTIAL_MISMATCH: "auth/custom-token-mismatch";
    readonly CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "auth/requires-recent-login";
    readonly DEPENDENT_SDK_INIT_BEFORE_AUTH: "auth/dependent-sdk-initialized-before-auth";
    readonly DYNAMIC_LINK_NOT_ACTIVATED: "auth/dynamic-link-not-activated";
    readonly EMAIL_CHANGE_NEEDS_VERIFICATION: "auth/email-change-needs-verification";
    readonly EMAIL_EXISTS: "auth/email-already-in-use";
    readonly EMULATOR_CONFIG_FAILED: "auth/emulator-config-failed";
    readonly EXPIRED_OOB_CODE: "auth/expired-action-code";
    readonly EXPIRED_POPUP_REQUEST: "auth/cancelled-popup-request";
    readonly INTERNAL_ERROR: "auth/internal-error";
    readonly INVALID_API_KEY: "auth/invalid-api-key";
    readonly INVALID_APP_CREDENTIAL: "auth/invalid-app-credential";
    readonly INVALID_APP_ID: "auth/invalid-app-id";
    readonly INVALID_AUTH: "auth/invalid-user-token";
    readonly INVALID_AUTH_EVENT: "auth/invalid-auth-event";
    readonly INVALID_CERT_HASH: "auth/invalid-cert-hash";
    readonly INVALID_CODE: "auth/invalid-verification-code";
    readonly INVALID_CONTINUE_URI: "auth/invalid-continue-uri";
    readonly INVALID_CORDOVA_CONFIGURATION: "auth/invalid-cordova-configuration";
    readonly INVALID_CUSTOM_TOKEN: "auth/invalid-custom-token";
    readonly INVALID_DYNAMIC_LINK_DOMAIN: "auth/invalid-dynamic-link-domain";
    readonly INVALID_EMAIL: "auth/invalid-email";
    readonly INVALID_EMULATOR_SCHEME: "auth/invalid-emulator-scheme";
    readonly INVALID_IDP_RESPONSE: "auth/invalid-credential";
    readonly INVALID_LOGIN_CREDENTIALS: "auth/invalid-credential";
    readonly INVALID_MESSAGE_PAYLOAD: "auth/invalid-message-payload";
    readonly INVALID_MFA_SESSION: "auth/invalid-multi-factor-session";
    readonly INVALID_OAUTH_CLIENT_ID: "auth/invalid-oauth-client-id";
    readonly INVALID_OAUTH_PROVIDER: "auth/invalid-oauth-provider";
    readonly INVALID_OOB_CODE: "auth/invalid-action-code";
    readonly INVALID_ORIGIN: "auth/unauthorized-domain";
    readonly INVALID_PASSWORD: "auth/wrong-password";
    readonly INVALID_PERSISTENCE: "auth/invalid-persistence-type";
    readonly INVALID_PHONE_NUMBER: "auth/invalid-phone-number";
    readonly INVALID_PROVIDER_ID: "auth/invalid-provider-id";
    readonly INVALID_RECIPIENT_EMAIL: "auth/invalid-recipient-email";
    readonly INVALID_SENDER: "auth/invalid-sender";
    readonly INVALID_SESSION_INFO: "auth/invalid-verification-id";
    readonly INVALID_TENANT_ID: "auth/invalid-tenant-id";
    readonly MFA_INFO_NOT_FOUND: "auth/multi-factor-info-not-found";
    readonly MFA_REQUIRED: "auth/multi-factor-auth-required";
    readonly MISSING_ANDROID_PACKAGE_NAME: "auth/missing-android-pkg-name";
    readonly MISSING_APP_CREDENTIAL: "auth/missing-app-credential";
    readonly MISSING_AUTH_DOMAIN: "auth/auth-domain-config-required";
    readonly MISSING_CODE: "auth/missing-verification-code";
    readonly MISSING_CONTINUE_URI: "auth/missing-continue-uri";
    readonly MISSING_IFRAME_START: "auth/missing-iframe-start";
    readonly MISSING_IOS_BUNDLE_ID: "auth/missing-ios-bundle-id";
    readonly MISSING_OR_INVALID_NONCE: "auth/missing-or-invalid-nonce";
    readonly MISSING_MFA_INFO: "auth/missing-multi-factor-info";
    readonly MISSING_MFA_SESSION: "auth/missing-multi-factor-session";
    readonly MISSING_PHONE_NUMBER: "auth/missing-phone-number";
    readonly MISSING_SESSION_INFO: "auth/missing-verification-id";
    readonly MODULE_DESTROYED: "auth/app-deleted";
    readonly NEED_CONFIRMATION: "auth/account-exists-with-different-credential";
    readonly NETWORK_REQUEST_FAILED: "auth/network-request-failed";
    readonly NULL_USER: "auth/null-user";
    readonly NO_AUTH_EVENT: "auth/no-auth-event";
    readonly NO_SUCH_PROVIDER: "auth/no-such-provider";
    readonly OPERATION_NOT_ALLOWED: "auth/operation-not-allowed";
    readonly OPERATION_NOT_SUPPORTED: "auth/operation-not-supported-in-this-environment";
    readonly POPUP_BLOCKED: "auth/popup-blocked";
    readonly POPUP_CLOSED_BY_USER: "auth/popup-closed-by-user";
    readonly PROVIDER_ALREADY_LINKED: "auth/provider-already-linked";
    readonly QUOTA_EXCEEDED: "auth/quota-exceeded";
    readonly REDIRECT_CANCELLED_BY_USER: "auth/redirect-cancelled-by-user";
    readonly REDIRECT_OPERATION_PENDING: "auth/redirect-operation-pending";
    readonly REJECTED_CREDENTIAL: "auth/rejected-credential";
    readonly SECOND_FACTOR_ALREADY_ENROLLED: "auth/second-factor-already-in-use";
    readonly SECOND_FACTOR_LIMIT_EXCEEDED: "auth/maximum-second-factor-count-exceeded";
    readonly TENANT_ID_MISMATCH: "auth/tenant-id-mismatch";
    readonly TIMEOUT: "auth/timeout";
    readonly TOKEN_EXPIRED: "auth/user-token-expired";
    readonly TOO_MANY_ATTEMPTS_TRY_LATER: "auth/too-many-requests";
    readonly UNAUTHORIZED_DOMAIN: "auth/unauthorized-continue-uri";
    readonly UNSUPPORTED_FIRST_FACTOR: "auth/unsupported-first-factor";
    readonly UNSUPPORTED_PERSISTENCE: "auth/unsupported-persistence-type";
    readonly UNSUPPORTED_TENANT_OPERATION: "auth/unsupported-tenant-operation";
    readonly UNVERIFIED_EMAIL: "auth/unverified-email";
    readonly USER_CANCELLED: "auth/user-cancelled";
    readonly USER_DELETED: "auth/user-not-found";
    readonly USER_DISABLED: "auth/user-disabled";
    readonly USER_MISMATCH: "auth/user-mismatch";
    readonly USER_SIGNED_OUT: "auth/user-signed-out";
    readonly WEAK_PASSWORD: "auth/weak-password";
    readonly WEB_STORAGE_UNSUPPORTED: "auth/web-storage-unsupported";
    readonly ALREADY_INITIALIZED: "auth/already-initialized";
    readonly RECAPTCHA_NOT_ENABLED: "auth/recaptcha-not-enabled";
    readonly MISSING_RECAPTCHA_TOKEN: "auth/missing-recaptcha-token";
    readonly INVALID_RECAPTCHA_TOKEN: "auth/invalid-recaptcha-token";
    readonly INVALID_RECAPTCHA_ACTION: "auth/invalid-recaptcha-action";
    readonly MISSING_CLIENT_TYPE: "auth/missing-client-type";
    readonly MISSING_RECAPTCHA_VERSION: "auth/missing-recaptcha-version";
    readonly INVALID_RECAPTCHA_VERSION: "auth/invalid-recaptcha-version";
    readonly INVALID_REQ_TYPE: "auth/invalid-req-type";
};

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
export declare interface AuthErrorMap {
}

/**
 * @internal
 */
declare interface AuthErrorParams extends GenericAuthErrorParams {
    [AuthErrorCode.ARGUMENT_ERROR]: {
        appName?: AppName;
    };
    [AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH]: {
        appName?: AppName;
    };
    [AuthErrorCode.INTERNAL_ERROR]: {
        appName?: AppName;
    };
    [AuthErrorCode.LOGIN_BLOCKED]: {
        appName?: AppName;
        originalMessage?: string;
    };
    [AuthErrorCode.OPERATION_NOT_SUPPORTED]: {
        appName?: AppName;
    };
    [AuthErrorCode.NO_AUTH_EVENT]: {
        appName?: AppName;
    };
    [AuthErrorCode.MFA_REQUIRED]: {
        appName: AppName;
        _serverResponse: IdTokenMfaResponse;
    };
    [AuthErrorCode.INVALID_CORDOVA_CONFIGURATION]: {
        appName: AppName;
        missingPlugin?: string;
    };
}

/**
 * @internal
 */
declare interface AuthEvent {
    type: AuthEventType;
    eventId: string | null;
    urlResponse: string | null;
    sessionId: string | null;
    postBody: string | null;
    tenantId: string | null;
    error?: AuthEventError;
}

/**
 * @internal
 */
declare interface AuthEventConsumer {
    readonly filter: AuthEventType[];
    eventId: string | null;
    onAuthEvent(event: AuthEvent): unknown;
    onError(error: FirebaseError): unknown;
}

declare interface AuthEventError extends Error {
    code: string;
    message: string;
}

/**
 * @internal
 */
declare const enum AuthEventType {
    LINK_VIA_POPUP = "linkViaPopup",
    LINK_VIA_REDIRECT = "linkViaRedirect",
    REAUTH_VIA_POPUP = "reauthViaPopup",
    REAUTH_VIA_REDIRECT = "reauthViaRedirect",
    SIGN_IN_VIA_POPUP = "signInViaPopup",
    SIGN_IN_VIA_REDIRECT = "signInViaRedirect",
    UNKNOWN = "unknown",
    VERIFY_APP = "verifyApp"
}

/**
 * UserInternal and AuthInternal reference each other, so both of them are included in the public typings.
 * In order to exclude them, we mark them as internal explicitly.
 *
 * @internal
 */
declare interface AuthInternal extends Auth {
    currentUser: User | null;
    emulatorConfig: EmulatorConfig | null;
    _agentRecaptchaConfig: RecaptchaConfig | null;
    _tenantRecaptchaConfigs: Record<string, RecaptchaConfig>;
    _projectPasswordPolicy: PasswordPolicy | null;
    _tenantPasswordPolicies: Record<string, PasswordPolicy>;
    _canInitEmulator: boolean;
    _isInitialized: boolean;
    _initializationPromise: Promise<void> | null;
    _updateCurrentUser(user: UserInternal | null): Promise<void>;
    _onStorageEvent(): void;
    _notifyListenersIfCurrent(user: UserInternal): void;
    _persistUserIfCurrent(user: UserInternal): Promise<void>;
    _setRedirectUser(user: UserInternal | null, popupRedirectResolver?: PopupRedirectResolver): Promise<void>;
    _redirectUserForId(id: string): Promise<UserInternal | null>;
    _popupRedirectResolver: PopupRedirectResolverInternal | null;
    _key(): string;
    _startProactiveRefresh(): void;
    _stopProactiveRefresh(): void;
    _getPersistence(): string;
    _getRecaptchaConfig(): RecaptchaConfig | null;
    _getPasswordPolicyInternal(): PasswordPolicyInternal | null;
    _updatePasswordPolicy(): Promise<void>;
    _logFramework(framework: string): void;
    _getFrameworks(): readonly string[];
    _getAdditionalHeaders(): Promise<Record<string, string>>;
    _getAppCheckToken(): Promise<string | undefined>;
    readonly name: AppName;
    readonly config: ConfigInternal;
    languageCode: string | null;
    tenantId: string | null;
    readonly settings: AuthSettings;
    _errorFactory: ErrorFactory<AuthErrorCode, AuthErrorParams>;
    useDeviceLanguage(): void;
    signOut(): Promise<void>;
    validatePassword(password: string): Promise<PasswordValidationStatus>;
    revokeAccessToken(token: string): Promise<void>;
}

declare class AuthPopup {
    readonly window: Window | null;
    associatedEvent: string | null;
    constructor(window: Window | null);
    close(): void;
}

/**
 * Interface that represents an auth provider, used to facilitate creating {@link AuthCredential}.
 *
 * @public
 */
export declare interface AuthProvider {
    /**
     * Provider for which credentials can be constructed.
     */
    readonly providerId: string;
}

/**
 * Interface representing an {@link Auth} instance's settings.
 *
 * @remarks Currently used for enabling/disabling app verification for phone Auth testing.
 *
 * @public
 */
export declare interface AuthSettings {
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
 * MFA Info as returned by the API.
 */
declare interface BaseMfaEnrollment {
    mfaEnrollmentId: string;
    enrolledAt: number;
    displayName?: string;
}

/**
 * Common code to all OAuth providers. This is separate from the
 * {@link OAuthProvider} so that child providers (like
 * {@link GoogleAuthProvider}) don't inherit the `credential` instance method.
 * Instead, they rely on a static `credential` method.
 */
declare abstract class BaseOAuthProvider extends FederatedAuthProvider implements AuthProvider {
    /** @internal */
    private scopes;
    /**
     * Add an OAuth scope to the credential.
     *
     * @param scope - Provider OAuth scope to add.
     */
    addScope(scope: string): AuthProvider;
    /**
     * Retrieve the current list of OAuth scopes.
     */
    getScopes(): string[];
}

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
 * An implementation of {@link Persistence} of type `LOCAL` using `localStorage`
 * for the underlying storage.
 *
 * @public
 */
export declare const browserLocalPersistence: Persistence;

/**
 * An implementation of {@link PopupRedirectResolver} suitable for browser
 * based applications.
 *
 * @remarks
 * This method does not work in a Node.js environment.
 *
 * @public
 */
export declare const browserPopupRedirectResolver: PopupRedirectResolver;

/**
 * An implementation of {@link Persistence} of `SESSION` using `sessionStorage`
 * for the underlying storage.
 *
 * @public
 */
export declare const browserSessionPersistence: Persistence;

/**
 * Checks a verification code sent to the user by email or other out-of-band mechanism.
 *
 * @returns metadata about the code.
 *
 * @param auth - The {@link Auth} instance.
 * @param oobCode - A verification code sent to the user.
 *
 * @public
 */
export declare function checkActionCode(auth: Auth, oobCode: string): Promise<ActionCodeInfo>;

/**
 * @internal
 */
declare const enum ClientPlatform {
    BROWSER = "Browser",
    NODE = "Node",
    REACT_NATIVE = "ReactNative",
    CORDOVA = "Cordova",
    WORKER = "Worker"
}
export { CompleteFn }

/**
 * Interface representing the `Auth` config.
 *
 * @public
 */
export declare interface Config {
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
 * @internal
 */
declare interface ConfigInternal extends Config {
    /**
     * @readonly
     */
    emulator?: {
        url: string;
    };
    /**
     * @readonly
     */
    clientPlatform: ClientPlatform;
}

/**
 * A result from a phone number sign-in, link, or reauthenticate call.
 *
 * @public
 */
export declare interface ConfirmationResult {
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
 * Completes the password reset process, given a confirmation code and new password.
 *
 * @param auth - The {@link Auth} instance.
 * @param oobCode - A confirmation code sent to the user.
 * @param newPassword - The new password.
 *
 * @public
 */
export declare function confirmPasswordReset(auth: Auth, oobCode: string, newPassword: string): Promise<void>;

/**
 * Changes the {@link Auth} instance to communicate with the Firebase Auth Emulator, instead of production
 * Firebase Auth services.
 *
 * @remarks
 * This must be called synchronously immediately following the first call to
 * {@link initializeAuth}.  Do not use with production credentials as emulator
 * traffic is not encrypted.
 *
 *
 * @example
 * ```javascript
 * connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param url - The URL at which the emulator is running (eg, 'http://localhost:9099').
 * @param options - Optional. `options.disableWarnings` defaults to `false`. Set it to
 * `true` to disable the warning banner attached to the DOM.
 *
 * @public
 */
export declare function connectAuthEmulator(auth: Auth, url: string, options?: {
    disableWarnings: boolean;
}): void;

/**
 * Creates a new user account associated with the specified email address and password.
 *
 * @remarks
 * On successful creation of the user account, this user will also be signed in to your application.
 *
 * User account creation can fail if the account already exists or the password is invalid.
 *
 * Note: The email address acts as a unique identifier for the user and enables an email-based
 * password reset. This function will create a new user account and set the initial user password.
 *
 * @param auth - The {@link Auth} instance.
 * @param email - The user's email address.
 * @param password - The user's chosen password.
 *
 * @public
 */
export declare function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;

/**
 * Map of OAuth Custom Parameters.
 *
 * @public
 */
export declare type CustomParameters = Record<string, string>;

/**
 * A verbose error map with detailed descriptions for most error codes.
 *
 * See discussion at {@link AuthErrorMap}
 *
 * @public
 */
export declare const debugErrorMap: AuthErrorMap;

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
export declare interface Dependencies {
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
 * Interface that represents the credentials returned by {@link EmailAuthProvider} for
 * {@link ProviderId}.PASSWORD
 *
 * @remarks
 * Covers both {@link SignInMethod}.EMAIL_PASSWORD and
 * {@link SignInMethod}.EMAIL_LINK.
 *
 * @public
 */
export declare class EmailAuthCredential extends AuthCredential {
    /** @internal */
    readonly _email: string;
    /** @internal */
    readonly _password: string;
    /** @internal */
    readonly _tenantId: string | null;
    /** @internal */
    private constructor();
    /** @internal */
    static _fromEmailAndPassword(email: string, password: string): EmailAuthCredential;
    /** @internal */
    static _fromEmailAndCode(email: string, oobCode: string, tenantId?: string | null): EmailAuthCredential;
    /** {@inheritdoc AuthCredential.toJSON} */
    toJSON(): object;
    /**
     * Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
     *
     * @param json - Either `object` or the stringified representation of the object. When string is
     * provided, `JSON.parse` would be called first.
     *
     * @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
     */
    static fromJSON(json: object | string): EmailAuthCredential | null;
    /** @internal */
    _getIdTokenResponse(auth: AuthInternal): Promise<IdTokenResponse>;
    /** @internal */
    _linkToIdToken(auth: AuthInternal, idToken: string): Promise<IdTokenResponse>;
    /** @internal */
    _getReauthenticationResolver(auth: AuthInternal): Promise<IdTokenResponse>;
}

/**
 * Provider for generating {@link EmailAuthCredential}.
 *
 * @public
 */
export declare class EmailAuthProvider implements AuthProvider {
    /**
     * Always set to {@link ProviderId}.PASSWORD, even for email link.
     */
    static readonly PROVIDER_ID: 'password';
    /**
     * Always set to {@link SignInMethod}.EMAIL_PASSWORD.
     */
    static readonly EMAIL_PASSWORD_SIGN_IN_METHOD: 'password';
    /**
     * Always set to {@link SignInMethod}.EMAIL_LINK.
     */
    static readonly EMAIL_LINK_SIGN_IN_METHOD: 'emailLink';
    /**
     * Always set to {@link ProviderId}.PASSWORD, even for email link.
     */
    readonly providerId: "password";
    /**
     * Initialize an {@link AuthCredential} using an email and password.
     *
     * @example
     * ```javascript
     * const authCredential = EmailAuthProvider.credential(email, password);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * ```javascript
     * const userCredential = await signInWithEmailAndPassword(auth, email, password);
     * ```
     *
     * @param email - Email address.
     * @param password - User account password.
     * @returns The auth provider credential.
     */
    static credential(email: string, password: string): EmailAuthCredential;
    /**
     * Initialize an {@link AuthCredential} using an email and an email link after a sign in with
     * email link operation.
     *
     * @example
     * ```javascript
     * const authCredential = EmailAuthProvider.credentialWithLink(auth, email, emailLink);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * ```javascript
     * await sendSignInLinkToEmail(auth, email);
     * // Obtain emailLink from user.
     * const userCredential = await signInWithEmailLink(auth, email, emailLink);
     * ```
     *
     * @param auth - The {@link Auth} instance used to verify the link.
     * @param email - Email address.
     * @param emailLink - Sign-in email link.
     * @returns - The auth provider credential.
     */
    static credentialWithLink(email: string, emailLink: string): EmailAuthCredential;
}

/**
 * Configuration of Firebase Authentication Emulator.
 * @public
 */
export declare interface EmulatorConfig {
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

declare const enum EnforcementState {
    ENFORCE = "ENFORCE",
    AUDIT = "AUDIT",
    OFF = "OFF",
    ENFORCEMENT_STATE_UNSPECIFIED = "ENFORCEMENT_STATE_UNSPECIFIED"
}
export { ErrorFn }

/**
 * @internal
 */
declare interface EventManager {
    registerConsumer(authEventConsumer: AuthEventConsumer): void;
    unregisterConsumer(authEventConsumer: AuthEventConsumer): void;
}

/**
 * Provider for generating an {@link OAuthCredential} for {@link ProviderId}.FACEBOOK.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new FacebookAuthProvider();
 * // Start a sign in process for an unauthenticated user.
 * provider.addScope('user_birthday');
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Facebook Access Token.
 *   const credential = FacebookAuthProvider.credentialFromResult(result);
 *   const token = credential.accessToken;
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new FacebookAuthProvider();
 * provider.addScope('user_birthday');
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Facebook Access Token.
 * const credential = FacebookAuthProvider.credentialFromResult(result);
 * const token = credential.accessToken;
 * ```
 *
 * @public
 */
export declare class FacebookAuthProvider extends BaseOAuthProvider {
    /** Always set to {@link SignInMethod}.FACEBOOK. */
    static readonly FACEBOOK_SIGN_IN_METHOD: 'facebook.com';
    /** Always set to {@link ProviderId}.FACEBOOK. */
    static readonly PROVIDER_ID: 'facebook.com';
    constructor();
    /**
     * Creates a credential for Facebook.
     *
     * @example
     * ```javascript
     * // `event` from the Facebook auth.authResponseChange callback.
     * const credential = FacebookAuthProvider.credential(event.authResponse.accessToken);
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param accessToken - Facebook access token.
     */
    static credential(accessToken: string): OAuthCredential;
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential: UserCredential): OAuthCredential | null;
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error: FirebaseError): OAuthCredential | null;
    private static credentialFromTaggedObject;
}

/**
 * An enum of factors that may be used for multifactor authentication.
 *
 * @public
 */
export declare const FactorId: {
    /** Phone as second factor */
    readonly PHONE: "phone";
    readonly TOTP: "totp";
};

/**
 * The base class for all Federated providers (OAuth (including OIDC), SAML).
 *
 * This class is not meant to be instantiated directly.
 *
 * @public
 */
declare abstract class FederatedAuthProvider implements AuthProvider {
    readonly providerId: string;
    /** @internal */
    defaultLanguageCode: string | null;
    /** @internal */
    private customParameters;
    /**
     * Constructor for generic OAuth providers.
     *
     * @param providerId - Provider for which credentials should be generated.
     */
    constructor(providerId: string);
    /**
     * Set the language gode.
     *
     * @param languageCode - language code
     */
    setDefaultLanguage(languageCode: string | null): void;
    /**
     * Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
     * operations.
     *
     * @remarks
     * For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
     * `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
     *
     * @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
     */
    setCustomParameters(customOAuthParameters: CustomParameters): AuthProvider;
    /**
     * Retrieve the current list of {@link CustomParameters}.
     */
    getCustomParameters(): CustomParameters;
}

/**
 * Gets the list of possible sign in methods for the given email address. This method returns an
 * empty list when [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection) is enabled, irrespective of the number of
 * authentication methods available for the given email.
 *
 * @remarks
 * This is useful to differentiate methods of sign-in for the same provider, eg.
 * {@link EmailAuthProvider} which has 2 methods of sign-in,
 * {@link SignInMethod}.EMAIL_PASSWORD and
 * {@link SignInMethod}.EMAIL_LINK.
 *
 * @param auth - The {@link Auth} instance.
 * @param email - The user's email address.
 *
 * Deprecated. Migrating off of this method is recommended as a security best-practice.
 * Learn more in the Identity Platform documentation for [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection).
 * @public
 */
export declare function fetchSignInMethodsForEmail(auth: Auth, email: string): Promise<string[]>;

declare interface FinalizeMfaResponse {
    idToken: string;
    refreshToken: string;
}

/**
 * @internal
 */
declare type GenericAuthErrorParams = {
    [key in Exclude<AuthErrorCode, AuthErrorCode.ARGUMENT_ERROR | AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH | AuthErrorCode.INTERNAL_ERROR | AuthErrorCode.MFA_REQUIRED | AuthErrorCode.NO_AUTH_EVENT | AuthErrorCode.OPERATION_NOT_SUPPORTED>]: {
        appName?: AppName;
        email?: string;
        phoneNumber?: string;
        message?: string;
    };
};

/**
 * Extracts provider specific {@link AdditionalUserInfo} for the given credential.
 *
 * @param userCredential - The user credential.
 *
 * @public
 */
export declare function getAdditionalUserInfo(userCredential: UserCredential): AdditionalUserInfo | null;

/**
 * Returns the Auth instance associated with the provided {@link @firebase/app#FirebaseApp}.
 * If no instance exists, initializes an Auth instance with platform-specific default dependencies.
 *
 * @param app - The Firebase App.
 *
 * @public
 */
export declare function getAuth(app?: FirebaseApp): Auth;

/**
 * Returns a JSON Web Token (JWT) used to identify the user to a Firebase service.
 *
 * @remarks
 * Returns the current token if it has not expired or if it will not expire in the next five
 * minutes. Otherwise, this will refresh the token and return a new one.
 *
 * @param user - The user.
 * @param forceRefresh - Force refresh regardless of token expiration.
 *
 * @public
 */
export declare function getIdToken(user: User, forceRefresh?: boolean): Promise<string>;

/**
 * Returns a deserialized JSON Web Token (JWT) used to identify the user to a Firebase service.
 *
 * @remarks
 * Returns the current token if it has not expired or if it will not expire in the next five
 * minutes. Otherwise, this will refresh the token and return a new one.
 *
 * @param user - The user.
 * @param forceRefresh - Force refresh regardless of token expiration.
 *
 * @public
 */
export declare function getIdTokenResult(user: User, forceRefresh?: boolean): Promise<IdTokenResult>;

/**
 * Provides a {@link MultiFactorResolver} suitable for completion of a
 * multi-factor flow.
 *
 * @param auth - The {@link Auth} instance.
 * @param error - The {@link MultiFactorError} raised during a sign-in, or
 * reauthentication operation.
 *
 * @public
 */
export declare function getMultiFactorResolver(auth: Auth, error: MultiFactorError): MultiFactorResolver;

declare interface GetRecaptchaConfigResponse {
    recaptchaKey: string;
    recaptchaEnforcementState: RecaptchaEnforcementProviderState[];
}

/**
 * Returns a {@link UserCredential} from the redirect-based sign-in flow.
 *
 * @remarks
 * If sign-in succeeded, returns the signed in user. If sign-in was unsuccessful, fails with an
 * error. If no redirect operation was called, returns `null`.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new FacebookAuthProvider();
 * // You can add additional scopes to the provider:
 * provider.addScope('user_birthday');
 * // Start a sign in process for an unauthenticated user.
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Facebook Access Token.
 *   const credential = provider.credentialFromResult(auth, result);
 *   const token = credential.accessToken;
 * }
 * // As this API can be used for sign-in, linking and reauthentication,
 * // check the operationType to determine what triggered this redirect
 * // operation.
 * const operationType = result.operationType;
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
export declare function getRedirectResult(auth: Auth, resolver?: PopupRedirectResolver): Promise<UserCredential | null>;

/**
 * Provider for generating an {@link OAuthCredential} for {@link ProviderId}.GITHUB.
 *
 * @remarks
 * GitHub requires an OAuth 2.0 redirect, so you can either handle the redirect directly, or use
 * the {@link signInWithPopup} handler:
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new GithubAuthProvider();
 * // Start a sign in process for an unauthenticated user.
 * provider.addScope('repo');
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Github Access Token.
 *   const credential = GithubAuthProvider.credentialFromResult(result);
 *   const token = credential.accessToken;
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new GithubAuthProvider();
 * provider.addScope('repo');
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Github Access Token.
 * const credential = GithubAuthProvider.credentialFromResult(result);
 * const token = credential.accessToken;
 * ```
 * @public
 */
export declare class GithubAuthProvider extends BaseOAuthProvider {
    /** Always set to {@link SignInMethod}.GITHUB. */
    static readonly GITHUB_SIGN_IN_METHOD: 'github.com';
    /** Always set to {@link ProviderId}.GITHUB. */
    static readonly PROVIDER_ID: 'github.com';
    constructor();
    /**
     * Creates a credential for Github.
     *
     * @param accessToken - Github access token.
     */
    static credential(accessToken: string): OAuthCredential;
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential: UserCredential): OAuthCredential | null;
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error: FirebaseError): OAuthCredential | null;
    private static credentialFromTaggedObject;
}

/**
 * Provider for generating an an {@link OAuthCredential} for {@link ProviderId}.GOOGLE.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new GoogleAuthProvider();
 * // Start a sign in process for an unauthenticated user.
 * provider.addScope('profile');
 * provider.addScope('email');
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Google Access Token.
 *   const credential = GoogleAuthProvider.credentialFromResult(result);
 *   const token = credential.accessToken;
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new GoogleAuthProvider();
 * provider.addScope('profile');
 * provider.addScope('email');
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Google Access Token.
 * const credential = GoogleAuthProvider.credentialFromResult(result);
 * const token = credential.accessToken;
 * ```
 *
 * @public
 */
export declare class GoogleAuthProvider extends BaseOAuthProvider {
    /** Always set to {@link SignInMethod}.GOOGLE. */
    static readonly GOOGLE_SIGN_IN_METHOD: 'google.com';
    /** Always set to {@link ProviderId}.GOOGLE. */
    static readonly PROVIDER_ID: 'google.com';
    constructor();
    /**
     * Creates a credential for Google. At least one of ID token and access token is required.
     *
     * @example
     * ```javascript
     * // \`googleUser\` from the onsuccess Google Sign In callback.
     * const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param idToken - Google ID token.
     * @param accessToken - Google access token.
     */
    static credential(idToken?: string | null, accessToken?: string | null): OAuthCredential;
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential: UserCredential): OAuthCredential | null;
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error: FirebaseError): OAuthCredential | null;
    private static credentialFromTaggedObject;
}

/**
 * Raw encoded JWT
 *
 */
declare type IdToken = string;

/**
 * @internal
 */
declare interface IdTokenMfaResponse extends IdTokenResponse {
    mfaPendingCredential?: string;
    mfaInfo?: MfaEnrollment[];
}

/**
 * IdToken as returned by the API
 *
 * @internal
 */
declare interface IdTokenResponse {
    localId: string;
    idToken?: IdToken;
    refreshToken?: string;
    expiresIn?: string;
    providerId?: string;
    displayName?: string | null;
    isNewUser?: boolean;
    kind?: IdTokenResponseKind;
    photoUrl?: string | null;
    rawUserInfo?: string;
    screenName?: string | null;
}

/**
 * The possible types of the `IdTokenResponse`
 *
 * @internal
 */
declare const enum IdTokenResponseKind {
    CreateAuthUri = "identitytoolkit#CreateAuthUriResponse",
    DeleteAccount = "identitytoolkit#DeleteAccountResponse",
    DownloadAccount = "identitytoolkit#DownloadAccountResponse",
    EmailLinkSignin = "identitytoolkit#EmailLinkSigninResponse",
    GetAccountInfo = "identitytoolkit#GetAccountInfoResponse",
    GetOobConfirmationCode = "identitytoolkit#GetOobConfirmationCodeResponse",
    GetRecaptchaParam = "identitytoolkit#GetRecaptchaParamResponse",
    ResetPassword = "identitytoolkit#ResetPasswordResponse",
    SetAccountInfo = "identitytoolkit#SetAccountInfoResponse",
    SignupNewUser = "identitytoolkit#SignupNewUserResponse",
    UploadAccount = "identitytoolkit#UploadAccountResponse",
    VerifyAssertion = "identitytoolkit#VerifyAssertionResponse",
    VerifyCustomToken = "identitytoolkit#VerifyCustomTokenResponse",
    VerifyPassword = "identitytoolkit#VerifyPasswordResponse"
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
export declare interface IdTokenResult {
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
 * An implementation of {@link Persistence} of type `LOCAL` using `indexedDB`
 * for the underlying storage.
 *
 * @public
 */
export declare const indexedDBLocalPersistence: Persistence;

/**
 * Initializes an {@link Auth} instance with fine-grained control over
 * {@link Dependencies}.
 *
 * @remarks
 *
 * This function allows more control over the {@link Auth} instance than
 * {@link getAuth}. `getAuth` uses platform-specific defaults to supply
 * the {@link Dependencies}. In general, `getAuth` is the easiest way to
 * initialize Auth and works for most use cases. Use `initializeAuth` if you
 * need control over which persistence layer is used, or to minimize bundle
 * size if you're not using either `signInWithPopup` or `signInWithRedirect`.
 *
 * For example, if your app only uses anonymous accounts and you only want
 * accounts saved for the current session, initialize `Auth` with:
 *
 * ```js
 * const auth = initializeAuth(app, {
 *   persistence: browserSessionPersistence,
 *   popupRedirectResolver: undefined,
 * });
 * ```
 *
 * @public
 */
export declare function initializeAuth(app: FirebaseApp, deps?: Dependencies): Auth;

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
 * An implementation of {@link Persistence} of type 'NONE'.
 *
 * @public
 */
export declare const inMemoryPersistence: Persistence;

/**
 * Checks if an incoming link is a sign-in with email link suitable for {@link signInWithEmailLink}.
 *
 * @param auth - The {@link Auth} instance.
 * @param emailLink - The link sent to the user's email address.
 *
 * @public
 */
export declare function isSignInWithEmailLink(auth: Auth, emailLink: string): boolean;

/**
 * Links the user account with the given credentials.
 *
 * @remarks
 * An {@link AuthProvider} can be used to generate the credential.
 *
 * @param user - The user.
 * @param credential - The auth credential.
 *
 * @public
 */
export declare function linkWithCredential(user: User, credential: AuthCredential): Promise<UserCredential>;

/**
 * Links the user account with the given phone number.
 *
 * @remarks
 * This method does not work in a Node.js environment.
 *
 * @param user - The user.
 * @param phoneNumber - The user's phone number in E.164 format (e.g. +16505550101).
 * @param appVerifier - The {@link ApplicationVerifier}.
 *
 * @public
 */
export declare function linkWithPhoneNumber(user: User, phoneNumber: string, appVerifier: ApplicationVerifier): Promise<ConfirmationResult>;

/**
 * Links the authenticated provider to the user account using a pop-up based OAuth flow.
 *
 * @remarks
 * If the linking is successful, the returned result will contain the user and the provider's credential.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using some other provider.
 * const result = await signInWithEmailAndPassword(auth, email, password);
 * // Link using a popup.
 * const provider = new FacebookAuthProvider();
 * await linkWithPopup(result.user, provider);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
export declare function linkWithPopup(user: User, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<UserCredential>;

/**
 * Links the {@link OAuthProvider} to the user account using a full-page redirect flow.
 * @remarks
 * To handle the results and errors for this operation, refer to {@link getRedirectResult}.
 * Follow the {@link https://firebase.google.com/docs/auth/web/redirect-best-practices
 * | best practices} when using {@link linkWithRedirect}.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using some other provider.
 * const result = await signInWithEmailAndPassword(auth, email, password);
 * // Link using a redirect.
 * const provider = new FacebookAuthProvider();
 * await linkWithRedirect(result.user, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
export declare function linkWithRedirect(user: User, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<never>;

/**
 * MfaEnrollment can be any subtype of BaseMfaEnrollment, currently only PhoneMfaEnrollment and TotpMfaEnrollment are supported.
 */
declare type MfaEnrollment = PhoneMfaEnrollment | TotpMfaEnrollment;

/**
 * The {@link MultiFactorUser} corresponding to the user.
 *
 * @remarks
 * This is used to access all multi-factor properties and operations related to the user.
 *
 * @param user - The user.
 *
 * @public
 */
export declare function multiFactor(user: User): MultiFactorUser;

/**
 * The base class for asserting ownership of a second factor.
 *
 * @remarks
 * This is used to facilitate enrollment of a second factor on an existing user or sign-in of a
 * user who already verified the first factor.
 *
 * @public
 */
export declare interface MultiFactorAssertion {
    /** The identifier of the second factor. */
    readonly factorId: (typeof FactorId)[keyof typeof FactorId];
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
export declare interface MultiFactorError extends AuthError {
    /** Details about the MultiFactorError. */
    readonly customData: AuthError['customData'] & {
        /**
         * The type of operation (sign-in, linking, or re-authentication) that raised the error.
         */
        readonly operationType: (typeof OperationType)[keyof typeof OperationType];
    };
}

/**
 * A structure containing the information of a second factor entity.
 *
 * @public
 */
export declare interface MultiFactorInfo {
    /** The multi-factor enrollment ID. */
    readonly uid: string;
    /** The user friendly name of the current second factor. */
    readonly displayName?: string | null;
    /** The enrollment date of the second factor formatted as a UTC string. */
    readonly enrollmentTime: string;
    /** The identifier of the second factor. */
    readonly factorId: (typeof FactorId)[keyof typeof FactorId];
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
export declare interface MultiFactorResolver {
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
export declare interface MultiFactorSession {
}

/**
 * An interface that defines the multi-factor related properties and operations pertaining
 * to a {@link User}.
 *
 * @public
 */
export declare interface MultiFactorUser {
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

declare type MutableUserInfo = {
    -readonly [K in keyof UserInfo]: UserInfo[K];
};
export { NextFn }

/**
 * Type definition for an event callback.
 *
 * @privateRemarks TODO(avolkovi): should we consolidate with Subscribe<T> since we're changing the API anyway?
 *
 * @public
 */
export declare type NextOrObserver<T> = NextFn<T | null> | Observer<T | null>;

/**
 * Represents the OAuth credentials returned by an {@link OAuthProvider}.
 *
 * @remarks
 * Implementations specify the details about each auth provider's credential requirements.
 *
 * @public
 */
export declare class OAuthCredential extends AuthCredential {
    /**
     * The OAuth ID token associated with the credential if it belongs to an OIDC provider,
     * such as `google.com`.
     * @readonly
     */
    idToken?: string;
    /**
     * The OAuth access token associated with the credential if it belongs to an
     * {@link OAuthProvider}, such as `facebook.com`, `twitter.com`, etc.
     * @readonly
     */
    accessToken?: string;
    /**
     * The OAuth access token secret associated with the credential if it belongs to an OAuth 1.0
     * provider, such as `twitter.com`.
     * @readonly
     */
    secret?: string;
    private nonce?;
    private pendingToken;
    /** @internal */
    static _fromParams(params: OAuthCredentialParams): OAuthCredential;
    /** {@inheritdoc AuthCredential.toJSON}  */
    toJSON(): object;
    /**
     * Static method to deserialize a JSON representation of an object into an
     * {@link  AuthCredential}.
     *
     * @param json - Input can be either Object or the stringified representation of the object.
     * When string is provided, JSON.parse would be called first.
     *
     * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
     */
    static fromJSON(json: string | object): OAuthCredential | null;
    /** @internal */
    _getIdTokenResponse(auth: AuthInternal): Promise<IdTokenResponse>;
    /** @internal */
    _linkToIdToken(auth: AuthInternal, idToken: string): Promise<IdTokenResponse>;
    /** @internal */
    _getReauthenticationResolver(auth: AuthInternal): Promise<IdTokenResponse>;
    private buildRequest;
}

/**
 * Defines the options for initializing an {@link OAuthCredential}.
 *
 * @remarks
 * For ID tokens with nonce claim, the raw nonce has to also be provided.
 *
 * @public
 */
export declare interface OAuthCredentialOptions {
    /**
     * The OAuth ID token used to initialize the {@link OAuthCredential}.
     */
    idToken?: string;
    /**
     * The OAuth access token used to initialize the {@link OAuthCredential}.
     */
    accessToken?: string;
    /**
     * The raw nonce associated with the ID token.
     *
     * @remarks
     * It is required when an ID token with a nonce field is provided. The SHA-256 hash of the
     * raw nonce must match the nonce field in the ID token.
     */
    rawNonce?: string;
}

declare interface OAuthCredentialParams {
    idToken?: string | null;
    accessToken?: string | null;
    oauthToken?: string;
    secret?: string;
    oauthTokenSecret?: string;
    nonce?: string;
    pendingToken?: string;
    providerId: string;
    signInMethod: string;
}

/**
 * Provider for generating generic {@link OAuthCredential}.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new OAuthProvider('google.com');
 * // Start a sign in process for an unauthenticated user.
 * provider.addScope('profile');
 * provider.addScope('email');
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a OAuth Access Token for the provider.
 *   const credential = provider.credentialFromResult(auth, result);
 *   const token = credential.accessToken;
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new OAuthProvider('google.com');
 * provider.addScope('profile');
 * provider.addScope('email');
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a OAuth Access Token for the provider.
 * const credential = provider.credentialFromResult(auth, result);
 * const token = credential.accessToken;
 * ```
 * @public
 */
export declare class OAuthProvider extends BaseOAuthProvider {
    /**
     * Creates an {@link OAuthCredential} from a JSON string or a plain object.
     * @param json - A plain object or a JSON string
     */
    static credentialFromJSON(json: object | string): OAuthCredential;
    /**
     * Creates a {@link OAuthCredential} from a generic OAuth provider's access token or ID token.
     *
     * @remarks
     * The raw nonce is required when an ID token with a nonce field is provided. The SHA-256 hash of
     * the raw nonce must match the nonce field in the ID token.
     *
     * @example
     * ```javascript
     * // `googleUser` from the onsuccess Google Sign In callback.
     * // Initialize a generate OAuth provider with a `google.com` providerId.
     * const provider = new OAuthProvider('google.com');
     * const credential = provider.credential({
     *   idToken: googleUser.getAuthResponse().id_token,
     * });
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param params - Either the options object containing the ID token, access token and raw nonce
     * or the ID token string.
     */
    credential(params: OAuthCredentialOptions): OAuthCredential;
    /** An internal credential method that accepts more permissive options */
    private _credential;
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential: UserCredential): OAuthCredential | null;
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error: FirebaseError): OAuthCredential | null;
    private static oauthCredentialFromTaggedObject;
}

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
 * Enumeration of supported operation types.
 *
 * @public
 */
export declare const OperationType: {
    /** Operation involving linking an additional provider to an already signed-in user. */
    readonly LINK: "link";
    /** Operation involving using a provider to reauthenticate an already signed-in user. */
    readonly REAUTHENTICATE: "reauthenticate";
    /** Operation involving signing in a user. */
    readonly SIGN_IN: "signIn";
};

/**
 * Parses the email action link string and returns an {@link ActionCodeURL} if
 * the link is valid, otherwise returns null.
 *
 * @public
 */
export declare function parseActionCodeURL(link: string): ActionCodeURL | null;

/**
 * Interface representing a parsed ID token.
 *
 * @privateRemarks TODO(avolkovi): consolidate with parsed_token in implementation.
 *
 * @public
 */
export declare interface ParsedToken {
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
 * A structure specifying password policy requirements.
 *
 * @public
 */
export declare interface PasswordPolicy {
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
 * Internal typing of the password policy custom strength options that is modifiable. This
 * allows us to construct the strength options before storing them in the policy.
 *
 * @internal
 */
declare interface PasswordPolicyCustomStrengthOptions {
    /**
     * Minimum password length.
     */
    minPasswordLength?: number;
    /**
     * Maximum password length.
     */
    maxPasswordLength?: number;
    /**
     * Whether the password should contain a lowercase letter.
     */
    containsLowercaseLetter?: boolean;
    /**
     * Whether the password should contain an uppercase letter.
     */
    containsUppercaseLetter?: boolean;
    /**
     * Whether the password should contain a numeric character.
     */
    containsNumericCharacter?: boolean;
    /**
     * Whether the password should contain a non-alphanumeric character.
     */
    containsNonAlphanumericCharacter?: boolean;
}

/**
 * Internal typing of password policy that includes the schema version and methods for
 * validating that a password meets the policy. The developer does not need access to
 * these properties and methods, so they are excluded from the public typing.
 *
 * @internal
 */
declare interface PasswordPolicyInternal extends PasswordPolicy {
    /**
     * Requirements enforced by the password policy.
     */
    readonly customStrengthOptions: PasswordPolicyCustomStrengthOptions;
    /**
     * Schema version of the password policy.
     */
    readonly schemaVersion: number;
    /**
     * Validates the password against the policy.
     * @param password Password to validate.
     */
    validatePassword(password: string): PasswordValidationStatus;
}

/**
 * A structure indicating which password policy requirements were met or violated and what the
 * requirements are.
 *
 * @public
 */
export declare interface PasswordValidationStatus {
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

declare type PersistedBlob = Record<string, unknown>;

/**
 * An interface covering the possible persistence mechanism types.
 *
 * @public
 */
export declare interface Persistence {
    /**
     * Type of Persistence.
     * - 'SESSION' is used for temporary persistence such as `sessionStorage`.
     * - 'LOCAL' is used for long term persistence such as `localStorage` or `IndexedDB`.
     * - 'NONE' is used for in-memory, or no persistence.
     */
    readonly type: 'SESSION' | 'LOCAL' | 'NONE';
}

/**
 * Represents the credentials returned by {@link PhoneAuthProvider}.
 *
 * @public
 */
export declare class PhoneAuthCredential extends AuthCredential {
    private readonly params;
    private constructor();
    /** @internal */
    static _fromVerification(verificationId: string, verificationCode: string): PhoneAuthCredential;
    /** @internal */
    static _fromTokenResponse(phoneNumber: string, temporaryProof: string): PhoneAuthCredential;
    /** @internal */
    _getIdTokenResponse(auth: AuthInternal): Promise<PhoneOrOauthTokenResponse>;
    /** @internal */
    _linkToIdToken(auth: AuthInternal, idToken: string): Promise<IdTokenResponse>;
    /** @internal */
    _getReauthenticationResolver(auth: AuthInternal): Promise<IdTokenResponse>;
    /** @internal */
    _makeVerificationRequest(): SignInWithPhoneNumberRequest;
    /** {@inheritdoc AuthCredential.toJSON} */
    toJSON(): object;
    /** Generates a phone credential based on a plain object or a JSON string. */
    static fromJSON(json: object | string): PhoneAuthCredential | null;
}

/**
 * Provider for generating an {@link PhoneAuthCredential}.
 *
 * @remarks
 * `PhoneAuthProvider` does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // 'recaptcha-container' is the ID of an element in the DOM.
 * const applicationVerifier = new RecaptchaVerifier('recaptcha-container');
 * const provider = new PhoneAuthProvider(auth);
 * const verificationId = await provider.verifyPhoneNumber('+16505550101', applicationVerifier);
 * // Obtain the verificationCode from the user.
 * const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
 * const userCredential = await signInWithCredential(auth, phoneCredential);
 * ```
 *
 * @public
 */
export declare class PhoneAuthProvider {
    /** Always set to {@link ProviderId}.PHONE. */
    static readonly PROVIDER_ID: 'phone';
    /** Always set to {@link SignInMethod}.PHONE. */
    static readonly PHONE_SIGN_IN_METHOD: 'phone';
    /** Always set to {@link ProviderId}.PHONE. */
    readonly providerId: "phone";
    private readonly auth;
    /**
     * @param auth - The Firebase {@link Auth} instance in which sign-ins should occur.
     *
     */
    constructor(auth: Auth);
    /**
     *
     * Starts a phone number authentication flow by sending a verification code to the given phone
     * number.
     *
     * @example
     * ```javascript
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * An alternative flow is provided using the `signInWithPhoneNumber` method.
     * ```javascript
     * const confirmationResult = signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const userCredential = confirmationResult.confirm(verificationCode);
     * ```
     *
     * @param phoneInfoOptions - The user's {@link PhoneInfoOptions}. The phone number should be in
     * E.164 format (e.g. +16505550101).
     * @param applicationVerifier - For abuse prevention, this method also requires a
     * {@link ApplicationVerifier}. This SDK includes a reCAPTCHA-based implementation,
     * {@link RecaptchaVerifier}.
     *
     * @returns A Promise for a verification ID that can be passed to
     * {@link PhoneAuthProvider.credential} to identify this flow..
     */
    verifyPhoneNumber(phoneOptions: PhoneInfoOptions | string, applicationVerifier: ApplicationVerifier): Promise<string>;
    /**
     * Creates a phone auth credential, given the verification ID from
     * {@link PhoneAuthProvider.verifyPhoneNumber} and the code that was sent to the user's
     * mobile device.
     *
     * @example
     * ```javascript
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const userCredential = signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * An alternative flow is provided using the `signInWithPhoneNumber` method.
     * ```javascript
     * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const userCredential = await confirmationResult.confirm(verificationCode);
     * ```
     *
     * @param verificationId - The verification ID returned from {@link PhoneAuthProvider.verifyPhoneNumber}.
     * @param verificationCode - The verification code sent to the user's mobile device.
     *
     * @returns The auth provider credential.
     */
    static credential(verificationId: string, verificationCode: string): PhoneAuthCredential;
    /**
     * Generates an {@link AuthCredential} from a {@link UserCredential}.
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential: UserCredential): AuthCredential | null;
    /**
     * Returns an {@link AuthCredential} when passed an error.
     *
     * @remarks
     *
     * This method works for errors like
     * `auth/account-exists-with-different-credentials`. This is useful for
     * recovering when attempting to set a user's phone number but the number
     * in question is already tied to another account. For example, the following
     * code tries to update the current user's phone number, and if that
     * fails, links the user with the account associated with that number:
     *
     * ```js
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = await provider.verifyPhoneNumber(number, verifier);
     * try {
     *   const code = ''; // Prompt the user for the verification code
     *   await updatePhoneNumber(
     *       auth.currentUser,
     *       PhoneAuthProvider.credential(verificationId, code));
     * } catch (e) {
     *   if ((e as FirebaseError)?.code === 'auth/account-exists-with-different-credential') {
     *     const cred = PhoneAuthProvider.credentialFromError(e);
     *     await linkWithCredential(auth.currentUser, cred);
     *   }
     * }
     *
     * // At this point, auth.currentUser.phoneNumber === number.
     * ```
     *
     * @param error - The error to generate a credential from.
     */
    static credentialFromError(error: FirebaseError): AuthCredential | null;
    private static credentialFromTaggedObject;
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
 * An MFA provided by SMS verification.
 */
declare interface PhoneMfaEnrollment extends BaseMfaEnrollment {
    phoneInfo: string;
}

/**
 * The class for asserting ownership of a phone second factor. Provided by
 * {@link PhoneMultiFactorGenerator.assertion}.
 *
 * @public
 */
export declare interface PhoneMultiFactorAssertion extends MultiFactorAssertion {
}

/**
 * Options used for enrolling a second factor.
 *
 * @public
 */
export declare interface PhoneMultiFactorEnrollInfoOptions {
    /** Phone number to send a verification code to. */
    phoneNumber: string;
    /** The {@link MultiFactorSession} obtained via {@link MultiFactorUser.getSession}. */
    session: MultiFactorSession;
}

/**
 * Provider for generating a {@link PhoneMultiFactorAssertion}.
 *
 * @public
 */
export declare class PhoneMultiFactorGenerator {
    private constructor();
    /**
     * Provides a {@link PhoneMultiFactorAssertion} to confirm ownership of the phone second factor.
     *
     * @remarks
     * This method does not work in a Node.js environment.
     *
     * @param phoneAuthCredential - A credential provided by {@link PhoneAuthProvider.credential}.
     * @returns A {@link PhoneMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}
     */
    static assertion(credential: PhoneAuthCredential): PhoneMultiFactorAssertion;
    /**
     * The identifier of the phone second factor: `phone`.
     */
    static FACTOR_ID: string;
}

/**
 * The subclass of the {@link MultiFactorInfo} interface for phone number
 * second factors. The `factorId` of this second factor is {@link FactorId}.PHONE.
 * @public
 */
export declare interface PhoneMultiFactorInfo extends MultiFactorInfo {
    /** The phone number associated with the current second factor. */
    readonly phoneNumber: string;
}

/**
 * Options used for signing in with a second factor.
 *
 * @public
 */
export declare interface PhoneMultiFactorSignInInfoOptions {
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
 * @internal
 */
declare type PhoneOrOauthTokenResponse = SignInWithPhoneNumberResponse | SignInWithIdpResponse | IdTokenResponse;

/**
 * Options used for single-factor sign-in.
 *
 * @public
 */
export declare interface PhoneSingleFactorInfoOptions {
    /** Phone number to send a verification code to. */
    phoneNumber: string;
}

/**
 * A resolver used for handling DOM specific operations like {@link signInWithPopup}
 * or {@link signInWithRedirect}.
 *
 * @public
 */
export declare interface PopupRedirectResolver {
}

/**
 * We need to mark this interface as internal explicitly to exclude it in the public typings, because
 * it references AuthInternal which has a circular dependency with UserInternal.
 *
 * @internal
 */
declare interface PopupRedirectResolverInternal extends PopupRedirectResolver {
    _shouldInitProactively: boolean;
    _initialize(auth: AuthInternal): Promise<EventManager>;
    _openPopup(auth: AuthInternal, provider: AuthProvider, authType: AuthEventType, eventId?: string): Promise<AuthPopup>;
    _openRedirect(auth: AuthInternal, provider: AuthProvider, authType: AuthEventType, eventId?: string): Promise<void | never>;
    _isIframeWebStorageSupported(auth: AuthInternal, cb: (support: boolean) => unknown): void;
    _redirectPersistence: Persistence;
    _originValidation(auth: Auth): Promise<void>;
    _completeRedirectFn: (auth: Auth, resolver: PopupRedirectResolver, bypassAuthState: boolean) => Promise<UserCredential | null>;
    _overrideRedirectResult: (auth: AuthInternal, resultGetter: () => Promise<UserCredentialInternal | null>) => void;
}

/**
 * A minimal error map with all verbose error messages stripped.
 *
 * See discussion at {@link AuthErrorMap}
 *
 * @public
 */
export declare const prodErrorMap: AuthErrorMap;

/**
 * Enumeration of supported providers.
 *
 * @public
 */
export declare const ProviderId: {
    /** Facebook provider ID */
    readonly FACEBOOK: "facebook.com";
    /** GitHub provider ID */
    readonly GITHUB: "github.com";
    /** Google provider ID */
    readonly GOOGLE: "google.com";
    /** Password provider */
    readonly PASSWORD: "password";
    /** Phone provider */
    readonly PHONE: "phone";
    /** Twitter provider ID */
    readonly TWITTER: "twitter.com";
};

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
 * Enumeration of supported providers.
 * @internal
 */
declare const enum ProviderId_2 {
    /** @internal */
    ANONYMOUS = "anonymous",
    /** @internal */
    CUSTOM = "custom",
    /** Facebook provider ID */
    FACEBOOK = "facebook.com",
    /** @internal */
    FIREBASE = "firebase",
    /** GitHub provider ID */
    GITHUB = "github.com",
    /** Google provider ID */
    GOOGLE = "google.com",
    /** Password provider */
    PASSWORD = "password",
    /** Phone provider */
    PHONE = "phone",
    /** Twitter provider ID */
    TWITTER = "twitter.com"
}

declare interface ProviderUserInfo {
    providerId: string;
    rawId?: string;
    email?: string;
    displayName?: string;
    photoUrl?: string;
    phoneNumber?: string;
}

/**
 * Interface for a supplied `AsyncStorage`.
 *
 * @public
 */
export declare interface ReactNativeAsyncStorage {
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
 * Re-authenticates a user using a fresh credential.
 *
 * @remarks
 * Use before operations such as {@link updatePassword} that require tokens from recent sign-in
 * attempts. This method can be used to recover from a `CREDENTIAL_TOO_OLD_LOGIN_AGAIN` error
 * or a `TOKEN_EXPIRED` error.
 *
 * @param user - The user.
 * @param credential - The auth credential.
 *
 * @public
 */
export declare function reauthenticateWithCredential(user: User, credential: AuthCredential): Promise<UserCredential>;

/**
 * Re-authenticates a user using a fresh phone credential.
 *
 * @remarks
 * Use before operations such as {@link updatePassword} that require tokens from recent sign-in attempts.
 *
 * This method does not work in a Node.js environment.
 *
 * @param user - The user.
 * @param phoneNumber - The user's phone number in E.164 format (e.g. +16505550101).
 * @param appVerifier - The {@link ApplicationVerifier}.
 *
 * @public
 */
export declare function reauthenticateWithPhoneNumber(user: User, phoneNumber: string, appVerifier: ApplicationVerifier): Promise<ConfirmationResult>;

/**
 * Reauthenticates the current user with the specified {@link OAuthProvider} using a pop-up based
 * OAuth flow.
 *
 * @remarks
 * If the reauthentication is successful, the returned result will contain the user and the
 * provider's credential.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithPopup(auth, provider);
 * // Reauthenticate using a popup.
 * await reauthenticateWithPopup(result.user, provider);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
export declare function reauthenticateWithPopup(user: User, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<UserCredential>;

/**
 * Reauthenticates the current user with the specified {@link OAuthProvider} using a full-page redirect flow.
 * @remarks
 * To handle the results and errors for this operation, refer to {@link getRedirectResult}.
 * Follow the {@link https://firebase.google.com/docs/auth/web/redirect-best-practices
 * | best practices} when using {@link reauthenticateWithRedirect}.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * // Reauthenticate using a redirect.
 * await reauthenticateWithRedirect(result.user, provider);
 * // This will again trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
export declare function reauthenticateWithRedirect(user: User, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<never>;

declare interface Recaptcha {
    render: (container: HTMLElement, parameters: RecaptchaParameters) => number;
    getResponse: (id: number) => string;
    execute: (id: number) => unknown;
    reset: (id: number) => unknown;
}

declare class RecaptchaConfig {
    /**
     * The reCAPTCHA site key.
     */
    siteKey: string;
    /**
     * The list of providers and their enablement status for reCAPTCHA Enterprise.
     */
    recaptchaEnforcementState: RecaptchaEnforcementProviderState[];
    constructor(response: GetRecaptchaConfigResponse);
    /**
     * Returns the reCAPTCHA Enterprise enforcement state for the given provider.
     *
     * @param providerStr - The provider whose enforcement state is to be returned.
     * @returns The reCAPTCHA Enterprise enforcement state for the given provider.
     */
    getProviderEnforcementState(providerStr: string): EnforcementState | null;
    /**
     * Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
     *
     * @param providerStr - The provider whose enablement state is to be returned.
     * @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
     */
    isProviderEnabled(providerStr: string): boolean;
}

declare interface RecaptchaEnforcementProviderState {
    provider: string;
    enforcementState: string;
}

/**
 * We need to mark this interface as internal explicitly to exclude it in the public typings, because
 * it references AuthInternal which has a circular dependency with UserInternal.
 *
 * @internal
 */
declare interface ReCaptchaLoader {
    load(auth: AuthInternal, hl?: string): Promise<Recaptcha>;
    clearedOneInstance(): void;
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
export declare interface RecaptchaParameters {
    [key: string]: any;
}

/**
 * An {@link https://www.google.com/recaptcha/ | reCAPTCHA}-based application verifier.
 *
 * @remarks
 * `RecaptchaVerifier` does not work in a Node.js environment.
 *
 * @public
 */
export declare class RecaptchaVerifier implements ApplicationVerifierInternal {
    private readonly parameters;
    /**
     * The application verifier type.
     *
     * @remarks
     * For a reCAPTCHA verifier, this is 'recaptcha'.
     */
    readonly type = "recaptcha";
    private destroyed;
    private widgetId;
    private readonly container;
    private readonly isInvisible;
    private readonly tokenChangeListeners;
    private renderPromise;
    private readonly auth;
    /** @internal */
    readonly _recaptchaLoader: ReCaptchaLoader;
    private recaptcha;
    /**
     * @param authExtern - The corresponding Firebase {@link Auth} instance.
     *
     * @param containerOrId - The reCAPTCHA container parameter.
     *
     * @remarks
     * This has different meaning depending on whether the reCAPTCHA is hidden or visible. For a
     * visible reCAPTCHA the container must be empty. If a string is used, it has to correspond to
     * an element ID. The corresponding element must also must be in the DOM at the time of
     * initialization.
     *
     * @param parameters - The optional reCAPTCHA parameters.
     *
     * @remarks
     * Check the reCAPTCHA docs for a comprehensive list. All parameters are accepted except for
     * the sitekey. Firebase Auth backend provisions a reCAPTCHA for each project and will
     * configure this upon rendering. For an invisible reCAPTCHA, a size key must have the value
     * 'invisible'.
     */
    constructor(authExtern: Auth, containerOrId: HTMLElement | string, parameters?: RecaptchaParameters);
    /**
     * Waits for the user to solve the reCAPTCHA and resolves with the reCAPTCHA token.
     *
     * @returns A Promise for the reCAPTCHA token.
     */
    verify(): Promise<string>;
    /**
     * Renders the reCAPTCHA widget on the page.
     *
     * @returns A Promise that resolves with the reCAPTCHA widget ID.
     */
    render(): Promise<number>;
    /** @internal */
    _reset(): void;
    /**
     * Clears the reCAPTCHA widget from the page and destroys the instance.
     */
    clear(): void;
    private validateStartingState;
    private makeTokenCallback;
    private assertNotDestroyed;
    private makeRenderPromise;
    private init;
    private getAssertedRecaptcha;
}

/**
 * Reloads user account data, if signed in.
 *
 * @param user - The user.
 *
 * @public
 */
export declare function reload(user: User): Promise<void>;

/**
 * Revokes the given access token. Currently only supports Apple OAuth access tokens.
 *
 * @param auth - The {@link Auth} instance.
 * @param token - The Apple OAuth access token.
 *
 * @public
 */
export declare function revokeAccessToken(auth: Auth, token: string): Promise<void>;

/**
 * An {@link AuthProvider} for SAML.
 *
 * @public
 */
export declare class SAMLAuthProvider extends FederatedAuthProvider {
    /**
     * Constructor. The providerId must start with "saml."
     * @param providerId - SAML provider ID.
     */
    constructor(providerId: string);
    /**
     * Generates an {@link AuthCredential} from a {@link UserCredential} after a
     * successful SAML flow completes.
     *
     * @remarks
     *
     * For example, to get an {@link AuthCredential}, you could write the
     * following code:
     *
     * ```js
     * const userCredential = await signInWithPopup(auth, samlProvider);
     * const credential = SAMLAuthProvider.credentialFromResult(userCredential);
     * ```
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential: UserCredential): AuthCredential | null;
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error: FirebaseError): AuthCredential | null;
    /**
     * Creates an {@link AuthCredential} from a JSON string or a plain object.
     * @param json - A plain object or a JSON string
     */
    static credentialFromJSON(json: string | object): AuthCredential;
    private static samlCredentialFromTaggedObject;
}

/**
 * Sends a verification email to a user.
 *
 * @remarks
 * The verification process is completed by calling {@link applyActionCode}.
 *
 * @example
 * ```javascript
 * const actionCodeSettings = {
 *   url: 'https://www.example.com/?email=user@example.com',
 *   iOS: {
 *      bundleId: 'com.example.ios'
 *   },
 *   android: {
 *     packageName: 'com.example.android',
 *     installApp: true,
 *     minimumVersion: '12'
 *   },
 *   handleCodeInApp: true
 * };
 * await sendEmailVerification(user, actionCodeSettings);
 * // Obtain code from the user.
 * await applyActionCode(auth, code);
 * ```
 *
 * @param user - The user.
 * @param actionCodeSettings - The {@link ActionCodeSettings}.
 *
 * @public
 */
export declare function sendEmailVerification(user: User, actionCodeSettings?: ActionCodeSettings | null): Promise<void>;

/**
 * Sends a password reset email to the given email address. This method does not throw an error when
 * there's no user account with the given email address and
 * [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection) is enabled.
 *
 * @remarks
 * To complete the password reset, call {@link confirmPasswordReset} with the code supplied in
 * the email sent to the user, along with the new password specified by the user.
 *
 * @example
 * ```javascript
 * const actionCodeSettings = {
 *   url: 'https://www.example.com/?email=user@example.com',
 *   iOS: {
 *      bundleId: 'com.example.ios'
 *   },
 *   android: {
 *     packageName: 'com.example.android',
 *     installApp: true,
 *     minimumVersion: '12'
 *   },
 *   handleCodeInApp: true
 * };
 * await sendPasswordResetEmail(auth, 'user@example.com', actionCodeSettings);
 * // Obtain code from user.
 * await confirmPasswordReset('user@example.com', code);
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param email - The user's email address.
 * @param actionCodeSettings - The {@link ActionCodeSettings}.
 *
 * @public
 */
export declare function sendPasswordResetEmail(auth: Auth, email: string, actionCodeSettings?: ActionCodeSettings): Promise<void>;

/**
 * Sends a sign-in email link to the user with the specified email.
 *
 * @remarks
 * The sign-in operation has to always be completed in the app unlike other out of band email
 * actions (password reset and email verifications). This is because, at the end of the flow,
 * the user is expected to be signed in and their Auth state persisted within the app.
 *
 * To complete sign in with the email link, call {@link signInWithEmailLink} with the email
 * address and the email link supplied in the email sent to the user.
 *
 * @example
 * ```javascript
 * const actionCodeSettings = {
 *   url: 'https://www.example.com/?email=user@example.com',
 *   iOS: {
 *      bundleId: 'com.example.ios'
 *   },
 *   android: {
 *     packageName: 'com.example.android',
 *     installApp: true,
 *     minimumVersion: '12'
 *   },
 *   handleCodeInApp: true
 * };
 * await sendSignInLinkToEmail(auth, 'user@example.com', actionCodeSettings);
 * // Obtain emailLink from the user.
 * if(isSignInWithEmailLink(auth, emailLink)) {
 *   await signInWithEmailLink(auth, 'user@example.com', emailLink);
 * }
 * ```
 *
 * @param authInternal - The {@link Auth} instance.
 * @param email - The user's email address.
 * @param actionCodeSettings - The {@link ActionCodeSettings}.
 *
 * @public
 */
export declare function sendSignInLinkToEmail(auth: Auth, email: string, actionCodeSettings: ActionCodeSettings): Promise<void>;

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
 * Asynchronously signs in as an anonymous user.
 *
 * @remarks
 * If there is already an anonymous user signed in, that user will be returned; otherwise, a
 * new anonymous user identity will be created and returned.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
export declare function signInAnonymously(auth: Auth): Promise<UserCredential>;

/**
 * Enumeration of supported sign-in methods.
 *
 * @public
 */
export declare const SignInMethod: {
    /** Email link sign in method */
    readonly EMAIL_LINK: "emailLink";
    /** Email/password sign in method */
    readonly EMAIL_PASSWORD: "password";
    /** Facebook sign in method */
    readonly FACEBOOK: "facebook.com";
    /** GitHub sign in method */
    readonly GITHUB: "github.com";
    /** Google sign in method */
    readonly GOOGLE: "google.com";
    /** Phone sign in method */
    readonly PHONE: "phone";
    /** Twitter sign in method */
    readonly TWITTER: "twitter.com";
};

/**
 * Asynchronously signs in with the given credentials.
 *
 * @remarks
 * An {@link AuthProvider} can be used to generate the credential.
 *
 * @param auth - The {@link Auth} instance.
 * @param credential - The auth credential.
 *
 * @public
 */
export declare function signInWithCredential(auth: Auth, credential: AuthCredential): Promise<UserCredential>;

/**
 * Asynchronously signs in using a custom token.
 *
 * @remarks
 * Custom tokens are used to integrate Firebase Auth with existing auth systems, and must
 * be generated by an auth backend using the
 * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#createcustomtoken | createCustomToken}
 * method in the {@link https://firebase.google.com/docs/auth/admin | Admin SDK} .
 *
 * Fails with an error if the token is invalid, expired, or not accepted by the Firebase Auth service.
 *
 * @param auth - The {@link Auth} instance.
 * @param customToken - The custom token to sign in with.
 *
 * @public
 */
export declare function signInWithCustomToken(auth: Auth, customToken: string): Promise<UserCredential>;

/**
 * Asynchronously signs in using an email and password.
 *
 * @remarks
 * Fails with an error if the email address and password do not match.
 * When [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection) is enabled,
 * this method fails with "auth/invalid-credential" in case of an invalid email/password.
 *
 * Note: The user's password is NOT the password used to access the user's email account. The
 * email address serves as a unique identifier for the user, and the password is used to access
 * the user's account in your Firebase project. See also: {@link createUserWithEmailAndPassword}.
 *
 * @param auth - The {@link Auth} instance.
 * @param email - The users email address.
 * @param password - The users password.
 *
 * @public
 */
export declare function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;

/**
 * Asynchronously signs in using an email and sign-in email link.
 *
 * @remarks
 * If no link is passed, the link is inferred from the current URL.
 *
 * Fails with an error if the email address is invalid or OTP in email link expires.
 *
 * Note: Confirm the link is a sign-in email link before calling this method firebase.auth.Auth.isSignInWithEmailLink.
 *
 * @example
 * ```javascript
 * const actionCodeSettings = {
 *   url: 'https://www.example.com/?email=user@example.com',
 *   iOS: {
 *      bundleId: 'com.example.ios'
 *   },
 *   android: {
 *     packageName: 'com.example.android',
 *     installApp: true,
 *     minimumVersion: '12'
 *   },
 *   handleCodeInApp: true
 * };
 * await sendSignInLinkToEmail(auth, 'user@example.com', actionCodeSettings);
 * // Obtain emailLink from the user.
 * if(isSignInWithEmailLink(auth, emailLink)) {
 *   await signInWithEmailLink(auth, 'user@example.com', emailLink);
 * }
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param email - The user's email address.
 * @param emailLink - The link sent to the user's email address.
 *
 * @public
 */
export declare function signInWithEmailLink(auth: Auth, email: string, emailLink?: string): Promise<UserCredential>;

/**
 * @internal
 */
declare interface SignInWithIdpResponse extends IdTokenResponse {
    oauthAccessToken?: string;
    oauthTokenSecret?: string;
    nonce?: string;
    oauthIdToken?: string;
    pendingToken?: string;
}

/**
 * Asynchronously signs in using a phone number.
 *
 * @remarks
 * This method sends a code via SMS to the given
 * phone number, and returns a {@link ConfirmationResult}. After the user
 * provides the code sent to their phone, call {@link ConfirmationResult.confirm}
 * with the code to sign the user in.
 *
 * For abuse prevention, this method also requires a {@link ApplicationVerifier}.
 * This SDK includes a reCAPTCHA-based implementation, {@link RecaptchaVerifier}.
 * This function can work on other platforms that do not support the
 * {@link RecaptchaVerifier} (like React Native), but you need to use a
 * third-party {@link ApplicationVerifier} implementation.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // 'recaptcha-container' is the ID of an element in the DOM.
 * const applicationVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
 * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
 * // Obtain a verificationCode from the user.
 * const credential = await confirmationResult.confirm(verificationCode);
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param phoneNumber - The user's phone number in E.164 format (e.g. +16505550101).
 * @param appVerifier - The {@link ApplicationVerifier}.
 *
 * @public
 */
export declare function signInWithPhoneNumber(auth: Auth, phoneNumber: string, appVerifier: ApplicationVerifier): Promise<ConfirmationResult>;

/**
 * @internal
 */
declare interface SignInWithPhoneNumberRequest {
    temporaryProof?: string;
    phoneNumber?: string;
    sessionInfo?: string;
    code?: string;
    tenantId?: string;
}

/**
 * @internal
 */
declare interface SignInWithPhoneNumberResponse extends IdTokenResponse {
    temporaryProof?: string;
    phoneNumber?: string;
}

/**
 * Authenticates a Firebase client using a popup-based OAuth authentication flow.
 *
 * @remarks
 * If succeeds, returns the signed in user along with the provider's credential. If sign in was
 * unsuccessful, returns an error object containing additional information about the error.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Facebook Access Token.
 * const credential = provider.credentialFromResult(auth, result);
 * const token = credential.accessToken;
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
export declare function signInWithPopup(auth: Auth, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<UserCredential>;

/**
 * Authenticates a Firebase client using a full-page redirect flow.
 *
 * @remarks
 * To handle the results and errors for this operation, refer to {@link getRedirectResult}.
 * Follow the {@link https://firebase.google.com/docs/auth/web/redirect-best-practices
 * | best practices} when using {@link signInWithRedirect}.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new FacebookAuthProvider();
 * // You can add additional scopes to the provider:
 * provider.addScope('user_birthday');
 * // Start a sign in process for an unauthenticated user.
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Facebook Access Token.
 *   const credential = provider.credentialFromResult(auth, result);
 *   const token = credential.accessToken;
 * }
 * // As this API can be used for sign-in, linking and reauthentication,
 * // check the operationType to determine what triggered this redirect
 * // operation.
 * const operationType = result.operationType;
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
export declare function signInWithRedirect(auth: Auth, provider: AuthProvider, resolver?: PopupRedirectResolver): Promise<never>;

/**
 * Signs out the current user.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
export declare function signOut(auth: Auth): Promise<void>;

declare interface StartTotpMfaEnrollmentResponse {
    totpSessionInfo: {
        sharedSecretKey: string;
        verificationCodeLength: number;
        hashingAlgorithm: string;
        periodSec: number;
        sessionInfo: string;
        finalizeEnrollmentTime: number;
    };
}

/**
 * We need to mark this class as internal explicitly to exclude it in the public typings, because
 * it references AuthInternal which has a circular dependency with UserInternal.
 *
 * @internal
 */
declare class StsTokenManager {
    refreshToken: string | null;
    accessToken: string | null;
    expirationTime: number | null;
    get isExpired(): boolean;
    updateFromServerResponse(response: IdTokenResponse | FinalizeMfaResponse): void;
    getToken(auth: AuthInternal, forceRefresh?: boolean): Promise<string | null>;
    clearRefreshToken(): void;
    private refresh;
    private updateTokensAndExpiration;
    static fromJSON(appName: string, object: PersistedBlob): StsTokenManager;
    toJSON(): object;
    _assign(stsTokenManager: StsTokenManager): void;
    _clone(): StsTokenManager;
    _performRefresh(): never;
}

/**
 * @internal
 */
declare interface TaggedWithTokenResponse {
    _tokenResponse?: PhoneOrOauthTokenResponse;
}

/**
 * An MFA provided by TOTP (Time-based One Time Password).
 */
declare interface TotpMfaEnrollment extends BaseMfaEnrollment {
}

/**
 * The class for asserting ownership of a TOTP second factor. Provided by
 * {@link TotpMultiFactorGenerator.assertionForEnrollment} and
 * {@link TotpMultiFactorGenerator.assertionForSignIn}.
 *
 * @public
 */
export declare interface TotpMultiFactorAssertion extends MultiFactorAssertion {
}

/**
 * Provider for generating a {@link TotpMultiFactorAssertion}.
 *
 * @public
 */
export declare class TotpMultiFactorGenerator {
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of
     * the TOTP (time-based one-time password) second factor.
     * This assertion is used to complete enrollment in TOTP second factor.
     *
     * @param secret A {@link TotpSecret} containing the shared secret key and other TOTP parameters.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorUser.enroll}.
     */
    static assertionForEnrollment(secret: TotpSecret, oneTimePassword: string): TotpMultiFactorAssertion;
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of the TOTP second factor.
     * This assertion is used to complete signIn with TOTP as the second factor.
     *
     * @param enrollmentId identifies the enrolled TOTP second factor.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}.
     */
    static assertionForSignIn(enrollmentId: string, oneTimePassword: string): TotpMultiFactorAssertion;
    /**
     * Returns a promise to {@link TotpSecret} which contains the TOTP shared secret key and other parameters.
     * Creates a TOTP secret as part of enrolling a TOTP second factor.
     * Used for generating a QR code URL or inputting into a TOTP app.
     * This method uses the auth instance corresponding to the user in the multiFactorSession.
     *
     * @param session The {@link MultiFactorSession} that the user is part of.
     * @returns A promise to {@link TotpSecret}.
     */
    static generateSecret(session: MultiFactorSession): Promise<TotpSecret>;
    /**
     * The identifier of the TOTP second factor: `totp`.
     */
    static FACTOR_ID: 'totp';
}

/**
 * The subclass of the {@link MultiFactorInfo} interface for TOTP
 * second factors. The `factorId` of this second factor is {@link FactorId}.TOTP.
 * @public
 */
export declare interface TotpMultiFactorInfo extends MultiFactorInfo {
}

/**
 * Provider for generating a {@link TotpMultiFactorAssertion}.
 *
 * Stores the shared secret key and other parameters to generate time-based OTPs.
 * Implements methods to retrieve the shared secret key and generate a QR code URL.
 * @public
 */
export declare class TotpSecret {
    private readonly sessionInfo;
    private readonly auth;
    /**
     * Shared secret key/seed used for enrolling in TOTP MFA and generating OTPs.
     */
    readonly secretKey: string;
    /**
     * Hashing algorithm used.
     */
    readonly hashingAlgorithm: string;
    /**
     * Length of the one-time passwords to be generated.
     */
    readonly codeLength: number;
    /**
     * The interval (in seconds) when the OTP codes should change.
     */
    readonly codeIntervalSeconds: number;
    /**
     * The timestamp (UTC string) by which TOTP enrollment should be completed.
     */
    readonly enrollmentCompletionDeadline: string;
    private constructor();
    /** @internal */
    static _fromStartTotpMfaEnrollmentResponse(response: StartTotpMfaEnrollmentResponse, auth: AuthInternal): TotpSecret;
    /** @internal */
    _makeTotpVerificationInfo(otp: string): TotpVerificationInfo;
    /**
     * Returns a QR code URL as described in
     * https://github.com/google/google-authenticator/wiki/Key-Uri-Format
     * This can be displayed to the user as a QR code to be scanned into a TOTP app like Google Authenticator.
     * If the optional parameters are unspecified, an accountName of <userEmail> and issuer of <firebaseAppName> are used.
     *
     * @param accountName the name of the account/app along with a user identifier.
     * @param issuer issuer of the TOTP (likely the app name).
     * @returns A QR code URL string.
     */
    generateQrCodeUrl(accountName?: string, issuer?: string): string;
}

declare interface TotpVerificationInfo {
    sessionInfo: string;
    verificationCode: string;
}

/**
 * Provider for generating an {@link OAuthCredential} for {@link ProviderId}.TWITTER.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new TwitterAuthProvider();
 * // Start a sign in process for an unauthenticated user.
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Twitter Access Token and Secret.
 *   const credential = TwitterAuthProvider.credentialFromResult(result);
 *   const token = credential.accessToken;
 *   const secret = credential.secret;
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new TwitterAuthProvider();
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Twitter Access Token and Secret.
 * const credential = TwitterAuthProvider.credentialFromResult(result);
 * const token = credential.accessToken;
 * const secret = credential.secret;
 * ```
 *
 * @public
 */
export declare class TwitterAuthProvider extends BaseOAuthProvider {
    /** Always set to {@link SignInMethod}.TWITTER. */
    static readonly TWITTER_SIGN_IN_METHOD: 'twitter.com';
    /** Always set to {@link ProviderId}.TWITTER. */
    static readonly PROVIDER_ID: 'twitter.com';
    constructor();
    /**
     * Creates a credential for Twitter.
     *
     * @param token - Twitter access token.
     * @param secret - Twitter secret.
     */
    static credential(token: string, secret: string): OAuthCredential;
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential: UserCredential): OAuthCredential | null;
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error: FirebaseError): OAuthCredential | null;
    private static credentialFromTaggedObject;
}

/**
 * Unlinks a provider from a user account.
 *
 * @param user - The user.
 * @param providerId - The provider to unlink.
 *
 * @public
 */
export declare function unlink(user: User, providerId: string): Promise<User>;
export { Unsubscribe }

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
 * Updates the user's email address.
 *
 * @remarks
 * An email will be sent to the original email address (if it was set) that allows to revoke the
 * email address change, in order to protect them from account hijacking.
 *
 * Important: this is a security sensitive operation that requires the user to have recently signed
 * in. If this requirement isn't met, ask the user to authenticate again and then call
 * {@link reauthenticateWithCredential}.
 *
 * @param user - The user.
 * @param newEmail - The new email address.
 *
 * Throws "auth/operation-not-allowed" error when [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection) is enabled.
 * Deprecated - Use {@link verifyBeforeUpdateEmail} instead.
 *
 * @public
 */
export declare function updateEmail(user: User, newEmail: string): Promise<void>;

/**
 * Updates the user's password.
 *
 * @remarks
 * Important: this is a security sensitive operation that requires the user to have recently signed
 * in. If this requirement isn't met, ask the user to authenticate again and then call
 * {@link reauthenticateWithCredential}.
 *
 * @param user - The user.
 * @param newPassword - The new password.
 *
 * @public
 */
export declare function updatePassword(user: User, newPassword: string): Promise<void>;

/**
 * Updates the user's phone number.
 *
 * @remarks
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```
 * // 'recaptcha-container' is the ID of an element in the DOM.
 * const applicationVerifier = new RecaptchaVerifier('recaptcha-container');
 * const provider = new PhoneAuthProvider(auth);
 * const verificationId = await provider.verifyPhoneNumber('+16505550101', applicationVerifier);
 * // Obtain the verificationCode from the user.
 * const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
 * await updatePhoneNumber(user, phoneCredential);
 * ```
 *
 * @param user - The user.
 * @param credential - A credential authenticating the new phone number.
 *
 * @public
 */
export declare function updatePhoneNumber(user: User, credential: PhoneAuthCredential): Promise<void>;

/**
 * Updates a user's profile data.
 *
 * @param user - The user.
 * @param profile - The profile's `displayName` and `photoURL` to update.
 *
 * @public
 */
export declare function updateProfile(user: User, { displayName, photoURL: photoUrl }: {
    displayName?: string | null;
    photoURL?: string | null;
}): Promise<void>;

/**
 * Sets the current language to the default device/browser preference.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
export declare function useDeviceLanguage(auth: Auth): void;

/**
 * A user account.
 *
 * @public
 */
export declare interface User extends UserInfo {
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
export declare interface UserCredential {
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
    operationType: (typeof OperationType)[keyof typeof OperationType];
}

/**
 * @internal
 */
declare interface UserCredentialInternal extends UserCredential, TaggedWithTokenResponse {
    user: UserInternal;
}

/**
 * User profile information, visible only to the Firebase project's apps.
 *
 * @public
 */
export declare interface UserInfo {
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
 * UserInternal and AuthInternal reference each other, so both of them are included in the public typings.
 * In order to exclude them, we mark them as internal explicitly.
 *
 * @internal
 */
declare interface UserInternal extends User {
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    auth: AuthInternal;
    providerId: ProviderId_2.FIREBASE;
    refreshToken: string;
    emailVerified: boolean;
    tenantId: string | null;
    providerData: MutableUserInfo[];
    metadata: UserMetadata_2;
    stsTokenManager: StsTokenManager;
    _redirectEventId?: string;
    _updateTokensIfNecessary(response: IdTokenResponse | FinalizeMfaResponse, reload?: boolean): Promise<void>;
    _assign(user: UserInternal): void;
    _clone(auth: AuthInternal): UserInternal;
    _onReload: (cb: NextFn<APIUserInfo>) => void;
    _notifyReloadListener: NextFn<APIUserInfo>;
    _startProactiveRefresh: () => void;
    _stopProactiveRefresh: () => void;
    getIdToken(forceRefresh?: boolean): Promise<string>;
    getIdTokenResult(forceRefresh?: boolean): Promise<IdTokenResult>;
    reload(): Promise<void>;
    delete(): Promise<void>;
    toJSON(): PersistedBlob;
}

/**
 * Interface representing a user's metadata.
 *
 * @public
 */
export declare interface UserMetadata {
    /** Time the user was created. */
    readonly creationTime?: string;
    /** Time the user last signed in. */
    readonly lastSignInTime?: string;
}

declare class UserMetadata_2 implements UserMetadata {
    private createdAt?;
    private lastLoginAt?;
    creationTime?: string;
    lastSignInTime?: string;
    constructor(createdAt?: string | number | undefined, lastLoginAt?: string | number | undefined);
    private _initializeTime;
    _copy(metadata: UserMetadata_2): void;
    toJSON(): object;
}

/**
 * User profile used in {@link AdditionalUserInfo}.
 *
 * @public
 */
export declare type UserProfile = Record<string, unknown>;

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
 * Sends a verification email to a new email address.
 *
 * @remarks
 * The user's email will be updated to the new one after being verified.
 *
 * If you have a custom email action handler, you can complete the verification process by calling
 * {@link applyActionCode}.
 *
 * @example
 * ```javascript
 * const actionCodeSettings = {
 *   url: 'https://www.example.com/?email=user@example.com',
 *   iOS: {
 *      bundleId: 'com.example.ios'
 *   },
 *   android: {
 *     packageName: 'com.example.android',
 *     installApp: true,
 *     minimumVersion: '12'
 *   },
 *   handleCodeInApp: true
 * };
 * await verifyBeforeUpdateEmail(user, 'newemail@example.com', actionCodeSettings);
 * // Obtain code from the user.
 * await applyActionCode(auth, code);
 * ```
 *
 * @param user - The user.
 * @param newEmail - The new email address to be verified before update.
 * @param actionCodeSettings - The {@link ActionCodeSettings}.
 *
 * @public
 */
export declare function verifyBeforeUpdateEmail(user: User, newEmail: string, actionCodeSettings?: ActionCodeSettings | null): Promise<void>;

/**
 * Checks a password reset code sent to the user by email or other out-of-band mechanism.
 *
 * @returns the user's email address if valid.
 *
 * @param auth - The {@link Auth} instance.
 * @param code - A verification code sent to the user.
 *
 * @public
 */
export declare function verifyPasswordResetCode(auth: Auth, code: string): Promise<string>;

export { }
