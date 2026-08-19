import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTInt } from 'sandstone'

export type JsonCompass = (JsonItemBase & {
  LodestoneDimension?: JsonRegistry['minecraft:dimension'],
  LodestonePos?: JsonLodestonePos,
  /**
   * Whether the compass should be linked to a lodestone.
   * When true, the compass will reset if the lodestone at the position is removed.
   */
  LodestoneTracked?: boolean,
})

export type JsonLodestonePos = {
  X?: (NBTInt | number),
  Y?: (NBTInt | number),
  Z?: (NBTInt | number),
}
