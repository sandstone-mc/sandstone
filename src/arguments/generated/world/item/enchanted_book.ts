import type { Enchantment, ItemBase } from 'sandstone/arguments/generated/world/item.ts'

export type EnchantedBook = (ItemBase & {
  StoredEnchantments?: Array<Enchantment>
})
