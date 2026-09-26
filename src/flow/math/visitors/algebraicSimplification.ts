import type { MathNode } from '../ast/MathNode'
import { MathExpressionNode } from '../ast/MathExpressionNode'
import type { MathFunctionNode } from '../ast/MathFunctionNode'
import { LiteralNode } from '../ast/nodes/leaves'
import { AggregateNode, BinaryOpNode, UnaryOpNode } from '../ast/nodes/operators'
import { MathVisitor } from './MathVisitor'

/**
 * `AlgebraicSimplificationVisitor` — apply safe algebraic identity
 * rewrites that reduce work WITHOUT requiring operands to be
 * constants.
 *
 * Sibling to `ConstantFoldingVisitor`:
 *
 * - **ConstantFoldingVisitor** turns expressions whose value is
 *   statically known into a `LiteralNode`. Operands must be
 *   literals (or foldable via identities) for the result to fold.
 * - **AlgebraicSimplificationVisitor** turns one expression shape
 *   into another equivalent shape — often (but not always) a
 *   literal. The result feeds `ConstantFoldingVisitor` downstream,
 *   which then collapses any literal outputs further.
 *
 * ## Safe rewrites (v1)
 *
 * Binary:
 *   - `sub(0, x)` → `negate(x)`
 *   - `sub(x, x)` → `0`  (structural identity on operands)
 *   - `div(x, x)` → `1`  (structural identity on operands)
 *   - `add(x, negate(x))` → `0`  (and symmetric `add(negate(x), x)`)
 *
 * Unary:
 *   - `negate(negate(x))` → `x`
 *
 * Intentionally omitted (unsafe / unclear win):
 *   - `mul(x, x)` → `pow(x, 2)` — `mul` and `pow` use different
 *     MC evaluation paths; rounding can differ at edges.
 *   - `add(x, x)` → `mul(2, x)` — same reason.
 *   - `sub(x, negate(x))` → `mul(2, x)` — needs careful kind
 *     handling (float result for `sub(float, negate(float))`,
 *     integer-only if both integer).
 *
 * ## Structural identity
 *
 * `x op x` and `x op negate(x)` cases compare operands via
 * `getStructuralKey()` — the same audit-trail key the chain
 * analysis uses. Two nodes are "the same" if their keys match,
 * which means same shape AND same literal value (for literals).
 * Two literals `5` and `5` at different AST positions have
 * distinct structural keys via position-uniqueness, so they don't
 * fold together (correct — they may be semantically independent).
 *
 * ## Pipeline position
 *
 * Runs AFTER `FlattenExpressionChainVisitor` (so LHS-extending
 * chains like `sub(sub(a, b), c)` are already absorbed) and
 * BEFORE `ConstantFoldingVisitor` (so literal results — `0`, `1`,
 * the surviving operand of double-negation — can be folded by
 * the folder's identity rules, and so `add([x, negate(x), 0])`
 * collapses to `add([x])`).
 *
 * ## Fixpoint via recursive `run`
 *
 * The visitor overrides `MathVisitor.run(fn)` to loop until no
 * pass produces any rewrites. A single bottom-up pass only cancels
 * pairs from the inside out — `negate(negate(negate(negate(x))))`
 * folds to `negate(negate(x))` on the first pass and only
 * collapses to `x` after a second. The fixpoint loop keeps
 * iterating until every reachable rewrite has been applied, so
 * the visitor fully reduces arbitrarily-nested identity chains
 * in a single registration.
 *
 * Each pass:
 *   1. Walks every node in `fn.allNodes` (chronological order).
 *   2. After the walk, drains the pass's new orphans from
 *      `fn.allNodes` (the runner's post-pass orphan filter would
 *      see stale references if we didn't).
 *   3. Pushes the pass's fresh replacements onto `fn.allNodes`
 *      (so the chain analysis sees them as roots or transients,
 *      not as orphan ghosts).
 *   4. Stops when a pass produces zero orphans AND zero fresh
 *      replacements — every rewrite reachable from the current
 *      AST has been applied.
 *
 * Fresh replacements are tracked generically (LiteralNode,
 * UnaryOpNode) — not just literals — because `sub(0, x) → negate(x)`
 * produces a fresh unary whose chain-rootedness depends on the
 * rewritten node's position. The chain analysis sorts out roots
 * vs. transients correctly once the fresh node is in `fn.allNodes`.
 */
export class AlgebraicSimplificationVisitor extends MathVisitor {
  /** Wrapping nodes absorbed during this run — drained per pass. */
  readonly orphans: Array<BinaryOpNode | AggregateNode | UnaryOpNode> = []
  /**
   * Fresh replacements created during this run. Pushed onto
   * `fn.allNodes` per pass so the chain analysis can classify
   * them. Includes `UnaryOpNode` (from `sub(0, x) → negate(x)`)
   * and `LiteralNode` (from `sub(x, x) → 0` etc.).
   */
  private readonly _freshNodes: Array<LiteralNode | UnaryOpNode> = []

  /**
   * Set of nodes that are referenced as a child (operand/input)
   * by some OTHER node in `fn.allNodes`. Such nodes were
   * "captured" by an enclosing expression at handle-construction
   * time — replacing them with a new sub-AST would change the
   * captured value of any handle whose `.node` points at them,
   * silently mutating downstream computations that read those
   * handles.
   *
   * Recomputed each pass because the AST mutates during rewrites.
   * Used to gate NON-LITERAL-producing rewrites at captured nodes
   * (literal-producing rewrites are always safe — literals have
   * no identity that other code can depend on).
   */
  private _capturedNodes: Set<MathNode> = new Set()

  override run(fn: MathFunctionNode): void {
    // Fixpoint loop: keep walking until a pass produces no
    // rewrites. Each pass drains its own orphans and pushes its
    // own fresh replacements onto `fn.allNodes` so the next pass
    // sees the up-to-date AST.
    while (true) {
      this._capturedNodes = computeCapturedNodes(fn)

      const orphansBefore = this.orphans.length
      const freshBefore = this._freshNodes.length

      // Walk all surviving nodes (post-orphan-filter from prior
      // passes). Each visit may mutate operands in place; the
      // return value threads through the parent's in-place
      // mutation (same pattern as the flattener / constant folder).
      for (const node of fn.allNodes) {
        this.visit(node)
      }

      const newOrphans = this.orphans.slice(orphansBefore)
      const newFresh = this._freshNodes.slice(freshBefore)

      let changed = false
      if (newOrphans.length > 0) {
        const orphanSet = new Set<MathNode>(newOrphans)
        fn.allNodes = fn.allNodes.filter((n) => !orphanSet.has(n))
        changed = true
      }
      if (newFresh.length > 0) {
        for (const fresh of newFresh) {
          fn.allNodes.push(fresh)
        }
        changed = true
      }

      if (!changed) break
    }
  }

  override visitBinaryOpNode(node: BinaryOpNode): MathNode {
    // Recurse first so deeper rewrites are visible.
    const oldL = node.operands[0]
    const oldR = node.operands[1]
    const newL = this.visit(oldL) as MathExpressionNode
    const newR = this.visit(oldR) as MathExpressionNode
    if (newL !== oldL) node.operands[0] = newL
    if (newR !== oldR) node.operands[1] = newR

    const result = this.tryRewriteBinary(node)
    if (result === undefined) return node
    this.orphans.push(node)
    if (LiteralNode.is(result) || UnaryOpNode.is(result)) {
      this._freshNodes.push(result)
    }
    return result
  }

  override visitUnaryOpNode(node: UnaryOpNode): MathNode {
    const oldOperand = node.operand
    const newOperand = this.visit(oldOperand) as MathExpressionNode
    if (newOperand !== oldOperand) {
      // Operand changed — allocate a fresh node carrying the new
      // operand and let the caller's in-place mutation wire it in.
      const replacement = new UnaryOpNode(
        node.sandstoneCore,
        node.op,
        newOperand,
      )
      this.orphans.push(node)
      this._freshNodes.push(replacement)
      return replacement
    }

    const result = this.tryRewriteUnary(node)
    if (result === undefined) return node
    this.orphans.push(node)
    // `negate(negate(x)) → x` returns an EXISTING operand (already
    // in `fn.allNodes` from a prior visit) — no fresh tracking.
    if (LiteralNode.is(result) || UnaryOpNode.is(result)) {
      this._freshNodes.push(result)
    }
    return result
  }

  override visitAggregateNode(node: AggregateNode): MathNode {
    const oldInputs = node.inputs
    const newInputs = oldInputs.map((i) => this.visit(i) as MathExpressionNode)
    for (let i = 0; i < newInputs.length; i++) {
      if (newInputs[i] !== oldInputs[i]) {
        node.inputs[i] = newInputs[i]
      }
    }

    const result = this.tryRewriteAggregate(node)
    if (result === undefined) return node
    this.orphans.push(node)
    if (LiteralNode.is(result) || UnaryOpNode.is(result)) {
      this._freshNodes.push(result)
    }
    return result
  }

  // -------------------------------------------------------------------------
  // Rewrites
  // -------------------------------------------------------------------------

  private tryRewriteBinary(node: BinaryOpNode): MathExpressionNode | undefined {
    const [a, b] = node.operands
    const core = node.sandstoneCore

    // sub(0, x) → negate(x). Identity: 0 - x = -x for all x.
    // NON-LITERAL rewrite — only safe when `node` is captured by
    // some other fn.allNodes expression (parent will mutate its
    // operand reference in place to wire the new unary in). At a
    // chain root (no parent), rewriting leaves a unary root that
    // the compiler doesn't emit — the chain silently produces no
    // command and the result storage stays at its default.
    if (LiteralNode.is(a) && a.value === 0 && node.op === 'sub') {
      if (!this._capturedNodes.has(node)) return undefined
      return new UnaryOpNode(core, 'negate', b)
    }

    // sub(x, x) → 0, div(x, x) → 1. Literal output — always
    // safe. The compiler inlines literal values; no chain-command
    // lifecycle depends on the wrapper node's identity.
    if (a.getStructuralKey() === b.getStructuralKey()) {
      switch (node.op) {
        case 'sub': return new LiteralNode(core, 0)
        case 'div': return new LiteralNode(core, 1)
        default: break
      }
    }

    // add(x, negate(x)) → 0. Literal output — always safe (same
    // reason as `sub(x, x) → 0`).
    if (node.op === 'add') {
      if (
        UnaryOpNode.is(b) &&
        b.op === 'negate' &&
        a.getStructuralKey() === b.operand.getStructuralKey()
      ) {
        return new LiteralNode(core, 0)
      }
      if (
        UnaryOpNode.is(a) &&
        a.op === 'negate' &&
        a.operand.getStructuralKey() === b.getStructuralKey()
      ) {
        return new LiteralNode(core, 0)
      }
    }

    return undefined
  }

  private tryRewriteUnary(node: UnaryOpNode): MathExpressionNode | undefined {
    // negate(negate(x)) → x. NON-LITERAL rewrite — only safe when
    // `node` is captured. At a chain root, rewriting leaves an
    // unwrapped operand that nothing references; the compiler
    // has no operator to emit and the result storage stays
    // unset. (At a captured position, the parent's in-place
    // operand reassignment wires the inner operand in cleanly.)
    if (
      node.op === 'negate' &&
      UnaryOpNode.is(node.operand) &&
      node.operand.op === 'negate'
    ) {
      if (!this._capturedNodes.has(node)) return undefined
      return node.operand.operand
    }
    return undefined
  }

  private tryRewriteAggregate(node: AggregateNode): MathExpressionNode | undefined {
    // Cancellation: drop `add([x, negate(x)])` pairs in any order.
    // Structural-identity comparison means `x` and `negate(x)` match
    // when their underlying operands match — different AST positions
    // for the same source literal both cancel.
    //
    // When the cancellation empties the list, `add([])` reduces to
    // the literal `0` (the additive identity). When a pair is
    // removed but other inputs remain, the aggregate keeps its
    // `add` shape; `ConstantFoldingVisitor.tryFilterAggregateInputs`
    // handles the downstream collapse (single survivor → its
    // operand, all-literal → constant).
    if (node.op !== 'add') return undefined

    const inputs = node.inputs
    const toRemove = new Set<MathExpressionNode>()
    for (let i = 0; i < inputs.length; i++) {
      const a = inputs[i]
      if (toRemove.has(a)) continue
      for (let j = i + 1; j < inputs.length; j++) {
        const b = inputs[j]
        if (toRemove.has(b)) continue
        // `a` is `negate(x)` and `b` matches `x`, OR vice versa.
        const aIsNeg = UnaryOpNode.is(a) && a.op === 'negate'
        const bIsNeg = UnaryOpNode.is(b) && b.op === 'negate'
        if (
          (aIsNeg && b.getStructuralKey() === a.operand.getStructuralKey()) ||
          (bIsNeg && a.getStructuralKey() === b.operand.getStructuralKey())
        ) {
          toRemove.add(a)
          toRemove.add(b)
          break
        }
      }
    }

    if (toRemove.size === 0) return undefined

    node.inputs = inputs.filter((n) => !toRemove.has(n))
    if (node.inputs.length === 0) {
      // All inputs cancelled — `add([])` = 0.
      return new LiteralNode(node.sandstoneCore, 0)
    }
    // Some inputs remain — the parent keeps the aggregate node; the
    // in-place mutation above ensures the chain sees the filtered
    // input list. `tryFoldAllLiteralAggregate` in the constant
    // folder handles the all-literal collapse on the next pass.
    return undefined
  }
}

/**
 * Build the set of nodes referenced as a child (operand/input) by
 * some OTHER node in `fn.allNodes`. Such nodes were captured by an
 * enclosing expression at handle-construction time — a downstream
 * handle, aggregate, or binary already read them.
 *
 * Algebraic simplification gates non-literal-producing rewrites on
 * this set: if a captured `sub(0, x)` is rewritten to a fresh
 * `negate(x)`, the handle that held the `sub(0, x)` still points at
 * the OLD (now-orphaned) binary, while the downstream expression
 * that captured the node reads it as the FRESH unary. The two
 * diverge — downstream computations silently see a different value
 * than what the handle was mutated to.
 *
 * Captured-set membership is recomputed each pass because the AST
 * mutates during rewrites (a fresh replacement may itself be
 * captured by a surviving parent).
 */
function computeCapturedNodes(fn: MathFunctionNode): Set<MathNode> {
  const captured = new Set<MathNode>()
  for (const node of fn.allNodes) {
    if (BinaryOpNode.is(node)) {
      captured.add(node.operands[0])
      captured.add(node.operands[1])
    } else if (AggregateNode.is(node)) {
      for (const input of node.inputs) captured.add(input)
    } else if (UnaryOpNode.is(node)) {
      captured.add(node.operand)
    }
  }
  return captured
}
