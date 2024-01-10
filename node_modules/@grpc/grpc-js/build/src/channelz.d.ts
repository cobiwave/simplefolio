/// <reference types="node" />
import { ConnectivityState } from './connectivity-state';
import { ChannelTrace } from './generated/grpc/channelz/v1/ChannelTrace';
import { SubchannelAddress } from './subchannel-address';
import { ChannelzDefinition, ChannelzHandlers } from './generated/grpc/channelz/v1/Channelz';
export type TraceSeverity = 'CT_UNKNOWN' | 'CT_INFO' | 'CT_WARNING' | 'CT_ERROR';
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
interface TraceEvent {
    description: string;
    severity: TraceSeverity;
    timestamp: Date;
    childChannel?: ChannelRef;
    childSubchannel?: SubchannelRef;
}
export declare class ChannelzTrace {
    events: TraceEvent[];
    creationTimestamp: Date;
    eventsLogged: number;
    constructor();
    addTrace(severity: TraceSeverity, description: string, child?: ChannelRef | SubchannelRef): void;
    getTraceMessage(): ChannelTrace;
}
export declare class ChannelzChildrenTracker {
    private channelChildren;
    private subchannelChildren;
    private socketChildren;
    refChild(child: ChannelRef | SubchannelRef | SocketRef): void;
    unrefChild(child: ChannelRef | SubchannelRef | SocketRef): void;
    getChildLists(): ChannelzChildren;
}
export declare class ChannelzCallTracker {
    callsStarted: number;
    callsSucceeded: number;
    callsFailed: number;
    lastCallStartedTimestamp: Date | null;
    addCallStarted(): void;
    addCallSucceeded(): void;
    addCallFailed(): void;
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
export declare function registerChannelzChannel(name: string, getInfo: () => ChannelInfo, channelzEnabled: boolean): ChannelRef;
export declare function registerChannelzSubchannel(name: string, getInfo: () => SubchannelInfo, channelzEnabled: boolean): SubchannelRef;
export declare function registerChannelzServer(getInfo: () => ServerInfo, channelzEnabled: boolean): ServerRef;
export declare function registerChannelzSocket(name: string, getInfo: () => SocketInfo, channelzEnabled: boolean): SocketRef;
export declare function unregisterChannelzRef(ref: ChannelRef | SubchannelRef | ServerRef | SocketRef): void;
export declare function getChannelzHandlers(): ChannelzHandlers;
export declare function getChannelzServiceDefinition(): ChannelzDefinition;
export declare function setup(): void;
export {};
