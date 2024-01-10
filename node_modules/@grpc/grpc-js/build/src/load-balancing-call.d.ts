/// <reference types="node" />
import { CallCredentials } from './call-credentials';
import { Call, InterceptingListener, MessageContext, StatusObject } from './call-interface';
import { Status } from './constants';
import { Deadline } from './deadline';
import { InternalChannel } from './internal-channel';
import { Metadata } from './metadata';
import { CallConfig } from './resolver';
export type RpcProgress = 'NOT_STARTED' | 'DROP' | 'REFUSED' | 'PROCESSED';
export interface StatusObjectWithProgress extends StatusObject {
    progress: RpcProgress;
}
export interface LoadBalancingCallInterceptingListener extends InterceptingListener {
    onReceiveStatus(status: StatusObjectWithProgress): void;
}
export declare class LoadBalancingCall implements Call {
    private readonly channel;
    private readonly callConfig;
    private readonly methodName;
    private readonly host;
    private readonly credentials;
    private readonly deadline;
    private readonly callNumber;
    private child;
    private readPending;
    private pendingMessage;
    private pendingHalfClose;
    private ended;
    private serviceUrl;
    private metadata;
    private listener;
    private onCallEnded;
    constructor(channel: InternalChannel, callConfig: CallConfig, methodName: string, host: string, credentials: CallCredentials, deadline: Deadline, callNumber: number);
    private trace;
    private outputStatus;
    doPick(): void;
    cancelWithStatus(status: Status, details: string): void;
    getPeer(): string;
    start(metadata: Metadata, listener: LoadBalancingCallInterceptingListener): void;
    sendMessageWithContext(context: MessageContext, message: Buffer): void;
    startRead(): void;
    halfClose(): void;
    setCredentials(credentials: CallCredentials): void;
    getCallNumber(): number;
}
