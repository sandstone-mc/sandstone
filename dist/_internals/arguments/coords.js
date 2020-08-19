"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotationParser = exports.coordinatesParser = exports.arrayToArgsParser = void 0;
const _variables_1 = require("@variables");
function arrayToArgsParser(args) {
    if (Array.isArray(args) && args.length === 3 && args.every(a => typeof a === 'string')) {
        return new _variables_1.VectorClass(args);
    }
    return args;
}
exports.arrayToArgsParser = arrayToArgsParser;
function coordinatesParser(coordinates) {
    if (Array.isArray(coordinates) && coordinates.length === 3 && coordinates.every(c => typeof c === 'string')) {
        return new _variables_1.VectorClass(coordinates);
    }
    return coordinates;
}
exports.coordinatesParser = coordinatesParser;
function rotationParser(rotation) {
    if (Array.isArray(rotation) && rotation.length === 2 && rotation.every(r => typeof r === 'string')) {
        return new _variables_1.VectorClass(rotation);
    }
    return rotation;
}
exports.rotationParser = rotationParser;
//# sourceMappingURL=coords.js.map