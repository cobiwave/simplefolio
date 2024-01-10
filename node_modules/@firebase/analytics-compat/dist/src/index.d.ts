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
import { FirebaseAnalytics } from '@firebase/analytics-types';
export declare function registerAnalytics(): void;
/**
 * Define extension behavior of `registerAnalytics`
 */
declare module '@firebase/app-compat' {
    interface FirebaseNamespace {
        analytics(app?: FirebaseApp): FirebaseAnalytics;
    }
    interface FirebaseApp {
        analytics(): FirebaseAnalytics;
    }
}

import { FirebaseApp as FirebaseAppCompat } from "@firebase/app-compat";
import { type Analytics, type AnalyticsSettings, type EventParams, type AnalyticsCallOptions, type CustomEventName, type CustomParams } from "@firebase/analytics";
declare module "@firebase/analytics" {
    function getAnalytics(app?: FirebaseAppCompat): Analytics;
    function getGoogleAnalyticsClientId(analyticsInstance: FirebaseAnalytics): Promise<string>;
    function initializeAnalytics(app: FirebaseAppCompat, options?: AnalyticsSettings): Analytics;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'add_payment_info', eventParams?: {
        coupon?: EventParams['coupon'];
        currency?: EventParams['currency'];
        items?: EventParams['items'];
        payment_type?: EventParams['payment_type'];
        value?: EventParams['value'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'add_shipping_info', eventParams?: {
        coupon?: EventParams['coupon'];
        currency?: EventParams['currency'];
        items?: EventParams['items'];
        shipping_tier?: EventParams['shipping_tier'];
        value?: EventParams['value'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'add_to_cart' | 'add_to_wishlist' | 'remove_from_cart', eventParams?: {
        currency?: EventParams['currency'];
        value?: EventParams['value'];
        items?: EventParams['items'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'begin_checkout', eventParams?: {
        currency?: EventParams['currency'];
        coupon?: EventParams['coupon'];
        value?: EventParams['value'];
        items?: EventParams['items'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'checkout_progress', eventParams?: {
        currency?: EventParams['currency'];
        coupon?: EventParams['coupon'];
        value?: EventParams['value'];
        items?: EventParams['items'];
        checkout_step?: EventParams['checkout_step'];
        checkout_option?: EventParams['checkout_option'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'exception', eventParams?: {
        description?: EventParams['description'];
        fatal?: EventParams['fatal'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'generate_lead', eventParams?: {
        value?: EventParams['value'];
        currency?: EventParams['currency'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'login', eventParams?: {
        method?: EventParams['method'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'page_view', eventParams?: {
        page_title?: string;
        page_location?: string;
        page_path?: string;
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'purchase' | 'refund', eventParams?: {
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
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'screen_view', eventParams?: {
        firebase_screen: EventParams['firebase_screen'];
        firebase_screen_class: EventParams['firebase_screen_class'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'search' | 'view_search_results', eventParams?: {
        search_term?: EventParams['search_term'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'select_content', eventParams?: {
        content_type?: EventParams['content_type'];
        item_id?: EventParams['item_id'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'select_item', eventParams?: {
        items?: EventParams['items'];
        item_list_name?: EventParams['item_list_name'];
        item_list_id?: EventParams['item_list_id'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'select_promotion' | 'view_promotion', eventParams?: {
        items?: EventParams['items'];
        promotion_id?: EventParams['promotion_id'];
        promotion_name?: EventParams['promotion_name'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'set_checkout_option', eventParams?: {
        checkout_step?: EventParams['checkout_step'];
        checkout_option?: EventParams['checkout_option'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'share', eventParams?: {
        method?: EventParams['method'];
        content_type?: EventParams['content_type'];
        item_id?: EventParams['item_id'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'sign_up', eventParams?: {
        method?: EventParams['method'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'timing_complete', eventParams?: {
        name: string;
        value: number;
        event_category?: string;
        event_label?: string;
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'view_cart' | 'view_item', eventParams?: {
        currency?: EventParams['currency'];
        items?: EventParams['items'];
        value?: EventParams['value'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent(analyticsInstance: FirebaseAnalytics, eventName: 'view_item_list', eventParams?: {
        items?: EventParams['items'];
        item_list_name?: EventParams['item_list_name'];
        item_list_id?: EventParams['item_list_id'];
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function logEvent<T extends string>(analyticsInstance: FirebaseAnalytics, eventName: CustomEventName<T>, eventParams?: {
        [key: string]: any;
    }, options?: AnalyticsCallOptions): void;
    function setAnalyticsCollectionEnabled(analyticsInstance: FirebaseAnalytics, enabled: boolean): void;
    function setCurrentScreen(analyticsInstance: FirebaseAnalytics, screenName: string, options?: AnalyticsCallOptions): void;
    function setUserId(analyticsInstance: FirebaseAnalytics, id: string | null, options?: AnalyticsCallOptions): void;
    function setUserProperties(analyticsInstance: FirebaseAnalytics, properties: CustomParams, options?: AnalyticsCallOptions): void;
}
