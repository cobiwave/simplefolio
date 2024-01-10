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
import { Auth, User, Persistence } from '@firebase/auth';
import { WebDriver } from 'selenium-webdriver';
export declare const START_FUNCTION = "startAuth";
/** Helper wraper around the WebDriver object */
export declare class AuthDriver {
    webDriver: WebDriver;
    start(browser: string): Promise<void>;
    stop(): Promise<void>;
    call<T>(fn: string, ...args: unknown[]): Promise<T>;
    callNoWait(fn: string, ...args: unknown[]): Promise<void>;
    getAuthSnapshot(): Promise<Auth>;
    getUserSnapshot(): Promise<User>;
    reset(): Promise<void>;
    goToTestPage(): Promise<void>;
    waitForAuthInit(): Promise<void>;
    waitForLegacyAuthInit(): Promise<void>;
    reinitOnRedirect(): Promise<void>;
    pause(ms: number): Promise<void>;
    refresh(): Promise<void>;
    private injectConfig;
    injectConfigAndInitAuth(): Promise<void>;
    injectConfigAndInitLegacySDK(persistence?: Persistence['type']): Promise<void>;
    selectPopupWindow(): Promise<void>;
    selectMainWindow(options?: {
        noWait?: boolean;
    }): Promise<void>;
    closePopup(): Promise<void>;
    closeExtraWindows(): Promise<void>;
    isCompatLayer(): boolean;
}
