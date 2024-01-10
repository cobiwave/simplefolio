'use strict';

var firebase = require('@firebase/app-compat');
var component = require('@firebase/component');
var database = require('@firebase/database');
var util = require('@firebase/util');
var tslib = require('tslib');
var logger = require('@firebase/logger');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

var name = "@firebase/database-compat";
var version = "1.0.2";

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
var logClient = new logger.Logger('@firebase/database-compat');
var warn = function (msg) {
    var message = 'FIREBASE WARNING: ' + msg;
    logClient.warn(message);
};

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
var validateBoolean = function (fnName, argumentName, bool, optional) {
    if (optional && bool === undefined) {
        return;
    }
    if (typeof bool !== 'boolean') {
        throw new Error(util.errorPrefix(fnName, argumentName) + 'must be a boolean.');
    }
};
var validateEventType = function (fnName, eventType, optional) {
    if (optional && eventType === undefined) {
        return;
    }
    switch (eventType) {
        case 'value':
        case 'child_added':
        case 'child_removed':
        case 'child_changed':
        case 'child_moved':
            break;
        default:
            throw new Error(util.errorPrefix(fnName, 'eventType') +
                'must be a valid event type = "value", "child_added", "child_removed", ' +
                '"child_changed", or "child_moved".');
    }
};

/**
 * @license
 * Copyright 2017 Google LLC
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
var OnDisconnect = /** @class */ (function () {
    function OnDisconnect(_delegate) {
        this._delegate = _delegate;
    }
    OnDisconnect.prototype.cancel = function (onComplete) {
        util.validateArgCount('OnDisconnect.cancel', 0, 1, arguments.length);
        util.validateCallback('OnDisconnect.cancel', 'onComplete', onComplete, true);
        var result = this._delegate.cancel();
        if (onComplete) {
            result.then(function () { return onComplete(null); }, function (error) { return onComplete(error); });
        }
        return result;
    };
    OnDisconnect.prototype.remove = function (onComplete) {
        util.validateArgCount('OnDisconnect.remove', 0, 1, arguments.length);
        util.validateCallback('OnDisconnect.remove', 'onComplete', onComplete, true);
        var result = this._delegate.remove();
        if (onComplete) {
            result.then(function () { return onComplete(null); }, function (error) { return onComplete(error); });
        }
        return result;
    };
    OnDisconnect.prototype.set = function (value, onComplete) {
        util.validateArgCount('OnDisconnect.set', 1, 2, arguments.length);
        util.validateCallback('OnDisconnect.set', 'onComplete', onComplete, true);
        var result = this._delegate.set(value);
        if (onComplete) {
            result.then(function () { return onComplete(null); }, function (error) { return onComplete(error); });
        }
        return result;
    };
    OnDisconnect.prototype.setWithPriority = function (value, priority, onComplete) {
        util.validateArgCount('OnDisconnect.setWithPriority', 2, 3, arguments.length);
        util.validateCallback('OnDisconnect.setWithPriority', 'onComplete', onComplete, true);
        var result = this._delegate.setWithPriority(value, priority);
        if (onComplete) {
            result.then(function () { return onComplete(null); }, function (error) { return onComplete(error); });
        }
        return result;
    };
    OnDisconnect.prototype.update = function (objectToMerge, onComplete) {
        util.validateArgCount('OnDisconnect.update', 1, 2, arguments.length);
        if (Array.isArray(objectToMerge)) {
            var newObjectToMerge = {};
            for (var i = 0; i < objectToMerge.length; ++i) {
                newObjectToMerge['' + i] = objectToMerge[i];
            }
            objectToMerge = newObjectToMerge;
            warn('Passing an Array to firebase.database.onDisconnect().update() is deprecated. Use set() if you want to overwrite the ' +
                'existing data, or an Object with integer keys if you really do want to only update some of the children.');
        }
        util.validateCallback('OnDisconnect.update', 'onComplete', onComplete, true);
        var result = this._delegate.update(objectToMerge);
        if (onComplete) {
            result.then(function () { return onComplete(null); }, function (error) { return onComplete(error); });
        }
        return result;
    };
    return OnDisconnect;
}());

/**
 * @license
 * Copyright 2017 Google LLC
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
var TransactionResult = /** @class */ (function () {
    /**
     * A type for the resolve value of Firebase.transaction.
     */
    function TransactionResult(committed, snapshot) {
        this.committed = committed;
        this.snapshot = snapshot;
    }
    // Do not create public documentation. This is intended to make JSON serialization work but is otherwise unnecessary
    // for end-users
    TransactionResult.prototype.toJSON = function () {
        util.validateArgCount('TransactionResult.toJSON', 0, 1, arguments.length);
        return { committed: this.committed, snapshot: this.snapshot.toJSON() };
    };
    return TransactionResult;
}());

/**
 * @license
 * Copyright 2017 Google LLC
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
 * Class representing a firebase data snapshot.  It wraps a SnapshotNode and
 * surfaces the public methods (val, forEach, etc.) we want to expose.
 */
var DataSnapshot = /** @class */ (function () {
    function DataSnapshot(_database, _delegate) {
        this._database = _database;
        this._delegate = _delegate;
    }
    /**
     * Retrieves the snapshot contents as JSON.  Returns null if the snapshot is
     * empty.
     *
     * @returns JSON representation of the DataSnapshot contents, or null if empty.
     */
    DataSnapshot.prototype.val = function () {
        util.validateArgCount('DataSnapshot.val', 0, 0, arguments.length);
        return this._delegate.val();
    };
    /**
     * Returns the snapshot contents as JSON, including priorities of node.  Suitable for exporting
     * the entire node contents.
     * @returns JSON representation of the DataSnapshot contents, or null if empty.
     */
    DataSnapshot.prototype.exportVal = function () {
        util.validateArgCount('DataSnapshot.exportVal', 0, 0, arguments.length);
        return this._delegate.exportVal();
    };
    // Do not create public documentation. This is intended to make JSON serialization work but is otherwise unnecessary
    // for end-users
    DataSnapshot.prototype.toJSON = function () {
        // Optional spacer argument is unnecessary because we're depending on recursion rather than stringifying the content
        util.validateArgCount('DataSnapshot.toJSON', 0, 1, arguments.length);
        return this._delegate.toJSON();
    };
    /**
     * Returns whether the snapshot contains a non-null value.
     *
     * @returns Whether the snapshot contains a non-null value, or is empty.
     */
    DataSnapshot.prototype.exists = function () {
        util.validateArgCount('DataSnapshot.exists', 0, 0, arguments.length);
        return this._delegate.exists();
    };
    /**
     * Returns a DataSnapshot of the specified child node's contents.
     *
     * @param path - Path to a child.
     * @returns DataSnapshot for child node.
     */
    DataSnapshot.prototype.child = function (path) {
        util.validateArgCount('DataSnapshot.child', 0, 1, arguments.length);
        // Ensure the childPath is a string (can be a number)
        path = String(path);
        database._validatePathString('DataSnapshot.child', 'path', path, false);
        return new DataSnapshot(this._database, this._delegate.child(path));
    };
    /**
     * Returns whether the snapshot contains a child at the specified path.
     *
     * @param path - Path to a child.
     * @returns Whether the child exists.
     */
    DataSnapshot.prototype.hasChild = function (path) {
        util.validateArgCount('DataSnapshot.hasChild', 1, 1, arguments.length);
        database._validatePathString('DataSnapshot.hasChild', 'path', path, false);
        return this._delegate.hasChild(path);
    };
    /**
     * Returns the priority of the object, or null if no priority was set.
     *
     * @returns The priority.
     */
    DataSnapshot.prototype.getPriority = function () {
        util.validateArgCount('DataSnapshot.getPriority', 0, 0, arguments.length);
        return this._delegate.priority;
    };
    /**
     * Iterates through child nodes and calls the specified action for each one.
     *
     * @param action - Callback function to be called
     * for each child.
     * @returns True if forEach was canceled by action returning true for
     * one of the child nodes.
     */
    DataSnapshot.prototype.forEach = function (action) {
        var _this = this;
        util.validateArgCount('DataSnapshot.forEach', 1, 1, arguments.length);
        util.validateCallback('DataSnapshot.forEach', 'action', action, false);
        return this._delegate.forEach(function (expDataSnapshot) {
            return action(new DataSnapshot(_this._database, expDataSnapshot));
        });
    };
    /**
     * Returns whether this DataSnapshot has children.
     * @returns True if the DataSnapshot contains 1 or more child nodes.
     */
    DataSnapshot.prototype.hasChildren = function () {
        util.validateArgCount('DataSnapshot.hasChildren', 0, 0, arguments.length);
        return this._delegate.hasChildren();
    };
    Object.defineProperty(DataSnapshot.prototype, "key", {
        get: function () {
            return this._delegate.key;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the number of children for this DataSnapshot.
     * @returns The number of children that this DataSnapshot contains.
     */
    DataSnapshot.prototype.numChildren = function () {
        util.validateArgCount('DataSnapshot.numChildren', 0, 0, arguments.length);
        return this._delegate.size;
    };
    /**
     * @returns The Firebase reference for the location this snapshot's data came
     * from.
     */
    DataSnapshot.prototype.getRef = function () {
        util.validateArgCount('DataSnapshot.ref', 0, 0, arguments.length);
        return new Reference(this._database, this._delegate.ref);
    };
    Object.defineProperty(DataSnapshot.prototype, "ref", {
        get: function () {
            return this.getRef();
        },
        enumerable: false,
        configurable: true
    });
    return DataSnapshot;
}());
/**
 * A Query represents a filter to be applied to a firebase location.  This object purely represents the
 * query expression (and exposes our public API to build the query).  The actual query logic is in ViewBase.js.
 *
 * Since every Firebase reference is a query, Firebase inherits from this object.
 */
var Query = /** @class */ (function () {
    function Query(database, _delegate) {
        this.database = database;
        this._delegate = _delegate;
    }
    Query.prototype.on = function (eventType, callback, cancelCallbackOrContext, context) {
        var _this = this;
        var _a;
        util.validateArgCount('Query.on', 2, 4, arguments.length);
        util.validateCallback('Query.on', 'callback', callback, false);
        var ret = Query.getCancelAndContextArgs_('Query.on', cancelCallbackOrContext, context);
        var valueCallback = function (expSnapshot, previousChildName) {
            callback.call(ret.context, new DataSnapshot(_this.database, expSnapshot), previousChildName);
        };
        valueCallback.userCallback = callback;
        valueCallback.context = ret.context;
        var cancelCallback = (_a = ret.cancel) === null || _a === void 0 ? void 0 : _a.bind(ret.context);
        switch (eventType) {
            case 'value':
                database.onValue(this._delegate, valueCallback, cancelCallback);
                return callback;
            case 'child_added':
                database.onChildAdded(this._delegate, valueCallback, cancelCallback);
                return callback;
            case 'child_removed':
                database.onChildRemoved(this._delegate, valueCallback, cancelCallback);
                return callback;
            case 'child_changed':
                database.onChildChanged(this._delegate, valueCallback, cancelCallback);
                return callback;
            case 'child_moved':
                database.onChildMoved(this._delegate, valueCallback, cancelCallback);
                return callback;
            default:
                throw new Error(util.errorPrefix('Query.on', 'eventType') +
                    'must be a valid event type = "value", "child_added", "child_removed", ' +
                    '"child_changed", or "child_moved".');
        }
    };
    Query.prototype.off = function (eventType, callback, context) {
        util.validateArgCount('Query.off', 0, 3, arguments.length);
        validateEventType('Query.off', eventType, true);
        util.validateCallback('Query.off', 'callback', callback, true);
        util.validateContextObject('Query.off', 'context', context, true);
        if (callback) {
            var valueCallback = function () { };
            valueCallback.userCallback = callback;
            valueCallback.context = context;
            database.off(this._delegate, eventType, valueCallback);
        }
        else {
            database.off(this._delegate, eventType);
        }
    };
    /**
     * Get the server-value for this query, or return a cached value if not connected.
     */
    Query.prototype.get = function () {
        var _this = this;
        return database.get(this._delegate).then(function (expSnapshot) {
            return new DataSnapshot(_this.database, expSnapshot);
        });
    };
    /**
     * Attaches a listener, waits for the first event, and then removes the listener
     */
    Query.prototype.once = function (eventType, callback, failureCallbackOrContext, context) {
        var _this = this;
        util.validateArgCount('Query.once', 1, 4, arguments.length);
        util.validateCallback('Query.once', 'callback', callback, true);
        var ret = Query.getCancelAndContextArgs_('Query.once', failureCallbackOrContext, context);
        var deferred = new util.Deferred();
        var valueCallback = function (expSnapshot, previousChildName) {
            var result = new DataSnapshot(_this.database, expSnapshot);
            if (callback) {
                callback.call(ret.context, result, previousChildName);
            }
            deferred.resolve(result);
        };
        valueCallback.userCallback = callback;
        valueCallback.context = ret.context;
        var cancelCallback = function (error) {
            if (ret.cancel) {
                ret.cancel.call(ret.context, error);
            }
            deferred.reject(error);
        };
        switch (eventType) {
            case 'value':
                database.onValue(this._delegate, valueCallback, cancelCallback, {
                    onlyOnce: true
                });
                break;
            case 'child_added':
                database.onChildAdded(this._delegate, valueCallback, cancelCallback, {
                    onlyOnce: true
                });
                break;
            case 'child_removed':
                database.onChildRemoved(this._delegate, valueCallback, cancelCallback, {
                    onlyOnce: true
                });
                break;
            case 'child_changed':
                database.onChildChanged(this._delegate, valueCallback, cancelCallback, {
                    onlyOnce: true
                });
                break;
            case 'child_moved':
                database.onChildMoved(this._delegate, valueCallback, cancelCallback, {
                    onlyOnce: true
                });
                break;
            default:
                throw new Error(util.errorPrefix('Query.once', 'eventType') +
                    'must be a valid event type = "value", "child_added", "child_removed", ' +
                    '"child_changed", or "child_moved".');
        }
        return deferred.promise;
    };
    /**
     * Set a limit and anchor it to the start of the window.
     */
    Query.prototype.limitToFirst = function (limit) {
        util.validateArgCount('Query.limitToFirst', 1, 1, arguments.length);
        return new Query(this.database, database.query(this._delegate, database.limitToFirst(limit)));
    };
    /**
     * Set a limit and anchor it to the end of the window.
     */
    Query.prototype.limitToLast = function (limit) {
        util.validateArgCount('Query.limitToLast', 1, 1, arguments.length);
        return new Query(this.database, database.query(this._delegate, database.limitToLast(limit)));
    };
    /**
     * Given a child path, return a new query ordered by the specified grandchild path.
     */
    Query.prototype.orderByChild = function (path) {
        util.validateArgCount('Query.orderByChild', 1, 1, arguments.length);
        return new Query(this.database, database.query(this._delegate, database.orderByChild(path)));
    };
    /**
     * Return a new query ordered by the KeyIndex
     */
    Query.prototype.orderByKey = function () {
        util.validateArgCount('Query.orderByKey', 0, 0, arguments.length);
        return new Query(this.database, database.query(this._delegate, database.orderByKey()));
    };
    /**
     * Return a new query ordered by the PriorityIndex
     */
    Query.prototype.orderByPriority = function () {
        util.validateArgCount('Query.orderByPriority', 0, 0, arguments.length);
        return new Query(this.database, database.query(this._delegate, database.orderByPriority()));
    };
    /**
     * Return a new query ordered by the ValueIndex
     */
    Query.prototype.orderByValue = function () {
        util.validateArgCount('Query.orderByValue', 0, 0, arguments.length);
        return new Query(this.database, database.query(this._delegate, database.orderByValue()));
    };
    Query.prototype.startAt = function (value, name) {
        if (value === void 0) { value = null; }
        util.validateArgCount('Query.startAt', 0, 2, arguments.length);
        return new Query(this.database, database.query(this._delegate, database.startAt(value, name)));
    };
    Query.prototype.startAfter = function (value, name) {
        if (value === void 0) { value = null; }
        util.validateArgCount('Query.startAfter', 0, 2, arguments.length);
        return new Query(this.database, database.query(this._delegate, database.startAfter(value, name)));
    };
    Query.prototype.endAt = function (value, name) {
        if (value === void 0) { value = null; }
        util.validateArgCount('Query.endAt', 0, 2, arguments.length);
        return new Query(this.database, database.query(this._delegate, database.endAt(value, name)));
    };
    Query.prototype.endBefore = function (value, name) {
        if (value === void 0) { value = null; }
        util.validateArgCount('Query.endBefore', 0, 2, arguments.length);
        return new Query(this.database, database.query(this._delegate, database.endBefore(value, name)));
    };
    /**
     * Load the selection of children with exactly the specified value, and, optionally,
     * the specified name.
     */
    Query.prototype.equalTo = function (value, name) {
        util.validateArgCount('Query.equalTo', 1, 2, arguments.length);
        return new Query(this.database, database.query(this._delegate, database.equalTo(value, name)));
    };
    /**
     * @returns URL for this location.
     */
    Query.prototype.toString = function () {
        util.validateArgCount('Query.toString', 0, 0, arguments.length);
        return this._delegate.toString();
    };
    // Do not create public documentation. This is intended to make JSON serialization work but is otherwise unnecessary
    // for end-users.
    Query.prototype.toJSON = function () {
        // An optional spacer argument is unnecessary for a string.
        util.validateArgCount('Query.toJSON', 0, 1, arguments.length);
        return this._delegate.toJSON();
    };
    /**
     * Return true if this query and the provided query are equivalent; otherwise, return false.
     */
    Query.prototype.isEqual = function (other) {
        util.validateArgCount('Query.isEqual', 1, 1, arguments.length);
        if (!(other instanceof Query)) {
            var error = 'Query.isEqual failed: First argument must be an instance of firebase.database.Query.';
            throw new Error(error);
        }
        return this._delegate.isEqual(other._delegate);
    };
    /**
     * Helper used by .on and .once to extract the context and or cancel arguments.
     * @param fnName - The function name (on or once)
     *
     */
    Query.getCancelAndContextArgs_ = function (fnName, cancelOrContext, context) {
        var ret = { cancel: undefined, context: undefined };
        if (cancelOrContext && context) {
            ret.cancel = cancelOrContext;
            util.validateCallback(fnName, 'cancel', ret.cancel, true);
            ret.context = context;
            util.validateContextObject(fnName, 'context', ret.context, true);
        }
        else if (cancelOrContext) {
            // we have either a cancel callback or a context.
            if (typeof cancelOrContext === 'object' && cancelOrContext !== null) {
                // it's a context!
                ret.context = cancelOrContext;
            }
            else if (typeof cancelOrContext === 'function') {
                ret.cancel = cancelOrContext;
            }
            else {
                throw new Error(util.errorPrefix(fnName, 'cancelOrContext') +
                    ' must either be a cancel callback or a context object.');
            }
        }
        return ret;
    };
    Object.defineProperty(Query.prototype, "ref", {
        get: function () {
            return new Reference(this.database, new database._ReferenceImpl(this._delegate._repo, this._delegate._path));
        },
        enumerable: false,
        configurable: true
    });
    return Query;
}());
var Reference = /** @class */ (function (_super) {
    tslib.__extends(Reference, _super);
    /**
     * Call options:
     *   new Reference(Repo, Path) or
     *   new Reference(url: string, string|RepoManager)
     *
     * Externally - this is the firebase.database.Reference type.
     */
    function Reference(database$1, _delegate) {
        var _this = _super.call(this, database$1, new database._QueryImpl(_delegate._repo, _delegate._path, new database._QueryParams(), false)) || this;
        _this.database = database$1;
        _this._delegate = _delegate;
        return _this;
    }
    /** @returns {?string} */
    Reference.prototype.getKey = function () {
        util.validateArgCount('Reference.key', 0, 0, arguments.length);
        return this._delegate.key;
    };
    Reference.prototype.child = function (pathString) {
        util.validateArgCount('Reference.child', 1, 1, arguments.length);
        if (typeof pathString === 'number') {
            pathString = String(pathString);
        }
        return new Reference(this.database, database.child(this._delegate, pathString));
    };
    /** @returns {?Reference} */
    Reference.prototype.getParent = function () {
        util.validateArgCount('Reference.parent', 0, 0, arguments.length);
        var parent = this._delegate.parent;
        return parent ? new Reference(this.database, parent) : null;
    };
    /** @returns {!Reference} */
    Reference.prototype.getRoot = function () {
        util.validateArgCount('Reference.root', 0, 0, arguments.length);
        return new Reference(this.database, this._delegate.root);
    };
    Reference.prototype.set = function (newVal, onComplete) {
        util.validateArgCount('Reference.set', 1, 2, arguments.length);
        util.validateCallback('Reference.set', 'onComplete', onComplete, true);
        var result = database.set(this._delegate, newVal);
        if (onComplete) {
            result.then(function () { return onComplete(null); }, function (error) { return onComplete(error); });
        }
        return result;
    };
    Reference.prototype.update = function (values, onComplete) {
        util.validateArgCount('Reference.update', 1, 2, arguments.length);
        if (Array.isArray(values)) {
            var newObjectToMerge = {};
            for (var i = 0; i < values.length; ++i) {
                newObjectToMerge['' + i] = values[i];
            }
            values = newObjectToMerge;
            warn('Passing an Array to Firebase.update() is deprecated. ' +
                'Use set() if you want to overwrite the existing data, or ' +
                'an Object with integer keys if you really do want to ' +
                'only update some of the children.');
        }
        database._validateWritablePath('Reference.update', this._delegate._path);
        util.validateCallback('Reference.update', 'onComplete', onComplete, true);
        var result = database.update(this._delegate, values);
        if (onComplete) {
            result.then(function () { return onComplete(null); }, function (error) { return onComplete(error); });
        }
        return result;
    };
    Reference.prototype.setWithPriority = function (newVal, newPriority, onComplete) {
        util.validateArgCount('Reference.setWithPriority', 2, 3, arguments.length);
        util.validateCallback('Reference.setWithPriority', 'onComplete', onComplete, true);
        var result = database.setWithPriority(this._delegate, newVal, newPriority);
        if (onComplete) {
            result.then(function () { return onComplete(null); }, function (error) { return onComplete(error); });
        }
        return result;
    };
    Reference.prototype.remove = function (onComplete) {
        util.validateArgCount('Reference.remove', 0, 1, arguments.length);
        util.validateCallback('Reference.remove', 'onComplete', onComplete, true);
        var result = database.remove(this._delegate);
        if (onComplete) {
            result.then(function () { return onComplete(null); }, function (error) { return onComplete(error); });
        }
        return result;
    };
    Reference.prototype.transaction = function (transactionUpdate, onComplete, applyLocally) {
        var _this = this;
        util.validateArgCount('Reference.transaction', 1, 3, arguments.length);
        util.validateCallback('Reference.transaction', 'transactionUpdate', transactionUpdate, false);
        util.validateCallback('Reference.transaction', 'onComplete', onComplete, true);
        validateBoolean('Reference.transaction', 'applyLocally', applyLocally, true);
        var result = database.runTransaction(this._delegate, transactionUpdate, {
            applyLocally: applyLocally
        }).then(function (transactionResult) {
            return new TransactionResult(transactionResult.committed, new DataSnapshot(_this.database, transactionResult.snapshot));
        });
        if (onComplete) {
            result.then(function (transactionResult) {
                return onComplete(null, transactionResult.committed, transactionResult.snapshot);
            }, function (error) { return onComplete(error, false, null); });
        }
        return result;
    };
    Reference.prototype.setPriority = function (priority, onComplete) {
        util.validateArgCount('Reference.setPriority', 1, 2, arguments.length);
        util.validateCallback('Reference.setPriority', 'onComplete', onComplete, true);
        var result = database.setPriority(this._delegate, priority);
        if (onComplete) {
            result.then(function () { return onComplete(null); }, function (error) { return onComplete(error); });
        }
        return result;
    };
    Reference.prototype.push = function (value, onComplete) {
        var _this = this;
        util.validateArgCount('Reference.push', 0, 2, arguments.length);
        util.validateCallback('Reference.push', 'onComplete', onComplete, true);
        var expPromise = database.push(this._delegate, value);
        var promise = expPromise.then(function (expRef) { return new Reference(_this.database, expRef); });
        if (onComplete) {
            promise.then(function () { return onComplete(null); }, function (error) { return onComplete(error); });
        }
        var result = new Reference(this.database, expPromise);
        result.then = promise.then.bind(promise);
        result.catch = promise.catch.bind(promise, undefined);
        return result;
    };
    Reference.prototype.onDisconnect = function () {
        database._validateWritablePath('Reference.onDisconnect', this._delegate._path);
        return new OnDisconnect(new database.OnDisconnect(this._delegate._repo, this._delegate._path));
    };
    Object.defineProperty(Reference.prototype, "key", {
        get: function () {
            return this.getKey();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Reference.prototype, "parent", {
        get: function () {
            return this.getParent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Reference.prototype, "root", {
        get: function () {
            return this.getRoot();
        },
        enumerable: false,
        configurable: true
    });
    return Reference;
}(Query));

/**
 * @license
 * Copyright 2017 Google LLC
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
 * Class representing a firebase database.
 */
var Database = /** @class */ (function () {
    /**
     * The constructor should not be called by users of our public API.
     */
    function Database(_delegate, app) {
        var _this = this;
        this._delegate = _delegate;
        this.app = app;
        this.INTERNAL = {
            delete: function () { return _this._delegate._delete(); },
            forceWebSockets: database.forceWebSockets,
            forceLongPolling: database.forceLongPolling
        };
    }
    /**
     * Modify this instance to communicate with the Realtime Database emulator.
     *
     * <p>Note: This method must be called before performing any other operation.
     *
     * @param host - the emulator host (ex: localhost)
     * @param port - the emulator port (ex: 8080)
     * @param options.mockUserToken - the mock auth token to use for unit testing Security Rules
     */
    Database.prototype.useEmulator = function (host, port, options) {
        if (options === void 0) { options = {}; }
        database.connectDatabaseEmulator(this._delegate, host, port, options);
    };
    Database.prototype.ref = function (path) {
        util.validateArgCount('database.ref', 0, 1, arguments.length);
        if (path instanceof Reference) {
            var childRef = database.refFromURL(this._delegate, path.toString());
            return new Reference(this, childRef);
        }
        else {
            var childRef = database.ref(this._delegate, path);
            return new Reference(this, childRef);
        }
    };
    /**
     * Returns a reference to the root or the path specified in url.
     * We throw a exception if the url is not in the same domain as the
     * current repo.
     * @returns Firebase reference.
     */
    Database.prototype.refFromURL = function (url) {
        var apiName = 'database.refFromURL';
        util.validateArgCount(apiName, 1, 1, arguments.length);
        var childRef = database.refFromURL(this._delegate, url);
        return new Reference(this, childRef);
    };
    // Make individual repo go offline.
    Database.prototype.goOffline = function () {
        util.validateArgCount('database.goOffline', 0, 0, arguments.length);
        return database.goOffline(this._delegate);
    };
    Database.prototype.goOnline = function () {
        util.validateArgCount('database.goOnline', 0, 0, arguments.length);
        return database.goOnline(this._delegate);
    };
    Database.ServerValue = {
        TIMESTAMP: database.serverTimestamp(),
        increment: function (delta) { return database.increment(delta); }
    };
    return Database;
}());

/**
 * Used by console to create a database based on the app,
 * passed database URL and a custom auth implementation.
 *
 * @param app - A valid FirebaseApp-like object
 * @param url - A valid Firebase databaseURL
 * @param version - custom version e.g. firebase-admin version
 * @param customAuthImpl - custom auth implementation
 */
function initStandalone(_a) {
    var app = _a.app, url = _a.url, version = _a.version, customAuthImpl = _a.customAuthImpl, customAppCheckImpl = _a.customAppCheckImpl, namespace = _a.namespace, _b = _a.nodeAdmin, nodeAdmin = _b === void 0 ? false : _b;
    database._setSDKVersion(version);
    var container = new component.ComponentContainer('database-standalone');
    /**
     * ComponentContainer('database-standalone') is just a placeholder that doesn't perform
     * any actual function.
     */
    var authProvider = new component.Provider('auth-internal', container);
    authProvider.setComponent(new component.Component('auth-internal', function () { return customAuthImpl; }, "PRIVATE" /* ComponentType.PRIVATE */));
    var appCheckProvider = undefined;
    if (customAppCheckImpl) {
        appCheckProvider = new component.Provider('app-check-internal', container);
        appCheckProvider.setComponent(new component.Component('app-check-internal', function () { return customAppCheckImpl; }, "PRIVATE" /* ComponentType.PRIVATE */));
    }
    return {
        instance: new Database(database._repoManagerDatabaseFromApp(app, authProvider, appCheckProvider, url, nodeAdmin), app),
        namespace: namespace
    };
}

var INTERNAL = /*#__PURE__*/Object.freeze({
  __proto__: null,
  initStandalone: initStandalone
});

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
var ServerValue = Database.ServerValue;
function registerDatabase(instance) {
    // Register the Database Service with the 'firebase' namespace.
    instance.INTERNAL.registerComponent(new component.Component('database-compat', function (container, _a) {
        var url = _a.instanceIdentifier;
        /* Dependencies */
        // getImmediate for FirebaseApp will always succeed
        var app = container.getProvider('app-compat').getImmediate();
        var databaseExp = container
            .getProvider('database')
            .getImmediate({ identifier: url });
        return new Database(databaseExp, app);
    }, "PUBLIC" /* ComponentType.PUBLIC */)
        .setServiceProps(
    // firebase.database namespace properties
    {
        Reference: Reference,
        Query: Query,
        Database: Database,
        DataSnapshot: DataSnapshot,
        enableLogging: database.enableLogging,
        INTERNAL: INTERNAL,
        ServerValue: ServerValue
    })
        .setMultipleInstances(true));
    instance.registerVersion(name, version, 'node');
}
registerDatabase(firebase__default["default"]);
//# sourceMappingURL=index.js.map
