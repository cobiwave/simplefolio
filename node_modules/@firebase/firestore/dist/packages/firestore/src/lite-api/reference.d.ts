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
import { Query as InternalQuery } from '../core/query';
import { DocumentKey } from '../model/document_key';
import { ResourcePath } from '../model/path';
import { Firestore } from './database';
import { FieldPath } from './field_path';
import { FieldValue } from './field_value';
import { FirestoreDataConverter } from './snapshot';
import { NestedUpdateFields, Primitive } from './types';
/**
 * Document data (for use with {@link @firebase/firestore/lite#(setDoc:1)}) consists of fields mapped to
 * values.
 */
export interface DocumentData {
    /** A mapping between a field and its value. */
    [field: string]: any;
}
/**
 * Similar to Typescript's `Partial<T>`, but allows nested fields to be
 * omitted and FieldValues to be passed in as property values.
 */
export declare type PartialWithFieldValue<T> = Partial<T> | (T extends Primitive ? T : T extends {} ? {
    [K in keyof T]?: PartialWithFieldValue<T[K]> | FieldValue;
} : never);
/**
 * Allows FieldValues to be passed in as a property value while maintaining
 * type safety.
 */
export declare type WithFieldValue<T> = T | (T extends Primitive ? T : T extends {} ? {
    [K in keyof T]: WithFieldValue<T[K]> | FieldValue;
} : never);
/**
 * Update data (for use with {@link (updateDoc:1)}) that consists of field paths
 * (e.g. 'foo' or 'foo.baz') mapped to values. Fields that contain dots
 * reference nested fields within the document. FieldValues can be passed in
 * as property values.
 */
export declare type UpdateData<T> = T extends Primitive ? T : T extends {} ? {
    [K in keyof T]?: UpdateData<T[K]> | FieldValue;
} & NestedUpdateFields<T> : Partial<T>;
/**
 * An options object that configures the behavior of {@link @firebase/firestore/lite#(setDoc:1)}, {@link
 * @firebase/firestore/lite#(WriteBatch.set:1)} and {@link @firebase/firestore/lite#(Transaction.set:1)} calls. These calls can be
 * configured to perform granular merges instead of overwriting the target
 * documents in their entirety by providing a `SetOptions` with `merge: true`.
 *
 * @param merge - Changes the behavior of a `setDoc()` call to only replace the
 * values specified in its data argument. Fields omitted from the `setDoc()`
 * call remain untouched. If your input sets any field to an empty map, all
 * nested fields are overwritten.
 * @param mergeFields - Changes the behavior of `setDoc()` calls to only replace
 * the specified field paths. Any field path that is not specified is ignored
 * and remains untouched. If your input sets any field to an empty map, all
 * nested fields are overwritten.
 */
export declare type SetOptions = {
    readonly merge?: boolean;
} | {
    readonly mergeFields?: Array<string | FieldPath>;
};
/**
 * A `Query` refers to a query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 */
export declare class Query<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    readonly converter: FirestoreDataConverter<AppModelType, DbModelType> | null;
    readonly _query: InternalQuery;
    /** The type of this Firestore reference. */
    readonly type: 'query' | 'collection';
    /**
     * The `Firestore` instance for the Firestore database (useful for performing
     * transactions, etc.).
     */
    readonly firestore: Firestore;
    /** @hideconstructor protected */
    constructor(firestore: Firestore, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    converter: FirestoreDataConverter<AppModelType, DbModelType> | null, _query: InternalQuery);
    /**
     * Removes the current converter.
     *
     * @param converter - `null` removes the current converter.
     * @returns A `Query<DocumentData, DocumentData>` that does not use a
     * converter.
     */
    withConverter(converter: null): Query<DocumentData, DocumentData>;
    /**
     * Applies a custom data converter to this query, allowing you to use your own
     * custom model objects with Firestore. When you call {@link getDocs} with
     * the returned query, the provided converter will convert between Firestore
     * data of type `NewDbModelType` and your custom type `NewAppModelType`.
     *
     * @param converter - Converts objects to and from Firestore.
     * @returns A `Query` that uses the provided converter.
     */
    withConverter<NewAppModelType, NewDbModelType extends DocumentData = DocumentData>(converter: FirestoreDataConverter<NewAppModelType, NewDbModelType>): Query<NewAppModelType, NewDbModelType>;
}
/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist.
 */
export declare class DocumentReference<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    readonly converter: FirestoreDataConverter<AppModelType, DbModelType> | null;
    readonly _key: DocumentKey;
    /** The type of this Firestore reference. */
    readonly type = "document";
    /**
     * The {@link Firestore} instance the document is in.
     * This is useful for performing transactions, for example.
     */
    readonly firestore: Firestore;
    /** @hideconstructor */
    constructor(firestore: Firestore, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    converter: FirestoreDataConverter<AppModelType, DbModelType> | null, _key: DocumentKey);
    get _path(): ResourcePath;
    /**
     * The document's identifier within its collection.
     */
    get id(): string;
    /**
     * A string representing the path of the referenced document (relative
     * to the root of the database).
     */
    get path(): string;
    /**
     * The collection this `DocumentReference` belongs to.
     */
    get parent(): CollectionReference<AppModelType, DbModelType>;
    /**
     * Applies a custom data converter to this `DocumentReference`, allowing you
     * to use your own custom model objects with Firestore. When you call {@link
     * @firebase/firestore/lite#(setDoc:1)}, {@link @firebase/firestore/lite#getDoc}, etc. with the returned `DocumentReference`
     * instance, the provided converter will convert between Firestore data of
     * type `NewDbModelType` and your custom type `NewAppModelType`.
     *
     * @param converter - Converts objects to and from Firestore.
     * @returns A `DocumentReference` that uses the provided converter.
     */
    withConverter<NewAppModelType, NewDbModelType extends DocumentData = DocumentData>(converter: FirestoreDataConverter<NewAppModelType, NewDbModelType>): DocumentReference<NewAppModelType, NewDbModelType>;
    /**
     * Removes the current converter.
     *
     * @param converter - `null` removes the current converter.
     * @returns A `DocumentReference<DocumentData, DocumentData>` that does not
     * use a converter.
     */
    withConverter(converter: null): DocumentReference<DocumentData, DocumentData>;
}
/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using {@link (query:1)}).
 */
export declare class CollectionReference<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> extends Query<AppModelType, DbModelType> {
    readonly _path: ResourcePath;
    /** The type of this Firestore reference. */
    readonly type = "collection";
    /** @hideconstructor */
    constructor(firestore: Firestore, converter: FirestoreDataConverter<AppModelType, DbModelType> | null, _path: ResourcePath);
    /** The collection's identifier. */
    get id(): string;
    /**
     * A string representing the path of the referenced collection (relative
     * to the root of the database).
     */
    get path(): string;
    /**
     * A reference to the containing `DocumentReference` if this is a
     * subcollection. If this isn't a subcollection, the reference is null.
     */
    get parent(): DocumentReference<DocumentData, DocumentData> | null;
    /**
     * Applies a custom data converter to this `CollectionReference`, allowing you
     * to use your own custom model objects with Firestore. When you call {@link
     * addDoc} with the returned `CollectionReference` instance, the provided
     * converter will convert between Firestore data of type `NewDbModelType` and
     * your custom type `NewAppModelType`.
     *
     * @param converter - Converts objects to and from Firestore.
     * @returns A `CollectionReference` that uses the provided converter.
     */
    withConverter<NewAppModelType, NewDbModelType extends DocumentData = DocumentData>(converter: FirestoreDataConverter<NewAppModelType, NewDbModelType>): CollectionReference<NewAppModelType, NewDbModelType>;
    /**
     * Removes the current converter.
     *
     * @param converter - `null` removes the current converter.
     * @returns A `CollectionReference<DocumentData, DocumentData>` that does not
     * use a converter.
     */
    withConverter(converter: null): CollectionReference<DocumentData, DocumentData>;
}
/**
 * Gets a `CollectionReference` instance that refers to the collection at
 * the specified absolute path.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments to apply relative to the first
 * argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
export declare function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;
/**
 * Gets a `CollectionReference` instance that refers to a subcollection of
 * `reference` at the the specified relative path.
 *
 * @param reference - A reference to a collection.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments to apply relative to the first
 * argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
export declare function collection<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;
/**
 * Gets a `CollectionReference` instance that refers to a subcollection of
 * `reference` at the the specified relative path.
 *
 * @param reference - A reference to a Firestore document.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
export declare function collection<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;
/**
 * Creates and returns a new `Query` instance that includes all documents in the
 * database that are contained in a collection or subcollection with the
 * given `collectionId`.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param collectionId - Identifies the collections to query over. Every
 * collection or subcollection with this ID as the last segment of its path
 * will be included. Cannot contain a slash.
 * @returns The created `Query`.
 */
export declare function collectionGroup(firestore: Firestore, collectionId: string): Query<DocumentData, DocumentData>;
/**
 * Gets a `DocumentReference` instance that refers to the document at the
 * specified absolute path.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param path - A slash-separated path to a document.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
export declare function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference<DocumentData, DocumentData>;
/**
 * Gets a `DocumentReference` instance that refers to a document within
 * `reference` at the specified relative path. If no path is specified, an
 * automatically-generated unique ID will be used for the returned
 * `DocumentReference`.
 *
 * @param reference - A reference to a collection.
 * @param path - A slash-separated path to a document. Has to be omitted to use
 * auto-genrated IDs.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
export declare function doc<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, path?: string, ...pathSegments: string[]): DocumentReference<AppModelType, DbModelType>;
/**
 * Gets a `DocumentReference` instance that refers to a document within
 * `reference` at the specified relative path.
 *
 * @param reference - A reference to a Firestore document.
 * @param path - A slash-separated path to a document.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
export declare function doc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): DocumentReference<DocumentData, DocumentData>;
/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
export declare function refEqual<AppModelType, DbModelType extends DocumentData>(left: DocumentReference<AppModelType, DbModelType> | CollectionReference<AppModelType, DbModelType>, right: DocumentReference<AppModelType, DbModelType> | CollectionReference<AppModelType, DbModelType>): boolean;
/**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
export declare function queryEqual<AppModelType, DbModelType extends DocumentData>(left: Query<AppModelType, DbModelType>, right: Query<AppModelType, DbModelType>): boolean;
