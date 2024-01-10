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
import { GetPasswordPolicyResponse } from '../../api/password_policy/get_password_policy';
import { PasswordPolicyCustomStrengthOptions, PasswordPolicyInternal } from '../../model/password_policy';
import { PasswordValidationStatus } from '../../model/public_types';
/**
 * Stores password policy requirements and provides password validation against the policy.
 *
 * @internal
 */
export declare class PasswordPolicyImpl implements PasswordPolicyInternal {
    readonly customStrengthOptions: PasswordPolicyCustomStrengthOptions;
    readonly allowedNonAlphanumericCharacters: string;
    readonly enforcementState: string;
    readonly forceUpgradeOnSignin: boolean;
    readonly schemaVersion: number;
    constructor(response: GetPasswordPolicyResponse);
    validatePassword(password: string): PasswordValidationStatus;
    /**
     * Validates that the password meets the length options for the policy.
     *
     * @param password Password to validate.
     * @param status Validation status.
     */
    private validatePasswordLengthOptions;
    /**
     * Validates that the password meets the character options for the policy.
     *
     * @param password Password to validate.
     * @param status Validation status.
     */
    private validatePasswordCharacterOptions;
    /**
     * Updates the running validation status with the statuses for the character options.
     * Expected to be called each time a character is processed to update each option status
     * based on the current character.
     *
     * @param status Validation status.
     * @param containsLowercaseCharacter Whether the character is a lowercase letter.
     * @param containsUppercaseCharacter Whether the character is an uppercase letter.
     * @param containsNumericCharacter Whether the character is a numeric character.
     * @param containsNonAlphanumericCharacter Whether the character is a non-alphanumeric character.
     */
    private updatePasswordCharacterOptionsStatuses;
}
