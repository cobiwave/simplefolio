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
import { Bound } from '../core/bound';
import { DatabaseId } from '../core/database_info';
import { CompositeOperator, FieldFilter, Filter, Operator } from '../core/filter';
import { Direction, OrderBy } from '../core/order_by';
import { LimitType, Query as InternalQuery } from '../core/query';
import { Document } from '../model/document';
import { FieldPath as InternalFieldPath } from '../model/path';
import { FieldPath } from './field_path';
import { DocumentData, Query } from './reference';
import { DocumentSnapshot } from './snapshot';
import { UserDataReader } from './user_data_reader';
export declare function validateHasExplicitOrderByForLimitToLast(query: InternalQuery): void;
/** Describes the different query constraints available in this SDK. */
export declare type QueryConstraintType = 'where' | 'orderBy' | 'limit' | 'limitToLast' | 'startAt' | 'startAfter' | 'endAt' | 'endBefore';
/**
 * An `AppliableConstraint` is an abstraction of a constraint that can be applied
 * to a Firestore query.
 */
export declare abstract class AppliableConstraint {
    /**
     * Takes the provided {@link Query} and returns a copy of the {@link Query} with this
     * {@link AppliableConstraint} applied.
     */
    abstract _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */
export declare abstract class QueryConstraint extends AppliableConstraint {
    /** The type of this query constraint */
    abstract readonly type: QueryConstraintType;
    /**
     * Takes the provided {@link Query} and returns a copy of the {@link Query} with this
     * {@link AppliableConstraint} applied.
     */
    abstract _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * Creates a new immutable instance of {@link Query} that is extended to also
 * include additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new
 * constraints.
 * @param compositeFilter - The {@link QueryCompositeFilterConstraint} to
 * apply. Create {@link QueryCompositeFilterConstraint} using {@link and} or
 * {@link or}.
 * @param queryConstraints - Additional {@link QueryNonFilterConstraint}s to
 * apply (e.g. {@link orderBy}, {@link limit}).
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
export declare function query<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, compositeFilter: QueryCompositeFilterConstraint, ...queryConstraints: QueryNonFilterConstraint[]): Query<AppModelType, DbModelType>;
/**
 * Creates a new immutable instance of {@link Query} that is extended to also
 * include additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new
 * constraints.
 * @param queryConstraints - The list of {@link QueryConstraint}s to apply.
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
export declare function query<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, ...queryConstraints: QueryConstraint[]): Query<AppModelType, DbModelType>;
/**
 * A `QueryFieldFilterConstraint` is used to narrow the set of documents returned by
 * a Firestore query by filtering on one or more document fields.
 * `QueryFieldFilterConstraint`s are created by invoking {@link where} and can then
 * be passed to {@link (query:1)} to create a new query instance that also contains
 * this `QueryFieldFilterConstraint`.
 */
export declare class QueryFieldFilterConstraint extends QueryConstraint {
    private readonly _field;
    private _op;
    private _value;
    /** The type of this query constraint */
    readonly type = "where";
    /**
     * @internal
     */
    protected constructor(_field: InternalFieldPath, _op: Operator, _value: unknown);
    static _create(_field: InternalFieldPath, _op: Operator, _value: unknown): QueryFieldFilterConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
    _parse<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): FieldFilter;
}
/**
 * Filter conditions in a {@link where} clause are specified using the
 * strings '&lt;', '&lt;=', '==', '!=', '&gt;=', '&gt;', 'array-contains', 'in',
 * 'array-contains-any', and 'not-in'.
 */
export declare type WhereFilterOp = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';
/**
 * Creates a {@link QueryFieldFilterConstraint} that enforces that documents
 * must contain the specified field and that the value should satisfy the
 * relation constraint provided.
 *
 * @param fieldPath - The path to compare
 * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
 *   "&lt;=", "!=").
 * @param value - The value for comparison
 * @returns The created {@link QueryFieldFilterConstraint}.
 */
export declare function where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown): QueryFieldFilterConstraint;
/**
 * A `QueryCompositeFilterConstraint` is used to narrow the set of documents
 * returned by a Firestore query by performing the logical OR or AND of multiple
 * {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
 * `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
 * {@link and} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains the `QueryCompositeFilterConstraint`.
 */
export declare class QueryCompositeFilterConstraint extends AppliableConstraint {
    /** The type of this query constraint */
    readonly type: 'or' | 'and';
    private readonly _queryConstraints;
    /**
     * @internal
     */
    protected constructor(
    /** The type of this query constraint */
    type: 'or' | 'and', _queryConstraints: QueryFilterConstraint[]);
    static _create(type: 'or' | 'and', _queryConstraints: QueryFilterConstraint[]): QueryCompositeFilterConstraint;
    _parse<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Filter;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
    _getQueryConstraints(): readonly AppliableConstraint[];
    _getOperator(): CompositeOperator;
}
/**
 * `QueryNonFilterConstraint` is a helper union type that represents
 * QueryConstraints which are used to narrow or order the set of documents,
 * but that do not explicitly filter on a document field.
 * `QueryNonFilterConstraint`s are created by invoking {@link orderBy},
 * {@link (startAt:1)}, {@link (startAfter:1)}, {@link (endBefore:1)}, {@link (endAt:1)},
 * {@link limit} or {@link limitToLast} and can then be passed to {@link (query:1)}
 * to create a new query instance that also contains the `QueryConstraint`.
 */
export declare type QueryNonFilterConstraint = QueryOrderByConstraint | QueryLimitConstraint | QueryStartAtConstraint | QueryEndAtConstraint;
/**
 * `QueryFilterConstraint` is a helper union type that represents
 * {@link QueryFieldFilterConstraint} and {@link QueryCompositeFilterConstraint}.
 */
export declare type QueryFilterConstraint = QueryFieldFilterConstraint | QueryCompositeFilterConstraint;
/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a disjunction of
 * the given filter constraints. A disjunction filter includes a document if it
 * satisfies any of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a disjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
export declare function or(...queryConstraints: QueryFilterConstraint[]): QueryCompositeFilterConstraint;
/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a conjunction of
 * the given filter constraints. A conjunction filter includes a document if it
 * satisfies all of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a conjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
export declare function and(...queryConstraints: QueryFilterConstraint[]): QueryCompositeFilterConstraint;
/**
 * A `QueryOrderByConstraint` is used to sort the set of documents returned by a
 * Firestore query. `QueryOrderByConstraint`s are created by invoking
 * {@link orderBy} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains this `QueryOrderByConstraint`.
 *
 * Note: Documents that do not contain the orderBy field will not be present in
 * the query result.
 */
export declare class QueryOrderByConstraint extends QueryConstraint {
    private readonly _field;
    private _direction;
    /** The type of this query constraint */
    readonly type = "orderBy";
    /**
     * @internal
     */
    protected constructor(_field: InternalFieldPath, _direction: Direction);
    static _create(_field: InternalFieldPath, _direction: Direction): QueryOrderByConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * The direction of a {@link orderBy} clause is specified as 'desc' or 'asc'
 * (descending or ascending).
 */
export declare type OrderByDirection = 'desc' | 'asc';
/**
 * Creates a {@link QueryOrderByConstraint} that sorts the query result by the
 * specified field, optionally in descending order instead of ascending.
 *
 * Note: Documents that do not contain the specified field will not be present
 * in the query result.
 *
 * @param fieldPath - The field to sort by.
 * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
 * not specified, order will be ascending.
 * @returns The created {@link QueryOrderByConstraint}.
 */
export declare function orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): QueryOrderByConstraint;
/**
 * A `QueryLimitConstraint` is used to limit the number of documents returned by
 * a Firestore query.
 * `QueryLimitConstraint`s are created by invoking {@link limit} or
 * {@link limitToLast} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryLimitConstraint`.
 */
export declare class QueryLimitConstraint extends QueryConstraint {
    /** The type of this query constraint */
    readonly type: 'limit' | 'limitToLast';
    private readonly _limit;
    private readonly _limitType;
    /**
     * @internal
     */
    protected constructor(
    /** The type of this query constraint */
    type: 'limit' | 'limitToLast', _limit: number, _limitType: LimitType);
    static _create(type: 'limit' | 'limitToLast', _limit: number, _limitType: LimitType): QueryLimitConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * Creates a {@link QueryLimitConstraint} that only returns the first matching
 * documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */
export declare function limit(limit: number): QueryLimitConstraint;
/**
 * Creates a {@link QueryLimitConstraint} that only returns the last matching
 * documents.
 *
 * You must specify at least one `orderBy` clause for `limitToLast` queries,
 * otherwise an exception will be thrown during execution.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */
export declare function limitToLast(limit: number): QueryLimitConstraint;
/**
 * A `QueryStartAtConstraint` is used to exclude documents from the start of a
 * result set returned by a Firestore query.
 * `QueryStartAtConstraint`s are created by invoking {@link (startAt:1)} or
 * {@link (startAfter:1)} and can then be passed to {@link (query:1)} to create a
 * new query instance that also contains this `QueryStartAtConstraint`.
 */
export declare class QueryStartAtConstraint extends QueryConstraint {
    /** The type of this query constraint */
    readonly type: 'startAt' | 'startAfter';
    private readonly _docOrFields;
    private readonly _inclusive;
    /**
     * @internal
     */
    protected constructor(
    /** The type of this query constraint */
    type: 'startAt' | 'startAfter', _docOrFields: Array<unknown | DocumentSnapshot<unknown>>, _inclusive: boolean);
    static _create(type: 'startAt' | 'startAfter', _docOrFields: Array<unknown | DocumentSnapshot<unknown>>, _inclusive: boolean): QueryStartAtConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start at the provided document (inclusive). The starting position is relative
 * to the order of the query. The document must contain all of the fields
 * provided in the `orderBy` of this query.
 *
 * @param snapshot - The snapshot of the document to start at.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`.
 */
export declare function startAt<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryStartAtConstraint;
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start at the provided fields relative to the order of the query. The order of
 * the field values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to start this query at, in order
 * of the query's order by.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`.
 */
export declare function startAt(...fieldValues: unknown[]): QueryStartAtConstraint;
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start after the provided document (exclusive). The starting position is
 * relative to the order of the query. The document must contain all of the
 * fields provided in the orderBy of the query.
 *
 * @param snapshot - The snapshot of the document to start after.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`
 */
export declare function startAfter<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryStartAtConstraint;
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start after the provided fields relative to the order of the query. The order
 * of the field values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to start this query after, in order
 * of the query's order by.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`
 */
export declare function startAfter(...fieldValues: unknown[]): QueryStartAtConstraint;
/**
 * A `QueryEndAtConstraint` is used to exclude documents from the end of a
 * result set returned by a Firestore query.
 * `QueryEndAtConstraint`s are created by invoking {@link (endAt:1)} or
 * {@link (endBefore:1)} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryEndAtConstraint`.
 */
export declare class QueryEndAtConstraint extends QueryConstraint {
    /** The type of this query constraint */
    readonly type: 'endBefore' | 'endAt';
    private readonly _docOrFields;
    private readonly _inclusive;
    /**
     * @internal
     */
    protected constructor(
    /** The type of this query constraint */
    type: 'endBefore' | 'endAt', _docOrFields: Array<unknown | DocumentSnapshot<unknown>>, _inclusive: boolean);
    static _create(type: 'endBefore' | 'endAt', _docOrFields: Array<unknown | DocumentSnapshot<unknown>>, _inclusive: boolean): QueryEndAtConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end
 * before the provided document (exclusive). The end position is relative to the
 * order of the query. The document must contain all of the fields provided in
 * the orderBy of the query.
 *
 * @param snapshot - The snapshot of the document to end before.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
export declare function endBefore<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryEndAtConstraint;
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end
 * before the provided fields relative to the order of the query. The order of
 * the field values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to end this query before, in order
 * of the query's order by.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
export declare function endBefore(...fieldValues: unknown[]): QueryEndAtConstraint;
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end at
 * the provided document (inclusive). The end position is relative to the order
 * of the query. The document must contain all of the fields provided in the
 * orderBy of the query.
 *
 * @param snapshot - The snapshot of the document to end at.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
export declare function endAt<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>): QueryEndAtConstraint;
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end at
 * the provided fields relative to the order of the query. The order of the field
 * values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to end this query at, in order
 * of the query's order by.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
export declare function endAt(...fieldValues: unknown[]): QueryEndAtConstraint;
export declare function newQueryFilter(query: InternalQuery, methodName: string, dataReader: UserDataReader, databaseId: DatabaseId, fieldPath: InternalFieldPath, op: Operator, value: unknown): FieldFilter;
export declare function newQueryOrderBy(query: InternalQuery, fieldPath: InternalFieldPath, direction: Direction): OrderBy;
/**
 * Create a `Bound` from a query and a document.
 *
 * Note that the `Bound` will always include the key of the document
 * and so only the provided document will compare equal to the returned
 * position.
 *
 * Will throw if the document does not contain all fields of the order by
 * of the query or if any of the fields in the order by are an uncommitted
 * server timestamp.
 */
export declare function newQueryBoundFromDocument(query: InternalQuery, databaseId: DatabaseId, methodName: string, doc: Document | null, inclusive: boolean): Bound;
/**
 * Converts a list of field values to a `Bound` for the given query.
 */
export declare function newQueryBoundFromFields(query: InternalQuery, databaseId: DatabaseId, dataReader: UserDataReader, methodName: string, values: unknown[], inclusive: boolean): Bound;
export declare function validateQueryFilterConstraint(functionName: string, queryConstraint: AppliableConstraint): void;
