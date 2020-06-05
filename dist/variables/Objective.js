"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Objective = void 0;
class Objective {
    constructor(name, criterion, display) {
        this.name = name;
        this.criterion = criterion;
        this.display = display;
    }
    toString() {
        return this.name;
    }
}
exports.Objective = Objective;
//# sourceMappingURL=Objective.js.map