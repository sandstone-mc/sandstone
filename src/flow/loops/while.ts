import type { SandstoneCore } from 'sandstone/core'
import { LoopArgument } from 'sandstone/variables'
import { IfStatement } from '../if_else'
import { conditionToNode, type ConditionNode } from '..'
import { LoopNode } from '../loop'

export class WhileNode extends LoopNode {
  constructor(
    sandstoneCore: SandstoneCore,
    condition: ConditionNode,
    callback: () => void,
  ) {
    const _condition = conditionToNode(condition)

    super(
      sandstoneCore,
      _condition,
      callback,
      () => new IfStatement(sandstoneCore, _condition, () => new LoopArgument(sandstoneCore.pack)),
    )
  }
}

export class WhileStatement {
  protected node: WhileNode

  constructor(
    protected sandstoneCore: SandstoneCore,
    protected condition: ConditionNode,
    protected callback: () => void,
  ) {
    this.node = new WhileNode(sandstoneCore, condition, callback)
  }
}
