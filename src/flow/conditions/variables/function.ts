import type { SandstoneCore } from 'sandstone/core/sandstoneCore.js'
import { SingleConditionNode } from '../condition.js'

export class FunctionConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private mcfunction: string,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['function', this.mcfunction]
  }
}
