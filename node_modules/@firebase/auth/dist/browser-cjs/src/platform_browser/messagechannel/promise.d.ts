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
/** TODO: remove this once tslib has a polyfill for Promise.allSettled */
interface PromiseFulfilledResult<T> {
    fulfilled: true;
    value: T;
}
interface PromiseRejectedResult {
    fulfilled: false;
    reason: any;
}
export declare type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;
/**
 * Shim for Promise.allSettled, note the slightly different format of `fulfilled` vs `status`.
 *
 * @param promises - Array of promises to wait on.
 */
export declare function _allSettled<T>(promises: Array<Promise<T>>): Promise<Array<PromiseSettledResult<T>>>;
export {};
