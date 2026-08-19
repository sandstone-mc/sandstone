import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type JsonGhast = (JsonMobBase & {
  /**
   * Explosion radius of fireballs that are shot from it.
   *
   * Value:
   * Range: 0..
   */
  ExplosionPower?: (NBTInt<{
    min: 0,
  }> | number),
})
