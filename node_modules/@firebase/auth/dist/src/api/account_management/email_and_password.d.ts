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
import { IdTokenResponse } from '../../model/id_token';
import { MfaEnrollment } from './mfa';
import { SignUpRequest, SignUpResponse } from '../authentication/sign_up';
export interface ResetPasswordRequest {
    oobCode: string;
    newPassword?: string;
    tenantId?: string;
}
export interface ResetPasswordResponse {
    email: string;
    newEmail?: string;
    requestType?: ActionCodeOperation;
    mfaInfo?: MfaEnrollment;
}
export declare function resetPassword(auth: Auth, request: ResetPasswordRequest): Promise<ResetPasswordResponse>;
export interface UpdateEmailPasswordRequest {
    idToken: string;
    returnSecureToken?: boolean;
    email?: string;
    password?: string;
}
export interface UpdateEmailPasswordResponse extends IdTokenResponse {
}
export declare function updateEmailPassword(auth: Auth, request: UpdateEmailPasswordRequest): Promise<UpdateEmailPasswordResponse>;
export declare function linkEmailPassword(auth: Auth, request: SignUpRequest): Promise<SignUpResponse>;
export interface ApplyActionCodeRequest {
    oobCode: string;
    tenantId?: string;
}
export interface ApplyActionCodeResponse {
}
export declare function applyActionCode(auth: Auth, request: ApplyActionCodeRequest): Promise<ApplyActionCodeResponse>;
