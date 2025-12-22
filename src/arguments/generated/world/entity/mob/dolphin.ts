import type { AgeableMob, MobBase } from 'sandstone/arguments/generated/world/entity/mob.js'
import type { NBTInt } from 'sandstone'

export type Dolphin = (MobBase & AgeableMob & {
  /**
     * Whether it has gotten fish from a player.
     */
  GotFish?: boolean
  /**
     * Moistness level of the dolphin.
     * Set to 2400 when the dolphin is in water or rain, otherwise decreases by 1 every tick.
     * The dolphin takes damage when level is at 0 or below.
     */
  Moistness?: NBTInt
})
