import type { DyeColorByte } from 'sandstone/arguments/generated/util/color.ts'
import type { DirectionByte } from 'sandstone/arguments/generated/util/direction.ts'
import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'

export type Shulker = (MobBase & {
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
  AttachFace?: DirectionByte,
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
  Color?: (DyeColorByte | ShulkerColor),
})

export type ShulkerColor = (16)
