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
import { ControlParams, EventParams, CustomParams, ConsentSettings } from './public-types';
/**
 * Encapsulates metadata concerning throttled fetch requests.
 */
export interface ThrottleMetadata {
    backoffCount: number;
    throttleEndTimeMillis: number;
}
/**
 * Dynamic configuration fetched from server.
 * See https://firebase.google.com/docs/reference/firebase-management/rest/v1beta1/projects.webApps/getConfig
 */
export interface DynamicConfig {
    projectId: string;
    appId: string;
    databaseURL: string;
    storageBucket: string;
    locationId: string;
    apiKey: string;
    authDomain: string;
    messagingSenderId: string;
    measurementId: string;
}
export interface MinimalDynamicConfig {
    appId: string;
    measurementId: string;
}
/**
 * Standard `gtag` function provided by gtag.js.
 */
export interface Gtag {
    (command: 'config', targetId: string, config?: ControlParams | EventParams | CustomParams): void;
    (command: 'set', config: CustomParams): void;
    (command: 'event', eventName: string, eventParams?: ControlParams | EventParams | CustomParams): void;
    (command: 'consent', subCommand: 'default' | 'update', consentSettings: ConsentSettings): void;
    (command: 'get', measurementId: string, fieldName: string, callback: (...args: unknown[]) => void): void;
    (command: string, ...args: unknown[]): void;
}
export declare type DataLayer = IArguments[];
