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
 * Interface that represents the credentials returned by {@link EmailAuthProvider} for
 * {@link ProviderId}.PASSWORD
 *
 * @remarks
 * Covers both {@link SignInMethod}.EMAIL_PASSWORD and
 * {@link SignInMethod}.EMAIL_LINK.
 *
 * @public
 */
export declare class EmailAuthCredential extends AuthCredential {
    /** @internal */
    readonly _email: string;
    /** @internal */
    readonly _password: string;
    /** @internal */
    readonly _tenantId: string | null;
    /** @internal */
    private constructor();
    /** @internal */
    static _fromEmailAndPassword(email: string, password: string): EmailAuthCredential;
    /** @internal */
    static _fromEmailAndCode(email: string, oobCode: string, tenantId?: string | null): EmailAuthCredential;
    /** {@inheritdoc AuthCredential.toJSON} */
    toJSON(): object;
    /**
     * Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
     *
     * @param json - Either `object` or the stringified representation of the object. When string is
     * provided, `JSON.parse` would be called first.
     *
     * @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
     */
    static fromJSON(json: object | string): EmailAuthCredential | null;
    /** @internal */
    _getIdTokenResponse(auth: AuthInternal): Promise<IdTokenResponse>;
    /** @internal */
    _linkToIdToken(auth: AuthInternal, idToken: string): Promise<IdTokenResponse>;
    /** @internal */
    _getReauthenticationResolver(auth: AuthInternal): Promise<IdTokenResponse>;
}
