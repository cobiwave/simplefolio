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
import * as types from '@firebase/auth-types';
declare module '@firebase/component' {
    interface NameServiceMapping {
        'auth-compat': types.FirebaseAuth;
    }
}
declare module '@firebase/app-compat' {
    interface FirebaseNamespace {
        auth: {
            (app?: FirebaseApp): types.FirebaseAuth;
            Auth: typeof types.FirebaseAuth;
            EmailAuthProvider: typeof types.EmailAuthProvider;
            EmailAuthProvider_Instance: typeof types.EmailAuthProvider_Instance;
            FacebookAuthProvider: typeof types.FacebookAuthProvider;
            FacebookAuthProvider_Instance: typeof types.FacebookAuthProvider_Instance;
            GithubAuthProvider: typeof types.GithubAuthProvider;
            GithubAuthProvider_Instance: typeof types.GithubAuthProvider_Instance;
            GoogleAuthProvider: typeof types.GoogleAuthProvider;
            GoogleAuthProvider_Instance: typeof types.GoogleAuthProvider_Instance;
            OAuthProvider: typeof types.OAuthProvider;
            SAMLAuthProvider: typeof types.SAMLAuthProvider;
            PhoneAuthProvider: typeof types.PhoneAuthProvider;
            PhoneAuthProvider_Instance: typeof types.PhoneAuthProvider_Instance;
            PhoneMultiFactorGenerator: typeof types.PhoneMultiFactorGenerator;
            RecaptchaVerifier: typeof types.RecaptchaVerifier;
            RecaptchaVerifier_Instance: typeof types.RecaptchaVerifier_Instance;
            TwitterAuthProvider: typeof types.TwitterAuthProvider;
            TwitterAuthProvider_Instance: typeof types.TwitterAuthProvider_Instance;
        };
    }
    interface FirebaseApp {
        auth?(): types.FirebaseAuth;
    }
}
