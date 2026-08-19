import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTRIM_MATERIALS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTRIM_MATERIALS_SET>>
  | `minecraft:${SetType<typeof JSONTRIM_MATERIALS_SET>}`)

export const JSONTRIM_MATERIALS_SET = new Set([
  'amethyst',
  'copper',
  'diamond',
  'emerald',
  'gold',
  'iron',
  'lapis',
  'netherite',
  'quartz',
  'redstone',
  'resin',
] as const)
