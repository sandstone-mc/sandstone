import type { DyeColorInt } from 'sandstone/arguments/generated/util/color.ts'
import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'

export type AttachFace = (0 | 1 | 2 | 3 | 4 | 5)

export type Shulker = (MobBase & {
  /**
   * Whether it is peeking.
   */
  Peek?: boolean
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
  AttachFace?: AttachFace
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
  Color?: (DyeColorInt | ShulkerColor)
})

export type ShulkerColor = (16)
