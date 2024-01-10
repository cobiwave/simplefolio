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
 * Enumeration of supported providers.
 * @internal
 */
export declare const enum ProviderId {
    /** @internal */
    ANONYMOUS = "anonymous",
    /** @internal */
    CUSTOM = "custom",
    /** Facebook provider ID */
    FACEBOOK = "facebook.com",
    /** @internal */
    FIREBASE = "firebase",
    /** GitHub provider ID */
    GITHUB = "github.com",
    /** Google provider ID */
    GOOGLE = "google.com",
    /** Password provider */
    PASSWORD = "password",
    /** Phone provider */
    PHONE = "phone",
    /** Twitter provider ID */
    TWITTER = "twitter.com"
}
/**
 * Enumeration of supported sign-in methods.
 * @internal
 */
export declare const enum SignInMethod {
    /** @internal */
    ANONYMOUS = "anonymous",
    /** Email link sign in method */
    EMAIL_LINK = "emailLink",
    /** Email/password sign in method */
    EMAIL_PASSWORD = "password",
    /** Facebook sign in method */
    FACEBOOK = "facebook.com",
    /** GitHub sign in method */
    GITHUB = "github.com",
    /** Google sign in method */
    GOOGLE = "google.com",
    /** Phone sign in method */
    PHONE = "phone",
    /** Twitter sign in method */
    TWITTER = "twitter.com"
}
/**
 * Enumeration of supported operation types.
 * @internal
 */
export declare const enum OperationType {
    /** Operation involving linking an additional provider to an already signed-in user. */
    LINK = "link",
    /** Operation involving using a provider to reauthenticate an already signed-in user. */
    REAUTHENTICATE = "reauthenticate",
    /** Operation involving signing in a user. */
    SIGN_IN = "signIn"
}
