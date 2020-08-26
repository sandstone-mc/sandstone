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
exports.Data = void 0;
const _arguments_1 = require("@arguments");
const Command_1 = require("../Command");
const decorators_1 = require("../decorators");
const getCmd = (name) => ['data', 'get', name];
const mergeCmd = (name) => ['data', 'merge', name];
const modifyCmd = (name) => ['data', 'modify', name];
const removeCmd = (name) => ['data', 'remove', name];
class DataGet extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.block = (targetPos, path, scale) => { };
        this.entity = (target, path, scale) => { };
        this.storage = (target, path, scale) => { };
    }
}
__decorate([
    decorators_1.command(getCmd('block'), { isRoot: true, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], DataGet.prototype, "block", void 0);
__decorate([
    decorators_1.command(getCmd('entity'), { isRoot: true }),
    __metadata("design:type", Object)
], DataGet.prototype, "entity", void 0);
__decorate([
    decorators_1.command(getCmd('storage'), { isRoot: true }),
    __metadata("design:type", Object)
], DataGet.prototype, "storage", void 0);
class DataMerge extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.block = (targetPos, nbt) => { };
        this.entity = (target, nbt) => { };
        this.storage = (target, nbt) => { };
    }
}
__decorate([
    decorators_1.command(mergeCmd('block'), { isRoot: true, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], DataMerge.prototype, "block", void 0);
__decorate([
    decorators_1.command(mergeCmd('entity'), { isRoot: true }),
    __metadata("design:type", Object)
], DataMerge.prototype, "entity", void 0);
__decorate([
    decorators_1.command(mergeCmd('storage'), { isRoot: true }),
    __metadata("design:type", Object)
], DataMerge.prototype, "storage", void 0);
class DataModifyValues extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.fromBlock = (sourcePosition, sourcePath) => { };
        this.fromEntity = (source, sourcePath) => { };
        this.fromStorage = (source, sourcePath) => { };
        this.value = (value) => { };
    }
}
__decorate([
    decorators_1.command(['from', 'block'], { parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], DataModifyValues.prototype, "fromBlock", void 0);
__decorate([
    decorators_1.command(['from', 'entity']),
    __metadata("design:type", Object)
], DataModifyValues.prototype, "fromEntity", void 0);
__decorate([
    decorators_1.command(['from', 'storage']),
    __metadata("design:type", Object)
], DataModifyValues.prototype, "fromStorage", void 0);
__decorate([
    decorators_1.command('value'),
    __metadata("design:type", Object)
], DataModifyValues.prototype, "value", void 0);
class DataModifyType extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.insert = () => new DataModifyValues(this.commandsRoot);
    }
    get append() {
        this.commandsRoot.arguments.push('append');
        this.commandsRoot.executable = false;
        return new DataModifyValues(this.commandsRoot);
    }
    get merge() {
        this.commandsRoot.arguments.push('merge');
        this.commandsRoot.executable = false;
        return new DataModifyValues(this.commandsRoot);
    }
    get preprend() {
        this.commandsRoot.arguments.push('prepend');
        this.commandsRoot.executable = false;
        return new DataModifyValues(this.commandsRoot);
    }
    get set() {
        this.commandsRoot.arguments.push('set');
        this.commandsRoot.executable = false;
        return new DataModifyValues(this.commandsRoot);
    }
}
__decorate([
    decorators_1.command('insert', { isRoot: false, hasSubcommands: true, executable: false }),
    __metadata("design:type", Object)
], DataModifyType.prototype, "insert", void 0);
class DataModify extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.block = (targetPos, targetPath) => new DataModifyType(this.commandsRoot);
        this.entity = (target, targetPath) => new DataModifyType(this.commandsRoot);
        this.storage = (target, targetPath) => new DataModifyType(this.commandsRoot);
    }
}
__decorate([
    decorators_1.command(modifyCmd('block'), { isRoot: true, executable: false, hasSubcommands: true, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], DataModify.prototype, "block", void 0);
__decorate([
    decorators_1.command(modifyCmd('entity'), { isRoot: true, executable: false, hasSubcommands: true }),
    __metadata("design:type", Object)
], DataModify.prototype, "entity", void 0);
__decorate([
    decorators_1.command(modifyCmd('storage'), { isRoot: true, executable: false, hasSubcommands: true }),
    __metadata("design:type", Object)
], DataModify.prototype, "storage", void 0);
class DataRemove extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.block = (targetPos, targetPath) => { };
        this.entity = (target, targetPath) => { };
        this.storage = (target, targetPath) => { };
    }
}
__decorate([
    decorators_1.command(removeCmd('block'), { isRoot: true, executable: false, hasSubcommands: true, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], DataRemove.prototype, "block", void 0);
__decorate([
    decorators_1.command(removeCmd('entity'), { isRoot: true, executable: false, hasSubcommands: true }),
    __metadata("design:type", Object)
], DataRemove.prototype, "entity", void 0);
__decorate([
    decorators_1.command(removeCmd('storage'), { isRoot: true, executable: false, hasSubcommands: true }),
    __metadata("design:type", Object)
], DataRemove.prototype, "storage", void 0);
class Data extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.get = new DataGet(this.commandsRoot);
        this.merge = new DataMerge(this.commandsRoot);
        this.modify = new DataModify(this.commandsRoot);
        this.remove = new DataRemove(this.commandsRoot);
    }
}
exports.Data = Data;
//# sourceMappingURL=Data.js.map