import type { BlockEntity } from 'sandstone/arguments/generated/world/block.ts'
import type { NBTInt, NBTIntArray, NBTLong } from 'sandstone'

export type EndGateway = (BlockEntity & {
  /**
     * In game ticks.
     */
  Age?: NBTLong
  /**
     * Whether to teleport to the exact location.
     */
  ExactTeleport?: boolean
  /**
     * Coordinates of where to teleport entities to.
     *
     * Value:
     * Array length range: 3
     */
  exit_portal?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
})

export type ExitPortal = {
  X?: NBTInt
  Y?: NBTInt
  Z?: NBTInt
}
