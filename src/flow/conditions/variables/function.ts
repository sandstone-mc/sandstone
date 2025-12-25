import type { SandstoneCore } from 'sandstone/core/sandstoneCore'
import { SingleConditionNode } from '../condition'

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
