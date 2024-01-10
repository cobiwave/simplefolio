/**
 * @license
 * Copyright 2023 Google LLC
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
 * The global, singleton instance of TestingHooksSpi.
 *
 * This variable will be `null` in all cases _except_ when running from
 * integration tests that have registered callbacks to be notified of events
 * that happen during the test execution.
 */
export declare let testingHooksSpi: TestingHooksSpi | null;
/**
 * Sets the value of the `testingHooksSpi` object.
 * @param instance the instance to set.
 */
export declare function setTestingHooksSpi(instance: TestingHooksSpi): void;
/**
 * The "service provider interface" for the testing hooks.
 *
 * The implementation of this object will handle the callbacks made by the SDK
 * to be handled by the integration tests.
 *
 * This "SPI" is separated from the implementation to avoid import cycles and
 * to enable production builds to fully tree-shake away the testing hooks logic.
 */
export interface TestingHooksSpi {
    /**
     * Invokes all callbacks registered with
     * `TestingHooks.onExistenceFilterMismatch()` with the given info.
     */
    notifyOnExistenceFilterMismatch(info: ExistenceFilterMismatchInfo): void;
}
/**
 * Information about an existence filter mismatch.
 * @internal
 */
export interface ExistenceFilterMismatchInfo {
    /** The number of documents that matched the query in the local cache. */
    localCacheCount: number;
    /**
     * The number of documents that matched the query on the server, as specified
     * in the ExistenceFilter message's `count` field.
     */
    existenceFilterCount: number;
    /**
     * The projectId used when checking documents for membership in the bloom
     * filter.
     */
    projectId: string;
    /**
     * The databaseId used when checking documents for membership in the bloom
     * filter.
     */
    databaseId: string;
    /**
     * Information about the bloom filter provided by Watch in the ExistenceFilter
     * message's `unchangedNames` field. If this property is omitted or undefined
     * then that means that Watch did _not_ provide a bloom filter.
     */
    bloomFilter?: {
        /**
         * Whether a full requery was averted by using the bloom filter. If false,
         * then something happened, such as a false positive, to prevent using the
         * bloom filter to avoid a full requery.
         */
        applied: boolean;
        /** The number of hash functions used in the bloom filter. */
        hashCount: number;
        /** The number of bytes in the bloom filter's bitmask. */
        bitmapLength: number;
        /** The number of bits of padding in the last byte of the bloom filter. */
        padding: number;
        /**
         * Tests the given string for membership in the bloom filter created from
         * the existence filter; will be undefined if creating the bloom filter
         * failed.
         */
        mightContain?: (value: string) => boolean;
    };
}
