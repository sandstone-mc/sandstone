import type { MobBase } from 'sandstone/generated/world/entity/mob'
import type { NBTInt } from 'sandstone'

export type Wither = (MobBase & {
    /**
     * Ticks it is invulnerable for.
     */
    Invul?: NBTInt
})
