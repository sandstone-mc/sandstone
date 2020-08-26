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
exports.Teleport = exports.TeleportFacing = void 0;
const _arguments_1 = require("@arguments");
const Coordinates_1 = require("@variables/Coordinates");
const Command_1 = require("../Command");
const decorators_1 = require("../decorators");
class TeleportFacing extends Command_1.Command {
    constructor() {
        super(...arguments);
        /**
         * Specifies the coordinates to make the target(s) facing to.
         * May use tilde and caret notation to specify a position relative to the position where the command is executed.
         */
        this.facing = (location) => { };
        /**
         * Specifies the entity to make the target(s) facing to.
         *
         * @param entity Must be a player name, a target selector, or a UUID‌.
         *             Permits entity other than players.
         *
         * @param anchor Specifies whether the entity'eyes or feet to make the target(s) facing to.
         *             Must be one of eyes and feet. If not specified, defaults to eyes.
         */
        this.facingEntity = (entity, anchor) => { };
    }
}
__decorate([
    decorators_1.command('facing', { parsers: { '0': _arguments_1.coordinatesParser } }),
    __metadata("design:type", Object)
], TeleportFacing.prototype, "facing", void 0);
__decorate([
    decorators_1.command(['facing', 'entity']),
    __metadata("design:type", Object)
], TeleportFacing.prototype, "facingEntity", void 0);
exports.TeleportFacing = TeleportFacing;
class Teleport extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.teleport = (...args) => {
            if (args.length === 2 && (args[1] instanceof Coordinates_1.VectorClass || typeof args[1] === 'string')) {
                return new TeleportFacing(this.commandsRoot);
            }
            this.commandsRoot.register();
        };
    }
}
__decorate([
    decorators_1.command('teleport', {
        hasSubcommands: true,
        isRoot: true,
        parsers: {
            '0': _arguments_1.coordinatesParser,
            '1': _arguments_1.coordinatesParser,
            '2': _arguments_1.rotationParser,
        },
    }),
    __metadata("design:type", Function)
], Teleport.prototype, "teleport", void 0);
exports.Teleport = Teleport;
//# sourceMappingURL=Teleport.js.map