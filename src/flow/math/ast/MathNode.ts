import type { SandstoneCore } from '../../../core/sandstoneCore'

/**
 * Base class for every Math DSL AST node.
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
  constructor(public sandstoneCore: SandstoneCore) {}

  type = this.constructor.name

  /**
   * Structural dump for now. Real serialization (provider JSON /
   * mcfunction command strings) is layered on top by a later compile pass.
   */
  abstract getValue(): unknown

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