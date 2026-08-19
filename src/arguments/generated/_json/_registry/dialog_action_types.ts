import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONDIALOG_ACTION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONDIALOG_ACTION_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONDIALOG_ACTION_TYPES_SET>}`)

export const JSONDIALOG_ACTION_TYPES_SET = new Set([
  'change_page',
  'copy_to_clipboard',
  'custom',
  'dynamic/custom',
  'dynamic/run_command',
  'open_url',
  'run_command',
  'show_dialog',
  'suggest_command',
] as const)
