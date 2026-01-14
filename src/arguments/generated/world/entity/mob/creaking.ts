import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt, NBTList } from 'sandstone'

export type Creaking = (MobBase & {
  /**
   * The creaking heart block that this is linked to.
   *
   * Value:
   * List length range: 3
   */
  home_pos?: NBTList<NBTInt, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
})
