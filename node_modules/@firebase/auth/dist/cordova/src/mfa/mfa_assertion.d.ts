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
import { FactorId, MultiFactorAssertion } from '../model/public_types';
import { MultiFactorSessionImpl } from './mfa_session';
import { FinalizeMfaResponse } from '../api/authentication/mfa';
import { AuthInternal } from '../model/auth';
export declare abstract class MultiFactorAssertionImpl implements MultiFactorAssertion {
    readonly factorId: FactorId;
    protected constructor(factorId: FactorId);
    _process(auth: AuthInternal, session: MultiFactorSessionImpl, displayName?: string | null): Promise<FinalizeMfaResponse>;
    abstract _finalizeEnroll(auth: AuthInternal, idToken: string, displayName?: string | null): Promise<FinalizeMfaResponse>;
    abstract _finalizeSignIn(auth: AuthInternal, mfaPendingCredential: string): Promise<FinalizeMfaResponse>;
}
