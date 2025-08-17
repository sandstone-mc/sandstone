/* eslint-disable max-len */

import type { GAMERULES } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import { CommandArguments } from '../../helpers.js'

// Gamerule command

export class GameRuleCommandNode extends CommandNode {
  command = 'gamerule' as const
}

export class GameRuleCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = GameRuleCommandNode

  /**
   * Set or query game rules.
   *
   * @param gamerule Game rule to modify or query.
   *                Common rules: 'keepInventory', 'doDaylightCycle', 'doMobSpawning',
   *                'mobGriefing', 'randomTickSpeed', 'showDeathMessages'
   *
   * @param value Optional value to set. If not specified, queries current value.
   *             Boolean rules: true/false
   *             Numeric rules: integer >= 0
   *
   * @example
   * ```ts
   * gamerule('keepInventory')              // Query current value
   * gamerule('keepInventory', true)        // Enable keep inventory
   * gamerule('randomTickSpeed', 10)        // Set tick speed to 10
   * gamerule('doDaylightCycle', false)     // Stop day/night cycle
   * ```
   */
  gamerule = (gamerule: Macroable<LiteralUnion<GAMERULES>, MACRO>, value?: Macroable<boolean | number, MACRO>) =>
    this.finalCommand([gamerule, value])
}
