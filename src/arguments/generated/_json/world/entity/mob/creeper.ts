import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTByte, NBTShort } from 'sandstone'

export type JsonCreeper = (JsonMobBase & {
  /**
   * Whether it is being struck by lightning.
   */
  powered?: boolean,
  /**
   * Radius of the explosion.
   */
  ExplosionRadius?: (NBTByte | number),
  /**
   * Ticks until it explodes.
   */
  Fuse?: (NBTShort | number),
  /**
   * Whether it was lit with flint and steel.
   */
  ignited?: boolean,
})
