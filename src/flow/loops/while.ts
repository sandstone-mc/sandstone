import type { SubCommand } from 'sandstone/commands'
import type { SandstoneCore } from 'sandstone/core'
import { LoopArgument } from 'sandstone/variables'
import { IfStatement } from '../if_else.js'
import type { ConditionNode } from '../index.js'
import { LoopNode } from '../loop.js'

export class WhileNode extends LoopNode {
  constructor(sandstoneCore: SandstoneCore, condition: ConditionNode, callback: () => void) {
    const _condition = sandstoneCore.pack._.conditionToNode(condition)

    super(
      sandstoneCore,
      [_condition.getValue().split(' ') as SubCommand],
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
