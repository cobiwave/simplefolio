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
import * as exp from '@firebase/auth/internal';
import * as compat from '@firebase/auth-types';
import { Compat } from '@firebase/util';
export declare class PhoneAuthProvider implements compat.PhoneAuthProvider, Compat<exp.PhoneAuthProvider> {
    providerId: string;
    readonly _delegate: exp.PhoneAuthProvider;
    static PHONE_SIGN_IN_METHOD: "phone";
    static PROVIDER_ID: "phone";
    static credential(verificationId: string, verificationCode: string): compat.AuthCredential;
    constructor();
    verifyPhoneNumber(phoneInfoOptions: string | compat.PhoneSingleFactorInfoOptions | compat.PhoneMultiFactorEnrollInfoOptions | compat.PhoneMultiFactorSignInInfoOptions, applicationVerifier: compat.ApplicationVerifier): Promise<string>;
    unwrap(): exp.PhoneAuthProvider;
}
