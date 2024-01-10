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
import { IdTokenResult } from '../../model/public_types';
import { NextFn } from '@firebase/util';
import { APIUserInfo } from '../../api/account_management/account';
import { FinalizeMfaResponse } from '../../api/authentication/mfa';
import { AuthInternal } from '../../model/auth';
import { IdTokenResponse } from '../../model/id_token';
import { MutableUserInfo, UserInternal, UserParameters } from '../../model/user';
import { PersistedBlob } from '../persistence';
import { StsTokenManager } from './token_manager';
import { UserMetadata } from './user_metadata';
import { ProviderId } from '../../model/enums';
export declare class UserImpl implements UserInternal {
    readonly providerId = ProviderId.FIREBASE;
    stsTokenManager: StsTokenManager;
    private accessToken;
    uid: string;
    auth: AuthInternal;
    emailVerified: boolean;
    isAnonymous: boolean;
    tenantId: string | null;
    readonly metadata: UserMetadata;
    providerData: MutableUserInfo[];
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    _redirectEventId?: string;
    private readonly proactiveRefresh;
    constructor({ uid, auth, stsTokenManager, ...opt }: UserParameters);
    getIdToken(forceRefresh?: boolean): Promise<string>;
    getIdTokenResult(forceRefresh?: boolean): Promise<IdTokenResult>;
    reload(): Promise<void>;
    private reloadUserInfo;
    private reloadListener;
    _assign(user: UserInternal): void;
    _clone(auth: AuthInternal): UserInternal;
    _onReload(callback: NextFn<APIUserInfo>): void;
    _notifyReloadListener(userInfo: APIUserInfo): void;
    _startProactiveRefresh(): void;
    _stopProactiveRefresh(): void;
    _updateTokensIfNecessary(response: IdTokenResponse | FinalizeMfaResponse, reload?: boolean): Promise<void>;
    delete(): Promise<void>;
    toJSON(): PersistedBlob;
    get refreshToken(): string;
    static _fromJSON(auth: AuthInternal, object: PersistedBlob): UserInternal;
    /**
     * Initialize a User from an idToken server response
     * @param auth
     * @param idTokenResponse
     */
    static _fromIdTokenResponse(auth: AuthInternal, idTokenResponse: IdTokenResponse, isAnonymous?: boolean): Promise<UserInternal>;
}
