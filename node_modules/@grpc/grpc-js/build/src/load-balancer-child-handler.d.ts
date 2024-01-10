import { LoadBalancer, ChannelControlHelper, LoadBalancingConfig } from './load-balancer';
import { SubchannelAddress } from './subchannel-address';
export declare class ChildLoadBalancerHandler implements LoadBalancer {
    private readonly channelControlHelper;
    private currentChild;
    private pendingChild;
    private latestConfig;
    private ChildPolicyHelper;
    constructor(channelControlHelper: ChannelControlHelper);
    protected configUpdateRequiresNewPolicyInstance(oldConfig: LoadBalancingConfig, newConfig: LoadBalancingConfig): boolean;
    /**
     * Prerequisites: lbConfig !== null and lbConfig.name is registered
     * @param addressList
     * @param lbConfig
     * @param attributes
     */
    updateAddressList(addressList: SubchannelAddress[], lbConfig: LoadBalancingConfig, attributes: {
        [key: string]: unknown;
    }): void;
    exitIdle(): void;
    resetBackoff(): void;
    destroy(): void;
    getTypeName(): string;
}
