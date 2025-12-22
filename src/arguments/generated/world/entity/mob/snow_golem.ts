import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.js'

export type SnowGolem = (MobBase & {
  /**
     * Whether it has a pumpkin.
     */
  Pumpkin?: boolean
})
