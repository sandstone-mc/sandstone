import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONCHAT_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONCHAT_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONCHAT_TYPES_SET>}`)

export const JSONCHAT_TYPES_SET = new Set([
  'chat',
  'emote_command',
  'msg_command_incoming',
  'msg_command_outgoing',
  'say_command',
  'team_msg_command_incoming',
  'team_msg_command_outgoing',
] as const)
