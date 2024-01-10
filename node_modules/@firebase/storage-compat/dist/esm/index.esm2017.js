import firebase from '@firebase/app-compat';
import { _getChild, uploadBytesResumable, _dataFromString, _UploadTask, _FbsBlob, StringFormat, listAll, list, getMetadata, updateMetadata, getDownloadURL, deleteObject, _invalidRootOperation, _invalidArgument, ref, _Location, connectStorageEmulator, _TaskState, _TaskEvent } from '@firebase/storage';
import { Component } from '@firebase/component';

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
class UploadTaskSnapshotCompat {
    constructor(_delegate, task, ref) {
        this._delegate = _delegate;
        this.task = task;
        this.ref = ref;
    }
    get bytesTransferred() {
        return this._delegate.bytesTransferred;
    }
    get metadata() {
        return this._delegate.metadata;
    }
    get state() {
        return this._delegate.state;
    }
    get totalBytes() {
        return this._delegate.totalBytes;
    }
}

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
class UploadTaskCompat {
    constructor(_delegate, _ref) {
        this._delegate = _delegate;
        this._ref = _ref;
        this.cancel = this._delegate.cancel.bind(this._delegate);
        this.catch = this._delegate.catch.bind(this._delegate);
        this.pause = this._delegate.pause.bind(this._delegate);
        this.resume = this._delegate.resume.bind(this._delegate);
    }
    get snapshot() {
        return new UploadTaskSnapshotCompat(this._delegate.snapshot, this, this._ref);
    }
    then(onFulfilled, onRejected) {
        return this._delegate.then(snapshot => {
            if (onFulfilled) {
                return onFulfilled(new UploadTaskSnapshotCompat(snapshot, this, this._ref));
            }
        }, onRejected);
    }
    on(type, nextOrObserver, error, completed) {
        let wrappedNextOrObserver = undefined;
        if (!!nextOrObserver) {
            if (typeof nextOrObserver === 'function') {
                wrappedNextOrObserver = (taskSnapshot) => nextOrObserver(new UploadTaskSnapshotCompat(taskSnapshot, this, this._ref));
            }
            else {
                wrappedNextOrObserver = {
                    next: !!nextOrObserver.next
                        ? (taskSnapshot) => nextOrObserver.next(new UploadTaskSnapshotCompat(taskSnapshot, this, this._ref))
                        : undefined,
                    complete: nextOrObserver.complete || undefined,
                    error: nextOrObserver.error || undefined
                };
            }
        }
        return this._delegate.on(type, wrappedNextOrObserver, error || undefined, completed || undefined);
    }
}

class ListResultCompat {
    constructor(_delegate, _service) {
        this._delegate = _delegate;
        this._service = _service;
    }
    get prefixes() {
        return this._delegate.prefixes.map(ref => new ReferenceCompat(ref, this._service));
    }
    get items() {
        return this._delegate.items.map(ref => new ReferenceCompat(ref, this._service));
    }
    get nextPageToken() {
        return this._delegate.nextPageToken || null;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ReferenceCompat {
    constructor(_delegate, storage) {
        this._delegate = _delegate;
        this.storage = storage;
    }
    get name() {
        return this._delegate.name;
    }
    get bucket() {
        return this._delegate.bucket;
    }
    get fullPath() {
        return this._delegate.fullPath;
    }
    toString() {
        return this._delegate.toString();
    }
    /**
     * @returns A reference to the object obtained by
     * appending childPath, removing any duplicate, beginning, or trailing
     * slashes.
     */
    child(childPath) {
        const reference = _getChild(this._delegate, childPath);
        return new ReferenceCompat(reference, this.storage);
    }
    get root() {
        return new ReferenceCompat(this._delegate.root, this.storage);
    }
    /**
     * @returns A reference to the parent of the
     * current object, or null if the current object is the root.
     */
    get parent() {
        const reference = this._delegate.parent;
        if (reference == null) {
            return null;
        }
        return new ReferenceCompat(reference, this.storage);
    }
    /**
     * Uploads a blob to this object's location.
     * @param data - The blob to upload.
     * @returns An UploadTask that lets you control and
     * observe the upload.
     */
    put(data, metadata) {
        this._throwIfRoot('put');
        return new UploadTaskCompat(uploadBytesResumable(this._delegate, data, metadata), this);
    }
    /**
     * Uploads a string to this object's location.
     * @param value - The string to upload.
     * @param format - The format of the string to upload.
     * @returns An UploadTask that lets you control and
     * observe the upload.
     */
    putString(value, format = StringFormat.RAW, metadata) {
        this._throwIfRoot('putString');
        const data = _dataFromString(format, value);
        const metadataClone = Object.assign({}, metadata);
        if (metadataClone['contentType'] == null && data.contentType != null) {
            metadataClone['contentType'] = data.contentType;
        }
        return new UploadTaskCompat(new _UploadTask(this._delegate, new _FbsBlob(data.data, true), metadataClone), this);
    }
    /**
     * List all items (files) and prefixes (folders) under this storage reference.
     *
     * This is a helper method for calling list() repeatedly until there are
     * no more results. The default pagination size is 1000.
     *
     * Note: The results may not be consistent if objects are changed while this
     * operation is running.
     *
     * Warning: listAll may potentially consume too many resources if there are
     * too many results.
     *
     * @returns A Promise that resolves with all the items and prefixes under
     *  the current storage reference. `prefixes` contains references to
     *  sub-directories and `items` contains references to objects in this
     *  folder. `nextPageToken` is never returned.
     */
    listAll() {
        return listAll(this._delegate).then(r => new ListResultCompat(r, this.storage));
    }
    /**
     * List items (files) and prefixes (folders) under this storage reference.
     *
     * List API is only available for Firebase Rules Version 2.
     *
     * GCS is a key-blob store. Firebase Storage imposes the semantic of '/'
     * delimited folder structure. Refer to GCS's List API if you want to learn more.
     *
     * To adhere to Firebase Rules's Semantics, Firebase Storage does not
     * support objects whose paths end with "/" or contain two consecutive
     * "/"s. Firebase Storage List API will filter these unsupported objects.
     * list() may fail if there are too many unsupported objects in the bucket.
     *
     * @param options - See ListOptions for details.
     * @returns A Promise that resolves with the items and prefixes.
     * `prefixes` contains references to sub-folders and `items`
     * contains references to objects in this folder. `nextPageToken`
     * can be used to get the rest of the results.
     */
    list(options) {
        return list(this._delegate, options || undefined).then(r => new ListResultCompat(r, this.storage));
    }
    /**
     * A `Promise` that resolves with the metadata for this object. If this
     * object doesn't exist or metadata cannot be retreived, the promise is
     * rejected.
     */
    getMetadata() {
        return getMetadata(this._delegate);
    }
    /**
     * Updates the metadata for this object.
     * @param metadata - The new metadata for the object.
     * Only values that have been explicitly set will be changed. Explicitly
     * setting a value to null will remove the metadata.
     * @returns A `Promise` that resolves
     * with the new metadata for this object.
     * @see firebaseStorage.Reference.prototype.getMetadata
     */
    updateMetadata(metadata) {
        return updateMetadata(this._delegate, metadata);
    }
    /**
     * @returns A `Promise` that resolves with the download
     * URL for this object.
     */
    getDownloadURL() {
        return getDownloadURL(this._delegate);
    }
    /**
     * Deletes the object at this location.
     * @returns A `Promise` that resolves if the deletion succeeds.
     */
    delete() {
        this._throwIfRoot('delete');
        return deleteObject(this._delegate);
    }
    _throwIfRoot(name) {
        if (this._delegate._location.path === '') {
            throw _invalidRootOperation(name);
        }
    }
}

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
/**
 * A service that provides firebaseStorage.Reference instances.
 * @param opt_url gs:// url to a custom Storage Bucket
 */
class StorageServiceCompat {
    constructor(app, _delegate) {
        this.app = app;
        this._delegate = _delegate;
    }
    get maxOperationRetryTime() {
        return this._delegate.maxOperationRetryTime;
    }
    get maxUploadRetryTime() {
        return this._delegate.maxUploadRetryTime;
    }
    /**
     * Returns a firebaseStorage.Reference for the given path in the default
     * bucket.
     */
    ref(path) {
        if (isUrl(path)) {
            throw _invalidArgument('ref() expected a child path but got a URL, use refFromURL instead.');
        }
        return new ReferenceCompat(ref(this._delegate, path), this);
    }
    /**
     * Returns a firebaseStorage.Reference object for the given absolute URL,
     * which must be a gs:// or http[s]:// URL.
     */
    refFromURL(url) {
        if (!isUrl(url)) {
            throw _invalidArgument('refFromURL() expected a full URL but got a child path, use ref() instead.');
        }
        try {
            _Location.makeFromUrl(url, this._delegate.host);
        }
        catch (e) {
            throw _invalidArgument('refFromUrl() expected a valid full URL but got an invalid one.');
        }
        return new ReferenceCompat(ref(this._delegate, url), this);
    }
    setMaxUploadRetryTime(time) {
        this._delegate.maxUploadRetryTime = time;
    }
    setMaxOperationRetryTime(time) {
        this._delegate.maxOperationRetryTime = time;
    }
    useEmulator(host, port, options = {}) {
        connectStorageEmulator(this._delegate, host, port, options);
    }
}
function isUrl(path) {
    return /^[A-Za-z]+:\/\//.test(path);
}

const name = "@firebase/storage-compat";
const version = "0.3.3";

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
/**
 * Type constant for Firebase Storage.
 */
const STORAGE_TYPE = 'storage-compat';
function factory(container, { instanceIdentifier: url }) {
    // Dependencies
    const app = container.getProvider('app-compat').getImmediate();
    const storageExp = container
        .getProvider('storage')
        .getImmediate({ identifier: url });
    const storageServiceCompat = new StorageServiceCompat(app, storageExp);
    return storageServiceCompat;
}
function registerStorage(instance) {
    const namespaceExports = {
        // no-inline
        TaskState: _TaskState,
        TaskEvent: _TaskEvent,
        StringFormat,
        Storage: StorageServiceCompat,
        Reference: ReferenceCompat
    };
    instance.INTERNAL.registerComponent(new Component(STORAGE_TYPE, factory, "PUBLIC" /* ComponentType.PUBLIC */)
        .setServiceProps(namespaceExports)
        .setMultipleInstances(true));
    instance.registerVersion(name, version);
}
registerStorage(firebase);

export { registerStorage };
//# sourceMappingURL=index.esm2017.js.map
