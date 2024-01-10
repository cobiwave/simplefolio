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

import { CallCredentials } from './call-credentials';
import {
  Call,
  CallStreamOptions,
  InterceptingListener,
  MessageContext,
  StatusObject,
} from './call-interface';
import { LogVerbosity, Propagate, Status } from './constants';
import {
  Deadline,
  deadlineToString,
  getRelativeTimeout,
  minDeadline,
} from './deadline';
import { FilterStack, FilterStackFactory } from './filter-stack';
import { InternalChannel } from './internal-channel';
import { Metadata } from './metadata';
import * as logging from './logging';
import { restrictControlPlaneStatusCode } from './control-plane-status';

const TRACER_NAME = 'resolving_call';

export class ResolvingCall implements Call {
  private child: Call | null = null;
  private readPending = false;
  private pendingMessage: { context: MessageContext; message: Buffer } | null =
    null;
  private pendingHalfClose = false;
  private ended = false;
  private readFilterPending = false;
  private writeFilterPending = false;
  private pendingChildStatus: StatusObject | null = null;
  private metadata: Metadata | null = null;
  private listener: InterceptingListener | null = null;
  private deadline: Deadline;
  private host: string;
  private statusWatchers: ((status: StatusObject) => void)[] = [];
  private deadlineTimer: NodeJS.Timeout = setTimeout(() => {}, 0);
  private filterStack: FilterStack | null = null;

  constructor(
    private readonly channel: InternalChannel,
    private readonly method: string,
    options: CallStreamOptions,
    private readonly filterStackFactory: FilterStackFactory,
    private credentials: CallCredentials,
    private callNumber: number
  ) {
    this.deadline = options.deadline;
    this.host = options.host;
    if (options.parentCall) {
      if (options.flags & Propagate.CANCELLATION) {
        options.parentCall.on('cancelled', () => {
          this.cancelWithStatus(Status.CANCELLED, 'Cancelled by parent call');
        });
      }
      if (options.flags & Propagate.DEADLINE) {
        this.trace(
          'Propagating deadline from parent: ' +
            options.parentCall.getDeadline()
        );
        this.deadline = minDeadline(
          this.deadline,
          options.parentCall.getDeadline()
        );
      }
    }
    this.trace('Created');
    this.runDeadlineTimer();
  }

  private trace(text: string): void {
    logging.trace(
      LogVerbosity.DEBUG,
      TRACER_NAME,
      '[' + this.callNumber + '] ' + text
    );
  }

  private runDeadlineTimer() {
    clearTimeout(this.deadlineTimer);
    this.trace('Deadline: ' + deadlineToString(this.deadline));
    const timeout = getRelativeTimeout(this.deadline);
    if (timeout !== Infinity) {
      this.trace('Deadline will be reached in ' + timeout + 'ms');
      const handleDeadline = () => {
        this.cancelWithStatus(Status.DEADLINE_EXCEEDED, 'Deadline exceeded');
      };
      if (timeout <= 0) {
        process.nextTick(handleDeadline);
      } else {
        this.deadlineTimer = setTimeout(handleDeadline, timeout);
      }
    }
  }

  private outputStatus(status: StatusObject) {
    if (!this.ended) {
      this.ended = true;
      if (!this.filterStack) {
        this.filterStack = this.filterStackFactory.createFilter();
      }
      clearTimeout(this.deadlineTimer);
      const filteredStatus = this.filterStack.receiveTrailers(status);
      this.trace(
        'ended with status: code=' +
          filteredStatus.code +
          ' details="' +
          filteredStatus.details +
          '"'
      );
      this.statusWatchers.forEach(watcher => watcher(filteredStatus));
      process.nextTick(() => {
        this.listener?.onReceiveStatus(filteredStatus);
      });
    }
  }

  private sendMessageOnChild(context: MessageContext, message: Buffer): void {
    if (!this.child) {
      throw new Error('sendMessageonChild called with child not populated');
    }
    const child = this.child;
    this.writeFilterPending = true;
    this.filterStack!.sendMessage(
      Promise.resolve({ message: message, flags: context.flags })
    ).then(
      filteredMessage => {
        this.writeFilterPending = false;
        child.sendMessageWithContext(context, filteredMessage.message);
        if (this.pendingHalfClose) {
          child.halfClose();
        }
      },
      (status: StatusObject) => {
        this.cancelWithStatus(status.code, status.details);
      }
    );
  }

  getConfig(): void {
    if (this.ended) {
      return;
    }
    if (!this.metadata || !this.listener) {
      throw new Error('getConfig called before start');
    }
    const configResult = this.channel.getConfig(this.method, this.metadata);
    if (configResult.type === 'NONE') {
      this.channel.queueCallForConfig(this);
      return;
    } else if (configResult.type === 'ERROR') {
      if (this.metadata.getOptions().waitForReady) {
        this.channel.queueCallForConfig(this);
      } else {
        this.outputStatus(configResult.error);
      }
      return;
    }
    // configResult.type === 'SUCCESS'
    const config = configResult.config;
    if (config.status !== Status.OK) {
      const { code, details } = restrictControlPlaneStatusCode(
        config.status,
        'Failed to route call to method ' + this.method
      );
      this.outputStatus({
        code: code,
        details: details,
        metadata: new Metadata(),
      });
      return;
    }

    if (config.methodConfig.timeout) {
      const configDeadline = new Date();
      configDeadline.setSeconds(
        configDeadline.getSeconds() + config.methodConfig.timeout.seconds
      );
      configDeadline.setMilliseconds(
        configDeadline.getMilliseconds() +
          config.methodConfig.timeout.nanos / 1_000_000
      );
      this.deadline = minDeadline(this.deadline, configDeadline);
      this.runDeadlineTimer();
    }

    this.filterStackFactory.push(config.dynamicFilterFactories);
    this.filterStack = this.filterStackFactory.createFilter();
    this.filterStack.sendMetadata(Promise.resolve(this.metadata)).then(
      filteredMetadata => {
        this.child = this.channel.createInnerCall(
          config,
          this.method,
          this.host,
          this.credentials,
          this.deadline
        );
        this.trace('Created child [' + this.child.getCallNumber() + ']');
        this.child.start(filteredMetadata, {
          onReceiveMetadata: metadata => {
            this.trace('Received metadata');
            this.listener!.onReceiveMetadata(
              this.filterStack!.receiveMetadata(metadata)
            );
          },
          onReceiveMessage: message => {
            this.trace('Received message');
            this.readFilterPending = true;
            this.filterStack!.receiveMessage(message).then(
              filteredMesssage => {
                this.trace('Finished filtering received message');
                this.readFilterPending = false;
                this.listener!.onReceiveMessage(filteredMesssage);
                if (this.pendingChildStatus) {
                  this.outputStatus(this.pendingChildStatus);
                }
              },
              (status: StatusObject) => {
                this.cancelWithStatus(status.code, status.details);
              }
            );
          },
          onReceiveStatus: status => {
            this.trace('Received status');
            if (this.readFilterPending) {
              this.pendingChildStatus = status;
            } else {
              this.outputStatus(status);
            }
          },
        });
        if (this.readPending) {
          this.child.startRead();
        }
        if (this.pendingMessage) {
          this.sendMessageOnChild(
            this.pendingMessage.context,
            this.pendingMessage.message
          );
        } else if (this.pendingHalfClose) {
          this.child.halfClose();
        }
      },
      (status: StatusObject) => {
        this.outputStatus(status);
      }
    );
  }

  reportResolverError(status: StatusObject) {
    if (this.metadata?.getOptions().waitForReady) {
      this.channel.queueCallForConfig(this);
    } else {
      this.outputStatus(status);
    }
  }
  cancelWithStatus(status: Status, details: string): void {
    this.trace(
      'cancelWithStatus code: ' + status + ' details: "' + details + '"'
    );
    this.child?.cancelWithStatus(status, details);
    this.outputStatus({
      code: status,
      details: details,
      metadata: new Metadata(),
    });
  }
  getPeer(): string {
    return this.child?.getPeer() ?? this.channel.getTarget();
  }
  start(metadata: Metadata, listener: InterceptingListener): void {
    this.trace('start called');
    this.metadata = metadata.clone();
    this.listener = listener;
    this.getConfig();
  }
  sendMessageWithContext(context: MessageContext, message: Buffer): void {
    this.trace('write() called with message of length ' + message.length);
    if (this.child) {
      this.sendMessageOnChild(context, message);
    } else {
      this.pendingMessage = { context, message };
    }
  }
  startRead(): void {
    this.trace('startRead called');
    if (this.child) {
      this.child.startRead();
    } else {
      this.readPending = true;
    }
  }
  halfClose(): void {
    this.trace('halfClose called');
    if (this.child && !this.writeFilterPending) {
      this.child.halfClose();
    } else {
      this.pendingHalfClose = true;
    }
  }
  setCredentials(credentials: CallCredentials): void {
    this.credentials = this.credentials.compose(credentials);
  }

  addStatusWatcher(watcher: (status: StatusObject) => void) {
    this.statusWatchers.push(watcher);
  }

  getCallNumber(): number {
    return this.callNumber;
  }
}
