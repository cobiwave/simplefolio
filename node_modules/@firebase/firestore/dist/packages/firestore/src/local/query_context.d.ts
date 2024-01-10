/**
 * @license
 * Copyright 2023 Google LLC
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
 * A tracker to keep a record of important details during database local query
 * execution.
 */
export declare class QueryContext {
    /**
     * Counts the number of documents passed through during local query execution.
     */
    private _documentReadCount;
    get documentReadCount(): number;
    incrementDocumentReadCount(amount: number): void;
}
