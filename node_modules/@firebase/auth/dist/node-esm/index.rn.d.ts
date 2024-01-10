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
/**
 * This is the file that people using React Native will actually import. You
 * should only include this file if you have something specific about your
 * implementation that mandates having a separate entrypoint. Otherwise you can
 * just use index.ts
 */
import { FirebaseApp } from '@firebase/app';
import { Auth, Dependencies } from './src/model/public_types';
export * from './index.shared';
export { PhoneAuthProvider } from './src/platform_browser/providers/phone';
export { signInWithPhoneNumber, linkWithPhoneNumber, reauthenticateWithPhoneNumber, updatePhoneNumber } from './src/platform_browser/strategies/phone';
export { PhoneMultiFactorGenerator } from './src/platform_browser/mfa/assertions/phone';
export { TotpMultiFactorGenerator, TotpSecret } from './src/mfa/assertions/totp';
export { getReactNativePersistence } from './src/platform_react_native/persistence/react_native';
export declare function getAuth(app?: FirebaseApp): Auth;
/**
 * Wrapper around base `initializeAuth()` for RN users only, which
 * shows the warning message if no persistence is provided.
 * Double-checked potential collision with `export * from './index.shared'`
 * as `./index.shared` also exports `initializeAuth()`, and the final
 * bundle does correctly export only this `initializeAuth()` function
 * and not the one from index.shared.
 */
export declare function initializeAuth(app: FirebaseApp, deps?: Dependencies): Auth;
