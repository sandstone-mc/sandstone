import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { NBTInt, NBTShort } from 'sandstone'

export type JsonExperienceOrb = (JsonEntityBase & {
  /**
   * Ticks that it has existed.
   */
  Age?: (NBTShort | number),
  Health?: (NBTShort | number),
  /**
   * Amount of experience it will give.
   */
  Value?: (NBTShort | number),
  /**
   * Remaining number of times that the orb can be picked up.
   * When the orb is picked up, the value decreases by 1.
   * When multiple orbs are merged, their values are added up to result orb.
   * When the value reaches 0, the orb is depleted.
   */
  Count?: (NBTInt | number),
})
