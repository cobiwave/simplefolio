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
import { ProviderId, SignInMethod } from '../../src/model/enums';
import { PhoneOrOauthTokenResponse } from '../../src/api/authentication/mfa';
import { AuthCredential } from '../../src/core/credentials';
import { AuthInternal } from '../../src/model/auth';
import { IdTokenResponse } from '../../src/model/id_token';
export declare class MockAuthCredential implements AuthCredential {
    readonly providerId: ProviderId;
    readonly signInMethod: SignInMethod;
    constructor(providerId: ProviderId, signInMethod: SignInMethod);
    toJSON(): object;
    fromJSON(_json: string | object): AuthCredential | null;
    _getIdTokenResponse(_auth: AuthInternal): Promise<PhoneOrOauthTokenResponse>;
    _linkToIdToken(_auth: AuthInternal, _idToken: string): Promise<IdTokenResponse>;
    _getReauthenticationResolver(_auth: AuthInternal): Promise<IdTokenResponse>;
}
