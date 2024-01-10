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
import { FirebaseApp } from '@firebase/app';
import { StorageReference, FirebaseStorage, UploadResult, ListOptions, ListResult, UploadTask, SettableMetadata, UploadMetadata, FullMetadata } from './public-types';
import { Reference } from './reference';
import { EmulatorMockTokenOptions } from '@firebase/util';
import { StringFormat } from './implementation/string';
export { EmulatorMockTokenOptions } from '@firebase/util';
export { StorageError, StorageErrorCode } from './implementation/error';
/**
 * Public types.
 */
export * from './public-types';
export { Location as _Location } from './implementation/location';
export { UploadTask as _UploadTask } from './task';
export type { Reference as _Reference } from './reference';
export type { FirebaseStorageImpl as _FirebaseStorageImpl } from './service';
export { FbsBlob as _FbsBlob } from './implementation/blob';
export { dataFromString as _dataFromString } from './implementation/string';
export { invalidRootOperation as _invalidRootOperation, invalidArgument as _invalidArgument } from './implementation/error';
export { TaskEvent as _TaskEvent, TaskState as _TaskState } from './implementation/taskenums';
export { StringFormat };
/**
 * Downloads the data at the object's location. Returns an error if the object
 * is not found.
 *
 * To use this functionality, you have to whitelist your app's origin in your
 * Cloud Storage bucket. See also
 * https://cloud.google.com/storage/docs/configuring-cors
 *
 * @public
 * @param ref - StorageReference where data should be downloaded.
 * @param maxDownloadSizeBytes - If set, the maximum allowed size in bytes to
 * retrieve.
 * @returns A Promise containing the object's bytes
 */
export declare function getBytes(ref: StorageReference, maxDownloadSizeBytes?: number): Promise<ArrayBuffer>;
/**
 * Uploads data to this object's location.
 * The upload is not resumable.
 * @public
 * @param ref - {@link StorageReference} where data should be uploaded.
 * @param data - The data to upload.
 * @param metadata - Metadata for the data to upload.
 * @returns A Promise containing an UploadResult
 */
export declare function uploadBytes(ref: StorageReference, data: Blob | Uint8Array | ArrayBuffer, metadata?: UploadMetadata): Promise<UploadResult>;
/**
 * Uploads a string to this object's location.
 * The upload is not resumable.
 * @public
 * @param ref - {@link StorageReference} where string should be uploaded.
 * @param value - The string to upload.
 * @param format - The format of the string to upload.
 * @param metadata - Metadata for the string to upload.
 * @returns A Promise containing an UploadResult
 */
export declare function uploadString(ref: StorageReference, value: string, format?: StringFormat, metadata?: UploadMetadata): Promise<UploadResult>;
/**
 * Uploads data to this object's location.
 * The upload can be paused and resumed, and exposes progress updates.
 * @public
 * @param ref - {@link StorageReference} where data should be uploaded.
 * @param data - The data to upload.
 * @param metadata - Metadata for the data to upload.
 * @returns An UploadTask
 */
export declare function uploadBytesResumable(ref: StorageReference, data: Blob | Uint8Array | ArrayBuffer, metadata?: UploadMetadata): UploadTask;
/**
 * A `Promise` that resolves with the metadata for this object. If this
 * object doesn't exist or metadata cannot be retreived, the promise is
 * rejected.
 * @public
 * @param ref - {@link StorageReference} to get metadata from.
 */
export declare function getMetadata(ref: StorageReference): Promise<FullMetadata>;
/**
 * Updates the metadata for this object.
 * @public
 * @param ref - {@link StorageReference} to update metadata for.
 * @param metadata - The new metadata for the object.
 *     Only values that have been explicitly set will be changed. Explicitly
 *     setting a value to null will remove the metadata.
 * @returns A `Promise` that resolves with the new metadata for this object.
 */
export declare function updateMetadata(ref: StorageReference, metadata: SettableMetadata): Promise<FullMetadata>;
/**
 * List items (files) and prefixes (folders) under this storage reference.
 *
 * List API is only available for Firebase Rules Version 2.
 *
 * GCS is a key-blob store. Firebase Storage imposes the semantic of '/'
 * delimited folder structure.
 * Refer to GCS's List API if you want to learn more.
 *
 * To adhere to Firebase Rules's Semantics, Firebase Storage does not
 * support objects whose paths end with "/" or contain two consecutive
 * "/"s. Firebase Storage List API will filter these unsupported objects.
 * list() may fail if there are too many unsupported objects in the bucket.
 * @public
 *
 * @param ref - {@link StorageReference} to get list from.
 * @param options - See {@link ListOptions} for details.
 * @returns A `Promise` that resolves with the items and prefixes.
 *      `prefixes` contains references to sub-folders and `items`
 *      contains references to objects in this folder. `nextPageToken`
 *      can be used to get the rest of the results.
 */
export declare function list(ref: StorageReference, options?: ListOptions): Promise<ListResult>;
/**
 * List all items (files) and prefixes (folders) under this storage reference.
 *
 * This is a helper method for calling list() repeatedly until there are
 * no more results. The default pagination size is 1000.
 *
 * Note: The results may not be consistent if objects are changed while this
 * operation is running.
 *
 * Warning: `listAll` may potentially consume too many resources if there are
 * too many results.
 * @public
 * @param ref - {@link StorageReference} to get list from.
 *
 * @returns A `Promise` that resolves with all the items and prefixes under
 *      the current storage reference. `prefixes` contains references to
 *      sub-directories and `items` contains references to objects in this
 *      folder. `nextPageToken` is never returned.
 */
export declare function listAll(ref: StorageReference): Promise<ListResult>;
/**
 * Returns the download URL for the given {@link StorageReference}.
 * @public
 * @param ref - {@link StorageReference} to get the download URL for.
 * @returns A `Promise` that resolves with the download
 *     URL for this object.
 */
export declare function getDownloadURL(ref: StorageReference): Promise<string>;
/**
 * Deletes the object at this location.
 * @public
 * @param ref - {@link StorageReference} for object to delete.
 * @returns A `Promise` that resolves if the deletion succeeds.
 */
export declare function deleteObject(ref: StorageReference): Promise<void>;
/**
 * Returns a {@link StorageReference} for the given url.
 * @param storage - {@link FirebaseStorage} instance.
 * @param url - URL. If empty, returns root reference.
 * @public
 */
export declare function ref(storage: FirebaseStorage, url?: string): StorageReference;
/**
 * Returns a {@link StorageReference} for the given path in the
 * default bucket.
 * @param storageOrRef - {@link FirebaseStorage} or {@link StorageReference}.
 * @param pathOrUrlStorage - path. If empty, returns root reference (if {@link FirebaseStorage}
 * instance provided) or returns same reference (if {@link StorageReference} provided).
 * @public
 */
export declare function ref(storageOrRef: FirebaseStorage | StorageReference, path?: string): StorageReference;
/**
 * @internal
 */
export declare function _getChild(ref: StorageReference, childPath: string): Reference;
/**
 * Gets a {@link FirebaseStorage} instance for the given Firebase app.
 * @public
 * @param app - Firebase app to get {@link FirebaseStorage} instance for.
 * @param bucketUrl - The gs:// url to your Firebase Storage Bucket.
 * If not passed, uses the app's default Storage Bucket.
 * @returns A {@link FirebaseStorage} instance.
 */
export declare function getStorage(app?: FirebaseApp, bucketUrl?: string): FirebaseStorage;
/**
 * Modify this {@link FirebaseStorage} instance to communicate with the Cloud Storage emulator.
 *
 * @param storage - The {@link FirebaseStorage} instance
 * @param host - The emulator host (ex: localhost)
 * @param port - The emulator port (ex: 5001)
 * @param options - Emulator options. `options.mockUserToken` is the mock auth
 * token to use for unit testing Security Rules.
 * @public
 */
export declare function connectStorageEmulator(storage: FirebaseStorage, host: string, port: number, options?: {
    mockUserToken?: EmulatorMockTokenOptions | string;
}): void;
