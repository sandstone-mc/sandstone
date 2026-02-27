import type { SandstoneCore } from 'sandstone/core/sandstoneCore'
import type { Score } from 'sandstone/variables'
import { LoopArgument } from 'sandstone/variables'
import { conditionToNode, type Condition } from '..'
import { IfStatement } from '../if_else'
import { LoopNode } from '../loop'
import { analyzeCondition, warnStaticallyFalseCondition } from './staticAnalysis'

export class ForINode extends LoopNode {
  // eslint-disable-next-line max-len
  constructor(
    sandstoneCore: SandstoneCore,
    initialValue: number | Score,
    endCondition: (iterator: Score) => Condition,
    iterate: (iterator: Score) => Score,
    callback: (iterator: number | Score, _continue: () => void) => any,
  ) {
    const iterator = sandstoneCore.pack.Variable(initialValue, 'loop_iterator')

    const condition = conditionToNode(endCondition(iterator))

    const _continue = () =>
      sandstoneCore.pack.commands.returnCmd.run(
        () => new IfStatement(sandstoneCore, condition, () => new LoopArgument(sandstoneCore.pack)),
      )

    // Check if we can inline the first iteration via static analysis
    const analysisResult = typeof initialValue === 'number'
      ? analyzeCondition(condition, iterator, initialValue)
      : { canAnalyze: false as const }

    if (analysisResult.canAnalyze) {
      if (analysisResult.result) {
        // Condition is statically true - inline the first iteration
        callback(iterator, _continue)
        iterate(iterator)
      } else {
        // Condition is statically false - loop will never execute
        warnStaticallyFalseCondition('for', `initial value ${initialValue} does not satisfy condition`)
      }
    }

    super(
      sandstoneCore,
      condition,
      () => callback(iterator, _continue),
      () => {
        iterate(iterator)
        new IfStatement(sandstoneCore, condition, () => new LoopArgument(sandstoneCore.pack))
      },
    )
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
