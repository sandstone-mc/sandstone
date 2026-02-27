import type { ConditionNode } from '..'
import type { Score } from 'sandstone/variables'
import { ScoreConditionNode } from '../conditions/variables/score'
import { AndNode } from '../conditions/and'
import { OrNode } from '../conditions/or'
import { NotNode } from '../conditions/not'

/**
 * Parses a Minecraft range string (e.g., "..4", "0..10", "5") and checks if a value satisfies it.
 */
function valueMatchesRange(value: number, rangeStr: string): boolean {
  // Range format: "min..max", "min..", "..max", or exact "N"
  if (rangeStr.includes('..')) {
    const [minStr, maxStr] = rangeStr.split('..')
    const min = minStr !== '' ? parseInt(minStr, 10) : Number.NEGATIVE_INFINITY
    const max = maxStr !== '' ? parseInt(maxStr, 10) : Number.POSITIVE_INFINITY
    return value >= min && value <= max
  }
  // Exact match
  return value === parseInt(rangeStr, 10)
}

/**
 * Result of static condition analysis.
 * - `{ canAnalyze: false }` - condition references other variables or can't be analyzed
 * - `{ canAnalyze: true, result: boolean }` - condition was evaluated statically
 */
export type AnalysisResult = { canAnalyze: false } | { canAnalyze: true; result: boolean }

/**
 * Recursively analyzes a condition node to check if it only references the given score
 * and evaluates to true/false for the given value.
 */
export function analyzeCondition(
  condition: ConditionNode,
  targetScore: Score,
  value: number,
  negated = false,
): AnalysisResult {
  if (condition instanceof ScoreConditionNode) {
    // ScoreConditionNode.args = [target, objective, 'matches', range]
    // or for comparisons: [target, objective, operator, otherTarget, otherObjective]
    const args = condition.args

    if (args.length >= 4 && args[2] === 'matches') {
      const [target, objective, , rangeStr] = args

      // Check if condition references the target score (and only the target score)
      if (target !== `${targetScore.target}` || objective !== `${targetScore.objective}`) {
        return { canAnalyze: false }
      }

      // Evaluate the range against the value
      let result = valueMatchesRange(value, rangeStr)
      if (negated) result = !result
      return { canAnalyze: true, result }
    }

    // Score comparison against another score - can't analyze statically
    return { canAnalyze: false }
  }

  if (condition instanceof AndNode) {
    // All conditions must be analyzable and true
    for (const subCondition of condition.conditions) {
      const subResult = analyzeCondition(subCondition, targetScore, value, negated)
      if (!subResult.canAnalyze) return { canAnalyze: false }
      if (!subResult.result) return { canAnalyze: true, result: false }
    }
    return { canAnalyze: true, result: true }
  }

  if (condition instanceof OrNode) {
    // At least one condition must be true (all must be analyzable)
    let anyTrue = false
    for (const subCondition of condition.conditions) {
      const subResult = analyzeCondition(subCondition, targetScore, value, negated)
      if (!subResult.canAnalyze) return { canAnalyze: false }
      if (subResult.result) anyTrue = true
    }
    return { canAnalyze: true, result: anyTrue }
  }

  if (condition instanceof NotNode) {
    // Negate the result
    return analyzeCondition(condition.condition, targetScore, value, !negated)
  }

  // Unknown condition type - can't analyze
  return { canAnalyze: false }
}

/**
 * Gets a user-friendly location string from a stack trace, filtering out internal files.
 */
export function getDeclarationLocation(): string {
  const stack = new Error().stack
  const locationMatch = stack?.split('\n').find(line =>
    line.includes('.ts:') && !line.includes('/loops/') && !line.includes('node_modules'),
  )
  return locationMatch?.trim() || 'unknown location'
}

/**
 * Warns about a statically false loop condition.
 */
export function warnStaticallyFalseCondition(loopType: string, details: string): void {
  const location = getDeclarationLocation()
  console.warn(
    `[Sandstone] Warning: ${loopType} loop condition is statically false (${details}). ` +
    `The loop body will never execute. If this is intentional, you can ignore this warning.\n` +
    `  at ${location}`,
  )
}
