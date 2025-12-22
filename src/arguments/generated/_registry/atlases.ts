import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type ATLASES = (
  | NamespacedLiteralUnion<SetType<typeof ATLASES_SET>>
  | `minecraft:${SetType<typeof ATLASES_SET>}`)

export const ATLASES_SET = new Set([
  'armor_trims',
  'banner_patterns',
  'beds',
  'blocks',
  'celestials',
  'chests',
  'decorated_pot',
  'gui',
  'items',
  'map_decorations',
  'paintings',
  'particles',
  'shield_patterns',
  'shulker_boxes',
  'signs',
] as const)
