import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'

export type SnowGolem = (MobBase & {
  /**
   * Whether it has a pumpkin.
   */
  Pumpkin?: boolean,
})
