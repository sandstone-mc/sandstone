/* eslint-disable camelcase */
import type { TagClass } from 'sandstone/core'
import type { EnchantmentCriterion, NumberProvider } from './index.js'
import type { Registry } from 'sandstone/arguments/generated/registry'

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
  items: Registry['minecraft:item'][]

  /** An NBT string. */
  nbt: string

  /** A brewed potion ID. */
  potion: string

  /** An item datapack tag. */
  tag: string | TagClass<'items'>
}>
