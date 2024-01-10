import { Parser } from "./parse";
export declare const DefaultBufferLength = 1024;
export declare class Range {
    readonly from: number;
    readonly to: number;
    constructor(from: number, to: number);
}
export declare class NodeProp<T> {
    perNode: boolean;
    deserialize: (str: string) => T;
    constructor(config?: {
        deserialize?: (str: string) => T;
        perNode?: boolean;
    });
    add(match: {
        [selector: string]: T;
    } | ((type: NodeType) => T | undefined)): NodePropSource;
    static closedBy: NodeProp<readonly string[]>;
    static openedBy: NodeProp<readonly string[]>;
    static group: NodeProp<readonly string[]>;
    static contextHash: NodeProp<number>;
    static lookAhead: NodeProp<number>;
    static mounted: NodeProp<MountedTree>;
}
export declare class MountedTree {
    readonly tree: Tree;
    readonly overlay: readonly {
        from: number;
        to: number;
    }[] | null;
    readonly parser: Parser;
    constructor(tree: Tree, overlay: readonly {
        from: number;
        to: number;
    }[] | null, parser: Parser);
}
export declare type NodePropSource = (type: NodeType) => null | [NodeProp<any>, any];
export declare class NodeType {
    readonly name: string;
    readonly id: number;
    static define(spec: {
        id: number;
        name?: string;
        props?: readonly ([NodeProp<any>, any] | NodePropSource)[];
        top?: boolean;
        error?: boolean;
        skipped?: boolean;
    }): NodeType;
    prop<T>(prop: NodeProp<T>): T | undefined;
    get isTop(): boolean;
    get isSkipped(): boolean;
    get isError(): boolean;
    get isAnonymous(): boolean;
    is(name: string | number): boolean;
    static none: NodeType;
    static match<T>(map: {
        [selector: string]: T;
    }): (node: NodeType) => T | undefined;
}
export declare class NodeSet {
    readonly types: readonly NodeType[];
    constructor(types: readonly NodeType[]);
    extend(...props: NodePropSource[]): NodeSet;
}
export declare class Tree {
    readonly type: NodeType;
    readonly children: readonly (Tree | TreeBuffer)[];
    readonly positions: readonly number[];
    readonly length: number;
    constructor(type: NodeType, children: readonly (Tree | TreeBuffer)[], positions: readonly number[], length: number, props?: readonly [NodeProp<any> | number, any][]);
    static empty: Tree;
    cursor(pos?: number, side?: -1 | 0 | 1): TreeCursor;
    fullCursor(): TreeCursor;
    get topNode(): SyntaxNode;
    resolve(pos: number, side?: -1 | 0 | 1): SyntaxNode;
    resolveInner(pos: number, side?: -1 | 0 | 1): SyntaxNode;
    iterate(spec: {
        enter(type: NodeType, from: number, to: number, get: () => SyntaxNode): false | void;
        leave?(type: NodeType, from: number, to: number, get: () => SyntaxNode): void;
        from?: number;
        to?: number;
    }): void;
    prop<T>(prop: NodeProp<T>): T | undefined;
    get propValues(): readonly [NodeProp<any> | number, any][];
    balance(config?: {
        makeTree?: (children: readonly (Tree | TreeBuffer)[], positions: readonly number[], length: number) => Tree;
    }): Tree;
    static build(data: BuildData): Tree;
}
declare type BuildData = {
    buffer: BufferCursor | readonly number[];
    nodeSet: NodeSet;
    topID: number;
    start?: number;
    bufferStart?: number;
    length?: number;
    maxBufferLength?: number;
    reused?: readonly Tree[];
    minRepeatType?: number;
};
export interface BufferCursor {
    pos: number;
    id: number;
    start: number;
    end: number;
    size: number;
    next(): void;
    fork(): BufferCursor;
}
export declare class TreeBuffer {
    readonly buffer: Uint16Array;
    readonly length: number;
    readonly set: NodeSet;
    constructor(buffer: Uint16Array, length: number, set: NodeSet);
}
export interface SyntaxNode {
    type: NodeType;
    name: string;
    from: number;
    to: number;
    parent: SyntaxNode | null;
    firstChild: SyntaxNode | null;
    lastChild: SyntaxNode | null;
    childAfter(pos: number): SyntaxNode | null;
    childBefore(pos: number): SyntaxNode | null;
    enter(pos: number, side: -1 | 0 | 1, overlays?: boolean, buffers?: boolean): SyntaxNode | null;
    nextSibling: SyntaxNode | null;
    prevSibling: SyntaxNode | null;
    cursor: TreeCursor;
    resolve(pos: number, side?: -1 | 0 | 1): SyntaxNode;
    resolveInner(pos: number, side?: -1 | 0 | 1): SyntaxNode;
    enterUnfinishedNodesBefore(pos: number): SyntaxNode;
    tree: Tree | null;
    toTree(): Tree;
    getChild(type: string | number, before?: string | number | null, after?: string | number | null): SyntaxNode | null;
    getChildren(type: string | number, before?: string | number | null, after?: string | number | null): SyntaxNode[];
}
declare const enum Side {
    Before = -2,
    AtOrBefore = -1,
    Around = 0,
    AtOrAfter = 1,
    After = 2,
    DontCare = 4
}
export declare const enum Mode {
    Full = 1,
    NoEnterBuffer = 2
}
export declare class TreeNode implements SyntaxNode {
    readonly node: Tree;
    readonly _from: number;
    readonly index: number;
    readonly _parent: TreeNode | null;
    constructor(node: Tree, _from: number, index: number, _parent: TreeNode | null);
    get type(): NodeType;
    get name(): string;
    get from(): number;
    get to(): number;
    nextChild(i: number, dir: 1 | -1, pos: number, side: Side, mode?: Mode): TreeNode | BufferNode | null;
    get firstChild(): TreeNode | BufferNode;
    get lastChild(): TreeNode | BufferNode;
    childAfter(pos: number): TreeNode | BufferNode;
    childBefore(pos: number): TreeNode | BufferNode;
    enter(pos: number, side: -1 | 0 | 1, overlays?: boolean, buffers?: boolean): TreeNode | BufferNode;
    nextSignificantParent(): TreeNode;
    get parent(): TreeNode;
    get nextSibling(): TreeNode | BufferNode;
    get prevSibling(): TreeNode | BufferNode;
    get cursor(): TreeCursor;
    get tree(): Tree;
    toTree(): Tree;
    resolve(pos: number, side?: -1 | 0 | 1): SyntaxNode;
    resolveInner(pos: number, side?: -1 | 0 | 1): SyntaxNode;
    enterUnfinishedNodesBefore(pos: number): SyntaxNode;
    getChild(type: string | number, before?: string | number | null, after?: string | number | null): SyntaxNode;
    getChildren(type: string | number, before?: string | number | null, after?: string | number | null): SyntaxNode[];
}
declare class BufferContext {
    readonly parent: TreeNode;
    readonly buffer: TreeBuffer;
    readonly index: number;
    readonly start: number;
    constructor(parent: TreeNode, buffer: TreeBuffer, index: number, start: number);
}
declare class BufferNode implements SyntaxNode {
    readonly context: BufferContext;
    readonly _parent: BufferNode | null;
    readonly index: number;
    type: NodeType;
    get name(): string;
    get from(): number;
    get to(): number;
    constructor(context: BufferContext, _parent: BufferNode | null, index: number);
    child(dir: 1 | -1, pos: number, side: Side): BufferNode | null;
    get firstChild(): BufferNode;
    get lastChild(): BufferNode;
    childAfter(pos: number): BufferNode;
    childBefore(pos: number): BufferNode;
    enter(pos: number, side: -1 | 0 | 1, overlays?: boolean, buffers?: boolean): BufferNode;
    get parent(): TreeNode | BufferNode;
    externalSibling(dir: 1 | -1): TreeNode | BufferNode;
    get nextSibling(): SyntaxNode | null;
    get prevSibling(): SyntaxNode | null;
    get cursor(): TreeCursor;
    get tree(): any;
    toTree(): Tree;
    resolve(pos: number, side?: -1 | 0 | 1): SyntaxNode;
    resolveInner(pos: number, side?: -1 | 0 | 1): SyntaxNode;
    enterUnfinishedNodesBefore(pos: number): SyntaxNode;
    getChild(type: string | number, before?: string | number | null, after?: string | number | null): SyntaxNode;
    getChildren(type: string | number, before?: string | number | null, after?: string | number | null): SyntaxNode[];
}
export declare class TreeCursor {
    type: NodeType;
    get name(): string;
    from: number;
    to: number;
    private buffer;
    private stack;
    private index;
    private bufferNode;
    private yieldNode;
    private yieldBuf;
    private yield;
    firstChild(): boolean;
    lastChild(): boolean;
    childAfter(pos: number): boolean;
    childBefore(pos: number): boolean;
    enter(pos: number, side: -1 | 0 | 1, overlays?: boolean, buffers?: boolean): boolean;
    parent(): boolean;
    nextSibling(): boolean;
    prevSibling(): boolean;
    private atLastNode;
    private move;
    next(enter?: boolean): boolean;
    prev(enter?: boolean): boolean;
    moveTo(pos: number, side?: -1 | 0 | 1): this;
    get node(): SyntaxNode;
    get tree(): Tree | null;
}
export {};
