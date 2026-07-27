import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type OUTGOING_RPC_METHODS = (
  | NamespacedLiteralUnion<SetType<typeof OUTGOING_RPC_METHODS_SET>>
  | `minecraft:${SetType<typeof OUTGOING_RPC_METHODS_SET>}`)

export const OUTGOING_RPC_METHODS_SET = new Set([
  'notification/allowlist/added',
  'notification/allowlist/removed',
  'notification/bans/added',
  'notification/bans/removed',
  'notification/gamerules/updated',
  'notification/ip_bans/added',
  'notification/ip_bans/removed',
  'notification/operators/added',
  'notification/operators/removed',
  'notification/players/joined',
  'notification/players/left',
  'notification/server/activity',
  'notification/server/saved',
  'notification/server/saving',
  'notification/server/started',
  'notification/server/status',
  'notification/server/stopping',
  'notification/world/upgrade_failed',
  'notification/world/upgrade_finished',
  'notification/world/upgrade_progress',
  'notification/world/upgrade_started',
] as const)
