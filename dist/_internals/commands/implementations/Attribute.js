"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attribute = exports.AttributeOperation = void 0;
const Command_1 = require("../Command");
const decorators_1 = require("../decorators");
class AttributeOperation extends Command_1.Command {
    constructor() {
        super(...arguments);
        /** Returns the total value of the specified attribute. */
        this.get = (scale) => { };
        /** Returns the base value of the specified attribute. */
        this.baseGet = (scale) => { };
        /** Overwrites the base value of the specified attribute with the given value. */
        this.baseSet = (value) => { };
        /** Adds an attribute modifier with the specified properties if no modifier with the same UUID already existed. */
        this.add = (uuid, name, value, modifier) => { };
        /** Removes the attribute modifier with the specified UUID. */
        this.remove = (uuid) => { };
        /** Returns the value of the modifier with the specified UUID. */
        this.getModifierValue = (uuid, scale) => { };
    }
}
__decorate([
    decorators_1.command('get'),
    __metadata("design:type", Object)
], AttributeOperation.prototype, "get", void 0);
__decorate([
    decorators_1.command(['base', 'get']),
    __metadata("design:type", Object)
], AttributeOperation.prototype, "baseGet", void 0);
__decorate([
    decorators_1.command(['base', 'get']),
    __metadata("design:type", Object)
], AttributeOperation.prototype, "baseSet", void 0);
__decorate([
    decorators_1.command(['modifier', 'add']),
    __metadata("design:type", Object)
], AttributeOperation.prototype, "add", void 0);
__decorate([
    decorators_1.command(['modifier', 'remove']),
    __metadata("design:type", Object)
], AttributeOperation.prototype, "remove", void 0);
__decorate([
    decorators_1.command(['modifier', 'value', 'get']),
    __metadata("design:type", Object)
], AttributeOperation.prototype, "getModifierValue", void 0);
exports.AttributeOperation = AttributeOperation;
class Attribute extends Command_1.Command {
    constructor() {
        super(...arguments);
        this.attribute = (target, attribute) => new AttributeOperation(this.commandsRoot);
    }
}
__decorate([
    decorators_1.command('attribute', { isRoot: true, hasSubcommands: true, executable: false }),
    __metadata("design:type", Object)
], Attribute.prototype, "attribute", void 0);
exports.Attribute = Attribute;
//# sourceMappingURL=Attribute.js.map