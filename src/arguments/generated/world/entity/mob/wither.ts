import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type Wither = (MobBase & {
  /**
   * Ticks it is invulnerable for.
   */
  Invul?: NBTInt
})
