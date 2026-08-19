import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTAG_DIALOGS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTAG_DIALOGS_SET>>
  | `minecraft:${SetType<typeof JSONTAG_DIALOGS_SET>}`)

export const JSONTAG_DIALOGS_SET = new Set([
  'pause_screen_additions',
  'quick_actions',
] as const)
