import type { ClickAction } from 'sandstone/arguments/generated/data/dialog/action.ts'
import type { DialogBody } from 'sandstone/arguments/generated/data/dialog/body.ts'
import type { InputControl } from 'sandstone/arguments/generated/data/dialog/input.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTInt, NBTList, TagClass } from 'sandstone'

export type AfterAction = ('close' | 'none' | 'wait_for_response')

export type Button = {
  label: Text,
  tooltip?: Text,
  /**
   * Width of the button.
   * Defaults to 150.
   *
   * Value:
   * Range: 1..1024
   */
  width?: NBTInt<{
    min: 1,
  }>,
  /**
   * If not present, clicking button will simply close dialog without any action.
   */
  action?: ClickAction,
}

export type ButtonListDialogBase = (ListDialogBase & {
  /**
   * Width of buttons in the list.
   * Defaults to 150.
   *
   * Value:
   * Range: 1..
   */
  button_width?: NBTInt<{
    min: 1,
  }>,
})

export type ConfirmationDialog = (DialogBase & {
  yes: Button,
  /**
   * This action is also used for ESC-triggered exit.
   */
  no: Button,
})

export type Dialog = NonNullable<({
  [S in Extract<Registry['minecraft:dialog_type'], string>]?: ({
    type: S,
  } & (S extends keyof SymbolDialog ? SymbolDialog[S] : RootNBT))
}[Registry['minecraft:dialog_type']])>

export type DialogBase = {
  title: Text,
  /**
   * Name to be used for a button leading to this dialog.
   * If not present, `title` will be used instead.
   */
  external_title?: Text,
  body?: (DialogBody | Array<DialogBody>),
  inputs?: Array<InputControl>,
  /**
   * Whether the dialog can be closed with ESC key.
   * Defaults to `true`.
   */
  can_close_with_escape?: boolean,
  /**
   * Whether the dialog should pause the game in single-player mode.
   * Defaults to `true`.
   */
  pause?: boolean,
  /**
   * An additional operation performed on dialog after click or submit actions.
   * Defaults to `close`.
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
  after_action?: AfterAction,
}

export type ListDialogBase = (DialogBase & {
  /**
   * The button in footer.
   * The action is also used for ESC-triggered exit.
   */
  exit_action?: Button,
  /**
   * The number of columns.
   * Defaults to 2.
   *
   * Value:
   * Range: 1..
   */
  columns?: NBTInt<{
    min: 1,
  }>,
})

export type MultiActionDialog = (ListDialogBase & {
  /**
   * Value:
   * List length range: 1..
   */
  actions: NBTList<Button, {
    leftExclusive: false,
    min: 1,
  }>,
})

export type NoticeDialog = (DialogBase & {
  /**
   * The only action in footer.
   * Defaults to `gui.ok` label with no action or tooltip.
   */
  action?: Button,
})

export type RedirectDialog = (ButtonListDialogBase & {
  dialogs: (
      | Array<(Registry['minecraft:dialog'] | Dialog)> | (
      Registry['minecraft:dialog'] | `#${Registry['minecraft:tag/dialog']}` | TagClass<'dialog'>)
      | Dialog),
})

export type ServerLinksDialog = ButtonListDialogBase
type DialogDispatcherMap = {
  'confirmation': DialogConfirmation,
  'minecraft:confirmation': DialogConfirmation,
  'dialog_list': DialogDialogList,
  'minecraft:dialog_list': DialogDialogList,
  'multi_action': DialogMultiAction,
  'minecraft:multi_action': DialogMultiAction,
  'notice': DialogNotice,
  'minecraft:notice': DialogNotice,
  'server_links': DialogServerLinks,
  'minecraft:server_links': DialogServerLinks,
}
type DialogKeys = keyof DialogDispatcherMap
type DialogFallback = (DialogConfirmation | DialogDialogList | DialogMultiAction | DialogNotice | DialogServerLinks)
type DialogConfirmation = ConfirmationDialog
type DialogDialogList = RedirectDialog
type DialogMultiAction = MultiActionDialog
type DialogNotice = NoticeDialog
type DialogServerLinks = ServerLinksDialog
export type SymbolDialog<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? DialogDispatcherMap
  : CASE extends 'keys' ? DialogKeys : CASE extends '%fallback' ? DialogFallback : never
