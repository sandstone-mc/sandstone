import { targetParser } from 'sandstone/variables/parsers.js'
import { validateIntegerRange } from 'sandstone/commands/validators.js'
import { CommandNode } from 'sandstone/core/nodes.js'

import { CommandArguments } from '../../helpers.js'

import type { MultiplePlayersArgument, SinglePlayerArgument } from 'sandstone/arguments/index.js'

export class ExperienceCommandNode extends CommandNode {
  // We always use the shorthand version for compactness purposes
  command = 'xp' as const
}

/** Adds, sets or removes player experience.  */
export class ExperienceCommand extends CommandArguments {
  protected NodeType = ExperienceCommandNode

  /**
   * Adds experience to the player(s).
   *
   * @param targets Specifies the target(s) of the command.
   *
   * @param amount
   * Specifies the amount of experience points or levels to give to the player.
   * Negative values remove experience instead of adding them.
   *
   * Must be between `-2147483648` and `2147483647` (inclusive).
   *
   * @param type
   * If `level`, adds levels of experience to the player.
   * If `points`, add points of experience to the player.
   *
   * If unspecified, defaults to `points`.
   */
  add = (targets: MultiplePlayersArgument, amount: number, type?: 'level' | 'points') => {
    validateIntegerRange(amount, 'amount', -2147483648, 2147483647)
    return this.finalCommand([targetParser(targets), amount, type])
  }

  /**
   * Sets the experience of the player(s).
   *
   * @param targets Specifies the target(s) of the command.
   *
   * @param amount
   * Specifies the amount of experience points or levels to be set to the player.
   *
   * Must be between `0` and `2147483647` (inclusive).
   *
   * @param type
   * If `level`, sets the levels of experience of the player.
   * If `points`, sets the points of experience of the player.
   *
   * If unspecified, defaults to `points`.
   */
  set = (targets: MultiplePlayersArgument, amount: number, type?: 'level' | 'points') => {
    validateIntegerRange(amount, 'amount', 0, 2147483647)
    return this.finalCommand([targets, amount, type])
  }

  /**
   * Queries the experience of the player.
   *
   * @param target Specifies the target of the command.
   *
   * @param type
   * If `level`, queries the levels of experience of the player.
   * If `points`, queries the points of experience of the player.
   *
   * If unspecified, defaults to `points`.
   */
  query = (target: SinglePlayerArgument, type?: 'level' | 'points') => this.finalCommand([target, type])
}
