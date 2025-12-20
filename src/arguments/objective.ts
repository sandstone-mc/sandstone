import type { ObjectiveClass } from 'sandstone/variables'
import { DyeColor } from './generated/util/color.js'
import { SetType } from 'sandstone/utils.js'
import { ITEMS_SET } from './generated/_registry/items.js'
import { CUSTOM_STATS_SET } from './generated/_registry/custom_stats.js'
import { ENTITY_TYPES_SET } from './generated/_registry/entity_types.js'
import { BLOCK_TYPES_SET } from './generated/_registry/block_types.js'

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
  `teamKill.${DyeColor}` |
  `minecraft.${'broken' | 'crafted' | 'dropped' | 'picked_up' | 'used'}:minecraft.${SetType<typeof ITEMS_SET>}` |
  `minecraft.custom:minecraft.${SetType<typeof CUSTOM_STATS_SET>}` |
  `minecraft.${'killed' | 'killed_by'}:minecraft.${SetType<typeof ENTITY_TYPES_SET>}` |
  `minecraft.mined:minecraft:${SetType<typeof BLOCK_TYPES_SET>}`
)