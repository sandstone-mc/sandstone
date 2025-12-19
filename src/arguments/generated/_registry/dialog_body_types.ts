import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type DIALOG_BODY_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof DIALOG_BODY_TYPES_SET>>
  | `minecraft:${SetType<typeof DIALOG_BODY_TYPES_SET>}`)

export const DIALOG_BODY_TYPES_SET = new Set([
    'item',
    'plain_message',
] as const)
