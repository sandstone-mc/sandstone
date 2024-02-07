import { type SubCommand, ExecuteCommandNode } from 'sandstone/commands'
import { LoopArgument } from 'sandstone/variables'

import { LoopNode } from '../loop.js'

import type { SandstoneCore } from 'sandstone/core/sandstoneCore.js'
import type { Score } from 'sandstone/variables'
import type { Condition } from '../index.js'

export class ForINode extends LoopNode {
  // eslint-disable-next-line max-len
  constructor(sandstoneCore: SandstoneCore, initialValue: number | Score, endCondition: (iterator: Score) => Condition, iterate: (iterator: Score) => Score, callback: (iterator: number | Score, _continue: () => void) => any) {
    const iterator = sandstoneCore.pack.Variable(initialValue, 'loop_iterator')

    const condition = sandstoneCore.pack._.conditionToNode(endCondition(iterator))

    const value = condition.getValue().split(' ')

    const conditionValue: SubCommand = [value[0], value.slice(1).join(' ')]

    const _continue = () => sandstoneCore.pack.commands.returnCmd.run(() => new ExecuteCommandNode(sandstoneCore.pack, [conditionValue], { body: [new LoopArgument(sandstoneCore.pack)] }))

    callback(iterator, _continue)

    iterate(iterator)

    super(sandstoneCore, [conditionValue], () => callback(iterator, _continue), () => {
      iterate(iterator)
      return new ExecuteCommandNode(sandstoneCore.pack, [conditionValue], { body: [new LoopArgument(sandstoneCore.pack)] })
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
