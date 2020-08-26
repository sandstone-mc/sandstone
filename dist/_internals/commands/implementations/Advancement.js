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
exports.Advancement = void 0;
const Command_1 = require("@commands/Command");
const decorators_1 = require("@commands/decorators");
class AdvancementArguments extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.everything = () => { };
        this.only = (advancement, criterion) => { };
        this.from = (advancement) => { };
        this.through = (advancement) => { };
        this.until = (advancement) => { };
    }
}
__decorate([
    decorators_1.command('everything', { isRoot: false, executable: true }),
    __metadata("design:type", Object)
], AdvancementArguments.prototype, "everything", void 0);
__decorate([
    decorators_1.command('only', { isRoot: false, executable: true }),
    __metadata("design:type", Object)
], AdvancementArguments.prototype, "only", void 0);
__decorate([
    decorators_1.command('from', { isRoot: false, executable: true }),
    __metadata("design:type", Object)
], AdvancementArguments.prototype, "from", void 0);
__decorate([
    decorators_1.command('through', { isRoot: false, executable: true }),
    __metadata("design:type", Object)
], AdvancementArguments.prototype, "through", void 0);
__decorate([
    decorators_1.command('until', { isRoot: false, executable: true }),
    __metadata("design:type", Object)
], AdvancementArguments.prototype, "until", void 0);
class Advancement extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.grant = (targets) => new AdvancementArguments(this.commandsRoot);
        this.revoke = (targets) => new AdvancementArguments(this.commandsRoot);
    }
}
__decorate([
    decorators_1.command(['avancement', 'grant'], { isRoot: true, hasSubcommands: true, executable: false }),
    __metadata("design:type", Object)
], Advancement.prototype, "grant", void 0);
__decorate([
    decorators_1.command(['avancement', 'revoke'], { isRoot: true, hasSubcommands: true, executable: false }),
    __metadata("design:type", Object)
], Advancement.prototype, "revoke", void 0);
exports.Advancement = Advancement;
//# sourceMappingURL=Advancement.js.map