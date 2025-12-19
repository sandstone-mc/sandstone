import type { EntityBase } from 'sandstone/arguments/generated/world/entity.js'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.js'

export type EyeOfEnder = (EntityBase & {
    /**
     * Item to render as.
     */
    Item?: ItemStack
})
