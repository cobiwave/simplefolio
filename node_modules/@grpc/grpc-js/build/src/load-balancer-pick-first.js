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
exports.setup = exports.PickFirstLoadBalancer = exports.shuffled = exports.PickFirstLoadBalancingConfig = void 0;
const load_balancer_1 = require("./load-balancer");
const connectivity_state_1 = require("./connectivity-state");
const picker_1 = require("./picker");
const logging = require("./logging");
const constants_1 = require("./constants");
const TRACER_NAME = 'pick_first';
function trace(text) {
    logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, text);
}
const TYPE_NAME = 'pick_first';
/**
 * Delay after starting a connection on a subchannel before starting a
 * connection on the next subchannel in the list, for Happy Eyeballs algorithm.
 */
const CONNECTION_DELAY_INTERVAL_MS = 250;
class PickFirstLoadBalancingConfig {
    constructor(shuffleAddressList) {
        this.shuffleAddressList = shuffleAddressList;
    }
    getLoadBalancerName() {
        return TYPE_NAME;
    }
    toJsonObject() {
        return {
            [TYPE_NAME]: {
                shuffleAddressList: this.shuffleAddressList,
            },
        };
    }
    getShuffleAddressList() {
        return this.shuffleAddressList;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static createFromJson(obj) {
        if ('shuffleAddressList' in obj &&
            !(typeof obj.shuffleAddressList === 'boolean')) {
            throw new Error('pick_first config field shuffleAddressList must be a boolean if provided');
        }
        return new PickFirstLoadBalancingConfig(obj.shuffleAddressList === true);
    }
}
exports.PickFirstLoadBalancingConfig = PickFirstLoadBalancingConfig;
/**
 * Picker for a `PickFirstLoadBalancer` in the READY state. Always returns the
 * picked subchannel.
 */
class PickFirstPicker {
    constructor(subchannel) {
        this.subchannel = subchannel;
    }
    pick(pickArgs) {
        return {
            pickResultType: picker_1.PickResultType.COMPLETE,
            subchannel: this.subchannel,
            status: null,
            onCallStarted: null,
            onCallEnded: null,
        };
    }
}
/**
 * Return a new array with the elements of the input array in a random order
 * @param list The input array
 * @returns A shuffled array of the elements of list
 */
function shuffled(list) {
    const result = list.slice();
    for (let i = result.length - 1; i > 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }
    return result;
}
exports.shuffled = shuffled;
class PickFirstLoadBalancer {
    /**
     * Load balancer that attempts to connect to each backend in the address list
     * in order, and picks the first one that connects, using it for every
     * request.
     * @param channelControlHelper `ChannelControlHelper` instance provided by
     *     this load balancer's owner.
     */
    constructor(channelControlHelper) {
        this.channelControlHelper = channelControlHelper;
        /**
         * The list of subchannels this load balancer is currently attempting to
         * connect to.
         */
        this.children = [];
        /**
         * The current connectivity state of the load balancer.
         */
        this.currentState = connectivity_state_1.ConnectivityState.IDLE;
        /**
         * The index within the `subchannels` array of the subchannel with the most
         * recently started connection attempt.
         */
        this.currentSubchannelIndex = 0;
        /**
         * The currently picked subchannel used for making calls. Populated if
         * and only if the load balancer's current state is READY. In that case,
         * the subchannel's current state is also READY.
         */
        this.currentPick = null;
        /**
         * Listener callback attached to each subchannel in the `subchannels` list
         * while establishing a connection.
         */
        this.subchannelStateListener = (subchannel, previousState, newState, keepaliveTime, errorMessage) => {
            this.onSubchannelStateUpdate(subchannel, previousState, newState, errorMessage);
        };
        this.triedAllSubchannels = false;
        /**
         * The LB policy enters sticky TRANSIENT_FAILURE mode when all
         * subchannels have failed to connect at least once, and it stays in that
         * mode until a connection attempt is successful. While in sticky TF mode,
         * the LB policy continuously attempts to connect to all of its subchannels.
         */
        this.stickyTransientFailureMode = false;
        /**
         * Indicates whether we called channelControlHelper.requestReresolution since
         * the last call to updateAddressList
         */
        this.requestedResolutionSinceLastUpdate = false;
        /**
         * The most recent error reported by any subchannel as it transitioned to
         * TRANSIENT_FAILURE.
         */
        this.lastError = null;
        this.latestAddressList = null;
        this.connectionDelayTimeout = setTimeout(() => { }, 0);
        clearTimeout(this.connectionDelayTimeout);
    }
    allChildrenHaveReportedTF() {
        return this.children.every(child => child.hasReportedTransientFailure);
    }
    calculateAndReportNewState() {
        if (this.currentPick) {
            this.updateState(connectivity_state_1.ConnectivityState.READY, new PickFirstPicker(this.currentPick));
        }
        else if (this.children.length === 0) {
            this.updateState(connectivity_state_1.ConnectivityState.IDLE, new picker_1.QueuePicker(this));
        }
        else {
            if (this.stickyTransientFailureMode) {
                this.updateState(connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE, new picker_1.UnavailablePicker({ details: `No connection established. Last error: ${this.lastError}` }));
            }
            else {
                this.updateState(connectivity_state_1.ConnectivityState.CONNECTING, new picker_1.QueuePicker(this));
            }
        }
    }
    requestReresolution() {
        this.requestedResolutionSinceLastUpdate = true;
        this.channelControlHelper.requestReresolution();
    }
    maybeEnterStickyTransientFailureMode() {
        if (!this.allChildrenHaveReportedTF()) {
            return;
        }
        if (!this.requestedResolutionSinceLastUpdate) {
            /* Each time we get an update we reset each subchannel's
             * hasReportedTransientFailure flag, so the next time we get to this
             * point after that, each subchannel has reported TRANSIENT_FAILURE
             * at least once since then. That is the trigger for requesting
             * reresolution, whether or not the LB policy is already in sticky TF
             * mode. */
            this.requestReresolution();
        }
        if (this.stickyTransientFailureMode) {
            return;
        }
        this.stickyTransientFailureMode = true;
        for (const { subchannel } of this.children) {
            subchannel.startConnecting();
        }
        this.calculateAndReportNewState();
    }
    removeCurrentPick() {
        if (this.currentPick !== null) {
            /* Unref can cause a state change, which can cause a change in the value
             * of this.currentPick, so we hold a local reference to make sure that
             * does not impact this function. */
            const currentPick = this.currentPick;
            this.currentPick = null;
            currentPick.unref();
            currentPick.removeConnectivityStateListener(this.subchannelStateListener);
            this.channelControlHelper.removeChannelzChild(currentPick.getChannelzRef());
        }
    }
    onSubchannelStateUpdate(subchannel, previousState, newState, errorMessage) {
        var _a;
        if ((_a = this.currentPick) === null || _a === void 0 ? void 0 : _a.realSubchannelEquals(subchannel)) {
            if (newState !== connectivity_state_1.ConnectivityState.READY) {
                this.removeCurrentPick();
                this.calculateAndReportNewState();
                this.requestReresolution();
            }
            return;
        }
        for (const [index, child] of this.children.entries()) {
            if (subchannel.realSubchannelEquals(child.subchannel)) {
                if (newState === connectivity_state_1.ConnectivityState.READY) {
                    this.pickSubchannel(child.subchannel);
                }
                if (newState === connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE) {
                    child.hasReportedTransientFailure = true;
                    if (errorMessage) {
                        this.lastError = errorMessage;
                    }
                    this.maybeEnterStickyTransientFailureMode();
                    if (index === this.currentSubchannelIndex) {
                        this.startNextSubchannelConnecting(index + 1);
                    }
                }
                child.subchannel.startConnecting();
                return;
            }
        }
    }
    startNextSubchannelConnecting(startIndex) {
        clearTimeout(this.connectionDelayTimeout);
        if (this.triedAllSubchannels) {
            return;
        }
        for (const [index, child] of this.children.entries()) {
            if (index >= startIndex) {
                const subchannelState = child.subchannel.getConnectivityState();
                if (subchannelState === connectivity_state_1.ConnectivityState.IDLE ||
                    subchannelState === connectivity_state_1.ConnectivityState.CONNECTING) {
                    this.startConnecting(index);
                    return;
                }
            }
        }
        this.triedAllSubchannels = true;
        this.maybeEnterStickyTransientFailureMode();
    }
    /**
     * Have a single subchannel in the `subchannels` list start connecting.
     * @param subchannelIndex The index into the `subchannels` list.
     */
    startConnecting(subchannelIndex) {
        var _a, _b;
        clearTimeout(this.connectionDelayTimeout);
        this.currentSubchannelIndex = subchannelIndex;
        if (this.children[subchannelIndex].subchannel.getConnectivityState() ===
            connectivity_state_1.ConnectivityState.IDLE) {
            trace('Start connecting to subchannel with address ' +
                this.children[subchannelIndex].subchannel.getAddress());
            process.nextTick(() => {
                var _a;
                (_a = this.children[subchannelIndex]) === null || _a === void 0 ? void 0 : _a.subchannel.startConnecting();
            });
        }
        this.connectionDelayTimeout = (_b = (_a = setTimeout(() => {
            this.startNextSubchannelConnecting(subchannelIndex + 1);
        }, CONNECTION_DELAY_INTERVAL_MS)).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    pickSubchannel(subchannel) {
        if (this.currentPick && subchannel.realSubchannelEquals(this.currentPick)) {
            return;
        }
        trace('Pick subchannel with address ' + subchannel.getAddress());
        this.stickyTransientFailureMode = false;
        if (this.currentPick !== null) {
            this.currentPick.unref();
            this.channelControlHelper.removeChannelzChild(this.currentPick.getChannelzRef());
            this.currentPick.removeConnectivityStateListener(this.subchannelStateListener);
        }
        this.currentPick = subchannel;
        subchannel.ref();
        this.channelControlHelper.addChannelzChild(subchannel.getChannelzRef());
        this.resetSubchannelList();
        clearTimeout(this.connectionDelayTimeout);
        this.calculateAndReportNewState();
    }
    updateState(newState, picker) {
        trace(connectivity_state_1.ConnectivityState[this.currentState] +
            ' -> ' +
            connectivity_state_1.ConnectivityState[newState]);
        this.currentState = newState;
        this.channelControlHelper.updateState(newState, picker);
    }
    resetSubchannelList() {
        for (const child of this.children) {
            if (!(this.currentPick && child.subchannel.realSubchannelEquals(this.currentPick))) {
                /* The connectivity state listener is the same whether the subchannel
                 * is in the list of children or it is the currentPick, so if it is in
                 * both, removing it here would cause problems. In particular, that
                 * always happens immediately after the subchannel is picked. */
                child.subchannel.removeConnectivityStateListener(this.subchannelStateListener);
            }
            /* Refs are counted independently for the children list and the
             * currentPick, so we call unref whether or not the child is the
             * currentPick. Channelz child references are also refcounted, so
             * removeChannelzChild can be handled the same way. */
            child.subchannel.unref();
            this.channelControlHelper.removeChannelzChild(child.subchannel.getChannelzRef());
        }
        this.currentSubchannelIndex = 0;
        this.children = [];
        this.triedAllSubchannels = false;
        this.requestedResolutionSinceLastUpdate = false;
    }
    connectToAddressList(addressList) {
        const newChildrenList = addressList.map(address => ({
            subchannel: this.channelControlHelper.createSubchannel(address, {}),
            hasReportedTransientFailure: false,
        }));
        /* Ref each subchannel before resetting the list, to ensure that
         * subchannels shared between the list don't drop to 0 refs during the
         * transition. */
        for (const { subchannel } of newChildrenList) {
            subchannel.ref();
            this.channelControlHelper.addChannelzChild(subchannel.getChannelzRef());
        }
        this.resetSubchannelList();
        this.children = newChildrenList;
        for (const { subchannel } of this.children) {
            subchannel.addConnectivityStateListener(this.subchannelStateListener);
            if (subchannel.getConnectivityState() === connectivity_state_1.ConnectivityState.READY) {
                this.pickSubchannel(subchannel);
                return;
            }
        }
        for (const child of this.children) {
            if (child.subchannel.getConnectivityState() ===
                connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE) {
                child.hasReportedTransientFailure = true;
            }
        }
        this.startNextSubchannelConnecting(0);
        this.calculateAndReportNewState();
    }
    updateAddressList(addressList, lbConfig) {
        if (!(lbConfig instanceof PickFirstLoadBalancingConfig)) {
            return;
        }
        /* Previously, an update would be discarded if it was identical to the
         * previous update, to minimize churn. Now the DNS resolver is
         * rate-limited, so that is less of a concern. */
        if (lbConfig.getShuffleAddressList()) {
            addressList = shuffled(addressList);
        }
        this.latestAddressList = addressList;
        this.connectToAddressList(addressList);
    }
    exitIdle() {
        if (this.currentState === connectivity_state_1.ConnectivityState.IDLE && this.latestAddressList) {
            this.connectToAddressList(this.latestAddressList);
        }
    }
    resetBackoff() {
        /* The pick first load balancer does not have a connection backoff, so this
         * does nothing */
    }
    destroy() {
        this.resetSubchannelList();
        this.removeCurrentPick();
    }
    getTypeName() {
        return TYPE_NAME;
    }
}
exports.PickFirstLoadBalancer = PickFirstLoadBalancer;
function setup() {
    (0, load_balancer_1.registerLoadBalancerType)(TYPE_NAME, PickFirstLoadBalancer, PickFirstLoadBalancingConfig);
    (0, load_balancer_1.registerDefaultLoadBalancerType)(TYPE_NAME);
}
exports.setup = setup;
//# sourceMappingURL=load-balancer-pick-first.js.map