type JsonMcdocDialogAfterActionDispatcherMap = {
  'close': JsonMcdocDialogAfterActionClose,
  'minecraft:close': JsonMcdocDialogAfterActionClose,
  'none': JsonMcdocDialogAfterActionNone,
  'minecraft:none': JsonMcdocDialogAfterActionNone,
  'wait_for_response': JsonMcdocDialogAfterActionWaitForResponse,
  'minecraft:wait_for_response': JsonMcdocDialogAfterActionWaitForResponse,
}
type JsonMcdocDialogAfterActionKeys = keyof JsonMcdocDialogAfterActionDispatcherMap
type JsonMcdocDialogAfterActionFallback = (
  | JsonMcdocDialogAfterActionClose
  | JsonMcdocDialogAfterActionNone
  | JsonMcdocDialogAfterActionWaitForResponse)
type JsonMcdocDialogAfterActionNoneType = {
  /**
   * Whether the dialog should pause the game in single-player mode.
   * Defaults to `true`.
   */
  pause?: boolean,
}
type JsonMcdocDialogAfterActionClose = {
  /**
   * Whether the dialog should pause the game in single-player mode.
   * Defaults to `true`.
   */
  pause?: boolean,
}
type JsonMcdocDialogAfterActionNone = {
  /**
   * Whether the dialog should pause the game in single-player mode.
   * Defaults to `true`.
   *
   * The currently selected `after_action` only supports the value `false`
   */
  pause: false,
}
type JsonMcdocDialogAfterActionWaitForResponse = {
  /**
   * Whether the dialog should pause the game in single-player mode.
   * Defaults to `true`.
   */
  pause?: boolean,
}
export type JsonSymbolMcdocDialogAfterAction<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMcdocDialogAfterActionDispatcherMap
  : CASE extends 'keys'
    ? JsonMcdocDialogAfterActionKeys
    : CASE extends '%fallback'
      ? JsonMcdocDialogAfterActionFallback
      : CASE extends '%none' ? JsonMcdocDialogAfterActionNoneType : never
