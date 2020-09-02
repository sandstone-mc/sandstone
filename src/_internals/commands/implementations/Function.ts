import type { McFunctionReturn } from '@datapack/Datapack'
import { Command } from '../Command'
import { command } from '../decorators'

export class FunctionCommand extends Command {
  @command('function', {
    isRoot: true, executable: true, registerArguments: false, hasSubcommands: true,
  })
  function: (
    ((functionName: string) => void) &
    ((mcFunction: McFunctionReturn<[]>) => void)
  ) = (func: string | McFunctionReturn<[]>) => {
    if (typeof func === 'string') {
      this.commandsRoot.addAndRegister(func)
    } else {
      func()
    }
  }
}
