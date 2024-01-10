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
import { FirebaseApp } from '@firebase/app';
import { FirebaseError } from '@firebase/util';
/**
 * An `HttpsCallableResult` wraps a single result from a function call.
 * @public
 */
export interface HttpsCallableResult<ResponseData = unknown> {
    /**
     * Data returned from callable function.
     */
    readonly data: ResponseData;
}
/**
 * A reference to a "callable" HTTP trigger in Google Cloud Functions.
 * @param data - Data to be passed to callable function.
 * @public
 */
export declare type HttpsCallable<RequestData = unknown, ResponseData = unknown> = (data?: RequestData | null) => Promise<HttpsCallableResult<ResponseData>>;
/**
 * An interface for metadata about how calls should be executed.
 * @public
 */
export interface HttpsCallableOptions {
    /**
     * Time in milliseconds after which to cancel if there is no response.
     * Default is 70000.
     */
    timeout?: number;
    /**
     * If set to true, uses limited-use App Check token for callable function requests from this
     * instance of {@link Functions}. You must use limited-use tokens to call functions with
     * replay protection enabled. By default, this is false.
     */
    limitedUseAppCheckTokens?: boolean;
}
/**
 * A `Functions` instance.
 * @public
 */
export interface Functions {
    /**
     * The {@link @firebase/app#FirebaseApp} this `Functions` instance is associated with.
     */
    app: FirebaseApp;
    /**
     * The region the callable Cloud Functions are located in.
     * Default is `us-central-1`.
     */
    region: string;
    /**
     * A custom domain hosting the callable Cloud Functions.
     * ex: https://mydomain.com
     */
    customDomain: string | null;
}
/**
 * Functions error code string appended after "functions/" product prefix.
 * See {@link FunctionsErrorCode} for full documentation of codes.
 * @public
 */
export declare type FunctionsErrorCodeCore = 'ok' | 'cancelled' | 'unknown' | 'invalid-argument' | 'deadline-exceeded' | 'not-found' | 'already-exists' | 'permission-denied' | 'resource-exhausted' | 'failed-precondition' | 'aborted' | 'out-of-range' | 'unimplemented' | 'internal' | 'unavailable' | 'data-loss' | 'unauthenticated';
/**
 * The set of Firebase Functions status codes. The codes are the same at the
 * ones exposed by gRPC here:
 * https://github.com/grpc/grpc/blob/master/doc/statuscodes.md
 *
 * Possible values:
 * - 'cancelled': The operation was cancelled (typically by the caller).
 * - 'unknown': Unknown error or an error from a different error domain.
 * - 'invalid-argument': Client specified an invalid argument. Note that this
 *   differs from 'failed-precondition'. 'invalid-argument' indicates
 *   arguments that are problematic regardless of the state of the system
 *   (e.g. an invalid field name).
 * - 'deadline-exceeded': Deadline expired before operation could complete.
 *   For operations that change the state of the system, this error may be
 *   returned even if the operation has completed successfully. For example,
 *   a successful response from a server could have been delayed long enough
 *   for the deadline to expire.
 * - 'not-found': Some requested document was not found.
 * - 'already-exists': Some document that we attempted to create already
 *   exists.
 * - 'permission-denied': The caller does not have permission to execute the
 *   specified operation.
 * - 'resource-exhausted': Some resource has been exhausted, perhaps a
 *   per-user quota, or perhaps the entire file system is out of space.
 * - 'failed-precondition': Operation was rejected because the system is not
 *   in a state required for the operation's execution.
 * - 'aborted': The operation was aborted, typically due to a concurrency
 *   issue like transaction aborts, etc.
 * - 'out-of-range': Operation was attempted past the valid range.
 * - 'unimplemented': Operation is not implemented or not supported/enabled.
 * - 'internal': Internal errors. Means some invariants expected by
 *   underlying system has been broken. If you see one of these errors,
 *   something is very broken.
 * - 'unavailable': The service is currently unavailable. This is most likely
 *   a transient condition and may be corrected by retrying with a backoff.
 * - 'data-loss': Unrecoverable data loss or corruption.
 * - 'unauthenticated': The request does not have valid authentication
 *   credentials for the operation.
 * @public
 */
export declare type FunctionsErrorCode = `functions/${FunctionsErrorCodeCore}`;
/**
 * An error returned by the Firebase Functions client SDK.
 * @public
 */
export interface FunctionsError extends FirebaseError {
    /**
     * A standard error code that will be returned to the client. This also
     * determines the HTTP status code of the response, as defined in code.proto.
     */
    readonly code: FunctionsErrorCode;
    /**
     * Extra data to be converted to JSON and included in the error response.
     */
    readonly details?: unknown;
}
declare module '@firebase/component' {
    interface NameServiceMapping {
        'functions': Functions;
    }
}
