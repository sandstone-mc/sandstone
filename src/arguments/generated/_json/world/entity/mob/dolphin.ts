import type { JsonAgeableMob, JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type JsonDolphin = (JsonMobBase & JsonAgeableMob & {
  /**
   * Whether it has gotten fish from a player.
   */
  GotFish?: boolean,
  /**
   * Moistness level of the dolphin.
   * Set to 2400 when the dolphin is in water or rain, otherwise decreases by 1 every tick.
   * The dolphin takes damage when level is at 0 or below.
   */
  Moistness?: (NBTInt | number),
})
