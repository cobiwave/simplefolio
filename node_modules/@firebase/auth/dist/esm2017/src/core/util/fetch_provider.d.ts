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
export declare class FetchProvider {
    private static fetchImpl;
    private static headersImpl;
    private static responseImpl;
    static initialize(fetchImpl: typeof fetch, headersImpl?: typeof Headers, responseImpl?: typeof Response): void;
    static fetch(): typeof fetch;
    static headers(): typeof Headers;
    static response(): typeof Response;
}
