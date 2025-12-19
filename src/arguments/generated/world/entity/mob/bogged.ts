import type { MobBase } from 'sandstone/generated/world/entity/mob'

export type Bogged = (MobBase & {
    /**
     * Whether the mushrooms on this bogged have been sheared.
     */
    sheared?: boolean
})
