import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { NBTInt } from 'sandstone'

export type JsonComparator = (JsonBlockEntity & {
  /**
   * Strength of the redstone output.
   */
  OutputSignal?: (NBTInt | number),
})
