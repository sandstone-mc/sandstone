import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type OUTGOING_RPC_METHODSES = (
  | NamespacedLiteralUnion<SetType<typeof OUTGOING_RPC_METHODSES_SET>>
  | `minecraft:${SetType<typeof OUTGOING_RPC_METHODSES_SET>}`)

export const OUTGOING_RPC_METHODSES_SET = new Set([
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
] as const)
