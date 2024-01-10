'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var firebase = require('@firebase/app-compat');
var storage = require('@firebase/storage');
var tslib = require('tslib');
var component = require('@firebase/component');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

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
var UploadTaskSnapshotCompat = /** @class */ (function () {
    function UploadTaskSnapshotCompat(_delegate, task, ref) {
        this._delegate = _delegate;
        this.task = task;
        this.ref = ref;
    }
    Object.defineProperty(UploadTaskSnapshotCompat.prototype, "bytesTransferred", {
        get: function () {
            return this._delegate.bytesTransferred;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UploadTaskSnapshotCompat.prototype, "metadata", {
        get: function () {
            return this._delegate.metadata;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UploadTaskSnapshotCompat.prototype, "state", {
        get: function () {
            return this._delegate.state;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UploadTaskSnapshotCompat.prototype, "totalBytes", {
        get: function () {
            return this._delegate.totalBytes;
        },
        enumerable: false,
        configurable: true
    });
    return UploadTaskSnapshotCompat;
}());

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
var UploadTaskCompat = /** @class */ (function () {
    function UploadTaskCompat(_delegate, _ref) {
        this._delegate = _delegate;
        this._ref = _ref;
        this.cancel = this._delegate.cancel.bind(this._delegate);
        this.catch = this._delegate.catch.bind(this._delegate);
        this.pause = this._delegate.pause.bind(this._delegate);
        this.resume = this._delegate.resume.bind(this._delegate);
    }
    Object.defineProperty(UploadTaskCompat.prototype, "snapshot", {
        get: function () {
            return new UploadTaskSnapshotCompat(this._delegate.snapshot, this, this._ref);
        },
        enumerable: false,
        configurable: true
    });
    UploadTaskCompat.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        return this._delegate.then(function (snapshot) {
            if (onFulfilled) {
                return onFulfilled(new UploadTaskSnapshotCompat(snapshot, _this, _this._ref));
            }
        }, onRejected);
    };
    UploadTaskCompat.prototype.on = function (type, nextOrObserver, error, completed) {
        var _this = this;
        var wrappedNextOrObserver = undefined;
        if (!!nextOrObserver) {
            if (typeof nextOrObserver === 'function') {
                wrappedNextOrObserver = function (taskSnapshot) {
                    return nextOrObserver(new UploadTaskSnapshotCompat(taskSnapshot, _this, _this._ref));
                };
            }
            else {
                wrappedNextOrObserver = {
                    next: !!nextOrObserver.next
                        ? function (taskSnapshot) {
                            return nextOrObserver.next(new UploadTaskSnapshotCompat(taskSnapshot, _this, _this._ref));
                        }
                        : undefined,
                    complete: nextOrObserver.complete || undefined,
                    error: nextOrObserver.error || undefined
                };
            }
        }
        return this._delegate.on(type, wrappedNextOrObserver, error || undefined, completed || undefined);
    };
    return UploadTaskCompat;
}());

var ListResultCompat = /** @class */ (function () {
    function ListResultCompat(_delegate, _service) {
        this._delegate = _delegate;
        this._service = _service;
    }
    Object.defineProperty(ListResultCompat.prototype, "prefixes", {
        get: function () {
            var _this = this;
            return this._delegate.prefixes.map(function (ref) { return new ReferenceCompat(ref, _this._service); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ListResultCompat.prototype, "items", {
        get: function () {
            var _this = this;
            return this._delegate.items.map(function (ref) { return new ReferenceCompat(ref, _this._service); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ListResultCompat.prototype, "nextPageToken", {
        get: function () {
            return this._delegate.nextPageToken || null;
        },
        enumerable: false,
        configurable: true
    });
    return ListResultCompat;
}());

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
var ReferenceCompat = /** @class */ (function () {
    function ReferenceCompat(_delegate, storage) {
        this._delegate = _delegate;
        this.storage = storage;
    }
    Object.defineProperty(ReferenceCompat.prototype, "name", {
        get: function () {
            return this._delegate.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReferenceCompat.prototype, "bucket", {
        get: function () {
            return this._delegate.bucket;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReferenceCompat.prototype, "fullPath", {
        get: function () {
            return this._delegate.fullPath;
        },
        enumerable: false,
        configurable: true
    });
    ReferenceCompat.prototype.toString = function () {
        return this._delegate.toString();
    };
    /**
     * @returns A reference to the object obtained by
     * appending childPath, removing any duplicate, beginning, or trailing
     * slashes.
     */
    ReferenceCompat.prototype.child = function (childPath) {
        var reference = storage._getChild(this._delegate, childPath);
        return new ReferenceCompat(reference, this.storage);
    };
    Object.defineProperty(ReferenceCompat.prototype, "root", {
        get: function () {
            return new ReferenceCompat(this._delegate.root, this.storage);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReferenceCompat.prototype, "parent", {
        /**
         * @returns A reference to the parent of the
         * current object, or null if the current object is the root.
         */
        get: function () {
            var reference = this._delegate.parent;
            if (reference == null) {
                return null;
            }
            return new ReferenceCompat(reference, this.storage);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Uploads a blob to this object's location.
     * @param data - The blob to upload.
     * @returns An UploadTask that lets you control and
     * observe the upload.
     */
    ReferenceCompat.prototype.put = function (data, metadata) {
        this._throwIfRoot('put');
        return new UploadTaskCompat(storage.uploadBytesResumable(this._delegate, data, metadata), this);
    };
    /**
     * Uploads a string to this object's location.
     * @param value - The string to upload.
     * @param format - The format of the string to upload.
     * @returns An UploadTask that lets you control and
     * observe the upload.
     */
    ReferenceCompat.prototype.putString = function (value, format, metadata) {
        if (format === void 0) { format = storage.StringFormat.RAW; }
        this._throwIfRoot('putString');
        var data = storage._dataFromString(format, value);
        var metadataClone = tslib.__assign({}, metadata);
        if (metadataClone['contentType'] == null && data.contentType != null) {
            metadataClone['contentType'] = data.contentType;
        }
        return new UploadTaskCompat(new storage._UploadTask(this._delegate, new storage._FbsBlob(data.data, true), metadataClone), this);
    };
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
    ReferenceCompat.prototype.listAll = function () {
        var _this = this;
        return storage.listAll(this._delegate).then(function (r) { return new ListResultCompat(r, _this.storage); });
    };
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
    ReferenceCompat.prototype.list = function (options) {
        var _this = this;
        return storage.list(this._delegate, options || undefined).then(function (r) { return new ListResultCompat(r, _this.storage); });
    };
    /**
     * A `Promise` that resolves with the metadata for this object. If this
     * object doesn't exist or metadata cannot be retreived, the promise is
     * rejected.
     */
    ReferenceCompat.prototype.getMetadata = function () {
        return storage.getMetadata(this._delegate);
    };
    /**
     * Updates the metadata for this object.
     * @param metadata - The new metadata for the object.
     * Only values that have been explicitly set will be changed. Explicitly
     * setting a value to null will remove the metadata.
     * @returns A `Promise` that resolves
     * with the new metadata for this object.
     * @see firebaseStorage.Reference.prototype.getMetadata
     */
    ReferenceCompat.prototype.updateMetadata = function (metadata) {
        return storage.updateMetadata(this._delegate, metadata);
    };
    /**
     * @returns A `Promise` that resolves with the download
     * URL for this object.
     */
    ReferenceCompat.prototype.getDownloadURL = function () {
        return storage.getDownloadURL(this._delegate);
    };
    /**
     * Deletes the object at this location.
     * @returns A `Promise` that resolves if the deletion succeeds.
     */
    ReferenceCompat.prototype.delete = function () {
        this._throwIfRoot('delete');
        return storage.deleteObject(this._delegate);
    };
    ReferenceCompat.prototype._throwIfRoot = function (name) {
        if (this._delegate._location.path === '') {
            throw storage._invalidRootOperation(name);
        }
    };
    return ReferenceCompat;
}());

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
var StorageServiceCompat = /** @class */ (function () {
    function StorageServiceCompat(app, _delegate) {
        this.app = app;
        this._delegate = _delegate;
    }
    Object.defineProperty(StorageServiceCompat.prototype, "maxOperationRetryTime", {
        get: function () {
            return this._delegate.maxOperationRetryTime;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StorageServiceCompat.prototype, "maxUploadRetryTime", {
        get: function () {
            return this._delegate.maxUploadRetryTime;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns a firebaseStorage.Reference for the given path in the default
     * bucket.
     */
    StorageServiceCompat.prototype.ref = function (path) {
        if (isUrl(path)) {
            throw storage._invalidArgument('ref() expected a child path but got a URL, use refFromURL instead.');
        }
        return new ReferenceCompat(storage.ref(this._delegate, path), this);
    };
    /**
     * Returns a firebaseStorage.Reference object for the given absolute URL,
     * which must be a gs:// or http[s]:// URL.
     */
    StorageServiceCompat.prototype.refFromURL = function (url) {
        if (!isUrl(url)) {
            throw storage._invalidArgument('refFromURL() expected a full URL but got a child path, use ref() instead.');
        }
        try {
            storage._Location.makeFromUrl(url, this._delegate.host);
        }
        catch (e) {
            throw storage._invalidArgument('refFromUrl() expected a valid full URL but got an invalid one.');
        }
        return new ReferenceCompat(storage.ref(this._delegate, url), this);
    };
    StorageServiceCompat.prototype.setMaxUploadRetryTime = function (time) {
        this._delegate.maxUploadRetryTime = time;
    };
    StorageServiceCompat.prototype.setMaxOperationRetryTime = function (time) {
        this._delegate.maxOperationRetryTime = time;
    };
    StorageServiceCompat.prototype.useEmulator = function (host, port, options) {
        if (options === void 0) { options = {}; }
        storage.connectStorageEmulator(this._delegate, host, port, options);
    };
    return StorageServiceCompat;
}());
function isUrl(path) {
    return /^[A-Za-z]+:\/\//.test(path);
}

var name = "@firebase/storage-compat";
var version = "0.3.3";

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
var STORAGE_TYPE = 'storage-compat';
function factory(container, _a) {
    var url = _a.instanceIdentifier;
    // Dependencies
    var app = container.getProvider('app-compat').getImmediate();
    var storageExp = container
        .getProvider('storage')
        .getImmediate({ identifier: url });
    var storageServiceCompat = new StorageServiceCompat(app, storageExp);
    return storageServiceCompat;
}
function registerStorage(instance) {
    var namespaceExports = {
        // no-inline
        TaskState: storage._TaskState,
        TaskEvent: storage._TaskEvent,
        StringFormat: storage.StringFormat,
        Storage: StorageServiceCompat,
        Reference: ReferenceCompat
    };
    instance.INTERNAL.registerComponent(new component.Component(STORAGE_TYPE, factory, "PUBLIC" /* ComponentType.PUBLIC */)
        .setServiceProps(namespaceExports)
        .setMultipleInstances(true));
    instance.registerVersion(name, version);
}
registerStorage(firebase__default["default"]);

exports.registerStorage = registerStorage;
//# sourceMappingURL=index.cjs.js.map
