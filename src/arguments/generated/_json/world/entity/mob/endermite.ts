import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type JsonEndermite = (JsonMobBase & {
  /**
   * How long it has existed.
   */
  Lifetime?: (NBTInt | number),
  /**
   * Whether enderman should attack it.
   */
  PlayerSpawned?: boolean,
})
