"use strict";
/*
 * Copyright 2023 gRPC authors.
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
exports.Http2SubchannelConnector = void 0;
const http2 = require("http2");
const tls_1 = require("tls");
const channelz_1 = require("./channelz");
const constants_1 = require("./constants");
const http_proxy_1 = require("./http_proxy");
const logging = require("./logging");
const resolver_1 = require("./resolver");
const subchannel_address_1 = require("./subchannel-address");
const uri_parser_1 = require("./uri-parser");
const net = require("net");
const subchannel_call_1 = require("./subchannel-call");
const call_number_1 = require("./call-number");
const TRACER_NAME = 'transport';
const FLOW_CONTROL_TRACER_NAME = 'transport_flowctrl';
const clientVersion = require('../../package.json').version;
const { HTTP2_HEADER_AUTHORITY, HTTP2_HEADER_CONTENT_TYPE, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_TE, HTTP2_HEADER_USER_AGENT, } = http2.constants;
const KEEPALIVE_TIMEOUT_MS = 20000;
const tooManyPingsData = Buffer.from('too_many_pings', 'ascii');
class Http2Transport {
    constructor(session, subchannelAddress, options, 
    /**
     * Name of the remote server, if it is not the same as the subchannel
     * address, i.e. if connecting through an HTTP CONNECT proxy.
     */
    remoteName) {
        this.session = session;
        this.remoteName = remoteName;
        /**
         * The amount of time in between sending pings
         */
        this.keepaliveTimeMs = -1;
        /**
         * The amount of time to wait for an acknowledgement after sending a ping
         */
        this.keepaliveTimeoutMs = KEEPALIVE_TIMEOUT_MS;
        /**
         * Timer reference for timeout that indicates when to send the next ping
         */
        this.keepaliveTimerId = null;
        /**
         * Indicates that the keepalive timer ran out while there were no active
         * calls, and a ping should be sent the next time a call starts.
         */
        this.pendingSendKeepalivePing = false;
        /**
         * Timer reference tracking when the most recent ping will be considered lost
         */
        this.keepaliveTimeoutId = null;
        /**
         * Indicates whether keepalive pings should be sent without any active calls
         */
        this.keepaliveWithoutCalls = false;
        this.activeCalls = new Set();
        this.disconnectListeners = [];
        this.disconnectHandled = false;
        this.channelzEnabled = true;
        this.streamTracker = new channelz_1.ChannelzCallTracker();
        this.keepalivesSent = 0;
        this.messagesSent = 0;
        this.messagesReceived = 0;
        this.lastMessageSentTimestamp = null;
        this.lastMessageReceivedTimestamp = null;
        /* Populate subchannelAddressString and channelzRef before doing anything
         * else, because they are used in the trace methods. */
        this.subchannelAddressString = (0, subchannel_address_1.subchannelAddressToString)(subchannelAddress);
        if (options['grpc.enable_channelz'] === 0) {
            this.channelzEnabled = false;
        }
        this.channelzRef = (0, channelz_1.registerChannelzSocket)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled);
        // Build user-agent string.
        this.userAgent = [
            options['grpc.primary_user_agent'],
            `grpc-node-js/${clientVersion}`,
            options['grpc.secondary_user_agent'],
        ]
            .filter(e => e)
            .join(' '); // remove falsey values first
        if ('grpc.keepalive_time_ms' in options) {
            this.keepaliveTimeMs = options['grpc.keepalive_time_ms'];
        }
        if ('grpc.keepalive_timeout_ms' in options) {
            this.keepaliveTimeoutMs = options['grpc.keepalive_timeout_ms'];
        }
        if ('grpc.keepalive_permit_without_calls' in options) {
            this.keepaliveWithoutCalls =
                options['grpc.keepalive_permit_without_calls'] === 1;
        }
        else {
            this.keepaliveWithoutCalls = false;
        }
        session.once('close', () => {
            this.trace('session closed');
            this.stopKeepalivePings();
            this.handleDisconnect();
        });
        session.once('goaway', (errorCode, lastStreamID, opaqueData) => {
            let tooManyPings = false;
            /* See the last paragraph of
             * https://github.com/grpc/proposal/blob/master/A8-client-side-keepalive.md#basic-keepalive */
            if (errorCode === http2.constants.NGHTTP2_ENHANCE_YOUR_CALM &&
                opaqueData &&
                opaqueData.equals(tooManyPingsData)) {
                tooManyPings = true;
            }
            this.trace('connection closed by GOAWAY with code ' + errorCode + ' and data ' + (opaqueData === null || opaqueData === void 0 ? void 0 : opaqueData.toString()));
            this.reportDisconnectToOwner(tooManyPings);
        });
        session.once('error', error => {
            /* Do nothing here. Any error should also trigger a close event, which is
             * where we want to handle that.  */
            this.trace('connection closed with error ' + error.message);
        });
        if (logging.isTracerEnabled(TRACER_NAME)) {
            session.on('remoteSettings', (settings) => {
                this.trace('new settings received' +
                    (this.session !== session ? ' on the old connection' : '') +
                    ': ' +
                    JSON.stringify(settings));
            });
            session.on('localSettings', (settings) => {
                this.trace('local settings acknowledged by remote' +
                    (this.session !== session ? ' on the old connection' : '') +
                    ': ' +
                    JSON.stringify(settings));
            });
        }
        /* Start the keepalive timer last, because this can trigger trace logs,
         * which should only happen after everything else is set up. */
        if (this.keepaliveWithoutCalls) {
            this.maybeStartKeepalivePingTimer();
        }
    }
    getChannelzInfo() {
        var _a, _b, _c;
        const sessionSocket = this.session.socket;
        const remoteAddress = sessionSocket.remoteAddress
            ? (0, subchannel_address_1.stringToSubchannelAddress)(sessionSocket.remoteAddress, sessionSocket.remotePort)
            : null;
        const localAddress = sessionSocket.localAddress
            ? (0, subchannel_address_1.stringToSubchannelAddress)(sessionSocket.localAddress, sessionSocket.localPort)
            : null;
        let tlsInfo;
        if (this.session.encrypted) {
            const tlsSocket = sessionSocket;
            const cipherInfo = tlsSocket.getCipher();
            const certificate = tlsSocket.getCertificate();
            const peerCertificate = tlsSocket.getPeerCertificate();
            tlsInfo = {
                cipherSuiteStandardName: (_a = cipherInfo.standardName) !== null && _a !== void 0 ? _a : null,
                cipherSuiteOtherName: cipherInfo.standardName ? null : cipherInfo.name,
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
            remoteName: this.remoteName,
            streamsStarted: this.streamTracker.callsStarted,
            streamsSucceeded: this.streamTracker.callsSucceeded,
            streamsFailed: this.streamTracker.callsFailed,
            messagesSent: this.messagesSent,
            messagesReceived: this.messagesReceived,
            keepAlivesSent: this.keepalivesSent,
            lastLocalStreamCreatedTimestamp: this.streamTracker.lastCallStartedTimestamp,
            lastRemoteStreamCreatedTimestamp: null,
            lastMessageSentTimestamp: this.lastMessageSentTimestamp,
            lastMessageReceivedTimestamp: this.lastMessageReceivedTimestamp,
            localFlowControlWindow: (_b = this.session.state.localWindowSize) !== null && _b !== void 0 ? _b : null,
            remoteFlowControlWindow: (_c = this.session.state.remoteWindowSize) !== null && _c !== void 0 ? _c : null,
        };
        return socketInfo;
    }
    trace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, '(' +
            this.channelzRef.id +
            ') ' +
            this.subchannelAddressString +
            ' ' +
            text);
    }
    keepaliveTrace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, 'keepalive', '(' +
            this.channelzRef.id +
            ') ' +
            this.subchannelAddressString +
            ' ' +
            text);
    }
    flowControlTrace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, FLOW_CONTROL_TRACER_NAME, '(' +
            this.channelzRef.id +
            ') ' +
            this.subchannelAddressString +
            ' ' +
            text);
    }
    internalsTrace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, 'transport_internals', '(' +
            this.channelzRef.id +
            ') ' +
            this.subchannelAddressString +
            ' ' +
            text);
    }
    /**
     * Indicate to the owner of this object that this transport should no longer
     * be used. That happens if the connection drops, or if the server sends a
     * GOAWAY.
     * @param tooManyPings If true, this was triggered by a GOAWAY with data
     * indicating that the session was closed becaues the client sent too many
     * pings.
     * @returns
     */
    reportDisconnectToOwner(tooManyPings) {
        if (this.disconnectHandled) {
            return;
        }
        this.disconnectHandled = true;
        this.disconnectListeners.forEach(listener => listener(tooManyPings));
    }
    /**
     * Handle connection drops, but not GOAWAYs.
     */
    handleDisconnect() {
        this.reportDisconnectToOwner(false);
        /* Give calls an event loop cycle to finish naturally before reporting the
         * disconnnection to them. */
        setImmediate(() => {
            for (const call of this.activeCalls) {
                call.onDisconnect();
            }
        });
    }
    addDisconnectListener(listener) {
        this.disconnectListeners.push(listener);
    }
    clearKeepaliveTimer() {
        if (!this.keepaliveTimerId) {
            return;
        }
        clearTimeout(this.keepaliveTimerId);
        this.keepaliveTimerId = null;
    }
    clearKeepaliveTimeout() {
        if (!this.keepaliveTimeoutId) {
            return;
        }
        clearTimeout(this.keepaliveTimeoutId);
        this.keepaliveTimeoutId = null;
    }
    canSendPing() {
        return (this.keepaliveTimeMs > 0 &&
            (this.keepaliveWithoutCalls || this.activeCalls.size > 0));
    }
    maybeSendPing() {
        var _a, _b;
        this.clearKeepaliveTimer();
        if (!this.canSendPing()) {
            this.pendingSendKeepalivePing = true;
            return;
        }
        if (this.channelzEnabled) {
            this.keepalivesSent += 1;
        }
        this.keepaliveTrace('Sending ping with timeout ' + this.keepaliveTimeoutMs + 'ms');
        if (!this.keepaliveTimeoutId) {
            this.keepaliveTimeoutId = setTimeout(() => {
                this.keepaliveTrace('Ping timeout passed without response');
                this.handleDisconnect();
            }, this.keepaliveTimeoutMs);
            (_b = (_a = this.keepaliveTimeoutId).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        try {
            this.session.ping((err, duration, payload) => {
                if (err) {
                    this.keepaliveTrace('Ping failed with error ' + err.message);
                    this.handleDisconnect();
                }
                this.keepaliveTrace('Received ping response');
                this.clearKeepaliveTimeout();
                this.maybeStartKeepalivePingTimer();
            });
        }
        catch (e) {
            /* If we fail to send a ping, the connection is no longer functional, so
             * we should discard it. */
            this.handleDisconnect();
        }
    }
    /**
     * Starts the keepalive ping timer if appropriate. If the timer already ran
     * out while there were no active requests, instead send a ping immediately.
     * If the ping timer is already running or a ping is currently in flight,
     * instead do nothing and wait for them to resolve.
     */
    maybeStartKeepalivePingTimer() {
        var _a, _b;
        if (!this.canSendPing()) {
            return;
        }
        if (this.pendingSendKeepalivePing) {
            this.pendingSendKeepalivePing = false;
            this.maybeSendPing();
        }
        else if (!this.keepaliveTimerId && !this.keepaliveTimeoutId) {
            this.keepaliveTrace('Starting keepalive timer for ' + this.keepaliveTimeMs + 'ms');
            this.keepaliveTimerId = (_b = (_a = setTimeout(() => {
                this.maybeSendPing();
            }, this.keepaliveTimeMs)).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        /* Otherwise, there is already either a keepalive timer or a ping pending,
         * wait for those to resolve. */
    }
    stopKeepalivePings() {
        if (this.keepaliveTimerId) {
            clearTimeout(this.keepaliveTimerId);
            this.keepaliveTimerId = null;
        }
        this.clearKeepaliveTimeout();
    }
    removeActiveCall(call) {
        this.activeCalls.delete(call);
        if (this.activeCalls.size === 0) {
            this.session.unref();
        }
    }
    addActiveCall(call) {
        this.activeCalls.add(call);
        if (this.activeCalls.size === 1) {
            this.session.ref();
            if (!this.keepaliveWithoutCalls) {
                this.maybeStartKeepalivePingTimer();
            }
        }
    }
    createCall(metadata, host, method, listener, subchannelCallStatsTracker) {
        const headers = metadata.toHttp2Headers();
        headers[HTTP2_HEADER_AUTHORITY] = host;
        headers[HTTP2_HEADER_USER_AGENT] = this.userAgent;
        headers[HTTP2_HEADER_CONTENT_TYPE] = 'application/grpc';
        headers[HTTP2_HEADER_METHOD] = 'POST';
        headers[HTTP2_HEADER_PATH] = method;
        headers[HTTP2_HEADER_TE] = 'trailers';
        let http2Stream;
        /* In theory, if an error is thrown by session.request because session has
         * become unusable (e.g. because it has received a goaway), this subchannel
         * should soon see the corresponding close or goaway event anyway and leave
         * READY. But we have seen reports that this does not happen
         * (https://github.com/googleapis/nodejs-firestore/issues/1023#issuecomment-653204096)
         * so for defense in depth, we just discard the session when we see an
         * error here.
         */
        try {
            http2Stream = this.session.request(headers);
        }
        catch (e) {
            this.handleDisconnect();
            throw e;
        }
        this.flowControlTrace('local window size: ' +
            this.session.state.localWindowSize +
            ' remote window size: ' +
            this.session.state.remoteWindowSize);
        this.internalsTrace('session.closed=' +
            this.session.closed +
            ' session.destroyed=' +
            this.session.destroyed +
            ' session.socket.destroyed=' +
            this.session.socket.destroyed);
        let eventTracker;
        // eslint-disable-next-line prefer-const
        let call;
        if (this.channelzEnabled) {
            this.streamTracker.addCallStarted();
            eventTracker = {
                addMessageSent: () => {
                    var _a;
                    this.messagesSent += 1;
                    this.lastMessageSentTimestamp = new Date();
                    (_a = subchannelCallStatsTracker.addMessageSent) === null || _a === void 0 ? void 0 : _a.call(subchannelCallStatsTracker);
                },
                addMessageReceived: () => {
                    var _a;
                    this.messagesReceived += 1;
                    this.lastMessageReceivedTimestamp = new Date();
                    (_a = subchannelCallStatsTracker.addMessageReceived) === null || _a === void 0 ? void 0 : _a.call(subchannelCallStatsTracker);
                },
                onCallEnd: status => {
                    var _a;
                    (_a = subchannelCallStatsTracker.onCallEnd) === null || _a === void 0 ? void 0 : _a.call(subchannelCallStatsTracker, status);
                    this.removeActiveCall(call);
                },
                onStreamEnd: success => {
                    var _a;
                    if (success) {
                        this.streamTracker.addCallSucceeded();
                    }
                    else {
                        this.streamTracker.addCallFailed();
                    }
                    (_a = subchannelCallStatsTracker.onStreamEnd) === null || _a === void 0 ? void 0 : _a.call(subchannelCallStatsTracker, success);
                },
            };
        }
        else {
            eventTracker = {
                addMessageSent: () => {
                    var _a;
                    (_a = subchannelCallStatsTracker.addMessageSent) === null || _a === void 0 ? void 0 : _a.call(subchannelCallStatsTracker);
                },
                addMessageReceived: () => {
                    var _a;
                    (_a = subchannelCallStatsTracker.addMessageReceived) === null || _a === void 0 ? void 0 : _a.call(subchannelCallStatsTracker);
                },
                onCallEnd: status => {
                    var _a;
                    (_a = subchannelCallStatsTracker.onCallEnd) === null || _a === void 0 ? void 0 : _a.call(subchannelCallStatsTracker, status);
                    this.removeActiveCall(call);
                },
                onStreamEnd: success => {
                    var _a;
                    (_a = subchannelCallStatsTracker.onStreamEnd) === null || _a === void 0 ? void 0 : _a.call(subchannelCallStatsTracker, success);
                },
            };
        }
        call = new subchannel_call_1.Http2SubchannelCall(http2Stream, eventTracker, listener, this, (0, call_number_1.getNextCallNumber)());
        this.addActiveCall(call);
        return call;
    }
    getChannelzRef() {
        return this.channelzRef;
    }
    getPeerName() {
        return this.subchannelAddressString;
    }
    shutdown() {
        this.session.close();
        (0, channelz_1.unregisterChannelzRef)(this.channelzRef);
    }
}
class Http2SubchannelConnector {
    constructor(channelTarget) {
        this.channelTarget = channelTarget;
        this.session = null;
        this.isShutdown = false;
    }
    trace(text) {
        logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, (0, uri_parser_1.uriToString)(this.channelTarget) + ' ' + text);
    }
    createSession(address, credentials, options, proxyConnectionResult) {
        if (this.isShutdown) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            var _a, _b, _c;
            let remoteName;
            if (proxyConnectionResult.realTarget) {
                remoteName = (0, uri_parser_1.uriToString)(proxyConnectionResult.realTarget);
                this.trace('creating HTTP/2 session through proxy to ' +
                    (0, uri_parser_1.uriToString)(proxyConnectionResult.realTarget));
            }
            else {
                remoteName = null;
                this.trace('creating HTTP/2 session to ' + (0, subchannel_address_1.subchannelAddressToString)(address));
            }
            const targetAuthority = (0, resolver_1.getDefaultAuthority)((_a = proxyConnectionResult.realTarget) !== null && _a !== void 0 ? _a : this.channelTarget);
            let connectionOptions = credentials._getConnectionOptions() || {};
            connectionOptions.maxSendHeaderBlockLength = Number.MAX_SAFE_INTEGER;
            if ('grpc-node.max_session_memory' in options) {
                connectionOptions.maxSessionMemory =
                    options['grpc-node.max_session_memory'];
            }
            else {
                /* By default, set a very large max session memory limit, to effectively
                 * disable enforcement of the limit. Some testing indicates that Node's
                 * behavior degrades badly when this limit is reached, so we solve that
                 * by disabling the check entirely. */
                connectionOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
            }
            let addressScheme = 'http://';
            if ('secureContext' in connectionOptions) {
                addressScheme = 'https://';
                // If provided, the value of grpc.ssl_target_name_override should be used
                // to override the target hostname when checking server identity.
                // This option is used for testing only.
                if (options['grpc.ssl_target_name_override']) {
                    const sslTargetNameOverride = options['grpc.ssl_target_name_override'];
                    connectionOptions.checkServerIdentity = (host, cert) => {
                        return (0, tls_1.checkServerIdentity)(sslTargetNameOverride, cert);
                    };
                    connectionOptions.servername = sslTargetNameOverride;
                }
                else {
                    const authorityHostname = (_c = (_b = (0, uri_parser_1.splitHostPort)(targetAuthority)) === null || _b === void 0 ? void 0 : _b.host) !== null && _c !== void 0 ? _c : 'localhost';
                    // We want to always set servername to support SNI
                    connectionOptions.servername = authorityHostname;
                }
                if (proxyConnectionResult.socket) {
                    /* This is part of the workaround for
                     * https://github.com/nodejs/node/issues/32922. Without that bug,
                     * proxyConnectionResult.socket would always be a plaintext socket and
                     * this would say
                     * connectionOptions.socket = proxyConnectionResult.socket; */
                    connectionOptions.createConnection = (authority, option) => {
                        return proxyConnectionResult.socket;
                    };
                }
            }
            else {
                /* In all but the most recent versions of Node, http2.connect does not use
                 * the options when establishing plaintext connections, so we need to
                 * establish that connection explicitly. */
                connectionOptions.createConnection = (authority, option) => {
                    if (proxyConnectionResult.socket) {
                        return proxyConnectionResult.socket;
                    }
                    else {
                        /* net.NetConnectOpts is declared in a way that is more restrictive
                         * than what net.connect will actually accept, so we use the type
                         * assertion to work around that. */
                        return net.connect(address);
                    }
                };
            }
            connectionOptions = Object.assign(Object.assign(Object.assign({}, connectionOptions), address), { enableTrace: options['grpc-node.tls_enable_trace'] === 1 });
            /* http2.connect uses the options here:
             * https://github.com/nodejs/node/blob/70c32a6d190e2b5d7b9ff9d5b6a459d14e8b7d59/lib/internal/http2/core.js#L3028-L3036
             * The spread operator overides earlier values with later ones, so any port
             * or host values in the options will be used rather than any values extracted
             * from the first argument. In addition, the path overrides the host and port,
             * as documented for plaintext connections here:
             * https://nodejs.org/api/net.html#net_socket_connect_options_connectlistener
             * and for TLS connections here:
             * https://nodejs.org/api/tls.html#tls_tls_connect_options_callback. In
             * earlier versions of Node, http2.connect passes these options to
             * tls.connect but not net.connect, so in the insecure case we still need
             * to set the createConnection option above to create the connection
             * explicitly. We cannot do that in the TLS case because http2.connect
             * passes necessary additional options to tls.connect.
             * The first argument just needs to be parseable as a URL and the scheme
             * determines whether the connection will be established over TLS or not.
             */
            const session = http2.connect(addressScheme + targetAuthority, connectionOptions);
            this.session = session;
            let errorMessage = 'Failed to connect';
            session.unref();
            session.once('connect', () => {
                session.removeAllListeners();
                resolve(new Http2Transport(session, address, options, remoteName));
                this.session = null;
            });
            session.once('close', () => {
                this.session = null;
                // Leave time for error event to happen before rejecting
                setImmediate(() => {
                    reject(`${errorMessage} (${new Date().toISOString()})`);
                });
            });
            session.once('error', error => {
                errorMessage = error.message;
                this.trace('connection failed with error ' + errorMessage);
            });
        });
    }
    connect(address, credentials, options) {
        var _a, _b;
        if (this.isShutdown) {
            return Promise.reject();
        }
        /* Pass connection options through to the proxy so that it's able to
         * upgrade it's connection to support tls if needed.
         * This is a workaround for https://github.com/nodejs/node/issues/32922
         * See https://github.com/grpc/grpc-node/pull/1369 for more info. */
        const connectionOptions = credentials._getConnectionOptions() || {};
        if ('secureContext' in connectionOptions) {
            connectionOptions.ALPNProtocols = ['h2'];
            // If provided, the value of grpc.ssl_target_name_override should be used
            // to override the target hostname when checking server identity.
            // This option is used for testing only.
            if (options['grpc.ssl_target_name_override']) {
                const sslTargetNameOverride = options['grpc.ssl_target_name_override'];
                connectionOptions.checkServerIdentity = (host, cert) => {
                    return (0, tls_1.checkServerIdentity)(sslTargetNameOverride, cert);
                };
                connectionOptions.servername = sslTargetNameOverride;
            }
            else {
                if ('grpc.http_connect_target' in options) {
                    /* This is more or less how servername will be set in createSession
                     * if a connection is successfully established through the proxy.
                     * If the proxy is not used, these connectionOptions are discarded
                     * anyway */
                    const targetPath = (0, resolver_1.getDefaultAuthority)((_a = (0, uri_parser_1.parseUri)(options['grpc.http_connect_target'])) !== null && _a !== void 0 ? _a : {
                        path: 'localhost',
                    });
                    const hostPort = (0, uri_parser_1.splitHostPort)(targetPath);
                    connectionOptions.servername = (_b = hostPort === null || hostPort === void 0 ? void 0 : hostPort.host) !== null && _b !== void 0 ? _b : targetPath;
                }
            }
            if (options['grpc-node.tls_enable_trace']) {
                connectionOptions.enableTrace = true;
            }
        }
        return (0, http_proxy_1.getProxiedConnection)(address, options, connectionOptions).then(result => this.createSession(address, credentials, options, result));
    }
    shutdown() {
        var _a;
        this.isShutdown = true;
        (_a = this.session) === null || _a === void 0 ? void 0 : _a.close();
        this.session = null;
    }
}
exports.Http2SubchannelConnector = Http2SubchannelConnector;
//# sourceMappingURL=transport.js.map