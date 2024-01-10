/**
 * @license
 * Copyright 2021 Google LLC
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
import { Connection, ConnectionType, ErrorCode } from '../../implementation/connection';
import { fetch as undiciFetch, Headers as undiciHeaders } from 'undici';
/**
 * Network layer that works in Node.
 *
 * This network implementation should not be used in browsers as it does not
 * support progress updates.
 */
declare abstract class FetchConnection<T extends ConnectionType> implements Connection<T> {
    protected errorCode_: ErrorCode;
    protected statusCode_: number | undefined;
    protected body_: ArrayBuffer | undefined;
    protected errorText_: string;
    protected headers_: undiciHeaders | undefined;
    protected sent_: boolean;
    protected fetch_: typeof undiciFetch;
    constructor();
    send(url: string, method: string, body?: ArrayBufferView | Blob | string, headers?: Record<string, string>): Promise<void>;
    getErrorCode(): ErrorCode;
    getStatus(): number;
    abstract getResponse(): T;
    getErrorText(): string;
    abort(): void;
    getResponseHeader(header: string): string | null;
    addUploadProgressListener(listener: (p1: ProgressEvent) => void): void;
    removeUploadProgressListener(listener: (p1: ProgressEvent) => void): void;
}
export declare class FetchTextConnection extends FetchConnection<string> {
    getResponse(): string;
}
export declare function newTextConnection(): Connection<string>;
export declare class FetchBytesConnection extends FetchConnection<ArrayBuffer> {
    getResponse(): ArrayBuffer;
}
export declare function newBytesConnection(): Connection<ArrayBuffer>;
export declare class FetchStreamConnection extends FetchConnection<NodeJS.ReadableStream> {
    private stream_;
    send(url: string, method: string, body?: ArrayBufferView | Blob | string, headers?: Record<string, string>): Promise<void>;
    getResponse(): NodeJS.ReadableStream;
}
export declare function newStreamConnection(): Connection<NodeJS.ReadableStream>;
export declare function newBlobConnection(): Connection<Blob>;
export declare function injectTestConnection(factory: (() => Connection<string>) | null): void;
export {};
