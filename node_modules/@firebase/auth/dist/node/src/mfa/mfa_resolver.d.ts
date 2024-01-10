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
import { Auth, MultiFactorResolver, UserCredential, MultiFactorError } from '../model/public_types';
import { MultiFactorAssertionImpl } from './mfa_assertion';
import { MultiFactorError as MultiFactorErrorInternal } from './mfa_error';
import { MultiFactorInfoImpl } from './mfa_info';
import { MultiFactorSessionImpl } from './mfa_session';
export declare class MultiFactorResolverImpl implements MultiFactorResolver {
    readonly session: MultiFactorSessionImpl;
    readonly hints: MultiFactorInfoImpl[];
    private readonly signInResolver;
    private constructor();
    /** @internal */
    static _fromError(authExtern: Auth, error: MultiFactorErrorInternal): MultiFactorResolverImpl;
    resolveSignIn(assertionExtern: MultiFactorAssertionImpl): Promise<UserCredential>;
}
/**
 * Provides a {@link MultiFactorResolver} suitable for completion of a
 * multi-factor flow.
 *
 * @param auth - The {@link Auth} instance.
 * @param error - The {@link MultiFactorError} raised during a sign-in, or
 * reauthentication operation.
 *
 * @public
 */
export declare function getMultiFactorResolver(auth: Auth, error: MultiFactorError): MultiFactorResolver;
