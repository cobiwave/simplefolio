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
import { FirebaseOptions } from './public-types';
import { Component } from '@firebase/component';
import { _FirebaseAppInternal as _FirebaseAppExp } from '@firebase/app';
import { _FirebaseService, _FirebaseNamespace } from './types';
import { Compat } from '@firebase/util';
export interface _FirebaseApp {
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
/**
 * Global context object for a collection of services using
 * a shared authentication state.
 *
 * marked as internal because it references internal types exported from @firebase/app
 * @internal
 */
export declare class FirebaseAppImpl implements Compat<_FirebaseAppExp>, _FirebaseApp {
    readonly _delegate: _FirebaseAppExp;
    private readonly firebase;
    private container;
    constructor(_delegate: _FirebaseAppExp, firebase: _FirebaseNamespace);
    get automaticDataCollectionEnabled(): boolean;
    set automaticDataCollectionEnabled(val: boolean);
    get name(): string;
    get options(): FirebaseOptions;
    delete(): Promise<void>;
    /**
     * Return a service instance associated with this app (creating it
     * on demand), identified by the passed instanceIdentifier.
     *
     * NOTE: Currently storage and functions are the only ones that are leveraging this
     * functionality. They invoke it by calling:
     *
     * ```javascript
     * firebase.app().storage('STORAGE BUCKET ID')
     * ```
     *
     * The service name is passed to this already
     * @internal
     */
    _getService(name: string, instanceIdentifier?: string): _FirebaseService;
    /**
     * Remove a service instance from the cache, so we will create a new instance for this service
     * when people try to get it again.
     *
     * NOTE: currently only firestore uses this functionality to support firestore shutdown.
     *
     * @param name The service name
     * @param instanceIdentifier instance identifier in case multiple instances are allowed
     * @internal
     */
    _removeServiceInstance(name: string, instanceIdentifier?: string): void;
    /**
     * @param component the component being added to this app's container
     * @internal
     */
    _addComponent(component: Component): void;
    _addOrOverwriteComponent(component: Component): void;
    toJSON(): object;
}
