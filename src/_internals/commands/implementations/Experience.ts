import { MultipleEntitiesArgument } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class Experience extends Command {
  @command(['experience', 'add'], { isRoot: true })
  add = (targets: MultipleEntitiesArgument, amount: number, type?: 'level' | 'points') => {}

  @command(['experience', 'set'], { isRoot: true })
  set = (targets: MultipleEntitiesArgument, amount: number, type?: 'level' | 'points') => {}

  @command(['experience', 'query'], { isRoot: true })
  query = (targets: MultipleEntitiesArgument, type?: 'level' | 'points') => {}
}
