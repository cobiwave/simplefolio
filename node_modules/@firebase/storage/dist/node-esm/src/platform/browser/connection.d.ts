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
import { Connection, ConnectionType, ErrorCode, Headers } from '../../implementation/connection';
/**
 * Network layer for browsers. We use this instead of goog.net.XhrIo because
 * goog.net.XhrIo is hyuuuuge and doesn't work in React Native on Android.
 */
declare abstract class XhrConnection<T extends ConnectionType> implements Connection<T> {
    protected xhr_: XMLHttpRequest;
    private errorCode_;
    private sendPromise_;
    protected sent_: boolean;
    constructor();
    abstract initXhr(): void;
    send(url: string, method: string, body?: ArrayBufferView | Blob | string, headers?: Headers): Promise<void>;
    getErrorCode(): ErrorCode;
    getStatus(): number;
    getResponse(): T;
    getErrorText(): string;
    /** Aborts the request. */
    abort(): void;
    getResponseHeader(header: string): string | null;
    addUploadProgressListener(listener: (p1: ProgressEvent) => void): void;
    removeUploadProgressListener(listener: (p1: ProgressEvent) => void): void;
}
export declare class XhrTextConnection extends XhrConnection<string> {
    initXhr(): void;
}
export declare function newTextConnection(): Connection<string>;
export declare class XhrBytesConnection extends XhrConnection<ArrayBuffer> {
    private data_?;
    initXhr(): void;
}
export declare function newBytesConnection(): Connection<ArrayBuffer>;
export declare class XhrBlobConnection extends XhrConnection<Blob> {
    initXhr(): void;
}
export declare function newBlobConnection(): Connection<Blob>;
export declare function newStreamConnection(): Connection<NodeJS.ReadableStream>;
export declare function injectTestConnection(factory: (() => Connection<string>) | null): void;
export {};
