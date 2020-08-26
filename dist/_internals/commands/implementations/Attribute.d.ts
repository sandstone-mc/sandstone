import type { SelectorArgument } from '@arguments';
import { Command } from '../Command';
export declare class AttributeOperation extends Command {
    /** Returns the total value of the specified attribute. */
    get: (scale?: number | undefined) => void;
    /** Returns the base value of the specified attribute. */
    baseGet: (scale?: number | undefined) => void;
    /** Overwrites the base value of the specified attribute with the given value. */
    baseSet: (value: number) => void;
    /** Adds an attribute modifier with the specified properties if no modifier with the same UUID already existed. */
    add: (uuid: string, name: string, value: number, modifier: 'add' | 'multiply' | 'multiply_base') => void;
    /** Removes the attribute modifier with the specified UUID. */
    remove: (uuid: string) => void;
    /** Returns the value of the modifier with the specified UUID. */
    getModifierValue: (uuid: string, scale?: number | undefined) => void;
}
export declare class Attribute extends Command {
    attribute: (target: SelectorArgument<true>, attribute: string) => AttributeOperation;
}
