import type { Coordinates } from 'sandstone'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore.js'
import { coordinatesParser } from 'sandstone/variables'
import { SingleConditionNode } from '../condition.js'
import type { Registry } from 'sandstone/arguments/generated/registry'

export class BlockConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private position: Coordinates,
    private block: Registry['minecraft:block'],
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['block', coordinatesParser(this.position), this.block]
  }
}
