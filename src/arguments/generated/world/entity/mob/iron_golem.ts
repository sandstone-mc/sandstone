import type { MobBase, NeutralMob } from 'sandstone/arguments/generated/world/entity/mob.ts'

export type IronGolem = (MobBase & NeutralMob & {
  /**
   * Whether a player created it.
   */
  PlayerCreated?: boolean
})
