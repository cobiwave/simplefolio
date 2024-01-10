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
import { PhoneOrOauthTokenResponse } from '../../api/authentication/mfa';
import { SignInWithPhoneNumberRequest } from '../../api/authentication/sms';
import { AuthInternal } from '../../model/auth';
import { IdTokenResponse } from '../../model/id_token';
import { AuthCredential } from './auth_credential';
export interface PhoneAuthCredentialParameters {
    verificationId?: string;
    verificationCode?: string;
    phoneNumber?: string;
    temporaryProof?: string;
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
