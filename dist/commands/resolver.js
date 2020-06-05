"use strict";
/**
 * The main Sandstone object, also called the commands resolver.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommandsResolver = exports.CommandsResolver = void 0;
function objectHasProperty(obj, property) {
    return Object.prototype.hasOwnProperty.call(obj, property);
}
function isNodeWithArguments(obj) {
    return obj.type === 'argument' || obj.type === 'literalArgument';
}
function isNodeWithRedirect(obj) {
    return objectHasProperty(obj, 'redirect');
}
function isNodeWithChildren(obj) {
    return objectHasProperty(obj, 'children');
}
function _hasChild(obj, childName) {
    return objectHasProperty(obj.children, childName);
}
function isNodeWithExecutables(node) {
    return objectHasProperty(node, 'executables');
}
function hasChild(obj, childName) {
    return isNodeWithChildren(obj) && _hasChild(obj, childName);
}
function isTerminalNode(node) {
    return !isNodeWithChildren(node) && !isNodeWithRedirect(node);
}
const registeredCommands = new Map();
let CommandsResolver = /** @class */ (() => {
    class CommandsResolver {
        /**
         * A CommandResolver is the Javascript representation of a command. It is immutable.
         *
         * @param commandsTree the whole commands tree.
         * @param currentNode the current node of the tree.
         * @param args the arguments of the command.
         * @param executable Whether the current node is executable or not. Can be left 'undefined' for literal nodes.
         */
        constructor(datapack, commandsTree, currentNode, args, executable = undefined) {
            this.datapack = datapack;
            this.commandsTree = commandsTree;
            this.currentNode = currentNode;
            this.args = args;
            CommandsResolver.lastId += 1;
            this.id = CommandsResolver.lastId;
            // We want to know if our command is executable. If it is, then we register it.
            if (currentNode.type === 'literal') {
                if (isNodeWithExecutables(currentNode)) {
                    [this.executable] = currentNode.executables;
                }
                else {
                    this.executable = false;
                }
            }
            else if (executable === undefined) {
                throw new Error(`Got undefined "executable" argument for a ${currentNode.type} node. You must specify whether the node is executable or not.`);
            }
            else {
                this.executable = executable;
                if (executable) {
                    this.register();
                }
            }
        }
        /**
         * Get the Commands Resolver for a child of the current node.
         */
        getChildNodeResolver(childName) {
            if (isNodeWithChildren(this.currentNode)) {
                // Our node has children. We need to find the wanted subcommand between the children.
                const nextNode = this.currentNode.children[childName];
                if (!nextNode) {
                    // If nextNode is undefined, it means there is no such child.
                    throw new Error(`Command "${this.getCommand()}" has no "${childName}" subcommand.`);
                }
                return this.createChildResolver(nextNode, [...this.args, childName], false);
            }
            if (isNodeWithRedirect(this.currentNode)) {
                // Our node has redirects. We need to find the wanted subcommand between all possible redirects.
                let nextNode;
                for (const redirectionName of this.currentNode.redirect) {
                    try {
                        const newArgs = [...this.args];
                        if (redirectionName === 'root') {
                            nextNode = this.commandsTree;
                            newArgs.push('run');
                        }
                        else {
                            nextNode = this.commandsTree.children[redirectionName];
                        }
                        const redirectedResolver = new CommandsResolver(this.datapack, this.commandsTree, nextNode, newArgs, false);
                        return redirectedResolver.getChildNodeResolver(childName);
                    }
                    catch (e) {
                        // Don't do anything - it just means the current had, in fact, no child of the given name. Maybe the next one will.
                    }
                }
                // If we're here, it means none of the redirects had a child of the given name.
                throw new Error(`None of the ${this.currentNode.redirect} nodes had a "${childName}" subcommand.`);
            }
            throw new Error(`Command "${this.getCommand()}" has no subcommands.`);
        }
        /**
         * Gets the Command Resolver for the current node, but with the arguments specified.
         */
        getArgumentsResolver(...args) {
            var _a, _b;
            if (args.length === 1 && isNodeWithArguments(this.currentNode) && this.currentNode.parsers[0] === 'sandstone:callback') {
                // We're entering a callback
                if (typeof args[0] !== 'function') {
                    throw new Error(`The \`run\` subcommand expects a function as only argument, got: ${args[0]}`);
                }
                // First, we enter a child function, in which the callback will be executed. We keep the name of the newly created function.
                const name = ((_a = args[0]) === null || _a === void 0 ? void 0 : _a.name) || `${this.args[0]}_${((_b = this.args) === null || _b === void 0 ? void 0 : _b[1]) || ''}`;
                const functionName = this.datapack.enterChildFunction(name);
                // Call the callback
                args[0]();
                // Then we exit it
                this.datapack.exitChildFunction();
                // Finally, we register the command by adding the function call. We specify it's executable.
                const newResolver = new CommandsResolver(this.datapack, this.commandsTree, this.currentNode, this.args.concat(['function', functionName]), true);
                return newResolver;
            }
            let executable;
            if (isNodeWithExecutables(this.currentNode)) {
                if (this.currentNode.executables.length) {
                    executable = this.currentNode.executables[args.length - 1];
                }
                else {
                    // If a node has no arguments, it's executable
                    executable = true;
                }
            }
            else {
                throw new Error('Node has no executables but was still called. This is not supposed to happen.');
            }
            return this.createChildResolver(this.currentNode, this.args.concat(args), executable);
        }
        /**
         * Creates and returns a child resolver.
         * Unregisters the current command.
         */
        createChildResolver(currentNode, args, executable) {
            const newResolver = new CommandsResolver(this.datapack, this.commandsTree, currentNode, args, executable);
            if (this.executable) {
                this.unregister();
            }
            return newResolver;
        }
        /**
         * Registers the current command (add it to the datapack).
         */
        register() {
            if (!this.executable) {
                throw new Error(`Invalid command: ${this.getCommand()}`);
            }
            this.datapack.registerNewCommand(this.args);
        }
        /**
         * Unregisters the current command (remove it from the datapack).
         */
        unregister() {
            this.datapack.unregisterLastCommand();
        }
        /**
         * Get the command as a string.
         */
        getCommand() {
            return this.args.join(' ');
        }
    }
    CommandsResolver.lastId = 0;
    return CommandsResolver;
})();
exports.CommandsResolver = CommandsResolver;
function createCommandsResolver(datapack, commandsTree) {
    const rootCommandsResolver = new CommandsResolver(datapack, commandsTree, commandsTree, [], false);
    function createProxy(resolver) {
        return new Proxy(resolver, {
            get(target, prop) {
                if (typeof prop !== 'string') {
                    throw new Error(`Incorrect property type: ${typeof prop} for prop ${prop.toString()}`);
                }
                const newResolver = resolver.getChildNodeResolver(prop);
                if (newResolver.currentNode.type === 'literal' || newResolver.currentNode.type === 'root') {
                    return createProxy(newResolver);
                }
                return (...args) => createProxy(newResolver.getArgumentsResolver(...args));
            },
        });
    }
    return createProxy(rootCommandsResolver);
}
exports.createCommandsResolver = createCommandsResolver;
//# sourceMappingURL=resolver.js.map