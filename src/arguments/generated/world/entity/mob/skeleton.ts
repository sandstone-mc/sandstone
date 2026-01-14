import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type Skeleton = (MobBase & {
  /**
   * Time until it converts to a stray.
   */
  StrayConversionTime?: NBTInt
})
