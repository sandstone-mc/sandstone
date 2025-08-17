import type { SubCommand } from 'sandstone/commands'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore.js'
import type { DataPointClass, IterableDataClass, Score, StringDataPointClass } from 'sandstone/variables'
import { LoopArgument } from 'sandstone/variables'
import { IfStatement } from '../if_else.js'
import type { ConditionNode } from '../index.js'
import { LoopNode } from '../loop.js'

export type ForOfIterator = 'entry' | ['i', 'entry'] | ['key', 'value']

// eslint-disable-next-line max-len
export type ForOfIterate<ITERATOR extends ForOfIterator> = ITERATOR extends 'entry'
  ? [entry: DataPointClass]
  : ITERATOR extends string[]
    ? ITERATOR[0] extends 'i'
      ? [index: Score, entry: DataPointClass]
      : [key: StringDataPointClass, value: DataPointClass]
    : [never]

export class ForOfNode<ITERATOR extends ForOfIterator, ITERATE extends ForOfIterate<ForOfIterator>> extends LoopNode {
  constructor(
    sandstoneCore: SandstoneCore,
    iteratorType: ITERATOR,
    iterable: IterableDataClass,
    callback: (...args: ITERATE) => any,
  ) {
    const _iterable = iterable._toDataPoint()

    let startCondition: SubCommand

    let iterate: () => void

    let continueCondition: ConditionNode

    if (Array.isArray(iteratorType)) {
      if (iteratorType[0] === 'key') {
        startCondition = ['if', 'data', _iterable.type, `${_iterable.path}{}`]

        iterate = iterable.iterator((dataPoints) => {
          if (dataPoints.length === 1) {
            throw new Error(
              'Error: Attempt to use "for key value" loop with an Array dataset; this is not supported. (Hint: use "for entry" or "for i entry" instead)',
            )
          }
          callback(...([dataPoints[0], dataPoints[1]] as unknown as ITERATE))
        })
      } else {
        startCondition = ['if', 'data', _iterable.type, `${_iterable.path}{}`]

        const _iterator = sandstoneCore.pack.Variable()

        _iterator.set(iterable.size()) // Store the size of the array to the iterator

        continueCondition = _iterator['!='](-1)

        iterate = iterable.iterator((dataPoints) => {
          _iterator.decrease()

          if (dataPoints.length === 1) {
            return callback(...([_iterator, dataPoints[0]] as unknown as ITERATE))
          }
          return callback(...([_iterator, dataPoints[1]] as unknown as ITERATE))
        })
      }
    } else {
      startCondition = ['if', 'data', _iterable.type, `${_iterable.path}{}`]

      iterate = iterable.iterator((dataPoints) => {
        if (dataPoints.length === 1) {
          return callback(...([dataPoints[0]] as unknown as ITERATE))
        }
        return callback(...([dataPoints[1]] as unknown as ITERATE))
      })
    }

    iterate()

    super(
      sandstoneCore,
      [startCondition],
      () => iterate,
      () =>
        new IfStatement(
          sandstoneCore,
          continueCondition || iterable.continue,
          () => new LoopArgument(sandstoneCore.pack),
        ),
    )
  }
}

export class ForOfStatement<ITERATOR extends ForOfIterator, ITERATE extends ForOfIterate<ForOfIterator>> {
  protected node: ForOfNode<ITERATOR, ITERATE>

  constructor(
    protected sandstoneCore: SandstoneCore,
    protected iteratorType: ITERATOR,
    protected iterable: IterableDataClass,
    protected callback: (...args: ITERATE) => any,
  ) {
    this.node = new ForOfNode(sandstoneCore, iteratorType, iterable, callback)
  }

  protected getNode = () => this.node
}
