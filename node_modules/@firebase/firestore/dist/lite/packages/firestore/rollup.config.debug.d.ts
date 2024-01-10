declare const _default: {
    input: string;
    output: {
        file: string;
        format: string;
        sourcemap: boolean;
    };
    plugins: import("rollup").Plugin[];
    external: (id: any) => boolean;
    treeshake: {
        moduleSideEffects: boolean;
    };
}[];
export default _default;
