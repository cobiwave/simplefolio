import { LoadBalancer, ChannelControlHelper, LoadBalancingConfig } from './load-balancer';
import { SubchannelAddress } from './subchannel-address';
export declare class PickFirstLoadBalancingConfig implements LoadBalancingConfig {
    private readonly shuffleAddressList;
    constructor(shuffleAddressList: boolean);
    getLoadBalancerName(): string;
    toJsonObject(): object;
    getShuffleAddressList(): boolean;
    static createFromJson(obj: any): PickFirstLoadBalancingConfig;
}
/**
 * Return a new array with the elements of the input array in a random order
 * @param list The input array
 * @returns A shuffled array of the elements of list
 */
export declare function shuffled<T>(list: T[]): T[];
export declare class PickFirstLoadBalancer implements LoadBalancer {
    private readonly channelControlHelper;
    /**
     * The list of subchannels this load balancer is currently attempting to
     * connect to.
     */
    private children;
    /**
     * The current connectivity state of the load balancer.
     */
    private currentState;
    /**
     * The index within the `subchannels` array of the subchannel with the most
     * recently started connection attempt.
     */
    private currentSubchannelIndex;
    /**
     * The currently picked subchannel used for making calls. Populated if
     * and only if the load balancer's current state is READY. In that case,
     * the subchannel's current state is also READY.
     */
    private currentPick;
    /**
     * Listener callback attached to each subchannel in the `subchannels` list
     * while establishing a connection.
     */
    private subchannelStateListener;
    /**
     * Timer reference for the timer tracking when to start
     */
    private connectionDelayTimeout;
    private triedAllSubchannels;
    /**
     * The LB policy enters sticky TRANSIENT_FAILURE mode when all
     * subchannels have failed to connect at least once, and it stays in that
     * mode until a connection attempt is successful. While in sticky TF mode,
     * the LB policy continuously attempts to connect to all of its subchannels.
     */
    private stickyTransientFailureMode;
    /**
     * Indicates whether we called channelControlHelper.requestReresolution since
     * the last call to updateAddressList
     */
    private requestedResolutionSinceLastUpdate;
    /**
     * The most recent error reported by any subchannel as it transitioned to
     * TRANSIENT_FAILURE.
     */
    private lastError;
    private latestAddressList;
    /**
     * Load balancer that attempts to connect to each backend in the address list
     * in order, and picks the first one that connects, using it for every
     * request.
     * @param channelControlHelper `ChannelControlHelper` instance provided by
     *     this load balancer's owner.
     */
    constructor(channelControlHelper: ChannelControlHelper);
    private allChildrenHaveReportedTF;
    private calculateAndReportNewState;
    private requestReresolution;
    private maybeEnterStickyTransientFailureMode;
    private removeCurrentPick;
    private onSubchannelStateUpdate;
    private startNextSubchannelConnecting;
    /**
     * Have a single subchannel in the `subchannels` list start connecting.
     * @param subchannelIndex The index into the `subchannels` list.
     */
    private startConnecting;
    private pickSubchannel;
    private updateState;
    private resetSubchannelList;
    private connectToAddressList;
    updateAddressList(addressList: SubchannelAddress[], lbConfig: LoadBalancingConfig): void;
    exitIdle(): void;
    resetBackoff(): void;
    destroy(): void;
    getTypeName(): string;
}
export declare function setup(): void;
