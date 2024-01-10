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
import { Auth } from '../../model/public_types';
export declare const enum TokenType {
    REFRESH_TOKEN = "REFRESH_TOKEN",
    ACCESS_TOKEN = "ACCESS_TOKEN"
}
export interface RequestStsTokenResponse {
    accessToken: string;
    expiresIn: string;
    refreshToken: string;
}
export interface RevokeTokenRequest {
    providerId: string;
    tokenType: TokenType;
    token: string;
    idToken: string;
    tenantId?: string;
}
export interface RevokeTokenResponse {
}
export declare function requestStsToken(auth: Auth, refreshToken: string): Promise<RequestStsTokenResponse>;
export declare function revokeToken(auth: Auth, request: RevokeTokenRequest): Promise<RevokeTokenResponse>;
