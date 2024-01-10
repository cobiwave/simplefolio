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
import { SettingsOptions, Analytics, AnalyticsSettings } from './public-types';
import { Gtag, DynamicConfig, MinimalDynamicConfig } from './types';
import { _FirebaseInstallationsInternal } from '@firebase/installations';
import { FirebaseApp, _FirebaseService } from '@firebase/app';
/**
 * Analytics Service class.
 */
export declare class AnalyticsService implements Analytics, _FirebaseService {
    app: FirebaseApp;
    constructor(app: FirebaseApp);
    _delete(): Promise<void>;
}
/**
 * Maps appId to full initialization promise. Wrapped gtag calls must wait on
 * all or some of these, depending on the call's `send_to` param and the status
 * of the dynamic config fetches (see below).
 */
export declare let initializationPromisesMap: {
    [appId: string]: Promise<string>;
};
/**
 * Wrapper around gtag function that ensures FID is sent with all
 * relevant event and config calls.
 */
export declare let wrappedGtagFunction: Gtag;
/**
 * For testing
 * @internal
 */
export declare function resetGlobalVars(newGlobalInitDone?: boolean, newInitializationPromisesMap?: {}, newDynamicPromises?: never[]): void;
/**
 * For testing
 * @internal
 */
export declare function getGlobalVars(): {
    initializationPromisesMap: {
        [appId: string]: Promise<string>;
    };
    dynamicConfigPromisesList: Array<Promise<DynamicConfig | MinimalDynamicConfig>>;
};
/**
 * Configures Firebase Analytics to use custom `gtag` or `dataLayer` names.
 * Intended to be used if `gtag.js` script has been installed on
 * this page independently of Firebase Analytics, and is using non-default
 * names for either the `gtag` function or for `dataLayer`.
 * Must be called before calling `getAnalytics()` or it won't
 * have any effect.
 *
 * @public
 *
 * @param options - Custom gtag and dataLayer names.
 */
export declare function settings(options: SettingsOptions): void;
/**
 * Analytics instance factory.
 * @internal
 */
export declare function factory(app: FirebaseApp, installations: _FirebaseInstallationsInternal, options?: AnalyticsSettings): AnalyticsService;
