import type { BLOCKS, Coordinates } from 'sandstone'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore.js'
import type { LiteralUnion } from 'sandstone/utils.js'
import { coordinatesParser } from 'sandstone/variables'
import { SingleConditionNode } from '../condition.js'

export class BlockConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private position: Coordinates,
    private block: LiteralUnion<BLOCKS>,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['block', coordinatesParser(this.position), this.block]
  }
}
