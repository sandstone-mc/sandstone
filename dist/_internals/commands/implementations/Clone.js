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
exports.Clone = exports.CloneOptions = void 0;
const _arguments_1 = require("@arguments");
const Command_1 = require("../Command");
const decorators_1 = require("../decorators");
class CloneOptions extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.replace = (mode) => { };
        this.masked = (mode) => { };
        this.filtered = (filter, mode) => { };
    }
}
__decorate([
    decorators_1.command('replace'),
    __metadata("design:type", Object)
], CloneOptions.prototype, "replace", void 0);
__decorate([
    decorators_1.command('masked'),
    __metadata("design:type", Object)
], CloneOptions.prototype, "masked", void 0);
__decorate([
    decorators_1.command('filtered'),
    __metadata("design:type", Object)
], CloneOptions.prototype, "filtered", void 0);
exports.CloneOptions = CloneOptions;
class Clone extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.clone = (begin, end, destination) => new CloneOptions(this.commandsRoot);
    }
}
__decorate([
    decorators_1.command('clone', {
        isRoot: true,
        hasSubcommands: true,
        parsers: {
            '0': _arguments_1.coordinatesParser,
            '1': _arguments_1.coordinatesParser,
            '2': _arguments_1.coordinatesParser,
        },
    }),
    __metadata("design:type", Object)
], Clone.prototype, "clone", void 0);
exports.Clone = Clone;
//# sourceMappingURL=Clone.js.map