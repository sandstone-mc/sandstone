import type { EntityBase } from 'sandstone/arguments/generated/world/entity.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'

export type EyeOfEnder = (EntityBase & {
  /**
   * Item to render as.
   */
  Item?: ItemStack,
})
