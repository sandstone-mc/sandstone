import type { MathExpressionNode } from '../ast/MathExpressionNode'
import { MathExpressionNode as MathExpressionNodeClass } from '../ast/MathExpressionNode'
import { AggregateNode, BinaryOpNode } from '../ast/nodes/operators'
import type { MathFunctionNode } from '../ast/MathFunctionNode'
import { MathAnalysisVisitor } from './MathVisitor'

/**
 * `ChainReachabilityAnalysisVisitor` — for each chain root, gather every
 * chain node reachable from it via forward `operands[0]` / `inputs[0]`
 * propagation. Used by the incremental provider compiler to know
 * which `minecraft:storage` reads it can substitute — any chain
 * node reachable from a root can be replaced with that root's
 * handle's storage read (since each was previously written to
 * storage at some op earlier in the chain).
 *
 * Replaces the inline `collectChainNodesByRoot` helper that used to
 * live in `multiStatementEmit.ts`. Extracted so it can participate
 * in the visitor pipeline (analysis-stage) instead of being a
 * private helper called from the compiler.
 *
 * **Storage**: result lives in `fn.analyses.get('chainReachability')`
 * as `Map<MathExpressionNode, Set<MathExpressionNode>>` (root →
 * forward-reachable nodes). The compiler casts and consumes.
 */
export class ChainReachabilityAnalysisVisitor extends MathAnalysisVisitor<
  Map<MathExpressionNode, Set<MathExpressionNode>>
> {
  override readonly key = 'chainReachability'

  override analyze(
    fn: MathFunctionNode,
  ): Map<MathExpressionNode, Set<MathExpressionNode>> {
    // Reconstruct the same root classification the chain analysis
    // uses — we need the SAME set of roots, otherwise a root's
    // forward-reachable set would include nodes from a different
    // chain. Pull from the existing chain analysis output (set by
    // `MathChainAnalysisVisitor`, which runs first in the pipeline).
    const chainAnalysis = fn.analyses.get('chain') as
      | undefined
      | {
          inputRoots: Set<MathExpressionNode>
          chainStartRoots: Set<MathExpressionNode>
        }
    if (!chainAnalysis) {
      // Defensive — if the chain analysis didn't run (shouldn't
      // happen, but guard anyway), return an empty map and let
      // downstream code fail loudly if it expects data.
      return new Map()
    }
    const roots = new Set<MathExpressionNode>([
      ...chainAnalysis.inputRoots,
      ...chainAnalysis.chainStartRoots,
    ])

    // Initialize each root's reachable set with itself.
    const map = new Map<MathExpressionNode, Set<MathExpressionNode>>()
    for (const root of roots) {
      map.set(root, new Set([root]))
    }

    // Fixed-point iteration: propagate reachability along
    // `operands[0]` / `inputs[0]` edges until no new nodes are
    // added. O(N × depth) worst case but typically converges in
    // 2-3 passes for chains built from linear mutation sequences.
    let changed = true
    while (changed) {
      changed = false
      for (const node of fn.allNodes) {
        // Filter to MathExpressionNodes — the map's keys and values
        // are typed as `MathExpressionNode`, but `fn.allNodes` is
        // the broader `MathNode[]`. Non-expression nodes (e.g.
        // MathIfNode, MathReturnNode) aren't chain-extending
        // operators and don't belong in any reachable set.
        if (!MathExpressionNodeClass.is(node)) continue
        // Find the bucket whose reachable set already contains the
        // node's LHS / startNode — adding the current node extends
        // that bucket's chain.
        let targetBucket: Set<MathExpressionNode> | undefined
        if (BinaryOpNode.is(node) && node.operands[0]) {
          for (const bucket of map.values()) {
            if (bucket.has(node.operands[0])) {
              targetBucket = bucket
              break
            }
          }
        } else if (AggregateNode.is(node) && node.inputs[0]) {
          for (const bucket of map.values()) {
            if (bucket.has(node.inputs[0])) {
              targetBucket = bucket
              break
            }
          }
        }
        if (targetBucket && !targetBucket.has(node)) {
          targetBucket.add(node)
          changed = true
        }
      }
    }

    return map
  }
}