import type { MathNode } from '../ast/MathNode'
import { MathExpressionNode } from '../ast/MathExpressionNode'
import type { MathFunctionNode } from '../ast/MathFunctionNode'
import { AggregateNode, BinaryOpNode, UnaryOpNode } from '../ast/nodes/operators'
import { MathVisitor } from './MathVisitor'

/**
 * Aggregate ops whose `inputs` list is a SAFE flat representation
 * (algebraically commutative + associative AND accepted by MC's
 * n-ary provider shape).
 *
 * For these, `agg([a, b], [c, d])` → `agg([a, b, c, d])` — just
 * concatenate the input lists.
 */
const FLATTENABLE_AGGREGATE_OPS = new Set<string>(['add', 'mul', 'min', 'max'])

/**
 * Binary ops whose LHS-extending chain can be restructured into a
 * shorter expression by absorbing the chain into the RHS using a
 * DIFFERENT op.
 *
 * Algebraic identities (left-associative interpretation):
 *   - `sub(sub(a, b), c)` = `(a - b) - c` = `a - b - c` = `sub(a, add(b, c))`.
 *     Chain absorbs into `add` on the RHS.
 *   - `div(div(a, b), c)` = `(a / b) / c` = `a / (b * c)` = `div(a, mul(b, c))`.
 *     Chain absorbs into `mul` on the RHS.
 *   - `pow(pow(a, b), c)` = `(a^b)^c` = `a^(b*c)` = `pow(a, mul(b, c))`.
 *     Chain absorbs into `mul` on the RHS (MC's `pow` provider has
 *     `{base, exponent}` shape — binary, same identity class as
 *     `div`).
 *
 * `mod` is NOT in this map — its chain doesn't have a safe
 * algebraic identity:
 *   - `(a mod b) mod c` ≠ `a mod (b * c)` and ≠ any simple form.
 */
type ChainAbsorber = {
  /** The op the absorbed RHS becomes (e.g. `sub` chain → `add`). */
  rhsOp: 'add' | 'mul'
}
const BINARY_CHAIN_ABSORBERS: Record<string, ChainAbsorber> = {
  sub: { rhsOp: 'add' },
  div: { rhsOp: 'mul' },
  pow: { rhsOp: 'mul' },
}

/**
 * `FlattenExpressionChainVisitor` — collapse chains of same-op
 * expression nodes into the shortest structurally-equivalent form.
 *
 * ## What "expression chain" means here
 *
 * Every mutator handle method that chains a new value onto the
 * handle's current expression produces a wrapping node. Examples:
 *
 *   - `rx['+='](val)` → `Aggregate(add, [rx.node, val])`.
 *   - `rx['*='](val)` → `Aggregate(mul, [rx.node, val])`.
 *   - `rx['-='](val)` → `BinaryOpNode(sub, [rx.node, val])`.
 *   - `rx['/='](val)` → `BinaryOpNode(div, [rx.node, val])`.
 *
 * Two consecutive `+=` calls produce
 * `Aggregate(add, [Aggregate(add, [start, a]), b])` — a left-nested
 * chain. Same shape for `-=`/`/=` etc. The compiler emits ONE
 * imperative `data modify ... compute ... float <provider>` command
 * per chain-extension node, with the inner node's storage write
 * immediately overwritten by the outer — pure waste.
 *
 * ## What's safe to flatten
 *
 * - **`add` / `mul` / `min` / `max`** (n-ary aggregates,
 *   commutative + associative): flatten directly. Inner same-op
 *   aggregate's `inputs` get concatenated into the outer's `inputs`.
 * - **`sub` / `div`** (binary, left-associative): flatten via
 *   LHS-extending chain. Inner same-op `binop`'s RHS gets merged
 *   into the outer's RHS using `add` / `mul` respectively:
 *   `sub(sub(a, b), c)` → `sub(a, add(b, c))`.
 * - **`mod`**: not flattenable. `(a mod b) mod c` ≠ any simple form.
 * - **`pow`**: not in `BINARY_CHAIN_ABSORBERS`. (Also no MC
 *   provider at the moment — would need both flattening AND a new
 *   MC provider shape.)
 *
 * ## Why the visitor mutates `node.inputs` instead of returning a
 * replacement node
 *
 * The visitor pattern's `return newNode` semantics assume the
 * caller updates parent references. Our runner iterates
 * `fn.allNodes` and doesn't maintain a parent index, so a
 * returned replacement would be orphaned (still in `allNodes`
 * with old `inputs`/`operands`, replaced node unreachable).
 * Mutating `node.inputs` keeps the original reference (and its
 * audit-trail slot) intact while replacing its contents.
 *
 * ## Data preservation
 *
 * Absorbed nodes' operands/inputs stay in `fn.allNodes` — they're
 * the values being combined. Any future visitor that needs to
 * link back to the original sequence still finds them via the
 * surviving reference's children. Only the redundant wrapping
 * node itself is dropped (via `orphans` → runner filter).
 */
export class FlattenExpressionChainVisitor extends MathVisitor {
  /**
   * Wrapping nodes that got absorbed during this pass. Drained by
   * the runner after the visit completes — filtered out of
   * `fn.allNodes` so the compiler's chronological walk doesn't
   * re-emit imperative commands for them (they'd duplicate the
   * surviving node's write).
   */
  readonly orphans: Array<AggregateNode | BinaryOpNode> = []

  override visitAggregateNode(node: AggregateNode): MathNode {
    if (!FLATTENABLE_AGGREGATE_OPS.has(node.op)) {
      // Not a known-flattenable aggregate (e.g. `length`, `avg`).
      // `avg` would be tempting (commutative) but isn't truly
      // associative: avg(avg(a, b), c) ≠ avg(a, b, c) when the
      // inner set's cardinality isn't 2. Bail out — leave for a
      // future visitor pass if MC adds n-ary `avg` support.
      return super.visitAggregateNode(node)
    }

    // Step 1: flatten any direct nested aggregates of the SAME op.
    // `[[a, b], c]` → `[a, b, c]`. Same-op check ensures the
    // algebraic identity holds; only-flattenable-ops gate ensures
    // the MC provider accepts the result.
    const innerAbsorbed: AggregateNode[] = []
    const flatInputs: MathExpressionNode[] = []
    for (const input of node.inputs) {
      if (
        AggregateNode.is(input) &&
        input.op === node.op &&
        FLATTENABLE_AGGREGATE_OPS.has(input.op)
      ) {
        flatInputs.push(...input.inputs)
        innerAbsorbed.push(input)
      } else {
        flatInputs.push(input)
      }
    }

    // Step 2: recurse into each flattened input. `this.visit(input)`
    // dispatches by concrete type; nested aggregates further down
    // get flattened in the same pass via recursion. Non-aggregate
    // inputs recurse normally (e.g. a nested BinOp inside the
    // aggregate still gets visited for any deeper transform
    // passes — including `visitBinaryOpNode` below for sub/div
    // chains).
    const newInputs = flatInputs.map((i) => this.visit(i) as MathExpressionNode)

    if (
      innerAbsorbed.length === 0 &&
      newInputs.every((n, i) => n === flatInputs[i])
    ) {
      return node
    }

    node.inputs = newInputs
    this.orphans.push(...innerAbsorbed)
    return node
  }

  override visitBinaryOpNode(node: BinaryOpNode): MathNode {
    const absorber = BINARY_CHAIN_ABSORBERS[node.op]
    if (!absorber) {
      // No safe chain form for this op (`mod`, `pow`, ...). Just
      // recurse into operands normally — they might still be
      // aggregate chains that this visitor can flatten.
      return super.visitBinaryOpNode(node)
    }

    // Recurse first so deeper chains get fully resolved before we
    // check for the LHS-extending pattern. `super.visitBinaryOpNode`
    // recurses into both operands via `visit`; doing the same here
    // manually lets us inspect the visited operands.
    const newLhs = this.visit(node.operands[0]) as MathExpressionNode
    const newRhs = this.visit(node.operands[1]) as MathExpressionNode

    // LHS-extending chain: `binop(binop(a, b), c)` → `binop(a, combine(b, c))`.
    // `combine` is `add` for `sub`, `mul` for `div` — the algebraic
    // identity `sub(a, b) - c = a - (b + c)` (and the div analogue).
    //
    // RHS-extending chains like `binop(a, binop(b, c))` are NOT
    // safe to transform — `a - (b - c) ≠ a - b - c` — so we only
    // match LHS patterns.
    if (
      BinaryOpNode.is(newLhs) &&
      newLhs.op === node.op
    ) {
      const innerLhs = newLhs.operands[0]
      const innerRhs = newLhs.operands[1]
      // Build the absorbing node: `combine(innerRhs, newRhs)` —
      // also recurse into its operands so any nested chains there
      // get flattened in the same pass. The absorbing op is ALWAYS
      // an `add` or `mul` aggregate (per `BINARY_CHAIN_ABSORBERS`
      // above), and MC's `add` / `mul` providers are aggregate-only
      // (`{type, inputs: [...]}` — no binary `{left, right}` shape
      // exists for these ops in the JSON spec). Using a `BinaryOpNode`
      // here would create a shape the compiler can't emit; using
      // `AggregateNode` keeps the flattened AST serializable.
      const absorbedRhs = new AggregateNode(
        node.sandstoneCore,
        absorber.rhsOp,
        [this.visit(innerRhs) as MathExpressionNode, this.visit(newRhs) as MathExpressionNode],
        // Kind follows the operands — both innerRhs and newRhs share
        // kind (operator kind is per-side; the compiler will widen
        // via `from_int` if needed).
        innerRhs.kind,
      )
      // Outer survives; its operands become [innerLhs, absorbedRhs].
      node.operands[0] = innerLhs
      node.operands[1] = absorbedRhs
      this.orphans.push(newLhs)
      return node
    }

    if (
      newLhs === node.operands[0] &&
      newRhs === node.operands[1]
    ) {
      return node
    }
    node.operands[0] = newLhs
    node.operands[1] = newRhs
    return node
  }
}

/**
 * Run the flatten pass against a math function. Returns the same
 * `MathFunctionNode` instance, mutated, with absorbed nodes removed
 * from `allNodes` so the compiler's chronological walk doesn't
 * re-emit imperative commands for them.
 *
 * The visitor itself never deletes nodes — orphan removal is the
 * runner's responsibility. This keeps the visitor composable: a
 * downstream visitor that wants to inspect the pre-removal AST can
 * do so before `runFlattenExpressionChainVisitor` drains `orphans`.
 *
 * Iterates `fn.allNodes` directly (rather than starting at the
 * math function node via `MathVisitor.visit()`) because chain
 * state lives in the audit trail, not the body tree. The body's
 * `MathReturnNode` references the FINAL chain state (one node),
 * but the chain's intermediate nodes (each `+=`/`-=` step) only
 * exist in `allNodes`. A `visit()`-driven traversal would miss
 * them.
 */
export function runFlattenExpressionChainVisitor(
  fn: MathFunctionNode,
): MathFunctionNode {
  const visitor = new FlattenExpressionChainVisitor()
  for (const node of fn.allNodes) {
    if (AggregateNode.is(node)) {
      visitor.visit(node)
    } else if (BinaryOpNode.is(node)) {
      visitor.visit(node)
    }
  }
  if (visitor.orphans.length > 0) {
    const orphanSet = new Set(visitor.orphans)
    fn.allNodes = fn.allNodes.filter((n) => !orphanSet.has(n as never))
  }
  return fn
}

// Re-export so callers can `import { FlattenExpressionChainVisitor }`
// without reaching into the math AST module.
export { MathExpressionNode, UnaryOpNode }