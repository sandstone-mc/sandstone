import type { TimeArgument } from 'sandstone/arguments'
import type { Macroable, Node } from 'sandstone/core'
import { ContainerCommandNode } from 'sandstone/core/nodes'
import type { MCFunctionClass, MCFunctionNode } from 'sandstone/core/resources/datapack/index'
import { TagClass } from 'sandstone/core/resources/datapack/tag'
import { toMinecraftResourceName } from 'sandstone/utils'
import { CommandArguments } from '../../helpers.js'

type ScheduledFunction = string | TagClass<'functions'> | MCFunctionClass<any, any> | (() => any | Promise<any>)

export class ScheduleCommandNode extends ContainerCommandNode {
  command = 'schedule' as const

  override createMCFunction: (currentMCFunction: MCFunctionNode | null) => {
    node: Node | Node[]
    mcFunction?: MCFunctionNode | undefined
  } = (currentMCFunction) => {
    if (this.body.length === 0 || this.args[0] === 'clear' || !currentMCFunction) {
      return { node: this }
    }

    const [_, func, time, append] = this.args

    if (typeof func !== 'string' && func !== undefined) {
      throw new Error('Cannot have something else than a string as the argument for a scheduled function with callback')
    }

    // Create a new MCFunctionNode with the body of the ExecuteNode.
    const mcFunction = this.sandstonePack.MCFunction(
      `${toMinecraftResourceName(currentMCFunction.resource.path)}/${func ?? 'schedule'}`,
      {
        addToSandstoneCore: false,
        creator: 'sandstone',
        onConflict: 'rename',
      },
    )
    const mcFunctionNode = mcFunction.node
    mcFunctionNode.body = this.body
    this.body = []

    // Return an execute calling this MCFunction.
    this.args = ['function', mcFunction.name, time, append]
    return { node: this, mcFunction: mcFunctionNode }
  }
}

export type ScheduleType = 'append' | 'replace'

export class ScheduleCommand<MACRO extends boolean> extends CommandArguments<typeof ScheduleCommandNode> {
  protected NodeType = ScheduleCommandNode

  /**
   * Cancel a scheduled function.
   *
   * @param func Function name, MCFunction, or function tag to unschedule.
   *            Examples: 'minecraft:my_timer', myFunction, '#mypack:timers'
   *
   * @example
   * ```ts
   * schedule.clear('minecraft:my_timer')     // Cancel scheduled function
   * schedule.clear(myScheduledFunction)      // Cancel Sandstone function
   * ```
   */
  clear = (func: Macroable<MCFunctionClass<any, any> | string | TagClass<'functions'>, MACRO>) => {
    const result = this.finalCommand(['clear', func instanceof TagClass ? func.name : func])
    return result
  }

  /**
   * Schedule function execution after a delay.
   *
   * @param func Function to schedule. Can be name, MCFunction, tag, or callback.
   *            Examples: 'minecraft:timer', myFunction, '#mypack:events', () => {...}
   *
   * @param delay Time delay before execution.
   *             Examples: '5s' (5 seconds), '100t' (100 ticks), '1d' (1 day)
   *
   * @param type Optional scheduling mode: 'replace' or 'append'.
   *            'replace' cancels existing schedules, 'append' allows multiple.
   *            Defaults to 'replace'.
   *
   * @example
   * ```ts
   * schedule.function('minecraft:timer', '30s')          // Schedule in 30 seconds
   * schedule.function(myFunction, '100t', 'append')      // Schedule in 100 ticks
   * schedule.function(() => { say('Hello!') }, '5s')     // Schedule callback
   * ```
   */
  function = (
    func: Macroable<ScheduledFunction, MACRO>,
    delay: Macroable<TimeArgument, MACRO>,
    type?: Macroable<ScheduleType, MACRO>,
  ) => {
    const node = this.getNode()

    if (typeof func === 'object' && Object.hasOwn(func, 'addToTag')) {
      return this.finalCommand(['function', (func as unknown as MCFunctionClass<any, any>).name, delay, type], node)
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
