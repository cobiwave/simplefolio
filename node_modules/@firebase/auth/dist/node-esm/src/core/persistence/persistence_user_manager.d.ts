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
import { ApiKey, AppName, AuthInternal } from '../../model/auth';
import { UserInternal } from '../../model/user';
import { PersistenceInternal } from '../persistence';
export declare const enum KeyName {
    AUTH_USER = "authUser",
    AUTH_EVENT = "authEvent",
    REDIRECT_USER = "redirectUser",
    PERSISTENCE_USER = "persistence"
}
export declare const enum Namespace {
    PERSISTENCE = "firebase"
}
export declare function _persistenceKeyName(key: string, apiKey: ApiKey, appName: AppName): string;
export declare class PersistenceUserManager {
    persistence: PersistenceInternal;
    private readonly auth;
    private readonly userKey;
    private readonly fullUserKey;
    private readonly fullPersistenceKey;
    private readonly boundEventHandler;
    private constructor();
    setCurrentUser(user: UserInternal): Promise<void>;
    getCurrentUser(): Promise<UserInternal | null>;
    removeCurrentUser(): Promise<void>;
    savePersistenceForRedirect(): Promise<void>;
    setPersistence(newPersistence: PersistenceInternal): Promise<void>;
    delete(): void;
    static create(auth: AuthInternal, persistenceHierarchy: PersistenceInternal[], userKey?: KeyName): Promise<PersistenceUserManager>;
}
