"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selector = exports.SelectorClass = void 0;
function isSingleSelector(target, selectorProperties) {
    if (['@s', '@p', '@r'].includes(target)) {
        return true;
    }
    const { limit } = selectorProperties;
    if (limit === 0 || limit === 1) {
        return true;
    }
    return false;
}
function parseScore(scores) {
    return `{${Object.entries(scores).map(([scoreName, value]) => {
        var _a, _b;
        if (Array.isArray(value)) {
            return [scoreName, `${(_a = value[0]) !== null && _a !== void 0 ? _a : ''}..${(_b = value[1]) !== null && _b !== void 0 ? _b : ''}`].join('=');
        }
        return [scoreName, value].join('=');
    }).join(', ')}}`;
}
function parseAdvancements(advancements) {
    return `{${Object.entries(advancements).map(([advancementName, value]) => {
        if (typeof value === 'boolean') {
            return [advancementName, value].join('=');
        }
        return [advancementName, parseAdvancements(value)].join('=');
    }).join(', ')}}`;
}
class SelectorClass {
    constructor(commandsRoot, target, selectorArguments) {
        this.listScores = () => {
            this.commandsRoot.scoreboard.players.list(this.toString());
        };
        this.isSingle = () => isSingleSelector(this.target, this.arguments);
        this.commandsRoot = commandsRoot;
        this.target = target;
        this.arguments = selectorArguments !== null && selectorArguments !== void 0 ? selectorArguments : {};
    }
    toString() {
        if (!Object.keys(this.arguments).length) {
            return this.target;
        }
        const result = [];
        if (this.arguments) {
            const args = { ...this.arguments };
            const modifiers = {
                // Parse scores
                score: (score) => result.push(['score', parseScore(score)]),
                // Parse advancements
                advancements: (advancements) => result.push(['advancements', parseAdvancements(advancements)]),
                // Parse potentially multiple tags
                tag: (tag) => {
                    const tags = Array.isArray(tag) ? tag : [tag];
                    result.push(...tags.map((tag) => ['tag', tag]));
                },
                // Parse potentially multiple predicates
                predicate: (predicate) => {
                    const predicates = Array.isArray(predicate) ? predicate : [predicate];
                    result.push(...predicates.map((pred) => ['predicate', pred]));
                },
                // Handle boolean values for teams
                team: (team) => {
                    let teamRepr;
                    if (team === true) {
                        teamRepr = '!';
                    }
                    else if (team === false) {
                        teamRepr = '';
                    }
                    else {
                        teamRepr = team;
                    }
                    result.push(['team', teamRepr]);
                },
            };
            for (const [baseName, modifier] of Object.entries(modifiers)) {
                const name = baseName;
                const value = args[name];
                if (value !== undefined) {
                    modifier(value);
                    delete args[name];
                }
            }
        }
        return `${this.target}[${result.map(([key, value]) => `${key}=${value}`).join(',')}]`;
    }
    _toChatComponent() {
        return {
            selector: this.toString(),
        };
    }
    toJSON() {
        return this.toString();
    }
}
exports.SelectorClass = SelectorClass;
function Selector(target, selectorArguments) {
    return new SelectorClass(this, target, selectorArguments);
}
exports.Selector = Selector;
//# sourceMappingURL=Selector.js.map