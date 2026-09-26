import type { MathFunctionNode } from '../ast/MathFunctionNode'
import type { MathNode } from '../ast/MathNode'
import { AlgebraicSimplificationVisitor } from './algebraicSimplification'
import { ConstantFoldingVisitor } from './constantFolding'
import { FlattenExpressionChainVisitor } from './flattenExpressionChain'
import { MathAnalysisVisitor, MathVisitor } from './MathVisitor'
import { MathChainAnalysisVisitor } from './mathChainAnalysis'
import { ChainReachabilityAnalysisVisitor } from './chainReachabilityAnalysis'
import { ReturnHandleVisitor } from './returnHandle'

/**
 * The default pre-analysis TRANSFORM pipeline for math functions.
 *
 * Each visitor mutates `fn.allNodes` in place during its pass;
 * subsequent visitors (and the downstream analyses) see the
 * transformed AST. New visitors get appended here — order matters
 * because later visitors see earlier visitors' mutations.
 *
 * Mirrors `defaultVisitors(pack)` in `pack/pack.ts` for the core
 * command/flow visitor pipeline: a single list, executed in
 * order, each visitor self-contained.
 *
 * Current pipeline:
 *
 *   1. `FlattenExpressionChainVisitor` — collapse chains of
 *      `add`/`mul`/`min`/`max` aggregates into n-ary aggregates;
 *      collapse `sub`/`div`/`pow` LHS-extending chains into
 *      `sub`/`div`/`pow` over `add`/`mul` aggregates. Saves one
 *      imperative `data modify ... compute ... float` command per
 *      flattened step + eliminates the redundant intermediate
 *      storage write the inner node would have produced.
 *
 *   2. `AlgebraicSimplificationVisitor` — apply algebraic identity
 *      rewrites: `sub(0, x) → negate(x)`, `sub(x, x) → 0`,
 *      `div(x, x) → 1`, `add(x, negate(x)) → 0`,
 *      `negate(negate(x)) → x`. Runs after flattening and before
 *      constant folding so literal results feed the folder's
 *      identity filter. Recursive — overrides `run(fn)` with a
 *      fixpoint loop so arbitrarily-nested identity chains
 *      collapse fully in a single registration.
 *
 *   3. `ConstantFoldingVisitor` — evaluate literal-literal
 *      arithmetic at build time, apply algebraic identity rules
 *      (`add(x, 0) → x`, `mul(x, 0) → 0`, `pow(x, 1) → x`, ...),
 *      and collapse aggregate identities (`add([0, x]) → x`,
 *      `mul([0, ...]) → 0`). Runs after the algebraic pass so the
 *      literal results (`0`, `1`, surviving operands of
 *      cancelled terms) feed the identity filter.
 *
 * Future visitors (dead-store eliminator, common-subexpression
 * inliner, etc.) hook into the same list — the compiler never
 * needs to know about them individually.
 */
export function defaultMathTransformVisitors(): MathVisitor[] {
  return [
    new FlattenExpressionChainVisitor(),
    new AlgebraicSimplificationVisitor(),
    new ConstantFoldingVisitor(),
  ]
}

/**
 * The default ANALYSIS pipeline for math functions. Analyses
 * run AFTER the transforms (so they see the post-transform AST)
 * and store their outputs in `fn.analyses.get(key)`. The compiler
 * reads the entries it needs and ignores the rest.
 *
 * Each analysis is read-only — no AST mutation, no orphan
 * tracking. The pipeline runner invokes `onStart(fn)` →
 * `analyze(fn)` (result stored) → `onEnd(fn)` for every entry.
 *
 * Current pipeline:
 *
 *   1. `MathChainAnalysisVisitor` — derives `MathChainAnalysisVisitor`
 *      (chain topology, transient classification, updates list,
 *      return-handle ID). The compiler reads it via
 *      `fn.analyses.get('chain')` to generate the imperative +
 *      provider plan.
 *
 * Future analyses:
 *   - `ChainReachabilityAnalysisVisitor` (which nodes forward-reach
 *     which roots — already implemented inline as
 *     `collectChainNodesByRoot` in `multiStatementEmit.ts`; could
 *     move here).
 *   - `DeadStoreAnalysis` (which handle storages are never read
 *     after being written — would let us drop unused `data
 *     modify` writes for transit-only handles).
 *   - `ReturnHandleVisitor` (which chain root corresponds to
 *     `_.return(value)` — currently inline in
 *     `MathChainAnalysisVisitor` — uses `findReturnHandleName`.
 */
export function defaultMathAnalyses(): MathAnalysisVisitor<unknown>[] {
  return [
    // Order matters: analyses can depend on the outputs of earlier
    // analyses via `fn.analyses`. `MathChainAnalysisVisitor` runs
    // first because the others read its outputs.
    new MathChainAnalysisVisitor(),
    new ChainReachabilityAnalysisVisitor(),
    new ReturnHandleVisitor(),
  ]
}

/**
 * Run the full math visitor pipeline (transforms + analyses)
 * against a math function and apply their combined orphan list
 * + analysis outputs. Mirrors the pack visitor runner
 * (`generateResources`) in shape:
 *
 *   1. Transforms first: for each in pipeline order —
 *      `onStart(fn)` → `run(fn)` (walks `fn.allNodes`) →
 *      `onEnd(fn)`. Each transform's `orphans` accumulator
 *      collects absorbed nodes.
 *   2. Filter `fn.allNodes` so the compiler's chronological walk
 *      doesn't re-emit imperative commands for absorbed nodes.
 *   3. Analyses second: for each — `onStart(fn)` → `analyze(fn)`
 *      (result stored in `fn.analyses.get(key)`) → `onEnd(fn)`.
 *
 * The compiler reads the analyses it needs from `fn.analyses`
 * after the pipeline returns. To add a new transform: append to
 * `defaultMathTransformVisitors()`. To add a new analysis:
 * append to `defaultMathAnalyses()` with a unique key. No
 * compiler changes required for either.
 */
export function runDefaultMathVisitors(fn: MathFunctionNode): void {
  // Transforms first — they mutate `fn.allNodes`, and analyses
  // below need to read the post-transform state.
  const transforms = defaultMathTransformVisitors()
  for (const visitor of transforms) {
    visitor.onStart(fn)
    visitor.run(fn)
    visitor.onEnd(fn)
  }

  // Collect absorbed nodes from every transform. The set-based
  // merge handles the case where two transforms each absorb a
  // different set of nodes from the same pass.
  const orphanSet = new Set<MathNode>()
  for (const visitor of transforms) {
    for (const orphan of visitor.orphans) {
      orphanSet.add(orphan)
    }
  }
  if (orphanSet.size > 0) {
    fn.allNodes = fn.allNodes.filter((n) => !orphanSet.has(n))
  }

  // Analyses second — read-only, return values stored under
  // `visitor.key`.
  for (const visitor of defaultMathAnalyses()) {
    visitor.onStart(fn)
    fn.analyses.set(visitor.key, visitor.analyze(fn))
    visitor.onEnd(fn)
  }
}

// Re-export the public visitor surface so callers can pull the
// base classes + concrete visitors + pipeline from one place.
export {
  AlgebraicSimplificationVisitor,
  ChainReachabilityAnalysisVisitor,
  ConstantFoldingVisitor,
  FlattenExpressionChainVisitor,
  MathAnalysisVisitor,
  MathChainAnalysisVisitor,
  ReturnHandleVisitor,
  MathVisitor,
}