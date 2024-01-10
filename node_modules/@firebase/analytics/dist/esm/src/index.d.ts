/**
 * Firebase Analytics
 *
 * @packageDocumentation
 */
import '@firebase/installations';
declare global {
    interface Window {
        [key: string]: unknown;
    }
}
export * from './api';
export * from './public-types';
