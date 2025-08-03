import type { DIMENSIONS } from 'sandstone'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore.js'
import type { LiteralUnion } from 'sandstone/utils.js'
import { SingleConditionNode } from '../condition.js'

export class DimensionConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private dimension: LiteralUnion<DIMENSIONS>,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['dimension', this.dimension]
  }
}
