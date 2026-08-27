import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_WORLDGEN_STRUCTURES = (
  | NamespacedLiteralUnion<SetType<typeof TAG_WORLDGEN_STRUCTURES_SET>>
  | `minecraft:${SetType<typeof TAG_WORLDGEN_STRUCTURES_SET>}`)

export const TAG_WORLDGEN_STRUCTURES_SET = new Set([
  'abandoned_camp',
  'cats_spawn_as_black',
  'cats_spawn_in',
  'dolphin_located',
  'eye_of_ender_located',
  'mineshaft',
  'ocean_ruin',
  'on_abandoned_camp_bamboo_jungle',
  'on_abandoned_camp_birch_forest',
  'on_abandoned_camp_cherry_grove',
  'on_abandoned_camp_dappled_forest',
  'on_abandoned_camp_flower_forest',
  'on_abandoned_camp_pale_garden',
  'on_abandoned_camp_swamp',
  'on_abandoned_camp_windswept',
  'on_ancient_city_maps',
  'on_buried_trial_chambers_maps',
  'on_desert_pyramid_maps',
  'on_desert_village_maps',
  'on_jungle_pyramid_maps',
  'on_mineshaft_maps',
  'on_ocean_monument_maps',
  'on_ocean_ruin_warm_maps',
  'on_plains_village_maps',
  'on_savanna_village_maps',
  'on_snowy_village_maps',
  'on_swamp_hut_maps',
  'on_taiga_village_maps',
  'on_treasure_maps',
  'on_woodland_mansion_maps',
  'ruined_portal',
  'shipwreck',
  'village',
] as const)
