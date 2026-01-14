import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.ts'
import type { NBTInt } from 'sandstone'

export type Hoglin = (Breedable & {
  /**
     * Whether it will not transform to a zoglin when it is in the Overword.
     */
  IsImmuneToZombification?: boolean
  /**
     * Whether it cannot be hunted by piglins
     */
  CannotBeHunted?: boolean
  /**
     * The number of ticks it has been in the overworld.
     */
  TimeInOverworld?: NBTInt
})
