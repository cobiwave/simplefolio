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
import { AuthInternal } from '../../model/auth';
import { IdTokenResponse } from '../../model/id_token';
import { AuthCredential } from './auth_credential';
/**
 * @public
 */
export declare class SAMLAuthCredential extends AuthCredential {
    private readonly pendingToken;
    /** @internal */
    private constructor();
    /** @internal */
    _getIdTokenResponse(auth: AuthInternal): Promise<IdTokenResponse>;
    /** @internal */
    _linkToIdToken(auth: AuthInternal, idToken: string): Promise<IdTokenResponse>;
    /** @internal */
    _getReauthenticationResolver(auth: AuthInternal): Promise<IdTokenResponse>;
    /** {@inheritdoc AuthCredential.toJSON}  */
    toJSON(): object;
    /**
     * Static method to deserialize a JSON representation of an object into an
     * {@link  AuthCredential}.
     *
     * @param json - Input can be either Object or the stringified representation of the object.
     * When string is provided, JSON.parse would be called first.
     *
     * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
     */
    static fromJSON(json: string | object): SAMLAuthCredential | null;
    /**
     * Helper static method to avoid exposing the constructor to end users.
     *
     * @internal
     */
    static _create(providerId: string, pendingToken: string): SAMLAuthCredential;
    private buildRequest;
}
