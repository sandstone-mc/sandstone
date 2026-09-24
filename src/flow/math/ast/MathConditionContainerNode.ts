import * as util from 'util'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import { MathConditionNode } from './MathConditionNode'

/**
 * A condition node that holds a body of sub-conditions.
 *
 * Used by combinators that operate on multiple conditions at once
 * (`and(a, b, c)`, `or(a, b, c)`). `not(c)` is a unary variant and uses
 * the simpler `MathConditionNode` base directly.
 *
 * Conditions form their own subtree — they do NOT participate in the
 * `sandstoneCore.mathStack` (which tracks expression-side containers).
 * Combinator children are appended directly to `body` via the
 * constructor's callback; no nested-context push is needed because
 * combinators are flat (children are added eagerly during construction).
 */
export abstract class MathConditionContainerNode extends MathConditionNode {
  _body: MathConditionNode[] = []

  constructor(sandstoneCore: SandstoneCore) {
    super(sandstoneCore)
  }

  get body(): MathConditionNode[] {
    return this._body
  }

  set body(body: MathConditionNode[]) {
    this._body = body
  }

  append<NODE extends MathConditionNode>(node: NODE): NODE
  append<NODES extends MathConditionNode[]>(...nodes: NODES): NODES
  append(...nodes: MathConditionNode[]) {
    this.body.push(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }

  [util.inspect.custom](_depth: number, _options: any) {
    void _depth
    void _options
    const childLines = this.body.map((n) => `  ${util.inspect(n)}`).join('\n')
    return childLines ? `${this.constructor.name}(\n${childLines}\n)` : `${this.constructor.name}()`
  }
}