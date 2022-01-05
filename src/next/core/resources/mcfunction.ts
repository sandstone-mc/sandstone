import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { ContainerCommandNode, Node } from '../nodes'
import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'

/**
 * A node representing a Minecraft function.
 */
export class MCFunctionNode extends ContainerNode implements ResourceNode {
  contextStack: (ContainerNode | ContainerCommandNode)[]

  constructor(sandstoneCore: SandstoneCore, public resource: MCFunctionClass) {
    super(sandstoneCore)
    this.contextStack = [this]
  }

  /**
   * The currently active context.
   *
   * For example, the current context is the function body if the function is not in a loop.
   * If the function is in a loop, the current context is the loop body.
   */
  get currentContext() {
    return this.contextStack[this.contextStack.length - 1]
  }

  /**
   * Sequentially add a node to the body of the function.
   *
   * @param node The node to add.
   */
  addNode = (node: Node) => this.currentContext.append(node)

  /**
   * Switch the current context to the given node.
   * Also adds the node to the body of the current context, except if addNode is False.
   *
   * @param node The node to switch to.
   * @param addNode Whether to add the node to the body of the current context.
   */
  enterContext = (node: ContainerNode | ContainerCommandNode, addNode: boolean = true) => {
    if (addNode) {
      this.currentContext.append(node)
    }

    this.contextStack.push(node)
  }

  /**
   * Leave the current context, and return to the previous one.
   *
   * @return The previously active context.
   * @throws Error if there is no previous context.
   */
  exitContext = () => {
    if (this.contextStack.length === 0) {
      throw new Error('No previous context to return to.')
    }

    if (this.contextStack.length === 1) {
      throw new Error('It is forbidden for a MCFunction to exit its latest context, since the MCFunction itself must be in the context stack.')
    }

    return this.contextStack.pop()
  }

  toString = () => this.body.map((node) => node.toString()).join('\n')
}

export type MCFunctionClassArguments = {
  /**
   * The callback to run when the MCFunction is generated.
   *
   * @default () => {}
   */
  callback?: () => void
} & ResourceClassArguments

export class MCFunctionClass extends ResourceClass<MCFunctionNode> {
  public callback: NonNullable<MCFunctionClassArguments['callback']>

  constructor(sandstoneCore: SandstoneCore, public name: string, args: MCFunctionClassArguments = {}) {
    super(sandstoneCore, MCFunctionNode, name, args)

    this.callback = args.callback ?? (() => { })

    // If there is no given callback, the MCFunction can be considered as generated.
    if (!args.callback) {
      this.generated = true
    }
  }

  generate = (): void => {
    if (this.generated) {
      return
    }

    const { sandstoneCore } = this.node
    sandstoneCore.enterMCFunction(this)
    this.callback()
    this.generated = true
    sandstoneCore.exitMCFunction()
  }
}
