/**
 * @license
 * Copyright 2017 Google LLC
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
import { FunctionsErrorCodeCore as FunctionsErrorCode } from './public-types';
import { HttpResponseBody } from './service';
import { FirebaseError } from '@firebase/util';
/**
 * An explicit error that can be thrown from a handler to send an error to the
 * client that called the function.
 */
export declare class FunctionsError extends FirebaseError {
    /**
     * Extra data to be converted to JSON and included in the error response.
     */
    readonly details?: unknown;
    constructor(
    /**
     * A standard error code that will be returned to the client. This also
     * determines the HTTP status code of the response, as defined in code.proto.
     */
    code: FunctionsErrorCode, message?: string, 
    /**
     * Extra data to be converted to JSON and included in the error response.
     */
    details?: unknown);
}
/**
 * Takes an HTTP response and returns the corresponding Error, if any.
 */
export declare function _errorForResponse(status: number, bodyJSON: HttpResponseBody | null): Error | null;
