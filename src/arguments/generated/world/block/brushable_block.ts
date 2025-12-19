import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { DirectionInt } from 'sandstone/arguments/generated/util/direction.js'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block.js'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.js'
import type { NBTLong } from 'sandstone'

export type BrushableBlock = (BlockEntity & {
    /**
     * Loot table that will decide the brushed loot.
     */
    LootTable?: (Registry['minecraft:loot_table'] | '')
    /**
     * Seed of the loot table.
     */
    LootTableSeed?: NBTLong
    /**
     * Item that was rolled from the loot table, which is currently peeking out.
     */
    item?: ItemStack
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
    hit_direction?: DirectionInt
})
