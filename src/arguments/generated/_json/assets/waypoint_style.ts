import type { JsonNBTList, NamespacedString, NBTInt } from 'sandstone'

export type JsonWaypointStyle = {
  /**
   * Defaults to 128.
   *
   * Value:
   * Range: 0..60000000
   */
  near_distance?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Defaults to 322.
   *
   * Value:
   * Range: 0..60000000
   */
  far_distance?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * List length range: 1..
   */
  sprites: JsonNBTList<NamespacedString, {
    leftExclusive: false,
    min: 1,
  }>,
}
