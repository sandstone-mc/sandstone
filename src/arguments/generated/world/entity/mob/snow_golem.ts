import type { MobBase } from 'sandstone/generated/world/entity/mob'

export type SnowGolem = (MobBase & {
    /**
     * Whether it has a pumpkin.
     */
    Pumpkin?: boolean
})
