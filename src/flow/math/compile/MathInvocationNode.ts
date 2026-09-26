import { ContainerCommandNode } from 'sandstone/core'
import type { SandstoneCore } from 'sandstone/core'
import type { Node } from 'sandstone/core/nodes'
import type { MCFunctionNode } from 'sandstone/core/resources/datapack/mcfunction'
import type { DataPointClass } from '../../../variables/Data'
import type { MathExpressionNode } from '../ast/MathExpressionNode'
import type { MathFunctionNode } from '../ast/MathFunctionNode'

/**
 * Per-input bridge bookkeeping. One entry per math fn input slot.
 * Discriminated union so storage and (future) score inputs can carry
 * the right per-position references:
 *
 *   - `storage` — `callerDp` is the user's per-call DataPoint;
 *     `sharedDp` is the math fn's shared address (lazily allocated
 *     on first call for that input slot). The compile step emits
 *     `data modify storage <sharedDp> set from <callerDp>` per call
 *     and rewrites the AST's matching input StorageRefNode to point
 *     at `sharedDp` so the deduplicated provider JSONs reference a
 *     stable path.
 *
 *   - `score` — placeholder. Future score support will populate a
 *     shared score and emit `scoreboard players operation <shared> =
 *     <caller>`; the provider reads the score at runtime. Undefined
 *     for now — score-input compilation isn't wired through
 *     `compileMathExpressionToProvider` yet (would need a
 *     ScoreboardProvider branch).
 *
 * Inputs that are literals (`_.float(5)`) don't need a slot — they
 * carry no caller reference. `MathFunction.__call__` only allocates a
 * slot for storage-typed inputs.
 */
export type SharedInputSlot =
  | {
      /** Position in the math fn's input tuple (`fn.inputs[position]`). */
      position: number
      kind: 'storage'
      callerDp: DataPointClass<'storage'>
      sharedDp: DataPointClass<'storage'>
    }
  | {
      position: number
      kind: 'score'
      // TODO: score inputs — fill in when compileMathExpressionToProvider
      // gains a ScoreboardRefNode branch.
      callerScore: unknown
      sharedScore: unknown
    }

/**
 * Bridge node between a `MathFunction`'s lowered imperative commands
 * and the caller's MCFunction body.
 *
 * Placeholder created at `__call__` time — the body is EMPTY. The
 * `MathInvocationInlineVisitor` (registered in `defaultVisitors`)
 * lowers the AST + builds the imperative commands at SAVE time, by
 * which point every invocation of the math fn has been seen and the
 * compile pipeline can decide:
 *   - per-call storage namespaces vs simple paths
 *   - whether shared input addresses are needed
 *   - how to register provider resources (deduplicated across calls)
 *
 * The visitor splices the populated `body` into the host MCFunction
 * body and removes this node — `getValue` never sees it.
 *
 * `command` is required by `ContainerCommandNode`'s `abstract` field
 * but never serialized.
 */
export class MathInvocationNode extends ContainerCommandNode {
  command = '__math_invocation' as const

  /** Type guard. Used by `MathInvocationInlineVisitor.visit` to dispatch. */
  static is(node: unknown): node is MathInvocationNode {
    return node instanceof MathInvocationNode
  }

  /**
   * The math function this invocation lowers. Read-only after
   * construction — visitors walking the bridge use it for diagnostics.
   */
  public readonly mathFunction: MathFunctionNode

  /**
   * The MCFunction hosting the call site when `__call__` ran. Captured
   * at construction so the inline visitor knows where to splice `body`
   * back into.
   */
  public readonly hostFunction: MCFunctionNode

  /**
   * 0-based call index for this invocation. The first call has
   * `callIdx === 0`; subsequent calls on the same math fn get
   * 1, 2, ... Used by the visitor to namespace per-call storage
   * paths so concurrent runs don't clobber each other.
   */
  public callIdx = 0

  /**
   * Whether this invocation's storage paths use per-call suffixes
   * (`math_<id>_h_<handle>_<idx>`) — false for the first (and
   * possibly only) call, true for subsequent ones.
   */
  public useCallNamespace = false

  /**
   * Per-input bridge bookkeeping. `inputs[i]` is the slot for the
   * i-th input parameter of the math fn, or `undefined` for slots
   * that have no caller reference (literals) or whose kind isn't
   * yet wired (scores). Empty array when the math fn has no
   * non-literal inputs.
   */
  public inputs: SharedInputSlot[] = []

  /**
   * The actual rebound inputs at every position, parallel to
   * `fn.inputs`. Includes literals AND storage/score refs — what
   * `inputs` (above) only captures for storage-kind slots. Used by
   * the visitor pipeline to compute each bridge's input shape key
   * (which determines whether two bridges can share a compile).
   *
   * Each entry is the rebound handle's `.node` (an AST
   * `MathExpressionNode`). For DataPoint inputs it's a
   * `StorageRefNode`; for Score inputs it'd be a
   * `ScoreboardRefNode`; for literals it's a `LiteralNode`.
   */
  public reboundInputs: MathExpressionNode[] = []

  constructor(
    core: SandstoneCore,
    mathFunction: MathFunctionNode,
    hostFunction: MCFunctionNode,
  ) {
    super(core.pack)
    this.mathFunction = mathFunction
    this.hostFunction = hostFunction
    core.mathFunctions.add(mathFunction)
  }

  /**
   * Append a body node — single-argument form to match
   * `ContainerCommandNode.append(node: Node): Node`. Multi-arg
   * routing uses `body.push(...nodes)` directly when needed.
   */
  append = (node: Node): Node => {
    this.body.push(node)
    return node
  }

  /**
   * Convenience for callers that already have a Node[] (matches
   * `ContainerNode.append(...nodes: MathNode[]): MathNode | MathNode[]`
   * on the math side).
   */
  appendAll = (...nodes: Node[]): Node | Node[] => {
    this.body.push(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }
}
