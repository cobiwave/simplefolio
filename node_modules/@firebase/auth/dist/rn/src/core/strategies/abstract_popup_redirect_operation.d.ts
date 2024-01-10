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
import { FirebaseError } from '@firebase/util';
import { AuthEvent, AuthEventConsumer, AuthEventType, PopupRedirectResolverInternal } from '../../model/popup_redirect';
import { UserInternal, UserCredentialInternal } from '../../model/user';
import { AuthInternal } from '../../model/auth';
/**
 * Popup event manager. Handles the popup's entire lifecycle; listens to auth
 * events
 */
export declare abstract class AbstractPopupRedirectOperation implements AuthEventConsumer {
    protected readonly auth: AuthInternal;
    protected readonly resolver: PopupRedirectResolverInternal;
    protected user?: UserInternal | undefined;
    protected readonly bypassAuthState: boolean;
    private pendingPromise;
    private eventManager;
    readonly filter: AuthEventType[];
    abstract eventId: string | null;
    constructor(auth: AuthInternal, filter: AuthEventType | AuthEventType[], resolver: PopupRedirectResolverInternal, user?: UserInternal | undefined, bypassAuthState?: boolean);
    abstract onExecution(): Promise<void>;
    execute(): Promise<UserCredentialInternal | null>;
    onAuthEvent(event: AuthEvent): Promise<void>;
    onError(error: FirebaseError): void;
    private getIdpTask;
    protected resolve(cred: UserCredentialInternal | null): void;
    protected reject(error: Error): void;
    private unregisterAndCleanUp;
    abstract cleanUp(): void;
}
