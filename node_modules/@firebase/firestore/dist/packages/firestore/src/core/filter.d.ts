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
import { FieldPath } from '../model/path';
import { Value as ProtoValue } from '../protos/firestore_proto_api';
export declare const enum Operator {
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL = "<=",
    EQUAL = "==",
    NOT_EQUAL = "!=",
    GREATER_THAN = ">",
    GREATER_THAN_OR_EQUAL = ">=",
    ARRAY_CONTAINS = "array-contains",
    IN = "in",
    NOT_IN = "not-in",
    ARRAY_CONTAINS_ANY = "array-contains-any"
}
export declare const enum CompositeOperator {
    OR = "or",
    AND = "and"
}
export declare abstract class Filter {
    abstract matches(doc: Document): boolean;
    abstract getFlattenedFilters(): readonly FieldFilter[];
    abstract getFilters(): Filter[];
}
export declare class FieldFilter extends Filter {
    readonly field: FieldPath;
    readonly op: Operator;
    readonly value: ProtoValue;
    protected constructor(field: FieldPath, op: Operator, value: ProtoValue);
    /**
     * Creates a filter based on the provided arguments.
     */
    static create(field: FieldPath, op: Operator, value: ProtoValue): FieldFilter;
    private static createKeyFieldInFilter;
    matches(doc: Document): boolean;
    protected matchesComparison(comparison: number): boolean;
    isInequality(): boolean;
    getFlattenedFilters(): readonly FieldFilter[];
    getFilters(): Filter[];
}
export declare class CompositeFilter extends Filter {
    readonly filters: readonly Filter[];
    readonly op: CompositeOperator;
    private memoizedFlattenedFilters;
    protected constructor(filters: readonly Filter[], op: CompositeOperator);
    /**
     * Creates a filter based on the provided arguments.
     */
    static create(filters: Filter[], op: CompositeOperator): CompositeFilter;
    matches(doc: Document): boolean;
    getFlattenedFilters(): readonly FieldFilter[];
    getFilters(): Filter[];
}
export declare function compositeFilterIsConjunction(compositeFilter: CompositeFilter): boolean;
export declare function compositeFilterIsDisjunction(compositeFilter: CompositeFilter): boolean;
/**
 * Returns true if this filter is a conjunction of field filters only. Returns false otherwise.
 */
export declare function compositeFilterIsFlatConjunction(compositeFilter: CompositeFilter): boolean;
/**
 * Returns true if this filter does not contain any composite filters. Returns false otherwise.
 */
export declare function compositeFilterIsFlat(compositeFilter: CompositeFilter): boolean;
export declare function canonifyFilter(filter: Filter): string;
export declare function filterEquals(f1: Filter, f2: Filter): boolean;
export declare function fieldFilterEquals(f1: FieldFilter, f2: Filter): boolean;
export declare function compositeFilterEquals(f1: CompositeFilter, f2: Filter): boolean;
/**
 * Returns a new composite filter that contains all filter from
 * `compositeFilter` plus all the given filters in `otherFilters`.
 */
export declare function compositeFilterWithAddedFilters(compositeFilter: CompositeFilter, otherFilters: Filter[]): CompositeFilter;
/** Returns a debug description for `filter`. */
export declare function stringifyFilter(filter: Filter): string;
export declare function stringifyCompositeFilter(filter: CompositeFilter): string;
export declare function stringifyFieldFilter(filter: FieldFilter): string;
/** Filter that matches on key fields (i.e. '__name__'). */
export declare class KeyFieldFilter extends FieldFilter {
    private readonly key;
    constructor(field: FieldPath, op: Operator, value: ProtoValue);
    matches(doc: Document): boolean;
}
/** Filter that matches on key fields within an array. */
export declare class KeyFieldInFilter extends FieldFilter {
    private readonly keys;
    constructor(field: FieldPath, value: ProtoValue);
    matches(doc: Document): boolean;
}
/** Filter that matches on key fields not present within an array. */
export declare class KeyFieldNotInFilter extends FieldFilter {
    private readonly keys;
    constructor(field: FieldPath, value: ProtoValue);
    matches(doc: Document): boolean;
}
/** A Filter that implements the array-contains operator. */
export declare class ArrayContainsFilter extends FieldFilter {
    constructor(field: FieldPath, value: ProtoValue);
    matches(doc: Document): boolean;
}
/** A Filter that implements the IN operator. */
export declare class InFilter extends FieldFilter {
    constructor(field: FieldPath, value: ProtoValue);
    matches(doc: Document): boolean;
}
/** A Filter that implements the not-in operator. */
export declare class NotInFilter extends FieldFilter {
    constructor(field: FieldPath, value: ProtoValue);
    matches(doc: Document): boolean;
}
/** A Filter that implements the array-contains-any operator. */
export declare class ArrayContainsAnyFilter extends FieldFilter {
    constructor(field: FieldPath, value: ProtoValue);
    matches(doc: Document): boolean;
}
