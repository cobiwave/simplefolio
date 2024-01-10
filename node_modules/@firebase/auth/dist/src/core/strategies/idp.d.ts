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
import { AuthInternal } from '../../model/auth';
import { UserInternal, UserCredentialInternal } from '../../model/user';
export interface IdpTaskParams {
    auth: AuthInternal;
    requestUri: string;
    sessionId?: string;
    tenantId?: string;
    postBody?: string;
    pendingToken?: string;
    user?: UserInternal;
    bypassAuthState?: boolean;
}
export declare type IdpTask = (params: IdpTaskParams) => Promise<UserCredentialInternal>;
export declare function _signIn(params: IdpTaskParams): Promise<UserCredentialInternal>;
export declare function _reauth(params: IdpTaskParams): Promise<UserCredentialInternal>;
export declare function _link(params: IdpTaskParams): Promise<UserCredentialInternal>;
