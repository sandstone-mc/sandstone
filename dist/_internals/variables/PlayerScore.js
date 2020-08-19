"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerScore = void 0;
class PlayerScore {
    constructor(commandsRoot, target, objective) {
        this.commandsRoot = commandsRoot;
        this.target = target;
        this.objective = objective;
    }
    toString() {
        return `${this.target} ${this.objective}`;
    }
    unaryOperation(operation, operator, ...args) {
        var _a;
        if (typeof args[0] === 'number') {
            this.commandsRoot.scoreboard.players[operation](this.target, this.objective, args[0]);
        }
        else if (args[0] instanceof PlayerScore) {
            this.commandsRoot.scoreboard.players.operation(this.target, this.objective, operator, args[0].target, args[0].objective);
        }
        else {
            this.commandsRoot.scoreboard.players.operation(this.target, this.objective, operator, args[0], (_a = args[1]) !== null && _a !== void 0 ? _a : this.objective);
        }
    }
    binaryOperation(operator, ...args) {
        var _a;
        if (args[0] instanceof PlayerScore) {
            this.commandsRoot.scoreboard.players.operation(this.target, this.objective, operator, args[0].target, args[0].objective);
            return;
        }
        if (typeof args[0] === 'number') {
            this.commandsRoot.Datapack.registerNewConstant(args[0]);
        }
        this.commandsRoot.scoreboard.players.operation(this.target, this.objective, operator, args[0], (_a = args[1]) !== null && _a !== void 0 ? _a : this.objective);
    }
    set(...args) {
        this.unaryOperation('set', '=', ...args);
    }
    add(...args) {
        this.unaryOperation('add', '+=', ...args);
    }
    remove(...args) {
        this.unaryOperation('remove', '-=', ...args);
    }
    multiply(...args) {
        this.binaryOperation('*=', ...args);
    }
    divide(...args) {
        this.binaryOperation('/=', ...args);
    }
    modulo(...args) {
        this.binaryOperation('%=', ...args);
    }
    swap(...args) {
        this.binaryOperation('<>', ...args);
    }
    createAnonymousScore(amountOrTargets, objective = this.objective) {
        const anonymousScore = new PlayerScore(this.commandsRoot, `#__anonymous_${PlayerScore.anonymousScoreId}__`, this.objective);
        if (typeof amountOrTargets === 'number') {
            anonymousScore.set(amountOrTargets);
        }
        else {
            anonymousScore.set(amountOrTargets, objective);
        }
        PlayerScore.anonymousScoreId += 1;
        return anonymousScore;
    }
    plus(...args) {
        const anonymousScore = this.createAnonymousScore(this.target, this.objective);
        anonymousScore.unaryOperation('add', '+=', ...args);
        return anonymousScore;
    }
    minus(...args) {
        const anonymousScore = this.createAnonymousScore(this.target, this.objective);
        anonymousScore.unaryOperation('remove', '-=', ...args);
        return anonymousScore;
    }
    multipliedBy(...args) {
        const anonymousScore = this.createAnonymousScore(this.target, this.objective);
        anonymousScore.binaryOperation('*=', ...args);
        return anonymousScore;
    }
    dividedBy(...args) {
        const anonymousScore = this.createAnonymousScore(this.target, this.objective);
        anonymousScore.binaryOperation('*=', ...args);
        return anonymousScore;
    }
    moduloBy(...args) {
        const anonymousScore = this.createAnonymousScore(this.target, this.objective);
        anonymousScore.binaryOperation('%=', ...args);
        return anonymousScore;
    }
    /** COMPARISONS OPERATORS */
    comparison(operator, matchesRange, args) {
        if (typeof args[0] === 'number') {
            return {
                value: ['score', this.target, this.objective, 'matches', matchesRange],
            };
        }
        const endArgs = args[1] ? args : [args[0]];
        return {
            value: ['score', this.target, this.objective, operator, ...endArgs],
        };
    }
    greaterThan(...args) {
        return this.comparison('>', `${typeof args[0] === 'number' ? args[0] + 1 : null}..`, args);
    }
    greaterOrEqualThan(...args) {
        return this.comparison('>=', `${args[0]}..`, args);
    }
    lowerThan(...args) {
        return this.comparison('<', `..${typeof args[0] === 'number' ? args[0] - 1 : null}`, args);
    }
    lowerOrEqualThan(...args) {
        return this.comparison('<=', `..${args[0]}`, args);
    }
    equalTo(...args) {
        return this.comparison('=', args[0].toString(), args);
    }
}
exports.PlayerScore = PlayerScore;
PlayerScore.anonymousScoreId = 0;
//# sourceMappingURL=PlayerScore.js.map