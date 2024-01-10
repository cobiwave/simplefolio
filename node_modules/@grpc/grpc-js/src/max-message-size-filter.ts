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

import { BaseFilter, Filter, FilterFactory } from './filter';
import { WriteObject } from './call-interface';
import {
  Status,
  DEFAULT_MAX_SEND_MESSAGE_LENGTH,
  DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH,
} from './constants';
import { ChannelOptions } from './channel-options';
import { Metadata } from './metadata';

export class MaxMessageSizeFilter extends BaseFilter implements Filter {
  private maxSendMessageSize: number = DEFAULT_MAX_SEND_MESSAGE_LENGTH;
  private maxReceiveMessageSize: number = DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
  constructor(options: ChannelOptions) {
    super();
    if ('grpc.max_send_message_length' in options) {
      this.maxSendMessageSize = options['grpc.max_send_message_length']!;
    }
    if ('grpc.max_receive_message_length' in options) {
      this.maxReceiveMessageSize = options['grpc.max_receive_message_length']!;
    }
  }

  async sendMessage(message: Promise<WriteObject>): Promise<WriteObject> {
    /* A configured size of -1 means that there is no limit, so skip the check
     * entirely */
    if (this.maxSendMessageSize === -1) {
      return message;
    } else {
      const concreteMessage = await message;
      if (concreteMessage.message.length > this.maxSendMessageSize) {
        throw {
          code: Status.RESOURCE_EXHAUSTED,
          details: `Sent message larger than max (${concreteMessage.message.length} vs. ${this.maxSendMessageSize})`,
          metadata: new Metadata(),
        };
      } else {
        return concreteMessage;
      }
    }
  }

  async receiveMessage(message: Promise<Buffer>): Promise<Buffer> {
    /* A configured size of -1 means that there is no limit, so skip the check
     * entirely */
    if (this.maxReceiveMessageSize === -1) {
      return message;
    } else {
      const concreteMessage = await message;
      if (concreteMessage.length > this.maxReceiveMessageSize) {
        throw {
          code: Status.RESOURCE_EXHAUSTED,
          details: `Received message larger than max (${concreteMessage.length} vs. ${this.maxReceiveMessageSize})`,
          metadata: new Metadata(),
        };
      } else {
        return concreteMessage;
      }
    }
  }
}

export class MaxMessageSizeFilterFactory
  implements FilterFactory<MaxMessageSizeFilter>
{
  constructor(private readonly options: ChannelOptions) {}

  createFilter(): MaxMessageSizeFilter {
    return new MaxMessageSizeFilter(this.options);
  }
}
