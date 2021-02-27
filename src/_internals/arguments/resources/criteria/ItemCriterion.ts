/* eslint-disable camelcase */
import type { LiteralUnion } from '@/generalTypes'
import type { ITEMS } from '@arguments'
import type { TagClass } from '@resources'
import type { EnchantmentCriterion, NumberOrMinMax } from '.'

export type ItemCriterion = Partial<{
  /** Amount of the item. */
  count: NumberOrMinMax

  /** The durability of the item. */
  durability: NumberOrMinMax

  /** List of enchantments.  */
  enchantments: EnchantmentCriterion[]

  /** List of stored enchantments.  */
  stored_enchantments: EnchantmentCriterion[]

  /** An item ID. */
  item: LiteralUnion<ITEMS>

  /** An NBT string. */
  nbt: string

  /** A brewed potion ID. */
  potion: string

  /** An item data pack tag. */
  tag: string | TagClass<'items'>
}>
