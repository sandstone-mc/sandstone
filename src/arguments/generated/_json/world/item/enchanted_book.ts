import type { JsonEnchantment, JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'

export type JsonEnchantedBook = (JsonItemBase & {
  StoredEnchantments?: Array<JsonEnchantment>,
})
