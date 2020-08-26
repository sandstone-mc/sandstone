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
exports.Bossbar = void 0;
const _variables_1 = require("@variables");
const Command_1 = require("../Command");
const decorators_1 = require("../decorators");
class Bossbar extends Command_1.Command {
    constructor() {
        super(...arguments);
        /**
         * Create a new boss bar.
         *
         * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
         *
         * @param name The display name of the boss bar.
         */
        this.add = (id, name) => { };
        /**
         * Return the requested setting as a result of the command.
         *
         * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
         */
        this.get = (id, setting) => { };
        /**
         * Display a list of existing boss bars.
         */
        this.list = () => { };
        /**
         * Remove an existing bossbar.
         *
         * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
         */
        this.remove = (id) => { };
        /**
         * Set the text color (if no color was specified as part of a text component) and bar color.
         * Defaults to `white` upon creation.
         *
         * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
         *
         * @param color The new color.
         */
        this.setColor = (id, color) => { };
        /**
         * Set the boss bar's maximum value.
         * Defaults to `100` upon creation.
         *
         * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
         *
         * @param max The new maximum value.
         */
        this.setMax = (id, max) => { };
        /**
         * Set the boss bar's name.
         *
         * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
         *
         * @param name The new name.
         */
        this.setName = (id, name) => { };
        /**
         * Change the set of players to whom the bar is visible.
         * Defaults to none upon creation.
         *
         * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
         *
         * @param players The new players that will see the bossbar. If not specified, hide the bossbar to all players.
         */
        this.setPlayers = (id, players) => { };
        /**
         * Set the boss bar's visual amount of segments: continuous, 6 segments, 10 segments, 12 segments, or 20 segments.
         * Defaults to `progress` upon creation.
         *
         * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
         *
         * @param style The new style.
         */
        this.setStyle = (id, style) => { };
        /**
         * Set the boss bar's current value.
         * Defaults to `0` upon creation.
         *
         * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
         *
         * @param value The new value.
         */
        this.setValue = (id, value) => { };
        /**
         * Set the boss bar's visibility.
         * Defaults to `true` upon creation.
         *
         * @param id Specifies a unique boss bar. Has the form of Namespaced ID (Note: "namespace:" defaults to "minecraft:" if absent.)
         *
         * @param visible Whether the bossbar is visible or not.
         */
        this.setVisible = (id, visible) => { };
    }
}
__decorate([
    decorators_1.command(['bossbar', 'add'], { isRoot: true, parsers: { '1': (arg) => new _variables_1.JsonTextComponentClass(arg) } }),
    __metadata("design:type", Object)
], Bossbar.prototype, "add", void 0);
__decorate([
    decorators_1.command(['bossbar', 'get'], { isRoot: true }),
    __metadata("design:type", Object)
], Bossbar.prototype, "get", void 0);
__decorate([
    decorators_1.command(['bossbar', 'list'], { isRoot: true }),
    __metadata("design:type", Object)
], Bossbar.prototype, "list", void 0);
__decorate([
    decorators_1.command(['bossbar', 'remove'], { isRoot: true }),
    __metadata("design:type", Object)
], Bossbar.prototype, "remove", void 0);
__decorate([
    decorators_1.command(['bossbar', 'set', 'color'], { isRoot: true }),
    __metadata("design:type", Object)
], Bossbar.prototype, "setColor", void 0);
__decorate([
    decorators_1.command(['bossbar', 'set', 'max'], { isRoot: true }),
    __metadata("design:type", Object)
], Bossbar.prototype, "setMax", void 0);
__decorate([
    decorators_1.command(['bossbar', 'set', 'name'], { isRoot: true }),
    __metadata("design:type", Object)
], Bossbar.prototype, "setName", void 0);
__decorate([
    decorators_1.command(['bossbar', 'set', 'players'], { isRoot: true }),
    __metadata("design:type", Object)
], Bossbar.prototype, "setPlayers", void 0);
__decorate([
    decorators_1.command(['bossbar', 'set', 'style'], { isRoot: true }),
    __metadata("design:type", Object)
], Bossbar.prototype, "setStyle", void 0);
__decorate([
    decorators_1.command(['bossbar', 'set', 'value'], { isRoot: true }),
    __metadata("design:type", Object)
], Bossbar.prototype, "setValue", void 0);
__decorate([
    decorators_1.command(['bossbar', 'set', 'visible'], { isRoot: true }),
    __metadata("design:type", Object)
], Bossbar.prototype, "setVisible", void 0);
exports.Bossbar = Bossbar;
//# sourceMappingURL=Bossbar.js.map