type McdocDialogAfterActionDispatcherMap = {
  'close': McdocDialogAfterActionClose,
  'minecraft:close': McdocDialogAfterActionClose,
  'none': McdocDialogAfterActionNone,
  'minecraft:none': McdocDialogAfterActionNone,
  'wait_for_response': McdocDialogAfterActionWaitForResponse,
  'minecraft:wait_for_response': McdocDialogAfterActionWaitForResponse,
}
type McdocDialogAfterActionKeys = keyof McdocDialogAfterActionDispatcherMap
type McdocDialogAfterActionFallback = (
  | McdocDialogAfterActionClose
  | McdocDialogAfterActionNone
  | McdocDialogAfterActionWaitForResponse)
type McdocDialogAfterActionNoneType = {
  /**
   * Whether the dialog should pause the game in single-player mode.
   * Defaults to `true`.
   */
  pause?: boolean,
}
type McdocDialogAfterActionClose = {
  /**
   * Whether the dialog should pause the game in single-player mode.
   * Defaults to `true`.
   */
  pause?: boolean,
}
type McdocDialogAfterActionNone = {
  /**
   * Whether the dialog should pause the game in single-player mode.
   * Defaults to `true`.
   *
   * The currently selected `after_action` only supports the value `false`
   */
  pause: false,
}
type McdocDialogAfterActionWaitForResponse = {
  /**
   * Whether the dialog should pause the game in single-player mode.
   * Defaults to `true`.
   */
  pause?: boolean,
}
export type SymbolMcdocDialogAfterAction<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? McdocDialogAfterActionDispatcherMap
  : CASE extends 'keys'
    ? McdocDialogAfterActionKeys
    : CASE extends '%fallback'
      ? McdocDialogAfterActionFallback
      : CASE extends '%none' ? McdocDialogAfterActionNoneType : never
