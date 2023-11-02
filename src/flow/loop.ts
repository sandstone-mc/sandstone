import { ContainerNode } from '../core/index.js'

import type { FinalCommandOutput } from 'sandstone/commands/helpers.js'
import type { SandstoneCore } from '../core/index.js'

export type Loopback = (loop: () => FinalCommandOutput) => (() => void)

export class LoopNode extends ContainerNode {
  constructor(sandstoneCore: SandstoneCore, public callback: () => void, public loopback: Loopback) {
    super(sandstoneCore)

    if (callback.toString() !== '() => {}') {
      const currentNode = this.sandstoneCore.getCurrentMCFunctionOrThrow()

      // Generate the body of the If node.
      currentNode.enterContext(this)
      this.callback()
      currentNode.exitContext()
    }
  }

  getValue = () => {
    throw new Error('Minecraft does not support loop statements. This must be postprocessed.')
  }
}

export class LoopStatement {
  protected node: LoopNode

  constructor(protected sandstoneCore: SandstoneCore, protected callback: () => void, protected loopback: Loopback) {
    // Generate the body of the Loop node.
    this.node = new LoopNode(sandstoneCore, callback, loopback)
  }

  protected getNode = () => this.node
}
