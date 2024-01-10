/**
 * Takes data and encodes it in a JSON-friendly way, such that types such as
 * Date are preserved.
 * @internal
 * @param data - Data to encode.
 */
export declare function encode(data: unknown): unknown;
/**
 * Takes data that's been encoded in a JSON-friendly form and returns a form
 * with richer datatypes, such as Dates, etc.
 * @internal
 * @param json - JSON to convert.
 */
export declare function decode(json: unknown): unknown;
