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
import { IdTokenResponse } from '../../model/id_token';
import { Auth } from '../../model/public_types';
export interface SendPhoneVerificationCodeRequest {
    phoneNumber: string;
    recaptchaToken: string;
    tenantId?: string;
}
export interface SendPhoneVerificationCodeResponse {
    sessionInfo: string;
}
export declare function sendPhoneVerificationCode(auth: Auth, request: SendPhoneVerificationCodeRequest): Promise<SendPhoneVerificationCodeResponse>;
/**
 * @internal
 */
export interface SignInWithPhoneNumberRequest {
    temporaryProof?: string;
    phoneNumber?: string;
    sessionInfo?: string;
    code?: string;
    tenantId?: string;
}
export interface LinkWithPhoneNumberRequest extends SignInWithPhoneNumberRequest {
    idToken: string;
}
/**
 * @internal
 */
export interface SignInWithPhoneNumberResponse extends IdTokenResponse {
    temporaryProof?: string;
    phoneNumber?: string;
}
export declare function signInWithPhoneNumber(auth: Auth, request: SignInWithPhoneNumberRequest): Promise<SignInWithPhoneNumberResponse>;
export declare function linkWithPhoneNumber(auth: Auth, request: LinkWithPhoneNumberRequest): Promise<SignInWithPhoneNumberResponse>;
export declare function verifyPhoneNumberForExisting(auth: Auth, request: SignInWithPhoneNumberRequest): Promise<SignInWithPhoneNumberResponse>;
