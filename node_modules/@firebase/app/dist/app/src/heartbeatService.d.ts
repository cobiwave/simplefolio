/**
 * @license
 * Copyright 2021 Google LLC
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
import { ComponentContainer } from '@firebase/component';
import { FirebaseApp } from './public-types';
import { HeartbeatsByUserAgent, HeartbeatService, HeartbeatsInIndexedDB, HeartbeatStorage, SingleDateHeartbeat } from './types';
export declare class HeartbeatServiceImpl implements HeartbeatService {
    private readonly container;
    /**
     * The persistence layer for heartbeats
     * Leave public for easier testing.
     */
    _storage: HeartbeatStorageImpl;
    /**
     * In-memory cache for heartbeats, used by getHeartbeatsHeader() to generate
     * the header string.
     * Stores one record per date. This will be consolidated into the standard
     * format of one record per user agent string before being sent as a header.
     * Populated from indexedDB when the controller is instantiated and should
     * be kept in sync with indexedDB.
     * Leave public for easier testing.
     */
    _heartbeatsCache: HeartbeatsInIndexedDB | null;
    /**
     * the initialization promise for populating heartbeatCache.
     * If getHeartbeatsHeader() is called before the promise resolves
     * (hearbeatsCache == null), it should wait for this promise
     * Leave public for easier testing.
     */
    _heartbeatsCachePromise: Promise<HeartbeatsInIndexedDB>;
    constructor(container: ComponentContainer);
    /**
     * Called to report a heartbeat. The function will generate
     * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
     * to IndexedDB.
     * Note that we only store one heartbeat per day. So if a heartbeat for today is
     * already logged, subsequent calls to this function in the same day will be ignored.
     */
    triggerHeartbeat(): Promise<void>;
    /**
     * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
     * It also clears all heartbeats from memory as well as in IndexedDB.
     *
     * NOTE: Consuming product SDKs should not send the header if this method
     * returns an empty string.
     */
    getHeartbeatsHeader(): Promise<string>;
}
export declare function extractHeartbeatsForHeader(heartbeatsCache: SingleDateHeartbeat[], maxSize?: number): {
    heartbeatsToSend: HeartbeatsByUserAgent[];
    unsentEntries: SingleDateHeartbeat[];
};
export declare class HeartbeatStorageImpl implements HeartbeatStorage {
    app: FirebaseApp;
    private _canUseIndexedDBPromise;
    constructor(app: FirebaseApp);
    runIndexedDBEnvironmentCheck(): Promise<boolean>;
    /**
     * Read all heartbeats.
     */
    read(): Promise<HeartbeatsInIndexedDB>;
    overwrite(heartbeatsObject: HeartbeatsInIndexedDB): Promise<void>;
    add(heartbeatsObject: HeartbeatsInIndexedDB): Promise<void>;
}
/**
 * Calculate bytes of a HeartbeatsByUserAgent array after being wrapped
 * in a platform logging header JSON object, stringified, and converted
 * to base 64.
 */
export declare function countBytes(heartbeatsCache: HeartbeatsByUserAgent[]): number;
