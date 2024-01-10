"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFeed = exports.FeedHandler = exports.getFeed = void 0;
var domhandler_1 = __importDefault(require("domhandler"));
var domutils_1 = require("domutils");
Object.defineProperty(exports, "getFeed", { enumerable: true, get: function () { return domutils_1.getFeed; } });
var Parser_1 = require("./Parser");
/** @deprecated Handler is no longer necessary; use `getFeed` or `parseFeed` instead. */
var FeedHandler = /** @class */ (function (_super) {
    __extends(FeedHandler, _super);
    /**
     *
     * @param callback
     * @param options
     */
    function FeedHandler(callback, options) {
        var _this = this;
        if (typeof callback === "object") {
            callback = undefined;
            options = callback;
        }
        _this = _super.call(this, callback, options) || this;
        return _this;
    }
    FeedHandler.prototype.onend = function () {
        var feed = (0, domutils_1.getFeed)(this.dom);
        if (feed) {
            this.feed = feed;
            this.handleCallback(null);
        }
        else {
            this.handleCallback(new Error("couldn't find root of feed"));
        }
    };
    return FeedHandler;
}(domhandler_1.default));
exports.FeedHandler = FeedHandler;
/**
 * Parse a feed.
 *
 * @param feed The feed that should be parsed, as a string.
 * @param options Optionally, options for parsing. When using this, you should set `xmlMode` to `true`.
 */
function parseFeed(feed, options) {
    if (options === void 0) { options = { xmlMode: true }; }
    var handler = new domhandler_1.default(null, options);
    new Parser_1.Parser(handler, options).end(feed);
    return (0, domutils_1.getFeed)(handler.dom);
}
exports.parseFeed = parseFeed;
