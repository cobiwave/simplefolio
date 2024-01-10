import { Deserialize, Serialize, ServiceDefinition } from './make-client';
import { HandleCall } from './server-call';
import { ServerCredentials } from './server-credentials';
import { ChannelOptions } from './channel-options';
import { ServerRef } from './channelz';
export type UntypedHandleCall = HandleCall<any, any>;
export interface UntypedServiceImplementation {
    [name: string]: UntypedHandleCall;
}
export declare class Server {
    private http2ServerList;
    private handlers;
    private sessions;
    private started;
    private shutdown;
    private options;
    private serverAddressString;
    private readonly channelzEnabled;
    private channelzRef;
    private channelzTrace;
    private callTracker;
    private listenerChildrenTracker;
    private sessionChildrenTracker;
    private readonly maxConnectionAgeMs;
    private readonly maxConnectionAgeGraceMs;
    private readonly keepaliveTimeMs;
    private readonly keepaliveTimeoutMs;
    constructor(options?: ChannelOptions);
    private getChannelzInfo;
    private getChannelzSessionInfoGetter;
    private trace;
    addProtoService(): never;
    addService(service: ServiceDefinition, implementation: UntypedServiceImplementation): void;
    removeService(service: ServiceDefinition): void;
    bind(port: string, creds: ServerCredentials): never;
    bindAsync(port: string, creds: ServerCredentials, callback: (error: Error | null, port: number) => void): void;
    forceShutdown(): void;
    register<RequestType, ResponseType>(name: string, handler: HandleCall<RequestType, ResponseType>, serialize: Serialize<ResponseType>, deserialize: Deserialize<RequestType>, type: string): boolean;
    unregister(name: string): boolean;
    start(): void;
    tryShutdown(callback: (error?: Error) => void): void;
    addHttp2Port(): never;
    /**
     * Get the channelz reference object for this server. The returned value is
     * garbage if channelz is disabled for this server.
     * @returns
     */
    getChannelzRef(): ServerRef;
    private _verifyContentType;
    private _retrieveHandler;
    private _respondWithError;
    private _channelzHandler;
    private _streamHandler;
    private _runHandlerForCall;
    private _setupHandlers;
}
