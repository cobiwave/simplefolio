import DomHandler, { DomHandlerOptions } from "domhandler";
import { getFeed, Feed } from "domutils";
import { ParserOptions } from "./Parser";
export { getFeed };
/** @deprecated Handler is no longer necessary; use `getFeed` or `parseFeed` instead. */
export declare class FeedHandler extends DomHandler {
    feed?: Feed;
    /**
     *
     * @param callback
     * @param options
     */
    constructor(callback?: ((error: Error | null) => void) | DomHandlerOptions, options?: DomHandlerOptions);
    onend(): void;
}
/**
 * Parse a feed.
 *
 * @param feed The feed that should be parsed, as a string.
 * @param options Optionally, options for parsing. When using this, you should set `xmlMode` to `true`.
 */
export declare function parseFeed(feed: string, options?: ParserOptions & DomHandlerOptions): Feed | null;
//# sourceMappingURL=FeedHandler.d.ts.map