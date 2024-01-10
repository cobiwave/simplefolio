/**
 * @license
 * Copyright 2017 Google LLC
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
import { AppCheckInternalComponentName } from '@firebase/app-check-interop-types';
import { FirebaseAuthInternalName } from '@firebase/auth-interop-types';
import { Provider } from '@firebase/component';
import { User } from '../auth/user';
import { AsyncQueue } from '../util/async_queue';
/**
 * @internal
 */
export declare type AuthTokenFactory = () => string;
/**
 * @internal
 */
export interface FirstPartyCredentialsSettings {
    ['type']: 'firstParty';
    ['sessionIndex']: string;
    ['iamToken']: string | null;
    ['authTokenFactory']: AuthTokenFactory | null;
}
export interface ProviderCredentialsSettings {
    ['type']: 'provider';
    ['client']: CredentialsProvider<User>;
}
/** Settings for private credentials */
export declare type CredentialsSettings = FirstPartyCredentialsSettings | ProviderCredentialsSettings;
export declare type TokenType = 'OAuth' | 'FirstParty' | 'AppCheck';
export interface Token {
    /** Type of token. */
    type: TokenType;
    /**
     * The user with which the token is associated (used for persisting user
     * state on disk, etc.).
     * This will be null for Tokens of the type 'AppCheck'.
     */
    user?: User;
    /** Header values to set for this token */
    headers: Map<string, string>;
}
export declare class OAuthToken implements Token {
    user: User;
    type: TokenType;
    headers: Map<any, any>;
    constructor(value: string, user: User);
}
/**
 * A Listener for credential change events. The listener should fetch a new
 * token and may need to invalidate other state if the current user has also
 * changed.
 */
export declare type CredentialChangeListener<T> = (credential: T) => Promise<void>;
/**
 * Provides methods for getting the uid and token for the current user and
 * listening for changes.
 */
export interface CredentialsProvider<T> {
    /**
     * Starts the credentials provider and specifies a listener to be notified of
     * credential changes (sign-in / sign-out, token changes). It is immediately
     * called once with the initial user.
     *
     * The change listener is invoked on the provided AsyncQueue.
     */
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<T>): void;
    /** Requests a token for the current user. */
    getToken(): Promise<Token | null>;
    /**
     * Marks the last retrieved token as invalid, making the next GetToken request
     * force-refresh the token.
     */
    invalidateToken(): void;
    shutdown(): void;
}
/**
 * A CredentialsProvider that always yields an empty token.
 * @internal
 */
export declare class EmptyAuthCredentialsProvider implements CredentialsProvider<User> {
    getToken(): Promise<Token | null>;
    invalidateToken(): void;
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<User>): void;
    shutdown(): void;
}
/**
 * A CredentialsProvider that always returns a constant token. Used for
 * emulator token mocking.
 */
export declare class EmulatorAuthCredentialsProvider implements CredentialsProvider<User> {
    private token;
    constructor(token: Token);
    /**
     * Stores the listener registered with setChangeListener()
     * This isn't actually necessary since the UID never changes, but we use this
     * to verify the listen contract is adhered to in tests.
     */
    private changeListener;
    getToken(): Promise<Token | null>;
    invalidateToken(): void;
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<User>): void;
    shutdown(): void;
}
/** Credential provider for the Lite SDK. */
export declare class LiteAuthCredentialsProvider implements CredentialsProvider<User> {
    private auth;
    constructor(authProvider: Provider<FirebaseAuthInternalName>);
    getToken(): Promise<Token | null>;
    invalidateToken(): void;
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<User>): void;
    shutdown(): void;
}
export declare class FirebaseAuthCredentialsProvider implements CredentialsProvider<User> {
    private authProvider;
    /**
     * The auth token listener registered with FirebaseApp, retained here so we
     * can unregister it.
     */
    private tokenListener;
    /** Tracks the current User. */
    private currentUser;
    /**
     * Counter used to detect if the token changed while a getToken request was
     * outstanding.
     */
    private tokenCounter;
    private forceRefresh;
    private auth;
    constructor(authProvider: Provider<FirebaseAuthInternalName>);
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<User>): void;
    getToken(): Promise<Token | null>;
    invalidateToken(): void;
    shutdown(): void;
    private getUser;
}
export declare class FirstPartyToken implements Token {
    private readonly sessionIndex;
    private readonly iamToken;
    private readonly authTokenFactory;
    type: TokenType;
    user: User;
    private _headers;
    constructor(sessionIndex: string, iamToken: string | null, authTokenFactory: AuthTokenFactory | null);
    /**
     * Gets an authorization token, using a provided factory function, or return
     * null.
     */
    private getAuthToken;
    get headers(): Map<string, string>;
}
export declare class FirstPartyAuthCredentialsProvider implements CredentialsProvider<User> {
    private sessionIndex;
    private iamToken;
    private authTokenFactory;
    constructor(sessionIndex: string, iamToken: string | null, authTokenFactory: AuthTokenFactory | null);
    getToken(): Promise<Token | null>;
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<User>): void;
    shutdown(): void;
    invalidateToken(): void;
}
export declare class AppCheckToken implements Token {
    private value;
    type: TokenType;
    headers: Map<any, any>;
    constructor(value: string);
}
export declare class FirebaseAppCheckTokenProvider implements CredentialsProvider<string> {
    private appCheckProvider;
    /**
     * The AppCheck token listener registered with FirebaseApp, retained here so
     * we can unregister it.
     */
    private tokenListener;
    private forceRefresh;
    private appCheck;
    private latestAppCheckToken;
    constructor(appCheckProvider: Provider<AppCheckInternalComponentName>);
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<string>): void;
    getToken(): Promise<Token | null>;
    invalidateToken(): void;
    shutdown(): void;
}
/**
 * An AppCheck token provider that always yields an empty token.
 * @internal
 */
export declare class EmptyAppCheckTokenProvider implements CredentialsProvider<string> {
    getToken(): Promise<Token | null>;
    invalidateToken(): void;
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<string>): void;
    shutdown(): void;
}
/** AppCheck token provider for the Lite SDK. */
export declare class LiteAppCheckTokenProvider implements CredentialsProvider<string> {
    private appCheckProvider;
    private appCheck;
    constructor(appCheckProvider: Provider<AppCheckInternalComponentName>);
    getToken(): Promise<Token | null>;
    invalidateToken(): void;
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<string>): void;
    shutdown(): void;
}
/**
 * Builds a CredentialsProvider depending on the type of
 * the credentials passed in.
 */
export declare function makeAuthCredentialsProvider(credentials?: CredentialsSettings): CredentialsProvider<User>;
