import type { EntityBase } from 'sandstone/arguments/generated/world/entity'
import type { NBTInt, NBTIntArray, NBTLong } from 'sandstone'

export type EvokerFangs = (EntityBase & {
  /**
     * Ticks until the fangs pop out of the ground.
     */
  Warmup?: NBTInt
  /**
     * Value:
     * Array length range: 4
     */
  Owner?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
})

export type Owner = {
  /**
     * Upper bits of the owner's UUID.
     */
  OwnerUUIDMost?: NBTLong
  /**
     * Lower bits of the owner's UUID.
     */
  OwnerUUIDLeast?: NBTLong
}
