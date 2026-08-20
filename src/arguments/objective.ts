import type { ObjectiveClass } from 'sandstone/variables'
import type { DyeColor } from './generated/util/color'
import type { SetType } from 'sandstone/utils'
import type { ITEMS_SET } from './generated/_registry/items'
import type { CUSTOM_STATS_SET } from './generated/_registry/custom_stats'
import type { ENTITY_TYPES_SET } from './generated/_registry/entity_types'
import { BLOCKS_SET } from './generated/registry-sets'

export type ObjectiveArgument = string | ObjectiveClass

export type OBJECTIVE_CRITERIA = (
  'air' |
  'armor' |
  'deathCount' |
  'dummy' |
  'food' |
  'health' |
  'level' |
  'playerKillCount' |
  'totalKillCount' |
  'trigger' |
  'xp' |
  `killedByTeam.${DyeColor}` |
  `teamkill.${DyeColor}` |
  `minecraft.${'broken' | 'crafted' | 'dropped' | 'picked_up' | 'used'}:minecraft.${SetType<typeof ITEMS_SET>}` |
  `minecraft.custom:minecraft.${SetType<typeof CUSTOM_STATS_SET>}` |
  `minecraft.${'killed' | 'killed_by'}:minecraft.${SetType<typeof ENTITY_TYPES_SET>}` |
  `minecraft.mined:minecraft:${SetType<typeof BLOCKS_SET>}`
)
