import type { DataPointClass } from '../../../variables/Data'
import type { MathExpressionNode } from '../ast/MathExpressionNode'
import { MathExpressionNode as MathExpressionNodeClass } from '../ast/MathExpressionNode'
import { AggregateNode, BinaryOpNode } from '../ast/nodes/operators'
import { LiteralNode } from '../ast/nodes/leaves'
import type { MathFunctionNode } from '../ast/MathFunctionNode'
import type { MathNode } from '../ast/MathNode'
import { MathAnalysisVisitor } from './MathVisitor'

/**
 * Single chain update — one imperative `data modify ... compute ...`
 * command emitted to mcfunction output, plus the provider JSON it
 * references. `isFirst` distinguishes the FIRST op on its handle's
 * chain (full compile — provider computes its LHS from inputs
 * directly) from subsequent ops (incremental — LHS substituted with
 * a `minecraft:storage` read of the handle's intermediate storage).
 */
export interface ChainUpdate {
  handleName: string
  expression: MathExpressionNode
  /**
   * Snapshot of each chain root's state at the moment this update
   * was constructed. Used by `substituteRoots` to inline the
   * previous chain state for first-op compiles without recursing
   * back into earlier BinOps/Aggregates.
   */
  statesBefore: Map<MathExpressionNode, MathExpressionNode>
  isFirst: boolean
}

/**
 * Static analysis of a math function's chain structure. Computed
 * by `MathChainAnalysisVisitor` and consumed by the compiler
 * (`planMultiStatementEmit`) when generating imperative commands
 * + provider JSONs.
 *
 * Lives behind a visitor so new analyses (constant folding,
 * dead-store elimination, common subexpression inlining) can
 * append to `defaultMathAnalyses()` without compiler changes.
 * Each transform visitor that runs before this analysis mutates
 * `fn.allNodes` first; the analysis reads the post-transform AST.
 */
export interface MathChainAnalysis {
  /**
   * Two flavours of root:
   *
   * - `InputRoots` — "no predecessor" leaves (CopyNode /
   *   LiteralNode / StorageRefNode from `_.float(input)` etc.).
   *   These are chain IDENTITIES (the baseline value the chain
   *   was constructed from). The incremental compiler MUST NOT
   *   substitute them with handle-storage reads — that would yield
   *   the LAST chain update's value rather than the baseline.
   *
   * - `chainStartRoots` — every currently-bound handle's
   *   `startNode` (the node created at handle construction time).
   *   These ARE independent chain ROOTS with their own allocated
   *   storage. Crucial for snapshot semantics: an inline
   *   `_.modulo(rx, val)` registers a chain-start root so its
   *   value gets captured to its own storage BEFORE the rx chain
   *   gets further mutated.
   */
  inputRoots: Set<MathExpressionNode>
  chainStartRoots: Set<MathExpressionNode>
  /**
   * `transients` — values consumed only by an enclosing operator
   * (BinOp `operands[N>=1]`, Aggregate `inputs[N>=1]`). Excluded
   * from chain-root classification AND from being emitted as
   * standalone updates. Their data lives inside the enclosing
   * operator's provider JSON.
   */
  transients: Set<MathExpressionNode>
  /**
   * Per-update details in chronological (allNodes) order. The
   * compiler iterates this list when emitting `data modify ...
   * compute ... float <provider>` commands; `isFirst` selects
   * between full and incremental provider compilation per update.
   */
  updates: ChainUpdate[]
  /**
   * Stable per-root handle IDs (`h_0`, `h_1`, ...) assigned in
   * first-appearance order during the chronological walk. The
   * compiler uses these to namespace handle storage paths.
   */
  rootToId: Map<MathExpressionNode, string>
}

/**
 * `MathChainAnalysisVisitor` — derive the math chain topology
 * (`MathChainAnalysisVisitor`) from `fn.allNodes`. Replaces the previous
 * top-level `analyzeMathChain` function so the chain analysis
 * participates in the visitor pipeline (transforms first, analyses
 * second; compiler reads `fn.analyses.get('chain')`).
 *
 * Output is stored under the key `'chain'` for the compiler to
 * pick up. Future analyses register their own keys.
 */
export class MathChainAnalysisVisitor extends MathAnalysisVisitor<MathChainAnalysis> {
  override readonly key = 'chain'

  override analyze(fn: MathFunctionNode): MathChainAnalysis {
    // -----------------------------------------------------------------------
    // Pass 1: classify roots and transients.
    // -----------------------------------------------------------------------

    // `transients` — values consumed only by an enclosing operator
    // (BinOp `operands[N>=1]`, Aggregate `inputs[N>=1]`). Excluded
    // from chain-root classification AND from being emitted as
    // standalone updates.
    const transients = new Set<MathExpressionNode>()
    for (const node of fn.allNodes) {
      if (BinaryOpNode.is(node)) {
        for (let i = 1; i < node.operands.length; i++) {
          transients.add(node.operands[i])
        }
      }
      if (AggregateNode.is(node)) {
        for (let i = 1; i < node.inputs.length; i++) {
          transients.add(node.inputs[i])
        }
      }
    }

    // `inputRoots` — "no predecessor" leaves (CopyNode /
    // LiteralNode / StorageRefNode from `_.float(input)` etc.).
    const inputRoots = new Set<MathExpressionNode>()
    for (const node of fn.allNodes) {
      if (!MathExpressionNodeClass.is(node)) continue
      if (transients.has(node)) continue
      const ast = node as {
        operands?: MathExpressionNode[]
        inputs?: MathExpressionNode[]
      }
      if (ast.operands?.[0] !== undefined) continue
      if (ast.inputs?.[0] !== undefined) continue
      inputRoots.add(node)
    }

    // `chainStartRoots` — every bound handle's `startNode`
    // (the node created at handle construction time). Populated
    // by `BaseHandle._registerHandleWithActiveFunction` for every
    // handle constructed inside the active math function.
    const chainStartRoots = new Set<MathExpressionNode>(fn.startNodes)

    // Drop any root that was also classified as transient — root
    // identity wins.
    for (const r of chainStartRoots) transients.delete(r)
    for (const r of inputRoots) transients.delete(r)

    const roots = new Set<MathExpressionNode>([...inputRoots, ...chainStartRoots])

    // -----------------------------------------------------------------------
    // Pass 2: collect updates chronologically.
    // -----------------------------------------------------------------------

    // `rootToId` — stable per-root handle IDs (`h_0`, `h_1`, ...).
    const rootToId = new Map<MathExpressionNode, string>()
    let handleCounter = 0
    // `chainState` — each root's latest seen chain state (used by
    // `statesBefore` snapshots and by `findReturnHandleName`).
    const chainState = new Map<MathExpressionNode, MathExpressionNode>()
    for (const r of roots) chainState.set(r, r)

    // Helper: walk backward via `operands[0]`/`inputs[0]` until we
    // hit a root, returning the root (or undefined if none reachable
    // — shouldn't happen for any chain-extension node given the root
    // classification above).
    function chainRootOf(node: MathExpressionNode): MathExpressionNode | undefined {
      let current: MathExpressionNode | undefined = node
      const seen = new Set<MathExpressionNode>()
      while (current && !seen.has(current)) {
        seen.add(current)
        if (roots.has(current)) return current
        const ast = current as {
          operands?: MathExpressionNode[]
          inputs?: MathExpressionNode[]
        }
        const next: MathExpressionNode | undefined =
          ast.operands?.[0] ?? ast.inputs?.[0]
        if (next === undefined) return undefined
        current = next
      }
      return undefined
    }

    // Stable handle IDs assigned in first-appearance order. Each
    // BinOp/Aggregate whose chain-rootable LHS / startNode reaches
    // a root gets that root registered here — without this pass the
    // chain's root wouldn't have an ID before the update-collection
    // pass below, and updates that share the same root would fight
    // for IDs.
    for (const node of fn.allNodes) {
      if (!MathExpressionNodeClass.is(node)) continue
      if (transients.has(node)) continue
      const ref = BinaryOpNode.is(node)
        ? node.operands[0]
        : AggregateNode.is(node)
          ? node.inputs[0]
          : undefined
      if (ref === undefined || !roots.has(ref)) continue
      const root = chainRootOf(ref)
      if (root && !rootToId.has(root)) {
        rootToId.set(root, `h_${handleCounter++}`)
      }
    }

    // Walk allNodes chronologically to collect updates. Each
    // non-transient BinOp / Aggregate that reaches a root is an
    // update; its `isFirst` flag distinguishes the FIRST op on its
    // handle's chain (full compile) from subsequent ops (incremental,
    // LHS substituted with a `minecraft:storage` read).
    const updates: ChainUpdate[] = []
    const firstPerRoot = new Set<MathExpressionNode>(roots)
    for (const node of fn.allNodes) {
      if (BinaryOpNode.is(node)) {
        if (transients.has(node)) continue
        const root = chainRootOf(node)
        if (!root) continue
        if (!rootToId.has(root)) {
          rootToId.set(root, `h_${handleCounter++}`)
        }
        const isFirst = firstPerRoot.has(root)
        firstPerRoot.delete(root)
        updates.push({
          handleName: rootToId.get(root)!,
          expression: node,
          statesBefore: new Map(chainState),
          isFirst,
        })
        chainState.set(root, node)
      } else if (AggregateNode.is(node)) {
        if (transients.has(node)) continue
        const root = chainRootOf(node.inputs[0])
        if (!root) continue
        if (!rootToId.has(root)) {
          rootToId.set(root, `h_${handleCounter++}`)
        }
        const isFirst = firstPerRoot.has(root)
        firstPerRoot.delete(root)
        updates.push({
          handleName: rootToId.get(root)!,
          expression: node,
          statesBefore: new Map(chainState),
          isFirst,
        })
        chainState.set(root, node)
      }
    }

    // Return handle resolution lives in `ReturnHandleAnalysis`
    // (split out so the chain analysis doesn't carry the
    // responsibility). The compiler reads both via
    // `fn.analyses.get(...)`.

    // When the constant folder reduces the entire chain to a
    // literal, the math function's return value is the literal
    // itself. `fn.constantResult` (set by `ConstantFoldingVisitor`
    // during its pass) carries it through so the chain analysis
    // sees a real operator-like entry to emit — otherwise
    // `updates` would be empty and the compiler would produce no
    // command at all.
    const constantResult = fn.constantResult
    if (constantResult && updates.length === 0) {
      updates.push({
        handleName: 'const_result',
        expression: constantResult,
        statesBefore: new Map(chainState),
        isFirst: true,
      })
      rootToId.set(constantResult, 'const_result')
    }

    return {
      inputRoots,
      chainStartRoots,
      transients,
      updates,
      rootToId,
    }
  }
}

// Re-export so callers can `import { MathChainAnalysisVisitor }`
// without reaching into individual files.
export { DataPointClass, MathExpressionNode, MathFunctionNode, MathNode }