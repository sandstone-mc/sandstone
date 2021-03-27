import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { toMCFunctionName } from '@datapack/minecraft'
import { TagInstance } from '@resources/Tag'

import type { TimeArgument } from 'src/arguments'
import type { MCFunctionInstance } from '@datapack/Datapack'

function isMCFunctionInstance(callback: () => (void | Promise<void>)): callback is MCFunctionInstance {
  return Object.prototype.hasOwnProperty.call(callback, 'datapack')
}

type ScheduledFunction = string | TagInstance<'functions'> | MCFunctionInstance | (() => (void | Promise<void>))

export type ScheduleFunction = (
  (
    /**
     * Delays the execution of a function. Executes the function after specified amount of time passes.
     *
     * @param functionName Specify the function, the `MCFunction` or the callback to be scheduled.
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
    (functionName: ScheduledFunction, delay: TimeArgument, type?: 'append' | 'replace') => void
  ) & (
    /**
     * Delays the execution of a named callback. Executes the function after specified amount of time passes.
     *
     * @param mcFunction Specify the `MCFunction` to be scheduled.
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
    (callbackName: string, callback: (() => (void | Promise<void>)), delay: TimeArgument, type?: 'append' | 'replace') => void
  )
)

export type ClearScheduleFunction = (
  (
    /**
     * Removes a scheduled function.
     *
     * @param functionName Specify the scheduled function or `MCFunction` to be cleared.
     *
     */
    (functionName: string | TagInstance<'functions'> | MCFunctionInstance) => void
  )
)

export class Schedule extends Command {
  @command(['schedule', 'clear'], {
    isRoot: true, executable: true, registerArguments: false, hasSubcommands: true,
  })
  clear: ClearScheduleFunction = (func: MCFunctionInstance<any> | string | TagInstance<'functions'>) => {
    if (typeof func === 'string' || func instanceof TagInstance) {
      this.commandsRoot.addAndRegister('schedule', 'clear', func)
    } else {
      func.schedule.clear()
    }
  }

  @command(['schedule', 'function'], {
    isRoot: true, executable: true, registerArguments: false, hasSubcommands: true,
  })
  function: ScheduleFunction = (...args: unknown[]) => {
    const datapack = this.commandsRoot.Datapack

    const scheduleCallback = (name: string, callback: () => (void | Promise<void>), delay: TimeArgument, type: 'append' | 'replace', asChild: boolean) => {
      datapack.createCallbackMCFunction(name, callback, asChild).schedule(delay, type)
    }

    // If a callback with a name has been given, create a root function & schedule it
    if (typeof args[0] === 'string' && typeof args[1] === 'function') {
      const [callbackName, callback, delay, type] = args
      scheduleCallback(callbackName, callback as () => (void | Promise<void>), delay as TimeArgument, type as 'append' | 'replace', false)
      return
    }

    const [func, delay, type] = args as [ScheduledFunction, TimeArgument, 'append' | 'replace']

    if (typeof func === 'string' || func instanceof TagInstance) {
      // If a string/tag has been given simply schedule it
      this.commandsRoot.arguments.push('schedule', 'function', func, delay, type)
      this.commandsRoot.register()
    } else if (isMCFunctionInstance(func)) {
      // If a MCFunction has been given, use the builtin schedule
      func.schedule(delay as string, type as any)
    } else {
      // If a nameless callback has been given, create a child function & schedule it
      scheduleCallback('_schedule', func as () => (void | Promise<void>), delay, type, true)
    }
  }
}
