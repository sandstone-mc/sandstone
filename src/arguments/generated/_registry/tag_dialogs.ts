import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_DIALOGS = (
  | NamespacedLiteralUnion<SetType<typeof TAG_DIALOGS_SET>>
  | `minecraft:${SetType<typeof TAG_DIALOGS_SET>}`)

export const TAG_DIALOGS_SET = new Set([
    'pause_screen_additions',
    'quick_actions',
] as const)
