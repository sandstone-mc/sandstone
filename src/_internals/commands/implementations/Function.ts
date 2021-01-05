import { Command } from '../Command'
import { command } from '../decorators'

import type { Tag } from '@resources'

export class FunctionCommand extends Command {
  @command('function', { isRoot: true })
  function = (functionName: string | Tag<'functions'>) => {}
}
