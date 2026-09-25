import * as util from 'util'
import type { SandstoneCore } from '../../../../core/sandstoneCore'
import type { MathConditionNode } from '../MathConditionNode'
import { MathNode } from '../MathNode'
import {
  formatArgValue,
  formatMath,
  formatMathLeaf,
  getIndent,
  MATH_NODE_DEFAULT_DEPTH,
} from '../inspectHelpers'
import type { MathExpressionNode } from '../MathExpressionNode'
import type { Float, Integer } from '../handles'
import type { MathFunctionNode } from '../MathFunctionNode'
import { MathContainerNode } from '../MathContainerNode'

// ---------------------------------------------------------------------------
// Shared base for if/elseIf/else clauses.
// ---------------------------------------------------------------------------

/**
 * Shared base for `MathIfNode` / `MathElseIfNode` / `MathElseNode`.
 *
 * Mirrors `flow/if_else.ts#FlowClauseNode` semantics:
 *   - Tracks `parentMathFunction` (the enclosing `MathFunctionNode`).
 *   - Links to the next clause via `nextFlowNode` for if→elseIf→else
 *     chains.
 *   - Body is populated by running the user callback inside
 *     `parentMathFunction.balanceContext(this, callback)` so any
 *     accidentally-pushed nested contexts (rare in math DSL but possible
 *     if a condition side-effect runs side AST work) pop back cleanly.
 *
 * Differs from MCFunction flow:
 *   - No `.run` single-command mode — math bodies are value-producing,
 *     not command-producing.
 *   - No `singleCommandFunction` / `singleCommandDepth` — no proxy.
 *   - `_isElseIf` flag still distinguishes head-of-chain vs mid-chain.
 *   - Empty body is rejected at construction (same as MCFunction flow).
 */
export abstract class MathFlowClauseNode extends MathContainerNode {
  /** Enclosing math function. Set by constructor. */
  parentMathFunction: MathFunctionNode

  /** Next clause in the chain (elseIf/else). Undefined for tail. */
  nextFlowNode?: MathFlowClauseNode

  /** True if this is an elseIf (mid-chain), false if it's the if head. */
  _isElseIf = false

  constructor(sandstoneCore: SandstoneCore) {
    super(sandstoneCore)
    this.parentMathFunction = sandstoneCore.mathStack[sandstoneCore.mathStack.length - 1] as MathFunctionNode
  }

  /**
   * Append a node to the body. No context pop — math bodies don't open
   * a single-command proxy (unlike MCFunction flow's `.run` form).
   */
  append = (...nodes: MathNode[]) => {
    this.body.push(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    const repr = this.inspectClassName
    const head = this._isElseIf ? ' (continuation)' : ''
    const hasCondition = 'condition' in this
    const indent = getIndent(options)
    const children: unknown[] = []
    if (hasCondition) {
      const c = (this as unknown as { condition: MathConditionNode }).condition
      // Condition goes first in the body — emits as the first child.
      // The wrapper's args don't carry a redundant `if=…` string; the
      // condition's own class name distinguishes it inside the body.
      children.push(c)
    }
    const bodyWithNext = this.nextFlowNode ? [...this.body, this.nextFlowNode] : this.body
    children.push(...bodyWithNext)
    return formatMath(
      this._isElseIf ? `${repr} (continuation)` : repr,
      undefined,
      children,
      depth,
      indent,
    )
  }
}

/**
 * `_.if(cond, () => { ... })` — head of an if/elseIf/else chain.
 *
 * Body is a statement list of math nodes (expressions, nested ifs,
 * returns, etc.). The clause's value is the LAST expression in the
 * body OR the explicit `_.return(value)` — that detail is for the
 * lowerer to determine.
 *
 * Throws on empty body (same rationale as MCFunction flow).
 */
export class MathIfNode extends MathFlowClauseNode {
  /** Type guard. */
  static is(node: unknown): node is MathIfNode {
    return node instanceof MathIfNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    readonly condition: MathConditionNode,
    callback: () => void,
  ) {
    super(sandstoneCore)
    // Mark the condition as a child of this clause for AST
    // parent-chain dedup in inspectors — without this, the condition
    // appears at top level in `allNodes` (no parent) AND nested in
    // the if clause's body (since MathIfNode's render walks
    // `this.condition`).
    this.condition.parent = this
    this.parentMathFunction.balanceContext(this, callback)

    // Commit self to the enclosing container's body so the AST debug
    // walk surfaces the if-clause. Without this, MathIfNode only ever
    // lives on `parentMathFunction.allNodes` (via the MathNode base
    // registration) and the inspector would render it only as an
    // orphan expression — never as a structured flow node with its
    // condition + body. body + allNodes display together covers both
    // the statement and the audit trail.
    const outer = sandstoneCore.mathStack[sandstoneCore.mathStack.length - 1]
    if (outer && outer !== this && 'append' in outer) {
      ;(outer as unknown as { append: (n: MathNode) => void }).append(this)
    }

    if (this.body.length === 0) {
      throw new Error(
        'Math if body is empty. Add at least one statement, or remove the branch.',
      )
    }
  }

  /**
   * Lowering strategy — the compiler picks ONE based on the condition,
   * flow depth, and intermediate usage:
   *
   *   - **Inline pure**: condition is a pure comparison of provider
   *     values (e.g., `x['=='](5)`). Lowerer folds this into a
   *     `number_dispatcher` case with the condition as inline
   *     LootCondition JSON. Zero mcfunction commands.
   *
   *   - **Mixed**: condition requires imperative setup (mutations,
   *     reads of mutable state). Lowerer emits a small mcfunction that
   *     uses SandstoneFlow's `execute if/unless` style to evaluate
   *     the condition imperatively, writes the matched case value to
   *     a storage path, and the `number_dispatcher` provider reads
   *     that path via a `storage` provider. Imperative gate, lazy
   *     read.
   *
   *   - **Full flow-style mcfunction**: flow is too deep / too many
   *     combinators / intermediates shared with downstream steps that
   *     need mcfunction-side state. Lowerer converts the entire
   *     `_.if`/`_.elseIf`/`_.else` chain into a SandstoneFlow
   *     mcfunction that mirrors the same logic via `execute if/unless`,
   *     stores ONE value, and the provider is a simple `storage`
   *     reader.
   *
   * The lowerer picks based on:
   *   1. **What conditions run** — pure provider comparisons inline;
   *      anything with side effects forces at least Mixed.
   *   2. **How complex the flow is** — nested `and`/`or`/`not` chains
   *      that can't be expressed as inline LootCondition push toward
   *      Full flow-style.
   *   3. **How intermediates are used** — if a case body writes to NBT
   *      or scores that other steps (downstream provider evaluations
   *      or subsequent mcfunction commands) depend on, the compiler
   *      must materialize those writes in an mcfunction so the order
   *      is deterministic.
   */
  getValue() {
    return {
      type: 'MathIf',
      isElseIf: this._isElseIf,
      condition: this.condition.getValue(),
      body: this.body.map((n) => n.getValue()),
    }
  }
}

/**
 * `_.elseIf(cond, () => { ... })` — mid-chain clause with a condition.
 *
 * Structurally identical to `MathIfNode` but flagged via `_isElseIf` so
 * the lowerer can emit `cases` for it (rather than the head of a new
 * `number_dispatcher`). Same body + empty-check rules.
 */
export class MathElseIfNode extends MathFlowClauseNode {
  /** Type guard. */
  static is(node: unknown): node is MathElseIfNode {
    return node instanceof MathElseIfNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    readonly condition: MathConditionNode,
    callback: () => void,
  ) {
    super(sandstoneCore)
    this._isElseIf = true
    this.parentMathFunction.balanceContext(this, callback)

    if (this.body.length === 0) {
      throw new Error(
        'Math elseIf body is empty. Add at least one statement, or remove the branch.',
      )
    }
  }

  getValue() {
    return {
      type: 'MathElseIf',
      condition: this.condition.getValue(),
      body: this.body.map((n) => n.getValue()),
    }
  }
}

/**
 * `_.else(() => { ... })` — terminal clause. No condition. Same body
 * rules; empty body allowed (semantically: do nothing for the else
 * branch — equivalent to `_.if(cond, cb).elseIf(cb).else(() => {})`).
 *
 * Mirrors `flow/if_else.ts#ElseNode` (no condition, terminal).
 */
export class MathElseNode extends MathFlowClauseNode {
  /** Type guard. */
  static is(node: unknown): node is MathElseNode {
    return node instanceof MathElseNode
  }

  constructor(sandstoneCore: SandstoneCore, callback: () => void) {
    super(sandstoneCore)
    this.parentMathFunction.balanceContext(this, callback)
  }

  getValue() {
    return {
      type: 'MathElse',
      body: this.body.map((n) => n.getValue()),
    }
  }
}

// ---------------------------------------------------------------------------
// Return statement.
// ---------------------------------------------------------------------------

/**
 * `_.return(value)` — terminate the current control path with `value`.
 *
 * A statement (NOT an expression). Extends `MathNode` directly; the
 * lowerer reads it from the parent clause's body and uses `value` as
 * the case's resolved value. Multiple returns in different paths merge
 * via `number_dispatcher` cases; one return → single `conditional`
 * provider.
 *
 * `value` may be a `Float` / `Integer` handle (for single-value
 * returns) or a record `{x: Float, y: Float}` matching the math
 * function's outputs schema (for record returns — see
 * `display.ts#reverseVectorAndScale`). Record dispatch is the
 * lowerer's concern.
 */
export class MathReturnNode extends MathNode {
  /** Type guard. */
  static is(node: unknown): node is MathReturnNode {
    return node instanceof MathReturnNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    readonly value: Float | Integer | Record<string, Float | Integer> | unknown,
  ) {
    super(sandstoneCore)
  }

  getValue() {
    return {
      type: 'MathReturn',
      value: typeof this.value === 'object' && this.value !== null && 'getValue' in this.value
        ? (this.value as { getValue: () => unknown }).getValue()
        : this.value,
    }
  }

  /**
   * Statement node — value is a Float/Integer handle, a record of
   * handles, or any user value. Delegates to `formatArgValue` so
   * each handle's own `[util.inspect.custom]` fires (showing the
   * current value-expression — i.e., what's actually being set
   * here at return time).
   *
   * For record-shaped return values (`{x: rx, y: ry, z: rz}`), a
   * single `formatArgValue` call gets the static `<Object {x,y,z}>`
   * summary — plain object literals have no `[util.inspect.custom]`.
   * Walk the entries ourselves so each value fires its own custom
   * renderer (handles → current expression; literals → literal).
   */
  [util.inspect.custom](_depth?: number, options?: unknown): string {
    const v = this.value as unknown
    let valueText: string
    if (
      v !== null &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      Object.getPrototypeOf(v) === Object.prototype
    ) {
      // Plain record — walk entries so handle values fire their
      // own `[util.inspect.custom]`.
      const parts = Object.entries(v as Record<string, unknown>).map(
        ([k, val]) => `${k}: ${formatArgValue(val as Parameters<typeof formatArgValue>[0])}`,
      )
      valueText = `{${parts.join(', ')}}`
    } else {
      valueText = formatArgValue(v as Parameters<typeof formatArgValue>[0])
    }
    return `${getIndent(options)}${this.inspectClassName}(value=${valueText})`
  }
}

// ---------------------------------------------------------------------------
// Switch.
// ---------------------------------------------------------------------------

/**
 * Tagged case node kinds for `MathSwitchNode`:
 *   - `MathCaseNode` — static value match (`dispatch === caseValue`).
 *     `caseValue` is the Float/Integer literal to match against.
 *   - `MathConditionCaseNode` — callback receives the dispatch handle,
 *     returns a `MathConditionNode` (any inline predicate; used for
 *     range/composite matches).
 *   - `MathDefaultCaseNode` — terminal default branch. No condition;
 *     body may be empty.
 *
 * All three are `MathContainerNode`s. Bodies are populated by
 * `MathSwitchNode` running each callback via `balanceContext`.
 *
 * **Per-output decomposition.** The lowerer walks the switch once per
 * output field. Each case body's `_.return(value: V extends R)` record
 * is decomposed: the value for THIS output field becomes the case's
 * `value` slot in that field's provider. The other fields' values are
 * picked up by their own per-field walks (not by this case).
 *
 * Example for `{x, y, z}` outputs and case `case(0, () => _.return({x:1, y:2, z:3}))`:
 *   - field `x`'s provider case: condition=`<dispatch==0>`, value=`1`
 *   - field `y`'s provider case: condition=`<dispatch==0>`, value=`2`
 *   - field `z`'s provider case: condition=`<dispatch==0>`, value=`3`
 */

/** Static-value case: matches when `dispatch === caseValue`. */
export class MathCaseNode extends MathContainerNode {
  /** Type guard. */
  static is(node: unknown): node is MathCaseNode {
    return node instanceof MathCaseNode
  }

  parentMathFunction: MathFunctionNode

  constructor(
    sandstoneCore: SandstoneCore,
    readonly caseValue: Float | Integer | number,
    callback: () => void,
  ) {
    super(sandstoneCore)
    this.parentMathFunction = sandstoneCore.mathStack[sandstoneCore.mathStack.length - 1] as MathFunctionNode
    this.parentMathFunction.balanceContext(this, callback)
  }

  getValue() {
    return {
      type: 'MathCase',
      caseValue: typeof this.caseValue === 'object' && this.caseValue !== null && 'node' in this.caseValue
        ? (this.caseValue as { node: MathExpressionNode }).node.getValue()
        : this.caseValue,
      body: this.body.map((n) => n.getValue()),
    }
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    const cv = this.caseValue
    const caseStr = typeof cv === 'number'
      ? JSON.stringify(cv)
      : (cv as { node?: MathExpressionNode })?.node !== undefined
        ? '<expr>'
        : String(cv)
    return formatMath(this.inspectClassName, `case=${caseStr}`, this.body, depth, getIndent(options), this)
  }
}

/**
 * Condition-case: callback receives the dispatch value handle, returns
 * a `MathConditionNode`. Used when the dispatch is on something richer
 * than exact equality (range, score range, etc.).
 */
export class MathConditionCaseNode extends MathContainerNode {
  /** Type guard. */
  static is(node: unknown): node is MathConditionCaseNode {
    return node instanceof MathConditionCaseNode
  }

  parentMathFunction: MathFunctionNode

  constructor(
    sandstoneCore: SandstoneCore,
    readonly conditionCallback: (value: Float | Integer) => MathConditionNode,
    callback: () => void,
  ) {
    super(sandstoneCore)
    this.parentMathFunction = sandstoneCore.mathStack[sandstoneCore.mathStack.length - 1] as MathFunctionNode
    this.parentMathFunction.balanceContext(this, callback)
  }

  getValue() {
    return {
      type: 'MathConditionCase',
      body: this.body.map((n) => n.getValue()),
    }
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(this.inspectClassName, undefined, this.body, depth, getIndent(options), this)
  }
}

/** Default case — terminal. No condition. Body may be empty. */
export class MathDefaultCaseNode extends MathContainerNode {
  /** Type guard. */
  static is(node: unknown): node is MathDefaultCaseNode {
    return node instanceof MathDefaultCaseNode
  }

  parentMathFunction: MathFunctionNode

  constructor(sandstoneCore: SandstoneCore, callback: () => void) {
    super(sandstoneCore)
    this.parentMathFunction = sandstoneCore.mathStack[sandstoneCore.mathStack.length - 1] as MathFunctionNode
    this.parentMathFunction.balanceContext(this, callback)
  }

  getValue() {
    return {
      type: 'MathDefaultCase',
      body: this.body.map((n) => n.getValue()),
    }
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(this.inspectClassName, undefined, this.body, depth, getIndent(options), this)
  }
}

// ---------------------------------------------------------------------------
// Loops. MC providers have no native loop construct — the lowerer picks
// between two strategies:
//
//   - **Statically unrollable**: when the loop bounds are literal numbers
//     (or score reads at compile time) AND the iteration count is
//     reasonable (configurable cap, default ~256), the lowerer unfolds
//     the body N times inline. No mcfunction emitted; pure provider
//     graph. Best when the loop bounds are known (`for(let i = 0; i < 10;
//     i++)` over a constant range).
//
//   - **mcfunction-backed**: when bounds are dynamic (depend on other
//     provider results) OR exceed the unroll cap, the lowerer emits a
//     wrapper MCFunction that runs the loop at runtime — typically a
//     recursive `function <name>` that increments a counter and re-
//     schedules itself via `schedule function ... 1t`, plus a base
//     case at the upper bound. MC evaluates the body per iteration.
//     This is the common case.
//
// The AST nodes themselves are agnostic — they just record the loop's
// structure. Lowerer decides at compile time.
// ---------------------------------------------------------------------------

/**
 * `_.while(condition, callback)` AND `_.for(initial, end, iterate, cb)`
 * — unified loop node using the precompute approach.
 *
 * Both forms store a `condition: MathConditionNode` directly:
 *   - `while`: condition passed straight in.
 *   - `for`: `end(stubIterator)` invoked at construction, producing a
 *     condition that references the stub iterator. Lowerer substitutes
 *     the real iterator per iteration (literal per copy for unroll;
 *     score-backed handle for recursive).
 *
 * `iterator?: Float | Integer` is `for`-only. Presence is the lowerer's
 * signal that the body references the iterator and per-strategy
 * rewriting applies. Absence means `while` — condition is static.
 *
 * Two lowering strategies (lowerer picks, same for both kinds):
 *
 *   - **Static unroll** — when bounds are statically known (numeric
 *     initial + condition references a literal) AND iteration count ≤
 *     `MAX_UNROLL_COUNT` (default 10), the lowerer inlines the body N
 *     times as repeated provider nodes. No mcfunction emitted.
 *
 *   - **Recursive mcfunction** — when bounds are dynamic OR exceed
 *     `MAX_UNROLL_COUNT`. Lowerer emits a wrapper MCFunction that
 *     runs the body, updates the iterator, and calls itself
 *     synchronously via `function <name>`. Same pattern as Sandstone's
 *     MCFunction flow — no `schedule`, single MC tick.
 *
 * `MAX_UNROLL_COUNT` tunable via `setMaxUnrollCount(n)`.
 *
 * Body callback receives `(iterator, _continue)` — `_continue()` is the
 * early-exit hook (skips remaining iterations; equivalent to `break`).
 * For `while` loops iterator is `undefined`; for `for` it's the
 * math-native handle.
 */
export class MathLoopNode extends MathContainerNode {
  /** Type guard. */
  static is(node: unknown): node is MathLoopNode {
    return node instanceof MathLoopNode
  }

  /**
   * Maximum iteration count that the lowerer will statically unroll.
   * Beyond this, the lowerer falls back to a recursive mcfunction.
   * Default 10. Override via `setMaxUnrollCount()`.
   */
  static MAX_UNROLL_COUNT = 10

  /** @internal — override the unroll cap globally. */
  static setMaxUnrollCount(n: number): void {
    MathLoopNode.MAX_UNROLL_COUNT = n
  }

  parentMathFunction: MathFunctionNode

  /**
   * The loop condition — always a `MathConditionNode`. For `for` loops
   * `SandstoneMath.for()` precomputes via `end(stubIterator)` before
   * passing it here.
   */
  readonly condition: MathConditionNode

  /**
   * `for` only — the iterator handle the lowerer rewrites per strategy.
   * `undefined` for `while` loops. Presence signals "the body references
   * this; rewrite per iteration."
   */
  readonly iterator?: Float | Integer

  /** `for` only — initial iterator value. Captured for lowerer use. */
  readonly initial?: number | Float | Integer

  /** `for` only — iterate step callback. Captured for lowerer use. */
  readonly iterate?: (iterator: Float | Integer) => Float | Integer

  /**
   * Public constructor — `SandstoneMath.while()` / `SandstoneMath.for()`
   * build the loop's parameters (precomputing `condition` for `for`)
   * and pass everything in. No static factories here; the user-facing
   * logic lives in `SandstoneMath`.
   */
  constructor(
    sandstoneCore: SandstoneCore,
    params: {
      condition: MathConditionNode
      initial?: number | Float | Integer
      iterate?: (iterator: Float | Integer) => Float | Integer
      iterator?: Float | Integer
    },
    callback: () => void,
  ) {
    super(sandstoneCore)
    this.parentMathFunction = sandstoneCore.mathStack[sandstoneCore.mathStack.length - 1] as MathFunctionNode
    this.condition = params.condition
    this.condition.parent = this
    this.initial = params.initial
    this.iterate = params.iterate
    this.iterator = params.iterator
    this.parentMathFunction.balanceContext(this, callback)
    // Commit self to the enclosing container's body so the AST debug
    // walk surfaces the loop with its condition + body. See the
    // matching note in `MathIfNode`'s constructor for rationale.
    const outer = sandstoneCore.mathStack[sandstoneCore.mathStack.length - 1]
    if (outer && outer !== this && 'append' in outer) {
      ;(outer as unknown as { append: (n: MathNode) => void }).append(this)
    }
    if (this.body.length === 0) {
      throw new Error('Math loop body is empty. Add at least one statement.')
    }
  }

  /** True iff this is a `for` loop (has an iterator to rewrite). */
  isFor(): boolean {
    return this.iterator !== undefined
  }

  /**
   * Strategy the lowerer should use. Stub: always recursive. The real
   * heuristic checks `canUnroll()` and `iterationCount()`.
   */
  getStrategy(): 'unroll' | 'recursive' {
    if (this.canUnroll()) {
      return 'unroll'
    }
    return 'recursive'
  }

  /**
   * True iff bounds are statically known and iteration count fits
   * within `MAX_UNROLL_COUNT`. Stub: always false (real impl walks
   * the `condition` MathConditionNode for a literal upper bound).
   */
  canUnroll(): boolean {
    void this
    return false
  }

  /**
   * The exact iteration count when statically known, `undefined`
   * otherwise. Stub: always undefined. Real impl evaluates
   * `(end_value - initial) / iterate_step` for `for`; not meaningful
   * for `while`.
   */
  iterationCount(): number | undefined {
    void this
    return undefined
  }

  /**
   * Helper for the unroll strategy. Returns `count` shallow clones of
   * the body. Stub: original body for first copy, empty arrays for
   * the rest. Real impl deep-clones and rewrites the iterator.
   */
  unrolledBodyCopies(count: number): MathNode[][] {
    if (count < 0 || !Number.isInteger(count)) {
      throw new Error(`MathLoopNode.unrolledBodyCopies: count must be non-negative integer, got ${count}.`)
    }
    const copies: MathNode[][] = []
    for (let i = 0; i < count; i++) {
      copies.push(i === 0 ? [...this.body] : [])
    }
    return copies
  }

  /**
   * Helper for the recursive strategy. Returns a stable resource name
   * for the wrapper MCFunction the lowerer emits.
   */
  recursiveFunctionName(): string {
    return `__math_loop_recursive_${this.parentMathFunction.resourceName ?? 'anon'}`
  }

  getValue() {
    return {
      type: 'MathLoop',
      hasIterator: this.isFor(),
      initial: this.initial !== undefined
        ? (typeof this.initial === 'number' ? this.initial : '<handle>')
        : undefined,
      strategy: this.getStrategy(),
      canUnroll: this.canUnroll(),
      iterationCount: this.iterationCount(),
      condition: this.condition.getValue(),
      body: this.body.map((n) => n.getValue()),
    }
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(
      this.inspectClassName,
      `for=${this.isFor()}`,
      [this.condition, ...this.body],
      depth,
      getIndent(options),
    this
    )
  }
}

/**
 * `_.switch(value, [case(0, () => ...), case(1, () => ...), default(() => ...)])`
 * — multi-way branch on a Float/Integer dispatch value.
 *
 * A MC `number_dispatcher` is MC's number-provider equivalent of a
 * switch-case: ONE provider, ONE returned value per evaluation, the
 * first matching case wins. The provider's JSON shape is:
 * ```
 * { type: 'number_dispatcher',
 *   cases: [ { condition: <PredicateRef>, value: <Provider> }, ... ],
 *   default: <Provider> }
 * ```
 *
 * `MathSwitchNode` holds the structure (dispatch value + case list +
 * optional default). Constructor runs each case callback via
 * `balanceContext` so case bodies can nest without leaking context.
 *
 * **Multi-output semantics.** When the math function has multiple
 * outputs (record schema), each output field gets its OWN
 * `number_dispatcher` provider — independent switch-cases. The
 * lowerer walks this node per output field, decomposing each
 * `MathReturnNode`'s value record and routing each field to its
 * provider's case list.
 *
 * **Lowerer strategies** (matches `MathIfNode` — same three options):
 *
 *   - **Inline pure**: case conditions are pure provider comparisons
 *     (`dispatch == value` for static, or a LootCondition built from
 *     the user's condition callback for condition-cases). Folds
 *     directly into `number_dispatcher` cases. Zero mcfunction.
 *
 *   - **Mixed**: case conditions require imperative eval (mutations,
 *     mutable state reads). Lowerer emits an mcfunction using
 *     SandstoneFlow's `execute if/unless` to gate which case value to
 *     write to a storage path; `number_dispatcher` provider reads
 *     that path via `storage` providers.
 *
 *   - **Full flow-style mcfunction**: switch has too many cases,
 *     conditions can't cleanly inline, or case bodies mutate state
 *     that downstream steps depend on. Lowerer converts the entire
 *     chain into a SandstoneFlow mcfunction that mirrors the
 *     dispatch via `execute if score ... matches ... run ...`,
 *     stores ONE value, and the provider is a simple `storage`
 *     reader.
 *
 * **Lowerer walk** for the Inline strategy, per output field:
 *   - Each `staticCases` entry → one case. Static `caseValue = X` →
 *     case condition is `dispatch == X` (inline `float_value_check` /
 *     `integer_value_check`). Case value = the case's return value's
 *     field for that output.
 *   - Each `conditionCases` entry → invokes `conditionCallback(dispatch)`
 *     to get a `MathConditionNode` (inline LootCondition), and its
 *     return's field becomes the case value.
 *   - `defaultCase` body → `default` branch.
 *   - No `defaultCase` → `default` omitted.
 */
export class MathSwitchNode extends MathContainerNode {
  /** Type guard. */
  static is(node: unknown): node is MathSwitchNode {
    return node instanceof MathSwitchNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    readonly dispatchValue: Float | Integer | MathExpressionNode,
    readonly staticCases: MathCaseNode[],
    readonly conditionCases: MathConditionCaseNode[],
    readonly defaultCase: MathDefaultCaseNode | undefined,
  ) {
    super(sandstoneCore)
    // Switch node itself doesn't push its own body — it just coordinates.
    // Bodies of cases are populated in their own constructors.
    //
    // Mark each case as a child so the inspector dedups any case that
    // also appears in `allNodes` (without this, cases repeat at the
    // top level even though they're rendered nested already).
    for (const c of this.staticCases) c.parent = this
    for (const c of this.conditionCases) c.parent = this
    if (this.defaultCase) this.defaultCase.parent = this
    //
    // Commit self to the enclosing container's body so the AST debug
    // walk surfaces the dispatch node alongside the cases. See the
    // matching note in `MathIfNode`'s constructor for rationale.
    const outer = sandstoneCore.mathStack[sandstoneCore.mathStack.length - 1]
    if (outer && outer !== this && 'append' in outer) {
      ;(outer as unknown as { append: (n: MathNode) => void }).append(this)
    }
  }

  getValue() {
    return {
      type: 'MathSwitch',
      dispatchValue: typeof this.dispatchValue === 'object' && this.dispatchValue !== null && 'node' in this.dispatchValue
        ? (this.dispatchValue as { node: MathExpressionNode }).node.getValue()
        : this.dispatchValue,
      staticCases: this.staticCases.map((c) => c.getValue()),
      conditionCases: this.conditionCases.map((c) => c.getValue()),
      defaultCase: this.defaultCase?.getValue(),
    }
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    // Switch renders as a flat list of children: dispatch expr (first),
    // then static cases, condition cases, and (optionally) default case.
    // Cases each have their own body block — the formatMath walker
    // emits a brace block per child so depth + indent both apply.
    const dispatchNode = (this.dispatchValue as unknown as { node?: MathExpressionNode }).node
    const children: unknown[] = []
    if (dispatchNode) children.push(dispatchNode)
    for (const c of this.staticCases) children.push(c)
    for (const c of this.conditionCases) children.push(c)
    if (this.defaultCase) children.push(this.defaultCase)
    return formatMath(this.inspectClassName, undefined, children, depth, getIndent(options), this)
  }
}