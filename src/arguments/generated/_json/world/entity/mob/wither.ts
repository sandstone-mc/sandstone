import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type JsonWither = (JsonMobBase & {
  /**
   * Ticks it is invulnerable for.
   */
  Invul?: (NBTInt | number),
})
