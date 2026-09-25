import * as util from 'util'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import { MathConditionNode } from './MathConditionNode'
import { MATH_NODE_DEFAULT_DEPTH, formatMath, getIndent } from './inspectHelpers'

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
    for (const node of nodes) {
      node.parent = this
    }
    this.body.push(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }

  // Recurses into each child's own [util.inspect.custom] (direct call,
  // not via util.inspect(n) — see inspectHelpers.ts). Avoids the
  // sandstoneCore.mathStack re-entry cycle that hangs Bun.
  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(this.inspectClassName, undefined, this._body, depth, getIndent(options), this)
  }
}