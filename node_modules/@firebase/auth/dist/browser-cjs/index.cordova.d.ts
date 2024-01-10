/**
 * @license
 * Copyright 2021 Google LLC
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
/**
 * This is the file that people using Cordova will actually import. You
 * should only include this file if you have something specific about your
 * implementation that mandates having a separate entrypoint. Otherwise you can
 * just use index.ts
 */
import { FirebaseApp } from '@firebase/app';
import { Auth } from './src/model/public_types';
export * from './index.shared';
export { indexedDBLocalPersistence } from './src/platform_browser/persistence/indexed_db';
export { browserLocalPersistence } from './src/platform_browser/persistence/local_storage';
export { browserSessionPersistence } from './src/platform_browser/persistence/session_storage';
export { getRedirectResult } from './src/platform_browser/strategies/redirect';
export { cordovaPopupRedirectResolver } from './src/platform_cordova/popup_redirect/popup_redirect';
export { signInWithRedirect, reauthenticateWithRedirect, linkWithRedirect } from './src/platform_cordova/strategies/redirect';
export declare function getAuth(app?: FirebaseApp): Auth;
