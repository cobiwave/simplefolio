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
import * as exp from '@firebase/auth/internal';
/** Platform-agnostic popup-redirect resolver */
export declare class CompatPopupRedirectResolver implements exp.PopupRedirectResolverInternal {
    private readonly browserResolver;
    private readonly cordovaResolver;
    private underlyingResolver;
    _redirectPersistence: exp.Persistence;
    _completeRedirectFn: (auth: exp.Auth, resolver: exp.PopupRedirectResolver, bypassAuthState: boolean) => Promise<exp.UserCredential | null>;
    _overrideRedirectResult: typeof exp._overrideRedirectResult;
    _initialize(auth: exp.AuthImpl): Promise<exp.EventManager>;
    _openPopup(auth: exp.AuthImpl, provider: exp.AuthProvider, authType: exp.AuthEventType, eventId?: string): Promise<exp.AuthPopup>;
    _openRedirect(auth: exp.AuthImpl, provider: exp.AuthProvider, authType: exp.AuthEventType, eventId?: string): Promise<void>;
    _isIframeWebStorageSupported(auth: exp.AuthImpl, cb: (support: boolean) => unknown): void;
    _originValidation(auth: exp.Auth): Promise<void>;
    get _shouldInitProactively(): boolean;
    private get assertedUnderlyingResolver();
    private selectUnderlyingResolver;
}
