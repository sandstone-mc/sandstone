import type { MultiplePlayersArgumentOf, SinglePlayerArgumentOf } from 'sandstone/arguments'
import { validateIntegerRange } from 'sandstone/commands/validators'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

export class ExperienceCommandNode extends CommandNode {
  // We always use the shorthand version for compactness purposes
  command = 'xp' as const
}

export class ExperienceCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ExperienceCommandNode

  /**
   * Add experience to players.
   *
   * @param targets Player selector to give experience to.
   *               Examples: '@p', '@a', 'PlayerName'
   *
   * @param amount Experience amount to add. Negative values remove experience.
   *              Range: -2,147,483,648 to 2,147,483,647
   *
   * @param type Optional experience type: 'levels' or 'points'.
   *            Defaults to 'points' if not specified.
   *
   * @example
   * ```ts
   * experience.add('@p', 100)                 // Add 100 XP points
   * experience.add('@a', 5, 'levels')         // Add 5 XP levels
   * experience.add('@p', -50, 'points')       // Remove 50 XP points
   * ```
   */
  add = <T extends string>(
    targets: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
    amount: Macroable<number, MACRO>,
    type?: Macroable<'levels' | 'points', MACRO>,
  ) => {
    validateIntegerRange(amount, 'amount', -2147483648, 2147483647)
    return this.finalCommand(['add', targetParser(targets), amount, type])
  }

  /**
   * Set player experience to specific amount.
   *
   * @param targets Player selector to set experience for.
   * @param amount Experience amount to set. Range: 0 to 2,147,483,647
   * @param type Optional experience type: 'levels' or 'points'. Defaults to 'points'.
   *
   * @example
   * ```ts
   * experience.set('@p', 1000)              // Set to 1000 XP points
   * experience.set('@a', 30, 'levels')      // Set to level 30
   * ```
   */
  set = <T extends string>(
    targets: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>,
    amount: Macroable<number, MACRO>,
    type?: Macroable<'levels' | 'points', MACRO>,
  ) => {
    validateIntegerRange(amount, 'amount', 0, 2147483647)
    return this.finalCommand(['set', targets, amount, type])
  }

  /**
   * Get player's current experience.
   *
   * @param target Single player to query experience from.
   * @param type Optional experience type: 'levels' or 'points'. Defaults to 'points'.
   *
   * @example
   * ```ts
   * experience.query('@p')                  // Get XP points
   * experience.query('PlayerName', 'levels') // Get XP level
   * ```
   */
  query = <T extends string>(target: Macroable<SinglePlayerArgumentOf<MACRO, T>, MACRO>, type?: Macroable<'levels' | 'points', MACRO>) =>
    this.finalCommand(['query', target, type])
}
