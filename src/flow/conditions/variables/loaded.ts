import type { Coordinates } from 'sandstone'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore'
import { coordinatesParser } from 'sandstone/variables'
import { SingleConditionNode } from '../condition'

export class LoadedConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private pos: Coordinates,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['loaded', coordinatesParser(this.pos)]
  }
}
