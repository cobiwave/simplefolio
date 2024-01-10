import firebase from '@firebase/app-compat';
import { httpsCallable, httpsCallableFromURL, connectFunctionsEmulator } from '@firebase/functions';
import { FirebaseError } from '@firebase/util';
import { Component } from '@firebase/component';

var name = "@firebase/functions-compat";
var version = "0.3.6";

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
var FunctionsService = /** @class */ (function () {
    function FunctionsService(app, _delegate) {
        this.app = app;
        this._delegate = _delegate;
        this._region = this._delegate.region;
        this._customDomain = this._delegate.customDomain;
    }
    FunctionsService.prototype.httpsCallable = function (name, options) {
        return httpsCallable(this._delegate, name, options);
    };
    FunctionsService.prototype.httpsCallableFromURL = function (url, options) {
        return httpsCallableFromURL(this._delegate, url, options);
    };
    /**
     * Deprecated in pre-modularized repo, does not exist in modularized
     * functions package, need to convert to "host" and "port" args that
     * `useFunctionsEmulatorExp` takes.
     * @deprecated
     */
    FunctionsService.prototype.useFunctionsEmulator = function (origin) {
        var match = origin.match('[a-zA-Z]+://([a-zA-Z0-9.-]+)(?::([0-9]+))?');
        if (match == null) {
            throw new FirebaseError('functions', 'No origin provided to useFunctionsEmulator()');
        }
        if (match[2] == null) {
            throw new FirebaseError('functions', 'Port missing in origin provided to useFunctionsEmulator()');
        }
        return connectFunctionsEmulator(this._delegate, match[1], Number(match[2]));
    };
    FunctionsService.prototype.useEmulator = function (host, port) {
        return connectFunctionsEmulator(this._delegate, host, port);
    };
    return FunctionsService;
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
var DEFAULT_REGION = 'us-central1';
var factory = function (container, _a) {
    var regionOrCustomDomain = _a.instanceIdentifier;
    // Dependencies
    var app = container.getProvider('app-compat').getImmediate();
    var functionsServiceExp = container.getProvider('functions').getImmediate({
        identifier: regionOrCustomDomain !== null && regionOrCustomDomain !== void 0 ? regionOrCustomDomain : DEFAULT_REGION
    });
    return new FunctionsService(app, functionsServiceExp);
};
function registerFunctions() {
    var namespaceExports = {
        Functions: FunctionsService
    };
    firebase.INTERNAL.registerComponent(new Component('functions-compat', factory, "PUBLIC" /* ComponentType.PUBLIC */)
        .setServiceProps(namespaceExports)
        .setMultipleInstances(true));
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
registerFunctions();
firebase.registerVersion(name, version);
//# sourceMappingURL=index.esm5.js.map
