"use strict";
/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http2ServerCallStream = exports.ServerDuplexStreamImpl = exports.ServerWritableStreamImpl = exports.ServerReadableStreamImpl = exports.ServerUnaryCallImpl = void 0;
const events_1 = require("events");
const http2 = require("http2");
const stream_1 = require("stream");
const zlib = require("zlib");
const util_1 = require("util");
const constants_1 = require("./constants");
const metadata_1 = require("./metadata");
const stream_decoder_1 = require("./stream-decoder");
const logging = require("./logging");
const error_1 = require("./error");
const TRACER_NAME = 'server_call';
const unzip = (0, util_1.promisify)(zlib.unzip);
const inflate = (0, util_1.promisify)(zlib.inflate);
function trace(text) {
    logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, text);
}
const GRPC_ACCEPT_ENCODING_HEADER = 'grpc-accept-encoding';
const GRPC_ENCODING_HEADER = 'grpc-encoding';
const GRPC_MESSAGE_HEADER = 'grpc-message';
const GRPC_STATUS_HEADER = 'grpc-status';
const GRPC_TIMEOUT_HEADER = 'grpc-timeout';
const DEADLINE_REGEX = /(\d{1,8})\s*([HMSmun])/;
const deadlineUnitsToMs = {
    H: 3600000,
    M: 60000,
    S: 1000,
    m: 1,
    u: 0.001,
    n: 0.000001,
};
const defaultCompressionHeaders = {
    // TODO(cjihrig): Remove these encoding headers from the default response
    // once compression is integrated.
    [GRPC_ACCEPT_ENCODING_HEADER]: 'identity,deflate,gzip',
    [GRPC_ENCODING_HEADER]: 'identity',
};
const defaultResponseHeaders = {
    [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_OK,
    [http2.constants.HTTP2_HEADER_CONTENT_TYPE]: 'application/grpc+proto',
};
const defaultResponseOptions = {
    waitForTrailers: true,
};
class ServerUnaryCallImpl extends events_1.EventEmitter {
    constructor(call, metadata, request) {
        super();
        this.call = call;
        this.metadata = metadata;
        this.request = request;
        this.cancelled = false;
        this.call.setupSurfaceCall(this);
    }
    getPeer() {
        return this.call.getPeer();
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
    getDeadline() {
        return this.call.getDeadline();
    }
    getPath() {
        return this.call.getPath();
    }
}
exports.ServerUnaryCallImpl = ServerUnaryCallImpl;
class ServerReadableStreamImpl extends stream_1.Readable {
    constructor(call, metadata, deserialize, encoding) {
        super({ objectMode: true });
        this.call = call;
        this.metadata = metadata;
        this.deserialize = deserialize;
        this.cancelled = false;
        this.call.setupSurfaceCall(this);
        this.call.setupReadable(this, encoding);
    }
    _read(size) {
        if (!this.call.consumeUnpushedMessages(this)) {
            return;
        }
        this.call.resume();
    }
    getPeer() {
        return this.call.getPeer();
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
    getDeadline() {
        return this.call.getDeadline();
    }
    getPath() {
        return this.call.getPath();
    }
}
exports.ServerReadableStreamImpl = ServerReadableStreamImpl;
class ServerWritableStreamImpl extends stream_1.Writable {
    constructor(call, metadata, serialize, request) {
        super({ objectMode: true });
        this.call = call;
        this.metadata = metadata;
        this.serialize = serialize;
        this.request = request;
        this.cancelled = false;
        this.trailingMetadata = new metadata_1.Metadata();
        this.call.setupSurfaceCall(this);
        this.on('error', err => {
            this.call.sendError(err);
            this.end();
        });
    }
    getPeer() {
        return this.call.getPeer();
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
    getDeadline() {
        return this.call.getDeadline();
    }
    getPath() {
        return this.call.getPath();
    }
    _write(chunk, encoding, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback) {
        try {
            const response = this.call.serializeMessage(chunk);
            if (!this.call.write(response)) {
                this.call.once('drain', callback);
                return;
            }
        }
        catch (err) {
            this.emit('error', {
                details: (0, error_1.getErrorMessage)(err),
                code: constants_1.Status.INTERNAL,
            });
        }
        callback();
    }
    _final(callback) {
        this.call.sendStatus({
            code: constants_1.Status.OK,
            details: 'OK',
            metadata: this.trailingMetadata,
        });
        callback(null);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    end(metadata) {
        if (metadata) {
            this.trailingMetadata = metadata;
        }
        return super.end();
    }
}
exports.ServerWritableStreamImpl = ServerWritableStreamImpl;
class ServerDuplexStreamImpl extends stream_1.Duplex {
    constructor(call, metadata, serialize, deserialize, encoding) {
        super({ objectMode: true });
        this.call = call;
        this.metadata = metadata;
        this.serialize = serialize;
        this.deserialize = deserialize;
        this.cancelled = false;
        this.trailingMetadata = new metadata_1.Metadata();
        this.call.setupSurfaceCall(this);
        this.call.setupReadable(this, encoding);
        this.on('error', err => {
            this.call.sendError(err);
            this.end();
        });
    }
    getPeer() {
        return this.call.getPeer();
    }
    sendMetadata(responseMetadata) {
        this.call.sendMetadata(responseMetadata);
    }
    getDeadline() {
        return this.call.getDeadline();
    }
    getPath() {
        return this.call.getPath();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    end(metadata) {
        if (metadata) {
            this.trailingMetadata = metadata;
        }
        return super.end();
    }
}
exports.ServerDuplexStreamImpl = ServerDuplexStreamImpl;
ServerDuplexStreamImpl.prototype._read =
    ServerReadableStreamImpl.prototype._read;
ServerDuplexStreamImpl.prototype._write =
    ServerWritableStreamImpl.prototype._write;
ServerDuplexStreamImpl.prototype._final =
    ServerWritableStreamImpl.prototype._final;
// Internal class that wraps the HTTP2 request.
class Http2ServerCallStream extends events_1.EventEmitter {
    constructor(stream, handler, options) {
        super();
        this.stream = stream;
        this.handler = handler;
        this.cancelled = false;
        this.deadlineTimer = null;
        this.statusSent = false;
        this.deadline = Infinity;
        this.wantTrailers = false;
        this.metadataSent = false;
        this.canPush = false;
        this.isPushPending = false;
        this.bufferedMessages = [];
        this.messagesToPush = [];
        this.maxSendMessageSize = constants_1.DEFAULT_MAX_SEND_MESSAGE_LENGTH;
        this.maxReceiveMessageSize = constants_1.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
        this.stream.once('error', (err) => {
            /* We need an error handler to avoid uncaught error event exceptions, but
             * there is nothing we can reasonably do here. Any error event should
             * have a corresponding close event, which handles emitting the cancelled
             * event. And the stream is now in a bad state, so we can't reasonably
             * expect to be able to send an error over it. */
        });
        this.stream.once('close', () => {
            var _a;
            trace('Request to method ' +
                ((_a = this.handler) === null || _a === void 0 ? void 0 : _a.path) +
                ' stream closed with rstCode ' +
                this.stream.rstCode);
            if (!this.statusSent) {
                this.cancelled = true;
                this.emit('cancelled', 'cancelled');
                this.emit('streamEnd', false);
                this.sendStatus({
                    code: constants_1.Status.CANCELLED,
                    details: 'Cancelled by client',
                    metadata: null,
                });
                if (this.deadlineTimer)
                    clearTimeout(this.deadlineTimer);
            }
        });
        this.stream.on('drain', () => {
            this.emit('drain');
        });
        if ('grpc.max_send_message_length' in options) {
            this.maxSendMessageSize = options['grpc.max_send_message_length'];
        }
        if ('grpc.max_receive_message_length' in options) {
            this.maxReceiveMessageSize = options['grpc.max_receive_message_length'];
        }
    }
    checkCancelled() {
        /* In some cases the stream can become destroyed before the close event
         * fires. That creates a race condition that this check works around */
        if (this.stream.destroyed || this.stream.closed) {
            this.cancelled = true;
        }
        return this.cancelled;
    }
    getDecompressedMessage(message, encoding) {
        if (encoding === 'deflate') {
            return inflate(message.subarray(5));
        }
        else if (encoding === 'gzip') {
            return unzip(message.subarray(5));
        }
        else if (encoding === 'identity') {
            return message.subarray(5);
        }
        return Promise.reject({
            code: constants_1.Status.UNIMPLEMENTED,
            details: `Received message compressed with unsupported encoding "${encoding}"`,
        });
    }
    sendMetadata(customMetadata) {
        if (this.checkCancelled()) {
            return;
        }
        if (this.metadataSent) {
            return;
        }
        this.metadataSent = true;
        const custom = customMetadata ? customMetadata.toHttp2Headers() : null;
        // TODO(cjihrig): Include compression headers.
        const headers = Object.assign(Object.assign(Object.assign({}, defaultResponseHeaders), defaultCompressionHeaders), custom);
        this.stream.respond(headers, defaultResponseOptions);
    }
    receiveMetadata(headers) {
        const metadata = metadata_1.Metadata.fromHttp2Headers(headers);
        if (logging.isTracerEnabled(TRACER_NAME)) {
            trace('Request to ' +
                this.handler.path +
                ' received headers ' +
                JSON.stringify(metadata.toJSON()));
        }
        // TODO(cjihrig): Receive compression metadata.
        const timeoutHeader = metadata.get(GRPC_TIMEOUT_HEADER);
        if (timeoutHeader.length > 0) {
            const match = timeoutHeader[0].toString().match(DEADLINE_REGEX);
            if (match === null) {
                const err = new Error('Invalid deadline');
                err.code = constants_1.Status.OUT_OF_RANGE;
                this.sendError(err);
                return metadata;
            }
            const timeout = (+match[1] * deadlineUnitsToMs[match[2]]) | 0;
            const now = new Date();
            this.deadline = now.setMilliseconds(now.getMilliseconds() + timeout);
            this.deadlineTimer = setTimeout(handleExpiredDeadline, timeout, this);
            metadata.remove(GRPC_TIMEOUT_HEADER);
        }
        // Remove several headers that should not be propagated to the application
        metadata.remove(http2.constants.HTTP2_HEADER_ACCEPT_ENCODING);
        metadata.remove(http2.constants.HTTP2_HEADER_TE);
        metadata.remove(http2.constants.HTTP2_HEADER_CONTENT_TYPE);
        metadata.remove('grpc-accept-encoding');
        return metadata;
    }
    receiveUnaryMessage(encoding) {
        return new Promise((resolve, reject) => {
            const { stream } = this;
            let receivedLength = 0;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const call = this;
            const body = [];
            const limit = this.maxReceiveMessageSize;
            this.stream.on('data', onData);
            this.stream.on('end', onEnd);
            this.stream.on('error', onEnd);
            function onData(chunk) {
                receivedLength += chunk.byteLength;
                if (limit !== -1 && receivedLength > limit) {
                    stream.removeListener('data', onData);
                    stream.removeListener('end', onEnd);
                    stream.removeListener('error', onEnd);
                    reject({
                        code: constants_1.Status.RESOURCE_EXHAUSTED,
                        details: `Received message larger than max (${receivedLength} vs. ${limit})`,
                    });
                    return;
                }
                body.push(chunk);
            }
            function onEnd(err) {
                stream.removeListener('data', onData);
                stream.removeListener('end', onEnd);
                stream.removeListener('error', onEnd);
                if (err !== undefined) {
                    reject({ code: constants_1.Status.INTERNAL, details: err.message });
                    return;
                }
                if (receivedLength === 0) {
                    reject({
                        code: constants_1.Status.INTERNAL,
                        details: 'received empty unary message',
                    });
                    return;
                }
                call.emit('receiveMessage');
                const requestBytes = Buffer.concat(body, receivedLength);
                const compressed = requestBytes.readUInt8(0) === 1;
                const compressedMessageEncoding = compressed ? encoding : 'identity';
                const decompressedMessage = call.getDecompressedMessage(requestBytes, compressedMessageEncoding);
                if (Buffer.isBuffer(decompressedMessage)) {
                    resolve(call.deserializeMessageWithInternalError(decompressedMessage));
                    return;
                }
                decompressedMessage.then(decompressed => resolve(call.deserializeMessageWithInternalError(decompressed)), (err) => reject(err.code
                    ? err
                    : {
                        code: constants_1.Status.INTERNAL,
                        details: `Received "grpc-encoding" header "${encoding}" but ${encoding} decompression failed`,
                    }));
            }
        });
    }
    async deserializeMessageWithInternalError(buffer) {
        try {
            return this.deserializeMessage(buffer);
        }
        catch (err) {
            throw {
                details: (0, error_1.getErrorMessage)(err),
                code: constants_1.Status.INTERNAL,
            };
        }
    }
    serializeMessage(value) {
        const messageBuffer = this.handler.serialize(value);
        // TODO(cjihrig): Call compression aware serializeMessage().
        const byteLength = messageBuffer.byteLength;
        const output = Buffer.allocUnsafe(byteLength + 5);
        output.writeUInt8(0, 0);
        output.writeUInt32BE(byteLength, 1);
        messageBuffer.copy(output, 5);
        return output;
    }
    deserializeMessage(bytes) {
        return this.handler.deserialize(bytes);
    }
    async sendUnaryMessage(err, value, metadata, flags) {
        if (this.checkCancelled()) {
            return;
        }
        if (metadata === undefined) {
            metadata = null;
        }
        if (err) {
            if (!Object.prototype.hasOwnProperty.call(err, 'metadata') && metadata) {
                err.metadata = metadata;
            }
            this.sendError(err);
            return;
        }
        try {
            const response = this.serializeMessage(value);
            this.write(response);
            this.sendStatus({ code: constants_1.Status.OK, details: 'OK', metadata });
        }
        catch (err) {
            this.sendError({
                details: (0, error_1.getErrorMessage)(err),
                code: constants_1.Status.INTERNAL,
            });
        }
    }
    sendStatus(statusObj) {
        var _a, _b;
        this.emit('callEnd', statusObj.code);
        this.emit('streamEnd', statusObj.code === constants_1.Status.OK);
        if (this.checkCancelled()) {
            return;
        }
        trace('Request to method ' +
            ((_a = this.handler) === null || _a === void 0 ? void 0 : _a.path) +
            ' ended with status code: ' +
            constants_1.Status[statusObj.code] +
            ' details: ' +
            statusObj.details);
        if (this.deadlineTimer)
            clearTimeout(this.deadlineTimer);
        if (this.stream.headersSent) {
            if (!this.wantTrailers) {
                this.wantTrailers = true;
                this.stream.once('wantTrailers', () => {
                    var _a;
                    const trailersToSend = Object.assign({ [GRPC_STATUS_HEADER]: statusObj.code, [GRPC_MESSAGE_HEADER]: encodeURI(statusObj.details) }, (_a = statusObj.metadata) === null || _a === void 0 ? void 0 : _a.toHttp2Headers());
                    this.stream.sendTrailers(trailersToSend);
                    this.statusSent = true;
                });
                this.stream.end();
            }
        }
        else {
            // Trailers-only response
            const trailersToSend = Object.assign(Object.assign({ [GRPC_STATUS_HEADER]: statusObj.code, [GRPC_MESSAGE_HEADER]: encodeURI(statusObj.details) }, defaultResponseHeaders), (_b = statusObj.metadata) === null || _b === void 0 ? void 0 : _b.toHttp2Headers());
            this.stream.respond(trailersToSend, { endStream: true });
            this.statusSent = true;
        }
    }
    sendError(error) {
        const status = {
            code: constants_1.Status.UNKNOWN,
            details: 'message' in error ? error.message : 'Unknown Error',
            metadata: 'metadata' in error && error.metadata !== undefined
                ? error.metadata
                : null,
        };
        if ('code' in error &&
            typeof error.code === 'number' &&
            Number.isInteger(error.code)) {
            status.code = error.code;
            if ('details' in error && typeof error.details === 'string') {
                status.details = error.details;
            }
        }
        this.sendStatus(status);
    }
    write(chunk) {
        if (this.checkCancelled()) {
            return;
        }
        if (this.maxSendMessageSize !== -1 &&
            chunk.length > this.maxSendMessageSize) {
            this.sendError({
                code: constants_1.Status.RESOURCE_EXHAUSTED,
                details: `Sent message larger than max (${chunk.length} vs. ${this.maxSendMessageSize})`,
            });
            return;
        }
        this.sendMetadata();
        this.emit('sendMessage');
        return this.stream.write(chunk);
    }
    resume() {
        this.stream.resume();
    }
    setupSurfaceCall(call) {
        this.once('cancelled', reason => {
            call.cancelled = true;
            call.emit('cancelled', reason);
        });
        this.once('callEnd', status => call.emit('callEnd', status));
    }
    setupReadable(readable, encoding) {
        const decoder = new stream_decoder_1.StreamDecoder();
        let readsDone = false;
        let pendingMessageProcessing = false;
        let pushedEnd = false;
        const maybePushEnd = async () => {
            if (!pushedEnd && readsDone && !pendingMessageProcessing) {
                pushedEnd = true;
                await this.pushOrBufferMessage(readable, null);
            }
        };
        this.stream.on('data', async (data) => {
            const messages = decoder.write(data);
            pendingMessageProcessing = true;
            this.stream.pause();
            for (const message of messages) {
                if (this.maxReceiveMessageSize !== -1 &&
                    message.length > this.maxReceiveMessageSize) {
                    this.sendError({
                        code: constants_1.Status.RESOURCE_EXHAUSTED,
                        details: `Received message larger than max (${message.length} vs. ${this.maxReceiveMessageSize})`,
                    });
                    return;
                }
                this.emit('receiveMessage');
                const compressed = message.readUInt8(0) === 1;
                const compressedMessageEncoding = compressed ? encoding : 'identity';
                const decompressedMessage = await this.getDecompressedMessage(message, compressedMessageEncoding);
                // Encountered an error with decompression; it'll already have been propogated back
                // Just return early
                if (!decompressedMessage)
                    return;
                await this.pushOrBufferMessage(readable, decompressedMessage);
            }
            pendingMessageProcessing = false;
            this.stream.resume();
            await maybePushEnd();
        });
        this.stream.once('end', async () => {
            readsDone = true;
            await maybePushEnd();
        });
    }
    consumeUnpushedMessages(readable) {
        this.canPush = true;
        while (this.messagesToPush.length > 0) {
            const nextMessage = this.messagesToPush.shift();
            const canPush = readable.push(nextMessage);
            if (nextMessage === null || canPush === false) {
                this.canPush = false;
                break;
            }
        }
        return this.canPush;
    }
    async pushOrBufferMessage(readable, messageBytes) {
        if (this.isPushPending) {
            this.bufferedMessages.push(messageBytes);
        }
        else {
            await this.pushMessage(readable, messageBytes);
        }
    }
    async pushMessage(readable, messageBytes) {
        if (messageBytes === null) {
            trace('Received end of stream');
            if (this.canPush) {
                readable.push(null);
            }
            else {
                this.messagesToPush.push(null);
            }
            return;
        }
        trace('Received message of length ' + messageBytes.length);
        this.isPushPending = true;
        try {
            const deserialized = await this.deserializeMessage(messageBytes);
            if (this.canPush) {
                if (!readable.push(deserialized)) {
                    this.canPush = false;
                    this.stream.pause();
                }
            }
            else {
                this.messagesToPush.push(deserialized);
            }
        }
        catch (error) {
            // Ignore any remaining messages when errors occur.
            this.bufferedMessages.length = 0;
            let code = (0, error_1.getErrorCode)(error);
            if (code === null || code < constants_1.Status.OK || code > constants_1.Status.UNAUTHENTICATED) {
                code = constants_1.Status.INTERNAL;
            }
            readable.emit('error', {
                details: (0, error_1.getErrorMessage)(error),
                code: code,
            });
        }
        this.isPushPending = false;
        if (this.bufferedMessages.length > 0) {
            await this.pushMessage(readable, this.bufferedMessages.shift());
        }
    }
    getPeer() {
        var _a;
        const socket = (_a = this.stream.session) === null || _a === void 0 ? void 0 : _a.socket;
        if (socket === null || socket === void 0 ? void 0 : socket.remoteAddress) {
            if (socket.remotePort) {
                return `${socket.remoteAddress}:${socket.remotePort}`;
            }
            else {
                return socket.remoteAddress;
            }
        }
        else {
            return 'unknown';
        }
    }
    getDeadline() {
        return this.deadline;
    }
    getPath() {
        return this.handler.path;
    }
}
exports.Http2ServerCallStream = Http2ServerCallStream;
function handleExpiredDeadline(call) {
    const err = new Error('Deadline exceeded');
    err.code = constants_1.Status.DEADLINE_EXCEEDED;
    call.sendError(err);
    call.cancelled = true;
    call.emit('cancelled', 'deadline');
}
//# sourceMappingURL=server-call.js.map