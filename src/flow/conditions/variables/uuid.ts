import type { SandstoneCore } from 'sandstone/core'
import type { UUIDClass } from 'sandstone/variables/UUID'
import { SingleConditionNode } from '../condition'
import { targetParser } from 'sandstone/variables'

export class UUIDConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public UUID: UUIDClass<any>,
  ) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    // TODO: Implement data & scores
    return ['entity', `${targetParser(this.UUID)}`]
  }
}
