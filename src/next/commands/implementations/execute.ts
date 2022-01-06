import { ContainerCommandNode } from '@/next/core/nodes'

import { CommandArguments, FinalCommandOutput } from '../helpers'

import type { CommandNode, Node } from '@/next/core/nodes'
import type { SandstoneCore } from '@/next/core/sandstoneCore'
import type { SandstoneCommands } from '../commands'

export class ExecuteNode extends ContainerCommandNode<[[subcommand: string, ...args: unknown[]]]> {
  command = 'execute' as const

  /**
   * By default, the execute is treated as single (execute.run.stuff).
   * This is set to `false` if the execute is used as a function (execute.run(() => { stuff })).
   */
  isSingleExecute = true

  append = (node: Node) => {
    this.body.push(node)

    if (this.isSingleExecute) {
      this.sandstoneCore.getCurrentMCFunctionOrThrow().exitContext()
    }

    return node
  }

  toString = () => {
    if (this.body.length > 1) {
      throw new Error('Execute nodes can only have one child node when toString is called.')
    }

    // This will be the execute string without "run"
    const executeString = super.toString()
    if (this.body.length === 0) {
      return executeString
    }

    return `${executeString} run ${this.body[0].toString()}`
  }
}

export class ExecuteCommand extends CommandArguments<typeof ExecuteNode> {
  NodeType = ExecuteNode

  constructor(sandstoneCore: SandstoneCore, previousNode: CommandNode<unknown[]> | undefined, protected sandstoneCommands: SandstoneCommands) {
    super(sandstoneCore, previousNode)
  }

  as = (targets: string) => this.command(ExecuteCommand, true, ['as', targets], [this.sandstoneCommands])

  at = (location: string) => this.command(ExecuteCommand, true, ['at', location], [this.sandstoneCommands])

  if = (condition: string) => this.command(ExecuteCommand, true, ['if', condition], [this.sandstoneCommands])

  unless = (condition: string) => this.command(ExecuteCommand, true, ['unless', condition], [this.sandstoneCommands])

  get run() {
    const node = this.getNode()

    this.sandstoneCore.getCurrentMCFunctionOrThrow().enterContext(node, false)

    return Object.assign((callback: () => void) => {
      node.isSingleExecute = false
      callback()
      this.sandstoneCore.getCurrentMCFunctionOrThrow().exitContext()
      return new FinalCommandOutput(node)
    }, this.sandstoneCommands)
  }
}
