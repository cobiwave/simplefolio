import { Tree } from "./tree";
export interface ChangedRange {
    fromA: number;
    toA: number;
    fromB: number;
    toB: number;
}
export declare class TreeFragment {
    readonly from: number;
    readonly to: number;
    readonly tree: Tree;
    readonly offset: number;
    constructor(from: number, to: number, tree: Tree, offset: number, openStart?: boolean, openEnd?: boolean);
    get openStart(): boolean;
    get openEnd(): boolean;
    static addTree(tree: Tree, fragments?: readonly TreeFragment[], partial?: boolean): TreeFragment[];
    static applyChanges(fragments: readonly TreeFragment[], changes: readonly ChangedRange[], minGap?: number): readonly TreeFragment[];
}
export interface PartialParse {
    advance(): Tree | null;
    readonly parsedPos: number;
    stopAt(pos: number): void;
    readonly stoppedAt: number | null;
}
export declare abstract class Parser {
    abstract createParse(input: Input, fragments: readonly TreeFragment[], ranges: readonly {
        from: number;
        to: number;
    }[]): PartialParse;
    startParse(input: Input | string, fragments?: readonly TreeFragment[], ranges?: readonly {
        from: number;
        to: number;
    }[]): PartialParse;
    parse(input: Input | string, fragments?: readonly TreeFragment[], ranges?: readonly {
        from: number;
        to: number;
    }[]): Tree;
}
export interface Input {
    readonly length: number;
    chunk(from: number): string;
    readonly lineChunks: boolean;
    read(from: number, to: number): string;
}
export declare type ParseWrapper = (inner: PartialParse, input: Input, fragments: readonly TreeFragment[], ranges: readonly {
    from: number;
    to: number;
}[]) => PartialParse;
