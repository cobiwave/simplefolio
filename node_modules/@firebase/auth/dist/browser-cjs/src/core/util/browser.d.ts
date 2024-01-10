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
 * Enums for Browser name.
 */
export declare const enum BrowserName {
    ANDROID = "Android",
    BLACKBERRY = "Blackberry",
    EDGE = "Edge",
    FIREFOX = "Firefox",
    IE = "IE",
    IEMOBILE = "IEMobile",
    OPERA = "Opera",
    OTHER = "Other",
    CHROME = "Chrome",
    SAFARI = "Safari",
    SILK = "Silk",
    WEBOS = "Webos"
}
/**
 * Determine the browser for the purposes of reporting usage to the API
 */
export declare function _getBrowserName(userAgent: string): BrowserName | string;
export declare function _isFirefox(ua?: string): boolean;
export declare function _isSafari(userAgent?: string): boolean;
export declare function _isChromeIOS(ua?: string): boolean;
export declare function _isIEMobile(ua?: string): boolean;
export declare function _isAndroid(ua?: string): boolean;
export declare function _isBlackBerry(ua?: string): boolean;
export declare function _isWebOS(ua?: string): boolean;
export declare function _isIOS(ua?: string): boolean;
export declare function _isIOS7Or8(ua?: string): boolean;
export declare function _isIOSStandalone(ua?: string): boolean;
export declare function _isIE10(): boolean;
export declare function _isMobileBrowser(ua?: string): boolean;
export declare function _isIframe(): boolean;
