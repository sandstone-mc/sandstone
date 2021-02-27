import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

import type { DIFFICULTIES } from '@arguments'

export class Difficulty extends Command {
  /**
   * Sets the new difficulty level. Must be one of the following:
   * - `peaceful` for peaceful difficulty
   * - `easy` for easy difficulty
   * - `normal` for normal difficulty
   * - `hard` for hard difficulty
   *
   * If unspecified, querys current difficulty rather than changes it.‌
   */
  @command('difficulty', { isRoot: true })
  difficulty = (difficulty?: DIFFICULTIES) => {}
}
