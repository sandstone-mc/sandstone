import type { SandstoneCore } from 'sandstone/core'
import type { UUIDClass } from 'sandstone/variables/UUID'
import { CommandConditionNode } from '../command'
import { SingleConditionNode } from '../condition'

export class UUIDConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public UUID: UUIDClass<any>,
  ) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    if (this.UUID.primarySource === 'known') {
      return new CommandConditionNode(this.sandstoneCore, 'result', (execute) =>
        execute.as(this.UUID).if.entity('@s'),
      ).getCondition()
    }
    // TODO: Implement stack indexing when we get there
    return ['entity', `${this.UUID._toSelector()}`]
  }
}
