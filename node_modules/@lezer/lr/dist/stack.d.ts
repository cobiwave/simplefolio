import { BufferCursor } from "@lezer/common";
export declare class Stack {
    pos: number;
    get context(): any;
    canShift(term: number): boolean;
    get parser(): import("./parse").LRParser;
    dialectEnabled(dialectID: number): boolean;
    private shiftContext;
    private reduceContext;
    private updateContext;
}
export declare const enum Recover {
    Insert = 200,
    Delete = 190,
    Reduce = 100,
    MaxNext = 4,
    MaxInsertStackDepth = 300,
    DampenInsertStackDepth = 120
}
export declare class StackBufferCursor implements BufferCursor {
    stack: Stack;
    pos: number;
    index: number;
    buffer: number[];
    constructor(stack: Stack, pos: number, index: number);
    static create(stack: Stack, pos?: number): StackBufferCursor;
    maybeNext(): void;
    get id(): number;
    get start(): number;
    get end(): number;
    get size(): number;
    next(): void;
    fork(): StackBufferCursor;
}
