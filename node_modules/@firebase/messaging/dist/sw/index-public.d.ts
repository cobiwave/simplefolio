import { FirebaseApp } from '@firebase/app';

import { NextFn , Observer , Unsubscribe } from '@firebase/util';

/**
 * Enables or disables Firebase Cloud Messaging message delivery metrics export to BigQuery. By
 * default, message delivery metrics are not exported to BigQuery. Use this method to enable or
 * disable the export at runtime.
 *
 * @param messaging - The `FirebaseMessaging` instance.
 * @param enable - Whether Firebase Cloud Messaging should export message delivery metrics to
 * BigQuery.
 *
 * @public
 */
export declare function experimentalSetDeliveryMetricsExportedToBigQueryEnabled(messaging: Messaging, enable: boolean): void;
/**
 * Options for features provided by the FCM SDK for Web. See {@link
 * https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#webpushfcmoptions |
 * WebpushFcmOptions}.
 *
 * @public
 */
export declare interface FcmOptions {
    /**
     * The link to open when the user clicks on the notification.
     */
    link?: string;
    /**
     * The label associated with the message's analytics data.
     */
    analyticsLabel?: string;
}
/* Excluded from this release type: _FirebaseMessagingName */
/**
 * Retrieves a Firebase Cloud Messaging instance.
 *
 * @returns The Firebase Cloud Messaging instance associated with the provided firebase app.
 *
 * @public
 */
export declare function getMessaging(app?: FirebaseApp): Messaging;
/**
 * Options for {@link getToken}.
 *
 * @public
 */
export declare interface GetTokenOptions {
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
 * Checks whether all required APIs exist within SW Context
 * @returns a Promise that resolves to a boolean.
 *
 * @public
 */
export declare function isSupported(): Promise<boolean>;
/**
 * Message payload that contains the notification payload that is represented with
 * {@link NotificationPayload} and the data payload that contains an arbitrary
 * number of key-value pairs sent by developers through the
 * {@link https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#notification | Send API}.
 *
 * @public
 */
export declare interface MessagePayload {
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
 * Public interface of the Firebase Cloud Messaging SDK.
 *
 * @public
 */
export declare interface Messaging {
    /**
     * The {@link @firebase/app#FirebaseApp} this `Messaging` instance is associated with.
     */
    app: FirebaseApp;
}
export { NextFn };
/**
 * Display notification details. Details are sent through the
 * {@link https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#notification | Send API}.
 *
 * @public
 */
export declare interface NotificationPayload {
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
export { Observer };
/**
 * Called when a message is received while the app is in the background. An app is considered to be
 * in the background if no active window is displayed.
 *
 * @param messaging - The {@link Messaging} instance.
 * @param nextOrObserver - This function, or observer object with `next` defined, is called when a
 * message is received and the app is currently in the background.
 *
 * @returns To stop listening for messages execute this returned function
 *
 * @public
 */
export declare function onBackgroundMessage(messaging: Messaging, nextOrObserver: NextFn<MessagePayload> | Observer<MessagePayload>): Unsubscribe;
export { Unsubscribe };
export {};
