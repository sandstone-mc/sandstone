"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Objective = exports.ObjectiveClass = void 0;
const JsonTextComponentClass_1 = require("./JsonTextComponentClass");
const PlayerScore_1 = require("./PlayerScore");
class ObjectiveClass {
    constructor(commandsRoot, name, criterion, display) {
        this.commandsRoot = commandsRoot;
        this.name = name;
        this.criterion = criterion;
        this.display = display === undefined ? undefined : new JsonTextComponentClass_1.JsonTextComponentClass(display);
        this._displayRaw = display;
    }
    toString() {
        return this.name;
    }
    ScoreHolder(scoreHolder) {
        return new PlayerScore_1.PlayerScore(this.commandsRoot, scoreHolder.toString(), this);
    }
}
exports.ObjectiveClass = ObjectiveClass;
function Objective(commandsRoot, name, criterion, display) {
    return new ObjectiveClass(commandsRoot, name, criterion, display);
}
exports.Objective = Objective;
//# sourceMappingURL=Objective.js.map