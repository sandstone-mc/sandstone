import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.js'
import type { NBTInt } from 'sandstone'

export type Ghast = (MobBase & {
  /**
     * Explosion radius of fireballs that are shot from it.
     *
     * Value:
     * Range: 0..
     */
  ExplosionPower?: NBTInt<{
    min: 0
  }>
})
