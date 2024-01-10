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
import { _FirebaseInstallationsInternal } from '@firebase/installations';
export declare function getIidPromise(installationsService: _FirebaseInstallationsInternal): Promise<string>;
export declare function getIid(): string | undefined;
export declare function getAuthTokenPromise(installationsService: _FirebaseInstallationsInternal): Promise<string>;
export declare function getAuthenticationToken(): string | undefined;
