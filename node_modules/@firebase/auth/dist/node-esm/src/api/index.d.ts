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
import { FirebaseError } from '@firebase/util';
import { AuthErrorCode } from '../core/errors';
import { Delay } from '../core/util/delay';
import { Auth } from '../model/public_types';
import { IdTokenResponse } from '../model/id_token';
import { ServerError, ServerErrorMap } from './errors';
export declare const enum HttpMethod {
    POST = "POST",
    GET = "GET"
}
export declare const enum HttpHeader {
    CONTENT_TYPE = "Content-Type",
    X_FIREBASE_LOCALE = "X-Firebase-Locale",
    X_CLIENT_VERSION = "X-Client-Version",
    X_FIREBASE_GMPID = "X-Firebase-gmpid",
    X_FIREBASE_CLIENT = "X-Firebase-Client",
    X_FIREBASE_APP_CHECK = "X-Firebase-AppCheck"
}
export declare const enum Endpoint {
    CREATE_AUTH_URI = "/v1/accounts:createAuthUri",
    DELETE_ACCOUNT = "/v1/accounts:delete",
    RESET_PASSWORD = "/v1/accounts:resetPassword",
    SIGN_UP = "/v1/accounts:signUp",
    SIGN_IN_WITH_CUSTOM_TOKEN = "/v1/accounts:signInWithCustomToken",
    SIGN_IN_WITH_EMAIL_LINK = "/v1/accounts:signInWithEmailLink",
    SIGN_IN_WITH_IDP = "/v1/accounts:signInWithIdp",
    SIGN_IN_WITH_PASSWORD = "/v1/accounts:signInWithPassword",
    SIGN_IN_WITH_PHONE_NUMBER = "/v1/accounts:signInWithPhoneNumber",
    SEND_VERIFICATION_CODE = "/v1/accounts:sendVerificationCode",
    SEND_OOB_CODE = "/v1/accounts:sendOobCode",
    SET_ACCOUNT_INFO = "/v1/accounts:update",
    GET_ACCOUNT_INFO = "/v1/accounts:lookup",
    GET_RECAPTCHA_PARAM = "/v1/recaptchaParams",
    START_MFA_ENROLLMENT = "/v2/accounts/mfaEnrollment:start",
    FINALIZE_MFA_ENROLLMENT = "/v2/accounts/mfaEnrollment:finalize",
    START_MFA_SIGN_IN = "/v2/accounts/mfaSignIn:start",
    FINALIZE_MFA_SIGN_IN = "/v2/accounts/mfaSignIn:finalize",
    WITHDRAW_MFA = "/v2/accounts/mfaEnrollment:withdraw",
    GET_PROJECT_CONFIG = "/v1/projects",
    GET_RECAPTCHA_CONFIG = "/v2/recaptchaConfig",
    GET_PASSWORD_POLICY = "/v2/passwordPolicy",
    TOKEN = "/v1/token",
    REVOKE_TOKEN = "/v2/accounts:revokeToken"
}
export declare const enum RecaptchaClientType {
    WEB = "CLIENT_TYPE_WEB",
    ANDROID = "CLIENT_TYPE_ANDROID",
    IOS = "CLIENT_TYPE_IOS"
}
export declare const enum RecaptchaVersion {
    ENTERPRISE = "RECAPTCHA_ENTERPRISE"
}
export declare const enum RecaptchaActionName {
    SIGN_IN_WITH_PASSWORD = "signInWithPassword",
    GET_OOB_CODE = "getOobCode",
    SIGN_UP_PASSWORD = "signUpPassword"
}
export declare const enum EnforcementState {
    ENFORCE = "ENFORCE",
    AUDIT = "AUDIT",
    OFF = "OFF",
    ENFORCEMENT_STATE_UNSPECIFIED = "ENFORCEMENT_STATE_UNSPECIFIED"
}
export declare const enum RecaptchaProvider {
    EMAIL_PASSWORD_PROVIDER = "EMAIL_PASSWORD_PROVIDER"
}
export declare const DEFAULT_API_TIMEOUT_MS: Delay;
export declare function _addTidIfNecessary<T extends {
    tenantId?: string;
}>(auth: Auth, request: T): T;
export declare function _performApiRequest<T, V>(auth: Auth, method: HttpMethod, path: Endpoint, request?: T, customErrorMap?: Partial<ServerErrorMap<ServerError>>): Promise<V>;
export declare function _performFetchWithErrorHandling<V>(auth: Auth, customErrorMap: Partial<ServerErrorMap<ServerError>>, fetchFn: () => Promise<Response>): Promise<V>;
export declare function _performSignInRequest<T, V extends IdTokenResponse>(auth: Auth, method: HttpMethod, path: Endpoint, request?: T, customErrorMap?: Partial<ServerErrorMap<ServerError>>): Promise<V>;
export declare function _getFinalTarget(auth: Auth, host: string, path: string, query: string): string;
export declare function _parseEnforcementState(enforcementStateStr: string): EnforcementState;
interface PotentialResponse extends IdTokenResponse {
    email?: string;
    phoneNumber?: string;
}
export declare function _makeTaggedError(auth: Auth, code: AuthErrorCode, response: PotentialResponse): FirebaseError;
export {};
