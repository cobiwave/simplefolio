/**
 * Firebase Performance Monitoring
 *
 * @packageDocumentation
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
import { FirebasePerformance, PerformanceSettings, PerformanceTrace } from './public_types';
import { FirebaseApp } from '@firebase/app';
import '@firebase/installations';
/**
 * Returns a {@link FirebasePerformance} instance for the given app.
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @public
 */
export declare function getPerformance(app?: FirebaseApp): FirebasePerformance;
/**
 * Returns a {@link FirebasePerformance} instance for the given app. Can only be called once.
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @param settings - Optional settings for the {@link FirebasePerformance} instance.
 * @public
 */
export declare function initializePerformance(app: FirebaseApp, settings?: PerformanceSettings): FirebasePerformance;
/**
 * Returns a new `PerformanceTrace` instance.
 * @param performance - The {@link FirebasePerformance} instance to use.
 * @param name - The name of the trace.
 * @public
 */
export declare function trace(performance: FirebasePerformance, name: string): PerformanceTrace;
export { FirebasePerformance, PerformanceSettings, PerformanceTrace };
