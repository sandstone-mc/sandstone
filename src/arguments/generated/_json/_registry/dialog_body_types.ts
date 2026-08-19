import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONDIALOG_BODY_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONDIALOG_BODY_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONDIALOG_BODY_TYPES_SET>}`)

export const JSONDIALOG_BODY_TYPES_SET = new Set([
  'item',
  'plain_message',
] as const)
