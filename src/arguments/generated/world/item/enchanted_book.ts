import type { Enchantment, ItemBase } from 'sandstone/arguments/generated/world/item'

export type EnchantedBook = (ItemBase & {
  StoredEnchantments?: Array<Enchantment>
})
