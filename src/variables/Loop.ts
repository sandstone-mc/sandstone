import { Node } from '../core/nodes'

import type { SandstonePack } from '../pack'

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
