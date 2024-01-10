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
export declare const FactorId: {
    /** Phone as second factor */
    readonly PHONE: "phone";
    readonly TOTP: "totp";
};
/**
 * Enumeration of supported providers.
 *
 * @public
 */
export declare const ProviderId: {
    /** Facebook provider ID */
    readonly FACEBOOK: "facebook.com";
    /** GitHub provider ID */
    readonly GITHUB: "github.com";
    /** Google provider ID */
    readonly GOOGLE: "google.com";
    /** Password provider */
    readonly PASSWORD: "password";
    /** Phone provider */
    readonly PHONE: "phone";
    /** Twitter provider ID */
    readonly TWITTER: "twitter.com";
};
/**
 * Enumeration of supported sign-in methods.
 *
 * @public
 */
export declare const SignInMethod: {
    /** Email link sign in method */
    readonly EMAIL_LINK: "emailLink";
    /** Email/password sign in method */
    readonly EMAIL_PASSWORD: "password";
    /** Facebook sign in method */
    readonly FACEBOOK: "facebook.com";
    /** GitHub sign in method */
    readonly GITHUB: "github.com";
    /** Google sign in method */
    readonly GOOGLE: "google.com";
    /** Phone sign in method */
    readonly PHONE: "phone";
    /** Twitter sign in method */
    readonly TWITTER: "twitter.com";
};
/**
 * Enumeration of supported operation types.
 *
 * @public
 */
export declare const OperationType: {
    /** Operation involving linking an additional provider to an already signed-in user. */
    readonly LINK: "link";
    /** Operation involving using a provider to reauthenticate an already signed-in user. */
    readonly REAUTHENTICATE: "reauthenticate";
    /** Operation involving signing in a user. */
    readonly SIGN_IN: "signIn";
};
/**
 * An enumeration of the possible email action types.
 *
 * @public
 */
export declare const ActionCodeOperation: {
    /** The email link sign-in action. */
    readonly EMAIL_SIGNIN: "EMAIL_SIGNIN";
    /** The password reset action. */
    readonly PASSWORD_RESET: "PASSWORD_RESET";
    /** The email revocation action. */
    readonly RECOVER_EMAIL: "RECOVER_EMAIL";
    /** The revert second factor addition email action. */
    readonly REVERT_SECOND_FACTOR_ADDITION: "REVERT_SECOND_FACTOR_ADDITION";
    /** The revert second factor addition email action. */
    readonly VERIFY_AND_CHANGE_EMAIL: "VERIFY_AND_CHANGE_EMAIL";
    /** The email verification action. */
    readonly VERIFY_EMAIL: "VERIFY_EMAIL";
};
