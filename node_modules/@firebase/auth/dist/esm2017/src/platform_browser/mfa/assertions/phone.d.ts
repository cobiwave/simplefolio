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
import { PhoneMultiFactorAssertion } from '../../../model/public_types';
import { MultiFactorAssertionImpl } from '../../../mfa/mfa_assertion';
import { AuthInternal } from '../../../model/auth';
import { PhoneAuthCredential } from '../../../core/credentials/phone';
import { FinalizeMfaResponse } from '../../../api/authentication/mfa';
/**
 * {@inheritdoc PhoneMultiFactorAssertion}
 *
 * @public
 */
export declare class PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl implements PhoneMultiFactorAssertion {
    private readonly credential;
    private constructor();
    /** @internal */
    static _fromCredential(credential: PhoneAuthCredential): PhoneMultiFactorAssertionImpl;
    /** @internal */
    _finalizeEnroll(auth: AuthInternal, idToken: string, displayName?: string | null): Promise<FinalizeMfaResponse>;
    /** @internal */
    _finalizeSignIn(auth: AuthInternal, mfaPendingCredential: string): Promise<FinalizeMfaResponse>;
}
/**
 * Provider for generating a {@link PhoneMultiFactorAssertion}.
 *
 * @public
 */
export declare class PhoneMultiFactorGenerator {
    private constructor();
    /**
     * Provides a {@link PhoneMultiFactorAssertion} to confirm ownership of the phone second factor.
     *
     * @remarks
     * This method does not work in a Node.js environment.
     *
     * @param phoneAuthCredential - A credential provided by {@link PhoneAuthProvider.credential}.
     * @returns A {@link PhoneMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}
     */
    static assertion(credential: PhoneAuthCredential): PhoneMultiFactorAssertion;
    /**
     * The identifier of the phone second factor: `phone`.
     */
    static FACTOR_ID: string;
}
