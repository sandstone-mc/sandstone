import type { ItemBase, ItemStack } from 'sandstone/arguments/generated/world/item.js'
import type { NBTList } from 'sandstone'

export type Crossbow = (ItemBase & {
    /**
     * Projectiles that are loaded.
     *
     * Value:
     * List length range: 0..3
     */
    ChargedProjectiles?: NBTList<ItemStack, {
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 3
    }>
    /**
     * Whether the crossbow is charged.
     */
    Charged?: boolean
})
