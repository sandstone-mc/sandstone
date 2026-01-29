import type { SingleEntityArgumentOf } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

// Attribute command

export class AttributeCommandNode extends CommandNode {
  command = 'attribute' as const
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
  attribute = <T extends string>(target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>, attribute: Macroable<string, MACRO>) =>
    this.subCommand([targetParser(target), attribute], AttributeOperationCommand, false)
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
   * Overwrites the base value of the specified attribute with the stock value.
   * @category attribute
   */
  baseReset = (value: Macroable<number, MACRO>) => this.finalCommand(['base', 'reset', value])

  /**
   * Adds an attribute modifier with the specified properties if no modifier with the same ID already existed.
   * @category attribute
   */
  add = (
    id: Macroable<`${string}:${string}`, MACRO>,
    value: Macroable<number, MACRO>,
    modifier: Macroable<'add_value' | 'add_multiplied_base' | 'add_multiplied_total', MACRO>,
  ) => this.finalCommand(['modifier', 'add', id, value, modifier])

  /** Removes the attribute modifier with the specified ID. */
  remove = (id: Macroable<`${string}:${string}`, MACRO>) => this.finalCommand(['modifier', 'remove', id])

  /** Returns the value of the modifier with the specified ID. */
  getModifierValue = (id: Macroable<`${string}:${string}`, MACRO>, scale?: Macroable<number, MACRO>) =>
    this.finalCommand(['modifier', 'value', 'get', id, scale])
}