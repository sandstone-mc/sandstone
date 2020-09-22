import type { McFunctionReturn } from '@datapack/Datapack'
import { Command } from '../Command'
import { command } from '../decorators'

export class FunctionCommand extends Command {
  @command('function', { isRoot: true })
  function = (functionName: string) => {}
}
