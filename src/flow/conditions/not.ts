import { ConditionNode } from './condition.js'

import type { SandstoneCore } from 'sandstone/core'

export class NotNode extends ConditionNode {
  constructor(sandstoneCore: SandstoneCore, public condition: ConditionNode) {
    super(sandstoneCore)
  }

  getValue = (negated = false) => this.condition.getValue(!negated)
}
