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
import { Auth } from '@firebase/auth';
export declare function randomEmail(): string;
export declare function getTestInstance(requireEmulator?: boolean): Auth;
export declare function cleanUpTestInstance(auth: Auth): Promise<void>;
export declare function getTotpCode(sharedSecretKey: string, periodSec: number, verificationCodeLength: number, timestamp: Date): string;
export declare const email = "totpuser-donotdelete@test.com";
export declare const password = "password";
export declare const incorrectTotpCode = "1000000";
/**
 * Generates a valid password for the project or tenant password policy in the Auth instance.
 * @param auth The {@link Auth} instance.
 * @returns A valid password according to the password policy.
 */
export declare function generateValidPassword(auth: Auth): Promise<string>;
