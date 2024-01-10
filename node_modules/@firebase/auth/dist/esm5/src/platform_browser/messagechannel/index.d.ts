/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { PromiseSettledResult } from './promise';
export declare const enum _TimeoutDuration {
    ACK = 50,
    COMPLETION = 3000,
    LONG_ACK = 800
}
/**
 * Enumeration of possible response types from the Receiver.
 */
export declare const enum _Status {
    ACK = "ack",
    DONE = "done"
}
export declare const enum _MessageError {
    CONNECTION_CLOSED = "connection_closed",
    CONNECTION_UNAVAILABLE = "connection_unavailable",
    INVALID_RESPONSE = "invalid_response",
    TIMEOUT = "timeout",
    UNKNOWN = "unknown_error",
    UNSUPPORTED_EVENT = "unsupported_event"
}
/**
 * Enumeration of possible events sent by the Sender.
 */
export declare const enum _EventType {
    KEY_CHANGED = "keyChanged",
    PING = "ping"
}
/**
 * Response to a {@link EventType.KEY_CHANGED} event.
 */
export interface KeyChangedResponse {
    keyProcessed: boolean;
}
/**
 * Response to a {@link EventType.PING} event.
 */
export declare type _PingResponse = _EventType[];
export declare type _ReceiverResponse = KeyChangedResponse | _PingResponse;
interface MessageEvent {
    eventType: _EventType;
    eventId: string;
}
/**
 * Request for a {@link EventType.KEY_CHANGED} event.
 */
export interface KeyChangedRequest {
    key: string;
}
/**
 * Request for a {@link EventType.PING} event.
 */
export interface PingRequest {
}
/** Data sent by Sender */
export declare type _SenderRequest = KeyChangedRequest | PingRequest;
/** Receiver handler to process events sent by the Sender */
export interface ReceiverHandler<T extends _ReceiverResponse, S extends _SenderRequest> {
    (origin: string, data: S): T | Promise<T>;
}
/** Full message sent by Sender  */
export interface SenderMessageEvent<T extends _SenderRequest> extends MessageEvent {
    data: T;
}
export declare type _ReceiverMessageResponse<T extends _ReceiverResponse> = Array<PromiseSettledResult<T>> | null;
/** Full message sent by Receiver */
export interface ReceiverMessageEvent<T extends _ReceiverResponse> extends MessageEvent {
    status: _Status;
    response: _ReceiverMessageResponse<T>;
}
export {};
