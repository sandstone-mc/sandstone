import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob'

export type Bat = (MobBase & {
  /**
     * Whether it is upside down.
     */
  BatFlags?: boolean
})
