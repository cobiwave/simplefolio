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
import { PhoneOrOauthTokenResponse } from '../api/authentication/mfa';
/**
 * Raw encoded JWT
 *
 */
export declare type IdToken = string;
/**
 * Raw parsed JWT
 *
 */
export interface ParsedIdToken {
    iss: string;
    aud: string;
    exp: number;
    sub: string;
    iat: number;
    email?: string;
    verified: boolean;
    providerId?: string;
    tenantId?: string;
    anonymous: boolean;
    federatedId?: string;
    displayName?: string;
    photoURL?: string;
    toString(): string;
}
/**
 * IdToken as returned by the API
 *
 * @internal
 */
export interface IdTokenResponse {
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
export declare const enum IdTokenResponseKind {
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
 * @internal
 */
export interface TaggedWithTokenResponse {
    _tokenResponse?: PhoneOrOauthTokenResponse;
}
