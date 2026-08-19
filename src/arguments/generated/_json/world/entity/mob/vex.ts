import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type JsonVex = (JsonMobBase & {
  /**
   * Coordinates of the center of its wander bounds.
   *
   * Value:
   * Array length range: 3
   */
  bound_pos?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Ticks until it starts to die.
   */
  life_ticks?: (NBTInt | number),
  /**
   * The owner of this vex.
   *
   * Value:
   * Array length range: 4
   */
  owner?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
})
