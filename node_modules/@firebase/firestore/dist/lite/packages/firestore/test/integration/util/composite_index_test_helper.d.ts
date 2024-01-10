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
import { CollectionReference, DocumentData, Firestore, Query, QueryConstraint, DocumentReference, QueryCompositeFilterConstraint, QueryNonFilterConstraint, DocumentSnapshot, UpdateData, QuerySnapshot } from './firebase_export';
import { PERSISTENCE_MODE_UNSPECIFIED, PersistenceMode } from './helpers';
/**
 * This helper class is designed to facilitate integration testing of Firestore queries that
 * require composite indexes within a controlled testing environment.
 *
 * <p>Key Features:
 *
 * <ul>
 *   <li>Runs tests against the dedicated test collection with predefined composite indexes.
 *   <li>Automatically associates a test ID with documents for data isolation.
 *   <li>Utilizes TTL policy for automatic test data cleanup.
 *   <li>Constructs Firestore queries with test ID filters.
 * </ul>
 */
export declare class CompositeIndexTestHelper {
    private readonly testId;
    private readonly TEST_ID_FIELD;
    private readonly TTL_FIELD;
    constructor();
    withTestDocs<T>(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, docs: {
        [key: string]: DocumentData;
    }, fn: (collection: CollectionReference, db: Firestore) => Promise<T>): Promise<T>;
    withTestCollection<T>(persistence: PersistenceMode | typeof PERSISTENCE_MODE_UNSPECIFIED, fn: (collection: CollectionReference, db: Firestore) => Promise<T>): Promise<T>;
    private toHashedId;
    private toHashedIds;
    addTestSpecificFieldsToDoc(doc: DocumentData): DocumentData;
    private removeTestSpecificFieldsFromDoc;
    private prepareTestDocuments;
    assertOnlineAndOfflineResultsMatch(query: Query, ...expectedDocs: string[]): Promise<void>;
    query<T>(query_: Query<T>, ...queryConstraints: QueryConstraint[]): Query<T>;
    compositeQuery<T>(query_: Query<T>, compositeFilter: QueryCompositeFilterConstraint, ...queryConstraints: QueryNonFilterConstraint[]): Query<T>;
    getDocRef<T>(coll: CollectionReference<T>, docId: string): DocumentReference<T>;
    addDoc<T>(reference: CollectionReference<T>, data: object): Promise<DocumentReference<T>>;
    setDoc<T>(reference: DocumentReference<T>, data: object): Promise<void>;
    updateDoc<T, DbModelType extends DocumentData>(reference: DocumentReference<T, DbModelType>, data: UpdateData<DbModelType>): Promise<void>;
    deleteDoc<T>(reference: DocumentReference<T>): Promise<void>;
    getDoc<T>(docRef: DocumentReference<T>): Promise<DocumentSnapshot<T>>;
    getDocs<T>(query_: Query<T>): Promise<QuerySnapshot<T>>;
}
