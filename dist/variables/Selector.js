"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selector = void 0;
class Selector {
    constructor(target, selectorArguments) {
        this.target = target;
        this.arguments = selectorArguments !== null && selectorArguments !== void 0 ? selectorArguments : {};
    }
    inArguments(key) {
        // eslint-disable-next-line no-prototype-builtins
        return this.arguments.hasOwnProperty(key);
    }
    toString() {
        function score(scores) {
            return Object.entries(scores).map(([scoreName, value]) => {
                var _a, _b;
                if (Array.isArray(value)) {
                    return [scoreName, `${(_a = value[0]) !== null && _a !== void 0 ? _a : ''}..${(_b = value[1]) !== null && _b !== void 0 ? _b : ''}`].join('=');
                }
                return [scoreName, value].join('=');
            }).join(', ');
        }
        const result = [];
        if (this.arguments) {
            const args = { ...this.arguments };
            if (args.score) {
                result.push(['score', score(args.score)]);
                delete args.score;
            }
            if (args.tag) {
                const tags = Array.isArray(args.tag) ? args.tag : [args.tag];
                result.push(...tags.map((tag) => ['tag', tag]));
                delete args.tag;
            }
        }
    }
}
exports.Selector = Selector;
//# sourceMappingURL=Selector.js.map