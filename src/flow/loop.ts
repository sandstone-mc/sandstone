import type { SubCommand } from 'sandstone/commands'
import type { SandstoneCore } from '../core/index.js'
import { ContainerNode } from '../core/index.js'

export class LoopNode extends ContainerNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public executeArgs: SubCommand[],
    public callback: () => void,
    public loopback: () => void,
  ) {
    super(sandstoneCore)

    if (callback.toString() !== '() => {}') {
      const currentNode = this.sandstoneCore.getCurrentMCFunctionOrThrow()

      // Generate the body of the If node.
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
