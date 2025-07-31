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
   * Removes a scheduled function.
   *
   * @param functionName Specify the scheduled function or `MCFunction` to be cleared.
   *
   */
  clear = (func: Macroable<MCFunctionClass<any, any> | string | TagClass<'functions'>, MACRO>) => {
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
