/**
 * @license
 * Copyright 2017 Google LLC
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
import { Auth } from '../src/model/public_types';
/**
 * This interface is intended only for use by @firebase/auth-compat, do not use directly
 */
export * from '../index';
export { SignInWithIdpResponse } from '../src/api/authentication/idp';
export { AuthErrorCode } from '../src/core/errors';
export { PersistenceInternal } from '../src/core/persistence';
export { _persistenceKeyName } from '../src/core/persistence/persistence_user_manager';
export { UserImpl } from '../src/core/user/user_impl';
export { _getInstance } from '../src/core/util/instantiator';
export { PopupRedirectResolverInternal, EventManager, AuthEventType } from '../src/model/popup_redirect';
export { UserCredentialInternal, UserParameters } from '../src/model/user';
export { AuthInternal, ConfigInternal } from '../src/model/auth';
export { DefaultConfig, AuthImpl, _castAuth } from '../src/core/auth/auth_impl';
export { ClientPlatform, _getClientVersion } from '../src/core/util/version';
export { _generateEventId } from '../src/core/util/event_id';
export { TaggedWithTokenResponse } from '../src/model/id_token';
export { _fail, _assert } from '../src/core/util/assert';
export { AuthPopup } from '../src/platform_browser/util/popup';
export { _getRedirectResult } from '../src/platform_browser/strategies/redirect';
export { _overrideRedirectResult } from '../src/core/strategies/redirect';
export { cordovaPopupRedirectResolver } from '../src/platform_cordova/popup_redirect/popup_redirect';
export { FetchProvider } from '../src/core/util/fetch_provider';
export { SAMLAuthCredential } from '../src/core/credentials/saml';
export declare function addFrameworkForLogging(auth: Auth, framework: string): void;
