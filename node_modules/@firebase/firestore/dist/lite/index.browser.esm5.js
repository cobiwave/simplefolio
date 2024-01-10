import { __extends as t, __awaiter as e, __generator as n, __spreadArray as r } from "tslib";

import { SDK_VERSION as i, _registerComponent as o, registerVersion as a, _getProvider, getApp as u, _removeServiceInstance as s } from "@firebase/app";

import { Component as c } from "@firebase/component";

import { Logger as l, LogLevel as f } from "@firebase/logger";

import { FirebaseError as h, getModularInstance as p, getDefaultEmulatorHostnameAndPort as d, createMockUserToken as y, deepEqual as m } from "@firebase/util";

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
 * Simple wrapper around a nullable UID. Mostly exists to make code more
 * readable.
 */ var v = /** @class */ function() {
    function t(t) {
        this.uid = t;
    }
    return t.prototype.isAuthenticated = function() {
        return null != this.uid;
    }, 
    /**
     * Returns a key representing this user, suitable for inclusion in a
     * dictionary.
     */
    t.prototype.toKey = function() {
        return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
    }, t.prototype.isEqual = function(t) {
        return t.uid === this.uid;
    }, t;
}();

/** A user with a null UID. */ v.UNAUTHENTICATED = new v(null), 
// TODO(mikelehen): Look into getting a proper uid-equivalent for
// non-FirebaseAuth providers.
v.GOOGLE_CREDENTIALS = new v("google-credentials-uid"), v.FIRST_PARTY = new v("first-party-uid"), 
v.MOCK_USER = new v("mock-user");

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
var g = "10.7.0", w = new l("@firebase/firestore");

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
 * Sets the verbosity of Cloud Firestore logs (debug, error, or silent).
 *
 * @param logLevel - The verbosity you set for activity and error logging. Can
 *   be any of the following values:
 *
 *   <ul>
 *     <li>`debug` for the most verbose logging level, primarily for
 *     debugging.</li>
 *     <li>`error` to log errors only.</li>
 *     <li><code>`silent` to turn off logging.</li>
 *   </ul>
 */
function b(t) {
    w.setLogLevel(t);
}

function _(t) {
    for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
    if (w.logLevel <= f.DEBUG) {
        var i = e.map(S);
        w.debug.apply(w, r([ "Firestore (".concat(g, "): ").concat(t) ], i, !1));
    }
}

function T(t) {
    for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
    if (w.logLevel <= f.ERROR) {
        var i = e.map(S);
        w.error.apply(w, r([ "Firestore (".concat(g, "): ").concat(t) ], i, !1));
    }
}

/**
 * @internal
 */ function E(t) {
    for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
    if (w.logLevel <= f.WARN) {
        var i = e.map(S);
        w.warn.apply(w, r([ "Firestore (".concat(g, "): ").concat(t) ], i, !1));
    }
}

/**
 * Converts an additional log parameter to a string representation.
 */ function S(t) {
    if ("string" == typeof t) return t;
    try {
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
        /** Formats an object as a JSON string, suitable for logging. */
        return function(t) {
            return JSON.stringify(t);
        }(t);
    } catch (e) {
        // Converting to JSON failed, just log the object directly
        return t;
    }
}

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
 * Unconditionally fails, throwing an Error with the given message.
 * Messages are stripped in production builds.
 *
 * Returns `never` and can be used in expressions:
 * @example
 * let futureVar = fail('not implemented yet');
 */ function k(t) {
    void 0 === t && (t = "Unexpected state");
    // Log the failure in addition to throw an exception, just in case the
    // exception is swallowed.
        var e = "FIRESTORE (".concat(g, ") INTERNAL ASSERTION FAILED: ") + t;
    // NOTE: We don't use FirestoreError here because these are internal failures
    // that cannot be handled by the user. (Also it would create a circular
    // dependency between the error and assert modules which doesn't work.)
        throw T(e), new Error(e)
    /**
 * Fails if the given assertion condition is false, throwing an Error with the
 * given message if it did.
 *
 * Messages are stripped in production builds.
 */;
}

function I(t, e) {
    t || k();
}

/**
 * Casts `obj` to `T`. In non-production builds, verifies that `obj` is an
 * instance of `T` before casting.
 */ function A(t, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
e) {
    return t;
}

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
 */ var P = "cancelled", V = "unknown", F = "invalid-argument", O = "deadline-exceeded", N = "not-found", D = "permission-denied", R = "unauthenticated", q = "resource-exhausted", x = "failed-precondition", C = "aborted", L = "out-of-range", j = "unimplemented", M = "internal", U = "unavailable", B = /** @class */ function(e) {
    /** @hideconstructor */
    function n(
    /**
     * The backend error code associated with this error.
     */
    t, 
    /**
     * A custom error description.
     */
    n) {
        var r = this;
        return (r = e.call(this, t, n) || this).code = t, r.message = n, 
        // HACK: We write a toString property directly because Error is not a real
        // class and so inheritance does not work correctly. We could alternatively
        // do the same "back-door inheritance" trick that FirebaseError does.
        r.toString = function() {
            return "".concat(r.name, ": [code=").concat(r.code, "]: ").concat(r.message);
        }, r;
    }
    return t(n, e), n;
}(h), z = function() {
    var t = this;
    this.promise = new Promise((function(e, n) {
        t.resolve = e, t.reject = n;
    }));
}, K = function(t, e) {
    this.user = e, this.type = "OAuth", this.headers = new Map, this.headers.set("Authorization", "Bearer ".concat(t));
}, G = /** @class */ function() {
    function t() {}
    return t.prototype.getToken = function() {
        return Promise.resolve(null);
    }, t.prototype.invalidateToken = function() {}, t.prototype.start = function(t, e) {
        // Fire with initial user.
        t.enqueueRetryable((function() {
            return e(v.UNAUTHENTICATED);
        }));
    }, t.prototype.shutdown = function() {}, t;
}(), Q = /** @class */ function() {
    function t(t) {
        this.token = t, 
        /**
             * Stores the listener registered with setChangeListener()
             * This isn't actually necessary since the UID never changes, but we use this
             * to verify the listen contract is adhered to in tests.
             */
        this.changeListener = null;
    }
    return t.prototype.getToken = function() {
        return Promise.resolve(this.token);
    }, t.prototype.invalidateToken = function() {}, t.prototype.start = function(t, e) {
        var n = this;
        this.changeListener = e, 
        // Fire with initial user.
        t.enqueueRetryable((function() {
            return e(n.token.user);
        }));
    }, t.prototype.shutdown = function() {
        this.changeListener = null;
    }, t;
}(), W = /** @class */ function() {
    function t(t) {
        var e = this;
        this.auth = null, t.onInit((function(t) {
            e.auth = t;
        }));
    }
    return t.prototype.getToken = function() {
        var t = this;
        return this.auth ? this.auth.getToken().then((function(e) {
            return e ? (I("string" == typeof e.accessToken), new K(e.accessToken, new v(t.auth.getUid()))) : null;
        })) : Promise.resolve(null);
    }, t.prototype.invalidateToken = function() {}, t.prototype.start = function(t, e) {}, 
    t.prototype.shutdown = function() {}, t;
}(), Y = /** @class */ function() {
    function t(t, e, n) {
        this.t = t, this.i = e, this.o = n, this.type = "FirstParty", this.user = v.FIRST_PARTY, 
        this.u = new Map
        /**
     * Gets an authorization token, using a provided factory function, or return
     * null.
     */;
    }
    return t.prototype.l = function() {
        return this.o ? this.o() : null;
    }, Object.defineProperty(t.prototype, "headers", {
        get: function() {
            this.u.set("X-Goog-AuthUser", this.t);
            // Use array notation to prevent minification
            var t = this.l();
            return t && this.u.set("Authorization", t), this.i && this.u.set("X-Goog-Iam-Authorization-Token", this.i), 
            this.u;
        },
        enumerable: !1,
        configurable: !0
    }), t;
}(), H = /** @class */ function() {
    function t(t, e, n) {
        this.t = t, this.i = e, this.o = n;
    }
    return t.prototype.getToken = function() {
        return Promise.resolve(new Y(this.t, this.i, this.o));
    }, t.prototype.start = function(t, e) {
        // Fire with initial uid.
        t.enqueueRetryable((function() {
            return e(v.FIRST_PARTY);
        }));
    }, t.prototype.shutdown = function() {}, t.prototype.invalidateToken = function() {}, 
    t;
}(), J = function(t) {
    this.value = t, this.type = "AppCheck", this.headers = new Map, t && t.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
}, X = /** @class */ function() {
    function t(t) {
        var e = this;
        this.h = t, this.appCheck = null, t.onInit((function(t) {
            e.appCheck = t;
        }));
    }
    return t.prototype.getToken = function() {
        return this.appCheck ? this.appCheck.getToken().then((function(t) {
            return t ? (I("string" == typeof t.token), new J(t.token)) : null;
        })) : Promise.resolve(null);
    }, t.prototype.invalidateToken = function() {}, t.prototype.start = function(t, e) {}, 
    t.prototype.shutdown = function() {}, t;
}(), Z = 
/**
     * Constructs a DatabaseInfo using the provided host, databaseId and
     * persistenceKey.
     *
     * @param databaseId - The database to use.
     * @param appId - The Firebase App Id.
     * @param persistenceKey - A unique identifier for this Firestore's local
     * storage (used in conjunction with the databaseId).
     * @param host - The Firestore backend host to connect to.
     * @param ssl - Whether to use SSL when connecting.
     * @param forceLongPolling - Whether to use the forceLongPolling option
     * when using WebChannel as the network transport.
     * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
     * option when using WebChannel as the network transport.
     * @param longPollingOptions Options that configure long-polling.
     * @param useFetchStreams Whether to use the Fetch API instead of
     * XMLHTTPRequest
     */
function(t, e, n, r, i, o, a, u, s) {
    this.databaseId = t, this.appId = e, this.persistenceKey = n, this.host = r, this.ssl = i, 
    this.forceLongPolling = o, this.autoDetectLongPolling = a, this.longPollingOptions = u, 
    this.useFetchStreams = s;
}, $ = /** @class */ function() {
    function t(t, e) {
        this.projectId = t, this.database = e || "(default)";
    }
    return t.empty = function() {
        return new t("", "");
    }, Object.defineProperty(t.prototype, "isDefaultDatabase", {
        get: function() {
            return "(default)" === this.database;
        },
        enumerable: !1,
        configurable: !0
    }), t.prototype.isEqual = function(e) {
        return e instanceof t && e.projectId === this.projectId && e.database === this.database;
    }, t;
}(), tt = /** @class */ function() {
    function t(t, e, n) {
        void 0 === e ? e = 0 : e > t.length && k(), void 0 === n ? n = t.length - e : n > t.length - e && k(), 
        this.segments = t, this.offset = e, this.len = n;
    }
    return Object.defineProperty(t.prototype, "length", {
        get: function() {
            return this.len;
        },
        enumerable: !1,
        configurable: !0
    }), t.prototype.isEqual = function(e) {
        return 0 === t.comparator(this, e);
    }, t.prototype.child = function(e) {
        var n = this.segments.slice(this.offset, this.limit());
        return e instanceof t ? e.forEach((function(t) {
            n.push(t);
        })) : n.push(e), this.construct(n);
    }, 
    /** The index of one past the last segment of the path. */ t.prototype.limit = function() {
        return this.offset + this.length;
    }, t.prototype.popFirst = function(t) {
        return t = void 0 === t ? 1 : t, this.construct(this.segments, this.offset + t, this.length - t);
    }, t.prototype.popLast = function() {
        return this.construct(this.segments, this.offset, this.length - 1);
    }, t.prototype.firstSegment = function() {
        return this.segments[this.offset];
    }, t.prototype.lastSegment = function() {
        return this.get(this.length - 1);
    }, t.prototype.get = function(t) {
        return this.segments[this.offset + t];
    }, t.prototype.isEmpty = function() {
        return 0 === this.length;
    }, t.prototype.isPrefixOf = function(t) {
        if (t.length < this.length) return !1;
        for (var e = 0; e < this.length; e++) if (this.get(e) !== t.get(e)) return !1;
        return !0;
    }, t.prototype.isImmediateParentOf = function(t) {
        if (this.length + 1 !== t.length) return !1;
        for (var e = 0; e < this.length; e++) if (this.get(e) !== t.get(e)) return !1;
        return !0;
    }, t.prototype.forEach = function(t) {
        for (var e = this.offset, n = this.limit(); e < n; e++) t(this.segments[e]);
    }, t.prototype.toArray = function() {
        return this.segments.slice(this.offset, this.limit());
    }, t.comparator = function(t, e) {
        for (var n = Math.min(t.length, e.length), r = 0; r < n; r++) {
            var i = t.get(r), o = e.get(r);
            if (i < o) return -1;
            if (i > o) return 1;
        }
        return t.length < e.length ? -1 : t.length > e.length ? 1 : 0;
    }, t;
}(), et = /** @class */ function(e) {
    function n() {
        return null !== e && e.apply(this, arguments) || this;
    }
    return t(n, e), n.prototype.construct = function(t, e, r) {
        return new n(t, e, r);
    }, n.prototype.canonicalString = function() {
        // NOTE: The client is ignorant of any path segments containing escape
        // sequences (e.g. __id123__) and just passes them through raw (they exist
        // for legacy reasons and should not be used frequently).
        return this.toArray().join("/");
    }, n.prototype.toString = function() {
        return this.canonicalString();
    }, 
    /**
     * Creates a resource path from the given slash-delimited string. If multiple
     * arguments are provided, all components are combined. Leading and trailing
     * slashes from all components are ignored.
     */
    n.fromString = function() {
        for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
        // NOTE: The client is ignorant of any path segments containing escape
        // sequences (e.g. __id123__) and just passes them through raw (they exist
        // for legacy reasons and should not be used frequently).
                for (var r = [], i = 0, o = t; i < o.length; i++) {
            var a = o[i];
            if (a.indexOf("//") >= 0) throw new B(F, "Invalid segment (".concat(a, "). Paths must not contain // in them."));
            // Strip leading and traling slashed.
                        r.push.apply(r, a.split("/").filter((function(t) {
                return t.length > 0;
            })));
        }
        return new n(r);
    }, n.emptyPath = function() {
        return new n([]);
    }, n;
}(tt), nt = /^[_a-zA-Z][_a-zA-Z0-9]*$/, rt = /** @class */ function(e) {
    function n() {
        return null !== e && e.apply(this, arguments) || this;
    }
    return t(n, e), n.prototype.construct = function(t, e, r) {
        return new n(t, e, r);
    }, 
    /**
     * Returns true if the string could be used as a segment in a field path
     * without escaping.
     */
    n.isValidIdentifier = function(t) {
        return nt.test(t);
    }, n.prototype.canonicalString = function() {
        return this.toArray().map((function(t) {
            return t = t.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), n.isValidIdentifier(t) || (t = "`" + t + "`"), 
            t;
        })).join(".");
    }, n.prototype.toString = function() {
        return this.canonicalString();
    }, 
    /**
     * Returns true if this field references the key of a document.
     */
    n.prototype.isKeyField = function() {
        return 1 === this.length && "__name__" === this.get(0);
    }, 
    /**
     * The field designating the key of a document.
     */
    n.keyField = function() {
        return new n([ "__name__" ]);
    }, 
    /**
     * Parses a field string from the given server-formatted string.
     *
     * - Splitting the empty string is not allowed (for now at least).
     * - Empty segments within the string (e.g. if there are two consecutive
     *   separators) are not allowed.
     *
     * TODO(b/37244157): we should make this more strict. Right now, it allows
     * non-identifier path components, even if they aren't escaped.
     */
    n.fromServerFormat = function(t) {
        for (var e = [], r = "", i = 0, o = function() {
            if (0 === r.length) throw new B(F, "Invalid field path (".concat(t, "). Paths must not be empty, begin with '.', end with '.', or contain '..'"));
            e.push(r), r = "";
        }, a = !1; i < t.length; ) {
            var u = t[i];
            if ("\\" === u) {
                if (i + 1 === t.length) throw new B(F, "Path has trailing escape character: " + t);
                var s = t[i + 1];
                if ("\\" !== s && "." !== s && "`" !== s) throw new B(F, "Path has invalid escape sequence: " + t);
                r += s, i += 2;
            } else "`" === u ? (a = !a, i++) : "." !== u || a ? (r += u, i++) : (o(), i++);
        }
        if (o(), a) throw new B(F, "Unterminated ` in path: " + t);
        return new n(e);
    }, n.emptyPath = function() {
        return new n([]);
    }, n;
}(tt), it = /** @class */ function() {
    function t(t) {
        this.path = t;
    }
    return t.fromPath = function(e) {
        return new t(et.fromString(e));
    }, t.fromName = function(e) {
        return new t(et.fromString(e).popFirst(5));
    }, t.empty = function() {
        return new t(et.emptyPath());
    }, Object.defineProperty(t.prototype, "collectionGroup", {
        get: function() {
            return this.path.popLast().lastSegment();
        },
        enumerable: !1,
        configurable: !0
    }), 
    /** Returns true if the document is in the specified collectionId. */ t.prototype.hasCollectionId = function(t) {
        return this.path.length >= 2 && this.path.get(this.path.length - 2) === t;
    }, 
    /** Returns the collection group (i.e. the name of the parent collection) for this key. */ t.prototype.getCollectionGroup = function() {
        return this.path.get(this.path.length - 2);
    }, 
    /** Returns the fully qualified path to the parent collection. */ t.prototype.getCollectionPath = function() {
        return this.path.popLast();
    }, t.prototype.isEqual = function(t) {
        return null !== t && 0 === et.comparator(this.path, t.path);
    }, t.prototype.toString = function() {
        return this.path.toString();
    }, t.comparator = function(t, e) {
        return et.comparator(t.path, e.path);
    }, t.isDocumentKey = function(t) {
        return t.length % 2 == 0;
    }, 
    /**
     * Creates and returns a new document key with the given segments.
     *
     * @param segments - The segments of the path to the document
     * @returns A new instance of DocumentKey
     */
    t.fromSegments = function(e) {
        return new t(new et(e.slice()));
    }, t;
}();

/** An error returned by a Firestore operation. */
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
function ot(t, e, n) {
    if (!n) throw new B(F, "Function ".concat(t, "() cannot be called with an empty ").concat(e, "."));
}

/**
 * Validates that two boolean options are not set at the same time.
 * @internal
 */
/**
 * Validates that `path` refers to a document (indicated by the fact it contains
 * an even numbers of segments).
 */ function at(t) {
    if (!it.isDocumentKey(t)) throw new B(F, "Invalid document reference. Document references must have an even number of segments, but ".concat(t, " has ").concat(t.length, "."));
}

/**
 * Validates that `path` refers to a collection (indicated by the fact it
 * contains an odd numbers of segments).
 */ function ut(t) {
    if (it.isDocumentKey(t)) throw new B(F, "Invalid collection reference. Collection references must have an odd number of segments, but ".concat(t, " has ").concat(t.length, "."));
}

/**
 * Returns true if it's a non-null object without a custom prototype
 * (i.e. excludes Array, Date, etc.).
 */
/** Returns a string describing the type / value of the provided input. */ function st(t) {
    if (void 0 === t) return "undefined";
    if (null === t) return "null";
    if ("string" == typeof t) return t.length > 20 && (t = "".concat(t.substring(0, 20), "...")), 
    JSON.stringify(t);
    if ("number" == typeof t || "boolean" == typeof t) return "" + t;
    if ("object" == typeof t) {
        if (t instanceof Array) return "an array";
        var e = 
        /** try to get the constructor name for an object. */
        function(t) {
            return t.constructor ? t.constructor.name : null;
        }(t);
        return e ? "a custom ".concat(e, " object") : "an object";
    }
    return "function" == typeof t ? "a function" : k();
}

function ct(t, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
e) {
    if ("_delegate" in t && (
    // Unwrap Compat types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t = t._delegate), !(t instanceof e)) {
        if (e.name === t.constructor.name) throw new B(F, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
        var n = st(t);
        throw new B(F, "Expected type '".concat(e.name, "', but it was: ").concat(n));
    }
    return t;
}

function lt(t, e) {
    if (e <= 0) throw new B(F, "Function ".concat(t, "() requires a positive number, but it was: ").concat(e, "."));
}

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
/**
 * Compares two `ExperimentalLongPollingOptions` objects for equality.
 */
/**
 * Creates and returns a new `ExperimentalLongPollingOptions` with the same
 * option values as the given instance.
 */ function ft(t) {
    var e = {};
    return void 0 !== t.timeoutSeconds && (e.timeoutSeconds = t.timeoutSeconds), e
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
    /**
 * The value returned from the most recent invocation of
 * `generateUniqueDebugId()`, or null if it has never been invoked.
 */;
}

var ht = null;

/**
 * Generates and returns an initial value for `lastUniqueDebugId`.
 *
 * The returned value is randomly selected from a range of integers that are
 * represented as 8 hexadecimal digits. This means that (within reason) any
 * numbers generated by incrementing the returned number by 1 will also be
 * represented by 8 hexadecimal digits. This leads to all "IDs" having the same
 * length when converted to a hexadecimal string, making reading logs containing
 * these IDs easier to follow. And since the return value is randomly selected
 * it will help to differentiate between logs from different executions.
 */
/**
 * Generates and returns a unique ID as a hexadecimal string.
 *
 * The returned ID is intended to be used in debug logging messages to help
 * correlate log messages that may be spatially separated in the logs, but
 * logically related. For example, a network connection could include the same
 * "debug ID" string in all of its log messages to help trace a specific
 * connection over time.
 *
 * @return the 10-character generated ID (e.g. "0xa1b2c3d4").
 */
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
 * Returns whether a variable is either undefined or null.
 */
function pt(t) {
    return null == t;
}

/** Returns whether the value represents -0. */ function dt(t) {
    // Detect if the value is -0.0. Based on polyfill from
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    return 0 === t && 1 / t == -1 / 0;
}

/**
 * Returns whether a value is an integer and in the safe integer range
 * @param value - The value to test for being an integer and in the safe range
 */
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
 */ var yt, mt, vt = {
    BatchGetDocuments: "batchGet",
    Commit: "commit",
    RunQuery: "runQuery",
    RunAggregationQuery: "runAggregationQuery"
};

/**
 * Maps RPC names to the corresponding REST endpoint name.
 *
 * We use array notation to avoid mangling.
 */
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
 * Error Codes describing the different ways GRPC can fail. These are copied
 * directly from GRPC's sources here:
 *
 * https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
 *
 * Important! The names of these identifiers matter because the string forms
 * are used for reverse lookups from the webchannel stream. Do NOT change the
 * names of these identifiers or change this into a const enum.
 */
/**
 * Converts an HTTP Status Code to the equivalent error code.
 *
 * @param status - An HTTP Status Code, like 200, 404, 503, etc.
 * @returns The equivalent Code. Unknown status codes are mapped to
 *     Code.UNKNOWN.
 */
function gt(t) {
    if (void 0 === t) return T("RPC_ERROR", "HTTP error has no status"), V;
    // The canonical error codes for Google APIs [1] specify mapping onto HTTP
    // status codes but the mapping is not bijective. In each case of ambiguity
    // this function chooses a primary error.
    // [1]
    // https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
        switch (t) {
      case 200:
        // OK
        return "ok";

      case 400:
        // Bad Request
        return x;

        // Other possibilities based on the forward mapping
        // return Code.INVALID_ARGUMENT;
        // return Code.OUT_OF_RANGE;
              case 401:
        // Unauthorized
        return R;

      case 403:
        // Forbidden
        return D;

      case 404:
        // Not Found
        return N;

      case 409:
        // Conflict
        return C;

        // Other possibilities:
        // return Code.ALREADY_EXISTS;
              case 416:
        // Range Not Satisfiable
        return L;

      case 429:
        // Too Many Requests
        return q;

      case 499:
        // Client Closed Request
        return P;

      case 500:
        // Internal Server Error
        return V;

        // Other possibilities:
        // return Code.INTERNAL;
        // return Code.DATA_LOSS;
              case 501:
        // Unimplemented
        return j;

      case 503:
        // Service Unavailable
        return U;

      case 504:
        // Gateway Timeout
        return O;

      default:
        return t >= 200 && t < 300 ? "ok" : t >= 400 && t < 500 ? x : t >= 500 && t < 600 ? M : V;
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
 * A Rest-based connection that relies on the native HTTP stack
 * (e.g. `fetch` or a polyfill).
 */ (mt = yt || (yt = {}))[mt.OK = 0] = "OK", mt[mt.CANCELLED = 1] = "CANCELLED", 
mt[mt.UNKNOWN = 2] = "UNKNOWN", mt[mt.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", 
mt[mt.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", mt[mt.NOT_FOUND = 5] = "NOT_FOUND", 
mt[mt.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", mt[mt.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", 
mt[mt.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", mt[mt.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", 
mt[mt.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", mt[mt.ABORTED = 10] = "ABORTED", 
mt[mt.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", mt[mt.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", 
mt[mt.INTERNAL = 13] = "INTERNAL", mt[mt.UNAVAILABLE = 14] = "UNAVAILABLE", mt[mt.DATA_LOSS = 15] = "DATA_LOSS";

var wt = /** @class */ function(r) {
    /**
     * @param databaseInfo - The connection info.
     * @param fetchImpl - `fetch` or a Polyfill that implements the fetch API.
     */
    function i(t, e) {
        var n = this;
        return (n = r.call(this, t) || this).F = e, n;
    }
    /**
     * Base class for all Rest-based connections to the backend (WebChannel and
     * HTTP).
     */
    return t(i, r), i.prototype.v = function(t, e) {
        throw new Error("Not supported by FetchConnection");
    }, i.prototype.p = function(t, r, i, o) {
        return e(this, void 0, void 0, (function() {
            var t, e, a, u, s, c, l;
            return n(this, (function(n) {
                switch (n.label) {
                  case 0:
                    e = JSON.stringify(o), n.label = 1;

                  case 1:
                    return n.trys.push([ 1, 3, , 4 ]), [ 4 /*yield*/ , this.F(r, {
                        method: "POST",
                        headers: i,
                        body: e
                    }) ];

                  case 2:
                    return a = n.sent(), [ 3 /*break*/ , 4 ];

                  case 3:
                    throw u = n.sent(), new B(gt((s = u).status), "Request failed with error: " + s.statusText);

                  case 4:
                    return a.ok ? [ 3 /*break*/ , 6 ] : [ 4 /*yield*/ , a.json() ];

                  case 5:
                    throw c = n.sent(), Array.isArray(c) && (c = c[0]), l = null === (t = null == c ? void 0 : c.error) || void 0 === t ? void 0 : t.message, 
                    new B(gt(a.status), "Request failed with error: ".concat(null != l ? l : a.statusText));

                  case 6:
                    return [ 2 /*return*/ , a.json() ];
                }
            }));
        }));
    }, i;
}(/** @class */ function() {
    function t(t) {
        this.databaseInfo = t, this.databaseId = t.databaseId;
        var e = t.ssl ? "https" : "http", n = encodeURIComponent(this.databaseId.projectId), r = encodeURIComponent(this.databaseId.database);
        this.m = e + "://" + t.host, this.A = "projects/".concat(n, "/databases/").concat(r), 
        this.T = "(default)" === this.databaseId.database ? "project_id=".concat(n) : "project_id=".concat(n, "&database_id=").concat(r);
    }
    return Object.defineProperty(t.prototype, "P", {
        get: function() {
            // Both `invokeRPC()` and `invokeStreamingRPC()` use their `path` arguments to determine
            // where to run the query, and expect the `request` to NOT specify the "path".
            return !1;
        },
        enumerable: !1,
        configurable: !0
    }), t.prototype.R = function(t, e, n, r, i) {
        var o = (null === ht ? ht = 268435456 + Math.round(2147483648 * Math.random()) : ht++, 
        "0x" + ht.toString(16)), a = this.I(t, e);
        _("RestConnection", "Sending RPC '".concat(t, "' ").concat(o, ":"), a, n);
        var u = {
            "google-cloud-resource-prefix": this.A,
            "x-goog-request-params": this.T
        };
        return this.V(u, r, i), this.p(t, a, u, n).then((function(e) {
            return _("RestConnection", "Received RPC '".concat(t, "' ").concat(o, ": "), e), 
            e;
        }), (function(e) {
            throw E("RestConnection", "RPC '".concat(t, "' ").concat(o, " failed with error: "), e, "url: ", a, "request:", n), 
            e;
        }));
    }, t.prototype.g = function(t, e, n, r, i, o) {
        // The REST API automatically aggregates all of the streamed results, so we
        // can just use the normal invoke() method.
        return this.R(t, e, n, r, i);
    }, 
    /**
     * Modifies the headers for a request, adding any authorization token if
     * present and any additional headers for the request.
     */
    t.prototype.V = function(t, e, n) {
        t["X-Goog-Api-Client"] = "gl-js/ fire/" + g, 
        // Content-Type: text/plain will avoid preflight requests which might
        // mess with CORS and redirects by proxies. If we add custom headers
        // we will need to change this code to potentially use the $httpOverwrite
        // parameter supported by ESF to avoid triggering preflight requests.
        t["Content-Type"] = "text/plain", this.databaseInfo.appId && (t["X-Firebase-GMPID"] = this.databaseInfo.appId), 
        e && e.headers.forEach((function(e, n) {
            return t[n] = e;
        })), n && n.headers.forEach((function(e, n) {
            return t[n] = e;
        }));
    }, t.prototype.I = function(t, e) {
        var n = vt[t];
        return "".concat(this.m, "/v1/").concat(e, ":").concat(n);
    }, t;
}()), bt = function(t, e, n) {
    this.alias = t, this.aggregateType = e, this.fieldPath = n;
};

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
/** Initializes the HTTP connection for the REST API. */
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
/**
 * Concrete implementation of the Aggregate type.
 */
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
 * Generates `nBytes` of random bytes.
 *
 * If `nBytes < 0` , an error will be thrown.
 */
function _t(t) {
    // Polyfills for IE and WebWorker by using `self` and `msCrypto` when `crypto` is not available.
    var e = 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "undefined" != typeof self && (self.crypto || self.msCrypto), n = new Uint8Array(t);
    if (e && "function" == typeof e.getRandomValues) e.getRandomValues(n); else 
    // Falls back to Math.random
    for (var r = 0; r < t; r++) n[r] = Math.floor(256 * Math.random());
    return n;
}

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
 * A utility class for generating unique alphanumeric IDs of a specified length.
 *
 * @internal
 * Exported internally for testing purposes.
 */ var Tt = /** @class */ function() {
    function t() {}
    return t.newId = function() {
        for (
        // Alphanumeric characters
        var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t.length) * t.length, n = ""
        // The largest byte value that is a multiple of `char.length`.
        ; n.length < 20; ) for (var r = _t(40), i = 0; i < r.length; ++i) 
        // Only accept values that are [0, maxMultiple), this ensures they can
        // be evenly mapped to indices of `chars` via a modulo operation.
        n.length < 20 && r[i] < e && (n += t.charAt(r[i] % t.length));
        return n;
    }, t;
}();

function Et(t, e) {
    return t < e ? -1 : t > e ? 1 : 0;
}

/** Helper to compare arrays using isEqual(). */ function St(t, e, n) {
    return t.length === e.length && t.every((function(t, r) {
        return n(t, e[r]);
    }));
}

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
 */ function kt(t) {
    var e = 0;
    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e++;
    return e;
}

function It(t, e) {
    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n]);
}

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
/**
 * An error encountered while decoding base64 string.
 */ var At = /** @class */ function(e) {
    function n() {
        var t = this;
        return (t = e.apply(this, arguments) || this).name = "Base64DecodeError", t;
    }
    return t(n, e), n;
}(Error), Pt = /** @class */ function() {
    function t(t) {
        this.binaryString = t;
    }
    return t.fromBase64String = function(e) {
        var n = function(t) {
            try {
                return atob(t);
            } catch (t) {
                // Check that `DOMException` is defined before using it to avoid
                // "ReferenceError: Property 'DOMException' doesn't exist" in react-native.
                // (https://github.com/firebase/firebase-js-sdk/issues/7115)
                throw "undefined" != typeof DOMException && t instanceof DOMException ? new At("Invalid base64 string: " + t) : t;
            }
        }(e);
        return new t(n);
    }, t.fromUint8Array = function(e) {
        // TODO(indexing); Remove the copy of the byte string here as this method
        // is frequently called during indexing.
        var n = 
        /**
 * Helper function to convert an Uint8array to a binary string.
 */
        function(t) {
            for (var e = "", n = 0; n < t.length; ++n) e += String.fromCharCode(t[n]);
            return e;
        }(e);
        return new t(n);
    }, t.prototype[Symbol.iterator] = function() {
        var t = this, e = 0;
        return {
            next: function() {
                return e < t.binaryString.length ? {
                    value: t.binaryString.charCodeAt(e++),
                    done: !1
                } : {
                    value: void 0,
                    done: !0
                };
            }
        };
    }, t.prototype.toBase64 = function() {
        return t = this.binaryString, btoa(t);
        var t;
    }, t.prototype.toUint8Array = function() {
        return function(t) {
            for (var e = new Uint8Array(t.length), n = 0; n < t.length; n++) e[n] = t.charCodeAt(n);
            return e;
        }(this.binaryString);
    }, t.prototype.approximateByteSize = function() {
        return 2 * this.binaryString.length;
    }, t.prototype.compareTo = function(t) {
        return Et(this.binaryString, t.binaryString);
    }, t.prototype.isEqual = function(t) {
        return this.binaryString === t.binaryString;
    }, t;
}();

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
/** Converts a Base64 encoded string to a binary string. */
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
 * Immutable class that represents a "proto" byte string.
 *
 * Proto byte strings can either be Base64-encoded strings or Uint8Arrays when
 * sent on the wire. This class abstracts away this differentiation by holding
 * the proto byte string in a common class that must be converted into a string
 * before being sent as a proto.
 * @internal
 */ Pt.EMPTY_BYTE_STRING = new Pt("");

var Vt = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);

/**
 * Converts the possible Proto values for a timestamp value into a "seconds and
 * nanos" representation.
 */ function Ft(t) {
    // The json interface (for the browser) will return an iso timestamp string,
    // while the proto js library (for node) will return a
    // google.protobuf.Timestamp instance.
    if (I(!!t), "string" == typeof t) {
        // The date string can have higher precision (nanos) than the Date class
        // (millis), so we do some custom parsing here.
        // Parse the nanos right out of the string.
        var e = 0, n = Vt.exec(t);
        if (I(!!n), n[1]) {
            // Pad the fraction out to 9 digits (nanos).
            var r = n[1];
            r = (r + "000000000").substr(0, 9), e = Number(r);
        }
        // Parse the date to get the seconds.
                var i = new Date(t);
        return {
            seconds: Math.floor(i.getTime() / 1e3),
            nanos: e
        };
    }
    return {
        seconds: Ot(t.seconds),
        nanos: Ot(t.nanos)
    };
}

/**
 * Converts the possible Proto types for numbers into a JavaScript number.
 * Returns 0 if the value is not numeric.
 */ function Ot(t) {
    // TODO(bjornick): Handle int64 greater than 53 bits.
    return "number" == typeof t ? t : "string" == typeof t ? Number(t) : 0;
}

/** Converts the possible Proto types for Blobs into a ByteString. */ function Nt(t) {
    return "string" == typeof t ? Pt.fromBase64String(t) : Pt.fromUint8Array(t);
}

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
// The earliest date supported by Firestore timestamps (0001-01-01T00:00:00Z).
/**
 * A `Timestamp` represents a point in time independent of any time zone or
 * calendar, represented as seconds and fractions of seconds at nanosecond
 * resolution in UTC Epoch time.
 *
 * It is encoded using the Proleptic Gregorian Calendar which extends the
 * Gregorian calendar backwards to year one. It is encoded assuming all minutes
 * are 60 seconds long, i.e. leap seconds are "smeared" so that no leap second
 * table is needed for interpretation. Range is from 0001-01-01T00:00:00Z to
 * 9999-12-31T23:59:59.999999999Z.
 *
 * For examples and further specifications, refer to the
 * {@link https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto | Timestamp definition}.
 */ var Dt = /** @class */ function() {
    /**
     * Creates a new timestamp.
     *
     * @param seconds - The number of seconds of UTC time since Unix epoch
     *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
     *     9999-12-31T23:59:59Z inclusive.
     * @param nanoseconds - The non-negative fractions of a second at nanosecond
     *     resolution. Negative second values with fractions must still have
     *     non-negative nanoseconds values that count forward in time. Must be
     *     from 0 to 999,999,999 inclusive.
     */
    function t(
    /**
     * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
     */
    t, 
    /**
     * The fractions of a second at nanosecond resolution.*
     */
    e) {
        if (this.seconds = t, this.nanoseconds = e, e < 0) throw new B(F, "Timestamp nanoseconds out of range: " + e);
        if (e >= 1e9) throw new B(F, "Timestamp nanoseconds out of range: " + e);
        if (t < -62135596800) throw new B(F, "Timestamp seconds out of range: " + t);
        // This will break in the year 10,000.
                if (t >= 253402300800) throw new B(F, "Timestamp seconds out of range: " + t);
    }
    /**
     * Creates a new timestamp with the current date, with millisecond precision.
     *
     * @returns a new timestamp representing the current date.
     */    return t.now = function() {
        return t.fromMillis(Date.now());
    }, 
    /**
     * Creates a new timestamp from the given date.
     *
     * @param date - The date to initialize the `Timestamp` from.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     date.
     */
    t.fromDate = function(e) {
        return t.fromMillis(e.getTime());
    }, 
    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds - Number of milliseconds since Unix epoch
     *     1970-01-01T00:00:00Z.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     number of milliseconds.
     */
    t.fromMillis = function(e) {
        var n = Math.floor(e / 1e3);
        return new t(n, Math.floor(1e6 * (e - 1e3 * n)));
    }, 
    /**
     * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
     * causes a loss of precision since `Date` objects only support millisecond
     * precision.
     *
     * @returns JavaScript `Date` object representing the same point in time as
     *     this `Timestamp`, with millisecond precision.
     */
    t.prototype.toDate = function() {
        return new Date(this.toMillis());
    }, 
    /**
     * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
     * epoch). This operation causes a loss of precision.
     *
     * @returns The point in time corresponding to this timestamp, represented as
     *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */
    t.prototype.toMillis = function() {
        return 1e3 * this.seconds + this.nanoseconds / 1e6;
    }, t.prototype._compareTo = function(t) {
        return this.seconds === t.seconds ? Et(this.nanoseconds, t.nanoseconds) : Et(this.seconds, t.seconds);
    }, 
    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other - The `Timestamp` to compare against.
     * @returns true if this `Timestamp` is equal to the provided one.
     */
    t.prototype.isEqual = function(t) {
        return t.seconds === this.seconds && t.nanoseconds === this.nanoseconds;
    }, 
    /** Returns a textual representation of this `Timestamp`. */ t.prototype.toString = function() {
        return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
    }, 
    /** Returns a JSON-serializable representation of this `Timestamp`. */ t.prototype.toJSON = function() {
        return {
            seconds: this.seconds,
            nanoseconds: this.nanoseconds
        };
    }, 
    /**
     * Converts this object to a primitive string, which allows `Timestamp` objects
     * to be compared using the `>`, `<=`, `>=` and `>` operators.
     */
    t.prototype.valueOf = function() {
        // This method returns a string of the form <seconds>.<nanoseconds> where
        // <seconds> is translated to have a non-negative value and both <seconds>
        // and <nanoseconds> are left-padded with zeroes to be a consistent length.
        // Strings with this format then have a lexiographical ordering that matches
        // the expected ordering. The <seconds> translation is done to avoid having
        // a leading negative sign (i.e. a leading '-' character) in its string
        // representation, which would affect its lexiographical ordering.
        var t = this.seconds - -62135596800;
        // Note: Up to 12 decimal digits are required to represent all valid
        // 'seconds' values.
                return String(t).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
    }, t;
}();

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
 * Represents a locally-applied ServerTimestamp.
 *
 * Server Timestamps are backed by MapValues that contain an internal field
 * `__type__` with a value of `server_timestamp`. The previous value and local
 * write time are stored in its `__previous_value__` and `__local_write_time__`
 * fields respectively.
 *
 * Notes:
 * - ServerTimestampValue instances are created as the result of applying a
 *   transform. They can only exist in the local view of a document. Therefore
 *   they do not need to be parsed or serialized.
 * - When evaluated locally (e.g. for snapshot.data()), they by default
 *   evaluate to `null`. This behavior can be configured by passing custom
 *   FieldValueOptions to value().
 * - With respect to other ServerTimestampValues, they sort by their
 *   localWriteTime.
 */ function Rt(t) {
    var e, n;
    return "server_timestamp" === (null === (n = ((null === (e = null == t ? void 0 : t.mapValue) || void 0 === e ? void 0 : e.fields) || {}).__type__) || void 0 === n ? void 0 : n.stringValue);
}

/**
 * Returns the value of the field before this ServerTimestamp was set.
 *
 * Preserving the previous values allows the user to display the last resoled
 * value until the backend responds with the timestamp.
 */ function qt(t) {
    var e = t.mapValue.fields.__previous_value__;
    return Rt(e) ? qt(e) : e;
}

/**
 * Returns the local time at which this timestamp was first set.
 */ function xt(t) {
    var e = Ft(t.mapValue.fields.__local_write_time__.timestampValue);
    return new Dt(e.seconds, e.nanos);
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
 */ var Ct = {
    fields: {
        __type__: {
            stringValue: "__max__"
        }
    }
};

/** Extracts the backend's type order for the provided value. */ function Lt(t) {
    return "nullValue" in t ? 0 /* TypeOrder.NullValue */ : "booleanValue" in t ? 1 /* TypeOrder.BooleanValue */ : "integerValue" in t || "doubleValue" in t ? 2 /* TypeOrder.NumberValue */ : "timestampValue" in t ? 3 /* TypeOrder.TimestampValue */ : "stringValue" in t ? 5 /* TypeOrder.StringValue */ : "bytesValue" in t ? 6 /* TypeOrder.BlobValue */ : "referenceValue" in t ? 7 /* TypeOrder.RefValue */ : "geoPointValue" in t ? 8 /* TypeOrder.GeoPointValue */ : "arrayValue" in t ? 9 /* TypeOrder.ArrayValue */ : "mapValue" in t ? Rt(t) ? 4 /* TypeOrder.ServerTimestampValue */ : 
    /** Returns true if the Value represents the canonical {@link #MAX_VALUE} . */
    function(t) {
        return "__max__" === (((t.mapValue || {}).fields || {}).__type__ || {}).stringValue;
    }(t) ? 9007199254740991 /* TypeOrder.MaxValue */ : 10 /* TypeOrder.ObjectValue */ : k();
}

/** Tests `left` and `right` for equality based on the backend semantics. */ function jt(t, e) {
    if (t === e) return !0;
    var n = Lt(t);
    if (n !== Lt(e)) return !1;
    switch (n) {
      case 0 /* TypeOrder.NullValue */ :
      case 9007199254740991 /* TypeOrder.MaxValue */ :
        return !0;

      case 1 /* TypeOrder.BooleanValue */ :
        return t.booleanValue === e.booleanValue;

      case 4 /* TypeOrder.ServerTimestampValue */ :
        return xt(t).isEqual(xt(e));

      case 3 /* TypeOrder.TimestampValue */ :
        return function(t, e) {
            if ("string" == typeof t.timestampValue && "string" == typeof e.timestampValue && t.timestampValue.length === e.timestampValue.length) 
            // Use string equality for ISO 8601 timestamps
            return t.timestampValue === e.timestampValue;
            var n = Ft(t.timestampValue), r = Ft(e.timestampValue);
            return n.seconds === r.seconds && n.nanos === r.nanos;
        }(t, e);

      case 5 /* TypeOrder.StringValue */ :
        return t.stringValue === e.stringValue;

      case 6 /* TypeOrder.BlobValue */ :
        return function(t, e) {
            return Nt(t.bytesValue).isEqual(Nt(e.bytesValue));
        }(t, e);

      case 7 /* TypeOrder.RefValue */ :
        return t.referenceValue === e.referenceValue;

      case 8 /* TypeOrder.GeoPointValue */ :
        return function(t, e) {
            return Ot(t.geoPointValue.latitude) === Ot(e.geoPointValue.latitude) && Ot(t.geoPointValue.longitude) === Ot(e.geoPointValue.longitude);
        }(t, e);

      case 2 /* TypeOrder.NumberValue */ :
        return function(t, e) {
            if ("integerValue" in t && "integerValue" in e) return Ot(t.integerValue) === Ot(e.integerValue);
            if ("doubleValue" in t && "doubleValue" in e) {
                var n = Ot(t.doubleValue), r = Ot(e.doubleValue);
                return n === r ? dt(n) === dt(r) : isNaN(n) && isNaN(r);
            }
            return !1;
        }(t, e);

      case 9 /* TypeOrder.ArrayValue */ :
        return St(t.arrayValue.values || [], e.arrayValue.values || [], jt);

      case 10 /* TypeOrder.ObjectValue */ :
        return function(t, e) {
            var n = t.mapValue.fields || {}, r = e.mapValue.fields || {};
            if (kt(n) !== kt(r)) return !1;
            for (var i in n) if (n.hasOwnProperty(i) && (void 0 === r[i] || !jt(n[i], r[i]))) return !1;
            return !0;
        }(t, e);

      default:
        return k();
    }
}

function Mt(t, e) {
    return void 0 !== (t.values || []).find((function(t) {
        return jt(t, e);
    }));
}

function Ut(t, e) {
    if (t === e) return 0;
    var n = Lt(t), r = Lt(e);
    if (n !== r) return Et(n, r);
    switch (n) {
      case 0 /* TypeOrder.NullValue */ :
      case 9007199254740991 /* TypeOrder.MaxValue */ :
        return 0;

      case 1 /* TypeOrder.BooleanValue */ :
        return Et(t.booleanValue, e.booleanValue);

      case 2 /* TypeOrder.NumberValue */ :
        return function(t, e) {
            var n = Ot(t.integerValue || t.doubleValue), r = Ot(e.integerValue || e.doubleValue);
            return n < r ? -1 : n > r ? 1 : n === r ? 0 : 
            // one or both are NaN.
            isNaN(n) ? isNaN(r) ? 0 : -1 : 1;
        }(t, e);

      case 3 /* TypeOrder.TimestampValue */ :
        return Bt(t.timestampValue, e.timestampValue);

      case 4 /* TypeOrder.ServerTimestampValue */ :
        return Bt(xt(t), xt(e));

      case 5 /* TypeOrder.StringValue */ :
        return Et(t.stringValue, e.stringValue);

      case 6 /* TypeOrder.BlobValue */ :
        return function(t, e) {
            var n = Nt(t), r = Nt(e);
            return n.compareTo(r);
        }(t.bytesValue, e.bytesValue);

      case 7 /* TypeOrder.RefValue */ :
        return function(t, e) {
            for (var n = t.split("/"), r = e.split("/"), i = 0; i < n.length && i < r.length; i++) {
                var o = Et(n[i], r[i]);
                if (0 !== o) return o;
            }
            return Et(n.length, r.length);
        }(t.referenceValue, e.referenceValue);

      case 8 /* TypeOrder.GeoPointValue */ :
        return function(t, e) {
            var n = Et(Ot(t.latitude), Ot(e.latitude));
            return 0 !== n ? n : Et(Ot(t.longitude), Ot(e.longitude));
        }(t.geoPointValue, e.geoPointValue);

      case 9 /* TypeOrder.ArrayValue */ :
        return function(t, e) {
            for (var n = t.values || [], r = e.values || [], i = 0; i < n.length && i < r.length; ++i) {
                var o = Ut(n[i], r[i]);
                if (o) return o;
            }
            return Et(n.length, r.length);
        }(t.arrayValue, e.arrayValue);

      case 10 /* TypeOrder.ObjectValue */ :
        return function(t, e) {
            if (t === Ct && e === Ct) return 0;
            if (t === Ct) return 1;
            if (e === Ct) return -1;
            var n = t.fields || {}, r = Object.keys(n), i = e.fields || {}, o = Object.keys(i);
            // Even though MapValues are likely sorted correctly based on their insertion
            // order (e.g. when received from the backend), local modifications can bring
            // elements out of order. We need to re-sort the elements to ensure that
            // canonical IDs are independent of insertion order.
                        r.sort(), o.sort();
            for (var a = 0; a < r.length && a < o.length; ++a) {
                var u = Et(r[a], o[a]);
                if (0 !== u) return u;
                var s = Ut(n[r[a]], i[o[a]]);
                if (0 !== s) return s;
            }
            return Et(r.length, o.length);
        }(t.mapValue, e.mapValue);

      default:
        throw k();
    }
}

function Bt(t, e) {
    if ("string" == typeof t && "string" == typeof e && t.length === e.length) return Et(t, e);
    var n = Ft(t), r = Ft(e), i = Et(n.seconds, r.seconds);
    return 0 !== i ? i : Et(n.nanos, r.nanos);
}

function zt(t, e) {
    return {
        referenceValue: "projects/".concat(t.projectId, "/databases/").concat(t.database, "/documents/").concat(e.path.canonicalString())
    };
}

/** Returns true if `value` is an ArrayValue. */ function Kt(t) {
    return !!t && "arrayValue" in t;
}

/** Returns true if `value` is a NullValue. */ function Gt(t) {
    return !!t && "nullValue" in t;
}

/** Returns true if `value` is NaN. */ function Qt(t) {
    return !!t && "doubleValue" in t && isNaN(Number(t.doubleValue));
}

/** Returns true if `value` is a MapValue. */ function Wt(t) {
    return !!t && "mapValue" in t;
}

/** Creates a deep copy of `source`. */ function Yt(t) {
    if (t.geoPointValue) return {
        geoPointValue: Object.assign({}, t.geoPointValue)
    };
    if (t.timestampValue && "object" == typeof t.timestampValue) return {
        timestampValue: Object.assign({}, t.timestampValue)
    };
    if (t.mapValue) {
        var e = {
            mapValue: {
                fields: {}
            }
        };
        return It(t.mapValue.fields, (function(t, n) {
            return e.mapValue.fields[t] = Yt(n);
        })), e;
    }
    if (t.arrayValue) {
        for (var n = {
            arrayValue: {
                values: []
            }
        }, r = 0; r < (t.arrayValue.values || []).length; ++r) n.arrayValue.values[r] = Yt(t.arrayValue.values[r]);
        return n;
    }
    return Object.assign({}, t);
}

var Ht = function(t, e) {
    this.position = t, this.inclusive = e;
};

function Jt(t, e) {
    if (null === t) return null === e;
    if (null === e) return !1;
    if (t.inclusive !== e.inclusive || t.position.length !== e.position.length) return !1;
    for (var n = 0; n < t.position.length; n++) if (!jt(t.position[n], e.position[n])) return !1;
    return !0;
}

/**
 * @license
 * Copyright 2022 Google LLC
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
 */ var Xt = function() {}, Zt = /** @class */ function(e) {
    function n(t, n, r) {
        var i = this;
        return (i = e.call(this) || this).field = t, i.op = n, i.value = r, i;
    }
    /**
     * Creates a filter based on the provided arguments.
     */    return t(n, e), n.create = function(t, e, r) {
        return t.isKeyField() ? "in" /* Operator.IN */ === e || "not-in" /* Operator.NOT_IN */ === e ? this.createKeyFieldInFilter(t, e, r) : new ee(t, e, r) : "array-contains" /* Operator.ARRAY_CONTAINS */ === e ? new oe(t, r) : "in" /* Operator.IN */ === e ? new ae(t, r) : "not-in" /* Operator.NOT_IN */ === e ? new ue(t, r) : "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === e ? new se(t, r) : new n(t, e, r);
    }, n.createKeyFieldInFilter = function(t, e, n) {
        return "in" /* Operator.IN */ === e ? new ne(t, n) : new re(t, n);
    }, n.prototype.matches = function(t) {
        var e = t.data.field(this.field);
        // Types do not have to match in NOT_EQUAL filters.
                return "!=" /* Operator.NOT_EQUAL */ === this.op ? null !== e && this.matchesComparison(Ut(e, this.value)) : null !== e && Lt(this.value) === Lt(e) && this.matchesComparison(Ut(e, this.value));
        // Only compare types with matching backend order (such as double and int).
        }, n.prototype.matchesComparison = function(t) {
        switch (this.op) {
          case "<" /* Operator.LESS_THAN */ :
            return t < 0;

          case "<=" /* Operator.LESS_THAN_OR_EQUAL */ :
            return t <= 0;

          case "==" /* Operator.EQUAL */ :
            return 0 === t;

          case "!=" /* Operator.NOT_EQUAL */ :
            return 0 !== t;

          case ">" /* Operator.GREATER_THAN */ :
            return t > 0;

          case ">=" /* Operator.GREATER_THAN_OR_EQUAL */ :
            return t >= 0;

          default:
            return k();
        }
    }, n.prototype.isInequality = function() {
        return [ "<" /* Operator.LESS_THAN */ , "<=" /* Operator.LESS_THAN_OR_EQUAL */ , ">" /* Operator.GREATER_THAN */ , ">=" /* Operator.GREATER_THAN_OR_EQUAL */ , "!=" /* Operator.NOT_EQUAL */ , "not-in" /* Operator.NOT_IN */ ].indexOf(this.op) >= 0;
    }, n.prototype.getFlattenedFilters = function() {
        return [ this ];
    }, n.prototype.getFilters = function() {
        return [ this ];
    }, n;
}(Xt), $t = /** @class */ function(e) {
    function n(t, n) {
        var r = this;
        return (r = e.call(this) || this).filters = t, r.op = n, r.D = null, r;
    }
    /**
     * Creates a filter based on the provided arguments.
     */    return t(n, e), n.create = function(t, e) {
        return new n(t, e);
    }, n.prototype.matches = function(t) {
        return function(t) {
            return "and" /* CompositeOperator.AND */ === t.op;
        }(this) ? void 0 === this.filters.find((function(e) {
            return !e.matches(t);
        })) : void 0 !== this.filters.find((function(e) {
            return e.matches(t);
        }));
    }, n.prototype.getFlattenedFilters = function() {
        return null !== this.D || (this.D = this.filters.reduce((function(t, e) {
            return t.concat(e.getFlattenedFilters());
        }), [])), this.D;
    }, 
    // Returns a mutable copy of `this.filters`
    n.prototype.getFilters = function() {
        return Object.assign([], this.filters);
    }, n;
}(Xt);

function te(t, e) {
    return t instanceof Zt ? function(t, e) {
        return e instanceof Zt && t.op === e.op && t.field.isEqual(e.field) && jt(t.value, e.value);
    }(t, e) : t instanceof $t ? function(t, e) {
        return e instanceof $t && t.op === e.op && t.filters.length === e.filters.length && t.filters.reduce((function(t, n, r) {
            return t && te(n, e.filters[r]);
        }), !0);
    }(t, e) : void k();
}

var ee = /** @class */ function(e) {
    function n(t, n, r) {
        var i = this;
        return (i = e.call(this, t, n, r) || this).key = it.fromName(r.referenceValue), 
        i;
    }
    return t(n, e), n.prototype.matches = function(t) {
        var e = it.comparator(t.key, this.key);
        return this.matchesComparison(e);
    }, n;
}(Zt), ne = /** @class */ function(e) {
    function n(t, n) {
        var r = this;
        return (r = e.call(this, t, "in" /* Operator.IN */ , n) || this).keys = ie("in" /* Operator.IN */ , n), 
        r;
    }
    return t(n, e), n.prototype.matches = function(t) {
        return this.keys.some((function(e) {
            return e.isEqual(t.key);
        }));
    }, n;
}(Zt), re = /** @class */ function(e) {
    function n(t, n) {
        var r = this;
        return (r = e.call(this, t, "not-in" /* Operator.NOT_IN */ , n) || this).keys = ie("not-in" /* Operator.NOT_IN */ , n), 
        r;
    }
    return t(n, e), n.prototype.matches = function(t) {
        return !this.keys.some((function(e) {
            return e.isEqual(t.key);
        }));
    }, n;
}(Zt);

/** Filter that matches on key fields within an array. */ function ie(t, e) {
    var n;
    return ((null === (n = e.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((function(t) {
        return it.fromName(t.referenceValue);
    }));
}

/** A Filter that implements the array-contains operator. */ var oe = /** @class */ function(e) {
    function n(t, n) {
        return e.call(this, t, "array-contains" /* Operator.ARRAY_CONTAINS */ , n) || this;
    }
    return t(n, e), n.prototype.matches = function(t) {
        var e = t.data.field(this.field);
        return Kt(e) && Mt(e.arrayValue, this.value);
    }, n;
}(Zt), ae = /** @class */ function(e) {
    function n(t, n) {
        return e.call(this, t, "in" /* Operator.IN */ , n) || this;
    }
    return t(n, e), n.prototype.matches = function(t) {
        var e = t.data.field(this.field);
        return null !== e && Mt(this.value.arrayValue, e);
    }, n;
}(Zt), ue = /** @class */ function(e) {
    function n(t, n) {
        return e.call(this, t, "not-in" /* Operator.NOT_IN */ , n) || this;
    }
    return t(n, e), n.prototype.matches = function(t) {
        if (Mt(this.value.arrayValue, {
            nullValue: "NULL_VALUE"
        })) return !1;
        var e = t.data.field(this.field);
        return null !== e && !Mt(this.value.arrayValue, e);
    }, n;
}(Zt), se = /** @class */ function(e) {
    function n(t, n) {
        return e.call(this, t, "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ , n) || this;
    }
    return t(n, e), n.prototype.matches = function(t) {
        var e = this, n = t.data.field(this.field);
        return !(!Kt(n) || !n.arrayValue.values) && n.arrayValue.values.some((function(t) {
            return Mt(e.value.arrayValue, t);
        }));
    }, n;
}(Zt), ce = function(t, e /* Direction.ASCENDING */) {
    void 0 === e && (e = "asc"), this.field = t, this.dir = e;
};

/** A Filter that implements the IN operator. */ function le(t, e) {
    return t.dir === e.dir && t.field.isEqual(e.field);
}

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
 * A version of a document in Firestore. This corresponds to the version
 * timestamp, such as update_time or read_time.
 */ var fe = /** @class */ function() {
    function t(t) {
        this.timestamp = t;
    }
    return t.fromTimestamp = function(e) {
        return new t(e);
    }, t.min = function() {
        return new t(new Dt(0, 0));
    }, t.max = function() {
        return new t(new Dt(253402300799, 999999999));
    }, t.prototype.compareTo = function(t) {
        return this.timestamp._compareTo(t.timestamp);
    }, t.prototype.isEqual = function(t) {
        return this.timestamp.isEqual(t.timestamp);
    }, 
    /** Returns a number representation of the version for use in spec tests. */ t.prototype.toMicroseconds = function() {
        // Convert to microseconds.
        return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
    }, t.prototype.toString = function() {
        return "SnapshotVersion(" + this.timestamp.toString() + ")";
    }, t.prototype.toTimestamp = function() {
        return this.timestamp;
    }, t;
}(), he = /** @class */ function() {
    function t(t, e) {
        this.comparator = t, this.root = e || de.EMPTY;
    }
    // Returns a copy of the map, with the specified key/value added or replaced.
        return t.prototype.insert = function(e, n) {
        return new t(this.comparator, this.root.insert(e, n, this.comparator).copy(null, null, de.BLACK, null, null));
    }, 
    // Returns a copy of the map, with the specified key removed.
    t.prototype.remove = function(e) {
        return new t(this.comparator, this.root.remove(e, this.comparator).copy(null, null, de.BLACK, null, null));
    }, 
    // Returns the value of the node with the given key, or null.
    t.prototype.get = function(t) {
        for (var e = this.root; !e.isEmpty(); ) {
            var n = this.comparator(t, e.key);
            if (0 === n) return e.value;
            n < 0 ? e = e.left : n > 0 && (e = e.right);
        }
        return null;
    }, 
    // Returns the index of the element in this sorted map, or -1 if it doesn't
    // exist.
    t.prototype.indexOf = function(t) {
        for (
        // Number of nodes that were pruned when descending right
        var e = 0, n = this.root; !n.isEmpty(); ) {
            var r = this.comparator(t, n.key);
            if (0 === r) return e + n.left.size;
            r < 0 ? n = n.left : (
            // Count all nodes left of the node plus the node itself
            e += n.left.size + 1, n = n.right);
        }
        // Node not found
                return -1;
    }, t.prototype.isEmpty = function() {
        return this.root.isEmpty();
    }, Object.defineProperty(t.prototype, "size", {
        // Returns the total number of nodes in the map.
        get: function() {
            return this.root.size;
        },
        enumerable: !1,
        configurable: !0
    }), 
    // Returns the minimum key in the map.
    t.prototype.minKey = function() {
        return this.root.minKey();
    }, 
    // Returns the maximum key in the map.
    t.prototype.maxKey = function() {
        return this.root.maxKey();
    }, 
    // Traverses the map in key order and calls the specified action function
    // for each key/value pair. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    t.prototype.inorderTraversal = function(t) {
        return this.root.inorderTraversal(t);
    }, t.prototype.forEach = function(t) {
        this.inorderTraversal((function(e, n) {
            return t(e, n), !1;
        }));
    }, t.prototype.toString = function() {
        var t = [];
        return this.inorderTraversal((function(e, n) {
            return t.push("".concat(e, ":").concat(n)), !1;
        })), "{".concat(t.join(", "), "}");
    }, 
    // Traverses the map in reverse key order and calls the specified action
    // function for each key/value pair. If action returns true, traversal is
    // aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    t.prototype.reverseTraversal = function(t) {
        return this.root.reverseTraversal(t);
    }, 
    // Returns an iterator over the SortedMap.
    t.prototype.getIterator = function() {
        return new pe(this.root, null, this.comparator, !1);
    }, t.prototype.getIteratorFrom = function(t) {
        return new pe(this.root, t, this.comparator, !1);
    }, t.prototype.getReverseIterator = function() {
        return new pe(this.root, null, this.comparator, !0);
    }, t.prototype.getReverseIteratorFrom = function(t) {
        return new pe(this.root, t, this.comparator, !0);
    }, t;
}(), pe = /** @class */ function() {
    function t(t, e, n, r) {
        this.isReverse = r, this.nodeStack = [];
        for (var i = 1; !t.isEmpty(); ) if (i = e ? n(t.key, e) : 1, 
        // flip the comparison if we're going in reverse
        e && r && (i *= -1), i < 0) 
        // This node is less than our start key. ignore it
        t = this.isReverse ? t.left : t.right; else {
            if (0 === i) {
                // This node is exactly equal to our start key. Push it on the stack,
                // but stop iterating;
                this.nodeStack.push(t);
                break;
            }
            // This node is greater than our start key, add it to the stack and move
            // to the next one
                        this.nodeStack.push(t), t = this.isReverse ? t.right : t.left;
        }
    }
    return t.prototype.getNext = function() {
        var t = this.nodeStack.pop(), e = {
            key: t.key,
            value: t.value
        };
        if (this.isReverse) for (t = t.left; !t.isEmpty(); ) this.nodeStack.push(t), t = t.right; else for (t = t.right; !t.isEmpty(); ) this.nodeStack.push(t), 
        t = t.left;
        return e;
    }, t.prototype.hasNext = function() {
        return this.nodeStack.length > 0;
    }, t.prototype.peek = function() {
        if (0 === this.nodeStack.length) return null;
        var t = this.nodeStack[this.nodeStack.length - 1];
        return {
            key: t.key,
            value: t.value
        };
    }, t;
}(), de = /** @class */ function() {
    function t(e, n, r, i, o) {
        this.key = e, this.value = n, this.color = null != r ? r : t.RED, this.left = null != i ? i : t.EMPTY, 
        this.right = null != o ? o : t.EMPTY, this.size = this.left.size + 1 + this.right.size;
    }
    // Returns a copy of the current node, optionally replacing pieces of it.
        return t.prototype.copy = function(e, n, r, i, o) {
        return new t(null != e ? e : this.key, null != n ? n : this.value, null != r ? r : this.color, null != i ? i : this.left, null != o ? o : this.right);
    }, t.prototype.isEmpty = function() {
        return !1;
    }, 
    // Traverses the tree in key order and calls the specified action function
    // for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    t.prototype.inorderTraversal = function(t) {
        return this.left.inorderTraversal(t) || t(this.key, this.value) || this.right.inorderTraversal(t);
    }, 
    // Traverses the tree in reverse key order and calls the specified action
    // function for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    t.prototype.reverseTraversal = function(t) {
        return this.right.reverseTraversal(t) || t(this.key, this.value) || this.left.reverseTraversal(t);
    }, 
    // Returns the minimum node in the tree.
    t.prototype.min = function() {
        return this.left.isEmpty() ? this : this.left.min();
    }, 
    // Returns the maximum key in the tree.
    t.prototype.minKey = function() {
        return this.min().key;
    }, 
    // Returns the maximum key in the tree.
    t.prototype.maxKey = function() {
        return this.right.isEmpty() ? this.key : this.right.maxKey();
    }, 
    // Returns new tree, with the key/value added.
    t.prototype.insert = function(t, e, n) {
        var r = this, i = n(t, r.key);
        return (r = i < 0 ? r.copy(null, null, null, r.left.insert(t, e, n), null) : 0 === i ? r.copy(null, e, null, null, null) : r.copy(null, null, null, null, r.right.insert(t, e, n))).fixUp();
    }, t.prototype.removeMin = function() {
        if (this.left.isEmpty()) return t.EMPTY;
        var e = this;
        return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), (e = e.copy(null, null, null, e.left.removeMin(), null)).fixUp();
    }, 
    // Returns new tree, with the specified item removed.
    t.prototype.remove = function(e, n) {
        var r, i = this;
        if (n(e, i.key) < 0) i.left.isEmpty() || i.left.isRed() || i.left.left.isRed() || (i = i.moveRedLeft()), 
        i = i.copy(null, null, null, i.left.remove(e, n), null); else {
            if (i.left.isRed() && (i = i.rotateRight()), i.right.isEmpty() || i.right.isRed() || i.right.left.isRed() || (i = i.moveRedRight()), 
            0 === n(e, i.key)) {
                if (i.right.isEmpty()) return t.EMPTY;
                r = i.right.min(), i = i.copy(r.key, r.value, null, null, i.right.removeMin());
            }
            i = i.copy(null, null, null, null, i.right.remove(e, n));
        }
        return i.fixUp();
    }, t.prototype.isRed = function() {
        return this.color;
    }, 
    // Returns new tree after performing any needed rotations.
    t.prototype.fixUp = function() {
        var t = this;
        return t.right.isRed() && !t.left.isRed() && (t = t.rotateLeft()), t.left.isRed() && t.left.left.isRed() && (t = t.rotateRight()), 
        t.left.isRed() && t.right.isRed() && (t = t.colorFlip()), t;
    }, t.prototype.moveRedLeft = function() {
        var t = this.colorFlip();
        return t.right.left.isRed() && (t = (t = (t = t.copy(null, null, null, null, t.right.rotateRight())).rotateLeft()).colorFlip()), 
        t;
    }, t.prototype.moveRedRight = function() {
        var t = this.colorFlip();
        return t.left.left.isRed() && (t = (t = t.rotateRight()).colorFlip()), t;
    }, t.prototype.rotateLeft = function() {
        var e = this.copy(null, null, t.RED, null, this.right.left);
        return this.right.copy(null, null, this.color, e, null);
    }, t.prototype.rotateRight = function() {
        var e = this.copy(null, null, t.RED, this.left.right, null);
        return this.left.copy(null, null, this.color, null, e);
    }, t.prototype.colorFlip = function() {
        var t = this.left.copy(null, null, !this.left.color, null, null), e = this.right.copy(null, null, !this.right.color, null, null);
        return this.copy(null, null, !this.color, t, e);
    }, 
    // For testing.
    t.prototype.checkMaxDepth = function() {
        var t = this.check();
        return Math.pow(2, t) <= this.size + 1;
    }, 
    // In a balanced RB tree, the black-depth (number of black nodes) from root to
    // leaves is equal on both sides.  This function verifies that or asserts.
    t.prototype.check = function() {
        if (this.isRed() && this.left.isRed()) throw k();
        if (this.right.isRed()) throw k();
        var t = this.left.check();
        if (t !== this.right.check()) throw k();
        return t + (this.isRed() ? 0 : 1);
    }, t;
}();

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
// An immutable sorted map implementation, based on a Left-leaning Red-Black
// tree.
// end LLRBNode
// Empty node is shared between all LLRB trees.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
de.EMPTY = null, de.RED = !0, de.BLACK = !1, 
// end LLRBEmptyNode
de.EMPTY = new (/** @class */ function() {
    function t() {
        this.size = 0;
    }
    return Object.defineProperty(t.prototype, "key", {
        get: function() {
            throw k();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "value", {
        get: function() {
            throw k();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "color", {
        get: function() {
            throw k();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "left", {
        get: function() {
            throw k();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "right", {
        get: function() {
            throw k();
        },
        enumerable: !1,
        configurable: !0
    }), 
    // Returns a copy of the current node.
    t.prototype.copy = function(t, e, n, r, i) {
        return this;
    }, 
    // Returns a copy of the tree, with the specified key/value added.
    t.prototype.insert = function(t, e, n) {
        return new de(t, e);
    }, 
    // Returns a copy of the tree, with the specified key removed.
    t.prototype.remove = function(t, e) {
        return this;
    }, t.prototype.isEmpty = function() {
        return !0;
    }, t.prototype.inorderTraversal = function(t) {
        return !1;
    }, t.prototype.reverseTraversal = function(t) {
        return !1;
    }, t.prototype.minKey = function() {
        return null;
    }, t.prototype.maxKey = function() {
        return null;
    }, t.prototype.isRed = function() {
        return !1;
    }, 
    // For testing.
    t.prototype.checkMaxDepth = function() {
        return !0;
    }, t.prototype.check = function() {
        return 0;
    }, t;
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
 * SortedSet is an immutable (copy-on-write) collection that holds elements
 * in order specified by the provided comparator.
 *
 * NOTE: if provided comparator returns 0 for two elements, we consider them to
 * be equal!
 */
var ye = /** @class */ function() {
    function t(t) {
        this.comparator = t, this.data = new he(this.comparator);
    }
    return t.prototype.has = function(t) {
        return null !== this.data.get(t);
    }, t.prototype.first = function() {
        return this.data.minKey();
    }, t.prototype.last = function() {
        return this.data.maxKey();
    }, Object.defineProperty(t.prototype, "size", {
        get: function() {
            return this.data.size;
        },
        enumerable: !1,
        configurable: !0
    }), t.prototype.indexOf = function(t) {
        return this.data.indexOf(t);
    }, 
    /** Iterates elements in order defined by "comparator" */ t.prototype.forEach = function(t) {
        this.data.inorderTraversal((function(e, n) {
            return t(e), !1;
        }));
    }, 
    /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */ t.prototype.forEachInRange = function(t, e) {
        for (var n = this.data.getIteratorFrom(t[0]); n.hasNext(); ) {
            var r = n.getNext();
            if (this.comparator(r.key, t[1]) >= 0) return;
            e(r.key);
        }
    }, 
    /**
     * Iterates over `elem`s such that: start &lt;= elem until false is returned.
     */
    t.prototype.forEachWhile = function(t, e) {
        var n;
        for (n = void 0 !== e ? this.data.getIteratorFrom(e) : this.data.getIterator(); n.hasNext(); ) if (!t(n.getNext().key)) return;
    }, 
    /** Finds the least element greater than or equal to `elem`. */ t.prototype.firstAfterOrEqual = function(t) {
        var e = this.data.getIteratorFrom(t);
        return e.hasNext() ? e.getNext().key : null;
    }, t.prototype.getIterator = function() {
        return new me(this.data.getIterator());
    }, t.prototype.getIteratorFrom = function(t) {
        return new me(this.data.getIteratorFrom(t));
    }, 
    /** Inserts or updates an element */ t.prototype.add = function(t) {
        return this.copy(this.data.remove(t).insert(t, !0));
    }, 
    /** Deletes an element */ t.prototype.delete = function(t) {
        return this.has(t) ? this.copy(this.data.remove(t)) : this;
    }, t.prototype.isEmpty = function() {
        return this.data.isEmpty();
    }, t.prototype.unionWith = function(t) {
        var e = this;
        // Make sure `result` always refers to the larger one of the two sets.
                return e.size < t.size && (e = t, t = this), t.forEach((function(t) {
            e = e.add(t);
        })), e;
    }, t.prototype.isEqual = function(e) {
        if (!(e instanceof t)) return !1;
        if (this.size !== e.size) return !1;
        for (var n = this.data.getIterator(), r = e.data.getIterator(); n.hasNext(); ) {
            var i = n.getNext().key, o = r.getNext().key;
            if (0 !== this.comparator(i, o)) return !1;
        }
        return !0;
    }, t.prototype.toArray = function() {
        var t = [];
        return this.forEach((function(e) {
            t.push(e);
        })), t;
    }, t.prototype.toString = function() {
        var t = [];
        return this.forEach((function(e) {
            return t.push(e);
        })), "SortedSet(" + t.toString() + ")";
    }, t.prototype.copy = function(e) {
        var n = new t(this.comparator);
        return n.data = e, n;
    }, t;
}(), me = /** @class */ function() {
    function t(t) {
        this.iter = t;
    }
    return t.prototype.getNext = function() {
        return this.iter.getNext().key;
    }, t.prototype.hasNext = function() {
        return this.iter.hasNext();
    }, t;
}(), ve = /** @class */ function() {
    function t(t) {
        this.fields = t, 
        // TODO(dimond): validation of FieldMask
        // Sort the field mask to support `FieldMask.isEqual()` and assert below.
        t.sort(rt.comparator);
    }
    return t.empty = function() {
        return new t([]);
    }, 
    /**
     * Returns a new FieldMask object that is the result of adding all the given
     * fields paths to this field mask.
     */
    t.prototype.unionWith = function(e) {
        for (var n = new ye(rt.comparator), r = 0, i = this.fields; r < i.length; r++) {
            var o = i[r];
            n = n.add(o);
        }
        for (var a = 0, u = e; a < u.length; a++) {
            var s = u[a];
            n = n.add(s);
        }
        return new t(n.toArray());
    }, 
    /**
     * Verifies that `fieldPath` is included by at least one field in this field
     * mask.
     *
     * This is an O(n) operation, where `n` is the size of the field mask.
     */
    t.prototype.covers = function(t) {
        for (var e = 0, n = this.fields; e < n.length; e++) {
            if (n[e].isPrefixOf(t)) return !0;
        }
        return !1;
    }, t.prototype.isEqual = function(t) {
        return St(this.fields, t.fields, (function(t, e) {
            return t.isEqual(e);
        }));
    }, t;
}(), ge = /** @class */ function() {
    function t(t) {
        this.value = t;
    }
    return t.empty = function() {
        return new t({
            mapValue: {}
        });
    }, 
    /**
     * Returns the value at the given path or null.
     *
     * @param path - the path to search
     * @returns The value at the path or null if the path is not set.
     */
    t.prototype.field = function(t) {
        if (t.isEmpty()) return this.value;
        for (var e = this.value, n = 0; n < t.length - 1; ++n) if (!Wt(e = (e.mapValue.fields || {})[t.get(n)])) return null;
        return (e = (e.mapValue.fields || {})[t.lastSegment()]) || null;
    }, 
    /**
     * Sets the field to the provided value.
     *
     * @param path - The field path to set.
     * @param value - The value to set.
     */
    t.prototype.set = function(t, e) {
        this.getFieldsMap(t.popLast())[t.lastSegment()] = Yt(e);
    }, 
    /**
     * Sets the provided fields to the provided values.
     *
     * @param data - A map of fields to values (or null for deletes).
     */
    t.prototype.setAll = function(t) {
        var e = this, n = rt.emptyPath(), r = {}, i = [];
        t.forEach((function(t, o) {
            if (!n.isImmediateParentOf(o)) {
                // Insert the accumulated changes at this parent location
                var a = e.getFieldsMap(n);
                e.applyChanges(a, r, i), r = {}, i = [], n = o.popLast();
            }
            t ? r[o.lastSegment()] = Yt(t) : i.push(o.lastSegment());
        }));
        var o = this.getFieldsMap(n);
        this.applyChanges(o, r, i);
    }, 
    /**
     * Removes the field at the specified path. If there is no field at the
     * specified path, nothing is changed.
     *
     * @param path - The field path to remove.
     */
    t.prototype.delete = function(t) {
        var e = this.field(t.popLast());
        Wt(e) && e.mapValue.fields && delete e.mapValue.fields[t.lastSegment()];
    }, t.prototype.isEqual = function(t) {
        return jt(this.value, t.value);
    }, 
    /**
     * Returns the map that contains the leaf element of `path`. If the parent
     * entry does not yet exist, or if it is not a map, a new map will be created.
     */
    t.prototype.getFieldsMap = function(t) {
        var e = this.value;
        e.mapValue.fields || (e.mapValue = {
            fields: {}
        });
        for (var n = 0; n < t.length; ++n) {
            var r = e.mapValue.fields[t.get(n)];
            Wt(r) && r.mapValue.fields || (r = {
                mapValue: {
                    fields: {}
                }
            }, e.mapValue.fields[t.get(n)] = r), e = r;
        }
        return e.mapValue.fields;
    }, 
    /**
     * Modifies `fieldsMap` by adding, replacing or deleting the specified
     * entries.
     */
    t.prototype.applyChanges = function(t, e, n) {
        It(e, (function(e, n) {
            return t[e] = n;
        }));
        for (var r = 0, i = n; r < i.length; r++) {
            var o = i[r];
            delete t[o];
        }
    }, t.prototype.clone = function() {
        return new t(Yt(this.value));
    }, t;
}(), we = /** @class */ function() {
    function t(t, e, n, r, i, o, a) {
        this.key = t, this.documentType = e, this.version = n, this.readTime = r, this.createTime = i, 
        this.data = o, this.documentState = a
        /**
     * Creates a document with no known version or data, but which can serve as
     * base document for mutations.
     */;
    }
    return t.newInvalidDocument = function(e) {
        return new t(e, 0 /* DocumentType.INVALID */ , 
        /* version */ fe.min(), 
        /* readTime */ fe.min(), 
        /* createTime */ fe.min(), ge.empty(), 0 /* DocumentState.SYNCED */);
    }, 
    /**
     * Creates a new document that is known to exist with the given data at the
     * given version.
     */
    t.newFoundDocument = function(e, n, r, i) {
        return new t(e, 1 /* DocumentType.FOUND_DOCUMENT */ , 
        /* version */ n, 
        /* readTime */ fe.min(), 
        /* createTime */ r, i, 0 /* DocumentState.SYNCED */);
    }, 
    /** Creates a new document that is known to not exist at the given version. */ t.newNoDocument = function(e, n) {
        return new t(e, 2 /* DocumentType.NO_DOCUMENT */ , 
        /* version */ n, 
        /* readTime */ fe.min(), 
        /* createTime */ fe.min(), ge.empty(), 0 /* DocumentState.SYNCED */);
    }, 
    /**
     * Creates a new document that is known to exist at the given version but
     * whose data is not known (e.g. a document that was updated without a known
     * base document).
     */
    t.newUnknownDocument = function(e, n) {
        return new t(e, 3 /* DocumentType.UNKNOWN_DOCUMENT */ , 
        /* version */ n, 
        /* readTime */ fe.min(), 
        /* createTime */ fe.min(), ge.empty(), 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */);
    }, 
    /**
     * Changes the document type to indicate that it exists and that its version
     * and data are known.
     */
    t.prototype.convertToFoundDocument = function(t, e) {
        // If a document is switching state from being an invalid or deleted
        // document to a valid (FOUND_DOCUMENT) document, either due to receiving an
        // update from Watch or due to applying a local set mutation on top
        // of a deleted document, our best guess about its createTime would be the
        // version at which the document transitioned to a FOUND_DOCUMENT.
        return !this.createTime.isEqual(fe.min()) || 2 /* DocumentType.NO_DOCUMENT */ !== this.documentType && 0 /* DocumentType.INVALID */ !== this.documentType || (this.createTime = t), 
        this.version = t, this.documentType = 1 /* DocumentType.FOUND_DOCUMENT */ , this.data = e, 
        this.documentState = 0 /* DocumentState.SYNCED */ , this;
    }, 
    /**
     * Changes the document type to indicate that it doesn't exist at the given
     * version.
     */
    t.prototype.convertToNoDocument = function(t) {
        return this.version = t, this.documentType = 2 /* DocumentType.NO_DOCUMENT */ , 
        this.data = ge.empty(), this.documentState = 0 /* DocumentState.SYNCED */ , this;
    }, 
    /**
     * Changes the document type to indicate that it exists at a given version but
     * that its data is not known (e.g. a document that was updated without a known
     * base document).
     */
    t.prototype.convertToUnknownDocument = function(t) {
        return this.version = t, this.documentType = 3 /* DocumentType.UNKNOWN_DOCUMENT */ , 
        this.data = ge.empty(), this.documentState = 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ , 
        this;
    }, t.prototype.setHasCommittedMutations = function() {
        return this.documentState = 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ , this;
    }, t.prototype.setHasLocalMutations = function() {
        return this.documentState = 1 /* DocumentState.HAS_LOCAL_MUTATIONS */ , this.version = fe.min(), 
        this;
    }, t.prototype.setReadTime = function(t) {
        return this.readTime = t, this;
    }, Object.defineProperty(t.prototype, "hasLocalMutations", {
        get: function() {
            return 1 /* DocumentState.HAS_LOCAL_MUTATIONS */ === this.documentState;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "hasCommittedMutations", {
        get: function() {
            return 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ === this.documentState;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "hasPendingWrites", {
        get: function() {
            return this.hasLocalMutations || this.hasCommittedMutations;
        },
        enumerable: !1,
        configurable: !0
    }), t.prototype.isValidDocument = function() {
        return 0 /* DocumentType.INVALID */ !== this.documentType;
    }, t.prototype.isFoundDocument = function() {
        return 1 /* DocumentType.FOUND_DOCUMENT */ === this.documentType;
    }, t.prototype.isNoDocument = function() {
        return 2 /* DocumentType.NO_DOCUMENT */ === this.documentType;
    }, t.prototype.isUnknownDocument = function() {
        return 3 /* DocumentType.UNKNOWN_DOCUMENT */ === this.documentType;
    }, t.prototype.isEqual = function(e) {
        return e instanceof t && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
    }, t.prototype.mutableCopy = function() {
        return new t(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
    }, t.prototype.toString = function() {
        return "Document(".concat(this.key, ", ").concat(this.version, ", ").concat(JSON.stringify(this.data.value), ", {createTime: ").concat(this.createTime, "}), {documentType: ").concat(this.documentType, "}), {documentState: ").concat(this.documentState, "})");
    }, t;
}(), be = function(t, e, n, r, i, o, a) {
    void 0 === e && (e = null), void 0 === n && (n = []), void 0 === r && (r = []), 
    void 0 === i && (i = null), void 0 === o && (o = null), void 0 === a && (a = null), 
    this.path = t, this.collectionGroup = e, this.orderBy = n, this.filters = r, this.limit = i, 
    this.startAt = o, this.endAt = a, this.C = null;
};

/**
 * Initializes a Target with a path and optional additional query constraints.
 * Path must currently be empty if this is a collection group query.
 *
 * NOTE: you should always construct `Target` from `Query.toTarget` instead of
 * using this factory method, because `Query` provides an implicit `orderBy`
 * property.
 */
function _e(t, e, n, r, i, o, a) {
    return void 0 === e && (e = null), void 0 === n && (n = []), void 0 === r && (r = []), 
    void 0 === i && (i = null), void 0 === o && (o = null), void 0 === a && (a = null), 
    new be(t, e, n, r, i, o, a);
}

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
 * Query encapsulates all the query attributes we support in the SDK. It can
 * be run against the LocalStore, as well as be converted to a `Target` to
 * query the RemoteStore results.
 *
 * Visible for testing.
 */ var Te = 
/**
     * Initializes a Query with a path and optional additional query constraints.
     * Path must currently be empty if this is a collection group query.
     */
function(t, e, n, r, i, o /* LimitType.First */ , a, u) {
    void 0 === e && (e = null), void 0 === n && (n = []), void 0 === r && (r = []), 
    void 0 === i && (i = null), void 0 === o && (o = "F"), void 0 === a && (a = null), 
    void 0 === u && (u = null), this.path = t, this.collectionGroup = e, this.explicitOrderBy = n, 
    this.filters = r, this.limit = i, this.limitType = o, this.startAt = a, this.endAt = u, 
    this.S = null, 
    // The corresponding `Target` of this `Query` instance, for use with
    // non-aggregate queries.
    this.N = null, 
    // The corresponding `Target` of this `Query` instance, for use with
    // aggregate queries. Unlike targets for non-aggregate queries,
    // aggregate query targets do not contain normalized order-bys, they only
    // contain explicit order-bys.
    this.O = null, this.startAt, this.endAt;
};

/** Creates a new Query for a query that matches all documents at `path` */
/**
 * Returns whether the query matches a collection group rather than a specific
 * collection.
 */ function Ee(t) {
    return null !== t.collectionGroup;
}

/**
 * Returns the normalized order-by constraint that is used to execute the Query,
 * which can be different from the order-by constraints the user provided (e.g.
 * the SDK and backend always orders by `__name__`). The normalized order-by
 * includes implicit order-bys in addition to the explicit user provided
 * order-bys.
 */ function Se(t) {
    var e = A(t);
    if (null === e.S) {
        e.S = [];
        // Any explicit order by fields should be added as is.
        for (var n = new Set, r = 0, i = e.explicitOrderBy; r < i.length; r++) {
            var o = i[r];
            e.S.push(o), n.add(o.field.canonicalString());
        }
        // The order of the implicit ordering always matches the last explicit order by.
                var a = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc" /* Direction.ASCENDING */ , u = 
        // Returns the sorted set of inequality filter fields used in this query.
        function(t) {
            var e = new ye(rt.comparator);
            return t.filters.forEach((function(t) {
                t.getFlattenedFilters().forEach((function(t) {
                    t.isInequality() && (e = e.add(t.field));
                }));
            })), e;
        }(e);
        // Any inequality fields not explicitly ordered should be implicitly ordered in a lexicographical
        // order. When there are multiple inequality filters on the same field, the field should be added
        // only once.
        // Note: `SortedSet<FieldPath>` sorts the key field before other fields. However, we want the key
        // field to be sorted last.
                u.forEach((function(t) {
            n.has(t.canonicalString()) || t.isKeyField() || e.S.push(new ce(t, a));
        })), 
        // Add the document key field to the last if it is not explicitly ordered.
        n.has(rt.keyField().canonicalString()) || e.S.push(new ce(rt.keyField(), a));
    }
    return e.S;
}

/**
 * Converts this `Query` instance to its corresponding `Target` representation.
 */ function ke(t) {
    var e = A(t);
    return e.N || (e.N = Ie(e, Se(t))), e.N
    /**
 * Converts this `Query` instance to its corresponding `Target` representation,
 * for use within an aggregate query. Unlike targets for non-aggregate queries,
 * aggregate query targets do not contain normalized order-bys, they only
 * contain explicit order-bys.
 */;
}

function Ie(t, e) {
    if ("F" /* LimitType.First */ === t.limitType) return _e(t.path, t.collectionGroup, e, t.filters, t.limit, t.startAt, t.endAt);
    // Flip the orderBy directions since we want the last results
    e = e.map((function(t) {
        var e = "desc" /* Direction.DESCENDING */ === t.dir ? "asc" /* Direction.ASCENDING */ : "desc" /* Direction.DESCENDING */;
        return new ce(t.field, e);
    }));
    // We need to swap the cursors to match the now-flipped query ordering.
    var n = t.endAt ? new Ht(t.endAt.position, t.endAt.inclusive) : null, r = t.startAt ? new Ht(t.startAt.position, t.startAt.inclusive) : null;
    // Now return as a LimitType.First query.
        return _e(t.path, t.collectionGroup, e, t.filters, t.limit, n, r);
}

function Ae(t, e) {
    var n = t.filters.concat([ e ]);
    return new Te(t.path, t.collectionGroup, t.explicitOrderBy.slice(), n, t.limit, t.limitType, t.startAt, t.endAt);
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
 * Returns an DoubleValue for `value` that is encoded based the serializer's
 * `useProto3Json` setting.
 */
/**
 * Returns a value for a number that's appropriate to put into a proto.
 * The return value is an IntegerValue if it can safely represent the value,
 * otherwise a DoubleValue is returned.
 */
function Pe(t, e) {
    return function(t) {
        return "number" == typeof t && Number.isInteger(t) && !dt(t) && t <= Number.MAX_SAFE_INTEGER && t >= Number.MIN_SAFE_INTEGER;
    }(e) ? 
    /**
     * Returns an IntegerValue for `value`.
     */
    function(t) {
        return {
            integerValue: "" + t
        };
    }(e) : function(t, e) {
        if (t.useProto3Json) {
            if (isNaN(e)) return {
                doubleValue: "NaN"
            };
            if (e === 1 / 0) return {
                doubleValue: "Infinity"
            };
            if (e === -1 / 0) return {
                doubleValue: "-Infinity"
            };
        }
        return {
            doubleValue: dt(e) ? "-0" : e
        };
    }(t, e);
}

/**
 * @license
 * Copyright 2018 Google LLC
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
/** Used to represent a field transform on a mutation. */ var Ve = function() {
    // Make sure that the structural type of `TransformOperation` is unique.
    // See https://github.com/microsoft/TypeScript/issues/5451
    this._ = void 0;
}, Fe = /** @class */ function(e) {
    function n() {
        return null !== e && e.apply(this, arguments) || this;
    }
    return t(n, e), n;
}(Ve), Oe = /** @class */ function(e) {
    function n(t) {
        var n = this;
        return (n = e.call(this) || this).elements = t, n;
    }
    return t(n, e), n;
}(Ve), Ne = /** @class */ function(e) {
    function n(t) {
        var n = this;
        return (n = e.call(this) || this).elements = t, n;
    }
    return t(n, e), n;
}(Ve), De = /** @class */ function(e) {
    function n(t, n) {
        var r = this;
        return (r = e.call(this) || this).serializer = t, r.q = n, r;
    }
    return t(n, e), n;
}(Ve), Re = function(t, e) {
    this.field = t, this.transform = e;
}, qe = /** @class */ function() {
    function t(t, e) {
        this.updateTime = t, this.exists = e
        /** Creates a new empty Precondition. */;
    }
    return t.none = function() {
        return new t;
    }, 
    /** Creates a new Precondition with an exists flag. */ t.exists = function(e) {
        return new t(void 0, e);
    }, 
    /** Creates a new Precondition based on a version a document exists at. */ t.updateTime = function(e) {
        return new t(e);
    }, Object.defineProperty(t.prototype, "isNone", {
        /** Returns whether this Precondition is empty. */ get: function() {
            return void 0 === this.updateTime && void 0 === this.exists;
        },
        enumerable: !1,
        configurable: !0
    }), t.prototype.isEqual = function(t) {
        return this.exists === t.exists && (this.updateTime ? !!t.updateTime && this.updateTime.isEqual(t.updateTime) : !t.updateTime);
    }, t;
}(), xe = function() {}, Ce = /** @class */ function(e) {
    function n(t, n, r, i) {
        void 0 === i && (i = []);
        var o = this;
        return (o = e.call(this) || this).key = t, o.value = n, o.precondition = r, o.fieldTransforms = i, 
        o.type = 0 /* MutationType.Set */ , o;
    }
    return t(n, e), n.prototype.getFieldMask = function() {
        return null;
    }, n;
}(xe), Le = /** @class */ function(e) {
    function n(t, n, r, i, o) {
        void 0 === o && (o = []);
        var a = this;
        return (a = e.call(this) || this).key = t, a.data = n, a.fieldMask = r, a.precondition = i, 
        a.fieldTransforms = o, a.type = 1 /* MutationType.Patch */ , a;
    }
    return t(n, e), n.prototype.getFieldMask = function() {
        return this.fieldMask;
    }, n;
}(xe), je = /** @class */ function(e) {
    function n(t, n) {
        var r = this;
        return (r = e.call(this) || this).key = t, r.precondition = n, r.type = 2 /* MutationType.Delete */ , 
        r.fieldTransforms = [], r;
    }
    return t(n, e), n.prototype.getFieldMask = function() {
        return null;
    }, n;
}(xe), Me = /** @class */ function(e) {
    function n(t, n) {
        var r = this;
        return (r = e.call(this) || this).key = t, r.precondition = n, r.type = 3 /* MutationType.Verify */ , 
        r.fieldTransforms = [], r;
    }
    return t(n, e), n.prototype.getFieldMask = function() {
        return null;
    }, n;
}(xe), Ue = {
    asc: "ASCENDING",
    desc: "DESCENDING"
}, Be = {
    "<": "LESS_THAN",
    "<=": "LESS_THAN_OR_EQUAL",
    ">": "GREATER_THAN",
    ">=": "GREATER_THAN_OR_EQUAL",
    "==": "EQUAL",
    "!=": "NOT_EQUAL",
    "array-contains": "ARRAY_CONTAINS",
    in: "IN",
    "not-in": "NOT_IN",
    "array-contains-any": "ARRAY_CONTAINS_ANY"
}, ze = {
    and: "AND",
    or: "OR"
}, Ke = function(t, e) {
    this.databaseId = t, this.useProto3Json = e;
};

/** Transforms a value into a server-generated timestamp. */
/**
 * Returns a value for a number (or null) that's appropriate to put into
 * a google.protobuf.Int32Value proto.
 * DO NOT USE THIS FOR ANYTHING ELSE.
 * This method cheats. It's typed as returning "number" because that's what
 * our generated proto interfaces say Int32Value must be. But GRPC actually
 * expects a { value: <number> } struct.
 */
/**
 * Returns a value for a Date that's appropriate to put into a proto.
 */
function Ge(t, e) {
    return t.useProto3Json ? "".concat(new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", ""), ".").concat(("000000000" + e.nanoseconds).slice(-9), "Z") : {
        seconds: "" + e.seconds,
        nanos: e.nanoseconds
    };
}

/**
 * Returns a value for bytes that's appropriate to put in a proto.
 *
 * Visible for testing.
 */ function Qe(t, e) {
    return t.useProto3Json ? e.toBase64() : e.toUint8Array();
}

function We(t, e) {
    return Ge(t, e.toTimestamp());
}

function Ye(t) {
    return I(!!t), fe.fromTimestamp(function(t) {
        var e = Ft(t);
        return new Dt(e.seconds, e.nanos);
    }(t));
}

function He(t, e) {
    return function(t) {
        return new et([ "projects", t.projectId, "databases", t.database ]);
    }(t).child("documents").child(e).canonicalString();
}

function Je(t, e) {
    return He(t.databaseId, e.path);
}

function Xe(t, e) {
    var n = function(t) {
        var e = et.fromString(t);
        return I(cn(e)), e;
    }(e);
    if (n.get(1) !== t.databaseId.projectId) throw new B(F, "Tried to deserialize key from different project: " + n.get(1) + " vs " + t.databaseId.projectId);
    if (n.get(3) !== t.databaseId.database) throw new B(F, "Tried to deserialize key from different database: " + n.get(3) + " vs " + t.databaseId.database);
    return new it(function(t) {
        return I(t.length > 4 && "documents" === t.get(4)), t.popFirst(5);
    }(n));
}

function Ze(t, e) {
    return He(t.databaseId, e);
}

function $e(t) {
    return new et([ "projects", t.databaseId.projectId, "databases", t.databaseId.database ]).canonicalString();
}

function tn(t, e, n) {
    return {
        name: Je(t, e),
        fields: n.value.mapValue.fields
    };
}

function en(t, e) {
    // Dissect the path into parent, collectionId, and optional key filter.
    var n = {
        structuredQuery: {}
    }, r = e.path;
    null !== e.collectionGroup ? (n.parent = Ze(t, r), n.structuredQuery.from = [ {
        collectionId: e.collectionGroup,
        allDescendants: !0
    } ]) : (n.parent = Ze(t, r.popLast()), n.structuredQuery.from = [ {
        collectionId: r.lastSegment()
    } ]);
    var i = function(t) {
        if (0 !== t.length) return un($t.create(t, "and" /* CompositeOperator.AND */));
    }(e.filters);
    i && (n.structuredQuery.where = i);
    var o = function(t) {
        if (0 !== t.length) return t.map((function(t) {
            // visible for testing
            return function(t) {
                return {
                    field: an(t.field),
                    direction: nn(t.dir)
                };
            }(t);
        }));
    }(e.orderBy);
    o && (n.structuredQuery.orderBy = o);
    var a = function(t, e) {
        return t.useProto3Json || pt(e) ? e : {
            value: e
        };
    }(t, e.limit);
    return null !== a && (n.structuredQuery.limit = a), e.startAt && (n.structuredQuery.startAt = function(t) {
        return {
            before: t.inclusive,
            values: t.position
        };
    }(e.startAt)), e.endAt && (n.structuredQuery.endAt = function(t) {
        return {
            before: !t.inclusive,
            values: t.position
        };
    }(e.endAt)), n;
}

function nn(t) {
    return Ue[t];
}

// visible for testing
function rn(t) {
    return Be[t];
}

function on(t) {
    return ze[t];
}

function an(t) {
    return {
        fieldPath: t.canonicalString()
    };
}

function un(t) {
    return t instanceof Zt ? function(t) {
        if ("==" /* Operator.EQUAL */ === t.op) {
            if (Qt(t.value)) return {
                unaryFilter: {
                    field: an(t.field),
                    op: "IS_NAN"
                }
            };
            if (Gt(t.value)) return {
                unaryFilter: {
                    field: an(t.field),
                    op: "IS_NULL"
                }
            };
        } else if ("!=" /* Operator.NOT_EQUAL */ === t.op) {
            if (Qt(t.value)) return {
                unaryFilter: {
                    field: an(t.field),
                    op: "IS_NOT_NAN"
                }
            };
            if (Gt(t.value)) return {
                unaryFilter: {
                    field: an(t.field),
                    op: "IS_NOT_NULL"
                }
            };
        }
        return {
            fieldFilter: {
                field: an(t.field),
                op: rn(t.op),
                value: t.value
            }
        };
    }(t) : t instanceof $t ? function(t) {
        var e = t.getFilters().map((function(t) {
            return un(t);
        }));
        return 1 === e.length ? e[0] : {
            compositeFilter: {
                op: on(t.op),
                filters: e
            }
        };
    }(t) : k();
}

function sn(t) {
    var e = [];
    return t.fields.forEach((function(t) {
        return e.push(t.canonicalString());
    })), {
        fieldPaths: e
    };
}

function cn(t) {
    // Resource names have at least 4 components (project ID, database ID)
    return t.length >= 4 && "projects" === t.get(0) && "databases" === t.get(2);
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
 */ function ln(t) {
    return new Ke(t, /* useProto3Json= */ !0);
}

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
 * A helper for running delayed tasks following an exponential backoff curve
 * between attempts.
 *
 * Each delay is made up of a "base" delay which follows the exponential
 * backoff curve, and a +/- 50% "jitter" that is calculated and added to the
 * base delay. This prevents clients from accidentally synchronizing their
 * delays causing spikes of load to the backend.
 */ var fn = /** @class */ function() {
    function t(
    /**
     * The AsyncQueue to run backoff operations on.
     */
    t, 
    /**
     * The ID to use when scheduling backoff operations on the AsyncQueue.
     */
    e, 
    /**
     * The initial delay (used as the base delay on the first retry attempt).
     * Note that jitter will still be applied, so the actual delay could be as
     * little as 0.5*initialDelayMs.
     */
    n
    /**
     * The multiplier to use to determine the extended base delay after each
     * attempt.
     */ , r
    /**
     * The maximum base delay after which no further backoff is performed.
     * Note that jitter will still be applied, so the actual delay could be as
     * much as 1.5*maxDelayMs.
     */ , i) {
        void 0 === n && (n = 1e3), void 0 === r && (r = 1.5), void 0 === i && (i = 6e4), 
        this.B = t, this.timerId = e, this.$ = n, this.L = r, this.M = i, this.k = 0, this.U = null, 
        /** The last backoff attempt, as epoch milliseconds. */
        this.j = Date.now(), this.reset();
    }
    /**
     * Resets the backoff delay.
     *
     * The very next backoffAndWait() will have no delay. If it is called again
     * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
     * subsequent ones will increase according to the backoffFactor.
     */    return t.prototype.reset = function() {
        this.k = 0;
    }, 
    /**
     * Resets the backoff delay to the maximum delay (e.g. for use after a
     * RESOURCE_EXHAUSTED error).
     */
    t.prototype.W = function() {
        this.k = this.M;
    }, 
    /**
     * Returns a promise that resolves after currentDelayMs, and increases the
     * delay for any subsequent attempts. If there was a pending backoff operation
     * already, it will be canceled.
     */
    t.prototype.K = function(t) {
        var e = this;
        // Cancel any pending backoff operation.
                this.cancel();
        // First schedule using the current base (which may be 0 and should be
        // honored as such).
        var n = Math.floor(this.k + this.G()), r = Math.max(0, Date.now() - this.j), i = Math.max(0, n - r);
        // Guard against lastAttemptTime being in the future due to a clock change.
                i > 0 && _("ExponentialBackoff", "Backing off for ".concat(i, " ms (base delay: ").concat(this.k, " ms, delay with jitter: ").concat(n, " ms, last attempt: ").concat(r, " ms ago)")), 
        this.U = this.B.enqueueAfterDelay(this.timerId, i, (function() {
            return e.j = Date.now(), t();
        })), 
        // Apply backoff factor to determine next delay and ensure it is within
        // bounds.
        this.k *= this.L, this.k < this.$ && (this.k = this.$), this.k > this.M && (this.k = this.M);
    }, t.prototype.H = function() {
        null !== this.U && (this.U.skipDelay(), this.U = null);
    }, t.prototype.cancel = function() {
        null !== this.U && (this.U.cancel(), this.U = null);
    }, 
    /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */ t.prototype.G = function() {
        return (Math.random() - .5) * this.k;
    }, t;
}(), hn = /** @class */ function(e) {
    function n(t, n, r, i) {
        var o = this;
        return (o = e.call(this) || this).authCredentials = t, o.appCheckCredentials = n, 
        o.connection = r, o.serializer = i, o.J = !1, o;
    }
    return t(n, e), n.prototype.Y = function() {
        if (this.J) throw new B(x, "The client has already been terminated.");
    }, 
    /** Invokes the provided RPC with auth and AppCheck tokens. */ n.prototype.R = function(t, e, n) {
        var r = this;
        return this.Y(), Promise.all([ this.authCredentials.getToken(), this.appCheckCredentials.getToken() ]).then((function(i) {
            var o = i[0], a = i[1];
            return r.connection.R(t, e, n, o, a);
        })).catch((function(t) {
            throw "FirebaseError" === t.name ? (t.code === R && (r.authCredentials.invalidateToken(), 
            r.appCheckCredentials.invalidateToken()), t) : new B(V, t.toString());
        }));
    }, 
    /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */ n.prototype.g = function(t, e, n, r) {
        var i = this;
        return this.Y(), Promise.all([ this.authCredentials.getToken(), this.appCheckCredentials.getToken() ]).then((function(o) {
            var a = o[0], u = o[1];
            return i.connection.g(t, e, n, a, u, r);
        })).catch((function(t) {
            throw "FirebaseError" === t.name ? (t.code === R && (i.authCredentials.invalidateToken(), 
            i.appCheckCredentials.invalidateToken()), t) : new B(V, t.toString());
        }));
    }, n.prototype.terminate = function() {
        this.J = !0;
    }, n;
}((function() {}));

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
 * Datastore and its related methods are a wrapper around the external Google
 * Cloud Datastore grpc API, which provides an interface that is more convenient
 * for the rest of the client SDK architecture to consume.
 */
/**
 * An implementation of Datastore that exposes additional state for internal
 * consumption.
 */
// TODO(firestorexp): Make sure there is only one Datastore instance per
// firestore-exp client.
function pn(t, r) {
    return e(this, void 0, void 0, (function() {
        var e, i, o;
        return n(this, (function(n) {
            switch (n.label) {
              case 0:
                return e = A(t), i = $e(e.serializer) + "/documents", o = {
                    writes: r.map((function(t) {
                        return function(t, e) {
                            var n;
                            if (e instanceof Ce) n = {
                                update: tn(t, e.key, e.value)
                            }; else if (e instanceof je) n = {
                                delete: Je(t, e.key)
                            }; else if (e instanceof Le) n = {
                                update: tn(t, e.key, e.data),
                                updateMask: sn(e.fieldMask)
                            }; else {
                                if (!(e instanceof Me)) return k();
                                n = {
                                    verify: Je(t, e.key)
                                };
                            }
                            return e.fieldTransforms.length > 0 && (n.updateTransforms = e.fieldTransforms.map((function(t) {
                                return function(t, e) {
                                    var n = e.transform;
                                    if (n instanceof Fe) return {
                                        fieldPath: e.field.canonicalString(),
                                        setToServerValue: "REQUEST_TIME"
                                    };
                                    if (n instanceof Oe) return {
                                        fieldPath: e.field.canonicalString(),
                                        appendMissingElements: {
                                            values: n.elements
                                        }
                                    };
                                    if (n instanceof Ne) return {
                                        fieldPath: e.field.canonicalString(),
                                        removeAllFromArray: {
                                            values: n.elements
                                        }
                                    };
                                    if (n instanceof De) return {
                                        fieldPath: e.field.canonicalString(),
                                        increment: n.q
                                    };
                                    throw k();
                                }(0, t);
                            }))), e.precondition.isNone || (n.currentDocument = function(t, e) {
                                return void 0 !== e.updateTime ? {
                                    updateTime: We(t, e.updateTime)
                                } : void 0 !== e.exists ? {
                                    exists: e.exists
                                } : k();
                            }(t, e.precondition)), n;
                        }(e.serializer, t);
                    }))
                }, [ 4 /*yield*/ , e.R("Commit", i, o) ];

              case 1:
                return n.sent(), [ 2 /*return*/ ];
            }
        }));
    }));
}

function dn(t, r) {
    return e(this, void 0, void 0, (function() {
        var e, i, o, a, u, s;
        return n(this, (function(n) {
            switch (n.label) {
              case 0:
                return e = A(t), i = $e(e.serializer) + "/documents", o = {
                    documents: r.map((function(t) {
                        return Je(e.serializer, t);
                    }))
                }, [ 4 /*yield*/ , e.g("BatchGetDocuments", i, o, r.length) ];

              case 1:
                return a = n.sent(), u = new Map, a.forEach((function(t) {
                    var n = function(t, e) {
                        return "found" in e ? function(t, e) {
                            I(!!e.found), e.found.name, e.found.updateTime;
                            var n = Xe(t, e.found.name), r = Ye(e.found.updateTime), i = e.found.createTime ? Ye(e.found.createTime) : fe.min(), o = new ge({
                                mapValue: {
                                    fields: e.found.fields
                                }
                            });
                            return we.newFoundDocument(n, r, i, o);
                        }(t, e) : "missing" in e ? function(t, e) {
                            I(!!e.missing), I(!!e.readTime);
                            var n = Xe(t, e.missing), r = Ye(e.readTime);
                            return we.newNoDocument(n, r);
                        }(t, e) : k();
                    }(e.serializer, t);
                    u.set(n.key.toString(), n);
                })), s = [], [ 2 /*return*/ , (r.forEach((function(t) {
                    var e = u.get(t.toString());
                    I(!!e), s.push(e);
                })), s) ];
            }
        }));
    }));
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
var yn = new Map;

/**
 * An instance map that ensures only one Datastore exists per Firestore
 * instance.
 */
/**
 * Returns an initialized and started Datastore for the given Firestore
 * instance. Callers must invoke removeComponents() when the Firestore
 * instance is terminated.
 */ function mn(t) {
    if (t._terminated) throw new B(x, "The client has already been terminated.");
    if (!yn.has(t)) {
        _("ComponentProvider", "Initializing Datastore");
        var e = function(t) {
            return new wt(t, fetch.bind(null));
        }(function(t, e, n, r) {
            return new Z(t, e, n, r.host, r.ssl, r.experimentalForceLongPolling, r.experimentalAutoDetectLongPolling, ft(r.experimentalLongPollingOptions), r.useFetchStreams);
        }(t._databaseId, t.app.options.appId || "", t._persistenceKey, t._freezeSettings())), n = ln(t._databaseId), r = function(t, e, n, r) {
            return new hn(t, e, n, r);
        }(t._authCredentials, t._appCheckCredentials, e, n);
        yn.set(t, r);
    }
    return yn.get(t);
}

/**
 * Removes all components associated with the provided instance. Must be called
 * when the `Firestore` instance is terminated.
 */
/**
 * A concrete type describing all the values that can be applied via a
 * user-supplied `FirestoreSettings` object. This is a separate type so that
 * defaults can be supplied and the value can be checked for equality.
 */ var vn = /** @class */ function() {
    function t(t) {
        var e, n;
        if (void 0 === t.host) {
            if (void 0 !== t.ssl) throw new B(F, "Can't provide ssl option if host option is not set");
            this.host = "firestore.googleapis.com", this.ssl = !0;
        } else this.host = t.host, this.ssl = null === (e = t.ssl) || void 0 === e || e;
        if (this.credentials = t.credentials, this.ignoreUndefinedProperties = !!t.ignoreUndefinedProperties, 
        this.localCache = t.localCache, void 0 === t.cacheSizeBytes) this.cacheSizeBytes = 41943040; else {
            if (-1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576) throw new B(F, "cacheSizeBytes must be at least 1048576");
            this.cacheSizeBytes = t.cacheSizeBytes;
        }
        !function(t, e, n, r) {
            if (!0 === e && !0 === r) throw new B(F, "".concat(t, " and ").concat(n, " cannot be used together."));
        }("experimentalForceLongPolling", t.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t.experimentalAutoDetectLongPolling), 
        this.experimentalForceLongPolling = !!t.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = !1 : void 0 === t.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = !0 : 
        // For backwards compatibility, coerce the value to boolean even though
        // the TypeScript compiler has narrowed the type to boolean already.
        // noinspection PointlessBooleanExpressionJS
        this.experimentalAutoDetectLongPolling = !!t.experimentalAutoDetectLongPolling, 
        this.experimentalLongPollingOptions = ft(null !== (n = t.experimentalLongPollingOptions) && void 0 !== n ? n : {}), 
        function(t) {
            if (void 0 !== t.timeoutSeconds) {
                if (isNaN(t.timeoutSeconds)) throw new B(F, "invalid long polling timeout: ".concat(t.timeoutSeconds, " (must not be NaN)"));
                if (t.timeoutSeconds < 5) throw new B(F, "invalid long polling timeout: ".concat(t.timeoutSeconds, " (minimum allowed value is 5)"));
                if (t.timeoutSeconds > 30) throw new B(F, "invalid long polling timeout: ".concat(t.timeoutSeconds, " (maximum allowed value is 30)"));
            }
        }(this.experimentalLongPollingOptions), this.useFetchStreams = !!t.useFetchStreams;
    }
    return t.prototype.isEqual = function(t) {
        return this.host === t.host && this.ssl === t.ssl && this.credentials === t.credentials && this.cacheSizeBytes === t.cacheSizeBytes && this.experimentalForceLongPolling === t.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t.experimentalAutoDetectLongPolling && function(t, e) {
            return t.timeoutSeconds === e.timeoutSeconds;
        }(this.experimentalLongPollingOptions, t.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === t.ignoreUndefinedProperties && this.useFetchStreams === t.useFetchStreams;
    }, t;
}(), gn = /** @class */ function() {
    /** @hideconstructor */
    function t(t, e, n, r) {
        this._authCredentials = t, this._appCheckCredentials = e, this._databaseId = n, 
        this._app = r, 
        /**
             * Whether it's a Firestore or Firestore Lite instance.
             */
        this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new vn({}), 
        this._settingsFrozen = !1;
    }
    return Object.defineProperty(t.prototype, "app", {
        /**
         * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
         * instance.
         */
        get: function() {
            if (!this._app) throw new B(x, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
            return this._app;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "_initialized", {
        get: function() {
            return this._settingsFrozen;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "_terminated", {
        get: function() {
            return void 0 !== this._terminateTask;
        },
        enumerable: !1,
        configurable: !0
    }), t.prototype._setSettings = function(t) {
        if (this._settingsFrozen) throw new B(x, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
        this._settings = new vn(t), void 0 !== t.credentials && (this._authCredentials = function(t) {
            if (!t) return new G;
            switch (t.type) {
              case "firstParty":
                return new H(t.sessionIndex || "0", t.iamToken || null, t.authTokenFactory || null);

              case "provider":
                return t.client;

              default:
                throw new B(F, "makeAuthCredentialsProvider failed due to invalid credential type");
            }
        }(t.credentials));
    }, t.prototype._getSettings = function() {
        return this._settings;
    }, t.prototype._freezeSettings = function() {
        return this._settingsFrozen = !0, this._settings;
    }, t.prototype._delete = function() {
        return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
    }, 
    /** Returns a JSON-serializable representation of this `Firestore` instance. */ t.prototype.toJSON = function() {
        return {
            app: this._app,
            databaseId: this._databaseId,
            settings: this._settings
        };
    }, 
    /**
     * Terminates all components used by this client. Subclasses can override
     * this method to clean up their own dependencies, but must also call this
     * method.
     *
     * Only ever called once.
     */
    t.prototype._terminate = function() {
        return t = this, (e = yn.get(t)) && (_("ComponentProvider", "Removing Datastore"), 
        yn.delete(t), e.terminate()), Promise.resolve();
        var t, e;
    }, t;
}();

function wn(t, e, n) {
    n || (n = "(default)");
    var r = _getProvider(t, "firestore/lite");
    if (r.isInitialized(n)) throw new B(x, "Firestore can only be initialized once per app.");
    return r.initialize({
        options: e,
        instanceIdentifier: n
    });
}

function bn(t, e) {
    var n = "object" == typeof t ? t : u(), i = "string" == typeof t ? t : e || "(default)", o = _getProvider(n, "firestore/lite").getImmediate({
        identifier: i
    });
    if (!o._initialized) {
        var a = d("firestore");
        a && _n.apply(void 0, r([ o ], a, !1));
    }
    return o;
}

/**
 * Modify this instance to communicate with the Cloud Firestore emulator.
 *
 * Note: This must be called before this instance has been used to do any
 * operations.
 *
 * @param firestore - The `Firestore` instance to configure to connect to the
 * emulator.
 * @param host - the emulator host (ex: localhost).
 * @param port - the emulator port (ex: 9000).
 * @param options.mockUserToken - the mock auth token to use for unit testing
 * Security Rules.
 */ function _n(t, e, n, r) {
    var i;
    void 0 === r && (r = {});
    var o = (t = ct(t, gn))._getSettings(), a = "".concat(e, ":").concat(n);
    if ("firestore.googleapis.com" !== o.host && o.host !== a && E("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."), 
    t._setSettings(Object.assign(Object.assign({}, o), {
        host: a,
        ssl: !1
    })), r.mockUserToken) {
        var u, s;
        if ("string" == typeof r.mockUserToken) u = r.mockUserToken, s = v.MOCK_USER; else {
            // Let createMockUserToken validate first (catches common mistakes like
            // invalid field "uid" and missing field "sub" / "user_id".)
            u = y(r.mockUserToken, null === (i = t._app) || void 0 === i ? void 0 : i.options.projectId);
            var c = r.mockUserToken.sub || r.mockUserToken.user_id;
            if (!c) throw new B(F, "mockUserToken must contain 'sub' or 'user_id' field!");
            s = new v(c);
        }
        t._authCredentials = new Q(new K(u, s));
    }
}

/**
 * Terminates the provided `Firestore` instance.
 *
 * After calling `terminate()` only the `clearIndexedDbPersistence()` functions
 * may be used. Any other function will throw a `FirestoreError`. Termination
 * does not cancel any pending writes, and any promises that are awaiting a
 * response from the server will not be resolved.
 *
 * To restart after termination, create a new instance of `Firestore` with
 * {@link (getFirestore:1)}.
 *
 * Note: Under normal circumstances, calling `terminate()` is not required. This
 * function is useful only when you want to force this instance to release all of
 * its resources or in combination with {@link clearIndexedDbPersistence} to
 * ensure that all local state is destroyed between test runs.
 *
 * @param firestore - The `Firestore` instance to terminate.
 * @returns A `Promise` that is resolved when the instance has been successfully
 * terminated.
 */ function Tn(t) {
    return t = ct(t, gn), s(t.app, "firestore/lite"), t._delete();
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
 * @license
 * Copyright 2022 Google LLC
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
 * Represents an aggregation that can be performed by Firestore.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var En = 
/**
     * Create a new AggregateField<T>
     * @param aggregateType Specifies the type of aggregation operation to perform.
     * @param _internalFieldPath Optionally specifies the field that is aggregated.
     * @internal
     */
function(t, e) {
    void 0 === t && (t = "count"), this._internalFieldPath = e, 
    /** A type string to uniquely identify instances of this class. */
    this.type = "AggregateField", this.aggregateType = t;
}, Sn = /** @class */ function() {
    /** @hideconstructor */
    function t(t, e, n) {
        this._userDataWriter = e, this._data = n, 
        /** A type string to uniquely identify instances of this class. */
        this.type = "AggregateQuerySnapshot", this.query = t
        /**
     * Returns the results of the aggregations performed over the underlying
     * query.
     *
     * The keys of the returned object will be the same as those of the
     * `AggregateSpec` object specified to the aggregation method, and the values
     * will be the corresponding aggregation result.
     *
     * @returns The results of the aggregations performed over the underlying
     * query.
     */;
    }
    return t.prototype.data = function() {
        return this._userDataWriter.convertObjectMap(this._data);
    }, t;
}(), kn = /** @class */ function() {
    // This is the lite version of the Query class in the main SDK.
    /** @hideconstructor protected */
    function t(t, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    e, n) {
        this.converter = e, this._query = n, 
        /** The type of this Firestore reference. */
        this.type = "query", this.firestore = t;
    }
    return t.prototype.withConverter = function(e) {
        return new t(this.firestore, e, this._query);
    }, t;
}(), In = /** @class */ function() {
    /** @hideconstructor */
    function t(t, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    e, n) {
        this.converter = e, this._key = n, 
        /** The type of this Firestore reference. */
        this.type = "document", this.firestore = t;
    }
    return Object.defineProperty(t.prototype, "_path", {
        get: function() {
            return this._key.path;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "id", {
        /**
         * The document's identifier within its collection.
         */
        get: function() {
            return this._key.path.lastSegment();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "path", {
        /**
         * A string representing the path of the referenced document (relative
         * to the root of the database).
         */
        get: function() {
            return this._key.path.canonicalString();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "parent", {
        /**
         * The collection this `DocumentReference` belongs to.
         */
        get: function() {
            return new An(this.firestore, this.converter, this._key.path.popLast());
        },
        enumerable: !1,
        configurable: !0
    }), t.prototype.withConverter = function(e) {
        return new t(this.firestore, e, this._key);
    }, t;
}(), An = /** @class */ function(e) {
    /** @hideconstructor */
    function n(t, n, r) {
        var i = this;
        return i = e.call(this, t, n, function(t) {
            return new Te(t);
        }(r)) || this, i._path = r, 
        /** The type of this Firestore reference. */
        i.type = "collection", i;
    }
    return t(n, e), Object.defineProperty(n.prototype, "id", {
        /** The collection's identifier. */ get: function() {
            return this._query.path.lastSegment();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(n.prototype, "path", {
        /**
         * A string representing the path of the referenced collection (relative
         * to the root of the database).
         */
        get: function() {
            return this._query.path.canonicalString();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(n.prototype, "parent", {
        /**
         * A reference to the containing `DocumentReference` if this is a
         * subcollection. If this isn't a subcollection, the reference is null.
         */
        get: function() {
            var t = this._path.popLast();
            return t.isEmpty() ? null : new In(this.firestore, 
            /* converter= */ null, new it(t));
        },
        enumerable: !1,
        configurable: !0
    }), n.prototype.withConverter = function(t) {
        return new n(this.firestore, t, this._path);
    }, n;
}(kn);

/**
 * The results of executing an aggregation query.
 */ function Pn(t, e) {
    for (var n = [], i = 2; i < arguments.length; i++) n[i - 2] = arguments[i];
    if (t = p(t), ot("collection", "path", e), t instanceof gn) {
        var o = et.fromString.apply(et, r([ e ], n, !1));
        return ut(o), new An(t, /* converter= */ null, o);
    }
    if (!(t instanceof In || t instanceof An)) throw new B(F, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    var a = t._path.child(et.fromString.apply(et, r([ e ], n, !1)));
    return ut(a), new An(t.firestore, 
    /* converter= */ null, a);
}

// TODO(firestorelite): Consider using ErrorFactory -
// https://github.com/firebase/firebase-js-sdk/blob/0131e1f/packages/util/src/errors.ts#L106
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
 */ function Vn(t, e) {
    if (t = ct(t, gn), ot("collectionGroup", "collection id", e), e.indexOf("/") >= 0) throw new B(F, "Invalid collection ID '".concat(e, "' passed to function collectionGroup(). Collection IDs must not contain '/'."));
    return new kn(t, 
    /* converter= */ null, function(t) {
        return new Te(et.emptyPath(), t);
    }(e));
}

function Fn(t, e) {
    for (var n = [], i = 2; i < arguments.length; i++) n[i - 2] = arguments[i];
    if (t = p(t), 
    // We allow omission of 'pathString' but explicitly prohibit passing in both
    // 'undefined' and 'null'.
    1 === arguments.length && (e = Tt.newId()), ot("doc", "path", e), t instanceof gn) {
        var o = et.fromString.apply(et, r([ e ], n, !1));
        return at(o), new In(t, 
        /* converter= */ null, new it(o));
    }
    if (!(t instanceof In || t instanceof An)) throw new B(F, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    var a = t._path.child(et.fromString.apply(et, r([ e ], n, !1)));
    return at(a), new In(t.firestore, t instanceof An ? t.converter : null, new it(a));
}

/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */ function On(t, e) {
    return t = p(t), e = p(e), (t instanceof In || t instanceof An) && (e instanceof In || e instanceof An) && t.firestore === e.firestore && t.path === e.path && t.converter === e.converter
    /**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */;
}

function Nn(t, e) {
    return t = p(t), e = p(e), t instanceof kn && e instanceof kn && t.firestore === e.firestore && function(t, e) {
        return function(t, e) {
            if (t.limit !== e.limit) return !1;
            if (t.orderBy.length !== e.orderBy.length) return !1;
            for (var n = 0; n < t.orderBy.length; n++) if (!le(t.orderBy[n], e.orderBy[n])) return !1;
            if (t.filters.length !== e.filters.length) return !1;
            for (var r = 0; r < t.filters.length; r++) if (!te(t.filters[r], e.filters[r])) return !1;
            return t.collectionGroup === e.collectionGroup && !!t.path.isEqual(e.path) && !!Jt(t.startAt, e.startAt) && Jt(t.endAt, e.endAt);
        }(ke(t), ke(e)) && t.limitType === e.limitType;
    }(t._query, e._query) && t.converter === e.converter
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
 * An immutable object representing an array of bytes.
 */;
}

var Dn = /** @class */ function() {
    /** @hideconstructor */
    function t(t) {
        this._byteString = t;
    }
    /**
     * Creates a new `Bytes` object from the given Base64 string, converting it to
     * bytes.
     *
     * @param base64 - The Base64 string used to create the `Bytes` object.
     */    return t.fromBase64String = function(e) {
        try {
            return new t(Pt.fromBase64String(e));
        } catch (e) {
            throw new B(F, "Failed to construct data from Base64 string: " + e);
        }
    }, 
    /**
     * Creates a new `Bytes` object from the given Uint8Array.
     *
     * @param array - The Uint8Array used to create the `Bytes` object.
     */
    t.fromUint8Array = function(e) {
        return new t(Pt.fromUint8Array(e));
    }, 
    /**
     * Returns the underlying bytes as a Base64-encoded string.
     *
     * @returns The Base64-encoded string created from the `Bytes` object.
     */
    t.prototype.toBase64 = function() {
        return this._byteString.toBase64();
    }, 
    /**
     * Returns the underlying bytes in a new `Uint8Array`.
     *
     * @returns The Uint8Array created from the `Bytes` object.
     */
    t.prototype.toUint8Array = function() {
        return this._byteString.toUint8Array();
    }, 
    /**
     * Returns a string representation of the `Bytes` object.
     *
     * @returns A string representation of the `Bytes` object.
     */
    t.prototype.toString = function() {
        return "Bytes(base64: " + this.toBase64() + ")";
    }, 
    /**
     * Returns true if this `Bytes` object is equal to the provided one.
     *
     * @param other - The `Bytes` object to compare against.
     * @returns true if this `Bytes` object is equal to the provided one.
     */
    t.prototype.isEqual = function(t) {
        return this._byteString.isEqual(t._byteString);
    }, t;
}(), Rn = /** @class */ function() {
    /**
     * Creates a `FieldPath` from the provided field names. If more than one field
     * name is provided, the path will point to a nested field in a document.
     *
     * @param fieldNames - A list of field names.
     */
    function t() {
        for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
        for (var n = 0; n < t.length; ++n) if (0 === t[n].length) throw new B(F, "Invalid field name at argument $(i + 1). Field names must not be empty.");
        this._internalPath = new rt(t);
    }
    /**
     * Returns true if this `FieldPath` is equal to the provided one.
     *
     * @param other - The `FieldPath` to compare against.
     * @returns true if this `FieldPath` is equal to the provided one.
     */    return t.prototype.isEqual = function(t) {
        return this._internalPath.isEqual(t._internalPath);
    }, t;
}();

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
 * A `FieldPath` refers to a field in a document. The path may consist of a
 * single field name (referring to a top-level field in the document), or a
 * list of field names (referring to a nested field in the document).
 *
 * Create a `FieldPath` by providing field names. If more than one field
 * name is provided, the path will point to a nested field in a document.
 */
/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 */
function qn() {
    return new Rn("__name__");
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
 * Sentinel values that can be used when writing document fields with `set()`
 * or `update()`.
 */ var xn = 
/**
     * @param _methodName - The public API endpoint that returns this class.
     * @hideconstructor
     */
function(t) {
    this._methodName = t;
}, Cn = /** @class */ function() {
    /**
     * Creates a new immutable `GeoPoint` object with the provided latitude and
     * longitude values.
     * @param latitude - The latitude as number between -90 and 90.
     * @param longitude - The longitude as number between -180 and 180.
     */
    function t(t, e) {
        if (!isFinite(t) || t < -90 || t > 90) throw new B(F, "Latitude must be a number between -90 and 90, but was: " + t);
        if (!isFinite(e) || e < -180 || e > 180) throw new B(F, "Longitude must be a number between -180 and 180, but was: " + e);
        this._lat = t, this._long = e;
    }
    return Object.defineProperty(t.prototype, "latitude", {
        /**
         * The latitude of this `GeoPoint` instance.
         */
        get: function() {
            return this._lat;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "longitude", {
        /**
         * The longitude of this `GeoPoint` instance.
         */
        get: function() {
            return this._long;
        },
        enumerable: !1,
        configurable: !0
    }), 
    /**
     * Returns true if this `GeoPoint` is equal to the provided one.
     *
     * @param other - The `GeoPoint` to compare against.
     * @returns true if this `GeoPoint` is equal to the provided one.
     */
    t.prototype.isEqual = function(t) {
        return this._lat === t._lat && this._long === t._long;
    }, 
    /** Returns a JSON-serializable representation of this GeoPoint. */ t.prototype.toJSON = function() {
        return {
            latitude: this._lat,
            longitude: this._long
        };
    }, 
    /**
     * Actually private to JS consumers of our API, so this function is prefixed
     * with an underscore.
     */
    t.prototype._compareTo = function(t) {
        return Et(this._lat, t._lat) || Et(this._long, t._long);
    }, t;
}(), Ln = /^__.*__$/, jn = /** @class */ function() {
    function t(t, e, n) {
        this.data = t, this.fieldMask = e, this.fieldTransforms = n;
    }
    return t.prototype.toMutation = function(t, e) {
        return null !== this.fieldMask ? new Le(t, this.data, this.fieldMask, e, this.fieldTransforms) : new Ce(t, this.data, e, this.fieldTransforms);
    }, t;
}(), Mn = /** @class */ function() {
    function t(t, 
    // The fieldMask does not include document transforms.
    e, n) {
        this.data = t, this.fieldMask = e, this.fieldTransforms = n;
    }
    return t.prototype.toMutation = function(t, e) {
        return new Le(t, this.data, this.fieldMask, e, this.fieldTransforms);
    }, t;
}();

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
 * An immutable object representing a geographic location in Firestore. The
 * location is represented as latitude/longitude pair.
 *
 * Latitude values are in the range of [-90, 90].
 * Longitude values are in the range of [-180, 180].
 */ function Un(t) {
    switch (t) {
      case 0 /* UserDataSource.Set */ :
 // fall through
              case 2 /* UserDataSource.MergeSet */ :
 // fall through
              case 1 /* UserDataSource.Update */ :
        return !0;

      case 3 /* UserDataSource.Argument */ :
      case 4 /* UserDataSource.ArrayArgument */ :
        return !1;

      default:
        throw k();
    }
}

/** A "context" object passed around while parsing user data. */ var Bn = /** @class */ function() {
    /**
     * Initializes a ParseContext with the given source and path.
     *
     * @param settings - The settings for the parser.
     * @param databaseId - The database ID of the Firestore instance.
     * @param serializer - The serializer to use to generate the Value proto.
     * @param ignoreUndefinedProperties - Whether to ignore undefined properties
     * rather than throw.
     * @param fieldTransforms - A mutable list of field transforms encountered
     * while parsing the data.
     * @param fieldMask - A mutable list of field paths encountered while parsing
     * the data.
     *
     * TODO(b/34871131): We don't support array paths right now, so path can be
     * null to indicate the context represents any location within an array (in
     * which case certain features will not work and errors will be somewhat
     * compromised).
     */
    function t(t, e, n, r, i, o) {
        this.settings = t, this.databaseId = e, this.serializer = n, this.ignoreUndefinedProperties = r, 
        // Minor hack: If fieldTransforms is undefined, we assume this is an
        // external call and we need to validate the entire path.
        void 0 === i && this.X(), this.fieldTransforms = i || [], this.fieldMask = o || [];
    }
    return Object.defineProperty(t.prototype, "path", {
        get: function() {
            return this.settings.path;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "tt", {
        get: function() {
            return this.settings.tt;
        },
        enumerable: !1,
        configurable: !0
    }), 
    /** Returns a new context with the specified settings overwritten. */ t.prototype.et = function(e) {
        return new t(Object.assign(Object.assign({}, this.settings), e), this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
    }, t.prototype.rt = function(t) {
        var e, n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t), r = this.et({
            path: n,
            nt: !1
        });
        return r.it(t), r;
    }, t.prototype.st = function(t) {
        var e, n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t), r = this.et({
            path: n,
            nt: !1
        });
        return r.X(), r;
    }, t.prototype.ot = function(t) {
        // TODO(b/34871131): We don't support array paths right now; so make path
        // undefined.
        return this.et({
            path: void 0,
            nt: !0
        });
    }, t.prototype.ut = function(t) {
        return sr(t, this.settings.methodName, this.settings._t || !1, this.path, this.settings.ct);
    }, 
    /** Returns 'true' if 'fieldPath' was traversed when creating this context. */ t.prototype.contains = function(t) {
        return void 0 !== this.fieldMask.find((function(e) {
            return t.isPrefixOf(e);
        })) || void 0 !== this.fieldTransforms.find((function(e) {
            return t.isPrefixOf(e.field);
        }));
    }, t.prototype.X = function() {
        // TODO(b/34871131): Remove null check once we have proper paths for fields
        // within arrays.
        if (this.path) for (var t = 0; t < this.path.length; t++) this.it(this.path.get(t));
    }, t.prototype.it = function(t) {
        if (0 === t.length) throw this.ut("Document fields must not be empty");
        if (Un(this.tt) && Ln.test(t)) throw this.ut('Document fields cannot begin and end with "__"');
    }, t;
}(), zn = /** @class */ function() {
    function t(t, e, n) {
        this.databaseId = t, this.ignoreUndefinedProperties = e, this.serializer = n || ln(t)
        /** Creates a new top-level parse context. */;
    }
    return t.prototype.lt = function(t, e, n, r) {
        return void 0 === r && (r = !1), new Bn({
            tt: t,
            methodName: e,
            ct: n,
            path: rt.emptyPath(),
            nt: !1,
            _t: r
        }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
    }, t;
}();

/**
 * Helper for parsing raw user input (provided via the API) into internal model
 * classes.
 */ function Kn(t) {
    var e = t._freezeSettings(), n = ln(t._databaseId);
    return new zn(t._databaseId, !!e.ignoreUndefinedProperties, n);
}

/** Parse document data from a set() call. */ function Gn(t, e, n, r, i, o) {
    void 0 === o && (o = {});
    var a = t.lt(o.merge || o.mergeFields ? 2 /* UserDataSource.MergeSet */ : 0 /* UserDataSource.Set */ , e, n, i);
    ir("Data must be an object, but it was:", a, r);
    var u, s, c = nr(r, a);
    if (o.merge) u = new ve(a.fieldMask), s = a.fieldTransforms; else if (o.mergeFields) {
        for (var l = [], f = 0, h = o.mergeFields; f < h.length; f++) {
            var p = or(e, h[f], n);
            if (!a.contains(p)) throw new B(F, "Field '".concat(p, "' is specified in your field mask but missing from your input data."));
            cr(l, p) || l.push(p);
        }
        u = new ve(l), s = a.fieldTransforms.filter((function(t) {
            return u.covers(t.field);
        }));
    } else u = null, s = a.fieldTransforms;
    return new jn(new ge(c), u, s);
}

var Qn = /** @class */ function(e) {
    function n() {
        return null !== e && e.apply(this, arguments) || this;
    }
    return t(n, e), n.prototype._toFieldTransform = function(t) {
        if (2 /* UserDataSource.MergeSet */ !== t.tt) throw 1 /* UserDataSource.Update */ === t.tt ? t.ut("".concat(this._methodName, "() can only appear at the top level of your update data")) : t.ut("".concat(this._methodName, "() cannot be used with set() unless you pass {merge:true}"));
        // No transform to add for a delete, but we need to add it to our
        // fieldMask so it gets deleted.
                return t.fieldMask.push(t.path), null;
    }, n.prototype.isEqual = function(t) {
        return t instanceof n;
    }, n;
}(xn);

/**
 * Creates a child context for parsing SerializableFieldValues.
 *
 * This is different than calling `ParseContext.contextWith` because it keeps
 * the fieldTransforms and fieldMask separate.
 *
 * The created context has its `dataSource` set to `UserDataSource.Argument`.
 * Although these values are used with writes, any elements in these FieldValues
 * are not considered writes since they cannot contain any FieldValue sentinels,
 * etc.
 *
 * @param fieldValue - The sentinel FieldValue for which to create a child
 *     context.
 * @param context - The parent context.
 * @param arrayElement - Whether or not the FieldValue has an array.
 */ function Wn(t, e, n) {
    return new Bn({
        tt: 3 /* UserDataSource.Argument */ ,
        ct: e.settings.ct,
        methodName: t._methodName,
        nt: n
    }, e.databaseId, e.serializer, e.ignoreUndefinedProperties);
}

var Yn = /** @class */ function(e) {
    function n() {
        return null !== e && e.apply(this, arguments) || this;
    }
    return t(n, e), n.prototype._toFieldTransform = function(t) {
        return new Re(t.path, new Fe);
    }, n.prototype.isEqual = function(t) {
        return t instanceof n;
    }, n;
}(xn), Hn = /** @class */ function(e) {
    function n(t, n) {
        var r = this;
        return (r = e.call(this, t) || this).ht = n, r;
    }
    return t(n, e), n.prototype._toFieldTransform = function(t) {
        var e = Wn(this, t, 
        /*array=*/ !0), n = this.ht.map((function(t) {
            return er(t, e);
        })), r = new Oe(n);
        return new Re(t.path, r);
    }, n.prototype.isEqual = function(t) {
        // TODO(mrschmidt): Implement isEquals
        return this === t;
    }, n;
}(xn), Jn = /** @class */ function(e) {
    function n(t, n) {
        var r = this;
        return (r = e.call(this, t) || this).ht = n, r;
    }
    return t(n, e), n.prototype._toFieldTransform = function(t) {
        var e = Wn(this, t, 
        /*array=*/ !0), n = this.ht.map((function(t) {
            return er(t, e);
        })), r = new Ne(n);
        return new Re(t.path, r);
    }, n.prototype.isEqual = function(t) {
        // TODO(mrschmidt): Implement isEquals
        return this === t;
    }, n;
}(xn), Xn = /** @class */ function(e) {
    function n(t, n) {
        var r = this;
        return (r = e.call(this, t) || this).dt = n, r;
    }
    return t(n, e), n.prototype._toFieldTransform = function(t) {
        var e = new De(t.serializer, Pe(t.serializer, this.dt));
        return new Re(t.path, e);
    }, n.prototype.isEqual = function(t) {
        // TODO(mrschmidt): Implement isEquals
        return this === t;
    }, n;
}(xn);

/** Parse update data from an update() call. */ function Zn(t, e, n, r) {
    var i = t.lt(1 /* UserDataSource.Update */ , e, n);
    ir("Data must be an object, but it was:", i, r);
    var o = [], a = ge.empty();
    It(r, (function(t, r) {
        var u = ur(e, t, n);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                r = p(r);
        var s = i.st(u);
        if (r instanceof Qn) 
        // Add it to the field mask, but don't add anything to updateData.
        o.push(u); else {
            var c = er(r, s);
            null != c && (o.push(u), a.set(u, c));
        }
    }));
    var u = new ve(o);
    return new Mn(a, u, i.fieldTransforms);
}

/** Parse update data from a list of field/value arguments. */ function $n(t, e, n, r, i, o) {
    var a = t.lt(1 /* UserDataSource.Update */ , e, n), u = [ or(e, r, n) ], s = [ i ];
    if (o.length % 2 != 0) throw new B(F, "Function ".concat(e, "() needs to be called with an even number of arguments that alternate between field names and values."));
    for (var c = 0; c < o.length; c += 2) u.push(or(e, o[c])), s.push(o[c + 1]);
    // We iterate in reverse order to pick the last value for a field if the
    // user specified the field multiple times.
    for (var l = [], f = ge.empty(), h = u.length - 1; h >= 0; --h) if (!cr(l, u[h])) {
        var d = u[h], y = s[h];
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
        y = p(y);
        var m = a.st(d);
        if (y instanceof Qn) 
        // Add it to the field mask, but don't add anything to updateData.
        l.push(d); else {
            var v = er(y, m);
            null != v && (l.push(d), f.set(d, v));
        }
    }
    var g = new ve(l);
    return new Mn(f, g, a.fieldTransforms);
}

/**
 * Parse a "query value" (e.g. value in a where filter or a value in a cursor
 * bound).
 *
 * @param allowArrays - Whether the query value is an array that may directly
 * contain additional arrays (e.g. the operand of an `in` query).
 */ function tr(t, e, n, r) {
    return void 0 === r && (r = !1), er(n, t.lt(r ? 4 /* UserDataSource.ArrayArgument */ : 3 /* UserDataSource.Argument */ , e));
}

/**
 * Parses user data to Protobuf Values.
 *
 * @param input - Data to be parsed.
 * @param context - A context object representing the current path being parsed,
 * the source of the data being parsed, etc.
 * @returns The parsed value, or null if the value was a FieldValue sentinel
 * that should not be included in the resulting parsed data.
 */ function er(t, e) {
    if (rr(
    // Unwrap the API type from the Compat SDK. This will return the API type
    // from firestore-exp.
    t = p(t))) return ir("Unsupported field value:", e, t), nr(t, e);
    if (t instanceof xn) 
    // FieldValues usually parse into transforms (except deleteField())
    // in which case we do not want to include this field in our parsed data
    // (as doing so will overwrite the field directly prior to the transform
    // trying to transform it). So we don't add this location to
    // context.fieldMask and we return null as our parsing result.
    /**
     * "Parses" the provided FieldValueImpl, adding any necessary transforms to
     * context.fieldTransforms.
     */
    return function(t, e) {
        // Sentinels are only supported with writes, and not within arrays.
        if (!Un(e.tt)) throw e.ut("".concat(t._methodName, "() can only be used with update() and set()"));
        if (!e.path) throw e.ut("".concat(t._methodName, "() is not currently supported inside arrays"));
        var n = t._toFieldTransform(e);
        n && e.fieldTransforms.push(n);
    }(t, e), null;
    if (void 0 === t && e.ignoreUndefinedProperties) 
    // If the input is undefined it can never participate in the fieldMask, so
    // don't handle this below. If `ignoreUndefinedProperties` is false,
    // `parseScalarValue` will reject an undefined value.
    return null;
    if (
    // If context.path is null we are inside an array and we don't support
    // field mask paths more granular than the top-level array.
    e.path && e.fieldMask.push(e.path), t instanceof Array) {
        // TODO(b/34871131): Include the path containing the array in the error
        // message.
        // In the case of IN queries, the parsed data is an array (representing
        // the set of values to be included for the IN query) that may directly
        // contain additional arrays (each representing an individual field
        // value), so we disable this validation.
        if (e.settings.nt && 4 /* UserDataSource.ArrayArgument */ !== e.tt) throw e.ut("Nested arrays are not supported");
        return function(t, e) {
            for (var n = [], r = 0, i = 0, o = t; i < o.length; i++) {
                var a = er(o[i], e.ot(r));
                null == a && (
                // Just include nulls in the array for fields being replaced with a
                // sentinel.
                a = {
                    nullValue: "NULL_VALUE"
                }), n.push(a), r++;
            }
            return {
                arrayValue: {
                    values: n
                }
            };
        }(t, e);
    }
    return function(t, e) {
        if (null === (t = p(t))) return {
            nullValue: "NULL_VALUE"
        };
        if ("number" == typeof t) return Pe(e.serializer, t);
        if ("boolean" == typeof t) return {
            booleanValue: t
        };
        if ("string" == typeof t) return {
            stringValue: t
        };
        if (t instanceof Date) {
            var n = Dt.fromDate(t);
            return {
                timestampValue: Ge(e.serializer, n)
            };
        }
        if (t instanceof Dt) {
            // Firestore backend truncates precision down to microseconds. To ensure
            // offline mode works the same with regards to truncation, perform the
            // truncation immediately without waiting for the backend to do that.
            var r = new Dt(t.seconds, 1e3 * Math.floor(t.nanoseconds / 1e3));
            return {
                timestampValue: Ge(e.serializer, r)
            };
        }
        if (t instanceof Cn) return {
            geoPointValue: {
                latitude: t.latitude,
                longitude: t.longitude
            }
        };
        if (t instanceof Dn) return {
            bytesValue: Qe(e.serializer, t._byteString)
        };
        if (t instanceof In) {
            var i = e.databaseId, o = t.firestore._databaseId;
            if (!o.isEqual(i)) throw e.ut("Document reference is for database ".concat(o.projectId, "/").concat(o.database, " but should be for database ").concat(i.projectId, "/").concat(i.database));
            return {
                referenceValue: He(t.firestore._databaseId || e.databaseId, t._key.path)
            };
        }
        throw e.ut("Unsupported field value: ".concat(st(t)));
    }(t, e);
}

function nr(t, e) {
    var n = {};
    return function(t) {
        for (var e in t) if (Object.prototype.hasOwnProperty.call(t, e)) return !1;
        return !0;
    }(t) ? 
    // If we encounter an empty object, we explicitly add it to the update
    // mask to ensure that the server creates a map entry.
    e.path && e.path.length > 0 && e.fieldMask.push(e.path) : It(t, (function(t, r) {
        var i = er(r, e.rt(t));
        null != i && (n[t] = i);
    })), {
        mapValue: {
            fields: n
        }
    };
}

function rr(t) {
    return !("object" != typeof t || null === t || t instanceof Array || t instanceof Date || t instanceof Dt || t instanceof Cn || t instanceof Dn || t instanceof In || t instanceof xn);
}

function ir(t, e, n) {
    if (!rr(n) || !function(t) {
        return "object" == typeof t && null !== t && (Object.getPrototypeOf(t) === Object.prototype || null === Object.getPrototypeOf(t));
    }(n)) {
        var r = st(n);
        throw "an object" === r ? e.ut(t + " a custom object") : e.ut(t + " " + r);
    }
}

/**
 * Helper that calls fromDotSeparatedString() but wraps any error thrown.
 */ function or(t, e, n) {
    if (
    // If required, replace the FieldPath Compat class with with the firestore-exp
    // FieldPath.
    (e = p(e)) instanceof Rn) return e._internalPath;
    if ("string" == typeof e) return ur(t, e);
    throw sr("Field path arguments must be of type string or ", t, 
    /* hasConverter= */ !1, 
    /* path= */ void 0, n);
}

/**
 * Matches any characters in a field path string that are reserved.
 */ var ar = new RegExp("[~\\*/\\[\\]]");

/**
 * Wraps fromDotSeparatedString with an error message about the method that
 * was thrown.
 * @param methodName - The publicly visible method name
 * @param path - The dot-separated string form of a field path which will be
 * split on dots.
 * @param targetDoc - The document against which the field path will be
 * evaluated.
 */ function ur(t, e, n) {
    if (e.search(ar) >= 0) throw sr("Invalid field path (".concat(e, "). Paths must not contain '~', '*', '/', '[', or ']'"), t, 
    /* hasConverter= */ !1, 
    /* path= */ void 0, n);
    try {
        return (new (Rn.bind.apply(Rn, r([ void 0 ], e.split("."), !1))))._internalPath;
    } catch (r) {
        throw sr("Invalid field path (".concat(e, "). Paths must not be empty, begin with '.', end with '.', or contain '..'"), t, 
        /* hasConverter= */ !1, 
        /* path= */ void 0, n);
    }
}

function sr(t, e, n, r, i) {
    var o = r && !r.isEmpty(), a = void 0 !== i, u = "Function ".concat(e, "() called with invalid data");
    n && (u += " (via `toFirestore()`)"), u += ". ";
    var s = "";
    return (o || a) && (s += " (found", o && (s += " in field ".concat(r)), a && (s += " in document ".concat(i)), 
    s += ")"), new B(F, u + t + s)
    /** Checks `haystack` if FieldPath `needle` is present. Runs in O(n). */;
}

function cr(t, e) {
    return t.some((function(t) {
        return t.isEqual(e);
    }));
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
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */ var lr = /** @class */ function() {
    // Note: This class is stripped down version of the DocumentSnapshot in
    // the legacy SDK. The changes are:
    // - No support for SnapshotMetadata.
    // - No support for SnapshotOptions.
    /** @hideconstructor protected */
    function t(t, e, n, r, i) {
        this._firestore = t, this._userDataWriter = e, this._key = n, this._document = r, 
        this._converter = i;
    }
    return Object.defineProperty(t.prototype, "id", {
        /** Property of the `DocumentSnapshot` that provides the document's ID. */ get: function() {
            return this._key.path.lastSegment();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "ref", {
        /**
         * The `DocumentReference` for the document included in the `DocumentSnapshot`.
         */
        get: function() {
            return new In(this._firestore, this._converter, this._key);
        },
        enumerable: !1,
        configurable: !0
    }), 
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */
    t.prototype.exists = function() {
        return null !== this._document;
    }, 
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */
    t.prototype.data = function() {
        if (this._document) {
            if (this._converter) {
                // We only want to use the converter and create a new DocumentSnapshot
                // if a converter has been provided.
                var t = new fr(this._firestore, this._userDataWriter, this._key, this._document, 
                /* converter= */ null);
                return this._converter.fromFirestore(t);
            }
            return this._userDataWriter.convertValue(this._document.data.value);
        }
    }, 
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t.prototype.get = function(t) {
        if (this._document) {
            var e = this._document.data.field(dr("DocumentSnapshot.get", t));
            if (null !== e) return this._userDataWriter.convertValue(e);
        }
    }, t;
}(), fr = /** @class */ function(e) {
    function n() {
        return null !== e && e.apply(this, arguments) || this;
    }
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * @override
     * @returns An `Object` containing all fields in the document.
     */    return t(n, e), n.prototype.data = function() {
        return e.prototype.data.call(this);
    }, n;
}(lr), hr = /** @class */ function() {
    /** @hideconstructor */
    function t(t, e) {
        this._docs = e, this.query = t;
    }
    return Object.defineProperty(t.prototype, "docs", {
        /** An array of all the documents in the `QuerySnapshot`. */ get: function() {
            return r([], this._docs, !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "size", {
        /** The number of documents in the `QuerySnapshot`. */ get: function() {
            return this.docs.length;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t.prototype, "empty", {
        /** True if there are no documents in the `QuerySnapshot`. */ get: function() {
            return 0 === this.docs.length;
        },
        enumerable: !1,
        configurable: !0
    }), 
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */
    t.prototype.forEach = function(t, e) {
        this._docs.forEach(t, e);
    }, t;
}();

/**
 * A `QueryDocumentSnapshot` contains data read from a document in your
 * Firestore database as part of a query. The document is guaranteed to exist
 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
 * specific field.
 *
 * A `QueryDocumentSnapshot` offers the same API surface as a
 * `DocumentSnapshot`. Since query results contain only existing documents, the
 * `exists` property will always be true and `data()` will never return
 * 'undefined'.
 */
/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
function pr(t, e) {
    return t = p(t), e = p(e), t instanceof lr && e instanceof lr ? t._firestore === e._firestore && t._key.isEqual(e._key) && (null === t._document ? null === e._document : t._document.isEqual(e._document)) && t._converter === e._converter : t instanceof hr && e instanceof hr && Nn(t.query, e.query) && St(t.docs, e.docs, pr)
    /**
 * Helper that calls `fromDotSeparatedString()` but wraps any error thrown.
 */;
}

function dr(t, e) {
    return "string" == typeof e ? ur(t, e) : e instanceof Rn ? e._internalPath : e._delegate._internalPath;
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
 * An `AppliableConstraint` is an abstraction of a constraint that can be applied
 * to a Firestore query.
 */ var yr = function() {}, mr = /** @class */ function(e) {
    function n() {
        return null !== e && e.apply(this, arguments) || this;
    }
    return t(n, e), n;
}(yr);

/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */ function vr(t, e) {
    for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
    var i = [];
    e instanceof yr && i.push(e), function(t) {
        var e = t.filter((function(t) {
            return t instanceof br;
        })).length, n = t.filter((function(t) {
            return t instanceof gr;
        })).length;
        if (e > 1 || e > 0 && n > 0) throw new B(F, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
    }(i = i.concat(n));
    for (var o = 0, a = i; o < a.length; o++) {
        var u = a[o];
        t = u._apply(t);
    }
    return t;
}

/**
 * A `QueryFieldFilterConstraint` is used to narrow the set of documents returned by
 * a Firestore query by filtering on one or more document fields.
 * `QueryFieldFilterConstraint`s are created by invoking {@link where} and can then
 * be passed to {@link (query:1)} to create a new query instance that also contains
 * this `QueryFieldFilterConstraint`.
 */ var gr = /** @class */ function(e) {
    /**
     * @internal
     */
    function n(t, n, r) {
        var i = this;
        return (i = e.call(this) || this)._field = t, i._op = n, i._value = r, 
        /** The type of this query constraint */
        i.type = "where", i;
    }
    return t(n, e), n._create = function(t, e, r) {
        return new n(t, e, r);
    }, n.prototype._apply = function(t) {
        var e = this._parse(t);
        return Cr(t._query, e), new kn(t.firestore, t.converter, Ae(t._query, e));
    }, n.prototype._parse = function(t) {
        var e = Kn(t.firestore), n = function(t, e, n, r, i, o, a) {
            var u;
            if (i.isKeyField()) {
                if ("array-contains" /* Operator.ARRAY_CONTAINS */ === o || "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === o) throw new B(F, "Invalid Query. You can't perform '".concat(o, "' queries on documentId()."));
                if ("in" /* Operator.IN */ === o || "not-in" /* Operator.NOT_IN */ === o) {
                    xr(a, o);
                    for (var s = [], c = 0, l = a; c < l.length; c++) {
                        var f = l[c];
                        s.push(qr(r, t, f));
                    }
                    u = {
                        arrayValue: {
                            values: s
                        }
                    };
                } else u = qr(r, t, a);
            } else "in" /* Operator.IN */ !== o && "not-in" /* Operator.NOT_IN */ !== o && "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ !== o || xr(a, o), 
            u = tr(n, e, a, 
            /* allowArrays= */ "in" /* Operator.IN */ === o || "not-in" /* Operator.NOT_IN */ === o);
            return Zt.create(i, o, u);
        }(t._query, "where", e, t.firestore._databaseId, this._field, this._op, this._value);
        return n;
    }, n;
}(mr);

/**
 * Creates a {@link QueryFieldFilterConstraint} that enforces that documents
 * must contain the specified field and that the value should satisfy the
 * relation constraint provided.
 *
 * @param fieldPath - The path to compare
 * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
 *   "&lt;=", "!=").
 * @param value - The value for comparison
 * @returns The created {@link QueryFieldFilterConstraint}.
 */ function wr(t, e, n) {
    var r = e, i = dr("where", t);
    return gr._create(i, r, n);
}

/**
 * A `QueryCompositeFilterConstraint` is used to narrow the set of documents
 * returned by a Firestore query by performing the logical OR or AND of multiple
 * {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
 * `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
 * {@link and} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains the `QueryCompositeFilterConstraint`.
 */ var br = /** @class */ function(e) {
    /**
     * @internal
     */
    function n(
    /** The type of this query constraint */
    t, n) {
        var r = this;
        return (r = e.call(this) || this).type = t, r._queryConstraints = n, r;
    }
    return t(n, e), n._create = function(t, e) {
        return new n(t, e);
    }, n.prototype._parse = function(t) {
        var e = this._queryConstraints.map((function(e) {
            return e._parse(t);
        })).filter((function(t) {
            return t.getFilters().length > 0;
        }));
        return 1 === e.length ? e[0] : $t.create(e, this._getOperator());
    }, n.prototype._apply = function(t) {
        var e = this._parse(t);
        return 0 === e.getFilters().length ? t : (function(t, e) {
            for (var n = t, r = 0, i = e.getFlattenedFilters(); r < i.length; r++) {
                var o = i[r];
                Cr(n, o), n = Ae(n, o);
            }
        }(t._query, e), new kn(t.firestore, t.converter, Ae(t._query, e)));
    }, n.prototype._getQueryConstraints = function() {
        return this._queryConstraints;
    }, n.prototype._getOperator = function() {
        return "and" === this.type ? "and" /* CompositeOperator.AND */ : "or" /* CompositeOperator.OR */;
    }, n;
}(yr);

/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a disjunction of
 * the given filter constraints. A disjunction filter includes a document if it
 * satisfies any of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a disjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */ function _r() {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    // Only support QueryFilterConstraints
        return t.forEach((function(t) {
        return Lr("or", t);
    })), br._create("or" /* CompositeOperator.OR */ , t)
    /**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a conjunction of
 * the given filter constraints. A conjunction filter includes a document if it
 * satisfies all of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a conjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */;
}

function Tr() {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    // Only support QueryFilterConstraints
        return t.forEach((function(t) {
        return Lr("and", t);
    })), br._create("and" /* CompositeOperator.AND */ , t)
    /**
 * A `QueryOrderByConstraint` is used to sort the set of documents returned by a
 * Firestore query. `QueryOrderByConstraint`s are created by invoking
 * {@link orderBy} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains this `QueryOrderByConstraint`.
 *
 * Note: Documents that do not contain the orderBy field will not be present in
 * the query result.
 */;
}

var Er = /** @class */ function(e) {
    /**
     * @internal
     */
    function n(t, n) {
        var r = this;
        return (r = e.call(this) || this)._field = t, r._direction = n, 
        /** The type of this query constraint */
        r.type = "orderBy", r;
    }
    return t(n, e), n._create = function(t, e) {
        return new n(t, e);
    }, n.prototype._apply = function(t) {
        var e = function(t, e, n) {
            if (null !== t.startAt) throw new B(F, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
            if (null !== t.endAt) throw new B(F, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
            return new ce(e, n);
        }(t._query, this._field, this._direction);
        return new kn(t.firestore, t.converter, function(t, e) {
            // TODO(dimond): validate that orderBy does not list the same key twice.
            var n = t.explicitOrderBy.concat([ e ]);
            return new Te(t.path, t.collectionGroup, n, t.filters.slice(), t.limit, t.limitType, t.startAt, t.endAt);
        }(t._query, e));
    }, n;
}(mr);

/**
 * Creates a {@link QueryOrderByConstraint} that sorts the query result by the
 * specified field, optionally in descending order instead of ascending.
 *
 * Note: Documents that do not contain the specified field will not be present
 * in the query result.
 *
 * @param fieldPath - The field to sort by.
 * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
 * not specified, order will be ascending.
 * @returns The created {@link QueryOrderByConstraint}.
 */ function Sr(t, e) {
    void 0 === e && (e = "asc");
    var n = e, r = dr("orderBy", t);
    return Er._create(r, n);
}

/**
 * A `QueryLimitConstraint` is used to limit the number of documents returned by
 * a Firestore query.
 * `QueryLimitConstraint`s are created by invoking {@link limit} or
 * {@link limitToLast} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryLimitConstraint`.
 */ var kr = /** @class */ function(e) {
    /**
     * @internal
     */
    function n(
    /** The type of this query constraint */
    t, n, r) {
        var i = this;
        return (i = e.call(this) || this).type = t, i._limit = n, i._limitType = r, i;
    }
    return t(n, e), n._create = function(t, e, r) {
        return new n(t, e, r);
    }, n.prototype._apply = function(t) {
        return new kn(t.firestore, t.converter, function(t, e, n) {
            return new Te(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), e, n, t.startAt, t.endAt);
        }(t._query, this._limit, this._limitType));
    }, n;
}(mr);

/**
 * Creates a {@link QueryLimitConstraint} that only returns the first matching
 * documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */ function Ir(t) {
    return lt("limit", t), kr._create("limit", t, "F" /* LimitType.First */)
    /**
 * Creates a {@link QueryLimitConstraint} that only returns the last matching
 * documents.
 *
 * You must specify at least one `orderBy` clause for `limitToLast` queries,
 * otherwise an exception will be thrown during execution.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */;
}

function Ar(t) {
    return lt("limitToLast", t), kr._create("limitToLast", t, "L" /* LimitType.Last */)
    /**
 * A `QueryStartAtConstraint` is used to exclude documents from the start of a
 * result set returned by a Firestore query.
 * `QueryStartAtConstraint`s are created by invoking {@link (startAt:1)} or
 * {@link (startAfter:1)} and can then be passed to {@link (query:1)} to create a
 * new query instance that also contains this `QueryStartAtConstraint`.
 */;
}

var Pr = /** @class */ function(e) {
    /**
     * @internal
     */
    function n(
    /** The type of this query constraint */
    t, n, r) {
        var i = this;
        return (i = e.call(this) || this).type = t, i._docOrFields = n, i._inclusive = r, 
        i;
    }
    return t(n, e), n._create = function(t, e, r) {
        return new n(t, e, r);
    }, n.prototype._apply = function(t) {
        var e = Rr(t, this.type, this._docOrFields, this._inclusive);
        return new kn(t.firestore, t.converter, function(t, e) {
            return new Te(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, e, t.endAt);
        }(t._query, e));
    }, n;
}(mr);

function Vr() {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    return Pr._create("startAt", t, 
    /*inclusive=*/ !0);
}

function Fr() {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    return Pr._create("startAfter", t, 
    /*inclusive=*/ !1);
}

/**
 * A `QueryEndAtConstraint` is used to exclude documents from the end of a
 * result set returned by a Firestore query.
 * `QueryEndAtConstraint`s are created by invoking {@link (endAt:1)} or
 * {@link (endBefore:1)} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryEndAtConstraint`.
 */ var Or = /** @class */ function(e) {
    /**
     * @internal
     */
    function n(
    /** The type of this query constraint */
    t, n, r) {
        var i = this;
        return (i = e.call(this) || this).type = t, i._docOrFields = n, i._inclusive = r, 
        i;
    }
    return t(n, e), n._create = function(t, e, r) {
        return new n(t, e, r);
    }, n.prototype._apply = function(t) {
        var e = Rr(t, this.type, this._docOrFields, this._inclusive);
        return new kn(t.firestore, t.converter, function(t, e) {
            return new Te(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, t.startAt, e);
        }(t._query, e));
    }, n;
}(mr);

function Nr() {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    return Or._create("endBefore", t, 
    /*inclusive=*/ !1);
}

function Dr() {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    return Or._create("endAt", t, 
    /*inclusive=*/ !0);
}

/** Helper function to create a bound from a document or fields */ function Rr(t, e, n, r) {
    if (n[0] = p(n[0]), n[0] instanceof lr) return function(t, e, n, r, i) {
        if (!r) throw new B(N, "Can't use a DocumentSnapshot that doesn't exist for ".concat(n, "()."));
        // Because people expect to continue/end a query at the exact document
        // provided, we need to use the implicit sort order rather than the explicit
        // sort order, because it's guaranteed to contain the document key. That way
        // the position becomes unambiguous and the query continues/ends exactly at
        // the provided document. Without the key (by using the explicit sort
        // orders), multiple documents could match the position, yielding duplicate
        // results.
        for (var o = [], a = 0, u = Se(t); a < u.length; a++) {
            var s = u[a];
            if (s.field.isKeyField()) o.push(zt(e, r.key)); else {
                var c = r.data.field(s.field);
                if (Rt(c)) throw new B(F, 'Invalid query. You are trying to start or end a query using a document for which the field "' + s.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');
                if (null === c) {
                    var l = s.field.canonicalString();
                    throw new B(F, "Invalid query. You are trying to start or end a query using a document for which the field '".concat(l, "' (used as the orderBy) does not exist."));
                }
                o.push(c);
            }
        }
        return new Ht(o, i);
    }(t._query, t.firestore._databaseId, e, n[0]._document, r);
    var i = Kn(t.firestore);
    return function(t, e, n, r, i, o) {
        // Use explicit order by's because it has to match the query the user made
        var a = t.explicitOrderBy;
        if (i.length > a.length) throw new B(F, "Too many arguments provided to ".concat(r, "(). The number of arguments must be less than or equal to the number of orderBy() clauses"));
        for (var u = [], s = 0; s < i.length; s++) {
            var c = i[s];
            if (a[s].field.isKeyField()) {
                if ("string" != typeof c) throw new B(F, "Invalid query. Expected a string for document ID in ".concat(r, "(), but got a ").concat(typeof c));
                if (!Ee(t) && -1 !== c.indexOf("/")) throw new B(F, "Invalid query. When querying a collection and ordering by documentId(), the value passed to ".concat(r, "() must be a plain document ID, but '").concat(c, "' contains a slash."));
                var l = t.path.child(et.fromString(c));
                if (!it.isDocumentKey(l)) throw new B(F, "Invalid query. When querying a collection group and ordering by documentId(), the value passed to ".concat(r, "() must result in a valid document path, but '").concat(l, "' is not because it contains an odd number of segments."));
                var f = new it(l);
                u.push(zt(e, f));
            } else {
                var h = tr(n, r, c);
                u.push(h);
            }
        }
        return new Ht(u, o);
    }(t._query, t.firestore._databaseId, i, e, n, r);
}

function qr(t, e, n) {
    if ("string" == typeof (n = p(n))) {
        if ("" === n) throw new B(F, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
        if (!Ee(e) && -1 !== n.indexOf("/")) throw new B(F, "Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '".concat(n, "' contains a '/' character."));
        var r = e.path.child(et.fromString(n));
        if (!it.isDocumentKey(r)) throw new B(F, "Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '".concat(r, "' is not because it has an odd number of segments (").concat(r.length, ")."));
        return zt(t, new it(r));
    }
    if (n instanceof In) return zt(t, n._key);
    throw new B(F, "Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ".concat(st(n), "."));
}

/**
 * Validates that the value passed into a disjunctive filter satisfies all
 * array requirements.
 */ function xr(t, e) {
    if (!Array.isArray(t) || 0 === t.length) throw new B(F, "Invalid Query. A non-empty array is required for '".concat(e.toString(), "' filters."));
}

/**
 * Given an operator, returns the set of operators that cannot be used with it.
 *
 * This is not a comprehensive check, and this function should be removed in the
 * long term. Validations should occur in the Firestore backend.
 *
 * Operators in a query must adhere to the following set of rules:
 * 1. Only one inequality per query.
 * 2. `NOT_IN` cannot be used with array, disjunctive, or `NOT_EQUAL` operators.
 */ function Cr(t, e) {
    var n = function(t, e) {
        for (var n = 0, r = t; n < r.length; n++) for (var i = 0, o = r[n].getFlattenedFilters(); i < o.length; i++) {
            var a = o[i];
            if (e.indexOf(a.op) >= 0) return a.op;
        }
        return null;
    }(t.filters, function(t) {
        switch (t) {
          case "!=" /* Operator.NOT_EQUAL */ :
            return [ "!=" /* Operator.NOT_EQUAL */ , "not-in" /* Operator.NOT_IN */ ];

          case "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ :
          case "in" /* Operator.IN */ :
            return [ "not-in" /* Operator.NOT_IN */ ];

          case "not-in" /* Operator.NOT_IN */ :
            return [ "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ , "in" /* Operator.IN */ , "not-in" /* Operator.NOT_IN */ , "!=" /* Operator.NOT_EQUAL */ ];

          default:
            return [];
        }
    }(e.op));
    if (null !== n) 
    // Special case when it's a duplicate op to give a slightly clearer error message.
    throw n === e.op ? new B(F, "Invalid query. You cannot use more than one '".concat(e.op.toString(), "' filter.")) : new B(F, "Invalid query. You cannot use '".concat(e.op.toString(), "' filters with '").concat(n.toString(), "' filters."));
}

function Lr(t, e) {
    if (!(e instanceof gr || e instanceof br)) throw new B(F, "Function ".concat(t, "() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'."));
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
 * Converts custom model object of type T into `DocumentData` by applying the
 * converter if it exists.
 *
 * This function is used when converting user objects to `DocumentData`
 * because we want to provide the user with a more specific error message if
 * their `set()` or fails due to invalid data originating from a `toFirestore()`
 * call.
 */ function jr(t, e, n) {
    // Cast to `any` in order to satisfy the union type constraint on
    // toFirestore().
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return t ? n && (n.merge || n.mergeFields) ? t.toFirestore(e, n) : t.toFirestore(e) : e;
}

var Mr = /** @class */ function(e) {
    function n(t) {
        var n = this;
        return (n = e.call(this) || this).firestore = t, n;
    }
    return t(n, e), n.prototype.convertBytes = function(t) {
        return new Dn(t);
    }, n.prototype.convertReference = function(t) {
        var e = this.convertDocumentKey(t, this.firestore._databaseId);
        return new In(this.firestore, /* converter= */ null, e);
    }, n;
}(/** @class */ function() {
    function t() {}
    return t.prototype.convertValue = function(t, e) {
        switch (void 0 === e && (e = "none"), Lt(t)) {
          case 0 /* TypeOrder.NullValue */ :
            return null;

          case 1 /* TypeOrder.BooleanValue */ :
            return t.booleanValue;

          case 2 /* TypeOrder.NumberValue */ :
            return Ot(t.integerValue || t.doubleValue);

          case 3 /* TypeOrder.TimestampValue */ :
            return this.convertTimestamp(t.timestampValue);

          case 4 /* TypeOrder.ServerTimestampValue */ :
            return this.convertServerTimestamp(t, e);

          case 5 /* TypeOrder.StringValue */ :
            return t.stringValue;

          case 6 /* TypeOrder.BlobValue */ :
            return this.convertBytes(Nt(t.bytesValue));

          case 7 /* TypeOrder.RefValue */ :
            return this.convertReference(t.referenceValue);

          case 8 /* TypeOrder.GeoPointValue */ :
            return this.convertGeoPoint(t.geoPointValue);

          case 9 /* TypeOrder.ArrayValue */ :
            return this.convertArray(t.arrayValue, e);

          case 10 /* TypeOrder.ObjectValue */ :
            return this.convertObject(t.mapValue, e);

          default:
            throw k();
        }
    }, t.prototype.convertObject = function(t, e) {
        return this.convertObjectMap(t.fields, e);
    }, 
    /**
     * @internal
     */
    t.prototype.convertObjectMap = function(t, e) {
        var n = this;
        void 0 === e && (e = "none");
        var r = {};
        return It(t, (function(t, i) {
            r[t] = n.convertValue(i, e);
        })), r;
    }, t.prototype.convertGeoPoint = function(t) {
        return new Cn(Ot(t.latitude), Ot(t.longitude));
    }, t.prototype.convertArray = function(t, e) {
        var n = this;
        return (t.values || []).map((function(t) {
            return n.convertValue(t, e);
        }));
    }, t.prototype.convertServerTimestamp = function(t, e) {
        switch (e) {
          case "previous":
            var n = qt(t);
            return null == n ? null : this.convertValue(n, e);

          case "estimate":
            return this.convertTimestamp(xt(t));

          default:
            return null;
        }
    }, t.prototype.convertTimestamp = function(t) {
        var e = Ft(t);
        return new Dt(e.seconds, e.nanos);
    }, t.prototype.convertDocumentKey = function(t, e) {
        var n = et.fromString(t);
        I(cn(n));
        var r = new $(n.get(1), n.get(3)), i = new it(n.popFirst(5));
        return r.isEqual(e) || 
        // TODO(b/64130202): Somehow support foreign references.
        T("Document ".concat(i, " contains a document reference within a different database (").concat(r.projectId, "/").concat(r.database, ") which is not supported. It will be treated as a reference in the current database (").concat(e.projectId, "/").concat(e.database, ") instead.")), 
        i;
    }, t;
}());

/**
 * Reads the document referred to by the specified document reference.
 *
 * All documents are directly fetched from the server, even if the document was
 * previously read or modified. Recent modifications are only reflected in the
 * retrieved `DocumentSnapshot` if they have already been applied by the
 * backend. If the client is offline, the read fails. If you like to use
 * caching or see local modifications, please use the full Firestore SDK.
 *
 * @param reference - The reference of the document to fetch.
 * @returns A Promise resolved with a `DocumentSnapshot` containing the current
 * document contents.
 */ function Ur(t) {
    var e = mn((t = ct(t, In)).firestore), n = new Mr(t.firestore);
    return dn(e, [ t._key ]).then((function(e) {
        I(1 === e.length);
        var r = e[0];
        return new lr(t.firestore, n, t._key, r.isFoundDocument() ? r : null, t.converter);
    }));
}

/**
 * Executes the query and returns the results as a {@link QuerySnapshot}.
 *
 * All queries are executed directly by the server, even if the the query was
 * previously executed. Recent modifications are only reflected in the retrieved
 * results if they have already been applied by the backend. If the client is
 * offline, the operation fails. To see previously cached result and local
 * modifications, use the full Firestore SDK.
 *
 * @param query - The `Query` to execute.
 * @returns A Promise that will be resolved with the results of the query.
 */ function Br(t) {
    !function(t) {
        if ("L" /* LimitType.Last */ === t.limitType && 0 === t.explicitOrderBy.length) throw new B(j, "limitToLast() queries require specifying at least one orderBy() clause");
    }((t = ct(t, kn))._query);
    var r = mn(t.firestore), i = new Mr(t.firestore);
    return function(t, r) {
        return e(this, void 0, void 0, (function() {
            var e, i;
            return n(this, (function(n) {
                switch (n.label) {
                  case 0:
                    return e = A(t), i = en(e.serializer, ke(r)), [ 4 /*yield*/ , e.g("RunQuery", i.parent, {
                        structuredQuery: i.structuredQuery
                    }) ];

                  case 1:
                    return [ 2 /*return*/ , n.sent().filter((function(t) {
                        return !!t.document;
                    })).map((function(t) {
                        return function(t, e, n) {
                            var r = Xe(t, e.name), i = Ye(e.updateTime), o = e.createTime ? Ye(e.createTime) : fe.min(), a = new ge({
                                mapValue: {
                                    fields: e.fields
                                }
                            }), u = we.newFoundDocument(r, i, o, a);
                            return n && u.setHasCommittedMutations(), n ? u.setHasCommittedMutations() : u;
                        }(e.serializer, t.document, void 0);
                    })) ];
                }
            }));
        }));
    }(r, t._query).then((function(e) {
        var n = e.map((function(e) {
            return new fr(t.firestore, i, e.key, e, t.converter);
        }));
        return "L" /* LimitType.Last */ === t._query.limitType && 
        // Limit to last queries reverse the orderBy constraint that was
        // specified by the user. As such, we need to reverse the order of the
        // results to return the documents in the expected order.
        n.reverse(), new hr(t, n);
    }));
}

function zr(t, e, n) {
    var r = jr((t = ct(t, In)).converter, e, n), i = Gn(Kn(t.firestore), "setDoc", t._key, r, null !== t.converter, n);
    return pn(mn(t.firestore), [ i.toMutation(t._key, qe.none()) ]);
}

function Kr(t, e, n) {
    for (var r = [], i = 3; i < arguments.length; i++) r[i - 3] = arguments[i];
    var o, a = Kn((t = ct(t, In)).firestore);
    // For Compat types, we have to "extract" the underlying types before
    // performing validation.
        return o = "string" == typeof (e = p(e)) || e instanceof Rn ? $n(a, "updateDoc", t._key, e, n, r) : Zn(a, "updateDoc", t._key, e), 
    pn(mn(t.firestore), [ o.toMutation(t._key, qe.exists(!0)) ]);
}

/**
 * Deletes the document referred to by the specified `DocumentReference`.
 *
 * The deletion will only be reflected in document reads that occur after the
 * returned promise resolves. If the client is offline, the
 * delete fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the document to delete.
 * @returns A `Promise` resolved once the document has been successfully
 * deleted from the backend.
 */ function Gr(t) {
    return pn(mn((t = ct(t, In)).firestore), [ new je(t._key, qe.none()) ]);
}

/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * The result of this write will only be reflected in document reads that occur
 * after the returned promise resolves. If the client is offline, the
 * write fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @throws Error - If the provided input is not a valid Firestore document.
 * @returns A `Promise` resolved with a `DocumentReference` pointing to the
 * newly created document after it has been written to the backend.
 */ function Qr(t, e) {
    var n = Fn(t = ct(t, An)), r = jr(t.converter, e), i = Gn(Kn(t.firestore), "addDoc", n._key, r, null !== n.converter, {});
    return pn(mn(t.firestore), [ i.toMutation(n._key, qe.exists(!1)) ]).then((function() {
        return n;
    }));
}

/**
 * @license
 * Copyright 2022 Google LLC
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
 * Calculates the number of documents in the result set of the given query,
 * without actually downloading the documents.
 *
 * Using this function to count the documents is efficient because only the
 * final count, not the documents' data, is downloaded. This function can even
 * count the documents if the result set would be prohibitively large to
 * download entirely (e.g. thousands of documents).
 *
 * @param query - The query whose result set size to calculate.
 * @returns A Promise that will be resolved with the count; the count can be
 * retrieved from `snapshot.data().count`, where `snapshot` is the
 * `AggregateQuerySnapshot` to which the returned Promise resolves.
 */ function Wr(t) {
    return Yr(t, {
        count: Xr()
    });
}

/**
 * Calculates the specified aggregations over the documents in the result
 * set of the given query, without actually downloading the documents.
 *
 * Using this function to perform aggregations is efficient because only the
 * final aggregation values, not the documents' data, are downloaded. This
 * function can even perform aggregations of the documents if the result set
 * would be prohibitively large to download entirely (e.g. thousands of documents).
 *
 * @param query The query whose result set to aggregate over.
 * @param aggregateSpec An `AggregateSpec` object that specifies the aggregates
 * to perform over the result set. The AggregateSpec specifies aliases for each
 * aggregate, which can be used to retrieve the aggregate result.
 * @example
 * ```typescript
 * const aggregateSnapshot = await getAggregate(query, {
 *   countOfDocs: count(),
 *   totalHours: sum('hours'),
 *   averageScore: average('score')
 * });
 *
 * const countOfDocs: number = aggregateSnapshot.data().countOfDocs;
 * const totalHours: number = aggregateSnapshot.data().totalHours;
 * const averageScore: number | null = aggregateSnapshot.data().averageScore;
 * ```
 */ function Yr(t, r) {
    var i = ct(t.firestore, gn), o = mn(i), a = function(t, e) {
        var n = [];
        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && n.push(e(t[r], r, t));
        return n;
    }(r, (function(t, e) {
        return new bt(e, t.aggregateType, t._internalFieldPath);
    }));
    // Run the aggregation and convert the results
        return function(t, r, i) {
        return e(this, void 0, void 0, (function() {
            var e, o, a, u, s, c, l, f;
            return n(this, (function(n) {
                switch (n.label) {
                  case 0:
                    return o = A(t), a = function(t, e, n) {
                        var r = en(t, e), i = {}, o = [], a = 0;
                        return n.forEach((function(t) {
                            // Map all client-side aliases to a unique short-form
                            // alias. This avoids issues with client-side aliases that
                            // exceed the 1500-byte string size limit.
                            var e = "aggregate_" + a++;
                            i[e] = t.alias, "count" === t.aggregateType ? o.push({
                                alias: e,
                                count: {}
                            }) : "avg" === t.aggregateType ? o.push({
                                alias: e,
                                avg: {
                                    field: an(t.fieldPath)
                                }
                            }) : "sum" === t.aggregateType && o.push({
                                alias: e,
                                sum: {
                                    field: an(t.fieldPath)
                                }
                            });
                        })), {
                            request: {
                                structuredAggregationQuery: {
                                    aggregations: o,
                                    structuredQuery: r.structuredQuery
                                },
                                parent: r.parent
                            },
                            Z: i
                        };
                    }(o.serializer, function(t) {
                        var e = A(t);
                        return e.O || (
                        // Do not include implicit order-bys for aggregate queries.
                        e.O = Ie(e, t.explicitOrderBy)), e.O;
                    }(r), i), u = a.request, s = a.Z, c = u.parent, o.connection.P || delete u.parent, 
                    [ 4 /*yield*/ , o.g("RunAggregationQuery", c, u, /*expectedResponseCount=*/ 1) ];

                  case 1:
                    return l = n.sent().filter((function(t) {
                        return !!t.result;
                    })), 
                    // Omit RunAggregationQueryResponse that only contain readTimes.
                    I(1 === l.length), f = null === (e = l[0].result) || void 0 === e ? void 0 : e.aggregateFields, 
                    [ 2 /*return*/ , Object.keys(f).reduce((function(t, e) {
                        return t[s[e]] = f[e], t;
                    }), {}) ];
                }
            }));
        }));
    }(o, t._query, a).then((function(e) {
        return function(t, e, n) {
            var r = new Mr(t);
            return new Sn(e, r, n);
        }(i, t, e);
    }));
}

function Hr(t) {
    return new En("sum", or("sum", t));
}

/**
 * Create an AggregateField object that can be used to compute the average of
 * a specified field over a range of documents in the result set of a query.
 * @param field Specifies the field to average across the result set.
 */ function Jr(t) {
    return new En("avg", or("average", t));
}

/**
 * Create an AggregateField object that can be used to compute the count of
 * documents in the result set of a query.
 */ function Xr() {
    return new En("count");
}

/**
 * Compares two 'AggregateField` instances for equality.
 *
 * @param left Compare this AggregateField to the `right`.
 * @param right Compare this AggregateField to the `left`.
 */ function Zr(t, e) {
    var n, r;
    return t instanceof En && e instanceof En && t.aggregateType === e.aggregateType && (null === (n = t._internalFieldPath) || void 0 === n ? void 0 : n.canonicalString()) === (null === (r = e._internalFieldPath) || void 0 === r ? void 0 : r.canonicalString());
}

/**
 * Compares two `AggregateQuerySnapshot` instances for equality.
 *
 * Two `AggregateQuerySnapshot` instances are considered "equal" if they have
 * underlying queries that compare equal, and the same data.
 *
 * @param left - The first `AggregateQuerySnapshot` to compare.
 * @param right - The second `AggregateQuerySnapshot` to compare.
 *
 * @returns `true` if the objects are "equal", as defined above, or `false`
 * otherwise.
 */ function $r(t, e) {
    return Nn(t.query, e.query) && m(t.data(), e.data());
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
 * Returns a sentinel for use with {@link @firebase/firestore/lite#(updateDoc:1)} or
 * {@link @firebase/firestore/lite#(setDoc:1)} with `{merge: true}` to mark a field for deletion.
 */ function ti() {
    return new Qn("deleteField");
}

/**
 * Returns a sentinel used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link @firebase/firestore/lite#(updateDoc:1)} to
 * include a server-generated timestamp in the written data.
 */ function ei() {
    return new Yn("serverTimestamp");
}

/**
 * Returns a special value that can be used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link
 * @firebase/firestore/lite#(updateDoc:1)} that tells the server to union the given elements with any array
 * value that already exists on the server. Each specified element that doesn't
 * already exist in the array will be added to the end. If the field being
 * modified is not already an array it will be overwritten with an array
 * containing exactly the specified elements.
 *
 * @param elements - The elements to union into the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`.
 */ function ni() {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
        return new Hn("arrayUnion", t);
}

/**
 * Returns a special value that can be used with {@link (setDoc:1)} or {@link
 * updateDoc:1} that tells the server to remove the given elements from any
 * array value that already exists on the server. All instances of each element
 * specified will be removed from the array. If the field being modified is not
 * already an array it will be overwritten with an empty array.
 *
 * @param elements - The elements to remove from the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`
 */ function ri() {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
        return new Jn("arrayRemove", t);
}

/**
 * Returns a special value that can be used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link
 * @firebase/firestore/lite#(updateDoc:1)} that tells the server to increment the field's current value by
 * the given value.
 *
 * If either the operand or the current field value uses floating point
 * precision, all arithmetic follows IEEE 754 semantics. If both values are
 * integers, values outside of JavaScript's safe number range
 * (`Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`) are also subject to
 * precision loss. Furthermore, once processed by the Firestore backend, all
 * integer operations are capped between -2^63 and 2^63-1.
 *
 * If the current field value is not of type `number`, or if the field does not
 * yet exist, the transformation sets the field to the given value.
 *
 * @param n - The value to increment by.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`
 */ function ii(t) {
    return new Xn("increment", t);
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
 * A write batch, used to perform multiple writes as a single atomic unit.
 *
 * A `WriteBatch` object can be acquired by calling {@link writeBatch}. It
 * provides methods for adding writes to the write batch. None of the writes
 * will be committed (or visible locally) until {@link WriteBatch.commit} is
 * called.
 */ var oi = /** @class */ function() {
    /** @hideconstructor */
    function t(t, e) {
        this._firestore = t, this._commitHandler = e, this._mutations = [], this._committed = !1, 
        this._dataReader = Kn(t);
    }
    return t.prototype.set = function(t, e, n) {
        this._verifyNotCommitted();
        var r = ai(t, this._firestore), i = jr(r.converter, e, n), o = Gn(this._dataReader, "WriteBatch.set", r._key, i, null !== r.converter, n);
        return this._mutations.push(o.toMutation(r._key, qe.none())), this;
    }, t.prototype.update = function(t, e, n) {
        for (var r = [], i = 3; i < arguments.length; i++) r[i - 3] = arguments[i];
        this._verifyNotCommitted();
        var o, a = ai(t, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                return o = "string" == typeof (e = p(e)) || e instanceof Rn ? $n(this._dataReader, "WriteBatch.update", a._key, e, n, r) : Zn(this._dataReader, "WriteBatch.update", a._key, e), 
        this._mutations.push(o.toMutation(a._key, qe.exists(!0))), this;
    }, 
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    t.prototype.delete = function(t) {
        this._verifyNotCommitted();
        var e = ai(t, this._firestore);
        return this._mutations = this._mutations.concat(new je(e._key, qe.none())), this;
    }, 
    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * The result of these writes will only be reflected in document reads that
     * occur after the returned promise resolves. If the client is offline, the
     * write fails. If you would like to see local modifications or buffer writes
     * until the client is online, use the full Firestore SDK.
     *
     * @returns A `Promise` resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit (note that it won't
     * resolve while you're offline).
     */
    t.prototype.commit = function() {
        return this._verifyNotCommitted(), this._committed = !0, this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve();
    }, t.prototype._verifyNotCommitted = function() {
        if (this._committed) throw new B(x, "A write batch can no longer be used after commit() has been called.");
    }, t;
}();

function ai(t, e) {
    if ((t = p(t)).firestore !== e) throw new B(F, "Provided document reference is from a different Firestore instance.");
    return t;
}

/**
 * Creates a write batch, used for performing multiple writes as a single
 * atomic operation. The maximum number of writes allowed in a single WriteBatch
 * is 500.
 *
 * The result of these writes will only be reflected in document reads that
 * occur after the returned promise resolves. If the client is offline, the
 * write fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @returns A `WriteBatch` that can be used to atomically execute multiple
 * writes.
 */ function ui(t) {
    var e = mn(t = ct(t, gn));
    return new oi(t, (function(t) {
        return pn(e, t);
    }));
}

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
 * Internal transaction object responsible for accumulating the mutations to
 * perform and the base versions for any documents read.
 */ var si = /** @class */ function() {
    function t(t) {
        this.datastore = t, 
        // The version of each document that was read during this transaction.
        this.readVersions = new Map, this.mutations = [], this.committed = !1, 
        /**
             * A deferred usage error that occurred previously in this transaction that
             * will cause the transaction to fail once it actually commits.
             */
        this.lastWriteError = null, 
        /**
             * Set of documents that have been written in the transaction.
             *
             * When there's more than one write to the same key in a transaction, any
             * writes after the first are handled differently.
             */
        this.writtenDocs = new Set;
    }
    return t.prototype.lookup = function(t) {
        return e(this, void 0, void 0, (function() {
            var e, r = this;
            return n(this, (function(n) {
                switch (n.label) {
                  case 0:
                    if (this.ensureCommitNotCalled(), this.mutations.length > 0) throw new B(F, "Firestore transactions require all reads to be executed before all writes.");
                    return [ 4 /*yield*/ , dn(this.datastore, t) ];

                  case 1:
                    return [ 2 /*return*/ , ((e = n.sent()).forEach((function(t) {
                        return r.recordVersion(t);
                    })), e) ];
                }
            }));
        }));
    }, t.prototype.set = function(t, e) {
        this.write(e.toMutation(t, this.precondition(t))), this.writtenDocs.add(t.toString());
    }, t.prototype.update = function(t, e) {
        try {
            this.write(e.toMutation(t, this.preconditionForUpdate(t)));
        } catch (t) {
            this.lastWriteError = t;
        }
        this.writtenDocs.add(t.toString());
    }, t.prototype.delete = function(t) {
        this.write(new je(t, this.precondition(t))), this.writtenDocs.add(t.toString());
    }, t.prototype.commit = function() {
        return e(this, void 0, void 0, (function() {
            var t, e = this;
            return n(this, (function(n) {
                switch (n.label) {
                  case 0:
                    if (this.ensureCommitNotCalled(), this.lastWriteError) throw this.lastWriteError;
                    return t = this.readVersions, 
                    // For each mutation, note that the doc was written.
                    this.mutations.forEach((function(e) {
                        t.delete(e.key.toString());
                    })), 
                    // For each document that was read but not written to, we want to perform
                    // a `verify` operation.
                    t.forEach((function(t, n) {
                        var r = it.fromPath(n);
                        e.mutations.push(new Me(r, e.precondition(r)));
                    })), [ 4 /*yield*/ , pn(this.datastore, this.mutations) ];

                  case 1:
                    // For each mutation, note that the doc was written.
                    return n.sent(), this.committed = !0, [ 2 /*return*/ ];
                }
            }));
        }));
    }, t.prototype.recordVersion = function(t) {
        var e;
        if (t.isFoundDocument()) e = t.version; else {
            if (!t.isNoDocument()) throw k();
            // Represent a deleted doc using SnapshotVersion.min().
                        e = fe.min();
        }
        var n = this.readVersions.get(t.key.toString());
        if (n) {
            if (!e.isEqual(n)) 
            // This transaction will fail no matter what.
            throw new B(C, "Document version changed between two reads.");
        } else this.readVersions.set(t.key.toString(), e);
    }, 
    /**
     * Returns the version of this document when it was read in this transaction,
     * as a precondition, or no precondition if it was not read.
     */
    t.prototype.precondition = function(t) {
        var e = this.readVersions.get(t.toString());
        return !this.writtenDocs.has(t.toString()) && e ? e.isEqual(fe.min()) ? qe.exists(!1) : qe.updateTime(e) : qe.none();
    }, 
    /**
     * Returns the precondition for a document if the operation is an update.
     */
    t.prototype.preconditionForUpdate = function(t) {
        var e = this.readVersions.get(t.toString());
        // The first time a document is written, we want to take into account the
        // read time and existence
                if (!this.writtenDocs.has(t.toString()) && e) {
            if (e.isEqual(fe.min())) 
            // The document doesn't exist, so fail the transaction.
            // This has to be validated locally because you can't send a
            // precondition that a document does not exist without changing the
            // semantics of the backend write to be an insert. This is the reverse
            // of what we want, since we want to assert that the document doesn't
            // exist but then send the update and have it fail. Since we can't
            // express that to the backend, we have to validate locally.
            // Note: this can change once we can send separate verify writes in the
            // transaction.
            throw new B(F, "Can't update a document that doesn't exist.");
            // Document exists, base precondition on document update time.
                        return qe.updateTime(e);
        }
        // Document was not read, so we just use the preconditions for a blind
        // update.
                return qe.exists(!0);
    }, t.prototype.write = function(t) {
        this.ensureCommitNotCalled(), this.mutations.push(t);
    }, t.prototype.ensureCommitNotCalled = function() {}, t;
}(), ci = {
    maxAttempts: 5
}, li = /** @class */ function() {
    function t(t, e, n, r, i) {
        this.asyncQueue = t, this.datastore = e, this.options = n, this.updateFunction = r, 
        this.deferred = i, this.ft = n.maxAttempts, this.Et = new fn(this.asyncQueue, "transaction_retry" /* TimerId.TransactionRetry */)
        /** Runs the transaction and sets the result on deferred. */;
    }
    return t.prototype.run = function() {
        this.ft -= 1, this.At();
    }, t.prototype.At = function() {
        var t = this;
        this.Et.K((function() {
            return e(t, void 0, void 0, (function() {
                var t, e, r = this;
                return n(this, (function(n) {
                    return t = new si(this.datastore), (e = this.Tt(t)) && e.then((function(e) {
                        r.asyncQueue.enqueueAndForget((function() {
                            return t.commit().then((function() {
                                r.deferred.resolve(e);
                            })).catch((function(t) {
                                r.Pt(t);
                            }));
                        }));
                    })).catch((function(t) {
                        r.Pt(t);
                    })), [ 2 /*return*/ ];
                }));
            }));
        }));
    }, t.prototype.Tt = function(t) {
        try {
            var e = this.updateFunction(t);
            return !pt(e) && e.catch && e.then ? e : (this.deferred.reject(Error("Transaction callback must return a Promise")), 
            null);
        } catch (t) {
            // Do not retry errors thrown by user provided updateFunction.
            return this.deferred.reject(t), null;
        }
    }, t.prototype.Pt = function(t) {
        var e = this;
        this.ft > 0 && this.Rt(t) ? (this.ft -= 1, this.asyncQueue.enqueueAndForget((function() {
            return e.At(), Promise.resolve();
        }))) : this.deferred.reject(t);
    }, t.prototype.Rt = function(t) {
        if ("FirebaseError" === t.name) {
            // In transactions, the backend will fail outdated reads with FAILED_PRECONDITION and
            // non-matching document versions with ABORTED. These errors should be retried.
            var e = t.code;
            return "aborted" === e || "failed-precondition" === e || "already-exists" === e || !
            /**
 * Determines whether an error code represents a permanent error when received
 * in response to a non-write operation.
 *
 * See isPermanentWriteError for classifying write errors.
 */
            function(t) {
                switch (t) {
                  default:
                    return k();

                  case P:
                  case V:
                  case O:
                  case q:
                  case M:
                  case U:
 // Unauthenticated means something went wrong with our token and we need
                    // to retry with new credentials which will happen automatically.
                                      case R:
                    return !1;

                  case F:
                  case N:
                  case "already-exists":
                  case D:
                  case x:
 // Aborted might be retried in some scenarios, but that is dependant on
                    // the context and should handled individually by the calling code.
                    // See https://cloud.google.com/apis/design/errors.
                                      case C:
                  case L:
                  case j:
                  case "data-loss":
                    return !0;
                }
            }(e);
        }
        return !1;
    }, t;
}();

/**
 * @license
 * Copyright 2022 Google LLC
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
/** The Platform's 'document' implementation or null if not available. */ function fi() {
    // `document` is not always available, e.g. in ReactNative and WebWorkers.
    // eslint-disable-next-line no-restricted-globals
    return "undefined" != typeof document ? document : null;
}

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
 * Represents an operation scheduled to be run in the future on an AsyncQueue.
 *
 * It is created via DelayedOperation.createAndSchedule().
 *
 * Supports cancellation (via cancel()) and early execution (via skipDelay()).
 *
 * Note: We implement `PromiseLike` instead of `Promise`, as the `Promise` type
 * in newer versions of TypeScript defines `finally`, which is not available in
 * IE.
 */ var hi, pi = /** @class */ function() {
    function t(t, e, n, r, i) {
        this.asyncQueue = t, this.timerId = e, this.targetTimeMs = n, this.op = r, this.removalCallback = i, 
        this.deferred = new z, this.then = this.deferred.promise.then.bind(this.deferred.promise), 
        // It's normal for the deferred promise to be canceled (due to cancellation)
        // and so we attach a dummy catch callback to avoid
        // 'UnhandledPromiseRejectionWarning' log spam.
        this.deferred.promise.catch((function(t) {}));
    }
    return Object.defineProperty(t.prototype, "promise", {
        get: function() {
            return this.deferred.promise;
        },
        enumerable: !1,
        configurable: !0
    }), 
    /**
     * Creates and returns a DelayedOperation that has been scheduled to be
     * executed on the provided asyncQueue after the provided delayMs.
     *
     * @param asyncQueue - The queue to schedule the operation on.
     * @param id - A Timer ID identifying the type of operation this is.
     * @param delayMs - The delay (ms) before the operation should be scheduled.
     * @param op - The operation to run.
     * @param removalCallback - A callback to be called synchronously once the
     *   operation is executed or canceled, notifying the AsyncQueue to remove it
     *   from its delayedOperations list.
     *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
     *   the DelayedOperation class public.
     */
    t.createAndSchedule = function(e, n, r, i, o) {
        var a = new t(e, n, Date.now() + r, i, o);
        return a.start(r), a;
    }, 
    /**
     * Starts the timer. This is called immediately after construction by
     * createAndSchedule().
     */
    t.prototype.start = function(t) {
        var e = this;
        this.timerHandle = setTimeout((function() {
            return e.handleDelayElapsed();
        }), t);
    }, 
    /**
     * Queues the operation to run immediately (if it hasn't already been run or
     * canceled).
     */
    t.prototype.skipDelay = function() {
        return this.handleDelayElapsed();
    }, 
    /**
     * Cancels the operation if it hasn't already been executed or canceled. The
     * promise will be rejected.
     *
     * As long as the operation has not yet been run, calling cancel() provides a
     * guarantee that the operation will not be run.
     */
    t.prototype.cancel = function(t) {
        null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new B(P, "Operation cancelled" + (t ? ": " + t : ""))));
    }, t.prototype.handleDelayElapsed = function() {
        var t = this;
        this.asyncQueue.enqueueAndForget((function() {
            return null !== t.timerHandle ? (t.clearTimeout(), t.op().then((function(e) {
                return t.deferred.resolve(e);
            }))) : Promise.resolve();
        }));
    }, t.prototype.clearTimeout = function() {
        null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), 
        this.timerHandle = null);
    }, t;
}(), di = /** @class */ function() {
    function t() {
        var t = this;
        // The last promise in the queue.
                this.It = Promise.resolve(), 
        // A list of retryable operations. Retryable operations are run in order and
        // retried with backoff.
        this.Vt = [], 
        // Is this AsyncQueue being shut down? Once it is set to true, it will not
        // be changed again.
        this.yt = !1, 
        // Operations scheduled to be queued in the future. Operations are
        // automatically removed after they are run or canceled.
        this.wt = [], 
        // visible for testing
        this.gt = null, 
        // Flag set while there's an outstanding AsyncQueue operation, used for
        // assertion sanity-checks.
        this.Ft = !1, 
        // Enabled during shutdown on Safari to prevent future access to IndexedDB.
        this.vt = !1, 
        // List of TimerIds to fast-forward delays for.
        this.Dt = [], 
        // Backoff timer used to schedule retries for retryable operations
        this.Et = new fn(this, "async_queue_retry" /* TimerId.AsyncQueueRetry */), 
        // Visibility handler that triggers an immediate retry of all retryable
        // operations. Meant to speed up recovery when we regain file system access
        // after page comes into foreground.
        this.bt = function() {
            var e = fi();
            e && _("AsyncQueue", "Visibility state changed to " + e.visibilityState), t.Et.H();
        };
        var e = fi();
        e && "function" == typeof e.addEventListener && e.addEventListener("visibilitychange", this.bt);
    }
    return Object.defineProperty(t.prototype, "isShuttingDown", {
        get: function() {
            return this.yt;
        },
        enumerable: !1,
        configurable: !0
    }), 
    /**
     * Adds a new operation to the queue without waiting for it to complete (i.e.
     * we ignore the Promise result).
     */
    t.prototype.enqueueAndForget = function(t) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.enqueue(t);
    }, t.prototype.enqueueAndForgetEvenWhileRestricted = function(t) {
        this.Ct(), 
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.St(t);
    }, t.prototype.enterRestrictedMode = function(t) {
        if (!this.yt) {
            this.yt = !0, this.vt = t || !1;
            var e = fi();
            e && "function" == typeof e.removeEventListener && e.removeEventListener("visibilitychange", this.bt);
        }
    }, t.prototype.enqueue = function(t) {
        var e = this;
        if (this.Ct(), this.yt) 
        // Return a Promise which never resolves.
        return new Promise((function() {}));
        // Create a deferred Promise that we can return to the callee. This
        // allows us to return a "hanging Promise" only to the callee and still
        // advance the queue even when the operation is not run.
                var n = new z;
        return this.St((function() {
            return e.yt && e.vt ? Promise.resolve() : (t().then(n.resolve, n.reject), n.promise);
        })).then((function() {
            return n.promise;
        }));
    }, t.prototype.enqueueRetryable = function(t) {
        var e = this;
        this.enqueueAndForget((function() {
            return e.Vt.push(t), e.Nt();
        }));
    }, 
    /**
     * Runs the next operation from the retryable queue. If the operation fails,
     * reschedules with backoff.
     */
    t.prototype.Nt = function() {
        return e(this, void 0, void 0, (function() {
            var t, e = this;
            return n(this, (function(n) {
                switch (n.label) {
                  case 0:
                    if (0 === this.Vt.length) return [ 3 /*break*/ , 5 ];
                    n.label = 1;

                  case 1:
                    return n.trys.push([ 1, 3, , 4 ]), [ 4 /*yield*/ , this.Vt[0]() ];

                  case 2:
                    return n.sent(), this.Vt.shift(), this.Et.reset(), [ 3 /*break*/ , 4 ];

                  case 3:
                    if (t = n.sent(), "IndexedDbTransactionError" !== t.name) throw t;
                    // Failure will be handled by AsyncQueue
                                        return _("AsyncQueue", "Operation failed with retryable error: " + t), 
                    [ 3 /*break*/ , 4 ];

                  case 4:
                    this.Vt.length > 0 && 
                    // If there are additional operations, we re-schedule `retryNextOp()`.
                    // This is necessary to run retryable operations that failed during
                    // their initial attempt since we don't know whether they are already
                    // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
                    // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
                    // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
                    // call scheduled here.
                    // Since `backoffAndRun()` cancels an existing backoff and schedules a
                    // new backoff on every call, there is only ever a single additional
                    // operation in the queue.
                    this.Et.K((function() {
                        return e.Nt();
                    })), n.label = 5;

                  case 5:
                    return [ 2 /*return*/ ];
                }
            }));
        }));
    }, t.prototype.St = function(t) {
        var e = this, n = this.It.then((function() {
            return e.Ft = !0, t().catch((function(t) {
                e.gt = t, e.Ft = !1;
                var n = 
                /**
 * Chrome includes Error.message in Error.stack. Other browsers do not.
 * This returns expected output of message + stack when available.
 * @param error - Error or FirestoreError
 */
                function(t) {
                    var e = t.message || "";
                    return t.stack && (e = t.stack.includes(t.message) ? t.stack : t.message + "\n" + t.stack), 
                    e;
                }(t);
                // Re-throw the error so that this.tail becomes a rejected Promise and
                // all further attempts to chain (via .then) will just short-circuit
                // and return the rejected Promise.
                                throw T("INTERNAL UNHANDLED ERROR: ", n), t;
            })).then((function(t) {
                return e.Ft = !1, t;
            }));
        }));
        return this.It = n, n;
    }, t.prototype.enqueueAfterDelay = function(t, e, n) {
        var r = this;
        this.Ct(), 
        // Fast-forward delays for timerIds that have been overriden.
        this.Dt.indexOf(t) > -1 && (e = 0);
        var i = pi.createAndSchedule(this, t, e, n, (function(t) {
            return r.Ot(t);
        }));
        return this.wt.push(i), i;
    }, t.prototype.Ct = function() {
        this.gt && k();
    }, t.prototype.verifyOperationInProgress = function() {}, 
    /**
     * Waits until all currently queued tasks are finished executing. Delayed
     * operations are not run.
     */
    t.prototype.qt = function() {
        return e(this, void 0, void 0, (function() {
            var t;
            return n(this, (function(e) {
                switch (e.label) {
                  case 0:
                    return [ 4 /*yield*/ , t = this.It ];

                  case 1:
                    e.sent(), e.label = 2;

                  case 2:
                    if (t !== this.It) return [ 3 /*break*/ , 0 ];
                    e.label = 3;

                  case 3:
                    return [ 2 /*return*/ ];
                }
            }));
        }));
    }, 
    /**
     * For Tests: Determine if a delayed operation with a particular TimerId
     * exists.
     */
    t.prototype.Bt = function(t) {
        for (var e = 0, n = this.wt; e < n.length; e++) {
            if (n[e].timerId === t) return !0;
        }
        return !1;
    }, 
    /**
     * For Tests: Runs some or all delayed operations early.
     *
     * @param lastTimerId - Delayed operations up to and including this TimerId
     * will be drained. Pass TimerId.All to run all delayed operations.
     * @returns a Promise that resolves once all operations have been run.
     */
    t.prototype.Qt = function(t) {
        var e = this;
        // Note that draining may generate more delayed ops, so we do that first.
                return this.qt().then((function() {
            // Run ops in the same order they'd run if they ran naturally.
            e.wt.sort((function(t, e) {
                return t.targetTimeMs - e.targetTimeMs;
            }));
            for (var n = 0, r = e.wt; n < r.length; n++) {
                var i = r[n];
                if (i.skipDelay(), "all" /* TimerId.All */ !== t && i.timerId === t) break;
            }
            return e.qt();
        }));
    }, 
    /**
     * For Tests: Skip all subsequent delays for a timer id.
     */
    t.prototype.$t = function(t) {
        this.Dt.push(t);
    }, 
    /** Called once a DelayedOperation is run or canceled. */ t.prototype.Ot = function(t) {
        // NOTE: indexOf / slice are O(n), but delayedOperations is expected to be small.
        var e = this.wt.indexOf(t);
        this.wt.splice(e, 1);
    }, t;
}(), yi = /** @class */ function() {
    /** @hideconstructor */
    function t(t, e) {
        this._firestore = t, this._transaction = e, this._dataReader = Kn(t)
        /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */;
    }
    return t.prototype.get = function(t) {
        var e = this, n = ai(t, this._firestore), r = new Mr(this._firestore);
        return this._transaction.lookup([ n._key ]).then((function(t) {
            if (!t || 1 !== t.length) return k();
            var i = t[0];
            if (i.isFoundDocument()) return new lr(e._firestore, r, i.key, i, n.converter);
            if (i.isNoDocument()) return new lr(e._firestore, r, n._key, null, n.converter);
            throw k();
        }));
    }, t.prototype.set = function(t, e, n) {
        var r = ai(t, this._firestore), i = jr(r.converter, e, n), o = Gn(this._dataReader, "Transaction.set", r._key, i, null !== r.converter, n);
        return this._transaction.set(r._key, o), this;
    }, t.prototype.update = function(t, e, n) {
        for (var r = [], i = 3; i < arguments.length; i++) r[i - 3] = arguments[i];
        var o, a = ai(t, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                return o = "string" == typeof (e = p(e)) || e instanceof Rn ? $n(this._dataReader, "Transaction.update", a._key, e, n, r) : Zn(this._dataReader, "Transaction.update", a._key, e), 
        this._transaction.update(a._key, o), this;
    }, 
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    t.prototype.delete = function(t) {
        var e = ai(t, this._firestore);
        return this._transaction.delete(e._key), this;
    }, t;
}();

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
function mi(t, e, n) {
    var r = mn(t = ct(t, gn)), i = Object.assign(Object.assign({}, ci), n);
    !function(t) {
        if (t.maxAttempts < 1) throw new B(F, "Max attempts must be at least 1");
    }(i);
    var o = new z;
    return new li(new di, r, i, (function(n) {
        return e(new yi(t, n));
    }), o).run(), o.promise
    /**
 * Firestore Lite
 *
 * @remarks Firestore Lite is a small online-only SDK that allows read
 * and write access to your Firestore database. All operations connect
 * directly to the backend, and `onSnapshot()` APIs are not supported.
 * @packageDocumentation
 */;
}

hi = "".concat(i, "_lite"), g = hi, o(new c("firestore/lite", (function(t, e) {
    var n = e.instanceIdentifier, r = e.options, i = t.getProvider("app").getImmediate(), o = new gn(new W(t.getProvider("auth-internal")), new X(t.getProvider("app-check-internal")), function(t, e) {
        if (!Object.prototype.hasOwnProperty.apply(t.options, [ "projectId" ])) throw new B(F, '"projectId" not provided in firebase.initializeApp.');
        return new $(t.options.projectId, e);
    }(i, n), i);
    return r && o._setSettings(r), o;
}), "PUBLIC").setMultipleInstances(!0)), 
// RUNTIME_ENV and BUILD_TARGET are replaced by real values during the compilation
a("firestore-lite", "4.4.0", ""), a("firestore-lite", "4.4.0", "esm5");

export { En as AggregateField, Sn as AggregateQuerySnapshot, Dn as Bytes, An as CollectionReference, In as DocumentReference, lr as DocumentSnapshot, Rn as FieldPath, xn as FieldValue, gn as Firestore, B as FirestoreError, Cn as GeoPoint, kn as Query, br as QueryCompositeFilterConstraint, mr as QueryConstraint, fr as QueryDocumentSnapshot, Or as QueryEndAtConstraint, gr as QueryFieldFilterConstraint, kr as QueryLimitConstraint, Er as QueryOrderByConstraint, hr as QuerySnapshot, Pr as QueryStartAtConstraint, Dt as Timestamp, yi as Transaction, oi as WriteBatch, Qr as addDoc, Zr as aggregateFieldEqual, $r as aggregateQuerySnapshotEqual, Tr as and, ri as arrayRemove, ni as arrayUnion, Jr as average, Pn as collection, Vn as collectionGroup, _n as connectFirestoreEmulator, Xr as count, Gr as deleteDoc, ti as deleteField, Fn as doc, qn as documentId, Dr as endAt, Nr as endBefore, Yr as getAggregate, Wr as getCount, Ur as getDoc, Br as getDocs, bn as getFirestore, ii as increment, wn as initializeFirestore, Ir as limit, Ar as limitToLast, _r as or, Sr as orderBy, vr as query, Nn as queryEqual, On as refEqual, mi as runTransaction, ei as serverTimestamp, zr as setDoc, b as setLogLevel, pr as snapshotEqual, Fr as startAfter, Vr as startAt, Hr as sum, Tn as terminate, Kr as updateDoc, wr as where, ui as writeBatch };
//# sourceMappingURL=index.browser.esm5.js.map
