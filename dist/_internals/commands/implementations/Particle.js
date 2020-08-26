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
exports.Particle = void 0;
const _arguments_1 = require("@arguments");
const Command_1 = require("@commands/Command");
const decorators_1 = require("@commands/decorators");
class Particle extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.particle = (...args) => { };
    }
}
__decorate([
    decorators_1.command('particle', {
        isRoot: true, parsers: {
            '1': _arguments_1.arrayToArgsParser,
            '2': _arguments_1.arrayToArgsParser,
            '3': _arguments_1.arrayToArgsParser,
        }
    }),
    __metadata("design:type", Object)
], Particle.prototype, "particle", void 0);
exports.Particle = Particle;
//# sourceMappingURL=Particle.js.map