/* eslint-disable max-len */

import type { SandstoneCore } from 'sandstone/core'
import type { EntityLabel } from 'sandstone/variables/Label'
import { SingleConditionNode } from '../condition'
import { targetParser } from 'sandstone/variables'

export class LabelConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public label: EntityLabel,
  ) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['entity', `${targetParser(this.label)}`]
  }
}
