/// <reference types="node" />
import { BaseFilter, Filter, FilterFactory } from './filter';
import { WriteObject } from './call-interface';
import { ChannelOptions } from './channel-options';
export declare class MaxMessageSizeFilter extends BaseFilter implements Filter {
    private maxSendMessageSize;
    private maxReceiveMessageSize;
    constructor(options: ChannelOptions);
    sendMessage(message: Promise<WriteObject>): Promise<WriteObject>;
    receiveMessage(message: Promise<Buffer>): Promise<Buffer>;
}
export declare class MaxMessageSizeFilterFactory implements FilterFactory<MaxMessageSizeFilter> {
    private readonly options;
    constructor(options: ChannelOptions);
    createFilter(): MaxMessageSizeFilter;
}
