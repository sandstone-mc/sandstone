import { LiteralUnion } from '@/generalTypes'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { McFunctionReturn } from '@datapack/Datapack'

export class Schedule extends Command {
  // set clear & function
  @command(['schedule', 'clear'], {
    isRoot: true, executable: true, registerArguments: false, hasSubcommands: true,
  })
  clear: (
    (<T extends any[]>(mcfunction: McFunctionReturn<T>, ...args: T) => void) &
    ((functionName: string) => void)
  ) = (func: McFunctionReturn<any> | string, ...args: any[]) => {
    if (typeof func === 'string') {
      this.commandsRoot.addAndRegister('schedule', 'clear', func)
    } else {
      func.clearSchedule(...args)
    }
  }

  @command(['schedule', 'function'], {
    isRoot: true, executable: true, registerArguments: false, hasSubcommands: true,
  })
  function: (
    ((functionName: string, delay: number | LiteralUnion<'1t' | '1s' | '1d'>, type?: 'append' | 'replace') => void) &
    (<T extends any[]>(mcFunction: McFunctionReturn<[]>, delay: number | LiteralUnion<'1t' | '1s' | '1d'>, type?: 'append' | 'replace', ...args: T) => void)
  ) = (func: string | McFunctionReturn<any>, delay: number | string, type?: 'append' | 'replace', ...args: any[]) => {
    if (typeof func === 'string') {
      this.commandsRoot.arguments.push('schedule', 'function', func, delay, type, ...args)
      this.commandsRoot.register()
    } else {
      func.schedule(delay, type, ...args)
    }
  }
}
