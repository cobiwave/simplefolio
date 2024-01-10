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
export interface OAuthCredentialParams {
    idToken?: string | null;
    accessToken?: string | null;
    oauthToken?: string;
    secret?: string;
    oauthTokenSecret?: string;
    nonce?: string;
    pendingToken?: string;
    providerId: string;
    signInMethod: string;
}
/**
 * Represents the OAuth credentials returned by an {@link OAuthProvider}.
 *
 * @remarks
 * Implementations specify the details about each auth provider's credential requirements.
 *
 * @public
 */
export declare class OAuthCredential extends AuthCredential {
    /**
     * The OAuth ID token associated with the credential if it belongs to an OIDC provider,
     * such as `google.com`.
     * @readonly
     */
    idToken?: string;
    /**
     * The OAuth access token associated with the credential if it belongs to an
     * {@link OAuthProvider}, such as `facebook.com`, `twitter.com`, etc.
     * @readonly
     */
    accessToken?: string;
    /**
     * The OAuth access token secret associated with the credential if it belongs to an OAuth 1.0
     * provider, such as `twitter.com`.
     * @readonly
     */
    secret?: string;
    private nonce?;
    private pendingToken;
    /** @internal */
    static _fromParams(params: OAuthCredentialParams): OAuthCredential;
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
    static fromJSON(json: string | object): OAuthCredential | null;
    /** @internal */
    _getIdTokenResponse(auth: AuthInternal): Promise<IdTokenResponse>;
    /** @internal */
    _linkToIdToken(auth: AuthInternal, idToken: string): Promise<IdTokenResponse>;
    /** @internal */
    _getReauthenticationResolver(auth: AuthInternal): Promise<IdTokenResponse>;
    private buildRequest;
}
