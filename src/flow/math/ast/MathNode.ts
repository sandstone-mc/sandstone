import * as util from 'util'
import type { SandstoneCore } from '../../../core/sandstoneCore'

/**
 * Base class for every Math DSL AST node.
 *
 * Carries a depth-aware `[util.inspect.custom]` so `console.log(node)`
 * never recurses through `sandstoneCore.mathStack` back into this same
 * node — see `inspectHelpers.ts` for the full protocol. The base impl
 * returns `${constructor.name}`; concrete subclasses either inline more
 * detail (leaves via `inspectLeaf`) or recurse into their body with
 * decremented depth (containers via `inspectBody`).
 *
 * Mirrors `core/nodes.ts#Node` — same sandstoneCore injection, same
 * abstract `getValue()`. The Math DSL is its own tree, distinct from the
 * MCFunction command tree, so it does NOT extend `Node` (no shared
 * command-serialization depth, no `isMacro`, no `commit()` plumbing).
 *
 * Serialization is intentionally deferred. `getValue()` on a math node
 * returns a structural dump today (a plain object describing the node);
 * a later pass will lower it to either:
 *   - provider JSON (a `ContextFloatProvider` / `ContextIntProvider` shape), or
 *   - one or more mcfunction commands (a `CommandNode`-like string).
 *
 * Subclasses pick the lowering route during compilation; the AST itself
 * stays neutral.
 */
export abstract class MathNode {
  /**
   * Back-reference to the AST node that owns this one — set when the
   * node is attached as a child of a *control-flow* container
   * (`MathIfNode`'s condition, `MathCaseNode`'s body via `append`,
   * etc.). Used by `MathFunctionNode.inspect` to skip orphans from
   * the `allNodes` top-level list when their parent is already
   * on that list.
   *
   * `undefined` for value-expression operands (operator inputs,
   * including handle-state references). The user's mental model:
   * operands of `rx['*='](scale)` are independent values, not
   * sub-parts of the resulting aggregate. Each operand therefore
   * stays at the root of the chronological audit trail and ALSO
   * shows nested inside the operator — duplication is intentional
   * (the user explicitly accepted this for visibility).
   */
  parent?: MathNode

  /**
   * True iff this node was created internally as a stand-in for a
   * raw user value (e.g., `handleToExpr` wrapping the literal `-1`
   * in `rx['*='](-1)`, or `compare` wrapping a numeric right-hand
   * side into a `LiteralNode`). Such nodes exist purely to satisfy
   * a sub-expression's positional argument — they're not named or
   * referenced by any user-visible handle, so logging them at the
   * top level of `allNodes` would just produce duplicates of
   * values the user never wrote a separate statement for.
   *
   * The inspector filters these out of the top-level list. They
   * still appear nested inside the operator that needed them — once
   * is enough.
   */
  internal?: boolean

  /**
   * Stable identity index assigned at construction time. Scoped to
   * the node's concrete class within the enclosing
   * `MathFunctionNode` — `<0>` is the first node of THIS class,
   * `<1>` the next, etc. Rendered in inspector output as
   * `ClassName<index>` so readers can trace the same logical node
   * appearing in multiple contexts (e.g., a `CopyNode` rendered
   * once at the root and again as an aggregate input — same
   * `(className, index)` pair).
   *
   * Per-class scoping means `CopyNode<0>` is distinct from
   * `LiteralNode<0>` even though both are at offset 0 in
   * `allNodes` — readers identify by `(className, index)`, not by
   * a global offset.
   *
   * Undefined for nodes that aren't part of any audit trail (e.g.,
   * a `MathFunctionNode` itself — the top-level container doesn't
   * appear in its own `allNodes`).
   */
  index?: number

  constructor(public sandstoneCore: SandstoneCore) {
    // Auto-register every constructed node with the enclosing
    // `MathFunctionNode`'s computed-trail list, so debug inspectors can
    // surface the full record of nodes built inside a math block. The
    // `body` field only holds flow-control statements (MathReturnNode,
    // MathIfNode, MathLoopNode, ...); `allNodes` captures expressions
    // (CopyNode / BinaryOpNode / LiteralNode) and conditions
    // (ComparisonConditionNode, etc.) that are wrapped on handles but
    // never appended anywhere — i.e., the entire computation trace, not
    // just the visible statements.
    //
    // Duck-typed on the `allNodes` field rather than an `instanceof`
    // `MathFunctionNode` check — that would force a circular import
    // (`MathFunctionNode` extends `MathContainerNode` which extends
    // `MathNode`). At runtime, only `MathFunctionNode` instances carry
    // the field, so the check is exact in practice.
    //
    // The index is captured BEFORE the push so each node's
    // `ClassName<n>` reflects its position in the chronological
    // audit trail. After the push, the trail's length is one
    // greater than the freshly-assigned index for any node that
    // happens to inspect itself right after construction.
    //
    // Per-class scoping: `MathFunctionNode.perClassCounters` keys
    // by class name, so `CopyNode<0>`, `CopyNode<1>`, `CopyNode<2>`
    // each get a distinct suffix even if some other class also has
    // nodes with indices in the same range — readers track a node
    // by `(className, index)` pair, immune to ordering across
    // unrelated classes.
    const stack = sandstoneCore.mathStack
    const top = stack[stack.length - 1]
    if (
      top &&
      typeof top === 'object' &&
      'allNodes' in top &&
      Array.isArray((top as { allNodes?: unknown }).allNodes)
    ) {
      const allNodes = (top as { allNodes: MathNode[] }).allNodes
      const counters = (top as { perClassCounters?: Map<string, number> }).perClassCounters
      if (counters) {
        const cls = this.constructor.name
        this.index = counters.get(cls) ?? 0
        counters.set(cls, this.index + 1)
      }
      allNodes.push(this)
    }
  }

  type = this.constructor.name

  /**
   * Structural dump for now. Real serialization (provider JSON /
   * mcfunction command strings) is layered on top by a later compile pass.
   */
  abstract getValue(): unknown

  /**
   * Depth-aware inspector for `util.inspect` / `console.log`. The base
   * default returns just the class name. Leaves and containers override
   * for richer / recursive output (see `inspectHelpers.ts`). The function
   * is intentionally never recursive into `sandstoneCore` — that path
   * cycles through `mathStack` back to the enclosing `MathFunctionNode`.
   *
   * Bun/Node invoke this with `(depth, options)`; we accept those and
   * also expose a no-arg form for direct calls.
   */
  /**
   * Build the inspector's class-name token for the format
   * `ClassName<index>` (or just `ClassName` if no index). Class
   * name AND index number are colored green; the `<` / `>`
   * brackets stay plain — preserves readability when the index
   * sits between two colored words. Returns an ANSI-styled string
   * for direct use as the `className` argument to `formatMath` /
   * `formatMathLeaf` (which no longer applies its own color).
   */
  get inspectClassName(): string {
    const ctor = this.constructor.name
    const coloredCtor = util.styleText('green', ctor)
    if (this.index === undefined) return coloredCtor
    const coloredIndex = util.styleText('green', String(this.index))
    return `${coloredCtor}<${coloredIndex}>`
  }

  [util.inspect.custom](_depth?: number, _options?: unknown): string {
    void _depth
    void _options
    return this.inspectClassName
  }

  /**
   * @internal
   *
   * Stable string key identifying this node's structural shape. Used
   * by optimizer visitors (SharedSubexpressionEliminationVisitor, dedup
   * passes) to detect identical subtrees. Two structurally-equal
   * nodes produce the same key — both kind and operands contribute.
   *
   * `getValue()` works too, but mixes runtime IDs (data-point paths,
   * storage refs) with structural shape. `getStructuralKey()` strips
   * runtime data and returns a shape-only fingerprint.
   *
   * Examples:
   *   - `BinaryOpNode('add', [Literal(2), Literal(3)])` → `"BinaryOp:add:Literal(2):Literal(3)"`
   *   - `StorageRefNode(path)` → `"StorageRef"` (path is runtime data, not structure)
   *
   * Default: `getValue()` output. Override for nodes with runtime-only
   * fields that should be ignored for structural comparison.
   */
  getStructuralKey(): string {
    return String(this.getValue())
  }
}