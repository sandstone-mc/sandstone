import type { JsonFoxType } from 'sandstone/arguments/generated/_json/world/component/entity.ts'
import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'
import type { NBTIntArray, NBTLong } from 'sandstone'

export type JsonFox = (JsonBreedable & {
  /**
   * List of trusted players.
   */
  Trusted?: Array<NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>>,
  /**
   * Whether it is sleeping.
   */
  Sleeping?: boolean,
  /**
   * The type of fox.
   *
   * Value:
   *
   *  - Red(`red`)
   *  - Snow(`snow`)
   */
  Type?: JsonFoxType,
  /**
   * Whether it is sitting.
   */
  Sitting?: boolean,
  /**
   * Whether it is crouching.
   */
  Crouching?: boolean,
})

export type JsonTrustedUUID = {
  /**
   * Lower bits of the trusted player's UUID.
   */
  L?: (NBTLong | number),
  /**
   * Upper bits of the trusted player's UUID.
   */
  M?: (NBTLong | number),
}
