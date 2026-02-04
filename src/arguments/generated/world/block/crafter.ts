import type { Container9 } from 'sandstone/arguments/generated/world/block/container.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type Crafter = (Container9 & {
  crafting_ticks_remaining?: NBTInt,
  /**
   * Value:
   * Array length range: ..9
   */
  disabled_slots?: NBTIntArray<{
    rightExclusive: false,
  }>,
  triggered?: (0 | 1),
})
