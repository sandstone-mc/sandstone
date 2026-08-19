import type { JsonMobBase, JsonNeutralMob } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'

export type JsonIronGolem = (JsonMobBase & JsonNeutralMob & {
  /**
   * Whether a player created it.
   */
  PlayerCreated?: boolean,
})
