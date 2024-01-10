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
import { RecaptchaParameters } from '../../model/public_types';
import { GetRecaptchaConfigResponse, RecaptchaEnforcementProviderState } from '../../api/authentication/recaptcha';
import { EnforcementState } from '../../api/index';
export interface Recaptcha {
    render: (container: HTMLElement, parameters: RecaptchaParameters) => number;
    getResponse: (id: number) => string;
    execute: (id: number) => unknown;
    reset: (id: number) => unknown;
}
export declare function isV2(grecaptcha: Recaptcha | GreCAPTCHA | undefined): grecaptcha is Recaptcha;
export interface GreCAPTCHATopLevel extends GreCAPTCHA {
    enterprise: GreCAPTCHA;
}
export interface GreCAPTCHA {
    ready: (callback: () => void) => void;
    execute: (siteKey: string, options: {
        action: string;
    }) => Promise<string>;
    render: (container: string | HTMLElement, parameters: GreCAPTCHARenderOption) => string;
}
export interface GreCAPTCHARenderOption {
    sitekey: string;
    size: 'invisible';
}
export declare function isEnterprise(grecaptcha: Recaptcha | GreCAPTCHA | undefined): grecaptcha is GreCAPTCHATopLevel;
declare global {
    interface Window {
        grecaptcha?: Recaptcha | GreCAPTCHATopLevel;
    }
}
export declare class RecaptchaConfig {
    /**
     * The reCAPTCHA site key.
     */
    siteKey: string;
    /**
     * The list of providers and their enablement status for reCAPTCHA Enterprise.
     */
    recaptchaEnforcementState: RecaptchaEnforcementProviderState[];
    constructor(response: GetRecaptchaConfigResponse);
    /**
     * Returns the reCAPTCHA Enterprise enforcement state for the given provider.
     *
     * @param providerStr - The provider whose enforcement state is to be returned.
     * @returns The reCAPTCHA Enterprise enforcement state for the given provider.
     */
    getProviderEnforcementState(providerStr: string): EnforcementState | null;
    /**
     * Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
     *
     * @param providerStr - The provider whose enablement state is to be returned.
     * @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
     */
    isProviderEnabled(providerStr: string): boolean;
}
