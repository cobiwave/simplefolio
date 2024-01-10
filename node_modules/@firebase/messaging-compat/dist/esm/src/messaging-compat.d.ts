/**
 * @license
 * Copyright 2020 Google LLC
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
import { FirebaseApp as AppCompat, _FirebaseService } from '@firebase/app-compat';
import { Messaging, MessagePayload } from '@firebase/messaging';
import { NextFn, Observer, Unsubscribe } from '@firebase/util';
export interface MessagingCompat {
    getToken(options?: {
        vapidKey?: string;
        serviceWorkerRegistration?: ServiceWorkerRegistration;
    }): Promise<string>;
    deleteToken(): Promise<boolean>;
    onMessage(nextOrObserver: NextFn<MessagePayload> | Observer<MessagePayload>): Unsubscribe;
    onBackgroundMessage(nextOrObserver: NextFn<MessagePayload> | Observer<MessagePayload>): Unsubscribe;
}
export declare function isSupported(): boolean;
export declare class MessagingCompatImpl implements MessagingCompat, _FirebaseService {
    readonly app: AppCompat;
    readonly _delegate: Messaging;
    constructor(app: AppCompat, _delegate: Messaging);
    getToken(options?: {
        vapidKey?: string;
        serviceWorkerRegistration?: ServiceWorkerRegistration;
    }): Promise<string>;
    deleteToken(): Promise<boolean>;
    onMessage(nextOrObserver: NextFn<MessagePayload> | Observer<MessagePayload>): Unsubscribe;
    onBackgroundMessage(nextOrObserver: NextFn<MessagePayload> | Observer<MessagePayload>): Unsubscribe;
}
