import { McFunctionName, CommandArgs, SaveOptions } from './utils';
declare type McFunctionOptions = {
    /**
     * If true, then the function will only be created if it
     */
    lazy?: boolean;
};
declare type McFunctionMethod = {
    /**
     * Creates a Minecraft Function.
     *
     * @param name The name of the function. If left unspecified, creates an anonymous Minecraft Function.
     * @param callback A callback containing the commands you want in the Minecraft Function.
     */
    (name: string, callback: () => void, options?: McFunctionOptions): () => void;
    /**
     * Creates a Minecraft Function.
     *
     * @param name The name of the function. If left unspecified, creates an anonymous Minecraft Function.
     * @param callback A callback containing the commands you want in the Minecraft Function.
     */
    (callback: () => void, options?: McFunctionOptions): () => void;
};
export default class Datapack {
    defaultNamespace: string;
    currentFunction: McFunctionName | null;
    /** Here, we use a "string" for the name because JS doesn't support objects as indexes.
     * We'll use the JSON representation. */
    functions: Map<McFunctionName, CommandArgs[]>;
    constructor(namespace: string);
    /**
     * Get the commands of the current function.
     */
    getCurrentFunctionCommands(): CommandArgs[];
    /**
     * Enters a root Minecraft function.
     *
     * @param functionName The name of the function to enter
     */
    enterRootFunction(functionName: string): McFunctionName;
    /**
     * Check if the datapack contains a function with the given nam
     * @param functionName The name of the function
     */
    hasFunction(functionName: McFunctionName): boolean;
    /**
     * Returns a unique name for a function, from an original name.
     *
     * @example
     * // If there is no default:main function
     * getUniqueName(["default", "main"]) --> ["default", "main"]
     *
     * @example
     * // If there is already a default:main function
     * getUniqueName(["default", "main"]) --> ["default", "main_2"]
     *
     * @param functionName The original name for the function
     */
    getUniqueName(functionName: McFunctionName): McFunctionName;
    /**
     * Get a unique name for a child function of the current function, from an original name.
     * @param childName The original name for the child function.
     */
    getUniqueChildName(childName: string): string;
    /**
     * Enter a child function of the current function.
     * @param functionName The name of the child function.
     */
    enterChildFunction(functionName: string): string;
    /**
     * Recursively exit the current function of the datapack.
     *
     * If we're in a child function of a root function (or a n-th child), it will exit them too.
     */
    exitRootFunction(): void;
    /**
     * Exit the current child function, and enter the parent function.
     */
    exitChildFunction(): void;
    /**
     * Register a new command in the current function.
     * @param commandArgs The arguments of the command to add.
     */
    registerNewCommand: (commandArgs: CommandArgs) => void;
    /**
     * Remove the last command added to the current function.
     */
    unregisterLastCommand: () => void;
    mcfunction: McFunctionMethod;
    /**
     * Saves the datapack to the file system.
     *
     * @param name The name of the Datapack
     * @param options The save options
     */
    save: (name: string, options?: SaveOptions) => void;
}
export {};
