import type { BlockEntity } from 'sandstone/arguments/generated/world/block'
import type { NBTInt } from 'sandstone'

export type Comparator = (BlockEntity & {
  /**
     * Strength of the redstone output.
     */
  OutputSignal?: NBTInt
})
