/**
 * Firebase Remote Config
 *
 * @packageDocumentation
 */
declare global {
    interface Window {
        FIREBASE_REMOTE_CONFIG_URL_BASE: string;
    }
}
export * from './api';
export * from './api2';
export * from './public_types';
