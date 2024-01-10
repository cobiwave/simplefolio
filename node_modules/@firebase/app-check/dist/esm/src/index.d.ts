/**
 * The Firebase App Check Web SDK.
 *
 * @remarks
 * Firebase App Check does not work in a Node.js environment using `ReCaptchaV3Provider` or
 * `ReCaptchaEnterpriseProvider`, but can be used in Node.js if you use
 * `CustomProvider` and write your own attestation method.
 *
 * @packageDocumentation
 */
import { _AppCheckInternalComponentName } from './types';
export { _AppCheckInternalComponentName };
export * from './api';
export * from './public-types';
