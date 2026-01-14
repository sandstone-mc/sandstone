import type { AgeableMob, MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type GlowSquid = (MobBase & AgeableMob & {
  /**
   * Ticks that it will wait before glowing.
   */
  DarkTicksRemaining?: NBTInt
})
