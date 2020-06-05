"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nested = exports.register = void 0;
/**
 * A decorator used to register COMMANDS_TREE.
 * It:
 * - Adds the arguments to the instance `arguments` list
 * - Sets the `inExecute` to true if specified
 * - Prepends the `run` argument if currently in an execute
 *
 * After the function was called, if it is not a subcommand, it adds it to the datapack by calling the .register method.
 */
function register(optionsOrCommandArg1, ...commandArgs) {
    let options = null;
    if (typeof optionsOrCommandArg1 === 'object') {
        // User gave an options object
        options = optionsOrCommandArg1;
        if (options.execute) {
            options.subcommand = true;
        }
    }
    else {
        // User didn't give any options, just arguments
        commandArgs.push(optionsOrCommandArg1);
    }
    return (target, propertyName, propertyDescriptor) => {
        const method = propertyDescriptor.value;
        if (!method) {
            throw Error('No method given');
        }
        if (typeof method !== 'function') {
            throw new SyntaxError(`@register can only be used on functions, not: ${method}`);
        }
        return Object.create({
            ...propertyDescriptor,
            value(...args) {
                let sandObj = this;
                if (options === null || options === void 0 ? void 0 : options.thisField) {
                    sandObj = sandObj[options.thisField];
                }
                if (!('register' in sandObj)) {
                    throw Error('This decorator can only be used on Sandstone objects. If the root Sandstone object is a property'
                        + ' of your class, you can use the { thisField: "" } option.');
                }
                // If we're register an execute subcommand, set inExecute to true
                if (options === null || options === void 0 ? void 0 : options.execute) {
                    // If we're not already in an execute, prepend "execute"
                    if (!sandObj.inExecute) {
                        sandObj.arguments.push('execute');
                    }
                    sandObj.inExecute = true;
                }
                // If we're not registering an execute subcommand, and we were in an execute before, add the `run` argument
                if (!(options === null || options === void 0 ? void 0 : options.execute) && sandObj.inExecute) {
                    sandObj.arguments.push('run');
                }
                // Add the command arguments
                sandObj.arguments.push(...commandArgs);
                // Add all arguments to the object
                if (!(options === null || options === void 0 ? void 0 : options.dontRegisterArguments)) {
                    sandObj.arguments.push(...args);
                }
                /*
                 * Here, we MUST use 'this' because the method is owned by the decorated class - not by Sandstone !!
                 */
                const result = method.apply(this, args);
                if (!(options === null || options === void 0 ? void 0 : options.subcommand)) {
                    sandObj.register();
                }
                return result;
            },
        });
    };
}
exports.register = register;
/**
 * A decorator used to create a nested command, like /title.
 * All it does is registering the given arguments.
 */
function nested(...commandArguments) {
    return (target, propertyName, propertyDescriptor) => {
        const getter = propertyDescriptor.get;
        const method = propertyDescriptor.value;
        if (!getter && !method) {
            throw Error('No getter nor function given');
        }
        if (typeof getter !== 'function' && typeof method !== 'function') {
            throw new SyntaxError(`@nested can only be used on functions or getters, not: ${getter} / ${method}`);
        }
        const value = getter !== null && getter !== void 0 ? getter : method;
        function decorated(func, ...args) {
            const self = this;
            if (!('arguments' in self)) {
                throw Error('This decorator can only be used on subclasses of Sandstone');
            }
            // If currently in execute, leave the execute
            if (self === null || self === void 0 ? void 0 : self.inExecute) {
                self.arguments.push('run');
                self.inExecute = false;
            }
            // Push the arguments
            self.arguments.push(...commandArguments, ...args);
            return func.apply(self);
        }
        let object;
        if (getter) {
            object = {
                get(...args) {
                    return decorated.apply(this, [getter, ...args]);
                },
            };
        }
        else if (method) {
            object = {
                value(...args) {
                    return decorated.apply(this, [method, ...args]);
                },
            };
        }
        else {
            throw Error('?');
        }
        return Object.create({
            ...propertyDescriptor,
            ...object,
        });
    };
}
exports.nested = nested;
//# sourceMappingURL=utils.js.map