import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type DIALOGS = (
    | NamespacedLiteralUnion<SetType<typeof DIALOGS_SET>>
    | `minecraft:${SetType<typeof DIALOGS_SET>}`)

export const DIALOGS_SET = new Set([
    'custom_options',
    'quick_actions',
    'server_links',
] as const)
