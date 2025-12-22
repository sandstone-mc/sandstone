import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'
import type { NBTInt } from 'sandstone'

export type Rabbit = (Breedable & {
  /**
     * Value:
     *
     *  - Brown(`0`)
     *  - White(`1`)
     *  - Black(`2`)
     *  - BlackAndWhite(`3`)
     *  - Gold(`4`)
     *  - SaltAndPepper(`5`)
     *  - Killer(`99`)
     */
  RabbitType?: RabbitType
  /**
     * Ticks down once a carrot crop is eaten
     */
  MoreCarrotTicks?: NBTInt
})

export type RabbitType = (0 | 1 | 2 | 3 | 4 | 5 | 99)
