import { ConditionNode } from './condition'

import type { SandstoneCore } from '#core'

export class NotNode extends ConditionNode {
  constructor(sandstoneCore: SandstoneCore, public condition: ConditionNode) {
    super(sandstoneCore)
  }

  getValue = (negated = false) => this.condition.getValue(!negated)
}
