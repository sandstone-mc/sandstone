import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'

export type Zoglin = (MobBase & {
  /**
     * Whether it is a baby.
     */
  IsBaby?: boolean
})
