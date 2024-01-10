/**
 * @license
 * Copyright 2022 Google LLC
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
import { RecaptchaActionName } from '../../api';
import { Auth } from '../../model/public_types';
import { AuthInternal } from '../../model/auth';
export declare const RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
export declare const FAKE_TOKEN = "NO_RECAPTCHA";
export declare class RecaptchaEnterpriseVerifier {
    /**
     * Identifies the type of application verifier (e.g. "recaptcha-enterprise").
     */
    readonly type = "recaptcha-enterprise";
    private readonly auth;
    /**
     *
     * @param authExtern - The corresponding Firebase {@link Auth} instance.
     *
     */
    constructor(authExtern: Auth);
    /**
     * Executes the verification process.
     *
     * @returns A Promise for a token that can be used to assert the validity of a request.
     */
    verify(action?: string, forceRefresh?: boolean): Promise<string>;
}
export declare function injectRecaptchaFields<T>(auth: AuthInternal, request: T, action: RecaptchaActionName, captchaResp?: boolean): Promise<T>;
declare type ActionMethod<TRequest, TResponse> = (auth: Auth, request: TRequest) => Promise<TResponse>;
export declare function handleRecaptchaFlow<TRequest, TResponse>(authInstance: AuthInternal, request: TRequest, actionName: RecaptchaActionName, actionMethod: ActionMethod<TRequest, TResponse>): Promise<TResponse>;
export declare function _initializeRecaptchaConfig(auth: Auth): Promise<void>;
export {};
