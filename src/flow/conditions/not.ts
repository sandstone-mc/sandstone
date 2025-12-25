import type { SandstoneCore } from 'sandstone/core'
import { ConditionNode } from './condition'

export class NotNode extends ConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public condition: ConditionNode,
  ) {
    super(sandstoneCore)
  }

  getValue = (negated = false) => this.condition.getValue(!negated)
}
