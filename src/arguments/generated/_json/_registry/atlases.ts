import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONATLASES = (
  | NamespacedLiteralUnion<SetType<typeof JSONATLASES_SET>>
  | `minecraft:${SetType<typeof JSONATLASES_SET>}`)

export const JSONATLASES_SET = new Set([
  'banner_patterns',
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
] as const)
