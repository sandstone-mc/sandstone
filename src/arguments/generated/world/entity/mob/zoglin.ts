import type { MobBase } from 'sandstone/generated/world/entity/mob'

export type Zoglin = (MobBase & {
    /**
     * Whether it is a baby.
     */
    IsBaby?: boolean
})
