import { Tree, TreeFragment, NodeSet, NodeType, NodePropSource, Input, PartialParse, Parser, ParseWrapper } from "@lezer/common";
import { Stack } from "./stack";
import { Tokenizer, ExternalTokenizer, CachedToken, InputStream } from "./token";
declare class FragmentCursor {
    readonly fragments: readonly TreeFragment[];
    readonly nodeSet: NodeSet;
    i: number;
    fragment: TreeFragment | null;
    safeFrom: number;
    safeTo: number;
    trees: Tree[];
    start: number[];
    index: number[];
    nextStart: number;
    constructor(fragments: readonly TreeFragment[], nodeSet: NodeSet);
    nextFragment(): void;
    nodeAt(pos: number): Tree | null;
}
declare class TokenCache {
    readonly stream: InputStream;
    tokens: CachedToken[];
    mainToken: CachedToken | null;
    actions: number[];
    constructor(parser: LRParser, stream: InputStream);
    getActions(stack: Stack): number[];
    getMainToken(stack: Stack): CachedToken;
    updateCachedToken(token: CachedToken, tokenizer: Tokenizer, stack: Stack): void;
    putAction(action: number, token: number, end: number, index: number): number;
    addActions(stack: Stack, token: number, end: number, index: number): number;
}
export declare class Parse implements PartialParse {
    readonly parser: LRParser;
    readonly input: Input;
    readonly ranges: readonly {
        from: number;
        to: number;
    }[];
    stacks: Stack[];
    recovering: number;
    fragments: FragmentCursor | null;
    nextStackID: number;
    minStackPos: number;
    reused: Tree[];
    stream: InputStream;
    tokens: TokenCache;
    topTerm: number;
    stoppedAt: null | number;
    constructor(parser: LRParser, input: Input, fragments: readonly TreeFragment[], ranges: readonly {
        from: number;
        to: number;
    }[]);
    get parsedPos(): number;
    advance(): Tree;
    stopAt(pos: number): void;
    private advanceStack;
    private advanceFully;
    private runRecovery;
    stackToTree(stack: Stack): Tree;
    private stackID;
}
export declare class Dialect {
    readonly source: string | undefined;
    readonly flags: readonly boolean[];
    readonly disabled: null | Uint8Array;
    constructor(source: string | undefined, flags: readonly boolean[], disabled: null | Uint8Array);
    allows(term: number): boolean;
}
export declare class ContextTracker<T> {
    constructor(spec: {
        start: T;
        shift?(context: T, term: number, stack: Stack, input: InputStream): T;
        reduce?(context: T, term: number, stack: Stack, input: InputStream): T;
        reuse?(context: T, node: Tree, stack: Stack, input: InputStream): T;
        hash?(context: T): number;
        strict?: boolean;
    });
}
export interface ParserConfig {
    props?: readonly NodePropSource[];
    top?: string;
    dialect?: string;
    tokenizers?: {
        from: ExternalTokenizer;
        to: ExternalTokenizer;
    }[];
    contextTracker?: ContextTracker<any>;
    strict?: boolean;
    wrap?: ParseWrapper;
    bufferLength?: number;
}
export declare class LRParser extends Parser {
    readonly nodeSet: NodeSet;
    createParse(input: Input, fragments: readonly TreeFragment[], ranges: readonly {
        from: number;
        to: number;
    }[]): PartialParse;
    configure(config: ParserConfig): LRParser;
    getName(term: number): string;
    get topNode(): NodeType;
}
export {};
