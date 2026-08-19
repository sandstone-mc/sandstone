import type {
  JsonDynamicCustomAction,
  JsonDynamicRunCommand,
} from 'sandstone/arguments/generated/_json/data/dialog/action.ts'
import type {
  JsonChangePage,
  JsonCopyToClipboard,
  JsonCustomAction,
  JsonOpenUrl,
  JsonRunCommand,
  JsonShowDialog,
  JsonSuggestCommand,
} from 'sandstone/arguments/generated/_json/util/text.ts'

type JsonDialogActionDispatcherMap = {
  'change_page': JsonDialogActionChangePage,
  'minecraft:change_page': JsonDialogActionChangePage,
  'copy_to_clipboard': JsonDialogActionCopyToClipboard,
  'minecraft:copy_to_clipboard': JsonDialogActionCopyToClipboard,
  'custom': JsonDialogActionCustom,
  'minecraft:custom': JsonDialogActionCustom,
  'dynamic/custom': JsonDialogActionDynamicCustom,
  'minecraft:dynamic/custom': JsonDialogActionDynamicCustom,
  'dynamic/run_command': JsonDialogActionDynamicRunCommand,
  'minecraft:dynamic/run_command': JsonDialogActionDynamicRunCommand,
  'open_url': JsonDialogActionOpenUrl,
  'minecraft:open_url': JsonDialogActionOpenUrl,
  'run_command': JsonDialogActionRunCommand,
  'minecraft:run_command': JsonDialogActionRunCommand,
  'show_dialog': JsonDialogActionShowDialog,
  'minecraft:show_dialog': JsonDialogActionShowDialog,
  'suggest_command': JsonDialogActionSuggestCommand,
  'minecraft:suggest_command': JsonDialogActionSuggestCommand,
}
type JsonDialogActionKeys = keyof JsonDialogActionDispatcherMap
type JsonDialogActionFallback = (
  | JsonDialogActionChangePage
  | JsonDialogActionCopyToClipboard
  | JsonDialogActionCustom
  | JsonDialogActionDynamicCustom
  | JsonDialogActionDynamicRunCommand
  | JsonDialogActionOpenUrl
  | JsonDialogActionRunCommand
  | JsonDialogActionShowDialog
  | JsonDialogActionSuggestCommand)
type JsonDialogActionChangePage = JsonChangePage
type JsonDialogActionCopyToClipboard = JsonCopyToClipboard
type JsonDialogActionCustom = JsonCustomAction
type JsonDialogActionDynamicCustom = JsonDynamicCustomAction
type JsonDialogActionDynamicRunCommand = JsonDynamicRunCommand
type JsonDialogActionOpenUrl = JsonOpenUrl
type JsonDialogActionRunCommand = JsonRunCommand
type JsonDialogActionShowDialog = JsonShowDialog
type JsonDialogActionSuggestCommand = JsonSuggestCommand
export type JsonSymbolDialogAction<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonDialogActionDispatcherMap
  : CASE extends 'keys' ? JsonDialogActionKeys : CASE extends '%fallback' ? JsonDialogActionFallback : never
