import type { BlockEntity } from 'sandstone/arguments/generated/world/block.ts'
import type { NBTInt } from 'sandstone'

export type Comparator = (BlockEntity & {
  /**
   * Strength of the redstone output.
   */
  OutputSignal?: NBTInt,
})
