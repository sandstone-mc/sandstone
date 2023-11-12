import { LoopArgument } from 'sandstone/variables'

import { IfStatement } from '../index.js'
import { LoopNode } from '../loop.js'

import type { SubCommand } from 'sandstone/commands'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore.js'
import type { Score } from 'sandstone/variables'
import type { Condition } from '../index.js'

export class ForINode extends LoopNode {
  // eslint-disable-next-line max-len
  constructor(sandstoneCore: SandstoneCore, initialValue: number | Score, endCondition: (iterator: Score) => Condition, iterate: (iterator: Score) => Score, callback: (iterator: number | Score) => any) {
    callback(initialValue)

    // Since we're calling the callback once regardless, we need to increase the initial value by 1

    let initial = initialValue

    if (typeof initial === 'number') {
      initial += 1
    }

    const iterator = sandstoneCore.pack.Variable(initialValue, 'loop_iterator')

    if (typeof initial !== 'number') {
      iterator.increase()
    }

    const condition = sandstoneCore.pack._.conditionToNode(endCondition(iterator))

    const value = condition.getValue().split(' ')

    const conditionValue: SubCommand = [value[0], value.join(' ')]

    super(sandstoneCore, [conditionValue], () => callback(iterator), () => {
      iterate(iterator)
      return new IfStatement(sandstoneCore, condition, () => new LoopArgument(sandstoneCore.pack))
    })
  }
}

export class ForIStatement {
  protected node: ForINode

  constructor(
    protected sandstoneCore: SandstoneCore,
    protected initialValue: number | Score,
    protected endCondition: (iterator: Score) => Condition,
    protected iterate: (iterator: Score) => Score,
    protected callback: (iterator: Score | number) => void,
  ) {
    this.node = new ForINode(sandstoneCore, initialValue, endCondition, iterate, callback)
  }

  protected getNode = () => this.node
}
