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
exports.CommandsRoot = void 0;
const _variables_1 = require("@variables");
const JsonTextComponentClass_1 = require("@variables/JsonTextComponentClass");
const decorators_1 = require("./decorators");
const implementations_1 = require("./implementations");
class CommandsRoot {
    constructor(datapack) {
        /**
         * Registers the current command.
         *
         * @param soft If true, then it allows to try to register a command when we don't know if it is needed.
         * Sometimes, is is possible a command needs to be registered, or maybe it's not. Then a soft register is necessary.
         */
        this.register = (soft = false) => {
            if (this.executable) {
                this.Datapack.registerNewCommand(this.arguments);
                this.reset();
                return;
            }
            if (!soft) {
                throw new Error(`Registering a command that is not executable: ${JSON.stringify(this.arguments)}`);
            }
            // Soft registering. If the last command had arguments but was not executable, it's an error.
            if (this.arguments.length > 0) {
                throw new Error(`Error: the previous command ${this.arguments} was not finished.`);
            }
        };
        /** UTILS */
        // Create a new objective
        this.createObjective = (name, criterion, display) => {
            const objective = _variables_1.Objective(this, name, criterion, display);
            this.Datapack.registerNewObjective(objective);
            return objective;
        };
        this.Selector = _variables_1.Selector;
        /**
         * Saves the datapack to the file system.
         *
         * @param name The name of the Datapack
         *
         * @param options The save options
         */
        this.save = (name, options) => {
            this.Datapack.save(name, options);
        };
        /** COMMANDS */
        // advancement command //
        this.advancement = new implementations_1.Advancement(this);
        // attribute command //
        this.attribute = (new implementations_1.Attribute(this)).attribute;
        // bossabar command //
        this.bossbar = new implementations_1.Bossbar(this);
        // clear command //
        this.clear = (targets, item, maxCount) => { };
        // clone command //
        this.clone = (new implementations_1.Clone(this)).clone;
        // data command //
        this.data = new implementations_1.Data(this);
        // datapack command //
        this.datapack = new implementations_1.DatapackCommand(this);
        // debug command //
        this.debug = new implementations_1.Debug(this);
        // defaultgamemode command //
        this.defaultgamemode = (new implementations_1.DefaultGamemode(this)).defaultgamemode;
        // difficulty command //
        this.difficulty = (new implementations_1.Difficulty(this)).difficulty;
        // effect command //
        this.effect = (new implementations_1.Effect(this));
        // enchant command //
        this.enchant = (new implementations_1.Enchant(this)).enchant;
        // execute command //
        this.execute = (new implementations_1.Execute(this));
        // experience command //
        this.experience = new implementations_1.Experience(this);
        // fill command //
        this.fill = (new implementations_1.Fill(this)).fill;
        // forceload command //
        this.forceload = new implementations_1.Forceload(this);
        // function command //
        this.function = (new implementations_1.FunctionCommand(this).function);
        // gamemode command //
        this.gamemode = (gamemode, target) => { };
        // gamerule command //
        this.gamerule = (gamerule, value) => { };
        // give command //
        this.give = (target, item, count) => { };
        // help command //
        this.help = (command_) => { };
        // kill command //
        this.kill = (targets) => { };
        // list command //
        this.list = (uuids) => { };
        // locate command //
        this.locate = (structure) => { };
        // locatebiome command //
        this.locatebiome = (biome) => { };
        // loot command //
        this.loot = new implementations_1.Loot(this);
        // me command //
        this.me = (action) => { };
        // me command //
        this.msg = (action) => { };
        // particle command //
        this.particle = (new implementations_1.Particle(this)).particle;
        // playsound command //
        // say command //
        this.say = (...messages) => { };
        // scoreboard command //
        this.scoreboard = new implementations_1.Scoreboard(this);
        // teleport command //
        this.teleport = (new implementations_1.Teleport(this)).teleport;
        // tellraw command //
        this.tellraw = (targets, message) => { };
        this.arguments = [];
        this.inExecute = false;
        this.executable = false;
        this.Datapack = datapack;
        this.commandsRoot = this;
    }
    reset() {
        this.arguments = [];
        this.inExecute = false;
        this.executable = false;
    }
}
__decorate([
    decorators_1.command('clear', { isRoot: true }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "clear", void 0);
__decorate([
    decorators_1.command('gamemode', { isRoot: true }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "gamemode", void 0);
__decorate([
    decorators_1.command('gamerule', { isRoot: true }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "gamerule", void 0);
__decorate([
    decorators_1.command('give', { isRoot: true }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "give", void 0);
__decorate([
    decorators_1.command('help', { isRoot: true }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "help", void 0);
__decorate([
    decorators_1.command('kill', { isRoot: true }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "kill", void 0);
__decorate([
    decorators_1.command('list', {
        isRoot: true,
        parsers: {
            '0': (uuids) => (uuids ? 'uuids' : undefined),
        },
    }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "list", void 0);
__decorate([
    decorators_1.command('locate', { isRoot: true }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "locate", void 0);
__decorate([
    decorators_1.command('locatebiome', { isRoot: true }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "locatebiome", void 0);
__decorate([
    decorators_1.command('me', { isRoot: true }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "me", void 0);
__decorate([
    decorators_1.command('msg', { isRoot: true }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "msg", void 0);
__decorate([
    decorators_1.command('say', { isRoot: true }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "say", void 0);
__decorate([
    decorators_1.command('tellraw', { isRoot: true, parsers: { '1': (msg) => new JsonTextComponentClass_1.JsonTextComponentClass(msg) } }),
    __metadata("design:type", Object)
], CommandsRoot.prototype, "tellraw", void 0);
exports.CommandsRoot = CommandsRoot;
exports.default = CommandsRoot;
//# sourceMappingURL=CommandsRoot.js.map