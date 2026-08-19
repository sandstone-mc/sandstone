import type { JsonMobBase, JsonNeutralMob } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NonEmptyString } from 'sandstone'

export type JsonZombiePigman = (JsonMobBase & JsonNeutralMob & {
  /**
   * Whether it is a baby.
   */
  IsBaby?: boolean,
  /**
   * Last player to hit a zombie pigman in this zombie pigman's detection range.
   */
  HurtBy?: NonEmptyString,
})
