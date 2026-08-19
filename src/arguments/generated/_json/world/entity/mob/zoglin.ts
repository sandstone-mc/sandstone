import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'

export type JsonZoglin = (JsonMobBase & {
  /**
   * Whether it is a baby.
   */
  IsBaby?: boolean,
})
