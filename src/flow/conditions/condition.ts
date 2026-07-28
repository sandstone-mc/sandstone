import { Node } from 'sandstone/core'
import * as util from 'util'
import { formatDebugString } from '../../utils'

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
  /**
   * Optional commands that must run before this condition's predicate is evaluated.
   * Conditions that emit side-effect commands at construction time (e.g. `data.equals`
   * building an `execute store result ...`) capture them here so the visitor pass can
   * re-emit them at the correct location — inline before the IfNode, or inside the
   * child MCFunction when AND/OR extracts. Pure predicates leave it unset.
   */
  preNodes?: Node[]

  abstract getValue: (negated?: boolean) => string
}

export abstract class SingleConditionNode extends ConditionNode {
  abstract getCondition(): unknown[]

  getValue = (negated = false) => {
    const keyword = negated ? 'unless' : 'if'

    return [keyword, ...this.getCondition()].join(' ')
  };

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(this.constructor.name, this.getValue(), undefined, options.indent)
  }
}

export abstract class SingleExecuteNode extends ConditionNode {
  abstract getCondition(): unknown[]

  getValue = (_negated = false) => this.getCondition().join(' ')
}
