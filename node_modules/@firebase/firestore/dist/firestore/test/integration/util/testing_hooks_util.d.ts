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
import { DocumentReference } from './firebase_export';
/**
 * Captures all existence filter mismatches in the Watch 'Listen' stream that
 * occur during the execution of the given code block.
 * @param callback The callback to invoke; during the invocation of this
 * callback all existence filter mismatches will be captured.
 * @return the captured existence filter mismatches and the result of awaiting
 * the given callback.
 */
export declare function captureExistenceFilterMismatches<T>(callback: () => Promise<T>): Promise<[ExistenceFilterMismatchInfo[], T]>;
/**
 * Information about an existence filter mismatch, captured during an invocation
 * of `captureExistenceFilterMismatches()`.
 *
 * See the documentation of `ExistenceFilterMismatchInfo` in
 * `testing_hooks_spi.ts` for the meaning of these values.
 */
export interface ExistenceFilterMismatchInfo {
    localCacheCount: number;
    existenceFilterCount: number;
    bloomFilter?: {
        applied: boolean;
        hashCount: number;
        bitmapLength: number;
        padding: number;
        mightContain(documentRef: DocumentReference): boolean;
    };
}
