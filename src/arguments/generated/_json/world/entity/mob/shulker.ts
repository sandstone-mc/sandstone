import type { JsonDyeColorByte } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonDirectionByte } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'

export type JsonShulker = (JsonMobBase & {
  /**
   * Whether it is peeking.
   */
  Peek?: boolean,
  /**
   * Which face it is attached to.
   *
   * Value:
   *
   *  - Down(`0`)
   *  - Up(`1`)
   *  - North(`2`)
   *  - South(`3`)
   *  - West(`4`)
   *  - East(`5`)
   */
  AttachFace?: JsonDirectionByte,
  /**
   * Value:
   * *either*
   *
   *
   *
   * *or*
   *
   *
   */
  Color?: (JsonDyeColorByte | JsonShulkerColor),
})

export type JsonShulkerColor = (16)
