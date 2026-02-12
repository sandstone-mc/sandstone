import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { LootTableClass, NBTList, NBTLong } from 'sandstone'

export type DecoratedPot = (BlockEntity & {
  /**
   * Item ID of what was used for each side of the pot. \
   * Only vanilla pottery sherds have hardcoded decoration textures.
   * Other items are treated like brick.
   *
   * Value:
   * List length range: 4
   */
  sherds?: NBTList<Registry['minecraft:item'], {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
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
