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
import { MessagingCompat } from './messaging-compat';
/**
 * Define extension behavior of `registerMessaging`
 */
declare module '@firebase/app-compat' {
    interface FirebaseNamespace {
        messaging: {
            (app?: FirebaseApp): MessagingCompat;
            isSupported(): boolean;
        };
    }
    interface FirebaseApp {
        messaging(): MessagingCompat;
    }
}

import { FirebaseApp as FirebaseAppCompat } from "@firebase/app-compat";
import { type Messaging, type GetTokenOptions, type NextFn, type MessagePayload, type Observer, type Unsubscribe } from "@firebase/messaging";
declare module "@firebase/messaging" {
    function deleteToken(messaging: MessagingCompat): Promise<boolean>;
    function getMessaging(app?: FirebaseAppCompat): Messaging;
    function getToken(messaging: MessagingCompat, options?: GetTokenOptions): Promise<string>;
    function onMessage(messaging: MessagingCompat, nextOrObserver: NextFn<MessagePayload> | Observer<MessagePayload>): Unsubscribe;
}
