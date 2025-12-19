import type { NumberProvider } from './utils.js'
import type { Registry } from 'sandstone/arguments/generated/registry'

// All the possible criteria
export type BlockIdCriterion = Registry['minecraft:block']

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
}> &
  PositionCriterion

export type EnchantmentCriterion = {
  /** An enchantment ID. */
  enchantment: Registry['minecraft:enchantment']

  /** The level of the enchantment. */
  levels: NumberProvider
}

export type PotionIdCriterion = string

export type DimensionCriterion = Registry['minecraft:dimension']

export type EffectCriterion = Partial<
  Record<
    Registry['minecraft:mob_effect'],
    {
      /** The effect amplifier. */
      amplifier?: NumberProvider
      /** The effect duration in ticks. */
      duration?: NumberProvider
    }
  >
>
