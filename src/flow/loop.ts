import type { MCFunctionNode, SandstoneCore } from '../core'
import { ContainerNode } from '../core'
import type { ConditionNode } from './conditions'

export class LoopNode extends ContainerNode {
  parentMCFunction: MCFunctionNode

  constructor(
    sandstoneCore: SandstoneCore,
    public condition: ConditionNode,
    public callback: () => void,
    public loopback: () => void,
  ) {
    super(sandstoneCore)

    const currentNode = this.sandstoneCore.getCurrentMCFunctionOrThrow()

    this.parentMCFunction = currentNode

    if (callback.toString() !== '() => {}') {
      // Generate the body of the loop node.
      currentNode.enterContext(this)
      // Snapshot the contextStack depth. Sleep nodes (and other awaits)
      // enter their own context without balancing it, so a single
      // `exitContext()` after `loopback()` would only pop the topmost
      // context (the await's) — leaving `this` (LoopNode) on the stack,
      // which causes post-loop commands to be appended to the loop's
      // body instead of the parent MCFunction. Pop until we're back at
      // the parent's depth.
      const parentDepth = currentNode.contextStack.length - 1
      this.callback()
      this.loopback()
      while (currentNode.contextStack.length > parentDepth) {
        currentNode.exitContext()
      }
    }
  }

  getValue = () => {
    throw new Error('Minecraft does not support loop statements. This must be postprocessed.')
  }
}
