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
import { FieldPath } from '../model/path';
/**
 * The direction of sorting in an order by.
 */
export declare const enum Direction {
    ASCENDING = "asc",
    DESCENDING = "desc"
}
/**
 * An ordering on a field, in some Direction. Direction defaults to ASCENDING.
 */
export declare class OrderBy {
    readonly field: FieldPath;
    readonly dir: Direction;
    constructor(field: FieldPath, dir?: Direction);
}
export declare function canonifyOrderBy(orderBy: OrderBy): string;
export declare function stringifyOrderBy(orderBy: OrderBy): string;
export declare function orderByEquals(left: OrderBy, right: OrderBy): boolean;
