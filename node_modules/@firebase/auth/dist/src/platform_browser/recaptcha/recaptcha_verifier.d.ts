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
import { Auth, RecaptchaParameters } from '../../model/public_types';
import { ApplicationVerifierInternal } from '../../model/application_verifier';
import { ReCaptchaLoader } from './recaptcha_loader';
export declare const RECAPTCHA_VERIFIER_TYPE = "recaptcha";
/**
 * An {@link https://www.google.com/recaptcha/ | reCAPTCHA}-based application verifier.
 *
 * @remarks
 * `RecaptchaVerifier` does not work in a Node.js environment.
 *
 * @public
 */
export declare class RecaptchaVerifier implements ApplicationVerifierInternal {
    private readonly parameters;
    /**
     * The application verifier type.
     *
     * @remarks
     * For a reCAPTCHA verifier, this is 'recaptcha'.
     */
    readonly type = "recaptcha";
    private destroyed;
    private widgetId;
    private readonly container;
    private readonly isInvisible;
    private readonly tokenChangeListeners;
    private renderPromise;
    private readonly auth;
    /** @internal */
    readonly _recaptchaLoader: ReCaptchaLoader;
    private recaptcha;
    /**
     * @param authExtern - The corresponding Firebase {@link Auth} instance.
     *
     * @param containerOrId - The reCAPTCHA container parameter.
     *
     * @remarks
     * This has different meaning depending on whether the reCAPTCHA is hidden or visible. For a
     * visible reCAPTCHA the container must be empty. If a string is used, it has to correspond to
     * an element ID. The corresponding element must also must be in the DOM at the time of
     * initialization.
     *
     * @param parameters - The optional reCAPTCHA parameters.
     *
     * @remarks
     * Check the reCAPTCHA docs for a comprehensive list. All parameters are accepted except for
     * the sitekey. Firebase Auth backend provisions a reCAPTCHA for each project and will
     * configure this upon rendering. For an invisible reCAPTCHA, a size key must have the value
     * 'invisible'.
     */
    constructor(authExtern: Auth, containerOrId: HTMLElement | string, parameters?: RecaptchaParameters);
    /**
     * Waits for the user to solve the reCAPTCHA and resolves with the reCAPTCHA token.
     *
     * @returns A Promise for the reCAPTCHA token.
     */
    verify(): Promise<string>;
    /**
     * Renders the reCAPTCHA widget on the page.
     *
     * @returns A Promise that resolves with the reCAPTCHA widget ID.
     */
    render(): Promise<number>;
    /** @internal */
    _reset(): void;
    /**
     * Clears the reCAPTCHA widget from the page and destroys the instance.
     */
    clear(): void;
    private validateStartingState;
    private makeTokenCallback;
    private assertNotDestroyed;
    private makeRenderPromise;
    private init;
    private getAssertedRecaptcha;
}
