import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'

export type JsonSnowGolem = (JsonMobBase & {
  /**
   * Whether it has a pumpkin.
   */
  Pumpkin?: boolean,
})
