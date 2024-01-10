import { Compat } from '@firebase/util';
import { Component } from '@firebase/component';
import { LogCallback } from '@firebase/logger';
import { LogLevelString } from '@firebase/logger';
import { LogOptions } from '@firebase/logger';
import { Name } from '@firebase/component';

declare const firebase: FirebaseNamespace;
export default firebase;

/**
 * This interface will be enhanced by other products by adding e.g. firestore(), messaging() methods.
 * As a result, FirebaseAppImpl can't directly implement it, otherwise there will be typings errors:
 *
 * For example, "Class 'FirebaseAppImpl' incorrectly implements interface 'FirebaseApp'.
 * Property 'installations' is missing in type 'FirebaseAppImpl' but required in type 'FirebaseApp'"
 *
 * To workaround this issue, we defined a _FirebaseApp interface which is implemented by FirebaseAppImpl
 * and let FirebaseApp extends it.
 */
export declare interface FirebaseApp extends _FirebaseApp {
}

declare interface _FirebaseApp {
    /**
     * The (read-only) name (identifier) for this App. '[DEFAULT]' is the default
     * App.
     */
    name: string;
    /**
     * The (read-only) configuration options from the app initialization.
     */
    options: FirebaseOptions;
    /**
     * The settable config flag for GDPR opt-in/opt-out
     */
    automaticDataCollectionEnabled: boolean;
    /**
     * Make the given App unusable and free resources.
     */
    delete(): Promise<void>;
}

declare interface FirebaseAppConfig {
    name?: string;
    automaticDataCollectionEnabled?: boolean;
}

declare interface FirebaseAppContructor {
    new (): FirebaseApp;
}

export declare interface FirebaseNamespace {
    /**
     * Create (and initialize) a FirebaseApp.
     *
     * @param options Options to configure the services used in the App.
     * @param config The optional config for your firebase app
     */
    initializeApp(options: FirebaseOptions, config?: FirebaseAppConfig): FirebaseApp;
    /**
     * Create (and initialize) a FirebaseApp.
     *
     * @param options Options to configure the services used in the App.
     * @param name The optional name of the app to initialize ('[DEFAULT]' if
     * omitted)
     */
    initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
    app: {
        /**
         * Retrieve an instance of a FirebaseApp.
         *
         * Usage: firebase.app()
         *
         * @param name The optional name of the app to return ('[DEFAULT]' if omitted)
         */
        (name?: string): FirebaseApp;
        /**
         * For testing FirebaseApp instances:
         *  app() instanceof firebase.app.App
         *
         * DO NOT call this constuctor directly (use firebase.app() instead).
         */
        App: FirebaseAppContructor;
    };
    /**
     * A (read-only) array of all the initialized Apps.
     */
    apps: FirebaseApp[];
    /**
     * Registers a library's name and version for platform logging purposes.
     * @param library Name of 1p or 3p library (e.g. firestore, angularfire)
     * @param version Current version of that library.
     */
    registerVersion(library: string, version: string, variant?: string): void;
    setLogLevel(logLevel: LogLevelString): void;
    onLog(logCallback: LogCallback, options?: LogOptions): void;
    SDK_VERSION: string;
}

export declare interface _FirebaseNamespace extends FirebaseNamespace {
    INTERNAL: {
        /**
         * Internal API to register a Firebase Service into the firebase namespace.
         *
         * Each service will create a child namespace (firebase.<name>) which acts as
         * both a namespace for service specific properties, and also as a service
         * accessor function (firebase.<name>() or firebase.<name>(app)).
         *
         * @param name The Firebase Service being registered.
         * @param createService Factory function to create a service instance.
         * @param serviceProperties Properties to copy to the service's namespace.
         * @param appHook All appHooks called before initializeApp returns to caller.
         * @param allowMultipleInstances Whether the registered service supports
         *   multiple instances per app. If not specified, the default is false.
         */
        registerComponent<T extends Name>(component: Component<T>): FirebaseServiceNamespace<_FirebaseService> | null;
        /**
         * Internal API to remove an app from the list of registered apps.
         */
        removeApp(name: string): void;
        useAsService(app: FirebaseApp, serviceName: string): string | null;
        [index: string]: unknown;
    };
}

declare interface FirebaseOptions {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
}

export declare interface _FirebaseService extends Compat<unknown> {
    app: FirebaseApp;
    INTERNAL?: FirebaseServiceInternals;
}

declare interface FirebaseServiceInternals {
    /**
     * Delete the service and free it's resources - called from
     * app.delete().
     */
    delete(): Promise<void>;
}

/**
 * All ServiceNamespaces extend from FirebaseServiceNamespace
 */
declare interface FirebaseServiceNamespace<T extends _FirebaseService> {
    (app?: FirebaseApp): T;
}

export { }
