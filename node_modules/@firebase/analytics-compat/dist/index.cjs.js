'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var firebase = require('@firebase/app-compat');
var analytics = require('@firebase/analytics');
var component = require('@firebase/component');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

var name = "@firebase/analytics-compat";
var version = "0.2.6";

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
var AnalyticsService = /** @class */ (function () {
    function AnalyticsService(app, _delegate) {
        this.app = app;
        this._delegate = _delegate;
    }
    AnalyticsService.prototype.logEvent = function (eventName, eventParams, options) {
        analytics.logEvent(this._delegate, eventName, eventParams, options);
    };
    /**
     * @deprecated Use {@link logEvent} with `eventName` as 'screen_view' and add relevant `eventParams`.
     * See {@link https://firebase.google.com/docs/analytics/screenviews | Track Screenviews}.
     */
    AnalyticsService.prototype.setCurrentScreen = function (screenName, options) {
        analytics.setCurrentScreen(this._delegate, screenName, options);
    };
    AnalyticsService.prototype.setUserId = function (id, options) {
        analytics.setUserId(this._delegate, id, options);
    };
    AnalyticsService.prototype.setUserProperties = function (properties, options) {
        analytics.setUserProperties(this._delegate, properties, options);
    };
    AnalyticsService.prototype.setAnalyticsCollectionEnabled = function (enabled) {
        analytics.setAnalyticsCollectionEnabled(this._delegate, enabled);
    };
    return AnalyticsService;
}());

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
/**
 * Officially recommended event names for gtag.js
 * Any other string is also allowed.
 */
var EventName;
(function (EventName) {
    EventName["ADD_SHIPPING_INFO"] = "add_shipping_info";
    EventName["ADD_PAYMENT_INFO"] = "add_payment_info";
    EventName["ADD_TO_CART"] = "add_to_cart";
    EventName["ADD_TO_WISHLIST"] = "add_to_wishlist";
    EventName["BEGIN_CHECKOUT"] = "begin_checkout";
    /**
     * @deprecated
     * This event name is deprecated and is unsupported in updated
     * Enhanced Ecommerce reports.
     */
    EventName["CHECKOUT_PROGRESS"] = "checkout_progress";
    EventName["EXCEPTION"] = "exception";
    EventName["GENERATE_LEAD"] = "generate_lead";
    EventName["LOGIN"] = "login";
    EventName["PAGE_VIEW"] = "page_view";
    EventName["PURCHASE"] = "purchase";
    EventName["REFUND"] = "refund";
    EventName["REMOVE_FROM_CART"] = "remove_from_cart";
    EventName["SCREEN_VIEW"] = "screen_view";
    EventName["SEARCH"] = "search";
    EventName["SELECT_CONTENT"] = "select_content";
    EventName["SELECT_ITEM"] = "select_item";
    EventName["SELECT_PROMOTION"] = "select_promotion";
    /** @deprecated */
    EventName["SET_CHECKOUT_OPTION"] = "set_checkout_option";
    EventName["SHARE"] = "share";
    EventName["SIGN_UP"] = "sign_up";
    EventName["TIMING_COMPLETE"] = "timing_complete";
    EventName["VIEW_CART"] = "view_cart";
    EventName["VIEW_ITEM"] = "view_item";
    EventName["VIEW_ITEM_LIST"] = "view_item_list";
    EventName["VIEW_PROMOTION"] = "view_promotion";
    EventName["VIEW_SEARCH_RESULTS"] = "view_search_results";
})(EventName || (EventName = {}));

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
var factory = function (container) {
    // Dependencies
    var app = container.getProvider('app-compat').getImmediate();
    var analyticsServiceExp = container.getProvider('analytics').getImmediate();
    return new AnalyticsService(app, analyticsServiceExp);
};
function registerAnalytics() {
    var namespaceExports = {
        Analytics: AnalyticsService,
        settings: analytics.settings,
        isSupported: analytics.isSupported,
        // We removed this enum in exp so need to re-create it here for compat.
        EventName: EventName
    };
    firebase__default["default"].INTERNAL.registerComponent(new component.Component('analytics-compat', factory, "PUBLIC" /* ComponentType.PUBLIC */)
        .setServiceProps(namespaceExports)
        .setMultipleInstances(true));
}
registerAnalytics();
firebase__default["default"].registerVersion(name, version);

exports.registerAnalytics = registerAnalytics;
//# sourceMappingURL=index.cjs.js.map
