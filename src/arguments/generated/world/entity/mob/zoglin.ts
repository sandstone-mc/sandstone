import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.js'

export type Zoglin = (MobBase & {
  /**
     * Whether it is a baby.
     */
  IsBaby?: boolean
})
