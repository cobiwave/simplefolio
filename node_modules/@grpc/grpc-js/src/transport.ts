/*
 * Copyright 2023 gRPC authors.
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
import {
  checkServerIdentity,
  CipherNameAndProtocol,
  ConnectionOptions,
  PeerCertificate,
  TLSSocket,
} from 'tls';
import { StatusObject } from './call-interface';
import { ChannelCredentials } from './channel-credentials';
import { ChannelOptions } from './channel-options';
import {
  ChannelzCallTracker,
  registerChannelzSocket,
  SocketInfo,
  SocketRef,
  TlsInfo,
  unregisterChannelzRef,
} from './channelz';
import { LogVerbosity } from './constants';
import { getProxiedConnection, ProxyConnectionResult } from './http_proxy';
import * as logging from './logging';
import { getDefaultAuthority } from './resolver';
import {
  stringToSubchannelAddress,
  SubchannelAddress,
  subchannelAddressToString,
} from './subchannel-address';
import { GrpcUri, parseUri, splitHostPort, uriToString } from './uri-parser';
import * as net from 'net';
import {
  Http2SubchannelCall,
  SubchannelCall,
  SubchannelCallInterceptingListener,
} from './subchannel-call';
import { Metadata } from './metadata';
import { getNextCallNumber } from './call-number';

const TRACER_NAME = 'transport';
const FLOW_CONTROL_TRACER_NAME = 'transport_flowctrl';

const clientVersion = require('../../package.json').version;

const {
  HTTP2_HEADER_AUTHORITY,
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_TE,
  HTTP2_HEADER_USER_AGENT,
} = http2.constants;

const KEEPALIVE_TIMEOUT_MS = 20000;

export interface CallEventTracker {
  addMessageSent(): void;
  addMessageReceived(): void;
  onCallEnd(status: StatusObject): void;
  onStreamEnd(success: boolean): void;
}

export interface TransportDisconnectListener {
  (tooManyPings: boolean): void;
}

export interface Transport {
  getChannelzRef(): SocketRef;
  getPeerName(): string;
  createCall(
    metadata: Metadata,
    host: string,
    method: string,
    listener: SubchannelCallInterceptingListener,
    subchannelCallStatsTracker: Partial<CallEventTracker>
  ): SubchannelCall;
  addDisconnectListener(listener: TransportDisconnectListener): void;
  shutdown(): void;
}

const tooManyPingsData: Buffer = Buffer.from('too_many_pings', 'ascii');

class Http2Transport implements Transport {
  /**
   * The amount of time in between sending pings
   */
  private keepaliveTimeMs = -1;
  /**
   * The amount of time to wait for an acknowledgement after sending a ping
   */
  private keepaliveTimeoutMs: number = KEEPALIVE_TIMEOUT_MS;
  /**
   * Timer reference for timeout that indicates when to send the next ping
   */
  private keepaliveTimerId: NodeJS.Timeout | null = null;
  /**
   * Indicates that the keepalive timer ran out while there were no active
   * calls, and a ping should be sent the next time a call starts.
   */
  private pendingSendKeepalivePing = false;
  /**
   * Timer reference tracking when the most recent ping will be considered lost
   */
  private keepaliveTimeoutId: NodeJS.Timeout | null = null;
  /**
   * Indicates whether keepalive pings should be sent without any active calls
   */
  private keepaliveWithoutCalls = false;

  private userAgent: string;

  private activeCalls: Set<Http2SubchannelCall> = new Set();

  private subchannelAddressString: string;

  private disconnectListeners: TransportDisconnectListener[] = [];

  private disconnectHandled = false;

  // Channelz info
  private channelzRef: SocketRef;
  private readonly channelzEnabled: boolean = true;
  private streamTracker = new ChannelzCallTracker();
  private keepalivesSent = 0;
  private messagesSent = 0;
  private messagesReceived = 0;
  private lastMessageSentTimestamp: Date | null = null;
  private lastMessageReceivedTimestamp: Date | null = null;

  constructor(
    private session: http2.ClientHttp2Session,
    subchannelAddress: SubchannelAddress,
    options: ChannelOptions,
    /**
     * Name of the remote server, if it is not the same as the subchannel
     * address, i.e. if connecting through an HTTP CONNECT proxy.
     */
    private remoteName: string | null
  ) {
    /* Populate subchannelAddressString and channelzRef before doing anything
     * else, because they are used in the trace methods. */
    this.subchannelAddressString = subchannelAddressToString(subchannelAddress);

    if (options['grpc.enable_channelz'] === 0) {
      this.channelzEnabled = false;
    }
    this.channelzRef = registerChannelzSocket(
      this.subchannelAddressString,
      () => this.getChannelzInfo(),
      this.channelzEnabled
    );
    // Build user-agent string.
    this.userAgent = [
      options['grpc.primary_user_agent'],
      `grpc-node-js/${clientVersion}`,
      options['grpc.secondary_user_agent'],
    ]
      .filter(e => e)
      .join(' '); // remove falsey values first

    if ('grpc.keepalive_time_ms' in options) {
      this.keepaliveTimeMs = options['grpc.keepalive_time_ms']!;
    }
    if ('grpc.keepalive_timeout_ms' in options) {
      this.keepaliveTimeoutMs = options['grpc.keepalive_timeout_ms']!;
    }
    if ('grpc.keepalive_permit_without_calls' in options) {
      this.keepaliveWithoutCalls =
        options['grpc.keepalive_permit_without_calls'] === 1;
    } else {
      this.keepaliveWithoutCalls = false;
    }

    session.once('close', () => {
      this.trace('session closed');
      this.stopKeepalivePings();
      this.handleDisconnect();
    });
    session.once(
      'goaway',
      (errorCode: number, lastStreamID: number, opaqueData?: Buffer) => {
        let tooManyPings = false;
        /* See the last paragraph of
         * https://github.com/grpc/proposal/blob/master/A8-client-side-keepalive.md#basic-keepalive */
        if (
          errorCode === http2.constants.NGHTTP2_ENHANCE_YOUR_CALM &&
          opaqueData &&
          opaqueData.equals(tooManyPingsData)
        ) {
          tooManyPings = true;
        }
        this.trace('connection closed by GOAWAY with code ' + errorCode + ' and data ' + opaqueData?.toString());
        this.reportDisconnectToOwner(tooManyPings);
      }
    );
    session.once('error', error => {
      /* Do nothing here. Any error should also trigger a close event, which is
       * where we want to handle that.  */
      this.trace('connection closed with error ' + (error as Error).message);
    });
    if (logging.isTracerEnabled(TRACER_NAME)) {
      session.on('remoteSettings', (settings: http2.Settings) => {
        this.trace(
          'new settings received' +
            (this.session !== session ? ' on the old connection' : '') +
            ': ' +
            JSON.stringify(settings)
        );
      });
      session.on('localSettings', (settings: http2.Settings) => {
        this.trace(
          'local settings acknowledged by remote' +
            (this.session !== session ? ' on the old connection' : '') +
            ': ' +
            JSON.stringify(settings)
        );
      });
    }
    /* Start the keepalive timer last, because this can trigger trace logs,
     * which should only happen after everything else is set up. */
    if (this.keepaliveWithoutCalls) {
      this.maybeStartKeepalivePingTimer();
    }
  }

  private getChannelzInfo(): SocketInfo {
    const sessionSocket = this.session.socket;
    const remoteAddress = sessionSocket.remoteAddress
      ? stringToSubchannelAddress(
          sessionSocket.remoteAddress,
          sessionSocket.remotePort
        )
      : null;
    const localAddress = sessionSocket.localAddress
      ? stringToSubchannelAddress(
          sessionSocket.localAddress,
          sessionSocket.localPort
        )
      : null;
    let tlsInfo: TlsInfo | null;
    if (this.session.encrypted) {
      const tlsSocket: TLSSocket = sessionSocket as TLSSocket;
      const cipherInfo: CipherNameAndProtocol & { standardName?: string } =
        tlsSocket.getCipher();
      const certificate = tlsSocket.getCertificate();
      const peerCertificate = tlsSocket.getPeerCertificate();
      tlsInfo = {
        cipherSuiteStandardName: cipherInfo.standardName ?? null,
        cipherSuiteOtherName: cipherInfo.standardName ? null : cipherInfo.name,
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
      remoteName: this.remoteName,
      streamsStarted: this.streamTracker.callsStarted,
      streamsSucceeded: this.streamTracker.callsSucceeded,
      streamsFailed: this.streamTracker.callsFailed,
      messagesSent: this.messagesSent,
      messagesReceived: this.messagesReceived,
      keepAlivesSent: this.keepalivesSent,
      lastLocalStreamCreatedTimestamp:
        this.streamTracker.lastCallStartedTimestamp,
      lastRemoteStreamCreatedTimestamp: null,
      lastMessageSentTimestamp: this.lastMessageSentTimestamp,
      lastMessageReceivedTimestamp: this.lastMessageReceivedTimestamp,
      localFlowControlWindow: this.session.state.localWindowSize ?? null,
      remoteFlowControlWindow: this.session.state.remoteWindowSize ?? null,
    };
    return socketInfo;
  }

  private trace(text: string): void {
    logging.trace(
      LogVerbosity.DEBUG,
      TRACER_NAME,
      '(' +
        this.channelzRef.id +
        ') ' +
        this.subchannelAddressString +
        ' ' +
        text
    );
  }

  private keepaliveTrace(text: string): void {
    logging.trace(
      LogVerbosity.DEBUG,
      'keepalive',
      '(' +
        this.channelzRef.id +
        ') ' +
        this.subchannelAddressString +
        ' ' +
        text
    );
  }

  private flowControlTrace(text: string): void {
    logging.trace(
      LogVerbosity.DEBUG,
      FLOW_CONTROL_TRACER_NAME,
      '(' +
        this.channelzRef.id +
        ') ' +
        this.subchannelAddressString +
        ' ' +
        text
    );
  }

  private internalsTrace(text: string): void {
    logging.trace(
      LogVerbosity.DEBUG,
      'transport_internals',
      '(' +
        this.channelzRef.id +
        ') ' +
        this.subchannelAddressString +
        ' ' +
        text
    );
  }

  /**
   * Indicate to the owner of this object that this transport should no longer
   * be used. That happens if the connection drops, or if the server sends a
   * GOAWAY.
   * @param tooManyPings If true, this was triggered by a GOAWAY with data
   * indicating that the session was closed becaues the client sent too many
   * pings.
   * @returns
   */
  private reportDisconnectToOwner(tooManyPings: boolean) {
    if (this.disconnectHandled) {
      return;
    }
    this.disconnectHandled = true;
    this.disconnectListeners.forEach(listener => listener(tooManyPings));
  }

  /**
   * Handle connection drops, but not GOAWAYs.
   */
  private handleDisconnect() {
    this.reportDisconnectToOwner(false);
    /* Give calls an event loop cycle to finish naturally before reporting the
     * disconnnection to them. */
    setImmediate(() => {
      for (const call of this.activeCalls) {
        call.onDisconnect();
      }
    });
  }

  addDisconnectListener(listener: TransportDisconnectListener): void {
    this.disconnectListeners.push(listener);
  }

  private clearKeepaliveTimer() {
    if (!this.keepaliveTimerId) {
      return;
    }
    clearTimeout(this.keepaliveTimerId);
    this.keepaliveTimerId = null;
  }

  private clearKeepaliveTimeout() {
    if (!this.keepaliveTimeoutId) {
      return;
    }
    clearTimeout(this.keepaliveTimeoutId);
    this.keepaliveTimeoutId = null;
  }

  private canSendPing() {
    return (
      this.keepaliveTimeMs > 0 &&
      (this.keepaliveWithoutCalls || this.activeCalls.size > 0)
    );
  }

  private maybeSendPing() {
    this.clearKeepaliveTimer();
    if (!this.canSendPing()) {
      this.pendingSendKeepalivePing = true;
      return;
    }
    if (this.channelzEnabled) {
      this.keepalivesSent += 1;
    }
    this.keepaliveTrace(
      'Sending ping with timeout ' + this.keepaliveTimeoutMs + 'ms'
    );
    if (!this.keepaliveTimeoutId) {
      this.keepaliveTimeoutId = setTimeout(() => {
        this.keepaliveTrace('Ping timeout passed without response');
        this.handleDisconnect();
      }, this.keepaliveTimeoutMs);
      this.keepaliveTimeoutId.unref?.();
    }
    try {
      this.session!.ping(
        (err: Error | null, duration: number, payload: Buffer) => {
          if (err) {
            this.keepaliveTrace('Ping failed with error ' + err.message);
            this.handleDisconnect();
          }
          this.keepaliveTrace('Received ping response');
          this.clearKeepaliveTimeout();
          this.maybeStartKeepalivePingTimer();
        }
      );
    } catch (e) {
      /* If we fail to send a ping, the connection is no longer functional, so
       * we should discard it. */
      this.handleDisconnect();
    }
  }

  /**
   * Starts the keepalive ping timer if appropriate. If the timer already ran
   * out while there were no active requests, instead send a ping immediately.
   * If the ping timer is already running or a ping is currently in flight,
   * instead do nothing and wait for them to resolve.
   */
  private maybeStartKeepalivePingTimer() {
    if (!this.canSendPing()) {
      return;
    }
    if (this.pendingSendKeepalivePing) {
      this.pendingSendKeepalivePing = false;
      this.maybeSendPing();
    } else if (!this.keepaliveTimerId && !this.keepaliveTimeoutId) {
      this.keepaliveTrace(
        'Starting keepalive timer for ' + this.keepaliveTimeMs + 'ms'
      );
      this.keepaliveTimerId = setTimeout(() => {
        this.maybeSendPing();
      }, this.keepaliveTimeMs).unref?.();
    }
    /* Otherwise, there is already either a keepalive timer or a ping pending,
     * wait for those to resolve. */
  }

  private stopKeepalivePings() {
    if (this.keepaliveTimerId) {
      clearTimeout(this.keepaliveTimerId);
      this.keepaliveTimerId = null;
    }
    this.clearKeepaliveTimeout();
  }

  private removeActiveCall(call: Http2SubchannelCall) {
    this.activeCalls.delete(call);
    if (this.activeCalls.size === 0) {
      this.session.unref();
    }
  }

  private addActiveCall(call: Http2SubchannelCall) {
    this.activeCalls.add(call);
    if (this.activeCalls.size === 1) {
      this.session.ref();
      if (!this.keepaliveWithoutCalls) {
        this.maybeStartKeepalivePingTimer();
      }
    }
  }

  createCall(
    metadata: Metadata,
    host: string,
    method: string,
    listener: SubchannelCallInterceptingListener,
    subchannelCallStatsTracker: Partial<CallEventTracker>
  ): Http2SubchannelCall {
    const headers = metadata.toHttp2Headers();
    headers[HTTP2_HEADER_AUTHORITY] = host;
    headers[HTTP2_HEADER_USER_AGENT] = this.userAgent;
    headers[HTTP2_HEADER_CONTENT_TYPE] = 'application/grpc';
    headers[HTTP2_HEADER_METHOD] = 'POST';
    headers[HTTP2_HEADER_PATH] = method;
    headers[HTTP2_HEADER_TE] = 'trailers';
    let http2Stream: http2.ClientHttp2Stream;
    /* In theory, if an error is thrown by session.request because session has
     * become unusable (e.g. because it has received a goaway), this subchannel
     * should soon see the corresponding close or goaway event anyway and leave
     * READY. But we have seen reports that this does not happen
     * (https://github.com/googleapis/nodejs-firestore/issues/1023#issuecomment-653204096)
     * so for defense in depth, we just discard the session when we see an
     * error here.
     */
    try {
      http2Stream = this.session!.request(headers);
    } catch (e) {
      this.handleDisconnect();
      throw e;
    }
    this.flowControlTrace(
      'local window size: ' +
        this.session.state.localWindowSize +
        ' remote window size: ' +
        this.session.state.remoteWindowSize
    );
    this.internalsTrace(
      'session.closed=' +
        this.session.closed +
        ' session.destroyed=' +
        this.session.destroyed +
        ' session.socket.destroyed=' +
        this.session.socket.destroyed
    );
    let eventTracker: CallEventTracker;
    // eslint-disable-next-line prefer-const
    let call: Http2SubchannelCall;
    if (this.channelzEnabled) {
      this.streamTracker.addCallStarted();
      eventTracker = {
        addMessageSent: () => {
          this.messagesSent += 1;
          this.lastMessageSentTimestamp = new Date();
          subchannelCallStatsTracker.addMessageSent?.();
        },
        addMessageReceived: () => {
          this.messagesReceived += 1;
          this.lastMessageReceivedTimestamp = new Date();
          subchannelCallStatsTracker.addMessageReceived?.();
        },
        onCallEnd: status => {
          subchannelCallStatsTracker.onCallEnd?.(status);
          this.removeActiveCall(call);
        },
        onStreamEnd: success => {
          if (success) {
            this.streamTracker.addCallSucceeded();
          } else {
            this.streamTracker.addCallFailed();
          }
          subchannelCallStatsTracker.onStreamEnd?.(success);
        },
      };
    } else {
      eventTracker = {
        addMessageSent: () => {
          subchannelCallStatsTracker.addMessageSent?.();
        },
        addMessageReceived: () => {
          subchannelCallStatsTracker.addMessageReceived?.();
        },
        onCallEnd: status => {
          subchannelCallStatsTracker.onCallEnd?.(status);
          this.removeActiveCall(call);
        },
        onStreamEnd: success => {
          subchannelCallStatsTracker.onStreamEnd?.(success);
        },
      };
    }
    call = new Http2SubchannelCall(
      http2Stream,
      eventTracker,
      listener,
      this,
      getNextCallNumber()
    );
    this.addActiveCall(call);
    return call;
  }

  getChannelzRef(): SocketRef {
    return this.channelzRef;
  }

  getPeerName() {
    return this.subchannelAddressString;
  }

  shutdown() {
    this.session.close();
    unregisterChannelzRef(this.channelzRef);
  }
}

export interface SubchannelConnector {
  connect(
    address: SubchannelAddress,
    credentials: ChannelCredentials,
    options: ChannelOptions
  ): Promise<Transport>;
  shutdown(): void;
}

export class Http2SubchannelConnector implements SubchannelConnector {
  private session: http2.ClientHttp2Session | null = null;
  private isShutdown = false;
  constructor(private channelTarget: GrpcUri) {}
  private trace(text: string) {
    logging.trace(
      LogVerbosity.DEBUG,
      TRACER_NAME,
      uriToString(this.channelTarget) + ' ' + text
    );
  }
  private createSession(
    address: SubchannelAddress,
    credentials: ChannelCredentials,
    options: ChannelOptions,
    proxyConnectionResult: ProxyConnectionResult
  ): Promise<Http2Transport> {
    if (this.isShutdown) {
      return Promise.reject();
    }
    return new Promise<Http2Transport>((resolve, reject) => {
      let remoteName: string | null;
      if (proxyConnectionResult.realTarget) {
        remoteName = uriToString(proxyConnectionResult.realTarget);
        this.trace(
          'creating HTTP/2 session through proxy to ' +
            uriToString(proxyConnectionResult.realTarget)
        );
      } else {
        remoteName = null;
        this.trace(
          'creating HTTP/2 session to ' + subchannelAddressToString(address)
        );
      }
      const targetAuthority = getDefaultAuthority(
        proxyConnectionResult.realTarget ?? this.channelTarget
      );
      let connectionOptions: http2.SecureClientSessionOptions =
        credentials._getConnectionOptions() || {};
      connectionOptions.maxSendHeaderBlockLength = Number.MAX_SAFE_INTEGER;
      if ('grpc-node.max_session_memory' in options) {
        connectionOptions.maxSessionMemory =
          options['grpc-node.max_session_memory'];
      } else {
        /* By default, set a very large max session memory limit, to effectively
         * disable enforcement of the limit. Some testing indicates that Node's
         * behavior degrades badly when this limit is reached, so we solve that
         * by disabling the check entirely. */
        connectionOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
      }
      let addressScheme = 'http://';
      if ('secureContext' in connectionOptions) {
        addressScheme = 'https://';
        // If provided, the value of grpc.ssl_target_name_override should be used
        // to override the target hostname when checking server identity.
        // This option is used for testing only.
        if (options['grpc.ssl_target_name_override']) {
          const sslTargetNameOverride =
            options['grpc.ssl_target_name_override']!;
          connectionOptions.checkServerIdentity = (
            host: string,
            cert: PeerCertificate
          ): Error | undefined => {
            return checkServerIdentity(sslTargetNameOverride, cert);
          };
          connectionOptions.servername = sslTargetNameOverride;
        } else {
          const authorityHostname =
            splitHostPort(targetAuthority)?.host ?? 'localhost';
          // We want to always set servername to support SNI
          connectionOptions.servername = authorityHostname;
        }
        if (proxyConnectionResult.socket) {
          /* This is part of the workaround for
           * https://github.com/nodejs/node/issues/32922. Without that bug,
           * proxyConnectionResult.socket would always be a plaintext socket and
           * this would say
           * connectionOptions.socket = proxyConnectionResult.socket; */
          connectionOptions.createConnection = (authority, option) => {
            return proxyConnectionResult.socket!;
          };
        }
      } else {
        /* In all but the most recent versions of Node, http2.connect does not use
         * the options when establishing plaintext connections, so we need to
         * establish that connection explicitly. */
        connectionOptions.createConnection = (authority, option) => {
          if (proxyConnectionResult.socket) {
            return proxyConnectionResult.socket;
          } else {
            /* net.NetConnectOpts is declared in a way that is more restrictive
             * than what net.connect will actually accept, so we use the type
             * assertion to work around that. */
            return net.connect(address);
          }
        };
      }

      connectionOptions = {
        ...connectionOptions,
        ...address,
        enableTrace: options['grpc-node.tls_enable_trace'] === 1,
      };

      /* http2.connect uses the options here:
       * https://github.com/nodejs/node/blob/70c32a6d190e2b5d7b9ff9d5b6a459d14e8b7d59/lib/internal/http2/core.js#L3028-L3036
       * The spread operator overides earlier values with later ones, so any port
       * or host values in the options will be used rather than any values extracted
       * from the first argument. In addition, the path overrides the host and port,
       * as documented for plaintext connections here:
       * https://nodejs.org/api/net.html#net_socket_connect_options_connectlistener
       * and for TLS connections here:
       * https://nodejs.org/api/tls.html#tls_tls_connect_options_callback. In
       * earlier versions of Node, http2.connect passes these options to
       * tls.connect but not net.connect, so in the insecure case we still need
       * to set the createConnection option above to create the connection
       * explicitly. We cannot do that in the TLS case because http2.connect
       * passes necessary additional options to tls.connect.
       * The first argument just needs to be parseable as a URL and the scheme
       * determines whether the connection will be established over TLS or not.
       */
      const session = http2.connect(
        addressScheme + targetAuthority,
        connectionOptions
      );
      this.session = session;
      let errorMessage = 'Failed to connect';
      session.unref();
      session.once('connect', () => {
        session.removeAllListeners();
        resolve(new Http2Transport(session, address, options, remoteName));
        this.session = null;
      });
      session.once('close', () => {
        this.session = null;
        // Leave time for error event to happen before rejecting
        setImmediate(() => {
          reject(`${errorMessage} (${new Date().toISOString()})`);
        });
      });
      session.once('error', error => {
        errorMessage = (error as Error).message;
        this.trace('connection failed with error ' + errorMessage);
      });
    });
  }
  connect(
    address: SubchannelAddress,
    credentials: ChannelCredentials,
    options: ChannelOptions
  ): Promise<Http2Transport> {
    if (this.isShutdown) {
      return Promise.reject();
    }
    /* Pass connection options through to the proxy so that it's able to
     * upgrade it's connection to support tls if needed.
     * This is a workaround for https://github.com/nodejs/node/issues/32922
     * See https://github.com/grpc/grpc-node/pull/1369 for more info. */
    const connectionOptions: ConnectionOptions =
      credentials._getConnectionOptions() || {};

    if ('secureContext' in connectionOptions) {
      connectionOptions.ALPNProtocols = ['h2'];
      // If provided, the value of grpc.ssl_target_name_override should be used
      // to override the target hostname when checking server identity.
      // This option is used for testing only.
      if (options['grpc.ssl_target_name_override']) {
        const sslTargetNameOverride = options['grpc.ssl_target_name_override']!;
        connectionOptions.checkServerIdentity = (
          host: string,
          cert: PeerCertificate
        ): Error | undefined => {
          return checkServerIdentity(sslTargetNameOverride, cert);
        };
        connectionOptions.servername = sslTargetNameOverride;
      } else {
        if ('grpc.http_connect_target' in options) {
          /* This is more or less how servername will be set in createSession
           * if a connection is successfully established through the proxy.
           * If the proxy is not used, these connectionOptions are discarded
           * anyway */
          const targetPath = getDefaultAuthority(
            parseUri(options['grpc.http_connect_target'] as string) ?? {
              path: 'localhost',
            }
          );
          const hostPort = splitHostPort(targetPath);
          connectionOptions.servername = hostPort?.host ?? targetPath;
        }
      }
      if (options['grpc-node.tls_enable_trace']) {
        connectionOptions.enableTrace = true;
      }
    }

    return getProxiedConnection(address, options, connectionOptions).then(
      result => this.createSession(address, credentials, options, result)
    );
  }

  shutdown(): void {
    this.isShutdown = true;
    this.session?.close();
    this.session = null;
  }
}
