import type { JsonAgeableMob, JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type JsonGlowSquid = (JsonMobBase & JsonAgeableMob & {
  /**
   * Ticks that it will wait before glowing.
   */
  DarkTicksRemaining?: (NBTInt | number),
})
