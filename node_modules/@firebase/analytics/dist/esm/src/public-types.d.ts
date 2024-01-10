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
import { FirebaseApp } from '@firebase/app';
/**
 * A set of common Google Analytics config settings recognized by
 * `gtag.js`.
 * @public
 */
export interface GtagConfigParams {
    /**
     * Whether or not a page view should be sent.
     * If set to true (default), a page view is automatically sent upon initialization
     * of analytics.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/page-view | Page views }
     */
    'send_page_view'?: boolean;
    /**
     * The title of the page.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/page-view | Page views }
     */
    'page_title'?: string;
    /**
     * The URL of the page.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/page-view | Page views }
     */
    'page_location'?: string;
    /**
     * Defaults to `auto`.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id | Cookies and user identification }
     */
    'cookie_domain'?: string;
    /**
     * Defaults to 63072000 (two years, in seconds).
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id | Cookies and user identification }
     */
    'cookie_expires'?: number;
    /**
     * Defaults to `_ga`.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id | Cookies and user identification }
     */
    'cookie_prefix'?: string;
    /**
     * If set to true, will update cookies on each page load.
     * Defaults to true.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id | Cookies and user identification }
     */
    'cookie_update'?: boolean;
    /**
     * Appends additional flags to the cookie when set.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id | Cookies and user identification }
     */
    'cookie_flags'?: string;
    /**
     * If set to false, disables all advertising features with `gtag.js`.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/display-features | Disable advertising features }
     */
    'allow_google_signals'?: boolean;
    /**
     * If set to false, disables all advertising personalization with `gtag.js`.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/display-features | Disable advertising features }
     */
    'allow_ad_personalization_signals'?: boolean;
    [key: string]: unknown;
}
/**
 * {@link Analytics} instance initialization options.
 * @public
 */
export interface AnalyticsSettings {
    /**
     * Params to be passed in the initial `gtag` config call during Firebase
     * Analytics initialization.
     */
    config?: GtagConfigParams | EventParams;
}
/**
 * Additional options that can be passed to Analytics method
 * calls such as `logEvent`, etc.
 * @public
 */
export interface AnalyticsCallOptions {
    /**
     * If true, this config or event call applies globally to all
     * Google Analytics properties on the page.
     */
    global: boolean;
}
/**
 * An instance of Firebase Analytics.
 * @public
 */
export interface Analytics {
    /**
     * The {@link @firebase/app#FirebaseApp} this {@link Analytics} instance is associated with.
     */
    app: FirebaseApp;
}
/**
 * Specifies custom options for your Firebase Analytics instance.
 * You must set these before initializing `firebase.analytics()`.
 * @public
 */
export interface SettingsOptions {
    /** Sets custom name for `gtag` function. */
    gtagName?: string;
    /** Sets custom name for `dataLayer` array used by `gtag.js`. */
    dataLayerName?: string;
}
/**
 * Any custom params the user may pass to `gtag`.
 * @public
 */
export interface CustomParams {
    [key: string]: unknown;
}
/**
 * Type for standard Google Analytics event names. `logEvent` also accepts any
 * custom string and interprets it as a custom event name.
 * @public
 */
export declare type EventNameString = 'add_payment_info' | 'add_shipping_info' | 'add_to_cart' | 'add_to_wishlist' | 'begin_checkout' | 'checkout_progress' | 'exception' | 'generate_lead' | 'login' | 'page_view' | 'purchase' | 'refund' | 'remove_from_cart' | 'screen_view' | 'search' | 'select_content' | 'select_item' | 'select_promotion' | 'set_checkout_option' | 'share' | 'sign_up' | 'timing_complete' | 'view_cart' | 'view_item' | 'view_item_list' | 'view_promotion' | 'view_search_results';
/**
 * Standard Google Analytics currency type.
 * @public
 */
export declare type Currency = string | number;
/**
 * Standard Google Analytics `Item` type.
 * @public
 */
export interface Item {
    item_id?: string;
    item_name?: string;
    item_brand?: string;
    item_category?: string;
    item_category2?: string;
    item_category3?: string;
    item_category4?: string;
    item_category5?: string;
    item_variant?: string;
    price?: Currency;
    quantity?: number;
    index?: number;
    coupon?: string;
    item_list_name?: string;
    item_list_id?: string;
    discount?: Currency;
    affiliation?: string;
    creative_name?: string;
    creative_slot?: string;
    promotion_id?: string;
    promotion_name?: string;
    location_id?: string;
    /** @deprecated Use item_brand instead. */
    brand?: string;
    /** @deprecated Use item_category instead. */
    category?: string;
    /** @deprecated Use item_id instead. */
    id?: string;
    /** @deprecated Use item_name instead. */
    name?: string;
}
/**
 * Field previously used by some Google Analytics events.
 * @deprecated Use `Item` instead.
 * @public
 */
export interface Promotion {
    creative_name?: string;
    creative_slot?: string;
    id?: string;
    name?: string;
}
/**
 * Standard `gtag.js` control parameters.
 * For more information, see
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 * @public
 */
export interface ControlParams {
    groups?: string | string[];
    send_to?: string | string[];
    event_callback?: () => void;
    event_timeout?: number;
}
/**
 * Standard `gtag.js` event parameters.
 * For more information, see
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 * @public
 */
export interface EventParams {
    checkout_option?: string;
    checkout_step?: number;
    item_id?: string;
    content_type?: string;
    coupon?: string;
    currency?: string;
    description?: string;
    fatal?: boolean;
    items?: Item[];
    method?: string;
    number?: string;
    promotions?: Promotion[];
    screen_name?: string;
    /**
     * Firebase-specific. Use to log a `screen_name` to Firebase Analytics.
     */
    firebase_screen?: string;
    /**
     * Firebase-specific. Use to log a `screen_class` to Firebase Analytics.
     */
    firebase_screen_class?: string;
    search_term?: string;
    shipping?: Currency;
    tax?: Currency;
    transaction_id?: string;
    value?: number;
    event_label?: string;
    event_category?: string;
    shipping_tier?: string;
    item_list_id?: string;
    item_list_name?: string;
    promotion_id?: string;
    promotion_name?: string;
    payment_type?: string;
    affiliation?: string;
    page_title?: string;
    page_location?: string;
    page_path?: string;
    [key: string]: unknown;
}
/**
 * Consent status settings for each consent type.
 * For more information, see
 * {@link https://developers.google.com/tag-platform/tag-manager/templates/consent-apis
 * | the GA4 reference documentation for consent state and consent types}.
 * @public
 */
export interface ConsentSettings {
    /** Enables storage, such as cookies, related to advertising */
    ad_storage?: ConsentStatusString;
    /** Enables storage, such as cookies, related to analytics (for example, visit duration) */
    analytics_storage?: ConsentStatusString;
    /**
     * Enables storage that supports the functionality of the website or app such as language settings
     */
    functionality_storage?: ConsentStatusString;
    /** Enables storage related to personalization such as video recommendations */
    personalization_storage?: ConsentStatusString;
    /**
     * Enables storage related to security such as authentication functionality, fraud prevention,
     * and other user protection.
     */
    security_storage?: ConsentStatusString;
    [key: string]: unknown;
}
/**
 * Whether a particular consent type has been granted or denied.
 * @public
 */
export declare type ConsentStatusString = 'granted' | 'denied';
