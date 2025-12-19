import type { Enchantment, ItemBase } from 'sandstone/generated/world/item'

export type EnchantedBook = (ItemBase & {
    StoredEnchantments?: Array<Enchantment>
})
