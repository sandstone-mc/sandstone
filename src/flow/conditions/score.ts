import { Score } from '../../variables/Score'
import { SingleConditionNode } from './condition'

import type { Range } from '#arguments/range'
import type { SandstoneCore } from '#core'

export class ScoreConditionNode extends SingleConditionNode {
  constructor(sandstoneCore: SandstoneCore, public op1: Score, public operator: string, public op2: Score | number | Range) {
    super(sandstoneCore)

    if (!(op2 instanceof Score) && operator !== 'matches') {
      throw new Error(`Second operand of type "${typeof op2}" can only be used with the "matches" operator, but got operator="${operator}"`)
    }
  }

  getCondition(): unknown[] {
    return ['score', this.op1, this.operator, this.op2]
  }
}
