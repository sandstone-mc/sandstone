import { Node } from '../core/nodes.js'

import type { SandstonePack } from '../pack/index.js'

export class LoopArgument extends Node {
  constructor(private pack: SandstonePack) {
    super(pack.core)

    this.pack.appendNode(this)
  }

  getValue() {
    throw new Error('Loop arguments are not supported in Minecraft. This must be postprocessed.')
  }

  toLoop() {
    return this.pack.commands.functionCmd(this.pack.core.currentNode)['node'].getValue()
  }
}
