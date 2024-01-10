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
import { FirebaseAnalyticsInternalName } from '@firebase/analytics-interop-types';
import { FirebaseInternalDependencies } from '../../interfaces/internal-dependencies';
import { FirebaseOptions } from '@firebase/app';
import { Provider } from '@firebase/component';
import { _FirebaseInstallationsInternal } from '@firebase/installations';
export declare function getFakeFirebaseDependencies(options?: FirebaseOptions): FirebaseInternalDependencies;
export declare function getFakeApp(options?: FirebaseOptions): any;
export declare function getFakeInstallations(): _FirebaseInstallationsInternal;
export declare function getFakeAnalyticsProvider(): Provider<FirebaseAnalyticsInternalName>;
