"use strict";
/*
 * Copyright 2021 gRPC authors.
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
exports.setup = exports.getChannelzServiceDefinition = exports.getChannelzHandlers = exports.unregisterChannelzRef = exports.registerChannelzSocket = exports.registerChannelzServer = exports.registerChannelzSubchannel = exports.registerChannelzChannel = exports.ChannelzCallTracker = exports.ChannelzChildrenTracker = exports.ChannelzTrace = void 0;
const net_1 = require("net");
const connectivity_state_1 = require("./connectivity-state");
const constants_1 = require("./constants");
const subchannel_address_1 = require("./subchannel-address");
const admin_1 = require("./admin");
const make_client_1 = require("./make-client");
function channelRefToMessage(ref) {
    return {
        channel_id: ref.id,
        name: ref.name,
    };
}
function subchannelRefToMessage(ref) {
    return {
        subchannel_id: ref.id,
        name: ref.name,
    };
}
function serverRefToMessage(ref) {
    return {
        server_id: ref.id,
    };
}
function socketRefToMessage(ref) {
    return {
        socket_id: ref.id,
        name: ref.name,
    };
}
/**
 * The loose upper bound on the number of events that should be retained in a
 * trace. This may be exceeded by up to a factor of 2. Arbitrarily chosen as a
 * number that should be large enough to contain the recent relevant
 * information, but small enough to not use excessive memory.
 */
const TARGET_RETAINED_TRACES = 32;
class ChannelzTrace {
    constructor() {
        this.events = [];
        this.eventsLogged = 0;
        this.creationTimestamp = new Date();
    }
    addTrace(severity, description, child) {
        const timestamp = new Date();
        this.events.push({
            description: description,
            severity: severity,
            timestamp: timestamp,
            childChannel: (child === null || child === void 0 ? void 0 : child.kind) === 'channel' ? child : undefined,
            childSubchannel: (child === null || child === void 0 ? void 0 : child.kind) === 'subchannel' ? child : undefined,
        });
        // Whenever the trace array gets too large, discard the first half
        if (this.events.length >= TARGET_RETAINED_TRACES * 2) {
            this.events = this.events.slice(TARGET_RETAINED_TRACES);
        }
        this.eventsLogged += 1;
    }
    getTraceMessage() {
        return {
            creation_timestamp: dateToProtoTimestamp(this.creationTimestamp),
            num_events_logged: this.eventsLogged,
            events: this.events.map(event => {
                return {
                    description: event.description,
                    severity: event.severity,
                    timestamp: dateToProtoTimestamp(event.timestamp),
                    channel_ref: event.childChannel
                        ? channelRefToMessage(event.childChannel)
                        : null,
                    subchannel_ref: event.childSubchannel
                        ? subchannelRefToMessage(event.childSubchannel)
                        : null,
                };
            }),
        };
    }
}
exports.ChannelzTrace = ChannelzTrace;
class ChannelzChildrenTracker {
    constructor() {
        this.channelChildren = new Map();
        this.subchannelChildren = new Map();
        this.socketChildren = new Map();
    }
    refChild(child) {
        var _a, _b, _c;
        switch (child.kind) {
            case 'channel': {
                const trackedChild = (_a = this.channelChildren.get(child.id)) !== null && _a !== void 0 ? _a : {
                    ref: child,
                    count: 0,
                };
                trackedChild.count += 1;
                this.channelChildren.set(child.id, trackedChild);
                break;
            }
            case 'subchannel': {
                const trackedChild = (_b = this.subchannelChildren.get(child.id)) !== null && _b !== void 0 ? _b : {
                    ref: child,
                    count: 0,
                };
                trackedChild.count += 1;
                this.subchannelChildren.set(child.id, trackedChild);
                break;
            }
            case 'socket': {
                const trackedChild = (_c = this.socketChildren.get(child.id)) !== null && _c !== void 0 ? _c : {
                    ref: child,
                    count: 0,
                };
                trackedChild.count += 1;
                this.socketChildren.set(child.id, trackedChild);
                break;
            }
        }
    }
    unrefChild(child) {
        switch (child.kind) {
            case 'channel': {
                const trackedChild = this.channelChildren.get(child.id);
                if (trackedChild !== undefined) {
                    trackedChild.count -= 1;
                    if (trackedChild.count === 0) {
                        this.channelChildren.delete(child.id);
                    }
                    else {
                        this.channelChildren.set(child.id, trackedChild);
                    }
                }
                break;
            }
            case 'subchannel': {
                const trackedChild = this.subchannelChildren.get(child.id);
                if (trackedChild !== undefined) {
                    trackedChild.count -= 1;
                    if (trackedChild.count === 0) {
                        this.subchannelChildren.delete(child.id);
                    }
                    else {
                        this.subchannelChildren.set(child.id, trackedChild);
                    }
                }
                break;
            }
            case 'socket': {
                const trackedChild = this.socketChildren.get(child.id);
                if (trackedChild !== undefined) {
                    trackedChild.count -= 1;
                    if (trackedChild.count === 0) {
                        this.socketChildren.delete(child.id);
                    }
                    else {
                        this.socketChildren.set(child.id, trackedChild);
                    }
                }
                break;
            }
        }
    }
    getChildLists() {
        const channels = [];
        for (const { ref } of this.channelChildren.values()) {
            channels.push(ref);
        }
        const subchannels = [];
        for (const { ref } of this.subchannelChildren.values()) {
            subchannels.push(ref);
        }
        const sockets = [];
        for (const { ref } of this.socketChildren.values()) {
            sockets.push(ref);
        }
        return { channels, subchannels, sockets };
    }
}
exports.ChannelzChildrenTracker = ChannelzChildrenTracker;
class ChannelzCallTracker {
    constructor() {
        this.callsStarted = 0;
        this.callsSucceeded = 0;
        this.callsFailed = 0;
        this.lastCallStartedTimestamp = null;
    }
    addCallStarted() {
        this.callsStarted += 1;
        this.lastCallStartedTimestamp = new Date();
    }
    addCallSucceeded() {
        this.callsSucceeded += 1;
    }
    addCallFailed() {
        this.callsFailed += 1;
    }
}
exports.ChannelzCallTracker = ChannelzCallTracker;
let nextId = 1;
function getNextId() {
    return nextId++;
}
const channels = [];
const subchannels = [];
const servers = [];
const sockets = [];
function registerChannelzChannel(name, getInfo, channelzEnabled) {
    const id = getNextId();
    const ref = { id, name, kind: 'channel' };
    if (channelzEnabled) {
        channels[id] = { ref, getInfo };
    }
    return ref;
}
exports.registerChannelzChannel = registerChannelzChannel;
function registerChannelzSubchannel(name, getInfo, channelzEnabled) {
    const id = getNextId();
    const ref = { id, name, kind: 'subchannel' };
    if (channelzEnabled) {
        subchannels[id] = { ref, getInfo };
    }
    return ref;
}
exports.registerChannelzSubchannel = registerChannelzSubchannel;
function registerChannelzServer(getInfo, channelzEnabled) {
    const id = getNextId();
    const ref = { id, kind: 'server' };
    if (channelzEnabled) {
        servers[id] = { ref, getInfo };
    }
    return ref;
}
exports.registerChannelzServer = registerChannelzServer;
function registerChannelzSocket(name, getInfo, channelzEnabled) {
    const id = getNextId();
    const ref = { id, name, kind: 'socket' };
    if (channelzEnabled) {
        sockets[id] = { ref, getInfo };
    }
    return ref;
}
exports.registerChannelzSocket = registerChannelzSocket;
function unregisterChannelzRef(ref) {
    switch (ref.kind) {
        case 'channel':
            delete channels[ref.id];
            return;
        case 'subchannel':
            delete subchannels[ref.id];
            return;
        case 'server':
            delete servers[ref.id];
            return;
        case 'socket':
            delete sockets[ref.id];
            return;
    }
}
exports.unregisterChannelzRef = unregisterChannelzRef;
/**
 * Parse a single section of an IPv6 address as two bytes
 * @param addressSection A hexadecimal string of length up to 4
 * @returns The pair of bytes representing this address section
 */
function parseIPv6Section(addressSection) {
    const numberValue = Number.parseInt(addressSection, 16);
    return [(numberValue / 256) | 0, numberValue % 256];
}
/**
 * Parse a chunk of an IPv6 address string to some number of bytes
 * @param addressChunk Some number of segments of up to 4 hexadecimal
 *   characters each, joined by colons.
 * @returns The list of bytes representing this address chunk
 */
function parseIPv6Chunk(addressChunk) {
    if (addressChunk === '') {
        return [];
    }
    const bytePairs = addressChunk
        .split(':')
        .map(section => parseIPv6Section(section));
    const result = [];
    return result.concat(...bytePairs);
}
/**
 * Converts an IPv4 or IPv6 address from string representation to binary
 * representation
 * @param ipAddress an IP address in standard IPv4 or IPv6 text format
 * @returns
 */
function ipAddressStringToBuffer(ipAddress) {
    if ((0, net_1.isIPv4)(ipAddress)) {
        return Buffer.from(Uint8Array.from(ipAddress.split('.').map(segment => Number.parseInt(segment))));
    }
    else if ((0, net_1.isIPv6)(ipAddress)) {
        let leftSection;
        let rightSection;
        const doubleColonIndex = ipAddress.indexOf('::');
        if (doubleColonIndex === -1) {
            leftSection = ipAddress;
            rightSection = '';
        }
        else {
            leftSection = ipAddress.substring(0, doubleColonIndex);
            rightSection = ipAddress.substring(doubleColonIndex + 2);
        }
        const leftBuffer = Buffer.from(parseIPv6Chunk(leftSection));
        const rightBuffer = Buffer.from(parseIPv6Chunk(rightSection));
        const middleBuffer = Buffer.alloc(16 - leftBuffer.length - rightBuffer.length, 0);
        return Buffer.concat([leftBuffer, middleBuffer, rightBuffer]);
    }
    else {
        return null;
    }
}
function connectivityStateToMessage(state) {
    switch (state) {
        case connectivity_state_1.ConnectivityState.CONNECTING:
            return {
                state: 'CONNECTING',
            };
        case connectivity_state_1.ConnectivityState.IDLE:
            return {
                state: 'IDLE',
            };
        case connectivity_state_1.ConnectivityState.READY:
            return {
                state: 'READY',
            };
        case connectivity_state_1.ConnectivityState.SHUTDOWN:
            return {
                state: 'SHUTDOWN',
            };
        case connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE:
            return {
                state: 'TRANSIENT_FAILURE',
            };
        default:
            return {
                state: 'UNKNOWN',
            };
    }
}
function dateToProtoTimestamp(date) {
    if (!date) {
        return null;
    }
    const millisSinceEpoch = date.getTime();
    return {
        seconds: (millisSinceEpoch / 1000) | 0,
        nanos: (millisSinceEpoch % 1000) * 1000000,
    };
}
function getChannelMessage(channelEntry) {
    const resolvedInfo = channelEntry.getInfo();
    return {
        ref: channelRefToMessage(channelEntry.ref),
        data: {
            target: resolvedInfo.target,
            state: connectivityStateToMessage(resolvedInfo.state),
            calls_started: resolvedInfo.callTracker.callsStarted,
            calls_succeeded: resolvedInfo.callTracker.callsSucceeded,
            calls_failed: resolvedInfo.callTracker.callsFailed,
            last_call_started_timestamp: dateToProtoTimestamp(resolvedInfo.callTracker.lastCallStartedTimestamp),
            trace: resolvedInfo.trace.getTraceMessage(),
        },
        channel_ref: resolvedInfo.children.channels.map(ref => channelRefToMessage(ref)),
        subchannel_ref: resolvedInfo.children.subchannels.map(ref => subchannelRefToMessage(ref)),
    };
}
function GetChannel(call, callback) {
    const channelId = Number.parseInt(call.request.channel_id);
    const channelEntry = channels[channelId];
    if (channelEntry === undefined) {
        callback({
            code: constants_1.Status.NOT_FOUND,
            details: 'No channel data found for id ' + channelId,
        });
        return;
    }
    callback(null, { channel: getChannelMessage(channelEntry) });
}
function GetTopChannels(call, callback) {
    const maxResults = Number.parseInt(call.request.max_results);
    const resultList = [];
    let i = Number.parseInt(call.request.start_channel_id);
    for (; i < channels.length; i++) {
        const channelEntry = channels[i];
        if (channelEntry === undefined) {
            continue;
        }
        resultList.push(getChannelMessage(channelEntry));
        if (resultList.length >= maxResults) {
            break;
        }
    }
    callback(null, {
        channel: resultList,
        end: i >= servers.length,
    });
}
function getServerMessage(serverEntry) {
    const resolvedInfo = serverEntry.getInfo();
    return {
        ref: serverRefToMessage(serverEntry.ref),
        data: {
            calls_started: resolvedInfo.callTracker.callsStarted,
            calls_succeeded: resolvedInfo.callTracker.callsSucceeded,
            calls_failed: resolvedInfo.callTracker.callsFailed,
            last_call_started_timestamp: dateToProtoTimestamp(resolvedInfo.callTracker.lastCallStartedTimestamp),
            trace: resolvedInfo.trace.getTraceMessage(),
        },
        listen_socket: resolvedInfo.listenerChildren.sockets.map(ref => socketRefToMessage(ref)),
    };
}
function GetServer(call, callback) {
    const serverId = Number.parseInt(call.request.server_id);
    const serverEntry = servers[serverId];
    if (serverEntry === undefined) {
        callback({
            code: constants_1.Status.NOT_FOUND,
            details: 'No server data found for id ' + serverId,
        });
        return;
    }
    callback(null, { server: getServerMessage(serverEntry) });
}
function GetServers(call, callback) {
    const maxResults = Number.parseInt(call.request.max_results);
    const resultList = [];
    let i = Number.parseInt(call.request.start_server_id);
    for (; i < servers.length; i++) {
        const serverEntry = servers[i];
        if (serverEntry === undefined) {
            continue;
        }
        resultList.push(getServerMessage(serverEntry));
        if (resultList.length >= maxResults) {
            break;
        }
    }
    callback(null, {
        server: resultList,
        end: i >= servers.length,
    });
}
function GetSubchannel(call, callback) {
    const subchannelId = Number.parseInt(call.request.subchannel_id);
    const subchannelEntry = subchannels[subchannelId];
    if (subchannelEntry === undefined) {
        callback({
            code: constants_1.Status.NOT_FOUND,
            details: 'No subchannel data found for id ' + subchannelId,
        });
        return;
    }
    const resolvedInfo = subchannelEntry.getInfo();
    const subchannelMessage = {
        ref: subchannelRefToMessage(subchannelEntry.ref),
        data: {
            target: resolvedInfo.target,
            state: connectivityStateToMessage(resolvedInfo.state),
            calls_started: resolvedInfo.callTracker.callsStarted,
            calls_succeeded: resolvedInfo.callTracker.callsSucceeded,
            calls_failed: resolvedInfo.callTracker.callsFailed,
            last_call_started_timestamp: dateToProtoTimestamp(resolvedInfo.callTracker.lastCallStartedTimestamp),
            trace: resolvedInfo.trace.getTraceMessage(),
        },
        socket_ref: resolvedInfo.children.sockets.map(ref => socketRefToMessage(ref)),
    };
    callback(null, { subchannel: subchannelMessage });
}
function subchannelAddressToAddressMessage(subchannelAddress) {
    var _a;
    if ((0, subchannel_address_1.isTcpSubchannelAddress)(subchannelAddress)) {
        return {
            address: 'tcpip_address',
            tcpip_address: {
                ip_address: (_a = ipAddressStringToBuffer(subchannelAddress.host)) !== null && _a !== void 0 ? _a : undefined,
                port: subchannelAddress.port,
            },
        };
    }
    else {
        return {
            address: 'uds_address',
            uds_address: {
                filename: subchannelAddress.path,
            },
        };
    }
}
function GetSocket(call, callback) {
    var _a, _b, _c, _d, _e;
    const socketId = Number.parseInt(call.request.socket_id);
    const socketEntry = sockets[socketId];
    if (socketEntry === undefined) {
        callback({
            code: constants_1.Status.NOT_FOUND,
            details: 'No socket data found for id ' + socketId,
        });
        return;
    }
    const resolvedInfo = socketEntry.getInfo();
    const securityMessage = resolvedInfo.security
        ? {
            model: 'tls',
            tls: {
                cipher_suite: resolvedInfo.security.cipherSuiteStandardName
                    ? 'standard_name'
                    : 'other_name',
                standard_name: (_a = resolvedInfo.security.cipherSuiteStandardName) !== null && _a !== void 0 ? _a : undefined,
                other_name: (_b = resolvedInfo.security.cipherSuiteOtherName) !== null && _b !== void 0 ? _b : undefined,
                local_certificate: (_c = resolvedInfo.security.localCertificate) !== null && _c !== void 0 ? _c : undefined,
                remote_certificate: (_d = resolvedInfo.security.remoteCertificate) !== null && _d !== void 0 ? _d : undefined,
            },
        }
        : null;
    const socketMessage = {
        ref: socketRefToMessage(socketEntry.ref),
        local: resolvedInfo.localAddress
            ? subchannelAddressToAddressMessage(resolvedInfo.localAddress)
            : null,
        remote: resolvedInfo.remoteAddress
            ? subchannelAddressToAddressMessage(resolvedInfo.remoteAddress)
            : null,
        remote_name: (_e = resolvedInfo.remoteName) !== null && _e !== void 0 ? _e : undefined,
        security: securityMessage,
        data: {
            keep_alives_sent: resolvedInfo.keepAlivesSent,
            streams_started: resolvedInfo.streamsStarted,
            streams_succeeded: resolvedInfo.streamsSucceeded,
            streams_failed: resolvedInfo.streamsFailed,
            last_local_stream_created_timestamp: dateToProtoTimestamp(resolvedInfo.lastLocalStreamCreatedTimestamp),
            last_remote_stream_created_timestamp: dateToProtoTimestamp(resolvedInfo.lastRemoteStreamCreatedTimestamp),
            messages_received: resolvedInfo.messagesReceived,
            messages_sent: resolvedInfo.messagesSent,
            last_message_received_timestamp: dateToProtoTimestamp(resolvedInfo.lastMessageReceivedTimestamp),
            last_message_sent_timestamp: dateToProtoTimestamp(resolvedInfo.lastMessageSentTimestamp),
            local_flow_control_window: resolvedInfo.localFlowControlWindow
                ? { value: resolvedInfo.localFlowControlWindow }
                : null,
            remote_flow_control_window: resolvedInfo.remoteFlowControlWindow
                ? { value: resolvedInfo.remoteFlowControlWindow }
                : null,
        },
    };
    callback(null, { socket: socketMessage });
}
function GetServerSockets(call, callback) {
    const serverId = Number.parseInt(call.request.server_id);
    const serverEntry = servers[serverId];
    if (serverEntry === undefined) {
        callback({
            code: constants_1.Status.NOT_FOUND,
            details: 'No server data found for id ' + serverId,
        });
        return;
    }
    const startId = Number.parseInt(call.request.start_socket_id);
    const maxResults = Number.parseInt(call.request.max_results);
    const resolvedInfo = serverEntry.getInfo();
    // If we wanted to include listener sockets in the result, this line would
    // instead say
    // const allSockets = resolvedInfo.listenerChildren.sockets.concat(resolvedInfo.sessionChildren.sockets).sort((ref1, ref2) => ref1.id - ref2.id);
    const allSockets = resolvedInfo.sessionChildren.sockets.sort((ref1, ref2) => ref1.id - ref2.id);
    const resultList = [];
    let i = 0;
    for (; i < allSockets.length; i++) {
        if (allSockets[i].id >= startId) {
            resultList.push(socketRefToMessage(allSockets[i]));
            if (resultList.length >= maxResults) {
                break;
            }
        }
    }
    callback(null, {
        socket_ref: resultList,
        end: i >= allSockets.length,
    });
}
function getChannelzHandlers() {
    return {
        GetChannel,
        GetTopChannels,
        GetServer,
        GetServers,
        GetSubchannel,
        GetSocket,
        GetServerSockets,
    };
}
exports.getChannelzHandlers = getChannelzHandlers;
let loadedChannelzDefinition = null;
function getChannelzServiceDefinition() {
    if (loadedChannelzDefinition) {
        return loadedChannelzDefinition;
    }
    /* The purpose of this complexity is to avoid loading @grpc/proto-loader at
     * runtime for users who will not use/enable channelz. */
    const loaderLoadSync = require('@grpc/proto-loader')
        .loadSync;
    const loadedProto = loaderLoadSync('channelz.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [`${__dirname}/../../proto`],
    });
    const channelzGrpcObject = (0, make_client_1.loadPackageDefinition)(loadedProto);
    loadedChannelzDefinition =
        channelzGrpcObject.grpc.channelz.v1.Channelz.service;
    return loadedChannelzDefinition;
}
exports.getChannelzServiceDefinition = getChannelzServiceDefinition;
function setup() {
    (0, admin_1.registerAdminService)(getChannelzServiceDefinition, getChannelzHandlers);
}
exports.setup = setup;
//# sourceMappingURL=channelz.js.map