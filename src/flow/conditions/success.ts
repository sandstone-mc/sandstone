import { SingleExecuteNode } from './condition'

import type { Score } from 'sandstone/variables/Score'
import type { SandstoneCore } from '#core'

export class SuccessConditionNode extends SingleExecuteNode {
  constructor(sandstoneCore: SandstoneCore, readonly score: Score) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['store', 'success', 'score', this.score]
  }
}
