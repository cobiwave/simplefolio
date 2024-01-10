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
import { FirebaseApp } from '@firebase/app';
/**
 * Display notification details. Details are sent through the
 * {@link https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#notification | Send API}.
 *
 * @public
 */
export interface NotificationPayload {
    /**
     * The notification's title.
     */
    title?: string;
    /**
     * The notification's body text.
     */
    body?: string;
    /**
     * The URL of an image that is downloaded on the device and displayed in the notification.
     */
    image?: string;
    /**
     * The URL to use for the notification's icon. If you don't send this key in the request,
     * FCM displays the launcher icon specified in your app manifest.
     */
    icon?: string;
}
/**
 * Options for features provided by the FCM SDK for Web. See {@link
 * https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#webpushfcmoptions |
 * WebpushFcmOptions}.
 *
 * @public
 */
export interface FcmOptions {
    /**
     * The link to open when the user clicks on the notification.
     */
    link?: string;
    /**
     * The label associated with the message's analytics data.
     */
    analyticsLabel?: string;
}
/**
 * Message payload that contains the notification payload that is represented with
 * {@link NotificationPayload} and the data payload that contains an arbitrary
 * number of key-value pairs sent by developers through the
 * {@link https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#notification | Send API}.
 *
 * @public
 */
export interface MessagePayload {
    /**
     * {@inheritdoc NotificationPayload}
     */
    notification?: NotificationPayload;
    /**
     * Arbitrary key/value payload.
     */
    data?: {
        [key: string]: string;
    };
    /**
     * {@inheritdoc FcmOptions}
     */
    fcmOptions?: FcmOptions;
    /**
     * The sender of this message.
     */
    from: string;
    /**
     * The collapse key of the message. See
     * {@link https://firebase.google.com/docs/cloud-messaging/concept-options#collapsible_and_non-collapsible_messages | Non-collapsible and collapsible messages}
     */
    collapseKey: string;
    /**
     * The message ID of a message.
     */
    messageId: string;
}
/**
 * Options for {@link getToken}.
 *
 * @public
 */
export interface GetTokenOptions {
    /**
     * The public server key provided to push services. The key is used to
     * authenticate push subscribers to receive push messages only from sending servers that hold
     * the corresponding private key. If it is not provided, a default VAPID key is used. Note that some
     * push services (Chrome Push Service) require a non-default VAPID key. Therefore, it is recommended
     * to generate and import a VAPID key for your project with
     * {@link https://firebase.google.com/docs/cloud-messaging/js/client#configure_web_credentials_in_your_app | Configure Web Credentials with FCM}.
     * See
     * {@link https://developers.google.com/web/fundamentals/push-notifications/web-push-protocol | The Web Push Protocol}
     * for details on web push services.
     */
    vapidKey?: string;
    /**
     * The service worker registration for receiving push
     * messaging. If the registration is not provided explicitly, you need to have a
     * `firebase-messaging-sw.js` at your root location. See
     * {@link https://firebase.google.com/docs/cloud-messaging/js/client#access_the_registration_token | Access the registration token}
     * for more details.
     */
    serviceWorkerRegistration?: ServiceWorkerRegistration;
}
/**
 * Public interface of the Firebase Cloud Messaging SDK.
 *
 * @public
 */
export interface Messaging {
    /**
     * The {@link @firebase/app#FirebaseApp} this `Messaging` instance is associated with.
     */
    app: FirebaseApp;
}
/**
 * @internal
 */
export declare type _FirebaseMessagingName = 'messaging';
export { NextFn, Observer, Unsubscribe } from '@firebase/util';
declare module '@firebase/component' {
    interface NameServiceMapping {
        'messaging': Messaging;
    }
}
