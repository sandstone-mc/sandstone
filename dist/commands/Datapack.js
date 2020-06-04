"use strict";
// OLD STUFF
Object.defineProperty(exports, "__esModule", { value: true });
function minecraftFunctionName(functionName) {
    const [namespace, ...folders] = functionName;
    return `${namespace}:${folders.join('/')}`;
}
class Datapack {
    constructor(namespace) {
        this.registerNewCommand = (commandArgs) => {
            if (!this.currentFunction) {
                throw Error('Adding a command outside of a registered function');
            }
            this.getCurrentFunction().push(commandArgs);
        };
        this.unregisterLastCommand = () => {
            this.getCurrentFunction().pop();
        };
        this.mcfunction = (name, callback) => {
            this.enterRootFunction(name);
            callback();
            this.exitRootFunction();
        };
        this.save = () => {
            for (const [functionName, commandsArgs] of this.functions) {
                console.log('====', functionName, '====\n');
                console.log(commandsArgs.map((commandArgs) => commandArgs?.join(' ')).join('\n'));
                console.log('\n================\n');
            }
        };
        this.namespace = namespace;
        this.currentFunction = null;
        this.functions = new Map();
    }
    getCurrentFunctionMcName() {
        if (!this.currentFunction) {
            throw Error('Trying to get the name of a function without registering a root function');
        }
        return minecraftFunctionName(this.currentFunction);
    }
    getCurrentFunction() {
        const commandsIds = this.functions.get(this.getCurrentFunctionMcName());
        if (!commandsIds) {
            throw new Error('Current function is undefined');
        }
        return commandsIds;
    }
    enterRootFunction(functionName) {
        this.currentFunction = [this.namespace, functionName];
        this.functions.set(this.getCurrentFunctionMcName(), []);
    }
    hasChildFunction(childName) {
        if (!this.currentFunction) {
            return false;
        }
        const possibleChildFullName = this.currentFunction.concat([childName]);
        const mcName = minecraftFunctionName(possibleChildFullName);
        return mcName in this.functions;
    }
    enterChildFunction(functionName) {
        if (!this.currentFunction) {
            throw Error('Entering child function without registering a root function');
        }
        let i = 0;
        let newName;
        const newNameTemplate = `${functionName}_{}`;
        do {
            newName = newNameTemplate.replace('{}', i.toString());
            i += 1;
        } while (this.hasChildFunction(newName));
        this.currentFunction.push(newName);
        const fullName = this.getCurrentFunctionMcName();
        this.functions.set(fullName, []);
        return fullName;
    }
    exitRootFunction() {
        if (!this.currentFunction) {
            throw Error('Exiting a not-existing function');
        }
        this.currentFunction = null;
    }
    exitChildFunction() {
        if (!this.currentFunction) {
            throw Error('Exiting a not-existing function');
        }
        this.currentFunction.pop();
    }
}
exports.default = Datapack;
//# sourceMappingURL=Datapack.js.map