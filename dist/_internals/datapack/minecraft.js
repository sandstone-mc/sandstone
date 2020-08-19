"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMcFunctionName = void 0;
function toMcFunctionName(functionName) {
    const [namespace, ...folders] = functionName;
    return `${namespace}:${folders.join('/')}`;
}
exports.toMcFunctionName = toMcFunctionName;
//# sourceMappingURL=minecraft.js.map