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
import { Document } from '../model/document';
import { Value as ProtoValue } from '../protos/firestore_proto_api';
import { OrderBy } from './order_by';
/**
 * Represents a bound of a query.
 *
 * The bound is specified with the given components representing a position and
 * whether it's just before or just after the position (relative to whatever the
 * query order is).
 *
 * The position represents a logical index position for a query. It's a prefix
 * of values for the (potentially implicit) order by clauses of a query.
 *
 * Bound provides a function to determine whether a document comes before or
 * after a bound. This is influenced by whether the position is just before or
 * just after the provided values.
 */
export declare class Bound {
    readonly position: ProtoValue[];
    readonly inclusive: boolean;
    constructor(position: ProtoValue[], inclusive: boolean);
}
/**
 * Returns true if a document sorts after a bound using the provided sort
 * order.
 */
export declare function boundSortsAfterDocument(bound: Bound, orderBy: OrderBy[], doc: Document): boolean;
/**
 * Returns true if a document sorts before a bound using the provided sort
 * order.
 */
export declare function boundSortsBeforeDocument(bound: Bound, orderBy: OrderBy[], doc: Document): boolean;
export declare function boundEquals(left: Bound | null, right: Bound | null): boolean;
