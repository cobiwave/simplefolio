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
import { FirebaseApp, _FirebaseService } from '@firebase/app-compat';
import * as exp from '@firebase/auth/internal';
import * as compat from '@firebase/auth-types';
import { Provider } from '@firebase/component';
import { Observer, Unsubscribe } from '@firebase/util';
import { Wrapper } from './wrap';
export declare class Auth implements compat.FirebaseAuth, Wrapper<exp.Auth>, _FirebaseService {
    readonly app: FirebaseApp;
    static Persistence: {
        LOCAL: string;
        NONE: string;
        SESSION: string;
    };
    readonly _delegate: exp.AuthImpl;
    constructor(app: FirebaseApp, provider: Provider<'auth'>);
    get emulatorConfig(): compat.EmulatorConfig | null;
    get currentUser(): compat.User | null;
    get languageCode(): string | null;
    set languageCode(languageCode: string | null);
    get settings(): compat.AuthSettings;
    get tenantId(): string | null;
    set tenantId(tid: string | null);
    useDeviceLanguage(): void;
    signOut(): Promise<void>;
    useEmulator(url: string, options?: {
        disableWarnings: boolean;
    }): void;
    applyActionCode(code: string): Promise<void>;
    checkActionCode(code: string): Promise<compat.ActionCodeInfo>;
    confirmPasswordReset(code: string, newPassword: string): Promise<void>;
    createUserWithEmailAndPassword(email: string, password: string): Promise<compat.UserCredential>;
    fetchProvidersForEmail(email: string): Promise<string[]>;
    fetchSignInMethodsForEmail(email: string): Promise<string[]>;
    isSignInWithEmailLink(emailLink: string): boolean;
    getRedirectResult(): Promise<compat.UserCredential>;
    addFrameworkForLogging(framework: string): void;
    onAuthStateChanged(nextOrObserver: Observer<unknown> | ((a: compat.User | null) => unknown), errorFn?: (error: compat.Error) => unknown, completed?: Unsubscribe): Unsubscribe;
    onIdTokenChanged(nextOrObserver: Observer<unknown> | ((a: compat.User | null) => unknown), errorFn?: (error: compat.Error) => unknown, completed?: Unsubscribe): Unsubscribe;
    sendSignInLinkToEmail(email: string, actionCodeSettings: compat.ActionCodeSettings): Promise<void>;
    sendPasswordResetEmail(email: string, actionCodeSettings?: compat.ActionCodeSettings | null): Promise<void>;
    setPersistence(persistence: string): Promise<void>;
    signInAndRetrieveDataWithCredential(credential: compat.AuthCredential): Promise<compat.UserCredential>;
    signInAnonymously(): Promise<compat.UserCredential>;
    signInWithCredential(credential: compat.AuthCredential): Promise<compat.UserCredential>;
    signInWithCustomToken(token: string): Promise<compat.UserCredential>;
    signInWithEmailAndPassword(email: string, password: string): Promise<compat.UserCredential>;
    signInWithEmailLink(email: string, emailLink?: string): Promise<compat.UserCredential>;
    signInWithPhoneNumber(phoneNumber: string, applicationVerifier: compat.ApplicationVerifier): Promise<compat.ConfirmationResult>;
    signInWithPopup(provider: compat.AuthProvider): Promise<compat.UserCredential>;
    signInWithRedirect(provider: compat.AuthProvider): Promise<void>;
    updateCurrentUser(user: compat.User | null): Promise<void>;
    verifyPasswordResetCode(code: string): Promise<string>;
    unwrap(): exp.Auth;
    _delete(): Promise<void>;
    private linkUnderlyingAuth;
}
