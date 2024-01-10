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
import { FirebaseApp, FirebaseOptions, FirebaseAppSettings } from './public-types';
import { ComponentContainer } from '@firebase/component';
export declare class FirebaseAppImpl implements FirebaseApp {
    private readonly _options;
    private readonly _name;
    /**
     * Original config values passed in as a constructor parameter.
     * It is only used to compare with another config object to support idempotent initializeApp().
     *
     * Updating automaticDataCollectionEnabled on the App instance will not change its value in _config.
     */
    private readonly _config;
    private _automaticDataCollectionEnabled;
    private _isDeleted;
    private readonly _container;
    constructor(options: FirebaseOptions, config: Required<FirebaseAppSettings>, container: ComponentContainer);
    get automaticDataCollectionEnabled(): boolean;
    set automaticDataCollectionEnabled(val: boolean);
    get name(): string;
    get options(): FirebaseOptions;
    get config(): Required<FirebaseAppSettings>;
    get container(): ComponentContainer;
    get isDeleted(): boolean;
    set isDeleted(val: boolean);
    /**
     * This function will throw an Error if the App has already been deleted -
     * use before performing API actions on the App.
     */
    private checkDestroyed;
}
