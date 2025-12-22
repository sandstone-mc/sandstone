import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { Text } from 'sandstone/arguments/generated/util/text.js'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.js'
import type { NBTInt } from 'sandstone'

export type DialogBody = ({
  [S in Extract<Registry['minecraft:dialog_body_type'], string>]?: ({
    type: S
  } & (S extends keyof Dispatcher<'minecraft:dialog_body'>
    ? Dispatcher<'minecraft:dialog_body'>[S]
    : Record<string, unknown>));
}[Registry['minecraft:dialog_body_type']])

export type ItemBody = {
  item: ItemStack
  /**
     * The description text rendered to the right of item.
     */
  description?: (PlainMessage | Text)
  /**
     * Whether count and damage bar are rendered over the item.
     * Defaults to `true`.
     */
  show_decorations?: boolean
  /**
     * Whether item tooltip shows up when the item is hovered.
     * Defaults to `true`.
     */
  show_tooltip?: boolean
  /**
     * Width of the item.
     * Defaults to 16.
     *
     * Value:
     * Range: 1..256
     */
  width?: NBTInt<{
    min: 1
  }>
  /**
     * Height of the item.
     * Defaults to 16.
     *
     * Value:
     * Range: 1..256
     */
  height?: NBTInt<{
    min: 1
  }>
}

export type PlainMessage = {
  /**
     * A multiline label.
     * Click events in the text trigger `after_action` like any other action.
     */
  contents: Text
  /**
     * Maximum width of message.
     * Defaults to 200.
     *
     * Value:
     * Range: 1..1024
     */
  width?: NBTInt<{
    min: 1
  }>
}
type DialogBodyDispatcherMap = {
  'item': DialogBodyItem
  'minecraft:item': DialogBodyItem
  'plain_message': DialogBodyPlainMessage
  'minecraft:plain_message': DialogBodyPlainMessage
}
type DialogBodyKeys = keyof DialogBodyDispatcherMap
type DialogBodyFallback = (DialogBodyItem | DialogBodyPlainMessage)
type DialogBodyItem = ItemBody
type DialogBodyPlainMessage = PlainMessage
export type SymbolDialogBody<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? DialogBodyDispatcherMap
  : CASE extends 'keys' ? DialogBodyKeys : CASE extends '%fallback' ? DialogBodyFallback : never
