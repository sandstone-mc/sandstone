import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonPotDecorations } from 'sandstone/arguments/generated/_json/world/component/block.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { LootTableClass, NBTLong } from 'sandstone'

export type JsonDecoratedPot = (JsonBlockEntity & {
  /**
   * Item ID of what was used for each side of the pot. \
   * Decoration textures are determined by `provides_pottery_pattern` component on the sherd items.
   */
  sherds?: JsonPotDecorations,
} & {
  /**
   * Loot table that will populate this container.
   */
  LootTable?: (JsonRegistry['minecraft:loot_table'] | '' | LootTableClass),
  /**
   * Seed of the loot table.
   */
  LootTableSeed?: (NBTLong | number),
  item?: JsonItemStack,
})
