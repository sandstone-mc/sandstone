import type { SandstoneCore } from 'sandstone/core/sandstoneCore.js'
import { SingleConditionNode } from '../condition.js'
import type { Registry } from 'sandstone/arguments/generated/registry'

export class DimensionConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private dimension: Registry['minecraft:dimension'],
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['dimension', this.dimension]
  }
}
