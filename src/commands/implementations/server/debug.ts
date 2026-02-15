import { ContainerCommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers'
import { TagClass } from 'sandstone/core/resources/datapack/tag'
import type { Macroable, MCFunctionClass, MCFunctionNode, Node } from 'sandstone/core'

type DebugFunction = string | TagClass<'function'> | MCFunctionClass<any, any> | (() => any | Promise<any>)

export class DebugCommandNode extends ContainerCommandNode {
  command = 'debug' as const

  override createMCFunction: (currentMCFunction: MCFunctionNode | null) => {
    node: Node | Node[]
    mcFunction?: MCFunctionNode | undefined
  } = (currentMCFunction) => {
    if (this.body.length === 0 || this.args[0] === 'start' || this.args[0] === 'stop' || !currentMCFunction) {
      return { node: this }
    }

    const [_, func] = this.args

    if (typeof func !== 'string' && func !== undefined) {
      throw new Error('Cannot have something else than a string as the argument for a debug function with callback')
    }

    // Create a new MCFunctionNode with the body of the ExecuteNode.
    const mcFunction = this.sandstonePack.MCFunction(
      `${currentMCFunction.resource.name}/${func ?? 'debug'}`,
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
    this.args = ['function', mcFunction.name]
    return { node: this, mcFunction: mcFunctionNode }
  }
}

export class DebugCommand<MACRO extends boolean> extends CommandArguments<typeof DebugCommandNode> {
  protected NodeType = DebugCommandNode

  /**
   * Start debug profiling session.
   *
   * @example
   * ```ts
   * debug.start()    // Begin profiling
   * ```
   */
  start = () => this.finalCommand(['start'])

  /**
   * Stop debug profiling session.
   *
   * @example
   * ```ts
   * debug.stop()     // End profiling and save results
   * ```
   */
  stop = () => this.finalCommand(['stop'])

  /**
   * Debug function execution.
   *
   * @param func Function to debug. Can be name, MCFunction, tag, or callback.
   *            Examples: 'minecraft:timer', myFunction, '#mypack:events', () => {...}
   *
   * @example
   * ```ts
   * debug.function('minecraft:timer')
   * debug.function(myFunction)
   * debug.function(() => { say('Hello!') })
   * ```
   */
  function(func: Macroable<DebugFunction, MACRO>) {
    const node = this.getNode()

    if (typeof func === 'object' && Object.hasOwn(func, 'addToTag')) {
      return this.finalCommand(['function', (func as unknown as MCFunctionClass<any, any>).name], node)
    }
    // A callback has been given
    if (typeof func === 'function') {
      this.sandstoneCore.insideContext(node, func as () => void | Promise<void>, false)
      return this.finalCommand(['function', undefined], node)
    }

    if (func instanceof TagClass) {
      return this.finalCommand(['function', func.name], node)
    }

    return this.finalCommand(['function', func], node)
  }
}
