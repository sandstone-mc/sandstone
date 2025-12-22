import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type DIALOG_ACTION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof DIALOG_ACTION_TYPES_SET>>
  | `minecraft:${SetType<typeof DIALOG_ACTION_TYPES_SET>}`)

export const DIALOG_ACTION_TYPES_SET = new Set([
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
