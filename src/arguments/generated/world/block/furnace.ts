import type { Registry } from 'sandstone/generated/registry'
import type { SlottedItem } from 'sandstone/generated/util/slot'
import type { BlockEntity, Lockable, Nameable } from 'sandstone/generated/world/block'
import type { NBTByte, NBTInt, NBTList, NBTShort } from 'sandstone'

export type Furnace = (BlockEntity & Nameable & Lockable & {
    /**
     * The items in this furnace, with slots:
     * * 0: Item being smelted
     * * 1: Fuel
     * * 2: Output
     *
     * Value:
     * List length range: 0..3
     */
    Items?: NBTList<SlottedItem<NBTByte<{
        min: 0
        max: 2
    }>>, {
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 3
    }>
    /**
     * Recipes that have been used since the last time a result item was removed from the GUI. Used to calculate the experience to give to the player.
     */
    RecipesUsed?: ({
        [Key in Extract<Registry['minecraft:recipe'], string>]?: NBTInt;
    })
} & {
    /**
     * Total ticks the item will take to be smelted.
     */
    cooking_total_time?: NBTShort
    /**
     * Ticks the item has been smelting for.
     */
    cooking_time_spent?: NBTShort
    /**
     * Ticks until the current fuel runs out.
     */
    lit_time_remaining?: NBTShort
    /**
     * Total ticks the current fuel will burn.
     */
    lit_total_time?: NBTShort
})
