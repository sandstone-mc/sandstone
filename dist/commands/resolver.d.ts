/**
 * The main Sandstone object, also called the commands resolver.
 */
import { RootNode, CommandNode } from './commandsTypes';
import Datapack from './Datapack';
export declare class CommandsResolver {
    protected readonly datapack: Datapack;
    readonly commandsTree: RootNode;
    readonly currentNode: CommandNode | RootNode;
    protected readonly args: readonly any[];
    protected readonly executable: boolean;
    protected readonly id: number;
    protected static lastId: number;
    /**
     * A CommandResolver is the Javascript representation of a command. It is immutable.
     *
     * @param commandsTree the whole commands tree.
     * @param currentNode the current node of the tree.
     * @param args the arguments of the command.
     * @param executable Whether the current node is executable or not. Can be left 'undefined' for literal nodes.
     */
    constructor(datapack: Datapack, commandsTree: RootNode, currentNode: CommandNode | RootNode, args: readonly any[], executable?: boolean | undefined);
    /**
     * Get the Commands Resolver for a child of the current node.
     */
    getChildNodeResolver(childName: string): CommandsResolver;
    /**
     * Gets the Command Resolver for the current node, but with the arguments specified.
     */
    getArgumentsResolver(...args: any[]): CommandsResolver;
    /**
     * Creates and returns a child resolver.
     * Unregisters the current command.
     */
    protected createChildResolver(currentNode: CommandNode | RootNode, args: readonly any[], executable: boolean): CommandsResolver;
    /**
     * Registers the current command (add it to the datapack).
     */
    protected register(): void;
    /**
     * Unregisters the current command (remove it from the datapack).
     */
    protected unregister(): void;
    /**
     * Get the command as a string.
     */
    getCommand(): string;
}
export declare function createCommandsResolver(datapack: Datapack, commandsTree: RootNode): CommandsResolver;
