'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('@firebase/installations');
var component = require('@firebase/component');
var tslib = require('tslib');
var idb = require('idb');
var util = require('@firebase/util');
var app = require('@firebase/app');

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
var DEFAULT_VAPID_KEY = 'BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4';
var ENDPOINT = 'https://fcmregistrations.googleapis.com/v1';
/** Key of FCM Payload in Notification's data field. */
var FCM_MSG = 'FCM_MSG';
var CONSOLE_CAMPAIGN_ID = 'google.c.a.c_id';
// Defined as in proto/messaging_event.proto. Neglecting fields that are supported.
var SDK_PLATFORM_WEB = 3;
var EVENT_MESSAGE_DELIVERED = 1;
var MessageType$1;
(function (MessageType) {
    MessageType[MessageType["DATA_MESSAGE"] = 1] = "DATA_MESSAGE";
    MessageType[MessageType["DISPLAY_NOTIFICATION"] = 3] = "DISPLAY_NOTIFICATION";
})(MessageType$1 || (MessageType$1 = {}));

/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
var MessageType;
(function (MessageType) {
    MessageType["PUSH_RECEIVED"] = "push-received";
    MessageType["NOTIFICATION_CLICKED"] = "notification-clicked";
})(MessageType || (MessageType = {}));

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
function arrayToBase64(array) {
    var uint8Array = new Uint8Array(array);
    var base64String = btoa(String.fromCharCode.apply(String, tslib.__spreadArray([], tslib.__read(uint8Array), false)));
    return base64String.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function base64ToArray(base64String) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    var rawData = atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
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
var OLD_DB_NAME = 'fcm_token_details_db';
/**
 * The last DB version of 'fcm_token_details_db' was 4. This is one higher, so that the upgrade
 * callback is called for all versions of the old DB.
 */
var OLD_DB_VERSION = 5;
var OLD_OBJECT_STORE_NAME = 'fcm_token_object_Store';
function migrateOldDatabase(senderId) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var databases, dbNames, tokenDetails, db;
        var _this = this;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('databases' in indexedDB)) return [3 /*break*/, 2];
                    return [4 /*yield*/, indexedDB.databases()];
                case 1:
                    databases = _a.sent();
                    dbNames = databases.map(function (db) { return db.name; });
                    if (!dbNames.includes(OLD_DB_NAME)) {
                        // old DB didn't exist, no need to open.
                        return [2 /*return*/, null];
                    }
                    _a.label = 2;
                case 2:
                    tokenDetails = null;
                    return [4 /*yield*/, idb.openDB(OLD_DB_NAME, OLD_DB_VERSION, {
                            upgrade: function (db, oldVersion, newVersion, upgradeTransaction) { return tslib.__awaiter(_this, void 0, void 0, function () {
                                var objectStore, value, oldDetails, oldDetails, oldDetails;
                                var _a;
                                return tslib.__generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (oldVersion < 2) {
                                                // Database too old, skip migration.
                                                return [2 /*return*/];
                                            }
                                            if (!db.objectStoreNames.contains(OLD_OBJECT_STORE_NAME)) {
                                                // Database did not exist. Nothing to do.
                                                return [2 /*return*/];
                                            }
                                            objectStore = upgradeTransaction.objectStore(OLD_OBJECT_STORE_NAME);
                                            return [4 /*yield*/, objectStore.index('fcmSenderId').get(senderId)];
                                        case 1:
                                            value = _b.sent();
                                            return [4 /*yield*/, objectStore.clear()];
                                        case 2:
                                            _b.sent();
                                            if (!value) {
                                                // No entry in the database, nothing to migrate.
                                                return [2 /*return*/];
                                            }
                                            if (oldVersion === 2) {
                                                oldDetails = value;
                                                if (!oldDetails.auth || !oldDetails.p256dh || !oldDetails.endpoint) {
                                                    return [2 /*return*/];
                                                }
                                                tokenDetails = {
                                                    token: oldDetails.fcmToken,
                                                    createTime: (_a = oldDetails.createTime) !== null && _a !== void 0 ? _a : Date.now(),
                                                    subscriptionOptions: {
                                                        auth: oldDetails.auth,
                                                        p256dh: oldDetails.p256dh,
                                                        endpoint: oldDetails.endpoint,
                                                        swScope: oldDetails.swScope,
                                                        vapidKey: typeof oldDetails.vapidKey === 'string'
                                                            ? oldDetails.vapidKey
                                                            : arrayToBase64(oldDetails.vapidKey)
                                                    }
                                                };
                                            }
                                            else if (oldVersion === 3) {
                                                oldDetails = value;
                                                tokenDetails = {
                                                    token: oldDetails.fcmToken,
                                                    createTime: oldDetails.createTime,
                                                    subscriptionOptions: {
                                                        auth: arrayToBase64(oldDetails.auth),
                                                        p256dh: arrayToBase64(oldDetails.p256dh),
                                                        endpoint: oldDetails.endpoint,
                                                        swScope: oldDetails.swScope,
                                                        vapidKey: arrayToBase64(oldDetails.vapidKey)
                                                    }
                                                };
                                            }
                                            else if (oldVersion === 4) {
                                                oldDetails = value;
                                                tokenDetails = {
                                                    token: oldDetails.fcmToken,
                                                    createTime: oldDetails.createTime,
                                                    subscriptionOptions: {
                                                        auth: arrayToBase64(oldDetails.auth),
                                                        p256dh: arrayToBase64(oldDetails.p256dh),
                                                        endpoint: oldDetails.endpoint,
                                                        swScope: oldDetails.swScope,
                                                        vapidKey: arrayToBase64(oldDetails.vapidKey)
                                                    }
                                                };
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }
                        })];
                case 3:
                    db = _a.sent();
                    db.close();
                    // Delete all old databases.
                    return [4 /*yield*/, idb.deleteDB(OLD_DB_NAME)];
                case 4:
                    // Delete all old databases.
                    _a.sent();
                    return [4 /*yield*/, idb.deleteDB('fcm_vapid_details_db')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, idb.deleteDB('undefined')];
                case 6:
                    _a.sent();
                    return [2 /*return*/, checkTokenDetails(tokenDetails) ? tokenDetails : null];
            }
        });
    });
}
function checkTokenDetails(tokenDetails) {
    if (!tokenDetails || !tokenDetails.subscriptionOptions) {
        return false;
    }
    var subscriptionOptions = tokenDetails.subscriptionOptions;
    return (typeof tokenDetails.createTime === 'number' &&
        tokenDetails.createTime > 0 &&
        typeof tokenDetails.token === 'string' &&
        tokenDetails.token.length > 0 &&
        typeof subscriptionOptions.auth === 'string' &&
        subscriptionOptions.auth.length > 0 &&
        typeof subscriptionOptions.p256dh === 'string' &&
        subscriptionOptions.p256dh.length > 0 &&
        typeof subscriptionOptions.endpoint === 'string' &&
        subscriptionOptions.endpoint.length > 0 &&
        typeof subscriptionOptions.swScope === 'string' &&
        subscriptionOptions.swScope.length > 0 &&
        typeof subscriptionOptions.vapidKey === 'string' &&
        subscriptionOptions.vapidKey.length > 0);
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
// Exported for tests.
var DATABASE_NAME = 'firebase-messaging-database';
var DATABASE_VERSION = 1;
var OBJECT_STORE_NAME = 'firebase-messaging-store';
var dbPromise = null;
function getDbPromise() {
    if (!dbPromise) {
        dbPromise = idb.openDB(DATABASE_NAME, DATABASE_VERSION, {
            upgrade: function (upgradeDb, oldVersion) {
                // We don't use 'break' in this switch statement, the fall-through behavior is what we want,
                // because if there are multiple versions between the old version and the current version, we
                // want ALL the migrations that correspond to those versions to run, not only the last one.
                // eslint-disable-next-line default-case
                switch (oldVersion) {
                    case 0:
                        upgradeDb.createObjectStore(OBJECT_STORE_NAME);
                }
            }
        });
    }
    return dbPromise;
}
/** Gets record(s) from the objectStore that match the given key. */
function dbGet(firebaseDependencies) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var key, db, tokenDetails, oldTokenDetails;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = getKey(firebaseDependencies);
                    return [4 /*yield*/, getDbPromise()];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, db
                            .transaction(OBJECT_STORE_NAME)
                            .objectStore(OBJECT_STORE_NAME)
                            .get(key)];
                case 2:
                    tokenDetails = (_a.sent());
                    if (!tokenDetails) return [3 /*break*/, 3];
                    return [2 /*return*/, tokenDetails];
                case 3: return [4 /*yield*/, migrateOldDatabase(firebaseDependencies.appConfig.senderId)];
                case 4:
                    oldTokenDetails = _a.sent();
                    if (!oldTokenDetails) return [3 /*break*/, 6];
                    return [4 /*yield*/, dbSet(firebaseDependencies, oldTokenDetails)];
                case 5:
                    _a.sent();
                    return [2 /*return*/, oldTokenDetails];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/** Assigns or overwrites the record for the given key with the given value. */
function dbSet(firebaseDependencies, tokenDetails) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var key, db, tx;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = getKey(firebaseDependencies);
                    return [4 /*yield*/, getDbPromise()];
                case 1:
                    db = _a.sent();
                    tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
                    return [4 /*yield*/, tx.objectStore(OBJECT_STORE_NAME).put(tokenDetails, key)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tx.done];
                case 3:
                    _a.sent();
                    return [2 /*return*/, tokenDetails];
            }
        });
    });
}
/** Removes record(s) from the objectStore that match the given key. */
function dbRemove(firebaseDependencies) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var key, db, tx;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = getKey(firebaseDependencies);
                    return [4 /*yield*/, getDbPromise()];
                case 1:
                    db = _a.sent();
                    tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
                    return [4 /*yield*/, tx.objectStore(OBJECT_STORE_NAME).delete(key)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tx.done];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getKey(_a) {
    var appConfig = _a.appConfig;
    return appConfig.appId;
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
var _a;
var ERROR_MAP = (_a = {},
    _a["missing-app-config-values" /* ErrorCode.MISSING_APP_CONFIG_VALUES */] = 'Missing App configuration value: "{$valueName}"',
    _a["only-available-in-window" /* ErrorCode.AVAILABLE_IN_WINDOW */] = 'This method is available in a Window context.',
    _a["only-available-in-sw" /* ErrorCode.AVAILABLE_IN_SW */] = 'This method is available in a service worker context.',
    _a["permission-default" /* ErrorCode.PERMISSION_DEFAULT */] = 'The notification permission was not granted and dismissed instead.',
    _a["permission-blocked" /* ErrorCode.PERMISSION_BLOCKED */] = 'The notification permission was not granted and blocked instead.',
    _a["unsupported-browser" /* ErrorCode.UNSUPPORTED_BROWSER */] = "This browser doesn't support the API's required to use the Firebase SDK.",
    _a["indexed-db-unsupported" /* ErrorCode.INDEXED_DB_UNSUPPORTED */] = "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
    _a["failed-service-worker-registration" /* ErrorCode.FAILED_DEFAULT_REGISTRATION */] = 'We are unable to register the default service worker. {$browserErrorMessage}',
    _a["token-subscribe-failed" /* ErrorCode.TOKEN_SUBSCRIBE_FAILED */] = 'A problem occurred while subscribing the user to FCM: {$errorInfo}',
    _a["token-subscribe-no-token" /* ErrorCode.TOKEN_SUBSCRIBE_NO_TOKEN */] = 'FCM returned no token when subscribing the user to push.',
    _a["token-unsubscribe-failed" /* ErrorCode.TOKEN_UNSUBSCRIBE_FAILED */] = 'A problem occurred while unsubscribing the ' +
        'user from FCM: {$errorInfo}',
    _a["token-update-failed" /* ErrorCode.TOKEN_UPDATE_FAILED */] = 'A problem occurred while updating the user from FCM: {$errorInfo}',
    _a["token-update-no-token" /* ErrorCode.TOKEN_UPDATE_NO_TOKEN */] = 'FCM returned no token when updating the user to push.',
    _a["use-sw-after-get-token" /* ErrorCode.USE_SW_AFTER_GET_TOKEN */] = 'The useServiceWorker() method may only be called once and must be ' +
        'called before calling getToken() to ensure your service worker is used.',
    _a["invalid-sw-registration" /* ErrorCode.INVALID_SW_REGISTRATION */] = 'The input to useServiceWorker() must be a ServiceWorkerRegistration.',
    _a["invalid-bg-handler" /* ErrorCode.INVALID_BG_HANDLER */] = 'The input to setBackgroundMessageHandler() must be a function.',
    _a["invalid-vapid-key" /* ErrorCode.INVALID_VAPID_KEY */] = 'The public VAPID key must be a string.',
    _a["use-vapid-key-after-get-token" /* ErrorCode.USE_VAPID_KEY_AFTER_GET_TOKEN */] = 'The usePublicVapidKey() method may only be called once and must be ' +
        'called before calling getToken() to ensure your VAPID key is used.',
    _a);
var ERROR_FACTORY = new util.ErrorFactory('messaging', 'Messaging', ERROR_MAP);

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
function requestGetToken(firebaseDependencies, subscriptionOptions) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var headers, body, subscribeOptions, responseData, response, err_1, message;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getHeaders(firebaseDependencies)];
                case 1:
                    headers = _a.sent();
                    body = getBody(subscriptionOptions);
                    subscribeOptions = {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(body)
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fetch(getEndpoint(firebaseDependencies.appConfig), subscribeOptions)];
                case 3:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 4:
                    responseData = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    throw ERROR_FACTORY.create("token-subscribe-failed" /* ErrorCode.TOKEN_SUBSCRIBE_FAILED */, {
                        errorInfo: err_1 === null || err_1 === void 0 ? void 0 : err_1.toString()
                    });
                case 6:
                    if (responseData.error) {
                        message = responseData.error.message;
                        throw ERROR_FACTORY.create("token-subscribe-failed" /* ErrorCode.TOKEN_SUBSCRIBE_FAILED */, {
                            errorInfo: message
                        });
                    }
                    if (!responseData.token) {
                        throw ERROR_FACTORY.create("token-subscribe-no-token" /* ErrorCode.TOKEN_SUBSCRIBE_NO_TOKEN */);
                    }
                    return [2 /*return*/, responseData.token];
            }
        });
    });
}
function requestUpdateToken(firebaseDependencies, tokenDetails) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var headers, body, updateOptions, responseData, response, err_2, message;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getHeaders(firebaseDependencies)];
                case 1:
                    headers = _a.sent();
                    body = getBody(tokenDetails.subscriptionOptions);
                    updateOptions = {
                        method: 'PATCH',
                        headers: headers,
                        body: JSON.stringify(body)
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(getEndpoint(firebaseDependencies.appConfig), "/").concat(tokenDetails.token), updateOptions)];
                case 3:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 4:
                    responseData = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    throw ERROR_FACTORY.create("token-update-failed" /* ErrorCode.TOKEN_UPDATE_FAILED */, {
                        errorInfo: err_2 === null || err_2 === void 0 ? void 0 : err_2.toString()
                    });
                case 6:
                    if (responseData.error) {
                        message = responseData.error.message;
                        throw ERROR_FACTORY.create("token-update-failed" /* ErrorCode.TOKEN_UPDATE_FAILED */, {
                            errorInfo: message
                        });
                    }
                    if (!responseData.token) {
                        throw ERROR_FACTORY.create("token-update-no-token" /* ErrorCode.TOKEN_UPDATE_NO_TOKEN */);
                    }
                    return [2 /*return*/, responseData.token];
            }
        });
    });
}
function requestDeleteToken(firebaseDependencies, token) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var headers, unsubscribeOptions, response, responseData, message, err_3;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getHeaders(firebaseDependencies)];
                case 1:
                    headers = _a.sent();
                    unsubscribeOptions = {
                        method: 'DELETE',
                        headers: headers
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(getEndpoint(firebaseDependencies.appConfig), "/").concat(token), unsubscribeOptions)];
                case 3:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 4:
                    responseData = _a.sent();
                    if (responseData.error) {
                        message = responseData.error.message;
                        throw ERROR_FACTORY.create("token-unsubscribe-failed" /* ErrorCode.TOKEN_UNSUBSCRIBE_FAILED */, {
                            errorInfo: message
                        });
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_3 = _a.sent();
                    throw ERROR_FACTORY.create("token-unsubscribe-failed" /* ErrorCode.TOKEN_UNSUBSCRIBE_FAILED */, {
                        errorInfo: err_3 === null || err_3 === void 0 ? void 0 : err_3.toString()
                    });
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getEndpoint(_a) {
    var projectId = _a.projectId;
    return "".concat(ENDPOINT, "/projects/").concat(projectId, "/registrations");
}
function getHeaders(_a) {
    var appConfig = _a.appConfig, installations = _a.installations;
    return tslib.__awaiter(this, void 0, void 0, function () {
        var authToken;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, installations.getToken()];
                case 1:
                    authToken = _b.sent();
                    return [2 /*return*/, new Headers({
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'x-goog-api-key': appConfig.apiKey,
                            'x-goog-firebase-installations-auth': "FIS ".concat(authToken)
                        })];
            }
        });
    });
}
function getBody(_a) {
    var p256dh = _a.p256dh, auth = _a.auth, endpoint = _a.endpoint, vapidKey = _a.vapidKey;
    var body = {
        web: {
            endpoint: endpoint,
            auth: auth,
            p256dh: p256dh
        }
    };
    if (vapidKey !== DEFAULT_VAPID_KEY) {
        body.web.applicationPubKey = vapidKey;
    }
    return body;
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
// UpdateRegistration will be called once every week.
var TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
function getTokenInternal(messaging) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var pushSubscription, subscriptionOptions, tokenDetails, e_1;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPushSubscription(messaging.swRegistration, messaging.vapidKey)];
                case 1:
                    pushSubscription = _a.sent();
                    subscriptionOptions = {
                        vapidKey: messaging.vapidKey,
                        swScope: messaging.swRegistration.scope,
                        endpoint: pushSubscription.endpoint,
                        auth: arrayToBase64(pushSubscription.getKey('auth')),
                        p256dh: arrayToBase64(pushSubscription.getKey('p256dh'))
                    };
                    return [4 /*yield*/, dbGet(messaging.firebaseDependencies)];
                case 2:
                    tokenDetails = _a.sent();
                    if (!!tokenDetails) return [3 /*break*/, 3];
                    // No token, get a new one.
                    return [2 /*return*/, getNewToken(messaging.firebaseDependencies, subscriptionOptions)];
                case 3:
                    if (!!isTokenValid(tokenDetails.subscriptionOptions, subscriptionOptions)) return [3 /*break*/, 8];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, requestDeleteToken(messaging.firebaseDependencies, tokenDetails.token)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    // Suppress errors because of #2364
                    console.warn(e_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/, getNewToken(messaging.firebaseDependencies, subscriptionOptions)];
                case 8:
                    if (Date.now() >= tokenDetails.createTime + TOKEN_EXPIRATION_MS) {
                        // Weekly token refresh
                        return [2 /*return*/, updateToken(messaging, {
                                token: tokenDetails.token,
                                createTime: Date.now(),
                                subscriptionOptions: subscriptionOptions
                            })];
                    }
                    else {
                        // Valid token, nothing to do.
                        return [2 /*return*/, tokenDetails.token];
                    }
                case 9: return [2 /*return*/];
            }
        });
    });
}
/**
 * This method deletes the token from the database, unsubscribes the token from FCM, and unregisters
 * the push subscription if it exists.
 */
function deleteTokenInternal(messaging) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var tokenDetails, pushSubscription;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbGet(messaging.firebaseDependencies)];
                case 1:
                    tokenDetails = _a.sent();
                    if (!tokenDetails) return [3 /*break*/, 4];
                    return [4 /*yield*/, requestDeleteToken(messaging.firebaseDependencies, tokenDetails.token)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dbRemove(messaging.firebaseDependencies)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, messaging.swRegistration.pushManager.getSubscription()];
                case 5:
                    pushSubscription = _a.sent();
                    if (pushSubscription) {
                        return [2 /*return*/, pushSubscription.unsubscribe()];
                    }
                    // If there's no SW, consider it a success.
                    return [2 /*return*/, true];
            }
        });
    });
}
function updateToken(messaging, tokenDetails) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var updatedToken, updatedTokenDetails, e_2;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 5]);
                    return [4 /*yield*/, requestUpdateToken(messaging.firebaseDependencies, tokenDetails)];
                case 1:
                    updatedToken = _a.sent();
                    updatedTokenDetails = tslib.__assign(tslib.__assign({}, tokenDetails), { token: updatedToken, createTime: Date.now() });
                    return [4 /*yield*/, dbSet(messaging.firebaseDependencies, updatedTokenDetails)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, updatedToken];
                case 3:
                    e_2 = _a.sent();
                    return [4 /*yield*/, deleteTokenInternal(messaging)];
                case 4:
                    _a.sent();
                    throw e_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getNewToken(firebaseDependencies, subscriptionOptions) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var token, tokenDetails;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requestGetToken(firebaseDependencies, subscriptionOptions)];
                case 1:
                    token = _a.sent();
                    tokenDetails = {
                        token: token,
                        createTime: Date.now(),
                        subscriptionOptions: subscriptionOptions
                    };
                    return [4 /*yield*/, dbSet(firebaseDependencies, tokenDetails)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, tokenDetails.token];
            }
        });
    });
}
/**
 * Gets a PushSubscription for the current user.
 */
function getPushSubscription(swRegistration, vapidKey) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var subscription;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, swRegistration.pushManager.getSubscription()];
                case 1:
                    subscription = _a.sent();
                    if (subscription) {
                        return [2 /*return*/, subscription];
                    }
                    return [2 /*return*/, swRegistration.pushManager.subscribe({
                            userVisibleOnly: true,
                            // Chrome <= 75 doesn't support base64-encoded VAPID key. For backward compatibility, VAPID key
                            // submitted to pushManager#subscribe must be of type Uint8Array.
                            applicationServerKey: base64ToArray(vapidKey)
                        })];
            }
        });
    });
}
/**
 * Checks if the saved tokenDetails object matches the configuration provided.
 */
function isTokenValid(dbOptions, currentOptions) {
    var isVapidKeyEqual = currentOptions.vapidKey === dbOptions.vapidKey;
    var isEndpointEqual = currentOptions.endpoint === dbOptions.endpoint;
    var isAuthEqual = currentOptions.auth === dbOptions.auth;
    var isP256dhEqual = currentOptions.p256dh === dbOptions.p256dh;
    return isVapidKeyEqual && isEndpointEqual && isAuthEqual && isP256dhEqual;
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
function externalizePayload(internalPayload) {
    var payload = {
        from: internalPayload.from,
        // eslint-disable-next-line camelcase
        collapseKey: internalPayload.collapse_key,
        // eslint-disable-next-line camelcase
        messageId: internalPayload.fcmMessageId
    };
    propagateNotificationPayload(payload, internalPayload);
    propagateDataPayload(payload, internalPayload);
    propagateFcmOptions(payload, internalPayload);
    return payload;
}
function propagateNotificationPayload(payload, messagePayloadInternal) {
    if (!messagePayloadInternal.notification) {
        return;
    }
    payload.notification = {};
    var title = messagePayloadInternal.notification.title;
    if (!!title) {
        payload.notification.title = title;
    }
    var body = messagePayloadInternal.notification.body;
    if (!!body) {
        payload.notification.body = body;
    }
    var image = messagePayloadInternal.notification.image;
    if (!!image) {
        payload.notification.image = image;
    }
    var icon = messagePayloadInternal.notification.icon;
    if (!!icon) {
        payload.notification.icon = icon;
    }
}
function propagateDataPayload(payload, messagePayloadInternal) {
    if (!messagePayloadInternal.data) {
        return;
    }
    payload.data = messagePayloadInternal.data;
}
function propagateFcmOptions(payload, messagePayloadInternal) {
    var _a, _b, _c, _d, _e;
    // fcmOptions.link value is written into notification.click_action. see more in b/232072111
    if (!messagePayloadInternal.fcmOptions &&
        !((_a = messagePayloadInternal.notification) === null || _a === void 0 ? void 0 : _a.click_action)) {
        return;
    }
    payload.fcmOptions = {};
    var link = (_c = (_b = messagePayloadInternal.fcmOptions) === null || _b === void 0 ? void 0 : _b.link) !== null && _c !== void 0 ? _c : (_d = messagePayloadInternal.notification) === null || _d === void 0 ? void 0 : _d.click_action;
    if (!!link) {
        payload.fcmOptions.link = link;
    }
    // eslint-disable-next-line camelcase
    var analyticsLabel = (_e = messagePayloadInternal.fcmOptions) === null || _e === void 0 ? void 0 : _e.analytics_label;
    if (!!analyticsLabel) {
        payload.fcmOptions.analyticsLabel = analyticsLabel;
    }
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
function isConsoleMessage(data) {
    // This message has a campaign ID, meaning it was sent using the Firebase Console.
    return typeof data === 'object' && !!data && CONSOLE_CAMPAIGN_ID in data;
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
/** Returns a promise that resolves after given time passes. */
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
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
_mergeStrings('hts/frbslgigp.ogepscmv/ieo/eaylg', 'tp:/ieaeogn-agolai.o/1frlglgc/o');
_mergeStrings('AzSCbw63g1R0nCw85jG8', 'Iaya3yLKwmgvh7cF0q4');
function stageLog(messaging, internalPayload) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var fcmEvent, _a, _b;
        return tslib.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = createFcmEvent;
                    _b = [internalPayload];
                    return [4 /*yield*/, messaging.firebaseDependencies.installations.getId()];
                case 1:
                    fcmEvent = _a.apply(void 0, _b.concat([_c.sent()]));
                    createAndEnqueueLogEvent(messaging, fcmEvent, internalPayload.productId);
                    return [2 /*return*/];
            }
        });
    });
}
function createFcmEvent(internalPayload, fid) {
    var _a, _b;
    var fcmEvent = {};
    /* eslint-disable camelcase */
    // some fields should always be non-null. Still check to ensure.
    if (!!internalPayload.from) {
        fcmEvent.project_number = internalPayload.from;
    }
    if (!!internalPayload.fcmMessageId) {
        fcmEvent.message_id = internalPayload.fcmMessageId;
    }
    fcmEvent.instance_id = fid;
    if (!!internalPayload.notification) {
        fcmEvent.message_type = MessageType$1.DISPLAY_NOTIFICATION.toString();
    }
    else {
        fcmEvent.message_type = MessageType$1.DATA_MESSAGE.toString();
    }
    fcmEvent.sdk_platform = SDK_PLATFORM_WEB.toString();
    fcmEvent.package_name = self.origin.replace(/(^\w+:|^)\/\//, '');
    if (!!internalPayload.collapse_key) {
        fcmEvent.collapse_key = internalPayload.collapse_key;
    }
    fcmEvent.event = EVENT_MESSAGE_DELIVERED.toString();
    if (!!((_a = internalPayload.fcmOptions) === null || _a === void 0 ? void 0 : _a.analytics_label)) {
        fcmEvent.analytics_label = (_b = internalPayload.fcmOptions) === null || _b === void 0 ? void 0 : _b.analytics_label;
    }
    /* eslint-enable camelcase */
    return fcmEvent;
}
function createAndEnqueueLogEvent(messaging, fcmEvent, productId) {
    var logEvent = {};
    /* eslint-disable camelcase */
    logEvent.event_time_ms = Math.floor(Date.now()).toString();
    logEvent.source_extension_json_proto3 = JSON.stringify(fcmEvent);
    if (!!productId) {
        logEvent.compliance_data = buildComplianceData(productId);
    }
    // eslint-disable-next-line camelcase
    messaging.logEvents.push(logEvent);
}
function buildComplianceData(productId) {
    var complianceData = {
        privacy_context: {
            prequest: {
                origin_associated_product_id: productId
            }
        }
    };
    return complianceData;
}
function _mergeStrings(s1, s2) {
    var resultArray = [];
    for (var i = 0; i < s1.length; i++) {
        resultArray.push(s1.charAt(i));
        if (i < s2.length) {
            resultArray.push(s2.charAt(i));
        }
    }
    return resultArray.join('');
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
function onSubChange(event, messaging) {
    var _a, _b;
    return tslib.__awaiter(this, void 0, void 0, function () {
        var newSubscription, tokenDetails;
        return tslib.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    newSubscription = event.newSubscription;
                    if (!!newSubscription) return [3 /*break*/, 2];
                    // Subscription revoked, delete token
                    return [4 /*yield*/, deleteTokenInternal(messaging)];
                case 1:
                    // Subscription revoked, delete token
                    _c.sent();
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, dbGet(messaging.firebaseDependencies)];
                case 3:
                    tokenDetails = _c.sent();
                    return [4 /*yield*/, deleteTokenInternal(messaging)];
                case 4:
                    _c.sent();
                    messaging.vapidKey =
                        (_b = (_a = tokenDetails === null || tokenDetails === void 0 ? void 0 : tokenDetails.subscriptionOptions) === null || _a === void 0 ? void 0 : _a.vapidKey) !== null && _b !== void 0 ? _b : DEFAULT_VAPID_KEY;
                    return [4 /*yield*/, getTokenInternal(messaging)];
                case 5:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function onPush(event, messaging) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var internalPayload, clientList, payload;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    internalPayload = getMessagePayloadInternal(event);
                    if (!internalPayload) {
                        // Failed to get parsed MessagePayload from the PushEvent. Skip handling the push.
                        return [2 /*return*/];
                    }
                    if (!messaging.deliveryMetricsExportedToBigQueryEnabled) return [3 /*break*/, 2];
                    return [4 /*yield*/, stageLog(messaging, internalPayload)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, getClientList()];
                case 3:
                    clientList = _a.sent();
                    if (hasVisibleClients(clientList)) {
                        return [2 /*return*/, sendMessagePayloadInternalToWindows(clientList, internalPayload)];
                    }
                    if (!!!internalPayload.notification) return [3 /*break*/, 5];
                    return [4 /*yield*/, showNotification(wrapInternalPayload(internalPayload))];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if (!messaging) {
                        return [2 /*return*/];
                    }
                    if (!!!messaging.onBackgroundMessageHandler) return [3 /*break*/, 8];
                    payload = externalizePayload(internalPayload);
                    if (!(typeof messaging.onBackgroundMessageHandler === 'function')) return [3 /*break*/, 7];
                    return [4 /*yield*/, messaging.onBackgroundMessageHandler(payload)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    messaging.onBackgroundMessageHandler.next(payload);
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function onNotificationClick(event) {
    var _a, _b;
    return tslib.__awaiter(this, void 0, void 0, function () {
        var internalPayload, link, url, originUrl, client;
        return tslib.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    internalPayload = (_b = (_a = event.notification) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b[FCM_MSG];
                    if (!internalPayload) {
                        return [2 /*return*/];
                    }
                    else if (event.action) {
                        // User clicked on an action button. This will allow developers to act on action button clicks
                        // by using a custom onNotificationClick listener that they define.
                        return [2 /*return*/];
                    }
                    // Prevent other listeners from receiving the event
                    event.stopImmediatePropagation();
                    event.notification.close();
                    link = getLink(internalPayload);
                    if (!link) {
                        return [2 /*return*/];
                    }
                    url = new URL(link, self.location.href);
                    originUrl = new URL(self.location.origin);
                    if (url.host !== originUrl.host) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getWindowClient(url)];
                case 1:
                    client = _c.sent();
                    if (!!client) return [3 /*break*/, 4];
                    return [4 /*yield*/, self.clients.openWindow(link)];
                case 2:
                    client = _c.sent();
                    // Wait three seconds for the client to initialize and set up the message handler so that it
                    // can receive the message.
                    return [4 /*yield*/, sleep(3000)];
                case 3:
                    // Wait three seconds for the client to initialize and set up the message handler so that it
                    // can receive the message.
                    _c.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, client.focus()];
                case 5:
                    client = _c.sent();
                    _c.label = 6;
                case 6:
                    if (!client) {
                        // Window Client will not be returned if it's for a third party origin.
                        return [2 /*return*/];
                    }
                    internalPayload.messageType = MessageType.NOTIFICATION_CLICKED;
                    internalPayload.isFirebaseMessaging = true;
                    return [2 /*return*/, client.postMessage(internalPayload)];
            }
        });
    });
}
function wrapInternalPayload(internalPayload) {
    var _a;
    var wrappedInternalPayload = tslib.__assign({}, internalPayload.notification);
    // Put the message payload under FCM_MSG name so we can identify the notification as being an FCM
    // notification vs a notification from somewhere else (i.e. normal web push or developer generated
    // notification).
    wrappedInternalPayload.data = (_a = {},
        _a[FCM_MSG] = internalPayload,
        _a);
    return wrappedInternalPayload;
}
function getMessagePayloadInternal(_a) {
    var data = _a.data;
    if (!data) {
        return null;
    }
    try {
        return data.json();
    }
    catch (err) {
        // Not JSON so not an FCM message.
        return null;
    }
}
/**
 * @param url The URL to look for when focusing a client.
 * @return Returns an existing window client or a newly opened WindowClient.
 */
function getWindowClient(url) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var clientList, clientList_1, clientList_1_1, client, clientUrl;
        var e_1, _a;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientList()];
                case 1:
                    clientList = _b.sent();
                    try {
                        for (clientList_1 = tslib.__values(clientList), clientList_1_1 = clientList_1.next(); !clientList_1_1.done; clientList_1_1 = clientList_1.next()) {
                            client = clientList_1_1.value;
                            clientUrl = new URL(client.url, self.location.href);
                            if (url.host === clientUrl.host) {
                                return [2 /*return*/, client];
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (clientList_1_1 && !clientList_1_1.done && (_a = clientList_1.return)) _a.call(clientList_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
/**
 * @returns If there is currently a visible WindowClient, this method will resolve to true,
 * otherwise false.
 */
function hasVisibleClients(clientList) {
    return clientList.some(function (client) {
        return client.visibilityState === 'visible' &&
            // Ignore chrome-extension clients as that matches the background pages of extensions, which
            // are always considered visible for some reason.
            !client.url.startsWith('chrome-extension://');
    });
}
function sendMessagePayloadInternalToWindows(clientList, internalPayload) {
    var e_2, _a;
    internalPayload.isFirebaseMessaging = true;
    internalPayload.messageType = MessageType.PUSH_RECEIVED;
    try {
        for (var clientList_2 = tslib.__values(clientList), clientList_2_1 = clientList_2.next(); !clientList_2_1.done; clientList_2_1 = clientList_2.next()) {
            var client = clientList_2_1.value;
            client.postMessage(internalPayload);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (clientList_2_1 && !clientList_2_1.done && (_a = clientList_2.return)) _a.call(clientList_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
function getClientList() {
    return self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
        // TS doesn't know that "type: 'window'" means it'll return WindowClient[]
    });
}
function showNotification(notificationPayloadInternal) {
    var _a;
    // Note: Firefox does not support the maxActions property.
    // https://developer.mozilla.org/en-US/docs/Web/API/notification/maxActions
    var actions = notificationPayloadInternal.actions;
    var maxActions = Notification.maxActions;
    if (actions && maxActions && actions.length > maxActions) {
        console.warn("This browser only supports ".concat(maxActions, " actions. The remaining actions will not be displayed."));
    }
    return self.registration.showNotification(
    /* title= */ (_a = notificationPayloadInternal.title) !== null && _a !== void 0 ? _a : '', notificationPayloadInternal);
}
function getLink(payload) {
    var _a, _b, _c;
    // eslint-disable-next-line camelcase
    var link = (_b = (_a = payload.fcmOptions) === null || _a === void 0 ? void 0 : _a.link) !== null && _b !== void 0 ? _b : (_c = payload.notification) === null || _c === void 0 ? void 0 : _c.click_action;
    if (link) {
        return link;
    }
    if (isConsoleMessage(payload.data)) {
        // Notification created in the Firebase Console. Redirect to origin.
        return self.location.origin;
    }
    else {
        return null;
    }
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
function extractAppConfig(app) {
    var e_1, _a;
    if (!app || !app.options) {
        throw getMissingValueError('App Configuration Object');
    }
    if (!app.name) {
        throw getMissingValueError('App Name');
    }
    // Required app config keys
    var configKeys = [
        'projectId',
        'apiKey',
        'appId',
        'messagingSenderId'
    ];
    var options = app.options;
    try {
        for (var configKeys_1 = tslib.__values(configKeys), configKeys_1_1 = configKeys_1.next(); !configKeys_1_1.done; configKeys_1_1 = configKeys_1.next()) {
            var keyName = configKeys_1_1.value;
            if (!options[keyName]) {
                throw getMissingValueError(keyName);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (configKeys_1_1 && !configKeys_1_1.done && (_a = configKeys_1.return)) _a.call(configKeys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return {
        appName: app.name,
        projectId: options.projectId,
        apiKey: options.apiKey,
        appId: options.appId,
        senderId: options.messagingSenderId
    };
}
function getMissingValueError(valueName) {
    return ERROR_FACTORY.create("missing-app-config-values" /* ErrorCode.MISSING_APP_CONFIG_VALUES */, {
        valueName: valueName
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
var MessagingService = /** @class */ (function () {
    function MessagingService(app, installations, analyticsProvider) {
        // logging is only done with end user consent. Default to false.
        this.deliveryMetricsExportedToBigQueryEnabled = false;
        this.onBackgroundMessageHandler = null;
        this.onMessageHandler = null;
        this.logEvents = [];
        this.isLogServiceStarted = false;
        var appConfig = extractAppConfig(app);
        this.firebaseDependencies = {
            app: app,
            appConfig: appConfig,
            installations: installations,
            analyticsProvider: analyticsProvider
        };
    }
    MessagingService.prototype._delete = function () {
        return Promise.resolve();
    };
    return MessagingService;
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
var SwMessagingFactory = function (container) {
    var messaging = new MessagingService(container.getProvider('app').getImmediate(), container.getProvider('installations-internal').getImmediate(), container.getProvider('analytics-internal'));
    self.addEventListener('push', function (e) {
        e.waitUntil(onPush(e, messaging));
    });
    self.addEventListener('pushsubscriptionchange', function (e) {
        e.waitUntil(onSubChange(e, messaging));
    });
    self.addEventListener('notificationclick', function (e) {
        e.waitUntil(onNotificationClick(e));
    });
    return messaging;
};
/**
 * The messaging instance registered in sw is named differently than that of in client. This is
 * because both `registerMessagingInWindow` and `registerMessagingInSw` would be called in
 * `messaging-compat` and component with the same name can only be registered once.
 */
function registerMessagingInSw() {
    app._registerComponent(new component.Component('messaging-sw', SwMessagingFactory, "PUBLIC" /* ComponentType.PUBLIC */));
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
 * Checks whether all required APIs exist within SW Context
 * @returns a Promise that resolves to a boolean.
 *
 * @public
 */
function isSwSupported() {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var _a;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = util.isIndexedDBAvailable();
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, util.validateIndexedDBOpenable()];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2: 
                // firebase-js-sdk/issues/2393 reveals that idb#open in Safari iframe and Firefox private browsing
                // might be prohibited to run. In these contexts, an error would be thrown during the messaging
                // instantiating phase, informing the developers to import/call isSupported for special handling.
                return [2 /*return*/, (_a &&
                        'PushManager' in self &&
                        'Notification' in self &&
                        ServiceWorkerRegistration.prototype.hasOwnProperty('showNotification') &&
                        PushSubscription.prototype.hasOwnProperty('getKey'))];
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
function onBackgroundMessage$1(messaging, nextOrObserver) {
    if (self.document !== undefined) {
        throw ERROR_FACTORY.create("only-available-in-sw" /* ErrorCode.AVAILABLE_IN_SW */);
    }
    messaging.onBackgroundMessageHandler = nextOrObserver;
    return function () {
        messaging.onBackgroundMessageHandler = null;
    };
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
function _setDeliveryMetricsExportedToBigQueryEnabled(messaging, enable) {
    messaging.deliveryMetricsExportedToBigQueryEnabled =
        enable;
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
/**
 * Retrieves a Firebase Cloud Messaging instance.
 *
 * @returns The Firebase Cloud Messaging instance associated with the provided firebase app.
 *
 * @public
 */
function getMessagingInSw(app$1) {
    if (app$1 === void 0) { app$1 = app.getApp(); }
    // Conscious decision to make this async check non-blocking during the messaging instance
    // initialization phase for performance consideration. An error would be thrown latter for
    // developer's information. Developers can then choose to import and call `isSupported` for
    // special handling.
    isSwSupported().then(function (isSupported) {
        // If `isSwSupported()` resolved, but returned false.
        if (!isSupported) {
            throw ERROR_FACTORY.create("unsupported-browser" /* ErrorCode.UNSUPPORTED_BROWSER */);
        }
    }, function (_) {
        // If `isSwSupported()` rejected.
        throw ERROR_FACTORY.create("indexed-db-unsupported" /* ErrorCode.INDEXED_DB_UNSUPPORTED */);
    });
    return app._getProvider(util.getModularInstance(app$1), 'messaging-sw').getImmediate();
}
/**
 * Called when a message is received while the app is in the background. An app is considered to be
 * in the background if no active window is displayed.
 *
 * @param messaging - The {@link Messaging} instance.
 * @param nextOrObserver - This function, or observer object with `next` defined, is called when a
 * message is received and the app is currently in the background.
 *
 * @returns To stop listening for messages execute this returned function
 *
 * @public
 */
function onBackgroundMessage(messaging, nextOrObserver) {
    messaging = util.getModularInstance(messaging);
    return onBackgroundMessage$1(messaging, nextOrObserver);
}
/**
 * Enables or disables Firebase Cloud Messaging message delivery metrics export to BigQuery. By
 * default, message delivery metrics are not exported to BigQuery. Use this method to enable or
 * disable the export at runtime.
 *
 * @param messaging - The `FirebaseMessaging` instance.
 * @param enable - Whether Firebase Cloud Messaging should export message delivery metrics to
 * BigQuery.
 *
 * @public
 */
function experimentalSetDeliveryMetricsExportedToBigQueryEnabled(messaging, enable) {
    messaging = util.getModularInstance(messaging);
    return _setDeliveryMetricsExportedToBigQueryEnabled(messaging, enable);
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
registerMessagingInSw();

exports.experimentalSetDeliveryMetricsExportedToBigQueryEnabled = experimentalSetDeliveryMetricsExportedToBigQueryEnabled;
exports.getMessaging = getMessagingInSw;
exports.isSupported = isSwSupported;
exports.onBackgroundMessage = onBackgroundMessage;
//# sourceMappingURL=index.sw.cjs.map
