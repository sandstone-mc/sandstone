import type { SandstoneCore } from 'sandstone/core'
import { SingleConditionNode } from '../condition'

export class SelectorConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public selector: string,
  ) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['entity', this.selector]
  }
}
