import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'

export type JsonEyeOfEnder = (JsonEntityBase & {
  /**
   * Item to render as.
   */
  Item?: JsonItemStack,
})
