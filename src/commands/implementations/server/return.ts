import type { SandstonePack } from 'sandstone'
import type { SandstoneCommands } from 'sandstone/commands'
import type { Macroable, MCFunctionNode } from 'sandstone/core'
import type { Node } from 'sandstone/core/nodes'
import { CommandNode, ContainerCommandNode } from 'sandstone/core/nodes'
import { makeCallable } from 'sandstone/utils'
import { CommandArguments, FinalCommandOutput } from '../../helpers'
import { FunctionCommandNode } from './function'

export class ReturnRunCommandNode extends ContainerCommandNode {
  command = 'return' as const

  /**
   * By default, the execute is treated as single (execute.run.stuff).
   * This is set to `false` if the execute is used as a function (execute.run(() => { stuff })).
   */
  isSingleExecute: boolean

  constructor(
    sandstonePack: SandstonePack,
    args: [...args: unknown[]] = [],
    { isSingleExecute = true, body = [] as Node[] } = {},
  ) {
    super(sandstonePack, ...args)
    this.isSingleExecute = isSingleExecute
    this.append(...body)
  }

  getValue = () => {
    if (this.body.length > 1) {
      throw new Error('Return run nodes can only have one child node when toString is called.')
    }

    let command = this.body[0].getValue()

    if (command.startsWith('$')) {
      this.isMacro = true
      command = command.slice(1)
    }

    return `${this.isMacro ? '$' : ''}${this.command} run ${command}`
  }

  createMCFunction = (currentMCFunction: MCFunctionNode | null) => {
    if (this.isSingleExecute || !currentMCFunction) {
      return { node: this as ReturnRunCommandNode }
    }

    const namespace = currentMCFunction.resource.name.includes(':')
      ? `${currentMCFunction.resource.name.split(':')[0]}:`
      : ''

    // Create a new MCFunctionNode with the body of the ExecuteNode.
    const mcFunction = this.sandstonePack.MCFunction(
      `${namespace}${currentMCFunction.resource.path.slice(2).join('/')}/return_run`,
      {
        addToSandstoneCore: false,
        creator: 'sandstone',
        onConflict: 'rename',
      },
    )
    const mcFunctionNode = mcFunction.node
    mcFunctionNode.body = this.body

    // Return an execute calling this MCFunction.
    const mcFunctionCall = new FunctionCommandNode(this.sandstonePack, mcFunction)
    this.body = [mcFunctionCall]

    return { node: this as ReturnRunCommandNode, mcFunction: mcFunctionNode }
  }

  append = (...nodes: Node[]) => {
    for (const node of nodes) {
      this.body.push(node)

      if (this.isSingleExecute) {
        this.sandstoneCore.getCurrentMCFunctionOrThrow().exitContext()
      }
    }
    return (nodes.length === 1 ? nodes[0] : nodes) as any
  }
}

export class ReturnArgumentsCommand<MACRO extends boolean> extends CommandArguments<typeof ReturnRunCommandNode> {
  protected NodeType = ReturnRunCommandNode

  /**
   * Execute a command and return its result value.
   * 
   * This allows functions to return specific values based on command execution results.
   * The returned value can be used by the caller for conditional logic or stored in objectives.
   * 
   * Can be used in two ways:
   * - Chain with other commands: return.run.say('hello')
   * - With a callback function: return.run(() => { commands })
   * 
   * @example
   * return.run.execute.if.score('@p', 'health').matches([1, 10]).run.return(1)
   */
  get run() {
    const node = this.getNode()

    const commands = new Proxy(this.sandstonePack.commands as SandstoneCommands<MACRO>, {
      get: (target, p, receiver) => {
        // The context will automatically be exited by the node itself
        this.sandstoneCore.getCurrentMCFunctionOrThrow().enterContext(node)
        return (this.sandstonePack.commands as any)[p]
      },
    })

    return makeCallable(
      commands,
      (callback: () => any) => {
        node.isSingleExecute = false
        this.sandstoneCore.insideContext(node, callback, true)
        return new FinalCommandOutput(node)
      },
      true,
    )
  }
}

export class ReturnCommandNode extends CommandNode {
  command = 'return' as const
}

export class ReturnCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ReturnCommandNode

  /**
   * Return from a function with a specific value or failure state.
   * 
   * Functions normally return 1 when successful. This command allows returning
   * custom values or indicating failure. The return value can be captured by
   * the caller using `execute store result`.
   * 
   * @param value Optional integer value to return (0-2147483647). Defaults to 0 if not specified.
   *              Higher values typically indicate better success or more significant results.
   * 
   * @example
   * ```ts
   * // Return success with a specific value
   * return.return(42)
   * 
   * // Return default value (0)
   * return.return()
   * 
   * // Return based on conditions
   * execute.if.entity('@p[tag=vip]').run.return(100)  // VIP bonus
   * execute.unless.entity('@p[tag=vip]').run.return(50) // Regular bonus
   * ```
   */
  get return() {
    const run = new ReturnArgumentsCommand<MACRO>(this.sandstonePack)

    return makeCallable(
      {
        run: run.run,
        fail: this.fail,
      },
      (value?: Macroable<number, MACRO>) => this.finalCommand([value || 0]),
      true,
    )
  }

  /**
   * Return from a function with a failure state.
   * 
   * Immediately exits the function and returns 0, indicating failure.
   * This is equivalent to `return.return(0)` but more semantically clear
   * when you want to explicitly indicate failure.
   * 
   * Useful for error handling and early exits when conditions aren't met.
   * 
   * @example
   * ```ts
   * // Early exit on invalid conditions
   * execute.unless.entity('@p').run.return.fail() // No player found
   * 
   * // Validation check
   * execute.if.score('@p', 'level').matches([..0]).run.return.fail() // Invalid level
   * 
   * // Error handling
   * execute.unless.block('~ ~ ~', 'minecraft:chest').run.return.fail() // Expected chest not found
   * ```
   */
  fail = () => this.finalCommand(['fail'])
}
