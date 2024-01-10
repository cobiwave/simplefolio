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
import { StorageError } from './error';
import { Headers, Connection, ConnectionType } from './connection';
/**
 * Type for url params stored in RequestInfo.
 */
export interface UrlParams {
    [name: string]: string | number;
}
/**
 * A function that converts a server response to the API type expected by the
 * SDK.
 *
 * @param I - the type of the backend's network response
 * @param O - the output response type used by the rest of the SDK.
 */
export declare type RequestHandler<I extends ConnectionType, O> = (connection: Connection<I>, response: I) => O;
/** A function to handle an error. */
export declare type ErrorHandler = (connection: Connection<ConnectionType>, response: StorageError) => StorageError;
/**
 * Contains a fully specified request.
 *
 * @param I - the type of the backend's network response.
 * @param O - the output response type used by the rest of the SDK.
 */
export declare class RequestInfo<I extends ConnectionType, O> {
    url: string;
    method: string;
    /**
     * Returns the value with which to resolve the request's promise. Only called
     * if the request is successful. Throw from this function to reject the
     * returned Request's promise with the thrown error.
     * Note: The XhrIo passed to this function may be reused after this callback
     * returns. Do not keep a reference to it in any way.
     */
    handler: RequestHandler<I, O>;
    timeout: number;
    urlParams: UrlParams;
    headers: Headers;
    body: Blob | string | Uint8Array | null;
    errorHandler: ErrorHandler | null;
    /**
     * Called with the current number of bytes uploaded and total size (-1 if not
     * computable) of the request body (i.e. used to report upload progress).
     */
    progressCallback: ((p1: number, p2: number) => void) | null;
    successCodes: number[];
    additionalRetryCodes: number[];
    constructor(url: string, method: string, 
    /**
     * Returns the value with which to resolve the request's promise. Only called
     * if the request is successful. Throw from this function to reject the
     * returned Request's promise with the thrown error.
     * Note: The XhrIo passed to this function may be reused after this callback
     * returns. Do not keep a reference to it in any way.
     */
    handler: RequestHandler<I, O>, timeout: number);
}
