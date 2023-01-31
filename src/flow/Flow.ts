import { AndNode, NotNode, OrNode } from './conditions'
import { IfStatement } from './if_else'

import type { SandstoneCore } from '../core'
import type { ConditionNode } from './conditions'

export class Flow {
  constructor(public sandstoneCore: SandstoneCore) { }

  if = (condition: ConditionNode, callback: () => void) => new IfStatement(this.sandstoneCore, condition, callback)

  and = (...conditions: ConditionNode[]) => new AndNode(this.sandstoneCore, conditions)

  or = (...conditions: ConditionNode[]) => new OrNode(this.sandstoneCore, conditions)

  not = (condition: ConditionNode) => new NotNode(this.sandstoneCore, condition)
}
