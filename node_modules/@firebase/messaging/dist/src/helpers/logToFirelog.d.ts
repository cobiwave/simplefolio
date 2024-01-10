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
import { LogEvent, LogRequest } from '../interfaces/logging-types';
import { MessagePayloadInternal } from '../interfaces/internal-message-payload';
import { MessagingService } from '../messaging-service';
export declare function startLoggingService(messaging: MessagingService): void;
/**
 *
 * @param messaging the messaging instance.
 * @param offsetInMs this method execute after `offsetInMs` elapsed .
 */
export declare function _processQueue(messaging: MessagingService, offsetInMs: number): void;
export declare function _dispatchLogEvents(messaging: MessagingService): Promise<void>;
export declare function stageLog(messaging: MessagingService, internalPayload: MessagePayloadInternal): Promise<void>;
export declare function _createLogRequest(logEventQueue: LogEvent[]): LogRequest;
export declare function _mergeStrings(s1: string, s2: string): string;
