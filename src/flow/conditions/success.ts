import type { SandstoneCore } from 'sandstone/core'

import type { Score } from 'sandstone/variables/Score'
import { SingleExecuteNode } from './condition'

export class SuccessConditionNode extends SingleExecuteNode {
  constructor(
    sandstoneCore: SandstoneCore,
    readonly score: Score,
  ) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['store', 'success', 'score', this.score]
  }
}
