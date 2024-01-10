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
import { FirebaseApp, FirebaseOptions } from '../public-types';
import { _FirebaseNamespace, _FirebaseService } from '../types';
import { _FirebaseAppInternal as FirebaseAppExp } from '@firebase/app';
import { Compat } from '@firebase/util';
/**
 * Global context object for a collection of services using
 * a shared authentication state.
 */
export declare class FirebaseAppLiteImpl implements FirebaseApp, Compat<FirebaseAppExp> {
    readonly _delegate: FirebaseAppExp;
    private readonly firebase;
    constructor(_delegate: FirebaseAppExp, firebase: _FirebaseNamespace);
    get automaticDataCollectionEnabled(): boolean;
    set automaticDataCollectionEnabled(val: boolean);
    get name(): string;
    get options(): FirebaseOptions;
    delete(): Promise<void>;
    /**
     * Return a service instance associated with this app (creating it
     * on demand), identified by the passed instanceIdentifier.
     *
     * NOTE: Currently storage is the only one that is leveraging this
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
}
