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
import { AuthErrorMap, User } from '../model/public_types';
import { ErrorFactory, ErrorMap } from '@firebase/util';
import { IdTokenMfaResponse } from '../api/authentication/mfa';
import { AppName } from '../model/auth';
import { AuthCredential } from './credentials';
/**
 * Enumeration of Firebase Auth error codes.
 *
 * @internal
 */
export declare const enum AuthErrorCode {
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
export interface ErrorMapRetriever extends AuthErrorMap {
    (): ErrorMap<AuthErrorCode>;
}
/**
 * A verbose error map with detailed descriptions for most error codes.
 *
 * See discussion at {@link AuthErrorMap}
 *
 * @public
 */
export declare const debugErrorMap: AuthErrorMap;
/**
 * A minimal error map with all verbose error messages stripped.
 *
 * See discussion at {@link AuthErrorMap}
 *
 * @public
 */
export declare const prodErrorMap: AuthErrorMap;
export interface NamedErrorParams {
    appName: AppName;
    credential?: AuthCredential;
    email?: string;
    phoneNumber?: string;
    tenantId?: string;
    user?: User;
    _serverResponse?: object;
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
 * @internal
 */
export interface AuthErrorParams extends GenericAuthErrorParams {
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
export declare const _DEFAULT_AUTH_ERROR_FACTORY: ErrorFactory<AuthErrorCode, AuthErrorParams>;
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
export declare const AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY: {
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
export {};
