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
exports.Server = void 0;
const http2 = require("http2");
const constants_1 = require("./constants");
const server_call_1 = require("./server-call");
const server_credentials_1 = require("./server-credentials");
const resolver_1 = require("./resolver");
const logging = require("./logging");
const subchannel_address_1 = require("./subchannel-address");
const uri_parser_1 = require("./uri-parser");
const channelz_1 = require("./channelz");
const UNLIMITED_CONNECTION_AGE_MS = ~(1 << 31);
const KEEPALIVE_MAX_TIME_MS = ~(1 << 31);
const KEEPALIVE_TIMEOUT_MS = 20000;
const { HTTP2_HEADER_PATH } = http2.constants;
const TRACER_NAME = 'server';
function noop() { }
function getUnimplementedStatusResponse(methodName) {
    return {
        code: constants_1.Status.UNIMPLEMENTED,
        details: `The server does not implement the method ${methodName}`,
    };
}
function getDefaultHandler(handlerType, methodName) {
    const unimplementedStatusResponse = getUnimplementedStatusResponse(methodName);
    switch (handlerType) {
        case 'unary':
            return (call, callback) => {
                callback(unimplementedStatusResponse, null);
            };
        case 'clientStream':
            return (call, callback) => {
                callback(unimplementedStatusResponse, null);
            };
        case 'serverStream':
            return (call) => {
                call.emit('error', unimplementedStatusResponse);
            };
        case 'bidi':
            return (call) => {
                call.emit('error', unimplementedStatusResponse);
            };
        default:
            throw new Error(`Invalid handlerType ${handlerType}`);
    }
}
class Server {
    constructor(options) {
        var _a, _b, _c, _d;
        this.http2ServerList = [];
        this.handlers = new Map();
        this.sessions = new Map();
        this.started = false;
        this.shutdown = false;
        this.serverAddressString = 'null';
        // Channelz Info
        this.channelzEnabled = true;
        this.channelzTrace = new channelz_1.ChannelzTrace();
        this.callTracker = new channelz_1.ChannelzCallTracker();
        this.listenerChildrenTracker = new channelz_1.ChannelzChildrenTracker();
        this.sessionChildrenTracker = new channelz_1.ChannelzChildrenTracker();
        this.options = options !== null && options !== void 0 ? options : {};
        if (this.options['grpc.enable_channelz'] === 0) {
            this.channelzEnabled = false;
        }
        this.channelzRef = (0, channelz_1.registerChannelzServer)(() => this.getChannelzInfo(), this.channelzEnabled);
        if (this.channelzEnabled) {
            this.channelzTrace.addTrace('CT_INFO', 'Server created');
        }
        this.maxConnectionAgeMs =
            (_a = this.options['grpc.max_connection_age_ms']) !== null && _a !== void 0 ? _a : UNLIMITED_CONNECTION_AGE_MS;
        this.maxConnectionAgeGraceMs =
            (_b = this.options['grpc.max_connection_age_grace_ms']) !== null && _b !== void 0 ? _b : UNLIMITED_CONNECTION_AGE_MS;
        this.keepaliveTimeMs =
            (_c = this.options['grpc.keepalive_time_ms']) !== null && _c !== void 0 ? _c : KEEPALIVE_MAX_TIME_MS;
        this.keepaliveTimeoutMs =
            (_d = this.options['grpc.keepalive_timeout_ms']) !== null && _d !== void 0 ? _d : KEEPALIVE_TIMEOUT_MS;
        this.trace('Server constructed');
    }
    getChannelzInfo() {
        return {
            trace: this.channelzTrace,
            callTracker: this.callTracker,
            listenerChildren: this.listenerChildrenTracker.getChildLists(),
            sessionChildren: this.sessionChildrenTracker.getChildLists(),
        };
    }
    getChannelzSessionInfoGetter(session) {
        return () => {
            var _a, _b, _c;
            const sessionInfo = this.sessions.get(session);
            const sessionSocket = session.socket;
            const remoteAddress = sessionSocket.remoteAddress
                ? (0, subchannel_address_1.stringToSubchannelAddress)(sessionSocket.remoteAddress, sessionSocket.remotePort)
                : null;
            const localAddress = sessionSocket.localAddress
                ? (0, subchannel_address_1.stringToSubchannelAddress)(sessionSocket.localAddress, sessionSocket.localPort)
                : null;
            let tlsInfo;
            if (session.encrypted) {
                const tlsSocket = sessionSocket;
                const cipherInfo = tlsSocket.getCipher();
                const certificate = tlsSocket.getCertificate();
                const peerCertificate = tlsSocket.getPeerCertificate();
                tlsInfo = {
                    cipherSuiteStandardName: (_a = cipherInfo.standardName) !== null && _a !== void 0 ? _a : null,
                    cipherSuiteOtherName: cipherInfo.standardName
                        ? null
                        : cipherInfo.name,
                    localCertificate: certificate && 'raw' in certificate ? certificate.raw : null,
                    remoteCertificate: peerCertificate && 'raw' in peerCertificate
                        ? peerCertificate.raw
                        : null,
                };
            }
            else {
                tlsInfo = null;
            }
            const socketInfo = {
                remoteAddress: remoteAddress,
                localAddress: localAddress,
                security: tlsInfo,
                remoteName: null,
                streamsStarted: sessionInfo.streamTracker.callsStarted,
                streamsSucceeded: sessionInfo.streamTracker.callsSucceeded,
                streamsFailed: sessionInfo.streamTracker.callsFailed,
                messagesSent: sessionInfo.messagesSent,
                messagesReceived: sessionInfo.messagesReceived,
                keepAlivesSent: 0,
                lastLocalStreamCreatedTimestamp: null,
                lastRemoteStreamCreatedTimestamp: sessionInfo.streamTracker.lastCallStartedTimestamp,
                lastMessageSentTimestamp: sessionInfo.lastMessageSentTimestamp,
                lastMessageReceivedTimestamp: sessionInfo.lastMessageReceivedTimestamp,
                localFlowControlWindow: (_b = session.state.localWindowSize) !== null && _b !== void 0 ? _b : null,
                remoteFlowControlWindow: (_c = session.state.remoteWindowSize) !== null && _c !== void 0 ? _c : null,
            };
            return socketInfo;
        };
    }
    trace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, '(' + this.channelzRef.id + ') ' + text);
    }
    addProtoService() {
        throw new Error('Not implemented. Use addService() instead');
    }
    addService(service, implementation) {
        if (service === null ||
            typeof service !== 'object' ||
            implementation === null ||
            typeof implementation !== 'object') {
            throw new Error('addService() requires two objects as arguments');
        }
        const serviceKeys = Object.keys(service);
        if (serviceKeys.length === 0) {
            throw new Error('Cannot add an empty service to a server');
        }
        serviceKeys.forEach(name => {
            const attrs = service[name];
            let methodType;
            if (attrs.requestStream) {
                if (attrs.responseStream) {
                    methodType = 'bidi';
                }
                else {
                    methodType = 'clientStream';
                }
            }
            else {
                if (attrs.responseStream) {
                    methodType = 'serverStream';
                }
                else {
                    methodType = 'unary';
                }
            }
            let implFn = implementation[name];
            let impl;
            if (implFn === undefined && typeof attrs.originalName === 'string') {
                implFn = implementation[attrs.originalName];
            }
            if (implFn !== undefined) {
                impl = implFn.bind(implementation);
            }
            else {
                impl = getDefaultHandler(methodType, name);
            }
            const success = this.register(attrs.path, impl, attrs.responseSerialize, attrs.requestDeserialize, methodType);
            if (success === false) {
                throw new Error(`Method handler for ${attrs.path} already provided.`);
            }
        });
    }
    removeService(service) {
        if (service === null || typeof service !== 'object') {
            throw new Error('removeService() requires object as argument');
        }
        const serviceKeys = Object.keys(service);
        serviceKeys.forEach(name => {
            const attrs = service[name];
            this.unregister(attrs.path);
        });
    }
    bind(port, creds) {
        throw new Error('Not implemented. Use bindAsync() instead');
    }
    bindAsync(port, creds, callback) {
        if (this.started === true) {
            throw new Error('server is already started');
        }
        if (this.shutdown) {
            throw new Error('bindAsync called after shutdown');
        }
        if (typeof port !== 'string') {
            throw new TypeError('port must be a string');
        }
        if (creds === null || !(creds instanceof server_credentials_1.ServerCredentials)) {
            throw new TypeError('creds must be a ServerCredentials object');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }
        const initialPortUri = (0, uri_parser_1.parseUri)(port);
        if (initialPortUri === null) {
            throw new Error(`Could not parse port "${port}"`);
        }
        const portUri = (0, resolver_1.mapUriDefaultScheme)(initialPortUri);
        if (portUri === null) {
            throw new Error(`Could not get a default scheme for port "${port}"`);
        }
        const serverOptions = {
            maxSendHeaderBlockLength: Number.MAX_SAFE_INTEGER,
        };
        if ('grpc-node.max_session_memory' in this.options) {
            serverOptions.maxSessionMemory =
                this.options['grpc-node.max_session_memory'];
        }
        else {
            /* By default, set a very large max session memory limit, to effectively
             * disable enforcement of the limit. Some testing indicates that Node's
             * behavior degrades badly when this limit is reached, so we solve that
             * by disabling the check entirely. */
            serverOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
        }
        if ('grpc.max_concurrent_streams' in this.options) {
            serverOptions.settings = {
                maxConcurrentStreams: this.options['grpc.max_concurrent_streams'],
            };
        }
        const deferredCallback = (error, port) => {
            process.nextTick(() => callback(error, port));
        };
        const setupServer = () => {
            let http2Server;
            if (creds._isSecure()) {
                const secureServerOptions = Object.assign(serverOptions, creds._getSettings());
                secureServerOptions.enableTrace =
                    this.options['grpc-node.tls_enable_trace'] === 1;
                http2Server = http2.createSecureServer(secureServerOptions);
                http2Server.on('secureConnection', (socket) => {
                    /* These errors need to be handled by the user of Http2SecureServer,
                     * according to https://github.com/nodejs/node/issues/35824 */
                    socket.on('error', (e) => {
                        this.trace('An incoming TLS connection closed with error: ' + e.message);
                    });
                });
            }
            else {
                http2Server = http2.createServer(serverOptions);
            }
            http2Server.setTimeout(0, noop);
            this._setupHandlers(http2Server);
            return http2Server;
        };
        const bindSpecificPort = (addressList, portNum, previousCount) => {
            if (addressList.length === 0) {
                return Promise.resolve({ port: portNum, count: previousCount });
            }
            return Promise.all(addressList.map(address => {
                this.trace('Attempting to bind ' + (0, subchannel_address_1.subchannelAddressToString)(address));
                let addr;
                if ((0, subchannel_address_1.isTcpSubchannelAddress)(address)) {
                    addr = {
                        host: address.host,
                        port: portNum,
                    };
                }
                else {
                    addr = address;
                }
                const http2Server = setupServer();
                return new Promise((resolve, reject) => {
                    const onError = (err) => {
                        this.trace('Failed to bind ' +
                            (0, subchannel_address_1.subchannelAddressToString)(address) +
                            ' with error ' +
                            err.message);
                        resolve(err);
                    };
                    http2Server.once('error', onError);
                    http2Server.listen(addr, () => {
                        if (this.shutdown) {
                            http2Server.close();
                            resolve(new Error('bindAsync failed because server is shutdown'));
                            return;
                        }
                        const boundAddress = http2Server.address();
                        let boundSubchannelAddress;
                        if (typeof boundAddress === 'string') {
                            boundSubchannelAddress = {
                                path: boundAddress,
                            };
                        }
                        else {
                            boundSubchannelAddress = {
                                host: boundAddress.address,
                                port: boundAddress.port,
                            };
                        }
                        const channelzRef = (0, channelz_1.registerChannelzSocket)((0, subchannel_address_1.subchannelAddressToString)(boundSubchannelAddress), () => {
                            return {
                                localAddress: boundSubchannelAddress,
                                remoteAddress: null,
                                security: null,
                                remoteName: null,
                                streamsStarted: 0,
                                streamsSucceeded: 0,
                                streamsFailed: 0,
                                messagesSent: 0,
                                messagesReceived: 0,
                                keepAlivesSent: 0,
                                lastLocalStreamCreatedTimestamp: null,
                                lastRemoteStreamCreatedTimestamp: null,
                                lastMessageSentTimestamp: null,
                                lastMessageReceivedTimestamp: null,
                                localFlowControlWindow: null,
                                remoteFlowControlWindow: null,
                            };
                        }, this.channelzEnabled);
                        if (this.channelzEnabled) {
                            this.listenerChildrenTracker.refChild(channelzRef);
                        }
                        this.http2ServerList.push({
                            server: http2Server,
                            channelzRef: channelzRef,
                        });
                        this.trace('Successfully bound ' +
                            (0, subchannel_address_1.subchannelAddressToString)(boundSubchannelAddress));
                        resolve('port' in boundSubchannelAddress
                            ? boundSubchannelAddress.port
                            : portNum);
                        http2Server.removeListener('error', onError);
                    });
                });
            })).then(results => {
                let count = 0;
                for (const result of results) {
                    if (typeof result === 'number') {
                        count += 1;
                        if (result !== portNum) {
                            throw new Error('Invalid state: multiple port numbers added from single address');
                        }
                    }
                }
                return {
                    port: portNum,
                    count: count + previousCount,
                };
            });
        };
        const bindWildcardPort = (addressList) => {
            if (addressList.length === 0) {
                return Promise.resolve({ port: 0, count: 0 });
            }
            const address = addressList[0];
            const http2Server = setupServer();
            return new Promise((resolve, reject) => {
                const onError = (err) => {
                    this.trace('Failed to bind ' +
                        (0, subchannel_address_1.subchannelAddressToString)(address) +
                        ' with error ' +
                        err.message);
                    resolve(bindWildcardPort(addressList.slice(1)));
                };
                http2Server.once('error', onError);
                http2Server.listen(address, () => {
                    if (this.shutdown) {
                        http2Server.close();
                        resolve({ port: 0, count: 0 });
                        return;
                    }
                    const boundAddress = http2Server.address();
                    const boundSubchannelAddress = {
                        host: boundAddress.address,
                        port: boundAddress.port,
                    };
                    const channelzRef = (0, channelz_1.registerChannelzSocket)((0, subchannel_address_1.subchannelAddressToString)(boundSubchannelAddress), () => {
                        return {
                            localAddress: boundSubchannelAddress,
                            remoteAddress: null,
                            security: null,
                            remoteName: null,
                            streamsStarted: 0,
                            streamsSucceeded: 0,
                            streamsFailed: 0,
                            messagesSent: 0,
                            messagesReceived: 0,
                            keepAlivesSent: 0,
                            lastLocalStreamCreatedTimestamp: null,
                            lastRemoteStreamCreatedTimestamp: null,
                            lastMessageSentTimestamp: null,
                            lastMessageReceivedTimestamp: null,
                            localFlowControlWindow: null,
                            remoteFlowControlWindow: null,
                        };
                    }, this.channelzEnabled);
                    if (this.channelzEnabled) {
                        this.listenerChildrenTracker.refChild(channelzRef);
                    }
                    this.http2ServerList.push({
                        server: http2Server,
                        channelzRef: channelzRef,
                    });
                    this.trace('Successfully bound ' +
                        (0, subchannel_address_1.subchannelAddressToString)(boundSubchannelAddress));
                    resolve(bindSpecificPort(addressList.slice(1), boundAddress.port, 1));
                    http2Server.removeListener('error', onError);
                });
            });
        };
        const resolverListener = {
            onSuccessfulResolution: (addressList, serviceConfig, serviceConfigError) => {
                // We only want one resolution result. Discard all future results
                resolverListener.onSuccessfulResolution = () => { };
                if (this.shutdown) {
                    deferredCallback(new Error(`bindAsync failed because server is shutdown`), 0);
                }
                if (addressList.length === 0) {
                    deferredCallback(new Error(`No addresses resolved for port ${port}`), 0);
                    return;
                }
                let bindResultPromise;
                if ((0, subchannel_address_1.isTcpSubchannelAddress)(addressList[0])) {
                    if (addressList[0].port === 0) {
                        bindResultPromise = bindWildcardPort(addressList);
                    }
                    else {
                        bindResultPromise = bindSpecificPort(addressList, addressList[0].port, 0);
                    }
                }
                else {
                    // Use an arbitrary non-zero port for non-TCP addresses
                    bindResultPromise = bindSpecificPort(addressList, 1, 0);
                }
                bindResultPromise.then(bindResult => {
                    if (bindResult.count === 0) {
                        const errorString = `No address added out of total ${addressList.length} resolved`;
                        logging.log(constants_1.LogVerbosity.ERROR, errorString);
                        deferredCallback(new Error(errorString), 0);
                    }
                    else {
                        if (bindResult.count < addressList.length) {
                            logging.log(constants_1.LogVerbosity.INFO, `WARNING Only ${bindResult.count} addresses added out of total ${addressList.length} resolved`);
                        }
                        deferredCallback(null, bindResult.port);
                    }
                }, error => {
                    const errorString = `No address added out of total ${addressList.length} resolved`;
                    logging.log(constants_1.LogVerbosity.ERROR, errorString);
                    deferredCallback(new Error(errorString), 0);
                });
            },
            onError: error => {
                deferredCallback(new Error(error.details), 0);
            },
        };
        const resolver = (0, resolver_1.createResolver)(portUri, resolverListener, this.options);
        resolver.updateResolution();
    }
    forceShutdown() {
        // Close the server if it is still running.
        for (const { server: http2Server, channelzRef: ref } of this
            .http2ServerList) {
            if (http2Server.listening) {
                http2Server.close(() => {
                    if (this.channelzEnabled) {
                        this.listenerChildrenTracker.unrefChild(ref);
                        (0, channelz_1.unregisterChannelzRef)(ref);
                    }
                });
            }
        }
        this.started = false;
        this.shutdown = true;
        // Always destroy any available sessions. It's possible that one or more
        // tryShutdown() calls are in progress. Don't wait on them to finish.
        this.sessions.forEach((channelzInfo, session) => {
            // Cast NGHTTP2_CANCEL to any because TypeScript doesn't seem to
            // recognize destroy(code) as a valid signature.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            session.destroy(http2.constants.NGHTTP2_CANCEL);
        });
        this.sessions.clear();
        if (this.channelzEnabled) {
            (0, channelz_1.unregisterChannelzRef)(this.channelzRef);
        }
    }
    register(name, handler, serialize, deserialize, type) {
        if (this.handlers.has(name)) {
            return false;
        }
        this.handlers.set(name, {
            func: handler,
            serialize,
            deserialize,
            type,
            path: name,
        });
        return true;
    }
    unregister(name) {
        return this.handlers.delete(name);
    }
    start() {
        if (this.http2ServerList.length === 0 ||
            this.http2ServerList.every(({ server: http2Server }) => http2Server.listening !== true)) {
            throw new Error('server must be bound in order to start');
        }
        if (this.started === true) {
            throw new Error('server is already started');
        }
        if (this.channelzEnabled) {
            this.channelzTrace.addTrace('CT_INFO', 'Starting');
        }
        this.started = true;
    }
    tryShutdown(callback) {
        const wrappedCallback = (error) => {
            if (this.channelzEnabled) {
                (0, channelz_1.unregisterChannelzRef)(this.channelzRef);
            }
            callback(error);
        };
        let pendingChecks = 0;
        function maybeCallback() {
            pendingChecks--;
            if (pendingChecks === 0) {
                wrappedCallback();
            }
        }
        // Close the server if necessary.
        this.started = false;
        this.shutdown = true;
        for (const { server: http2Server, channelzRef: ref } of this
            .http2ServerList) {
            if (http2Server.listening) {
                pendingChecks++;
                http2Server.close(() => {
                    if (this.channelzEnabled) {
                        this.listenerChildrenTracker.unrefChild(ref);
                        (0, channelz_1.unregisterChannelzRef)(ref);
                    }
                    maybeCallback();
                });
            }
        }
        this.sessions.forEach((channelzInfo, session) => {
            if (!session.closed) {
                pendingChecks += 1;
                session.close(maybeCallback);
            }
        });
        if (pendingChecks === 0) {
            wrappedCallback();
        }
    }
    addHttp2Port() {
        throw new Error('Not yet implemented');
    }
    /**
     * Get the channelz reference object for this server. The returned value is
     * garbage if channelz is disabled for this server.
     * @returns
     */
    getChannelzRef() {
        return this.channelzRef;
    }
    _verifyContentType(stream, headers) {
        const contentType = headers[http2.constants.HTTP2_HEADER_CONTENT_TYPE];
        if (typeof contentType !== 'string' ||
            !contentType.startsWith('application/grpc')) {
            stream.respond({
                [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE,
            }, { endStream: true });
            return false;
        }
        return true;
    }
    _retrieveHandler(path) {
        this.trace('Received call to method ' +
            path +
            ' at address ' +
            this.serverAddressString);
        const handler = this.handlers.get(path);
        if (handler === undefined) {
            this.trace('No handler registered for method ' +
                path +
                '. Sending UNIMPLEMENTED status.');
            return null;
        }
        return handler;
    }
    _respondWithError(err, stream, channelzSessionInfo = null) {
        const call = new server_call_1.Http2ServerCallStream(stream, null, this.options);
        if (err.code === undefined) {
            err.code = constants_1.Status.INTERNAL;
        }
        if (this.channelzEnabled) {
            this.callTracker.addCallFailed();
            channelzSessionInfo === null || channelzSessionInfo === void 0 ? void 0 : channelzSessionInfo.streamTracker.addCallFailed();
        }
        call.sendError(err);
    }
    _channelzHandler(stream, headers) {
        const channelzSessionInfo = this.sessions.get(stream.session);
        this.callTracker.addCallStarted();
        channelzSessionInfo === null || channelzSessionInfo === void 0 ? void 0 : channelzSessionInfo.streamTracker.addCallStarted();
        if (!this._verifyContentType(stream, headers)) {
            this.callTracker.addCallFailed();
            channelzSessionInfo === null || channelzSessionInfo === void 0 ? void 0 : channelzSessionInfo.streamTracker.addCallFailed();
            return;
        }
        const path = headers[HTTP2_HEADER_PATH];
        const handler = this._retrieveHandler(path);
        if (!handler) {
            this._respondWithError(getUnimplementedStatusResponse(path), stream, channelzSessionInfo);
            return;
        }
        const call = new server_call_1.Http2ServerCallStream(stream, handler, this.options);
        call.once('callEnd', (code) => {
            if (code === constants_1.Status.OK) {
                this.callTracker.addCallSucceeded();
            }
            else {
                this.callTracker.addCallFailed();
            }
        });
        if (channelzSessionInfo) {
            call.once('streamEnd', (success) => {
                if (success) {
                    channelzSessionInfo.streamTracker.addCallSucceeded();
                }
                else {
                    channelzSessionInfo.streamTracker.addCallFailed();
                }
            });
            call.on('sendMessage', () => {
                channelzSessionInfo.messagesSent += 1;
                channelzSessionInfo.lastMessageSentTimestamp = new Date();
            });
            call.on('receiveMessage', () => {
                channelzSessionInfo.messagesReceived += 1;
                channelzSessionInfo.lastMessageReceivedTimestamp = new Date();
            });
        }
        if (!this._runHandlerForCall(call, handler, headers)) {
            this.callTracker.addCallFailed();
            channelzSessionInfo === null || channelzSessionInfo === void 0 ? void 0 : channelzSessionInfo.streamTracker.addCallFailed();
            call.sendError({
                code: constants_1.Status.INTERNAL,
                details: `Unknown handler type: ${handler.type}`,
            });
        }
    }
    _streamHandler(stream, headers) {
        if (this._verifyContentType(stream, headers) !== true) {
            return;
        }
        const path = headers[HTTP2_HEADER_PATH];
        const handler = this._retrieveHandler(path);
        if (!handler) {
            this._respondWithError(getUnimplementedStatusResponse(path), stream, null);
            return;
        }
        const call = new server_call_1.Http2ServerCallStream(stream, handler, this.options);
        if (!this._runHandlerForCall(call, handler, headers)) {
            call.sendError({
                code: constants_1.Status.INTERNAL,
                details: `Unknown handler type: ${handler.type}`,
            });
        }
    }
    _runHandlerForCall(call, handler, headers) {
        var _a;
        const metadata = call.receiveMetadata(headers);
        const encoding = (_a = metadata.get('grpc-encoding')[0]) !== null && _a !== void 0 ? _a : 'identity';
        metadata.remove('grpc-encoding');
        const { type } = handler;
        if (type === 'unary') {
            handleUnary(call, handler, metadata, encoding);
        }
        else if (type === 'clientStream') {
            handleClientStreaming(call, handler, metadata, encoding);
        }
        else if (type === 'serverStream') {
            handleServerStreaming(call, handler, metadata, encoding);
        }
        else if (type === 'bidi') {
            handleBidiStreaming(call, handler, metadata, encoding);
        }
        else {
            return false;
        }
        return true;
    }
    _setupHandlers(http2Server) {
        if (http2Server === null) {
            return;
        }
        const serverAddress = http2Server.address();
        let serverAddressString = 'null';
        if (serverAddress) {
            if (typeof serverAddress === 'string') {
                serverAddressString = serverAddress;
            }
            else {
                serverAddressString = serverAddress.address + ':' + serverAddress.port;
            }
        }
        this.serverAddressString = serverAddressString;
        const handler = this.channelzEnabled
            ? this._channelzHandler
            : this._streamHandler;
        http2Server.on('stream', handler.bind(this));
        http2Server.on('session', session => {
            var _a, _b, _c, _d, _e;
            if (!this.started) {
                session.destroy();
                return;
            }
            const channelzRef = (0, channelz_1.registerChannelzSocket)((_a = session.socket.remoteAddress) !== null && _a !== void 0 ? _a : 'unknown', this.getChannelzSessionInfoGetter(session), this.channelzEnabled);
            const channelzSessionInfo = {
                ref: channelzRef,
                streamTracker: new channelz_1.ChannelzCallTracker(),
                messagesSent: 0,
                messagesReceived: 0,
                lastMessageSentTimestamp: null,
                lastMessageReceivedTimestamp: null,
            };
            this.sessions.set(session, channelzSessionInfo);
            const clientAddress = session.socket.remoteAddress;
            if (this.channelzEnabled) {
                this.channelzTrace.addTrace('CT_INFO', 'Connection established by client ' + clientAddress);
                this.sessionChildrenTracker.refChild(channelzRef);
            }
            let connectionAgeTimer = null;
            let connectionAgeGraceTimer = null;
            let sessionClosedByServer = false;
            if (this.maxConnectionAgeMs !== UNLIMITED_CONNECTION_AGE_MS) {
                // Apply a random jitter within a +/-10% range
                const jitterMagnitude = this.maxConnectionAgeMs / 10;
                const jitter = Math.random() * jitterMagnitude * 2 - jitterMagnitude;
                connectionAgeTimer = (_c = (_b = setTimeout(() => {
                    var _a, _b;
                    sessionClosedByServer = true;
                    if (this.channelzEnabled) {
                        this.channelzTrace.addTrace('CT_INFO', 'Connection dropped by max connection age from ' + clientAddress);
                    }
                    try {
                        session.goaway(http2.constants.NGHTTP2_NO_ERROR, ~(1 << 31), Buffer.from('max_age'));
                    }
                    catch (e) {
                        // The goaway can't be sent because the session is already closed
                        session.destroy();
                        return;
                    }
                    session.close();
                    /* Allow a grace period after sending the GOAWAY before forcibly
                     * closing the connection. */
                    if (this.maxConnectionAgeGraceMs !== UNLIMITED_CONNECTION_AGE_MS) {
                        connectionAgeGraceTimer = (_b = (_a = setTimeout(() => {
                            session.destroy();
                        }, this.maxConnectionAgeGraceMs)).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
                    }
                }, this.maxConnectionAgeMs + jitter)).unref) === null || _c === void 0 ? void 0 : _c.call(_b);
            }
            const keeapliveTimeTimer = (_e = (_d = setInterval(() => {
                var _a, _b;
                const timeoutTImer = (_b = (_a = setTimeout(() => {
                    sessionClosedByServer = true;
                    if (this.channelzEnabled) {
                        this.channelzTrace.addTrace('CT_INFO', 'Connection dropped by keepalive timeout from ' + clientAddress);
                    }
                    session.close();
                }, this.keepaliveTimeoutMs)).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
                try {
                    session.ping((err, duration, payload) => {
                        clearTimeout(timeoutTImer);
                    });
                }
                catch (e) {
                    // The ping can't be sent because the session is already closed
                    session.destroy();
                }
            }, this.keepaliveTimeMs)).unref) === null || _e === void 0 ? void 0 : _e.call(_d);
            session.on('close', () => {
                if (this.channelzEnabled) {
                    if (!sessionClosedByServer) {
                        this.channelzTrace.addTrace('CT_INFO', 'Connection dropped by client ' + clientAddress);
                    }
                    this.sessionChildrenTracker.unrefChild(channelzRef);
                    (0, channelz_1.unregisterChannelzRef)(channelzRef);
                }
                if (connectionAgeTimer) {
                    clearTimeout(connectionAgeTimer);
                }
                if (connectionAgeGraceTimer) {
                    clearTimeout(connectionAgeGraceTimer);
                }
                if (keeapliveTimeTimer) {
                    clearTimeout(keeapliveTimeTimer);
                }
                this.sessions.delete(session);
            });
        });
    }
}
exports.Server = Server;
async function handleUnary(call, handler, metadata, encoding) {
    try {
        const request = await call.receiveUnaryMessage(encoding);
        if (request === undefined || call.cancelled) {
            return;
        }
        const emitter = new server_call_1.ServerUnaryCallImpl(call, metadata, request);
        handler.func(emitter, (err, value, trailer, flags) => {
            call.sendUnaryMessage(err, value, trailer, flags);
        });
    }
    catch (err) {
        call.sendError(err);
    }
}
function handleClientStreaming(call, handler, metadata, encoding) {
    const stream = new server_call_1.ServerReadableStreamImpl(call, metadata, handler.deserialize, encoding);
    function respond(err, value, trailer, flags) {
        stream.destroy();
        call.sendUnaryMessage(err, value, trailer, flags);
    }
    if (call.cancelled) {
        return;
    }
    stream.on('error', respond);
    handler.func(stream, respond);
}
async function handleServerStreaming(call, handler, metadata, encoding) {
    try {
        const request = await call.receiveUnaryMessage(encoding);
        if (request === undefined || call.cancelled) {
            return;
        }
        const stream = new server_call_1.ServerWritableStreamImpl(call, metadata, handler.serialize, request);
        handler.func(stream);
    }
    catch (err) {
        call.sendError(err);
    }
}
function handleBidiStreaming(call, handler, metadata, encoding) {
    const stream = new server_call_1.ServerDuplexStreamImpl(call, metadata, handler.serialize, handler.deserialize, encoding);
    if (call.cancelled) {
        return;
    }
    handler.func(stream);
}
//# sourceMappingURL=server.js.map