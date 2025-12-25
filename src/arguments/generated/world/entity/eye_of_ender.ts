import type { EntityBase } from 'sandstone/arguments/generated/world/entity'
import type { ItemStack } from 'sandstone/arguments/generated/world/item'

export type EyeOfEnder = (EntityBase & {
  /**
     * Item to render as.
     */
  Item?: ItemStack
})
