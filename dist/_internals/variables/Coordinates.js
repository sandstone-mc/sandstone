"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.local = exports.relative = exports.absolute = exports.VectorClass = void 0;
const util_1 = require("util");
/** A root class that can be used to defined a N-dimeension vector */
class VectorClass {
    constructor(values) {
        if (!Array.isArray(values) || !values.every((i) => typeof i === 'string')) {
            throw new Error(`Expected array of string for Vector values, got ${util_1.inspect(values)}`);
        }
        this.values = values;
    }
    toString() {
        return this.values.join(' ');
    }
    toJSON() {
        return this.toString();
    }
    [Symbol.iterator]() {
        return this.values[Symbol.iterator];
    }
}
exports.VectorClass = VectorClass;
function absolute(...coordinates) {
    if (coordinates.length === 1) {
        return coordinates[0].toString();
    }
    return new VectorClass(coordinates.map((coord) => coord.toString()));
}
exports.absolute = absolute;
function relative(...coordinates) {
    if (coordinates.length === 1) {
        return `~${coordinates[0] || ''}`;
    }
    return new VectorClass(coordinates.map((coord) => `~${coord || ''}`));
}
exports.relative = relative;
function local(...coordinates) {
    if (coordinates.length === 1) {
        return `^${coordinates[0] || ''}`;
    }
    return new VectorClass(coordinates.map((coord) => `^${coord || ''}`));
}
exports.local = local;
//# sourceMappingURL=Coordinates.js.map