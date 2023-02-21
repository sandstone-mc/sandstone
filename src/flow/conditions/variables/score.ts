import { SingleConditionNode } from '../condition'

import type { SandstoneCore } from '#core'

export class ScoreConditionNode extends SingleConditionNode {
  constructor(sandstoneCore: SandstoneCore, readonly args: string[]) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['score', ...this.args]
  }
}
