import type { MobBase } from 'sandstone/generated/world/entity/mob'
import type { NBTInt } from 'sandstone'

export type Skeleton = (MobBase & {
    /**
     * Time until it converts to a stray.
     */
    StrayConversionTime?: NBTInt
})
