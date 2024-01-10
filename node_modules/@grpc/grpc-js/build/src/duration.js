"use strict";
/*
 * Copyright 2022 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDuration = exports.durationToMs = exports.msToDuration = void 0;
function msToDuration(millis) {
    return {
        seconds: (millis / 1000) | 0,
        nanos: ((millis % 1000) * 1000000) | 0,
    };
}
exports.msToDuration = msToDuration;
function durationToMs(duration) {
    return (duration.seconds * 1000 + duration.nanos / 1000000) | 0;
}
exports.durationToMs = durationToMs;
function isDuration(value) {
    return typeof value.seconds === 'number' && typeof value.nanos === 'number';
}
exports.isDuration = isDuration;
//# sourceMappingURL=duration.js.map