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
/**
 * A utility class to parse email action URLs such as password reset, email verification,
 * email link sign in, etc.
 *
 * @public
 */
export declare class ActionCodeURL {
    /**
     * The API key of the email action link.
     */
    readonly apiKey: string;
    /**
     * The action code of the email action link.
     */
    readonly code: string;
    /**
     * The continue URL of the email action link. Null if not provided.
     */
    readonly continueUrl: string | null;
    /**
     * The language code of the email action link. Null if not provided.
     */
    readonly languageCode: string | null;
    /**
     * The action performed by the email action link. It returns from one of the types from
     * {@link ActionCodeInfo}
     */
    readonly operation: string;
    /**
     * The tenant ID of the email action link. Null if the email action is from the parent project.
     */
    readonly tenantId: string | null;
    /**
     * @param actionLink - The link from which to extract the URL.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @internal
     */
    constructor(actionLink: string);
    /**
     * Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
     * otherwise returns null.
     *
     * @param link  - The email action link string.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @public
     */
    static parseLink(link: string): ActionCodeURL | null;
}
/**
 * Parses the email action link string and returns an {@link ActionCodeURL} if
 * the link is valid, otherwise returns null.
 *
 * @public
 */
export declare function parseActionCodeURL(link: string): ActionCodeURL | null;
