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
import { AuthEvent, AuthEventConsumer, EventManager } from '../../model/popup_redirect';
import { AuthInternal } from '../../model/auth';
export declare class AuthEventManager implements EventManager {
    private readonly auth;
    private readonly cachedEventUids;
    private readonly consumers;
    protected queuedRedirectEvent: AuthEvent | null;
    protected hasHandledPotentialRedirect: boolean;
    private lastProcessedEventTime;
    constructor(auth: AuthInternal);
    registerConsumer(authEventConsumer: AuthEventConsumer): void;
    unregisterConsumer(authEventConsumer: AuthEventConsumer): void;
    onEvent(event: AuthEvent): boolean;
    private sendToConsumer;
    private isEventForConsumer;
    private hasEventBeenHandled;
    private saveEventToCache;
}
