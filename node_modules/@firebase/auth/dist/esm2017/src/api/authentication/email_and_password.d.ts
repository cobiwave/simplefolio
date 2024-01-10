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
import { ActionCodeOperation, Auth } from '../../model/public_types';
import { RecaptchaClientType, RecaptchaVersion } from '../index';
import { IdToken, IdTokenResponse } from '../../model/id_token';
export interface SignInWithPasswordRequest {
    returnSecureToken?: boolean;
    email: string;
    password: string;
    tenantId?: string;
    captchaResponse?: string;
    clientType?: RecaptchaClientType;
    recaptchaVersion?: RecaptchaVersion;
}
export interface SignInWithPasswordResponse extends IdTokenResponse {
    email: string;
    displayName: string;
}
export declare function signInWithPassword(auth: Auth, request: SignInWithPasswordRequest): Promise<SignInWithPasswordResponse>;
export interface GetOobCodeRequest {
    email?: string;
    continueUrl?: string;
    iOSBundleId?: string;
    iosAppStoreId?: string;
    androidPackageName?: string;
    androidInstallApp?: boolean;
    androidMinimumVersionCode?: string;
    canHandleCodeInApp?: boolean;
    dynamicLinkDomain?: string;
    tenantId?: string;
    targetProjectid?: string;
}
export interface VerifyEmailRequest extends GetOobCodeRequest {
    requestType: ActionCodeOperation.VERIFY_EMAIL;
    idToken: IdToken;
}
export interface PasswordResetRequest extends GetOobCodeRequest {
    requestType: ActionCodeOperation.PASSWORD_RESET;
    email: string;
    captchaResp?: string;
    clientType?: RecaptchaClientType;
    recaptchaVersion?: RecaptchaVersion;
}
export interface EmailSignInRequest extends GetOobCodeRequest {
    requestType: ActionCodeOperation.EMAIL_SIGNIN;
    email: string;
    captchaResp?: string;
    clientType?: RecaptchaClientType;
    recaptchaVersion?: RecaptchaVersion;
}
export interface VerifyAndChangeEmailRequest extends GetOobCodeRequest {
    requestType: ActionCodeOperation.VERIFY_AND_CHANGE_EMAIL;
    idToken: IdToken;
    newEmail: string;
}
interface GetOobCodeResponse {
    email: string;
}
export interface VerifyEmailResponse extends GetOobCodeResponse {
}
export interface PasswordResetResponse extends GetOobCodeResponse {
}
export interface EmailSignInResponse extends GetOobCodeResponse {
}
export interface VerifyAndChangeEmailResponse extends GetOobCodeRequest {
}
export declare function sendEmailVerification(auth: Auth, request: VerifyEmailRequest): Promise<VerifyEmailResponse>;
export declare function sendPasswordResetEmail(auth: Auth, request: PasswordResetRequest): Promise<PasswordResetResponse>;
export declare function sendSignInLinkToEmail(auth: Auth, request: EmailSignInRequest): Promise<EmailSignInResponse>;
export declare function verifyAndChangeEmail(auth: Auth, request: VerifyAndChangeEmailRequest): Promise<VerifyAndChangeEmailResponse>;
export {};
