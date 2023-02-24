import { toMinecraftResourceName } from 'sandstone/utils'
import { ContainerCommandNode } from '#core'
import { MCFunctionClass, TagClass } from '#core/resources'

import { CommandArguments } from '../../helpers'

import type { TimeArgument } from '#arguments'
import type { Node } from '#core'
import type { MCFunctionNode } from '#core/resources'

type ScheduledFunction = string | TagClass<'functions'> | MCFunctionClass | (() => (void | Promise<void>))

export class ScheduleCommandNode extends ContainerCommandNode<
  ['clear', string | MCFunctionClass] | ['function', MCFunctionClass | string | undefined, TimeArgument, ScheduleType | undefined]
> {
  command = 'schedule' as const

  override createMCFunction: (currentMCFunction: MCFunctionNode | null) => { node: Node | Node[]; mcFunction?: MCFunctionNode | undefined } = (currentMCFunction) => {
    if (this.body.length === 0 || this.args[0] === 'clear' || !currentMCFunction) {
      return { node: this }
    }

    const [_, func, time, append] = this.args

    if (typeof func !== 'string' && func !== undefined) {
      throw new Error('Cannot have something else than a string as the argument for a scheduled function with callback')
    }

    // Create a new MCFunctionNode with the body of the ExecuteNode.
    const mcFunction = new MCFunctionClass(this.sandstoneCore, `${toMinecraftResourceName(currentMCFunction.resource.path)}/${func ?? 'schedule'}`, {
      addToSandstoneCore: false,
      creator: 'sandstone',
      onConflict: 'rename',
    })
    const mcFunctionNode = mcFunction['node']
    mcFunctionNode.body = this.body
    this.body = []

    // Return an execute calling this MCFunction.
    this.args = ['function', mcFunction.name, time, append]
    return { node: this, mcFunction: mcFunctionNode }
  }
}

export type ScheduleType = 'append' | 'replace'

export class ScheduleCommand extends CommandArguments<typeof ScheduleCommandNode> {
  protected NodeType = ScheduleCommandNode

  /**
   * Removes a scheduled function.
   *
   * @param functionName Specify the scheduled function or `MCFunction` to be cleared.
   *
   */
  clear = (func: MCFunctionClass | string | TagClass<'functions'>) => {
    const result = this.finalCommand(['clear', func instanceof TagClass ? func.name : func])
    return result
  }

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
  function = (func: ScheduledFunction, delay: TimeArgument, type?: ScheduleType) => {
    const node = this.getNode()

    if (func instanceof MCFunctionClass) {
      return this.finalCommand(['function', func.name, delay, type], node)
    }
    // A callback has been given
    if (typeof func === 'function') {
      this.sandstoneCore.insideContext(node, func as () => void | Promise<void>, false)
      return this.finalCommand(['function', undefined, delay, type], node)
    }

    if (func instanceof TagClass) {
      return this.finalCommand(['function', func.name, delay, type], node)
    }

    return this.finalCommand(['function', func, delay, type], node)
  }
}
