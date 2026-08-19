import type { JsonClickAction } from 'sandstone/arguments/generated/_json/data/dialog/action.ts'
import type { JsonDialogBody } from 'sandstone/arguments/generated/_json/data/dialog/body.ts'
import type { JsonInputControl } from 'sandstone/arguments/generated/_json/data/dialog/input.ts'
import type { JsonSymbolMcdocDialogAfterAction } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { DialogClass, JsonNBTList, NBTInt, TagClass } from 'sandstone'

export type JsonAfterAction = ('close' | 'none' | 'wait_for_response')

export type JsonButton = {
  label: JsonText,
  tooltip?: JsonText,
  /**
   * Width of the button.
   * Defaults to 150.
   *
   * Value:
   * Range: 1..1024
   */
  width?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * If not present, clicking button will simply close dialog without any action.
   */
  action?: JsonClickAction,
}

export type JsonButtonListDialogBase = (JsonListDialogBase & {
  /**
   * Width of buttons in the list.
   * Defaults to 150.
   *
   * Value:
   * Range: 1..
   */
  button_width?: (NBTInt<{
    min: 1,
  }> | number),
})

export type JsonConfirmationDialog = (JsonDialogBase & {
  yes: JsonButton,
  /**
   * This action is also used for ESC-triggered exit.
   */
  no: JsonButton,
})

export type JsonDialog = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:dialog_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolDialog ? JsonSymbolDialog[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:dialog_type'], string>])>

export type JsonDialogBase = NonNullable<({
  [S in Extract<Extract<JsonAfterAction, string>, string>]?: ({
    title: JsonText,
    /**
     * Name to be used for a button leading to this dialog.
     * If not present, `title` will be used instead.
     */
    external_title?: JsonText,
    body?: (JsonDialogBody | Array<JsonDialogBody>),
    inputs?: Array<JsonInputControl>,
    /**
     * Whether the dialog can be closed with ESC key.
     * Defaults to `true`.
     */
    can_close_with_escape?: boolean,
    /**
     * An additional operation performed on dialog after click or submit actions.
     * Defaults to `close`. \
     * Value `none` requires `pause` set to `false`.
     *
     * Value:
     *
     *  - Close(`close`):
     *    Closes the dialog.
     *    Returns to the previous non-dialog screen, if any.
     *  - None(`none`):
     *    Does nothing.
     *    Only available if `pause` is set to `false`.
     *  - WaitForResponse(`wait_for_response`):
     *    Replaces the dialog with a "Waiting for Response" screen.
     *    The waiting screen unpauses the game in single-player mode.
     */
    after_action?: S,
  } & (S extends undefined
    ? JsonSymbolMcdocDialogAfterAction<'%none'> :
    (S extends keyof JsonSymbolMcdocDialogAfterAction ? JsonSymbolMcdocDialogAfterAction[S] : JsonRootNBT)))
}[Extract<JsonAfterAction, string>])>

export type JsonDialogListRef = (
  | JsonDialog | (
  JsonRegistry['minecraft:dialog'] | `#${JsonRegistry['minecraft:tag/dialog']}` | TagClass<'dialog'> | DialogClass)
  | Array<((JsonRegistry['minecraft:dialog'] | DialogClass) | JsonDialog)>)

export type JsonListDialogBase = (JsonDialogBase & {
  /**
   * The button in footer.
   * The action is also used for ESC-triggered exit.
   */
  exit_action?: JsonButton,
  /**
   * The number of columns.
   * Defaults to 2.
   *
   * Value:
   * Range: 1..
   */
  columns?: (NBTInt<{
    min: 1,
  }> | number),
})

export type JsonMultiActionDialog = (JsonListDialogBase & {
  /**
   * Value:
   * List length range: 1..
   */
  actions: JsonNBTList<JsonButton, {
    leftExclusive: false,
    min: 1,
  }>,
})

export type JsonNoticeDialog = (JsonDialogBase & {
  /**
   * The only action in footer.
   * Defaults to `gui.ok` label with no action or tooltip.
   */
  action?: JsonButton,
})

export type JsonRedirectDialog = (JsonButtonListDialogBase & {
  dialogs: JsonDialogListRef,
})

export type JsonServerLinksDialog = JsonButtonListDialogBase
type JsonDialogDispatcherMap = {
  'confirmation': JsonDialogConfirmation,
  'minecraft:confirmation': JsonDialogConfirmation,
  'dialog_list': JsonDialogDialogList,
  'minecraft:dialog_list': JsonDialogDialogList,
  'multi_action': JsonDialogMultiAction,
  'minecraft:multi_action': JsonDialogMultiAction,
  'notice': JsonDialogNotice,
  'minecraft:notice': JsonDialogNotice,
  'server_links': JsonDialogServerLinks,
  'minecraft:server_links': JsonDialogServerLinks,
}
type JsonDialogKeys = keyof JsonDialogDispatcherMap
type JsonDialogFallback = (
  | JsonDialogConfirmation
  | JsonDialogDialogList
  | JsonDialogMultiAction
  | JsonDialogNotice
  | JsonDialogServerLinks)
type JsonDialogConfirmation = JsonConfirmationDialog
type JsonDialogDialogList = JsonRedirectDialog
type JsonDialogMultiAction = JsonMultiActionDialog
type JsonDialogNotice = JsonNoticeDialog
type JsonDialogServerLinks = JsonServerLinksDialog
export type JsonSymbolDialog<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonDialogDispatcherMap
  : CASE extends 'keys' ? JsonDialogKeys : CASE extends '%fallback' ? JsonDialogFallback : never
