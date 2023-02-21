import { SingleConditionNode } from '../condition'

import type { SandstoneCore } from '#core'

export class PredicateConditionNode extends SingleConditionNode {
  constructor(sandstoneCore: SandstoneCore, public predicate: string) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['predicate', this.predicate]
  }
}
