/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import * as http2 from 'http2';
import { Duplex, Readable, Writable } from 'stream';
import { Deserialize, Serialize } from './make-client';
import { Metadata } from './metadata';
import { ObjectReadable, ObjectWritable } from './object-stream';
import { ChannelOptions } from './channel-options';
import { StatusObject, PartialStatusObject } from './call-interface';
import { Deadline } from './deadline';
export type ServerStatusResponse = Partial<StatusObject>;
export type ServerErrorResponse = ServerStatusResponse & Error;
export type ServerSurfaceCall = {
    cancelled: boolean;
    readonly metadata: Metadata;
    getPeer(): string;
    sendMetadata(responseMetadata: Metadata): void;
    getDeadline(): Deadline;
    getPath(): string;
} & EventEmitter;
export type ServerUnaryCall<RequestType, ResponseType> = ServerSurfaceCall & {
    request: RequestType;
};
export type ServerReadableStream<RequestType, ResponseType> = ServerSurfaceCall & ObjectReadable<RequestType>;
export type ServerWritableStream<RequestType, ResponseType> = ServerSurfaceCall & ObjectWritable<ResponseType> & {
    request: RequestType;
    end: (metadata?: Metadata) => void;
};
export type ServerDuplexStream<RequestType, ResponseType> = ServerSurfaceCall & ObjectReadable<RequestType> & ObjectWritable<ResponseType> & {
    end: (metadata?: Metadata) => void;
};
export declare class ServerUnaryCallImpl<RequestType, ResponseType> extends EventEmitter implements ServerUnaryCall<RequestType, ResponseType> {
    private call;
    metadata: Metadata;
    request: RequestType;
    cancelled: boolean;
    constructor(call: Http2ServerCallStream<RequestType, ResponseType>, metadata: Metadata, request: RequestType);
    getPeer(): string;
    sendMetadata(responseMetadata: Metadata): void;
    getDeadline(): Deadline;
    getPath(): string;
}
export declare class ServerReadableStreamImpl<RequestType, ResponseType> extends Readable implements ServerReadableStream<RequestType, ResponseType> {
    private call;
    metadata: Metadata;
    deserialize: Deserialize<RequestType>;
    cancelled: boolean;
    constructor(call: Http2ServerCallStream<RequestType, ResponseType>, metadata: Metadata, deserialize: Deserialize<RequestType>, encoding: string);
    _read(size: number): void;
    getPeer(): string;
    sendMetadata(responseMetadata: Metadata): void;
    getDeadline(): Deadline;
    getPath(): string;
}
export declare class ServerWritableStreamImpl<RequestType, ResponseType> extends Writable implements ServerWritableStream<RequestType, ResponseType> {
    private call;
    metadata: Metadata;
    serialize: Serialize<ResponseType>;
    request: RequestType;
    cancelled: boolean;
    private trailingMetadata;
    constructor(call: Http2ServerCallStream<RequestType, ResponseType>, metadata: Metadata, serialize: Serialize<ResponseType>, request: RequestType);
    getPeer(): string;
    sendMetadata(responseMetadata: Metadata): void;
    getDeadline(): Deadline;
    getPath(): string;
    _write(chunk: ResponseType, encoding: string, callback: (...args: any[]) => void): void;
    _final(callback: Function): void;
    end(metadata?: any): this;
}
export declare class ServerDuplexStreamImpl<RequestType, ResponseType> extends Duplex implements ServerDuplexStream<RequestType, ResponseType> {
    private call;
    metadata: Metadata;
    serialize: Serialize<ResponseType>;
    deserialize: Deserialize<RequestType>;
    cancelled: boolean;
    private trailingMetadata;
    constructor(call: Http2ServerCallStream<RequestType, ResponseType>, metadata: Metadata, serialize: Serialize<ResponseType>, deserialize: Deserialize<RequestType>, encoding: string);
    getPeer(): string;
    sendMetadata(responseMetadata: Metadata): void;
    getDeadline(): Deadline;
    getPath(): string;
    end(metadata?: any): this;
}
export type sendUnaryData<ResponseType> = (error: ServerErrorResponse | ServerStatusResponse | null, value?: ResponseType | null, trailer?: Metadata, flags?: number) => void;
export type handleUnaryCall<RequestType, ResponseType> = (call: ServerUnaryCall<RequestType, ResponseType>, callback: sendUnaryData<ResponseType>) => void;
export type handleClientStreamingCall<RequestType, ResponseType> = (call: ServerReadableStream<RequestType, ResponseType>, callback: sendUnaryData<ResponseType>) => void;
export type handleServerStreamingCall<RequestType, ResponseType> = (call: ServerWritableStream<RequestType, ResponseType>) => void;
export type handleBidiStreamingCall<RequestType, ResponseType> = (call: ServerDuplexStream<RequestType, ResponseType>) => void;
export type HandleCall<RequestType, ResponseType> = handleUnaryCall<RequestType, ResponseType> | handleClientStreamingCall<RequestType, ResponseType> | handleServerStreamingCall<RequestType, ResponseType> | handleBidiStreamingCall<RequestType, ResponseType>;
export interface UnaryHandler<RequestType, ResponseType> {
    func: handleUnaryCall<RequestType, ResponseType>;
    serialize: Serialize<ResponseType>;
    deserialize: Deserialize<RequestType>;
    type: HandlerType;
    path: string;
}
export interface ClientStreamingHandler<RequestType, ResponseType> {
    func: handleClientStreamingCall<RequestType, ResponseType>;
    serialize: Serialize<ResponseType>;
    deserialize: Deserialize<RequestType>;
    type: HandlerType;
    path: string;
}
export interface ServerStreamingHandler<RequestType, ResponseType> {
    func: handleServerStreamingCall<RequestType, ResponseType>;
    serialize: Serialize<ResponseType>;
    deserialize: Deserialize<RequestType>;
    type: HandlerType;
    path: string;
}
export interface BidiStreamingHandler<RequestType, ResponseType> {
    func: handleBidiStreamingCall<RequestType, ResponseType>;
    serialize: Serialize<ResponseType>;
    deserialize: Deserialize<RequestType>;
    type: HandlerType;
    path: string;
}
export type Handler<RequestType, ResponseType> = UnaryHandler<RequestType, ResponseType> | ClientStreamingHandler<RequestType, ResponseType> | ServerStreamingHandler<RequestType, ResponseType> | BidiStreamingHandler<RequestType, ResponseType>;
export type HandlerType = 'bidi' | 'clientStream' | 'serverStream' | 'unary';
export declare class Http2ServerCallStream<RequestType, ResponseType> extends EventEmitter {
    private stream;
    private handler;
    cancelled: boolean;
    deadlineTimer: NodeJS.Timeout | null;
    private statusSent;
    private deadline;
    private wantTrailers;
    private metadataSent;
    private canPush;
    private isPushPending;
    private bufferedMessages;
    private messagesToPush;
    private maxSendMessageSize;
    private maxReceiveMessageSize;
    constructor(stream: http2.ServerHttp2Stream, handler: Handler<RequestType, ResponseType>, options: ChannelOptions);
    private checkCancelled;
    private getDecompressedMessage;
    sendMetadata(customMetadata?: Metadata): void;
    receiveMetadata(headers: http2.IncomingHttpHeaders): Metadata;
    receiveUnaryMessage(encoding: string): Promise<RequestType>;
    private deserializeMessageWithInternalError;
    serializeMessage(value: ResponseType): Buffer;
    deserializeMessage(bytes: Buffer): RequestType;
    sendUnaryMessage(err: ServerErrorResponse | ServerStatusResponse | null, value?: ResponseType | null, metadata?: Metadata | null, flags?: number): Promise<void>;
    sendStatus(statusObj: PartialStatusObject): void;
    sendError(error: ServerErrorResponse | ServerStatusResponse): void;
    write(chunk: Buffer): boolean | undefined;
    resume(): void;
    setupSurfaceCall(call: ServerSurfaceCall): void;
    setupReadable(readable: ServerReadableStream<RequestType, ResponseType> | ServerDuplexStream<RequestType, ResponseType>, encoding: string): void;
    consumeUnpushedMessages(readable: ServerReadableStream<RequestType, ResponseType> | ServerDuplexStream<RequestType, ResponseType>): boolean;
    private pushOrBufferMessage;
    private pushMessage;
    getPeer(): string;
    getDeadline(): Deadline;
    getPath(): string;
}
