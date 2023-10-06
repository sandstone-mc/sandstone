/* eslint-disable camelcase */
import type { ITEMS } from 'sandstone/arguments/index.js'
import type { TagClass } from 'sandstone/core/index.js'
import type { LiteralUnion } from 'sandstone/utils.js'
import type { EnchantmentCriterion, NumberProvider } from './index.js'

export type ItemCriterion = Partial<{
  /** Amount of the item. */
  count: NumberProvider

  /** The durability of the item. */
  durability: NumberProvider

  /** List of enchantments. */
  enchantments: EnchantmentCriterion[]

  /** List of stored enchantments. */
  stored_enchantments: EnchantmentCriterion[]

  /** An array of item IDs. */
  items: LiteralUnion<ITEMS>[]

  /** An NBT string. */
  nbt: string

  /** A brewed potion ID. */
  potion: string

  /** An item datapack tag. */
  tag: string | TagClass<'items'>
}>
