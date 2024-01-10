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

import * as http2 from 'http2';
import { AddressInfo } from 'net';

import { ServiceError } from './call';
import { Status, LogVerbosity } from './constants';
import { Deserialize, Serialize, ServiceDefinition } from './make-client';
import { Metadata } from './metadata';
import {
  BidiStreamingHandler,
  ClientStreamingHandler,
  HandleCall,
  Handler,
  HandlerType,
  Http2ServerCallStream,
  sendUnaryData,
  ServerDuplexStream,
  ServerDuplexStreamImpl,
  ServerReadableStream,
  ServerReadableStreamImpl,
  ServerStreamingHandler,
  ServerUnaryCall,
  ServerUnaryCallImpl,
  ServerWritableStream,
  ServerWritableStreamImpl,
  UnaryHandler,
  ServerErrorResponse,
  ServerStatusResponse,
} from './server-call';
import { ServerCredentials } from './server-credentials';
import { ChannelOptions } from './channel-options';
import {
  createResolver,
  ResolverListener,
  mapUriDefaultScheme,
} from './resolver';
import * as logging from './logging';
import {
  SubchannelAddress,
  TcpSubchannelAddress,
  isTcpSubchannelAddress,
  subchannelAddressToString,
  stringToSubchannelAddress,
} from './subchannel-address';
import { parseUri } from './uri-parser';
import {
  ChannelzCallTracker,
  ChannelzChildrenTracker,
  ChannelzTrace,
  registerChannelzServer,
  registerChannelzSocket,
  ServerInfo,
  ServerRef,
  SocketInfo,
  SocketRef,
  TlsInfo,
  unregisterChannelzRef,
} from './channelz';
import { CipherNameAndProtocol, TLSSocket } from 'tls';

const UNLIMITED_CONNECTION_AGE_MS = ~(1 << 31);
const KEEPALIVE_MAX_TIME_MS = ~(1 << 31);
const KEEPALIVE_TIMEOUT_MS = 20000;

const { HTTP2_HEADER_PATH } = http2.constants;

const TRACER_NAME = 'server';

interface BindResult {
  port: number;
  count: number;
}

function noop(): void {}

function getUnimplementedStatusResponse(
  methodName: string
): Partial<ServiceError> {
  return {
    code: Status.UNIMPLEMENTED,
    details: `The server does not implement the method ${methodName}`,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type UntypedUnaryHandler = UnaryHandler<any, any>;
type UntypedClientStreamingHandler = ClientStreamingHandler<any, any>;
type UntypedServerStreamingHandler = ServerStreamingHandler<any, any>;
type UntypedBidiStreamingHandler = BidiStreamingHandler<any, any>;
export type UntypedHandleCall = HandleCall<any, any>;
type UntypedHandler = Handler<any, any>;
export interface UntypedServiceImplementation {
  [name: string]: UntypedHandleCall;
}

function getDefaultHandler(handlerType: HandlerType, methodName: string) {
  const unimplementedStatusResponse =
    getUnimplementedStatusResponse(methodName);
  switch (handlerType) {
    case 'unary':
      return (
        call: ServerUnaryCall<any, any>,
        callback: sendUnaryData<any>
      ) => {
        callback(unimplementedStatusResponse as ServiceError, null);
      };
    case 'clientStream':
      return (
        call: ServerReadableStream<any, any>,
        callback: sendUnaryData<any>
      ) => {
        callback(unimplementedStatusResponse as ServiceError, null);
      };
    case 'serverStream':
      return (call: ServerWritableStream<any, any>) => {
        call.emit('error', unimplementedStatusResponse);
      };
    case 'bidi':
      return (call: ServerDuplexStream<any, any>) => {
        call.emit('error', unimplementedStatusResponse);
      };
    default:
      throw new Error(`Invalid handlerType ${handlerType}`);
  }
}

interface ChannelzSessionInfo {
  ref: SocketRef;
  streamTracker: ChannelzCallTracker;
  messagesSent: number;
  messagesReceived: number;
  lastMessageSentTimestamp: Date | null;
  lastMessageReceivedTimestamp: Date | null;
}

export class Server {
  private http2ServerList: {
    server: http2.Http2Server | http2.Http2SecureServer;
    channelzRef: SocketRef;
  }[] = [];

  private handlers: Map<string, UntypedHandler> = new Map<
    string,
    UntypedHandler
  >();
  private sessions = new Map<http2.ServerHttp2Session, ChannelzSessionInfo>();
  private started = false;
  private shutdown = false;
  private options: ChannelOptions;
  private serverAddressString = 'null';

  // Channelz Info
  private readonly channelzEnabled: boolean = true;
  private channelzRef: ServerRef;
  private channelzTrace = new ChannelzTrace();
  private callTracker = new ChannelzCallTracker();
  private listenerChildrenTracker = new ChannelzChildrenTracker();
  private sessionChildrenTracker = new ChannelzChildrenTracker();

  private readonly maxConnectionAgeMs: number;
  private readonly maxConnectionAgeGraceMs: number;

  private readonly keepaliveTimeMs: number;
  private readonly keepaliveTimeoutMs: number;

  constructor(options?: ChannelOptions) {
    this.options = options ?? {};
    if (this.options['grpc.enable_channelz'] === 0) {
      this.channelzEnabled = false;
    }
    this.channelzRef = registerChannelzServer(
      () => this.getChannelzInfo(),
      this.channelzEnabled
    );
    if (this.channelzEnabled) {
      this.channelzTrace.addTrace('CT_INFO', 'Server created');
    }
    this.maxConnectionAgeMs =
      this.options['grpc.max_connection_age_ms'] ?? UNLIMITED_CONNECTION_AGE_MS;
    this.maxConnectionAgeGraceMs =
      this.options['grpc.max_connection_age_grace_ms'] ??
      UNLIMITED_CONNECTION_AGE_MS;
    this.keepaliveTimeMs =
      this.options['grpc.keepalive_time_ms'] ?? KEEPALIVE_MAX_TIME_MS;
    this.keepaliveTimeoutMs =
      this.options['grpc.keepalive_timeout_ms'] ?? KEEPALIVE_TIMEOUT_MS;
    this.trace('Server constructed');
  }

  private getChannelzInfo(): ServerInfo {
    return {
      trace: this.channelzTrace,
      callTracker: this.callTracker,
      listenerChildren: this.listenerChildrenTracker.getChildLists(),
      sessionChildren: this.sessionChildrenTracker.getChildLists(),
    };
  }

  private getChannelzSessionInfoGetter(
    session: http2.ServerHttp2Session
  ): () => SocketInfo {
    return () => {
      const sessionInfo = this.sessions.get(session)!;
      const sessionSocket = session.socket;
      const remoteAddress = sessionSocket.remoteAddress
        ? stringToSubchannelAddress(
            sessionSocket.remoteAddress,
            sessionSocket.remotePort
          )
        : null;
      const localAddress = sessionSocket.localAddress
        ? stringToSubchannelAddress(
            sessionSocket.localAddress!,
            sessionSocket.localPort
          )
        : null;
      let tlsInfo: TlsInfo | null;
      if (session.encrypted) {
        const tlsSocket: TLSSocket = sessionSocket as TLSSocket;
        const cipherInfo: CipherNameAndProtocol & { standardName?: string } =
          tlsSocket.getCipher();
        const certificate = tlsSocket.getCertificate();
        const peerCertificate = tlsSocket.getPeerCertificate();
        tlsInfo = {
          cipherSuiteStandardName: cipherInfo.standardName ?? null,
          cipherSuiteOtherName: cipherInfo.standardName
            ? null
            : cipherInfo.name,
          localCertificate:
            certificate && 'raw' in certificate ? certificate.raw : null,
          remoteCertificate:
            peerCertificate && 'raw' in peerCertificate
              ? peerCertificate.raw
              : null,
        };
      } else {
        tlsInfo = null;
      }
      const socketInfo: SocketInfo = {
        remoteAddress: remoteAddress,
        localAddress: localAddress,
        security: tlsInfo,
        remoteName: null,
        streamsStarted: sessionInfo.streamTracker.callsStarted,
        streamsSucceeded: sessionInfo.streamTracker.callsSucceeded,
        streamsFailed: sessionInfo.streamTracker.callsFailed,
        messagesSent: sessionInfo.messagesSent,
        messagesReceived: sessionInfo.messagesReceived,
        keepAlivesSent: 0,
        lastLocalStreamCreatedTimestamp: null,
        lastRemoteStreamCreatedTimestamp:
          sessionInfo.streamTracker.lastCallStartedTimestamp,
        lastMessageSentTimestamp: sessionInfo.lastMessageSentTimestamp,
        lastMessageReceivedTimestamp: sessionInfo.lastMessageReceivedTimestamp,
        localFlowControlWindow: session.state.localWindowSize ?? null,
        remoteFlowControlWindow: session.state.remoteWindowSize ?? null,
      };
      return socketInfo;
    };
  }

  private trace(text: string): void {
    logging.trace(
      LogVerbosity.DEBUG,
      TRACER_NAME,
      '(' + this.channelzRef.id + ') ' + text
    );
  }

  addProtoService(): never {
    throw new Error('Not implemented. Use addService() instead');
  }

  addService(
    service: ServiceDefinition,
    implementation: UntypedServiceImplementation
  ): void {
    if (
      service === null ||
      typeof service !== 'object' ||
      implementation === null ||
      typeof implementation !== 'object'
    ) {
      throw new Error('addService() requires two objects as arguments');
    }

    const serviceKeys = Object.keys(service);

    if (serviceKeys.length === 0) {
      throw new Error('Cannot add an empty service to a server');
    }

    serviceKeys.forEach(name => {
      const attrs = service[name];
      let methodType: HandlerType;

      if (attrs.requestStream) {
        if (attrs.responseStream) {
          methodType = 'bidi';
        } else {
          methodType = 'clientStream';
        }
      } else {
        if (attrs.responseStream) {
          methodType = 'serverStream';
        } else {
          methodType = 'unary';
        }
      }

      let implFn = implementation[name];
      let impl;

      if (implFn === undefined && typeof attrs.originalName === 'string') {
        implFn = implementation[attrs.originalName];
      }

      if (implFn !== undefined) {
        impl = implFn.bind(implementation);
      } else {
        impl = getDefaultHandler(methodType, name);
      }

      const success = this.register(
        attrs.path,
        impl as UntypedHandleCall,
        attrs.responseSerialize,
        attrs.requestDeserialize,
        methodType
      );

      if (success === false) {
        throw new Error(`Method handler for ${attrs.path} already provided.`);
      }
    });
  }

  removeService(service: ServiceDefinition): void {
    if (service === null || typeof service !== 'object') {
      throw new Error('removeService() requires object as argument');
    }

    const serviceKeys = Object.keys(service);
    serviceKeys.forEach(name => {
      const attrs = service[name];
      this.unregister(attrs.path);
    });
  }

  bind(port: string, creds: ServerCredentials): never {
    throw new Error('Not implemented. Use bindAsync() instead');
  }

  bindAsync(
    port: string,
    creds: ServerCredentials,
    callback: (error: Error | null, port: number) => void
  ): void {
    if (this.started === true) {
      throw new Error('server is already started');
    }

    if (this.shutdown) {
      throw new Error('bindAsync called after shutdown');
    }

    if (typeof port !== 'string') {
      throw new TypeError('port must be a string');
    }

    if (creds === null || !(creds instanceof ServerCredentials)) {
      throw new TypeError('creds must be a ServerCredentials object');
    }

    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }

    const initialPortUri = parseUri(port);
    if (initialPortUri === null) {
      throw new Error(`Could not parse port "${port}"`);
    }
    const portUri = mapUriDefaultScheme(initialPortUri);
    if (portUri === null) {
      throw new Error(`Could not get a default scheme for port "${port}"`);
    }

    const serverOptions: http2.ServerOptions = {
      maxSendHeaderBlockLength: Number.MAX_SAFE_INTEGER,
    };
    if ('grpc-node.max_session_memory' in this.options) {
      serverOptions.maxSessionMemory =
        this.options['grpc-node.max_session_memory'];
    } else {
      /* By default, set a very large max session memory limit, to effectively
       * disable enforcement of the limit. Some testing indicates that Node's
       * behavior degrades badly when this limit is reached, so we solve that
       * by disabling the check entirely. */
      serverOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
    }
    if ('grpc.max_concurrent_streams' in this.options) {
      serverOptions.settings = {
        maxConcurrentStreams: this.options['grpc.max_concurrent_streams'],
      };
    }

    const deferredCallback = (error: Error | null, port: number) => {
      process.nextTick(() => callback(error, port));
    };

    const setupServer = (): http2.Http2Server | http2.Http2SecureServer => {
      let http2Server: http2.Http2Server | http2.Http2SecureServer;
      if (creds._isSecure()) {
        const secureServerOptions = Object.assign(
          serverOptions,
          creds._getSettings()!
        );
        secureServerOptions.enableTrace =
          this.options['grpc-node.tls_enable_trace'] === 1;
        http2Server = http2.createSecureServer(secureServerOptions);
        http2Server.on('secureConnection', (socket: TLSSocket) => {
          /* These errors need to be handled by the user of Http2SecureServer,
           * according to https://github.com/nodejs/node/issues/35824 */
          socket.on('error', (e: Error) => {
            this.trace(
              'An incoming TLS connection closed with error: ' + e.message
            );
          });
        });
      } else {
        http2Server = http2.createServer(serverOptions);
      }

      http2Server.setTimeout(0, noop);
      this._setupHandlers(http2Server);
      return http2Server;
    };

    const bindSpecificPort = (
      addressList: SubchannelAddress[],
      portNum: number,
      previousCount: number
    ): Promise<BindResult> => {
      if (addressList.length === 0) {
        return Promise.resolve({ port: portNum, count: previousCount });
      }
      return Promise.all(
        addressList.map(address => {
          this.trace(
            'Attempting to bind ' + subchannelAddressToString(address)
          );
          let addr: SubchannelAddress;
          if (isTcpSubchannelAddress(address)) {
            addr = {
              host: (address as TcpSubchannelAddress).host,
              port: portNum,
            };
          } else {
            addr = address;
          }

          const http2Server = setupServer();
          return new Promise<number | Error>((resolve, reject) => {
            const onError = (err: Error) => {
              this.trace(
                'Failed to bind ' +
                  subchannelAddressToString(address) +
                  ' with error ' +
                  err.message
              );
              resolve(err);
            };

            http2Server.once('error', onError);

            http2Server.listen(addr, () => {
              if (this.shutdown) {
                http2Server.close();
                resolve(new Error('bindAsync failed because server is shutdown'));
                return;
              }
              const boundAddress = http2Server.address()!;
              let boundSubchannelAddress: SubchannelAddress;
              if (typeof boundAddress === 'string') {
                boundSubchannelAddress = {
                  path: boundAddress,
                };
              } else {
                boundSubchannelAddress = {
                  host: boundAddress.address,
                  port: boundAddress.port,
                };
              }

              const channelzRef = registerChannelzSocket(
                subchannelAddressToString(boundSubchannelAddress),
                () => {
                  return {
                    localAddress: boundSubchannelAddress,
                    remoteAddress: null,
                    security: null,
                    remoteName: null,
                    streamsStarted: 0,
                    streamsSucceeded: 0,
                    streamsFailed: 0,
                    messagesSent: 0,
                    messagesReceived: 0,
                    keepAlivesSent: 0,
                    lastLocalStreamCreatedTimestamp: null,
                    lastRemoteStreamCreatedTimestamp: null,
                    lastMessageSentTimestamp: null,
                    lastMessageReceivedTimestamp: null,
                    localFlowControlWindow: null,
                    remoteFlowControlWindow: null,
                  };
                },
                this.channelzEnabled
              );
              if (this.channelzEnabled) {
                this.listenerChildrenTracker.refChild(channelzRef);
              }
              this.http2ServerList.push({
                server: http2Server,
                channelzRef: channelzRef,
              });
              this.trace(
                'Successfully bound ' +
                  subchannelAddressToString(boundSubchannelAddress)
              );
              resolve(
                'port' in boundSubchannelAddress
                  ? boundSubchannelAddress.port
                  : portNum
              );
              http2Server.removeListener('error', onError);
            });
          });
        })
      ).then(results => {
        let count = 0;
        for (const result of results) {
          if (typeof result === 'number') {
            count += 1;
            if (result !== portNum) {
              throw new Error(
                'Invalid state: multiple port numbers added from single address'
              );
            }
          }
        }
        return {
          port: portNum,
          count: count + previousCount,
        };
      });
    };

    const bindWildcardPort = (
      addressList: SubchannelAddress[]
    ): Promise<BindResult> => {
      if (addressList.length === 0) {
        return Promise.resolve<BindResult>({ port: 0, count: 0 });
      }
      const address = addressList[0];
      const http2Server = setupServer();
      return new Promise<BindResult>((resolve, reject) => {
        const onError = (err: Error) => {
          this.trace(
            'Failed to bind ' +
              subchannelAddressToString(address) +
              ' with error ' +
              err.message
          );
          resolve(bindWildcardPort(addressList.slice(1)));
        };

        http2Server.once('error', onError);

        http2Server.listen(address, () => {
          if (this.shutdown) {
            http2Server.close();
            resolve({port: 0, count: 0});
            return;
          }
          const boundAddress = http2Server.address() as AddressInfo;
          const boundSubchannelAddress: SubchannelAddress = {
            host: boundAddress.address,
            port: boundAddress.port,
          };
          const channelzRef = registerChannelzSocket(
            subchannelAddressToString(boundSubchannelAddress),
            () => {
              return {
                localAddress: boundSubchannelAddress,
                remoteAddress: null,
                security: null,
                remoteName: null,
                streamsStarted: 0,
                streamsSucceeded: 0,
                streamsFailed: 0,
                messagesSent: 0,
                messagesReceived: 0,
                keepAlivesSent: 0,
                lastLocalStreamCreatedTimestamp: null,
                lastRemoteStreamCreatedTimestamp: null,
                lastMessageSentTimestamp: null,
                lastMessageReceivedTimestamp: null,
                localFlowControlWindow: null,
                remoteFlowControlWindow: null,
              };
            },
            this.channelzEnabled
          );
          if (this.channelzEnabled) {
            this.listenerChildrenTracker.refChild(channelzRef);
          }
          this.http2ServerList.push({
            server: http2Server,
            channelzRef: channelzRef,
          });
          this.trace(
            'Successfully bound ' +
              subchannelAddressToString(boundSubchannelAddress)
          );
          resolve(bindSpecificPort(addressList.slice(1), boundAddress.port, 1));
          http2Server.removeListener('error', onError);
        });
      });
    };

    const resolverListener: ResolverListener = {
      onSuccessfulResolution: (
        addressList,
        serviceConfig,
        serviceConfigError
      ) => {
        // We only want one resolution result. Discard all future results
        resolverListener.onSuccessfulResolution = () => {};
        if (this.shutdown) {
          deferredCallback(
            new Error(`bindAsync failed because server is shutdown`),
            0
          );
        }
        if (addressList.length === 0) {
          deferredCallback(
            new Error(`No addresses resolved for port ${port}`),
            0
          );
          return;
        }
        let bindResultPromise: Promise<BindResult>;
        if (isTcpSubchannelAddress(addressList[0])) {
          if (addressList[0].port === 0) {
            bindResultPromise = bindWildcardPort(addressList);
          } else {
            bindResultPromise = bindSpecificPort(
              addressList,
              addressList[0].port,
              0
            );
          }
        } else {
          // Use an arbitrary non-zero port for non-TCP addresses
          bindResultPromise = bindSpecificPort(addressList, 1, 0);
        }
        bindResultPromise.then(
          bindResult => {
            if (bindResult.count === 0) {
              const errorString = `No address added out of total ${addressList.length} resolved`;
              logging.log(LogVerbosity.ERROR, errorString);
              deferredCallback(new Error(errorString), 0);
            } else {
              if (bindResult.count < addressList.length) {
                logging.log(
                  LogVerbosity.INFO,
                  `WARNING Only ${bindResult.count} addresses added out of total ${addressList.length} resolved`
                );
              }
              deferredCallback(null, bindResult.port);
            }
          },
          error => {
            const errorString = `No address added out of total ${addressList.length} resolved`;
            logging.log(LogVerbosity.ERROR, errorString);
            deferredCallback(new Error(errorString), 0);
          }
        );
      },
      onError: error => {
        deferredCallback(new Error(error.details), 0);
      },
    };

    const resolver = createResolver(portUri, resolverListener, this.options);
    resolver.updateResolution();
  }

  forceShutdown(): void {
    // Close the server if it is still running.

    for (const { server: http2Server, channelzRef: ref } of this
      .http2ServerList) {
      if (http2Server.listening) {
        http2Server.close(() => {
          if (this.channelzEnabled) {
            this.listenerChildrenTracker.unrefChild(ref);
            unregisterChannelzRef(ref);
          }
        });
      }
    }

    this.started = false;
    this.shutdown = true;

    // Always destroy any available sessions. It's possible that one or more
    // tryShutdown() calls are in progress. Don't wait on them to finish.
    this.sessions.forEach((channelzInfo, session) => {
      // Cast NGHTTP2_CANCEL to any because TypeScript doesn't seem to
      // recognize destroy(code) as a valid signature.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.destroy(http2.constants.NGHTTP2_CANCEL as any);
    });
    this.sessions.clear();
    if (this.channelzEnabled) {
      unregisterChannelzRef(this.channelzRef);
    }
  }

  register<RequestType, ResponseType>(
    name: string,
    handler: HandleCall<RequestType, ResponseType>,
    serialize: Serialize<ResponseType>,
    deserialize: Deserialize<RequestType>,
    type: string
  ): boolean {
    if (this.handlers.has(name)) {
      return false;
    }

    this.handlers.set(name, {
      func: handler,
      serialize,
      deserialize,
      type,
      path: name,
    } as UntypedHandler);
    return true;
  }

  unregister(name: string): boolean {
    return this.handlers.delete(name);
  }

  start(): void {
    if (
      this.http2ServerList.length === 0 ||
      this.http2ServerList.every(
        ({ server: http2Server }) => http2Server.listening !== true
      )
    ) {
      throw new Error('server must be bound in order to start');
    }

    if (this.started === true) {
      throw new Error('server is already started');
    }
    if (this.channelzEnabled) {
      this.channelzTrace.addTrace('CT_INFO', 'Starting');
    }
    this.started = true;
  }

  tryShutdown(callback: (error?: Error) => void): void {
    const wrappedCallback = (error?: Error) => {
      if (this.channelzEnabled) {
        unregisterChannelzRef(this.channelzRef);
      }
      callback(error);
    };
    let pendingChecks = 0;

    function maybeCallback(): void {
      pendingChecks--;

      if (pendingChecks === 0) {
        wrappedCallback();
      }
    }

    // Close the server if necessary.
    this.started = false;
    this.shutdown = true;

    for (const { server: http2Server, channelzRef: ref } of this
      .http2ServerList) {
      if (http2Server.listening) {
        pendingChecks++;
        http2Server.close(() => {
          if (this.channelzEnabled) {
            this.listenerChildrenTracker.unrefChild(ref);
            unregisterChannelzRef(ref);
          }
          maybeCallback();
        });
      }
    }

    this.sessions.forEach((channelzInfo, session) => {
      if (!session.closed) {
        pendingChecks += 1;
        session.close(maybeCallback);
      }
    });
    if (pendingChecks === 0) {
      wrappedCallback();
    }
  }

  addHttp2Port(): never {
    throw new Error('Not yet implemented');
  }

  /**
   * Get the channelz reference object for this server. The returned value is
   * garbage if channelz is disabled for this server.
   * @returns
   */
  getChannelzRef() {
    return this.channelzRef;
  }

  private _verifyContentType(
    stream: http2.ServerHttp2Stream,
    headers: http2.IncomingHttpHeaders
  ): boolean {
    const contentType = headers[http2.constants.HTTP2_HEADER_CONTENT_TYPE];

    if (
      typeof contentType !== 'string' ||
      !contentType.startsWith('application/grpc')
    ) {
      stream.respond(
        {
          [http2.constants.HTTP2_HEADER_STATUS]:
            http2.constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE,
        },
        { endStream: true }
      );
      return false;
    }

    return true;
  }

  private _retrieveHandler(path: string): Handler<any, any> | null {
    this.trace(
      'Received call to method ' +
        path +
        ' at address ' +
        this.serverAddressString
    );

    const handler = this.handlers.get(path);

    if (handler === undefined) {
      this.trace(
        'No handler registered for method ' +
          path +
          '. Sending UNIMPLEMENTED status.'
      );
      return null;
    }

    return handler;
  }

  private _respondWithError<T extends Partial<ServiceError>>(
    err: T,
    stream: http2.ServerHttp2Stream,
    channelzSessionInfo: ChannelzSessionInfo | null = null
  ) {
    const call = new Http2ServerCallStream(stream, null!, this.options);

    if (err.code === undefined) {
      err.code = Status.INTERNAL;
    }

    if (this.channelzEnabled) {
      this.callTracker.addCallFailed();
      channelzSessionInfo?.streamTracker.addCallFailed();
    }

    call.sendError(err);
  }

  private _channelzHandler(
    stream: http2.ServerHttp2Stream,
    headers: http2.IncomingHttpHeaders
  ) {
    const channelzSessionInfo = this.sessions.get(
      stream.session as http2.ServerHttp2Session
    );

    this.callTracker.addCallStarted();
    channelzSessionInfo?.streamTracker.addCallStarted();

    if (!this._verifyContentType(stream, headers)) {
      this.callTracker.addCallFailed();
      channelzSessionInfo?.streamTracker.addCallFailed();
      return;
    }

    const path = headers[HTTP2_HEADER_PATH] as string;

    const handler = this._retrieveHandler(path);
    if (!handler) {
      this._respondWithError(
        getUnimplementedStatusResponse(path),
        stream,
        channelzSessionInfo
      );
      return;
    }

    const call = new Http2ServerCallStream(stream, handler, this.options);

    call.once('callEnd', (code: Status) => {
      if (code === Status.OK) {
        this.callTracker.addCallSucceeded();
      } else {
        this.callTracker.addCallFailed();
      }
    });

    if (channelzSessionInfo) {
      call.once('streamEnd', (success: boolean) => {
        if (success) {
          channelzSessionInfo.streamTracker.addCallSucceeded();
        } else {
          channelzSessionInfo.streamTracker.addCallFailed();
        }
      });
      call.on('sendMessage', () => {
        channelzSessionInfo.messagesSent += 1;
        channelzSessionInfo.lastMessageSentTimestamp = new Date();
      });
      call.on('receiveMessage', () => {
        channelzSessionInfo.messagesReceived += 1;
        channelzSessionInfo.lastMessageReceivedTimestamp = new Date();
      });
    }

    if (!this._runHandlerForCall(call, handler, headers)) {
      this.callTracker.addCallFailed();
      channelzSessionInfo?.streamTracker.addCallFailed();

      call.sendError({
        code: Status.INTERNAL,
        details: `Unknown handler type: ${handler.type}`,
      });
    }
  }

  private _streamHandler(
    stream: http2.ServerHttp2Stream,
    headers: http2.IncomingHttpHeaders
  ) {
    if (this._verifyContentType(stream, headers) !== true) {
      return;
    }

    const path = headers[HTTP2_HEADER_PATH] as string;

    const handler = this._retrieveHandler(path);
    if (!handler) {
      this._respondWithError(
        getUnimplementedStatusResponse(path),
        stream,
        null
      );
      return;
    }

    const call = new Http2ServerCallStream(stream, handler, this.options);
    if (!this._runHandlerForCall(call, handler, headers)) {
      call.sendError({
        code: Status.INTERNAL,
        details: `Unknown handler type: ${handler.type}`,
      });
    }
  }

  private _runHandlerForCall(
    call: Http2ServerCallStream<any, any>,
    handler: Handler<any, any>,
    headers: http2.IncomingHttpHeaders
  ): boolean {
    const metadata = call.receiveMetadata(headers);
    const encoding =
      (metadata.get('grpc-encoding')[0] as string | undefined) ?? 'identity';
    metadata.remove('grpc-encoding');

    const { type } = handler;
    if (type === 'unary') {
      handleUnary(call, handler as UntypedUnaryHandler, metadata, encoding);
    } else if (type === 'clientStream') {
      handleClientStreaming(
        call,
        handler as UntypedClientStreamingHandler,
        metadata,
        encoding
      );
    } else if (type === 'serverStream') {
      handleServerStreaming(
        call,
        handler as UntypedServerStreamingHandler,
        metadata,
        encoding
      );
    } else if (type === 'bidi') {
      handleBidiStreaming(
        call,
        handler as UntypedBidiStreamingHandler,
        metadata,
        encoding
      );
    } else {
      return false;
    }

    return true;
  }

  private _setupHandlers(
    http2Server: http2.Http2Server | http2.Http2SecureServer
  ): void {
    if (http2Server === null) {
      return;
    }

    const serverAddress = http2Server.address();
    let serverAddressString = 'null';
    if (serverAddress) {
      if (typeof serverAddress === 'string') {
        serverAddressString = serverAddress;
      } else {
        serverAddressString = serverAddress.address + ':' + serverAddress.port;
      }
    }
    this.serverAddressString = serverAddressString;

    const handler = this.channelzEnabled
      ? this._channelzHandler
      : this._streamHandler;

    http2Server.on('stream', handler.bind(this));
    http2Server.on('session', session => {
      if (!this.started) {
        session.destroy();
        return;
      }

      const channelzRef = registerChannelzSocket(
        session.socket.remoteAddress ?? 'unknown',
        this.getChannelzSessionInfoGetter(session),
        this.channelzEnabled
      );

      const channelzSessionInfo: ChannelzSessionInfo = {
        ref: channelzRef,
        streamTracker: new ChannelzCallTracker(),
        messagesSent: 0,
        messagesReceived: 0,
        lastMessageSentTimestamp: null,
        lastMessageReceivedTimestamp: null,
      };

      this.sessions.set(session, channelzSessionInfo);
      const clientAddress = session.socket.remoteAddress;
      if (this.channelzEnabled) {
        this.channelzTrace.addTrace(
          'CT_INFO',
          'Connection established by client ' + clientAddress
        );
        this.sessionChildrenTracker.refChild(channelzRef);
      }
      let connectionAgeTimer: NodeJS.Timeout | null = null;
      let connectionAgeGraceTimer: NodeJS.Timeout | null = null;
      let sessionClosedByServer = false;
      if (this.maxConnectionAgeMs !== UNLIMITED_CONNECTION_AGE_MS) {
        // Apply a random jitter within a +/-10% range
        const jitterMagnitude = this.maxConnectionAgeMs / 10;
        const jitter = Math.random() * jitterMagnitude * 2 - jitterMagnitude;
        connectionAgeTimer = setTimeout(() => {
          sessionClosedByServer = true;
          if (this.channelzEnabled) {
            this.channelzTrace.addTrace(
              'CT_INFO',
              'Connection dropped by max connection age from ' + clientAddress
            );
          }
          try {
            session.goaway(
              http2.constants.NGHTTP2_NO_ERROR,
              ~(1 << 31),
              Buffer.from('max_age')
            );
          } catch (e) {
            // The goaway can't be sent because the session is already closed
            session.destroy();
            return;
          }
          session.close();
          /* Allow a grace period after sending the GOAWAY before forcibly
           * closing the connection. */
          if (this.maxConnectionAgeGraceMs !== UNLIMITED_CONNECTION_AGE_MS) {
            connectionAgeGraceTimer = setTimeout(() => {
              session.destroy();
            }, this.maxConnectionAgeGraceMs).unref?.();
          }
        }, this.maxConnectionAgeMs + jitter).unref?.();
      }
      const keeapliveTimeTimer: NodeJS.Timeout | null = setInterval(() => {
        const timeoutTImer = setTimeout(() => {
          sessionClosedByServer = true;
          if (this.channelzEnabled) {
            this.channelzTrace.addTrace(
              'CT_INFO',
              'Connection dropped by keepalive timeout from ' + clientAddress
            );
          }
          session.close();
        }, this.keepaliveTimeoutMs).unref?.();
        try {
          session.ping(
            (err: Error | null, duration: number, payload: Buffer) => {
              clearTimeout(timeoutTImer);
            }
          );
        } catch (e) {
          // The ping can't be sent because the session is already closed
          session.destroy();
        }
      }, this.keepaliveTimeMs).unref?.();
      session.on('close', () => {
        if (this.channelzEnabled) {
          if (!sessionClosedByServer) {
            this.channelzTrace.addTrace(
              'CT_INFO',
              'Connection dropped by client ' + clientAddress
            );
          }
          this.sessionChildrenTracker.unrefChild(channelzRef);
          unregisterChannelzRef(channelzRef);
        }
        if (connectionAgeTimer) {
          clearTimeout(connectionAgeTimer);
        }
        if (connectionAgeGraceTimer) {
          clearTimeout(connectionAgeGraceTimer);
        }
        if (keeapliveTimeTimer) {
          clearTimeout(keeapliveTimeTimer);
        }
        this.sessions.delete(session);
      });
    });
  }
}

async function handleUnary<RequestType, ResponseType>(
  call: Http2ServerCallStream<RequestType, ResponseType>,
  handler: UnaryHandler<RequestType, ResponseType>,
  metadata: Metadata,
  encoding: string
): Promise<void> {
  try {
    const request = await call.receiveUnaryMessage(encoding);

    if (request === undefined || call.cancelled) {
      return;
    }

    const emitter = new ServerUnaryCallImpl<RequestType, ResponseType>(
      call,
      metadata,
      request
    );

    handler.func(
      emitter,
      (
        err: ServerErrorResponse | ServerStatusResponse | null,
        value?: ResponseType | null,
        trailer?: Metadata,
        flags?: number
      ) => {
        call.sendUnaryMessage(err, value, trailer, flags);
      }
    );
  } catch (err) {
    call.sendError(err as ServerErrorResponse);
  }
}

function handleClientStreaming<RequestType, ResponseType>(
  call: Http2ServerCallStream<RequestType, ResponseType>,
  handler: ClientStreamingHandler<RequestType, ResponseType>,
  metadata: Metadata,
  encoding: string
): void {
  const stream = new ServerReadableStreamImpl<RequestType, ResponseType>(
    call,
    metadata,
    handler.deserialize,
    encoding
  );

  function respond(
    err: ServerErrorResponse | ServerStatusResponse | null,
    value?: ResponseType | null,
    trailer?: Metadata,
    flags?: number
  ) {
    stream.destroy();
    call.sendUnaryMessage(err, value, trailer, flags);
  }

  if (call.cancelled) {
    return;
  }

  stream.on('error', respond);
  handler.func(stream, respond);
}

async function handleServerStreaming<RequestType, ResponseType>(
  call: Http2ServerCallStream<RequestType, ResponseType>,
  handler: ServerStreamingHandler<RequestType, ResponseType>,
  metadata: Metadata,
  encoding: string
): Promise<void> {
  try {
    const request = await call.receiveUnaryMessage(encoding);

    if (request === undefined || call.cancelled) {
      return;
    }

    const stream = new ServerWritableStreamImpl<RequestType, ResponseType>(
      call,
      metadata,
      handler.serialize,
      request
    );

    handler.func(stream);
  } catch (err) {
    call.sendError(err as ServerErrorResponse);
  }
}

function handleBidiStreaming<RequestType, ResponseType>(
  call: Http2ServerCallStream<RequestType, ResponseType>,
  handler: BidiStreamingHandler<RequestType, ResponseType>,
  metadata: Metadata,
  encoding: string
): void {
  const stream = new ServerDuplexStreamImpl<RequestType, ResponseType>(
    call,
    metadata,
    handler.serialize,
    handler.deserialize,
    encoding
  );

  if (call.cancelled) {
    return;
  }

  handler.func(stream);
}
