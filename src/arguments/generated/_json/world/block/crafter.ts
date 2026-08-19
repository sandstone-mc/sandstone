import type { JsonContainer9 } from 'sandstone/arguments/generated/_json/world/block/container.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type JsonCrafter = (JsonContainer9 & {
  crafting_ticks_remaining?: (NBTInt | number),
  /**
   * Value:
   * Array length range: ..9
   */
  disabled_slots?: NBTIntArray<{
    rightExclusive: false,
  }>,
  triggered?: (0 | 1),
})
