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
import { Auth, AuthProvider, Persistence, PopupRedirectResolver, UserCredential } from './public_types';
import { FirebaseError } from '@firebase/util';
import { AuthPopup } from '../platform_browser/util/popup';
import { AuthInternal } from './auth';
import { UserCredentialInternal } from './user';
export declare const enum EventFilter {
    POPUP = 0,
    REDIRECT = 1
}
export declare const enum GapiOutcome {
    ACK = "ACK",
    ERROR = "ERROR"
}
export interface GapiAuthEvent extends gapi.iframes.Message {
    authEvent: AuthEvent;
}
/**
 * @internal
 */
export declare const enum AuthEventType {
    LINK_VIA_POPUP = "linkViaPopup",
    LINK_VIA_REDIRECT = "linkViaRedirect",
    REAUTH_VIA_POPUP = "reauthViaPopup",
    REAUTH_VIA_REDIRECT = "reauthViaRedirect",
    SIGN_IN_VIA_POPUP = "signInViaPopup",
    SIGN_IN_VIA_REDIRECT = "signInViaRedirect",
    UNKNOWN = "unknown",
    VERIFY_APP = "verifyApp"
}
export interface AuthEventError extends Error {
    code: string;
    message: string;
}
/**
 * @internal
 */
export interface AuthEvent {
    type: AuthEventType;
    eventId: string | null;
    urlResponse: string | null;
    sessionId: string | null;
    postBody: string | null;
    tenantId: string | null;
    error?: AuthEventError;
}
/**
 * @internal
 */
export interface AuthEventConsumer {
    readonly filter: AuthEventType[];
    eventId: string | null;
    onAuthEvent(event: AuthEvent): unknown;
    onError(error: FirebaseError): unknown;
}
/**
 * @internal
 */
export interface EventManager {
    registerConsumer(authEventConsumer: AuthEventConsumer): void;
    unregisterConsumer(authEventConsumer: AuthEventConsumer): void;
}
/**
 * We need to mark this interface as internal explicitly to exclude it in the public typings, because
 * it references AuthInternal which has a circular dependency with UserInternal.
 *
 * @internal
 */
export interface PopupRedirectResolverInternal extends PopupRedirectResolver {
    _shouldInitProactively: boolean;
    _initialize(auth: AuthInternal): Promise<EventManager>;
    _openPopup(auth: AuthInternal, provider: AuthProvider, authType: AuthEventType, eventId?: string): Promise<AuthPopup>;
    _openRedirect(auth: AuthInternal, provider: AuthProvider, authType: AuthEventType, eventId?: string): Promise<void | never>;
    _isIframeWebStorageSupported(auth: AuthInternal, cb: (support: boolean) => unknown): void;
    _redirectPersistence: Persistence;
    _originValidation(auth: Auth): Promise<void>;
    _completeRedirectFn: (auth: Auth, resolver: PopupRedirectResolver, bypassAuthState: boolean) => Promise<UserCredential | null>;
    _overrideRedirectResult: (auth: AuthInternal, resultGetter: () => Promise<UserCredentialInternal | null>) => void;
}
