import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTInt } from 'sandstone'

export type Compass = (ItemBase & {
  LodestoneDimension?: Registry['minecraft:dimension']
  LodestonePos?: LodestonePos
  /**
     * Whether the compass should be linked to a lodestone.
     * When true, the compass will reset if the lodestone at the position is removed.
     */
  LodestoneTracked?: boolean
})

export type LodestonePos = {
  X?: NBTInt
  Y?: NBTInt
  Z?: NBTInt
}
