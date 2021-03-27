import type {
  BLOCKS, DIMENSION_TYPES, ENCHANTMENTS, MOB_EFFECTS,
} from 'src/arguments'
import type { LiteralUnion } from '@/generalTypes'
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

export type PositionCriterion = Partial<{
  /** The X-axis position. */
  x: NumberOrMinMax

  /** The Y-axis position. */
  y: NumberOrMinMax

  /** The Z-axis position. */
  z: NumberOrMinMax
}>

export type DistanceCriterion = Partial<{
  absolute: NumberOrMinMax
  horizontal: NumberOrMinMax
}> & PositionCriterion

export type EnchantmentCriterion = {
  /** An enchantment ID. */
  enchantment: LiteralUnion<ENCHANTMENTS>

  /** The level of the enchantment. */
  levels: NumberOrMinMax
}

export type PotionIdCriterion = string

export type DimensionCriterion = LiteralUnion<DIMENSION_TYPES>

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export type EffectCriterion = Partial<Record<LiteralUnion<MOB_EFFECTS>, {
  /** The effect amplifier. */
  amplifier?: NumberOrMinMax
  /** The effect duration in ticks. */
  duration?: NumberOrMinMax
}>>
