import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_WORLDGEN_STRUCTURES = (
  | NamespacedLiteralUnion<SetType<typeof TAG_WORLDGEN_STRUCTURES_SET>>
  | `minecraft:${SetType<typeof TAG_WORLDGEN_STRUCTURES_SET>}`)

export const TAG_WORLDGEN_STRUCTURES_SET = new Set([
  'cats_spawn_as_black',
  'cats_spawn_in',
  'dolphin_located',
  'eye_of_ender_located',
  'mineshaft',
  'ocean_ruin',
  'on_desert_village_maps',
  'on_jungle_explorer_maps',
  'on_ocean_explorer_maps',
  'on_plains_village_maps',
  'on_savanna_village_maps',
  'on_snowy_village_maps',
  'on_swamp_explorer_maps',
  'on_taiga_village_maps',
  'on_treasure_maps',
  'on_trial_chambers_maps',
  'on_woodland_explorer_maps',
  'ruined_portal',
  'shipwreck',
  'village',
] as const)
