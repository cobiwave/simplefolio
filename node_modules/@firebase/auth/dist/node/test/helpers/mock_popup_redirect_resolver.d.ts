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
import { PopupRedirectResolver } from '../../src/model/public_types';
import { AuthPopup } from '../../src/platform_browser/util/popup';
import { EventManager } from '../../src/model/popup_redirect';
/**
 * Generates a PopupRedirectResolver that can be used by the oauth methods.
 * These methods expect a class that can be instantiated.
 */
export declare function makeMockPopupRedirectResolver(eventManager?: EventManager, authPopup?: AuthPopup, webStorageSupported?: boolean): PopupRedirectResolver;
