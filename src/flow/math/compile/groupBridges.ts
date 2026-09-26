import type { MathExpressionNode } from '../ast/MathExpressionNode'
import { LiteralNode } from '../ast/nodes/leaves'
import { ScoreboardRefNode, StorageRefNode } from '../ast/nodes/leaves'
import type { Score } from '../../../variables/Score'
import type { DataPointClass } from '../../../variables/Data'
import type { MathInvocationNode } from './MathInvocationNode'

/**
 * Per-position input descriptor. Two bridges share a compile iff
 * their shape-key tuples match position-by-position.
 *
 * `storage` / `score` / `literal` / `complex` — the four shapes
 * the user can pass to a math block invocation:
 *
 *   - `storage` — a DataPointClass (storage ref). Two positions
 *     with the same DataPoint identity match.
 *   - `score` — a Score (ScoreboardRefNode). Same Score identity
 *     matches.
 *   - `literal` — a numeric constant. Same value + same math kind
 *     (`'float' | 'integer'`) matches. Floats and integers are
 *     separate domains — `5d` ≠ `5b`.
 *   - `complex` — any other expression (e.g. `a + b` passed as an
 *     input). Currently always unique — the compiler can't safely
 *     dedupe without equality analysis.
 */
export type InputShape =
  | { kind: 'storage'; dp: DataPointClass }
  | { kind: 'score'; score: Score }
  | { kind: 'literal'; value: number; mathKind: 'float' | 'integer' }
  | { kind: 'complex'; node: MathExpressionNode }

/**
 * Compute the per-position shape for a single rebound input.
 */
export function computeInputShape(input: MathExpressionNode): InputShape {
  if (StorageRefNode.is(input)) {
    return { kind: 'storage', dp: input.dataPoint }
  }
  if (ScoreboardRefNode.is(input)) {
    return { kind: 'score', score: input.score }
  }
  if (LiteralNode.is(input)) {
    return { kind: 'literal', value: input.value, mathKind: input.kind }
  }
  return { kind: 'complex', node: input }
}

/**
 * Stable string key for the bridge's full input shape tuple.
 * Two bridges share a compile iff their keys are equal.
 *
 * The format is opaque — it's only ever compared for equality.
 * Per-position descriptors are joined by a separator that's
 * illegal in the underlying fields (`|` is fine for DataPoint
 * identifiers and literal values; if a complex AST ever contains
 * `|` in its toString it'd still serialize distinctly because we
 * prefix each segment with its kind tag).
 */
export function computeInputShapeKey(inputs: readonly MathExpressionNode[]): string {
  return inputs
    .map((input) => {
      const shape = computeInputShape(input)
      switch (shape.kind) {
        case 'storage':
          return `storage:${shape.dp.currentTarget as string}:${String(shape.dp.path)}`
        case 'score':
          return `score:${String(shape.score.target)}:${String(shape.score.objective)}`
        case 'literal':
          return `literal:${shape.mathKind}:${shape.value}`
        case 'complex':
          return `complex:${String(shape.node)}`
      }
    })
    .join('|')
}

/**
 * A group of bridges with identical input shape — they share a
 * single compiled plan. The first bridge is the "primary" — its
 * plan is the one the compiler emits imperative commands for;
 * other bridges in the group reference the primary's provider JSONs
 * but still emit their own per-call commands (each writing to its
 * own result storage).
 */
export interface BridgeGroup {
  key: string
  bridges: MathInvocationNode[]
}

/**
 * Group bridges by their input shape key. Two bridges land in the
 * same group iff their input shapes are position-by-position
 * equivalent.
 */
export function groupBridgesByInputShape(
  bridges: readonly MathInvocationNode[],
): BridgeGroup[] {
  const byKey = new Map<string, MathInvocationNode[]>()
  for (const bridge of bridges) {
    const key = computeInputShapeKey(bridge.reboundInputs)
    let bucket = byKey.get(key)
    if (!bucket) {
      bucket = []
      byKey.set(key, bucket)
    }
    bucket.push(bridge)
  }
  const groups: BridgeGroup[] = []
  for (const [key, bucket] of byKey) {
    groups.push({ key, bridges: bucket })
  }
  return groups
}