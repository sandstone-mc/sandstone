import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.js'

export type Bat = (MobBase & {
    /**
     * Whether it is upside down.
     */
    BatFlags?: boolean
})
