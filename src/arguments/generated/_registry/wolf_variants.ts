import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WOLF_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof WOLF_VARIANTS_SET>>
  | `minecraft:${SetType<typeof WOLF_VARIANTS_SET>}`)

export const WOLF_VARIANTS_SET = new Set([
  'ashen',
  'black',
  'chestnut',
  'pale',
  'rusty',
  'snowy',
  'spotted',
  'striped',
  'woods',
] as const)
