'use strict';

var firebase = require('@firebase/app-compat');
var component = require('@firebase/component');
var installations = require('@firebase/installations');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

var name = "@firebase/installations-compat";
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
var InstallationsCompat = /** @class */ (function () {
    function InstallationsCompat(app, _delegate) {
        this.app = app;
        this._delegate = _delegate;
    }
    InstallationsCompat.prototype.getId = function () {
        return installations.getId(this._delegate);
    };
    InstallationsCompat.prototype.getToken = function (forceRefresh) {
        return installations.getToken(this._delegate, forceRefresh);
    };
    InstallationsCompat.prototype.delete = function () {
        return installations.deleteInstallations(this._delegate);
    };
    InstallationsCompat.prototype.onIdChange = function (callback) {
        return installations.onIdChange(this._delegate, callback);
    };
    return InstallationsCompat;
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
function registerInstallations(instance) {
    instance.INTERNAL.registerComponent(new component.Component('installations-compat', function (container) {
        var app = container.getProvider('app-compat').getImmediate();
        var installations = container
            .getProvider('installations')
            .getImmediate();
        return new InstallationsCompat(app, installations);
    }, "PUBLIC" /* ComponentType.PUBLIC */));
    instance.registerVersion(name, version);
}
registerInstallations(firebase__default["default"]);
//# sourceMappingURL=index.cjs.js.map
