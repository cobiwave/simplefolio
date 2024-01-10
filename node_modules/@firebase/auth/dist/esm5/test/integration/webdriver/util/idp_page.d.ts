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
import { WebDriver } from 'selenium-webdriver';
export declare class IdPPage {
    private readonly driver;
    static PAGE_TITLE: string;
    constructor(driver: WebDriver);
    pageLoad(): Promise<void>;
    clickAddAccount(): Promise<void>;
    clickSignIn(): Promise<void>;
    selectExistingAccountByEmail(email: string): Promise<void>;
    fillEmail(email: string): Promise<void>;
    fillDisplayName(displayName: string): Promise<void>;
    fillScreenName(screenName: string): Promise<void>;
    fillProfilePhoto(prophilePhoto: string): Promise<void>;
    private fillInput;
}
