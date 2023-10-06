import { SingleConditionNode } from '../condition.js'

import type { SandstoneCore } from 'sandstone/core/index.js'

export class ScoreConditionNode extends SingleConditionNode {
  constructor(sandstoneCore: SandstoneCore, readonly args: string[]) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['score', ...this.args]
  }
}
