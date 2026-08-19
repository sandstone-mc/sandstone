import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonDirectionByte } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { LootTableClass, NBTLong } from 'sandstone'

export type JsonBrushableBlock = (JsonBlockEntity & {
  /**
   * Loot table that will decide the brushed loot.
   */
  LootTable?: (JsonRegistry['minecraft:loot_table'] | '' | LootTableClass),
  /**
   * Seed of the loot table.
   */
  LootTableSeed?: (NBTLong | number),
  /**
   * Item that was rolled from the loot table, which is currently peeking out.
   */
  item?: JsonItemStack,
  /**
   * Direction of the block that was interacted with.
   * Write-only, is not saved by the game.
   *
   * Value:
   *
   *  - Down(`0`)
   *  - Up(`1`)
   *  - North(`2`)
   *  - South(`3`)
   *  - West(`4`)
   *  - East(`5`)
   */
  hit_direction?: JsonDirectionByte,
})
