import { Stack } from "./stack";
export declare class CachedToken {
    start: number;
    value: number;
    end: number;
    extended: number;
    lookAhead: number;
    mask: number;
    context: number;
}
export declare class InputStream {
    private chunk2;
    private chunk2Pos;
    next: number;
    pos: number;
    private rangeIndex;
    private range;
    resolveOffset(offset: number, assoc: -1 | 1): number;
    peek(offset: number): any;
    acceptToken(token: number, endOffset?: number): void;
    private getChunk;
    private readNext;
    advance(n?: number): number;
    private setDone;
}
export interface Tokenizer {
}
interface ExternalOptions {
    contextual?: boolean;
    fallback?: boolean;
    extend?: boolean;
}
export declare class ExternalTokenizer implements Tokenizer {
    constructor(token: (input: InputStream, stack: Stack) => void, options?: ExternalOptions);
}
export {};
