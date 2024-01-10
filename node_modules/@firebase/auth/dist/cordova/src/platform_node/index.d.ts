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
import { FirebaseApp } from '@firebase/app';
import { Auth } from '../model/public_types';
export declare function getAuth(app?: FirebaseApp): Auth;
/** Reject with auth/operation-not-supported-in-this-environment */
declare function fail(): Promise<void>;
/**
 * A class which will throw with
 * auth/operation-not-supported-in-this-environment if instantiated
 */
declare class FailClass {
    constructor();
}
export declare const browserLocalPersistence: import("../model/public_types").Persistence;
export declare const browserSessionPersistence: import("../model/public_types").Persistence;
export declare const indexedDBLocalPersistence: import("../model/public_types").Persistence;
export declare const browserPopupRedirectResolver: import("@firebase/app").FirebaseError;
export declare const PhoneAuthProvider: typeof FailClass;
export declare const signInWithPhoneNumber: typeof fail;
export declare const linkWithPhoneNumber: typeof fail;
export declare const reauthenticateWithPhoneNumber: typeof fail;
export declare const updatePhoneNumber: typeof fail;
export declare const signInWithPopup: typeof fail;
export declare const linkWithPopup: typeof fail;
export declare const reauthenticateWithPopup: typeof fail;
export declare const signInWithRedirect: typeof fail;
export declare const linkWithRedirect: typeof fail;
export declare const reauthenticateWithRedirect: typeof fail;
export declare const getRedirectResult: typeof fail;
export declare const RecaptchaVerifier: typeof FailClass;
export declare const initializeRecaptchaConfig: typeof fail;
export declare class PhoneMultiFactorGenerator {
    static assertion(): unknown;
}
export {};
