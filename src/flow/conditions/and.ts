import { ConditionNode } from './condition.js'

import type { SandstoneCore } from 'sandstone/core/index.js'

export class AndNode extends ConditionNode {
  constructor(sandstoneCore: SandstoneCore, public conditions: ConditionNode[]) {
    super(sandstoneCore)
  }

  getValue = (negated = false) => this.conditions.map((condition) => condition.getValue(negated)).join(' ')
}
