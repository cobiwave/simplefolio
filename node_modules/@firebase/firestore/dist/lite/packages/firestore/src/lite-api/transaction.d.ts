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
import { Transaction as InternalTransaction } from '../core/transaction';
import { Firestore } from './database';
import { FieldPath } from './field_path';
import { DocumentData, DocumentReference, PartialWithFieldValue, SetOptions, UpdateData, WithFieldValue } from './reference';
import { DocumentSnapshot } from './snapshot';
import { TransactionOptions } from './transaction_options';
/**
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */
export declare class Transaction {
    protected readonly _firestore: Firestore;
    private readonly _transaction;
    private readonly _dataReader;
    /** @hideconstructor */
    constructor(_firestore: Firestore, _transaction: InternalTransaction);
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */
    get<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
    /**
     * Writes to the document referred to by the provided {@link
     * DocumentReference}. If the document does not exist yet, it will be created.
     *
     * @param documentRef - A reference to the document to be set.
     * @param data - An object of the fields and values for the document.
     * @throws Error - If the provided input is not a valid Firestore document.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    set<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): this;
    /**
     * Writes to the document referred to by the provided {@link
     * DocumentReference}. If the document does not exist yet, it will be created.
     * If you provide `merge` or `mergeFields`, the provided data can be merged
     * into an existing document.
     *
     * @param documentRef - A reference to the document to be set.
     * @param data - An object of the fields and values for the document.
     * @param options - An object to configure the set behavior.
     * @throws Error - If the provided input is not a valid Firestore document.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    set<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: PartialWithFieldValue<AppModelType>, options: SetOptions): this;
    /**
     * Updates fields in the document referred to by the provided {@link
     * DocumentReference}. The update will fail if applied to a document that does
     * not exist.
     *
     * @param documentRef - A reference to the document to be updated.
     * @param data - An object containing the fields and values with which to
     * update the document. Fields can contain dots to reference nested fields
     * within the document.
     * @throws Error - If the provided input is not valid Firestore data.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    update<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: UpdateData<DbModelType>): this;
    /**
     * Updates fields in the document referred to by the provided {@link
     * DocumentReference}. The update will fail if applied to a document that does
     * not exist.
     *
     * Nested fields can be updated by providing dot-separated field path
     * strings or by providing `FieldPath` objects.
     *
     * @param documentRef - A reference to the document to be updated.
     * @param field - The first field to update.
     * @param value - The first value.
     * @param moreFieldsAndValues - Additional key/value pairs.
     * @throws Error - If the provided input is not valid Firestore data.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    update<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, field: string | FieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): this;
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    delete<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>): this;
}
/**
 * Executes the given `updateFunction` and then attempts to commit the changes
 * applied within the transaction. If any document read within the transaction
 * has changed, Cloud Firestore retries the `updateFunction`. If it fails to
 * commit after 5 attempts, the transaction fails.
 *
 * The maximum number of writes allowed in a single transaction is 500.
 *
 * @param firestore - A reference to the Firestore database to run this
 * transaction against.
 * @param updateFunction - The function to execute within the transaction
 * context.
 * @param options - An options object to configure maximum number of attempts to
 * commit.
 * @returns If the transaction completed successfully or was explicitly aborted
 * (the `updateFunction` returned a failed promise), the promise returned by the
 * `updateFunction `is returned here. Otherwise, if the transaction failed, a
 * rejected promise with the corresponding failure error is returned.
 */
export declare function runTransaction<T>(firestore: Firestore, updateFunction: (transaction: Transaction) => Promise<T>, options?: TransactionOptions): Promise<T>;
