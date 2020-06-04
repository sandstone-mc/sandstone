/**
 * This file contains modifiers for the commands tree.
 * Each of this function changes the tree in a certain way.
 */
export declare function removeOpCommands(commandRoot: any): void;
/**
 * Transforms all nodes properties into arrays, which are more convenient to use (because later on, nodes will be merged together).
 * It means `executable` becomes `executables`, and `parser` becomes `parsers`.
 * For argument nodes, it will default their `executable` to false, and their properties to `undefined`
 */
export declare function normalizeNodes(commandNode: any, name?: string): void;
/**
 * Transform sibling nodes which all are literals, and have the same children themselves, into a single node.
 */
export declare function mergeLiteralSiblings(commandNode: any): void;
/**
 * Contracts literals with only 1 possibility (like "as", it only has the "targets" child)
 * to 1 node with the "literalArgument" type.
 *
 * Warning: this directly modifies the given object.
 */
export declare function setLiteralArguments(commandNode: any): void;
/**
 * Add a 'root' redirect in all execute nodes.
 */
export declare function redirectExecutesToRoot(commandNode: any): void;
/**
 * All leaf "literal" nodes should be called like functions.
 * Therefore, they should become literalArguments, with an empty arguments list.
 */
export declare function setLeafLiteralsToArguments(commandNode: any, name?: string): void;
declare type ParserInfo = {
    parsers: string[][];
    arguments: string[];
    literalValues: string[][];
};
declare type ExistingTypes = Map<string, number>;
declare type CompoundTypesMap = Map<number, ParserInfo>;
/**
 * Gives all nodes parsers a unique ID associated with their given parser.
 * Is used to give a Typescript type to all nodes.
 *
 * @returns the mapping from IDs to parsers.
 */
export declare function setParserIds(commandNode: any, compoundTypesMap?: CompoundTypesMap, existingTypes?: ExistingTypes, name?: string): CompoundTypesMap;
export declare function changeBiomeSoundParser(commandNode: any): void;
/**
 * Transforms all commands names into camelCase
 */
export declare function commandsToCamelCase(commandsNode: any): void;
export declare function cleanUselessProperties(commandNode: any): void;
export {};
