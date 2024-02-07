import { Node } from '../core/nodes.js'

import type { SandstonePack } from '../pack/index.js'

export class LoopArgument extends Node {
  constructor(private pack: SandstonePack) {
    super(pack.core)

    this.pack.appendNode(this)
  }

  getValue() {
    return this.toLoop()
  }

  toLoop() {
    return `function ${this.pack.core.currentNode}`
  }
}
