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
import { AppCheck } from './public-types';
import { FirebaseApp, _FirebaseService } from '@firebase/app';
import { FirebaseAppCheckInternal } from './types';
import { Provider } from '@firebase/component';
/**
 * AppCheck Service class.
 */
export declare class AppCheckService implements AppCheck, _FirebaseService {
    app: FirebaseApp;
    heartbeatServiceProvider: Provider<'heartbeat'>;
    constructor(app: FirebaseApp, heartbeatServiceProvider: Provider<'heartbeat'>);
    _delete(): Promise<void>;
}
export declare function factory(app: FirebaseApp, heartbeatServiceProvider: Provider<'heartbeat'>): AppCheckService;
export declare function internalFactory(appCheck: AppCheckService): FirebaseAppCheckInternal;
