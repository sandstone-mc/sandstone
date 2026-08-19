import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'
import type { NBTInt } from 'sandstone'

export type JsonRabbit = (JsonBreedable & {
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
  RabbitType?: JsonRabbitType,
  /**
   * Ticks down once a carrot crop is eaten
   */
  MoreCarrotTicks?: (NBTInt | number),
})

export type JsonRabbitType = (0 | 1 | 2 | 3 | 4 | 5 | 99)
