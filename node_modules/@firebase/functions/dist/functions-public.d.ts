/**
 * Cloud Functions for Firebase
 *
 * @packageDocumentation
 */

import { FirebaseApp } from '@firebase/app';
import { FirebaseError } from '@firebase/util';

/**
 * Modify this instance to communicate with the Cloud Functions emulator.
 *
 * Note: this must be called before this instance has been used to do any operations.
 *
 * @param host - The emulator host (ex: localhost)
 * @param port - The emulator port (ex: 5001)
 * @public
 */
export declare function connectFunctionsEmulator(functionsInstance: Functions, host: string, port: number): void;

/**
 * A `Functions` instance.
 * @public
 */
export declare interface Functions {
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
 * An error returned by the Firebase Functions client SDK.
 * @public
 */
export declare interface FunctionsError extends FirebaseError {
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
 * Functions error code string appended after "functions/" product prefix.
 * See {@link FunctionsErrorCode} for full documentation of codes.
 * @public
 */
export declare type FunctionsErrorCodeCore = 'ok' | 'cancelled' | 'unknown' | 'invalid-argument' | 'deadline-exceeded' | 'not-found' | 'already-exists' | 'permission-denied' | 'resource-exhausted' | 'failed-precondition' | 'aborted' | 'out-of-range' | 'unimplemented' | 'internal' | 'unavailable' | 'data-loss' | 'unauthenticated';

/**
 * Returns a {@link Functions} instance for the given app.
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @param regionOrCustomDomain - one of:
 *   a) The region the callable functions are located in (ex: us-central1)
 *   b) A custom domain hosting the callable functions (ex: https://mydomain.com)
 * @public
 */
export declare function getFunctions(app?: FirebaseApp, regionOrCustomDomain?: string): Functions;

/**
 * A reference to a "callable" HTTP trigger in Google Cloud Functions.
 * @param data - Data to be passed to callable function.
 * @public
 */
export declare type HttpsCallable<RequestData = unknown, ResponseData = unknown> = (data?: RequestData | null) => Promise<HttpsCallableResult<ResponseData>>;

/**
 * Returns a reference to the callable HTTPS trigger with the given name.
 * @param name - The name of the trigger.
 * @public
 */
export declare function httpsCallable<RequestData = unknown, ResponseData = unknown>(functionsInstance: Functions, name: string, options?: HttpsCallableOptions): HttpsCallable<RequestData, ResponseData>;

/**
 * Returns a reference to the callable HTTPS trigger with the specified url.
 * @param url - The url of the trigger.
 * @public
 */
export declare function httpsCallableFromURL<RequestData = unknown, ResponseData = unknown>(functionsInstance: Functions, url: string, options?: HttpsCallableOptions): HttpsCallable<RequestData, ResponseData>;

/**
 * An interface for metadata about how calls should be executed.
 * @public
 */
export declare interface HttpsCallableOptions {
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
 * An `HttpsCallableResult` wraps a single result from a function call.
 * @public
 */
export declare interface HttpsCallableResult<ResponseData = unknown> {
    /**
     * Data returned from callable function.
     */
    readonly data: ResponseData;
}

export { }
