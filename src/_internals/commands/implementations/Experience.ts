import { SelectorArgument } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class Experience extends Command {
  @command(['experience', 'add'], { isRoot: true })
  add = (targets: SelectorArgument<false>, amount: number, type?: 'level' | 'points') => {}

  @command(['experience', 'set'], { isRoot: true })
  set = (targets: SelectorArgument<false>, amount: number, type?: 'level' | 'points') => {}

  @command(['experience', 'query'], { isRoot: true })
  query = (targets: SelectorArgument<false>, type?: 'level' | 'points') => {}
}
