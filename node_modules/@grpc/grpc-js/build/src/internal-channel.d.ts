import { ChannelCredentials } from './channel-credentials';
import { ChannelOptions } from './channel-options';
import { Metadata } from './metadata';
import { CallConfig } from './resolver';
import { ServerSurfaceCall } from './server-call';
import { ConnectivityState } from './connectivity-state';
import { ChannelRef } from './channelz';
import { LoadBalancingCall } from './load-balancing-call';
import { CallCredentials } from './call-credentials';
import { Call, StatusObject } from './call-interface';
import { Deadline } from './deadline';
import { ResolvingCall } from './resolving-call';
import { RetryingCall } from './retrying-call';
import { BaseSubchannelWrapper, SubchannelInterface } from './subchannel-interface';
interface NoneConfigResult {
    type: 'NONE';
}
interface SuccessConfigResult {
    type: 'SUCCESS';
    config: CallConfig;
}
interface ErrorConfigResult {
    type: 'ERROR';
    error: StatusObject;
}
type GetConfigResult = NoneConfigResult | SuccessConfigResult | ErrorConfigResult;
declare class ChannelSubchannelWrapper extends BaseSubchannelWrapper implements SubchannelInterface {
    private channel;
    private refCount;
    private subchannelStateListener;
    constructor(childSubchannel: SubchannelInterface, channel: InternalChannel);
    ref(): void;
    unref(): void;
}
export declare class InternalChannel {
    private readonly credentials;
    private readonly options;
    private readonly resolvingLoadBalancer;
    private readonly subchannelPool;
    private connectivityState;
    private currentPicker;
    /**
     * Calls queued up to get a call config. Should only be populated before the
     * first time the resolver returns a result, which includes the ConfigSelector.
     */
    private configSelectionQueue;
    private pickQueue;
    private connectivityStateWatchers;
    private readonly defaultAuthority;
    private readonly filterStackFactory;
    private readonly target;
    /**
     * This timer does not do anything on its own. Its purpose is to hold the
     * event loop open while there are any pending calls for the channel that
     * have not yet been assigned to specific subchannels. In other words,
     * the invariant is that callRefTimer is reffed if and only if pickQueue
     * is non-empty.
     */
    private readonly callRefTimer;
    private configSelector;
    /**
     * This is the error from the name resolver if it failed most recently. It
     * is only used to end calls that start while there is no config selector
     * and the name resolver is in backoff, so it should be nulled if
     * configSelector becomes set or the channel state becomes anything other
     * than TRANSIENT_FAILURE.
     */
    private currentResolutionError;
    private readonly retryBufferTracker;
    private keepaliveTime;
    private readonly wrappedSubchannels;
    private callCount;
    private idleTimer;
    private readonly idleTimeoutMs;
    private readonly channelzEnabled;
    private readonly originalTarget;
    private readonly channelzRef;
    private readonly channelzTrace;
    private readonly callTracker;
    private readonly childrenTracker;
    constructor(target: string, credentials: ChannelCredentials, options: ChannelOptions);
    private getChannelzInfo;
    private trace;
    private callRefTimerRef;
    private callRefTimerUnref;
    private removeConnectivityStateWatcher;
    private updateState;
    throttleKeepalive(newKeepaliveTime: number): void;
    removeWrappedSubchannel(wrappedSubchannel: ChannelSubchannelWrapper): void;
    doPick(metadata: Metadata, extraPickInfo: {
        [key: string]: string;
    }): import("./picker").PickResult;
    queueCallForPick(call: LoadBalancingCall): void;
    getConfig(method: string, metadata: Metadata): GetConfigResult;
    queueCallForConfig(call: ResolvingCall): void;
    private enterIdle;
    private maybeStartIdleTimer;
    private onCallStart;
    private onCallEnd;
    createLoadBalancingCall(callConfig: CallConfig, method: string, host: string, credentials: CallCredentials, deadline: Deadline): LoadBalancingCall;
    createRetryingCall(callConfig: CallConfig, method: string, host: string, credentials: CallCredentials, deadline: Deadline): RetryingCall;
    createInnerCall(callConfig: CallConfig, method: string, host: string, credentials: CallCredentials, deadline: Deadline): Call;
    createResolvingCall(method: string, deadline: Deadline, host: string | null | undefined, parentCall: ServerSurfaceCall | null, propagateFlags: number | null | undefined): ResolvingCall;
    close(): void;
    getTarget(): string;
    getConnectivityState(tryToConnect: boolean): ConnectivityState;
    watchConnectivityState(currentState: ConnectivityState, deadline: Date | number, callback: (error?: Error) => void): void;
    /**
     * Get the channelz reference object for this channel. The returned value is
     * garbage if channelz is disabled for this channel.
     * @returns
     */
    getChannelzRef(): ChannelRef;
    createCall(method: string, deadline: Deadline, host: string | null | undefined, parentCall: ServerSurfaceCall | null, propagateFlags: number | null | undefined): Call;
}
export {};
