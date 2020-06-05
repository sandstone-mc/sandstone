"use strict";
/**
 * This file contains modifiers for the commands tree.
 * Each of this function changes the tree in a certain way.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUselessProperties = exports.commandsToCamelCase = exports.changeBiomeSoundParser = exports.setParserIds = exports.setLeafLiteralsToArguments = exports.redirectExecutesToRoot = exports.setLiteralArguments = exports.mergeLiteralSiblings = exports.normalizeNodes = exports.removeOpCommands = void 0;
const utils_1 = require("./utils");
/**
 * This function executes the given callback on the children of the node. It will always give, as the last argument, the child name.
 */
function executeOnChildren(commandNode, callback, ...additionalArgs) {
    // If the node has no children, stop here
    if (!Object.prototype.hasOwnProperty.call(commandNode, 'children')) {
        return;
    }
    const { children } = commandNode;
    for (const childName in children) {
        if (Object.prototype.hasOwnProperty.call(children, childName)) {
            const child = children[childName];
            callback(child, ...additionalArgs, childName);
        }
    }
}
function removeOpCommands(commandRoot) {
    // Remove commands that are not usable by datapacks.
    // Taken from: https://minecraft.gamepedia.com/Commands#List_and_summary_of_commands
    delete commandRoot.children.publish;
    delete commandRoot.children['save-all'];
    delete commandRoot.children['save-on'];
    delete commandRoot.children['save-off'];
    delete commandRoot.children.stop;
    delete commandRoot.children.ban;
    delete commandRoot.children['ban-ip'];
    delete commandRoot.children.banlist;
    delete commandRoot.children.debug;
    delete commandRoot.children.deop;
    delete commandRoot.children.kick;
    delete commandRoot.children.op;
    delete commandRoot.children.pardon;
    delete commandRoot.children['pardon-ip'];
    delete commandRoot.children.setidletimeout;
    delete commandRoot.children.whitelist;
}
exports.removeOpCommands = removeOpCommands;
/**
 * Transforms all nodes properties into arrays, which are more convenient to use (because later on, nodes will be merged together).
 * It means `executable` becomes `executables`, and `parser` becomes `parsers`.
 * For argument nodes, it will default their `executable` to false, and their properties to `undefined`
 */
function normalizeNodes(commandNode, name = 'root') {
    var _a;
    commandNode.parsers = commandNode.parser ? [commandNode.parser] : [];
    if (commandNode.type === 'argument') {
        commandNode.executables = [(_a = commandNode.executable) !== null && _a !== void 0 ? _a : false];
        commandNode.properties = [commandNode.properties];
    }
    else {
        commandNode.executables = commandNode.executable ? [commandNode.executable] : [];
        commandNode.properties = [];
    }
    delete commandNode.parser;
    delete commandNode.executable;
    executeOnChildren(commandNode, normalizeNodes);
}
exports.normalizeNodes = normalizeNodes;
/**
 * Transform sibling nodes which all are literals, and have the same children themselves, into a single node.
 */
function mergeLiteralSiblings(commandNode) {
    var _a;
    const childrenNames = Object.keys((_a = commandNode.children) !== null && _a !== void 0 ? _a : {});
    if (!childrenNames.length) {
        return;
    }
    const children = childrenNames.map((name) => commandNode.children[name]);
    // We check if the 1st node is a literal
    if (children[0].type !== 'literal' || children[0].children) {
        executeOnChildren(commandNode, mergeLiteralSiblings);
        return;
    }
    // We will get the JSON representation of the 1st child, and check if all children have the same representation.
    const jsonRepresentation = JSON.stringify(children[0]);
    let allEqual = true;
    for (const child of children) {
        const { arguments: _, ...childWithoutName } = child;
        if (JSON.stringify(childWithoutName) !== jsonRepresentation) {
            allEqual = false;
        }
    }
    if (allEqual) {
        // All children are literal nodes with the same properties & children, we can merge them
        // To do that, we only keep the 1st child (since they're all identical), and set him a custom parser for later use.
        commandNode.children = {
            option: {
                ...children[0],
                parsers: ['sandstone:literals'],
                literalValues: [childrenNames],
                executables: children[0].executables.length ? children[0].executables : [false],
            },
        };
    }
    executeOnChildren(commandNode, mergeLiteralSiblings);
}
exports.mergeLiteralSiblings = mergeLiteralSiblings;
/**
 * Contracts literals with only 1 possibility (like "as", it only has the "targets" child)
 * to 1 node with the "literalArgument" type.
 *
 * Warning: this directly modifies the given object.
 */
function setLiteralArguments(commandNode) {
    var _a, _b, _c, _d, _e, _f;
    let childrenNames = Object.keys((_a = commandNode.children) !== null && _a !== void 0 ? _a : {});
    if (commandNode.type === 'literal') {
    }
    // While the node is a literal/literalArgument with only 1 children
    while (['literal', 'literalArgument'].includes(commandNode.type) && childrenNames.length === 1) {
        const childName = childrenNames[0];
        const child = commandNode.children[childName];
        const newProperties = {
            parsers: [...commandNode.parsers, ...child.parsers],
            executables: [...commandNode.executables, ...child.executables],
            properties: [...commandNode.properties, ...child.properties],
            arguments: [...((_b = commandNode.arguments) !== null && _b !== void 0 ? _b : []), ...((_c = child.arguments) !== null && _c !== void 0 ? _c : [childName])],
            literalValues: [...((_d = commandNode.literalValues) !== null && _d !== void 0 ? _d : []), ...((_e = child.literalValues) !== null && _e !== void 0 ? _e : [undefined])],
        };
        // Remove all children
        delete commandNode.children;
        // Assign all properties of the only child to this node
        Object.assign(commandNode, child, newProperties);
        // Set the new type
        commandNode.type = 'literalArgument';
        childrenNames = Object.keys((_f = commandNode.children) !== null && _f !== void 0 ? _f : {});
    }
    // Call the same method on all children
    executeOnChildren(commandNode, setLiteralArguments);
}
exports.setLiteralArguments = setLiteralArguments;
/**
 * Add a 'root' redirect in all execute nodes.
 */
function redirectExecutesToRoot(commandNode) {
    if (commandNode.type === 'root') {
        redirectExecutesToRoot(commandNode.children.execute);
        return;
    }
    if (commandNode.redirect && commandNode.redirect[0] === 'execute') {
        commandNode.redirect.push('root');
    }
    executeOnChildren(commandNode, redirectExecutesToRoot);
}
exports.redirectExecutesToRoot = redirectExecutesToRoot;
/**
 * All leaf "literal" nodes should be called like functions.
 * Therefore, they should become literalArguments, with an empty arguments list.
 */
function setLeafLiteralsToArguments(commandNode, name = 'root') {
    if (commandNode.type === 'literal' && !commandNode.children) {
        // The node is a literal with no children, therefore a leaf literal node.
        Object.assign(commandNode, {
            type: 'literalArgument',
            parsers: [],
            executables: [],
            arguments: [],
            properties: [],
        });
    }
    executeOnChildren(commandNode, setLeafLiteralsToArguments);
}
exports.setLeafLiteralsToArguments = setLeafLiteralsToArguments;
/**
 * Gives all nodes parsers a unique ID associated with their given parser.
 * Is used to give a Typescript type to all nodes.
 *
 * @returns the mapping from IDs to parsers.
 */
function setParserIds(commandNode, compoundTypesMap = new Map(), existingTypes = new Map(), name = 'root') {
    var _a;
    let parserInfo = null;
    let id = Math.max(-1, ...compoundTypesMap.keys()) + 1;
    if (commandNode.type === 'literalArgument') {
        // If we have a parser with multiple elements, register them
        // First, if some elements are optionals, we need to register all possible potentialParsers combinations
        const possibleParsers = [];
        for (let i = 0; i < commandNode.parsers.length; i += 1) {
            // Basically, we stack arguments, and register once the command becomes executable.
            // The full parser (aka the last one) must always be registered.
            if (commandNode.executables[i] || i + 1 === commandNode.parsers.length) {
                possibleParsers.push(commandNode.parsers.slice(0, i + 1));
            }
        }
        parserInfo = {
            parsers: possibleParsers,
            arguments: commandNode.arguments,
            literalValues: commandNode.literalValues,
        };
    }
    else if (commandNode.parsers.length) {
        parserInfo = {
            parsers: [commandNode.parsers],
            arguments: (_a = commandNode.arguments) !== null && _a !== void 0 ? _a : [name],
            literalValues: commandNode.literalValues,
        };
    }
    if (parserInfo) {
        // If we have a parser, check if we don't already have an identical parser (no need to duplicate identical parsers)
        const jsonRepresentation = JSON.stringify(parserInfo);
        if (!existingTypes.has(jsonRepresentation)) {
            // If we don't already have it, create a new ID
            existingTypes.set(jsonRepresentation, id);
            // Push the new parser
            compoundTypesMap.set(id, parserInfo);
        }
        else {
            // If we already have this parser registered, get its ID
            id = existingTypes.get(jsonRepresentation);
        }
        commandNode.parsersId = id;
    }
    executeOnChildren(commandNode, setParserIds, compoundTypesMap, existingTypes);
    return compoundTypesMap;
}
exports.setParserIds = setParserIds;
function changeBiomeSoundParser(commandNode) {
    const newParsers = new Map([
        ['biome', 'sandstone:biome'],
        ['sound', 'sandstone:sound'],
    ]);
    const newParser = newParsers.get(commandNode.arguments);
    if (newParser) {
        commandNode.parser = newParser;
    }
    else if (Array.isArray(commandNode.parser)) {
        // If we have an array of parsers & arguments, get where arguments are biome/sound, and replace corresponding parser
        commandNode.arguments.forEach((arg, i) => {
            const parser = newParsers.get(arg);
            if (parser) {
                commandNode.parsers[i] = parser;
            }
        });
    }
    executeOnChildren(commandNode, changeBiomeSoundParser);
}
exports.changeBiomeSoundParser = changeBiomeSoundParser;
/**
 * Transforms all commands names into camelCase
 */
function commandsToCamelCase(commandsNode) {
    for (const command in commandsNode.children) {
        if (Object.prototype.hasOwnProperty.call(commandsNode, command)) {
            const camelCasedCommand = utils_1.toCamelCase(command);
            if (camelCasedCommand !== command) {
                commandsNode.children[camelCasedCommand] = commandsNode.children[command];
                delete commandsNode.children.command;
            }
        }
    }
    executeOnChildren(commandsNode, commandsToCamelCase);
}
exports.commandsToCamelCase = commandsToCamelCase;
function cleanUselessProperties(commandNode) {
    // If `properties` or `literalArguments` are only made of `undefined` (or empty), remove them
    if (commandNode.properties && (commandNode.properties.every((value) => value === undefined) || !commandNode.properties.length)) {
        delete commandNode.properties;
    }
    if (commandNode.literalValues && (!commandNode.literalValues.find((_, value) => value !== undefined) || !commandNode.literalValues.length)) {
        delete commandNode.literalValues;
    }
    if (commandNode.type === 'literal') {
        delete commandNode.executables;
        delete commandNode.arguments;
        delete commandNode.parsers;
    }
    executeOnChildren(commandNode, cleanUselessProperties);
}
exports.cleanUselessProperties = cleanUselessProperties;
//# sourceMappingURL=treeModifiers.js.map