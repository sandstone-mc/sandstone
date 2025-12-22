import type { DyeColor } from 'sandstone/arguments/generated/util/color.js'
import type { Text } from 'sandstone/arguments/generated/util/text.js'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block.js'
import type { NBTList } from 'sandstone'

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
  Color?: DyeColor
  GlowingText?: boolean
  /**
     * First line of text.
     */
  Text1?: `${any}${string}`
  /**
     * Second line of text.
     */
  Text2?: `${any}${string}`
  /**
     * Third line of text.
     */
  Text3?: `${any}${string}`
  /**
     * Fourth line of text.
     */
  Text4?: `${any}${string}`
})

export type Sign = (BlockEntity & {
  back_text?: SignText
  front_text?: SignText
  /**
     * Whether the sign has been made uneditable by applying wax.
     */
  is_waxed?: boolean
})

/**
 * List length range: 4
 */
export type SignLines = NBTList<Text, {
  leftExclusive: false
  rightExclusive: false
  min: 4
  max: 4
}>

export type SignText = {
  messages: SignLines
  /**
     * Shown to players with the profanity filter enabled on Realms.
     */
  filtered_messages?: SignLines
  /**
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
  color?: DyeColor
  has_glowing_text?: boolean
}
