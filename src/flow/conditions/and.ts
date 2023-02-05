import { ConditionNode } from './condition'

import type { SandstoneCore } from '@core'

export class AndNode extends ConditionNode {
  constructor(sandstoneCore: SandstoneCore, public conditions: ConditionNode[]) {
    super(sandstoneCore)
  }

  getValue = (negated = false) => this.conditions.join(' ')
}
