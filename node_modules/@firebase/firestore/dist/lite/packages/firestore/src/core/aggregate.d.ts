/**
 * @license
 * Copyright 2023 Google LLC
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
 * Union type representing the aggregate type to be performed.
 */
export declare type AggregateType = 'count' | 'avg' | 'sum';
/**
 * Represents an Aggregate to be performed over a query result set.
 */
export interface Aggregate {
    readonly fieldPath?: FieldPath;
    readonly alias: string;
    readonly aggregateType: AggregateType;
}
/**
 * Concrete implementation of the Aggregate type.
 */
export declare class AggregateImpl implements Aggregate {
    readonly alias: string;
    readonly aggregateType: AggregateType;
    readonly fieldPath?: FieldPath | undefined;
    constructor(alias: string, aggregateType: AggregateType, fieldPath?: FieldPath | undefined);
}
