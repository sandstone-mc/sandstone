import type { DynamicCustomAction, DynamicRunCommand } from 'sandstone/arguments/generated/data/dialog/action.js'
import type {
    ChangePage,
    CopyToClipboard,
    CustomAction,
    OpenUrl,
    RunCommand,
    ShowDialog,
    SuggestCommand,
} from 'sandstone/arguments/generated/util/text.js'

type DialogActionDispatcherMap = {
    'change_page': DialogActionChangePage
    'minecraft:change_page': DialogActionChangePage
    'copy_to_clipboard': DialogActionCopyToClipboard
    'minecraft:copy_to_clipboard': DialogActionCopyToClipboard
    'custom': DialogActionCustom
    'minecraft:custom': DialogActionCustom
    'dynamic/custom': DialogActionDynamicCustom
    'minecraft:dynamic/custom': DialogActionDynamicCustom
    'dynamic/run_command': DialogActionDynamicRunCommand
    'minecraft:dynamic/run_command': DialogActionDynamicRunCommand
    'open_url': DialogActionOpenUrl
    'minecraft:open_url': DialogActionOpenUrl
    'run_command': DialogActionRunCommand
    'minecraft:run_command': DialogActionRunCommand
    'show_dialog': DialogActionShowDialog
    'minecraft:show_dialog': DialogActionShowDialog
    'suggest_command': DialogActionSuggestCommand
    'minecraft:suggest_command': DialogActionSuggestCommand
}
type DialogActionKeys = keyof DialogActionDispatcherMap
type DialogActionFallback = (
    | DialogActionChangePage
    | DialogActionCopyToClipboard
    | DialogActionCustom
    | DialogActionDynamicCustom
    | DialogActionDynamicRunCommand
    | DialogActionOpenUrl
    | DialogActionRunCommand
    | DialogActionShowDialog
    | DialogActionSuggestCommand)
type DialogActionChangePage = ChangePage
type DialogActionCopyToClipboard = CopyToClipboard
type DialogActionCustom = CustomAction
type DialogActionDynamicCustom = DynamicCustomAction
type DialogActionDynamicRunCommand = DynamicRunCommand
type DialogActionOpenUrl = OpenUrl
type DialogActionRunCommand = RunCommand
type DialogActionShowDialog = ShowDialog
type DialogActionSuggestCommand = SuggestCommand
export type SymbolDialogAction<CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
    ? DialogActionDispatcherMap
    : CASE extends 'keys' ? DialogActionKeys : CASE extends '%fallback' ? DialogActionFallback : never
