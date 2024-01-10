"use strict";
/*
 * Copyright 2020 gRPC authors.
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
exports.MaxMessageSizeFilterFactory = exports.MaxMessageSizeFilter = void 0;
const filter_1 = require("./filter");
const constants_1 = require("./constants");
const metadata_1 = require("./metadata");
class MaxMessageSizeFilter extends filter_1.BaseFilter {
    constructor(options) {
        super();
        this.maxSendMessageSize = constants_1.DEFAULT_MAX_SEND_MESSAGE_LENGTH;
        this.maxReceiveMessageSize = constants_1.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
        if ('grpc.max_send_message_length' in options) {
            this.maxSendMessageSize = options['grpc.max_send_message_length'];
        }
        if ('grpc.max_receive_message_length' in options) {
            this.maxReceiveMessageSize = options['grpc.max_receive_message_length'];
        }
    }
    async sendMessage(message) {
        /* A configured size of -1 means that there is no limit, so skip the check
         * entirely */
        if (this.maxSendMessageSize === -1) {
            return message;
        }
        else {
            const concreteMessage = await message;
            if (concreteMessage.message.length > this.maxSendMessageSize) {
                throw {
                    code: constants_1.Status.RESOURCE_EXHAUSTED,
                    details: `Sent message larger than max (${concreteMessage.message.length} vs. ${this.maxSendMessageSize})`,
                    metadata: new metadata_1.Metadata(),
                };
            }
            else {
                return concreteMessage;
            }
        }
    }
    async receiveMessage(message) {
        /* A configured size of -1 means that there is no limit, so skip the check
         * entirely */
        if (this.maxReceiveMessageSize === -1) {
            return message;
        }
        else {
            const concreteMessage = await message;
            if (concreteMessage.length > this.maxReceiveMessageSize) {
                throw {
                    code: constants_1.Status.RESOURCE_EXHAUSTED,
                    details: `Received message larger than max (${concreteMessage.length} vs. ${this.maxReceiveMessageSize})`,
                    metadata: new metadata_1.Metadata(),
                };
            }
            else {
                return concreteMessage;
            }
        }
    }
}
exports.MaxMessageSizeFilter = MaxMessageSizeFilter;
class MaxMessageSizeFilterFactory {
    constructor(options) {
        this.options = options;
    }
    createFilter() {
        return new MaxMessageSizeFilter(this.options);
    }
}
exports.MaxMessageSizeFilterFactory = MaxMessageSizeFilterFactory;
//# sourceMappingURL=max-message-size-filter.js.map