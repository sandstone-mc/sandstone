import type { AnyEntity } from 'sandstone/arguments/generated/world/entity.js'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.js'
import type { NBTInt } from 'sandstone'

export type AxolotlBucket = (ItemBase & {
    EntityTag?: AnyEntity
    /**
     * Turns into the `Variant` entity tag.
     */
    BucketVariantTag?: NBTInt
})

export type BasicFishBucket = {
    EntityTag?: AnyEntity
}
