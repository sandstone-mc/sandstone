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
exports.Loot = void 0;
const _arguments_1 = require("@arguments");
const Command_1 = require("@commands/Command");
const decorators_1 = require("@commands/decorators");
class LootSource extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.fish = (lootTable, pos, tool) => { };
        this.loot = (lootTable) => { };
        this.kill = (target) => { };
        this.mine = (pos, tool) => { };
    }
}
__decorate([
    decorators_1.command('fish', { parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], LootSource.prototype, "fish", void 0);
__decorate([
    decorators_1.command('loot'),
    __metadata("design:type", Object)
], LootSource.prototype, "loot", void 0);
__decorate([
    decorators_1.command('kill'),
    __metadata("design:type", Object)
], LootSource.prototype, "kill", void 0);
__decorate([
    decorators_1.command('mine', { parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], LootSource.prototype, "mine", void 0);
class Loot extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.spawn = (targetPos) => new LootSource(this.commandsRoot);
        this.replaceEntity = (entities, slot, count) => new LootSource(this.commandsRoot);
        this.replaceBlock = (targetPos, slot, count) => new LootSource(this.commandsRoot);
        this.give = (players) => new LootSource(this.commandsRoot);
        this.insert = (targetPos) => new LootSource(this.commandsRoot);
    }
}
__decorate([
    decorators_1.command(['loot', 'spawn'], { isRoot: true, hasSubcommands: true, executable: false, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], Loot.prototype, "spawn", void 0);
__decorate([
    decorators_1.command(['loot', 'replace', 'entity'], { isRoot: true, hasSubcommands: true, executable: false }),
    __metadata("design:type", Object)
], Loot.prototype, "replaceEntity", void 0);
__decorate([
    decorators_1.command(['loot', 'replace', 'block'], { isRoot: true, hasSubcommands: true, executable: false, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], Loot.prototype, "replaceBlock", void 0);
__decorate([
    decorators_1.command(['loot', 'give'], { isRoot: true, hasSubcommands: true, executable: false }),
    __metadata("design:type", Object)
], Loot.prototype, "give", void 0);
__decorate([
    decorators_1.command(['loot', 'insert'], { isRoot: true, hasSubcommands: true, executable: false, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], Loot.prototype, "insert", void 0);
exports.Loot = Loot;
//# sourceMappingURL=Loot.js.map