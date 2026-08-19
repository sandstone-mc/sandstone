import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_STRUCTURE_SETS = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_STRUCTURE_SETS_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_STRUCTURE_SETS_SET>}`)

export const JSONWORLDGEN_STRUCTURE_SETS_SET = new Set([
  'abandoned_camp',
  'ancient_cities',
  'buried_treasures',
  'desert_pyramids',
  'end_cities',
  'igloos',
  'jungle_temples',
  'mineshafts',
  'nether_complexes',
  'nether_fossils',
  'ocean_monuments',
  'ocean_ruins',
  'pillager_outposts',
  'ruined_portals',
  'shipwrecks',
  'strongholds',
  'swamp_huts',
  'trail_ruins',
  'trial_chambers',
  'villages',
  'woodland_mansions',
] as const)
