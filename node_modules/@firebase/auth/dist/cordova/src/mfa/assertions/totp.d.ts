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
import { TotpMultiFactorAssertion, MultiFactorSession } from '../../model/public_types';
import { AuthInternal } from '../../model/auth';
import { StartTotpMfaEnrollmentResponse, TotpVerificationInfo } from '../../api/account_management/mfa';
import { FinalizeMfaResponse } from '../../api/authentication/mfa';
import { MultiFactorAssertionImpl } from '../../mfa/mfa_assertion';
/**
 * Provider for generating a {@link TotpMultiFactorAssertion}.
 *
 * @public
 */
export declare class TotpMultiFactorGenerator {
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of
     * the TOTP (time-based one-time password) second factor.
     * This assertion is used to complete enrollment in TOTP second factor.
     *
     * @param secret A {@link TotpSecret} containing the shared secret key and other TOTP parameters.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorUser.enroll}.
     */
    static assertionForEnrollment(secret: TotpSecret, oneTimePassword: string): TotpMultiFactorAssertion;
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of the TOTP second factor.
     * This assertion is used to complete signIn with TOTP as the second factor.
     *
     * @param enrollmentId identifies the enrolled TOTP second factor.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}.
     */
    static assertionForSignIn(enrollmentId: string, oneTimePassword: string): TotpMultiFactorAssertion;
    /**
     * Returns a promise to {@link TotpSecret} which contains the TOTP shared secret key and other parameters.
     * Creates a TOTP secret as part of enrolling a TOTP second factor.
     * Used for generating a QR code URL or inputting into a TOTP app.
     * This method uses the auth instance corresponding to the user in the multiFactorSession.
     *
     * @param session The {@link MultiFactorSession} that the user is part of.
     * @returns A promise to {@link TotpSecret}.
     */
    static generateSecret(session: MultiFactorSession): Promise<TotpSecret>;
    /**
     * The identifier of the TOTP second factor: `totp`.
     */
    static FACTOR_ID: 'totp';
}
export declare class TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl implements TotpMultiFactorAssertion {
    readonly otp: string;
    readonly enrollmentId?: string | undefined;
    readonly secret?: TotpSecret | undefined;
    constructor(otp: string, enrollmentId?: string | undefined, secret?: TotpSecret | undefined);
    /** @internal */
    static _fromSecret(secret: TotpSecret, otp: string): TotpMultiFactorAssertionImpl;
    /** @internal */
    static _fromEnrollmentId(enrollmentId: string, otp: string): TotpMultiFactorAssertionImpl;
    /** @internal */
    _finalizeEnroll(auth: AuthInternal, idToken: string, displayName?: string | null): Promise<FinalizeMfaResponse>;
    /** @internal */
    _finalizeSignIn(auth: AuthInternal, mfaPendingCredential: string): Promise<FinalizeMfaResponse>;
}
/**
 * Provider for generating a {@link TotpMultiFactorAssertion}.
 *
 * Stores the shared secret key and other parameters to generate time-based OTPs.
 * Implements methods to retrieve the shared secret key and generate a QR code URL.
 * @public
 */
export declare class TotpSecret {
    private readonly sessionInfo;
    private readonly auth;
    /**
     * Shared secret key/seed used for enrolling in TOTP MFA and generating OTPs.
     */
    readonly secretKey: string;
    /**
     * Hashing algorithm used.
     */
    readonly hashingAlgorithm: string;
    /**
     * Length of the one-time passwords to be generated.
     */
    readonly codeLength: number;
    /**
     * The interval (in seconds) when the OTP codes should change.
     */
    readonly codeIntervalSeconds: number;
    /**
     * The timestamp (UTC string) by which TOTP enrollment should be completed.
     */
    readonly enrollmentCompletionDeadline: string;
    private constructor();
    /** @internal */
    static _fromStartTotpMfaEnrollmentResponse(response: StartTotpMfaEnrollmentResponse, auth: AuthInternal): TotpSecret;
    /** @internal */
    _makeTotpVerificationInfo(otp: string): TotpVerificationInfo;
    /**
     * Returns a QR code URL as described in
     * https://github.com/google/google-authenticator/wiki/Key-Uri-Format
     * This can be displayed to the user as a QR code to be scanned into a TOTP app like Google Authenticator.
     * If the optional parameters are unspecified, an accountName of <userEmail> and issuer of <firebaseAppName> are used.
     *
     * @param accountName the name of the account/app along with a user identifier.
     * @param issuer issuer of the TOTP (likely the app name).
     * @returns A QR code URL string.
     */
    generateQrCodeUrl(accountName?: string, issuer?: string): string;
}
