"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Datapack {
    constructor(namespace) {
        /**
         * Register a new command in the current function.
         * @param commandArgs The arguments of the command to add.
         */
        this.registerNewCommand = (commandArgs) => {
            if (!this.currentFunction) {
                throw Error('Adding a command outside of a registered function');
            }
            this.getCurrentFunctionCommands().push(commandArgs);
        };
        /**
         * Remove the last command added to the current function.
         */
        this.unregisterLastCommand = () => {
            this.getCurrentFunctionCommands().pop();
        };
        this.mcfunction = (...args) => {
            let name;
            let callback;
            let options = { lazy: false };
            if (args.length >= 1 && typeof args[0] === 'function') {
                // The user specified an anonymous function
                callback = args[0];
                name = callback.name || '__anonymous__';
                // Apply the user-defined options to the default ones
                Object.assign(options, args === null || args === void 0 ? void 0 : args[1]);
            }
            else if (args.length >= 2 && typeof args[0] === 'string') {
                // The user specified an named function
                name = args[0];
                callback = args[1];
                // Apply the user-defined options to the default ones
                Object.assign(options, args === null || args === void 0 ? void 0 : args[2]);
            }
            else {
                throw new Error(`Got invalid arguments for mcfunction method: ${args}`);
            }
            const callCallback = (...args) => {
                // Keep the previous function
                const previousFunction = this.currentFunction;
                // Create a new root function
                const currentName = this.enterRootFunction(name);
                const functionName = utils_1.toMcFunctionName(currentName);
                // Add the commands
                callback(...args);
                // Go back to the previous function
                this.currentFunction = previousFunction;
                return functionName;
            };
            let functionName;
            let initialized = false;
            if (!options.lazy) {
                // If the mcfunction is not lazy, then we directly create it
                functionName = callCallback();
                initialized = true;
            }
            else if (callback.length > 0) {
                // If the callback requires arguments, but the function is not lazy, we can't create the function
                throw new Error(`Got a parametrized function "${name}" expecting at least ${callback.length} arguments, without being is not lazy.\n`
                    + `This is not possible. Consider putting default values to the parameters, or setting the function as lazy.`);
            }
            // When calling the result of mcfunction, it will be considered as the command /function functionName!
            return (...args) => {
                if (!initialized) {
                    // If the mcfunction is lazy, we wait until it's actually called to initialize it
                    functionName = callCallback();
                    initialized = true;
                }
                this.registerNewCommand(['function', functionName]);
            };
        };
        /**
         * Saves the datapack to the file system.
         *
         * @param name The name of the Datapack
         * @param options The save options
         */
        this.save = (name, options = {}) => utils_1.saveDatapack(this.functions, name, options);
        this.defaultNamespace = namespace;
        this.currentFunction = null;
        this.functions = new Map();
    }
    /**
     * Get the commands of the current function.
     */
    getCurrentFunctionCommands() {
        if (!this.currentFunction) {
            throw new Error('Current function is undefined');
        }
        const commandsIds = this.functions.get(this.currentFunction);
        if (!commandsIds) {
            throw new Error('Current function does not exist in the commands map - this is an internal error.');
        }
        return commandsIds;
    }
    /**
     * Enters a root Minecraft function.
     *
     * @param functionName The name of the function to enter
     */
    enterRootFunction(functionName) {
        let namespace = this.defaultNamespace;
        let name = functionName;
        if (functionName.includes(':')) {
            ([namespace, name] = functionName.split(':'));
        }
        [namespace, name] = this.getUniqueName([namespace, name]);
        this.currentFunction = [namespace, name];
        this.functions.set(this.currentFunction, []);
        return this.currentFunction;
    }
    /**
     * Check if the datapack contains a function with the given nam
     * @param functionName The name of the function
     */
    hasFunction(functionName) {
        /* Sadly, we can't directly check if an array is present as a key in the map
         * (because JS checks references, not if arrays have same elements)
         * Therefore, we compare the JSON representation */
        const jsonFunctionName = JSON.stringify(functionName);
        const jsonFunctions = Array.from(this.functions.keys()).map((key) => JSON.stringify(key));
        return jsonFunctions.includes(jsonFunctionName);
    }
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
    getUniqueName(functionName) {
        // Get the namespace and the folders of the function
        const namespaceFolders = functionName.slice(0, -1);
        // By default, the "new name" is the original name.
        let newName = functionName[functionName.length - 1];
        const newNameTemplate = `${newName}_{}`;
        let i = 2;
        // If the current "new name" already exists in the Datapack, increment `i` and apply the template
        while (this.hasFunction([...namespaceFolders, newName])) {
            newName = newNameTemplate.replace('{}', i.toString());
            i += 1;
        }
        return [...namespaceFolders, newName];
    }
    /**
     * Get a unique name for a child function of the current function, from an original name.
     * @param childName The original name for the child function.
     */
    getUniqueChildName(childName) {
        if (!this.currentFunction) {
            throw new Error('Trying to get a unique child name outside a root function.');
        }
        const result = this.getUniqueName(this.currentFunction.concat([childName]));
        return result[result.length - 1];
    }
    /**
     * Enter a child function of the current function.
     * @param functionName The name of the child function.
     */
    enterChildFunction(functionName) {
        if (!this.currentFunction) {
            throw Error('Entering child function without registering a root function');
        }
        const newName = this.getUniqueChildName(functionName);
        // Update the current function - it now is the child function.
        this.currentFunction.push(newName);
        // Set its commands as empty
        this.functions.set(this.currentFunction, []);
        // Return its full minecraft name
        return utils_1.toMcFunctionName(this.currentFunction);
    }
    /**
     * Recursively exit the current function of the datapack.
     *
     * If we're in a child function of a root function (or a n-th child), it will exit them too.
     */
    exitRootFunction() {
        if (!this.currentFunction) {
            throw Error('Exiting a not-existing function');
        }
        this.currentFunction = null;
    }
    /**
     * Exit the current child function, and enter the parent function.
     */
    exitChildFunction() {
        if (!this.currentFunction) {
            throw Error('Exiting a not-existing function');
        }
        this.currentFunction.pop();
    }
}
exports.default = Datapack;
//# sourceMappingURL=Datapack.js.map