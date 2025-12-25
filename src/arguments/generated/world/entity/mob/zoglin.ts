import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob'

export type Zoglin = (MobBase & {
  /**
     * Whether it is a baby.
     */
  IsBaby?: boolean
})
