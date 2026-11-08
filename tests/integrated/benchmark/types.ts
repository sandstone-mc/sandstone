import type { MCFunctionClass, SandstonePack } from '../../../dist/exports/index.js'

export type { MCFunctionClass, SandstonePack }

export type BenchmarkTarget = (pack: SandstonePack) => MCFunctionClass<any, any>

/** What a benchmark file default-exports. */
export interface BenchmarkSpec {
  /** The first function under test. */
  a: BenchmarkTarget
  /** The second function under test. */
  b: BenchmarkTarget
  /** How many times per tick each function is called. */
  iterationsPerTick?: number
  /** Optional function run once before the measured window. */
  setup?: BenchmarkTarget
  /** Optional function run once after the measured window. */
  cleanup?: BenchmarkTarget
}
