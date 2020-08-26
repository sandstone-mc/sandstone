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
exports.Forceload = void 0;
const _arguments_1 = require("@arguments");
const Command_1 = require("@commands/Command");
const decorators_1 = require("@commands/decorators");
class Forceload extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.add = (from, to) => { };
        this.remove = (from, to) => { };
        this.removeAll = () => { };
        this.query = (pos) => { };
    }
}
__decorate([
    decorators_1.command(['forceload', 'add'], { isRoot: true, parsers: { '0': _arguments_1.coordinatesParser, '1': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], Forceload.prototype, "add", void 0);
__decorate([
    decorators_1.command(['forceload', 'remove'], { isRoot: true, parsers: { '0': _arguments_1.coordinatesParser, '1': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], Forceload.prototype, "remove", void 0);
__decorate([
    decorators_1.command(['forceload', 'remove', 'all'], { isRoot: true }),
    __metadata("design:type", Object)
], Forceload.prototype, "removeAll", void 0);
__decorate([
    decorators_1.command(['forceload', 'query'], { isRoot: true, parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], Forceload.prototype, "query", void 0);
exports.Forceload = Forceload;
//# sourceMappingURL=Forceload.js.map