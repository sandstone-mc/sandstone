import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { NBTInt, NBTIntArray, NBTLong } from 'sandstone'

export type JsonEvokerFangs = (JsonEntityBase & {
  /**
   * Ticks until the fangs pop out of the ground.
   */
  Warmup?: (NBTInt | number),
  /**
   * Value:
   * Array length range: 4
   */
  Owner?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
})

export type JsonOwner = {
  /**
   * Upper bits of the owner's UUID.
   */
  OwnerUUIDMost?: (NBTLong | number),
  /**
   * Lower bits of the owner's UUID.
   */
  OwnerUUIDLeast?: (NBTLong | number),
}
