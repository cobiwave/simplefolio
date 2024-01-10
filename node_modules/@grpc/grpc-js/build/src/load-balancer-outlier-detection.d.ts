import { ChannelControlHelper } from './experimental';
import { LoadBalancer, LoadBalancingConfig } from './load-balancer';
import { SubchannelAddress } from './subchannel-address';
export interface SuccessRateEjectionConfig {
    readonly stdev_factor: number;
    readonly enforcement_percentage: number;
    readonly minimum_hosts: number;
    readonly request_volume: number;
}
export interface FailurePercentageEjectionConfig {
    readonly threshold: number;
    readonly enforcement_percentage: number;
    readonly minimum_hosts: number;
    readonly request_volume: number;
}
export declare class OutlierDetectionLoadBalancingConfig implements LoadBalancingConfig {
    private readonly childPolicy;
    private readonly intervalMs;
    private readonly baseEjectionTimeMs;
    private readonly maxEjectionTimeMs;
    private readonly maxEjectionPercent;
    private readonly successRateEjection;
    private readonly failurePercentageEjection;
    constructor(intervalMs: number | null, baseEjectionTimeMs: number | null, maxEjectionTimeMs: number | null, maxEjectionPercent: number | null, successRateEjection: Partial<SuccessRateEjectionConfig> | null, failurePercentageEjection: Partial<FailurePercentageEjectionConfig> | null, childPolicy: LoadBalancingConfig[]);
    getLoadBalancerName(): string;
    toJsonObject(): object;
    getIntervalMs(): number;
    getBaseEjectionTimeMs(): number;
    getMaxEjectionTimeMs(): number;
    getMaxEjectionPercent(): number;
    getSuccessRateEjectionConfig(): SuccessRateEjectionConfig | null;
    getFailurePercentageEjectionConfig(): FailurePercentageEjectionConfig | null;
    getChildPolicy(): LoadBalancingConfig[];
    copyWithChildPolicy(childPolicy: LoadBalancingConfig[]): OutlierDetectionLoadBalancingConfig;
    static createFromJson(obj: any): OutlierDetectionLoadBalancingConfig;
}
export declare class OutlierDetectionLoadBalancer implements LoadBalancer {
    private childBalancer;
    private addressMap;
    private latestConfig;
    private ejectionTimer;
    private timerStartTime;
    constructor(channelControlHelper: ChannelControlHelper);
    private isCountingEnabled;
    private getCurrentEjectionPercent;
    private runSuccessRateCheck;
    private runFailurePercentageCheck;
    private eject;
    private uneject;
    private switchAllBuckets;
    private startTimer;
    private runChecks;
    updateAddressList(addressList: SubchannelAddress[], lbConfig: LoadBalancingConfig, attributes: {
        [key: string]: unknown;
    }): void;
    exitIdle(): void;
    resetBackoff(): void;
    destroy(): void;
    getTypeName(): string;
}
export declare function setup(): void;
