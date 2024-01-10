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
import { WebDriver } from 'selenium-webdriver';
export declare class UiPage {
    private readonly driver;
    constructor(driver: WebDriver);
    clickGuestSignIn(): Promise<void>;
    clickGoogleSignIn(): Promise<void>;
    clickPhoneSignIn(): Promise<void>;
    clickEmailSignIn(): Promise<void>;
    clickSubmit(): Promise<void>;
    enterPhoneNumber(phoneNumber: string): Promise<void>;
    waitForCodeInputToBePresent(): Promise<void>;
    enterPhoneCode(code: string): Promise<void>;
    enterEmail(email: string): Promise<void>;
    enterEmailDisplayName(name: string): Promise<void>;
    enterPassword(name: string): Promise<void>;
    private fillInput;
}
