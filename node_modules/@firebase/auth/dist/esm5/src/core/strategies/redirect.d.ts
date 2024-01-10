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
import { AuthInternal } from '../../model/auth';
import { AuthEvent, PopupRedirectResolverInternal } from '../../model/popup_redirect';
import { UserCredentialInternal } from '../../model/user';
import { AbstractPopupRedirectOperation } from './abstract_popup_redirect_operation';
export declare class RedirectAction extends AbstractPopupRedirectOperation {
    eventId: null;
    constructor(auth: AuthInternal, resolver: PopupRedirectResolverInternal, bypassAuthState?: boolean);
    /**
     * Override the execute function; if we already have a redirect result, then
     * just return it.
     */
    execute(): Promise<UserCredentialInternal | null>;
    onAuthEvent(event: AuthEvent): Promise<void>;
    onExecution(): Promise<void>;
    cleanUp(): void;
}
export declare function _getAndClearPendingRedirectStatus(resolver: PopupRedirectResolverInternal, auth: AuthInternal): Promise<boolean>;
export declare function _setPendingRedirectStatus(resolver: PopupRedirectResolverInternal, auth: AuthInternal): Promise<void>;
export declare function _clearRedirectOutcomes(): void;
export declare function _overrideRedirectResult(auth: AuthInternal, result: () => Promise<UserCredentialInternal | null>): void;
