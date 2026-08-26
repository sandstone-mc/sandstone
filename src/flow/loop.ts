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
      // Generate the body of the loop node. Awaits inside the callback
      // enter their own context without balancing it — `balanceContext`
      // pops the whole stack back to the pre-enter depth for us. We
      // include `loopback()` in the balanced block so any awaits it
      // triggers are also popped.
      currentNode.balanceContext(this, () => {
        this.callback()
        this.loopback()
      })
    }
  }

  getValue = () => {
    throw new Error('Minecraft does not support loop statements. This must be postprocessed.')
  }
}
