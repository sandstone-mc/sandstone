import type { McFunction } from '@datapack/Datapack'
import { Command } from '../Command'
import { command } from '../decorators'

export class FunctionCommand extends Command {
  @command('function', {
    isRoot: true, executable: true, registerArguments: false, hasSubcommands: true,
  })
  function: (
    ((functionName: string) => void) &
    ((mcFunction: McFunction<[]>) => void)
  ) = (func: string | McFunction<[]>) => {
    if (typeof func === 'string') {
      this.commandsRoot.arguments.push(func)
      this.commandsRoot.register()
    } else {
      func()
    }
  }
}
