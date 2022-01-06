import type { SandstoneCore } from './sandstoneCore'

export class Node {
  constructor(public sandstoneCore: SandstoneCore) { }
}

/**
 * A node that includes other nodes.
 */
export class ContainerNode extends Node {
  body: Node[]

  constructor(sandstoneCore: SandstoneCore) {
    super(sandstoneCore)
    this.body = []
  }

  /**
   * Appends a node at the end of this node's body.
   */
  append(node: Node) {
    this.body.push(node)
    return node
  }
}

/**
 * A node that represents a generic condition.
 */
export class ConditionNode extends Node {
  toString() {
    throw new Error('All condition nodes must implement toString()')
  }
}

/**
 * A node that represents a generic command.
 */
export abstract class CommandNode<ARGS extends unknown[] = unknown[]> extends Node {
  abstract command: string

  args: ARGS

  commited = false

  constructor(sandstoneCore: SandstoneCore, ...args: ARGS) {
    super(sandstoneCore)
    this.args = args
  }

  toString() {
    const filteredArgs = this.args.filter((arg) => arg !== undefined)
    return `${this.command} ${filteredArgs.join(' ')}`
  }

  /**
   * Commits the command to the current MCFunction context.
   */
  commit = () => {
    if (this.commited) {
      return this
    }
    this.commited = true

    return this.sandstoneCore.getCurrentMCFunctionOrThrow().addNode(this)
  }
}

/**
 * A node that includes other nodes.
 */
export abstract class ContainerCommandNode<ARGS extends unknown[] = unknown[]> extends CommandNode<ARGS> implements ContainerNode {
  abstract command: string

  body: Node[]

  constructor(sandstoneCore: SandstoneCore, ...args: ARGS) {
    super(sandstoneCore, ...args)
    this.body = []
  }

  /**
   * Appends a node at the end of this node's body.
   */
  append(node: Node) {
    this.body.push(node)
    return node
  }
}
