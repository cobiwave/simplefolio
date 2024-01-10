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
import { Auth } from '../../model/public_types';
import { IdTokenResponse } from '../../model/id_token';
import { MfaEnrollment } from '../account_management/mfa';
import { SignInWithIdpResponse } from './idp';
import { SignInWithPhoneNumberRequest, SignInWithPhoneNumberResponse } from './sms';
export interface FinalizeMfaResponse {
    idToken: string;
    refreshToken: string;
}
/**
 * @internal
 */
export interface IdTokenMfaResponse extends IdTokenResponse {
    mfaPendingCredential?: string;
    mfaInfo?: MfaEnrollment[];
}
export interface StartPhoneMfaSignInRequest {
    mfaPendingCredential: string;
    mfaEnrollmentId: string;
    phoneSignInInfo: {
        recaptchaToken: string;
    };
    tenantId?: string;
}
export interface StartPhoneMfaSignInResponse {
    phoneResponseInfo: {
        sessionInfo: string;
    };
}
export declare function startSignInPhoneMfa(auth: Auth, request: StartPhoneMfaSignInRequest): Promise<StartPhoneMfaSignInResponse>;
export interface FinalizePhoneMfaSignInRequest {
    mfaPendingCredential: string;
    phoneVerificationInfo: SignInWithPhoneNumberRequest;
    tenantId?: string;
}
export interface FinalizeTotpMfaSignInRequest {
    mfaPendingCredential: string;
    totpVerificationInfo: {
        verificationCode: string;
    };
    tenantId?: string;
    mfaEnrollmentId: string;
}
export interface FinalizePhoneMfaSignInResponse extends FinalizeMfaResponse {
}
export interface FinalizeTotpMfaSignInResponse extends FinalizeMfaResponse {
}
export declare function finalizeSignInPhoneMfa(auth: Auth, request: FinalizePhoneMfaSignInRequest): Promise<FinalizePhoneMfaSignInResponse>;
export declare function finalizeSignInTotpMfa(auth: Auth, request: FinalizeTotpMfaSignInRequest): Promise<FinalizeTotpMfaSignInResponse>;
/**
 * @internal
 */
export declare type PhoneOrOauthTokenResponse = SignInWithPhoneNumberResponse | SignInWithIdpResponse | IdTokenResponse;
