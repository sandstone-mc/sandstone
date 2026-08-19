import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { NBTIntArray, NBTLong } from 'sandstone'

export type JsonConduit = (JsonBlockEntity & {
  /**
   * The hostile mob that the conduit is currently attacking.
   *
   * Value:
   * Array length range: 4
   */
  Target?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
})

export type JsonTargetUuid = {
  /**
   * Upper bits of the target's UUID
   */
  M?: (NBTLong | number),
  /**
   * Lower bits of the target's UUID
   */
  L?: (NBTLong | number),
}
