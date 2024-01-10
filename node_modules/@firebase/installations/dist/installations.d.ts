/**
 * Firebase Installations
 *
 * @packageDocumentation
 */

import { FirebaseApp } from '@firebase/app';

/**
 * Deletes the Firebase Installation and all associated data.
 * @param installations - The `Installations` instance.
 *
 * @public
 */
export declare function deleteInstallations(installations: Installations): Promise<void>;

/**
 * An interface for Firebase internal SDKs use only.
 *
 * @internal
 */
export declare interface _FirebaseInstallationsInternal {
    /**
     * Creates a Firebase Installation if there isn't one for the app and
     * returns the Installation ID.
     */
    getId(): Promise<string>;
    /**
     * Returns an Authentication Token for the current Firebase Installation.
     */
    getToken(forceRefresh?: boolean): Promise<string>;
}

/**
 * Creates a Firebase Installation if there isn't one for the app and
 * returns the Installation ID.
 * @param installations - The `Installations` instance.
 *
 * @public
 */
export declare function getId(installations: Installations): Promise<string>;

/**
 * Returns an instance of {@link Installations} associated with the given
 * {@link @firebase/app#FirebaseApp} instance.
 * @param app - The {@link @firebase/app#FirebaseApp} instance.
 *
 * @public
 */
export declare function getInstallations(app?: FirebaseApp): Installations;

/**
 * Returns a Firebase Installations auth token, identifying the current
 * Firebase Installation.
 * @param installations - The `Installations` instance.
 * @param forceRefresh - Force refresh regardless of token expiration.
 *
 * @public
 */
export declare function getToken(installations: Installations, forceRefresh?: boolean): Promise<string>;

/**
 * An user defined callback function that gets called when Installations ID changes.
 *
 * @public
 */
export declare type IdChangeCallbackFn = (installationId: string) => void;

/**
 * Unsubscribe a callback function previously added via {@link IdChangeCallbackFn}.
 *
 * @public
 */
export declare type IdChangeUnsubscribeFn = () => void;

/**
 * Public interface of the Firebase Installations SDK.
 *
 * @public
 */
export declare interface Installations {
    /**
     * The {@link @firebase/app#FirebaseApp} this `Installations` instance is associated with.
     */
    app: FirebaseApp;
}

/**
 * Sets a new callback that will get called when Installation ID changes.
 * Returns an unsubscribe function that will remove the callback when called.
 * @param installations - The `Installations` instance.
 * @param callback - The callback function that is invoked when FID changes.
 * @returns A function that can be called to unsubscribe.
 *
 * @public
 */
export declare function onIdChange(installations: Installations, callback: IdChangeCallbackFn): IdChangeUnsubscribeFn;

export { }
