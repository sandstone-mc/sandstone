import { ContainerNode } from '../nodes'

import type { ContainerCommandNode, Node } from '../nodes'
import type { SandstoneCore } from '../sandstoneCore'

/**
 * A node representing a Minecraft function.
 */
export class MCFunctionNode extends ContainerNode {
  contextStack: (ContainerNode | ContainerCommandNode)[]

  constructor(sandstoneCore: SandstoneCore, public mcFunction: MCFunctionClass) {
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

  /**
   * Whether the MCFunction has been created explicitely by a user.
   *
   * @default false
   */
  isUserCreated?: boolean

  /**
   * Whether the associated Node should be added to Sandstone Core.
   *
   * @default true
   */
  addToSandstoneCore?: boolean
}

export class MCFunctionClass {
  protected generated: boolean = false

  protected node: MCFunctionNode

  public callback: NonNullable<MCFunctionClassArguments['callback']>

  public isUserCreated: NonNullable<MCFunctionClassArguments['isUserCreated']>

  constructor(sandstoneCore: SandstoneCore, public name: string, args: MCFunctionClassArguments = {}) {
    this.node = new MCFunctionNode(sandstoneCore, this)

    this.callback = args.callback ?? (() => { })
    this.isUserCreated = args.isUserCreated ?? false

    if (args.addToSandstoneCore) {
      sandstoneCore.mcfunctions.add(this.node)
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

  toString(): string {
    return this.name
  }
}
