import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type JsonSkeleton = (JsonMobBase & {
  /**
   * Time until it converts to a stray.
   */
  StrayConversionTime?: (NBTInt | number),
})
