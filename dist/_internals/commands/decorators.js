"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
function getDefaultArguments(func) {
    const args = func.toString().replace(/[^(]*\(([^)]*)\).*/, '$1');
    const argsArray = args.split(',').map((str) => str.trim().split('='));
    const parsedArgsArray = argsArray.map(([_, defaultVal]) => (defaultVal === undefined ? null : eval(defaultVal)));
    return parsedArgsArray;
}
function mergeArrays(arr1, arr2) {
    const result = [];
    for (let i = 0; i < Math.max(arr1.length, arr2.length); i += 1) {
        const elem1 = arr1[i];
        const elem2 = arr2[i];
        result.push(elem1 !== null && elem1 !== void 0 ? elem1 : elem2);
    }
    return result;
}
function createPropertyDecorator(thisField, decorator) {
    return (target, propertyKey) => {
        let innerFunction;
        return {
            configurable: false,
            enumerable: false,
            // Called when getting the value of the property
            get() {
                /** This is the decorator function. */
                let commandsRoot;
                if (thisField !== null) {
                    commandsRoot = this[thisField];
                }
                else {
                    commandsRoot = this;
                }
                return (...innerArgs) => decorator(commandsRoot, innerFunction, ...innerArgs);
            },
            // Called when setting the value of the property
            set(newValue) {
                innerFunction = newValue;
            },
        };
    };
}
/**
 * Declares a new command or a subcommand.
 *
 * @param name The name of the command/subcommand to register.
 * Can provide an array of string for commands/subcommands with multiple words.
 *
 * @param config The configuration object
 */
function command(name, config = {}) {
    var _a, _b;
    // Apply default arguments
    config = {
        registerArguments: true,
        hasSubcommands: false,
        executable: true,
        thisField: 'commandsRoot',
        isRoot: false,
        isExecuteSubcommand: false,
        ...config,
    };
    const parsers = (_a = config.parsers) !== null && _a !== void 0 ? _a : {};
    const names = Array.isArray(name) ? name : [name];
    return createPropertyDecorator((_b = config.thisField) !== null && _b !== void 0 ? _b : null, (commandsRoot, innerFunction, ...innerArgs) => {
        // If the previous command was executable, register it.
        // It means it wasn't registered because it could have been extended with other arguments.
        if (config.isRoot) {
            if (commandsRoot.inExecute) {
                commandsRoot.arguments.push('run');
                commandsRoot.inExecute = false;
            }
            else {
                commandsRoot.register(true);
            }
        }
        else if (commandsRoot.arguments.length === 0) {
            if (config.isExecuteSubcommand) {
                commandsRoot.arguments.push('execute');
            }
            else {
                // Function is not root but has no previous command
                throw new Error('Trying to call some command arguments with no registered root. Did you forgot {hasSubcommands:true}?'
                    + `Args are: ${innerArgs}, function is ${innerFunction}`);
            }
        }
        if (config.registerArguments) {
            // Merge the default arguments with the given innerArgs
            const defaultArgs = getDefaultArguments(innerFunction);
            const finalRawArgs = mergeArrays(innerArgs, defaultArgs);
            const parsedArgs = finalRawArgs.map((arg, index) => {
                if (arg !== undefined && Object.prototype.hasOwnProperty.call(parsers, index)) {
                    return parsers[index](arg, finalRawArgs);
                }
                return arg;
            });
            commandsRoot.arguments.push(...names, ...parsedArgs);
        }
        commandsRoot.executable = config.executable;
        const result = innerFunction(...innerArgs);
        if (!config.hasSubcommands) {
            commandsRoot.register();
        }
        if (config.isExecuteSubcommand) {
            commandsRoot.inExecute = true;
        }
        return result;
    });
}
exports.command = command;
//# sourceMappingURL=decorators.js.map