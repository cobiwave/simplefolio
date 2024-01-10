/**
 * @license
 * Copyright 2019 Google LLC
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
import { FirebaseAuthInternalName } from '@firebase/auth-interop-types';
import { Provider } from '@firebase/component';
import { Query as ExpQuery } from '@firebase/firestore';
import { Compat } from '@firebase/util';
import { Firestore as FirestoreCompat, PersistenceProvider } from './api/database';
export { CollectionReference, DocumentReference, DocumentSnapshot, QuerySnapshot } from './api/database';
export { Blob } from './api/blob';
export { GeoPoint } from './api/geo_point';
export { FieldPath } from './api/field_path';
export { FieldValue } from './api/field_value';
export { Timestamp } from './api/timestamp';
export interface FirestoreDatabase {
    projectId: string;
    database?: string;
}
/**
 * The persistence provider included with the memory-only SDK. This provider
 * errors for all attempts to access persistence.
 */
export declare class MemoryPersistenceProvider implements PersistenceProvider {
    enableIndexedDbPersistence(firestore: FirestoreCompat, forceOwnership: boolean): Promise<void>;
    enableMultiTabIndexedDbPersistence(firestore: Firestore): Promise<void>;
    clearIndexedDbPersistence(firestore: Firestore): Promise<void>;
}
/** Firestore class that exposes the constructor expected by the Console. */
export declare class Firestore extends FirestoreCompat {
    constructor(firestoreDatabase: FirestoreDatabase, authProvider: Provider<FirebaseAuthInternalName>);
    INTERNAL: {
        delete: () => Promise<void>;
        count: (query: Compat<ExpQuery<unknown>>) => Promise<number>;
    };
}
