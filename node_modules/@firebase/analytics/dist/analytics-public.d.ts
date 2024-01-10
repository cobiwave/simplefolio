/**
 * Firebase Analytics
 *
 * @packageDocumentation
 */

import { FirebaseApp } from '@firebase/app';

/**
 * An instance of Firebase Analytics.
 * @public
 */
export declare interface Analytics {
    /**
     * The {@link @firebase/app#FirebaseApp} this {@link Analytics} instance is associated with.
     */
    app: FirebaseApp;
}

/**
 * Additional options that can be passed to Analytics method
 * calls such as `logEvent`, etc.
 * @public
 */
export declare interface AnalyticsCallOptions {
    /**
     * If true, this config or event call applies globally to all
     * Google Analytics properties on the page.
     */
    global: boolean;
}

/**
 * {@link Analytics} instance initialization options.
 * @public
 */
export declare interface AnalyticsSettings {
    /**
     * Params to be passed in the initial `gtag` config call during Firebase
     * Analytics initialization.
     */
    config?: GtagConfigParams | EventParams;
}

/**
 * Consent status settings for each consent type.
 * For more information, see
 * {@link https://developers.google.com/tag-platform/tag-manager/templates/consent-apis
 * | the GA4 reference documentation for consent state and consent types}.
 * @public
 */
export declare interface ConsentSettings {
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

/**
 * Standard `gtag.js` control parameters.
 * For more information, see
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 * @public
 */
export declare interface ControlParams {
    groups?: string | string[];
    send_to?: string | string[];
    event_callback?: () => void;
    event_timeout?: number;
}

/**
 * Standard Google Analytics currency type.
 * @public
 */
export declare type Currency = string | number;

/**
 * Any custom event name string not in the standard list of recommended
 * event names.
 * @public
 */
export declare type CustomEventName<T> = T extends EventNameString ? never : T;

/**
 * Any custom params the user may pass to `gtag`.
 * @public
 */
export declare interface CustomParams {
    [key: string]: unknown;
}

/**
 * Type for standard Google Analytics event names. `logEvent` also accepts any
 * custom string and interprets it as a custom event name.
 * @public
 */
export declare type EventNameString = 'add_payment_info' | 'add_shipping_info' | 'add_to_cart' | 'add_to_wishlist' | 'begin_checkout' | 'checkout_progress' | 'exception' | 'generate_lead' | 'login' | 'page_view' | 'purchase' | 'refund' | 'remove_from_cart' | 'screen_view' | 'search' | 'select_content' | 'select_item' | 'select_promotion' | 'set_checkout_option' | 'share' | 'sign_up' | 'timing_complete' | 'view_cart' | 'view_item' | 'view_item_list' | 'view_promotion' | 'view_search_results';

/**
 * Standard `gtag.js` event parameters.
 * For more information, see
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 * @public
 */
export declare interface EventParams {
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
 * Returns an {@link Analytics} instance for the given app.
 *
 * @public
 *
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 */
export declare function getAnalytics(app?: FirebaseApp): Analytics;

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
 * A set of common Google Analytics config settings recognized by
 * `gtag.js`.
 * @public
 */
export declare interface GtagConfigParams {
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
 * Standard Google Analytics `Item` type.
 * @public
 */
export declare interface Item {
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
 * Field previously used by some Google Analytics events.
 * @deprecated Use `Item` instead.
 * @public
 */
export declare interface Promotion {
    creative_name?: string;
    creative_slot?: string;
    id?: string;
    name?: string;
}

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
 * Sets the applicable end user consent state for this web app across all gtag references once
 * Firebase Analytics is initialized.
 *
 * Use the {@link ConsentSettings} to specify individual consent type values. By default consent
 * types are set to "granted".
 * @public
 * @param consentSettings - Maps the applicable end user consent state for gtag.js.
 */
export declare function setConsent(consentSettings: ConsentSettings): void;

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
 * Adds data that will be set on every event logged from the SDK, including automatic ones.
 * With gtag's "set" command, the values passed persist on the current page and are passed with
 * all subsequent events.
 * @public
 * @param customParams - Any custom params the user may pass to gtag.js.
 */
export declare function setDefaultEventParameters(customParams: CustomParams): void;

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
 * Specifies custom options for your Firebase Analytics instance.
 * You must set these before initializing `firebase.analytics()`.
 * @public
 */
export declare interface SettingsOptions {
    /** Sets custom name for `gtag` function. */
    gtagName?: string;
    /** Sets custom name for `dataLayer` array used by `gtag.js`. */
    dataLayerName?: string;
}

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

export { }
