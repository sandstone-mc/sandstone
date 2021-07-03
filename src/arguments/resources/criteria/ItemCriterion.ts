/* eslint-disable camelcase */
import type { ITEMS } from 'src/arguments'
import type { LiteralUnion } from '@/generalTypes'
import type { TagInstance } from '@resources'
import type { EnchantmentCriterion, NumberProvider } from '.'

export type ItemCriterion = Partial<{
  /** Amount of the item. */
  count: NumberProvider

  /** The durability of the item. */
  durability: NumberProvider

  /** List of enchantments.  */
  enchantments: EnchantmentCriterion[]

  /** List of stored enchantments.  */
  stored_enchantments: EnchantmentCriterion[]

  /** An array of item IDs. */
  items: LiteralUnion<ITEMS>[]

  /** An NBT string. */
  nbt: string

  /** A brewed potion ID. */
  potion: string

  /** An item data pack tag. */
  tag: string | TagInstance<'items'>
}>
