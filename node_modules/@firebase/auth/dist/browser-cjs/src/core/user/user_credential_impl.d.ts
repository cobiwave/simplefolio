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
import { PhoneOrOauthTokenResponse } from '../../api/authentication/mfa';
import { IdTokenResponse } from '../../model/id_token';
import { UserInternal, UserCredentialInternal } from '../../model/user';
import { AuthInternal } from '../../model/auth';
import { OperationType, ProviderId } from '../../model/enums';
interface UserCredentialParams {
    readonly user: UserInternal;
    readonly providerId: ProviderId | string | null;
    readonly _tokenResponse?: PhoneOrOauthTokenResponse;
    readonly operationType: OperationType;
}
export declare class UserCredentialImpl implements UserCredentialInternal, UserCredentialParams {
    readonly user: UserInternal;
    readonly providerId: ProviderId | string | null;
    readonly _tokenResponse: PhoneOrOauthTokenResponse | undefined;
    readonly operationType: OperationType;
    constructor(params: UserCredentialParams);
    static _fromIdTokenResponse(auth: AuthInternal, operationType: OperationType, idTokenResponse: IdTokenResponse, isAnonymous?: boolean): Promise<UserCredentialInternal>;
    static _forOperation(user: UserInternal, operationType: OperationType, response: PhoneOrOauthTokenResponse): Promise<UserCredentialImpl>;
}
export {};
