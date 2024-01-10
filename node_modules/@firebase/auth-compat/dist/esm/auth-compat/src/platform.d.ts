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
declare global {
    interface Document {
        documentMode?: number;
    }
}
/**
 * @param {?string=} ua The user agent.
 * @return {boolean} Whether the app is rendered in a mobile iOS or Android
 *     Cordova environment.
 */
export declare function _isAndroidOrIosCordovaScheme(ua?: string): boolean;
/** @return {boolean} Whether web storage is supported. */
export declare function _isWebStorageSupported(): boolean;
/**
 * @param {?Object=} global The optional global scope.
 * @return {boolean} Whether current environment is a worker.
 */
export declare function _isWorker(): boolean;
export declare function _isPopupRedirectSupported(): boolean;
/** Quick check that indicates the platform *may* be Cordova */
export declare function _isLikelyCordova(): boolean;
export declare function _isCordova(): Promise<boolean>;
export declare function _getSelfWindow(): Window | null;
