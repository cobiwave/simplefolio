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
exports.setup = exports.RoundRobinLoadBalancer = void 0;
const load_balancer_1 = require("./load-balancer");
const connectivity_state_1 = require("./connectivity-state");
const picker_1 = require("./picker");
const subchannel_address_1 = require("./subchannel-address");
const logging = require("./logging");
const constants_1 = require("./constants");
const TRACER_NAME = 'round_robin';
function trace(text) {
    logging.trace(constants_1.LogVerbosity.DEBUG, TRACER_NAME, text);
}
const TYPE_NAME = 'round_robin';
class RoundRobinLoadBalancingConfig {
    getLoadBalancerName() {
        return TYPE_NAME;
    }
    constructor() { }
    toJsonObject() {
        return {
            [TYPE_NAME]: {},
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static createFromJson(obj) {
        return new RoundRobinLoadBalancingConfig();
    }
}
class RoundRobinPicker {
    constructor(subchannelList, nextIndex = 0) {
        this.subchannelList = subchannelList;
        this.nextIndex = nextIndex;
    }
    pick(pickArgs) {
        const pickedSubchannel = this.subchannelList[this.nextIndex];
        this.nextIndex = (this.nextIndex + 1) % this.subchannelList.length;
        return {
            pickResultType: picker_1.PickResultType.COMPLETE,
            subchannel: pickedSubchannel,
            status: null,
            onCallStarted: null,
            onCallEnded: null,
        };
    }
    /**
     * Check what the next subchannel returned would be. Used by the load
     * balancer implementation to preserve this part of the picker state if
     * possible when a subchannel connects or disconnects.
     */
    peekNextSubchannel() {
        return this.subchannelList[this.nextIndex];
    }
}
class RoundRobinLoadBalancer {
    constructor(channelControlHelper) {
        this.channelControlHelper = channelControlHelper;
        this.subchannels = [];
        this.currentState = connectivity_state_1.ConnectivityState.IDLE;
        this.currentReadyPicker = null;
        this.lastError = null;
        this.subchannelStateListener = (subchannel, previousState, newState, keepaliveTime, errorMessage) => {
            this.calculateAndUpdateState();
            if (newState === connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE ||
                newState === connectivity_state_1.ConnectivityState.IDLE) {
                if (errorMessage) {
                    this.lastError = errorMessage;
                }
                this.channelControlHelper.requestReresolution();
                subchannel.startConnecting();
            }
        };
    }
    countSubchannelsWithState(state) {
        return this.subchannels.filter(subchannel => subchannel.getConnectivityState() === state).length;
    }
    calculateAndUpdateState() {
        if (this.countSubchannelsWithState(connectivity_state_1.ConnectivityState.READY) > 0) {
            const readySubchannels = this.subchannels.filter(subchannel => subchannel.getConnectivityState() === connectivity_state_1.ConnectivityState.READY);
            let index = 0;
            if (this.currentReadyPicker !== null) {
                index = readySubchannels.indexOf(this.currentReadyPicker.peekNextSubchannel());
                if (index < 0) {
                    index = 0;
                }
            }
            this.updateState(connectivity_state_1.ConnectivityState.READY, new RoundRobinPicker(readySubchannels, index));
        }
        else if (this.countSubchannelsWithState(connectivity_state_1.ConnectivityState.CONNECTING) > 0) {
            this.updateState(connectivity_state_1.ConnectivityState.CONNECTING, new picker_1.QueuePicker(this));
        }
        else if (this.countSubchannelsWithState(connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE) > 0) {
            this.updateState(connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE, new picker_1.UnavailablePicker({ details: `No connection established. Last error: ${this.lastError}` }));
        }
        else {
            this.updateState(connectivity_state_1.ConnectivityState.IDLE, new picker_1.QueuePicker(this));
        }
    }
    updateState(newState, picker) {
        trace(connectivity_state_1.ConnectivityState[this.currentState] +
            ' -> ' +
            connectivity_state_1.ConnectivityState[newState]);
        if (newState === connectivity_state_1.ConnectivityState.READY) {
            this.currentReadyPicker = picker;
        }
        else {
            this.currentReadyPicker = null;
        }
        this.currentState = newState;
        this.channelControlHelper.updateState(newState, picker);
    }
    resetSubchannelList() {
        for (const subchannel of this.subchannels) {
            subchannel.removeConnectivityStateListener(this.subchannelStateListener);
            subchannel.unref();
            this.channelControlHelper.removeChannelzChild(subchannel.getChannelzRef());
        }
        this.subchannels = [];
    }
    updateAddressList(addressList, lbConfig) {
        this.resetSubchannelList();
        trace('Connect to address list ' +
            addressList.map(address => (0, subchannel_address_1.subchannelAddressToString)(address)));
        this.subchannels = addressList.map(address => this.channelControlHelper.createSubchannel(address, {}));
        for (const subchannel of this.subchannels) {
            subchannel.ref();
            subchannel.addConnectivityStateListener(this.subchannelStateListener);
            this.channelControlHelper.addChannelzChild(subchannel.getChannelzRef());
            const subchannelState = subchannel.getConnectivityState();
            if (subchannelState === connectivity_state_1.ConnectivityState.IDLE ||
                subchannelState === connectivity_state_1.ConnectivityState.TRANSIENT_FAILURE) {
                subchannel.startConnecting();
            }
        }
        this.calculateAndUpdateState();
    }
    exitIdle() {
        for (const subchannel of this.subchannels) {
            subchannel.startConnecting();
        }
    }
    resetBackoff() {
        /* The pick first load balancer does not have a connection backoff, so this
         * does nothing */
    }
    destroy() {
        this.resetSubchannelList();
    }
    getTypeName() {
        return TYPE_NAME;
    }
}
exports.RoundRobinLoadBalancer = RoundRobinLoadBalancer;
function setup() {
    (0, load_balancer_1.registerLoadBalancerType)(TYPE_NAME, RoundRobinLoadBalancer, RoundRobinLoadBalancingConfig);
}
exports.setup = setup;
//# sourceMappingURL=load-balancer-round-robin.js.map