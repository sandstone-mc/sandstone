import type { MultiplePlayersArgument } from '@arguments'
import { MultipleEntitiesArgument } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class Experience extends Command {
  @command(['experience', 'add'], { isRoot: true })
  add = (targets: MultiplePlayersArgument, amount: number, type?: 'level' | 'points') => { }

  @command(['experience', 'set'], { isRoot: true })
  set = (targets: MultiplePlayersArgument, amount: number, type?: 'level' | 'points') => { }

  @command(['experience', 'query'], { isRoot: true })
  query = (targets: MultiplePlayersArgument, type?: 'level' | 'points') => { }
}
