/**
 * @license
 * Copyright 2023 Google LLC
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
/**
 * Request object for fetching the password policy.
 */
export interface GetPasswordPolicyRequest {
    tenantId?: string;
}
/**
 * Response object for fetching the password policy.
 */
export interface GetPasswordPolicyResponse {
    customStrengthOptions: {
        minPasswordLength?: number;
        maxPasswordLength?: number;
        containsLowercaseCharacter?: boolean;
        containsUppercaseCharacter?: boolean;
        containsNumericCharacter?: boolean;
        containsNonAlphanumericCharacter?: boolean;
    };
    allowedNonAlphanumericCharacters?: string[];
    enforcementState: string;
    forceUpgradeOnSignin?: boolean;
    schemaVersion: number;
}
/**
 * Fetches the password policy for the currently set tenant or the project if no tenant is set.
 *
 * @param auth Auth object.
 * @param request Password policy request.
 * @returns Password policy response.
 */
export declare function _getPasswordPolicy(auth: Auth, request?: GetPasswordPolicyRequest): Promise<GetPasswordPolicyResponse>;
