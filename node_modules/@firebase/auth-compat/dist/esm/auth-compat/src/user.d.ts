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
import * as exp from '@firebase/auth/internal';
import * as compat from '@firebase/auth-types';
import { Compat } from '@firebase/util';
export declare class User implements compat.User, Compat<exp.User> {
    readonly _delegate: exp.User;
    private static readonly USER_MAP;
    readonly multiFactor: compat.MultiFactorUser;
    private constructor();
    static getOrCreate(user: exp.User): User;
    delete(): Promise<void>;
    reload(): Promise<void>;
    toJSON(): object;
    getIdTokenResult(forceRefresh?: boolean): Promise<compat.IdTokenResult>;
    getIdToken(forceRefresh?: boolean): Promise<string>;
    linkAndRetrieveDataWithCredential(credential: compat.AuthCredential): Promise<compat.UserCredential>;
    linkWithCredential(credential: compat.AuthCredential): Promise<compat.UserCredential>;
    linkWithPhoneNumber(phoneNumber: string, applicationVerifier: compat.ApplicationVerifier): Promise<compat.ConfirmationResult>;
    linkWithPopup(provider: compat.AuthProvider): Promise<compat.UserCredential>;
    linkWithRedirect(provider: compat.AuthProvider): Promise<void>;
    reauthenticateAndRetrieveDataWithCredential(credential: compat.AuthCredential): Promise<compat.UserCredential>;
    reauthenticateWithCredential(credential: compat.AuthCredential): Promise<compat.UserCredential>;
    reauthenticateWithPhoneNumber(phoneNumber: string, applicationVerifier: compat.ApplicationVerifier): Promise<compat.ConfirmationResult>;
    reauthenticateWithPopup(provider: compat.AuthProvider): Promise<compat.UserCredential>;
    reauthenticateWithRedirect(provider: compat.AuthProvider): Promise<void>;
    sendEmailVerification(actionCodeSettings?: compat.ActionCodeSettings | null): Promise<void>;
    unlink(providerId: string): Promise<compat.User>;
    updateEmail(newEmail: string): Promise<void>;
    updatePassword(newPassword: string): Promise<void>;
    updatePhoneNumber(phoneCredential: compat.AuthCredential): Promise<void>;
    updateProfile(profile: {
        displayName?: string | null;
        photoURL?: string | null;
    }): Promise<void>;
    verifyBeforeUpdateEmail(newEmail: string, actionCodeSettings?: compat.ActionCodeSettings | null): Promise<void>;
    get emailVerified(): boolean;
    get isAnonymous(): boolean;
    get metadata(): compat.UserMetadata;
    get phoneNumber(): string | null;
    get providerData(): Array<compat.UserInfo | null>;
    get refreshToken(): string;
    get tenantId(): string | null;
    get displayName(): string | null;
    get email(): string | null;
    get photoURL(): string | null;
    get providerId(): string;
    get uid(): string;
    private get auth();
}
