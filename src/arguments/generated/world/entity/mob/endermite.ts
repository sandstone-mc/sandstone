import type { MobBase } from 'sandstone/generated/world/entity/mob'
import type { NBTInt } from 'sandstone'

export type Endermite = (MobBase & {
    /**
     * How long it has existed.
     */
    Lifetime?: NBTInt
    /**
     * Whether enderman should attack it.
     */
    PlayerSpawned?: boolean
})
