import type { LiteralUnion } from '@/generalTypes'
import type { BLOCKS, DIMENSION_TYPES, MOB_EFFECTS } from '@arguments'
import type { NumberOrMinMax } from './utils'

// All the possible criteria
export type BlockIdCriterion = LiteralUnion<BLOCKS>

export type SlotCriterion = Partial<{
  /** The amount of slots empty in the inventory. */
  empty: NumberOrMinMax

  /** The amount of slots completely filled (stacksize) in the inventory. */
  full: NumberOrMinMax

  /** The amount of slots occupied in the inventory. */
  occupied: NumberOrMinMax
}>

export type DistanceCriterion = Partial<{
  absolute: NumberOrMinMax
  horizontal: NumberOrMinMax
  x: NumberOrMinMax
  y: NumberOrMinMax
  z: NumberOrMinMax
}>

export type PotionIdCriterion = string

export type DimensionCriterion = LiteralUnion<DIMENSION_TYPES>

export type EffectCriterion = Partial<Record<LiteralUnion<MOB_EFFECTS>, {
  /** The effect amplifier. */
  amplifier?: NumberOrMinMax
  /** The effect duration in ticks. */
  duration?: NumberOrMinMax
}>>
