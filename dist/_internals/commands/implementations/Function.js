"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionCommand = void 0;
const Command_1 = require("../Command");
const decorators_1 = require("../decorators");
class FunctionCommand extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.function = (func) => {
            if (typeof func === 'string') {
                this.commandsRoot.arguments.push(func);
                this.commandsRoot.register();
            }
            else {
                func();
            }
        };
    }
}
__decorate([
    decorators_1.command('function', {
        isRoot: true, executable: true, registerArguments: false, hasSubcommands: true,
    }),
    __metadata("design:type", Function)
], FunctionCommand.prototype, "function", void 0);
exports.FunctionCommand = FunctionCommand;
//# sourceMappingURL=Function.js.map