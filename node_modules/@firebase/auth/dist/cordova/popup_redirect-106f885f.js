import { __awaiter, __generator, __spreadArray, __assign, __rest, __extends } from 'tslib';
import { ErrorFactory, isBrowserExtension, isMobileCordova, isReactNative, FirebaseError, querystring, getModularInstance, base64Decode, isIE, getUA, createSubscribe, deepEqual, querystringDecode, extractQuerystring, isEmpty } from '@firebase/util';
import { SDK_VERSION, _getProvider, _registerComponent, registerVersion } from '@firebase/app';
import { Component } from '@firebase/component';
import { Logger, LogLevel } from '@firebase/logger';

var STORAGE_AVAILABLE_KEY = '__sak';

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
    return Promise.all(promises.map(function (promise) { return __awaiter(_this, void 0, void 0, function () {
        var value, reason_1;
        return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var messageEvent, _a, eventId, eventType, data, handlers, promises, response;
            var _this = this;
            return __generator(this, function (_b) {
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
                        promises = Array.from(handlers).map(function (handler) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var messageChannel, completionTimer, handler;
            var _this = this;
            return __generator(this, function (_a) {
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
 * Lazy accessor for window, since the compat layer won't tree shake this out,
 * we need to make sure not to mess with window unless we have to
 */
function _window() {
    return window;
}
function _setWindowLocation(url) {
    _window().location.href = url;
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
function _isWorker() {
    return (typeof _window()['WorkerGlobalScope'] !== 'undefined' &&
        typeof _window()['importScripts'] === 'function');
}
function _getActiveServiceWorker() {
    return __awaiter(this, void 0, void 0, function () {
        var registration;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker)) {
                        return [2 /*return*/, null];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, navigator.serviceWorker.ready];
                case 2:
                    registration = _b.sent();
                    return [2 /*return*/, registration.active];
                case 3:
                    _b.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function _getServiceWorkerController() {
    var _a;
    return ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) === null || _a === void 0 ? void 0 : _a.controller) || null;
}
function _getWorkerGlobalScope() {
    return _isWorker() ? self : null;
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
        request.addEventListener('success', function () { return __awaiter(_this, void 0, void 0, function () {
            var db, _a;
            return __generator(this, function (_b) {
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
    return __awaiter(this, void 0, void 0, function () {
        var request;
        var _a;
        return __generator(this, function (_b) {
            request = getObjectStore(db, true).put((_a = {},
                _a[DB_DATA_KEYPATH] = key,
                _a.value = value,
                _a));
            return [2 /*return*/, new DBPromise(request).toPromise()];
        });
    });
}
function getObject(db, key) {
    return __awaiter(this, void 0, void 0, function () {
        var request, data;
        return __generator(this, function (_a) {
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
var _POLLING_INTERVAL_MS$1 = 800;
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
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            var numAttempts, db, e_1;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, _isWorker() ? this.initializeReceiver() : this.initializeSender()];
            });
        });
    };
    /**
     * As the worker we should listen to events from the main window.
     */
    IndexedDBLocalPersistence.prototype.initializeReceiver = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
                // Refresh from persistence if we receive a KeyChanged message.
                this.receiver._subscribe("keyChanged" /* _EventType.KEY_CHANGED */, function (_origin, data) { return __awaiter(_this, void 0, void 0, function () {
                    var keys;
                    return __generator(this, function (_a) {
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
                this.receiver._subscribe("ping" /* _EventType.PING */, function (_origin, _data) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _c, results;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Check to see if there's an active service worker.
                        _c = this;
                        return [4 /*yield*/, _getActiveServiceWorker()];
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.sender ||
                            !this.activeServiceWorker ||
                            _getServiceWorkerController() !== this.activeServiceWorker) {
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
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!indexedDB) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, _openDatabase()];
                    case 1:
                        db = _b.sent();
                        return [4 /*yield*/, _putObject(db, STORAGE_AVAILABLE_KEY, '1')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, _deleteObject(db, STORAGE_AVAILABLE_KEY)];
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this._withPendingWrite(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this._withPendingWrite(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var result, keys, keysInResult, _i, result_1, _a, key, value, _b, _c, localKey;
            return __generator(this, function (_d) {
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
        this.pollTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this._poll()];
        }); }); }, _POLLING_INTERVAL_MS$1);
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
function _debugErrorMap() {
    var _a;
    return _a = {},
        _a["admin-restricted-operation" /* AuthErrorCode.ADMIN_ONLY_OPERATION */] = 'This operation is restricted to administrators only.',
        _a["argument-error" /* AuthErrorCode.ARGUMENT_ERROR */] = '',
        _a["app-not-authorized" /* AuthErrorCode.APP_NOT_AUTHORIZED */] = "This app, identified by the domain where it's hosted, is not " +
            'authorized to use Firebase Authentication with the provided API key. ' +
            'Review your key configuration in the Google API console.',
        _a["app-not-installed" /* AuthErrorCode.APP_NOT_INSTALLED */] = 'The requested mobile application corresponding to the identifier (' +
            'Android package name or iOS bundle ID) provided is not installed on ' +
            'this device.',
        _a["captcha-check-failed" /* AuthErrorCode.CAPTCHA_CHECK_FAILED */] = 'The reCAPTCHA response token provided is either invalid, expired, ' +
            'already used or the domain associated with it does not match the list ' +
            'of whitelisted domains.',
        _a["code-expired" /* AuthErrorCode.CODE_EXPIRED */] = 'The SMS code has expired. Please re-send the verification code to try ' +
            'again.',
        _a["cordova-not-ready" /* AuthErrorCode.CORDOVA_NOT_READY */] = 'Cordova framework is not ready.',
        _a["cors-unsupported" /* AuthErrorCode.CORS_UNSUPPORTED */] = 'This browser is not supported.',
        _a["credential-already-in-use" /* AuthErrorCode.CREDENTIAL_ALREADY_IN_USE */] = 'This credential is already associated with a different user account.',
        _a["custom-token-mismatch" /* AuthErrorCode.CREDENTIAL_MISMATCH */] = 'The custom token corresponds to a different audience.',
        _a["requires-recent-login" /* AuthErrorCode.CREDENTIAL_TOO_OLD_LOGIN_AGAIN */] = 'This operation is sensitive and requires recent authentication. Log in ' +
            'again before retrying this request.',
        _a["dependent-sdk-initialized-before-auth" /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */] = 'Another Firebase SDK was initialized and is trying to use Auth before Auth is ' +
            'initialized. Please be sure to call `initializeAuth` or `getAuth` before ' +
            'starting any other Firebase SDK.',
        _a["dynamic-link-not-activated" /* AuthErrorCode.DYNAMIC_LINK_NOT_ACTIVATED */] = 'Please activate Dynamic Links in the Firebase Console and agree to the terms and ' +
            'conditions.',
        _a["email-change-needs-verification" /* AuthErrorCode.EMAIL_CHANGE_NEEDS_VERIFICATION */] = 'Multi-factor users must always have a verified email.',
        _a["email-already-in-use" /* AuthErrorCode.EMAIL_EXISTS */] = 'The email address is already in use by another account.',
        _a["emulator-config-failed" /* AuthErrorCode.EMULATOR_CONFIG_FAILED */] = 'Auth instance has already been used to make a network call. Auth can ' +
            'no longer be configured to use the emulator. Try calling ' +
            '"connectAuthEmulator()" sooner.',
        _a["expired-action-code" /* AuthErrorCode.EXPIRED_OOB_CODE */] = 'The action code has expired.',
        _a["cancelled-popup-request" /* AuthErrorCode.EXPIRED_POPUP_REQUEST */] = 'This operation has been cancelled due to another conflicting popup being opened.',
        _a["internal-error" /* AuthErrorCode.INTERNAL_ERROR */] = 'An internal AuthError has occurred.',
        _a["invalid-app-credential" /* AuthErrorCode.INVALID_APP_CREDENTIAL */] = 'The phone verification request contains an invalid application verifier.' +
            ' The reCAPTCHA token response is either invalid or expired.',
        _a["invalid-app-id" /* AuthErrorCode.INVALID_APP_ID */] = 'The mobile app identifier is not registed for the current project.',
        _a["invalid-user-token" /* AuthErrorCode.INVALID_AUTH */] = "This user's credential isn't valid for this project. This can happen " +
            "if the user's token has been tampered with, or if the user isn't for " +
            'the project associated with this API key.',
        _a["invalid-auth-event" /* AuthErrorCode.INVALID_AUTH_EVENT */] = 'An internal AuthError has occurred.',
        _a["invalid-verification-code" /* AuthErrorCode.INVALID_CODE */] = 'The SMS verification code used to create the phone auth credential is ' +
            'invalid. Please resend the verification code sms and be sure to use the ' +
            'verification code provided by the user.',
        _a["invalid-continue-uri" /* AuthErrorCode.INVALID_CONTINUE_URI */] = 'The continue URL provided in the request is invalid.',
        _a["invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */] = 'The following Cordova plugins must be installed to enable OAuth sign-in: ' +
            'cordova-plugin-buildinfo, cordova-universal-links-plugin, ' +
            'cordova-plugin-browsertab, cordova-plugin-inappbrowser and ' +
            'cordova-plugin-customurlscheme.',
        _a["invalid-custom-token" /* AuthErrorCode.INVALID_CUSTOM_TOKEN */] = 'The custom token format is incorrect. Please check the documentation.',
        _a["invalid-dynamic-link-domain" /* AuthErrorCode.INVALID_DYNAMIC_LINK_DOMAIN */] = 'The provided dynamic link domain is not configured or authorized for the current project.',
        _a["invalid-email" /* AuthErrorCode.INVALID_EMAIL */] = 'The email address is badly formatted.',
        _a["invalid-emulator-scheme" /* AuthErrorCode.INVALID_EMULATOR_SCHEME */] = 'Emulator URL must start with a valid scheme (http:// or https://).',
        _a["invalid-api-key" /* AuthErrorCode.INVALID_API_KEY */] = 'Your API key is invalid, please check you have copied it correctly.',
        _a["invalid-cert-hash" /* AuthErrorCode.INVALID_CERT_HASH */] = 'The SHA-1 certificate hash provided is invalid.',
        _a["invalid-credential" /* AuthErrorCode.INVALID_CREDENTIAL */] = 'The supplied auth credential is incorrect, malformed or has expired.',
        _a["invalid-message-payload" /* AuthErrorCode.INVALID_MESSAGE_PAYLOAD */] = 'The email template corresponding to this action contains invalid characters in its message. ' +
            'Please fix by going to the Auth email templates section in the Firebase Console.',
        _a["invalid-multi-factor-session" /* AuthErrorCode.INVALID_MFA_SESSION */] = 'The request does not contain a valid proof of first factor successful sign-in.',
        _a["invalid-oauth-provider" /* AuthErrorCode.INVALID_OAUTH_PROVIDER */] = 'EmailAuthProvider is not supported for this operation. This operation ' +
            'only supports OAuth providers.',
        _a["invalid-oauth-client-id" /* AuthErrorCode.INVALID_OAUTH_CLIENT_ID */] = 'The OAuth client ID provided is either invalid or does not match the ' +
            'specified API key.',
        _a["unauthorized-domain" /* AuthErrorCode.INVALID_ORIGIN */] = 'This domain is not authorized for OAuth operations for your Firebase ' +
            'project. Edit the list of authorized domains from the Firebase console.',
        _a["invalid-action-code" /* AuthErrorCode.INVALID_OOB_CODE */] = 'The action code is invalid. This can happen if the code is malformed, ' +
            'expired, or has already been used.',
        _a["wrong-password" /* AuthErrorCode.INVALID_PASSWORD */] = 'The password is invalid or the user does not have a password.',
        _a["invalid-persistence-type" /* AuthErrorCode.INVALID_PERSISTENCE */] = 'The specified persistence type is invalid. It can only be local, session or none.',
        _a["invalid-phone-number" /* AuthErrorCode.INVALID_PHONE_NUMBER */] = 'The format of the phone number provided is incorrect. Please enter the ' +
            'phone number in a format that can be parsed into E.164 format. E.164 ' +
            'phone numbers are written in the format [+][country code][subscriber ' +
            'number including area code].',
        _a["invalid-provider-id" /* AuthErrorCode.INVALID_PROVIDER_ID */] = 'The specified provider ID is invalid.',
        _a["invalid-recipient-email" /* AuthErrorCode.INVALID_RECIPIENT_EMAIL */] = 'The email corresponding to this action failed to send as the provided ' +
            'recipient email address is invalid.',
        _a["invalid-sender" /* AuthErrorCode.INVALID_SENDER */] = 'The email template corresponding to this action contains an invalid sender email or name. ' +
            'Please fix by going to the Auth email templates section in the Firebase Console.',
        _a["invalid-verification-id" /* AuthErrorCode.INVALID_SESSION_INFO */] = 'The verification ID used to create the phone auth credential is invalid.',
        _a["invalid-tenant-id" /* AuthErrorCode.INVALID_TENANT_ID */] = "The Auth instance's tenant ID is invalid.",
        _a["login-blocked" /* AuthErrorCode.LOGIN_BLOCKED */] = 'Login blocked by user-provided method: {$originalMessage}',
        _a["missing-android-pkg-name" /* AuthErrorCode.MISSING_ANDROID_PACKAGE_NAME */] = 'An Android Package Name must be provided if the Android App is required to be installed.',
        _a["auth-domain-config-required" /* AuthErrorCode.MISSING_AUTH_DOMAIN */] = 'Be sure to include authDomain when calling firebase.initializeApp(), ' +
            'by following the instructions in the Firebase console.',
        _a["missing-app-credential" /* AuthErrorCode.MISSING_APP_CREDENTIAL */] = 'The phone verification request is missing an application verifier ' +
            'assertion. A reCAPTCHA response token needs to be provided.',
        _a["missing-verification-code" /* AuthErrorCode.MISSING_CODE */] = 'The phone auth credential was created with an empty SMS verification code.',
        _a["missing-continue-uri" /* AuthErrorCode.MISSING_CONTINUE_URI */] = 'A continue URL must be provided in the request.',
        _a["missing-iframe-start" /* AuthErrorCode.MISSING_IFRAME_START */] = 'An internal AuthError has occurred.',
        _a["missing-ios-bundle-id" /* AuthErrorCode.MISSING_IOS_BUNDLE_ID */] = 'An iOS Bundle ID must be provided if an App Store ID is provided.',
        _a["missing-or-invalid-nonce" /* AuthErrorCode.MISSING_OR_INVALID_NONCE */] = 'The request does not contain a valid nonce. This can occur if the ' +
            'SHA-256 hash of the provided raw nonce does not match the hashed nonce ' +
            'in the ID token payload.',
        _a["missing-password" /* AuthErrorCode.MISSING_PASSWORD */] = 'A non-empty password must be provided',
        _a["missing-multi-factor-info" /* AuthErrorCode.MISSING_MFA_INFO */] = 'No second factor identifier is provided.',
        _a["missing-multi-factor-session" /* AuthErrorCode.MISSING_MFA_SESSION */] = 'The request is missing proof of first factor successful sign-in.',
        _a["missing-phone-number" /* AuthErrorCode.MISSING_PHONE_NUMBER */] = 'To send verification codes, provide a phone number for the recipient.',
        _a["missing-verification-id" /* AuthErrorCode.MISSING_SESSION_INFO */] = 'The phone auth credential was created with an empty verification ID.',
        _a["app-deleted" /* AuthErrorCode.MODULE_DESTROYED */] = 'This instance of FirebaseApp has been deleted.',
        _a["multi-factor-info-not-found" /* AuthErrorCode.MFA_INFO_NOT_FOUND */] = 'The user does not have a second factor matching the identifier provided.',
        _a["multi-factor-auth-required" /* AuthErrorCode.MFA_REQUIRED */] = 'Proof of ownership of a second factor is required to complete sign-in.',
        _a["account-exists-with-different-credential" /* AuthErrorCode.NEED_CONFIRMATION */] = 'An account already exists with the same email address but different ' +
            'sign-in credentials. Sign in using a provider associated with this ' +
            'email address.',
        _a["network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */] = 'A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.',
        _a["no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */] = 'An internal AuthError has occurred.',
        _a["no-such-provider" /* AuthErrorCode.NO_SUCH_PROVIDER */] = 'User was not linked to an account with the given provider.',
        _a["null-user" /* AuthErrorCode.NULL_USER */] = 'A null user object was provided as the argument for an operation which ' +
            'requires a non-null user object.',
        _a["operation-not-allowed" /* AuthErrorCode.OPERATION_NOT_ALLOWED */] = 'The given sign-in provider is disabled for this Firebase project. ' +
            'Enable it in the Firebase console, under the sign-in method tab of the ' +
            'Auth section.',
        _a["operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */] = 'This operation is not supported in the environment this application is ' +
            'running on. "location.protocol" must be http, https or chrome-extension' +
            ' and web storage must be enabled.',
        _a["popup-blocked" /* AuthErrorCode.POPUP_BLOCKED */] = 'Unable to establish a connection with the popup. It may have been blocked by the browser.',
        _a["popup-closed-by-user" /* AuthErrorCode.POPUP_CLOSED_BY_USER */] = 'The popup has been closed by the user before finalizing the operation.',
        _a["provider-already-linked" /* AuthErrorCode.PROVIDER_ALREADY_LINKED */] = 'User can only be linked to one identity for the given provider.',
        _a["quota-exceeded" /* AuthErrorCode.QUOTA_EXCEEDED */] = "The project's quota for this operation has been exceeded.",
        _a["redirect-cancelled-by-user" /* AuthErrorCode.REDIRECT_CANCELLED_BY_USER */] = 'The redirect operation has been cancelled by the user before finalizing.',
        _a["redirect-operation-pending" /* AuthErrorCode.REDIRECT_OPERATION_PENDING */] = 'A redirect sign-in operation is already pending.',
        _a["rejected-credential" /* AuthErrorCode.REJECTED_CREDENTIAL */] = 'The request contains malformed or mismatching credentials.',
        _a["second-factor-already-in-use" /* AuthErrorCode.SECOND_FACTOR_ALREADY_ENROLLED */] = 'The second factor is already enrolled on this account.',
        _a["maximum-second-factor-count-exceeded" /* AuthErrorCode.SECOND_FACTOR_LIMIT_EXCEEDED */] = 'The maximum allowed number of second factors on a user has been exceeded.',
        _a["tenant-id-mismatch" /* AuthErrorCode.TENANT_ID_MISMATCH */] = "The provided tenant ID does not match the Auth instance's tenant ID",
        _a["timeout" /* AuthErrorCode.TIMEOUT */] = 'The operation has timed out.',
        _a["user-token-expired" /* AuthErrorCode.TOKEN_EXPIRED */] = "The user's credential is no longer valid. The user must sign in again.",
        _a["too-many-requests" /* AuthErrorCode.TOO_MANY_ATTEMPTS_TRY_LATER */] = 'We have blocked all requests from this device due to unusual activity. ' +
            'Try again later.',
        _a["unauthorized-continue-uri" /* AuthErrorCode.UNAUTHORIZED_DOMAIN */] = 'The domain of the continue URL is not whitelisted.  Please whitelist ' +
            'the domain in the Firebase console.',
        _a["unsupported-first-factor" /* AuthErrorCode.UNSUPPORTED_FIRST_FACTOR */] = 'Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.',
        _a["unsupported-persistence-type" /* AuthErrorCode.UNSUPPORTED_PERSISTENCE */] = 'The current environment does not support the specified persistence type.',
        _a["unsupported-tenant-operation" /* AuthErrorCode.UNSUPPORTED_TENANT_OPERATION */] = 'This operation is not supported in a multi-tenant context.',
        _a["unverified-email" /* AuthErrorCode.UNVERIFIED_EMAIL */] = 'The operation requires a verified email.',
        _a["user-cancelled" /* AuthErrorCode.USER_CANCELLED */] = 'The user did not grant your application the permissions it requested.',
        _a["user-not-found" /* AuthErrorCode.USER_DELETED */] = 'There is no user record corresponding to this identifier. The user may ' +
            'have been deleted.',
        _a["user-disabled" /* AuthErrorCode.USER_DISABLED */] = 'The user account has been disabled by an administrator.',
        _a["user-mismatch" /* AuthErrorCode.USER_MISMATCH */] = 'The supplied credentials do not correspond to the previously signed in user.',
        _a["user-signed-out" /* AuthErrorCode.USER_SIGNED_OUT */] = '',
        _a["weak-password" /* AuthErrorCode.WEAK_PASSWORD */] = 'The password must be 6 characters long or more.',
        _a["web-storage-unsupported" /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */] = 'This browser is not supported or 3rd party cookies and data may be disabled.',
        _a["already-initialized" /* AuthErrorCode.ALREADY_INITIALIZED */] = 'initializeAuth() has already been called with ' +
            'different options. To avoid this error, call initializeAuth() with the ' +
            'same options as when it was originally called, or call getAuth() to return the' +
            ' already initialized instance.',
        _a["missing-recaptcha-token" /* AuthErrorCode.MISSING_RECAPTCHA_TOKEN */] = 'The reCAPTCHA token is missing when sending request to the backend.',
        _a["invalid-recaptcha-token" /* AuthErrorCode.INVALID_RECAPTCHA_TOKEN */] = 'The reCAPTCHA token is invalid when sending request to the backend.',
        _a["invalid-recaptcha-action" /* AuthErrorCode.INVALID_RECAPTCHA_ACTION */] = 'The reCAPTCHA action is invalid when sending request to the backend.',
        _a["recaptcha-not-enabled" /* AuthErrorCode.RECAPTCHA_NOT_ENABLED */] = 'reCAPTCHA Enterprise integration is not enabled for this project.',
        _a["missing-client-type" /* AuthErrorCode.MISSING_CLIENT_TYPE */] = 'The reCAPTCHA client type is missing when sending request to the backend.',
        _a["missing-recaptcha-version" /* AuthErrorCode.MISSING_RECAPTCHA_VERSION */] = 'The reCAPTCHA version is missing when sending request to the backend.',
        _a["invalid-req-type" /* AuthErrorCode.INVALID_REQ_TYPE */] = 'Invalid request parameters.',
        _a["invalid-recaptcha-version" /* AuthErrorCode.INVALID_RECAPTCHA_VERSION */] = 'The reCAPTCHA version is invalid when sending request to the backend.',
        _a["unsupported-password-policy-schema-version" /* AuthErrorCode.UNSUPPORTED_PASSWORD_POLICY_SCHEMA_VERSION */] = 'The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.',
        _a["password-does-not-meet-requirements" /* AuthErrorCode.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */] = 'The password does not meet the requirements.',
        _a;
}
function _prodErrorMap() {
    var _a;
    // We will include this one message in the prod error map since by the very
    // nature of this error, developers will never be able to see the message
    // using the debugErrorMap (which is installed during auth initialization).
    return _a = {},
        _a["dependent-sdk-initialized-before-auth" /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */] = 'Another Firebase SDK was initialized and is trying to use Auth before Auth is ' +
            'initialized. Please be sure to call `initializeAuth` or `getAuth` before ' +
            'starting any other Firebase SDK.',
        _a;
}
/**
 * A verbose error map with detailed descriptions for most error codes.
 *
 * See discussion at {@link AuthErrorMap}
 *
 * @public
 */
var debugErrorMap = _debugErrorMap;
/**
 * A minimal error map with all verbose error messages stripped.
 *
 * See discussion at {@link AuthErrorMap}
 *
 * @public
 */
var prodErrorMap = _prodErrorMap;
var _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory('auth', 'Firebase', _prodErrorMap());
/**
 * A map of potential `Auth` error codes, for easier comparison with errors
 * thrown by the SDK.
 *
 * @remarks
 * Note that you can't tree-shake individual keys
 * in the map, so by using the map you might substantially increase your
 * bundle size.
 *
 * @public
 */
var AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY = {
    ADMIN_ONLY_OPERATION: 'auth/admin-restricted-operation',
    ARGUMENT_ERROR: 'auth/argument-error',
    APP_NOT_AUTHORIZED: 'auth/app-not-authorized',
    APP_NOT_INSTALLED: 'auth/app-not-installed',
    CAPTCHA_CHECK_FAILED: 'auth/captcha-check-failed',
    CODE_EXPIRED: 'auth/code-expired',
    CORDOVA_NOT_READY: 'auth/cordova-not-ready',
    CORS_UNSUPPORTED: 'auth/cors-unsupported',
    CREDENTIAL_ALREADY_IN_USE: 'auth/credential-already-in-use',
    CREDENTIAL_MISMATCH: 'auth/custom-token-mismatch',
    CREDENTIAL_TOO_OLD_LOGIN_AGAIN: 'auth/requires-recent-login',
    DEPENDENT_SDK_INIT_BEFORE_AUTH: 'auth/dependent-sdk-initialized-before-auth',
    DYNAMIC_LINK_NOT_ACTIVATED: 'auth/dynamic-link-not-activated',
    EMAIL_CHANGE_NEEDS_VERIFICATION: 'auth/email-change-needs-verification',
    EMAIL_EXISTS: 'auth/email-already-in-use',
    EMULATOR_CONFIG_FAILED: 'auth/emulator-config-failed',
    EXPIRED_OOB_CODE: 'auth/expired-action-code',
    EXPIRED_POPUP_REQUEST: 'auth/cancelled-popup-request',
    INTERNAL_ERROR: 'auth/internal-error',
    INVALID_API_KEY: 'auth/invalid-api-key',
    INVALID_APP_CREDENTIAL: 'auth/invalid-app-credential',
    INVALID_APP_ID: 'auth/invalid-app-id',
    INVALID_AUTH: 'auth/invalid-user-token',
    INVALID_AUTH_EVENT: 'auth/invalid-auth-event',
    INVALID_CERT_HASH: 'auth/invalid-cert-hash',
    INVALID_CODE: 'auth/invalid-verification-code',
    INVALID_CONTINUE_URI: 'auth/invalid-continue-uri',
    INVALID_CORDOVA_CONFIGURATION: 'auth/invalid-cordova-configuration',
    INVALID_CUSTOM_TOKEN: 'auth/invalid-custom-token',
    INVALID_DYNAMIC_LINK_DOMAIN: 'auth/invalid-dynamic-link-domain',
    INVALID_EMAIL: 'auth/invalid-email',
    INVALID_EMULATOR_SCHEME: 'auth/invalid-emulator-scheme',
    INVALID_IDP_RESPONSE: 'auth/invalid-credential',
    INVALID_LOGIN_CREDENTIALS: 'auth/invalid-credential',
    INVALID_MESSAGE_PAYLOAD: 'auth/invalid-message-payload',
    INVALID_MFA_SESSION: 'auth/invalid-multi-factor-session',
    INVALID_OAUTH_CLIENT_ID: 'auth/invalid-oauth-client-id',
    INVALID_OAUTH_PROVIDER: 'auth/invalid-oauth-provider',
    INVALID_OOB_CODE: 'auth/invalid-action-code',
    INVALID_ORIGIN: 'auth/unauthorized-domain',
    INVALID_PASSWORD: 'auth/wrong-password',
    INVALID_PERSISTENCE: 'auth/invalid-persistence-type',
    INVALID_PHONE_NUMBER: 'auth/invalid-phone-number',
    INVALID_PROVIDER_ID: 'auth/invalid-provider-id',
    INVALID_RECIPIENT_EMAIL: 'auth/invalid-recipient-email',
    INVALID_SENDER: 'auth/invalid-sender',
    INVALID_SESSION_INFO: 'auth/invalid-verification-id',
    INVALID_TENANT_ID: 'auth/invalid-tenant-id',
    MFA_INFO_NOT_FOUND: 'auth/multi-factor-info-not-found',
    MFA_REQUIRED: 'auth/multi-factor-auth-required',
    MISSING_ANDROID_PACKAGE_NAME: 'auth/missing-android-pkg-name',
    MISSING_APP_CREDENTIAL: 'auth/missing-app-credential',
    MISSING_AUTH_DOMAIN: 'auth/auth-domain-config-required',
    MISSING_CODE: 'auth/missing-verification-code',
    MISSING_CONTINUE_URI: 'auth/missing-continue-uri',
    MISSING_IFRAME_START: 'auth/missing-iframe-start',
    MISSING_IOS_BUNDLE_ID: 'auth/missing-ios-bundle-id',
    MISSING_OR_INVALID_NONCE: 'auth/missing-or-invalid-nonce',
    MISSING_MFA_INFO: 'auth/missing-multi-factor-info',
    MISSING_MFA_SESSION: 'auth/missing-multi-factor-session',
    MISSING_PHONE_NUMBER: 'auth/missing-phone-number',
    MISSING_SESSION_INFO: 'auth/missing-verification-id',
    MODULE_DESTROYED: 'auth/app-deleted',
    NEED_CONFIRMATION: 'auth/account-exists-with-different-credential',
    NETWORK_REQUEST_FAILED: 'auth/network-request-failed',
    NULL_USER: 'auth/null-user',
    NO_AUTH_EVENT: 'auth/no-auth-event',
    NO_SUCH_PROVIDER: 'auth/no-such-provider',
    OPERATION_NOT_ALLOWED: 'auth/operation-not-allowed',
    OPERATION_NOT_SUPPORTED: 'auth/operation-not-supported-in-this-environment',
    POPUP_BLOCKED: 'auth/popup-blocked',
    POPUP_CLOSED_BY_USER: 'auth/popup-closed-by-user',
    PROVIDER_ALREADY_LINKED: 'auth/provider-already-linked',
    QUOTA_EXCEEDED: 'auth/quota-exceeded',
    REDIRECT_CANCELLED_BY_USER: 'auth/redirect-cancelled-by-user',
    REDIRECT_OPERATION_PENDING: 'auth/redirect-operation-pending',
    REJECTED_CREDENTIAL: 'auth/rejected-credential',
    SECOND_FACTOR_ALREADY_ENROLLED: 'auth/second-factor-already-in-use',
    SECOND_FACTOR_LIMIT_EXCEEDED: 'auth/maximum-second-factor-count-exceeded',
    TENANT_ID_MISMATCH: 'auth/tenant-id-mismatch',
    TIMEOUT: 'auth/timeout',
    TOKEN_EXPIRED: 'auth/user-token-expired',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'auth/too-many-requests',
    UNAUTHORIZED_DOMAIN: 'auth/unauthorized-continue-uri',
    UNSUPPORTED_FIRST_FACTOR: 'auth/unsupported-first-factor',
    UNSUPPORTED_PERSISTENCE: 'auth/unsupported-persistence-type',
    UNSUPPORTED_TENANT_OPERATION: 'auth/unsupported-tenant-operation',
    UNVERIFIED_EMAIL: 'auth/unverified-email',
    USER_CANCELLED: 'auth/user-cancelled',
    USER_DELETED: 'auth/user-not-found',
    USER_DISABLED: 'auth/user-disabled',
    USER_MISMATCH: 'auth/user-mismatch',
    USER_SIGNED_OUT: 'auth/user-signed-out',
    WEAK_PASSWORD: 'auth/weak-password',
    WEB_STORAGE_UNSUPPORTED: 'auth/web-storage-unsupported',
    ALREADY_INITIALIZED: 'auth/already-initialized',
    RECAPTCHA_NOT_ENABLED: 'auth/recaptcha-not-enabled',
    MISSING_RECAPTCHA_TOKEN: 'auth/missing-recaptcha-token',
    INVALID_RECAPTCHA_TOKEN: 'auth/invalid-recaptcha-token',
    INVALID_RECAPTCHA_ACTION: 'auth/invalid-recaptcha-action',
    MISSING_CLIENT_TYPE: 'auth/missing-client-type',
    MISSING_RECAPTCHA_VERSION: 'auth/missing-recaptcha-version',
    INVALID_RECAPTCHA_VERSION: 'auth/invalid-recaptcha-version',
    INVALID_REQ_TYPE: 'auth/invalid-req-type'
};

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
var logClient = new Logger('@firebase/auth');
function _logWarn(msg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (logClient.logLevel <= LogLevel.WARN) {
        logClient.warn.apply(logClient, __spreadArray(["Auth (".concat(SDK_VERSION, "): ").concat(msg)], args, false));
    }
}
function _logError(msg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (logClient.logLevel <= LogLevel.ERROR) {
        logClient.error.apply(logClient, __spreadArray(["Auth (".concat(SDK_VERSION, "): ").concat(msg)], args, false));
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
function _fail(authOrCode) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    throw createErrorInternal.apply(void 0, __spreadArray([authOrCode], rest, false));
}
function _createError(authOrCode) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    return createErrorInternal.apply(void 0, __spreadArray([authOrCode], rest, false));
}
function _errorWithCustomMessage(auth, code, message) {
    var _a;
    var errorMap = __assign(__assign({}, prodErrorMap()), (_a = {}, _a[code] = message, _a));
    var factory = new ErrorFactory('auth', 'Firebase', errorMap);
    return factory.create(code, {
        appName: auth.name
    });
}
function _assertInstanceOf(auth, object, instance) {
    var constructorInstance = instance;
    if (!(object instanceof constructorInstance)) {
        if (constructorInstance.name !== object.constructor.name) {
            _fail(auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        }
        throw _errorWithCustomMessage(auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */, "Type of ".concat(object.constructor.name, " does not match expected instance.") +
            "Did you pass a reference from a different Auth SDK?");
    }
}
function createErrorInternal(authOrCode) {
    var _a;
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    if (typeof authOrCode !== 'string') {
        var code = rest[0];
        var fullParams = __spreadArray([], rest.slice(1), true);
        if (fullParams[0]) {
            fullParams[0].appName = authOrCode.name;
        }
        return (_a = authOrCode._errorFactory).create.apply(_a, __spreadArray([code], fullParams, false));
    }
    return _DEFAULT_AUTH_ERROR_FACTORY.create.apply(_DEFAULT_AUTH_ERROR_FACTORY, __spreadArray([authOrCode], rest, false));
}
function _assert(assertion, authOrCode) {
    var rest = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        rest[_i - 2] = arguments[_i];
    }
    if (!assertion) {
        throw createErrorInternal.apply(void 0, __spreadArray([authOrCode], rest, false));
    }
}
/**
 * Unconditionally fails, throwing an internal error with the given message.
 *
 * @param failure type of failure encountered
 * @throws Error
 */
function debugFail(failure) {
    // Log the failure in addition to throw an exception, just in case the
    // exception is swallowed.
    var message = "INTERNAL ASSERTION FAILED: " + failure;
    _logError(message);
    // NOTE: We don't use FirebaseError here because these are internal failures
    // that cannot be handled by the user. (Also it would create a circular
    // dependency between the error and assert modules which doesn't work.)
    throw new Error(message);
}
/**
 * Fails if the given assertion condition is false, throwing an Error with the
 * given message if it did.
 *
 * @param assertion
 * @param message
 */
function debugAssert(assertion, message) {
    if (!assertion) {
        debugFail(message);
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
function _getCurrentUrl() {
    var _a;
    return (typeof self !== 'undefined' && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.href)) || '';
}
function _isHttpOrHttps() {
    return _getCurrentScheme() === 'http:' || _getCurrentScheme() === 'https:';
}
function _getCurrentScheme() {
    var _a;
    return (typeof self !== 'undefined' && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.protocol)) || null;
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
 * Determine whether the browser is working online
 */
function _isOnline() {
    if (typeof navigator !== 'undefined' &&
        navigator &&
        'onLine' in navigator &&
        typeof navigator.onLine === 'boolean' &&
        // Apply only for traditional web apps and Chrome extensions.
        // This is especially true for Cordova apps which have unreliable
        // navigator.onLine behavior unless cordova-plugin-network-information is
        // installed which overwrites the native navigator.onLine value and
        // defines navigator.connection.
        (_isHttpOrHttps() || isBrowserExtension() || 'connection' in navigator)) {
        return navigator.onLine;
    }
    // If we can't determine the state, assume it is online.
    return true;
}
function _getUserLanguage() {
    if (typeof navigator === 'undefined') {
        return null;
    }
    var navigatorLanguage = navigator;
    return (
    // Most reliable, but only supported in Chrome/Firefox.
    (navigatorLanguage.languages && navigatorLanguage.languages[0]) ||
        // Supported in most browsers, but returns the language of the browser
        // UI, not the language set in browser settings.
        navigatorLanguage.language ||
        // Couldn't determine language.
        null);
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
 * A structure to help pick between a range of long and short delay durations
 * depending on the current environment. In general, the long delay is used for
 * mobile environments whereas short delays are used for desktop environments.
 */
var Delay = /** @class */ (function () {
    function Delay(shortDelay, longDelay) {
        this.shortDelay = shortDelay;
        this.longDelay = longDelay;
        // Internal error when improperly initialized.
        debugAssert(longDelay > shortDelay, 'Short delay should be less than long delay!');
        this.isMobile = isMobileCordova() || isReactNative();
    }
    Delay.prototype.get = function () {
        if (!_isOnline()) {
            // Pick the shorter timeout.
            return Math.min(5000 /* DelayMin.OFFLINE */, this.shortDelay);
        }
        // If running in a mobile environment, return the long delay, otherwise
        // return the short delay.
        // This could be improved in the future to dynamically change based on other
        // variables instead of just reading the current environment.
        return this.isMobile ? this.longDelay : this.shortDelay;
    };
    return Delay;
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
function _emulatorUrl(config, path) {
    debugAssert(config.emulator, 'Emulator should always be set here');
    var url = config.emulator.url;
    if (!path) {
        return url;
    }
    return "".concat(url).concat(path.startsWith('/') ? path.slice(1) : path);
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
var FetchProvider = /** @class */ (function () {
    function FetchProvider() {
    }
    FetchProvider.initialize = function (fetchImpl, headersImpl, responseImpl) {
        this.fetchImpl = fetchImpl;
        if (headersImpl) {
            this.headersImpl = headersImpl;
        }
        if (responseImpl) {
            this.responseImpl = responseImpl;
        }
    };
    FetchProvider.fetch = function () {
        if (this.fetchImpl) {
            return this.fetchImpl;
        }
        if (typeof self !== 'undefined' && 'fetch' in self) {
            return self.fetch;
        }
        if (typeof globalThis !== 'undefined' && globalThis.fetch) {
            return globalThis.fetch;
        }
        if (typeof fetch !== 'undefined') {
            return fetch;
        }
        debugFail('Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill');
    };
    FetchProvider.headers = function () {
        if (this.headersImpl) {
            return this.headersImpl;
        }
        if (typeof self !== 'undefined' && 'Headers' in self) {
            return self.Headers;
        }
        if (typeof globalThis !== 'undefined' && globalThis.Headers) {
            return globalThis.Headers;
        }
        if (typeof Headers !== 'undefined') {
            return Headers;
        }
        debugFail('Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill');
    };
    FetchProvider.response = function () {
        if (this.responseImpl) {
            return this.responseImpl;
        }
        if (typeof self !== 'undefined' && 'Response' in self) {
            return self.Response;
        }
        if (typeof globalThis !== 'undefined' && globalThis.Response) {
            return globalThis.Response;
        }
        if (typeof Response !== 'undefined') {
            return Response;
        }
        debugFail('Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill');
    };
    return FetchProvider;
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
var _a$1;
/**
 * Map from errors returned by the server to errors to developer visible errors
 */
var SERVER_ERROR_MAP = (_a$1 = {},
    // Custom token errors.
    _a$1["CREDENTIAL_MISMATCH" /* ServerError.CREDENTIAL_MISMATCH */] = "custom-token-mismatch" /* AuthErrorCode.CREDENTIAL_MISMATCH */,
    // This can only happen if the SDK sends a bad request.
    _a$1["MISSING_CUSTOM_TOKEN" /* ServerError.MISSING_CUSTOM_TOKEN */] = "internal-error" /* AuthErrorCode.INTERNAL_ERROR */,
    // Create Auth URI errors.
    _a$1["INVALID_IDENTIFIER" /* ServerError.INVALID_IDENTIFIER */] = "invalid-email" /* AuthErrorCode.INVALID_EMAIL */,
    // This can only happen if the SDK sends a bad request.
    _a$1["MISSING_CONTINUE_URI" /* ServerError.MISSING_CONTINUE_URI */] = "internal-error" /* AuthErrorCode.INTERNAL_ERROR */,
    // Sign in with email and password errors (some apply to sign up too).
    _a$1["INVALID_PASSWORD" /* ServerError.INVALID_PASSWORD */] = "wrong-password" /* AuthErrorCode.INVALID_PASSWORD */,
    // This can only happen if the SDK sends a bad request.
    _a$1["MISSING_PASSWORD" /* ServerError.MISSING_PASSWORD */] = "missing-password" /* AuthErrorCode.MISSING_PASSWORD */,
    // Thrown if Email Enumeration Protection is enabled in the project and the email or password is
    // invalid.
    _a$1["INVALID_LOGIN_CREDENTIALS" /* ServerError.INVALID_LOGIN_CREDENTIALS */] = "invalid-credential" /* AuthErrorCode.INVALID_CREDENTIAL */,
    // Sign up with email and password errors.
    _a$1["EMAIL_EXISTS" /* ServerError.EMAIL_EXISTS */] = "email-already-in-use" /* AuthErrorCode.EMAIL_EXISTS */,
    _a$1["PASSWORD_LOGIN_DISABLED" /* ServerError.PASSWORD_LOGIN_DISABLED */] = "operation-not-allowed" /* AuthErrorCode.OPERATION_NOT_ALLOWED */,
    // Verify assertion for sign in with credential errors:
    _a$1["INVALID_IDP_RESPONSE" /* ServerError.INVALID_IDP_RESPONSE */] = "invalid-credential" /* AuthErrorCode.INVALID_CREDENTIAL */,
    _a$1["INVALID_PENDING_TOKEN" /* ServerError.INVALID_PENDING_TOKEN */] = "invalid-credential" /* AuthErrorCode.INVALID_CREDENTIAL */,
    _a$1["FEDERATED_USER_ID_ALREADY_LINKED" /* ServerError.FEDERATED_USER_ID_ALREADY_LINKED */] = "credential-already-in-use" /* AuthErrorCode.CREDENTIAL_ALREADY_IN_USE */,
    // This can only happen if the SDK sends a bad request.
    _a$1["MISSING_REQ_TYPE" /* ServerError.MISSING_REQ_TYPE */] = "internal-error" /* AuthErrorCode.INTERNAL_ERROR */,
    // Send Password reset email errors:
    _a$1["EMAIL_NOT_FOUND" /* ServerError.EMAIL_NOT_FOUND */] = "user-not-found" /* AuthErrorCode.USER_DELETED */,
    _a$1["RESET_PASSWORD_EXCEED_LIMIT" /* ServerError.RESET_PASSWORD_EXCEED_LIMIT */] = "too-many-requests" /* AuthErrorCode.TOO_MANY_ATTEMPTS_TRY_LATER */,
    _a$1["EXPIRED_OOB_CODE" /* ServerError.EXPIRED_OOB_CODE */] = "expired-action-code" /* AuthErrorCode.EXPIRED_OOB_CODE */,
    _a$1["INVALID_OOB_CODE" /* ServerError.INVALID_OOB_CODE */] = "invalid-action-code" /* AuthErrorCode.INVALID_OOB_CODE */,
    // This can only happen if the SDK sends a bad request.
    _a$1["MISSING_OOB_CODE" /* ServerError.MISSING_OOB_CODE */] = "internal-error" /* AuthErrorCode.INTERNAL_ERROR */,
    // Operations that require ID token in request:
    _a$1["CREDENTIAL_TOO_OLD_LOGIN_AGAIN" /* ServerError.CREDENTIAL_TOO_OLD_LOGIN_AGAIN */] = "requires-recent-login" /* AuthErrorCode.CREDENTIAL_TOO_OLD_LOGIN_AGAIN */,
    _a$1["INVALID_ID_TOKEN" /* ServerError.INVALID_ID_TOKEN */] = "invalid-user-token" /* AuthErrorCode.INVALID_AUTH */,
    _a$1["TOKEN_EXPIRED" /* ServerError.TOKEN_EXPIRED */] = "user-token-expired" /* AuthErrorCode.TOKEN_EXPIRED */,
    _a$1["USER_NOT_FOUND" /* ServerError.USER_NOT_FOUND */] = "user-token-expired" /* AuthErrorCode.TOKEN_EXPIRED */,
    // Other errors.
    _a$1["TOO_MANY_ATTEMPTS_TRY_LATER" /* ServerError.TOO_MANY_ATTEMPTS_TRY_LATER */] = "too-many-requests" /* AuthErrorCode.TOO_MANY_ATTEMPTS_TRY_LATER */,
    _a$1["PASSWORD_DOES_NOT_MEET_REQUIREMENTS" /* ServerError.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */] = "password-does-not-meet-requirements" /* AuthErrorCode.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */,
    // Phone Auth related errors.
    _a$1["INVALID_CODE" /* ServerError.INVALID_CODE */] = "invalid-verification-code" /* AuthErrorCode.INVALID_CODE */,
    _a$1["INVALID_SESSION_INFO" /* ServerError.INVALID_SESSION_INFO */] = "invalid-verification-id" /* AuthErrorCode.INVALID_SESSION_INFO */,
    _a$1["INVALID_TEMPORARY_PROOF" /* ServerError.INVALID_TEMPORARY_PROOF */] = "invalid-credential" /* AuthErrorCode.INVALID_CREDENTIAL */,
    _a$1["MISSING_SESSION_INFO" /* ServerError.MISSING_SESSION_INFO */] = "missing-verification-id" /* AuthErrorCode.MISSING_SESSION_INFO */,
    _a$1["SESSION_EXPIRED" /* ServerError.SESSION_EXPIRED */] = "code-expired" /* AuthErrorCode.CODE_EXPIRED */,
    // Other action code errors when additional settings passed.
    // MISSING_CONTINUE_URI is getting mapped to INTERNAL_ERROR above.
    // This is OK as this error will be caught by client side validation.
    _a$1["MISSING_ANDROID_PACKAGE_NAME" /* ServerError.MISSING_ANDROID_PACKAGE_NAME */] = "missing-android-pkg-name" /* AuthErrorCode.MISSING_ANDROID_PACKAGE_NAME */,
    _a$1["UNAUTHORIZED_DOMAIN" /* ServerError.UNAUTHORIZED_DOMAIN */] = "unauthorized-continue-uri" /* AuthErrorCode.UNAUTHORIZED_DOMAIN */,
    // getProjectConfig errors when clientId is passed.
    _a$1["INVALID_OAUTH_CLIENT_ID" /* ServerError.INVALID_OAUTH_CLIENT_ID */] = "invalid-oauth-client-id" /* AuthErrorCode.INVALID_OAUTH_CLIENT_ID */,
    // User actions (sign-up or deletion) disabled errors.
    _a$1["ADMIN_ONLY_OPERATION" /* ServerError.ADMIN_ONLY_OPERATION */] = "admin-restricted-operation" /* AuthErrorCode.ADMIN_ONLY_OPERATION */,
    // Multi factor related errors.
    _a$1["INVALID_MFA_PENDING_CREDENTIAL" /* ServerError.INVALID_MFA_PENDING_CREDENTIAL */] = "invalid-multi-factor-session" /* AuthErrorCode.INVALID_MFA_SESSION */,
    _a$1["MFA_ENROLLMENT_NOT_FOUND" /* ServerError.MFA_ENROLLMENT_NOT_FOUND */] = "multi-factor-info-not-found" /* AuthErrorCode.MFA_INFO_NOT_FOUND */,
    _a$1["MISSING_MFA_ENROLLMENT_ID" /* ServerError.MISSING_MFA_ENROLLMENT_ID */] = "missing-multi-factor-info" /* AuthErrorCode.MISSING_MFA_INFO */,
    _a$1["MISSING_MFA_PENDING_CREDENTIAL" /* ServerError.MISSING_MFA_PENDING_CREDENTIAL */] = "missing-multi-factor-session" /* AuthErrorCode.MISSING_MFA_SESSION */,
    _a$1["SECOND_FACTOR_EXISTS" /* ServerError.SECOND_FACTOR_EXISTS */] = "second-factor-already-in-use" /* AuthErrorCode.SECOND_FACTOR_ALREADY_ENROLLED */,
    _a$1["SECOND_FACTOR_LIMIT_EXCEEDED" /* ServerError.SECOND_FACTOR_LIMIT_EXCEEDED */] = "maximum-second-factor-count-exceeded" /* AuthErrorCode.SECOND_FACTOR_LIMIT_EXCEEDED */,
    // Blocking functions related errors.
    _a$1["BLOCKING_FUNCTION_ERROR_RESPONSE" /* ServerError.BLOCKING_FUNCTION_ERROR_RESPONSE */] = "internal-error" /* AuthErrorCode.INTERNAL_ERROR */,
    // Recaptcha related errors.
    _a$1["RECAPTCHA_NOT_ENABLED" /* ServerError.RECAPTCHA_NOT_ENABLED */] = "recaptcha-not-enabled" /* AuthErrorCode.RECAPTCHA_NOT_ENABLED */,
    _a$1["MISSING_RECAPTCHA_TOKEN" /* ServerError.MISSING_RECAPTCHA_TOKEN */] = "missing-recaptcha-token" /* AuthErrorCode.MISSING_RECAPTCHA_TOKEN */,
    _a$1["INVALID_RECAPTCHA_TOKEN" /* ServerError.INVALID_RECAPTCHA_TOKEN */] = "invalid-recaptcha-token" /* AuthErrorCode.INVALID_RECAPTCHA_TOKEN */,
    _a$1["INVALID_RECAPTCHA_ACTION" /* ServerError.INVALID_RECAPTCHA_ACTION */] = "invalid-recaptcha-action" /* AuthErrorCode.INVALID_RECAPTCHA_ACTION */,
    _a$1["MISSING_CLIENT_TYPE" /* ServerError.MISSING_CLIENT_TYPE */] = "missing-client-type" /* AuthErrorCode.MISSING_CLIENT_TYPE */,
    _a$1["MISSING_RECAPTCHA_VERSION" /* ServerError.MISSING_RECAPTCHA_VERSION */] = "missing-recaptcha-version" /* AuthErrorCode.MISSING_RECAPTCHA_VERSION */,
    _a$1["INVALID_RECAPTCHA_VERSION" /* ServerError.INVALID_RECAPTCHA_VERSION */] = "invalid-recaptcha-version" /* AuthErrorCode.INVALID_RECAPTCHA_VERSION */,
    _a$1["INVALID_REQ_TYPE" /* ServerError.INVALID_REQ_TYPE */] = "invalid-req-type" /* AuthErrorCode.INVALID_REQ_TYPE */,
    _a$1);

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
var DEFAULT_API_TIMEOUT_MS = new Delay(30000, 60000);
function _addTidIfNecessary(auth, request) {
    if (auth.tenantId && !request.tenantId) {
        return __assign(__assign({}, request), { tenantId: auth.tenantId });
    }
    return request;
}
function _performApiRequest(auth, method, path, request, customErrorMap) {
    if (customErrorMap === void 0) { customErrorMap = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, _performFetchWithErrorHandling(auth, customErrorMap, function () { return __awaiter(_this, void 0, void 0, function () {
                    var body, params, query, headers;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                body = {};
                                params = {};
                                if (request) {
                                    if (method === "GET" /* HttpMethod.GET */) {
                                        params = request;
                                    }
                                    else {
                                        body = {
                                            body: JSON.stringify(request)
                                        };
                                    }
                                }
                                query = querystring(__assign({ key: auth.config.apiKey }, params)).slice(1);
                                return [4 /*yield*/, auth._getAdditionalHeaders()];
                            case 1:
                                headers = _a.sent();
                                headers["Content-Type" /* HttpHeader.CONTENT_TYPE */] = 'application/json';
                                if (auth.languageCode) {
                                    headers["X-Firebase-Locale" /* HttpHeader.X_FIREBASE_LOCALE */] = auth.languageCode;
                                }
                                return [2 /*return*/, FetchProvider.fetch()(_getFinalTarget(auth, auth.config.apiHost, path, query), __assign({ method: method, headers: headers, referrerPolicy: 'no-referrer' }, body))];
                        }
                    });
                }); })];
        });
    });
}
function _performFetchWithErrorHandling(auth, customErrorMap, fetchFn) {
    return __awaiter(this, void 0, void 0, function () {
        var errorMap, networkTimeout, response, json, errorMessage, _a, serverErrorCode, serverErrorMessage, authError, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    auth._canInitEmulator = false;
                    errorMap = __assign(__assign({}, SERVER_ERROR_MAP), customErrorMap);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    networkTimeout = new NetworkTimeout(auth);
                    return [4 /*yield*/, Promise.race([
                            fetchFn(),
                            networkTimeout.promise
                        ])];
                case 2:
                    response = _b.sent();
                    // If we've reached this point, the fetch succeeded and the networkTimeout
                    // didn't throw; clear the network timeout delay so that Node won't hang
                    networkTimeout.clearNetworkTimeout();
                    return [4 /*yield*/, response.json()];
                case 3:
                    json = _b.sent();
                    if ('needConfirmation' in json) {
                        throw _makeTaggedError(auth, "account-exists-with-different-credential" /* AuthErrorCode.NEED_CONFIRMATION */, json);
                    }
                    if (response.ok && !('errorMessage' in json)) {
                        return [2 /*return*/, json];
                    }
                    else {
                        errorMessage = response.ok ? json.errorMessage : json.error.message;
                        _a = errorMessage.split(' : '), serverErrorCode = _a[0], serverErrorMessage = _a[1];
                        if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED" /* ServerError.FEDERATED_USER_ID_ALREADY_LINKED */) {
                            throw _makeTaggedError(auth, "credential-already-in-use" /* AuthErrorCode.CREDENTIAL_ALREADY_IN_USE */, json);
                        }
                        else if (serverErrorCode === "EMAIL_EXISTS" /* ServerError.EMAIL_EXISTS */) {
                            throw _makeTaggedError(auth, "email-already-in-use" /* AuthErrorCode.EMAIL_EXISTS */, json);
                        }
                        else if (serverErrorCode === "USER_DISABLED" /* ServerError.USER_DISABLED */) {
                            throw _makeTaggedError(auth, "user-disabled" /* AuthErrorCode.USER_DISABLED */, json);
                        }
                        authError = errorMap[serverErrorCode] ||
                            serverErrorCode
                                .toLowerCase()
                                .replace(/[_\s]+/g, '-');
                        if (serverErrorMessage) {
                            throw _errorWithCustomMessage(auth, authError, serverErrorMessage);
                        }
                        else {
                            _fail(auth, authError);
                        }
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _b.sent();
                    if (e_1 instanceof FirebaseError) {
                        throw e_1;
                    }
                    // Changing this to a different error code will log user out when there is a network error
                    // because we treat any error other than NETWORK_REQUEST_FAILED as token is invalid.
                    // https://github.com/firebase/firebase-js-sdk/blob/4fbc73610d70be4e0852e7de63a39cb7897e8546/packages/auth/src/core/auth/auth_impl.ts#L309-L316
                    _fail(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */, { 'message': String(e_1) });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function _performSignInRequest(auth, method, path, request, customErrorMap) {
    if (customErrorMap === void 0) { customErrorMap = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var serverResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _performApiRequest(auth, method, path, request, customErrorMap)];
                case 1:
                    serverResponse = (_a.sent());
                    if ('mfaPendingCredential' in serverResponse) {
                        _fail(auth, "multi-factor-auth-required" /* AuthErrorCode.MFA_REQUIRED */, {
                            _serverResponse: serverResponse
                        });
                    }
                    return [2 /*return*/, serverResponse];
            }
        });
    });
}
function _getFinalTarget(auth, host, path, query) {
    var base = "".concat(host).concat(path, "?").concat(query);
    if (!auth.config.emulator) {
        return "".concat(auth.config.apiScheme, "://").concat(base);
    }
    return _emulatorUrl(auth.config, base);
}
function _parseEnforcementState(enforcementStateStr) {
    switch (enforcementStateStr) {
        case 'ENFORCE':
            return "ENFORCE" /* EnforcementState.ENFORCE */;
        case 'AUDIT':
            return "AUDIT" /* EnforcementState.AUDIT */;
        case 'OFF':
            return "OFF" /* EnforcementState.OFF */;
        default:
            return "ENFORCEMENT_STATE_UNSPECIFIED" /* EnforcementState.ENFORCEMENT_STATE_UNSPECIFIED */;
    }
}
var NetworkTimeout = /** @class */ (function () {
    function NetworkTimeout(auth) {
        var _this = this;
        this.auth = auth;
        // Node timers and browser timers are fundamentally incompatible, but we
        // don't care about the value here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.timer = null;
        this.promise = new Promise(function (_, reject) {
            _this.timer = setTimeout(function () {
                return reject(_createError(_this.auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
            }, DEFAULT_API_TIMEOUT_MS.get());
        });
    }
    NetworkTimeout.prototype.clearNetworkTimeout = function () {
        clearTimeout(this.timer);
    };
    return NetworkTimeout;
}());
function _makeTaggedError(auth, code, response) {
    var errorParams = {
        appName: auth.name
    };
    if (response.email) {
        errorParams.email = response.email;
    }
    if (response.phoneNumber) {
        errorParams.phoneNumber = response.phoneNumber;
    }
    var error = _createError(auth, code, errorParams);
    // We know customData is defined on error because errorParams is defined
    error.customData._tokenResponse = response;
    return error;
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
function isV2(grecaptcha) {
    return (grecaptcha !== undefined &&
        grecaptcha.getResponse !== undefined);
}
function isEnterprise(grecaptcha) {
    return (grecaptcha !== undefined &&
        grecaptcha.enterprise !== undefined);
}
var RecaptchaConfig = /** @class */ (function () {
    function RecaptchaConfig(response) {
        /**
         * The reCAPTCHA site key.
         */
        this.siteKey = '';
        /**
         * The list of providers and their enablement status for reCAPTCHA Enterprise.
         */
        this.recaptchaEnforcementState = [];
        if (response.recaptchaKey === undefined) {
            throw new Error('recaptchaKey undefined');
        }
        // Example response.recaptchaKey: "projects/proj123/keys/sitekey123"
        this.siteKey = response.recaptchaKey.split('/')[3];
        this.recaptchaEnforcementState = response.recaptchaEnforcementState;
    }
    /**
     * Returns the reCAPTCHA Enterprise enforcement state for the given provider.
     *
     * @param providerStr - The provider whose enforcement state is to be returned.
     * @returns The reCAPTCHA Enterprise enforcement state for the given provider.
     */
    RecaptchaConfig.prototype.getProviderEnforcementState = function (providerStr) {
        if (!this.recaptchaEnforcementState ||
            this.recaptchaEnforcementState.length === 0) {
            return null;
        }
        for (var _i = 0, _a = this.recaptchaEnforcementState; _i < _a.length; _i++) {
            var recaptchaEnforcementState = _a[_i];
            if (recaptchaEnforcementState.provider &&
                recaptchaEnforcementState.provider === providerStr) {
                return _parseEnforcementState(recaptchaEnforcementState.enforcementState);
            }
        }
        return null;
    };
    /**
     * Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
     *
     * @param providerStr - The provider whose enablement state is to be returned.
     * @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
     */
    RecaptchaConfig.prototype.isProviderEnabled = function (providerStr) {
        return (this.getProviderEnforcementState(providerStr) ===
            "ENFORCE" /* EnforcementState.ENFORCE */ ||
            this.getProviderEnforcementState(providerStr) === "AUDIT" /* EnforcementState.AUDIT */);
    };
    return RecaptchaConfig;
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
function getRecaptchaParams(auth) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _performApiRequest(auth, "GET" /* HttpMethod.GET */, "/v1/recaptchaParams" /* Endpoint.GET_RECAPTCHA_PARAM */)];
                case 1: return [2 /*return*/, ((_a.sent()).recaptchaSiteKey || '')];
            }
        });
    });
}
function getRecaptchaConfig(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "GET" /* HttpMethod.GET */, "/v2/recaptchaConfig" /* Endpoint.GET_RECAPTCHA_CONFIG */, _addTidIfNecessary(auth, request))];
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
function deleteAccount(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:delete" /* Endpoint.DELETE_ACCOUNT */, request)];
        });
    });
}
function deleteLinkedAccounts(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:update" /* Endpoint.SET_ACCOUNT_INFO */, request)];
        });
    });
}
function getAccountInfo(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:lookup" /* Endpoint.GET_ACCOUNT_INFO */, request)];
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
function utcTimestampToDateString(utcTimestamp) {
    if (!utcTimestamp) {
        return undefined;
    }
    try {
        // Convert to date object.
        var date = new Date(Number(utcTimestamp));
        // Test date is valid.
        if (!isNaN(date.getTime())) {
            // Convert to UTC date string.
            return date.toUTCString();
        }
    }
    catch (e) {
        // Do nothing. undefined will be returned.
    }
    return undefined;
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
 * Returns a JSON Web Token (JWT) used to identify the user to a Firebase service.
 *
 * @remarks
 * Returns the current token if it has not expired or if it will not expire in the next five
 * minutes. Otherwise, this will refresh the token and return a new one.
 *
 * @param user - The user.
 * @param forceRefresh - Force refresh regardless of token expiration.
 *
 * @public
 */
function getIdToken(user, forceRefresh) {
    if (forceRefresh === void 0) { forceRefresh = false; }
    return getModularInstance(user).getIdToken(forceRefresh);
}
/**
 * Returns a deserialized JSON Web Token (JWT) used to identify the user to a Firebase service.
 *
 * @remarks
 * Returns the current token if it has not expired or if it will not expire in the next five
 * minutes. Otherwise, this will refresh the token and return a new one.
 *
 * @param user - The user.
 * @param forceRefresh - Force refresh regardless of token expiration.
 *
 * @public
 */
function getIdTokenResult(user, forceRefresh) {
    if (forceRefresh === void 0) { forceRefresh = false; }
    return __awaiter(this, void 0, void 0, function () {
        var userInternal, token, claims, firebase, signInProvider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userInternal = getModularInstance(user);
                    return [4 /*yield*/, userInternal.getIdToken(forceRefresh)];
                case 1:
                    token = _a.sent();
                    claims = _parseToken(token);
                    _assert(claims && claims.exp && claims.auth_time && claims.iat, userInternal.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                    firebase = typeof claims.firebase === 'object' ? claims.firebase : undefined;
                    signInProvider = firebase === null || firebase === void 0 ? void 0 : firebase['sign_in_provider'];
                    return [2 /*return*/, {
                            claims: claims,
                            token: token,
                            authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
                            issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
                            expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
                            signInProvider: signInProvider || null,
                            signInSecondFactor: (firebase === null || firebase === void 0 ? void 0 : firebase['sign_in_second_factor']) || null
                        }];
            }
        });
    });
}
function secondsStringToMilliseconds(seconds) {
    return Number(seconds) * 1000;
}
function _parseToken(token) {
    var _a = token.split('.'), algorithm = _a[0], payload = _a[1], signature = _a[2];
    if (algorithm === undefined ||
        payload === undefined ||
        signature === undefined) {
        _logError('JWT malformed, contained fewer than 3 sections');
        return null;
    }
    try {
        var decoded = base64Decode(payload);
        if (!decoded) {
            _logError('Failed to decode base64 JWT payload');
            return null;
        }
        return JSON.parse(decoded);
    }
    catch (e) {
        _logError('Caught error parsing JWT payload as JSON', e === null || e === void 0 ? void 0 : e.toString());
        return null;
    }
}
/**
 * Extract expiresIn TTL from a token by subtracting the expiration from the issuance.
 */
function _tokenExpiresIn(token) {
    var parsedToken = _parseToken(token);
    _assert(parsedToken, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    _assert(typeof parsedToken.exp !== 'undefined', "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    _assert(typeof parsedToken.iat !== 'undefined', "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    return Number(parsedToken.exp) - Number(parsedToken.iat);
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
function _logoutIfInvalidated(user, promise, bypassAuthState) {
    if (bypassAuthState === void 0) { bypassAuthState = false; }
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (bypassAuthState) {
                        return [2 /*return*/, promise];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 6]);
                    return [4 /*yield*/, promise];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    e_1 = _a.sent();
                    if (!(e_1 instanceof FirebaseError && isUserInvalidated(e_1))) return [3 /*break*/, 5];
                    if (!(user.auth.currentUser === user)) return [3 /*break*/, 5];
                    return [4 /*yield*/, user.auth.signOut()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: throw e_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function isUserInvalidated(_a) {
    var code = _a.code;
    return (code === "auth/".concat("user-disabled" /* AuthErrorCode.USER_DISABLED */) ||
        code === "auth/".concat("user-token-expired" /* AuthErrorCode.TOKEN_EXPIRED */));
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
var ProactiveRefresh = /** @class */ (function () {
    function ProactiveRefresh(user) {
        this.user = user;
        this.isRunning = false;
        // Node timers and browser timers return fundamentally different types.
        // We don't actually care what the value is but TS won't accept unknown and
        // we can't cast properly in both environments.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.timerId = null;
        this.errorBackoff = 30000 /* Duration.RETRY_BACKOFF_MIN */;
    }
    ProactiveRefresh.prototype._start = function () {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.schedule();
    };
    ProactiveRefresh.prototype._stop = function () {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
        }
    };
    ProactiveRefresh.prototype.getInterval = function (wasError) {
        var _a;
        if (wasError) {
            var interval = this.errorBackoff;
            this.errorBackoff = Math.min(this.errorBackoff * 2, 960000 /* Duration.RETRY_BACKOFF_MAX */);
            return interval;
        }
        else {
            // Reset the error backoff
            this.errorBackoff = 30000 /* Duration.RETRY_BACKOFF_MIN */;
            var expTime = (_a = this.user.stsTokenManager.expirationTime) !== null && _a !== void 0 ? _a : 0;
            var interval = expTime - Date.now() - 300000 /* Duration.OFFSET */;
            return Math.max(0, interval);
        }
    };
    ProactiveRefresh.prototype.schedule = function (wasError) {
        var _this = this;
        if (wasError === void 0) { wasError = false; }
        if (!this.isRunning) {
            // Just in case...
            return;
        }
        var interval = this.getInterval(wasError);
        this.timerId = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.iteration()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, interval);
    };
    ProactiveRefresh.prototype.iteration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.user.getIdToken(true)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        // Only retry on network errors
                        if ((e_1 === null || e_1 === void 0 ? void 0 : e_1.code) ===
                            "auth/".concat("network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */)) {
                            this.schedule(/* wasError */ true);
                        }
                        return [2 /*return*/];
                    case 3:
                        this.schedule();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProactiveRefresh;
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
var UserMetadata = /** @class */ (function () {
    function UserMetadata(createdAt, lastLoginAt) {
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
        this._initializeTime();
    }
    UserMetadata.prototype._initializeTime = function () {
        this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
        this.creationTime = utcTimestampToDateString(this.createdAt);
    };
    UserMetadata.prototype._copy = function (metadata) {
        this.createdAt = metadata.createdAt;
        this.lastLoginAt = metadata.lastLoginAt;
        this._initializeTime();
    };
    UserMetadata.prototype.toJSON = function () {
        return {
            createdAt: this.createdAt,
            lastLoginAt: this.lastLoginAt
        };
    };
    return UserMetadata;
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
function _reloadWithoutSaving(user) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var auth, idToken, response, coreAccount, newProviderData, providerData, oldIsAnonymous, newIsAnonymous, isAnonymous, updates;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    auth = user.auth;
                    return [4 /*yield*/, user.getIdToken()];
                case 1:
                    idToken = _b.sent();
                    return [4 /*yield*/, _logoutIfInvalidated(user, getAccountInfo(auth, { idToken: idToken }))];
                case 2:
                    response = _b.sent();
                    _assert(response === null || response === void 0 ? void 0 : response.users.length, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                    coreAccount = response.users[0];
                    user._notifyReloadListener(coreAccount);
                    newProviderData = ((_a = coreAccount.providerUserInfo) === null || _a === void 0 ? void 0 : _a.length)
                        ? extractProviderData(coreAccount.providerUserInfo)
                        : [];
                    providerData = mergeProviderData(user.providerData, newProviderData);
                    oldIsAnonymous = user.isAnonymous;
                    newIsAnonymous = !(user.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length);
                    isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
                    updates = {
                        uid: coreAccount.localId,
                        displayName: coreAccount.displayName || null,
                        photoURL: coreAccount.photoUrl || null,
                        email: coreAccount.email || null,
                        emailVerified: coreAccount.emailVerified || false,
                        phoneNumber: coreAccount.phoneNumber || null,
                        tenantId: coreAccount.tenantId || null,
                        providerData: providerData,
                        metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
                        isAnonymous: isAnonymous
                    };
                    Object.assign(user, updates);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Reloads user account data, if signed in.
 *
 * @param user - The user.
 *
 * @public
 */
function reload(user) {
    return __awaiter(this, void 0, void 0, function () {
        var userInternal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userInternal = getModularInstance(user);
                    return [4 /*yield*/, _reloadWithoutSaving(userInternal)];
                case 1:
                    _a.sent();
                    // Even though the current user hasn't changed, update
                    // current user will trigger a persistence update w/ the
                    // new info.
                    return [4 /*yield*/, userInternal.auth._persistUserIfCurrent(userInternal)];
                case 2:
                    // Even though the current user hasn't changed, update
                    // current user will trigger a persistence update w/ the
                    // new info.
                    _a.sent();
                    userInternal.auth._notifyListenersIfCurrent(userInternal);
                    return [2 /*return*/];
            }
        });
    });
}
function mergeProviderData(original, newData) {
    var deduped = original.filter(function (o) { return !newData.some(function (n) { return n.providerId === o.providerId; }); });
    return __spreadArray(__spreadArray([], deduped, true), newData, true);
}
function extractProviderData(providers) {
    return providers.map(function (_a) {
        var providerId = _a.providerId, provider = __rest(_a, ["providerId"]);
        return {
            providerId: providerId,
            uid: provider.rawId || '',
            displayName: provider.displayName || null,
            email: provider.email || null,
            phoneNumber: provider.phoneNumber || null,
            photoURL: provider.photoUrl || null
        };
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
function requestStsToken(auth, refreshToken) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _performFetchWithErrorHandling(auth, {}, function () { return __awaiter(_this, void 0, void 0, function () {
                        var body, _a, tokenApiHost, apiKey, url, headers;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    body = querystring({
                                        'grant_type': 'refresh_token',
                                        'refresh_token': refreshToken
                                    }).slice(1);
                                    _a = auth.config, tokenApiHost = _a.tokenApiHost, apiKey = _a.apiKey;
                                    url = _getFinalTarget(auth, tokenApiHost, "/v1/token" /* Endpoint.TOKEN */, "key=".concat(apiKey));
                                    return [4 /*yield*/, auth._getAdditionalHeaders()];
                                case 1:
                                    headers = _b.sent();
                                    headers["Content-Type" /* HttpHeader.CONTENT_TYPE */] = 'application/x-www-form-urlencoded';
                                    return [2 /*return*/, FetchProvider.fetch()(url, {
                                            method: "POST" /* HttpMethod.POST */,
                                            headers: headers,
                                            body: body
                                        })];
                            }
                        });
                    }); })];
                case 1:
                    response = _a.sent();
                    // The response comes back in snake_case. Convert to camel:
                    return [2 /*return*/, {
                            accessToken: response.access_token,
                            expiresIn: response.expires_in,
                            refreshToken: response.refresh_token
                        }];
            }
        });
    });
}
function revokeToken(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts:revokeToken" /* Endpoint.REVOKE_TOKEN */, _addTidIfNecessary(auth, request))];
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
 * We need to mark this class as internal explicitly to exclude it in the public typings, because
 * it references AuthInternal which has a circular dependency with UserInternal.
 *
 * @internal
 */
var StsTokenManager = /** @class */ (function () {
    function StsTokenManager() {
        this.refreshToken = null;
        this.accessToken = null;
        this.expirationTime = null;
    }
    Object.defineProperty(StsTokenManager.prototype, "isExpired", {
        get: function () {
            return (!this.expirationTime ||
                Date.now() > this.expirationTime - 30000 /* Buffer.TOKEN_REFRESH */);
        },
        enumerable: false,
        configurable: true
    });
    StsTokenManager.prototype.updateFromServerResponse = function (response) {
        _assert(response.idToken, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        _assert(typeof response.idToken !== 'undefined', "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        _assert(typeof response.refreshToken !== 'undefined', "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        var expiresIn = 'expiresIn' in response && typeof response.expiresIn !== 'undefined'
            ? Number(response.expiresIn)
            : _tokenExpiresIn(response.idToken);
        this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
    };
    StsTokenManager.prototype.getToken = function (auth, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _assert(!this.accessToken || this.refreshToken, auth, "user-token-expired" /* AuthErrorCode.TOKEN_EXPIRED */);
                        if (!forceRefresh && this.accessToken && !this.isExpired) {
                            return [2 /*return*/, this.accessToken];
                        }
                        if (!this.refreshToken) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refresh(auth, this.refreshToken)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.accessToken];
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    };
    StsTokenManager.prototype.clearRefreshToken = function () {
        this.refreshToken = null;
    };
    StsTokenManager.prototype.refresh = function (auth, oldToken) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, accessToken, refreshToken, expiresIn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, requestStsToken(auth, oldToken)];
                    case 1:
                        _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken, expiresIn = _a.expiresIn;
                        this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
                        return [2 /*return*/];
                }
            });
        });
    };
    StsTokenManager.prototype.updateTokensAndExpiration = function (accessToken, refreshToken, expiresInSec) {
        this.refreshToken = refreshToken || null;
        this.accessToken = accessToken || null;
        this.expirationTime = Date.now() + expiresInSec * 1000;
    };
    StsTokenManager.fromJSON = function (appName, object) {
        var refreshToken = object.refreshToken, accessToken = object.accessToken, expirationTime = object.expirationTime;
        var manager = new StsTokenManager();
        if (refreshToken) {
            _assert(typeof refreshToken === 'string', "internal-error" /* AuthErrorCode.INTERNAL_ERROR */, {
                appName: appName
            });
            manager.refreshToken = refreshToken;
        }
        if (accessToken) {
            _assert(typeof accessToken === 'string', "internal-error" /* AuthErrorCode.INTERNAL_ERROR */, {
                appName: appName
            });
            manager.accessToken = accessToken;
        }
        if (expirationTime) {
            _assert(typeof expirationTime === 'number', "internal-error" /* AuthErrorCode.INTERNAL_ERROR */, {
                appName: appName
            });
            manager.expirationTime = expirationTime;
        }
        return manager;
    };
    StsTokenManager.prototype.toJSON = function () {
        return {
            refreshToken: this.refreshToken,
            accessToken: this.accessToken,
            expirationTime: this.expirationTime
        };
    };
    StsTokenManager.prototype._assign = function (stsTokenManager) {
        this.accessToken = stsTokenManager.accessToken;
        this.refreshToken = stsTokenManager.refreshToken;
        this.expirationTime = stsTokenManager.expirationTime;
    };
    StsTokenManager.prototype._clone = function () {
        return Object.assign(new StsTokenManager(), this.toJSON());
    };
    StsTokenManager.prototype._performRefresh = function () {
        return debugFail('not implemented');
    };
    return StsTokenManager;
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
function assertStringOrUndefined(assertion, appName) {
    _assert(typeof assertion === 'string' || typeof assertion === 'undefined', "internal-error" /* AuthErrorCode.INTERNAL_ERROR */, { appName: appName });
}
var UserImpl = /** @class */ (function () {
    function UserImpl(_a) {
        var uid = _a.uid, auth = _a.auth, stsTokenManager = _a.stsTokenManager, opt = __rest(_a, ["uid", "auth", "stsTokenManager"]);
        // For the user object, provider is always Firebase.
        this.providerId = "firebase" /* ProviderId.FIREBASE */;
        this.proactiveRefresh = new ProactiveRefresh(this);
        this.reloadUserInfo = null;
        this.reloadListener = null;
        this.uid = uid;
        this.auth = auth;
        this.stsTokenManager = stsTokenManager;
        this.accessToken = stsTokenManager.accessToken;
        this.displayName = opt.displayName || null;
        this.email = opt.email || null;
        this.emailVerified = opt.emailVerified || false;
        this.phoneNumber = opt.phoneNumber || null;
        this.photoURL = opt.photoURL || null;
        this.isAnonymous = opt.isAnonymous || false;
        this.tenantId = opt.tenantId || null;
        this.providerData = opt.providerData ? __spreadArray([], opt.providerData, true) : [];
        this.metadata = new UserMetadata(opt.createdAt || undefined, opt.lastLoginAt || undefined);
    }
    UserImpl.prototype.getIdToken = function (forceRefresh) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh))];
                    case 1:
                        accessToken = _a.sent();
                        _assert(accessToken, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                        if (!(this.accessToken !== accessToken)) return [3 /*break*/, 3];
                        this.accessToken = accessToken;
                        return [4 /*yield*/, this.auth._persistUserIfCurrent(this)];
                    case 2:
                        _a.sent();
                        this.auth._notifyListenersIfCurrent(this);
                        _a.label = 3;
                    case 3: return [2 /*return*/, accessToken];
                }
            });
        });
    };
    UserImpl.prototype.getIdTokenResult = function (forceRefresh) {
        return getIdTokenResult(this, forceRefresh);
    };
    UserImpl.prototype.reload = function () {
        return reload(this);
    };
    UserImpl.prototype._assign = function (user) {
        if (this === user) {
            return;
        }
        _assert(this.uid === user.uid, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        this.displayName = user.displayName;
        this.photoURL = user.photoURL;
        this.email = user.email;
        this.emailVerified = user.emailVerified;
        this.phoneNumber = user.phoneNumber;
        this.isAnonymous = user.isAnonymous;
        this.tenantId = user.tenantId;
        this.providerData = user.providerData.map(function (userInfo) { return (__assign({}, userInfo)); });
        this.metadata._copy(user.metadata);
        this.stsTokenManager._assign(user.stsTokenManager);
    };
    UserImpl.prototype._clone = function (auth) {
        var newUser = new UserImpl(__assign(__assign({}, this), { auth: auth, stsTokenManager: this.stsTokenManager._clone() }));
        newUser.metadata._copy(this.metadata);
        return newUser;
    };
    UserImpl.prototype._onReload = function (callback) {
        // There should only ever be one listener, and that is a single instance of MultiFactorUser
        _assert(!this.reloadListener, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        this.reloadListener = callback;
        if (this.reloadUserInfo) {
            this._notifyReloadListener(this.reloadUserInfo);
            this.reloadUserInfo = null;
        }
    };
    UserImpl.prototype._notifyReloadListener = function (userInfo) {
        if (this.reloadListener) {
            this.reloadListener(userInfo);
        }
        else {
            // If no listener is subscribed yet, save the result so it's available when they do subscribe
            this.reloadUserInfo = userInfo;
        }
    };
    UserImpl.prototype._startProactiveRefresh = function () {
        this.proactiveRefresh._start();
    };
    UserImpl.prototype._stopProactiveRefresh = function () {
        this.proactiveRefresh._stop();
    };
    UserImpl.prototype._updateTokensIfNecessary = function (response, reload) {
        if (reload === void 0) { reload = false; }
        return __awaiter(this, void 0, void 0, function () {
            var tokensRefreshed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokensRefreshed = false;
                        if (response.idToken &&
                            response.idToken !== this.stsTokenManager.accessToken) {
                            this.stsTokenManager.updateFromServerResponse(response);
                            tokensRefreshed = true;
                        }
                        if (!reload) return [3 /*break*/, 2];
                        return [4 /*yield*/, _reloadWithoutSaving(this)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.auth._persistUserIfCurrent(this)];
                    case 3:
                        _a.sent();
                        if (tokensRefreshed) {
                            this.auth._notifyListenersIfCurrent(this);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserImpl.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var idToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getIdToken()];
                    case 1:
                        idToken = _a.sent();
                        return [4 /*yield*/, _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken: idToken }))];
                    case 2:
                        _a.sent();
                        this.stsTokenManager.clearRefreshToken();
                        // TODO: Determine if cancellable-promises are necessary to use in this class so that delete()
                        //       cancels pending actions...
                        return [2 /*return*/, this.auth.signOut()];
                }
            });
        });
    };
    UserImpl.prototype.toJSON = function () {
        return __assign(__assign({ uid: this.uid, email: this.email || undefined, emailVerified: this.emailVerified, displayName: this.displayName || undefined, isAnonymous: this.isAnonymous, photoURL: this.photoURL || undefined, phoneNumber: this.phoneNumber || undefined, tenantId: this.tenantId || undefined, providerData: this.providerData.map(function (userInfo) { return (__assign({}, userInfo)); }), stsTokenManager: this.stsTokenManager.toJSON(), 
            // Redirect event ID must be maintained in case there is a pending
            // redirect event.
            _redirectEventId: this._redirectEventId }, this.metadata.toJSON()), { 
            // Required for compatibility with the legacy SDK (go/firebase-auth-sdk-persistence-parsing):
            apiKey: this.auth.config.apiKey, appName: this.auth.name });
    };
    Object.defineProperty(UserImpl.prototype, "refreshToken", {
        get: function () {
            return this.stsTokenManager.refreshToken || '';
        },
        enumerable: false,
        configurable: true
    });
    UserImpl._fromJSON = function (auth, object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var displayName = (_a = object.displayName) !== null && _a !== void 0 ? _a : undefined;
        var email = (_b = object.email) !== null && _b !== void 0 ? _b : undefined;
        var phoneNumber = (_c = object.phoneNumber) !== null && _c !== void 0 ? _c : undefined;
        var photoURL = (_d = object.photoURL) !== null && _d !== void 0 ? _d : undefined;
        var tenantId = (_e = object.tenantId) !== null && _e !== void 0 ? _e : undefined;
        var _redirectEventId = (_f = object._redirectEventId) !== null && _f !== void 0 ? _f : undefined;
        var createdAt = (_g = object.createdAt) !== null && _g !== void 0 ? _g : undefined;
        var lastLoginAt = (_h = object.lastLoginAt) !== null && _h !== void 0 ? _h : undefined;
        var uid = object.uid, emailVerified = object.emailVerified, isAnonymous = object.isAnonymous, providerData = object.providerData, plainObjectTokenManager = object.stsTokenManager;
        _assert(uid && plainObjectTokenManager, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        var stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
        _assert(typeof uid === 'string', auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        assertStringOrUndefined(displayName, auth.name);
        assertStringOrUndefined(email, auth.name);
        _assert(typeof emailVerified === 'boolean', auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        _assert(typeof isAnonymous === 'boolean', auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        assertStringOrUndefined(phoneNumber, auth.name);
        assertStringOrUndefined(photoURL, auth.name);
        assertStringOrUndefined(tenantId, auth.name);
        assertStringOrUndefined(_redirectEventId, auth.name);
        assertStringOrUndefined(createdAt, auth.name);
        assertStringOrUndefined(lastLoginAt, auth.name);
        var user = new UserImpl({
            uid: uid,
            auth: auth,
            email: email,
            emailVerified: emailVerified,
            displayName: displayName,
            isAnonymous: isAnonymous,
            photoURL: photoURL,
            phoneNumber: phoneNumber,
            tenantId: tenantId,
            stsTokenManager: stsTokenManager,
            createdAt: createdAt,
            lastLoginAt: lastLoginAt
        });
        if (providerData && Array.isArray(providerData)) {
            user.providerData = providerData.map(function (userInfo) { return (__assign({}, userInfo)); });
        }
        if (_redirectEventId) {
            user._redirectEventId = _redirectEventId;
        }
        return user;
    };
    /**
     * Initialize a User from an idToken server response
     * @param auth
     * @param idTokenResponse
     */
    UserImpl._fromIdTokenResponse = function (auth, idTokenResponse, isAnonymous) {
        if (isAnonymous === void 0) { isAnonymous = false; }
        return __awaiter(this, void 0, void 0, function () {
            var stsTokenManager, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stsTokenManager = new StsTokenManager();
                        stsTokenManager.updateFromServerResponse(idTokenResponse);
                        user = new UserImpl({
                            uid: idTokenResponse.localId,
                            auth: auth,
                            stsTokenManager: stsTokenManager,
                            isAnonymous: isAnonymous
                        });
                        // Updates the user info and data and resolves with a user instance.
                        return [4 /*yield*/, _reloadWithoutSaving(user)];
                    case 1:
                        // Updates the user info and data and resolves with a user instance.
                        _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    return UserImpl;
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
var instanceCache = new Map();
function _getInstance(cls) {
    debugAssert(cls instanceof Function, 'Expected a class definition');
    var instance = instanceCache.get(cls);
    if (instance) {
        debugAssert(instance instanceof cls, 'Instance stored in cache mismatched with class');
        return instance;
    }
    instance = new cls();
    instanceCache.set(cls, instance);
    return instance;
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
var InMemoryPersistence = /** @class */ (function () {
    function InMemoryPersistence() {
        this.type = "NONE" /* PersistenceType.NONE */;
        this.storage = {};
    }
    InMemoryPersistence.prototype._isAvailable = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    InMemoryPersistence.prototype._set = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.storage[key] = value;
                return [2 /*return*/];
            });
        });
    };
    InMemoryPersistence.prototype._get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                value = this.storage[key];
                return [2 /*return*/, value === undefined ? null : value];
            });
        });
    };
    InMemoryPersistence.prototype._remove = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                delete this.storage[key];
                return [2 /*return*/];
            });
        });
    };
    InMemoryPersistence.prototype._addListener = function (_key, _listener) {
        // Listeners are not supported for in-memory storage since it cannot be shared across windows/workers
        return;
    };
    InMemoryPersistence.prototype._removeListener = function (_key, _listener) {
        // Listeners are not supported for in-memory storage since it cannot be shared across windows/workers
        return;
    };
    InMemoryPersistence.type = 'NONE';
    return InMemoryPersistence;
}());
/**
 * An implementation of {@link Persistence} of type 'NONE'.
 *
 * @public
 */
var inMemoryPersistence = InMemoryPersistence;

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
function _persistenceKeyName(key, apiKey, appName) {
    return "".concat("firebase" /* Namespace.PERSISTENCE */, ":").concat(key, ":").concat(apiKey, ":").concat(appName);
}
var PersistenceUserManager = /** @class */ (function () {
    function PersistenceUserManager(persistence, auth, userKey) {
        this.persistence = persistence;
        this.auth = auth;
        this.userKey = userKey;
        var _a = this.auth, config = _a.config, name = _a.name;
        this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name);
        this.fullPersistenceKey = _persistenceKeyName("persistence" /* KeyName.PERSISTENCE_USER */, config.apiKey, name);
        this.boundEventHandler = auth._onStorageEvent.bind(auth);
        this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
    }
    PersistenceUserManager.prototype.setCurrentUser = function (user) {
        return this.persistence._set(this.fullUserKey, user.toJSON());
    };
    PersistenceUserManager.prototype.getCurrentUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blob;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.persistence._get(this.fullUserKey)];
                    case 1:
                        blob = _a.sent();
                        return [2 /*return*/, blob ? UserImpl._fromJSON(this.auth, blob) : null];
                }
            });
        });
    };
    PersistenceUserManager.prototype.removeCurrentUser = function () {
        return this.persistence._remove(this.fullUserKey);
    };
    PersistenceUserManager.prototype.savePersistenceForRedirect = function () {
        return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
    };
    PersistenceUserManager.prototype.setPersistence = function (newPersistence) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.persistence === newPersistence) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        return [4 /*yield*/, this.removeCurrentUser()];
                    case 2:
                        _a.sent();
                        this.persistence = newPersistence;
                        if (currentUser) {
                            return [2 /*return*/, this.setCurrentUser(currentUser)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PersistenceUserManager.prototype.delete = function () {
        this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
    };
    PersistenceUserManager.create = function (auth, persistenceHierarchy, userKey) {
        if (userKey === void 0) { userKey = "authUser" /* KeyName.AUTH_USER */; }
        return __awaiter(this, void 0, void 0, function () {
            var availablePersistences, selectedPersistence, key, userToMigrate, _i, persistenceHierarchy_1, persistence, blob, user, migrationHierarchy;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!persistenceHierarchy.length) {
                            return [2 /*return*/, new PersistenceUserManager(_getInstance(inMemoryPersistence), auth, userKey)];
                        }
                        return [4 /*yield*/, Promise.all(persistenceHierarchy.map(function (persistence) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, persistence._isAvailable()];
                                        case 1:
                                            if (_a.sent()) {
                                                return [2 /*return*/, persistence];
                                            }
                                            return [2 /*return*/, undefined];
                                    }
                                });
                            }); }))];
                    case 1:
                        availablePersistences = (_b.sent()).filter(function (persistence) { return persistence; });
                        selectedPersistence = availablePersistences[0] ||
                            _getInstance(inMemoryPersistence);
                        key = _persistenceKeyName(userKey, auth.config.apiKey, auth.name);
                        userToMigrate = null;
                        _i = 0, persistenceHierarchy_1 = persistenceHierarchy;
                        _b.label = 2;
                    case 2:
                        if (!(_i < persistenceHierarchy_1.length)) return [3 /*break*/, 7];
                        persistence = persistenceHierarchy_1[_i];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, persistence._get(key)];
                    case 4:
                        blob = _b.sent();
                        if (blob) {
                            user = UserImpl._fromJSON(auth, blob);
                            if (persistence !== selectedPersistence) {
                                userToMigrate = user;
                            }
                            selectedPersistence = persistence;
                            return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7:
                        migrationHierarchy = availablePersistences.filter(function (p) { return p._shouldAllowMigration; });
                        // If the persistence does _not_ allow migration, just finish off here
                        if (!selectedPersistence._shouldAllowMigration ||
                            !migrationHierarchy.length) {
                            return [2 /*return*/, new PersistenceUserManager(selectedPersistence, auth, userKey)];
                        }
                        selectedPersistence = migrationHierarchy[0];
                        if (!userToMigrate) return [3 /*break*/, 9];
                        // This normally shouldn't throw since chosenPersistence.isAvailable() is true, but if it does
                        // we'll just let it bubble to surface the error.
                        return [4 /*yield*/, selectedPersistence._set(key, userToMigrate.toJSON())];
                    case 8:
                        // This normally shouldn't throw since chosenPersistence.isAvailable() is true, but if it does
                        // we'll just let it bubble to surface the error.
                        _b.sent();
                        _b.label = 9;
                    case 9: 
                    // Attempt to clear the key in other persistences but ignore errors. This helps prevent issues
                    // such as users getting stuck with a previous account after signing out and refreshing the tab.
                    return [4 /*yield*/, Promise.all(persistenceHierarchy.map(function (persistence) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!(persistence !== selectedPersistence)) return [3 /*break*/, 4];
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, persistence._remove(key)];
                                    case 2:
                                        _b.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        _b.sent();
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                    case 10:
                        // Attempt to clear the key in other persistences but ignore errors. This helps prevent issues
                        // such as users getting stuck with a previous account after signing out and refreshing the tab.
                        _b.sent();
                        return [2 /*return*/, new PersistenceUserManager(selectedPersistence, auth, userKey)];
                }
            });
        });
    };
    return PersistenceUserManager;
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
/**
 * Determine the browser for the purposes of reporting usage to the API
 */
function _getBrowserName(userAgent) {
    var ua = userAgent.toLowerCase();
    if (ua.includes('opera/') || ua.includes('opr/') || ua.includes('opios/')) {
        return "Opera" /* BrowserName.OPERA */;
    }
    else if (_isIEMobile(ua)) {
        // Windows phone IEMobile browser.
        return "IEMobile" /* BrowserName.IEMOBILE */;
    }
    else if (ua.includes('msie') || ua.includes('trident/')) {
        return "IE" /* BrowserName.IE */;
    }
    else if (ua.includes('edge/')) {
        return "Edge" /* BrowserName.EDGE */;
    }
    else if (_isFirefox(ua)) {
        return "Firefox" /* BrowserName.FIREFOX */;
    }
    else if (ua.includes('silk/')) {
        return "Silk" /* BrowserName.SILK */;
    }
    else if (_isBlackBerry(ua)) {
        // Blackberry browser.
        return "Blackberry" /* BrowserName.BLACKBERRY */;
    }
    else if (_isWebOS(ua)) {
        // WebOS default browser.
        return "Webos" /* BrowserName.WEBOS */;
    }
    else if (_isSafari(ua)) {
        return "Safari" /* BrowserName.SAFARI */;
    }
    else if ((ua.includes('chrome/') || _isChromeIOS(ua)) &&
        !ua.includes('edge/')) {
        return "Chrome" /* BrowserName.CHROME */;
    }
    else if (_isAndroid(ua)) {
        // Android stock browser.
        return "Android" /* BrowserName.ANDROID */;
    }
    else {
        // Most modern browsers have name/version at end of user agent string.
        var re = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
        var matches = userAgent.match(re);
        if ((matches === null || matches === void 0 ? void 0 : matches.length) === 2) {
            return matches[1];
        }
    }
    return "Other" /* BrowserName.OTHER */;
}
function _isFirefox(ua) {
    if (ua === void 0) { ua = getUA(); }
    return /firefox\//i.test(ua);
}
function _isSafari(userAgent) {
    if (userAgent === void 0) { userAgent = getUA(); }
    var ua = userAgent.toLowerCase();
    return (ua.includes('safari/') &&
        !ua.includes('chrome/') &&
        !ua.includes('crios/') &&
        !ua.includes('android'));
}
function _isChromeIOS(ua) {
    if (ua === void 0) { ua = getUA(); }
    return /crios\//i.test(ua);
}
function _isIEMobile(ua) {
    if (ua === void 0) { ua = getUA(); }
    return /iemobile/i.test(ua);
}
function _isAndroid(ua) {
    if (ua === void 0) { ua = getUA(); }
    return /android/i.test(ua);
}
function _isBlackBerry(ua) {
    if (ua === void 0) { ua = getUA(); }
    return /blackberry/i.test(ua);
}
function _isWebOS(ua) {
    if (ua === void 0) { ua = getUA(); }
    return /webos/i.test(ua);
}
function _isIOS(ua) {
    if (ua === void 0) { ua = getUA(); }
    return (/iphone|ipad|ipod/i.test(ua) ||
        (/macintosh/i.test(ua) && /mobile/i.test(ua)));
}
function _isIOS7Or8(ua) {
    if (ua === void 0) { ua = getUA(); }
    return (/(iPad|iPhone|iPod).*OS 7_\d/i.test(ua) ||
        /(iPad|iPhone|iPod).*OS 8_\d/i.test(ua));
}
function _isIOSStandalone(ua) {
    var _a;
    if (ua === void 0) { ua = getUA(); }
    return _isIOS(ua) && !!((_a = window.navigator) === null || _a === void 0 ? void 0 : _a.standalone);
}
function _isIE10() {
    return isIE() && document.documentMode === 10;
}
function _isMobileBrowser(ua) {
    if (ua === void 0) { ua = getUA(); }
    // TODO: implement getBrowserName equivalent for OS.
    return (_isIOS(ua) ||
        _isAndroid(ua) ||
        _isWebOS(ua) ||
        _isBlackBerry(ua) ||
        /windows phone/i.test(ua) ||
        _isIEMobile(ua));
}
function _isIframe() {
    try {
        // Check that the current window is not the top window.
        // If so, return true.
        return !!(window && window !== window.top);
    }
    catch (e) {
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
/*
 * Determine the SDK version string
 */
function _getClientVersion(clientPlatform, frameworks) {
    if (frameworks === void 0) { frameworks = []; }
    var reportedPlatform;
    switch (clientPlatform) {
        case "Browser" /* ClientPlatform.BROWSER */:
            // In a browser environment, report the browser name.
            reportedPlatform = _getBrowserName(getUA());
            break;
        case "Worker" /* ClientPlatform.WORKER */:
            // Technically a worker runs from a browser but we need to differentiate a
            // worker from a browser.
            // For example: Chrome-Worker/JsCore/4.9.1/FirebaseCore-web.
            reportedPlatform = "".concat(_getBrowserName(getUA()), "-").concat(clientPlatform);
            break;
        default:
            reportedPlatform = clientPlatform;
    }
    var reportedFrameworks = frameworks.length
        ? frameworks.join(',')
        : 'FirebaseCore-web'; /* default value if no other framework is used */
    return "".concat(reportedPlatform, "/").concat("JsCore" /* ClientImplementation.CORE */, "/").concat(SDK_VERSION, "/").concat(reportedFrameworks);
}

/**
 * @license
 * Copyright 2022 Google LLC
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
var AuthMiddlewareQueue = /** @class */ (function () {
    function AuthMiddlewareQueue(auth) {
        this.auth = auth;
        this.queue = [];
    }
    AuthMiddlewareQueue.prototype.pushCallback = function (callback, onAbort) {
        var _this = this;
        // The callback could be sync or async. Wrap it into a
        // function that is always async.
        var wrappedCallback = function (user) {
            return new Promise(function (resolve, reject) {
                try {
                    var result = callback(user);
                    // Either resolve with existing promise or wrap a non-promise
                    // return value into a promise.
                    resolve(result);
                }
                catch (e) {
                    // Sync callback throws.
                    reject(e);
                }
            });
        };
        // Attach the onAbort if present
        wrappedCallback.onAbort = onAbort;
        this.queue.push(wrappedCallback);
        var index = this.queue.length - 1;
        return function () {
            // Unsubscribe. Replace with no-op. Do not remove from array, or it will disturb
            // indexing of other elements.
            _this.queue[index] = function () { return Promise.resolve(); };
        };
    };
    AuthMiddlewareQueue.prototype.runMiddleware = function (nextUser) {
        return __awaiter(this, void 0, void 0, function () {
            var onAbortStack, _i, _a, beforeStateCallback, e_1, _b, onAbortStack_1, onAbort;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.auth.currentUser === nextUser) {
                            return [2 /*return*/];
                        }
                        onAbortStack = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        _i = 0, _a = this.queue;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        beforeStateCallback = _a[_i];
                        return [4 /*yield*/, beforeStateCallback(nextUser)];
                    case 3:
                        _c.sent();
                        // Only push the onAbort if the callback succeeds
                        if (beforeStateCallback.onAbort) {
                            onAbortStack.push(beforeStateCallback.onAbort);
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _c.sent();
                        // Run all onAbort, with separate try/catch to ignore any errors and
                        // continue
                        onAbortStack.reverse();
                        for (_b = 0, onAbortStack_1 = onAbortStack; _b < onAbortStack_1.length; _b++) {
                            onAbort = onAbortStack_1[_b];
                            try {
                                onAbort();
                            }
                            catch (_) {
                                /* swallow error */
                            }
                        }
                        throw this.auth._errorFactory.create("login-blocked" /* AuthErrorCode.LOGIN_BLOCKED */, {
                            originalMessage: e_1 === null || e_1 === void 0 ? void 0 : e_1.message
                        });
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return AuthMiddlewareQueue;
}());

/**
 * @license
 * Copyright 2023 Google LLC
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
 * Fetches the password policy for the currently set tenant or the project if no tenant is set.
 *
 * @param auth Auth object.
 * @param request Password policy request.
 * @returns Password policy response.
 */
function _getPasswordPolicy(auth, request) {
    if (request === void 0) { request = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "GET" /* HttpMethod.GET */, "/v2/passwordPolicy" /* Endpoint.GET_PASSWORD_POLICY */, _addTidIfNecessary(auth, request))];
        });
    });
}

/**
 * @license
 * Copyright 2023 Google LLC
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
// Minimum min password length enforced by the backend, even if no minimum length is set.
var MINIMUM_MIN_PASSWORD_LENGTH = 6;
/**
 * Stores password policy requirements and provides password validation against the policy.
 *
 * @internal
 */
var PasswordPolicyImpl = /** @class */ (function () {
    function PasswordPolicyImpl(response) {
        var _a, _b, _c, _d;
        // Only include custom strength options defined in the response.
        var responseOptions = response.customStrengthOptions;
        this.customStrengthOptions = {};
        // TODO: Remove once the backend is updated to include the minimum min password length instead of undefined when there is no minimum length set.
        this.customStrengthOptions.minPasswordLength =
            (_a = responseOptions.minPasswordLength) !== null && _a !== void 0 ? _a : MINIMUM_MIN_PASSWORD_LENGTH;
        if (responseOptions.maxPasswordLength) {
            this.customStrengthOptions.maxPasswordLength =
                responseOptions.maxPasswordLength;
        }
        if (responseOptions.containsLowercaseCharacter !== undefined) {
            this.customStrengthOptions.containsLowercaseLetter =
                responseOptions.containsLowercaseCharacter;
        }
        if (responseOptions.containsUppercaseCharacter !== undefined) {
            this.customStrengthOptions.containsUppercaseLetter =
                responseOptions.containsUppercaseCharacter;
        }
        if (responseOptions.containsNumericCharacter !== undefined) {
            this.customStrengthOptions.containsNumericCharacter =
                responseOptions.containsNumericCharacter;
        }
        if (responseOptions.containsNonAlphanumericCharacter !== undefined) {
            this.customStrengthOptions.containsNonAlphanumericCharacter =
                responseOptions.containsNonAlphanumericCharacter;
        }
        this.enforcementState = response.enforcementState;
        if (this.enforcementState === 'ENFORCEMENT_STATE_UNSPECIFIED') {
            this.enforcementState = 'OFF';
        }
        // Use an empty string if no non-alphanumeric characters are specified in the response.
        this.allowedNonAlphanumericCharacters =
            (_c = (_b = response.allowedNonAlphanumericCharacters) === null || _b === void 0 ? void 0 : _b.join('')) !== null && _c !== void 0 ? _c : '';
        this.forceUpgradeOnSignin = (_d = response.forceUpgradeOnSignin) !== null && _d !== void 0 ? _d : false;
        this.schemaVersion = response.schemaVersion;
    }
    PasswordPolicyImpl.prototype.validatePassword = function (password) {
        var _a, _b, _c, _d, _e, _f;
        var status = {
            isValid: true,
            passwordPolicy: this
        };
        // Check the password length and character options.
        this.validatePasswordLengthOptions(password, status);
        this.validatePasswordCharacterOptions(password, status);
        // Combine the status into single isValid property.
        status.isValid && (status.isValid = (_a = status.meetsMinPasswordLength) !== null && _a !== void 0 ? _a : true);
        status.isValid && (status.isValid = (_b = status.meetsMaxPasswordLength) !== null && _b !== void 0 ? _b : true);
        status.isValid && (status.isValid = (_c = status.containsLowercaseLetter) !== null && _c !== void 0 ? _c : true);
        status.isValid && (status.isValid = (_d = status.containsUppercaseLetter) !== null && _d !== void 0 ? _d : true);
        status.isValid && (status.isValid = (_e = status.containsNumericCharacter) !== null && _e !== void 0 ? _e : true);
        status.isValid && (status.isValid = (_f = status.containsNonAlphanumericCharacter) !== null && _f !== void 0 ? _f : true);
        return status;
    };
    /**
     * Validates that the password meets the length options for the policy.
     *
     * @param password Password to validate.
     * @param status Validation status.
     */
    PasswordPolicyImpl.prototype.validatePasswordLengthOptions = function (password, status) {
        var minPasswordLength = this.customStrengthOptions.minPasswordLength;
        var maxPasswordLength = this.customStrengthOptions.maxPasswordLength;
        if (minPasswordLength) {
            status.meetsMinPasswordLength = password.length >= minPasswordLength;
        }
        if (maxPasswordLength) {
            status.meetsMaxPasswordLength = password.length <= maxPasswordLength;
        }
    };
    /**
     * Validates that the password meets the character options for the policy.
     *
     * @param password Password to validate.
     * @param status Validation status.
     */
    PasswordPolicyImpl.prototype.validatePasswordCharacterOptions = function (password, status) {
        // Assign statuses for requirements even if the password is an empty string.
        this.updatePasswordCharacterOptionsStatuses(status, 
        /* containsLowercaseCharacter= */ false, 
        /* containsUppercaseCharacter= */ false, 
        /* containsNumericCharacter= */ false, 
        /* containsNonAlphanumericCharacter= */ false);
        var passwordChar;
        for (var i = 0; i < password.length; i++) {
            passwordChar = password.charAt(i);
            this.updatePasswordCharacterOptionsStatuses(status, 
            /* containsLowercaseCharacter= */ passwordChar >= 'a' &&
                passwordChar <= 'z', 
            /* containsUppercaseCharacter= */ passwordChar >= 'A' &&
                passwordChar <= 'Z', 
            /* containsNumericCharacter= */ passwordChar >= '0' &&
                passwordChar <= '9', 
            /* containsNonAlphanumericCharacter= */ this.allowedNonAlphanumericCharacters.includes(passwordChar));
        }
    };
    /**
     * Updates the running validation status with the statuses for the character options.
     * Expected to be called each time a character is processed to update each option status
     * based on the current character.
     *
     * @param status Validation status.
     * @param containsLowercaseCharacter Whether the character is a lowercase letter.
     * @param containsUppercaseCharacter Whether the character is an uppercase letter.
     * @param containsNumericCharacter Whether the character is a numeric character.
     * @param containsNonAlphanumericCharacter Whether the character is a non-alphanumeric character.
     */
    PasswordPolicyImpl.prototype.updatePasswordCharacterOptionsStatuses = function (status, containsLowercaseCharacter, containsUppercaseCharacter, containsNumericCharacter, containsNonAlphanumericCharacter) {
        if (this.customStrengthOptions.containsLowercaseLetter) {
            status.containsLowercaseLetter || (status.containsLowercaseLetter = containsLowercaseCharacter);
        }
        if (this.customStrengthOptions.containsUppercaseLetter) {
            status.containsUppercaseLetter || (status.containsUppercaseLetter = containsUppercaseCharacter);
        }
        if (this.customStrengthOptions.containsNumericCharacter) {
            status.containsNumericCharacter || (status.containsNumericCharacter = containsNumericCharacter);
        }
        if (this.customStrengthOptions.containsNonAlphanumericCharacter) {
            status.containsNonAlphanumericCharacter || (status.containsNonAlphanumericCharacter = containsNonAlphanumericCharacter);
        }
    };
    return PasswordPolicyImpl;
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
var AuthImpl = /** @class */ (function () {
    function AuthImpl(app, heartbeatServiceProvider, appCheckServiceProvider, config) {
        this.app = app;
        this.heartbeatServiceProvider = heartbeatServiceProvider;
        this.appCheckServiceProvider = appCheckServiceProvider;
        this.config = config;
        this.currentUser = null;
        this.emulatorConfig = null;
        this.operations = Promise.resolve();
        this.authStateSubscription = new Subscription(this);
        this.idTokenSubscription = new Subscription(this);
        this.beforeStateQueue = new AuthMiddlewareQueue(this);
        this.redirectUser = null;
        this.isProactiveRefreshEnabled = false;
        this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1;
        // Any network calls will set this to true and prevent subsequent emulator
        // initialization
        this._canInitEmulator = true;
        this._isInitialized = false;
        this._deleted = false;
        this._initializationPromise = null;
        this._popupRedirectResolver = null;
        this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
        this._agentRecaptchaConfig = null;
        this._tenantRecaptchaConfigs = {};
        this._projectPasswordPolicy = null;
        this._tenantPasswordPolicies = {};
        // Tracks the last notified UID for state change listeners to prevent
        // repeated calls to the callbacks. Undefined means it's never been
        // called, whereas null means it's been called with a signed out user
        this.lastNotifiedUid = undefined;
        this.languageCode = null;
        this.tenantId = null;
        this.settings = { appVerificationDisabledForTesting: false };
        this.frameworks = [];
        this.name = app.name;
        this.clientVersion = config.sdkClientVersion;
    }
    AuthImpl.prototype._initializeWithPersistence = function (persistenceHierarchy, popupRedirectResolver) {
        var _this = this;
        if (popupRedirectResolver) {
            this._popupRedirectResolver = _getInstance(popupRedirectResolver);
        }
        // Have to check for app deletion throughout initialization (after each
        // promise resolution)
        this._initializationPromise = this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (this._deleted) {
                            return [2 /*return*/];
                        }
                        _a = this;
                        return [4 /*yield*/, PersistenceUserManager.create(this, persistenceHierarchy)];
                    case 1:
                        _a.persistenceManager = _d.sent();
                        if (this._deleted) {
                            return [2 /*return*/];
                        }
                        if (!((_b = this._popupRedirectResolver) === null || _b === void 0 ? void 0 : _b._shouldInitProactively)) return [3 /*break*/, 5];
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this._popupRedirectResolver._initialize(this)];
                    case 3:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 5: return [4 /*yield*/, this.initializeCurrentUser(popupRedirectResolver)];
                    case 6:
                        _d.sent();
                        this.lastNotifiedUid = ((_c = this.currentUser) === null || _c === void 0 ? void 0 : _c.uid) || null;
                        if (this._deleted) {
                            return [2 /*return*/];
                        }
                        this._isInitialized = true;
                        return [2 /*return*/];
                }
            });
        }); });
        return this._initializationPromise;
    };
    /**
     * If the persistence is changed in another window, the user manager will let us know
     */
    AuthImpl.prototype._onStorageEvent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._deleted) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.assertedPersistence.getCurrentUser()];
                    case 1:
                        user = _a.sent();
                        if (!this.currentUser && !user) {
                            // No change, do nothing (was signed out and remained signed out).
                            return [2 /*return*/];
                        }
                        if (!(this.currentUser && user && this.currentUser.uid === user.uid)) return [3 /*break*/, 3];
                        // Data update, simply copy data changes.
                        this._currentUser._assign(user);
                        // If tokens changed from previous user tokens, this will trigger
                        // notifyAuthListeners_.
                        return [4 /*yield*/, this.currentUser.getIdToken()];
                    case 2:
                        // If tokens changed from previous user tokens, this will trigger
                        // notifyAuthListeners_.
                        _a.sent();
                        return [2 /*return*/];
                    case 3: 
                    // Update current Auth state. Either a new login or logout.
                    // Skip blocking callbacks, they should not apply to a change in another tab.
                    return [4 /*yield*/, this._updateCurrentUser(user, /* skipBeforeStateCallbacks */ true)];
                    case 4:
                        // Update current Auth state. Either a new login or logout.
                        // Skip blocking callbacks, they should not apply to a change in another tab.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthImpl.prototype.initializeCurrentUser = function (popupRedirectResolver) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var previouslyStoredUser, futureCurrentUser, needsTocheckMiddleware, redirectUserEventId, storedUserEventId, result, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.assertedPersistence.getCurrentUser()];
                    case 1:
                        previouslyStoredUser = (_b.sent());
                        futureCurrentUser = previouslyStoredUser;
                        needsTocheckMiddleware = false;
                        if (!(popupRedirectResolver && this.config.authDomain)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getOrInitRedirectPersistenceManager()];
                    case 2:
                        _b.sent();
                        redirectUserEventId = (_a = this.redirectUser) === null || _a === void 0 ? void 0 : _a._redirectEventId;
                        storedUserEventId = futureCurrentUser === null || futureCurrentUser === void 0 ? void 0 : futureCurrentUser._redirectEventId;
                        return [4 /*yield*/, this.tryRedirectSignIn(popupRedirectResolver)];
                    case 3:
                        result = _b.sent();
                        // If the stored user (i.e. the old "currentUser") has a redirectId that
                        // matches the redirect user, then we want to initially sign in with the
                        // new user object from result.
                        // TODO(samgho): More thoroughly test all of this
                        if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) &&
                            (result === null || result === void 0 ? void 0 : result.user)) {
                            futureCurrentUser = result.user;
                            needsTocheckMiddleware = true;
                        }
                        _b.label = 4;
                    case 4:
                        // If no user in persistence, there is no current user. Set to null.
                        if (!futureCurrentUser) {
                            return [2 /*return*/, this.directlySetCurrentUser(null)];
                        }
                        if (!!futureCurrentUser._redirectEventId) return [3 /*break*/, 9];
                        if (!needsTocheckMiddleware) return [3 /*break*/, 8];
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.beforeStateQueue.runMiddleware(futureCurrentUser)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        e_2 = _b.sent();
                        futureCurrentUser = previouslyStoredUser;
                        // We know this is available since the bit is only set when the
                        // resolver is available
                        this._popupRedirectResolver._overrideRedirectResult(this, function () {
                            return Promise.reject(e_2);
                        });
                        return [3 /*break*/, 8];
                    case 8:
                        if (futureCurrentUser) {
                            return [2 /*return*/, this.reloadAndSetCurrentUserOrClear(futureCurrentUser)];
                        }
                        else {
                            return [2 /*return*/, this.directlySetCurrentUser(null)];
                        }
                    case 9:
                        _assert(this._popupRedirectResolver, this, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                        return [4 /*yield*/, this.getOrInitRedirectPersistenceManager()];
                    case 10:
                        _b.sent();
                        // If the redirect user's event ID matches the current user's event ID,
                        // DO NOT reload the current user, otherwise they'll be cleared from storage.
                        // This is important for the reauthenticateWithRedirect() flow.
                        if (this.redirectUser &&
                            this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) {
                            return [2 /*return*/, this.directlySetCurrentUser(futureCurrentUser)];
                        }
                        return [2 /*return*/, this.reloadAndSetCurrentUserOrClear(futureCurrentUser)];
                }
            });
        });
    };
    AuthImpl.prototype.tryRedirectSignIn = function (redirectResolver) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true)];
                    case 2:
                        // We know this._popupRedirectResolver is set since redirectResolver
                        // is passed in. The _completeRedirectFn expects the unwrapped extern.
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        _a.sent();
                        // Swallow any errors here; the code can retrieve them in
                        // getRedirectResult().
                        return [4 /*yield*/, this._setRedirectUser(null)];
                    case 4:
                        // Swallow any errors here; the code can retrieve them in
                        // getRedirectResult().
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, result];
                }
            });
        });
    };
    AuthImpl.prototype.reloadAndSetCurrentUserOrClear = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, _reloadWithoutSaving(user)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        if ((e_4 === null || e_4 === void 0 ? void 0 : e_4.code) !==
                            "auth/".concat("network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */)) {
                            // Something's wrong with the user's token. Log them out and remove
                            // them from storage
                            return [2 /*return*/, this.directlySetCurrentUser(null)];
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, this.directlySetCurrentUser(user)];
                }
            });
        });
    };
    AuthImpl.prototype.useDeviceLanguage = function () {
        this.languageCode = _getUserLanguage();
    };
    AuthImpl.prototype._delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._deleted = true;
                return [2 /*return*/];
            });
        });
    };
    AuthImpl.prototype.updateCurrentUser = function (userExtern) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                user = userExtern
                    ? getModularInstance(userExtern)
                    : null;
                if (user) {
                    _assert(user.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token" /* AuthErrorCode.INVALID_AUTH */);
                }
                return [2 /*return*/, this._updateCurrentUser(user && user._clone(this))];
            });
        });
    };
    AuthImpl.prototype._updateCurrentUser = function (user, skipBeforeStateCallbacks) {
        if (skipBeforeStateCallbacks === void 0) { skipBeforeStateCallbacks = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._deleted) {
                            return [2 /*return*/];
                        }
                        if (user) {
                            _assert(this.tenantId === user.tenantId, this, "tenant-id-mismatch" /* AuthErrorCode.TENANT_ID_MISMATCH */);
                        }
                        if (!!skipBeforeStateCallbacks) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.beforeStateQueue.runMiddleware(user)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.directlySetCurrentUser(user)];
                                    case 1:
                                        _a.sent();
                                        this.notifyAuthListeners();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                }
            });
        });
    };
    AuthImpl.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Run first, to block _setRedirectUser() if any callbacks fail.
                    return [4 /*yield*/, this.beforeStateQueue.runMiddleware(null)];
                    case 1:
                        // Run first, to block _setRedirectUser() if any callbacks fail.
                        _a.sent();
                        if (!(this.redirectPersistenceManager || this._popupRedirectResolver)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._setRedirectUser(null)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: 
                    // Prevent callbacks from being called again in _updateCurrentUser, as
                    // they were already called in the first line.
                    return [2 /*return*/, this._updateCurrentUser(null, /* skipBeforeStateCallbacks */ true)];
                }
            });
        });
    };
    AuthImpl.prototype.setPersistence = function (persistence) {
        var _this = this;
        return this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.assertedPersistence.setPersistence(_getInstance(persistence))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    AuthImpl.prototype._getRecaptchaConfig = function () {
        if (this.tenantId == null) {
            return this._agentRecaptchaConfig;
        }
        else {
            return this._tenantRecaptchaConfigs[this.tenantId];
        }
    };
    AuthImpl.prototype.validatePassword = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordPolicy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._getPasswordPolicyInternal()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._updatePasswordPolicy()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        passwordPolicy = this._getPasswordPolicyInternal();
                        // Check that the policy schema version is supported by the SDK.
                        // TODO: Update this logic to use a max supported policy schema version once we have multiple schema versions.
                        if (passwordPolicy.schemaVersion !==
                            this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION) {
                            return [2 /*return*/, Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version" /* AuthErrorCode.UNSUPPORTED_PASSWORD_POLICY_SCHEMA_VERSION */, {}))];
                        }
                        return [2 /*return*/, passwordPolicy.validatePassword(password)];
                }
            });
        });
    };
    AuthImpl.prototype._getPasswordPolicyInternal = function () {
        if (this.tenantId === null) {
            return this._projectPasswordPolicy;
        }
        else {
            return this._tenantPasswordPolicies[this.tenantId];
        }
    };
    AuthImpl.prototype._updatePasswordPolicy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, passwordPolicy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _getPasswordPolicy(this)];
                    case 1:
                        response = _a.sent();
                        passwordPolicy = new PasswordPolicyImpl(response);
                        if (this.tenantId === null) {
                            this._projectPasswordPolicy = passwordPolicy;
                        }
                        else {
                            this._tenantPasswordPolicies[this.tenantId] = passwordPolicy;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthImpl.prototype._getPersistence = function () {
        return this.assertedPersistence.persistence.type;
    };
    AuthImpl.prototype._updateErrorMap = function (errorMap) {
        this._errorFactory = new ErrorFactory('auth', 'Firebase', errorMap());
    };
    AuthImpl.prototype.onAuthStateChanged = function (nextOrObserver, error, completed) {
        return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
    };
    AuthImpl.prototype.beforeAuthStateChanged = function (callback, onAbort) {
        return this.beforeStateQueue.pushCallback(callback, onAbort);
    };
    AuthImpl.prototype.onIdTokenChanged = function (nextOrObserver, error, completed) {
        return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
    };
    AuthImpl.prototype.authStateReady = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.currentUser) {
                resolve();
            }
            else {
                var unsubscribe_1 = _this.onAuthStateChanged(function () {
                    unsubscribe_1();
                    resolve();
                }, reject);
            }
        });
    };
    /**
     * Revokes the given access token. Currently only supports Apple OAuth access tokens.
     */
    AuthImpl.prototype.revokeAccessToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var idToken, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.currentUser) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.currentUser.getIdToken()];
                    case 1:
                        idToken = _a.sent();
                        request = {
                            providerId: 'apple.com',
                            tokenType: "ACCESS_TOKEN" /* TokenType.ACCESS_TOKEN */,
                            token: token,
                            idToken: idToken
                        };
                        if (this.tenantId != null) {
                            request.tenantId = this.tenantId;
                        }
                        return [4 /*yield*/, revokeToken(this, request)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthImpl.prototype.toJSON = function () {
        var _a;
        return {
            apiKey: this.config.apiKey,
            authDomain: this.config.authDomain,
            appName: this.name,
            currentUser: (_a = this._currentUser) === null || _a === void 0 ? void 0 : _a.toJSON()
        };
    };
    AuthImpl.prototype._setRedirectUser = function (user, popupRedirectResolver) {
        return __awaiter(this, void 0, void 0, function () {
            var redirectManager;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOrInitRedirectPersistenceManager(popupRedirectResolver)];
                    case 1:
                        redirectManager = _a.sent();
                        return [2 /*return*/, user === null
                                ? redirectManager.removeCurrentUser()
                                : redirectManager.setCurrentUser(user)];
                }
            });
        });
    };
    AuthImpl.prototype.getOrInitRedirectPersistenceManager = function (popupRedirectResolver) {
        return __awaiter(this, void 0, void 0, function () {
            var resolver, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!this.redirectPersistenceManager) return [3 /*break*/, 3];
                        resolver = (popupRedirectResolver && _getInstance(popupRedirectResolver)) ||
                            this._popupRedirectResolver;
                        _assert(resolver, this, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                        _a = this;
                        return [4 /*yield*/, PersistenceUserManager.create(this, [_getInstance(resolver._redirectPersistence)], "redirectUser" /* KeyName.REDIRECT_USER */)];
                    case 1:
                        _a.redirectPersistenceManager = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.redirectPersistenceManager.getCurrentUser()];
                    case 2:
                        _b.redirectUser =
                            _c.sent();
                        _c.label = 3;
                    case 3: return [2 /*return*/, this.redirectPersistenceManager];
                }
            });
        });
    };
    AuthImpl.prototype._redirectUserForId = function (id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this._isInitialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/];
                            }); }); })];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        if (((_a = this._currentUser) === null || _a === void 0 ? void 0 : _a._redirectEventId) === id) {
                            return [2 /*return*/, this._currentUser];
                        }
                        if (((_b = this.redirectUser) === null || _b === void 0 ? void 0 : _b._redirectEventId) === id) {
                            return [2 /*return*/, this.redirectUser];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    AuthImpl.prototype._persistUserIfCurrent = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (user === this.currentUser) {
                    return [2 /*return*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, this.directlySetCurrentUser(user)];
                        }); }); })];
                }
                return [2 /*return*/];
            });
        });
    };
    /** Notifies listeners only if the user is current */
    AuthImpl.prototype._notifyListenersIfCurrent = function (user) {
        if (user === this.currentUser) {
            this.notifyAuthListeners();
        }
    };
    AuthImpl.prototype._key = function () {
        return "".concat(this.config.authDomain, ":").concat(this.config.apiKey, ":").concat(this.name);
    };
    AuthImpl.prototype._startProactiveRefresh = function () {
        this.isProactiveRefreshEnabled = true;
        if (this.currentUser) {
            this._currentUser._startProactiveRefresh();
        }
    };
    AuthImpl.prototype._stopProactiveRefresh = function () {
        this.isProactiveRefreshEnabled = false;
        if (this.currentUser) {
            this._currentUser._stopProactiveRefresh();
        }
    };
    Object.defineProperty(AuthImpl.prototype, "_currentUser", {
        /** Returns the current user cast as the internal type */
        get: function () {
            return this.currentUser;
        },
        enumerable: false,
        configurable: true
    });
    AuthImpl.prototype.notifyAuthListeners = function () {
        var _a, _b;
        if (!this._isInitialized) {
            return;
        }
        this.idTokenSubscription.next(this.currentUser);
        var currentUid = (_b = (_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : null;
        if (this.lastNotifiedUid !== currentUid) {
            this.lastNotifiedUid = currentUid;
            this.authStateSubscription.next(this.currentUser);
        }
    };
    AuthImpl.prototype.registerStateListener = function (subscription, nextOrObserver, error, completed) {
        var _this = this;
        if (this._deleted) {
            return function () { };
        }
        var cb = typeof nextOrObserver === 'function'
            ? nextOrObserver
            : nextOrObserver.next.bind(nextOrObserver);
        var isUnsubscribed = false;
        var promise = this._isInitialized
            ? Promise.resolve()
            : this._initializationPromise;
        _assert(promise, this, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        // The callback needs to be called asynchronously per the spec.
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        promise.then(function () {
            if (isUnsubscribed) {
                return;
            }
            cb(_this.currentUser);
        });
        if (typeof nextOrObserver === 'function') {
            var unsubscribe_2 = subscription.addObserver(nextOrObserver, error, completed);
            return function () {
                isUnsubscribed = true;
                unsubscribe_2();
            };
        }
        else {
            var unsubscribe_3 = subscription.addObserver(nextOrObserver);
            return function () {
                isUnsubscribed = true;
                unsubscribe_3();
            };
        }
    };
    /**
     * Unprotected (from race conditions) method to set the current user. This
     * should only be called from within a queued callback. This is necessary
     * because the queue shouldn't rely on another queued callback.
     */
    AuthImpl.prototype.directlySetCurrentUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.currentUser && this.currentUser !== user) {
                            this._currentUser._stopProactiveRefresh();
                        }
                        if (user && this.isProactiveRefreshEnabled) {
                            user._startProactiveRefresh();
                        }
                        this.currentUser = user;
                        if (!user) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.assertedPersistence.setCurrentUser(user)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.assertedPersistence.removeCurrentUser()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthImpl.prototype.queue = function (action) {
        // In case something errors, the callback still should be called in order
        // to keep the promise chain alive
        this.operations = this.operations.then(action, action);
        return this.operations;
    };
    Object.defineProperty(AuthImpl.prototype, "assertedPersistence", {
        get: function () {
            _assert(this.persistenceManager, this, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
            return this.persistenceManager;
        },
        enumerable: false,
        configurable: true
    });
    AuthImpl.prototype._logFramework = function (framework) {
        if (!framework || this.frameworks.includes(framework)) {
            return;
        }
        this.frameworks.push(framework);
        // Sort alphabetically so that "FirebaseCore-web,FirebaseUI-web" and
        // "FirebaseUI-web,FirebaseCore-web" aren't viewed as different.
        this.frameworks.sort();
        this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
    };
    AuthImpl.prototype._getFrameworks = function () {
        return this.frameworks;
    };
    AuthImpl.prototype._getAdditionalHeaders = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var headers, heartbeatsHeader, appCheckToken;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        headers = (_b = {},
                            _b["X-Client-Version" /* HttpHeader.X_CLIENT_VERSION */] = this.clientVersion,
                            _b);
                        if (this.app.options.appId) {
                            headers["X-Firebase-gmpid" /* HttpHeader.X_FIREBASE_GMPID */] = this.app.options.appId;
                        }
                        return [4 /*yield*/, ((_a = this.heartbeatServiceProvider
                                .getImmediate({
                                optional: true
                            })) === null || _a === void 0 ? void 0 : _a.getHeartbeatsHeader())];
                    case 1:
                        heartbeatsHeader = _c.sent();
                        if (heartbeatsHeader) {
                            headers["X-Firebase-Client" /* HttpHeader.X_FIREBASE_CLIENT */] = heartbeatsHeader;
                        }
                        return [4 /*yield*/, this._getAppCheckToken()];
                    case 2:
                        appCheckToken = _c.sent();
                        if (appCheckToken) {
                            headers["X-Firebase-AppCheck" /* HttpHeader.X_FIREBASE_APP_CHECK */] = appCheckToken;
                        }
                        return [2 /*return*/, headers];
                }
            });
        });
    };
    AuthImpl.prototype._getAppCheckToken = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var appCheckTokenResult;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = this.appCheckServiceProvider
                            .getImmediate({ optional: true })) === null || _a === void 0 ? void 0 : _a.getToken())];
                    case 1:
                        appCheckTokenResult = _b.sent();
                        if (appCheckTokenResult === null || appCheckTokenResult === void 0 ? void 0 : appCheckTokenResult.error) {
                            // Context: appCheck.getToken() will never throw even if an error happened.
                            // In the error case, a dummy token will be returned along with an error field describing
                            // the error. In general, we shouldn't care about the error condition and just use
                            // the token (actual or dummy) to send requests.
                            _logWarn("Error while retrieving App Check token: ".concat(appCheckTokenResult.error));
                        }
                        return [2 /*return*/, appCheckTokenResult === null || appCheckTokenResult === void 0 ? void 0 : appCheckTokenResult.token];
                }
            });
        });
    };
    return AuthImpl;
}());
/**
 * Method to be used to cast down to our private implmentation of Auth.
 * It will also handle unwrapping from the compat type if necessary
 *
 * @param auth Auth object passed in from developer
 */
function _castAuth(auth) {
    return getModularInstance(auth);
}
/** Helper class to wrap subscriber logic */
var Subscription = /** @class */ (function () {
    function Subscription(auth) {
        var _this = this;
        this.auth = auth;
        this.observer = null;
        this.addObserver = createSubscribe(function (observer) { return (_this.observer = observer); });
    }
    Object.defineProperty(Subscription.prototype, "next", {
        get: function () {
            _assert(this.observer, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
            return this.observer.next.bind(this.observer);
        },
        enumerable: false,
        configurable: true
    });
    return Subscription;
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
function getScriptParentElement() {
    var _a, _b;
    return (_b = (_a = document.getElementsByTagName('head')) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : document;
}
function _loadJS(url) {
    // TODO: consider adding timeout support & cancellation
    return new Promise(function (resolve, reject) {
        var el = document.createElement('script');
        el.setAttribute('src', url);
        el.onload = resolve;
        el.onerror = function (e) {
            var error = _createError("internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
            error.customData = e;
            reject(error);
        };
        el.type = 'text/javascript';
        el.charset = 'UTF-8';
        getScriptParentElement().appendChild(el);
    });
}
function _generateCallbackName(prefix) {
    return "__".concat(prefix).concat(Math.floor(Math.random() * 1000000));
}

/* eslint-disable @typescript-eslint/no-require-imports */
var RECAPTCHA_ENTERPRISE_URL = 'https://www.google.com/recaptcha/enterprise.js?render=';
var RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = 'recaptcha-enterprise';
var FAKE_TOKEN = 'NO_RECAPTCHA';
var RecaptchaEnterpriseVerifier = /** @class */ (function () {
    /**
     *
     * @param authExtern - The corresponding Firebase {@link Auth} instance.
     *
     */
    function RecaptchaEnterpriseVerifier(authExtern) {
        /**
         * Identifies the type of application verifier (e.g. "recaptcha-enterprise").
         */
        this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
        this.auth = _castAuth(authExtern);
    }
    /**
     * Executes the verification process.
     *
     * @returns A Promise for a token that can be used to assert the validity of a request.
     */
    RecaptchaEnterpriseVerifier.prototype.verify = function (action, forceRefresh) {
        if (action === void 0) { action = 'verify'; }
        if (forceRefresh === void 0) { forceRefresh = false; }
        return __awaiter(this, void 0, void 0, function () {
            function retrieveSiteKey(auth) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        if (!forceRefresh) {
                            if (auth.tenantId == null && auth._agentRecaptchaConfig != null) {
                                return [2 /*return*/, auth._agentRecaptchaConfig.siteKey];
                            }
                            if (auth.tenantId != null &&
                                auth._tenantRecaptchaConfigs[auth.tenantId] !== undefined) {
                                return [2 /*return*/, auth._tenantRecaptchaConfigs[auth.tenantId].siteKey];
                            }
                        }
                        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    getRecaptchaConfig(auth, {
                                        clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */,
                                        version: "RECAPTCHA_ENTERPRISE" /* RecaptchaVersion.ENTERPRISE */
                                    })
                                        .then(function (response) {
                                        if (response.recaptchaKey === undefined) {
                                            reject(new Error('recaptcha Enterprise site key undefined'));
                                        }
                                        else {
                                            var config = new RecaptchaConfig(response);
                                            if (auth.tenantId == null) {
                                                auth._agentRecaptchaConfig = config;
                                            }
                                            else {
                                                auth._tenantRecaptchaConfigs[auth.tenantId] = config;
                                            }
                                            return resolve(config.siteKey);
                                        }
                                    })
                                        .catch(function (error) {
                                        reject(error);
                                    });
                                    return [2 /*return*/];
                                });
                            }); })];
                    });
                });
            }
            function retrieveRecaptchaToken(siteKey, resolve, reject) {
                var grecaptcha = window.grecaptcha;
                if (isEnterprise(grecaptcha)) {
                    grecaptcha.enterprise.ready(function () {
                        grecaptcha.enterprise
                            .execute(siteKey, { action: action })
                            .then(function (token) {
                            resolve(token);
                        })
                            .catch(function () {
                            resolve(FAKE_TOKEN);
                        });
                    });
                }
                else {
                    reject(Error('No reCAPTCHA enterprise script loaded.'));
                }
            }
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        retrieveSiteKey(_this.auth)
                            .then(function (siteKey) {
                            if (!forceRefresh && isEnterprise(window.grecaptcha)) {
                                retrieveRecaptchaToken(siteKey, resolve, reject);
                            }
                            else {
                                if (typeof window === 'undefined') {
                                    reject(new Error('RecaptchaVerifier is only supported in browser'));
                                    return;
                                }
                                _loadJS(RECAPTCHA_ENTERPRISE_URL + siteKey)
                                    .then(function () {
                                    retrieveRecaptchaToken(siteKey, resolve, reject);
                                })
                                    .catch(function (error) {
                                    reject(error);
                                });
                            }
                        })
                            .catch(function (error) {
                            reject(error);
                        });
                    })];
            });
        });
    };
    return RecaptchaEnterpriseVerifier;
}());
function injectRecaptchaFields(auth, request, action, captchaResp) {
    if (captchaResp === void 0) { captchaResp = false; }
    return __awaiter(this, void 0, void 0, function () {
        var verifier, captchaResponse, newRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    verifier = new RecaptchaEnterpriseVerifier(auth);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, verifier.verify(action)];
                case 2:
                    captchaResponse = _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, verifier.verify(action, true)];
                case 4:
                    captchaResponse = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    newRequest = __assign({}, request);
                    if (!captchaResp) {
                        Object.assign(newRequest, { captchaResponse: captchaResponse });
                    }
                    else {
                        Object.assign(newRequest, { 'captchaResp': captchaResponse });
                    }
                    Object.assign(newRequest, { 'clientType': "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */ });
                    Object.assign(newRequest, {
                        'recaptchaVersion': "RECAPTCHA_ENTERPRISE" /* RecaptchaVersion.ENTERPRISE */
                    });
                    return [2 /*return*/, newRequest];
            }
        });
    });
}
function handleRecaptchaFlow(authInstance, request, actionName, actionMethod) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var requestWithRecaptcha;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!((_a = authInstance
                        ._getRecaptchaConfig()) === null || _a === void 0 ? void 0 : _a.isProviderEnabled("EMAIL_PASSWORD_PROVIDER" /* RecaptchaProvider.EMAIL_PASSWORD_PROVIDER */))) return [3 /*break*/, 2];
                    return [4 /*yield*/, injectRecaptchaFields(authInstance, request, actionName, actionName === "getOobCode" /* RecaptchaActionName.GET_OOB_CODE */)];
                case 1:
                    requestWithRecaptcha = _b.sent();
                    return [2 /*return*/, actionMethod(authInstance, requestWithRecaptcha)];
                case 2: return [2 /*return*/, actionMethod(authInstance, request).catch(function (error) { return __awaiter(_this, void 0, void 0, function () {
                        var requestWithRecaptcha;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(error.code === "auth/".concat("missing-recaptcha-token" /* AuthErrorCode.MISSING_RECAPTCHA_TOKEN */))) return [3 /*break*/, 2];
                                    console.log("".concat(actionName, " is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow."));
                                    return [4 /*yield*/, injectRecaptchaFields(authInstance, request, actionName, actionName === "getOobCode" /* RecaptchaActionName.GET_OOB_CODE */)];
                                case 1:
                                    requestWithRecaptcha = _a.sent();
                                    return [2 /*return*/, actionMethod(authInstance, requestWithRecaptcha)];
                                case 2: return [2 /*return*/, Promise.reject(error)];
                            }
                        });
                    }); })];
            }
        });
    });
}
function _initializeRecaptchaConfig(auth) {
    return __awaiter(this, void 0, void 0, function () {
        var authInternal, response, config, verifier;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = _castAuth(auth);
                    return [4 /*yield*/, getRecaptchaConfig(authInternal, {
                            clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */,
                            version: "RECAPTCHA_ENTERPRISE" /* RecaptchaVersion.ENTERPRISE */
                        })];
                case 1:
                    response = _a.sent();
                    config = new RecaptchaConfig(response);
                    if (authInternal.tenantId == null) {
                        authInternal._agentRecaptchaConfig = config;
                    }
                    else {
                        authInternal._tenantRecaptchaConfigs[authInternal.tenantId] = config;
                    }
                    if (config.isProviderEnabled("EMAIL_PASSWORD_PROVIDER" /* RecaptchaProvider.EMAIL_PASSWORD_PROVIDER */)) {
                        verifier = new RecaptchaEnterpriseVerifier(authInternal);
                        void verifier.verify();
                    }
                    return [2 /*return*/];
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
/**
 * Initializes an {@link Auth} instance with fine-grained control over
 * {@link Dependencies}.
 *
 * @remarks
 *
 * This function allows more control over the {@link Auth} instance than
 * {@link getAuth}. `getAuth` uses platform-specific defaults to supply
 * the {@link Dependencies}. In general, `getAuth` is the easiest way to
 * initialize Auth and works for most use cases. Use `initializeAuth` if you
 * need control over which persistence layer is used, or to minimize bundle
 * size if you're not using either `signInWithPopup` or `signInWithRedirect`.
 *
 * For example, if your app only uses anonymous accounts and you only want
 * accounts saved for the current session, initialize `Auth` with:
 *
 * ```js
 * const auth = initializeAuth(app, {
 *   persistence: browserSessionPersistence,
 *   popupRedirectResolver: undefined,
 * });
 * ```
 *
 * @public
 */
function initializeAuth(app, deps) {
    var provider = _getProvider(app, 'auth');
    if (provider.isInitialized()) {
        var auth_1 = provider.getImmediate();
        var initialOptions = provider.getOptions();
        if (deepEqual(initialOptions, deps !== null && deps !== void 0 ? deps : {})) {
            return auth_1;
        }
        else {
            _fail(auth_1, "already-initialized" /* AuthErrorCode.ALREADY_INITIALIZED */);
        }
    }
    var auth = provider.initialize({ options: deps });
    return auth;
}
function _initializeAuthInstance(auth, deps) {
    var persistence = (deps === null || deps === void 0 ? void 0 : deps.persistence) || [];
    var hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
    if (deps === null || deps === void 0 ? void 0 : deps.errorMap) {
        auth._updateErrorMap(deps.errorMap);
    }
    // This promise is intended to float; auth initialization happens in the
    // background, meanwhile the auth object may be used by the app.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    auth._initializeWithPersistence(hierarchy, deps === null || deps === void 0 ? void 0 : deps.popupRedirectResolver);
}

/**
 * Changes the {@link Auth} instance to communicate with the Firebase Auth Emulator, instead of production
 * Firebase Auth services.
 *
 * @remarks
 * This must be called synchronously immediately following the first call to
 * {@link initializeAuth}.  Do not use with production credentials as emulator
 * traffic is not encrypted.
 *
 *
 * @example
 * ```javascript
 * connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param url - The URL at which the emulator is running (eg, 'http://localhost:9099').
 * @param options - Optional. `options.disableWarnings` defaults to `false`. Set it to
 * `true` to disable the warning banner attached to the DOM.
 *
 * @public
 */
function connectAuthEmulator(auth, url, options) {
    var authInternal = _castAuth(auth);
    _assert(authInternal._canInitEmulator, authInternal, "emulator-config-failed" /* AuthErrorCode.EMULATOR_CONFIG_FAILED */);
    _assert(/^https?:\/\//.test(url), authInternal, "invalid-emulator-scheme" /* AuthErrorCode.INVALID_EMULATOR_SCHEME */);
    var disableWarnings = !!(options === null || options === void 0 ? void 0 : options.disableWarnings);
    var protocol = extractProtocol(url);
    var _a = extractHostAndPort(url), host = _a.host, port = _a.port;
    var portStr = port === null ? '' : ":".concat(port);
    // Always replace path with "/" (even if input url had no path at all, or had a different one).
    authInternal.config.emulator = { url: "".concat(protocol, "//").concat(host).concat(portStr, "/") };
    authInternal.settings.appVerificationDisabledForTesting = true;
    authInternal.emulatorConfig = Object.freeze({
        host: host,
        port: port,
        protocol: protocol.replace(':', ''),
        options: Object.freeze({ disableWarnings: disableWarnings })
    });
    if (!disableWarnings) {
        emitEmulatorWarning();
    }
}
function extractProtocol(url) {
    var protocolEnd = url.indexOf(':');
    return protocolEnd < 0 ? '' : url.substr(0, protocolEnd + 1);
}
function extractHostAndPort(url) {
    var protocol = extractProtocol(url);
    var authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length)); // Between // and /, ? or #.
    if (!authority) {
        return { host: '', port: null };
    }
    var hostAndPort = authority[2].split('@').pop() || ''; // Strip out "username:password@".
    var bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
    if (bracketedIPv6) {
        var host = bracketedIPv6[1];
        return { host: host, port: parsePort(hostAndPort.substr(host.length + 1)) };
    }
    else {
        var _a = hostAndPort.split(':'), host = _a[0], port = _a[1];
        return { host: host, port: parsePort(port) };
    }
}
function parsePort(portStr) {
    if (!portStr) {
        return null;
    }
    var port = Number(portStr);
    if (isNaN(port)) {
        return null;
    }
    return port;
}
function emitEmulatorWarning() {
    function attachBanner() {
        var el = document.createElement('p');
        var sty = el.style;
        el.innerText =
            'Running in emulator mode. Do not use with production credentials.';
        sty.position = 'fixed';
        sty.width = '100%';
        sty.backgroundColor = '#ffffff';
        sty.border = '.1em solid #000000';
        sty.color = '#b50000';
        sty.bottom = '0px';
        sty.left = '0px';
        sty.margin = '0px';
        sty.zIndex = '10000';
        sty.textAlign = 'center';
        el.classList.add('firebase-emulator-warning');
        document.body.appendChild(el);
    }
    if (typeof console !== 'undefined' && typeof console.info === 'function') {
        console.info('WARNING: You are using the Auth Emulator,' +
            ' which is intended for local testing only.  Do not use with' +
            ' production credentials.');
    }
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', attachBanner);
        }
        else {
            attachBanner();
        }
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
/**
 * Interface that represents the credentials returned by an {@link AuthProvider}.
 *
 * @remarks
 * Implementations specify the details about each auth provider's credential requirements.
 *
 * @public
 */
var AuthCredential = /** @class */ (function () {
    /** @internal */
    function AuthCredential(
    /**
     * The authentication provider ID for the credential.
     *
     * @remarks
     * For example, 'facebook.com', or 'google.com'.
     */
    providerId, 
    /**
     * The authentication sign in method for the credential.
     *
     * @remarks
     * For example, {@link SignInMethod}.EMAIL_PASSWORD, or
     * {@link SignInMethod}.EMAIL_LINK. This corresponds to the sign-in method
     * identifier as returned in {@link fetchSignInMethodsForEmail}.
     */
    signInMethod) {
        this.providerId = providerId;
        this.signInMethod = signInMethod;
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns a JSON-serializable representation of this object.
     */
    AuthCredential.prototype.toJSON = function () {
        return debugFail('not implemented');
    };
    /** @internal */
    AuthCredential.prototype._getIdTokenResponse = function (_auth) {
        return debugFail('not implemented');
    };
    /** @internal */
    AuthCredential.prototype._linkToIdToken = function (_auth, _idToken) {
        return debugFail('not implemented');
    };
    /** @internal */
    AuthCredential.prototype._getReauthenticationResolver = function (_auth) {
        return debugFail('not implemented');
    };
    return AuthCredential;
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
function resetPassword(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:resetPassword" /* Endpoint.RESET_PASSWORD */, _addTidIfNecessary(auth, request))];
        });
    });
}
function updateEmailPassword(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:update" /* Endpoint.SET_ACCOUNT_INFO */, request)];
        });
    });
}
// Used for linking an email/password account to an existing idToken. Uses the same request/response
// format as updateEmailPassword.
function linkEmailPassword(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:signUp" /* Endpoint.SIGN_UP */, request)];
        });
    });
}
function applyActionCode$1(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:update" /* Endpoint.SET_ACCOUNT_INFO */, _addTidIfNecessary(auth, request))];
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
function signInWithPassword(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performSignInRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:signInWithPassword" /* Endpoint.SIGN_IN_WITH_PASSWORD */, _addTidIfNecessary(auth, request))];
        });
    });
}
function sendOobCode(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:sendOobCode" /* Endpoint.SEND_OOB_CODE */, _addTidIfNecessary(auth, request))];
        });
    });
}
function sendEmailVerification$1(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, sendOobCode(auth, request)];
        });
    });
}
function sendPasswordResetEmail$1(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, sendOobCode(auth, request)];
        });
    });
}
function sendSignInLinkToEmail$1(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, sendOobCode(auth, request)];
        });
    });
}
function verifyAndChangeEmail(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, sendOobCode(auth, request)];
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
function signInWithEmailLink$1(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performSignInRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:signInWithEmailLink" /* Endpoint.SIGN_IN_WITH_EMAIL_LINK */, _addTidIfNecessary(auth, request))];
        });
    });
}
function signInWithEmailLinkForLinking(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performSignInRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:signInWithEmailLink" /* Endpoint.SIGN_IN_WITH_EMAIL_LINK */, _addTidIfNecessary(auth, request))];
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
 * Interface that represents the credentials returned by {@link EmailAuthProvider} for
 * {@link ProviderId}.PASSWORD
 *
 * @remarks
 * Covers both {@link SignInMethod}.EMAIL_PASSWORD and
 * {@link SignInMethod}.EMAIL_LINK.
 *
 * @public
 */
var EmailAuthCredential = /** @class */ (function (_super) {
    __extends(EmailAuthCredential, _super);
    /** @internal */
    function EmailAuthCredential(
    /** @internal */
    _email, 
    /** @internal */
    _password, signInMethod, 
    /** @internal */
    _tenantId) {
        if (_tenantId === void 0) { _tenantId = null; }
        var _this = _super.call(this, "password" /* ProviderId.PASSWORD */, signInMethod) || this;
        _this._email = _email;
        _this._password = _password;
        _this._tenantId = _tenantId;
        return _this;
    }
    /** @internal */
    EmailAuthCredential._fromEmailAndPassword = function (email, password) {
        return new EmailAuthCredential(email, password, "password" /* SignInMethod.EMAIL_PASSWORD */);
    };
    /** @internal */
    EmailAuthCredential._fromEmailAndCode = function (email, oobCode, tenantId) {
        if (tenantId === void 0) { tenantId = null; }
        return new EmailAuthCredential(email, oobCode, "emailLink" /* SignInMethod.EMAIL_LINK */, tenantId);
    };
    /** {@inheritdoc AuthCredential.toJSON} */
    EmailAuthCredential.prototype.toJSON = function () {
        return {
            email: this._email,
            password: this._password,
            signInMethod: this.signInMethod,
            tenantId: this._tenantId
        };
    };
    /**
     * Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
     *
     * @param json - Either `object` or the stringified representation of the object. When string is
     * provided, `JSON.parse` would be called first.
     *
     * @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
     */
    EmailAuthCredential.fromJSON = function (json) {
        var obj = typeof json === 'string' ? JSON.parse(json) : json;
        if ((obj === null || obj === void 0 ? void 0 : obj.email) && (obj === null || obj === void 0 ? void 0 : obj.password)) {
            if (obj.signInMethod === "password" /* SignInMethod.EMAIL_PASSWORD */) {
                return this._fromEmailAndPassword(obj.email, obj.password);
            }
            else if (obj.signInMethod === "emailLink" /* SignInMethod.EMAIL_LINK */) {
                return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
            }
        }
        return null;
    };
    /** @internal */
    EmailAuthCredential.prototype._getIdTokenResponse = function (auth) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (this.signInMethod) {
                    case "password" /* SignInMethod.EMAIL_PASSWORD */:
                        request = {
                            returnSecureToken: true,
                            email: this._email,
                            password: this._password,
                            clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */
                        };
                        return [2 /*return*/, handleRecaptchaFlow(auth, request, "signInWithPassword" /* RecaptchaActionName.SIGN_IN_WITH_PASSWORD */, signInWithPassword)];
                    case "emailLink" /* SignInMethod.EMAIL_LINK */:
                        return [2 /*return*/, signInWithEmailLink$1(auth, {
                                email: this._email,
                                oobCode: this._password
                            })];
                    default:
                        _fail(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                }
                return [2 /*return*/];
            });
        });
    };
    /** @internal */
    EmailAuthCredential.prototype._linkToIdToken = function (auth, idToken) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (this.signInMethod) {
                    case "password" /* SignInMethod.EMAIL_PASSWORD */:
                        request = {
                            idToken: idToken,
                            returnSecureToken: true,
                            email: this._email,
                            password: this._password,
                            clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */
                        };
                        return [2 /*return*/, handleRecaptchaFlow(auth, request, "signUpPassword" /* RecaptchaActionName.SIGN_UP_PASSWORD */, linkEmailPassword)];
                    case "emailLink" /* SignInMethod.EMAIL_LINK */:
                        return [2 /*return*/, signInWithEmailLinkForLinking(auth, {
                                idToken: idToken,
                                email: this._email,
                                oobCode: this._password
                            })];
                    default:
                        _fail(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                }
                return [2 /*return*/];
            });
        });
    };
    /** @internal */
    EmailAuthCredential.prototype._getReauthenticationResolver = function (auth) {
        return this._getIdTokenResponse(auth);
    };
    return EmailAuthCredential;
}(AuthCredential));

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
function signInWithIdp(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performSignInRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:signInWithIdp" /* Endpoint.SIGN_IN_WITH_IDP */, _addTidIfNecessary(auth, request))];
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
var IDP_REQUEST_URI$1 = 'http://localhost';
/**
 * Represents the OAuth credentials returned by an {@link OAuthProvider}.
 *
 * @remarks
 * Implementations specify the details about each auth provider's credential requirements.
 *
 * @public
 */
var OAuthCredential = /** @class */ (function (_super) {
    __extends(OAuthCredential, _super);
    function OAuthCredential() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pendingToken = null;
        return _this;
    }
    /** @internal */
    OAuthCredential._fromParams = function (params) {
        var cred = new OAuthCredential(params.providerId, params.signInMethod);
        if (params.idToken || params.accessToken) {
            // OAuth 2 and either ID token or access token.
            if (params.idToken) {
                cred.idToken = params.idToken;
            }
            if (params.accessToken) {
                cred.accessToken = params.accessToken;
            }
            // Add nonce if available and no pendingToken is present.
            if (params.nonce && !params.pendingToken) {
                cred.nonce = params.nonce;
            }
            if (params.pendingToken) {
                cred.pendingToken = params.pendingToken;
            }
        }
        else if (params.oauthToken && params.oauthTokenSecret) {
            // OAuth 1 and OAuth token with token secret
            cred.accessToken = params.oauthToken;
            cred.secret = params.oauthTokenSecret;
        }
        else {
            _fail("argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        }
        return cred;
    };
    /** {@inheritdoc AuthCredential.toJSON}  */
    OAuthCredential.prototype.toJSON = function () {
        return {
            idToken: this.idToken,
            accessToken: this.accessToken,
            secret: this.secret,
            nonce: this.nonce,
            pendingToken: this.pendingToken,
            providerId: this.providerId,
            signInMethod: this.signInMethod
        };
    };
    /**
     * Static method to deserialize a JSON representation of an object into an
     * {@link  AuthCredential}.
     *
     * @param json - Input can be either Object or the stringified representation of the object.
     * When string is provided, JSON.parse would be called first.
     *
     * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
     */
    OAuthCredential.fromJSON = function (json) {
        var obj = typeof json === 'string' ? JSON.parse(json) : json;
        var providerId = obj.providerId, signInMethod = obj.signInMethod, rest = __rest(obj, ["providerId", "signInMethod"]);
        if (!providerId || !signInMethod) {
            return null;
        }
        var cred = new OAuthCredential(providerId, signInMethod);
        cred.idToken = rest.idToken || undefined;
        cred.accessToken = rest.accessToken || undefined;
        cred.secret = rest.secret;
        cred.nonce = rest.nonce;
        cred.pendingToken = rest.pendingToken || null;
        return cred;
    };
    /** @internal */
    OAuthCredential.prototype._getIdTokenResponse = function (auth) {
        var request = this.buildRequest();
        return signInWithIdp(auth, request);
    };
    /** @internal */
    OAuthCredential.prototype._linkToIdToken = function (auth, idToken) {
        var request = this.buildRequest();
        request.idToken = idToken;
        return signInWithIdp(auth, request);
    };
    /** @internal */
    OAuthCredential.prototype._getReauthenticationResolver = function (auth) {
        var request = this.buildRequest();
        request.autoCreate = false;
        return signInWithIdp(auth, request);
    };
    OAuthCredential.prototype.buildRequest = function () {
        var request = {
            requestUri: IDP_REQUEST_URI$1,
            returnSecureToken: true
        };
        if (this.pendingToken) {
            request.pendingToken = this.pendingToken;
        }
        else {
            var postBody = {};
            if (this.idToken) {
                postBody['id_token'] = this.idToken;
            }
            if (this.accessToken) {
                postBody['access_token'] = this.accessToken;
            }
            if (this.secret) {
                postBody['oauth_token_secret'] = this.secret;
            }
            postBody['providerId'] = this.providerId;
            if (this.nonce && !this.pendingToken) {
                postBody['nonce'] = this.nonce;
            }
            request.postBody = querystring(postBody);
        }
        return request;
    };
    return OAuthCredential;
}(AuthCredential));

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
var _a;
function sendPhoneVerificationCode(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:sendVerificationCode" /* Endpoint.SEND_VERIFICATION_CODE */, _addTidIfNecessary(auth, request))];
        });
    });
}
function signInWithPhoneNumber(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performSignInRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:signInWithPhoneNumber" /* Endpoint.SIGN_IN_WITH_PHONE_NUMBER */, _addTidIfNecessary(auth, request))];
        });
    });
}
function linkWithPhoneNumber(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _performSignInRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:signInWithPhoneNumber" /* Endpoint.SIGN_IN_WITH_PHONE_NUMBER */, _addTidIfNecessary(auth, request))];
                case 1:
                    response = _a.sent();
                    if (response.temporaryProof) {
                        throw _makeTaggedError(auth, "account-exists-with-different-credential" /* AuthErrorCode.NEED_CONFIRMATION */, response);
                    }
                    return [2 /*return*/, response];
            }
        });
    });
}
var VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_ = (_a = {},
    _a["USER_NOT_FOUND" /* ServerError.USER_NOT_FOUND */] = "user-not-found" /* AuthErrorCode.USER_DELETED */,
    _a);
function verifyPhoneNumberForExisting(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        var apiRequest;
        return __generator(this, function (_a) {
            apiRequest = __assign(__assign({}, request), { operation: 'REAUTH' });
            return [2 /*return*/, _performSignInRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:signInWithPhoneNumber" /* Endpoint.SIGN_IN_WITH_PHONE_NUMBER */, _addTidIfNecessary(auth, apiRequest), VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_)];
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
 * Represents the credentials returned by {@link PhoneAuthProvider}.
 *
 * @public
 */
var PhoneAuthCredential = /** @class */ (function (_super) {
    __extends(PhoneAuthCredential, _super);
    function PhoneAuthCredential(params) {
        var _this = _super.call(this, "phone" /* ProviderId.PHONE */, "phone" /* SignInMethod.PHONE */) || this;
        _this.params = params;
        return _this;
    }
    /** @internal */
    PhoneAuthCredential._fromVerification = function (verificationId, verificationCode) {
        return new PhoneAuthCredential({ verificationId: verificationId, verificationCode: verificationCode });
    };
    /** @internal */
    PhoneAuthCredential._fromTokenResponse = function (phoneNumber, temporaryProof) {
        return new PhoneAuthCredential({ phoneNumber: phoneNumber, temporaryProof: temporaryProof });
    };
    /** @internal */
    PhoneAuthCredential.prototype._getIdTokenResponse = function (auth) {
        return signInWithPhoneNumber(auth, this._makeVerificationRequest());
    };
    /** @internal */
    PhoneAuthCredential.prototype._linkToIdToken = function (auth, idToken) {
        return linkWithPhoneNumber(auth, __assign({ idToken: idToken }, this._makeVerificationRequest()));
    };
    /** @internal */
    PhoneAuthCredential.prototype._getReauthenticationResolver = function (auth) {
        return verifyPhoneNumberForExisting(auth, this._makeVerificationRequest());
    };
    /** @internal */
    PhoneAuthCredential.prototype._makeVerificationRequest = function () {
        var _a = this.params, temporaryProof = _a.temporaryProof, phoneNumber = _a.phoneNumber, verificationId = _a.verificationId, verificationCode = _a.verificationCode;
        if (temporaryProof && phoneNumber) {
            return { temporaryProof: temporaryProof, phoneNumber: phoneNumber };
        }
        return {
            sessionInfo: verificationId,
            code: verificationCode
        };
    };
    /** {@inheritdoc AuthCredential.toJSON} */
    PhoneAuthCredential.prototype.toJSON = function () {
        var obj = {
            providerId: this.providerId
        };
        if (this.params.phoneNumber) {
            obj.phoneNumber = this.params.phoneNumber;
        }
        if (this.params.temporaryProof) {
            obj.temporaryProof = this.params.temporaryProof;
        }
        if (this.params.verificationCode) {
            obj.verificationCode = this.params.verificationCode;
        }
        if (this.params.verificationId) {
            obj.verificationId = this.params.verificationId;
        }
        return obj;
    };
    /** Generates a phone credential based on a plain object or a JSON string. */
    PhoneAuthCredential.fromJSON = function (json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        var _a = json, verificationId = _a.verificationId, verificationCode = _a.verificationCode, phoneNumber = _a.phoneNumber, temporaryProof = _a.temporaryProof;
        if (!verificationCode &&
            !verificationId &&
            !phoneNumber &&
            !temporaryProof) {
            return null;
        }
        return new PhoneAuthCredential({
            verificationId: verificationId,
            verificationCode: verificationCode,
            phoneNumber: phoneNumber,
            temporaryProof: temporaryProof
        });
    };
    return PhoneAuthCredential;
}(AuthCredential));

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
 * Maps the mode string in action code URL to Action Code Info operation.
 *
 * @param mode
 */
function parseMode(mode) {
    switch (mode) {
        case 'recoverEmail':
            return "RECOVER_EMAIL" /* ActionCodeOperation.RECOVER_EMAIL */;
        case 'resetPassword':
            return "PASSWORD_RESET" /* ActionCodeOperation.PASSWORD_RESET */;
        case 'signIn':
            return "EMAIL_SIGNIN" /* ActionCodeOperation.EMAIL_SIGNIN */;
        case 'verifyEmail':
            return "VERIFY_EMAIL" /* ActionCodeOperation.VERIFY_EMAIL */;
        case 'verifyAndChangeEmail':
            return "VERIFY_AND_CHANGE_EMAIL" /* ActionCodeOperation.VERIFY_AND_CHANGE_EMAIL */;
        case 'revertSecondFactorAddition':
            return "REVERT_SECOND_FACTOR_ADDITION" /* ActionCodeOperation.REVERT_SECOND_FACTOR_ADDITION */;
        default:
            return null;
    }
}
/**
 * Helper to parse FDL links
 *
 * @param url
 */
function parseDeepLink(url) {
    var link = querystringDecode(extractQuerystring(url))['link'];
    // Double link case (automatic redirect).
    var doubleDeepLink = link
        ? querystringDecode(extractQuerystring(link))['deep_link_id']
        : null;
    // iOS custom scheme links.
    var iOSDeepLink = querystringDecode(extractQuerystring(url))['deep_link_id'];
    var iOSDoubleDeepLink = iOSDeepLink
        ? querystringDecode(extractQuerystring(iOSDeepLink))['link']
        : null;
    return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
}
/**
 * A utility class to parse email action URLs such as password reset, email verification,
 * email link sign in, etc.
 *
 * @public
 */
var ActionCodeURL = /** @class */ (function () {
    /**
     * @param actionLink - The link from which to extract the URL.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @internal
     */
    function ActionCodeURL(actionLink) {
        var _a, _b, _c, _d, _e, _f;
        var searchParams = querystringDecode(extractQuerystring(actionLink));
        var apiKey = (_a = searchParams["apiKey" /* QueryField.API_KEY */]) !== null && _a !== void 0 ? _a : null;
        var code = (_b = searchParams["oobCode" /* QueryField.CODE */]) !== null && _b !== void 0 ? _b : null;
        var operation = parseMode((_c = searchParams["mode" /* QueryField.MODE */]) !== null && _c !== void 0 ? _c : null);
        // Validate API key, code and mode.
        _assert(apiKey && code && operation, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        this.apiKey = apiKey;
        this.operation = operation;
        this.code = code;
        this.continueUrl = (_d = searchParams["continueUrl" /* QueryField.CONTINUE_URL */]) !== null && _d !== void 0 ? _d : null;
        this.languageCode = (_e = searchParams["languageCode" /* QueryField.LANGUAGE_CODE */]) !== null && _e !== void 0 ? _e : null;
        this.tenantId = (_f = searchParams["tenantId" /* QueryField.TENANT_ID */]) !== null && _f !== void 0 ? _f : null;
    }
    /**
     * Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
     * otherwise returns null.
     *
     * @param link  - The email action link string.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @public
     */
    ActionCodeURL.parseLink = function (link) {
        var actionLink = parseDeepLink(link);
        try {
            return new ActionCodeURL(actionLink);
        }
        catch (_a) {
            return null;
        }
    };
    return ActionCodeURL;
}());
/**
 * Parses the email action link string and returns an {@link ActionCodeURL} if
 * the link is valid, otherwise returns null.
 *
 * @public
 */
function parseActionCodeURL(link) {
    return ActionCodeURL.parseLink(link);
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
 * Provider for generating {@link EmailAuthCredential}.
 *
 * @public
 */
var EmailAuthProvider = /** @class */ (function () {
    function EmailAuthProvider() {
        /**
         * Always set to {@link ProviderId}.PASSWORD, even for email link.
         */
        this.providerId = EmailAuthProvider.PROVIDER_ID;
    }
    /**
     * Initialize an {@link AuthCredential} using an email and password.
     *
     * @example
     * ```javascript
     * const authCredential = EmailAuthProvider.credential(email, password);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * ```javascript
     * const userCredential = await signInWithEmailAndPassword(auth, email, password);
     * ```
     *
     * @param email - Email address.
     * @param password - User account password.
     * @returns The auth provider credential.
     */
    EmailAuthProvider.credential = function (email, password) {
        return EmailAuthCredential._fromEmailAndPassword(email, password);
    };
    /**
     * Initialize an {@link AuthCredential} using an email and an email link after a sign in with
     * email link operation.
     *
     * @example
     * ```javascript
     * const authCredential = EmailAuthProvider.credentialWithLink(auth, email, emailLink);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * ```javascript
     * await sendSignInLinkToEmail(auth, email);
     * // Obtain emailLink from user.
     * const userCredential = await signInWithEmailLink(auth, email, emailLink);
     * ```
     *
     * @param auth - The {@link Auth} instance used to verify the link.
     * @param email - Email address.
     * @param emailLink - Sign-in email link.
     * @returns - The auth provider credential.
     */
    EmailAuthProvider.credentialWithLink = function (email, emailLink) {
        var actionCodeUrl = ActionCodeURL.parseLink(emailLink);
        _assert(actionCodeUrl, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
    };
    /**
     * Always set to {@link ProviderId}.PASSWORD, even for email link.
     */
    EmailAuthProvider.PROVIDER_ID = "password" /* ProviderId.PASSWORD */;
    /**
     * Always set to {@link SignInMethod}.EMAIL_PASSWORD.
     */
    EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password" /* SignInMethod.EMAIL_PASSWORD */;
    /**
     * Always set to {@link SignInMethod}.EMAIL_LINK.
     */
    EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink" /* SignInMethod.EMAIL_LINK */;
    return EmailAuthProvider;
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
/**
 * The base class for all Federated providers (OAuth (including OIDC), SAML).
 *
 * This class is not meant to be instantiated directly.
 *
 * @public
 */
var FederatedAuthProvider = /** @class */ (function () {
    /**
     * Constructor for generic OAuth providers.
     *
     * @param providerId - Provider for which credentials should be generated.
     */
    function FederatedAuthProvider(providerId) {
        this.providerId = providerId;
        /** @internal */
        this.defaultLanguageCode = null;
        /** @internal */
        this.customParameters = {};
    }
    /**
     * Set the language gode.
     *
     * @param languageCode - language code
     */
    FederatedAuthProvider.prototype.setDefaultLanguage = function (languageCode) {
        this.defaultLanguageCode = languageCode;
    };
    /**
     * Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
     * operations.
     *
     * @remarks
     * For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
     * `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
     *
     * @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
     */
    FederatedAuthProvider.prototype.setCustomParameters = function (customOAuthParameters) {
        this.customParameters = customOAuthParameters;
        return this;
    };
    /**
     * Retrieve the current list of {@link CustomParameters}.
     */
    FederatedAuthProvider.prototype.getCustomParameters = function () {
        return this.customParameters;
    };
    return FederatedAuthProvider;
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
/**
 * Common code to all OAuth providers. This is separate from the
 * {@link OAuthProvider} so that child providers (like
 * {@link GoogleAuthProvider}) don't inherit the `credential` instance method.
 * Instead, they rely on a static `credential` method.
 */
var BaseOAuthProvider = /** @class */ (function (_super) {
    __extends(BaseOAuthProvider, _super);
    function BaseOAuthProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @internal */
        _this.scopes = [];
        return _this;
    }
    /**
     * Add an OAuth scope to the credential.
     *
     * @param scope - Provider OAuth scope to add.
     */
    BaseOAuthProvider.prototype.addScope = function (scope) {
        // If not already added, add scope to list.
        if (!this.scopes.includes(scope)) {
            this.scopes.push(scope);
        }
        return this;
    };
    /**
     * Retrieve the current list of OAuth scopes.
     */
    BaseOAuthProvider.prototype.getScopes = function () {
        return __spreadArray([], this.scopes, true);
    };
    return BaseOAuthProvider;
}(FederatedAuthProvider));
/**
 * Provider for generating generic {@link OAuthCredential}.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new OAuthProvider('google.com');
 * // Start a sign in process for an unauthenticated user.
 * provider.addScope('profile');
 * provider.addScope('email');
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a OAuth Access Token for the provider.
 *   const credential = provider.credentialFromResult(auth, result);
 *   const token = credential.accessToken;
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new OAuthProvider('google.com');
 * provider.addScope('profile');
 * provider.addScope('email');
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a OAuth Access Token for the provider.
 * const credential = provider.credentialFromResult(auth, result);
 * const token = credential.accessToken;
 * ```
 * @public
 */
var OAuthProvider = /** @class */ (function (_super) {
    __extends(OAuthProvider, _super);
    function OAuthProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates an {@link OAuthCredential} from a JSON string or a plain object.
     * @param json - A plain object or a JSON string
     */
    OAuthProvider.credentialFromJSON = function (json) {
        var obj = typeof json === 'string' ? JSON.parse(json) : json;
        _assert('providerId' in obj && 'signInMethod' in obj, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        return OAuthCredential._fromParams(obj);
    };
    /**
     * Creates a {@link OAuthCredential} from a generic OAuth provider's access token or ID token.
     *
     * @remarks
     * The raw nonce is required when an ID token with a nonce field is provided. The SHA-256 hash of
     * the raw nonce must match the nonce field in the ID token.
     *
     * @example
     * ```javascript
     * // `googleUser` from the onsuccess Google Sign In callback.
     * // Initialize a generate OAuth provider with a `google.com` providerId.
     * const provider = new OAuthProvider('google.com');
     * const credential = provider.credential({
     *   idToken: googleUser.getAuthResponse().id_token,
     * });
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param params - Either the options object containing the ID token, access token and raw nonce
     * or the ID token string.
     */
    OAuthProvider.prototype.credential = function (params) {
        return this._credential(__assign(__assign({}, params), { nonce: params.rawNonce }));
    };
    /** An internal credential method that accepts more permissive options */
    OAuthProvider.prototype._credential = function (params) {
        _assert(params.idToken || params.accessToken, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        // For OAuthCredential, sign in method is same as providerId.
        return OAuthCredential._fromParams(__assign(__assign({}, params), { providerId: this.providerId, signInMethod: this.providerId }));
    };
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    OAuthProvider.credentialFromResult = function (userCredential) {
        return OAuthProvider.oauthCredentialFromTaggedObject(userCredential);
    };
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    OAuthProvider.credentialFromError = function (error) {
        return OAuthProvider.oauthCredentialFromTaggedObject((error.customData || {}));
    };
    OAuthProvider.oauthCredentialFromTaggedObject = function (_a) {
        var tokenResponse = _a._tokenResponse;
        if (!tokenResponse) {
            return null;
        }
        var _b = tokenResponse, oauthIdToken = _b.oauthIdToken, oauthAccessToken = _b.oauthAccessToken, oauthTokenSecret = _b.oauthTokenSecret, pendingToken = _b.pendingToken, nonce = _b.nonce, providerId = _b.providerId;
        if (!oauthAccessToken &&
            !oauthTokenSecret &&
            !oauthIdToken &&
            !pendingToken) {
            return null;
        }
        if (!providerId) {
            return null;
        }
        try {
            return new OAuthProvider(providerId)._credential({
                idToken: oauthIdToken,
                accessToken: oauthAccessToken,
                nonce: nonce,
                pendingToken: pendingToken
            });
        }
        catch (e) {
            return null;
        }
    };
    return OAuthProvider;
}(BaseOAuthProvider));

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
 * Provider for generating an {@link OAuthCredential} for {@link ProviderId}.FACEBOOK.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new FacebookAuthProvider();
 * // Start a sign in process for an unauthenticated user.
 * provider.addScope('user_birthday');
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Facebook Access Token.
 *   const credential = FacebookAuthProvider.credentialFromResult(result);
 *   const token = credential.accessToken;
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new FacebookAuthProvider();
 * provider.addScope('user_birthday');
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Facebook Access Token.
 * const credential = FacebookAuthProvider.credentialFromResult(result);
 * const token = credential.accessToken;
 * ```
 *
 * @public
 */
var FacebookAuthProvider = /** @class */ (function (_super) {
    __extends(FacebookAuthProvider, _super);
    function FacebookAuthProvider() {
        return _super.call(this, "facebook.com" /* ProviderId.FACEBOOK */) || this;
    }
    /**
     * Creates a credential for Facebook.
     *
     * @example
     * ```javascript
     * // `event` from the Facebook auth.authResponseChange callback.
     * const credential = FacebookAuthProvider.credential(event.authResponse.accessToken);
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param accessToken - Facebook access token.
     */
    FacebookAuthProvider.credential = function (accessToken) {
        return OAuthCredential._fromParams({
            providerId: FacebookAuthProvider.PROVIDER_ID,
            signInMethod: FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
            accessToken: accessToken
        });
    };
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    FacebookAuthProvider.credentialFromResult = function (userCredential) {
        return FacebookAuthProvider.credentialFromTaggedObject(userCredential);
    };
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    FacebookAuthProvider.credentialFromError = function (error) {
        return FacebookAuthProvider.credentialFromTaggedObject((error.customData || {}));
    };
    FacebookAuthProvider.credentialFromTaggedObject = function (_a) {
        var tokenResponse = _a._tokenResponse;
        if (!tokenResponse || !('oauthAccessToken' in tokenResponse)) {
            return null;
        }
        if (!tokenResponse.oauthAccessToken) {
            return null;
        }
        try {
            return FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
        }
        catch (_b) {
            return null;
        }
    };
    /** Always set to {@link SignInMethod}.FACEBOOK. */
    FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com" /* SignInMethod.FACEBOOK */;
    /** Always set to {@link ProviderId}.FACEBOOK. */
    FacebookAuthProvider.PROVIDER_ID = "facebook.com" /* ProviderId.FACEBOOK */;
    return FacebookAuthProvider;
}(BaseOAuthProvider));

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
 * Provider for generating an an {@link OAuthCredential} for {@link ProviderId}.GOOGLE.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new GoogleAuthProvider();
 * // Start a sign in process for an unauthenticated user.
 * provider.addScope('profile');
 * provider.addScope('email');
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Google Access Token.
 *   const credential = GoogleAuthProvider.credentialFromResult(result);
 *   const token = credential.accessToken;
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new GoogleAuthProvider();
 * provider.addScope('profile');
 * provider.addScope('email');
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Google Access Token.
 * const credential = GoogleAuthProvider.credentialFromResult(result);
 * const token = credential.accessToken;
 * ```
 *
 * @public
 */
var GoogleAuthProvider = /** @class */ (function (_super) {
    __extends(GoogleAuthProvider, _super);
    function GoogleAuthProvider() {
        var _this = _super.call(this, "google.com" /* ProviderId.GOOGLE */) || this;
        _this.addScope('profile');
        return _this;
    }
    /**
     * Creates a credential for Google. At least one of ID token and access token is required.
     *
     * @example
     * ```javascript
     * // \`googleUser\` from the onsuccess Google Sign In callback.
     * const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param idToken - Google ID token.
     * @param accessToken - Google access token.
     */
    GoogleAuthProvider.credential = function (idToken, accessToken) {
        return OAuthCredential._fromParams({
            providerId: GoogleAuthProvider.PROVIDER_ID,
            signInMethod: GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
            idToken: idToken,
            accessToken: accessToken
        });
    };
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    GoogleAuthProvider.credentialFromResult = function (userCredential) {
        return GoogleAuthProvider.credentialFromTaggedObject(userCredential);
    };
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    GoogleAuthProvider.credentialFromError = function (error) {
        return GoogleAuthProvider.credentialFromTaggedObject((error.customData || {}));
    };
    GoogleAuthProvider.credentialFromTaggedObject = function (_a) {
        var tokenResponse = _a._tokenResponse;
        if (!tokenResponse) {
            return null;
        }
        var _b = tokenResponse, oauthIdToken = _b.oauthIdToken, oauthAccessToken = _b.oauthAccessToken;
        if (!oauthIdToken && !oauthAccessToken) {
            // This could be an oauth 1 credential or a phone credential
            return null;
        }
        try {
            return GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
        }
        catch (_c) {
            return null;
        }
    };
    /** Always set to {@link SignInMethod}.GOOGLE. */
    GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com" /* SignInMethod.GOOGLE */;
    /** Always set to {@link ProviderId}.GOOGLE. */
    GoogleAuthProvider.PROVIDER_ID = "google.com" /* ProviderId.GOOGLE */;
    return GoogleAuthProvider;
}(BaseOAuthProvider));

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
 * Provider for generating an {@link OAuthCredential} for {@link ProviderId}.GITHUB.
 *
 * @remarks
 * GitHub requires an OAuth 2.0 redirect, so you can either handle the redirect directly, or use
 * the {@link signInWithPopup} handler:
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new GithubAuthProvider();
 * // Start a sign in process for an unauthenticated user.
 * provider.addScope('repo');
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Github Access Token.
 *   const credential = GithubAuthProvider.credentialFromResult(result);
 *   const token = credential.accessToken;
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new GithubAuthProvider();
 * provider.addScope('repo');
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Github Access Token.
 * const credential = GithubAuthProvider.credentialFromResult(result);
 * const token = credential.accessToken;
 * ```
 * @public
 */
var GithubAuthProvider = /** @class */ (function (_super) {
    __extends(GithubAuthProvider, _super);
    function GithubAuthProvider() {
        return _super.call(this, "github.com" /* ProviderId.GITHUB */) || this;
    }
    /**
     * Creates a credential for Github.
     *
     * @param accessToken - Github access token.
     */
    GithubAuthProvider.credential = function (accessToken) {
        return OAuthCredential._fromParams({
            providerId: GithubAuthProvider.PROVIDER_ID,
            signInMethod: GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
            accessToken: accessToken
        });
    };
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    GithubAuthProvider.credentialFromResult = function (userCredential) {
        return GithubAuthProvider.credentialFromTaggedObject(userCredential);
    };
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    GithubAuthProvider.credentialFromError = function (error) {
        return GithubAuthProvider.credentialFromTaggedObject((error.customData || {}));
    };
    GithubAuthProvider.credentialFromTaggedObject = function (_a) {
        var tokenResponse = _a._tokenResponse;
        if (!tokenResponse || !('oauthAccessToken' in tokenResponse)) {
            return null;
        }
        if (!tokenResponse.oauthAccessToken) {
            return null;
        }
        try {
            return GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
        }
        catch (_b) {
            return null;
        }
    };
    /** Always set to {@link SignInMethod}.GITHUB. */
    GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com" /* SignInMethod.GITHUB */;
    /** Always set to {@link ProviderId}.GITHUB. */
    GithubAuthProvider.PROVIDER_ID = "github.com" /* ProviderId.GITHUB */;
    return GithubAuthProvider;
}(BaseOAuthProvider));

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
var IDP_REQUEST_URI = 'http://localhost';
/**
 * @public
 */
var SAMLAuthCredential = /** @class */ (function (_super) {
    __extends(SAMLAuthCredential, _super);
    /** @internal */
    function SAMLAuthCredential(providerId, pendingToken) {
        var _this = _super.call(this, providerId, providerId) || this;
        _this.pendingToken = pendingToken;
        return _this;
    }
    /** @internal */
    SAMLAuthCredential.prototype._getIdTokenResponse = function (auth) {
        var request = this.buildRequest();
        return signInWithIdp(auth, request);
    };
    /** @internal */
    SAMLAuthCredential.prototype._linkToIdToken = function (auth, idToken) {
        var request = this.buildRequest();
        request.idToken = idToken;
        return signInWithIdp(auth, request);
    };
    /** @internal */
    SAMLAuthCredential.prototype._getReauthenticationResolver = function (auth) {
        var request = this.buildRequest();
        request.autoCreate = false;
        return signInWithIdp(auth, request);
    };
    /** {@inheritdoc AuthCredential.toJSON}  */
    SAMLAuthCredential.prototype.toJSON = function () {
        return {
            signInMethod: this.signInMethod,
            providerId: this.providerId,
            pendingToken: this.pendingToken
        };
    };
    /**
     * Static method to deserialize a JSON representation of an object into an
     * {@link  AuthCredential}.
     *
     * @param json - Input can be either Object or the stringified representation of the object.
     * When string is provided, JSON.parse would be called first.
     *
     * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
     */
    SAMLAuthCredential.fromJSON = function (json) {
        var obj = typeof json === 'string' ? JSON.parse(json) : json;
        var providerId = obj.providerId, signInMethod = obj.signInMethod, pendingToken = obj.pendingToken;
        if (!providerId ||
            !signInMethod ||
            !pendingToken ||
            providerId !== signInMethod) {
            return null;
        }
        return new SAMLAuthCredential(providerId, pendingToken);
    };
    /**
     * Helper static method to avoid exposing the constructor to end users.
     *
     * @internal
     */
    SAMLAuthCredential._create = function (providerId, pendingToken) {
        return new SAMLAuthCredential(providerId, pendingToken);
    };
    SAMLAuthCredential.prototype.buildRequest = function () {
        return {
            requestUri: IDP_REQUEST_URI,
            returnSecureToken: true,
            pendingToken: this.pendingToken
        };
    };
    return SAMLAuthCredential;
}(AuthCredential));

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
var SAML_PROVIDER_PREFIX = 'saml.';
/**
 * An {@link AuthProvider} for SAML.
 *
 * @public
 */
var SAMLAuthProvider = /** @class */ (function (_super) {
    __extends(SAMLAuthProvider, _super);
    /**
     * Constructor. The providerId must start with "saml."
     * @param providerId - SAML provider ID.
     */
    function SAMLAuthProvider(providerId) {
        _assert(providerId.startsWith(SAML_PROVIDER_PREFIX), "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        return _super.call(this, providerId) || this;
    }
    /**
     * Generates an {@link AuthCredential} from a {@link UserCredential} after a
     * successful SAML flow completes.
     *
     * @remarks
     *
     * For example, to get an {@link AuthCredential}, you could write the
     * following code:
     *
     * ```js
     * const userCredential = await signInWithPopup(auth, samlProvider);
     * const credential = SAMLAuthProvider.credentialFromResult(userCredential);
     * ```
     *
     * @param userCredential - The user credential.
     */
    SAMLAuthProvider.credentialFromResult = function (userCredential) {
        return SAMLAuthProvider.samlCredentialFromTaggedObject(userCredential);
    };
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    SAMLAuthProvider.credentialFromError = function (error) {
        return SAMLAuthProvider.samlCredentialFromTaggedObject((error.customData || {}));
    };
    /**
     * Creates an {@link AuthCredential} from a JSON string or a plain object.
     * @param json - A plain object or a JSON string
     */
    SAMLAuthProvider.credentialFromJSON = function (json) {
        var credential = SAMLAuthCredential.fromJSON(json);
        _assert(credential, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        return credential;
    };
    SAMLAuthProvider.samlCredentialFromTaggedObject = function (_a) {
        var tokenResponse = _a._tokenResponse;
        if (!tokenResponse) {
            return null;
        }
        var _b = tokenResponse, pendingToken = _b.pendingToken, providerId = _b.providerId;
        if (!pendingToken || !providerId) {
            return null;
        }
        try {
            return SAMLAuthCredential._create(providerId, pendingToken);
        }
        catch (e) {
            return null;
        }
    };
    return SAMLAuthProvider;
}(FederatedAuthProvider));

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
 * Provider for generating an {@link OAuthCredential} for {@link ProviderId}.TWITTER.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new TwitterAuthProvider();
 * // Start a sign in process for an unauthenticated user.
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Twitter Access Token and Secret.
 *   const credential = TwitterAuthProvider.credentialFromResult(result);
 *   const token = credential.accessToken;
 *   const secret = credential.secret;
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new TwitterAuthProvider();
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Twitter Access Token and Secret.
 * const credential = TwitterAuthProvider.credentialFromResult(result);
 * const token = credential.accessToken;
 * const secret = credential.secret;
 * ```
 *
 * @public
 */
var TwitterAuthProvider = /** @class */ (function (_super) {
    __extends(TwitterAuthProvider, _super);
    function TwitterAuthProvider() {
        return _super.call(this, "twitter.com" /* ProviderId.TWITTER */) || this;
    }
    /**
     * Creates a credential for Twitter.
     *
     * @param token - Twitter access token.
     * @param secret - Twitter secret.
     */
    TwitterAuthProvider.credential = function (token, secret) {
        return OAuthCredential._fromParams({
            providerId: TwitterAuthProvider.PROVIDER_ID,
            signInMethod: TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
            oauthToken: token,
            oauthTokenSecret: secret
        });
    };
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    TwitterAuthProvider.credentialFromResult = function (userCredential) {
        return TwitterAuthProvider.credentialFromTaggedObject(userCredential);
    };
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    TwitterAuthProvider.credentialFromError = function (error) {
        return TwitterAuthProvider.credentialFromTaggedObject((error.customData || {}));
    };
    TwitterAuthProvider.credentialFromTaggedObject = function (_a) {
        var tokenResponse = _a._tokenResponse;
        if (!tokenResponse) {
            return null;
        }
        var _b = tokenResponse, oauthAccessToken = _b.oauthAccessToken, oauthTokenSecret = _b.oauthTokenSecret;
        if (!oauthAccessToken || !oauthTokenSecret) {
            return null;
        }
        try {
            return TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
        }
        catch (_c) {
            return null;
        }
    };
    /** Always set to {@link SignInMethod}.TWITTER. */
    TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com" /* SignInMethod.TWITTER */;
    /** Always set to {@link ProviderId}.TWITTER. */
    TwitterAuthProvider.PROVIDER_ID = "twitter.com" /* ProviderId.TWITTER */;
    return TwitterAuthProvider;
}(BaseOAuthProvider));

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
function signUp(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performSignInRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:signUp" /* Endpoint.SIGN_UP */, _addTidIfNecessary(auth, request))];
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
var UserCredentialImpl = /** @class */ (function () {
    function UserCredentialImpl(params) {
        this.user = params.user;
        this.providerId = params.providerId;
        this._tokenResponse = params._tokenResponse;
        this.operationType = params.operationType;
    }
    UserCredentialImpl._fromIdTokenResponse = function (auth, operationType, idTokenResponse, isAnonymous) {
        if (isAnonymous === void 0) { isAnonymous = false; }
        return __awaiter(this, void 0, void 0, function () {
            var user, providerId, userCred;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, UserImpl._fromIdTokenResponse(auth, idTokenResponse, isAnonymous)];
                    case 1:
                        user = _a.sent();
                        providerId = providerIdForResponse(idTokenResponse);
                        userCred = new UserCredentialImpl({
                            user: user,
                            providerId: providerId,
                            _tokenResponse: idTokenResponse,
                            operationType: operationType
                        });
                        return [2 /*return*/, userCred];
                }
            });
        });
    };
    UserCredentialImpl._forOperation = function (user, operationType, response) {
        return __awaiter(this, void 0, void 0, function () {
            var providerId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user._updateTokensIfNecessary(response, /* reload */ true)];
                    case 1:
                        _a.sent();
                        providerId = providerIdForResponse(response);
                        return [2 /*return*/, new UserCredentialImpl({
                                user: user,
                                providerId: providerId,
                                _tokenResponse: response,
                                operationType: operationType
                            })];
                }
            });
        });
    };
    return UserCredentialImpl;
}());
function providerIdForResponse(response) {
    if (response.providerId) {
        return response.providerId;
    }
    if ('phoneNumber' in response) {
        return "phone" /* ProviderId.PHONE */;
    }
    return null;
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
 * Asynchronously signs in as an anonymous user.
 *
 * @remarks
 * If there is already an anonymous user signed in, that user will be returned; otherwise, a
 * new anonymous user identity will be created and returned.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
function signInAnonymously(auth) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var authInternal, response, userCredential;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    authInternal = _castAuth(auth);
                    return [4 /*yield*/, authInternal._initializationPromise];
                case 1:
                    _b.sent();
                    if ((_a = authInternal.currentUser) === null || _a === void 0 ? void 0 : _a.isAnonymous) {
                        // If an anonymous user is already signed in, no need to sign them in again.
                        return [2 /*return*/, new UserCredentialImpl({
                                user: authInternal.currentUser,
                                providerId: null,
                                operationType: "signIn" /* OperationType.SIGN_IN */
                            })];
                    }
                    return [4 /*yield*/, signUp(authInternal, {
                            returnSecureToken: true
                        })];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn" /* OperationType.SIGN_IN */, response, true)];
                case 3:
                    userCredential = _b.sent();
                    return [4 /*yield*/, authInternal._updateCurrentUser(userCredential.user)];
                case 4:
                    _b.sent();
                    return [2 /*return*/, userCredential];
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
var MultiFactorError = /** @class */ (function (_super) {
    __extends(MultiFactorError, _super);
    function MultiFactorError(auth, error, operationType, user) {
        var _this = this;
        var _a;
        _this = _super.call(this, error.code, error.message) || this;
        _this.operationType = operationType;
        _this.user = user;
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(_this, MultiFactorError.prototype);
        _this.customData = {
            appName: auth.name,
            tenantId: (_a = auth.tenantId) !== null && _a !== void 0 ? _a : undefined,
            _serverResponse: error.customData._serverResponse,
            operationType: operationType
        };
        return _this;
    }
    MultiFactorError._fromErrorAndOperation = function (auth, error, operationType, user) {
        return new MultiFactorError(auth, error, operationType, user);
    };
    return MultiFactorError;
}(FirebaseError));
function _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user) {
    var idTokenProvider = operationType === "reauthenticate" /* OperationType.REAUTHENTICATE */
        ? credential._getReauthenticationResolver(auth)
        : credential._getIdTokenResponse(auth);
    return idTokenProvider.catch(function (error) {
        if (error.code === "auth/".concat("multi-factor-auth-required" /* AuthErrorCode.MFA_REQUIRED */)) {
            throw MultiFactorError._fromErrorAndOperation(auth, error, operationType, user);
        }
        throw error;
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
 * Takes a set of UserInfo provider data and converts it to a set of names
 */
function providerDataAsNames(providerData) {
    return new Set(providerData
        .map(function (_a) {
        var providerId = _a.providerId;
        return providerId;
    })
        .filter(function (pid) { return !!pid; }));
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
 * Unlinks a provider from a user account.
 *
 * @param user - The user.
 * @param providerId - The provider to unlink.
 *
 * @public
 */
function unlink(user, providerId) {
    return __awaiter(this, void 0, void 0, function () {
        var userInternal, providerUserInfo, _a, _b, providersLeft;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    userInternal = getModularInstance(user);
                    return [4 /*yield*/, _assertLinkedStatus(true, userInternal, providerId)];
                case 1:
                    _d.sent();
                    _a = deleteLinkedAccounts;
                    _b = [userInternal.auth];
                    _c = {};
                    return [4 /*yield*/, userInternal.getIdToken()];
                case 2: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.idToken = _d.sent(),
                            _c.deleteProvider = [providerId],
                            _c)]))];
                case 3:
                    providerUserInfo = (_d.sent()).providerUserInfo;
                    providersLeft = providerDataAsNames(providerUserInfo || []);
                    userInternal.providerData = userInternal.providerData.filter(function (pd) {
                        return providersLeft.has(pd.providerId);
                    });
                    if (!providersLeft.has("phone" /* ProviderId.PHONE */)) {
                        userInternal.phoneNumber = null;
                    }
                    return [4 /*yield*/, userInternal.auth._persistUserIfCurrent(userInternal)];
                case 4:
                    _d.sent();
                    return [2 /*return*/, userInternal];
            }
        });
    });
}
function _link$1(user, credential, bypassAuthState) {
    if (bypassAuthState === void 0) { bypassAuthState = false; }
    return __awaiter(this, void 0, void 0, function () {
        var response, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = _logoutIfInvalidated;
                    _b = [user];
                    _d = (_c = credential)._linkToIdToken;
                    _e = [user.auth];
                    return [4 /*yield*/, user.getIdToken()];
                case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_d.apply(_c, _e.concat([_f.sent()])),
                        bypassAuthState]))];
                case 2:
                    response = _f.sent();
                    return [2 /*return*/, UserCredentialImpl._forOperation(user, "link" /* OperationType.LINK */, response)];
            }
        });
    });
}
function _assertLinkedStatus(expected, user, provider) {
    return __awaiter(this, void 0, void 0, function () {
        var providerIds, code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _reloadWithoutSaving(user)];
                case 1:
                    _a.sent();
                    providerIds = providerDataAsNames(user.providerData);
                    code = expected === false
                        ? "provider-already-linked" /* AuthErrorCode.PROVIDER_ALREADY_LINKED */
                        : "no-such-provider" /* AuthErrorCode.NO_SUCH_PROVIDER */;
                    _assert(providerIds.has(provider) === expected, user.auth, code);
                    return [2 /*return*/];
            }
        });
    });
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
function _reauthenticate(user, credential, bypassAuthState) {
    if (bypassAuthState === void 0) { bypassAuthState = false; }
    return __awaiter(this, void 0, void 0, function () {
        var auth, operationType, response, parsed, localId, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auth = user.auth;
                    operationType = "reauthenticate" /* OperationType.REAUTHENTICATE */;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user), bypassAuthState)];
                case 2:
                    response = _a.sent();
                    _assert(response.idToken, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                    parsed = _parseToken(response.idToken);
                    _assert(parsed, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                    localId = parsed.sub;
                    _assert(user.uid === localId, auth, "user-mismatch" /* AuthErrorCode.USER_MISMATCH */);
                    return [2 /*return*/, UserCredentialImpl._forOperation(user, operationType, response)];
                case 3:
                    e_1 = _a.sent();
                    // Convert user deleted error into user mismatch
                    if ((e_1 === null || e_1 === void 0 ? void 0 : e_1.code) === "auth/".concat("user-not-found" /* AuthErrorCode.USER_DELETED */)) {
                        _fail(auth, "user-mismatch" /* AuthErrorCode.USER_MISMATCH */);
                    }
                    throw e_1;
                case 4: return [2 /*return*/];
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
function _signInWithCredential(auth, credential, bypassAuthState) {
    if (bypassAuthState === void 0) { bypassAuthState = false; }
    return __awaiter(this, void 0, void 0, function () {
        var operationType, response, userCredential;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    operationType = "signIn" /* OperationType.SIGN_IN */;
                    return [4 /*yield*/, _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, UserCredentialImpl._fromIdTokenResponse(auth, operationType, response)];
                case 2:
                    userCredential = _a.sent();
                    if (!!bypassAuthState) return [3 /*break*/, 4];
                    return [4 /*yield*/, auth._updateCurrentUser(userCredential.user)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, userCredential];
            }
        });
    });
}
/**
 * Asynchronously signs in with the given credentials.
 *
 * @remarks
 * An {@link AuthProvider} can be used to generate the credential.
 *
 * @param auth - The {@link Auth} instance.
 * @param credential - The auth credential.
 *
 * @public
 */
function signInWithCredential(auth, credential) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _signInWithCredential(_castAuth(auth), credential)];
        });
    });
}
/**
 * Links the user account with the given credentials.
 *
 * @remarks
 * An {@link AuthProvider} can be used to generate the credential.
 *
 * @param user - The user.
 * @param credential - The auth credential.
 *
 * @public
 */
function linkWithCredential(user, credential) {
    return __awaiter(this, void 0, void 0, function () {
        var userInternal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userInternal = getModularInstance(user);
                    return [4 /*yield*/, _assertLinkedStatus(false, userInternal, credential.providerId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, _link$1(userInternal, credential)];
            }
        });
    });
}
/**
 * Re-authenticates a user using a fresh credential.
 *
 * @remarks
 * Use before operations such as {@link updatePassword} that require tokens from recent sign-in
 * attempts. This method can be used to recover from a `CREDENTIAL_TOO_OLD_LOGIN_AGAIN` error
 * or a `TOKEN_EXPIRED` error.
 *
 * @param user - The user.
 * @param credential - The auth credential.
 *
 * @public
 */
function reauthenticateWithCredential(user, credential) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _reauthenticate(getModularInstance(user), credential)];
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
function signInWithCustomToken$1(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performSignInRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:signInWithCustomToken" /* Endpoint.SIGN_IN_WITH_CUSTOM_TOKEN */, _addTidIfNecessary(auth, request))];
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
 * Asynchronously signs in using a custom token.
 *
 * @remarks
 * Custom tokens are used to integrate Firebase Auth with existing auth systems, and must
 * be generated by an auth backend using the
 * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#createcustomtoken | createCustomToken}
 * method in the {@link https://firebase.google.com/docs/auth/admin | Admin SDK} .
 *
 * Fails with an error if the token is invalid, expired, or not accepted by the Firebase Auth service.
 *
 * @param auth - The {@link Auth} instance.
 * @param customToken - The custom token to sign in with.
 *
 * @public
 */
function signInWithCustomToken(auth, customToken) {
    return __awaiter(this, void 0, void 0, function () {
        var authInternal, response, cred;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = _castAuth(auth);
                    return [4 /*yield*/, signInWithCustomToken$1(authInternal, {
                            token: customToken,
                            returnSecureToken: true
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn" /* OperationType.SIGN_IN */, response)];
                case 2:
                    cred = _a.sent();
                    return [4 /*yield*/, authInternal._updateCurrentUser(cred.user)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, cred];
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
var MultiFactorInfoImpl = /** @class */ (function () {
    function MultiFactorInfoImpl(factorId, response) {
        this.factorId = factorId;
        this.uid = response.mfaEnrollmentId;
        this.enrollmentTime = new Date(response.enrolledAt).toUTCString();
        this.displayName = response.displayName;
    }
    MultiFactorInfoImpl._fromServerResponse = function (auth, enrollment) {
        if ('phoneInfo' in enrollment) {
            return PhoneMultiFactorInfoImpl._fromServerResponse(auth, enrollment);
        }
        else if ('totpInfo' in enrollment) {
            return TotpMultiFactorInfoImpl._fromServerResponse(auth, enrollment);
        }
        return _fail(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    };
    return MultiFactorInfoImpl;
}());
var PhoneMultiFactorInfoImpl = /** @class */ (function (_super) {
    __extends(PhoneMultiFactorInfoImpl, _super);
    function PhoneMultiFactorInfoImpl(response) {
        var _this = _super.call(this, "phone" /* FactorId.PHONE */, response) || this;
        _this.phoneNumber = response.phoneInfo;
        return _this;
    }
    PhoneMultiFactorInfoImpl._fromServerResponse = function (_auth, enrollment) {
        return new PhoneMultiFactorInfoImpl(enrollment);
    };
    return PhoneMultiFactorInfoImpl;
}(MultiFactorInfoImpl));
var TotpMultiFactorInfoImpl = /** @class */ (function (_super) {
    __extends(TotpMultiFactorInfoImpl, _super);
    function TotpMultiFactorInfoImpl(response) {
        return _super.call(this, "totp" /* FactorId.TOTP */, response) || this;
    }
    TotpMultiFactorInfoImpl._fromServerResponse = function (_auth, enrollment) {
        return new TotpMultiFactorInfoImpl(enrollment);
    };
    return TotpMultiFactorInfoImpl;
}(MultiFactorInfoImpl));

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
function _setActionCodeSettingsOnRequest(auth, request, actionCodeSettings) {
    var _a;
    _assert(((_a = actionCodeSettings.url) === null || _a === void 0 ? void 0 : _a.length) > 0, auth, "invalid-continue-uri" /* AuthErrorCode.INVALID_CONTINUE_URI */);
    _assert(typeof actionCodeSettings.dynamicLinkDomain === 'undefined' ||
        actionCodeSettings.dynamicLinkDomain.length > 0, auth, "invalid-dynamic-link-domain" /* AuthErrorCode.INVALID_DYNAMIC_LINK_DOMAIN */);
    request.continueUrl = actionCodeSettings.url;
    request.dynamicLinkDomain = actionCodeSettings.dynamicLinkDomain;
    request.canHandleCodeInApp = actionCodeSettings.handleCodeInApp;
    if (actionCodeSettings.iOS) {
        _assert(actionCodeSettings.iOS.bundleId.length > 0, auth, "missing-ios-bundle-id" /* AuthErrorCode.MISSING_IOS_BUNDLE_ID */);
        request.iOSBundleId = actionCodeSettings.iOS.bundleId;
    }
    if (actionCodeSettings.android) {
        _assert(actionCodeSettings.android.packageName.length > 0, auth, "missing-android-pkg-name" /* AuthErrorCode.MISSING_ANDROID_PACKAGE_NAME */);
        request.androidInstallApp = actionCodeSettings.android.installApp;
        request.androidMinimumVersionCode =
            actionCodeSettings.android.minimumVersion;
        request.androidPackageName = actionCodeSettings.android.packageName;
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
/**
 * Updates the password policy cached in the {@link Auth} instance if a policy is already
 * cached for the project or tenant.
 *
 * @remarks
 * We only fetch the password policy if the password did not meet policy requirements and
 * there is an existing policy cached. A developer must call validatePassword at least
 * once for the cache to be automatically updated.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @private
 */
function recachePasswordPolicy(auth) {
    return __awaiter(this, void 0, void 0, function () {
        var authInternal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = _castAuth(auth);
                    if (!authInternal._getPasswordPolicyInternal()) return [3 /*break*/, 2];
                    return [4 /*yield*/, authInternal._updatePasswordPolicy()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
/**
 * Sends a password reset email to the given email address. This method does not throw an error when
 * there's no user account with the given email address and
 * [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection) is enabled.
 *
 * @remarks
 * To complete the password reset, call {@link confirmPasswordReset} with the code supplied in
 * the email sent to the user, along with the new password specified by the user.
 *
 * @example
 * ```javascript
 * const actionCodeSettings = {
 *   url: 'https://www.example.com/?email=user@example.com',
 *   iOS: {
 *      bundleId: 'com.example.ios'
 *   },
 *   android: {
 *     packageName: 'com.example.android',
 *     installApp: true,
 *     minimumVersion: '12'
 *   },
 *   handleCodeInApp: true
 * };
 * await sendPasswordResetEmail(auth, 'user@example.com', actionCodeSettings);
 * // Obtain code from user.
 * await confirmPasswordReset('user@example.com', code);
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param email - The user's email address.
 * @param actionCodeSettings - The {@link ActionCodeSettings}.
 *
 * @public
 */
function sendPasswordResetEmail(auth, email, actionCodeSettings) {
    return __awaiter(this, void 0, void 0, function () {
        var authInternal, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = _castAuth(auth);
                    request = {
                        requestType: "PASSWORD_RESET" /* ActionCodeOperation.PASSWORD_RESET */,
                        email: email,
                        clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */
                    };
                    if (actionCodeSettings) {
                        _setActionCodeSettingsOnRequest(authInternal, request, actionCodeSettings);
                    }
                    return [4 /*yield*/, handleRecaptchaFlow(authInternal, request, "getOobCode" /* RecaptchaActionName.GET_OOB_CODE */, sendPasswordResetEmail$1)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Completes the password reset process, given a confirmation code and new password.
 *
 * @param auth - The {@link Auth} instance.
 * @param oobCode - A confirmation code sent to the user.
 * @param newPassword - The new password.
 *
 * @public
 */
function confirmPasswordReset(auth, oobCode, newPassword) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resetPassword(getModularInstance(auth), {
                        oobCode: oobCode,
                        newPassword: newPassword
                    })
                        .catch(function (error) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (error.code ===
                                "auth/".concat("password-does-not-meet-requirements" /* AuthErrorCode.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */)) {
                                void recachePasswordPolicy(auth);
                            }
                            throw error;
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Applies a verification code sent to the user by email or other out-of-band mechanism.
 *
 * @param auth - The {@link Auth} instance.
 * @param oobCode - A verification code sent to the user.
 *
 * @public
 */
function applyActionCode(auth, oobCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, applyActionCode$1(getModularInstance(auth), { oobCode: oobCode })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Checks a verification code sent to the user by email or other out-of-band mechanism.
 *
 * @returns metadata about the code.
 *
 * @param auth - The {@link Auth} instance.
 * @param oobCode - A verification code sent to the user.
 *
 * @public
 */
function checkActionCode(auth, oobCode) {
    return __awaiter(this, void 0, void 0, function () {
        var authModular, response, operation, multiFactorInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authModular = getModularInstance(auth);
                    return [4 /*yield*/, resetPassword(authModular, { oobCode: oobCode })];
                case 1:
                    response = _a.sent();
                    operation = response.requestType;
                    _assert(operation, authModular, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                    switch (operation) {
                        case "EMAIL_SIGNIN" /* ActionCodeOperation.EMAIL_SIGNIN */:
                            break;
                        case "VERIFY_AND_CHANGE_EMAIL" /* ActionCodeOperation.VERIFY_AND_CHANGE_EMAIL */:
                            _assert(response.newEmail, authModular, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                            break;
                        case "REVERT_SECOND_FACTOR_ADDITION" /* ActionCodeOperation.REVERT_SECOND_FACTOR_ADDITION */:
                            _assert(response.mfaInfo, authModular, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                        // fall through
                        default:
                            _assert(response.email, authModular, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                    }
                    multiFactorInfo = null;
                    if (response.mfaInfo) {
                        multiFactorInfo = MultiFactorInfoImpl._fromServerResponse(_castAuth(authModular), response.mfaInfo);
                    }
                    return [2 /*return*/, {
                            data: {
                                email: (response.requestType === "VERIFY_AND_CHANGE_EMAIL" /* ActionCodeOperation.VERIFY_AND_CHANGE_EMAIL */
                                    ? response.newEmail
                                    : response.email) || null,
                                previousEmail: (response.requestType === "VERIFY_AND_CHANGE_EMAIL" /* ActionCodeOperation.VERIFY_AND_CHANGE_EMAIL */
                                    ? response.email
                                    : response.newEmail) || null,
                                multiFactorInfo: multiFactorInfo
                            },
                            operation: operation
                        }];
            }
        });
    });
}
/**
 * Checks a password reset code sent to the user by email or other out-of-band mechanism.
 *
 * @returns the user's email address if valid.
 *
 * @param auth - The {@link Auth} instance.
 * @param code - A verification code sent to the user.
 *
 * @public
 */
function verifyPasswordResetCode(auth, code) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkActionCode(getModularInstance(auth), code)];
                case 1:
                    data = (_a.sent()).data;
                    // Email should always be present since a code was sent to it
                    return [2 /*return*/, data.email];
            }
        });
    });
}
/**
 * Creates a new user account associated with the specified email address and password.
 *
 * @remarks
 * On successful creation of the user account, this user will also be signed in to your application.
 *
 * User account creation can fail if the account already exists or the password is invalid.
 *
 * Note: The email address acts as a unique identifier for the user and enables an email-based
 * password reset. This function will create a new user account and set the initial user password.
 *
 * @param auth - The {@link Auth} instance.
 * @param email - The user's email address.
 * @param password - The user's chosen password.
 *
 * @public
 */
function createUserWithEmailAndPassword(auth, email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var authInternal, request, signUpResponse, response, userCredential;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = _castAuth(auth);
                    request = {
                        returnSecureToken: true,
                        email: email,
                        password: password,
                        clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */
                    };
                    signUpResponse = handleRecaptchaFlow(authInternal, request, "signUpPassword" /* RecaptchaActionName.SIGN_UP_PASSWORD */, signUp);
                    return [4 /*yield*/, signUpResponse.catch(function (error) {
                            if (error.code === "auth/".concat("password-does-not-meet-requirements" /* AuthErrorCode.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */)) {
                                void recachePasswordPolicy(auth);
                            }
                            throw error;
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn" /* OperationType.SIGN_IN */, response)];
                case 2:
                    userCredential = _a.sent();
                    return [4 /*yield*/, authInternal._updateCurrentUser(userCredential.user)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, userCredential];
            }
        });
    });
}
/**
 * Asynchronously signs in using an email and password.
 *
 * @remarks
 * Fails with an error if the email address and password do not match.
 * When [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection) is enabled,
 * this method fails with "auth/invalid-credential" in case of an invalid email/password.
 *
 * Note: The user's password is NOT the password used to access the user's email account. The
 * email address serves as a unique identifier for the user, and the password is used to access
 * the user's account in your Firebase project. See also: {@link createUserWithEmailAndPassword}.
 *
 * @param auth - The {@link Auth} instance.
 * @param email - The users email address.
 * @param password - The users password.
 *
 * @public
 */
function signInWithEmailAndPassword(auth, email, password) {
    var _this = this;
    return signInWithCredential(getModularInstance(auth), EmailAuthProvider.credential(email, password)).catch(function (error) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (error.code === "auth/".concat("password-does-not-meet-requirements" /* AuthErrorCode.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */)) {
                void recachePasswordPolicy(auth);
            }
            throw error;
        });
    }); });
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
 * Sends a sign-in email link to the user with the specified email.
 *
 * @remarks
 * The sign-in operation has to always be completed in the app unlike other out of band email
 * actions (password reset and email verifications). This is because, at the end of the flow,
 * the user is expected to be signed in and their Auth state persisted within the app.
 *
 * To complete sign in with the email link, call {@link signInWithEmailLink} with the email
 * address and the email link supplied in the email sent to the user.
 *
 * @example
 * ```javascript
 * const actionCodeSettings = {
 *   url: 'https://www.example.com/?email=user@example.com',
 *   iOS: {
 *      bundleId: 'com.example.ios'
 *   },
 *   android: {
 *     packageName: 'com.example.android',
 *     installApp: true,
 *     minimumVersion: '12'
 *   },
 *   handleCodeInApp: true
 * };
 * await sendSignInLinkToEmail(auth, 'user@example.com', actionCodeSettings);
 * // Obtain emailLink from the user.
 * if(isSignInWithEmailLink(auth, emailLink)) {
 *   await signInWithEmailLink(auth, 'user@example.com', emailLink);
 * }
 * ```
 *
 * @param authInternal - The {@link Auth} instance.
 * @param email - The user's email address.
 * @param actionCodeSettings - The {@link ActionCodeSettings}.
 *
 * @public
 */
function sendSignInLinkToEmail(auth, email, actionCodeSettings) {
    return __awaiter(this, void 0, void 0, function () {
        function setActionCodeSettings(request, actionCodeSettings) {
            _assert(actionCodeSettings.handleCodeInApp, authInternal, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
            if (actionCodeSettings) {
                _setActionCodeSettingsOnRequest(authInternal, request, actionCodeSettings);
            }
        }
        var authInternal, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = _castAuth(auth);
                    request = {
                        requestType: "EMAIL_SIGNIN" /* ActionCodeOperation.EMAIL_SIGNIN */,
                        email: email,
                        clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */
                    };
                    setActionCodeSettings(request, actionCodeSettings);
                    return [4 /*yield*/, handleRecaptchaFlow(authInternal, request, "getOobCode" /* RecaptchaActionName.GET_OOB_CODE */, sendSignInLinkToEmail$1)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Checks if an incoming link is a sign-in with email link suitable for {@link signInWithEmailLink}.
 *
 * @param auth - The {@link Auth} instance.
 * @param emailLink - The link sent to the user's email address.
 *
 * @public
 */
function isSignInWithEmailLink(auth, emailLink) {
    var actionCodeUrl = ActionCodeURL.parseLink(emailLink);
    return (actionCodeUrl === null || actionCodeUrl === void 0 ? void 0 : actionCodeUrl.operation) === "EMAIL_SIGNIN" /* ActionCodeOperation.EMAIL_SIGNIN */;
}
/**
 * Asynchronously signs in using an email and sign-in email link.
 *
 * @remarks
 * If no link is passed, the link is inferred from the current URL.
 *
 * Fails with an error if the email address is invalid or OTP in email link expires.
 *
 * Note: Confirm the link is a sign-in email link before calling this method firebase.auth.Auth.isSignInWithEmailLink.
 *
 * @example
 * ```javascript
 * const actionCodeSettings = {
 *   url: 'https://www.example.com/?email=user@example.com',
 *   iOS: {
 *      bundleId: 'com.example.ios'
 *   },
 *   android: {
 *     packageName: 'com.example.android',
 *     installApp: true,
 *     minimumVersion: '12'
 *   },
 *   handleCodeInApp: true
 * };
 * await sendSignInLinkToEmail(auth, 'user@example.com', actionCodeSettings);
 * // Obtain emailLink from the user.
 * if(isSignInWithEmailLink(auth, emailLink)) {
 *   await signInWithEmailLink(auth, 'user@example.com', emailLink);
 * }
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param email - The user's email address.
 * @param emailLink - The link sent to the user's email address.
 *
 * @public
 */
function signInWithEmailLink(auth, email, emailLink) {
    return __awaiter(this, void 0, void 0, function () {
        var authModular, credential;
        return __generator(this, function (_a) {
            authModular = getModularInstance(auth);
            credential = EmailAuthProvider.credentialWithLink(email, emailLink || _getCurrentUrl());
            // Check if the tenant ID in the email link matches the tenant ID on Auth
            // instance.
            _assert(credential._tenantId === (authModular.tenantId || null), authModular, "tenant-id-mismatch" /* AuthErrorCode.TENANT_ID_MISMATCH */);
            return [2 /*return*/, signInWithCredential(authModular, credential)];
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
function createAuthUri(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:createAuthUri" /* Endpoint.CREATE_AUTH_URI */, _addTidIfNecessary(auth, request))];
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
 * Gets the list of possible sign in methods for the given email address. This method returns an
 * empty list when [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection) is enabled, irrespective of the number of
 * authentication methods available for the given email.
 *
 * @remarks
 * This is useful to differentiate methods of sign-in for the same provider, eg.
 * {@link EmailAuthProvider} which has 2 methods of sign-in,
 * {@link SignInMethod}.EMAIL_PASSWORD and
 * {@link SignInMethod}.EMAIL_LINK.
 *
 * @param auth - The {@link Auth} instance.
 * @param email - The user's email address.
 *
 * Deprecated. Migrating off of this method is recommended as a security best-practice.
 * Learn more in the Identity Platform documentation for [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection).
 * @public
 */
function fetchSignInMethodsForEmail(auth, email) {
    return __awaiter(this, void 0, void 0, function () {
        var continueUri, request, signinMethods;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    continueUri = _isHttpOrHttps() ? _getCurrentUrl() : 'http://localhost';
                    request = {
                        identifier: email,
                        continueUri: continueUri
                    };
                    return [4 /*yield*/, createAuthUri(getModularInstance(auth), request)];
                case 1:
                    signinMethods = (_a.sent()).signinMethods;
                    return [2 /*return*/, signinMethods || []];
            }
        });
    });
}
/**
 * Sends a verification email to a user.
 *
 * @remarks
 * The verification process is completed by calling {@link applyActionCode}.
 *
 * @example
 * ```javascript
 * const actionCodeSettings = {
 *   url: 'https://www.example.com/?email=user@example.com',
 *   iOS: {
 *      bundleId: 'com.example.ios'
 *   },
 *   android: {
 *     packageName: 'com.example.android',
 *     installApp: true,
 *     minimumVersion: '12'
 *   },
 *   handleCodeInApp: true
 * };
 * await sendEmailVerification(user, actionCodeSettings);
 * // Obtain code from the user.
 * await applyActionCode(auth, code);
 * ```
 *
 * @param user - The user.
 * @param actionCodeSettings - The {@link ActionCodeSettings}.
 *
 * @public
 */
function sendEmailVerification(user, actionCodeSettings) {
    return __awaiter(this, void 0, void 0, function () {
        var userInternal, idToken, request, email;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userInternal = getModularInstance(user);
                    return [4 /*yield*/, user.getIdToken()];
                case 1:
                    idToken = _a.sent();
                    request = {
                        requestType: "VERIFY_EMAIL" /* ActionCodeOperation.VERIFY_EMAIL */,
                        idToken: idToken
                    };
                    if (actionCodeSettings) {
                        _setActionCodeSettingsOnRequest(userInternal.auth, request, actionCodeSettings);
                    }
                    return [4 /*yield*/, sendEmailVerification$1(userInternal.auth, request)];
                case 2:
                    email = (_a.sent()).email;
                    if (!(email !== user.email)) return [3 /*break*/, 4];
                    return [4 /*yield*/, user.reload()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Sends a verification email to a new email address.
 *
 * @remarks
 * The user's email will be updated to the new one after being verified.
 *
 * If you have a custom email action handler, you can complete the verification process by calling
 * {@link applyActionCode}.
 *
 * @example
 * ```javascript
 * const actionCodeSettings = {
 *   url: 'https://www.example.com/?email=user@example.com',
 *   iOS: {
 *      bundleId: 'com.example.ios'
 *   },
 *   android: {
 *     packageName: 'com.example.android',
 *     installApp: true,
 *     minimumVersion: '12'
 *   },
 *   handleCodeInApp: true
 * };
 * await verifyBeforeUpdateEmail(user, 'newemail@example.com', actionCodeSettings);
 * // Obtain code from the user.
 * await applyActionCode(auth, code);
 * ```
 *
 * @param user - The user.
 * @param newEmail - The new email address to be verified before update.
 * @param actionCodeSettings - The {@link ActionCodeSettings}.
 *
 * @public
 */
function verifyBeforeUpdateEmail(user, newEmail, actionCodeSettings) {
    return __awaiter(this, void 0, void 0, function () {
        var userInternal, idToken, request, email;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userInternal = getModularInstance(user);
                    return [4 /*yield*/, user.getIdToken()];
                case 1:
                    idToken = _a.sent();
                    request = {
                        requestType: "VERIFY_AND_CHANGE_EMAIL" /* ActionCodeOperation.VERIFY_AND_CHANGE_EMAIL */,
                        idToken: idToken,
                        newEmail: newEmail
                    };
                    if (actionCodeSettings) {
                        _setActionCodeSettingsOnRequest(userInternal.auth, request, actionCodeSettings);
                    }
                    return [4 /*yield*/, verifyAndChangeEmail(userInternal.auth, request)];
                case 2:
                    email = (_a.sent()).email;
                    if (!(email !== user.email)) return [3 /*break*/, 4];
                    // If the local copy of the email on user is outdated, reload the
                    // user.
                    return [4 /*yield*/, user.reload()];
                case 3:
                    // If the local copy of the email on user is outdated, reload the
                    // user.
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
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
function updateProfile$1(auth, request) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v1/accounts:update" /* Endpoint.SET_ACCOUNT_INFO */, request)];
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
 * Updates a user's profile data.
 *
 * @param user - The user.
 * @param profile - The profile's `displayName` and `photoURL` to update.
 *
 * @public
 */
function updateProfile(user, _a) {
    var displayName = _a.displayName, photoUrl = _a.photoURL;
    return __awaiter(this, void 0, void 0, function () {
        var userInternal, idToken, profileRequest, response, passwordProvider;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (displayName === undefined && photoUrl === undefined) {
                        return [2 /*return*/];
                    }
                    userInternal = getModularInstance(user);
                    return [4 /*yield*/, userInternal.getIdToken()];
                case 1:
                    idToken = _b.sent();
                    profileRequest = {
                        idToken: idToken,
                        displayName: displayName,
                        photoUrl: photoUrl,
                        returnSecureToken: true
                    };
                    return [4 /*yield*/, _logoutIfInvalidated(userInternal, updateProfile$1(userInternal.auth, profileRequest))];
                case 2:
                    response = _b.sent();
                    userInternal.displayName = response.displayName || null;
                    userInternal.photoURL = response.photoUrl || null;
                    passwordProvider = userInternal.providerData.find(function (_a) {
                        var providerId = _a.providerId;
                        return providerId === "password" /* ProviderId.PASSWORD */;
                    });
                    if (passwordProvider) {
                        passwordProvider.displayName = userInternal.displayName;
                        passwordProvider.photoURL = userInternal.photoURL;
                    }
                    return [4 /*yield*/, userInternal._updateTokensIfNecessary(response)];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Updates the user's email address.
 *
 * @remarks
 * An email will be sent to the original email address (if it was set) that allows to revoke the
 * email address change, in order to protect them from account hijacking.
 *
 * Important: this is a security sensitive operation that requires the user to have recently signed
 * in. If this requirement isn't met, ask the user to authenticate again and then call
 * {@link reauthenticateWithCredential}.
 *
 * @param user - The user.
 * @param newEmail - The new email address.
 *
 * Throws "auth/operation-not-allowed" error when [Email Enumeration Protection](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection) is enabled.
 * Deprecated - Use {@link verifyBeforeUpdateEmail} instead.
 *
 * @public
 */
function updateEmail(user, newEmail) {
    return updateEmailOrPassword(getModularInstance(user), newEmail, null);
}
/**
 * Updates the user's password.
 *
 * @remarks
 * Important: this is a security sensitive operation that requires the user to have recently signed
 * in. If this requirement isn't met, ask the user to authenticate again and then call
 * {@link reauthenticateWithCredential}.
 *
 * @param user - The user.
 * @param newPassword - The new password.
 *
 * @public
 */
function updatePassword(user, newPassword) {
    return updateEmailOrPassword(getModularInstance(user), null, newPassword);
}
function updateEmailOrPassword(user, email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, idToken, request, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auth = user.auth;
                    return [4 /*yield*/, user.getIdToken()];
                case 1:
                    idToken = _a.sent();
                    request = {
                        idToken: idToken,
                        returnSecureToken: true
                    };
                    if (email) {
                        request.email = email;
                    }
                    if (password) {
                        request.password = password;
                    }
                    return [4 /*yield*/, _logoutIfInvalidated(user, updateEmailPassword(auth, request))];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, user._updateTokensIfNecessary(response, /* reload */ true)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
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
 * Parse the `AdditionalUserInfo` from the ID token response.
 *
 */
function _fromIdTokenResponse(idTokenResponse) {
    var _a, _b;
    if (!idTokenResponse) {
        return null;
    }
    var providerId = idTokenResponse.providerId;
    var profile = idTokenResponse.rawUserInfo
        ? JSON.parse(idTokenResponse.rawUserInfo)
        : {};
    var isNewUser = idTokenResponse.isNewUser ||
        idTokenResponse.kind === "identitytoolkit#SignupNewUserResponse" /* IdTokenResponseKind.SignupNewUser */;
    if (!providerId && (idTokenResponse === null || idTokenResponse === void 0 ? void 0 : idTokenResponse.idToken)) {
        var signInProvider = (_b = (_a = _parseToken(idTokenResponse.idToken)) === null || _a === void 0 ? void 0 : _a.firebase) === null || _b === void 0 ? void 0 : _b['sign_in_provider'];
        if (signInProvider) {
            var filteredProviderId = signInProvider !== "anonymous" /* ProviderId.ANONYMOUS */ &&
                signInProvider !== "custom" /* ProviderId.CUSTOM */
                ? signInProvider
                : null;
            // Uses generic class in accordance with the legacy SDK.
            return new GenericAdditionalUserInfo(isNewUser, filteredProviderId);
        }
    }
    if (!providerId) {
        return null;
    }
    switch (providerId) {
        case "facebook.com" /* ProviderId.FACEBOOK */:
            return new FacebookAdditionalUserInfo(isNewUser, profile);
        case "github.com" /* ProviderId.GITHUB */:
            return new GithubAdditionalUserInfo(isNewUser, profile);
        case "google.com" /* ProviderId.GOOGLE */:
            return new GoogleAdditionalUserInfo(isNewUser, profile);
        case "twitter.com" /* ProviderId.TWITTER */:
            return new TwitterAdditionalUserInfo(isNewUser, profile, idTokenResponse.screenName || null);
        case "custom" /* ProviderId.CUSTOM */:
        case "anonymous" /* ProviderId.ANONYMOUS */:
            return new GenericAdditionalUserInfo(isNewUser, null);
        default:
            return new GenericAdditionalUserInfo(isNewUser, providerId, profile);
    }
}
var GenericAdditionalUserInfo = /** @class */ (function () {
    function GenericAdditionalUserInfo(isNewUser, providerId, profile) {
        if (profile === void 0) { profile = {}; }
        this.isNewUser = isNewUser;
        this.providerId = providerId;
        this.profile = profile;
    }
    return GenericAdditionalUserInfo;
}());
var FederatedAdditionalUserInfoWithUsername = /** @class */ (function (_super) {
    __extends(FederatedAdditionalUserInfoWithUsername, _super);
    function FederatedAdditionalUserInfoWithUsername(isNewUser, providerId, profile, username) {
        var _this = _super.call(this, isNewUser, providerId, profile) || this;
        _this.username = username;
        return _this;
    }
    return FederatedAdditionalUserInfoWithUsername;
}(GenericAdditionalUserInfo));
var FacebookAdditionalUserInfo = /** @class */ (function (_super) {
    __extends(FacebookAdditionalUserInfo, _super);
    function FacebookAdditionalUserInfo(isNewUser, profile) {
        return _super.call(this, isNewUser, "facebook.com" /* ProviderId.FACEBOOK */, profile) || this;
    }
    return FacebookAdditionalUserInfo;
}(GenericAdditionalUserInfo));
var GithubAdditionalUserInfo = /** @class */ (function (_super) {
    __extends(GithubAdditionalUserInfo, _super);
    function GithubAdditionalUserInfo(isNewUser, profile) {
        return _super.call(this, isNewUser, "github.com" /* ProviderId.GITHUB */, profile, typeof (profile === null || profile === void 0 ? void 0 : profile.login) === 'string' ? profile === null || profile === void 0 ? void 0 : profile.login : null) || this;
    }
    return GithubAdditionalUserInfo;
}(FederatedAdditionalUserInfoWithUsername));
var GoogleAdditionalUserInfo = /** @class */ (function (_super) {
    __extends(GoogleAdditionalUserInfo, _super);
    function GoogleAdditionalUserInfo(isNewUser, profile) {
        return _super.call(this, isNewUser, "google.com" /* ProviderId.GOOGLE */, profile) || this;
    }
    return GoogleAdditionalUserInfo;
}(GenericAdditionalUserInfo));
var TwitterAdditionalUserInfo = /** @class */ (function (_super) {
    __extends(TwitterAdditionalUserInfo, _super);
    function TwitterAdditionalUserInfo(isNewUser, profile, screenName) {
        return _super.call(this, isNewUser, "twitter.com" /* ProviderId.TWITTER */, profile, screenName) || this;
    }
    return TwitterAdditionalUserInfo;
}(FederatedAdditionalUserInfoWithUsername));
/**
 * Extracts provider specific {@link AdditionalUserInfo} for the given credential.
 *
 * @param userCredential - The user credential.
 *
 * @public
 */
function getAdditionalUserInfo(userCredential) {
    var _a = userCredential, user = _a.user, _tokenResponse = _a._tokenResponse;
    if (user.isAnonymous && !_tokenResponse) {
        // Handle the special case where signInAnonymously() gets called twice.
        // No network call is made so there's nothing to actually fill this in
        return {
            providerId: null,
            isNewUser: false,
            profile: null
        };
    }
    return _fromIdTokenResponse(_tokenResponse);
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
// Non-optional auth methods.
/**
 * Changes the type of persistence on the {@link Auth} instance for the currently saved
 * `Auth` session and applies this type of persistence for future sign-in requests, including
 * sign-in with redirect requests.
 *
 * @remarks
 * This makes it easy for a user signing in to specify whether their session should be
 * remembered or not. It also makes it easier to never persist the `Auth` state for applications
 * that are shared by other users or have sensitive data.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * setPersistence(auth, browserSessionPersistence);
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param persistence - The {@link Persistence} to use.
 * @returns A `Promise` that resolves once the persistence change has completed
 *
 * @public
 */
function setPersistence(auth, persistence) {
    return getModularInstance(auth).setPersistence(persistence);
}
/**
 * Loads the reCAPTCHA configuration into the `Auth` instance.
 *
 * @remarks
 * This will load the reCAPTCHA config, which indicates whether the reCAPTCHA
 * verification flow should be triggered for each auth provider, into the
 * current Auth session.
 *
 * If initializeRecaptchaConfig() is not invoked, the auth flow will always start
 * without reCAPTCHA verification. If the provider is configured to require reCAPTCHA
 * verification, the SDK will transparently load the reCAPTCHA config and restart the
 * auth flows.
 *
 * Thus, by calling this optional method, you will reduce the latency of future auth flows.
 * Loading the reCAPTCHA config early will also enhance the signal collected by reCAPTCHA.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * initializeRecaptchaConfig(auth);
 * ```
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
function initializeRecaptchaConfig(auth) {
    return _initializeRecaptchaConfig(auth);
}
/**
 * Validates the password against the password policy configured for the project or tenant.
 *
 * @remarks
 * If no tenant ID is set on the `Auth` instance, then this method will use the password
 * policy configured for the project. Otherwise, this method will use the policy configured
 * for the tenant. If a password policy has not been configured, then the default policy
 * configured for all projects will be used.
 *
 * If an auth flow fails because a submitted password does not meet the password policy
 * requirements and this method has previously been called, then this method will use the
 * most recent policy available when called again.
 *
 * @example
 * ```javascript
 * validatePassword(auth, 'some-password');
 * ```
 *
 * @param auth The {@link Auth} instance.
 * @param password The password to validate.
 *
 * @public
 */
function validatePassword(auth, password) {
    return __awaiter(this, void 0, void 0, function () {
        var authInternal;
        return __generator(this, function (_a) {
            authInternal = _castAuth(auth);
            return [2 /*return*/, authInternal.validatePassword(password)];
        });
    });
}
/**
 * Adds an observer for changes to the signed-in user's ID token.
 *
 * @remarks
 * This includes sign-in, sign-out, and token refresh events.
 * This will not be triggered automatically upon ID token expiration. Use {@link User.getIdToken} to refresh the ID token.
 *
 * @param auth - The {@link Auth} instance.
 * @param nextOrObserver - callback triggered on change.
 * @param error - Deprecated. This callback is never triggered. Errors
 * on signing in/out can be caught in promises returned from
 * sign-in/sign-out functions.
 * @param completed - Deprecated. This callback is never triggered.
 *
 * @public
 */
function onIdTokenChanged(auth, nextOrObserver, error, completed) {
    return getModularInstance(auth).onIdTokenChanged(nextOrObserver, error, completed);
}
/**
 * Adds a blocking callback that runs before an auth state change
 * sets a new user.
 *
 * @param auth - The {@link Auth} instance.
 * @param callback - callback triggered before new user value is set.
 *   If this throws, it blocks the user from being set.
 * @param onAbort - callback triggered if a later `beforeAuthStateChanged()`
 *   callback throws, allowing you to undo any side effects.
 */
function beforeAuthStateChanged(auth, callback, onAbort) {
    return getModularInstance(auth).beforeAuthStateChanged(callback, onAbort);
}
/**
 * Adds an observer for changes to the user's sign-in state.
 *
 * @remarks
 * To keep the old behavior, see {@link onIdTokenChanged}.
 *
 * @param auth - The {@link Auth} instance.
 * @param nextOrObserver - callback triggered on change.
 * @param error - Deprecated. This callback is never triggered. Errors
 * on signing in/out can be caught in promises returned from
 * sign-in/sign-out functions.
 * @param completed - Deprecated. This callback is never triggered.
 *
 * @public
 */
function onAuthStateChanged(auth, nextOrObserver, error, completed) {
    return getModularInstance(auth).onAuthStateChanged(nextOrObserver, error, completed);
}
/**
 * Sets the current language to the default device/browser preference.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
function useDeviceLanguage(auth) {
    getModularInstance(auth).useDeviceLanguage();
}
/**
 * Asynchronously sets the provided user as {@link Auth.currentUser} on the
 * {@link Auth} instance.
 *
 * @remarks
 * A new instance copy of the user provided will be made and set as currentUser.
 *
 * This will trigger {@link onAuthStateChanged} and {@link onIdTokenChanged} listeners
 * like other sign in methods.
 *
 * The operation fails with an error if the user to be updated belongs to a different Firebase
 * project.
 *
 * @param auth - The {@link Auth} instance.
 * @param user - The new {@link User}.
 *
 * @public
 */
function updateCurrentUser(auth, user) {
    return getModularInstance(auth).updateCurrentUser(user);
}
/**
 * Signs out the current user.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
function signOut(auth) {
    return getModularInstance(auth).signOut();
}
/**
 * Revokes the given access token. Currently only supports Apple OAuth access tokens.
 *
 * @param auth - The {@link Auth} instance.
 * @param token - The Apple OAuth access token.
 *
 * @public
 */
function revokeAccessToken(auth, token) {
    var authInternal = _castAuth(auth);
    return authInternal.revokeAccessToken(token);
}
/**
 * Deletes and signs out the user.
 *
 * @remarks
 * Important: this is a security-sensitive operation that requires the user to have recently
 * signed in. If this requirement isn't met, ask the user to authenticate again and then call
 * {@link reauthenticateWithCredential}.
 *
 * @param user - The user.
 *
 * @public
 */
function deleteUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getModularInstance(user).delete()];
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
var MultiFactorSessionImpl = /** @class */ (function () {
    function MultiFactorSessionImpl(type, credential, user) {
        this.type = type;
        this.credential = credential;
        this.user = user;
    }
    MultiFactorSessionImpl._fromIdtoken = function (idToken, user) {
        return new MultiFactorSessionImpl("enroll" /* MultiFactorSessionType.ENROLL */, idToken, user);
    };
    MultiFactorSessionImpl._fromMfaPendingCredential = function (mfaPendingCredential) {
        return new MultiFactorSessionImpl("signin" /* MultiFactorSessionType.SIGN_IN */, mfaPendingCredential);
    };
    MultiFactorSessionImpl.prototype.toJSON = function () {
        var _a;
        var key = this.type === "enroll" /* MultiFactorSessionType.ENROLL */
            ? 'idToken'
            : 'pendingCredential';
        return {
            multiFactorSession: (_a = {},
                _a[key] = this.credential,
                _a)
        };
    };
    MultiFactorSessionImpl.fromJSON = function (obj) {
        var _a, _b;
        if (obj === null || obj === void 0 ? void 0 : obj.multiFactorSession) {
            if ((_a = obj.multiFactorSession) === null || _a === void 0 ? void 0 : _a.pendingCredential) {
                return MultiFactorSessionImpl._fromMfaPendingCredential(obj.multiFactorSession.pendingCredential);
            }
            else if ((_b = obj.multiFactorSession) === null || _b === void 0 ? void 0 : _b.idToken) {
                return MultiFactorSessionImpl._fromIdtoken(obj.multiFactorSession.idToken);
            }
        }
        return null;
    };
    return MultiFactorSessionImpl;
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
var MultiFactorResolverImpl = /** @class */ (function () {
    function MultiFactorResolverImpl(session, hints, signInResolver) {
        this.session = session;
        this.hints = hints;
        this.signInResolver = signInResolver;
    }
    /** @internal */
    MultiFactorResolverImpl._fromError = function (authExtern, error) {
        var _this = this;
        var auth = _castAuth(authExtern);
        var serverResponse = error.customData._serverResponse;
        var hints = (serverResponse.mfaInfo || []).map(function (enrollment) {
            return MultiFactorInfoImpl._fromServerResponse(auth, enrollment);
        });
        _assert(serverResponse.mfaPendingCredential, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        var session = MultiFactorSessionImpl._fromMfaPendingCredential(serverResponse.mfaPendingCredential);
        return new MultiFactorResolverImpl(session, hints, function (assertion) { return __awaiter(_this, void 0, void 0, function () {
            var mfaResponse, idTokenResponse, _a, userCredential;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, assertion._process(auth, session)];
                    case 1:
                        mfaResponse = _b.sent();
                        // Clear out the unneeded fields from the old login response
                        delete serverResponse.mfaInfo;
                        delete serverResponse.mfaPendingCredential;
                        idTokenResponse = __assign(__assign({}, serverResponse), { idToken: mfaResponse.idToken, refreshToken: mfaResponse.refreshToken });
                        _a = error.operationType;
                        switch (_a) {
                            case "signIn" /* OperationType.SIGN_IN */: return [3 /*break*/, 2];
                            case "reauthenticate" /* OperationType.REAUTHENTICATE */: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 6];
                    case 2: return [4 /*yield*/, UserCredentialImpl._fromIdTokenResponse(auth, error.operationType, idTokenResponse)];
                    case 3:
                        userCredential = _b.sent();
                        return [4 /*yield*/, auth._updateCurrentUser(userCredential.user)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, userCredential];
                    case 5:
                        _assert(error.user, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                        return [2 /*return*/, UserCredentialImpl._forOperation(error.user, error.operationType, idTokenResponse)];
                    case 6:
                        _fail(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    MultiFactorResolverImpl.prototype.resolveSignIn = function (assertionExtern) {
        return __awaiter(this, void 0, void 0, function () {
            var assertion;
            return __generator(this, function (_a) {
                assertion = assertionExtern;
                return [2 /*return*/, this.signInResolver(assertion)];
            });
        });
    };
    return MultiFactorResolverImpl;
}());
/**
 * Provides a {@link MultiFactorResolver} suitable for completion of a
 * multi-factor flow.
 *
 * @param auth - The {@link Auth} instance.
 * @param error - The {@link MultiFactorError} raised during a sign-in, or
 * reauthentication operation.
 *
 * @public
 */
function getMultiFactorResolver(auth, error) {
    var _a;
    var authModular = getModularInstance(auth);
    var errorInternal = error;
    _assert(error.customData.operationType, authModular, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
    _assert((_a = errorInternal.customData._serverResponse) === null || _a === void 0 ? void 0 : _a.mfaPendingCredential, authModular, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
    return MultiFactorResolverImpl._fromError(authModular, errorInternal);
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
function startEnrollPhoneMfa(auth, request) {
    return _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts/mfaEnrollment:start" /* Endpoint.START_MFA_ENROLLMENT */, _addTidIfNecessary(auth, request));
}
function finalizeEnrollPhoneMfa(auth, request) {
    return _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts/mfaEnrollment:finalize" /* Endpoint.FINALIZE_MFA_ENROLLMENT */, _addTidIfNecessary(auth, request));
}
function startEnrollTotpMfa(auth, request) {
    return _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts/mfaEnrollment:start" /* Endpoint.START_MFA_ENROLLMENT */, _addTidIfNecessary(auth, request));
}
function finalizeEnrollTotpMfa(auth, request) {
    return _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts/mfaEnrollment:finalize" /* Endpoint.FINALIZE_MFA_ENROLLMENT */, _addTidIfNecessary(auth, request));
}
function withdrawMfa(auth, request) {
    return _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts/mfaEnrollment:withdraw" /* Endpoint.WITHDRAW_MFA */, _addTidIfNecessary(auth, request));
}

var MultiFactorUserImpl = /** @class */ (function () {
    function MultiFactorUserImpl(user) {
        var _this = this;
        this.user = user;
        this.enrolledFactors = [];
        user._onReload(function (userInfo) {
            if (userInfo.mfaInfo) {
                _this.enrolledFactors = userInfo.mfaInfo.map(function (enrollment) {
                    return MultiFactorInfoImpl._fromServerResponse(user.auth, enrollment);
                });
            }
        });
    }
    MultiFactorUserImpl._fromUser = function (user) {
        return new MultiFactorUserImpl(user);
    };
    MultiFactorUserImpl.prototype.getSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = MultiFactorSessionImpl)._fromIdtoken;
                        return [4 /*yield*/, this.user.getIdToken()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), this.user])];
                }
            });
        });
    };
    MultiFactorUserImpl.prototype.enroll = function (assertionExtern, displayName) {
        return __awaiter(this, void 0, void 0, function () {
            var assertion, session, finalizeMfaResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assertion = assertionExtern;
                        return [4 /*yield*/, this.getSession()];
                    case 1:
                        session = (_a.sent());
                        return [4 /*yield*/, _logoutIfInvalidated(this.user, assertion._process(this.user.auth, session, displayName))];
                    case 2:
                        finalizeMfaResponse = _a.sent();
                        // New tokens will be issued after enrollment of the new second factors.
                        // They need to be updated on the user.
                        return [4 /*yield*/, this.user._updateTokensIfNecessary(finalizeMfaResponse)];
                    case 3:
                        // New tokens will be issued after enrollment of the new second factors.
                        // They need to be updated on the user.
                        _a.sent();
                        // The user needs to be reloaded to get the new multi-factor information
                        // from server. USER_RELOADED event will be triggered and `enrolledFactors`
                        // will be updated.
                        return [2 /*return*/, this.user.reload()];
                }
            });
        });
    };
    MultiFactorUserImpl.prototype.unenroll = function (infoOrUid) {
        return __awaiter(this, void 0, void 0, function () {
            var mfaEnrollmentId, idToken, idTokenResponse, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mfaEnrollmentId = typeof infoOrUid === 'string' ? infoOrUid : infoOrUid.uid;
                        return [4 /*yield*/, this.user.getIdToken()];
                    case 1:
                        idToken = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, _logoutIfInvalidated(this.user, withdrawMfa(this.user.auth, {
                                idToken: idToken,
                                mfaEnrollmentId: mfaEnrollmentId
                            }))];
                    case 3:
                        idTokenResponse = _a.sent();
                        // Remove the second factor from the user's list.
                        this.enrolledFactors = this.enrolledFactors.filter(function (_a) {
                            var uid = _a.uid;
                            return uid !== mfaEnrollmentId;
                        });
                        // Depending on whether the backend decided to revoke the user's session,
                        // the tokenResponse may be empty. If the tokens were not updated (and they
                        // are now invalid), reloading the user will discover this and invalidate
                        // the user's state accordingly.
                        return [4 /*yield*/, this.user._updateTokensIfNecessary(idTokenResponse)];
                    case 4:
                        // Depending on whether the backend decided to revoke the user's session,
                        // the tokenResponse may be empty. If the tokens were not updated (and they
                        // are now invalid), reloading the user will discover this and invalidate
                        // the user's state accordingly.
                        _a.sent();
                        return [4 /*yield*/, this.user.reload()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        throw e_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return MultiFactorUserImpl;
}());
var multiFactorUserCache = new WeakMap();
/**
 * The {@link MultiFactorUser} corresponding to the user.
 *
 * @remarks
 * This is used to access all multi-factor properties and operations related to the user.
 *
 * @param user - The user.
 *
 * @public
 */
function multiFactor(user) {
    var userModular = getModularInstance(user);
    if (!multiFactorUserCache.has(userModular)) {
        multiFactorUserCache.set(userModular, MultiFactorUserImpl._fromUser(userModular));
    }
    return multiFactorUserCache.get(userModular);
}

var name = "@firebase/auth";
var version = "1.5.1";

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
var AuthInterop = /** @class */ (function () {
    function AuthInterop(auth) {
        this.auth = auth;
        this.internalListeners = new Map();
    }
    AuthInterop.prototype.getUid = function () {
        var _a;
        this.assertAuthConfigured();
        return ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid) || null;
    };
    AuthInterop.prototype.getToken = function (forceRefresh) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.assertAuthConfigured();
                        return [4 /*yield*/, this.auth._initializationPromise];
                    case 1:
                        _a.sent();
                        if (!this.auth.currentUser) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.auth.currentUser.getIdToken(forceRefresh)];
                    case 2:
                        accessToken = _a.sent();
                        return [2 /*return*/, { accessToken: accessToken }];
                }
            });
        });
    };
    AuthInterop.prototype.addAuthTokenListener = function (listener) {
        this.assertAuthConfigured();
        if (this.internalListeners.has(listener)) {
            return;
        }
        var unsubscribe = this.auth.onIdTokenChanged(function (user) {
            listener((user === null || user === void 0 ? void 0 : user.stsTokenManager.accessToken) || null);
        });
        this.internalListeners.set(listener, unsubscribe);
        this.updateProactiveRefresh();
    };
    AuthInterop.prototype.removeAuthTokenListener = function (listener) {
        this.assertAuthConfigured();
        var unsubscribe = this.internalListeners.get(listener);
        if (!unsubscribe) {
            return;
        }
        this.internalListeners.delete(listener);
        unsubscribe();
        this.updateProactiveRefresh();
    };
    AuthInterop.prototype.assertAuthConfigured = function () {
        _assert(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth" /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */);
    };
    AuthInterop.prototype.updateProactiveRefresh = function () {
        if (this.internalListeners.size > 0) {
            this.auth._startProactiveRefresh();
        }
        else {
            this.auth._stopProactiveRefresh();
        }
    };
    return AuthInterop;
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
function getVersionForPlatform(clientPlatform) {
    switch (clientPlatform) {
        case "Node" /* ClientPlatform.NODE */:
            return 'node';
        case "ReactNative" /* ClientPlatform.REACT_NATIVE */:
            return 'rn';
        case "Worker" /* ClientPlatform.WORKER */:
            return 'webworker';
        case "Cordova" /* ClientPlatform.CORDOVA */:
            return 'cordova';
        default:
            return undefined;
    }
}
/** @internal */
function registerAuth(clientPlatform) {
    _registerComponent(new Component("auth" /* _ComponentName.AUTH */, function (container, _a) {
        var deps = _a.options;
        var app = container.getProvider('app').getImmediate();
        var heartbeatServiceProvider = container.getProvider('heartbeat');
        var appCheckServiceProvider = container.getProvider('app-check-internal');
        var _b = app.options, apiKey = _b.apiKey, authDomain = _b.authDomain;
        _assert(apiKey && !apiKey.includes(':'), "invalid-api-key" /* AuthErrorCode.INVALID_API_KEY */, { appName: app.name });
        var config = {
            apiKey: apiKey,
            authDomain: authDomain,
            clientPlatform: clientPlatform,
            apiHost: "identitytoolkit.googleapis.com" /* DefaultConfig.API_HOST */,
            tokenApiHost: "securetoken.googleapis.com" /* DefaultConfig.TOKEN_API_HOST */,
            apiScheme: "https" /* DefaultConfig.API_SCHEME */,
            sdkClientVersion: _getClientVersion(clientPlatform)
        };
        var authInstance = new AuthImpl(app, heartbeatServiceProvider, appCheckServiceProvider, config);
        _initializeAuthInstance(authInstance, deps);
        return authInstance;
    }, "PUBLIC" /* ComponentType.PUBLIC */)
        /**
         * Auth can only be initialized by explicitly calling getAuth() or initializeAuth()
         * For why we do this, See go/firebase-next-auth-init
         */
        .setInstantiationMode("EXPLICIT" /* InstantiationMode.EXPLICIT */)
        /**
         * Because all firebase products that depend on auth depend on auth-internal directly,
         * we need to initialize auth-internal after auth is initialized to make it available to other firebase products.
         */
        .setInstanceCreatedCallback(function (container, _instanceIdentifier, _instance) {
        var authInternalProvider = container.getProvider("auth-internal" /* _ComponentName.AUTH_INTERNAL */);
        authInternalProvider.initialize();
    }));
    _registerComponent(new Component("auth-internal" /* _ComponentName.AUTH_INTERNAL */, function (container) {
        var auth = _castAuth(container.getProvider("auth" /* _ComponentName.AUTH */).getImmediate());
        return (function (auth) { return new AuthInterop(auth); })(auth);
    }, "PRIVATE" /* ComponentType.PRIVATE */).setInstantiationMode("EXPLICIT" /* InstantiationMode.EXPLICIT */));
    registerVersion(name, version, getVersionForPlatform(clientPlatform));
    // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
    registerVersion(name, version, 'esm5');
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
 * An enum of factors that may be used for multifactor authentication.
 *
 * @public
 */
var FactorId = {
    /** Phone as second factor */
    PHONE: 'phone',
    TOTP: 'totp'
};
/**
 * Enumeration of supported providers.
 *
 * @public
 */
var ProviderId = {
    /** Facebook provider ID */
    FACEBOOK: 'facebook.com',
    /** GitHub provider ID */
    GITHUB: 'github.com',
    /** Google provider ID */
    GOOGLE: 'google.com',
    /** Password provider */
    PASSWORD: 'password',
    /** Phone provider */
    PHONE: 'phone',
    /** Twitter provider ID */
    TWITTER: 'twitter.com'
};
/**
 * Enumeration of supported sign-in methods.
 *
 * @public
 */
var SignInMethod = {
    /** Email link sign in method */
    EMAIL_LINK: 'emailLink',
    /** Email/password sign in method */
    EMAIL_PASSWORD: 'password',
    /** Facebook sign in method */
    FACEBOOK: 'facebook.com',
    /** GitHub sign in method */
    GITHUB: 'github.com',
    /** Google sign in method */
    GOOGLE: 'google.com',
    /** Phone sign in method */
    PHONE: 'phone',
    /** Twitter sign in method */
    TWITTER: 'twitter.com'
};
/**
 * Enumeration of supported operation types.
 *
 * @public
 */
var OperationType = {
    /** Operation involving linking an additional provider to an already signed-in user. */
    LINK: 'link',
    /** Operation involving using a provider to reauthenticate an already signed-in user. */
    REAUTHENTICATE: 'reauthenticate',
    /** Operation involving signing in a user. */
    SIGN_IN: 'signIn'
};
/**
 * An enumeration of the possible email action types.
 *
 * @public
 */
var ActionCodeOperation = {
    /** The email link sign-in action. */
    EMAIL_SIGNIN: 'EMAIL_SIGNIN',
    /** The password reset action. */
    PASSWORD_RESET: 'PASSWORD_RESET',
    /** The email revocation action. */
    RECOVER_EMAIL: 'RECOVER_EMAIL',
    /** The revert second factor addition email action. */
    REVERT_SECOND_FACTOR_ADDITION: 'REVERT_SECOND_FACTOR_ADDITION',
    /** The revert second factor addition email action. */
    VERIFY_AND_CHANGE_EMAIL: 'VERIFY_AND_CHANGE_EMAIL',
    /** The email verification action. */
    VERIFY_EMAIL: 'VERIFY_EMAIL'
};

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
            this.storage.setItem(STORAGE_AVAILABLE_KEY, '1');
            this.storage.removeItem(STORAGE_AVAILABLE_KEY);
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
    var ua = getUA();
    return _isSafari(ua) || _isIOS(ua);
}
// The polling period in case events are not supported
var _POLLING_INTERVAL_MS = 1000;
// The IE 10 localStorage cross tab synchronization delay in milliseconds
var IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
var BrowserLocalPersistence = /** @class */ (function (_super) {
    __extends(BrowserLocalPersistence, _super);
    function BrowserLocalPersistence() {
        var _this = _super.call(this, function () { return window.localStorage; }, "LOCAL" /* PersistenceType.LOCAL */) || this;
        _this.boundEventHandler = function (event, poll) { return _this.onStorageEvent(event, poll); };
        _this.listeners = {};
        _this.localCache = {};
        // setTimeout return value is platform specific
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _this.pollTimer = null;
        // Safari or iOS browser and embedded in an iframe.
        _this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && _isIframe();
        // Whether to use polling instead of depending on window events
        _this.fallbackToPolling = _isMobileBrowser();
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
        if (_isIE10() &&
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
        }, _POLLING_INTERVAL_MS);
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
    __extends(BrowserSessionPersistence, _super);
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
        return _getInstance(resolverOverride);
    }
    _assert(auth._popupRedirectResolver, auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
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
    __extends(IdpCredential, _super);
    function IdpCredential(params) {
        var _this = _super.call(this, "custom" /* ProviderId.CUSTOM */, "custom" /* ProviderId.CUSTOM */) || this;
        _this.params = params;
        return _this;
    }
    IdpCredential.prototype._getIdTokenResponse = function (auth) {
        return signInWithIdp(auth, this._buildIdpRequest());
    };
    IdpCredential.prototype._linkToIdToken = function (auth, idToken) {
        return signInWithIdp(auth, this._buildIdpRequest(idToken));
    };
    IdpCredential.prototype._getReauthenticationResolver = function (auth) {
        return signInWithIdp(auth, this._buildIdpRequest());
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
}(AuthCredential));
function _signIn(params) {
    return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
}
function _reauth(params) {
    var auth = params.auth, user = params.user;
    _assert(user, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
}
function _link(params) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, user;
        return __generator(this, function (_a) {
            auth = params.auth, user = params.user;
            _assert(user, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
            return [2 /*return*/, _link$1(user, new IdpCredential(params), params.bypassAuthState)];
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
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _a, e_1;
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            var urlResponse, sessionId, postBody, tenantId, error, type, params, _a, e_2;
            return __generator(this, function (_b) {
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
                _fail(this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        }
    };
    AbstractPopupRedirectOperation.prototype.resolve = function (cred) {
        debugAssert(this.pendingPromise, 'Pending promise was never set');
        this.pendingPromise.resolve(cred);
        this.unregisterAndCleanUp();
    };
    AbstractPopupRedirectOperation.prototype.reject = function (error) {
        debugAssert(this.pendingPromise, 'Pending promise was never set');
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
var PENDING_REDIRECT_KEY = 'pendingRedirect';
// We only get one redirect outcome for any one auth, so just store it
// in here.
var redirectOutcomeMap = new Map();
var RedirectAction = /** @class */ (function (_super) {
    __extends(RedirectAction, _super);
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
        return __awaiter(this, void 0, void 0, function () {
            var readyOutcome, hasPendingRedirect, result_1, _a, e_1;
            return __generator(this, function (_b) {
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
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    RedirectAction.prototype.cleanUp = function () { };
    return RedirectAction;
}(AbstractPopupRedirectOperation));
function _getAndClearPendingRedirectStatus(resolver, auth) {
    return __awaiter(this, void 0, void 0, function () {
        var key, persistence, hasPendingRedirect;
        return __generator(this, function (_a) {
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
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
    return _getInstance(resolver._redirectPersistence);
}
function pendingRedirectKey(auth) {
    return _persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
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
    return __awaiter(this, void 0, void 0, function () {
        var authInternal, resolverInternal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = _castAuth(auth);
                    _assertInstanceOf(auth, provider, FederatedAuthProvider);
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
    return __awaiter(this, void 0, void 0, function () {
        var userInternal, resolverInternal, eventId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userInternal = getModularInstance(user);
                    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
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
    return __awaiter(this, void 0, void 0, function () {
        var userInternal, resolverInternal, eventId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userInternal = getModularInstance(user);
                    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
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
                    return [4 /*yield*/, _assertLinkedStatus(false, userInternal, provider.providerId)];
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _castAuth(auth)._initializationPromise];
                case 1:
                    _a.sent();
                    return [2 /*return*/, _getRedirectResult(auth, resolver, false)];
            }
        });
    });
}
function _getRedirectResult(auth, resolverExtern, bypassAuthState) {
    if (bypassAuthState === void 0) { bypassAuthState = false; }
    return __awaiter(this, void 0, void 0, function () {
        var authInternal, resolver, action, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authInternal = _castAuth(auth);
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
    return __awaiter(this, void 0, void 0, function () {
        var eventId;
        return __generator(this, function (_a) {
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
    return __awaiter(this, void 0, void 0, function () {
        var params, _i, _a, _b, key, value, scopes, paramsDict, _c, _d, key, appCheckToken, appCheckTokenFragment;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _assert(auth.config.authDomain, auth, "auth-domain-config-required" /* AuthErrorCode.MISSING_AUTH_DOMAIN */);
                    _assert(auth.config.apiKey, auth, "invalid-api-key" /* AuthErrorCode.INVALID_API_KEY */);
                    params = {
                        apiKey: auth.config.apiKey,
                        appName: auth.name,
                        authType: authType,
                        redirectUrl: redirectUrl,
                        v: SDK_VERSION,
                        eventId: eventId
                    };
                    if (provider instanceof FederatedAuthProvider) {
                        provider.setDefaultLanguage(auth.languageCode);
                        params.providerId = provider.providerId || '';
                        if (!isEmpty(provider.getCustomParameters())) {
                            params.customParameters = JSON.stringify(provider.getCustomParameters());
                        }
                        // TODO set additionalParams from the provider as well?
                        for (_i = 0, _a = Object.entries(additionalParams || {}); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            params[key] = value;
                        }
                    }
                    if (provider instanceof BaseOAuthProvider) {
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
                    return [2 /*return*/, "".concat(getHandlerBase(auth), "?").concat(querystring(paramsDict).slice(1)).concat(appCheckTokenFragment)];
            }
        });
    });
}
function getHandlerBase(_a) {
    var config = _a.config;
    if (!config.emulator) {
        return "https://".concat(config.authDomain, "/").concat(WIDGET_PATH);
    }
    return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
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
function _getProjectConfig(auth, request) {
    if (request === void 0) { request = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _performApiRequest(auth, "GET" /* HttpMethod.GET */, "/v1/projects" /* Endpoint.GET_PROJECT_CONFIG */, request)];
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
 * How long to wait after the app comes back into focus before concluding that
 * the user closed the sign in tab.
 */
var REDIRECT_TIMEOUT_MS = 2000;
/**
 * Generates the URL for the OAuth handler.
 */
function _generateHandlerUrl(auth, event, provider) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var BuildInfo, sessionDigest, additionalParams;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    BuildInfo = _cordovaWindow().BuildInfo;
                    debugAssert(event.sessionId, 'AuthEvent did not contain a session ID');
                    return [4 /*yield*/, computeSha256(event.sessionId)];
                case 1:
                    sessionDigest = _b.sent();
                    additionalParams = {};
                    if (_isIOS()) {
                        // iOS app identifier
                        additionalParams['ibi'] = BuildInfo.packageName;
                    }
                    else if (_isAndroid()) {
                        // Android app identifier
                        additionalParams['apn'] = BuildInfo.packageName;
                    }
                    else {
                        _fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
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
    return __awaiter(this, void 0, void 0, function () {
        var BuildInfo, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    BuildInfo = _cordovaWindow().BuildInfo;
                    request = {};
                    if (_isIOS()) {
                        request.iosBundleId = BuildInfo.packageName;
                    }
                    else if (_isAndroid()) {
                        request.androidPackageName = BuildInfo.packageName;
                    }
                    else {
                        _fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
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
                iabRef = cordova.InAppBrowser.open(handlerUrl, _isIOS7Or8() ? '_blank' : '_system', 'location=yes');
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
    return __awaiter(this, void 0, void 0, function () {
        var cordova, cleanup;
        return __generator(this, function (_a) {
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
                                    reject(_createError(auth, "redirect-cancelled-by-user" /* AuthErrorCode.REDIRECT_CANCELLED_BY_USER */));
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
                            if (_isAndroid()) {
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
    _assert(typeof ((_a = win === null || win === void 0 ? void 0 : win.universalLinks) === null || _a === void 0 ? void 0 : _a.subscribe) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-universal-links-plugin-fix'
    });
    // https://www.npmjs.com/package/cordova-plugin-buildinfo
    _assert(typeof ((_b = win === null || win === void 0 ? void 0 : win.BuildInfo) === null || _b === void 0 ? void 0 : _b.packageName) !== 'undefined', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-buildInfo'
    });
    // https://github.com/google/cordova-plugin-browsertab
    _assert(typeof ((_e = (_d = (_c = win === null || win === void 0 ? void 0 : win.cordova) === null || _c === void 0 ? void 0 : _c.plugins) === null || _d === void 0 ? void 0 : _d.browsertab) === null || _e === void 0 ? void 0 : _e.openUrl) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    _assert(typeof ((_h = (_g = (_f = win === null || win === void 0 ? void 0 : win.cordova) === null || _f === void 0 ? void 0 : _f.plugins) === null || _g === void 0 ? void 0 : _g.browsertab) === null || _h === void 0 ? void 0 : _h.isAvailable) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
    _assert(typeof ((_k = (_j = win === null || win === void 0 ? void 0 : win.cordova) === null || _j === void 0 ? void 0 : _j.InAppBrowser) === null || _k === void 0 ? void 0 : _k.open) === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-inappbrowser'
    });
}
/**
 * Computes the SHA-256 of a session ID. The SubtleCrypto interface is only
 * available in "secure" contexts, which covers Cordova (which is served on a file
 * protocol).
 */
function computeSha256(sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var bytes, buf, arr;
        return __generator(this, function (_a) {
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
    debugAssert(/[0-9a-zA-Z]+/.test(str), 'Can only convert alpha-numeric strings');
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
            consumer.onError(_createError(this.auth, code));
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
var SESSION_ID_LENGTH = 20;
/** Custom AuthEventManager that adds passive listeners to events */
var CordovaAuthEventManager = /** @class */ (function (_super) {
    __extends(CordovaAuthEventManager, _super);
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        error: _createError(auth, "no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
    };
}
function _savePartialEvent(auth, event) {
    return storage()._set(persistenceKey(auth), event);
}
function _getAndRemoveEvent(auth) {
    return __awaiter(this, void 0, void 0, function () {
        var event;
        return __generator(this, function (_a) {
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
        var error = code ? _createError(code) : null;
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
    return _getInstance(browserLocalPersistence);
}
function persistenceKey(auth) {
    return _persistenceKeyName("authEvent" /* KeyName.AUTH_EVENT */, auth.config.apiKey, auth.name);
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
    return querystringDecode(rest.join('?'));
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
        return __awaiter(this, void 0, void 0, function () {
            var key, manager;
            return __generator(this, function (_a) {
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
        _fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    };
    CordovaPopupRedirectResolver.prototype._openRedirect = function (auth, provider, authType, eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, event, url, iabRef;
            return __generator(this, function (_a) {
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
        var noEventTimeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        var universalLinksCb = function (eventData) { return __awaiter(_this, void 0, void 0, function () {
            var partialEvent, finalEvent;
            return __generator(this, function (_a) {
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
        _cordovaWindow().handleOpenURL = function (url) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
        error: _createError("no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
    };
}

export { signInWithEmailAndPassword as $, ActionCodeOperation as A, PhoneAuthCredential as B, inMemoryPersistence as C, EmailAuthProvider as D, EmailAuthCredential as E, FactorId as F, FacebookAuthProvider as G, GoogleAuthProvider as H, GithubAuthProvider as I, OAuthProvider as J, SAMLAuthProvider as K, signInAnonymously as L, signInWithCredential as M, linkWithCredential as N, OperationType as O, ProviderId as P, reauthenticateWithCredential as Q, signInWithCustomToken as R, SignInMethod as S, TwitterAuthProvider as T, sendPasswordResetEmail as U, confirmPasswordReset as V, applyActionCode as W, checkActionCode as X, verifyPasswordResetCode as Y, createUserWithEmailAndPassword as Z, _signInWithRedirect as _, _reauthenticateWithRedirect as a, AuthImpl as a$, sendSignInLinkToEmail as a0, isSignInWithEmailLink as a1, signInWithEmailLink as a2, fetchSignInMethodsForEmail as a3, sendEmailVerification as a4, verifyBeforeUpdateEmail as a5, ActionCodeURL as a6, parseActionCodeURL as a7, updateProfile as a8, updateEmail as a9, _generateEventId as aA, AbstractPopupRedirectOperation as aB, _assertInstanceOf as aC, _withDefaultResolver as aD, FederatedAuthProvider as aE, _fail as aF, _getProjectConfig as aG, _getCurrentUrl as aH, _emulatorUrl as aI, _isChromeIOS as aJ, _isFirefox as aK, _isIOSStandalone as aL, _getRedirectUrl as aM, _setWindowLocation as aN, _isMobileBrowser as aO, _isSafari as aP, _isIOS as aQ, _getRedirectResult as aR, _overrideRedirectResult as aS, AuthEventManager as aT, debugFail as aU, finalizeEnrollPhoneMfa as aV, finalizeEnrollTotpMfa as aW, startEnrollTotpMfa as aX, _persistenceKeyName as aY, UserImpl as aZ, _getInstance as a_, updatePassword as aa, getIdToken as ab, getIdTokenResult as ac, unlink as ad, getAdditionalUserInfo as ae, reload as af, getMultiFactorResolver as ag, multiFactor as ah, _performApiRequest as ai, _addTidIfNecessary as aj, _assert as ak, Delay as al, _window as am, isV2 as an, _createError as ao, _loadJS as ap, _generateCallbackName as aq, getRecaptchaParams as ar, _isHttpOrHttps as as, _isWorker as at, _castAuth as au, _assertLinkedStatus as av, sendPhoneVerificationCode as aw, startEnrollPhoneMfa as ax, _link$1 as ay, debugAssert as az, _linkWithRedirect as b, _getClientVersion as b0, FetchProvider as b1, SAMLAuthCredential as b2, signInWithRedirect as b3, linkWithRedirect as b4, reauthenticateWithRedirect as b5, indexedDBLocalPersistence as c, cordovaPopupRedirectResolver as d, browserLocalPersistence as e, browserSessionPersistence as f, getRedirectResult as g, initializeRecaptchaConfig as h, initializeAuth as i, beforeAuthStateChanged as j, onAuthStateChanged as k, updateCurrentUser as l, signOut as m, revokeAccessToken as n, onIdTokenChanged as o, deleteUser as p, debugErrorMap as q, registerAuth as r, setPersistence as s, prodErrorMap as t, useDeviceLanguage as u, validatePassword as v, AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY as w, connectAuthEmulator as x, AuthCredential as y, OAuthCredential as z };
//# sourceMappingURL=popup_redirect-106f885f.js.map
