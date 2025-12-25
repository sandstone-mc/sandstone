import type { SingleEntityArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

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

export class AttributeCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = AttributeCommandNode

  /**
   * Modify or query entity attributes.
   *
   * @param target Entity whose attributes to modify.
   *              Must be a single living entity.
   *              Examples: '@p', '@e[type=zombie,limit=1]', 'PlayerName'
   *
   * @param attribute Attribute identifier to modify.
   *                 Examples: 'minecraft:generic.max_health', 'minecraft:generic.movement_speed',
   *                          'minecraft:generic.attack_damage', 'minecraft:generic.armor'
   *
   * @example
   * ```ts
   * // Get attribute values
   * attribute('@p', 'minecraft:generic.max_health').get()        // Get total health
   * attribute('@p', 'minecraft:generic.movement_speed').baseGet() // Get base speed
   *
   * // Set base attribute values
   * attribute('@p', 'minecraft:generic.max_health').baseSet(40)   // 40 max health
   * attribute('@e[type=zombie]', 'minecraft:generic.movement_speed').baseSet(0.5)
   *
   * // Add attribute modifiers
   * attribute('@p', 'minecraft:generic.attack_damage')
   *   .add('speed-boost', 'Speed Boost', 0.5, 'multiply')
   *
   * // Remove modifiers
   * attribute('@p', 'minecraft:generic.movement_speed').remove('speed-boost')
   * ```
   */
  attribute = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>, attribute: Macroable<string, MACRO>) =>
    this.subCommand([targetParser(target), attribute], AttributeOperationCommand, false)
}
