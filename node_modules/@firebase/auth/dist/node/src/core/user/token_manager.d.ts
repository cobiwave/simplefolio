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
import { FinalizeMfaResponse } from '../../api/authentication/mfa';
import { AuthInternal } from '../../model/auth';
import { IdTokenResponse } from '../../model/id_token';
import { PersistedBlob } from '../persistence';
/**
 * The number of milliseconds before the official expiration time of a token
 * to refresh that token, to provide a buffer for RPCs to complete.
 */
export declare const enum Buffer {
    TOKEN_REFRESH = 30000
}
/**
 * We need to mark this class as internal explicitly to exclude it in the public typings, because
 * it references AuthInternal which has a circular dependency with UserInternal.
 *
 * @internal
 */
export declare class StsTokenManager {
    refreshToken: string | null;
    accessToken: string | null;
    expirationTime: number | null;
    get isExpired(): boolean;
    updateFromServerResponse(response: IdTokenResponse | FinalizeMfaResponse): void;
    getToken(auth: AuthInternal, forceRefresh?: boolean): Promise<string | null>;
    clearRefreshToken(): void;
    private refresh;
    private updateTokensAndExpiration;
    static fromJSON(appName: string, object: PersistedBlob): StsTokenManager;
    toJSON(): object;
    _assign(stsTokenManager: StsTokenManager): void;
    _clone(): StsTokenManager;
    _performRefresh(): never;
}
