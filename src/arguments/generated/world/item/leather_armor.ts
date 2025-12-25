import type { Display, ItemBase } from 'sandstone/arguments/generated/world/item'
import type { NBTInt } from 'sandstone'

export type ColorDisplay = (Display & {
  /**
     * Color of the armor.
     * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
     */
  color?: NBTInt
})

export type LeatherArmor = (ItemBase & {
  display?: ColorDisplay
})
