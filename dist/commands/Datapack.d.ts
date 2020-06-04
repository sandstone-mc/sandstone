/**
 * A McFunction's name has at least 2 components: a namespace, then the different folders up to the function itself.
 */
declare type McFunctionName = [string, string, ...string[]];
declare type CommandArgs = readonly [any, ...any[]];
export default class Datapack {
    namespace: string;
    currentFunction: McFunctionName | null;
    /** Here, we use a "string" for the name because JS doesn't support objects as indexes.
     * We'll use the JSON representation. */
    functions: Map<string, CommandArgs[]>;
    constructor(namespace: string);
    getCurrentFunctionMcName(): string;
    getCurrentFunction(): CommandArgs[];
    enterRootFunction(functionName: string): void;
    hasChildFunction(childName: string): boolean;
    enterChildFunction(functionName: string): string;
    exitRootFunction(): void;
    exitChildFunction(): void;
    registerNewCommand: (commandArgs: CommandArgs) => void;
    unregisterLastCommand: () => void;
    mcfunction: (name: string, callback: () => void) => void;
    save: () => void;
}
export {};
