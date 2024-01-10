'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('./index-96ab5fb1.js');
var tslib = require('tslib');
var util = require('@firebase/util');
var app = require('@firebase/app');
require('@firebase/component');
require('@firebase/logger');

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
// There are two different browser persistence types: local and session.
// Both have the same implementation but use a different underlying storage
// object.
var BrowserPersistenceClass = /** @class */ (function () {
    function BrowserPersistenceClass(storageRetriever, type) {
        this.storageRetriever = storageRetriever;
        this.type = type;
    }
    BrowserPersistenceClass.prototype._isAvailable = function () {
        try {
            if (!this.storage) {
                return Promise.resolve(false);
            }
            this.storage.setItem(index.STORAGE_AVAILABLE_KEY, '1');
            this.storage.removeItem(index.STORAGE_AVAILABLE_KEY);
            return Promise.resolve(true);
        }
        catch (_a) {
            return Promise.resolve(false);
        }
    };
    BrowserPersistenceClass.prototype._set = function (key, value) {
        this.storage.setItem(key, JSON.stringify(value));
        return Promise.resolve();
    };
    BrowserPersistenceClass.prototype._get = function (key) {
        var json = this.storage.getItem(key);
        return Promise.resolve(json ? JSON.parse(json) : null);
    };
    BrowserPersistenceClass.prototype._remove = function (key) {
        this.storage.removeItem(key);
        return Promise.resolve();
    };
    Object.defineProperty(BrowserPersistenceClass.prototype, "storage", {
        get: function () {
            return this.storageRetriever();
        },
        enumerable: false,
        configurable: true
    });
    return BrowserPersistenceClass;
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
function _iframeCannotSyncWebStorage() {
    var ua = util.getUA();
    return index._isSafari(ua) || index._isIOS(ua);
}
// The polling period in case events are not supported
var _POLLING_INTERVAL_MS$1 = 1000;
// The IE 10 localStorage cross tab synchronization delay in milliseconds
var IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
var BrowserLocalPersistence = /** @class */ (function (_super) {
    tslib.__extends(BrowserLocalPersistence, _super);
    function BrowserLocalPersistence() {
        var _this = _super.call(this, function () { return window.localStorage; }, "LOCAL" /* PersistenceType.LOCAL */) || this;
        _this.boundEventHandler = function (event, poll) { return _this.onStorageEvent(event, poll); };
        _this.listeners = {};
        _this.localCache = {};
        // setTimeout return value is platform specific
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _this.pollTimer = null;
        // Safari or iOS browser and embedded in an iframe.
        _this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && index._isIframe();
        // Whether to use polling instead of depending on window events
        _this.fallbackToPolling = index._isMobileBrowser();
        _this._shouldAllowMigration = true;
        return _this;
    }
    BrowserLocalPersistence.prototype.forAllChangedKeys = function (cb) {
        // Check all keys with listeners on them.
        for (var _i = 0, _a = Object.keys(this.listeners); _i < _a.length; _i++) {
            var key = _a[_i];
            // Get value from localStorage.
            var newValue = this.storage.getItem(key);
            var oldValue = this.localCache[key];
            // If local map value does not match, trigger listener with storage event.
            // Differentiate this simulated event from the real storage event.
            if (newValue !== oldValue) {
                cb(key, oldValue, newValue);
            }
        }
    };
    BrowserLocalPersistence.prototype.onStorageEvent = function (event, poll) {
        var _this = this;
        if (poll === void 0) { poll = false; }
        // Key would be null in some situations, like when localStorage is cleared
        if (!event.key) {
            this.forAllChangedKeys(function (key, _oldValue, newValue) {
                _this.notifyListeners(key, newValue);
            });
            return;
        }
        var key = event.key;
        // Check the mechanism how this event was detected.
        // The first event will dictate the mechanism to be used.
        if (poll) {
            // Environment detects storage changes via polling.
            // Remove storage event listener to prevent possible event duplication.
            this.detachListener();
        }
        else {
            // Environment detects storage changes via storage event listener.
            // Remove polling listener to prevent possible event duplication.
            this.stopPolling();
        }
        // Safari embedded iframe. Storage event will trigger with the delta
        // changes but no changes will be applied to the iframe localStorage.
        if (this.safariLocalStorageNotSynced) {
            // Get current iframe page value.
            var storedValue_1 = this.storage.getItem(key);
            // Value not synchronized, synchronize manually.
            if (event.newValue !== storedValue_1) {
                if (event.newValue !== null) {
                    // Value changed from current value.
                    this.storage.setItem(key, event.newValue);
                }
                else {
                    // Current value deleted.
                    this.storage.removeItem(key);
                }
            }
            else if (this.localCache[key] === event.newValue && !poll) {
                // Already detected and processed, do not trigger listeners again.
                return;
            }
        }
        var triggerListeners = function () {
            // Keep local map up to date in case storage event is triggered before
            // poll.
            var storedValue = _this.storage.getItem(key);
            if (!poll && _this.localCache[key] === storedValue) {
                // Real storage event which has already been detected, do nothing.
                // This seems to trigger in some IE browsers for some reason.
                return;
            }
            _this.notifyListeners(key, storedValue);
        };
        var storedValue = this.storage.getItem(key);
        if (index._isIE10() &&
            storedValue !== event.newValue &&
            event.newValue !== event.oldValue) {
            // IE 10 has this weird bug where a storage event would trigger with the
            // correct key, oldValue and newValue but localStorage.getItem(key) does
            // not yield the updated value until a few milliseconds. This ensures
            // this recovers from that situation.
            setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
        }
        else {
            triggerListeners();
        }
    };
    BrowserLocalPersistence.prototype.notifyListeners = function (key, value) {
        this.localCache[key] = value;
        var listeners = this.listeners[key];
        if (listeners) {
            for (var _i = 0, _a = Array.from(listeners); _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(value ? JSON.parse(value) : value);
            }
        }
    };
    BrowserLocalPersistence.prototype.startPolling = function () {
        var _this = this;
        this.stopPolling();
        this.pollTimer = setInterval(function () {
            _this.forAllChangedKeys(function (key, oldValue, newValue) {
                _this.onStorageEvent(new StorageEvent('storage', {
                    key: key,
                    oldValue: oldValue,
                    newValue: newValue
                }), 
                /* poll */ true);
            });
        }, _POLLING_INTERVAL_MS$1);
    };
    BrowserLocalPersistence.prototype.stopPolling = function () {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    };
    BrowserLocalPersistence.prototype.attachListener = function () {
        window.addEventListener('storage', this.boundEventHandler);
    };
    BrowserLocalPersistence.prototype.detachListener = function () {
        window.removeEventListener('storage', this.boundEventHandler);
    };
    BrowserLocalPersistence.prototype._addListener = function (key, listener) {
        if (Object.keys(this.listeners).length === 0) {
            // Whether browser can detect storage event when it had already been pushed to the background.
            // This may happen in some mobile browsers. A localStorage change in the foreground window
            // will not be detected in the background window via the storage event.
            // This was detected in iOS 7.x mobile browsers
            if (this.fallbackToPolling) {
                this.startPolling();
            }
            else {
                this.attachListener();
            }
        }
        if (!this.listeners[key]) {
            this.listeners[key] = new Set();
            // Populate the cache to avoid spuriously triggering on first poll.
            this.localCache[key] = this.storage.getItem(key);
        }
        this.listeners[key].add(listener);
    };
    BrowserLocalPersistence.prototype._removeListener = function (key, listener) {
        if (this.listeners[key]) {
            this.listeners[key].delete(listener);
            if (this.listeners[key].size === 0) {
                delete this.listeners[key];
            }
        }
        if (Object.keys(this.listeners).length === 0) {
            this.detachListener();
            this.stopPolling();
        }
    };
    // Update local cache on base operations:
    BrowserLocalPersistence.prototype._set = function (key, value) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype._set.call(this, key, value)];
                    case 1:
                        _a.sent();
                        this.localCache[key] = JSON.stringify(value);
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserLocalPersistence.prototype._get = function (key) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var value;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype._get.call(this, key)];
                    case 1:
                        value = _a.sent();
                        this.localCache[key] = JSON.stringify(value);
                        return [2 /*return*/, value];
                }
            });
        });
    };
    BrowserLocalPersistence.prototype._remove = function (key) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype._remove.call(this, key)];
                    case 1:
                        _a.sent();
                        delete this.localCache[key];
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserLocalPersistence.type = 'LOCAL';
    return BrowserLocalPersistence;
}(BrowserPersistenceClass));
/**
 * An implementation of {@link Persistence} of type `LOCAL` using `localStorage`
 * for the underlying storage.
 *
 * @public
 */
var browserLocalPersistence = BrowserLocalPersistence;

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
var BrowserSessionPersistence = /** @class */ (function (_super) {
    tslib.__extends(BrowserSessionPersistence, _super);
    function BrowserSessionPersistence() {
        return _super.call(this, function () { return window.sessionStorage; }, "SESSION" /* PersistenceType.SESSION */) || this;
    }
    BrowserSessionPersistence.prototype._addListener = function (_key, _listener) {
        // Listeners are not supported for session storage since it cannot be shared across windows
        return;
    };
    BrowserSessionPersistence.prototype._removeListener = function (_key, _listener) {
        // Listeners are not supported for session storage since it cannot be shared across windows
        return;
    };
    BrowserSessionPersistence.type = 'SESSION';
    return BrowserSessionPersistence;
}(BrowserPersistenceClass));
/**
 * An implementation of {@link Persistence} of `SESSION` using `sessionStorage`
 * for the underlying storage.
 *
 * @public
 */
var browserSessionPersistence = BrowserSessionPersistence;

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
/**
 * Shim for Promise.allSettled, note the slightly different format of `fulfilled` vs `status`.
 *
 * @param promises - Array of promises to wait on.
 */
function _allSettled(promises) {
    var _this = this;
    return Promise.all(promises.map(function (promise) { return tslib.__awaiter(_this, void 0, void 0, function () {
        var value, reason_1;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promise];
                case 1:
                    value = _a.sent();
                    return [2 /*return*/, {
                            fulfilled: true,
                            value: value
                        }];
                case 2:
                    reason_1 = _a.sent();
                    return [2 /*return*/, {
                            fulfilled: false,
                            reason: reason_1
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); }));
}

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
/**
 * Interface class for receiving messages.
 *
 */
var Receiver = /** @class */ (function () {
    function Receiver(eventTarget) {
        this.eventTarget = eventTarget;
        this.handlersMap = {};
        this.boundEventHandler = this.handleEvent.bind(this);
    }
    /**
     * Obtain an instance of a Receiver for a given event target, if none exists it will be created.
     *
     * @param eventTarget - An event target (such as window or self) through which the underlying
     * messages will be received.
     */
    Receiver._getInstance = function (eventTarget) {
        // The results are stored in an array since objects can't be keys for other
        // objects. In addition, setting a unique property on an event target as a
        // hash map key may not be allowed due to CORS restrictions.
        var existingInstance = this.receivers.find(function (receiver) {
            return receiver.isListeningto(eventTarget);
        });
        if (existingInstance) {
            return existingInstance;
        }
        var newInstance = new Receiver(eventTarget);
        this.receivers.push(newInstance);
        return newInstance;
    };
    Receiver.prototype.isListeningto = function (eventTarget) {
        return this.eventTarget === eventTarget;
    };
    /**
     * Fans out a MessageEvent to the appropriate listeners.
     *
     * @remarks
     * Sends an {@link Status.ACK} upon receipt and a {@link Status.DONE} once all handlers have
     * finished processing.
     *
     * @param event - The MessageEvent.
     *
     */
    Receiver.prototype.handleEvent = function (event) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var messageEvent, _a, eventId, eventType, data, handlers, promises, response;
            var _this = this;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        messageEvent = event;
                        _a = messageEvent.data, eventId = _a.eventId, eventType = _a.eventType, data = _a.data;
                        handlers = this.handlersMap[eventType];
                        if (!(handlers === null || handlers === void 0 ? void 0 : handlers.size)) {
                            return [2 /*return*/];
                        }
                        messageEvent.ports[0].postMessage({
                            status: "ack" /* _Status.ACK */,
                            eventId: eventId,
                            eventType: eventType
                        });
                        promises = Array.from(handlers).map(function (handler) { return tslib.__awaiter(_this, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
                            return [2 /*return*/, handler(messageEvent.origin, data)];
                        }); }); });
                        return [4 /*yield*/, _allSettled(promises)];
                    case 1:
                        response = _b.sent();
                        messageEvent.ports[0].postMessage({
                            status: "done" /* _Status.DONE */,
                            eventId: eventId,
                            eventType: eventType,
                            response: response
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Subscribe an event handler for a particular event.
     *
     * @param eventType - Event name to subscribe to.
     * @param eventHandler - The event handler which should receive the events.
     *
     */
    Receiver.prototype._subscribe = function (eventType, eventHandler) {
        if (Object.keys(this.handlersMap).length === 0) {
            this.eventTarget.addEventListener('message', this.boundEventHandler);
        }
        if (!this.handlersMap[eventType]) {
            this.handlersMap[eventType] = new Set();
        }
        this.handlersMap[eventType].add(eventHandler);
    };
    /**
     * Unsubscribe an event handler from a particular event.
     *
     * @param eventType - Event name to unsubscribe from.
     * @param eventHandler - Optinoal event handler, if none provided, unsubscribe all handlers on this event.
     *
     */
    Receiver.prototype._unsubscribe = function (eventType, eventHandler) {
        if (this.handlersMap[eventType] && eventHandler) {
            this.handlersMap[eventType].delete(eventHandler);
        }
        if (!eventHandler || this.handlersMap[eventType].size === 0) {
            delete this.handlersMap[eventType];
        }
        if (Object.keys(this.handlersMap).length === 0) {
            this.eventTarget.removeEventListener('message', this.boundEventHandler);
        }
    };
    Receiver.receivers = [];
    return Receiver;
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
function _generateEventId(prefix, digits) {
    if (prefix === void 0) { prefix = ''; }
    if (digits === void 0) { digits = 10; }
    var random = '';
    for (var i = 0; i < digits; i++) {
        random += Math.floor(Math.random() * 10);
    }
    return prefix + random;
}

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
/**
 * Interface for sending messages and waiting for a completion response.
 *
 */
var Sender = /** @class */ (function () {
    function Sender(target) {
        this.target = target;
        this.handlers = new Set();
    }
    /**
     * Unsubscribe the handler and remove it from our tracking Set.
     *
     * @param handler - The handler to unsubscribe.
     */
    Sender.prototype.removeMessageHandler = function (handler) {
        if (handler.messageChannel) {
            handler.messageChannel.port1.removeEventListener('message', handler.onMessage);
            handler.messageChannel.port1.close();
        }
        this.handlers.delete(handler);
    };
    /**
     * Send a message to the Receiver located at {@link target}.
     *
     * @remarks
     * We'll first wait a bit for an ACK , if we get one we will wait significantly longer until the
     * receiver has had a chance to fully process the event.
     *
     * @param eventType - Type of event to send.
     * @param data - The payload of the event.
     * @param timeout - Timeout for waiting on an ACK from the receiver.
     *
     * @returns An array of settled promises from all the handlers that were listening on the receiver.
     */
    Sender.prototype._send = function (eventType, data, timeout) {
        if (timeout === void 0) { timeout = 50 /* _TimeoutDuration.ACK */; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            var messageChannel, completionTimer, handler;
            var _this = this;
            return tslib.__generator(this, function (_a) {
                messageChannel = typeof MessageChannel !== 'undefined' ? new MessageChannel() : null;
                if (!messageChannel) {
                    throw new Error("connection_unavailable" /* _MessageError.CONNECTION_UNAVAILABLE */);
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var eventId = _generateEventId('', 20);
                        messageChannel.port1.start();
                        var ackTimer = setTimeout(function () {
                            reject(new Error("unsupported_event" /* _MessageError.UNSUPPORTED_EVENT */));
                        }, timeout);
                        handler = {
                            messageChannel: messageChannel,
                            onMessage: function (event) {
                                var messageEvent = event;
                                if (messageEvent.data.eventId !== eventId) {
                                    return;
                                }
                                switch (messageEvent.data.status) {
                                    case "ack" /* _Status.ACK */:
                                        // The receiver should ACK first.
                                        clearTimeout(ackTimer);
                                        completionTimer = setTimeout(function () {
                                            reject(new Error("timeout" /* _MessageError.TIMEOUT */));
                                        }, 3000 /* _TimeoutDuration.COMPLETION */);
                                        break;
                                    case "done" /* _Status.DONE */:
                                        // Once the receiver's handlers are finished we will get the results.
                                        clearTimeout(completionTimer);
                                        resolve(messageEvent.data.response);
                                        break;
                                    default:
                                        clearTimeout(ackTimer);
                                        clearTimeout(completionTimer);
                                        reject(new Error("invalid_response" /* _MessageError.INVALID_RESPONSE */));
                                        break;
                                }
                            }
                        };
                        _this.handlers.add(handler);
                        messageChannel.port1.addEventListener('message', handler.onMessage);
                        _this.target.postMessage({
                            eventType: eventType,
                            eventId: eventId,
                            data: data
                        }, [messageChannel.port2]);
                    }).finally(function () {
                        if (handler) {
                            _this.removeMessageHandler(handler);
                        }
                    })];
            });
        });
    };
    return Sender;
}());

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
var DB_NAME = 'firebaseLocalStorageDb';
var DB_VERSION = 1;
var DB_OBJECTSTORE_NAME = 'firebaseLocalStorage';
var DB_DATA_KEYPATH = 'fbase_key';
/**
 * Promise wrapper for IDBRequest
 *
 * Unfortunately we can't cleanly extend Promise<T> since promises are not callable in ES6
 *
 */
var DBPromise = /** @class */ (function () {
    function DBPromise(request) {
        this.request = request;
    }
    DBPromise.prototype.toPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.request.addEventListener('success', function () {
                resolve(_this.request.result);
            });
            _this.request.addEventListener('error', function () {
                reject(_this.request.error);
            });
        });
    };
    return DBPromise;
}());
function getObjectStore(db, isReadWrite) {
    return db
        .transaction([DB_OBJECTSTORE_NAME], isReadWrite ? 'readwrite' : 'readonly')
        .objectStore(DB_OBJECTSTORE_NAME);
}
function _deleteDatabase() {
    var request = indexedDB.deleteDatabase(DB_NAME);
    return new DBPromise(request).toPromise();
}
function _openDatabase() {
    var _this = this;
    var request = indexedDB.open(DB_NAME, DB_VERSION);
    return new Promise(function (resolve, reject) {
        request.addEventListener('error', function () {
            reject(request.error);
        });
        request.addEventListener('upgradeneeded', function () {
            var db = request.result;
            try {
                db.createObjectStore(DB_OBJECTSTORE_NAME, { keyPath: DB_DATA_KEYPATH });
            }
            catch (e) {
                reject(e);
            }
        });
        request.addEventListener('success', function () { return tslib.__awaiter(_this, void 0, void 0, function () {
            var db, _a;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        db = request.result;
                        if (!!db.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) return [3 /*break*/, 3];
                        // Need to close the database or else you get a `blocked` event
                        db.close();
                        return [4 /*yield*/, _deleteDatabase()];
                    case 1:
                        _b.sent();
                        _a = resolve;
                        return [4 /*yield*/, _openDatabase()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]);
                        return [3 /*break*/, 4];
                    case 3:
                        resolve(db);
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
}
function _putObject(db, key, value) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var request;
        var _a;
        return tslib.__generator(this, function (_b) {
            request = getObjectStore(db, true).put((_a = {},
                _a[DB_DATA_KEYPATH] = key,
                _a.value = value,
                _a));
            return [2 /*return*/, new DBPromise(request).toPromise()];
        });
    });
}
function getObject(db, key) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var request, data;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = getObjectStore(db, false).get(key);
                    return [4 /*yield*/, new DBPromise(request).toPromise()];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data === undefined ? null : data.value];
            }
        });
    });
}
function _deleteObject(db, key) {
    var request = getObjectStore(db, true).delete(key);
    return new DBPromise(request).toPromise();
}
var _POLLING_INTERVAL_MS = 800;
var _TRANSACTION_RETRY_COUNT = 3;
var IndexedDBLocalPersistence = /** @class */ (function () {
    function IndexedDBLocalPersistence() {
        this.type = "LOCAL" /* PersistenceType.LOCAL */;
        this._shouldAllowMigration = true;
        this.listeners = {};
        this.localCache = {};
        // setTimeout return value is platform specific
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.pollTimer = null;
        this.pendingWrites = 0;
        this.receiver = null;
        this.sender = null;
        this.serviceWorkerReceiverAvailable = false;
        this.activeServiceWorker = null;
        // Fire & forget the service worker registration as it may never resolve
        this._workerInitializationPromise =
            this.initializeServiceWorkerMessaging().then(function () { }, function () { });
    }
    IndexedDBLocalPersistence.prototype._openDb = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.db) {
                            return [2 /*return*/, this.db];
                        }
                        _a = this;
                        return [4 /*yield*/, _openDatabase()];
                    case 1:
                        _a.db = _b.sent();
                        return [2 /*return*/, this.db];
                }
            });
        });
    };
    IndexedDBLocalPersistence.prototype._withRetries = function (op) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var numAttempts, db, e_1;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        numAttempts = 0;
                        _a.label = 1;
                    case 1:
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this._openDb()];
                    case 3:
                        db = _a.sent();
                        return [4 /*yield*/, op(db)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        e_1 = _a.sent();
                        if (numAttempts++ > _TRANSACTION_RETRY_COUNT) {
                            throw e_1;
                        }
                        if (this.db) {
                            this.db.close();
                            this.db = undefined;
                        }
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * IndexedDB events do not propagate from the main window to the worker context.  We rely on a
     * postMessage interface to send these events to the worker ourselves.
     */
    IndexedDBLocalPersistence.prototype.initializeServiceWorkerMessaging = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                return [2 /*return*/, index._isWorker() ? this.initializeReceiver() : this.initializeSender()];
            });
        });
    };
    /**
     * As the worker we should listen to events from the main window.
     */
    IndexedDBLocalPersistence.prototype.initializeReceiver = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib.__generator(this, function (_a) {
                this.receiver = Receiver._getInstance(index._getWorkerGlobalScope());
                // Refresh from persistence if we receive a KeyChanged message.
                this.receiver._subscribe("keyChanged" /* _EventType.KEY_CHANGED */, function (_origin, data) { return tslib.__awaiter(_this, void 0, void 0, function () {
                    var keys;
                    return tslib.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this._poll()];
                            case 1:
                                keys = _a.sent();
                                return [2 /*return*/, {
                                        keyProcessed: keys.includes(data.key)
                                    }];
                        }
                    });
                }); });
                // Let the sender know that we are listening so they give us more timeout.
                this.receiver._subscribe("ping" /* _EventType.PING */, function (_origin, _data) { return tslib.__awaiter(_this, void 0, void 0, function () {
                    return tslib.__generator(this, function (_a) {
                        return [2 /*return*/, ["keyChanged" /* _EventType.KEY_CHANGED */]];
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    /**
     * As the main window, we should let the worker know when keys change (set and remove).
     *
     * @remarks
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready | ServiceWorkerContainer.ready}
     * may not resolve.
     */
    IndexedDBLocalPersistence.prototype.initializeSender = function () {
        var _a, _b;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _c, results;
            return tslib.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Check to see if there's an active service worker.
                        _c = this;
                        return [4 /*yield*/, index._getActiveServiceWorker()];
                    case 1:
                        // Check to see if there's an active service worker.
                        _c.activeServiceWorker = _d.sent();
                        if (!this.activeServiceWorker) {
                            return [2 /*return*/];
                        }
                        this.sender = new Sender(this.activeServiceWorker);
                        return [4 /*yield*/, this.sender._send("ping" /* _EventType.PING */, {}, 800 /* _TimeoutDuration.LONG_ACK */)];
                    case 2:
                        results = _d.sent();
                        if (!results) {
                            return [2 /*return*/];
                        }
                        if (((_a = results[0]) === null || _a === void 0 ? void 0 : _a.fulfilled) &&
                            ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.value.includes("keyChanged" /* _EventType.KEY_CHANGED */))) {
                            this.serviceWorkerReceiverAvailable = true;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Let the worker know about a changed key, the exact key doesn't technically matter since the
     * worker will just trigger a full sync anyway.
     *
     * @remarks
     * For now, we only support one service worker per page.
     *
     * @param key - Storage key which changed.
     */
    IndexedDBLocalPersistence.prototype.notifyServiceWorker = function (key) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.sender ||
                            !this.activeServiceWorker ||
                            index._getServiceWorkerController() !== this.activeServiceWorker) {
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.sender._send("keyChanged" /* _EventType.KEY_CHANGED */, { key: key }, 
                            // Use long timeout if receiver has previously responded to a ping from us.
                            this.serviceWorkerReceiverAvailable
                                ? 800 /* _TimeoutDuration.LONG_ACK */
                                : 50 /* _TimeoutDuration.ACK */)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IndexedDBLocalPersistence.prototype._isAvailable = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var db;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!indexedDB) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, _openDatabase()];
                    case 1:
                        db = _b.sent();
                        return [4 /*yield*/, _putObject(db, index.STORAGE_AVAILABLE_KEY, '1')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, _deleteObject(db, index.STORAGE_AVAILABLE_KEY)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, false];
                }
            });
        });
    };
    IndexedDBLocalPersistence.prototype._withPendingWrite = function (write) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.pendingWrites++;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, write()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        this.pendingWrites--;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IndexedDBLocalPersistence.prototype._set = function (key, value) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib.__generator(this, function (_a) {
                return [2 /*return*/, this._withPendingWrite(function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                        return tslib.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this._withRetries(function (db) { return _putObject(db, key, value); })];
                                case 1:
                                    _a.sent();
                                    this.localCache[key] = value;
                                    return [2 /*return*/, this.notifyServiceWorker(key)];
                            }
                        });
                    }); })];
            });
        });
    };
    IndexedDBLocalPersistence.prototype._get = function (key) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var obj;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._withRetries(function (db) {
                            return getObject(db, key);
                        })];
                    case 1:
                        obj = (_a.sent());
                        this.localCache[key] = obj;
                        return [2 /*return*/, obj];
                }
            });
        });
    };
    IndexedDBLocalPersistence.prototype._remove = function (key) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib.__generator(this, function (_a) {
                return [2 /*return*/, this._withPendingWrite(function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                        return tslib.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this._withRetries(function (db) { return _deleteObject(db, key); })];
                                case 1:
                                    _a.sent();
                                    delete this.localCache[key];
                                    return [2 /*return*/, this.notifyServiceWorker(key)];
                            }
                        });
                    }); })];
            });
        });
    };
    IndexedDBLocalPersistence.prototype._poll = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var result, keys, keysInResult, _i, result_1, _a, key, value, _b, _c, localKey;
            return tslib.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._withRetries(function (db) {
                            var getAllRequest = getObjectStore(db, false).getAll();
                            return new DBPromise(getAllRequest).toPromise();
                        })];
                    case 1:
                        result = _d.sent();
                        if (!result) {
                            return [2 /*return*/, []];
                        }
                        // If we have pending writes in progress abort, we'll get picked up on the next poll
                        if (this.pendingWrites !== 0) {
                            return [2 /*return*/, []];
                        }
                        keys = [];
                        keysInResult = new Set();
                        if (result.length !== 0) {
                            for (_i = 0, result_1 = result; _i < result_1.length; _i++) {
                                _a = result_1[_i], key = _a.fbase_key, value = _a.value;
                                keysInResult.add(key);
                                if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
                                    this.notifyListeners(key, value);
                                    keys.push(key);
                                }
                            }
                        }
                        for (_b = 0, _c = Object.keys(this.localCache); _b < _c.length; _b++) {
                            localKey = _c[_b];
                            if (this.localCache[localKey] && !keysInResult.has(localKey)) {
                                // Deleted
                                this.notifyListeners(localKey, null);
                                keys.push(localKey);
                            }
                        }
                        return [2 /*return*/, keys];
                }
            });
        });
    };
    IndexedDBLocalPersistence.prototype.notifyListeners = function (key, newValue) {
        this.localCache[key] = newValue;
        var listeners = this.listeners[key];
        if (listeners) {
            for (var _i = 0, _a = Array.from(listeners); _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(newValue);
            }
        }
    };
    IndexedDBLocalPersistence.prototype.startPolling = function () {
        var _this = this;
        this.stopPolling();
        this.pollTimer = setInterval(function () { return tslib.__awaiter(_this, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
            return [2 /*return*/, this._poll()];
        }); }); }, _POLLING_INTERVAL_MS);
    };
    IndexedDBLocalPersistence.prototype.stopPolling = function () {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    };
    IndexedDBLocalPersistence.prototype._addListener = function (key, listener) {
        if (Object.keys(this.listeners).length === 0) {
            this.startPolling();
        }
        if (!this.listeners[key]) {
            this.listeners[key] = new Set();
            // Populate the cache to avoid spuriously triggering on first poll.
            void this._get(key); // This can happen in the background async and we can return immediately.
        }
        this.listeners[key].add(listener);
    };
    IndexedDBLocalPersistence.prototype._removeListener = function (key, listener) {
        if (this.listeners[key]) {
            this.listeners[key].delete(listener);
            if (this.listeners[key].size === 0) {
                delete this.listeners[key];
            }
        }
        if (Object.keys(this.listeners).length === 0) {
            this.stopPolling();
        }
    };
    IndexedDBLocalPersistence.type = 'LOCAL';
    return IndexedDBLocalPersistence;
}());
/**
 * An implementation of {@link Persistence} of type `LOCAL` using `indexedDB`
 * for the underlying storage.
 *
 * @public
 */
var indexedDBLocalPersistence = IndexedDBLocalPersistence;

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
 * Chooses a popup/redirect resolver to use. This prefers the override (which
 * is directly passed in), and falls back to the property set on the auth
 * object. If neither are available, this function errors w/ an argument error.
 */
function _withDefaultResolver(auth, resolverOverride) {
    if (resolverOverride) {
        return index._getInstance(resolverOverride);
    }
    index._assert(auth._popupRedirectResolver, auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
    return auth._popupRedirectResolver;
}

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
var IdpCredential = /** @class */ (function (_super) {
    tslib.__extends(IdpCredential, _super);
    function IdpCredential(params) {
        var _this = _super.call(this, "custom" /* ProviderId.CUSTOM */, "custom" /* ProviderId.CUSTOM */) || this;
        _this.params = params;
        return _this;
    }
    IdpCredential.prototype._getIdTokenResponse = function (auth) {
        return index.signInWithIdp(auth, this._buildIdpRequest());
    };
    IdpCredential.prototype._linkToIdToken = function (auth, idToken) {
        return index.signInWithIdp(auth, this._buildIdpRequest(idToken));
    };
    IdpCredential.prototype._getReauthenticationResolver = function (auth) {
        return index.signInWithIdp(auth, this._buildIdpRequest());
    };
    IdpCredential.prototype._buildIdpRequest = function (idToken) {
        var request = {
            requestUri: this.params.requestUri,
            sessionId: this.params.sessionId,
            postBody: this.params.postBody,
            tenantId: this.params.tenantId,
            pendingToken: this.params.pendingToken,
            returnSecureToken: true,
            returnIdpCredential: true
        };
        if (idToken) {
            request.idToken = idToken;
        }
        return request;
    };
    return IdpCredential;
}(index.AuthCredential));
function _signIn(params) {
    return index._signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
}
function _reauth(params) {
    var auth = params.auth, user = params.user;
    index._assert(user, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    return index._reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
}
function _link(params) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var auth, user;
        return tslib.__generator(this, function (_a) {
            auth = params.auth, user = params.user;
            index._assert(user, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
            return [2 /*return*/, index._link(user, new IdpCredential(params), params.bypassAuthState)];
        });
    });
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
/**
 * Popup event manager. Handles the popup's entire lifecycle; listens to auth
 * events
 */
var AbstractPopupRedirectOperation = /** @class */ (function () {
    function AbstractPopupRedirectOperation(auth, filter, resolver, user, bypassAuthState) {
        if (bypassAuthState === void 0) { bypassAuthState = false; }
        this.auth = auth;
        this.resolver = resolver;
        this.user = user;
        this.bypassAuthState = bypassAuthState;
        this.pendingPromise = null;
        this.eventManager = null;
        this.filter = Array.isArray(filter) ? filter : [filter];
    }
    AbstractPopupRedirectOperation.prototype.execute = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib.__awaiter(_this, void 0, void 0, function () {
            var _a, e_1;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.pendingPromise = { resolve: resolve, reject: reject };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        _a = this;
                        return [4 /*yield*/, this.resolver._initialize(this.auth)];
                    case 2:
                        _a.eventManager = _b.sent();
                        return [4 /*yield*/, this.onExecution()];
                    case 3:
                        _b.sent();
                        this.eventManager.registerConsumer(this);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        this.reject(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    AbstractPopupRedirectOperation.prototype.onAuthEvent = function (event) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var urlResponse, sessionId, postBody, tenantId, error, type, params, _a, e_2;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        urlResponse = event.urlResponse, sessionId = event.sessionId, postBody = event.postBody, tenantId = event.tenantId, error = event.error, type = event.type;
                        if (error) {
                            this.reject(error);
                            return [2 /*return*/];
                        }
                        params = {
                            auth: this.auth,
                            requestUri: urlResponse,
                            sessionId: sessionId,
                            tenantId: tenantId || undefined,
                            postBody: postBody || undefined,
                            user: this.user,
                            bypassAuthState: this.bypassAuthState
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this.resolve;
                        return [4 /*yield*/, this.getIdpTask(type)(params)];
                    case 2:
                        _a.apply(this, [_b.sent()]);
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _b.sent();
                        this.reject(e_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AbstractPopupRedirectOperation.prototype.onError = function (error) {
        this.reject(error);
    };
    AbstractPopupRedirectOperation.prototype.getIdpTask = function (type) {
        switch (type) {
            case "signInViaPopup" /* AuthEventType.SIGN_IN_VIA_POPUP */:
            case "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */:
                return _signIn;
            case "linkViaPopup" /* AuthEventType.LINK_VIA_POPUP */:
            case "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */:
                return _link;
            case "reauthViaPopup" /* AuthEventType.REAUTH_VIA_POPUP */:
            case "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */:
                return _reauth;
            default:
                index._fail(this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        }
    };
    AbstractPopupRedirectOperation.prototype.resolve = function (cred) {
        index.debugAssert(this.pendingPromise, 'Pending promise was never set');
        this.pendingPromise.resolve(cred);
        this.unregisterAndCleanUp();
    };
    AbstractPopupRedirectOperation.prototype.reject = function (error) {
        index.debugAssert(this.pendingPromise, 'Pending promise was never set');
        this.pendingPromise.reject(error);
        this.unregisterAndCleanUp();
    };
    AbstractPopupRedirectOperation.prototype.unregisterAndCleanUp = function () {
        if (this.eventManager) {
            this.eventManager.unregisterConsumer(this);
        }
        this.pendingPromise = null;
        this.cleanUp();
    };
    return AbstractPopupRedirectOperation;
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
var _POLL_WINDOW_CLOSE_TIMEOUT = new index.Delay(2000, 10000);
/**
 * Authenticates a Firebase client using a popup-based OAuth authentication flow.
 *
 * @remarks
 * If succeeds, returns the signed in user along with the provider's credential. If sign in was
 * unsuccessful, returns an error object containing additional information about the error.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Facebook Access Token.
 * const credential = provider.credentialFromResult(auth, result);
 * const token = credential.accessToken;
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function signInWithPopup(auth, provider, resolver) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var authInternal, resolverInternal, action;
        return tslib.__generator(this, function (_a) {
            authInternal = index._castAuth(auth);
            index._assertInstanceOf(auth, provider, index.FederatedAuthProvider);
            resolverInternal = _withDefaultResolver(authInternal, resolver);
            action = new PopupOperation(authInternal, "signInViaPopup" /* AuthEventType.SIGN_IN_VIA_POPUP */, provider, resolverInternal);
            return [2 /*return*/, action.executeNotNull()];
        });
    });
}
/**
 * Reauthenticates the current user with the specified {@link OAuthProvider} using a pop-up based
 * OAuth flow.
 *
 * @remarks
 * If the reauthentication is successful, the returned result will contain the user and the
 * provider's credential.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithPopup(auth, provider);
 * // Reauthenticate using a popup.
 * await reauthenticateWithPopup(result.user, provider);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function reauthenticateWithPopup(user, provider, resolver) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var userInternal, resolverInternal, action;
        return tslib.__generator(this, function (_a) {
            userInternal = util.getModularInstance(user);
            index._assertInstanceOf(userInternal.auth, provider, index.FederatedAuthProvider);
            resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
            action = new PopupOperation(userInternal.auth, "reauthViaPopup" /* AuthEventType.REAUTH_VIA_POPUP */, provider, resolverInternal, userInternal);
            return [2 /*return*/, action.executeNotNull()];
        });
    });
}
/**
 * Links the authenticated provider to the user account using a pop-up based OAuth flow.
 *
 * @remarks
 * If the linking is successful, the returned result will contain the user and the provider's credential.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using some other provider.
 * const result = await signInWithEmailAndPassword(auth, email, password);
 * // Link using a popup.
 * const provider = new FacebookAuthProvider();
 * await linkWithPopup(result.user, provider);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function linkWithPopup(user, provider, resolver) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var userInternal, resolverInternal, action;
        return tslib.__generator(this, function (_a) {
            userInternal = util.getModularInstance(user);
            index._assertInstanceOf(userInternal.auth, provider, index.FederatedAuthProvider);
            resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
            action = new PopupOperation(userInternal.auth, "linkViaPopup" /* AuthEventType.LINK_VIA_POPUP */, provider, resolverInternal, userInternal);
            return [2 /*return*/, action.executeNotNull()];
        });
    });
}
/**
 * Popup event manager. Handles the popup's entire lifecycle; listens to auth
 * events
 *
 */
var PopupOperation = /** @class */ (function (_super) {
    tslib.__extends(PopupOperation, _super);
    function PopupOperation(auth, filter, provider, resolver, user) {
        var _this = _super.call(this, auth, filter, resolver, user) || this;
        _this.provider = provider;
        _this.authWindow = null;
        _this.pollId = null;
        if (PopupOperation.currentPopupAction) {
            PopupOperation.currentPopupAction.cancel();
        }
        PopupOperation.currentPopupAction = _this;
        return _this;
    }
    PopupOperation.prototype.executeNotNull = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execute()];
                    case 1:
                        result = _a.sent();
                        index._assert(result, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PopupOperation.prototype.onExecution = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var eventId, _a;
            var _this = this;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        index.debugAssert(this.filter.length === 1, 'Popup operations only handle one event');
                        eventId = _generateEventId();
                        _a = this;
                        return [4 /*yield*/, this.resolver._openPopup(this.auth, this.provider, this.filter[0], // There's always one, see constructor
                            eventId)];
                    case 1:
                        _a.authWindow = _b.sent();
                        this.authWindow.associatedEvent = eventId;
                        // Check for web storage support and origin validation _after_ the popup is
                        // loaded. These operations are slow (~1 second or so) Rather than
                        // waiting on them before opening the window, optimistically open the popup
                        // and check for storage support at the same time. If storage support is
                        // not available, this will cause the whole thing to reject properly. It
                        // will also close the popup, but since the promise has already rejected,
                        // the popup closed by user poll will reject into the void.
                        this.resolver._originValidation(this.auth).catch(function (e) {
                            _this.reject(e);
                        });
                        this.resolver._isIframeWebStorageSupported(this.auth, function (isSupported) {
                            if (!isSupported) {
                                _this.reject(index._createError(_this.auth, "web-storage-unsupported" /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */));
                            }
                        });
                        // Handle user closure. Notice this does *not* use await
                        this.pollUserCancellation();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(PopupOperation.prototype, "eventId", {
        get: function () {
            var _a;
            return ((_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.associatedEvent) || null;
        },
        enumerable: false,
        configurable: true
    });
    PopupOperation.prototype.cancel = function () {
        this.reject(index._createError(this.auth, "cancelled-popup-request" /* AuthErrorCode.EXPIRED_POPUP_REQUEST */));
    };
    PopupOperation.prototype.cleanUp = function () {
        if (this.authWindow) {
            this.authWindow.close();
        }
        if (this.pollId) {
            window.clearTimeout(this.pollId);
        }
        this.authWindow = null;
        this.pollId = null;
        PopupOperation.currentPopupAction = null;
    };
    PopupOperation.prototype.pollUserCancellation = function () {
        var _this = this;
        var poll = function () {
            var _a, _b;
            if ((_b = (_a = _this.authWindow) === null || _a === void 0 ? void 0 : _a.window) === null || _b === void 0 ? void 0 : _b.closed) {
                // Make sure that there is sufficient time for whatever action to
                // complete. The window could have closed but the sign in network
                // call could still be in flight. This is specifically true for
                // Firefox or if the opener is in an iframe, in which case the oauth
                // helper closes the popup.
                _this.pollId = window.setTimeout(function () {
                    _this.pollId = null;
                    _this.reject(index._createError(_this.auth, "popup-closed-by-user" /* AuthErrorCode.POPUP_CLOSED_BY_USER */));
                }, 8000 /* _Timeout.AUTH_EVENT */);
                return;
            }
            _this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
        };
        poll();
    };
    // Only one popup is ever shown at once. The lifecycle of the current popup
    // can be managed / cancelled by the constructor.
    PopupOperation.currentPopupAction = null;
    return PopupOperation;
}(AbstractPopupRedirectOperation));

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
var PENDING_REDIRECT_KEY = 'pendingRedirect';
// We only get one redirect outcome for any one auth, so just store it
// in here.
var redirectOutcomeMap = new Map();
var RedirectAction = /** @class */ (function (_super) {
    tslib.__extends(RedirectAction, _super);
    function RedirectAction(auth, resolver, bypassAuthState) {
        if (bypassAuthState === void 0) { bypassAuthState = false; }
        var _this = _super.call(this, auth, [
            "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */,
            "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */,
            "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */,
            "unknown" /* AuthEventType.UNKNOWN */
        ], resolver, undefined, bypassAuthState) || this;
        _this.eventId = null;
        return _this;
    }
    /**
     * Override the execute function; if we already have a redirect result, then
     * just return it.
     */
    RedirectAction.prototype.execute = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var readyOutcome, hasPendingRedirect, result_1, _a, e_1;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        readyOutcome = redirectOutcomeMap.get(this.auth._key());
                        if (!!readyOutcome) return [3 /*break*/, 8];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, _getAndClearPendingRedirectStatus(this.resolver, this.auth)];
                    case 2:
                        hasPendingRedirect = _b.sent();
                        if (!hasPendingRedirect) return [3 /*break*/, 4];
                        return [4 /*yield*/, _super.prototype.execute.call(this)];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = null;
                        _b.label = 5;
                    case 5:
                        result_1 = _a;
                        readyOutcome = function () { return Promise.resolve(result_1); };
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _b.sent();
                        readyOutcome = function () { return Promise.reject(e_1); };
                        return [3 /*break*/, 7];
                    case 7:
                        redirectOutcomeMap.set(this.auth._key(), readyOutcome);
                        _b.label = 8;
                    case 8:
                        // If we're not bypassing auth state, the ready outcome should be set to
                        // null.
                        if (!this.bypassAuthState) {
                            redirectOutcomeMap.set(this.auth._key(), function () { return Promise.resolve(null); });
                        }
                        return [2 /*return*/, readyOutcome()];
                }
            });
        });
    };
    RedirectAction.prototype.onAuthEvent = function (event) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var user;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (event.type === "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */) {
                            return [2 /*return*/, _super.prototype.onAuthEvent.call(this, event)];
                        }
                        else if (event.type === "unknown" /* AuthEventType.UNKNOWN */) {
                            // This is a sentinel value indicating there's no pending redirect
                            this.resolve(null);
                            return [2 /*return*/];
                        }
                        if (!event.eventId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.auth._redirectUserForId(event.eventId)];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            this.user = user;
                            return [2 /*return*/, _super.prototype.onAuthEvent.call(this, event)];
                        }
                        else {
                            this.resolve(null);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    RedirectAction.prototype.onExecution = function () {
        return tslib.__awaiter(this, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    RedirectAction.prototype.cleanUp = function () { };
    return RedirectAction;
}(AbstractPopupRedirectOperation));
function _getAndClearPendingRedirectStatus(resolver, auth) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var key, persistence, hasPendingRedirect;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = pendingRedirectKey(auth);
                    persistence = resolverPersistence(resolver);
                    return [4 /*yield*/, persistence._isAvailable()];
                case 1:
                    if (!(_a.sent())) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, persistence._get(key)];
                case 2:
                    hasPendingRedirect = (_a.sent()) === 'true';
                    return [4 /*yield*/, persistence._remove(key)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, hasPendingRedirect];
            }
        });
    });
}
function _setPendingRedirectStatus(resolver, auth) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            return [2 /*return*/, resolverPersistence(resolver)._set(pendingRedirectKey(auth), 'true')];
        });
    });
}
function _clearRedirectOutcomes() {
    redirectOutcomeMap.clear();
}
function _overrideRedirectResult(auth, result) {
    redirectOutcomeMap.set(auth._key(), result);
}
function resolverPersistence(resolver) {
    return index._getInstance(resolver._redirectPersistence);
}
function pendingRedirectKey(auth) {
    return index._persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
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
/**
 * Authenticates a Firebase client using a full-page redirect flow.
 *
 * @remarks
 * To handle the results and errors for this operation, refer to {@link getRedirectResult}.
 * Follow the {@link https://firebase.google.com/docs/auth/web/redirect-best-practices
 * | best practices} when using {@link signInWithRedirect}.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new FacebookAuthProvider();
 * // You can add additional scopes to the provider:
 * provider.addScope('user_birthday');
 * // Start a sign in process for an unauthenticated user.
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Facebook Access Token.
 *   const credential = provider.credentialFromResult(auth, result);
 *   const token = credential.accessToken;
 * }
 * // As this API can be used for sign-in, linking and reauthentication,
 * // check the operationType to determine what triggered this redirect
 * // operation.
 * const operationType = result.operationType;
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function signInWithRedirect(auth, provider, resolver) {
    return _signInWithRedirect(auth, provider, resolver);
}
function _signInWithRedirect(auth, provider, resolver) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var authInternal, resolverInternal;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = index._castAuth(auth);
                    index._assertInstanceOf(auth, provider, index.FederatedAuthProvider);
                    // Wait for auth initialization to complete, this will process pending redirects and clear the
                    // PENDING_REDIRECT_KEY in persistence. This should be completed before starting a new
                    // redirect and creating a PENDING_REDIRECT_KEY entry.
                    return [4 /*yield*/, authInternal._initializationPromise];
                case 1:
                    // Wait for auth initialization to complete, this will process pending redirects and clear the
                    // PENDING_REDIRECT_KEY in persistence. This should be completed before starting a new
                    // redirect and creating a PENDING_REDIRECT_KEY entry.
                    _a.sent();
                    resolverInternal = _withDefaultResolver(authInternal, resolver);
                    return [4 /*yield*/, _setPendingRedirectStatus(resolverInternal, authInternal)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, resolverInternal._openRedirect(authInternal, provider, "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */)];
            }
        });
    });
}
/**
 * Reauthenticates the current user with the specified {@link OAuthProvider} using a full-page redirect flow.
 * @remarks
 * To handle the results and errors for this operation, refer to {@link getRedirectResult}.
 * Follow the {@link https://firebase.google.com/docs/auth/web/redirect-best-practices
 * | best practices} when using {@link reauthenticateWithRedirect}.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * // Reauthenticate using a redirect.
 * await reauthenticateWithRedirect(result.user, provider);
 * // This will again trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function reauthenticateWithRedirect(user, provider, resolver) {
    return _reauthenticateWithRedirect(user, provider, resolver);
}
function _reauthenticateWithRedirect(user, provider, resolver) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var userInternal, resolverInternal, eventId;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userInternal = util.getModularInstance(user);
                    index._assertInstanceOf(userInternal.auth, provider, index.FederatedAuthProvider);
                    // Wait for auth initialization to complete, this will process pending redirects and clear the
                    // PENDING_REDIRECT_KEY in persistence. This should be completed before starting a new
                    // redirect and creating a PENDING_REDIRECT_KEY entry.
                    return [4 /*yield*/, userInternal.auth._initializationPromise];
                case 1:
                    // Wait for auth initialization to complete, this will process pending redirects and clear the
                    // PENDING_REDIRECT_KEY in persistence. This should be completed before starting a new
                    // redirect and creating a PENDING_REDIRECT_KEY entry.
                    _a.sent();
                    resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
                    return [4 /*yield*/, _setPendingRedirectStatus(resolverInternal, userInternal.auth)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prepareUserForRedirect(userInternal)];
                case 3:
                    eventId = _a.sent();
                    return [2 /*return*/, resolverInternal._openRedirect(userInternal.auth, provider, "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */, eventId)];
            }
        });
    });
}
/**
 * Links the {@link OAuthProvider} to the user account using a full-page redirect flow.
 * @remarks
 * To handle the results and errors for this operation, refer to {@link getRedirectResult}.
 * Follow the {@link https://firebase.google.com/docs/auth/web/redirect-best-practices
 * | best practices} when using {@link linkWithRedirect}.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using some other provider.
 * const result = await signInWithEmailAndPassword(auth, email, password);
 * // Link using a redirect.
 * const provider = new FacebookAuthProvider();
 * await linkWithRedirect(result.user, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function linkWithRedirect(user, provider, resolver) {
    return _linkWithRedirect(user, provider, resolver);
}
function _linkWithRedirect(user, provider, resolver) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var userInternal, resolverInternal, eventId;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userInternal = util.getModularInstance(user);
                    index._assertInstanceOf(userInternal.auth, provider, index.FederatedAuthProvider);
                    // Wait for auth initialization to complete, this will process pending redirects and clear the
                    // PENDING_REDIRECT_KEY in persistence. This should be completed before starting a new
                    // redirect and creating a PENDING_REDIRECT_KEY entry.
                    return [4 /*yield*/, userInternal.auth._initializationPromise];
                case 1:
                    // Wait for auth initialization to complete, this will process pending redirects and clear the
                    // PENDING_REDIRECT_KEY in persistence. This should be completed before starting a new
                    // redirect and creating a PENDING_REDIRECT_KEY entry.
                    _a.sent();
                    resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
                    return [4 /*yield*/, index._assertLinkedStatus(false, userInternal, provider.providerId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, _setPendingRedirectStatus(resolverInternal, userInternal.auth)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prepareUserForRedirect(userInternal)];
                case 4:
                    eventId = _a.sent();
                    return [2 /*return*/, resolverInternal._openRedirect(userInternal.auth, provider, "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */, eventId)];
            }
        });
    });
}
/**
 * Returns a {@link UserCredential} from the redirect-based sign-in flow.
 *
 * @remarks
 * If sign-in succeeded, returns the signed in user. If sign-in was unsuccessful, fails with an
 * error. If no redirect operation was called, returns `null`.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new FacebookAuthProvider();
 * // You can add additional scopes to the provider:
 * provider.addScope('user_birthday');
 * // Start a sign in process for an unauthenticated user.
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Facebook Access Token.
 *   const credential = provider.credentialFromResult(auth, result);
 *   const token = credential.accessToken;
 * }
 * // As this API can be used for sign-in, linking and reauthentication,
 * // check the operationType to determine what triggered this redirect
 * // operation.
 * const operationType = result.operationType;
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function getRedirectResult(auth, resolver) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index._castAuth(auth)._initializationPromise];
                case 1:
                    _a.sent();
                    return [2 /*return*/, _getRedirectResult(auth, resolver, false)];
            }
        });
    });
}
function _getRedirectResult(auth, resolverExtern, bypassAuthState) {
    if (bypassAuthState === void 0) { bypassAuthState = false; }
    return tslib.__awaiter(this, void 0, void 0, function () {
        var authInternal, resolver, action, result;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = index._castAuth(auth);
                    resolver = _withDefaultResolver(authInternal, resolverExtern);
                    action = new RedirectAction(authInternal, resolver, bypassAuthState);
                    return [4 /*yield*/, action.execute()];
                case 1:
                    result = _a.sent();
                    if (!(result && !bypassAuthState)) return [3 /*break*/, 4];
                    delete result.user._redirectEventId;
                    return [4 /*yield*/, authInternal._persistUserIfCurrent(result.user)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, authInternal._setRedirectUser(null, resolverExtern)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, result];
            }
        });
    });
}
function prepareUserForRedirect(user) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var eventId;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventId = _generateEventId("".concat(user.uid, ":::"));
                    user._redirectEventId = eventId;
                    return [4 /*yield*/, user.auth._setRedirectUser(user)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user.auth._persistUserIfCurrent(user)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, eventId];
            }
        });
    });
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
// The amount of time to store the UIDs of seen events; this is
// set to 10 min by default
var EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1000;
var AuthEventManager = /** @class */ (function () {
    function AuthEventManager(auth) {
        this.auth = auth;
        this.cachedEventUids = new Set();
        this.consumers = new Set();
        this.queuedRedirectEvent = null;
        this.hasHandledPotentialRedirect = false;
        this.lastProcessedEventTime = Date.now();
    }
    AuthEventManager.prototype.registerConsumer = function (authEventConsumer) {
        this.consumers.add(authEventConsumer);
        if (this.queuedRedirectEvent &&
            this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
            this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
            this.saveEventToCache(this.queuedRedirectEvent);
            this.queuedRedirectEvent = null;
        }
    };
    AuthEventManager.prototype.unregisterConsumer = function (authEventConsumer) {
        this.consumers.delete(authEventConsumer);
    };
    AuthEventManager.prototype.onEvent = function (event) {
        var _this = this;
        // Check if the event has already been handled
        if (this.hasEventBeenHandled(event)) {
            return false;
        }
        var handled = false;
        this.consumers.forEach(function (consumer) {
            if (_this.isEventForConsumer(event, consumer)) {
                handled = true;
                _this.sendToConsumer(event, consumer);
                _this.saveEventToCache(event);
            }
        });
        if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
            // If we've already seen a redirect before, or this is a popup event,
            // bail now
            return handled;
        }
        this.hasHandledPotentialRedirect = true;
        // If the redirect wasn't handled, hang on to it
        if (!handled) {
            this.queuedRedirectEvent = event;
            handled = true;
        }
        return handled;
    };
    AuthEventManager.prototype.sendToConsumer = function (event, consumer) {
        var _a;
        if (event.error && !isNullRedirectEvent(event)) {
            var code = ((_a = event.error.code) === null || _a === void 0 ? void 0 : _a.split('auth/')[1]) ||
                "internal-error" /* AuthErrorCode.INTERNAL_ERROR */;
            consumer.onError(index._createError(this.auth, code));
        }
        else {
            consumer.onAuthEvent(event);
        }
    };
    AuthEventManager.prototype.isEventForConsumer = function (event, consumer) {
        var eventIdMatches = consumer.eventId === null ||
            (!!event.eventId && event.eventId === consumer.eventId);
        return consumer.filter.includes(event.type) && eventIdMatches;
    };
    AuthEventManager.prototype.hasEventBeenHandled = function (event) {
        if (Date.now() - this.lastProcessedEventTime >=
            EVENT_DUPLICATION_CACHE_DURATION_MS) {
            this.cachedEventUids.clear();
        }
        return this.cachedEventUids.has(eventUid(event));
    };
    AuthEventManager.prototype.saveEventToCache = function (event) {
        this.cachedEventUids.add(eventUid(event));
        this.lastProcessedEventTime = Date.now();
    };
    return AuthEventManager;
}());
function eventUid(e) {
    return [e.type, e.eventId, e.sessionId, e.tenantId].filter(function (v) { return v; }).join('-');
}
function isNullRedirectEvent(_a) {
    var type = _a.type, error = _a.error;
    return (type === "unknown" /* AuthEventType.UNKNOWN */ &&
        (error === null || error === void 0 ? void 0 : error.code) === "auth/".concat("no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */));
}
function isRedirectEvent(event) {
    switch (event.type) {
        case "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */:
        case "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */:
        case "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */:
            return true;
        case "unknown" /* AuthEventType.UNKNOWN */:
            return isNullRedirectEvent(event);
        default:
            return false;
    }
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
function _getProjectConfig(auth, request) {
    if (request === void 0) { request = {}; }
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            return [2 /*return*/, index._performApiRequest(auth, "GET" /* HttpMethod.GET */, "/v1/projects" /* Endpoint.GET_PROJECT_CONFIG */, request)];
        });
    });
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
var IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
var HTTP_REGEX = /^https?/;
function _validateOrigin$1(auth) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var authorizedDomains, _i, authorizedDomains_1, domain;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Skip origin validation if we are in an emulated environment
                    if (auth.config.emulator) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, _getProjectConfig(auth)];
                case 1:
                    authorizedDomains = (_a.sent()).authorizedDomains;
                    for (_i = 0, authorizedDomains_1 = authorizedDomains; _i < authorizedDomains_1.length; _i++) {
                        domain = authorizedDomains_1[_i];
                        try {
                            if (matchDomain(domain)) {
                                return [2 /*return*/];
                            }
                        }
                        catch (_b) {
                            // Do nothing if there's a URL error; just continue searching
                        }
                    }
                    // In the old SDK, this error also provides helpful messages.
                    index._fail(auth, "unauthorized-domain" /* AuthErrorCode.INVALID_ORIGIN */);
                    return [2 /*return*/];
            }
        });
    });
}
function matchDomain(expected) {
    var currentUrl = index._getCurrentUrl();
    var _a = new URL(currentUrl), protocol = _a.protocol, hostname = _a.hostname;
    if (expected.startsWith('chrome-extension://')) {
        var ceUrl = new URL(expected);
        if (ceUrl.hostname === '' && hostname === '') {
            // For some reason we're not parsing chrome URLs properly
            return (protocol === 'chrome-extension:' &&
                expected.replace('chrome-extension://', '') ===
                    currentUrl.replace('chrome-extension://', ''));
        }
        return protocol === 'chrome-extension:' && ceUrl.hostname === hostname;
    }
    if (!HTTP_REGEX.test(protocol)) {
        return false;
    }
    if (IP_ADDRESS_REGEX.test(expected)) {
        // The domain has to be exactly equal to the pattern, as an IP domain will
        // only contain the IP, no extra character.
        return hostname === expected;
    }
    // Dots in pattern should be escaped.
    var escapedDomainPattern = expected.replace(/\./g, '\\.');
    // Non ip address domains.
    // domain.com = *.domain.com OR domain.com
    var re = new RegExp('^(.+\\.' + escapedDomainPattern + '|' + escapedDomainPattern + ')$', 'i');
    return re.test(hostname);
}

/**
 * @license
 * Copyright 2020 Google LLC.
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
var NETWORK_TIMEOUT = new index.Delay(30000, 60000);
/**
 * Reset unlaoded GApi modules. If gapi.load fails due to a network error,
 * it will stop working after a retrial. This is a hack to fix this issue.
 */
function resetUnloadedGapiModules() {
    // Clear last failed gapi.load state to force next gapi.load to first
    // load the failed gapi.iframes module.
    // Get gapix.beacon context.
    var beacon = index._window().___jsl;
    // Get current hint.
    if (beacon === null || beacon === void 0 ? void 0 : beacon.H) {
        // Get gapi hint.
        for (var _i = 0, _a = Object.keys(beacon.H); _i < _a.length; _i++) {
            var hint = _a[_i];
            // Requested modules.
            beacon.H[hint].r = beacon.H[hint].r || [];
            // Loaded modules.
            beacon.H[hint].L = beacon.H[hint].L || [];
            // Set requested modules to a copy of the loaded modules.
            beacon.H[hint].r = tslib.__spreadArray([], beacon.H[hint].L, true);
            // Clear pending callbacks.
            if (beacon.CP) {
                for (var i = 0; i < beacon.CP.length; i++) {
                    // Remove all failed pending callbacks.
                    beacon.CP[i] = null;
                }
            }
        }
    }
}
function loadGapi(auth) {
    return new Promise(function (resolve, reject) {
        var _a, _b, _c;
        // Function to run when gapi.load is ready.
        function loadGapiIframe() {
            // The developer may have tried to previously run gapi.load and failed.
            // Run this to fix that.
            resetUnloadedGapiModules();
            gapi.load('gapi.iframes', {
                callback: function () {
                    resolve(gapi.iframes.getContext());
                },
                ontimeout: function () {
                    // The above reset may be sufficient, but having this reset after
                    // failure ensures that if the developer calls gapi.load after the
                    // connection is re-established and before another attempt to embed
                    // the iframe, it would work and would not be broken because of our
                    // failed attempt.
                    // Timeout when gapi.iframes.Iframe not loaded.
                    resetUnloadedGapiModules();
                    reject(index._createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
                },
                timeout: NETWORK_TIMEOUT.get()
            });
        }
        if ((_b = (_a = index._window().gapi) === null || _a === void 0 ? void 0 : _a.iframes) === null || _b === void 0 ? void 0 : _b.Iframe) {
            // If gapi.iframes.Iframe available, resolve.
            resolve(gapi.iframes.getContext());
        }
        else if (!!((_c = index._window().gapi) === null || _c === void 0 ? void 0 : _c.load)) {
            // Gapi loader ready, load gapi.iframes.
            loadGapiIframe();
        }
        else {
            // Create a new iframe callback when this is called so as not to overwrite
            // any previous defined callback. This happens if this method is called
            // multiple times in parallel and could result in the later callback
            // overwriting the previous one. This would end up with a iframe
            // timeout.
            var cbName = index._generateCallbackName('iframefcb');
            // GApi loader not available, dynamically load platform.js.
            index._window()[cbName] = function () {
                // GApi loader should be ready.
                if (!!gapi.load) {
                    loadGapiIframe();
                }
                else {
                    // Gapi loader failed, throw error.
                    reject(index._createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
                }
            };
            // Load GApi loader.
            return index._loadJS("https://apis.google.com/js/api.js?onload=".concat(cbName))
                .catch(function (e) { return reject(e); });
        }
    }).catch(function (error) {
        // Reset cached promise to allow for retrial.
        cachedGApiLoader = null;
        throw error;
    });
}
var cachedGApiLoader = null;
function _loadGapi(auth) {
    cachedGApiLoader = cachedGApiLoader || loadGapi(auth);
    return cachedGApiLoader;
}

/**
 * @license
 * Copyright 2020 Google LLC.
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
var PING_TIMEOUT = new index.Delay(5000, 15000);
var IFRAME_PATH = '__/auth/iframe';
var EMULATED_IFRAME_PATH = 'emulator/auth/iframe';
var IFRAME_ATTRIBUTES = {
    style: {
        position: 'absolute',
        top: '-100px',
        width: '1px',
        height: '1px'
    },
    'aria-hidden': 'true',
    tabindex: '-1'
};
// Map from apiHost to endpoint ID for passing into iframe. In current SDK, apiHost can be set to
// anything (not from a list of endpoints with IDs as in legacy), so this is the closest we can get.
var EID_FROM_APIHOST = new Map([
    ["identitytoolkit.googleapis.com" /* DefaultConfig.API_HOST */, 'p'],
    ['staging-identitytoolkit.sandbox.googleapis.com', 's'],
    ['test-identitytoolkit.sandbox.googleapis.com', 't'] // test
]);
function getIframeUrl(auth) {
    var config = auth.config;
    index._assert(config.authDomain, auth, "auth-domain-config-required" /* AuthErrorCode.MISSING_AUTH_DOMAIN */);
    var url = config.emulator
        ? index._emulatorUrl(config, EMULATED_IFRAME_PATH)
        : "https://".concat(auth.config.authDomain, "/").concat(IFRAME_PATH);
    var params = {
        apiKey: config.apiKey,
        appName: auth.name,
        v: app.SDK_VERSION
    };
    var eid = EID_FROM_APIHOST.get(auth.config.apiHost);
    if (eid) {
        params.eid = eid;
    }
    var frameworks = auth._getFrameworks();
    if (frameworks.length) {
        params.fw = frameworks.join(',');
    }
    return "".concat(url, "?").concat(util.querystring(params).slice(1));
}
function _openIframe(auth) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var context, gapi;
        var _this = this;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _loadGapi(auth)];
                case 1:
                    context = _a.sent();
                    gapi = index._window().gapi;
                    index._assert(gapi, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                    return [2 /*return*/, context.open({
                            where: document.body,
                            url: getIframeUrl(auth),
                            messageHandlersFilter: gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
                            attributes: IFRAME_ATTRIBUTES,
                            dontclear: true
                        }, function (iframe) {
                            return new Promise(function (resolve, reject) { return tslib.__awaiter(_this, void 0, void 0, function () {
                                // Clear timer and resolve pending iframe ready promise.
                                function clearTimerAndResolve() {
                                    index._window().clearTimeout(networkErrorTimer);
                                    resolve(iframe);
                                }
                                var networkError, networkErrorTimer;
                                return tslib.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, iframe.restyle({
                                                // Prevent iframe from closing on mouse out.
                                                setHideOnLeave: false
                                            })];
                                        case 1:
                                            _a.sent();
                                            networkError = index._createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */);
                                            networkErrorTimer = index._window().setTimeout(function () {
                                                reject(networkError);
                                            }, PING_TIMEOUT.get());
                                            // This returns an IThenable. However the reject part does not call
                                            // when the iframe is not loaded.
                                            iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, function () {
                                                reject(networkError);
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
            }
        });
    });
}

/**
 * @license
 * Copyright 2020 Google LLC.
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
var BASE_POPUP_OPTIONS = {
    location: 'yes',
    resizable: 'yes',
    statusbar: 'yes',
    toolbar: 'no'
};
var DEFAULT_WIDTH = 500;
var DEFAULT_HEIGHT = 600;
var TARGET_BLANK = '_blank';
var FIREFOX_EMPTY_URL = 'http://localhost';
var AuthPopup = /** @class */ (function () {
    function AuthPopup(window) {
        this.window = window;
        this.associatedEvent = null;
    }
    AuthPopup.prototype.close = function () {
        if (this.window) {
            try {
                this.window.close();
            }
            catch (e) { }
        }
    };
    return AuthPopup;
}());
function _open(auth, url, name, width, height) {
    if (width === void 0) { width = DEFAULT_WIDTH; }
    if (height === void 0) { height = DEFAULT_HEIGHT; }
    var top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
    var left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
    var target = '';
    var options = tslib.__assign(tslib.__assign({}, BASE_POPUP_OPTIONS), { width: width.toString(), height: height.toString(), top: top, left: left });
    // Chrome iOS 7 and 8 is returning an undefined popup win when target is
    // specified, even though the popup is not necessarily blocked.
    var ua = util.getUA().toLowerCase();
    if (name) {
        target = index._isChromeIOS(ua) ? TARGET_BLANK : name;
    }
    if (index._isFirefox(ua)) {
        // Firefox complains when invalid URLs are popped out. Hacky way to bypass.
        url = url || FIREFOX_EMPTY_URL;
        // Firefox disables by default scrolling on popup windows, which can create
        // issues when the user has many Google accounts, for instance.
        options.scrollbars = 'yes';
    }
    var optionsString = Object.entries(options).reduce(function (accum, _a) {
        var key = _a[0], value = _a[1];
        return "".concat(accum).concat(key, "=").concat(value, ",");
    }, '');
    if (index._isIOSStandalone(ua) && target !== '_self') {
        openAsNewWindowIOS(url || '', target);
        return new AuthPopup(null);
    }
    // about:blank getting sanitized causing browsers like IE/Edge to display
    // brief error message before redirecting to handler.
    var newWin = window.open(url || '', target, optionsString);
    index._assert(newWin, auth, "popup-blocked" /* AuthErrorCode.POPUP_BLOCKED */);
    // Flaky on IE edge, encapsulate with a try and catch.
    try {
        newWin.focus();
    }
    catch (e) { }
    return new AuthPopup(newWin);
}
function openAsNewWindowIOS(url, target) {
    var el = document.createElement('a');
    el.href = url;
    el.target = target;
    var click = document.createEvent('MouseEvent');
    click.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
    el.dispatchEvent(click);
}

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
 * URL for Authentication widget which will initiate the OAuth handshake
 *
 * @internal
 */
var WIDGET_PATH = '__/auth/handler';
/**
 * URL for emulated environment
 *
 * @internal
 */
var EMULATOR_WIDGET_PATH = 'emulator/auth/handler';
/**
 * Fragment name for the App Check token that gets passed to the widget
 *
 * @internal
 */
var FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent('fac');
function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var params, _i, _a, _b, key, value, scopes, paramsDict, _c, _d, key, appCheckToken, appCheckTokenFragment;
        return tslib.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    index._assert(auth.config.authDomain, auth, "auth-domain-config-required" /* AuthErrorCode.MISSING_AUTH_DOMAIN */);
                    index._assert(auth.config.apiKey, auth, "invalid-api-key" /* AuthErrorCode.INVALID_API_KEY */);
                    params = {
                        apiKey: auth.config.apiKey,
                        appName: auth.name,
                        authType: authType,
                        redirectUrl: redirectUrl,
                        v: app.SDK_VERSION,
                        eventId: eventId
                    };
                    if (provider instanceof index.FederatedAuthProvider) {
                        provider.setDefaultLanguage(auth.languageCode);
                        params.providerId = provider.providerId || '';
                        if (!util.isEmpty(provider.getCustomParameters())) {
                            params.customParameters = JSON.stringify(provider.getCustomParameters());
                        }
                        // TODO set additionalParams from the provider as well?
                        for (_i = 0, _a = Object.entries(additionalParams || {}); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            params[key] = value;
                        }
                    }
                    if (provider instanceof index.BaseOAuthProvider) {
                        scopes = provider.getScopes().filter(function (scope) { return scope !== ''; });
                        if (scopes.length > 0) {
                            params.scopes = scopes.join(',');
                        }
                    }
                    if (auth.tenantId) {
                        params.tid = auth.tenantId;
                    }
                    paramsDict = params;
                    for (_c = 0, _d = Object.keys(paramsDict); _c < _d.length; _c++) {
                        key = _d[_c];
                        if (paramsDict[key] === undefined) {
                            delete paramsDict[key];
                        }
                    }
                    return [4 /*yield*/, auth._getAppCheckToken()];
                case 1:
                    appCheckToken = _e.sent();
                    appCheckTokenFragment = appCheckToken
                        ? "#".concat(FIREBASE_APP_CHECK_FRAGMENT_ID, "=").concat(encodeURIComponent(appCheckToken))
                        : '';
                    // Start at index 1 to skip the leading '&' in the query string
                    return [2 /*return*/, "".concat(getHandlerBase(auth), "?").concat(util.querystring(paramsDict).slice(1)).concat(appCheckTokenFragment)];
            }
        });
    });
}
function getHandlerBase(_a) {
    var config = _a.config;
    if (!config.emulator) {
        return "https://".concat(config.authDomain, "/").concat(WIDGET_PATH);
    }
    return index._emulatorUrl(config, EMULATOR_WIDGET_PATH);
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
/**
 * The special web storage event
 *
 */
var WEB_STORAGE_SUPPORT_KEY = 'webStorageSupport';
var BrowserPopupRedirectResolver = /** @class */ (function () {
    function BrowserPopupRedirectResolver() {
        this.eventManagers = {};
        this.iframes = {};
        this.originValidationPromises = {};
        this._redirectPersistence = browserSessionPersistence;
        this._completeRedirectFn = _getRedirectResult;
        this._overrideRedirectResult = _overrideRedirectResult;
    }
    // Wrapping in async even though we don't await anywhere in order
    // to make sure errors are raised as promise rejections
    BrowserPopupRedirectResolver.prototype._openPopup = function (auth, provider, authType, eventId) {
        var _a;
        return tslib.__awaiter(this, void 0, void 0, function () {
            var url;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        index.debugAssert((_a = this.eventManagers[auth._key()]) === null || _a === void 0 ? void 0 : _a.manager, '_initialize() not called before _openPopup()');
                        return [4 /*yield*/, _getRedirectUrl(auth, provider, authType, index._getCurrentUrl(), eventId)];
                    case 1:
                        url = _b.sent();
                        return [2 /*return*/, _open(auth, url, _generateEventId())];
                }
            });
        });
    };
    BrowserPopupRedirectResolver.prototype._openRedirect = function (auth, provider, authType, eventId) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var url;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._originValidation(auth)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, _getRedirectUrl(auth, provider, authType, index._getCurrentUrl(), eventId)];
                    case 2:
                        url = _a.sent();
                        index._setWindowLocation(url);
                        return [2 /*return*/, new Promise(function () { })];
                }
            });
        });
    };
    BrowserPopupRedirectResolver.prototype._initialize = function (auth) {
        var _this = this;
        var key = auth._key();
        if (this.eventManagers[key]) {
            var _a = this.eventManagers[key], manager = _a.manager, promise_1 = _a.promise;
            if (manager) {
                return Promise.resolve(manager);
            }
            else {
                index.debugAssert(promise_1, 'If manager is not set, promise should be');
                return promise_1;
            }
        }
        var promise = this.initAndGetManager(auth);
        this.eventManagers[key] = { promise: promise };
        // If the promise is rejected, the key should be removed so that the
        // operation can be retried later.
        promise.catch(function () {
            delete _this.eventManagers[key];
        });
        return promise;
    };
    BrowserPopupRedirectResolver.prototype.initAndGetManager = function (auth) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var iframe, manager;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _openIframe(auth)];
                    case 1:
                        iframe = _a.sent();
                        manager = new AuthEventManager(auth);
                        iframe.register('authEvent', function (iframeEvent) {
                            index._assert(iframeEvent === null || iframeEvent === void 0 ? void 0 : iframeEvent.authEvent, auth, "invalid-auth-event" /* AuthErrorCode.INVALID_AUTH_EVENT */);
                            // TODO: Consider splitting redirect and popup events earlier on
                            var handled = manager.onEvent(iframeEvent.authEvent);
                            return { status: handled ? "ACK" /* GapiOutcome.ACK */ : "ERROR" /* GapiOutcome.ERROR */ };
                        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
                        this.eventManagers[auth._key()] = { manager: manager };
                        this.iframes[auth._key()] = iframe;
                        return [2 /*return*/, manager];
                }
            });
        });
    };
    BrowserPopupRedirectResolver.prototype._isIframeWebStorageSupported = function (auth, cb) {
        var iframe = this.iframes[auth._key()];
        iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, function (result) {
            var _a;
            var isSupported = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a[WEB_STORAGE_SUPPORT_KEY];
            if (isSupported !== undefined) {
                cb(!!isSupported);
            }
            index._fail(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
    };
    BrowserPopupRedirectResolver.prototype._originValidation = function (auth) {
        var key = auth._key();
        if (!this.originValidationPromises[key]) {
            this.originValidationPromises[key] = _validateOrigin$1(auth);
        }
        return this.originValidationPromises[key];
    };
    Object.defineProperty(BrowserPopupRedirectResolver.prototype, "_shouldInitProactively", {
        get: function () {
            // Mobile browsers and Safari need to optimistically initialize
            return index._isMobileBrowser() || index._isSafari() || index._isIOS();
        },
        enumerable: false,
        configurable: true
    });
    return BrowserPopupRedirectResolver;
}());
/**
 * An implementation of {@link PopupRedirectResolver} suitable for browser
 * based applications.
 *
 * @remarks
 * This method does not work in a Node.js environment.
 *
 * @public
 */
var browserPopupRedirectResolver = BrowserPopupRedirectResolver;

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
var DEFAULT_ID_TOKEN_MAX_AGE = 5 * 60;
var authIdTokenMaxAge = util.getExperimentalSetting('authIdTokenMaxAge') || DEFAULT_ID_TOKEN_MAX_AGE;
var lastPostedIdToken = null;
var mintCookieFactory = function (url) { return function (user) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    var idTokenResult, _a, idTokenAge, idToken;
    return tslib.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = user;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, user.getIdTokenResult()];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                idTokenResult = _a;
                idTokenAge = idTokenResult &&
                    (new Date().getTime() - Date.parse(idTokenResult.issuedAtTime)) / 1000;
                if (idTokenAge && idTokenAge > authIdTokenMaxAge) {
                    return [2 /*return*/];
                }
                idToken = idTokenResult === null || idTokenResult === void 0 ? void 0 : idTokenResult.token;
                if (lastPostedIdToken === idToken) {
                    return [2 /*return*/];
                }
                lastPostedIdToken = idToken;
                return [4 /*yield*/, fetch(url, {
                        method: idToken ? 'POST' : 'DELETE',
                        headers: idToken
                            ? {
                                'Authorization': "Bearer ".concat(idToken)
                            }
                            : {}
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); }; };
/**
 * Returns the Auth instance associated with the provided {@link @firebase/app#FirebaseApp}.
 * If no instance exists, initializes an Auth instance with platform-specific default dependencies.
 *
 * @param app - The Firebase App.
 *
 * @public
 */
function getAuth(app$1) {
    if (app$1 === void 0) { app$1 = app.getApp(); }
    var provider = app._getProvider(app$1, 'auth');
    if (provider.isInitialized()) {
        return provider.getImmediate();
    }
    var auth = index.initializeAuth(app$1, {
        popupRedirectResolver: browserPopupRedirectResolver,
        persistence: [
            indexedDBLocalPersistence,
            browserLocalPersistence,
            browserSessionPersistence
        ]
    });
    var authTokenSyncUrl = util.getExperimentalSetting('authTokenSyncURL');
    if (authTokenSyncUrl) {
        var mintCookie_1 = mintCookieFactory(authTokenSyncUrl);
        index.beforeAuthStateChanged(auth, mintCookie_1, function () {
            return mintCookie_1(auth.currentUser);
        });
        index.onIdTokenChanged(auth, function (user) { return mintCookie_1(user); });
    }
    var authEmulatorHost = util.getDefaultEmulatorHost('auth');
    if (authEmulatorHost) {
        index.connectAuthEmulator(auth, "http://".concat(authEmulatorHost));
    }
    return auth;
}
index.registerAuth("Browser" /* ClientPlatform.BROWSER */);

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
function _cordovaWindow() {
    return window;
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
/**
 * How long to wait after the app comes back into focus before concluding that
 * the user closed the sign in tab.
 */
var REDIRECT_TIMEOUT_MS = 2000;
/**
 * Generates the URL for the OAuth handler.
 */
function _generateHandlerUrl(auth, event, provider) {
    var _a;
    return tslib.__awaiter(this, void 0, void 0, function () {
        var BuildInfo, sessionDigest, additionalParams;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    BuildInfo = _cordovaWindow().BuildInfo;
                    index.debugAssert(event.sessionId, 'AuthEvent did not contain a session ID');
                    return [4 /*yield*/, computeSha256(event.sessionId)];
                case 1:
                    sessionDigest = _b.sent();
                    additionalParams = {};
                    if (index._isIOS()) {
                        // iOS app identifier
                        additionalParams['ibi'] = BuildInfo.packageName;
                    }
                    else if (index._isAndroid()) {
                        // Android app identifier
                        additionalParams['apn'] = BuildInfo.packageName;
                    }
                    else {
                        index._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
                    }
                    // Add the display name if available
                    if (BuildInfo.displayName) {
                        additionalParams['appDisplayName'] = BuildInfo.displayName;
                    }
                    // Attached the hashed session ID
                    additionalParams['sessionId'] = sessionDigest;
                    return [2 /*return*/, _getRedirectUrl(auth, provider, event.type, undefined, (_a = event.eventId) !== null && _a !== void 0 ? _a : undefined, additionalParams)];
            }
        });
    });
}
/**
 * Validates that this app is valid for this project configuration
 */
function _validateOrigin(auth) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var BuildInfo, request;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    BuildInfo = _cordovaWindow().BuildInfo;
                    request = {};
                    if (index._isIOS()) {
                        request.iosBundleId = BuildInfo.packageName;
                    }
                    else if (index._isAndroid()) {
                        request.androidPackageName = BuildInfo.packageName;
                    }
                    else {
                        index._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
                    }
                    // Will fail automatically if package name is not authorized
                    return [4 /*yield*/, _getProjectConfig(auth, request)];
                case 1:
                    // Will fail automatically if package name is not authorized
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function _performRedirect(handlerUrl) {
    // Get the cordova plugins
    var cordova = _cordovaWindow().cordova;
    return new Promise(function (resolve) {
        cordova.plugins.browsertab.isAvailable(function (browserTabIsAvailable) {
            var iabRef = null;
            if (browserTabIsAvailable) {
                cordova.plugins.browsertab.openUrl(handlerUrl);
            }
            else {
                // TODO: Return the inappbrowser ref that's returned from the open call
                iabRef = cordova.InAppBrowser.open(handlerUrl, index._isIOS7Or8() ? '_blank' : '_system', 'location=yes');
            }
            resolve(iabRef);
        });
    });
}
/**
 * This function waits for app activity to be seen before resolving. It does
 * this by attaching listeners to various dom events. Once the app is determined
 * to be visible, this promise resolves. AFTER that resolution, the listeners
 * are detached and any browser tabs left open will be closed.
 */
function _waitForAppResume(auth, eventListener, iabRef) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var cordova, cleanup;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cordova = _cordovaWindow().cordova;
                    cleanup = function () { };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var onCloseTimer = null;
                            // DEFINE ALL THE CALLBACKS =====
                            function authEventSeen() {
                                var _a;
                                // Auth event was detected. Resolve this promise and close the extra
                                // window if it's still open.
                                resolve();
                                var closeBrowserTab = (_a = cordova.plugins.browsertab) === null || _a === void 0 ? void 0 : _a.close;
                                if (typeof closeBrowserTab === 'function') {
                                    closeBrowserTab();
                                }
                                // Close inappbrowser emebedded webview in iOS7 and 8 case if still
                                // open.
                                if (typeof (iabRef === null || iabRef === void 0 ? void 0 : iabRef.close) === 'function') {
                                    iabRef.close();
                                }
                            }
                            function resumed() {
                                if (onCloseTimer) {
                                    // This code already ran; do not rerun.
                                    return;
                                }
                                onCloseTimer = window.setTimeout(function () {
                                    // Wait two seeconds after resume then reject.
                                    reject(index._createError(auth, "redirect-cancelled-by-user" /* AuthErrorCode.REDIRECT_CANCELLED_BY_USER */));
                                }, REDIRECT_TIMEOUT_MS);
                            }
                            function visibilityChanged() {
                                if ((document === null || document === void 0 ? void 0 : document.visibilityState) === 'visible') {
                                    resumed();
                                }
                            }
                            // ATTACH ALL THE LISTENERS =====
                            // Listen for the auth event
                            eventListener.addPassiveListener(authEventSeen);
                            // Listen for resume and visibility events
                            document.addEventListener('resume', resumed, false);
                            if (index._isAndroid()) {
                                document.addEventListener('visibilitychange', visibilityChanged, false);
                            }
                            // SETUP THE CLEANUP FUNCTION =====
                            cleanup = function () {
                                eventListener.removePassiveListener(authEventSeen);
                                document.removeEventListener('resume', resumed, false);
                                document.removeEventListener('visibilitychange', visibilityChanged, false);
                                if (onCloseTimer) {
                                    window.clearTimeout(onCloseTimer);
                                }
                            };
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    cleanup();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Checks the configuration of the Cordova environment. This has no side effect
 * if the configuration is correct; otherwise it throws an error with the
 * missing plugin.
 */
function _checkCordovaConfiguration(auth) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var win = _cordovaWindow();
    // Check all dependencies installed.
    // https://github.com/nordnet/cordova-universal-links-plugin
    // Note that cordova-universal-links-plugin has been abandoned.
    // A fork with latest fixes is available at:
    // https://www.npmjs.com/package/cordova-universal-links-plugin-fix
    index._assert(typeof ((_a = win === null || win === void 0 ? void 0 : win.universalLinks) === null || _a === void 0 ? void 0 : _a.subscribe) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-universal-links-plugin-fix'
    });
    // https://www.npmjs.com/package/cordova-plugin-buildinfo
    index._assert(typeof ((_b = win === null || win === void 0 ? void 0 : win.BuildInfo) === null || _b === void 0 ? void 0 : _b.packageName) !== 'undefined', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-buildInfo'
    });
    // https://github.com/google/cordova-plugin-browsertab
    index._assert(typeof ((_e = (_d = (_c = win === null || win === void 0 ? void 0 : win.cordova) === null || _c === void 0 ? void 0 : _c.plugins) === null || _d === void 0 ? void 0 : _d.browsertab) === null || _e === void 0 ? void 0 : _e.openUrl) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    index._assert(typeof ((_h = (_g = (_f = win === null || win === void 0 ? void 0 : win.cordova) === null || _f === void 0 ? void 0 : _f.plugins) === null || _g === void 0 ? void 0 : _g.browsertab) === null || _h === void 0 ? void 0 : _h.isAvailable) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
    index._assert(typeof ((_k = (_j = win === null || win === void 0 ? void 0 : win.cordova) === null || _j === void 0 ? void 0 : _j.InAppBrowser) === null || _k === void 0 ? void 0 : _k.open) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-inappbrowser'
    });
}
/**
 * Computes the SHA-256 of a session ID. The SubtleCrypto interface is only
 * available in "secure" contexts, which covers Cordova (which is served on a file
 * protocol).
 */
function computeSha256(sessionId) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var bytes, buf, arr;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bytes = stringToArrayBuffer(sessionId);
                    return [4 /*yield*/, crypto.subtle.digest('SHA-256', bytes)];
                case 1:
                    buf = _a.sent();
                    arr = Array.from(new Uint8Array(buf));
                    return [2 /*return*/, arr.map(function (num) { return num.toString(16).padStart(2, '0'); }).join('')];
            }
        });
    });
}
function stringToArrayBuffer(str) {
    // This function is only meant to deal with an ASCII charset and makes
    // certain simplifying assumptions.
    index.debugAssert(/[0-9a-zA-Z]+/.test(str), 'Can only convert alpha-numeric strings');
    if (typeof TextEncoder !== 'undefined') {
        return new TextEncoder().encode(str);
    }
    var buff = new ArrayBuffer(str.length);
    var view = new Uint8Array(buff);
    for (var i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i);
    }
    return view;
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
var SESSION_ID_LENGTH = 20;
/** Custom AuthEventManager that adds passive listeners to events */
var CordovaAuthEventManager = /** @class */ (function (_super) {
    tslib.__extends(CordovaAuthEventManager, _super);
    function CordovaAuthEventManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.passiveListeners = new Set();
        _this.initPromise = new Promise(function (resolve) {
            _this.resolveInialized = resolve;
        });
        return _this;
    }
    CordovaAuthEventManager.prototype.addPassiveListener = function (cb) {
        this.passiveListeners.add(cb);
    };
    CordovaAuthEventManager.prototype.removePassiveListener = function (cb) {
        this.passiveListeners.delete(cb);
    };
    // In a Cordova environment, this manager can live through multiple redirect
    // operations
    CordovaAuthEventManager.prototype.resetRedirect = function () {
        this.queuedRedirectEvent = null;
        this.hasHandledPotentialRedirect = false;
    };
    /** Override the onEvent method */
    CordovaAuthEventManager.prototype.onEvent = function (event) {
        this.resolveInialized();
        this.passiveListeners.forEach(function (cb) { return cb(event); });
        return _super.prototype.onEvent.call(this, event);
    };
    CordovaAuthEventManager.prototype.initialized = function () {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initPromise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CordovaAuthEventManager;
}(AuthEventManager));
/**
 * Generates a (partial) {@link AuthEvent}.
 */
function _generateNewEvent(auth, type, eventId) {
    if (eventId === void 0) { eventId = null; }
    return {
        type: type,
        eventId: eventId,
        urlResponse: null,
        sessionId: generateSessionId(),
        postBody: null,
        tenantId: auth.tenantId,
        error: index._createError(auth, "no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
    };
}
function _savePartialEvent(auth, event) {
    return storage()._set(persistenceKey(auth), event);
}
function _getAndRemoveEvent(auth) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var event;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storage()._get(persistenceKey(auth))];
                case 1:
                    event = (_a.sent());
                    if (!event) return [3 /*break*/, 3];
                    return [4 /*yield*/, storage()._remove(persistenceKey(auth))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, event];
            }
        });
    });
}
function _eventFromPartialAndUrl(partialEvent, url) {
    var _a, _b;
    // Parse the deep link within the dynamic link URL.
    var callbackUrl = _getDeepLinkFromCallback(url);
    // Confirm it is actually a callback URL.
    // Currently the universal link will be of this format:
    // https://<AUTH_DOMAIN>/__/auth/callback<OAUTH_RESPONSE>
    // This is a fake URL but is not intended to take the user anywhere
    // and just redirect to the app.
    if (callbackUrl.includes('/__/auth/callback')) {
        // Check if there is an error in the URL.
        // This mechanism is also used to pass errors back to the app:
        // https://<AUTH_DOMAIN>/__/auth/callback?firebaseError=<STRINGIFIED_ERROR>
        var params = searchParamsOrEmpty(callbackUrl);
        // Get the error object corresponding to the stringified error if found.
        var errorObject = params['firebaseError']
            ? parseJsonOrNull(decodeURIComponent(params['firebaseError']))
            : null;
        var code = (_b = (_a = errorObject === null || errorObject === void 0 ? void 0 : errorObject['code']) === null || _a === void 0 ? void 0 : _a.split('auth/')) === null || _b === void 0 ? void 0 : _b[1];
        var error = code ? index._createError(code) : null;
        if (error) {
            return {
                type: partialEvent.type,
                eventId: partialEvent.eventId,
                tenantId: partialEvent.tenantId,
                error: error,
                urlResponse: null,
                sessionId: null,
                postBody: null
            };
        }
        else {
            return {
                type: partialEvent.type,
                eventId: partialEvent.eventId,
                tenantId: partialEvent.tenantId,
                sessionId: partialEvent.sessionId,
                urlResponse: callbackUrl,
                postBody: null
            };
        }
    }
    return null;
}
function generateSessionId() {
    var chars = [];
    var allowedChars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < SESSION_ID_LENGTH; i++) {
        var idx = Math.floor(Math.random() * allowedChars.length);
        chars.push(allowedChars.charAt(idx));
    }
    return chars.join('');
}
function storage() {
    return index._getInstance(browserLocalPersistence);
}
function persistenceKey(auth) {
    return index._persistenceKeyName("authEvent" /* KeyName.AUTH_EVENT */, auth.config.apiKey, auth.name);
}
function parseJsonOrNull(json) {
    try {
        return JSON.parse(json);
    }
    catch (e) {
        return null;
    }
}
// Exported for testing
function _getDeepLinkFromCallback(url) {
    var params = searchParamsOrEmpty(url);
    var link = params['link'] ? decodeURIComponent(params['link']) : undefined;
    // Double link case (automatic redirect)
    var doubleDeepLink = searchParamsOrEmpty(link)['link'];
    // iOS custom scheme links.
    var iOSDeepLink = params['deep_link_id']
        ? decodeURIComponent(params['deep_link_id'])
        : undefined;
    var iOSDoubleDeepLink = searchParamsOrEmpty(iOSDeepLink)['link'];
    return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
}
/**
 * Optimistically tries to get search params from a string, or else returns an
 * empty search params object.
 */
function searchParamsOrEmpty(url) {
    if (!(url === null || url === void 0 ? void 0 : url.includes('?'))) {
        return {};
    }
    var _a = url.split('?'); _a[0]; var rest = _a.slice(1);
    return util.querystringDecode(rest.join('?'));
}

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
 * How long to wait for the initial auth event before concluding no
 * redirect pending
 */
var INITIAL_EVENT_TIMEOUT_MS = 500;
var CordovaPopupRedirectResolver = /** @class */ (function () {
    function CordovaPopupRedirectResolver() {
        this._redirectPersistence = browserSessionPersistence;
        this._shouldInitProactively = true; // This is lightweight for Cordova
        this.eventManagers = new Map();
        this.originValidationPromises = {};
        this._completeRedirectFn = _getRedirectResult;
        this._overrideRedirectResult = _overrideRedirectResult;
    }
    CordovaPopupRedirectResolver.prototype._initialize = function (auth) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var key, manager;
            return tslib.__generator(this, function (_a) {
                key = auth._key();
                manager = this.eventManagers.get(key);
                if (!manager) {
                    manager = new CordovaAuthEventManager(auth);
                    this.eventManagers.set(key, manager);
                    this.attachCallbackListeners(auth, manager);
                }
                return [2 /*return*/, manager];
            });
        });
    };
    CordovaPopupRedirectResolver.prototype._openPopup = function (auth) {
        index._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    };
    CordovaPopupRedirectResolver.prototype._openRedirect = function (auth, provider, authType, eventId) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var manager, event, url, iabRef;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _checkCordovaConfiguration(auth);
                        return [4 /*yield*/, this._initialize(auth)];
                    case 1:
                        manager = _a.sent();
                        return [4 /*yield*/, manager.initialized()];
                    case 2:
                        _a.sent();
                        // Reset the persisted redirect states. This does not matter on Web where
                        // the redirect always blows away application state entirely. On Cordova,
                        // the app maintains control flow through the redirect.
                        manager.resetRedirect();
                        _clearRedirectOutcomes();
                        return [4 /*yield*/, this._originValidation(auth)];
                    case 3:
                        _a.sent();
                        event = _generateNewEvent(auth, authType, eventId);
                        return [4 /*yield*/, _savePartialEvent(auth, event)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, _generateHandlerUrl(auth, event, provider)];
                    case 5:
                        url = _a.sent();
                        return [4 /*yield*/, _performRedirect(url)];
                    case 6:
                        iabRef = _a.sent();
                        return [2 /*return*/, _waitForAppResume(auth, manager, iabRef)];
                }
            });
        });
    };
    CordovaPopupRedirectResolver.prototype._isIframeWebStorageSupported = function (_auth, _cb) {
        throw new Error('Method not implemented.');
    };
    CordovaPopupRedirectResolver.prototype._originValidation = function (auth) {
        var key = auth._key();
        if (!this.originValidationPromises[key]) {
            this.originValidationPromises[key] = _validateOrigin(auth);
        }
        return this.originValidationPromises[key];
    };
    CordovaPopupRedirectResolver.prototype.attachCallbackListeners = function (auth, manager) {
        var _this = this;
        // Get the global plugins
        var _a = _cordovaWindow(), universalLinks = _a.universalLinks, handleOpenURL = _a.handleOpenURL, BuildInfo = _a.BuildInfo;
        var noEventTimeout = setTimeout(function () { return tslib.__awaiter(_this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // We didn't see that initial event. Clear any pending object and
                    // dispatch no event
                    return [4 /*yield*/, _getAndRemoveEvent(auth)];
                    case 1:
                        // We didn't see that initial event. Clear any pending object and
                        // dispatch no event
                        _a.sent();
                        manager.onEvent(generateNoEvent());
                        return [2 /*return*/];
                }
            });
        }); }, INITIAL_EVENT_TIMEOUT_MS);
        var universalLinksCb = function (eventData) { return tslib.__awaiter(_this, void 0, void 0, function () {
            var partialEvent, finalEvent;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // We have an event so we can clear the no event timeout
                        clearTimeout(noEventTimeout);
                        return [4 /*yield*/, _getAndRemoveEvent(auth)];
                    case 1:
                        partialEvent = _a.sent();
                        finalEvent = null;
                        if (partialEvent && (eventData === null || eventData === void 0 ? void 0 : eventData['url'])) {
                            finalEvent = _eventFromPartialAndUrl(partialEvent, eventData['url']);
                        }
                        // If finalEvent is never filled, trigger with no event
                        manager.onEvent(finalEvent || generateNoEvent());
                        return [2 /*return*/];
                }
            });
        }); };
        // Universal links subscriber doesn't exist for iOS, so we need to check
        if (typeof universalLinks !== 'undefined' &&
            typeof universalLinks.subscribe === 'function') {
            universalLinks.subscribe(null, universalLinksCb);
        }
        // iOS 7 or 8 custom URL schemes.
        // This is also the current default behavior for iOS 9+.
        // For this to work, cordova-plugin-customurlscheme needs to be installed.
        // https://github.com/EddyVerbruggen/Custom-URL-scheme
        // Do not overwrite the existing developer's URL handler.
        var existingHandleOpenURL = handleOpenURL;
        var packagePrefix = "".concat(BuildInfo.packageName.toLowerCase(), "://");
        _cordovaWindow().handleOpenURL = function (url) { return tslib.__awaiter(_this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                if (url.toLowerCase().startsWith(packagePrefix)) {
                    // We want this intentionally to float
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    universalLinksCb({ url: url });
                }
                // Call the developer's handler if it is present.
                if (typeof existingHandleOpenURL === 'function') {
                    try {
                        existingHandleOpenURL(url);
                    }
                    catch (e) {
                        // This is a developer error. Don't stop the flow of the SDK.
                        console.error(e);
                    }
                }
                return [2 /*return*/];
            });
        }); };
    };
    return CordovaPopupRedirectResolver;
}());
/**
 * An implementation of {@link PopupRedirectResolver} suitable for Cordova
 * based applications.
 *
 * @public
 */
var cordovaPopupRedirectResolver = CordovaPopupRedirectResolver;
function generateNoEvent() {
    return {
        type: "unknown" /* AuthEventType.UNKNOWN */,
        eventId: null,
        sessionId: null,
        urlResponse: null,
        postBody: null,
        tenantId: null,
        error: index._createError("no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
    };
}

/**
 * @license
 * Copyright 2017 Google LLC
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
// This function should only be called by frameworks (e.g. FirebaseUI-web) to log their usage.
// It is not intended for direct use by developer apps. NO jsdoc here to intentionally leave it out
// of autogenerated documentation pages to reduce accidental misuse.
function addFrameworkForLogging(auth, framework) {
    index._castAuth(auth)._logFramework(framework);
}

exports.ActionCodeOperation = index.ActionCodeOperation;
exports.ActionCodeURL = index.ActionCodeURL;
exports.AuthCredential = index.AuthCredential;
exports.AuthErrorCodes = index.AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY;
exports.AuthImpl = index.AuthImpl;
exports.EmailAuthCredential = index.EmailAuthCredential;
exports.EmailAuthProvider = index.EmailAuthProvider;
exports.FacebookAuthProvider = index.FacebookAuthProvider;
exports.FactorId = index.FactorId;
exports.FetchProvider = index.FetchProvider;
exports.GithubAuthProvider = index.GithubAuthProvider;
exports.GoogleAuthProvider = index.GoogleAuthProvider;
exports.OAuthCredential = index.OAuthCredential;
exports.OAuthProvider = index.OAuthProvider;
exports.OperationType = index.OperationType;
exports.PhoneAuthCredential = index.PhoneAuthCredential;
exports.PhoneAuthProvider = index.PhoneAuthProvider;
exports.PhoneMultiFactorGenerator = index.PhoneMultiFactorGenerator;
exports.ProviderId = index.ProviderId;
exports.RecaptchaVerifier = index.RecaptchaVerifier;
exports.SAMLAuthCredential = index.SAMLAuthCredential;
exports.SAMLAuthProvider = index.SAMLAuthProvider;
exports.SignInMethod = index.SignInMethod;
exports.TotpMultiFactorGenerator = index.TotpMultiFactorGenerator;
exports.TotpSecret = index.TotpSecret;
exports.TwitterAuthProvider = index.TwitterAuthProvider;
exports.UserImpl = index.UserImpl;
exports._assert = index._assert;
exports._castAuth = index._castAuth;
exports._fail = index._fail;
exports._getClientVersion = index._getClientVersion;
exports._getInstance = index._getInstance;
exports._persistenceKeyName = index._persistenceKeyName;
exports.applyActionCode = index.applyActionCode;
exports.beforeAuthStateChanged = index.beforeAuthStateChanged;
exports.checkActionCode = index.checkActionCode;
exports.confirmPasswordReset = index.confirmPasswordReset;
exports.connectAuthEmulator = index.connectAuthEmulator;
exports.createUserWithEmailAndPassword = index.createUserWithEmailAndPassword;
exports.debugErrorMap = index.debugErrorMap;
exports.deleteUser = index.deleteUser;
exports.fetchSignInMethodsForEmail = index.fetchSignInMethodsForEmail;
exports.getAdditionalUserInfo = index.getAdditionalUserInfo;
exports.getIdToken = index.getIdToken;
exports.getIdTokenResult = index.getIdTokenResult;
exports.getMultiFactorResolver = index.getMultiFactorResolver;
exports.inMemoryPersistence = index.inMemoryPersistence;
exports.initializeAuth = index.initializeAuth;
exports.initializeRecaptchaConfig = index.initializeRecaptchaConfig;
exports.isSignInWithEmailLink = index.isSignInWithEmailLink;
exports.linkWithCredential = index.linkWithCredential;
exports.linkWithPhoneNumber = index.linkWithPhoneNumber;
exports.multiFactor = index.multiFactor;
exports.onAuthStateChanged = index.onAuthStateChanged;
exports.onIdTokenChanged = index.onIdTokenChanged;
exports.parseActionCodeURL = index.parseActionCodeURL;
exports.prodErrorMap = index.prodErrorMap;
exports.reauthenticateWithCredential = index.reauthenticateWithCredential;
exports.reauthenticateWithPhoneNumber = index.reauthenticateWithPhoneNumber;
exports.reload = index.reload;
exports.revokeAccessToken = index.revokeAccessToken;
exports.sendEmailVerification = index.sendEmailVerification;
exports.sendPasswordResetEmail = index.sendPasswordResetEmail;
exports.sendSignInLinkToEmail = index.sendSignInLinkToEmail;
exports.setPersistence = index.setPersistence;
exports.signInAnonymously = index.signInAnonymously;
exports.signInWithCredential = index.signInWithCredential;
exports.signInWithCustomToken = index.signInWithCustomToken;
exports.signInWithEmailAndPassword = index.signInWithEmailAndPassword;
exports.signInWithEmailLink = index.signInWithEmailLink;
exports.signInWithPhoneNumber = index.signInWithPhoneNumber;
exports.signOut = index.signOut;
exports.unlink = index.unlink;
exports.updateCurrentUser = index.updateCurrentUser;
exports.updateEmail = index.updateEmail;
exports.updatePassword = index.updatePassword;
exports.updatePhoneNumber = index.updatePhoneNumber;
exports.updateProfile = index.updateProfile;
exports.useDeviceLanguage = index.useDeviceLanguage;
exports.validatePassword = index.validatePassword;
exports.verifyBeforeUpdateEmail = index.verifyBeforeUpdateEmail;
exports.verifyPasswordResetCode = index.verifyPasswordResetCode;
exports.AuthPopup = AuthPopup;
exports._generateEventId = _generateEventId;
exports._getRedirectResult = _getRedirectResult;
exports._overrideRedirectResult = _overrideRedirectResult;
exports.addFrameworkForLogging = addFrameworkForLogging;
exports.browserLocalPersistence = browserLocalPersistence;
exports.browserPopupRedirectResolver = browserPopupRedirectResolver;
exports.browserSessionPersistence = browserSessionPersistence;
exports.cordovaPopupRedirectResolver = cordovaPopupRedirectResolver;
exports.getAuth = getAuth;
exports.getRedirectResult = getRedirectResult;
exports.indexedDBLocalPersistence = indexedDBLocalPersistence;
exports.linkWithPopup = linkWithPopup;
exports.linkWithRedirect = linkWithRedirect;
exports.reauthenticateWithPopup = reauthenticateWithPopup;
exports.reauthenticateWithRedirect = reauthenticateWithRedirect;
exports.signInWithPopup = signInWithPopup;
exports.signInWithRedirect = signInWithRedirect;
//# sourceMappingURL=internal.js.map
