export declare const saveDatapack: (name: string, options?: import("./_internals/datapack/filesystem").SaveOptions | undefined) => void;
export declare const mcfunction: <T extends (...args: any[]) => void>(name: string, callback: T, options?: {
    lazy?: boolean | undefined;
} | undefined) => import("./_internals/datapack/Datapack").McFunction<Parameters<T>>;
