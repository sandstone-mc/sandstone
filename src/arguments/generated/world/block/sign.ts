import type { DyeColor } from 'sandstone/arguments/generated/util/color.ts'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block.ts'
import type { SignText } from 'sandstone/arguments/generated/world/component/block.ts'
import type { NBTList, NonEmptyString } from 'sandstone'

export type OldSign = (BlockEntity & {
  /**
   * Color the text has been dyed.
   *
   * Value:
   *
   *  - White(`white`)
   *  - Orange(`orange`)
   *  - Magenta(`magenta`)
   *  - LightBlue(`light_blue`)
   *  - Yellow(`yellow`)
   *  - Lime(`lime`)
   *  - Pink(`pink`)
   *  - Gray(`gray`)
   *  - LightGray(`light_gray`)
   *  - Cyan(`cyan`)
   *  - Purple(`purple`)
   *  - Blue(`blue`)
   *  - Brown(`brown`)
   *  - Green(`green`)
   *  - Red(`red`)
   *  - Black(`black`)
   */
  Color?: DyeColor,
  GlowingText?: boolean,
  /**
   * First line of text.
   */
  Text1?: NonEmptyString,
  /**
   * Second line of text.
   */
  Text2?: NonEmptyString,
  /**
   * Third line of text.
   */
  Text3?: NonEmptyString,
  /**
   * Fourth line of text.
   */
  Text4?: NonEmptyString,
})

export type Sign = (BlockEntity & {
  back_text?: SignText,
  front_text?: SignText,
  /**
   * Whether the sign has been made uneditable by applying wax.
   */
  is_waxed?: boolean,
  /**
   * Whether the sign allows following features:
   * 1. Resolving text components
   * 2. Executing click events
   *
   * Defaults to `false`.
   */
  allow_op_features?: boolean,
})
