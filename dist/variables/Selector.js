"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selector = void 0;
class Selector {
    constructor(target, selectorArguments) {
        this.target = target;
        this.arguments = selectorArguments ?? {};
    }
    inArguments(key) {
        // eslint-disable-next-line no-prototype-builtins
        return this.arguments.hasOwnProperty(key);
    }
    toString() {
        function score(scores) {
            return Object.entries(scores).map(([scoreName, value]) => {
                if (Array.isArray(value)) {
                    return [scoreName, `${value[0] ?? ''}..${value[1] ?? ''}`].join('=');
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