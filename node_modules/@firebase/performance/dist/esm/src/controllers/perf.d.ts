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
import { FirebaseApp } from '@firebase/app';
import { _FirebaseInstallationsInternal } from '@firebase/installations';
import { PerformanceSettings, FirebasePerformance } from '../public_types';
export declare class PerformanceController implements FirebasePerformance {
    readonly app: FirebaseApp;
    readonly installations: _FirebaseInstallationsInternal;
    private initialized;
    constructor(app: FirebaseApp, installations: _FirebaseInstallationsInternal);
    /**
     * This method *must* be called internally as part of creating a
     * PerformanceController instance.
     *
     * Currently it's not possible to pass the settings object through the
     * constructor using Components, so this method exists to be called with the
     * desired settings, to ensure nothing is collected without the user's
     * consent.
     */
    _init(settings?: PerformanceSettings): void;
    set instrumentationEnabled(val: boolean);
    get instrumentationEnabled(): boolean;
    set dataCollectionEnabled(val: boolean);
    get dataCollectionEnabled(): boolean;
}
