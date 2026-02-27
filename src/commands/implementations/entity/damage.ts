import type { Coordinates, Registry, SingleEntityArgumentOf } from 'sandstone/arguments'
import { validateIntegerRange } from 'sandstone/commands/validators'
import type { DamageTypeClass, Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

export class DamageCommandNode extends CommandNode {
  command = 'damage' as const
}

export class DamageCauseCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * @param cause Cause of the damage, in the case of indirect damage.
   */
  from = <T extends string>(cause: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>) => this.finalCommand(['from', targetParser(cause)])
}

export class DamageSourceCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * @param entity Entity inflicting the damage.
   */
  by = <T extends string>(entity: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>) =>
    this.subCommand(['by', targetParser(entity)], DamageCauseCommand, true)

  /**
   * Where the damage originated at (when no entity caused the damage).
   */
  at = (position: Macroable<Coordinates<MACRO>, MACRO>) => this.finalCommand(['at', coordinatesParser(position)])
}

export class DamageCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = DamageCommandNode

  /**
   * Deal damage to the specified entity.
   *
   * Applies direct damage that bypasses normal game damage calculations,
   * armor, and resistance effects. The damage is applied instantly and
   * can be attributed to specific sources for proper death messages.
   *
   * @param target The entity to damage. Must be a single entity selector.
   *              Examples: '@p', '@e[type=zombie, limit=1]', 'PlayerName'
   *
   * @param amount Damage amount to deal (0-1,000,000).
   *              Float values are allowed. 0 damage still triggers hit effects.
   *
   * @param damageType Optional damage type affecting death messages and game mechanics.
   *                  Defaults to generic damage if not specified.
   *
   * @returns DamageSourceCommand for chaining .by() or .at() attribution
   *
   * @example
   * ```ts
   * // Basic damage application
   * damage('@p', 10)                           // 10 generic damage
   * damage('@e[type=cow, limit=1]', 20, 'minecraft:player_attack')
   *
   * // Environmental damage
   * damage('@a[y=..10]', 5, 'minecraft:lava')  // Lava damage to underground players
   * damage('@e[type=!player]', 100, 'minecraft:void') // Void damage to mobs
   *
   * // Combat simulation
   * damage('@e[type=zombie]', 15, 'minecraft:arrow').by('@p') // Arrow shot by player
   * damage('@p', 8, 'minecraft:mob_attack').by('@e[type=skeleton, limit=1]')
   *
   * // Complex attribution
   * damage('@e[type=creeper]', 50, 'minecraft:explosion')
   *   .by('@e[type=tnt, limit=1]')
   *   .from('@p') // Player lit TNT that exploded creeper
   *
   * // Custom mechanics
   * damage('@a[scores={health=..5}]', 2, 'minecraft:magic') // Low health penalty
   * damage('@e[tag=boss]', 1000, 'minecraft:generic') // Instant boss kill
   * ```
   */
  damage = <T extends string>(
    target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
    amount: Macroable<number, MACRO>,
    damageType?: Macroable<Registry['minecraft:damage_type'] | DamageTypeClass, MACRO>,
  ) => {
    validateIntegerRange(amount, 'amount', 0, 1_000_000)
    return this.subCommand([targetParser(target), amount, damageType], DamageSourceCommand, true)
  }
}
