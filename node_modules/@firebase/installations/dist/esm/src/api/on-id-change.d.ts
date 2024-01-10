/**
 * @license
 * Copyright 2019 Google LLC
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
import { Installations } from '../interfaces/public-types';
/**
 * An user defined callback function that gets called when Installations ID changes.
 *
 * @public
 */
export declare type IdChangeCallbackFn = (installationId: string) => void;
/**
 * Unsubscribe a callback function previously added via {@link IdChangeCallbackFn}.
 *
 * @public
 */
export declare type IdChangeUnsubscribeFn = () => void;
/**
 * Sets a new callback that will get called when Installation ID changes.
 * Returns an unsubscribe function that will remove the callback when called.
 * @param installations - The `Installations` instance.
 * @param callback - The callback function that is invoked when FID changes.
 * @returns A function that can be called to unsubscribe.
 *
 * @public
 */
export declare function onIdChange(installations: Installations, callback: IdChangeCallbackFn): IdChangeUnsubscribeFn;
