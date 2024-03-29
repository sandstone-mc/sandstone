import { SingleConditionNode } from '../condition.js'

import type { SandstoneCore } from 'sandstone/core'

export class SelectorConditionNode extends SingleConditionNode {
  constructor(sandstoneCore: SandstoneCore, public selector: string) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['entity', this.selector]
  }
}
