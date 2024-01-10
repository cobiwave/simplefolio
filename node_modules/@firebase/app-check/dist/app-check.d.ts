/**
 * The Firebase App Check Web SDK.
 *
 * @remarks
 * Firebase App Check does not work in a Node.js environment using `ReCaptchaV3Provider` or
 * `ReCaptchaEnterpriseProvider`, but can be used in Node.js if you use
 * `CustomProvider` and write your own attestation method.
 *
 * @packageDocumentation
 */

import { FirebaseApp } from '@firebase/app';
import { PartialObserver } from '@firebase/util';
import { Unsubscribe } from '@firebase/util';

/**
 * The Firebase App Check service interface.
 *
 * @public
 */
export declare interface AppCheck {
    /**
     * The {@link @firebase/app#FirebaseApp} this `AppCheck` instance is associated with.
     */
    app: FirebaseApp;
}

/**
 * @internal
 */
export declare type _AppCheckComponentName = 'app-check';

/**
 * @internal
 */
export declare type _AppCheckInternalComponentName = 'app-check-internal';

/**
 * Options for App Check initialization.
 * @public
 */
export declare interface AppCheckOptions {
    /**
     * A reCAPTCHA V3 provider, reCAPTCHA Enterprise provider, or custom provider.
     */
    provider: CustomProvider | ReCaptchaV3Provider | ReCaptchaEnterpriseProvider;
    /**
     * If set to true, enables automatic background refresh of App Check token.
     */
    isTokenAutoRefreshEnabled?: boolean;
}

declare interface AppCheckProvider {
    /**
     * Returns an App Check token.
     * @internal
     */
    getToken: () => Promise<AppCheckTokenInternal>;
    /**
     * @internal
     */
    initialize(app: FirebaseApp): void;
}

/**
 * The token returned from an App Check provider.
 * @public
 */
export declare interface AppCheckToken {
    readonly token: string;
    /**
     * The local timestamp after which the token will expire.
     */
    readonly expireTimeMillis: number;
}

declare interface AppCheckTokenInternal extends AppCheckToken {
    issuedAtTimeMillis: number;
}

/**
 * A listener that is called whenever the App Check token changes.
 * @public
 */
export declare type AppCheckTokenListener = (token: AppCheckTokenResult) => void;

/**
 * Result returned by `getToken()`.
 * @public
 */
export declare interface AppCheckTokenResult {
    /**
     * The token string in JWT format.
     */
    readonly token: string;
}

/**
 * Custom provider class.
 * @public
 */
export declare class CustomProvider implements AppCheckProvider {
    private _customProviderOptions;
    private _app?;
    constructor(_customProviderOptions: CustomProviderOptions);
    /**
     * @internal
     */
    getToken(): Promise<AppCheckTokenInternal>;
    /**
     * @internal
     */
    initialize(app: FirebaseApp): void;
    /**
     * @internal
     */
    isEqual(otherProvider: unknown): boolean;
}

/**
 * Options when creating a {@link CustomProvider}.
 * @public
 */
export declare interface CustomProviderOptions {
    /**
     * Function to get an App Check token through a custom provider
     * service.
     */
    getToken: () => Promise<AppCheckToken>;
}

/**
 * Requests a Firebase App Check token. This method should be used
 * only if you need to authorize requests to a non-Firebase backend.
 *
 * Returns limited-use tokens that are intended for use with your
 * non-Firebase backend endpoints that are protected with
 * <a href="https://firebase.google.com/docs/app-check/custom-resource-backend#replay-protection">
 * Replay Protection</a>. This method
 * does not affect the token generation behavior of the
 * #getAppCheckToken() method.
 *
 * @param appCheckInstance - The App Check service instance.
 * @returns The limited use token.
 * @public
 */
export declare function getLimitedUseToken(appCheckInstance: AppCheck): Promise<AppCheckTokenResult>;

/**
 * Get the current App Check token. Attaches to the most recent
 * in-flight request if one is present. Returns null if no token
 * is present and no token requests are in-flight.
 *
 * @param appCheckInstance - The App Check service instance.
 * @param forceRefresh - If true, will always try to fetch a fresh token.
 * If false, will use a cached token if found in storage.
 * @public
 */
export declare function getToken(appCheckInstance: AppCheck, forceRefresh?: boolean): Promise<AppCheckTokenResult>;

/**
 * Activate App Check for the given app. Can be called only once per app.
 * @param app - the {@link @firebase/app#FirebaseApp} to activate App Check for
 * @param options - App Check initialization options
 * @public
 */
export declare function initializeAppCheck(app: FirebaseApp | undefined, options: AppCheckOptions): AppCheck;

/**
 * Registers a listener to changes in the token state. There can be more
 * than one listener registered at the same time for one or more
 * App Check instances. The listeners call back on the UI thread whenever
 * the current token associated with this App Check instance changes.
 *
 * @param appCheckInstance - The App Check service instance.
 * @param observer - An object with `next`, `error`, and `complete`
 * properties. `next` is called with an
 * {@link AppCheckTokenResult}
 * whenever the token changes. `error` is optional and is called if an
 * error is thrown by the listener (the `next` function). `complete`
 * is unused, as the token stream is unending.
 *
 * @returns A function that unsubscribes this listener.
 * @public
 */
export declare function onTokenChanged(appCheckInstance: AppCheck, observer: PartialObserver<AppCheckTokenResult>): Unsubscribe;

/**
 * Registers a listener to changes in the token state. There can be more
 * than one listener registered at the same time for one or more
 * App Check instances. The listeners call back on the UI thread whenever
 * the current token associated with this App Check instance changes.
 *
 * @param appCheckInstance - The App Check service instance.
 * @param onNext - When the token changes, this function is called with an
 * {@link AppCheckTokenResult}.
 * @param onError - Optional. Called if there is an error thrown by the
 * listener (the `onNext` function).
 * @param onCompletion - Currently unused, as the token stream is unending.
 * @returns A function that unsubscribes this listener.
 * @public
 */
export declare function onTokenChanged(appCheckInstance: AppCheck, onNext: (tokenResult: AppCheckTokenResult) => void, onError?: (error: Error) => void, onCompletion?: () => void): Unsubscribe;
export { PartialObserver }

/**
 * App Check provider that can obtain a reCAPTCHA Enterprise token and exchange it
 * for an App Check token.
 *
 * @public
 */
export declare class ReCaptchaEnterpriseProvider implements AppCheckProvider {
    private _siteKey;
    private _app?;
    private _heartbeatServiceProvider?;
    /**
     * Throttle requests on certain error codes to prevent too many retries
     * in a short time.
     */
    private _throttleData;
    /**
     * Create a ReCaptchaEnterpriseProvider instance.
     * @param siteKey - reCAPTCHA Enterprise score-based site key.
     */
    constructor(_siteKey: string);
    /**
     * Returns an App Check token.
     * @internal
     */
    getToken(): Promise<AppCheckTokenInternal>;
    /**
     * @internal
     */
    initialize(app: FirebaseApp): void;
    /**
     * @internal
     */
    isEqual(otherProvider: unknown): boolean;
}

/**
 * App Check provider that can obtain a reCAPTCHA V3 token and exchange it
 * for an App Check token.
 *
 * @public
 */
export declare class ReCaptchaV3Provider implements AppCheckProvider {
    private _siteKey;
    private _app?;
    private _heartbeatServiceProvider?;
    /**
     * Throttle requests on certain error codes to prevent too many retries
     * in a short time.
     */
    private _throttleData;
    /**
     * Create a ReCaptchaV3Provider instance.
     * @param siteKey - ReCAPTCHA V3 siteKey.
     */
    constructor(_siteKey: string);
    /**
     * Returns an App Check token.
     * @internal
     */
    getToken(): Promise<AppCheckTokenInternal>;
    /**
     * @internal
     */
    initialize(app: FirebaseApp): void;
    /**
     * @internal
     */
    isEqual(otherProvider: unknown): boolean;
}

/**
 * Set whether App Check will automatically refresh tokens as needed.
 *
 * @param appCheckInstance - The App Check service instance.
 * @param isTokenAutoRefreshEnabled - If true, the SDK automatically
 * refreshes App Check tokens as needed. This overrides any value set
 * during `initializeAppCheck()`.
 * @public
 */
export declare function setTokenAutoRefreshEnabled(appCheckInstance: AppCheck, isTokenAutoRefreshEnabled: boolean): void;
export { Unsubscribe }

export { }
