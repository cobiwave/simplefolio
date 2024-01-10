import firebase from '@firebase/app-compat';
import { Component } from '@firebase/component';
import { ReCaptchaV3Provider, ReCaptchaEnterpriseProvider, CustomProvider, initializeAppCheck, setTokenAutoRefreshEnabled, getToken, onTokenChanged } from '@firebase/app-check';
import { ErrorFactory } from '@firebase/util';

const name = "@firebase/app-check-compat";
const version = "0.3.8";

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
const ERRORS = {
    ["use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */]: 'App Check is being used before activate() is called for FirebaseApp {$appName}. ' +
        'Call activate() before instantiating other Firebase services.'
};
const ERROR_FACTORY = new ErrorFactory('appCheck', 'AppCheck', ERRORS);

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
class AppCheckService {
    constructor(app) {
        this.app = app;
    }
    activate(siteKeyOrProvider, isTokenAutoRefreshEnabled) {
        let provider;
        if (typeof siteKeyOrProvider === 'string') {
            provider = new ReCaptchaV3Provider(siteKeyOrProvider);
        }
        else if (siteKeyOrProvider instanceof ReCaptchaEnterpriseProvider ||
            siteKeyOrProvider instanceof ReCaptchaV3Provider ||
            siteKeyOrProvider instanceof CustomProvider) {
            provider = siteKeyOrProvider;
        }
        else {
            provider = new CustomProvider({ getToken: siteKeyOrProvider.getToken });
        }
        this._delegate = initializeAppCheck(this.app, {
            provider,
            isTokenAutoRefreshEnabled
        });
    }
    setTokenAutoRefreshEnabled(isTokenAutoRefreshEnabled) {
        if (!this._delegate) {
            throw ERROR_FACTORY.create("use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */, {
                appName: this.app.name
            });
        }
        setTokenAutoRefreshEnabled(this._delegate, isTokenAutoRefreshEnabled);
    }
    getToken(forceRefresh) {
        if (!this._delegate) {
            throw ERROR_FACTORY.create("use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */, {
                appName: this.app.name
            });
        }
        return getToken(this._delegate, forceRefresh);
    }
    onTokenChanged(onNextOrObserver, onError, onCompletion) {
        if (!this._delegate) {
            throw ERROR_FACTORY.create("use-before-activation" /* AppCheckError.USE_BEFORE_ACTIVATION */, {
                appName: this.app.name
            });
        }
        return onTokenChanged(this._delegate, 
        /**
         * Exp onTokenChanged() will handle both overloads but we need
         * to specify one to not confuse Typescript.
         */
        onNextOrObserver, onError, onCompletion);
    }
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
const factory = (container) => {
    // Dependencies
    const app = container.getProvider('app-compat').getImmediate();
    return new AppCheckService(app);
};
function registerAppCheck() {
    firebase.INTERNAL.registerComponent(new Component('appCheck-compat', factory, "PUBLIC" /* ComponentType.PUBLIC */).setServiceProps({
        ReCaptchaEnterpriseProvider,
        ReCaptchaV3Provider,
        CustomProvider
    }));
}
registerAppCheck();
firebase.registerVersion(name, version);

export { registerAppCheck };
//# sourceMappingURL=index.esm2017.js.map
