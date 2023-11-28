import { CommandNode, ContainerCommandNode } from 'sandstone/core/nodes'
import { makeCallable } from 'sandstone/utils'

import { CommandArguments, FinalCommandOutput } from '../../helpers.js'
import { FunctionCommandNode } from './function.js'

import type { SandstonePack } from 'sandstone'
import type { SandstoneCommands } from 'sandstone/commands'
import type { Macroable, MCFunctionNode } from 'sandstone/core'
import type { Node } from 'sandstone/core/nodes'

export class ReturnRunCommandNode extends ContainerCommandNode {
  command = 'return' as const

  /**
   * By default, the execute is treated as single (execute.run.stuff).
   * This is set to `false` if the execute is used as a function (execute.run(() => { stuff })).
   */
  isSingleExecute: boolean

  constructor(sandstonePack: SandstonePack, args: [...args: unknown[]] = [], {
    isSingleExecute = true,
    body = [] as Node[],
  } = {}) {
    super(sandstonePack, ...args)
    this.isSingleExecute = isSingleExecute
    this.append(...body)
  }

  getValue = () => {
    if (this.body.length > 1) {
      throw new Error('Return run nodes can only have one child node when toString is called.')
    }

    let command = this.body[0].getValue()

    if (command.startsWith('/')) {
      this.isMacro = true
      command = command.slice(1)
    }

    return `${this.isMacro ? '/' : ''}${this.command} run ${command}`
  }

  createMCFunction = (currentMCFunction: MCFunctionNode | null) => {
    if (this.isSingleExecute || !currentMCFunction) {
      return { node: this as ReturnRunCommandNode }
    }

    const namespace = currentMCFunction.resource.name.includes(':') ? `${currentMCFunction.resource.name.split(':')[0]}:` : ''

    // Create a new MCFunctionNode with the body of the ExecuteNode.
    const mcFunction = this.sandstonePack.MCFunction(`${namespace}${currentMCFunction.resource.path.slice(2).join('/')}/return_run`, {
      addToSandstoneCore: false,
      creator: 'sandstone',
      onConflict: 'rename',
    })
    const mcFunctionNode = mcFunction['node']
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

  /*
   * Run a command and return its result.
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

    return makeCallable(commands, (callback: () => any) => {
      node.isSingleExecute = false
      this.sandstoneCore.insideContext(node, callback, true)
      return new FinalCommandOutput(node)
    }, true)
  }

  fail = () => this.finalCommand(['fail'])
}

export class ReturnCommandNode extends CommandNode {
  command = 'return' as const
}

export class ReturnCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ReturnCommandNode

  get return() {
    const run = new ReturnArgumentsCommand<MACRO>(this.sandstonePack)

    return makeCallable(run, (value?: Macroable<number, MACRO>) => this.finalCommand([value || 0]), true)
  }
}
