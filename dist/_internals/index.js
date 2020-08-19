"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandsRoot = exports.datapack = void 0;
require("module-alias/register");
const datapack_1 = require("./datapack");
exports.datapack = new datapack_1.Datapack('default');
exports.commandsRoot = exports.datapack.commandsRoot;
__exportStar(require("./variables"), exports);
//# sourceMappingURL=index.js.map