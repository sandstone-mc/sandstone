import type { SandstonePack } from 'sandstone/pack'
import type { LoopArgument, MacroArgument } from 'sandstone/variables'
import type { MCFunctionClass, MCFunctionNode } from './resources/datapack/index.js'
import type { SandstoneCore } from './sandstoneCore.js'

export abstract class Node {
  constructor(public sandstoneCore: SandstoneCore) { }

  abstract getValue(): any
}

/**
 * A node that includes other nodes.
 */
export abstract class ContainerNode extends Node {
  body: Node[]

  constructor(sandstoneCore: SandstoneCore) {
    super(sandstoneCore)
    this.body = []
  }

  /**
   * Appends a node at the end of this node's body.
   */
  append<NODE extends Node>(node: NODE): NODE

  /**
   * Appends several nodes at the end of this node's body.
   */
  append<NODES extends Node[]>(...nodes: NODES): NODES

  append(...nodes: Node[]) {
    this.body.push(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }

  /**
   * Prepends a node to the beginning of this node's body.
   */
  prepend<NODE extends Node>(node: NODE): NODE

  /**
   * Prepends several nodes to the beginning of this node's body.
   */
  prepend<NODES extends Node[]>(...nodes: NODES): NODES

  prepend(...nodes: Node[]) {
    this.body.unshift(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }
}

/**
 * A node that represents a generic command.
 */
export abstract class CommandNode<ARGS extends unknown[] = unknown[]> extends Node {
  abstract command: string

  args: ARGS

  commited = false

  constructor(public sandstonePack: SandstonePack, ...args: ARGS) {
    super(sandstonePack.core)
    this.args = args
  }

  getValue() {
    let isMacro = false

    const filteredArgs: unknown[] = []

    for (const arg of this.args) {
      if (arg !== undefined && arg !== null) {
        // Yes these are cursed, unfortunately, there's not really a better way to do this as visitors only visit the root nodes.
        if (typeof arg === 'object') {
          if (Object.hasOwn(arg, 'toMacro') && (arg as MacroArgument)['local'].has(this.sandstoneCore.currentNode)) {
            isMacro = true

            filteredArgs.push((arg as MacroArgument).toMacro())
          } else if (Object.hasOwn(arg, 'toLoop')) {
            filteredArgs.push((arg as LoopArgument).toLoop())
          } else {
            filteredArgs.push(arg)
          }
        } else {
          filteredArgs.push(arg)
        }
      }
    }

    return `${isMacro ? '/' : ''}${this.command} ${filteredArgs.join(' ')}`
  }

  /**
   * Commits the command to the current MCFunction context.
   */
  commit() {
    if (this.commited) {
      return this
    }
    this.commited = true

    return this.sandstonePack.appendNode(this)
  }
}

/**
 * A node that includes other nodes.
 */
export abstract class ContainerCommandNode<ARGS extends unknown[] = unknown[]> extends CommandNode<ARGS> implements ContainerNode {
  abstract command: string

  body: Node[]

  constructor(sandstonePack: SandstonePack, ...args: ARGS) {
    super(sandstonePack, ...args)
    this.body = []
  }

  /**
   * Appends a node at the end of this node's body.
   */
  append(node: Node) {
    this.body.push(node)
    return node
  }

  /**
   * Appends a node at the end of this node's body.
   */
  prepend(node: Node) {
    this.body.unshift(node)
    return node
  }

  /**
   * Create a MCFunction from this node.
   * It shouldn't be added to Sandstone's core.
   *
   * The returned node will replace
   */
  createMCFunction: (currentMCFunction: MCFunctionNode | null) => { node: Node | Node[], mcFunction?: MCFunctionNode } = (currentMCFunction) => ({ node: this })
}

export abstract class AwaitNode extends ContainerCommandNode {
  mcfunction: MCFunctionClass<any, any> = undefined as unknown as MCFunctionClass<any, any>
}
