import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonItemStackTemplate } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTInt } from 'sandstone'

export type JsonDialogBody = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:dialog_body_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolDialogBody ? JsonSymbolDialogBody[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:dialog_body_type'], string>])>

export type JsonItemBody = {
  item: JsonItemStackTemplate,
  /**
   * The description text rendered to the right of item.
   */
  description?: (JsonPlainMessage | JsonText),
  /**
   * Whether count and damage bar are rendered over the item.
   * Defaults to `true`.
   */
  show_decorations?: boolean,
  /**
   * Whether item tooltip shows up when the item is hovered.
   * Defaults to `true`.
   */
  show_tooltip?: boolean,
  /**
   * Width of the item.
   * Defaults to 16.
   *
   * Value:
   * Range: 1..256
   */
  width?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Height of the item.
   * Defaults to 16.
   *
   * Value:
   * Range: 1..256
   */
  height?: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonPlainMessage = {
  /**
   * A multiline label.
   * Click events in the text trigger `after_action` like any other action.
   */
  contents: JsonText,
  /**
   * Maximum width of message.
   * Defaults to 200.
   *
   * Value:
   * Range: 1..1024
   */
  width?: (NBTInt<{
    min: 1,
  }> | number),
}
type JsonDialogBodyDispatcherMap = {
  'item': JsonDialogBodyItem,
  'minecraft:item': JsonDialogBodyItem,
  'plain_message': JsonDialogBodyPlainMessage,
  'minecraft:plain_message': JsonDialogBodyPlainMessage,
}
type JsonDialogBodyKeys = keyof JsonDialogBodyDispatcherMap
type JsonDialogBodyFallback = (JsonDialogBodyItem | JsonDialogBodyPlainMessage)
type JsonDialogBodyItem = JsonItemBody
type JsonDialogBodyPlainMessage = JsonPlainMessage
export type JsonSymbolDialogBody<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonDialogBodyDispatcherMap
  : CASE extends 'keys' ? JsonDialogBodyKeys : CASE extends '%fallback' ? JsonDialogBodyFallback : never
