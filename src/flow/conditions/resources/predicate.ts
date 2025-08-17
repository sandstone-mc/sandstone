import type { SandstoneCore } from 'sandstone/core'
import { SingleConditionNode } from '../condition.js'

export class PredicateConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public predicate: string,
  ) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['predicate', this.predicate]
  }
}
