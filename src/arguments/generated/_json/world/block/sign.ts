import type { JsonDyeColor } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonSignText } from 'sandstone/arguments/generated/_json/world/component/block.ts'
import type { JsonNBTList, NonEmptyString } from 'sandstone'

export type JsonOldSign = (JsonBlockEntity & {
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
  Color?: JsonDyeColor,
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

export type JsonSign = (JsonBlockEntity & {
  back_text?: JsonSignText,
  front_text?: JsonSignText,
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
