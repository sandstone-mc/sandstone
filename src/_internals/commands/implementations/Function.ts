import { Command } from '../Command'
import { command } from '../decorators'

import type { TagClass } from '@resources'

export class FunctionCommand extends Command {
  @command('function', { isRoot: true })
  function = (functionName: string | TagClass<'functions'>) => {}
}
