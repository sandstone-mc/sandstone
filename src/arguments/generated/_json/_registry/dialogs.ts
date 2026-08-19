import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONDIALOGS = (
  | NamespacedLiteralUnion<SetType<typeof JSONDIALOGS_SET>>
  | `minecraft:${SetType<typeof JSONDIALOGS_SET>}`)

export const JSONDIALOGS_SET = new Set([
  'custom_options',
  'quick_actions',
  'server_links',
] as const)
