import {
  AndNode, ConditionNode, NotNode, OrNode,
} from './conditions/index.js'
import { IfStatement } from './if_else.js'

import type { SandstoneCore } from '../core/index.js'
import type { ConditionClass } from '../variables/index.js'

type Condition = ConditionNode | ConditionClass
export class Flow {
  constructor(public sandstoneCore: SandstoneCore) { }

  conditionToNode(condition: Condition) {
    if (!(condition instanceof ConditionNode)) {
      return condition._toMinecraftCondition()
    }
    return condition
  }

  if = (condition: Condition, callback: () => void) => new IfStatement(this.sandstoneCore, this.conditionToNode(condition), callback)

  and = (...conditions: Condition[]) => new AndNode(this.sandstoneCore, conditions.map((condition) => this.conditionToNode(condition)))

  or = (...conditions: Condition[]) => new OrNode(this.sandstoneCore, conditions.map((condition) => this.conditionToNode(condition)))

  not = (condition: Condition) => new NotNode(this.sandstoneCore, this.conditionToNode(condition))
}
