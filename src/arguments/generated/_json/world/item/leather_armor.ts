import type { JsonDisplay, JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTInt } from 'sandstone'

export type JsonColorDisplay = (JsonDisplay & {
  /**
   * Color of the armor.
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  color?: (NBTInt | number),
})

export type JsonLeatherArmor = (JsonItemBase & {
  display?: JsonColorDisplay,
})
