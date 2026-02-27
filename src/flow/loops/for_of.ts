import type { SubCommand } from 'sandstone/commands'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore'
import type { DataPointClass, IterableDataClass, Score, StringDataPointClass } from 'sandstone/variables'
import { LoopArgument } from 'sandstone/variables'
import { IfStatement } from '../if_else'
import { LoopNode } from '../loop'

export type ForOfIterator = 'entry' | ['i', 'entry'] | ['key', 'value']

// eslint-disable-next-line max-len
export type ForOfIterate<ITERATOR extends ForOfIterator> = ITERATOR extends 'entry'
  ? [entry: DataPointClass]
  : ITERATOR extends string[]
    ? ITERATOR[0] extends 'i'
      ? [index: Score, entry: DataPointClass]
      : [key: StringDataPointClass, value: DataPointClass]
    : [never]

function isMultipleVariable(iteratorType: ForOfIterator): iteratorType is Exclude<ForOfIterator, 'entry'> {
  if (Array.isArray(iteratorType)) {
    return true
  }
  return false
}

function isMapIterator(iteratorType: ForOfIterator, iterable: IterableDataClass<'list' | 'map'>): iterable is IterableDataClass<'map'> {
  if (isMultipleVariable(iteratorType) && iteratorType[0] === 'key') {
    if (iterable.iteratorType === 'map') {
      return true
    }
    throw new Error(
      'Attempt to use "for key value" loop with a List iterable; this is not supported. (Hint: use "for entry" or "for i entry" instead)',
    )
  }
  return false
}

export class ForOfNode<ITERATOR extends ForOfIterator, ITERATE extends ForOfIterate<ForOfIterator>> extends LoopNode {
  constructor(
    sandstoneCore: SandstoneCore,
    iteratorType: ITERATOR,
    direction: 'normal' | 'reverse',
    iterable: IterableDataClass<ITERATOR extends string[] ? ITERATOR[0] extends 'key' ? 'map' : ('list' | 'map') : ('list' | 'map')>,
    callback: (...args: ITERATE) => any,
  ) {
    let iterate: () => void

    if (isMultipleVariable(iteratorType)) {
      if (isMapIterator(iteratorType, iterable)) {
        iterate = iterable.iterator((dataPoints) => {
          callback(...([dataPoints[0], dataPoints[1]] as ITERATE))
        }, direction)
      } else {
        const _iterator = sandstoneCore.pack.Variable(direction === 'normal' ? -1 : undefined)

        if (direction === 'reverse') {
          _iterator.set(iterable.size()) // Store the size of the array to the iterator
        }

        iterate = iterable.iterator((dataPoints) => {
          if (direction === 'normal') {
            _iterator.increase()
          } else {
            _iterator.decrease()
          }

          if (dataPoints.length === 1) {
            return callback(...([_iterator, dataPoints[0]] as ITERATE))
          }
          return callback(...([_iterator, dataPoints[1]] as ITERATE))
        }, direction)
      }
    } else {
      iterate = iterable.iterator((dataPoints) => {
        if (dataPoints.length === 1) {
          return callback(...([dataPoints[0]] as unknown as ITERATE))
        }
        return callback(...([dataPoints[1]] as unknown as ITERATE))
      })
    }

    const continueCondition = iterable.continue(direction)

    super(
      sandstoneCore,
      continueCondition,
      () => iterate,
      () =>
        new IfStatement(
          sandstoneCore,
          continueCondition,
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
    protected direction: 'normal' | 'reverse',
    protected iterable: IterableDataClass<ITERATOR extends string[] ? ITERATOR[0] extends 'key' ? 'map' : ('list' | 'map') : ('list' | 'map')>,
    protected callback: (...args: ITERATE) => any,
  ) {
    this.node = new ForOfNode(sandstoneCore, iteratorType, direction, iterable, callback)
  }

  protected getNode = () => this.node
}
