import firebase from '@firebase/app-compat';
import { Component } from '@firebase/component';
import { activate, ensureInitialized, fetchConfig, fetchAndActivate, getAll, getBoolean, getNumber, getString, getValue, setLogLevel, isSupported } from '@firebase/remote-config';

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
var RemoteConfigCompatImpl = /** @class */ (function () {
    function RemoteConfigCompatImpl(app, _delegate) {
        this.app = app;
        this._delegate = _delegate;
    }
    Object.defineProperty(RemoteConfigCompatImpl.prototype, "defaultConfig", {
        get: function () {
            return this._delegate.defaultConfig;
        },
        set: function (value) {
            this._delegate.defaultConfig = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RemoteConfigCompatImpl.prototype, "fetchTimeMillis", {
        get: function () {
            return this._delegate.fetchTimeMillis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RemoteConfigCompatImpl.prototype, "lastFetchStatus", {
        get: function () {
            return this._delegate.lastFetchStatus;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RemoteConfigCompatImpl.prototype, "settings", {
        get: function () {
            return this._delegate.settings;
        },
        set: function (value) {
            this._delegate.settings = value;
        },
        enumerable: false,
        configurable: true
    });
    RemoteConfigCompatImpl.prototype.activate = function () {
        return activate(this._delegate);
    };
    RemoteConfigCompatImpl.prototype.ensureInitialized = function () {
        return ensureInitialized(this._delegate);
    };
    /**
     * @throws a {@link ErrorCode.FETCH_CLIENT_TIMEOUT} if the request takes longer than
     * {@link Settings.fetchTimeoutInSeconds} or
     * {@link DEFAULT_FETCH_TIMEOUT_SECONDS}.
     */
    RemoteConfigCompatImpl.prototype.fetch = function () {
        return fetchConfig(this._delegate);
    };
    RemoteConfigCompatImpl.prototype.fetchAndActivate = function () {
        return fetchAndActivate(this._delegate);
    };
    RemoteConfigCompatImpl.prototype.getAll = function () {
        return getAll(this._delegate);
    };
    RemoteConfigCompatImpl.prototype.getBoolean = function (key) {
        return getBoolean(this._delegate, key);
    };
    RemoteConfigCompatImpl.prototype.getNumber = function (key) {
        return getNumber(this._delegate, key);
    };
    RemoteConfigCompatImpl.prototype.getString = function (key) {
        return getString(this._delegate, key);
    };
    RemoteConfigCompatImpl.prototype.getValue = function (key) {
        return getValue(this._delegate, key);
    };
    // Based on packages/firestore/src/util/log.ts but not static because we need per-instance levels
    // to differentiate 2p and 3p use-cases.
    RemoteConfigCompatImpl.prototype.setLogLevel = function (logLevel) {
        setLogLevel(this._delegate, logLevel);
    };
    return RemoteConfigCompatImpl;
}());

var name = "@firebase/remote-config-compat";
var version = "0.2.4";

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
function registerRemoteConfigCompat(firebaseInstance) {
    firebaseInstance.INTERNAL.registerComponent(new Component('remoteConfig-compat', remoteConfigFactory, "PUBLIC" /* ComponentType.PUBLIC */)
        .setMultipleInstances(true)
        .setServiceProps({ isSupported: isSupported }));
    firebaseInstance.registerVersion(name, version);
}
function remoteConfigFactory(container, _a) {
    var namespace = _a.instanceIdentifier;
    var app = container.getProvider('app-compat').getImmediate();
    // The following call will always succeed because rc `import {...} from '@firebase/remote-config'`
    var remoteConfig = container.getProvider('remote-config').getImmediate({
        identifier: namespace
    });
    return new RemoteConfigCompatImpl(app, remoteConfig);
}
registerRemoteConfigCompat(firebase);
//# sourceMappingURL=index.esm5.js.map
