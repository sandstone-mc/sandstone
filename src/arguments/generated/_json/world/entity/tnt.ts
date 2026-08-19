import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { NBTFloat, NBTIntArray, NBTShort } from 'sandstone'

export type JsonTnt = (JsonEntityBase & {
  /**
   * Ticks until it explodes.
   */
  fuse?: (NBTShort | number),
  /**
   * Defaults to tnt.
   */
  block_state?: JsonBlockState,
  /**
   * Value:
   * Range: 0..128
   */
  explosion_power?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * The entity that primed this TNT.
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
