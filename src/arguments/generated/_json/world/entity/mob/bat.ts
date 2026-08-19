import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'

export type JsonBat = (JsonMobBase & {
  /**
   * Whether it is upside down.
   */
  BatFlags?: boolean,
})
