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
exports.DatapackCommand = void 0;
const Command_1 = require("@commands/Command");
const decorators_1 = require("@commands/decorators");
class DatapackEnable extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.first = () => { };
        this.last = () => { };
        this.before = (name) => { };
        this.after = (name) => { };
    }
}
__decorate([
    decorators_1.command('first'),
    __metadata("design:type", Object)
], DatapackEnable.prototype, "first", void 0);
__decorate([
    decorators_1.command('last'),
    __metadata("design:type", Object)
], DatapackEnable.prototype, "last", void 0);
__decorate([
    decorators_1.command('before'),
    __metadata("design:type", Object)
], DatapackEnable.prototype, "before", void 0);
__decorate([
    decorators_1.command('after'),
    __metadata("design:type", Object)
], DatapackEnable.prototype, "after", void 0);
class DatapackCommand extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.disable = (name) => { };
        this.enable = (name) => new DatapackEnable(this.commandsRoot);
        this.list = (type) => { };
    }
}
__decorate([
    decorators_1.command(['datapack', 'disable'], { isRoot: true }),
    __metadata("design:type", Object)
], DatapackCommand.prototype, "disable", void 0);
__decorate([
    decorators_1.command(['datapack', 'enable'], { isRoot: true, hasSubcommands: true }),
    __metadata("design:type", Object)
], DatapackCommand.prototype, "enable", void 0);
__decorate([
    decorators_1.command(['datapack', 'list'], { isRoot: true }),
    __metadata("design:type", Object)
], DatapackCommand.prototype, "list", void 0);
exports.DatapackCommand = DatapackCommand;
//# sourceMappingURL=Datapack.js.map