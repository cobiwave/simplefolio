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
import { Auth, AuthSettings, Config, EmulatorConfig, PasswordPolicy, PasswordValidationStatus, PopupRedirectResolver, User } from './public_types';
import { ErrorFactory } from '@firebase/util';
import { AuthErrorCode, AuthErrorParams } from '../core/errors';
import { PopupRedirectResolverInternal } from './popup_redirect';
import { UserInternal } from './user';
import { ClientPlatform } from '../core/util/version';
import { RecaptchaConfig } from '../platform_browser/recaptcha/recaptcha';
import { PasswordPolicyInternal } from './password_policy';
export declare type AppName = string;
export declare type ApiKey = string;
export declare type AuthDomain = string;
/**
 * @internal
 */
export interface ConfigInternal extends Config {
    /**
     * @readonly
     */
    emulator?: {
        url: string;
    };
    /**
     * @readonly
     */
    clientPlatform: ClientPlatform;
}
/**
 * UserInternal and AuthInternal reference each other, so both of them are included in the public typings.
 * In order to exclude them, we mark them as internal explicitly.
 *
 * @internal
 */
export interface AuthInternal extends Auth {
    currentUser: User | null;
    emulatorConfig: EmulatorConfig | null;
    _agentRecaptchaConfig: RecaptchaConfig | null;
    _tenantRecaptchaConfigs: Record<string, RecaptchaConfig>;
    _projectPasswordPolicy: PasswordPolicy | null;
    _tenantPasswordPolicies: Record<string, PasswordPolicy>;
    _canInitEmulator: boolean;
    _isInitialized: boolean;
    _initializationPromise: Promise<void> | null;
    _updateCurrentUser(user: UserInternal | null): Promise<void>;
    _onStorageEvent(): void;
    _notifyListenersIfCurrent(user: UserInternal): void;
    _persistUserIfCurrent(user: UserInternal): Promise<void>;
    _setRedirectUser(user: UserInternal | null, popupRedirectResolver?: PopupRedirectResolver): Promise<void>;
    _redirectUserForId(id: string): Promise<UserInternal | null>;
    _popupRedirectResolver: PopupRedirectResolverInternal | null;
    _key(): string;
    _startProactiveRefresh(): void;
    _stopProactiveRefresh(): void;
    _getPersistence(): string;
    _getRecaptchaConfig(): RecaptchaConfig | null;
    _getPasswordPolicyInternal(): PasswordPolicyInternal | null;
    _updatePasswordPolicy(): Promise<void>;
    _logFramework(framework: string): void;
    _getFrameworks(): readonly string[];
    _getAdditionalHeaders(): Promise<Record<string, string>>;
    _getAppCheckToken(): Promise<string | undefined>;
    readonly name: AppName;
    readonly config: ConfigInternal;
    languageCode: string | null;
    tenantId: string | null;
    readonly settings: AuthSettings;
    _errorFactory: ErrorFactory<AuthErrorCode, AuthErrorParams>;
    useDeviceLanguage(): void;
    signOut(): Promise<void>;
    validatePassword(password: string): Promise<PasswordValidationStatus>;
    revokeAccessToken(token: string): Promise<void>;
}
