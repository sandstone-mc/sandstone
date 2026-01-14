import type { BlockEntity } from 'sandstone/arguments/generated/world/block.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type Crafter = (BlockEntity & {
  crafting_ticks_remaining?: NBTInt
  /**
   * Value:
   * Array length range: ..9
   */
  disabled_slots?: NBTIntArray<{
    rightExclusive: false
  }>
  triggered?: (0 | 1)
})
