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
export interface CordovaWindow extends Window {
    cordova: {
        plugins: {
            browsertab: {
                isAvailable(cb: (available: boolean) => void): void;
                openUrl(url: string): void;
                close(): void;
            };
        };
        InAppBrowser: {
            open(url: string, target: string, options: string): InAppBrowserRef;
        };
    };
    universalLinks: {
        subscribe(n: null, cb: (event: Record<string, string> | null) => void): void;
    };
    BuildInfo: {
        readonly packageName: string;
        readonly displayName: string;
    };
    handleOpenURL(url: string): void;
}
export interface InAppBrowserRef {
    close?: () => void;
}
export declare function _cordovaWindow(): CordovaWindow;
