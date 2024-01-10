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
import { AppCheckProvider, AppCheckTokenInternal, AppCheckTokenObserver } from './types';
import { Refresher } from './proactive-refresh';
import { Deferred } from '@firebase/util';
import { GreCAPTCHA } from './recaptcha';
export interface AppCheckState {
    activated: boolean;
    tokenObservers: AppCheckTokenObserver[];
    provider?: AppCheckProvider;
    token?: AppCheckTokenInternal;
    cachedTokenPromise?: Promise<AppCheckTokenInternal | undefined>;
    exchangeTokenPromise?: Promise<AppCheckTokenInternal>;
    tokenRefresher?: Refresher;
    reCAPTCHAState?: ReCAPTCHAState;
    isTokenAutoRefreshEnabled?: boolean;
}
export interface ReCAPTCHAState {
    initialized: Deferred<GreCAPTCHA>;
    widgetId?: string;
    succeeded?: boolean;
}
export interface DebugState {
    initialized: boolean;
    enabled: boolean;
    token?: Deferred<string>;
}
export declare const DEFAULT_STATE: AppCheckState;
/**
 * Gets a reference to the state object.
 */
export declare function getStateReference(app: FirebaseApp): AppCheckState;
/**
 * Set once on initialization. The map should hold the same reference to the
 * same object until this entry is deleted.
 */
export declare function setInitialState(app: FirebaseApp, state: AppCheckState): AppCheckState;
export declare function clearState(): void;
export declare function getDebugState(): DebugState;
