import { targetParser } from 'sandstone/variables/parsers'
import { CommandNode } from 'sandstone/core'

import { CommandArguments } from '../../helpers.js'

import type { SingleEntityArgument } from 'sandstone/arguments'

// Attribute command

export class AttributeCommandNode extends CommandNode {
  command = 'attribute' as const
}

export class AttributeOperationCommand extends CommandArguments {
  /**
   * Returns the total value of the specified attribute.
   * @category attribute
   */
  get = (scale?: number) => this.finalCommand(['get', scale])

  /**
   * Returns the base value of the specified attribute.
   * @category attribute
   */
  baseGet = (scale?: number) => this.finalCommand(['base', 'get', scale])

  /**
   * Overwrites the base value of the specified attribute with the given value.
   * @category attribute
   */
  baseSet = (value: number) => this.finalCommand(['base', 'set', value])

  /**
   * Adds an attribute modifier with the specified properties if no modifier with the same UUID already existed.
   * @category attribute
   */
  add = (uuid: string, name: string, value: number, modifier: 'add' | 'multiply' | 'multiply_base') => this.finalCommand(['modifier', 'add', uuid, name, value, modifier])

  /** Removes the attribute modifier with the specified UUID. */
  remove = (uuid: string) => this.finalCommand(['modifier', 'remove', uuid])

  /** Returns the value of the modifier with the specified UUID. */
  getModifierValue = (uuid: string, scale?: number) => this.finalCommand(['modifier', 'value', 'get', uuid, scale])
}

/**
 * Used to change or read attributes.
 */
export class AttributeCommand extends CommandArguments {
  protected NodeType = AttributeCommandNode

  attribute = (target: SingleEntityArgument, attribute: string) => this.finalCommand([targetParser(target), attribute])
}
