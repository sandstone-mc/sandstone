import type { JsonAnyEntity } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTInt } from 'sandstone'

export type JsonAxolotlBucket = (JsonItemBase & {
  EntityTag?: JsonAnyEntity,
  /**
   * Turns into the `Variant` entity tag.
   */
  BucketVariantTag?: (NBTInt | number),
})

export type JsonBasicFishBucket = {
  EntityTag?: JsonAnyEntity,
}
