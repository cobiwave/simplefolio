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
import { AppCheckProvider, AppCheckTokenResult, FirebaseAppCheck } from '@firebase/app-check-types';
import { _FirebaseService, FirebaseApp } from '@firebase/app-compat';
import { AppCheck as AppCheckServiceExp } from '@firebase/app-check';
import { PartialObserver, Unsubscribe } from '@firebase/util';
export declare class AppCheckService implements FirebaseAppCheck, Omit<_FirebaseService, '_delegate'> {
    app: FirebaseApp;
    _delegate?: AppCheckServiceExp;
    constructor(app: FirebaseApp);
    activate(siteKeyOrProvider: string | AppCheckProvider, isTokenAutoRefreshEnabled?: boolean): void;
    setTokenAutoRefreshEnabled(isTokenAutoRefreshEnabled: boolean): void;
    getToken(forceRefresh?: boolean): Promise<AppCheckTokenResult>;
    onTokenChanged(onNextOrObserver: PartialObserver<AppCheckTokenResult> | ((tokenResult: AppCheckTokenResult) => void), onError?: (error: Error) => void, onCompletion?: () => void): Unsubscribe;
}
