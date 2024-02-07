import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

import type { DIFFICULTIES } from 'sandstone/arguments'

export class DifficultyCommandNode extends CommandNode {
  command = 'difficulty' as const
}

export class DifficultyCommand extends CommandArguments {
  protected NodeType = DifficultyCommandNode

  /**
   * Sets the new difficulty level. Must be one of the following:
   * - `peaceful` for peaceful difficulty
   * - `easy` for easy difficulty
   * - `normal` for normal difficulty
   * - `hard` for hard difficulty
   *
   * If unspecified, querys current difficulty rather than changes it.‌
   */
  difficulty = (difficulty?: DIFFICULTIES) => this.finalCommand([difficulty])
}
