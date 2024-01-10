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
import { AppCheck, AppCheckOptions, AppCheckTokenResult, Unsubscribe, PartialObserver } from './public-types';
import { FirebaseApp } from '@firebase/app';
import { AppCheckService } from './factory';
declare module '@firebase/component' {
    interface NameServiceMapping {
        'app-check': AppCheckService;
    }
}
export { ReCaptchaV3Provider, CustomProvider, ReCaptchaEnterpriseProvider } from './providers';
/**
 * Activate App Check for the given app. Can be called only once per app.
 * @param app - the {@link @firebase/app#FirebaseApp} to activate App Check for
 * @param options - App Check initialization options
 * @public
 */
export declare function initializeAppCheck(app: FirebaseApp | undefined, options: AppCheckOptions): AppCheck;
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
