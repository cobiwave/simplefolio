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
import { AuthProvider } from '../../model/public_types';
import { AuthInternal } from '../../model/auth';
import { AuthEventType } from '../../model/popup_redirect';
export declare function _getRedirectUrl(auth: AuthInternal, provider: AuthProvider, authType: AuthEventType, redirectUrl?: string, eventId?: string, additionalParams?: Record<string, string>): Promise<string>;
