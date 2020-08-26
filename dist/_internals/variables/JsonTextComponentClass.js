"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTextComponentClass = void 0;
class JsonTextComponentClass {
    constructor(jsonTextComponent) {
        this.jsonTextComponent = jsonTextComponent;
    }
    toString() {
        const result = JSON.stringify(this.jsonTextComponent, function (key, value) {
            var _a, _b, _c, _d;
            // If we are in an array, our component could be a custom object (like a Selector) that is directly used as a chat component.
            // Therefore, we must try to transform it into a chat component, or a json object.
            // If not possible, we fallback on the original value.
            if (Array.isArray(this)) {
                // The value given is not the real original value, but sometimes it is the stringified value.
                // Therefore, we must get back the real one.
                const realValue = this[parseInt(key, 10)];
                return (_d = (_b = (_a = realValue._toChatComponent) === null || _a === void 0 ? void 0 : _a.call(realValue)) !== null && _b !== void 0 ? _b : (_c = realValue.toJSON) === null || _c === void 0 ? void 0 : _c.call(realValue)) !== null && _d !== void 0 ? _d : realValue;
            }
            return value;
        }, 1);
        const formatted = result.replace(/,\n +/g, ', ').replace(/\n */g, '');
        return formatted;
    }
    toJSON() {
        return JSON.parse(this.toString());
    }
}
exports.JsonTextComponentClass = JsonTextComponentClass;
//# sourceMappingURL=JsonTextComponentClass.js.map