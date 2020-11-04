import type { LiteralUnion } from '@/generalTypes'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import type { McFunctionReturn } from '@datapack/Datapack'
import { Tag } from '@resources'
import { FunctionCommand } from './Function'

export class Schedule extends Command {
  @command(['schedule', 'clear'], {
    isRoot: true, executable: true, registerArguments: false, hasSubcommands: true,
  })
  clear: (
    (
      /**
       * Removes a scheduled function.
       *
       * --------------------------------------------------
       * ⚠️ The prefered way is using:
       * ```
       * const myFunction = mcfunction(...)
       * myFunction.clearSchedule()
       * ```
       *
       * @param functionName Specify the scheduled function to be cleared.
       *
       */
      (functionName: string | Tag<'functions'>) => void
    ) & (
      /**
       * Removes a scheduled function.
       *
       * --------------------------------------------------
       * ⚠️ The prefered way is using:
       * ```
       * const myFunction = mcfunction(...)
       * myFunction.clearSchedule()
       * ```
       *
       * @param mcFunction Specify the scheduled `mcfunction` to be cleared.
       *
       * @param args Specify the arguments of the parametrized `mcfunction` to clear.
       */
      <T extends any[]>(mcFunction: McFunctionReturn<T>, ...args: T) => void
    )
  ) = (func: McFunctionReturn<any> | string | Tag<'functions'>, ...args: any[]) => {
    if (typeof func === 'string' || func instanceof Tag) {
      this.commandsRoot.addAndRegister('schedule', 'clear', func)
    } else {
      func.clearSchedule(...args)
    }
  }

  @command(['schedule', 'function'], {
    isRoot: true, executable: true, registerArguments: false, hasSubcommands: true,
  })
  function: (
    (
      /**
       * Delays the execution of a function. Executes the function after specified amount of time passes.
       *
       * --------------------------------------------------
       * ⚠️ The prefered way is using:
       * ```
       * const myFunction = mcfunction(...)
       * myFunction.schedule('2s', 'append')
       * ```
       *
       * @param functionName Specify the function to be scheduled.
       *
       * @param delay Specify the delay time.
       *
       * Must be a time in Minecraft. It must be a single-precision floating point number suffixed with a unit. Units include:
       * - d: an in-game day, 24000 gameticks;
       * - s: a second, 20 gameticks;
       * - t (default and omitable): a single gametick; the default unit.
       *
       * The time is set to the closest integer tick after unit conversion. For example. .5d is same as 12000 ticks.
       *
       * @param type
       * `replace` simply replaces the current function's schedule time. `append` allows multiple schedules to exist at different times.
       * If unspecified, defaults to `replace`.
       */
      (functionName: string | Tag<'functions'>, delay: number | LiteralUnion<'1t' | '1s' | '1d'>, type?: 'append' | 'replace') => void
    ) & (
      /**
       * Delays the execution of a function. Executes the function after specified amount of time passes.
       *
       * --------------------------------------------------
       * ⚠️ The prefered way is using:
       * ```
       * const myFunction = mcfunction(...)
       * myFunction.schedule('2s', 'append')
       * ```
       *
       * @param mcFunction Specify the `mcfunction` to be scheduled.
       *
       * @param delay Specify the delay time.
       *
       * Must be a time in Minecraft. It must be a single-precision floating point number suffixed with a unit. Units include:
       * - d: an in-game day, 24000 gameticks;
       * - s: a second, 20 gameticks;
       * - t (default and omitable): a single gametick; the default unit.
       *
       * The time is set to the closest integer tick after unit conversion. For example. .5d is same as 12000 ticks.
       *
       * @param type
       * `replace` simply replaces the current function's schedule time. `append` allows multiple schedules to exist at different times.
       * If unspecified, defaults to `replace`.
       *
       * @param args Specify the arguments to call the `mcfunction` with.
       */
      <T extends unknown[]>(mcFunction: McFunctionReturn<T>, delay: number | LiteralUnion<'1t' | '1s' | '1d'>, type?: 'append' | 'replace', ...args: T) => void
    )
  ) = (func: string | McFunctionReturn<any> | Tag<'functions'>, delay: unknown, type?: 'append' | 'replace', ...args: unknown[]) => {
    if (typeof func === 'string' || func instanceof Tag) {
      this.commandsRoot.arguments.push('schedule', 'function', func, delay, type, ...args)
      this.commandsRoot.register()
    } else {
      func.schedule(delay as string, type, ...args)
    }
  }
}
