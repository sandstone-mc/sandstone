import type { SandstoneCore } from '../../../core/sandstoneCore'
import { MathNode } from './MathNode'

/**
 * Numeric kind of a Math DSL expression. Drives the available operations
 * (e.g. `pow` is float-only on the MC side; `binomial` is int-only) and
 * the eventual provider dispatch type (`context_float_provider` vs
 * `context_int_provider`). Auto-widening (`Float + Integer → Float`) is
 * handled at the operation site by inserting a `from_int` provider.
 */
export type MathKind = 'float' | 'integer'

/**
 * A math node that produces a value (Float or Integer).
 *
 * Concrete subclasses carry their `kind` so the compiler can pick the
 * right MC provider type. Operations like `AddNode` set `kind` based on
 * operand widening rules (see `handles.ts#FloatHandle.add`).
 *
 * `getValue()` returns a structural dump today. The compile pass will
 * lower these into `ContextFloatProvider` / `ContextIntProvider` JSON
 * shapes, OR — when an expression cannot be lowered to a single provider
 * — fold it into a sequence of mcfunction commands that write the result
 * to a known storage path, and emit a `storage` provider referencing that
 * path in place of the expression.
 *
 * Two tracks by design:
 *   - Pure provider: op tree compiles directly to provider JSON. No
 *     mcfunction side effect. MC evaluates on demand.
 *   - Imperative: op tree compiles to one or more mcfunction commands
 *     that materialize the result into an NBT storage path; a wrapper
 *     `storage` provider reads from that path.
 *
 * The AST itself does not pick a track. Lowering does.
 */
export abstract class MathExpressionNode extends MathNode {
  /** Type guard. */
  static is(node: unknown): node is MathExpressionNode {
    return node instanceof MathExpressionNode
  }

  abstract readonly kind: MathKind

  constructor(sandstoneCore: SandstoneCore) {
    super(sandstoneCore)
  }

  /**
   * Structural dump for now. Subclasses override to include their typed
   * payload (operands, type tag, etc.).
   */
  abstract getValue(): unknown

  /**
   * @internal
   *
   * If this entire subtree is statically constant-foldable, return its
   * numeric value. Otherwise return `undefined`.
   *
   * Used by ConstantFoldingVisitor to collapse pure-constant
   * subexpressions into single `LiteralNode`s at compile time.
   *
   * Default: `undefined` (most nodes depend on inputs). Override in
   * pure-constant nodes (literal leaves, foldable ops over literals).
   */
  evaluateAsConstant(): number | undefined {
    void this
    return undefined
  }

  /**
   * @internal
   *
   * For binary operators: returns the value that makes the op an
   * identity (`a + 0 = a`, `a * 1 = a`, `a - 0 = a`, `a / 1 = a`).
   * Returns `undefined` if this op has no identity value, or this
   * isn't a binary op.
   *
   * Used by TrivialLiteralIdentityVisitor to simplify `x + 0` → `x`
   * and similar at compile time.
   */
  isIdentity(_op: string): number | undefined {
    void this
    return undefined
  }

  /**
   * @internal
   *
   * For binary operators: returns the value that absorbs the operand
   * (`a * 0 = 0`, `0 * a = 0`). Returns `undefined` otherwise.
   *
   * Used by TrivialLiteralIdentityVisitor.
   */
  isAbsorbing(_op: string): number | undefined {
    void this
    return undefined
  }

  /**
   * @internal
   *
   * True iff this node's subtree has no side effects and can be
   * evaluated lazily by MC at provider-read time without an
   * mcfunction pre-eval. Default: `true` for most pure nodes. Override
   * for nodes that require setup (e.g., `ArcSineNode` polyfill when
   * implemented via storage-based Newton's method).
   */
  canEvaluateLazily(): boolean {
    void this
    return true
  }

  /**
   * @internal
   *
   * Storage paths this node writes during evaluation (empty for pure
   * nodes). Used by compiler when sequencing mcfunction-side
   * imperative ops. Default: empty.
   */
  writesToStoragePaths(): string[] {
    void this
    return []
  }

  /**
   * @internal
   *
   * Storage paths this node reads from (implicit dependencies for
   * sequencing). Default: empty.
   */
  readsFromStoragePaths(): string[] {
    void this
    return []
  }
}

/**
 * Loose string alias for the binary op name used in identity/absorbing
 * queries. Kept loose so callers don't have to import the full
 * `BinaryOp` union from `nodes/operators.ts`.
 */
export type BinaryOpLike = string