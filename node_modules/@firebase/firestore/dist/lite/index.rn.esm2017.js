import { _getProvider, getApp as t, _removeServiceInstance as e, _registerComponent as r, registerVersion as n, SDK_VERSION as i } from "@firebase/app";

import { Component as s } from "@firebase/component";

import { Logger as o, LogLevel as a } from "@firebase/logger";

import { FirebaseError as u, base64 as _, DecodeBase64StringError as c, getDefaultEmulatorHostnameAndPort as l, createMockUserToken as h, getModularInstance as d, deepEqual as f } from "@firebase/util";

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
 */
class User {
    constructor(t) {
        this.uid = t;
    }
    isAuthenticated() {
        return null != this.uid;
    }
    /**
     * Returns a key representing this user, suitable for inclusion in a
     * dictionary.
     */    toKey() {
        return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
    }
    isEqual(t) {
        return t.uid === this.uid;
    }
}

/** A user with a null UID. */ User.UNAUTHENTICATED = new User(null), 
// TODO(mikelehen): Look into getting a proper uid-equivalent for
// non-FirebaseAuth providers.
User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), 
User.MOCK_USER = new User("mock-user");

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
let E = "10.7.0";

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
const m = new o("@firebase/firestore");

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
 */ function setLogLevel(t) {
    m.setLogLevel(t);
}

function __PRIVATE_logDebug(t, ...e) {
    if (m.logLevel <= a.DEBUG) {
        const r = e.map(__PRIVATE_argToString);
        m.debug(`Firestore (${E}): ${t}`, ...r);
    }
}

function __PRIVATE_logError(t, ...e) {
    if (m.logLevel <= a.ERROR) {
        const r = e.map(__PRIVATE_argToString);
        m.error(`Firestore (${E}): ${t}`, ...r);
    }
}

/**
 * @internal
 */ function __PRIVATE_logWarn(t, ...e) {
    if (m.logLevel <= a.WARN) {
        const r = e.map(__PRIVATE_argToString);
        m.warn(`Firestore (${E}): ${t}`, ...r);
    }
}

/**
 * Converts an additional log parameter to a string representation.
 */ function __PRIVATE_argToString(t) {
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
        return function __PRIVATE_formatJSON(t) {
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
 */ function fail(t = "Unexpected state") {
    // Log the failure in addition to throw an exception, just in case the
    // exception is swallowed.
    const e = `FIRESTORE (${E}) INTERNAL ASSERTION FAILED: ` + t;
    // NOTE: We don't use FirestoreError here because these are internal failures
    // that cannot be handled by the user. (Also it would create a circular
    // dependency between the error and assert modules which doesn't work.)
    throw __PRIVATE_logError(e), new Error(e);
}

/**
 * Fails if the given assertion condition is false, throwing an Error with the
 * given message if it did.
 *
 * Messages are stripped in production builds.
 */ function __PRIVATE_hardAssert(t, e) {
    t || fail();
}

/**
 * Casts `obj` to `T`. In non-production builds, verifies that `obj` is an
 * instance of `T` before casting.
 */ function __PRIVATE_debugCast(t, 
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
 */ const A = "ok", T = "cancelled", P = "unknown", R = "invalid-argument", I = "deadline-exceeded", V = "not-found", p = "already-exists", y = "permission-denied", w = "unauthenticated", g = "resource-exhausted", F = "failed-precondition", v = "aborted", D = "out-of-range", b = "unimplemented", C = "internal", S = "unavailable", N = "data-loss";

/** An error returned by a Firestore operation. */ class FirestoreError extends u {
    /** @hideconstructor */
    constructor(
    /**
     * The backend error code associated with this error.
     */
    t, 
    /**
     * A custom error description.
     */
    e) {
        super(t, e), this.code = t, this.message = e, 
        // HACK: We write a toString property directly because Error is not a real
        // class and so inheritance does not work correctly. We could alternatively
        // do the same "back-door inheritance" trick that FirebaseError does.
        this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
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
 */ class __PRIVATE_Deferred {
    constructor() {
        this.promise = new Promise(((t, e) => {
            this.resolve = t, this.reject = e;
        }));
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
 */ class __PRIVATE_OAuthToken {
    constructor(t, e) {
        this.user = e, this.type = "OAuth", this.headers = new Map, this.headers.set("Authorization", `Bearer ${t}`);
    }
}

/**
 * A CredentialsProvider that always yields an empty token.
 * @internal
 */ class __PRIVATE_EmptyAuthCredentialsProvider {
    getToken() {
        return Promise.resolve(null);
    }
    invalidateToken() {}
    start(t, e) {
        // Fire with initial user.
        t.enqueueRetryable((() => e(User.UNAUTHENTICATED)));
    }
    shutdown() {}
}

/**
 * A CredentialsProvider that always returns a constant token. Used for
 * emulator token mocking.
 */ class __PRIVATE_EmulatorAuthCredentialsProvider {
    constructor(t) {
        this.token = t, 
        /**
         * Stores the listener registered with setChangeListener()
         * This isn't actually necessary since the UID never changes, but we use this
         * to verify the listen contract is adhered to in tests.
         */
        this.changeListener = null;
    }
    getToken() {
        return Promise.resolve(this.token);
    }
    invalidateToken() {}
    start(t, e) {
        this.changeListener = e, 
        // Fire with initial user.
        t.enqueueRetryable((() => e(this.token.user)));
    }
    shutdown() {
        this.changeListener = null;
    }
}

/** Credential provider for the Lite SDK. */ class __PRIVATE_LiteAuthCredentialsProvider {
    constructor(t) {
        this.auth = null, t.onInit((t => {
            this.auth = t;
        }));
    }
    getToken() {
        return this.auth ? this.auth.getToken().then((t => t ? (__PRIVATE_hardAssert("string" == typeof t.accessToken), 
        new __PRIVATE_OAuthToken(t.accessToken, new User(this.auth.getUid()))) : null)) : Promise.resolve(null);
    }
    invalidateToken() {}
    start(t, e) {}
    shutdown() {}
}

/*
 * FirstPartyToken provides a fresh token each time its value
 * is requested, because if the token is too old, requests will be rejected.
 * Technically this may no longer be necessary since the SDK should gracefully
 * recover from unauthenticated errors (see b/33147818 for context), but it's
 * safer to keep the implementation as-is.
 */ class __PRIVATE_FirstPartyToken {
    constructor(t, e, r) {
        this.t = t, this.i = e, this.o = r, this.type = "FirstParty", this.user = User.FIRST_PARTY, 
        this.u = new Map;
    }
    /**
     * Gets an authorization token, using a provided factory function, or return
     * null.
     */    l() {
        return this.o ? this.o() : null;
    }
    get headers() {
        this.u.set("X-Goog-AuthUser", this.t);
        // Use array notation to prevent minification
        const t = this.l();
        return t && this.u.set("Authorization", t), this.i && this.u.set("X-Goog-Iam-Authorization-Token", this.i), 
        this.u;
    }
}

/*
 * Provides user credentials required for the Firestore JavaScript SDK
 * to authenticate the user, using technique that is only available
 * to applications hosted by Google.
 */ class __PRIVATE_FirstPartyAuthCredentialsProvider {
    constructor(t, e, r) {
        this.t = t, this.i = e, this.o = r;
    }
    getToken() {
        return Promise.resolve(new __PRIVATE_FirstPartyToken(this.t, this.i, this.o));
    }
    start(t, e) {
        // Fire with initial uid.
        t.enqueueRetryable((() => e(User.FIRST_PARTY)));
    }
    shutdown() {}
    invalidateToken() {}
}

class AppCheckToken {
    constructor(t) {
        this.value = t, this.type = "AppCheck", this.headers = new Map, t && t.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
    }
}

/** AppCheck token provider for the Lite SDK. */ class __PRIVATE_LiteAppCheckTokenProvider {
    constructor(t) {
        this.h = t, this.appCheck = null, t.onInit((t => {
            this.appCheck = t;
        }));
    }
    getToken() {
        return this.appCheck ? this.appCheck.getToken().then((t => t ? (__PRIVATE_hardAssert("string" == typeof t.token), 
        new AppCheckToken(t.token)) : null)) : Promise.resolve(null);
    }
    invalidateToken() {}
    start(t, e) {}
    shutdown() {}
}

/**
 * Builds a CredentialsProvider depending on the type of
 * the credentials passed in.
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
class DatabaseInfo {
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
    constructor(t, e, r, n, i, s, o, a, u) {
        this.databaseId = t, this.appId = e, this.persistenceKey = r, this.host = n, this.ssl = i, 
        this.forceLongPolling = s, this.autoDetectLongPolling = o, this.longPollingOptions = a, 
        this.useFetchStreams = u;
    }
}

/** The default database name for a project. */
/**
 * Represents the database ID a Firestore client is associated with.
 * @internal
 */
class DatabaseId {
    constructor(t, e) {
        this.projectId = t, this.database = e || "(default)";
    }
    static empty() {
        return new DatabaseId("", "");
    }
    get isDefaultDatabase() {
        return "(default)" === this.database;
    }
    isEqual(t) {
        return t instanceof DatabaseId && t.projectId === this.projectId && t.database === this.database;
    }
}

/**
 * Path represents an ordered sequence of string segments.
 */
class BasePath {
    constructor(t, e, r) {
        void 0 === e ? e = 0 : e > t.length && fail(), void 0 === r ? r = t.length - e : r > t.length - e && fail(), 
        this.segments = t, this.offset = e, this.len = r;
    }
    get length() {
        return this.len;
    }
    isEqual(t) {
        return 0 === BasePath.comparator(this, t);
    }
    child(t) {
        const e = this.segments.slice(this.offset, this.limit());
        return t instanceof BasePath ? t.forEach((t => {
            e.push(t);
        })) : e.push(t), this.construct(e);
    }
    /** The index of one past the last segment of the path. */    limit() {
        return this.offset + this.length;
    }
    popFirst(t) {
        return t = void 0 === t ? 1 : t, this.construct(this.segments, this.offset + t, this.length - t);
    }
    popLast() {
        return this.construct(this.segments, this.offset, this.length - 1);
    }
    firstSegment() {
        return this.segments[this.offset];
    }
    lastSegment() {
        return this.get(this.length - 1);
    }
    get(t) {
        return this.segments[this.offset + t];
    }
    isEmpty() {
        return 0 === this.length;
    }
    isPrefixOf(t) {
        if (t.length < this.length) return !1;
        for (let e = 0; e < this.length; e++) if (this.get(e) !== t.get(e)) return !1;
        return !0;
    }
    isImmediateParentOf(t) {
        if (this.length + 1 !== t.length) return !1;
        for (let e = 0; e < this.length; e++) if (this.get(e) !== t.get(e)) return !1;
        return !0;
    }
    forEach(t) {
        for (let e = this.offset, r = this.limit(); e < r; e++) t(this.segments[e]);
    }
    toArray() {
        return this.segments.slice(this.offset, this.limit());
    }
    static comparator(t, e) {
        const r = Math.min(t.length, e.length);
        for (let n = 0; n < r; n++) {
            const r = t.get(n), i = e.get(n);
            if (r < i) return -1;
            if (r > i) return 1;
        }
        return t.length < e.length ? -1 : t.length > e.length ? 1 : 0;
    }
}

/**
 * A slash-separated path for navigating resources (documents and collections)
 * within Firestore.
 *
 * @internal
 */ class ResourcePath extends BasePath {
    construct(t, e, r) {
        return new ResourcePath(t, e, r);
    }
    canonicalString() {
        // NOTE: The client is ignorant of any path segments containing escape
        // sequences (e.g. __id123__) and just passes them through raw (they exist
        // for legacy reasons and should not be used frequently).
        return this.toArray().join("/");
    }
    toString() {
        return this.canonicalString();
    }
    /**
     * Creates a resource path from the given slash-delimited string. If multiple
     * arguments are provided, all components are combined. Leading and trailing
     * slashes from all components are ignored.
     */    static fromString(...t) {
        // NOTE: The client is ignorant of any path segments containing escape
        // sequences (e.g. __id123__) and just passes them through raw (they exist
        // for legacy reasons and should not be used frequently).
        const e = [];
        for (const r of t) {
            if (r.indexOf("//") >= 0) throw new FirestoreError(R, `Invalid segment (${r}). Paths must not contain // in them.`);
            // Strip leading and traling slashed.
                        e.push(...r.split("/").filter((t => t.length > 0)));
        }
        return new ResourcePath(e);
    }
    static emptyPath() {
        return new ResourcePath([]);
    }
}

const O = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

/**
 * A dot-separated path for navigating sub-objects within a document.
 * @internal
 */ class FieldPath$1 extends BasePath {
    construct(t, e, r) {
        return new FieldPath$1(t, e, r);
    }
    /**
     * Returns true if the string could be used as a segment in a field path
     * without escaping.
     */    static isValidIdentifier(t) {
        return O.test(t);
    }
    canonicalString() {
        return this.toArray().map((t => (t = t.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), 
        FieldPath$1.isValidIdentifier(t) || (t = "`" + t + "`"), t))).join(".");
    }
    toString() {
        return this.canonicalString();
    }
    /**
     * Returns true if this field references the key of a document.
     */    isKeyField() {
        return 1 === this.length && "__name__" === this.get(0);
    }
    /**
     * The field designating the key of a document.
     */    static keyField() {
        return new FieldPath$1([ "__name__" ]);
    }
    /**
     * Parses a field string from the given server-formatted string.
     *
     * - Splitting the empty string is not allowed (for now at least).
     * - Empty segments within the string (e.g. if there are two consecutive
     *   separators) are not allowed.
     *
     * TODO(b/37244157): we should make this more strict. Right now, it allows
     * non-identifier path components, even if they aren't escaped.
     */    static fromServerFormat(t) {
        const e = [];
        let r = "", n = 0;
        const __PRIVATE_addCurrentSegment = () => {
            if (0 === r.length) throw new FirestoreError(R, `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
            e.push(r), r = "";
        };
        let i = !1;
        for (;n < t.length; ) {
            const e = t[n];
            if ("\\" === e) {
                if (n + 1 === t.length) throw new FirestoreError(R, "Path has trailing escape character: " + t);
                const e = t[n + 1];
                if ("\\" !== e && "." !== e && "`" !== e) throw new FirestoreError(R, "Path has invalid escape sequence: " + t);
                r += e, n += 2;
            } else "`" === e ? (i = !i, n++) : "." !== e || i ? (r += e, n++) : (__PRIVATE_addCurrentSegment(), 
            n++);
        }
        if (__PRIVATE_addCurrentSegment(), i) throw new FirestoreError(R, "Unterminated ` in path: " + t);
        return new FieldPath$1(e);
    }
    static emptyPath() {
        return new FieldPath$1([]);
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
 * @internal
 */ class DocumentKey {
    constructor(t) {
        this.path = t;
    }
    static fromPath(t) {
        return new DocumentKey(ResourcePath.fromString(t));
    }
    static fromName(t) {
        return new DocumentKey(ResourcePath.fromString(t).popFirst(5));
    }
    static empty() {
        return new DocumentKey(ResourcePath.emptyPath());
    }
    get collectionGroup() {
        return this.path.popLast().lastSegment();
    }
    /** Returns true if the document is in the specified collectionId. */    hasCollectionId(t) {
        return this.path.length >= 2 && this.path.get(this.path.length - 2) === t;
    }
    /** Returns the collection group (i.e. the name of the parent collection) for this key. */    getCollectionGroup() {
        return this.path.get(this.path.length - 2);
    }
    /** Returns the fully qualified path to the parent collection. */    getCollectionPath() {
        return this.path.popLast();
    }
    isEqual(t) {
        return null !== t && 0 === ResourcePath.comparator(this.path, t.path);
    }
    toString() {
        return this.path.toString();
    }
    static comparator(t, e) {
        return ResourcePath.comparator(t.path, e.path);
    }
    static isDocumentKey(t) {
        return t.length % 2 == 0;
    }
    /**
     * Creates and returns a new document key with the given segments.
     *
     * @param segments - The segments of the path to the document
     * @returns A new instance of DocumentKey
     */    static fromSegments(t) {
        return new DocumentKey(new ResourcePath(t.slice()));
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
 */ function __PRIVATE_validateNonEmptyArgument(t, e, r) {
    if (!r) throw new FirestoreError(R, `Function ${t}() cannot be called with an empty ${e}.`);
}

/**
 * Validates that two boolean options are not set at the same time.
 * @internal
 */
/**
 * Validates that `path` refers to a document (indicated by the fact it contains
 * an even numbers of segments).
 */
function __PRIVATE_validateDocumentPath(t) {
    if (!DocumentKey.isDocumentKey(t)) throw new FirestoreError(R, `Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`);
}

/**
 * Validates that `path` refers to a collection (indicated by the fact it
 * contains an odd numbers of segments).
 */ function __PRIVATE_validateCollectionPath(t) {
    if (DocumentKey.isDocumentKey(t)) throw new FirestoreError(R, `Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`);
}

/**
 * Returns true if it's a non-null object without a custom prototype
 * (i.e. excludes Array, Date, etc.).
 */
/** Returns a string describing the type / value of the provided input. */
function __PRIVATE_valueDescription(t) {
    if (void 0 === t) return "undefined";
    if (null === t) return "null";
    if ("string" == typeof t) return t.length > 20 && (t = `${t.substring(0, 20)}...`), 
    JSON.stringify(t);
    if ("number" == typeof t || "boolean" == typeof t) return "" + t;
    if ("object" == typeof t) {
        if (t instanceof Array) return "an array";
        {
            const e = 
            /** try to get the constructor name for an object. */
            function __PRIVATE_tryGetCustomObjectType(t) {
                if (t.constructor) return t.constructor.name;
                return null;
            }
            /**
 * Casts `obj` to `T`, optionally unwrapping Compat types to expose the
 * underlying instance. Throws if  `obj` is not an instance of `T`.
 *
 * This cast is used in the Lite and Full SDK to verify instance types for
 * arguments passed to the public API.
 * @internal
 */ (t);
            return e ? `a custom ${e} object` : "an object";
        }
    }
    return "function" == typeof t ? "a function" : fail();
}

function __PRIVATE_cast(t, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
e) {
    if ("_delegate" in t && (
    // Unwrap Compat types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t = t._delegate), !(t instanceof e)) {
        if (e.name === t.constructor.name) throw new FirestoreError(R, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
        {
            const r = __PRIVATE_valueDescription(t);
            throw new FirestoreError(R, `Expected type '${e.name}', but it was: ${r}`);
        }
    }
    return t;
}

function __PRIVATE_validatePositiveNumber(t, e) {
    if (e <= 0) throw new FirestoreError(R, `Function ${t}() requires a positive number, but it was: ${e}.`);
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
 */
function __PRIVATE_cloneLongPollingOptions(t) {
    const e = {};
    return void 0 !== t.timeoutSeconds && (e.timeoutSeconds = t.timeoutSeconds), e;
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
 * The value returned from the most recent invocation of
 * `generateUniqueDebugId()`, or null if it has never been invoked.
 */ let q = null;

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
function __PRIVATE_generateUniqueDebugId() {
    return null === q ? q = function __PRIVATE_generateInitialUniqueDebugId() {
        return 268435456 + Math.round(2147483648 * Math.random());
    }() : q++, "0x" + q.toString(16);
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
 * Returns whether a variable is either undefined or null.
 */ function __PRIVATE_isNullOrUndefined(t) {
    return null == t;
}

/** Returns whether the value represents -0. */ function __PRIVATE_isNegativeZero(t) {
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
 */
const B = {
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
var Q, $;

/**
 * Converts an HTTP Status Code to the equivalent error code.
 *
 * @param status - An HTTP Status Code, like 200, 404, 503, etc.
 * @returns The equivalent Code. Unknown status codes are mapped to
 *     Code.UNKNOWN.
 */
function __PRIVATE_mapCodeFromHttpStatus(t) {
    if (void 0 === t) return __PRIVATE_logError("RPC_ERROR", "HTTP error has no status"), 
    P;
    // The canonical error codes for Google APIs [1] specify mapping onto HTTP
    // status codes but the mapping is not bijective. In each case of ambiguity
    // this function chooses a primary error.
    
    // [1]
    // https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
        switch (t) {
      case 200:
        // OK
        return A;

      case 400:
        // Bad Request
        return F;

        // Other possibilities based on the forward mapping
        // return Code.INVALID_ARGUMENT;
        // return Code.OUT_OF_RANGE;
              case 401:
        // Unauthorized
        return w;

      case 403:
        // Forbidden
        return y;

      case 404:
        // Not Found
        return V;

      case 409:
        // Conflict
        return v;

        // Other possibilities:
        // return Code.ALREADY_EXISTS;
              case 416:
        // Range Not Satisfiable
        return D;

      case 429:
        // Too Many Requests
        return g;

      case 499:
        // Client Closed Request
        return T;

      case 500:
        // Internal Server Error
        return P;

        // Other possibilities:
        // return Code.INTERNAL;
        // return Code.DATA_LOSS;
              case 501:
        // Unimplemented
        return b;

      case 503:
        // Service Unavailable
        return S;

      case 504:
        // Gateway Timeout
        return I;

      default:
        return t >= 200 && t < 300 ? A : t >= 400 && t < 500 ? F : t >= 500 && t < 600 ? C : P;
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
 */ ($ = Q || (Q = {}))[$.OK = 0] = "OK", $[$.CANCELLED = 1] = "CANCELLED", $[$.UNKNOWN = 2] = "UNKNOWN", 
$[$.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", $[$.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", 
$[$.NOT_FOUND = 5] = "NOT_FOUND", $[$.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", $[$.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", 
$[$.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", $[$.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", 
$[$.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", $[$.ABORTED = 10] = "ABORTED", 
$[$.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", $[$.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", 
$[$.INTERNAL = 13] = "INTERNAL", $[$.UNAVAILABLE = 14] = "UNAVAILABLE", $[$.DATA_LOSS = 15] = "DATA_LOSS";

class __PRIVATE_FetchConnection extends 
/**
 * Base class for all Rest-based connections to the backend (WebChannel and
 * HTTP).
 */
class __PRIVATE_RestConnection {
    constructor(t) {
        this.databaseInfo = t, this.databaseId = t.databaseId;
        const e = t.ssl ? "https" : "http", r = encodeURIComponent(this.databaseId.projectId), n = encodeURIComponent(this.databaseId.database);
        this.m = e + "://" + t.host, this.A = `projects/${r}/databases/${n}`, this.T = "(default)" === this.databaseId.database ? `project_id=${r}` : `project_id=${r}&database_id=${n}`;
    }
    get P() {
        // Both `invokeRPC()` and `invokeStreamingRPC()` use their `path` arguments to determine
        // where to run the query, and expect the `request` to NOT specify the "path".
        return !1;
    }
    R(t, e, r, n, i) {
        const s = __PRIVATE_generateUniqueDebugId(), o = this.I(t, e);
        __PRIVATE_logDebug("RestConnection", `Sending RPC '${t}' ${s}:`, o, r);
        const a = {
            "google-cloud-resource-prefix": this.A,
            "x-goog-request-params": this.T
        };
        return this.V(a, n, i), this.p(t, o, a, r).then((e => (__PRIVATE_logDebug("RestConnection", `Received RPC '${t}' ${s}: `, e), 
        e)), (e => {
            throw __PRIVATE_logWarn("RestConnection", `RPC '${t}' ${s} failed with error: `, e, "url: ", o, "request:", r), 
            e;
        }));
    }
    g(t, e, r, n, i, s) {
        // The REST API automatically aggregates all of the streamed results, so we
        // can just use the normal invoke() method.
        return this.R(t, e, r, n, i);
    }
    /**
     * Modifies the headers for a request, adding any authorization token if
     * present and any additional headers for the request.
     */    V(t, e, r) {
        t["X-Goog-Api-Client"] = 
        // SDK_VERSION is updated to different value at runtime depending on the entry point,
        // so we need to get its value when we need it in a function.
        function __PRIVATE_getGoogApiClientValue() {
            return "gl-js/ fire/" + E;
        }(), 
        // Content-Type: text/plain will avoid preflight requests which might
        // mess with CORS and redirects by proxies. If we add custom headers
        // we will need to change this code to potentially use the $httpOverwrite
        // parameter supported by ESF to avoid triggering preflight requests.
        t["Content-Type"] = "text/plain", this.databaseInfo.appId && (t["X-Firebase-GMPID"] = this.databaseInfo.appId), 
        e && e.headers.forEach(((e, r) => t[r] = e)), r && r.headers.forEach(((e, r) => t[r] = e));
    }
    I(t, e) {
        const r = B[t];
        return `${this.m}/v1/${e}:${r}`;
    }
} {
    /**
     * @param databaseInfo - The connection info.
     * @param fetchImpl - `fetch` or a Polyfill that implements the fetch API.
     */
    constructor(t, e) {
        super(t), this.F = e;
    }
    v(t, e) {
        throw new Error("Not supported by FetchConnection");
    }
    async p(t, e, r, n) {
        var i;
        const s = JSON.stringify(n);
        let o;
        try {
            o = await this.F(e, {
                method: "POST",
                headers: r,
                body: s
            });
        } catch (t) {
            const e = t;
            throw new FirestoreError(__PRIVATE_mapCodeFromHttpStatus(e.status), "Request failed with error: " + e.statusText);
        }
        if (!o.ok) {
            let t = await o.json();
            Array.isArray(t) && (t = t[0]);
            const e = null === (i = null == t ? void 0 : t.error) || void 0 === i ? void 0 : i.message;
            throw new FirestoreError(__PRIVATE_mapCodeFromHttpStatus(o.status), `Request failed with error: ${null != e ? e : o.statusText}`);
        }
        return o.json();
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
class __PRIVATE_AggregateImpl {
    constructor(t, e, r) {
        this.alias = t, this.aggregateType = e, this.fieldPath = r;
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
 * Generates `nBytes` of random bytes.
 *
 * If `nBytes < 0` , an error will be thrown.
 */ function __PRIVATE_randomBytes(t) {
    // Polyfills for IE and WebWorker by using `self` and `msCrypto` when `crypto` is not available.
    const e = 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "undefined" != typeof self && (self.crypto || self.msCrypto), r = new Uint8Array(t);
    if (e && "function" == typeof e.getRandomValues) e.getRandomValues(r); else 
    // Falls back to Math.random
    for (let e = 0; e < t; e++) r[e] = Math.floor(256 * Math.random());
    return r;
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
 */ class __PRIVATE_AutoId {
    static newId() {
        // Alphanumeric characters
        const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t.length) * t.length;
        // The largest byte value that is a multiple of `char.length`.
                let r = "";
        for (;r.length < 20; ) {
            const n = __PRIVATE_randomBytes(40);
            for (let i = 0; i < n.length; ++i) 
            // Only accept values that are [0, maxMultiple), this ensures they can
            // be evenly mapped to indices of `chars` via a modulo operation.
            r.length < 20 && n[i] < e && (r += t.charAt(n[i] % t.length));
        }
        return r;
    }
}

function __PRIVATE_primitiveComparator(t, e) {
    return t < e ? -1 : t > e ? 1 : 0;
}

/** Helper to compare arrays using isEqual(). */ function __PRIVATE_arrayEquals(t, e, r) {
    return t.length === e.length && t.every(((t, n) => r(t, e[n])));
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
 */ function __PRIVATE_objectSize(t) {
    let e = 0;
    for (const r in t) Object.prototype.hasOwnProperty.call(t, r) && e++;
    return e;
}

function forEach(t, e) {
    for (const r in t) Object.prototype.hasOwnProperty.call(t, r) && e(r, t[r]);
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
 */
class __PRIVATE_Base64DecodeError extends Error {
    constructor() {
        super(...arguments), this.name = "Base64DecodeError";
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
// WebSafe uses a different URL-encoding safe alphabet that doesn't match
// the encoding used on the backend.
/** Converts a Base64 encoded string to a binary string. */
function __PRIVATE_decodeBase64(t) {
    try {
        return String.fromCharCode.apply(null, 
        // We use `decodeStringToByteArray()` instead of `decodeString()` since
        // `decodeString()` returns Unicode strings, which doesn't match the values
        // returned by `atob()`'s Latin1 representation.
        _.decodeStringToByteArray(t, false));
    } catch (t) {
        throw t instanceof c ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + t) : t;
    }
}

/** Converts a binary string to a Base64 encoded string. */
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
 */
class ByteString {
    constructor(t) {
        this.binaryString = t;
    }
    static fromBase64String(t) {
        const e = __PRIVATE_decodeBase64(t);
        return new ByteString(e);
    }
    static fromUint8Array(t) {
        // TODO(indexing); Remove the copy of the byte string here as this method
        // is frequently called during indexing.
        const e = 
        /**
 * Helper function to convert an Uint8array to a binary string.
 */
        function __PRIVATE_binaryStringFromUint8Array(t) {
            let e = "";
            for (let r = 0; r < t.length; ++r) e += String.fromCharCode(t[r]);
            return e;
        }
        /**
 * Helper function to convert a binary string to an Uint8Array.
 */ (t);
        return new ByteString(e);
    }
    [Symbol.iterator]() {
        let t = 0;
        return {
            next: () => t < this.binaryString.length ? {
                value: this.binaryString.charCodeAt(t++),
                done: !1
            } : {
                value: void 0,
                done: !0
            }
        };
    }
    toBase64() {
        return function __PRIVATE_encodeBase64(t) {
            const e = [];
            for (let r = 0; r < t.length; r++) e[r] = t.charCodeAt(r);
            return _.encodeByteArray(e, !1);
        }(this.binaryString);
    }
    toUint8Array() {
        return function __PRIVATE_uint8ArrayFromBinaryString(t) {
            const e = new Uint8Array(t.length);
            for (let r = 0; r < t.length; r++) e[r] = t.charCodeAt(r);
            return e;
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
        // A RegExp matching ISO 8601 UTC timestamps with optional fraction.
        (this.binaryString);
    }
    approximateByteSize() {
        return 2 * this.binaryString.length;
    }
    compareTo(t) {
        return __PRIVATE_primitiveComparator(this.binaryString, t.binaryString);
    }
    isEqual(t) {
        return this.binaryString === t.binaryString;
    }
}

ByteString.EMPTY_BYTE_STRING = new ByteString("");

const L = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);

/**
 * Converts the possible Proto values for a timestamp value into a "seconds and
 * nanos" representation.
 */ function __PRIVATE_normalizeTimestamp(t) {
    // The json interface (for the browser) will return an iso timestamp string,
    // while the proto js library (for node) will return a
    // google.protobuf.Timestamp instance.
    if (__PRIVATE_hardAssert(!!t), "string" == typeof t) {
        // The date string can have higher precision (nanos) than the Date class
        // (millis), so we do some custom parsing here.
        // Parse the nanos right out of the string.
        let e = 0;
        const r = L.exec(t);
        if (__PRIVATE_hardAssert(!!r), r[1]) {
            // Pad the fraction out to 9 digits (nanos).
            let t = r[1];
            t = (t + "000000000").substr(0, 9), e = Number(t);
        }
        // Parse the date to get the seconds.
                const n = new Date(t);
        return {
            seconds: Math.floor(n.getTime() / 1e3),
            nanos: e
        };
    }
    return {
        seconds: __PRIVATE_normalizeNumber(t.seconds),
        nanos: __PRIVATE_normalizeNumber(t.nanos)
    };
}

/**
 * Converts the possible Proto types for numbers into a JavaScript number.
 * Returns 0 if the value is not numeric.
 */ function __PRIVATE_normalizeNumber(t) {
    // TODO(bjornick): Handle int64 greater than 53 bits.
    return "number" == typeof t ? t : "string" == typeof t ? Number(t) : 0;
}

/** Converts the possible Proto types for Blobs into a ByteString. */ function __PRIVATE_normalizeByteString(t) {
    return "string" == typeof t ? ByteString.fromBase64String(t) : ByteString.fromUint8Array(t);
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
 */
class Timestamp {
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
    constructor(
    /**
     * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
     */
    t, 
    /**
     * The fractions of a second at nanosecond resolution.*
     */
    e) {
        if (this.seconds = t, this.nanoseconds = e, e < 0) throw new FirestoreError(R, "Timestamp nanoseconds out of range: " + e);
        if (e >= 1e9) throw new FirestoreError(R, "Timestamp nanoseconds out of range: " + e);
        if (t < -62135596800) throw new FirestoreError(R, "Timestamp seconds out of range: " + t);
        // This will break in the year 10,000.
                if (t >= 253402300800) throw new FirestoreError(R, "Timestamp seconds out of range: " + t);
    }
    /**
     * Creates a new timestamp with the current date, with millisecond precision.
     *
     * @returns a new timestamp representing the current date.
     */    static now() {
        return Timestamp.fromMillis(Date.now());
    }
    /**
     * Creates a new timestamp from the given date.
     *
     * @param date - The date to initialize the `Timestamp` from.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     date.
     */    static fromDate(t) {
        return Timestamp.fromMillis(t.getTime());
    }
    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds - Number of milliseconds since Unix epoch
     *     1970-01-01T00:00:00Z.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     number of milliseconds.
     */    static fromMillis(t) {
        const e = Math.floor(t / 1e3), r = Math.floor(1e6 * (t - 1e3 * e));
        return new Timestamp(e, r);
    }
    /**
     * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
     * causes a loss of precision since `Date` objects only support millisecond
     * precision.
     *
     * @returns JavaScript `Date` object representing the same point in time as
     *     this `Timestamp`, with millisecond precision.
     */    toDate() {
        return new Date(this.toMillis());
    }
    /**
     * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
     * epoch). This operation causes a loss of precision.
     *
     * @returns The point in time corresponding to this timestamp, represented as
     *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */    toMillis() {
        return 1e3 * this.seconds + this.nanoseconds / 1e6;
    }
    _compareTo(t) {
        return this.seconds === t.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, t.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, t.seconds);
    }
    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other - The `Timestamp` to compare against.
     * @returns true if this `Timestamp` is equal to the provided one.
     */    isEqual(t) {
        return t.seconds === this.seconds && t.nanoseconds === this.nanoseconds;
    }
    /** Returns a textual representation of this `Timestamp`. */    toString() {
        return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
    }
    /** Returns a JSON-serializable representation of this `Timestamp`. */    toJSON() {
        return {
            seconds: this.seconds,
            nanoseconds: this.nanoseconds
        };
    }
    /**
     * Converts this object to a primitive string, which allows `Timestamp` objects
     * to be compared using the `>`, `<=`, `>=` and `>` operators.
     */    valueOf() {
        // This method returns a string of the form <seconds>.<nanoseconds> where
        // <seconds> is translated to have a non-negative value and both <seconds>
        // and <nanoseconds> are left-padded with zeroes to be a consistent length.
        // Strings with this format then have a lexiographical ordering that matches
        // the expected ordering. The <seconds> translation is done to avoid having
        // a leading negative sign (i.e. a leading '-' character) in its string
        // representation, which would affect its lexiographical ordering.
        const t = this.seconds - -62135596800;
        // Note: Up to 12 decimal digits are required to represent all valid
        // 'seconds' values.
                return String(t).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
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
 */ function __PRIVATE_isServerTimestamp(t) {
    var e, r;
    return "server_timestamp" === (null === (r = ((null === (e = null == t ? void 0 : t.mapValue) || void 0 === e ? void 0 : e.fields) || {}).__type__) || void 0 === r ? void 0 : r.stringValue);
}

/**
 * Returns the value of the field before this ServerTimestamp was set.
 *
 * Preserving the previous values allows the user to display the last resoled
 * value until the backend responds with the timestamp.
 */ function __PRIVATE_getPreviousValue(t) {
    const e = t.mapValue.fields.__previous_value__;
    return __PRIVATE_isServerTimestamp(e) ? __PRIVATE_getPreviousValue(e) : e;
}

/**
 * Returns the local time at which this timestamp was first set.
 */ function __PRIVATE_getLocalWriteTime(t) {
    const e = __PRIVATE_normalizeTimestamp(t.mapValue.fields.__local_write_time__.timestampValue);
    return new Timestamp(e.seconds, e.nanos);
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
 */ const M = {
    fields: {
        __type__: {
            stringValue: "__max__"
        }
    }
};

/** Extracts the backend's type order for the provided value. */
function __PRIVATE_typeOrder(t) {
    return "nullValue" in t ? 0 /* TypeOrder.NullValue */ : "booleanValue" in t ? 1 /* TypeOrder.BooleanValue */ : "integerValue" in t || "doubleValue" in t ? 2 /* TypeOrder.NumberValue */ : "timestampValue" in t ? 3 /* TypeOrder.TimestampValue */ : "stringValue" in t ? 5 /* TypeOrder.StringValue */ : "bytesValue" in t ? 6 /* TypeOrder.BlobValue */ : "referenceValue" in t ? 7 /* TypeOrder.RefValue */ : "geoPointValue" in t ? 8 /* TypeOrder.GeoPointValue */ : "arrayValue" in t ? 9 /* TypeOrder.ArrayValue */ : "mapValue" in t ? __PRIVATE_isServerTimestamp(t) ? 4 /* TypeOrder.ServerTimestampValue */ : 
    /** Returns true if the Value represents the canonical {@link #MAX_VALUE} . */
    function __PRIVATE_isMaxValue(t) {
        return "__max__" === (((t.mapValue || {}).fields || {}).__type__ || {}).stringValue;
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
 * Represents a bound of a query.
 *
 * The bound is specified with the given components representing a position and
 * whether it's just before or just after the position (relative to whatever the
 * query order is).
 *
 * The position represents a logical index position for a query. It's a prefix
 * of values for the (potentially implicit) order by clauses of a query.
 *
 * Bound provides a function to determine whether a document comes before or
 * after a bound. This is influenced by whether the position is just before or
 * just after the provided values.
 */ (t) ? 9007199254740991 /* TypeOrder.MaxValue */ : 10 /* TypeOrder.ObjectValue */ : fail();
}

/** Tests `left` and `right` for equality based on the backend semantics. */ function __PRIVATE_valueEquals(t, e) {
    if (t === e) return !0;
    const r = __PRIVATE_typeOrder(t);
    if (r !== __PRIVATE_typeOrder(e)) return !1;
    switch (r) {
      case 0 /* TypeOrder.NullValue */ :
      case 9007199254740991 /* TypeOrder.MaxValue */ :
        return !0;

      case 1 /* TypeOrder.BooleanValue */ :
        return t.booleanValue === e.booleanValue;

      case 4 /* TypeOrder.ServerTimestampValue */ :
        return __PRIVATE_getLocalWriteTime(t).isEqual(__PRIVATE_getLocalWriteTime(e));

      case 3 /* TypeOrder.TimestampValue */ :
        return function __PRIVATE_timestampEquals(t, e) {
            if ("string" == typeof t.timestampValue && "string" == typeof e.timestampValue && t.timestampValue.length === e.timestampValue.length) 
            // Use string equality for ISO 8601 timestamps
            return t.timestampValue === e.timestampValue;
            const r = __PRIVATE_normalizeTimestamp(t.timestampValue), n = __PRIVATE_normalizeTimestamp(e.timestampValue);
            return r.seconds === n.seconds && r.nanos === n.nanos;
        }(t, e);

      case 5 /* TypeOrder.StringValue */ :
        return t.stringValue === e.stringValue;

      case 6 /* TypeOrder.BlobValue */ :
        return function __PRIVATE_blobEquals(t, e) {
            return __PRIVATE_normalizeByteString(t.bytesValue).isEqual(__PRIVATE_normalizeByteString(e.bytesValue));
        }(t, e);

      case 7 /* TypeOrder.RefValue */ :
        return t.referenceValue === e.referenceValue;

      case 8 /* TypeOrder.GeoPointValue */ :
        return function __PRIVATE_geoPointEquals(t, e) {
            return __PRIVATE_normalizeNumber(t.geoPointValue.latitude) === __PRIVATE_normalizeNumber(e.geoPointValue.latitude) && __PRIVATE_normalizeNumber(t.geoPointValue.longitude) === __PRIVATE_normalizeNumber(e.geoPointValue.longitude);
        }(t, e);

      case 2 /* TypeOrder.NumberValue */ :
        return function __PRIVATE_numberEquals(t, e) {
            if ("integerValue" in t && "integerValue" in e) return __PRIVATE_normalizeNumber(t.integerValue) === __PRIVATE_normalizeNumber(e.integerValue);
            if ("doubleValue" in t && "doubleValue" in e) {
                const r = __PRIVATE_normalizeNumber(t.doubleValue), n = __PRIVATE_normalizeNumber(e.doubleValue);
                return r === n ? __PRIVATE_isNegativeZero(r) === __PRIVATE_isNegativeZero(n) : isNaN(r) && isNaN(n);
            }
            return !1;
        }(t, e);

      case 9 /* TypeOrder.ArrayValue */ :
        return __PRIVATE_arrayEquals(t.arrayValue.values || [], e.arrayValue.values || [], __PRIVATE_valueEquals);

      case 10 /* TypeOrder.ObjectValue */ :
        return function __PRIVATE_objectEquals(t, e) {
            const r = t.mapValue.fields || {}, n = e.mapValue.fields || {};
            if (__PRIVATE_objectSize(r) !== __PRIVATE_objectSize(n)) return !1;
            for (const t in r) if (r.hasOwnProperty(t) && (void 0 === n[t] || !__PRIVATE_valueEquals(r[t], n[t]))) return !1;
            return !0;
        }
        /** Returns true if the ArrayValue contains the specified element. */ (t, e);

      default:
        return fail();
    }
}

function __PRIVATE_arrayValueContains(t, e) {
    return void 0 !== (t.values || []).find((t => __PRIVATE_valueEquals(t, e)));
}

function __PRIVATE_valueCompare(t, e) {
    if (t === e) return 0;
    const r = __PRIVATE_typeOrder(t), n = __PRIVATE_typeOrder(e);
    if (r !== n) return __PRIVATE_primitiveComparator(r, n);
    switch (r) {
      case 0 /* TypeOrder.NullValue */ :
      case 9007199254740991 /* TypeOrder.MaxValue */ :
        return 0;

      case 1 /* TypeOrder.BooleanValue */ :
        return __PRIVATE_primitiveComparator(t.booleanValue, e.booleanValue);

      case 2 /* TypeOrder.NumberValue */ :
        return function __PRIVATE_compareNumbers(t, e) {
            const r = __PRIVATE_normalizeNumber(t.integerValue || t.doubleValue), n = __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
            return r < n ? -1 : r > n ? 1 : r === n ? 0 : 
            // one or both are NaN.
            isNaN(r) ? isNaN(n) ? 0 : -1 : 1;
        }(t, e);

      case 3 /* TypeOrder.TimestampValue */ :
        return __PRIVATE_compareTimestamps(t.timestampValue, e.timestampValue);

      case 4 /* TypeOrder.ServerTimestampValue */ :
        return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(t), __PRIVATE_getLocalWriteTime(e));

      case 5 /* TypeOrder.StringValue */ :
        return __PRIVATE_primitiveComparator(t.stringValue, e.stringValue);

      case 6 /* TypeOrder.BlobValue */ :
        return function __PRIVATE_compareBlobs(t, e) {
            const r = __PRIVATE_normalizeByteString(t), n = __PRIVATE_normalizeByteString(e);
            return r.compareTo(n);
        }(t.bytesValue, e.bytesValue);

      case 7 /* TypeOrder.RefValue */ :
        return function __PRIVATE_compareReferences(t, e) {
            const r = t.split("/"), n = e.split("/");
            for (let t = 0; t < r.length && t < n.length; t++) {
                const e = __PRIVATE_primitiveComparator(r[t], n[t]);
                if (0 !== e) return e;
            }
            return __PRIVATE_primitiveComparator(r.length, n.length);
        }(t.referenceValue, e.referenceValue);

      case 8 /* TypeOrder.GeoPointValue */ :
        return function __PRIVATE_compareGeoPoints(t, e) {
            const r = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(t.latitude), __PRIVATE_normalizeNumber(e.latitude));
            if (0 !== r) return r;
            return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(t.longitude), __PRIVATE_normalizeNumber(e.longitude));
        }(t.geoPointValue, e.geoPointValue);

      case 9 /* TypeOrder.ArrayValue */ :
        return function __PRIVATE_compareArrays(t, e) {
            const r = t.values || [], n = e.values || [];
            for (let t = 0; t < r.length && t < n.length; ++t) {
                const e = __PRIVATE_valueCompare(r[t], n[t]);
                if (e) return e;
            }
            return __PRIVATE_primitiveComparator(r.length, n.length);
        }(t.arrayValue, e.arrayValue);

      case 10 /* TypeOrder.ObjectValue */ :
        return function __PRIVATE_compareMaps(t, e) {
            if (t === M && e === M) return 0;
            if (t === M) return 1;
            if (e === M) return -1;
            const r = t.fields || {}, n = Object.keys(r), i = e.fields || {}, s = Object.keys(i);
            // Even though MapValues are likely sorted correctly based on their insertion
            // order (e.g. when received from the backend), local modifications can bring
            // elements out of order. We need to re-sort the elements to ensure that
            // canonical IDs are independent of insertion order.
            n.sort(), s.sort();
            for (let t = 0; t < n.length && t < s.length; ++t) {
                const e = __PRIVATE_primitiveComparator(n[t], s[t]);
                if (0 !== e) return e;
                const o = __PRIVATE_valueCompare(r[n[t]], i[s[t]]);
                if (0 !== o) return o;
            }
            return __PRIVATE_primitiveComparator(n.length, s.length);
        }
        /** Returns a reference value for the provided database and key. */ (t.mapValue, e.mapValue);

      default:
        throw fail();
    }
}

function __PRIVATE_compareTimestamps(t, e) {
    if ("string" == typeof t && "string" == typeof e && t.length === e.length) return __PRIVATE_primitiveComparator(t, e);
    const r = __PRIVATE_normalizeTimestamp(t), n = __PRIVATE_normalizeTimestamp(e), i = __PRIVATE_primitiveComparator(r.seconds, n.seconds);
    return 0 !== i ? i : __PRIVATE_primitiveComparator(r.nanos, n.nanos);
}

function __PRIVATE_refValue(t, e) {
    return {
        referenceValue: `projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`
    };
}

/** Returns true if `value` is an ArrayValue. */ function isArray(t) {
    return !!t && "arrayValue" in t;
}

/** Returns true if `value` is a NullValue. */ function __PRIVATE_isNullValue(t) {
    return !!t && "nullValue" in t;
}

/** Returns true if `value` is NaN. */ function __PRIVATE_isNanValue(t) {
    return !!t && "doubleValue" in t && isNaN(Number(t.doubleValue));
}

/** Returns true if `value` is a MapValue. */ function __PRIVATE_isMapValue(t) {
    return !!t && "mapValue" in t;
}

/** Creates a deep copy of `source`. */ function __PRIVATE_deepClone(t) {
    if (t.geoPointValue) return {
        geoPointValue: Object.assign({}, t.geoPointValue)
    };
    if (t.timestampValue && "object" == typeof t.timestampValue) return {
        timestampValue: Object.assign({}, t.timestampValue)
    };
    if (t.mapValue) {
        const e = {
            mapValue: {
                fields: {}
            }
        };
        return forEach(t.mapValue.fields, ((t, r) => e.mapValue.fields[t] = __PRIVATE_deepClone(r))), 
        e;
    }
    if (t.arrayValue) {
        const e = {
            arrayValue: {
                values: []
            }
        };
        for (let r = 0; r < (t.arrayValue.values || []).length; ++r) e.arrayValue.values[r] = __PRIVATE_deepClone(t.arrayValue.values[r]);
        return e;
    }
    return Object.assign({}, t);
}

class Bound {
    constructor(t, e) {
        this.position = t, this.inclusive = e;
    }
}

function __PRIVATE_boundEquals(t, e) {
    if (null === t) return null === e;
    if (null === e) return !1;
    if (t.inclusive !== e.inclusive || t.position.length !== e.position.length) return !1;
    for (let r = 0; r < t.position.length; r++) {
        if (!__PRIVATE_valueEquals(t.position[r], e.position[r])) return !1;
    }
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
 */ class Filter {}

class FieldFilter extends Filter {
    constructor(t, e, r) {
        super(), this.field = t, this.op = e, this.value = r;
    }
    /**
     * Creates a filter based on the provided arguments.
     */    static create(t, e, r) {
        return t.isKeyField() ? "in" /* Operator.IN */ === e || "not-in" /* Operator.NOT_IN */ === e ? this.createKeyFieldInFilter(t, e, r) : new __PRIVATE_KeyFieldFilter(t, e, r) : "array-contains" /* Operator.ARRAY_CONTAINS */ === e ? new __PRIVATE_ArrayContainsFilter(t, r) : "in" /* Operator.IN */ === e ? new __PRIVATE_InFilter(t, r) : "not-in" /* Operator.NOT_IN */ === e ? new __PRIVATE_NotInFilter(t, r) : "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === e ? new __PRIVATE_ArrayContainsAnyFilter(t, r) : new FieldFilter(t, e, r);
    }
    static createKeyFieldInFilter(t, e, r) {
        return "in" /* Operator.IN */ === e ? new __PRIVATE_KeyFieldInFilter(t, r) : new __PRIVATE_KeyFieldNotInFilter(t, r);
    }
    matches(t) {
        const e = t.data.field(this.field);
        // Types do not have to match in NOT_EQUAL filters.
                return "!=" /* Operator.NOT_EQUAL */ === this.op ? null !== e && this.matchesComparison(__PRIVATE_valueCompare(e, this.value)) : null !== e && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(e) && this.matchesComparison(__PRIVATE_valueCompare(e, this.value));
        // Only compare types with matching backend order (such as double and int).
        }
    matchesComparison(t) {
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
            return fail();
        }
    }
    isInequality() {
        return [ "<" /* Operator.LESS_THAN */ , "<=" /* Operator.LESS_THAN_OR_EQUAL */ , ">" /* Operator.GREATER_THAN */ , ">=" /* Operator.GREATER_THAN_OR_EQUAL */ , "!=" /* Operator.NOT_EQUAL */ , "not-in" /* Operator.NOT_IN */ ].indexOf(this.op) >= 0;
    }
    getFlattenedFilters() {
        return [ this ];
    }
    getFilters() {
        return [ this ];
    }
}

class CompositeFilter extends Filter {
    constructor(t, e) {
        super(), this.filters = t, this.op = e, this.D = null;
    }
    /**
     * Creates a filter based on the provided arguments.
     */    static create(t, e) {
        return new CompositeFilter(t, e);
    }
    matches(t) {
        return function __PRIVATE_compositeFilterIsConjunction(t) {
            return "and" /* CompositeOperator.AND */ === t.op;
        }(this) ? void 0 === this.filters.find((e => !e.matches(t))) : void 0 !== this.filters.find((e => e.matches(t)));
    }
    getFlattenedFilters() {
        return null !== this.D || (this.D = this.filters.reduce(((t, e) => t.concat(e.getFlattenedFilters())), [])), 
        this.D;
    }
    // Returns a mutable copy of `this.filters`
    getFilters() {
        return Object.assign([], this.filters);
    }
}

function __PRIVATE_filterEquals(t, e) {
    return t instanceof FieldFilter ? function __PRIVATE_fieldFilterEquals(t, e) {
        return e instanceof FieldFilter && t.op === e.op && t.field.isEqual(e.field) && __PRIVATE_valueEquals(t.value, e.value);
    }(t, e) : t instanceof CompositeFilter ? function __PRIVATE_compositeFilterEquals(t, e) {
        if (e instanceof CompositeFilter && t.op === e.op && t.filters.length === e.filters.length) {
            return t.filters.reduce(((t, r, n) => t && __PRIVATE_filterEquals(r, e.filters[n])), !0);
        }
        return !1;
    }
    /** Filter that matches on key fields (i.e. '__name__'). */ (t, e) : void fail();
}

class __PRIVATE_KeyFieldFilter extends FieldFilter {
    constructor(t, e, r) {
        super(t, e, r), this.key = DocumentKey.fromName(r.referenceValue);
    }
    matches(t) {
        const e = DocumentKey.comparator(t.key, this.key);
        return this.matchesComparison(e);
    }
}

/** Filter that matches on key fields within an array. */ class __PRIVATE_KeyFieldInFilter extends FieldFilter {
    constructor(t, e) {
        super(t, "in" /* Operator.IN */ , e), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in" /* Operator.IN */ , e);
    }
    matches(t) {
        return this.keys.some((e => e.isEqual(t.key)));
    }
}

/** Filter that matches on key fields not present within an array. */ class __PRIVATE_KeyFieldNotInFilter extends FieldFilter {
    constructor(t, e) {
        super(t, "not-in" /* Operator.NOT_IN */ , e), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in" /* Operator.NOT_IN */ , e);
    }
    matches(t) {
        return !this.keys.some((e => e.isEqual(t.key)));
    }
}

function __PRIVATE_extractDocumentKeysFromArrayValue(t, e) {
    var r;
    return ((null === (r = e.arrayValue) || void 0 === r ? void 0 : r.values) || []).map((t => DocumentKey.fromName(t.referenceValue)));
}

/** A Filter that implements the array-contains operator. */ class __PRIVATE_ArrayContainsFilter extends FieldFilter {
    constructor(t, e) {
        super(t, "array-contains" /* Operator.ARRAY_CONTAINS */ , e);
    }
    matches(t) {
        const e = t.data.field(this.field);
        return isArray(e) && __PRIVATE_arrayValueContains(e.arrayValue, this.value);
    }
}

/** A Filter that implements the IN operator. */ class __PRIVATE_InFilter extends FieldFilter {
    constructor(t, e) {
        super(t, "in" /* Operator.IN */ , e);
    }
    matches(t) {
        const e = t.data.field(this.field);
        return null !== e && __PRIVATE_arrayValueContains(this.value.arrayValue, e);
    }
}

/** A Filter that implements the not-in operator. */ class __PRIVATE_NotInFilter extends FieldFilter {
    constructor(t, e) {
        super(t, "not-in" /* Operator.NOT_IN */ , e);
    }
    matches(t) {
        if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
            nullValue: "NULL_VALUE"
        })) return !1;
        const e = t.data.field(this.field);
        return null !== e && !__PRIVATE_arrayValueContains(this.value.arrayValue, e);
    }
}

/** A Filter that implements the array-contains-any operator. */ class __PRIVATE_ArrayContainsAnyFilter extends FieldFilter {
    constructor(t, e) {
        super(t, "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ , e);
    }
    matches(t) {
        const e = t.data.field(this.field);
        return !(!isArray(e) || !e.arrayValue.values) && e.arrayValue.values.some((t => __PRIVATE_arrayValueContains(this.value.arrayValue, t)));
    }
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
 * An ordering on a field, in some Direction. Direction defaults to ASCENDING.
 */ class OrderBy {
    constructor(t, e = "asc" /* Direction.ASCENDING */) {
        this.field = t, this.dir = e;
    }
}

function __PRIVATE_orderByEquals(t, e) {
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
 */ class SnapshotVersion {
    constructor(t) {
        this.timestamp = t;
    }
    static fromTimestamp(t) {
        return new SnapshotVersion(t);
    }
    static min() {
        return new SnapshotVersion(new Timestamp(0, 0));
    }
    static max() {
        return new SnapshotVersion(new Timestamp(253402300799, 999999999));
    }
    compareTo(t) {
        return this.timestamp._compareTo(t.timestamp);
    }
    isEqual(t) {
        return this.timestamp.isEqual(t.timestamp);
    }
    /** Returns a number representation of the version for use in spec tests. */    toMicroseconds() {
        // Convert to microseconds.
        return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
    }
    toString() {
        return "SnapshotVersion(" + this.timestamp.toString() + ")";
    }
    toTimestamp() {
        return this.timestamp;
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
// An immutable sorted map implementation, based on a Left-leaning Red-Black
// tree.
class SortedMap {
    constructor(t, e) {
        this.comparator = t, this.root = e || LLRBNode.EMPTY;
    }
    // Returns a copy of the map, with the specified key/value added or replaced.
    insert(t, e) {
        return new SortedMap(this.comparator, this.root.insert(t, e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns a copy of the map, with the specified key removed.
    remove(t) {
        return new SortedMap(this.comparator, this.root.remove(t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns the value of the node with the given key, or null.
    get(t) {
        let e = this.root;
        for (;!e.isEmpty(); ) {
            const r = this.comparator(t, e.key);
            if (0 === r) return e.value;
            r < 0 ? e = e.left : r > 0 && (e = e.right);
        }
        return null;
    }
    // Returns the index of the element in this sorted map, or -1 if it doesn't
    // exist.
    indexOf(t) {
        // Number of nodes that were pruned when descending right
        let e = 0, r = this.root;
        for (;!r.isEmpty(); ) {
            const n = this.comparator(t, r.key);
            if (0 === n) return e + r.left.size;
            n < 0 ? r = r.left : (
            // Count all nodes left of the node plus the node itself
            e += r.left.size + 1, r = r.right);
        }
        // Node not found
                return -1;
    }
    isEmpty() {
        return this.root.isEmpty();
    }
    // Returns the total number of nodes in the map.
    get size() {
        return this.root.size;
    }
    // Returns the minimum key in the map.
    minKey() {
        return this.root.minKey();
    }
    // Returns the maximum key in the map.
    maxKey() {
        return this.root.maxKey();
    }
    // Traverses the map in key order and calls the specified action function
    // for each key/value pair. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(t) {
        return this.root.inorderTraversal(t);
    }
    forEach(t) {
        this.inorderTraversal(((e, r) => (t(e, r), !1)));
    }
    toString() {
        const t = [];
        return this.inorderTraversal(((e, r) => (t.push(`${e}:${r}`), !1))), `{${t.join(", ")}}`;
    }
    // Traverses the map in reverse key order and calls the specified action
    // function for each key/value pair. If action returns true, traversal is
    // aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(t) {
        return this.root.reverseTraversal(t);
    }
    // Returns an iterator over the SortedMap.
    getIterator() {
        return new SortedMapIterator(this.root, null, this.comparator, !1);
    }
    getIteratorFrom(t) {
        return new SortedMapIterator(this.root, t, this.comparator, !1);
    }
    getReverseIterator() {
        return new SortedMapIterator(this.root, null, this.comparator, !0);
    }
    getReverseIteratorFrom(t) {
        return new SortedMapIterator(this.root, t, this.comparator, !0);
    }
}

 // end SortedMap
// An iterator over an LLRBNode.
class SortedMapIterator {
    constructor(t, e, r, n) {
        this.isReverse = n, this.nodeStack = [];
        let i = 1;
        for (;!t.isEmpty(); ) if (i = e ? r(t.key, e) : 1, 
        // flip the comparison if we're going in reverse
        e && n && (i *= -1), i < 0) 
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
    getNext() {
        let t = this.nodeStack.pop();
        const e = {
            key: t.key,
            value: t.value
        };
        if (this.isReverse) for (t = t.left; !t.isEmpty(); ) this.nodeStack.push(t), t = t.right; else for (t = t.right; !t.isEmpty(); ) this.nodeStack.push(t), 
        t = t.left;
        return e;
    }
    hasNext() {
        return this.nodeStack.length > 0;
    }
    peek() {
        if (0 === this.nodeStack.length) return null;
        const t = this.nodeStack[this.nodeStack.length - 1];
        return {
            key: t.key,
            value: t.value
        };
    }
}

 // end SortedMapIterator
// Represents a node in a Left-leaning Red-Black tree.
class LLRBNode {
    constructor(t, e, r, n, i) {
        this.key = t, this.value = e, this.color = null != r ? r : LLRBNode.RED, this.left = null != n ? n : LLRBNode.EMPTY, 
        this.right = null != i ? i : LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
    }
    // Returns a copy of the current node, optionally replacing pieces of it.
    copy(t, e, r, n, i) {
        return new LLRBNode(null != t ? t : this.key, null != e ? e : this.value, null != r ? r : this.color, null != n ? n : this.left, null != i ? i : this.right);
    }
    isEmpty() {
        return !1;
    }
    // Traverses the tree in key order and calls the specified action function
    // for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(t) {
        return this.left.inorderTraversal(t) || t(this.key, this.value) || this.right.inorderTraversal(t);
    }
    // Traverses the tree in reverse key order and calls the specified action
    // function for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(t) {
        return this.right.reverseTraversal(t) || t(this.key, this.value) || this.left.reverseTraversal(t);
    }
    // Returns the minimum node in the tree.
    min() {
        return this.left.isEmpty() ? this : this.left.min();
    }
    // Returns the maximum key in the tree.
    minKey() {
        return this.min().key;
    }
    // Returns the maximum key in the tree.
    maxKey() {
        return this.right.isEmpty() ? this.key : this.right.maxKey();
    }
    // Returns new tree, with the key/value added.
    insert(t, e, r) {
        let n = this;
        const i = r(t, n.key);
        return n = i < 0 ? n.copy(null, null, null, n.left.insert(t, e, r), null) : 0 === i ? n.copy(null, e, null, null, null) : n.copy(null, null, null, null, n.right.insert(t, e, r)), 
        n.fixUp();
    }
    removeMin() {
        if (this.left.isEmpty()) return LLRBNode.EMPTY;
        let t = this;
        return t.left.isRed() || t.left.left.isRed() || (t = t.moveRedLeft()), t = t.copy(null, null, null, t.left.removeMin(), null), 
        t.fixUp();
    }
    // Returns new tree, with the specified item removed.
    remove(t, e) {
        let r, n = this;
        if (e(t, n.key) < 0) n.left.isEmpty() || n.left.isRed() || n.left.left.isRed() || (n = n.moveRedLeft()), 
        n = n.copy(null, null, null, n.left.remove(t, e), null); else {
            if (n.left.isRed() && (n = n.rotateRight()), n.right.isEmpty() || n.right.isRed() || n.right.left.isRed() || (n = n.moveRedRight()), 
            0 === e(t, n.key)) {
                if (n.right.isEmpty()) return LLRBNode.EMPTY;
                r = n.right.min(), n = n.copy(r.key, r.value, null, null, n.right.removeMin());
            }
            n = n.copy(null, null, null, null, n.right.remove(t, e));
        }
        return n.fixUp();
    }
    isRed() {
        return this.color;
    }
    // Returns new tree after performing any needed rotations.
    fixUp() {
        let t = this;
        return t.right.isRed() && !t.left.isRed() && (t = t.rotateLeft()), t.left.isRed() && t.left.left.isRed() && (t = t.rotateRight()), 
        t.left.isRed() && t.right.isRed() && (t = t.colorFlip()), t;
    }
    moveRedLeft() {
        let t = this.colorFlip();
        return t.right.left.isRed() && (t = t.copy(null, null, null, null, t.right.rotateRight()), 
        t = t.rotateLeft(), t = t.colorFlip()), t;
    }
    moveRedRight() {
        let t = this.colorFlip();
        return t.left.left.isRed() && (t = t.rotateRight(), t = t.colorFlip()), t;
    }
    rotateLeft() {
        const t = this.copy(null, null, LLRBNode.RED, null, this.right.left);
        return this.right.copy(null, null, this.color, t, null);
    }
    rotateRight() {
        const t = this.copy(null, null, LLRBNode.RED, this.left.right, null);
        return this.left.copy(null, null, this.color, null, t);
    }
    colorFlip() {
        const t = this.left.copy(null, null, !this.left.color, null, null), e = this.right.copy(null, null, !this.right.color, null, null);
        return this.copy(null, null, !this.color, t, e);
    }
    // For testing.
    checkMaxDepth() {
        const t = this.check();
        return Math.pow(2, t) <= this.size + 1;
    }
    // In a balanced RB tree, the black-depth (number of black nodes) from root to
    // leaves is equal on both sides.  This function verifies that or asserts.
    check() {
        if (this.isRed() && this.left.isRed()) throw fail();
        if (this.right.isRed()) throw fail();
        const t = this.left.check();
        if (t !== this.right.check()) throw fail();
        return t + (this.isRed() ? 0 : 1);
    }
}

 // end LLRBNode
// Empty node is shared between all LLRB trees.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
LLRBNode.EMPTY = null, LLRBNode.RED = !0, LLRBNode.BLACK = !1;

// end LLRBEmptyNode
LLRBNode.EMPTY = new 
// Represents an empty node (a leaf node in the Red-Black Tree).
class LLRBEmptyNode {
    constructor() {
        this.size = 0;
    }
    get key() {
        throw fail();
    }
    get value() {
        throw fail();
    }
    get color() {
        throw fail();
    }
    get left() {
        throw fail();
    }
    get right() {
        throw fail();
    }
    // Returns a copy of the current node.
    copy(t, e, r, n, i) {
        return this;
    }
    // Returns a copy of the tree, with the specified key/value added.
    insert(t, e, r) {
        return new LLRBNode(t, e);
    }
    // Returns a copy of the tree, with the specified key removed.
    remove(t, e) {
        return this;
    }
    isEmpty() {
        return !0;
    }
    inorderTraversal(t) {
        return !1;
    }
    reverseTraversal(t) {
        return !1;
    }
    minKey() {
        return null;
    }
    maxKey() {
        return null;
    }
    isRed() {
        return !1;
    }
    // For testing.
    checkMaxDepth() {
        return !0;
    }
    check() {
        return 0;
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
/**
 * SortedSet is an immutable (copy-on-write) collection that holds elements
 * in order specified by the provided comparator.
 *
 * NOTE: if provided comparator returns 0 for two elements, we consider them to
 * be equal!
 */
class SortedSet {
    constructor(t) {
        this.comparator = t, this.data = new SortedMap(this.comparator);
    }
    has(t) {
        return null !== this.data.get(t);
    }
    first() {
        return this.data.minKey();
    }
    last() {
        return this.data.maxKey();
    }
    get size() {
        return this.data.size;
    }
    indexOf(t) {
        return this.data.indexOf(t);
    }
    /** Iterates elements in order defined by "comparator" */    forEach(t) {
        this.data.inorderTraversal(((e, r) => (t(e), !1)));
    }
    /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */    forEachInRange(t, e) {
        const r = this.data.getIteratorFrom(t[0]);
        for (;r.hasNext(); ) {
            const n = r.getNext();
            if (this.comparator(n.key, t[1]) >= 0) return;
            e(n.key);
        }
    }
    /**
     * Iterates over `elem`s such that: start &lt;= elem until false is returned.
     */    forEachWhile(t, e) {
        let r;
        for (r = void 0 !== e ? this.data.getIteratorFrom(e) : this.data.getIterator(); r.hasNext(); ) {
            if (!t(r.getNext().key)) return;
        }
    }
    /** Finds the least element greater than or equal to `elem`. */    firstAfterOrEqual(t) {
        const e = this.data.getIteratorFrom(t);
        return e.hasNext() ? e.getNext().key : null;
    }
    getIterator() {
        return new SortedSetIterator(this.data.getIterator());
    }
    getIteratorFrom(t) {
        return new SortedSetIterator(this.data.getIteratorFrom(t));
    }
    /** Inserts or updates an element */    add(t) {
        return this.copy(this.data.remove(t).insert(t, !0));
    }
    /** Deletes an element */    delete(t) {
        return this.has(t) ? this.copy(this.data.remove(t)) : this;
    }
    isEmpty() {
        return this.data.isEmpty();
    }
    unionWith(t) {
        let e = this;
        // Make sure `result` always refers to the larger one of the two sets.
                return e.size < t.size && (e = t, t = this), t.forEach((t => {
            e = e.add(t);
        })), e;
    }
    isEqual(t) {
        if (!(t instanceof SortedSet)) return !1;
        if (this.size !== t.size) return !1;
        const e = this.data.getIterator(), r = t.data.getIterator();
        for (;e.hasNext(); ) {
            const t = e.getNext().key, n = r.getNext().key;
            if (0 !== this.comparator(t, n)) return !1;
        }
        return !0;
    }
    toArray() {
        const t = [];
        return this.forEach((e => {
            t.push(e);
        })), t;
    }
    toString() {
        const t = [];
        return this.forEach((e => t.push(e))), "SortedSet(" + t.toString() + ")";
    }
    copy(t) {
        const e = new SortedSet(this.comparator);
        return e.data = t, e;
    }
}

class SortedSetIterator {
    constructor(t) {
        this.iter = t;
    }
    getNext() {
        return this.iter.getNext().key;
    }
    hasNext() {
        return this.iter.hasNext();
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
 * Provides a set of fields that can be used to partially patch a document.
 * FieldMask is used in conjunction with ObjectValue.
 * Examples:
 *   foo - Overwrites foo entirely with the provided value. If foo is not
 *         present in the companion ObjectValue, the field is deleted.
 *   foo.bar - Overwrites only the field bar of the object foo.
 *             If foo is not an object, foo is replaced with an object
 *             containing foo
 */ class FieldMask {
    constructor(t) {
        this.fields = t, 
        // TODO(dimond): validation of FieldMask
        // Sort the field mask to support `FieldMask.isEqual()` and assert below.
        t.sort(FieldPath$1.comparator);
    }
    static empty() {
        return new FieldMask([]);
    }
    /**
     * Returns a new FieldMask object that is the result of adding all the given
     * fields paths to this field mask.
     */    unionWith(t) {
        let e = new SortedSet(FieldPath$1.comparator);
        for (const t of this.fields) e = e.add(t);
        for (const r of t) e = e.add(r);
        return new FieldMask(e.toArray());
    }
    /**
     * Verifies that `fieldPath` is included by at least one field in this field
     * mask.
     *
     * This is an O(n) operation, where `n` is the size of the field mask.
     */    covers(t) {
        for (const e of this.fields) if (e.isPrefixOf(t)) return !0;
        return !1;
    }
    isEqual(t) {
        return __PRIVATE_arrayEquals(this.fields, t.fields, ((t, e) => t.isEqual(e)));
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
 * An ObjectValue represents a MapValue in the Firestore Proto and offers the
 * ability to add and remove fields (via the ObjectValueBuilder).
 */ class ObjectValue {
    constructor(t) {
        this.value = t;
    }
    static empty() {
        return new ObjectValue({
            mapValue: {}
        });
    }
    /**
     * Returns the value at the given path or null.
     *
     * @param path - the path to search
     * @returns The value at the path or null if the path is not set.
     */    field(t) {
        if (t.isEmpty()) return this.value;
        {
            let e = this.value;
            for (let r = 0; r < t.length - 1; ++r) if (e = (e.mapValue.fields || {})[t.get(r)], 
            !__PRIVATE_isMapValue(e)) return null;
            return e = (e.mapValue.fields || {})[t.lastSegment()], e || null;
        }
    }
    /**
     * Sets the field to the provided value.
     *
     * @param path - The field path to set.
     * @param value - The value to set.
     */    set(t, e) {
        this.getFieldsMap(t.popLast())[t.lastSegment()] = __PRIVATE_deepClone(e);
    }
    /**
     * Sets the provided fields to the provided values.
     *
     * @param data - A map of fields to values (or null for deletes).
     */    setAll(t) {
        let e = FieldPath$1.emptyPath(), r = {}, n = [];
        t.forEach(((t, i) => {
            if (!e.isImmediateParentOf(i)) {
                // Insert the accumulated changes at this parent location
                const t = this.getFieldsMap(e);
                this.applyChanges(t, r, n), r = {}, n = [], e = i.popLast();
            }
            t ? r[i.lastSegment()] = __PRIVATE_deepClone(t) : n.push(i.lastSegment());
        }));
        const i = this.getFieldsMap(e);
        this.applyChanges(i, r, n);
    }
    /**
     * Removes the field at the specified path. If there is no field at the
     * specified path, nothing is changed.
     *
     * @param path - The field path to remove.
     */    delete(t) {
        const e = this.field(t.popLast());
        __PRIVATE_isMapValue(e) && e.mapValue.fields && delete e.mapValue.fields[t.lastSegment()];
    }
    isEqual(t) {
        return __PRIVATE_valueEquals(this.value, t.value);
    }
    /**
     * Returns the map that contains the leaf element of `path`. If the parent
     * entry does not yet exist, or if it is not a map, a new map will be created.
     */    getFieldsMap(t) {
        let e = this.value;
        e.mapValue.fields || (e.mapValue = {
            fields: {}
        });
        for (let r = 0; r < t.length; ++r) {
            let n = e.mapValue.fields[t.get(r)];
            __PRIVATE_isMapValue(n) && n.mapValue.fields || (n = {
                mapValue: {
                    fields: {}
                }
            }, e.mapValue.fields[t.get(r)] = n), e = n;
        }
        return e.mapValue.fields;
    }
    /**
     * Modifies `fieldsMap` by adding, replacing or deleting the specified
     * entries.
     */    applyChanges(t, e, r) {
        forEach(e, ((e, r) => t[e] = r));
        for (const e of r) delete t[e];
    }
    clone() {
        return new ObjectValue(__PRIVATE_deepClone(this.value));
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
 * Represents a document in Firestore with a key, version, data and whether it
 * has local mutations applied to it.
 *
 * Documents can transition between states via `convertToFoundDocument()`,
 * `convertToNoDocument()` and `convertToUnknownDocument()`. If a document does
 * not transition to one of these states even after all mutations have been
 * applied, `isValidDocument()` returns false and the document should be removed
 * from all views.
 */ class MutableDocument {
    constructor(t, e, r, n, i, s, o) {
        this.key = t, this.documentType = e, this.version = r, this.readTime = n, this.createTime = i, 
        this.data = s, this.documentState = o;
    }
    /**
     * Creates a document with no known version or data, but which can serve as
     * base document for mutations.
     */    static newInvalidDocument(t) {
        return new MutableDocument(t, 0 /* DocumentType.INVALID */ , 
        /* version */ SnapshotVersion.min(), 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 0 /* DocumentState.SYNCED */);
    }
    /**
     * Creates a new document that is known to exist with the given data at the
     * given version.
     */    static newFoundDocument(t, e, r, n) {
        return new MutableDocument(t, 1 /* DocumentType.FOUND_DOCUMENT */ , 
        /* version */ e, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ r, n, 0 /* DocumentState.SYNCED */);
    }
    /** Creates a new document that is known to not exist at the given version. */    static newNoDocument(t, e) {
        return new MutableDocument(t, 2 /* DocumentType.NO_DOCUMENT */ , 
        /* version */ e, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 0 /* DocumentState.SYNCED */);
    }
    /**
     * Creates a new document that is known to exist at the given version but
     * whose data is not known (e.g. a document that was updated without a known
     * base document).
     */    static newUnknownDocument(t, e) {
        return new MutableDocument(t, 3 /* DocumentType.UNKNOWN_DOCUMENT */ , 
        /* version */ e, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */);
    }
    /**
     * Changes the document type to indicate that it exists and that its version
     * and data are known.
     */    convertToFoundDocument(t, e) {
        // If a document is switching state from being an invalid or deleted
        // document to a valid (FOUND_DOCUMENT) document, either due to receiving an
        // update from Watch or due to applying a local set mutation on top
        // of a deleted document, our best guess about its createTime would be the
        // version at which the document transitioned to a FOUND_DOCUMENT.
        return !this.createTime.isEqual(SnapshotVersion.min()) || 2 /* DocumentType.NO_DOCUMENT */ !== this.documentType && 0 /* DocumentType.INVALID */ !== this.documentType || (this.createTime = t), 
        this.version = t, this.documentType = 1 /* DocumentType.FOUND_DOCUMENT */ , this.data = e, 
        this.documentState = 0 /* DocumentState.SYNCED */ , this;
    }
    /**
     * Changes the document type to indicate that it doesn't exist at the given
     * version.
     */    convertToNoDocument(t) {
        return this.version = t, this.documentType = 2 /* DocumentType.NO_DOCUMENT */ , 
        this.data = ObjectValue.empty(), this.documentState = 0 /* DocumentState.SYNCED */ , 
        this;
    }
    /**
     * Changes the document type to indicate that it exists at a given version but
     * that its data is not known (e.g. a document that was updated without a known
     * base document).
     */    convertToUnknownDocument(t) {
        return this.version = t, this.documentType = 3 /* DocumentType.UNKNOWN_DOCUMENT */ , 
        this.data = ObjectValue.empty(), this.documentState = 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ , 
        this;
    }
    setHasCommittedMutations() {
        return this.documentState = 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ , this;
    }
    setHasLocalMutations() {
        return this.documentState = 1 /* DocumentState.HAS_LOCAL_MUTATIONS */ , this.version = SnapshotVersion.min(), 
        this;
    }
    setReadTime(t) {
        return this.readTime = t, this;
    }
    get hasLocalMutations() {
        return 1 /* DocumentState.HAS_LOCAL_MUTATIONS */ === this.documentState;
    }
    get hasCommittedMutations() {
        return 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ === this.documentState;
    }
    get hasPendingWrites() {
        return this.hasLocalMutations || this.hasCommittedMutations;
    }
    isValidDocument() {
        return 0 /* DocumentType.INVALID */ !== this.documentType;
    }
    isFoundDocument() {
        return 1 /* DocumentType.FOUND_DOCUMENT */ === this.documentType;
    }
    isNoDocument() {
        return 2 /* DocumentType.NO_DOCUMENT */ === this.documentType;
    }
    isUnknownDocument() {
        return 3 /* DocumentType.UNKNOWN_DOCUMENT */ === this.documentType;
    }
    isEqual(t) {
        return t instanceof MutableDocument && this.key.isEqual(t.key) && this.version.isEqual(t.version) && this.documentType === t.documentType && this.documentState === t.documentState && this.data.isEqual(t.data);
    }
    mutableCopy() {
        return new MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
    }
    toString() {
        return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
    }
}

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
// Visible for testing
class __PRIVATE_TargetImpl {
    constructor(t, e = null, r = [], n = [], i = null, s = null, o = null) {
        this.path = t, this.collectionGroup = e, this.orderBy = r, this.filters = n, this.limit = i, 
        this.startAt = s, this.endAt = o, this.C = null;
    }
}

/**
 * Initializes a Target with a path and optional additional query constraints.
 * Path must currently be empty if this is a collection group query.
 *
 * NOTE: you should always construct `Target` from `Query.toTarget` instead of
 * using this factory method, because `Query` provides an implicit `orderBy`
 * property.
 */ function __PRIVATE_newTarget(t, e = null, r = [], n = [], i = null, s = null, o = null) {
    return new __PRIVATE_TargetImpl(t, e, r, n, i, s, o);
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
 */
class __PRIVATE_QueryImpl {
    /**
     * Initializes a Query with a path and optional additional query constraints.
     * Path must currently be empty if this is a collection group query.
     */
    constructor(t, e = null, r = [], n = [], i = null, s = "F" /* LimitType.First */ , o = null, a = null) {
        this.path = t, this.collectionGroup = e, this.explicitOrderBy = r, this.filters = n, 
        this.limit = i, this.limitType = s, this.startAt = o, this.endAt = a, this.S = null, 
        // The corresponding `Target` of this `Query` instance, for use with
        // non-aggregate queries.
        this.N = null, 
        // The corresponding `Target` of this `Query` instance, for use with
        // aggregate queries. Unlike targets for non-aggregate queries,
        // aggregate query targets do not contain normalized order-bys, they only
        // contain explicit order-bys.
        this.O = null, this.startAt, this.endAt;
    }
}

/** Creates a new Query for a query that matches all documents at `path` */
/**
 * Returns whether the query matches a collection group rather than a specific
 * collection.
 */
function __PRIVATE_isCollectionGroupQuery(t) {
    return null !== t.collectionGroup;
}

/**
 * Returns the normalized order-by constraint that is used to execute the Query,
 * which can be different from the order-by constraints the user provided (e.g.
 * the SDK and backend always orders by `__name__`). The normalized order-by
 * includes implicit order-bys in addition to the explicit user provided
 * order-bys.
 */ function __PRIVATE_queryNormalizedOrderBy(t) {
    const e = __PRIVATE_debugCast(t);
    if (null === e.S) {
        e.S = [];
        const t = new Set;
        // Any explicit order by fields should be added as is.
                for (const r of e.explicitOrderBy) e.S.push(r), t.add(r.field.canonicalString());
        // The order of the implicit ordering always matches the last explicit order by.
                const r = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc" /* Direction.ASCENDING */ , n = 
        // Returns the sorted set of inequality filter fields used in this query.
        function __PRIVATE_getInequalityFilterFields(t) {
            let e = new SortedSet(FieldPath$1.comparator);
            return t.filters.forEach((t => {
                t.getFlattenedFilters().forEach((t => {
                    t.isInequality() && (e = e.add(t.field));
                }));
            })), e;
        }
        /**
 * Creates a new Query for a collection group query that matches all documents
 * within the provided collection group.
 */ (e);
        // Any inequality fields not explicitly ordered should be implicitly ordered in a lexicographical
        // order. When there are multiple inequality filters on the same field, the field should be added
        // only once.
        // Note: `SortedSet<FieldPath>` sorts the key field before other fields. However, we want the key
        // field to be sorted last.
                n.forEach((n => {
            t.has(n.canonicalString()) || n.isKeyField() || e.S.push(new OrderBy(n, r));
        })), 
        // Add the document key field to the last if it is not explicitly ordered.
        t.has(FieldPath$1.keyField().canonicalString()) || e.S.push(new OrderBy(FieldPath$1.keyField(), r));
    }
    return e.S;
}

/**
 * Converts this `Query` instance to its corresponding `Target` representation.
 */ function __PRIVATE_queryToTarget(t) {
    const e = __PRIVATE_debugCast(t);
    return e.N || (e.N = __PRIVATE__queryToTarget(e, __PRIVATE_queryNormalizedOrderBy(t))), 
    e.N;
}

/**
 * Converts this `Query` instance to its corresponding `Target` representation,
 * for use within an aggregate query. Unlike targets for non-aggregate queries,
 * aggregate query targets do not contain normalized order-bys, they only
 * contain explicit order-bys.
 */ function __PRIVATE__queryToTarget(t, e) {
    if ("F" /* LimitType.First */ === t.limitType) return __PRIVATE_newTarget(t.path, t.collectionGroup, e, t.filters, t.limit, t.startAt, t.endAt);
    {
        // Flip the orderBy directions since we want the last results
        e = e.map((t => {
            const e = "desc" /* Direction.DESCENDING */ === t.dir ? "asc" /* Direction.ASCENDING */ : "desc" /* Direction.DESCENDING */;
            return new OrderBy(t.field, e);
        }));
        // We need to swap the cursors to match the now-flipped query ordering.
        const r = t.endAt ? new Bound(t.endAt.position, t.endAt.inclusive) : null, n = t.startAt ? new Bound(t.startAt.position, t.startAt.inclusive) : null;
        // Now return as a LimitType.First query.
        return __PRIVATE_newTarget(t.path, t.collectionGroup, e, t.filters, t.limit, r, n);
    }
}

function __PRIVATE_queryWithAddedFilter(t, e) {
    const r = t.filters.concat([ e ]);
    return new __PRIVATE_QueryImpl(t.path, t.collectionGroup, t.explicitOrderBy.slice(), r, t.limit, t.limitType, t.startAt, t.endAt);
}

function __PRIVATE_queryEquals(t, e) {
    return function __PRIVATE_targetEquals(t, e) {
        if (t.limit !== e.limit) return !1;
        if (t.orderBy.length !== e.orderBy.length) return !1;
        for (let r = 0; r < t.orderBy.length; r++) if (!__PRIVATE_orderByEquals(t.orderBy[r], e.orderBy[r])) return !1;
        if (t.filters.length !== e.filters.length) return !1;
        for (let r = 0; r < t.filters.length; r++) if (!__PRIVATE_filterEquals(t.filters[r], e.filters[r])) return !1;
        return t.collectionGroup === e.collectionGroup && !!t.path.isEqual(e.path) && !!__PRIVATE_boundEquals(t.startAt, e.startAt) && __PRIVATE_boundEquals(t.endAt, e.endAt);
    }(__PRIVATE_queryToTarget(t), __PRIVATE_queryToTarget(e)) && t.limitType === e.limitType;
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
function toNumber(t, e) {
    return function isSafeInteger(t) {
        return "number" == typeof t && Number.isInteger(t) && !__PRIVATE_isNegativeZero(t) && t <= Number.MAX_SAFE_INTEGER && t >= Number.MIN_SAFE_INTEGER;
    }(e) ? 
    /**
 * Returns an IntegerValue for `value`.
 */
    function __PRIVATE_toInteger(t) {
        return {
            integerValue: "" + t
        };
    }(e) : function __PRIVATE_toDouble(t, e) {
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
            doubleValue: __PRIVATE_isNegativeZero(e) ? "-0" : e
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
/** Used to represent a field transform on a mutation. */ class TransformOperation {
    constructor() {
        // Make sure that the structural type of `TransformOperation` is unique.
        // See https://github.com/microsoft/TypeScript/issues/5451
        this._ = void 0;
    }
}

/** Transforms a value into a server-generated timestamp. */ class __PRIVATE_ServerTimestampTransform extends TransformOperation {}

/** Transforms an array value via a union operation. */ class __PRIVATE_ArrayUnionTransformOperation extends TransformOperation {
    constructor(t) {
        super(), this.elements = t;
    }
}

/** Transforms an array value via a remove operation. */ class __PRIVATE_ArrayRemoveTransformOperation extends TransformOperation {
    constructor(t) {
        super(), this.elements = t;
    }
}

/**
 * Implements the backend semantics for locally computed NUMERIC_ADD (increment)
 * transforms. Converts all field values to integers or doubles, but unlike the
 * backend does not cap integer values at 2^63. Instead, JavaScript number
 * arithmetic is used and precision loss can occur for values greater than 2^53.
 */ class __PRIVATE_NumericIncrementTransformOperation extends TransformOperation {
    constructor(t, e) {
        super(), this.serializer = t, this.q = e;
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
/** A field path and the TransformOperation to perform upon it. */ class FieldTransform {
    constructor(t, e) {
        this.field = t, this.transform = e;
    }
}

/**
 * Encodes a precondition for a mutation. This follows the model that the
 * backend accepts with the special case of an explicit "empty" precondition
 * (meaning no precondition).
 */ class Precondition {
    constructor(t, e) {
        this.updateTime = t, this.exists = e;
    }
    /** Creates a new empty Precondition. */    static none() {
        return new Precondition;
    }
    /** Creates a new Precondition with an exists flag. */    static exists(t) {
        return new Precondition(void 0, t);
    }
    /** Creates a new Precondition based on a version a document exists at. */    static updateTime(t) {
        return new Precondition(t);
    }
    /** Returns whether this Precondition is empty. */    get isNone() {
        return void 0 === this.updateTime && void 0 === this.exists;
    }
    isEqual(t) {
        return this.exists === t.exists && (this.updateTime ? !!t.updateTime && this.updateTime.isEqual(t.updateTime) : !t.updateTime);
    }
}

/**
 * A mutation describes a self-contained change to a document. Mutations can
 * create, replace, delete, and update subsets of documents.
 *
 * Mutations not only act on the value of the document but also its version.
 *
 * For local mutations (mutations that haven't been committed yet), we preserve
 * the existing version for Set and Patch mutations. For Delete mutations, we
 * reset the version to 0.
 *
 * Here's the expected transition table.
 *
 * MUTATION           APPLIED TO            RESULTS IN
 *
 * SetMutation        Document(v3)          Document(v3)
 * SetMutation        NoDocument(v3)        Document(v0)
 * SetMutation        InvalidDocument(v0)   Document(v0)
 * PatchMutation      Document(v3)          Document(v3)
 * PatchMutation      NoDocument(v3)        NoDocument(v3)
 * PatchMutation      InvalidDocument(v0)   UnknownDocument(v3)
 * DeleteMutation     Document(v3)          NoDocument(v0)
 * DeleteMutation     NoDocument(v3)        NoDocument(v0)
 * DeleteMutation     InvalidDocument(v0)   NoDocument(v0)
 *
 * For acknowledged mutations, we use the updateTime of the WriteResponse as
 * the resulting version for Set and Patch mutations. As deletes have no
 * explicit update time, we use the commitTime of the WriteResponse for
 * Delete mutations.
 *
 * If a mutation is acknowledged by the backend but fails the precondition check
 * locally, we transition to an `UnknownDocument` and rely on Watch to send us
 * the updated version.
 *
 * Field transforms are used only with Patch and Set Mutations. We use the
 * `updateTransforms` message to store transforms, rather than the `transforms`s
 * messages.
 *
 * ## Subclassing Notes
 *
 * Every type of mutation needs to implement its own applyToRemoteDocument() and
 * applyToLocalView() to implement the actual behavior of applying the mutation
 * to some source document (see `setMutationApplyToRemoteDocument()` for an
 * example).
 */ class Mutation {}

/**
 * A mutation that creates or replaces the document at the given key with the
 * object value contents.
 */ class __PRIVATE_SetMutation extends Mutation {
    constructor(t, e, r, n = []) {
        super(), this.key = t, this.value = e, this.precondition = r, this.fieldTransforms = n, 
        this.type = 0 /* MutationType.Set */;
    }
    getFieldMask() {
        return null;
    }
}

/**
 * A mutation that modifies fields of the document at the given key with the
 * given values. The values are applied through a field mask:
 *
 *  * When a field is in both the mask and the values, the corresponding field
 *    is updated.
 *  * When a field is in neither the mask nor the values, the corresponding
 *    field is unmodified.
 *  * When a field is in the mask but not in the values, the corresponding field
 *    is deleted.
 *  * When a field is not in the mask but is in the values, the values map is
 *    ignored.
 */ class __PRIVATE_PatchMutation extends Mutation {
    constructor(t, e, r, n, i = []) {
        super(), this.key = t, this.data = e, this.fieldMask = r, this.precondition = n, 
        this.fieldTransforms = i, this.type = 1 /* MutationType.Patch */;
    }
    getFieldMask() {
        return this.fieldMask;
    }
}

/** A mutation that deletes the document at the given key. */ class __PRIVATE_DeleteMutation extends Mutation {
    constructor(t, e) {
        super(), this.key = t, this.precondition = e, this.type = 2 /* MutationType.Delete */ , 
        this.fieldTransforms = [];
    }
    getFieldMask() {
        return null;
    }
}

/**
 * A mutation that verifies the existence of the document at the given key with
 * the provided precondition.
 *
 * The `verify` operation is only used in Transactions, and this class serves
 * primarily to facilitate serialization into protos.
 */ class __PRIVATE_VerifyMutation extends Mutation {
    constructor(t, e) {
        super(), this.key = t, this.precondition = e, this.type = 3 /* MutationType.Verify */ , 
        this.fieldTransforms = [];
    }
    getFieldMask() {
        return null;
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
 */ const x = (() => {
    const t = {
        asc: "ASCENDING",
        desc: "DESCENDING"
    };
    return t;
})(), k = (() => {
    const t = {
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
    };
    return t;
})(), U = (() => {
    const t = {
        and: "AND",
        or: "OR"
    };
    return t;
})();

/**
 * This class generates JsonObject values for the Datastore API suitable for
 * sending to either GRPC stub methods or via the JSON/HTTP REST API.
 *
 * The serializer supports both Protobuf.js and Proto3 JSON formats. By
 * setting `useProto3Json` to true, the serializer will use the Proto3 JSON
 * format.
 *
 * For a description of the Proto3 JSON format check
 * https://developers.google.com/protocol-buffers/docs/proto3#json
 *
 * TODO(klimt): We can remove the databaseId argument if we keep the full
 * resource name in documents.
 */
class JsonProtoSerializer {
    constructor(t, e) {
        this.databaseId = t, this.useProto3Json = e;
    }
}

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
function toTimestamp(t, e) {
    if (t.useProto3Json) {
        return `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z`;
    }
    return {
        seconds: "" + e.seconds,
        nanos: e.nanoseconds
    };
}

/**
 * Returns a value for bytes that's appropriate to put in a proto.
 *
 * Visible for testing.
 */
function __PRIVATE_toBytes(t, e) {
    return t.useProto3Json ? e.toBase64() : e.toUint8Array();
}

function __PRIVATE_toVersion(t, e) {
    return toTimestamp(t, e.toTimestamp());
}

function __PRIVATE_fromVersion(t) {
    return __PRIVATE_hardAssert(!!t), SnapshotVersion.fromTimestamp(function fromTimestamp(t) {
        const e = __PRIVATE_normalizeTimestamp(t);
        return new Timestamp(e.seconds, e.nanos);
    }(t));
}

function __PRIVATE_toResourceName(t, e) {
    return function __PRIVATE_fullyQualifiedPrefixPath(t) {
        return new ResourcePath([ "projects", t.projectId, "databases", t.database ]);
    }(t).child("documents").child(e).canonicalString();
}

function __PRIVATE_toName(t, e) {
    return __PRIVATE_toResourceName(t.databaseId, e.path);
}

function fromName(t, e) {
    const r = function __PRIVATE_fromResourceName(t) {
        const e = ResourcePath.fromString(t);
        return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(e)), e;
    }(e);
    if (r.get(1) !== t.databaseId.projectId) throw new FirestoreError(R, "Tried to deserialize key from different project: " + r.get(1) + " vs " + t.databaseId.projectId);
    if (r.get(3) !== t.databaseId.database) throw new FirestoreError(R, "Tried to deserialize key from different database: " + r.get(3) + " vs " + t.databaseId.database);
    return new DocumentKey(function __PRIVATE_extractLocalPathFromResourceName(t) {
        return __PRIVATE_hardAssert(t.length > 4 && "documents" === t.get(4)), t.popFirst(5);
    }
    /** Creates a Document proto from key and fields (but no create/update time) */ (r));
}

function __PRIVATE_toQueryPath(t, e) {
    return __PRIVATE_toResourceName(t.databaseId, e);
}

function __PRIVATE_getEncodedDatabaseId(t) {
    return new ResourcePath([ "projects", t.databaseId.projectId, "databases", t.databaseId.database ]).canonicalString();
}

function __PRIVATE_toMutationDocument(t, e, r) {
    return {
        name: __PRIVATE_toName(t, e),
        fields: r.value.mapValue.fields
    };
}

function __PRIVATE_fromBatchGetDocumentsResponse(t, e) {
    return "found" in e ? function __PRIVATE_fromFound(t, e) {
        __PRIVATE_hardAssert(!!e.found), e.found.name, e.found.updateTime;
        const r = fromName(t, e.found.name), n = __PRIVATE_fromVersion(e.found.updateTime), i = e.found.createTime ? __PRIVATE_fromVersion(e.found.createTime) : SnapshotVersion.min(), s = new ObjectValue({
            mapValue: {
                fields: e.found.fields
            }
        });
        return MutableDocument.newFoundDocument(r, n, i, s);
    }(t, e) : "missing" in e ? function __PRIVATE_fromMissing(t, e) {
        __PRIVATE_hardAssert(!!e.missing), __PRIVATE_hardAssert(!!e.readTime);
        const r = fromName(t, e.missing), n = __PRIVATE_fromVersion(e.readTime);
        return MutableDocument.newNoDocument(r, n);
    }(t, e) : fail();
}

function toMutation(t, e) {
    let r;
    if (e instanceof __PRIVATE_SetMutation) r = {
        update: __PRIVATE_toMutationDocument(t, e.key, e.value)
    }; else if (e instanceof __PRIVATE_DeleteMutation) r = {
        delete: __PRIVATE_toName(t, e.key)
    }; else if (e instanceof __PRIVATE_PatchMutation) r = {
        update: __PRIVATE_toMutationDocument(t, e.key, e.data),
        updateMask: __PRIVATE_toDocumentMask(e.fieldMask)
    }; else {
        if (!(e instanceof __PRIVATE_VerifyMutation)) return fail();
        r = {
            verify: __PRIVATE_toName(t, e.key)
        };
    }
    return e.fieldTransforms.length > 0 && (r.updateTransforms = e.fieldTransforms.map((t => function __PRIVATE_toFieldTransform(t, e) {
        const r = e.transform;
        if (r instanceof __PRIVATE_ServerTimestampTransform) return {
            fieldPath: e.field.canonicalString(),
            setToServerValue: "REQUEST_TIME"
        };
        if (r instanceof __PRIVATE_ArrayUnionTransformOperation) return {
            fieldPath: e.field.canonicalString(),
            appendMissingElements: {
                values: r.elements
            }
        };
        if (r instanceof __PRIVATE_ArrayRemoveTransformOperation) return {
            fieldPath: e.field.canonicalString(),
            removeAllFromArray: {
                values: r.elements
            }
        };
        if (r instanceof __PRIVATE_NumericIncrementTransformOperation) return {
            fieldPath: e.field.canonicalString(),
            increment: r.q
        };
        throw fail();
    }(0, t)))), e.precondition.isNone || (r.currentDocument = function __PRIVATE_toPrecondition(t, e) {
        return void 0 !== e.updateTime ? {
            updateTime: __PRIVATE_toVersion(t, e.updateTime)
        } : void 0 !== e.exists ? {
            exists: e.exists
        } : fail();
    }(t, e.precondition)), r;
}

function __PRIVATE_toQueryTarget(t, e) {
    // Dissect the path into parent, collectionId, and optional key filter.
    const r = {
        structuredQuery: {}
    }, n = e.path;
    null !== e.collectionGroup ? (r.parent = __PRIVATE_toQueryPath(t, n), r.structuredQuery.from = [ {
        collectionId: e.collectionGroup,
        allDescendants: !0
    } ]) : (r.parent = __PRIVATE_toQueryPath(t, n.popLast()), r.structuredQuery.from = [ {
        collectionId: n.lastSegment()
    } ]);
    const i = function __PRIVATE_toFilters(t) {
        if (0 === t.length) return;
        return __PRIVATE_toFilter(CompositeFilter.create(t, "and" /* CompositeOperator.AND */));
    }(e.filters);
    i && (r.structuredQuery.where = i);
    const s = function __PRIVATE_toOrder(t) {
        if (0 === t.length) return;
        return t.map((t => 
        // visible for testing
        function __PRIVATE_toPropertyOrder(t) {
            return {
                field: __PRIVATE_toFieldPathReference(t.field),
                direction: __PRIVATE_toDirection(t.dir)
            };
        }
        // visible for testing
        (t)));
    }(e.orderBy);
    s && (r.structuredQuery.orderBy = s);
    const o = function __PRIVATE_toInt32Proto(t, e) {
        return t.useProto3Json || __PRIVATE_isNullOrUndefined(e) ? e : {
            value: e
        };
    }(t, e.limit);
    return null !== o && (r.structuredQuery.limit = o), e.startAt && (r.structuredQuery.startAt = function __PRIVATE_toStartAtCursor(t) {
        return {
            before: t.inclusive,
            values: t.position
        };
    }(e.startAt)), e.endAt && (r.structuredQuery.endAt = function __PRIVATE_toEndAtCursor(t) {
        return {
            before: !t.inclusive,
            values: t.position
        };
    }
    // visible for testing
    (e.endAt)), r;
}

function __PRIVATE_toDirection(t) {
    return x[t];
}

// visible for testing
function __PRIVATE_toOperatorName(t) {
    return k[t];
}

function __PRIVATE_toCompositeOperatorName(t) {
    return U[t];
}

function __PRIVATE_toFieldPathReference(t) {
    return {
        fieldPath: t.canonicalString()
    };
}

function __PRIVATE_toFilter(t) {
    return t instanceof FieldFilter ? function __PRIVATE_toUnaryOrFieldFilter(t) {
        if ("==" /* Operator.EQUAL */ === t.op) {
            if (__PRIVATE_isNanValue(t.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(t.field),
                    op: "IS_NAN"
                }
            };
            if (__PRIVATE_isNullValue(t.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(t.field),
                    op: "IS_NULL"
                }
            };
        } else if ("!=" /* Operator.NOT_EQUAL */ === t.op) {
            if (__PRIVATE_isNanValue(t.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(t.field),
                    op: "IS_NOT_NAN"
                }
            };
            if (__PRIVATE_isNullValue(t.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(t.field),
                    op: "IS_NOT_NULL"
                }
            };
        }
        return {
            fieldFilter: {
                field: __PRIVATE_toFieldPathReference(t.field),
                op: __PRIVATE_toOperatorName(t.op),
                value: t.value
            }
        };
    }(t) : t instanceof CompositeFilter ? function __PRIVATE_toCompositeFilter(t) {
        const e = t.getFilters().map((t => __PRIVATE_toFilter(t)));
        if (1 === e.length) return e[0];
        return {
            compositeFilter: {
                op: __PRIVATE_toCompositeOperatorName(t.op),
                filters: e
            }
        };
    }(t) : fail();
}

function __PRIVATE_toDocumentMask(t) {
    const e = [];
    return t.fields.forEach((t => e.push(t.canonicalString()))), {
        fieldPaths: e
    };
}

function __PRIVATE_isValidResourceName(t) {
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
 */ function __PRIVATE_newSerializer(t) {
    return new JsonProtoSerializer(t, /* useProto3Json= */ !0);
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
 */
class __PRIVATE_ExponentialBackoff {
    constructor(
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
    r = 1e3
    /**
     * The multiplier to use to determine the extended base delay after each
     * attempt.
     */ , n = 1.5
    /**
     * The maximum base delay after which no further backoff is performed.
     * Note that jitter will still be applied, so the actual delay could be as
     * much as 1.5*maxDelayMs.
     */ , i = 6e4) {
        this.B = t, this.timerId = e, this.$ = r, this.L = n, this.M = i, this.k = 0, this.U = null, 
        /** The last backoff attempt, as epoch milliseconds. */
        this.j = Date.now(), this.reset();
    }
    /**
     * Resets the backoff delay.
     *
     * The very next backoffAndWait() will have no delay. If it is called again
     * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
     * subsequent ones will increase according to the backoffFactor.
     */    reset() {
        this.k = 0;
    }
    /**
     * Resets the backoff delay to the maximum delay (e.g. for use after a
     * RESOURCE_EXHAUSTED error).
     */    W() {
        this.k = this.M;
    }
    /**
     * Returns a promise that resolves after currentDelayMs, and increases the
     * delay for any subsequent attempts. If there was a pending backoff operation
     * already, it will be canceled.
     */    K(t) {
        // Cancel any pending backoff operation.
        this.cancel();
        // First schedule using the current base (which may be 0 and should be
        // honored as such).
        const e = Math.floor(this.k + this.G()), r = Math.max(0, Date.now() - this.j), n = Math.max(0, e - r);
        // Guard against lastAttemptTime being in the future due to a clock change.
                n > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${n} ms (base delay: ${this.k} ms, delay with jitter: ${e} ms, last attempt: ${r} ms ago)`), 
        this.U = this.B.enqueueAfterDelay(this.timerId, n, (() => (this.j = Date.now(), 
        t()))), 
        // Apply backoff factor to determine next delay and ensure it is within
        // bounds.
        this.k *= this.L, this.k < this.$ && (this.k = this.$), this.k > this.M && (this.k = this.M);
    }
    H() {
        null !== this.U && (this.U.skipDelay(), this.U = null);
    }
    cancel() {
        null !== this.U && (this.U.cancel(), this.U = null);
    }
    /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */    G() {
        return (Math.random() - .5) * this.k;
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
 * Datastore and its related methods are a wrapper around the external Google
 * Cloud Datastore grpc API, which provides an interface that is more convenient
 * for the rest of the client SDK architecture to consume.
 */
/**
 * An implementation of Datastore that exposes additional state for internal
 * consumption.
 */
class __PRIVATE_DatastoreImpl extends class Datastore {} {
    constructor(t, e, r, n) {
        super(), this.authCredentials = t, this.appCheckCredentials = e, this.connection = r, 
        this.serializer = n, this.J = !1;
    }
    Y() {
        if (this.J) throw new FirestoreError(F, "The client has already been terminated.");
    }
    /** Invokes the provided RPC with auth and AppCheck tokens. */    R(t, e, r) {
        return this.Y(), Promise.all([ this.authCredentials.getToken(), this.appCheckCredentials.getToken() ]).then((([n, i]) => this.connection.R(t, e, r, n, i))).catch((t => {
            throw "FirebaseError" === t.name ? (t.code === w && (this.authCredentials.invalidateToken(), 
            this.appCheckCredentials.invalidateToken()), t) : new FirestoreError(P, t.toString());
        }));
    }
    /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */    g(t, e, r, n) {
        return this.Y(), Promise.all([ this.authCredentials.getToken(), this.appCheckCredentials.getToken() ]).then((([i, s]) => this.connection.g(t, e, r, i, s, n))).catch((t => {
            throw "FirebaseError" === t.name ? (t.code === w && (this.authCredentials.invalidateToken(), 
            this.appCheckCredentials.invalidateToken()), t) : new FirestoreError(P, t.toString());
        }));
    }
    terminate() {
        this.J = !0;
    }
}

// TODO(firestorexp): Make sure there is only one Datastore instance per
// firestore-exp client.
async function __PRIVATE_invokeCommitRpc(t, e) {
    const r = __PRIVATE_debugCast(t), n = __PRIVATE_getEncodedDatabaseId(r.serializer) + "/documents", i = {
        writes: e.map((t => toMutation(r.serializer, t)))
    };
    await r.R("Commit", n, i);
}

async function __PRIVATE_invokeBatchGetDocumentsRpc(t, e) {
    const r = __PRIVATE_debugCast(t), n = __PRIVATE_getEncodedDatabaseId(r.serializer) + "/documents", i = {
        documents: e.map((t => __PRIVATE_toName(r.serializer, t)))
    }, s = await r.g("BatchGetDocuments", n, i, e.length), o = new Map;
    s.forEach((t => {
        const e = __PRIVATE_fromBatchGetDocumentsResponse(r.serializer, t);
        o.set(e.key.toString(), e);
    }));
    const a = [];
    return e.forEach((t => {
        const e = o.get(t.toString());
        __PRIVATE_hardAssert(!!e), a.push(e);
    })), a;
}

async function __PRIVATE_invokeRunQueryRpc(t, e) {
    const r = __PRIVATE_debugCast(t), n = __PRIVATE_toQueryTarget(r.serializer, __PRIVATE_queryToTarget(e));
    return (await r.g("RunQuery", n.parent, {
        structuredQuery: n.structuredQuery
    })).filter((t => !!t.document)).map((t => function __PRIVATE_fromDocument(t, e, r) {
        const n = fromName(t, e.name), i = __PRIVATE_fromVersion(e.updateTime), s = e.createTime ? __PRIVATE_fromVersion(e.createTime) : SnapshotVersion.min(), o = new ObjectValue({
            mapValue: {
                fields: e.fields
            }
        }), a = MutableDocument.newFoundDocument(n, i, s, o);
        return r && a.setHasCommittedMutations(), r ? a.setHasCommittedMutations() : a;
    }(r.serializer, t.document, void 0)));
}

async function __PRIVATE_invokeRunAggregationQueryRpc(t, e, r) {
    var n;
    const i = __PRIVATE_debugCast(t), {request: s, Z: o} = function __PRIVATE_toRunAggregationQueryRequest(t, e, r) {
        const n = __PRIVATE_toQueryTarget(t, e), i = {}, s = [];
        let o = 0;
        return r.forEach((t => {
            // Map all client-side aliases to a unique short-form
            // alias. This avoids issues with client-side aliases that
            // exceed the 1500-byte string size limit.
            const e = "aggregate_" + o++;
            i[e] = t.alias, "count" === t.aggregateType ? s.push({
                alias: e,
                count: {}
            }) : "avg" === t.aggregateType ? s.push({
                alias: e,
                avg: {
                    field: __PRIVATE_toFieldPathReference(t.fieldPath)
                }
            }) : "sum" === t.aggregateType && s.push({
                alias: e,
                sum: {
                    field: __PRIVATE_toFieldPathReference(t.fieldPath)
                }
            });
        })), {
            request: {
                structuredAggregationQuery: {
                    aggregations: s,
                    structuredQuery: n.structuredQuery
                },
                parent: n.parent
            },
            Z: i
        };
    }(i.serializer, function __PRIVATE_queryToAggregateTarget(t) {
        const e = __PRIVATE_debugCast(t);
        return e.O || (
        // Do not include implicit order-bys for aggregate queries.
        e.O = __PRIVATE__queryToTarget(e, t.explicitOrderBy)), e.O;
    }(e), r), a = s.parent;
    i.connection.P || delete s.parent;
    const u = (await i.g("RunAggregationQuery", a, s, /*expectedResponseCount=*/ 1)).filter((t => !!t.result));
    // Omit RunAggregationQueryResponse that only contain readTimes.
        __PRIVATE_hardAssert(1 === u.length);
    // Remap the short-form aliases that were sent to the server
    // to the client-side aliases. Users will access the results
    // using the client-side alias.
    const _ = null === (n = u[0].result) || void 0 === n ? void 0 : n.aggregateFields;
    return Object.keys(_).reduce(((t, e) => (t[o[e]] = _[e], t)), {});
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
 */ const j = new Map;

/**
 * An instance map that ensures only one Datastore exists per Firestore
 * instance.
 */
/**
 * Returns an initialized and started Datastore for the given Firestore
 * instance. Callers must invoke removeComponents() when the Firestore
 * instance is terminated.
 */
function __PRIVATE_getDatastore(t) {
    if (t._terminated) throw new FirestoreError(F, "The client has already been terminated.");
    if (!j.has(t)) {
        __PRIVATE_logDebug("ComponentProvider", "Initializing Datastore");
        const e = function __PRIVATE_newConnection(t) {
            return new __PRIVATE_FetchConnection(t, fetch.bind(null));
        }(function __PRIVATE_makeDatabaseInfo(t, e, r, n) {
            return new DatabaseInfo(t, e, r, n.host, n.ssl, n.experimentalForceLongPolling, n.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(n.experimentalLongPollingOptions), n.useFetchStreams);
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
 */ (t._databaseId, t.app.options.appId || "", t._persistenceKey, t._freezeSettings())), r = __PRIVATE_newSerializer(t._databaseId), n = function __PRIVATE_newDatastore(t, e, r, n) {
            return new __PRIVATE_DatastoreImpl(t, e, r, n);
        }(t._authCredentials, t._appCheckCredentials, e, r);
        j.set(t, n);
    }
    return j.get(t);
}

/**
 * Removes all components associated with the provided instance. Must be called
 * when the `Firestore` instance is terminated.
 */
/**
 * A concrete type describing all the values that can be applied via a
 * user-supplied `FirestoreSettings` object. This is a separate type so that
 * defaults can be supplied and the value can be checked for equality.
 */
class FirestoreSettingsImpl {
    constructor(t) {
        var e, r;
        if (void 0 === t.host) {
            if (void 0 !== t.ssl) throw new FirestoreError(R, "Can't provide ssl option if host option is not set");
            this.host = "firestore.googleapis.com", this.ssl = true;
        } else this.host = t.host, this.ssl = null === (e = t.ssl) || void 0 === e || e;
        if (this.credentials = t.credentials, this.ignoreUndefinedProperties = !!t.ignoreUndefinedProperties, 
        this.localCache = t.localCache, void 0 === t.cacheSizeBytes) this.cacheSizeBytes = 41943040; else {
            if (-1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576) throw new FirestoreError(R, "cacheSizeBytes must be at least 1048576");
            this.cacheSizeBytes = t.cacheSizeBytes;
        }
        !function __PRIVATE_validateIsNotUsedTogether(t, e, r, n) {
            if (!0 === e && !0 === n) throw new FirestoreError(R, `${t} and ${r} cannot be used together.`);
        }("experimentalForceLongPolling", t.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t.experimentalAutoDetectLongPolling), 
        this.experimentalForceLongPolling = !!t.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = !1 : void 0 === t.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = true : 
        // For backwards compatibility, coerce the value to boolean even though
        // the TypeScript compiler has narrowed the type to boolean already.
        // noinspection PointlessBooleanExpressionJS
        this.experimentalAutoDetectLongPolling = !!t.experimentalAutoDetectLongPolling, 
        this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions(null !== (r = t.experimentalLongPollingOptions) && void 0 !== r ? r : {}), 
        function __PRIVATE_validateLongPollingOptions(t) {
            if (void 0 !== t.timeoutSeconds) {
                if (isNaN(t.timeoutSeconds)) throw new FirestoreError(R, `invalid long polling timeout: ${t.timeoutSeconds} (must not be NaN)`);
                if (t.timeoutSeconds < 5) throw new FirestoreError(R, `invalid long polling timeout: ${t.timeoutSeconds} (minimum allowed value is 5)`);
                if (t.timeoutSeconds > 30) throw new FirestoreError(R, `invalid long polling timeout: ${t.timeoutSeconds} (maximum allowed value is 30)`);
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
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */ (this.experimentalLongPollingOptions), this.useFetchStreams = !!t.useFetchStreams;
    }
    isEqual(t) {
        return this.host === t.host && this.ssl === t.ssl && this.credentials === t.credentials && this.cacheSizeBytes === t.cacheSizeBytes && this.experimentalForceLongPolling === t.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t.experimentalAutoDetectLongPolling && function __PRIVATE_longPollingOptionsEqual(t, e) {
            return t.timeoutSeconds === e.timeoutSeconds;
        }(this.experimentalLongPollingOptions, t.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === t.ignoreUndefinedProperties && this.useFetchStreams === t.useFetchStreams;
    }
}

class Firestore {
    /** @hideconstructor */
    constructor(t, e, r, n) {
        this._authCredentials = t, this._appCheckCredentials = e, this._databaseId = r, 
        this._app = n, 
        /**
         * Whether it's a Firestore or Firestore Lite instance.
         */
        this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), 
        this._settingsFrozen = !1;
    }
    /**
     * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
     * instance.
     */    get app() {
        if (!this._app) throw new FirestoreError(F, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
        return this._app;
    }
    get _initialized() {
        return this._settingsFrozen;
    }
    get _terminated() {
        return void 0 !== this._terminateTask;
    }
    _setSettings(t) {
        if (this._settingsFrozen) throw new FirestoreError(F, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
        this._settings = new FirestoreSettingsImpl(t), void 0 !== t.credentials && (this._authCredentials = function __PRIVATE_makeAuthCredentialsProvider(t) {
            if (!t) return new __PRIVATE_EmptyAuthCredentialsProvider;
            switch (t.type) {
              case "firstParty":
                return new __PRIVATE_FirstPartyAuthCredentialsProvider(t.sessionIndex || "0", t.iamToken || null, t.authTokenFactory || null);

              case "provider":
                return t.client;

              default:
                throw new FirestoreError(R, "makeAuthCredentialsProvider failed due to invalid credential type");
            }
        }(t.credentials));
    }
    _getSettings() {
        return this._settings;
    }
    _freezeSettings() {
        return this._settingsFrozen = !0, this._settings;
    }
    _delete() {
        return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
    }
    /** Returns a JSON-serializable representation of this `Firestore` instance. */    toJSON() {
        return {
            app: this._app,
            databaseId: this._databaseId,
            settings: this._settings
        };
    }
    /**
     * Terminates all components used by this client. Subclasses can override
     * this method to clean up their own dependencies, but must also call this
     * method.
     *
     * Only ever called once.
     */    _terminate() {
        return function __PRIVATE_removeComponents(t) {
            const e = j.get(t);
            e && (__PRIVATE_logDebug("ComponentProvider", "Removing Datastore"), j.delete(t), 
            e.terminate());
        }(this), Promise.resolve();
    }
}

function initializeFirestore(t, e, r) {
    r || (r = "(default)");
    const n = _getProvider(t, "firestore/lite");
    if (n.isInitialized(r)) throw new FirestoreError(F, "Firestore can only be initialized once per app.");
    return n.initialize({
        options: e,
        instanceIdentifier: r
    });
}

function getFirestore(e, r) {
    const n = "object" == typeof e ? e : t(), i = "string" == typeof e ? e : r || "(default)", s = _getProvider(n, "firestore/lite").getImmediate({
        identifier: i
    });
    if (!s._initialized) {
        const t = l("firestore");
        t && connectFirestoreEmulator(s, ...t);
    }
    return s;
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
 */ function connectFirestoreEmulator(t, e, r, n = {}) {
    var i;
    const s = (t = __PRIVATE_cast(t, Firestore))._getSettings(), o = `${e}:${r}`;
    if ("firestore.googleapis.com" !== s.host && s.host !== o && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."), 
    t._setSettings(Object.assign(Object.assign({}, s), {
        host: o,
        ssl: !1
    })), n.mockUserToken) {
        let e, r;
        if ("string" == typeof n.mockUserToken) e = n.mockUserToken, r = User.MOCK_USER; else {
            // Let createMockUserToken validate first (catches common mistakes like
            // invalid field "uid" and missing field "sub" / "user_id".)
            e = h(n.mockUserToken, null === (i = t._app) || void 0 === i ? void 0 : i.options.projectId);
            const s = n.mockUserToken.sub || n.mockUserToken.user_id;
            if (!s) throw new FirestoreError(R, "mockUserToken must contain 'sub' or 'user_id' field!");
            r = new User(s);
        }
        t._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(e, r));
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
 */ function terminate(t) {
    return t = __PRIVATE_cast(t, Firestore), e(t.app, "firestore/lite"), t._delete();
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
class AggregateField {
    /**
     * Create a new AggregateField<T>
     * @param aggregateType Specifies the type of aggregation operation to perform.
     * @param _internalFieldPath Optionally specifies the field that is aggregated.
     * @internal
     */
    constructor(t = "count", e) {
        this._internalFieldPath = e, 
        /** A type string to uniquely identify instances of this class. */
        this.type = "AggregateField", this.aggregateType = t;
    }
}

/**
 * The results of executing an aggregation query.
 */ class AggregateQuerySnapshot {
    /** @hideconstructor */
    constructor(t, e, r) {
        this._userDataWriter = e, this._data = r, 
        /** A type string to uniquely identify instances of this class. */
        this.type = "AggregateQuerySnapshot", this.query = t;
    }
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
     */    data() {
        return this._userDataWriter.convertObjectMap(this._data);
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
 * A `Query` refers to a query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 */ class Query {
    // This is the lite version of the Query class in the main SDK.
    /** @hideconstructor protected */
    constructor(t, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    e, r) {
        this.converter = e, this._query = r, 
        /** The type of this Firestore reference. */
        this.type = "query", this.firestore = t;
    }
    withConverter(t) {
        return new Query(this.firestore, t, this._query);
    }
}

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist.
 */ class DocumentReference {
    /** @hideconstructor */
    constructor(t, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    e, r) {
        this.converter = e, this._key = r, 
        /** The type of this Firestore reference. */
        this.type = "document", this.firestore = t;
    }
    get _path() {
        return this._key.path;
    }
    /**
     * The document's identifier within its collection.
     */    get id() {
        return this._key.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced document (relative
     * to the root of the database).
     */    get path() {
        return this._key.path.canonicalString();
    }
    /**
     * The collection this `DocumentReference` belongs to.
     */    get parent() {
        return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
    }
    withConverter(t) {
        return new DocumentReference(this.firestore, t, this._key);
    }
}

/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using {@link (query:1)}).
 */ class CollectionReference extends Query {
    /** @hideconstructor */
    constructor(t, e, r) {
        super(t, e, function __PRIVATE_newQueryForPath(t) {
            return new __PRIVATE_QueryImpl(t);
        }(r)), this._path = r, 
        /** The type of this Firestore reference. */
        this.type = "collection";
    }
    /** The collection's identifier. */    get id() {
        return this._query.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced collection (relative
     * to the root of the database).
     */    get path() {
        return this._query.path.canonicalString();
    }
    /**
     * A reference to the containing `DocumentReference` if this is a
     * subcollection. If this isn't a subcollection, the reference is null.
     */    get parent() {
        const t = this._path.popLast();
        return t.isEmpty() ? null : new DocumentReference(this.firestore, 
        /* converter= */ null, new DocumentKey(t));
    }
    withConverter(t) {
        return new CollectionReference(this.firestore, t, this._path);
    }
}

function collection(t, e, ...r) {
    if (t = d(t), __PRIVATE_validateNonEmptyArgument("collection", "path", e), t instanceof Firestore) {
        const n = ResourcePath.fromString(e, ...r);
        return __PRIVATE_validateCollectionPath(n), new CollectionReference(t, /* converter= */ null, n);
    }
    {
        if (!(t instanceof DocumentReference || t instanceof CollectionReference)) throw new FirestoreError(R, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
        const n = t._path.child(ResourcePath.fromString(e, ...r));
        return __PRIVATE_validateCollectionPath(n), new CollectionReference(t.firestore, 
        /* converter= */ null, n);
    }
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
 */ function collectionGroup(t, e) {
    if (t = __PRIVATE_cast(t, Firestore), __PRIVATE_validateNonEmptyArgument("collectionGroup", "collection id", e), 
    e.indexOf("/") >= 0) throw new FirestoreError(R, `Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);
    return new Query(t, 
    /* converter= */ null, function __PRIVATE_newQueryForCollectionGroup(t) {
        return new __PRIVATE_QueryImpl(ResourcePath.emptyPath(), t);
    }(e));
}

function doc(t, e, ...r) {
    if (t = d(t), 
    // We allow omission of 'pathString' but explicitly prohibit passing in both
    // 'undefined' and 'null'.
    1 === arguments.length && (e = __PRIVATE_AutoId.newId()), __PRIVATE_validateNonEmptyArgument("doc", "path", e), 
    t instanceof Firestore) {
        const n = ResourcePath.fromString(e, ...r);
        return __PRIVATE_validateDocumentPath(n), new DocumentReference(t, 
        /* converter= */ null, new DocumentKey(n));
    }
    {
        if (!(t instanceof DocumentReference || t instanceof CollectionReference)) throw new FirestoreError(R, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
        const n = t._path.child(ResourcePath.fromString(e, ...r));
        return __PRIVATE_validateDocumentPath(n), new DocumentReference(t.firestore, t instanceof CollectionReference ? t.converter : null, new DocumentKey(n));
    }
}

/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */ function refEqual(t, e) {
    return t = d(t), e = d(e), (t instanceof DocumentReference || t instanceof CollectionReference) && (e instanceof DocumentReference || e instanceof CollectionReference) && (t.firestore === e.firestore && t.path === e.path && t.converter === e.converter);
}

/**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */ function queryEqual(t, e) {
    return t = d(t), e = d(e), t instanceof Query && e instanceof Query && (t.firestore === e.firestore && __PRIVATE_queryEquals(t._query, e._query) && t.converter === e.converter);
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
 * An immutable object representing an array of bytes.
 */ class Bytes {
    /** @hideconstructor */
    constructor(t) {
        this._byteString = t;
    }
    /**
     * Creates a new `Bytes` object from the given Base64 string, converting it to
     * bytes.
     *
     * @param base64 - The Base64 string used to create the `Bytes` object.
     */    static fromBase64String(t) {
        try {
            return new Bytes(ByteString.fromBase64String(t));
        } catch (t) {
            throw new FirestoreError(R, "Failed to construct data from Base64 string: " + t);
        }
    }
    /**
     * Creates a new `Bytes` object from the given Uint8Array.
     *
     * @param array - The Uint8Array used to create the `Bytes` object.
     */    static fromUint8Array(t) {
        return new Bytes(ByteString.fromUint8Array(t));
    }
    /**
     * Returns the underlying bytes as a Base64-encoded string.
     *
     * @returns The Base64-encoded string created from the `Bytes` object.
     */    toBase64() {
        return this._byteString.toBase64();
    }
    /**
     * Returns the underlying bytes in a new `Uint8Array`.
     *
     * @returns The Uint8Array created from the `Bytes` object.
     */    toUint8Array() {
        return this._byteString.toUint8Array();
    }
    /**
     * Returns a string representation of the `Bytes` object.
     *
     * @returns A string representation of the `Bytes` object.
     */    toString() {
        return "Bytes(base64: " + this.toBase64() + ")";
    }
    /**
     * Returns true if this `Bytes` object is equal to the provided one.
     *
     * @param other - The `Bytes` object to compare against.
     * @returns true if this `Bytes` object is equal to the provided one.
     */    isEqual(t) {
        return this._byteString.isEqual(t._byteString);
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
 * A `FieldPath` refers to a field in a document. The path may consist of a
 * single field name (referring to a top-level field in the document), or a
 * list of field names (referring to a nested field in the document).
 *
 * Create a `FieldPath` by providing field names. If more than one field
 * name is provided, the path will point to a nested field in a document.
 */ class FieldPath {
    /**
     * Creates a `FieldPath` from the provided field names. If more than one field
     * name is provided, the path will point to a nested field in a document.
     *
     * @param fieldNames - A list of field names.
     */
    constructor(...t) {
        for (let e = 0; e < t.length; ++e) if (0 === t[e].length) throw new FirestoreError(R, "Invalid field name at argument $(i + 1). Field names must not be empty.");
        this._internalPath = new FieldPath$1(t);
    }
    /**
     * Returns true if this `FieldPath` is equal to the provided one.
     *
     * @param other - The `FieldPath` to compare against.
     * @returns true if this `FieldPath` is equal to the provided one.
     */    isEqual(t) {
        return this._internalPath.isEqual(t._internalPath);
    }
}

/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 */ function documentId() {
    return new FieldPath("__name__");
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
 */ class FieldValue {
    /**
     * @param _methodName - The public API endpoint that returns this class.
     * @hideconstructor
     */
    constructor(t) {
        this._methodName = t;
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
 * An immutable object representing a geographic location in Firestore. The
 * location is represented as latitude/longitude pair.
 *
 * Latitude values are in the range of [-90, 90].
 * Longitude values are in the range of [-180, 180].
 */ class GeoPoint {
    /**
     * Creates a new immutable `GeoPoint` object with the provided latitude and
     * longitude values.
     * @param latitude - The latitude as number between -90 and 90.
     * @param longitude - The longitude as number between -180 and 180.
     */
    constructor(t, e) {
        if (!isFinite(t) || t < -90 || t > 90) throw new FirestoreError(R, "Latitude must be a number between -90 and 90, but was: " + t);
        if (!isFinite(e) || e < -180 || e > 180) throw new FirestoreError(R, "Longitude must be a number between -180 and 180, but was: " + e);
        this._lat = t, this._long = e;
    }
    /**
     * The latitude of this `GeoPoint` instance.
     */    get latitude() {
        return this._lat;
    }
    /**
     * The longitude of this `GeoPoint` instance.
     */    get longitude() {
        return this._long;
    }
    /**
     * Returns true if this `GeoPoint` is equal to the provided one.
     *
     * @param other - The `GeoPoint` to compare against.
     * @returns true if this `GeoPoint` is equal to the provided one.
     */    isEqual(t) {
        return this._lat === t._lat && this._long === t._long;
    }
    /** Returns a JSON-serializable representation of this GeoPoint. */    toJSON() {
        return {
            latitude: this._lat,
            longitude: this._long
        };
    }
    /**
     * Actually private to JS consumers of our API, so this function is prefixed
     * with an underscore.
     */    _compareTo(t) {
        return __PRIVATE_primitiveComparator(this._lat, t._lat) || __PRIVATE_primitiveComparator(this._long, t._long);
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
 */ const z = /^__.*__$/;

/** The result of parsing document data (e.g. for a setData call). */ class ParsedSetData {
    constructor(t, e, r) {
        this.data = t, this.fieldMask = e, this.fieldTransforms = r;
    }
    toMutation(t, e) {
        return null !== this.fieldMask ? new __PRIVATE_PatchMutation(t, this.data, this.fieldMask, e, this.fieldTransforms) : new __PRIVATE_SetMutation(t, this.data, e, this.fieldTransforms);
    }
}

/** The result of parsing "update" data (i.e. for an updateData call). */ class ParsedUpdateData {
    constructor(t, 
    // The fieldMask does not include document transforms.
    e, r) {
        this.data = t, this.fieldMask = e, this.fieldTransforms = r;
    }
    toMutation(t, e) {
        return new __PRIVATE_PatchMutation(t, this.data, this.fieldMask, e, this.fieldTransforms);
    }
}

function __PRIVATE_isWrite(t) {
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
        throw fail();
    }
}

/** A "context" object passed around while parsing user data. */ class __PRIVATE_ParseContextImpl {
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
    constructor(t, e, r, n, i, s) {
        this.settings = t, this.databaseId = e, this.serializer = r, this.ignoreUndefinedProperties = n, 
        // Minor hack: If fieldTransforms is undefined, we assume this is an
        // external call and we need to validate the entire path.
        void 0 === i && this.X(), this.fieldTransforms = i || [], this.fieldMask = s || [];
    }
    get path() {
        return this.settings.path;
    }
    get tt() {
        return this.settings.tt;
    }
    /** Returns a new context with the specified settings overwritten. */    et(t) {
        return new __PRIVATE_ParseContextImpl(Object.assign(Object.assign({}, this.settings), t), this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
    }
    rt(t) {
        var e;
        const r = null === (e = this.path) || void 0 === e ? void 0 : e.child(t), n = this.et({
            path: r,
            nt: !1
        });
        return n.it(t), n;
    }
    st(t) {
        var e;
        const r = null === (e = this.path) || void 0 === e ? void 0 : e.child(t), n = this.et({
            path: r,
            nt: !1
        });
        return n.X(), n;
    }
    ot(t) {
        // TODO(b/34871131): We don't support array paths right now; so make path
        // undefined.
        return this.et({
            path: void 0,
            nt: !0
        });
    }
    ut(t) {
        return __PRIVATE_createError(t, this.settings.methodName, this.settings._t || !1, this.path, this.settings.ct);
    }
    /** Returns 'true' if 'fieldPath' was traversed when creating this context. */    contains(t) {
        return void 0 !== this.fieldMask.find((e => t.isPrefixOf(e))) || void 0 !== this.fieldTransforms.find((e => t.isPrefixOf(e.field)));
    }
    X() {
        // TODO(b/34871131): Remove null check once we have proper paths for fields
        // within arrays.
        if (this.path) for (let t = 0; t < this.path.length; t++) this.it(this.path.get(t));
    }
    it(t) {
        if (0 === t.length) throw this.ut("Document fields must not be empty");
        if (__PRIVATE_isWrite(this.tt) && z.test(t)) throw this.ut('Document fields cannot begin and end with "__"');
    }
}

/**
 * Helper for parsing raw user input (provided via the API) into internal model
 * classes.
 */ class __PRIVATE_UserDataReader {
    constructor(t, e, r) {
        this.databaseId = t, this.ignoreUndefinedProperties = e, this.serializer = r || __PRIVATE_newSerializer(t);
    }
    /** Creates a new top-level parse context. */    lt(t, e, r, n = !1) {
        return new __PRIVATE_ParseContextImpl({
            tt: t,
            methodName: e,
            ct: r,
            path: FieldPath$1.emptyPath(),
            nt: !1,
            _t: n
        }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
    }
}

function __PRIVATE_newUserDataReader(t) {
    const e = t._freezeSettings(), r = __PRIVATE_newSerializer(t._databaseId);
    return new __PRIVATE_UserDataReader(t._databaseId, !!e.ignoreUndefinedProperties, r);
}

/** Parse document data from a set() call. */ function __PRIVATE_parseSetData(t, e, r, n, i, s = {}) {
    const o = t.lt(s.merge || s.mergeFields ? 2 /* UserDataSource.MergeSet */ : 0 /* UserDataSource.Set */ , e, r, i);
    __PRIVATE_validatePlainObject("Data must be an object, but it was:", o, n);
    const a = __PRIVATE_parseObject(n, o);
    let u, _;
    if (s.merge) u = new FieldMask(o.fieldMask), _ = o.fieldTransforms; else if (s.mergeFields) {
        const t = [];
        for (const n of s.mergeFields) {
            const i = __PRIVATE_fieldPathFromArgument$1(e, n, r);
            if (!o.contains(i)) throw new FirestoreError(R, `Field '${i}' is specified in your field mask but missing from your input data.`);
            __PRIVATE_fieldMaskContains(t, i) || t.push(i);
        }
        u = new FieldMask(t), _ = o.fieldTransforms.filter((t => u.covers(t.field)));
    } else u = null, _ = o.fieldTransforms;
    return new ParsedSetData(new ObjectValue(a), u, _);
}

class __PRIVATE_DeleteFieldValueImpl extends FieldValue {
    _toFieldTransform(t) {
        if (2 /* UserDataSource.MergeSet */ !== t.tt) throw 1 /* UserDataSource.Update */ === t.tt ? t.ut(`${this._methodName}() can only appear at the top level of your update data`) : t.ut(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
        // No transform to add for a delete, but we need to add it to our
        // fieldMask so it gets deleted.
        return t.fieldMask.push(t.path), null;
    }
    isEqual(t) {
        return t instanceof __PRIVATE_DeleteFieldValueImpl;
    }
}

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
 */ function __PRIVATE_createSentinelChildContext(t, e, r) {
    return new __PRIVATE_ParseContextImpl({
        tt: 3 /* UserDataSource.Argument */ ,
        ct: e.settings.ct,
        methodName: t._methodName,
        nt: r
    }, e.databaseId, e.serializer, e.ignoreUndefinedProperties);
}

class __PRIVATE_ServerTimestampFieldValueImpl extends FieldValue {
    _toFieldTransform(t) {
        return new FieldTransform(t.path, new __PRIVATE_ServerTimestampTransform);
    }
    isEqual(t) {
        return t instanceof __PRIVATE_ServerTimestampFieldValueImpl;
    }
}

class __PRIVATE_ArrayUnionFieldValueImpl extends FieldValue {
    constructor(t, e) {
        super(t), this.ht = e;
    }
    _toFieldTransform(t) {
        const e = __PRIVATE_createSentinelChildContext(this, t, 
        /*array=*/ !0), r = this.ht.map((t => __PRIVATE_parseData(t, e))), n = new __PRIVATE_ArrayUnionTransformOperation(r);
        return new FieldTransform(t.path, n);
    }
    isEqual(t) {
        // TODO(mrschmidt): Implement isEquals
        return this === t;
    }
}

class __PRIVATE_ArrayRemoveFieldValueImpl extends FieldValue {
    constructor(t, e) {
        super(t), this.ht = e;
    }
    _toFieldTransform(t) {
        const e = __PRIVATE_createSentinelChildContext(this, t, 
        /*array=*/ !0), r = this.ht.map((t => __PRIVATE_parseData(t, e))), n = new __PRIVATE_ArrayRemoveTransformOperation(r);
        return new FieldTransform(t.path, n);
    }
    isEqual(t) {
        // TODO(mrschmidt): Implement isEquals
        return this === t;
    }
}

class __PRIVATE_NumericIncrementFieldValueImpl extends FieldValue {
    constructor(t, e) {
        super(t), this.dt = e;
    }
    _toFieldTransform(t) {
        const e = new __PRIVATE_NumericIncrementTransformOperation(t.serializer, toNumber(t.serializer, this.dt));
        return new FieldTransform(t.path, e);
    }
    isEqual(t) {
        // TODO(mrschmidt): Implement isEquals
        return this === t;
    }
}

/** Parse update data from an update() call. */ function __PRIVATE_parseUpdateData(t, e, r, n) {
    const i = t.lt(1 /* UserDataSource.Update */ , e, r);
    __PRIVATE_validatePlainObject("Data must be an object, but it was:", i, n);
    const s = [], o = ObjectValue.empty();
    forEach(n, ((t, n) => {
        const a = __PRIVATE_fieldPathFromDotSeparatedString(e, t, r);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                n = d(n);
        const u = i.st(a);
        if (n instanceof __PRIVATE_DeleteFieldValueImpl) 
        // Add it to the field mask, but don't add anything to updateData.
        s.push(a); else {
            const t = __PRIVATE_parseData(n, u);
            null != t && (s.push(a), o.set(a, t));
        }
    }));
    const a = new FieldMask(s);
    return new ParsedUpdateData(o, a, i.fieldTransforms);
}

/** Parse update data from a list of field/value arguments. */ function __PRIVATE_parseUpdateVarargs(t, e, r, n, i, s) {
    const o = t.lt(1 /* UserDataSource.Update */ , e, r), a = [ __PRIVATE_fieldPathFromArgument$1(e, n, r) ], u = [ i ];
    if (s.length % 2 != 0) throw new FirestoreError(R, `Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);
    for (let t = 0; t < s.length; t += 2) a.push(__PRIVATE_fieldPathFromArgument$1(e, s[t])), 
    u.push(s[t + 1]);
    const _ = [], c = ObjectValue.empty();
    // We iterate in reverse order to pick the last value for a field if the
    // user specified the field multiple times.
    for (let t = a.length - 1; t >= 0; --t) if (!__PRIVATE_fieldMaskContains(_, a[t])) {
        const e = a[t];
        let r = u[t];
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                r = d(r);
        const n = o.st(e);
        if (r instanceof __PRIVATE_DeleteFieldValueImpl) 
        // Add it to the field mask, but don't add anything to updateData.
        _.push(e); else {
            const t = __PRIVATE_parseData(r, n);
            null != t && (_.push(e), c.set(e, t));
        }
    }
    const l = new FieldMask(_);
    return new ParsedUpdateData(c, l, o.fieldTransforms);
}

/**
 * Parse a "query value" (e.g. value in a where filter or a value in a cursor
 * bound).
 *
 * @param allowArrays - Whether the query value is an array that may directly
 * contain additional arrays (e.g. the operand of an `in` query).
 */ function __PRIVATE_parseQueryValue(t, e, r, n = !1) {
    return __PRIVATE_parseData(r, t.lt(n ? 4 /* UserDataSource.ArrayArgument */ : 3 /* UserDataSource.Argument */ , e));
}

/**
 * Parses user data to Protobuf Values.
 *
 * @param input - Data to be parsed.
 * @param context - A context object representing the current path being parsed,
 * the source of the data being parsed, etc.
 * @returns The parsed value, or null if the value was a FieldValue sentinel
 * that should not be included in the resulting parsed data.
 */ function __PRIVATE_parseData(t, e) {
    if (__PRIVATE_looksLikeJsonObject(
    // Unwrap the API type from the Compat SDK. This will return the API type
    // from firestore-exp.
    t = d(t))) return __PRIVATE_validatePlainObject("Unsupported field value:", e, t), 
    __PRIVATE_parseObject(t, e);
    if (t instanceof FieldValue) 
    // FieldValues usually parse into transforms (except deleteField())
    // in which case we do not want to include this field in our parsed data
    // (as doing so will overwrite the field directly prior to the transform
    // trying to transform it). So we don't add this location to
    // context.fieldMask and we return null as our parsing result.
    /**
 * "Parses" the provided FieldValueImpl, adding any necessary transforms to
 * context.fieldTransforms.
 */
    return function __PRIVATE_parseSentinelFieldValue(t, e) {
        // Sentinels are only supported with writes, and not within arrays.
        if (!__PRIVATE_isWrite(e.tt)) throw e.ut(`${t._methodName}() can only be used with update() and set()`);
        if (!e.path) throw e.ut(`${t._methodName}() is not currently supported inside arrays`);
        const r = t._toFieldTransform(e);
        r && e.fieldTransforms.push(r);
    }
    /**
 * Helper to parse a scalar value (i.e. not an Object, Array, or FieldValue)
 *
 * @returns The parsed value
 */ (t, e), null;
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
        return function __PRIVATE_parseArray(t, e) {
            const r = [];
            let n = 0;
            for (const i of t) {
                let t = __PRIVATE_parseData(i, e.ot(n));
                null == t && (
                // Just include nulls in the array for fields being replaced with a
                // sentinel.
                t = {
                    nullValue: "NULL_VALUE"
                }), r.push(t), n++;
            }
            return {
                arrayValue: {
                    values: r
                }
            };
        }(t, e);
    }
    return function __PRIVATE_parseScalarValue(t, e) {
        if (null === (t = d(t))) return {
            nullValue: "NULL_VALUE"
        };
        if ("number" == typeof t) return toNumber(e.serializer, t);
        if ("boolean" == typeof t) return {
            booleanValue: t
        };
        if ("string" == typeof t) return {
            stringValue: t
        };
        if (t instanceof Date) {
            const r = Timestamp.fromDate(t);
            return {
                timestampValue: toTimestamp(e.serializer, r)
            };
        }
        if (t instanceof Timestamp) {
            // Firestore backend truncates precision down to microseconds. To ensure
            // offline mode works the same with regards to truncation, perform the
            // truncation immediately without waiting for the backend to do that.
            const r = new Timestamp(t.seconds, 1e3 * Math.floor(t.nanoseconds / 1e3));
            return {
                timestampValue: toTimestamp(e.serializer, r)
            };
        }
        if (t instanceof GeoPoint) return {
            geoPointValue: {
                latitude: t.latitude,
                longitude: t.longitude
            }
        };
        if (t instanceof Bytes) return {
            bytesValue: __PRIVATE_toBytes(e.serializer, t._byteString)
        };
        if (t instanceof DocumentReference) {
            const r = e.databaseId, n = t.firestore._databaseId;
            if (!n.isEqual(r)) throw e.ut(`Document reference is for database ${n.projectId}/${n.database} but should be for database ${r.projectId}/${r.database}`);
            return {
                referenceValue: __PRIVATE_toResourceName(t.firestore._databaseId || e.databaseId, t._key.path)
            };
        }
        throw e.ut(`Unsupported field value: ${__PRIVATE_valueDescription(t)}`);
    }
    /**
 * Checks whether an object looks like a JSON object that should be converted
 * into a struct. Normal class/prototype instances are considered to look like
 * JSON objects since they should be converted to a struct value. Arrays, Dates,
 * GeoPoints, etc. are not considered to look like JSON objects since they map
 * to specific FieldValue types other than ObjectValue.
 */ (t, e);
}

function __PRIVATE_parseObject(t, e) {
    const r = {};
    return !function isEmpty(t) {
        for (const e in t) if (Object.prototype.hasOwnProperty.call(t, e)) return !1;
        return !0;
    }(t) ? forEach(t, ((t, n) => {
        const i = __PRIVATE_parseData(n, e.rt(t));
        null != i && (r[t] = i);
    })) : 
    // If we encounter an empty object, we explicitly add it to the update
    // mask to ensure that the server creates a map entry.
    e.path && e.path.length > 0 && e.fieldMask.push(e.path), {
        mapValue: {
            fields: r
        }
    };
}

function __PRIVATE_looksLikeJsonObject(t) {
    return !("object" != typeof t || null === t || t instanceof Array || t instanceof Date || t instanceof Timestamp || t instanceof GeoPoint || t instanceof Bytes || t instanceof DocumentReference || t instanceof FieldValue);
}

function __PRIVATE_validatePlainObject(t, e, r) {
    if (!__PRIVATE_looksLikeJsonObject(r) || !function __PRIVATE_isPlainObject(t) {
        return "object" == typeof t && null !== t && (Object.getPrototypeOf(t) === Object.prototype || null === Object.getPrototypeOf(t));
    }(r)) {
        const n = __PRIVATE_valueDescription(r);
        throw "an object" === n ? e.ut(t + " a custom object") : e.ut(t + " " + n);
    }
}

/**
 * Helper that calls fromDotSeparatedString() but wraps any error thrown.
 */ function __PRIVATE_fieldPathFromArgument$1(t, e, r) {
    if ((
    // If required, replace the FieldPath Compat class with with the firestore-exp
    // FieldPath.
    e = d(e)) instanceof FieldPath) return e._internalPath;
    if ("string" == typeof e) return __PRIVATE_fieldPathFromDotSeparatedString(t, e);
    throw __PRIVATE_createError("Field path arguments must be of type string or ", t, 
    /* hasConverter= */ !1, 
    /* path= */ void 0, r);
}

/**
 * Matches any characters in a field path string that are reserved.
 */ const W = new RegExp("[~\\*/\\[\\]]");

/**
 * Wraps fromDotSeparatedString with an error message about the method that
 * was thrown.
 * @param methodName - The publicly visible method name
 * @param path - The dot-separated string form of a field path which will be
 * split on dots.
 * @param targetDoc - The document against which the field path will be
 * evaluated.
 */ function __PRIVATE_fieldPathFromDotSeparatedString(t, e, r) {
    if (e.search(W) >= 0) throw __PRIVATE_createError(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t, 
    /* hasConverter= */ !1, 
    /* path= */ void 0, r);
    try {
        return new FieldPath(...e.split("."))._internalPath;
    } catch (n) {
        throw __PRIVATE_createError(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t, 
        /* hasConverter= */ !1, 
        /* path= */ void 0, r);
    }
}

function __PRIVATE_createError(t, e, r, n, i) {
    const s = n && !n.isEmpty(), o = void 0 !== i;
    let a = `Function ${e}() called with invalid data`;
    r && (a += " (via `toFirestore()`)"), a += ". ";
    let u = "";
    return (s || o) && (u += " (found", s && (u += ` in field ${n}`), o && (u += ` in document ${i}`), 
    u += ")"), new FirestoreError(R, a + t + u);
}

/** Checks `haystack` if FieldPath `needle` is present. Runs in O(n). */ function __PRIVATE_fieldMaskContains(t, e) {
    return t.some((t => t.isEqual(e)));
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
 */ class DocumentSnapshot {
    // Note: This class is stripped down version of the DocumentSnapshot in
    // the legacy SDK. The changes are:
    // - No support for SnapshotMetadata.
    // - No support for SnapshotOptions.
    /** @hideconstructor protected */
    constructor(t, e, r, n, i) {
        this._firestore = t, this._userDataWriter = e, this._key = r, this._document = n, 
        this._converter = i;
    }
    /** Property of the `DocumentSnapshot` that provides the document's ID. */    get id() {
        return this._key.path.lastSegment();
    }
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */    get ref() {
        return new DocumentReference(this._firestore, this._converter, this._key);
    }
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */    exists() {
        return null !== this._document;
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */    data() {
        if (this._document) {
            if (this._converter) {
                // We only want to use the converter and create a new DocumentSnapshot
                // if a converter has been provided.
                const t = new QueryDocumentSnapshot(this._firestore, this._userDataWriter, this._key, this._document, 
                /* converter= */ null);
                return this._converter.fromFirestore(t);
            }
            return this._userDataWriter.convertValue(this._document.data.value);
        }
    }
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
    get(t) {
        if (this._document) {
            const e = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", t));
            if (null !== e) return this._userDataWriter.convertValue(e);
        }
    }
}

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
 */ class QueryDocumentSnapshot extends DocumentSnapshot {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * @override
     * @returns An `Object` containing all fields in the document.
     */
    data() {
        return super.data();
    }
}

/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */ class QuerySnapshot {
    /** @hideconstructor */
    constructor(t, e) {
        this._docs = e, this.query = t;
    }
    /** An array of all the documents in the `QuerySnapshot`. */    get docs() {
        return [ ...this._docs ];
    }
    /** The number of documents in the `QuerySnapshot`. */    get size() {
        return this.docs.length;
    }
    /** True if there are no documents in the `QuerySnapshot`. */    get empty() {
        return 0 === this.docs.length;
    }
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */    forEach(t, e) {
        this._docs.forEach(t, e);
    }
}

/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */ function snapshotEqual(t, e) {
    return t = d(t), e = d(e), t instanceof DocumentSnapshot && e instanceof DocumentSnapshot ? t._firestore === e._firestore && t._key.isEqual(e._key) && (null === t._document ? null === e._document : t._document.isEqual(e._document)) && t._converter === e._converter : t instanceof QuerySnapshot && e instanceof QuerySnapshot && (queryEqual(t.query, e.query) && __PRIVATE_arrayEquals(t.docs, e.docs, snapshotEqual));
}

/**
 * Helper that calls `fromDotSeparatedString()` but wraps any error thrown.
 */ function __PRIVATE_fieldPathFromArgument(t, e) {
    return "string" == typeof e ? __PRIVATE_fieldPathFromDotSeparatedString(t, e) : e instanceof FieldPath ? e._internalPath : e._delegate._internalPath;
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
 */
class AppliableConstraint {}

/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */ class QueryConstraint extends AppliableConstraint {}

function query(t, e, ...r) {
    let n = [];
    e instanceof AppliableConstraint && n.push(e), n = n.concat(r), function __PRIVATE_validateQueryConstraintArray(t) {
        const e = t.filter((t => t instanceof QueryCompositeFilterConstraint)).length, r = t.filter((t => t instanceof QueryFieldFilterConstraint)).length;
        if (e > 1 || e > 0 && r > 0) throw new FirestoreError(R, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
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
 * Converts Firestore's internal types to the JavaScript types that we expose
 * to the user.
 *
 * @internal
 */ (n);
    for (const e of n) t = e._apply(t);
    return t;
}

/**
 * A `QueryFieldFilterConstraint` is used to narrow the set of documents returned by
 * a Firestore query by filtering on one or more document fields.
 * `QueryFieldFilterConstraint`s are created by invoking {@link where} and can then
 * be passed to {@link (query:1)} to create a new query instance that also contains
 * this `QueryFieldFilterConstraint`.
 */ class QueryFieldFilterConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(t, e, r) {
        super(), this._field = t, this._op = e, this._value = r, 
        /** The type of this query constraint */
        this.type = "where";
    }
    static _create(t, e, r) {
        return new QueryFieldFilterConstraint(t, e, r);
    }
    _apply(t) {
        const e = this._parse(t);
        return __PRIVATE_validateNewFieldFilter(t._query, e), new Query(t.firestore, t.converter, __PRIVATE_queryWithAddedFilter(t._query, e));
    }
    _parse(t) {
        const e = __PRIVATE_newUserDataReader(t.firestore), r = function __PRIVATE_newQueryFilter(t, e, r, n, i, s, o) {
            let a;
            if (i.isKeyField()) {
                if ("array-contains" /* Operator.ARRAY_CONTAINS */ === s || "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === s) throw new FirestoreError(R, `Invalid Query. You can't perform '${s}' queries on documentId().`);
                if ("in" /* Operator.IN */ === s || "not-in" /* Operator.NOT_IN */ === s) {
                    __PRIVATE_validateDisjunctiveFilterElements(o, s);
                    const e = [];
                    for (const r of o) e.push(__PRIVATE_parseDocumentIdValue(n, t, r));
                    a = {
                        arrayValue: {
                            values: e
                        }
                    };
                } else a = __PRIVATE_parseDocumentIdValue(n, t, o);
            } else "in" /* Operator.IN */ !== s && "not-in" /* Operator.NOT_IN */ !== s && "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ !== s || __PRIVATE_validateDisjunctiveFilterElements(o, s), 
            a = __PRIVATE_parseQueryValue(r, e, o, 
            /* allowArrays= */ "in" /* Operator.IN */ === s || "not-in" /* Operator.NOT_IN */ === s);
            return FieldFilter.create(i, s, a);
        }(t._query, "where", e, t.firestore._databaseId, this._field, this._op, this._value);
        return r;
    }
}

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
 */ function where(t, e, r) {
    const n = e, i = __PRIVATE_fieldPathFromArgument("where", t);
    return QueryFieldFilterConstraint._create(i, n, r);
}

/**
 * A `QueryCompositeFilterConstraint` is used to narrow the set of documents
 * returned by a Firestore query by performing the logical OR or AND of multiple
 * {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
 * `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
 * {@link and} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains the `QueryCompositeFilterConstraint`.
 */ class QueryCompositeFilterConstraint extends AppliableConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    t, e) {
        super(), this.type = t, this._queryConstraints = e;
    }
    static _create(t, e) {
        return new QueryCompositeFilterConstraint(t, e);
    }
    _parse(t) {
        const e = this._queryConstraints.map((e => e._parse(t))).filter((t => t.getFilters().length > 0));
        return 1 === e.length ? e[0] : CompositeFilter.create(e, this._getOperator());
    }
    _apply(t) {
        const e = this._parse(t);
        return 0 === e.getFilters().length ? t : (function __PRIVATE_validateNewFilter(t, e) {
            let r = t;
            const n = e.getFlattenedFilters();
            for (const t of n) __PRIVATE_validateNewFieldFilter(r, t), r = __PRIVATE_queryWithAddedFilter(r, t);
        }
        // Checks if any of the provided filter operators are included in the given list of filters and
        // returns the first one that is, or null if none are.
        (t._query, e), new Query(t.firestore, t.converter, __PRIVATE_queryWithAddedFilter(t._query, e)));
    }
    _getQueryConstraints() {
        return this._queryConstraints;
    }
    _getOperator() {
        return "and" === this.type ? "and" /* CompositeOperator.AND */ : "or" /* CompositeOperator.OR */;
    }
}

/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a disjunction of
 * the given filter constraints. A disjunction filter includes a document if it
 * satisfies any of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a disjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */ function or(...t) {
    // Only support QueryFilterConstraints
    return t.forEach((t => __PRIVATE_validateQueryFilterConstraint("or", t))), QueryCompositeFilterConstraint._create("or" /* CompositeOperator.OR */ , t);
}

/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a conjunction of
 * the given filter constraints. A conjunction filter includes a document if it
 * satisfies all of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a conjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */ function and(...t) {
    // Only support QueryFilterConstraints
    return t.forEach((t => __PRIVATE_validateQueryFilterConstraint("and", t))), QueryCompositeFilterConstraint._create("and" /* CompositeOperator.AND */ , t);
}

/**
 * A `QueryOrderByConstraint` is used to sort the set of documents returned by a
 * Firestore query. `QueryOrderByConstraint`s are created by invoking
 * {@link orderBy} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains this `QueryOrderByConstraint`.
 *
 * Note: Documents that do not contain the orderBy field will not be present in
 * the query result.
 */ class QueryOrderByConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(t, e) {
        super(), this._field = t, this._direction = e, 
        /** The type of this query constraint */
        this.type = "orderBy";
    }
    static _create(t, e) {
        return new QueryOrderByConstraint(t, e);
    }
    _apply(t) {
        const e = function __PRIVATE_newQueryOrderBy(t, e, r) {
            if (null !== t.startAt) throw new FirestoreError(R, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
            if (null !== t.endAt) throw new FirestoreError(R, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
            return new OrderBy(e, r);
        }
        /**
 * Create a `Bound` from a query and a document.
 *
 * Note that the `Bound` will always include the key of the document
 * and so only the provided document will compare equal to the returned
 * position.
 *
 * Will throw if the document does not contain all fields of the order by
 * of the query or if any of the fields in the order by are an uncommitted
 * server timestamp.
 */ (t._query, this._field, this._direction);
        return new Query(t.firestore, t.converter, function __PRIVATE_queryWithAddedOrderBy(t, e) {
            // TODO(dimond): validate that orderBy does not list the same key twice.
            const r = t.explicitOrderBy.concat([ e ]);
            return new __PRIVATE_QueryImpl(t.path, t.collectionGroup, r, t.filters.slice(), t.limit, t.limitType, t.startAt, t.endAt);
        }(t._query, e));
    }
}

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
 */ function orderBy(t, e = "asc") {
    const r = e, n = __PRIVATE_fieldPathFromArgument("orderBy", t);
    return QueryOrderByConstraint._create(n, r);
}

/**
 * A `QueryLimitConstraint` is used to limit the number of documents returned by
 * a Firestore query.
 * `QueryLimitConstraint`s are created by invoking {@link limit} or
 * {@link limitToLast} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryLimitConstraint`.
 */ class QueryLimitConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    t, e, r) {
        super(), this.type = t, this._limit = e, this._limitType = r;
    }
    static _create(t, e, r) {
        return new QueryLimitConstraint(t, e, r);
    }
    _apply(t) {
        return new Query(t.firestore, t.converter, function __PRIVATE_queryWithLimit(t, e, r) {
            return new __PRIVATE_QueryImpl(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), e, r, t.startAt, t.endAt);
        }(t._query, this._limit, this._limitType));
    }
}

/**
 * Creates a {@link QueryLimitConstraint} that only returns the first matching
 * documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */ function limit(t) {
    return __PRIVATE_validatePositiveNumber("limit", t), QueryLimitConstraint._create("limit", t, "F" /* LimitType.First */);
}

/**
 * Creates a {@link QueryLimitConstraint} that only returns the last matching
 * documents.
 *
 * You must specify at least one `orderBy` clause for `limitToLast` queries,
 * otherwise an exception will be thrown during execution.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */ function limitToLast(t) {
    return __PRIVATE_validatePositiveNumber("limitToLast", t), QueryLimitConstraint._create("limitToLast", t, "L" /* LimitType.Last */);
}

/**
 * A `QueryStartAtConstraint` is used to exclude documents from the start of a
 * result set returned by a Firestore query.
 * `QueryStartAtConstraint`s are created by invoking {@link (startAt:1)} or
 * {@link (startAfter:1)} and can then be passed to {@link (query:1)} to create a
 * new query instance that also contains this `QueryStartAtConstraint`.
 */ class QueryStartAtConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    t, e, r) {
        super(), this.type = t, this._docOrFields = e, this._inclusive = r;
    }
    static _create(t, e, r) {
        return new QueryStartAtConstraint(t, e, r);
    }
    _apply(t) {
        const e = __PRIVATE_newQueryBoundFromDocOrFields(t, this.type, this._docOrFields, this._inclusive);
        return new Query(t.firestore, t.converter, function __PRIVATE_queryWithStartAt(t, e) {
            return new __PRIVATE_QueryImpl(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, e, t.endAt);
        }(t._query, e));
    }
}

function startAt(...t) {
    return QueryStartAtConstraint._create("startAt", t, 
    /*inclusive=*/ !0);
}

function startAfter(...t) {
    return QueryStartAtConstraint._create("startAfter", t, 
    /*inclusive=*/ !1);
}

/**
 * A `QueryEndAtConstraint` is used to exclude documents from the end of a
 * result set returned by a Firestore query.
 * `QueryEndAtConstraint`s are created by invoking {@link (endAt:1)} or
 * {@link (endBefore:1)} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryEndAtConstraint`.
 */ class QueryEndAtConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    t, e, r) {
        super(), this.type = t, this._docOrFields = e, this._inclusive = r;
    }
    static _create(t, e, r) {
        return new QueryEndAtConstraint(t, e, r);
    }
    _apply(t) {
        const e = __PRIVATE_newQueryBoundFromDocOrFields(t, this.type, this._docOrFields, this._inclusive);
        return new Query(t.firestore, t.converter, function __PRIVATE_queryWithEndAt(t, e) {
            return new __PRIVATE_QueryImpl(t.path, t.collectionGroup, t.explicitOrderBy.slice(), t.filters.slice(), t.limit, t.limitType, t.startAt, e);
        }(t._query, e));
    }
}

function endBefore(...t) {
    return QueryEndAtConstraint._create("endBefore", t, 
    /*inclusive=*/ !1);
}

function endAt(...t) {
    return QueryEndAtConstraint._create("endAt", t, 
    /*inclusive=*/ !0);
}

/** Helper function to create a bound from a document or fields */ function __PRIVATE_newQueryBoundFromDocOrFields(t, e, r, n) {
    if (r[0] = d(r[0]), r[0] instanceof DocumentSnapshot) return function __PRIVATE_newQueryBoundFromDocument(t, e, r, n, i) {
        if (!n) throw new FirestoreError(V, `Can't use a DocumentSnapshot that doesn't exist for ${r}().`);
        const s = [];
        // Because people expect to continue/end a query at the exact document
        // provided, we need to use the implicit sort order rather than the explicit
        // sort order, because it's guaranteed to contain the document key. That way
        // the position becomes unambiguous and the query continues/ends exactly at
        // the provided document. Without the key (by using the explicit sort
        // orders), multiple documents could match the position, yielding duplicate
        // results.
                for (const r of __PRIVATE_queryNormalizedOrderBy(t)) if (r.field.isKeyField()) s.push(__PRIVATE_refValue(e, n.key)); else {
            const t = n.data.field(r.field);
            if (__PRIVATE_isServerTimestamp(t)) throw new FirestoreError(R, 'Invalid query. You are trying to start or end a query using a document for which the field "' + r.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');
            if (null === t) {
                const t = r.field.canonicalString();
                throw new FirestoreError(R, `Invalid query. You are trying to start or end a query using a document for which the field '${t}' (used as the orderBy) does not exist.`);
            }
            s.push(t);
        }
        return new Bound(s, i);
    }
    /**
 * Converts a list of field values to a `Bound` for the given query.
 */ (t._query, t.firestore._databaseId, e, r[0]._document, n);
    {
        const i = __PRIVATE_newUserDataReader(t.firestore);
        return function __PRIVATE_newQueryBoundFromFields(t, e, r, n, i, s) {
            // Use explicit order by's because it has to match the query the user made
            const o = t.explicitOrderBy;
            if (i.length > o.length) throw new FirestoreError(R, `Too many arguments provided to ${n}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);
            const a = [];
            for (let s = 0; s < i.length; s++) {
                const u = i[s];
                if (o[s].field.isKeyField()) {
                    if ("string" != typeof u) throw new FirestoreError(R, `Invalid query. Expected a string for document ID in ${n}(), but got a ${typeof u}`);
                    if (!__PRIVATE_isCollectionGroupQuery(t) && -1 !== u.indexOf("/")) throw new FirestoreError(R, `Invalid query. When querying a collection and ordering by documentId(), the value passed to ${n}() must be a plain document ID, but '${u}' contains a slash.`);
                    const r = t.path.child(ResourcePath.fromString(u));
                    if (!DocumentKey.isDocumentKey(r)) throw new FirestoreError(R, `Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${n}() must result in a valid document path, but '${r}' is not because it contains an odd number of segments.`);
                    const i = new DocumentKey(r);
                    a.push(__PRIVATE_refValue(e, i));
                } else {
                    const t = __PRIVATE_parseQueryValue(r, n, u);
                    a.push(t);
                }
            }
            return new Bound(a, s);
        }
        /**
 * Parses the given `documentIdValue` into a `ReferenceValue`, throwing
 * appropriate errors if the value is anything other than a `DocumentReference`
 * or `string`, or if the string is malformed.
 */ (t._query, t.firestore._databaseId, i, e, r, n);
    }
}

function __PRIVATE_parseDocumentIdValue(t, e, r) {
    if ("string" == typeof (r = d(r))) {
        if ("" === r) throw new FirestoreError(R, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
        if (!__PRIVATE_isCollectionGroupQuery(e) && -1 !== r.indexOf("/")) throw new FirestoreError(R, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${r}' contains a '/' character.`);
        const n = e.path.child(ResourcePath.fromString(r));
        if (!DocumentKey.isDocumentKey(n)) throw new FirestoreError(R, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);
        return __PRIVATE_refValue(t, new DocumentKey(n));
    }
    if (r instanceof DocumentReference) return __PRIVATE_refValue(t, r._key);
    throw new FirestoreError(R, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${__PRIVATE_valueDescription(r)}.`);
}

/**
 * Validates that the value passed into a disjunctive filter satisfies all
 * array requirements.
 */ function __PRIVATE_validateDisjunctiveFilterElements(t, e) {
    if (!Array.isArray(t) || 0 === t.length) throw new FirestoreError(R, `Invalid Query. A non-empty array is required for '${e.toString()}' filters.`);
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
 */ function __PRIVATE_validateNewFieldFilter(t, e) {
    const r = function __PRIVATE_findOpInsideFilters(t, e) {
        for (const r of t) for (const t of r.getFlattenedFilters()) if (e.indexOf(t.op) >= 0) return t.op;
        return null;
    }(t.filters, function __PRIVATE_conflictingOps(t) {
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
    if (null !== r) 
    // Special case when it's a duplicate op to give a slightly clearer error message.
    throw r === e.op ? new FirestoreError(R, `Invalid query. You cannot use more than one '${e.op.toString()}' filter.`) : new FirestoreError(R, `Invalid query. You cannot use '${e.op.toString()}' filters with '${r.toString()}' filters.`);
}

function __PRIVATE_validateQueryFilterConstraint(t, e) {
    if (!(e instanceof QueryFieldFilterConstraint || e instanceof QueryCompositeFilterConstraint)) throw new FirestoreError(R, `Function ${t}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`);
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
 */
function __PRIVATE_applyFirestoreDataConverter(t, e, r) {
    let n;
    // Cast to `any` in order to satisfy the union type constraint on
    // toFirestore().
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return n = t ? r && (r.merge || r.mergeFields) ? t.toFirestore(e, r) : t.toFirestore(e) : e, 
    n;
}

class __PRIVATE_LiteUserDataWriter extends class AbstractUserDataWriter {
    convertValue(t, e = "none") {
        switch (__PRIVATE_typeOrder(t)) {
          case 0 /* TypeOrder.NullValue */ :
            return null;

          case 1 /* TypeOrder.BooleanValue */ :
            return t.booleanValue;

          case 2 /* TypeOrder.NumberValue */ :
            return __PRIVATE_normalizeNumber(t.integerValue || t.doubleValue);

          case 3 /* TypeOrder.TimestampValue */ :
            return this.convertTimestamp(t.timestampValue);

          case 4 /* TypeOrder.ServerTimestampValue */ :
            return this.convertServerTimestamp(t, e);

          case 5 /* TypeOrder.StringValue */ :
            return t.stringValue;

          case 6 /* TypeOrder.BlobValue */ :
            return this.convertBytes(__PRIVATE_normalizeByteString(t.bytesValue));

          case 7 /* TypeOrder.RefValue */ :
            return this.convertReference(t.referenceValue);

          case 8 /* TypeOrder.GeoPointValue */ :
            return this.convertGeoPoint(t.geoPointValue);

          case 9 /* TypeOrder.ArrayValue */ :
            return this.convertArray(t.arrayValue, e);

          case 10 /* TypeOrder.ObjectValue */ :
            return this.convertObject(t.mapValue, e);

          default:
            throw fail();
        }
    }
    convertObject(t, e) {
        return this.convertObjectMap(t.fields, e);
    }
    /**
     * @internal
     */    convertObjectMap(t, e = "none") {
        const r = {};
        return forEach(t, ((t, n) => {
            r[t] = this.convertValue(n, e);
        })), r;
    }
    convertGeoPoint(t) {
        return new GeoPoint(__PRIVATE_normalizeNumber(t.latitude), __PRIVATE_normalizeNumber(t.longitude));
    }
    convertArray(t, e) {
        return (t.values || []).map((t => this.convertValue(t, e)));
    }
    convertServerTimestamp(t, e) {
        switch (e) {
          case "previous":
            const r = __PRIVATE_getPreviousValue(t);
            return null == r ? null : this.convertValue(r, e);

          case "estimate":
            return this.convertTimestamp(__PRIVATE_getLocalWriteTime(t));

          default:
            return null;
        }
    }
    convertTimestamp(t) {
        const e = __PRIVATE_normalizeTimestamp(t);
        return new Timestamp(e.seconds, e.nanos);
    }
    convertDocumentKey(t, e) {
        const r = ResourcePath.fromString(t);
        __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(r));
        const n = new DatabaseId(r.get(1), r.get(3)), i = new DocumentKey(r.popFirst(5));
        return n.isEqual(e) || 
        // TODO(b/64130202): Somehow support foreign references.
        __PRIVATE_logError(`Document ${i} contains a document reference within a different database (${n.projectId}/${n.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`), 
        i;
    }
} {
    constructor(t) {
        super(), this.firestore = t;
    }
    convertBytes(t) {
        return new Bytes(t);
    }
    convertReference(t) {
        const e = this.convertDocumentKey(t, this.firestore._databaseId);
        return new DocumentReference(this.firestore, /* converter= */ null, e);
    }
}

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
 */ function getDoc(t) {
    const e = __PRIVATE_getDatastore((t = __PRIVATE_cast(t, DocumentReference)).firestore), r = new __PRIVATE_LiteUserDataWriter(t.firestore);
    return __PRIVATE_invokeBatchGetDocumentsRpc(e, [ t._key ]).then((e => {
        __PRIVATE_hardAssert(1 === e.length);
        const n = e[0];
        return new DocumentSnapshot(t.firestore, r, t._key, n.isFoundDocument() ? n : null, t.converter);
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
 */ function getDocs(t) {
    (function __PRIVATE_validateHasExplicitOrderByForLimitToLast(t) {
        if ("L" /* LimitType.Last */ === t.limitType && 0 === t.explicitOrderBy.length) throw new FirestoreError(b, "limitToLast() queries require specifying at least one orderBy() clause");
    })((t = __PRIVATE_cast(t, Query))._query);
    const e = __PRIVATE_getDatastore(t.firestore), r = new __PRIVATE_LiteUserDataWriter(t.firestore);
    return __PRIVATE_invokeRunQueryRpc(e, t._query).then((e => {
        const n = e.map((e => new QueryDocumentSnapshot(t.firestore, r, e.key, e, t.converter)));
        return "L" /* LimitType.Last */ === t._query.limitType && 
        // Limit to last queries reverse the orderBy constraint that was
        // specified by the user. As such, we need to reverse the order of the
        // results to return the documents in the expected order.
        n.reverse(), new QuerySnapshot(t, n);
    }));
}

function setDoc(t, e, r) {
    const n = __PRIVATE_applyFirestoreDataConverter((t = __PRIVATE_cast(t, DocumentReference)).converter, e, r), i = __PRIVATE_parseSetData(__PRIVATE_newUserDataReader(t.firestore), "setDoc", t._key, n, null !== t.converter, r);
    return __PRIVATE_invokeCommitRpc(__PRIVATE_getDatastore(t.firestore), [ i.toMutation(t._key, Precondition.none()) ]);
}

function updateDoc(t, e, r, ...n) {
    const i = __PRIVATE_newUserDataReader((t = __PRIVATE_cast(t, DocumentReference)).firestore);
    // For Compat types, we have to "extract" the underlying types before
    // performing validation.
        let s;
    s = "string" == typeof (e = d(e)) || e instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(i, "updateDoc", t._key, e, r, n) : __PRIVATE_parseUpdateData(i, "updateDoc", t._key, e);
    return __PRIVATE_invokeCommitRpc(__PRIVATE_getDatastore(t.firestore), [ s.toMutation(t._key, Precondition.exists(!0)) ]);
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
 */ function deleteDoc(t) {
    return __PRIVATE_invokeCommitRpc(__PRIVATE_getDatastore((t = __PRIVATE_cast(t, DocumentReference)).firestore), [ new __PRIVATE_DeleteMutation(t._key, Precondition.none()) ]);
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
 */ function addDoc(t, e) {
    const r = doc(t = __PRIVATE_cast(t, CollectionReference)), n = __PRIVATE_applyFirestoreDataConverter(t.converter, e), i = __PRIVATE_parseSetData(__PRIVATE_newUserDataReader(t.firestore), "addDoc", r._key, n, null !== r.converter, {});
    return __PRIVATE_invokeCommitRpc(__PRIVATE_getDatastore(t.firestore), [ i.toMutation(r._key, Precondition.exists(!1)) ]).then((() => r));
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
 */ function getCount(t) {
    return getAggregate(t, {
        count: count()
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
 */ function getAggregate(t, e) {
    const r = __PRIVATE_cast(t.firestore, Firestore), n = __PRIVATE_getDatastore(r), i = function __PRIVATE_mapToArray(t, e) {
        const r = [];
        for (const n in t) Object.prototype.hasOwnProperty.call(t, n) && r.push(e(t[n], n, t));
        return r;
    }(e, ((t, e) => new __PRIVATE_AggregateImpl(e, t.aggregateType, t._internalFieldPath)));
    // Run the aggregation and convert the results
    return __PRIVATE_invokeRunAggregationQueryRpc(n, t._query, i).then((e => function __PRIVATE_convertToAggregateQuerySnapshot(t, e, r) {
        const n = new __PRIVATE_LiteUserDataWriter(t);
        return new AggregateQuerySnapshot(e, n, r);
    }
    /**
 * Create an AggregateField object that can be used to compute the sum of
 * a specified field over a range of documents in the result set of a query.
 * @param field Specifies the field to sum across the result set.
 */ (r, t, e)));
}

function sum(t) {
    return new AggregateField("sum", __PRIVATE_fieldPathFromArgument$1("sum", t));
}

/**
 * Create an AggregateField object that can be used to compute the average of
 * a specified field over a range of documents in the result set of a query.
 * @param field Specifies the field to average across the result set.
 */ function average(t) {
    return new AggregateField("avg", __PRIVATE_fieldPathFromArgument$1("average", t));
}

/**
 * Create an AggregateField object that can be used to compute the count of
 * documents in the result set of a query.
 */ function count() {
    return new AggregateField("count");
}

/**
 * Compares two 'AggregateField` instances for equality.
 *
 * @param left Compare this AggregateField to the `right`.
 * @param right Compare this AggregateField to the `left`.
 */ function aggregateFieldEqual(t, e) {
    var r, n;
    return t instanceof AggregateField && e instanceof AggregateField && t.aggregateType === e.aggregateType && (null === (r = t._internalFieldPath) || void 0 === r ? void 0 : r.canonicalString()) === (null === (n = e._internalFieldPath) || void 0 === n ? void 0 : n.canonicalString());
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
 */ function aggregateQuerySnapshotEqual(t, e) {
    return queryEqual(t.query, e.query) && f(t.data(), e.data());
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
 */ function deleteField() {
    return new __PRIVATE_DeleteFieldValueImpl("deleteField");
}

/**
 * Returns a sentinel used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link @firebase/firestore/lite#(updateDoc:1)} to
 * include a server-generated timestamp in the written data.
 */ function serverTimestamp() {
    return new __PRIVATE_ServerTimestampFieldValueImpl("serverTimestamp");
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
 */ function arrayUnion(...t) {
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
    return new __PRIVATE_ArrayUnionFieldValueImpl("arrayUnion", t);
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
 */ function arrayRemove(...t) {
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
    return new __PRIVATE_ArrayRemoveFieldValueImpl("arrayRemove", t);
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
 */ function increment(t) {
    return new __PRIVATE_NumericIncrementFieldValueImpl("increment", t);
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
 */ class WriteBatch {
    /** @hideconstructor */
    constructor(t, e) {
        this._firestore = t, this._commitHandler = e, this._mutations = [], this._committed = !1, 
        this._dataReader = __PRIVATE_newUserDataReader(t);
    }
    set(t, e, r) {
        this._verifyNotCommitted();
        const n = __PRIVATE_validateReference(t, this._firestore), i = __PRIVATE_applyFirestoreDataConverter(n.converter, e, r), s = __PRIVATE_parseSetData(this._dataReader, "WriteBatch.set", n._key, i, null !== n.converter, r);
        return this._mutations.push(s.toMutation(n._key, Precondition.none())), this;
    }
    update(t, e, r, ...n) {
        this._verifyNotCommitted();
        const i = __PRIVATE_validateReference(t, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                let s;
        return s = "string" == typeof (e = d(e)) || e instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(this._dataReader, "WriteBatch.update", i._key, e, r, n) : __PRIVATE_parseUpdateData(this._dataReader, "WriteBatch.update", i._key, e), 
        this._mutations.push(s.toMutation(i._key, Precondition.exists(!0))), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */    delete(t) {
        this._verifyNotCommitted();
        const e = __PRIVATE_validateReference(t, this._firestore);
        return this._mutations = this._mutations.concat(new __PRIVATE_DeleteMutation(e._key, Precondition.none())), 
        this;
    }
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
     */    commit() {
        return this._verifyNotCommitted(), this._committed = !0, this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve();
    }
    _verifyNotCommitted() {
        if (this._committed) throw new FirestoreError(F, "A write batch can no longer be used after commit() has been called.");
    }
}

function __PRIVATE_validateReference(t, e) {
    if ((t = d(t)).firestore !== e) throw new FirestoreError(R, "Provided document reference is from a different Firestore instance.");
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
 */ function writeBatch(t) {
    const e = __PRIVATE_getDatastore(t = __PRIVATE_cast(t, Firestore));
    return new WriteBatch(t, (t => __PRIVATE_invokeCommitRpc(e, t)));
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
 */ class Transaction$1 {
    constructor(t) {
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
    async lookup(t) {
        if (this.ensureCommitNotCalled(), this.mutations.length > 0) throw new FirestoreError(R, "Firestore transactions require all reads to be executed before all writes.");
        const e = await __PRIVATE_invokeBatchGetDocumentsRpc(this.datastore, t);
        return e.forEach((t => this.recordVersion(t))), e;
    }
    set(t, e) {
        this.write(e.toMutation(t, this.precondition(t))), this.writtenDocs.add(t.toString());
    }
    update(t, e) {
        try {
            this.write(e.toMutation(t, this.preconditionForUpdate(t)));
        } catch (t) {
            this.lastWriteError = t;
        }
        this.writtenDocs.add(t.toString());
    }
    delete(t) {
        this.write(new __PRIVATE_DeleteMutation(t, this.precondition(t))), this.writtenDocs.add(t.toString());
    }
    async commit() {
        if (this.ensureCommitNotCalled(), this.lastWriteError) throw this.lastWriteError;
        const t = this.readVersions;
        // For each mutation, note that the doc was written.
                this.mutations.forEach((e => {
            t.delete(e.key.toString());
        })), 
        // For each document that was read but not written to, we want to perform
        // a `verify` operation.
        t.forEach(((t, e) => {
            const r = DocumentKey.fromPath(e);
            this.mutations.push(new __PRIVATE_VerifyMutation(r, this.precondition(r)));
        })), await __PRIVATE_invokeCommitRpc(this.datastore, this.mutations), this.committed = !0;
    }
    recordVersion(t) {
        let e;
        if (t.isFoundDocument()) e = t.version; else {
            if (!t.isNoDocument()) throw fail();
            // Represent a deleted doc using SnapshotVersion.min().
            e = SnapshotVersion.min();
        }
        const r = this.readVersions.get(t.key.toString());
        if (r) {
            if (!e.isEqual(r)) 
            // This transaction will fail no matter what.
            throw new FirestoreError(v, "Document version changed between two reads.");
        } else this.readVersions.set(t.key.toString(), e);
    }
    /**
     * Returns the version of this document when it was read in this transaction,
     * as a precondition, or no precondition if it was not read.
     */    precondition(t) {
        const e = this.readVersions.get(t.toString());
        return !this.writtenDocs.has(t.toString()) && e ? e.isEqual(SnapshotVersion.min()) ? Precondition.exists(!1) : Precondition.updateTime(e) : Precondition.none();
    }
    /**
     * Returns the precondition for a document if the operation is an update.
     */    preconditionForUpdate(t) {
        const e = this.readVersions.get(t.toString());
        // The first time a document is written, we want to take into account the
        // read time and existence
                if (!this.writtenDocs.has(t.toString()) && e) {
            if (e.isEqual(SnapshotVersion.min())) 
            // The document doesn't exist, so fail the transaction.
            // This has to be validated locally because you can't send a
            // precondition that a document does not exist without changing the
            // semantics of the backend write to be an insert. This is the reverse
            // of what we want, since we want to assert that the document doesn't
            // exist but then send the update and have it fail. Since we can't
            // express that to the backend, we have to validate locally.
            // Note: this can change once we can send separate verify writes in the
            // transaction.
            throw new FirestoreError(R, "Can't update a document that doesn't exist.");
            // Document exists, base precondition on document update time.
                        return Precondition.updateTime(e);
        }
        // Document was not read, so we just use the preconditions for a blind
        // update.
        return Precondition.exists(!0);
    }
    write(t) {
        this.ensureCommitNotCalled(), this.mutations.push(t);
    }
    ensureCommitNotCalled() {}
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
 */ const K = {
    maxAttempts: 5
};

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
/**
 * TransactionRunner encapsulates the logic needed to run and retry transactions
 * with backoff.
 */
class __PRIVATE_TransactionRunner {
    constructor(t, e, r, n, i) {
        this.asyncQueue = t, this.datastore = e, this.options = r, this.updateFunction = n, 
        this.deferred = i, this.ft = r.maxAttempts, this.Et = new __PRIVATE_ExponentialBackoff(this.asyncQueue, "transaction_retry" /* TimerId.TransactionRetry */);
    }
    /** Runs the transaction and sets the result on deferred. */    run() {
        this.ft -= 1, this.At();
    }
    At() {
        this.Et.K((async () => {
            const t = new Transaction$1(this.datastore), e = this.Tt(t);
            e && e.then((e => {
                this.asyncQueue.enqueueAndForget((() => t.commit().then((() => {
                    this.deferred.resolve(e);
                })).catch((t => {
                    this.Pt(t);
                }))));
            })).catch((t => {
                this.Pt(t);
            }));
        }));
    }
    Tt(t) {
        try {
            const e = this.updateFunction(t);
            return !__PRIVATE_isNullOrUndefined(e) && e.catch && e.then ? e : (this.deferred.reject(Error("Transaction callback must return a Promise")), 
            null);
        } catch (t) {
            // Do not retry errors thrown by user provided updateFunction.
            return this.deferred.reject(t), null;
        }
    }
    Pt(t) {
        this.ft > 0 && this.Rt(t) ? (this.ft -= 1, this.asyncQueue.enqueueAndForget((() => (this.At(), 
        Promise.resolve())))) : this.deferred.reject(t);
    }
    Rt(t) {
        if ("FirebaseError" === t.name) {
            // In transactions, the backend will fail outdated reads with FAILED_PRECONDITION and
            // non-matching document versions with ABORTED. These errors should be retried.
            const e = t.code;
            return "aborted" === e || "failed-precondition" === e || "already-exists" === e || !
            /**
 * Determines whether an error code represents a permanent error when received
 * in response to a non-write operation.
 *
 * See isPermanentWriteError for classifying write errors.
 */
            function __PRIVATE_isPermanentError(t) {
                switch (t) {
                  default:
                    return fail();

                  case T:
                  case P:
                  case I:
                  case g:
                  case C:
                  case S:
 // Unauthenticated means something went wrong with our token and we need
                    // to retry with new credentials which will happen automatically.
                                      case w:
                    return !1;

                  case R:
                  case V:
                  case p:
                  case y:
                  case F:
 // Aborted might be retried in some scenarios, but that is dependant on
                    // the context and should handled individually by the calling code.
                    // See https://cloud.google.com/apis/design/errors.
                                      case v:
                  case D:
                  case b:
                  case N:
                    return !0;
                }
            }(e);
        }
        return !1;
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
/** The Platform's 'document' implementation or null if not available. */ function getDocument() {
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
 */ class DelayedOperation {
    constructor(t, e, r, n, i) {
        this.asyncQueue = t, this.timerId = e, this.targetTimeMs = r, this.op = n, this.removalCallback = i, 
        this.deferred = new __PRIVATE_Deferred, this.then = this.deferred.promise.then.bind(this.deferred.promise), 
        // It's normal for the deferred promise to be canceled (due to cancellation)
        // and so we attach a dummy catch callback to avoid
        // 'UnhandledPromiseRejectionWarning' log spam.
        this.deferred.promise.catch((t => {}));
    }
    get promise() {
        return this.deferred.promise;
    }
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
     */    static createAndSchedule(t, e, r, n, i) {
        const s = Date.now() + r, o = new DelayedOperation(t, e, s, n, i);
        return o.start(r), o;
    }
    /**
     * Starts the timer. This is called immediately after construction by
     * createAndSchedule().
     */    start(t) {
        this.timerHandle = setTimeout((() => this.handleDelayElapsed()), t);
    }
    /**
     * Queues the operation to run immediately (if it hasn't already been run or
     * canceled).
     */    skipDelay() {
        return this.handleDelayElapsed();
    }
    /**
     * Cancels the operation if it hasn't already been executed or canceled. The
     * promise will be rejected.
     *
     * As long as the operation has not yet been run, calling cancel() provides a
     * guarantee that the operation will not be run.
     */    cancel(t) {
        null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new FirestoreError(T, "Operation cancelled" + (t ? ": " + t : ""))));
    }
    handleDelayElapsed() {
        this.asyncQueue.enqueueAndForget((() => null !== this.timerHandle ? (this.clearTimeout(), 
        this.op().then((t => this.deferred.resolve(t)))) : Promise.resolve()));
    }
    clearTimeout() {
        null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), 
        this.timerHandle = null);
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
 */ class __PRIVATE_AsyncQueueImpl {
    constructor() {
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
        this.Et = new __PRIVATE_ExponentialBackoff(this, "async_queue_retry" /* TimerId.AsyncQueueRetry */), 
        // Visibility handler that triggers an immediate retry of all retryable
        // operations. Meant to speed up recovery when we regain file system access
        // after page comes into foreground.
        this.bt = () => {
            const t = getDocument();
            t && __PRIVATE_logDebug("AsyncQueue", "Visibility state changed to " + t.visibilityState), 
            this.Et.H();
        };
        const t = getDocument();
        t && "function" == typeof t.addEventListener && t.addEventListener("visibilitychange", this.bt);
    }
    get isShuttingDown() {
        return this.yt;
    }
    /**
     * Adds a new operation to the queue without waiting for it to complete (i.e.
     * we ignore the Promise result).
     */    enqueueAndForget(t) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.enqueue(t);
    }
    enqueueAndForgetEvenWhileRestricted(t) {
        this.Ct(), 
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.St(t);
    }
    enterRestrictedMode(t) {
        if (!this.yt) {
            this.yt = !0, this.vt = t || !1;
            const e = getDocument();
            e && "function" == typeof e.removeEventListener && e.removeEventListener("visibilitychange", this.bt);
        }
    }
    enqueue(t) {
        if (this.Ct(), this.yt) 
        // Return a Promise which never resolves.
        return new Promise((() => {}));
        // Create a deferred Promise that we can return to the callee. This
        // allows us to return a "hanging Promise" only to the callee and still
        // advance the queue even when the operation is not run.
                const e = new __PRIVATE_Deferred;
        return this.St((() => this.yt && this.vt ? Promise.resolve() : (t().then(e.resolve, e.reject), 
        e.promise))).then((() => e.promise));
    }
    enqueueRetryable(t) {
        this.enqueueAndForget((() => (this.Vt.push(t), this.Nt())));
    }
    /**
     * Runs the next operation from the retryable queue. If the operation fails,
     * reschedules with backoff.
     */    async Nt() {
        if (0 !== this.Vt.length) {
            try {
                await this.Vt[0](), this.Vt.shift(), this.Et.reset();
            } catch (t) {
                if (!
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
                /** Verifies whether `e` is an IndexedDbTransactionError. */
                function __PRIVATE_isIndexedDbTransactionError(t) {
                    // Use name equality, as instanceof checks on errors don't work with errors
                    // that wrap other errors.
                    return "IndexedDbTransactionError" === t.name;
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
 */ (t)) throw t;
 // Failure will be handled by AsyncQueue
                                __PRIVATE_logDebug("AsyncQueue", "Operation failed with retryable error: " + t);
            }
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
            this.Et.K((() => this.Nt()));
        }
    }
    St(t) {
        const e = this.It.then((() => (this.Ft = !0, t().catch((t => {
            this.gt = t, this.Ft = !1;
            const e = 
            /**
 * Chrome includes Error.message in Error.stack. Other browsers do not.
 * This returns expected output of message + stack when available.
 * @param error - Error or FirestoreError
 */
            function __PRIVATE_getMessageOrStack(t) {
                let e = t.message || "";
                t.stack && (e = t.stack.includes(t.message) ? t.stack : t.message + "\n" + t.stack);
                return e;
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
            // TODO(mrschmidt) Consider using `BaseTransaction` as the base class in the
            // legacy SDK.
            /**
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */ (t);
            // Re-throw the error so that this.tail becomes a rejected Promise and
            // all further attempts to chain (via .then) will just short-circuit
            // and return the rejected Promise.
            throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", e), t;
        })).then((t => (this.Ft = !1, t))))));
        return this.It = e, e;
    }
    enqueueAfterDelay(t, e, r) {
        this.Ct(), 
        // Fast-forward delays for timerIds that have been overriden.
        this.Dt.indexOf(t) > -1 && (e = 0);
        const n = DelayedOperation.createAndSchedule(this, t, e, r, (t => this.Ot(t)));
        return this.wt.push(n), n;
    }
    Ct() {
        this.gt && fail();
    }
    verifyOperationInProgress() {}
    /**
     * Waits until all currently queued tasks are finished executing. Delayed
     * operations are not run.
     */    async qt() {
        // Operations in the queue prior to draining may have enqueued additional
        // operations. Keep draining the queue until the tail is no longer advanced,
        // which indicates that no more new operations were enqueued and that all
        // operations were executed.
        let t;
        do {
            t = this.It, await t;
        } while (t !== this.It);
    }
    /**
     * For Tests: Determine if a delayed operation with a particular TimerId
     * exists.
     */    Bt(t) {
        for (const e of this.wt) if (e.timerId === t) return !0;
        return !1;
    }
    /**
     * For Tests: Runs some or all delayed operations early.
     *
     * @param lastTimerId - Delayed operations up to and including this TimerId
     * will be drained. Pass TimerId.All to run all delayed operations.
     * @returns a Promise that resolves once all operations have been run.
     */    Qt(t) {
        // Note that draining may generate more delayed ops, so we do that first.
        return this.qt().then((() => {
            // Run ops in the same order they'd run if they ran naturally.
            this.wt.sort(((t, e) => t.targetTimeMs - e.targetTimeMs));
            for (const e of this.wt) if (e.skipDelay(), "all" /* TimerId.All */ !== t && e.timerId === t) break;
            return this.qt();
        }));
    }
    /**
     * For Tests: Skip all subsequent delays for a timer id.
     */    $t(t) {
        this.Dt.push(t);
    }
    /** Called once a DelayedOperation is run or canceled. */    Ot(t) {
        // NOTE: indexOf / slice are O(n), but delayedOperations is expected to be small.
        const e = this.wt.indexOf(t);
        this.wt.splice(e, 1);
    }
}

class Transaction {
    /** @hideconstructor */
    constructor(t, e) {
        this._firestore = t, this._transaction = e, this._dataReader = __PRIVATE_newUserDataReader(t);
    }
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */    get(t) {
        const e = __PRIVATE_validateReference(t, this._firestore), r = new __PRIVATE_LiteUserDataWriter(this._firestore);
        return this._transaction.lookup([ e._key ]).then((t => {
            if (!t || 1 !== t.length) return fail();
            const n = t[0];
            if (n.isFoundDocument()) return new DocumentSnapshot(this._firestore, r, n.key, n, e.converter);
            if (n.isNoDocument()) return new DocumentSnapshot(this._firestore, r, e._key, null, e.converter);
            throw fail();
        }));
    }
    set(t, e, r) {
        const n = __PRIVATE_validateReference(t, this._firestore), i = __PRIVATE_applyFirestoreDataConverter(n.converter, e, r), s = __PRIVATE_parseSetData(this._dataReader, "Transaction.set", n._key, i, null !== n.converter, r);
        return this._transaction.set(n._key, s), this;
    }
    update(t, e, r, ...n) {
        const i = __PRIVATE_validateReference(t, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                let s;
        return s = "string" == typeof (e = d(e)) || e instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(this._dataReader, "Transaction.update", i._key, e, r, n) : __PRIVATE_parseUpdateData(this._dataReader, "Transaction.update", i._key, e), 
        this._transaction.update(i._key, s), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */    delete(t) {
        const e = __PRIVATE_validateReference(t, this._firestore);
        return this._transaction.delete(e._key), this;
    }
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
 */ function runTransaction(t, e, r) {
    const n = __PRIVATE_getDatastore(t = __PRIVATE_cast(t, Firestore)), i = Object.assign(Object.assign({}, K), r);
    !function __PRIVATE_validateTransactionOptions(t) {
        if (t.maxAttempts < 1) throw new FirestoreError(R, "Max attempts must be at least 1");
    }(i);
    const s = new __PRIVATE_Deferred;
    return new __PRIVATE_TransactionRunner(function __PRIVATE_newAsyncQueue() {
        return new __PRIVATE_AsyncQueueImpl;
    }(), n, i, (r => e(new Transaction(t, r))), s).run(), s.promise;
}

/**
 * Firestore Lite
 *
 * @remarks Firestore Lite is a small online-only SDK that allows read
 * and write access to your Firestore database. All operations connect
 * directly to the backend, and `onSnapshot()` APIs are not supported.
 * @packageDocumentation
 */ !function __PRIVATE_registerFirestore() {
    !function __PRIVATE_setSDKVersion(t) {
        E = t;
    }(`${i}_lite`), r(new s("firestore/lite", ((t, {instanceIdentifier: e, options: r}) => {
        const n = t.getProvider("app").getImmediate(), i = new Firestore(new __PRIVATE_LiteAuthCredentialsProvider(t.getProvider("auth-internal")), new __PRIVATE_LiteAppCheckTokenProvider(t.getProvider("app-check-internal")), function __PRIVATE_databaseIdFromApp(t, e) {
            if (!Object.prototype.hasOwnProperty.apply(t.options, [ "projectId" ])) throw new FirestoreError(R, '"projectId" not provided in firebase.initializeApp.');
            return new DatabaseId(t.options.projectId, e);
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
 */ (n, e), n);
        return r && i._setSettings(r), i;
    }), "PUBLIC").setMultipleInstances(!0)), 
    // RUNTIME_ENV and BUILD_TARGET are replaced by real values during the compilation
    n("firestore-lite", "4.4.0", "rn"), n("firestore-lite", "4.4.0", "esm2017");
}();

export { AggregateField, AggregateQuerySnapshot, Bytes, CollectionReference, DocumentReference, DocumentSnapshot, FieldPath, FieldValue, Firestore, FirestoreError, GeoPoint, Query, QueryCompositeFilterConstraint, QueryConstraint, QueryDocumentSnapshot, QueryEndAtConstraint, QueryFieldFilterConstraint, QueryLimitConstraint, QueryOrderByConstraint, QuerySnapshot, QueryStartAtConstraint, Timestamp, Transaction, WriteBatch, addDoc, aggregateFieldEqual, aggregateQuerySnapshotEqual, and, arrayRemove, arrayUnion, average, collection, collectionGroup, connectFirestoreEmulator, count, deleteDoc, deleteField, doc, documentId, endAt, endBefore, getAggregate, getCount, getDoc, getDocs, getFirestore, increment, initializeFirestore, limit, limitToLast, or, orderBy, query, queryEqual, refEqual, runTransaction, serverTimestamp, setDoc, setLogLevel, snapshotEqual, startAfter, startAt, sum, terminate, updateDoc, where, writeBatch };
//# sourceMappingURL=index.rn.esm2017.js.map
