import type { EntityBase } from 'sandstone/generated/world/entity'
import type { ItemStack } from 'sandstone/generated/world/item'

export type EyeOfEnder = (EntityBase & {
    /**
     * Item to render as.
     */
    Item?: ItemStack
})
