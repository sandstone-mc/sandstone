import type { BlockEntity } from 'sandstone/arguments/generated/world/block.js'
import type { NBTIntArray, NBTLong } from 'sandstone'

export type Conduit = (BlockEntity & {
  /**
     * The hostile mob that the conduit is currently attacking.
     *
     * Value:
     * Array length range: 4
     */
  Target?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
})

export type TargetUuid = {
  /**
     * Upper bits of the target's UUID
     */
  M?: NBTLong
  /**
     * Lower bits of the target's UUID
     */
  L?: NBTLong
}
