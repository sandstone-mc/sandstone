/* eslint-disable max-len */

import type { SandstoneCore } from 'sandstone/core'
import type { EntityLabel } from 'sandstone/variables/Label'
import { CommandConditionNode } from '../command.js'
import { SingleConditionNode } from '../condition.js'

export class LabelConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public label: EntityLabel,
  ) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    if (typeof this.label.originalSelector === 'string') {
      return new CommandConditionNode(this.sandstoneCore, 'result', (execute) =>
        execute.as(this.label.originalSelector).if.entity(this.label),
      ).getCondition()
    }
    return ['entity', `${this.label._toSelector()}`]
  }
}
