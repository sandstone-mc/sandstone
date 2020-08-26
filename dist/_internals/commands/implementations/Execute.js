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
exports.Execute = exports.ExecuteIfData = exports.ExecuteStore = exports.ExecuteStoreArgs = void 0;
/* eslint-disable no-use-before-define */
const _arguments_1 = require("@arguments");
const Command_1 = require("../Command");
const decorators_1 = require("../decorators");
const executeConfig = {
    isRoot: false,
    hasSubcommands: true,
    executable: true,
    isExecuteSubcommand: true,
};
class ExecuteStoreArgs extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.block = (targetPos, path, type, scale) => new Execute(this.commandsRoot);
        this.bossbar = (id, type) => new Execute(this.commandsRoot);
        this.entity = (target, path, type, scale) => new Execute(this.commandsRoot);
        this.score = (...args) => new Execute(this.commandsRoot);
        this.storage = (target, path, type, scale) => new Execute(this.commandsRoot);
    }
}
__decorate([
    decorators_1.command('block', { ...executeConfig, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], ExecuteStoreArgs.prototype, "block", void 0);
__decorate([
    decorators_1.command('bossbar', executeConfig),
    __metadata("design:type", Object)
], ExecuteStoreArgs.prototype, "bossbar", void 0);
__decorate([
    decorators_1.command('entity', executeConfig),
    __metadata("design:type", Object)
], ExecuteStoreArgs.prototype, "entity", void 0);
__decorate([
    decorators_1.command('score', executeConfig),
    __metadata("design:type", Function)
], ExecuteStoreArgs.prototype, "score", void 0);
__decorate([
    decorators_1.command('storage', executeConfig),
    __metadata("design:type", Object)
], ExecuteStoreArgs.prototype, "storage", void 0);
exports.ExecuteStoreArgs = ExecuteStoreArgs;
class ExecuteStore extends Command_1.Command {
    get result() {
        if (!this.commandsRoot.arguments.length) {
            this.commandsRoot.arguments.push('execute');
        }
        this.commandsRoot.arguments.push('store', 'result');
        this.commandsRoot.executable = true;
        this.commandsRoot.inExecute = true;
        return new ExecuteStoreArgs(this.commandsRoot);
    }
    get success() {
        if (!this.commandsRoot.arguments.length) {
            this.commandsRoot.arguments.push('execute');
        }
        this.commandsRoot.arguments.push('store', 'success');
        this.commandsRoot.executable = true;
        this.commandsRoot.inExecute = true;
        return new ExecuteStoreArgs(this.commandsRoot);
    }
}
exports.ExecuteStore = ExecuteStore;
class ExecuteIfData extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.block = (pos, path) => new Execute(this.commandsRoot);
        this.entity = (target, path) => new Execute(this.commandsRoot);
        this.storage = (source, path) => new Execute(this.commandsRoot);
    }
}
__decorate([
    decorators_1.command('block', { ...executeConfig, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], ExecuteIfData.prototype, "block", void 0);
__decorate([
    decorators_1.command('entity', executeConfig),
    __metadata("design:type", Object)
], ExecuteIfData.prototype, "entity", void 0);
__decorate([
    decorators_1.command('storage', executeConfig),
    __metadata("design:type", Object)
], ExecuteIfData.prototype, "storage", void 0);
exports.ExecuteIfData = ExecuteIfData;
class Execute extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.align = (axes) => this;
        this.anchored = (anchor) => this;
        this.as = (targets) => this;
        this.at = (targets) => this;
        this.facing = (pos) => this;
        this.facingEntity = (targets, anchor) => this;
        this.in = (dimension) => this;
        this.positioned = (pos) => this;
        this.positionedAs = (targets) => this;
        this.rotated = (rotation) => this;
        this.rotatedAs = (targets) => this;
        this.ifBlock = (pos, block) => this;
        this.unlessBlock = (...args) => this;
        this.ifBlocks = (start, end, destination, scanMode) => this;
        this.unlessBlocks = (...args) => this;
        this.ifEntity = (targets) => this;
        this.unlessEntity = (...args) => this;
        this.ifScore = (...args) => this;
        this.unlessScore = (...args) => this;
        this.ifPredicate = (predicate) => this;
        this.unlessPredicate = (...args) => this;
        this.if_ = (...args) => this;
        this.unless_ = (...args) => this;
        this.if = (condition) => this.if_(...condition.value);
        this.unless = (condition) => this.unless_(...condition.value);
        this.store = new ExecuteStore(this.commandsRoot);
        this.run = (callback) => {
            const name = this.commandsRoot.arguments[1];
            const currentFunctionName = this.commandsRoot.Datapack.createEnterChildFunction(`execute_${name}`);
            const currentArgs = this.commandsRoot.arguments;
            currentArgs.push('run', 'function', currentFunctionName);
            this.commandsRoot.reset();
            callback();
            this.commandsRoot.Datapack.exitChildFunction();
            this.commandsRoot.arguments = currentArgs;
            this.commandsRoot.executable = true;
            this.commandsRoot.register();
        };
    }
    get ifData() {
        if (!this.commandsRoot.arguments.length) {
            this.commandsRoot.arguments.push('execute');
        }
        this.commandsRoot.arguments.push('if', 'data');
        this.commandsRoot.executable = true;
        this.commandsRoot.inExecute = true;
        return new ExecuteIfData(this.commandsRoot);
    }
    get unlessData() {
        if (!this.commandsRoot.arguments.length) {
            this.commandsRoot.arguments.push('execute');
        }
        this.commandsRoot.arguments.push('unless', 'data');
        this.commandsRoot.executable = true;
        this.commandsRoot.inExecute = true;
        return new ExecuteIfData(this.commandsRoot);
    }
    // The Pick<> ensures only commands are returned from CommandsRoot
    get runOne() {
        return this.commandsRoot;
    }
}
__decorate([
    decorators_1.command('align', executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "align", void 0);
__decorate([
    decorators_1.command('anchored', executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "anchored", void 0);
__decorate([
    decorators_1.command('as', executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "as", void 0);
__decorate([
    decorators_1.command('at', executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "at", void 0);
__decorate([
    decorators_1.command('facing', { ...executeConfig, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], Execute.prototype, "facing", void 0);
__decorate([
    decorators_1.command(['facing', 'entity'], executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "facingEntity", void 0);
__decorate([
    decorators_1.command('in', executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "in", void 0);
__decorate([
    decorators_1.command('positioned', { ...executeConfig, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], Execute.prototype, "positioned", void 0);
__decorate([
    decorators_1.command(['positioned', 'as'], executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "positionedAs", void 0);
__decorate([
    decorators_1.command('rotated', executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "rotated", void 0);
__decorate([
    decorators_1.command(['rotated', 'as'], executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "rotatedAs", void 0);
__decorate([
    decorators_1.command(['if', 'block'], { ...executeConfig, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], Execute.prototype, "ifBlock", void 0);
__decorate([
    decorators_1.command(['unless', 'block'], executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "unlessBlock", void 0);
__decorate([
    decorators_1.command(['if', 'blocks'], { ...executeConfig, parsers: { '0': _arguments_1.coordinatesParser, '1': _arguments_1.coordinatesParser, '2': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], Execute.prototype, "ifBlocks", void 0);
__decorate([
    decorators_1.command(['unless', 'blocks'], executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "unlessBlocks", void 0);
__decorate([
    decorators_1.command(['if', 'entity'], executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "ifEntity", void 0);
__decorate([
    decorators_1.command(['unless', 'entity'], executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "unlessEntity", void 0);
__decorate([
    decorators_1.command(['if', 'score'], executeConfig),
    __metadata("design:type", Function)
], Execute.prototype, "ifScore", void 0);
__decorate([
    decorators_1.command(['unless', 'score'], executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "unlessScore", void 0);
__decorate([
    decorators_1.command(['if', 'predicate'], executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "ifPredicate", void 0);
__decorate([
    decorators_1.command(['unless', 'predicate'], executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "unlessPredicate", void 0);
__decorate([
    decorators_1.command('if', executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "if_", void 0);
__decorate([
    decorators_1.command('unless', executeConfig),
    __metadata("design:type", Object)
], Execute.prototype, "unless_", void 0);
exports.Execute = Execute;
//# sourceMappingURL=Execute.js.map