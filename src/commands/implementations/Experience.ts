import { MultipleEntitiesArgument } from 'src/arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { validateIntegerRange } from '@commands/validators'

import type { MultiplePlayersArgument, SinglePlayerArgument } from 'src/arguments'

/** Adds, sets or removes player experience.  */
export class Experience extends Command {
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
  @command(['xp', 'add'], { isRoot: true })
  add = (targets: MultiplePlayersArgument, amount: number, type?: 'level' | 'points') => {
    validateIntegerRange(amount, 'amount', -2147483648, 2147483647)
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
  @command(['xp', 'set'], { isRoot: true })
  set = (targets: MultiplePlayersArgument, amount: number, type?: 'level' | 'points') => {
    validateIntegerRange(amount, 'amount', 0, 2147483647)
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
  @command(['xp', 'query'], { isRoot: true })
  query = (target: SinglePlayerArgument, type?: 'level' | 'points') => { }
}
