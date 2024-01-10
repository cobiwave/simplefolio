export declare function decodeArray<T extends {
    [i: number]: number;
} = Uint16Array>(input: string | T, Type?: {
    new (n: number): T;
}): T;
