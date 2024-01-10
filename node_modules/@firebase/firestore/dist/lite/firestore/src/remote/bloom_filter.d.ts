export declare class BloomFilter {
    readonly bitmap: Uint8Array;
    readonly padding: number;
    readonly hashCount: number;
    readonly bitCount: number;
    private readonly bitCountInInteger;
    constructor(bitmap: Uint8Array, padding: number, hashCount: number);
    private getBitIndex;
    private isBitSet;
    mightContain(value: string): boolean;
    /** Create bloom filter for testing purposes only. */
    static create(bitCount: number, hashCount: number, contains: string[]): BloomFilter;
    private insert;
    private setBit;
}
export declare class BloomFilterError extends Error {
    readonly name = "BloomFilterError";
}
