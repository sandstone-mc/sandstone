import { CommandsRoot } from '@commands';
import type { ObjectiveClass } from '@variables';
import { SaveOptions } from './filesystem';
import { CommandArgs } from './minecraft';
import { FunctionResource, ResourcesTree } from './resourcesTree';
declare type McFunctionOptions = {
    /**
     * If true, then the function will only be created if it ??
     */
    lazy?: boolean;
};
export interface McFunction<T extends unknown[]> {
    (...args: T): void;
}
export default class Datapack {
    defaultNamespace: string;
    currentFunction: FunctionResource | null;
    resources: ResourcesTree;
    objectives: Map<string, ObjectiveClass>;
    commandsRoot: CommandsRoot;
    constants: Set<number>;
    constructor(namespace: string);
    private getFunctionAndNamespace;
    /**
     * Creates and enters a new root Minecraft function.
     *
     * @param functionName The name of the function to create
     */
    private createEnterRootFunction;
    /**
     * Returns a unique name for a function, from an original name, by checking if it already exists in the given folder.
     * @param functionName the original name for the function.
     * @param folder the folder to check into.
     */
    private getUniqueNameFromFolder;
    /**
     * Get a unique name for a child function of the current function, from an original name.
     * @param childName The original name for the child function.
     */
    private getUniqueChildName;
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
    private exitRootFunction;
    /**
     * Exit the current child function, and enter the parent function.
     */
    exitChildFunction(): void;
    registerNewObjective: (objective: ObjectiveClass) => void;
    /**
     * Register a new command in the current function.
     * @param commandArgs The arguments of the command to add.
     */
    registerNewCommand: (commandArgs: CommandArgs) => void;
    /**
     * Register a new numeric constant.
     */
    registerNewConstant(amount: number): void;
    /**
     * Creates a Minecraft Function.
     *
     * @param name The name of the function.
     * @param callback A callback containing the commands you want in the Minecraft Function.
     */
    mcfunction: <T extends (...args: any[]) => void>(name: string, callback: T, options?: McFunctionOptions | undefined) => McFunction<Parameters<T>>;
    /**
     * Saves the datapack to the file system.
     *
     * @param name The name of the Datapack
     * @param options The save options
     */
    save: (name: string, options?: SaveOptions) => void;
}
export {};
