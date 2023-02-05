import type { MCFunctionNode } from './resources'
import type { SandstoneCore } from './sandstoneCore'
import type { SandstonePack } from '#pack'

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
    for (const node of nodes) {
      this.body.push(node)
    }
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
    const filteredArgs = this.args.filter((arg) => arg !== undefined)
    return `${this.command} ${filteredArgs.join(' ')}`
  }

  /**
   * Commits the command to the current MCFunction context.
   */
  commit() {
    if (this.commited) {
      return this
    }
    this.commited = true

    return this.sandstonePack.addNode(this)
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
   * Create a MCFunction from this node.
   * It shouldn't be added to Sandstone's core.
   *
   * The returned node will replace
   */
  createMCFunction: (currentMCFunction: MCFunctionNode | null) => { node: Node | Node[], mcFunction?: MCFunctionNode } = (currentMCFunction) => ({ node: this })
}
