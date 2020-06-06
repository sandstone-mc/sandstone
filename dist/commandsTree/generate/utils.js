"use strict";
/**
 * This file contains utilities functions to auto-generate the commands tree.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCamelCase = exports.safeName = exports.getBasePath = exports.toJS = void 0;
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
/**
 * Returns the string version of a Javascript object.
 * The representation will be valid Javascript, but invalid JSON.
 */
function toJS(obj, compact = true) {
    return util_1.default.inspect(obj, {
        depth: +Infinity,
        maxArrayLength: +Infinity,
        maxStringLength: +Infinity,
        breakLength: compact ? +Infinity : 80,
        compact,
        colors: false,
    });
}
exports.toJS = toJS;
/**
 * Get the folder of a path.
 */
function getBasePath(filePath) {
    return path_1.default.parse(filePath).dir;
}
exports.getBasePath = getBasePath;
/**
 * Returns a safe version of a name. Safe means "can be used as a parameter name".
 */
function safeName(name) {
    if (['function'].includes(name)) {
        return `${name}_`;
    }
    return name;
}
exports.safeName = safeName;
/**
 * Transforms a dash-cased string into a camelCase one.
 */
function toCamelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, (match, group1) => group1.toUpperCase());
}
exports.toCamelCase = toCamelCase;
//# sourceMappingURL=utils.js.map