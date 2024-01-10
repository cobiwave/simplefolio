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
/** Forward direction wrapper from Compat --unwrap-> Exp */
export interface Wrapper<T> {
    unwrap(): T;
}
/** Reverse direction wrapper from Exp --wrapped--> Compat */
export interface ReverseWrapper<T> {
    wrapped(): T;
}
export declare function unwrap<T>(object: unknown): T;
export declare function wrapped<T>(object: unknown): T;
