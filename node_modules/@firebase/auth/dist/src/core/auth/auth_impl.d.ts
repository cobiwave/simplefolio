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
import { _FirebaseService, FirebaseApp } from '@firebase/app';
import { Provider } from '@firebase/component';
import { AppCheckInternalComponentName } from '@firebase/app-check-interop-types';
import { Auth, AuthErrorMap, AuthSettings, EmulatorConfig, NextOrObserver, Persistence, PopupRedirectResolver, User, CompleteFn, ErrorFn, Unsubscribe, PasswordValidationStatus } from '../../model/public_types';
import { ErrorFactory } from '@firebase/util';
import { AuthInternal, ConfigInternal } from '../../model/auth';
import { PopupRedirectResolverInternal } from '../../model/popup_redirect';
import { UserInternal } from '../../model/user';
import { AuthErrorCode, AuthErrorParams } from '../errors';
import { PersistenceInternal } from '../persistence';
import { RecaptchaConfig } from '../../platform_browser/recaptcha/recaptcha';
import { PasswordPolicyInternal } from '../../model/password_policy';
export declare const enum DefaultConfig {
    TOKEN_API_HOST = "securetoken.googleapis.com",
    API_HOST = "identitytoolkit.googleapis.com",
    API_SCHEME = "https"
}
export declare class AuthImpl implements AuthInternal, _FirebaseService {
    readonly app: FirebaseApp;
    private readonly heartbeatServiceProvider;
    private readonly appCheckServiceProvider;
    readonly config: ConfigInternal;
    currentUser: User | null;
    emulatorConfig: EmulatorConfig | null;
    private operations;
    private persistenceManager?;
    private redirectPersistenceManager?;
    private authStateSubscription;
    private idTokenSubscription;
    private readonly beforeStateQueue;
    private redirectUser;
    private isProactiveRefreshEnabled;
    private readonly EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION;
    _canInitEmulator: boolean;
    _isInitialized: boolean;
    _deleted: boolean;
    _initializationPromise: Promise<void> | null;
    _popupRedirectResolver: PopupRedirectResolverInternal | null;
    _errorFactory: ErrorFactory<AuthErrorCode, AuthErrorParams>;
    _agentRecaptchaConfig: RecaptchaConfig | null;
    _tenantRecaptchaConfigs: Record<string, RecaptchaConfig>;
    _projectPasswordPolicy: PasswordPolicyInternal | null;
    _tenantPasswordPolicies: Record<string, PasswordPolicyInternal>;
    readonly name: string;
    private lastNotifiedUid;
    languageCode: string | null;
    tenantId: string | null;
    settings: AuthSettings;
    constructor(app: FirebaseApp, heartbeatServiceProvider: Provider<'heartbeat'>, appCheckServiceProvider: Provider<AppCheckInternalComponentName>, config: ConfigInternal);
    _initializeWithPersistence(persistenceHierarchy: PersistenceInternal[], popupRedirectResolver?: PopupRedirectResolver): Promise<void>;
    /**
     * If the persistence is changed in another window, the user manager will let us know
     */
    _onStorageEvent(): Promise<void>;
    private initializeCurrentUser;
    private tryRedirectSignIn;
    private reloadAndSetCurrentUserOrClear;
    useDeviceLanguage(): void;
    _delete(): Promise<void>;
    updateCurrentUser(userExtern: User | null): Promise<void>;
    _updateCurrentUser(user: User | null, skipBeforeStateCallbacks?: boolean): Promise<void>;
    signOut(): Promise<void>;
    setPersistence(persistence: Persistence): Promise<void>;
    _getRecaptchaConfig(): RecaptchaConfig | null;
    validatePassword(password: string): Promise<PasswordValidationStatus>;
    _getPasswordPolicyInternal(): PasswordPolicyInternal | null;
    _updatePasswordPolicy(): Promise<void>;
    _getPersistence(): string;
    _updateErrorMap(errorMap: AuthErrorMap): void;
    onAuthStateChanged(nextOrObserver: NextOrObserver<User>, error?: ErrorFn, completed?: CompleteFn): Unsubscribe;
    beforeAuthStateChanged(callback: (user: User | null) => void | Promise<void>, onAbort?: () => void): Unsubscribe;
    onIdTokenChanged(nextOrObserver: NextOrObserver<User>, error?: ErrorFn, completed?: CompleteFn): Unsubscribe;
    authStateReady(): Promise<void>;
    /**
     * Revokes the given access token. Currently only supports Apple OAuth access tokens.
     */
    revokeAccessToken(token: string): Promise<void>;
    toJSON(): object;
    _setRedirectUser(user: UserInternal | null, popupRedirectResolver?: PopupRedirectResolver): Promise<void>;
    private getOrInitRedirectPersistenceManager;
    _redirectUserForId(id: string): Promise<UserInternal | null>;
    _persistUserIfCurrent(user: UserInternal): Promise<void>;
    /** Notifies listeners only if the user is current */
    _notifyListenersIfCurrent(user: UserInternal): void;
    _key(): string;
    _startProactiveRefresh(): void;
    _stopProactiveRefresh(): void;
    /** Returns the current user cast as the internal type */
    get _currentUser(): UserInternal;
    private notifyAuthListeners;
    private registerStateListener;
    /**
     * Unprotected (from race conditions) method to set the current user. This
     * should only be called from within a queued callback. This is necessary
     * because the queue shouldn't rely on another queued callback.
     */
    private directlySetCurrentUser;
    private queue;
    private get assertedPersistence();
    private frameworks;
    private clientVersion;
    _logFramework(framework: string): void;
    _getFrameworks(): readonly string[];
    _getAdditionalHeaders(): Promise<Record<string, string>>;
    _getAppCheckToken(): Promise<string | undefined>;
}
/**
 * Method to be used to cast down to our private implmentation of Auth.
 * It will also handle unwrapping from the compat type if necessary
 *
 * @param auth Auth object passed in from developer
 */
export declare function _castAuth(auth: Auth): AuthInternal;
