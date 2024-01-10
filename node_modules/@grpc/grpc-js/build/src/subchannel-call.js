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
exports.Http2SubchannelCall = void 0;
const http2 = require("http2");
const os = require("os");
const constants_1 = require("./constants");
const metadata_1 = require("./metadata");
const stream_decoder_1 = require("./stream-decoder");
const logging = require("./logging");
const constants_2 = require("./constants");
const TRACER_NAME = 'subchannel_call';
/**
 * Should do approximately the same thing as util.getSystemErrorName but the
 * TypeScript types don't have that function for some reason so I just made my
 * own.
 * @param errno
 */
function getSystemErrorName(errno) {
    for (const [name, num] of Object.entries(os.constants.errno)) {
        if (num === errno) {
            return name;
        }
    }
    return 'Unknown system error ' + errno;
}
class Http2SubchannelCall {
    constructor(http2Stream, callEventTracker, listener, transport, callId) {
        this.http2Stream = http2Stream;
        this.callEventTracker = callEventTracker;
        this.listener = listener;
        this.transport = transport;
        this.callId = callId;
        this.decoder = new stream_decoder_1.StreamDecoder();
        this.isReadFilterPending = false;
        this.isPushPending = false;
        this.canPush = false;
        /**
         * Indicates that an 'end' event has come from the http2 stream, so there
         * will be no more data events.
         */
        this.readsClosed = false;
        this.statusOutput = false;
        this.unpushedReadMessages = [];
        // Status code mapped from :status. To be used if grpc-status is not received
        this.mappedStatusCode = constants_1.Status.UNKNOWN;
        // This is populated (non-null) if and only if the call has ended
        this.finalStatus = null;
        this.internalError = null;
        http2Stream.on('response', (headers, flags) => {
            let headersString = '';
            for (const header of Object.keys(headers)) {
                headersString += '\t\t' + header + ': ' + headers[header] + '\n';
            }
            this.trace('Received server headers:\n' + headersString);
            switch (headers[':status']) {
                // TODO(murgatroid99): handle 100 and 101
                case 400:
                    this.mappedStatusCode = constants_1.Status.INTERNAL;
                    break;
                case 401:
                    this.mappedStatusCode = constants_1.Status.UNAUTHENTICATED;
                    break;
                case 403:
                    this.mappedStatusCode = constants_1.Status.PERMISSION_DENIED;
                    break;
                case 404:
                    this.mappedStatusCode = constants_1.Status.UNIMPLEMENTED;
                    break;
                case 429:
                case 502:
                case 503:
                case 504:
                    this.mappedStatusCode = constants_1.Status.UNAVAILABLE;
                    break;
                default:
                    this.mappedStatusCode = constants_1.Status.UNKNOWN;
            }
            if (flags & http2.constants.NGHTTP2_FLAG_END_STREAM) {
                this.handleTrailers(headers);
            }
            else {
                let metadata;
                try {
                    metadata = metadata_1.Metadata.fromHttp2Headers(headers);
                }
                catch (error) {
                    this.endCall({
                        code: constants_1.Status.UNKNOWN,
                        details: error.message,
                        metadata: new metadata_1.Metadata(),
                    });
                    return;
                }
                this.listener.onReceiveMetadata(metadata);
            }
        });
        http2Stream.on('trailers', (headers) => {
            this.handleTrailers(headers);
        });
        http2Stream.on('data', (data) => {
            /* If the status has already been output, allow the http2 stream to
             * drain without processing the data. */
            if (this.statusOutput) {
                return;
            }
            this.trace('receive HTTP/2 data frame of length ' + data.length);
            const messages = this.decoder.write(data);
            for (const message of messages) {
                this.trace('parsed message of length ' + message.length);
                this.callEventTracker.addMessageReceived();
                this.tryPush(message);
            }
        });
        http2Stream.on('end', () => {
            this.readsClosed = true;
            this.maybeOutputStatus();
        });
        http2Stream.on('close', () => {
            /* Use process.next tick to ensure that this code happens after any
             * "error" event that may be emitted at about the same time, so that
             * we can bubble up the error message from that event. */
            process.nextTick(() => {
                var _a;
                this.trace('HTTP/2 stream closed with code ' + http2Stream.rstCode);
                /* If we have a final status with an OK status code, that means that
                 * we have received all of the messages and we have processed the
                 * trailers and the call completed successfully, so it doesn't matter
                 * how the stream ends after that */
                if (((_a = this.finalStatus) === null || _a === void 0 ? void 0 : _a.code) === constants_1.Status.OK) {
                    return;
                }
                let code;
                let details = '';
                switch (http2Stream.rstCode) {
                    case http2.constants.NGHTTP2_NO_ERROR:
                        /* If we get a NO_ERROR code and we already have a status, the
                         * stream completed properly and we just haven't fully processed
                         * it yet */
                        if (this.finalStatus !== null) {
                            return;
                        }
                        code = constants_1.Status.INTERNAL;
                        details = `Received RST_STREAM with code ${http2Stream.rstCode}`;
                        break;
                    case http2.constants.NGHTTP2_REFUSED_STREAM:
                        code = constants_1.Status.UNAVAILABLE;
                        details = 'Stream refused by server';
                        break;
                    case http2.constants.NGHTTP2_CANCEL:
                        code = constants_1.Status.CANCELLED;
                        details = 'Call cancelled';
                        break;
                    case http2.constants.NGHTTP2_ENHANCE_YOUR_CALM:
                        code = constants_1.Status.RESOURCE_EXHAUSTED;
                        details = 'Bandwidth exhausted or memory limit exceeded';
                        break;
                    case http2.constants.NGHTTP2_INADEQUATE_SECURITY:
                        code = constants_1.Status.PERMISSION_DENIED;
                        details = 'Protocol not secure enough';
                        break;
                    case http2.constants.NGHTTP2_INTERNAL_ERROR:
                        code = constants_1.Status.INTERNAL;
                        if (this.internalError === null) {
                            /* This error code was previously handled in the default case, and
                             * there are several instances of it online, so I wanted to
                             * preserve the original error message so that people find existing
                             * information in searches, but also include the more recognizable
                             * "Internal server error" message. */
                            details = `Received RST_STREAM with code ${http2Stream.rstCode} (Internal server error)`;
                        }
                        else {
                            if (this.internalError.code === 'ECONNRESET' ||
                                this.internalError.code === 'ETIMEDOUT') {
                                code = constants_1.Status.UNAVAILABLE;
                                details = this.internalError.message;
                            }
                            else {
                                /* The "Received RST_STREAM with code ..." error is preserved
                                 * here for continuity with errors reported online, but the
                                 * error message at the end will probably be more relevant in
                                 * most cases. */
                                details = `Received RST_STREAM with code ${http2Stream.rstCode} triggered by internal client error: ${this.internalError.message}`;
                            }
                        }
                        break;
                    default:
                        code = constants_1.Status.INTERNAL;
                        details = `Received RST_STREAM with code ${http2Stream.rstCode}`;
                }
                // This is a no-op if trailers were received at all.
                // This is OK, because status codes emitted here correspond to more
                // catastrophic issues that prevent us from receiving trailers in the
                // first place.
                this.endCall({
                    code,
                    details,
                    metadata: new metadata_1.Metadata(),
                    rstCode: http2Stream.rstCode,
                });
            });
        });
        http2Stream.on('error', (err) => {
            /* We need an error handler here to stop "Uncaught Error" exceptions
             * from bubbling up. However, errors here should all correspond to
             * "close" events, where we will handle the error more granularly */
            /* Specifically looking for stream errors that were *not* constructed
             * from a RST_STREAM response here:
             * https://github.com/nodejs/node/blob/8b8620d580314050175983402dfddf2674e8e22a/lib/internal/http2/core.js#L2267
             */
            if (err.code !== 'ERR_HTTP2_STREAM_ERROR') {
                this.trace('Node error event: message=' +
                    err.message +
                    ' code=' +
                    err.code +
                    ' errno=' +
                    getSystemErrorName(err.errno) +
                    ' syscall=' +
                    err.syscall);
                this.internalError = err;
            }
            this.callEventTracker.onStreamEnd(false);
        });
    }
    onDisconnect() {
        this.endCall({
            code: constants_1.Status.UNAVAILABLE,
            details: 'Connection dropped',
            metadata: new metadata_1.Metadata(),
        });
    }
    outputStatus() {
        /* Precondition: this.finalStatus !== null */
        if (!this.statusOutput) {
            this.statusOutput = true;
            this.trace('ended with status: code=' +
                this.finalStatus.code +
                ' details="' +
                this.finalStatus.details +
                '"');
            this.callEventTracker.onCallEnd(this.finalStatus);
            /* We delay the actual action of bubbling up the status to insulate the
             * cleanup code in this class from any errors that may be thrown in the
             * upper layers as a result of bubbling up the status. In particular,
             * if the status is not OK, the "error" event may be emitted
             * synchronously at the top level, which will result in a thrown error if
             * the user does not handle that event. */
            process.nextTick(() => {
                this.listener.onReceiveStatus(this.finalStatus);
            });
            /* Leave the http2 stream in flowing state to drain incoming messages, to
             * ensure that the stream closure completes. The call stream already does
             * not push more messages after the status is output, so the messages go
             * nowhere either way. */
            this.http2Stream.resume();
        }
    }
    trace(text) {
        logging.trace(constants_2.LogVerbosity.DEBUG, TRACER_NAME, '[' + this.callId + '] ' + text);
    }
    /**
     * On first call, emits a 'status' event with the given StatusObject.
     * Subsequent calls are no-ops.
     * @param status The status of the call.
     */
    endCall(status) {
        /* If the status is OK and a new status comes in (e.g. from a
         * deserialization failure), that new status takes priority */
        if (this.finalStatus === null || this.finalStatus.code === constants_1.Status.OK) {
            this.finalStatus = status;
            this.maybeOutputStatus();
        }
        this.destroyHttp2Stream();
    }
    maybeOutputStatus() {
        if (this.finalStatus !== null) {
            /* The combination check of readsClosed and that the two message buffer
             * arrays are empty checks that there all incoming data has been fully
             * processed */
            if (this.finalStatus.code !== constants_1.Status.OK ||
                (this.readsClosed &&
                    this.unpushedReadMessages.length === 0 &&
                    !this.isReadFilterPending &&
                    !this.isPushPending)) {
                this.outputStatus();
            }
        }
    }
    push(message) {
        this.trace('pushing to reader message of length ' +
            (message instanceof Buffer ? message.length : null));
        this.canPush = false;
        this.isPushPending = true;
        process.nextTick(() => {
            this.isPushPending = false;
            /* If we have already output the status any later messages should be
             * ignored, and can cause out-of-order operation errors higher up in the
             * stack. Checking as late as possible here to avoid any race conditions.
             */
            if (this.statusOutput) {
                return;
            }
            this.listener.onReceiveMessage(message);
            this.maybeOutputStatus();
        });
    }
    tryPush(messageBytes) {
        if (this.canPush) {
            this.http2Stream.pause();
            this.push(messageBytes);
        }
        else {
            this.trace('unpushedReadMessages.push message of length ' + messageBytes.length);
            this.unpushedReadMessages.push(messageBytes);
        }
    }
    handleTrailers(headers) {
        this.callEventTracker.onStreamEnd(true);
        let headersString = '';
        for (const header of Object.keys(headers)) {
            headersString += '\t\t' + header + ': ' + headers[header] + '\n';
        }
        this.trace('Received server trailers:\n' + headersString);
        let metadata;
        try {
            metadata = metadata_1.Metadata.fromHttp2Headers(headers);
        }
        catch (e) {
            metadata = new metadata_1.Metadata();
        }
        const metadataMap = metadata.getMap();
        let code = this.mappedStatusCode;
        if (code === constants_1.Status.UNKNOWN &&
            typeof metadataMap['grpc-status'] === 'string') {
            const receivedStatus = Number(metadataMap['grpc-status']);
            if (receivedStatus in constants_1.Status) {
                code = receivedStatus;
                this.trace('received status code ' + receivedStatus + ' from server');
            }
            metadata.remove('grpc-status');
        }
        let details = '';
        if (typeof metadataMap['grpc-message'] === 'string') {
            try {
                details = decodeURI(metadataMap['grpc-message']);
            }
            catch (e) {
                details = metadataMap['grpc-message'];
            }
            metadata.remove('grpc-message');
            this.trace('received status details string "' + details + '" from server');
        }
        const status = { code, details, metadata };
        // This is a no-op if the call was already ended when handling headers.
        this.endCall(status);
    }
    destroyHttp2Stream() {
        var _a;
        // The http2 stream could already have been destroyed if cancelWithStatus
        // is called in response to an internal http2 error.
        if (!this.http2Stream.destroyed) {
            /* If the call has ended with an OK status, communicate that when closing
             * the stream, partly to avoid a situation in which we detect an error
             * RST_STREAM as a result after we have the status */
            let code;
            if (((_a = this.finalStatus) === null || _a === void 0 ? void 0 : _a.code) === constants_1.Status.OK) {
                code = http2.constants.NGHTTP2_NO_ERROR;
            }
            else {
                code = http2.constants.NGHTTP2_CANCEL;
            }
            this.trace('close http2 stream with code ' + code);
            this.http2Stream.close(code);
        }
    }
    cancelWithStatus(status, details) {
        this.trace('cancelWithStatus code: ' + status + ' details: "' + details + '"');
        this.endCall({ code: status, details, metadata: new metadata_1.Metadata() });
    }
    getStatus() {
        return this.finalStatus;
    }
    getPeer() {
        return this.transport.getPeerName();
    }
    getCallNumber() {
        return this.callId;
    }
    startRead() {
        /* If the stream has ended with an error, we should not emit any more
         * messages and we should communicate that the stream has ended */
        if (this.finalStatus !== null && this.finalStatus.code !== constants_1.Status.OK) {
            this.readsClosed = true;
            this.maybeOutputStatus();
            return;
        }
        this.canPush = true;
        if (this.unpushedReadMessages.length > 0) {
            const nextMessage = this.unpushedReadMessages.shift();
            this.push(nextMessage);
            return;
        }
        /* Only resume reading from the http2Stream if we don't have any pending
         * messages to emit */
        this.http2Stream.resume();
    }
    sendMessageWithContext(context, message) {
        this.trace('write() called with message of length ' + message.length);
        const cb = (error) => {
            /* nextTick here ensures that no stream action can be taken in the call
             * stack of the write callback, in order to hopefully work around
             * https://github.com/nodejs/node/issues/49147 */
            process.nextTick(() => {
                var _a;
                let code = constants_1.Status.UNAVAILABLE;
                if ((error === null || error === void 0 ? void 0 : error.code) ===
                    'ERR_STREAM_WRITE_AFTER_END') {
                    code = constants_1.Status.INTERNAL;
                }
                if (error) {
                    this.cancelWithStatus(code, `Write error: ${error.message}`);
                }
                (_a = context.callback) === null || _a === void 0 ? void 0 : _a.call(context);
            });
        };
        this.trace('sending data chunk of length ' + message.length);
        this.callEventTracker.addMessageSent();
        try {
            this.http2Stream.write(message, cb);
        }
        catch (error) {
            this.endCall({
                code: constants_1.Status.UNAVAILABLE,
                details: `Write failed with error ${error.message}`,
                metadata: new metadata_1.Metadata(),
            });
        }
    }
    halfClose() {
        this.trace('end() called');
        this.trace('calling end() on HTTP/2 stream');
        this.http2Stream.end();
    }
}
exports.Http2SubchannelCall = Http2SubchannelCall;
//# sourceMappingURL=subchannel-call.js.map