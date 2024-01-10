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
import { AuthEventManager } from '../../core/auth/auth_event_manager';
import { AuthInternal } from '../../model/auth';
import { AuthEvent, AuthEventType } from '../../model/popup_redirect';
/** Custom AuthEventManager that adds passive listeners to events */
export declare class CordovaAuthEventManager extends AuthEventManager {
    private readonly passiveListeners;
    private resolveInialized;
    private initPromise;
    addPassiveListener(cb: (e: AuthEvent) => void): void;
    removePassiveListener(cb: (e: AuthEvent) => void): void;
    resetRedirect(): void;
    /** Override the onEvent method */
    onEvent(event: AuthEvent): boolean;
    initialized(): Promise<void>;
}
/**
 * Generates a (partial) {@link AuthEvent}.
 */
export declare function _generateNewEvent(auth: AuthInternal, type: AuthEventType, eventId?: string | null): AuthEvent;
export declare function _savePartialEvent(auth: AuthInternal, event: AuthEvent): Promise<void>;
export declare function _getAndRemoveEvent(auth: AuthInternal): Promise<AuthEvent | null>;
export declare function _eventFromPartialAndUrl(partialEvent: AuthEvent, url: string): AuthEvent | null;
export declare function _getDeepLinkFromCallback(url: string): string;
