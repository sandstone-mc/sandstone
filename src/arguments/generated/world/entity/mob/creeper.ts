import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTByte, NBTShort } from 'sandstone'

export type Creeper = (MobBase & {
  /**
     * Whether it is being struck by lightning.
     */
  powered?: boolean
  /**
     * Radius of the explosion.
     */
  ExplosionRadius?: NBTByte
  /**
     * Ticks until it explodes.
     */
  Fuse?: NBTShort
  /**
     * Whether it was lit with flint and steel.
     */
  ignited?: boolean
})
