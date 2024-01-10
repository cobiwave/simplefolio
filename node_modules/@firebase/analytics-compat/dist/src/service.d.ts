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
import { AnalyticsCallOptions, CustomParams, EventParams, FirebaseAnalytics } from '@firebase/analytics-types';
import { Analytics as AnalyticsServiceExp } from '@firebase/analytics';
import { _FirebaseService, FirebaseApp } from '@firebase/app-compat';
export declare class AnalyticsService implements FirebaseAnalytics, _FirebaseService {
    app: FirebaseApp;
    readonly _delegate: AnalyticsServiceExp;
    constructor(app: FirebaseApp, _delegate: AnalyticsServiceExp);
    logEvent(eventName: string, eventParams?: EventParams | CustomParams, options?: AnalyticsCallOptions): void;
    /**
     * @deprecated Use {@link logEvent} with `eventName` as 'screen_view' and add relevant `eventParams`.
     * See {@link https://firebase.google.com/docs/analytics/screenviews | Track Screenviews}.
     */
    setCurrentScreen(screenName: string, options?: AnalyticsCallOptions): void;
    setUserId(id: string, options?: AnalyticsCallOptions): void;
    setUserProperties(properties: CustomParams, options?: AnalyticsCallOptions): void;
    setAnalyticsCollectionEnabled(enabled: boolean): void;
}
