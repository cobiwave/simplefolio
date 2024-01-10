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
import { FirebaseApp } from '@firebase/app-compat';
import * as exp from '@firebase/auth/internal';
import * as compat from '@firebase/auth-types';
import { Compat } from '@firebase/util';
export declare class RecaptchaVerifier implements compat.RecaptchaVerifier, Compat<exp.ApplicationVerifier> {
    readonly _delegate: exp.RecaptchaVerifier;
    type: string;
    constructor(container: HTMLElement | string, parameters?: object | null, app?: FirebaseApp);
    clear(): void;
    render(): Promise<number>;
    verify(): Promise<string>;
}
