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
export interface TimerTripFn {
    (): void;
}
export interface TimerMap {
    [key: number]: TimerTripFn;
}
/**
 * Stubs window.setTimeout and returns a map of the functions that were passed
 * in (the map is mutable and will be modified as setTimeout gets called).
 * You can use this to manually cause timers to trip. The map is keyed by the
 * duration of the timeout
 */
export declare function stubTimeouts(ids?: number[]): TimerMap;
/**
 * Similar to stubTimeouts, but for use when there's only one timeout you
 * care about
 */
export declare function stubSingleTimeout(id?: number): TimerTripFn;
