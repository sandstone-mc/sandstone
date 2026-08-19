import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { NBTInt, NBTIntArray, NBTLong } from 'sandstone'

export type JsonEndGateway = (JsonBlockEntity & {
  /**
   * In game ticks.
   */
  Age?: (NBTLong | number),
  /**
   * Whether to teleport to the exact location.
   */
  ExactTeleport?: boolean,
  /**
   * Coordinates of where to teleport entities to.
   *
   * Value:
   * Array length range: 3
   */
  exit_portal?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
})

export type JsonExitPortal = {
  X?: (NBTInt | number),
  Y?: (NBTInt | number),
  Z?: (NBTInt | number),
}
