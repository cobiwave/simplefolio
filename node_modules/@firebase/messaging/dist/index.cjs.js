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
var DEFAULT_SW_PATH = '/firebase-messaging-sw.js';
var DEFAULT_SW_SCOPE = '/firebase-cloud-messaging-push-scope';
var DEFAULT_VAPID_KEY = 'BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4';
var ENDPOINT = 'https://fcmregistrations.googleapis.com/v1';
var CONSOLE_CAMPAIGN_ID = 'google.c.a.c_id';
var CONSOLE_CAMPAIGN_NAME = 'google.c.a.c_l';
var CONSOLE_CAMPAIGN_TIME = 'google.c.a.ts';
/** Set to '1' if Analytics is enabled for the campaign */
var CONSOLE_CAMPAIGN_ANALYTICS_ENABLED = 'google.c.a.e';
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
_mergeStrings('hts/frbslgigp.ogepscmv/ieo/eaylg', 'tp:/ieaeogn-agolai.o/1frlglgc/o');
_mergeStrings('AzSCbw63g1R0nCw85jG8', 'Iaya3yLKwmgvh7cF0q4');
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
function registerDefaultSw(messaging) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var _a, e_1;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = messaging;
                    return [4 /*yield*/, navigator.serviceWorker.register(DEFAULT_SW_PATH, {
                            scope: DEFAULT_SW_SCOPE
                        })];
                case 1:
                    _a.swRegistration = _b.sent();
                    // The timing when browser updates sw when sw has an update is unreliable from experiment. It
                    // leads to version conflict when the SDK upgrades to a newer version in the main page, but sw
                    // is stuck with the old version. For example,
                    // https://github.com/firebase/firebase-js-sdk/issues/2590 The following line reliably updates
                    // sw if there was an update.
                    messaging.swRegistration.update().catch(function () {
                        /* it is non blocking and we don't care if it failed */
                    });
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _b.sent();
                    throw ERROR_FACTORY.create("failed-service-worker-registration" /* ErrorCode.FAILED_DEFAULT_REGISTRATION */, {
                        browserErrorMessage: e_1 === null || e_1 === void 0 ? void 0 : e_1.message
                    });
                case 3: return [2 /*return*/];
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
function updateSwReg(messaging, swRegistration) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!swRegistration && !messaging.swRegistration)) return [3 /*break*/, 2];
                    return [4 /*yield*/, registerDefaultSw(messaging)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!swRegistration && !!messaging.swRegistration) {
                        return [2 /*return*/];
                    }
                    if (!(swRegistration instanceof ServiceWorkerRegistration)) {
                        throw ERROR_FACTORY.create("invalid-sw-registration" /* ErrorCode.INVALID_SW_REGISTRATION */);
                    }
                    messaging.swRegistration = swRegistration;
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
function updateVapidKey(messaging, vapidKey) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            if (!!vapidKey) {
                messaging.vapidKey = vapidKey;
            }
            else if (!messaging.vapidKey) {
                messaging.vapidKey = DEFAULT_VAPID_KEY;
            }
            return [2 /*return*/];
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
function getToken$1(messaging, options) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!navigator) {
                        throw ERROR_FACTORY.create("only-available-in-window" /* ErrorCode.AVAILABLE_IN_WINDOW */);
                    }
                    if (!(Notification.permission === 'default')) return [3 /*break*/, 2];
                    return [4 /*yield*/, Notification.requestPermission()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (Notification.permission !== 'granted') {
                        throw ERROR_FACTORY.create("permission-blocked" /* ErrorCode.PERMISSION_BLOCKED */);
                    }
                    return [4 /*yield*/, updateVapidKey(messaging, options === null || options === void 0 ? void 0 : options.vapidKey)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, updateSwReg(messaging, options === null || options === void 0 ? void 0 : options.serviceWorkerRegistration)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, getTokenInternal(messaging)];
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
function logToScion(messaging, messageType, data) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var eventType, analytics;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventType = getEventType(messageType);
                    return [4 /*yield*/, messaging.firebaseDependencies.analyticsProvider.get()];
                case 1:
                    analytics = _a.sent();
                    analytics.logEvent(eventType, {
                        /* eslint-disable camelcase */
                        message_id: data[CONSOLE_CAMPAIGN_ID],
                        message_name: data[CONSOLE_CAMPAIGN_NAME],
                        message_time: data[CONSOLE_CAMPAIGN_TIME],
                        message_device_time: Math.floor(Date.now() / 1000)
                        /* eslint-enable camelcase */
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function getEventType(messageType) {
    switch (messageType) {
        case MessageType.NOTIFICATION_CLICKED:
            return 'notification_open';
        case MessageType.PUSH_RECEIVED:
            return 'notification_foreground';
        default:
            throw new Error();
    }
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
function messageEventListener(messaging, event) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var internalPayload, dataPayload;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    internalPayload = event.data;
                    if (!internalPayload.isFirebaseMessaging) {
                        return [2 /*return*/];
                    }
                    if (messaging.onMessageHandler &&
                        internalPayload.messageType === MessageType.PUSH_RECEIVED) {
                        if (typeof messaging.onMessageHandler === 'function') {
                            messaging.onMessageHandler(externalizePayload(internalPayload));
                        }
                        else {
                            messaging.onMessageHandler.next(externalizePayload(internalPayload));
                        }
                    }
                    dataPayload = internalPayload.data;
                    if (!(isConsoleMessage(dataPayload) &&
                        dataPayload[CONSOLE_CAMPAIGN_ANALYTICS_ENABLED] === '1')) return [3 /*break*/, 2];
                    return [4 /*yield*/, logToScion(messaging, internalPayload.messageType, dataPayload)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}

var name = "@firebase/messaging";
var version = "0.12.5";

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
var WindowMessagingFactory = function (container) {
    var messaging = new MessagingService(container.getProvider('app').getImmediate(), container.getProvider('installations-internal').getImmediate(), container.getProvider('analytics-internal'));
    navigator.serviceWorker.addEventListener('message', function (e) {
        return messageEventListener(messaging, e);
    });
    return messaging;
};
var WindowMessagingInternalFactory = function (container) {
    var messaging = container
        .getProvider('messaging')
        .getImmediate();
    var messagingInternal = {
        getToken: function (options) { return getToken$1(messaging, options); }
    };
    return messagingInternal;
};
function registerMessagingInWindow() {
    app._registerComponent(new component.Component('messaging', WindowMessagingFactory, "PUBLIC" /* ComponentType.PUBLIC */));
    app._registerComponent(new component.Component('messaging-internal', WindowMessagingInternalFactory, "PRIVATE" /* ComponentType.PRIVATE */));
    app.registerVersion(name, version);
    // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
    app.registerVersion(name, version, 'cjs5');
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
 * Checks if all required APIs exist in the browser.
 * @returns a Promise that resolves to a boolean.
 *
 * @public
 */
function isWindowSupported() {
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // This throws if open() is unsupported, so adding it to the conditional
                    // statement below can cause an uncaught error.
                    return [4 /*yield*/, util.validateIndexedDBOpenable()];
                case 1:
                    // This throws if open() is unsupported, so adding it to the conditional
                    // statement below can cause an uncaught error.
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a.sent();
                    return [2 /*return*/, false];
                case 3: 
                // firebase-js-sdk/issues/2393 reveals that idb#open in Safari iframe and Firefox private browsing
                // might be prohibited to run. In these contexts, an error would be thrown during the messaging
                // instantiating phase, informing the developers to import/call isSupported for special handling.
                return [2 /*return*/, (typeof window !== 'undefined' &&
                        util.isIndexedDBAvailable() &&
                        util.areCookiesEnabled() &&
                        'serviceWorker' in navigator &&
                        'PushManager' in window &&
                        'Notification' in window &&
                        'fetch' in window &&
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
function deleteToken$1(messaging) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!navigator) {
                        throw ERROR_FACTORY.create("only-available-in-window" /* ErrorCode.AVAILABLE_IN_WINDOW */);
                    }
                    if (!!messaging.swRegistration) return [3 /*break*/, 2];
                    return [4 /*yield*/, registerDefaultSw(messaging)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, deleteTokenInternal(messaging)];
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
function onMessage$1(messaging, nextOrObserver) {
    if (!navigator) {
        throw ERROR_FACTORY.create("only-available-in-window" /* ErrorCode.AVAILABLE_IN_WINDOW */);
    }
    messaging.onMessageHandler = nextOrObserver;
    return function () {
        messaging.onMessageHandler = null;
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
/**
 * Retrieves a Firebase Cloud Messaging instance.
 *
 * @returns The Firebase Cloud Messaging instance associated with the provided firebase app.
 *
 * @public
 */
function getMessagingInWindow(app$1) {
    if (app$1 === void 0) { app$1 = app.getApp(); }
    // Conscious decision to make this async check non-blocking during the messaging instance
    // initialization phase for performance consideration. An error would be thrown latter for
    // developer's information. Developers can then choose to import and call `isSupported` for
    // special handling.
    isWindowSupported().then(function (isSupported) {
        // If `isWindowSupported()` resolved, but returned false.
        if (!isSupported) {
            throw ERROR_FACTORY.create("unsupported-browser" /* ErrorCode.UNSUPPORTED_BROWSER */);
        }
    }, function (_) {
        // If `isWindowSupported()` rejected.
        throw ERROR_FACTORY.create("indexed-db-unsupported" /* ErrorCode.INDEXED_DB_UNSUPPORTED */);
    });
    return app._getProvider(util.getModularInstance(app$1), 'messaging').getImmediate();
}
/**
 * Subscribes the {@link Messaging} instance to push notifications. Returns a Firebase Cloud
 * Messaging registration token that can be used to send push messages to that {@link Messaging}
 * instance.
 *
 * If notification permission isn't already granted, this method asks the user for permission. The
 * returned promise rejects if the user does not allow the app to show notifications.
 *
 * @param messaging - The {@link Messaging} instance.
 * @param options - Provides an optional vapid key and an optional service worker registration.
 *
 * @returns The promise resolves with an FCM registration token.
 *
 * @public
 */
function getToken(messaging, options) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_a) {
            messaging = util.getModularInstance(messaging);
            return [2 /*return*/, getToken$1(messaging, options)];
        });
    });
}
/**
 * Deletes the registration token associated with this {@link Messaging} instance and unsubscribes
 * the {@link Messaging} instance from the push subscription.
 *
 * @param messaging - The {@link Messaging} instance.
 *
 * @returns The promise resolves when the token has been successfully deleted.
 *
 * @public
 */
function deleteToken(messaging) {
    messaging = util.getModularInstance(messaging);
    return deleteToken$1(messaging);
}
/**
 * When a push message is received and the user is currently on a page for your origin, the
 * message is passed to the page and an `onMessage()` event is dispatched with the payload of
 * the push message.
 *
 *
 * @param messaging - The {@link Messaging} instance.
 * @param nextOrObserver - This function, or observer object with `next` defined,
 *     is called when a message is received and the user is currently viewing your page.
 * @returns To stop listening for messages execute this returned function.
 *
 * @public
 */
function onMessage(messaging, nextOrObserver) {
    messaging = util.getModularInstance(messaging);
    return onMessage$1(messaging, nextOrObserver);
}

/**
 * The Firebase Cloud Messaging Web SDK.
 * This SDK does not work in a Node.js environment.
 *
 * @packageDocumentation
 */
registerMessagingInWindow();

exports.deleteToken = deleteToken;
exports.getMessaging = getMessagingInWindow;
exports.getToken = getToken;
exports.isSupported = isWindowSupported;
exports.onMessage = onMessage;
//# sourceMappingURL=index.cjs.js.map
