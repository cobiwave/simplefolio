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
import { FirebaseApp } from '@firebase/app';
import { Analytics, AnalyticsCallOptions, AnalyticsSettings, ConsentSettings, CustomParams, EventNameString, EventParams } from './public-types';
import { ANALYTICS_TYPE } from './constants';
import { AnalyticsService } from './factory';
export { settings } from './factory';
declare module '@firebase/component' {
    interface NameServiceMapping {
        [ANALYTICS_TYPE]: AnalyticsService;
    }
}
/**
 * Returns an {@link Analytics} instance for the given app.
 *
 * @public
 *
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 */
export declare function getAnalytics(app?: FirebaseApp): Analytics;
/**
 * Returns an {@link Analytics} instance for the given app.
 *
 * @public
 *
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 */
export declare function initializeAnalytics(app: FirebaseApp, options?: AnalyticsSettings): Analytics;
/**
 * This is a public static method provided to users that wraps four different checks:
 *
 * 1. Check if it's not a browser extension environment.
 * 2. Check if cookies are enabled in current browser.
 * 3. Check if IndexedDB is supported by the browser environment.
 * 4. Check if the current browser context is valid for using `IndexedDB.open()`.
 *
 * @public
 *
 */
export declare function isSupported(): Promise<boolean>;
/**
 * Use gtag `config` command to set `screen_name`.
 *
 * @public
 *
 * @deprecated Use {@link logEvent} with `eventName` as 'screen_view' and add relevant `eventParams`.
 * See {@link https://firebase.google.com/docs/analytics/screenviews | Track Screenviews}.
 *
 * @param analyticsInstance - The {@link Analytics} instance.
 * @param screenName - Screen name to set.
 */
export declare function setCurrentScreen(analyticsInstance: Analytics, screenName: string, options?: AnalyticsCallOptions): void;
/**
 * Retrieves a unique Google Analytics identifier for the web client.
 * See {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/config#client_id | client_id}.
 *
 * @public
 *
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 */
export declare function getGoogleAnalyticsClientId(analyticsInstance: Analytics): Promise<string>;
/**
 * Use gtag `config` command to set `user_id`.
 *
 * @public
 *
 * @param analyticsInstance - The {@link Analytics} instance.
 * @param id - User ID to set.
 */
export declare function setUserId(analyticsInstance: Analytics, id: string | null, options?: AnalyticsCallOptions): void;
/**
 * Use gtag `config` command to set all params specified.
 *
 * @public
 */
export declare function setUserProperties(analyticsInstance: Analytics, properties: CustomParams, options?: AnalyticsCallOptions): void;
/**
 * Sets whether Google Analytics collection is enabled for this app on this device.
 * Sets global `window['ga-disable-analyticsId'] = true;`
 *
 * @public
 *
 * @param analyticsInstance - The {@link Analytics} instance.
 * @param enabled - If true, enables collection, if false, disables it.
 */
export declare function setAnalyticsCollectionEnabled(analyticsInstance: Analytics, enabled: boolean): void;
/**
 * Adds data that will be set on every event logged from the SDK, including automatic ones.
 * With gtag's "set" command, the values passed persist on the current page and are passed with
 * all subsequent events.
 * @public
 * @param customParams - Any custom params the user may pass to gtag.js.
 */
export declare function setDefaultEventParameters(customParams: CustomParams): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'add_payment_info', eventParams?: {
    coupon?: EventParams['coupon'];
    currency?: EventParams['currency'];
    items?: EventParams['items'];
    payment_type?: EventParams['payment_type'];
    value?: EventParams['value'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'add_shipping_info', eventParams?: {
    coupon?: EventParams['coupon'];
    currency?: EventParams['currency'];
    items?: EventParams['items'];
    shipping_tier?: EventParams['shipping_tier'];
    value?: EventParams['value'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'add_to_cart' | 'add_to_wishlist' | 'remove_from_cart', eventParams?: {
    currency?: EventParams['currency'];
    value?: EventParams['value'];
    items?: EventParams['items'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'begin_checkout', eventParams?: {
    currency?: EventParams['currency'];
    coupon?: EventParams['coupon'];
    value?: EventParams['value'];
    items?: EventParams['items'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'checkout_progress', eventParams?: {
    currency?: EventParams['currency'];
    coupon?: EventParams['coupon'];
    value?: EventParams['value'];
    items?: EventParams['items'];
    checkout_step?: EventParams['checkout_step'];
    checkout_option?: EventParams['checkout_option'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * See
 * {@link https://developers.google.com/analytics/devguides/collection/ga4/exceptions
 * | Measure exceptions}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'exception', eventParams?: {
    description?: EventParams['description'];
    fatal?: EventParams['fatal'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'generate_lead', eventParams?: {
    value?: EventParams['value'];
    currency?: EventParams['currency'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'login', eventParams?: {
    method?: EventParams['method'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * See
 * {@link https://developers.google.com/analytics/devguides/collection/ga4/page-view
 * | Page views}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'page_view', eventParams?: {
    page_title?: string;
    page_location?: string;
    page_path?: string;
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'purchase' | 'refund', eventParams?: {
    value?: EventParams['value'];
    currency?: EventParams['currency'];
    transaction_id: EventParams['transaction_id'];
    tax?: EventParams['tax'];
    shipping?: EventParams['shipping'];
    items?: EventParams['items'];
    coupon?: EventParams['coupon'];
    affiliation?: EventParams['affiliation'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * See {@link https://firebase.google.com/docs/analytics/screenviews
 * | Track Screenviews}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'screen_view', eventParams?: {
    firebase_screen: EventParams['firebase_screen'];
    firebase_screen_class: EventParams['firebase_screen_class'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'search' | 'view_search_results', eventParams?: {
    search_term?: EventParams['search_term'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'select_content', eventParams?: {
    content_type?: EventParams['content_type'];
    item_id?: EventParams['item_id'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'select_item', eventParams?: {
    items?: EventParams['items'];
    item_list_name?: EventParams['item_list_name'];
    item_list_id?: EventParams['item_list_id'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'select_promotion' | 'view_promotion', eventParams?: {
    items?: EventParams['items'];
    promotion_id?: EventParams['promotion_id'];
    promotion_name?: EventParams['promotion_name'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'set_checkout_option', eventParams?: {
    checkout_step?: EventParams['checkout_step'];
    checkout_option?: EventParams['checkout_option'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'share', eventParams?: {
    method?: EventParams['method'];
    content_type?: EventParams['content_type'];
    item_id?: EventParams['item_id'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'sign_up', eventParams?: {
    method?: EventParams['method'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'timing_complete', eventParams?: {
    name: string;
    value: number;
    event_category?: string;
    event_label?: string;
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'view_cart' | 'view_item', eventParams?: {
    currency?: EventParams['currency'];
    items?: EventParams['items'];
    value?: EventParams['value'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent(analyticsInstance: Analytics, eventName: 'view_item_list', eventParams?: {
    items?: EventParams['items'];
    item_list_name?: EventParams['item_list_name'];
    item_list_id?: EventParams['item_list_id'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
export declare function logEvent<T extends string>(analyticsInstance: Analytics, eventName: CustomEventName<T>, eventParams?: {
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Any custom event name string not in the standard list of recommended
 * event names.
 * @public
 */
export declare type CustomEventName<T> = T extends EventNameString ? never : T;
/**
 * Sets the applicable end user consent state for this web app across all gtag references once
 * Firebase Analytics is initialized.
 *
 * Use the {@link ConsentSettings} to specify individual consent type values. By default consent
 * types are set to "granted".
 * @public
 * @param consentSettings - Maps the applicable end user consent state for gtag.js.
 */
export declare function setConsent(consentSettings: ConsentSettings): void;
