import { Node } from 'sandstone/core/index.js'

export type GenericConditionType = {
  /**
   * The condition express as an execute.
   * Can either be:
   * * a string
   * * an array of strings that will be joined with a space
   * * a function that returns a string
   *
   * This *must not* include `if` or `unless`.
   *
   * @example ['score', '@s', 'matches', 0]
   */
  toExecute: unknown | unknown[] | (() => unknown | unknown[])
}

export abstract class ConditionNode extends Node {
  abstract getValue: (negated?: boolean) => string
}

export abstract class SingleConditionNode extends ConditionNode {
  abstract getCondition(): unknown[]

  getValue = (negated = false) => {
    const keyword = negated ? 'unless' : 'if'

    return [keyword, ...this.getCondition()].join(' ')
  }
}

export abstract class SingleExecuteNode extends ConditionNode {
  abstract getCondition(): unknown[]

  getValue = (negated = false) => this.getCondition().join(' ')
}
