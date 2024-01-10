import firebase from '@firebase/app-compat';
import { Component } from '@firebase/component';
import { __awaiter, __generator } from 'tslib';
import { getToken, deleteToken, onMessage } from '@firebase/messaging';
import { isIndexedDBAvailable, areCookiesEnabled } from '@firebase/util';
import { onBackgroundMessage } from '@firebase/messaging/sw';

var name = "@firebase/messaging-compat";
var version = "0.2.5";

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
function isSupported() {
    if (self && 'ServiceWorkerGlobalScope' in self) {
        // Running in ServiceWorker context
        return isSwSupported();
    }
    else {
        // Assume we are in the window context.
        return isWindowSupported();
    }
}
/**
 * Checks to see if the required APIs exist.
 * Unlike the modular version, it does not check if IndexedDB.open() is allowed
 * in order to keep isSupported() synchronous and maintain v8 compatibility.
 */
function isWindowSupported() {
    return (typeof window !== 'undefined' &&
        isIndexedDBAvailable() &&
        areCookiesEnabled() &&
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window &&
        'fetch' in window &&
        ServiceWorkerRegistration.prototype.hasOwnProperty('showNotification') &&
        PushSubscription.prototype.hasOwnProperty('getKey'));
}
/**
 * Checks to see if the required APIs exist within SW Context.
 */
function isSwSupported() {
    return (isIndexedDBAvailable() &&
        'PushManager' in self &&
        'Notification' in self &&
        ServiceWorkerRegistration.prototype.hasOwnProperty('showNotification') &&
        PushSubscription.prototype.hasOwnProperty('getKey'));
}
var MessagingCompatImpl = /** @class */ (function () {
    function MessagingCompatImpl(app, _delegate) {
        this.app = app;
        this._delegate = _delegate;
        this.app = app;
        this._delegate = _delegate;
    }
    MessagingCompatImpl.prototype.getToken = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getToken(this._delegate, options)];
            });
        });
    };
    MessagingCompatImpl.prototype.deleteToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, deleteToken(this._delegate)];
            });
        });
    };
    MessagingCompatImpl.prototype.onMessage = function (nextOrObserver) {
        return onMessage(this._delegate, nextOrObserver);
    };
    MessagingCompatImpl.prototype.onBackgroundMessage = function (nextOrObserver) {
        return onBackgroundMessage(this._delegate, nextOrObserver);
    };
    return MessagingCompatImpl;
}());

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
var messagingCompatFactory = function (container) {
    if (self && 'ServiceWorkerGlobalScope' in self) {
        // in sw
        return new MessagingCompatImpl(container.getProvider('app-compat').getImmediate(), container.getProvider('messaging-sw').getImmediate());
    }
    else {
        // in window
        return new MessagingCompatImpl(container.getProvider('app-compat').getImmediate(), container.getProvider('messaging').getImmediate());
    }
};
var NAMESPACE_EXPORTS = {
    isSupported: isSupported
};
function registerMessagingCompat() {
    firebase.INTERNAL.registerComponent(new Component('messaging-compat', messagingCompatFactory, "PUBLIC" /* ComponentType.PUBLIC */).setServiceProps(NAMESPACE_EXPORTS));
}

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
registerMessagingCompat();
firebase.registerVersion(name, version);
//# sourceMappingURL=index.esm.js.map
