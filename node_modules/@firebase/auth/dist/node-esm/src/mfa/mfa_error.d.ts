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
import { MultiFactorError as MultiFactorErrorPublic } from '../model/public_types';
import { FirebaseError } from '@firebase/util';
import { AuthInternal } from '../model/auth';
import { IdTokenResponse } from '../model/id_token';
import { UserInternal } from '../model/user';
import { AuthCredential } from '../core/credentials';
import { IdTokenMfaResponse } from '../api/authentication/mfa';
import { OperationType } from '../model/enums';
export declare type MultiFactorErrorData = MultiFactorErrorPublic['customData'] & {
    _serverResponse: IdTokenMfaResponse;
};
export declare class MultiFactorError extends FirebaseError implements MultiFactorErrorPublic {
    readonly operationType: OperationType;
    readonly user?: UserInternal | undefined;
    readonly customData: MultiFactorErrorData;
    private constructor();
    static _fromErrorAndOperation(auth: AuthInternal, error: FirebaseError, operationType: OperationType, user?: UserInternal): MultiFactorError;
}
export declare function _processCredentialSavingMfaContextIfNecessary(auth: AuthInternal, operationType: OperationType, credential: AuthCredential, user?: UserInternal): Promise<IdTokenResponse>;
