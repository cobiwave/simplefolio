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
import { _SenderRequest, _EventType, _ReceiverMessageResponse, _ReceiverResponse, _TimeoutDuration } from './index';
/**
 * Interface for sending messages and waiting for a completion response.
 *
 */
export declare class Sender {
    private readonly target;
    private readonly handlers;
    constructor(target: ServiceWorker);
    /**
     * Unsubscribe the handler and remove it from our tracking Set.
     *
     * @param handler - The handler to unsubscribe.
     */
    private removeMessageHandler;
    /**
     * Send a message to the Receiver located at {@link target}.
     *
     * @remarks
     * We'll first wait a bit for an ACK , if we get one we will wait significantly longer until the
     * receiver has had a chance to fully process the event.
     *
     * @param eventType - Type of event to send.
     * @param data - The payload of the event.
     * @param timeout - Timeout for waiting on an ACK from the receiver.
     *
     * @returns An array of settled promises from all the handlers that were listening on the receiver.
     */
    _send<T extends _ReceiverResponse, S extends _SenderRequest>(eventType: _EventType, data: S, timeout?: _TimeoutDuration): Promise<_ReceiverMessageResponse<T>>;
}
