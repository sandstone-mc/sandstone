import type { EntityBase } from 'sandstone/arguments/generated/world/entity.js'
import type { NBTInt, NBTShort } from 'sandstone'

export type ExperienceOrb = (EntityBase & {
  /**
     * Ticks that it has existed.
     */
  Age?: NBTShort
  Health?: NBTShort
  /**
     * Amount of experience it will give.
     */
  Value?: NBTShort
  /**
     * Remaining number of times that the orb can be picked up.
     * When the orb is picked up, the value decreases by 1.
     * When multiple orbs are merged, their values are added up to result orb.
     * When the value reaches 0, the orb is depleted.
     */
  Count?: NBTInt
})
