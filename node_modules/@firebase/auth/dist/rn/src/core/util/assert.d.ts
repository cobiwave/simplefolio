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
import { Auth } from '../../model/public_types';
import { FirebaseError } from '@firebase/util';
import { AuthErrorCode, AuthErrorParams } from '../errors';
declare type LessAppName<K extends AuthErrorCode> = Omit<AuthErrorParams[K], 'appName'>;
/**
 * Unconditionally fails, throwing a developer facing INTERNAL_ERROR
 *
 * @example
 * ```javascript
 * fail(auth, AuthErrorCode.MFA_REQUIRED);  // Error: the MFA_REQUIRED error needs more params than appName
 * fail(auth, AuthErrorCode.MFA_REQUIRED, {serverResponse});  // Compiles
 * fail(AuthErrorCode.INTERNAL_ERROR);  // Compiles; internal error does not need appName
 * fail(AuthErrorCode.USER_DELETED);  // Error: USER_DELETED requires app name
 * fail(auth, AuthErrorCode.USER_DELETED);  // Compiles; USER_DELETED _only_ needs app name
 * ```
 *
 * @param appName App name for tagging the error
 * @throws FirebaseError
 */
export declare function _fail<K extends AuthErrorCode>(code: K, ...data: {} extends AuthErrorParams[K] ? [AuthErrorParams[K]?] : [AuthErrorParams[K]]): never;
export declare function _fail<K extends AuthErrorCode>(auth: Auth, code: K, ...data: {} extends LessAppName<K> ? [LessAppName<K>?] : [LessAppName<K>]): never;
export declare function _createError<K extends AuthErrorCode>(code: K, ...data: {} extends AuthErrorParams[K] ? [AuthErrorParams[K]?] : [AuthErrorParams[K]]): FirebaseError;
export declare function _createError<K extends AuthErrorCode>(auth: Auth, code: K, ...data: {} extends LessAppName<K> ? [LessAppName<K>?] : [LessAppName<K>]): FirebaseError;
export declare function _errorWithCustomMessage(auth: Auth, code: AuthErrorCode, message: string): FirebaseError;
export declare function _assertInstanceOf(auth: Auth, object: object, instance: unknown): void;
export declare function _assert<K extends AuthErrorCode>(assertion: unknown, code: K, ...data: {} extends AuthErrorParams[K] ? [AuthErrorParams[K]?] : [AuthErrorParams[K]]): asserts assertion;
export declare function _assert<K extends AuthErrorCode>(assertion: unknown, auth: Auth, code: K, ...data: {} extends LessAppName<K> ? [LessAppName<K>?] : [LessAppName<K>]): asserts assertion;
declare type TypeExpectation = Function | string | MapType;
interface MapType extends Record<string, TypeExpectation | Optional> {
}
declare class Optional {
    readonly type: TypeExpectation;
    constructor(type: TypeExpectation);
}
export declare function opt(type: TypeExpectation): Optional;
/**
 * Asserts the runtime types of arguments. The 'expected' field can be one of
 * a class, a string (representing a "typeof" call), or a record map of name
 * to type. Furthermore, the opt() function can be used to mark a field as
 * optional. For example:
 *
 * function foo(auth: Auth, profile: {displayName?: string}, update = false) {
 *   assertTypes(arguments, [AuthImpl, {displayName: opt('string')}, opt('boolean')]);
 * }
 *
 * opt() can be used for any type:
 * function foo(auth?: Auth) {
 *   assertTypes(arguments, [opt(AuthImpl)]);
 * }
 *
 * The string types can be or'd together, and you can use "null" as well (note
 * that typeof null === 'object'; this is an edge case). For example:
 *
 * function foo(profile: {displayName?: string | null}) {
 *   assertTypes(arguments, [{displayName: opt('string|null')}]);
 * }
 *
 * @param args
 * @param expected
 */
export declare function assertTypes(args: Omit<IArguments, 'callee'>, ...expected: Array<TypeExpectation | Optional>): void;
/**
 * Unconditionally fails, throwing an internal error with the given message.
 *
 * @param failure type of failure encountered
 * @throws Error
 */
export declare function debugFail(failure: string): never;
/**
 * Fails if the given assertion condition is false, throwing an Error with the
 * given message if it did.
 *
 * @param assertion
 * @param message
 */
export declare function debugAssert(assertion: unknown, message: string): asserts assertion;
export {};
