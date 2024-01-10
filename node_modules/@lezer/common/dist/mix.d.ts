import { TreeCursor } from "./tree";
import { Input, Parser, ParseWrapper } from "./parse";
export interface NestedParse {
    parser: Parser;
    overlay?: readonly {
        from: number;
        to: number;
    }[] | ((node: TreeCursor) => {
        from: number;
        to: number;
    } | boolean);
}
export declare function parseMixed(nest: (node: TreeCursor, input: Input) => NestedParse | null): ParseWrapper;
