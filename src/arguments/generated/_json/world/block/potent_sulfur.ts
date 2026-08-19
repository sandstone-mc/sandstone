import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { NBTInt } from 'sandstone'

export type JsonPotentSulfur = (JsonBlockEntity & {
  /**
   * Time in seconds until the next state switch (between dormant and erupting). \
   * The timer only counts down when the potent sulfur creates a valid geyser. \
   * Negative values will be replaced with a new duration of the current state.
   */
  countdown?: (NBTInt | number),
})
