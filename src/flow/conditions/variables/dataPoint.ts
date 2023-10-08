import { SingleConditionNode } from '../condition.js'

import type { NBTObject } from 'sandstone/arguments/nbt'
import type { DataPointClass, Score } from 'sandstone/variables'
import type { SandstoneCore } from 'sandstone/core'

export class DataPointExistsConditionNode extends SingleConditionNode {
  constructor(sandstoneCore: SandstoneCore, readonly dataPoint: DataPointClass) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['data', this.dataPoint.type, this.dataPoint.currentTarget, this.dataPoint.path]
  }
}

export class DataPointEqualsConditionNode extends SingleConditionNode {
  constructor(sandstoneCore: SandstoneCore, readonly dataPoint: DataPointClass, readonly value: NBTObject | Score | DataPointClass) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['data', 'TODO']
  }
}
