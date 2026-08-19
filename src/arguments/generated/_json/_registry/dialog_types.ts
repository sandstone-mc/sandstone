import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONDIALOG_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONDIALOG_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONDIALOG_TYPES_SET>}`)

export const JSONDIALOG_TYPES_SET = new Set([
  'confirmation',
  'dialog_list',
  'multi_action',
  'notice',
  'server_links',
] as const)
