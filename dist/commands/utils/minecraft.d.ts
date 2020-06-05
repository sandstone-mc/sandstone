/**
 * A McFunction's name has at least 2 components: a namespace, then the different folders up to the function itself.
 */
export declare type McFunctionName = string[];
export declare type CommandArgs = readonly [any, ...any[]];
export declare function toMcFunctionName(functionName: McFunctionName | string[]): string;
