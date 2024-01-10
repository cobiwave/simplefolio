/**
 * @license
 * Copyright 2021 Google LLC
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
import { FirebaseAppCheck } from '@firebase/app-check-types';
export declare function registerAppCheck(): void;
/**
 * Define extension behavior of `registerAppCheck`
 */
declare module '@firebase/app-compat' {
    interface FirebaseNamespace {
        appCheck(app?: FirebaseApp): FirebaseAppCheck;
    }
    interface FirebaseApp {
        appCheck(): FirebaseAppCheck;
    }
}
