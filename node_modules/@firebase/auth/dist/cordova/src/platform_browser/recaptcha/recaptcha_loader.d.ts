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
import { Recaptcha } from './recaptcha';
export declare const _JSLOAD_CALLBACK: string;
/**
 * We need to mark this interface as internal explicitly to exclude it in the public typings, because
 * it references AuthInternal which has a circular dependency with UserInternal.
 *
 * @internal
 */
export interface ReCaptchaLoader {
    load(auth: AuthInternal, hl?: string): Promise<Recaptcha>;
    clearedOneInstance(): void;
}
/**
 * Loader for the GReCaptcha library. There should only ever be one of this.
 */
export declare class ReCaptchaLoaderImpl implements ReCaptchaLoader {
    private hostLanguage;
    private counter;
    /**
     * Check for `render()` method. `window.grecaptcha` will exist if the Enterprise
     * version of the ReCAPTCHA script was loaded by someone else (e.g. App Check) but
     * `window.grecaptcha.render()` will not. Another load will add it.
     */
    private readonly librarySeparatelyLoaded;
    load(auth: AuthInternal, hl?: string): Promise<Recaptcha>;
    clearedOneInstance(): void;
    private shouldResolveImmediately;
}
export declare class MockReCaptchaLoaderImpl implements ReCaptchaLoader {
    load(auth: AuthInternal): Promise<Recaptcha>;
    clearedOneInstance(): void;
}
