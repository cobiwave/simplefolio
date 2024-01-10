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
import { FirestoreSettings as LiteSettings } from '../lite-api/settings';
import { FirestoreLocalCache } from './cache_config';
import { ExperimentalLongPollingOptions } from './long_polling_options';
export { DEFAULT_HOST } from '../lite-api/settings';
/**
 * Settings that can be passed to `enableIndexedDbPersistence()` to configure
 * Firestore persistence.
 *
 * Persistence cannot be used in a Node.js environment.
 */
export interface PersistenceSettings {
    /**
     * Whether to force enable persistence for the client. This cannot be used
     * with multi-tab synchronization and is primarily intended for use with Web
     * Workers. Setting this to `true` will enable persistence, but cause other
     * tabs using persistence to fail.
     */
    forceOwnership?: boolean;
}
/**
 * Specifies custom configurations for your Cloud Firestore instance.
 * You must set these before invoking any other methods.
 */
export interface FirestoreSettings extends LiteSettings {
    /**
     * NOTE: This field will be deprecated in a future major release. Use `cache` field
     * instead to specify cache size, and other cache configurations.
     *
     * An approximate cache size threshold for the on-disk data. If the cache
     * grows beyond this size, Firestore will start removing data that hasn't been
     * recently used. The size is not a guarantee that the cache will stay below
     * that size, only that if the cache exceeds the given size, cleanup will be
     * attempted.
     *
     * The default value is 40 MB. The threshold must be set to at least 1 MB, and
     * can be set to `CACHE_SIZE_UNLIMITED` to disable garbage collection.
     */
    cacheSizeBytes?: number;
    /**
     * Specifies the cache used by the SDK. Available options are `MemoryLocalCache`
     * and `PersistentLocalCache`, each with different configuration options.
     *
     * When unspecified, `MemoryLocalCache` will be used by default.
     *
     * NOTE: setting this field and `cacheSizeBytes` at the same time will throw
     * exception during SDK initialization. Instead, using the configuration in
     * the `FirestoreLocalCache` object to specify the cache size.
     */
    localCache?: FirestoreLocalCache;
    /**
     * Forces the SDK’s underlying network transport (WebChannel) to use
     * long-polling. Each response from the backend will be closed immediately
     * after the backend sends data (by default responses are kept open in
     * case the backend has more data to send). This avoids incompatibility
     * issues with certain proxies, antivirus software, etc. that incorrectly
     * buffer traffic indefinitely. Use of this option will cause some
     * performance degradation though.
     *
     * This setting cannot be used with `experimentalAutoDetectLongPolling` and
     * may be removed in a future release. If you find yourself using it to
     * work around a specific network reliability issue, please tell us about
     * it in https://github.com/firebase/firebase-js-sdk/issues/1674.
     *
     * This setting cannot be used in a Node.js environment.
     */
    experimentalForceLongPolling?: boolean;
    /**
     * Configures the SDK's underlying transport (WebChannel) to automatically
     * detect if long-polling should be used. This is very similar to
     * `experimentalForceLongPolling`, but only uses long-polling if required.
     *
     * After having had a default value of `false` since its inception in 2019,
     * the default value of this setting was changed in May 2023 to `true` in
     * v9.22.0 of the Firebase JavaScript SDK. That is, auto-detection of long
     * polling is now enabled by default. To disable it, set this setting to
     * `false`, and please open a GitHub issue to share the problems that
     * motivated you disabling long-polling auto-detection.
     *
     * This setting cannot be used in a Node.js environment.
     */
    experimentalAutoDetectLongPolling?: boolean;
    /**
     * Options that configure the SDK’s underlying network transport (WebChannel)
     * when long-polling is used.
     *
     * These options are only used if `experimentalForceLongPolling` is true or if
     * `experimentalAutoDetectLongPolling` is true and the auto-detection
     * determined that long-polling was needed. Otherwise, these options have no
     * effect.
     */
    experimentalLongPollingOptions?: ExperimentalLongPollingOptions;
}
