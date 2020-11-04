import type { Tag } from '@resources'
import { Command } from '../Command'
import { command } from '../decorators'

export class FunctionCommand extends Command {
  @command('function', { isRoot: true })
  function = (functionName: string | Tag<'functions'>) => {}
}
