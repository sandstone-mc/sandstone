import { SingleConditionNode } from '../condition'

import type { SandstoneCore } from '#core'

export class SelectorConditionNode extends SingleConditionNode {
  constructor(sandstoneCore: SandstoneCore, public selector: string) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['entity', this.selector]
  }
}
