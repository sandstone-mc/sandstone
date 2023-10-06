import type { ObjectiveClass } from 'sandstone/variables/index.js'

/*
 * Utility types
 * TODO: add docs
 */
export type NumberProvider = number | {
  /** The maximum value. */
  max?: NumberProvider
  /** The minimum value. */
  min?: NumberProvider
} | {
  /**
   * The distribution type. Must be:
   * - `constant`: Constant value.
   * - `uniform`: Uniform distribution. A random integer is chosen with probability of each number being equal.
   * - `binomial`: Binomial distribution. Roll a number of times, each having a chance of adding 1 to the stack size.
   * - `score`: Value is taken from a score.
   */
  type: 'minecraft:constant'
  value: number
} | {
  /**
   * The distribution type. Must be:
   * - `constant`: Constant value.
   * - `uniform`: Uniform distribution. A random integer is chosen with probability of each number being equal.
   * - `binomial`: Binomial distribution. Roll a number of times, each having a chance of adding 1 to the stack size.
   * - `score`: Value is taken from a score.
   */
  type: 'minecraft:uniform'
  min: NumberProvider
  max: NumberProvider
} | {
  /**
   * The distribution type. Must be:
   * - `constant`: Constant value.
   * - `uniform`: Uniform distribution. A random integer is chosen with probability of each number being equal.
   * - `binomial`: Binomial distribution. Roll a number of times, each having a chance of adding 1 to the stack size.
   * - `score`: Value is taken from a score.
   */
  type: 'minecraft:binomial'
  n: NumberProvider
  p: NumberProvider
} | {
  /**
   * The distribution type. Must be:
   * - `constant`: Constant value.
   * - `uniform`: Uniform distribution. A random integer is chosen with probability of each number being equal.
   * - `binomial`: Binomial distribution. Roll a number of times, each having a chance of adding 1 to the stack size.
   * - `score`: Value is taken from a score.
   */
  type: 'minecraft:score'
  target: 'block_entity' | 'this' | 'killer' | 'killer_player' | {
    type: 'minecraft:context'
    target: 'block_entity' | 'this' | 'killer' | 'killer_player'
  } | {
    type: 'minecraft:fixed'
    name: string
  }
  score: string | ObjectiveClass
  scale?: number
}
