import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONMAP_DECORATION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONMAP_DECORATION_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONMAP_DECORATION_TYPES_SET>}`)

export const JSONMAP_DECORATION_TYPES_SET = new Set([
  'abandoned_camp',
  'ancient_city',
  'banner_black',
  'banner_blue',
  'banner_brown',
  'banner_cyan',
  'banner_gray',
  'banner_green',
  'banner_light_blue',
  'banner_light_gray',
  'banner_lime',
  'banner_magenta',
  'banner_orange',
  'banner_pink',
  'banner_purple',
  'banner_red',
  'banner_white',
  'banner_yellow',
  'blue_marker',
  'desert_pyramid',
  'frame',
  'jungle_temple',
  'mansion',
  'mineshaft',
  'monument',
  'ocean_ruin_warm',
  'player',
  'player_off_limits',
  'player_off_map',
  'red_marker',
  'red_x',
  'swamp_hut',
  'target_point',
  'target_x',
  'trial_chambers',
  'village_desert',
  'village_plains',
  'village_savanna',
  'village_snowy',
  'village_taiga',
] as const)
