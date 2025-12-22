import type { FoxType } from 'sandstone/arguments/generated/world/component/entity.js'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'
import type { NBTIntArray, NBTLong } from 'sandstone'

export type Fox = (Breedable & {
  /**
     * List of trusted players.
     */
  Trusted?: Array<NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>>
  /**
     * Whether it is sleeping.
     */
  Sleeping?: boolean
  /**
     * The type of fox.
     *
     * Value:
     *
     *  - Red(`red`)
     *  - Snow(`snow`)
     */
  Type?: FoxType
  /**
     * Whether it is sitting.
     */
  Sitting?: boolean
  /**
     * Whether it is crouching.
     */
  Crouching?: boolean
})

export type TrustedUUID = {
  /**
     * Lower bits of the trusted player's UUID.
     */
  L?: NBTLong
  /**
     * Upper bits of the trusted player's UUID.
     */
  M?: NBTLong
}
