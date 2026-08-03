import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block.ts'
import type { PotDecorations } from 'sandstone/arguments/generated/world/component/block.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { LootTableClass, NBTLong } from 'sandstone'

export type DecoratedPot = (BlockEntity & {
  /**
   * Item ID of what was used for each side of the pot. \
   * Decoration textures are determined by `provides_pottery_pattern` component on the sherd items.
   */
  sherds?: PotDecorations,
} & {
  /**
   * Loot table that will populate this container.
   */
  LootTable?: (Registry['minecraft:loot_table'] | '' | LootTableClass),
  /**
   * Seed of the loot table.
   */
  LootTableSeed?: NBTLong,
  item?: ItemStack,
})
