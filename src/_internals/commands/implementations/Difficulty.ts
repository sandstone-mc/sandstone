import { DIFFICULTIES } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class Difficulty extends Command {
  @command('difficulty', { isRoot: true })
  difficulty = (difficulty: DIFFICULTIES) => {}
}
