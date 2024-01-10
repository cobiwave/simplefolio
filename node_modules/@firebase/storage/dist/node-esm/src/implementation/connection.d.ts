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
/// <reference types="node" />
/** Network headers */
export declare type Headers = Record<string, string>;
/** Response type exposed by the networking APIs. */
export declare type ConnectionType = string | ArrayBuffer | Blob | NodeJS.ReadableStream;
/**
 * A lightweight wrapper around XMLHttpRequest with a
 * goog.net.XhrIo-like interface.
 *
 * You can create a new connection by invoking `newTextConnection()`,
 * `newBytesConnection()` or `newStreamConnection()`.
 */
export interface Connection<T extends ConnectionType> {
    /**
     * Sends a request to the provided URL.
     *
     * This method never rejects its promise. In case of encountering an error,
     * it sets an error code internally which can be accessed by calling
     * getErrorCode() by callers.
     */
    send(url: string, method: string, body?: ArrayBufferView | Blob | string | null, headers?: Headers): Promise<void>;
    getErrorCode(): ErrorCode;
    getStatus(): number;
    getResponse(): T;
    getErrorText(): string;
    /**
     * Abort the request.
     */
    abort(): void;
    getResponseHeader(header: string): string | null;
    addUploadProgressListener(listener: (p1: ProgressEvent) => void): void;
    removeUploadProgressListener(listener: (p1: ProgressEvent) => void): void;
}
/**
 * Error codes for requests made by the the XhrIo wrapper.
 */
export declare enum ErrorCode {
    NO_ERROR = 0,
    NETWORK_ERROR = 1,
    ABORT = 2
}
