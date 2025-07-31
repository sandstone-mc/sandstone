import type { SingleEntityArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

// Attribute command

export class AttributeCommandNode extends CommandNode {
  command = 'attribute' as const
}

export class AttributeOperationCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Returns the total value of the specified attribute.
   * @category attribute
   */
  get = (scale?: Macroable<number, MACRO>) => this.finalCommand(['get', scale])

  /**
   * Returns the base value of the specified attribute.
   * @category attribute
   */
  baseGet = (scale?: Macroable<number, MACRO>) => this.finalCommand(['base', 'get', scale])

  /**
   * Overwrites the base value of the specified attribute with the given value.
   * @category attribute
   */
  baseSet = (value: Macroable<number, MACRO>) => this.finalCommand(['base', 'set', value])

  /**
   * Adds an attribute modifier with the specified properties if no modifier with the same UUID already existed.
   * @category attribute
   */
  add = (
    uuid: Macroable<string, MACRO>,
    name: Macroable<string, MACRO>,
    value: Macroable<number, MACRO>,
    modifier: Macroable<'add' | 'multiply' | 'multiply_base', MACRO>,
  ) => this.finalCommand(['modifier', 'add', uuid, name, value, modifier])

  /** Removes the attribute modifier with the specified UUID. */
  remove = (uuid: Macroable<string, MACRO>) => this.finalCommand(['modifier', 'remove', uuid])

  /** Returns the value of the modifier with the specified UUID. */
  getModifierValue = (uuid: Macroable<string, MACRO>, scale?: Macroable<number, MACRO>) =>
    this.finalCommand(['modifier', 'value', 'get', uuid, scale])
}

/**
 * Used to change or read attributes.
 */
export class AttributeCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = AttributeCommandNode

  attribute = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>, attribute: Macroable<string, MACRO>) =>
    this.finalCommand([targetParser(target), attribute])
}
