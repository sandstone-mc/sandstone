import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type DIALOG_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof DIALOG_TYPES_SET>>
  | `minecraft:${SetType<typeof DIALOG_TYPES_SET>}`)

export const DIALOG_TYPES_SET = new Set([
  'confirmation',
  'dialog_list',
  'multi_action',
  'notice',
  'server_links',
] as const)
