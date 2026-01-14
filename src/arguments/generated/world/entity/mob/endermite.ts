import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type Endermite = (MobBase & {
  /**
   * How long it has existed.
   */
  Lifetime?: NBTInt
  /**
   * Whether enderman should attack it.
   */
  PlayerSpawned?: boolean
})
