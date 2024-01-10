"use strict";
/*
 * Copyright 2022 gRPC authors.
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
exports.BaseSubchannelWrapper = void 0;
class BaseSubchannelWrapper {
    constructor(child) {
        this.child = child;
    }
    getConnectivityState() {
        return this.child.getConnectivityState();
    }
    addConnectivityStateListener(listener) {
        this.child.addConnectivityStateListener(listener);
    }
    removeConnectivityStateListener(listener) {
        this.child.removeConnectivityStateListener(listener);
    }
    startConnecting() {
        this.child.startConnecting();
    }
    getAddress() {
        return this.child.getAddress();
    }
    throttleKeepalive(newKeepaliveTime) {
        this.child.throttleKeepalive(newKeepaliveTime);
    }
    ref() {
        this.child.ref();
    }
    unref() {
        this.child.unref();
    }
    getChannelzRef() {
        return this.child.getChannelzRef();
    }
    getRealSubchannel() {
        return this.child.getRealSubchannel();
    }
    realSubchannelEquals(other) {
        return this.getRealSubchannel() === other.getRealSubchannel();
    }
}
exports.BaseSubchannelWrapper = BaseSubchannelWrapper;
//# sourceMappingURL=subchannel-interface.js.map