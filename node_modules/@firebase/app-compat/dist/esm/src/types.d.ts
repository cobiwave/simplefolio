/**
 * @license
 * Copyright 2017 Google LLC
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
/**
 * THIS FILE IS FOR INTERNAL USAGE ONLY, IF YOU ARE NOT DEVELOPING THE FIREBASE
 * SDKs, PLEASE DO NOT REFERENCE THIS FILE AS IT MAY CHANGE WITHOUT WARNING
 */
import { FirebaseApp, FirebaseNamespace } from './public-types';
import { Compat } from '@firebase/util';
import { Component, ComponentContainer, Name } from '@firebase/component';
export interface FirebaseServiceInternals {
    /**
     * Delete the service and free it's resources - called from
     * app.delete().
     */
    delete(): Promise<void>;
}
export interface _FirebaseService extends Compat<unknown> {
    app: FirebaseApp;
    INTERNAL?: FirebaseServiceInternals;
}
/**
 * All ServiceNamespaces extend from FirebaseServiceNamespace
 */
export interface FirebaseServiceNamespace<T extends _FirebaseService> {
    (app?: FirebaseApp): T;
}
export interface _FirebaseApp extends FirebaseApp {
    container: ComponentContainer;
    _addComponent<T extends Name>(component: Component<T>): void;
    _addOrOverwriteComponent<T extends Name>(component: Component<T>): void;
    _removeServiceInstance(name: string, instanceIdentifier?: string): void;
}
export interface _FirebaseNamespace extends FirebaseNamespace {
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
