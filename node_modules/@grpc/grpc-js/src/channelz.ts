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

import { isIPv4, isIPv6 } from 'net';
import { ConnectivityState } from './connectivity-state';
import { Status } from './constants';
import { Timestamp } from './generated/google/protobuf/Timestamp';
import { Channel as ChannelMessage } from './generated/grpc/channelz/v1/Channel';
import { ChannelConnectivityState__Output } from './generated/grpc/channelz/v1/ChannelConnectivityState';
import { ChannelRef as ChannelRefMessage } from './generated/grpc/channelz/v1/ChannelRef';
import { ChannelTrace } from './generated/grpc/channelz/v1/ChannelTrace';
import { GetChannelRequest__Output } from './generated/grpc/channelz/v1/GetChannelRequest';
import { GetChannelResponse } from './generated/grpc/channelz/v1/GetChannelResponse';
import { sendUnaryData, ServerUnaryCall } from './server-call';
import { ServerRef as ServerRefMessage } from './generated/grpc/channelz/v1/ServerRef';
import { SocketRef as SocketRefMessage } from './generated/grpc/channelz/v1/SocketRef';
import {
  isTcpSubchannelAddress,
  SubchannelAddress,
} from './subchannel-address';
import { SubchannelRef as SubchannelRefMessage } from './generated/grpc/channelz/v1/SubchannelRef';
import { GetServerRequest__Output } from './generated/grpc/channelz/v1/GetServerRequest';
import { GetServerResponse } from './generated/grpc/channelz/v1/GetServerResponse';
import { Server as ServerMessage } from './generated/grpc/channelz/v1/Server';
import { GetServersRequest__Output } from './generated/grpc/channelz/v1/GetServersRequest';
import { GetServersResponse } from './generated/grpc/channelz/v1/GetServersResponse';
import { GetTopChannelsRequest__Output } from './generated/grpc/channelz/v1/GetTopChannelsRequest';
import { GetTopChannelsResponse } from './generated/grpc/channelz/v1/GetTopChannelsResponse';
import { GetSubchannelRequest__Output } from './generated/grpc/channelz/v1/GetSubchannelRequest';
import { GetSubchannelResponse } from './generated/grpc/channelz/v1/GetSubchannelResponse';
import { Subchannel as SubchannelMessage } from './generated/grpc/channelz/v1/Subchannel';
import { GetSocketRequest__Output } from './generated/grpc/channelz/v1/GetSocketRequest';
import { GetSocketResponse } from './generated/grpc/channelz/v1/GetSocketResponse';
import { Socket as SocketMessage } from './generated/grpc/channelz/v1/Socket';
import { Address } from './generated/grpc/channelz/v1/Address';
import { Security } from './generated/grpc/channelz/v1/Security';
import { GetServerSocketsRequest__Output } from './generated/grpc/channelz/v1/GetServerSocketsRequest';
import { GetServerSocketsResponse } from './generated/grpc/channelz/v1/GetServerSocketsResponse';
import {
  ChannelzDefinition,
  ChannelzHandlers,
} from './generated/grpc/channelz/v1/Channelz';
import { ProtoGrpcType as ChannelzProtoGrpcType } from './generated/channelz';
import type { loadSync } from '@grpc/proto-loader';
import { registerAdminService } from './admin';
import { loadPackageDefinition } from './make-client';

export type TraceSeverity =
  | 'CT_UNKNOWN'
  | 'CT_INFO'
  | 'CT_WARNING'
  | 'CT_ERROR';

export interface ChannelRef {
  kind: 'channel';
  id: number;
  name: string;
}

export interface SubchannelRef {
  kind: 'subchannel';
  id: number;
  name: string;
}

export interface ServerRef {
  kind: 'server';
  id: number;
}

export interface SocketRef {
  kind: 'socket';
  id: number;
  name: string;
}

function channelRefToMessage(ref: ChannelRef): ChannelRefMessage {
  return {
    channel_id: ref.id,
    name: ref.name,
  };
}

function subchannelRefToMessage(ref: SubchannelRef): SubchannelRefMessage {
  return {
    subchannel_id: ref.id,
    name: ref.name,
  };
}

function serverRefToMessage(ref: ServerRef): ServerRefMessage {
  return {
    server_id: ref.id,
  };
}

function socketRefToMessage(ref: SocketRef): SocketRefMessage {
  return {
    socket_id: ref.id,
    name: ref.name,
  };
}

interface TraceEvent {
  description: string;
  severity: TraceSeverity;
  timestamp: Date;
  childChannel?: ChannelRef;
  childSubchannel?: SubchannelRef;
}

/**
 * The loose upper bound on the number of events that should be retained in a
 * trace. This may be exceeded by up to a factor of 2. Arbitrarily chosen as a
 * number that should be large enough to contain the recent relevant
 * information, but small enough to not use excessive memory.
 */
const TARGET_RETAINED_TRACES = 32;

export class ChannelzTrace {
  events: TraceEvent[] = [];
  creationTimestamp: Date;
  eventsLogged = 0;

  constructor() {
    this.creationTimestamp = new Date();
  }

  addTrace(
    severity: TraceSeverity,
    description: string,
    child?: ChannelRef | SubchannelRef
  ) {
    const timestamp = new Date();
    this.events.push({
      description: description,
      severity: severity,
      timestamp: timestamp,
      childChannel: child?.kind === 'channel' ? child : undefined,
      childSubchannel: child?.kind === 'subchannel' ? child : undefined,
    });
    // Whenever the trace array gets too large, discard the first half
    if (this.events.length >= TARGET_RETAINED_TRACES * 2) {
      this.events = this.events.slice(TARGET_RETAINED_TRACES);
    }
    this.eventsLogged += 1;
  }

  getTraceMessage(): ChannelTrace {
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

export class ChannelzChildrenTracker {
  private channelChildren: Map<number, { ref: ChannelRef; count: number }> =
    new Map<number, { ref: ChannelRef; count: number }>();
  private subchannelChildren: Map<
    number,
    { ref: SubchannelRef; count: number }
  > = new Map<number, { ref: SubchannelRef; count: number }>();
  private socketChildren: Map<number, { ref: SocketRef; count: number }> =
    new Map<number, { ref: SocketRef; count: number }>();

  refChild(child: ChannelRef | SubchannelRef | SocketRef) {
    switch (child.kind) {
      case 'channel': {
        const trackedChild = this.channelChildren.get(child.id) ?? {
          ref: child,
          count: 0,
        };
        trackedChild.count += 1;
        this.channelChildren.set(child.id, trackedChild);
        break;
      }
      case 'subchannel': {
        const trackedChild = this.subchannelChildren.get(child.id) ?? {
          ref: child,
          count: 0,
        };
        trackedChild.count += 1;
        this.subchannelChildren.set(child.id, trackedChild);
        break;
      }
      case 'socket': {
        const trackedChild = this.socketChildren.get(child.id) ?? {
          ref: child,
          count: 0,
        };
        trackedChild.count += 1;
        this.socketChildren.set(child.id, trackedChild);
        break;
      }
    }
  }

  unrefChild(child: ChannelRef | SubchannelRef | SocketRef) {
    switch (child.kind) {
      case 'channel': {
        const trackedChild = this.channelChildren.get(child.id);
        if (trackedChild !== undefined) {
          trackedChild.count -= 1;
          if (trackedChild.count === 0) {
            this.channelChildren.delete(child.id);
          } else {
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
          } else {
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
          } else {
            this.socketChildren.set(child.id, trackedChild);
          }
        }
        break;
      }
    }
  }

  getChildLists(): ChannelzChildren {
    const channels: ChannelRef[] = [];
    for (const { ref } of this.channelChildren.values()) {
      channels.push(ref);
    }
    const subchannels: SubchannelRef[] = [];
    for (const { ref } of this.subchannelChildren.values()) {
      subchannels.push(ref);
    }
    const sockets: SocketRef[] = [];
    for (const { ref } of this.socketChildren.values()) {
      sockets.push(ref);
    }
    return { channels, subchannels, sockets };
  }
}

export class ChannelzCallTracker {
  callsStarted = 0;
  callsSucceeded = 0;
  callsFailed = 0;
  lastCallStartedTimestamp: Date | null = null;

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

export interface ChannelzChildren {
  channels: ChannelRef[];
  subchannels: SubchannelRef[];
  sockets: SocketRef[];
}

export interface ChannelInfo {
  target: string;
  state: ConnectivityState;
  trace: ChannelzTrace;
  callTracker: ChannelzCallTracker;
  children: ChannelzChildren;
}

export type SubchannelInfo = ChannelInfo;

export interface ServerInfo {
  trace: ChannelzTrace;
  callTracker: ChannelzCallTracker;
  listenerChildren: ChannelzChildren;
  sessionChildren: ChannelzChildren;
}

export interface TlsInfo {
  cipherSuiteStandardName: string | null;
  cipherSuiteOtherName: string | null;
  localCertificate: Buffer | null;
  remoteCertificate: Buffer | null;
}

export interface SocketInfo {
  localAddress: SubchannelAddress | null;
  remoteAddress: SubchannelAddress | null;
  security: TlsInfo | null;
  remoteName: string | null;
  streamsStarted: number;
  streamsSucceeded: number;
  streamsFailed: number;
  messagesSent: number;
  messagesReceived: number;
  keepAlivesSent: number;
  lastLocalStreamCreatedTimestamp: Date | null;
  lastRemoteStreamCreatedTimestamp: Date | null;
  lastMessageSentTimestamp: Date | null;
  lastMessageReceivedTimestamp: Date | null;
  localFlowControlWindow: number | null;
  remoteFlowControlWindow: number | null;
}

interface ChannelEntry {
  ref: ChannelRef;
  getInfo(): ChannelInfo;
}

interface SubchannelEntry {
  ref: SubchannelRef;
  getInfo(): SubchannelInfo;
}

interface ServerEntry {
  ref: ServerRef;
  getInfo(): ServerInfo;
}

interface SocketEntry {
  ref: SocketRef;
  getInfo(): SocketInfo;
}

let nextId = 1;

function getNextId(): number {
  return nextId++;
}

const channels: (ChannelEntry | undefined)[] = [];
const subchannels: (SubchannelEntry | undefined)[] = [];
const servers: (ServerEntry | undefined)[] = [];
const sockets: (SocketEntry | undefined)[] = [];

export function registerChannelzChannel(
  name: string,
  getInfo: () => ChannelInfo,
  channelzEnabled: boolean
): ChannelRef {
  const id = getNextId();
  const ref: ChannelRef = { id, name, kind: 'channel' };
  if (channelzEnabled) {
    channels[id] = { ref, getInfo };
  }
  return ref;
}

export function registerChannelzSubchannel(
  name: string,
  getInfo: () => SubchannelInfo,
  channelzEnabled: boolean
): SubchannelRef {
  const id = getNextId();
  const ref: SubchannelRef = { id, name, kind: 'subchannel' };
  if (channelzEnabled) {
    subchannels[id] = { ref, getInfo };
  }
  return ref;
}

export function registerChannelzServer(
  getInfo: () => ServerInfo,
  channelzEnabled: boolean
): ServerRef {
  const id = getNextId();
  const ref: ServerRef = { id, kind: 'server' };
  if (channelzEnabled) {
    servers[id] = { ref, getInfo };
  }
  return ref;
}

export function registerChannelzSocket(
  name: string,
  getInfo: () => SocketInfo,
  channelzEnabled: boolean
): SocketRef {
  const id = getNextId();
  const ref: SocketRef = { id, name, kind: 'socket' };
  if (channelzEnabled) {
    sockets[id] = { ref, getInfo };
  }
  return ref;
}

export function unregisterChannelzRef(
  ref: ChannelRef | SubchannelRef | ServerRef | SocketRef
) {
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

/**
 * Parse a single section of an IPv6 address as two bytes
 * @param addressSection A hexadecimal string of length up to 4
 * @returns The pair of bytes representing this address section
 */
function parseIPv6Section(addressSection: string): [number, number] {
  const numberValue = Number.parseInt(addressSection, 16);
  return [(numberValue / 256) | 0, numberValue % 256];
}

/**
 * Parse a chunk of an IPv6 address string to some number of bytes
 * @param addressChunk Some number of segments of up to 4 hexadecimal
 *   characters each, joined by colons.
 * @returns The list of bytes representing this address chunk
 */
function parseIPv6Chunk(addressChunk: string): number[] {
  if (addressChunk === '') {
    return [];
  }
  const bytePairs = addressChunk
    .split(':')
    .map(section => parseIPv6Section(section));
  const result: number[] = [];
  return result.concat(...bytePairs);
}

/**
 * Converts an IPv4 or IPv6 address from string representation to binary
 * representation
 * @param ipAddress an IP address in standard IPv4 or IPv6 text format
 * @returns
 */
function ipAddressStringToBuffer(ipAddress: string): Buffer | null {
  if (isIPv4(ipAddress)) {
    return Buffer.from(
      Uint8Array.from(
        ipAddress.split('.').map(segment => Number.parseInt(segment))
      )
    );
  } else if (isIPv6(ipAddress)) {
    let leftSection: string;
    let rightSection: string;
    const doubleColonIndex = ipAddress.indexOf('::');
    if (doubleColonIndex === -1) {
      leftSection = ipAddress;
      rightSection = '';
    } else {
      leftSection = ipAddress.substring(0, doubleColonIndex);
      rightSection = ipAddress.substring(doubleColonIndex + 2);
    }
    const leftBuffer = Buffer.from(parseIPv6Chunk(leftSection));
    const rightBuffer = Buffer.from(parseIPv6Chunk(rightSection));
    const middleBuffer = Buffer.alloc(
      16 - leftBuffer.length - rightBuffer.length,
      0
    );
    return Buffer.concat([leftBuffer, middleBuffer, rightBuffer]);
  } else {
    return null;
  }
}

function connectivityStateToMessage(
  state: ConnectivityState
): ChannelConnectivityState__Output {
  switch (state) {
    case ConnectivityState.CONNECTING:
      return {
        state: 'CONNECTING',
      };
    case ConnectivityState.IDLE:
      return {
        state: 'IDLE',
      };
    case ConnectivityState.READY:
      return {
        state: 'READY',
      };
    case ConnectivityState.SHUTDOWN:
      return {
        state: 'SHUTDOWN',
      };
    case ConnectivityState.TRANSIENT_FAILURE:
      return {
        state: 'TRANSIENT_FAILURE',
      };
    default:
      return {
        state: 'UNKNOWN',
      };
  }
}

function dateToProtoTimestamp(date?: Date | null): Timestamp | null {
  if (!date) {
    return null;
  }
  const millisSinceEpoch = date.getTime();
  return {
    seconds: (millisSinceEpoch / 1000) | 0,
    nanos: (millisSinceEpoch % 1000) * 1_000_000,
  };
}

function getChannelMessage(channelEntry: ChannelEntry): ChannelMessage {
  const resolvedInfo = channelEntry.getInfo();
  return {
    ref: channelRefToMessage(channelEntry.ref),
    data: {
      target: resolvedInfo.target,
      state: connectivityStateToMessage(resolvedInfo.state),
      calls_started: resolvedInfo.callTracker.callsStarted,
      calls_succeeded: resolvedInfo.callTracker.callsSucceeded,
      calls_failed: resolvedInfo.callTracker.callsFailed,
      last_call_started_timestamp: dateToProtoTimestamp(
        resolvedInfo.callTracker.lastCallStartedTimestamp
      ),
      trace: resolvedInfo.trace.getTraceMessage(),
    },
    channel_ref: resolvedInfo.children.channels.map(ref =>
      channelRefToMessage(ref)
    ),
    subchannel_ref: resolvedInfo.children.subchannels.map(ref =>
      subchannelRefToMessage(ref)
    ),
  };
}

function GetChannel(
  call: ServerUnaryCall<GetChannelRequest__Output, GetChannelResponse>,
  callback: sendUnaryData<GetChannelResponse>
): void {
  const channelId = Number.parseInt(call.request.channel_id);
  const channelEntry = channels[channelId];
  if (channelEntry === undefined) {
    callback({
      code: Status.NOT_FOUND,
      details: 'No channel data found for id ' + channelId,
    });
    return;
  }
  callback(null, { channel: getChannelMessage(channelEntry) });
}

function GetTopChannels(
  call: ServerUnaryCall<GetTopChannelsRequest__Output, GetTopChannelsResponse>,
  callback: sendUnaryData<GetTopChannelsResponse>
): void {
  const maxResults = Number.parseInt(call.request.max_results);
  const resultList: ChannelMessage[] = [];
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

function getServerMessage(serverEntry: ServerEntry): ServerMessage {
  const resolvedInfo = serverEntry.getInfo();
  return {
    ref: serverRefToMessage(serverEntry.ref),
    data: {
      calls_started: resolvedInfo.callTracker.callsStarted,
      calls_succeeded: resolvedInfo.callTracker.callsSucceeded,
      calls_failed: resolvedInfo.callTracker.callsFailed,
      last_call_started_timestamp: dateToProtoTimestamp(
        resolvedInfo.callTracker.lastCallStartedTimestamp
      ),
      trace: resolvedInfo.trace.getTraceMessage(),
    },
    listen_socket: resolvedInfo.listenerChildren.sockets.map(ref =>
      socketRefToMessage(ref)
    ),
  };
}

function GetServer(
  call: ServerUnaryCall<GetServerRequest__Output, GetServerResponse>,
  callback: sendUnaryData<GetServerResponse>
): void {
  const serverId = Number.parseInt(call.request.server_id);
  const serverEntry = servers[serverId];
  if (serverEntry === undefined) {
    callback({
      code: Status.NOT_FOUND,
      details: 'No server data found for id ' + serverId,
    });
    return;
  }
  callback(null, { server: getServerMessage(serverEntry) });
}

function GetServers(
  call: ServerUnaryCall<GetServersRequest__Output, GetServersResponse>,
  callback: sendUnaryData<GetServersResponse>
): void {
  const maxResults = Number.parseInt(call.request.max_results);
  const resultList: ServerMessage[] = [];
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

function GetSubchannel(
  call: ServerUnaryCall<GetSubchannelRequest__Output, GetSubchannelResponse>,
  callback: sendUnaryData<GetSubchannelResponse>
): void {
  const subchannelId = Number.parseInt(call.request.subchannel_id);
  const subchannelEntry = subchannels[subchannelId];
  if (subchannelEntry === undefined) {
    callback({
      code: Status.NOT_FOUND,
      details: 'No subchannel data found for id ' + subchannelId,
    });
    return;
  }
  const resolvedInfo = subchannelEntry.getInfo();
  const subchannelMessage: SubchannelMessage = {
    ref: subchannelRefToMessage(subchannelEntry.ref),
    data: {
      target: resolvedInfo.target,
      state: connectivityStateToMessage(resolvedInfo.state),
      calls_started: resolvedInfo.callTracker.callsStarted,
      calls_succeeded: resolvedInfo.callTracker.callsSucceeded,
      calls_failed: resolvedInfo.callTracker.callsFailed,
      last_call_started_timestamp: dateToProtoTimestamp(
        resolvedInfo.callTracker.lastCallStartedTimestamp
      ),
      trace: resolvedInfo.trace.getTraceMessage(),
    },
    socket_ref: resolvedInfo.children.sockets.map(ref =>
      socketRefToMessage(ref)
    ),
  };
  callback(null, { subchannel: subchannelMessage });
}

function subchannelAddressToAddressMessage(
  subchannelAddress: SubchannelAddress
): Address {
  if (isTcpSubchannelAddress(subchannelAddress)) {
    return {
      address: 'tcpip_address',
      tcpip_address: {
        ip_address:
          ipAddressStringToBuffer(subchannelAddress.host) ?? undefined,
        port: subchannelAddress.port,
      },
    };
  } else {
    return {
      address: 'uds_address',
      uds_address: {
        filename: subchannelAddress.path,
      },
    };
  }
}

function GetSocket(
  call: ServerUnaryCall<GetSocketRequest__Output, GetSocketResponse>,
  callback: sendUnaryData<GetSocketResponse>
): void {
  const socketId = Number.parseInt(call.request.socket_id);
  const socketEntry = sockets[socketId];
  if (socketEntry === undefined) {
    callback({
      code: Status.NOT_FOUND,
      details: 'No socket data found for id ' + socketId,
    });
    return;
  }
  const resolvedInfo = socketEntry.getInfo();
  const securityMessage: Security | null = resolvedInfo.security
    ? {
        model: 'tls',
        tls: {
          cipher_suite: resolvedInfo.security.cipherSuiteStandardName
            ? 'standard_name'
            : 'other_name',
          standard_name:
            resolvedInfo.security.cipherSuiteStandardName ?? undefined,
          other_name: resolvedInfo.security.cipherSuiteOtherName ?? undefined,
          local_certificate:
            resolvedInfo.security.localCertificate ?? undefined,
          remote_certificate:
            resolvedInfo.security.remoteCertificate ?? undefined,
        },
      }
    : null;
  const socketMessage: SocketMessage = {
    ref: socketRefToMessage(socketEntry.ref),
    local: resolvedInfo.localAddress
      ? subchannelAddressToAddressMessage(resolvedInfo.localAddress)
      : null,
    remote: resolvedInfo.remoteAddress
      ? subchannelAddressToAddressMessage(resolvedInfo.remoteAddress)
      : null,
    remote_name: resolvedInfo.remoteName ?? undefined,
    security: securityMessage,
    data: {
      keep_alives_sent: resolvedInfo.keepAlivesSent,
      streams_started: resolvedInfo.streamsStarted,
      streams_succeeded: resolvedInfo.streamsSucceeded,
      streams_failed: resolvedInfo.streamsFailed,
      last_local_stream_created_timestamp: dateToProtoTimestamp(
        resolvedInfo.lastLocalStreamCreatedTimestamp
      ),
      last_remote_stream_created_timestamp: dateToProtoTimestamp(
        resolvedInfo.lastRemoteStreamCreatedTimestamp
      ),
      messages_received: resolvedInfo.messagesReceived,
      messages_sent: resolvedInfo.messagesSent,
      last_message_received_timestamp: dateToProtoTimestamp(
        resolvedInfo.lastMessageReceivedTimestamp
      ),
      last_message_sent_timestamp: dateToProtoTimestamp(
        resolvedInfo.lastMessageSentTimestamp
      ),
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

function GetServerSockets(
  call: ServerUnaryCall<
    GetServerSocketsRequest__Output,
    GetServerSocketsResponse
  >,
  callback: sendUnaryData<GetServerSocketsResponse>
): void {
  const serverId = Number.parseInt(call.request.server_id);
  const serverEntry = servers[serverId];
  if (serverEntry === undefined) {
    callback({
      code: Status.NOT_FOUND,
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
  const allSockets = resolvedInfo.sessionChildren.sockets.sort(
    (ref1, ref2) => ref1.id - ref2.id
  );
  const resultList: SocketRefMessage[] = [];
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

export function getChannelzHandlers(): ChannelzHandlers {
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

let loadedChannelzDefinition: ChannelzDefinition | null = null;

export function getChannelzServiceDefinition(): ChannelzDefinition {
  if (loadedChannelzDefinition) {
    return loadedChannelzDefinition;
  }
  /* The purpose of this complexity is to avoid loading @grpc/proto-loader at
   * runtime for users who will not use/enable channelz. */
  const loaderLoadSync = require('@grpc/proto-loader')
    .loadSync as typeof loadSync;
  const loadedProto = loaderLoadSync('channelz.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [`${__dirname}/../../proto`],
  });
  const channelzGrpcObject = loadPackageDefinition(
    loadedProto
  ) as unknown as ChannelzProtoGrpcType;
  loadedChannelzDefinition =
    channelzGrpcObject.grpc.channelz.v1.Channelz.service;
  return loadedChannelzDefinition;
}

export function setup() {
  registerAdminService(getChannelzServiceDefinition, getChannelzHandlers);
}
