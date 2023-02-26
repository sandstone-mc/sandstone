import type { NumberProvider } from './utils'
import type {
  BLOCKS, DIMENSIONS, ENCHANTMENTS, MOB_EFFECTS,
} from '#arguments'
import type { LiteralUnion } from '#utils'

// All the possible criteria
export type BlockIdCriterion = LiteralUnion<BLOCKS>

export type SlotCriterion = Partial<{
  /** The amount of slots empty in the inventory. */
  empty: NumberProvider

  /** The amount of slots completely filled (stacksize) in the inventory. */
  full: NumberProvider

  /** The amount of slots occupied in the inventory. */
  occupied: NumberProvider
}>

export type PositionCriterion = Partial<{
  /** The X-axis position. */
  x: NumberProvider

  /** The Y-axis position. */
  y: NumberProvider

  /** The Z-axis position. */
  z: NumberProvider
}>

export type DistanceCriterion = Partial<{
  absolute: NumberProvider
  horizontal: NumberProvider
}> & PositionCriterion

export type EnchantmentCriterion = {
  /** An enchantment ID. */
  enchantment: LiteralUnion<ENCHANTMENTS>

  /** The level of the enchantment. */
  levels: NumberProvider
}

export type PotionIdCriterion = string

export type DimensionCriterion = LiteralUnion<DIMENSIONS>

export type EffectCriterion = Partial<Record<LiteralUnion<MOB_EFFECTS>, {
  /** The effect amplifier. */
  amplifier?: NumberProvider
  /** The effect duration in ticks. */
  duration?: NumberProvider
}>>
