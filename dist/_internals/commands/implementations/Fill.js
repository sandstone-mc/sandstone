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
exports.Fill = exports.FillArguments = void 0;
const _arguments_1 = require("@arguments");
const Command_1 = require("@commands/Command");
const decorators_1 = require("@commands/decorators");
class FillArguments extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.destroy = () => { };
        this.hollow = () => { };
        this.keep = () => { };
        this.outline = () => { };
        this.replace = (filter) => { };
    }
}
__decorate([
    decorators_1.command('destroy'),
    __metadata("design:type", Object)
], FillArguments.prototype, "destroy", void 0);
__decorate([
    decorators_1.command('hollow'),
    __metadata("design:type", Object)
], FillArguments.prototype, "hollow", void 0);
__decorate([
    decorators_1.command('keep'),
    __metadata("design:type", Object)
], FillArguments.prototype, "keep", void 0);
__decorate([
    decorators_1.command('outline'),
    __metadata("design:type", Object)
], FillArguments.prototype, "outline", void 0);
__decorate([
    decorators_1.command('replace'),
    __metadata("design:type", Object)
], FillArguments.prototype, "replace", void 0);
exports.FillArguments = FillArguments;
class Fill extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.fill = (from, to, block) => FillArguments;
    }
}
__decorate([
    decorators_1.command('fill', { isRoot: true, executable: true, hasSubcommands: true, parsers: { '0': _arguments_1.coordinatesParser, '1': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], Fill.prototype, "fill", void 0);
exports.Fill = Fill;
//# sourceMappingURL=Fill.js.map