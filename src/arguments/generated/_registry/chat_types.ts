import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type CHAT_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof CHAT_TYPES_SET>>
  | `minecraft:${SetType<typeof CHAT_TYPES_SET>}`)

export const CHAT_TYPES_SET = new Set([
  'chat',
  'emote_command',
  'msg_command_incoming',
  'msg_command_outgoing',
  'say_command',
  'team_msg_command_incoming',
  'team_msg_command_outgoing',
] as const)
