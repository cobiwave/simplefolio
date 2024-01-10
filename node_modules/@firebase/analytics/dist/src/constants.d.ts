/**
 * @license
 * Copyright 2019 Google LLC
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
 * Type constant for Firebase Analytics.
 */
export declare const ANALYTICS_TYPE = "analytics";
export declare const GA_FID_KEY = "firebase_id";
export declare const ORIGIN_KEY = "origin";
export declare const FETCH_TIMEOUT_MILLIS: number;
export declare const DYNAMIC_CONFIG_URL = "https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig";
export declare const GTAG_URL = "https://www.googletagmanager.com/gtag/js";
export declare const enum GtagCommand {
    EVENT = "event",
    SET = "set",
    CONFIG = "config",
    CONSENT = "consent",
    GET = "get"
}
