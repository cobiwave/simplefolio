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
import { AuthInternal } from '../../model/auth';
import { RecaptchaParameters } from '../../model/public_types';
import { Recaptcha, GreCAPTCHATopLevel, GreCAPTCHARenderOption, GreCAPTCHA } from './recaptcha';
export declare const _SOLVE_TIME_MS = 500;
export declare const _EXPIRATION_TIME_MS = 60000;
export declare const _WIDGET_ID_START = 1000000000000;
export interface Widget {
    getResponse: () => string | null;
    delete: () => void;
    execute: () => void;
}
export declare class MockReCaptcha implements Recaptcha {
    private readonly auth;
    private counter;
    _widgets: Map<number, Widget>;
    constructor(auth: AuthInternal);
    render(container: string | HTMLElement, parameters?: RecaptchaParameters): number;
    reset(optWidgetId?: number): void;
    getResponse(optWidgetId?: number): string;
    execute(optWidgetId?: number | string): Promise<string>;
}
export declare class MockGreCAPTCHATopLevel implements GreCAPTCHATopLevel {
    enterprise: GreCAPTCHA;
    ready(callback: () => void): void;
    execute(_siteKey: string, _options: {
        action: string;
    }): Promise<string>;
    render(_container: string | HTMLElement, _parameters: GreCAPTCHARenderOption): string;
}
export declare class MockGreCAPTCHA implements GreCAPTCHA {
    ready(callback: () => void): void;
    execute(_siteKey: string, _options: {
        action: string;
    }): Promise<string>;
    render(_container: string | HTMLElement, _parameters: GreCAPTCHARenderOption): string;
}
export declare class MockWidget {
    private readonly params;
    private readonly container;
    private readonly isVisible;
    private timerId;
    private deleted;
    private responseToken;
    private readonly clickHandler;
    constructor(containerOrId: string | HTMLElement, appName: string, params: RecaptchaParameters);
    getResponse(): string | null;
    delete(): void;
    execute(): void;
    private checkIfDeleted;
}
