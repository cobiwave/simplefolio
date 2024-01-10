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
import { PasswordPolicy, PasswordValidationStatus } from './public_types';
/**
 * Internal typing of password policy that includes the schema version and methods for
 * validating that a password meets the policy. The developer does not need access to
 * these properties and methods, so they are excluded from the public typing.
 *
 * @internal
 */
export interface PasswordPolicyInternal extends PasswordPolicy {
    /**
     * Requirements enforced by the password policy.
     */
    readonly customStrengthOptions: PasswordPolicyCustomStrengthOptions;
    /**
     * Schema version of the password policy.
     */
    readonly schemaVersion: number;
    /**
     * Validates the password against the policy.
     * @param password Password to validate.
     */
    validatePassword(password: string): PasswordValidationStatus;
}
/**
 * Internal typing of the password policy custom strength options that is modifiable. This
 * allows us to construct the strength options before storing them in the policy.
 *
 * @internal
 */
export interface PasswordPolicyCustomStrengthOptions {
    /**
     * Minimum password length.
     */
    minPasswordLength?: number;
    /**
     * Maximum password length.
     */
    maxPasswordLength?: number;
    /**
     * Whether the password should contain a lowercase letter.
     */
    containsLowercaseLetter?: boolean;
    /**
     * Whether the password should contain an uppercase letter.
     */
    containsUppercaseLetter?: boolean;
    /**
     * Whether the password should contain a numeric character.
     */
    containsNumericCharacter?: boolean;
    /**
     * Whether the password should contain a non-alphanumeric character.
     */
    containsNonAlphanumericCharacter?: boolean;
}
/**
 * Internal typing of password validation status that is modifiable. This allows us to
 * construct the validation status before returning it.
 *
 * @internal
 */
export interface PasswordValidationStatusInternal extends PasswordValidationStatus {
    /**
     * Whether the password meets all requirements.
     */
    isValid: boolean;
    /**
     * Whether the password meets the minimum password length.
     */
    meetsMinPasswordLength?: boolean;
    /**
     * Whether the password meets the maximum password length.
     */
    meetsMaxPasswordLength?: boolean;
    /**
     * Whether the password contains a lowercase letter, if required.
     */
    containsLowercaseLetter?: boolean;
    /**
     * Whether the password contains an uppercase letter, if required.
     */
    containsUppercaseLetter?: boolean;
    /**
     * Whether the password contains a numeric character, if required.
     */
    containsNumericCharacter?: boolean;
    /**
     * Whether the password contains a non-alphanumeric character, if required.
     */
    containsNonAlphanumericCharacter?: boolean;
    /**
     * The policy used to validate the password.
     */
    passwordPolicy: PasswordPolicy;
}
