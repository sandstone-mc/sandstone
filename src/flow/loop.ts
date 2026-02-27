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
      this.callback()
      this.loopback()
      currentNode.exitContext()
    }
  }

  getValue = () => {
    throw new Error('Minecraft does not support loop statements. This must be postprocessed.')
  }
}
