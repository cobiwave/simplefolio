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
import { FactorId, MultiFactorInfo, PhoneMultiFactorInfo, TotpMultiFactorInfo } from '../model/public_types';
import { MfaEnrollment } from '../api/account_management/mfa';
import { AuthInternal } from '../model/auth';
export declare abstract class MultiFactorInfoImpl implements MultiFactorInfo {
    readonly factorId: FactorId;
    readonly uid: string;
    readonly displayName?: string | null;
    readonly enrollmentTime: string;
    protected constructor(factorId: FactorId, response: MfaEnrollment);
    static _fromServerResponse(auth: AuthInternal, enrollment: MfaEnrollment): MultiFactorInfoImpl;
}
export declare class PhoneMultiFactorInfoImpl extends MultiFactorInfoImpl implements PhoneMultiFactorInfo {
    readonly phoneNumber: string;
    private constructor();
    static _fromServerResponse(_auth: AuthInternal, enrollment: MfaEnrollment): PhoneMultiFactorInfoImpl;
}
export declare class TotpMultiFactorInfoImpl extends MultiFactorInfoImpl implements TotpMultiFactorInfo {
    private constructor();
    static _fromServerResponse(_auth: AuthInternal, enrollment: MfaEnrollment): TotpMultiFactorInfoImpl;
}
