/**
 * @license
 * Copyright 2021 Google LLC
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
import { FirebaseApp } from '@firebase/app';
import { CustomProviderOptions } from './public-types';
import { AppCheckProvider, AppCheckTokenInternal } from './types';
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
