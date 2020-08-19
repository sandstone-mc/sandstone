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
exports.Scoreboard = void 0;
const _variables_1 = require("@variables");
const Command_1 = require("../Command");
const decorators_1 = require("../decorators");
function objectiveCmd(subcommand) {
    return ['scoreboard', 'objectives', subcommand];
}
function playersCmd(...subcommands) {
    return ['scoreboard', 'players', ...subcommands];
}
class ScoreboardObjectives extends Command_1.Command {
    constructor() {
        super(...arguments);
        /** List all existing objectives with their display names and criteria. */
        this.list = () => { };
        /**
         * Create a new objective with the given internal objective name, specified criterion, and the optional display name.
         * All three arguments are case-sensitive.
         *
         * --------------------------------------------------
         * ⚠️ The prefered way is using:
         * ```
         * const objective = createObjective(...)
         * ```
         * --------------------------------------------------
         *
         * @param objective must be a plain text at most 16 characters.
         *
         * @param criterion must be a valid criterion type.
         *
         * @param displayName must be a JSON text component, defaulting to `objective` when unspecified.
         */
        this.add = (objective, criteria, displayName) => { };
        /**
         * Delete all references to the named objective in the scoreboard system.
         * Data is deleted from the objectives list and entity scores,
         * and if it was on a display list it is no longer displayed.
         *
         * --------------------------------------------------
         * ⚠️ The prefered way is using:
         * ```
         * const objective = createObjective(...)
         * objective.remove()
         * ```
         * --------------------------------------------------
         */
        this.remove = (objective) => { };
        /**
         * Display score info for the objective in the given slot.
         *
         * --------------------------------------------------
         * ⚠️ The prefered way is using:
         * ```
         * const objective = createObjective(...)
         * objective.setDisplay(...)
         * ```
         * --------------------------------------------------
         *
         * @param slot The slot to display the objective in.
         *
         * @param objective The objective to display. If not provided, this display slot is cleared.
         */
        this.setDisplay = (slot, objective) => { };
        this.modify = (...args) => { };
    }
}
__decorate([
    decorators_1.command(objectiveCmd('list'), { isRoot: true }),
    __metadata("design:type", Object)
], ScoreboardObjectives.prototype, "list", void 0);
__decorate([
    decorators_1.command(objectiveCmd('add'), {
        isRoot: true,
        parsers: {
            '2': (displayName) => (displayName ? new _variables_1.JsonTextComponentClass(displayName) : displayName),
        },
    }),
    __metadata("design:type", Object)
], ScoreboardObjectives.prototype, "add", void 0);
__decorate([
    decorators_1.command(objectiveCmd('remove'), { isRoot: true }),
    __metadata("design:type", Object)
], ScoreboardObjectives.prototype, "remove", void 0);
__decorate([
    decorators_1.command(objectiveCmd('setdisplay'), { isRoot: true }),
    __metadata("design:type", Object)
], ScoreboardObjectives.prototype, "setDisplay", void 0);
__decorate([
    decorators_1.command(objectiveCmd('modify'), {
        isRoot: true,
        parsers: {
            '2': (displayName, [_, type]) => (type === 'displayname' ? new _variables_1.JsonTextComponentClass(displayName) : displayName),
        },
    }),
    __metadata("design:type", Function)
], ScoreboardObjectives.prototype, "modify", void 0);
class ScoreboardPlayers extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.list = (target) => { };
        /**
         * Return the scoreboard value of a given objective for a given target.
         *
         * --------------------------------------------------
         * ⚠️ The prefered way is using:
         * ```
         * const objective = createObjective(...)
         * const player = objective.ScoreHolder(...)
         * player.get()
         * ```
         * --------------------------------------------------
         *
         * @param target The entity to get the score from.
         *
         * @param objective The objective to get the score from.
         */
        this.get = (target, objective) => { };
        this.set = (target, objective, score) => { };
        this.add = (target, objective, score) => { };
        this.remove = (target, objective, score) => { };
        this.reset = (target, objective) => { };
        this.enable = (target, objective) => { };
        this.operation = (targets, targetObjective, operation, source, sourceObjective) => { };
    }
}
__decorate([
    decorators_1.command(playersCmd('list'), { isRoot: true }),
    __metadata("design:type", Function)
], ScoreboardPlayers.prototype, "list", void 0);
__decorate([
    decorators_1.command(playersCmd('get'), { isRoot: true }),
    __metadata("design:type", Object)
], ScoreboardPlayers.prototype, "get", void 0);
__decorate([
    decorators_1.command(playersCmd('set'), { isRoot: true }),
    __metadata("design:type", Object)
], ScoreboardPlayers.prototype, "set", void 0);
__decorate([
    decorators_1.command(playersCmd('add'), { isRoot: true }),
    __metadata("design:type", Object)
], ScoreboardPlayers.prototype, "add", void 0);
__decorate([
    decorators_1.command(playersCmd('remove'), { isRoot: true }),
    __metadata("design:type", Object)
], ScoreboardPlayers.prototype, "remove", void 0);
__decorate([
    decorators_1.command(playersCmd('reset'), { isRoot: true }),
    __metadata("design:type", Object)
], ScoreboardPlayers.prototype, "reset", void 0);
__decorate([
    decorators_1.command(playersCmd('enable'), { isRoot: true }),
    __metadata("design:type", Object)
], ScoreboardPlayers.prototype, "enable", void 0);
__decorate([
    decorators_1.command(playersCmd('operation'), { isRoot: true }),
    __metadata("design:type", Object)
], ScoreboardPlayers.prototype, "operation", void 0);
class Scoreboard extends Command_1.Command {
    constructor() {
        super(...arguments);
        /** All commands related to scoreboard objectives. */
        this.objectives = (new ScoreboardObjectives(this.commandsRoot));
        /** All commands related to scoreboard players. */
        this.players = (new ScoreboardPlayers(this.commandsRoot));
    }
}
exports.Scoreboard = Scoreboard;
//# sourceMappingURL=Scoreboard.js.map