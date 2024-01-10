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
import { AuthProvider } from '../../model/public_types';
import { AuthInternal } from '../../model/auth';
import { AuthEvent } from '../../model/popup_redirect';
import { InAppBrowserRef } from '../plugins';
/**
 * Generates the URL for the OAuth handler.
 */
export declare function _generateHandlerUrl(auth: AuthInternal, event: AuthEvent, provider: AuthProvider): Promise<string>;
/**
 * Validates that this app is valid for this project configuration
 */
export declare function _validateOrigin(auth: AuthInternal): Promise<void>;
export declare function _performRedirect(handlerUrl: string): Promise<InAppBrowserRef | null>;
interface PassiveAuthEventListener {
    addPassiveListener(cb: () => void): void;
    removePassiveListener(cb: () => void): void;
}
/**
 * This function waits for app activity to be seen before resolving. It does
 * this by attaching listeners to various dom events. Once the app is determined
 * to be visible, this promise resolves. AFTER that resolution, the listeners
 * are detached and any browser tabs left open will be closed.
 */
export declare function _waitForAppResume(auth: AuthInternal, eventListener: PassiveAuthEventListener, iabRef: InAppBrowserRef | null): Promise<void>;
/**
 * Checks the configuration of the Cordova environment. This has no side effect
 * if the configuration is correct; otherwise it throws an error with the
 * missing plugin.
 */
export declare function _checkCordovaConfiguration(auth: AuthInternal): void;
export {};
