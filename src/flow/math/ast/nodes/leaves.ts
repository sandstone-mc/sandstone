import type { SandstoneCore } from '../../../../core/sandstoneCore'
import * as util from 'util'
import type { DataPointClass } from '../../../../variables/Data'
import type { Score } from '../../../../variables/Score'
import { formatMathLeaf, getIndent } from '../inspectHelpers'
import type { MathKind } from '../MathExpressionNode'
import { MathExpressionNode } from '../MathExpressionNode'

/**
 * Raw numeric literal. Context-sensitive: the same `5` may need to
 * lower as an integer NBT tag (`5b`/`5s`/`5`/`5L`) in one context and
 * a float NBT tag (`5.0d`/`5.0f`) in another — the compiler picks
 * based on the surrounding handle's kind, not on a hard-coded
 * constructor arg.
 *
 * Used by the user-facing `_.float(x)` / `_.integer(x)` constructors
 * when `x` is a primitive `number`. The compiler inspects the
 * handle that owns the literal (or any other context signal) to
 * decide the NBT tag at serialization time.
 */
export class LiteralNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is LiteralNode {
    return node instanceof LiteralNode
  }
  constructor(
    sandstoneCore: SandstoneCore,
    readonly value: number,
  ) {
    super(sandstoneCore)
  }

  /**
   * Defer kind to the compiler. `getValue()` returns just the value;
   * the lowerer wraps it in the right NBT tag based on the owning
   * handle's kind.
   */
  readonly kind: MathKind = 'float'

  getValue() {
    return {
      type: 'Literal',
      value: this.value,
    }
  }

  /** @internal — LiteralNode is the only expression that's always constant. */
  evaluateAsConstant(): number {
    return this.value
  }

  /** @internal */
  getStructuralKey(): string {
    return `Literal(${this.value})`
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    return formatMathLeaf(this.inspectClassName, [
      ['value', this.value],
      ['kind', this.kind],
    ], getIndent(options), this)
  }
}

/**
 * Snapshot of another expression node. Created when the user does
 * `_.float(x)` where `x` is already a `Float` — the new handle wraps a
 * `CopyNode` pointing at `x.node` at copy time, not at `x` itself.
 *
 * After the copy:
 *   - The new handle's mutations (`add`/`subtract`/`multiply`/...)
 *     allocate fresh expression nodes; the original handle's `node`
 *     reference is replaced by its own mutations and stops being
 *     shared. The two handles diverge at their roots.
 *   - The original handle's mutations (`x.add(5)`) replace `x.node`
 *     with a new root — but the copy's `CopyNode.source` still points
 *     at the original root AT COPY TIME, which becomes orphaned. The
 *     copy is unaffected by subsequent original mutations.
 *
 * Effectively: copy = snapshot. Independent handle, shared sub-AST
 * only at the moment of capture.
 *
 * Shallow snapshot — subexpressions referenced by the copied tree may
 * still be shared with the original (rare in practice; not worth a
 * deep-clone pass). If a user mutates a sub-handle that BOTH the
 * original and the copy reference, the change propagates to both.
 * Documented limitation; root-level independence is what users care
 * about.
 */
export class CopyNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is CopyNode {
    return node instanceof CopyNode
  }

  readonly kind: MathKind

  constructor(
    sandstoneCore: SandstoneCore,
    readonly source: MathExpressionNode,
  ) {
    super(sandstoneCore)
    this.kind = source.kind
  }

  getValue() {
    return {
      type: 'Copy',
      source: this.source.getValue(),
    }
  }

  /** @internal — CopyNode is transparent for constant evaluation; unwrap to source. */
  evaluateAsConstant(): number | undefined {
    return this.source.evaluateAsConstant()
  }

  /** @internal */
  getStructuralKey(): string {
    return `Copy:${this.source.getStructuralKey()}`
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    return formatMathLeaf(this.inspectClassName, [
      ['kind', this.kind],
      ['source', this.source],
    ], getIndent(options), this)
  }
}

/**
 * Reference to an NBT data point — storage / entity / block. At the
 * provider level this lowers to a `storage` provider with `path` and
 * (optional) `fallback`. The wrapping MCFunction is responsible for
 * populating the path before the consumer reads the provider.
 *
 * `kind` defaults to `float` because NBT doubles are the most common
 * read; integer-typed storage reads are explicit via `kind: 'integer'`.
 */
export class StorageRefNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is StorageRefNode {
    return node instanceof StorageRefNode
  }

  readonly kind: MathKind

  constructor(
    sandstoneCore: SandstoneCore,
    readonly dataPoint: DataPointClass,
    kind: MathKind = 'float',
  ) {
    super(sandstoneCore)
    this.kind = kind
  }

  getValue() {
    return {
      type: 'StorageRef',
      kind: this.kind,
      // Stringify the path for the structural dump; the lowering pass
      // will pull the actual provider fields from `dataPoint` directly.
      path: '<DataPointClass>',
    }
  }

  /** @internal — runtime data only; structural key omits the path. */
  getStructuralKey(): string {
    return `StorageRef:${this.kind}`
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    // Show what the storage ref is actually pointing at — the MC
    // data target plus the NBT path under it — instead of dumping
    // the entire `DataPointClass` (which carries ~20 helper fields
    // the user doesn't need to read).
    //
    // Strings get quoted once by `formatArgValue`; non-string targets
    // (entity selector objects, block positions) round-trip through
    // JSON for a stable representation.
    const dp = this.dataPoint as unknown as {
      type?: string
      currentTarget?: unknown
      path?: unknown
    }
    const target = typeof dp.currentTarget === 'string'
      ? dp.currentTarget
      : JSON.stringify(dp.currentTarget)
    const path = typeof dp.path === 'string' ? dp.path : JSON.stringify(dp.path)
    return formatMathLeaf(this.inspectClassName, [
      ['kind', this.kind],
      ['type', dp.type ?? 'unknown'],
      ['target', target],
      ['path', path],
    ], getIndent(options), this)
  }
}

/**
 * Reference to a scoreboard value. MC provider shape:
 * `{type: 'score', target: <ScoreProvider>, score: <Objective>}`.
 *
 * At runtime MC reads the score at provider-evaluation time, so the
 * wrapping mcfunction (if any) must ensure the score is set before the
 * consumer reads the provider. `kind` is forced to `integer` because
 * scores are integer-valued in MC.
 */
export class ScoreboardRefNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is ScoreboardRefNode {
    return node instanceof ScoreboardRefNode
  }

  readonly kind: MathKind

  constructor(
    sandstoneCore: SandstoneCore,
    readonly score: Score,
  ) {
    super(sandstoneCore)
    this.kind = 'integer'
  }

  getValue() {
    return {
      type: 'ScoreboardRef',
      kind: this.kind,
      // Structural dump only — the lowering pass inspects `score`
      // directly for target/objective references.
      target: '<Score>',
    }
  }

  /** @internal */
  getStructuralKey(): string {
    return `ScoreboardRef`
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    return formatMathLeaf(this.inspectClassName, [
      ['kind', this.kind],
      ['score', this.score],
    ], getIndent(options), this)
  }
}

/**
 * `_.random({min, max}, result)` — uniform random in `[min, max]`
 * (either bound optional; MC's `uniform` accepts missing bounds).
 *
 * Lowerer emits a `uniform` provider: `{type: 'uniform', min, max}`.
 * `result` defaults to `'float'`; if `'integer'` and both bounds are
 * integer-valued (or absent), the lowerer may switch to a
 * score-backed int path.
 *
 * Naming follows the user-facing `Math.ts#random` — NOT Mojang's
 * provider tag (`uniform`). The lowerer translates.
 */
export class RandomNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is RandomNode {
    return node instanceof RandomNode
  }

  readonly kind: MathKind

  constructor(
    sandstoneCore: SandstoneCore,
    readonly min: MathExpressionNode | undefined,
    readonly max: MathExpressionNode | undefined,
    result: 'float' | 'integer' = 'float',
  ) {
    super(sandstoneCore)
    // If both bounds exist and are integer-typed, the natural result
    // is integer unless explicitly overridden. Otherwise default to
    // the explicit result. Missing bounds fall back to the result.
    const boundsKind: MathKind =
      min?.kind === 'integer' && max?.kind === 'integer' ? 'integer' : 'float'
    this.kind = result === 'integer' || boundsKind === 'integer' ? 'integer' : 'float'
  }

  getValue() {
    return {
      type: 'Random',
      kind: this.kind,
      min: this.min?.getValue(),
      max: this.max?.getValue(),
    }
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    return formatMathLeaf(this.inspectClassName, [
      ['kind', this.kind],
      ['min', this.min],
      ['max', this.max],
    ], getIndent(options), this)
  }
}

/**
 * `_.pick([{value, weight}, ...])` — weighted random pick.
 *
 * Lowerer emits a `weighted_list` provider:
 * `{type: 'weighted_list', distribution: <NonEmptyWeightedList>}`.
 *
 * Weight may be a literal number (preferred — most MC weights are
 * integer constants) or a `Float`/`Integer` handle for computed
 * weights. The lowerer normalizes both shapes.
 *
 * Naming follows `Math.ts#pick`, not MC's `weighted_list`.
 */
export class PickNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is PickNode {
    return node instanceof PickNode
  }

  readonly kind: MathKind

  constructor(
    sandstoneCore: SandstoneCore,
    readonly entries: Array<{
      value: MathExpressionNode
      weight: MathExpressionNode | number
    }>,
  ) {
    super(sandstoneCore)
    if (entries.length === 0) {
      throw new Error('PickNode: at least one entry required.')
    }
    this.kind = entries[0].value.kind
  }

  getValue() {
    return {
      type: 'Pick',
      kind: this.kind,
      entries: this.entries.map((e) => ({
        value: e.value.getValue(),
        weight: typeof e.weight === 'number' ? e.weight : e.weight.getValue(),
      })),
    }
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    return formatMathLeaf(this.inspectClassName, [
      ['kind', this.kind],
      ['entries', this.entries.length],
    ], getIndent(options), this)
  }
}

/**
 * `_.enchantmentLevel()` — provider reading the player's
 * enchantment level on the relevant item (held or worn, depending on
 * consumer context).
 *
 * Lowerer emits an `enchantment_level` provider:
 * `{type: 'enchantment_level', amount: <LevelBasedValue>}`. For now
 * the amount is fixed at the player's current level (no per-level
 * scaling); the lowerer substitutes a default `LevelBasedValue` of
 * `{"type":"minecraft:constant","value":1}` times the level when
 * serializing, or directly `{type:"minecraft:enchantment_level",
 * amount: <level ref>}` — see MC's `enchantment_level` provider
 * shape.
 *
 * Always Float-kind — MC's enchantment level provider lives in the
 * float context. Naming follows `Math.ts#enchantmentLevel`, not MC's
 * `enchantment_level`.
 */
export class EnchantmentLevelNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is EnchantmentLevelNode {
    return node instanceof EnchantmentLevelNode
  }

  readonly kind: MathKind = 'float'

  constructor(sandstoneCore: SandstoneCore) {
    super(sandstoneCore)
  }

  getValue() {
    return {
      type: 'EnchantmentLevel',
      kind: this.kind,
    }
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    return formatMathLeaf(this.inspectClassName, [['kind', this.kind]], getIndent(options), this)
  }
}

/**
 * `_.environmentAttribute()` — provider reading a numerical
 * environment attribute (e.g., `minecraft:time_of_day`,
 * `minecraft:moon_angle`).
 *
 * Lowerer emits an `environment_attribute` provider:
 * `{type: 'environment_attribute', attribute: <NumericalEnvironmentAttribute>}`.
 *
 * Float-only. MC technically defines an int variant
 * (`IntegerEnvironmentAttribute`), but its registry is `never` — no
 * integer environment attributes are dispatchable in vanilla. The int
 * provider exists in the type system but is unreachable. Float is the
 * only meaningful kind; the lowerer uses `NumericalEnvironmentAttribute`
 * unconditionally.
 *
 * Naming follows `Math.ts#environmentAttribute`, not MC's
 * `environment_attribute`.
 */
export class EnvironmentAttributeNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is EnvironmentAttributeNode {
    return node instanceof EnvironmentAttributeNode
  }

  readonly kind: MathKind = 'float'

  constructor(sandstoneCore: SandstoneCore) {
    super(sandstoneCore)
  }

  getValue() {
    return {
      type: 'EnvironmentAttribute',
      kind: this.kind,
    }
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    return formatMathLeaf(this.inspectClassName, [['kind', this.kind]], getIndent(options), this)
  }
}