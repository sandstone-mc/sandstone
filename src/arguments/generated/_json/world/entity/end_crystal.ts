import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type JsonBeamTarget = {
  X?: (NBTInt | number),
  Y?: (NBTInt | number),
  Z?: (NBTInt | number),
}

export type JsonEndCrystal = (JsonEntityBase & {
  /**
   * Whether to show the base of the end crystal.
   */
  ShowBottom?: boolean,
  /**
   * Coordinates that the beam is pointing to
   *
   * Value:
   * Array length range: 3
   */
  beam_target?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
})
