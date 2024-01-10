import { _getProvider, getApp as e, _removeServiceInstance as t, _registerComponent as n, registerVersion as r, SDK_VERSION as i } from "@firebase/app";

import { Component as s } from "@firebase/component";

import { Logger as o, LogLevel as _ } from "@firebase/logger";

import { FirebaseError as a, getUA as u, isIndexedDBAvailable as c, base64 as l, DecodeBase64StringError as h, isSafari as P, createMockUserToken as I, getModularInstance as T, deepEqual as E, getDefaultEmulatorHostnameAndPort as d } from "@firebase/util";

import { Integer as A, Md5 as R, XhrIo as V, EventType as m, ErrorCode as f, createWebChannelTransport as g, getStatEventTarget as p, WebChannel as y, Event as w, Stat as S } from "@firebase/webchannel-wrapper";

const b = "@firebase/firestore";

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
    constructor(e) {
        this.uid = e;
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
    isEqual(e) {
        return e.uid === this.uid;
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
let D = "10.7.0";

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
const C = new o("@firebase/firestore");

// Helper methods are needed because variables can't be exported as read/write
function __PRIVATE_getLogLevel() {
    return C.logLevel;
}

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
 */ function setLogLevel(e) {
    C.setLogLevel(e);
}

function __PRIVATE_logDebug(e, ...t) {
    if (C.logLevel <= _.DEBUG) {
        const n = t.map(__PRIVATE_argToString);
        C.debug(`Firestore (${D}): ${e}`, ...n);
    }
}

function __PRIVATE_logError(e, ...t) {
    if (C.logLevel <= _.ERROR) {
        const n = t.map(__PRIVATE_argToString);
        C.error(`Firestore (${D}): ${e}`, ...n);
    }
}

/**
 * @internal
 */ function __PRIVATE_logWarn(e, ...t) {
    if (C.logLevel <= _.WARN) {
        const n = t.map(__PRIVATE_argToString);
        C.warn(`Firestore (${D}): ${e}`, ...n);
    }
}

/**
 * Converts an additional log parameter to a string representation.
 */ function __PRIVATE_argToString(e) {
    if ("string" == typeof e) return e;
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
        return function __PRIVATE_formatJSON(e) {
            return JSON.stringify(e);
        }(e);
    } catch (t) {
        // Converting to JSON failed, just log the object directly
        return e;
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
 */ function fail(e = "Unexpected state") {
    // Log the failure in addition to throw an exception, just in case the
    // exception is swallowed.
    const t = `FIRESTORE (${D}) INTERNAL ASSERTION FAILED: ` + e;
    // NOTE: We don't use FirestoreError here because these are internal failures
    // that cannot be handled by the user. (Also it would create a circular
    // dependency between the error and assert modules which doesn't work.)
    throw __PRIVATE_logError(t), new Error(t);
}

/**
 * Fails if the given assertion condition is false, throwing an Error with the
 * given message if it did.
 *
 * Messages are stripped in production builds.
 */ function __PRIVATE_hardAssert(e, t) {
    e || fail();
}

/**
 * Fails if the given assertion condition is false, throwing an Error with the
 * given message if it did.
 *
 * The code of callsites invoking this function are stripped out in production
 * builds. Any side-effects of code within the debugAssert() invocation will not
 * happen in this case.
 *
 * @internal
 */ function __PRIVATE_debugAssert(e, t) {
    e || fail();
}

/**
 * Casts `obj` to `T`. In non-production builds, verifies that `obj` is an
 * instance of `T` before casting.
 */ function __PRIVATE_debugCast(e, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
t) {
    return e;
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
 */ const v = {
    // Causes are copied from:
    // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
    /** Not an error; returned on success. */
    OK: "ok",
    /** The operation was cancelled (typically by the caller). */
    CANCELLED: "cancelled",
    /** Unknown error or an error from a different error domain. */
    UNKNOWN: "unknown",
    /**
     * Client specified an invalid argument. Note that this differs from
     * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
     * problematic regardless of the state of the system (e.g., a malformed file
     * name).
     */
    INVALID_ARGUMENT: "invalid-argument",
    /**
     * Deadline expired before operation could complete. For operations that
     * change the state of the system, this error may be returned even if the
     * operation has completed successfully. For example, a successful response
     * from a server could have been delayed long enough for the deadline to
     * expire.
     */
    DEADLINE_EXCEEDED: "deadline-exceeded",
    /** Some requested entity (e.g., file or directory) was not found. */
    NOT_FOUND: "not-found",
    /**
     * Some entity that we attempted to create (e.g., file or directory) already
     * exists.
     */
    ALREADY_EXISTS: "already-exists",
    /**
     * The caller does not have permission to execute the specified operation.
     * PERMISSION_DENIED must not be used for rejections caused by exhausting
     * some resource (use RESOURCE_EXHAUSTED instead for those errors).
     * PERMISSION_DENIED must not be used if the caller can not be identified
     * (use UNAUTHENTICATED instead for those errors).
     */
    PERMISSION_DENIED: "permission-denied",
    /**
     * The request does not have valid authentication credentials for the
     * operation.
     */
    UNAUTHENTICATED: "unauthenticated",
    /**
     * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
     * entire file system is out of space.
     */
    RESOURCE_EXHAUSTED: "resource-exhausted",
    /**
     * Operation was rejected because the system is not in a state required for
     * the operation's execution. For example, directory to be deleted may be
     * non-empty, an rmdir operation is applied to a non-directory, etc.
     *
     * A litmus test that may help a service implementor in deciding
     * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
     *  (a) Use UNAVAILABLE if the client can retry just the failing call.
     *  (b) Use ABORTED if the client should retry at a higher-level
     *      (e.g., restarting a read-modify-write sequence).
     *  (c) Use FAILED_PRECONDITION if the client should not retry until
     *      the system state has been explicitly fixed. E.g., if an "rmdir"
     *      fails because the directory is non-empty, FAILED_PRECONDITION
     *      should be returned since the client should not retry unless
     *      they have first fixed up the directory by deleting files from it.
     *  (d) Use FAILED_PRECONDITION if the client performs conditional
     *      REST Get/Update/Delete on a resource and the resource on the
     *      server does not match the condition. E.g., conflicting
     *      read-modify-write on the same resource.
     */
    FAILED_PRECONDITION: "failed-precondition",
    /**
     * The operation was aborted, typically due to a concurrency issue like
     * sequencer check failures, transaction aborts, etc.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    ABORTED: "aborted",
    /**
     * Operation was attempted past the valid range. E.g., seeking or reading
     * past end of file.
     *
     * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
     * if the system state changes. For example, a 32-bit file system will
     * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
     * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
     * an offset past the current file size.
     *
     * There is a fair bit of overlap between FAILED_PRECONDITION and
     * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
     * when it applies so that callers who are iterating through a space can
     * easily look for an OUT_OF_RANGE error to detect when they are done.
     */
    OUT_OF_RANGE: "out-of-range",
    /** Operation is not implemented or not supported/enabled in this service. */
    UNIMPLEMENTED: "unimplemented",
    /**
     * Internal errors. Means some invariants expected by underlying System has
     * been broken. If you see one of these errors, Something is very broken.
     */
    INTERNAL: "internal",
    /**
     * The service is currently unavailable. This is a most likely a transient
     * condition and may be corrected by retrying with a backoff.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    UNAVAILABLE: "unavailable",
    /** Unrecoverable data loss or corruption. */
    DATA_LOSS: "data-loss"
};

/** An error returned by a Firestore operation. */ class FirestoreError extends a {
    /** @hideconstructor */
    constructor(
    /**
     * The backend error code associated with this error.
     */
    e, 
    /**
     * A custom error description.
     */
    t) {
        super(e, t), this.code = e, this.message = t, 
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
        this.promise = new Promise(((e, t) => {
            this.resolve = e, this.reject = t;
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
    constructor(e, t) {
        this.user = t, this.type = "OAuth", this.headers = new Map, this.headers.set("Authorization", `Bearer ${e}`);
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
    start(e, t) {
        // Fire with initial user.
        e.enqueueRetryable((() => t(User.UNAUTHENTICATED)));
    }
    shutdown() {}
}

/**
 * A CredentialsProvider that always returns a constant token. Used for
 * emulator token mocking.
 */ class __PRIVATE_EmulatorAuthCredentialsProvider {
    constructor(e) {
        this.token = e, 
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
    start(e, t) {
        this.changeListener = t, 
        // Fire with initial user.
        e.enqueueRetryable((() => t(this.token.user)));
    }
    shutdown() {
        this.changeListener = null;
    }
}

class __PRIVATE_FirebaseAuthCredentialsProvider {
    constructor(e) {
        this.t = e, 
        /** Tracks the current User. */
        this.currentUser = User.UNAUTHENTICATED, 
        /**
         * Counter used to detect if the token changed while a getToken request was
         * outstanding.
         */
        this.i = 0, this.forceRefresh = !1, this.auth = null;
    }
    start(e, t) {
        let n = this.i;
        // A change listener that prevents double-firing for the same token change.
                const __PRIVATE_guardedChangeListener = e => this.i !== n ? (n = this.i, 
        t(e)) : Promise.resolve();
        // A promise that can be waited on to block on the next token change.
        // This promise is re-created after each change.
                let r = new __PRIVATE_Deferred;
        this.o = () => {
            this.i++, this.currentUser = this.u(), r.resolve(), r = new __PRIVATE_Deferred, 
            e.enqueueRetryable((() => __PRIVATE_guardedChangeListener(this.currentUser)));
        };
        const __PRIVATE_awaitNextToken = () => {
            const t = r;
            e.enqueueRetryable((async () => {
                await t.promise, await __PRIVATE_guardedChangeListener(this.currentUser);
            }));
        }, __PRIVATE_registerAuth = e => {
            __PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e, 
            this.auth.addAuthTokenListener(this.o), __PRIVATE_awaitNextToken();
        };
        this.t.onInit((e => __PRIVATE_registerAuth(e))), 
        // Our users can initialize Auth right after Firestore, so we give it
        // a chance to register itself with the component framework before we
        // determine whether to start up in unauthenticated mode.
        setTimeout((() => {
            if (!this.auth) {
                const e = this.t.getImmediate({
                    optional: !0
                });
                e ? __PRIVATE_registerAuth(e) : (
                // If auth is still not available, proceed with `null` user
                __PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth not yet detected"), 
                r.resolve(), r = new __PRIVATE_Deferred);
            }
        }), 0), __PRIVATE_awaitNextToken();
    }
    getToken() {
        // Take note of the current value of the tokenCounter so that this method
        // can fail (with an ABORTED error) if there is a token change while the
        // request is outstanding.
        const e = this.i, t = this.forceRefresh;
        return this.forceRefresh = !1, this.auth ? this.auth.getToken(t).then((t => 
        // Cancel the request since the token changed while the request was
        // outstanding so the response is potentially for a previous user (which
        // user, we can't be sure).
        this.i !== e ? (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), 
        this.getToken()) : t ? (__PRIVATE_hardAssert("string" == typeof t.accessToken), 
        new __PRIVATE_OAuthToken(t.accessToken, this.currentUser)) : null)) : Promise.resolve(null);
    }
    invalidateToken() {
        this.forceRefresh = !0;
    }
    shutdown() {
        this.auth && this.auth.removeAuthTokenListener(this.o);
    }
    // Auth.getUid() can return null even with a user logged in. It is because
    // getUid() is synchronous, but the auth code populating Uid is asynchronous.
    // This method should only be called in the AuthTokenListener callback
    // to guarantee to get the actual user.
    u() {
        const e = this.auth && this.auth.getUid();
        return __PRIVATE_hardAssert(null === e || "string" == typeof e), new User(e);
    }
}

/*
 * FirstPartyToken provides a fresh token each time its value
 * is requested, because if the token is too old, requests will be rejected.
 * Technically this may no longer be necessary since the SDK should gracefully
 * recover from unauthenticated errors (see b/33147818 for context), but it's
 * safer to keep the implementation as-is.
 */ class __PRIVATE_FirstPartyToken {
    constructor(e, t, n) {
        this.l = e, this.h = t, this.P = n, this.type = "FirstParty", this.user = User.FIRST_PARTY, 
        this.I = new Map;
    }
    /**
     * Gets an authorization token, using a provided factory function, or return
     * null.
     */    T() {
        return this.P ? this.P() : null;
    }
    get headers() {
        this.I.set("X-Goog-AuthUser", this.l);
        // Use array notation to prevent minification
        const e = this.T();
        return e && this.I.set("Authorization", e), this.h && this.I.set("X-Goog-Iam-Authorization-Token", this.h), 
        this.I;
    }
}

/*
 * Provides user credentials required for the Firestore JavaScript SDK
 * to authenticate the user, using technique that is only available
 * to applications hosted by Google.
 */ class __PRIVATE_FirstPartyAuthCredentialsProvider {
    constructor(e, t, n) {
        this.l = e, this.h = t, this.P = n;
    }
    getToken() {
        return Promise.resolve(new __PRIVATE_FirstPartyToken(this.l, this.h, this.P));
    }
    start(e, t) {
        // Fire with initial uid.
        e.enqueueRetryable((() => t(User.FIRST_PARTY)));
    }
    shutdown() {}
    invalidateToken() {}
}

class AppCheckToken {
    constructor(e) {
        this.value = e, this.type = "AppCheck", this.headers = new Map, e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
    }
}

class __PRIVATE_FirebaseAppCheckTokenProvider {
    constructor(e) {
        this.A = e, this.forceRefresh = !1, this.appCheck = null, this.R = null;
    }
    start(e, t) {
        const onTokenChanged = e => {
            null != e.error && __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);
            const n = e.token !== this.R;
            return this.R = e.token, __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Received ${n ? "new" : "existing"} token.`), 
            n ? t(e.token) : Promise.resolve();
        };
        this.o = t => {
            e.enqueueRetryable((() => onTokenChanged(t)));
        };
        const __PRIVATE_registerAppCheck = e => {
            __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e, 
            this.appCheck.addTokenListener(this.o);
        };
        this.A.onInit((e => __PRIVATE_registerAppCheck(e))), 
        // Our users can initialize AppCheck after Firestore, so we give it
        // a chance to register itself with the component framework.
        setTimeout((() => {
            if (!this.appCheck) {
                const e = this.A.getImmediate({
                    optional: !0
                });
                e ? __PRIVATE_registerAppCheck(e) : 
                // If AppCheck is still not available, proceed without it.
                __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck not yet detected");
            }
        }), 0);
    }
    getToken() {
        const e = this.forceRefresh;
        return this.forceRefresh = !1, this.appCheck ? this.appCheck.getToken(e).then((e => e ? (__PRIVATE_hardAssert("string" == typeof e.token), 
        this.R = e.token, new AppCheckToken(e.token)) : null)) : Promise.resolve(null);
    }
    invalidateToken() {
        this.forceRefresh = !0;
    }
    shutdown() {
        this.appCheck && this.appCheck.removeTokenListener(this.o);
    }
}

/**
 * An AppCheck token provider that always yields an empty token.
 * @internal
 */ class __PRIVATE_EmptyAppCheckTokenProvider {
    getToken() {
        return Promise.resolve(new AppCheckToken(""));
    }
    invalidateToken() {}
    start(e, t) {}
    shutdown() {}
}

/**
 * Builds a CredentialsProvider depending on the type of
 * the credentials passed in.
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
function __PRIVATE_randomBytes(e) {
    // Polyfills for IE and WebWorker by using `self` and `msCrypto` when `crypto` is not available.
    const t = 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "undefined" != typeof self && (self.crypto || self.msCrypto), n = new Uint8Array(e);
    if (t && "function" == typeof t.getRandomValues) t.getRandomValues(n); else 
    // Falls back to Math.random
    for (let t = 0; t < e; t++) n[t] = Math.floor(256 * Math.random());
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
 */ class __PRIVATE_AutoId {
    static newId() {
        // Alphanumeric characters
        const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = Math.floor(256 / e.length) * e.length;
        // The largest byte value that is a multiple of `char.length`.
                let n = "";
        for (;n.length < 20; ) {
            const r = __PRIVATE_randomBytes(40);
            for (let i = 0; i < r.length; ++i) 
            // Only accept values that are [0, maxMultiple), this ensures they can
            // be evenly mapped to indices of `chars` via a modulo operation.
            n.length < 20 && r[i] < t && (n += e.charAt(r[i] % e.length));
        }
        return n;
    }
}

function __PRIVATE_primitiveComparator(e, t) {
    return e < t ? -1 : e > t ? 1 : 0;
}

/** Helper to compare arrays using isEqual(). */ function __PRIVATE_arrayEquals(e, t, n) {
    return e.length === t.length && e.every(((e, r) => n(e, t[r])));
}

/**
 * Returns the immediate lexicographically-following string. This is useful to
 * construct an inclusive range for indexeddb iterators.
 */ function __PRIVATE_immediateSuccessor(e) {
    // Return the input string, with an additional NUL byte appended.
    return e + "\0";
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
    e, 
    /**
     * The fractions of a second at nanosecond resolution.*
     */
    t) {
        if (this.seconds = e, this.nanoseconds = t, t < 0) throw new FirestoreError(v.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
        if (t >= 1e9) throw new FirestoreError(v.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
        if (e < -62135596800) throw new FirestoreError(v.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
        // This will break in the year 10,000.
                if (e >= 253402300800) throw new FirestoreError(v.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
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
     */    static fromDate(e) {
        return Timestamp.fromMillis(e.getTime());
    }
    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds - Number of milliseconds since Unix epoch
     *     1970-01-01T00:00:00Z.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     number of milliseconds.
     */    static fromMillis(e) {
        const t = Math.floor(e / 1e3), n = Math.floor(1e6 * (e - 1e3 * t));
        return new Timestamp(t, n);
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
    _compareTo(e) {
        return this.seconds === e.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e.seconds);
    }
    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other - The `Timestamp` to compare against.
     * @returns true if this `Timestamp` is equal to the provided one.
     */    isEqual(e) {
        return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
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
        const e = this.seconds - -62135596800;
        // Note: Up to 12 decimal digits are required to represent all valid
        // 'seconds' values.
                return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
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
 * A version of a document in Firestore. This corresponds to the version
 * timestamp, such as update_time or read_time.
 */ class SnapshotVersion {
    constructor(e) {
        this.timestamp = e;
    }
    static fromTimestamp(e) {
        return new SnapshotVersion(e);
    }
    static min() {
        return new SnapshotVersion(new Timestamp(0, 0));
    }
    static max() {
        return new SnapshotVersion(new Timestamp(253402300799, 999999999));
    }
    compareTo(e) {
        return this.timestamp._compareTo(e.timestamp);
    }
    isEqual(e) {
        return this.timestamp.isEqual(e.timestamp);
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
/**
 * Path represents an ordered sequence of string segments.
 */
class BasePath {
    constructor(e, t, n) {
        void 0 === t ? t = 0 : t > e.length && fail(), void 0 === n ? n = e.length - t : n > e.length - t && fail(), 
        this.segments = e, this.offset = t, this.len = n;
    }
    get length() {
        return this.len;
    }
    isEqual(e) {
        return 0 === BasePath.comparator(this, e);
    }
    child(e) {
        const t = this.segments.slice(this.offset, this.limit());
        return e instanceof BasePath ? e.forEach((e => {
            t.push(e);
        })) : t.push(e), this.construct(t);
    }
    /** The index of one past the last segment of the path. */    limit() {
        return this.offset + this.length;
    }
    popFirst(e) {
        return e = void 0 === e ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
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
    get(e) {
        return this.segments[this.offset + e];
    }
    isEmpty() {
        return 0 === this.length;
    }
    isPrefixOf(e) {
        if (e.length < this.length) return !1;
        for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
        return !0;
    }
    isImmediateParentOf(e) {
        if (this.length + 1 !== e.length) return !1;
        for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
        return !0;
    }
    forEach(e) {
        for (let t = this.offset, n = this.limit(); t < n; t++) e(this.segments[t]);
    }
    toArray() {
        return this.segments.slice(this.offset, this.limit());
    }
    static comparator(e, t) {
        const n = Math.min(e.length, t.length);
        for (let r = 0; r < n; r++) {
            const n = e.get(r), i = t.get(r);
            if (n < i) return -1;
            if (n > i) return 1;
        }
        return e.length < t.length ? -1 : e.length > t.length ? 1 : 0;
    }
}

/**
 * A slash-separated path for navigating resources (documents and collections)
 * within Firestore.
 *
 * @internal
 */ class ResourcePath extends BasePath {
    construct(e, t, n) {
        return new ResourcePath(e, t, n);
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
     */    static fromString(...e) {
        // NOTE: The client is ignorant of any path segments containing escape
        // sequences (e.g. __id123__) and just passes them through raw (they exist
        // for legacy reasons and should not be used frequently).
        const t = [];
        for (const n of e) {
            if (n.indexOf("//") >= 0) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
            // Strip leading and traling slashed.
                        t.push(...n.split("/").filter((e => e.length > 0)));
        }
        return new ResourcePath(t);
    }
    static emptyPath() {
        return new ResourcePath([]);
    }
}

const F = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

/**
 * A dot-separated path for navigating sub-objects within a document.
 * @internal
 */ class FieldPath$1 extends BasePath {
    construct(e, t, n) {
        return new FieldPath$1(e, t, n);
    }
    /**
     * Returns true if the string could be used as a segment in a field path
     * without escaping.
     */    static isValidIdentifier(e) {
        return F.test(e);
    }
    canonicalString() {
        return this.toArray().map((e => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), 
        FieldPath$1.isValidIdentifier(e) || (e = "`" + e + "`"), e))).join(".");
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
     */    static fromServerFormat(e) {
        const t = [];
        let n = "", r = 0;
        const __PRIVATE_addCurrentSegment = () => {
            if (0 === n.length) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
            t.push(n), n = "";
        };
        let i = !1;
        for (;r < e.length; ) {
            const t = e[r];
            if ("\\" === t) {
                if (r + 1 === e.length) throw new FirestoreError(v.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
                const t = e[r + 1];
                if ("\\" !== t && "." !== t && "`" !== t) throw new FirestoreError(v.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
                n += t, r += 2;
            } else "`" === t ? (i = !i, r++) : "." !== t || i ? (n += t, r++) : (__PRIVATE_addCurrentSegment(), 
            r++);
        }
        if (__PRIVATE_addCurrentSegment(), i) throw new FirestoreError(v.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
        return new FieldPath$1(t);
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
    constructor(e) {
        this.path = e;
    }
    static fromPath(e) {
        return new DocumentKey(ResourcePath.fromString(e));
    }
    static fromName(e) {
        return new DocumentKey(ResourcePath.fromString(e).popFirst(5));
    }
    static empty() {
        return new DocumentKey(ResourcePath.emptyPath());
    }
    get collectionGroup() {
        return this.path.popLast().lastSegment();
    }
    /** Returns true if the document is in the specified collectionId. */    hasCollectionId(e) {
        return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
    }
    /** Returns the collection group (i.e. the name of the parent collection) for this key. */    getCollectionGroup() {
        return this.path.get(this.path.length - 2);
    }
    /** Returns the fully qualified path to the parent collection. */    getCollectionPath() {
        return this.path.popLast();
    }
    isEqual(e) {
        return null !== e && 0 === ResourcePath.comparator(this.path, e.path);
    }
    toString() {
        return this.path.toString();
    }
    static comparator(e, t) {
        return ResourcePath.comparator(e.path, t.path);
    }
    static isDocumentKey(e) {
        return e.length % 2 == 0;
    }
    /**
     * Creates and returns a new document key with the given segments.
     *
     * @param segments - The segments of the path to the document
     * @returns A new instance of DocumentKey
     */    static fromSegments(e) {
        return new DocumentKey(new ResourcePath(e.slice()));
    }
}

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
/**
 * The initial mutation batch id for each index. Gets updated during index
 * backfill.
 */
/**
 * An index definition for field indexes in Firestore.
 *
 * Every index is associated with a collection. The definition contains a list
 * of fields and their index kind (which can be `ASCENDING`, `DESCENDING` or
 * `CONTAINS` for ArrayContains/ArrayContainsAny queries).
 *
 * Unlike the backend, the SDK does not differentiate between collection or
 * collection group-scoped indices. Every index can be used for both single
 * collection and collection group queries.
 */
class FieldIndex {
    constructor(
    /**
     * The index ID. Returns -1 if the index ID is not available (e.g. the index
     * has not yet been persisted).
     */
    e, 
    /** The collection ID this index applies to. */
    t, 
    /** The field segments for this index. */
    n, 
    /** Shows how up-to-date the index is for the current user. */
    r) {
        this.indexId = e, this.collectionGroup = t, this.fields = n, this.indexState = r;
    }
}

/** An ID for an index that has not yet been added to persistence.  */
/** Returns the ArrayContains/ArrayContainsAny segment for this index. */
function __PRIVATE_fieldIndexGetArraySegment(e) {
    return e.fields.find((e => 2 /* IndexKind.CONTAINS */ === e.kind));
}

/** Returns all directional (ascending/descending) segments for this index. */ function __PRIVATE_fieldIndexGetDirectionalSegments(e) {
    return e.fields.filter((e => 2 /* IndexKind.CONTAINS */ !== e.kind));
}

/**
 * Returns the order of the document key component for the given index.
 *
 * PORTING NOTE: This is only used in the Web IndexedDb implementation.
 */
/**
 * Compares indexes by collection group and segments. Ignores update time and
 * index ID.
 */
function __PRIVATE_fieldIndexSemanticComparator(e, t) {
    let n = __PRIVATE_primitiveComparator(e.collectionGroup, t.collectionGroup);
    if (0 !== n) return n;
    for (let r = 0; r < Math.min(e.fields.length, t.fields.length); ++r) if (n = __PRIVATE_indexSegmentComparator(e.fields[r], t.fields[r]), 
    0 !== n) return n;
    return __PRIVATE_primitiveComparator(e.fields.length, t.fields.length);
}

/** Returns a debug representation of the field index */ FieldIndex.UNKNOWN_ID = -1;

/** An index component consisting of field path and index type.  */
class IndexSegment {
    constructor(
    /** The field path of the component. */
    e, 
    /** The fields sorting order. */
    t) {
        this.fieldPath = e, this.kind = t;
    }
}

function __PRIVATE_indexSegmentComparator(e, t) {
    const n = FieldPath$1.comparator(e.fieldPath, t.fieldPath);
    return 0 !== n ? n : __PRIVATE_primitiveComparator(e.kind, t.kind);
}

/**
 * Stores the "high water mark" that indicates how updated the Index is for the
 * current user.
 */ class IndexState {
    constructor(
    /**
     * Indicates when the index was last updated (relative to other indexes).
     */
    e, 
    /** The the latest indexed read time, document and batch id. */
    t) {
        this.sequenceNumber = e, this.offset = t;
    }
    /** The state of an index that has not yet been backfilled. */    static empty() {
        return new IndexState(0, IndexOffset.min());
    }
}

/**
 * Creates an offset that matches all documents with a read time higher than
 * `readTime`.
 */ function __PRIVATE_newIndexOffsetSuccessorFromReadTime(e, t) {
    // We want to create an offset that matches all documents with a read time
    // greater than the provided read time. To do so, we technically need to
    // create an offset for `(readTime, MAX_DOCUMENT_KEY)`. While we could use
    // Unicode codepoints to generate MAX_DOCUMENT_KEY, it is much easier to use
    // `(readTime + 1, DocumentKey.empty())` since `> DocumentKey.empty()` matches
    // all valid document IDs.
    const n = e.toTimestamp().seconds, r = e.toTimestamp().nanoseconds + 1, i = SnapshotVersion.fromTimestamp(1e9 === r ? new Timestamp(n + 1, 0) : new Timestamp(n, r));
    return new IndexOffset(i, DocumentKey.empty(), t);
}

/** Creates a new offset based on the provided document. */ function __PRIVATE_newIndexOffsetFromDocument(e) {
    return new IndexOffset(e.readTime, e.key, -1);
}

/**
 * Stores the latest read time, document and batch ID that were processed for an
 * index.
 */ class IndexOffset {
    constructor(
    /**
     * The latest read time version that has been indexed by Firestore for this
     * field index.
     */
    e, 
    /**
     * The key of the last document that was indexed for this query. Use
     * `DocumentKey.empty()` if no document has been indexed.
     */
    t, 
    /*
     * The largest mutation batch id that's been processed by Firestore.
     */
    n) {
        this.readTime = e, this.documentKey = t, this.largestBatchId = n;
    }
    /** Returns an offset that sorts before all regular offsets. */    static min() {
        return new IndexOffset(SnapshotVersion.min(), DocumentKey.empty(), -1);
    }
    /** Returns an offset that sorts after all regular offsets. */    static max() {
        return new IndexOffset(SnapshotVersion.max(), DocumentKey.empty(), -1);
    }
}

function __PRIVATE_indexOffsetComparator(e, t) {
    let n = e.readTime.compareTo(t.readTime);
    return 0 !== n ? n : (n = DocumentKey.comparator(e.documentKey, t.documentKey), 
    0 !== n ? n : __PRIVATE_primitiveComparator(e.largestBatchId, t.largestBatchId));
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
 */ const M = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";

/**
 * A base class representing a persistence transaction, encapsulating both the
 * transaction's sequence numbers as well as a list of onCommitted listeners.
 *
 * When you call Persistence.runTransaction(), it will create a transaction and
 * pass it to your callback. You then pass it to any method that operates
 * on persistence.
 */ class PersistenceTransaction {
    constructor() {
        this.onCommittedListeners = [];
    }
    addOnCommittedListener(e) {
        this.onCommittedListeners.push(e);
    }
    raiseOnCommittedEvent() {
        this.onCommittedListeners.forEach((e => e()));
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
 * Verifies the error thrown by a LocalStore operation. If a LocalStore
 * operation fails because the primary lease has been taken by another client,
 * we ignore the error (the persistence layer will immediately call
 * `applyPrimaryLease` to propagate the primary state change). All other errors
 * are re-thrown.
 *
 * @param err - An error returned by a LocalStore operation.
 * @returns A Promise that resolves after we recovered, or the original error.
 */ async function __PRIVATE_ignoreIfPrimaryLeaseLoss(e) {
    if (e.code !== v.FAILED_PRECONDITION || e.message !== M) throw e;
    __PRIVATE_logDebug("LocalStore", "Unexpectedly lost primary lease");
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
 * PersistencePromise is essentially a re-implementation of Promise except
 * it has a .next() method instead of .then() and .next() and .catch() callbacks
 * are executed synchronously when a PersistencePromise resolves rather than
 * asynchronously (Promise implementations use setImmediate() or similar).
 *
 * This is necessary to interoperate with IndexedDB which will automatically
 * commit transactions if control is returned to the event loop without
 * synchronously initiating another operation on the transaction.
 *
 * NOTE: .then() and .catch() only allow a single consumer, unlike normal
 * Promises.
 */ class PersistencePromise {
    constructor(e) {
        // NOTE: next/catchCallback will always point to our own wrapper functions,
        // not the user's raw next() or catch() callbacks.
        this.nextCallback = null, this.catchCallback = null, 
        // When the operation resolves, we'll set result or error and mark isDone.
        this.result = void 0, this.error = void 0, this.isDone = !1, 
        // Set to true when .then() or .catch() are called and prevents additional
        // chaining.
        this.callbackAttached = !1, e((e => {
            this.isDone = !0, this.result = e, this.nextCallback && 
            // value should be defined unless T is Void, but we can't express
            // that in the type system.
            this.nextCallback(e);
        }), (e => {
            this.isDone = !0, this.error = e, this.catchCallback && this.catchCallback(e);
        }));
    }
    catch(e) {
        return this.next(void 0, e);
    }
    next(e, t) {
        return this.callbackAttached && fail(), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new PersistencePromise(((n, r) => {
            this.nextCallback = t => {
                this.wrapSuccess(e, t).next(n, r);
            }, this.catchCallback = e => {
                this.wrapFailure(t, e).next(n, r);
            };
        }));
    }
    toPromise() {
        return new Promise(((e, t) => {
            this.next(e, t);
        }));
    }
    wrapUserFunction(e) {
        try {
            const t = e();
            return t instanceof PersistencePromise ? t : PersistencePromise.resolve(t);
        } catch (e) {
            return PersistencePromise.reject(e);
        }
    }
    wrapSuccess(e, t) {
        return e ? this.wrapUserFunction((() => e(t))) : PersistencePromise.resolve(t);
    }
    wrapFailure(e, t) {
        return e ? this.wrapUserFunction((() => e(t))) : PersistencePromise.reject(t);
    }
    static resolve(e) {
        return new PersistencePromise(((t, n) => {
            t(e);
        }));
    }
    static reject(e) {
        return new PersistencePromise(((t, n) => {
            n(e);
        }));
    }
    static waitFor(
    // Accept all Promise types in waitFor().
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    e) {
        return new PersistencePromise(((t, n) => {
            let r = 0, i = 0, s = !1;
            e.forEach((e => {
                ++r, e.next((() => {
                    ++i, s && i === r && t();
                }), (e => n(e)));
            })), s = !0, i === r && t();
        }));
    }
    /**
     * Given an array of predicate functions that asynchronously evaluate to a
     * boolean, implements a short-circuiting `or` between the results. Predicates
     * will be evaluated until one of them returns `true`, then stop. The final
     * result will be whether any of them returned `true`.
     */    static or(e) {
        let t = PersistencePromise.resolve(!1);
        for (const n of e) t = t.next((e => e ? PersistencePromise.resolve(e) : n()));
        return t;
    }
    static forEach(e, t) {
        const n = [];
        return e.forEach(((e, r) => {
            n.push(t.call(this, e, r));
        })), this.waitFor(n);
    }
    /**
     * Concurrently map all array elements through asynchronous function.
     */    static mapArray(e, t) {
        return new PersistencePromise(((n, r) => {
            const i = e.length, s = new Array(i);
            let o = 0;
            for (let _ = 0; _ < i; _++) {
                const a = _;
                t(e[a]).next((e => {
                    s[a] = e, ++o, o === i && n(s);
                }), (e => r(e)));
            }
        }));
    }
    /**
     * An alternative to recursive PersistencePromise calls, that avoids
     * potential memory problems from unbounded chains of promises.
     *
     * The `action` will be called repeatedly while `condition` is true.
     */    static doWhile(e, t) {
        return new PersistencePromise(((n, r) => {
            const process = () => {
                !0 === e() ? t().next((() => {
                    process();
                }), r) : n();
            };
            process();
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
 */
// References to `window` are guarded by SimpleDb.isAvailable()
/* eslint-disable no-restricted-globals */
/**
 * Wraps an IDBTransaction and exposes a store() method to get a handle to a
 * specific object store.
 */
class __PRIVATE_SimpleDbTransaction {
    constructor(e, t) {
        this.action = e, this.transaction = t, this.aborted = !1, 
        /**
         * A `Promise` that resolves with the result of the IndexedDb transaction.
         */
        this.V = new __PRIVATE_Deferred, this.transaction.oncomplete = () => {
            this.V.resolve();
        }, this.transaction.onabort = () => {
            t.error ? this.V.reject(new __PRIVATE_IndexedDbTransactionError(e, t.error)) : this.V.resolve();
        }, this.transaction.onerror = t => {
            const n = __PRIVATE_checkForAndReportiOSError(t.target.error);
            this.V.reject(new __PRIVATE_IndexedDbTransactionError(e, n));
        };
    }
    static open(e, t, n, r) {
        try {
            return new __PRIVATE_SimpleDbTransaction(t, e.transaction(r, n));
        } catch (e) {
            throw new __PRIVATE_IndexedDbTransactionError(t, e);
        }
    }
    get m() {
        return this.V.promise;
    }
    abort(e) {
        e && this.V.reject(e), this.aborted || (__PRIVATE_logDebug("SimpleDb", "Aborting transaction:", e ? e.message : "Client-initiated abort"), 
        this.aborted = !0, this.transaction.abort());
    }
    g() {
        // If the browser supports V3 IndexedDB, we invoke commit() explicitly to
        // speed up index DB processing if the event loop remains blocks.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = this.transaction;
        this.aborted || "function" != typeof e.commit || e.commit();
    }
    /**
     * Returns a SimpleDbStore<KeyType, ValueType> for the specified store. All
     * operations performed on the SimpleDbStore happen within the context of this
     * transaction and it cannot be used anymore once the transaction is
     * completed.
     *
     * Note that we can't actually enforce that the KeyType and ValueType are
     * correct, but they allow type safety through the rest of the consuming code.
     */    store(e) {
        const t = this.transaction.objectStore(e);
        return new __PRIVATE_SimpleDbStore(t);
    }
}

/**
 * Provides a wrapper around IndexedDb with a simplified interface that uses
 * Promise-like return values to chain operations. Real promises cannot be used
 * since .then() continuations are executed asynchronously (e.g. via
 * .setImmediate), which would cause IndexedDB to end the transaction.
 * See PersistencePromise for more details.
 */ class __PRIVATE_SimpleDb {
    /*
     * Creates a new SimpleDb wrapper for IndexedDb database `name`.
     *
     * Note that `version` must not be a downgrade. IndexedDB does not support
     * downgrading the schema version. We currently do not support any way to do
     * versioning outside of IndexedDB's versioning mechanism, as only
     * version-upgrade transactions are allowed to do things like create
     * objectstores.
     */
    constructor(e, t, n) {
        this.name = e, this.version = t, this.p = n;
        // NOTE: According to https://bugs.webkit.org/show_bug.cgi?id=197050, the
        // bug we're checking for should exist in iOS >= 12.2 and < 13, but for
        // whatever reason it's much harder to hit after 12.2 so we only proactively
        // log on 12.2.
        12.2 === __PRIVATE_SimpleDb.S(u()) && __PRIVATE_logError("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
    }
    /** Deletes the specified database. */    static delete(e) {
        return __PRIVATE_logDebug("SimpleDb", "Removing database:", e), __PRIVATE_wrapRequest(window.indexedDB.deleteDatabase(e)).toPromise();
    }
    /** Returns true if IndexedDB is available in the current environment. */    static D() {
        if (!c()) return !1;
        if (__PRIVATE_SimpleDb.C()) return !0;
        // We extensively use indexed array values and compound keys,
        // which IE and Edge do not support. However, they still have indexedDB
        // defined on the window, so we need to check for them here and make sure
        // to return that persistence is not enabled for those browsers.
        // For tracking support of this feature, see here:
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/status/indexeddbarraysandmultientrysupport/
        // Check the UA string to find out the browser.
                const e = u(), t = __PRIVATE_SimpleDb.S(e), n = 0 < t && t < 10, r = __PRIVATE_SimpleDb.v(e), i = 0 < r && r < 4.5;
        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
        // Edge
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML,
        // like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
        // iOS Safari: Disable for users running iOS version < 10.
                return !(e.indexOf("MSIE ") > 0 || e.indexOf("Trident/") > 0 || e.indexOf("Edge/") > 0 || n || i);
    }
    /**
     * Returns true if the backing IndexedDB store is the Node IndexedDBShim
     * (see https://github.com/axemclion/IndexedDBShim).
     */    static C() {
        var e;
        return "undefined" != typeof process && "YES" === (null === (e = process.env) || void 0 === e ? void 0 : e.F);
    }
    /** Helper to get a typed SimpleDbStore from a transaction. */    static M(e, t) {
        return e.store(t);
    }
    // visible for testing
    /** Parse User Agent to determine iOS version. Returns -1 if not found. */
    static S(e) {
        const t = e.match(/i(?:phone|pad|pod) os ([\d_]+)/i), n = t ? t[1].split("_").slice(0, 2).join(".") : "-1";
        return Number(n);
    }
    // visible for testing
    /** Parse User Agent to determine Android version. Returns -1 if not found. */
    static v(e) {
        const t = e.match(/Android ([\d.]+)/i), n = t ? t[1].split(".").slice(0, 2).join(".") : "-1";
        return Number(n);
    }
    /**
     * Opens the specified database, creating or upgrading it if necessary.
     */    async O(e) {
        return this.db || (__PRIVATE_logDebug("SimpleDb", "Opening database:", this.name), 
        this.db = await new Promise(((t, n) => {
            // TODO(mikelehen): Investigate browser compatibility.
            // https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
            // suggests IE9 and older WebKit browsers handle upgrade
            // differently. They expect setVersion, as described here:
            // https://developer.mozilla.org/en-US/docs/Web/API/IDBVersionChangeRequest/setVersion
            const r = indexedDB.open(this.name, this.version);
            r.onsuccess = e => {
                const n = e.target.result;
                t(n);
            }, r.onblocked = () => {
                n(new __PRIVATE_IndexedDbTransactionError(e, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
            }, r.onerror = t => {
                const r = t.target.error;
                "VersionError" === r.name ? n(new FirestoreError(v.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === r.name ? n(new FirestoreError(v.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + r)) : n(new __PRIVATE_IndexedDbTransactionError(e, r));
            }, r.onupgradeneeded = e => {
                __PRIVATE_logDebug("SimpleDb", 'Database "' + this.name + '" requires upgrade from version:', e.oldVersion);
                const t = e.target.result;
                this.p.N(t, r.transaction, e.oldVersion, this.version).next((() => {
                    __PRIVATE_logDebug("SimpleDb", "Database upgrade to version " + this.version + " complete");
                }));
            };
        }))), this.B && (this.db.onversionchange = e => this.B(e)), this.db;
    }
    L(e) {
        this.B = e, this.db && (this.db.onversionchange = t => e(t));
    }
    async runTransaction(e, t, n, r) {
        const i = "readonly" === t;
        let s = 0;
        for (;;) {
            ++s;
            try {
                this.db = await this.O(e);
                const t = __PRIVATE_SimpleDbTransaction.open(this.db, e, i ? "readonly" : "readwrite", n), s = r(t).next((e => (t.g(), 
                e))).catch((e => (
                // Abort the transaction if there was an error.
                t.abort(e), PersistencePromise.reject(e)))).toPromise();
                // As noted above, errors are propagated by aborting the transaction. So
                // we swallow any error here to avoid the browser logging it as unhandled.
                return s.catch((() => {})), 
                // Wait for the transaction to complete (i.e. IndexedDb's onsuccess event to
                // fire), but still return the original transactionFnResult back to the
                // caller.
                await t.m, s;
            } catch (e) {
                const t = e, n = "FirebaseError" !== t.name && s < 3;
                // TODO(schmidt-sebastian): We could probably be smarter about this and
                // not retry exceptions that are likely unrecoverable (such as quota
                // exceeded errors).
                // Note: We cannot use an instanceof check for FirestoreException, since the
                // exception is wrapped in a generic error by our async/await handling.
                                if (__PRIVATE_logDebug("SimpleDb", "Transaction failed with error:", t.message, "Retrying:", n), 
                this.close(), !n) return Promise.reject(t);
            }
        }
    }
    close() {
        this.db && this.db.close(), this.db = void 0;
    }
}

/**
 * A controller for iterating over a key range or index. It allows an iterate
 * callback to delete the currently-referenced object, or jump to a new key
 * within the key range or index.
 */ class __PRIVATE_IterationController {
    constructor(e) {
        this.k = e, this.q = !1, this.K = null;
    }
    get isDone() {
        return this.q;
    }
    get $() {
        return this.K;
    }
    set cursor(e) {
        this.k = e;
    }
    /**
     * This function can be called to stop iteration at any point.
     */    done() {
        this.q = !0;
    }
    /**
     * This function can be called to skip to that next key, which could be
     * an index or a primary key.
     */    U(e) {
        this.K = e;
    }
    /**
     * Delete the current cursor value from the object store.
     *
     * NOTE: You CANNOT do this with a keysOnly query.
     */    delete() {
        return __PRIVATE_wrapRequest(this.k.delete());
    }
}

/** An error that wraps exceptions that thrown during IndexedDB execution. */ class __PRIVATE_IndexedDbTransactionError extends FirestoreError {
    constructor(e, t) {
        super(v.UNAVAILABLE, `IndexedDB transaction '${e}' failed: ${t}`), this.name = "IndexedDbTransactionError";
    }
}

/** Verifies whether `e` is an IndexedDbTransactionError. */ function __PRIVATE_isIndexedDbTransactionError(e) {
    // Use name equality, as instanceof checks on errors don't work with errors
    // that wrap other errors.
    return "IndexedDbTransactionError" === e.name;
}

/**
 * A wrapper around an IDBObjectStore providing an API that:
 *
 * 1) Has generic KeyType / ValueType parameters to provide strongly-typed
 * methods for acting against the object store.
 * 2) Deals with IndexedDB's onsuccess / onerror event callbacks, making every
 * method return a PersistencePromise instead.
 * 3) Provides a higher-level API to avoid needing to do excessive wrapping of
 * intermediate IndexedDB types (IDBCursorWithValue, etc.)
 */ class __PRIVATE_SimpleDbStore {
    constructor(e) {
        this.store = e;
    }
    put(e, t) {
        let n;
        return void 0 !== t ? (__PRIVATE_logDebug("SimpleDb", "PUT", this.store.name, e, t), 
        n = this.store.put(t, e)) : (__PRIVATE_logDebug("SimpleDb", "PUT", this.store.name, "<auto-key>", e), 
        n = this.store.put(e)), __PRIVATE_wrapRequest(n);
    }
    /**
     * Adds a new value into an Object Store and returns the new key. Similar to
     * IndexedDb's `add()`, this method will fail on primary key collisions.
     *
     * @param value - The object to write.
     * @returns The key of the value to add.
     */    add(e) {
        __PRIVATE_logDebug("SimpleDb", "ADD", this.store.name, e, e);
        return __PRIVATE_wrapRequest(this.store.add(e));
    }
    /**
     * Gets the object with the specified key from the specified store, or null
     * if no object exists with the specified key.
     *
     * @key The key of the object to get.
     * @returns The object with the specified key or null if no object exists.
     */    get(e) {
        // We're doing an unsafe cast to ValueType.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return __PRIVATE_wrapRequest(this.store.get(e)).next((t => (
        // Normalize nonexistence to null.
        void 0 === t && (t = null), __PRIVATE_logDebug("SimpleDb", "GET", this.store.name, e, t), 
        t)));
    }
    delete(e) {
        __PRIVATE_logDebug("SimpleDb", "DELETE", this.store.name, e);
        return __PRIVATE_wrapRequest(this.store.delete(e));
    }
    /**
     * If we ever need more of the count variants, we can add overloads. For now,
     * all we need is to count everything in a store.
     *
     * Returns the number of rows in the store.
     */    count() {
        __PRIVATE_logDebug("SimpleDb", "COUNT", this.store.name);
        return __PRIVATE_wrapRequest(this.store.count());
    }
    W(e, t) {
        const n = this.options(e, t);
        // Use `getAll()` if the browser supports IndexedDB v3, as it is roughly
        // 20% faster. Unfortunately, getAll() does not support custom indices.
                if (n.index || "function" != typeof this.store.getAll) {
            const e = this.cursor(n), t = [];
            return this.G(e, ((e, n) => {
                t.push(n);
            })).next((() => t));
        }
        {
            const e = this.store.getAll(n.range);
            return new PersistencePromise(((t, n) => {
                e.onerror = e => {
                    n(e.target.error);
                }, e.onsuccess = e => {
                    t(e.target.result);
                };
            }));
        }
    }
    /**
     * Loads the first `count` elements from the provided index range. Loads all
     * elements if no limit is provided.
     */    j(e, t) {
        const n = this.store.getAll(e, null === t ? void 0 : t);
        return new PersistencePromise(((e, t) => {
            n.onerror = e => {
                t(e.target.error);
            }, n.onsuccess = t => {
                e(t.target.result);
            };
        }));
    }
    H(e, t) {
        __PRIVATE_logDebug("SimpleDb", "DELETE ALL", this.store.name);
        const n = this.options(e, t);
        n.J = !1;
        const r = this.cursor(n);
        return this.G(r, ((e, t, n) => n.delete()));
    }
    Y(e, t) {
        let n;
        t ? n = e : (n = {}, t = e);
        const r = this.cursor(n);
        return this.G(r, t);
    }
    /**
     * Iterates over a store, but waits for the given callback to complete for
     * each entry before iterating the next entry. This allows the callback to do
     * asynchronous work to determine if this iteration should continue.
     *
     * The provided callback should return `true` to continue iteration, and
     * `false` otherwise.
     */    Z(e) {
        const t = this.cursor({});
        return new PersistencePromise(((n, r) => {
            t.onerror = e => {
                const t = __PRIVATE_checkForAndReportiOSError(e.target.error);
                r(t);
            }, t.onsuccess = t => {
                const r = t.target.result;
                r ? e(r.primaryKey, r.value).next((e => {
                    e ? r.continue() : n();
                })) : n();
            };
        }));
    }
    G(e, t) {
        const n = [];
        return new PersistencePromise(((r, i) => {
            e.onerror = e => {
                i(e.target.error);
            }, e.onsuccess = e => {
                const i = e.target.result;
                if (!i) return void r();
                const s = new __PRIVATE_IterationController(i), o = t(i.primaryKey, i.value, s);
                if (o instanceof PersistencePromise) {
                    const e = o.catch((e => (s.done(), PersistencePromise.reject(e))));
                    n.push(e);
                }
                s.isDone ? r() : null === s.$ ? i.continue() : i.continue(s.$);
            };
        })).next((() => PersistencePromise.waitFor(n)));
    }
    options(e, t) {
        let n;
        return void 0 !== e && ("string" == typeof e ? n = e : t = e), {
            index: n,
            range: t
        };
    }
    cursor(e) {
        let t = "next";
        if (e.reverse && (t = "prev"), e.index) {
            const n = this.store.index(e.index);
            return e.J ? n.openKeyCursor(e.range, t) : n.openCursor(e.range, t);
        }
        return this.store.openCursor(e.range, t);
    }
}

/**
 * Wraps an IDBRequest in a PersistencePromise, using the onsuccess / onerror
 * handlers to resolve / reject the PersistencePromise as appropriate.
 */ function __PRIVATE_wrapRequest(e) {
    return new PersistencePromise(((t, n) => {
        e.onsuccess = e => {
            const n = e.target.result;
            t(n);
        }, e.onerror = e => {
            const t = __PRIVATE_checkForAndReportiOSError(e.target.error);
            n(t);
        };
    }));
}

// Guard so we only report the error once.
let x = !1;

function __PRIVATE_checkForAndReportiOSError(e) {
    const t = __PRIVATE_SimpleDb.S(u());
    if (t >= 12.2 && t < 13) {
        const t = "An internal error was encountered in the Indexed Database server";
        if (e.message.indexOf(t) >= 0) {
            // Wrap error in a more descriptive one.
            const e = new FirestoreError("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
            return x || (x = !0, 
            // Throw a global exception outside of this promise chain, for the user to
            // potentially catch.
            setTimeout((() => {
                throw e;
            }), 0)), e;
        }
    }
    return e;
}

/** This class is responsible for the scheduling of Index Backfiller. */
class __PRIVATE_IndexBackfillerScheduler {
    constructor(e, t) {
        this.asyncQueue = e, this.X = t, this.task = null;
    }
    start() {
        this.ee(15e3);
    }
    stop() {
        this.task && (this.task.cancel(), this.task = null);
    }
    get started() {
        return null !== this.task;
    }
    ee(e) {
        __PRIVATE_logDebug("IndexBackiller", `Scheduled in ${e}ms`), this.task = this.asyncQueue.enqueueAfterDelay("index_backfill" /* TimerId.IndexBackfill */ , e, (async () => {
            this.task = null;
            try {
                __PRIVATE_logDebug("IndexBackiller", `Documents written: ${await this.X.te()}`);
            } catch (e) {
                __PRIVATE_isIndexedDbTransactionError(e) ? __PRIVATE_logDebug("IndexBackiller", "Ignoring IndexedDB error during index backfill: ", e) : await __PRIVATE_ignoreIfPrimaryLeaseLoss(e);
            }
            await this.ee(6e4);
        }));
    }
}

/** Implements the steps for backfilling indexes. */ class __PRIVATE_IndexBackfiller {
    constructor(
    /**
     * LocalStore provides access to IndexManager and LocalDocumentView.
     * These properties will update when the user changes. Consequently,
     * making a local copy of IndexManager and LocalDocumentView will require
     * updates over time. The simpler solution is to rely on LocalStore to have
     * an up-to-date references to IndexManager and LocalDocumentStore.
     */
    e, t) {
        this.localStore = e, this.persistence = t;
    }
    async te(e = 50) {
        return this.persistence.runTransaction("Backfill Indexes", "readwrite-primary", (t => this.ne(t, e)));
    }
    /** Writes index entries until the cap is reached. Returns the number of documents processed. */    ne(e, t) {
        const n = new Set;
        let r = t, i = !0;
        return PersistencePromise.doWhile((() => !0 === i && r > 0), (() => this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((t => {
            if (null !== t && !n.has(t)) return __PRIVATE_logDebug("IndexBackiller", `Processing collection: ${t}`), 
            this.re(e, t, r).next((e => {
                r -= e, n.add(t);
            }));
            i = !1;
        })))).next((() => t - r));
    }
    /**
     * Writes entries for the provided collection group. Returns the number of documents processed.
     */    re(e, t, n) {
        // Use the earliest offset of all field indexes to query the local cache.
        return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e, t).next((r => this.localStore.localDocuments.getNextDocuments(e, t, r, n).next((n => {
            const i = n.changes;
            return this.localStore.indexManager.updateIndexEntries(e, i).next((() => this.ie(r, n))).next((n => (__PRIVATE_logDebug("IndexBackiller", `Updating offset: ${n}`), 
            this.localStore.indexManager.updateCollectionGroup(e, t, n)))).next((() => i.size));
        }))));
    }
    /** Returns the next offset based on the provided documents. */    ie(e, t) {
        let n = e;
        return t.changes.forEach(((e, t) => {
            const r = __PRIVATE_newIndexOffsetFromDocument(t);
            __PRIVATE_indexOffsetComparator(r, n) > 0 && (n = r);
        })), new IndexOffset(n.readTime, n.documentKey, Math.max(t.batchId, e.largestBatchId));
    }
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
/**
 * `ListenSequence` is a monotonic sequence. It is initialized with a minimum value to
 * exceed. All subsequent calls to next will return increasing values. If provided with a
 * `SequenceNumberSyncer`, it will additionally bump its next value when told of a new value, as
 * well as write out sequence numbers that it produces via `next()`.
 */ class __PRIVATE_ListenSequence {
    constructor(e, t) {
        this.previousValue = e, t && (t.sequenceNumberHandler = e => this.se(e), this.oe = e => t.writeSequenceNumber(e));
    }
    se(e) {
        return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
    }
    next() {
        const e = ++this.previousValue;
        return this.oe && this.oe(e), e;
    }
}

__PRIVATE_ListenSequence._e = -1;

/**
 * Returns whether a variable is either undefined or null.
 */
function __PRIVATE_isNullOrUndefined(e) {
    return null == e;
}

/** Returns whether the value represents -0. */ function __PRIVATE_isNegativeZero(e) {
    // Detect if the value is -0.0. Based on polyfill from
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    return 0 === e && 1 / e == -1 / 0;
}

/**
 * Returns whether a value is an integer and in the safe integer range
 * @param value - The value to test for being an integer and in the safe range
 */ function isSafeInteger(e) {
    return "number" == typeof e && Number.isInteger(e) && !__PRIVATE_isNegativeZero(e) && e <= Number.MAX_SAFE_INTEGER && e >= Number.MIN_SAFE_INTEGER;
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
 * Encodes a resource path into a IndexedDb-compatible string form.
 */
function __PRIVATE_encodeResourcePath(e) {
    let t = "";
    for (let n = 0; n < e.length; n++) t.length > 0 && (t = __PRIVATE_encodeSeparator(t)), 
    t = __PRIVATE_encodeSegment(e.get(n), t);
    return __PRIVATE_encodeSeparator(t);
}

/** Encodes a single segment of a resource path into the given result */ function __PRIVATE_encodeSegment(e, t) {
    let n = t;
    const r = e.length;
    for (let t = 0; t < r; t++) {
        const r = e.charAt(t);
        switch (r) {
          case "\0":
            n += "";
            break;

          case "":
            n += "";
            break;

          default:
            n += r;
        }
    }
    return n;
}

/** Encodes a path separator into the given result */ function __PRIVATE_encodeSeparator(e) {
    return e + "";
}

/**
 * Decodes the given IndexedDb-compatible string form of a resource path into
 * a ResourcePath instance. Note that this method is not suitable for use with
 * decoding resource names from the server; those are One Platform format
 * strings.
 */ function __PRIVATE_decodeResourcePath(e) {
    // Event the empty path must encode as a path of at least length 2. A path
    // with exactly 2 must be the empty path.
    const t = e.length;
    if (__PRIVATE_hardAssert(t >= 2), 2 === t) return __PRIVATE_hardAssert("" === e.charAt(0) && "" === e.charAt(1)), 
    ResourcePath.emptyPath();
    // Escape characters cannot exist past the second-to-last position in the
    // source value.
        const __PRIVATE_lastReasonableEscapeIndex = t - 2, n = [];
    let r = "";
    for (let i = 0; i < t; ) {
        // The last two characters of a valid encoded path must be a separator, so
        // there must be an end to this segment.
        const t = e.indexOf("", i);
        (t < 0 || t > __PRIVATE_lastReasonableEscapeIndex) && fail();
        switch (e.charAt(t + 1)) {
          case "":
            const s = e.substring(i, t);
            let o;
            0 === r.length ? 
            // Avoid copying for the common case of a segment that excludes \0
            // and \001
            o = s : (r += s, o = r, r = ""), n.push(o);
            break;

          case "":
            r += e.substring(i, t), r += "\0";
            break;

          case "":
            // The escape character can be used in the output to encode itself.
            r += e.substring(i, t + 1);
            break;

          default:
            fail();
        }
        i = t + 2;
    }
    return new ResourcePath(n);
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
 */ const O = [ "userId", "batchId" ];

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
 * Name of the IndexedDb object store.
 *
 * Note that the name 'owner' is chosen to ensure backwards compatibility with
 * older clients that only supported single locked access to the persistence
 * layer.
 */
/**
 * Creates a [userId, encodedPath] key for use in the DbDocumentMutations
 * index to iterate over all at document mutations for a given path or lower.
 */
function __PRIVATE_newDbDocumentMutationPrefixForPath(e, t) {
    return [ e, __PRIVATE_encodeResourcePath(t) ];
}

/**
 * Creates a full index key of [userId, encodedPath, batchId] for inserting
 * and deleting into the DbDocumentMutations index.
 */ function __PRIVATE_newDbDocumentMutationKey(e, t, n) {
    return [ e, __PRIVATE_encodeResourcePath(t), n ];
}

/**
 * Because we store all the useful information for this store in the key,
 * there is no useful information to store as the value. The raw (unencoded)
 * path cannot be stored because IndexedDb doesn't store prototype
 * information.
 */ const N = {}, B = [ "prefixPath", "collectionGroup", "readTime", "documentId" ], L = [ "prefixPath", "collectionGroup", "documentId" ], k = [ "collectionGroup", "readTime", "prefixPath", "documentId" ], q = [ "canonicalId", "targetId" ], Q = [ "targetId", "path" ], K = [ "path", "targetId" ], $ = [ "collectionId", "parent" ], U = [ "indexId", "uid" ], W = [ "uid", "sequenceNumber" ], G = [ "indexId", "uid", "arrayValue", "directionalValue", "orderedDocumentKey", "documentKey" ], z = [ "indexId", "uid", "orderedDocumentKey" ], j = [ "userId", "collectionPath", "documentId" ], H = [ "userId", "collectionPath", "largestBatchId" ], J = [ "userId", "collectionGroup", "largestBatchId" ], Y = [ ...[ ...[ ...[ ...[ "mutationQueues", "mutations", "documentMutations", "remoteDocuments", "targets", "owner", "targetGlobal", "targetDocuments" ], "clientMetadata" ], "remoteDocumentGlobal" ], "collectionParents" ], "bundles", "namedQueries" ], Z = [ ...Y, "documentOverlays" ], X = [ "mutationQueues", "mutations", "documentMutations", "remoteDocumentsV14", "targets", "owner", "targetGlobal", "targetDocuments", "clientMetadata", "remoteDocumentGlobal", "collectionParents", "bundles", "namedQueries", "documentOverlays" ], ee = X, te = [ ...ee, "indexConfiguration", "indexState", "indexEntries" ];

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
class __PRIVATE_IndexedDbTransaction extends PersistenceTransaction {
    constructor(e, t) {
        super(), this.ae = e, this.currentSequenceNumber = t;
    }
}

function __PRIVATE_getStore(e, t) {
    const n = __PRIVATE_debugCast(e);
    return __PRIVATE_SimpleDb.M(n.ae, t);
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
 */ function __PRIVATE_objectSize(e) {
    let t = 0;
    for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t++;
    return t;
}

function forEach(e, t) {
    for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
}

function isEmpty(e) {
    for (const t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
    return !0;
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
    constructor(e, t) {
        this.comparator = e, this.root = t || LLRBNode.EMPTY;
    }
    // Returns a copy of the map, with the specified key/value added or replaced.
    insert(e, t) {
        return new SortedMap(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns a copy of the map, with the specified key removed.
    remove(e) {
        return new SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns the value of the node with the given key, or null.
    get(e) {
        let t = this.root;
        for (;!t.isEmpty(); ) {
            const n = this.comparator(e, t.key);
            if (0 === n) return t.value;
            n < 0 ? t = t.left : n > 0 && (t = t.right);
        }
        return null;
    }
    // Returns the index of the element in this sorted map, or -1 if it doesn't
    // exist.
    indexOf(e) {
        // Number of nodes that were pruned when descending right
        let t = 0, n = this.root;
        for (;!n.isEmpty(); ) {
            const r = this.comparator(e, n.key);
            if (0 === r) return t + n.left.size;
            r < 0 ? n = n.left : (
            // Count all nodes left of the node plus the node itself
            t += n.left.size + 1, n = n.right);
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
    inorderTraversal(e) {
        return this.root.inorderTraversal(e);
    }
    forEach(e) {
        this.inorderTraversal(((t, n) => (e(t, n), !1)));
    }
    toString() {
        const e = [];
        return this.inorderTraversal(((t, n) => (e.push(`${t}:${n}`), !1))), `{${e.join(", ")}}`;
    }
    // Traverses the map in reverse key order and calls the specified action
    // function for each key/value pair. If action returns true, traversal is
    // aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(e) {
        return this.root.reverseTraversal(e);
    }
    // Returns an iterator over the SortedMap.
    getIterator() {
        return new SortedMapIterator(this.root, null, this.comparator, !1);
    }
    getIteratorFrom(e) {
        return new SortedMapIterator(this.root, e, this.comparator, !1);
    }
    getReverseIterator() {
        return new SortedMapIterator(this.root, null, this.comparator, !0);
    }
    getReverseIteratorFrom(e) {
        return new SortedMapIterator(this.root, e, this.comparator, !0);
    }
}

 // end SortedMap
// An iterator over an LLRBNode.
class SortedMapIterator {
    constructor(e, t, n, r) {
        this.isReverse = r, this.nodeStack = [];
        let i = 1;
        for (;!e.isEmpty(); ) if (i = t ? n(e.key, t) : 1, 
        // flip the comparison if we're going in reverse
        t && r && (i *= -1), i < 0) 
        // This node is less than our start key. ignore it
        e = this.isReverse ? e.left : e.right; else {
            if (0 === i) {
                // This node is exactly equal to our start key. Push it on the stack,
                // but stop iterating;
                this.nodeStack.push(e);
                break;
            }
            // This node is greater than our start key, add it to the stack and move
            // to the next one
            this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
        }
    }
    getNext() {
        let e = this.nodeStack.pop();
        const t = {
            key: e.key,
            value: e.value
        };
        if (this.isReverse) for (e = e.left; !e.isEmpty(); ) this.nodeStack.push(e), e = e.right; else for (e = e.right; !e.isEmpty(); ) this.nodeStack.push(e), 
        e = e.left;
        return t;
    }
    hasNext() {
        return this.nodeStack.length > 0;
    }
    peek() {
        if (0 === this.nodeStack.length) return null;
        const e = this.nodeStack[this.nodeStack.length - 1];
        return {
            key: e.key,
            value: e.value
        };
    }
}

 // end SortedMapIterator
// Represents a node in a Left-leaning Red-Black tree.
class LLRBNode {
    constructor(e, t, n, r, i) {
        this.key = e, this.value = t, this.color = null != n ? n : LLRBNode.RED, this.left = null != r ? r : LLRBNode.EMPTY, 
        this.right = null != i ? i : LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
    }
    // Returns a copy of the current node, optionally replacing pieces of it.
    copy(e, t, n, r, i) {
        return new LLRBNode(null != e ? e : this.key, null != t ? t : this.value, null != n ? n : this.color, null != r ? r : this.left, null != i ? i : this.right);
    }
    isEmpty() {
        return !1;
    }
    // Traverses the tree in key order and calls the specified action function
    // for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(e) {
        return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
    }
    // Traverses the tree in reverse key order and calls the specified action
    // function for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(e) {
        return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
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
    insert(e, t, n) {
        let r = this;
        const i = n(e, r.key);
        return r = i < 0 ? r.copy(null, null, null, r.left.insert(e, t, n), null) : 0 === i ? r.copy(null, t, null, null, null) : r.copy(null, null, null, null, r.right.insert(e, t, n)), 
        r.fixUp();
    }
    removeMin() {
        if (this.left.isEmpty()) return LLRBNode.EMPTY;
        let e = this;
        return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), 
        e.fixUp();
    }
    // Returns new tree, with the specified item removed.
    remove(e, t) {
        let n, r = this;
        if (t(e, r.key) < 0) r.left.isEmpty() || r.left.isRed() || r.left.left.isRed() || (r = r.moveRedLeft()), 
        r = r.copy(null, null, null, r.left.remove(e, t), null); else {
            if (r.left.isRed() && (r = r.rotateRight()), r.right.isEmpty() || r.right.isRed() || r.right.left.isRed() || (r = r.moveRedRight()), 
            0 === t(e, r.key)) {
                if (r.right.isEmpty()) return LLRBNode.EMPTY;
                n = r.right.min(), r = r.copy(n.key, n.value, null, null, r.right.removeMin());
            }
            r = r.copy(null, null, null, null, r.right.remove(e, t));
        }
        return r.fixUp();
    }
    isRed() {
        return this.color;
    }
    // Returns new tree after performing any needed rotations.
    fixUp() {
        let e = this;
        return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), 
        e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
    }
    moveRedLeft() {
        let e = this.colorFlip();
        return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), 
        e = e.rotateLeft(), e = e.colorFlip()), e;
    }
    moveRedRight() {
        let e = this.colorFlip();
        return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
    }
    rotateLeft() {
        const e = this.copy(null, null, LLRBNode.RED, null, this.right.left);
        return this.right.copy(null, null, this.color, e, null);
    }
    rotateRight() {
        const e = this.copy(null, null, LLRBNode.RED, this.left.right, null);
        return this.left.copy(null, null, this.color, null, e);
    }
    colorFlip() {
        const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
        return this.copy(null, null, !this.color, e, t);
    }
    // For testing.
    checkMaxDepth() {
        const e = this.check();
        return Math.pow(2, e) <= this.size + 1;
    }
    // In a balanced RB tree, the black-depth (number of black nodes) from root to
    // leaves is equal on both sides.  This function verifies that or asserts.
    check() {
        if (this.isRed() && this.left.isRed()) throw fail();
        if (this.right.isRed()) throw fail();
        const e = this.left.check();
        if (e !== this.right.check()) throw fail();
        return e + (this.isRed() ? 0 : 1);
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
    copy(e, t, n, r, i) {
        return this;
    }
    // Returns a copy of the tree, with the specified key/value added.
    insert(e, t, n) {
        return new LLRBNode(e, t);
    }
    // Returns a copy of the tree, with the specified key removed.
    remove(e, t) {
        return this;
    }
    isEmpty() {
        return !0;
    }
    inorderTraversal(e) {
        return !1;
    }
    reverseTraversal(e) {
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
    constructor(e) {
        this.comparator = e, this.data = new SortedMap(this.comparator);
    }
    has(e) {
        return null !== this.data.get(e);
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
    indexOf(e) {
        return this.data.indexOf(e);
    }
    /** Iterates elements in order defined by "comparator" */    forEach(e) {
        this.data.inorderTraversal(((t, n) => (e(t), !1)));
    }
    /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */    forEachInRange(e, t) {
        const n = this.data.getIteratorFrom(e[0]);
        for (;n.hasNext(); ) {
            const r = n.getNext();
            if (this.comparator(r.key, e[1]) >= 0) return;
            t(r.key);
        }
    }
    /**
     * Iterates over `elem`s such that: start &lt;= elem until false is returned.
     */    forEachWhile(e, t) {
        let n;
        for (n = void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator(); n.hasNext(); ) {
            if (!e(n.getNext().key)) return;
        }
    }
    /** Finds the least element greater than or equal to `elem`. */    firstAfterOrEqual(e) {
        const t = this.data.getIteratorFrom(e);
        return t.hasNext() ? t.getNext().key : null;
    }
    getIterator() {
        return new SortedSetIterator(this.data.getIterator());
    }
    getIteratorFrom(e) {
        return new SortedSetIterator(this.data.getIteratorFrom(e));
    }
    /** Inserts or updates an element */    add(e) {
        return this.copy(this.data.remove(e).insert(e, !0));
    }
    /** Deletes an element */    delete(e) {
        return this.has(e) ? this.copy(this.data.remove(e)) : this;
    }
    isEmpty() {
        return this.data.isEmpty();
    }
    unionWith(e) {
        let t = this;
        // Make sure `result` always refers to the larger one of the two sets.
                return t.size < e.size && (t = e, e = this), e.forEach((e => {
            t = t.add(e);
        })), t;
    }
    isEqual(e) {
        if (!(e instanceof SortedSet)) return !1;
        if (this.size !== e.size) return !1;
        const t = this.data.getIterator(), n = e.data.getIterator();
        for (;t.hasNext(); ) {
            const e = t.getNext().key, r = n.getNext().key;
            if (0 !== this.comparator(e, r)) return !1;
        }
        return !0;
    }
    toArray() {
        const e = [];
        return this.forEach((t => {
            e.push(t);
        })), e;
    }
    toString() {
        const e = [];
        return this.forEach((t => e.push(t))), "SortedSet(" + e.toString() + ")";
    }
    copy(e) {
        const t = new SortedSet(this.comparator);
        return t.data = e, t;
    }
}

class SortedSetIterator {
    constructor(e) {
        this.iter = e;
    }
    getNext() {
        return this.iter.getNext().key;
    }
    hasNext() {
        return this.iter.hasNext();
    }
}

/**
 * Compares two sorted sets for equality using their natural ordering. The
 * method computes the intersection and invokes `onAdd` for every element that
 * is in `after` but not `before`. `onRemove` is invoked for every element in
 * `before` but missing from `after`.
 *
 * The method creates a copy of both `before` and `after` and runs in O(n log
 * n), where n is the size of the two lists.
 *
 * @param before - The elements that exist in the original set.
 * @param after - The elements to diff against the original set.
 * @param comparator - The comparator for the elements in before and after.
 * @param onAdd - A function to invoke for every element that is part of `
 * after` but not `before`.
 * @param onRemove - A function to invoke for every element that is part of
 * `before` but not `after`.
 */
/**
 * Returns the next element from the iterator or `undefined` if none available.
 */
function __PRIVATE_advanceIterator(e) {
    return e.hasNext() ? e.getNext() : void 0;
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
    constructor(e) {
        this.fields = e, 
        // TODO(dimond): validation of FieldMask
        // Sort the field mask to support `FieldMask.isEqual()` and assert below.
        e.sort(FieldPath$1.comparator);
    }
    static empty() {
        return new FieldMask([]);
    }
    /**
     * Returns a new FieldMask object that is the result of adding all the given
     * fields paths to this field mask.
     */    unionWith(e) {
        let t = new SortedSet(FieldPath$1.comparator);
        for (const e of this.fields) t = t.add(e);
        for (const n of e) t = t.add(n);
        return new FieldMask(t.toArray());
    }
    /**
     * Verifies that `fieldPath` is included by at least one field in this field
     * mask.
     *
     * This is an O(n) operation, where `n` is the size of the field mask.
     */    covers(e) {
        for (const t of this.fields) if (t.isPrefixOf(e)) return !0;
        return !1;
    }
    isEqual(e) {
        return __PRIVATE_arrayEquals(this.fields, e.fields, ((e, t) => e.isEqual(t)));
    }
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
 */ class __PRIVATE_Base64DecodeError extends Error {
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
function __PRIVATE_decodeBase64(e) {
    try {
        return String.fromCharCode.apply(null, 
        // We use `decodeStringToByteArray()` instead of `decodeString()` since
        // `decodeString()` returns Unicode strings, which doesn't match the values
        // returned by `atob()`'s Latin1 representation.
        l.decodeStringToByteArray(e, false));
    } catch (e) {
        throw e instanceof h ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e) : e;
    }
}

/** Converts a binary string to a Base64 encoded string. */
/** True if and only if the Base64 conversion functions are available. */
function __PRIVATE_isBase64Available() {
    return !0;
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
 * Immutable class that represents a "proto" byte string.
 *
 * Proto byte strings can either be Base64-encoded strings or Uint8Arrays when
 * sent on the wire. This class abstracts away this differentiation by holding
 * the proto byte string in a common class that must be converted into a string
 * before being sent as a proto.
 * @internal
 */ class ByteString {
    constructor(e) {
        this.binaryString = e;
    }
    static fromBase64String(e) {
        const t = __PRIVATE_decodeBase64(e);
        return new ByteString(t);
    }
    static fromUint8Array(e) {
        // TODO(indexing); Remove the copy of the byte string here as this method
        // is frequently called during indexing.
        const t = 
        /**
 * Helper function to convert an Uint8array to a binary string.
 */
        function __PRIVATE_binaryStringFromUint8Array(e) {
            let t = "";
            for (let n = 0; n < e.length; ++n) t += String.fromCharCode(e[n]);
            return t;
        }
        /**
 * Helper function to convert a binary string to an Uint8Array.
 */ (e);
        return new ByteString(t);
    }
    [Symbol.iterator]() {
        let e = 0;
        return {
            next: () => e < this.binaryString.length ? {
                value: this.binaryString.charCodeAt(e++),
                done: !1
            } : {
                value: void 0,
                done: !0
            }
        };
    }
    toBase64() {
        return function __PRIVATE_encodeBase64(e) {
            const t = [];
            for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
            return l.encodeByteArray(t, !1);
        }(this.binaryString);
    }
    toUint8Array() {
        return function __PRIVATE_uint8ArrayFromBinaryString(e) {
            const t = new Uint8Array(e.length);
            for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
            return t;
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
    compareTo(e) {
        return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
    }
    isEqual(e) {
        return this.binaryString === e.binaryString;
    }
}

ByteString.EMPTY_BYTE_STRING = new ByteString("");

const ne = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);

/**
 * Converts the possible Proto values for a timestamp value into a "seconds and
 * nanos" representation.
 */ function __PRIVATE_normalizeTimestamp(e) {
    // The json interface (for the browser) will return an iso timestamp string,
    // while the proto js library (for node) will return a
    // google.protobuf.Timestamp instance.
    if (__PRIVATE_hardAssert(!!e), "string" == typeof e) {
        // The date string can have higher precision (nanos) than the Date class
        // (millis), so we do some custom parsing here.
        // Parse the nanos right out of the string.
        let t = 0;
        const n = ne.exec(e);
        if (__PRIVATE_hardAssert(!!n), n[1]) {
            // Pad the fraction out to 9 digits (nanos).
            let e = n[1];
            e = (e + "000000000").substr(0, 9), t = Number(e);
        }
        // Parse the date to get the seconds.
                const r = new Date(e);
        return {
            seconds: Math.floor(r.getTime() / 1e3),
            nanos: t
        };
    }
    return {
        seconds: __PRIVATE_normalizeNumber(e.seconds),
        nanos: __PRIVATE_normalizeNumber(e.nanos)
    };
}

/**
 * Converts the possible Proto types for numbers into a JavaScript number.
 * Returns 0 if the value is not numeric.
 */ function __PRIVATE_normalizeNumber(e) {
    // TODO(bjornick): Handle int64 greater than 53 bits.
    return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
}

/** Converts the possible Proto types for Blobs into a ByteString. */ function __PRIVATE_normalizeByteString(e) {
    return "string" == typeof e ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
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
 */ function __PRIVATE_isServerTimestamp(e) {
    var t, n;
    return "server_timestamp" === (null === (n = ((null === (t = null == e ? void 0 : e.mapValue) || void 0 === t ? void 0 : t.fields) || {}).__type__) || void 0 === n ? void 0 : n.stringValue);
}

/**
 * Creates a new ServerTimestamp proto value (using the internal format).
 */
/**
 * Returns the value of the field before this ServerTimestamp was set.
 *
 * Preserving the previous values allows the user to display the last resoled
 * value until the backend responds with the timestamp.
 */
function __PRIVATE_getPreviousValue(e) {
    const t = e.mapValue.fields.__previous_value__;
    return __PRIVATE_isServerTimestamp(t) ? __PRIVATE_getPreviousValue(t) : t;
}

/**
 * Returns the local time at which this timestamp was first set.
 */ function __PRIVATE_getLocalWriteTime(e) {
    const t = __PRIVATE_normalizeTimestamp(e.mapValue.fields.__local_write_time__.timestampValue);
    return new Timestamp(t.seconds, t.nanos);
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
 */ class DatabaseInfo {
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
    constructor(e, t, n, r, i, s, o, _, a) {
        this.databaseId = e, this.appId = t, this.persistenceKey = n, this.host = r, this.ssl = i, 
        this.forceLongPolling = s, this.autoDetectLongPolling = o, this.longPollingOptions = _, 
        this.useFetchStreams = a;
    }
}

/** The default database name for a project. */
/**
 * Represents the database ID a Firestore client is associated with.
 * @internal
 */
class DatabaseId {
    constructor(e, t) {
        this.projectId = e, this.database = t || "(default)";
    }
    static empty() {
        return new DatabaseId("", "");
    }
    get isDefaultDatabase() {
        return "(default)" === this.database;
    }
    isEqual(e) {
        return e instanceof DatabaseId && e.projectId === this.projectId && e.database === this.database;
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
const re = {
    mapValue: {
        fields: {
            __type__: {
                stringValue: "__max__"
            }
        }
    }
}, ie = {
    nullValue: "NULL_VALUE"
};

/** Extracts the backend's type order for the provided value. */
function __PRIVATE_typeOrder(e) {
    return "nullValue" in e ? 0 /* TypeOrder.NullValue */ : "booleanValue" in e ? 1 /* TypeOrder.BooleanValue */ : "integerValue" in e || "doubleValue" in e ? 2 /* TypeOrder.NumberValue */ : "timestampValue" in e ? 3 /* TypeOrder.TimestampValue */ : "stringValue" in e ? 5 /* TypeOrder.StringValue */ : "bytesValue" in e ? 6 /* TypeOrder.BlobValue */ : "referenceValue" in e ? 7 /* TypeOrder.RefValue */ : "geoPointValue" in e ? 8 /* TypeOrder.GeoPointValue */ : "arrayValue" in e ? 9 /* TypeOrder.ArrayValue */ : "mapValue" in e ? __PRIVATE_isServerTimestamp(e) ? 4 /* TypeOrder.ServerTimestampValue */ : __PRIVATE_isMaxValue(e) ? 9007199254740991 /* TypeOrder.MaxValue */ : 10 /* TypeOrder.ObjectValue */ : fail();
}

/** Tests `left` and `right` for equality based on the backend semantics. */ function __PRIVATE_valueEquals(e, t) {
    if (e === t) return !0;
    const n = __PRIVATE_typeOrder(e);
    if (n !== __PRIVATE_typeOrder(t)) return !1;
    switch (n) {
      case 0 /* TypeOrder.NullValue */ :
      case 9007199254740991 /* TypeOrder.MaxValue */ :
        return !0;

      case 1 /* TypeOrder.BooleanValue */ :
        return e.booleanValue === t.booleanValue;

      case 4 /* TypeOrder.ServerTimestampValue */ :
        return __PRIVATE_getLocalWriteTime(e).isEqual(__PRIVATE_getLocalWriteTime(t));

      case 3 /* TypeOrder.TimestampValue */ :
        return function __PRIVATE_timestampEquals(e, t) {
            if ("string" == typeof e.timestampValue && "string" == typeof t.timestampValue && e.timestampValue.length === t.timestampValue.length) 
            // Use string equality for ISO 8601 timestamps
            return e.timestampValue === t.timestampValue;
            const n = __PRIVATE_normalizeTimestamp(e.timestampValue), r = __PRIVATE_normalizeTimestamp(t.timestampValue);
            return n.seconds === r.seconds && n.nanos === r.nanos;
        }(e, t);

      case 5 /* TypeOrder.StringValue */ :
        return e.stringValue === t.stringValue;

      case 6 /* TypeOrder.BlobValue */ :
        return function __PRIVATE_blobEquals(e, t) {
            return __PRIVATE_normalizeByteString(e.bytesValue).isEqual(__PRIVATE_normalizeByteString(t.bytesValue));
        }(e, t);

      case 7 /* TypeOrder.RefValue */ :
        return e.referenceValue === t.referenceValue;

      case 8 /* TypeOrder.GeoPointValue */ :
        return function __PRIVATE_geoPointEquals(e, t) {
            return __PRIVATE_normalizeNumber(e.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t.geoPointValue.longitude);
        }(e, t);

      case 2 /* TypeOrder.NumberValue */ :
        return function __PRIVATE_numberEquals(e, t) {
            if ("integerValue" in e && "integerValue" in t) return __PRIVATE_normalizeNumber(e.integerValue) === __PRIVATE_normalizeNumber(t.integerValue);
            if ("doubleValue" in e && "doubleValue" in t) {
                const n = __PRIVATE_normalizeNumber(e.doubleValue), r = __PRIVATE_normalizeNumber(t.doubleValue);
                return n === r ? __PRIVATE_isNegativeZero(n) === __PRIVATE_isNegativeZero(r) : isNaN(n) && isNaN(r);
            }
            return !1;
        }(e, t);

      case 9 /* TypeOrder.ArrayValue */ :
        return __PRIVATE_arrayEquals(e.arrayValue.values || [], t.arrayValue.values || [], __PRIVATE_valueEquals);

      case 10 /* TypeOrder.ObjectValue */ :
        return function __PRIVATE_objectEquals(e, t) {
            const n = e.mapValue.fields || {}, r = t.mapValue.fields || {};
            if (__PRIVATE_objectSize(n) !== __PRIVATE_objectSize(r)) return !1;
            for (const e in n) if (n.hasOwnProperty(e) && (void 0 === r[e] || !__PRIVATE_valueEquals(n[e], r[e]))) return !1;
            return !0;
        }
        /** Returns true if the ArrayValue contains the specified element. */ (e, t);

      default:
        return fail();
    }
}

function __PRIVATE_arrayValueContains(e, t) {
    return void 0 !== (e.values || []).find((e => __PRIVATE_valueEquals(e, t)));
}

function __PRIVATE_valueCompare(e, t) {
    if (e === t) return 0;
    const n = __PRIVATE_typeOrder(e), r = __PRIVATE_typeOrder(t);
    if (n !== r) return __PRIVATE_primitiveComparator(n, r);
    switch (n) {
      case 0 /* TypeOrder.NullValue */ :
      case 9007199254740991 /* TypeOrder.MaxValue */ :
        return 0;

      case 1 /* TypeOrder.BooleanValue */ :
        return __PRIVATE_primitiveComparator(e.booleanValue, t.booleanValue);

      case 2 /* TypeOrder.NumberValue */ :
        return function __PRIVATE_compareNumbers(e, t) {
            const n = __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue), r = __PRIVATE_normalizeNumber(t.integerValue || t.doubleValue);
            return n < r ? -1 : n > r ? 1 : n === r ? 0 : 
            // one or both are NaN.
            isNaN(n) ? isNaN(r) ? 0 : -1 : 1;
        }(e, t);

      case 3 /* TypeOrder.TimestampValue */ :
        return __PRIVATE_compareTimestamps(e.timestampValue, t.timestampValue);

      case 4 /* TypeOrder.ServerTimestampValue */ :
        return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e), __PRIVATE_getLocalWriteTime(t));

      case 5 /* TypeOrder.StringValue */ :
        return __PRIVATE_primitiveComparator(e.stringValue, t.stringValue);

      case 6 /* TypeOrder.BlobValue */ :
        return function __PRIVATE_compareBlobs(e, t) {
            const n = __PRIVATE_normalizeByteString(e), r = __PRIVATE_normalizeByteString(t);
            return n.compareTo(r);
        }(e.bytesValue, t.bytesValue);

      case 7 /* TypeOrder.RefValue */ :
        return function __PRIVATE_compareReferences(e, t) {
            const n = e.split("/"), r = t.split("/");
            for (let e = 0; e < n.length && e < r.length; e++) {
                const t = __PRIVATE_primitiveComparator(n[e], r[e]);
                if (0 !== t) return t;
            }
            return __PRIVATE_primitiveComparator(n.length, r.length);
        }(e.referenceValue, t.referenceValue);

      case 8 /* TypeOrder.GeoPointValue */ :
        return function __PRIVATE_compareGeoPoints(e, t) {
            const n = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(t.latitude));
            if (0 !== n) return n;
            return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e.longitude), __PRIVATE_normalizeNumber(t.longitude));
        }(e.geoPointValue, t.geoPointValue);

      case 9 /* TypeOrder.ArrayValue */ :
        return function __PRIVATE_compareArrays(e, t) {
            const n = e.values || [], r = t.values || [];
            for (let e = 0; e < n.length && e < r.length; ++e) {
                const t = __PRIVATE_valueCompare(n[e], r[e]);
                if (t) return t;
            }
            return __PRIVATE_primitiveComparator(n.length, r.length);
        }(e.arrayValue, t.arrayValue);

      case 10 /* TypeOrder.ObjectValue */ :
        return function __PRIVATE_compareMaps(e, t) {
            if (e === re.mapValue && t === re.mapValue) return 0;
            if (e === re.mapValue) return 1;
            if (t === re.mapValue) return -1;
            const n = e.fields || {}, r = Object.keys(n), i = t.fields || {}, s = Object.keys(i);
            // Even though MapValues are likely sorted correctly based on their insertion
            // order (e.g. when received from the backend), local modifications can bring
            // elements out of order. We need to re-sort the elements to ensure that
            // canonical IDs are independent of insertion order.
            r.sort(), s.sort();
            for (let e = 0; e < r.length && e < s.length; ++e) {
                const t = __PRIVATE_primitiveComparator(r[e], s[e]);
                if (0 !== t) return t;
                const o = __PRIVATE_valueCompare(n[r[e]], i[s[e]]);
                if (0 !== o) return o;
            }
            return __PRIVATE_primitiveComparator(r.length, s.length);
        }
        /**
 * Generates the canonical ID for the provided field value (as used in Target
 * serialization).
 */ (e.mapValue, t.mapValue);

      default:
        throw fail();
    }
}

function __PRIVATE_compareTimestamps(e, t) {
    if ("string" == typeof e && "string" == typeof t && e.length === t.length) return __PRIVATE_primitiveComparator(e, t);
    const n = __PRIVATE_normalizeTimestamp(e), r = __PRIVATE_normalizeTimestamp(t), i = __PRIVATE_primitiveComparator(n.seconds, r.seconds);
    return 0 !== i ? i : __PRIVATE_primitiveComparator(n.nanos, r.nanos);
}

function canonicalId(e) {
    return __PRIVATE_canonifyValue(e);
}

function __PRIVATE_canonifyValue(e) {
    return "nullValue" in e ? "null" : "booleanValue" in e ? "" + e.booleanValue : "integerValue" in e ? "" + e.integerValue : "doubleValue" in e ? "" + e.doubleValue : "timestampValue" in e ? function __PRIVATE_canonifyTimestamp(e) {
        const t = __PRIVATE_normalizeTimestamp(e);
        return `time(${t.seconds},${t.nanos})`;
    }(e.timestampValue) : "stringValue" in e ? e.stringValue : "bytesValue" in e ? function __PRIVATE_canonifyByteString(e) {
        return __PRIVATE_normalizeByteString(e).toBase64();
    }(e.bytesValue) : "referenceValue" in e ? function __PRIVATE_canonifyReference(e) {
        return DocumentKey.fromName(e).toString();
    }(e.referenceValue) : "geoPointValue" in e ? function __PRIVATE_canonifyGeoPoint(e) {
        return `geo(${e.latitude},${e.longitude})`;
    }(e.geoPointValue) : "arrayValue" in e ? function __PRIVATE_canonifyArray(e) {
        let t = "[", n = !0;
        for (const r of e.values || []) n ? n = !1 : t += ",", t += __PRIVATE_canonifyValue(r);
        return t + "]";
    }
    /**
 * Returns an approximate (and wildly inaccurate) in-memory size for the field
 * value.
 *
 * The memory size takes into account only the actual user data as it resides
 * in memory and ignores object overhead.
 */ (e.arrayValue) : "mapValue" in e ? function __PRIVATE_canonifyMap(e) {
        // Iteration order in JavaScript is not guaranteed. To ensure that we generate
        // matching canonical IDs for identical maps, we need to sort the keys.
        const t = Object.keys(e.fields || {}).sort();
        let n = "{", r = !0;
        for (const i of t) r ? r = !1 : n += ",", n += `${i}:${__PRIVATE_canonifyValue(e.fields[i])}`;
        return n + "}";
    }(e.mapValue) : fail();
}

function __PRIVATE_estimateByteSize(e) {
    switch (__PRIVATE_typeOrder(e)) {
      case 0 /* TypeOrder.NullValue */ :
      case 1 /* TypeOrder.BooleanValue */ :
        return 4;

      case 2 /* TypeOrder.NumberValue */ :
        return 8;

      case 3 /* TypeOrder.TimestampValue */ :
      case 8 /* TypeOrder.GeoPointValue */ :
        // GeoPoints are made up of two distinct numbers (latitude + longitude)
        return 16;

      case 4 /* TypeOrder.ServerTimestampValue */ :
        const t = __PRIVATE_getPreviousValue(e);
        return t ? 16 + __PRIVATE_estimateByteSize(t) : 16;

      case 5 /* TypeOrder.StringValue */ :
        // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures:
        // "JavaScript's String type is [...] a set of elements of 16-bit unsigned
        // integer values"
        return 2 * e.stringValue.length;

      case 6 /* TypeOrder.BlobValue */ :
        return __PRIVATE_normalizeByteString(e.bytesValue).approximateByteSize();

      case 7 /* TypeOrder.RefValue */ :
        return e.referenceValue.length;

      case 9 /* TypeOrder.ArrayValue */ :
        return function __PRIVATE_estimateArrayByteSize(e) {
            return (e.values || []).reduce(((e, t) => e + __PRIVATE_estimateByteSize(t)), 0);
        }
        /** Returns a reference value for the provided database and key. */ (e.arrayValue);

      case 10 /* TypeOrder.ObjectValue */ :
        return function __PRIVATE_estimateMapByteSize(e) {
            let t = 0;
            return forEach(e.fields, ((e, n) => {
                t += e.length + __PRIVATE_estimateByteSize(n);
            })), t;
        }(e.mapValue);

      default:
        throw fail();
    }
}

function __PRIVATE_refValue(e, t) {
    return {
        referenceValue: `projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`
    };
}

/** Returns true if `value` is an IntegerValue . */ function isInteger(e) {
    return !!e && "integerValue" in e;
}

/** Returns true if `value` is a DoubleValue. */
/** Returns true if `value` is an ArrayValue. */
function isArray(e) {
    return !!e && "arrayValue" in e;
}

/** Returns true if `value` is a NullValue. */ function __PRIVATE_isNullValue(e) {
    return !!e && "nullValue" in e;
}

/** Returns true if `value` is NaN. */ function __PRIVATE_isNanValue(e) {
    return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
}

/** Returns true if `value` is a MapValue. */ function __PRIVATE_isMapValue(e) {
    return !!e && "mapValue" in e;
}

/** Creates a deep copy of `source`. */ function __PRIVATE_deepClone(e) {
    if (e.geoPointValue) return {
        geoPointValue: Object.assign({}, e.geoPointValue)
    };
    if (e.timestampValue && "object" == typeof e.timestampValue) return {
        timestampValue: Object.assign({}, e.timestampValue)
    };
    if (e.mapValue) {
        const t = {
            mapValue: {
                fields: {}
            }
        };
        return forEach(e.mapValue.fields, ((e, n) => t.mapValue.fields[e] = __PRIVATE_deepClone(n))), 
        t;
    }
    if (e.arrayValue) {
        const t = {
            arrayValue: {
                values: []
            }
        };
        for (let n = 0; n < (e.arrayValue.values || []).length; ++n) t.arrayValue.values[n] = __PRIVATE_deepClone(e.arrayValue.values[n]);
        return t;
    }
    return Object.assign({}, e);
}

/** Returns true if the Value represents the canonical {@link #MAX_VALUE} . */ function __PRIVATE_isMaxValue(e) {
    return "__max__" === (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue;
}

/** Returns the lowest value for the given value type (inclusive). */ function __PRIVATE_valuesGetLowerBound(e) {
    return "nullValue" in e ? ie : "booleanValue" in e ? {
        booleanValue: !1
    } : "integerValue" in e || "doubleValue" in e ? {
        doubleValue: NaN
    } : "timestampValue" in e ? {
        timestampValue: {
            seconds: Number.MIN_SAFE_INTEGER
        }
    } : "stringValue" in e ? {
        stringValue: ""
    } : "bytesValue" in e ? {
        bytesValue: ""
    } : "referenceValue" in e ? __PRIVATE_refValue(DatabaseId.empty(), DocumentKey.empty()) : "geoPointValue" in e ? {
        geoPointValue: {
            latitude: -90,
            longitude: -180
        }
    } : "arrayValue" in e ? {
        arrayValue: {}
    } : "mapValue" in e ? {
        mapValue: {}
    } : fail();
}

/** Returns the largest value for the given value type (exclusive). */ function __PRIVATE_valuesGetUpperBound(e) {
    return "nullValue" in e ? {
        booleanValue: !1
    } : "booleanValue" in e ? {
        doubleValue: NaN
    } : "integerValue" in e || "doubleValue" in e ? {
        timestampValue: {
            seconds: Number.MIN_SAFE_INTEGER
        }
    } : "timestampValue" in e ? {
        stringValue: ""
    } : "stringValue" in e ? {
        bytesValue: ""
    } : "bytesValue" in e ? __PRIVATE_refValue(DatabaseId.empty(), DocumentKey.empty()) : "referenceValue" in e ? {
        geoPointValue: {
            latitude: -90,
            longitude: -180
        }
    } : "geoPointValue" in e ? {
        arrayValue: {}
    } : "arrayValue" in e ? {
        mapValue: {}
    } : "mapValue" in e ? re : fail();
}

function __PRIVATE_lowerBoundCompare(e, t) {
    const n = __PRIVATE_valueCompare(e.value, t.value);
    return 0 !== n ? n : e.inclusive && !t.inclusive ? -1 : !e.inclusive && t.inclusive ? 1 : 0;
}

function __PRIVATE_upperBoundCompare(e, t) {
    const n = __PRIVATE_valueCompare(e.value, t.value);
    return 0 !== n ? n : e.inclusive && !t.inclusive ? 1 : !e.inclusive && t.inclusive ? -1 : 0;
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
    constructor(e) {
        this.value = e;
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
     */    field(e) {
        if (e.isEmpty()) return this.value;
        {
            let t = this.value;
            for (let n = 0; n < e.length - 1; ++n) if (t = (t.mapValue.fields || {})[e.get(n)], 
            !__PRIVATE_isMapValue(t)) return null;
            return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
        }
    }
    /**
     * Sets the field to the provided value.
     *
     * @param path - The field path to set.
     * @param value - The value to set.
     */    set(e, t) {
        this.getFieldsMap(e.popLast())[e.lastSegment()] = __PRIVATE_deepClone(t);
    }
    /**
     * Sets the provided fields to the provided values.
     *
     * @param data - A map of fields to values (or null for deletes).
     */    setAll(e) {
        let t = FieldPath$1.emptyPath(), n = {}, r = [];
        e.forEach(((e, i) => {
            if (!t.isImmediateParentOf(i)) {
                // Insert the accumulated changes at this parent location
                const e = this.getFieldsMap(t);
                this.applyChanges(e, n, r), n = {}, r = [], t = i.popLast();
            }
            e ? n[i.lastSegment()] = __PRIVATE_deepClone(e) : r.push(i.lastSegment());
        }));
        const i = this.getFieldsMap(t);
        this.applyChanges(i, n, r);
    }
    /**
     * Removes the field at the specified path. If there is no field at the
     * specified path, nothing is changed.
     *
     * @param path - The field path to remove.
     */    delete(e) {
        const t = this.field(e.popLast());
        __PRIVATE_isMapValue(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
    }
    isEqual(e) {
        return __PRIVATE_valueEquals(this.value, e.value);
    }
    /**
     * Returns the map that contains the leaf element of `path`. If the parent
     * entry does not yet exist, or if it is not a map, a new map will be created.
     */    getFieldsMap(e) {
        let t = this.value;
        t.mapValue.fields || (t.mapValue = {
            fields: {}
        });
        for (let n = 0; n < e.length; ++n) {
            let r = t.mapValue.fields[e.get(n)];
            __PRIVATE_isMapValue(r) && r.mapValue.fields || (r = {
                mapValue: {
                    fields: {}
                }
            }, t.mapValue.fields[e.get(n)] = r), t = r;
        }
        return t.mapValue.fields;
    }
    /**
     * Modifies `fieldsMap` by adding, replacing or deleting the specified
     * entries.
     */    applyChanges(e, t, n) {
        forEach(t, ((t, n) => e[t] = n));
        for (const t of n) delete e[t];
    }
    clone() {
        return new ObjectValue(__PRIVATE_deepClone(this.value));
    }
}

/**
 * Returns a FieldMask built from all fields in a MapValue.
 */ function __PRIVATE_extractFieldMask(e) {
    const t = [];
    return forEach(e.fields, ((e, n) => {
        const r = new FieldPath$1([ e ]);
        if (__PRIVATE_isMapValue(n)) {
            const e = __PRIVATE_extractFieldMask(n.mapValue).fields;
            if (0 === e.length) 
            // Preserve the empty map by adding it to the FieldMask.
            t.push(r); else 
            // For nested and non-empty ObjectValues, add the FieldPath of the
            // leaf nodes.
            for (const n of e) t.push(r.child(n));
        } else 
        // For nested and non-empty ObjectValues, add the FieldPath of the leaf
        // nodes.
        t.push(r);
    })), new FieldMask(t);
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
    constructor(e, t, n, r, i, s, o) {
        this.key = e, this.documentType = t, this.version = n, this.readTime = r, this.createTime = i, 
        this.data = s, this.documentState = o;
    }
    /**
     * Creates a document with no known version or data, but which can serve as
     * base document for mutations.
     */    static newInvalidDocument(e) {
        return new MutableDocument(e, 0 /* DocumentType.INVALID */ , 
        /* version */ SnapshotVersion.min(), 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 0 /* DocumentState.SYNCED */);
    }
    /**
     * Creates a new document that is known to exist with the given data at the
     * given version.
     */    static newFoundDocument(e, t, n, r) {
        return new MutableDocument(e, 1 /* DocumentType.FOUND_DOCUMENT */ , 
        /* version */ t, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ n, r, 0 /* DocumentState.SYNCED */);
    }
    /** Creates a new document that is known to not exist at the given version. */    static newNoDocument(e, t) {
        return new MutableDocument(e, 2 /* DocumentType.NO_DOCUMENT */ , 
        /* version */ t, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 0 /* DocumentState.SYNCED */);
    }
    /**
     * Creates a new document that is known to exist at the given version but
     * whose data is not known (e.g. a document that was updated without a known
     * base document).
     */    static newUnknownDocument(e, t) {
        return new MutableDocument(e, 3 /* DocumentType.UNKNOWN_DOCUMENT */ , 
        /* version */ t, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */);
    }
    /**
     * Changes the document type to indicate that it exists and that its version
     * and data are known.
     */    convertToFoundDocument(e, t) {
        // If a document is switching state from being an invalid or deleted
        // document to a valid (FOUND_DOCUMENT) document, either due to receiving an
        // update from Watch or due to applying a local set mutation on top
        // of a deleted document, our best guess about its createTime would be the
        // version at which the document transitioned to a FOUND_DOCUMENT.
        return !this.createTime.isEqual(SnapshotVersion.min()) || 2 /* DocumentType.NO_DOCUMENT */ !== this.documentType && 0 /* DocumentType.INVALID */ !== this.documentType || (this.createTime = e), 
        this.version = e, this.documentType = 1 /* DocumentType.FOUND_DOCUMENT */ , this.data = t, 
        this.documentState = 0 /* DocumentState.SYNCED */ , this;
    }
    /**
     * Changes the document type to indicate that it doesn't exist at the given
     * version.
     */    convertToNoDocument(e) {
        return this.version = e, this.documentType = 2 /* DocumentType.NO_DOCUMENT */ , 
        this.data = ObjectValue.empty(), this.documentState = 0 /* DocumentState.SYNCED */ , 
        this;
    }
    /**
     * Changes the document type to indicate that it exists at a given version but
     * that its data is not known (e.g. a document that was updated without a known
     * base document).
     */    convertToUnknownDocument(e) {
        return this.version = e, this.documentType = 3 /* DocumentType.UNKNOWN_DOCUMENT */ , 
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
    setReadTime(e) {
        return this.readTime = e, this;
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
    isEqual(e) {
        return e instanceof MutableDocument && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
    }
    mutableCopy() {
        return new MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
    }
    toString() {
        return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
    }
}

/**
 * Compares the value for field `field` in the provided documents. Throws if
 * the field does not exist in both documents.
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
 */
class Bound {
    constructor(e, t) {
        this.position = e, this.inclusive = t;
    }
}

function __PRIVATE_boundCompareToDocument(e, t, n) {
    let r = 0;
    for (let i = 0; i < e.position.length; i++) {
        const s = t[i], o = e.position[i];
        if (s.field.isKeyField()) r = DocumentKey.comparator(DocumentKey.fromName(o.referenceValue), n.key); else {
            r = __PRIVATE_valueCompare(o, n.data.field(s.field));
        }
        if ("desc" /* Direction.DESCENDING */ === s.dir && (r *= -1), 0 !== r) break;
    }
    return r;
}

/**
 * Returns true if a document sorts after a bound using the provided sort
 * order.
 */ function __PRIVATE_boundEquals(e, t) {
    if (null === e) return null === t;
    if (null === t) return !1;
    if (e.inclusive !== t.inclusive || e.position.length !== t.position.length) return !1;
    for (let n = 0; n < e.position.length; n++) {
        if (!__PRIVATE_valueEquals(e.position[n], t.position[n])) return !1;
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
 */
/**
 * An ordering on a field, in some Direction. Direction defaults to ASCENDING.
 */ class OrderBy {
    constructor(e, t = "asc" /* Direction.ASCENDING */) {
        this.field = e, this.dir = t;
    }
}

function __PRIVATE_orderByEquals(e, t) {
    return e.dir === t.dir && e.field.isEqual(t.field);
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
    constructor(e, t, n) {
        super(), this.field = e, this.op = t, this.value = n;
    }
    /**
     * Creates a filter based on the provided arguments.
     */    static create(e, t, n) {
        return e.isKeyField() ? "in" /* Operator.IN */ === t || "not-in" /* Operator.NOT_IN */ === t ? this.createKeyFieldInFilter(e, t, n) : new __PRIVATE_KeyFieldFilter(e, t, n) : "array-contains" /* Operator.ARRAY_CONTAINS */ === t ? new __PRIVATE_ArrayContainsFilter(e, n) : "in" /* Operator.IN */ === t ? new __PRIVATE_InFilter(e, n) : "not-in" /* Operator.NOT_IN */ === t ? new __PRIVATE_NotInFilter(e, n) : "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === t ? new __PRIVATE_ArrayContainsAnyFilter(e, n) : new FieldFilter(e, t, n);
    }
    static createKeyFieldInFilter(e, t, n) {
        return "in" /* Operator.IN */ === t ? new __PRIVATE_KeyFieldInFilter(e, n) : new __PRIVATE_KeyFieldNotInFilter(e, n);
    }
    matches(e) {
        const t = e.data.field(this.field);
        // Types do not have to match in NOT_EQUAL filters.
                return "!=" /* Operator.NOT_EQUAL */ === this.op ? null !== t && this.matchesComparison(__PRIVATE_valueCompare(t, this.value)) : null !== t && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t) && this.matchesComparison(__PRIVATE_valueCompare(t, this.value));
        // Only compare types with matching backend order (such as double and int).
        }
    matchesComparison(e) {
        switch (this.op) {
          case "<" /* Operator.LESS_THAN */ :
            return e < 0;

          case "<=" /* Operator.LESS_THAN_OR_EQUAL */ :
            return e <= 0;

          case "==" /* Operator.EQUAL */ :
            return 0 === e;

          case "!=" /* Operator.NOT_EQUAL */ :
            return 0 !== e;

          case ">" /* Operator.GREATER_THAN */ :
            return e > 0;

          case ">=" /* Operator.GREATER_THAN_OR_EQUAL */ :
            return e >= 0;

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
    constructor(e, t) {
        super(), this.filters = e, this.op = t, this.ue = null;
    }
    /**
     * Creates a filter based on the provided arguments.
     */    static create(e, t) {
        return new CompositeFilter(e, t);
    }
    matches(e) {
        return __PRIVATE_compositeFilterIsConjunction(this) ? void 0 === this.filters.find((t => !t.matches(e))) : void 0 !== this.filters.find((t => t.matches(e)));
    }
    getFlattenedFilters() {
        return null !== this.ue || (this.ue = this.filters.reduce(((e, t) => e.concat(t.getFlattenedFilters())), [])), 
        this.ue;
    }
    // Returns a mutable copy of `this.filters`
    getFilters() {
        return Object.assign([], this.filters);
    }
}

function __PRIVATE_compositeFilterIsConjunction(e) {
    return "and" /* CompositeOperator.AND */ === e.op;
}

function __PRIVATE_compositeFilterIsDisjunction(e) {
    return "or" /* CompositeOperator.OR */ === e.op;
}

/**
 * Returns true if this filter is a conjunction of field filters only. Returns false otherwise.
 */ function __PRIVATE_compositeFilterIsFlatConjunction(e) {
    return __PRIVATE_compositeFilterIsFlat(e) && __PRIVATE_compositeFilterIsConjunction(e);
}

/**
 * Returns true if this filter does not contain any composite filters. Returns false otherwise.
 */ function __PRIVATE_compositeFilterIsFlat(e) {
    for (const t of e.filters) if (t instanceof CompositeFilter) return !1;
    return !0;
}

function __PRIVATE_canonifyFilter(e) {
    if (e instanceof FieldFilter) 
    // TODO(b/29183165): Technically, this won't be unique if two values have
    // the same description, such as the int 3 and the string "3". So we should
    // add the types in here somehow, too.
    return e.field.canonicalString() + e.op.toString() + canonicalId(e.value);
    if (__PRIVATE_compositeFilterIsFlatConjunction(e)) 
    // Older SDK versions use an implicit AND operation between their filters.
    // In the new SDK versions, the developer may use an explicit AND filter.
    // To stay consistent with the old usages, we add a special case to ensure
    // the canonical ID for these two are the same. For example:
    // `col.whereEquals("a", 1).whereEquals("b", 2)` should have the same
    // canonical ID as `col.where(and(equals("a",1), equals("b",2)))`.
    return e.filters.map((e => __PRIVATE_canonifyFilter(e))).join(",");
    {
        // filter instanceof CompositeFilter
        const t = e.filters.map((e => __PRIVATE_canonifyFilter(e))).join(",");
        return `${e.op}(${t})`;
    }
}

function __PRIVATE_filterEquals(e, t) {
    return e instanceof FieldFilter ? function __PRIVATE_fieldFilterEquals(e, t) {
        return t instanceof FieldFilter && e.op === t.op && e.field.isEqual(t.field) && __PRIVATE_valueEquals(e.value, t.value);
    }(e, t) : e instanceof CompositeFilter ? function __PRIVATE_compositeFilterEquals(e, t) {
        if (t instanceof CompositeFilter && e.op === t.op && e.filters.length === t.filters.length) {
            return e.filters.reduce(((e, n, r) => e && __PRIVATE_filterEquals(n, t.filters[r])), !0);
        }
        return !1;
    }
    /**
 * Returns a new composite filter that contains all filter from
 * `compositeFilter` plus all the given filters in `otherFilters`.
 */ (e, t) : void fail();
}

function __PRIVATE_compositeFilterWithAddedFilters(e, t) {
    const n = e.filters.concat(t);
    return CompositeFilter.create(n, e.op);
}

/** Returns a debug description for `filter`. */ function __PRIVATE_stringifyFilter(e) {
    return e instanceof FieldFilter ? function __PRIVATE_stringifyFieldFilter(e) {
        return `${e.field.canonicalString()} ${e.op} ${canonicalId(e.value)}`;
    }
    /** Filter that matches on key fields (i.e. '__name__'). */ (e) : e instanceof CompositeFilter ? function __PRIVATE_stringifyCompositeFilter(e) {
        return e.op.toString() + " {" + e.getFilters().map(__PRIVATE_stringifyFilter).join(" ,") + "}";
    }(e) : "Filter";
}

class __PRIVATE_KeyFieldFilter extends FieldFilter {
    constructor(e, t, n) {
        super(e, t, n), this.key = DocumentKey.fromName(n.referenceValue);
    }
    matches(e) {
        const t = DocumentKey.comparator(e.key, this.key);
        return this.matchesComparison(t);
    }
}

/** Filter that matches on key fields within an array. */ class __PRIVATE_KeyFieldInFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "in" /* Operator.IN */ , t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in" /* Operator.IN */ , t);
    }
    matches(e) {
        return this.keys.some((t => t.isEqual(e.key)));
    }
}

/** Filter that matches on key fields not present within an array. */ class __PRIVATE_KeyFieldNotInFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "not-in" /* Operator.NOT_IN */ , t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in" /* Operator.NOT_IN */ , t);
    }
    matches(e) {
        return !this.keys.some((t => t.isEqual(e.key)));
    }
}

function __PRIVATE_extractDocumentKeysFromArrayValue(e, t) {
    var n;
    return ((null === (n = t.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((e => DocumentKey.fromName(e.referenceValue)));
}

/** A Filter that implements the array-contains operator. */ class __PRIVATE_ArrayContainsFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "array-contains" /* Operator.ARRAY_CONTAINS */ , t);
    }
    matches(e) {
        const t = e.data.field(this.field);
        return isArray(t) && __PRIVATE_arrayValueContains(t.arrayValue, this.value);
    }
}

/** A Filter that implements the IN operator. */ class __PRIVATE_InFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "in" /* Operator.IN */ , t);
    }
    matches(e) {
        const t = e.data.field(this.field);
        return null !== t && __PRIVATE_arrayValueContains(this.value.arrayValue, t);
    }
}

/** A Filter that implements the not-in operator. */ class __PRIVATE_NotInFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "not-in" /* Operator.NOT_IN */ , t);
    }
    matches(e) {
        if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
            nullValue: "NULL_VALUE"
        })) return !1;
        const t = e.data.field(this.field);
        return null !== t && !__PRIVATE_arrayValueContains(this.value.arrayValue, t);
    }
}

/** A Filter that implements the array-contains-any operator. */ class __PRIVATE_ArrayContainsAnyFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ , t);
    }
    matches(e) {
        const t = e.data.field(this.field);
        return !(!isArray(t) || !t.arrayValue.values) && t.arrayValue.values.some((e => __PRIVATE_arrayValueContains(this.value.arrayValue, e)));
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
    constructor(e, t = null, n = [], r = [], i = null, s = null, o = null) {
        this.path = e, this.collectionGroup = t, this.orderBy = n, this.filters = r, this.limit = i, 
        this.startAt = s, this.endAt = o, this.ce = null;
    }
}

/**
 * Initializes a Target with a path and optional additional query constraints.
 * Path must currently be empty if this is a collection group query.
 *
 * NOTE: you should always construct `Target` from `Query.toTarget` instead of
 * using this factory method, because `Query` provides an implicit `orderBy`
 * property.
 */ function __PRIVATE_newTarget(e, t = null, n = [], r = [], i = null, s = null, o = null) {
    return new __PRIVATE_TargetImpl(e, t, n, r, i, s, o);
}

function __PRIVATE_canonifyTarget(e) {
    const t = __PRIVATE_debugCast(e);
    if (null === t.ce) {
        let e = t.path.canonicalString();
        null !== t.collectionGroup && (e += "|cg:" + t.collectionGroup), e += "|f:", e += t.filters.map((e => __PRIVATE_canonifyFilter(e))).join(","), 
        e += "|ob:", e += t.orderBy.map((e => function __PRIVATE_canonifyOrderBy(e) {
            // TODO(b/29183165): Make this collision robust.
            return e.field.canonicalString() + e.dir;
        }(e))).join(","), __PRIVATE_isNullOrUndefined(t.limit) || (e += "|l:", e += t.limit), 
        t.startAt && (e += "|lb:", e += t.startAt.inclusive ? "b:" : "a:", e += t.startAt.position.map((e => canonicalId(e))).join(",")), 
        t.endAt && (e += "|ub:", e += t.endAt.inclusive ? "a:" : "b:", e += t.endAt.position.map((e => canonicalId(e))).join(",")), 
        t.ce = e;
    }
    return t.ce;
}

function __PRIVATE_targetEquals(e, t) {
    if (e.limit !== t.limit) return !1;
    if (e.orderBy.length !== t.orderBy.length) return !1;
    for (let n = 0; n < e.orderBy.length; n++) if (!__PRIVATE_orderByEquals(e.orderBy[n], t.orderBy[n])) return !1;
    if (e.filters.length !== t.filters.length) return !1;
    for (let n = 0; n < e.filters.length; n++) if (!__PRIVATE_filterEquals(e.filters[n], t.filters[n])) return !1;
    return e.collectionGroup === t.collectionGroup && (!!e.path.isEqual(t.path) && (!!__PRIVATE_boundEquals(e.startAt, t.startAt) && __PRIVATE_boundEquals(e.endAt, t.endAt)));
}

function __PRIVATE_targetIsDocumentTarget(e) {
    return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
}

/** Returns the field filters that target the given field path. */ function __PRIVATE_targetGetFieldFiltersForPath(e, t) {
    return e.filters.filter((e => e instanceof FieldFilter && e.field.isEqual(t)));
}

/**
 * Returns the values that are used in ARRAY_CONTAINS or ARRAY_CONTAINS_ANY
 * filters. Returns `null` if there are no such filters.
 */
/**
 * Returns the value to use as the lower bound for ascending index segment at
 * the provided `fieldPath` (or the upper bound for an descending segment).
 */
function __PRIVATE_targetGetAscendingBound(e, t, n) {
    let r = ie, i = !0;
    // Process all filters to find a value for the current field segment
    for (const n of __PRIVATE_targetGetFieldFiltersForPath(e, t)) {
        let e = ie, t = !0;
        switch (n.op) {
          case "<" /* Operator.LESS_THAN */ :
          case "<=" /* Operator.LESS_THAN_OR_EQUAL */ :
            e = __PRIVATE_valuesGetLowerBound(n.value);
            break;

          case "==" /* Operator.EQUAL */ :
          case "in" /* Operator.IN */ :
          case ">=" /* Operator.GREATER_THAN_OR_EQUAL */ :
            e = n.value;
            break;

          case ">" /* Operator.GREATER_THAN */ :
            e = n.value, t = !1;
            break;

          case "!=" /* Operator.NOT_EQUAL */ :
          case "not-in" /* Operator.NOT_IN */ :
            e = ie;
 // Remaining filters cannot be used as lower bounds.
                }
        __PRIVATE_lowerBoundCompare({
            value: r,
            inclusive: i
        }, {
            value: e,
            inclusive: t
        }) < 0 && (r = e, i = t);
    }
    // If there is an additional bound, compare the values against the existing
    // range to see if we can narrow the scope.
        if (null !== n) for (let s = 0; s < e.orderBy.length; ++s) {
        if (e.orderBy[s].field.isEqual(t)) {
            const e = n.position[s];
            __PRIVATE_lowerBoundCompare({
                value: r,
                inclusive: i
            }, {
                value: e,
                inclusive: n.inclusive
            }) < 0 && (r = e, i = n.inclusive);
            break;
        }
    }
    return {
        value: r,
        inclusive: i
    };
}

/**
 * Returns the value to use as the upper bound for ascending index segment at
 * the provided `fieldPath` (or the lower bound for a descending segment).
 */ function __PRIVATE_targetGetDescendingBound(e, t, n) {
    let r = re, i = !0;
    // Process all filters to find a value for the current field segment
    for (const n of __PRIVATE_targetGetFieldFiltersForPath(e, t)) {
        let e = re, t = !0;
        switch (n.op) {
          case ">=" /* Operator.GREATER_THAN_OR_EQUAL */ :
          case ">" /* Operator.GREATER_THAN */ :
            e = __PRIVATE_valuesGetUpperBound(n.value), t = !1;
            break;

          case "==" /* Operator.EQUAL */ :
          case "in" /* Operator.IN */ :
          case "<=" /* Operator.LESS_THAN_OR_EQUAL */ :
            e = n.value;
            break;

          case "<" /* Operator.LESS_THAN */ :
            e = n.value, t = !1;
            break;

          case "!=" /* Operator.NOT_EQUAL */ :
          case "not-in" /* Operator.NOT_IN */ :
            e = re;
 // Remaining filters cannot be used as upper bounds.
                }
        __PRIVATE_upperBoundCompare({
            value: r,
            inclusive: i
        }, {
            value: e,
            inclusive: t
        }) > 0 && (r = e, i = t);
    }
    // If there is an additional bound, compare the values against the existing
    // range to see if we can narrow the scope.
        if (null !== n) for (let s = 0; s < e.orderBy.length; ++s) {
        if (e.orderBy[s].field.isEqual(t)) {
            const e = n.position[s];
            __PRIVATE_upperBoundCompare({
                value: r,
                inclusive: i
            }, {
                value: e,
                inclusive: n.inclusive
            }) > 0 && (r = e, i = n.inclusive);
            break;
        }
    }
    return {
        value: r,
        inclusive: i
    };
}

/** Returns the number of segments of a perfect index for this target. */
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
    constructor(e, t = null, n = [], r = [], i = null, s = "F" /* LimitType.First */ , o = null, _ = null) {
        this.path = e, this.collectionGroup = t, this.explicitOrderBy = n, this.filters = r, 
        this.limit = i, this.limitType = s, this.startAt = o, this.endAt = _, this.le = null, 
        // The corresponding `Target` of this `Query` instance, for use with
        // non-aggregate queries.
        this.he = null, 
        // The corresponding `Target` of this `Query` instance, for use with
        // aggregate queries. Unlike targets for non-aggregate queries,
        // aggregate query targets do not contain normalized order-bys, they only
        // contain explicit order-bys.
        this.Pe = null, this.startAt, this.endAt;
    }
}

/** Creates a new Query instance with the options provided. */ function __PRIVATE_newQuery(e, t, n, r, i, s, o, _) {
    return new __PRIVATE_QueryImpl(e, t, n, r, i, s, o, _);
}

/** Creates a new Query for a query that matches all documents at `path` */ function __PRIVATE_newQueryForPath(e) {
    return new __PRIVATE_QueryImpl(e);
}

/**
 * Helper to convert a collection group query into a collection query at a
 * specific path. This is used when executing collection group queries, since
 * we have to split the query into a set of collection queries at multiple
 * paths.
 */
/**
 * Returns true if this query does not specify any query constraints that
 * could remove results.
 */
function __PRIVATE_queryMatchesAllDocuments(e) {
    return 0 === e.filters.length && null === e.limit && null == e.startAt && null == e.endAt && (0 === e.explicitOrderBy.length || 1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField());
}

// Returns the sorted set of inequality filter fields used in this query.
/**
 * Returns whether the query matches a collection group rather than a specific
 * collection.
 */
function __PRIVATE_isCollectionGroupQuery(e) {
    return null !== e.collectionGroup;
}

/**
 * Returns the normalized order-by constraint that is used to execute the Query,
 * which can be different from the order-by constraints the user provided (e.g.
 * the SDK and backend always orders by `__name__`). The normalized order-by
 * includes implicit order-bys in addition to the explicit user provided
 * order-bys.
 */ function __PRIVATE_queryNormalizedOrderBy(e) {
    const t = __PRIVATE_debugCast(e);
    if (null === t.le) {
        t.le = [];
        const e = new Set;
        // Any explicit order by fields should be added as is.
                for (const n of t.explicitOrderBy) t.le.push(n), e.add(n.field.canonicalString());
        // The order of the implicit ordering always matches the last explicit order by.
                const n = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc" /* Direction.ASCENDING */ , r = function __PRIVATE_getInequalityFilterFields(e) {
            let t = new SortedSet(FieldPath$1.comparator);
            return e.filters.forEach((e => {
                e.getFlattenedFilters().forEach((e => {
                    e.isInequality() && (t = t.add(e.field));
                }));
            })), t;
        }
        /**
 * Creates a new Query for a collection group query that matches all documents
 * within the provided collection group.
 */ (t);
        // Any inequality fields not explicitly ordered should be implicitly ordered in a lexicographical
        // order. When there are multiple inequality filters on the same field, the field should be added
        // only once.
        // Note: `SortedSet<FieldPath>` sorts the key field before other fields. However, we want the key
        // field to be sorted last.
                r.forEach((r => {
            e.has(r.canonicalString()) || r.isKeyField() || t.le.push(new OrderBy(r, n));
        })), 
        // Add the document key field to the last if it is not explicitly ordered.
        e.has(FieldPath$1.keyField().canonicalString()) || t.le.push(new OrderBy(FieldPath$1.keyField(), n));
    }
    return t.le;
}

/**
 * Converts this `Query` instance to its corresponding `Target` representation.
 */ function __PRIVATE_queryToTarget(e) {
    const t = __PRIVATE_debugCast(e);
    return t.he || (t.he = __PRIVATE__queryToTarget(t, __PRIVATE_queryNormalizedOrderBy(e))), 
    t.he;
}

/**
 * Converts this `Query` instance to its corresponding `Target` representation,
 * for use within an aggregate query. Unlike targets for non-aggregate queries,
 * aggregate query targets do not contain normalized order-bys, they only
 * contain explicit order-bys.
 */ function __PRIVATE__queryToTarget(e, t) {
    if ("F" /* LimitType.First */ === e.limitType) return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
    {
        // Flip the orderBy directions since we want the last results
        t = t.map((e => {
            const t = "desc" /* Direction.DESCENDING */ === e.dir ? "asc" /* Direction.ASCENDING */ : "desc" /* Direction.DESCENDING */;
            return new OrderBy(e.field, t);
        }));
        // We need to swap the cursors to match the now-flipped query ordering.
        const n = e.endAt ? new Bound(e.endAt.position, e.endAt.inclusive) : null, r = e.startAt ? new Bound(e.startAt.position, e.startAt.inclusive) : null;
        // Now return as a LimitType.First query.
        return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, n, r);
    }
}

function __PRIVATE_queryWithAddedFilter(e, t) {
    const n = e.filters.concat([ t ]);
    return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), n, e.limit, e.limitType, e.startAt, e.endAt);
}

function __PRIVATE_queryWithLimit(e, t, n) {
    return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t, n, e.startAt, e.endAt);
}

function __PRIVATE_queryEquals(e, t) {
    return __PRIVATE_targetEquals(__PRIVATE_queryToTarget(e), __PRIVATE_queryToTarget(t)) && e.limitType === t.limitType;
}

// TODO(b/29183165): This is used to get a unique string from a query to, for
// example, use as a dictionary key, but the implementation is subject to
// collisions. Make it collision-free.
function __PRIVATE_canonifyQuery(e) {
    return `${__PRIVATE_canonifyTarget(__PRIVATE_queryToTarget(e))}|lt:${e.limitType}`;
}

function __PRIVATE_stringifyQuery(e) {
    return `Query(target=${function __PRIVATE_stringifyTarget(e) {
        let t = e.path.canonicalString();
        return null !== e.collectionGroup && (t += " collectionGroup=" + e.collectionGroup), 
        e.filters.length > 0 && (t += `, filters: [${e.filters.map((e => __PRIVATE_stringifyFilter(e))).join(", ")}]`), 
        __PRIVATE_isNullOrUndefined(e.limit) || (t += ", limit: " + e.limit), e.orderBy.length > 0 && (t += `, orderBy: [${e.orderBy.map((e => function __PRIVATE_stringifyOrderBy(e) {
            return `${e.field.canonicalString()} (${e.dir})`;
        }(e))).join(", ")}]`), e.startAt && (t += ", startAt: ", t += e.startAt.inclusive ? "b:" : "a:", 
        t += e.startAt.position.map((e => canonicalId(e))).join(",")), e.endAt && (t += ", endAt: ", 
        t += e.endAt.inclusive ? "a:" : "b:", t += e.endAt.position.map((e => canonicalId(e))).join(",")), 
        `Target(${t})`;
    }(__PRIVATE_queryToTarget(e))}; limitType=${e.limitType})`;
}

/** Returns whether `doc` matches the constraints of `query`. */ function __PRIVATE_queryMatches(e, t) {
    return t.isFoundDocument() && function __PRIVATE_queryMatchesPathAndCollectionGroup(e, t) {
        const n = t.key.path;
        return null !== e.collectionGroup ? t.key.hasCollectionId(e.collectionGroup) && e.path.isPrefixOf(n) : DocumentKey.isDocumentKey(e.path) ? e.path.isEqual(n) : e.path.isImmediateParentOf(n);
    }
    /**
 * A document must have a value for every ordering clause in order to show up
 * in the results.
 */ (e, t) && function __PRIVATE_queryMatchesOrderBy(e, t) {
        // We must use `queryNormalizedOrderBy()` to get the list of all orderBys (both implicit and explicit).
        // Note that for OR queries, orderBy applies to all disjunction terms and implicit orderBys must
        // be taken into account. For example, the query "a > 1 || b==1" has an implicit "orderBy a" due
        // to the inequality, and is evaluated as "a > 1 orderBy a || b==1 orderBy a".
        // A document with content of {b:1} matches the filters, but does not match the orderBy because
        // it's missing the field 'a'.
        for (const n of __PRIVATE_queryNormalizedOrderBy(e)) 
        // order-by key always matches
        if (!n.field.isKeyField() && null === t.data.field(n.field)) return !1;
        return !0;
    }(e, t) && function __PRIVATE_queryMatchesFilters(e, t) {
        for (const n of e.filters) if (!n.matches(t)) return !1;
        return !0;
    }
    /** Makes sure a document is within the bounds, if provided. */ (e, t) && function __PRIVATE_queryMatchesBounds(e, t) {
        if (e.startAt && !
        /**
 * Returns true if a document sorts before a bound using the provided sort
 * order.
 */
        function __PRIVATE_boundSortsBeforeDocument(e, t, n) {
            const r = __PRIVATE_boundCompareToDocument(e, t, n);
            return e.inclusive ? r <= 0 : r < 0;
        }(e.startAt, __PRIVATE_queryNormalizedOrderBy(e), t)) return !1;
        if (e.endAt && !function __PRIVATE_boundSortsAfterDocument(e, t, n) {
            const r = __PRIVATE_boundCompareToDocument(e, t, n);
            return e.inclusive ? r >= 0 : r > 0;
        }(e.endAt, __PRIVATE_queryNormalizedOrderBy(e), t)) return !1;
        return !0;
    }
    /**
 * Returns the collection group that this query targets.
 *
 * PORTING NOTE: This is only used in the Web SDK to facilitate multi-tab
 * synchronization for query results.
 */ (e, t);
}

function __PRIVATE_queryCollectionGroup(e) {
    return e.collectionGroup || (e.path.length % 2 == 1 ? e.path.lastSegment() : e.path.get(e.path.length - 2));
}

/**
 * Returns a new comparator function that can be used to compare two documents
 * based on the Query's ordering constraint.
 */ function __PRIVATE_newQueryComparator(e) {
    return (t, n) => {
        let r = !1;
        for (const i of __PRIVATE_queryNormalizedOrderBy(e)) {
            const e = __PRIVATE_compareDocs(i, t, n);
            if (0 !== e) return e;
            r = r || i.field.isKeyField();
        }
        return 0;
    };
}

function __PRIVATE_compareDocs(e, t, n) {
    const r = e.field.isKeyField() ? DocumentKey.comparator(t.key, n.key) : function __PRIVATE_compareDocumentsByField(e, t, n) {
        const r = t.data.field(e), i = n.data.field(e);
        return null !== r && null !== i ? __PRIVATE_valueCompare(r, i) : fail();
    }(e.field, t, n);
    switch (e.dir) {
      case "asc" /* Direction.ASCENDING */ :
        return r;

      case "desc" /* Direction.DESCENDING */ :
        return -1 * r;

      default:
        return fail();
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
 * A map implementation that uses objects as keys. Objects must have an
 * associated equals function and must be immutable. Entries in the map are
 * stored together with the key being produced from the mapKeyFn. This map
 * automatically handles collisions of keys.
 */ class ObjectMap {
    constructor(e, t) {
        this.mapKeyFn = e, this.equalsFn = t, 
        /**
         * The inner map for a key/value pair. Due to the possibility of collisions we
         * keep a list of entries that we do a linear search through to find an actual
         * match. Note that collisions should be rare, so we still expect near
         * constant time lookups in practice.
         */
        this.inner = {}, 
        /** The number of entries stored in the map */
        this.innerSize = 0;
    }
    /** Get a value for this key, or undefined if it does not exist. */    get(e) {
        const t = this.mapKeyFn(e), n = this.inner[t];
        if (void 0 !== n) for (const [t, r] of n) if (this.equalsFn(t, e)) return r;
    }
    has(e) {
        return void 0 !== this.get(e);
    }
    /** Put this key and value in the map. */    set(e, t) {
        const n = this.mapKeyFn(e), r = this.inner[n];
        if (void 0 === r) return this.inner[n] = [ [ e, t ] ], void this.innerSize++;
        for (let n = 0; n < r.length; n++) if (this.equalsFn(r[n][0], e)) 
        // This is updating an existing entry and does not increase `innerSize`.
        return void (r[n] = [ e, t ]);
        r.push([ e, t ]), this.innerSize++;
    }
    /**
     * Remove this key from the map. Returns a boolean if anything was deleted.
     */    delete(e) {
        const t = this.mapKeyFn(e), n = this.inner[t];
        if (void 0 === n) return !1;
        for (let r = 0; r < n.length; r++) if (this.equalsFn(n[r][0], e)) return 1 === n.length ? delete this.inner[t] : n.splice(r, 1), 
        this.innerSize--, !0;
        return !1;
    }
    forEach(e) {
        forEach(this.inner, ((t, n) => {
            for (const [t, r] of n) e(t, r);
        }));
    }
    isEmpty() {
        return isEmpty(this.inner);
    }
    size() {
        return this.innerSize;
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
 */ const se = new SortedMap(DocumentKey.comparator);

function __PRIVATE_mutableDocumentMap() {
    return se;
}

const oe = new SortedMap(DocumentKey.comparator);

function documentMap(...e) {
    let t = oe;
    for (const n of e) t = t.insert(n.key, n);
    return t;
}

function __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e) {
    let t = oe;
    return e.forEach(((e, n) => t = t.insert(e, n.overlayedDocument))), t;
}

function __PRIVATE_newOverlayMap() {
    return __PRIVATE_newDocumentKeyMap();
}

function __PRIVATE_newMutationMap() {
    return __PRIVATE_newDocumentKeyMap();
}

function __PRIVATE_newDocumentKeyMap() {
    return new ObjectMap((e => e.toString()), ((e, t) => e.isEqual(t)));
}

const _e = new SortedMap(DocumentKey.comparator);

const ae = new SortedSet(DocumentKey.comparator);

function __PRIVATE_documentKeySet(...e) {
    let t = ae;
    for (const n of e) t = t.add(n);
    return t;
}

const ue = new SortedSet(__PRIVATE_primitiveComparator);

function __PRIVATE_targetIdSet() {
    return ue;
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
 */ function __PRIVATE_toDouble(e, t) {
    if (e.useProto3Json) {
        if (isNaN(t)) return {
            doubleValue: "NaN"
        };
        if (t === 1 / 0) return {
            doubleValue: "Infinity"
        };
        if (t === -1 / 0) return {
            doubleValue: "-Infinity"
        };
    }
    return {
        doubleValue: __PRIVATE_isNegativeZero(t) ? "-0" : t
    };
}

/**
 * Returns an IntegerValue for `value`.
 */ function __PRIVATE_toInteger(e) {
    return {
        integerValue: "" + e
    };
}

/**
 * Returns a value for a number that's appropriate to put into a proto.
 * The return value is an IntegerValue if it can safely represent the value,
 * otherwise a DoubleValue is returned.
 */ function toNumber(e, t) {
    return isSafeInteger(t) ? __PRIVATE_toInteger(t) : __PRIVATE_toDouble(e, t);
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

/**
 * Computes the local transform result against the provided `previousValue`,
 * optionally using the provided localWriteTime.
 */ function __PRIVATE_applyTransformOperationToLocalView(e, t, n) {
    return e instanceof __PRIVATE_ServerTimestampTransform ? function serverTimestamp$1(e, t) {
        const n = {
            fields: {
                __type__: {
                    stringValue: "server_timestamp"
                },
                __local_write_time__: {
                    timestampValue: {
                        seconds: e.seconds,
                        nanos: e.nanoseconds
                    }
                }
            }
        };
        // We should avoid storing deeply nested server timestamp map values
        // because we never use the intermediate "previous values".
        // For example:
        // previous: 42L, add: t1, result: t1 -> 42L
        // previous: t1,  add: t2, result: t2 -> 42L (NOT t2 -> t1 -> 42L)
        // previous: t2,  add: t3, result: t3 -> 42L (NOT t3 -> t2 -> t1 -> 42L)
        // `getPreviousValue` recursively traverses server timestamps to find the
        // least recent Value.
                return t && __PRIVATE_isServerTimestamp(t) && (t = __PRIVATE_getPreviousValue(t)), 
        t && (n.fields.__previous_value__ = t), {
            mapValue: n
        };
    }(n, t) : e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : function __PRIVATE_applyNumericIncrementTransformOperationToLocalView(e, t) {
        // PORTING NOTE: Since JavaScript's integer arithmetic is limited to 53 bit
        // precision and resolves overflows by reducing precision, we do not
        // manually cap overflows at 2^63.
        const n = __PRIVATE_computeTransformOperationBaseValue(e, t), r = asNumber(n) + asNumber(e.Ie);
        return isInteger(n) && isInteger(e.Ie) ? __PRIVATE_toInteger(r) : __PRIVATE_toDouble(e.serializer, r);
    }(e, t);
}

/**
 * Computes a final transform result after the transform has been acknowledged
 * by the server, potentially using the server-provided transformResult.
 */ function __PRIVATE_applyTransformOperationToRemoteDocument(e, t, n) {
    // The server just sends null as the transform result for array operations,
    // so we have to calculate a result the same as we do for local
    // applications.
    return e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : n;
}

/**
 * If this transform operation is not idempotent, returns the base value to
 * persist for this transform. If a base value is returned, the transform
 * operation is always applied to this base value, even if document has
 * already been updated.
 *
 * Base values provide consistent behavior for non-idempotent transforms and
 * allow us to return the same latency-compensated value even if the backend
 * has already applied the transform operation. The base value is null for
 * idempotent transforms, as they can be re-played even if the backend has
 * already applied them.
 *
 * @returns a base value to store along with the mutation, or null for
 * idempotent transforms.
 */ function __PRIVATE_computeTransformOperationBaseValue(e, t) {
    return e instanceof __PRIVATE_NumericIncrementTransformOperation ? 
    /** Returns true if `value` is either an IntegerValue or a DoubleValue. */
    function __PRIVATE_isNumber(e) {
        return isInteger(e) || function __PRIVATE_isDouble(e) {
            return !!e && "doubleValue" in e;
        }(e);
    }(t) ? t : {
        integerValue: 0
    } : null;
}

/** Transforms a value into a server-generated timestamp. */
class __PRIVATE_ServerTimestampTransform extends TransformOperation {}

/** Transforms an array value via a union operation. */ class __PRIVATE_ArrayUnionTransformOperation extends TransformOperation {
    constructor(e) {
        super(), this.elements = e;
    }
}

function __PRIVATE_applyArrayUnionTransformOperation(e, t) {
    const n = __PRIVATE_coercedFieldValuesArray(t);
    for (const t of e.elements) n.some((e => __PRIVATE_valueEquals(e, t))) || n.push(t);
    return {
        arrayValue: {
            values: n
        }
    };
}

/** Transforms an array value via a remove operation. */ class __PRIVATE_ArrayRemoveTransformOperation extends TransformOperation {
    constructor(e) {
        super(), this.elements = e;
    }
}

function __PRIVATE_applyArrayRemoveTransformOperation(e, t) {
    let n = __PRIVATE_coercedFieldValuesArray(t);
    for (const t of e.elements) n = n.filter((e => !__PRIVATE_valueEquals(e, t)));
    return {
        arrayValue: {
            values: n
        }
    };
}

/**
 * Implements the backend semantics for locally computed NUMERIC_ADD (increment)
 * transforms. Converts all field values to integers or doubles, but unlike the
 * backend does not cap integer values at 2^63. Instead, JavaScript number
 * arithmetic is used and precision loss can occur for values greater than 2^53.
 */ class __PRIVATE_NumericIncrementTransformOperation extends TransformOperation {
    constructor(e, t) {
        super(), this.serializer = e, this.Ie = t;
    }
}

function asNumber(e) {
    return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
}

function __PRIVATE_coercedFieldValuesArray(e) {
    return isArray(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
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
    constructor(e, t) {
        this.field = e, this.transform = t;
    }
}

function __PRIVATE_fieldTransformEquals(e, t) {
    return e.field.isEqual(t.field) && function __PRIVATE_transformOperationEquals(e, t) {
        return e instanceof __PRIVATE_ArrayUnionTransformOperation && t instanceof __PRIVATE_ArrayUnionTransformOperation || e instanceof __PRIVATE_ArrayRemoveTransformOperation && t instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_arrayEquals(e.elements, t.elements, __PRIVATE_valueEquals) : e instanceof __PRIVATE_NumericIncrementTransformOperation && t instanceof __PRIVATE_NumericIncrementTransformOperation ? __PRIVATE_valueEquals(e.Ie, t.Ie) : e instanceof __PRIVATE_ServerTimestampTransform && t instanceof __PRIVATE_ServerTimestampTransform;
    }(e.transform, t.transform);
}

/** The result of successfully applying a mutation to the backend. */
class MutationResult {
    constructor(
    /**
     * The version at which the mutation was committed:
     *
     * - For most operations, this is the updateTime in the WriteResult.
     * - For deletes, the commitTime of the WriteResponse (because deletes are
     *   not stored and have no updateTime).
     *
     * Note that these versions can be different: No-op writes will not change
     * the updateTime even though the commitTime advances.
     */
    e, 
    /**
     * The resulting fields returned from the backend after a mutation
     * containing field transforms has been committed. Contains one FieldValue
     * for each FieldTransform that was in the mutation.
     *
     * Will be empty if the mutation did not contain any field transforms.
     */
    t) {
        this.version = e, this.transformResults = t;
    }
}

/**
 * Encodes a precondition for a mutation. This follows the model that the
 * backend accepts with the special case of an explicit "empty" precondition
 * (meaning no precondition).
 */ class Precondition {
    constructor(e, t) {
        this.updateTime = e, this.exists = t;
    }
    /** Creates a new empty Precondition. */    static none() {
        return new Precondition;
    }
    /** Creates a new Precondition with an exists flag. */    static exists(e) {
        return new Precondition(void 0, e);
    }
    /** Creates a new Precondition based on a version a document exists at. */    static updateTime(e) {
        return new Precondition(e);
    }
    /** Returns whether this Precondition is empty. */    get isNone() {
        return void 0 === this.updateTime && void 0 === this.exists;
    }
    isEqual(e) {
        return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
    }
}

/** Returns true if the preconditions is valid for the given document. */ function __PRIVATE_preconditionIsValidForDocument(e, t) {
    return void 0 !== e.updateTime ? t.isFoundDocument() && t.version.isEqual(e.updateTime) : void 0 === e.exists || e.exists === t.isFoundDocument();
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
 * A utility method to calculate a `Mutation` representing the overlay from the
 * final state of the document, and a `FieldMask` representing the fields that
 * are mutated by the local mutations.
 */ function __PRIVATE_calculateOverlayMutation(e, t) {
    if (!e.hasLocalMutations || t && 0 === t.fields.length) return null;
    // mask is null when sets or deletes are applied to the current document.
        if (null === t) return e.isNoDocument() ? new __PRIVATE_DeleteMutation(e.key, Precondition.none()) : new __PRIVATE_SetMutation(e.key, e.data, Precondition.none());
    {
        const n = e.data, r = ObjectValue.empty();
        let i = new SortedSet(FieldPath$1.comparator);
        for (let e of t.fields) if (!i.has(e)) {
            let t = n.field(e);
            // If we are deleting a nested field, we take the immediate parent as
            // the mask used to construct the resulting mutation.
            // Justification: Nested fields can create parent fields implicitly. If
            // only a leaf entry is deleted in later mutations, the parent field
            // should still remain, but we may have lost this information.
            // Consider mutation (foo.bar 1), then mutation (foo.bar delete()).
            // This leaves the final result (foo, {}). Despite the fact that `doc`
            // has the correct result, `foo` is not in `mask`, and the resulting
            // mutation would miss `foo`.
                        null === t && e.length > 1 && (e = e.popLast(), t = n.field(e)), null === t ? r.delete(e) : r.set(e, t), 
            i = i.add(e);
        }
        return new __PRIVATE_PatchMutation(e.key, r, new FieldMask(i.toArray()), Precondition.none());
    }
}

/**
 * Applies this mutation to the given document for the purposes of computing a
 * new remote document. If the input document doesn't match the expected state
 * (e.g. it is invalid or outdated), the document type may transition to
 * unknown.
 *
 * @param mutation - The mutation to apply.
 * @param document - The document to mutate. The input document can be an
 *     invalid document if the client has no knowledge of the pre-mutation state
 *     of the document.
 * @param mutationResult - The result of applying the mutation from the backend.
 */ function __PRIVATE_mutationApplyToRemoteDocument(e, t, n) {
    e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToRemoteDocument(e, t, n) {
        // Unlike setMutationApplyToLocalView, if we're applying a mutation to a
        // remote document the server has accepted the mutation so the precondition
        // must have held.
        const r = e.value.clone(), i = __PRIVATE_serverTransformResults(e.fieldTransforms, t, n.transformResults);
        r.setAll(i), t.convertToFoundDocument(n.version, r).setHasCommittedMutations();
    }(e, t, n) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToRemoteDocument(e, t, n) {
        if (!__PRIVATE_preconditionIsValidForDocument(e.precondition, t)) 
        // Since the mutation was not rejected, we know that the precondition
        // matched on the backend. We therefore must not have the expected version
        // of the document in our cache and convert to an UnknownDocument with a
        // known updateTime.
        return void t.convertToUnknownDocument(n.version);
        const r = __PRIVATE_serverTransformResults(e.fieldTransforms, t, n.transformResults), i = t.data;
        i.setAll(__PRIVATE_getPatch(e)), i.setAll(r), t.convertToFoundDocument(n.version, i).setHasCommittedMutations();
    }(e, t, n) : function __PRIVATE_deleteMutationApplyToRemoteDocument(e, t, n) {
        // Unlike applyToLocalView, if we're applying a mutation to a remote
        // document the server has accepted the mutation so the precondition must
        // have held.
        t.convertToNoDocument(n.version).setHasCommittedMutations();
    }(0, t, n);
}

/**
 * Applies this mutation to the given document for the purposes of computing
 * the new local view of a document. If the input document doesn't match the
 * expected state, the document is not modified.
 *
 * @param mutation - The mutation to apply.
 * @param document - The document to mutate. The input document can be an
 *     invalid document if the client has no knowledge of the pre-mutation state
 *     of the document.
 * @param previousMask - The fields that have been updated before applying this mutation.
 * @param localWriteTime - A timestamp indicating the local write time of the
 *     batch this mutation is a part of.
 * @returns A `FieldMask` representing the fields that are changed by applying this mutation.
 */ function __PRIVATE_mutationApplyToLocalView(e, t, n, r) {
    return e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToLocalView(e, t, n, r) {
        if (!__PRIVATE_preconditionIsValidForDocument(e.precondition, t)) 
        // The mutation failed to apply (e.g. a document ID created with add()
        // caused a name collision).
        return n;
        const i = e.value.clone(), s = __PRIVATE_localTransformResults(e.fieldTransforms, r, t);
        return i.setAll(s), t.convertToFoundDocument(t.version, i).setHasLocalMutations(), 
        null;
 // SetMutation overwrites all fields.
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
 */ (e, t, n, r) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToLocalView(e, t, n, r) {
        if (!__PRIVATE_preconditionIsValidForDocument(e.precondition, t)) return n;
        const i = __PRIVATE_localTransformResults(e.fieldTransforms, r, t), s = t.data;
        if (s.setAll(__PRIVATE_getPatch(e)), s.setAll(i), t.convertToFoundDocument(t.version, s).setHasLocalMutations(), 
        null === n) return null;
        return n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map((e => e.field)));
    }
    /**
 * Returns a FieldPath/Value map with the content of the PatchMutation.
 */ (e, t, n, r) : function __PRIVATE_deleteMutationApplyToLocalView(e, t, n) {
        if (__PRIVATE_preconditionIsValidForDocument(e.precondition, t)) return t.convertToNoDocument(t.version).setHasLocalMutations(), 
        null;
        return n;
    }
    /**
 * A mutation that verifies the existence of the document at the given key with
 * the provided precondition.
 *
 * The `verify` operation is only used in Transactions, and this class serves
 * primarily to facilitate serialization into protos.
 */ (e, t, n);
}

/**
 * If this mutation is not idempotent, returns the base value to persist with
 * this mutation. If a base value is returned, the mutation is always applied
 * to this base value, even if document has already been updated.
 *
 * The base value is a sparse object that consists of only the document
 * fields for which this mutation contains a non-idempotent transformation
 * (e.g. a numeric increment). The provided value guarantees consistent
 * behavior for non-idempotent transforms and allow us to return the same
 * latency-compensated value even if the backend has already applied the
 * mutation. The base value is null for idempotent mutations, as they can be
 * re-played even if the backend has already applied them.
 *
 * @returns a base value to store along with the mutation, or null for
 * idempotent mutations.
 */ function __PRIVATE_mutationExtractBaseValue(e, t) {
    let n = null;
    for (const r of e.fieldTransforms) {
        const e = t.data.field(r.field), i = __PRIVATE_computeTransformOperationBaseValue(r.transform, e || null);
        null != i && (null === n && (n = ObjectValue.empty()), n.set(r.field, i));
    }
    return n || null;
}

function __PRIVATE_mutationEquals(e, t) {
    return e.type === t.type && (!!e.key.isEqual(t.key) && (!!e.precondition.isEqual(t.precondition) && (!!function __PRIVATE_fieldTransformsAreEqual(e, t) {
        return void 0 === e && void 0 === t || !(!e || !t) && __PRIVATE_arrayEquals(e, t, ((e, t) => __PRIVATE_fieldTransformEquals(e, t)));
    }(e.fieldTransforms, t.fieldTransforms) && (0 /* MutationType.Set */ === e.type ? e.value.isEqual(t.value) : 1 /* MutationType.Patch */ !== e.type || e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask)))));
}

/**
 * A mutation that creates or replaces the document at the given key with the
 * object value contents.
 */ class __PRIVATE_SetMutation extends Mutation {
    constructor(e, t, n, r = []) {
        super(), this.key = e, this.value = t, this.precondition = n, this.fieldTransforms = r, 
        this.type = 0 /* MutationType.Set */;
    }
    getFieldMask() {
        return null;
    }
}

class __PRIVATE_PatchMutation extends Mutation {
    constructor(e, t, n, r, i = []) {
        super(), this.key = e, this.data = t, this.fieldMask = n, this.precondition = r, 
        this.fieldTransforms = i, this.type = 1 /* MutationType.Patch */;
    }
    getFieldMask() {
        return this.fieldMask;
    }
}

function __PRIVATE_getPatch(e) {
    const t = new Map;
    return e.fieldMask.fields.forEach((n => {
        if (!n.isEmpty()) {
            const r = e.data.field(n);
            t.set(n, r);
        }
    })), t;
}

/**
 * Creates a list of "transform results" (a transform result is a field value
 * representing the result of applying a transform) for use after a mutation
 * containing transforms has been acknowledged by the server.
 *
 * @param fieldTransforms - The field transforms to apply the result to.
 * @param mutableDocument - The current state of the document after applying all
 * previous mutations.
 * @param serverTransformResults - The transform results received by the server.
 * @returns The transform results list.
 */ function __PRIVATE_serverTransformResults(e, t, n) {
    const r = new Map;
    __PRIVATE_hardAssert(e.length === n.length);
    for (let i = 0; i < n.length; i++) {
        const s = e[i], o = s.transform, _ = t.data.field(s.field);
        r.set(s.field, __PRIVATE_applyTransformOperationToRemoteDocument(o, _, n[i]));
    }
    return r;
}

/**
 * Creates a list of "transform results" (a transform result is a field value
 * representing the result of applying a transform) for use when applying a
 * transform locally.
 *
 * @param fieldTransforms - The field transforms to apply the result to.
 * @param localWriteTime - The local time of the mutation (used to
 *     generate ServerTimestampValues).
 * @param mutableDocument - The document to apply transforms on.
 * @returns The transform results list.
 */ function __PRIVATE_localTransformResults(e, t, n) {
    const r = new Map;
    for (const i of e) {
        const e = i.transform, s = n.data.field(i.field);
        r.set(i.field, __PRIVATE_applyTransformOperationToLocalView(e, s, t));
    }
    return r;
}

/** A mutation that deletes the document at the given key. */ class __PRIVATE_DeleteMutation extends Mutation {
    constructor(e, t) {
        super(), this.key = e, this.precondition = t, this.type = 2 /* MutationType.Delete */ , 
        this.fieldTransforms = [];
    }
    getFieldMask() {
        return null;
    }
}

class __PRIVATE_VerifyMutation extends Mutation {
    constructor(e, t) {
        super(), this.key = e, this.precondition = t, this.type = 3 /* MutationType.Verify */ , 
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
 */
/**
 * A batch of mutations that will be sent as one unit to the backend.
 */ class MutationBatch {
    /**
     * @param batchId - The unique ID of this mutation batch.
     * @param localWriteTime - The original write time of this mutation.
     * @param baseMutations - Mutations that are used to populate the base
     * values when this mutation is applied locally. This can be used to locally
     * overwrite values that are persisted in the remote document cache. Base
     * mutations are never sent to the backend.
     * @param mutations - The user-provided mutations in this mutation batch.
     * User-provided mutations are applied both locally and remotely on the
     * backend.
     */
    constructor(e, t, n, r) {
        this.batchId = e, this.localWriteTime = t, this.baseMutations = n, this.mutations = r;
    }
    /**
     * Applies all the mutations in this MutationBatch to the specified document
     * to compute the state of the remote document
     *
     * @param document - The document to apply mutations to.
     * @param batchResult - The result of applying the MutationBatch to the
     * backend.
     */    applyToRemoteDocument(e, t) {
        const n = t.mutationResults;
        for (let t = 0; t < this.mutations.length; t++) {
            const r = this.mutations[t];
            if (r.key.isEqual(e.key)) {
                __PRIVATE_mutationApplyToRemoteDocument(r, e, n[t]);
            }
        }
    }
    /**
     * Computes the local view of a document given all the mutations in this
     * batch.
     *
     * @param document - The document to apply mutations to.
     * @param mutatedFields - Fields that have been updated before applying this mutation batch.
     * @returns A `FieldMask` representing all the fields that are mutated.
     */    applyToLocalView(e, t) {
        // First, apply the base state. This allows us to apply non-idempotent
        // transform against a consistent set of values.
        for (const n of this.baseMutations) n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
        // Second, apply all user-provided mutations.
                for (const n of this.mutations) n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
        return t;
    }
    /**
     * Computes the local view for all provided documents given the mutations in
     * this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
     * replace all the mutation applications.
     */    applyToLocalDocumentSet(e, t) {
        // TODO(mrschmidt): This implementation is O(n^2). If we apply the mutations
        // directly (as done in `applyToLocalView()`), we can reduce the complexity
        // to O(n).
        const n = __PRIVATE_newMutationMap();
        return this.mutations.forEach((r => {
            const i = e.get(r.key), s = i.overlayedDocument;
            // TODO(mutabledocuments): This method should take a MutableDocumentMap
            // and we should remove this cast.
                        let o = this.applyToLocalView(s, i.mutatedFields);
            // Set mutatedFields to null if the document is only from local mutations.
            // This creates a Set or Delete mutation, instead of trying to create a
            // patch mutation as the overlay.
                        o = t.has(r.key) ? null : o;
            const _ = __PRIVATE_calculateOverlayMutation(s, o);
            null !== _ && n.set(r.key, _), s.isValidDocument() || s.convertToNoDocument(SnapshotVersion.min());
        })), n;
    }
    keys() {
        return this.mutations.reduce(((e, t) => e.add(t.key)), __PRIVATE_documentKeySet());
    }
    isEqual(e) {
        return this.batchId === e.batchId && __PRIVATE_arrayEquals(this.mutations, e.mutations, ((e, t) => __PRIVATE_mutationEquals(e, t))) && __PRIVATE_arrayEquals(this.baseMutations, e.baseMutations, ((e, t) => __PRIVATE_mutationEquals(e, t)));
    }
}

/** The result of applying a mutation batch to the backend. */ class MutationBatchResult {
    constructor(e, t, n, 
    /**
     * A pre-computed mapping from each mutated document to the resulting
     * version.
     */
    r) {
        this.batch = e, this.commitVersion = t, this.mutationResults = n, this.docVersions = r;
    }
    /**
     * Creates a new MutationBatchResult for the given batch and results. There
     * must be one result for each mutation in the batch. This static factory
     * caches a document=&gt;version mapping (docVersions).
     */    static from(e, t, n) {
        __PRIVATE_hardAssert(e.mutations.length === n.length);
        let r = function __PRIVATE_documentVersionMap() {
            return _e;
        }();
        const i = e.mutations;
        for (let e = 0; e < i.length; e++) r = r.insert(i[e].key, n[e].version);
        return new MutationBatchResult(e, t, n, r);
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
 * Representation of an overlay computed by Firestore.
 *
 * Holds information about a mutation and the largest batch id in Firestore when
 * the mutation was created.
 */ class Overlay {
    constructor(e, t) {
        this.largestBatchId = e, this.mutation = t;
    }
    getKey() {
        return this.mutation.key;
    }
    isEqual(e) {
        return null !== e && this.mutation === e.mutation;
    }
    toString() {
        return `Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`;
    }
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
 * Concrete implementation of the Aggregate type.
 */ class __PRIVATE_AggregateImpl {
    constructor(e, t, n) {
        this.alias = e, this.aggregateType = t, this.fieldPath = n;
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
 */ class ExistenceFilter {
    constructor(e, t) {
        this.count = e, this.unchangedNames = t;
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
 * Error Codes describing the different ways GRPC can fail. These are copied
 * directly from GRPC's sources here:
 *
 * https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
 *
 * Important! The names of these identifiers matter because the string forms
 * are used for reverse lookups from the webchannel stream. Do NOT change the
 * names of these identifiers or change this into a const enum.
 */ var ce, le;

/**
 * Determines whether an error code represents a permanent error when received
 * in response to a non-write operation.
 *
 * See isPermanentWriteError for classifying write errors.
 */
function __PRIVATE_isPermanentError(e) {
    switch (e) {
      default:
        return fail();

      case v.CANCELLED:
      case v.UNKNOWN:
      case v.DEADLINE_EXCEEDED:
      case v.RESOURCE_EXHAUSTED:
      case v.INTERNAL:
      case v.UNAVAILABLE:
 // Unauthenticated means something went wrong with our token and we need
        // to retry with new credentials which will happen automatically.
              case v.UNAUTHENTICATED:
        return !1;

      case v.INVALID_ARGUMENT:
      case v.NOT_FOUND:
      case v.ALREADY_EXISTS:
      case v.PERMISSION_DENIED:
      case v.FAILED_PRECONDITION:
 // Aborted might be retried in some scenarios, but that is dependant on
        // the context and should handled individually by the calling code.
        // See https://cloud.google.com/apis/design/errors.
              case v.ABORTED:
      case v.OUT_OF_RANGE:
      case v.UNIMPLEMENTED:
      case v.DATA_LOSS:
        return !0;
    }
}

/**
 * Determines whether an error code represents a permanent error when received
 * in response to a write operation.
 *
 * Write operations must be handled specially because as of b/119437764, ABORTED
 * errors on the write stream should be retried too (even though ABORTED errors
 * are not generally retryable).
 *
 * Note that during the initial handshake on the write stream an ABORTED error
 * signals that we should discard our stream token (i.e. it is permanent). This
 * means a handshake error should be classified with isPermanentError, above.
 */
/**
 * Maps an error Code from GRPC status code number, like 0, 1, or 14. These
 * are not the same as HTTP status codes.
 *
 * @returns The Code equivalent to the given GRPC status code. Fails if there
 *     is no match.
 */
function __PRIVATE_mapCodeFromRpcCode(e) {
    if (void 0 === e) 
    // This shouldn't normally happen, but in certain error cases (like trying
    // to send invalid proto messages) we may get an error with no GRPC code.
    return __PRIVATE_logError("GRPC error has no .code"), v.UNKNOWN;
    switch (e) {
      case ce.OK:
        return v.OK;

      case ce.CANCELLED:
        return v.CANCELLED;

      case ce.UNKNOWN:
        return v.UNKNOWN;

      case ce.DEADLINE_EXCEEDED:
        return v.DEADLINE_EXCEEDED;

      case ce.RESOURCE_EXHAUSTED:
        return v.RESOURCE_EXHAUSTED;

      case ce.INTERNAL:
        return v.INTERNAL;

      case ce.UNAVAILABLE:
        return v.UNAVAILABLE;

      case ce.UNAUTHENTICATED:
        return v.UNAUTHENTICATED;

      case ce.INVALID_ARGUMENT:
        return v.INVALID_ARGUMENT;

      case ce.NOT_FOUND:
        return v.NOT_FOUND;

      case ce.ALREADY_EXISTS:
        return v.ALREADY_EXISTS;

      case ce.PERMISSION_DENIED:
        return v.PERMISSION_DENIED;

      case ce.FAILED_PRECONDITION:
        return v.FAILED_PRECONDITION;

      case ce.ABORTED:
        return v.ABORTED;

      case ce.OUT_OF_RANGE:
        return v.OUT_OF_RANGE;

      case ce.UNIMPLEMENTED:
        return v.UNIMPLEMENTED;

      case ce.DATA_LOSS:
        return v.DATA_LOSS;

      default:
        return fail();
    }
}

/**
 * Converts an HTTP response's error status to the equivalent error code.
 *
 * @param status - An HTTP error response status ("FAILED_PRECONDITION",
 * "UNKNOWN", etc.)
 * @returns The equivalent Code. Non-matching responses are mapped to
 *     Code.UNKNOWN.
 */ (le = ce || (ce = {}))[le.OK = 0] = "OK", le[le.CANCELLED = 1] = "CANCELLED", 
le[le.UNKNOWN = 2] = "UNKNOWN", le[le.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", 
le[le.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", le[le.NOT_FOUND = 5] = "NOT_FOUND", 
le[le.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", le[le.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", 
le[le.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", le[le.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", 
le[le.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", le[le.ABORTED = 10] = "ABORTED", 
le[le.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", le[le.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", 
le[le.INTERNAL = 13] = "INTERNAL", le[le.UNAVAILABLE = 14] = "UNAVAILABLE", le[le.DATA_LOSS = 15] = "DATA_LOSS";

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
 * The global, singleton instance of TestingHooksSpi.
 *
 * This variable will be `null` in all cases _except_ when running from
 * integration tests that have registered callbacks to be notified of events
 * that happen during the test execution.
 */
let he = null;

/**
 * Sets the value of the `testingHooksSpi` object.
 * @param instance the instance to set.
 */
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
 * An instance of the Platform's 'TextEncoder' implementation.
 */
function __PRIVATE_newTextEncoder() {
    return new TextEncoder;
}

/**
 * An instance of the Platform's 'TextDecoder' implementation.
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
const Pe = new A([ 4294967295, 4294967295 ], 0);

// Hash a string using md5 hashing algorithm.
function __PRIVATE_getMd5HashValue(e) {
    const t = __PRIVATE_newTextEncoder().encode(e), n = new R;
    return n.update(t), new Uint8Array(n.digest());
}

// Interpret the 16 bytes array as two 64-bit unsigned integers, encoded using
// 2’s complement using little endian.
function __PRIVATE_get64BitUints(e) {
    const t = new DataView(e.buffer), n = t.getUint32(0, /* littleEndian= */ !0), r = t.getUint32(4, /* littleEndian= */ !0), i = t.getUint32(8, /* littleEndian= */ !0), s = t.getUint32(12, /* littleEndian= */ !0);
    return [ new A([ n, r ], 0), new A([ i, s ], 0) ];
}

class BloomFilter {
    constructor(e, t, n) {
        if (this.bitmap = e, this.padding = t, this.hashCount = n, t < 0 || t >= 8) throw new __PRIVATE_BloomFilterError(`Invalid padding: ${t}`);
        if (n < 0) throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
        if (e.length > 0 && 0 === this.hashCount) 
        // Only empty bloom filter can have 0 hash count.
        throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
        if (0 === e.length && 0 !== t) 
        // Empty bloom filter should have 0 padding.
        throw new __PRIVATE_BloomFilterError(`Invalid padding when bitmap length is 0: ${t}`);
        this.Te = 8 * e.length - t, 
        // Set the bit count in Integer to avoid repetition in mightContain().
        this.Ee = A.fromNumber(this.Te);
    }
    // Calculate the ith hash value based on the hashed 64bit integers,
    // and calculate its corresponding bit index in the bitmap to be checked.
    de(e, t, n) {
        // Calculate hashed value h(i) = h1 + (i * h2).
        let r = e.add(t.multiply(A.fromNumber(n)));
        // Wrap if hash value overflow 64bit.
                return 1 === r.compare(Pe) && (r = new A([ r.getBits(0), r.getBits(1) ], 0)), 
        r.modulo(this.Ee).toNumber();
    }
    // Return whether the bit on the given index in the bitmap is set to 1.
    Ae(e) {
        return 0 != (this.bitmap[Math.floor(e / 8)] & 1 << e % 8);
    }
    mightContain(e) {
        // Empty bitmap should always return false on membership check.
        if (0 === this.Te) return !1;
        const t = __PRIVATE_getMd5HashValue(e), [n, r] = __PRIVATE_get64BitUints(t);
        for (let e = 0; e < this.hashCount; e++) {
            const t = this.de(n, r, e);
            if (!this.Ae(t)) return !1;
        }
        return !0;
    }
    /** Create bloom filter for testing purposes only. */    static create(e, t, n) {
        const r = e % 8 == 0 ? 0 : 8 - e % 8, i = new Uint8Array(Math.ceil(e / 8)), s = new BloomFilter(i, r, t);
        return n.forEach((e => s.insert(e))), s;
    }
    insert(e) {
        if (0 === this.Te) return;
        const t = __PRIVATE_getMd5HashValue(e), [n, r] = __PRIVATE_get64BitUints(t);
        for (let e = 0; e < this.hashCount; e++) {
            const t = this.de(n, r, e);
            this.Re(t);
        }
    }
    Re(e) {
        const t = Math.floor(e / 8), n = e % 8;
        this.bitmap[t] |= 1 << n;
    }
}

class __PRIVATE_BloomFilterError extends Error {
    constructor() {
        super(...arguments), this.name = "BloomFilterError";
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
 * An event from the RemoteStore. It is split into targetChanges (changes to the
 * state or the set of documents in our watched targets) and documentUpdates
 * (changes to the actual documents).
 */ class RemoteEvent {
    constructor(
    /**
     * The snapshot version this event brings us up to, or MIN if not set.
     */
    e, 
    /**
     * A map from target to changes to the target. See TargetChange.
     */
    t, 
    /**
     * A map of targets that is known to be inconsistent, and the purpose for
     * re-listening. Listens for these targets should be re-established without
     * resume tokens.
     */
    n, 
    /**
     * A set of which documents have changed or been deleted, along with the
     * doc's new values (if not deleted).
     */
    r, 
    /**
     * A set of which document updates are due only to limbo resolution targets.
     */
    i) {
        this.snapshotVersion = e, this.targetChanges = t, this.targetMismatches = n, this.documentUpdates = r, 
        this.resolvedLimboDocuments = i;
    }
    /**
     * HACK: Views require RemoteEvents in order to determine whether the view is
     * CURRENT, but secondary tabs don't receive remote events. So this method is
     * used to create a synthesized RemoteEvent that can be used to apply a
     * CURRENT status change to a View, for queries executed in a different tab.
     */
    // PORTING NOTE: Multi-tab only
    static createSynthesizedRemoteEventForCurrentChange(e, t, n) {
        const r = new Map;
        return r.set(e, TargetChange.createSynthesizedTargetChangeForCurrentChange(e, t, n)), 
        new RemoteEvent(SnapshotVersion.min(), r, new SortedMap(__PRIVATE_primitiveComparator), __PRIVATE_mutableDocumentMap(), __PRIVATE_documentKeySet());
    }
}

/**
 * A TargetChange specifies the set of changes for a specific target as part of
 * a RemoteEvent. These changes track which documents are added, modified or
 * removed, as well as the target's resume token and whether the target is
 * marked CURRENT.
 * The actual changes *to* documents are not part of the TargetChange since
 * documents may be part of multiple targets.
 */ class TargetChange {
    constructor(
    /**
     * An opaque, server-assigned token that allows watching a query to be resumed
     * after disconnecting without retransmitting all the data that matches the
     * query. The resume token essentially identifies a point in time from which
     * the server should resume sending results.
     */
    e, 
    /**
     * The "current" (synced) status of this target. Note that "current"
     * has special meaning in the RPC protocol that implies that a target is
     * both up-to-date and consistent with the rest of the watch stream.
     */
    t, 
    /**
     * The set of documents that were newly assigned to this target as part of
     * this remote event.
     */
    n, 
    /**
     * The set of documents that were already assigned to this target but received
     * an update during this remote event.
     */
    r, 
    /**
     * The set of documents that were removed from this target as part of this
     * remote event.
     */
    i) {
        this.resumeToken = e, this.current = t, this.addedDocuments = n, this.modifiedDocuments = r, 
        this.removedDocuments = i;
    }
    /**
     * This method is used to create a synthesized TargetChanges that can be used to
     * apply a CURRENT status change to a View (for queries executed in a different
     * tab) or for new queries (to raise snapshots with correct CURRENT status).
     */    static createSynthesizedTargetChangeForCurrentChange(e, t, n) {
        return new TargetChange(n, t, __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet());
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
 * Represents a changed document and a list of target ids to which this change
 * applies.
 *
 * If document has been deleted NoDocument will be provided.
 */ class __PRIVATE_DocumentWatchChange {
    constructor(
    /** The new document applies to all of these targets. */
    e, 
    /** The new document is removed from all of these targets. */
    t, 
    /** The key of the document for this change. */
    n, 
    /**
     * The new document or NoDocument if it was deleted. Is null if the
     * document went out of view without the server sending a new document.
     */
    r) {
        this.Ve = e, this.removedTargetIds = t, this.key = n, this.me = r;
    }
}

class __PRIVATE_ExistenceFilterChange {
    constructor(e, t) {
        this.targetId = e, this.fe = t;
    }
}

class __PRIVATE_WatchTargetChange {
    constructor(
    /** What kind of change occurred to the watch target. */
    e, 
    /** The target IDs that were added/removed/set. */
    t, 
    /**
     * An opaque, server-assigned token that allows watching a target to be
     * resumed after disconnecting without retransmitting all the data that
     * matches the target. The resume token essentially identifies a point in
     * time from which the server should resume sending results.
     */
    n = ByteString.EMPTY_BYTE_STRING
    /** An RPC error indicating why the watch failed. */ , r = null) {
        this.state = e, this.targetIds = t, this.resumeToken = n, this.cause = r;
    }
}

/** Tracks the internal state of a Watch target. */ class __PRIVATE_TargetState {
    constructor() {
        /**
         * The number of pending responses (adds or removes) that we are waiting on.
         * We only consider targets active that have no pending responses.
         */
        this.ge = 0, 
        /**
         * Keeps track of the document changes since the last raised snapshot.
         *
         * These changes are continuously updated as we receive document updates and
         * always reflect the current set of changes against the last issued snapshot.
         */
        this.pe = __PRIVATE_snapshotChangesMap(), 
        /** See public getters for explanations of these fields. */
        this.ye = ByteString.EMPTY_BYTE_STRING, this.we = !1, 
        /**
         * Whether this target state should be included in the next snapshot. We
         * initialize to true so that newly-added targets are included in the next
         * RemoteEvent.
         */
        this.Se = !0;
    }
    /**
     * Whether this target has been marked 'current'.
     *
     * 'Current' has special meaning in the RPC protocol: It implies that the
     * Watch backend has sent us all changes up to the point at which the target
     * was added and that the target is consistent with the rest of the watch
     * stream.
     */    get current() {
        return this.we;
    }
    /** The last resume token sent to us for this target. */    get resumeToken() {
        return this.ye;
    }
    /** Whether this target has pending target adds or target removes. */    get be() {
        return 0 !== this.ge;
    }
    /** Whether we have modified any state that should trigger a snapshot. */    get De() {
        return this.Se;
    }
    /**
     * Applies the resume token to the TargetChange, but only when it has a new
     * value. Empty resumeTokens are discarded.
     */    Ce(e) {
        e.approximateByteSize() > 0 && (this.Se = !0, this.ye = e);
    }
    /**
     * Creates a target change from the current set of changes.
     *
     * To reset the document changes after raising this snapshot, call
     * `clearPendingChanges()`.
     */    ve() {
        let e = __PRIVATE_documentKeySet(), t = __PRIVATE_documentKeySet(), n = __PRIVATE_documentKeySet();
        return this.pe.forEach(((r, i) => {
            switch (i) {
              case 0 /* ChangeType.Added */ :
                e = e.add(r);
                break;

              case 2 /* ChangeType.Modified */ :
                t = t.add(r);
                break;

              case 1 /* ChangeType.Removed */ :
                n = n.add(r);
                break;

              default:
                fail();
            }
        })), new TargetChange(this.ye, this.we, e, t, n);
    }
    /**
     * Resets the document changes and sets `hasPendingChanges` to false.
     */    Fe() {
        this.Se = !1, this.pe = __PRIVATE_snapshotChangesMap();
    }
    Me(e, t) {
        this.Se = !0, this.pe = this.pe.insert(e, t);
    }
    xe(e) {
        this.Se = !0, this.pe = this.pe.remove(e);
    }
    Oe() {
        this.ge += 1;
    }
    Ne() {
        this.ge -= 1, __PRIVATE_hardAssert(this.ge >= 0);
    }
    Be() {
        this.Se = !0, this.we = !0;
    }
}

/**
 * A helper class to accumulate watch changes into a RemoteEvent.
 */
class __PRIVATE_WatchChangeAggregator {
    constructor(e) {
        this.Le = e, 
        /** The internal state of all tracked targets. */
        this.ke = new Map, 
        /** Keeps track of the documents to update since the last raised snapshot. */
        this.qe = __PRIVATE_mutableDocumentMap(), 
        /** A mapping of document keys to their set of target IDs. */
        this.Qe = __PRIVATE_documentTargetMap(), 
        /**
         * A map of targets with existence filter mismatches. These targets are
         * known to be inconsistent and their listens needs to be re-established by
         * RemoteStore.
         */
        this.Ke = new SortedMap(__PRIVATE_primitiveComparator);
    }
    /**
     * Processes and adds the DocumentWatchChange to the current set of changes.
     */    $e(e) {
        for (const t of e.Ve) e.me && e.me.isFoundDocument() ? this.Ue(t, e.me) : this.We(t, e.key, e.me);
        for (const t of e.removedTargetIds) this.We(t, e.key, e.me);
    }
    /** Processes and adds the WatchTargetChange to the current set of changes. */    Ge(e) {
        this.forEachTarget(e, (t => {
            const n = this.ze(t);
            switch (e.state) {
              case 0 /* WatchTargetChangeState.NoChange */ :
                this.je(t) && n.Ce(e.resumeToken);
                break;

              case 1 /* WatchTargetChangeState.Added */ :
                // We need to decrement the number of pending acks needed from watch
                // for this targetId.
                n.Ne(), n.be || 
                // We have a freshly added target, so we need to reset any state
                // that we had previously. This can happen e.g. when remove and add
                // back a target for existence filter mismatches.
                n.Fe(), n.Ce(e.resumeToken);
                break;

              case 2 /* WatchTargetChangeState.Removed */ :
                // We need to keep track of removed targets to we can post-filter and
                // remove any target changes.
                // We need to decrement the number of pending acks needed from watch
                // for this targetId.
                n.Ne(), n.be || this.removeTarget(t);
                break;

              case 3 /* WatchTargetChangeState.Current */ :
                this.je(t) && (n.Be(), n.Ce(e.resumeToken));
                break;

              case 4 /* WatchTargetChangeState.Reset */ :
                this.je(t) && (
                // Reset the target and synthesizes removes for all existing
                // documents. The backend will re-add any documents that still
                // match the target before it sends the next global snapshot.
                this.He(t), n.Ce(e.resumeToken));
                break;

              default:
                fail();
            }
        }));
    }
    /**
     * Iterates over all targetIds that the watch change applies to: either the
     * targetIds explicitly listed in the change or the targetIds of all currently
     * active targets.
     */    forEachTarget(e, t) {
        e.targetIds.length > 0 ? e.targetIds.forEach(t) : this.ke.forEach(((e, n) => {
            this.je(n) && t(n);
        }));
    }
    /**
     * Handles existence filters and synthesizes deletes for filter mismatches.
     * Targets that are invalidated by filter mismatches are added to
     * `pendingTargetResets`.
     */    Je(e) {
        const t = e.targetId, n = e.fe.count, r = this.Ye(t);
        if (r) {
            const i = r.target;
            if (__PRIVATE_targetIsDocumentTarget(i)) if (0 === n) {
                // The existence filter told us the document does not exist. We deduce
                // that this document does not exist and apply a deleted document to
                // our updates. Without applying this deleted document there might be
                // another query that will raise this document as part of a snapshot
                // until it is resolved, essentially exposing inconsistency between
                // queries.
                const e = new DocumentKey(i.path);
                this.We(t, e, MutableDocument.newNoDocument(e, SnapshotVersion.min()));
            } else __PRIVATE_hardAssert(1 === n); else {
                const r = this.Ze(t);
                // Existence filter mismatch. Mark the documents as being in limbo, and
                // raise a snapshot with `isFromCache:true`.
                                if (r !== n) {
                    // Apply bloom filter to identify and mark removed documents.
                    const n = this.Xe(e), i = n ? this.et(n, e, r) : 1 /* BloomFilterApplicationStatus.Skipped */;
                    if (0 /* BloomFilterApplicationStatus.Success */ !== i) {
                        // If bloom filter application fails, we reset the mapping and
                        // trigger re-run of the query.
                        this.He(t);
                        const e = 2 /* BloomFilterApplicationStatus.FalsePositive */ === i ? "TargetPurposeExistenceFilterMismatchBloom" /* TargetPurpose.ExistenceFilterMismatchBloom */ : "TargetPurposeExistenceFilterMismatch" /* TargetPurpose.ExistenceFilterMismatch */;
                        this.Ke = this.Ke.insert(t, e);
                    }
                    null == he || he.tt(function __PRIVATE_createExistenceFilterMismatchInfoForTestingHooks(e, t, n, r, i) {
                        var s, o, _, a, u, c;
                        const l = {
                            localCacheCount: e,
                            existenceFilterCount: t.count,
                            databaseId: n.database,
                            projectId: n.projectId
                        }, h = t.unchangedNames;
                        h && (l.bloomFilter = {
                            applied: 0 /* BloomFilterApplicationStatus.Success */ === i,
                            hashCount: null !== (s = null == h ? void 0 : h.hashCount) && void 0 !== s ? s : 0,
                            bitmapLength: null !== (a = null === (_ = null === (o = null == h ? void 0 : h.bits) || void 0 === o ? void 0 : o.bitmap) || void 0 === _ ? void 0 : _.length) && void 0 !== a ? a : 0,
                            padding: null !== (c = null === (u = null == h ? void 0 : h.bits) || void 0 === u ? void 0 : u.padding) && void 0 !== c ? c : 0,
                            mightContain: e => {
                                var t;
                                return null !== (t = null == r ? void 0 : r.mightContain(e)) && void 0 !== t && t;
                            }
                        });
                        return l;
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
 */ (r, e.fe, this.Le.nt(), n, i));
                }
            }
        }
    }
    /**
     * Parse the bloom filter from the "unchanged_names" field of an existence
     * filter.
     */    Xe(e) {
        const t = e.fe.unchangedNames;
        if (!t || !t.bits) return null;
        const {bits: {bitmap: n = "", padding: r = 0}, hashCount: i = 0} = t;
        let s, o;
        try {
            s = __PRIVATE_normalizeByteString(n).toUint8Array();
        } catch (e) {
            if (e instanceof __PRIVATE_Base64DecodeError) return __PRIVATE_logWarn("Decoding the base64 bloom filter in existence filter failed (" + e.message + "); ignoring the bloom filter and falling back to full re-query."), 
            null;
            throw e;
        }
        try {
            // BloomFilter throws error if the inputs are invalid.
            o = new BloomFilter(s, r, i);
        } catch (e) {
            return __PRIVATE_logWarn(e instanceof __PRIVATE_BloomFilterError ? "BloomFilter error: " : "Applying bloom filter failed: ", e), 
            null;
        }
        return 0 === o.Te ? null : o;
    }
    /**
     * Apply bloom filter to remove the deleted documents, and return the
     * application status.
     */    et(e, t, n) {
        return t.fe.count === n - this.rt(e, t.targetId) ? 0 /* BloomFilterApplicationStatus.Success */ : 2 /* BloomFilterApplicationStatus.FalsePositive */;
    }
    /**
     * Filter out removed documents based on bloom filter membership result and
     * return number of documents removed.
     */    rt(e, t) {
        const n = this.Le.getRemoteKeysForTarget(t);
        let r = 0;
        return n.forEach((n => {
            const i = this.Le.nt(), s = `projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;
            e.mightContain(s) || (this.We(t, n, /*updatedDocument=*/ null), r++);
        })), r;
    }
    /**
     * Converts the currently accumulated state into a remote event at the
     * provided snapshot version. Resets the accumulated changes before returning.
     */    it(e) {
        const t = new Map;
        this.ke.forEach(((n, r) => {
            const i = this.Ye(r);
            if (i) {
                if (n.current && __PRIVATE_targetIsDocumentTarget(i.target)) {
                    // Document queries for document that don't exist can produce an empty
                    // result set. To update our local cache, we synthesize a document
                    // delete if we have not previously received the document. This
                    // resolves the limbo state of the document, removing it from
                    // limboDocumentRefs.
                    // TODO(dimond): Ideally we would have an explicit lookup target
                    // instead resulting in an explicit delete message and we could
                    // remove this special logic.
                    const t = new DocumentKey(i.target.path);
                    null !== this.qe.get(t) || this.st(r, t) || this.We(r, t, MutableDocument.newNoDocument(t, e));
                }
                n.De && (t.set(r, n.ve()), n.Fe());
            }
        }));
        let n = __PRIVATE_documentKeySet();
        // We extract the set of limbo-only document updates as the GC logic
        // special-cases documents that do not appear in the target cache.
        
        // TODO(gsoltis): Expand on this comment once GC is available in the JS
        // client.
                this.Qe.forEach(((e, t) => {
            let r = !0;
            t.forEachWhile((e => {
                const t = this.Ye(e);
                return !t || "TargetPurposeLimboResolution" /* TargetPurpose.LimboResolution */ === t.purpose || (r = !1, 
                !1);
            })), r && (n = n.add(e));
        })), this.qe.forEach(((t, n) => n.setReadTime(e)));
        const r = new RemoteEvent(e, t, this.Ke, this.qe, n);
        return this.qe = __PRIVATE_mutableDocumentMap(), this.Qe = __PRIVATE_documentTargetMap(), 
        this.Ke = new SortedMap(__PRIVATE_primitiveComparator), r;
    }
    /**
     * Adds the provided document to the internal list of document updates and
     * its document key to the given target's mapping.
     */
    // Visible for testing.
    Ue(e, t) {
        if (!this.je(e)) return;
        const n = this.st(e, t.key) ? 2 /* ChangeType.Modified */ : 0 /* ChangeType.Added */;
        this.ze(e).Me(t.key, n), this.qe = this.qe.insert(t.key, t), this.Qe = this.Qe.insert(t.key, this.ot(t.key).add(e));
    }
    /**
     * Removes the provided document from the target mapping. If the
     * document no longer matches the target, but the document's state is still
     * known (e.g. we know that the document was deleted or we received the change
     * that caused the filter mismatch), the new document can be provided
     * to update the remote document cache.
     */
    // Visible for testing.
    We(e, t, n) {
        if (!this.je(e)) return;
        const r = this.ze(e);
        this.st(e, t) ? r.Me(t, 1 /* ChangeType.Removed */) : 
        // The document may have entered and left the target before we raised a
        // snapshot, so we can just ignore the change.
        r.xe(t), this.Qe = this.Qe.insert(t, this.ot(t).delete(e)), n && (this.qe = this.qe.insert(t, n));
    }
    removeTarget(e) {
        this.ke.delete(e);
    }
    /**
     * Returns the current count of documents in the target. This includes both
     * the number of documents that the LocalStore considers to be part of the
     * target as well as any accumulated changes.
     */    Ze(e) {
        const t = this.ze(e).ve();
        return this.Le.getRemoteKeysForTarget(e).size + t.addedDocuments.size - t.removedDocuments.size;
    }
    /**
     * Increment the number of acks needed from watch before we can consider the
     * server to be 'in-sync' with the client's active targets.
     */    Oe(e) {
        this.ze(e).Oe();
    }
    ze(e) {
        let t = this.ke.get(e);
        return t || (t = new __PRIVATE_TargetState, this.ke.set(e, t)), t;
    }
    ot(e) {
        let t = this.Qe.get(e);
        return t || (t = new SortedSet(__PRIVATE_primitiveComparator), this.Qe = this.Qe.insert(e, t)), 
        t;
    }
    /**
     * Verifies that the user is still interested in this target (by calling
     * `getTargetDataForTarget()`) and that we are not waiting for pending ADDs
     * from watch.
     */    je(e) {
        const t = null !== this.Ye(e);
        return t || __PRIVATE_logDebug("WatchChangeAggregator", "Detected inactive target", e), 
        t;
    }
    /**
     * Returns the TargetData for an active target (i.e. a target that the user
     * is still interested in that has no outstanding target change requests).
     */    Ye(e) {
        const t = this.ke.get(e);
        return t && t.be ? null : this.Le._t(e);
    }
    /**
     * Resets the state of a Watch target to its initial state (e.g. sets
     * 'current' to false, clears the resume token and removes its target mapping
     * from all documents).
     */    He(e) {
        this.ke.set(e, new __PRIVATE_TargetState);
        this.Le.getRemoteKeysForTarget(e).forEach((t => {
            this.We(e, t, /*updatedDocument=*/ null);
        }));
    }
    /**
     * Returns whether the LocalStore considers the document to be part of the
     * specified target.
     */    st(e, t) {
        return this.Le.getRemoteKeysForTarget(e).has(t);
    }
}

function __PRIVATE_documentTargetMap() {
    return new SortedMap(DocumentKey.comparator);
}

function __PRIVATE_snapshotChangesMap() {
    return new SortedMap(DocumentKey.comparator);
}

const Ie = (() => {
    const e = {
        asc: "ASCENDING",
        desc: "DESCENDING"
    };
    return e;
})(), Te = (() => {
    const e = {
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
    return e;
})(), Ee = (() => {
    const e = {
        and: "AND",
        or: "OR"
    };
    return e;
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
    constructor(e, t) {
        this.databaseId = e, this.useProto3Json = t;
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
function __PRIVATE_toInt32Proto(e, t) {
    return e.useProto3Json || __PRIVATE_isNullOrUndefined(t) ? t : {
        value: t
    };
}

/**
 * Returns a number (or null) from a google.protobuf.Int32Value proto.
 */
/**
 * Returns a value for a Date that's appropriate to put into a proto.
 */
function toTimestamp(e, t) {
    if (e.useProto3Json) {
        return `${new Date(1e3 * t.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`;
    }
    return {
        seconds: "" + t.seconds,
        nanos: t.nanoseconds
    };
}

/**
 * Returns a value for bytes that's appropriate to put in a proto.
 *
 * Visible for testing.
 */
function __PRIVATE_toBytes(e, t) {
    return e.useProto3Json ? t.toBase64() : t.toUint8Array();
}

/**
 * Returns a ByteString based on the proto string value.
 */ function __PRIVATE_toVersion(e, t) {
    return toTimestamp(e, t.toTimestamp());
}

function __PRIVATE_fromVersion(e) {
    return __PRIVATE_hardAssert(!!e), SnapshotVersion.fromTimestamp(function fromTimestamp(e) {
        const t = __PRIVATE_normalizeTimestamp(e);
        return new Timestamp(t.seconds, t.nanos);
    }(e));
}

function __PRIVATE_toResourceName(e, t) {
    return function __PRIVATE_fullyQualifiedPrefixPath(e) {
        return new ResourcePath([ "projects", e.projectId, "databases", e.database ]);
    }(e).child("documents").child(t).canonicalString();
}

function __PRIVATE_fromResourceName(e) {
    const t = ResourcePath.fromString(e);
    return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t)), t;
}

function __PRIVATE_toName(e, t) {
    return __PRIVATE_toResourceName(e.databaseId, t.path);
}

function fromName(e, t) {
    const n = __PRIVATE_fromResourceName(t);
    if (n.get(1) !== e.databaseId.projectId) throw new FirestoreError(v.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + e.databaseId.projectId);
    if (n.get(3) !== e.databaseId.database) throw new FirestoreError(v.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + e.databaseId.database);
    return new DocumentKey(__PRIVATE_extractLocalPathFromResourceName(n));
}

function __PRIVATE_toQueryPath(e, t) {
    return __PRIVATE_toResourceName(e.databaseId, t);
}

function __PRIVATE_fromQueryPath(e) {
    const t = __PRIVATE_fromResourceName(e);
    // In v1beta1 queries for collections at the root did not have a trailing
    // "/documents". In v1 all resource paths contain "/documents". Preserve the
    // ability to read the v1beta1 form for compatibility with queries persisted
    // in the local target cache.
        return 4 === t.length ? ResourcePath.emptyPath() : __PRIVATE_extractLocalPathFromResourceName(t);
}

function __PRIVATE_getEncodedDatabaseId(e) {
    return new ResourcePath([ "projects", e.databaseId.projectId, "databases", e.databaseId.database ]).canonicalString();
}

function __PRIVATE_extractLocalPathFromResourceName(e) {
    return __PRIVATE_hardAssert(e.length > 4 && "documents" === e.get(4)), e.popFirst(5);
}

/** Creates a Document proto from key and fields (but no create/update time) */ function __PRIVATE_toMutationDocument(e, t, n) {
    return {
        name: __PRIVATE_toName(e, t),
        fields: n.value.mapValue.fields
    };
}

function __PRIVATE_fromDocument(e, t, n) {
    const r = fromName(e, t.name), i = __PRIVATE_fromVersion(t.updateTime), s = t.createTime ? __PRIVATE_fromVersion(t.createTime) : SnapshotVersion.min(), o = new ObjectValue({
        mapValue: {
            fields: t.fields
        }
    }), _ = MutableDocument.newFoundDocument(r, i, s, o);
    return n && _.setHasCommittedMutations(), n ? _.setHasCommittedMutations() : _;
}

function __PRIVATE_fromBatchGetDocumentsResponse(e, t) {
    return "found" in t ? function __PRIVATE_fromFound(e, t) {
        __PRIVATE_hardAssert(!!t.found), t.found.name, t.found.updateTime;
        const n = fromName(e, t.found.name), r = __PRIVATE_fromVersion(t.found.updateTime), i = t.found.createTime ? __PRIVATE_fromVersion(t.found.createTime) : SnapshotVersion.min(), s = new ObjectValue({
            mapValue: {
                fields: t.found.fields
            }
        });
        return MutableDocument.newFoundDocument(n, r, i, s);
    }(e, t) : "missing" in t ? function __PRIVATE_fromMissing(e, t) {
        __PRIVATE_hardAssert(!!t.missing), __PRIVATE_hardAssert(!!t.readTime);
        const n = fromName(e, t.missing), r = __PRIVATE_fromVersion(t.readTime);
        return MutableDocument.newNoDocument(n, r);
    }(e, t) : fail();
}

function __PRIVATE_fromWatchChange(e, t) {
    let n;
    if ("targetChange" in t) {
        t.targetChange;
        // proto3 default value is unset in JSON (undefined), so use 'NO_CHANGE'
        // if unset
        const r = function __PRIVATE_fromWatchTargetChangeState(e) {
            return "NO_CHANGE" === e ? 0 /* WatchTargetChangeState.NoChange */ : "ADD" === e ? 1 /* WatchTargetChangeState.Added */ : "REMOVE" === e ? 2 /* WatchTargetChangeState.Removed */ : "CURRENT" === e ? 3 /* WatchTargetChangeState.Current */ : "RESET" === e ? 4 /* WatchTargetChangeState.Reset */ : fail();
        }(t.targetChange.targetChangeType || "NO_CHANGE"), i = t.targetChange.targetIds || [], s = function __PRIVATE_fromBytes(e, t) {
            return e.useProto3Json ? (__PRIVATE_hardAssert(void 0 === t || "string" == typeof t), 
            ByteString.fromBase64String(t || "")) : (__PRIVATE_hardAssert(void 0 === t || t instanceof Uint8Array), 
            ByteString.fromUint8Array(t || new Uint8Array));
        }(e, t.targetChange.resumeToken), o = t.targetChange.cause, _ = o && function __PRIVATE_fromRpcStatus(e) {
            const t = void 0 === e.code ? v.UNKNOWN : __PRIVATE_mapCodeFromRpcCode(e.code);
            return new FirestoreError(t, e.message || "");
        }(o);
        n = new __PRIVATE_WatchTargetChange(r, i, s, _ || null);
    } else if ("documentChange" in t) {
        t.documentChange;
        const r = t.documentChange;
        r.document, r.document.name, r.document.updateTime;
        const i = fromName(e, r.document.name), s = __PRIVATE_fromVersion(r.document.updateTime), o = r.document.createTime ? __PRIVATE_fromVersion(r.document.createTime) : SnapshotVersion.min(), _ = new ObjectValue({
            mapValue: {
                fields: r.document.fields
            }
        }), a = MutableDocument.newFoundDocument(i, s, o, _), u = r.targetIds || [], c = r.removedTargetIds || [];
        n = new __PRIVATE_DocumentWatchChange(u, c, a.key, a);
    } else if ("documentDelete" in t) {
        t.documentDelete;
        const r = t.documentDelete;
        r.document;
        const i = fromName(e, r.document), s = r.readTime ? __PRIVATE_fromVersion(r.readTime) : SnapshotVersion.min(), o = MutableDocument.newNoDocument(i, s), _ = r.removedTargetIds || [];
        n = new __PRIVATE_DocumentWatchChange([], _, o.key, o);
    } else if ("documentRemove" in t) {
        t.documentRemove;
        const r = t.documentRemove;
        r.document;
        const i = fromName(e, r.document), s = r.removedTargetIds || [];
        n = new __PRIVATE_DocumentWatchChange([], s, i, null);
    } else {
        if (!("filter" in t)) return fail();
        {
            t.filter;
            const e = t.filter;
            e.targetId;
            const {count: r = 0, unchangedNames: i} = e, s = new ExistenceFilter(r, i), o = e.targetId;
            n = new __PRIVATE_ExistenceFilterChange(o, s);
        }
    }
    return n;
}

function toMutation(e, t) {
    let n;
    if (t instanceof __PRIVATE_SetMutation) n = {
        update: __PRIVATE_toMutationDocument(e, t.key, t.value)
    }; else if (t instanceof __PRIVATE_DeleteMutation) n = {
        delete: __PRIVATE_toName(e, t.key)
    }; else if (t instanceof __PRIVATE_PatchMutation) n = {
        update: __PRIVATE_toMutationDocument(e, t.key, t.data),
        updateMask: __PRIVATE_toDocumentMask(t.fieldMask)
    }; else {
        if (!(t instanceof __PRIVATE_VerifyMutation)) return fail();
        n = {
            verify: __PRIVATE_toName(e, t.key)
        };
    }
    return t.fieldTransforms.length > 0 && (n.updateTransforms = t.fieldTransforms.map((e => function __PRIVATE_toFieldTransform(e, t) {
        const n = t.transform;
        if (n instanceof __PRIVATE_ServerTimestampTransform) return {
            fieldPath: t.field.canonicalString(),
            setToServerValue: "REQUEST_TIME"
        };
        if (n instanceof __PRIVATE_ArrayUnionTransformOperation) return {
            fieldPath: t.field.canonicalString(),
            appendMissingElements: {
                values: n.elements
            }
        };
        if (n instanceof __PRIVATE_ArrayRemoveTransformOperation) return {
            fieldPath: t.field.canonicalString(),
            removeAllFromArray: {
                values: n.elements
            }
        };
        if (n instanceof __PRIVATE_NumericIncrementTransformOperation) return {
            fieldPath: t.field.canonicalString(),
            increment: n.Ie
        };
        throw fail();
    }(0, e)))), t.precondition.isNone || (n.currentDocument = function __PRIVATE_toPrecondition(e, t) {
        return void 0 !== t.updateTime ? {
            updateTime: __PRIVATE_toVersion(e, t.updateTime)
        } : void 0 !== t.exists ? {
            exists: t.exists
        } : fail();
    }(e, t.precondition)), n;
}

function __PRIVATE_fromMutation(e, t) {
    const n = t.currentDocument ? function __PRIVATE_fromPrecondition(e) {
        return void 0 !== e.updateTime ? Precondition.updateTime(__PRIVATE_fromVersion(e.updateTime)) : void 0 !== e.exists ? Precondition.exists(e.exists) : Precondition.none();
    }(t.currentDocument) : Precondition.none(), r = t.updateTransforms ? t.updateTransforms.map((t => function __PRIVATE_fromFieldTransform(e, t) {
        let n = null;
        if ("setToServerValue" in t) __PRIVATE_hardAssert("REQUEST_TIME" === t.setToServerValue), 
        n = new __PRIVATE_ServerTimestampTransform; else if ("appendMissingElements" in t) {
            const e = t.appendMissingElements.values || [];
            n = new __PRIVATE_ArrayUnionTransformOperation(e);
        } else if ("removeAllFromArray" in t) {
            const e = t.removeAllFromArray.values || [];
            n = new __PRIVATE_ArrayRemoveTransformOperation(e);
        } else "increment" in t ? n = new __PRIVATE_NumericIncrementTransformOperation(e, t.increment) : fail();
        const r = FieldPath$1.fromServerFormat(t.fieldPath);
        return new FieldTransform(r, n);
    }(e, t))) : [];
    if (t.update) {
        t.update.name;
        const i = fromName(e, t.update.name), s = new ObjectValue({
            mapValue: {
                fields: t.update.fields
            }
        });
        if (t.updateMask) {
            const e = function __PRIVATE_fromDocumentMask(e) {
                const t = e.fieldPaths || [];
                return new FieldMask(t.map((e => FieldPath$1.fromServerFormat(e))));
            }(t.updateMask);
            return new __PRIVATE_PatchMutation(i, s, e, n, r);
        }
        return new __PRIVATE_SetMutation(i, s, n, r);
    }
    if (t.delete) {
        const r = fromName(e, t.delete);
        return new __PRIVATE_DeleteMutation(r, n);
    }
    if (t.verify) {
        const r = fromName(e, t.verify);
        return new __PRIVATE_VerifyMutation(r, n);
    }
    return fail();
}

function __PRIVATE_fromWriteResults(e, t) {
    return e && e.length > 0 ? (__PRIVATE_hardAssert(void 0 !== t), e.map((e => function __PRIVATE_fromWriteResult(e, t) {
        // NOTE: Deletes don't have an updateTime.
        let n = e.updateTime ? __PRIVATE_fromVersion(e.updateTime) : __PRIVATE_fromVersion(t);
        return n.isEqual(SnapshotVersion.min()) && (
        // The Firestore Emulator currently returns an update time of 0 for
        // deletes of non-existing documents (rather than null). This breaks the
        // test "get deleted doc while offline with source=cache" as NoDocuments
        // with version 0 are filtered by IndexedDb's RemoteDocumentCache.
        // TODO(#2149): Remove this when Emulator is fixed
        n = __PRIVATE_fromVersion(t)), new MutationResult(n, e.transformResults || []);
    }(e, t)))) : [];
}

function __PRIVATE_toDocumentsTarget(e, t) {
    return {
        documents: [ __PRIVATE_toQueryPath(e, t.path) ]
    };
}

function __PRIVATE_toQueryTarget(e, t) {
    // Dissect the path into parent, collectionId, and optional key filter.
    const n = {
        structuredQuery: {}
    }, r = t.path;
    null !== t.collectionGroup ? (n.parent = __PRIVATE_toQueryPath(e, r), n.structuredQuery.from = [ {
        collectionId: t.collectionGroup,
        allDescendants: !0
    } ]) : (n.parent = __PRIVATE_toQueryPath(e, r.popLast()), n.structuredQuery.from = [ {
        collectionId: r.lastSegment()
    } ]);
    const i = function __PRIVATE_toFilters(e) {
        if (0 === e.length) return;
        return __PRIVATE_toFilter(CompositeFilter.create(e, "and" /* CompositeOperator.AND */));
    }(t.filters);
    i && (n.structuredQuery.where = i);
    const s = function __PRIVATE_toOrder(e) {
        if (0 === e.length) return;
        return e.map((e => 
        // visible for testing
        function __PRIVATE_toPropertyOrder(e) {
            return {
                field: __PRIVATE_toFieldPathReference(e.field),
                direction: __PRIVATE_toDirection(e.dir)
            };
        }(e)));
    }(t.orderBy);
    s && (n.structuredQuery.orderBy = s);
    const o = __PRIVATE_toInt32Proto(e, t.limit);
    return null !== o && (n.structuredQuery.limit = o), t.startAt && (n.structuredQuery.startAt = function __PRIVATE_toStartAtCursor(e) {
        return {
            before: e.inclusive,
            values: e.position
        };
    }(t.startAt)), t.endAt && (n.structuredQuery.endAt = function __PRIVATE_toEndAtCursor(e) {
        return {
            before: !e.inclusive,
            values: e.position
        };
    }(t.endAt)), n;
}

function __PRIVATE_convertQueryTargetToQuery(e) {
    let t = __PRIVATE_fromQueryPath(e.parent);
    const n = e.structuredQuery, r = n.from ? n.from.length : 0;
    let i = null;
    if (r > 0) {
        __PRIVATE_hardAssert(1 === r);
        const e = n.from[0];
        e.allDescendants ? i = e.collectionId : t = t.child(e.collectionId);
    }
    let s = [];
    n.where && (s = function __PRIVATE_fromFilters(e) {
        const t = __PRIVATE_fromFilter(e);
        if (t instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(t)) return t.getFilters();
        return [ t ];
    }(n.where));
    let o = [];
    n.orderBy && (o = function __PRIVATE_fromOrder(e) {
        return e.map((e => function __PRIVATE_fromPropertyOrder(e) {
            return new OrderBy(__PRIVATE_fromFieldPathReference(e.field), 
            // visible for testing
            function __PRIVATE_fromDirection(e) {
                switch (e) {
                  case "ASCENDING":
                    return "asc" /* Direction.ASCENDING */;

                  case "DESCENDING":
                    return "desc" /* Direction.DESCENDING */;

                  default:
                    return;
                }
            }
            // visible for testing
            (e.direction));
        }
        // visible for testing
        (e)));
    }(n.orderBy));
    let _ = null;
    n.limit && (_ = function __PRIVATE_fromInt32Proto(e) {
        let t;
        return t = "object" == typeof e ? e.value : e, __PRIVATE_isNullOrUndefined(t) ? null : t;
    }(n.limit));
    let a = null;
    n.startAt && (a = function __PRIVATE_fromStartAtCursor(e) {
        const t = !!e.before, n = e.values || [];
        return new Bound(n, t);
    }(n.startAt));
    let u = null;
    return n.endAt && (u = function __PRIVATE_fromEndAtCursor(e) {
        const t = !e.before, n = e.values || [];
        return new Bound(n, t);
    }
    // visible for testing
    (n.endAt)), __PRIVATE_newQuery(t, i, o, s, _, "F" /* LimitType.First */ , a, u);
}

function __PRIVATE_toListenRequestLabels(e, t) {
    const n = function __PRIVATE_toLabel(e) {
        switch (e) {
          case "TargetPurposeListen" /* TargetPurpose.Listen */ :
            return null;

          case "TargetPurposeExistenceFilterMismatch" /* TargetPurpose.ExistenceFilterMismatch */ :
            return "existence-filter-mismatch";

          case "TargetPurposeExistenceFilterMismatchBloom" /* TargetPurpose.ExistenceFilterMismatchBloom */ :
            return "existence-filter-mismatch-bloom";

          case "TargetPurposeLimboResolution" /* TargetPurpose.LimboResolution */ :
            return "limbo-document";

          default:
            return fail();
        }
    }(t.purpose);
    return null == n ? null : {
        "goog-listen-tags": n
    };
}

function __PRIVATE_fromFilter(e) {
    return void 0 !== e.unaryFilter ? function __PRIVATE_fromUnaryFilter(e) {
        switch (e.unaryFilter.op) {
          case "IS_NAN":
            const t = __PRIVATE_fromFieldPathReference(e.unaryFilter.field);
            return FieldFilter.create(t, "==" /* Operator.EQUAL */ , {
                doubleValue: NaN
            });

          case "IS_NULL":
            const n = __PRIVATE_fromFieldPathReference(e.unaryFilter.field);
            return FieldFilter.create(n, "==" /* Operator.EQUAL */ , {
                nullValue: "NULL_VALUE"
            });

          case "IS_NOT_NAN":
            const r = __PRIVATE_fromFieldPathReference(e.unaryFilter.field);
            return FieldFilter.create(r, "!=" /* Operator.NOT_EQUAL */ , {
                doubleValue: NaN
            });

          case "IS_NOT_NULL":
            const i = __PRIVATE_fromFieldPathReference(e.unaryFilter.field);
            return FieldFilter.create(i, "!=" /* Operator.NOT_EQUAL */ , {
                nullValue: "NULL_VALUE"
            });

          default:
            return fail();
        }
    }(e) : void 0 !== e.fieldFilter ? function __PRIVATE_fromFieldFilter(e) {
        return FieldFilter.create(__PRIVATE_fromFieldPathReference(e.fieldFilter.field), function __PRIVATE_fromOperatorName(e) {
            switch (e) {
              case "EQUAL":
                return "==" /* Operator.EQUAL */;

              case "NOT_EQUAL":
                return "!=" /* Operator.NOT_EQUAL */;

              case "GREATER_THAN":
                return ">" /* Operator.GREATER_THAN */;

              case "GREATER_THAN_OR_EQUAL":
                return ">=" /* Operator.GREATER_THAN_OR_EQUAL */;

              case "LESS_THAN":
                return "<" /* Operator.LESS_THAN */;

              case "LESS_THAN_OR_EQUAL":
                return "<=" /* Operator.LESS_THAN_OR_EQUAL */;

              case "ARRAY_CONTAINS":
                return "array-contains" /* Operator.ARRAY_CONTAINS */;

              case "IN":
                return "in" /* Operator.IN */;

              case "NOT_IN":
                return "not-in" /* Operator.NOT_IN */;

              case "ARRAY_CONTAINS_ANY":
                return "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */;

              default:
                return fail();
            }
        }(e.fieldFilter.op), e.fieldFilter.value);
    }(e) : void 0 !== e.compositeFilter ? function __PRIVATE_fromCompositeFilter(e) {
        return CompositeFilter.create(e.compositeFilter.filters.map((e => __PRIVATE_fromFilter(e))), function __PRIVATE_fromCompositeOperatorName(e) {
            switch (e) {
              case "AND":
                return "and" /* CompositeOperator.AND */;

              case "OR":
                return "or" /* CompositeOperator.OR */;

              default:
                return fail();
            }
        }(e.compositeFilter.op));
    }(e) : fail();
}

function __PRIVATE_toDirection(e) {
    return Ie[e];
}

function __PRIVATE_toOperatorName(e) {
    return Te[e];
}

function __PRIVATE_toCompositeOperatorName(e) {
    return Ee[e];
}

function __PRIVATE_toFieldPathReference(e) {
    return {
        fieldPath: e.canonicalString()
    };
}

function __PRIVATE_fromFieldPathReference(e) {
    return FieldPath$1.fromServerFormat(e.fieldPath);
}

function __PRIVATE_toFilter(e) {
    return e instanceof FieldFilter ? function __PRIVATE_toUnaryOrFieldFilter(e) {
        if ("==" /* Operator.EQUAL */ === e.op) {
            if (__PRIVATE_isNanValue(e.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(e.field),
                    op: "IS_NAN"
                }
            };
            if (__PRIVATE_isNullValue(e.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(e.field),
                    op: "IS_NULL"
                }
            };
        } else if ("!=" /* Operator.NOT_EQUAL */ === e.op) {
            if (__PRIVATE_isNanValue(e.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(e.field),
                    op: "IS_NOT_NAN"
                }
            };
            if (__PRIVATE_isNullValue(e.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(e.field),
                    op: "IS_NOT_NULL"
                }
            };
        }
        return {
            fieldFilter: {
                field: __PRIVATE_toFieldPathReference(e.field),
                op: __PRIVATE_toOperatorName(e.op),
                value: e.value
            }
        };
    }(e) : e instanceof CompositeFilter ? function __PRIVATE_toCompositeFilter(e) {
        const t = e.getFilters().map((e => __PRIVATE_toFilter(e)));
        if (1 === t.length) return t[0];
        return {
            compositeFilter: {
                op: __PRIVATE_toCompositeOperatorName(e.op),
                filters: t
            }
        };
    }(e) : fail();
}

function __PRIVATE_toDocumentMask(e) {
    const t = [];
    return e.fields.forEach((e => t.push(e.canonicalString()))), {
        fieldPaths: t
    };
}

function __PRIVATE_isValidResourceName(e) {
    // Resource names have at least 4 components (project ID, database ID)
    return e.length >= 4 && "projects" === e.get(0) && "databases" === e.get(2);
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
 * An immutable set of metadata that the local store tracks for each target.
 */ class TargetData {
    constructor(
    /** The target being listened to. */
    e, 
    /**
     * The target ID to which the target corresponds; Assigned by the
     * LocalStore for user listens and by the SyncEngine for limbo watches.
     */
    t, 
    /** The purpose of the target. */
    n, 
    /**
     * The sequence number of the last transaction during which this target data
     * was modified.
     */
    r, 
    /** The latest snapshot version seen for this target. */
    i = SnapshotVersion.min()
    /**
     * The maximum snapshot version at which the associated view
     * contained no limbo documents.
     */ , s = SnapshotVersion.min()
    /**
     * An opaque, server-assigned token that allows watching a target to be
     * resumed after disconnecting without retransmitting all the data that
     * matches the target. The resume token essentially identifies a point in
     * time from which the server should resume sending results.
     */ , o = ByteString.EMPTY_BYTE_STRING
    /**
     * The number of documents that last matched the query at the resume token or
     * read time. Documents are counted only when making a listen request with
     * resume token or read time, otherwise, keep it null.
     */ , _ = null) {
        this.target = e, this.targetId = t, this.purpose = n, this.sequenceNumber = r, this.snapshotVersion = i, 
        this.lastLimboFreeSnapshotVersion = s, this.resumeToken = o, this.expectedCount = _;
    }
    /** Creates a new target data instance with an updated sequence number. */    withSequenceNumber(e) {
        return new TargetData(this.target, this.targetId, this.purpose, e, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
    }
    /**
     * Creates a new target data instance with an updated resume token and
     * snapshot version.
     */    withResumeToken(e, t) {
        return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, t, this.lastLimboFreeSnapshotVersion, e, 
        /* expectedCount= */ null);
    }
    /**
     * Creates a new target data instance with an updated expected count.
     */    withExpectedCount(e) {
        return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, e);
    }
    /**
     * Creates a new target data instance with an updated last limbo free
     * snapshot version number.
     */    withLastLimboFreeSnapshotVersion(e) {
        return new TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e, this.resumeToken, this.expectedCount);
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
/** Serializer for values stored in the LocalStore. */ class __PRIVATE_LocalSerializer {
    constructor(e) {
        this.ut = e;
    }
}

/** Decodes a remote document from storage locally to a Document. */ function __PRIVATE_fromDbRemoteDocument(e, t) {
    let n;
    if (t.document) n = __PRIVATE_fromDocument(e.ut, t.document, !!t.hasCommittedMutations); else if (t.noDocument) {
        const e = DocumentKey.fromSegments(t.noDocument.path), r = __PRIVATE_fromDbTimestamp(t.noDocument.readTime);
        n = MutableDocument.newNoDocument(e, r), t.hasCommittedMutations && n.setHasCommittedMutations();
    } else {
        if (!t.unknownDocument) return fail();
        {
            const e = DocumentKey.fromSegments(t.unknownDocument.path), r = __PRIVATE_fromDbTimestamp(t.unknownDocument.version);
            n = MutableDocument.newUnknownDocument(e, r);
        }
    }
    return t.readTime && n.setReadTime(function __PRIVATE_fromDbTimestampKey(e) {
        const t = new Timestamp(e[0], e[1]);
        return SnapshotVersion.fromTimestamp(t);
    }(t.readTime)), n;
}

/** Encodes a document for storage locally. */ function __PRIVATE_toDbRemoteDocument(e, t) {
    const n = t.key, r = {
        prefixPath: n.getCollectionPath().popLast().toArray(),
        collectionGroup: n.collectionGroup,
        documentId: n.path.lastSegment(),
        readTime: __PRIVATE_toDbTimestampKey(t.readTime),
        hasCommittedMutations: t.hasCommittedMutations
    };
    if (t.isFoundDocument()) r.document = function __PRIVATE_toDocument(e, t) {
        return {
            name: __PRIVATE_toName(e, t.key),
            fields: t.data.value.mapValue.fields,
            updateTime: toTimestamp(e, t.version.toTimestamp()),
            createTime: toTimestamp(e, t.createTime.toTimestamp())
        };
    }(e.ut, t); else if (t.isNoDocument()) r.noDocument = {
        path: n.path.toArray(),
        readTime: __PRIVATE_toDbTimestamp(t.version)
    }; else {
        if (!t.isUnknownDocument()) return fail();
        r.unknownDocument = {
            path: n.path.toArray(),
            version: __PRIVATE_toDbTimestamp(t.version)
        };
    }
    return r;
}

function __PRIVATE_toDbTimestampKey(e) {
    const t = e.toTimestamp();
    return [ t.seconds, t.nanoseconds ];
}

function __PRIVATE_toDbTimestamp(e) {
    const t = e.toTimestamp();
    return {
        seconds: t.seconds,
        nanoseconds: t.nanoseconds
    };
}

function __PRIVATE_fromDbTimestamp(e) {
    const t = new Timestamp(e.seconds, e.nanoseconds);
    return SnapshotVersion.fromTimestamp(t);
}

/** Encodes a batch of mutations into a DbMutationBatch for local storage. */
/** Decodes a DbMutationBatch into a MutationBatch */
function __PRIVATE_fromDbMutationBatch(e, t) {
    const n = (t.baseMutations || []).map((t => __PRIVATE_fromMutation(e.ut, t)));
    // Squash old transform mutations into existing patch or set mutations.
    // The replacement of representing `transforms` with `update_transforms`
    // on the SDK means that old `transform` mutations stored in IndexedDB need
    // to be updated to `update_transforms`.
    // TODO(b/174608374): Remove this code once we perform a schema migration.
        for (let e = 0; e < t.mutations.length - 1; ++e) {
        const n = t.mutations[e];
        if (e + 1 < t.mutations.length && void 0 !== t.mutations[e + 1].transform) {
            const r = t.mutations[e + 1];
            n.updateTransforms = r.transform.fieldTransforms, t.mutations.splice(e + 1, 1), 
            ++e;
        }
    }
    const r = t.mutations.map((t => __PRIVATE_fromMutation(e.ut, t))), i = Timestamp.fromMillis(t.localWriteTimeMs);
    return new MutationBatch(t.batchId, i, n, r);
}

/** Decodes a DbTarget into TargetData */ function __PRIVATE_fromDbTarget(e) {
    const t = __PRIVATE_fromDbTimestamp(e.readTime), n = void 0 !== e.lastLimboFreeSnapshotVersion ? __PRIVATE_fromDbTimestamp(e.lastLimboFreeSnapshotVersion) : SnapshotVersion.min();
    let r;
    return r = 
    /**
 * A helper function for figuring out what kind of query has been stored.
 */
    function __PRIVATE_isDocumentQuery(e) {
        return void 0 !== e.documents;
    }
    /** Encodes a DbBundle to a BundleMetadata object. */ (e.query) ? function __PRIVATE_fromDocumentsTarget(e) {
        return __PRIVATE_hardAssert(1 === e.documents.length), __PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(__PRIVATE_fromQueryPath(e.documents[0])));
    }(e.query) : function __PRIVATE_fromQueryTarget(e) {
        return __PRIVATE_queryToTarget(__PRIVATE_convertQueryTargetToQuery(e));
    }(e.query), new TargetData(r, e.targetId, "TargetPurposeListen" /* TargetPurpose.Listen */ , e.lastListenSequenceNumber, t, n, ByteString.fromBase64String(e.resumeToken));
}

/** Encodes TargetData into a DbTarget for storage locally. */ function __PRIVATE_toDbTarget(e, t) {
    const n = __PRIVATE_toDbTimestamp(t.snapshotVersion), r = __PRIVATE_toDbTimestamp(t.lastLimboFreeSnapshotVersion);
    let i;
    i = __PRIVATE_targetIsDocumentTarget(t.target) ? __PRIVATE_toDocumentsTarget(e.ut, t.target) : __PRIVATE_toQueryTarget(e.ut, t.target);
    // We can't store the resumeToken as a ByteString in IndexedDb, so we
    // convert it to a base64 string for storage.
        const s = t.resumeToken.toBase64();
    // lastListenSequenceNumber is always 0 until we do real GC.
        return {
        targetId: t.targetId,
        canonicalId: __PRIVATE_canonifyTarget(t.target),
        readTime: n,
        resumeToken: s,
        lastListenSequenceNumber: t.sequenceNumber,
        lastLimboFreeSnapshotVersion: r,
        query: i
    };
}

/**
 * Encodes a `BundledQuery` from bundle proto to a Query object.
 *
 * This reconstructs the original query used to build the bundle being loaded,
 * including features exists only in SDKs (for example: limit-to-last).
 */
function __PRIVATE_fromBundledQuery(e) {
    const t = __PRIVATE_convertQueryTargetToQuery({
        parent: e.parent,
        structuredQuery: e.structuredQuery
    });
    return "LAST" === e.limitType ? __PRIVATE_queryWithLimit(t, t.limit, "L" /* LimitType.Last */) : t;
}

/** Encodes a NamedQuery proto object to a NamedQuery model object. */
/** Encodes a DbDocumentOverlay object to an Overlay model object. */
function __PRIVATE_fromDbDocumentOverlay(e, t) {
    return new Overlay(t.largestBatchId, __PRIVATE_fromMutation(e.ut, t.overlayMutation));
}

/** Decodes an Overlay model object into a DbDocumentOverlay object. */
/**
 * Returns the DbDocumentOverlayKey corresponding to the given user and
 * document key.
 */
function __PRIVATE_toDbDocumentOverlayKey(e, t) {
    const n = t.path.lastSegment();
    return [ e, __PRIVATE_encodeResourcePath(t.path.popLast()), n ];
}

function __PRIVATE_toDbIndexState(e, t, n, r) {
    return {
        indexId: e,
        uid: t.uid || "",
        sequenceNumber: n,
        readTime: __PRIVATE_toDbTimestamp(r.readTime),
        documentKey: __PRIVATE_encodeResourcePath(r.documentKey.path),
        largestBatchId: r.largestBatchId
    };
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
 */ class __PRIVATE_IndexedDbBundleCache {
    getBundleMetadata(e, t) {
        return __PRIVATE_bundlesStore(e).get(t).next((e => {
            if (e) return function __PRIVATE_fromDbBundle(e) {
                return {
                    id: e.bundleId,
                    createTime: __PRIVATE_fromDbTimestamp(e.createTime),
                    version: e.version
                };
            }
            /** Encodes a BundleMetadata to a DbBundle. */ (e);
        }));
    }
    saveBundleMetadata(e, t) {
        return __PRIVATE_bundlesStore(e).put(function __PRIVATE_toDbBundle(e) {
            return {
                bundleId: e.id,
                createTime: __PRIVATE_toDbTimestamp(__PRIVATE_fromVersion(e.createTime)),
                version: e.version
            };
        }
        /** Encodes a DbNamedQuery to a NamedQuery. */ (t));
    }
    getNamedQuery(e, t) {
        return __PRIVATE_namedQueriesStore(e).get(t).next((e => {
            if (e) return function __PRIVATE_fromDbNamedQuery(e) {
                return {
                    name: e.name,
                    query: __PRIVATE_fromBundledQuery(e.bundledQuery),
                    readTime: __PRIVATE_fromDbTimestamp(e.readTime)
                };
            }
            /** Encodes a NamedQuery from a bundle proto to a DbNamedQuery. */ (e);
        }));
    }
    saveNamedQuery(e, t) {
        return __PRIVATE_namedQueriesStore(e).put(function __PRIVATE_toDbNamedQuery(e) {
            return {
                name: e.name,
                readTime: __PRIVATE_toDbTimestamp(__PRIVATE_fromVersion(e.readTime)),
                bundledQuery: e.bundledQuery
            };
        }(t));
    }
}

/**
 * Helper to get a typed SimpleDbStore for the bundles object store.
 */ function __PRIVATE_bundlesStore(e) {
    return __PRIVATE_getStore(e, "bundles");
}

/**
 * Helper to get a typed SimpleDbStore for the namedQueries object store.
 */ function __PRIVATE_namedQueriesStore(e) {
    return __PRIVATE_getStore(e, "namedQueries");
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
 * Implementation of DocumentOverlayCache using IndexedDb.
 */ class __PRIVATE_IndexedDbDocumentOverlayCache {
    /**
     * @param serializer - The document serializer.
     * @param userId - The userId for which we are accessing overlays.
     */
    constructor(e, t) {
        this.serializer = e, this.userId = t;
    }
    static ct(e, t) {
        const n = t.uid || "";
        return new __PRIVATE_IndexedDbDocumentOverlayCache(e, n);
    }
    getOverlay(e, t) {
        return __PRIVATE_documentOverlayStore(e).get(__PRIVATE_toDbDocumentOverlayKey(this.userId, t)).next((e => e ? __PRIVATE_fromDbDocumentOverlay(this.serializer, e) : null));
    }
    getOverlays(e, t) {
        const n = __PRIVATE_newOverlayMap();
        return PersistencePromise.forEach(t, (t => this.getOverlay(e, t).next((e => {
            null !== e && n.set(t, e);
        })))).next((() => n));
    }
    saveOverlays(e, t, n) {
        const r = [];
        return n.forEach(((n, i) => {
            const s = new Overlay(t, i);
            r.push(this.lt(e, s));
        })), PersistencePromise.waitFor(r);
    }
    removeOverlaysForBatchId(e, t, n) {
        const r = new Set;
        // Get the set of unique collection paths.
                t.forEach((e => r.add(__PRIVATE_encodeResourcePath(e.getCollectionPath()))));
        const i = [];
        return r.forEach((t => {
            const r = IDBKeyRange.bound([ this.userId, t, n ], [ this.userId, t, n + 1 ], 
            /*lowerOpen=*/ !1, 
            /*upperOpen=*/ !0);
            i.push(__PRIVATE_documentOverlayStore(e).H("collectionPathOverlayIndex", r));
        })), PersistencePromise.waitFor(i);
    }
    getOverlaysForCollection(e, t, n) {
        const r = __PRIVATE_newOverlayMap(), i = __PRIVATE_encodeResourcePath(t), s = IDBKeyRange.bound([ this.userId, i, n ], [ this.userId, i, Number.POSITIVE_INFINITY ], 
        /*lowerOpen=*/ !0);
        return __PRIVATE_documentOverlayStore(e).W("collectionPathOverlayIndex", s).next((e => {
            for (const t of e) {
                const e = __PRIVATE_fromDbDocumentOverlay(this.serializer, t);
                r.set(e.getKey(), e);
            }
            return r;
        }));
    }
    getOverlaysForCollectionGroup(e, t, n, r) {
        const i = __PRIVATE_newOverlayMap();
        let s;
        // We want batch IDs larger than `sinceBatchId`, and so the lower bound
        // is not inclusive.
                const o = IDBKeyRange.bound([ this.userId, t, n ], [ this.userId, t, Number.POSITIVE_INFINITY ], 
        /*lowerOpen=*/ !0);
        return __PRIVATE_documentOverlayStore(e).Y({
            index: "collectionGroupOverlayIndex",
            range: o
        }, ((e, t, n) => {
            // We do not want to return partial batch overlays, even if the size
            // of the result set exceeds the given `count` argument. Therefore, we
            // continue to aggregate results even after the result size exceeds
            // `count` if there are more overlays from the `currentBatchId`.
            const o = __PRIVATE_fromDbDocumentOverlay(this.serializer, t);
            i.size() < r || o.largestBatchId === s ? (i.set(o.getKey(), o), s = o.largestBatchId) : n.done();
        })).next((() => i));
    }
    lt(e, t) {
        return __PRIVATE_documentOverlayStore(e).put(function __PRIVATE_toDbDocumentOverlay(e, t, n) {
            const [r, i, s] = __PRIVATE_toDbDocumentOverlayKey(t, n.mutation.key);
            return {
                userId: t,
                collectionPath: i,
                documentId: s,
                collectionGroup: n.mutation.key.getCollectionGroup(),
                largestBatchId: n.largestBatchId,
                overlayMutation: toMutation(e.ut, n.mutation)
            };
        }(this.serializer, this.userId, t));
    }
}

/**
 * Helper to get a typed SimpleDbStore for the document overlay object store.
 */ function __PRIVATE_documentOverlayStore(e) {
    return __PRIVATE_getStore(e, "documentOverlays");
}

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
// Note: This code is copied from the backend. Code that is not used by
// Firestore was removed.
/** Firestore index value writer.  */
class __PRIVATE_FirestoreIndexValueWriter {
    constructor() {}
    // The write methods below short-circuit writing terminators for values
    // containing a (terminating) truncated value.
    // As an example, consider the resulting encoding for:
    // ["bar", [2, "foo"]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TERM, TERM, TERM)
    // ["bar", [2, truncated("foo")]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TRUNC)
    // ["bar", truncated(["foo"])] -> (STRING, "bar", TERM, ARRAY. STRING, "foo", TERM, TRUNC)
    /** Writes an index value.  */
    ht(e, t) {
        this.Pt(e, t), 
        // Write separator to split index values
        // (see go/firestore-storage-format#encodings).
        t.It();
    }
    Pt(e, t) {
        if ("nullValue" in e) this.Tt(t, 5); else if ("booleanValue" in e) this.Tt(t, 10), 
        t.Et(e.booleanValue ? 1 : 0); else if ("integerValue" in e) this.Tt(t, 15), t.Et(__PRIVATE_normalizeNumber(e.integerValue)); else if ("doubleValue" in e) {
            const n = __PRIVATE_normalizeNumber(e.doubleValue);
            isNaN(n) ? this.Tt(t, 13) : (this.Tt(t, 15), __PRIVATE_isNegativeZero(n) ? 
            // -0.0, 0 and 0.0 are all considered the same
            t.Et(0) : t.Et(n));
        } else if ("timestampValue" in e) {
            const n = e.timestampValue;
            this.Tt(t, 20), "string" == typeof n ? t.dt(n) : (t.dt(`${n.seconds || ""}`), t.Et(n.nanos || 0));
        } else if ("stringValue" in e) this.At(e.stringValue, t), this.Rt(t); else if ("bytesValue" in e) this.Tt(t, 30), 
        t.Vt(__PRIVATE_normalizeByteString(e.bytesValue)), this.Rt(t); else if ("referenceValue" in e) this.ft(e.referenceValue, t); else if ("geoPointValue" in e) {
            const n = e.geoPointValue;
            this.Tt(t, 45), t.Et(n.latitude || 0), t.Et(n.longitude || 0);
        } else "mapValue" in e ? __PRIVATE_isMaxValue(e) ? this.Tt(t, Number.MAX_SAFE_INTEGER) : (this.gt(e.mapValue, t), 
        this.Rt(t)) : "arrayValue" in e ? (this.yt(e.arrayValue, t), this.Rt(t)) : fail();
    }
    At(e, t) {
        this.Tt(t, 25), this.wt(e, t);
    }
    wt(e, t) {
        t.dt(e);
    }
    gt(e, t) {
        const n = e.fields || {};
        this.Tt(t, 55);
        for (const e of Object.keys(n)) this.At(e, t), this.Pt(n[e], t);
    }
    yt(e, t) {
        const n = e.values || [];
        this.Tt(t, 50);
        for (const e of n) this.Pt(e, t);
    }
    ft(e, t) {
        this.Tt(t, 37);
        DocumentKey.fromName(e).path.forEach((e => {
            this.Tt(t, 60), this.wt(e, t);
        }));
    }
    Tt(e, t) {
        e.Et(t);
    }
    Rt(e) {
        // While the SDK does not implement truncation, the truncation marker is
        // used to terminate all variable length values (which are strings, bytes,
        // references, arrays and maps).
        e.Et(2);
    }
}

__PRIVATE_FirestoreIndexValueWriter.St = new __PRIVATE_FirestoreIndexValueWriter;

/**
 * Counts the number of zeros in a byte.
 *
 * Visible for testing.
 */
function __PRIVATE_numberOfLeadingZerosInByte(e) {
    if (0 === e) return 8;
    let t = 0;
    return e >> 4 == 0 && (
    // Test if the first four bits are zero.
    t += 4, e <<= 4), e >> 6 == 0 && (
    // Test if the first two (or next two) bits are zero.
    t += 2, e <<= 2), e >> 7 == 0 && (
    // Test if the remaining bit is zero.
    t += 1), t;
}

/** Counts the number of leading zeros in the given byte array. */
/**
 * Returns the number of bytes required to store "value". Leading zero bytes
 * are skipped.
 */
function __PRIVATE_unsignedNumLength(e) {
    // This is just the number of bytes for the unsigned representation of the number.
    const t = 64 - function __PRIVATE_numberOfLeadingZeros(e) {
        let t = 0;
        for (let n = 0; n < 8; ++n) {
            const r = __PRIVATE_numberOfLeadingZerosInByte(255 & e[n]);
            if (t += r, 8 !== r) break;
        }
        return t;
    }(e);
    return Math.ceil(t / 8);
}

/**
 * OrderedCodeWriter is a minimal-allocation implementation of the writing
 * behavior defined by the backend.
 *
 * The code is ported from its Java counterpart.
 */ class __PRIVATE_OrderedCodeWriter {
    constructor() {
        this.buffer = new Uint8Array(1024), this.position = 0;
    }
    bt(e) {
        const t = e[Symbol.iterator]();
        let n = t.next();
        for (;!n.done; ) this.Dt(n.value), n = t.next();
        this.Ct();
    }
    vt(e) {
        const t = e[Symbol.iterator]();
        let n = t.next();
        for (;!n.done; ) this.Ft(n.value), n = t.next();
        this.Mt();
    }
    /** Writes utf8 bytes into this byte sequence, ascending. */    xt(e) {
        for (const t of e) {
            const e = t.charCodeAt(0);
            if (e < 128) this.Dt(e); else if (e < 2048) this.Dt(960 | e >>> 6), this.Dt(128 | 63 & e); else if (t < "\ud800" || "\udbff" < t) this.Dt(480 | e >>> 12), 
            this.Dt(128 | 63 & e >>> 6), this.Dt(128 | 63 & e); else {
                const e = t.codePointAt(0);
                this.Dt(240 | e >>> 18), this.Dt(128 | 63 & e >>> 12), this.Dt(128 | 63 & e >>> 6), 
                this.Dt(128 | 63 & e);
            }
        }
        this.Ct();
    }
    /** Writes utf8 bytes into this byte sequence, descending */    Ot(e) {
        for (const t of e) {
            const e = t.charCodeAt(0);
            if (e < 128) this.Ft(e); else if (e < 2048) this.Ft(960 | e >>> 6), this.Ft(128 | 63 & e); else if (t < "\ud800" || "\udbff" < t) this.Ft(480 | e >>> 12), 
            this.Ft(128 | 63 & e >>> 6), this.Ft(128 | 63 & e); else {
                const e = t.codePointAt(0);
                this.Ft(240 | e >>> 18), this.Ft(128 | 63 & e >>> 12), this.Ft(128 | 63 & e >>> 6), 
                this.Ft(128 | 63 & e);
            }
        }
        this.Mt();
    }
    Nt(e) {
        // Values are encoded with a single byte length prefix, followed by the
        // actual value in big-endian format with leading 0 bytes dropped.
        const t = this.Bt(e), n = __PRIVATE_unsignedNumLength(t);
        this.Lt(1 + n), this.buffer[this.position++] = 255 & n;
        // Write the length
        for (let e = t.length - n; e < t.length; ++e) this.buffer[this.position++] = 255 & t[e];
    }
    kt(e) {
        // Values are encoded with a single byte length prefix, followed by the
        // inverted value in big-endian format with leading 0 bytes dropped.
        const t = this.Bt(e), n = __PRIVATE_unsignedNumLength(t);
        this.Lt(1 + n), this.buffer[this.position++] = ~(255 & n);
        // Write the length
        for (let e = t.length - n; e < t.length; ++e) this.buffer[this.position++] = ~(255 & t[e]);
    }
    /**
     * Writes the "infinity" byte sequence that sorts after all other byte
     * sequences written in ascending order.
     */    qt() {
        this.Qt(255), this.Qt(255);
    }
    /**
     * Writes the "infinity" byte sequence that sorts before all other byte
     * sequences written in descending order.
     */    Kt() {
        this.$t(255), this.$t(255);
    }
    /**
     * Resets the buffer such that it is the same as when it was newly
     * constructed.
     */    reset() {
        this.position = 0;
    }
    seed(e) {
        this.Lt(e.length), this.buffer.set(e, this.position), this.position += e.length;
    }
    /** Makes a copy of the encoded bytes in this buffer.  */    Ut() {
        return this.buffer.slice(0, this.position);
    }
    /**
     * Encodes `val` into an encoding so that the order matches the IEEE 754
     * floating-point comparison results with the following exceptions:
     *   -0.0 < 0.0
     *   all non-NaN < NaN
     *   NaN = NaN
     */    Bt(e) {
        const t = 
        /** Converts a JavaScript number to a byte array (using big endian encoding). */
        function __PRIVATE_doubleToLongBits(e) {
            const t = new DataView(new ArrayBuffer(8));
            return t.setFloat64(0, e, /* littleEndian= */ !1), new Uint8Array(t.buffer);
        }(e), n = 0 != (128 & t[0]);
        // Check if the first bit is set. We use a bit mask since value[0] is
        // encoded as a number from 0 to 255.
                // Revert the two complement to get natural ordering
        t[0] ^= n ? 255 : 128;
        for (let e = 1; e < t.length; ++e) t[e] ^= n ? 255 : 0;
        return t;
    }
    /** Writes a single byte ascending to the buffer. */    Dt(e) {
        const t = 255 & e;
        0 === t ? (this.Qt(0), this.Qt(255)) : 255 === t ? (this.Qt(255), this.Qt(0)) : this.Qt(t);
    }
    /** Writes a single byte descending to the buffer.  */    Ft(e) {
        const t = 255 & e;
        0 === t ? (this.$t(0), this.$t(255)) : 255 === t ? (this.$t(255), this.$t(0)) : this.$t(e);
    }
    Ct() {
        this.Qt(0), this.Qt(1);
    }
    Mt() {
        this.$t(0), this.$t(1);
    }
    Qt(e) {
        this.Lt(1), this.buffer[this.position++] = e;
    }
    $t(e) {
        this.Lt(1), this.buffer[this.position++] = ~e;
    }
    Lt(e) {
        const t = e + this.position;
        if (t <= this.buffer.length) return;
        // Try doubling.
                let n = 2 * this.buffer.length;
        // Still not big enough? Just allocate the right size.
                n < t && (n = t);
        // Create the new buffer.
                const r = new Uint8Array(n);
        r.set(this.buffer), // copy old data
        this.buffer = r;
    }
}

class __PRIVATE_AscendingIndexByteEncoder {
    constructor(e) {
        this.Wt = e;
    }
    Vt(e) {
        this.Wt.bt(e);
    }
    dt(e) {
        this.Wt.xt(e);
    }
    Et(e) {
        this.Wt.Nt(e);
    }
    It() {
        this.Wt.qt();
    }
}

class __PRIVATE_DescendingIndexByteEncoder {
    constructor(e) {
        this.Wt = e;
    }
    Vt(e) {
        this.Wt.vt(e);
    }
    dt(e) {
        this.Wt.Ot(e);
    }
    Et(e) {
        this.Wt.kt(e);
    }
    It() {
        this.Wt.Kt();
    }
}

/**
 * Implements `DirectionalIndexByteEncoder` using `OrderedCodeWriter` for the
 * actual encoding.
 */ class __PRIVATE_IndexByteEncoder {
    constructor() {
        this.Wt = new __PRIVATE_OrderedCodeWriter, this.Gt = new __PRIVATE_AscendingIndexByteEncoder(this.Wt), 
        this.zt = new __PRIVATE_DescendingIndexByteEncoder(this.Wt);
    }
    seed(e) {
        this.Wt.seed(e);
    }
    jt(e) {
        return 0 /* IndexKind.ASCENDING */ === e ? this.Gt : this.zt;
    }
    Ut() {
        return this.Wt.Ut();
    }
    reset() {
        this.Wt.reset();
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
/** Represents an index entry saved by the SDK in persisted storage. */ class __PRIVATE_IndexEntry {
    constructor(e, t, n, r) {
        this.indexId = e, this.documentKey = t, this.arrayValue = n, this.directionalValue = r;
    }
    /**
     * Returns an IndexEntry entry that sorts immediately after the current
     * directional value.
     */    Ht() {
        const e = this.directionalValue.length, t = 0 === e || 255 === this.directionalValue[e - 1] ? e + 1 : e, n = new Uint8Array(t);
        return n.set(this.directionalValue, 0), t !== e ? n.set([ 0 ], this.directionalValue.length) : ++n[n.length - 1], 
        new __PRIVATE_IndexEntry(this.indexId, this.documentKey, this.arrayValue, n);
    }
}

function __PRIVATE_indexEntryComparator(e, t) {
    let n = e.indexId - t.indexId;
    return 0 !== n ? n : (n = __PRIVATE_compareByteArrays(e.arrayValue, t.arrayValue), 
    0 !== n ? n : (n = __PRIVATE_compareByteArrays(e.directionalValue, t.directionalValue), 
    0 !== n ? n : DocumentKey.comparator(e.documentKey, t.documentKey)));
}

function __PRIVATE_compareByteArrays(e, t) {
    for (let n = 0; n < e.length && n < t.length; ++n) {
        const r = e[n] - t[n];
        if (0 !== r) return r;
    }
    return e.length - t.length;
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
 * A light query planner for Firestore.
 *
 * This class matches a `FieldIndex` against a Firestore Query `Target`. It
 * determines whether a given index can be used to serve the specified target.
 *
 * The following table showcases some possible index configurations:
 *
 * Query                                               | Index
 * -----------------------------------------------------------------------------
 * where('a', '==', 'a').where('b', '==', 'b')         | a ASC, b DESC
 * where('a', '==', 'a').where('b', '==', 'b')         | a ASC
 * where('a', '==', 'a').where('b', '==', 'b')         | b DESC
 * where('a', '>=', 'a').orderBy('a')                  | a ASC
 * where('a', '>=', 'a').orderBy('a', 'desc')          | a DESC
 * where('a', '>=', 'a').orderBy('a').orderBy('b')     | a ASC, b ASC
 * where('a', '>=', 'a').orderBy('a').orderBy('b')     | a ASC
 * where('a', 'array-contains', 'a').orderBy('b')      | a CONTAINS, b ASCENDING
 * where('a', 'array-contains', 'a').orderBy('b')      | a CONTAINS
 */ class __PRIVATE_TargetIndexMatcher {
    constructor(e) {
        // The inequality filters of the target (if it exists).
        // Note: The sort on FieldFilters is not required. Using SortedSet here just to utilize the custom
        // comparator.
        this.Jt = new SortedSet(((e, t) => FieldPath$1.comparator(e.field, t.field))), this.collectionId = null != e.collectionGroup ? e.collectionGroup : e.path.lastSegment(), 
        this.Yt = e.orderBy, this.Zt = [];
        for (const t of e.filters) {
            const e = t;
            e.isInequality() ? this.Jt = this.Jt.add(e) : this.Zt.push(e);
        }
    }
    get Xt() {
        return this.Jt.size > 1;
    }
    /**
     * Returns whether the index can be used to serve the TargetIndexMatcher's
     * target.
     *
     * An index is considered capable of serving the target when:
     * - The target uses all index segments for its filters and orderBy clauses.
     *   The target can have additional filter and orderBy clauses, but not
     *   fewer.
     * - If an ArrayContains/ArrayContainsAnyfilter is used, the index must also
     *   have a corresponding `CONTAINS` segment.
     * - All directional index segments can be mapped to the target as a series of
     *   equality filters, a single inequality filter and a series of orderBy
     *   clauses.
     * - The segments that represent the equality filters may appear out of order.
     * - The optional segment for the inequality filter must appear after all
     *   equality segments.
     * - The segments that represent that orderBy clause of the target must appear
     *   in order after all equality and inequality segments. Single orderBy
     *   clauses cannot be skipped, but a continuous orderBy suffix may be
     *   omitted.
     */    en(e) {
        if (__PRIVATE_hardAssert(e.collectionGroup === this.collectionId), this.Xt) 
        // Only single inequality is supported for now.
        // TODO(Add support for multiple inequality query): b/298441043
        return !1;
        // If there is an array element, find a matching filter.
                const t = __PRIVATE_fieldIndexGetArraySegment(e);
        if (void 0 !== t && !this.tn(t)) return !1;
        const n = __PRIVATE_fieldIndexGetDirectionalSegments(e);
        let r = new Set, i = 0, s = 0;
        // Process all equalities first. Equalities can appear out of order.
        for (;i < n.length && this.tn(n[i]); ++i) r = r.add(n[i].fieldPath.canonicalString());
        // If we already have processed all segments, all segments are used to serve
        // the equality filters and we do not need to map any segments to the
        // target's inequality and orderBy clauses.
                if (i === n.length) return !0;
        if (this.Jt.size > 0) {
            // Only a single inequality is currently supported. Get the only entry in the set.
            const e = this.Jt.getIterator().getNext();
            // If there is an inequality filter and the field was not in one of the
            // equality filters above, the next segment must match both the filter
            // and the first orderBy clause.
                        if (!r.has(e.field.canonicalString())) {
                const t = n[i];
                if (!this.nn(e, t) || !this.rn(this.Yt[s++], t)) return !1;
            }
            ++i;
        }
        // All remaining segments need to represent the prefix of the target's
        // orderBy.
                for (;i < n.length; ++i) {
            const e = n[i];
            if (s >= this.Yt.length || !this.rn(this.Yt[s++], e)) return !1;
        }
        return !0;
    }
    /**
     * Returns a full matched field index for this target. Currently multiple
     * inequality query is not supported so function returns null.
     */    sn() {
        if (this.Xt) return null;
        // We want to make sure only one segment created for one field. For example,
        // in case like a == 3 and a > 2, Index {a ASCENDING} will only be created
        // once.
                let e = new SortedSet(FieldPath$1.comparator);
        const t = [];
        for (const n of this.Zt) {
            if (n.field.isKeyField()) continue;
            if ("array-contains" /* Operator.ARRAY_CONTAINS */ === n.op || "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === n.op) t.push(new IndexSegment(n.field, 2 /* IndexKind.CONTAINS */)); else {
                if (e.has(n.field)) continue;
                e = e.add(n.field), t.push(new IndexSegment(n.field, 0 /* IndexKind.ASCENDING */));
            }
        }
        // Note: We do not explicitly check `this.inequalityFilter` but rather rely
        // on the target defining an appropriate "order by" to ensure that the
        // required index segment is added. The query engine would reject a query
        // with an inequality filter that lacks the required order-by clause.
                for (const n of this.Yt) 
        // Stop adding more segments if we see a order-by on key. Typically this
        // is the default implicit order-by which is covered in the index_entry
        // table as a separate column. If it is not the default order-by, the
        // generated index will be missing some segments optimized for order-bys,
        // which is probably fine.
        n.field.isKeyField() || e.has(n.field) || (e = e.add(n.field), t.push(new IndexSegment(n.field, "asc" /* Direction.ASCENDING */ === n.dir ? 0 /* IndexKind.ASCENDING */ : 1 /* IndexKind.DESCENDING */)));
        return new FieldIndex(FieldIndex.UNKNOWN_ID, this.collectionId, t, IndexState.empty());
    }
    tn(e) {
        for (const t of this.Zt) if (this.nn(t, e)) return !0;
        return !1;
    }
    nn(e, t) {
        if (void 0 === e || !e.field.isEqual(t.fieldPath)) return !1;
        const n = "array-contains" /* Operator.ARRAY_CONTAINS */ === e.op || "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === e.op;
        return 2 /* IndexKind.CONTAINS */ === t.kind === n;
    }
    rn(e, t) {
        return !!e.field.isEqual(t.fieldPath) && (0 /* IndexKind.ASCENDING */ === t.kind && "asc" /* Direction.ASCENDING */ === e.dir || 1 /* IndexKind.DESCENDING */ === t.kind && "desc" /* Direction.DESCENDING */ === e.dir);
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
 * Provides utility functions that help with boolean logic transformations needed for handling
 * complex filters used in queries.
 */
/**
 * The `in` filter is only a syntactic sugar over a disjunction of equalities. For instance: `a in
 * [1,2,3]` is in fact `a==1 || a==2 || a==3`. This method expands any `in` filter in the given
 * input into a disjunction of equality filters and returns the expanded filter.
 */ function __PRIVATE_computeInExpansion(e) {
    var t, n;
    if (__PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), 
    e instanceof FieldFilter) {
        if (e instanceof __PRIVATE_InFilter) {
            const r = (null === (n = null === (t = e.value.arrayValue) || void 0 === t ? void 0 : t.values) || void 0 === n ? void 0 : n.map((t => FieldFilter.create(e.field, "==" /* Operator.EQUAL */ , t)))) || [];
            return CompositeFilter.create(r, "or" /* CompositeOperator.OR */);
        }
        // We have reached other kinds of field filters.
        return e;
    }
    // We have a composite filter.
        const r = e.filters.map((e => __PRIVATE_computeInExpansion(e)));
    return CompositeFilter.create(r, e.op);
}

/**
 * Given a composite filter, returns the list of terms in its disjunctive normal form.
 *
 * <p>Each element in the return value is one term of the resulting DNF. For instance: For the
 * input: (A || B) && C, the DNF form is: (A && C) || (B && C), and the return value is a list
 * with two elements: a composite filter that performs (A && C), and a composite filter that
 * performs (B && C).
 *
 * @param filter the composite filter to calculate DNF transform for.
 * @return the terms in the DNF transform.
 */ function __PRIVATE_getDnfTerms(e) {
    if (0 === e.getFilters().length) return [];
    const t = __PRIVATE_computeDistributedNormalForm(__PRIVATE_computeInExpansion(e));
    return __PRIVATE_hardAssert(__PRIVATE_isDisjunctiveNormalForm(t)), __PRIVATE_isSingleFieldFilter(t) || __PRIVATE_isFlatConjunction(t) ? [ t ] : t.getFilters();
}

/** Returns true if the given filter is a single field filter. e.g. (a == 10). */ function __PRIVATE_isSingleFieldFilter(e) {
    return e instanceof FieldFilter;
}

/**
 * Returns true if the given filter is the conjunction of one or more field filters. e.g. (a == 10
 * && b == 20)
 */ function __PRIVATE_isFlatConjunction(e) {
    return e instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(e);
}

/**
 * Returns whether or not the given filter is in disjunctive normal form (DNF).
 *
 * <p>In boolean logic, a disjunctive normal form (DNF) is a canonical normal form of a logical
 * formula consisting of a disjunction of conjunctions; it can also be described as an OR of ANDs.
 *
 * <p>For more info, visit: https://en.wikipedia.org/wiki/Disjunctive_normal_form
 */ function __PRIVATE_isDisjunctiveNormalForm(e) {
    return __PRIVATE_isSingleFieldFilter(e) || __PRIVATE_isFlatConjunction(e) || 
    /**
 * Returns true if the given filter is the disjunction of one or more "flat conjunctions" and
 * field filters. e.g. (a == 10) || (b==20 && c==30)
 */
    function __PRIVATE_isDisjunctionOfFieldFiltersAndFlatConjunctions(e) {
        if (e instanceof CompositeFilter && __PRIVATE_compositeFilterIsDisjunction(e)) {
            for (const t of e.getFilters()) if (!__PRIVATE_isSingleFieldFilter(t) && !__PRIVATE_isFlatConjunction(t)) return !1;
            return !0;
        }
        return !1;
    }(e);
}

function __PRIVATE_computeDistributedNormalForm(e) {
    if (__PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), 
    e instanceof FieldFilter) return e;
    if (1 === e.filters.length) return __PRIVATE_computeDistributedNormalForm(e.filters[0]);
    // Compute DNF for each of the subfilters first
        const t = e.filters.map((e => __PRIVATE_computeDistributedNormalForm(e)));
    let n = CompositeFilter.create(t, e.op);
    return n = __PRIVATE_applyAssociation(n), __PRIVATE_isDisjunctiveNormalForm(n) ? n : (__PRIVATE_hardAssert(n instanceof CompositeFilter), 
    __PRIVATE_hardAssert(__PRIVATE_compositeFilterIsConjunction(n)), __PRIVATE_hardAssert(n.filters.length > 1), 
    n.filters.reduce(((e, t) => __PRIVATE_applyDistribution(e, t))));
}

function __PRIVATE_applyDistribution(e, t) {
    let n;
    return __PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), 
    __PRIVATE_hardAssert(t instanceof FieldFilter || t instanceof CompositeFilter), 
    // FieldFilter FieldFilter
    n = e instanceof FieldFilter ? t instanceof FieldFilter ? function __PRIVATE_applyDistributionFieldFilters(e, t) {
        // Conjunction distribution for two field filters is the conjunction of them.
        return CompositeFilter.create([ e, t ], "and" /* CompositeOperator.AND */);
    }(e, t) : __PRIVATE_applyDistributionFieldAndCompositeFilters(e, t) : t instanceof FieldFilter ? __PRIVATE_applyDistributionFieldAndCompositeFilters(t, e) : function __PRIVATE_applyDistributionCompositeFilters(e, t) {
        // There are four cases:
        // (A & B) & (C & D) --> (A & B & C & D)
        // (A & B) & (C | D) --> (A & B & C) | (A & B & D)
        // (A | B) & (C & D) --> (C & D & A) | (C & D & B)
        // (A | B) & (C | D) --> (A & C) | (A & D) | (B & C) | (B & D)
        // Case 1 is a merge.
        if (__PRIVATE_hardAssert(e.filters.length > 0 && t.filters.length > 0), __PRIVATE_compositeFilterIsConjunction(e) && __PRIVATE_compositeFilterIsConjunction(t)) return __PRIVATE_compositeFilterWithAddedFilters(e, t.getFilters());
        // Case 2,3,4 all have at least one side (lhs or rhs) that is a disjunction. In all three cases
        // we should take each element of the disjunction and distribute it over the other side, and
        // return the disjunction of the distribution results.
                const n = __PRIVATE_compositeFilterIsDisjunction(e) ? e : t, r = __PRIVATE_compositeFilterIsDisjunction(e) ? t : e, i = n.filters.map((e => __PRIVATE_applyDistribution(e, r)));
        return CompositeFilter.create(i, "or" /* CompositeOperator.OR */);
    }(e, t), __PRIVATE_applyAssociation(n);
}

function __PRIVATE_applyDistributionFieldAndCompositeFilters(e, t) {
    // There are two cases:
    // A & (B & C) --> (A & B & C)
    // A & (B | C) --> (A & B) | (A & C)
    if (__PRIVATE_compositeFilterIsConjunction(t)) 
    // Case 1
    return __PRIVATE_compositeFilterWithAddedFilters(t, e.getFilters());
    {
        // Case 2
        const n = t.filters.map((t => __PRIVATE_applyDistribution(e, t)));
        return CompositeFilter.create(n, "or" /* CompositeOperator.OR */);
    }
}

/**
 * Applies the associativity property to the given filter and returns the resulting filter.
 *
 * <ul>
 *   <li>A | (B | C) == (A | B) | C == (A | B | C)
 *   <li>A & (B & C) == (A & B) & C == (A & B & C)
 * </ul>
 *
 * <p>For more info, visit: https://en.wikipedia.org/wiki/Associative_property#Propositional_logic
 */ function __PRIVATE_applyAssociation(e) {
    if (__PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), 
    e instanceof FieldFilter) return e;
    const t = e.getFilters();
    // If the composite filter only contains 1 filter, apply associativity to it.
        if (1 === t.length) return __PRIVATE_applyAssociation(t[0]);
    // Associativity applied to a flat composite filter results is itself.
        if (__PRIVATE_compositeFilterIsFlat(e)) return e;
    // First apply associativity to all subfilters. This will in turn recursively apply
    // associativity to all nested composite filters and field filters.
        const n = t.map((e => __PRIVATE_applyAssociation(e))), r = [];
    // For composite subfilters that perform the same kind of logical operation as `compositeFilter`
    // take out their filters and add them to `compositeFilter`. For example:
    // compositeFilter = (A | (B | C | D))
    // compositeSubfilter = (B | C | D)
    // Result: (A | B | C | D)
    // Note that the `compositeSubfilter` has been eliminated, and its filters (B, C, D) have been
    // added to the top-level "compositeFilter".
        return n.forEach((t => {
        t instanceof FieldFilter ? r.push(t) : t instanceof CompositeFilter && (t.op === e.op ? 
        // compositeFilter: (A | (B | C))
        // compositeSubfilter: (B | C)
        // Result: (A | B | C)
        r.push(...t.filters) : 
        // compositeFilter: (A | (B & C))
        // compositeSubfilter: (B & C)
        // Result: (A | (B & C))
        r.push(t));
    })), 1 === r.length ? r[0] : CompositeFilter.create(r, e.op);
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
/**
 * An in-memory implementation of IndexManager.
 */ class __PRIVATE_MemoryIndexManager {
    constructor() {
        this.on = new __PRIVATE_MemoryCollectionParentIndex;
    }
    addToCollectionParentIndex(e, t) {
        return this.on.add(t), PersistencePromise.resolve();
    }
    getCollectionParents(e, t) {
        return PersistencePromise.resolve(this.on.getEntries(t));
    }
    addFieldIndex(e, t) {
        // Field indices are not supported with memory persistence.
        return PersistencePromise.resolve();
    }
    deleteFieldIndex(e, t) {
        // Field indices are not supported with memory persistence.
        return PersistencePromise.resolve();
    }
    deleteAllFieldIndexes(e) {
        // Field indices are not supported with memory persistence.
        return PersistencePromise.resolve();
    }
    createTargetIndexes(e, t) {
        // Field indices are not supported with memory persistence.
        return PersistencePromise.resolve();
    }
    getDocumentsMatchingTarget(e, t) {
        // Field indices are not supported with memory persistence.
        return PersistencePromise.resolve(null);
    }
    getIndexType(e, t) {
        // Field indices are not supported with memory persistence.
        return PersistencePromise.resolve(0 /* IndexType.NONE */);
    }
    getFieldIndexes(e, t) {
        // Field indices are not supported with memory persistence.
        return PersistencePromise.resolve([]);
    }
    getNextCollectionGroupToUpdate(e) {
        // Field indices are not supported with memory persistence.
        return PersistencePromise.resolve(null);
    }
    getMinOffset(e, t) {
        return PersistencePromise.resolve(IndexOffset.min());
    }
    getMinOffsetFromCollectionGroup(e, t) {
        return PersistencePromise.resolve(IndexOffset.min());
    }
    updateCollectionGroup(e, t, n) {
        // Field indices are not supported with memory persistence.
        return PersistencePromise.resolve();
    }
    updateIndexEntries(e, t) {
        // Field indices are not supported with memory persistence.
        return PersistencePromise.resolve();
    }
}

/**
 * Internal implementation of the collection-parent index exposed by MemoryIndexManager.
 * Also used for in-memory caching by IndexedDbIndexManager and initial index population
 * in indexeddb_schema.ts
 */ class __PRIVATE_MemoryCollectionParentIndex {
    constructor() {
        this.index = {};
    }
    // Returns false if the entry already existed.
    add(e) {
        const t = e.lastSegment(), n = e.popLast(), r = this.index[t] || new SortedSet(ResourcePath.comparator), i = !r.has(n);
        return this.index[t] = r.add(n), i;
    }
    has(e) {
        const t = e.lastSegment(), n = e.popLast(), r = this.index[t];
        return r && r.has(n);
    }
    getEntries(e) {
        return (this.index[e] || new SortedSet(ResourcePath.comparator)).toArray();
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
 */ const de = new Uint8Array(0);

/**
 * A persisted implementation of IndexManager.
 *
 * PORTING NOTE: Unlike iOS and Android, the Web SDK does not memoize index
 * data as it supports multi-tab access.
 */
class __PRIVATE_IndexedDbIndexManager {
    constructor(e, t) {
        this.user = e, this.databaseId = t, 
        /**
         * An in-memory copy of the index entries we've already written since the SDK
         * launched. Used to avoid re-writing the same entry repeatedly.
         *
         * This is *NOT* a complete cache of what's in persistence and so can never be
         * used to satisfy reads.
         */
        this._n = new __PRIVATE_MemoryCollectionParentIndex, 
        /**
         * Maps from a target to its equivalent list of sub-targets. Each sub-target
         * contains only one term from the target's disjunctive normal form (DNF).
         */
        this.an = new ObjectMap((e => __PRIVATE_canonifyTarget(e)), ((e, t) => __PRIVATE_targetEquals(e, t))), 
        this.uid = e.uid || "";
    }
    /**
     * Adds a new entry to the collection parent index.
     *
     * Repeated calls for the same collectionPath should be avoided within a
     * transaction as IndexedDbIndexManager only caches writes once a transaction
     * has been committed.
     */    addToCollectionParentIndex(e, t) {
        if (!this._n.has(t)) {
            const n = t.lastSegment(), r = t.popLast();
            e.addOnCommittedListener((() => {
                // Add the collection to the in memory cache only if the transaction was
                // successfully committed.
                this._n.add(t);
            }));
            const i = {
                collectionId: n,
                parent: __PRIVATE_encodeResourcePath(r)
            };
            return __PRIVATE_collectionParentsStore(e).put(i);
        }
        return PersistencePromise.resolve();
    }
    getCollectionParents(e, t) {
        const n = [], r = IDBKeyRange.bound([ t, "" ], [ __PRIVATE_immediateSuccessor(t), "" ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0);
        return __PRIVATE_collectionParentsStore(e).W(r).next((e => {
            for (const r of e) {
                // This collectionId guard shouldn't be necessary (and isn't as long
                // as we're running in a real browser), but there's a bug in
                // indexeddbshim that breaks our range in our tests running in node:
                // https://github.com/axemclion/IndexedDBShim/issues/334
                if (r.collectionId !== t) break;
                n.push(__PRIVATE_decodeResourcePath(r.parent));
            }
            return n;
        }));
    }
    addFieldIndex(e, t) {
        // TODO(indexing): Verify that the auto-incrementing index ID works in
        // Safari & Firefox.
        const n = __PRIVATE_indexConfigurationStore(e), r = function __PRIVATE_toDbIndexConfiguration(e) {
            return {
                indexId: e.indexId,
                collectionGroup: e.collectionGroup,
                fields: e.fields.map((e => [ e.fieldPath.canonicalString(), e.kind ]))
            };
        }(t);
        delete r.indexId;
        // `indexId` is auto-populated by IndexedDb
        const i = n.add(r);
        if (t.indexState) {
            const n = __PRIVATE_indexStateStore(e);
            return i.next((e => {
                n.put(__PRIVATE_toDbIndexState(e, this.user, t.indexState.sequenceNumber, t.indexState.offset));
            }));
        }
        return i.next();
    }
    deleteFieldIndex(e, t) {
        const n = __PRIVATE_indexConfigurationStore(e), r = __PRIVATE_indexStateStore(e), i = __PRIVATE_indexEntriesStore(e);
        return n.delete(t.indexId).next((() => r.delete(IDBKeyRange.bound([ t.indexId ], [ t.indexId + 1 ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0)))).next((() => i.delete(IDBKeyRange.bound([ t.indexId ], [ t.indexId + 1 ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0))));
    }
    deleteAllFieldIndexes(e) {
        const t = __PRIVATE_indexConfigurationStore(e), n = __PRIVATE_indexEntriesStore(e), r = __PRIVATE_indexStateStore(e);
        return t.H().next((() => n.H())).next((() => r.H()));
    }
    createTargetIndexes(e, t) {
        return PersistencePromise.forEach(this.un(t), (t => this.getIndexType(e, t).next((n => {
            if (0 /* IndexType.NONE */ === n || 1 /* IndexType.PARTIAL */ === n) {
                const n = new __PRIVATE_TargetIndexMatcher(t).sn();
                if (null != n) return this.addFieldIndex(e, n);
            }
        }))));
    }
    getDocumentsMatchingTarget(e, t) {
        const n = __PRIVATE_indexEntriesStore(e);
        let r = !0;
        const i = new Map;
        return PersistencePromise.forEach(this.un(t), (t => this.cn(e, t).next((e => {
            r && (r = !!e), i.set(t, e);
        })))).next((() => {
            if (r) {
                let e = __PRIVATE_documentKeySet();
                const r = [];
                return PersistencePromise.forEach(i, ((i, s) => {
                    __PRIVATE_logDebug("IndexedDbIndexManager", `Using index ${function __PRIVATE_fieldIndexToString(e) {
                        return `id=${e.indexId}|cg=${e.collectionGroup}|f=${e.fields.map((e => `${e.fieldPath}:${e.kind}`)).join(",")}`;
                    }(i)} to execute ${__PRIVATE_canonifyTarget(t)}`);
                    const o = function __PRIVATE_targetGetArrayValues(e, t) {
                        const n = __PRIVATE_fieldIndexGetArraySegment(t);
                        if (void 0 === n) return null;
                        for (const t of __PRIVATE_targetGetFieldFiltersForPath(e, n.fieldPath)) switch (t.op) {
                          case "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ :
                            return t.value.arrayValue.values || [];

                          case "array-contains" /* Operator.ARRAY_CONTAINS */ :
                            return [ t.value ];
                            // Remaining filters are not array filters.
                                                }
                        return null;
                    }
                    /**
 * Returns the list of values that are used in != or NOT_IN filters. Returns
 * `null` if there are no such filters.
 */ (s, i), _ = function __PRIVATE_targetGetNotInValues(e, t) {
                        const n = new Map;
                        for (const r of __PRIVATE_fieldIndexGetDirectionalSegments(t)) for (const t of __PRIVATE_targetGetFieldFiltersForPath(e, r.fieldPath)) switch (t.op) {
                          case "==" /* Operator.EQUAL */ :
                          case "in" /* Operator.IN */ :
                            // Encode equality prefix, which is encoded in the index value before
                            // the inequality (e.g. `a == 'a' && b != 'b'` is encoded to
                            // `value != 'ab'`).
                            n.set(r.fieldPath.canonicalString(), t.value);
                            break;

                          case "not-in" /* Operator.NOT_IN */ :
                          case "!=" /* Operator.NOT_EQUAL */ :
                            // NotIn/NotEqual is always a suffix. There cannot be any remaining
                            // segments and hence we can return early here.
                            return n.set(r.fieldPath.canonicalString(), t.value), Array.from(n.values());
                            // Remaining filters cannot be used as notIn bounds.
                                                }
                        return null;
                    }
                    /**
 * Returns a lower bound of field values that can be used as a starting point to
 * scan the index defined by `fieldIndex`. Returns `MIN_VALUE` if no lower bound
 * exists.
 */ (s, i), a = function __PRIVATE_targetGetLowerBound(e, t) {
                        const n = [];
                        let r = !0;
                        // For each segment, retrieve a lower bound if there is a suitable filter or
                        // startAt.
                                                for (const i of __PRIVATE_fieldIndexGetDirectionalSegments(t)) {
                            const t = 0 /* IndexKind.ASCENDING */ === i.kind ? __PRIVATE_targetGetAscendingBound(e, i.fieldPath, e.startAt) : __PRIVATE_targetGetDescendingBound(e, i.fieldPath, e.startAt);
                            n.push(t.value), r && (r = t.inclusive);
                        }
                        return new Bound(n, r);
                    }
                    /**
 * Returns an upper bound of field values that can be used as an ending point
 * when scanning the index defined by `fieldIndex`. Returns `MAX_VALUE` if no
 * upper bound exists.
 */ (s, i), u = function __PRIVATE_targetGetUpperBound(e, t) {
                        const n = [];
                        let r = !0;
                        // For each segment, retrieve an upper bound if there is a suitable filter or
                        // endAt.
                                                for (const i of __PRIVATE_fieldIndexGetDirectionalSegments(t)) {
                            const t = 0 /* IndexKind.ASCENDING */ === i.kind ? __PRIVATE_targetGetDescendingBound(e, i.fieldPath, e.endAt) : __PRIVATE_targetGetAscendingBound(e, i.fieldPath, e.endAt);
                            n.push(t.value), r && (r = t.inclusive);
                        }
                        return new Bound(n, r);
                    }(s, i), c = this.ln(i, s, a), l = this.ln(i, s, u), h = this.hn(i, s, _), P = this.Pn(i.indexId, o, c, a.inclusive, l, u.inclusive, h);
                    return PersistencePromise.forEach(P, (i => n.j(i, t.limit).next((t => {
                        t.forEach((t => {
                            const n = DocumentKey.fromSegments(t.documentKey);
                            e.has(n) || (e = e.add(n), r.push(n));
                        }));
                    }))));
                })).next((() => r));
            }
            return PersistencePromise.resolve(null);
        }));
    }
    un(e) {
        let t = this.an.get(e);
        if (t) return t;
        if (0 === e.filters.length) t = [ e ]; else {
            t = __PRIVATE_getDnfTerms(CompositeFilter.create(e.filters, "and" /* CompositeOperator.AND */)).map((t => __PRIVATE_newTarget(e.path, e.collectionGroup, e.orderBy, t.getFilters(), e.limit, e.startAt, e.endAt)));
        }
        return this.an.set(e, t), t;
    }
    /**
     * Constructs a key range query on `DbIndexEntryStore` that unions all
     * bounds.
     */    Pn(e, t, n, r, i, s, o) {
        // The number of total index scans we union together. This is similar to a
        // distributed normal form, but adapted for array values. We create a single
        // index range per value in an ARRAY_CONTAINS or ARRAY_CONTAINS_ANY filter
        // combined with the values from the query bounds.
        const _ = (null != t ? t.length : 1) * Math.max(n.length, i.length), a = _ / (null != t ? t.length : 1), u = [];
        for (let c = 0; c < _; ++c) {
            const _ = t ? this.In(t[c / a]) : de, l = this.Tn(e, _, n[c % a], r), h = this.En(e, _, i[c % a], s), P = o.map((t => this.Tn(e, _, t, 
            /* inclusive= */ !0)));
            u.push(...this.createRange(l, h, P));
        }
        return u;
    }
    /** Generates the lower bound for `arrayValue` and `directionalValue`. */    Tn(e, t, n, r) {
        const i = new __PRIVATE_IndexEntry(e, DocumentKey.empty(), t, n);
        return r ? i : i.Ht();
    }
    /** Generates the upper bound for `arrayValue` and `directionalValue`. */    En(e, t, n, r) {
        const i = new __PRIVATE_IndexEntry(e, DocumentKey.empty(), t, n);
        return r ? i.Ht() : i;
    }
    cn(e, t) {
        const n = new __PRIVATE_TargetIndexMatcher(t), r = null != t.collectionGroup ? t.collectionGroup : t.path.lastSegment();
        return this.getFieldIndexes(e, r).next((e => {
            // Return the index with the most number of segments.
            let t = null;
            for (const r of e) {
                n.en(r) && (!t || r.fields.length > t.fields.length) && (t = r);
            }
            return t;
        }));
    }
    getIndexType(e, t) {
        let n = 2 /* IndexType.FULL */;
        const r = this.un(t);
        return PersistencePromise.forEach(r, (t => this.cn(e, t).next((e => {
            e ? 0 /* IndexType.NONE */ !== n && e.fields.length < function __PRIVATE_targetGetSegmentCount(e) {
                let t = new SortedSet(FieldPath$1.comparator), n = !1;
                for (const r of e.filters) for (const e of r.getFlattenedFilters()) 
                // __name__ is not an explicit segment of any index, so we don't need to
                // count it.
                e.field.isKeyField() || (
                // ARRAY_CONTAINS or ARRAY_CONTAINS_ANY filters must be counted separately.
                // For instance, it is possible to have an index for "a ARRAY a ASC". Even
                // though these are on the same field, they should be counted as two
                // separate segments in an index.
                "array-contains" /* Operator.ARRAY_CONTAINS */ === e.op || "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === e.op ? n = !0 : t = t.add(e.field));
                for (const n of e.orderBy) 
                // __name__ is not an explicit segment of any index, so we don't need to
                // count it.
                n.field.isKeyField() || (t = t.add(n.field));
                return t.size + (n ? 1 : 0);
            }(t) && (n = 1 /* IndexType.PARTIAL */) : n = 0 /* IndexType.NONE */;
        })))).next((() => 
        // OR queries have more than one sub-target (one sub-target per DNF term). We currently consider
        // OR queries that have a `limit` to have a partial index. For such queries we perform sorting
        // and apply the limit in memory as a post-processing step.
        function __PRIVATE_targetHasLimit(e) {
            return null !== e.limit;
        }(t) && r.length > 1 && 2 /* IndexType.FULL */ === n ? 1 /* IndexType.PARTIAL */ : n));
    }
    /**
     * Returns the byte encoded form of the directional values in the field index.
     * Returns `null` if the document does not have all fields specified in the
     * index.
     */    dn(e, t) {
        const n = new __PRIVATE_IndexByteEncoder;
        for (const r of __PRIVATE_fieldIndexGetDirectionalSegments(e)) {
            const e = t.data.field(r.fieldPath);
            if (null == e) return null;
            const i = n.jt(r.kind);
            __PRIVATE_FirestoreIndexValueWriter.St.ht(e, i);
        }
        return n.Ut();
    }
    /** Encodes a single value to the ascending index format. */    In(e) {
        const t = new __PRIVATE_IndexByteEncoder;
        return __PRIVATE_FirestoreIndexValueWriter.St.ht(e, t.jt(0 /* IndexKind.ASCENDING */)), 
        t.Ut();
    }
    /**
     * Returns an encoded form of the document key that sorts based on the key
     * ordering of the field index.
     */    An(e, t) {
        const n = new __PRIVATE_IndexByteEncoder;
        return __PRIVATE_FirestoreIndexValueWriter.St.ht(__PRIVATE_refValue(this.databaseId, t), n.jt(function __PRIVATE_fieldIndexGetKeyOrder(e) {
            const t = __PRIVATE_fieldIndexGetDirectionalSegments(e);
            return 0 === t.length ? 0 /* IndexKind.ASCENDING */ : t[t.length - 1].kind;
        }(e))), n.Ut();
    }
    /**
     * Encodes the given field values according to the specification in `target`.
     * For IN queries, a list of possible values is returned.
     */    hn(e, t, n) {
        if (null === n) return [];
        let r = [];
        r.push(new __PRIVATE_IndexByteEncoder);
        let i = 0;
        for (const s of __PRIVATE_fieldIndexGetDirectionalSegments(e)) {
            const e = n[i++];
            for (const n of r) if (this.Rn(t, s.fieldPath) && isArray(e)) r = this.Vn(r, s, e); else {
                const t = n.jt(s.kind);
                __PRIVATE_FirestoreIndexValueWriter.St.ht(e, t);
            }
        }
        return this.mn(r);
    }
    /**
     * Encodes the given bounds according to the specification in `target`. For IN
     * queries, a list of possible values is returned.
     */    ln(e, t, n) {
        return this.hn(e, t, n.position);
    }
    /** Returns the byte representation for the provided encoders. */    mn(e) {
        const t = [];
        for (let n = 0; n < e.length; ++n) t[n] = e[n].Ut();
        return t;
    }
    /**
     * Creates a separate encoder for each element of an array.
     *
     * The method appends each value to all existing encoders (e.g. filter("a",
     * "==", "a1").filter("b", "in", ["b1", "b2"]) becomes ["a1,b1", "a1,b2"]). A
     * list of new encoders is returned.
     */    Vn(e, t, n) {
        const r = [ ...e ], i = [];
        for (const e of n.arrayValue.values || []) for (const n of r) {
            const r = new __PRIVATE_IndexByteEncoder;
            r.seed(n.Ut()), __PRIVATE_FirestoreIndexValueWriter.St.ht(e, r.jt(t.kind)), i.push(r);
        }
        return i;
    }
    Rn(e, t) {
        return !!e.filters.find((e => e instanceof FieldFilter && e.field.isEqual(t) && ("in" /* Operator.IN */ === e.op || "not-in" /* Operator.NOT_IN */ === e.op)));
    }
    getFieldIndexes(e, t) {
        const n = __PRIVATE_indexConfigurationStore(e), r = __PRIVATE_indexStateStore(e);
        return (t ? n.W("collectionGroupIndex", IDBKeyRange.bound(t, t)) : n.W()).next((e => {
            const t = [];
            return PersistencePromise.forEach(e, (e => r.get([ e.indexId, this.uid ]).next((n => {
                t.push(function __PRIVATE_fromDbIndexConfiguration(e, t) {
                    const n = t ? new IndexState(t.sequenceNumber, new IndexOffset(__PRIVATE_fromDbTimestamp(t.readTime), new DocumentKey(__PRIVATE_decodeResourcePath(t.documentKey)), t.largestBatchId)) : IndexState.empty(), r = e.fields.map((([e, t]) => new IndexSegment(FieldPath$1.fromServerFormat(e), t)));
                    return new FieldIndex(e.indexId, e.collectionGroup, r, n);
                }(e, n));
            })))).next((() => t));
        }));
    }
    getNextCollectionGroupToUpdate(e) {
        return this.getFieldIndexes(e).next((e => 0 === e.length ? null : (e.sort(((e, t) => {
            const n = e.indexState.sequenceNumber - t.indexState.sequenceNumber;
            return 0 !== n ? n : __PRIVATE_primitiveComparator(e.collectionGroup, t.collectionGroup);
        })), e[0].collectionGroup)));
    }
    updateCollectionGroup(e, t, n) {
        const r = __PRIVATE_indexConfigurationStore(e), i = __PRIVATE_indexStateStore(e);
        return this.fn(e).next((e => r.W("collectionGroupIndex", IDBKeyRange.bound(t, t)).next((t => PersistencePromise.forEach(t, (t => i.put(__PRIVATE_toDbIndexState(t.indexId, this.user, e, n))))))));
    }
    updateIndexEntries(e, t) {
        // Porting Note: `getFieldIndexes()` on Web does not cache index lookups as
        // it could be used across different IndexedDB transactions. As any cached
        // data might be invalidated by other multi-tab clients, we can only trust
        // data within a single IndexedDB transaction. We therefore add a cache
        // here.
        const n = new Map;
        return PersistencePromise.forEach(t, ((t, r) => {
            const i = n.get(t.collectionGroup);
            return (i ? PersistencePromise.resolve(i) : this.getFieldIndexes(e, t.collectionGroup)).next((i => (n.set(t.collectionGroup, i), 
            PersistencePromise.forEach(i, (n => this.gn(e, t, n).next((t => {
                const i = this.pn(r, n);
                return t.isEqual(i) ? PersistencePromise.resolve() : this.yn(e, r, n, t, i);
            })))))));
        }));
    }
    wn(e, t, n, r) {
        return __PRIVATE_indexEntriesStore(e).put({
            indexId: r.indexId,
            uid: this.uid,
            arrayValue: r.arrayValue,
            directionalValue: r.directionalValue,
            orderedDocumentKey: this.An(n, t.key),
            documentKey: t.key.path.toArray()
        });
    }
    Sn(e, t, n, r) {
        return __PRIVATE_indexEntriesStore(e).delete([ r.indexId, this.uid, r.arrayValue, r.directionalValue, this.An(n, t.key), t.key.path.toArray() ]);
    }
    gn(e, t, n) {
        const r = __PRIVATE_indexEntriesStore(e);
        let i = new SortedSet(__PRIVATE_indexEntryComparator);
        return r.Y({
            index: "documentKeyIndex",
            range: IDBKeyRange.only([ n.indexId, this.uid, this.An(n, t) ])
        }, ((e, r) => {
            i = i.add(new __PRIVATE_IndexEntry(n.indexId, t, r.arrayValue, r.directionalValue));
        })).next((() => i));
    }
    /** Creates the index entries for the given document. */    pn(e, t) {
        let n = new SortedSet(__PRIVATE_indexEntryComparator);
        const r = this.dn(t, e);
        if (null == r) return n;
        const i = __PRIVATE_fieldIndexGetArraySegment(t);
        if (null != i) {
            const s = e.data.field(i.fieldPath);
            if (isArray(s)) for (const i of s.arrayValue.values || []) n = n.add(new __PRIVATE_IndexEntry(t.indexId, e.key, this.In(i), r));
        } else n = n.add(new __PRIVATE_IndexEntry(t.indexId, e.key, de, r));
        return n;
    }
    /**
     * Updates the index entries for the provided document by deleting entries
     * that are no longer referenced in `newEntries` and adding all newly added
     * entries.
     */    yn(e, t, n, r, i) {
        __PRIVATE_logDebug("IndexedDbIndexManager", "Updating index entries for document '%s'", t.key);
        const s = [];
        return function __PRIVATE_diffSortedSets(e, t, n, r, i) {
            const s = e.getIterator(), o = t.getIterator();
            let _ = __PRIVATE_advanceIterator(s), a = __PRIVATE_advanceIterator(o);
            // Walk through the two sets at the same time, using the ordering defined by
            // `comparator`.
            for (;_ || a; ) {
                let e = !1, t = !1;
                if (_ && a) {
                    const r = n(_, a);
                    r < 0 ? 
                    // The element was removed if the next element in our ordered
                    // walkthrough is only in `before`.
                    t = !0 : r > 0 && (
                    // The element was added if the next element in our ordered walkthrough
                    // is only in `after`.
                    e = !0);
                } else null != _ ? t = !0 : e = !0;
                e ? (r(a), a = __PRIVATE_advanceIterator(o)) : t ? (i(_), _ = __PRIVATE_advanceIterator(s)) : (_ = __PRIVATE_advanceIterator(s), 
                a = __PRIVATE_advanceIterator(o));
            }
        }(r, i, __PRIVATE_indexEntryComparator, (
        /* onAdd= */ r => {
            s.push(this.wn(e, t, n, r));
        }), (
        /* onRemove= */ r => {
            s.push(this.Sn(e, t, n, r));
        })), PersistencePromise.waitFor(s);
    }
    fn(e) {
        let t = 1;
        return __PRIVATE_indexStateStore(e).Y({
            index: "sequenceNumberIndex",
            reverse: !0,
            range: IDBKeyRange.upperBound([ this.uid, Number.MAX_SAFE_INTEGER ])
        }, ((e, n, r) => {
            r.done(), t = n.sequenceNumber + 1;
        })).next((() => t));
    }
    /**
     * Returns a new set of IDB ranges that splits the existing range and excludes
     * any values that match the `notInValue` from these ranges. As an example,
     * '[foo > 2 && foo != 3]` becomes  `[foo > 2 && < 3, foo > 3]`.
     */    createRange(e, t, n) {
        // The notIn values need to be sorted and unique so that we can return a
        // sorted set of non-overlapping ranges.
        n = n.sort(((e, t) => __PRIVATE_indexEntryComparator(e, t))).filter(((e, t, n) => !t || 0 !== __PRIVATE_indexEntryComparator(e, n[t - 1])));
        const r = [];
        r.push(e);
        for (const i of n) {
            const n = __PRIVATE_indexEntryComparator(i, e), s = __PRIVATE_indexEntryComparator(i, t);
            if (0 === n) 
            // `notInValue` is the lower bound. We therefore need to raise the bound
            // to the next value.
            r[0] = e.Ht(); else if (n > 0 && s < 0) 
            // `notInValue` is in the middle of the range
            r.push(i), r.push(i.Ht()); else if (s > 0) 
            // `notInValue` (and all following values) are out of the range
            break;
        }
        r.push(t);
        const i = [];
        for (let e = 0; e < r.length; e += 2) {
            // If we encounter two bounds that will create an unmatchable key range,
            // then we return an empty set of key ranges.
            if (this.bn(r[e], r[e + 1])) return [];
            const t = [ r[e].indexId, this.uid, r[e].arrayValue, r[e].directionalValue, de, [] ], n = [ r[e + 1].indexId, this.uid, r[e + 1].arrayValue, r[e + 1].directionalValue, de, [] ];
            i.push(IDBKeyRange.bound(t, n));
        }
        return i;
    }
    bn(e, t) {
        // If lower bound is greater than the upper bound, then the key
        // range can never be matched.
        return __PRIVATE_indexEntryComparator(e, t) > 0;
    }
    getMinOffsetFromCollectionGroup(e, t) {
        return this.getFieldIndexes(e, t).next(__PRIVATE_getMinOffsetFromFieldIndexes);
    }
    getMinOffset(e, t) {
        return PersistencePromise.mapArray(this.un(t), (t => this.cn(e, t).next((e => e || fail())))).next(__PRIVATE_getMinOffsetFromFieldIndexes);
    }
}

/**
 * Helper to get a typed SimpleDbStore for the collectionParents
 * document store.
 */ function __PRIVATE_collectionParentsStore(e) {
    return __PRIVATE_getStore(e, "collectionParents");
}

/**
 * Helper to get a typed SimpleDbStore for the index entry object store.
 */ function __PRIVATE_indexEntriesStore(e) {
    return __PRIVATE_getStore(e, "indexEntries");
}

/**
 * Helper to get a typed SimpleDbStore for the index configuration object store.
 */ function __PRIVATE_indexConfigurationStore(e) {
    return __PRIVATE_getStore(e, "indexConfiguration");
}

/**
 * Helper to get a typed SimpleDbStore for the index state object store.
 */ function __PRIVATE_indexStateStore(e) {
    return __PRIVATE_getStore(e, "indexState");
}

function __PRIVATE_getMinOffsetFromFieldIndexes(e) {
    __PRIVATE_hardAssert(0 !== e.length);
    let t = e[0].indexState.offset, n = t.largestBatchId;
    for (let r = 1; r < e.length; r++) {
        const i = e[r].indexState.offset;
        __PRIVATE_indexOffsetComparator(i, t) < 0 && (t = i), n < i.largestBatchId && (n = i.largestBatchId);
    }
    return new IndexOffset(t.readTime, t.documentKey, n);
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
 */ const Ae = {
    didRun: !1,
    sequenceNumbersCollected: 0,
    targetsRemoved: 0,
    documentsRemoved: 0
};

class LruParams {
    constructor(
    // When we attempt to collect, we will only do so if the cache size is greater than this
    // threshold. Passing `COLLECTION_DISABLED` here will cause collection to always be skipped.
    e, 
    // The percentage of sequence numbers that we will attempt to collect
    t, 
    // A cap on the total number of sequence numbers that will be collected. This prevents
    // us from collecting a huge number of sequence numbers if the cache has grown very large.
    n) {
        this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = n;
    }
    static withCacheSize(e) {
        return new LruParams(e, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
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
 * Delete a mutation batch and the associated document mutations.
 * @returns A PersistencePromise of the document mutations that were removed.
 */
function removeMutationBatch(e, t, n) {
    const r = e.store("mutations"), i = e.store("documentMutations"), s = [], o = IDBKeyRange.only(n.batchId);
    let _ = 0;
    const a = r.Y({
        range: o
    }, ((e, t, n) => (_++, n.delete())));
    s.push(a.next((() => {
        __PRIVATE_hardAssert(1 === _);
    })));
    const u = [];
    for (const e of n.mutations) {
        const r = __PRIVATE_newDbDocumentMutationKey(t, e.key.path, n.batchId);
        s.push(i.delete(r)), u.push(e.key);
    }
    return PersistencePromise.waitFor(s).next((() => u));
}

/**
 * Returns an approximate size for the given document.
 */ function __PRIVATE_dbDocumentSize(e) {
    if (!e) return 0;
    let t;
    if (e.document) t = e.document; else if (e.unknownDocument) t = e.unknownDocument; else {
        if (!e.noDocument) throw fail();
        t = e.noDocument;
    }
    return JSON.stringify(t).length;
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
/** A mutation queue for a specific user, backed by IndexedDB. */ LruParams.DEFAULT_COLLECTION_PERCENTILE = 10, 
LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, LruParams.DEFAULT = new LruParams(41943040, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), 
LruParams.DISABLED = new LruParams(-1, 0, 0);

class __PRIVATE_IndexedDbMutationQueue {
    constructor(
    /**
     * The normalized userId (e.g. null UID => "" userId) used to store /
     * retrieve mutations.
     */
    e, t, n, r) {
        this.userId = e, this.serializer = t, this.indexManager = n, this.referenceDelegate = r, 
        /**
         * Caches the document keys for pending mutation batches. If the mutation
         * has been removed from IndexedDb, the cached value may continue to
         * be used to retrieve the batch's document keys. To remove a cached value
         * locally, `removeCachedMutationKeys()` should be invoked either directly
         * or through `removeMutationBatches()`.
         *
         * With multi-tab, when the primary client acknowledges or rejects a mutation,
         * this cache is used by secondary clients to invalidate the local
         * view of the documents that were previously affected by the mutation.
         */
        // PORTING NOTE: Multi-tab only.
        this.Dn = {};
    }
    /**
     * Creates a new mutation queue for the given user.
     * @param user - The user for which to create a mutation queue.
     * @param serializer - The serializer to use when persisting to IndexedDb.
     */    static ct(e, t, n, r) {
        // TODO(mcg): Figure out what constraints there are on userIDs
        // In particular, are there any reserved characters? are empty ids allowed?
        // For the moment store these together in the same mutations table assuming
        // that empty userIDs aren't allowed.
        __PRIVATE_hardAssert("" !== e.uid);
        const i = e.isAuthenticated() ? e.uid : "";
        return new __PRIVATE_IndexedDbMutationQueue(i, t, n, r);
    }
    checkEmpty(e) {
        let t = !0;
        const n = IDBKeyRange.bound([ this.userId, Number.NEGATIVE_INFINITY ], [ this.userId, Number.POSITIVE_INFINITY ]);
        return __PRIVATE_mutationsStore(e).Y({
            index: "userMutationsIndex",
            range: n
        }, ((e, n, r) => {
            t = !1, r.done();
        })).next((() => t));
    }
    addMutationBatch(e, t, n, r) {
        const i = __PRIVATE_documentMutationsStore(e), s = __PRIVATE_mutationsStore(e);
        // The IndexedDb implementation in Chrome (and Firefox) does not handle
        // compound indices that include auto-generated keys correctly. To ensure
        // that the index entry is added correctly in all browsers, we perform two
        // writes: The first write is used to retrieve the next auto-generated Batch
        // ID, and the second write populates the index and stores the actual
        // mutation batch.
        // See: https://bugs.chromium.org/p/chromium/issues/detail?id=701972
        // We write an empty object to obtain key
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return s.add({}).next((o => {
            __PRIVATE_hardAssert("number" == typeof o);
            const _ = new MutationBatch(o, t, n, r), a = function __PRIVATE_toDbMutationBatch(e, t, n) {
                const r = n.baseMutations.map((t => toMutation(e.ut, t))), i = n.mutations.map((t => toMutation(e.ut, t)));
                return {
                    userId: t,
                    batchId: n.batchId,
                    localWriteTimeMs: n.localWriteTime.toMillis(),
                    baseMutations: r,
                    mutations: i
                };
            }(this.serializer, this.userId, _), u = [];
            let c = new SortedSet(((e, t) => __PRIVATE_primitiveComparator(e.canonicalString(), t.canonicalString())));
            for (const e of r) {
                const t = __PRIVATE_newDbDocumentMutationKey(this.userId, e.key.path, o);
                c = c.add(e.key.path.popLast()), u.push(s.put(a)), u.push(i.put(t, N));
            }
            return c.forEach((t => {
                u.push(this.indexManager.addToCollectionParentIndex(e, t));
            })), e.addOnCommittedListener((() => {
                this.Dn[o] = _.keys();
            })), PersistencePromise.waitFor(u).next((() => _));
        }));
    }
    lookupMutationBatch(e, t) {
        return __PRIVATE_mutationsStore(e).get(t).next((e => e ? (__PRIVATE_hardAssert(e.userId === this.userId), 
        __PRIVATE_fromDbMutationBatch(this.serializer, e)) : null));
    }
    /**
     * Returns the document keys for the mutation batch with the given batchId.
     * For primary clients, this method returns `null` after
     * `removeMutationBatches()` has been called. Secondary clients return a
     * cached result until `removeCachedMutationKeys()` is invoked.
     */
    // PORTING NOTE: Multi-tab only.
    Cn(e, t) {
        return this.Dn[t] ? PersistencePromise.resolve(this.Dn[t]) : this.lookupMutationBatch(e, t).next((e => {
            if (e) {
                const n = e.keys();
                return this.Dn[t] = n, n;
            }
            return null;
        }));
    }
    getNextMutationBatchAfterBatchId(e, t) {
        const n = t + 1, r = IDBKeyRange.lowerBound([ this.userId, n ]);
        let i = null;
        return __PRIVATE_mutationsStore(e).Y({
            index: "userMutationsIndex",
            range: r
        }, ((e, t, r) => {
            t.userId === this.userId && (__PRIVATE_hardAssert(t.batchId >= n), i = __PRIVATE_fromDbMutationBatch(this.serializer, t)), 
            r.done();
        })).next((() => i));
    }
    getHighestUnacknowledgedBatchId(e) {
        const t = IDBKeyRange.upperBound([ this.userId, Number.POSITIVE_INFINITY ]);
        let n = -1;
        return __PRIVATE_mutationsStore(e).Y({
            index: "userMutationsIndex",
            range: t,
            reverse: !0
        }, ((e, t, r) => {
            n = t.batchId, r.done();
        })).next((() => n));
    }
    getAllMutationBatches(e) {
        const t = IDBKeyRange.bound([ this.userId, -1 ], [ this.userId, Number.POSITIVE_INFINITY ]);
        return __PRIVATE_mutationsStore(e).W("userMutationsIndex", t).next((e => e.map((e => __PRIVATE_fromDbMutationBatch(this.serializer, e)))));
    }
    getAllMutationBatchesAffectingDocumentKey(e, t) {
        // Scan the document-mutation index starting with a prefix starting with
        // the given documentKey.
        const n = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, t.path), r = IDBKeyRange.lowerBound(n), i = [];
        return __PRIVATE_documentMutationsStore(e).Y({
            range: r
        }, ((n, r, s) => {
            const [o, _, a] = n, u = __PRIVATE_decodeResourcePath(_);
            // Only consider rows matching exactly the specific key of
            // interest. Note that because we order by path first, and we
            // order terminators before path separators, we'll encounter all
            // the index rows for documentKey contiguously. In particular, all
            // the rows for documentKey will occur before any rows for
            // documents nested in a subcollection beneath documentKey so we
            // can stop as soon as we hit any such row.
                        if (o === this.userId && t.path.isEqual(u)) 
            // Look up the mutation batch in the store.
            return __PRIVATE_mutationsStore(e).get(a).next((e => {
                if (!e) throw fail();
                __PRIVATE_hardAssert(e.userId === this.userId), i.push(__PRIVATE_fromDbMutationBatch(this.serializer, e));
            }));
            s.done();
        })).next((() => i));
    }
    getAllMutationBatchesAffectingDocumentKeys(e, t) {
        let n = new SortedSet(__PRIVATE_primitiveComparator);
        const r = [];
        return t.forEach((t => {
            const i = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, t.path), s = IDBKeyRange.lowerBound(i), o = __PRIVATE_documentMutationsStore(e).Y({
                range: s
            }, ((e, r, i) => {
                const [s, o, _] = e, a = __PRIVATE_decodeResourcePath(o);
                // Only consider rows matching exactly the specific key of
                // interest. Note that because we order by path first, and we
                // order terminators before path separators, we'll encounter all
                // the index rows for documentKey contiguously. In particular, all
                // the rows for documentKey will occur before any rows for
                // documents nested in a subcollection beneath documentKey so we
                // can stop as soon as we hit any such row.
                                s === this.userId && t.path.isEqual(a) ? n = n.add(_) : i.done();
            }));
            r.push(o);
        })), PersistencePromise.waitFor(r).next((() => this.vn(e, n)));
    }
    getAllMutationBatchesAffectingQuery(e, t) {
        const n = t.path, r = n.length + 1, i = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, n), s = IDBKeyRange.lowerBound(i);
        // Collect up unique batchIDs encountered during a scan of the index. Use a
        // SortedSet to accumulate batch IDs so they can be traversed in order in a
        // scan of the main table.
        let o = new SortedSet(__PRIVATE_primitiveComparator);
        return __PRIVATE_documentMutationsStore(e).Y({
            range: s
        }, ((e, t, i) => {
            const [s, _, a] = e, u = __PRIVATE_decodeResourcePath(_);
            s === this.userId && n.isPrefixOf(u) ? 
            // Rows with document keys more than one segment longer than the
            // query path can't be matches. For example, a query on 'rooms'
            // can't match the document /rooms/abc/messages/xyx.
            // TODO(mcg): we'll need a different scanner when we implement
            // ancestor queries.
            u.length === r && (o = o.add(a)) : i.done();
        })).next((() => this.vn(e, o)));
    }
    vn(e, t) {
        const n = [], r = [];
        // TODO(rockwood): Implement this using iterate.
        return t.forEach((t => {
            r.push(__PRIVATE_mutationsStore(e).get(t).next((e => {
                if (null === e) throw fail();
                __PRIVATE_hardAssert(e.userId === this.userId), n.push(__PRIVATE_fromDbMutationBatch(this.serializer, e));
            })));
        })), PersistencePromise.waitFor(r).next((() => n));
    }
    removeMutationBatch(e, t) {
        return removeMutationBatch(e.ae, this.userId, t).next((n => (e.addOnCommittedListener((() => {
            this.Fn(t.batchId);
        })), PersistencePromise.forEach(n, (t => this.referenceDelegate.markPotentiallyOrphaned(e, t))))));
    }
    /**
     * Clears the cached keys for a mutation batch. This method should be
     * called by secondary clients after they process mutation updates.
     *
     * Note that this method does not have to be called from primary clients as
     * the corresponding cache entries are cleared when an acknowledged or
     * rejected batch is removed from the mutation queue.
     */
    // PORTING NOTE: Multi-tab only
    Fn(e) {
        delete this.Dn[e];
    }
    performConsistencyCheck(e) {
        return this.checkEmpty(e).next((t => {
            if (!t) return PersistencePromise.resolve();
            // Verify that there are no entries in the documentMutations index if
            // the queue is empty.
                        const n = IDBKeyRange.lowerBound(
            /**
 * Creates a [userId] key for use in the DbDocumentMutations index to iterate
 * over all of a user's document mutations.
 */
            function __PRIVATE_newDbDocumentMutationPrefixForUser(e) {
                return [ e ];
            }(this.userId)), r = [];
            return __PRIVATE_documentMutationsStore(e).Y({
                range: n
            }, ((e, t, n) => {
                if (e[0] === this.userId) {
                    const t = __PRIVATE_decodeResourcePath(e[1]);
                    r.push(t);
                } else n.done();
            })).next((() => {
                __PRIVATE_hardAssert(0 === r.length);
            }));
        }));
    }
    containsKey(e, t) {
        return __PRIVATE_mutationQueueContainsKey(e, this.userId, t);
    }
    // PORTING NOTE: Multi-tab only (state is held in memory in other clients).
    /** Returns the mutation queue's metadata from IndexedDb. */
    Mn(e) {
        return __PRIVATE_mutationQueuesStore(e).get(this.userId).next((e => e || {
            userId: this.userId,
            lastAcknowledgedBatchId: -1,
            lastStreamToken: ""
        }));
    }
}

/**
 * @returns true if the mutation queue for the given user contains a pending
 *         mutation for the given key.
 */ function __PRIVATE_mutationQueueContainsKey(e, t, n) {
    const r = __PRIVATE_newDbDocumentMutationPrefixForPath(t, n.path), i = r[1], s = IDBKeyRange.lowerBound(r);
    let o = !1;
    return __PRIVATE_documentMutationsStore(e).Y({
        range: s,
        J: !0
    }, ((e, n, r) => {
        const [s, _, /*batchID*/ a] = e;
        s === t && _ === i && (o = !0), r.done();
    })).next((() => o));
}

/** Returns true if any mutation queue contains the given document. */
/**
 * Helper to get a typed SimpleDbStore for the mutations object store.
 */
function __PRIVATE_mutationsStore(e) {
    return __PRIVATE_getStore(e, "mutations");
}

/**
 * Helper to get a typed SimpleDbStore for the mutationQueues object store.
 */ function __PRIVATE_documentMutationsStore(e) {
    return __PRIVATE_getStore(e, "documentMutations");
}

/**
 * Helper to get a typed SimpleDbStore for the mutationQueues object store.
 */ function __PRIVATE_mutationQueuesStore(e) {
    return __PRIVATE_getStore(e, "mutationQueues");
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
/** Offset to ensure non-overlapping target ids. */
/**
 * Generates monotonically increasing target IDs for sending targets to the
 * watch stream.
 *
 * The client constructs two generators, one for the target cache, and one for
 * for the sync engine (to generate limbo documents targets). These
 * generators produce non-overlapping IDs (by using even and odd IDs
 * respectively).
 *
 * By separating the target ID space, the query cache can generate target IDs
 * that persist across client restarts, while sync engine can independently
 * generate in-memory target IDs that are transient and can be reused after a
 * restart.
 */
class __PRIVATE_TargetIdGenerator {
    constructor(e) {
        this.xn = e;
    }
    next() {
        return this.xn += 2, this.xn;
    }
    static On() {
        // The target cache generator must return '2' in its first call to `next()`
        // as there is no differentiation in the protocol layer between an unset
        // number and the number '0'. If we were to sent a target with target ID
        // '0', the backend would consider it unset and replace it with its own ID.
        return new __PRIVATE_TargetIdGenerator(0);
    }
    static Nn() {
        // Sync engine assigns target IDs for limbo document detection.
        return new __PRIVATE_TargetIdGenerator(-1);
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
 */ class __PRIVATE_IndexedDbTargetCache {
    constructor(e, t) {
        this.referenceDelegate = e, this.serializer = t;
    }
    // PORTING NOTE: We don't cache global metadata for the target cache, since
    // some of it (in particular `highestTargetId`) can be modified by secondary
    // tabs. We could perhaps be more granular (and e.g. still cache
    // `lastRemoteSnapshotVersion` in memory) but for simplicity we currently go
    // to IndexedDb whenever we need to read metadata. We can revisit if it turns
    // out to have a meaningful performance impact.
    allocateTargetId(e) {
        return this.Bn(e).next((t => {
            const n = new __PRIVATE_TargetIdGenerator(t.highestTargetId);
            return t.highestTargetId = n.next(), this.Ln(e, t).next((() => t.highestTargetId));
        }));
    }
    getLastRemoteSnapshotVersion(e) {
        return this.Bn(e).next((e => SnapshotVersion.fromTimestamp(new Timestamp(e.lastRemoteSnapshotVersion.seconds, e.lastRemoteSnapshotVersion.nanoseconds))));
    }
    getHighestSequenceNumber(e) {
        return this.Bn(e).next((e => e.highestListenSequenceNumber));
    }
    setTargetsMetadata(e, t, n) {
        return this.Bn(e).next((r => (r.highestListenSequenceNumber = t, n && (r.lastRemoteSnapshotVersion = n.toTimestamp()), 
        t > r.highestListenSequenceNumber && (r.highestListenSequenceNumber = t), this.Ln(e, r))));
    }
    addTargetData(e, t) {
        return this.kn(e, t).next((() => this.Bn(e).next((n => (n.targetCount += 1, this.qn(t, n), 
        this.Ln(e, n))))));
    }
    updateTargetData(e, t) {
        return this.kn(e, t);
    }
    removeTargetData(e, t) {
        return this.removeMatchingKeysForTargetId(e, t.targetId).next((() => __PRIVATE_targetsStore(e).delete(t.targetId))).next((() => this.Bn(e))).next((t => (__PRIVATE_hardAssert(t.targetCount > 0), 
        t.targetCount -= 1, this.Ln(e, t))));
    }
    /**
     * Drops any targets with sequence number less than or equal to the upper bound, excepting those
     * present in `activeTargetIds`. Document associations for the removed targets are also removed.
     * Returns the number of targets removed.
     */    removeTargets(e, t, n) {
        let r = 0;
        const i = [];
        return __PRIVATE_targetsStore(e).Y(((s, o) => {
            const _ = __PRIVATE_fromDbTarget(o);
            _.sequenceNumber <= t && null === n.get(_.targetId) && (r++, i.push(this.removeTargetData(e, _)));
        })).next((() => PersistencePromise.waitFor(i))).next((() => r));
    }
    /**
     * Call provided function with each `TargetData` that we have cached.
     */    forEachTarget(e, t) {
        return __PRIVATE_targetsStore(e).Y(((e, n) => {
            const r = __PRIVATE_fromDbTarget(n);
            t(r);
        }));
    }
    Bn(e) {
        return __PRIVATE_globalTargetStore(e).get("targetGlobalKey").next((e => (__PRIVATE_hardAssert(null !== e), 
        e)));
    }
    Ln(e, t) {
        return __PRIVATE_globalTargetStore(e).put("targetGlobalKey", t);
    }
    kn(e, t) {
        return __PRIVATE_targetsStore(e).put(__PRIVATE_toDbTarget(this.serializer, t));
    }
    /**
     * In-place updates the provided metadata to account for values in the given
     * TargetData. Saving is done separately. Returns true if there were any
     * changes to the metadata.
     */    qn(e, t) {
        let n = !1;
        return e.targetId > t.highestTargetId && (t.highestTargetId = e.targetId, n = !0), 
        e.sequenceNumber > t.highestListenSequenceNumber && (t.highestListenSequenceNumber = e.sequenceNumber, 
        n = !0), n;
    }
    getTargetCount(e) {
        return this.Bn(e).next((e => e.targetCount));
    }
    getTargetData(e, t) {
        // Iterating by the canonicalId may yield more than one result because
        // canonicalId values are not required to be unique per target. This query
        // depends on the queryTargets index to be efficient.
        const n = __PRIVATE_canonifyTarget(t), r = IDBKeyRange.bound([ n, Number.NEGATIVE_INFINITY ], [ n, Number.POSITIVE_INFINITY ]);
        let i = null;
        return __PRIVATE_targetsStore(e).Y({
            range: r,
            index: "queryTargetsIndex"
        }, ((e, n, r) => {
            const s = __PRIVATE_fromDbTarget(n);
            // After finding a potential match, check that the target is
            // actually equal to the requested target.
                        __PRIVATE_targetEquals(t, s.target) && (i = s, r.done());
        })).next((() => i));
    }
    addMatchingKeys(e, t, n) {
        // PORTING NOTE: The reverse index (documentsTargets) is maintained by
        // IndexedDb.
        const r = [], i = __PRIVATE_documentTargetStore(e);
        return t.forEach((t => {
            const s = __PRIVATE_encodeResourcePath(t.path);
            r.push(i.put({
                targetId: n,
                path: s
            })), r.push(this.referenceDelegate.addReference(e, n, t));
        })), PersistencePromise.waitFor(r);
    }
    removeMatchingKeys(e, t, n) {
        // PORTING NOTE: The reverse index (documentsTargets) is maintained by
        // IndexedDb.
        const r = __PRIVATE_documentTargetStore(e);
        return PersistencePromise.forEach(t, (t => {
            const i = __PRIVATE_encodeResourcePath(t.path);
            return PersistencePromise.waitFor([ r.delete([ n, i ]), this.referenceDelegate.removeReference(e, n, t) ]);
        }));
    }
    removeMatchingKeysForTargetId(e, t) {
        const n = __PRIVATE_documentTargetStore(e), r = IDBKeyRange.bound([ t ], [ t + 1 ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0);
        return n.delete(r);
    }
    getMatchingKeysForTargetId(e, t) {
        const n = IDBKeyRange.bound([ t ], [ t + 1 ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0), r = __PRIVATE_documentTargetStore(e);
        let i = __PRIVATE_documentKeySet();
        return r.Y({
            range: n,
            J: !0
        }, ((e, t, n) => {
            const r = __PRIVATE_decodeResourcePath(e[1]), s = new DocumentKey(r);
            i = i.add(s);
        })).next((() => i));
    }
    containsKey(e, t) {
        const n = __PRIVATE_encodeResourcePath(t.path), r = IDBKeyRange.bound([ n ], [ __PRIVATE_immediateSuccessor(n) ], 
        /*lowerOpen=*/ !1, 
        /*upperOpen=*/ !0);
        let i = 0;
        return __PRIVATE_documentTargetStore(e).Y({
            index: "documentTargetsIndex",
            J: !0,
            range: r
        }, (([e, t], n, r) => {
            // Having a sentinel row for a document does not count as containing that document;
            // For the target cache, containing the document means the document is part of some
            // target.
            0 !== e && (i++, r.done());
        })).next((() => i > 0));
    }
    /**
     * Looks up a TargetData entry by target ID.
     *
     * @param targetId - The target ID of the TargetData entry to look up.
     * @returns The cached TargetData entry, or null if the cache has no entry for
     * the target.
     */
    // PORTING NOTE: Multi-tab only.
    _t(e, t) {
        return __PRIVATE_targetsStore(e).get(t).next((e => e ? __PRIVATE_fromDbTarget(e) : null));
    }
}

/**
 * Helper to get a typed SimpleDbStore for the queries object store.
 */ function __PRIVATE_targetsStore(e) {
    return __PRIVATE_getStore(e, "targets");
}

/**
 * Helper to get a typed SimpleDbStore for the target globals object store.
 */ function __PRIVATE_globalTargetStore(e) {
    return __PRIVATE_getStore(e, "targetGlobal");
}

/**
 * Helper to get a typed SimpleDbStore for the document target object store.
 */ function __PRIVATE_documentTargetStore(e) {
    return __PRIVATE_getStore(e, "targetDocuments");
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
 */ function __PRIVATE_bufferEntryComparator([e, t], [n, r]) {
    const i = __PRIVATE_primitiveComparator(e, n);
    return 0 === i ? __PRIVATE_primitiveComparator(t, r) : i;
}

/**
 * Used to calculate the nth sequence number. Keeps a rolling buffer of the
 * lowest n values passed to `addElement`, and finally reports the largest of
 * them in `maxValue`.
 */ class __PRIVATE_RollingSequenceNumberBuffer {
    constructor(e) {
        this.Qn = e, this.buffer = new SortedSet(__PRIVATE_bufferEntryComparator), this.Kn = 0;
    }
    $n() {
        return ++this.Kn;
    }
    Un(e) {
        const t = [ e, this.$n() ];
        if (this.buffer.size < this.Qn) this.buffer = this.buffer.add(t); else {
            const e = this.buffer.last();
            __PRIVATE_bufferEntryComparator(t, e) < 0 && (this.buffer = this.buffer.delete(e).add(t));
        }
    }
    get maxValue() {
        // Guaranteed to be non-empty. If we decide we are not collecting any
        // sequence numbers, nthSequenceNumber below short-circuits. If we have
        // decided that we are collecting n sequence numbers, it's because n is some
        // percentage of the existing sequence numbers. That means we should never
        // be in a situation where we are collecting sequence numbers but don't
        // actually have any.
        return this.buffer.last()[0];
    }
}

/**
 * This class is responsible for the scheduling of LRU garbage collection. It handles checking
 * whether or not GC is enabled, as well as which delay to use before the next run.
 */ class __PRIVATE_LruScheduler {
    constructor(e, t, n) {
        this.garbageCollector = e, this.asyncQueue = t, this.localStore = n, this.Wn = null;
    }
    start() {
        -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this.Gn(6e4);
    }
    stop() {
        this.Wn && (this.Wn.cancel(), this.Wn = null);
    }
    get started() {
        return null !== this.Wn;
    }
    Gn(e) {
        __PRIVATE_logDebug("LruGarbageCollector", `Garbage collection scheduled in ${e}ms`), 
        this.Wn = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection" /* TimerId.LruGarbageCollection */ , e, (async () => {
            this.Wn = null;
            try {
                await this.localStore.collectGarbage(this.garbageCollector);
            } catch (e) {
                __PRIVATE_isIndexedDbTransactionError(e) ? __PRIVATE_logDebug("LruGarbageCollector", "Ignoring IndexedDB error during garbage collection: ", e) : await __PRIVATE_ignoreIfPrimaryLeaseLoss(e);
            }
            await this.Gn(3e5);
        }));
    }
}

/**
 * Implements the steps for LRU garbage collection.
 */ class __PRIVATE_LruGarbageCollectorImpl {
    constructor(e, t) {
        this.zn = e, this.params = t;
    }
    calculateTargetCount(e, t) {
        return this.zn.jn(e).next((e => Math.floor(t / 100 * e)));
    }
    nthSequenceNumber(e, t) {
        if (0 === t) return PersistencePromise.resolve(__PRIVATE_ListenSequence._e);
        const n = new __PRIVATE_RollingSequenceNumberBuffer(t);
        return this.zn.forEachTarget(e, (e => n.Un(e.sequenceNumber))).next((() => this.zn.Hn(e, (e => n.Un(e))))).next((() => n.maxValue));
    }
    removeTargets(e, t, n) {
        return this.zn.removeTargets(e, t, n);
    }
    removeOrphanedDocuments(e, t) {
        return this.zn.removeOrphanedDocuments(e, t);
    }
    collect(e, t) {
        return -1 === this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", "Garbage collection skipped; disabled"), 
        PersistencePromise.resolve(Ae)) : this.getCacheSize(e).next((n => n < this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), 
        Ae) : this.Jn(e, t)));
    }
    getCacheSize(e) {
        return this.zn.getCacheSize(e);
    }
    Jn(e, t) {
        let n, r, i, s, o, a, u;
        const c = Date.now();
        return this.calculateTargetCount(e, this.params.percentileToCollect).next((t => (
        // Cap at the configured max
        t > this.params.maximumSequenceNumbersToCollect ? (__PRIVATE_logDebug("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`), 
        r = this.params.maximumSequenceNumbersToCollect) : r = t, s = Date.now(), this.nthSequenceNumber(e, r)))).next((r => (n = r, 
        o = Date.now(), this.removeTargets(e, n, t)))).next((t => (i = t, a = Date.now(), 
        this.removeOrphanedDocuments(e, n)))).next((e => {
            if (u = Date.now(), __PRIVATE_getLogLevel() <= _.DEBUG) {
                __PRIVATE_logDebug("LruGarbageCollector", `LRU Garbage Collection\n\tCounted targets in ${s - c}ms\n\tDetermined least recently used ${r} in ` + (o - s) + "ms\n" + `\tRemoved ${i} targets in ` + (a - o) + "ms\n" + `\tRemoved ${e} documents in ` + (u - a) + "ms\n" + `Total Duration: ${u - c}ms`);
            }
            return PersistencePromise.resolve({
                didRun: !0,
                sequenceNumbersCollected: r,
                targetsRemoved: i,
                documentsRemoved: e
            });
        }));
    }
}

function __PRIVATE_newLruGarbageCollector(e, t) {
    return new __PRIVATE_LruGarbageCollectorImpl(e, t);
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
/** Provides LRU functionality for IndexedDB persistence. */ class __PRIVATE_IndexedDbLruDelegateImpl {
    constructor(e, t) {
        this.db = e, this.garbageCollector = __PRIVATE_newLruGarbageCollector(this, t);
    }
    jn(e) {
        const t = this.Yn(e);
        return this.db.getTargetCache().getTargetCount(e).next((e => t.next((t => e + t))));
    }
    Yn(e) {
        let t = 0;
        return this.Hn(e, (e => {
            t++;
        })).next((() => t));
    }
    forEachTarget(e, t) {
        return this.db.getTargetCache().forEachTarget(e, t);
    }
    Hn(e, t) {
        return this.Zn(e, ((e, n) => t(n)));
    }
    addReference(e, t, n) {
        return __PRIVATE_writeSentinelKey(e, n);
    }
    removeReference(e, t, n) {
        return __PRIVATE_writeSentinelKey(e, n);
    }
    removeTargets(e, t, n) {
        return this.db.getTargetCache().removeTargets(e, t, n);
    }
    markPotentiallyOrphaned(e, t) {
        return __PRIVATE_writeSentinelKey(e, t);
    }
    /**
     * Returns true if anything would prevent this document from being garbage
     * collected, given that the document in question is not present in any
     * targets and has a sequence number less than or equal to the upper bound for
     * the collection run.
     */    Xn(e, t) {
        return function __PRIVATE_mutationQueuesContainKey(e, t) {
            let n = !1;
            return __PRIVATE_mutationQueuesStore(e).Z((r => __PRIVATE_mutationQueueContainsKey(e, r, t).next((e => (e && (n = !0), 
            PersistencePromise.resolve(!e)))))).next((() => n));
        }(e, t);
    }
    removeOrphanedDocuments(e, t) {
        const n = this.db.getRemoteDocumentCache().newChangeBuffer(), r = [];
        let i = 0;
        return this.Zn(e, ((s, o) => {
            if (o <= t) {
                const t = this.Xn(e, s).next((t => {
                    if (!t) 
                    // Our size accounting requires us to read all documents before
                    // removing them.
                    return i++, n.getEntry(e, s).next((() => (n.removeEntry(s, SnapshotVersion.min()), 
                    __PRIVATE_documentTargetStore(e).delete(function __PRIVATE_sentinelKey$1(e) {
                        return [ 0, __PRIVATE_encodeResourcePath(e.path) ];
                    }
                    /**
 * @returns A value suitable for writing a sentinel row in the target-document
 * store.
 */ (s)))));
                }));
                r.push(t);
            }
        })).next((() => PersistencePromise.waitFor(r))).next((() => n.apply(e))).next((() => i));
    }
    removeTarget(e, t) {
        const n = t.withSequenceNumber(e.currentSequenceNumber);
        return this.db.getTargetCache().updateTargetData(e, n);
    }
    updateLimboDocument(e, t) {
        return __PRIVATE_writeSentinelKey(e, t);
    }
    /**
     * Call provided function for each document in the cache that is 'orphaned'. Orphaned
     * means not a part of any target, so the only entry in the target-document index for
     * that document will be the sentinel row (targetId 0), which will also have the sequence
     * number for the last time the document was accessed.
     */    Zn(e, t) {
        const n = __PRIVATE_documentTargetStore(e);
        let r, i = __PRIVATE_ListenSequence._e;
        return n.Y({
            index: "documentTargetsIndex"
        }, (([e, n], {path: s, sequenceNumber: o}) => {
            0 === e ? (
            // if nextToReport is valid, report it, this is a new key so the
            // last one must not be a member of any targets.
            i !== __PRIVATE_ListenSequence._e && t(new DocumentKey(__PRIVATE_decodeResourcePath(r)), i), 
            // set nextToReport to be this sequence number. It's the next one we
            // might report, if we don't find any targets for this document.
            // Note that the sequence number must be defined when the targetId
            // is 0.
            i = o, r = s) : 
            // set nextToReport to be invalid, we know we don't need to report
            // this one since we found a target for it.
            i = __PRIVATE_ListenSequence._e;
        })).next((() => {
            // Since we report sequence numbers after getting to the next key, we
            // need to check if the last key we iterated over was an orphaned
            // document and report it.
            i !== __PRIVATE_ListenSequence._e && t(new DocumentKey(__PRIVATE_decodeResourcePath(r)), i);
        }));
    }
    getCacheSize(e) {
        return this.db.getRemoteDocumentCache().getSize(e);
    }
}

function __PRIVATE_writeSentinelKey(e, t) {
    return __PRIVATE_documentTargetStore(e).put(function __PRIVATE_sentinelRow(e, t) {
        return {
            targetId: 0,
            path: __PRIVATE_encodeResourcePath(e.path),
            sequenceNumber: t
        };
    }(t, e.currentSequenceNumber));
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
 * An in-memory buffer of entries to be written to a RemoteDocumentCache.
 * It can be used to batch up a set of changes to be written to the cache, but
 * additionally supports reading entries back with the `getEntry()` method,
 * falling back to the underlying RemoteDocumentCache if no entry is
 * buffered.
 *
 * Entries added to the cache *must* be read first. This is to facilitate
 * calculating the size delta of the pending changes.
 *
 * PORTING NOTE: This class was implemented then removed from other platforms.
 * If byte-counting ends up being needed on the other platforms, consider
 * porting this class as part of that implementation work.
 */ class RemoteDocumentChangeBuffer {
    constructor() {
        // A mapping of document key to the new cache entry that should be written.
        this.changes = new ObjectMap((e => e.toString()), ((e, t) => e.isEqual(t))), this.changesApplied = !1;
    }
    /**
     * Buffers a `RemoteDocumentCache.addEntry()` call.
     *
     * You can only modify documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */    addEntry(e) {
        this.assertNotApplied(), this.changes.set(e.key, e);
    }
    /**
     * Buffers a `RemoteDocumentCache.removeEntry()` call.
     *
     * You can only remove documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */    removeEntry(e, t) {
        this.assertNotApplied(), this.changes.set(e, MutableDocument.newInvalidDocument(e).setReadTime(t));
    }
    /**
     * Looks up an entry in the cache. The buffered changes will first be checked,
     * and if no buffered change applies, this will forward to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKey - The key of the entry to look up.
     * @returns The cached document or an invalid document if we have nothing
     * cached.
     */    getEntry(e, t) {
        this.assertNotApplied();
        const n = this.changes.get(t);
        return void 0 !== n ? PersistencePromise.resolve(n) : this.getFromCache(e, t);
    }
    /**
     * Looks up several entries in the cache, forwarding to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKeys - The keys of the entries to look up.
     * @returns A map of cached documents, indexed by key. If an entry cannot be
     *     found, the corresponding key will be mapped to an invalid document.
     */    getEntries(e, t) {
        return this.getAllFromCache(e, t);
    }
    /**
     * Applies buffered changes to the underlying RemoteDocumentCache, using
     * the provided transaction.
     */    apply(e) {
        return this.assertNotApplied(), this.changesApplied = !0, this.applyChanges(e);
    }
    /** Helper to assert this.changes is not null  */    assertNotApplied() {}
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
 * The RemoteDocumentCache for IndexedDb. To construct, invoke
 * `newIndexedDbRemoteDocumentCache()`.
 */ class __PRIVATE_IndexedDbRemoteDocumentCacheImpl {
    constructor(e) {
        this.serializer = e;
    }
    setIndexManager(e) {
        this.indexManager = e;
    }
    /**
     * Adds the supplied entries to the cache.
     *
     * All calls of `addEntry` are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()` to ensure proper accounting of metadata.
     */    addEntry(e, t, n) {
        return __PRIVATE_remoteDocumentsStore(e).put(n);
    }
    /**
     * Removes a document from the cache.
     *
     * All calls of `removeEntry`  are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()` to ensure proper accounting of metadata.
     */    removeEntry(e, t, n) {
        return __PRIVATE_remoteDocumentsStore(e).delete(
        /**
 * Returns a key that can be used for document lookups via the primary key of
 * the DbRemoteDocument object store.
 */
        function __PRIVATE_dbReadTimeKey(e, t) {
            const n = e.path.toArray();
            return [ 
            /* prefix path */ n.slice(0, n.length - 2), 
            /* collection id */ n[n.length - 2], __PRIVATE_toDbTimestampKey(t), 
            /* document id */ n[n.length - 1] ];
        }
        /**
 * Returns a key that can be used for document lookups on the
 * `DbRemoteDocumentDocumentCollectionGroupIndex` index.
 */ (t, n));
    }
    /**
     * Updates the current cache size.
     *
     * Callers to `addEntry()` and `removeEntry()` *must* call this afterwards to update the
     * cache's metadata.
     */    updateMetadata(e, t) {
        return this.getMetadata(e).next((n => (n.byteSize += t, this.er(e, n))));
    }
    getEntry(e, t) {
        let n = MutableDocument.newInvalidDocument(t);
        return __PRIVATE_remoteDocumentsStore(e).Y({
            index: "documentKeyIndex",
            range: IDBKeyRange.only(__PRIVATE_dbKey(t))
        }, ((e, r) => {
            n = this.tr(t, r);
        })).next((() => n));
    }
    /**
     * Looks up an entry in the cache.
     *
     * @param documentKey - The key of the entry to look up.
     * @returns The cached document entry and its size.
     */    nr(e, t) {
        let n = {
            size: 0,
            document: MutableDocument.newInvalidDocument(t)
        };
        return __PRIVATE_remoteDocumentsStore(e).Y({
            index: "documentKeyIndex",
            range: IDBKeyRange.only(__PRIVATE_dbKey(t))
        }, ((e, r) => {
            n = {
                document: this.tr(t, r),
                size: __PRIVATE_dbDocumentSize(r)
            };
        })).next((() => n));
    }
    getEntries(e, t) {
        let n = __PRIVATE_mutableDocumentMap();
        return this.rr(e, t, ((e, t) => {
            const r = this.tr(e, t);
            n = n.insert(e, r);
        })).next((() => n));
    }
    /**
     * Looks up several entries in the cache.
     *
     * @param documentKeys - The set of keys entries to look up.
     * @returns A map of documents indexed by key and a map of sizes indexed by
     *     key (zero if the document does not exist).
     */    ir(e, t) {
        let n = __PRIVATE_mutableDocumentMap(), r = new SortedMap(DocumentKey.comparator);
        return this.rr(e, t, ((e, t) => {
            const i = this.tr(e, t);
            n = n.insert(e, i), r = r.insert(e, __PRIVATE_dbDocumentSize(t));
        })).next((() => ({
            documents: n,
            sr: r
        })));
    }
    rr(e, t, n) {
        if (t.isEmpty()) return PersistencePromise.resolve();
        let r = new SortedSet(__PRIVATE_dbKeyComparator);
        t.forEach((e => r = r.add(e)));
        const i = IDBKeyRange.bound(__PRIVATE_dbKey(r.first()), __PRIVATE_dbKey(r.last())), s = r.getIterator();
        let o = s.getNext();
        return __PRIVATE_remoteDocumentsStore(e).Y({
            index: "documentKeyIndex",
            range: i
        }, ((e, t, r) => {
            const i = DocumentKey.fromSegments([ ...t.prefixPath, t.collectionGroup, t.documentId ]);
            // Go through keys not found in cache.
                        for (;o && __PRIVATE_dbKeyComparator(o, i) < 0; ) n(o, null), o = s.getNext();
            o && o.isEqual(i) && (
            // Key found in cache.
            n(o, t), o = s.hasNext() ? s.getNext() : null), 
            // Skip to the next key (if there is one).
            o ? r.U(__PRIVATE_dbKey(o)) : r.done();
        })).next((() => {
            // The rest of the keys are not in the cache. One case where `iterate`
            // above won't go through them is when the cache is empty.
            for (;o; ) n(o, null), o = s.hasNext() ? s.getNext() : null;
        }));
    }
    getDocumentsMatchingQuery(e, t, n, r, i) {
        const s = t.path, o = [ s.popLast().toArray(), s.lastSegment(), __PRIVATE_toDbTimestampKey(n.readTime), n.documentKey.path.isEmpty() ? "" : n.documentKey.path.lastSegment() ], _ = [ s.popLast().toArray(), s.lastSegment(), [ Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER ], "" ];
        return __PRIVATE_remoteDocumentsStore(e).W(IDBKeyRange.bound(o, _, !0)).next((e => {
            null == i || i.incrementDocumentReadCount(e.length);
            let n = __PRIVATE_mutableDocumentMap();
            for (const i of e) {
                const e = this.tr(DocumentKey.fromSegments(i.prefixPath.concat(i.collectionGroup, i.documentId)), i);
                e.isFoundDocument() && (__PRIVATE_queryMatches(t, e) || r.has(e.key)) && (
                // Either the document matches the given query, or it is mutated.
                n = n.insert(e.key, e));
            }
            return n;
        }));
    }
    getAllFromCollectionGroup(e, t, n, r) {
        let i = __PRIVATE_mutableDocumentMap();
        const s = __PRIVATE_dbCollectionGroupKey(t, n), o = __PRIVATE_dbCollectionGroupKey(t, IndexOffset.max());
        return __PRIVATE_remoteDocumentsStore(e).Y({
            index: "collectionGroupIndex",
            range: IDBKeyRange.bound(s, o, !0)
        }, ((e, t, n) => {
            const s = this.tr(DocumentKey.fromSegments(t.prefixPath.concat(t.collectionGroup, t.documentId)), t);
            i = i.insert(s.key, s), i.size === r && n.done();
        })).next((() => i));
    }
    newChangeBuffer(e) {
        return new __PRIVATE_IndexedDbRemoteDocumentChangeBuffer(this, !!e && e.trackRemovals);
    }
    getSize(e) {
        return this.getMetadata(e).next((e => e.byteSize));
    }
    getMetadata(e) {
        return __PRIVATE_documentGlobalStore(e).get("remoteDocumentGlobalKey").next((e => (__PRIVATE_hardAssert(!!e), 
        e)));
    }
    er(e, t) {
        return __PRIVATE_documentGlobalStore(e).put("remoteDocumentGlobalKey", t);
    }
    /**
     * Decodes `dbRemoteDoc` and returns the document (or an invalid document if
     * the document corresponds to the format used for sentinel deletes).
     */    tr(e, t) {
        if (t) {
            const e = __PRIVATE_fromDbRemoteDocument(this.serializer, t);
            // Whether the document is a sentinel removal and should only be used in the
            // `getNewDocumentChanges()`
                        if (!(e.isNoDocument() && e.version.isEqual(SnapshotVersion.min()))) return e;
        }
        return MutableDocument.newInvalidDocument(e);
    }
}

/** Creates a new IndexedDbRemoteDocumentCache. */ function __PRIVATE_newIndexedDbRemoteDocumentCache(e) {
    return new __PRIVATE_IndexedDbRemoteDocumentCacheImpl(e);
}

/**
 * Handles the details of adding and updating documents in the IndexedDbRemoteDocumentCache.
 *
 * Unlike the MemoryRemoteDocumentChangeBuffer, the IndexedDb implementation computes the size
 * delta for all submitted changes. This avoids having to re-read all documents from IndexedDb
 * when we apply the changes.
 */ class __PRIVATE_IndexedDbRemoteDocumentChangeBuffer extends RemoteDocumentChangeBuffer {
    /**
     * @param documentCache - The IndexedDbRemoteDocumentCache to apply the changes to.
     * @param trackRemovals - Whether to create sentinel deletes that can be tracked by
     * `getNewDocumentChanges()`.
     */
    constructor(e, t) {
        super(), this._r = e, this.trackRemovals = t, 
        // A map of document sizes and read times prior to applying the changes in
        // this buffer.
        this.ar = new ObjectMap((e => e.toString()), ((e, t) => e.isEqual(t)));
    }
    applyChanges(e) {
        const t = [];
        let n = 0, r = new SortedSet(((e, t) => __PRIVATE_primitiveComparator(e.canonicalString(), t.canonicalString())));
        return this.changes.forEach(((i, s) => {
            const o = this.ar.get(i);
            if (t.push(this._r.removeEntry(e, i, o.readTime)), s.isValidDocument()) {
                const _ = __PRIVATE_toDbRemoteDocument(this._r.serializer, s);
                r = r.add(i.path.popLast());
                const a = __PRIVATE_dbDocumentSize(_);
                n += a - o.size, t.push(this._r.addEntry(e, i, _));
            } else if (n -= o.size, this.trackRemovals) {
                // In order to track removals, we store a "sentinel delete" in the
                // RemoteDocumentCache. This entry is represented by a NoDocument
                // with a version of 0 and ignored by `maybeDecodeDocument()` but
                // preserved in `getNewDocumentChanges()`.
                const n = __PRIVATE_toDbRemoteDocument(this._r.serializer, s.convertToNoDocument(SnapshotVersion.min()));
                t.push(this._r.addEntry(e, i, n));
            }
        })), r.forEach((n => {
            t.push(this._r.indexManager.addToCollectionParentIndex(e, n));
        })), t.push(this._r.updateMetadata(e, n)), PersistencePromise.waitFor(t);
    }
    getFromCache(e, t) {
        // Record the size of everything we load from the cache so we can compute a delta later.
        return this._r.nr(e, t).next((e => (this.ar.set(t, {
            size: e.size,
            readTime: e.document.readTime
        }), e.document)));
    }
    getAllFromCache(e, t) {
        // Record the size of everything we load from the cache so we can compute
        // a delta later.
        return this._r.ir(e, t).next((({documents: e, sr: t}) => (
        // Note: `getAllFromCache` returns two maps instead of a single map from
        // keys to `DocumentSizeEntry`s. This is to allow returning the
        // `MutableDocumentMap` directly, without a conversion.
        t.forEach(((t, n) => {
            this.ar.set(t, {
                size: n,
                readTime: e.get(t).readTime
            });
        })), e)));
    }
}

function __PRIVATE_documentGlobalStore(e) {
    return __PRIVATE_getStore(e, "remoteDocumentGlobal");
}

/**
 * Helper to get a typed SimpleDbStore for the remoteDocuments object store.
 */ function __PRIVATE_remoteDocumentsStore(e) {
    return __PRIVATE_getStore(e, "remoteDocumentsV14");
}

/**
 * Returns a key that can be used for document lookups on the
 * `DbRemoteDocumentDocumentKeyIndex` index.
 */ function __PRIVATE_dbKey(e) {
    const t = e.path.toArray();
    return [ 
    /* prefix path */ t.slice(0, t.length - 2), 
    /* collection id */ t[t.length - 2], 
    /* document id */ t[t.length - 1] ];
}

function __PRIVATE_dbCollectionGroupKey(e, t) {
    const n = t.documentKey.path.toArray();
    return [ 
    /* collection id */ e, __PRIVATE_toDbTimestampKey(t.readTime), 
    /* prefix path */ n.slice(0, n.length - 2), 
    /* document id */ n.length > 0 ? n[n.length - 1] : "" ];
}

/**
 * Comparator that compares document keys according to the primary key sorting
 * used by the `DbRemoteDocumentDocument` store (by prefix path, collection id
 * and then document ID).
 *
 * Visible for testing.
 */ function __PRIVATE_dbKeyComparator(e, t) {
    const n = e.path.toArray(), r = t.path.toArray();
    // The ordering is based on https://chromium.googlesource.com/chromium/blink/+/fe5c21fef94dae71c1c3344775b8d8a7f7e6d9ec/Source/modules/indexeddb/IDBKey.cpp#74
    let i = 0;
    for (let e = 0; e < n.length - 2 && e < r.length - 2; ++e) if (i = __PRIVATE_primitiveComparator(n[e], r[e]), 
    i) return i;
    return i = __PRIVATE_primitiveComparator(n.length, r.length), i || (i = __PRIVATE_primitiveComparator(n[n.length - 2], r[r.length - 2]), 
    i || __PRIVATE_primitiveComparator(n[n.length - 1], r[r.length - 1]));
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
 * Schema Version for the Web client:
 * 1.  Initial version including Mutation Queue, Query Cache, and Remote
 *     Document Cache
 * 2.  Used to ensure a targetGlobal object exists and add targetCount to it. No
 *     longer required because migration 3 unconditionally clears it.
 * 3.  Dropped and re-created Query Cache to deal with cache corruption related
 *     to limbo resolution. Addresses
 *     https://github.com/firebase/firebase-ios-sdk/issues/1548
 * 4.  Multi-Tab Support.
 * 5.  Removal of held write acks.
 * 6.  Create document global for tracking document cache size.
 * 7.  Ensure every cached document has a sentinel row with a sequence number.
 * 8.  Add collection-parent index for Collection Group queries.
 * 9.  Change RemoteDocumentChanges store to be keyed by readTime rather than
 *     an auto-incrementing ID. This is required for Index-Free queries.
 * 10. Rewrite the canonical IDs to the explicit Protobuf-based format.
 * 11. Add bundles and named_queries for bundle support.
 * 12. Add document overlays.
 * 13. Rewrite the keys of the remote document cache to allow for efficient
 *     document lookup via `getAll()`.
 * 14. Add overlays.
 * 15. Add indexing support.
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
 * Represents a local view (overlay) of a document, and the fields that are
 * locally mutated.
 */
class OverlayedDocument {
    constructor(e, 
    /**
     * The fields that are locally mutated by patch mutations.
     *
     * If the overlayed	document is from set or delete mutations, this is `null`.
     * If there is no overlay (mutation) for the document, this is an empty `FieldMask`.
     */
    t) {
        this.overlayedDocument = e, this.mutatedFields = t;
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
 * A readonly view of the local state of all documents we're tracking (i.e. we
 * have a cached version in remoteDocumentCache or local mutations for the
 * document). The view is computed by applying the mutations in the
 * MutationQueue to the RemoteDocumentCache.
 */ class LocalDocumentsView {
    constructor(e, t, n, r) {
        this.remoteDocumentCache = e, this.mutationQueue = t, this.documentOverlayCache = n, 
        this.indexManager = r;
    }
    /**
     * Get the local view of the document identified by `key`.
     *
     * @returns Local view of the document or null if we don't have any cached
     * state for it.
     */    getDocument(e, t) {
        let n = null;
        return this.documentOverlayCache.getOverlay(e, t).next((r => (n = r, this.remoteDocumentCache.getEntry(e, t)))).next((e => (null !== n && __PRIVATE_mutationApplyToLocalView(n.mutation, e, FieldMask.empty(), Timestamp.now()), 
        e)));
    }
    /**
     * Gets the local view of the documents identified by `keys`.
     *
     * If we don't have cached state for a document in `keys`, a NoDocument will
     * be stored for that key in the resulting set.
     */    getDocuments(e, t) {
        return this.remoteDocumentCache.getEntries(e, t).next((t => this.getLocalViewOfDocuments(e, t, __PRIVATE_documentKeySet()).next((() => t))));
    }
    /**
     * Similar to `getDocuments`, but creates the local view from the given
     * `baseDocs` without retrieving documents from the local store.
     *
     * @param transaction - The transaction this operation is scoped to.
     * @param docs - The documents to apply local mutations to get the local views.
     * @param existenceStateChanged - The set of document keys whose existence state
     *   is changed. This is useful to determine if some documents overlay needs
     *   to be recalculated.
     */    getLocalViewOfDocuments(e, t, n = __PRIVATE_documentKeySet()) {
        const r = __PRIVATE_newOverlayMap();
        return this.populateOverlays(e, r, t).next((() => this.computeViews(e, t, r, n).next((e => {
            let t = documentMap();
            return e.forEach(((e, n) => {
                t = t.insert(e, n.overlayedDocument);
            })), t;
        }))));
    }
    /**
     * Gets the overlayed documents for the given document map, which will include
     * the local view of those documents and a `FieldMask` indicating which fields
     * are mutated locally, `null` if overlay is a Set or Delete mutation.
     */    getOverlayedDocuments(e, t) {
        const n = __PRIVATE_newOverlayMap();
        return this.populateOverlays(e, n, t).next((() => this.computeViews(e, t, n, __PRIVATE_documentKeySet())));
    }
    /**
     * Fetches the overlays for {@code docs} and adds them to provided overlay map
     * if the map does not already contain an entry for the given document key.
     */    populateOverlays(e, t, n) {
        const r = [];
        return n.forEach((e => {
            t.has(e) || r.push(e);
        })), this.documentOverlayCache.getOverlays(e, r).next((e => {
            e.forEach(((e, n) => {
                t.set(e, n);
            }));
        }));
    }
    /**
     * Computes the local view for the given documents.
     *
     * @param docs - The documents to compute views for. It also has the base
     *   version of the documents.
     * @param overlays - The overlays that need to be applied to the given base
     *   version of the documents.
     * @param existenceStateChanged - A set of documents whose existence states
     *   might have changed. This is used to determine if we need to re-calculate
     *   overlays from mutation queues.
     * @return A map represents the local documents view.
     */    computeViews(e, t, n, r) {
        let i = __PRIVATE_mutableDocumentMap();
        const s = __PRIVATE_newDocumentKeyMap(), o = function __PRIVATE_newOverlayedDocumentMap() {
            return __PRIVATE_newDocumentKeyMap();
        }();
        return t.forEach(((e, t) => {
            const o = n.get(t.key);
            // Recalculate an overlay if the document's existence state changed due to
            // a remote event *and* the overlay is a PatchMutation. This is because
            // document existence state can change if some patch mutation's
            // preconditions are met.
            // NOTE: we recalculate when `overlay` is undefined as well, because there
            // might be a patch mutation whose precondition does not match before the
            // change (hence overlay is undefined), but would now match.
                        r.has(t.key) && (void 0 === o || o.mutation instanceof __PRIVATE_PatchMutation) ? i = i.insert(t.key, t) : void 0 !== o ? (s.set(t.key, o.mutation.getFieldMask()), 
            __PRIVATE_mutationApplyToLocalView(o.mutation, t, o.mutation.getFieldMask(), Timestamp.now())) : 
            // no overlay exists
            // Using EMPTY to indicate there is no overlay for the document.
            s.set(t.key, FieldMask.empty());
        })), this.recalculateAndSaveOverlays(e, i).next((e => (e.forEach(((e, t) => s.set(e, t))), 
        t.forEach(((e, t) => {
            var n;
            return o.set(e, new OverlayedDocument(t, null !== (n = s.get(e)) && void 0 !== n ? n : null));
        })), o)));
    }
    recalculateAndSaveOverlays(e, t) {
        const n = __PRIVATE_newDocumentKeyMap();
        // A reverse lookup map from batch id to the documents within that batch.
                let r = new SortedMap(((e, t) => e - t)), i = __PRIVATE_documentKeySet();
        return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next((e => {
            for (const i of e) i.keys().forEach((e => {
                const s = t.get(e);
                if (null === s) return;
                let o = n.get(e) || FieldMask.empty();
                o = i.applyToLocalView(s, o), n.set(e, o);
                const _ = (r.get(i.batchId) || __PRIVATE_documentKeySet()).add(e);
                r = r.insert(i.batchId, _);
            }));
        })).next((() => {
            const s = [], o = r.getReverseIterator();
            // Iterate in descending order of batch IDs, and skip documents that are
            // already saved.
                        for (;o.hasNext(); ) {
                const r = o.getNext(), _ = r.key, a = r.value, u = __PRIVATE_newMutationMap();
                a.forEach((e => {
                    if (!i.has(e)) {
                        const r = __PRIVATE_calculateOverlayMutation(t.get(e), n.get(e));
                        null !== r && u.set(e, r), i = i.add(e);
                    }
                })), s.push(this.documentOverlayCache.saveOverlays(e, _, u));
            }
            return PersistencePromise.waitFor(s);
        })).next((() => n));
    }
    /**
     * Recalculates overlays by reading the documents from remote document cache
     * first, and saves them after they are calculated.
     */    recalculateAndSaveOverlaysForDocumentKeys(e, t) {
        return this.remoteDocumentCache.getEntries(e, t).next((t => this.recalculateAndSaveOverlays(e, t)));
    }
    /**
     * Performs a query against the local view of all documents.
     *
     * @param transaction - The persistence transaction.
     * @param query - The query to match documents against.
     * @param offset - Read time and key to start scanning by (exclusive).
     * @param context - A optional tracker to keep a record of important details
     *   during database local query execution.
     */    getDocumentsMatchingQuery(e, t, n, r) {
        /**
 * Returns whether the query matches a single document by path (rather than a
 * collection).
 */
        return function __PRIVATE_isDocumentQuery$1(e) {
            return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
        }(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : __PRIVATE_isCollectionGroupQuery(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, n, r) : this.getDocumentsMatchingCollectionQuery(e, t, n, r);
    }
    /**
     * Given a collection group, returns the next documents that follow the provided offset, along
     * with an updated batch ID.
     *
     * <p>The documents returned by this method are ordered by remote version from the provided
     * offset. If there are no more remote documents after the provided offset, documents with
     * mutations in order of batch id from the offset are returned. Since all documents in a batch are
     * returned together, the total number of documents returned can exceed {@code count}.
     *
     * @param transaction
     * @param collectionGroup The collection group for the documents.
     * @param offset The offset to index into.
     * @param count The number of documents to return
     * @return A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
     */    getNextDocuments(e, t, n, r) {
        return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, n, r).next((i => {
            const s = r - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, n.largestBatchId, r - i.size) : PersistencePromise.resolve(__PRIVATE_newOverlayMap());
            // The callsite will use the largest batch ID together with the latest read time to create
            // a new index offset. Since we only process batch IDs if all remote documents have been read,
            // no overlay will increase the overall read time. This is why we only need to special case
            // the batch id.
                        let o = -1, _ = i;
            return s.next((t => PersistencePromise.forEach(t, ((t, n) => (o < n.largestBatchId && (o = n.largestBatchId), 
            i.get(t) ? PersistencePromise.resolve() : this.remoteDocumentCache.getEntry(e, t).next((e => {
                _ = _.insert(t, e);
            }))))).next((() => this.populateOverlays(e, t, i))).next((() => this.computeViews(e, _, t, __PRIVATE_documentKeySet()))).next((e => ({
                batchId: o,
                changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e)
            })))));
        }));
    }
    getDocumentsMatchingDocumentQuery(e, t) {
        // Just do a simple document lookup.
        return this.getDocument(e, new DocumentKey(t)).next((e => {
            let t = documentMap();
            return e.isFoundDocument() && (t = t.insert(e.key, e)), t;
        }));
    }
    getDocumentsMatchingCollectionGroupQuery(e, t, n, r) {
        const i = t.collectionGroup;
        let s = documentMap();
        return this.indexManager.getCollectionParents(e, i).next((o => PersistencePromise.forEach(o, (o => {
            const _ = function __PRIVATE_asCollectionQueryAtPath(e, t) {
                return new __PRIVATE_QueryImpl(t, 
                /*collectionGroup=*/ null, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
            }(t, o.child(i));
            return this.getDocumentsMatchingCollectionQuery(e, _, n, r).next((e => {
                e.forEach(((e, t) => {
                    s = s.insert(e, t);
                }));
            }));
        })).next((() => s))));
    }
    getDocumentsMatchingCollectionQuery(e, t, n, r) {
        // Query the remote documents and overlay mutations.
        let i;
        return this.documentOverlayCache.getOverlaysForCollection(e, t.path, n.largestBatchId).next((s => (i = s, 
        this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r)))).next((e => {
            // As documents might match the query because of their overlay we need to
            // include documents for all overlays in the initial document set.
            i.forEach(((t, n) => {
                const r = n.getKey();
                null === e.get(r) && (e = e.insert(r, MutableDocument.newInvalidDocument(r)));
            }));
            // Apply the overlays and match against the query.
            let n = documentMap();
            return e.forEach(((e, r) => {
                const s = i.get(e);
                void 0 !== s && __PRIVATE_mutationApplyToLocalView(s.mutation, r, FieldMask.empty(), Timestamp.now()), 
                // Finally, insert the documents that still match the query
                __PRIVATE_queryMatches(t, r) && (n = n.insert(e, r));
            })), n;
        }));
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
 */ class __PRIVATE_MemoryBundleCache {
    constructor(e) {
        this.serializer = e, this.ur = new Map, this.cr = new Map;
    }
    getBundleMetadata(e, t) {
        return PersistencePromise.resolve(this.ur.get(t));
    }
    saveBundleMetadata(e, t) {
        return this.ur.set(t.id, 
        /** Decodes a BundleMetadata proto into a BundleMetadata object. */
        function __PRIVATE_fromBundleMetadata(e) {
            return {
                id: e.id,
                version: e.version,
                createTime: __PRIVATE_fromVersion(e.createTime)
            };
        }(t)), PersistencePromise.resolve();
    }
    getNamedQuery(e, t) {
        return PersistencePromise.resolve(this.cr.get(t));
    }
    saveNamedQuery(e, t) {
        return this.cr.set(t.name, function __PRIVATE_fromProtoNamedQuery(e) {
            return {
                name: e.name,
                query: __PRIVATE_fromBundledQuery(e.bundledQuery),
                readTime: __PRIVATE_fromVersion(e.readTime)
            };
        }(t)), PersistencePromise.resolve();
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
 * An in-memory implementation of DocumentOverlayCache.
 */ class __PRIVATE_MemoryDocumentOverlayCache {
    constructor() {
        // A map sorted by DocumentKey, whose value is a pair of the largest batch id
        // for the overlay and the overlay itself.
        this.overlays = new SortedMap(DocumentKey.comparator), this.lr = new Map;
    }
    getOverlay(e, t) {
        return PersistencePromise.resolve(this.overlays.get(t));
    }
    getOverlays(e, t) {
        const n = __PRIVATE_newOverlayMap();
        return PersistencePromise.forEach(t, (t => this.getOverlay(e, t).next((e => {
            null !== e && n.set(t, e);
        })))).next((() => n));
    }
    saveOverlays(e, t, n) {
        return n.forEach(((n, r) => {
            this.lt(e, t, r);
        })), PersistencePromise.resolve();
    }
    removeOverlaysForBatchId(e, t, n) {
        const r = this.lr.get(n);
        return void 0 !== r && (r.forEach((e => this.overlays = this.overlays.remove(e))), 
        this.lr.delete(n)), PersistencePromise.resolve();
    }
    getOverlaysForCollection(e, t, n) {
        const r = __PRIVATE_newOverlayMap(), i = t.length + 1, s = new DocumentKey(t.child("")), o = this.overlays.getIteratorFrom(s);
        for (;o.hasNext(); ) {
            const e = o.getNext().value, s = e.getKey();
            if (!t.isPrefixOf(s.path)) break;
            // Documents from sub-collections
                        s.path.length === i && (e.largestBatchId > n && r.set(e.getKey(), e));
        }
        return PersistencePromise.resolve(r);
    }
    getOverlaysForCollectionGroup(e, t, n, r) {
        let i = new SortedMap(((e, t) => e - t));
        const s = this.overlays.getIterator();
        for (;s.hasNext(); ) {
            const e = s.getNext().value;
            if (e.getKey().getCollectionGroup() === t && e.largestBatchId > n) {
                let t = i.get(e.largestBatchId);
                null === t && (t = __PRIVATE_newOverlayMap(), i = i.insert(e.largestBatchId, t)), 
                t.set(e.getKey(), e);
            }
        }
        const o = __PRIVATE_newOverlayMap(), _ = i.getIterator();
        for (;_.hasNext(); ) {
            if (_.getNext().value.forEach(((e, t) => o.set(e, t))), o.size() >= r) break;
        }
        return PersistencePromise.resolve(o);
    }
    lt(e, t, n) {
        // Remove the association of the overlay to its batch id.
        const r = this.overlays.get(n.key);
        if (null !== r) {
            const e = this.lr.get(r.largestBatchId).delete(n.key);
            this.lr.set(r.largestBatchId, e);
        }
        this.overlays = this.overlays.insert(n.key, new Overlay(t, n));
        // Create the association of this overlay to the given largestBatchId.
        let i = this.lr.get(t);
        void 0 === i && (i = __PRIVATE_documentKeySet(), this.lr.set(t, i)), this.lr.set(t, i.add(n.key));
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
 * A collection of references to a document from some kind of numbered entity
 * (either a target ID or batch ID). As references are added to or removed from
 * the set corresponding events are emitted to a registered garbage collector.
 *
 * Each reference is represented by a DocumentReference object. Each of them
 * contains enough information to uniquely identify the reference. They are all
 * stored primarily in a set sorted by key. A document is considered garbage if
 * there's no references in that set (this can be efficiently checked thanks to
 * sorting by key).
 *
 * ReferenceSet also keeps a secondary set that contains references sorted by
 * IDs. This one is used to efficiently implement removal of all references by
 * some target ID.
 */ class __PRIVATE_ReferenceSet {
    constructor() {
        // A set of outstanding references to a document sorted by key.
        this.hr = new SortedSet(__PRIVATE_DocReference.Pr), 
        // A set of outstanding references to a document sorted by target id.
        this.Ir = new SortedSet(__PRIVATE_DocReference.Tr);
    }
    /** Returns true if the reference set contains no references. */    isEmpty() {
        return this.hr.isEmpty();
    }
    /** Adds a reference to the given document key for the given ID. */    addReference(e, t) {
        const n = new __PRIVATE_DocReference(e, t);
        this.hr = this.hr.add(n), this.Ir = this.Ir.add(n);
    }
    /** Add references to the given document keys for the given ID. */    Er(e, t) {
        e.forEach((e => this.addReference(e, t)));
    }
    /**
     * Removes a reference to the given document key for the given
     * ID.
     */    removeReference(e, t) {
        this.dr(new __PRIVATE_DocReference(e, t));
    }
    Ar(e, t) {
        e.forEach((e => this.removeReference(e, t)));
    }
    /**
     * Clears all references with a given ID. Calls removeRef() for each key
     * removed.
     */    Rr(e) {
        const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1), i = [];
        return this.Ir.forEachInRange([ n, r ], (e => {
            this.dr(e), i.push(e.key);
        })), i;
    }
    Vr() {
        this.hr.forEach((e => this.dr(e)));
    }
    dr(e) {
        this.hr = this.hr.delete(e), this.Ir = this.Ir.delete(e);
    }
    mr(e) {
        const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1);
        let i = __PRIVATE_documentKeySet();
        return this.Ir.forEachInRange([ n, r ], (e => {
            i = i.add(e.key);
        })), i;
    }
    containsKey(e) {
        const t = new __PRIVATE_DocReference(e, 0), n = this.hr.firstAfterOrEqual(t);
        return null !== n && e.isEqual(n.key);
    }
}

class __PRIVATE_DocReference {
    constructor(e, t) {
        this.key = e, this.gr = t;
    }
    /** Compare by key then by ID */    static Pr(e, t) {
        return DocumentKey.comparator(e.key, t.key) || __PRIVATE_primitiveComparator(e.gr, t.gr);
    }
    /** Compare by ID then by key */    static Tr(e, t) {
        return __PRIVATE_primitiveComparator(e.gr, t.gr) || DocumentKey.comparator(e.key, t.key);
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
 */ class __PRIVATE_MemoryMutationQueue {
    constructor(e, t) {
        this.indexManager = e, this.referenceDelegate = t, 
        /**
         * The set of all mutations that have been sent but not yet been applied to
         * the backend.
         */
        this.mutationQueue = [], 
        /** Next value to use when assigning sequential IDs to each mutation batch. */
        this.pr = 1, 
        /** An ordered mapping between documents and the mutations batch IDs. */
        this.yr = new SortedSet(__PRIVATE_DocReference.Pr);
    }
    checkEmpty(e) {
        return PersistencePromise.resolve(0 === this.mutationQueue.length);
    }
    addMutationBatch(e, t, n, r) {
        const i = this.pr;
        this.pr++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
        const s = new MutationBatch(i, t, n, r);
        this.mutationQueue.push(s);
        // Track references by document key and index collection parents.
        for (const t of r) this.yr = this.yr.add(new __PRIVATE_DocReference(t.key, i)), 
        this.indexManager.addToCollectionParentIndex(e, t.key.path.popLast());
        return PersistencePromise.resolve(s);
    }
    lookupMutationBatch(e, t) {
        return PersistencePromise.resolve(this.wr(t));
    }
    getNextMutationBatchAfterBatchId(e, t) {
        const n = t + 1, r = this.Sr(n), i = r < 0 ? 0 : r;
        // The requested batchId may still be out of range so normalize it to the
        // start of the queue.
                return PersistencePromise.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
    }
    getHighestUnacknowledgedBatchId() {
        return PersistencePromise.resolve(0 === this.mutationQueue.length ? -1 : this.pr - 1);
    }
    getAllMutationBatches(e) {
        return PersistencePromise.resolve(this.mutationQueue.slice());
    }
    getAllMutationBatchesAffectingDocumentKey(e, t) {
        const n = new __PRIVATE_DocReference(t, 0), r = new __PRIVATE_DocReference(t, Number.POSITIVE_INFINITY), i = [];
        return this.yr.forEachInRange([ n, r ], (e => {
            const t = this.wr(e.gr);
            i.push(t);
        })), PersistencePromise.resolve(i);
    }
    getAllMutationBatchesAffectingDocumentKeys(e, t) {
        let n = new SortedSet(__PRIVATE_primitiveComparator);
        return t.forEach((e => {
            const t = new __PRIVATE_DocReference(e, 0), r = new __PRIVATE_DocReference(e, Number.POSITIVE_INFINITY);
            this.yr.forEachInRange([ t, r ], (e => {
                n = n.add(e.gr);
            }));
        })), PersistencePromise.resolve(this.br(n));
    }
    getAllMutationBatchesAffectingQuery(e, t) {
        // Use the query path as a prefix for testing if a document matches the
        // query.
        const n = t.path, r = n.length + 1;
        // Construct a document reference for actually scanning the index. Unlike
        // the prefix the document key in this reference must have an even number of
        // segments. The empty segment can be used a suffix of the query path
        // because it precedes all other segments in an ordered traversal.
        let i = n;
        DocumentKey.isDocumentKey(i) || (i = i.child(""));
        const s = new __PRIVATE_DocReference(new DocumentKey(i), 0);
        // Find unique batchIDs referenced by all documents potentially matching the
        // query.
                let o = new SortedSet(__PRIVATE_primitiveComparator);
        return this.yr.forEachWhile((e => {
            const t = e.key.path;
            return !!n.isPrefixOf(t) && (
            // Rows with document keys more than one segment longer than the query
            // path can't be matches. For example, a query on 'rooms' can't match
            // the document /rooms/abc/messages/xyx.
            // TODO(mcg): we'll need a different scanner when we implement
            // ancestor queries.
            t.length === r && (o = o.add(e.gr)), !0);
        }), s), PersistencePromise.resolve(this.br(o));
    }
    br(e) {
        // Construct an array of matching batches, sorted by batchID to ensure that
        // multiple mutations affecting the same document key are applied in order.
        const t = [];
        return e.forEach((e => {
            const n = this.wr(e);
            null !== n && t.push(n);
        })), t;
    }
    removeMutationBatch(e, t) {
        __PRIVATE_hardAssert(0 === this.Dr(t.batchId, "removed")), this.mutationQueue.shift();
        let n = this.yr;
        return PersistencePromise.forEach(t.mutations, (r => {
            const i = new __PRIVATE_DocReference(r.key, t.batchId);
            return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(e, r.key);
        })).next((() => {
            this.yr = n;
        }));
    }
    Fn(e) {
        // No-op since the memory mutation queue does not maintain a separate cache.
    }
    containsKey(e, t) {
        const n = new __PRIVATE_DocReference(t, 0), r = this.yr.firstAfterOrEqual(n);
        return PersistencePromise.resolve(t.isEqual(r && r.key));
    }
    performConsistencyCheck(e) {
        return this.mutationQueue.length, PersistencePromise.resolve();
    }
    /**
     * Finds the index of the given batchId in the mutation queue and asserts that
     * the resulting index is within the bounds of the queue.
     *
     * @param batchId - The batchId to search for
     * @param action - A description of what the caller is doing, phrased in passive
     * form (e.g. "acknowledged" in a routine that acknowledges batches).
     */    Dr(e, t) {
        return this.Sr(e);
    }
    /**
     * Finds the index of the given batchId in the mutation queue. This operation
     * is O(1).
     *
     * @returns The computed index of the batch with the given batchId, based on
     * the state of the queue. Note this index can be negative if the requested
     * batchId has already been remvoed from the queue or past the end of the
     * queue if the batchId is larger than the last added batch.
     */    Sr(e) {
        if (0 === this.mutationQueue.length) 
        // As an index this is past the end of the queue
        return 0;
        // Examine the front of the queue to figure out the difference between the
        // batchId and indexes in the array. Note that since the queue is ordered
        // by batchId, if the first batch has a larger batchId then the requested
        // batchId doesn't exist in the queue.
                return e - this.mutationQueue[0].batchId;
    }
    /**
     * A version of lookupMutationBatch that doesn't return a promise, this makes
     * other functions that uses this code easier to read and more efficent.
     */    wr(e) {
        const t = this.Sr(e);
        if (t < 0 || t >= this.mutationQueue.length) return null;
        return this.mutationQueue[t];
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
 * The memory-only RemoteDocumentCache for IndexedDb. To construct, invoke
 * `newMemoryRemoteDocumentCache()`.
 */
class __PRIVATE_MemoryRemoteDocumentCacheImpl {
    /**
     * @param sizer - Used to assess the size of a document. For eager GC, this is
     * expected to just return 0 to avoid unnecessarily doing the work of
     * calculating the size.
     */
    constructor(e) {
        this.Cr = e, 
        /** Underlying cache of documents and their read times. */
        this.docs = function __PRIVATE_documentEntryMap() {
            return new SortedMap(DocumentKey.comparator);
        }(), 
        /** Size of all cached documents. */
        this.size = 0;
    }
    setIndexManager(e) {
        this.indexManager = e;
    }
    /**
     * Adds the supplied entry to the cache and updates the cache size as appropriate.
     *
     * All calls of `addEntry`  are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()`.
     */    addEntry(e, t) {
        const n = t.key, r = this.docs.get(n), i = r ? r.size : 0, s = this.Cr(t);
        return this.docs = this.docs.insert(n, {
            document: t.mutableCopy(),
            size: s
        }), this.size += s - i, this.indexManager.addToCollectionParentIndex(e, n.path.popLast());
    }
    /**
     * Removes the specified entry from the cache and updates the cache size as appropriate.
     *
     * All calls of `removeEntry` are required to go through the RemoteDocumentChangeBuffer
     * returned by `newChangeBuffer()`.
     */    removeEntry(e) {
        const t = this.docs.get(e);
        t && (this.docs = this.docs.remove(e), this.size -= t.size);
    }
    getEntry(e, t) {
        const n = this.docs.get(t);
        return PersistencePromise.resolve(n ? n.document.mutableCopy() : MutableDocument.newInvalidDocument(t));
    }
    getEntries(e, t) {
        let n = __PRIVATE_mutableDocumentMap();
        return t.forEach((e => {
            const t = this.docs.get(e);
            n = n.insert(e, t ? t.document.mutableCopy() : MutableDocument.newInvalidDocument(e));
        })), PersistencePromise.resolve(n);
    }
    getDocumentsMatchingQuery(e, t, n, r) {
        let i = __PRIVATE_mutableDocumentMap();
        // Documents are ordered by key, so we can use a prefix scan to narrow down
        // the documents we need to match the query against.
                const s = t.path, o = new DocumentKey(s.child("")), _ = this.docs.getIteratorFrom(o);
        for (;_.hasNext(); ) {
            const {key: e, value: {document: o}} = _.getNext();
            if (!s.isPrefixOf(e.path)) break;
            e.path.length > s.length + 1 || (__PRIVATE_indexOffsetComparator(__PRIVATE_newIndexOffsetFromDocument(o), n) <= 0 || (r.has(o.key) || __PRIVATE_queryMatches(t, o)) && (i = i.insert(o.key, o.mutableCopy())));
        }
        return PersistencePromise.resolve(i);
    }
    getAllFromCollectionGroup(e, t, n, r) {
        // This method should only be called from the IndexBackfiller if persistence
        // is enabled.
        fail();
    }
    vr(e, t) {
        return PersistencePromise.forEach(this.docs, (e => t(e)));
    }
    newChangeBuffer(e) {
        // `trackRemovals` is ignores since the MemoryRemoteDocumentCache keeps
        // a separate changelog and does not need special handling for removals.
        return new __PRIVATE_MemoryRemoteDocumentChangeBuffer(this);
    }
    getSize(e) {
        return PersistencePromise.resolve(this.size);
    }
}

/**
 * Creates a new memory-only RemoteDocumentCache.
 *
 * @param sizer - Used to assess the size of a document. For eager GC, this is
 * expected to just return 0 to avoid unnecessarily doing the work of
 * calculating the size.
 */
/**
 * Handles the details of adding and updating documents in the MemoryRemoteDocumentCache.
 */
class __PRIVATE_MemoryRemoteDocumentChangeBuffer extends RemoteDocumentChangeBuffer {
    constructor(e) {
        super(), this._r = e;
    }
    applyChanges(e) {
        const t = [];
        return this.changes.forEach(((n, r) => {
            r.isValidDocument() ? t.push(this._r.addEntry(e, r)) : this._r.removeEntry(n);
        })), PersistencePromise.waitFor(t);
    }
    getFromCache(e, t) {
        return this._r.getEntry(e, t);
    }
    getAllFromCache(e, t) {
        return this._r.getEntries(e, t);
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
 */ class __PRIVATE_MemoryTargetCache {
    constructor(e) {
        this.persistence = e, 
        /**
         * Maps a target to the data about that target
         */
        this.Fr = new ObjectMap((e => __PRIVATE_canonifyTarget(e)), __PRIVATE_targetEquals), 
        /** The last received snapshot version. */
        this.lastRemoteSnapshotVersion = SnapshotVersion.min(), 
        /** The highest numbered target ID encountered. */
        this.highestTargetId = 0, 
        /** The highest sequence number encountered. */
        this.Mr = 0, 
        /**
         * A ordered bidirectional mapping between documents and the remote target
         * IDs.
         */
        this.Or = new __PRIVATE_ReferenceSet, this.targetCount = 0, this.Nr = __PRIVATE_TargetIdGenerator.On();
    }
    forEachTarget(e, t) {
        return this.Fr.forEach(((e, n) => t(n))), PersistencePromise.resolve();
    }
    getLastRemoteSnapshotVersion(e) {
        return PersistencePromise.resolve(this.lastRemoteSnapshotVersion);
    }
    getHighestSequenceNumber(e) {
        return PersistencePromise.resolve(this.Mr);
    }
    allocateTargetId(e) {
        return this.highestTargetId = this.Nr.next(), PersistencePromise.resolve(this.highestTargetId);
    }
    setTargetsMetadata(e, t, n) {
        return n && (this.lastRemoteSnapshotVersion = n), t > this.Mr && (this.Mr = t), 
        PersistencePromise.resolve();
    }
    kn(e) {
        this.Fr.set(e.target, e);
        const t = e.targetId;
        t > this.highestTargetId && (this.Nr = new __PRIVATE_TargetIdGenerator(t), this.highestTargetId = t), 
        e.sequenceNumber > this.Mr && (this.Mr = e.sequenceNumber);
    }
    addTargetData(e, t) {
        return this.kn(t), this.targetCount += 1, PersistencePromise.resolve();
    }
    updateTargetData(e, t) {
        return this.kn(t), PersistencePromise.resolve();
    }
    removeTargetData(e, t) {
        return this.Fr.delete(t.target), this.Or.Rr(t.targetId), this.targetCount -= 1, 
        PersistencePromise.resolve();
    }
    removeTargets(e, t, n) {
        let r = 0;
        const i = [];
        return this.Fr.forEach(((s, o) => {
            o.sequenceNumber <= t && null === n.get(o.targetId) && (this.Fr.delete(s), i.push(this.removeMatchingKeysForTargetId(e, o.targetId)), 
            r++);
        })), PersistencePromise.waitFor(i).next((() => r));
    }
    getTargetCount(e) {
        return PersistencePromise.resolve(this.targetCount);
    }
    getTargetData(e, t) {
        const n = this.Fr.get(t) || null;
        return PersistencePromise.resolve(n);
    }
    addMatchingKeys(e, t, n) {
        return this.Or.Er(t, n), PersistencePromise.resolve();
    }
    removeMatchingKeys(e, t, n) {
        this.Or.Ar(t, n);
        const r = this.persistence.referenceDelegate, i = [];
        return r && t.forEach((t => {
            i.push(r.markPotentiallyOrphaned(e, t));
        })), PersistencePromise.waitFor(i);
    }
    removeMatchingKeysForTargetId(e, t) {
        return this.Or.Rr(t), PersistencePromise.resolve();
    }
    getMatchingKeysForTargetId(e, t) {
        const n = this.Or.mr(t);
        return PersistencePromise.resolve(n);
    }
    containsKey(e, t) {
        return PersistencePromise.resolve(this.Or.containsKey(t));
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
 * A memory-backed instance of Persistence. Data is stored only in RAM and
 * not persisted across sessions.
 */
class __PRIVATE_MemoryPersistence {
    /**
     * The constructor accepts a factory for creating a reference delegate. This
     * allows both the delegate and this instance to have strong references to
     * each other without having nullable fields that would then need to be
     * checked or asserted on every access.
     */
    constructor(e, t) {
        this.Br = {}, this.overlays = {}, this.Lr = new __PRIVATE_ListenSequence(0), this.kr = !1, 
        this.kr = !0, this.referenceDelegate = e(this), this.qr = new __PRIVATE_MemoryTargetCache(this);
        this.indexManager = new __PRIVATE_MemoryIndexManager, this.remoteDocumentCache = function __PRIVATE_newMemoryRemoteDocumentCache(e) {
            return new __PRIVATE_MemoryRemoteDocumentCacheImpl(e);
        }((e => this.referenceDelegate.Qr(e))), this.serializer = new __PRIVATE_LocalSerializer(t), 
        this.Kr = new __PRIVATE_MemoryBundleCache(this.serializer);
    }
    start() {
        return Promise.resolve();
    }
    shutdown() {
        // No durable state to ensure is closed on shutdown.
        return this.kr = !1, Promise.resolve();
    }
    get started() {
        return this.kr;
    }
    setDatabaseDeletedListener() {
        // No op.
    }
    setNetworkEnabled() {
        // No op.
    }
    getIndexManager(e) {
        // We do not currently support indices for memory persistence, so we can
        // return the same shared instance of the memory index manager.
        return this.indexManager;
    }
    getDocumentOverlayCache(e) {
        let t = this.overlays[e.toKey()];
        return t || (t = new __PRIVATE_MemoryDocumentOverlayCache, this.overlays[e.toKey()] = t), 
        t;
    }
    getMutationQueue(e, t) {
        let n = this.Br[e.toKey()];
        return n || (n = new __PRIVATE_MemoryMutationQueue(t, this.referenceDelegate), this.Br[e.toKey()] = n), 
        n;
    }
    getTargetCache() {
        return this.qr;
    }
    getRemoteDocumentCache() {
        return this.remoteDocumentCache;
    }
    getBundleCache() {
        return this.Kr;
    }
    runTransaction(e, t, n) {
        __PRIVATE_logDebug("MemoryPersistence", "Starting transaction:", e);
        const r = new __PRIVATE_MemoryTransaction(this.Lr.next());
        return this.referenceDelegate.$r(), n(r).next((e => this.referenceDelegate.Ur(r).next((() => e)))).toPromise().then((e => (r.raiseOnCommittedEvent(), 
        e)));
    }
    Wr(e, t) {
        return PersistencePromise.or(Object.values(this.Br).map((n => () => n.containsKey(e, t))));
    }
}

/**
 * Memory persistence is not actually transactional, but future implementations
 * may have transaction-scoped state.
 */ class __PRIVATE_MemoryTransaction extends PersistenceTransaction {
    constructor(e) {
        super(), this.currentSequenceNumber = e;
    }
}

class __PRIVATE_MemoryEagerDelegate {
    constructor(e) {
        this.persistence = e, 
        /** Tracks all documents that are active in Query views. */
        this.Gr = new __PRIVATE_ReferenceSet, 
        /** The list of documents that are potentially GCed after each transaction. */
        this.zr = null;
    }
    static jr(e) {
        return new __PRIVATE_MemoryEagerDelegate(e);
    }
    get Hr() {
        if (this.zr) return this.zr;
        throw fail();
    }
    addReference(e, t, n) {
        return this.Gr.addReference(n, t), this.Hr.delete(n.toString()), PersistencePromise.resolve();
    }
    removeReference(e, t, n) {
        return this.Gr.removeReference(n, t), this.Hr.add(n.toString()), PersistencePromise.resolve();
    }
    markPotentiallyOrphaned(e, t) {
        return this.Hr.add(t.toString()), PersistencePromise.resolve();
    }
    removeTarget(e, t) {
        this.Gr.Rr(t.targetId).forEach((e => this.Hr.add(e.toString())));
        const n = this.persistence.getTargetCache();
        return n.getMatchingKeysForTargetId(e, t.targetId).next((e => {
            e.forEach((e => this.Hr.add(e.toString())));
        })).next((() => n.removeTargetData(e, t)));
    }
    $r() {
        this.zr = new Set;
    }
    Ur(e) {
        // Remove newly orphaned documents.
        const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
        return PersistencePromise.forEach(this.Hr, (n => {
            const r = DocumentKey.fromPath(n);
            return this.Jr(e, r).next((e => {
                e || t.removeEntry(r, SnapshotVersion.min());
            }));
        })).next((() => (this.zr = null, t.apply(e))));
    }
    updateLimboDocument(e, t) {
        return this.Jr(e, t).next((e => {
            e ? this.Hr.delete(t.toString()) : this.Hr.add(t.toString());
        }));
    }
    Qr(e) {
        // For eager GC, we don't care about the document size, there are no size thresholds.
        return 0;
    }
    Jr(e, t) {
        return PersistencePromise.or([ () => PersistencePromise.resolve(this.Gr.containsKey(t)), () => this.persistence.getTargetCache().containsKey(e, t), () => this.persistence.Wr(e, t) ]);
    }
}

class __PRIVATE_MemoryLruDelegate {
    constructor(e, t) {
        this.persistence = e, this.Yr = new ObjectMap((e => __PRIVATE_encodeResourcePath(e.path)), ((e, t) => e.isEqual(t))), 
        this.garbageCollector = __PRIVATE_newLruGarbageCollector(this, t);
    }
    static jr(e, t) {
        return new __PRIVATE_MemoryLruDelegate(e, t);
    }
    // No-ops, present so memory persistence doesn't have to care which delegate
    // it has.
    $r() {}
    Ur(e) {
        return PersistencePromise.resolve();
    }
    forEachTarget(e, t) {
        return this.persistence.getTargetCache().forEachTarget(e, t);
    }
    jn(e) {
        const t = this.Yn(e);
        return this.persistence.getTargetCache().getTargetCount(e).next((e => t.next((t => e + t))));
    }
    Yn(e) {
        let t = 0;
        return this.Hn(e, (e => {
            t++;
        })).next((() => t));
    }
    Hn(e, t) {
        return PersistencePromise.forEach(this.Yr, ((n, r) => this.Xn(e, n, r).next((e => e ? PersistencePromise.resolve() : t(r)))));
    }
    removeTargets(e, t, n) {
        return this.persistence.getTargetCache().removeTargets(e, t, n);
    }
    removeOrphanedDocuments(e, t) {
        let n = 0;
        const r = this.persistence.getRemoteDocumentCache(), i = r.newChangeBuffer();
        return r.vr(e, (r => this.Xn(e, r, t).next((e => {
            e || (n++, i.removeEntry(r, SnapshotVersion.min()));
        })))).next((() => i.apply(e))).next((() => n));
    }
    markPotentiallyOrphaned(e, t) {
        return this.Yr.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
    }
    removeTarget(e, t) {
        const n = t.withSequenceNumber(e.currentSequenceNumber);
        return this.persistence.getTargetCache().updateTargetData(e, n);
    }
    addReference(e, t, n) {
        return this.Yr.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
    }
    removeReference(e, t, n) {
        return this.Yr.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
    }
    updateLimboDocument(e, t) {
        return this.Yr.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
    }
    Qr(e) {
        let t = e.key.toString().length;
        return e.isFoundDocument() && (t += __PRIVATE_estimateByteSize(e.data.value)), t;
    }
    Xn(e, t, n) {
        return PersistencePromise.or([ () => this.persistence.Wr(e, t), () => this.persistence.getTargetCache().containsKey(e, t), () => {
            const e = this.Yr.get(t);
            return PersistencePromise.resolve(void 0 !== e && e > n);
        } ]);
    }
    getCacheSize(e) {
        return this.persistence.getRemoteDocumentCache().getSize(e);
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
/** Performs database creation and schema upgrades. */ class __PRIVATE_SchemaConverter {
    constructor(e) {
        this.serializer = e;
    }
    /**
     * Performs database creation and schema upgrades.
     *
     * Note that in production, this method is only ever used to upgrade the schema
     * to SCHEMA_VERSION. Different values of toVersion are only used for testing
     * and local feature development.
     */    N(e, t, n, r) {
        const i = new __PRIVATE_SimpleDbTransaction("createOrUpgrade", t);
        n < 1 && r >= 1 && (!function __PRIVATE_createPrimaryClientStore(e) {
            e.createObjectStore("owner");
        }(e), function __PRIVATE_createMutationQueue(e) {
            e.createObjectStore("mutationQueues", {
                keyPath: "userId"
            });
            e.createObjectStore("mutations", {
                keyPath: "batchId",
                autoIncrement: !0
            }).createIndex("userMutationsIndex", O, {
                unique: !0
            }), e.createObjectStore("documentMutations");
        }
        /**
 * Upgrade function to migrate the 'mutations' store from V1 to V3. Loads
 * and rewrites all data.
 */ (e), __PRIVATE_createQueryCache(e), function __PRIVATE_createLegacyRemoteDocumentCache(e) {
            e.createObjectStore("remoteDocuments");
        }(e));
        // Migration 2 to populate the targetGlobal object no longer needed since
        // migration 3 unconditionally clears it.
                let s = PersistencePromise.resolve();
        return n < 3 && r >= 3 && (
        // Brand new clients don't need to drop and recreate--only clients that
        // potentially have corrupt data.
        0 !== n && (!function __PRIVATE_dropQueryCache(e) {
            e.deleteObjectStore("targetDocuments"), e.deleteObjectStore("targets"), e.deleteObjectStore("targetGlobal");
        }(e), __PRIVATE_createQueryCache(e)), s = s.next((() => 
        /**
 * Creates the target global singleton row.
 *
 * @param txn - The version upgrade transaction for indexeddb
 */
        function __PRIVATE_writeEmptyTargetGlobalEntry(e) {
            const t = e.store("targetGlobal"), n = {
                highestTargetId: 0,
                highestListenSequenceNumber: 0,
                lastRemoteSnapshotVersion: SnapshotVersion.min().toTimestamp(),
                targetCount: 0
            };
            return t.put("targetGlobalKey", n);
        }(i)))), n < 4 && r >= 4 && (0 !== n && (
        // Schema version 3 uses auto-generated keys to generate globally unique
        // mutation batch IDs (this was previously ensured internally by the
        // client). To migrate to the new schema, we have to read all mutations
        // and write them back out. We preserve the existing batch IDs to guarantee
        // consistency with other object stores. Any further mutation batch IDs will
        // be auto-generated.
        s = s.next((() => function __PRIVATE_upgradeMutationBatchSchemaAndMigrateData(e, t) {
            return t.store("mutations").W().next((n => {
                e.deleteObjectStore("mutations");
                e.createObjectStore("mutations", {
                    keyPath: "batchId",
                    autoIncrement: !0
                }).createIndex("userMutationsIndex", O, {
                    unique: !0
                });
                const r = t.store("mutations"), i = n.map((e => r.put(e)));
                return PersistencePromise.waitFor(i);
            }));
        }(e, i)))), s = s.next((() => {
            !function __PRIVATE_createClientMetadataStore(e) {
                e.createObjectStore("clientMetadata", {
                    keyPath: "clientId"
                });
            }(e);
        }))), n < 5 && r >= 5 && (s = s.next((() => this.Zr(i)))), n < 6 && r >= 6 && (s = s.next((() => (function __PRIVATE_createDocumentGlobalStore(e) {
            e.createObjectStore("remoteDocumentGlobal");
        }(e), this.Xr(i))))), n < 7 && r >= 7 && (s = s.next((() => this.ei(i)))), n < 8 && r >= 8 && (s = s.next((() => this.ti(e, i)))), 
        n < 9 && r >= 9 && (s = s.next((() => {
            // Multi-Tab used to manage its own changelog, but this has been moved
            // to the DbRemoteDocument object store itself. Since the previous change
            // log only contained transient data, we can drop its object store.
            !function __PRIVATE_dropRemoteDocumentChangesStore(e) {
                e.objectStoreNames.contains("remoteDocumentChanges") && e.deleteObjectStore("remoteDocumentChanges");
            }(e);
            // Note: Schema version 9 used to create a read time index for the
            // RemoteDocumentCache. This is now done with schema version 13.
                }))), n < 10 && r >= 10 && (s = s.next((() => this.ni(i)))), n < 11 && r >= 11 && (s = s.next((() => {
            !function __PRIVATE_createBundlesStore(e) {
                e.createObjectStore("bundles", {
                    keyPath: "bundleId"
                });
            }(e), function __PRIVATE_createNamedQueriesStore(e) {
                e.createObjectStore("namedQueries", {
                    keyPath: "name"
                });
            }(e);
        }))), n < 12 && r >= 12 && (s = s.next((() => {
            !function __PRIVATE_createDocumentOverlayStore(e) {
                const t = e.createObjectStore("documentOverlays", {
                    keyPath: j
                });
                t.createIndex("collectionPathOverlayIndex", H, {
                    unique: !1
                }), t.createIndex("collectionGroupOverlayIndex", J, {
                    unique: !1
                });
            }(e);
        }))), n < 13 && r >= 13 && (s = s.next((() => function __PRIVATE_createRemoteDocumentCache(e) {
            const t = e.createObjectStore("remoteDocumentsV14", {
                keyPath: B
            });
            t.createIndex("documentKeyIndex", L), t.createIndex("collectionGroupIndex", k);
        }(e))).next((() => this.ri(e, i))).next((() => e.deleteObjectStore("remoteDocuments")))), 
        n < 14 && r >= 14 && (s = s.next((() => this.ii(e, i)))), n < 15 && r >= 15 && (s = s.next((() => function __PRIVATE_createFieldIndex(e) {
            e.createObjectStore("indexConfiguration", {
                keyPath: "indexId",
                autoIncrement: !0
            }).createIndex("collectionGroupIndex", "collectionGroup", {
                unique: !1
            });
            e.createObjectStore("indexState", {
                keyPath: U
            }).createIndex("sequenceNumberIndex", W, {
                unique: !1
            });
            e.createObjectStore("indexEntries", {
                keyPath: G
            }).createIndex("documentKeyIndex", z, {
                unique: !1
            });
        }(e)))), s;
    }
    Xr(e) {
        let t = 0;
        return e.store("remoteDocuments").Y(((e, n) => {
            t += __PRIVATE_dbDocumentSize(n);
        })).next((() => {
            const n = {
                byteSize: t
            };
            return e.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey", n);
        }));
    }
    Zr(e) {
        const t = e.store("mutationQueues"), n = e.store("mutations");
        return t.W().next((t => PersistencePromise.forEach(t, (t => {
            const r = IDBKeyRange.bound([ t.userId, -1 ], [ t.userId, t.lastAcknowledgedBatchId ]);
            return n.W("userMutationsIndex", r).next((n => PersistencePromise.forEach(n, (n => {
                __PRIVATE_hardAssert(n.userId === t.userId);
                const r = __PRIVATE_fromDbMutationBatch(this.serializer, n);
                return removeMutationBatch(e, t.userId, r).next((() => {}));
            }))));
        }))));
    }
    /**
     * Ensures that every document in the remote document cache has a corresponding sentinel row
     * with a sequence number. Missing rows are given the most recently used sequence number.
     */    ei(e) {
        const t = e.store("targetDocuments"), n = e.store("remoteDocuments");
        return e.store("targetGlobal").get("targetGlobalKey").next((e => {
            const r = [];
            return n.Y(((n, i) => {
                const s = new ResourcePath(n), o = function __PRIVATE_sentinelKey(e) {
                    return [ 0, __PRIVATE_encodeResourcePath(e) ];
                }(s);
                r.push(t.get(o).next((n => n ? PersistencePromise.resolve() : (n => t.put({
                    targetId: 0,
                    path: __PRIVATE_encodeResourcePath(n),
                    sequenceNumber: e.highestListenSequenceNumber
                }))(s))));
            })).next((() => PersistencePromise.waitFor(r)));
        }));
    }
    ti(e, t) {
        // Create the index.
        e.createObjectStore("collectionParents", {
            keyPath: $
        });
        const n = t.store("collectionParents"), r = new __PRIVATE_MemoryCollectionParentIndex, addEntry = e => {
            if (r.add(e)) {
                const t = e.lastSegment(), r = e.popLast();
                return n.put({
                    collectionId: t,
                    parent: __PRIVATE_encodeResourcePath(r)
                });
            }
        };
        // Helper to add an index entry iff we haven't already written it.
                // Index existing remote documents.
        return t.store("remoteDocuments").Y({
            J: !0
        }, ((e, t) => {
            const n = new ResourcePath(e);
            return addEntry(n.popLast());
        })).next((() => t.store("documentMutations").Y({
            J: !0
        }, (([e, t, n], r) => {
            const i = __PRIVATE_decodeResourcePath(t);
            return addEntry(i.popLast());
        }))));
    }
    ni(e) {
        const t = e.store("targets");
        return t.Y(((e, n) => {
            const r = __PRIVATE_fromDbTarget(n), i = __PRIVATE_toDbTarget(this.serializer, r);
            return t.put(i);
        }));
    }
    ri(e, t) {
        const n = t.store("remoteDocuments"), r = [];
        return n.Y(((e, n) => {
            const i = t.store("remoteDocumentsV14"), s = function __PRIVATE_extractKey(e) {
                return e.document ? new DocumentKey(ResourcePath.fromString(e.document.name).popFirst(5)) : e.noDocument ? DocumentKey.fromSegments(e.noDocument.path) : e.unknownDocument ? DocumentKey.fromSegments(e.unknownDocument.path) : fail();
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
 */ (n).path.toArray(), o = {
                prefixPath: s.slice(0, s.length - 2),
                collectionGroup: s[s.length - 2],
                documentId: s[s.length - 1],
                readTime: n.readTime || [ 0, 0 ],
                unknownDocument: n.unknownDocument,
                noDocument: n.noDocument,
                document: n.document,
                hasCommittedMutations: !!n.hasCommittedMutations
            };
            r.push(i.put(o));
        })).next((() => PersistencePromise.waitFor(r)));
    }
    ii(e, t) {
        const n = t.store("mutations"), r = __PRIVATE_newIndexedDbRemoteDocumentCache(this.serializer), i = new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.jr, this.serializer.ut);
        return n.W().next((e => {
            const n = new Map;
            return e.forEach((e => {
                var t;
                let r = null !== (t = n.get(e.userId)) && void 0 !== t ? t : __PRIVATE_documentKeySet();
                __PRIVATE_fromDbMutationBatch(this.serializer, e).keys().forEach((e => r = r.add(e))), 
                n.set(e.userId, r);
            })), PersistencePromise.forEach(n, ((e, n) => {
                const s = new User(n), o = __PRIVATE_IndexedDbDocumentOverlayCache.ct(this.serializer, s), _ = i.getIndexManager(s), a = __PRIVATE_IndexedDbMutationQueue.ct(s, this.serializer, _, i.referenceDelegate);
                return new LocalDocumentsView(r, a, o, _).recalculateAndSaveOverlaysForDocumentKeys(new __PRIVATE_IndexedDbTransaction(t, __PRIVATE_ListenSequence._e), e).next();
            }));
        }));
    }
}

function __PRIVATE_createQueryCache(e) {
    e.createObjectStore("targetDocuments", {
        keyPath: Q
    }).createIndex("documentTargetsIndex", K, {
        unique: !0
    });
    // NOTE: This is unique only because the TargetId is the suffix.
    e.createObjectStore("targets", {
        keyPath: "targetId"
    }).createIndex("queryTargetsIndex", q, {
        unique: !0
    }), e.createObjectStore("targetGlobal");
}

const Re = "Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";

/**
 * Oldest acceptable age in milliseconds for client metadata before the client
 * is considered inactive and its associated data is garbage collected.
 */
/**
 * An IndexedDB-backed instance of Persistence. Data is stored persistently
 * across sessions.
 *
 * On Web only, the Firestore SDKs support shared access to its persistence
 * layer. This allows multiple browser tabs to read and write to IndexedDb and
 * to synchronize state even without network connectivity. Shared access is
 * currently optional and not enabled unless all clients invoke
 * `enablePersistence()` with `{synchronizeTabs:true}`.
 *
 * In multi-tab mode, if multiple clients are active at the same time, the SDK
 * will designate one client as the “primary client”. An effort is made to pick
 * a visible, network-connected and active client, and this client is
 * responsible for letting other clients know about its presence. The primary
 * client writes a unique client-generated identifier (the client ID) to
 * IndexedDb’s “owner” store every 4 seconds. If the primary client fails to
 * update this entry, another client can acquire the lease and take over as
 * primary.
 *
 * Some persistence operations in the SDK are designated as primary-client only
 * operations. This includes the acknowledgment of mutations and all updates of
 * remote documents. The effects of these operations are written to persistence
 * and then broadcast to other tabs via LocalStorage (see
 * `WebStorageSharedClientState`), which then refresh their state from
 * persistence.
 *
 * Similarly, the primary client listens to notifications sent by secondary
 * clients to discover persistence changes written by secondary clients, such as
 * the addition of new mutations and query targets.
 *
 * If multi-tab is not enabled and another tab already obtained the primary
 * lease, IndexedDbPersistence enters a failed state and all subsequent
 * operations will automatically fail.
 *
 * Additionally, there is an optimization so that when a tab is closed, the
 * primary lease is released immediately (this is especially important to make
 * sure that a refreshed tab is able to immediately re-acquire the primary
 * lease). Unfortunately, IndexedDB cannot be reliably used in window.unload
 * since it is an asynchronous API. So in addition to attempting to give up the
 * lease, the leaseholder writes its client ID to a "zombiedClient" entry in
 * LocalStorage which acts as an indicator that another tab should go ahead and
 * take the primary lease immediately regardless of the current lease timestamp.
 *
 * TODO(b/114226234): Remove `synchronizeTabs` section when multi-tab is no
 * longer optional.
 */
class __PRIVATE_IndexedDbPersistence {
    constructor(
    /**
     * Whether to synchronize the in-memory state of multiple tabs and share
     * access to local persistence.
     */
    e, t, n, r, i, s, o, _, a, 
    /**
     * If set to true, forcefully obtains database access. Existing tabs will
     * no longer be able to access IndexedDB.
     */
    u, c = 15) {
        if (this.allowTabSynchronization = e, this.persistenceKey = t, this.clientId = n, 
        this.si = i, this.window = s, this.document = o, this.oi = a, this._i = u, this.ai = c, 
        this.Lr = null, this.kr = !1, this.isPrimary = !1, this.networkEnabled = !0, 
        /** Our window.unload handler, if registered. */
        this.ui = null, this.inForeground = !1, 
        /** Our 'visibilitychange' listener if registered. */
        this.ci = null, 
        /** The client metadata refresh task. */
        this.li = null, 
        /** The last time we garbage collected the client metadata object store. */
        this.hi = Number.NEGATIVE_INFINITY, 
        /** A listener to notify on primary state changes. */
        this.Pi = e => Promise.resolve(), !__PRIVATE_IndexedDbPersistence.D()) throw new FirestoreError(v.UNIMPLEMENTED, "This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");
        this.referenceDelegate = new __PRIVATE_IndexedDbLruDelegateImpl(this, r), this.Ii = t + "main", 
        this.serializer = new __PRIVATE_LocalSerializer(_), this.Ti = new __PRIVATE_SimpleDb(this.Ii, this.ai, new __PRIVATE_SchemaConverter(this.serializer)), 
        this.qr = new __PRIVATE_IndexedDbTargetCache(this.referenceDelegate, this.serializer), 
        this.remoteDocumentCache = __PRIVATE_newIndexedDbRemoteDocumentCache(this.serializer), 
        this.Kr = new __PRIVATE_IndexedDbBundleCache, this.window && this.window.localStorage ? this.Ei = this.window.localStorage : (this.Ei = null, 
        !1 === u && __PRIVATE_logError("IndexedDbPersistence", "LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));
    }
    /**
     * Attempt to start IndexedDb persistence.
     *
     * @returns Whether persistence was enabled.
     */    start() {
        // NOTE: This is expected to fail sometimes (in the case of another tab
        // already having the persistence lock), so it's the first thing we should
        // do.
        return this.di().then((() => {
            if (!this.isPrimary && !this.allowTabSynchronization) 
            // Fail `start()` if `synchronizeTabs` is disabled and we cannot
            // obtain the primary lease.
            throw new FirestoreError(v.FAILED_PRECONDITION, Re);
            return this.Ai(), this.Ri(), this.Vi(), this.runTransaction("getHighestListenSequenceNumber", "readonly", (e => this.qr.getHighestSequenceNumber(e)));
        })).then((e => {
            this.Lr = new __PRIVATE_ListenSequence(e, this.oi);
        })).then((() => {
            this.kr = !0;
        })).catch((e => (this.Ti && this.Ti.close(), Promise.reject(e))));
    }
    /**
     * Registers a listener that gets called when the primary state of the
     * instance changes. Upon registering, this listener is invoked immediately
     * with the current primary state.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */    mi(e) {
        return this.Pi = async t => {
            if (this.started) return e(t);
        }, e(this.isPrimary);
    }
    /**
     * Registers a listener that gets called when the database receives a
     * version change event indicating that it has deleted.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */    setDatabaseDeletedListener(e) {
        this.Ti.L((async t => {
            // Check if an attempt is made to delete IndexedDB.
            null === t.newVersion && await e();
        }));
    }
    /**
     * Adjusts the current network state in the client's metadata, potentially
     * affecting the primary lease.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */    setNetworkEnabled(e) {
        this.networkEnabled !== e && (this.networkEnabled = e, 
        // Schedule a primary lease refresh for immediate execution. The eventual
        // lease update will be propagated via `primaryStateListener`.
        this.si.enqueueAndForget((async () => {
            this.started && await this.di();
        })));
    }
    /**
     * Updates the client metadata in IndexedDb and attempts to either obtain or
     * extend the primary lease for the local client. Asynchronously notifies the
     * primary state listener if the client either newly obtained or released its
     * primary lease.
     */    di() {
        return this.runTransaction("updateClientMetadataAndTryBecomePrimary", "readwrite", (e => __PRIVATE_clientMetadataStore(e).put({
            clientId: this.clientId,
            updateTimeMs: Date.now(),
            networkEnabled: this.networkEnabled,
            inForeground: this.inForeground
        }).next((() => {
            if (this.isPrimary) return this.fi(e).next((e => {
                e || (this.isPrimary = !1, this.si.enqueueRetryable((() => this.Pi(!1))));
            }));
        })).next((() => this.gi(e))).next((t => this.isPrimary && !t ? this.pi(e).next((() => !1)) : !!t && this.yi(e).next((() => !0)))))).catch((e => {
            if (__PRIVATE_isIndexedDbTransactionError(e)) 
            // Proceed with the existing state. Any subsequent access to
            // IndexedDB will verify the lease.
            return __PRIVATE_logDebug("IndexedDbPersistence", "Failed to extend owner lease: ", e), 
            this.isPrimary;
            if (!this.allowTabSynchronization) throw e;
            return __PRIVATE_logDebug("IndexedDbPersistence", "Releasing owner lease after error during lease refresh", e), 
            /* isPrimary= */ !1;
        })).then((e => {
            this.isPrimary !== e && this.si.enqueueRetryable((() => this.Pi(e))), this.isPrimary = e;
        }));
    }
    fi(e) {
        return __PRIVATE_primaryClientStore(e).get("owner").next((e => PersistencePromise.resolve(this.wi(e))));
    }
    Si(e) {
        return __PRIVATE_clientMetadataStore(e).delete(this.clientId);
    }
    /**
     * If the garbage collection threshold has passed, prunes the
     * RemoteDocumentChanges and the ClientMetadata store based on the last update
     * time of all clients.
     */    async bi() {
        if (this.isPrimary && !this.Di(this.hi, 18e5)) {
            this.hi = Date.now();
            const e = await this.runTransaction("maybeGarbageCollectMultiClientState", "readwrite-primary", (e => {
                const t = __PRIVATE_getStore(e, "clientMetadata");
                return t.W().next((e => {
                    const n = this.Ci(e, 18e5), r = e.filter((e => -1 === n.indexOf(e)));
                    // Delete metadata for clients that are no longer considered active.
                    return PersistencePromise.forEach(r, (e => t.delete(e.clientId))).next((() => r));
                }));
            })).catch((() => []));
            // Delete potential leftover entries that may continue to mark the
            // inactive clients as zombied in LocalStorage.
            // Ideally we'd delete the IndexedDb and LocalStorage zombie entries for
            // the client atomically, but we can't. So we opt to delete the IndexedDb
            // entries first to avoid potentially reviving a zombied client.
                        if (this.Ei) for (const t of e) this.Ei.removeItem(this.vi(t.clientId));
        }
    }
    /**
     * Schedules a recurring timer to update the client metadata and to either
     * extend or acquire the primary lease if the client is eligible.
     */    Vi() {
        this.li = this.si.enqueueAfterDelay("client_metadata_refresh" /* TimerId.ClientMetadataRefresh */ , 4e3, (() => this.di().then((() => this.bi())).then((() => this.Vi()))));
    }
    /** Checks whether `client` is the local client. */    wi(e) {
        return !!e && e.ownerId === this.clientId;
    }
    /**
     * Evaluate the state of all active clients and determine whether the local
     * client is or can act as the holder of the primary lease. Returns whether
     * the client is eligible for the lease, but does not actually acquire it.
     * May return 'false' even if there is no active leaseholder and another
     * (foreground) client should become leaseholder instead.
     */    gi(e) {
        if (this._i) return PersistencePromise.resolve(!0);
        return __PRIVATE_primaryClientStore(e).get("owner").next((t => {
            // A client is eligible for the primary lease if:
            // - its network is enabled and the client's tab is in the foreground.
            // - its network is enabled and no other client's tab is in the
            //   foreground.
            // - every clients network is disabled and the client's tab is in the
            //   foreground.
            // - every clients network is disabled and no other client's tab is in
            //   the foreground.
            // - the `forceOwningTab` setting was passed in.
            if (null !== t && this.Di(t.leaseTimestampMs, 5e3) && !this.Fi(t.ownerId)) {
                if (this.wi(t) && this.networkEnabled) return !0;
                if (!this.wi(t)) {
                    if (!t.allowTabSynchronization) 
                    // Fail the `canActAsPrimary` check if the current leaseholder has
                    // not opted into multi-tab synchronization. If this happens at
                    // client startup, we reject the Promise returned by
                    // `enablePersistence()` and the user can continue to use Firestore
                    // with in-memory persistence.
                    // If this fails during a lease refresh, we will instead block the
                    // AsyncQueue from executing further operations. Note that this is
                    // acceptable since mixing & matching different `synchronizeTabs`
                    // settings is not supported.
                    // TODO(b/114226234): Remove this check when `synchronizeTabs` can
                    // no longer be turned off.
                    throw new FirestoreError(v.FAILED_PRECONDITION, Re);
                    return !1;
                }
            }
            return !(!this.networkEnabled || !this.inForeground) || __PRIVATE_clientMetadataStore(e).W().next((e => void 0 === this.Ci(e, 5e3).find((e => {
                if (this.clientId !== e.clientId) {
                    const t = !this.networkEnabled && e.networkEnabled, n = !this.inForeground && e.inForeground, r = this.networkEnabled === e.networkEnabled;
                    if (t || n && r) return !0;
                }
                return !1;
            }))));
        })).next((e => (this.isPrimary !== e && __PRIVATE_logDebug("IndexedDbPersistence", `Client ${e ? "is" : "is not"} eligible for a primary lease.`), 
        e)));
    }
    async shutdown() {
        // The shutdown() operations are idempotent and can be called even when
        // start() aborted (e.g. because it couldn't acquire the persistence lease).
        this.kr = !1, this.Mi(), this.li && (this.li.cancel(), this.li = null), this.xi(), 
        this.Oi(), 
        // Use `SimpleDb.runTransaction` directly to avoid failing if another tab
        // has obtained the primary lease.
        await this.Ti.runTransaction("shutdown", "readwrite", [ "owner", "clientMetadata" ], (e => {
            const t = new __PRIVATE_IndexedDbTransaction(e, __PRIVATE_ListenSequence._e);
            return this.pi(t).next((() => this.Si(t)));
        })), this.Ti.close(), 
        // Remove the entry marking the client as zombied from LocalStorage since
        // we successfully deleted its metadata from IndexedDb.
        this.Ni();
    }
    /**
     * Returns clients that are not zombied and have an updateTime within the
     * provided threshold.
     */    Ci(e, t) {
        return e.filter((e => this.Di(e.updateTimeMs, t) && !this.Fi(e.clientId)));
    }
    /**
     * Returns the IDs of the clients that are currently active. If multi-tab
     * is not supported, returns an array that only contains the local client's
     * ID.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */    Bi() {
        return this.runTransaction("getActiveClients", "readonly", (e => __PRIVATE_clientMetadataStore(e).W().next((e => this.Ci(e, 18e5).map((e => e.clientId))))));
    }
    get started() {
        return this.kr;
    }
    getMutationQueue(e, t) {
        return __PRIVATE_IndexedDbMutationQueue.ct(e, this.serializer, t, this.referenceDelegate);
    }
    getTargetCache() {
        return this.qr;
    }
    getRemoteDocumentCache() {
        return this.remoteDocumentCache;
    }
    getIndexManager(e) {
        return new __PRIVATE_IndexedDbIndexManager(e, this.serializer.ut.databaseId);
    }
    getDocumentOverlayCache(e) {
        return __PRIVATE_IndexedDbDocumentOverlayCache.ct(this.serializer, e);
    }
    getBundleCache() {
        return this.Kr;
    }
    runTransaction(e, t, n) {
        __PRIVATE_logDebug("IndexedDbPersistence", "Starting transaction:", e);
        const r = "readonly" === t ? "readonly" : "readwrite", i = 
        /** Returns the object stores for the provided schema. */
        function __PRIVATE_getObjectStores(e) {
            return 15 === e ? te : 14 === e ? ee : 13 === e ? X : 12 === e ? Z : 11 === e ? Y : void fail();
        }(this.ai);
        let s;
        // Do all transactions as readwrite against all object stores, since we
        // are the only reader/writer.
                return this.Ti.runTransaction(e, r, i, (r => (s = new __PRIVATE_IndexedDbTransaction(r, this.Lr ? this.Lr.next() : __PRIVATE_ListenSequence._e), 
        "readwrite-primary" === t ? this.fi(s).next((e => !!e || this.gi(s))).next((t => {
            if (!t) throw __PRIVATE_logError(`Failed to obtain primary lease for action '${e}'.`), 
            this.isPrimary = !1, this.si.enqueueRetryable((() => this.Pi(!1))), new FirestoreError(v.FAILED_PRECONDITION, M);
            return n(s);
        })).next((e => this.yi(s).next((() => e)))) : this.Li(s).next((() => n(s)))))).then((e => (s.raiseOnCommittedEvent(), 
        e)));
    }
    /**
     * Verifies that the current tab is the primary leaseholder or alternatively
     * that the leaseholder has opted into multi-tab synchronization.
     */
    // TODO(b/114226234): Remove this check when `synchronizeTabs` can no longer
    // be turned off.
    Li(e) {
        return __PRIVATE_primaryClientStore(e).get("owner").next((e => {
            if (null !== e && this.Di(e.leaseTimestampMs, 5e3) && !this.Fi(e.ownerId) && !this.wi(e) && !(this._i || this.allowTabSynchronization && e.allowTabSynchronization)) throw new FirestoreError(v.FAILED_PRECONDITION, Re);
        }));
    }
    /**
     * Obtains or extends the new primary lease for the local client. This
     * method does not verify that the client is eligible for this lease.
     */    yi(e) {
        const t = {
            ownerId: this.clientId,
            allowTabSynchronization: this.allowTabSynchronization,
            leaseTimestampMs: Date.now()
        };
        return __PRIVATE_primaryClientStore(e).put("owner", t);
    }
    static D() {
        return __PRIVATE_SimpleDb.D();
    }
    /** Checks the primary lease and removes it if we are the current primary. */    pi(e) {
        const t = __PRIVATE_primaryClientStore(e);
        return t.get("owner").next((e => this.wi(e) ? (__PRIVATE_logDebug("IndexedDbPersistence", "Releasing primary lease."), 
        t.delete("owner")) : PersistencePromise.resolve()));
    }
    /** Verifies that `updateTimeMs` is within `maxAgeMs`. */    Di(e, t) {
        const n = Date.now();
        return !(e < n - t) && (!(e > n) || (__PRIVATE_logError(`Detected an update time that is in the future: ${e} > ${n}`), 
        !1));
    }
    Ai() {
        null !== this.document && "function" == typeof this.document.addEventListener && (this.ci = () => {
            this.si.enqueueAndForget((() => (this.inForeground = "visible" === this.document.visibilityState, 
            this.di())));
        }, this.document.addEventListener("visibilitychange", this.ci), this.inForeground = "visible" === this.document.visibilityState);
    }
    xi() {
        this.ci && (this.document.removeEventListener("visibilitychange", this.ci), this.ci = null);
    }
    /**
     * Attaches a window.unload handler that will synchronously write our
     * clientId to a "zombie client id" location in LocalStorage. This can be used
     * by tabs trying to acquire the primary lease to determine that the lease
     * is no longer valid even if the timestamp is recent. This is particularly
     * important for the refresh case (so the tab correctly re-acquires the
     * primary lease). LocalStorage is used for this rather than IndexedDb because
     * it is a synchronous API and so can be used reliably from  an unload
     * handler.
     */    Ri() {
        var e;
        "function" == typeof (null === (e = this.window) || void 0 === e ? void 0 : e.addEventListener) && (this.ui = () => {
            // Note: In theory, this should be scheduled on the AsyncQueue since it
            // accesses internal state. We execute this code directly during shutdown
            // to make sure it gets a chance to run.
            this.Mi();
            const e = /(?:Version|Mobile)\/1[456]/;
            P() && (navigator.appVersion.match(e) || navigator.userAgent.match(e)) && 
            // On Safari 14, 15, and 16, we do not run any cleanup actions as it might
            // trigger a bug that prevents Safari from re-opening IndexedDB during
            // the next page load.
            // See https://bugs.webkit.org/show_bug.cgi?id=226547
            this.si.enterRestrictedMode(/* purgeExistingTasks= */ !0), this.si.enqueueAndForget((() => this.shutdown()));
        }, this.window.addEventListener("pagehide", this.ui));
    }
    Oi() {
        this.ui && (this.window.removeEventListener("pagehide", this.ui), this.ui = null);
    }
    /**
     * Returns whether a client is "zombied" based on its LocalStorage entry.
     * Clients become zombied when their tab closes without running all of the
     * cleanup logic in `shutdown()`.
     */    Fi(e) {
        var t;
        try {
            const n = null !== (null === (t = this.Ei) || void 0 === t ? void 0 : t.getItem(this.vi(e)));
            return __PRIVATE_logDebug("IndexedDbPersistence", `Client '${e}' ${n ? "is" : "is not"} zombied in LocalStorage`), 
            n;
        } catch (e) {
            // Gracefully handle if LocalStorage isn't working.
            return __PRIVATE_logError("IndexedDbPersistence", "Failed to get zombied client id.", e), 
            !1;
        }
    }
    /**
     * Record client as zombied (a client that had its tab closed). Zombied
     * clients are ignored during primary tab selection.
     */    Mi() {
        if (this.Ei) try {
            this.Ei.setItem(this.vi(this.clientId), String(Date.now()));
        } catch (e) {
            // Gracefully handle if LocalStorage isn't available / working.
            __PRIVATE_logError("Failed to set zombie client id.", e);
        }
    }
    /** Removes the zombied client entry if it exists. */    Ni() {
        if (this.Ei) try {
            this.Ei.removeItem(this.vi(this.clientId));
        } catch (e) {
            // Ignore
        }
    }
    vi(e) {
        return `firestore_zombie_${this.persistenceKey}_${e}`;
    }
}

/**
 * Helper to get a typed SimpleDbStore for the primary client object store.
 */ function __PRIVATE_primaryClientStore(e) {
    return __PRIVATE_getStore(e, "owner");
}

/**
 * Helper to get a typed SimpleDbStore for the client metadata object store.
 */ function __PRIVATE_clientMetadataStore(e) {
    return __PRIVATE_getStore(e, "clientMetadata");
}

/**
 * Generates a string used as a prefix when storing data in IndexedDB and
 * LocalStorage.
 */ function __PRIVATE_indexedDbStoragePrefix(e, t) {
    // Use two different prefix formats:
    //   * firestore / persistenceKey / projectID . databaseID / ...
    //   * firestore / persistenceKey / projectID / ...
    // projectIDs are DNS-compatible names and cannot contain dots
    // so there's no danger of collisions.
    let n = e.projectId;
    return e.isDefaultDatabase || (n += "." + e.database), "firestore/" + t + "/" + n + "/";
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
 * A set of changes to what documents are currently in view and out of view for
 * a given query. These changes are sent to the LocalStore by the View (via
 * the SyncEngine) and are used to pin / unpin documents as appropriate.
 */
class __PRIVATE_LocalViewChanges {
    constructor(e, t, n, r) {
        this.targetId = e, this.fromCache = t, this.ki = n, this.qi = r;
    }
    static Qi(e, t) {
        let n = __PRIVATE_documentKeySet(), r = __PRIVATE_documentKeySet();
        for (const e of t.docChanges) switch (e.type) {
          case 0 /* ChangeType.Added */ :
            n = n.add(e.doc.key);
            break;

          case 1 /* ChangeType.Removed */ :
            r = r.add(e.doc.key);
 // do nothing
                }
        return new __PRIVATE_LocalViewChanges(e, t.fromCache, n, r);
    }
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
 * A tracker to keep a record of important details during database local query
 * execution.
 */ class QueryContext {
    constructor() {
        /**
         * Counts the number of documents passed through during local query execution.
         */
        this._documentReadCount = 0;
    }
    get documentReadCount() {
        return this._documentReadCount;
    }
    incrementDocumentReadCount(e) {
        this._documentReadCount += e;
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
/**
 * The Firestore query engine.
 *
 * Firestore queries can be executed in three modes. The Query Engine determines
 * what mode to use based on what data is persisted. The mode only determines
 * the runtime complexity of the query - the result set is equivalent across all
 * implementations.
 *
 * The Query engine will use indexed-based execution if a user has configured
 * any index that can be used to execute query (via `setIndexConfiguration()`).
 * Otherwise, the engine will try to optimize the query by re-using a previously
 * persisted query result. If that is not possible, the query will be executed
 * via a full collection scan.
 *
 * Index-based execution is the default when available. The query engine
 * supports partial indexed execution and merges the result from the index
 * lookup with documents that have not yet been indexed. The index evaluation
 * matches the backend's format and as such, the SDK can use indexing for all
 * queries that the backend supports.
 *
 * If no index exists, the query engine tries to take advantage of the target
 * document mapping in the TargetCache. These mappings exists for all queries
 * that have been synced with the backend at least once and allow the query
 * engine to only read documents that previously matched a query plus any
 * documents that were edited after the query was last listened to.
 *
 * There are some cases when this optimization is not guaranteed to produce
 * the same results as full collection scans. In these cases, query
 * processing falls back to full scans. These cases are:
 *
 * - Limit queries where a document that matched the query previously no longer
 *   matches the query.
 *
 * - Limit queries where a document edit may cause the document to sort below
 *   another document that is in the local cache.
 *
 * - Queries that have never been CURRENT or free of limbo documents.
 */
class __PRIVATE_QueryEngine {
    constructor() {
        this.Ki = !1, this.$i = !1, 
        /**
         * SDK only decides whether it should create index when collection size is
         * larger than this.
         */
        this.Ui = 100, this.Wi = 8;
    }
    /** Sets the document view to query against. */    initialize(e, t) {
        this.Gi = e, this.indexManager = t, this.Ki = !0;
    }
    /** Returns all local documents matching the specified query. */    getDocumentsMatchingQuery(e, t, n, r) {
        // Stores the result from executing the query; using this object is more
        // convenient than passing the result between steps of the persistence
        // transaction and improves readability comparatively.
        const i = {
            result: null
        };
        return this.zi(e, t).next((e => {
            i.result = e;
        })).next((() => {
            if (!i.result) return this.ji(e, t, r, n).next((e => {
                i.result = e;
            }));
        })).next((() => {
            if (i.result) return;
            const n = new QueryContext;
            return this.Hi(e, t, n).next((r => {
                if (i.result = r, this.$i) return this.Ji(e, t, n, r.size);
            }));
        })).next((() => i.result));
    }
    Ji(e, t, n, r) {
        return n.documentReadCount < this.Ui ? (__PRIVATE_getLogLevel() <= _.DEBUG && __PRIVATE_logDebug("QueryEngine", "SDK will not create cache indexes for query:", __PRIVATE_stringifyQuery(t), "since it only creates cache indexes for collection contains", "more than or equal to", this.Ui, "documents"), 
        PersistencePromise.resolve()) : (__PRIVATE_getLogLevel() <= _.DEBUG && __PRIVATE_logDebug("QueryEngine", "Query:", __PRIVATE_stringifyQuery(t), "scans", n.documentReadCount, "local documents and returns", r, "documents as results."), 
        n.documentReadCount > this.Wi * r ? (__PRIVATE_getLogLevel() <= _.DEBUG && __PRIVATE_logDebug("QueryEngine", "The SDK decides to create cache indexes for query:", __PRIVATE_stringifyQuery(t), "as using cache indexes may help improve performance."), 
        this.indexManager.createTargetIndexes(e, __PRIVATE_queryToTarget(t))) : PersistencePromise.resolve());
    }
    /**
     * Performs an indexed query that evaluates the query based on a collection's
     * persisted index values. Returns `null` if an index is not available.
     */    zi(e, t) {
        if (__PRIVATE_queryMatchesAllDocuments(t)) 
        // Queries that match all documents don't benefit from using
        // key-based lookups. It is more efficient to scan all documents in a
        // collection, rather than to perform individual lookups.
        return PersistencePromise.resolve(null);
        let n = __PRIVATE_queryToTarget(t);
        return this.indexManager.getIndexType(e, n).next((r => 0 /* IndexType.NONE */ === r ? null : (null !== t.limit && 1 /* IndexType.PARTIAL */ === r && (
        // We cannot apply a limit for targets that are served using a partial
        // index. If a partial index will be used to serve the target, the
        // query may return a superset of documents that match the target
        // (e.g. if the index doesn't include all the target's filters), or
        // may return the correct set of documents in the wrong order (e.g. if
        // the index doesn't include a segment for one of the orderBys).
        // Therefore, a limit should not be applied in such cases.
        t = __PRIVATE_queryWithLimit(t, null, "F" /* LimitType.First */), n = __PRIVATE_queryToTarget(t)), 
        this.indexManager.getDocumentsMatchingTarget(e, n).next((r => {
            const i = __PRIVATE_documentKeySet(...r);
            return this.Gi.getDocuments(e, i).next((r => this.indexManager.getMinOffset(e, n).next((n => {
                const s = this.Yi(t, r);
                return this.Zi(t, s, i, n.readTime) ? this.zi(e, __PRIVATE_queryWithLimit(t, null, "F" /* LimitType.First */)) : this.Xi(e, s, t, n);
            }))));
        })))));
    }
    /**
     * Performs a query based on the target's persisted query mapping. Returns
     * `null` if the mapping is not available or cannot be used.
     */    ji(e, t, n, r) {
        return __PRIVATE_queryMatchesAllDocuments(t) || r.isEqual(SnapshotVersion.min()) ? PersistencePromise.resolve(null) : this.Gi.getDocuments(e, n).next((i => {
            const s = this.Yi(t, i);
            return this.Zi(t, s, n, r) ? PersistencePromise.resolve(null) : (__PRIVATE_getLogLevel() <= _.DEBUG && __PRIVATE_logDebug("QueryEngine", "Re-using previous result from %s to execute query: %s", r.toString(), __PRIVATE_stringifyQuery(t)), 
            this.Xi(e, s, t, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r, -1)).next((e => e)));
        }));
        // Queries that have never seen a snapshot without limbo free documents
        // should also be run as a full collection scan.
        }
    /** Applies the query filter and sorting to the provided documents.  */    Yi(e, t) {
        // Sort the documents and re-apply the query filter since previously
        // matching documents do not necessarily still match the query.
        let n = new SortedSet(__PRIVATE_newQueryComparator(e));
        return t.forEach(((t, r) => {
            __PRIVATE_queryMatches(e, r) && (n = n.add(r));
        })), n;
    }
    /**
     * Determines if a limit query needs to be refilled from cache, making it
     * ineligible for index-free execution.
     *
     * @param query - The query.
     * @param sortedPreviousResults - The documents that matched the query when it
     * was last synchronized, sorted by the query's comparator.
     * @param remoteKeys - The document keys that matched the query at the last
     * snapshot.
     * @param limboFreeSnapshotVersion - The version of the snapshot when the
     * query was last synchronized.
     */    Zi(e, t, n, r) {
        if (null === e.limit) 
        // Queries without limits do not need to be refilled.
        return !1;
        if (n.size !== t.size) 
        // The query needs to be refilled if a previously matching document no
        // longer matches.
        return !0;
        // Limit queries are not eligible for index-free query execution if there is
        // a potential that an older document from cache now sorts before a document
        // that was previously part of the limit. This, however, can only happen if
        // the document at the edge of the limit goes out of limit.
        // If a document that is not the limit boundary sorts differently,
        // the boundary of the limit itself did not change and documents from cache
        // will continue to be "rejected" by this boundary. Therefore, we can ignore
        // any modifications that don't affect the last document.
                const i = "F" /* LimitType.First */ === e.limitType ? t.last() : t.first();
        return !!i && (i.hasPendingWrites || i.version.compareTo(r) > 0);
    }
    Hi(e, t, n) {
        return __PRIVATE_getLogLevel() <= _.DEBUG && __PRIVATE_logDebug("QueryEngine", "Using full collection scan to execute query:", __PRIVATE_stringifyQuery(t)), 
        this.Gi.getDocumentsMatchingQuery(e, t, IndexOffset.min(), n);
    }
    /**
     * Combines the results from an indexed execution with the remaining documents
     * that have not yet been indexed.
     */    Xi(e, t, n, r) {
        // Retrieve all results for documents that were updated since the offset.
        return this.Gi.getDocumentsMatchingQuery(e, n, r).next((e => (
        // Merge with existing results
        t.forEach((t => {
            e = e.insert(t.key, t);
        })), e)));
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
 * Implements `LocalStore` interface.
 *
 * Note: some field defined in this class might have public access level, but
 * the class is not exported so they are only accessible from this module.
 * This is useful to implement optional features (like bundles) in free
 * functions, such that they are tree-shakeable.
 */
class __PRIVATE_LocalStoreImpl {
    constructor(
    /** Manages our in-memory or durable persistence. */
    e, t, n, r) {
        this.persistence = e, this.es = t, this.serializer = r, 
        /**
         * Maps a targetID to data about its target.
         *
         * PORTING NOTE: We are using an immutable data structure on Web to make re-runs
         * of `applyRemoteEvent()` idempotent.
         */
        this.ts = new SortedMap(__PRIVATE_primitiveComparator), 
        /** Maps a target to its targetID. */
        // TODO(wuandy): Evaluate if TargetId can be part of Target.
        this.ns = new ObjectMap((e => __PRIVATE_canonifyTarget(e)), __PRIVATE_targetEquals), 
        /**
         * A per collection group index of the last read time processed by
         * `getNewDocumentChanges()`.
         *
         * PORTING NOTE: This is only used for multi-tab synchronization.
         */
        this.rs = new Map, this.ss = e.getRemoteDocumentCache(), this.qr = e.getTargetCache(), 
        this.Kr = e.getBundleCache(), this.os(n);
    }
    os(e) {
        // TODO(indexing): Add spec tests that test these components change after a
        // user change
        this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), 
        this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new LocalDocumentsView(this.ss, this.mutationQueue, this.documentOverlayCache, this.indexManager), 
        this.ss.setIndexManager(this.indexManager), this.es.initialize(this.localDocuments, this.indexManager);
    }
    collectGarbage(e) {
        return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (t => e.collect(t, this.ts)));
    }
}

function __PRIVATE_newLocalStore(
/** Manages our in-memory or durable persistence. */
e, t, n, r) {
    return new __PRIVATE_LocalStoreImpl(e, t, n, r);
}

/**
 * Tells the LocalStore that the currently authenticated user has changed.
 *
 * In response the local store switches the mutation queue to the new user and
 * returns any resulting document changes.
 */
// PORTING NOTE: Android and iOS only return the documents affected by the
// change.
async function __PRIVATE_localStoreHandleUserChange(e, t) {
    const n = __PRIVATE_debugCast(e);
    return await n.persistence.runTransaction("Handle user change", "readonly", (e => {
        // Swap out the mutation queue, grabbing the pending mutation batches
        // before and after.
        let r;
        return n.mutationQueue.getAllMutationBatches(e).next((i => (r = i, n.os(t), n.mutationQueue.getAllMutationBatches(e)))).next((t => {
            const i = [], s = [];
            // Union the old/new changed keys.
            let o = __PRIVATE_documentKeySet();
            for (const e of r) {
                i.push(e.batchId);
                for (const t of e.mutations) o = o.add(t.key);
            }
            for (const e of t) {
                s.push(e.batchId);
                for (const t of e.mutations) o = o.add(t.key);
            }
            // Return the set of all (potentially) changed documents and the list
            // of mutation batch IDs that were affected by change.
                        return n.localDocuments.getDocuments(e, o).next((e => ({
                _s: e,
                removedBatchIds: i,
                addedBatchIds: s
            })));
        }));
    }));
}

/* Accepts locally generated Mutations and commit them to storage. */
/**
 * Acknowledges the given batch.
 *
 * On the happy path when a batch is acknowledged, the local store will
 *
 *  + remove the batch from the mutation queue;
 *  + apply the changes to the remote document cache;
 *  + recalculate the latency compensated view implied by those changes (there
 *    may be mutations in the queue that affect the documents but haven't been
 *    acknowledged yet); and
 *  + give the changed documents back the sync engine
 *
 * @returns The resulting (modified) documents.
 */
function __PRIVATE_localStoreAcknowledgeBatch(e, t) {
    const n = __PRIVATE_debugCast(e);
    return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (e => {
        const r = t.batch.keys(), i = n.ss.newChangeBuffer({
            trackRemovals: !0
        });
        return function __PRIVATE_applyWriteToRemoteDocuments(e, t, n, r) {
            const i = n.batch, s = i.keys();
            let o = PersistencePromise.resolve();
            return s.forEach((e => {
                o = o.next((() => r.getEntry(t, e))).next((t => {
                    const s = n.docVersions.get(e);
                    __PRIVATE_hardAssert(null !== s), t.version.compareTo(s) < 0 && (i.applyToRemoteDocument(t, n), 
                    t.isValidDocument() && (
                    // We use the commitVersion as the readTime rather than the
                    // document's updateTime since the updateTime is not advanced
                    // for updates that do not modify the underlying document.
                    t.setReadTime(n.commitVersion), r.addEntry(t)));
                }));
            })), o.next((() => e.mutationQueue.removeMutationBatch(t, i)));
        }
        /** Returns the local view of the documents affected by a mutation batch. */
        // PORTING NOTE: Multi-Tab only.
        (n, e, t, i).next((() => i.apply(e))).next((() => n.mutationQueue.performConsistencyCheck(e))).next((() => n.documentOverlayCache.removeOverlaysForBatchId(e, r, t.batch.batchId))).next((() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e, function __PRIVATE_getKeysWithTransformResults(e) {
            let t = __PRIVATE_documentKeySet();
            for (let n = 0; n < e.mutationResults.length; ++n) {
                e.mutationResults[n].transformResults.length > 0 && (t = t.add(e.batch.mutations[n].key));
            }
            return t;
        }
        /**
 * Removes mutations from the MutationQueue for the specified batch;
 * LocalDocuments will be recalculated.
 *
 * @returns The resulting modified documents.
 */ (t)))).next((() => n.localDocuments.getDocuments(e, r)));
    }));
}

/**
 * Returns the last consistent snapshot processed (used by the RemoteStore to
 * determine whether to buffer incoming snapshots from the backend).
 */
function __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e) {
    const t = __PRIVATE_debugCast(e);
    return t.persistence.runTransaction("Get last remote snapshot version", "readonly", (e => t.qr.getLastRemoteSnapshotVersion(e)));
}

/**
 * Updates the "ground-state" (remote) documents. We assume that the remote
 * event reflects any write batches that have been acknowledged or rejected
 * (i.e. we do not re-apply local mutations to updates from this event).
 *
 * LocalDocuments are re-calculated if there are remaining mutations in the
 * queue.
 */ function __PRIVATE_localStoreApplyRemoteEventToLocalCache(e, t) {
    const n = __PRIVATE_debugCast(e), r = t.snapshotVersion;
    let i = n.ts;
    return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (e => {
        const s = n.ss.newChangeBuffer({
            trackRemovals: !0
        });
        // Reset newTargetDataByTargetMap in case this transaction gets re-run.
                i = n.ts;
        const o = [];
        t.targetChanges.forEach(((s, _) => {
            const a = i.get(_);
            if (!a) return;
            // Only update the remote keys if the target is still active. This
            // ensures that we can persist the updated target data along with
            // the updated assignment.
                        o.push(n.qr.removeMatchingKeys(e, s.removedDocuments, _).next((() => n.qr.addMatchingKeys(e, s.addedDocuments, _))));
            let u = a.withSequenceNumber(e.currentSequenceNumber);
            null !== t.targetMismatches.get(_) ? u = u.withResumeToken(ByteString.EMPTY_BYTE_STRING, SnapshotVersion.min()).withLastLimboFreeSnapshotVersion(SnapshotVersion.min()) : s.resumeToken.approximateByteSize() > 0 && (u = u.withResumeToken(s.resumeToken, r)), 
            i = i.insert(_, u), 
            // Update the target data if there are target changes (or if
            // sufficient time has passed since the last update).
            /**
 * Returns true if the newTargetData should be persisted during an update of
 * an active target. TargetData should always be persisted when a target is
 * being released and should not call this function.
 *
 * While the target is active, TargetData updates can be omitted when nothing
 * about the target has changed except metadata like the resume token or
 * snapshot version. Occasionally it's worth the extra write to prevent these
 * values from getting too stale after a crash, but this doesn't have to be
 * too frequent.
 */
            function __PRIVATE_shouldPersistTargetData(e, t, n) {
                // Always persist target data if we don't already have a resume token.
                if (0 === e.resumeToken.approximateByteSize()) return !0;
                // Don't allow resume token changes to be buffered indefinitely. This
                // allows us to be reasonably up-to-date after a crash and avoids needing
                // to loop over all active queries on shutdown. Especially in the browser
                // we may not get time to do anything interesting while the current tab is
                // closing.
                                if (t.snapshotVersion.toMicroseconds() - e.snapshotVersion.toMicroseconds() >= 3e8) return !0;
                // Otherwise if the only thing that has changed about a target is its resume
                // token it's not worth persisting. Note that the RemoteStore keeps an
                // in-memory view of the currently active targets which includes the current
                // resume token, so stream failure or user changes will still use an
                // up-to-date resume token regardless of what we do here.
                                return n.addedDocuments.size + n.modifiedDocuments.size + n.removedDocuments.size > 0;
            }
            /**
 * Notifies local store of the changed views to locally pin documents.
 */ (a, u, s) && o.push(n.qr.updateTargetData(e, u));
        }));
        let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
        // HACK: The only reason we allow a null snapshot version is so that we
        // can synthesize remote events when we get permission denied errors while
        // trying to resolve the state of a locally cached document that is in
        // limbo.
        if (t.documentUpdates.forEach((r => {
            t.resolvedLimboDocuments.has(r) && o.push(n.persistence.referenceDelegate.updateLimboDocument(e, r));
        })), 
        // Each loop iteration only affects its "own" doc, so it's safe to get all
        // the remote documents in advance in a single call.
        o.push(__PRIVATE_populateDocumentChangeBuffer(e, s, t.documentUpdates).next((e => {
            _ = e.us, a = e.cs;
        }))), !r.isEqual(SnapshotVersion.min())) {
            const t = n.qr.getLastRemoteSnapshotVersion(e).next((t => n.qr.setTargetsMetadata(e, e.currentSequenceNumber, r)));
            o.push(t);
        }
        return PersistencePromise.waitFor(o).next((() => s.apply(e))).next((() => n.localDocuments.getLocalViewOfDocuments(e, _, a))).next((() => _));
    })).then((e => (n.ts = i, e)));
}

/**
 * Populates document change buffer with documents from backend or a bundle.
 * Returns the document changes resulting from applying those documents, and
 * also a set of documents whose existence state are changed as a result.
 *
 * @param txn - Transaction to use to read existing documents from storage.
 * @param documentBuffer - Document buffer to collect the resulted changes to be
 *        applied to storage.
 * @param documents - Documents to be applied.
 */ function __PRIVATE_populateDocumentChangeBuffer(e, t, n) {
    let r = __PRIVATE_documentKeySet(), i = __PRIVATE_documentKeySet();
    return n.forEach((e => r = r.add(e))), t.getEntries(e, r).next((e => {
        let r = __PRIVATE_mutableDocumentMap();
        return n.forEach(((n, s) => {
            const o = e.get(n);
            // Check if see if there is a existence state change for this document.
                        s.isFoundDocument() !== o.isFoundDocument() && (i = i.add(n)), 
            // Note: The order of the steps below is important, since we want
            // to ensure that rejected limbo resolutions (which fabricate
            // NoDocuments with SnapshotVersion.min()) never add documents to
            // cache.
            s.isNoDocument() && s.version.isEqual(SnapshotVersion.min()) ? (
            // NoDocuments with SnapshotVersion.min() are used in manufactured
            // events. We remove these documents from cache since we lost
            // access.
            t.removeEntry(n, s.readTime), r = r.insert(n, s)) : !o.isValidDocument() || s.version.compareTo(o.version) > 0 || 0 === s.version.compareTo(o.version) && o.hasPendingWrites ? (t.addEntry(s), 
            r = r.insert(n, s)) : __PRIVATE_logDebug("LocalStore", "Ignoring outdated watch update for ", n, ". Current version:", o.version, " Watch version:", s.version);
        })), {
            us: r,
            cs: i
        };
    }));
}

/**
 * Gets the mutation batch after the passed in batchId in the mutation queue
 * or null if empty.
 * @param afterBatchId - If provided, the batch to search after.
 * @returns The next mutation or null if there wasn't one.
 */
function __PRIVATE_localStoreGetNextMutationBatch(e, t) {
    const n = __PRIVATE_debugCast(e);
    return n.persistence.runTransaction("Get next mutation batch", "readonly", (e => (void 0 === t && (t = -1), 
    n.mutationQueue.getNextMutationBatchAfterBatchId(e, t))));
}

/**
 * Reads the current value of a Document with a given key or null if not
 * found - used for testing.
 */
/**
 * Assigns the given target an internal ID so that its results can be pinned so
 * they don't get GC'd. A target must be allocated in the local store before
 * the store can be used to manage its view.
 *
 * Allocating an already allocated `Target` will return the existing `TargetData`
 * for that `Target`.
 */
function __PRIVATE_localStoreAllocateTarget(e, t) {
    const n = __PRIVATE_debugCast(e);
    return n.persistence.runTransaction("Allocate target", "readwrite", (e => {
        let r;
        return n.qr.getTargetData(e, t).next((i => i ? (
        // This target has been listened to previously, so reuse the
        // previous targetID.
        // TODO(mcg): freshen last accessed date?
        r = i, PersistencePromise.resolve(r)) : n.qr.allocateTargetId(e).next((i => (r = new TargetData(t, i, "TargetPurposeListen" /* TargetPurpose.Listen */ , e.currentSequenceNumber), 
        n.qr.addTargetData(e, r).next((() => r)))))));
    })).then((e => {
        // If Multi-Tab is enabled, the existing target data may be newer than
        // the in-memory data
        const r = n.ts.get(e.targetId);
        return (null === r || e.snapshotVersion.compareTo(r.snapshotVersion) > 0) && (n.ts = n.ts.insert(e.targetId, e), 
        n.ns.set(t, e.targetId)), e;
    }));
}

/**
 * Returns the TargetData as seen by the LocalStore, including updates that may
 * have not yet been persisted to the TargetCache.
 */
// Visible for testing.
/**
 * Unpins all the documents associated with the given target. If
 * `keepPersistedTargetData` is set to false and Eager GC enabled, the method
 * directly removes the associated target data from the target cache.
 *
 * Releasing a non-existing `Target` is a no-op.
 */
// PORTING NOTE: `keepPersistedTargetData` is multi-tab only.
async function __PRIVATE_localStoreReleaseTarget(e, t, n) {
    const r = __PRIVATE_debugCast(e), i = r.ts.get(t), s = n ? "readwrite" : "readwrite-primary";
    try {
        n || await r.persistence.runTransaction("Release target", s, (e => r.persistence.referenceDelegate.removeTarget(e, i)));
    } catch (e) {
        if (!__PRIVATE_isIndexedDbTransactionError(e)) throw e;
        // All `releaseTarget` does is record the final metadata state for the
        // target, but we've been recording this periodically during target
        // activity. If we lose this write this could cause a very slight
        // difference in the order of target deletion during GC, but we
        // don't define exact LRU semantics so this is acceptable.
        __PRIVATE_logDebug("LocalStore", `Failed to update sequence numbers for target ${t}: ${e}`);
    }
    r.ts = r.ts.remove(t), r.ns.delete(i.target);
}

/**
 * Runs the specified query against the local store and returns the results,
 * potentially taking advantage of query data from previous executions (such
 * as the set of remote keys).
 *
 * @param usePreviousResults - Whether results from previous executions can
 * be used to optimize this query execution.
 */ function __PRIVATE_localStoreExecuteQuery(e, t, n) {
    const r = __PRIVATE_debugCast(e);
    let i = SnapshotVersion.min(), s = __PRIVATE_documentKeySet();
    return r.persistence.runTransaction("Execute query", "readwrite", (// Use readwrite instead of readonly so indexes can be created
    // Use readwrite instead of readonly so indexes can be created
    e => function __PRIVATE_localStoreGetTargetData(e, t, n) {
        const r = __PRIVATE_debugCast(e), i = r.ns.get(n);
        return void 0 !== i ? PersistencePromise.resolve(r.ts.get(i)) : r.qr.getTargetData(t, n);
    }(r, e, __PRIVATE_queryToTarget(t)).next((t => {
        if (t) return i = t.lastLimboFreeSnapshotVersion, r.qr.getMatchingKeysForTargetId(e, t.targetId).next((e => {
            s = e;
        }));
    })).next((() => r.es.getDocumentsMatchingQuery(e, t, n ? i : SnapshotVersion.min(), n ? s : __PRIVATE_documentKeySet()))).next((e => (__PRIVATE_setMaxReadTime(r, __PRIVATE_queryCollectionGroup(t), e), 
    {
        documents: e,
        ls: s
    })))));
}

// PORTING NOTE: Multi-Tab only.
function __PRIVATE_localStoreGetCachedTarget(e, t) {
    const n = __PRIVATE_debugCast(e), r = __PRIVATE_debugCast(n.qr), i = n.ts.get(t);
    return i ? Promise.resolve(i.target) : n.persistence.runTransaction("Get target data", "readonly", (e => r._t(e, t).next((e => e ? e.target : null))));
}

/**
 * Returns the set of documents that have been updated since the last call.
 * If this is the first call, returns the set of changes since client
 * initialization. Further invocations will return document that have changed
 * since the prior call.
 */
// PORTING NOTE: Multi-Tab only.
function __PRIVATE_localStoreGetNewDocumentChanges(e, t) {
    const n = __PRIVATE_debugCast(e), r = n.rs.get(t) || SnapshotVersion.min();
    // Get the current maximum read time for the collection. This should always
    // exist, but to reduce the chance for regressions we default to
    // SnapshotVersion.Min()
    // TODO(indexing): Consider removing the default value.
        return n.persistence.runTransaction("Get new document changes", "readonly", (e => n.ss.getAllFromCollectionGroup(e, t, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r, -1), 
    /* limit= */ Number.MAX_SAFE_INTEGER))).then((e => (__PRIVATE_setMaxReadTime(n, t, e), 
    e)));
}

/** Sets the collection group's maximum read time from the given documents. */
// PORTING NOTE: Multi-Tab only.
function __PRIVATE_setMaxReadTime(e, t, n) {
    let r = e.rs.get(t) || SnapshotVersion.min();
    n.forEach(((e, t) => {
        t.readTime.compareTo(r) > 0 && (r = t.readTime);
    })), e.rs.set(t, r);
}

/**
 * Creates a new target using the given bundle name, which will be used to
 * hold the keys of all documents from the bundle in query-document mappings.
 * This ensures that the loaded documents do not get garbage collected
 * right away.
 */
/**
 * Applies the documents from a bundle to the "ground-state" (remote)
 * documents.
 *
 * LocalDocuments are re-calculated if there are remaining mutations in the
 * queue.
 */
async function __PRIVATE_localStoreApplyBundledDocuments(e, t, n, r) {
    const i = __PRIVATE_debugCast(e);
    let s = __PRIVATE_documentKeySet(), o = __PRIVATE_mutableDocumentMap();
    for (const e of n) {
        const n = t.hs(e.metadata.name);
        e.document && (s = s.add(n));
        const r = t.Ps(e);
        r.setReadTime(t.Is(e.metadata.readTime)), o = o.insert(n, r);
    }
    const _ = i.ss.newChangeBuffer({
        trackRemovals: !0
    }), a = await __PRIVATE_localStoreAllocateTarget(i, function __PRIVATE_umbrellaTarget(e) {
        // It is OK that the path used for the query is not valid, because this will
        // not be read and queried.
        return __PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(ResourcePath.fromString(`__bundle__/docs/${e}`)));
    }(r));
    // Allocates a target to hold all document keys from the bundle, such that
    // they will not get garbage collected right away.
        return i.persistence.runTransaction("Apply bundle documents", "readwrite", (e => __PRIVATE_populateDocumentChangeBuffer(e, _, o).next((t => (_.apply(e), 
    t))).next((t => i.qr.removeMatchingKeysForTargetId(e, a.targetId).next((() => i.qr.addMatchingKeys(e, s, a.targetId))).next((() => i.localDocuments.getLocalViewOfDocuments(e, t.us, t.cs))).next((() => t.us))))));
}

/**
 * Returns a promise of a boolean to indicate if the given bundle has already
 * been loaded and the create time is newer than the current loading bundle.
 */
/**
 * Saves the given `NamedQuery` to local persistence.
 */
async function __PRIVATE_localStoreSaveNamedQuery(e, t, n = __PRIVATE_documentKeySet()) {
    // Allocate a target for the named query such that it can be resumed
    // from associated read time if users use it to listen.
    // NOTE: this also means if no corresponding target exists, the new target
    // will remain active and will not get collected, unless users happen to
    // unlisten the query somehow.
    const r = await __PRIVATE_localStoreAllocateTarget(e, __PRIVATE_queryToTarget(__PRIVATE_fromBundledQuery(t.bundledQuery))), i = __PRIVATE_debugCast(e);
    return i.persistence.runTransaction("Save named query", "readwrite", (e => {
        const s = __PRIVATE_fromVersion(t.readTime);
        // Simply save the query itself if it is older than what the SDK already
        // has.
                if (r.snapshotVersion.compareTo(s) >= 0) return i.Kr.saveNamedQuery(e, t);
        // Update existing target data because the query from the bundle is newer.
                const o = r.withResumeToken(ByteString.EMPTY_BYTE_STRING, s);
        return i.ts = i.ts.insert(o.targetId, o), i.qr.updateTargetData(e, o).next((() => i.qr.removeMatchingKeysForTargetId(e, r.targetId))).next((() => i.qr.addMatchingKeys(e, n, r.targetId))).next((() => i.Kr.saveNamedQuery(e, t)));
    }));
}

/** Assembles the key for a client state in WebStorage */
function createWebStorageClientStateKey(e, t) {
    return `firestore_clients_${e}_${t}`;
}

// The format of the WebStorage key that stores the mutation state is:
//     firestore_mutations_<persistence_prefix>_<batch_id>
//     (for unauthenticated users)
// or: firestore_mutations_<persistence_prefix>_<batch_id>_<user_uid>

// 'user_uid' is last to avoid needing to escape '_' characters that it might
// contain.
/** Assembles the key for a mutation batch in WebStorage */
function createWebStorageMutationBatchKey(e, t, n) {
    let r = `firestore_mutations_${e}_${n}`;
    return t.isAuthenticated() && (r += `_${t.uid}`), r;
}

// The format of the WebStorage key that stores a query target's metadata is:
//     firestore_targets_<persistence_prefix>_<target_id>
/** Assembles the key for a query state in WebStorage */
function createWebStorageQueryTargetMetadataKey(e, t) {
    return `firestore_targets_${e}_${t}`;
}

// The WebStorage prefix that stores the primary tab's online state. The
// format of the key is:
//     firestore_online_state_<persistence_prefix>
/**
 * Holds the state of a mutation batch, including its user ID, batch ID and
 * whether the batch is 'pending', 'acknowledged' or 'rejected'.
 */
// Visible for testing
class __PRIVATE_MutationMetadata {
    constructor(e, t, n, r) {
        this.user = e, this.batchId = t, this.state = n, this.error = r;
    }
    /**
     * Parses a MutationMetadata from its JSON representation in WebStorage.
     * Logs a warning and returns null if the format of the data is not valid.
     */    static Ts(e, t, n) {
        const r = JSON.parse(n);
        let i, s = "object" == typeof r && -1 !== [ "pending", "acknowledged", "rejected" ].indexOf(r.state) && (void 0 === r.error || "object" == typeof r.error);
        return s && r.error && (s = "string" == typeof r.error.message && "string" == typeof r.error.code, 
        s && (i = new FirestoreError(r.error.code, r.error.message))), s ? new __PRIVATE_MutationMetadata(e, t, r.state, i) : (__PRIVATE_logError("SharedClientState", `Failed to parse mutation state for ID '${t}': ${n}`), 
        null);
    }
    Es() {
        const e = {
            state: this.state,
            updateTimeMs: Date.now()
        };
        return this.error && (e.error = {
            code: this.error.code,
            message: this.error.message
        }), JSON.stringify(e);
    }
}

/**
 * Holds the state of a query target, including its target ID and whether the
 * target is 'not-current', 'current' or 'rejected'.
 */
// Visible for testing
class __PRIVATE_QueryTargetMetadata {
    constructor(e, t, n) {
        this.targetId = e, this.state = t, this.error = n;
    }
    /**
     * Parses a QueryTargetMetadata from its JSON representation in WebStorage.
     * Logs a warning and returns null if the format of the data is not valid.
     */    static Ts(e, t) {
        const n = JSON.parse(t);
        let r, i = "object" == typeof n && -1 !== [ "not-current", "current", "rejected" ].indexOf(n.state) && (void 0 === n.error || "object" == typeof n.error);
        return i && n.error && (i = "string" == typeof n.error.message && "string" == typeof n.error.code, 
        i && (r = new FirestoreError(n.error.code, n.error.message))), i ? new __PRIVATE_QueryTargetMetadata(e, n.state, r) : (__PRIVATE_logError("SharedClientState", `Failed to parse target state for ID '${e}': ${t}`), 
        null);
    }
    Es() {
        const e = {
            state: this.state,
            updateTimeMs: Date.now()
        };
        return this.error && (e.error = {
            code: this.error.code,
            message: this.error.message
        }), JSON.stringify(e);
    }
}

/**
 * This class represents the immutable ClientState for a client read from
 * WebStorage, containing the list of active query targets.
 */ class __PRIVATE_RemoteClientState {
    constructor(e, t) {
        this.clientId = e, this.activeTargetIds = t;
    }
    /**
     * Parses a RemoteClientState from the JSON representation in WebStorage.
     * Logs a warning and returns null if the format of the data is not valid.
     */    static Ts(e, t) {
        const n = JSON.parse(t);
        let r = "object" == typeof n && n.activeTargetIds instanceof Array, i = __PRIVATE_targetIdSet();
        for (let e = 0; r && e < n.activeTargetIds.length; ++e) r = isSafeInteger(n.activeTargetIds[e]), 
        i = i.add(n.activeTargetIds[e]);
        return r ? new __PRIVATE_RemoteClientState(e, i) : (__PRIVATE_logError("SharedClientState", `Failed to parse client data for instance '${e}': ${t}`), 
        null);
    }
}

/**
 * This class represents the online state for all clients participating in
 * multi-tab. The online state is only written to by the primary client, and
 * used in secondary clients to update their query views.
 */ class __PRIVATE_SharedOnlineState {
    constructor(e, t) {
        this.clientId = e, this.onlineState = t;
    }
    /**
     * Parses a SharedOnlineState from its JSON representation in WebStorage.
     * Logs a warning and returns null if the format of the data is not valid.
     */    static Ts(e) {
        const t = JSON.parse(e);
        return "object" == typeof t && -1 !== [ "Unknown", "Online", "Offline" ].indexOf(t.onlineState) && "string" == typeof t.clientId ? new __PRIVATE_SharedOnlineState(t.clientId, t.onlineState) : (__PRIVATE_logError("SharedClientState", `Failed to parse online state: ${e}`), 
        null);
    }
}

/**
 * Metadata state of the local client. Unlike `RemoteClientState`, this class is
 * mutable and keeps track of all pending mutations, which allows us to
 * update the range of pending mutation batch IDs as new mutations are added or
 * removed.
 *
 * The data in `LocalClientState` is not read from WebStorage and instead
 * updated via its instance methods. The updated state can be serialized via
 * `toWebStorageJSON()`.
 */
// Visible for testing.
class __PRIVATE_LocalClientState {
    constructor() {
        this.activeTargetIds = __PRIVATE_targetIdSet();
    }
    ds(e) {
        this.activeTargetIds = this.activeTargetIds.add(e);
    }
    As(e) {
        this.activeTargetIds = this.activeTargetIds.delete(e);
    }
    /**
     * Converts this entry into a JSON-encoded format we can use for WebStorage.
     * Does not encode `clientId` as it is part of the key in WebStorage.
     */    Es() {
        const e = {
            activeTargetIds: this.activeTargetIds.toArray(),
            updateTimeMs: Date.now()
        };
        return JSON.stringify(e);
    }
}

/**
 * `WebStorageSharedClientState` uses WebStorage (window.localStorage) as the
 * backing store for the SharedClientState. It keeps track of all active
 * clients and supports modifications of the local client's data.
 */ class __PRIVATE_WebStorageSharedClientState {
    constructor(e, t, n, r, i) {
        this.window = e, this.si = t, this.persistenceKey = n, this.Rs = r, this.syncEngine = null, 
        this.onlineStateHandler = null, this.sequenceNumberHandler = null, this.Vs = this.fs.bind(this), 
        this.gs = new SortedMap(__PRIVATE_primitiveComparator), this.started = !1, 
        /**
         * Captures WebStorage events that occur before `start()` is called. These
         * events are replayed once `WebStorageSharedClientState` is started.
         */
        this.ps = [];
        // Escape the special characters mentioned here:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        const s = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        this.storage = this.window.localStorage, this.currentUser = i, this.ys = createWebStorageClientStateKey(this.persistenceKey, this.Rs), 
        this.ws = 
        /** Assembles the key for the current sequence number. */
        function createWebStorageSequenceNumberKey(e) {
            return `firestore_sequence_number_${e}`;
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
 */ (this.persistenceKey), this.gs = this.gs.insert(this.Rs, new __PRIVATE_LocalClientState), 
        this.Ss = new RegExp(`^firestore_clients_${s}_([^_]*)$`), this.bs = new RegExp(`^firestore_mutations_${s}_(\\d+)(?:_(.*))?$`), 
        this.Ds = new RegExp(`^firestore_targets_${s}_(\\d+)$`), this.Cs = 
        /** Assembles the key for the online state of the primary tab. */
        function createWebStorageOnlineStateKey(e) {
            return `firestore_online_state_${e}`;
        }
        // The WebStorage prefix that plays as a event to indicate the remote documents
        // might have changed due to some secondary tabs loading a bundle.
        // format of the key is:
        //     firestore_bundle_loaded_v2_<persistenceKey>
        // The version ending with "v2" stores the list of modified collection groups.
        (this.persistenceKey), this.vs = function createBundleLoadedKey(e) {
            return `firestore_bundle_loaded_v2_${e}`;
        }
        // The WebStorage key prefix for the key that stores the last sequence number allocated. The key
        // looks like 'firestore_sequence_number_<persistence_prefix>'.
        (this.persistenceKey), 
        // Rather than adding the storage observer during start(), we add the
        // storage observer during initialization. This ensures that we collect
        // events before other components populate their initial state (during their
        // respective start() calls). Otherwise, we might for example miss a
        // mutation that is added after LocalStore's start() processed the existing
        // mutations but before we observe WebStorage events.
        this.window.addEventListener("storage", this.Vs);
    }
    /** Returns 'true' if WebStorage is available in the current environment. */    static D(e) {
        return !(!e || !e.localStorage);
    }
    async start() {
        // Retrieve the list of existing clients to backfill the data in
        // SharedClientState.
        const e = await this.syncEngine.Bi();
        for (const t of e) {
            if (t === this.Rs) continue;
            const e = this.getItem(createWebStorageClientStateKey(this.persistenceKey, t));
            if (e) {
                const n = __PRIVATE_RemoteClientState.Ts(t, e);
                n && (this.gs = this.gs.insert(n.clientId, n));
            }
        }
        this.Fs();
        // Check if there is an existing online state and call the callback handler
        // if applicable.
        const t = this.storage.getItem(this.Cs);
        if (t) {
            const e = this.Ms(t);
            e && this.xs(e);
        }
        for (const e of this.ps) this.fs(e);
        this.ps = [], 
        // Register a window unload hook to remove the client metadata entry from
        // WebStorage even if `shutdown()` was not called.
        this.window.addEventListener("pagehide", (() => this.shutdown())), this.started = !0;
    }
    writeSequenceNumber(e) {
        this.setItem(this.ws, JSON.stringify(e));
    }
    getAllActiveQueryTargets() {
        return this.Os(this.gs);
    }
    isActiveQueryTarget(e) {
        let t = !1;
        return this.gs.forEach(((n, r) => {
            r.activeTargetIds.has(e) && (t = !0);
        })), t;
    }
    addPendingMutation(e) {
        this.Ns(e, "pending");
    }
    updateMutationState(e, t, n) {
        this.Ns(e, t, n), 
        // Once a final mutation result is observed by other clients, they no longer
        // access the mutation's metadata entry. Since WebStorage replays events
        // in order, it is safe to delete the entry right after updating it.
        this.Bs(e);
    }
    addLocalQueryTarget(e) {
        let t = "not-current";
        // Lookup an existing query state if the target ID was already registered
        // by another tab
                if (this.isActiveQueryTarget(e)) {
            const n = this.storage.getItem(createWebStorageQueryTargetMetadataKey(this.persistenceKey, e));
            if (n) {
                const r = __PRIVATE_QueryTargetMetadata.Ts(e, n);
                r && (t = r.state);
            }
        }
        return this.Ls.ds(e), this.Fs(), t;
    }
    removeLocalQueryTarget(e) {
        this.Ls.As(e), this.Fs();
    }
    isLocalQueryTarget(e) {
        return this.Ls.activeTargetIds.has(e);
    }
    clearQueryState(e) {
        this.removeItem(createWebStorageQueryTargetMetadataKey(this.persistenceKey, e));
    }
    updateQueryState(e, t, n) {
        this.ks(e, t, n);
    }
    handleUserChange(e, t, n) {
        t.forEach((e => {
            this.Bs(e);
        })), this.currentUser = e, n.forEach((e => {
            this.addPendingMutation(e);
        }));
    }
    setOnlineState(e) {
        this.qs(e);
    }
    notifyBundleLoaded(e) {
        this.Qs(e);
    }
    shutdown() {
        this.started && (this.window.removeEventListener("storage", this.Vs), this.removeItem(this.ys), 
        this.started = !1);
    }
    getItem(e) {
        const t = this.storage.getItem(e);
        return __PRIVATE_logDebug("SharedClientState", "READ", e, t), t;
    }
    setItem(e, t) {
        __PRIVATE_logDebug("SharedClientState", "SET", e, t), this.storage.setItem(e, t);
    }
    removeItem(e) {
        __PRIVATE_logDebug("SharedClientState", "REMOVE", e), this.storage.removeItem(e);
    }
    fs(e) {
        // Note: The function is typed to take Event to be interface-compatible with
        // `Window.addEventListener`.
        const t = e;
        if (t.storageArea === this.storage) {
            if (__PRIVATE_logDebug("SharedClientState", "EVENT", t.key, t.newValue), t.key === this.ys) return void __PRIVATE_logError("Received WebStorage notification for local change. Another client might have garbage-collected our state");
            this.si.enqueueRetryable((async () => {
                if (this.started) {
                    if (null !== t.key) if (this.Ss.test(t.key)) {
                        if (null == t.newValue) {
                            const e = this.Ks(t.key);
                            return this.$s(e, null);
                        }
                        {
                            const e = this.Us(t.key, t.newValue);
                            if (e) return this.$s(e.clientId, e);
                        }
                    } else if (this.bs.test(t.key)) {
                        if (null !== t.newValue) {
                            const e = this.Ws(t.key, t.newValue);
                            if (e) return this.Gs(e);
                        }
                    } else if (this.Ds.test(t.key)) {
                        if (null !== t.newValue) {
                            const e = this.zs(t.key, t.newValue);
                            if (e) return this.js(e);
                        }
                    } else if (t.key === this.Cs) {
                        if (null !== t.newValue) {
                            const e = this.Ms(t.newValue);
                            if (e) return this.xs(e);
                        }
                    } else if (t.key === this.ws) {
                        const e = function __PRIVATE_fromWebStorageSequenceNumber(e) {
                            let t = __PRIVATE_ListenSequence._e;
                            if (null != e) try {
                                const n = JSON.parse(e);
                                __PRIVATE_hardAssert("number" == typeof n), t = n;
                            } catch (e) {
                                __PRIVATE_logError("SharedClientState", "Failed to read sequence number from WebStorage", e);
                            }
                            return t;
                        }
                        /**
 * `MemorySharedClientState` is a simple implementation of SharedClientState for
 * clients using memory persistence. The state in this class remains fully
 * isolated and no synchronization is performed.
 */ (t.newValue);
                        e !== __PRIVATE_ListenSequence._e && this.sequenceNumberHandler(e);
                    } else if (t.key === this.vs) {
                        const e = this.Hs(t.newValue);
                        await Promise.all(e.map((e => this.syncEngine.Js(e))));
                    }
                } else this.ps.push(t);
            }));
        }
    }
    get Ls() {
        return this.gs.get(this.Rs);
    }
    Fs() {
        this.setItem(this.ys, this.Ls.Es());
    }
    Ns(e, t, n) {
        const r = new __PRIVATE_MutationMetadata(this.currentUser, e, t, n), i = createWebStorageMutationBatchKey(this.persistenceKey, this.currentUser, e);
        this.setItem(i, r.Es());
    }
    Bs(e) {
        const t = createWebStorageMutationBatchKey(this.persistenceKey, this.currentUser, e);
        this.removeItem(t);
    }
    qs(e) {
        const t = {
            clientId: this.Rs,
            onlineState: e
        };
        this.storage.setItem(this.Cs, JSON.stringify(t));
    }
    ks(e, t, n) {
        const r = createWebStorageQueryTargetMetadataKey(this.persistenceKey, e), i = new __PRIVATE_QueryTargetMetadata(e, t, n);
        this.setItem(r, i.Es());
    }
    Qs(e) {
        const t = JSON.stringify(Array.from(e));
        this.setItem(this.vs, t);
    }
    /**
     * Parses a client state key in WebStorage. Returns null if the key does not
     * match the expected key format.
     */    Ks(e) {
        const t = this.Ss.exec(e);
        return t ? t[1] : null;
    }
    /**
     * Parses a client state in WebStorage. Returns 'null' if the value could not
     * be parsed.
     */    Us(e, t) {
        const n = this.Ks(e);
        return __PRIVATE_RemoteClientState.Ts(n, t);
    }
    /**
     * Parses a mutation batch state in WebStorage. Returns 'null' if the value
     * could not be parsed.
     */    Ws(e, t) {
        const n = this.bs.exec(e), r = Number(n[1]), i = void 0 !== n[2] ? n[2] : null;
        return __PRIVATE_MutationMetadata.Ts(new User(i), r, t);
    }
    /**
     * Parses a query target state from WebStorage. Returns 'null' if the value
     * could not be parsed.
     */    zs(e, t) {
        const n = this.Ds.exec(e), r = Number(n[1]);
        return __PRIVATE_QueryTargetMetadata.Ts(r, t);
    }
    /**
     * Parses an online state from WebStorage. Returns 'null' if the value
     * could not be parsed.
     */    Ms(e) {
        return __PRIVATE_SharedOnlineState.Ts(e);
    }
    Hs(e) {
        return JSON.parse(e);
    }
    async Gs(e) {
        if (e.user.uid === this.currentUser.uid) return this.syncEngine.Ys(e.batchId, e.state, e.error);
        __PRIVATE_logDebug("SharedClientState", `Ignoring mutation for non-active user ${e.user.uid}`);
    }
    js(e) {
        return this.syncEngine.Zs(e.targetId, e.state, e.error);
    }
    $s(e, t) {
        const n = t ? this.gs.insert(e, t) : this.gs.remove(e), r = this.Os(this.gs), i = this.Os(n), s = [], o = [];
        return i.forEach((e => {
            r.has(e) || s.push(e);
        })), r.forEach((e => {
            i.has(e) || o.push(e);
        })), this.syncEngine.Xs(s, o).then((() => {
            this.gs = n;
        }));
    }
    xs(e) {
        // We check whether the client that wrote this online state is still active
        // by comparing its client ID to the list of clients kept active in
        // IndexedDb. If a client does not update their IndexedDb client state
        // within 5 seconds, it is considered inactive and we don't emit an online
        // state event.
        this.gs.get(e.clientId) && this.onlineStateHandler(e.onlineState);
    }
    Os(e) {
        let t = __PRIVATE_targetIdSet();
        return e.forEach(((e, n) => {
            t = t.unionWith(n.activeTargetIds);
        })), t;
    }
}

class __PRIVATE_MemorySharedClientState {
    constructor() {
        this.eo = new __PRIVATE_LocalClientState, this.no = {}, this.onlineStateHandler = null, 
        this.sequenceNumberHandler = null;
    }
    addPendingMutation(e) {
        // No op.
    }
    updateMutationState(e, t, n) {
        // No op.
    }
    addLocalQueryTarget(e) {
        return this.eo.ds(e), this.no[e] || "not-current";
    }
    updateQueryState(e, t, n) {
        this.no[e] = t;
    }
    removeLocalQueryTarget(e) {
        this.eo.As(e);
    }
    isLocalQueryTarget(e) {
        return this.eo.activeTargetIds.has(e);
    }
    clearQueryState(e) {
        delete this.no[e];
    }
    getAllActiveQueryTargets() {
        return this.eo.activeTargetIds;
    }
    isActiveQueryTarget(e) {
        return this.eo.activeTargetIds.has(e);
    }
    start() {
        return this.eo = new __PRIVATE_LocalClientState, Promise.resolve();
    }
    handleUserChange(e, t, n) {
        // No op.
    }
    setOnlineState(e) {
        // No op.
    }
    shutdown() {}
    writeSequenceNumber(e) {}
    notifyBundleLoaded(e) {
        // No op.
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
 */ class __PRIVATE_NoopConnectivityMonitor {
    ro(e) {
        // No-op.
    }
    shutdown() {
        // No-op.
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
// References to `window` are guarded by BrowserConnectivityMonitor.isAvailable()
/* eslint-disable no-restricted-globals */
/**
 * Browser implementation of ConnectivityMonitor.
 */
class __PRIVATE_BrowserConnectivityMonitor {
    constructor() {
        this.io = () => this.so(), this.oo = () => this._o(), this.ao = [], this.uo();
    }
    ro(e) {
        this.ao.push(e);
    }
    shutdown() {
        window.removeEventListener("online", this.io), window.removeEventListener("offline", this.oo);
    }
    uo() {
        window.addEventListener("online", this.io), window.addEventListener("offline", this.oo);
    }
    so() {
        __PRIVATE_logDebug("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
        for (const e of this.ao) e(0 /* NetworkStatus.AVAILABLE */);
    }
    _o() {
        __PRIVATE_logDebug("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
        for (const e of this.ao) e(1 /* NetworkStatus.UNAVAILABLE */);
    }
    // TODO(chenbrian): Consider passing in window either into this component or
    // here for testing via FakeWindow.
    /** Checks that all used attributes of window are available. */
    static D() {
        return "undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener;
    }
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
 */ let Ve = null;

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
    return null === Ve ? Ve = function __PRIVATE_generateInitialUniqueDebugId() {
        return 268435456 + Math.round(2147483648 * Math.random());
    }() : Ve++, "0x" + Ve.toString(16);
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
 */ const me = {
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
 * Provides a simple helper class that implements the Stream interface to
 * bridge to other implementations that are streams but do not implement the
 * interface. The stream callbacks are invoked with the callOn... methods.
 */
class __PRIVATE_StreamBridge {
    constructor(e) {
        this.co = e.co, this.lo = e.lo;
    }
    ho(e) {
        this.Po = e;
    }
    Io(e) {
        this.To = e;
    }
    onMessage(e) {
        this.Eo = e;
    }
    close() {
        this.lo();
    }
    send(e) {
        this.co(e);
    }
    Ao() {
        this.Po();
    }
    Ro(e) {
        this.To(e);
    }
    Vo(e) {
        this.Eo(e);
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
 */ const fe = "WebChannelConnection";

class __PRIVATE_WebChannelConnection extends 
/**
 * Base class for all Rest-based connections to the backend (WebChannel and
 * HTTP).
 */
class __PRIVATE_RestConnection {
    constructor(e) {
        this.databaseInfo = e, this.databaseId = e.databaseId;
        const t = e.ssl ? "https" : "http", n = encodeURIComponent(this.databaseId.projectId), r = encodeURIComponent(this.databaseId.database);
        this.mo = t + "://" + e.host, this.fo = `projects/${n}/databases/${r}`, this.po = "(default)" === this.databaseId.database ? `project_id=${n}` : `project_id=${n}&database_id=${r}`;
    }
    get yo() {
        // Both `invokeRPC()` and `invokeStreamingRPC()` use their `path` arguments to determine
        // where to run the query, and expect the `request` to NOT specify the "path".
        return !1;
    }
    wo(e, t, n, r, i) {
        const s = __PRIVATE_generateUniqueDebugId(), o = this.So(e, t);
        __PRIVATE_logDebug("RestConnection", `Sending RPC '${e}' ${s}:`, o, n);
        const _ = {
            "google-cloud-resource-prefix": this.fo,
            "x-goog-request-params": this.po
        };
        return this.bo(_, r, i), this.Do(e, o, _, n).then((t => (__PRIVATE_logDebug("RestConnection", `Received RPC '${e}' ${s}: `, t), 
        t)), (t => {
            throw __PRIVATE_logWarn("RestConnection", `RPC '${e}' ${s} failed with error: `, t, "url: ", o, "request:", n), 
            t;
        }));
    }
    Co(e, t, n, r, i, s) {
        // The REST API automatically aggregates all of the streamed results, so we
        // can just use the normal invoke() method.
        return this.wo(e, t, n, r, i);
    }
    /**
     * Modifies the headers for a request, adding any authorization token if
     * present and any additional headers for the request.
     */    bo(e, t, n) {
        e["X-Goog-Api-Client"] = 
        // SDK_VERSION is updated to different value at runtime depending on the entry point,
        // so we need to get its value when we need it in a function.
        function __PRIVATE_getGoogApiClientValue() {
            return "gl-js/ fire/" + D;
        }(), 
        // Content-Type: text/plain will avoid preflight requests which might
        // mess with CORS and redirects by proxies. If we add custom headers
        // we will need to change this code to potentially use the $httpOverwrite
        // parameter supported by ESF to avoid triggering preflight requests.
        e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), 
        t && t.headers.forEach(((t, n) => e[n] = t)), n && n.headers.forEach(((t, n) => e[n] = t));
    }
    So(e, t) {
        const n = me[e];
        return `${this.mo}/v1/${t}:${n}`;
    }
} {
    constructor(e) {
        super(e), this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, 
        this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
    }
    Do(e, t, n, r) {
        const i = __PRIVATE_generateUniqueDebugId();
        return new Promise(((s, o) => {
            const _ = new V;
            _.setWithCredentials(!0), _.listenOnce(m.COMPLETE, (() => {
                try {
                    switch (_.getLastErrorCode()) {
                      case f.NO_ERROR:
                        const t = _.getResponseJson();
                        __PRIVATE_logDebug(fe, `XHR for RPC '${e}' ${i} received:`, JSON.stringify(t)), 
                        s(t);
                        break;

                      case f.TIMEOUT:
                        __PRIVATE_logDebug(fe, `RPC '${e}' ${i} timed out`), o(new FirestoreError(v.DEADLINE_EXCEEDED, "Request time out"));
                        break;

                      case f.HTTP_ERROR:
                        const n = _.getStatus();
                        if (__PRIVATE_logDebug(fe, `RPC '${e}' ${i} failed with status:`, n, "response text:", _.getResponseText()), 
                        n > 0) {
                            let e = _.getResponseJson();
                            Array.isArray(e) && (e = e[0]);
                            const t = null == e ? void 0 : e.error;
                            if (t && t.status && t.message) {
                                const e = function __PRIVATE_mapCodeFromHttpResponseErrorStatus(e) {
                                    const t = e.toLowerCase().replace(/_/g, "-");
                                    return Object.values(v).indexOf(t) >= 0 ? t : v.UNKNOWN;
                                }(t.status);
                                o(new FirestoreError(e, t.message));
                            } else o(new FirestoreError(v.UNKNOWN, "Server responded with status " + _.getStatus()));
                        } else 
                        // If we received an HTTP_ERROR but there's no status code,
                        // it's most probably a connection issue
                        o(new FirestoreError(v.UNAVAILABLE, "Connection failed."));
                        break;

                      default:
                        fail();
                    }
                } finally {
                    __PRIVATE_logDebug(fe, `RPC '${e}' ${i} completed.`);
                }
            }));
            const a = JSON.stringify(r);
            __PRIVATE_logDebug(fe, `RPC '${e}' ${i} sending request:`, r), _.send(t, "POST", a, n, 15);
        }));
    }
    vo(e, t, n) {
        const r = __PRIVATE_generateUniqueDebugId(), i = [ this.mo, "/", "google.firestore.v1.Firestore", "/", e, "/channel" ], s = g(), o = p(), _ = {
            // Required for backend stickiness, routing behavior is based on this
            // parameter.
            httpSessionIdParam: "gsessionid",
            initMessageHeaders: {},
            messageUrlParams: {
                // This param is used to improve routing and project isolation by the
                // backend and must be included in every request.
                database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
            },
            sendRawJson: !0,
            supportsCrossDomainXhr: !0,
            internalChannelParams: {
                // Override the default timeout (randomized between 10-20 seconds) since
                // a large write batch on a slow internet connection may take a long
                // time to send to the backend. Rather than have WebChannel impose a
                // tight timeout which could lead to infinite timeouts and retries, we
                // set it very large (5-10 minutes) and rely on the browser's builtin
                // timeouts to kick in if the request isn't working.
                forwardChannelRequestTimeoutMs: 6e5
            },
            forceLongPolling: this.forceLongPolling,
            detectBufferingProxy: this.autoDetectLongPolling
        }, a = this.longPollingOptions.timeoutSeconds;
        void 0 !== a && (_.longPollingTimeout = Math.round(1e3 * a)), this.useFetchStreams && (_.useFetchStreams = !0), 
        this.bo(_.initMessageHeaders, t, n), 
        // Sending the custom headers we just added to request.initMessageHeaders
        // (Authorization, etc.) will trigger the browser to make a CORS preflight
        // request because the XHR will no longer meet the criteria for a "simple"
        // CORS request:
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
        // Therefore to avoid the CORS preflight request (an extra network
        // roundtrip), we use the encodeInitMessageHeaders option to specify that
        // the headers should instead be encoded in the request's POST payload,
        // which is recognized by the webchannel backend.
        _.encodeInitMessageHeaders = !0;
        const u = i.join("");
        __PRIVATE_logDebug(fe, `Creating RPC '${e}' stream ${r}: ${u}`, _);
        const c = s.createWebChannel(u, _);
        // WebChannel supports sending the first message with the handshake - saving
        // a network round trip. However, it will have to call send in the same
        // JS event loop as open. In order to enforce this, we delay actually
        // opening the WebChannel until send is called. Whether we have called
        // open is tracked with this variable.
                let l = !1, h = !1;
        // A flag to determine whether the stream was closed (by us or through an
        // error/close event) to avoid delivering multiple close events or sending
        // on a closed stream
                const P = new __PRIVATE_StreamBridge({
            co: t => {
                h ? __PRIVATE_logDebug(fe, `Not sending because RPC '${e}' stream ${r} is closed:`, t) : (l || (__PRIVATE_logDebug(fe, `Opening RPC '${e}' stream ${r} transport.`), 
                c.open(), l = !0), __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} sending:`, t), 
                c.send(t));
            },
            lo: () => c.close()
        }), __PRIVATE_unguardedEventListen = (e, t, n) => {
            // TODO(dimond): closure typing seems broken because WebChannel does
            // not implement goog.events.Listenable
            e.listen(t, (e => {
                try {
                    n(e);
                } catch (e) {
                    setTimeout((() => {
                        throw e;
                    }), 0);
                }
            }));
        };
        // Closure events are guarded and exceptions are swallowed, so catch any
        // exception and rethrow using a setTimeout so they become visible again.
        // Note that eventually this function could go away if we are confident
        // enough the code is exception free.
                return __PRIVATE_unguardedEventListen(c, y.EventType.OPEN, (() => {
            h || __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} transport opened.`);
        })), __PRIVATE_unguardedEventListen(c, y.EventType.CLOSE, (() => {
            h || (h = !0, __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} transport closed`), 
            P.Ro());
        })), __PRIVATE_unguardedEventListen(c, y.EventType.ERROR, (t => {
            h || (h = !0, __PRIVATE_logWarn(fe, `RPC '${e}' stream ${r} transport errored:`, t), 
            P.Ro(new FirestoreError(v.UNAVAILABLE, "The operation could not be completed")));
        })), __PRIVATE_unguardedEventListen(c, y.EventType.MESSAGE, (t => {
            var n;
            if (!h) {
                const i = t.data[0];
                __PRIVATE_hardAssert(!!i);
                // TODO(b/35143891): There is a bug in One Platform that caused errors
                // (and only errors) to be wrapped in an extra array. To be forward
                // compatible with the bug we need to check either condition. The latter
                // can be removed once the fix has been rolled out.
                // Use any because msgData.error is not typed.
                const s = i, o = s.error || (null === (n = s[0]) || void 0 === n ? void 0 : n.error);
                if (o) {
                    __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} received error:`, o);
                    // error.status will be a string like 'OK' or 'NOT_FOUND'.
                    const t = o.status;
                    let n = 
                    /**
 * Maps an error Code from a GRPC status identifier like 'NOT_FOUND'.
 *
 * @returns The Code equivalent to the given status string or undefined if
 *     there is no match.
 */
                    function __PRIVATE_mapCodeFromRpcStatus(e) {
                        // lookup by string
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const t = ce[e];
                        if (void 0 !== t) return __PRIVATE_mapCodeFromRpcCode(t);
                    }(t), i = o.message;
                    void 0 === n && (n = v.INTERNAL, i = "Unknown error status: " + t + " with message " + o.message), 
                    // Mark closed so no further events are propagated
                    h = !0, P.Ro(new FirestoreError(n, i)), c.close();
                } else __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} received:`, i), P.Vo(i);
            }
        })), __PRIVATE_unguardedEventListen(o, w.STAT_EVENT, (t => {
            t.stat === S.PROXY ? __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} detected buffering proxy`) : t.stat === S.NOPROXY && __PRIVATE_logDebug(fe, `RPC '${e}' stream ${r} detected no buffering proxy`);
        })), setTimeout((() => {
            // Technically we could/should wait for the WebChannel opened event,
            // but because we want to send the first message with the WebChannel
            // handshake we pretend the channel opened here (asynchronously), and
            // then delay the actual open until the first message is sent.
            P.Ao();
        }), 0), P;
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
/** Initializes the WebChannelConnection for the browser. */
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
/** The Platform's 'window' implementation or null if not available. */
function __PRIVATE_getWindow() {
    // `window` is not always available, e.g. in ReactNative and WebWorkers.
    // eslint-disable-next-line no-restricted-globals
    return "undefined" != typeof window ? window : null;
}

/** The Platform's 'document' implementation or null if not available. */ function getDocument() {
    // `document` is not always available, e.g. in ReactNative and WebWorkers.
    // eslint-disable-next-line no-restricted-globals
    return "undefined" != typeof document ? document : null;
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
 */ function __PRIVATE_newSerializer(e) {
    return new JsonProtoSerializer(e, /* useProto3Json= */ !0);
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
    e, 
    /**
     * The ID to use when scheduling backoff operations on the AsyncQueue.
     */
    t, 
    /**
     * The initial delay (used as the base delay on the first retry attempt).
     * Note that jitter will still be applied, so the actual delay could be as
     * little as 0.5*initialDelayMs.
     */
    n = 1e3
    /**
     * The multiplier to use to determine the extended base delay after each
     * attempt.
     */ , r = 1.5
    /**
     * The maximum base delay after which no further backoff is performed.
     * Note that jitter will still be applied, so the actual delay could be as
     * much as 1.5*maxDelayMs.
     */ , i = 6e4) {
        this.si = e, this.timerId = t, this.Fo = n, this.Mo = r, this.xo = i, this.Oo = 0, 
        this.No = null, 
        /** The last backoff attempt, as epoch milliseconds. */
        this.Bo = Date.now(), this.reset();
    }
    /**
     * Resets the backoff delay.
     *
     * The very next backoffAndWait() will have no delay. If it is called again
     * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
     * subsequent ones will increase according to the backoffFactor.
     */    reset() {
        this.Oo = 0;
    }
    /**
     * Resets the backoff delay to the maximum delay (e.g. for use after a
     * RESOURCE_EXHAUSTED error).
     */    Lo() {
        this.Oo = this.xo;
    }
    /**
     * Returns a promise that resolves after currentDelayMs, and increases the
     * delay for any subsequent attempts. If there was a pending backoff operation
     * already, it will be canceled.
     */    ko(e) {
        // Cancel any pending backoff operation.
        this.cancel();
        // First schedule using the current base (which may be 0 and should be
        // honored as such).
        const t = Math.floor(this.Oo + this.qo()), n = Math.max(0, Date.now() - this.Bo), r = Math.max(0, t - n);
        // Guard against lastAttemptTime being in the future due to a clock change.
                r > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r} ms (base delay: ${this.Oo} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`), 
        this.No = this.si.enqueueAfterDelay(this.timerId, r, (() => (this.Bo = Date.now(), 
        e()))), 
        // Apply backoff factor to determine next delay and ensure it is within
        // bounds.
        this.Oo *= this.Mo, this.Oo < this.Fo && (this.Oo = this.Fo), this.Oo > this.xo && (this.Oo = this.xo);
    }
    Qo() {
        null !== this.No && (this.No.skipDelay(), this.No = null);
    }
    cancel() {
        null !== this.No && (this.No.cancel(), this.No = null);
    }
    /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */    qo() {
        return (Math.random() - .5) * this.Oo;
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
 * A PersistentStream is an abstract base class that represents a streaming RPC
 * to the Firestore backend. It's built on top of the connections own support
 * for streaming RPCs, and adds several critical features for our clients:
 *
 *   - Exponential backoff on failure
 *   - Authentication via CredentialsProvider
 *   - Dispatching all callbacks into the shared worker queue
 *   - Closing idle streams after 60 seconds of inactivity
 *
 * Subclasses of PersistentStream implement serialization of models to and
 * from the JSON representation of the protocol buffers for a specific
 * streaming RPC.
 *
 * ## Starting and Stopping
 *
 * Streaming RPCs are stateful and need to be start()ed before messages can
 * be sent and received. The PersistentStream will call the onOpen() function
 * of the listener once the stream is ready to accept requests.
 *
 * Should a start() fail, PersistentStream will call the registered onClose()
 * listener with a FirestoreError indicating what went wrong.
 *
 * A PersistentStream can be started and stopped repeatedly.
 *
 * Generic types:
 *  SendType: The type of the outgoing message of the underlying
 *    connection stream
 *  ReceiveType: The type of the incoming message of the underlying
 *    connection stream
 *  ListenerType: The type of the listener that will be used for callbacks
 */
class __PRIVATE_PersistentStream {
    constructor(e, t, n, r, i, s, o, _) {
        this.si = e, this.Ko = n, this.$o = r, this.connection = i, this.authCredentialsProvider = s, 
        this.appCheckCredentialsProvider = o, this.listener = _, this.state = 0 /* PersistentStreamState.Initial */ , 
        /**
         * A close count that's incremented every time the stream is closed; used by
         * getCloseGuardedDispatcher() to invalidate callbacks that happen after
         * close.
         */
        this.Uo = 0, this.Wo = null, this.Go = null, this.stream = null, this.zo = new __PRIVATE_ExponentialBackoff(e, t);
    }
    /**
     * Returns true if start() has been called and no error has occurred. True
     * indicates the stream is open or in the process of opening (which
     * encompasses respecting backoff, getting auth tokens, and starting the
     * actual RPC). Use isOpen() to determine if the stream is open and ready for
     * outbound requests.
     */    jo() {
        return 1 /* PersistentStreamState.Starting */ === this.state || 5 /* PersistentStreamState.Backoff */ === this.state || this.Ho();
    }
    /**
     * Returns true if the underlying RPC is open (the onOpen() listener has been
     * called) and the stream is ready for outbound requests.
     */    Ho() {
        return 2 /* PersistentStreamState.Open */ === this.state || 3 /* PersistentStreamState.Healthy */ === this.state;
    }
    /**
     * Starts the RPC. Only allowed if isStarted() returns false. The stream is
     * not immediately ready for use: onOpen() will be invoked when the RPC is
     * ready for outbound requests, at which point isOpen() will return true.
     *
     * When start returns, isStarted() will return true.
     */    start() {
        4 /* PersistentStreamState.Error */ !== this.state ? this.auth() : this.Jo();
    }
    /**
     * Stops the RPC. This call is idempotent and allowed regardless of the
     * current isStarted() state.
     *
     * When stop returns, isStarted() and isOpen() will both return false.
     */    async stop() {
        this.jo() && await this.close(0 /* PersistentStreamState.Initial */);
    }
    /**
     * After an error the stream will usually back off on the next attempt to
     * start it. If the error warrants an immediate restart of the stream, the
     * sender can use this to indicate that the receiver should not back off.
     *
     * Each error will call the onClose() listener. That function can decide to
     * inhibit backoff if required.
     */    Yo() {
        this.state = 0 /* PersistentStreamState.Initial */ , this.zo.reset();
    }
    /**
     * Marks this stream as idle. If no further actions are performed on the
     * stream for one minute, the stream will automatically close itself and
     * notify the stream's onClose() handler with Status.OK. The stream will then
     * be in a !isStarted() state, requiring the caller to start the stream again
     * before further use.
     *
     * Only streams that are in state 'Open' can be marked idle, as all other
     * states imply pending network operations.
     */    Zo() {
        // Starts the idle time if we are in state 'Open' and are not yet already
        // running a timer (in which case the previous idle timeout still applies).
        this.Ho() && null === this.Wo && (this.Wo = this.si.enqueueAfterDelay(this.Ko, 6e4, (() => this.Xo())));
    }
    /** Sends a message to the underlying stream. */    e_(e) {
        this.t_(), this.stream.send(e);
    }
    /** Called by the idle timer when the stream should close due to inactivity. */    async Xo() {
        if (this.Ho()) 
        // When timing out an idle stream there's no reason to force the stream into backoff when
        // it restarts so set the stream state to Initial instead of Error.
        return this.close(0 /* PersistentStreamState.Initial */);
    }
    /** Marks the stream as active again. */    t_() {
        this.Wo && (this.Wo.cancel(), this.Wo = null);
    }
    /** Cancels the health check delayed operation. */    n_() {
        this.Go && (this.Go.cancel(), this.Go = null);
    }
    /**
     * Closes the stream and cleans up as necessary:
     *
     * * closes the underlying GRPC stream;
     * * calls the onClose handler with the given 'error';
     * * sets internal stream state to 'finalState';
     * * adjusts the backoff timer based on the error
     *
     * A new stream can be opened by calling start().
     *
     * @param finalState - the intended state of the stream after closing.
     * @param error - the error the connection was closed with.
     */    async close(e, t) {
        // Cancel any outstanding timers (they're guaranteed not to execute).
        this.t_(), this.n_(), this.zo.cancel(), 
        // Invalidates any stream-related callbacks (e.g. from auth or the
        // underlying stream), guaranteeing they won't execute.
        this.Uo++, 4 /* PersistentStreamState.Error */ !== e ? 
        // If this is an intentional close ensure we don't delay our next connection attempt.
        this.zo.reset() : t && t.code === v.RESOURCE_EXHAUSTED ? (
        // Log the error. (Probably either 'quota exceeded' or 'max queue length reached'.)
        __PRIVATE_logError(t.toString()), __PRIVATE_logError("Using maximum backoff delay to prevent overloading the backend."), 
        this.zo.Lo()) : t && t.code === v.UNAUTHENTICATED && 3 /* PersistentStreamState.Healthy */ !== this.state && (
        // "unauthenticated" error means the token was rejected. This should rarely
        // happen since both Auth and AppCheck ensure a sufficient TTL when we
        // request a token. If a user manually resets their system clock this can
        // fail, however. In this case, we should get a Code.UNAUTHENTICATED error
        // before we received the first message and we need to invalidate the token
        // to ensure that we fetch a new token.
        this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), 
        // Clean up the underlying stream because we are no longer interested in events.
        null !== this.stream && (this.r_(), this.stream.close(), this.stream = null), 
        // This state must be assigned before calling onClose() to allow the callback to
        // inhibit backoff or otherwise manipulate the state in its non-started state.
        this.state = e, 
        // Notify the listener that the stream closed.
        await this.listener.Io(t);
    }
    /**
     * Can be overridden to perform additional cleanup before the stream is closed.
     * Calling super.tearDown() is not required.
     */    r_() {}
    auth() {
        this.state = 1 /* PersistentStreamState.Starting */;
        const e = this.i_(this.Uo), t = this.Uo;
        // TODO(mikelehen): Just use dispatchIfNotClosed, but see TODO below.
                Promise.all([ this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken() ]).then((([e, n]) => {
            // Stream can be stopped while waiting for authentication.
            // TODO(mikelehen): We really should just use dispatchIfNotClosed
            // and let this dispatch onto the queue, but that opened a spec test can
            // of worms that I don't want to deal with in this PR.
            this.Uo === t && 
            // Normally we'd have to schedule the callback on the AsyncQueue.
            // However, the following calls are safe to be called outside the
            // AsyncQueue since they don't chain asynchronous calls
            this.s_(e, n);
        }), (t => {
            e((() => {
                const e = new FirestoreError(v.UNKNOWN, "Fetching auth token failed: " + t.message);
                return this.o_(e);
            }));
        }));
    }
    s_(e, t) {
        const n = this.i_(this.Uo);
        this.stream = this.__(e, t), this.stream.ho((() => {
            n((() => (this.state = 2 /* PersistentStreamState.Open */ , this.Go = this.si.enqueueAfterDelay(this.$o, 1e4, (() => (this.Ho() && (this.state = 3 /* PersistentStreamState.Healthy */), 
            Promise.resolve()))), this.listener.ho())));
        })), this.stream.Io((e => {
            n((() => this.o_(e)));
        })), this.stream.onMessage((e => {
            n((() => this.onMessage(e)));
        }));
    }
    Jo() {
        this.state = 5 /* PersistentStreamState.Backoff */ , this.zo.ko((async () => {
            this.state = 0 /* PersistentStreamState.Initial */ , this.start();
        }));
    }
    // Visible for tests
    o_(e) {
        // In theory the stream could close cleanly, however, in our current model
        // we never expect this to happen because if we stop a stream ourselves,
        // this callback will never be called. To prevent cases where we retry
        // without a backoff accidentally, we set the stream to error in all cases.
        return __PRIVATE_logDebug("PersistentStream", `close with error: ${e}`), this.stream = null, 
        this.close(4 /* PersistentStreamState.Error */ , e);
    }
    /**
     * Returns a "dispatcher" function that dispatches operations onto the
     * AsyncQueue but only runs them if closeCount remains unchanged. This allows
     * us to turn auth / stream callbacks into no-ops if the stream is closed /
     * re-opened, etc.
     */    i_(e) {
        return t => {
            this.si.enqueueAndForget((() => this.Uo === e ? t() : (__PRIVATE_logDebug("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), 
            Promise.resolve())));
        };
    }
}

/**
 * A PersistentStream that implements the Listen RPC.
 *
 * Once the Listen stream has called the onOpen() listener, any number of
 * listen() and unlisten() calls can be made to control what changes will be
 * sent from the server for ListenResponses.
 */ class __PRIVATE_PersistentListenStream extends __PRIVATE_PersistentStream {
    constructor(e, t, n, r, i, s) {
        super(e, "listen_stream_connection_backoff" /* TimerId.ListenStreamConnectionBackoff */ , "listen_stream_idle" /* TimerId.ListenStreamIdle */ , "health_check_timeout" /* TimerId.HealthCheckTimeout */ , t, n, r, s), 
        this.serializer = i;
    }
    __(e, t) {
        return this.connection.vo("Listen", e, t);
    }
    onMessage(e) {
        // A successful response means the stream is healthy
        this.zo.reset();
        const t = __PRIVATE_fromWatchChange(this.serializer, e), n = function __PRIVATE_versionFromListenResponse(e) {
            // We have only reached a consistent snapshot for the entire stream if there
            // is a read_time set and it applies to all targets (i.e. the list of
            // targets is empty). The backend is guaranteed to send such responses.
            if (!("targetChange" in e)) return SnapshotVersion.min();
            const t = e.targetChange;
            return t.targetIds && t.targetIds.length ? SnapshotVersion.min() : t.readTime ? __PRIVATE_fromVersion(t.readTime) : SnapshotVersion.min();
        }(e);
        return this.listener.a_(t, n);
    }
    /**
     * Registers interest in the results of the given target. If the target
     * includes a resumeToken it will be included in the request. Results that
     * affect the target will be streamed back as WatchChange messages that
     * reference the targetId.
     */    u_(e) {
        const t = {};
        t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.addTarget = function __PRIVATE_toTarget(e, t) {
            let n;
            const r = t.target;
            if (n = __PRIVATE_targetIsDocumentTarget(r) ? {
                documents: __PRIVATE_toDocumentsTarget(e, r)
            } : {
                query: __PRIVATE_toQueryTarget(e, r)
            }, n.targetId = t.targetId, t.resumeToken.approximateByteSize() > 0) {
                n.resumeToken = __PRIVATE_toBytes(e, t.resumeToken);
                const r = __PRIVATE_toInt32Proto(e, t.expectedCount);
                null !== r && (n.expectedCount = r);
            } else if (t.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
                // TODO(wuandy): Consider removing above check because it is most likely true.
                // Right now, many tests depend on this behaviour though (leaving min() out
                // of serialization).
                n.readTime = toTimestamp(e, t.snapshotVersion.toTimestamp());
                const r = __PRIVATE_toInt32Proto(e, t.expectedCount);
                null !== r && (n.expectedCount = r);
            }
            return n;
        }(this.serializer, e);
        const n = __PRIVATE_toListenRequestLabels(this.serializer, e);
        n && (t.labels = n), this.e_(t);
    }
    /**
     * Unregisters interest in the results of the target associated with the
     * given targetId.
     */    c_(e) {
        const t = {};
        t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.removeTarget = e, 
        this.e_(t);
    }
}

/**
 * A Stream that implements the Write RPC.
 *
 * The Write RPC requires the caller to maintain special streamToken
 * state in between calls, to help the server understand which responses the
 * client has processed by the time the next request is made. Every response
 * will contain a streamToken; this value must be passed to the next
 * request.
 *
 * After calling start() on this stream, the next request must be a handshake,
 * containing whatever streamToken is on hand. Once a response to this
 * request is received, all pending mutations may be submitted. When
 * submitting multiple batches of mutations at the same time, it's
 * okay to use the same streamToken for the calls to writeMutations.
 *
 * TODO(b/33271235): Use proto types
 */ class __PRIVATE_PersistentWriteStream extends __PRIVATE_PersistentStream {
    constructor(e, t, n, r, i, s) {
        super(e, "write_stream_connection_backoff" /* TimerId.WriteStreamConnectionBackoff */ , "write_stream_idle" /* TimerId.WriteStreamIdle */ , "health_check_timeout" /* TimerId.HealthCheckTimeout */ , t, n, r, s), 
        this.serializer = i, this.l_ = !1;
    }
    /**
     * Tracks whether or not a handshake has been successfully exchanged and
     * the stream is ready to accept mutations.
     */    get h_() {
        return this.l_;
    }
    // Override of PersistentStream.start
    start() {
        this.l_ = !1, this.lastStreamToken = void 0, super.start();
    }
    r_() {
        this.l_ && this.P_([]);
    }
    __(e, t) {
        return this.connection.vo("Write", e, t);
    }
    onMessage(e) {
        if (
        // Always capture the last stream token.
        __PRIVATE_hardAssert(!!e.streamToken), this.lastStreamToken = e.streamToken, this.l_) {
            // A successful first write response means the stream is healthy,
            // Note, that we could consider a successful handshake healthy, however,
            // the write itself might be causing an error we want to back off from.
            this.zo.reset();
            const t = __PRIVATE_fromWriteResults(e.writeResults, e.commitTime), n = __PRIVATE_fromVersion(e.commitTime);
            return this.listener.I_(n, t);
        }
        // The first response is always the handshake response
        return __PRIVATE_hardAssert(!e.writeResults || 0 === e.writeResults.length), this.l_ = !0, 
        this.listener.T_();
    }
    /**
     * Sends an initial streamToken to the server, performing the handshake
     * required to make the StreamingWrite RPC work. Subsequent
     * calls should wait until onHandshakeComplete was called.
     */    E_() {
        // TODO(dimond): Support stream resumption. We intentionally do not set the
        // stream token on the handshake, ignoring any stream token we might have.
        const e = {};
        e.database = __PRIVATE_getEncodedDatabaseId(this.serializer), this.e_(e);
    }
    /** Sends a group of mutations to the Firestore backend to apply. */    P_(e) {
        const t = {
            streamToken: this.lastStreamToken,
            writes: e.map((e => toMutation(this.serializer, e)))
        };
        this.e_(t);
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
    constructor(e, t, n, r) {
        super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = n, 
        this.serializer = r, this.d_ = !1;
    }
    A_() {
        if (this.d_) throw new FirestoreError(v.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    /** Invokes the provided RPC with auth and AppCheck tokens. */    wo(e, t, n) {
        return this.A_(), Promise.all([ this.authCredentials.getToken(), this.appCheckCredentials.getToken() ]).then((([r, i]) => this.connection.wo(e, t, n, r, i))).catch((e => {
            throw "FirebaseError" === e.name ? (e.code === v.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), 
            this.appCheckCredentials.invalidateToken()), e) : new FirestoreError(v.UNKNOWN, e.toString());
        }));
    }
    /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */    Co(e, t, n, r) {
        return this.A_(), Promise.all([ this.authCredentials.getToken(), this.appCheckCredentials.getToken() ]).then((([i, s]) => this.connection.Co(e, t, n, i, s, r))).catch((e => {
            throw "FirebaseError" === e.name ? (e.code === v.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), 
            this.appCheckCredentials.invalidateToken()), e) : new FirestoreError(v.UNKNOWN, e.toString());
        }));
    }
    terminate() {
        this.d_ = !0;
    }
}

// TODO(firestorexp): Make sure there is only one Datastore instance per
// firestore-exp client.
async function __PRIVATE_invokeRunAggregationQueryRpc(e, t, n) {
    var r;
    const i = __PRIVATE_debugCast(e), {request: s, R_: o} = function __PRIVATE_toRunAggregationQueryRequest(e, t, n) {
        const r = __PRIVATE_toQueryTarget(e, t), i = {}, s = [];
        let o = 0;
        return n.forEach((e => {
            // Map all client-side aliases to a unique short-form
            // alias. This avoids issues with client-side aliases that
            // exceed the 1500-byte string size limit.
            const t = "aggregate_" + o++;
            i[t] = e.alias, "count" === e.aggregateType ? s.push({
                alias: t,
                count: {}
            }) : "avg" === e.aggregateType ? s.push({
                alias: t,
                avg: {
                    field: __PRIVATE_toFieldPathReference(e.fieldPath)
                }
            }) : "sum" === e.aggregateType && s.push({
                alias: t,
                sum: {
                    field: __PRIVATE_toFieldPathReference(e.fieldPath)
                }
            });
        })), {
            request: {
                structuredAggregationQuery: {
                    aggregations: s,
                    structuredQuery: r.structuredQuery
                },
                parent: r.parent
            },
            R_: i
        };
    }(i.serializer, function __PRIVATE_queryToAggregateTarget(e) {
        const t = __PRIVATE_debugCast(e);
        return t.Pe || (
        // Do not include implicit order-bys for aggregate queries.
        t.Pe = __PRIVATE__queryToTarget(t, e.explicitOrderBy)), t.Pe;
    }(t), n), _ = s.parent;
    i.connection.yo || delete s.parent;
    const a = (await i.Co("RunAggregationQuery", _, s, /*expectedResponseCount=*/ 1)).filter((e => !!e.result));
    // Omit RunAggregationQueryResponse that only contain readTimes.
        __PRIVATE_hardAssert(1 === a.length);
    // Remap the short-form aliases that were sent to the server
    // to the client-side aliases. Users will access the results
    // using the client-side alias.
    const u = null === (r = a[0].result) || void 0 === r ? void 0 : r.aggregateFields;
    return Object.keys(u).reduce(((e, t) => (e[o[t]] = u[t], e)), {});
}

/**
 * A component used by the RemoteStore to track the OnlineState (that is,
 * whether or not the client as a whole should be considered to be online or
 * offline), implementing the appropriate heuristics.
 *
 * In particular, when the client is trying to connect to the backend, we
 * allow up to MAX_WATCH_STREAM_FAILURES within ONLINE_STATE_TIMEOUT_MS for
 * a connection to succeed. If we have too many failures or the timeout elapses,
 * then we set the OnlineState to Offline, and the client will behave as if
 * it is offline (get()s will return cached data, etc.).
 */
class __PRIVATE_OnlineStateTracker {
    constructor(e, t) {
        this.asyncQueue = e, this.onlineStateHandler = t, 
        /** The current OnlineState. */
        this.state = "Unknown" /* OnlineState.Unknown */ , 
        /**
         * A count of consecutive failures to open the stream. If it reaches the
         * maximum defined by MAX_WATCH_STREAM_FAILURES, we'll set the OnlineState to
         * Offline.
         */
        this.V_ = 0, 
        /**
         * A timer that elapses after ONLINE_STATE_TIMEOUT_MS, at which point we
         * transition from OnlineState.Unknown to OnlineState.Offline without waiting
         * for the stream to actually fail (MAX_WATCH_STREAM_FAILURES times).
         */
        this.m_ = null, 
        /**
         * Whether the client should log a warning message if it fails to connect to
         * the backend (initially true, cleared after a successful stream, or if we've
         * logged the message already).
         */
        this.f_ = !0;
    }
    /**
     * Called by RemoteStore when a watch stream is started (including on each
     * backoff attempt).
     *
     * If this is the first attempt, it sets the OnlineState to Unknown and starts
     * the onlineStateTimer.
     */    g_() {
        0 === this.V_ && (this.p_("Unknown" /* OnlineState.Unknown */), this.m_ = this.asyncQueue.enqueueAfterDelay("online_state_timeout" /* TimerId.OnlineStateTimeout */ , 1e4, (() => (this.m_ = null, 
        this.y_("Backend didn't respond within 10 seconds."), this.p_("Offline" /* OnlineState.Offline */), 
        Promise.resolve()))));
    }
    /**
     * Updates our OnlineState as appropriate after the watch stream reports a
     * failure. The first failure moves us to the 'Unknown' state. We then may
     * allow multiple failures (based on MAX_WATCH_STREAM_FAILURES) before we
     * actually transition to the 'Offline' state.
     */    w_(e) {
        "Online" /* OnlineState.Online */ === this.state ? this.p_("Unknown" /* OnlineState.Unknown */) : (this.V_++, 
        this.V_ >= 1 && (this.S_(), this.y_(`Connection failed 1 times. Most recent error: ${e.toString()}`), 
        this.p_("Offline" /* OnlineState.Offline */)));
    }
    /**
     * Explicitly sets the OnlineState to the specified state.
     *
     * Note that this resets our timers / failure counters, etc. used by our
     * Offline heuristics, so must not be used in place of
     * handleWatchStreamStart() and handleWatchStreamFailure().
     */    set(e) {
        this.S_(), this.V_ = 0, "Online" /* OnlineState.Online */ === e && (
        // We've connected to watch at least once. Don't warn the developer
        // about being offline going forward.
        this.f_ = !1), this.p_(e);
    }
    p_(e) {
        e !== this.state && (this.state = e, this.onlineStateHandler(e));
    }
    y_(e) {
        const t = `Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
        this.f_ ? (__PRIVATE_logError(t), this.f_ = !1) : __PRIVATE_logDebug("OnlineStateTracker", t);
    }
    S_() {
        null !== this.m_ && (this.m_.cancel(), this.m_ = null);
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
 */ class __PRIVATE_RemoteStoreImpl {
    constructor(
    /**
     * The local store, used to fill the write pipeline with outbound mutations.
     */
    e, 
    /** The client-side proxy for interacting with the backend. */
    t, n, r, i) {
        this.localStore = e, this.datastore = t, this.asyncQueue = n, this.remoteSyncer = {}, 
        /**
         * A list of up to MAX_PENDING_WRITES writes that we have fetched from the
         * LocalStore via fillWritePipeline() and have or will send to the write
         * stream.
         *
         * Whenever writePipeline.length > 0 the RemoteStore will attempt to start or
         * restart the write stream. When the stream is established the writes in the
         * pipeline will be sent in order.
         *
         * Writes remain in writePipeline until they are acknowledged by the backend
         * and thus will automatically be re-sent if the stream is interrupted /
         * restarted before they're acknowledged.
         *
         * Write responses from the backend are linked to their originating request
         * purely based on order, and so we can just shift() writes from the front of
         * the writePipeline as we receive responses.
         */
        this.b_ = [], 
        /**
         * A mapping of watched targets that the client cares about tracking and the
         * user has explicitly called a 'listen' for this target.
         *
         * These targets may or may not have been sent to or acknowledged by the
         * server. On re-establishing the listen stream, these targets should be sent
         * to the server. The targets removed with unlistens are removed eagerly
         * without waiting for confirmation from the listen stream.
         */
        this.D_ = new Map, 
        /**
         * A set of reasons for why the RemoteStore may be offline. If empty, the
         * RemoteStore may start its network connections.
         */
        this.C_ = new Set, 
        /**
         * Event handlers that get called when the network is disabled or enabled.
         *
         * PORTING NOTE: These functions are used on the Web client to create the
         * underlying streams (to support tree-shakeable streams). On Android and iOS,
         * the streams are created during construction of RemoteStore.
         */
        this.v_ = [], this.F_ = i, this.F_.ro((e => {
            n.enqueueAndForget((async () => {
                // Porting Note: Unlike iOS, `restartNetwork()` is called even when the
                // network becomes unreachable as we don't have any other way to tear
                // down our streams.
                __PRIVATE_canUseNetwork(this) && (__PRIVATE_logDebug("RemoteStore", "Restarting streams for network reachability change."), 
                await async function __PRIVATE_restartNetwork(e) {
                    const t = __PRIVATE_debugCast(e);
                    t.C_.add(4 /* OfflineCause.ConnectivityChange */), await __PRIVATE_disableNetworkInternal(t), 
                    t.M_.set("Unknown" /* OnlineState.Unknown */), t.C_.delete(4 /* OfflineCause.ConnectivityChange */), 
                    await __PRIVATE_enableNetworkInternal(t);
                }(this));
            }));
        })), this.M_ = new __PRIVATE_OnlineStateTracker(n, r);
    }
}

async function __PRIVATE_enableNetworkInternal(e) {
    if (__PRIVATE_canUseNetwork(e)) for (const t of e.v_) await t(/* enabled= */ !0);
}

/**
 * Temporarily disables the network. The network can be re-enabled using
 * enableNetwork().
 */ async function __PRIVATE_disableNetworkInternal(e) {
    for (const t of e.v_) await t(/* enabled= */ !1);
}

/**
 * Starts new listen for the given target. Uses resume token if provided. It
 * is a no-op if the target of given `TargetData` is already being listened to.
 */
function __PRIVATE_remoteStoreListen(e, t) {
    const n = __PRIVATE_debugCast(e);
    n.D_.has(t.targetId) || (
    // Mark this as something the client is currently listening for.
    n.D_.set(t.targetId, t), __PRIVATE_shouldStartWatchStream(n) ? 
    // The listen will be sent in onWatchStreamOpen
    __PRIVATE_startWatchStream(n) : __PRIVATE_ensureWatchStream(n).Ho() && __PRIVATE_sendWatchRequest(n, t));
}

/**
 * Removes the listen from server. It is a no-op if the given target id is
 * not being listened to.
 */ function __PRIVATE_remoteStoreUnlisten(e, t) {
    const n = __PRIVATE_debugCast(e), r = __PRIVATE_ensureWatchStream(n);
    n.D_.delete(t), r.Ho() && __PRIVATE_sendUnwatchRequest(n, t), 0 === n.D_.size && (r.Ho() ? r.Zo() : __PRIVATE_canUseNetwork(n) && 
    // Revert to OnlineState.Unknown if the watch stream is not open and we
    // have no listeners, since without any listens to send we cannot
    // confirm if the stream is healthy and upgrade to OnlineState.Online.
    n.M_.set("Unknown" /* OnlineState.Unknown */));
}

/**
 * We need to increment the the expected number of pending responses we're due
 * from watch so we wait for the ack to process any messages from this target.
 */ function __PRIVATE_sendWatchRequest(e, t) {
    if (e.x_.Oe(t.targetId), t.resumeToken.approximateByteSize() > 0 || t.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
        const n = e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;
        t = t.withExpectedCount(n);
    }
    __PRIVATE_ensureWatchStream(e).u_(t);
}

/**
 * We need to increment the expected number of pending responses we're due
 * from watch so we wait for the removal on the server before we process any
 * messages from this target.
 */ function __PRIVATE_sendUnwatchRequest(e, t) {
    e.x_.Oe(t), __PRIVATE_ensureWatchStream(e).c_(t);
}

function __PRIVATE_startWatchStream(e) {
    e.x_ = new __PRIVATE_WatchChangeAggregator({
        getRemoteKeysForTarget: t => e.remoteSyncer.getRemoteKeysForTarget(t),
        _t: t => e.D_.get(t) || null,
        nt: () => e.datastore.serializer.databaseId
    }), __PRIVATE_ensureWatchStream(e).start(), e.M_.g_();
}

/**
 * Returns whether the watch stream should be started because it's necessary
 * and has not yet been started.
 */ function __PRIVATE_shouldStartWatchStream(e) {
    return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWatchStream(e).jo() && e.D_.size > 0;
}

function __PRIVATE_canUseNetwork(e) {
    return 0 === __PRIVATE_debugCast(e).C_.size;
}

function __PRIVATE_cleanUpWatchStreamState(e) {
    e.x_ = void 0;
}

async function __PRIVATE_onWatchStreamOpen(e) {
    e.D_.forEach(((t, n) => {
        __PRIVATE_sendWatchRequest(e, t);
    }));
}

async function __PRIVATE_onWatchStreamClose(e, t) {
    __PRIVATE_cleanUpWatchStreamState(e), 
    // If we still need the watch stream, retry the connection.
    __PRIVATE_shouldStartWatchStream(e) ? (e.M_.w_(t), __PRIVATE_startWatchStream(e)) : 
    // No need to restart watch stream because there are no active targets.
    // The online state is set to unknown because there is no active attempt
    // at establishing a connection
    e.M_.set("Unknown" /* OnlineState.Unknown */);
}

async function __PRIVATE_onWatchStreamChange(e, t, n) {
    if (
    // Mark the client as online since we got a message from the server
    e.M_.set("Online" /* OnlineState.Online */), t instanceof __PRIVATE_WatchTargetChange && 2 /* WatchTargetChangeState.Removed */ === t.state && t.cause) 
    // There was an error on a target, don't wait for a consistent snapshot
    // to raise events
    try {
        await 
        /** Handles an error on a target */
        async function __PRIVATE_handleTargetError(e, t) {
            const n = t.cause;
            for (const r of t.targetIds) 
            // A watched target might have been removed already.
            e.D_.has(r) && (await e.remoteSyncer.rejectListen(r, n), e.D_.delete(r), e.x_.removeTarget(r));
        }
        /**
 * Attempts to fill our write pipeline with writes from the LocalStore.
 *
 * Called internally to bootstrap or refill the write pipeline and by
 * SyncEngine whenever there are new mutations to process.
 *
 * Starts the write stream if necessary.
 */ (e, t);
    } catch (n) {
        __PRIVATE_logDebug("RemoteStore", "Failed to remove targets %s: %s ", t.targetIds.join(","), n), 
        await __PRIVATE_disableNetworkUntilRecovery(e, n);
    } else if (t instanceof __PRIVATE_DocumentWatchChange ? e.x_.$e(t) : t instanceof __PRIVATE_ExistenceFilterChange ? e.x_.Je(t) : e.x_.Ge(t), 
    !n.isEqual(SnapshotVersion.min())) try {
        const t = await __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore);
        n.compareTo(t) >= 0 && 
        // We have received a target change with a global snapshot if the snapshot
        // version is not equal to SnapshotVersion.min().
        await 
        /**
 * Takes a batch of changes from the Datastore, repackages them as a
 * RemoteEvent, and passes that on to the listener, which is typically the
 * SyncEngine.
 */
        function __PRIVATE_raiseWatchSnapshot(e, t) {
            const n = e.x_.it(t);
            // Update in-memory resume tokens. LocalStore will update the
            // persistent view of these when applying the completed RemoteEvent.
                        return n.targetChanges.forEach(((n, r) => {
                if (n.resumeToken.approximateByteSize() > 0) {
                    const i = e.D_.get(r);
                    // A watched target might have been removed already.
                                        i && e.D_.set(r, i.withResumeToken(n.resumeToken, t));
                }
            })), 
            // Re-establish listens for the targets that have been invalidated by
            // existence filter mismatches.
            n.targetMismatches.forEach(((t, n) => {
                const r = e.D_.get(t);
                if (!r) 
                // A watched target might have been removed already.
                return;
                // Clear the resume token for the target, since we're in a known mismatch
                // state.
                                e.D_.set(t, r.withResumeToken(ByteString.EMPTY_BYTE_STRING, r.snapshotVersion)), 
                // Cause a hard reset by unwatching and rewatching immediately, but
                // deliberately don't send a resume token so that we get a full update.
                __PRIVATE_sendUnwatchRequest(e, t);
                // Mark the target we send as being on behalf of an existence filter
                // mismatch, but don't actually retain that in listenTargets. This ensures
                // that we flag the first re-listen this way without impacting future
                // listens of this target (that might happen e.g. on reconnect).
                const i = new TargetData(r.target, t, n, r.sequenceNumber);
                __PRIVATE_sendWatchRequest(e, i);
            })), e.remoteSyncer.applyRemoteEvent(n);
        }(e, n);
    } catch (t) {
        __PRIVATE_logDebug("RemoteStore", "Failed to raise snapshot:", t), await __PRIVATE_disableNetworkUntilRecovery(e, t);
    }
}

/**
 * Recovery logic for IndexedDB errors that takes the network offline until
 * `op` succeeds. Retries are scheduled with backoff using
 * `enqueueRetryable()`. If `op()` is not provided, IndexedDB access is
 * validated via a generic operation.
 *
 * The returned Promise is resolved once the network is disabled and before
 * any retry attempt.
 */ async function __PRIVATE_disableNetworkUntilRecovery(e, t, n) {
    if (!__PRIVATE_isIndexedDbTransactionError(t)) throw t;
    e.C_.add(1 /* OfflineCause.IndexedDbFailed */), 
    // Disable network and raise offline snapshots
    await __PRIVATE_disableNetworkInternal(e), e.M_.set("Offline" /* OnlineState.Offline */), 
    n || (
    // Use a simple read operation to determine if IndexedDB recovered.
    // Ideally, we would expose a health check directly on SimpleDb, but
    // RemoteStore only has access to persistence through LocalStore.
    n = () => __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore)), 
    // Probe IndexedDB periodically and re-enable network
    e.asyncQueue.enqueueRetryable((async () => {
        __PRIVATE_logDebug("RemoteStore", "Retrying IndexedDB access"), await n(), e.C_.delete(1 /* OfflineCause.IndexedDbFailed */), 
        await __PRIVATE_enableNetworkInternal(e);
    }));
}

/**
 * Executes `op`. If `op` fails, takes the network offline until `op`
 * succeeds. Returns after the first attempt.
 */ function __PRIVATE_executeWithRecovery(e, t) {
    return t().catch((n => __PRIVATE_disableNetworkUntilRecovery(e, n, t)));
}

async function __PRIVATE_fillWritePipeline(e) {
    const t = __PRIVATE_debugCast(e), n = __PRIVATE_ensureWriteStream(t);
    let r = t.b_.length > 0 ? t.b_[t.b_.length - 1].batchId : -1;
    for (;__PRIVATE_canAddToWritePipeline(t); ) try {
        const e = await __PRIVATE_localStoreGetNextMutationBatch(t.localStore, r);
        if (null === e) {
            0 === t.b_.length && n.Zo();
            break;
        }
        r = e.batchId, __PRIVATE_addToWritePipeline(t, e);
    } catch (e) {
        await __PRIVATE_disableNetworkUntilRecovery(t, e);
    }
    __PRIVATE_shouldStartWriteStream(t) && __PRIVATE_startWriteStream(t);
}

/**
 * Returns true if we can add to the write pipeline (i.e. the network is
 * enabled and the write pipeline is not full).
 */ function __PRIVATE_canAddToWritePipeline(e) {
    return __PRIVATE_canUseNetwork(e) && e.b_.length < 10;
}

/**
 * Queues additional writes to be sent to the write stream, sending them
 * immediately if the write stream is established.
 */ function __PRIVATE_addToWritePipeline(e, t) {
    e.b_.push(t);
    const n = __PRIVATE_ensureWriteStream(e);
    n.Ho() && n.h_ && n.P_(t.mutations);
}

function __PRIVATE_shouldStartWriteStream(e) {
    return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWriteStream(e).jo() && e.b_.length > 0;
}

function __PRIVATE_startWriteStream(e) {
    __PRIVATE_ensureWriteStream(e).start();
}

async function __PRIVATE_onWriteStreamOpen(e) {
    __PRIVATE_ensureWriteStream(e).E_();
}

async function __PRIVATE_onWriteHandshakeComplete(e) {
    const t = __PRIVATE_ensureWriteStream(e);
    // Send the write pipeline now that the stream is established.
        for (const n of e.b_) t.P_(n.mutations);
}

async function __PRIVATE_onMutationResult(e, t, n) {
    const r = e.b_.shift(), i = MutationBatchResult.from(r, t, n);
    await __PRIVATE_executeWithRecovery(e, (() => e.remoteSyncer.applySuccessfulWrite(i))), 
    // It's possible that with the completion of this mutation another
    // slot has freed up.
    await __PRIVATE_fillWritePipeline(e);
}

async function __PRIVATE_onWriteStreamClose(e, t) {
    // If the write stream closed after the write handshake completes, a write
    // operation failed and we fail the pending operation.
    t && __PRIVATE_ensureWriteStream(e).h_ && 
    // This error affects the actual write.
    await async function __PRIVATE_handleWriteError(e, t) {
        // Only handle permanent errors here. If it's transient, just let the retry
        // logic kick in.
        if (function __PRIVATE_isPermanentWriteError(e) {
            return __PRIVATE_isPermanentError(e) && e !== v.ABORTED;
        }(t.code)) {
            // This was a permanent error, the request itself was the problem
            // so it's not going to succeed if we resend it.
            const n = e.b_.shift();
            // In this case it's also unlikely that the server itself is melting
            // down -- this was just a bad request so inhibit backoff on the next
            // restart.
                        __PRIVATE_ensureWriteStream(e).Yo(), await __PRIVATE_executeWithRecovery(e, (() => e.remoteSyncer.rejectFailedWrite(n.batchId, t))), 
            // It's possible that with the completion of this mutation
            // another slot has freed up.
            await __PRIVATE_fillWritePipeline(e);
        }
    }(e, t), 
    // The write stream might have been started by refilling the write
    // pipeline for failed writes
    __PRIVATE_shouldStartWriteStream(e) && __PRIVATE_startWriteStream(e);
}

async function __PRIVATE_remoteStoreHandleCredentialChange(e, t) {
    const n = __PRIVATE_debugCast(e);
    n.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug("RemoteStore", "RemoteStore received new credentials");
    const r = __PRIVATE_canUseNetwork(n);
    // Tear down and re-create our network streams. This will ensure we get a
    // fresh auth token for the new user and re-fill the write pipeline with
    // new mutations from the LocalStore (since mutations are per-user).
        n.C_.add(3 /* OfflineCause.CredentialChange */), await __PRIVATE_disableNetworkInternal(n), 
    r && 
    // Don't set the network status to Unknown if we are offline.
    n.M_.set("Unknown" /* OnlineState.Unknown */), await n.remoteSyncer.handleCredentialChange(t), 
    n.C_.delete(3 /* OfflineCause.CredentialChange */), await __PRIVATE_enableNetworkInternal(n);
}

/**
 * Toggles the network state when the client gains or loses its primary lease.
 */ async function __PRIVATE_remoteStoreApplyPrimaryState(e, t) {
    const n = __PRIVATE_debugCast(e);
    t ? (n.C_.delete(2 /* OfflineCause.IsSecondary */), await __PRIVATE_enableNetworkInternal(n)) : t || (n.C_.add(2 /* OfflineCause.IsSecondary */), 
    await __PRIVATE_disableNetworkInternal(n), n.M_.set("Unknown" /* OnlineState.Unknown */));
}

/**
 * If not yet initialized, registers the WatchStream and its network state
 * callback with `remoteStoreImpl`. Returns the existing stream if one is
 * already available.
 *
 * PORTING NOTE: On iOS and Android, the WatchStream gets registered on startup.
 * This is not done on Web to allow it to be tree-shaken.
 */ function __PRIVATE_ensureWatchStream(e) {
    return e.O_ || (
    // Create stream (but note that it is not started yet).
    e.O_ = function __PRIVATE_newPersistentWatchStream(e, t, n) {
        const r = __PRIVATE_debugCast(e);
        return r.A_(), new __PRIVATE_PersistentListenStream(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n);
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
 */ (e.datastore, e.asyncQueue, {
        ho: __PRIVATE_onWatchStreamOpen.bind(null, e),
        Io: __PRIVATE_onWatchStreamClose.bind(null, e),
        a_: __PRIVATE_onWatchStreamChange.bind(null, e)
    }), e.v_.push((async t => {
        t ? (e.O_.Yo(), __PRIVATE_shouldStartWatchStream(e) ? __PRIVATE_startWatchStream(e) : e.M_.set("Unknown" /* OnlineState.Unknown */)) : (await e.O_.stop(), 
        __PRIVATE_cleanUpWatchStreamState(e));
    }))), e.O_;
}

/**
 * If not yet initialized, registers the WriteStream and its network state
 * callback with `remoteStoreImpl`. Returns the existing stream if one is
 * already available.
 *
 * PORTING NOTE: On iOS and Android, the WriteStream gets registered on startup.
 * This is not done on Web to allow it to be tree-shaken.
 */ function __PRIVATE_ensureWriteStream(e) {
    return e.N_ || (
    // Create stream (but note that it is not started yet).
    e.N_ = function __PRIVATE_newPersistentWriteStream(e, t, n) {
        const r = __PRIVATE_debugCast(e);
        return r.A_(), new __PRIVATE_PersistentWriteStream(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n);
    }(e.datastore, e.asyncQueue, {
        ho: __PRIVATE_onWriteStreamOpen.bind(null, e),
        Io: __PRIVATE_onWriteStreamClose.bind(null, e),
        T_: __PRIVATE_onWriteHandshakeComplete.bind(null, e),
        I_: __PRIVATE_onMutationResult.bind(null, e)
    }), e.v_.push((async t => {
        t ? (e.N_.Yo(), 
        // This will start the write stream if necessary.
        await __PRIVATE_fillWritePipeline(e)) : (await e.N_.stop(), e.b_.length > 0 && (__PRIVATE_logDebug("RemoteStore", `Stopping write stream with ${e.b_.length} pending writes`), 
        e.b_ = []));
    }))), e.N_;
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
 */
class DelayedOperation {
    constructor(e, t, n, r, i) {
        this.asyncQueue = e, this.timerId = t, this.targetTimeMs = n, this.op = r, this.removalCallback = i, 
        this.deferred = new __PRIVATE_Deferred, this.then = this.deferred.promise.then.bind(this.deferred.promise), 
        // It's normal for the deferred promise to be canceled (due to cancellation)
        // and so we attach a dummy catch callback to avoid
        // 'UnhandledPromiseRejectionWarning' log spam.
        this.deferred.promise.catch((e => {}));
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
     */    static createAndSchedule(e, t, n, r, i) {
        const s = Date.now() + n, o = new DelayedOperation(e, t, s, r, i);
        return o.start(n), o;
    }
    /**
     * Starts the timer. This is called immediately after construction by
     * createAndSchedule().
     */    start(e) {
        this.timerHandle = setTimeout((() => this.handleDelayElapsed()), e);
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
     */    cancel(e) {
        null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new FirestoreError(v.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
    }
    handleDelayElapsed() {
        this.asyncQueue.enqueueAndForget((() => null !== this.timerHandle ? (this.clearTimeout(), 
        this.op().then((e => this.deferred.resolve(e)))) : Promise.resolve()));
    }
    clearTimeout() {
        null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), 
        this.timerHandle = null);
    }
}

/**
 * Returns a FirestoreError that can be surfaced to the user if the provided
 * error is an IndexedDbTransactionError. Re-throws the error otherwise.
 */ function __PRIVATE_wrapInUserErrorIfRecoverable(e, t) {
    if (__PRIVATE_logError("AsyncQueue", `${t}: ${e}`), __PRIVATE_isIndexedDbTransactionError(e)) return new FirestoreError(v.UNAVAILABLE, `${t}: ${e}`);
    throw e;
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
 * DocumentSet is an immutable (copy-on-write) collection that holds documents
 * in order specified by the provided comparator. We always add a document key
 * comparator on top of what is provided to guarantee document equality based on
 * the key.
 */ class DocumentSet {
    /** The default ordering is by key if the comparator is omitted */
    constructor(e) {
        // We are adding document key comparator to the end as it's the only
        // guaranteed unique property of a document.
        this.comparator = e ? (t, n) => e(t, n) || DocumentKey.comparator(t.key, n.key) : (e, t) => DocumentKey.comparator(e.key, t.key), 
        this.keyedMap = documentMap(), this.sortedSet = new SortedMap(this.comparator);
    }
    /**
     * Returns an empty copy of the existing DocumentSet, using the same
     * comparator.
     */    static emptySet(e) {
        return new DocumentSet(e.comparator);
    }
    has(e) {
        return null != this.keyedMap.get(e);
    }
    get(e) {
        return this.keyedMap.get(e);
    }
    first() {
        return this.sortedSet.minKey();
    }
    last() {
        return this.sortedSet.maxKey();
    }
    isEmpty() {
        return this.sortedSet.isEmpty();
    }
    /**
     * Returns the index of the provided key in the document set, or -1 if the
     * document key is not present in the set;
     */    indexOf(e) {
        const t = this.keyedMap.get(e);
        return t ? this.sortedSet.indexOf(t) : -1;
    }
    get size() {
        return this.sortedSet.size;
    }
    /** Iterates documents in order defined by "comparator" */    forEach(e) {
        this.sortedSet.inorderTraversal(((t, n) => (e(t), !1)));
    }
    /** Inserts or updates a document with the same key */    add(e) {
        // First remove the element if we have it.
        const t = this.delete(e.key);
        return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
    }
    /** Deletes a document with a given key */    delete(e) {
        const t = this.get(e);
        return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this;
    }
    isEqual(e) {
        if (!(e instanceof DocumentSet)) return !1;
        if (this.size !== e.size) return !1;
        const t = this.sortedSet.getIterator(), n = e.sortedSet.getIterator();
        for (;t.hasNext(); ) {
            const e = t.getNext().key, r = n.getNext().key;
            if (!e.isEqual(r)) return !1;
        }
        return !0;
    }
    toString() {
        const e = [];
        return this.forEach((t => {
            e.push(t.toString());
        })), 0 === e.length ? "DocumentSet ()" : "DocumentSet (\n  " + e.join("  \n") + "\n)";
    }
    copy(e, t) {
        const n = new DocumentSet;
        return n.comparator = this.comparator, n.keyedMap = e, n.sortedSet = t, n;
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
 * DocumentChangeSet keeps track of a set of changes to docs in a query, merging
 * duplicate events for the same doc.
 */ class __PRIVATE_DocumentChangeSet {
    constructor() {
        this.B_ = new SortedMap(DocumentKey.comparator);
    }
    track(e) {
        const t = e.doc.key, n = this.B_.get(t);
        n ? 
        // Merge the new change with the existing change.
        0 /* ChangeType.Added */ !== e.type && 3 /* ChangeType.Metadata */ === n.type ? this.B_ = this.B_.insert(t, e) : 3 /* ChangeType.Metadata */ === e.type && 1 /* ChangeType.Removed */ !== n.type ? this.B_ = this.B_.insert(t, {
            type: n.type,
            doc: e.doc
        }) : 2 /* ChangeType.Modified */ === e.type && 2 /* ChangeType.Modified */ === n.type ? this.B_ = this.B_.insert(t, {
            type: 2 /* ChangeType.Modified */ ,
            doc: e.doc
        }) : 2 /* ChangeType.Modified */ === e.type && 0 /* ChangeType.Added */ === n.type ? this.B_ = this.B_.insert(t, {
            type: 0 /* ChangeType.Added */ ,
            doc: e.doc
        }) : 1 /* ChangeType.Removed */ === e.type && 0 /* ChangeType.Added */ === n.type ? this.B_ = this.B_.remove(t) : 1 /* ChangeType.Removed */ === e.type && 2 /* ChangeType.Modified */ === n.type ? this.B_ = this.B_.insert(t, {
            type: 1 /* ChangeType.Removed */ ,
            doc: n.doc
        }) : 0 /* ChangeType.Added */ === e.type && 1 /* ChangeType.Removed */ === n.type ? this.B_ = this.B_.insert(t, {
            type: 2 /* ChangeType.Modified */ ,
            doc: e.doc
        }) : 
        // This includes these cases, which don't make sense:
        // Added->Added
        // Removed->Removed
        // Modified->Added
        // Removed->Modified
        // Metadata->Added
        // Removed->Metadata
        fail() : this.B_ = this.B_.insert(t, e);
    }
    L_() {
        const e = [];
        return this.B_.inorderTraversal(((t, n) => {
            e.push(n);
        })), e;
    }
}

class ViewSnapshot {
    constructor(e, t, n, r, i, s, o, _, a) {
        this.query = e, this.docs = t, this.oldDocs = n, this.docChanges = r, this.mutatedKeys = i, 
        this.fromCache = s, this.syncStateChanged = o, this.excludesMetadataChanges = _, 
        this.hasCachedResults = a;
    }
    /** Returns a view snapshot as if all documents in the snapshot were added. */    static fromInitialDocuments(e, t, n, r, i) {
        const s = [];
        return t.forEach((e => {
            s.push({
                type: 0 /* ChangeType.Added */ ,
                doc: e
            });
        })), new ViewSnapshot(e, t, DocumentSet.emptySet(t), s, n, r, 
        /* syncStateChanged= */ !0, 
        /* excludesMetadataChanges= */ !1, i);
    }
    get hasPendingWrites() {
        return !this.mutatedKeys.isEmpty();
    }
    isEqual(e) {
        if (!(this.fromCache === e.fromCache && this.hasCachedResults === e.hasCachedResults && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && __PRIVATE_queryEquals(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs))) return !1;
        const t = this.docChanges, n = e.docChanges;
        if (t.length !== n.length) return !1;
        for (let e = 0; e < t.length; e++) if (t[e].type !== n[e].type || !t[e].doc.isEqual(n[e].doc)) return !1;
        return !0;
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
 * Holds the listeners and the last received ViewSnapshot for a query being
 * tracked by EventManager.
 */ class __PRIVATE_QueryListenersInfo {
    constructor() {
        this.k_ = void 0, this.listeners = [];
    }
}

class __PRIVATE_EventManagerImpl {
    constructor() {
        this.queries = new ObjectMap((e => __PRIVATE_canonifyQuery(e)), __PRIVATE_queryEquals), 
        this.onlineState = "Unknown" /* OnlineState.Unknown */ , this.q_ = new Set;
    }
}

async function __PRIVATE_eventManagerListen(e, t) {
    const n = __PRIVATE_debugCast(e), r = t.query;
    let i = !1, s = n.queries.get(r);
    if (s || (i = !0, s = new __PRIVATE_QueryListenersInfo), i) try {
        s.k_ = await n.onListen(r);
    } catch (e) {
        const n = __PRIVATE_wrapInUserErrorIfRecoverable(e, `Initialization of query '${__PRIVATE_stringifyQuery(t.query)}' failed`);
        return void t.onError(n);
    }
    if (n.queries.set(r, s), s.listeners.push(t), 
    // Run global snapshot listeners if a consistent snapshot has been emitted.
    t.Q_(n.onlineState), s.k_) {
        t.K_(s.k_) && __PRIVATE_raiseSnapshotsInSyncEvent(n);
    }
}

async function __PRIVATE_eventManagerUnlisten(e, t) {
    const n = __PRIVATE_debugCast(e), r = t.query;
    let i = !1;
    const s = n.queries.get(r);
    if (s) {
        const e = s.listeners.indexOf(t);
        e >= 0 && (s.listeners.splice(e, 1), i = 0 === s.listeners.length);
    }
    if (i) return n.queries.delete(r), n.onUnlisten(r);
}

function __PRIVATE_eventManagerOnWatchChange(e, t) {
    const n = __PRIVATE_debugCast(e);
    let r = !1;
    for (const e of t) {
        const t = e.query, i = n.queries.get(t);
        if (i) {
            for (const t of i.listeners) t.K_(e) && (r = !0);
            i.k_ = e;
        }
    }
    r && __PRIVATE_raiseSnapshotsInSyncEvent(n);
}

function __PRIVATE_eventManagerOnWatchError(e, t, n) {
    const r = __PRIVATE_debugCast(e), i = r.queries.get(t);
    if (i) for (const e of i.listeners) e.onError(n);
    // Remove all listeners. NOTE: We don't need to call syncEngine.unlisten()
    // after an error.
        r.queries.delete(t);
}

// Call all global snapshot listeners that have been set.
function __PRIVATE_raiseSnapshotsInSyncEvent(e) {
    e.q_.forEach((e => {
        e.next();
    }));
}

/**
 * QueryListener takes a series of internal view snapshots and determines
 * when to raise the event.
 *
 * It uses an Observer to dispatch events.
 */ class __PRIVATE_QueryListener {
    constructor(e, t, n) {
        this.query = e, this.U_ = t, 
        /**
         * Initial snapshots (e.g. from cache) may not be propagated to the wrapped
         * observer. This flag is set to true once we've actually raised an event.
         */
        this.W_ = !1, this.G_ = null, this.onlineState = "Unknown" /* OnlineState.Unknown */ , 
        this.options = n || {};
    }
    /**
     * Applies the new ViewSnapshot to this listener, raising a user-facing event
     * if applicable (depending on what changed, whether the user has opted into
     * metadata-only changes, etc.). Returns true if a user-facing event was
     * indeed raised.
     */    K_(e) {
        if (!this.options.includeMetadataChanges) {
            // Remove the metadata only changes.
            const t = [];
            for (const n of e.docChanges) 3 /* ChangeType.Metadata */ !== n.type && t.push(n);
            e = new ViewSnapshot(e.query, e.docs, e.oldDocs, t, e.mutatedKeys, e.fromCache, e.syncStateChanged, 
            /* excludesMetadataChanges= */ !0, e.hasCachedResults);
        }
        let t = !1;
        return this.W_ ? this.z_(e) && (this.U_.next(e), t = !0) : this.j_(e, this.onlineState) && (this.H_(e), 
        t = !0), this.G_ = e, t;
    }
    onError(e) {
        this.U_.error(e);
    }
    /** Returns whether a snapshot was raised. */    Q_(e) {
        this.onlineState = e;
        let t = !1;
        return this.G_ && !this.W_ && this.j_(this.G_, e) && (this.H_(this.G_), t = !0), 
        t;
    }
    j_(e, t) {
        // Always raise the first event when we're synced
        if (!e.fromCache) return !0;
        // NOTE: We consider OnlineState.Unknown as online (it should become Offline
        // or Online if we wait long enough).
                const n = "Offline" /* OnlineState.Offline */ !== t;
        // Don't raise the event if we're online, aren't synced yet (checked
        // above) and are waiting for a sync.
                return (!this.options.J_ || !n) && (!e.docs.isEmpty() || e.hasCachedResults || "Offline" /* OnlineState.Offline */ === t);
        // Raise data from cache if we have any documents, have cached results before,
        // or we are offline.
        }
    z_(e) {
        // We don't need to handle includeDocumentMetadataChanges here because
        // the Metadata only changes have already been stripped out if needed.
        // At this point the only changes we will see are the ones we should
        // propagate.
        if (e.docChanges.length > 0) return !0;
        const t = this.G_ && this.G_.hasPendingWrites !== e.hasPendingWrites;
        return !(!e.syncStateChanged && !t) && !0 === this.options.includeMetadataChanges;
        // Generally we should have hit one of the cases above, but it's possible
        // to get here if there were only metadata docChanges and they got
        // stripped out.
        }
    H_(e) {
        e = ViewSnapshot.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults), 
        this.W_ = !0, this.U_.next(e);
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
 * A complete element in the bundle stream, together with the byte length it
 * occupies in the stream.
 */ class __PRIVATE_SizedBundleElement {
    constructor(e, 
    // How many bytes this element takes to store in the bundle.
    t) {
        this.Y_ = e, this.byteLength = t;
    }
    Z_() {
        return "metadata" in this.Y_;
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
 * Helper to convert objects from bundles to model objects in the SDK.
 */ class __PRIVATE_BundleConverterImpl {
    constructor(e) {
        this.serializer = e;
    }
    hs(e) {
        return fromName(this.serializer, e);
    }
    /**
     * Converts a BundleDocument to a MutableDocument.
     */    Ps(e) {
        return e.metadata.exists ? __PRIVATE_fromDocument(this.serializer, e.document, !1) : MutableDocument.newNoDocument(this.hs(e.metadata.name), this.Is(e.metadata.readTime));
    }
    Is(e) {
        return __PRIVATE_fromVersion(e);
    }
}

/**
 * A class to process the elements from a bundle, load them into local
 * storage and provide progress update while loading.
 */ class __PRIVATE_BundleLoader {
    constructor(e, t, n) {
        this.X_ = e, this.localStore = t, this.serializer = n, 
        /** Batched queries to be saved into storage */
        this.queries = [], 
        /** Batched documents to be saved into storage */
        this.documents = [], 
        /** The collection groups affected by this bundle. */
        this.collectionGroups = new Set, this.progress = __PRIVATE_bundleInitialProgress(e);
    }
    /**
     * Adds an element from the bundle to the loader.
     *
     * Returns a new progress if adding the element leads to a new progress,
     * otherwise returns null.
     */    ea(e) {
        this.progress.bytesLoaded += e.byteLength;
        let t = this.progress.documentsLoaded;
        if (e.Y_.namedQuery) this.queries.push(e.Y_.namedQuery); else if (e.Y_.documentMetadata) {
            this.documents.push({
                metadata: e.Y_.documentMetadata
            }), e.Y_.documentMetadata.exists || ++t;
            const n = ResourcePath.fromString(e.Y_.documentMetadata.name);
            this.collectionGroups.add(n.get(n.length - 2));
        } else e.Y_.document && (this.documents[this.documents.length - 1].document = e.Y_.document, 
        ++t);
        return t !== this.progress.documentsLoaded ? (this.progress.documentsLoaded = t, 
        Object.assign({}, this.progress)) : null;
    }
    ta(e) {
        const t = new Map, n = new __PRIVATE_BundleConverterImpl(this.serializer);
        for (const r of e) if (r.metadata.queries) {
            const e = n.hs(r.metadata.name);
            for (const n of r.metadata.queries) {
                const r = (t.get(n) || __PRIVATE_documentKeySet()).add(e);
                t.set(n, r);
            }
        }
        return t;
    }
    /**
     * Update the progress to 'Success' and return the updated progress.
     */    async complete() {
        const e = await __PRIVATE_localStoreApplyBundledDocuments(this.localStore, new __PRIVATE_BundleConverterImpl(this.serializer), this.documents, this.X_.id), t = this.ta(this.documents);
        for (const e of this.queries) await __PRIVATE_localStoreSaveNamedQuery(this.localStore, e, t.get(e.name));
        return this.progress.taskState = "Success", {
            progress: this.progress,
            na: this.collectionGroups,
            ra: e
        };
    }
}

/**
 * Returns a `LoadBundleTaskProgress` representing the initial progress of
 * loading a bundle.
 */ function __PRIVATE_bundleInitialProgress(e) {
    return {
        taskState: "Running",
        documentsLoaded: 0,
        bytesLoaded: 0,
        totalDocuments: e.totalDocuments,
        totalBytes: e.totalBytes
    };
}

/**
 * Returns a `LoadBundleTaskProgress` representing the progress that the loading
 * has succeeded.
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
class __PRIVATE_AddedLimboDocument {
    constructor(e) {
        this.key = e;
    }
}

class __PRIVATE_RemovedLimboDocument {
    constructor(e) {
        this.key = e;
    }
}

/**
 * View is responsible for computing the final merged truth of what docs are in
 * a query. It gets notified of local and remote changes to docs, and applies
 * the query filters and limits to determine the most correct possible results.
 */ class __PRIVATE_View {
    constructor(e, 
    /** Documents included in the remote target */
    t) {
        this.query = e, this.ia = t, this.sa = null, this.hasCachedResults = !1, 
        /**
         * A flag whether the view is current with the backend. A view is considered
         * current after it has seen the current flag from the backend and did not
         * lose consistency within the watch stream (e.g. because of an existence
         * filter mismatch).
         */
        this.current = !1, 
        /** Documents in the view but not in the remote target */
        this.oa = __PRIVATE_documentKeySet(), 
        /** Document Keys that have local changes */
        this.mutatedKeys = __PRIVATE_documentKeySet(), this._a = __PRIVATE_newQueryComparator(e), 
        this.aa = new DocumentSet(this._a);
    }
    /**
     * The set of remote documents that the server has told us belongs to the target associated with
     * this view.
     */    get ua() {
        return this.ia;
    }
    /**
     * Iterates over a set of doc changes, applies the query limit, and computes
     * what the new results should be, what the changes were, and whether we may
     * need to go back to the local cache for more results. Does not make any
     * changes to the view.
     * @param docChanges - The doc changes to apply to this view.
     * @param previousChanges - If this is being called with a refill, then start
     *        with this set of docs and changes instead of the current view.
     * @returns a new set of docs, changes, and refill flag.
     */    ca(e, t) {
        const n = t ? t.la : new __PRIVATE_DocumentChangeSet, r = t ? t.aa : this.aa;
        let i = t ? t.mutatedKeys : this.mutatedKeys, s = r, o = !1;
        // Track the last doc in a (full) limit. This is necessary, because some
        // update (a delete, or an update moving a doc past the old limit) might
        // mean there is some other document in the local cache that either should
        // come (1) between the old last limit doc and the new last document, in the
        // case of updates, or (2) after the new last document, in the case of
        // deletes. So we keep this doc at the old limit to compare the updates to.
        // Note that this should never get used in a refill (when previousChanges is
        // set), because there will only be adds -- no deletes or updates.
        const _ = "F" /* LimitType.First */ === this.query.limitType && r.size === this.query.limit ? r.last() : null, a = "L" /* LimitType.Last */ === this.query.limitType && r.size === this.query.limit ? r.first() : null;
        // Drop documents out to meet limit/limitToLast requirement.
        if (e.inorderTraversal(((e, t) => {
            const u = r.get(e), c = __PRIVATE_queryMatches(this.query, t) ? t : null, l = !!u && this.mutatedKeys.has(u.key), h = !!c && (c.hasLocalMutations || 
            // We only consider committed mutations for documents that were
            // mutated during the lifetime of the view.
            this.mutatedKeys.has(c.key) && c.hasCommittedMutations);
            let P = !1;
            // Calculate change
                        if (u && c) {
                u.data.isEqual(c.data) ? l !== h && (n.track({
                    type: 3 /* ChangeType.Metadata */ ,
                    doc: c
                }), P = !0) : this.ha(u, c) || (n.track({
                    type: 2 /* ChangeType.Modified */ ,
                    doc: c
                }), P = !0, (_ && this._a(c, _) > 0 || a && this._a(c, a) < 0) && (
                // This doc moved from inside the limit to outside the limit.
                // That means there may be some other doc in the local cache
                // that should be included instead.
                o = !0));
            } else !u && c ? (n.track({
                type: 0 /* ChangeType.Added */ ,
                doc: c
            }), P = !0) : u && !c && (n.track({
                type: 1 /* ChangeType.Removed */ ,
                doc: u
            }), P = !0, (_ || a) && (
            // A doc was removed from a full limit query. We'll need to
            // requery from the local cache to see if we know about some other
            // doc that should be in the results.
            o = !0));
            P && (c ? (s = s.add(c), i = h ? i.add(e) : i.delete(e)) : (s = s.delete(e), i = i.delete(e)));
        })), null !== this.query.limit) for (;s.size > this.query.limit; ) {
            const e = "F" /* LimitType.First */ === this.query.limitType ? s.last() : s.first();
            s = s.delete(e.key), i = i.delete(e.key), n.track({
                type: 1 /* ChangeType.Removed */ ,
                doc: e
            });
        }
        return {
            aa: s,
            la: n,
            Zi: o,
            mutatedKeys: i
        };
    }
    ha(e, t) {
        // We suppress the initial change event for documents that were modified as
        // part of a write acknowledgment (e.g. when the value of a server transform
        // is applied) as Watch will send us the same document again.
        // By suppressing the event, we only raise two user visible events (one with
        // `hasPendingWrites` and the final state of the document) instead of three
        // (one with `hasPendingWrites`, the modified document with
        // `hasPendingWrites` and the final state of the document).
        return e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations;
    }
    /**
     * Updates the view with the given ViewDocumentChanges and optionally updates
     * limbo docs and sync state from the provided target change.
     * @param docChanges - The set of changes to make to the view's docs.
     * @param limboResolutionEnabled - Whether to update limbo documents based on
     *        this change.
     * @param targetChange - A target change to apply for computing limbo docs and
     *        sync state.
     * @param targetIsPendingReset - Whether the target is pending to reset due to
     *        existence filter mismatch. If not explicitly specified, it is treated
     *        equivalently to `false`.
     * @returns A new ViewChange with the given docs, changes, and sync state.
     */
    // PORTING NOTE: The iOS/Android clients always compute limbo document changes.
    applyChanges(e, t, n, r) {
        const i = this.aa;
        this.aa = e.aa, this.mutatedKeys = e.mutatedKeys;
        // Sort changes based on type and query comparator
        const s = e.la.L_();
        s.sort(((e, t) => function __PRIVATE_compareChangeType(e, t) {
            const order = e => {
                switch (e) {
                  case 0 /* ChangeType.Added */ :
                    return 1;

                  case 2 /* ChangeType.Modified */ :
                  case 3 /* ChangeType.Metadata */ :
                    // A metadata change is converted to a modified change at the public
                    // api layer.  Since we sort by document key and then change type,
                    // metadata and modified changes must be sorted equivalently.
                    return 2;

                  case 1 /* ChangeType.Removed */ :
                    return 0;

                  default:
                    return fail();
                }
            };
            return order(e) - order(t);
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
 */ (e.type, t.type) || this._a(e.doc, t.doc))), this.Pa(n), r = null != r && r;
        const o = t && !r ? this.Ia() : [], _ = 0 === this.oa.size && this.current && !r ? 1 /* SyncState.Synced */ : 0 /* SyncState.Local */ , a = _ !== this.sa;
        // We are at synced state if there is no limbo docs are waiting to be resolved, view is current
        // with the backend, and the query is not pending to reset due to existence filter mismatch.
                if (this.sa = _, 0 !== s.length || a) {
            return {
                snapshot: new ViewSnapshot(this.query, e.aa, i, s, e.mutatedKeys, 0 /* SyncState.Local */ === _, a, 
                /* excludesMetadataChanges= */ !1, !!n && n.resumeToken.approximateByteSize() > 0),
                Ta: o
            };
        }
        // no changes
        return {
            Ta: o
        };
    }
    /**
     * Applies an OnlineState change to the view, potentially generating a
     * ViewChange if the view's syncState changes as a result.
     */    Q_(e) {
        return this.current && "Offline" /* OnlineState.Offline */ === e ? (
        // If we're offline, set `current` to false and then call applyChanges()
        // to refresh our syncState and generate a ViewChange as appropriate. We
        // are guaranteed to get a new TargetChange that sets `current` back to
        // true once the client is back online.
        this.current = !1, this.applyChanges({
            aa: this.aa,
            la: new __PRIVATE_DocumentChangeSet,
            mutatedKeys: this.mutatedKeys,
            Zi: !1
        }, 
        /* limboResolutionEnabled= */ !1)) : {
            Ta: []
        };
    }
    /**
     * Returns whether the doc for the given key should be in limbo.
     */    Ea(e) {
        // If the remote end says it's part of this query, it's not in limbo.
        return !this.ia.has(e) && (
        // The local store doesn't think it's a result, so it shouldn't be in limbo.
        !!this.aa.has(e) && !this.aa.get(e).hasLocalMutations);
    }
    /**
     * Updates syncedDocuments, current, and limbo docs based on the given change.
     * Returns the list of changes to which docs are in limbo.
     */    Pa(e) {
        e && (e.addedDocuments.forEach((e => this.ia = this.ia.add(e))), e.modifiedDocuments.forEach((e => {})), 
        e.removedDocuments.forEach((e => this.ia = this.ia.delete(e))), this.current = e.current);
    }
    Ia() {
        // We can only determine limbo documents when we're in-sync with the server.
        if (!this.current) return [];
        // TODO(klimt): Do this incrementally so that it's not quadratic when
        // updating many documents.
                const e = this.oa;
        this.oa = __PRIVATE_documentKeySet(), this.aa.forEach((e => {
            this.Ea(e.key) && (this.oa = this.oa.add(e.key));
        }));
        // Diff the new limbo docs with the old limbo docs.
        const t = [];
        return e.forEach((e => {
            this.oa.has(e) || t.push(new __PRIVATE_RemovedLimboDocument(e));
        })), this.oa.forEach((n => {
            e.has(n) || t.push(new __PRIVATE_AddedLimboDocument(n));
        })), t;
    }
    /**
     * Update the in-memory state of the current view with the state read from
     * persistence.
     *
     * We update the query view whenever a client's primary status changes:
     * - When a client transitions from primary to secondary, it can miss
     *   LocalStorage updates and its query views may temporarily not be
     *   synchronized with the state on disk.
     * - For secondary to primary transitions, the client needs to update the list
     *   of `syncedDocuments` since secondary clients update their query views
     *   based purely on synthesized RemoteEvents.
     *
     * @param queryResult.documents - The documents that match the query according
     * to the LocalStore.
     * @param queryResult.remoteKeys - The keys of the documents that match the
     * query according to the backend.
     *
     * @returns The ViewChange that resulted from this synchronization.
     */
    // PORTING NOTE: Multi-tab only.
    da(e) {
        this.ia = e.ls, this.oa = __PRIVATE_documentKeySet();
        const t = this.ca(e.documents);
        return this.applyChanges(t, /* limboResolutionEnabled= */ !0);
    }
    /**
     * Returns a view snapshot as if this query was just listened to. Contains
     * a document add for every existing document and the `fromCache` and
     * `hasPendingWrites` status of the already established view.
     */
    // PORTING NOTE: Multi-tab only.
    Aa() {
        return ViewSnapshot.fromInitialDocuments(this.query, this.aa, this.mutatedKeys, 0 /* SyncState.Local */ === this.sa, this.hasCachedResults);
    }
}

/**
 * QueryView contains all of the data that SyncEngine needs to keep track of for
 * a particular query.
 */
class __PRIVATE_QueryView {
    constructor(
    /**
     * The query itself.
     */
    e, 
    /**
     * The target number created by the client that is used in the watch
     * stream to identify this query.
     */
    t, 
    /**
     * The view is responsible for computing the final merged truth of what
     * docs are in the query. It gets notified of local and remote changes,
     * and applies the query filters and limits to determine the most correct
     * possible results.
     */
    n) {
        this.query = e, this.targetId = t, this.view = n;
    }
}

/** Tracks a limbo resolution. */ class LimboResolution {
    constructor(e) {
        this.key = e, 
        /**
         * Set to true once we've received a document. This is used in
         * getRemoteKeysForTarget() and ultimately used by WatchChangeAggregator to
         * decide whether it needs to manufacture a delete event for the target once
         * the target is CURRENT.
         */
        this.Ra = !1;
    }
}

/**
 * An implementation of `SyncEngine` coordinating with other parts of SDK.
 *
 * The parts of SyncEngine that act as a callback to RemoteStore need to be
 * registered individually. This is done in `syncEngineWrite()` and
 * `syncEngineListen()` (as well as `applyPrimaryState()`) as these methods
 * serve as entry points to RemoteStore's functionality.
 *
 * Note: some field defined in this class might have public access level, but
 * the class is not exported so they are only accessible from this module.
 * This is useful to implement optional features (like bundles) in free
 * functions, such that they are tree-shakeable.
 */ class __PRIVATE_SyncEngineImpl {
    constructor(e, t, n, 
    // PORTING NOTE: Manages state synchronization in multi-tab environments.
    r, i, s) {
        this.localStore = e, this.remoteStore = t, this.eventManager = n, this.sharedClientState = r, 
        this.currentUser = i, this.maxConcurrentLimboResolutions = s, this.Va = {}, this.ma = new ObjectMap((e => __PRIVATE_canonifyQuery(e)), __PRIVATE_queryEquals), 
        this.fa = new Map, 
        /**
         * The keys of documents that are in limbo for which we haven't yet started a
         * limbo resolution query. The strings in this set are the result of calling
         * `key.path.canonicalString()` where `key` is a `DocumentKey` object.
         *
         * The `Set` type was chosen because it provides efficient lookup and removal
         * of arbitrary elements and it also maintains insertion order, providing the
         * desired queue-like FIFO semantics.
         */
        this.ga = new Set, 
        /**
         * Keeps track of the target ID for each document that is in limbo with an
         * active target.
         */
        this.pa = new SortedMap(DocumentKey.comparator), 
        /**
         * Keeps track of the information about an active limbo resolution for each
         * active target ID that was started for the purpose of limbo resolution.
         */
        this.ya = new Map, this.wa = new __PRIVATE_ReferenceSet, 
        /** Stores user completion handlers, indexed by User and BatchId. */
        this.Sa = {}, 
        /** Stores user callbacks waiting for all pending writes to be acknowledged. */
        this.ba = new Map, this.Da = __PRIVATE_TargetIdGenerator.Nn(), this.onlineState = "Unknown" /* OnlineState.Unknown */ , 
        // The primary state is set to `true` or `false` immediately after Firestore
        // startup. In the interim, a client should only be considered primary if
        // `isPrimary` is true.
        this.Ca = void 0;
    }
    get isPrimaryClient() {
        return !0 === this.Ca;
    }
}

/**
 * Initiates the new listen, resolves promise when listen enqueued to the
 * server. All the subsequent view snapshots or errors are sent to the
 * subscribed handlers. Returns the initial snapshot.
 */
async function __PRIVATE_syncEngineListen(e, t) {
    const n = __PRIVATE_ensureWatchCallbacks(e);
    let r, i;
    const s = n.ma.get(t);
    if (s) 
    // PORTING NOTE: With Multi-Tab Web, it is possible that a query view
    // already exists when EventManager calls us for the first time. This
    // happens when the primary tab is already listening to this query on
    // behalf of another tab and the user of the primary also starts listening
    // to the query. EventManager will not have an assigned target ID in this
    // case and calls `listen` to obtain this ID.
    r = s.targetId, n.sharedClientState.addLocalQueryTarget(r), i = s.view.Aa(); else {
        const e = await __PRIVATE_localStoreAllocateTarget(n.localStore, __PRIVATE_queryToTarget(t)), s = n.sharedClientState.addLocalQueryTarget(e.targetId);
        r = e.targetId, i = await __PRIVATE_initializeViewAndComputeSnapshot(n, t, r, "current" === s, e.resumeToken), 
        n.isPrimaryClient && __PRIVATE_remoteStoreListen(n.remoteStore, e);
    }
    return i;
}

/**
 * Registers a view for a previously unknown query and computes its initial
 * snapshot.
 */ async function __PRIVATE_initializeViewAndComputeSnapshot(e, t, n, r, i) {
    // PORTING NOTE: On Web only, we inject the code that registers new Limbo
    // targets based on view changes. This allows us to only depend on Limbo
    // changes when user code includes queries.
    e.va = (t, n, r) => async function __PRIVATE_applyDocChanges(e, t, n, r) {
        let i = t.view.ca(n);
        i.Zi && (
        // The query has a limit and some docs were removed, so we need
        // to re-run the query against the local store to make sure we
        // didn't lose any good docs that had been past the limit.
        i = await __PRIVATE_localStoreExecuteQuery(e.localStore, t.query, 
        /* usePreviousResults= */ !1).then((({documents: e}) => t.view.ca(e, i))));
        const s = r && r.targetChanges.get(t.targetId), o = r && null != r.targetMismatches.get(t.targetId), _ = t.view.applyChanges(i, 
        /* limboResolutionEnabled= */ e.isPrimaryClient, s, o);
        return __PRIVATE_updateTrackedLimbos(e, t.targetId, _.Ta), _.snapshot;
    }(e, t, n, r);
    const s = await __PRIVATE_localStoreExecuteQuery(e.localStore, t, 
    /* usePreviousResults= */ !0), o = new __PRIVATE_View(t, s.ls), _ = o.ca(s.documents), a = TargetChange.createSynthesizedTargetChangeForCurrentChange(n, r && "Offline" /* OnlineState.Offline */ !== e.onlineState, i), u = o.applyChanges(_, 
    /* limboResolutionEnabled= */ e.isPrimaryClient, a);
    __PRIVATE_updateTrackedLimbos(e, n, u.Ta);
    const c = new __PRIVATE_QueryView(t, n, o);
    return e.ma.set(t, c), e.fa.has(n) ? e.fa.get(n).push(t) : e.fa.set(n, [ t ]), u.snapshot;
}

/** Stops listening to the query. */ async function __PRIVATE_syncEngineUnlisten(e, t) {
    const n = __PRIVATE_debugCast(e), r = n.ma.get(t), i = n.fa.get(r.targetId);
    if (i.length > 1) return n.fa.set(r.targetId, i.filter((e => !__PRIVATE_queryEquals(e, t)))), 
    void n.ma.delete(t);
    // No other queries are mapped to the target, clean up the query and the target.
        if (n.isPrimaryClient) {
        // We need to remove the local query target first to allow us to verify
        // whether any other client is still interested in this target.
        n.sharedClientState.removeLocalQueryTarget(r.targetId);
        n.sharedClientState.isActiveQueryTarget(r.targetId) || await __PRIVATE_localStoreReleaseTarget(n.localStore, r.targetId, 
        /*keepPersistedTargetData=*/ !1).then((() => {
            n.sharedClientState.clearQueryState(r.targetId), __PRIVATE_remoteStoreUnlisten(n.remoteStore, r.targetId), 
            __PRIVATE_removeAndCleanupTarget(n, r.targetId);
        })).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
    } else __PRIVATE_removeAndCleanupTarget(n, r.targetId), await __PRIVATE_localStoreReleaseTarget(n.localStore, r.targetId, 
    /*keepPersistedTargetData=*/ !0);
}

/**
 * Initiates the write of local mutation batch which involves adding the
 * writes to the mutation queue, notifying the remote store about new
 * mutations and raising events for any changes this write caused.
 *
 * The promise returned by this call is resolved when the above steps
 * have completed, *not* when the write was acked by the backend. The
 * userCallback is resolved once the write was acked/rejected by the
 * backend (or failed locally for any other reason).
 */ async function __PRIVATE_syncEngineWrite(e, t, n) {
    const r = __PRIVATE_syncEngineEnsureWriteCallbacks(e);
    try {
        const e = await function __PRIVATE_localStoreWriteLocally(e, t) {
            const n = __PRIVATE_debugCast(e), r = Timestamp.now(), i = t.reduce(((e, t) => e.add(t.key)), __PRIVATE_documentKeySet());
            let s, o;
            return n.persistence.runTransaction("Locally write mutations", "readwrite", (e => {
                // Figure out which keys do not have a remote version in the cache, this
                // is needed to create the right overlay mutation: if no remote version
                // presents, we do not need to create overlays as patch mutations.
                // TODO(Overlay): Is there a better way to determine this? Using the
                //  document version does not work because local mutations set them back
                //  to 0.
                let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
                return n.ss.getEntries(e, i).next((e => {
                    _ = e, _.forEach(((e, t) => {
                        t.isValidDocument() || (a = a.add(e));
                    }));
                })).next((() => n.localDocuments.getOverlayedDocuments(e, _))).next((i => {
                    s = i;
                    // For non-idempotent mutations (such as `FieldValue.increment()`),
                    // we record the base state in a separate patch mutation. This is
                    // later used to guarantee consistent values and prevents flicker
                    // even if the backend sends us an update that already includes our
                    // transform.
                    const o = [];
                    for (const e of t) {
                        const t = __PRIVATE_mutationExtractBaseValue(e, s.get(e.key).overlayedDocument);
                        null != t && 
                        // NOTE: The base state should only be applied if there's some
                        // existing document to override, so use a Precondition of
                        // exists=true
                        o.push(new __PRIVATE_PatchMutation(e.key, t, __PRIVATE_extractFieldMask(t.value.mapValue), Precondition.exists(!0)));
                    }
                    return n.mutationQueue.addMutationBatch(e, r, o, t);
                })).next((t => {
                    o = t;
                    const r = t.applyToLocalDocumentSet(s, a);
                    return n.documentOverlayCache.saveOverlays(e, t.batchId, r);
                }));
            })).then((() => ({
                batchId: o.batchId,
                changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(s)
            })));
        }(r.localStore, t);
        r.sharedClientState.addPendingMutation(e.batchId), function __PRIVATE_addMutationCallback(e, t, n) {
            let r = e.Sa[e.currentUser.toKey()];
            r || (r = new SortedMap(__PRIVATE_primitiveComparator));
            r = r.insert(t, n), e.Sa[e.currentUser.toKey()] = r;
        }
        /**
 * Resolves or rejects the user callback for the given batch and then discards
 * it.
 */ (r, e.batchId, n), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r, e.changes), 
        await __PRIVATE_fillWritePipeline(r.remoteStore);
    } catch (e) {
        // If we can't persist the mutation, we reject the user callback and
        // don't send the mutation. The user can then retry the write.
        const t = __PRIVATE_wrapInUserErrorIfRecoverable(e, "Failed to persist write");
        n.reject(t);
    }
}

/**
 * Applies one remote event to the sync engine, notifying any views of the
 * changes, and releasing any pending mutation batches that would become
 * visible because of the snapshot version the remote event contains.
 */ async function __PRIVATE_syncEngineApplyRemoteEvent(e, t) {
    const n = __PRIVATE_debugCast(e);
    try {
        const e = await __PRIVATE_localStoreApplyRemoteEventToLocalCache(n.localStore, t);
        // Update `receivedDocument` as appropriate for any limbo targets.
                t.targetChanges.forEach(((e, t) => {
            const r = n.ya.get(t);
            r && (
            // Since this is a limbo resolution lookup, it's for a single document
            // and it could be added, modified, or removed, but not a combination.
            __PRIVATE_hardAssert(e.addedDocuments.size + e.modifiedDocuments.size + e.removedDocuments.size <= 1), 
            e.addedDocuments.size > 0 ? r.Ra = !0 : e.modifiedDocuments.size > 0 ? __PRIVATE_hardAssert(r.Ra) : e.removedDocuments.size > 0 && (__PRIVATE_hardAssert(r.Ra), 
            r.Ra = !1));
        })), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e, t);
    } catch (e) {
        await __PRIVATE_ignoreIfPrimaryLeaseLoss(e);
    }
}

/**
 * Applies an OnlineState change to the sync engine and notifies any views of
 * the change.
 */ function __PRIVATE_syncEngineApplyOnlineStateChange(e, t, n) {
    const r = __PRIVATE_debugCast(e);
    // If we are the secondary client, we explicitly ignore the remote store's
    // online state (the local client may go offline, even though the primary
    // tab remains online) and only apply the primary tab's online state from
    // SharedClientState.
        if (r.isPrimaryClient && 0 /* OnlineStateSource.RemoteStore */ === n || !r.isPrimaryClient && 1 /* OnlineStateSource.SharedClientState */ === n) {
        const e = [];
        r.ma.forEach(((n, r) => {
            const i = r.view.Q_(t);
            i.snapshot && e.push(i.snapshot);
        })), function __PRIVATE_eventManagerOnOnlineStateChange(e, t) {
            const n = __PRIVATE_debugCast(e);
            n.onlineState = t;
            let r = !1;
            n.queries.forEach(((e, n) => {
                for (const e of n.listeners) 
                // Run global snapshot listeners if a consistent snapshot has been emitted.
                e.Q_(t) && (r = !0);
            })), r && __PRIVATE_raiseSnapshotsInSyncEvent(n);
        }(r.eventManager, t), e.length && r.Va.a_(e), r.onlineState = t, r.isPrimaryClient && r.sharedClientState.setOnlineState(t);
    }
}

/**
 * Rejects the listen for the given targetID. This can be triggered by the
 * backend for any active target.
 *
 * @param syncEngine - The sync engine implementation.
 * @param targetId - The targetID corresponds to one previously initiated by the
 * user as part of TargetData passed to listen() on RemoteStore.
 * @param err - A description of the condition that has forced the rejection.
 * Nearly always this will be an indication that the user is no longer
 * authorized to see the data matching the target.
 */ async function __PRIVATE_syncEngineRejectListen(e, t, n) {
    const r = __PRIVATE_debugCast(e);
    // PORTING NOTE: Multi-tab only.
        r.sharedClientState.updateQueryState(t, "rejected", n);
    const i = r.ya.get(t), s = i && i.key;
    if (s) {
        // TODO(klimt): We really only should do the following on permission
        // denied errors, but we don't have the cause code here.
        // It's a limbo doc. Create a synthetic event saying it was deleted.
        // This is kind of a hack. Ideally, we would have a method in the local
        // store to purge a document. However, it would be tricky to keep all of
        // the local store's invariants with another method.
        let e = new SortedMap(DocumentKey.comparator);
        // TODO(b/217189216): This limbo document should ideally have a read time,
        // so that it is picked up by any read-time based scans. The backend,
        // however, does not send a read time for target removals.
                e = e.insert(s, MutableDocument.newNoDocument(s, SnapshotVersion.min()));
        const n = __PRIVATE_documentKeySet().add(s), i = new RemoteEvent(SnapshotVersion.min(), 
        /* targetChanges= */ new Map, 
        /* targetMismatches= */ new SortedMap(__PRIVATE_primitiveComparator), e, n);
        await __PRIVATE_syncEngineApplyRemoteEvent(r, i), 
        // Since this query failed, we won't want to manually unlisten to it.
        // We only remove it from bookkeeping after we successfully applied the
        // RemoteEvent. If `applyRemoteEvent()` throws, we want to re-listen to
        // this query when the RemoteStore restarts the Watch stream, which should
        // re-trigger the target failure.
        r.pa = r.pa.remove(s), r.ya.delete(t), __PRIVATE_pumpEnqueuedLimboResolutions(r);
    } else await __PRIVATE_localStoreReleaseTarget(r.localStore, t, 
    /* keepPersistedTargetData */ !1).then((() => __PRIVATE_removeAndCleanupTarget(r, t, n))).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
}

async function __PRIVATE_syncEngineApplySuccessfulWrite(e, t) {
    const n = __PRIVATE_debugCast(e), r = t.batch.batchId;
    try {
        const e = await __PRIVATE_localStoreAcknowledgeBatch(n.localStore, t);
        // The local store may or may not be able to apply the write result and
        // raise events immediately (depending on whether the watcher is caught
        // up), so we raise user callbacks first so that they consistently happen
        // before listen events.
                __PRIVATE_processUserCallback(n, r, /*error=*/ null), __PRIVATE_triggerPendingWritesCallbacks(n, r), 
        n.sharedClientState.updateMutationState(r, "acknowledged"), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e);
    } catch (e) {
        await __PRIVATE_ignoreIfPrimaryLeaseLoss(e);
    }
}

async function __PRIVATE_syncEngineRejectFailedWrite(e, t, n) {
    const r = __PRIVATE_debugCast(e);
    try {
        const e = await function __PRIVATE_localStoreRejectBatch(e, t) {
            const n = __PRIVATE_debugCast(e);
            return n.persistence.runTransaction("Reject batch", "readwrite-primary", (e => {
                let r;
                return n.mutationQueue.lookupMutationBatch(e, t).next((t => (__PRIVATE_hardAssert(null !== t), 
                r = t.keys(), n.mutationQueue.removeMutationBatch(e, t)))).next((() => n.mutationQueue.performConsistencyCheck(e))).next((() => n.documentOverlayCache.removeOverlaysForBatchId(e, r, t))).next((() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e, r))).next((() => n.localDocuments.getDocuments(e, r)));
            }));
        }
        /**
 * Returns the largest (latest) batch id in mutation queue that is pending
 * server response.
 *
 * Returns `BATCHID_UNKNOWN` if the queue is empty.
 */ (r.localStore, t);
        // The local store may or may not be able to apply the write result and
        // raise events immediately (depending on whether the watcher is caught up),
        // so we raise user callbacks first so that they consistently happen before
        // listen events.
                __PRIVATE_processUserCallback(r, t, n), __PRIVATE_triggerPendingWritesCallbacks(r, t), 
        r.sharedClientState.updateMutationState(t, "rejected", n), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r, e);
    } catch (n) {
        await __PRIVATE_ignoreIfPrimaryLeaseLoss(n);
    }
}

/**
 * Registers a user callback that resolves when all pending mutations at the moment of calling
 * are acknowledged .
 */ async function __PRIVATE_syncEngineRegisterPendingWritesCallback(e, t) {
    const n = __PRIVATE_debugCast(e);
    __PRIVATE_canUseNetwork(n.remoteStore) || __PRIVATE_logDebug("SyncEngine", "The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");
    try {
        const e = await function __PRIVATE_localStoreGetHighestUnacknowledgedBatchId(e) {
            const t = __PRIVATE_debugCast(e);
            return t.persistence.runTransaction("Get highest unacknowledged batch id", "readonly", (e => t.mutationQueue.getHighestUnacknowledgedBatchId(e)));
        }(n.localStore);
        if (-1 === e) 
        // Trigger the callback right away if there is no pending writes at the moment.
        return void t.resolve();
        const r = n.ba.get(e) || [];
        r.push(t), n.ba.set(e, r);
    } catch (e) {
        const n = __PRIVATE_wrapInUserErrorIfRecoverable(e, "Initialization of waitForPendingWrites() operation failed");
        t.reject(n);
    }
}

/**
 * Triggers the callbacks that are waiting for this batch id to get acknowledged by server,
 * if there are any.
 */ function __PRIVATE_triggerPendingWritesCallbacks(e, t) {
    (e.ba.get(t) || []).forEach((e => {
        e.resolve();
    })), e.ba.delete(t);
}

/** Reject all outstanding callbacks waiting for pending writes to complete. */ function __PRIVATE_processUserCallback(e, t, n) {
    const r = __PRIVATE_debugCast(e);
    let i = r.Sa[r.currentUser.toKey()];
    // NOTE: Mutations restored from persistence won't have callbacks, so it's
    // okay for there to be no callback for this ID.
        if (i) {
        const e = i.get(t);
        e && (n ? e.reject(n) : e.resolve(), i = i.remove(t)), r.Sa[r.currentUser.toKey()] = i;
    }
}

function __PRIVATE_removeAndCleanupTarget(e, t, n = null) {
    e.sharedClientState.removeLocalQueryTarget(t);
    for (const r of e.fa.get(t)) e.ma.delete(r), n && e.Va.Fa(r, n);
    if (e.fa.delete(t), e.isPrimaryClient) {
        e.wa.Rr(t).forEach((t => {
            e.wa.containsKey(t) || 
            // We removed the last reference for this key
            __PRIVATE_removeLimboTarget(e, t);
        }));
    }
}

function __PRIVATE_removeLimboTarget(e, t) {
    e.ga.delete(t.path.canonicalString());
    // It's possible that the target already got removed because the query failed. In that case,
    // the key won't exist in `limboTargetsByKey`. Only do the cleanup if we still have the target.
    const n = e.pa.get(t);
    null !== n && (__PRIVATE_remoteStoreUnlisten(e.remoteStore, n), e.pa = e.pa.remove(t), 
    e.ya.delete(n), __PRIVATE_pumpEnqueuedLimboResolutions(e));
}

function __PRIVATE_updateTrackedLimbos(e, t, n) {
    for (const r of n) if (r instanceof __PRIVATE_AddedLimboDocument) e.wa.addReference(r.key, t), 
    __PRIVATE_trackLimboChange(e, r); else if (r instanceof __PRIVATE_RemovedLimboDocument) {
        __PRIVATE_logDebug("SyncEngine", "Document no longer in limbo: " + r.key), e.wa.removeReference(r.key, t);
        e.wa.containsKey(r.key) || 
        // We removed the last reference for this key
        __PRIVATE_removeLimboTarget(e, r.key);
    } else fail();
}

function __PRIVATE_trackLimboChange(e, t) {
    const n = t.key, r = n.path.canonicalString();
    e.pa.get(n) || e.ga.has(r) || (__PRIVATE_logDebug("SyncEngine", "New document in limbo: " + n), 
    e.ga.add(r), __PRIVATE_pumpEnqueuedLimboResolutions(e));
}

/**
 * Starts listens for documents in limbo that are enqueued for resolution,
 * subject to a maximum number of concurrent resolutions.
 *
 * Without bounding the number of concurrent resolutions, the server can fail
 * with "resource exhausted" errors which can lead to pathological client
 * behavior as seen in https://github.com/firebase/firebase-js-sdk/issues/2683.
 */ function __PRIVATE_pumpEnqueuedLimboResolutions(e) {
    for (;e.ga.size > 0 && e.pa.size < e.maxConcurrentLimboResolutions; ) {
        const t = e.ga.values().next().value;
        e.ga.delete(t);
        const n = new DocumentKey(ResourcePath.fromString(t)), r = e.Da.next();
        e.ya.set(r, new LimboResolution(n)), e.pa = e.pa.insert(n, r), __PRIVATE_remoteStoreListen(e.remoteStore, new TargetData(__PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(n.path)), r, "TargetPurposeLimboResolution" /* TargetPurpose.LimboResolution */ , __PRIVATE_ListenSequence._e));
    }
}

async function __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(e, t, n) {
    const r = __PRIVATE_debugCast(e), i = [], s = [], o = [];
    r.ma.isEmpty() || (r.ma.forEach(((e, _) => {
        o.push(r.va(_, t, n).then((e => {
            // Update views if there are actual changes.
            if (
            // If there are changes, or we are handling a global snapshot, notify
            // secondary clients to update query state.
            (e || n) && r.isPrimaryClient && r.sharedClientState.updateQueryState(_.targetId, (null == e ? void 0 : e.fromCache) ? "not-current" : "current"), 
            e) {
                i.push(e);
                const t = __PRIVATE_LocalViewChanges.Qi(_.targetId, e);
                s.push(t);
            }
        })));
    })), await Promise.all(o), r.Va.a_(i), await async function __PRIVATE_localStoreNotifyLocalViewChanges(e, t) {
        const n = __PRIVATE_debugCast(e);
        try {
            await n.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (e => PersistencePromise.forEach(t, (t => PersistencePromise.forEach(t.ki, (r => n.persistence.referenceDelegate.addReference(e, t.targetId, r))).next((() => PersistencePromise.forEach(t.qi, (r => n.persistence.referenceDelegate.removeReference(e, t.targetId, r)))))))));
        } catch (e) {
            if (!__PRIVATE_isIndexedDbTransactionError(e)) throw e;
            // If `notifyLocalViewChanges` fails, we did not advance the sequence
            // number for the documents that were included in this transaction.
            // This might trigger them to be deleted earlier than they otherwise
            // would have, but it should not invalidate the integrity of the data.
            __PRIVATE_logDebug("LocalStore", "Failed to update sequence numbers: " + e);
        }
        for (const e of t) {
            const t = e.targetId;
            if (!e.fromCache) {
                const e = n.ts.get(t), r = e.snapshotVersion, i = e.withLastLimboFreeSnapshotVersion(r);
                // Advance the last limbo free snapshot version
                                n.ts = n.ts.insert(t, i);
            }
        }
    }(r.localStore, s));
}

async function __PRIVATE_syncEngineHandleCredentialChange(e, t) {
    const n = __PRIVATE_debugCast(e);
    if (!n.currentUser.isEqual(t)) {
        __PRIVATE_logDebug("SyncEngine", "User change. New user:", t.toKey());
        const e = await __PRIVATE_localStoreHandleUserChange(n.localStore, t);
        n.currentUser = t, 
        // Fails tasks waiting for pending writes requested by previous user.
        function __PRIVATE_rejectOutstandingPendingWritesCallbacks(e, t) {
            e.ba.forEach((e => {
                e.forEach((e => {
                    e.reject(new FirestoreError(v.CANCELLED, t));
                }));
            })), e.ba.clear();
        }(n, "'waitForPendingWrites' promise is rejected due to a user change."), 
        // TODO(b/114226417): Consider calling this only in the primary tab.
        n.sharedClientState.handleUserChange(t, e.removedBatchIds, e.addedBatchIds), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e._s);
    }
}

function __PRIVATE_syncEngineGetRemoteKeysForTarget(e, t) {
    const n = __PRIVATE_debugCast(e), r = n.ya.get(t);
    if (r && r.Ra) return __PRIVATE_documentKeySet().add(r.key);
    {
        let e = __PRIVATE_documentKeySet();
        const r = n.fa.get(t);
        if (!r) return e;
        for (const t of r) {
            const r = n.ma.get(t);
            e = e.unionWith(r.view.ua);
        }
        return e;
    }
}

/**
 * Reconcile the list of synced documents in an existing view with those
 * from persistence.
 */ async function __PRIVATE_synchronizeViewAndComputeSnapshot(e, t) {
    const n = __PRIVATE_debugCast(e), r = await __PRIVATE_localStoreExecuteQuery(n.localStore, t.query, 
    /* usePreviousResults= */ !0), i = t.view.da(r);
    return n.isPrimaryClient && __PRIVATE_updateTrackedLimbos(n, t.targetId, i.Ta), 
    i;
}

/**
 * Retrieves newly changed documents from remote document cache and raises
 * snapshots if needed.
 */
// PORTING NOTE: Multi-Tab only.
async function __PRIVATE_syncEngineSynchronizeWithChangedDocuments(e, t) {
    const n = __PRIVATE_debugCast(e);
    return __PRIVATE_localStoreGetNewDocumentChanges(n.localStore, t).then((e => __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e)));
}

/** Applies a mutation state to an existing batch.  */
// PORTING NOTE: Multi-Tab only.
async function __PRIVATE_syncEngineApplyBatchState(e, t, n, r) {
    const i = __PRIVATE_debugCast(e), s = await function __PRIVATE_localStoreLookupMutationDocuments(e, t) {
        const n = __PRIVATE_debugCast(e), r = __PRIVATE_debugCast(n.mutationQueue);
        return n.persistence.runTransaction("Lookup mutation documents", "readonly", (e => r.Cn(e, t).next((t => t ? n.localDocuments.getDocuments(e, t) : PersistencePromise.resolve(null)))));
    }
    // PORTING NOTE: Multi-Tab only.
    (i.localStore, t);
    null !== s ? ("pending" === n ? 
    // If we are the primary client, we need to send this write to the
    // backend. Secondary clients will ignore these writes since their remote
    // connection is disabled.
    await __PRIVATE_fillWritePipeline(i.remoteStore) : "acknowledged" === n || "rejected" === n ? (
    // NOTE: Both these methods are no-ops for batches that originated from
    // other clients.
    __PRIVATE_processUserCallback(i, t, r || null), __PRIVATE_triggerPendingWritesCallbacks(i, t), 
    function __PRIVATE_localStoreRemoveCachedMutationBatchMetadata(e, t) {
        __PRIVATE_debugCast(__PRIVATE_debugCast(e).mutationQueue).Fn(t);
    }
    // PORTING NOTE: Multi-Tab only.
    (i.localStore, t)) : fail(), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(i, s)) : 
    // A throttled tab may not have seen the mutation before it was completed
    // and removed from the mutation queue, in which case we won't have cached
    // the affected documents. In this case we can safely ignore the update
    // since that means we didn't apply the mutation locally at all (if we
    // had, we would have cached the affected documents), and so we will just
    // see any resulting document changes via normal remote document updates
    // as applicable.
    __PRIVATE_logDebug("SyncEngine", "Cannot apply mutation batch with id: " + t);
}

/** Applies a query target change from a different tab. */
// PORTING NOTE: Multi-Tab only.
async function __PRIVATE_syncEngineApplyPrimaryState(e, t) {
    const n = __PRIVATE_debugCast(e);
    if (__PRIVATE_ensureWatchCallbacks(n), __PRIVATE_syncEngineEnsureWriteCallbacks(n), 
    !0 === t && !0 !== n.Ca) {
        // Secondary tabs only maintain Views for their local listeners and the
        // Views internal state may not be 100% populated (in particular
        // secondary tabs don't track syncedDocuments, the set of documents the
        // server considers to be in the target). So when a secondary becomes
        // primary, we need to need to make sure that all views for all targets
        // match the state on disk.
        const e = n.sharedClientState.getAllActiveQueryTargets(), t = await __PRIVATE_synchronizeQueryViewsAndRaiseSnapshots(n, e.toArray());
        n.Ca = !0, await __PRIVATE_remoteStoreApplyPrimaryState(n.remoteStore, !0);
        for (const e of t) __PRIVATE_remoteStoreListen(n.remoteStore, e);
    } else if (!1 === t && !1 !== n.Ca) {
        const e = [];
        let t = Promise.resolve();
        n.fa.forEach(((r, i) => {
            n.sharedClientState.isLocalQueryTarget(i) ? e.push(i) : t = t.then((() => (__PRIVATE_removeAndCleanupTarget(n, i), 
            __PRIVATE_localStoreReleaseTarget(n.localStore, i, 
            /*keepPersistedTargetData=*/ !0)))), __PRIVATE_remoteStoreUnlisten(n.remoteStore, i);
        })), await t, await __PRIVATE_synchronizeQueryViewsAndRaiseSnapshots(n, e), 
        // PORTING NOTE: Multi-Tab only.
        function __PRIVATE_resetLimboDocuments(e) {
            const t = __PRIVATE_debugCast(e);
            t.ya.forEach(((e, n) => {
                __PRIVATE_remoteStoreUnlisten(t.remoteStore, n);
            })), t.wa.Vr(), t.ya = new Map, t.pa = new SortedMap(DocumentKey.comparator);
        }
        /**
 * Reconcile the query views of the provided query targets with the state from
 * persistence. Raises snapshots for any changes that affect the local
 * client and returns the updated state of all target's query data.
 *
 * @param syncEngine - The sync engine implementation
 * @param targets - the list of targets with views that need to be recomputed
 * @param transitionToPrimary - `true` iff the tab transitions from a secondary
 * tab to a primary tab
 */
        // PORTING NOTE: Multi-Tab only.
        (n), n.Ca = !1, await __PRIVATE_remoteStoreApplyPrimaryState(n.remoteStore, !1);
    }
}

async function __PRIVATE_synchronizeQueryViewsAndRaiseSnapshots(e, t, n) {
    const r = __PRIVATE_debugCast(e), i = [], s = [];
    for (const e of t) {
        let t;
        const n = r.fa.get(e);
        if (n && 0 !== n.length) {
            // For queries that have a local View, we fetch their current state
            // from LocalStore (as the resume token and the snapshot version
            // might have changed) and reconcile their views with the persisted
            // state (the list of syncedDocuments may have gotten out of sync).
            t = await __PRIVATE_localStoreAllocateTarget(r.localStore, __PRIVATE_queryToTarget(n[0]));
            for (const e of n) {
                const t = r.ma.get(e), n = await __PRIVATE_synchronizeViewAndComputeSnapshot(r, t);
                n.snapshot && s.push(n.snapshot);
            }
        } else {
            // For queries that never executed on this client, we need to
            // allocate the target in LocalStore and initialize a new View.
            const n = await __PRIVATE_localStoreGetCachedTarget(r.localStore, e);
            t = await __PRIVATE_localStoreAllocateTarget(r.localStore, n), await __PRIVATE_initializeViewAndComputeSnapshot(r, __PRIVATE_synthesizeTargetToQuery(n), e, 
            /*current=*/ !1, t.resumeToken);
        }
        i.push(t);
    }
    return r.Va.a_(s), i;
}

/**
 * Creates a `Query` object from the specified `Target`. There is no way to
 * obtain the original `Query`, so we synthesize a `Query` from the `Target`
 * object.
 *
 * The synthesized result might be different from the original `Query`, but
 * since the synthesized `Query` should return the same results as the
 * original one (only the presentation of results might differ), the potential
 * difference will not cause issues.
 */
// PORTING NOTE: Multi-Tab only.
function __PRIVATE_synthesizeTargetToQuery(e) {
    return __PRIVATE_newQuery(e.path, e.collectionGroup, e.orderBy, e.filters, e.limit, "F" /* LimitType.First */ , e.startAt, e.endAt);
}

/** Returns the IDs of the clients that are currently active. */
// PORTING NOTE: Multi-Tab only.
function __PRIVATE_syncEngineGetActiveClients(e) {
    return function __PRIVATE_localStoreGetActiveClients(e) {
        return __PRIVATE_debugCast(__PRIVATE_debugCast(e).persistence).Bi();
    }(__PRIVATE_debugCast(e).localStore);
}

/** Applies a query target change from a different tab. */
// PORTING NOTE: Multi-Tab only.
async function __PRIVATE_syncEngineApplyTargetState(e, t, n, r) {
    const i = __PRIVATE_debugCast(e);
    if (i.Ca) 
    // If we receive a target state notification via WebStorage, we are
    // either already secondary or another tab has taken the primary lease.
    return void __PRIVATE_logDebug("SyncEngine", "Ignoring unexpected query state notification.");
    const s = i.fa.get(t);
    if (s && s.length > 0) switch (n) {
      case "current":
      case "not-current":
        {
            const e = await __PRIVATE_localStoreGetNewDocumentChanges(i.localStore, __PRIVATE_queryCollectionGroup(s[0])), r = RemoteEvent.createSynthesizedRemoteEventForCurrentChange(t, "current" === n, ByteString.EMPTY_BYTE_STRING);
            await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(i, e, r);
            break;
        }

      case "rejected":
        await __PRIVATE_localStoreReleaseTarget(i.localStore, t, 
        /* keepPersistedTargetData */ !0), __PRIVATE_removeAndCleanupTarget(i, t, r);
        break;

      default:
        fail();
    }
}

/** Adds or removes Watch targets for queries from different tabs. */ async function __PRIVATE_syncEngineApplyActiveTargetsChange(e, t, n) {
    const r = __PRIVATE_ensureWatchCallbacks(e);
    if (r.Ca) {
        for (const e of t) {
            if (r.fa.has(e)) {
                // A target might have been added in a previous attempt
                __PRIVATE_logDebug("SyncEngine", "Adding an already active target " + e);
                continue;
            }
            const t = await __PRIVATE_localStoreGetCachedTarget(r.localStore, e), n = await __PRIVATE_localStoreAllocateTarget(r.localStore, t);
            await __PRIVATE_initializeViewAndComputeSnapshot(r, __PRIVATE_synthesizeTargetToQuery(t), n.targetId, 
            /*current=*/ !1, n.resumeToken), __PRIVATE_remoteStoreListen(r.remoteStore, n);
        }
        for (const e of n) 
        // Check that the target is still active since the target might have been
        // removed if it has been rejected by the backend.
        r.fa.has(e) && 
        // Release queries that are still active.
        await __PRIVATE_localStoreReleaseTarget(r.localStore, e, 
        /* keepPersistedTargetData */ !1).then((() => {
            __PRIVATE_remoteStoreUnlisten(r.remoteStore, e), __PRIVATE_removeAndCleanupTarget(r, e);
        })).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
    }
}

function __PRIVATE_ensureWatchCallbacks(e) {
    const t = __PRIVATE_debugCast(e);
    return t.remoteStore.remoteSyncer.applyRemoteEvent = __PRIVATE_syncEngineApplyRemoteEvent.bind(null, t), 
    t.remoteStore.remoteSyncer.getRemoteKeysForTarget = __PRIVATE_syncEngineGetRemoteKeysForTarget.bind(null, t), 
    t.remoteStore.remoteSyncer.rejectListen = __PRIVATE_syncEngineRejectListen.bind(null, t), 
    t.Va.a_ = __PRIVATE_eventManagerOnWatchChange.bind(null, t.eventManager), t.Va.Fa = __PRIVATE_eventManagerOnWatchError.bind(null, t.eventManager), 
    t;
}

function __PRIVATE_syncEngineEnsureWriteCallbacks(e) {
    const t = __PRIVATE_debugCast(e);
    return t.remoteStore.remoteSyncer.applySuccessfulWrite = __PRIVATE_syncEngineApplySuccessfulWrite.bind(null, t), 
    t.remoteStore.remoteSyncer.rejectFailedWrite = __PRIVATE_syncEngineRejectFailedWrite.bind(null, t), 
    t;
}

/**
 * Loads a Firestore bundle into the SDK. The returned promise resolves when
 * the bundle finished loading.
 *
 * @param syncEngine - SyncEngine to use.
 * @param bundleReader - Bundle to load into the SDK.
 * @param task - LoadBundleTask used to update the loading progress to public API.
 */ function __PRIVATE_syncEngineLoadBundle(e, t, n) {
    const r = __PRIVATE_debugCast(e);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (
    /** Loads a bundle and returns the list of affected collection groups. */
    async function __PRIVATE_loadBundleImpl(e, t, n) {
        try {
            const r = await t.getMetadata();
            if (await function __PRIVATE_localStoreHasNewerBundle(e, t) {
                const n = __PRIVATE_debugCast(e), r = __PRIVATE_fromVersion(t.createTime);
                return n.persistence.runTransaction("hasNewerBundle", "readonly", (e => n.Kr.getBundleMetadata(e, t.id))).then((e => !!e && e.createTime.compareTo(r) >= 0));
            }
            /**
 * Saves the given `BundleMetadata` to local persistence.
 */ (e.localStore, r)) return await t.close(), n._completeWith(function __PRIVATE_bundleSuccessProgress(e) {
                return {
                    taskState: "Success",
                    documentsLoaded: e.totalDocuments,
                    bytesLoaded: e.totalBytes,
                    totalDocuments: e.totalDocuments,
                    totalBytes: e.totalBytes
                };
            }(r)), Promise.resolve(new Set);
            n._updateProgress(__PRIVATE_bundleInitialProgress(r));
            const i = new __PRIVATE_BundleLoader(r, e.localStore, t.serializer);
            let s = await t.Ma();
            for (;s; ) {
                const e = await i.ea(s);
                e && n._updateProgress(e), s = await t.Ma();
            }
            const o = await i.complete();
            return await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(e, o.ra, 
            /* remoteEvent */ void 0), 
            // Save metadata, so loading the same bundle will skip.
            await function __PRIVATE_localStoreSaveBundle(e, t) {
                const n = __PRIVATE_debugCast(e);
                return n.persistence.runTransaction("Save bundle", "readwrite", (e => n.Kr.saveBundleMetadata(e, t)));
            }
            /**
 * Returns a promise of a `NamedQuery` associated with given query name. Promise
 * resolves to undefined if no persisted data can be found.
 */ (e.localStore, r), n._completeWith(o.progress), Promise.resolve(o.na);
        } catch (e) {
            return __PRIVATE_logWarn("SyncEngine", `Loading bundle failed with ${e}`), n._failWith(e), 
            Promise.resolve(new Set);
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
 * Provides all components needed for Firestore with in-memory persistence.
 * Uses EagerGC garbage collection.
 */)(r, t, n).then((e => {
        r.sharedClientState.notifyBundleLoaded(e);
    }));
}

class MemoryOfflineComponentProvider {
    constructor() {
        this.synchronizeTabs = !1;
    }
    async initialize(e) {
        this.serializer = __PRIVATE_newSerializer(e.databaseInfo.databaseId), this.sharedClientState = this.createSharedClientState(e), 
        this.persistence = this.createPersistence(e), await this.persistence.start(), this.localStore = this.createLocalStore(e), 
        this.gcScheduler = this.createGarbageCollectionScheduler(e, this.localStore), this.indexBackfillerScheduler = this.createIndexBackfillerScheduler(e, this.localStore);
    }
    createGarbageCollectionScheduler(e, t) {
        return null;
    }
    createIndexBackfillerScheduler(e, t) {
        return null;
    }
    createLocalStore(e) {
        return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine, e.initialUser, this.serializer);
    }
    createPersistence(e) {
        return new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.jr, this.serializer);
    }
    createSharedClientState(e) {
        return new __PRIVATE_MemorySharedClientState;
    }
    async terminate() {
        this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), 
        await this.persistence.shutdown();
    }
}

class __PRIVATE_LruGcMemoryOfflineComponentProvider extends MemoryOfflineComponentProvider {
    constructor(e) {
        super(), this.cacheSizeBytes = e;
    }
    createGarbageCollectionScheduler(e, t) {
        __PRIVATE_hardAssert(this.persistence.referenceDelegate instanceof __PRIVATE_MemoryLruDelegate);
        const n = this.persistence.referenceDelegate.garbageCollector;
        return new __PRIVATE_LruScheduler(n, e.asyncQueue, t);
    }
    createPersistence(e) {
        const t = void 0 !== this.cacheSizeBytes ? LruParams.withCacheSize(this.cacheSizeBytes) : LruParams.DEFAULT;
        return new __PRIVATE_MemoryPersistence((e => __PRIVATE_MemoryLruDelegate.jr(e, t)), this.serializer);
    }
}

/**
 * Provides all components needed for Firestore with IndexedDB persistence.
 */ class __PRIVATE_IndexedDbOfflineComponentProvider extends MemoryOfflineComponentProvider {
    constructor(e, t, n) {
        super(), this.xa = e, this.cacheSizeBytes = t, this.forceOwnership = n, this.synchronizeTabs = !1;
    }
    async initialize(e) {
        await super.initialize(e), await this.xa.initialize(this, e), 
        // Enqueue writes from a previous session
        await __PRIVATE_syncEngineEnsureWriteCallbacks(this.xa.syncEngine), await __PRIVATE_fillWritePipeline(this.xa.remoteStore), 
        // NOTE: This will immediately call the listener, so we make sure to
        // set it after localStore / remoteStore are started.
        await this.persistence.mi((() => (this.gcScheduler && !this.gcScheduler.started && this.gcScheduler.start(), 
        this.indexBackfillerScheduler && !this.indexBackfillerScheduler.started && this.indexBackfillerScheduler.start(), 
        Promise.resolve())));
    }
    createLocalStore(e) {
        return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine, e.initialUser, this.serializer);
    }
    createGarbageCollectionScheduler(e, t) {
        const n = this.persistence.referenceDelegate.garbageCollector;
        return new __PRIVATE_LruScheduler(n, e.asyncQueue, t);
    }
    createIndexBackfillerScheduler(e, t) {
        const n = new __PRIVATE_IndexBackfiller(t, this.persistence);
        return new __PRIVATE_IndexBackfillerScheduler(e.asyncQueue, n);
    }
    createPersistence(e) {
        const t = __PRIVATE_indexedDbStoragePrefix(e.databaseInfo.databaseId, e.databaseInfo.persistenceKey), n = void 0 !== this.cacheSizeBytes ? LruParams.withCacheSize(this.cacheSizeBytes) : LruParams.DEFAULT;
        return new __PRIVATE_IndexedDbPersistence(this.synchronizeTabs, t, e.clientId, n, e.asyncQueue, __PRIVATE_getWindow(), getDocument(), this.serializer, this.sharedClientState, !!this.forceOwnership);
    }
    createSharedClientState(e) {
        return new __PRIVATE_MemorySharedClientState;
    }
}

/**
 * Provides all components needed for Firestore with multi-tab IndexedDB
 * persistence.
 *
 * In the legacy client, this provider is used to provide both multi-tab and
 * non-multi-tab persistence since we cannot tell at build time whether
 * `synchronizeTabs` will be enabled.
 */ class __PRIVATE_MultiTabOfflineComponentProvider extends __PRIVATE_IndexedDbOfflineComponentProvider {
    constructor(e, t) {
        super(e, t, /* forceOwnership= */ !1), this.xa = e, this.cacheSizeBytes = t, this.synchronizeTabs = !0;
    }
    async initialize(e) {
        await super.initialize(e);
        const t = this.xa.syncEngine;
        this.sharedClientState instanceof __PRIVATE_WebStorageSharedClientState && (this.sharedClientState.syncEngine = {
            Ys: __PRIVATE_syncEngineApplyBatchState.bind(null, t),
            Zs: __PRIVATE_syncEngineApplyTargetState.bind(null, t),
            Xs: __PRIVATE_syncEngineApplyActiveTargetsChange.bind(null, t),
            Bi: __PRIVATE_syncEngineGetActiveClients.bind(null, t),
            Js: __PRIVATE_syncEngineSynchronizeWithChangedDocuments.bind(null, t)
        }, await this.sharedClientState.start()), 
        // NOTE: This will immediately call the listener, so we make sure to
        // set it after localStore / remoteStore are started.
        await this.persistence.mi((async e => {
            await __PRIVATE_syncEngineApplyPrimaryState(this.xa.syncEngine, e), this.gcScheduler && (e && !this.gcScheduler.started ? this.gcScheduler.start() : e || this.gcScheduler.stop()), 
            this.indexBackfillerScheduler && (e && !this.indexBackfillerScheduler.started ? this.indexBackfillerScheduler.start() : e || this.indexBackfillerScheduler.stop());
        }));
    }
    createSharedClientState(e) {
        const t = __PRIVATE_getWindow();
        if (!__PRIVATE_WebStorageSharedClientState.D(t)) throw new FirestoreError(v.UNIMPLEMENTED, "IndexedDB persistence is only available on platforms that support LocalStorage.");
        const n = __PRIVATE_indexedDbStoragePrefix(e.databaseInfo.databaseId, e.databaseInfo.persistenceKey);
        return new __PRIVATE_WebStorageSharedClientState(t, e.asyncQueue, n, e.clientId, e.initialUser);
    }
}

/**
 * Initializes and wires the components that are needed to interface with the
 * network.
 */ class OnlineComponentProvider {
    async initialize(e, t) {
        this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, 
        this.datastore = this.createDatastore(t), this.remoteStore = this.createRemoteStore(t), 
        this.eventManager = this.createEventManager(t), this.syncEngine = this.createSyncEngine(t, 
        /* startAsPrimary=*/ !e.synchronizeTabs), this.sharedClientState.onlineStateHandler = e => __PRIVATE_syncEngineApplyOnlineStateChange(this.syncEngine, e, 1 /* OnlineStateSource.SharedClientState */), 
        this.remoteStore.remoteSyncer.handleCredentialChange = __PRIVATE_syncEngineHandleCredentialChange.bind(null, this.syncEngine), 
        await __PRIVATE_remoteStoreApplyPrimaryState(this.remoteStore, this.syncEngine.isPrimaryClient));
    }
    createEventManager(e) {
        return function __PRIVATE_newEventManager() {
            return new __PRIVATE_EventManagerImpl;
        }();
    }
    createDatastore(e) {
        const t = __PRIVATE_newSerializer(e.databaseInfo.databaseId), n = function __PRIVATE_newConnection(e) {
            return new __PRIVATE_WebChannelConnection(e);
        }
        /** Return the Platform-specific connectivity monitor. */ (e.databaseInfo);
        return function __PRIVATE_newDatastore(e, t, n, r) {
            return new __PRIVATE_DatastoreImpl(e, t, n, r);
        }(e.authCredentials, e.appCheckCredentials, n, t);
    }
    createRemoteStore(e) {
        return function __PRIVATE_newRemoteStore(e, t, n, r, i) {
            return new __PRIVATE_RemoteStoreImpl(e, t, n, r, i);
        }
        /** Re-enables the network. Idempotent. */ (this.localStore, this.datastore, e.asyncQueue, (e => __PRIVATE_syncEngineApplyOnlineStateChange(this.syncEngine, e, 0 /* OnlineStateSource.RemoteStore */)), function __PRIVATE_newConnectivityMonitor() {
            return __PRIVATE_BrowserConnectivityMonitor.D() ? new __PRIVATE_BrowserConnectivityMonitor : new __PRIVATE_NoopConnectivityMonitor;
        }());
    }
    createSyncEngine(e, t) {
        return function __PRIVATE_newSyncEngine(e, t, n, 
        // PORTING NOTE: Manages state synchronization in multi-tab environments.
        r, i, s, o) {
            const _ = new __PRIVATE_SyncEngineImpl(e, t, n, r, i, s);
            return o && (_.Ca = !0), _;
        }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
    }
    terminate() {
        return async function __PRIVATE_remoteStoreShutdown(e) {
            const t = __PRIVATE_debugCast(e);
            __PRIVATE_logDebug("RemoteStore", "RemoteStore shutting down."), t.C_.add(5 /* OfflineCause.Shutdown */), 
            await __PRIVATE_disableNetworkInternal(t), t.F_.shutdown(), 
            // Set the OnlineState to Unknown (rather than Offline) to avoid potentially
            // triggering spurious listener events with cached data, etc.
            t.M_.set("Unknown" /* OnlineState.Unknown */);
        }(this.remoteStore);
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
 * How many bytes to read each time when `ReadableStreamReader.read()` is
 * called. Only applicable for byte streams that we control (e.g. those backed
 * by an UInt8Array).
 */
/**
 * Builds a `ByteStreamReader` from a UInt8Array.
 * @param source - The data source to use.
 * @param bytesPerRead - How many bytes each `read()` from the returned reader
 *        will read.
 */
function __PRIVATE_toByteStreamReaderHelper(e, t = 10240) {
    let n = 0;
    // The TypeScript definition for ReadableStreamReader changed. We use
    // `any` here to allow this code to compile with different versions.
    // See https://github.com/microsoft/TypeScript/issues/42970
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async read() {
            if (n < e.byteLength) {
                const r = {
                    value: e.slice(n, n + t),
                    done: !1
                };
                return n += t, r;
            }
            return {
                done: !0
            };
        },
        async cancel() {},
        releaseLock() {},
        closed: Promise.resolve()
    };
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
 * On web, a `ReadableStream` is wrapped around by a `ByteStreamReader`.
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
/*
 * A wrapper implementation of Observer<T> that will dispatch events
 * asynchronously. To allow immediate silencing, a mute call is added which
 * causes events scheduled to no longer be raised.
 */
class __PRIVATE_AsyncObserver {
    constructor(e) {
        this.observer = e, 
        /**
         * When set to true, will not raise future events. Necessary to deal with
         * async detachment of listener.
         */
        this.muted = !1;
    }
    next(e) {
        this.observer.next && this.Oa(this.observer.next, e);
    }
    error(e) {
        this.observer.error ? this.Oa(this.observer.error, e) : __PRIVATE_logError("Uncaught Error in snapshot listener:", e.toString());
    }
    Na() {
        this.muted = !0;
    }
    Oa(e, t) {
        this.muted || setTimeout((() => {
            this.muted || e(t);
        }), 0);
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
 * A class representing a bundle.
 *
 * Takes a bundle stream or buffer, and presents abstractions to read bundled
 * elements out of the underlying content.
 */ class __PRIVATE_BundleReaderImpl {
    constructor(
    /** The reader to read from underlying binary bundle data source. */
    e, t) {
        this.Ba = e, this.serializer = t, 
        /** Cached bundle metadata. */
        this.metadata = new __PRIVATE_Deferred, 
        /**
         * Internal buffer to hold bundle content, accumulating incomplete element
         * content.
         */
        this.buffer = new Uint8Array, this.La = function __PRIVATE_newTextDecoder() {
            return new TextDecoder("utf-8");
        }(), 
        // Read the metadata (which is the first element).
        this.ka().then((e => {
            e && e.Z_() ? this.metadata.resolve(e.Y_.metadata) : this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is\n             ${JSON.stringify(null == e ? void 0 : e.Y_)}`));
        }), (e => this.metadata.reject(e)));
    }
    close() {
        return this.Ba.cancel();
    }
    async getMetadata() {
        return this.metadata.promise;
    }
    async Ma() {
        // Makes sure metadata is read before proceeding.
        return await this.getMetadata(), this.ka();
    }
    /**
     * Reads from the head of internal buffer, and pulling more data from
     * underlying stream if a complete element cannot be found, until an
     * element(including the prefixed length and the JSON string) is found.
     *
     * Once a complete element is read, it is dropped from internal buffer.
     *
     * Returns either the bundled element, or null if we have reached the end of
     * the stream.
     */    async ka() {
        const e = await this.qa();
        if (null === e) return null;
        const t = this.La.decode(e), n = Number(t);
        isNaN(n) && this.Qa(`length string (${t}) is not valid number`);
        const r = await this.Ka(n);
        return new __PRIVATE_SizedBundleElement(JSON.parse(r), e.length + n);
    }
    /** First index of '{' from the underlying buffer. */    $a() {
        return this.buffer.findIndex((e => e === "{".charCodeAt(0)));
    }
    /**
     * Reads from the beginning of the internal buffer, until the first '{', and
     * return the content.
     *
     * If reached end of the stream, returns a null.
     */    async qa() {
        for (;this.$a() < 0; ) {
            if (await this.Ua()) break;
        }
        // Broke out of the loop because underlying stream is closed, and there
        // happens to be no more data to process.
                if (0 === this.buffer.length) return null;
        const e = this.$a();
        // Broke out of the loop because underlying stream is closed, but still
        // cannot find an open bracket.
                e < 0 && this.Qa("Reached the end of bundle when a length string is expected.");
        const t = this.buffer.slice(0, e);
        // Update the internal buffer to drop the read length.
                return this.buffer = this.buffer.slice(e), t;
    }
    /**
     * Reads from a specified position from the internal buffer, for a specified
     * number of bytes, pulling more data from the underlying stream if needed.
     *
     * Returns a string decoded from the read bytes.
     */    async Ka(e) {
        for (;this.buffer.length < e; ) {
            await this.Ua() && this.Qa("Reached the end of bundle when more is expected.");
        }
        const t = this.La.decode(this.buffer.slice(0, e));
        // Update the internal buffer to drop the read json string.
                return this.buffer = this.buffer.slice(e), t;
    }
    Qa(e) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        throw this.Ba.cancel(), new Error(`Invalid bundle format: ${e}`);
    }
    /**
     * Pulls more data from underlying stream to internal buffer.
     * Returns a boolean indicating whether the stream is finished.
     */    async Ua() {
        const e = await this.Ba.read();
        if (!e.done) {
            const t = new Uint8Array(this.buffer.length + e.value.length);
            t.set(this.buffer), t.set(e.value, this.buffer.length), this.buffer = t;
        }
        return e.done;
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
 * Internal transaction object responsible for accumulating the mutations to
 * perform and the base versions for any documents read.
 */
class Transaction$2 {
    constructor(e) {
        this.datastore = e, 
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
    async lookup(e) {
        if (this.ensureCommitNotCalled(), this.mutations.length > 0) throw new FirestoreError(v.INVALID_ARGUMENT, "Firestore transactions require all reads to be executed before all writes.");
        const t = await async function __PRIVATE_invokeBatchGetDocumentsRpc(e, t) {
            const n = __PRIVATE_debugCast(e), r = __PRIVATE_getEncodedDatabaseId(n.serializer) + "/documents", i = {
                documents: t.map((e => __PRIVATE_toName(n.serializer, e)))
            }, s = await n.Co("BatchGetDocuments", r, i, t.length), o = new Map;
            s.forEach((e => {
                const t = __PRIVATE_fromBatchGetDocumentsResponse(n.serializer, e);
                o.set(t.key.toString(), t);
            }));
            const _ = [];
            return t.forEach((e => {
                const t = o.get(e.toString());
                __PRIVATE_hardAssert(!!t), _.push(t);
            })), _;
        }(this.datastore, e);
        return t.forEach((e => this.recordVersion(e))), t;
    }
    set(e, t) {
        this.write(t.toMutation(e, this.precondition(e))), this.writtenDocs.add(e.toString());
    }
    update(e, t) {
        try {
            this.write(t.toMutation(e, this.preconditionForUpdate(e)));
        } catch (e) {
            this.lastWriteError = e;
        }
        this.writtenDocs.add(e.toString());
    }
    delete(e) {
        this.write(new __PRIVATE_DeleteMutation(e, this.precondition(e))), this.writtenDocs.add(e.toString());
    }
    async commit() {
        if (this.ensureCommitNotCalled(), this.lastWriteError) throw this.lastWriteError;
        const e = this.readVersions;
        // For each mutation, note that the doc was written.
                this.mutations.forEach((t => {
            e.delete(t.key.toString());
        })), 
        // For each document that was read but not written to, we want to perform
        // a `verify` operation.
        e.forEach(((e, t) => {
            const n = DocumentKey.fromPath(t);
            this.mutations.push(new __PRIVATE_VerifyMutation(n, this.precondition(n)));
        })), await async function __PRIVATE_invokeCommitRpc(e, t) {
            const n = __PRIVATE_debugCast(e), r = __PRIVATE_getEncodedDatabaseId(n.serializer) + "/documents", i = {
                writes: t.map((e => toMutation(n.serializer, e)))
            };
            await n.wo("Commit", r, i);
        }(this.datastore, this.mutations), this.committed = !0;
    }
    recordVersion(e) {
        let t;
        if (e.isFoundDocument()) t = e.version; else {
            if (!e.isNoDocument()) throw fail();
            // Represent a deleted doc using SnapshotVersion.min().
            t = SnapshotVersion.min();
        }
        const n = this.readVersions.get(e.key.toString());
        if (n) {
            if (!t.isEqual(n)) 
            // This transaction will fail no matter what.
            throw new FirestoreError(v.ABORTED, "Document version changed between two reads.");
        } else this.readVersions.set(e.key.toString(), t);
    }
    /**
     * Returns the version of this document when it was read in this transaction,
     * as a precondition, or no precondition if it was not read.
     */    precondition(e) {
        const t = this.readVersions.get(e.toString());
        return !this.writtenDocs.has(e.toString()) && t ? t.isEqual(SnapshotVersion.min()) ? Precondition.exists(!1) : Precondition.updateTime(t) : Precondition.none();
    }
    /**
     * Returns the precondition for a document if the operation is an update.
     */    preconditionForUpdate(e) {
        const t = this.readVersions.get(e.toString());
        // The first time a document is written, we want to take into account the
        // read time and existence
                if (!this.writtenDocs.has(e.toString()) && t) {
            if (t.isEqual(SnapshotVersion.min())) 
            // The document doesn't exist, so fail the transaction.
            // This has to be validated locally because you can't send a
            // precondition that a document does not exist without changing the
            // semantics of the backend write to be an insert. This is the reverse
            // of what we want, since we want to assert that the document doesn't
            // exist but then send the update and have it fail. Since we can't
            // express that to the backend, we have to validate locally.
            // Note: this can change once we can send separate verify writes in the
            // transaction.
            throw new FirestoreError(v.INVALID_ARGUMENT, "Can't update a document that doesn't exist.");
            // Document exists, base precondition on document update time.
                        return Precondition.updateTime(t);
        }
        // Document was not read, so we just use the preconditions for a blind
        // update.
        return Precondition.exists(!0);
    }
    write(e) {
        this.ensureCommitNotCalled(), this.mutations.push(e);
    }
    ensureCommitNotCalled() {}
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
/**
 * TransactionRunner encapsulates the logic needed to run and retry transactions
 * with backoff.
 */ class __PRIVATE_TransactionRunner {
    constructor(e, t, n, r, i) {
        this.asyncQueue = e, this.datastore = t, this.options = n, this.updateFunction = r, 
        this.deferred = i, this.Wa = n.maxAttempts, this.zo = new __PRIVATE_ExponentialBackoff(this.asyncQueue, "transaction_retry" /* TimerId.TransactionRetry */);
    }
    /** Runs the transaction and sets the result on deferred. */    run() {
        this.Wa -= 1, this.Ga();
    }
    Ga() {
        this.zo.ko((async () => {
            const e = new Transaction$2(this.datastore), t = this.za(e);
            t && t.then((t => {
                this.asyncQueue.enqueueAndForget((() => e.commit().then((() => {
                    this.deferred.resolve(t);
                })).catch((e => {
                    this.ja(e);
                }))));
            })).catch((e => {
                this.ja(e);
            }));
        }));
    }
    za(e) {
        try {
            const t = this.updateFunction(e);
            return !__PRIVATE_isNullOrUndefined(t) && t.catch && t.then ? t : (this.deferred.reject(Error("Transaction callback must return a Promise")), 
            null);
        } catch (e) {
            // Do not retry errors thrown by user provided updateFunction.
            return this.deferred.reject(e), null;
        }
    }
    ja(e) {
        this.Wa > 0 && this.Ha(e) ? (this.Wa -= 1, this.asyncQueue.enqueueAndForget((() => (this.Ga(), 
        Promise.resolve())))) : this.deferred.reject(e);
    }
    Ha(e) {
        if ("FirebaseError" === e.name) {
            // In transactions, the backend will fail outdated reads with FAILED_PRECONDITION and
            // non-matching document versions with ABORTED. These errors should be retried.
            const t = e.code;
            return "aborted" === t || "failed-precondition" === t || "already-exists" === t || !__PRIVATE_isPermanentError(t);
        }
        return !1;
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
 * FirestoreClient is a top-level class that constructs and owns all of the //
 * pieces of the client SDK architecture. It is responsible for creating the //
 * async queue that is shared by all of the other components in the system. //
 */
class FirestoreClient {
    constructor(e, t, 
    /**
     * Asynchronous queue responsible for all of our internal processing. When
     * we get incoming work from the user (via public API) or the network
     * (incoming GRPC messages), we should always schedule onto this queue.
     * This ensures all of our work is properly serialized (e.g. we don't
     * start processing a new operation while the previous one is waiting for
     * an async I/O to complete).
     */
    n, r) {
        this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = n, this.databaseInfo = r, 
        this.user = User.UNAUTHENTICATED, this.clientId = __PRIVATE_AutoId.newId(), this.authCredentialListener = () => Promise.resolve(), 
        this.appCheckCredentialListener = () => Promise.resolve(), this.authCredentials.start(n, (async e => {
            __PRIVATE_logDebug("FirestoreClient", "Received user=", e.uid), await this.authCredentialListener(e), 
            this.user = e;
        })), this.appCheckCredentials.start(n, (e => (__PRIVATE_logDebug("FirestoreClient", "Received new app check token=", e), 
        this.appCheckCredentialListener(e, this.user))));
    }
    async getConfiguration() {
        return {
            asyncQueue: this.asyncQueue,
            databaseInfo: this.databaseInfo,
            clientId: this.clientId,
            authCredentials: this.authCredentials,
            appCheckCredentials: this.appCheckCredentials,
            initialUser: this.user,
            maxConcurrentLimboResolutions: 100
        };
    }
    setCredentialChangeListener(e) {
        this.authCredentialListener = e;
    }
    setAppCheckTokenChangeListener(e) {
        this.appCheckCredentialListener = e;
    }
    /**
     * Checks that the client has not been terminated. Ensures that other methods on //
     * this class cannot be called after the client is terminated. //
     */    verifyNotTerminated() {
        if (this.asyncQueue.isShuttingDown) throw new FirestoreError(v.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    terminate() {
        this.asyncQueue.enterRestrictedMode();
        const e = new __PRIVATE_Deferred;
        return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async () => {
            try {
                this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), 
                // The credentials provider must be terminated after shutting down the
                // RemoteStore as it will prevent the RemoteStore from retrieving auth
                // tokens.
                this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
            } catch (t) {
                const n = __PRIVATE_wrapInUserErrorIfRecoverable(t, "Failed to shutdown persistence");
                e.reject(n);
            }
        })), e.promise;
    }
}

async function __PRIVATE_setOfflineComponentProvider(e, t) {
    e.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug("FirestoreClient", "Initializing OfflineComponentProvider");
    const n = await e.getConfiguration();
    await t.initialize(n);
    let r = n.initialUser;
    e.setCredentialChangeListener((async e => {
        r.isEqual(e) || (await __PRIVATE_localStoreHandleUserChange(t.localStore, e), r = e);
    })), 
    // When a user calls clearPersistence() in one client, all other clients
    // need to be terminated to allow the delete to succeed.
    t.persistence.setDatabaseDeletedListener((() => e.terminate())), e._offlineComponents = t;
}

async function __PRIVATE_setOnlineComponentProvider(e, t) {
    e.asyncQueue.verifyOperationInProgress();
    const n = await __PRIVATE_ensureOfflineComponents(e);
    __PRIVATE_logDebug("FirestoreClient", "Initializing OnlineComponentProvider");
    const r = await e.getConfiguration();
    await t.initialize(n, r), 
    // The CredentialChangeListener of the online component provider takes
    // precedence over the offline component provider.
    e.setCredentialChangeListener((e => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, e))), 
    e.setAppCheckTokenChangeListener(((e, n) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, n))), 
    e._onlineComponents = t;
}

/**
 * Decides whether the provided error allows us to gracefully disable
 * persistence (as opposed to crashing the client).
 */ function __PRIVATE_canFallbackFromIndexedDbError(e) {
    return "FirebaseError" === e.name ? e.code === v.FAILED_PRECONDITION || e.code === v.UNIMPLEMENTED : !("undefined" != typeof DOMException && e instanceof DOMException) || (
    // When the browser is out of quota we could get either quota exceeded
    // or an aborted error depending on whether the error happened during
    // schema migration.
    22 === e.code || 20 === e.code || 
    // Firefox Private Browsing mode disables IndexedDb and returns
    // INVALID_STATE for any usage.
    11 === e.code);
}

async function __PRIVATE_ensureOfflineComponents(e) {
    if (!e._offlineComponents) if (e._uninitializedComponentsProvider) {
        __PRIVATE_logDebug("FirestoreClient", "Using user provided OfflineComponentProvider");
        try {
            await __PRIVATE_setOfflineComponentProvider(e, e._uninitializedComponentsProvider._offline);
        } catch (t) {
            const n = t;
            if (!__PRIVATE_canFallbackFromIndexedDbError(n)) throw n;
            __PRIVATE_logWarn("Error using user provided cache. Falling back to memory cache: " + n), 
            await __PRIVATE_setOfflineComponentProvider(e, new MemoryOfflineComponentProvider);
        }
    } else __PRIVATE_logDebug("FirestoreClient", "Using default OfflineComponentProvider"), 
    await __PRIVATE_setOfflineComponentProvider(e, new MemoryOfflineComponentProvider);
    return e._offlineComponents;
}

async function __PRIVATE_ensureOnlineComponents(e) {
    return e._onlineComponents || (e._uninitializedComponentsProvider ? (__PRIVATE_logDebug("FirestoreClient", "Using user provided OnlineComponentProvider"), 
    await __PRIVATE_setOnlineComponentProvider(e, e._uninitializedComponentsProvider._online)) : (__PRIVATE_logDebug("FirestoreClient", "Using default OnlineComponentProvider"), 
    await __PRIVATE_setOnlineComponentProvider(e, new OnlineComponentProvider))), e._onlineComponents;
}

function __PRIVATE_getPersistence(e) {
    return __PRIVATE_ensureOfflineComponents(e).then((e => e.persistence));
}

function __PRIVATE_getLocalStore(e) {
    return __PRIVATE_ensureOfflineComponents(e).then((e => e.localStore));
}

function __PRIVATE_getRemoteStore(e) {
    return __PRIVATE_ensureOnlineComponents(e).then((e => e.remoteStore));
}

function __PRIVATE_getSyncEngine(e) {
    return __PRIVATE_ensureOnlineComponents(e).then((e => e.syncEngine));
}

function __PRIVATE_getDatastore(e) {
    return __PRIVATE_ensureOnlineComponents(e).then((e => e.datastore));
}

async function __PRIVATE_getEventManager(e) {
    const t = await __PRIVATE_ensureOnlineComponents(e), n = t.eventManager;
    return n.onListen = __PRIVATE_syncEngineListen.bind(null, t.syncEngine), n.onUnlisten = __PRIVATE_syncEngineUnlisten.bind(null, t.syncEngine), 
    n;
}

/** Enables the network connection and re-enqueues all pending operations. */ function __PRIVATE_firestoreClientEnableNetwork(e) {
    return e.asyncQueue.enqueue((async () => {
        const t = await __PRIVATE_getPersistence(e), n = await __PRIVATE_getRemoteStore(e);
        return t.setNetworkEnabled(!0), function __PRIVATE_remoteStoreEnableNetwork(e) {
            const t = __PRIVATE_debugCast(e);
            return t.C_.delete(0 /* OfflineCause.UserDisabled */), __PRIVATE_enableNetworkInternal(t);
        }(n);
    }));
}

/** Disables the network connection. Pending operations will not complete. */ function __PRIVATE_firestoreClientDisableNetwork(e) {
    return e.asyncQueue.enqueue((async () => {
        const t = await __PRIVATE_getPersistence(e), n = await __PRIVATE_getRemoteStore(e);
        return t.setNetworkEnabled(!1), async function __PRIVATE_remoteStoreDisableNetwork(e) {
            const t = __PRIVATE_debugCast(e);
            t.C_.add(0 /* OfflineCause.UserDisabled */), await __PRIVATE_disableNetworkInternal(t), 
            // Set the OnlineState to Offline so get()s return from cache, etc.
            t.M_.set("Offline" /* OnlineState.Offline */);
        }(n);
    }));
}

/**
 * Returns a Promise that resolves when all writes that were pending at the time
 * this method was called received server acknowledgement. An acknowledgement
 * can be either acceptance or rejection.
 */ function __PRIVATE_firestoreClientGetDocumentFromLocalCache(e, t) {
    const n = new __PRIVATE_Deferred;
    return e.asyncQueue.enqueueAndForget((async () => async function __PRIVATE_readDocumentFromCache(e, t, n) {
        try {
            const r = await function __PRIVATE_localStoreReadDocument(e, t) {
                const n = __PRIVATE_debugCast(e);
                return n.persistence.runTransaction("read document", "readonly", (e => n.localDocuments.getDocument(e, t)));
            }(e, t);
            r.isFoundDocument() ? n.resolve(r) : r.isNoDocument() ? n.resolve(null) : n.reject(new FirestoreError(v.UNAVAILABLE, "Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"));
        } catch (e) {
            const r = __PRIVATE_wrapInUserErrorIfRecoverable(e, `Failed to get document '${t} from cache`);
            n.reject(r);
        }
    }
    /**
 * Retrieves a latency-compensated document from the backend via a
 * SnapshotListener.
 */ (await __PRIVATE_getLocalStore(e), t, n))), n.promise;
}

function __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(e, t, n = {}) {
    const r = new __PRIVATE_Deferred;
    return e.asyncQueue.enqueueAndForget((async () => function __PRIVATE_readDocumentViaSnapshotListener(e, t, n, r, i) {
        const s = new __PRIVATE_AsyncObserver({
            next: s => {
                // Remove query first before passing event to user to avoid
                // user actions affecting the now stale query.
                t.enqueueAndForget((() => __PRIVATE_eventManagerUnlisten(e, o)));
                const _ = s.docs.has(n);
                !_ && s.fromCache ? 
                // TODO(dimond): If we're online and the document doesn't
                // exist then we resolve with a doc.exists set to false. If
                // we're offline however, we reject the Promise in this
                // case. Two options: 1) Cache the negative response from
                // the server so we can deliver that even when you're
                // offline 2) Actually reject the Promise in the online case
                // if the document doesn't exist.
                i.reject(new FirestoreError(v.UNAVAILABLE, "Failed to get document because the client is offline.")) : _ && s.fromCache && r && "server" === r.source ? i.reject(new FirestoreError(v.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : i.resolve(s);
            },
            error: e => i.reject(e)
        }), o = new __PRIVATE_QueryListener(__PRIVATE_newQueryForPath(n.path), s, {
            includeMetadataChanges: !0,
            J_: !0
        });
        return __PRIVATE_eventManagerListen(e, o);
    }(await __PRIVATE_getEventManager(e), e.asyncQueue, t, n, r))), r.promise;
}

function __PRIVATE_firestoreClientGetDocumentsFromLocalCache(e, t) {
    const n = new __PRIVATE_Deferred;
    return e.asyncQueue.enqueueAndForget((async () => async function __PRIVATE_executeQueryFromCache(e, t, n) {
        try {
            const r = await __PRIVATE_localStoreExecuteQuery(e, t, 
            /* usePreviousResults= */ !0), i = new __PRIVATE_View(t, r.ls), s = i.ca(r.documents), o = i.applyChanges(s, 
            /* limboResolutionEnabled= */ !1);
            n.resolve(o.snapshot);
        } catch (e) {
            const r = __PRIVATE_wrapInUserErrorIfRecoverable(e, `Failed to execute query '${t} against cache`);
            n.reject(r);
        }
    }
    /**
 * Retrieves a latency-compensated query snapshot from the backend via a
 * SnapshotListener.
 */ (await __PRIVATE_getLocalStore(e), t, n))), n.promise;
}

function __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(e, t, n = {}) {
    const r = new __PRIVATE_Deferred;
    return e.asyncQueue.enqueueAndForget((async () => function __PRIVATE_executeQueryViaSnapshotListener(e, t, n, r, i) {
        const s = new __PRIVATE_AsyncObserver({
            next: n => {
                // Remove query first before passing event to user to avoid
                // user actions affecting the now stale query.
                t.enqueueAndForget((() => __PRIVATE_eventManagerUnlisten(e, o))), n.fromCache && "server" === r.source ? i.reject(new FirestoreError(v.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n);
            },
            error: e => i.reject(e)
        }), o = new __PRIVATE_QueryListener(n, s, {
            includeMetadataChanges: !0,
            J_: !0
        });
        return __PRIVATE_eventManagerListen(e, o);
    }(await __PRIVATE_getEventManager(e), e.asyncQueue, t, n, r))), r.promise;
}

function __PRIVATE_firestoreClientAddSnapshotsInSyncListener(e, t) {
    const n = new __PRIVATE_AsyncObserver(t);
    return e.asyncQueue.enqueueAndForget((async () => function __PRIVATE_addSnapshotsInSyncListener(e, t) {
        __PRIVATE_debugCast(e).q_.add(t), 
        // Immediately fire an initial event, indicating all existing listeners
        // are in-sync.
        t.next();
    }(await __PRIVATE_getEventManager(e), n))), () => {
        n.Na(), e.asyncQueue.enqueueAndForget((async () => function __PRIVATE_removeSnapshotsInSyncListener(e, t) {
            __PRIVATE_debugCast(e).q_.delete(t);
        }(await __PRIVATE_getEventManager(e), n)));
    };
}

/**
 * Takes an updateFunction in which a set of reads and writes can be performed
 * atomically. In the updateFunction, the client can read and write values
 * using the supplied transaction object. After the updateFunction, all
 * changes will be committed. If a retryable error occurs (ex: some other
 * client has changed any of the data referenced), then the updateFunction
 * will be called again after a backoff. If the updateFunction still fails
 * after all retries, then the transaction will be rejected.
 *
 * The transaction object passed to the updateFunction contains methods for
 * accessing documents and collections. Unlike other datastore access, data
 * accessed with the transaction will not reflect local changes that have not
 * been committed. For this reason, it is required that all reads are
 * performed before any writes. Transactions must be performed while online.
 */ function __PRIVATE_firestoreClientLoadBundle(e, t, n, r) {
    const i = function __PRIVATE_createBundleReader(e, t) {
        let n;
        n = "string" == typeof e ? __PRIVATE_newTextEncoder().encode(e) : e;
        return function __PRIVATE_newBundleReader(e, t) {
            return new __PRIVATE_BundleReaderImpl(e, t);
        }(function __PRIVATE_toByteStreamReader(e, t) {
            if (e instanceof Uint8Array) return __PRIVATE_toByteStreamReaderHelper(e, t);
            if (e instanceof ArrayBuffer) return __PRIVATE_toByteStreamReaderHelper(new Uint8Array(e), t);
            if (e instanceof ReadableStream) return e.getReader();
            throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream");
        }(n), t);
    }(n, __PRIVATE_newSerializer(t));
    e.asyncQueue.enqueueAndForget((async () => {
        __PRIVATE_syncEngineLoadBundle(await __PRIVATE_getSyncEngine(e), i, r);
    }));
}

function __PRIVATE_firestoreClientGetNamedQuery(e, t) {
    return e.asyncQueue.enqueue((async () => function __PRIVATE_localStoreGetNamedQuery(e, t) {
        const n = __PRIVATE_debugCast(e);
        return n.persistence.runTransaction("Get named query", "readonly", (e => n.Kr.getNamedQuery(e, t)));
    }(await __PRIVATE_getLocalStore(e), t)));
}

function __PRIVATE_firestoreClientSetIndexConfiguration(e, t) {
    return e.asyncQueue.enqueue((async () => async function __PRIVATE_localStoreConfigureFieldIndexes(e, t) {
        const n = __PRIVATE_debugCast(e), r = n.indexManager, i = [];
        return n.persistence.runTransaction("Configure indexes", "readwrite", (e => r.getFieldIndexes(e).next((n => 
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
 * Compares two array for equality using comparator. The method computes the
 * intersection and invokes `onAdd` for every element that is in `after` but not
 * `before`. `onRemove` is invoked for every element in `before` but missing
 * from `after`.
 *
 * The method creates a copy of both `before` and `after` and runs in O(n log
 * n), where n is the size of the two lists.
 *
 * @param before - The elements that exist in the original array.
 * @param after - The elements to diff against the original array.
 * @param comparator - The comparator for the elements in before and after.
 * @param onAdd - A function to invoke for every element that is part of `
 * after` but not `before`.
 * @param onRemove - A function to invoke for every element that is part of
 * `before` but not `after`.
 */
        function __PRIVATE_diffArrays(e, t, n, r, i) {
            e = [ ...e ], t = [ ...t ], e.sort(n), t.sort(n);
            const s = e.length, o = t.length;
            let _ = 0, a = 0;
            for (;_ < o && a < s; ) {
                const s = n(e[a], t[_]);
                s < 0 ? 
                // The element was removed if the next element in our ordered
                // walkthrough is only in `before`.
                i(e[a++]) : s > 0 ? 
                // The element was added if the next element in our ordered walkthrough
                // is only in `after`.
                r(t[_++]) : (_++, a++);
            }
            for (;_ < o; ) r(t[_++]);
            for (;a < s; ) i(e[a++]);
        }(n, t, __PRIVATE_fieldIndexSemanticComparator, (t => {
            i.push(r.addFieldIndex(e, t));
        }), (t => {
            i.push(r.deleteFieldIndex(e, t));
        })))).next((() => PersistencePromise.waitFor(i)))));
    }(await __PRIVATE_getLocalStore(e), t)));
}

function __PRIVATE_firestoreClientSetPersistentCacheIndexAutoCreationEnabled(e, t) {
    return e.asyncQueue.enqueue((async () => function __PRIVATE_localStoreSetIndexAutoCreationEnabled(e, t) {
        __PRIVATE_debugCast(e).es.$i = t;
    }(await __PRIVATE_getLocalStore(e), t)));
}

function __PRIVATE_firestoreClientDeleteAllFieldIndexes(e) {
    return e.asyncQueue.enqueue((async () => function __PRIVATE_localStoreDeleteAllFieldIndexes(e) {
        const t = __PRIVATE_debugCast(e), n = t.indexManager;
        return t.persistence.runTransaction("Delete All Indexes", "readwrite", (e => n.deleteAllFieldIndexes(e)));
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
    // The format of the LocalStorage key that stores the client state is:
    //     firestore_clients_<persistence_prefix>_<instance_key>
    (await __PRIVATE_getLocalStore(e))));
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
function __PRIVATE_cloneLongPollingOptions(e) {
    const t = {};
    return void 0 !== e.timeoutSeconds && (t.timeoutSeconds = e.timeoutSeconds), t;
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
 */ const ge = new Map;

/**
 * An instance map that ensures only one Datastore exists per Firestore
 * instance.
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
function __PRIVATE_validateNonEmptyArgument(e, t, n) {
    if (!n) throw new FirestoreError(v.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
}

/**
 * Validates that two boolean options are not set at the same time.
 * @internal
 */ function __PRIVATE_validateIsNotUsedTogether(e, t, n, r) {
    if (!0 === t && !0 === r) throw new FirestoreError(v.INVALID_ARGUMENT, `${e} and ${n} cannot be used together.`);
}

/**
 * Validates that `path` refers to a document (indicated by the fact it contains
 * an even numbers of segments).
 */ function __PRIVATE_validateDocumentPath(e) {
    if (!DocumentKey.isDocumentKey(e)) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
}

/**
 * Validates that `path` refers to a collection (indicated by the fact it
 * contains an odd numbers of segments).
 */ function __PRIVATE_validateCollectionPath(e) {
    if (DocumentKey.isDocumentKey(e)) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
}

/**
 * Returns true if it's a non-null object without a custom prototype
 * (i.e. excludes Array, Date, etc.).
 */
/** Returns a string describing the type / value of the provided input. */
function __PRIVATE_valueDescription(e) {
    if (void 0 === e) return "undefined";
    if (null === e) return "null";
    if ("string" == typeof e) return e.length > 20 && (e = `${e.substring(0, 20)}...`), 
    JSON.stringify(e);
    if ("number" == typeof e || "boolean" == typeof e) return "" + e;
    if ("object" == typeof e) {
        if (e instanceof Array) return "an array";
        {
            const t = 
            /** try to get the constructor name for an object. */
            function __PRIVATE_tryGetCustomObjectType(e) {
                if (e.constructor) return e.constructor.name;
                return null;
            }
            /**
 * Casts `obj` to `T`, optionally unwrapping Compat types to expose the
 * underlying instance. Throws if  `obj` is not an instance of `T`.
 *
 * This cast is used in the Lite and Full SDK to verify instance types for
 * arguments passed to the public API.
 * @internal
 */ (e);
            return t ? `a custom ${t} object` : "an object";
        }
    }
    return "function" == typeof e ? "a function" : fail();
}

function __PRIVATE_cast(e, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
t) {
    if ("_delegate" in e && (
    // Unwrap Compat types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    e = e._delegate), !(e instanceof t)) {
        if (t.name === e.constructor.name) throw new FirestoreError(v.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
        {
            const n = __PRIVATE_valueDescription(e);
            throw new FirestoreError(v.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
        }
    }
    return e;
}

function __PRIVATE_validatePositiveNumber(e, t) {
    if (t <= 0) throw new FirestoreError(v.INVALID_ARGUMENT, `Function ${e}() requires a positive number, but it was: ${t}.`);
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
// settings() defaults:
/**
 * A concrete type describing all the values that can be applied via a
 * user-supplied `FirestoreSettings` object. This is a separate type so that
 * defaults can be supplied and the value can be checked for equality.
 */
class FirestoreSettingsImpl {
    constructor(e) {
        var t, n;
        if (void 0 === e.host) {
            if (void 0 !== e.ssl) throw new FirestoreError(v.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
            this.host = "firestore.googleapis.com", this.ssl = true;
        } else this.host = e.host, this.ssl = null === (t = e.ssl) || void 0 === t || t;
        if (this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, 
        this.localCache = e.localCache, void 0 === e.cacheSizeBytes) this.cacheSizeBytes = 41943040; else {
            if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < 1048576) throw new FirestoreError(v.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
            this.cacheSizeBytes = e.cacheSizeBytes;
        }
        __PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), 
        this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = !1 : void 0 === e.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = true : 
        // For backwards compatibility, coerce the value to boolean even though
        // the TypeScript compiler has narrowed the type to boolean already.
        // noinspection PointlessBooleanExpressionJS
        this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling, 
        this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions(null !== (n = e.experimentalLongPollingOptions) && void 0 !== n ? n : {}), 
        function __PRIVATE_validateLongPollingOptions(e) {
            if (void 0 !== e.timeoutSeconds) {
                if (isNaN(e.timeoutSeconds)) throw new FirestoreError(v.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);
                if (e.timeoutSeconds < 5) throw new FirestoreError(v.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);
                if (e.timeoutSeconds > 30) throw new FirestoreError(v.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`);
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
 */ (this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
    }
    isEqual(e) {
        return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && function __PRIVATE_longPollingOptionsEqual(e, t) {
            return e.timeoutSeconds === t.timeoutSeconds;
        }(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
    }
}

class Firestore$1 {
    /** @hideconstructor */
    constructor(e, t, n, r) {
        this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = n, 
        this._app = r, 
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
        if (!this._app) throw new FirestoreError(v.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
        return this._app;
    }
    get _initialized() {
        return this._settingsFrozen;
    }
    get _terminated() {
        return void 0 !== this._terminateTask;
    }
    _setSettings(e) {
        if (this._settingsFrozen) throw new FirestoreError(v.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
        this._settings = new FirestoreSettingsImpl(e), void 0 !== e.credentials && (this._authCredentials = function __PRIVATE_makeAuthCredentialsProvider(e) {
            if (!e) return new __PRIVATE_EmptyAuthCredentialsProvider;
            switch (e.type) {
              case "firstParty":
                return new __PRIVATE_FirstPartyAuthCredentialsProvider(e.sessionIndex || "0", e.iamToken || null, e.authTokenFactory || null);

              case "provider":
                return e.client;

              default:
                throw new FirestoreError(v.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
            }
        }(e.credentials));
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
        /**
 * Removes all components associated with the provided instance. Must be called
 * when the `Firestore` instance is terminated.
 */
        return function __PRIVATE_removeComponents(e) {
            const t = ge.get(e);
            t && (__PRIVATE_logDebug("ComponentProvider", "Removing Datastore"), ge.delete(e), 
            t.terminate());
        }(this), Promise.resolve();
    }
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
 */ function connectFirestoreEmulator(e, t, n, r = {}) {
    var i;
    const s = (e = __PRIVATE_cast(e, Firestore$1))._getSettings(), o = `${t}:${n}`;
    if ("firestore.googleapis.com" !== s.host && s.host !== o && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."), 
    e._setSettings(Object.assign(Object.assign({}, s), {
        host: o,
        ssl: !1
    })), r.mockUserToken) {
        let t, n;
        if ("string" == typeof r.mockUserToken) t = r.mockUserToken, n = User.MOCK_USER; else {
            // Let createMockUserToken validate first (catches common mistakes like
            // invalid field "uid" and missing field "sub" / "user_id".)
            t = I(r.mockUserToken, null === (i = e._app) || void 0 === i ? void 0 : i.options.projectId);
            const s = r.mockUserToken.sub || r.mockUserToken.user_id;
            if (!s) throw new FirestoreError(v.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
            n = new User(s);
        }
        e._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t, n));
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
    constructor(e, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    t, n) {
        this.converter = t, this._query = n, 
        /** The type of this Firestore reference. */
        this.type = "query", this.firestore = e;
    }
    withConverter(e) {
        return new Query(this.firestore, e, this._query);
    }
}

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist.
 */ class DocumentReference {
    /** @hideconstructor */
    constructor(e, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    t, n) {
        this.converter = t, this._key = n, 
        /** The type of this Firestore reference. */
        this.type = "document", this.firestore = e;
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
    withConverter(e) {
        return new DocumentReference(this.firestore, e, this._key);
    }
}

/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using {@link (query:1)}).
 */ class CollectionReference extends Query {
    /** @hideconstructor */
    constructor(e, t, n) {
        super(e, t, __PRIVATE_newQueryForPath(n)), this._path = n, 
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
        const e = this._path.popLast();
        return e.isEmpty() ? null : new DocumentReference(this.firestore, 
        /* converter= */ null, new DocumentKey(e));
    }
    withConverter(e) {
        return new CollectionReference(this.firestore, e, this._path);
    }
}

function collection(e, t, ...n) {
    if (e = T(e), __PRIVATE_validateNonEmptyArgument("collection", "path", t), e instanceof Firestore$1) {
        const r = ResourcePath.fromString(t, ...n);
        return __PRIVATE_validateCollectionPath(r), new CollectionReference(e, /* converter= */ null, r);
    }
    {
        if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(v.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
        const r = e._path.child(ResourcePath.fromString(t, ...n));
        return __PRIVATE_validateCollectionPath(r), new CollectionReference(e.firestore, 
        /* converter= */ null, r);
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
 */ function collectionGroup(e, t) {
    if (e = __PRIVATE_cast(e, Firestore$1), __PRIVATE_validateNonEmptyArgument("collectionGroup", "collection id", t), 
    t.indexOf("/") >= 0) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);
    return new Query(e, 
    /* converter= */ null, function __PRIVATE_newQueryForCollectionGroup(e) {
        return new __PRIVATE_QueryImpl(ResourcePath.emptyPath(), e);
    }(t));
}

function doc(e, t, ...n) {
    if (e = T(e), 
    // We allow omission of 'pathString' but explicitly prohibit passing in both
    // 'undefined' and 'null'.
    1 === arguments.length && (t = __PRIVATE_AutoId.newId()), __PRIVATE_validateNonEmptyArgument("doc", "path", t), 
    e instanceof Firestore$1) {
        const r = ResourcePath.fromString(t, ...n);
        return __PRIVATE_validateDocumentPath(r), new DocumentReference(e, 
        /* converter= */ null, new DocumentKey(r));
    }
    {
        if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(v.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
        const r = e._path.child(ResourcePath.fromString(t, ...n));
        return __PRIVATE_validateDocumentPath(r), new DocumentReference(e.firestore, e instanceof CollectionReference ? e.converter : null, new DocumentKey(r));
    }
}

/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */ function refEqual(e, t) {
    return e = T(e), t = T(t), (e instanceof DocumentReference || e instanceof CollectionReference) && (t instanceof DocumentReference || t instanceof CollectionReference) && (e.firestore === t.firestore && e.path === t.path && e.converter === t.converter);
}

/**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */ function queryEqual(e, t) {
    return e = T(e), t = T(t), e instanceof Query && t instanceof Query && (e.firestore === t.firestore && __PRIVATE_queryEquals(e._query, t._query) && e.converter === t.converter);
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
        this.Ja = Promise.resolve(), 
        // A list of retryable operations. Retryable operations are run in order and
        // retried with backoff.
        this.Ya = [], 
        // Is this AsyncQueue being shut down? Once it is set to true, it will not
        // be changed again.
        this.Za = !1, 
        // Operations scheduled to be queued in the future. Operations are
        // automatically removed after they are run or canceled.
        this.Xa = [], 
        // visible for testing
        this.eu = null, 
        // Flag set while there's an outstanding AsyncQueue operation, used for
        // assertion sanity-checks.
        this.tu = !1, 
        // Enabled during shutdown on Safari to prevent future access to IndexedDB.
        this.nu = !1, 
        // List of TimerIds to fast-forward delays for.
        this.ru = [], 
        // Backoff timer used to schedule retries for retryable operations
        this.zo = new __PRIVATE_ExponentialBackoff(this, "async_queue_retry" /* TimerId.AsyncQueueRetry */), 
        // Visibility handler that triggers an immediate retry of all retryable
        // operations. Meant to speed up recovery when we regain file system access
        // after page comes into foreground.
        this.iu = () => {
            const e = getDocument();
            e && __PRIVATE_logDebug("AsyncQueue", "Visibility state changed to " + e.visibilityState), 
            this.zo.Qo();
        };
        const e = getDocument();
        e && "function" == typeof e.addEventListener && e.addEventListener("visibilitychange", this.iu);
    }
    get isShuttingDown() {
        return this.Za;
    }
    /**
     * Adds a new operation to the queue without waiting for it to complete (i.e.
     * we ignore the Promise result).
     */    enqueueAndForget(e) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.enqueue(e);
    }
    enqueueAndForgetEvenWhileRestricted(e) {
        this.su(), 
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.ou(e);
    }
    enterRestrictedMode(e) {
        if (!this.Za) {
            this.Za = !0, this.nu = e || !1;
            const t = getDocument();
            t && "function" == typeof t.removeEventListener && t.removeEventListener("visibilitychange", this.iu);
        }
    }
    enqueue(e) {
        if (this.su(), this.Za) 
        // Return a Promise which never resolves.
        return new Promise((() => {}));
        // Create a deferred Promise that we can return to the callee. This
        // allows us to return a "hanging Promise" only to the callee and still
        // advance the queue even when the operation is not run.
                const t = new __PRIVATE_Deferred;
        return this.ou((() => this.Za && this.nu ? Promise.resolve() : (e().then(t.resolve, t.reject), 
        t.promise))).then((() => t.promise));
    }
    enqueueRetryable(e) {
        this.enqueueAndForget((() => (this.Ya.push(e), this._u())));
    }
    /**
     * Runs the next operation from the retryable queue. If the operation fails,
     * reschedules with backoff.
     */    async _u() {
        if (0 !== this.Ya.length) {
            try {
                await this.Ya[0](), this.Ya.shift(), this.zo.reset();
            } catch (e) {
                if (!__PRIVATE_isIndexedDbTransactionError(e)) throw e;
 // Failure will be handled by AsyncQueue
                                __PRIVATE_logDebug("AsyncQueue", "Operation failed with retryable error: " + e);
            }
            this.Ya.length > 0 && 
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
            this.zo.ko((() => this._u()));
        }
    }
    ou(e) {
        const t = this.Ja.then((() => (this.tu = !0, e().catch((e => {
            this.eu = e, this.tu = !1;
            const t = 
            /**
 * Chrome includes Error.message in Error.stack. Other browsers do not.
 * This returns expected output of message + stack when available.
 * @param error - Error or FirestoreError
 */
            function __PRIVATE_getMessageOrStack(e) {
                let t = e.message || "";
                e.stack && (t = e.stack.includes(e.message) ? e.stack : e.message + "\n" + e.stack);
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
 */ (e);
            // Re-throw the error so that this.tail becomes a rejected Promise and
            // all further attempts to chain (via .then) will just short-circuit
            // and return the rejected Promise.
            throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", t), e;
        })).then((e => (this.tu = !1, e))))));
        return this.Ja = t, t;
    }
    enqueueAfterDelay(e, t, n) {
        this.su(), 
        // Fast-forward delays for timerIds that have been overriden.
        this.ru.indexOf(e) > -1 && (t = 0);
        const r = DelayedOperation.createAndSchedule(this, e, t, n, (e => this.au(e)));
        return this.Xa.push(r), r;
    }
    su() {
        this.eu && fail();
    }
    verifyOperationInProgress() {}
    /**
     * Waits until all currently queued tasks are finished executing. Delayed
     * operations are not run.
     */    async uu() {
        // Operations in the queue prior to draining may have enqueued additional
        // operations. Keep draining the queue until the tail is no longer advanced,
        // which indicates that no more new operations were enqueued and that all
        // operations were executed.
        let e;
        do {
            e = this.Ja, await e;
        } while (e !== this.Ja);
    }
    /**
     * For Tests: Determine if a delayed operation with a particular TimerId
     * exists.
     */    cu(e) {
        for (const t of this.Xa) if (t.timerId === e) return !0;
        return !1;
    }
    /**
     * For Tests: Runs some or all delayed operations early.
     *
     * @param lastTimerId - Delayed operations up to and including this TimerId
     * will be drained. Pass TimerId.All to run all delayed operations.
     * @returns a Promise that resolves once all operations have been run.
     */    lu(e) {
        // Note that draining may generate more delayed ops, so we do that first.
        return this.uu().then((() => {
            // Run ops in the same order they'd run if they ran naturally.
            this.Xa.sort(((e, t) => e.targetTimeMs - t.targetTimeMs));
            for (const t of this.Xa) if (t.skipDelay(), "all" /* TimerId.All */ !== e && t.timerId === e) break;
            return this.uu();
        }));
    }
    /**
     * For Tests: Skip all subsequent delays for a timer id.
     */    hu(e) {
        this.ru.push(e);
    }
    /** Called once a DelayedOperation is run or canceled. */    au(e) {
        // NOTE: indexOf / slice are O(n), but delayedOperations is expected to be small.
        const t = this.Xa.indexOf(e);
        this.Xa.splice(t, 1);
    }
}

function __PRIVATE_isPartialObserver(e) {
    /**
 * Returns true if obj is an object and contains at least one of the specified
 * methods.
 */
    return function __PRIVATE_implementsAnyMethods(e, t) {
        if ("object" != typeof e || null === e) return !1;
        const n = e;
        for (const e of t) if (e in n && "function" == typeof n[e]) return !0;
        return !1;
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
 * Represents the task of loading a Firestore bundle. It provides progress of bundle
 * loading, as well as task completion and error events.
 *
 * The API is compatible with `Promise<LoadBundleTaskProgress>`.
 */ (e, [ "next", "error", "complete" ]);
}

class LoadBundleTask {
    constructor() {
        this._progressObserver = {}, this._taskCompletionResolver = new __PRIVATE_Deferred, 
        this._lastProgress = {
            taskState: "Running",
            totalBytes: 0,
            totalDocuments: 0,
            bytesLoaded: 0,
            documentsLoaded: 0
        };
    }
    /**
     * Registers functions to listen to bundle loading progress events.
     * @param next - Called when there is a progress update from bundle loading. Typically `next` calls occur
     *   each time a Firestore document is loaded from the bundle.
     * @param error - Called when an error occurs during bundle loading. The task aborts after reporting the
     *   error, and there should be no more updates after this.
     * @param complete - Called when the loading task is complete.
     */    onProgress(e, t, n) {
        this._progressObserver = {
            next: e,
            error: t,
            complete: n
        };
    }
    /**
     * Implements the `Promise<LoadBundleTaskProgress>.catch` interface.
     *
     * @param onRejected - Called when an error occurs during bundle loading.
     */    catch(e) {
        return this._taskCompletionResolver.promise.catch(e);
    }
    /**
     * Implements the `Promise<LoadBundleTaskProgress>.then` interface.
     *
     * @param onFulfilled - Called on the completion of the loading task with a final `LoadBundleTaskProgress` update.
     *   The update will always have its `taskState` set to `"Success"`.
     * @param onRejected - Called when an error occurs during bundle loading.
     */    then(e, t) {
        return this._taskCompletionResolver.promise.then(e, t);
    }
    /**
     * Notifies all observers that bundle loading has completed, with a provided
     * `LoadBundleTaskProgress` object.
     *
     * @private
     */    _completeWith(e) {
        this._updateProgress(e), this._progressObserver.complete && this._progressObserver.complete(), 
        this._taskCompletionResolver.resolve(e);
    }
    /**
     * Notifies all observers that bundle loading has failed, with a provided
     * `Error` as the reason.
     *
     * @private
     */    _failWith(e) {
        this._lastProgress.taskState = "Error", this._progressObserver.next && this._progressObserver.next(this._lastProgress), 
        this._progressObserver.error && this._progressObserver.error(e), this._taskCompletionResolver.reject(e);
    }
    /**
     * Notifies a progress update of loading a bundle.
     * @param progress - The new progress.
     *
     * @private
     */    _updateProgress(e) {
        this._lastProgress = e, this._progressObserver.next && this._progressObserver.next(e);
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
 * Constant used to indicate the LRU garbage collection should be disabled.
 * Set this value as the `cacheSizeBytes` on the settings passed to the
 * {@link Firestore} instance.
 */ const pe = -1;

/**
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */ class Firestore extends Firestore$1 {
    /** @hideconstructor */
    constructor(e, t, n, r) {
        super(e, t, n, r), 
        /**
         * Whether it's a {@link Firestore} or Firestore Lite instance.
         */
        this.type = "firestore", this._queue = function __PRIVATE_newAsyncQueue() {
            return new __PRIVATE_AsyncQueueImpl;
        }(), this._persistenceKey = (null == r ? void 0 : r.name) || "[DEFAULT]";
    }
    _terminate() {
        return this._firestoreClient || 
        // The client must be initialized to ensure that all subsequent API
        // usage throws an exception.
        __PRIVATE_configureFirestore(this), this._firestoreClient.terminate();
    }
}

/**
 * Initializes a new instance of {@link Firestore} with the provided settings.
 * Can only be called before any other function, including
 * {@link (getFirestore:1)}. If the custom settings are empty, this function is
 * equivalent to calling {@link (getFirestore:1)}.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} with which the {@link Firestore} instance will
 * be associated.
 * @param settings - A settings object to configure the {@link Firestore} instance.
 * @param databaseId - The name of the database.
 * @returns A newly initialized {@link Firestore} instance.
 */ function initializeFirestore(e, t, n) {
    n || (n = "(default)");
    const r = _getProvider(e, "firestore");
    if (r.isInitialized(n)) {
        const e = r.getImmediate({
            identifier: n
        }), i = r.getOptions(n);
        if (E(i, t)) return e;
        throw new FirestoreError(v.FAILED_PRECONDITION, "initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.");
    }
    if (void 0 !== t.cacheSizeBytes && void 0 !== t.localCache) throw new FirestoreError(v.INVALID_ARGUMENT, "cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");
    if (void 0 !== t.cacheSizeBytes && -1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576) throw new FirestoreError(v.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
    return r.initialize({
        options: t,
        instanceIdentifier: n
    });
}

function getFirestore(t, n) {
    const r = "object" == typeof t ? t : e(), i = "string" == typeof t ? t : n || "(default)", s = _getProvider(r, "firestore").getImmediate({
        identifier: i
    });
    if (!s._initialized) {
        const e = d("firestore");
        e && connectFirestoreEmulator(s, ...e);
    }
    return s;
}

/**
 * @internal
 */ function ensureFirestoreConfigured(e) {
    return e._firestoreClient || __PRIVATE_configureFirestore(e), e._firestoreClient.verifyNotTerminated(), 
    e._firestoreClient;
}

function __PRIVATE_configureFirestore(e) {
    var t, n, r;
    const i = e._freezeSettings(), s = function __PRIVATE_makeDatabaseInfo(e, t, n, r) {
        return new DatabaseInfo(e, t, n, r.host, r.ssl, r.experimentalForceLongPolling, r.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(r.experimentalLongPollingOptions), r.useFetchStreams);
    }(e._databaseId, (null === (t = e._app) || void 0 === t ? void 0 : t.options.appId) || "", e._persistenceKey, i);
    e._firestoreClient = new FirestoreClient(e._authCredentials, e._appCheckCredentials, e._queue, s), 
    (null === (n = i.localCache) || void 0 === n ? void 0 : n._offlineComponentProvider) && (null === (r = i.localCache) || void 0 === r ? void 0 : r._onlineComponentProvider) && (e._firestoreClient._uninitializedComponentsProvider = {
        _offlineKind: i.localCache.kind,
        _offline: i.localCache._offlineComponentProvider,
        _online: i.localCache._onlineComponentProvider
    });
}

/**
 * Attempts to enable persistent storage, if possible.
 *
 * Must be called before any other functions (other than
 * {@link initializeFirestore}, {@link (getFirestore:1)} or
 * {@link clearIndexedDbPersistence}.
 *
 * If this fails, `enableIndexedDbPersistence()` will reject the promise it
 * returns. Note that even after this failure, the {@link Firestore} instance will
 * remain usable, however offline persistence will be disabled.
 *
 * There are several reasons why this can fail, which can be identified by
 * the `code` on the error.
 *
 *   * failed-precondition: The app is already open in another browser tab.
 *   * unimplemented: The browser is incompatible with the offline
 *     persistence implementation.
 *
 * Persistence cannot be used in a Node.js environment.
 *
 * @param firestore - The {@link Firestore} instance to enable persistence for.
 * @param persistenceSettings - Optional settings object to configure
 * persistence.
 * @returns A `Promise` that represents successfully enabling persistent storage.
 * @deprecated This function will be removed in a future major release. Instead, set
 * `FirestoreSettings.localCache` to an instance of `PersistentLocalCache` to
 * turn on IndexedDb cache. Calling this function when `FirestoreSettings.localCache`
 * is already specified will throw an exception.
 */ function enableIndexedDbPersistence(e, t) {
    __PRIVATE_verifyNotInitialized(e = __PRIVATE_cast(e, Firestore));
    const n = ensureFirestoreConfigured(e);
    if (n._uninitializedComponentsProvider) throw new FirestoreError(v.FAILED_PRECONDITION, "SDK cache is already specified.");
    __PRIVATE_logWarn("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");
    const r = e._freezeSettings(), i = new OnlineComponentProvider;
    return __PRIVATE_setPersistenceProviders(n, i, new __PRIVATE_IndexedDbOfflineComponentProvider(i, r.cacheSizeBytes, null == t ? void 0 : t.forceOwnership));
}

/**
 * Attempts to enable multi-tab persistent storage, if possible. If enabled
 * across all tabs, all operations share access to local persistence, including
 * shared execution of queries and latency-compensated local document updates
 * across all connected instances.
 *
 * If this fails, `enableMultiTabIndexedDbPersistence()` will reject the promise
 * it returns. Note that even after this failure, the {@link Firestore} instance will
 * remain usable, however offline persistence will be disabled.
 *
 * There are several reasons why this can fail, which can be identified by
 * the `code` on the error.
 *
 *   * failed-precondition: The app is already open in another browser tab and
 *     multi-tab is not enabled.
 *   * unimplemented: The browser is incompatible with the offline
 *     persistence implementation.
 *
 * @param firestore - The {@link Firestore} instance to enable persistence for.
 * @returns A `Promise` that represents successfully enabling persistent
 * storage.
 * @deprecated This function will be removed in a future major release. Instead, set
 * `FirestoreSettings.localCache` to an instance of `PersistentLocalCache` to
 * turn on indexeddb cache. Calling this function when `FirestoreSettings.localCache`
 * is already specified will throw an exception.
 */ function enableMultiTabIndexedDbPersistence(e) {
    __PRIVATE_verifyNotInitialized(e = __PRIVATE_cast(e, Firestore));
    const t = ensureFirestoreConfigured(e);
    if (t._uninitializedComponentsProvider) throw new FirestoreError(v.FAILED_PRECONDITION, "SDK cache is already specified.");
    __PRIVATE_logWarn("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");
    const n = e._freezeSettings(), r = new OnlineComponentProvider;
    return __PRIVATE_setPersistenceProviders(t, r, new __PRIVATE_MultiTabOfflineComponentProvider(r, n.cacheSizeBytes));
}

/**
 * Registers both the `OfflineComponentProvider` and `OnlineComponentProvider`.
 * If the operation fails with a recoverable error (see
 * `canRecoverFromIndexedDbError()` below), the returned Promise is rejected
 * but the client remains usable.
 */ function __PRIVATE_setPersistenceProviders(e, t, n) {
    const r = new __PRIVATE_Deferred;
    return e.asyncQueue.enqueue((async () => {
        try {
            await __PRIVATE_setOfflineComponentProvider(e, n), await __PRIVATE_setOnlineComponentProvider(e, t), 
            r.resolve();
        } catch (e) {
            const t = e;
            if (!__PRIVATE_canFallbackFromIndexedDbError(t)) throw t;
            __PRIVATE_logWarn("Error enabling indexeddb cache. Falling back to memory cache: " + t), 
            r.reject(t);
        }
    })).then((() => r.promise));
}

/**
 * Clears the persistent storage. This includes pending writes and cached
 * documents.
 *
 * Must be called while the {@link Firestore} instance is not started (after the app is
 * terminated or when the app is first initialized). On startup, this function
 * must be called before other functions (other than {@link
 * initializeFirestore} or {@link (getFirestore:1)})). If the {@link Firestore}
 * instance is still running, the promise will be rejected with the error code
 * of `failed-precondition`.
 *
 * Note: `clearIndexedDbPersistence()` is primarily intended to help write
 * reliable tests that use Cloud Firestore. It uses an efficient mechanism for
 * dropping existing data but does not attempt to securely overwrite or
 * otherwise make cached data unrecoverable. For applications that are sensitive
 * to the disclosure of cached data in between user sessions, we strongly
 * recommend not enabling persistence at all.
 *
 * @param firestore - The {@link Firestore} instance to clear persistence for.
 * @returns A `Promise` that is resolved when the persistent storage is
 * cleared. Otherwise, the promise is rejected with an error.
 */ function clearIndexedDbPersistence(e) {
    if (e._initialized && !e._terminated) throw new FirestoreError(v.FAILED_PRECONDITION, "Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");
    const t = new __PRIVATE_Deferred;
    return e._queue.enqueueAndForgetEvenWhileRestricted((async () => {
        try {
            await async function __PRIVATE_indexedDbClearPersistence(e) {
                if (!__PRIVATE_SimpleDb.D()) return Promise.resolve();
                const t = e + "main";
                await __PRIVATE_SimpleDb.delete(t);
            }(__PRIVATE_indexedDbStoragePrefix(e._databaseId, e._persistenceKey)), t.resolve();
        } catch (e) {
            t.reject(e);
        }
    })), t.promise;
}

/**
 * Waits until all currently pending writes for the active user have been
 * acknowledged by the backend.
 *
 * The returned promise resolves immediately if there are no outstanding writes.
 * Otherwise, the promise waits for all previously issued writes (including
 * those written in a previous app session), but it does not wait for writes
 * that were added after the function is called. If you want to wait for
 * additional writes, call `waitForPendingWrites()` again.
 *
 * Any outstanding `waitForPendingWrites()` promises are rejected during user
 * changes.
 *
 * @returns A `Promise` which resolves when all currently pending writes have been
 * acknowledged by the backend.
 */ function waitForPendingWrites(e) {
    return function __PRIVATE_firestoreClientWaitForPendingWrites(e) {
        const t = new __PRIVATE_Deferred;
        return e.asyncQueue.enqueueAndForget((async () => __PRIVATE_syncEngineRegisterPendingWritesCallback(await __PRIVATE_getSyncEngine(e), t))), 
        t.promise;
    }(ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)));
}

/**
 * Re-enables use of the network for this {@link Firestore} instance after a prior
 * call to {@link disableNetwork}.
 *
 * @returns A `Promise` that is resolved once the network has been enabled.
 */ function enableNetwork(e) {
    return __PRIVATE_firestoreClientEnableNetwork(ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)));
}

/**
 * Disables network usage for this instance. It can be re-enabled via {@link
 * enableNetwork}. While the network is disabled, any snapshot listeners,
 * `getDoc()` or `getDocs()` calls will return results from cache, and any write
 * operations will be queued until the network is restored.
 *
 * @returns A `Promise` that is resolved once the network has been disabled.
 */ function disableNetwork(e) {
    return __PRIVATE_firestoreClientDisableNetwork(ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)));
}

/**
 * Terminates the provided {@link Firestore} instance.
 *
 * After calling `terminate()` only the `clearIndexedDbPersistence()` function
 * may be used. Any other function will throw a `FirestoreError`.
 *
 * To restart after termination, create a new instance of FirebaseFirestore with
 * {@link (getFirestore:1)}.
 *
 * Termination does not cancel any pending writes, and any promises that are
 * awaiting a response from the server will not be resolved. If you have
 * persistence enabled, the next time you start this instance, it will resume
 * sending these writes to the server.
 *
 * Note: Under normal circumstances, calling `terminate()` is not required. This
 * function is useful only when you want to force this instance to release all
 * of its resources or in combination with `clearIndexedDbPersistence()` to
 * ensure that all local state is destroyed between test runs.
 *
 * @returns A `Promise` that is resolved when the instance has been successfully
 * terminated.
 */ function terminate(e) {
    return t(e.app, "firestore", e._databaseId.database), e._delete();
}

/**
 * Loads a Firestore bundle into the local cache.
 *
 * @param firestore - The {@link Firestore} instance to load bundles for.
 * @param bundleData - An object representing the bundle to be loaded. Valid
 * objects are `ArrayBuffer`, `ReadableStream<Uint8Array>` or `string`.
 *
 * @returns A `LoadBundleTask` object, which notifies callers with progress
 * updates, and completion or error events. It can be used as a
 * `Promise<LoadBundleTaskProgress>`.
 */ function loadBundle(e, t) {
    const n = ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)), r = new LoadBundleTask;
    return __PRIVATE_firestoreClientLoadBundle(n, e._databaseId, t, r), r;
}

/**
 * Reads a Firestore {@link Query} from local cache, identified by the given
 * name.
 *
 * The named queries are packaged  into bundles on the server side (along
 * with resulting documents), and loaded to local cache using `loadBundle`. Once
 * in local cache, use this method to extract a {@link Query} by name.
 *
 * @param firestore - The {@link Firestore} instance to read the query from.
 * @param name - The name of the query.
 * @returns A `Promise` that is resolved with the Query or `null`.
 */ function namedQuery(e, t) {
    return __PRIVATE_firestoreClientGetNamedQuery(ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)), t).then((t => t ? new Query(e, null, t.query) : null));
}

function __PRIVATE_verifyNotInitialized(e) {
    if (e._initialized || e._terminated) throw new FirestoreError(v.FAILED_PRECONDITION, "Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");
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
    constructor(e = "count", t) {
        this._internalFieldPath = t, 
        /** A type string to uniquely identify instances of this class. */
        this.type = "AggregateField", this.aggregateType = e;
    }
}

/**
 * The results of executing an aggregation query.
 */ class AggregateQuerySnapshot {
    /** @hideconstructor */
    constructor(e, t, n) {
        this._userDataWriter = t, this._data = n, 
        /** A type string to uniquely identify instances of this class. */
        this.type = "AggregateQuerySnapshot", this.query = e;
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
 * An immutable object representing an array of bytes.
 */ class Bytes {
    /** @hideconstructor */
    constructor(e) {
        this._byteString = e;
    }
    /**
     * Creates a new `Bytes` object from the given Base64 string, converting it to
     * bytes.
     *
     * @param base64 - The Base64 string used to create the `Bytes` object.
     */    static fromBase64String(e) {
        try {
            return new Bytes(ByteString.fromBase64String(e));
        } catch (e) {
            throw new FirestoreError(v.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e);
        }
    }
    /**
     * Creates a new `Bytes` object from the given Uint8Array.
     *
     * @param array - The Uint8Array used to create the `Bytes` object.
     */    static fromUint8Array(e) {
        return new Bytes(ByteString.fromUint8Array(e));
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
     */    isEqual(e) {
        return this._byteString.isEqual(e._byteString);
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
    constructor(...e) {
        for (let t = 0; t < e.length; ++t) if (0 === e[t].length) throw new FirestoreError(v.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
        this._internalPath = new FieldPath$1(e);
    }
    /**
     * Returns true if this `FieldPath` is equal to the provided one.
     *
     * @param other - The `FieldPath` to compare against.
     * @returns true if this `FieldPath` is equal to the provided one.
     */    isEqual(e) {
        return this._internalPath.isEqual(e._internalPath);
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
    constructor(e) {
        this._methodName = e;
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
    constructor(e, t) {
        if (!isFinite(e) || e < -90 || e > 90) throw new FirestoreError(v.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
        if (!isFinite(t) || t < -180 || t > 180) throw new FirestoreError(v.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
        this._lat = e, this._long = t;
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
     */    isEqual(e) {
        return this._lat === e._lat && this._long === e._long;
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
     */    _compareTo(e) {
        return __PRIVATE_primitiveComparator(this._lat, e._lat) || __PRIVATE_primitiveComparator(this._long, e._long);
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
 */ const ye = /^__.*__$/;

/** The result of parsing document data (e.g. for a setData call). */ class ParsedSetData {
    constructor(e, t, n) {
        this.data = e, this.fieldMask = t, this.fieldTransforms = n;
    }
    toMutation(e, t) {
        return null !== this.fieldMask ? new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms) : new __PRIVATE_SetMutation(e, this.data, t, this.fieldTransforms);
    }
}

/** The result of parsing "update" data (i.e. for an updateData call). */ class ParsedUpdateData {
    constructor(e, 
    // The fieldMask does not include document transforms.
    t, n) {
        this.data = e, this.fieldMask = t, this.fieldTransforms = n;
    }
    toMutation(e, t) {
        return new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms);
    }
}

function __PRIVATE_isWrite(e) {
    switch (e) {
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
    constructor(e, t, n, r, i, s) {
        this.settings = e, this.databaseId = t, this.serializer = n, this.ignoreUndefinedProperties = r, 
        // Minor hack: If fieldTransforms is undefined, we assume this is an
        // external call and we need to validate the entire path.
        void 0 === i && this.Pu(), this.fieldTransforms = i || [], this.fieldMask = s || [];
    }
    get path() {
        return this.settings.path;
    }
    get Iu() {
        return this.settings.Iu;
    }
    /** Returns a new context with the specified settings overwritten. */    Tu(e) {
        return new __PRIVATE_ParseContextImpl(Object.assign(Object.assign({}, this.settings), e), this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
    }
    Eu(e) {
        var t;
        const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e), r = this.Tu({
            path: n,
            du: !1
        });
        return r.Au(e), r;
    }
    Ru(e) {
        var t;
        const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e), r = this.Tu({
            path: n,
            du: !1
        });
        return r.Pu(), r;
    }
    Vu(e) {
        // TODO(b/34871131): We don't support array paths right now; so make path
        // undefined.
        return this.Tu({
            path: void 0,
            du: !0
        });
    }
    mu(e) {
        return __PRIVATE_createError(e, this.settings.methodName, this.settings.fu || !1, this.path, this.settings.gu);
    }
    /** Returns 'true' if 'fieldPath' was traversed when creating this context. */    contains(e) {
        return void 0 !== this.fieldMask.find((t => e.isPrefixOf(t))) || void 0 !== this.fieldTransforms.find((t => e.isPrefixOf(t.field)));
    }
    Pu() {
        // TODO(b/34871131): Remove null check once we have proper paths for fields
        // within arrays.
        if (this.path) for (let e = 0; e < this.path.length; e++) this.Au(this.path.get(e));
    }
    Au(e) {
        if (0 === e.length) throw this.mu("Document fields must not be empty");
        if (__PRIVATE_isWrite(this.Iu) && ye.test(e)) throw this.mu('Document fields cannot begin and end with "__"');
    }
}

/**
 * Helper for parsing raw user input (provided via the API) into internal model
 * classes.
 */ class __PRIVATE_UserDataReader {
    constructor(e, t, n) {
        this.databaseId = e, this.ignoreUndefinedProperties = t, this.serializer = n || __PRIVATE_newSerializer(e);
    }
    /** Creates a new top-level parse context. */    pu(e, t, n, r = !1) {
        return new __PRIVATE_ParseContextImpl({
            Iu: e,
            methodName: t,
            gu: n,
            path: FieldPath$1.emptyPath(),
            du: !1,
            fu: r
        }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
    }
}

function __PRIVATE_newUserDataReader(e) {
    const t = e._freezeSettings(), n = __PRIVATE_newSerializer(e._databaseId);
    return new __PRIVATE_UserDataReader(e._databaseId, !!t.ignoreUndefinedProperties, n);
}

/** Parse document data from a set() call. */ function __PRIVATE_parseSetData(e, t, n, r, i, s = {}) {
    const o = e.pu(s.merge || s.mergeFields ? 2 /* UserDataSource.MergeSet */ : 0 /* UserDataSource.Set */ , t, n, i);
    __PRIVATE_validatePlainObject("Data must be an object, but it was:", o, r);
    const _ = __PRIVATE_parseObject(r, o);
    let a, u;
    if (s.merge) a = new FieldMask(o.fieldMask), u = o.fieldTransforms; else if (s.mergeFields) {
        const e = [];
        for (const r of s.mergeFields) {
            const i = __PRIVATE_fieldPathFromArgument$1(t, r, n);
            if (!o.contains(i)) throw new FirestoreError(v.INVALID_ARGUMENT, `Field '${i}' is specified in your field mask but missing from your input data.`);
            __PRIVATE_fieldMaskContains(e, i) || e.push(i);
        }
        a = new FieldMask(e), u = o.fieldTransforms.filter((e => a.covers(e.field)));
    } else a = null, u = o.fieldTransforms;
    return new ParsedSetData(new ObjectValue(_), a, u);
}

class __PRIVATE_DeleteFieldValueImpl extends FieldValue {
    _toFieldTransform(e) {
        if (2 /* UserDataSource.MergeSet */ !== e.Iu) throw 1 /* UserDataSource.Update */ === e.Iu ? e.mu(`${this._methodName}() can only appear at the top level of your update data`) : e.mu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
        // No transform to add for a delete, but we need to add it to our
        // fieldMask so it gets deleted.
        return e.fieldMask.push(e.path), null;
    }
    isEqual(e) {
        return e instanceof __PRIVATE_DeleteFieldValueImpl;
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
 */ function __PRIVATE_createSentinelChildContext(e, t, n) {
    return new __PRIVATE_ParseContextImpl({
        Iu: 3 /* UserDataSource.Argument */ ,
        gu: t.settings.gu,
        methodName: e._methodName,
        du: n
    }, t.databaseId, t.serializer, t.ignoreUndefinedProperties);
}

class __PRIVATE_ServerTimestampFieldValueImpl extends FieldValue {
    _toFieldTransform(e) {
        return new FieldTransform(e.path, new __PRIVATE_ServerTimestampTransform);
    }
    isEqual(e) {
        return e instanceof __PRIVATE_ServerTimestampFieldValueImpl;
    }
}

class __PRIVATE_ArrayUnionFieldValueImpl extends FieldValue {
    constructor(e, t) {
        super(e), this.yu = t;
    }
    _toFieldTransform(e) {
        const t = __PRIVATE_createSentinelChildContext(this, e, 
        /*array=*/ !0), n = this.yu.map((e => __PRIVATE_parseData(e, t))), r = new __PRIVATE_ArrayUnionTransformOperation(n);
        return new FieldTransform(e.path, r);
    }
    isEqual(e) {
        // TODO(mrschmidt): Implement isEquals
        return this === e;
    }
}

class __PRIVATE_ArrayRemoveFieldValueImpl extends FieldValue {
    constructor(e, t) {
        super(e), this.yu = t;
    }
    _toFieldTransform(e) {
        const t = __PRIVATE_createSentinelChildContext(this, e, 
        /*array=*/ !0), n = this.yu.map((e => __PRIVATE_parseData(e, t))), r = new __PRIVATE_ArrayRemoveTransformOperation(n);
        return new FieldTransform(e.path, r);
    }
    isEqual(e) {
        // TODO(mrschmidt): Implement isEquals
        return this === e;
    }
}

class __PRIVATE_NumericIncrementFieldValueImpl extends FieldValue {
    constructor(e, t) {
        super(e), this.wu = t;
    }
    _toFieldTransform(e) {
        const t = new __PRIVATE_NumericIncrementTransformOperation(e.serializer, toNumber(e.serializer, this.wu));
        return new FieldTransform(e.path, t);
    }
    isEqual(e) {
        // TODO(mrschmidt): Implement isEquals
        return this === e;
    }
}

/** Parse update data from an update() call. */ function __PRIVATE_parseUpdateData(e, t, n, r) {
    const i = e.pu(1 /* UserDataSource.Update */ , t, n);
    __PRIVATE_validatePlainObject("Data must be an object, but it was:", i, r);
    const s = [], o = ObjectValue.empty();
    forEach(r, ((e, r) => {
        const _ = __PRIVATE_fieldPathFromDotSeparatedString(t, e, n);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                r = T(r);
        const a = i.Ru(_);
        if (r instanceof __PRIVATE_DeleteFieldValueImpl) 
        // Add it to the field mask, but don't add anything to updateData.
        s.push(_); else {
            const e = __PRIVATE_parseData(r, a);
            null != e && (s.push(_), o.set(_, e));
        }
    }));
    const _ = new FieldMask(s);
    return new ParsedUpdateData(o, _, i.fieldTransforms);
}

/** Parse update data from a list of field/value arguments. */ function __PRIVATE_parseUpdateVarargs(e, t, n, r, i, s) {
    const o = e.pu(1 /* UserDataSource.Update */ , t, n), _ = [ __PRIVATE_fieldPathFromArgument$1(t, r, n) ], a = [ i ];
    if (s.length % 2 != 0) throw new FirestoreError(v.INVALID_ARGUMENT, `Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);
    for (let e = 0; e < s.length; e += 2) _.push(__PRIVATE_fieldPathFromArgument$1(t, s[e])), 
    a.push(s[e + 1]);
    const u = [], c = ObjectValue.empty();
    // We iterate in reverse order to pick the last value for a field if the
    // user specified the field multiple times.
    for (let e = _.length - 1; e >= 0; --e) if (!__PRIVATE_fieldMaskContains(u, _[e])) {
        const t = _[e];
        let n = a[e];
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                n = T(n);
        const r = o.Ru(t);
        if (n instanceof __PRIVATE_DeleteFieldValueImpl) 
        // Add it to the field mask, but don't add anything to updateData.
        u.push(t); else {
            const e = __PRIVATE_parseData(n, r);
            null != e && (u.push(t), c.set(t, e));
        }
    }
    const l = new FieldMask(u);
    return new ParsedUpdateData(c, l, o.fieldTransforms);
}

/**
 * Parse a "query value" (e.g. value in a where filter or a value in a cursor
 * bound).
 *
 * @param allowArrays - Whether the query value is an array that may directly
 * contain additional arrays (e.g. the operand of an `in` query).
 */ function __PRIVATE_parseQueryValue(e, t, n, r = !1) {
    return __PRIVATE_parseData(n, e.pu(r ? 4 /* UserDataSource.ArrayArgument */ : 3 /* UserDataSource.Argument */ , t));
}

/**
 * Parses user data to Protobuf Values.
 *
 * @param input - Data to be parsed.
 * @param context - A context object representing the current path being parsed,
 * the source of the data being parsed, etc.
 * @returns The parsed value, or null if the value was a FieldValue sentinel
 * that should not be included in the resulting parsed data.
 */ function __PRIVATE_parseData(e, t) {
    if (__PRIVATE_looksLikeJsonObject(
    // Unwrap the API type from the Compat SDK. This will return the API type
    // from firestore-exp.
    e = T(e))) return __PRIVATE_validatePlainObject("Unsupported field value:", t, e), 
    __PRIVATE_parseObject(e, t);
    if (e instanceof FieldValue) 
    // FieldValues usually parse into transforms (except deleteField())
    // in which case we do not want to include this field in our parsed data
    // (as doing so will overwrite the field directly prior to the transform
    // trying to transform it). So we don't add this location to
    // context.fieldMask and we return null as our parsing result.
    /**
 * "Parses" the provided FieldValueImpl, adding any necessary transforms to
 * context.fieldTransforms.
 */
    return function __PRIVATE_parseSentinelFieldValue(e, t) {
        // Sentinels are only supported with writes, and not within arrays.
        if (!__PRIVATE_isWrite(t.Iu)) throw t.mu(`${e._methodName}() can only be used with update() and set()`);
        if (!t.path) throw t.mu(`${e._methodName}() is not currently supported inside arrays`);
        const n = e._toFieldTransform(t);
        n && t.fieldTransforms.push(n);
    }
    /**
 * Helper to parse a scalar value (i.e. not an Object, Array, or FieldValue)
 *
 * @returns The parsed value
 */ (e, t), null;
    if (void 0 === e && t.ignoreUndefinedProperties) 
    // If the input is undefined it can never participate in the fieldMask, so
    // don't handle this below. If `ignoreUndefinedProperties` is false,
    // `parseScalarValue` will reject an undefined value.
    return null;
    if (
    // If context.path is null we are inside an array and we don't support
    // field mask paths more granular than the top-level array.
    t.path && t.fieldMask.push(t.path), e instanceof Array) {
        // TODO(b/34871131): Include the path containing the array in the error
        // message.
        // In the case of IN queries, the parsed data is an array (representing
        // the set of values to be included for the IN query) that may directly
        // contain additional arrays (each representing an individual field
        // value), so we disable this validation.
        if (t.settings.du && 4 /* UserDataSource.ArrayArgument */ !== t.Iu) throw t.mu("Nested arrays are not supported");
        return function __PRIVATE_parseArray(e, t) {
            const n = [];
            let r = 0;
            for (const i of e) {
                let e = __PRIVATE_parseData(i, t.Vu(r));
                null == e && (
                // Just include nulls in the array for fields being replaced with a
                // sentinel.
                e = {
                    nullValue: "NULL_VALUE"
                }), n.push(e), r++;
            }
            return {
                arrayValue: {
                    values: n
                }
            };
        }(e, t);
    }
    return function __PRIVATE_parseScalarValue(e, t) {
        if (null === (e = T(e))) return {
            nullValue: "NULL_VALUE"
        };
        if ("number" == typeof e) return toNumber(t.serializer, e);
        if ("boolean" == typeof e) return {
            booleanValue: e
        };
        if ("string" == typeof e) return {
            stringValue: e
        };
        if (e instanceof Date) {
            const n = Timestamp.fromDate(e);
            return {
                timestampValue: toTimestamp(t.serializer, n)
            };
        }
        if (e instanceof Timestamp) {
            // Firestore backend truncates precision down to microseconds. To ensure
            // offline mode works the same with regards to truncation, perform the
            // truncation immediately without waiting for the backend to do that.
            const n = new Timestamp(e.seconds, 1e3 * Math.floor(e.nanoseconds / 1e3));
            return {
                timestampValue: toTimestamp(t.serializer, n)
            };
        }
        if (e instanceof GeoPoint) return {
            geoPointValue: {
                latitude: e.latitude,
                longitude: e.longitude
            }
        };
        if (e instanceof Bytes) return {
            bytesValue: __PRIVATE_toBytes(t.serializer, e._byteString)
        };
        if (e instanceof DocumentReference) {
            const n = t.databaseId, r = e.firestore._databaseId;
            if (!r.isEqual(n)) throw t.mu(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);
            return {
                referenceValue: __PRIVATE_toResourceName(e.firestore._databaseId || t.databaseId, e._key.path)
            };
        }
        throw t.mu(`Unsupported field value: ${__PRIVATE_valueDescription(e)}`);
    }
    /**
 * Checks whether an object looks like a JSON object that should be converted
 * into a struct. Normal class/prototype instances are considered to look like
 * JSON objects since they should be converted to a struct value. Arrays, Dates,
 * GeoPoints, etc. are not considered to look like JSON objects since they map
 * to specific FieldValue types other than ObjectValue.
 */ (e, t);
}

function __PRIVATE_parseObject(e, t) {
    const n = {};
    return isEmpty(e) ? 
    // If we encounter an empty object, we explicitly add it to the update
    // mask to ensure that the server creates a map entry.
    t.path && t.path.length > 0 && t.fieldMask.push(t.path) : forEach(e, ((e, r) => {
        const i = __PRIVATE_parseData(r, t.Eu(e));
        null != i && (n[e] = i);
    })), {
        mapValue: {
            fields: n
        }
    };
}

function __PRIVATE_looksLikeJsonObject(e) {
    return !("object" != typeof e || null === e || e instanceof Array || e instanceof Date || e instanceof Timestamp || e instanceof GeoPoint || e instanceof Bytes || e instanceof DocumentReference || e instanceof FieldValue);
}

function __PRIVATE_validatePlainObject(e, t, n) {
    if (!__PRIVATE_looksLikeJsonObject(n) || !function __PRIVATE_isPlainObject(e) {
        return "object" == typeof e && null !== e && (Object.getPrototypeOf(e) === Object.prototype || null === Object.getPrototypeOf(e));
    }(n)) {
        const r = __PRIVATE_valueDescription(n);
        throw "an object" === r ? t.mu(e + " a custom object") : t.mu(e + " " + r);
    }
}

/**
 * Helper that calls fromDotSeparatedString() but wraps any error thrown.
 */ function __PRIVATE_fieldPathFromArgument$1(e, t, n) {
    if ((
    // If required, replace the FieldPath Compat class with with the firestore-exp
    // FieldPath.
    t = T(t)) instanceof FieldPath) return t._internalPath;
    if ("string" == typeof t) return __PRIVATE_fieldPathFromDotSeparatedString(e, t);
    throw __PRIVATE_createError("Field path arguments must be of type string or ", e, 
    /* hasConverter= */ !1, 
    /* path= */ void 0, n);
}

/**
 * Matches any characters in a field path string that are reserved.
 */ const we = new RegExp("[~\\*/\\[\\]]");

/**
 * Wraps fromDotSeparatedString with an error message about the method that
 * was thrown.
 * @param methodName - The publicly visible method name
 * @param path - The dot-separated string form of a field path which will be
 * split on dots.
 * @param targetDoc - The document against which the field path will be
 * evaluated.
 */ function __PRIVATE_fieldPathFromDotSeparatedString(e, t, n) {
    if (t.search(we) >= 0) throw __PRIVATE_createError(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`, e, 
    /* hasConverter= */ !1, 
    /* path= */ void 0, n);
    try {
        return new FieldPath(...t.split("."))._internalPath;
    } catch (r) {
        throw __PRIVATE_createError(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, e, 
        /* hasConverter= */ !1, 
        /* path= */ void 0, n);
    }
}

function __PRIVATE_createError(e, t, n, r, i) {
    const s = r && !r.isEmpty(), o = void 0 !== i;
    let _ = `Function ${t}() called with invalid data`;
    n && (_ += " (via `toFirestore()`)"), _ += ". ";
    let a = "";
    return (s || o) && (a += " (found", s && (a += ` in field ${r}`), o && (a += ` in document ${i}`), 
    a += ")"), new FirestoreError(v.INVALID_ARGUMENT, _ + e + a);
}

/** Checks `haystack` if FieldPath `needle` is present. Runs in O(n). */ function __PRIVATE_fieldMaskContains(e, t) {
    return e.some((e => e.isEqual(t)));
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
 */ class DocumentSnapshot$1 {
    // Note: This class is stripped down version of the DocumentSnapshot in
    // the legacy SDK. The changes are:
    // - No support for SnapshotMetadata.
    // - No support for SnapshotOptions.
    /** @hideconstructor protected */
    constructor(e, t, n, r, i) {
        this._firestore = e, this._userDataWriter = t, this._key = n, this._document = r, 
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
                const e = new QueryDocumentSnapshot$1(this._firestore, this._userDataWriter, this._key, this._document, 
                /* converter= */ null);
                return this._converter.fromFirestore(e);
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
    get(e) {
        if (this._document) {
            const t = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
            if (null !== t) return this._userDataWriter.convertValue(t);
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
 */ class QueryDocumentSnapshot$1 extends DocumentSnapshot$1 {
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
 * Helper that calls `fromDotSeparatedString()` but wraps any error thrown.
 */ function __PRIVATE_fieldPathFromArgument(e, t) {
    return "string" == typeof t ? __PRIVATE_fieldPathFromDotSeparatedString(e, t) : t instanceof FieldPath ? t._internalPath : t._delegate._internalPath;
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
 */ function __PRIVATE_validateHasExplicitOrderByForLimitToLast(e) {
    if ("L" /* LimitType.Last */ === e.limitType && 0 === e.explicitOrderBy.length) throw new FirestoreError(v.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
}

/**
 * An `AppliableConstraint` is an abstraction of a constraint that can be applied
 * to a Firestore query.
 */ class AppliableConstraint {}

/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */ class QueryConstraint extends AppliableConstraint {}

function query(e, t, ...n) {
    let r = [];
    t instanceof AppliableConstraint && r.push(t), r = r.concat(n), function __PRIVATE_validateQueryConstraintArray(e) {
        const t = e.filter((e => e instanceof QueryCompositeFilterConstraint)).length, n = e.filter((e => e instanceof QueryFieldFilterConstraint)).length;
        if (t > 1 || t > 0 && n > 0) throw new FirestoreError(v.INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
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
 */ (r);
    for (const t of r) e = t._apply(e);
    return e;
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
    constructor(e, t, n) {
        super(), this._field = e, this._op = t, this._value = n, 
        /** The type of this query constraint */
        this.type = "where";
    }
    static _create(e, t, n) {
        return new QueryFieldFilterConstraint(e, t, n);
    }
    _apply(e) {
        const t = this._parse(e);
        return __PRIVATE_validateNewFieldFilter(e._query, t), new Query(e.firestore, e.converter, __PRIVATE_queryWithAddedFilter(e._query, t));
    }
    _parse(e) {
        const t = __PRIVATE_newUserDataReader(e.firestore), n = function __PRIVATE_newQueryFilter(e, t, n, r, i, s, o) {
            let _;
            if (i.isKeyField()) {
                if ("array-contains" /* Operator.ARRAY_CONTAINS */ === s || "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === s) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid Query. You can't perform '${s}' queries on documentId().`);
                if ("in" /* Operator.IN */ === s || "not-in" /* Operator.NOT_IN */ === s) {
                    __PRIVATE_validateDisjunctiveFilterElements(o, s);
                    const t = [];
                    for (const n of o) t.push(__PRIVATE_parseDocumentIdValue(r, e, n));
                    _ = {
                        arrayValue: {
                            values: t
                        }
                    };
                } else _ = __PRIVATE_parseDocumentIdValue(r, e, o);
            } else "in" /* Operator.IN */ !== s && "not-in" /* Operator.NOT_IN */ !== s && "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ !== s || __PRIVATE_validateDisjunctiveFilterElements(o, s), 
            _ = __PRIVATE_parseQueryValue(n, t, o, 
            /* allowArrays= */ "in" /* Operator.IN */ === s || "not-in" /* Operator.NOT_IN */ === s);
            return FieldFilter.create(i, s, _);
        }(e._query, "where", t, e.firestore._databaseId, this._field, this._op, this._value);
        return n;
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
 */ function where(e, t, n) {
    const r = t, i = __PRIVATE_fieldPathFromArgument("where", e);
    return QueryFieldFilterConstraint._create(i, r, n);
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
    e, t) {
        super(), this.type = e, this._queryConstraints = t;
    }
    static _create(e, t) {
        return new QueryCompositeFilterConstraint(e, t);
    }
    _parse(e) {
        const t = this._queryConstraints.map((t => t._parse(e))).filter((e => e.getFilters().length > 0));
        return 1 === t.length ? t[0] : CompositeFilter.create(t, this._getOperator());
    }
    _apply(e) {
        const t = this._parse(e);
        return 0 === t.getFilters().length ? e : (function __PRIVATE_validateNewFilter(e, t) {
            let n = e;
            const r = t.getFlattenedFilters();
            for (const e of r) __PRIVATE_validateNewFieldFilter(n, e), n = __PRIVATE_queryWithAddedFilter(n, e);
        }
        // Checks if any of the provided filter operators are included in the given list of filters and
        // returns the first one that is, or null if none are.
        (e._query, t), new Query(e.firestore, e.converter, __PRIVATE_queryWithAddedFilter(e._query, t)));
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
 */ function or(...e) {
    // Only support QueryFilterConstraints
    return e.forEach((e => __PRIVATE_validateQueryFilterConstraint("or", e))), QueryCompositeFilterConstraint._create("or" /* CompositeOperator.OR */ , e);
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
 */ function and(...e) {
    // Only support QueryFilterConstraints
    return e.forEach((e => __PRIVATE_validateQueryFilterConstraint("and", e))), QueryCompositeFilterConstraint._create("and" /* CompositeOperator.AND */ , e);
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
    constructor(e, t) {
        super(), this._field = e, this._direction = t, 
        /** The type of this query constraint */
        this.type = "orderBy";
    }
    static _create(e, t) {
        return new QueryOrderByConstraint(e, t);
    }
    _apply(e) {
        const t = function __PRIVATE_newQueryOrderBy(e, t, n) {
            if (null !== e.startAt) throw new FirestoreError(v.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
            if (null !== e.endAt) throw new FirestoreError(v.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
            return new OrderBy(t, n);
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
 */ (e._query, this._field, this._direction);
        return new Query(e.firestore, e.converter, function __PRIVATE_queryWithAddedOrderBy(e, t) {
            // TODO(dimond): validate that orderBy does not list the same key twice.
            const n = e.explicitOrderBy.concat([ t ]);
            return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, n, e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
        }(e._query, t));
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
 */ function orderBy(e, t = "asc") {
    const n = t, r = __PRIVATE_fieldPathFromArgument("orderBy", e);
    return QueryOrderByConstraint._create(r, n);
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
    e, t, n) {
        super(), this.type = e, this._limit = t, this._limitType = n;
    }
    static _create(e, t, n) {
        return new QueryLimitConstraint(e, t, n);
    }
    _apply(e) {
        return new Query(e.firestore, e.converter, __PRIVATE_queryWithLimit(e._query, this._limit, this._limitType));
    }
}

/**
 * Creates a {@link QueryLimitConstraint} that only returns the first matching
 * documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */ function limit(e) {
    return __PRIVATE_validatePositiveNumber("limit", e), QueryLimitConstraint._create("limit", e, "F" /* LimitType.First */);
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
 */ function limitToLast(e) {
    return __PRIVATE_validatePositiveNumber("limitToLast", e), QueryLimitConstraint._create("limitToLast", e, "L" /* LimitType.Last */);
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
    e, t, n) {
        super(), this.type = e, this._docOrFields = t, this._inclusive = n;
    }
    static _create(e, t, n) {
        return new QueryStartAtConstraint(e, t, n);
    }
    _apply(e) {
        const t = __PRIVATE_newQueryBoundFromDocOrFields(e, this.type, this._docOrFields, this._inclusive);
        return new Query(e.firestore, e.converter, function __PRIVATE_queryWithStartAt(e, t) {
            return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, t, e.endAt);
        }(e._query, t));
    }
}

function startAt(...e) {
    return QueryStartAtConstraint._create("startAt", e, 
    /*inclusive=*/ !0);
}

function startAfter(...e) {
    return QueryStartAtConstraint._create("startAfter", e, 
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
    e, t, n) {
        super(), this.type = e, this._docOrFields = t, this._inclusive = n;
    }
    static _create(e, t, n) {
        return new QueryEndAtConstraint(e, t, n);
    }
    _apply(e) {
        const t = __PRIVATE_newQueryBoundFromDocOrFields(e, this.type, this._docOrFields, this._inclusive);
        return new Query(e.firestore, e.converter, function __PRIVATE_queryWithEndAt(e, t) {
            return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, e.startAt, t);
        }(e._query, t));
    }
}

function endBefore(...e) {
    return QueryEndAtConstraint._create("endBefore", e, 
    /*inclusive=*/ !1);
}

function endAt(...e) {
    return QueryEndAtConstraint._create("endAt", e, 
    /*inclusive=*/ !0);
}

/** Helper function to create a bound from a document or fields */ function __PRIVATE_newQueryBoundFromDocOrFields(e, t, n, r) {
    if (n[0] = T(n[0]), n[0] instanceof DocumentSnapshot$1) return function __PRIVATE_newQueryBoundFromDocument(e, t, n, r, i) {
        if (!r) throw new FirestoreError(v.NOT_FOUND, `Can't use a DocumentSnapshot that doesn't exist for ${n}().`);
        const s = [];
        // Because people expect to continue/end a query at the exact document
        // provided, we need to use the implicit sort order rather than the explicit
        // sort order, because it's guaranteed to contain the document key. That way
        // the position becomes unambiguous and the query continues/ends exactly at
        // the provided document. Without the key (by using the explicit sort
        // orders), multiple documents could match the position, yielding duplicate
        // results.
                for (const n of __PRIVATE_queryNormalizedOrderBy(e)) if (n.field.isKeyField()) s.push(__PRIVATE_refValue(t, r.key)); else {
            const e = r.data.field(n.field);
            if (__PRIVATE_isServerTimestamp(e)) throw new FirestoreError(v.INVALID_ARGUMENT, 'Invalid query. You are trying to start or end a query using a document for which the field "' + n.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');
            if (null === e) {
                const e = n.field.canonicalString();
                throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid query. You are trying to start or end a query using a document for which the field '${e}' (used as the orderBy) does not exist.`);
            }
            s.push(e);
        }
        return new Bound(s, i);
    }
    /**
 * Converts a list of field values to a `Bound` for the given query.
 */ (e._query, e.firestore._databaseId, t, n[0]._document, r);
    {
        const i = __PRIVATE_newUserDataReader(e.firestore);
        return function __PRIVATE_newQueryBoundFromFields(e, t, n, r, i, s) {
            // Use explicit order by's because it has to match the query the user made
            const o = e.explicitOrderBy;
            if (i.length > o.length) throw new FirestoreError(v.INVALID_ARGUMENT, `Too many arguments provided to ${r}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);
            const _ = [];
            for (let s = 0; s < i.length; s++) {
                const a = i[s];
                if (o[s].field.isKeyField()) {
                    if ("string" != typeof a) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid query. Expected a string for document ID in ${r}(), but got a ${typeof a}`);
                    if (!__PRIVATE_isCollectionGroupQuery(e) && -1 !== a.indexOf("/")) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid query. When querying a collection and ordering by documentId(), the value passed to ${r}() must be a plain document ID, but '${a}' contains a slash.`);
                    const n = e.path.child(ResourcePath.fromString(a));
                    if (!DocumentKey.isDocumentKey(n)) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${r}() must result in a valid document path, but '${n}' is not because it contains an odd number of segments.`);
                    const i = new DocumentKey(n);
                    _.push(__PRIVATE_refValue(t, i));
                } else {
                    const e = __PRIVATE_parseQueryValue(n, r, a);
                    _.push(e);
                }
            }
            return new Bound(_, s);
        }
        /**
 * Parses the given `documentIdValue` into a `ReferenceValue`, throwing
 * appropriate errors if the value is anything other than a `DocumentReference`
 * or `string`, or if the string is malformed.
 */ (e._query, e.firestore._databaseId, i, t, n, r);
    }
}

function __PRIVATE_parseDocumentIdValue(e, t, n) {
    if ("string" == typeof (n = T(n))) {
        if ("" === n) throw new FirestoreError(v.INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
        if (!__PRIVATE_isCollectionGroupQuery(t) && -1 !== n.indexOf("/")) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);
        const r = t.path.child(ResourcePath.fromString(n));
        if (!DocumentKey.isDocumentKey(r)) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);
        return __PRIVATE_refValue(e, new DocumentKey(r));
    }
    if (n instanceof DocumentReference) return __PRIVATE_refValue(e, n._key);
    throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${__PRIVATE_valueDescription(n)}.`);
}

/**
 * Validates that the value passed into a disjunctive filter satisfies all
 * array requirements.
 */ function __PRIVATE_validateDisjunctiveFilterElements(e, t) {
    if (!Array.isArray(e) || 0 === e.length) throw new FirestoreError(v.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${t.toString()}' filters.`);
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
 */ function __PRIVATE_validateNewFieldFilter(e, t) {
    const n = function __PRIVATE_findOpInsideFilters(e, t) {
        for (const n of e) for (const e of n.getFlattenedFilters()) if (t.indexOf(e.op) >= 0) return e.op;
        return null;
    }(e.filters, function __PRIVATE_conflictingOps(e) {
        switch (e) {
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
    }(t.op));
    if (null !== n) 
    // Special case when it's a duplicate op to give a slightly clearer error message.
    throw n === t.op ? new FirestoreError(v.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${t.op.toString()}' filter.`) : new FirestoreError(v.INVALID_ARGUMENT, `Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`);
}

function __PRIVATE_validateQueryFilterConstraint(e, t) {
    if (!(t instanceof QueryFieldFilterConstraint || t instanceof QueryCompositeFilterConstraint)) throw new FirestoreError(v.INVALID_ARGUMENT, `Function ${e}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`);
}

class AbstractUserDataWriter {
    convertValue(e, t = "none") {
        switch (__PRIVATE_typeOrder(e)) {
          case 0 /* TypeOrder.NullValue */ :
            return null;

          case 1 /* TypeOrder.BooleanValue */ :
            return e.booleanValue;

          case 2 /* TypeOrder.NumberValue */ :
            return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);

          case 3 /* TypeOrder.TimestampValue */ :
            return this.convertTimestamp(e.timestampValue);

          case 4 /* TypeOrder.ServerTimestampValue */ :
            return this.convertServerTimestamp(e, t);

          case 5 /* TypeOrder.StringValue */ :
            return e.stringValue;

          case 6 /* TypeOrder.BlobValue */ :
            return this.convertBytes(__PRIVATE_normalizeByteString(e.bytesValue));

          case 7 /* TypeOrder.RefValue */ :
            return this.convertReference(e.referenceValue);

          case 8 /* TypeOrder.GeoPointValue */ :
            return this.convertGeoPoint(e.geoPointValue);

          case 9 /* TypeOrder.ArrayValue */ :
            return this.convertArray(e.arrayValue, t);

          case 10 /* TypeOrder.ObjectValue */ :
            return this.convertObject(e.mapValue, t);

          default:
            throw fail();
        }
    }
    convertObject(e, t) {
        return this.convertObjectMap(e.fields, t);
    }
    /**
     * @internal
     */    convertObjectMap(e, t = "none") {
        const n = {};
        return forEach(e, ((e, r) => {
            n[e] = this.convertValue(r, t);
        })), n;
    }
    convertGeoPoint(e) {
        return new GeoPoint(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(e.longitude));
    }
    convertArray(e, t) {
        return (e.values || []).map((e => this.convertValue(e, t)));
    }
    convertServerTimestamp(e, t) {
        switch (t) {
          case "previous":
            const n = __PRIVATE_getPreviousValue(e);
            return null == n ? null : this.convertValue(n, t);

          case "estimate":
            return this.convertTimestamp(__PRIVATE_getLocalWriteTime(e));

          default:
            return null;
        }
    }
    convertTimestamp(e) {
        const t = __PRIVATE_normalizeTimestamp(e);
        return new Timestamp(t.seconds, t.nanos);
    }
    convertDocumentKey(e, t) {
        const n = ResourcePath.fromString(e);
        __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(n));
        const r = new DatabaseId(n.get(1), n.get(3)), i = new DocumentKey(n.popFirst(5));
        return r.isEqual(t) || 
        // TODO(b/64130202): Somehow support foreign references.
        __PRIVATE_logError(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), 
        i;
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
 * Converts custom model object of type T into `DocumentData` by applying the
 * converter if it exists.
 *
 * This function is used when converting user objects to `DocumentData`
 * because we want to provide the user with a more specific error message if
 * their `set()` or fails due to invalid data originating from a `toFirestore()`
 * call.
 */ function __PRIVATE_applyFirestoreDataConverter(e, t, n) {
    let r;
    // Cast to `any` in order to satisfy the union type constraint on
    // toFirestore().
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return r = e ? n && (n.merge || n.mergeFields) ? e.toFirestore(t, n) : e.toFirestore(t) : t, 
    r;
}

class __PRIVATE_LiteUserDataWriter extends AbstractUserDataWriter {
    constructor(e) {
        super(), this.firestore = e;
    }
    convertBytes(e) {
        return new Bytes(e);
    }
    convertReference(e) {
        const t = this.convertDocumentKey(e, this.firestore._databaseId);
        return new DocumentReference(this.firestore, /* converter= */ null, t);
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
 * Create an AggregateField object that can be used to compute the sum of
 * a specified field over a range of documents in the result set of a query.
 * @param field Specifies the field to sum across the result set.
 */ function sum(e) {
    return new AggregateField("sum", __PRIVATE_fieldPathFromArgument$1("sum", e));
}

/**
 * Create an AggregateField object that can be used to compute the average of
 * a specified field over a range of documents in the result set of a query.
 * @param field Specifies the field to average across the result set.
 */ function average(e) {
    return new AggregateField("avg", __PRIVATE_fieldPathFromArgument$1("average", e));
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
 */ function aggregateFieldEqual(e, t) {
    var n, r;
    return e instanceof AggregateField && t instanceof AggregateField && e.aggregateType === t.aggregateType && (null === (n = e._internalFieldPath) || void 0 === n ? void 0 : n.canonicalString()) === (null === (r = t._internalFieldPath) || void 0 === r ? void 0 : r.canonicalString());
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
 */ function aggregateQuerySnapshotEqual(e, t) {
    return queryEqual(e.query, t.query) && E(e.data(), t.data());
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
 * Metadata about a snapshot, describing the state of the snapshot.
 */ class SnapshotMetadata {
    /** @hideconstructor */
    constructor(e, t) {
        this.hasPendingWrites = e, this.fromCache = t;
    }
    /**
     * Returns true if this `SnapshotMetadata` is equal to the provided one.
     *
     * @param other - The `SnapshotMetadata` to compare against.
     * @returns true if this `SnapshotMetadata` is equal to the provided one.
     */    isEqual(e) {
        return this.hasPendingWrites === e.hasPendingWrites && this.fromCache === e.fromCache;
    }
}

/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */ class DocumentSnapshot extends DocumentSnapshot$1 {
    /** @hideconstructor protected */
    constructor(e, t, n, r, i, s) {
        super(e, t, n, r, s), this._firestore = e, this._firestoreImpl = e, this.metadata = i;
    }
    /**
     * Returns whether or not the data exists. True if the document exists.
     */    exists() {
        return super.exists();
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document or `undefined` if
     * the document doesn't exist.
     */    data(e = {}) {
        if (this._document) {
            if (this._converter) {
                // We only want to use the converter and create a new DocumentSnapshot
                // if a converter has been provided.
                const t = new QueryDocumentSnapshot(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, 
                /* converter= */ null);
                return this._converter.fromFirestore(t, e);
            }
            return this._userDataWriter.convertValue(this._document.data.value, e.serverTimestamps);
        }
    }
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * By default, a `serverTimestamp()` that has not yet been set to
     * its final value will be returned as `null`. You can override this by
     * passing an options object.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @param options - An options object to configure how the field is retrieved
     * from the snapshot (for example the desired behavior for server timestamps
     * that have not yet been set to their final value).
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(e, t = {}) {
        if (this._document) {
            const n = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
            if (null !== n) return this._userDataWriter.convertValue(n, t.serverTimestamps);
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
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @override
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document.
     */
    data(e = {}) {
        return super.data(e);
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
    constructor(e, t, n, r) {
        this._firestore = e, this._userDataWriter = t, this._snapshot = r, this.metadata = new SnapshotMetadata(r.hasPendingWrites, r.fromCache), 
        this.query = n;
    }
    /** An array of all the documents in the `QuerySnapshot`. */    get docs() {
        const e = [];
        return this.forEach((t => e.push(t))), e;
    }
    /** The number of documents in the `QuerySnapshot`. */    get size() {
        return this._snapshot.docs.size;
    }
    /** True if there are no documents in the `QuerySnapshot`. */    get empty() {
        return 0 === this.size;
    }
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */    forEach(e, t) {
        this._snapshot.docs.forEach((n => {
            e.call(t, new QueryDocumentSnapshot(this._firestore, this._userDataWriter, n.key, n, new SnapshotMetadata(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
        }));
    }
    /**
     * Returns an array of the documents changes since the last snapshot. If this
     * is the first snapshot, all documents will be in the list as 'added'
     * changes.
     *
     * @param options - `SnapshotListenOptions` that control whether metadata-only
     * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
     * snapshot events.
     */    docChanges(e = {}) {
        const t = !!e.includeMetadataChanges;
        if (t && this._snapshot.excludesMetadataChanges) throw new FirestoreError(v.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
        return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === t || (this._cachedChanges = 
        /** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */
        function __PRIVATE_changesFromSnapshot(e, t) {
            if (e._snapshot.oldDocs.isEmpty()) {
                let t = 0;
                return e._snapshot.docChanges.map((n => {
                    const r = new QueryDocumentSnapshot(e._firestore, e._userDataWriter, n.doc.key, n.doc, new SnapshotMetadata(e._snapshot.mutatedKeys.has(n.doc.key), e._snapshot.fromCache), e.query.converter);
                    return n.doc, {
                        type: "added",
                        doc: r,
                        oldIndex: -1,
                        newIndex: t++
                    };
                }));
            }
            {
                // A `DocumentSet` that is updated incrementally as changes are applied to use
                // to lookup the index of a document.
                let n = e._snapshot.oldDocs;
                return e._snapshot.docChanges.filter((e => t || 3 /* ChangeType.Metadata */ !== e.type)).map((t => {
                    const r = new QueryDocumentSnapshot(e._firestore, e._userDataWriter, t.doc.key, t.doc, new SnapshotMetadata(e._snapshot.mutatedKeys.has(t.doc.key), e._snapshot.fromCache), e.query.converter);
                    let i = -1, s = -1;
                    return 0 /* ChangeType.Added */ !== t.type && (i = n.indexOf(t.doc.key), n = n.delete(t.doc.key)), 
                    1 /* ChangeType.Removed */ !== t.type && (n = n.add(t.doc), s = n.indexOf(t.doc.key)), 
                    {
                        type: __PRIVATE_resultChangeType(t.type),
                        doc: r,
                        oldIndex: i,
                        newIndex: s
                    };
                }));
            }
        }(this, t), this._cachedChangesIncludeMetadataChanges = t), this._cachedChanges;
    }
}

function __PRIVATE_resultChangeType(e) {
    switch (e) {
      case 0 /* ChangeType.Added */ :
        return "added";

      case 2 /* ChangeType.Modified */ :
      case 3 /* ChangeType.Metadata */ :
        return "modified";

      case 1 /* ChangeType.Removed */ :
        return "removed";

      default:
        return fail();
    }
}

// TODO(firestoreexp): Add tests for snapshotEqual with different snapshot
// metadata
/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */ function snapshotEqual(e, t) {
    return e instanceof DocumentSnapshot && t instanceof DocumentSnapshot ? e._firestore === t._firestore && e._key.isEqual(t._key) && (null === e._document ? null === t._document : e._document.isEqual(t._document)) && e._converter === t._converter : e instanceof QuerySnapshot && t instanceof QuerySnapshot && (e._firestore === t._firestore && queryEqual(e.query, t.query) && e.metadata.isEqual(t.metadata) && e._snapshot.isEqual(t._snapshot));
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
 * Reads the document referred to by this `DocumentReference`.
 *
 * Note: `getDoc()` attempts to provide up-to-date data when possible by waiting
 * for data from the server, but it may return cached data or fail if you are
 * offline and the server cannot be reached. To specify this behavior, invoke
 * {@link getDocFromCache} or {@link getDocFromServer}.
 *
 * @param reference - The reference of the document to fetch.
 * @returns A Promise resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */ function getDoc(e) {
    e = __PRIVATE_cast(e, DocumentReference);
    const t = __PRIVATE_cast(e.firestore, Firestore);
    return __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(ensureFirestoreConfigured(t), e._key).then((n => __PRIVATE_convertToDocSnapshot(t, e, n)));
}

class __PRIVATE_ExpUserDataWriter extends AbstractUserDataWriter {
    constructor(e) {
        super(), this.firestore = e;
    }
    convertBytes(e) {
        return new Bytes(e);
    }
    convertReference(e) {
        const t = this.convertDocumentKey(e, this.firestore._databaseId);
        return new DocumentReference(this.firestore, /* converter= */ null, t);
    }
}

/**
 * Reads the document referred to by this `DocumentReference` from cache.
 * Returns an error if the document is not currently cached.
 *
 * @returns A `Promise` resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */ function getDocFromCache(e) {
    e = __PRIVATE_cast(e, DocumentReference);
    const t = __PRIVATE_cast(e.firestore, Firestore), n = ensureFirestoreConfigured(t), r = new __PRIVATE_ExpUserDataWriter(t);
    return __PRIVATE_firestoreClientGetDocumentFromLocalCache(n, e._key).then((n => new DocumentSnapshot(t, r, e._key, n, new SnapshotMetadata(null !== n && n.hasLocalMutations, 
    /* fromCache= */ !0), e.converter)));
}

/**
 * Reads the document referred to by this `DocumentReference` from the server.
 * Returns an error if the network is not available.
 *
 * @returns A `Promise` resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */ function getDocFromServer(e) {
    e = __PRIVATE_cast(e, DocumentReference);
    const t = __PRIVATE_cast(e.firestore, Firestore);
    return __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(ensureFirestoreConfigured(t), e._key, {
        source: "server"
    }).then((n => __PRIVATE_convertToDocSnapshot(t, e, n)));
}

/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 *
 * Note: `getDocs()` attempts to provide up-to-date data when possible by
 * waiting for data from the server, but it may return cached data or fail if
 * you are offline and the server cannot be reached. To specify this behavior,
 * invoke {@link getDocsFromCache} or {@link getDocsFromServer}.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */ function getDocs(e) {
    e = __PRIVATE_cast(e, Query);
    const t = __PRIVATE_cast(e.firestore, Firestore), n = ensureFirestoreConfigured(t), r = new __PRIVATE_ExpUserDataWriter(t);
    return __PRIVATE_validateHasExplicitOrderByForLimitToLast(e._query), __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(n, e._query).then((n => new QuerySnapshot(t, r, e, n)));
}

/**
 * Executes the query and returns the results as a `QuerySnapshot` from cache.
 * Returns an empty result set if no documents matching the query are currently
 * cached.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */ function getDocsFromCache(e) {
    e = __PRIVATE_cast(e, Query);
    const t = __PRIVATE_cast(e.firestore, Firestore), n = ensureFirestoreConfigured(t), r = new __PRIVATE_ExpUserDataWriter(t);
    return __PRIVATE_firestoreClientGetDocumentsFromLocalCache(n, e._query).then((n => new QuerySnapshot(t, r, e, n)));
}

/**
 * Executes the query and returns the results as a `QuerySnapshot` from the
 * server. Returns an error if the network is not available.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */ function getDocsFromServer(e) {
    e = __PRIVATE_cast(e, Query);
    const t = __PRIVATE_cast(e.firestore, Firestore), n = ensureFirestoreConfigured(t), r = new __PRIVATE_ExpUserDataWriter(t);
    return __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(n, e._query, {
        source: "server"
    }).then((n => new QuerySnapshot(t, r, e, n)));
}

function setDoc(e, t, n) {
    e = __PRIVATE_cast(e, DocumentReference);
    const r = __PRIVATE_cast(e.firestore, Firestore), i = __PRIVATE_applyFirestoreDataConverter(e.converter, t, n);
    return executeWrite(r, [ __PRIVATE_parseSetData(__PRIVATE_newUserDataReader(r), "setDoc", e._key, i, null !== e.converter, n).toMutation(e._key, Precondition.none()) ]);
}

function updateDoc(e, t, n, ...r) {
    e = __PRIVATE_cast(e, DocumentReference);
    const i = __PRIVATE_cast(e.firestore, Firestore), s = __PRIVATE_newUserDataReader(i);
    let o;
    o = "string" == typeof (
    // For Compat types, we have to "extract" the underlying types before
    // performing validation.
    t = T(t)) || t instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(s, "updateDoc", e._key, t, n, r) : __PRIVATE_parseUpdateData(s, "updateDoc", e._key, t);
    return executeWrite(i, [ o.toMutation(e._key, Precondition.exists(!0)) ]);
}

/**
 * Deletes the document referred to by the specified `DocumentReference`.
 *
 * @param reference - A reference to the document to delete.
 * @returns A Promise resolved once the document has been successfully
 * deleted from the backend (note that it won't resolve while you're offline).
 */ function deleteDoc(e) {
    return executeWrite(__PRIVATE_cast(e.firestore, Firestore), [ new __PRIVATE_DeleteMutation(e._key, Precondition.none()) ]);
}

/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @returns A `Promise` resolved with a `DocumentReference` pointing to the
 * newly created document after it has been written to the backend (Note that it
 * won't resolve while you're offline).
 */ function addDoc(e, t) {
    const n = __PRIVATE_cast(e.firestore, Firestore), r = doc(e), i = __PRIVATE_applyFirestoreDataConverter(e.converter, t);
    return executeWrite(n, [ __PRIVATE_parseSetData(__PRIVATE_newUserDataReader(e.firestore), "addDoc", r._key, i, null !== e.converter, {}).toMutation(r._key, Precondition.exists(!1)) ]).then((() => r));
}

function onSnapshot(e, ...t) {
    var n, r, i;
    e = T(e);
    let s = {
        includeMetadataChanges: !1
    }, o = 0;
    "object" != typeof t[o] || __PRIVATE_isPartialObserver(t[o]) || (s = t[o], o++);
    const _ = {
        includeMetadataChanges: s.includeMetadataChanges
    };
    if (__PRIVATE_isPartialObserver(t[o])) {
        const e = t[o];
        t[o] = null === (n = e.next) || void 0 === n ? void 0 : n.bind(e), t[o + 1] = null === (r = e.error) || void 0 === r ? void 0 : r.bind(e), 
        t[o + 2] = null === (i = e.complete) || void 0 === i ? void 0 : i.bind(e);
    }
    let a, u, c;
    if (e instanceof DocumentReference) u = __PRIVATE_cast(e.firestore, Firestore), 
    c = __PRIVATE_newQueryForPath(e._key.path), a = {
        next: n => {
            t[o] && t[o](__PRIVATE_convertToDocSnapshot(u, e, n));
        },
        error: t[o + 1],
        complete: t[o + 2]
    }; else {
        const n = __PRIVATE_cast(e, Query);
        u = __PRIVATE_cast(n.firestore, Firestore), c = n._query;
        const r = new __PRIVATE_ExpUserDataWriter(u);
        a = {
            next: e => {
                t[o] && t[o](new QuerySnapshot(u, r, n, e));
            },
            error: t[o + 1],
            complete: t[o + 2]
        }, __PRIVATE_validateHasExplicitOrderByForLimitToLast(e._query);
    }
    return function __PRIVATE_firestoreClientListen(e, t, n, r) {
        const i = new __PRIVATE_AsyncObserver(r), s = new __PRIVATE_QueryListener(t, i, n);
        return e.asyncQueue.enqueueAndForget((async () => __PRIVATE_eventManagerListen(await __PRIVATE_getEventManager(e), s))), 
        () => {
            i.Na(), e.asyncQueue.enqueueAndForget((async () => __PRIVATE_eventManagerUnlisten(await __PRIVATE_getEventManager(e), s)));
        };
    }(ensureFirestoreConfigured(u), c, _, a);
}

function onSnapshotsInSync(e, t) {
    return __PRIVATE_firestoreClientAddSnapshotsInSyncListener(ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)), __PRIVATE_isPartialObserver(t) ? t : {
        next: t
    });
}

/**
 * Locally writes `mutations` on the async queue.
 * @internal
 */ function executeWrite(e, t) {
    return function __PRIVATE_firestoreClientWrite(e, t) {
        const n = new __PRIVATE_Deferred;
        return e.asyncQueue.enqueueAndForget((async () => __PRIVATE_syncEngineWrite(await __PRIVATE_getSyncEngine(e), t, n))), 
        n.promise;
    }(ensureFirestoreConfigured(e), t);
}

/**
 * Converts a {@link ViewSnapshot} that contains the single document specified by `ref`
 * to a {@link DocumentSnapshot}.
 */ function __PRIVATE_convertToDocSnapshot(e, t, n) {
    const r = n.docs.get(t._key), i = new __PRIVATE_ExpUserDataWriter(e);
    return new DocumentSnapshot(e, i, t._key, r, new SnapshotMetadata(n.hasPendingWrites, n.fromCache), t.converter);
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
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used: every request using this source necessarily involves a round trip to
 * the server.
 *
 * @param query - The query whose result set size to calculate.
 * @returns A Promise that will be resolved with the count; the count can be
 * retrieved from `snapshot.data().count`, where `snapshot` is the
 * `AggregateQuerySnapshot` to which the returned Promise resolves.
 */ function getCountFromServer(e) {
    return getAggregateFromServer(e, {
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
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used: every request using this source necessarily involves a round trip to
 * the server.
 *
 * @param query The query whose result set to aggregate over.
 * @param aggregateSpec An `AggregateSpec` object that specifies the aggregates
 * to perform over the result set. The AggregateSpec specifies aliases for each
 * aggregate, which can be used to retrieve the aggregate result.
 * @example
 * ```typescript
 * const aggregateSnapshot = await getAggregateFromServer(query, {
 *   countOfDocs: count(),
 *   totalHours: sum('hours'),
 *   averageScore: average('score')
 * });
 *
 * const countOfDocs: number = aggregateSnapshot.data().countOfDocs;
 * const totalHours: number = aggregateSnapshot.data().totalHours;
 * const averageScore: number | null = aggregateSnapshot.data().averageScore;
 * ```
 */ function getAggregateFromServer(e, t) {
    const n = __PRIVATE_cast(e.firestore, Firestore), r = ensureFirestoreConfigured(n), i = function __PRIVATE_mapToArray(e, t) {
        const n = [];
        for (const r in e) Object.prototype.hasOwnProperty.call(e, r) && n.push(t(e[r], r, e));
        return n;
    }(t, ((e, t) => new __PRIVATE_AggregateImpl(t, e.aggregateType, e._internalFieldPath)));
    // Run the aggregation and convert the results
    return function __PRIVATE_firestoreClientRunAggregateQuery(e, t, n) {
        const r = new __PRIVATE_Deferred;
        return e.asyncQueue.enqueueAndForget((async () => {
            // Implement and call executeAggregateQueryViaSnapshotListener, similar
            // to the implementation in firestoreClientGetDocumentsViaSnapshotListener
            // above
            try {
                // TODO(b/277628384): check `canUseNetwork()` and handle multi-tab.
                const i = await __PRIVATE_getDatastore(e);
                r.resolve(__PRIVATE_invokeRunAggregationQueryRpc(i, t, n));
            } catch (e) {
                r.reject(e);
            }
        })), r.promise;
    }(r, e._query, i).then((t => 
    /**
 * Converts the core aggregration result to an `AggregateQuerySnapshot`
 * that can be returned to the consumer.
 * @param query
 * @param aggregateResult Core aggregation result
 * @internal
 */
    function __PRIVATE_convertToAggregateQuerySnapshot(e, t, n) {
        const r = new __PRIVATE_ExpUserDataWriter(e);
        return new AggregateQuerySnapshot(t, r, n);
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
 */ (n, e, t)));
}

class __PRIVATE_MemoryLocalCacheImpl {
    constructor(e) {
        this.kind = "memory", this._onlineComponentProvider = new OnlineComponentProvider, 
        (null == e ? void 0 : e.garbageCollector) ? this._offlineComponentProvider = e.garbageCollector._offlineComponentProvider : this._offlineComponentProvider = new MemoryOfflineComponentProvider;
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
}

class __PRIVATE_PersistentLocalCacheImpl {
    constructor(e) {
        let t;
        this.kind = "persistent", (null == e ? void 0 : e.tabManager) ? (e.tabManager._initialize(e), 
        t = e.tabManager) : (t = persistentSingleTabManager(void 0), t._initialize(e)), 
        this._onlineComponentProvider = t._onlineComponentProvider, this._offlineComponentProvider = t._offlineComponentProvider;
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
}

class __PRIVATE_MemoryEagerGabageCollectorImpl {
    constructor() {
        this.kind = "memoryEager", this._offlineComponentProvider = new MemoryOfflineComponentProvider;
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
}

class __PRIVATE_MemoryLruGabageCollectorImpl {
    constructor(e) {
        this.kind = "memoryLru", this._offlineComponentProvider = new __PRIVATE_LruGcMemoryOfflineComponentProvider(e);
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
}

/**
 * Creates an instance of `MemoryEagerGarbageCollector`. This is also the
 * default garbage collector unless it is explicitly specified otherwise.
 */ function memoryEagerGarbageCollector() {
    return new __PRIVATE_MemoryEagerGabageCollectorImpl;
}

/**
 * Creates an instance of `MemoryLruGarbageCollector`.
 *
 * A target size can be specified as part of the setting parameter. The
 * collector will start deleting documents once the cache size exceeds
 * the given size. The default cache size is 40MB (40 * 1024 * 1024 bytes).
 */ function memoryLruGarbageCollector(e) {
    return new __PRIVATE_MemoryLruGabageCollectorImpl(null == e ? void 0 : e.cacheSizeBytes);
}

/**
 * Creates an instance of `MemoryLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 */ function memoryLocalCache(e) {
    return new __PRIVATE_MemoryLocalCacheImpl(e);
}

/**
 * Creates an instance of `PersistentLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 *
 * Persistent cache cannot be used in a Node.js environment.
 */ function persistentLocalCache(e) {
    return new __PRIVATE_PersistentLocalCacheImpl(e);
}

class __PRIVATE_SingleTabManagerImpl {
    constructor(e) {
        this.forceOwnership = e, this.kind = "persistentSingleTab";
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
    /**
     * @internal
     */    _initialize(e) {
        this._onlineComponentProvider = new OnlineComponentProvider, this._offlineComponentProvider = new __PRIVATE_IndexedDbOfflineComponentProvider(this._onlineComponentProvider, null == e ? void 0 : e.cacheSizeBytes, this.forceOwnership);
    }
}

class __PRIVATE_MultiTabManagerImpl {
    constructor() {
        this.kind = "PersistentMultipleTab";
    }
    toJSON() {
        return {
            kind: this.kind
        };
    }
    /**
     * @internal
     */    _initialize(e) {
        this._onlineComponentProvider = new OnlineComponentProvider, this._offlineComponentProvider = new __PRIVATE_MultiTabOfflineComponentProvider(this._onlineComponentProvider, null == e ? void 0 : e.cacheSizeBytes);
    }
}

/**
 * Creates an instance of `PersistentSingleTabManager`.
 *
 * @param settings Configures the created tab manager.
 */ function persistentSingleTabManager(e) {
    return new __PRIVATE_SingleTabManagerImpl(null == e ? void 0 : e.forceOwnership);
}

/**
 * Creates an instance of `PersistentMultipleTabManager`.
 */ function persistentMultipleTabManager() {
    return new __PRIVATE_MultiTabManagerImpl;
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
 */ const Se = {
    maxAttempts: 5
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
/**
 * A write batch, used to perform multiple writes as a single atomic unit.
 *
 * A `WriteBatch` object can be acquired by calling {@link writeBatch}. It
 * provides methods for adding writes to the write batch. None of the writes
 * will be committed (or visible locally) until {@link WriteBatch.commit} is
 * called.
 */
class WriteBatch {
    /** @hideconstructor */
    constructor(e, t) {
        this._firestore = e, this._commitHandler = t, this._mutations = [], this._committed = !1, 
        this._dataReader = __PRIVATE_newUserDataReader(e);
    }
    set(e, t, n) {
        this._verifyNotCommitted();
        const r = __PRIVATE_validateReference(e, this._firestore), i = __PRIVATE_applyFirestoreDataConverter(r.converter, t, n), s = __PRIVATE_parseSetData(this._dataReader, "WriteBatch.set", r._key, i, null !== r.converter, n);
        return this._mutations.push(s.toMutation(r._key, Precondition.none())), this;
    }
    update(e, t, n, ...r) {
        this._verifyNotCommitted();
        const i = __PRIVATE_validateReference(e, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                let s;
        return s = "string" == typeof (t = T(t)) || t instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(this._dataReader, "WriteBatch.update", i._key, t, n, r) : __PRIVATE_parseUpdateData(this._dataReader, "WriteBatch.update", i._key, t), 
        this._mutations.push(s.toMutation(i._key, Precondition.exists(!0))), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */    delete(e) {
        this._verifyNotCommitted();
        const t = __PRIVATE_validateReference(e, this._firestore);
        return this._mutations = this._mutations.concat(new __PRIVATE_DeleteMutation(t._key, Precondition.none())), 
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
        if (this._committed) throw new FirestoreError(v.FAILED_PRECONDITION, "A write batch can no longer be used after commit() has been called.");
    }
}

function __PRIVATE_validateReference(e, t) {
    if ((e = T(e)).firestore !== t) throw new FirestoreError(v.INVALID_ARGUMENT, "Provided document reference is from a different Firestore instance.");
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
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */
class Transaction extends class Transaction$1 {
    /** @hideconstructor */
    constructor(e, t) {
        this._firestore = e, this._transaction = t, this._dataReader = __PRIVATE_newUserDataReader(e);
    }
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */    get(e) {
        const t = __PRIVATE_validateReference(e, this._firestore), n = new __PRIVATE_LiteUserDataWriter(this._firestore);
        return this._transaction.lookup([ t._key ]).then((e => {
            if (!e || 1 !== e.length) return fail();
            const r = e[0];
            if (r.isFoundDocument()) return new DocumentSnapshot$1(this._firestore, n, r.key, r, t.converter);
            if (r.isNoDocument()) return new DocumentSnapshot$1(this._firestore, n, t._key, null, t.converter);
            throw fail();
        }));
    }
    set(e, t, n) {
        const r = __PRIVATE_validateReference(e, this._firestore), i = __PRIVATE_applyFirestoreDataConverter(r.converter, t, n), s = __PRIVATE_parseSetData(this._dataReader, "Transaction.set", r._key, i, null !== r.converter, n);
        return this._transaction.set(r._key, s), this;
    }
    update(e, t, n, ...r) {
        const i = __PRIVATE_validateReference(e, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                let s;
        return s = "string" == typeof (t = T(t)) || t instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(this._dataReader, "Transaction.update", i._key, t, n, r) : __PRIVATE_parseUpdateData(this._dataReader, "Transaction.update", i._key, t), 
        this._transaction.update(i._key, s), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */    delete(e) {
        const t = __PRIVATE_validateReference(e, this._firestore);
        return this._transaction.delete(t._key), this;
    }
} {
    // This class implements the same logic as the Transaction API in the Lite SDK
    // but is subclassed in order to return its own DocumentSnapshot types.
    /** @hideconstructor */
    constructor(e, t) {
        super(e, t), this._firestore = e;
    }
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */    get(e) {
        const t = __PRIVATE_validateReference(e, this._firestore), n = new __PRIVATE_ExpUserDataWriter(this._firestore);
        return super.get(e).then((e => new DocumentSnapshot(this._firestore, n, t._key, e._document, new SnapshotMetadata(
        /* hasPendingWrites= */ !1, 
        /* fromCache= */ !1), t.converter)));
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
 */ function runTransaction(e, t, n) {
    e = __PRIVATE_cast(e, Firestore);
    const r = Object.assign(Object.assign({}, Se), n);
    !function __PRIVATE_validateTransactionOptions(e) {
        if (e.maxAttempts < 1) throw new FirestoreError(v.INVALID_ARGUMENT, "Max attempts must be at least 1");
    }(r);
    return function __PRIVATE_firestoreClientTransaction(e, t, n) {
        const r = new __PRIVATE_Deferred;
        return e.asyncQueue.enqueueAndForget((async () => {
            const i = await __PRIVATE_getDatastore(e);
            new __PRIVATE_TransactionRunner(e.asyncQueue, i, n, t, r).run();
        })), r.promise;
    }(ensureFirestoreConfigured(e), (n => t(new Transaction(e, n))), r);
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
 */ function arrayUnion(...e) {
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
    return new __PRIVATE_ArrayUnionFieldValueImpl("arrayUnion", e);
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
 */ function arrayRemove(...e) {
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
    return new __PRIVATE_ArrayRemoveFieldValueImpl("arrayRemove", e);
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
 */ function increment(e) {
    return new __PRIVATE_NumericIncrementFieldValueImpl("increment", e);
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
 * Creates a write batch, used for performing multiple writes as a single
 * atomic operation. The maximum number of writes allowed in a single {@link WriteBatch}
 * is 500.
 *
 * Unlike transactions, write batches are persisted offline and therefore are
 * preferable when you don't need to condition your writes on read data.
 *
 * @returns A {@link WriteBatch} that can be used to atomically execute multiple
 * writes.
 */ function writeBatch(e) {
    return ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)), new WriteBatch(e, (t => executeWrite(e, t)));
}

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
 */ function setIndexConfiguration(e, t) {
    var n;
    const r = ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore));
    if (!r._uninitializedComponentsProvider || "memory" === (null === (n = r._uninitializedComponentsProvider) || void 0 === n ? void 0 : n._offlineKind)) 
    // PORTING NOTE: We don't return an error if the user has not enabled
    // persistence since `enableIndexeddbPersistence()` can fail on the Web.
    return __PRIVATE_logWarn("Cannot enable indexes when persistence is disabled"), 
    Promise.resolve();
    const i = function __PRIVATE_parseIndexes(e) {
        const t = "string" == typeof e ? function __PRIVATE_tryParseJson(e) {
            try {
                return JSON.parse(e);
            } catch (e) {
                throw new FirestoreError(v.INVALID_ARGUMENT, "Failed to parse JSON: " + (null == e ? void 0 : e.message));
            }
        }(e) : e, n = [];
        if (Array.isArray(t.indexes)) for (const e of t.indexes) {
            const t = __PRIVATE_tryGetString(e, "collectionGroup"), r = [];
            if (Array.isArray(e.fields)) for (const t of e.fields) {
                const e = __PRIVATE_fieldPathFromDotSeparatedString("setIndexConfiguration", __PRIVATE_tryGetString(t, "fieldPath"));
                "CONTAINS" === t.arrayConfig ? r.push(new IndexSegment(e, 2 /* IndexKind.CONTAINS */)) : "ASCENDING" === t.order ? r.push(new IndexSegment(e, 0 /* IndexKind.ASCENDING */)) : "DESCENDING" === t.order && r.push(new IndexSegment(e, 1 /* IndexKind.DESCENDING */));
            }
            n.push(new FieldIndex(FieldIndex.UNKNOWN_ID, t, r, IndexState.empty()));
        }
        return n;
    }(t);
    return __PRIVATE_firestoreClientSetIndexConfiguration(r, i);
}

function __PRIVATE_tryGetString(e, t) {
    if ("string" != typeof e[t]) throw new FirestoreError(v.INVALID_ARGUMENT, "Missing string value for: " + t);
    return e[t];
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
 * A `PersistentCacheIndexManager` for configuring persistent cache indexes used
 * for local query execution.
 *
 * To use, call `getPersistentCacheIndexManager()` to get an instance.
 */ class PersistentCacheIndexManager {
    /** @hideconstructor */
    constructor(e) {
        this._client = e, 
        /** A type string to uniquely identify instances of this class. */
        this.type = "PersistentCacheIndexManager";
    }
}

/**
 * Returns the PersistentCache Index Manager used by the given `Firestore`
 * object.
 *
 * @return The `PersistentCacheIndexManager` instance, or `null` if local
 * persistent storage is not in use.
 */ function getPersistentCacheIndexManager(e) {
    var t;
    e = __PRIVATE_cast(e, Firestore);
    const n = be.get(e);
    if (n) return n;
    const r = ensureFirestoreConfigured(e);
    if ("persistent" !== (null === (t = r._uninitializedComponentsProvider) || void 0 === t ? void 0 : t._offlineKind)) return null;
    const i = new PersistentCacheIndexManager(r);
    return be.set(e, i), i;
}

/**
 * Enables the SDK to create persistent cache indexes automatically for local
 * query execution when the SDK believes cache indexes can help improve
 * performance.
 *
 * This feature is disabled by default.
 */ function enablePersistentCacheIndexAutoCreation(e) {
    __PRIVATE_setPersistentCacheIndexAutoCreationEnabled(e, !0);
}

/**
 * Stops creating persistent cache indexes automatically for local query
 * execution. The indexes which have been created by calling
 * `enablePersistentCacheIndexAutoCreation()` still take effect.
 */ function disablePersistentCacheIndexAutoCreation(e) {
    __PRIVATE_setPersistentCacheIndexAutoCreationEnabled(e, !1);
}

/**
 * Removes all persistent cache indexes.
 *
 * Please note this function will also deletes indexes generated by
 * `setIndexConfiguration()`, which is deprecated.
 */ function deleteAllPersistentCacheIndexes(e) {
    e._client.verifyNotTerminated();
    __PRIVATE_firestoreClientDeleteAllFieldIndexes(e._client).then((e => __PRIVATE_logDebug("deleting all persistent cache indexes succeeded"))).catch((e => __PRIVATE_logWarn("deleting all persistent cache indexes failed", e)));
}

function __PRIVATE_setPersistentCacheIndexAutoCreationEnabled(e, t) {
    e._client.verifyNotTerminated();
    __PRIVATE_firestoreClientSetPersistentCacheIndexAutoCreationEnabled(e._client, t).then((e => __PRIVATE_logDebug(`setting persistent cache index auto creation isEnabled=${t} succeeded`))).catch((e => __PRIVATE_logWarn(`setting persistent cache index auto creation isEnabled=${t} failed`, e)));
}

/**
 * Maps `Firestore` instances to their corresponding
 * `PersistentCacheIndexManager` instances.
 *
 * Use a `WeakMap` so that the mapping will be automatically dropped when the
 * `Firestore` instance is garbage collected. This emulates a private member
 * as described in https://goo.gle/454yvug.
 */ const be = new WeakMap;

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
 * Testing hooks for use by Firestore's integration test suite to reach into the
 * SDK internals to validate logic and behavior that is not visible from the
 * public API surface.
 *
 * @internal
 */ class TestingHooks {
    constructor() {
        throw new Error("instances of this class should not be created");
    }
    /**
     * Registers a callback to be notified when an existence filter mismatch
     * occurs in the Watch listen stream.
     *
     * The relative order in which callbacks are notified is unspecified; do not
     * rely on any particular ordering. If a given callback is registered multiple
     * times then it will be notified multiple times, once per registration.
     *
     * @param callback the callback to invoke upon existence filter mismatch.
     *
     * @return a function that, when called, unregisters the given callback; only
     * the first invocation of the returned function does anything; all subsequent
     * invocations do nothing.
     */    static onExistenceFilterMismatch(e) {
        return __PRIVATE_TestingHooksSpiImpl.instance.onExistenceFilterMismatch(e);
    }
}

/**
 * The implementation of `TestingHooksSpi`.
 */ class __PRIVATE_TestingHooksSpiImpl {
    constructor() {
        this.Su = new Map;
    }
    static get instance() {
        return De || (De = new __PRIVATE_TestingHooksSpiImpl, function __PRIVATE_setTestingHooksSpi(e) {
            if (he) throw new Error("a TestingHooksSpi instance is already set");
            he = e;
        }(De)), De;
    }
    tt(e) {
        this.Su.forEach((t => t(e)));
    }
    onExistenceFilterMismatch(e) {
        const t = Symbol(), n = this.Su;
        return n.set(t, e), () => n.delete(t);
    }
}

let De = null;

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
 */ !function __PRIVATE_registerFirestore(e, t = !0) {
    !function __PRIVATE_setSDKVersion(e) {
        D = e;
    }(i), n(new s("firestore", ((e, {instanceIdentifier: n, options: r}) => {
        const i = e.getProvider("app").getImmediate(), s = new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(e.getProvider("auth-internal")), new __PRIVATE_FirebaseAppCheckTokenProvider(e.getProvider("app-check-internal")), function __PRIVATE_databaseIdFromApp(e, t) {
            if (!Object.prototype.hasOwnProperty.apply(e.options, [ "projectId" ])) throw new FirestoreError(v.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
            return new DatabaseId(e.options.projectId, t);
        }(i, n), i);
        return r = Object.assign({
            useFetchStreams: t
        }, r), s._setSettings(r), s;
    }), "PUBLIC").setMultipleInstances(!0)), r(b, "4.4.0", e), 
    // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
    r(b, "4.4.0", "esm2017");
}("rn", /* useFetchStreams= */ !1);

export { AbstractUserDataWriter, AggregateField, AggregateQuerySnapshot, Bytes, pe as CACHE_SIZE_UNLIMITED, CollectionReference, DocumentReference, DocumentSnapshot, FieldPath, FieldValue, Firestore, FirestoreError, GeoPoint, LoadBundleTask, PersistentCacheIndexManager, Query, QueryCompositeFilterConstraint, QueryConstraint, QueryDocumentSnapshot, QueryEndAtConstraint, QueryFieldFilterConstraint, QueryLimitConstraint, QueryOrderByConstraint, QuerySnapshot, QueryStartAtConstraint, SnapshotMetadata, Timestamp, Transaction, WriteBatch, __PRIVATE_AutoId as _AutoId, ByteString as _ByteString, DatabaseId as _DatabaseId, DocumentKey as _DocumentKey, __PRIVATE_EmptyAppCheckTokenProvider as _EmptyAppCheckTokenProvider, __PRIVATE_EmptyAuthCredentialsProvider as _EmptyAuthCredentialsProvider, FieldPath$1 as _FieldPath, TestingHooks as _TestingHooks, __PRIVATE_cast as _cast, __PRIVATE_debugAssert as _debugAssert, __PRIVATE_isBase64Available as _isBase64Available, __PRIVATE_logWarn as _logWarn, __PRIVATE_validateIsNotUsedTogether as _validateIsNotUsedTogether, addDoc, aggregateFieldEqual, aggregateQuerySnapshotEqual, and, arrayRemove, arrayUnion, average, clearIndexedDbPersistence, collection, collectionGroup, connectFirestoreEmulator, count, deleteAllPersistentCacheIndexes, deleteDoc, deleteField, disableNetwork, disablePersistentCacheIndexAutoCreation, doc, documentId, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence, enableNetwork, enablePersistentCacheIndexAutoCreation, endAt, endBefore, ensureFirestoreConfigured, executeWrite, getAggregateFromServer, getCountFromServer, getDoc, getDocFromCache, getDocFromServer, getDocs, getDocsFromCache, getDocsFromServer, getFirestore, getPersistentCacheIndexManager, increment, initializeFirestore, limit, limitToLast, loadBundle, memoryEagerGarbageCollector, memoryLocalCache, memoryLruGarbageCollector, namedQuery, onSnapshot, onSnapshotsInSync, or, orderBy, persistentLocalCache, persistentMultipleTabManager, persistentSingleTabManager, query, queryEqual, refEqual, runTransaction, serverTimestamp, setDoc, setIndexConfiguration, setLogLevel, snapshotEqual, startAfter, startAt, sum, terminate, updateDoc, waitForPendingWrites, where, writeBatch };
//# sourceMappingURL=index.rn.js.map
