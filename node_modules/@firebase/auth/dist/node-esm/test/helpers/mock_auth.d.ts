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
import { Provider } from '@firebase/component';
import { AppCheckTokenResult } from '@firebase/app-check-interop-types';
import { PopupRedirectResolver } from '../../src/model/public_types';
import { AuthImpl } from '../../src/core/auth/auth_impl';
import { PersistedBlob } from '../../src/core/persistence';
import { InMemoryPersistence } from '../../src/core/persistence/in_memory';
import { AuthInternal } from '../../src/model/auth';
import { UserInternal } from '../../src/model/user';
export declare const TEST_HOST = "localhost";
export declare const TEST_TOKEN_HOST = "localhost/token";
export declare const TEST_AUTH_DOMAIN = "localhost";
export declare const TEST_SCHEME = "mock";
export declare const TEST_KEY = "test-api-key";
export interface TestAuth extends AuthImpl {
    persistenceLayer: MockPersistenceLayer;
}
export declare const FAKE_HEARTBEAT_CONTROLLER: {
    getHeartbeatsHeader: () => Promise<string>;
};
export declare const FAKE_HEARTBEAT_CONTROLLER_PROVIDER: Provider<'heartbeat'>;
export declare const FAKE_APP_CHECK_CONTROLLER: {
    getToken: () => Promise<AppCheckTokenResult>;
};
export declare const FAKE_APP_CHECK_CONTROLLER_PROVIDER: Provider<'app-check-internal'>;
export declare class MockPersistenceLayer extends InMemoryPersistence {
    lastObjectSet: PersistedBlob | null;
    _set(key: string, object: PersistedBlob): Promise<void>;
    _remove(key: string): Promise<void>;
}
export declare function testAuth(popupRedirectResolver?: PopupRedirectResolver, persistence?: MockPersistenceLayer, skipAwaitOnInit?: boolean): Promise<TestAuth>;
export declare function testUser(auth: AuthInternal, uid: string, email?: string, fakeTokens?: boolean): UserInternal;
