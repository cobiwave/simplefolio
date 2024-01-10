/**
 * @license
 * Copyright 2019 Google LLC
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
import { User } from '../../model/public_types';
import { UserInternal, UserCredentialInternal } from '../../model/user';
import { AuthCredential } from '../credentials';
/**
 * Unlinks a provider from a user account.
 *
 * @param user - The user.
 * @param providerId - The provider to unlink.
 *
 * @public
 */
export declare function unlink(user: User, providerId: string): Promise<User>;
export declare function _link(user: UserInternal, credential: AuthCredential, bypassAuthState?: boolean): Promise<UserCredentialInternal>;
export declare function _assertLinkedStatus(expected: boolean, user: UserInternal, provider: string): Promise<void>;
