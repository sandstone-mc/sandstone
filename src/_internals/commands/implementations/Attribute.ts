import { Command } from '../Command'
import { command } from '../decorators'

import type { SelectorArgument, SingleEntityArgument } from '@arguments'

export class AttributeOperation extends Command {
  /**
   * Returns the total value of the specified attribute.
   * @category attribute
   */
  @command('get')
  get = (scale?: number) => { }

  /**
   * Returns the base value of the specified attribute.
   * @category attribute
   */
  @command(['base', 'get'])
  baseGet = (scale?: number) => { }

  /**
   * Overwrites the base value of the specified attribute with the given value.
   * @category attribute
   */
  @command(['base', 'set'])
  baseSet = (value: number) => { }

  /**
   * Adds an attribute modifier with the specified properties if no modifier with the same UUID already existed.
   * @category attribute
   */
  @command(['modifier', 'add'])
  add = (uuid: string, name: string, value: number, modifier: 'add' | 'multiply' | 'multiply_base') => { }

  /** Removes the attribute modifier with the specified UUID. */
  @command(['modifier', 'remove'])
  remove = (uuid: string) => { }

  /** Returns the value of the modifier with the specified UUID. */
  @command(['modifier', 'value', 'get'])
  getModifierValue = (uuid: string, scale?: number) => { }
}

/**
 * Used to change or read attributes.
 */
export class Attribute extends Command {
  @command('attribute', { isRoot: true, hasSubcommands: true, executable: false })
  attribute = (target: SingleEntityArgument, attribute: string) => new AttributeOperation(this.commandsRoot)
}
