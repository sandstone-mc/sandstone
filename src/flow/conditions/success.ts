import { SingleExecuteNode } from './condition.js'

import type { Score } from 'sandstone/variables/Score.js'
import type { SandstoneCore } from 'sandstone/core/index.js'

export class SuccessConditionNode extends SingleExecuteNode {
  constructor(sandstoneCore: SandstoneCore, readonly score: Score) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['store', 'success', 'score', this.score]
  }
}
