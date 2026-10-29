import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { MathNode } from '../ast/MathNode'
import { MathExpressionNode } from '../ast/MathExpressionNode'
import type { MathFunctionNode } from '../ast/MathFunctionNode'
import { LiteralNode, CopyNode } from '../ast/nodes/leaves'
import { MathFlowClauseNode, MathIfNode } from '../ast/nodes/control'
import { AggregateNode, BinaryOpNode, UnaryOpNode } from '../ast/nodes/operators'
import { MathReturnNode } from '../ast/nodes/control'
import { MathVisitor } from './MathVisitor'

/**
 * `ConstantFoldingVisitor` — fold expression subtrees whose value
 * is statically known to a single `LiteralNode` carrying that
 * value, and apply safe algebraic identity rules.
 *
 * ## What folds
 *
 * 1. **Literal-literal arithmetic.** `add(2, 3)` → `5`,
 *    `mul(10, 2)` → `20`, `pow(2, 8)` → `256`, `negate(5)` → `-5`,
 *    `sqrt(16)` → `4`, etc. Delegates to each node's existing
 *    `evaluateAsConstant` helper (covers all ops MC supports).
 *
 * 2. **Identity rules that produce a constant.** `mul(x, 0)` → `0`
 *    for any `x`; `pow(x, 0)` → `1` (Java's `Math.pow` semantics);
 *    `pow(0, x)` → `0` for `x > 0`. These work even when `x` is
 *    non-constant — the literal wins.
 *
 * 3. **Identity rules that simplify.** `add(x, 0)` → `x`,
 *    `sub(x, 0)` → `x`, `mul(x, 1)` → `x`, `mul(1, x)` → `x`,
 *    `div(x, 1)` → `x`, `pow(x, 1)` → `x`. One side must be a literal;
 *    the other survives unchanged.
 *
 * 4. **Aggregate identities.** `add([0, x, y])` → `add([x, y])`,
 *    `mul([1, x])` → `x`, `mul([0, ...])` → `0`. Identity literals
 *    are filtered out of the input list; if only one non-identity
 *    input survives, the aggregate collapses to that input.
 *
 * `sub(0, x)` → `negate(x)` is intentionally omitted — it's a
 * shape change that produces a unary op, not a simplification.
 * Lives in `AlgebraicSimplificationVisitor` instead.
 *
 * ## Float precision
 *
 * MC runs all math in single-precision (`float`); JS uses double.
 * `0.1 + 0.2` is `0.30000000000000004` in JS, `0.3f` in Java. Every
 * folded constant rounds through `Math.fround` to match MC's
 * runtime value. The serialized SNBT may have extra digits (JS
 * formats doubles more verbosely than Java formats floats), but
 * the parsed value is identical to what MC would compute.
 *
 * ## How it integrates with the pipeline
 *
 * Mutates the parent node's `operands[i]` / `inputs[i]` IN PLACE
 * — same pattern as `FlattenExpressionChainVisitor`. The visitor
 * returns a fresh `LiteralNode` (or simplified operand) when it
 * folds; the CALLER's `visitXxxNode` detects the identity change
 * (`newR !== oldR`) and reassigns the parent's child reference
 * via in-place mutation. The runner discards the return value,
 * but the parent's mutation persists.
 *
 * Root folds (an operator node whose result IS the chain return —
 * has no parent in `allNodes`) are tracked and pushed onto
 * `fn.allNodes` in `onEnd` so the downstream chain analysis sees
 * them. Degenerate constant-only chains produce no commands —
 * the bridge emit path bails out cleanly because the provider
 * plan is empty.
 */
export class ConstantFoldingVisitor extends MathVisitor {
  /**
   * The math function currently being walked — set by the
   * overridden `run(fn)` below. Lets `visitReturnNode` set
   * `fn.constantResult` (the chain analysis reads it to
   * synthesise an update for constant-result math).
   */
  private _fn: MathFunctionNode | null = null

  /** Wrapping nodes absorbed during this pass — drained by the runner. */
  readonly orphans: Array<BinaryOpNode | AggregateNode | UnaryOpNode> = []
  /**
   * Fresh `LiteralNode`s whose source operator was a root in
   * `allNodes` (had no parent to mutate). Pushed onto `fn.allNodes`
   * in `onEnd` so the chain analysis can classify them.
   */
  private readonly _newRootLiterals: LiteralNode[] = []

  override onStart(fn: MathFunctionNode): void {
    // Capture the function so `visitReturnNode` can stash the folded
    // constant on it. Without this `_fn` stays null and the
    // `if (this._fn)` guard silently drops every `constantResult`
    // write — the chain analysis then sees no synthetic update and
    // the compiler emits no `set value Xf` for the result path.
    this._fn = fn
  }

  onEnd(fn: MathFunctionNode): void {
    // Constant-result handoff: if the math function's return
    // value is now a Literal (because every operator on the
    // chain folded away), record it on `fn.constantResult` so
    // the chain analysis can produce one synthetic update whose
    // expression IS the literal. Without this handoff the
    // chain analysis would produce no updates (the literal
    // isn't a BinaryOp or Aggregate), and the compiler would
    // emit no command — the fold would be invisible at the
    // JSON layer.
    const ret = fn.body[0]
    if (MathReturnNode.is(ret) && LiteralNode.is(ret.value)) {
      fn.constantResult = ret.value
    }
    if (this._newRootLiterals.length === 0) return
    for (const lit of this._newRootLiterals) {
      fn.allNodes.push(lit)
    }
    this._newRootLiterals.length = 0
  }

  override visitBinaryOpNode(node: BinaryOpNode): MathNode {
    // Recurse into operands first so deeper transforms are visible
    // to the fold attempt.
    const oldL = node.operands[0]
    const oldR = node.operands[1]
    const newL = this.visit(oldL) as MathExpressionNode
    const newR = this.visit(oldR) as MathExpressionNode
    if (newL !== oldL) node.operands[0] = newL
    if (newR !== oldR) node.operands[1] = newR

    const folded = this.tryFoldBinary(node)
    if (folded === undefined) return node
    this.orphans.push(node)
    return folded
  }

  override visitAggregateNode(node: AggregateNode): MathNode {
    const oldInputs = node.inputs
    const newInputs = oldInputs.map((i) => this.visit(i) as MathExpressionNode)
    for (let i = 0; i < newInputs.length; i++) {
      if (newInputs[i] !== oldInputs[i]) {
        node.inputs[i] = newInputs[i]
      }
    }

    // Aggregate identity filter: drop 0s from `add`, 1s from `mul`.
    // Mutates `node.inputs` in place. Absorbing literal (0 in `mul`)
    // short-circuits to a constant. After filtering, if only one
    // non-identity input survives, drop the aggregate entirely.
    const filtered = this.tryFilterAggregateInputs(node)
    if (filtered !== undefined) {
      this.orphans.push(node)
      return filtered
    }

    // All-literal evaluation.
    const folded = this.tryFoldAllLiteralAggregate(node)
    if (folded === undefined) return node
    this.orphans.push(node)
    return folded
  }

  override visitUnaryOpNode(node: UnaryOpNode): MathNode {
    const oldOperand = node.operand
    const newOperand = this.visit(oldOperand) as MathExpressionNode
    if (newOperand !== oldOperand) {
      // Mutate `operand` in place (same pattern as `BinaryOpNode` /
      // `AggregateNode`). The field is declared `readonly`, but the
      // fold visitor owns the in-place mutation contract — there is
      // no caller in the visitor pipeline that would rewire the
      // parent (unlike the BinaryOp case, UnaryOpNode's only parent
      // is whatever walk reached it, and `MathVisitor.run` discards
      // return values). Without this mutation, a chain like
      // `x.negate().abs().sqrt()` keeps its original operand nodes
      // and never folds.
      node.operand = newOperand
      // Push the old operand (now unreferenced) so the post-pass
      // orphan filter removes it from `fn.allNodes`.
      this.orphans.push(oldOperand as BinaryOpNode | AggregateNode | UnaryOpNode)
    }
    const folded = this.tryFoldUnary(node)
    if (folded === undefined) return node
    this.orphans.push(node)
    return folded
  }

  override visitReturnNode(node: MathReturnNode): MathNode {
    // `node.value` is the snapshot taken at `_.return` time:
    //   - scalar return → a Float/Integer handle's current `node`
    //     (a `MathExpressionNode`)
    //   - record return → `{ [field]: MathExpressionNode }` (each
    //     field's handle's current `node`)
    // Type as `unknown` and use guards — the previous `MathExpressionNode`
    // annotation was a type lie that compiled only because the record
    // case was never exercised.
    let current = node.value
    if (MathExpressionNode.is(current)) {
      const expr = current
      for (let iter = 0; iter < 32; iter++) {
        const next = this.visit(expr)
        if (next === expr) break
        if (!MathExpressionNode.is(next)) break
        current = next
        if (current === expr) break
      }
    }
    if (
      MathExpressionNode.is(current as MathNode) &&
      current !== node.value
    ) {
      node.value = current
    }
    // Scalar constant: a single `MathExpressionNode` that folded to
    // a literal. Promote to `fn.constantResult` so the chain analysis
    // emits a synthetic update.
    if (MathExpressionNode.is(current)) {
      let final = current
      if (CopyNode.is(final) && LiteralNode.is(final.source)) {
        final = final.source
      }
      if (LiteralNode.is(final)) {
        this._fn!.constantResult = final
      }
      return node
    }
    // Record return: `_.return({ x: handle, y: handle })`. Each
    // field is tracked independently — a constant field gets its
    // value stored in `recordConstantResult[field]`; a non-constant
    // field is left for the compiler's imperative path.
    if (
      current !== null &&
      typeof current === 'object' &&
      !Array.isArray(current) &&
      Object.getPrototypeOf(current) === Object.prototype
    ) {
      const record = current as Record<string, unknown>
      if (!this._fn!.recordConstantResult) this._fn!.recordConstantResult = {}
      for (const [key, value] of Object.entries(record)) {
        // Fold the field's expression to a stable value. The return
        // visitor runs before every aggregate has been visited, so
        // a field that's a literal-foldable aggregate needs folding
        // here (not waiting for the post-return walk).
        let v = value
        if (MathExpressionNode.is(v)) {
          let expr: MathNode = v
          for (let iter = 0; iter < 32; iter++) {
            const next = this.visit(expr)
            if (next === expr) break
            if (!MathExpressionNode.is(next)) break
            expr = next
          }
          v = expr
        }
        if (CopyNode.is(v) && LiteralNode.is(v.source)) {
          v = v.source
        }
        if (LiteralNode.is(v)) {
          this._fn!.recordConstantResult![key] = v.value
        }
      }
    }
    return node
  }

  override visitIfNode(node: MathIfNode): MathNode {
    const condValue = node.condition.evaluateConstant()
    if (condValue === true) {
      // If-branch matches — fold it, drop the elseIf/else chain
      // from `allNodes` AND from the AST so the `run` walk doesn't
      // visit them and overwrite `fn.constantResult`.
      const next = node.nextFlowNode
      if (next) {
        this.removeChainFromAllNodes(next)
        node.nextFlowNode = undefined
      }
      for (let i = 0; i < node.body.length; i++) {
        node.body[i] = this.visit(node.body[i]) as typeof node.body[0]
      }
      return node
    }
    if (condValue === false) {
      // If-branch doesn't match — skip it, recurse into elseIf/else
      // as if they were the new head.
      const next = node.nextFlowNode
      if (next) {
        // Remove the dead if-branch from allNodes.
        for (const child of node.body) {
          this.removeFromAllNodes(child)
        }
        // Replace the if-node with its elseIf/else successor in the
        // body's chain. Easiest: recurse into the successor — the
        // visitor will handle it as a new head.
        this.visit(next)
      }
      return node
    }
    // Condition unknown — fold all branches (imperative lowering
    // handles the runtime dispatch).
    return this.genericVisit(node)
  }

  /**
   * Walk a clause chain (`MathIfNode` → `nextFlowNode` → ...) and
   * remove every node from `fn.allNodes`. Used when a condition folds
   * to a known value and the unselected branches are dead code.
   */
  private removeChainFromAllNodes(start: MathNode): void {
    const visited = new Set<MathNode>()
    const queue: MathNode[] = [start]
    while (queue.length > 0) {
      const node = queue.shift()!
      if (visited.has(node)) continue
      visited.add(node)
      this.removeFromAllNodes(node)
      // Recurse into clause successors + body.
      if (MathIfNode.is(node) && node.nextFlowNode !== undefined) {
        queue.push(node.nextFlowNode)
      }
      if (MathFlowClauseNode.is(node)) {
        for (const child of node.body) {
          queue.push(child)
        }
      }
    }
  }

  private removeFromAllNodes(node: MathNode): void {
    if (this._fn) {
      // Mutate in place — `run` already captured the array reference
      // and is iterating over the original indices. Reassigning
      // `allNodes` to a new array would leave the iterator walking
      // the stale (now-mutated) copy.
      const idx = this._fn.allNodes.indexOf(node)
      if (idx >= 0) this._fn.allNodes.splice(idx, 1)
    }
  }

  // -------------------------------------------------------------------------
  // Fold logic
  // -------------------------------------------------------------------------

  private tryFoldBinary(node: BinaryOpNode): LiteralNode | MathExpressionNode | undefined {
    const [a, b] = node.operands

    // Identity rules with a literal on either side. The literal
    // collapses; the other side survives regardless of being
    // constant or not.
    if (LiteralNode.is(a) && a.value === 0) {
      switch (node.op) {
        case 'add': return b // 0 + x = x
        case 'mul': return a // 0 * x = 0
        case 'div': return a // 0 / x = 0
        case 'pow': return this.literal(node.sandstoneCore, 1) // 0^x = 1 for x > 0
        // sub(0, x) → negate(x) lives in AlgebraicSimplificationVisitor
        // (changes op shape, doesn't fold to a constant).
        default: break
      }
    }
    if (LiteralNode.is(b) && b.value === 0) {
      switch (node.op) {
        case 'add': return a // x + 0 = x
        case 'sub': return a // x - 0 = x
        case 'mul': return this.literal(node.sandstoneCore, 0) // x * 0 = 0
        case 'pow': return this.literal(node.sandstoneCore, 1) // x^0 = 1
        default: break
      }
    }
    if (LiteralNode.is(a) && a.value === 1 && node.op === 'mul') return b
    if (LiteralNode.is(b) && b.value === 1) {
      switch (node.op) {
        case 'mul': return a // x * 1 = x
        case 'div': return a // x / 1 = x
        case 'pow': return a // x^1 = x
        default: break
      }
    }

    // Both operands literal: evaluate to a constant.
    const value = node.evaluateAsConstant()
    if (value === undefined) return undefined
    const folded = this.literal(node.sandstoneCore, value)
    this._newRootLiterals.push(folded)
    return folded
  }

  /**
   * Aggregate identity filter. Returns:
   *   - `LiteralNode` when an absorbing literal is present (e.g.
   *     `mul([0, ...])` → `0`) or when filtering leaves an empty
   *     input list (e.g. `add([0])` → `0`).
   *   - The single surviving operand when filtering reduces the
   *     input list to one non-identity element (e.g. `mul([1, x])`
   *     → `x`). Caller's in-place mutation wires it in.
   *   - `undefined` when no filterable identity literals exist
   *     AND the input list has more than one non-identity
   *     survivor (defer to all-literal evaluation).
   *
   * Filters `node.inputs` IN PLACE; if the caller chooses not to
   * fold (returns `undefined`), the in-place filtering still
   * applies for the next fold attempt.
   */
  private tryFilterAggregateInputs(node: AggregateNode): LiteralNode | MathExpressionNode | undefined {
    if (node.op !== 'add' && node.op !== 'mul') return undefined
    const identity = node.op === 'add' ? 0 : 1
    const absorbing = node.op === 'mul' ? 0 : null

    // Absorbing literal short-circuits regardless of other inputs.
    if (absorbing !== null) {
      const hasAbsorber = node.inputs.some(
        (n) => LiteralNode.is(n) && n.value === absorbing,
      )
      if (hasAbsorber) return this.literal(node.sandstoneCore, absorbing)
    }

    // Filter identity literals.
    const before = node.inputs.length
    const filtered = node.inputs.filter(
      (n) => !LiteralNode.is(n) || n.value !== identity,
    )
    if (filtered.length === before) return undefined // no-op

    node.inputs = filtered

    if (filtered.length === 0) {
      // All inputs were identity literals (e.g. add([0, 0]) or
      // mul([1, 1])). The aggregate reduces to the identity value.
      return this.literal(node.sandstoneCore, identity)
    }
    if (filtered.length === 1) {
      // Only one input left — drop the aggregate entirely.
      // Unwrap `CopyNode`-of-`LiteralNode` so the chain analysis
      // sees the literal as the chain root (the synthetic
      // constant promote only fires on `LiteralNode`).
      let survivor: MathExpressionNode = filtered[0]
      if (CopyNode.is(survivor)) {
        const source = survivor.source
        if (LiteralNode.is(source)) survivor = source
      }
      return survivor
    }
    // Multiple survivors — input list is now smaller but the
    // aggregate still has work to do. Signal "no fold" so the
    // caller can try all-literal evaluation next.
    return undefined
  }

  private tryFoldAllLiteralAggregate(node: AggregateNode): LiteralNode | undefined {
    // Accept any node whose `evaluateAsConstant` returns a number.
    // Includes LiteralNode directly, plus CopyNode unwrapping to
    // one (a copy that wraps a known-constant input).
    const values = node.inputs.map((i) => i.evaluateAsConstant())
    if (values.some((v) => v === undefined)) return undefined
    const folded = this.literal(node.sandstoneCore, node.evaluateAsConstant()!)
    // Track as a fresh replacement — the orphan drain removes
    // `node` from `fn.allNodes`, so without this push the chain
    // analysis would have nothing to inspect for the now-folded
    // position.
    this._newRootLiterals.push(folded)
    return folded
  }

  private tryFoldUnary(node: UnaryOpNode): LiteralNode | undefined {
    if (!LiteralNode.is(node.operand)) return undefined
    const value = node.evaluateAsConstant()
    if (value === undefined) return undefined
    const folded = this.literal(node.sandstoneCore, value)
    this._newRootLiterals.push(folded)
    return folded
  }

  /**
   * Build a `LiteralNode` carrying `value`, rounded to single-
   * precision float to match MC's runtime math semantics.
   */
  private literal(core: SandstoneCore, value: number): LiteralNode {
    return new LiteralNode(core, Math.fround(value))
  }
}
