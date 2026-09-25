import type { SandstoneCore } from '../../../../core/sandstoneCore'
import * as util from 'util'
import { formatMath, getIndent, MATH_NODE_DEFAULT_DEPTH } from '../inspectHelpers'
import type { MathKind } from '../MathExpressionNode'
import { MathExpressionNode } from '../MathExpressionNode'

/**
 * Binary operators supported by the Math DSL. Names map 1:1 to MC provider
 * type tags (`add`, `sub`, `mul`, `div`, `mod`, `floor_div`, `floor_mod`,
 * `pow`). The lowering pass turns `kind` + `op` into the right
 * `context_float_provider` or `context_int_provider` JSON.
 */
export type BinaryOp =
  | 'add'
  | 'sub'
  | 'mul'
  | 'div'
  | 'mod'
  | 'floor_div'
  | 'floor_mod'
  | 'pow'
  | 'min'
  | 'max'

/**
 * Unary operators. `negate`, `abs`, `sqrt`, `sin`, `cos`, `ceil`,
 * `floor`, `round`, `truncate` — all 1:1 with MC provider type tags.
 */
export type UnaryOp =
  | 'negate'
  | 'abs'
  | 'sqrt'
  | 'sin'
  | 'cos'
  | 'ceil'
  | 'floor'
  | 'round'
  | 'truncate'

/**
 * N-ary operators over a list of operands (size ≥ 1). `add`/`mul` accept
 * a list (MC calls them `add`/`mul` with an `inputs` array), `min`/`max`
 * ditto, and `avg`/`length` are list-only.
 */
export type AggregateOp = 'add' | 'mul' | 'min' | 'max' | 'avg' | 'length'

/**
 * `BinaryOpNode` for ops that always take exactly two operands (`div`,
 * `sub`, `pow`, etc.). Aggregate forms (`add`/`mul` over N inputs) are
 * a different node — see `AggregateNode` below — because their JSON
 * shape uses an `inputs` array.
 */
export class BinaryOpNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is BinaryOpNode {
    return node instanceof BinaryOpNode
  }

  readonly kind: MathKind

  constructor(
    sandstoneCore: SandstoneCore,
    readonly op: BinaryOp,
    readonly operands: [MathExpressionNode, MathExpressionNode],
    kind?: MathKind,
  ) {
    super(sandstoneCore)
    // Default kind = left operand's kind. The handle constructor widens
    // Float+Integer → Float explicitly, so by the time we land here the
    // operands are homogeneous; using left's kind is the safe default.
    //
    // Operands are NOT parent-set here. Each operand is an independent
    // value the user has named (or that was constructed for this op's
    // own sake and flagged `internal`) — neither form is owned by
    // this operator. The user's mental model: operands stay root-level
    // AND render nested inside this op.
    this.kind = kind ?? operands[0].kind
  }

  getValue() {
    return {
      type: 'BinaryOp',
      kind: this.kind,
      op: this.op,
      operands: this.operands.map((o) => o.getValue()),
    }
  }

  /** @internal */
  getStructuralKey(): string {
    return `BinaryOp:${this.op}:${this.operands.map((o) => o.getStructuralKey()).join(':')}`
  }

  /** @internal */
  evaluateAsConstant(): number | undefined {
    const left = this.operands[0].evaluateAsConstant()
    if (left === undefined) return undefined
    const right = this.operands[1].evaluateAsConstant()
    if (right === undefined) return undefined
    return applyBinary(this.op, left, right)
  }

  /** @internal */
  isIdentity(op: string): number | undefined {
    if (this.op !== op) return undefined
    const id = identityValue(op)
    return id
  }

  /** @internal */
  isAbsorbing(op: string): number | undefined {
    if (this.op !== op) return undefined
    return absorbingValue(op)
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(
      this.inspectClassName,
      `op=${JSON.stringify(this.op)}, kind=${JSON.stringify(this.kind)}`,
      this.operands,
      depth,
      getIndent(options),
      this,
    )
  }
}

/**
 * @internal — apply a binary op to two constant values. Returns
 * `undefined` for ops that can't fold (`pow` with non-integer exponent
 * yields a non-constant, etc.) or for divide-by-zero.
 */
function applyBinary(op: BinaryOp, a: number, b: number): number | undefined {
  switch (op) {
    case 'add': return a + b
    case 'sub': return a - b
    case 'mul': return a * b
    case 'div': return b === 0 ? undefined : a / b
    case 'mod': return b === 0 ? undefined : a % b
    case 'floor_div': return b === 0 ? undefined : Math.floor(a / b)
    case 'floor_mod': return b === 0 ? undefined : a - Math.floor(a / b) * b
    case 'pow': return Math.pow(a, b)
    case 'min': return Math.min(a, b)
    case 'max': return Math.max(a, b)
    default: return undefined
  }
}

/** @internal — identity value for an op (the value `v` such that `a op v = a`). */
function identityValue(op: BinaryOp): number | undefined {
  switch (op) {
    case 'add': return 0
    case 'sub': return 0
    case 'mul': return 1
    case 'div': return 1
    default: return undefined
  }
}

/** @internal — absorbing value for an op (the value `v` such that `a op v = v` for any a). */
function absorbingValue(op: BinaryOp): number | undefined {
  switch (op) {
    case 'mul': return 0
    case 'div': return 0
    default: return undefined
  }
}

/**
 * N-ary aggregate — `add([a,b,c])`, `mul([a,b,c])`, `avg([a,b,c])`,
 * `length([a,b,c])`, `min([a,b,c])`, `max([a,b,c])`.
 *
 * Distinct from `BinaryOpNode` because MC's aggregate providers use an
 * `inputs` array, not left/right pair. Splitting the node classes makes
 * the JSON shape unambiguous at the lowering site.
 */
export class AggregateNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is AggregateNode {
    return node instanceof AggregateNode
  }

  readonly kind: MathKind

  constructor(
    sandstoneCore: SandstoneCore,
    readonly op: AggregateOp,
    readonly inputs: MathExpressionNode[],
    kind?: MathKind,
  ) {
    super(sandstoneCore)
    // Same as BinaryOpNode: do NOT parent-set operands — they're
    // independent values from the user's perspective.
    this.kind = kind ?? inputs[0].kind
  }

  getValue() {
    return {
      type: 'Aggregate',
      kind: this.kind,
      op: this.op,
      inputs: this.inputs.map((i) => i.getValue()),
    }
  }

  /** @internal */
  getStructuralKey(): string {
    return `Aggregate:${this.op}:${this.inputs.map((i) => i.getStructuralKey()).join(':')}`
  }

  /** @internal */
  evaluateAsConstant(): number | undefined {
    const values = this.inputs.map((i) => i.evaluateAsConstant())
    if (values.some((v) => v === undefined)) return undefined
    const nums = values as number[]
    switch (this.op) {
      case 'add': return nums.reduce((a, b) => a + b, 0)
      case 'mul': return nums.reduce((a, b) => a * b, 1)
      case 'avg': return nums.reduce((a, b) => a + b, 0) / nums.length
      case 'min': return Math.min(...nums)
      case 'max': return Math.max(...nums)
      case 'length': return nums.length
      default: return undefined
    }
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(
      this.inspectClassName,
      `op=${JSON.stringify(this.op)}, count=${this.inputs.length}`,
      this.inputs,
      depth,
      getIndent(options),
      this,
    )
  }
}

export class UnaryOpNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is UnaryOpNode {
    return node instanceof UnaryOpNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    readonly op: UnaryOp,
    readonly operand: MathExpressionNode,
  ) {
    super(sandstoneCore)
    // Operand stays parent-less (independent value).
  }

  get kind(): MathKind {
    return this.operand.kind
  }

  getValue() {
    return {
      type: 'UnaryOp',
      kind: this.kind,
      op: this.op,
      operand: this.operand.getValue(),
    }
  }

  /** @internal */
  getStructuralKey(): string {
    return `UnaryOp:${this.op}:${this.operand.getStructuralKey()}`
  }

  /** @internal */
  evaluateAsConstant(): number | undefined {
    const v = this.operand.evaluateAsConstant()
    if (v === undefined) return undefined
    switch (this.op) {
      case 'negate': return -v
      case 'abs': return Math.abs(v)
      case 'sqrt': return v < 0 ? undefined : Math.sqrt(v)
      case 'ceil': return Math.ceil(v)
      case 'floor': return Math.floor(v)
      case 'round': return Math.round(v)
      case 'truncate': return Math.trunc(v)
      // sin/cos handled as floats — fold to radians math
      case 'sin': return Math.sin(v)
      case 'cos': return Math.cos(v)
      default: return undefined
    }
  }

  /** @internal */
  isIdentity(op: string): number | undefined {
    if (this.op !== op) return undefined
    return unaryIdentity(op)
  }

  /** @internal */
  isAbsorbing(_op: string): number | undefined {
    void _op
    return undefined
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(
      this.inspectClassName,
      `op=${JSON.stringify(this.op)}`,
      [this.operand],
      depth,
      getIndent(options),
      this,
    )
  }
}

/** @internal */
function unaryIdentity(op: UnaryOp): number | undefined {
  switch (op) {
    case 'abs': return 0
    case 'negate': return 0
    default: return undefined
  }
}

/**
 * `arcSine(x)` — inverse sine. No MC provider exists for this. The AST
 * node exists so the user-facing API surface is stable; `getValue()`
 * throws to flag the polyfill gap. Implementation TBD — likely a
 * storage-based Newton's method that requires an mcfunction.
 */
export class ArcSineNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is ArcSineNode {
    return node instanceof ArcSineNode
  }

  readonly kind: MathKind = 'float'

  constructor(
    sandstoneCore: SandstoneCore,
    readonly operand: MathExpressionNode,
  ) {
    super(sandstoneCore)
    // Operand stays parent-less (independent value).
  }

  getValue(): unknown {
    throw new Error('ArcSineNode: polyfill not yet implemented — needs storage-based Newton\'s method (forces mcfunction)')
  }

  /** @internal — never inlineable; polyfill requires imperative mcfunction. */
  canEvaluateLazily(): boolean {
    return false
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(this.inspectClassName, undefined, [this.operand], depth, getIndent(options), this)
  }
}

/**
 * `arcCosine(x)` — inverse cosine. Same polyfill gap as `ArcSineNode`.
 */
export class ArcCosineNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is ArcCosineNode {
    return node instanceof ArcCosineNode
  }

  readonly kind: MathKind = 'float'

  constructor(
    sandstoneCore: SandstoneCore,
    readonly operand: MathExpressionNode,
  ) {
    super(sandstoneCore)
    // Operand stays parent-less (independent value).
  }

  getValue(): unknown {
    throw new Error('ArcCosineNode: polyfill not yet implemented — needs storage-based Newton\'s method (forces mcfunction)')
  }

  /** @internal — never inlineable; polyfill requires imperative mcfunction. */
  canEvaluateLazily(): boolean {
    return false
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(this.inspectClassName, undefined, [this.operand], depth, getIndent(options), this)
  }
}