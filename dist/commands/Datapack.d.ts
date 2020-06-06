import { CommandArgs, SaveOptions } from './utils';
import { FunctionResource, ResourcesTree, ResourcePath } from './utils/resourcesTree';
declare type McFunctionOptions = {
    /**
     * If true, then the function will only be created if it
     */
    lazy?: boolean;
};
export default class Datapack {
    defaultNamespace: string;
    currentFunction: FunctionResource | null;
    resources: ResourcesTree;
    constructor(namespace: string);
    private getFunctionAndNamespace;
    /**
     * Creates and enters a new root Minecraft function.
     *
     * @param functionName The name of the function to create
     */
    createEnterRootFunction(functionName: string): ResourcePath;
    /**
     * Check if the datapack contains a function with the given nam
     * @param functionPath The name of the function
     */
    hasFunction(functionPath: ResourcePath): boolean;
    /**
     * Returns a unique name for a function, from an original name, by checking if it already exists in the given folder.
     * @param functionName the original name for the function.
     * @param folder the folder to check into.
     */
    getUniqueNameFromFolder(functionName: string, folder: FunctionResource): string;
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
     * @param functionPath The original path for the function
     */
    getUniqueName(functionPath: ResourcePath): ResourcePath;
    /**
     * Get a unique name for a child function of the current function, from an original name.
     * @param childName The original name for the child function.
     */
    getUniqueChildName(childName: string): string;
    /**
     * Creates and enters a new child function of the current function.
     * @param functionName The name of the child function.
     */
    createEnterChildFunction(functionName: string): string;
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
    /**
     * Creates a Minecraft Function.
     *
     * @param name The name of the function. If left unspecified, creates an anonymous Minecraft Function.
     * @param callback A callback containing the commands you want in the Minecraft Function.
     */
    mcfunction: <T extends (...args: any[]) => void>(name: string, callback: T, options?: McFunctionOptions | undefined) => (...args: Parameters<T>) => void;
    /**
     * Saves the datapack to the file system.
     *
     * @param name The name of the Datapack
     * @param options The save options
     */
    save: (name: string, options?: SaveOptions) => void;
}
export {};
