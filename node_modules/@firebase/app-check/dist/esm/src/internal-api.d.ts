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
import { AppCheckTokenResult, AppCheckTokenInternal, ListenerType } from './types';
import { AppCheckTokenListener } from './public-types';
import { AppCheckService } from './factory';
export declare const defaultTokenErrorData: {
    error: string;
};
/**
 * Stringify and base64 encode token error data.
 *
 * @param tokenError Error data, currently hardcoded.
 */
export declare function formatDummyToken(tokenErrorData: Record<string, string>): string;
/**
 * This function always resolves.
 * The result will contain an error field if there is any error.
 * In case there is an error, the token field in the result will be populated with a dummy value
 */
export declare function getToken(appCheck: AppCheckService, forceRefresh?: boolean): Promise<AppCheckTokenResult>;
/**
 * Internal API for limited use tokens. Skips all FAC state and simply calls
 * the underlying provider.
 */
export declare function getLimitedUseToken(appCheck: AppCheckService): Promise<AppCheckTokenResult>;
export declare function addTokenListener(appCheck: AppCheckService, type: ListenerType, listener: AppCheckTokenListener, onError?: (error: Error) => void): void;
export declare function removeTokenListener(app: FirebaseApp, listener: AppCheckTokenListener): void;
export declare function notifyTokenListeners(app: FirebaseApp, token: AppCheckTokenResult): void;
export declare function isValid(token: AppCheckTokenInternal): boolean;
