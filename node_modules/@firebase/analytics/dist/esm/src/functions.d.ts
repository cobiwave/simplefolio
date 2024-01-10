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
import { AnalyticsCallOptions, CustomParams, EventParams, ConsentSettings } from './public-types';
import { Gtag } from './types';
/**
 * Event parameters to set on 'gtag' during initialization.
 */
export declare let defaultEventParametersForInit: CustomParams | undefined;
/**
 * Logs an analytics event through the Firebase SDK.
 *
 * @param gtagFunction Wrapped gtag function that waits for fid to be set before sending an event
 * @param eventName Google Analytics event name, choose from standard list or use a custom string.
 * @param eventParams Analytics event parameters.
 */
export declare function logEvent(gtagFunction: Gtag, initializationPromise: Promise<string>, eventName: string, eventParams?: EventParams, options?: AnalyticsCallOptions): Promise<void>;
/**
 * Set screen_name parameter for this Google Analytics ID.
 *
 * @deprecated Use {@link logEvent} with `eventName` as 'screen_view' and add relevant `eventParams`.
 * See {@link https://firebase.google.com/docs/analytics/screenviews | Track Screenviews}.
 *
 * @param gtagFunction Wrapped gtag function that waits for fid to be set before sending an event
 * @param screenName Screen name string to set.
 */
export declare function setCurrentScreen(gtagFunction: Gtag, initializationPromise: Promise<string>, screenName: string | null, options?: AnalyticsCallOptions): Promise<void>;
/**
 * Set user_id parameter for this Google Analytics ID.
 *
 * @param gtagFunction Wrapped gtag function that waits for fid to be set before sending an event
 * @param id User ID string to set
 */
export declare function setUserId(gtagFunction: Gtag, initializationPromise: Promise<string>, id: string | null, options?: AnalyticsCallOptions): Promise<void>;
/**
 * Set all other user properties other than user_id and screen_name.
 *
 * @param gtagFunction Wrapped gtag function that waits for fid to be set before sending an event
 * @param properties Map of user properties to set
 */
export declare function setUserProperties(gtagFunction: Gtag, initializationPromise: Promise<string>, properties: CustomParams, options?: AnalyticsCallOptions): Promise<void>;
/**
 * Retrieves a unique Google Analytics identifier for the web client.
 * See {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/config#client_id | client_id}.
 *
 * @param gtagFunction Wrapped gtag function that waits for fid to be set before sending an event
 */
export declare function internalGetGoogleAnalyticsClientId(gtagFunction: Gtag, initializationPromise: Promise<string>): Promise<string>;
/**
 * Set whether collection is enabled for this ID.
 *
 * @param enabled If true, collection is enabled for this ID.
 */
export declare function setAnalyticsCollectionEnabled(initializationPromise: Promise<string>, enabled: boolean): Promise<void>;
/**
 * Consent parameters to default to during 'gtag' initialization.
 */
export declare let defaultConsentSettingsForInit: ConsentSettings | undefined;
/**
 * Sets the variable {@link defaultConsentSettingsForInit} for use in the initialization of
 * analytics.
 *
 * @param consentSettings Maps the applicable end user consent state for gtag.js.
 */
export declare function _setConsentDefaultForInit(consentSettings?: ConsentSettings): void;
/**
 * Sets the variable `defaultEventParametersForInit` for use in the initialization of
 * analytics.
 *
 * @param customParams Any custom params the user may pass to gtag.js.
 */
export declare function _setDefaultEventParametersForInit(customParams?: CustomParams): void;
