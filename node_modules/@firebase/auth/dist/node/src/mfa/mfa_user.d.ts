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
import { MultiFactorAssertion, MultiFactorInfo, MultiFactorSession, MultiFactorUser, User } from '../model/public_types';
import { UserInternal } from '../model/user';
export declare class MultiFactorUserImpl implements MultiFactorUser {
    readonly user: UserInternal;
    enrolledFactors: MultiFactorInfo[];
    private constructor();
    static _fromUser(user: UserInternal): MultiFactorUserImpl;
    getSession(): Promise<MultiFactorSession>;
    enroll(assertionExtern: MultiFactorAssertion, displayName?: string | null): Promise<void>;
    unenroll(infoOrUid: MultiFactorInfo | string): Promise<void>;
}
/**
 * The {@link MultiFactorUser} corresponding to the user.
 *
 * @remarks
 * This is used to access all multi-factor properties and operations related to the user.
 *
 * @param user - The user.
 *
 * @public
 */
export declare function multiFactor(user: User): MultiFactorUser;
