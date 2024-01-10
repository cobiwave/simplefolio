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
import { MemoryOfflineComponentProvider, OfflineComponentProvider, OnlineComponentProvider } from '../core/component_provider';
/**
 * Provides an in-memory cache to the SDK. This is the default cache unless explicitly
 * configured otherwise.
 *
 * To use, create an instance using the factory function {@link memoryLocalCache()}, then
 * set the instance to `FirestoreSettings.cache` and call `initializeFirestore` using
 * the settings object.
 */
export declare type MemoryLocalCache = {
    kind: 'memory';
    /**
     * @internal
     */
    _onlineComponentProvider: OnlineComponentProvider;
    /**
     * @internal
     */
    _offlineComponentProvider: MemoryOfflineComponentProvider;
};
/**
 * Provides a persistent cache backed by IndexedDb to the SDK.
 *
 * To use, create an instance using the factory function {@link persistentLocalCache()}, then
 * set the instance to `FirestoreSettings.cache` and call `initializeFirestore` using
 * the settings object.
 */
export declare type PersistentLocalCache = {
    kind: 'persistent';
    /**
     * @internal
     */
    _onlineComponentProvider: OnlineComponentProvider;
    /**
     * @internal
     */
    _offlineComponentProvider: OfflineComponentProvider;
};
/**
 * Union type from all supported SDK cache layer.
 */
export declare type FirestoreLocalCache = MemoryLocalCache | PersistentLocalCache;
/**
 * Union type from all support gabage collectors for memory local cache.
 */
export declare type MemoryGarbageCollector = MemoryEagerGarbageCollector | MemoryLruGarbageCollector;
/**
 * A garbage collector deletes documents whenever they are not part of any
 * active queries, and have no local mutations attached to them.
 *
 * This collector tries to ensure lowest memory footprints from the SDK,
 * at the risk of documents not being cached for offline queries or for
 * direct queries to the cache.
 *
 * Use factory function {@link memoryEagerGarbageCollector()} to create an
 * instance of this collector.
 */
export declare type MemoryEagerGarbageCollector = {
    kind: 'memoryEager';
    /**
     * @internal
     */
    _offlineComponentProvider: MemoryOfflineComponentProvider;
};
/**
 * A garbage collector deletes Least-Recently-Used documents in multiple
 * batches.
 *
 * This collector is configured with a target size, and will only perform
 * collection when the cached documents exceed the target size. It avoids
 * querying backend repeated for the same query or document, at the risk
 * of having a larger memory footprint.
 *
 * Use factory function {@link memoryLruGarbageCollector()} to create a
 * instance of this collector.
 */
export declare type MemoryLruGarbageCollector = {
    kind: 'memoryLru';
    /**
     * @internal
     */
    _offlineComponentProvider: MemoryOfflineComponentProvider;
};
/**
 * Creates an instance of `MemoryEagerGarbageCollector`. This is also the
 * default garbage collector unless it is explicitly specified otherwise.
 */
export declare function memoryEagerGarbageCollector(): MemoryEagerGarbageCollector;
/**
 * Creates an instance of `MemoryLruGarbageCollector`.
 *
 * A target size can be specified as part of the setting parameter. The
 * collector will start deleting documents once the cache size exceeds
 * the given size. The default cache size is 40MB (40 * 1024 * 1024 bytes).
 */
export declare function memoryLruGarbageCollector(settings?: {
    cacheSizeBytes?: number;
}): MemoryLruGarbageCollector;
/**
 * An settings object to configure an `MemoryLocalCache` instance.
 */
export declare type MemoryCacheSettings = {
    /**
     * The garbage collector to use, for the memory cache layer.
     * A `MemoryEagerGarbageCollector` is used when this is undefined.
     */
    garbageCollector?: MemoryGarbageCollector;
};
/**
 * Creates an instance of `MemoryLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 */
export declare function memoryLocalCache(settings?: MemoryCacheSettings): MemoryLocalCache;
/**
 * An settings object to configure an `PersistentLocalCache` instance.
 *
 * Persistent cache cannot be used in a Node.js environment.
 */
export declare type PersistentCacheSettings = {
    /**
     * An approximate cache size threshold for the on-disk data. If the cache
     * grows beyond this size, Firestore will start removing data that hasn't been
     * recently used. The SDK does not guarantee that the cache will stay below
     * that size, only that if the cache exceeds the given size, cleanup will be
     * attempted.
     *
     * The default value is 40 MB. The threshold must be set to at least 1 MB, and
     * can be set to `CACHE_SIZE_UNLIMITED` to disable garbage collection.
     */
    cacheSizeBytes?: number;
    /**
     * Specifies how multiple tabs/windows will be managed by the SDK.
     */
    tabManager?: PersistentTabManager;
};
/**
 * Creates an instance of `PersistentLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 *
 * Persistent cache cannot be used in a Node.js environment.
 */
export declare function persistentLocalCache(settings?: PersistentCacheSettings): PersistentLocalCache;
/**
 * A tab manager supportting only one tab, no synchronization will be
 * performed across tabs.
 */
export declare type PersistentSingleTabManager = {
    kind: 'persistentSingleTab';
    /**
     * @internal
     */
    _initialize: (settings: Omit<PersistentCacheSettings, 'tabManager'> | undefined) => void;
    /**
     * @internal
     */
    _onlineComponentProvider?: OnlineComponentProvider;
    /**
     * @internal
     */
    _offlineComponentProvider?: OfflineComponentProvider;
};
/**
 * A tab manager supporting multiple tabs. SDK will synchronize queries and
 * mutations done across all tabs using the SDK.
 */
export declare type PersistentMultipleTabManager = {
    kind: 'PersistentMultipleTab';
    /**
     * @internal
     */
    _initialize: (settings: Omit<PersistentCacheSettings, 'tabManager'>) => void;
    /**
     * @internal
     */
    _onlineComponentProvider?: OnlineComponentProvider;
    /**
     * @internal
     */
    _offlineComponentProvider?: OfflineComponentProvider;
};
/**
 * A union of all available tab managers.
 */
export declare type PersistentTabManager = PersistentSingleTabManager | PersistentMultipleTabManager;
/**
 * Type to configure an `PersistentSingleTabManager` instance.
 */
export declare type PersistentSingleTabManagerSettings = {
    /**
     * Whether to force-enable persistent (IndexedDB) cache for the client. This
     * cannot be used with multi-tab synchronization and is primarily intended for
     * use with Web Workers. Setting this to `true` will enable IndexedDB, but cause
     * other tabs using IndexedDB cache to fail.
     */
    forceOwnership?: boolean;
};
/**
 * Creates an instance of `PersistentSingleTabManager`.
 *
 * @param settings Configures the created tab manager.
 */
export declare function persistentSingleTabManager(settings: PersistentSingleTabManagerSettings | undefined): PersistentSingleTabManager;
/**
 * Creates an instance of `PersistentMultipleTabManager`.
 */
export declare function persistentMultipleTabManager(): PersistentMultipleTabManager;
